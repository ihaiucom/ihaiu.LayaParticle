//class fairygui.UIPackage
var UIPackage=(function(){
	var AtlasSprite;
	function UIPackage(){
		this._id=null;
		this._name=null;
		this._items=null;
		this._itemsById=null;
		this._itemsByName=null;
		this._customId=null;
		this._sprites=null;
		this._items=[];
		this._itemsById={};
		this._itemsByName={};
		this._sprites={};
	}

	__class(UIPackage,'fairygui.UIPackage');
	var __proto=UIPackage.prototype;
	__proto.loadPackage=function(buffer,resKey){
		if (buffer.getUint32()!=0x46475549)
			throw new Error("FairyGUI: old package format found in '"+resKey+"'");
		buffer.version=buffer.getInt32();
		var compressed=buffer.readBool();
		this._id=buffer.readUTFString();
		this._name=buffer.readUTFString();
		buffer.skip(20);
		if(compressed){
			var buf=new Uint8Array(buffer.buffer,buffer.pos,buffer.length-buffer.pos);
			var inflater=new Zlib.RawInflate(buf);buf=inflater.decompress();;
			buffer=new ByteBuffer(buf);
		};
		var indexTablePos=buffer.pos;
		var cnt=0;
		var i=0;
		var nextPos=0;
		buffer.seek(indexTablePos,4);
		cnt=buffer.getInt32();
		var stringTable=__newvec(cnt);
		for (i=0;i < cnt;i++)
		stringTable[i]=buffer.readUTFString();
		buffer.stringTable=stringTable;
		buffer.seek(indexTablePos,1);
		var pi;
		resKey=resKey+"_";
		cnt=buffer.getUint16();
		for (i=0;i < cnt;i++){
			nextPos=buffer.getInt32();
			nextPos+=buffer.pos;
			pi=new PackageItem();
			pi.owner=this;
			pi.type=buffer.readByte();
			pi.id=buffer.readS();
			pi.name=buffer.readS();
			buffer.readS();
			pi.file=buffer.readS();
			buffer.readBool();
			pi.width=buffer.getInt32();
			pi.height=buffer.getInt32();
			switch (pi.type){
				case 0:{
						pi.objectType=0;
						var scaleOption=buffer.readByte();
						if (scaleOption==1){
							pi.scale9Grid=new laya.maths.Rectangle();
							pi.scale9Grid.x=buffer.getInt32();
							pi.scale9Grid.y=buffer.getInt32();
							pi.scale9Grid.width=buffer.getInt32();
							pi.scale9Grid.height=buffer.getInt32();
							pi.tileGridIndice=buffer.getInt32();
						}
						else if (scaleOption==2)
						pi.scaleByTile=true;
						pi.smoothing=buffer.readBool();
						break ;
					}
				case 1:{
						pi.smoothing=buffer.readBool();
						pi.objectType=1;
						pi.rawData=buffer.readBuffer();
						break ;
					}
				case 5:{
						pi.rawData=buffer.readBuffer();
						break ;
					}
				case 3:{
						var extension=buffer.readByte();
						if (extension > 0)
							pi.objectType=extension;
						else
						pi.objectType=9;
						pi.rawData=buffer.readBuffer();
						UIObjectFactory.resolvePackageItemExtension(pi);
						break ;
					}
				case 4:
				case 2:
				case 7:{
						pi.file=resKey+pi.file;
						break ;
					}
				}
			this._items.push(pi);
			this._itemsById[pi.id]=pi;
			if (pi.name !=null)
				this._itemsByName[pi.name]=pi;
			buffer.pos=nextPos;
		}
		buffer.seek(indexTablePos,2);
		cnt=buffer.getUint16();
		for (i=0;i < cnt;i++){
			nextPos=buffer.getUint16();
			nextPos+=buffer.pos;
			var itemId=buffer.readS();
			pi=this._itemsById[buffer.readS()];
			var sprite=new AtlasSprite();
			sprite.atlas=pi;
			sprite.rect.x=buffer.getInt32();
			sprite.rect.y=buffer.getInt32();
			sprite.rect.width=buffer.getInt32();
			sprite.rect.height=buffer.getInt32();
			sprite.rotated=buffer.readBool();
			this._sprites[itemId]=sprite;
			buffer.pos=nextPos;
		}
		if (buffer.seek(indexTablePos,3)){
			cnt=buffer.getUint16();
			for (i=0;i < cnt;i++){
				nextPos=buffer.getInt32();
				nextPos+=buffer.pos;
				pi=this._itemsById[buffer.readS()];
				if (pi && pi.type==0){
					pi.pixelHitTestData=new PixelHitTestData();
					pi.pixelHitTestData.load(buffer);
				}
				buffer.pos=nextPos;
			}
		}
	}

	__proto.loadAllAssets=function(){
		var cnt=this._items.length;
		for(var i=0;i < cnt;i++){
			var pi=this._items[i];
			this.getItemAsset(pi);
		}
	}

	__proto.unloadAssets=function(){
		var cnt=this._items.length;
		for(var i=0;i < cnt;i++){
			var pi=this._items[i];
			if(pi.type==4){
				if(pi.texture!=null)
					Laya.loader.clearTextureRes(pi.texture.url);
			}
		}
	}

	__proto.dispose=function(){
		var cnt=this._items.length;
		for(var i=0;i < cnt;i++){
			var pi=this._items[i];
			if(pi.type==4){
				if(pi.texture!=null){
					pi.texture.destroy();
					pi.texture=null;
				}
			}
			else if(pi.type==2){
				SoundManager.destroySound(pi.file);
			}
		}
	}

	__proto.createObject=function(resName,userClass){
		var pi=this._itemsByName[resName];
		if (pi)
			return this.internalCreateObject(pi,userClass);
		else
		return null;
	}

	__proto.internalCreateObject=function(item,userClass){
		var g;
		if (item.type==3){
			if (userClass !=null)
				g=new userClass();
			else
			g=UIObjectFactory.newObject(item);
		}
		else
		g=UIObjectFactory.newObject(item);
		if (g==null)
			return null;
		fairygui.UIPackage._constructing++;
		g.packageItem=item;
		g.constructFromResource();
		fairygui.UIPackage._constructing--;
		return g;
	}

	__proto.getItemById=function(itemId){
		return this._itemsById[itemId];
	}

	__proto.getItemByName=function(resName){
		return this._itemsByName[resName];
	}

	__proto.getItemAssetByName=function(resName){
		var pi=this._itemsByName[resName];
		if (pi==null){
			throw "Resource not found -"+resName;
		}
		return this.getItemAsset(pi);
	}

	__proto.getItemAsset=function(item){
		switch (item.type){
			case 0:
				if (!item.decoded){
					item.decoded=true;
					var sprite=this._sprites[item.id];
					if (sprite !=null){
						var atlasTexture=(this.getItemAsset(sprite.atlas));
						item.texture=Texture.create(atlasTexture,
						sprite.rect.x,sprite.rect.y,sprite.rect.width,sprite.rect.height);
					}
					else
					item.texture=null;
				}
				return item.texture;
			case 4:
				if (!item.decoded){
					item.decoded=true;
					item.texture=AssetProxy.inst.getRes(item.file);
				}
				return item.texture;
			case 5:
				if (!item.decoded){
					item.decoded=true;
					this.loadFont(item);
				}
				return item.bitmapFont;
			case 1:
				if (!item.decoded){
					item.decoded=true;
					this.loadMovieClip(item);
				}
				return item.frames;
			case 3:
				return item.rawData;
			case 7:
				if(item.file)
					return AssetProxy.inst.getRes(item.file);
				else
				return null;
			default :
				return null;
			}
	}

	__proto.loadMovieClip=function(item){
		var buffer=item.rawData;
		buffer.seek(0,0);
		item.interval=buffer.getInt32();
		item.swing=buffer.readBool();
		item.repeatDelay=buffer.getInt32();
		buffer.seek(0,1);
		var frameCount=buffer.getInt16();
		item.frames=__newvec(frameCount);
		var spriteId;
		var frame;
		var sprite;
		var fx=NaN;
		var fy=NaN;
		for (var i=0;i < frameCount;i++){
			var nextPos=buffer.getInt16();
			nextPos+=buffer.pos;
			frame=new Frame();
			fx=buffer.getInt32();
			fy=buffer.getInt32();
			buffer.getInt32();
			buffer.getInt32();
			frame.addDelay=buffer.getInt32();
			spriteId=buffer.readS();
			if (spriteId !=null && (sprite=this._sprites[spriteId])!=null){
				var atlasTexture=(this.getItemAsset(sprite.atlas));
				frame.texture=Texture.create(atlasTexture,
				sprite.rect.x,sprite.rect.y,sprite.rect.width,sprite.rect.height,
				fx,fy,item.width,item.height);
			}
			item.frames[i]=frame;
			buffer.pos=nextPos;
		}
	}

	__proto.loadFont=function(item){
		var font=new BitmapFont$1();
		item.bitmapFont=font;
		var buffer=item.rawData;
		buffer.seek(0,0);
		font.ttf=buffer.readBool();
		buffer.readBool();
		font.resizable=buffer.readBool();
		buffer.readBool();
		font.size=buffer.getInt32();
		var xadvance=buffer.getInt32();
		var lineHeight=buffer.getInt32();
		var mainTexture=null;
		var mainSprite=this._sprites[item.id];
		if (mainSprite!=null)
			mainTexture=(this.getItemAsset(mainSprite.atlas));
		buffer.seek(0,1);
		var bg=null;
		var cnt=buffer.getInt32();
		for (var i=0;i < cnt;i++){
			var nextPos=buffer.getInt16();
			nextPos+=buffer.pos;
			bg=new BMGlyph();
			var ch=buffer.readChar();
			font.glyphs[ch]=bg;
			var img=buffer.readS();
			var bx=buffer.getInt32();
			var by=buffer.getInt32();
			bg.offsetX=buffer.getInt32();
			bg.offsetY=buffer.getInt32();
			bg.width=buffer.getInt32();
			bg.height=buffer.getInt32();
			bg.advance=buffer.getInt32();
			bg.channel=buffer.readByte();
			if (bg.channel==1)
				bg.channel=3;
			else if (bg.channel==2)
			bg.channel=2;
			else if (bg.channel==3)
			bg.channel=1;
			if (!font.ttf){
				var charImg=this._itemsById[img];
				if (charImg){
					this.getItemAsset(charImg);
					bg.width=charImg.width;
					bg.height=charImg.height;
					bg.texture=charImg.texture;
				}
			}
			else{
				bg.texture=Texture.create(mainTexture,
				bx+mainSprite.rect.x,by+mainSprite.rect.y,bg.width,bg.height);
			}
			if (font.ttf)
				bg.lineHeight=lineHeight;
			else{
				if (bg.advance==0){
					if (xadvance==0)
						bg.advance=bg.offsetX+bg.width;
					else
					bg.advance=xadvance;
				}
				bg.lineHeight=bg.offsetY < 0 ? bg.height :(bg.offsetY+bg.height);
				if (bg.lineHeight < font.size)
					bg.lineHeight=font.size;
			}
			buffer.pos=nextPos;
		}
	}

	__getset(0,__proto,'id',function(){
		return this._id;
	});

	__getset(0,__proto,'name',function(){
		return this._name;
	});

	__getset(0,__proto,'customId',function(){
		return this._customId;
		},function(value){
		if (this._customId !=null)
			delete fairygui.UIPackage._packageInstById[this._customId];
		this._customId=value;
		if (this._customId !=null)
			fairygui.UIPackage._packageInstById[this._customId]=this;
	});

	UIPackage.getById=function(id){
		return fairygui.UIPackage._packageInstById[id];
	}

	UIPackage.getByName=function(name){
		return fairygui.UIPackage._packageInstByName[name];
	}

	UIPackage.addPackage=function(resKey,descData){
		if(!descData){
			descData=AssetProxy.inst.getRes(resKey+"."+UIConfig$1.packageFileExtension);
			if(!descData || descData.byteLength==0)
				throw new Error("package resource not ready: "+resKey);
		};
		var buffer=new ByteBuffer(descData);
		var pkg=new UIPackage();
		pkg.loadPackage(buffer,resKey);
		fairygui.UIPackage._packageInstById[pkg.id]=pkg;
		fairygui.UIPackage._packageInstByName[pkg.name]=pkg;
		pkg.customId=resKey;
		return pkg;
	}

	UIPackage.removePackage=function(packageIdOrName){
		var pkg=fairygui.UIPackage._packageInstById[packageIdOrName];
		if(!pkg)
			pkg=fairygui.UIPackage._packageInstByName[packageIdOrName];
		if(!pkg)
			throw new Error("unknown package: "+packageIdOrName);
		pkg.dispose();
		delete fairygui.UIPackage._packageInstById[pkg.id];
		if(pkg._customId !=null)
			delete fairygui.UIPackage._packageInstById[pkg._customId];
		delete fairygui.UIPackage._packageInstByName[pkg.name];
	}

	UIPackage.createObject=function(pkgName,resName,userClass){
		var pkg=fairygui.UIPackage.getByName(pkgName);
		if(pkg)
			return pkg.createObject(resName,userClass);
		else
		return null;
	}

	UIPackage.createObjectFromURL=function(url,userClass){
		var pi=fairygui.UIPackage.getItemByURL(url);
		if(pi)
			return pi.owner.internalCreateObject(pi,userClass);
		else
		return null;
	}

	UIPackage.getItemURL=function(pkgName,resName){
		var pkg=fairygui.UIPackage.getByName(pkgName);
		if(!pkg)
			return null;
		var pi=pkg._itemsByName[resName];
		if(!pi)
			return null;
		return "ui://"+pkg.id+pi.id;
	}

	UIPackage.getItemByURL=function(url){
		var pos1=url.indexOf("//");
		if (pos1==-1)
			return null;
		var pos2=url.indexOf("/",pos1+2);
		if (pos2==-1){
			if (url.length > 13){
				var pkgId=url.substr(5,8);
				var pkg=UIPackage.getById(pkgId);
				if (pkg !=null){
					var srcId=url.substr(13);
					return pkg.getItemById(srcId);
				}
			}
		}
		else{
			var pkgName=url.substr(pos1+2,pos2-pos1-2);
			pkg=UIPackage.getByName(pkgName);
			if (pkg !=null){
				var srcName=url.substr(pos2+1);
				return pkg.getItemByName(srcName);
			}
		}
		return null;
	}

	UIPackage.getItemAssetByURL=function(url){
		var item=UIPackage.getItemByURL(url);
		if (item==null)
			return null;
		return item.owner.getItemAsset(item);
	}

	UIPackage.normalizeURL=function(url){
		if(url==null)
			return null;
		var pos1=url.indexOf("//");
		if (pos1==-1)
			return null;
		var pos2=url.indexOf("/",pos1+2);
		if (pos2==-1)
			return url;
		var pkgName=url.substr(pos1+2,pos2-pos1-2);
		var srcName=url.substr(pos2+1);
		return UIPackage.getItemURL(pkgName,srcName);
	}

	UIPackage.setStringsSource=function(source){
		TranslationHelper.loadFromXML(source);
	}

	UIPackage._constructing=0;
	UIPackage._packageInstById={};
	UIPackage._packageInstByName={};
	UIPackage.__init$=function(){
		
/**
*<code>/**
*<code>Texture</code> 是一个纹理处理类。
*/
//class laya.resource.Texture extends laya.events.EventDispatcher
var Texture=(function(_super){
	function Texture(bitmap,uv,sourceWidth,sourceHeight){
		/**@private uv的范围*/
		this.uvrect=[0,0,1,1];
		/**@private */
		this._w=0;
		/**@private */
		this._h=0;
		/**@private */
		this._destroyed=false;
		/**@private */
		//this._bitmap=null;
		/**@private */
		//this._uv=null;
		/**@private */
		this._referenceCount=0;
		/**@private [NATIVE]*/
		//this._nativeObj=null;
		/**@private 唯一ID*/
		//this.$_GID=NaN;
		/**沿 X 轴偏移量。*/
		this.offsetX=0;
		/**沿 Y 轴偏移量。*/
		this.offsetY=0;
		/**原始宽度（包括被裁剪的透明区域）。*/
		this.sourceWidth=0;
		/**原始高度（包括被裁剪的透明区域）。*/
		this.sourceHeight=0;
		/**图片地址*/
		//this.url=null;
		/**@private */
		this.scaleRate=1;
		Texture.__super.call(this);
		(sourceWidth===void 0)&& (sourceWidth=0);
		(sourceHeight===void 0)&& (sourceHeight=0);
		this.setTo(bitmap,uv,sourceWidth,sourceHeight);
	}

	__class(Texture,'laya.resource.Texture',_super);
	var __proto=Texture.prototype;
	/**
	*@private
	*/
	__proto._addReference=function(){
		this._bitmap && this._bitmap._addReference();
		this._referenceCount++;
	}

	/**
	*@private
	*/
	__proto._removeReference=function(){
		this._bitmap && this._bitmap._removeReference();
		this._referenceCount--;
	}

	/**
	*@private
	*/
	__proto._getSource=function(){
		if (this._destroyed || !this._bitmap)
			return null;
		this.recoverBitmap();
		return this._bitmap.destroyed ? null :this.bitmap._getSource();
	}

	/**
	*@private
	*/
	__proto._onLoaded=function(complete,context){
		if (!context){
			}else if (context==this){
			}else if ((context instanceof laya.resource.Texture )){
			var tex=context;
			Texture._create(context,0,0,tex.width,tex.height,0,0,tex.sourceWidth,tex.sourceHeight,this);
			}else {
			this.bitmap=context;
			this.sourceWidth=this._w=context.width;
			this.sourceHeight=this._h=context.height;
		}
		complete && complete.run();
		this.event(/*laya.events.Event.READY*/"ready",this);
	}

	/**
	*获取是否可以使用。
	*/
	__proto.getIsReady=function(){
		return this._destroyed ? false :(this._bitmap ? true :false);
	}

	/**
	*设置此对象的位图资源、UV数据信息。
	*@param bitmap 位图资源
	*@param uv UV数据信息
	*/
	__proto.setTo=function(bitmap,uv,sourceWidth,sourceHeight){
		(sourceWidth===void 0)&& (sourceWidth=0);
		(sourceHeight===void 0)&& (sourceHeight=0);
		this.bitmap=bitmap;
		this.sourceWidth=sourceWidth;
		this.sourceHeight=sourceHeight;
		if (bitmap){
			this._w=bitmap.width;
			this._h=bitmap.height;
			this.sourceWidth=this.sourceWidth || this._w;
			this.sourceHeight=this.sourceHeight || this._h;
			var _this=this;
		}
		this.uv=uv || Texture.DEF_UV;
	}

	/**
	*加载指定地址的图片。
	*@param url 图片地址。
	*@param complete 加载完成回调
	*/
	__proto.load=function(url,complete){
		if (!this._destroyed)
			Laya.loader.load(url,Handler.create(this,this._onLoaded,[complete]),null,"htmlimage",1,false,null,true);
	}

	/**
	*获取Texture上的某个区域的像素点
	*@param x
	*@param y
	*@param width
	*@param height
	*@return 返回像素点集合
	*/
	__proto.getPixels=function(x,y,width,height){
		if (Render.isWebGL){
			return RunDriver.getTexturePixels(this,x,y,width,height);
			}else if (Render.isConchApp){
			return this._nativeObj.getImageData(x,y,width,height);
			}else {
			var texw=this.width;
			var texh=this.height;
			if (x+width > texw)width-=(x+width)-texw;
			if (y+height > texh)height-=(y+height)-texh;
			if (width <=0 || height <=0)return null;
			Browser.canvas.size(width,height);
			Browser.canvas.clear();
			Browser.context.drawImage(this.bitmap._source,x,y,width,height,0,0,width,height);
			var info=Browser.context.getImageData(0,0,width,height);
			return info.data;
		}
	}

	/**
	*通过url强制恢复bitmap。
	*/
	__proto.recoverBitmap=function(){
		var url=this._bitmap.url;
		if (!this._destroyed && (!this._bitmap || this._bitmap.destroyed)&& url)
			this.load(url);
	}

	/**
	*强制释放Bitmap,无论是否被引用。
	*/
	__proto.disposeBitmap=function(){
		if (!this._destroyed && this._bitmap){
			this._bitmap.destroy();
		}
	}

	/**
	*销毁纹理。
	*/
	__proto.destroy=function(){
		if (!this._destroyed){
			this._destroyed=true;
			if (this.bitmap){
				this.bitmap._removeReference(this._referenceCount);
				this.bitmap=null;
			}
			if (this.url && this===Laya.loader.getRes(this.url))
				Laya.loader.clearRes(this.url);
		}
	}

	/**实际高度。*/
	__getset(0,__proto,'height',function(){
		if (this._h)
			return this._h;
		if (!this.bitmap)return 0;
		return (this.uv && this.uv!==Texture.DEF_UV)? (this.uv[5]-this.uv[1])*this.bitmap.height :this.bitmap.height;
		},function(value){
		this._h=value;
		this.sourceHeight || (this.sourceHeight=value);
	});

	__getset(0,__proto,'uv',function(){
		return this._uv;
		},function(value){
		this.uvrect[0]=Math.min(value[0],value[2],value[4],value[6]);
		this.uvrect[1]=Math.min(value[1],value[3],value[5],value[7]);
		this.uvrect[2]=Math.max(value[0],value[2],value[4],value[6])-this.uvrect[0];
		this.uvrect[3]=Math.max(value[1],value[3],value[5],value[7])-this.uvrect[1];
		this._uv=value;
	});

	/**实际宽度。*/
	__getset(0,__proto,'width',function(){
		if (this._w)
			return this._w;
		if (!this.bitmap)return 0;
		return (this.uv && this.uv!==Texture.DEF_UV)? (this.uv[2]-this.uv[0])*this.bitmap.width :this.bitmap.width;
		},function(value){
		this._w=value;
		this.sourceWidth || (this.sourceWidth=value);
	});

	/**
	*设置位图。
	*@param 位图。
	*/
	/**
	*获取位图。
	*@return 位图。
	*/
	__getset(0,__proto,'bitmap',function(){
		return this._bitmap;
		},function(value){
		this._bitmap && this._bitmap._removeReference(this._referenceCount);
		this._bitmap=value;
		value && (value._addReference(this._referenceCount));
	});

	/**
	*获取是否已经销毁。
	*@return 是否已经销毁。
	*/
	__getset(0,__proto,'destroyed',function(){
		return this._destroyed;
	});

	Texture.moveUV=function(offsetX,offsetY,uv){
		for (var i=0;i < 8;i+=2){
			uv[i]+=offsetX;
			uv[i+1]+=offsetY;
		}
		return uv;
	}

	Texture.create=function(source,x,y,width,height,offsetX,offsetY,sourceWidth,sourceHeight){
		(offsetX===void 0)&& (offsetX=0);
		(offsetY===void 0)&& (offsetY=0);
		(sourceWidth===void 0)&& (sourceWidth=0);
		(sourceHeight===void 0)&& (sourceHeight=0);
		return Texture._create(source,x,y,width,height,offsetX,offsetY,sourceWidth,sourceHeight);
	}

	Texture._create=function(source,x,y,width,height,offsetX,offsetY,sourceWidth,sourceHeight,outTexture){
		(offsetX===void 0)&& (offsetX=0);
		(offsetY===void 0)&& (offsetY=0);
		(sourceWidth===void 0)&& (sourceWidth=0);
		(sourceHeight===void 0)&& (sourceHeight=0);
		var btex=(source instanceof laya.resource.Texture );
		var uv=btex ? source.uv :Texture.DEF_UV;
		var bitmap=btex ? source.bitmap :source;
		if (bitmap.width && (x+width)> bitmap.width)
			width=bitmap.width-x;
		if (bitmap.height && (y+height)> bitmap.height)
			height=bitmap.height-y;
		var tex;
		if (outTexture){
			tex=outTexture;
			tex.setTo(bitmap,null,sourceWidth || width,sourceHeight || height);
			}else {
			tex=new Texture(bitmap,null,sourceWidth || width,sourceHeight || height)
		}
		tex.width=width;
		tex.height=height;
		tex.offsetX=offsetX;
		tex.offsetY=offsetY;
		var dwidth=1 / bitmap.width;
		var dheight=1 / bitmap.height;
		x *=dwidth;
		y *=dheight;
		width *=dwidth;
		height *=dheight;
		var u1=tex.uv[0],v1=tex.uv[1],u2=tex.uv[4],v2=tex.uv[5];
		var inAltasUVWidth=(u2-u1),inAltasUVHeight=(v2-v1);
		var oriUV=Texture.moveUV(uv[0],uv[1],[x,y,x+width,y,x+width,y+height,x,y+height]);
		tex.uv=[u1+oriUV[0] *inAltasUVWidth,v1+oriUV[1] *inAltasUVHeight,u2-(1-oriUV[2])*inAltasUVWidth,v1+oriUV[3] *inAltasUVHeight,u2-(1-oriUV[4])*inAltasUVWidth,v2-(1-oriUV[5])*inAltasUVHeight,u1+oriUV[6] *inAltasUVWidth,v2-(1-oriUV[7])*inAltasUVHeight];
		var bitmapScale=bitmap.scaleRate;
		if (bitmapScale && bitmapScale !=1){
			tex.sourceWidth /=bitmapScale;
			tex.sourceHeight /=bitmapScale;
			tex.width /=bitmapScale;
			tex.height /=bitmapScale;
			tex.scaleRate=bitmapScale;
			}else {
			tex.scaleRate=1;
		}
		return tex;
	}

	Texture.createFromTexture=function(texture,x,y,width,height){
		var texScaleRate=texture.scaleRate;
		if (texScaleRate !=1){
			x *=texScaleRate;
			y *=texScaleRate;
			width *=texScaleRate;
			height *=texScaleRate;
		};
		var rect=Rectangle.TEMP.setTo(x-texture.offsetX,y-texture.offsetY,width,height);
		var result=rect.intersection(Texture._rect1.setTo(0,0,texture.width,texture.height),Texture._rect2);
		if (result)
			var tex=Texture.create(texture,result.x,result.y,result.width,result.height,result.x-rect.x,result.y-rect.y,width,height);
		else
		return null;
		return tex;
	}

	Texture.DEF_UV=[0,0,1.0,0,1.0,1.0,0,1.0];
	Texture.NO_UV=[0,0,0,0,0,0,0,0];
	Texture.INV_UV=[0,1,1.0,1,1.0,0.0,0,0.0];
	Texture._rect1=new Rectangle();
	Texture._rect2=new Rectangle();
	return Texture;
})(EventDispatcher)


/**
*@private
*场景资源加载器
*/
//class laya.net.SceneLoader extends laya.events.EventDispatcher
var SceneLoader=(function(_super){
	function SceneLoader(){
		this.totalCount=0;
		this._completeHandler=null;
		this._toLoadList=null;
		this._isLoading=false;
		this._curUrl=null;
		SceneLoader.__super.call(this);
		this._completeHandler=new Handler(this,this.onOneLoadComplete);
		this.reset();
	}

	__class(SceneLoader,'laya.net.SceneLoader',_super);
	var __proto=SceneLoader.prototype;
	__proto.reset=function(){
		this._toLoadList=[];
		this._isLoading=false;
		this.totalCount=0;
	}

	__proto.load=function(url,is3D,ifCheck){
		(is3D===void 0)&& (is3D=false);
		(ifCheck===void 0)&& (ifCheck=true);
		if ((url instanceof Array)){
			var i=0,len=0;
			len=url.length;
			for (i=0;i < len;i++){
				this._addToLoadList(url[i],is3D);
			}
			}else {
			this._addToLoadList(url,is3D);
		}
		if(ifCheck)
			this._checkNext();
	}

	__proto._addToLoadList=function(url,is3D){
		(is3D===void 0)&& (is3D=false);
		if (this._toLoadList.indexOf(url)>=0)return;
		if (Loader.getRes(url))return;
		if (is3D){
			this._toLoadList.push({url:url});
		}else
		this._toLoadList.push(url);
		this.totalCount++;
	}

	__proto._checkNext=function(){
		if (!this._isLoading){
			if (this._toLoadList.length==0){
				this.event(/*laya.events.Event.COMPLETE*/"complete");
				return;
			};
			var tItem;
			tItem=this._toLoadList.pop();
			if ((typeof tItem=='string')){
				this.loadOne(tItem);
				}else{
				this.loadOne(tItem.url,true);
			}
		}
	}

	__proto.loadOne=function(url,is3D){
		(is3D===void 0)&& (is3D=false);
		this._curUrl=url;
		var type=Utils.getFileExtension(this._curUrl);
		if (is3D){
			Laya.loader.create(url,this._completeHandler);
		}else
		if (SceneLoader.LoadableExtensions[type]){
			Laya.loader.load(url,this._completeHandler,null,SceneLoader.LoadableExtensions[type]);
			}else if (url !=AtlasInfoManager.getFileLoadPath(url)|| SceneLoader.No3dLoadTypes[type] || !LoaderManager.createMap[type]){
			Laya.loader.load(url,this._completeHandler);
			}else {
			Laya.loader.create(url,this._completeHandler);
		}
	}

	__proto.onOneLoadComplete=function(){
		this._isLoading=false;
		if (!Loader.getRes(this._curUrl)){
			console.log("Fail to load:",this._curUrl);
		};
		var type=Utils.getFileExtension(this._curUrl);
		if (SceneLoader.LoadableExtensions[type]){
			var dataO;
			dataO=Loader.getRes(this._curUrl);
			if (dataO&&((dataO instanceof laya.components.Prefab ))){
				dataO=dataO.json;
			}
			if (dataO){
				if (dataO.loadList){
					this.load(dataO.loadList,false,false);
				}
				if (dataO.loadList3D){
					this.load(dataO.loadList3D,true,false);
				}
			}
		}
		if (type=="sk"){
			this.load(this._curUrl.replace(".sk",".png"),false,false);
		}
		this.event(/*laya.events.Event.PROGRESS*/"progress",this.getProgress());
		this._checkNext();
	}

	__proto.getProgress=function(){
		return this.loadedCount / this.totalCount;
	}

	__getset(0,__proto,'loadedCount',function(){
		return this.totalCount-this.leftCount;
	});

	__getset(0,__proto,'leftCount',function(){
		if (this._isLoading)return this._toLoadList.length+1;
		return this._toLoadList.length;
	});

	__static(SceneLoader,
	['LoadableExtensions',function(){return this.LoadableExtensions={"scene":/*laya.net.Loader.JSON*/"json","scene3d":/*laya.net.Loader.JSON*/"json","ani":/*laya.net.Loader.JSON*/"json","ui":/*laya.net.Loader.JSON*/"json","prefab":/*laya.net.Loader.PREFAB*/"prefab"};},'No3dLoadTypes',function(){return this.No3dLoadTypes={"png":true,"jpg":true,"txt":true};}
	]);
	return SceneLoader;
})(EventDispatcher)


/**

*/
*/
//class fairygui.GLoader extends fairygui.GObject
var GLoader=(function(_super){
	function GLoader(){
		this._url=null;
		this._align=null;
		this._valign=null;
		this._autoSize=false;
		this._fill=0;
		this._shrinkOnly=false;
		this._showErrorSign=false;
		this._contentItem=null;
		this._contentSourceWidth=0;
		this._contentSourceHeight=0;
		this._contentWidth=0;
		this._contentHeight=0;
		this._content=null;
		this._errorSign=null;
		this._content2=null;
		this._updatingLayout=false;
		GLoader.__super.call(this);
		this._url="";
		this._fill=0;
		this._align="left";
		this._valign="top";
		this._showErrorSign=true;
	}

	__class(GLoader,'fairygui.GLoader',_super);
	var __proto=GLoader.prototype;
	Laya.imps(__proto,{"fairygui.gears.IAnimationGear":true,"fairygui.gears.IColorGear":true})
	__proto.createDisplayObject=function(){
		_super.prototype.createDisplayObject.call(this);
		this._content=new MovieClip$1();
		this._displayObject.addChild(this._content);
		this._displayObject.mouseEnabled=true;
	}

	__proto.dispose=function(){
		if(this._contentItem==null && this._content.texture!=null){
			this.freeExternal(this._content.texture);
		}
		if(this._content2!=null)
			this._content2.dispose();
		_super.prototype.dispose.call(this);
	}

	__proto.advance=function(timeInMiniseconds){
		this._content.advance(timeInMiniseconds);
	}

	__proto.loadContent=function(){
		this.clearContent();
		if (!this._url)
			return;
		if(ToolSet.startsWith(this._url,"ui://"))
			this.loadFromPackage(this._url);
		else
		this.loadExternal();
	}

	__proto.loadFromPackage=function(itemURL){
		this._contentItem=UIPackage.getItemByURL(itemURL);
		if(this._contentItem !=null){
			this._contentItem.load();
			if(this._autoSize)
				this.setSize(this._contentItem.width,this._contentItem.height);
			if(this._contentItem.type==0){
				if(this._contentItem.texture==null){
					this.setErrorState();
				}
				else {
					this._content.texture=this._contentItem.texture;
					this._content.scale9Grid=this._contentItem.scale9Grid;
					this._content.scaleByTile=this._contentItem.scaleByTile;
					this._content.tileGridIndice=this._contentItem.tileGridIndice;
					this._contentSourceWidth=this._contentItem.width;
					this._contentSourceHeight=this._contentItem.height;
					this.updateLayout();
				}
			}
			else if(this._contentItem.type==1){
				this._contentSourceWidth=this._contentItem.width;
				this._contentSourceHeight=this._contentItem.height;
				this._content.interval=this._contentItem.interval;
				this._content.swing=this._contentItem.swing;
				this._content.repeatDelay=this._contentItem.repeatDelay;
				this._content.frames=this._contentItem.frames;
				this.updateLayout();
			}
			else if(this._contentItem.type==3){
				var obj=UIPackage.createObjectFromURL(itemURL);
				if(!obj)
					this.setErrorState();
				else if(!((obj instanceof fairygui.GComponent ))){
					obj.dispose();
					this.setErrorState();
				}
				else{
					this._content2=obj.asCom;
					this._displayObject.addChild(this._content2.displayObject);
					this._contentSourceWidth=this._contentItem.width;
					this._contentSourceHeight=this._contentItem.height;
					this.updateLayout();
				}
			}
			else
			this.setErrorState();
		}
		else
		this.setErrorState();
	}

	__proto.loadExternal=function(){
		AssetProxy.inst.load(this._url,Handler.create(this,this.__getResCompleted),null,"image");
	}

	__proto.freeExternal=function(texture){}
	__proto.onExternalLoadSuccess=function(texture){
		this._content.texture=texture;
		this._content.scale9Grid=null;
		this._content.scaleByTile=false;
		this._contentSourceWidth=texture.width;
		this._contentSourceHeight=texture.height;
		this.updateLayout();
	}

	__proto.onExternalLoadFailed=function(){
		this.setErrorState();
	}

	__proto.__getResCompleted=function(tex){
		if(tex!=null)
			this.onExternalLoadSuccess(tex);
		else
		this.onExternalLoadFailed();
	}

	__proto.setErrorState=function(){
		if (!this._showErrorSign)
			return;
		if (this._errorSign==null){
			if (UIConfig$1.loaderErrorSign !=null){
				this._errorSign=fairygui.GLoader._errorSignPool.getObject(UIConfig$1.loaderErrorSign);
			}
		}
		if (this._errorSign !=null){
			this._errorSign.setSize(this.width,this.height);
			this._displayObject.addChild(this._errorSign.displayObject);
		}
	}

	__proto.clearErrorState=function(){
		if (this._errorSign !=null){
			this._displayObject.removeChild(this._errorSign.displayObject);
			fairygui.GLoader._errorSignPool.returnObject(this._errorSign);
			this._errorSign=null;
		}
	}

	__proto.updateLayout=function(){
		if (this._content2==null && this._content.texture==null && this._content.frames==null){
			if (this._autoSize){
				this._updatingLayout=true;
				this.setSize(50,30);
				this._updatingLayout=false;
			}
			return;
		}
		this._contentWidth=this._contentSourceWidth;
		this._contentHeight=this._contentSourceHeight;
		if (this._autoSize){
			this._updatingLayout=true;
			if (this._contentWidth==0)
				this._contentWidth=50;
			if (this._contentHeight==0)
				this._contentHeight=30;
			this.setSize(this._contentWidth,this._contentHeight);
			this._updatingLayout=false;
			if(this._contentWidth==this._width && this._contentHeight==this._height){
				if(this._content2!=null){
					this._content2.setXY(0,0);
					this._content2.setScale(1,1);
				}
				else
				this._content.pos(0,0);
				return;
			}
		};
		var sx=1,sy=1;
		if(this._fill!=0){
			sx=this.width/this._contentSourceWidth;
			sy=this.height/this._contentSourceHeight;
			if(sx!=1 || sy!=1){
				if (this._fill==2)
					sx=sy;
				else if (this._fill==3)
				sy=sx;
				else if (this._fill==1){
					if (sx > sy)
						sx=sy;
					else
					sy=sx;
				}
				else if (this._fill==5){
					if (sx > sy)
						sy=sx;
					else
					sx=sy;
				}
				if(this._shrinkOnly){
					if(sx>1)
						sx=1;
					if(sy>1)
						sy=1;
				}
				this._contentWidth=this._contentSourceWidth *sx;
				this._contentHeight=this._contentSourceHeight *sy;
			}
		}
		if(this._content2!=null)
			this._content2.setScale(sx,sy);
		else
		this._content.size(this._contentWidth,this._contentHeight);
		var nx=NaN,ny=NaN;
		if (this._align=="center")
			nx=Math.floor((this.width-this._contentWidth)/ 2);
		else if (this._align=="right")
		nx=this.width-this._contentWidth;
		else
		nx=0;
		if (this._valign=="middle")
			ny=Math.floor((this.height-this._contentHeight)/ 2);
		else if (this._valign=="bottom")
		ny=this.height-this._contentHeight;
		else
		ny=0;
		if(this._content2!=null)
			this._content2.setXY(nx,ny);
		else
		this._content.pos(nx,ny);
	}

	__proto.clearContent=function(){
		this.clearErrorState();
		if(this._contentItem==null && this._content.texture!=null){
			this.freeExternal(this._content.texture);
		}
		this._content.texture=null;
		this._content.frames=null;
		if(this._content2!=null){
			this._content2.dispose();
			this._content2=null;
		}
		this._contentItem=null;
	}

	__proto.handleSizeChanged=function(){
		_super.prototype.handleSizeChanged.call(this);
		if(!this._updatingLayout)
			this.updateLayout();
	}

	__proto.setup_beforeAdd=function(buffer,beginPos){
		_super.prototype.setup_beforeAdd.call(this,buffer,beginPos);
		buffer.seek(beginPos,5);
		var iv=0;
		this._url=buffer.readS();
		iv=buffer.readByte();
		this._align=iv==0?"left":(iv==1?"center":"right");
		iv=buffer.readByte();
		this._valign=iv==0?"top":(iv==1?"middle":"bottom");
		this._fill=buffer.readByte();
		this._shrinkOnly=buffer.readBool();
		this._autoSize=buffer.readBool();
		this._showErrorSign=buffer.readBool();
		this._content.playing=buffer.readBool();
		this._content.frame=buffer.getInt32();
		if (buffer.readBool())
			this.color=buffer.readColorS();
		var fillMethod=buffer.readByte();
		if (fillMethod !=0)
			buffer.skip(6);
		if (this._url)
			this.loadContent();
	}

	__getset(0,__proto,'frame',function(){
		return this._content.frame;
		},function(value){
		if (this._content.frame !=value){
			this._content.frame=value;
			this.updateGear(5);
		}
	});

	__getset(0,__proto,'url',function(){
		return this._url;
		},function(value){
		if (this._url==value)
			return;
		this._url=value;
		this.loadContent();
		this.updateGear(7);
	});

	__getset(0,__proto,'align',function(){
		return this._align;
		},function(value){
		if (this._align !=value){
			this._align=value;
			this.updateLayout();
		}
	});

	/**
	*@see LoaderFillType
	*/
	/**
	*@see LoaderFillType
	*/
	__getset(0,__proto,'fill',function(){
		return this._fill;
		},function(value){
		if (this._fill !=value){
			this._fill=value;
			this.updateLayout();
		}
	});

	__getset(0,__proto,'verticalAlign',function(){
		return this._valign;
		},function(value){
		if (this._valign !=value){
			this._valign=value;
			this.updateLayout();
		}
	});

	__getset(0,__proto,'icon',function(){
		return this._url;
		},function(value){
		this.url=value;
	});

	__getset(0,__proto,'content',function(){
		return this._content;
	});

	__getset(0,__proto,'shrinkOnly',function(){
		return this._shrinkOnly;
		},function(value){
		if(this._shrinkOnly!=value){
			this._shrinkOnly=value;
			this.updateLayout();
		}
	});

	__getset(0,__proto,'showErrorSign',function(){
		return this._showErrorSign;
		},function(value){
		this._showErrorSign=value;
	});

	__getset(0,__proto,'autoSize',function(){
		return this._autoSize;
		},function(value){
		if (this._autoSize !=value){
			this._autoSize=value;
			this.updateLayout();
		}
	});

	__getset(0,__proto,'playing',function(){
		return this._content.playing;
		},function(value){
		if (this._content.playing !=value){
			this._content.playing=value;
			this.updateGear(5);
		}
	});

	__getset(0,__proto,'timeScale',function(){
		return this._content.timeScale;
		},function(value){
		this._content.timeScale=value;
	});

	__getset(0,__proto,'color',function(){
		return this._content.color;
		},function(value){
		if(this._content.color !=value){
			this._content.color=value;
			this.updateGear(4);
		}
	});

	__getset(0,__proto,'component',function(){
		return this._content2;
	});

	__static(GLoader,
	['_errorSignPool',function(){return this._errorSignPool=new GObjectPool();}
	]);
	return GLoader;
})(GObject)



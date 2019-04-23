//class fairygui.display.Image extends laya.display.Sprite
var Image$1=(function(_super){
	function Image(){
		this._source=null;
		this._scaleByTile=false;
		this._scale9Grid=null;
		this._tileGridIndice=0;
		this._needRebuild=0;
		this._fillMethod=0;
		this._fillOrigin=0;
		this._fillAmount=0;
		this._fillClockwise=false;
		this._mask=null;
		this._color=null;
		Image.__super.call(this);
		this.mouseEnabled=false;
		this._color="#FFFFFF";
	}

	__class(Image,'fairygui.display.Image',_super,'Image$1');
	var __proto=Image.prototype;
	__proto.markChanged=function(flag){
		if(!this._needRebuild){
			this._needRebuild=flag;
			Laya.timer.callLater(this,this.rebuild);
		}
		else
		this._needRebuild |=flag;
	}

	__proto.rebuild=function(){
		if((this._needRebuild & 1)!=0)
			this.doDraw();
		if((this._needRebuild & 2)!=0 && this._fillMethod!=0)
			this.doFill();
		this._needRebuild=0;
	}

	__proto.doDraw=function(){
		var w=this.width;
		var h=this.height;
		var g=this.graphics;
		var tex=this._source;
		g.clear();
		if(tex==null || w==0 || h==0){
			return;
		}
		if(this._scaleByTile){
			g.fillTexture(tex,0,0,w,h);
		}
		else if(this._scale9Grid!=null){
			var tw=tex.width;
			var th=tex.height;
			var left=this._scale9Grid.x;
			var right=Math.max(tw-this._scale9Grid.right,0);
			var top=this._scale9Grid.y;
			var bottom=Math.max(th-this._scale9Grid.bottom,0);
			var tmp=NaN;
			if (h >=(th-this._scale9Grid.height)){
				top=this._scale9Grid.y;
				bottom=th-this._scale9Grid.bottom;
			}
			else{
				tmp=this._scale9Grid.y / (th-this._scale9Grid.bottom);
				tmp=h *tmp / (1+tmp);
				top=Math.round(tmp);
				bottom=h-tmp;
			}
			if (w >=(tw-this._scale9Grid.width)){
				left=this._scale9Grid.x;
				right=tw-this._scale9Grid.right;
			}
			else{
				tmp=this._scale9Grid.x / (tw-this._scale9Grid.right);
				tmp=w *tmp / (1+tmp);
				left=Math.round(tmp);
				right=w-tmp;
			};
			var centerWidth=Math.max(w-left-right,0);
			var centerHeight=Math.max(h-top-bottom,0);
			left && top && g.drawImage(fairygui.display.Image.getTexture(tex,0,0,left,top),0,0,left,top);
			right && top && g.drawImage(fairygui.display.Image.getTexture(tex,tw-right,0,right,top),w-right,0,right,top);
			left && bottom && g.drawImage(fairygui.display.Image.getTexture(tex,0,th-bottom,left,bottom),0,h-bottom,left,bottom);
			right && bottom && g.drawImage(fairygui.display.Image.getTexture(tex,tw-right,th-bottom,right,bottom),w-right,h-bottom,right,bottom);
			centerWidth && top && this.drawTexture(0,fairygui.display.Image.getTexture(tex,left,0,tw-left-right,top),left,0,centerWidth,top);
			centerWidth && bottom && this.drawTexture(1,fairygui.display.Image.getTexture(tex,left,th-bottom,tw-left-right,bottom),left,h-bottom,centerWidth,bottom);
			centerHeight && left && this.drawTexture(2,fairygui.display.Image.getTexture(tex,0,top,left,th-top-bottom),0,top,left,centerHeight);
			centerHeight && right && this.drawTexture(3,fairygui.display.Image.getTexture(tex,tw-right,top,right,th-top-bottom),w-right,top,right,centerHeight);
			centerWidth && centerHeight && this.drawTexture(4,fairygui.display.Image.getTexture(tex,left,top,tw-left-right,th-top-bottom),left,top,centerWidth,centerHeight);
		}
		else {
			g.drawImage(tex,0,0,w,h);
		}
	}

	__proto.drawTexture=function(part,tex,x,y,width,height){
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		if(part==-1 || (this._tileGridIndice & (1<<part))==0)
			this.graphics.drawImage(tex,x,y,width,height);
		else
		this.graphics.fillTexture(tex,x,y,width,height);
	}

	__proto.doFill=function(){
		var w=this.width;
		var h=this.height;
		var g=this._mask.graphics;
		g.clear();
		if(w==0 || h==0)
			return;
		var points=FillUtils.fill(w,h,this._fillMethod,this._fillOrigin,this._fillClockwise,this._fillAmount);
		if(points==null){
			this.mask=null;
			this.mask=this._mask;
			return;
		}
		g.drawPoly(0,0,points,"#FFFFFF");
	}

	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		if (this._width!==value){
			Laya.superSet(Sprite,this,'width',value);
			this.markChanged(1);
		}
	});

	__getset(0,__proto,'fillOrigin',function(){
		return this._fillOrigin;
		},function(value){
		if(this._fillOrigin!=value){
			this._fillOrigin=value;
			if(this._fillMethod!=0)
				this.markChanged(2);
		}
	});

	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		if (this._height!==value){
			Laya.superSet(Sprite,this,'height',value);
			this.markChanged(1);
		}
	});

	__getset(0,__proto,'scaleByTile',function(){
		return this._scaleByTile;
		},function(value){
		if(this._scaleByTile!=value){
			this._scaleByTile=value;
			this.markChanged(1);
		}
	});

	__getset(0,__proto,'texture',function(){
		return this._source;
		},function(value){
		if(this._source!=value){
			this._source=value;
			if(this.width==0){
				if(this._source)
					this.size(this._source.width,this._source.height);
				else
				this.size(0,0);
			}
			this.repaint();
			this.markChanged(1);
		}
	});

	__getset(0,__proto,'scale9Grid',function(){
		return this._scale9Grid;
		},function(value){
		this._scale9Grid=value;
		this.markChanged(1);
	});

	__getset(0,__proto,'tileGridIndice',function(){
		return this._tileGridIndice;
		},function(value){
		if(this._tileGridIndice!=value){
			this._tileGridIndice=value;
			this.markChanged(1);
		}
	});

	__getset(0,__proto,'fillMethod',function(){
		return this._fillMethod;
		},function(value){
		if(this._fillMethod!=value){
			this._fillMethod=value;
			if(this._fillMethod!=0){
				if(!this._mask){
					this._mask=new Sprite();
					this._mask.mouseEnabled=false;
				}
				this.mask=this._mask;
				this.markChanged(2);
			}
			else if(this.mask){
				this._mask.graphics.clear();
				this.mask=null;
			}
		}
	});

	__getset(0,__proto,'fillClockwise',function(){
		return this._fillClockwise;
		},function(value){
		if(this._fillClockwise!=value){
			this._fillClockwise=value;
			if(this._fillMethod!=0)
				this.markChanged(2);
		}
	});

	__getset(0,__proto,'fillAmount',function(){
		return this._fillAmount;
		},function(value){
		if(this._fillAmount!=value){
			this._fillAmount=value;
			if(this._fillMethod!=0)
				this.markChanged(2);
		}
	});

	__getset(0,__proto,'color',function(){
		return this._color;
		},function(value){
		if(this._color !=value){
			this._color=value;
		}
	});

	Image.getTexture=function(tex,x,y,width,height){
		if (width <=0)width=1;
		if (height <=0)height=1;
		tex.$_GID || (tex.$_GID=Utils.getGID())
		var texture;
		if (!texture||!texture._getSource()){
			texture=Texture.createFromTexture(tex,x,y,width,height);
		}
		return texture;
	}

	return Image;
})(Sprite)



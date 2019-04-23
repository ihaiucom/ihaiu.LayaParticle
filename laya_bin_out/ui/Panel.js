/**
*<code>Panel</code> 是一个面板容器类。
*/
//class laya.ui.Panel extends laya.ui.Box
var Panel=(function(_super){
	function Panel(){
		/**@private */
		this._content=null;
		/**@private */
		this._vScrollBar=null;
		/**@private */
		this._hScrollBar=null;
		/**@private */
		this._scrollChanged=false;
		/**@private */
		this._usedCache=null;
		/**@private */
		this._elasticEnabled=false;
		Panel.__super.call(this);
		this.width=this.height=100;
	}

	__class(Panel,'laya.ui.Panel',_super);
	var __proto=Panel.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		laya.ui.UIComponent.prototype.destroy.call(this,destroyChild);
		this._content && this._content.destroy(destroyChild);
		this._vScrollBar && this._vScrollBar.destroy(destroyChild);
		this._hScrollBar && this._hScrollBar.destroy(destroyChild);
		this._vScrollBar=null;
		this._hScrollBar=null;
		this._content=null;
	}

	/**@inheritDoc */
	__proto.destroyChildren=function(){
		this._content.destroyChildren();
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		laya.display.Node.prototype.addChild.call(this,this._content=new Box());
	}

	/**@inheritDoc */
	__proto.addChild=function(child){
		child.on(/*laya.events.Event.RESIZE*/"resize",this,this.onResize);
		this._setScrollChanged();
		return this._content.addChild(child);
	}

	/**
	*@private
	*子对象的 <code>Event.RESIZE</code> 事件侦听处理函数。
	*/
	__proto.onResize=function(){
		this._setScrollChanged();
	}

	/**@inheritDoc */
	__proto.addChildAt=function(child,index){
		child.on(/*laya.events.Event.RESIZE*/"resize",this,this.onResize);
		this._setScrollChanged();
		return this._content.addChildAt(child,index);
	}

	/**@inheritDoc */
	__proto.removeChild=function(child){
		child.off(/*laya.events.Event.RESIZE*/"resize",this,this.onResize);
		this._setScrollChanged();
		return this._content.removeChild(child);
	}

	/**@inheritDoc */
	__proto.removeChildAt=function(index){
		this.getChildAt(index).off(/*laya.events.Event.RESIZE*/"resize",this,this.onResize);
		this._setScrollChanged();
		return this._content.removeChildAt(index);
	}

	/**@inheritDoc */
	__proto.removeChildren=function(beginIndex,endIndex){
		(beginIndex===void 0)&& (beginIndex=0);
		(endIndex===void 0)&& (endIndex=0x7fffffff);
		this._content.removeChildren(beginIndex,endIndex);
		this._setScrollChanged();
		return this;
	}

	/**@inheritDoc */
	__proto.getChildAt=function(index){
		return this._content.getChildAt(index);
	}

	/**@inheritDoc */
	__proto.getChildByName=function(name){
		return this._content.getChildByName(name);
	}

	/**@inheritDoc */
	__proto.getChildIndex=function(child){
		return this._content.getChildIndex(child);
	}

	/**@private */
	__proto.changeScroll=function(){
		this._scrollChanged=false;
		var contentW=this.contentWidth || 1;
		var contentH=this.contentHeight || 1;
		var vscroll=this._vScrollBar;
		var hscroll=this._hScrollBar;
		var vShow=vscroll && contentH > this._height;
		var hShow=hscroll && contentW > this._width;
		var showWidth=vShow ? this._width-vscroll.width :this._width;
		var showHeight=hShow ? this._height-hscroll.height :this._height;
		if (vscroll){
			vscroll.x=this._width-vscroll.width;
			vscroll.y=0;
			vscroll.height=this._height-(hShow ? hscroll.height :0);
			vscroll.scrollSize=Math.max(this._height *0.033,1);
			vscroll.thumbPercent=showHeight / contentH;
			vscroll.setScroll(0,contentH-showHeight,vscroll.value);
		}
		if (hscroll){
			hscroll.x=0;
			hscroll.y=this._height-hscroll.height;
			hscroll.width=this._width-(vShow ? vscroll.width :0);
			hscroll.scrollSize=Math.max(this._width *0.033,1);
			hscroll.thumbPercent=showWidth / contentW;
			hscroll.setScroll(0,contentW-showWidth,hscroll.value);
		}
	}

	/**@inheritDoc */
	__proto._sizeChanged=function(){
		laya.ui.UIComponent.prototype._sizeChanged.call(this);
		this.setContentSize(this._width,this._height);
	}

	/**
	*@private
	*设置内容的宽度、高度（以像素为单位）。
	*@param width 宽度。
	*@param height 高度。
	*/
	__proto.setContentSize=function(width,height){
		var content=this._content;
		content.width=width;
		content.height=height;
		content._style.scrollRect || (content.scrollRect=Rectangle.create());
		content._style.scrollRect.setTo(0,0,width,height);
		content.scrollRect=content.scrollRect;
	}

	/**
	*@private
	*滚动条的<code><code>Event.MOUSE_DOWN</code>事件侦听处理函数。</code>事件侦听处理函数。
	*@param scrollBar 滚动条对象。
	*@param e Event 对象。
	*/
	__proto.onScrollBarChange=function(scrollBar){
		var rect=this._content._style.scrollRect;
		if (rect){
			var start=Math.round(scrollBar.value);
			scrollBar.isVertical ? rect.y=start :rect.x=start;
			this._content.scrollRect=rect;
		}
	}

	/**
	*<p>滚动内容容器至设定的垂直、水平方向滚动条位置。</p>
	*@param x 水平方向滚动条属性value值。滚动条位置数字。
	*@param y 垂直方向滚动条属性value值。滚动条位置数字。
	*/
	__proto.scrollTo=function(x,y){
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		if (this.vScrollBar)this.vScrollBar.value=y;
		if (this.hScrollBar)this.hScrollBar.value=x;
	}

	/**
	*刷新滚动内容。
	*/
	__proto.refresh=function(){
		this.changeScroll();
	}

	__proto.onScrollStart=function(){
		this._usedCache || (this._usedCache=Laya.superGet(Box,this,'cacheAs'));
		Laya.superSet(Box,this,'cacheAs',"none");
		this._hScrollBar && this._hScrollBar.once(/*laya.events.Event.END*/"end",this,this.onScrollEnd);
		this._vScrollBar && this._vScrollBar.once(/*laya.events.Event.END*/"end",this,this.onScrollEnd);
	}

	__proto.onScrollEnd=function(){
		Laya.superSet(Box,this,'cacheAs',this._usedCache);
	}

	/**@private */
	__proto._setScrollChanged=function(){
		if (!this._scrollChanged){
			this._scrollChanged=true;
			this.callLater(this.changeScroll);
		}
	}

	/**@inheritDoc */
	__getset(0,__proto,'numChildren',function(){
		return this._content.numChildren;
	});

	/**
	*水平方向滚动条皮肤。
	*/
	__getset(0,__proto,'hScrollBarSkin',function(){
		return this._hScrollBar ? this._hScrollBar.skin :null;
		},function(value){
		if (this._hScrollBar==null){
			laya.display.Node.prototype.addChild.call(this,this._hScrollBar=new HScrollBar());
			this._hScrollBar.on(/*laya.events.Event.CHANGE*/"change",this,this.onScrollBarChange,[this._hScrollBar]);
			this._hScrollBar.target=this._content;
			this._hScrollBar.elasticDistance=this._elasticEnabled ? 200 :0;
			this._setScrollChanged();
		}
		this._hScrollBar.skin=value;
	});

	/**
	*@private
	*获取内容宽度（以像素为单位）。
	*/
	__getset(0,__proto,'contentWidth',function(){
		var max=0;
		for (var i=this._content.numChildren-1;i >-1;i--){
			var comp=this._content.getChildAt(i);
			max=Math.max(comp._x+comp.width *comp.scaleX-comp.pivotX,max);
		}
		return max;
	});

	/**
	*@private
	*获取内容高度（以像素为单位）。
	*/
	__getset(0,__proto,'contentHeight',function(){
		var max=0;
		for (var i=this._content.numChildren-1;i >-1;i--){
			var comp=this._content.getChildAt(i);
			max=Math.max(comp._y+comp.height *comp.scaleY-comp.pivotY,max);
		}
		return max;
	});

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(Box,this,'width',value);
		this._setScrollChanged();
	});

	/**
	*水平方向滚动条对象。
	*/
	__getset(0,__proto,'hScrollBar',function(){
		return this._hScrollBar;
	});

	/**
	*获取内容容器对象。
	*/
	__getset(0,__proto,'content',function(){
		return this._content;
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(Box,this,'height',value);
		this._setScrollChanged();
	});

	/**
	*垂直方向滚动条皮肤。
	*/
	__getset(0,__proto,'vScrollBarSkin',function(){
		return this._vScrollBar ? this._vScrollBar.skin :null;
		},function(value){
		if (this._vScrollBar==null){
			laya.display.Node.prototype.addChild.call(this,this._vScrollBar=new VScrollBar());
			this._vScrollBar.on(/*laya.events.Event.CHANGE*/"change",this,this.onScrollBarChange,[this._vScrollBar]);
			this._vScrollBar.target=this._content;
			this._vScrollBar.elasticDistance=this._elasticEnabled ? 200 :0;
			this._setScrollChanged();
		}
		this._vScrollBar.skin=value;
	});

	/**
	*垂直方向滚动条对象。
	*/
	__getset(0,__proto,'vScrollBar',function(){
		return this._vScrollBar;
	});

	/**@inheritDoc */
	__getset(0,__proto,'cacheAs',_super.prototype._$get_cacheAs,function(value){
		Laya.superSet(Box,this,'cacheAs',value);
		this._usedCache=null;
		if (value!=="none"){
			this._hScrollBar && this._hScrollBar.on(/*laya.events.Event.START*/"start",this,this.onScrollStart);
			this._vScrollBar && this._vScrollBar.on(/*laya.events.Event.START*/"start",this,this.onScrollStart);
			}else {
			this._hScrollBar && this._hScrollBar.off(/*laya.events.Event.START*/"start",this,this.onScrollStart);
			this._vScrollBar && this._vScrollBar.off(/*laya.events.Event.START*/"start",this,this.onScrollStart);
		}
	});

	/**是否开启橡皮筋效果*/
	__getset(0,__proto,'elasticEnabled',function(){
		return this._elasticEnabled;
		},function(value){
		this._elasticEnabled=value;
		if (this._vScrollBar){
			this._vScrollBar.elasticDistance=value ? 200 :0;
		}
		if (this._hScrollBar){
			this._hScrollBar.elasticDistance=value ? 200 :0;
		}
	});

	return Panel;
})(Box)


/**

*/
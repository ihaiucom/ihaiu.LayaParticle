/**
*<code>UIEvent</code> 类用来定义UI组件类的事件类型。
*/
//class laya.ui.UIEvent extends laya.events.Event
var UIEvent=(function(_super){
	function UIEvent(){
		UIEvent.__super.call(this);;
	}

	__class(UIEvent,'laya.ui.UIEvent',_super);
	UIEvent.SHOW_TIP="showtip";
	UIEvent.HIDE_TIP="hidetip";
	return UIEvent;
})(Event)


/**
*相对布局插件
*/
//class laya.ui.Widget extends laya.components.Component
var Widget=(function(_super){
	function Widget(){
		Widget.__super.call(this);
		this._top=NaN;
		this._bottom=NaN;
		this._left=NaN;
		this._right=NaN;
		this._centerX=NaN;
		this._centerY=NaN;
	}

	__class(Widget,'laya.ui.Widget',_super);
	var __proto=Widget.prototype;
	__proto.onReset=function(){
		this._top=this._bottom=this._left=this._right=this._centerX=this._centerY=NaN;
	}

	__proto._onEnable=function(){
		if (this.owner.parent)this._onAdded();
		else this.owner.once(/*laya.events.Event.ADDED*/"added",this,this._onAdded);
	}

	__proto._onDisable=function(){
		this.owner.off(/*laya.events.Event.ADDED*/"added",this,this._onAdded);
		if (this.owner.parent)this.owner.parent.off(/*laya.events.Event.RESIZE*/"resize",this,this._onParentResize);
	}

	/**
	*对象被添加到显示列表的事件侦听处理函数。
	*/
	__proto._onAdded=function(){
		if (this.owner.parent)
			this.owner.parent.on(/*laya.events.Event.RESIZE*/"resize",this,this._onParentResize);
		this.resetLayoutX();
		this.resetLayoutY();
	}

	/**
	*父容器的 <code>Event.RESIZE</code> 事件侦听处理函数。
	*/
	__proto._onParentResize=function(){
		if (this.resetLayoutX()|| this.resetLayoutY())this.owner.event(/*laya.events.Event.RESIZE*/"resize");
	}

	/**
	*<p>重置对象的 <code>X</code> 轴（水平方向）布局。</p>
	*@private
	*/
	__proto.resetLayoutX=function(){
		var owner=this.owner;
		if (!owner)return false;
		var parent=owner.parent;
		if (parent){
			if (!isNaN(this.centerX)){
				owner.x=Math.round((parent.width-owner.displayWidth)*0.5+this.centerX+owner.pivotX *owner.scaleX);
				}else if (!isNaN(this.left)){
				owner.x=Math.round(this.left+owner.pivotX *owner.scaleX);
				if (!isNaN(this.right)){
					var temp=(parent._width-this.left-this.right)/ (owner.scaleX || 0.01);
					if (temp !=owner.width){
						owner.width=temp;
						return true;
					}
				}
				}else if (!isNaN(this.right)){
				owner.x=Math.round(parent.width-owner.displayWidth-this.right+owner.pivotX *owner.scaleX);
			}
		}
		return false;
	}

	/**
	*<p>重置对象的 <code>Y</code> 轴（垂直方向）布局。</p>
	*@private
	*/
	__proto.resetLayoutY=function(){
		var owner=this.owner;
		if (!owner)return false;
		var parent=owner.parent;
		if (parent){
			if (!isNaN(this.centerY)){
				owner.y=Math.round((parent.height-owner.displayHeight)*0.5+this.centerY+owner.pivotY *owner.scaleY);
				}else if (!isNaN(this.top)){
				owner.y=Math.round(this.top+owner.pivotY *owner.scaleY);
				if (!isNaN(this.bottom)){
					var temp=(parent._height-this.top-this.bottom)/ (owner.scaleY || 0.01);
					if (temp !=owner.height){
						owner.height=temp;
						return true;
					}
				}
				}else if (!isNaN(this.bottom)){
				owner.y=Math.round(parent.height-owner.displayHeight-this.bottom+owner.pivotY *owner.scaleY);
			}
		}
		return false;
	}

	/**
	*重新计算布局
	*/
	__proto.resetLayout=function(){
		if (this.owner){
			this.resetLayoutX();
			this.resetLayoutY();
		}
	}

	/**表示距水平方向中心轴的距离（以像素为单位）。*/
	__getset(0,__proto,'centerX',function(){
		return this._centerX;
		},function(value){
		if (this._centerX !=value){
			this._centerX=value;
			this.resetLayoutX();
		}
	});

	/**表示距顶边的距离（以像素为单位）。*/
	__getset(0,__proto,'top',function(){
		return this._top;
		},function(value){
		if (this._top !=value){
			this._top=value;
			this.resetLayoutY();
		}
	});

	/**表示距底边的距离（以像素为单位）。*/
	__getset(0,__proto,'bottom',function(){
		return this._bottom;
		},function(value){
		if (this._bottom !=value){
			this._bottom=value;
			this.resetLayoutY();
		}
	});

	/**表示距左边的距离（以像素为单位）。*/
	__getset(0,__proto,'left',function(){
		return this._left;
		},function(value){
		if (this._left !=value){
			this._left=value;
			this.resetLayoutX();
		}
	});

	/**表示距右边的距离（以像素为单位）。*/
	__getset(0,__proto,'right',function(){
		return this._right;
		},function(value){
		if (this._right !=value){
			this._right=value;
			this.resetLayoutX();
		}
	});

	/**表示距垂直方向中心轴的距离（以像素为单位）。*/
	__getset(0,__proto,'centerY',function(){
		return this._centerY;
		},function(value){
		if (this._centerY !=value){
			this._centerY=value;
			this.resetLayoutY();
		}
	});

	__static(Widget,
	['EMPTY',function(){return this.EMPTY=new Widget();}
	]);
	return Widget;
})(Component)


/**

*/
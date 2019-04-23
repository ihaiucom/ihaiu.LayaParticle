/**
*<code>LayoutBox</code> 是一个布局容器类。
*/
//class laya.ui.LayoutBox extends laya.ui.Box
var LayoutBox=(function(_super){
	function LayoutBox(){
		/**@private */
		this._space=0;
		/**@private */
		this._align="none";
		/**@private */
		this._itemChanged=false;
		LayoutBox.__super.call(this);
	}

	__class(LayoutBox,'laya.ui.LayoutBox',_super);
	var __proto=LayoutBox.prototype;
	/**@inheritDoc */
	__proto.addChild=function(child){
		child.on(/*laya.events.Event.RESIZE*/"resize",this,this.onResize);
		this._setItemChanged();
		return laya.display.Node.prototype.addChild.call(this,child);
	}

	__proto.onResize=function(e){
		this._setItemChanged();
	}

	/**@inheritDoc */
	__proto.addChildAt=function(child,index){
		child.on(/*laya.events.Event.RESIZE*/"resize",this,this.onResize);
		this._setItemChanged();
		return laya.display.Node.prototype.addChildAt.call(this,child,index);
	}

	/**@inheritDoc */
	__proto.removeChildAt=function(index){
		this.getChildAt(index).off(/*laya.events.Event.RESIZE*/"resize",this,this.onResize);
		this._setItemChanged();
		return laya.display.Node.prototype.removeChildAt.call(this,index);
	}

	/**刷新。*/
	__proto.refresh=function(){
		this._setItemChanged();
	}

	/**
	*改变子对象的布局。
	*/
	__proto.changeItems=function(){
		this._itemChanged=false;
	}

	/**
	*排序项目列表。可通过重写改变默认排序规则。
	*@param items 项目列表。
	*/
	__proto.sortItem=function(items){
		if (items)items.sort(function(a,b){return a.y-b.y;});
	}

	__proto._setItemChanged=function(){
		if (!this._itemChanged){
			this._itemChanged=true;
			this.callLater(this.changeItems);
		}
	}

	/**子对象的间隔。*/
	__getset(0,__proto,'space',function(){
		return this._space;
		},function(value){
		this._space=value;
		this._setItemChanged();
	});

	/**子对象对齐方式。*/
	__getset(0,__proto,'align',function(){
		return this._align;
		},function(value){
		this._align=value;
		this._setItemChanged();
	});

	return LayoutBox;
})(Box)


/**

*/
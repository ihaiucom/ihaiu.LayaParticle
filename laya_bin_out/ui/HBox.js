/**
*<code>HBox</code> 是一个水平布局容器类。
*/
//class laya.ui.HBox extends laya.ui.LayoutBox
var HBox=(function(_super){
	function HBox(){
		HBox.__super.call(this);;
	}

	__class(HBox,'laya.ui.HBox',_super);
	var __proto=HBox.prototype;
	/**@inheritDoc */
	__proto.sortItem=function(items){
		if (items)items.sort(function(a,b){return a.x-b.x;});
	}

	/**@inheritDoc */
	__proto.changeItems=function(){
		this._itemChanged=false;
		var items=[];
		var maxHeight=0;
		for (var i=0,n=this.numChildren;i < n;i++){
			var item=this.getChildAt(i);
			if (item){
				items.push(item);
				maxHeight=this._height?this._height:Math.max(maxHeight,item.height *item.scaleY);
			}
		}
		this.sortItem(items);
		var left=0;
		for (i=0,n=items.length;i < n;i++){
			item=items[i];
			item.x=left;
			left+=item.width *item.scaleX+this._space;
			if (this._align=="top"){
				item.y=0;
				}else if (this._align=="middle"){
				item.y=(maxHeight-item.height *item.scaleY)*0.5;
				}else if (this._align=="bottom"){
				item.y=maxHeight-item.height *item.scaleY;
			}
		}
		this._sizeChanged();
	}

	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		if (this._height !=value){
			Laya.superSet(LayoutBox,this,'height',value);
			this.callLater(this.changeItems);
		}
	});

	HBox.NONE="none";
	HBox.TOP="top";
	HBox.MIDDLE="middle";
	HBox.BOTTOM="bottom";
	return HBox;
})(LayoutBox)


/**

*/
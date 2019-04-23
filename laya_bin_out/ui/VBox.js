/**
*<code>VBox</code> 是一个垂直布局容器类。
*/
//class laya.ui.VBox extends laya.ui.LayoutBox
var VBox=(function(_super){
	function VBox(){
		VBox.__super.call(this);;
	}

	__class(VBox,'laya.ui.VBox',_super);
	var __proto=VBox.prototype;
	/**@inheritDoc */
	__proto.changeItems=function(){
		this._itemChanged=false;
		var items=[];
		var maxWidth=0;
		for (var i=0,n=this.numChildren;i < n;i++){
			var item=this.getChildAt(i);
			if (item){
				items.push(item);
				maxWidth=this._width?this._width:Math.max(maxWidth,item.width *item.scaleX);
			}
		}
		this.sortItem(items);
		var top=0;
		for (i=0,n=items.length;i < n;i++){
			item=items[i];
			item.y=top;
			top+=item.height *item.scaleY+this._space;
			if (this._align=="left"){
				item.x=0;
				}else if (this._align=="center"){
				item.x=(maxWidth-item.width *item.scaleX)*0.5;
				}else if (this._align=="right"){
				item.x=maxWidth-item.width *item.scaleX;
			}
		}
		this._sizeChanged();
	}

	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		if (this._width !=value){
			Laya.superSet(LayoutBox,this,'width',value);
			this.callLater(this.changeItems);
		}
	});

	VBox.NONE="none";
	VBox.LEFT="left";
	VBox.CENTER="center";
	VBox.RIGHT="right";
	return VBox;
})(LayoutBox)


	Laya.__init([View]);
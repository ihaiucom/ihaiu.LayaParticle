//class fairygui.Margin
var Margin=(function(){
	function Margin(){
		this.left=0;
		this.right=0;
		this.top=0;
		this.bottom=0;
	}

	__class(Margin,'fairygui.Margin');
	var __proto=Margin.prototype;
	__proto.copy=function(source){
		this.top=source.top;
		this.bottom=source.bottom;
		this.left=source.left;
		this.right=source.right;
	}

	return Margin;
})()


/**
*Use for UIObjectFactory.newObject
*/

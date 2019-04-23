/**
*<code>PixelLineData</code> 类用于表示线数据。
*/
//class laya.d3.core.pixelLine.PixelLineData
var PixelLineData=(function(){
	function PixelLineData(){
		this.startPosition=new Vector3();
		this.endPosition=new Vector3();
		this.startColor=new Color();
		this.endColor=new Color();
	}

	__class(PixelLineData,'laya.d3.core.pixelLine.PixelLineData');
	var __proto=PixelLineData.prototype;
	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		this.startPosition.cloneTo(destObject.startPosition);
		this.endPosition.cloneTo(destObject.endPosition);
		this.startColor.cloneTo(destObject.startColor);
		this.endColor.cloneTo(destObject.endColor);
	}

	return PixelLineData;
})()


/**

*/
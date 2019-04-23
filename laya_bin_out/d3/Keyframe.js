/**
*<code>KeyFrame</code> 类用于创建关键帧实例。
*/
//class laya.d3.core.Keyframe
var Keyframe=(function(){
	function Keyframe(){
		/**时间。*/
		this.time=NaN;
	}

	__class(Keyframe,'laya.d3.core.Keyframe');
	var __proto=Keyframe.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destKeyFrame=destObject;
		destKeyFrame.time=this.time;
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var dest=/*__JS__ */new this.constructor();
		this.cloneTo(dest);
		return dest;
	}

	return Keyframe;
})()


/**

*/
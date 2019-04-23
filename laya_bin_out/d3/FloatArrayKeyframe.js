/**
*<code>FloatArrayKeyframe</code> 类用于创建浮点数组关键帧实例。
*/
//class laya.d3.core.FloatArrayKeyframe extends laya.d3.core.Keyframe
var FloatArrayKeyframe=(function(_super){
	function FloatArrayKeyframe(){
		//this.data=null;
		FloatArrayKeyframe.__super.call(this);
	}

	__class(FloatArrayKeyframe,'laya.d3.core.FloatArrayKeyframe',_super);
	var __proto=FloatArrayKeyframe.prototype;
	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		_super.prototype.cloneTo.call(this,destObject);
		var destKeyFrame=destObject;
		destKeyFrame.data=this.data.slice();
	}

	return FloatArrayKeyframe;
})(Keyframe)


/**
*@private

*/
/**
*<code>FloatKeyFrame</code> 类用于创建浮点关键帧实例。
*/
//class laya.d3.core.FloatKeyframe extends laya.d3.core.Keyframe
var FloatKeyframe=(function(_super){
	function FloatKeyframe(){
		//this.inTangent=NaN;
		//this.outTangent=NaN;
		//this.value=NaN;
		FloatKeyframe.__super.call(this);
	}

	__class(FloatKeyframe,'laya.d3.core.FloatKeyframe',_super);
	var __proto=FloatKeyframe.prototype;
	/**
	*@inheritDoc
	*/
	__proto.cloneTo=function(destObject){
		_super.prototype.cloneTo.call(this,destObject);
		var destKeyFrame=destObject;
		destKeyFrame.inTangent=this.inTangent;
		destKeyFrame.outTangent=this.outTangent;
		destKeyFrame.value=this.value;
	}

	return FloatKeyframe;
})(Keyframe)


/**

*/
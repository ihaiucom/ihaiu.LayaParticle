//class laya.webgl.submit.SubmitKey
var SubmitKey=(function(){
	function SubmitKey(){
		this.blendShader=0;
		this.submitType=0;
		this.other=0;
		this.clear();
	}

	__class(SubmitKey,'laya.webgl.submit.SubmitKey');
	var __proto=SubmitKey.prototype;
	__proto.clear=function(){
		this.submitType=-1;
		this.blendShader=this.other=0;
	}

	//TODO:coverage
	__proto.copyFrom=function(src){
		this.other=src.other;
		this.blendShader=src.blendShader;
		this.submitType=src.submitType;
	}

	//alpha=src.alpha;
	__proto.copyFrom2=function(src,submitType,other){
		this.other=other;
		this.submitType=submitType;
	}

	//TODO:coverage
	__proto.equal3_2=function(next,submitType,other){
		return this.submitType===submitType && this.other===other && this.blendShader===next.blendShader;
	}

	//TODO:coverage
	__proto.equal4_2=function(next,submitType,other){
		return this.submitType===submitType && this.other===other && this.blendShader===next.blendShader;
	}

	//TODO:coverage
	__proto.equal_3=function(next){
		return this.submitType===next.submitType && this.blendShader===next.blendShader;
	}

	//TODO:coverage
	__proto.equal=function(next){
		return this.other===next.other && this.submitType===next.submitType && this.blendShader===next.blendShader;
	}

	return SubmitKey;
})()



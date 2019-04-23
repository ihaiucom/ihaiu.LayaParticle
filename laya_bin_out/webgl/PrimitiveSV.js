//class laya.webgl.shader.d2.value.PrimitiveSV extends laya.webgl.shader.d2.value.Value2D
var PrimitiveSV=(function(_super){
	function PrimitiveSV(args){
		PrimitiveSV.__super.call(this,/*laya.webgl.shader.d2.ShaderDefines2D.PRIMITIVE*/0x04,0);
		this._attribLocation=['position',0,'attribColor',1];
	}

	__class(PrimitiveSV,'laya.webgl.shader.d2.value.PrimitiveSV',_super);
	return PrimitiveSV;
})(Value2D)


/**
*drawImage，fillRect等会用到的简单的mesh。每次添加必然是一个四边形。
*/

//class laya.webgl.shader.d2.value.TextureSV extends laya.webgl.shader.d2.value.Value2D
var TextureSV=(function(_super){
	function TextureSV(subID){
		this.u_colorMatrix=null;
		this.strength=0;
		this.blurInfo=null;
		this.colorMat=null;
		this.colorAlpha=null;
		(subID===void 0)&& (subID=0);
		TextureSV.__super.call(this,/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,subID);
		this._attribLocation=['posuv',0,'attribColor',1,'attribFlags',2];
	}

	__class(TextureSV,'laya.webgl.shader.d2.value.TextureSV',_super);
	var __proto=TextureSV.prototype;
	// ,'clipDir',3,'clipRect',4];
	__proto.clear=function(){
		this.texture=null;
		this.shader=null;
		this.defines._value=this.subID+(WebGL.shaderHighPrecision? /*laya.webgl.shader.d2.ShaderDefines2D.SHADERDEFINE_FSHIGHPRECISION*/0x400:0);
	}

	return TextureSV;
})(Value2D)



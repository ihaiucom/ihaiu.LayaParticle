//class laya.webgl.shader.d2.skinAnishader.SkinSV extends laya.webgl.shader.d2.value.Value2D
var SkinSV=(function(_super){
	function SkinSV(type){
		this.texcoord=null;
		this.position=null;
		this.offsetX=300;
		this.offsetY=0;
		SkinSV.__super.call(this,/*laya.webgl.shader.d2.ShaderDefines2D.SKINMESH*/0x200,0);
		var _vlen=8 *CONST3D2D.BYTES_PE;
		this.position=[2,/*laya.webgl.WebGLContext.FLOAT*/0x1406,false,_vlen,0];
		this.texcoord=[2,/*laya.webgl.WebGLContext.FLOAT*/0x1406,false,_vlen,2 *CONST3D2D.BYTES_PE];
		this.color=[4,/*laya.webgl.WebGLContext.FLOAT*/0x1406,false,_vlen,4 *CONST3D2D.BYTES_PE];
	}

	__class(SkinSV,'laya.webgl.shader.d2.skinAnishader.SkinSV',_super);
	return SkinSV;
})(Value2D)



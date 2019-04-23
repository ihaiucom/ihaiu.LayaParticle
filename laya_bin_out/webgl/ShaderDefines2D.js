//class laya.webgl.shader.d2.ShaderDefines2D extends laya.webgl.shader.ShaderDefinesBase
var ShaderDefines2D=(function(_super){
	function ShaderDefines2D(){
		ShaderDefines2D.__super.call(this,ShaderDefines2D.__name2int,ShaderDefines2D.__int2name,ShaderDefines2D.__int2nameMap);
	}

	__class(ShaderDefines2D,'laya.webgl.shader.d2.ShaderDefines2D',_super);
	ShaderDefines2D.__init__=function(){
		ShaderDefines2D.reg("TEXTURE2D",0x01);
		ShaderDefines2D.reg("PRIMITIVE",0x04);
		ShaderDefines2D.reg("GLOW_FILTER",0x08);
		ShaderDefines2D.reg("BLUR_FILTER",0x10);
		ShaderDefines2D.reg("COLOR_FILTER",0x20);
		ShaderDefines2D.reg("COLOR_ADD",0x40);
		ShaderDefines2D.reg("WORLDMAT",0x80);
		ShaderDefines2D.reg("FILLTEXTURE",0x100);
		ShaderDefines2D.reg("FSHIGHPRECISION",0x400);
		ShaderDefines2D.reg('MVP3D',0x800);
	}

	ShaderDefines2D.reg=function(name,value){
		ShaderDefinesBase._reg(name,value,ShaderDefines2D.__name2int,ShaderDefines2D.__int2name);
	}

	ShaderDefines2D.toText=function(value,int2name,int2nameMap){
		return ShaderDefinesBase._toText(value,int2name,int2nameMap);
	}

	ShaderDefines2D.toInt=function(names){
		return ShaderDefinesBase._toInt(names,ShaderDefines2D.__name2int);
	}

	ShaderDefines2D.TEXTURE2D=0x01;
	ShaderDefines2D.PRIMITIVE=0x04;
	ShaderDefines2D.FILTERGLOW=0x08;
	ShaderDefines2D.FILTERBLUR=0x10;
	ShaderDefines2D.FILTERCOLOR=0x20;
	ShaderDefines2D.COLORADD=0x40;
	ShaderDefines2D.WORLDMAT=0x80;
	ShaderDefines2D.FILLTEXTURE=0x100;
	ShaderDefines2D.SKINMESH=0x200;
	ShaderDefines2D.SHADERDEFINE_FSHIGHPRECISION=0x400;
	ShaderDefines2D.MVP3D=0x800;
	ShaderDefines2D.NOOPTMASK=0x08|0x10|0x20|0x100;
	ShaderDefines2D.__name2int={};
	ShaderDefines2D.__int2name=[];
	ShaderDefines2D.__int2nameMap=[];
	return ShaderDefines2D;
})(ShaderDefinesBase)



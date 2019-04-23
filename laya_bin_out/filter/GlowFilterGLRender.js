//class laya.filters.GlowFilterGLRender
var GlowFilterGLRender=(function(){
	function GlowFilterGLRender(){}
	__class(GlowFilterGLRender,'laya.filters.GlowFilterGLRender');
	var __proto=GlowFilterGLRender.prototype;
	__proto.setShaderInfo=function(shader,w,h,data){
		shader.defines.add(data.type);
		var sv=shader;
		sv.u_blurInfo1=data._sv_blurInfo1;
		var info2=data._sv_blurInfo2;
		info2[0]=w;info2[1]=h;
		sv.u_blurInfo2=info2;
		sv.u_color=data.getColor();
	}

	__proto.render=function(rt,ctx,width,height,filter){
		var w=width,h=height;
		var svBlur=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
		this.setShaderInfo(svBlur,w,h,filter);
		var svCP=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
		var matI=Matrix.TEMP.identity();
		ctx.drawTarget(rt,0,0,w,h,matI,svBlur);
		ctx.drawTarget(rt,0,0,w,h,matI,svCP);
	}

	return GlowFilterGLRender;
})()


/**
*@private
*/

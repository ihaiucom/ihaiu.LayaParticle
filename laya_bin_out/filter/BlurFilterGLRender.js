//class laya.filters.BlurFilterGLRender
var BlurFilterGLRender=(function(){
	function BlurFilterGLRender(){}
	__class(BlurFilterGLRender,'laya.filters.BlurFilterGLRender');
	var __proto=BlurFilterGLRender.prototype;
	__proto.render=function(rt,ctx,width,height,filter){
		var shaderValue=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
		this.setShaderInfo(shaderValue,filter,rt.width,rt.height);
		ctx.drawTarget(rt,0,0,width,height,Matrix.EMPTY.identity(),shaderValue);
	}

	__proto.setShaderInfo=function(shader,filter,w,h){
		shader.defines.add(/*laya.filters.Filter.BLUR*/0x10);
		var sv=shader;
		BlurFilterGLRender.blurinfo[0]=w;BlurFilterGLRender.blurinfo[1]=h;
		sv.blurInfo=BlurFilterGLRender.blurinfo;
		var sigma=filter.strength/3.0;
		var sigma2=sigma*sigma;
		filter.strength_sig2_2sig2_gauss1[0]=filter.strength;
		filter.strength_sig2_2sig2_gauss1[1]=sigma2;
		filter.strength_sig2_2sig2_gauss1[2]=2.0*sigma2;
		filter.strength_sig2_2sig2_gauss1[3]=1.0/(2.0*Math.PI*sigma2);
		sv.strength_sig2_2sig2_gauss1=filter.strength_sig2_2sig2_gauss1;
	}

	__static(BlurFilterGLRender,
	['blurinfo',function(){return this.blurinfo=new Array(2);}
	]);
	return BlurFilterGLRender;
})()


/**
*模糊滤镜
*/

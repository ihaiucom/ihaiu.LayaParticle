/**
*<code>RenderState</code> 类用于控制渲染状态。
*/
//class laya.d3.core.material.RenderState
var RenderState=(function(){
	function RenderState(){
		/**渲染剔除状态。*/
		this.cull=0;
		/**透明混合。*/
		this.blend=0;
		/**源混合参数,在blend为BLEND_ENABLE_ALL时生效。*/
		this.srcBlend=0;
		/**目标混合参数,在blend为BLEND_ENABLE_ALL时生效。*/
		this.dstBlend=0;
		/**RGB源混合参数,在blend为BLEND_ENABLE_SEPERATE时生效。*/
		this.srcBlendRGB=0;
		/**RGB目标混合参数,在blend为BLEND_ENABLE_SEPERATE时生效。*/
		this.dstBlendRGB=0;
		/**Alpha源混合参数,在blend为BLEND_ENABLE_SEPERATE时生效。*/
		this.srcBlendAlpha=0;
		/**Alpha目标混合参数,在blend为BLEND_ENABLE_SEPERATE时生效。*/
		this.dstBlendAlpha=0;
		/**混合常量颜色。*/
		this.blendConstColor=null;
		/**混合方程。*/
		this.blendEquation=0;
		/**RGB混合方程。*/
		this.blendEquationRGB=0;
		/**Alpha混合方程。*/
		this.blendEquationAlpha=0;
		/**深度测试函数。*/
		this.depthTest=0;
		/**是否深度写入。*/
		this.depthWrite=false;
		this.cull=2;
		this.blend=0;
		this.srcBlend=1;
		this.dstBlend=0;
		this.srcBlendRGB=1;
		this.dstBlendRGB=0;
		this.srcBlendAlpha=1;
		this.dstBlendAlpha=0;
		this.blendConstColor=new Vector4(1,1,1,1);
		this.blendEquation=0;
		this.blendEquationRGB=0;
		this.blendEquationAlpha=0;
		this.depthTest=0x0203;
		this.depthWrite=true;
	}

	__class(RenderState,'laya.d3.core.material.RenderState');
	var __proto=RenderState.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*设置渲染相关状态。
	*/
	__proto._setRenderStateBlendDepth=function(){
		var gl=LayaGL.instance;
		WebGLContext.setDepthMask(gl,this.depthWrite);
		if (this.depthTest===0)
			WebGLContext.setDepthTest(gl,false);
		else {
			WebGLContext.setDepthTest(gl,true);
			WebGLContext.setDepthFunc(gl,this.depthTest);
		}
		switch (this.blend){
			case 0:
				WebGLContext.setBlend(gl,false);
				break ;
			case 1:
				WebGLContext.setBlend(gl,true);
				WebGLContext.setBlendFunc(gl,this.srcBlend,this.dstBlend);
				break ;
			case 2:
				WebGLContext.setBlend(gl,true);
				break ;
			}
	}

	/**
	*设置渲染相关状态。
	*/
	__proto._setRenderStateFrontFace=function(isTarget,transform){
		var gl=LayaGL.instance;
		var forntFace=0;
		switch (this.cull){
			case 0:
				WebGLContext.setCullFace(gl,false);
				break ;
			case 1:
				WebGLContext.setCullFace(gl,true);
				if (isTarget){
					if (transform && transform._isFrontFaceInvert)
						forntFace=/*laya.webgl.WebGLContext.CCW*/0x0901;
					else
					forntFace=/*laya.webgl.WebGLContext.CW*/0x0900;
					}else {
					if (transform && transform._isFrontFaceInvert)
						forntFace=/*laya.webgl.WebGLContext.CW*/0x0900;
					else
					forntFace=/*laya.webgl.WebGLContext.CCW*/0x0901;
				}
				WebGLContext.setFrontFace(gl,forntFace);
				break ;
			case 2:
				WebGLContext.setCullFace(gl,true);
				if (isTarget){
					if (transform && transform._isFrontFaceInvert)
						forntFace=/*laya.webgl.WebGLContext.CW*/0x0900;
					else
					forntFace=/*laya.webgl.WebGLContext.CCW*/0x0901;
					}else {
					if (transform && transform._isFrontFaceInvert)
						forntFace=/*laya.webgl.WebGLContext.CCW*/0x0901;
					else
					forntFace=/*laya.webgl.WebGLContext.CW*/0x0900;
				}
				WebGLContext.setFrontFace(gl,forntFace);
				break ;
			}
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(dest){
		var destState=dest;
		destState.cull=this.cull;
		destState.blend=this.blend;
		destState.srcBlend=this.srcBlend;
		destState.dstBlend=this.dstBlend;
		destState.srcBlendRGB=this.srcBlendRGB;
		destState.dstBlendRGB=this.dstBlendRGB;
		destState.srcBlendAlpha=this.srcBlendAlpha;
		destState.dstBlendAlpha=this.dstBlendAlpha;
		this.blendConstColor.cloneTo(destState.blendConstColor);
		destState.blendEquation=this.blendEquation;
		destState.blendEquationRGB=this.blendEquationRGB;
		destState.blendEquationAlpha=this.blendEquationAlpha;
		destState.depthTest=this.depthTest;
		destState.depthWrite=this.depthWrite;
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

	RenderState.CULL_NONE=0;
	RenderState.CULL_FRONT=1;
	RenderState.CULL_BACK=2;
	RenderState.BLEND_DISABLE=0;
	RenderState.BLEND_ENABLE_ALL=1;
	RenderState.BLEND_ENABLE_SEPERATE=2;
	RenderState.BLENDPARAM_ZERO=0;
	RenderState.BLENDPARAM_ONE=1;
	RenderState.BLENDPARAM_SRC_COLOR=0x0300;
	RenderState.BLENDPARAM_ONE_MINUS_SRC_COLOR=0x0301;
	RenderState.BLENDPARAM_DST_COLOR=0x0306;
	RenderState.BLENDPARAM_ONE_MINUS_DST_COLOR=0x0307;
	RenderState.BLENDPARAM_SRC_ALPHA=0x0302;
	RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA=0x0303;
	RenderState.BLENDPARAM_DST_ALPHA=0x0304;
	RenderState.BLENDPARAM_ONE_MINUS_DST_ALPHA=0x0305;
	RenderState.BLENDPARAM_SRC_ALPHA_SATURATE=0x0308;
	RenderState.BLENDEQUATION_ADD=0;
	RenderState.BLENDEQUATION_SUBTRACT=1;
	RenderState.BLENDEQUATION_REVERSE_SUBTRACT=2;
	RenderState.DEPTHTEST_OFF=0;
	RenderState.DEPTHTEST_NEVER=0x0200;
	RenderState.DEPTHTEST_LESS=0x0201;
	RenderState.DEPTHTEST_EQUAL=0x0202;
	RenderState.DEPTHTEST_LEQUAL=0x0203;
	RenderState.DEPTHTEST_GREATER=0x0204;
	RenderState.DEPTHTEST_NOTEQUAL=0x0205;
	RenderState.DEPTHTEST_GEQUAL=0x0206;
	RenderState.DEPTHTEST_ALWAYS=0x0207;
	return RenderState;
})()


/**

*/
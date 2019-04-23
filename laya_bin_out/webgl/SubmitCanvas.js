//class laya.webgl.submit.SubmitCanvas extends laya.webgl.submit.Submit
var SubmitCanvas=(function(_super){
	function SubmitCanvas(){
		//this.canv=null;
		this._matrix=new Matrix();
		this._matrix4=CONST3D2D.defaultMatrix4.concat();
		SubmitCanvas.__super.call(this,/*laya.webgl.submit.Submit.TYPE_2D*/10000);
		this.shaderValue=new Value2D(0,0);
	}

	__class(SubmitCanvas,'laya.webgl.submit.SubmitCanvas',_super);
	var __proto=SubmitCanvas.prototype;
	__proto.renderSubmit=function(){
		var preAlpha=RenderState2D.worldAlpha;
		var preMatrix4=RenderState2D.worldMatrix4;
		var preMatrix=RenderState2D.worldMatrix;
		var preFilters=RenderState2D.worldFilters;
		var preWorldShaderDefines=RenderState2D.worldShaderDefines;
		var v=this.shaderValue;
		var m=this._matrix;
		var m4=this._matrix4;
		var mout=Matrix.TEMP;
		Matrix.mul(m,preMatrix,mout);
		m4[0]=mout.a;
		m4[1]=mout.b;
		m4[4]=mout.c;
		m4[5]=mout.d;
		m4[12]=mout.tx;
		m4[13]=mout.ty;
		RenderState2D.worldMatrix=mout.clone();
		RenderState2D.worldMatrix4=m4;
		RenderState2D.worldAlpha=RenderState2D.worldAlpha *v.alpha;
		if (v.filters && v.filters.length){
			RenderState2D.worldFilters=v.filters;
			RenderState2D.worldShaderDefines=v.defines;
		}
		this.canv['flushsubmit']();
		RenderState2D.worldAlpha=preAlpha;
		RenderState2D.worldMatrix4=preMatrix4;
		RenderState2D.worldMatrix.destroy();
		RenderState2D.worldMatrix=preMatrix;
		RenderState2D.worldFilters=preFilters;
		RenderState2D.worldShaderDefines=preWorldShaderDefines;
		return 1;
	}

	__proto.releaseRender=function(){
		if((--this._ref)<1){
			var cache=SubmitCanvas.POOL;
			this._mesh=null;
			cache[cache._length++]=this;
		}
	}

	//TODO:coverage
	__proto.clone=function(context,mesh,pos){
		return null;
	}

	//TODO:coverage
	__proto.getRenderType=function(){
		return /*laya.webgl.submit.Submit.TYPE_CANVAS*/10003;
	}

	SubmitCanvas.create=function(canvas,alpha,filters){
		var o=(!SubmitCanvas.POOL._length)? (new SubmitCanvas()):SubmitCanvas.POOL[--SubmitCanvas.POOL._length];
		o.canv=canvas;
		o._ref=1;
		o._numEle=0;
		var v=o.shaderValue;
		v.alpha=alpha;
		v.defines.setValue(0);
		filters && filters.length && v.setFilters(filters);
		return o;
	}

	SubmitCanvas.POOL=(SubmitCanvas.POOL=[],SubmitCanvas.POOL._length=0,SubmitCanvas.POOL);
	return SubmitCanvas;
})(Submit)


/**
*drawImage，fillRect等会用到的简单的mesh。每次添加必然是一个四边形。
*/

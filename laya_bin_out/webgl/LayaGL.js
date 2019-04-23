//class laya.layagl.LayaGL
var LayaGL=(function(){
	function LayaGL(){}
	__class(LayaGL,'laya.layagl.LayaGL');
	var __proto=LayaGL.prototype;
	//TODO:coverage
	__proto.createCommandEncoder=function(reserveSize,adjustSize,isSyncToRenderThread){
		(reserveSize===void 0)&& (reserveSize=128);
		(adjustSize===void 0)&& (adjustSize=64);
		(isSyncToRenderThread===void 0)&& (isSyncToRenderThread=false);
		return new CommandEncoder(this,reserveSize,adjustSize,isSyncToRenderThread);
	}

	__proto.beginCommandEncoding=function(commandEncoder){}
	__proto.endCommandEncoding=function(){}
	__proto.calcMatrixFromScaleSkewRotation=function(nArrayBufferID,matrixFlag,matrixResultID,x,y,pivotX,pivotY,scaleX,scaleY,skewX,skewY,rotate){}
	__proto.setGLTemplate=function(type,templateID){}
	__proto.setEndGLTemplate=function(type,templateID){}
	__proto.matrix4x4Multiply=function(m1,m2,out){}
	__proto.evaluateClipDatasRealTime=function(nodes,playCurTime,realTimeCurrentFrameIndexs,addtive){}
	LayaGL.getFrameCount=function(){
		return 0;
	}

	LayaGL.syncBufferToRenderThread=function(value,index){
		(index===void 0)&& (index=0);
	}

	LayaGL.createArrayBufferRef=function(arrayBuffer,type,syncRender){}
	LayaGL.createArrayBufferRefs=function(arrayBuffer,type,syncRender,refType){}
	LayaGL.EXECUTE_JS_THREAD_BUFFER=0;
	LayaGL.EXECUTE_RENDER_THREAD_BUFFER=1;
	LayaGL.EXECUTE_COPY_TO_RENDER=2;
	LayaGL.EXECUTE_COPY_TO_RENDER3D=3;
	LayaGL.VALUE_OPERATE_ADD=0;
	LayaGL.VALUE_OPERATE_SUB=1;
	LayaGL.VALUE_OPERATE_MUL=2;
	LayaGL.VALUE_OPERATE_DIV=3;
	LayaGL.VALUE_OPERATE_M2_MUL=4;
	LayaGL.VALUE_OPERATE_M3_MUL=5;
	LayaGL.VALUE_OPERATE_M4_MUL=6;
	LayaGL.VALUE_OPERATE_M32_MUL=7;
	LayaGL.VALUE_OPERATE_SET=8;
	LayaGL.VALUE_OPERATE_M32_TRANSLATE=9;
	LayaGL.VALUE_OPERATE_M32_SCALE=10;
	LayaGL.VALUE_OPERATE_M32_ROTATE=11;
	LayaGL.VALUE_OPERATE_M32_SCALE_PIVOT=12;
	LayaGL.VALUE_OPERATE_M32_ROTATE_PIVOT=13;
	LayaGL.VALUE_OPERATE_M32_TRANSFORM_PIVOT=14;
	LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL=15;
	LayaGL.ARRAY_BUFFER_TYPE_DATA=0;
	LayaGL.ARRAY_BUFFER_TYPE_CMD=1;
	LayaGL.ARRAY_BUFFER_REF_REFERENCE=0;
	LayaGL.ARRAY_BUFFER_REF_COPY=1;
	LayaGL.UPLOAD_SHADER_UNIFORM_TYPE_ID=0;
	LayaGL.UPLOAD_SHADER_UNIFORM_TYPE_DATA=1;
	LayaGL.instance=null;
	return LayaGL;
})()


// 注意长宽都不要超过256，一个是影响效率，一个是超出表达能力

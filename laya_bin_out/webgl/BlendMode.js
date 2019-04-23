//class laya.webgl.canvas.BlendMode
var BlendMode=(function(){
	function BlendMode(){}
	__class(BlendMode,'laya.webgl.canvas.BlendMode');
	BlendMode._init_=function(gl){
		BlendMode.fns=[BlendMode.BlendNormal,BlendMode.BlendAdd,BlendMode.BlendMultiply,BlendMode.BlendScreen,BlendMode.BlendOverlay,BlendMode.BlendLight,BlendMode.BlendMask,BlendMode.BlendDestinationOut];
		BlendMode.targetFns=[BlendMode.BlendNormalTarget,BlendMode.BlendAddTarget,BlendMode.BlendMultiplyTarget,BlendMode.BlendScreenTarget,BlendMode.BlendOverlayTarget,BlendMode.BlendLightTarget,BlendMode.BlendMask,BlendMode.BlendDestinationOut];
	}

	BlendMode.BlendNormal=function(gl){
		WebGLContext.setBlendFunc(gl,/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303);
	}

	BlendMode.BlendAdd=function(gl){
		WebGLContext.setBlendFunc(gl,/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.DST_ALPHA*/0x0304);
	}

	BlendMode.BlendMultiply=function(gl){
		WebGLContext.setBlendFunc(gl,/*laya.webgl.WebGLContext.DST_COLOR*/0x0306,/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303);
	}

	BlendMode.BlendScreen=function(gl){
		WebGLContext.setBlendFunc(gl,/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.ONE*/1);
	}

	BlendMode.BlendOverlay=function(gl){
		WebGLContext.setBlendFunc(gl,/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.ONE_MINUS_SRC_COLOR*/0x0301);
	}

	BlendMode.BlendLight=function(gl){
		WebGLContext.setBlendFunc(gl,/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.ONE*/1);
	}

	BlendMode.BlendNormalTarget=function(gl){
		WebGLContext.setBlendFunc(gl,/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303);
	}

	BlendMode.BlendAddTarget=function(gl){
		WebGLContext.setBlendFunc(gl,/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.DST_ALPHA*/0x0304);
	}

	BlendMode.BlendMultiplyTarget=function(gl){
		WebGLContext.setBlendFunc(gl,/*laya.webgl.WebGLContext.DST_COLOR*/0x0306,/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303);
	}

	BlendMode.BlendScreenTarget=function(gl){
		WebGLContext.setBlendFunc(gl,/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.ONE*/1);
	}

	BlendMode.BlendOverlayTarget=function(gl){
		WebGLContext.setBlendFunc(gl,/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.ONE_MINUS_SRC_COLOR*/0x0301);
	}

	BlendMode.BlendLightTarget=function(gl){
		WebGLContext.setBlendFunc(gl,/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.ONE*/1);
	}

	BlendMode.BlendMask=function(gl){
		WebGLContext.setBlendFunc(gl,/*laya.webgl.WebGLContext.ZERO*/0,/*laya.webgl.WebGLContext.SRC_ALPHA*/0x0302);
	}

	BlendMode.BlendDestinationOut=function(gl){
		WebGLContext.setBlendFunc(gl,/*laya.webgl.WebGLContext.ZERO*/0,/*laya.webgl.WebGLContext.ZERO*/0);
	}

	BlendMode.activeBlendFunction=null;
	BlendMode.NAMES=["normal","add","multiply","screen","overlay","light","mask","destination-out"];
	BlendMode.TOINT={"normal":0,"add":1,"multiply":2,"screen":3 ,"overlay":4,"light":5,"mask":6,"destination-out":7,"lighter":1 };
	BlendMode.NORMAL="normal";
	BlendMode.ADD="add";
	BlendMode.MULTIPLY="multiply";
	BlendMode.SCREEN="screen";
	BlendMode.OVERLAY="overlay";
	BlendMode.LIGHT="light";
	BlendMode.MASK="mask";
	BlendMode.DESTINATIONOUT="destination-out";
	BlendMode.LIGHTER="lighter";
	BlendMode.fns=[];
	BlendMode.targetFns=[];
	return BlendMode;
})()



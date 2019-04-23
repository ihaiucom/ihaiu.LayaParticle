//class laya.layagl.cmdNative.ScaleCmdNative
var ScaleCmdNative=(function(){
	function ScaleCmdNative(){
		this._graphicsCmdEncoder=null;
		this._paramData=/*__JS__ */new ParamData(4 *4,true);
	}

	__class(ScaleCmdNative,'laya.layagl.cmdNative.ScaleCmdNative');
	var __proto=ScaleCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("ScaleCmd",this);
	}

	__getset(0,__proto,'cmdID',function(){
		return "Scale";
	});

	__getset(0,__proto,'scaleX',function(){
		return this._paramData._float32Data[0];
		},function(value){
		this._paramData._float32Data[0]=value;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'scaleY',function(){
		return this._paramData._float32Data[1];
		},function(value){
		this._paramData._float32Data[1]=value;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'pivotX',function(){
		return this._paramData._float32Data[2];
		},function(value){
		this._paramData._float32Data[2]=value;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'pivotY',function(){
		return this._paramData._float32Data[3];
		},function(value){
		this._paramData._float32Data[3]=value;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	ScaleCmdNative.create=function(scaleX,scaleY,pivotX,pivotY){
		var cmd=Pool.getItemByClass("ScaleCmd",ScaleCmdNative);
		var cbuf=cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;
		var f32=cmd._paramData._float32Data;
		f32[0]=scaleX;
		f32[1]=scaleY;
		f32[2]=pivotX;
		f32[3]=pivotY;
		var nDataID=cmd._paramData.getPtrID();
		LayaGL.syncBufferToRenderThread(cmd._paramData);
		cbuf.setGlobalValueEx(LayaNative2D.GLOBALVALUE_MATRIX32,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_SCALE_PIVOT*/12,nDataID,0);
		LayaGL.syncBufferToRenderThread(cbuf);
		return cmd;
	}

	ScaleCmdNative.ID="Scale";
	return ScaleCmdNative;
})()



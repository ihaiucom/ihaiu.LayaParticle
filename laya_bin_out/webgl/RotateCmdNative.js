//class laya.layagl.cmdNative.RotateCmdNative
var RotateCmdNative=(function(){
	function RotateCmdNative(){
		this._graphicsCmdEncoder=null;
		this._paramData=/*__JS__ */new ParamData(3 *4,true);
	}

	__class(RotateCmdNative,'laya.layagl.cmdNative.RotateCmdNative');
	var __proto=RotateCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("RotateCmd",this);
	}

	__getset(0,__proto,'cmdID',function(){
		return "Rotate";
	});

	__getset(0,__proto,'angle',function(){
		return this._paramData._float32Data[0];
		},function(value){
		this._paramData._float32Data[0]=value;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'pivotX',function(){
		return this._paramData._float32Data[1];
		},function(value){
		this._paramData._float32Data[1]=value;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'pivotY',function(){
		return this._paramData._float32Data[2];
		},function(value){
		this._paramData._float32Data[2]=value;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	RotateCmdNative.create=function(angle,pivotX,pivotY){
		var cmd=Pool.getItemByClass("RotateCmd",RotateCmdNative);
		var cbuf=cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;
		var f32=cmd._paramData._float32Data;
		f32[0]=angle;
		f32[1]=pivotX;
		f32[2]=pivotY;
		var nDataID=cmd._paramData.getPtrID();
		LayaGL.syncBufferToRenderThread(cmd._paramData);
		cbuf.setGlobalValueEx(LayaNative2D.GLOBALVALUE_MATRIX32,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_ROTATE_PIVOT*/13,nDataID,0);
		LayaGL.syncBufferToRenderThread(cbuf);
		return cmd;
	}

	RotateCmdNative.ID="Rotate";
	return RotateCmdNative;
})()


/**
*...
*@author ww
*/

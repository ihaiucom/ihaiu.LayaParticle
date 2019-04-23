//class laya.layagl.cmdNative.TransformCmdNative
var TransformCmdNative=(function(){
	function TransformCmdNative(){
		this._graphicsCmdEncoder=null;
		this._matrix=null;
		this._paramData=/*__JS__ */new ParamData(8*4,true);
	}

	__class(TransformCmdNative,'laya.layagl.cmdNative.TransformCmdNative');
	var __proto=TransformCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._matrix=null;
		Pool.recover("TransformCmd",this);
	}

	__getset(0,__proto,'cmdID',function(){
		return "Transform";
	});

	__getset(0,__proto,'matrix',function(){
		return this._matrix;
		},function(value){
		this._matrix=value;
		var _fb=this._paramData._float32Data;
		_fb[0]=this._matrix.a;_fb[1]=this._matrix.b;_fb[2]=this._matrix.c;
		_fb[3]=this._matrix.d;_fb[4]=this._matrix.tx;_fb[5]=this._matrix.ty;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'pivotX',function(){
		return this._paramData._float32Data[6];
		},function(value){
		this._paramData._float32Data[6]=value;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'pivotY',function(){
		return this._paramData._float32Data[7];
		},function(value){
		this._paramData._float32Data[7]=value;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	TransformCmdNative.create=function(matrix,pivotX,pivotY){
		var cmd=Pool.getItemByClass("TransformCmd",TransformCmdNative);
		var cbuf=cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;
		var f32=cmd._paramData._float32Data;
		f32[0]=matrix.a;f32[1]=matrix.b;f32[2]=matrix.c;
		f32[3]=matrix.d;f32[4]=matrix.tx;f32[5]=matrix.ty;
		f32[6]=pivotX;f32[7]=pivotY;
		cmd._matrix=matrix;
		var nDataID=cmd._paramData.getPtrID();
		LayaGL.syncBufferToRenderThread(cmd._paramData);
		cbuf.setGlobalValueEx(LayaNative2D.GLOBALVALUE_MATRIX32,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_TRANSFORM_PIVOT*/14,nDataID,0);
		LayaGL.syncBufferToRenderThread(cbuf);
		return cmd;
	}

	TransformCmdNative.ID="Transform";
	return TransformCmdNative;
})()


/**
*...
*@author ww
*/

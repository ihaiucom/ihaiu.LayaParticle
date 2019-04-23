//class laya.layagl.cmdNative.TranslateCmdNative
var TranslateCmdNative=(function(){
	function TranslateCmdNative(){
		this._graphicsCmdEncoder=null;
		this._paramData=/*__JS__ */new ParamData(2 *4,true);
	}

	__class(TranslateCmdNative,'laya.layagl.cmdNative.TranslateCmdNative');
	var __proto=TranslateCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("TranslateCmd",this);
	}

	__getset(0,__proto,'ty',function(){
		return this._paramData._float32Data[1];
		},function(value){
		this._paramData._float32Data[1]=value;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'cmdID',function(){
		return "Translate";
	});

	__getset(0,__proto,'tx',function(){
		return this._paramData._float32Data[0];
		},function(value){
		this._paramData._float32Data[0]=value;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	TranslateCmdNative.create=function(tx,ty){
		var cmd=Pool.getItemByClass("TranslateCmd",TranslateCmdNative);
		var cbuf=cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;
		var f32=cmd._paramData._float32Data;
		f32[0]=tx;
		f32[1]=ty;
		var nDataID=cmd._paramData.getPtrID();
		LayaGL.syncBufferToRenderThread(cmd._paramData);
		cbuf.setGlobalValueEx(LayaNative2D.GLOBALVALUE_MATRIX32,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_TRANSLATE*/9,nDataID,0);
		LayaGL.syncBufferToRenderThread(cbuf);
		return cmd;
	}

	TranslateCmdNative.ID="Translate";
	return TranslateCmdNative;
})()


/**
*@private
*封装GL命令
*/

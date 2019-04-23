//class laya.layagl.cmdNative.RestoreCmdNative
var RestoreCmdNative=(function(){
	function RestoreCmdNative(){
		this._graphicsCmdEncoder=null;
	}

	__class(RestoreCmdNative,'laya.layagl.cmdNative.RestoreCmdNative');
	var __proto=RestoreCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("RestoreCmd",this);
	}

	__getset(0,__proto,'cmdID',function(){
		return "Restore";
	});

	RestoreCmdNative.create=function(){
		var cmd=Pool.getItemByClass("RestoreCmd",RestoreCmdNative);
		var cbuf=cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		cbuf.restore();
		LayaGL.syncBufferToRenderThread(cbuf);
		return cmd;
	}

	RestoreCmdNative.ID="Restore";
	return RestoreCmdNative;
})()


/**
*WebGLRTMgr 管理WebGLRenderTarget的创建和回收
*/

//class laya.layagl.cmdNative.SaveCmdNative
var SaveCmdNative=(function(){
	function SaveCmdNative(){
		this._graphicsCmdEncoder=null;
	}

	__class(SaveCmdNative,'laya.layagl.cmdNative.SaveCmdNative');
	var __proto=SaveCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("SaveCmd",this);
	}

	__getset(0,__proto,'cmdID',function(){
		return "Save";
	});

	SaveCmdNative.create=function(){
		var cmd=Pool.getItemByClass("SaveCmd",SaveCmdNative);
		var cbuf=cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		cbuf.save();
		LayaGL.syncBufferToRenderThread(cbuf);
		return cmd;
	}

	SaveCmdNative.ID="Save";
	return SaveCmdNative;
})()


/**
*...
*@author ...
*/

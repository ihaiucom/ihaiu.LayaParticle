//class laya.layagl.cmdNative.ClipRectCmdNative
var ClipRectCmdNative=(function(){
	function ClipRectCmdNative(){
		this._graphicsCmdEncoder=null;
		this._paramData=/*__JS__ */new ParamData(4 *4,true);
	}

	__class(ClipRectCmdNative,'laya.layagl.cmdNative.ClipRectCmdNative');
	var __proto=ClipRectCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("ClipRectCmd",this);
	}

	__getset(0,__proto,'cmdID',function(){
		return "ClipRect";
	});

	__getset(0,__proto,'width',function(){
		return 0;
		},function(value){
	});

	__getset(0,__proto,'x',function(){
		return 0;
		},function(value){
	});

	__getset(0,__proto,'y',function(){
		return 0;
		},function(value){
	});

	__getset(0,__proto,'height',function(){
		return 0;
		},function(value){
	});

	ClipRectCmdNative.create=function(x,y,w,h){
		var cmd=Pool.getItemByClass("ClipRectCmd",ClipRectCmdNative);
		cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;
		var cbuf=cmd._graphicsCmdEncoder;
		var f32=cmd._paramData._float32Data;
		f32[0]=x;
		f32[1]=y;
		f32[2]=w;
		f32[3]=h;
		var nDataID=cmd._paramData.getPtrID();
		LayaGL.syncBufferToRenderThread(cmd._paramData);
		cbuf.setClipValueEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,LayaNative2D.GLOBALVALUE_MATRIX32,nDataID);
		LayaGL.syncBufferToRenderThread(cbuf);
		return cmd;
	}

	ClipRectCmdNative.ID="ClipRect";
	return ClipRectCmdNative;
})()


/**
*...
*@author ww
*/

//class laya.layagl.cmdNative.AlphaCmdNative
var AlphaCmdNative=(function(){
	function AlphaCmdNative(){
		//this._graphicsCmdEncoder=null;
		//this._alpha=NaN;
		this._paramData=/*__JS__ */new ParamData(4,true);
	}

	__class(AlphaCmdNative,'laya.layagl.cmdNative.AlphaCmdNative');
	var __proto=AlphaCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("AlphaCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.alpha(this._alpha);
	}

	__getset(0,__proto,'cmdID',function(){
		return "Alpha";
	});

	__getset(0,__proto,'alpha',function(){
		return this._alpha;
		},function(value){
		value=value > 1 ? 1:value;
		value=value < 0 ? 0:value;
		this._alpha=value;
		var nColor=0x00ffffff;
		nColor=((value *255)<< 24)| nColor;
		this._paramData._int32Data[0]=nColor;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	AlphaCmdNative.create=function(alpha){
		var cmd=Pool.getItemByClass("AlphaCmd",AlphaCmdNative);
		var cbuf=cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;
		cmd.alpha=alpha;
		cbuf.setGlobalValueEx(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15,cmd._paramData.getPtrID(),0);
		LayaGL.syncBufferToRenderThread(cbuf);
		return cmd;
	}

	AlphaCmdNative.ID="Alpha";
	return AlphaCmdNative;
})()



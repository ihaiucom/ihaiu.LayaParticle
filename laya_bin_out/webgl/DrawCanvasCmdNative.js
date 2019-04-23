//class laya.layagl.cmdNative.DrawCanvasCmdNative
var DrawCanvasCmdNative=(function(){
	function DrawCanvasCmdNative(){
		this._graphicsCmdEncoder=null;
		this._index=0;
		this._paramData=null;
		this._texture=null;
		this._x=NaN;
		this._y=NaN;
		this._width=NaN;
		this._height=NaN;
	}

	__class(DrawCanvasCmdNative,'laya.layagl.cmdNative.DrawCanvasCmdNative');
	var __proto=DrawCanvasCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._graphicsCmdEncoder=null;
		Pool.recover("DrawCanvasCmd",this);
	}

	__getset(0,__proto,'cmdID',function(){
		return "DrawCanvas";
	});

	__getset(0,__proto,'y',function(){
		return this._y;
		},function(value){
		this._y=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+1]=this._y;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+7]=this._y;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+13]=this._y+this._height;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+19]=this._y+this._height;
		_fb[DrawCanvasCmdNative._PARAM_CLIP_SIZE+1]=value+/*laya.display.css.CacheStyle.CANVAS_EXTEND_EDGE*/16;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'texture',function(){
		return this._texture;
		},function(value){
		this._texture=value;
		this._paramData._int32Data[DrawCanvasCmdNative._PARAM_TEXTURE_POS_]=this._texture._getSource().id;
		var _fb=this._paramData._float32Data;
		var uv=RenderTexture2D.flipyuv;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+2]=uv[0];_fb[DrawCanvasCmdNative._PARAM_VB_POS_+3]=uv[1];
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+8]=uv[2];_fb[DrawCanvasCmdNative._PARAM_VB_POS_+9]=uv[3];
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+14]=uv[4];_fb[DrawCanvasCmdNative._PARAM_VB_POS_+15]=uv[5];
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+20]=uv[6];_fb[DrawCanvasCmdNative._PARAM_VB_POS_+21]=uv[7];
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'width',function(){
		return this._width;
		},function(value){
		this._width=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_]=this._x;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+6]=this._x+this._width;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+12]=this._x+this._width;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+18]=this._x;
		_fb[DrawCanvasCmdNative._PARAM_CLIP_SIZE+2]=value-/*laya.display.css.CacheStyle.CANVAS_EXTEND_EDGE*/16*2;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'x',function(){
		return this._x;
		},function(value){
		this._x=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_]=this._x;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+6]=this._x+this._width;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+12]=this._x+this._width;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+18]=this._x;
		_fb[DrawCanvasCmdNative._PARAM_CLIP_SIZE]=value+/*laya.display.css.CacheStyle.CANVAS_EXTEND_EDGE*/16;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'height',function(){
		return this._height;
		},function(value){
		this._height=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+1]=this._y;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+7]=this._y;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+13]=this._y+this._height;
		_fb[DrawCanvasCmdNative._PARAM_VB_POS_+19]=this._y+this._height;
		_fb[DrawCanvasCmdNative._PARAM_CLIP_SIZE+3]=value-/*laya.display.css.CacheStyle.CANVAS_EXTEND_EDGE*/16*2;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	DrawCanvasCmdNative.create=function(texture,x,y,width,height){
		var cmd=Pool.getItemByClass("DrawCanvasCmd",DrawCanvasCmdNative);
		cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		DrawCanvasCmdNative.createCommandEncoder();
		if (!cmd._paramData){
			cmd._paramData=/*__JS__ */new ParamData(33*4,true);
		}
		cmd._texture=texture;
		cmd._x=x;
		cmd._y=y;
		cmd._width=width;
		cmd._height=height;
		DrawCanvasCmdNative.setParamData(cmd._paramData,texture,x,y,width,height);
		var id1=DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_.getPtrID();
		var id2=cmd._paramData.getPtrID();
		cmd._graphicsCmdEncoder.useCommandEncoder(id1,id2,-1);
		LayaGL.syncBufferToRenderThread(cmd._graphicsCmdEncoder);
		return cmd;
	}

	DrawCanvasCmdNative.createCommandEncoder=function(){
		if (!DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_){
			DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(172,32,true);
			DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWTEXTURE);
			DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHQUADTEXTURE);
			DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_.uniformTextureByParamData(0,1*4,DrawCanvasCmdNative._PARAM_TEXTURE_POS_*4);
			DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_.setRectMeshByParamData(3*4,DrawCanvasCmdNative._PARAM_VB_POS_*4,4*4);
			DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_);
		}
	}

	DrawCanvasCmdNative.setParamData=function(_paramData,texture,x,y,width,height){
		var _fb=_paramData._float32Data;
		var _i32b=_paramData._int32Data;
		_i32b[0]=3;
		_i32b[1]=/*laya.webgl.WebGLContext.TEXTURE0*/0x84C0;
		_i32b[DrawCanvasCmdNative._PARAM_TEXTURE_POS_]=texture._getSource().id;
		_i32b[3]=1;
		_i32b[4]=24 *4;
		var w=width !=0 ? width :texture.width;
		var h=height !=0 ? height :texture.height;
		var uv=RenderTexture2D.flipyuv;
		var ix=DrawCanvasCmdNative._PARAM_VB_POS_;
		_fb[ix++]=x;_fb[ix++]=y;_fb[ix++]=uv[0];_fb[ix++]=uv[1];_i32b[ix++]=0xffffffff;_i32b[ix++]=0xffffffff;
		_fb[ix++]=x+w;_fb[ix++]=y;_fb[ix++]=uv[2];_fb[ix++]=uv[3];_i32b[ix++]=0xffffffff;_i32b[ix++]=0xffffffff;
		_fb[ix++]=x+w;_fb[ix++]=y+h;_fb[ix++]=uv[4];_fb[ix++]=uv[5];_i32b[ix++]=0xffffffff;_i32b[ix++]=0xffffffff;
		_fb[ix++]=x;_fb[ix++]=y+h;_fb[ix++]=uv[6];_fb[ix++]=uv[7];_i32b[ix++]=0xffffffff;_i32b[ix++]=0xffffffff;
		_fb[DrawCanvasCmdNative._PARAM_CLIP_SIZE]=x+/*laya.display.css.CacheStyle.CANVAS_EXTEND_EDGE*/16;
		_fb[DrawCanvasCmdNative._PARAM_CLIP_SIZE+1]=y+/*laya.display.css.CacheStyle.CANVAS_EXTEND_EDGE*/16;
		_fb[DrawCanvasCmdNative._PARAM_CLIP_SIZE+2]=width-/*laya.display.css.CacheStyle.CANVAS_EXTEND_EDGE*/16*2;
		_fb[DrawCanvasCmdNative._PARAM_CLIP_SIZE+3]=height-/*laya.display.css.CacheStyle.CANVAS_EXTEND_EDGE*/16*2;
		LayaGL.syncBufferToRenderThread(_paramData);
	}

	DrawCanvasCmdNative.ID="DrawCanvas";
	DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_=null;
	DrawCanvasCmdNative._PARAM_TEXTURE_POS_=2;
	DrawCanvasCmdNative._PARAM_VB_POS_=5;
	DrawCanvasCmdNative._PARAM_CLIP_SIZE=29;
	return DrawCanvasCmdNative;
})()



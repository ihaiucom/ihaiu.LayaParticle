//class laya.layagl.cmdNative.DrawImageCmdNative
var DrawImageCmdNative=(function(){
	function DrawImageCmdNative(){
		this._graphicsCmdEncoder=null;
		this._index=0;
		this._paramData=null;
		this._texture=null;
		this._x=NaN;
		this._y=NaN;
		this._width=NaN;
		this._height=NaN;
	}

	__class(DrawImageCmdNative,'laya.layagl.cmdNative.DrawImageCmdNative');
	var __proto=DrawImageCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._texture._removeReference();
		this._texture=null;
		this._graphicsCmdEncoder=null;
		Pool.recover("DrawImageCmd",this);
	}

	__getset(0,__proto,'cmdID',function(){
		return "DrawImage";
	});

	__getset(0,__proto,'y',function(){
		return this._y;
		},function(value){
		this._y=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawImageCmdNative._PARAM_VB_POS_+1]=this._y;
		_fb[DrawImageCmdNative._PARAM_VB_POS_+7]=this._y;
		_fb[DrawImageCmdNative._PARAM_VB_POS_+13]=this._y+this._height;
		_fb[DrawImageCmdNative._PARAM_VB_POS_+19]=this._y+this._height;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'texture',function(){
		return this._texture;
		},function(value){
		this._texture=value;
		this._paramData._int32Data[DrawImageCmdNative._PARAM_TEXTURE_POS_]=this._texture.bitmap._glTexture.id;
		var _fb=this._paramData._float32Data;
		var uv=this._texture.uv;
		_fb[DrawImageCmdNative._PARAM_VB_POS_+2]=uv[0];_fb[DrawImageCmdNative._PARAM_VB_POS_+3]=uv[1];
		_fb[DrawImageCmdNative._PARAM_VB_POS_+8]=uv[2];_fb[DrawImageCmdNative._PARAM_VB_POS_+9]=uv[3];
		_fb[DrawImageCmdNative._PARAM_VB_POS_+14]=uv[4];_fb[DrawImageCmdNative._PARAM_VB_POS_+15]=uv[5];
		_fb[DrawImageCmdNative._PARAM_VB_POS_+20]=uv[6];_fb[DrawImageCmdNative._PARAM_VB_POS_+21]=uv[7];
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'width',function(){
		return this._width;
		},function(value){
		this._width=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawImageCmdNative._PARAM_VB_POS_]=this._x;
		_fb[DrawImageCmdNative._PARAM_VB_POS_+6]=this._x+this._width;
		_fb[DrawImageCmdNative._PARAM_VB_POS_+12]=this._x+this._width;
		_fb[DrawImageCmdNative._PARAM_VB_POS_+18]=this._x;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'x',function(){
		return this._x;
		},function(value){
		this._x=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawImageCmdNative._PARAM_VB_POS_]=this._x;
		_fb[DrawImageCmdNative._PARAM_VB_POS_+6]=this._x+this._width;
		_fb[DrawImageCmdNative._PARAM_VB_POS_+12]=this._x+this._width;
		_fb[DrawImageCmdNative._PARAM_VB_POS_+18]=this._x;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'height',function(){
		return this._height;
		},function(value){
		this._height=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawImageCmdNative._PARAM_VB_POS_+1]=this._y;
		_fb[DrawImageCmdNative._PARAM_VB_POS_+7]=this._y;
		_fb[DrawImageCmdNative._PARAM_VB_POS_+13]=this._y+this._height;
		_fb[DrawImageCmdNative._PARAM_VB_POS_+19]=this._y+this._height;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	DrawImageCmdNative.create=function(texture,x,y,width,height){
		var cmd=Pool.getItemByClass("DrawImageCmd",DrawImageCmdNative);
		cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		if (!DrawImageCmdNative._DRAW_IMAGE_CMD_ENCODER_){
			DrawImageCmdNative._DRAW_IMAGE_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(172,32,true);
			DrawImageCmdNative._DRAW_IMAGE_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawImageCmdNative._DRAW_IMAGE_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWTEXTURE);
			DrawImageCmdNative._DRAW_IMAGE_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHQUADTEXTURE);
			DrawImageCmdNative._DRAW_IMAGE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawImageCmdNative._DRAW_IMAGE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawImageCmdNative._DRAW_IMAGE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawImageCmdNative._DRAW_IMAGE_CMD_ENCODER_.uniformTextureByParamData(0,1 *4,DrawImageCmdNative._PARAM_TEXTURE_POS_ *4);
			DrawImageCmdNative._DRAW_IMAGE_CMD_ENCODER_.setRectMeshByParamData(3*4,DrawImageCmdNative._PARAM_VB_POS_*4,4*4);
			DrawImageCmdNative._DRAW_IMAGE_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawImageCmdNative._DRAW_IMAGE_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawImageCmdNative._DRAW_IMAGE_CMD_ENCODER_);
		}
		if (!cmd._paramData){
			cmd._paramData=/*__JS__ */new ParamData(29*4,true);
			}{
			cmd._texture=texture;
			texture._addReference();
			cmd._x=x;
			cmd._y=y;
			cmd._width=width;
			cmd._height=height;
			var _fb=cmd._paramData._float32Data;
			var _i32b=cmd._paramData._int32Data;
			_i32b[0]=3;
			_i32b[1]=/*laya.webgl.WebGLContext.TEXTURE0*/0x84C0;
			_i32b[DrawImageCmdNative._PARAM_TEXTURE_POS_]=texture.getIsReady()? texture.bitmap._glTexture.id :0;
			_i32b[3]=1;
			_i32b[4]=24 *4;
			var w=width !=0 ? width :texture.bitmap.width;
			var h=height !=0 ? height :texture.bitmap.height;
			var uv=texture.uv;
			var ix=DrawImageCmdNative._PARAM_VB_POS_;
			_fb[ix++]=x;_fb[ix++]=y;_fb[ix++]=uv[0];_fb[ix++]=uv[1];_i32b[ix++]=0xffffffff;_i32b[ix++]=0xffffffff;
			_fb[ix++]=x+w;_fb[ix++]=y;_fb[ix++]=uv[2];_fb[ix++]=uv[3];_i32b[ix++]=0xffffffff;_i32b[ix++]=0xffffffff;
			_fb[ix++]=x+w;_fb[ix++]=y+h;_fb[ix++]=uv[4];_fb[ix++]=uv[5];_i32b[ix++]=0xffffffff;_i32b[ix++]=0xffffffff;
			_fb[ix++]=x;_fb[ix++]=y+h;_fb[ix++]=uv[6];_fb[ix++]=uv[7];_i32b[ix++]=0xffffffff;_i32b[ix++]=0xffffffff;
			LayaGL.syncBufferToRenderThread(cmd._paramData);
		}
		cmd._graphicsCmdEncoder.useCommandEncoder(DrawImageCmdNative._DRAW_IMAGE_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		LayaGL.syncBufferToRenderThread(cmd._graphicsCmdEncoder);
		return cmd;
	}

	DrawImageCmdNative.ID="DrawImage";
	DrawImageCmdNative._DRAW_IMAGE_CMD_ENCODER_=null;
	DrawImageCmdNative._PARAM_TEXTURE_POS_=2;
	DrawImageCmdNative._PARAM_VB_POS_=5;
	return DrawImageCmdNative;
})()


/**
*...
*@author ww
*/

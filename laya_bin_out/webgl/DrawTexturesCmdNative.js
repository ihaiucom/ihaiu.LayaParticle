//class laya.layagl.cmdNative.DrawTexturesCmdNative
var DrawTexturesCmdNative=(function(){
	function DrawTexturesCmdNative(){
		this._graphicsCmdEncoder=null;
		this._index=0;
		this._paramData=null;
		this._texture=null;
		this._pos=null;
		this._rectNum=0;
		this._vbSize=0;
		this.vbBuffer=null;
	}

	__class(DrawTexturesCmdNative,'laya.layagl.cmdNative.DrawTexturesCmdNative');
	var __proto=DrawTexturesCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._texture=null;
		this._pos=null;
		Pool.recover("DrawTexturesCmd",this);
	}

	__getset(0,__proto,'cmdID',function(){
		return "DrawTextures";
	});

	__getset(0,__proto,'texture',function(){
		return this._texture;
		},function(value){
		this._texture=value;
		var w=this._texture.bitmap.width;
		var h=this._texture.bitmap.height;
		var uv=this._texture.uv;
		var _vb=this.vbBuffer._float32Data;
		var _vb_i32b=this.vbBuffer._int32Data;
		var ix=0;
		for (var i=0;i < this._rectNum;i++){
			var x=this.pos[i *2];
			var y=this.pos[i *2+1];
			_vb[ix++]=x;
			_vb[ix++]=y;
			_vb[ix++]=uv[0];
			_vb[ix++]=uv[1];
			_vb_i32b[ix++]=0xffffffff;
			_vb_i32b[ix++]=0xffffffff;
			_vb[ix++]=x+w;
			_vb[ix++]=y;
			_vb[ix++]=uv[2];
			_vb[ix++]=uv[3];
			_vb_i32b[ix++]=0xffffffff;
			_vb_i32b[ix++]=0xffffffff;
			_vb[ix++]=x+w;
			_vb[ix++]=y+h;
			_vb[ix++]=uv[4];
			_vb[ix++]=uv[5];
			_vb_i32b[ix++]=0xffffffff;
			_vb_i32b[ix++]=0xffffffff;
			_vb[ix++]=x;
			_vb[ix++]=y+h;
			_vb[ix++]=uv[6];
			_vb[ix++]=uv[7];
			_vb_i32b[ix++]=0xffffffff;
			_vb_i32b[ix++]=0xffffffff;
		};
		var _i32b=this._paramData._int32Data;
		_i32b[DrawTexturesCmdNative._PARAM_TEXLOCATION_POS_]=/*laya.webgl.WebGLContext.TEXTURE0*/0x84C0;
		_i32b[DrawTexturesCmdNative._PARAM_TEXTURE_POS_]=this._texture.bitmap._glTexture.id;
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'pos',function(){
		return this._pos;
		},function(value){
		this._pos=value;
		var nRectNum=this._pos.length / 2;
		var w=this._texture.bitmap.width;
		var h=this._texture.bitmap.height;
		var uv=this._texture.uv;
		if (!this.vbBuffer || this.vbBuffer.getByteLength()< nRectNum *24*4){
			this.vbBuffer=/*__JS__ */new ParamData(nRectNum*24*4,true);
		}
		this._vbSize=nRectNum *24 *4;
		this._rectNum=nRectNum;
		var _vb=this.vbBuffer._float32Data;
		var _vb_i32b=this.vbBuffer._int32Data;
		var ix=0;
		for (var i=0;i < nRectNum;i++){
			var x=this.pos[i *2];
			var y=this.pos[i *2+1];
			_vb[ix++]=x;_vb[ix++]=y;_vb[ix++]=uv[0];_vb[ix++]=uv[1];_vb_i32b[ix++]=0xffffffff;_vb_i32b[ix++]=0xffffffff;
			_vb[ix++]=x+w;_vb[ix++]=y;_vb[ix++]=uv[2];_vb[ix++]=uv[3];_vb_i32b[ix++]=0xffffffff;_vb_i32b[ix++]=0xffffffff;
			_vb[ix++]=x+w;_vb[ix++]=y+h;_vb[ix++]=uv[4];_vb[ix++]=uv[5];_vb_i32b[ix++]=0xffffffff;_vb_i32b[ix++]=0xffffffff;
			_vb[ix++]=x;_vb[ix++]=y+h;_vb[ix++]=uv[6];_vb[ix++]=uv[7];_vb_i32b[ix++]=0xffffffff;_vb_i32b[ix++]=0xffffffff;
		};
		var _fb=this._paramData._float32Data;
		var _i32b=this._paramData._int32Data;
		_i32b[DrawTexturesCmdNative._PARAM_RECT_NUM_POS_]=this._rectNum;
		_i32b[DrawTexturesCmdNative._PARAM_VB_POS_]=this.vbBuffer.getPtrID();
		_i32b[DrawTexturesCmdNative._PARAM_VB_SIZE_POS_]=this._vbSize;
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	DrawTexturesCmdNative.create=function(texture,pos){
		var cmd=Pool.getItemByClass("DrawTexturesCmd",DrawTexturesCmdNative);
		cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		if (!DrawTexturesCmdNative._DRAW_TEXTURES_CMD_ENCODER_){
			DrawTexturesCmdNative._DRAW_TEXTURES_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(124,32,true);
			DrawTexturesCmdNative._DRAW_TEXTURES_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawTexturesCmdNative._DRAW_TEXTURES_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWTEXTURE);
			DrawTexturesCmdNative._DRAW_TEXTURES_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHQUADTEXTURE);
			DrawTexturesCmdNative._DRAW_TEXTURES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawTexturesCmdNative._DRAW_TEXTURES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawTexturesCmdNative._DRAW_TEXTURES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawTexturesCmdNative._DRAW_TEXTURES_CMD_ENCODER_.uniformTextureByParamData(DrawTexturesCmdNative._PARAM_UNIFORMLOCATION_POS_,DrawTexturesCmdNative._PARAM_TEXLOCATION_POS_*4,DrawTexturesCmdNative._PARAM_TEXTURE_POS_*4);
			DrawTexturesCmdNative._DRAW_TEXTURES_CMD_ENCODER_.setRectMeshExByParamData(DrawTexturesCmdNative._PARAM_RECT_NUM_POS_*4,DrawTexturesCmdNative._PARAM_VB_POS_ *4,DrawTexturesCmdNative._PARAM_VB_SIZE_POS_ *4,DrawTexturesCmdNative._PARAM_VB_OFFSET_POS_ *4);
			DrawTexturesCmdNative._DRAW_TEXTURES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawTexturesCmdNative._DRAW_TEXTURES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawTexturesCmdNative._DRAW_TEXTURES_CMD_ENCODER_);
		}
		if (!cmd._paramData){
			cmd._paramData=/*__JS__ */new ParamData(7*4,true);
			}{
			cmd._texture=texture;
			cmd._pos=pos;
			var w=texture.bitmap.width;
			var h=texture.bitmap.height;
			var uv=texture.uv;
			var nRectNum=pos.length / 2;
			if (!cmd.vbBuffer || cmd.vbBuffer.getByteLength()< nRectNum *24*4){
				cmd.vbBuffer=/*__JS__ */new ParamData(nRectNum*24*4,true);
			}
			cmd._vbSize=nRectNum *24 *4;
			cmd._rectNum=nRectNum;
			var _vb=cmd.vbBuffer._float32Data;
			var _vb_i32b=cmd.vbBuffer._int32Data;
			var ix=0;
			for (var i=0;i < nRectNum;i++){
				var x=pos[i *2];
				var y=pos[i *2+1];
				_vb[ix++]=x;_vb[ix++]=y;_vb[ix++]=uv[0];_vb[ix++]=uv[1];_vb_i32b[ix++]=0xffffffff;_vb_i32b[ix++]=0xffffffff;
				_vb[ix++]=x+w;_vb[ix++]=y;_vb[ix++]=uv[2];_vb[ix++]=uv[3];_vb_i32b[ix++]=0xffffffff;_vb_i32b[ix++]=0xffffffff;
				_vb[ix++]=x+w;_vb[ix++]=y+h;_vb[ix++]=uv[4];_vb[ix++]=uv[5];_vb_i32b[ix++]=0xffffffff;_vb_i32b[ix++]=0xffffffff;
				_vb[ix++]=x;_vb[ix++]=y+h;_vb[ix++]=uv[6];_vb[ix++]=uv[7];_vb_i32b[ix++]=0xffffffff;_vb_i32b[ix++]=0xffffffff;
			};
			var _fb=cmd._paramData._float32Data;
			var _i32b=cmd._paramData._int32Data;
			_i32b[DrawTexturesCmdNative._PARAM_UNIFORMLOCATION_POS_]=3;
			_i32b[DrawTexturesCmdNative._PARAM_TEXLOCATION_POS_]=/*laya.webgl.WebGLContext.TEXTURE0*/0x84C0;
			_i32b[DrawTexturesCmdNative._PARAM_TEXTURE_POS_]=texture.bitmap._glTexture.id;
			_i32b[DrawTexturesCmdNative._PARAM_RECT_NUM_POS_]=cmd._rectNum;
			_i32b[DrawTexturesCmdNative._PARAM_VB_POS_]=cmd.vbBuffer.getPtrID();
			_i32b[DrawTexturesCmdNative._PARAM_VB_SIZE_POS_]=cmd._vbSize;
			_i32b[DrawTexturesCmdNative._PARAM_VB_OFFSET_POS_]=0;
			LayaGL.syncBufferToRenderThread(cmd.vbBuffer);
			LayaGL.syncBufferToRenderThread(cmd._paramData);
		}
		cmd._graphicsCmdEncoder.useCommandEncoder(DrawTexturesCmdNative._DRAW_TEXTURES_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		LayaGL.syncBufferToRenderThread(cmd._graphicsCmdEncoder);
		return cmd;
	}

	DrawTexturesCmdNative.ID="DrawTextures";
	DrawTexturesCmdNative._DRAW_TEXTURES_CMD_ENCODER_=null;
	DrawTexturesCmdNative._PARAM_UNIFORMLOCATION_POS_=0;
	DrawTexturesCmdNative._PARAM_TEXLOCATION_POS_=1;
	DrawTexturesCmdNative._PARAM_TEXTURE_POS_=2;
	DrawTexturesCmdNative._PARAM_RECT_NUM_POS_=3;
	DrawTexturesCmdNative._PARAM_VB_POS_=4;
	DrawTexturesCmdNative._PARAM_VB_SIZE_POS_=5;
	DrawTexturesCmdNative._PARAM_VB_OFFSET_POS_=6;
	return DrawTexturesCmdNative;
})()



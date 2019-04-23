//class laya.layagl.cmdNative.DrawTextureCmdNative
var DrawTextureCmdNative=(function(){
	function DrawTextureCmdNative(){
		this._graphicsCmdEncoder=null;
		this._index=0;
		this._paramData=null;
		this._texture=null;
		this._x=NaN;
		this._y=NaN;
		this._width=NaN;
		this._height=NaN;
		this._matrix=null;
		this._alpha=NaN;
		this._color=null;
		this._blendMode=null;
		this._cmdCurrentPos=0;
		this._blend_src=0;
		this._blend_dest=0;
	}

	__class(DrawTextureCmdNative,'laya.layagl.cmdNative.DrawTextureCmdNative');
	var __proto=DrawTextureCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._texture=null;
		Pool.recover("DrawTextureCmd",this);
	}

	__proto._setBlendMode=function(value){
		switch(value){
			case /*laya.webgl.canvas.BlendMode.NORMAL*/"normal":
				this._blend_src=/*laya.webgl.WebGLContext.ONE*/1;
				this._blend_dest=/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303;
				break ;
			case /*laya.webgl.canvas.BlendMode.ADD*/"add":
				this._blend_src=/*laya.webgl.WebGLContext.ONE*/1;
				this._blend_dest=/*laya.webgl.WebGLContext.DST_ALPHA*/0x0304;
				break ;
			case /*laya.webgl.canvas.BlendMode.MULTIPLY*/"multiply":
				this._blend_src=/*laya.webgl.WebGLContext.DST_COLOR*/0x0306;
				this._blend_dest=/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303;
				break ;
			case /*laya.webgl.canvas.BlendMode.SCREEN*/"screen":
				this._blend_src=/*laya.webgl.WebGLContext.ONE*/1;
				this._blend_dest=/*laya.webgl.WebGLContext.ONE*/1;
				break ;
			case /*laya.webgl.canvas.BlendMode.LIGHT*/"light":
				this._blend_src=/*laya.webgl.WebGLContext.ONE*/1;
				this._blend_dest=/*laya.webgl.WebGLContext.ONE*/1;
				break ;
			case /*laya.webgl.canvas.BlendMode.OVERLAY*/"overlay":
				this._blend_src=/*laya.webgl.WebGLContext.ONE*/1;
				this._blend_dest=/*laya.webgl.WebGLContext.ONE_MINUS_SRC_COLOR*/0x0301;
				break ;
			case /*laya.webgl.canvas.BlendMode.DESTINATIONOUT*/"destination-out":
				this._blend_src=/*laya.webgl.WebGLContext.ZERO*/0;
				this._blend_dest=/*laya.webgl.WebGLContext.ZERO*/0;
				break ;
			case /*laya.webgl.canvas.BlendMode.MASK*/"mask":
				this._blend_src=/*laya.webgl.WebGLContext.ZERO*/0;
				this._blend_dest=/*laya.webgl.WebGLContext.SRC_ALPHA*/0x0302;
				break ;
			default :
				alert("_setBlendMode Unknown type");
				break ;
			}
	}

	__proto._mixRGBandAlpha=function(color,alpha){
		var a=((color & 0xff000000)>>> 24);
		if (a !=0){
			a*=alpha;
			}else {
			a=alpha*255;
		}
		return (color & 0x00ffffff)| (a << 24);
	}

	__getset(0,__proto,'cmdID',function(){
		return "DrawTexture";
	});

	__getset(0,__proto,'matrix',function(){
		return this._matrix;
		},function(matrix){
		if (!this._matrix){
			this._graphicsCmdEncoder._idata[this._cmdCurrentPos+1]=DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.getPtrID();
			LayaGL.syncBufferToRenderThread(this._graphicsCmdEncoder);
		}
		this._matrix=matrix;
		var _fb=this._paramData._float32Data;
		_fb[DrawTextureCmdNative._PARAM_MATRIX_POS_]=matrix.a;
		_fb[DrawTextureCmdNative._PARAM_MATRIX_POS_+1]=matrix.b;
		_fb[DrawTextureCmdNative._PARAM_MATRIX_POS_+2]=matrix.c;
		_fb[DrawTextureCmdNative._PARAM_MATRIX_POS_+3]=matrix.d;
		_fb[DrawTextureCmdNative._PARAM_MATRIX_POS_+4]=matrix.tx;
		_fb[DrawTextureCmdNative._PARAM_MATRIX_POS_+5]=matrix.ty;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'y',function(){
		return this._y;
		},function(value){
		this._y=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+1]=this._y;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+7]=this._y;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+13]=this._y+this._height;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+19]=this._y+this._height;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'texture',function(){
		return this._texture;
		},function(value){
		if (!value||!value.url){
			return;
		}
		this._texture=value;
		this._paramData._int32Data[DrawTextureCmdNative._PARAM_TEXTURE_POS_]=this._texture.bitmap._glTexture.id;
		var _fb=this._paramData._float32Data;
		var uv=this.texture.uv;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+2]=uv[0];_fb[DrawTextureCmdNative._PARAM_VB_POS_+3]=uv[1];
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+8]=uv[2];_fb[DrawTextureCmdNative._PARAM_VB_POS_+9]=uv[3];
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+14]=uv[4];_fb[DrawTextureCmdNative._PARAM_VB_POS_+15]=uv[5];
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+20]=uv[6];_fb[DrawTextureCmdNative._PARAM_VB_POS_+21]=uv[7];
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'width',function(){
		return this._width;
		},function(value){
		this._width=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_]=this._x;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+6]=this._x+this._width;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+12]=this._x+this._width;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+18]=this._x;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'x',function(){
		return this._x;
		},function(value){
		this._x=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_]=this._x;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+6]=this._x+this._width;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+12]=this._x+this._width;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+18]=this._x;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'height',function(){
		return this._height;
		},function(value){
		this._height=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+1]=this._y;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+7]=this._y;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+13]=this._y+this._height;
		_fb[DrawTextureCmdNative._PARAM_VB_POS_+19]=this._y+this._height;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'alpha',function(){
		return this._alpha;
		},function(value){
		this._alpha=value;
	});

	DrawTextureCmdNative.create=function(texture,x,y,width,height,matrix,alpha,color,blendMode){
		var cmd=Pool.getItemByClass("DrawTextureCmd",DrawTextureCmdNative);
		cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		if (!DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_){
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(188,32,true);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_.blendFuncByParamData(DrawTextureCmdNative._PARAM_BLEND_SRC_POS_ *4,DrawTextureCmdNative._PARAM_BLEND_DEST_POS_ *4);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWTEXTURE);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHQUADTEXTURE);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_.uniformTextureByParamData(DrawTextureCmdNative._PARAM_UNIFORM_LOCATION_POS_ *4,DrawTextureCmdNative._PARAM_TEX_LOCATION_POS_ *4,DrawTextureCmdNative._PARAM_TEXTURE_POS_ *4);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_.setRectMeshByParamData(DrawTextureCmdNative._PARAM_RECT_NUM_POS_*4,DrawTextureCmdNative._PARAM_VB_POS_*4,DrawTextureCmdNative._PARAM_VB_SIZE_POS_*4);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_);
		}
		if (!DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_){
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_=LayaGL.instance.createCommandEncoder(224,32,true);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.blendFuncByParamData(DrawTextureCmdNative._PARAM_BLEND_SRC_POS_ *4,DrawTextureCmdNative._PARAM_BLEND_DEST_POS_ *4);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWTEXTURE);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.useVDO(LayaNative2D.VDO_MESHQUADTEXTURE);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.save();
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.setGlobalValueByParamData(LayaNative2D.GLOBALVALUE_MATRIX32,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7,DrawTextureCmdNative._PARAM_MATRIX_POS_ *4);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.uniformTextureByParamData(DrawTextureCmdNative._PARAM_UNIFORM_LOCATION_POS_ *4,DrawTextureCmdNative._PARAM_TEX_LOCATION_POS_ *4,DrawTextureCmdNative._PARAM_TEXTURE_POS_ *4);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.setRectMeshByParamData(DrawTextureCmdNative._PARAM_RECT_NUM_POS_*4,DrawTextureCmdNative._PARAM_VB_POS_*4,DrawTextureCmdNative._PARAM_VB_SIZE_POS_*4);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.restore();
			LayaGL.syncBufferToRenderThread(DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_);
		}
		if (!cmd._paramData){
			cmd._paramData=/*__JS__ */new ParamData(37*4,true);
			}{
			cmd._texture=texture;
			cmd._x=x;
			cmd._y=y;
			cmd._width=width;
			cmd._height=height;
			cmd._matrix=matrix;
			cmd._alpha=alpha;
			cmd._color=color;
			cmd._blendMode=blendMode;
			var w=width !=0 ? width :texture.bitmap.width;
			var h=height !=0 ? height :texture.bitmap.height;
			var uv=texture.uv;
			var _fb=cmd._paramData._float32Data;
			var _i32b=cmd._paramData._int32Data;
			_i32b[DrawTextureCmdNative._PARAM_UNIFORM_LOCATION_POS_]=3;
			_i32b[DrawTextureCmdNative._PARAM_TEX_LOCATION_POS_]=/*laya.webgl.WebGLContext.TEXTURE0*/0x84C0;
			_i32b[DrawTextureCmdNative._PARAM_TEXTURE_POS_]=texture.bitmap._glTexture.id;
			_i32b[DrawTextureCmdNative._PARAM_RECT_NUM_POS_]=1;
			_i32b[DrawTextureCmdNative._PARAM_VB_SIZE_POS_]=24 *4;
			if (blendMode){
				cmd._setBlendMode(blendMode);
				_i32b[DrawTextureCmdNative._PARAM_BLEND_SRC_POS_]=cmd._blend_src;
				_i32b[DrawTextureCmdNative._PARAM_BLEND_DEST_POS_]=cmd._blend_dest;
				}else {
				_i32b[DrawTextureCmdNative._PARAM_BLEND_SRC_POS_]=-1;
				_i32b[DrawTextureCmdNative._PARAM_BLEND_DEST_POS_]=-1;
			};
			var rgba=0xffffffff;
			if(alpha){
				rgba=cmd._mixRGBandAlpha(rgba,alpha);
			};
			var ix=DrawTextureCmdNative._PARAM_VB_POS_;
			_fb[ix++]=x;_fb[ix++]=y;_fb[ix++]=uv[0];_fb[ix++]=uv[1];_i32b[ix++]=rgba;_i32b[ix++]=0xffffffff;
			_fb[ix++]=x+w;_fb[ix++]=y;_fb[ix++]=uv[2];_fb[ix++]=uv[3];_i32b[ix++]=rgba;_i32b[ix++]=0xffffffff;
			_fb[ix++]=x+w;_fb[ix++]=y+h;_fb[ix++]=uv[4];_fb[ix++]=uv[5];_i32b[ix++]=rgba;_i32b[ix++]=0xffffffff;
			_fb[ix++]=x;_fb[ix++]=y+h;_fb[ix++]=uv[6];_fb[ix++]=uv[7];_i32b[ix++]=rgba;_i32b[ix++]=0xffffffff;
			if (matrix){
				_fb[DrawTextureCmdNative._PARAM_MATRIX_POS_]=matrix.a;_fb[DrawTextureCmdNative._PARAM_MATRIX_POS_+1]=matrix.b;_fb[DrawTextureCmdNative._PARAM_MATRIX_POS_+2]=matrix.c;
				_fb[DrawTextureCmdNative._PARAM_MATRIX_POS_+3]=matrix.d;_fb[DrawTextureCmdNative._PARAM_MATRIX_POS_+4]=matrix.tx;_fb[DrawTextureCmdNative._PARAM_MATRIX_POS_+5]=matrix.ty;
			}
			LayaGL.syncBufferToRenderThread(cmd._paramData);
		}
		if (matrix){
			cmd._cmdCurrentPos=cmd._graphicsCmdEncoder.useCommandEncoder(DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_.getPtrID(),cmd._paramData.getPtrID(),-1);
		}
		else{
			cmd._cmdCurrentPos=cmd._graphicsCmdEncoder.useCommandEncoder(DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		}
		LayaGL.syncBufferToRenderThread(cmd._graphicsCmdEncoder);
		return cmd;
	}

	DrawTextureCmdNative.ID="DrawTexture";
	DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_=null;
	DrawTextureCmdNative._DRAW_TEXTURE_CMD_ENCODER_MATRIX_=null;
	DrawTextureCmdNative._PARAM_UNIFORM_LOCATION_POS_=0;
	DrawTextureCmdNative._PARAM_TEX_LOCATION_POS_=1;
	DrawTextureCmdNative._PARAM_TEXTURE_POS_=2;
	DrawTextureCmdNative._PARAM_RECT_NUM_POS_=3;
	DrawTextureCmdNative._PARAM_VB_SIZE_POS_=4;
	DrawTextureCmdNative._PARAM_VB_POS_=5;
	DrawTextureCmdNative._PARAM_MATRIX_POS_=29;
	DrawTextureCmdNative._PARAM_BLEND_SRC_POS_=35;
	DrawTextureCmdNative._PARAM_BLEND_DEST_POS_=36;
	return DrawTextureCmdNative;
})()


/**
*...
*@author ww
*/

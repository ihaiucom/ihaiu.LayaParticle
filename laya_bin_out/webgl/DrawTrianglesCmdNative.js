//class laya.layagl.cmdNative.DrawTrianglesCmdNative
var DrawTrianglesCmdNative=(function(){
	function DrawTrianglesCmdNative(){
		this._graphicsCmdEncoder=null;
		this._paramData=null;
		this._texture=null;
		this._x=NaN;
		this._y=NaN;
		this._vertices=null;
		this._uvs=null;
		this._indices=null;
		this._matrix=null;
		this._alpha=NaN;
		this._color=null;
		this._blendMode=null;
		this.vbBuffer=null;
		this._vbSize=NaN;
		this.ibBuffer=null;
		this._ibSize=NaN;
		this._verticesNum=NaN;
		this._ibNum=NaN;
		this._blend_src=0;
		this._blend_dest=0;
	}

	__class(DrawTrianglesCmdNative,'laya.layagl.cmdNative.DrawTrianglesCmdNative');
	var __proto=DrawTrianglesCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._texture=null;
		this._vertices=null;
		this._uvs=null;
		this._indices=null;
		this._matrix=null;
		Pool.recover("DrawTrianglesCmd",this);
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

	__getset(0,__proto,'vertices',function(){
		return this._vertices;
		},function(value){
		this._vertices=value;
		var _vb=this.vbBuffer._float32Data;
		var ix=0;
		for (var i=0;i < this._verticesNum;i++){
			_vb[ix++]=this._x+value[i *2];_vb[ix++]=this._y+value[i *2+1];ix++;ix++;ix++;ix++;
		}
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
	});

	__getset(0,__proto,'cmdID',function(){
		return "DrawTriangles";
	});

	__getset(0,__proto,'matrix',function(){
		return this._matrix;
		},function(value){
		this._matrix=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawTrianglesCmdNative._PARAM_MATRIX_POS_]=value.a;
		_fb[DrawTrianglesCmdNative._PARAM_MATRIX_POS_+1]=value.b;
		_fb[DrawTrianglesCmdNative._PARAM_MATRIX_POS_+2]=value.c;
		_fb[DrawTrianglesCmdNative._PARAM_MATRIX_POS_+3]=value.d;
		_fb[DrawTrianglesCmdNative._PARAM_MATRIX_POS_+4]=value.tx;
		_fb[DrawTrianglesCmdNative._PARAM_MATRIX_POS_+5]=value.ty;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'texture',function(){
		return this._texture;
		},function(value){
		if (!value||!value.url){
			return;
		}
		this._texture=value;
		var _i32b=this._paramData._int32Data;
		_i32b[DrawTrianglesCmdNative._PARAM_TEXTURE_POS_]=this._texture.bitmap._glTexture.id;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'y',function(){
		return this._y;
		},function(value){
		this._y=value;
		var _vb=this.vbBuffer._float32Data;
		var ix=0;
		for (var i=0;i < this._verticesNum;i++){
			ix++;_vb[ix++]=value+this.vertices[i *2+1];ix++;ix++;ix++;ix++;
		}
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
	});

	__getset(0,__proto,'x',function(){
		return this._x;
		},function(value){
		this._x=value;
		var _vb=this.vbBuffer._float32Data;
		var ix=0;
		for (var i=0;i < this._verticesNum;i++){
			_vb[ix++]=value+this.vertices[i *2];ix++;ix++;ix++;ix++;ix++;
		}
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
	});

	__getset(0,__proto,'alpha',function(){
		return this._alpha;
		},function(value){
		this._alpha=value;
	});

	__getset(0,__proto,'uvs',function(){
		return this._uvs;
		},function(value){
		this._uvs=value;
		var _vb=this.vbBuffer._float32Data;
		var ix=0;
		for (var i=0;i < this._verticesNum;i++){
			ix++;ix++;_vb[ix++]=value[i *2];_vb[ix++]=value[i *2+1];ix++;ix++;
		}
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
	});

	__getset(0,__proto,'indices',function(){
		return this._indices;
		},function(value){
		this._indices=value;
		var _ib=this.ibBuffer._int16Data;
		var idxpos=0;
		for (var ii=0;ii < this._ibNum;ii++){
			_ib[idxpos++]=value[ii];
		}
		LayaGL.syncBufferToRenderThread(this.ibBuffer);
	});

	__getset(0,__proto,'color',function(){
		return this._color;
		},function(value){
		this._color=value;
	});

	__getset(0,__proto,'blendMode',function(){
		return this._blendMode;
		},function(value){
		this._blendMode=value;
	});

	DrawTrianglesCmdNative.create=function(texture,x,y,vertices,uvs,indices,matrix,alpha,color,blendMode){
		var cmd=Pool.getItemByClass("DrawTrianglesCmd",DrawTrianglesCmdNative);
		cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		if (!DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_){
			DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(152,32,true);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_.save();
			DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_.blendFuncByParamData(DrawTrianglesCmdNative._PARAM_BLEND_SRC_POS_ *4,DrawTrianglesCmdNative._PARAM_BLEND_DEST_POS_ *4);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWTEXTURE);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHQUADTEXTURE);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_.setGlobalValueByParamData(LayaNative2D.GLOBALVALUE_MATRIX32,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7,DrawTrianglesCmdNative._PARAM_MATRIX_POS_ *4);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_.uniformTextureByParamData(DrawTrianglesCmdNative._PARAM_UNIFORMLOCATION_POS_ *4,DrawTrianglesCmdNative._PARAM_TEXLOCATION_POS_ *4,DrawTrianglesCmdNative._PARAM_TEXTURE_POS_ *4);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_.setMeshExByParamData(DrawTrianglesCmdNative._PARAM_VB_POS_ *4,DrawTrianglesCmdNative._PARAM_VB_OFFSET_POS_*4,DrawTrianglesCmdNative._PARAM_VB_SIZE_POS_ *4,DrawTrianglesCmdNative._PARAM_IB_POS_ *4,DrawTrianglesCmdNative._PARAM_IB_OFFSET_POS_*4,DrawTrianglesCmdNative._PARAM_IB_SIZE_POS_ *4,DrawTrianglesCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_ *4);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_.restore();
			LayaGL.syncBufferToRenderThread(DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_);
		}
		if (!DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_){
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(152,32,true);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.save();
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.blendFuncByParamData(DrawTrianglesCmdNative._PARAM_BLEND_SRC_POS_ *4,DrawTrianglesCmdNative._PARAM_BLEND_DEST_POS_ *4);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.addShaderMacro(LayaNative2D.SHADER_MACRO_COLOR_FILTER);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.setGlobalValueByParamData(LayaNative2D.GLOBALVALUE_COLORFILTER_COLOR,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,DrawTrianglesCmdNative._PARAM_FILTER_COLOR_POS_ *4);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.setGlobalValueByParamData(LayaNative2D.GLOBALVALUE_COLORFILTER_ALPHA,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,DrawTrianglesCmdNative._PARAM_FILTER_ALPHA_POS_ *4);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWTEXTURE);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHQUADTEXTURE);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.setGlobalValueByParamData(LayaNative2D.GLOBALVALUE_MATRIX32,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7,DrawTrianglesCmdNative._PARAM_MATRIX_POS_ *4);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.uniformTextureByParamData(DrawTrianglesCmdNative._PARAM_UNIFORMLOCATION_POS_ *4,DrawTrianglesCmdNative._PARAM_TEXLOCATION_POS_ *4,DrawTrianglesCmdNative._PARAM_TEXTURE_POS_ *4);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.setMeshExByParamData(DrawTrianglesCmdNative._PARAM_VB_POS_ *4,DrawTrianglesCmdNative._PARAM_VB_OFFSET_POS_*4,DrawTrianglesCmdNative._PARAM_VB_SIZE_POS_ *4,DrawTrianglesCmdNative._PARAM_IB_POS_ *4,DrawTrianglesCmdNative._PARAM_IB_OFFSET_POS_*4,DrawTrianglesCmdNative._PARAM_IB_SIZE_POS_ *4,DrawTrianglesCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_ *4);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.restore();
			LayaGL.syncBufferToRenderThread(DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_);
		}
		if (!cmd._paramData){
			cmd._paramData=/*__JS__ */new ParamData(38*4,true);
			}{
			cmd._texture=texture;
			cmd._x=x;
			cmd._y=y;
			cmd._vertices=vertices;
			cmd._uvs=uvs;
			cmd._indices=indices;
			if (matrix){
				cmd._matrix=matrix;
				}else {
				cmd._matrix=new Matrix();
			}
			cmd._alpha=alpha;
			cmd._color=color;
			cmd._blendMode=blendMode;
			var colorFilter=new ColorFilter();
			var rgba=ColorUtils.create(color);
			colorFilter.color(rgba.arrColor[0],rgba.arrColor[1],rgba.arrColor[2],rgba.arrColor[3]);
			cmd._verticesNum=cmd._vertices.length / 2;
			var verticesNumCopy=cmd._verticesNum;
			if (!cmd.vbBuffer || cmd.vbBuffer.getByteLength()< verticesNumCopy *24 *3){
				cmd.vbBuffer=/*__JS__ */new ParamData(verticesNumCopy*24*3,true);
			}
			cmd._vbSize=verticesNumCopy *24 *3;
			var _vb=cmd.vbBuffer._float32Data;
			var _vb_i32b=cmd.vbBuffer._int32Data;
			var nrgba=0xffffffff;
			if(alpha){
				nrgba=cmd._mixRGBandAlpha(nrgba,alpha);
			};
			var ix=0;
			for (var i=0;i < cmd._verticesNum;i++){
				_vb[ix++]=x/cmd._matrix.a+vertices[i *2];_vb[ix++]=y/cmd._matrix.d+vertices[i *2+1];_vb[ix++]=uvs[i *2];_vb[ix++]=uvs[i *2+1];_vb_i32b[ix++]=nrgba;_vb_i32b[ix++]=0xffffffff;
			}
			cmd._ibNum=indices.length;
			var ibNumCopy=cmd._ibNum;
			if (!cmd.ibBuffer || cmd.ibBuffer.getByteLength()< ibNumCopy *2){
				cmd.ibBuffer=/*__JS__ */new ParamData(ibNumCopy*2,true,true);
			}
			cmd._ibSize=ibNumCopy*2;
			var _ib=cmd.ibBuffer._int16Data;
			var idxpos=0;
			for (var ii=0;ii < cmd._ibNum;ii++){
				_ib[idxpos++]=indices[ii];
			}
		};
		var _fb=cmd._paramData._float32Data;
		var _i32b=cmd._paramData._int32Data;
		_i32b[DrawTrianglesCmdNative._PARAM_UNIFORMLOCATION_POS_]=3;
		_i32b[DrawTrianglesCmdNative._PARAM_TEXLOCATION_POS_]=/*laya.webgl.WebGLContext.TEXTURE0*/0x84C0;
		_i32b[DrawTrianglesCmdNative._PARAM_TEXTURE_POS_]=texture.bitmap._glTexture.id;
		_i32b[DrawTrianglesCmdNative._PARAM_VB_POS_]=cmd.vbBuffer.getPtrID();
		_i32b[DrawTrianglesCmdNative._PARAM_VB_SIZE_POS_]=cmd._vbSize;
		_i32b[DrawTrianglesCmdNative._PARAM_IB_POS_]=cmd.ibBuffer.getPtrID();
		_i32b[DrawTrianglesCmdNative._PARAM_IB_SIZE_POS_]=cmd._ibSize;
		_i32b[DrawTrianglesCmdNative._PARAM_VB_OFFSET_POS_]=0;
		_i32b[DrawTrianglesCmdNative._PARAM_IB_OFFSET_POS_]=0;
		_i32b[DrawTrianglesCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_]=0;
		_fb[DrawTrianglesCmdNative._PARAM_MATRIX_POS_]=cmd._matrix.a;_fb[DrawTrianglesCmdNative._PARAM_MATRIX_POS_+1]=cmd._matrix.b;_fb[DrawTrianglesCmdNative._PARAM_MATRIX_POS_+2]=cmd._matrix.c;
		_fb[DrawTrianglesCmdNative._PARAM_MATRIX_POS_+3]=cmd._matrix.d;_fb[DrawTrianglesCmdNative._PARAM_MATRIX_POS_+4]=cmd._matrix.tx;_fb[DrawTrianglesCmdNative._PARAM_MATRIX_POS_+5]=cmd._matrix.ty;
		if (blendMode){
			cmd._setBlendMode(blendMode);
			_i32b[DrawTrianglesCmdNative._PARAM_BLEND_SRC_POS_]=cmd._blend_src;
			_i32b[DrawTrianglesCmdNative._PARAM_BLEND_DEST_POS_]=cmd._blend_dest;
			}else {
			_i32b[DrawTrianglesCmdNative._PARAM_BLEND_SRC_POS_]=-1;
			_i32b[DrawTrianglesCmdNative._PARAM_BLEND_DEST_POS_]=-1;
		}
		if (color){
			ix=DrawTrianglesCmdNative._PARAM_FILTER_COLOR_POS_;
			var mat=colorFilter._mat;
			_fb[ix++]=mat[0];_fb[ix++]=mat[1];_fb[ix++]=mat[2];_fb[ix++]=mat[3];
			_fb[ix++]=mat[4];_fb[ix++]=mat[5];_fb[ix++]=mat[6];_fb[ix++]=mat[7];
			_fb[ix++]=mat[8];_fb[ix++]=mat[9];_fb[ix++]=mat[10];_fb[ix++]=mat[11];
			_fb[ix++]=mat[12];_fb[ix++]=mat[13];_fb[ix++]=mat[14];_fb[ix++]=mat[15];
			ix=DrawTrianglesCmdNative._PARAM_FILTER_ALPHA_POS_;
			var _alpha=colorFilter._alpha;
			_fb[ix++]=_alpha[0] *255;_fb[ix++]=_alpha[1] *255;_fb[ix++]=_alpha[2] *255;_fb[ix++]=_alpha[3] *255;
		}
		LayaGL.syncBufferToRenderThread(cmd.vbBuffer);
		LayaGL.syncBufferToRenderThread(cmd.ibBuffer);
		LayaGL.syncBufferToRenderThread(cmd._paramData);
		if (color){
			cmd._graphicsCmdEncoder.useCommandEncoder(DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		}
		else{
			cmd._graphicsCmdEncoder.useCommandEncoder(DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		}
		LayaGL.syncBufferToRenderThread(cmd._graphicsCmdEncoder);
		return cmd;
	}

	DrawTrianglesCmdNative.ID="DrawTriangles";
	DrawTrianglesCmdNative._DRAW_TRIANGLES_CMD_ENCODER_=null;
	DrawTrianglesCmdNative._DRAW_TRIANGLES_COLORFILTER_CMD_ENCODER_=null;
	DrawTrianglesCmdNative._PARAM_UNIFORMLOCATION_POS_=0;
	DrawTrianglesCmdNative._PARAM_TEXLOCATION_POS_=1;
	DrawTrianglesCmdNative._PARAM_TEXTURE_POS_=2;
	DrawTrianglesCmdNative._PARAM_VB_POS_=3;
	DrawTrianglesCmdNative._PARAM_VB_SIZE_POS_=4;
	DrawTrianglesCmdNative._PARAM_IB_POS_=5;
	DrawTrianglesCmdNative._PARAM_IB_SIZE_POS_=6;
	DrawTrianglesCmdNative._PARAM_VB_OFFSET_POS_=7;
	DrawTrianglesCmdNative._PARAM_IB_OFFSET_POS_=8;
	DrawTrianglesCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_=9;
	DrawTrianglesCmdNative._PARAM_BLEND_SRC_POS_=10;
	DrawTrianglesCmdNative._PARAM_BLEND_DEST_POS_=11;
	DrawTrianglesCmdNative._PARAM_MATRIX_POS_=12;
	DrawTrianglesCmdNative._PARAM_FILTER_COLOR_POS_=18;
	DrawTrianglesCmdNative._PARAM_FILTER_ALPHA_POS_=34;
	return DrawTrianglesCmdNative;
})()



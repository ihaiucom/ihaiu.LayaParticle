//class laya.layagl.cmdNative.FillTextCmdNative
var FillTextCmdNative=(function(){
	function FillTextCmdNative(){
		this._graphicsCmdEncoder=null;
		this._index=0;
		this._text=null;
		this._x=NaN;
		this._y=NaN;
		this._font=null;
		this._color=null;
		this._textAlign=null;
		this._draw_texture_cmd_encoder_=LayaGL.instance.createCommandEncoder(64,32,true);
	}

	__class(FillTextCmdNative,'laya.layagl.cmdNative.FillTextCmdNative');
	var __proto=FillTextCmdNative.prototype;
	__proto.createFillText=function(cbuf,text,x,y,font,color,textAlign){
		var c1=ColorUtils.create(color);
		var nColor=c1.numColor;
		var ctx={};
		ctx._curMat=new Matrix();
		ctx._italicDeg=0;
		ctx._drawTextureUseColor=0xffffffff;
		ctx.fillStyle=color;
		ctx._fillColor=0xffffffff;
		ctx.setFillColor=function (color){
			ctx._fillColor=color;
		}
		ctx.getFillColor=function (){
			return ctx._fillColor;
		}
		ctx.mixRGBandAlpha=function (value){
			return value;
		}
		ctx._drawTextureM=function (tex,x,y,width,height,m,alpha,uv){
			cbuf.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			cbuf.useProgramEx(LayaNative2D.PROGRAMEX_DRAWTEXTURE);
			cbuf.useVDO(LayaNative2D.VDO_MESHQUADTEXTURE);
			cbuf.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			cbuf.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			cbuf.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			cbuf.uniformTexture(3,/*laya.webgl.WebGLContext.TEXTURE0*/0x84C0,tex.bitmap._glTexture);
			var buffer=new Float32Array([
			x,y,uv[0],uv[1],0,0,
			x+width,y,uv[2],uv[3],0,0,
			x+width,y+height,uv[4],uv[5],0,0,
			x,y+height,uv[6],uv[7],0,0]);
			var i32=new Int32Array(buffer.buffer);
			i32[4]=i32[10]=i32[16]=i32[22]=0xffffffff;
			i32[5]=i32[11]=i32[17]=i32[23]=0xffffffff;
			cbuf.setRectMesh(1,buffer,buffer.length);
			cbuf.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			cbuf.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(cbuf);
		}
		FillTextCmdNative.cbook.filltext_native(ctx,text,null,x,y,font,color,null,0,textAlign);
	}

	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._graphicsCmdEncoder=null;
		Pool.recover("FillTextCmd",this);
	}

	__getset(0,__proto,'text',function(){
		return this._text;
		},function(value){
		var cbuf=this._draw_texture_cmd_encoder_;
		cbuf.clearEncoding();
		this._text=value;
		this.createFillText(cbuf,this._text,this._x,this._y,this._font,this._color,this._textAlign);
		LayaGL.syncBufferToRenderThread(cbuf);
	});

	__getset(0,__proto,'cmdID',function(){
		return "FillText";
	});

	__getset(0,__proto,'font',function(){
		return this._font;
		},function(value){
		var cbuf=this._draw_texture_cmd_encoder_;
		cbuf.clearEncoding();
		this._font=value;
		this.createFillText(cbuf,this._text,this._x,this._y,this._font,this._color,this._textAlign);
		LayaGL.syncBufferToRenderThread(cbuf);
	});

	__getset(0,__proto,'color',function(){
		return this._color;
		},function(value){
		var cbuf=this._draw_texture_cmd_encoder_;
		cbuf.clearEncoding();
		this._color=value;
		this.createFillText(cbuf,this._text,this._x,this._y,this._font,this._color,this._textAlign);
		LayaGL.syncBufferToRenderThread(cbuf);
	});

	__getset(0,__proto,'textAlign',function(){
		return this._textAlign;
		},function(value){
		var cbuf=this._draw_texture_cmd_encoder_;
		cbuf.clearEncoding();
		this._textAlign=value;
		this.createFillText(cbuf,this._text,this._x,this._y,this._font,this._color,this._textAlign);
		LayaGL.syncBufferToRenderThread(cbuf);
	});

	__getset(0,__proto,'x',function(){
		return this._x;
		},function(value){
		var cbuf=this._draw_texture_cmd_encoder_;
		cbuf.clearEncoding();
		this._x=value;
		this.createFillText(cbuf,this._text,this._x,this._y,this._font,this._color,this._textAlign);
		LayaGL.syncBufferToRenderThread(cbuf);
	});

	__getset(0,__proto,'y',function(){
		return this._y;
		},function(value){
		var cbuf=this._draw_texture_cmd_encoder_;
		cbuf.clearEncoding();
		this._y=value;
		this.createFillText(cbuf,this._text,this._x,this._y,this._font,this._color,this._textAlign);
		LayaGL.syncBufferToRenderThread(cbuf);
	});

	FillTextCmdNative.create=function(text,x,y,font,color,textAlign){
		if (!FillTextCmdNative.cbook)new Error('Error:charbook not create!');
		var cmd=Pool.getItemByClass("FillTextCmd",FillTextCmdNative);
		var cbuf=cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		cmd._text=text;
		cmd._x=x;
		cmd._y=y;
		cmd._font=font;
		cmd._color=color;
		cmd._textAlign=textAlign;
		cmd._draw_texture_cmd_encoder_.clearEncoding();
		cmd.createFillText(cmd._draw_texture_cmd_encoder_,text,x,y,font,color,textAlign);
		LayaGL.syncBufferToRenderThread(cmd._draw_texture_cmd_encoder_);
		cbuf.useCommandEncoder(cmd._draw_texture_cmd_encoder_.getPtrID(),-1,-1);
		LayaGL.syncBufferToRenderThread(cbuf);
		return cmd;
	}

	FillTextCmdNative.ID="FillText";
	__static(FillTextCmdNative,
	['cbook',function(){return this.cbook=Laya['textRender'];}
	]);
	return FillTextCmdNative;
})()



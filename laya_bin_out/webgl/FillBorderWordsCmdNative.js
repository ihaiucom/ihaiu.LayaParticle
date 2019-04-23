//class laya.layagl.cmdNative.FillBorderWordsCmdNative
var FillBorderWordsCmdNative=(function(){
	function FillBorderWordsCmdNative(){
		//this._graphicsCmdEncoder=null;
		//this.words=null;
		//this.x=NaN;
		//this.y=NaN;
		//this.font=null;
		//this.color=null;
		//this.strokeColor=null;
		//this.strokeWidth=0;
		this._draw_texture_cmd_encoder_=LayaGL.instance.createCommandEncoder(64,32,true);
	}

	__class(FillBorderWordsCmdNative,'laya.layagl.cmdNative.FillBorderWordsCmdNative');
	var __proto=FillBorderWordsCmdNative.prototype;
	__proto.createFillBorderText=function(cbuf,data,x,y,font,color,strokeColor,strokeWidth){
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
		FillBorderWordsCmdNative.cbook.filltext_native(ctx,null,data,x,y,font,color,strokeColor,strokeWidth,null,0);
	}

	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._graphicsCmdEncoder=null;
		this.words=null;
		Pool.recover("FillBorderWordsCmd",this);
	}

	__getset(0,__proto,'cmdID',function(){
		return "FillBorderWords";
	});

	FillBorderWordsCmdNative.create=function(words,x,y,font,color,strokeColor,strokeWidth){
		if (!FillBorderWordsCmdNative.cbook)new Error('Error:charbook not create!');
		var cmd=Pool.getItemByClass("FillBorderWordsCmd",FillBorderWordsCmdNative);
		var cbuf=cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		cmd.words=words;
		cmd.x=x;
		cmd.y=y;
		cmd.font=font;
		cmd.color=color;
		cmd.strokeColor=strokeColor;
		cmd.strokeWidth=strokeWidth;
		cmd._draw_texture_cmd_encoder_.clearEncoding();
		cmd.createFillBorderText(cmd._draw_texture_cmd_encoder_,words,x,y,font,color,strokeColor,strokeWidth);
		LayaGL.syncBufferToRenderThread(cmd._draw_texture_cmd_encoder_);
		cbuf.useCommandEncoder(cmd._draw_texture_cmd_encoder_.getPtrID(),-1,-1);
		LayaGL.syncBufferToRenderThread(cbuf);
		return cmd;
	}

	FillBorderWordsCmdNative.ID="FillBorderWords";
	__static(FillBorderWordsCmdNative,
	['cbook',function(){return this.cbook=Laya['textRender'];}
	]);
	return FillBorderWordsCmdNative;
})()


/**
*对象 cacheas normal的时候，本质上只是想把submit缓存起来，以后直接执行
*为了避免各种各样的麻烦，这里采用复制响应部分的submit的方法。执行环境还是在原来的context中
*否则包括clipt等都非常难以处理
*/

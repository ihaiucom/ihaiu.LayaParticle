//class laya.webgl.resource.RenderTexture2D extends laya.webgl.resource.BaseTexture
var RenderTexture2D=(function(_super){
	function RenderTexture2D(width,height,format,depthStencilFormat){
		//this._lastRT=null;
		//this._lastWidth=NaN;
		//this._lastHeight=NaN;
		/**@private */
		//this._frameBuffer=null;
		/**@private */
		//this._depthStencilBuffer=null;
		/**@private */
		//this._depthStencilFormat=0;
		this._mgrKey=0;
		(format===void 0)&& (format=0);
		(depthStencilFormat===void 0)&& (depthStencilFormat=/*laya.webgl.resource.BaseTexture.FORMAT_DEPTH_16*/0);
		RenderTexture2D.__super.call(this,format,false);
		this._glTextureType=/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1;
		this._width=width;
		this._height=height;
		this._depthStencilFormat=depthStencilFormat;
		this._create(width,height);
	}

	__class(RenderTexture2D,'laya.webgl.resource.RenderTexture2D',_super);
	var __proto=RenderTexture2D.prototype;
	__proto.getIsReady=function(){
		return true;
	}

	/**
	*@private
	*/
	__proto._create=function(width,height){
		var gl=LayaGL.instance;
		this._frameBuffer=gl.createFramebuffer();
		WebGLContext.bindTexture(gl,this._glTextureType,this._glTexture);
		var glFormat=this._getGLFormat();
		gl.texImage2D(this._glTextureType,0,glFormat,width,height,0,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,null);
		this._setGPUMemory(width *height *4);
		gl.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,this._frameBuffer);
		gl.framebufferTexture2D(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,/*laya.webgl.WebGLContext.COLOR_ATTACHMENT0*/0x8CE0,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,this._glTexture,0);
		if (this._depthStencilFormat!==/*laya.webgl.resource.BaseTexture.FORMAT_DEPTHSTENCIL_NONE*/3){
			this._depthStencilBuffer=gl.createRenderbuffer();
			gl.bindRenderbuffer(/*laya.webgl.WebGLContext.RENDERBUFFER*/0x8D41,this._depthStencilBuffer);
			switch (this._depthStencilFormat){
				case /*laya.webgl.resource.BaseTexture.FORMAT_DEPTH_16*/0:
					gl.renderbufferStorage(/*laya.webgl.WebGLContext.RENDERBUFFER*/0x8D41,/*laya.webgl.WebGLContext.DEPTH_COMPONENT16*/0x81A5,width,height);
					gl.framebufferRenderbuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,/*laya.webgl.WebGLContext.DEPTH_ATTACHMENT*/0x8D00,/*laya.webgl.WebGLContext.RENDERBUFFER*/0x8D41,this._depthStencilBuffer);
					break ;
				case /*laya.webgl.resource.BaseTexture.FORMAT_STENCIL_8*/1:
					gl.renderbufferStorage(/*laya.webgl.WebGLContext.RENDERBUFFER*/0x8D41,/*laya.webgl.WebGLContext.STENCIL_INDEX8*/0x8D48,width,height);
					gl.framebufferRenderbuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,/*laya.webgl.WebGLContext.STENCIL_ATTACHMENT*/0x8D20,/*laya.webgl.WebGLContext.RENDERBUFFER*/0x8D41,this._depthStencilBuffer);
					break ;
				case /*laya.webgl.resource.BaseTexture.FORMAT_DEPTHSTENCIL_16_8*/2:
					gl.renderbufferStorage(/*laya.webgl.WebGLContext.RENDERBUFFER*/0x8D41,/*laya.webgl.WebGLContext.DEPTH_STENCIL*/0x84F9,width,height);
					gl.framebufferRenderbuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,/*laya.webgl.WebGLContext.DEPTH_STENCIL_ATTACHMENT*/0x821A,/*laya.webgl.WebGLContext.RENDERBUFFER*/0x8D41,this._depthStencilBuffer);
					break ;
				default :
					console.log("RenderTexture: unkonw depth format.");
				}
		}
		gl.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,null);
		gl.bindRenderbuffer(/*laya.webgl.WebGLContext.RENDERBUFFER*/0x8D41,null);
		this._setWarpMode(/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,this._wrapModeU);
		this._setWarpMode(/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,this._wrapModeV);
		this._setFilterMode(this._filterMode);
		this._setAnisotropy(this._anisoLevel);
		this._readyed=true;
		this._activeResource();
	}

	/**
	*生成mipMap。
	*/
	__proto.generateMipmap=function(){
		if (this._isPot(this.width)&& this._isPot(this.height)){
			this._mipmap=true;
			LayaGL.instance.generateMipmap(this._glTextureType);
			this._setFilterMode(this._filterMode);
			this._setGPUMemory(this.width *this.height *4 *(1+1 / 3));
			}else {
			this._mipmap=false;
			this._setGPUMemory(this.width *this.height *4);
		}
	}

	/**
	*开始绑定。
	*/
	__proto.start=function(){
		var gl=LayaGL.instance;
		LayaGL.instance.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,this._frameBuffer);
		RenderTexture2D._currentActive=this;
		this._readyed=true;
		gl.viewport(0,0,this._width,this._height);
		this._lastWidth=RenderState2D.width;
		this._lastHeight=RenderState2D.height;
		RenderState2D.width=this._width;
		RenderState2D.height=this._height;
		BaseShader.activeShader=null;
	}

	/**
	*结束绑定。
	*/
	__proto.end=function(){
		LayaGL.instance.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,null);
		RenderTexture2D._currentActive=null;
		this._readyed=true;
	}

	/**
	*恢复上一次的RenderTarge.由于使用自己保存的，所以如果被外面打断了的话，会出错。
	*/
	__proto.restore=function(){
		var gl=LayaGL.instance;
		if (this._lastRT !=RenderTexture2D._currentActive){
			LayaGL.instance.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,this._lastRT?this._lastRT._frameBuffer:null);
			RenderTexture2D._currentActive=this._lastRT;
		}
		this._readyed=true;
		gl.viewport(0,0,this._lastWidth,this._lastHeight);
		RenderState2D.width=this._lastWidth;
		RenderState2D.height=this._lastHeight;
		BaseShader.activeShader=null;
	}

	// gl.viewport(0,0,Laya.stage.width,Laya.stage.height);
	__proto.clear=function(r,g,b,a){
		(r===void 0)&& (r=0.0);
		(g===void 0)&& (g=0.0);
		(b===void 0)&& (b=0.0);
		(a===void 0)&& (a=1.0);
		var gl=LayaGL.instance;
		gl.clearColor(r,g,b,a);
		var clearFlag=/*laya.webgl.WebGLContext.COLOR_BUFFER_BIT*/0x00004000;
		switch (this._depthStencilFormat){
			case /*laya.webgl.WebGLContext.DEPTH_COMPONENT16*/0x81A5:
				clearFlag |=/*laya.webgl.WebGLContext.DEPTH_BUFFER_BIT*/0x00000100;
				break ;
			case /*laya.webgl.WebGLContext.STENCIL_INDEX8*/0x8D48:
				clearFlag |=/*laya.webgl.WebGLContext.STENCIL_BUFFER_BIT*/0x00000400;
				break ;
			case /*laya.webgl.WebGLContext.DEPTH_STENCIL*/0x84F9:
				clearFlag |=/*laya.webgl.WebGLContext.DEPTH_BUFFER_BIT*/0x00000100;
				clearFlag |=/*laya.webgl.WebGLContext.STENCIL_BUFFER_BIT*/0x00000400
				break ;
			}
		gl.clear(clearFlag);
	}

	/**
	*获得像素数据。
	*@param x X像素坐标。
	*@param y Y像素坐标。
	*@param width 宽度。
	*@param height 高度。
	*@return 像素数据。
	*/
	__proto.getData=function(x,y,width,height){
		var gl=LayaGL.instance;
		gl.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,this._frameBuffer);
		var canRead=(gl.checkFramebufferStatus(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40)===/*laya.webgl.WebGLContext.FRAMEBUFFER_COMPLETE*/0x8CD5);
		if (!canRead){
			gl.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,null);
			return null;
		};
		var pixels=new Uint8Array(this._width *this._height *4);
		var glFormat=this._getGLFormat();
		gl.readPixels(x,y,width,height,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,pixels);
		gl.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,null);
		return pixels;
	}

	__proto.recycle=function(){}
	/**
	*@inheritDoc
	*/
	__proto._disposeResource=function(){
		if (this._frameBuffer){
			var gl=LayaGL.instance;
			gl.deleteTexture(this._glTexture);
			gl.deleteFramebuffer(this._frameBuffer);
			gl.deleteRenderbuffer(this._depthStencilBuffer);
			this._glTexture=null;
			this._frameBuffer=null;
			this._depthStencilBuffer=null;
			this._setGPUMemory(0);
		}
	}

	/**
	*获取深度格式。
	*@return 深度格式。
	*/
	__getset(0,__proto,'depthStencilFormat',function(){
		return this._depthStencilFormat;
	});

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'defaulteTexture',function(){
		return Texture2D.grayTexture;
	});

	/**
	*获取宽度。
	*/
	__getset(0,__proto,'sourceWidth',function(){
		return this._width;
	});

	/***
	*获取高度。
	*/
	__getset(0,__proto,'sourceHeight',function(){
		return this._height;
	});

	/**
	*获取offsetX。
	*/
	__getset(0,__proto,'offsetX',function(){
		return 0;
	});

	/***
	*获取offsetY
	*/
	__getset(0,__proto,'offsetY',function(){
		return 0;
	});

	/**
	*获取当前激活的Rendertexture
	*/
	__getset(1,RenderTexture2D,'currentActive',function(){
		return RenderTexture2D._currentActive;
	},laya.webgl.resource.BaseTexture._$SET_currentActive);

	RenderTexture2D.pushRT=function(){
		RenderTexture2D.rtStack.push({rt:RenderTexture2D._currentActive,w:RenderState2D.width,h:RenderState2D.height});
	}

	RenderTexture2D.popRT=function(){
		var gl=LayaGL.instance;
		var top=RenderTexture2D.rtStack.pop();
		if (top){
			if (RenderTexture2D._currentActive !=top.rt){
				LayaGL.instance.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,top.rt?top.rt._frameBuffer:null);
				RenderTexture2D._currentActive=top.rt;
			}
			gl.viewport(0,0,top.w,top.h);
			RenderState2D.width=top.w;
			RenderState2D.height=top.h;
		}
	}

	RenderTexture2D._currentActive=null;
	RenderTexture2D.rtStack=[];
	__static(RenderTexture2D,
	['defuv',function(){return this.defuv=[0,0,1,0,1,1,0,1];},'flipyuv',function(){return this.flipyuv=[0,1,1,1,1,0,0,0];}
	]);
	return RenderTexture2D;
})(BaseTexture)


/**
*<code>Texture2D</code> 类用于生成2D纹理。
*/

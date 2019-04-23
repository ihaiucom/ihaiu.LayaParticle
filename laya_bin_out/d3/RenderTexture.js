/**
*<code>RenderTexture</code> 类用于创建渲染目标。
*/
//class laya.d3.resource.RenderTexture extends laya.webgl.resource.BaseTexture
var RenderTexture=(function(_super){
	function RenderTexture(width,height,format,depthStencilFormat){
		/**@private */
		//this._frameBuffer=null;
		/**@private */
		//this._depthStencilBuffer=null;
		/**@private */
		//this._depthStencilFormat=0;
		(format===void 0)&& (format=0);
		(depthStencilFormat===void 0)&& (depthStencilFormat=/*laya.webgl.resource.BaseTexture.FORMAT_DEPTH_16*/0);
		RenderTexture.__super.call(this,format,false);
		this._glTextureType=/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1;
		this._width=width;
		this._height=height;
		this._depthStencilFormat=depthStencilFormat;
		this._create(width,height);
	}

	__class(RenderTexture,'laya.d3.resource.RenderTexture',_super);
	var __proto=RenderTexture.prototype;
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
					throw "RenderTexture: unkonw depth format.";
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
			this._setGPUMemory(this.width *this.height *4 *(1+1 / 3));
		}
	}

	/**
	*开始绑定。
	*/
	__proto.start=function(){
		LayaGL.instance.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,this._frameBuffer);
		RenderTexture._currentActive=this;
		this._readyed=false;
	}

	/**
	*结束绑定。
	*/
	__proto.end=function(){
		LayaGL.instance.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,null);
		RenderTexture._currentActive=null;
		this._readyed=true;
	}

	/**
	*获得像素数据。
	*@param x X像素坐标。
	*@param y Y像素坐标。
	*@param width 宽度。
	*@param height 高度。
	*@return 像素数据。
	*/
	__proto.getData=function(x,y,width,height,out){
		var gl=LayaGL.instance;
		gl.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,this._frameBuffer);
		var canRead=(gl.checkFramebufferStatus(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40)===/*laya.webgl.WebGLContext.FRAMEBUFFER_COMPLETE*/0x8CD5);
		if (!canRead){
			gl.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,null);
			return null;
		}
		gl.readPixels(x,y,width,height,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,out);
		gl.bindFramebuffer(/*laya.webgl.WebGLContext.FRAMEBUFFER*/0x8D40,null);
		return out;
	}

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
	*获取当前激活的Rendertexture
	*/
	__getset(1,RenderTexture,'currentActive',function(){
		return RenderTexture._currentActive;
	},laya.webgl.resource.BaseTexture._$SET_currentActive);

	RenderTexture._currentActive=null;
	return RenderTexture;
})(BaseTexture)


/**

*/
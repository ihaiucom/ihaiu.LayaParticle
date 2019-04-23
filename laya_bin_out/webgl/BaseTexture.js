//class laya.webgl.resource.BaseTexture extends laya.resource.Bitmap
var BaseTexture=(function(_super){
	function BaseTexture(format,mipMap){
		/**@private */
		//this._readyed=false;
		/**@private */
		//this._glTextureType=0;
		/**@private */
		//this._glTexture=null;
		/**@private */
		//this._format=0;
		/**@private */
		//this._mipmap=false;
		/**@private */
		//this._wrapModeU=0;
		/**@private */
		//this._wrapModeV=0;
		/**@private */
		//this._filterMode=0;
		/**@private */
		//this._anisoLevel=0;
		BaseTexture.__super.call(this);
		this._wrapModeU=/*CLASS CONST:laya.webgl.resource.BaseTexture.WARPMODE_REPEAT*/0;
		this._wrapModeV=/*CLASS CONST:laya.webgl.resource.BaseTexture.WARPMODE_REPEAT*/0;
		this._filterMode=/*CLASS CONST:laya.webgl.resource.BaseTexture.FILTERMODE_BILINEAR*/1;
		this._readyed=false;
		this._width=-1;
		this._height=-1;
		this._format=format;
		this._mipmap=mipMap;
		this._anisoLevel=1;
		this._glTexture=LayaGL.instance.createTexture();
	}

	__class(BaseTexture,'laya.webgl.resource.BaseTexture',_super);
	var __proto=BaseTexture.prototype;
	/**
	*@private
	*/
	__proto._isPot=function(size){
		return (size & (size-1))===0;
	}

	/**
	*@private
	*/
	__proto._getGLFormat=function(){
		var glFormat=0;
		switch (this._format){
			case 0:
				glFormat=/*laya.webgl.WebGLContext.RGB*/0x1907;
				break ;
			case 1:
				glFormat=/*laya.webgl.WebGLContext.RGBA*/0x1908;
				break ;
			case 2:
				glFormat=/*laya.webgl.WebGLContext.ALPHA*/0x1906;
				break ;
			case 3:
				if (WebGLContext._compressedTextureS3tc)
					glFormat=WebGLContext._compressedTextureS3tc.COMPRESSED_RGB_S3TC_DXT1_EXT;
				else
				throw "BaseTexture: not support DXT1 format.";
				break ;
			case 4:
				if (WebGLContext._compressedTextureS3tc)
					glFormat=WebGLContext._compressedTextureS3tc.COMPRESSED_RGBA_S3TC_DXT5_EXT;
				else
				throw "BaseTexture: not support DXT5 format.";
				break ;
			case 5:
				if (WebGLContext._compressedTextureEtc1)
					glFormat=WebGLContext._compressedTextureEtc1.COMPRESSED_RGB_ETC1_WEBGL;
				else
				throw "BaseTexture: not support ETC1RGB format.";
				break ;
			case 9:
				if (WebGLContext._compressedTexturePvrtc)
					glFormat=WebGLContext._compressedTexturePvrtc.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
				else
				throw "BaseTexture: not support PVRTCRGB_2BPPV format.";
				break ;
			case 10:
				if (WebGLContext._compressedTexturePvrtc)
					glFormat=WebGLContext._compressedTexturePvrtc.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
				else
				throw "BaseTexture: not support PVRTCRGBA_2BPPV format.";
				break ;
			case 11:
				if (WebGLContext._compressedTexturePvrtc)
					glFormat=WebGLContext._compressedTexturePvrtc.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
				else
				throw "BaseTexture: not support PVRTCRGB_4BPPV format.";
				break ;
			case 12:
				if (WebGLContext._compressedTexturePvrtc)
					glFormat=WebGLContext._compressedTexturePvrtc.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
				else
				throw "BaseTexture: not support PVRTCRGBA_4BPPV format.";
				break ;
			default :
				throw "BaseTexture: unknown texture format.";
			}
		return glFormat;
	}

	/**
	*@private
	*/
	__proto._setFilterMode=function(value){
		var gl=LayaGL.instance;
		WebGLContext.bindTexture(gl,this._glTextureType,this._glTexture);
		switch (value){
			case 0:
				if (this._mipmap && this._isPot(this._width)&& this._isPot(this._height))
					gl.texParameteri(this._glTextureType,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,/*laya.webgl.WebGLContext.NEAREST_MIPMAP_NEAREST*/0x2700);
				else
				gl.texParameteri(this._glTextureType,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,/*laya.webgl.WebGLContext.NEAREST*/0x2600);
				gl.texParameteri(this._glTextureType,/*laya.webgl.WebGLContext.TEXTURE_MAG_FILTER*/0x2800,/*laya.webgl.WebGLContext.NEAREST*/0x2600);
				break ;
			case 1:
				if (this._mipmap && this._isPot(this._width)&& this._isPot(this._height))
					gl.texParameteri(this._glTextureType,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,/*laya.webgl.WebGLContext.LINEAR_MIPMAP_NEAREST*/0x2701);
				else
				gl.texParameteri(this._glTextureType,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
				gl.texParameteri(this._glTextureType,/*laya.webgl.WebGLContext.TEXTURE_MAG_FILTER*/0x2800,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
				break ;
			case 2:
				if (this._mipmap && this._isPot(this._width)&& this._isPot(this._height))
					gl.texParameteri(this._glTextureType,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,/*laya.webgl.WebGLContext.LINEAR_MIPMAP_LINEAR*/0x2703);
				else
				gl.texParameteri(this._glTextureType,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
				gl.texParameteri(this._glTextureType,/*laya.webgl.WebGLContext.TEXTURE_MAG_FILTER*/0x2800,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
				break ;
			default :
				throw new Error("BaseTexture:unknown filterMode value.");
			}
	}

	/**
	*@private
	*/
	__proto._setWarpMode=function(orientation,mode){
		var gl=LayaGL.instance;
		WebGLContext.bindTexture(gl,this._glTextureType,this._glTexture);
		if (this._isPot(this._width)&& this._isPot(this._height)){
			switch (mode){
				case 0:
					gl.texParameteri(this._glTextureType,orientation,/*laya.webgl.WebGLContext.REPEAT*/0x2901);
					break ;
				case 1:
					gl.texParameteri(this._glTextureType,orientation,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
					break ;
				}
			}else {
			gl.texParameteri(this._glTextureType,orientation,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
		}
	}

	/**
	*@private
	*/
	__proto._setAnisotropy=function(value){
		var anisotropic=WebGLContext._extTextureFilterAnisotropic;
		if (anisotropic && !Browser.onLimixiu){
			value=Math.max(value,1);
			var gl=LayaGL.instance;
			WebGLContext.bindTexture(gl,this._glTextureType,this._glTexture);
			value=Math.min(gl.getParameter(anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT),value);
			gl.texParameterf(this._glTextureType,anisotropic.TEXTURE_MAX_ANISOTROPY_EXT,value);
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._disposeResource=function(){
		if (this._glTexture){
			LayaGL.instance.deleteTexture(this._glTexture);
			this._glTexture=null;
			this._setGPUMemory(0);
		}
	}

	/**
	*获取纹理资源。
	*/
	__proto._getSource=function(){
		if (this._readyed)
			return this._glTexture;
		else
		return null;
	}

	/**
	*设置纹理横向循环模式。
	*/
	/**
	*获取纹理横向循环模式。
	*/
	__getset(0,__proto,'wrapModeU',function(){
		return this._wrapModeU;
		},function(value){
		if (this._wrapModeU!==value){
			this._wrapModeU=value;
			(this._width!==-1)&& (this._setWarpMode(/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,value));
		}
	});

	/**
	*是否使用mipLevel
	*/
	__getset(0,__proto,'mipmap',function(){
		return this._mipmap;
	});

	/**
	*纹理格式
	*/
	__getset(0,__proto,'format',function(){
		return this._format;
	});

	/**
	*设置纹理纵向循环模式。
	*/
	/**
	*获取纹理纵向循环模式。
	*/
	__getset(0,__proto,'wrapModeV',function(){
		return this._wrapModeV;
		},function(value){
		if (this._wrapModeV!==value){
			this._wrapModeV=value;
			(this._height!==-1)&& (this._setWarpMode(/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,value));
		}
	});

	/**
	*获取默认纹理资源。
	*/
	__getset(0,__proto,'defaulteTexture',function(){
		throw "BaseTexture:must override it."
	});

	/**
	*缩小过滤器
	*/
	/**
	*缩小过滤器
	*/
	__getset(0,__proto,'filterMode',function(){
		return this._filterMode;
		},function(value){
		if (value!==this._filterMode){
			this._filterMode=value;
			((this._width!==-1)&& (this._height!==-1))&& (this._setFilterMode(value));
		}
	});

	/**
	*各向异性等级
	*/
	/**
	*各向异性等级
	*/
	__getset(0,__proto,'anisoLevel',function(){
		return this._anisoLevel;
		},function(value){
		if (value!==this._anisoLevel){
			this._anisoLevel=Math.max(1,Math.min(16,value));
			((this._width!==-1)&& (this._height!==-1))&& (this._setAnisotropy(value));
		}
	});

	BaseTexture.WARPMODE_REPEAT=0;
	BaseTexture.WARPMODE_CLAMP=1;
	BaseTexture.FILTERMODE_POINT=0;
	BaseTexture.FILTERMODE_BILINEAR=1;
	BaseTexture.FILTERMODE_TRILINEAR=2;
	BaseTexture.FORMAT_R8G8B8=0;
	BaseTexture.FORMAT_R8G8B8A8=1;
	BaseTexture.FORMAT_ALPHA8=2;
	BaseTexture.FORMAT_DXT1=3;
	BaseTexture.FORMAT_DXT5=4;
	BaseTexture.FORMAT_ETC1RGB=5;
	BaseTexture.FORMAT_PVRTCRGB_2BPPV=9;
	BaseTexture.FORMAT_PVRTCRGBA_2BPPV=10;
	BaseTexture.FORMAT_PVRTCRGB_4BPPV=11;
	BaseTexture.FORMAT_PVRTCRGBA_4BPPV=12;
	BaseTexture.FORMAT_DEPTH_16=0;
	BaseTexture.FORMAT_STENCIL_8=1;
	BaseTexture.FORMAT_DEPTHSTENCIL_16_8=2;
	BaseTexture.FORMAT_DEPTHSTENCIL_NONE=3;
	return BaseTexture;
})(Bitmap)



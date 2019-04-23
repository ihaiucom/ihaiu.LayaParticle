//class laya.webgl.resource.Texture2D extends laya.webgl.resource.BaseTexture
var Texture2D=(function(_super){
	function Texture2D(width,height,format,mipmap,canRead){
		/**@private */
		//this._canRead=false;
		/**@private */
		//this._pixels=null;
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		(format===void 0)&& (format=1);
		(mipmap===void 0)&& (mipmap=true);
		(canRead===void 0)&& (canRead=false);
		Texture2D.__super.call(this,format,mipmap);
		this._glTextureType=/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1;
		this._width=width;
		this._height=height;
		this._canRead=canRead;
		this._setWarpMode(/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,this._wrapModeU);
		this._setWarpMode(/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,this._wrapModeV);
		Config.is2DPixelArtGame && (this._filterMode=/*laya.webgl.resource.BaseTexture.FILTERMODE_POINT*/0);
		this._setFilterMode(this._filterMode);
		this._setAnisotropy(this._anisoLevel);
	}

	__class(Texture2D,'laya.webgl.resource.Texture2D',_super);
	var __proto=Texture2D.prototype;
	/**
	*@private
	*/
	__proto._calcualatesCompressedDataSize=function(format,width,height){
		switch (format){
			case 3:
			case 5:
				return ((width+3)>> 2)*((height+3)>> 2)*8;
			case 4:
				return ((width+3)>> 2)*((height+3)>> 2)*16;
			case 11:
			case 12:
				return Math.floor((Math.max(width,8)*Math.max(height,8)*4+7)/ 8);
			case 9:
			case 10:
				return Math.floor((Math.max(width,16)*Math.max(height,8)*2+7)/ 8);
			default :
				return 0;
			}
	}

	/**
	*@private
	*/
	__proto._pharseDDS=function(arrayBuffer){
		var FOURCC_DXT1=827611204;
		var FOURCC_DXT5=894720068;
		var DDPF_FOURCC=0x4;
		var DDSD_MIPMAPCOUNT=0x20000;
		var DDS_MAGIC=0x20534444;
		var DDS_HEADER_LENGTH=31;
		var DDS_HEADER_MAGIC=0;
		var DDS_HEADER_SIZE=1;
		var DDS_HEADER_FLAGS=2;
		var DDS_HEADER_HEIGHT=3;
		var DDS_HEADER_WIDTH=4;
		var DDS_HEADER_MIPMAPCOUNT=7;
		var DDS_HEADER_PF_FLAGS=20;
		var DDS_HEADER_PF_FOURCC=21;
		var header=new Int32Array(arrayBuffer,0,DDS_HEADER_LENGTH);
		if (header[DDS_HEADER_MAGIC] !=DDS_MAGIC)
			throw "Invalid magic number in DDS header";
		if (!(header[DDS_HEADER_PF_FLAGS] & DDPF_FOURCC))
			throw "Unsupported format, must contain a FourCC code";
		var compressedFormat=header[DDS_HEADER_PF_FOURCC];
		switch (this._format){
			case 3:
				if (compressedFormat!==FOURCC_DXT1)
					throw "the FourCC code is not same with texture format.";
				break ;
			case 4:
				if (compressedFormat!==FOURCC_DXT5)
					throw "the FourCC code is not same with texture format.";
				break ;
			default :
				throw "unknown texture format.";
			};
		var mipLevels=1;
		if (header[DDS_HEADER_FLAGS] & DDSD_MIPMAPCOUNT){
			mipLevels=Math.max(1,header[DDS_HEADER_MIPMAPCOUNT]);
			if (!this._mipmap)
				throw "the mipmap is not same with Texture2D.";
			}else {
			if (this._mipmap)
				throw "the mipmap is not same with Texture2D.";
		};
		var width=header[DDS_HEADER_WIDTH];
		var height=header[DDS_HEADER_HEIGHT];
		this._width=width;
		this._height=height;
		var dataOffset=header[DDS_HEADER_SIZE]+4;
		this._upLoadCompressedTexImage2D(arrayBuffer,width,height,mipLevels,dataOffset,0);
	}

	/**
	*@private
	*/
	__proto._pharseKTX=function(arrayBuffer){
		var PVR_FORMAT_2BPP_RGB=0;
		var PVR_FORMAT_2BPP_RGBA=1;
		var PVR_FORMAT_4BPP_RGB=2;
		var PVR_FORMAT_4BPP_RGBA=3;
		var PVR_FORMAT_ETC1=6;
		var PVR_MAGIC=0x03525650;
		var ETC_HEADER_LENGTH=13;
		var ETC_HEADER_FORMAT=4;
		var ETC_HEADER_HEIGHT=7;
		var ETC_HEADER_WIDTH=6;
		var ETC_HEADER_MIPMAPCOUNT=11;
		var ETC_HEADER_METADATA=12;
		var id=new Uint8Array(arrayBuffer,0,12);
		if (id[0] !=0xAB || id[1] !=0x4B || id[2] !=0x54 || id[3] !=0x58 || id[4] !=0x20 || id[5] !=0x31 || id[6] !=0x31 || id[7] !=0xBB || id[8] !=0x0D || id[9] !=0x0A || id[10] !=0x1A || id[11] !=0x0A)
			throw("Invalid fileIdentifier in KTX header");
		var header=new Int32Array(id.buffer,id.length,ETC_HEADER_LENGTH);
		var compressedFormat=header[ETC_HEADER_FORMAT];
		var innerFormat=this._getGLFormat();
		switch (this._format){
			case 5:
				if (compressedFormat!==innerFormat)
					throw "the format  is not same with texture format FORMAT_ETC1RGB.";
				break ;
			default :
				throw "unknown texture format.";
			};
		var mipLevels=header[ETC_HEADER_MIPMAPCOUNT];
		var width=header[ETC_HEADER_WIDTH];
		var height=header[ETC_HEADER_HEIGHT];
		this._width=width;
		this._height=height;
		var dataOffset=64+header[ETC_HEADER_METADATA];
		this._upLoadCompressedTexImage2D(arrayBuffer,width,height,mipLevels,dataOffset,4);
	}

	/**
	*@private
	*/
	__proto._pharsePVR=function(arrayBuffer){
		var PVR_FORMAT_2BPP_RGB=0;
		var PVR_FORMAT_2BPP_RGBA=1;
		var PVR_FORMAT_4BPP_RGB=2;
		var PVR_FORMAT_4BPP_RGBA=3;
		var PVR_FORMAT_ETC1=6;
		var PVR_MAGIC=0x03525650;
		var PVR_HEADER_LENGTH=13;
		var PVR_HEADER_MAGIC=0;
		var PVR_HEADER_FORMAT=2;
		var PVR_HEADER_HEIGHT=6;
		var PVR_HEADER_WIDTH=7;
		var PVR_HEADER_MIPMAPCOUNT=11;
		var PVR_HEADER_METADATA=12;
		var header=new Int32Array(arrayBuffer,0,PVR_HEADER_LENGTH);
		if (header[PVR_HEADER_MAGIC] !=PVR_MAGIC)
			throw("Invalid magic number in PVR header");
		var compressedFormat=header[PVR_HEADER_FORMAT];
		switch (this._format){
			case 5:
				if (compressedFormat!==PVR_FORMAT_ETC1)
					throw "the format  is not same with texture format FORMAT_ETC1RGB.";
				break ;
			case 9:
				if (compressedFormat!==PVR_FORMAT_2BPP_RGB)
					throw "the format  is not same with texture format FORMAT_PVRTCRGB_2BPPV.";
				break ;
			case 11:
				if (compressedFormat!==PVR_FORMAT_4BPP_RGB)
					throw "the format  is not same with texture format FORMAT_PVRTCRGB_4BPPV.";
				break ;
			case 10:
				if (compressedFormat!==PVR_FORMAT_2BPP_RGBA)
					throw "the format  is not same with texture format FORMAT_PVRTCRGBA_2BPPV.";
				break ;
			case 12:
				if (compressedFormat!==PVR_FORMAT_4BPP_RGBA)
					throw "the format  is not same with texture format FORMAT_PVRTCRGBA_4BPPV.";
				break ;
			default :
				throw "unknown texture format.";
			};
		var mipLevels=header[PVR_HEADER_MIPMAPCOUNT];
		var width=header[PVR_HEADER_WIDTH];
		var height=header[PVR_HEADER_HEIGHT];
		this._width=width;
		this._height=height;
		var dataOffset=header[PVR_HEADER_METADATA]+52;
		this._upLoadCompressedTexImage2D(arrayBuffer,width,height,mipLevels,dataOffset,0);
	}

	/**
	*@private
	*/
	__proto._upLoadCompressedTexImage2D=function(data,width,height,miplevelCount,dataOffset,imageSizeOffset){
		var gl=LayaGL.instance;
		var textureType=this._glTextureType;
		WebGLContext.bindTexture(gl,textureType,this._glTexture);
		var glFormat=this._getGLFormat();
		var offset=dataOffset;
		for (var i=0;i < miplevelCount;i++){
			offset+=imageSizeOffset;
			var mipDataSize=this._calcualatesCompressedDataSize(this._format,width,height);
			var mipData=new Uint8Array(data,offset,mipDataSize);
			gl.compressedTexImage2D(textureType,i,glFormat,width,height,0,mipData);
			width=width >> 1;
			height=height >> 1;
			offset+=mipDataSize;
		};
		var memory=offset;
		this._setGPUMemory(memory);
		this._readyed=true;
		this._activeResource();
	}

	/**
	*通过图片源填充纹理,可为HTMLImageElement、HTMLCanvasElement、HTMLVideoElement、ImageBitmap、ImageData,
	*设置之后纹理宽高可能会发生变化。
	*/
	__proto.loadImageSource=function(source,premultiplyAlpha){
		(premultiplyAlpha===void 0)&& (premultiplyAlpha=false);
		var width=source.width;
		var height=source.height;
		this._width=width;
		this._height=height;
		this._setWarpMode(/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,this._wrapModeU);
		this._setWarpMode(/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,this._wrapModeV);
		this._setFilterMode(this._filterMode);
		var gl=LayaGL.instance;
		WebGLContext.bindTexture(gl,this._glTextureType,this._glTexture);
		var glFormat=this._getGLFormat();
		if (Render.isConchApp){
			source.setPremultiplyAlpha(premultiplyAlpha);
			gl.texImage2D(this._glTextureType,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,source);
			}else {
			(premultiplyAlpha)&& (gl.pixelStorei(/*laya.webgl.WebGLContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL*/0x9241,true));
			gl.texImage2D(this._glTextureType,0,glFormat,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,source);
			(premultiplyAlpha)&& (gl.pixelStorei(/*laya.webgl.WebGLContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL*/0x9241,false));
		}
		if (this._mipmap && this._isPot(width)&& this._isPot(height)){
			gl.generateMipmap(this._glTextureType);
			this._setGPUMemory(width *height *4 *(1+1 / 3));
			}else {
			this._setGPUMemory(width *height *4);
		}
		if (this._canRead){
			if (Render.isConchApp){
				this._pixels=new Uint8Array(source._nativeObj.getImageData(0,0,width,height));
				}else {
				Browser.canvas.size(width,height);
				Browser.canvas.clear();
				Browser.context.drawImage(source,0,0,width,height);
				this._pixels=new Uint8Array(Browser.context.getImageData(0,0,width,height).data.buffer);
			}
		}
		this._readyed=true;
		this._activeResource();
	}

	/**
	*通过像素填充纹理。
	*@param pixels 像素。
	*@param miplevel 层级。
	*/
	__proto.setPixels=function(pixels,miplevel){
		(miplevel===void 0)&& (miplevel=0);
		if (!pixels)
			throw "Texture2D:pixels can't be null.";
		var width=this._width;
		var height=this._height;
		var gl=LayaGL.instance;
		var textureType=this._glTextureType;
		WebGLContext.bindTexture(gl,textureType,this._glTexture);
		var glFormat=this._getGLFormat();
		gl.texImage2D(textureType,miplevel,glFormat,width,height,0,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,pixels);
		if (this._mipmap && this._isPot(width)&& this._isPot(height)){
			gl.generateMipmap(textureType);
			this._setGPUMemory(width *height *4 *(1+1 / 3));
			}else {
			this._setGPUMemory(width *height *4);
		}
		if (this._canRead)
			this._pixels=pixels;
		this._readyed=true;
		this._activeResource();
	}

	/**
	*通过压缩数据填充纹理。
	*@param data 压缩数据。
	*@param miplevel 层级。
	*/
	__proto.setCompressData=function(data){
		switch (this._format){
			case 3:
			case 4:
				this._pharseDDS(data);
				break ;
			case 5:
				this._pharseKTX(data);
				break ;
			case 9:
			case 10:
			case 11:
			case 12:
				this._pharsePVR(data);
				break ;
			default :
				throw "Texture2D:unkonwn format.";
			}
	}

	/**
	*@inheritDoc
	*/
	__proto._recoverResource=function(){}
	/**
	*返回图片像素。
	*@return 图片像素。
	*/
	__proto.getPixels=function(){
		if (this._canRead)
			return this._pixels;
		else
		throw new Error("Texture2D: must set texture canRead is true.");
	}

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'defaulteTexture',function(){
		return laya.webgl.resource.Texture2D.grayTexture;
	});

	Texture2D.__init__=function(){
		var pixels=new Uint8Array(3);
		pixels[0]=128;
		pixels[1]=128;
		pixels[2]=128;
		Texture2D.grayTexture=new Texture2D(1,1,0,false,false);
		Texture2D.grayTexture.setPixels(pixels);
		Texture2D.grayTexture.lock=true;
	}

	Texture2D._parse=function(data,propertyParams,constructParams){
		var texture=constructParams ? new Texture2D(constructParams[0],constructParams[1],constructParams[2],constructParams[3],constructParams[4]):new Texture2D(0,0);
		if (propertyParams){
			texture.wrapModeU=propertyParams.wrapModeU;
			texture.wrapModeV=propertyParams.wrapModeV;
			texture.filterMode=propertyParams.filterMode;
			texture.anisoLevel=propertyParams.anisoLevel;
		}
		switch (texture._format){
			case 0:
			case 1:
				texture.loadImageSource(data);
				break ;
			case 3:
			case 4:
			case 5:
			case 9:
			case 10:
			case 11:
			case 12:
				texture.setCompressData(data);
				break ;
			default :
				throw "Texture2D:unkonwn format.";
			}
		return texture;
	}

	Texture2D.load=function(url,complete){
		Laya.loader.create(url,complete,null,/*laya.net.Loader.TEXTURE2D*/"TEXTURE2D");
	}

	Texture2D.grayTexture=null;
	return Texture2D;
})(BaseTexture)



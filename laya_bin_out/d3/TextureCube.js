/**
*<code>TextureCube</code> 类用于生成立方体纹理。
*/
//class laya.d3.resource.TextureCube extends laya.webgl.resource.BaseTexture
var TextureCube=(function(_super){
	function TextureCube(format,mipmap){
		/**@private */
		//this._premultiplyAlpha=0;
		(format===void 0)&& (format=0);
		(mipmap===void 0)&& (mipmap=false);
		TextureCube.__super.call(this,format,mipmap);
		this._glTextureType=/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP*/0x8513;
	}

	__class(TextureCube,'laya.d3.resource.TextureCube',_super);
	var __proto=TextureCube.prototype;
	/**
	*通过六张图片源填充纹理。
	*@param 图片源数组。
	*/
	__proto.setSixSideImageSources=function(source,premultiplyAlpha){
		(premultiplyAlpha===void 0)&& (premultiplyAlpha=false);
		var width=0;
		var height=0;
		for (var i=0;i < 6;i++){
			var img=source[i];
			if (!img){
				console.log("TextureCube: image Source can't be null.");
				return;
			};
			var nextWidth=img.width;
			var nextHeight=img.height;
			if (i > 0){
				if (width!==nextWidth){
					console.log("TextureCube: each side image's width and height must same.");
					return;
				}
			}
			width=nextWidth;
			height=nextHeight;
			if (width!==height){
				console.log("TextureCube: each side image's width and height must same.");
				return;
			}
		}
		this._width=width;
		this._height=height;
		var gl=LayaGL.instance;
		WebGLContext.bindTexture(gl,this._glTextureType,this._glTexture);
		var glFormat=this._getGLFormat();
		if (!Render.isConchApp){
			(premultiplyAlpha)&& (gl.pixelStorei(/*laya.webgl.WebGLContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL*/0x9241,true));
			gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_POSITIVE_Z*/0x8519,0,glFormat,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,source[0]);
			gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_NEGATIVE_Z*/0x851A,0,glFormat,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,source[1]);
			gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_POSITIVE_X*/0x8515,0,glFormat,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,source[2]);
			gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_NEGATIVE_X*/0x8516,0,glFormat,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,source[3]);
			gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_POSITIVE_Y*/0x8517,0,glFormat,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,source[4]);
			gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_NEGATIVE_Y*/0x8518,0,glFormat,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,source[5]);
			(premultiplyAlpha)&& (gl.pixelStorei(/*laya.webgl.WebGLContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL*/0x9241,false));
			}else {
			if (premultiplyAlpha==true){
				for (var j=0;j < 6;j++)
				source[j].setPremultiplyAlpha(premultiplyAlpha);
			}
			gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_POSITIVE_Z*/0x8519,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,source[0]);
			gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_NEGATIVE_Z*/0x851A,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,source[1]);
			gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_POSITIVE_X*/0x8515,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,source[2]);
			gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_NEGATIVE_X*/0x8516,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,source[3]);
			gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_POSITIVE_Y*/0x8517,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,source[4]);
			gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_NEGATIVE_Y*/0x8518,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,source[5]);
		}
		if (this._mipmap && this._isPot(width)&& this._isPot(height)){
			gl.generateMipmap(this._glTextureType);
			this._setGPUMemory(width *height *4 *(1+1 / 3)*6);
			}else {
			this._setGPUMemory(width *height *4 *6);
		}
		this._setWarpMode(/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,this._wrapModeU);
		this._setWarpMode(/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,this._wrapModeV);
		this._setFilterMode(this._filterMode);
		this._readyed=true;
		this._activeResource();
	}

	/**
	*通过六张图片源填充纹理。
	*@param 图片源数组。
	*/
	__proto.setSixSidePixels=function(width,height,pixels){
		if (width <=0 || height <=0)
			throw new Error("TextureCube:width or height must large than 0.");
		if (!pixels)
			throw new Error("TextureCube:pixels can't be null.");
		this._width=width;
		this._height=height;
		var gl=LayaGL.instance;
		WebGLContext.bindTexture(gl,this._glTextureType,this._glTexture);
		var glFormat=this._getGLFormat();
		gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_POSITIVE_Z*/0x8519,0,glFormat,width,height,0,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,pixels[0]);
		gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_NEGATIVE_Z*/0x851A,0,glFormat,width,height,0,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,pixels[1]);
		gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_POSITIVE_X*/0x8515,0,glFormat,width,height,0,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,pixels[2]);
		gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_NEGATIVE_X*/0x8516,0,glFormat,width,height,0,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,pixels[3]);
		gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_POSITIVE_Y*/0x8517,0,glFormat,width,height,0,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,pixels[4]);
		gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP_NEGATIVE_Y*/0x8518,0,glFormat,width,height,0,glFormat,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,pixels[5]);
		if (this._mipmap && this._isPot(width)&& this._isPot(height)){
			gl.generateMipmap(this._glTextureType);
			this._setGPUMemory(width *height *4 *(1+1 / 3)*6);
			}else {
			this._setGPUMemory(width *height *4 *6);
		}
		this._setWarpMode(/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,this._wrapModeU);
		this._setWarpMode(/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,this._wrapModeV);
		this._setFilterMode(this._filterMode);
		this._readyed=true;
		this._activeResource();
	}

	/**
	*@inheritDoc
	*/
	__proto._recoverResource=function(){}
	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'defaulteTexture',function(){
		return TextureCube.grayTexture;
	});

	TextureCube.__init__=function(){
		var pixels=new Uint8Array(3);
		pixels[0]=128;
		pixels[1]=128;
		pixels[2]=128;
		TextureCube.grayTexture=new TextureCube(0,false);
		TextureCube.grayTexture.setSixSidePixels(1,1,[pixels,pixels,pixels,pixels,pixels,pixels]);
		TextureCube.grayTexture.lock=true;
	}

	TextureCube._parse=function(data,propertyParams,constructParams){
		var texture=constructParams ? new TextureCube(constructParams[0],constructParams[1]):new TextureCube();
		texture.setSixSideImageSources(data);
		return texture;
	}

	TextureCube.load=function(url,complete){
		Laya.loader.create(url,complete,null,/*Laya3D.TEXTURECUBE*/"TEXTURECUBE");
	}

	TextureCube.grayTexture=null;
	return TextureCube;
})(BaseTexture)


/**

*/
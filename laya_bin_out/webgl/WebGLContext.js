//class laya.webgl.WebGLContext
var WebGLContext=(function(){
	function WebGLContext(){}
	__class(WebGLContext,'laya.webgl.WebGLContext');
	var __proto=WebGLContext.prototype;
	__proto.getContextAttributes=function(){return null;}
	__proto.isContextLost=function(){}
	__proto.getSupportedExtensions=function(){return null;}
	__proto.getExtension=function(name){return null;}
	__proto.activeTexture=function(texture){}
	__proto.attachShader=function(program,shader){}
	__proto.bindAttribLocation=function(program,index,name){}
	__proto.bindBuffer=function(target,buffer){}
	__proto.bindFramebuffer=function(target,framebuffer){}
	__proto.bindRenderbuffer=function(target,renderbuffer){}
	__proto.bindTexture=function(target,texture){}
	__proto.useTexture=function(value){}
	__proto.blendColor=function(red,green,blue,alpha){}
	__proto.blendEquation=function(mode){}
	__proto.blendEquationSeparate=function(modeRGB,modeAlpha){}
	__proto.blendFunc=function(sfactor,dfactor){}
	__proto.blendFuncSeparate=function(srcRGB,dstRGB,srcAlpha,dstAlpha){}
	__proto.bufferData=function(target,size,usage){}
	__proto.bufferSubData=function(target,offset,data){}
	__proto.checkFramebufferStatus=function(target){return null;}
	__proto.clear=function(mask){}
	__proto.clearColor=function(red,green,blue,alpha){}
	__proto.clearDepth=function(depth){}
	__proto.clearStencil=function(s){}
	__proto.colorMask=function(red,green,blue,alpha){}
	__proto.compileShader=function(shader){}
	__proto.copyTexImage2D=function(target,level,internalformat,x,y,width,height,border){}
	__proto.copyTexSubImage2D=function(target,level,xoffset,yoffset,x,y,width,height){}
	__proto.createBuffer=function(){}
	__proto.createFramebuffer=function(){}
	__proto.createProgram=function(){}
	__proto.createRenderbuffer=function(){}
	__proto.createShader=function(type){}
	__proto.createTexture=function(){return null}
	__proto.cullFace=function(mode){}
	__proto.deleteBuffer=function(buffer){}
	__proto.deleteFramebuffer=function(framebuffer){}
	__proto.deleteProgram=function(program){}
	__proto.deleteRenderbuffer=function(renderbuffer){}
	__proto.deleteShader=function(shader){}
	__proto.deleteTexture=function(texture){}
	__proto.depthFunc=function(func){}
	__proto.depthMask=function(flag){}
	__proto.depthRange=function(zNear,zFar){}
	__proto.detachShader=function(program,shader){}
	__proto.disable=function(cap){}
	__proto.disableVertexAttribArray=function(index){}
	__proto.drawArrays=function(mode,first,count){}
	__proto.drawElements=function(mode,count,type,offset){}
	__proto.enable=function(cap){}
	__proto.enableVertexAttribArray=function(index){}
	__proto.finish=function(){}
	__proto.flush=function(){}
	__proto.framebufferRenderbuffer=function(target,attachment,renderbuffertarget,renderbuffer){}
	__proto.framebufferTexture2D=function(target,attachment,textarget,texture,level){}
	__proto.frontFace=function(mode){return null;}
	__proto.generateMipmap=function(target){return null;}
	__proto.getActiveAttrib=function(program,index){return null;}
	__proto.getActiveUniform=function(program,index){return null;}
	__proto.getAttribLocation=function(program,name){return 0;}
	__proto.getParameter=function(pname){return null;}
	__proto.getBufferParameter=function(target,pname){return null;}
	__proto.getError=function(){return null;}
	__proto.getFramebufferAttachmentParameter=function(target,attachment,pname){}
	__proto.getProgramParameter=function(program,pname){return 0;}
	__proto.getProgramInfoLog=function(program){return null;}
	__proto.getRenderbufferParameter=function(target,pname){return null;}
	__proto.getShaderPrecisionFormat=function(__arg){
		var arg=arguments;return null;}
	__proto.getShaderParameter=function(shader,pname){}
	__proto.getShaderInfoLog=function(shader){return null;}
	__proto.getShaderSource=function(shader){return null;}
	__proto.getTexParameter=function(target,pname){}
	__proto.getUniform=function(program,location){}
	__proto.getUniformLocation=function(program,name){return null;}
	__proto.getVertexAttrib=function(index,pname){return null;}
	__proto.getVertexAttribOffset=function(index,pname){return null;}
	__proto.hint=function(target,mode){}
	__proto.isBuffer=function(buffer){}
	__proto.isEnabled=function(cap){}
	__proto.isFramebuffer=function(framebuffer){}
	__proto.isProgram=function(program){}
	__proto.isRenderbuffer=function(renderbuffer){}
	__proto.isShader=function(shader){}
	__proto.isTexture=function(texture){}
	__proto.lineWidth=function(width){}
	__proto.linkProgram=function(program){}
	__proto.pixelStorei=function(pname,param){}
	__proto.polygonOffset=function(factor,units){}
	__proto.readPixels=function(x,y,width,height,format,type,pixels){}
	__proto.renderbufferStorage=function(target,internalformat,width,height){}
	__proto.sampleCoverage=function(value,invert){}
	__proto.scissor=function(x,y,width,height){}
	__proto.shaderSource=function(shader,source){}
	__proto.stencilFunc=function(func,ref,mask){}
	__proto.stencilFuncSeparate=function(face,func,ref,mask){}
	__proto.stencilMask=function(mask){}
	__proto.stencilMaskSeparate=function(face,mask){}
	__proto.stencilOp=function(fail,zfail,zpass){}
	__proto.stencilOpSeparate=function(face,fail,zfail,zpass){}
	__proto.texImage2D=function(__args){}
	__proto.texParameterf=function(target,pname,param){}
	__proto.texParameteri=function(target,pname,param){}
	__proto.texSubImage2D=function(__args){}
	__proto.uniform1f=function(location,x){}
	__proto.uniform1fv=function(location,v){}
	__proto.uniform1i=function(location,x){}
	__proto.uniform1iv=function(location,v){}
	__proto.uniform2f=function(location,x,y){}
	__proto.uniform2fv=function(location,v){}
	__proto.uniform2i=function(location,x,y){}
	__proto.uniform2iv=function(location,v){}
	__proto.uniform3f=function(location,x,y,z){}
	__proto.uniform3fv=function(location,v){}
	__proto.uniform3i=function(location,x,y,z){}
	__proto.uniform3iv=function(location,v){}
	__proto.uniform4f=function(location,x,y,z,w){}
	__proto.uniform4fv=function(location,v){}
	__proto.uniform4i=function(location,x,y,z,w){}
	__proto.uniform4iv=function(location,v){}
	__proto.uniformMatrix2fv=function(location,transpose,value){}
	__proto.uniformMatrix3fv=function(location,transpose,value){}
	__proto.uniformMatrix4fv=function(location,transpose,value){}
	__proto.useProgram=function(program){}
	__proto.validateProgram=function(program){}
	__proto.vertexAttrib1f=function(indx,x){}
	__proto.vertexAttrib1fv=function(indx,values){}
	__proto.vertexAttrib2f=function(indx,x,y){}
	__proto.vertexAttrib2fv=function(indx,values){}
	__proto.vertexAttrib3f=function(indx,x,y,z){}
	__proto.vertexAttrib3fv=function(indx,values){}
	__proto.vertexAttrib4f=function(indx,x,y,z,w){}
	__proto.vertexAttrib4fv=function(indx,values){}
	__proto.vertexAttribPointer=function(indx,size,type,normalized,stride,offset){}
	__proto.viewport=function(x,y,width,height){}
	__proto.configureBackBuffer=function(width,height,antiAlias,enableDepthAndStencil,wantsBestResolution){
		(enableDepthAndStencil===void 0)&& (enableDepthAndStencil=true);
		(wantsBestResolution===void 0)&& (wantsBestResolution=false);
	}

	__proto.compressedTexImage2D=function(__args){}
	//TODO:coverage
	__proto.createVertexArray=function(){
		throw "not implemented";
	}

	//TODO:coverage
	__proto.bindVertexArray=function(vao){
		throw "not implemented";
	}

	//TODO:coverage
	__proto.deleteVertexArray=function(vao){
		throw "not implemented";
	}

	//TODO:coverage
	__proto.isVertexArray=function(vao){
		throw "not implemented";
	}

	WebGLContext.__init__=function(gl){
		WebGLContext.__init_native();
		laya.webgl.WebGLContext._checkExtensions(gl);
		if (!WebGL._isWebGL2){
			VertexArrayObject;
			if (window._setupVertexArrayObject){
				if (Browser.onMiniGame||Browser.onLimixiu)
					window._forceSetupVertexArrayObject(gl);
				else
				window._setupVertexArrayObject(gl);
			};
			var ext=((gl).rawgl || gl).getExtension("OES_vertex_array_object");
			if (ext){
				console.log("EXT:webgl support OES_vertex_array_object！");
				var glContext=gl;
				glContext.createVertexArray=function (){return ext.createVertexArrayOES();};
				glContext.bindVertexArray=function (vao){ext.bindVertexArrayOES(vao);};
				glContext.deleteVertexArray=function (vao){ext.deleteVertexArrayOES(vao);};
				glContext.isVertexArray=function (vao){ext.isVertexArrayOES(vao);};
			}
		}
	}

	WebGLContext._getExtension=function(gl,name){
		var prefixes=WebGLContext._extentionVendorPrefixes;
		for (var k in prefixes){
			var ext=gl.getExtension(prefixes[k]+name);
			if (ext)
				return ext;
		}
		return null;
	}

	WebGLContext._checkExtensions=function(gl){
		WebGLContext._extTextureFilterAnisotropic=WebGLContext._getExtension(gl,"EXT_texture_filter_anisotropic");
		WebGLContext._compressedTextureS3tc=WebGLContext._getExtension(gl,"WEBGL_compressed_texture_s3tc");
		WebGLContext._compressedTexturePvrtc=WebGLContext._getExtension(gl,"WEBGL_compressed_texture_pvrtc");
		WebGLContext._compressedTextureEtc1=WebGLContext._getExtension(gl,"WEBGL_compressed_texture_etc1");
		return null;
	}

	WebGLContext.__init_native=function(){
		if (!Render.isConchApp)return;
		var webGLContext=WebGLContext;
		webGLContext.useProgram=webGLContext.useProgramForNative;
		webGLContext.activeTexture=webGLContext.activeTextureForNative;
		webGLContext.bindTexture=webGLContext.bindTextureForNative;
		webGLContext.bindVertexArray=webGLContext.bindVertexArrayForNative;
		webGLContext.setDepthTest=webGLContext.setDepthTestForNative;
		webGLContext.setDepthMask=webGLContext.setDepthMaskForNative;
		webGLContext.setDepthFunc=webGLContext.setDepthFuncForNative;
		webGLContext.setBlend=webGLContext.setBlendForNative;
		webGLContext.setBlendFunc=webGLContext.setBlendFuncForNative;
		webGLContext.setCullFace=webGLContext.setCullFaceForNative;
		webGLContext.setFrontFace=webGLContext.setFrontFaceForNative;
		webGLContext._checkExtensions(Browser.window.LayaGLContext.instance);
	}

	WebGLContext.useProgram=function(gl,program){
		if (WebGLContext._useProgram===program)
			return false;
		gl.useProgram(program);
		WebGLContext._useProgram=program;
		return true;
	}

	WebGLContext.setDepthTest=function(gl,value){
		value!==WebGLContext._depthTest && (WebGLContext._depthTest=value,value?gl.enable(/*CLASS CONST:laya.webgl.WebGLContext.DEPTH_TEST*/0x0B71):gl.disable(/*CLASS CONST:laya.webgl.WebGLContext.DEPTH_TEST*/0x0B71));
	}

	WebGLContext.setDepthMask=function(gl,value){
		value!==WebGLContext._depthMask && (WebGLContext._depthMask=value,gl.depthMask(value));
	}

	WebGLContext.setDepthFunc=function(gl,value){
		value!==WebGLContext._depthFunc && (WebGLContext._depthFunc=value,gl.depthFunc(value));
	}

	WebGLContext.setBlend=function(gl,value){
		value!==WebGLContext._blend && (WebGLContext._blend=value,value?gl.enable(/*CLASS CONST:laya.webgl.WebGLContext.BLEND*/0x0BE2):gl.disable(/*CLASS CONST:laya.webgl.WebGLContext.BLEND*/0x0BE2));
	}

	WebGLContext.setBlendFunc=function(gl,sFactor,dFactor){
		(sFactor!==WebGLContext._sFactor||dFactor!==WebGLContext._dFactor)&& (WebGLContext._sFactor=sFactor,WebGLContext._dFactor=dFactor,gl.blendFunc(sFactor,dFactor));
	}

	WebGLContext.setCullFace=function(gl,value){
		value!==WebGLContext._cullFace && (WebGLContext._cullFace=value,value?gl.enable(/*CLASS CONST:laya.webgl.WebGLContext.CULL_FACE*/0x0B44):gl.disable(/*CLASS CONST:laya.webgl.WebGLContext.CULL_FACE*/0x0B44));
	}

	WebGLContext.setFrontFace=function(gl,value){
		value!==WebGLContext._frontFace && (WebGLContext._frontFace=value,gl.frontFace(value));
	}

	WebGLContext.activeTexture=function(gl,textureID){
		if (WebGLContext._activedTextureID!==textureID){
			gl.activeTexture(textureID);
			WebGLContext._activedTextureID=textureID;
		}
	}

	WebGLContext.bindTexture=function(gl,target,texture){
		if (WebGLContext._activeTextures[WebGLContext._activedTextureID-0x84C0]!==texture){
			gl.bindTexture(target,texture);
			WebGLContext._activeTextures[WebGLContext._activedTextureID-0x84C0]=texture;
		}
	}

	WebGLContext.useProgramForNative=function(gl,program){
		gl.useProgram(program);
		return true;
	}

	WebGLContext.setDepthTestForNative=function(gl,value){
		if (value)gl.enable(/*CLASS CONST:laya.webgl.WebGLContext.DEPTH_TEST*/0x0B71);
		else gl.disable(/*CLASS CONST:laya.webgl.WebGLContext.DEPTH_TEST*/0x0B71);
	}

	WebGLContext.setDepthMaskForNative=function(gl,value){
		gl.depthMask(value);
	}

	WebGLContext.setDepthFuncForNative=function(gl,value){
		gl.depthFunc(value);
	}

	WebGLContext.setBlendForNative=function(gl,value){
		if (value)gl.enable(/*CLASS CONST:laya.webgl.WebGLContext.BLEND*/0x0BE2);
		else gl.disable(/*CLASS CONST:laya.webgl.WebGLContext.BLEND*/0x0BE2);
	}

	WebGLContext.setBlendFuncForNative=function(gl,sFactor,dFactor){
		gl.blendFunc(sFactor,dFactor);
	}

	WebGLContext.setCullFaceForNative=function(gl,value){
		if (value)gl.enable(/*CLASS CONST:laya.webgl.WebGLContext.CULL_FACE*/0x0B44)
			else gl.disable(/*CLASS CONST:laya.webgl.WebGLContext.CULL_FACE*/0x0B44);
	}

	WebGLContext.setFrontFaceForNative=function(gl,value){
		gl.frontFace(value);
	}

	WebGLContext.activeTextureForNative=function(gl,textureID){
		gl.activeTexture(textureID);
	}

	WebGLContext.bindTextureForNative=function(gl,target,texture){
		gl.bindTexture(target,texture);
	}

	WebGLContext.bindVertexArrayForNative=function(gl,vertexArray){
		/*__JS__ */gl.bindVertexArray(vertexArray);
	}

	WebGLContext.DEPTH_BUFFER_BIT=0x00000100;
	WebGLContext.STENCIL_BUFFER_BIT=0x00000400;
	WebGLContext.COLOR_BUFFER_BIT=0x00004000;
	WebGLContext.POINTS=0x0000;
	WebGLContext.LINES=0x0001;
	WebGLContext.LINE_LOOP=0x0002;
	WebGLContext.LINE_STRIP=0x0003;
	WebGLContext.TRIANGLES=0x0004;
	WebGLContext.TRIANGLE_STRIP=0x0005;
	WebGLContext.TRIANGLE_FAN=0x0006;
	WebGLContext.ZERO=0;
	WebGLContext.ONE=1;
	WebGLContext.SRC_COLOR=0x0300;
	WebGLContext.ONE_MINUS_SRC_COLOR=0x0301;
	WebGLContext.SRC_ALPHA=0x0302;
	WebGLContext.ONE_MINUS_SRC_ALPHA=0x0303;
	WebGLContext.DST_ALPHA=0x0304;
	WebGLContext.ONE_MINUS_DST_ALPHA=0x0305;
	WebGLContext.DST_COLOR=0x0306;
	WebGLContext.ONE_MINUS_DST_COLOR=0x0307;
	WebGLContext.SRC_ALPHA_SATURATE=0x0308;
	WebGLContext.FUNC_ADD=0x8006;
	WebGLContext.BLEND_EQUATION=0x8009;
	WebGLContext.BLEND_EQUATION_RGB=0x8009;
	WebGLContext.BLEND_EQUATION_ALPHA=0x883D;
	WebGLContext.FUNC_SUBTRACT=0x800A;
	WebGLContext.FUNC_REVERSE_SUBTRACT=0x800B;
	WebGLContext.BLEND_DST_RGB=0x80C8;
	WebGLContext.BLEND_SRC_RGB=0x80C9;
	WebGLContext.BLEND_DST_ALPHA=0x80CA;
	WebGLContext.BLEND_SRC_ALPHA=0x80CB;
	WebGLContext.CONSTANT_COLOR=0x8001;
	WebGLContext.ONE_MINUS_CONSTANT_COLOR=0x8002;
	WebGLContext.CONSTANT_ALPHA=0x8003;
	WebGLContext.ONE_MINUS_CONSTANT_ALPHA=0x8004;
	WebGLContext.BLEND_COLOR=0x8005;
	WebGLContext.ARRAY_BUFFER=0x8892;
	WebGLContext.ELEMENT_ARRAY_BUFFER=0x8893;
	WebGLContext.ARRAY_BUFFER_BINDING=0x8894;
	WebGLContext.ELEMENT_ARRAY_BUFFER_BINDING=0x8895;
	WebGLContext.STREAM_DRAW=0x88E0;
	WebGLContext.STATIC_DRAW=0x88E4;
	WebGLContext.DYNAMIC_DRAW=0x88E8;
	WebGLContext.BUFFER_SIZE=0x8764;
	WebGLContext.BUFFER_USAGE=0x8765;
	WebGLContext.CURRENT_VERTEX_ATTRIB=0x8626;
	WebGLContext.FRONT=0x0404;
	WebGLContext.BACK=0x0405;
	WebGLContext.CULL_FACE=0x0B44;
	WebGLContext.FRONT_AND_BACK=0x0408;
	WebGLContext.BLEND=0x0BE2;
	WebGLContext.DITHER=0x0BD0;
	WebGLContext.STENCIL_TEST=0x0B90;
	WebGLContext.DEPTH_TEST=0x0B71;
	WebGLContext.SCISSOR_TEST=0x0C11;
	WebGLContext.POLYGON_OFFSET_FILL=0x8037;
	WebGLContext.SAMPLE_ALPHA_TO_COVERAGE=0x809E;
	WebGLContext.SAMPLE_COVERAGE=0x80A0;
	WebGLContext.NO_ERROR=0;
	WebGLContext.INVALID_ENUM=0x0500;
	WebGLContext.INVALID_VALUE=0x0501;
	WebGLContext.INVALID_OPERATION=0x0502;
	WebGLContext.OUT_OF_MEMORY=0x0505;
	WebGLContext.CW=0x0900;
	WebGLContext.CCW=0x0901;
	WebGLContext.LINE_WIDTH=0x0B21;
	WebGLContext.ALIASED_POINT_SIZE_RANGE=0x846D;
	WebGLContext.ALIASED_LINE_WIDTH_RANGE=0x846E;
	WebGLContext.CULL_FACE_MODE=0x0B45;
	WebGLContext.FRONT_FACE=0x0B46;
	WebGLContext.DEPTH_RANGE=0x0B70;
	WebGLContext.DEPTH_WRITEMASK=0x0B72;
	WebGLContext.DEPTH_CLEAR_VALUE=0x0B73;
	WebGLContext.DEPTH_FUNC=0x0B74;
	WebGLContext.STENCIL_CLEAR_VALUE=0x0B91;
	WebGLContext.STENCIL_FUNC=0x0B92;
	WebGLContext.STENCIL_FAIL=0x0B94;
	WebGLContext.STENCIL_PASS_DEPTH_FAIL=0x0B95;
	WebGLContext.STENCIL_PASS_DEPTH_PASS=0x0B96;
	WebGLContext.STENCIL_REF=0x0B97;
	WebGLContext.STENCIL_VALUE_MASK=0x0B93;
	WebGLContext.STENCIL_WRITEMASK=0x0B98;
	WebGLContext.STENCIL_BACK_FUNC=0x8800;
	WebGLContext.STENCIL_BACK_FAIL=0x8801;
	WebGLContext.STENCIL_BACK_PASS_DEPTH_FAIL=0x8802;
	WebGLContext.STENCIL_BACK_PASS_DEPTH_PASS=0x8803;
	WebGLContext.STENCIL_BACK_REF=0x8CA3;
	WebGLContext.STENCIL_BACK_VALUE_MASK=0x8CA4;
	WebGLContext.STENCIL_BACK_WRITEMASK=0x8CA5;
	WebGLContext.VIEWPORT=0x0BA2;
	WebGLContext.SCISSOR_BOX=0x0C10;
	WebGLContext.COLOR_CLEAR_VALUE=0x0C22;
	WebGLContext.COLOR_WRITEMASK=0x0C23;
	WebGLContext.UNPACK_ALIGNMENT=0x0CF5;
	WebGLContext.PACK_ALIGNMENT=0x0D05;
	WebGLContext.MAX_TEXTURE_SIZE=0x0D33;
	WebGLContext.MAX_VIEWPORT_DIMS=0x0D3A;
	WebGLContext.SUBPIXEL_BITS=0x0D50;
	WebGLContext.RED_BITS=0x0D52;
	WebGLContext.GREEN_BITS=0x0D53;
	WebGLContext.BLUE_BITS=0x0D54;
	WebGLContext.ALPHA_BITS=0x0D55;
	WebGLContext.DEPTH_BITS=0x0D56;
	WebGLContext.STENCIL_BITS=0x0D57;
	WebGLContext.POLYGON_OFFSET_UNITS=0x2A00;
	WebGLContext.POLYGON_OFFSET_FACTOR=0x8038;
	WebGLContext.TEXTURE_BINDING_2D=0x8069;
	WebGLContext.SAMPLE_BUFFERS=0x80A8;
	WebGLContext.SAMPLES=0x80A9;
	WebGLContext.SAMPLE_COVERAGE_VALUE=0x80AA;
	WebGLContext.SAMPLE_COVERAGE_INVERT=0x80AB;
	WebGLContext.NUM_COMPRESSED_TEXTURE_FORMATS=0x86A2;
	WebGLContext.COMPRESSED_TEXTURE_FORMATS=0x86A3;
	WebGLContext.DONT_CARE=0x1100;
	WebGLContext.FASTEST=0x1101;
	WebGLContext.NICEST=0x1102;
	WebGLContext.GENERATE_MIPMAP_HINT=0x8192;
	WebGLContext.BYTE=0x1400;
	WebGLContext.UNSIGNED_BYTE=0x1401;
	WebGLContext.SHORT=0x1402;
	WebGLContext.UNSIGNED_SHORT=0x1403;
	WebGLContext.INT=0x1404;
	WebGLContext.UNSIGNED_INT=0x1405;
	WebGLContext.FLOAT=0x1406;
	WebGLContext.DEPTH_COMPONENT=0x1902;
	WebGLContext.ALPHA=0x1906;
	WebGLContext.RGB=0x1907;
	WebGLContext.RGBA=0x1908;
	WebGLContext.LUMINANCE=0x1909;
	WebGLContext.LUMINANCE_ALPHA=0x190A;
	WebGLContext.UNSIGNED_SHORT_4_4_4_4=0x8033;
	WebGLContext.UNSIGNED_SHORT_5_5_5_1=0x8034;
	WebGLContext.UNSIGNED_SHORT_5_6_5=0x8363;
	WebGLContext.FRAGMENT_SHADER=0x8B30;
	WebGLContext.VERTEX_SHADER=0x8B31;
	WebGLContext.MAX_VERTEX_ATTRIBS=0x8869;
	WebGLContext.MAX_VERTEX_UNIFORM_VECTORS=0x8DFB;
	WebGLContext.MAX_VARYING_VECTORS=0x8DFC;
	WebGLContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS=0x8B4D;
	WebGLContext.MAX_VERTEX_TEXTURE_IMAGE_UNITS=0x8B4C;
	WebGLContext.MAX_TEXTURE_IMAGE_UNITS=0x8872;
	WebGLContext.MAX_FRAGMENT_UNIFORM_VECTORS=0x8DFD;
	WebGLContext.SHADER_TYPE=0x8B4F;
	WebGLContext.DELETE_STATUS=0x8B80;
	WebGLContext.LINK_STATUS=0x8B82;
	WebGLContext.VALIDATE_STATUS=0x8B83;
	WebGLContext.ATTACHED_SHADERS=0x8B85;
	WebGLContext.ACTIVE_UNIFORMS=0x8B86;
	WebGLContext.ACTIVE_ATTRIBUTES=0x8B89;
	WebGLContext.SHADING_LANGUAGE_VERSION=0x8B8C;
	WebGLContext.CURRENT_PROGRAM=0x8B8D;
	WebGLContext.NEVER=0x0200;
	WebGLContext.LESS=0x0201;
	WebGLContext.EQUAL=0x0202;
	WebGLContext.LEQUAL=0x0203;
	WebGLContext.GREATER=0x0204;
	WebGLContext.NOTEQUAL=0x0205;
	WebGLContext.GEQUAL=0x0206;
	WebGLContext.ALWAYS=0x0207;
	WebGLContext.KEEP=0x1E00;
	WebGLContext.REPLACE=0x1E01;
	WebGLContext.INCR=0x1E02;
	WebGLContext.DECR=0x1E03;
	WebGLContext.INVERT=0x150A;
	WebGLContext.INCR_WRAP=0x8507;
	WebGLContext.DECR_WRAP=0x8508;
	WebGLContext.VENDOR=0x1F00;
	WebGLContext.RENDERER=0x1F01;
	WebGLContext.VERSION=0x1F02;
	WebGLContext.NEAREST=0x2600;
	WebGLContext.LINEAR=0x2601;
	WebGLContext.NEAREST_MIPMAP_NEAREST=0x2700;
	WebGLContext.LINEAR_MIPMAP_NEAREST=0x2701;
	WebGLContext.NEAREST_MIPMAP_LINEAR=0x2702;
	WebGLContext.LINEAR_MIPMAP_LINEAR=0x2703;
	WebGLContext.TEXTURE_MAG_FILTER=0x2800;
	WebGLContext.TEXTURE_MIN_FILTER=0x2801;
	WebGLContext.TEXTURE_WRAP_S=0x2802;
	WebGLContext.TEXTURE_WRAP_T=0x2803;
	WebGLContext.TEXTURE_2D=0x0DE1;
	WebGLContext.TEXTURE_3D=0x806f;
	WebGLContext.TEXTURE=0x1702;
	WebGLContext.TEXTURE_CUBE_MAP=0x8513;
	WebGLContext.TEXTURE_BINDING_CUBE_MAP=0x8514;
	WebGLContext.TEXTURE_CUBE_MAP_POSITIVE_X=0x8515;
	WebGLContext.TEXTURE_CUBE_MAP_NEGATIVE_X=0x8516;
	WebGLContext.TEXTURE_CUBE_MAP_POSITIVE_Y=0x8517;
	WebGLContext.TEXTURE_CUBE_MAP_NEGATIVE_Y=0x8518;
	WebGLContext.TEXTURE_CUBE_MAP_POSITIVE_Z=0x8519;
	WebGLContext.TEXTURE_CUBE_MAP_NEGATIVE_Z=0x851A;
	WebGLContext.MAX_CUBE_MAP_TEXTURE_SIZE=0x851C;
	WebGLContext.TEXTURE0=0x84C0;
	WebGLContext.TEXTURE1=0x84C1;
	WebGLContext.TEXTURE2=0x84C2;
	WebGLContext.TEXTURE3=0x84C3;
	WebGLContext.TEXTURE4=0x84C4;
	WebGLContext.TEXTURE5=0x84C5;
	WebGLContext.TEXTURE6=0x84C6;
	WebGLContext.TEXTURE7=0x84C7;
	WebGLContext.TEXTURE8=0x84C8;
	WebGLContext.TEXTURE9=0x84C9;
	WebGLContext.TEXTURE10=0x84CA;
	WebGLContext.TEXTURE11=0x84CB;
	WebGLContext.TEXTURE12=0x84CC;
	WebGLContext.TEXTURE13=0x84CD;
	WebGLContext.TEXTURE14=0x84CE;
	WebGLContext.TEXTURE15=0x84CF;
	WebGLContext.TEXTURE16=0x84D0;
	WebGLContext.TEXTURE17=0x84D1;
	WebGLContext.TEXTURE18=0x84D2;
	WebGLContext.TEXTURE19=0x84D3;
	WebGLContext.TEXTURE20=0x84D4;
	WebGLContext.TEXTURE21=0x84D5;
	WebGLContext.TEXTURE22=0x84D6;
	WebGLContext.TEXTURE23=0x84D7;
	WebGLContext.TEXTURE24=0x84D8;
	WebGLContext.TEXTURE25=0x84D9;
	WebGLContext.TEXTURE26=0x84DA;
	WebGLContext.TEXTURE27=0x84DB;
	WebGLContext.TEXTURE28=0x84DC;
	WebGLContext.TEXTURE29=0x84DD;
	WebGLContext.TEXTURE30=0x84DE;
	WebGLContext.TEXTURE31=0x84DF;
	WebGLContext.ACTIVE_TEXTURE=0x84E0;
	WebGLContext.REPEAT=0x2901;
	WebGLContext.CLAMP_TO_EDGE=0x812F;
	WebGLContext.MIRRORED_REPEAT=0x8370;
	WebGLContext.FLOAT_VEC2=0x8B50;
	WebGLContext.FLOAT_VEC3=0x8B51;
	WebGLContext.FLOAT_VEC4=0x8B52;
	WebGLContext.INT_VEC2=0x8B53;
	WebGLContext.INT_VEC3=0x8B54;
	WebGLContext.INT_VEC4=0x8B55;
	WebGLContext.BOOL=0x8B56;
	WebGLContext.BOOL_VEC2=0x8B57;
	WebGLContext.BOOL_VEC3=0x8B58;
	WebGLContext.BOOL_VEC4=0x8B59;
	WebGLContext.FLOAT_MAT2=0x8B5A;
	WebGLContext.FLOAT_MAT3=0x8B5B;
	WebGLContext.FLOAT_MAT4=0x8B5C;
	WebGLContext.SAMPLER_2D=0x8B5E;
	WebGLContext.SAMPLER_CUBE=0x8B60;
	WebGLContext.VERTEX_ATTRIB_ARRAY_ENABLED=0x8622;
	WebGLContext.VERTEX_ATTRIB_ARRAY_SIZE=0x8623;
	WebGLContext.VERTEX_ATTRIB_ARRAY_STRIDE=0x8624;
	WebGLContext.VERTEX_ATTRIB_ARRAY_TYPE=0x8625;
	WebGLContext.VERTEX_ATTRIB_ARRAY_NORMALIZED=0x886A;
	WebGLContext.VERTEX_ATTRIB_ARRAY_POINTER=0x8645;
	WebGLContext.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING=0x889F;
	WebGLContext.COMPILE_STATUS=0x8B81;
	WebGLContext.LOW_FLOAT=0x8DF0;
	WebGLContext.MEDIUM_FLOAT=0x8DF1;
	WebGLContext.HIGH_FLOAT=0x8DF2;
	WebGLContext.LOW_INT=0x8DF3;
	WebGLContext.MEDIUM_INT=0x8DF4;
	WebGLContext.HIGH_INT=0x8DF5;
	WebGLContext.FRAMEBUFFER=0x8D40;
	WebGLContext.RENDERBUFFER=0x8D41;
	WebGLContext.RGBA4=0x8056;
	WebGLContext.RGB5_A1=0x8057;
	WebGLContext.RGB565=0x8D62;
	WebGLContext.DEPTH_COMPONENT16=0x81A5;
	WebGLContext.STENCIL_INDEX=0x1901;
	WebGLContext.STENCIL_INDEX8=0x8D48;
	WebGLContext.DEPTH_STENCIL=0x84F9;
	WebGLContext.RENDERBUFFER_WIDTH=0x8D42;
	WebGLContext.RENDERBUFFER_HEIGHT=0x8D43;
	WebGLContext.RENDERBUFFER_INTERNAL_FORMAT=0x8D44;
	WebGLContext.RENDERBUFFER_RED_SIZE=0x8D50;
	WebGLContext.RENDERBUFFER_GREEN_SIZE=0x8D51;
	WebGLContext.RENDERBUFFER_BLUE_SIZE=0x8D52;
	WebGLContext.RENDERBUFFER_ALPHA_SIZE=0x8D53;
	WebGLContext.RENDERBUFFER_DEPTH_SIZE=0x8D54;
	WebGLContext.RENDERBUFFER_STENCIL_SIZE=0x8D55;
	WebGLContext.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE=0x8CD0;
	WebGLContext.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME=0x8CD1;
	WebGLContext.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL=0x8CD2;
	WebGLContext.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE=0x8CD3;
	WebGLContext.COLOR_ATTACHMENT0=0x8CE0;
	WebGLContext.DEPTH_ATTACHMENT=0x8D00;
	WebGLContext.STENCIL_ATTACHMENT=0x8D20;
	WebGLContext.DEPTH_STENCIL_ATTACHMENT=0x821A;
	WebGLContext.NONE=0;
	WebGLContext.FRAMEBUFFER_COMPLETE=0x8CD5;
	WebGLContext.FRAMEBUFFER_INCOMPLETE_ATTACHMENT=0x8CD6;
	WebGLContext.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT=0x8CD7;
	WebGLContext.FRAMEBUFFER_INCOMPLETE_DIMENSIONS=0x8CD9;
	WebGLContext.FRAMEBUFFER_UNSUPPORTED=0x8CDD;
	WebGLContext.FRAMEBUFFER_BINDING=0x8CA6;
	WebGLContext.RENDERBUFFER_BINDING=0x8CA7;
	WebGLContext.MAX_RENDERBUFFER_SIZE=0x84E8;
	WebGLContext.INVALID_FRAMEBUFFER_OPERATION=0x0506;
	WebGLContext.UNPACK_FLIP_Y_WEBGL=0x9240;
	WebGLContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL=0x9241;
	WebGLContext.CONTEXT_LOST_WEBGL=0x9242;
	WebGLContext.UNPACK_COLORSPACE_CONVERSION_WEBGL=0x9243;
	WebGLContext.BROWSER_DEFAULT_WEBGL=0x9244;
	WebGLContext._extTextureFilterAnisotropic=null;
	WebGLContext._compressedTextureS3tc=null;
	WebGLContext._compressedTexturePvrtc=null;
	WebGLContext._compressedTextureEtc1=null;
	WebGLContext._glTextureIDs=[ /*CLASS CONST:laya.webgl.WebGLContext.TEXTURE0*/0x84C0,/*CLASS CONST:laya.webgl.WebGLContext.TEXTURE1*/0x84C1,/*CLASS CONST:laya.webgl.WebGLContext.TEXTURE2*/0x84C2,/*CLASS CONST:laya.webgl.WebGLContext.TEXTURE3*/0x84C3,/*CLASS CONST:laya.webgl.WebGLContext.TEXTURE4*/0x84C4,/*CLASS CONST:laya.webgl.WebGLContext.TEXTURE5*/0x84C5,/*CLASS CONST:laya.webgl.WebGLContext.TEXTURE6*/0x84C6,/*CLASS CONST:laya.webgl.WebGLContext.TEXTURE7*/0x84C7];
	WebGLContext._useProgram=null;
	WebGLContext._depthTest=true;
	WebGLContext._depthMask=true;
	WebGLContext._blend=false;
	WebGLContext._cullFace=false;
	WebGLContext._activedTextureID=0x84C0;
	__static(WebGLContext,
	['_extentionVendorPrefixes',function(){return this._extentionVendorPrefixes=["","WEBKIT_","MOZ_"];},'_activeTextures',function(){return this._activeTextures=new Array(8);},'_depthFunc',function(){return this._depthFunc=/*CLASS CONST:laya.webgl.WebGLContext.LESS*/0x0201;},'_sFactor',function(){return this._sFactor=/*CLASS CONST:laya.webgl.WebGLContext.ONE*/1;},'_dFactor',function(){return this._dFactor=/*CLASS CONST:laya.webgl.WebGLContext.ZERO*/0;},'_frontFace',function(){return this._frontFace=/*CLASS CONST:laya.webgl.WebGLContext.CCW*/0x0901;}
	]);
	return WebGLContext;
})()



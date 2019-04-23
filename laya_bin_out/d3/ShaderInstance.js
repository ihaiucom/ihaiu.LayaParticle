/**
*<code>ShaderInstance</code> 类用于实现ShaderInstance。
*/
//class laya.d3.shader.ShaderInstance extends laya.resource.Resource
var ShaderInstance=(function(_super){
	function ShaderInstance(vs,ps,attributeMap,uniformMap){
		/**@private */
		//this._attributeMap=null;
		/**@private */
		//this._uniformMap=null;
		/**@private */
		//this._vs=null;
		/**@private */
		//this._ps=null;
		/**@private */
		//this._curActTexIndex=0;
		/**@private */
		//this._vshader=null;
		/**@private */
		//this._pshader=null;
		/**@private */
		//this._program=null;
		/**@private */
		//this._sceneUniformParamsMap=null;
		/**@private */
		//this._cameraUniformParamsMap=null;
		/**@private */
		//this._spriteUniformParamsMap=null;
		/**@private */
		//this._materialUniformParamsMap=null;
		/**@private */
		//this._customUniformParamsMap=null;
		/**@private */
		//this._uploadLoopCount=0;
		/**@private */
		//this._uploadMaterial=null;
		/**@private */
		//this._uploadRender=null;
		/**@private */
		//this._uploadCamera=null;
		/**@private */
		//this._uploadScene=null;
		ShaderInstance.__super.call(this);
		this._vs=vs;
		this._ps=ps;
		this._attributeMap=attributeMap;
		this._uniformMap=uniformMap;
		this._create();
		this.lock=true;
	}

	__class(ShaderInstance,'laya.d3.shader.ShaderInstance',_super);
	var __proto=ShaderInstance.prototype;
	/**
	*@private
	*/
	__proto._create=function(){
		var gl=LayaGL.instance;
		this._program=gl.createProgram();
		this._vshader=this._createShader(gl,this._vs,/*laya.webgl.WebGLContext.VERTEX_SHADER*/0x8B31);
		this._pshader=this._createShader(gl,this._ps,/*laya.webgl.WebGLContext.FRAGMENT_SHADER*/0x8B30);
		gl.attachShader(this._program,this._vshader);
		gl.attachShader(this._program,this._pshader);
		for (var k in this._attributeMap)
		gl.bindAttribLocation(this._program,this._attributeMap[k],k);
		gl.linkProgram(this._program);
		if (!Render.isConchApp && Shader3D.debugMode && !gl.getProgramParameter(this._program,/*laya.webgl.WebGLContext.LINK_STATUS*/0x8B82))
			throw gl.getProgramInfoLog(this._program);
		var sceneParms=[];
		var cameraParms=[];
		var spriteParms=[];
		var materialParms=[];
		var customParms=[];
		this._customUniformParamsMap=[];
		var nUniformNum=0;
		if (Render.isConchApp){
			nUniformNum=(gl).getProgramParameterEx(this._vs,this._ps,"",/*laya.webgl.WebGLContext.ACTIVE_UNIFORMS*/0x8B86);
			}else {
			nUniformNum=gl.getProgramParameter(this._program,/*laya.webgl.WebGLContext.ACTIVE_UNIFORMS*/0x8B86);
		}
		WebGLContext.useProgram(gl,this._program);
		this._curActTexIndex=0;
		var one,i=0,n=0;
		for (i=0;i < nUniformNum;i++){
			var uniformData=null;
			if (Render.isConchApp){
				uniformData=(gl).getActiveUniformEx(this._vs,this._ps,"",i);
				}else {
				uniformData=gl.getActiveUniform(this._program,i);
			};
			var uniName=uniformData.name;
			one=new ShaderVariable();
			one.location=gl.getUniformLocation(this._program,uniName);
			if (uniName.indexOf('[0]')> 0){
				one.name=uniName=uniName.substr(0,uniName.length-3);
				one.isArray=true;
				}else {
				one.name=uniName;
				one.isArray=false;
			}
			one.type=uniformData.type;
			this._addShaderUnifiormFun(one);
			var uniformPeriod=this._uniformMap[uniName];
			if (uniformPeriod !=null){
				one.dataOffset=Shader3D.propertyNameToID(uniName);
				switch (uniformPeriod){
					case /*laya.d3.shader.Shader3D.PERIOD_CUSTOM*/0:
						customParms.push(one);
						break ;
					case /*laya.d3.shader.Shader3D.PERIOD_MATERIAL*/1:
						materialParms.push(one);
						break ;
					case /*laya.d3.shader.Shader3D.PERIOD_SPRITE*/2:
						spriteParms.push(one);
						break ;
					case /*laya.d3.shader.Shader3D.PERIOD_CAMERA*/3:
						cameraParms.push(one);
						break ;
					case /*laya.d3.shader.Shader3D.PERIOD_SCENE*/4:
						sceneParms.push(one);
						break ;
					default :
						throw new Error("Shader3D: period is unkonw.");
					}
			}
		}
		this._sceneUniformParamsMap=LayaGL.instance.createCommandEncoder(sceneParms.length *4 *5+4,64,true);
		for (i=0,n=sceneParms.length;i < n;i++)
		this._sceneUniformParamsMap.addShaderUniform(sceneParms[i]);
		this._cameraUniformParamsMap=LayaGL.instance.createCommandEncoder(cameraParms.length *4 *5+4,64,true);
		for (i=0,n=cameraParms.length;i < n;i++)
		this._cameraUniformParamsMap.addShaderUniform(cameraParms[i]);
		this._spriteUniformParamsMap=LayaGL.instance.createCommandEncoder(spriteParms.length *4 *5+4,64,true);
		for (i=0,n=spriteParms.length;i < n;i++)
		this._spriteUniformParamsMap.addShaderUniform(spriteParms[i]);
		this._materialUniformParamsMap=LayaGL.instance.createCommandEncoder(materialParms.length *4 *5+4,64,true);
		for (i=0,n=materialParms.length;i < n;i++)
		this._materialUniformParamsMap.addShaderUniform(materialParms[i]);
		this._customUniformParamsMap.length=customParms.length;
		for (i=0,n=customParms.length;i < n;i++){
			var custom=customParms[i];
			this._customUniformParamsMap[custom.dataOffset]=custom;
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._disposeResource=function(){
		LayaGL.instance.deleteShader(this._vshader);
		LayaGL.instance.deleteShader(this._pshader);
		LayaGL.instance.deleteProgram(this._program);
		this._vshader=this._pshader=this._program=null;
		this._setGPUMemory(0);
		this._curActTexIndex=0;
	}

	/**
	*@private
	*/
	__proto._addShaderUnifiormFun=function(one){
		var gl=LayaGL.instance;
		one.caller=this;
		var isArray=one.isArray;
		switch (one.type){
			case /*laya.webgl.WebGLContext.BOOL*/0x8B56:
				one.fun=this._uniform1i;
				one.uploadedValue=new Array(1);
				break ;
			case /*laya.webgl.WebGLContext.INT*/0x1404:
				one.fun=isArray ? this._uniform1iv :this._uniform1i;
				one.uploadedValue=new Array(1);
				break ;
			case /*laya.webgl.WebGLContext.FLOAT*/0x1406:
				one.fun=isArray ? this._uniform1fv :this._uniform1f;
				one.uploadedValue=new Array(1);
				break ;
			case /*laya.webgl.WebGLContext.FLOAT_VEC2*/0x8B50:
				one.fun=isArray ? this._uniform_vec2v :this._uniform_vec2;
				one.uploadedValue=new Array(2);
				break ;
			case /*laya.webgl.WebGLContext.FLOAT_VEC3*/0x8B51:
				one.fun=isArray ? this._uniform_vec3v :this._uniform_vec3;
				one.uploadedValue=new Array(3);
				break ;
			case /*laya.webgl.WebGLContext.FLOAT_VEC4*/0x8B52:
				one.fun=isArray ? this._uniform_vec4v :this._uniform_vec4;
				one.uploadedValue=new Array(4);
				break ;
			case /*laya.webgl.WebGLContext.FLOAT_MAT2*/0x8B5A:
				one.fun=this._uniformMatrix2fv;
				break ;
			case /*laya.webgl.WebGLContext.FLOAT_MAT3*/0x8B5B:
				one.fun=this._uniformMatrix3fv;
				break ;
			case /*laya.webgl.WebGLContext.FLOAT_MAT4*/0x8B5C:
				one.fun=isArray ? this._uniformMatrix4fv :this._uniformMatrix4f;
				break ;
			case /*laya.webgl.WebGLContext.SAMPLER_2D*/0x8B5E:
				gl.uniform1i(one.location,this._curActTexIndex);
				one.textureID=WebGLContext._glTextureIDs[this._curActTexIndex++];
				one.fun=this._uniform_sampler2D;
				break ;
			case 0x8b5f:
				gl.uniform1i(one.location,this._curActTexIndex);
				one.textureID=WebGLContext._glTextureIDs[this._curActTexIndex++];
				one.fun=this._uniform_sampler3D;
				break ;
			case /*laya.webgl.WebGLContext.SAMPLER_CUBE*/0x8B60:
				gl.uniform1i(one.location,this._curActTexIndex);
				one.textureID=WebGLContext._glTextureIDs[this._curActTexIndex++];
				one.fun=this._uniform_samplerCube;
				break ;
			default :
				throw new Error("compile shader err!");
				break ;
			}
	}

	/**
	*@private
	*/
	__proto._createShader=function(gl,str,type){
		var shader=gl.createShader(type);
		gl.shaderSource(shader,str);
		gl.compileShader(shader);
		if (Shader3D.debugMode && !gl.getShaderParameter(shader,/*laya.webgl.WebGLContext.COMPILE_STATUS*/0x8B81))
			throw gl.getShaderInfoLog(shader);
		return shader;
	}

	/**
	*@private
	*/
	__proto._uniform1f=function(one,value){
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value){
			LayaGL.instance.uniform1f(one.location,uploadedValue[0]=value);
			return 1;
		}
		return 0;
	}

	/**
	*@private
	*/
	__proto._uniform1fv=function(one,value){
		if (value.length < 4){
			var uploadedValue=one.uploadedValue;
			if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2] || uploadedValue[3]!==value[3]){
				LayaGL.instance.uniform1fv(one.location,value);
				uploadedValue[0]=value[0];
				uploadedValue[1]=value[1];
				uploadedValue[2]=value[2];
				uploadedValue[3]=value[3];
				return 1;
			}
			return 0;
			}else {
			LayaGL.instance.uniform1fv(one.location,value);
			return 1;
		}
	}

	/**
	*@private
	*/
	__proto._uniform_vec2=function(one,v){
		var value=v.elements;
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1]){
			LayaGL.instance.uniform2f(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1]);
			return 1;
		}
		return 0;
	}

	/**
	*@private
	*/
	__proto._uniform_vec2v=function(one,value){
		if (value.length < 2){
			var uploadedValue=one.uploadedValue;
			if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2] || uploadedValue[3]!==value[3]){
				LayaGL.instance.uniform2fv(one.location,value);
				uploadedValue[0]=value[0];
				uploadedValue[1]=value[1];
				uploadedValue[2]=value[2];
				uploadedValue[3]=value[3];
				return 1;
			}
			return 0;
			}else {
			LayaGL.instance.uniform2fv(one.location,value);
			return 1;
		}
	}

	/**
	*@private
	*/
	__proto._uniform_vec3=function(one,v){
		var value=v.elements;
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2]){
			LayaGL.instance.uniform3f(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1],uploadedValue[2]=value[2]);
			return 1;
		}
		return 0;
	}

	/**
	*@private
	*/
	__proto._uniform_vec3v=function(one,v){
		LayaGL.instance.uniform3fv(one.location,v);
		return 1;
	}

	/**
	*@private
	*/
	__proto._uniform_vec4=function(one,v){
		var value=v.elements;
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2] || uploadedValue[3]!==value[3]){
			LayaGL.instance.uniform4f(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1],uploadedValue[2]=value[2],uploadedValue[3]=value[3]);
			return 1;
		}
		return 0;
	}

	/**
	*@private
	*/
	__proto._uniform_vec4v=function(one,v){
		LayaGL.instance.uniform4fv(one.location,v);
		return 1;
	}

	/**
	*@private
	*/
	__proto._uniformMatrix2fv=function(one,value){
		LayaGL.instance.uniformMatrix2fv(one.location,false,value);
		return 1;
	}

	/**
	*@private
	*/
	__proto._uniformMatrix3fv=function(one,value){
		LayaGL.instance.uniformMatrix3fv(one.location,false,value);
		return 1;
	}

	/**
	*@private
	*/
	__proto._uniformMatrix4f=function(one,m){
		var value=m.elements;
		LayaGL.instance.uniformMatrix4fv(one.location,false,value);
		return 1;
	}

	/**
	*@private
	*/
	__proto._uniformMatrix4fv=function(one,m){
		LayaGL.instance.uniformMatrix4fv(one.location,false,m);
		return 1;
	}

	/**
	*@private
	*/
	__proto._uniform1i=function(one,value){
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value){
			LayaGL.instance.uniform1i(one.location,uploadedValue[0]=value);
			return 1;
		}
		return 0;
	}

	/**
	*@private
	*/
	__proto._uniform1iv=function(one,value){
		LayaGL.instance.uniform1iv(one.location,value);
		return 1;
	}

	/**
	*@private
	*/
	__proto._uniform_ivec2=function(one,value){
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1]){
			LayaGL.instance.uniform2i(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1]);
			return 1;
		}
		return 0;
	}

	/**
	*@private
	*/
	__proto._uniform_ivec2v=function(one,value){
		LayaGL.instance.uniform2iv(one.location,value);
		return 1;
	}

	/**
	*@private
	*/
	__proto._uniform_vec3i=function(one,value){
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2]){
			LayaGL.instance.uniform3i(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1],uploadedValue[2]=value[2]);
			return 1;
		}
		return 0;
	}

	/**
	*@private
	*/
	__proto._uniform_vec3vi=function(one,value){
		LayaGL.instance.uniform3iv(one.location,value);
		return 1;
	}

	/**
	*@private
	*/
	__proto._uniform_vec4i=function(one,value){
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2] || uploadedValue[3]!==value[3]){
			LayaGL.instance.uniform4i(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1],uploadedValue[2]=value[2],uploadedValue[3]=value[3]);
			return 1;
		}
		return 0;
	}

	/**
	*@private
	*/
	__proto._uniform_vec4vi=function(one,value){
		LayaGL.instance.uniform4iv(one.location,value);
		return 1;
	}

	/**
	*@private
	*/
	__proto._uniform_sampler2D=function(one,texture){
		var value=texture._getSource()|| texture.defaulteTexture._getSource();
		var gl=LayaGL.instance;
		WebGLContext.activeTexture(gl,one.textureID);
		WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,value);
		return 0;
	}

	__proto._uniform_sampler3D=function(one,texture){
		var value=texture._getSource()|| texture.defaulteTexture._getSource();
		var gl=LayaGL.instance;
		WebGLContext.activeTexture(gl,one.textureID);
		WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_3D*/0x806f,value);
		return 0;
	}

	/**
	*@private
	*/
	__proto._uniform_samplerCube=function(one,texture){
		var value=texture._getSource()|| texture.defaulteTexture._getSource();
		var gl=LayaGL.instance;
		WebGLContext.activeTexture(gl,one.textureID);
		WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP*/0x8513,value);
		return 0;
	}

	/**
	*@private
	*/
	__proto.bind=function(){
		return WebGLContext.useProgram(LayaGL.instance,this._program);
	}

	/**
	*@private
	*/
	__proto.uploadUniforms=function(shaderUniform,shaderDatas,uploadUnTexture){
		Stat.shaderCall+=LayaGLRunner.uploadShaderUniforms(LayaGL.instance,shaderUniform,shaderDatas,uploadUnTexture);
	}

	/**
	*@private
	*/
	__proto.uploadCustomUniform=function(index,data){
		Stat.shaderCall+=LayaGLRunner.uploadCustomUniform(LayaGL.instance,this._customUniformParamsMap,index,data);
	}

	/**
	*@private
	*[NATIVE]
	*/
	__proto._uniformMatrix2fvForNative=function(one,value){
		LayaGL.instance.uniformMatrix2fvEx(one.location,false,value);
		return 1;
	}

	/**
	*@private
	*[NATIVE]
	*/
	__proto._uniformMatrix3fvForNative=function(one,value){
		LayaGL.instance.uniformMatrix3fvEx(one.location,false,value);
		return 1;
	}

	/**
	*@private
	*[NATIVE]
	*/
	__proto._uniformMatrix4fvForNative=function(one,m){
		LayaGL.instance.uniformMatrix4fvEx(one.location,false,m);
		return 1;
	}

	return ShaderInstance;
})(Resource)


/**

*/
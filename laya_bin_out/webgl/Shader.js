//class laya.webgl.shader.Shader extends laya.webgl.shader.BaseShader
var Shader=(function(_super){
	function Shader(vs,ps,saveName,nameMap,bindAttrib){
		//存储预编译结果，可以通过名字获得内容,目前不支持#ifdef嵌套和条件
		this._attribInfo=null;
		this.customCompile=false;
		//this._nameMap=null;
		//shader参数别名，语义
		//this._vs=null;
		//this._ps=null;
		this._curActTexIndex=0;
		//this._reCompile=false;
		//存储一些私有变量
		this.tag={};
		//this._vshader=null;
		//this._pshader=null;
		this._program=null;
		this._params=null;
		this._paramsMap={};
		Shader.__super.call(this);
		if ((!vs)|| (!ps))throw "Shader Error";
		this._attribInfo=bindAttrib;
		if (Render.isConchApp){
			this.customCompile=true;
		}
		this._id=++Shader._count;
		this._vs=vs;
		this._ps=ps;
		this._nameMap=nameMap ? nameMap :{};
		saveName !=null && (Shader.sharders[saveName]=this);
		this.recreateResource();
		this.lock=true;
	}

	__class(Shader,'laya.webgl.shader.Shader',_super);
	var __proto=Shader.prototype;
	__proto.recreateResource=function(){
		this._compile();
		this._setGPUMemory(0);
	}

	//TODO:coverage
	__proto._disposeResource=function(){
		WebGL.mainContext.deleteShader(this._vshader);
		WebGL.mainContext.deleteShader(this._pshader);
		WebGL.mainContext.deleteProgram(this._program);
		this._vshader=this._pshader=this._program=null;
		this._params=null;
		this._paramsMap={};
		this._setGPUMemory(0);
		this._curActTexIndex=0;
	}

	__proto._compile=function(){
		if (!this._vs || !this._ps || this._params)
			return;
		this._reCompile=true;
		this._params=[];
		var result;
		if (this.customCompile)
			result=ShaderCompile.preGetParams(this._vs,this._ps);
		var gl=WebGL.mainContext;
		this._program=gl.createProgram();
		this._vshader=Shader._createShader(gl,this._vs,/*laya.webgl.WebGLContext.VERTEX_SHADER*/0x8B31);
		this._pshader=Shader._createShader(gl,this._ps,/*laya.webgl.WebGLContext.FRAGMENT_SHADER*/0x8B30);
		gl.attachShader(this._program,this._vshader);
		gl.attachShader(this._program,this._pshader);
		var one,i=0,j=0,n=0,location;
		var attribDescNum=this._attribInfo?this._attribInfo.length:0;
		for (i=0;i < attribDescNum;i+=2){
			gl.bindAttribLocation(this._program,this._attribInfo[i+1],this._attribInfo[i]);
		}
		gl.linkProgram(this._program);
		if (!this.customCompile && !gl.getProgramParameter(this._program,/*laya.webgl.WebGLContext.LINK_STATUS*/0x8B82)){
			throw gl.getProgramInfoLog(this._program);
		};
		var nUniformNum=this.customCompile ? result.uniforms.length :gl.getProgramParameter(this._program,/*laya.webgl.WebGLContext.ACTIVE_UNIFORMS*/0x8B86);
		for (i=0;i < nUniformNum;i++){
			var uniform=this.customCompile ? result.uniforms[i] :gl.getActiveUniform(this._program,i);
			location=gl.getUniformLocation(this._program,uniform.name);
			one={vartype:"uniform",glfun:null,ivartype:1,location:location,name:uniform.name,type:uniform.type,isArray:false,isSame:false,preValue:null,indexOfParams:0};
			if (one.name.indexOf('[0]')> 0){
				one.name=one.name.substr(0,one.name.length-3);
				one.isArray=true;
				one.location=gl.getUniformLocation(this._program,one.name);
			}
			this._params.push(one);
		}
		for (i=0,n=this._params.length;i < n;i++){
			one=this._params[i];
			one.indexOfParams=i;
			one.index=1;
			one.value=[one.location,null];
			one.codename=one.name;
			one.name=this._nameMap[one.codename] ? this._nameMap[one.codename] :one.codename;
			this._paramsMap[one.name]=one;
			one._this=this;
			one.uploadedValue=[];
			switch (one.type){
				case /*laya.webgl.WebGLContext.INT*/0x1404:
					one.fun=one.isArray ? this._uniform1iv :this._uniform1i;
					break ;
				case /*laya.webgl.WebGLContext.FLOAT*/0x1406:
					one.fun=one.isArray ? this._uniform1fv :this._uniform1f;
					break ;
				case /*laya.webgl.WebGLContext.FLOAT_VEC2*/0x8B50:
					one.fun=one.isArray ? this._uniform_vec2v:this._uniform_vec2;
					break ;
				case /*laya.webgl.WebGLContext.FLOAT_VEC3*/0x8B51:
					one.fun=one.isArray ? this._uniform_vec3v:this._uniform_vec3;
					break ;
				case /*laya.webgl.WebGLContext.FLOAT_VEC4*/0x8B52:
					one.fun=one.isArray ? this._uniform_vec4v:this._uniform_vec4;
					break ;
				case /*laya.webgl.WebGLContext.SAMPLER_2D*/0x8B5E:
					one.fun=this._uniform_sampler2D;
					break ;
				case /*laya.webgl.WebGLContext.SAMPLER_CUBE*/0x8B60:
					one.fun=this._uniform_samplerCube;
					break ;
				case /*laya.webgl.WebGLContext.FLOAT_MAT4*/0x8B5C:
					one.glfun=gl.uniformMatrix4fv;
					one.fun=this._uniformMatrix4fv;
					break ;
				case /*laya.webgl.WebGLContext.BOOL*/0x8B56:
					one.fun=this._uniform1i;
					break ;
				case /*laya.webgl.WebGLContext.FLOAT_MAT2*/0x8B5A:
				case /*laya.webgl.WebGLContext.FLOAT_MAT3*/0x8B5B:
					throw new Error("compile shader err!");
				default :
					throw new Error("compile shader err!");
				}
		}
	}

	//TODO:coverage
	__proto.getUniform=function(name){
		return this._paramsMap[name];
	}

	//TODO:coverage
	__proto._uniform1f=function(one,value){
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value){
			WebGL.mainContext.uniform1f(one.location,uploadedValue[0]=value);
			return 1;
		}
		return 0;
	}

	//TODO:coverage
	__proto._uniform1fv=function(one,value){
		if (value.length < 4){
			var uploadedValue=one.uploadedValue;
			if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2] || uploadedValue[3]!==value[3]){
				WebGL.mainContext.uniform1fv(one.location,value);
				uploadedValue[0]=value[0];
				uploadedValue[1]=value[1];
				uploadedValue[2]=value[2];
				uploadedValue[3]=value[3];
				return 1;
			}
			return 0;
			}else {
			WebGL.mainContext.uniform1fv(one.location,value);
			return 1;
		}
	}

	__proto._uniform_vec2=function(one,value){
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1]){
			WebGL.mainContext.uniform2f(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1]);
			return 1;
		}
		return 0;
	}

	//TODO:coverage
	__proto._uniform_vec2v=function(one,value){
		if (value.length < 2){
			var uploadedValue=one.uploadedValue;
			if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2] || uploadedValue[3]!==value[3]){
				WebGL.mainContext.uniform2fv(one.location,value);
				uploadedValue[0]=value[0];
				uploadedValue[1]=value[1];
				uploadedValue[2]=value[2];
				uploadedValue[3]=value[3];
				return 1;
			}
			return 0;
			}else {
			WebGL.mainContext.uniform2fv(one.location,value);
			return 1;
		}
	}

	//TODO:coverage
	__proto._uniform_vec3=function(one,value){
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2]){
			WebGL.mainContext.uniform3f(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1],uploadedValue[2]=value[2]);
			return 1;
		}
		return 0;
	}

	//TODO:coverage
	__proto._uniform_vec3v=function(one,value){
		WebGL.mainContext.uniform3fv(one.location,value);
		return 1;
	}

	__proto._uniform_vec4=function(one,value){
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2] || uploadedValue[3]!==value[3]){
			WebGL.mainContext.uniform4f(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1],uploadedValue[2]=value[2],uploadedValue[3]=value[3]);
			return 1;
		}
		return 0;
	}

	//TODO:coverage
	__proto._uniform_vec4v=function(one,value){
		WebGL.mainContext.uniform4fv(one.location,value);
		return 1;
	}

	//TODO:coverage
	__proto._uniformMatrix2fv=function(one,value){
		WebGL.mainContext.uniformMatrix2fv(one.location,false,value);
		return 1;
	}

	//TODO:coverage
	__proto._uniformMatrix3fv=function(one,value){
		WebGL.mainContext.uniformMatrix3fv(one.location,false,value);
		return 1;
	}

	__proto._uniformMatrix4fv=function(one,value){
		WebGL.mainContext.uniformMatrix4fv(one.location,false,value);
		return 1;
	}

	//TODO:coverage
	__proto._uniform1i=function(one,value){
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value){
			WebGL.mainContext.uniform1i(one.location,uploadedValue[0]=value);
			return 1;
		}
		return 0;
	}

	//TODO:coverage
	__proto._uniform1iv=function(one,value){
		WebGL.mainContext.uniform1iv(one.location,value);
		return 1;
	}

	//TODO:coverage
	__proto._uniform_ivec2=function(one,value){
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1]){
			WebGL.mainContext.uniform2i(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1]);
			return 1;
		}
		return 0;
	}

	//TODO:coverage
	__proto._uniform_ivec2v=function(one,value){
		WebGL.mainContext.uniform2iv(one.location,value);
		return 1;
	}

	//TODO:coverage
	__proto._uniform_vec3i=function(one,value){
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2]){
			WebGL.mainContext.uniform3i(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1],uploadedValue[2]=value[2]);
			return 1;
		}
		return 0;
	}

	__proto._uniform_vec3vi=function(one,value){
		WebGL.mainContext.uniform3iv(one.location,value);
		return 1;
	}

	//TODO:coverage
	__proto._uniform_vec4i=function(one,value){
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]!==value[0] || uploadedValue[1]!==value[1] || uploadedValue[2]!==value[2] || uploadedValue[3]!==value[3]){
			WebGL.mainContext.uniform4i(one.location,uploadedValue[0]=value[0],uploadedValue[1]=value[1],uploadedValue[2]=value[2],uploadedValue[3]=value[3]);
			return 1;
		}
		return 0;
	}

	//TODO:coverage
	__proto._uniform_vec4vi=function(one,value){
		WebGL.mainContext.uniform4iv(one.location,value);
		return 1;
	}

	__proto._uniform_sampler2D=function(one,value){
		var gl=WebGL.mainContext;
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]==null){
			uploadedValue[0]=this._curActTexIndex;
			gl.uniform1i(one.location,this._curActTexIndex);
			WebGLContext.activeTexture(gl,/*laya.webgl.WebGLContext.TEXTURE0*/0x84C0+this._curActTexIndex);
			WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,value);
			this._curActTexIndex++;
			return 1;
			}else {
			WebGLContext.activeTexture(gl,/*laya.webgl.WebGLContext.TEXTURE0*/0x84C0+uploadedValue[0]);
			WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,value);
			return 0;
		}
	}

	//TODO:coverage
	__proto._uniform_samplerCube=function(one,value){
		var gl=WebGL.mainContext;
		var uploadedValue=one.uploadedValue;
		if (uploadedValue[0]==null){
			uploadedValue[0]=this._curActTexIndex;
			gl.uniform1i(one.location,this._curActTexIndex);
			WebGLContext.activeTexture(gl,/*laya.webgl.WebGLContext.TEXTURE0*/0x84C0+this._curActTexIndex);
			WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP*/0x8513,value);
			this._curActTexIndex++;
			return 1;
			}else {
			WebGLContext.activeTexture(gl,/*laya.webgl.WebGLContext.TEXTURE0*/0x84C0+uploadedValue[0]);
			WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_CUBE_MAP*/0x8513,value);
			return 0;
		}
	}

	//TODO:coverage
	__proto._noSetValue=function(one){
		console.log("no....:"+one.name);
	}

	//TODO:coverage
	__proto.uploadOne=function(name,value){
		WebGLContext.useProgram(WebGL.mainContext,this._program);
		var one=this._paramsMap[name];
		one.fun.call(this,one,value);
	}

	__proto.uploadTexture2D=function(value){
		var CTX=WebGLContext;
		if(CTX._activeTextures[0]!==value){
			CTX.bindTexture(WebGL.mainContext,CTX.TEXTURE_2D,value);
			CTX._activeTextures[0]=value;
		}
	}

	/**
	*提交shader到GPU
	*@param shaderValue
	*/
	__proto.upload=function(shaderValue,params){
		BaseShader.activeShader=BaseShader.bindShader=this;
		var gl=WebGL.mainContext;
		WebGLContext.useProgram(gl,this._program);
		if (this._reCompile){
			params=this._params;
			this._reCompile=false;
			}else {
			params=params || this._params;
		};
		var one,value,n=params.length,shaderCall=0;
		for (var i=0;i < n;i++){
			one=params[i];
			if ((value=shaderValue[one.name])!==null)
				shaderCall+=one.fun.call(this,one,value);
		}
		Stat.shaderCall+=shaderCall;
	}

	//TODO:coverage
	__proto.uploadArray=function(shaderValue,length,_bufferUsage){
		BaseShader.activeShader=this;
		BaseShader.bindShader=this;
		WebGLContext.useProgram(WebGL.mainContext,this._program);
		var params=this._params,value;
		var one,shaderCall=0;
		for (var i=length-2;i >=0;i-=2){
			one=this._paramsMap[shaderValue[i]];
			if (!one)
				continue ;
			value=shaderValue[i+1];
			if (value !=null){
				_bufferUsage && _bufferUsage[one.name] && _bufferUsage[one.name].bind();
				shaderCall+=one.fun.call(this,one,value);
			}
		}
		Stat.shaderCall+=shaderCall;
	}

	//TODO:coverage
	__proto.getParams=function(){
		return this._params;
	}

	//TODO:coverage
	__proto.setAttributesLocation=function(attribDesc){
		this._attribInfo=attribDesc;
	}

	Shader.getShader=function(name){
		return Shader.sharders[name];
	}

	Shader.create=function(vs,ps,saveName,nameMap,bindAttrib){
		return new Shader(vs,ps,saveName,nameMap,bindAttrib);
	}

	Shader.withCompile=function(nameID,define,shaderName,createShader){
		if (shaderName && Shader.sharders[shaderName])
			return Shader.sharders[shaderName];
		var pre=Shader._preCompileShader[0.0002 *nameID];
		if (!pre)
			throw new Error("withCompile shader err!"+nameID);
		return pre.createShader(define,shaderName,createShader,null);
	}

	Shader.withCompile2D=function(nameID,mainID,define,shaderName,createShader,bindAttrib){
		if (shaderName && Shader.sharders[shaderName])
			return Shader.sharders[shaderName];
		var pre=Shader._preCompileShader[0.0002 *nameID+mainID];
		if (!pre)
			throw new Error("withCompile shader err!"+nameID+" "+mainID);
		return pre.createShader(define,shaderName,createShader,bindAttrib);
	}

	Shader.addInclude=function(fileName,txt){
		ShaderCompile.addInclude(fileName,txt);
	}

	Shader.preCompile=function(nameID,vs,ps,nameMap){
		var id=0.0002 *nameID;
		Shader._preCompileShader[id]=new ShaderCompile(vs,ps,nameMap);
	}

	Shader.preCompile2D=function(nameID,mainID,vs,ps,nameMap){
		var id=0.0002 *nameID+mainID;
		Shader._preCompileShader[id]=new ShaderCompile(vs,ps,nameMap);
	}

	Shader._createShader=function(gl,str,type){
		var shader=gl.createShader(type);
		gl.shaderSource(shader,str);
		gl.compileShader(shader);
		if(gl.getShaderParameter(shader,/*laya.webgl.WebGLContext.COMPILE_STATUS*/0x8B81)){
			return shader;
			}else{
			console.log(gl.getShaderInfoLog(shader));
			return null;
		}
	}

	Shader._count=0;
	Shader._preCompileShader={};
	Shader.SHADERNAME2ID=0.0002;
	Shader.sharders=new Array(0x20);
	__static(Shader,
	['nameKey',function(){return this.nameKey=new StringKey();}
	]);
	return Shader;
})(BaseShader)


/**
*<code>RenderTexture</code> 类用于创建渲染目标。
*/

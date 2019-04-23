/**
*<code>Shader3D</code> 类用于创建Shader3D。
*/
//class laya.d3.shader.Shader3D
var Shader3D=(function(){
	function Shader3D(name){
		/**@private */
		//this._name=null;
		this._subShaders=[];
		this._name=name;
	}

	__class(Shader3D,'laya.d3.shader.Shader3D');
	var __proto=Shader3D.prototype;
	/**
	*添加子着色器。
	*@param 子着色器。
	*/
	__proto.addSubShader=function(subShader){
		this._subShaders.push(subShader);
		subShader._owner=this;
	}

	/**
	*在特定索引获取子着色器。
	*@param index 索引。
	*@return 子着色器。
	*/
	__proto.getSubShaderAt=function(index){
		return this._subShaders[index];
	}

	Shader3D.propertyNameToID=function(name){
		if (Shader3D._propertyNameMap[name]!=null){
			return Shader3D._propertyNameMap[name];
			}else {
			var id=Shader3D._propertyNameCounter++;
			Shader3D._propertyNameMap[name]=id;
			return id;
		}
	}

	Shader3D.addInclude=function(fileName,txt){
		ShaderCompile.addInclude(fileName,txt);
	}

	Shader3D.registerPublicDefine=function(name){
		var value=Math.pow(2,Shader3D._publicCounter++);
		Shader3D._globleDefines[value]=name;
		return value;
	}

	Shader3D.compileShader=function(name,subShaderIndex,passIndex,publicDefine,spriteDefine,materialDefine){
		var shader=laya.d3.shader.Shader3D.find(name);
		if (shader){
			var subShader=shader.getSubShaderAt(subShaderIndex);
			if (subShader){
				var pass=subShader._passes[passIndex];
				if (pass){
					if (WebGL.shaderHighPrecision)
						pass.withCompile(publicDefine,spriteDefine,materialDefine);
					else
					pass.withCompile(publicDefine-laya.d3.shader.Shader3D.SHADERDEFINE_HIGHPRECISION,spriteDefine,materialDefine);
					}else {
					console.warn("Shader3D: unknown passIndex.");
				}
				}else {
				console.warn("Shader3D: unknown subShaderIndex.");
			}
			}else {
			console.warn("Shader3D: unknown shader name.");
		}
	}

	Shader3D.add=function(name){
		return laya.d3.shader.Shader3D._preCompileShader[name]=new Shader3D(name);
	}

	Shader3D.find=function(name){
		return laya.d3.shader.Shader3D._preCompileShader[name];
	}

	Shader3D.PERIOD_CUSTOM=0;
	Shader3D.PERIOD_MATERIAL=1;
	Shader3D.PERIOD_SPRITE=2;
	Shader3D.PERIOD_CAMERA=3;
	Shader3D.PERIOD_SCENE=4;
	Shader3D.SHADERDEFINE_HIGHPRECISION=0;
	Shader3D._propertyNameCounter=0;
	Shader3D._propertyNameMap={};
	Shader3D._publicCounter=0;
	Shader3D._globleDefines=[];
	Shader3D._preCompileShader={};
	Shader3D.debugMode=false;
	return Shader3D;
})()


/**

*/
/**
*<code>BaseMaterial</code> 类用于创建材质,抽象类,不允许实例。
*/
//class laya.d3.core.material.BaseMaterial extends laya.resource.Resource
var BaseMaterial=(function(_super){
	function BaseMaterial(){
		/**@private */
		//this._alphaTest=false;
		/**@private */
		//this._renderStates=null;
		/**@private */
		//this._defineDatas=null;
		/**@private */
		//this._disablePublicDefineDatas=null;
		/**@private */
		//this._shader=null;
		/**@private */
		//this._shaderValues=null;
		/**所属渲染队列. */
		//this.renderQueue=0;
		BaseMaterial.__super.call(this);
		this._defineDatas=new DefineDatas();
		this._disablePublicDefineDatas=new DefineDatas();
		this._shaderValues=new ShaderData(this);
		this.renderQueue=/*CLASS CONST:laya.d3.core.material.BaseMaterial.RENDERQUEUE_OPAQUE*/2000;
		this._alphaTest=false;
		this._renderStates=[];
	}

	__class(BaseMaterial,'laya.d3.core.material.BaseMaterial',_super);
	var __proto=BaseMaterial.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*@private
	*/
	__proto._removeTetxureReference=function(){
		var data=this._shaderValues._data;
		for (var k in data){
			var value=data[k];
			if (value && (value instanceof laya.webgl.resource.BaseTexture ))
				(value)._removeReference();
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._addReference=function(count){
		(count===void 0)&& (count=1);
		_super.prototype._addReference.call(this,count);
		var data=this._shaderValues._data;
		for (var k in data){
			var value=data[k];
			if (value && (value instanceof laya.webgl.resource.BaseTexture ))
				(value)._addReference();
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._removeReference=function(count){
		(count===void 0)&& (count=1);
		_super.prototype._removeReference.call(this,count);
		this._removeTetxureReference();
	}

	/**
	*@inheritDoc
	*/
	__proto._disposeResource=function(){
		if (this._referenceCount > 0)
			this._removeTetxureReference();
		this._shaderValues=null;
	}

	/**
	*设置使用Shader名字。
	*@param name 名称。
	*/
	__proto.setShaderName=function(name){
		this._shader=Shader3D._preCompileShader[name];
		if (!this._shader)
			throw new Error("BaseMaterial: unknown shader name.");
		var passCount=this._shader.getSubShaderAt(0)._passes.length;
		this._renderStates.length=passCount;
		for (var i=0;i < passCount;i++)
		(this._renderStates[i])|| (this._renderStates[i]=new RenderState());
	}

	/**
	*获取渲染状态。
	*@param passIndex 所关联Shader的pass索引。
	*/
	__proto.getRenderState=function(passIndex){
		(passIndex===void 0)&& (passIndex=0);
		return this._renderStates[passIndex];
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destBaseMaterial=destObject;
		destBaseMaterial.name=this.name;
		destBaseMaterial.renderQueue=this.renderQueue;
		this._disablePublicDefineDatas.cloneTo(destBaseMaterial._disablePublicDefineDatas);
		this._defineDatas.cloneTo(destBaseMaterial._defineDatas);
		this._shaderValues.cloneTo(destBaseMaterial._shaderValues);
		var destRenderStates=destObject._renderStates;
		for (var i=0,n=this._renderStates.length;i < n;i++)
		this._renderStates[i].cloneTo(destRenderStates[i]);
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var dest=/*__JS__ */new this.constructor();
		this.cloneTo(dest);
		return dest;
	}

	/**
	*设置透明测试模式裁剪值。
	*@param value 透明测试模式裁剪值。
	*/
	/**
	*获取透明测试模式裁剪值。
	*@return 透明测试模式裁剪值。
	*/
	__getset(0,__proto,'alphaTestValue',function(){
		return this._shaderValues.getNumber(BaseMaterial.ALPHATESTVALUE);
		},function(value){
		this._shaderValues.setNumber(BaseMaterial.ALPHATESTVALUE,value);
	});

	/**
	*设置是否透明裁剪。
	*@param value 是否透明裁剪。
	*/
	/**
	*获取是否透明裁剪。
	*@return 是否透明裁剪。
	*/
	__getset(0,__proto,'alphaTest',function(){
		return this._alphaTest;
		},function(value){
		this._alphaTest=value;
		if (value)
			this._defineDatas.add(laya.d3.core.material.BaseMaterial.SHADERDEFINE_ALPHATEST);
		else
		this._defineDatas.remove(laya.d3.core.material.BaseMaterial.SHADERDEFINE_ALPHATEST);
	});

	BaseMaterial.load=function(url,complete){
		Laya.loader.create(url,complete,null,/*Laya3D.MATERIAL*/"MATERIAL");
	}

	BaseMaterial.__init__=function(){
		BaseMaterial.SHADERDEFINE_ALPHATEST=BaseMaterial.shaderDefines.registerDefine("ALPHATEST");
	}

	BaseMaterial._parse=function(data,propertyParams,constructParams){
		var jsonData=data;
		var props=jsonData.props;
		var material;
		var classType=props.type;
		var clasPaths=classType.split('.');
		var clas=Browser.window;
		clasPaths.forEach(function(cls){
			clas=clas[cls];
		});
		if (typeof(clas)=='function')
			material=new clas();
		else
		throw('_getSprite3DHierarchyInnerUrls 错误: '+data.type+' 不是类');
		switch (jsonData.version){
			case "LAYAMATERIAL:01":
				props=jsonData.props;
				for (key in props){
				switch (key){
					case "vectors":
						vectors=props[key];
						for (i=0,n=vectors.length;i < n;i++){
							vector=vectors[i];
							vectorValue=vector.value;
						switch (vectorValue.length){
							case 2:
								material[vector.name]=new Vector2(vectorValue[0],vectorValue[1]);
								break ;
							case 3:
								material[vector.name]=new Vector3(vectorValue[0],vectorValue[1],vectorValue[2]);
								break ;
							case 4:
								material[vector.name]=new Vector4(vectorValue[0],vectorValue[1],vectorValue[2],vectorValue[3]);
								break ;
							default :
								throw new Error("BaseMaterial:unkonwn color length.");
							}
					}
					break ;
					case "textures":
					textures=props[key];
					for (i=0,n=textures.length;i < n;i++){
						texture=textures[i];
						path=texture.path;
						(path)&& (material[texture.name]=Loader.getRes(path));
					}
					break ;
					case "defines":
					defineNames=props[key];
					for (i=0,n=defineNames.length;i < n;i++){
						define=material._shader.getSubShaderAt(0).getMaterialDefineByName(defineNames[i]);
						material._defineDatas.add(define);
					}
					break ;
					case "cull":
					case "blend":
					case "srcBlend":
					case "dstBlend":
					case "depthWrite":;
					var value=props[key];
					for (i=0,n=material._renderStates.length;i < n;i++)
					material._renderStates[i][key]=value;
					break ;
					case "renderQueue":;
					var queue=props[key];
					switch (queue){
						case 1:
							material.renderQueue=2000;
							break ;
						case 2:
							material.renderQueue=3000;
							break ;
						default :
							material[key]=props[key];
						}
					break ;
					default :
					material[key]=props[key];
				}
			}
			break ;
			case "LAYAMATERIAL:02":;
			var i=0,n=0;
			for (var key in props){
				switch (key){
					case "vectors":;
						var vectors=props[key];
						for (i=0,n=vectors.length;i < n;i++){
							var vector=vectors[i];
							var vectorValue=vector.value;
						switch (vectorValue.length){
							case 2:
								material[vector.name]=new Vector2(vectorValue[0],vectorValue[1]);
								break ;
							case 3:
								material[vector.name]=new Vector3(vectorValue[0],vectorValue[1],vectorValue[2]);
								break ;
							case 4:
								material[vector.name]=new Vector4(vectorValue[0],vectorValue[1],vectorValue[2],vectorValue[3]);
								break ;
							default :
								throw new Error("BaseMaterial:unkonwn color length.");
							}
					}
					break ;
					case "textures":;
					var textures=props[key];
					for (i=0,n=textures.length;i < n;i++){
						var texture=textures[i];
						var path=texture.path;
						(path)&& (material[texture.name]=Loader.getRes(path));
					}
					break ;
					case "defines":;
					var defineNames=props[key];
					for (i=0,n=defineNames.length;i < n;i++){
						var define=material._shader.getSubShaderAt(0).getMaterialDefineByName(defineNames[i]);
						material._defineDatas.add(define);
					}
					break ;
					case "renderStates":;
					var renderStatesData=props[key];
					for (i=0,n=renderStatesData.length;i < n;i++){
						var renderStateData=renderStatesData[i];
						var renderState=material._renderStates[i];
						for (var stateKey in renderStateData)
						renderState[stateKey]=renderStateData[stateKey];
					}
					break ;
					default :
					material[key]=props[key];
				}
			}
			break ;
			default :
			throw new Error("BaseMaterial:unkonwn version.");
		}
		return material;
	}

	BaseMaterial.RENDERQUEUE_OPAQUE=2000;
	BaseMaterial.RENDERQUEUE_ALPHATEST=2450;
	BaseMaterial.RENDERQUEUE_TRANSPARENT=3000;
	BaseMaterial.SHADERDEFINE_ALPHATEST=0;
	__static(BaseMaterial,
	['ALPHATESTVALUE',function(){return this.ALPHATESTVALUE=Shader3D.propertyNameToID("u_AlphaTestValue");},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines();}
	]);
	return BaseMaterial;
})(Resource)


/**

*/
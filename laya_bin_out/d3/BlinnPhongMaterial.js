/**
*<code>BlinnPhongMaterial</code> 类用于实现Blinn-Phong材质。
*/
//class laya.d3.core.material.BlinnPhongMaterial extends laya.d3.core.material.BaseMaterial
var BlinnPhongMaterial=(function(_super){
	function BlinnPhongMaterial(){
		/**@private */
		//this._albedoColor=null;
		/**@private */
		//this._albedoIntensity=NaN;
		/**@private */
		//this._enableLighting=false;
		/**@private */
		this._enableVertexColor=false;
		BlinnPhongMaterial.__super.call(this);
		this.setShaderName("BLINNPHONG");
		this._albedoIntensity=1.0;
		this._albedoColor=new Vector4(1.0,1.0,1.0,1.0);
		var sv=this._shaderValues;
		sv.setVector(BlinnPhongMaterial.ALBEDOCOLOR,new Vector4(1.0,1.0,1.0,1.0));
		sv.setVector(BlinnPhongMaterial.MATERIALSPECULAR,new Vector4(1.0,1.0,1.0,1.0));
		sv.setNumber(BlinnPhongMaterial.SHININESS,0.078125);
		sv.setNumber(BaseMaterial.ALPHATESTVALUE,0.5);
		sv.setVector(BlinnPhongMaterial.TILINGOFFSET,new Vector4(1.0,1.0,0.0,0.0));
		this._enableLighting=true;
		this.renderMode=0;
	}

	__class(BlinnPhongMaterial,'laya.d3.core.material.BlinnPhongMaterial',_super);
	var __proto=BlinnPhongMaterial.prototype;
	/**
	*禁用雾化。
	*/
	__proto.disableFog=function(){
		this._disablePublicDefineDatas.add(Scene3D.SHADERDEFINE_FOG);
	}

	/**
	*@inheritDoc
	*/
	__proto.cloneTo=function(destObject){
		_super.prototype.cloneTo.call(this,destObject);
		var destMaterial=destObject;
		destMaterial._enableLighting=this._enableLighting;
		destMaterial._albedoIntensity=this._albedoIntensity;
		this._albedoColor.cloneTo(destMaterial._albedoColor);
	}

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_SpecColorG',function(){
		return this._shaderValues.getVector(BlinnPhongMaterial.MATERIALSPECULAR).elements[1];
		},function(value){
		this._shaderValues.getVector(BlinnPhongMaterial.MATERIALSPECULAR).elements[1]=value;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_ColorB',function(){
		return this._albedoColor.elements[2];
		},function(value){
		this._albedoColor.elements[2]=value;
		this.albedoColor=this._albedoColor;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_ColorR',function(){
		return this._albedoColor.elements[0];
		},function(value){
		this._albedoColor.elements[0]=value;
		this.albedoColor=this._albedoColor;
	});

	/**
	*设置反照率颜色alpha分量。
	*@param value 反照率颜色alpha分量。
	*/
	/**
	*获取反照率颜色Z分量。
	*@return 反照率颜色Z分量。
	*/
	__getset(0,__proto,'albedoColorA',function(){
		return this._ColorA;
		},function(value){
		this._ColorA=value;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STX',function(){
		return this._shaderValues.getVector(BlinnPhongMaterial.TILINGOFFSET).elements[0];
		},function(x){
		var tilOff=this._shaderValues.getVector(BlinnPhongMaterial.TILINGOFFSET);
		tilOff.elements[0]=x;
		this.tilingOffset=tilOff;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_SpecColorB',function(){
		return this._shaderValues.getVector(BlinnPhongMaterial.MATERIALSPECULAR).elements[2];
		},function(value){
		this._shaderValues.getVector(BlinnPhongMaterial.MATERIALSPECULAR).elements[2]=value;
	});

	/**
	*设置渲染模式。
	*@return 渲染模式。
	*/
	__getset(0,__proto,'renderMode',null,function(value){
		var renderState=this.getRenderState();
		switch (value){
			case 0:
				this.alphaTest=false;
				this.renderQueue=/*laya.d3.core.material.BaseMaterial.RENDERQUEUE_OPAQUE*/2000;
				renderState.depthWrite=true;
				renderState.cull=/*laya.d3.core.material.RenderState.CULL_BACK*/2;
				renderState.blend=/*laya.d3.core.material.RenderState.BLEND_DISABLE*/0;
				renderState.depthTest=/*laya.d3.core.material.RenderState.DEPTHTEST_LESS*/0x0201;
				break ;
			case 1:
				this.renderQueue=/*laya.d3.core.material.BaseMaterial.RENDERQUEUE_ALPHATEST*/2450;
				this.alphaTest=true;
				renderState.depthWrite=true;
				renderState.cull=/*laya.d3.core.material.RenderState.CULL_BACK*/2;
				renderState.blend=/*laya.d3.core.material.RenderState.BLEND_DISABLE*/0;
				renderState.depthTest=/*laya.d3.core.material.RenderState.DEPTHTEST_LESS*/0x0201;
				break ;
			case 2:
				this.renderQueue=/*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
				this.alphaTest=false;
				renderState.depthWrite=false;
				renderState.cull=/*laya.d3.core.material.RenderState.CULL_BACK*/2;
				renderState.blend=/*laya.d3.core.material.RenderState.BLEND_ENABLE_ALL*/1;
				renderState.srcBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_SRC_ALPHA*/0x0302;
				renderState.dstBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA*/0x0303;
				renderState.depthTest=/*laya.d3.core.material.RenderState.DEPTHTEST_LESS*/0x0201;
				break ;
			default :
				throw new Error("Material:renderMode value error.");
			}
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_SpecColorR',function(){
		return this._shaderValues.getVector(BlinnPhongMaterial.MATERIALSPECULAR).elements[0];
		},function(value){
		this._shaderValues.getVector(BlinnPhongMaterial.MATERIALSPECULAR).elements[0]=value;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_ColorG',function(){
		return this._albedoColor.elements[1];
		},function(value){
		this._albedoColor.elements[1]=value;
		this.albedoColor=this._albedoColor;
	});

	/**
	*@private
	*/
	/**@private */
	__getset(0,__proto,'_ColorA',function(){
		return this._albedoColor.elements[3];
		},function(value){
		this._albedoColor.elements[3]=value;
		this.albedoColor=this._albedoColor;
	});

	/**
	*设置高光颜色。
	*@param value 高光颜色。
	*/
	/**
	*获取高光颜色。
	*@return 高光颜色。
	*/
	__getset(0,__proto,'specularColor',function(){
		return this._shaderValues.getVector(BlinnPhongMaterial.MATERIALSPECULAR);
		},function(value){
		this._shaderValues.setVector(BlinnPhongMaterial.MATERIALSPECULAR,value);
	});

	/**
	*设置反照率颜色B分量。
	*@param value 反照率颜色B分量。
	*/
	/**
	*获取反照率颜色B分量。
	*@return 反照率颜色B分量。
	*/
	__getset(0,__proto,'albedoColorB',function(){
		return this._ColorB;
		},function(value){
		this._ColorB=value;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_SpecColorA',function(){
		return this._shaderValues.getVector(BlinnPhongMaterial.MATERIALSPECULAR).elements[3];
		},function(value){
		this._shaderValues.getVector(BlinnPhongMaterial.MATERIALSPECULAR).elements[3]=value;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STZ',function(){
		return this._shaderValues.getVector(BlinnPhongMaterial.TILINGOFFSET).elements[2];
		},function(z){
		var tilOff=this._shaderValues.getVector(BlinnPhongMaterial.TILINGOFFSET);
		tilOff.elements[2]=z;
		this.tilingOffset=tilOff;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_AlbedoIntensity',function(){
		return this._albedoIntensity;
		},function(value){
		if (this._albedoIntensity!==value){
			var finalAlbedo=this._shaderValues.getVector(BlinnPhongMaterial.ALBEDOCOLOR);
			Vector4.scale(this._albedoColor,value,finalAlbedo);
			this._albedoIntensity=value;
			this._shaderValues.setVector(BlinnPhongMaterial.ALBEDOCOLOR,finalAlbedo);
		}
	});

	/**
	*设置高光颜色A分量。
	*@param value 高光颜色A分量。
	*/
	/**
	*获取高光颜色A分量。
	*@return 高光颜色A分量。
	*/
	__getset(0,__proto,'specularColorA',function(){
		return this._SpecColorA;
		},function(value){
		this._SpecColorA=value;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_Shininess',function(){
		return this._shaderValues.getNumber(BlinnPhongMaterial.SHININESS);
		},function(value){
		value=Math.max(0.0,Math.min(1.0,value));
		this._shaderValues.setNumber(BlinnPhongMaterial.SHININESS,value);
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STY',function(){
		return this._shaderValues.getVector(BlinnPhongMaterial.TILINGOFFSET).elements[1];
		},function(y){
		var tilOff=this._shaderValues.getVector(BlinnPhongMaterial.TILINGOFFSET);
		tilOff.elements[1]=y;
		this.tilingOffset=tilOff;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_Cutoff',function(){
		return this.alphaTestValue;
		},function(value){
		this.alphaTestValue=value;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STW',function(){
		return this._shaderValues.getVector(BlinnPhongMaterial.TILINGOFFSET).elements[3];
		},function(w){
		var tilOff=this._shaderValues.getVector(BlinnPhongMaterial.TILINGOFFSET);
		tilOff.elements[3]=w;
		this.tilingOffset=tilOff;
	});

	/**
	*设置反照率贴图。
	*@param value 反照率贴图。
	*/
	/**
	*获取反照率贴图。
	*@return 反照率贴图。
	*/
	__getset(0,__proto,'albedoTexture',function(){
		return this._shaderValues.getTexture(BlinnPhongMaterial.ALBEDOTEXTURE);
		},function(value){
		if (value)
			this._defineDatas.add(laya.d3.core.material.BlinnPhongMaterial.SHADERDEFINE_DIFFUSEMAP);
		else
		this._defineDatas.remove(laya.d3.core.material.BlinnPhongMaterial.SHADERDEFINE_DIFFUSEMAP);
		this._shaderValues.setTexture(BlinnPhongMaterial.ALBEDOTEXTURE,value);
	});

	/**
	*设置是否支持顶点色。
	*@param value 是否支持顶点色。
	*/
	/**
	*获取是否支持顶点色。
	*@return 是否支持顶点色。
	*/
	__getset(0,__proto,'enableVertexColor',function(){
		return this._enableVertexColor;
		},function(value){
		this._enableVertexColor=value;
		if (value)
			this._defineDatas.add(laya.d3.core.material.BlinnPhongMaterial.SHADERDEFINE_ENABLEVERTEXCOLOR);
		else
		this._defineDatas.remove(laya.d3.core.material.BlinnPhongMaterial.SHADERDEFINE_ENABLEVERTEXCOLOR);
	});

	/**
	*设置反照率颜色。
	*@param value 反照率颜色。
	*/
	/**
	*获取反照率颜色。
	*@return 反照率颜色。
	*/
	__getset(0,__proto,'albedoColor',function(){
		return this._albedoColor;
		},function(value){
		var finalAlbedo=this._shaderValues.getVector(BlinnPhongMaterial.ALBEDOCOLOR);
		Vector4.scale(value,this._albedoIntensity,finalAlbedo);
		this._albedoColor=value;
		this._shaderValues.setVector(BlinnPhongMaterial.ALBEDOCOLOR,finalAlbedo);
	});

	/**
	*获取纹理平铺和偏移X分量。
	*@param x 纹理平铺和偏移X分量。
	*/
	/**
	*获取纹理平铺和偏移X分量。
	*@return 纹理平铺和偏移X分量。
	*/
	__getset(0,__proto,'tilingOffsetX',function(){
		return this._MainTex_STX;
		},function(x){
		this._MainTex_STX=x;
	});

	/**
	*获取纹理平铺和偏移Y分量。
	*@param y 纹理平铺和偏移Y分量。
	*/
	/**
	*获取纹理平铺和偏移Y分量。
	*@return 纹理平铺和偏移Y分量。
	*/
	__getset(0,__proto,'tilingOffsetY',function(){
		return this._MainTex_STY;
		},function(y){
		this._MainTex_STY=y;
	});

	/**
	*获取纹理平铺和偏移Z分量。
	*@param z 纹理平铺和偏移Z分量。
	*/
	/**
	*获取纹理平铺和偏移Z分量。
	*@return 纹理平铺和偏移Z分量。
	*/
	__getset(0,__proto,'tilingOffsetZ',function(){
		return this._MainTex_STZ;
		},function(z){
		this._MainTex_STZ=z;
	});

	/**
	*设置是否启用光照。
	*@param value 是否启用光照。
	*/
	/**
	*获取是否启用光照。
	*@return 是否启用光照。
	*/
	__getset(0,__proto,'enableLighting',function(){
		return this._enableLighting;
		},function(value){
		if (this._enableLighting!==value){
			if (value)
				this._disablePublicDefineDatas.remove(Scene3D.SHADERDEFINE_POINTLIGHT | Scene3D.SHADERDEFINE_SPOTLIGHT | Scene3D.SHADERDEFINE_DIRECTIONLIGHT);
			else
			this._disablePublicDefineDatas.add(Scene3D.SHADERDEFINE_POINTLIGHT | Scene3D.SHADERDEFINE_SPOTLIGHT | Scene3D.SHADERDEFINE_DIRECTIONLIGHT);
			this._enableLighting=value;
		}
	});

	/**
	*获取纹理平铺和偏移W分量。
	*@param w 纹理平铺和偏移W分量。
	*/
	/**
	*获取纹理平铺和偏移W分量。
	*@return 纹理平铺和偏移W分量。
	*/
	__getset(0,__proto,'tilingOffsetW',function(){
		return this._MainTex_STW;
		},function(w){
		this._MainTex_STW=w;
	});

	/**
	*获取纹理平铺和偏移。
	*@param value 纹理平铺和偏移。
	*/
	/**
	*获取纹理平铺和偏移。
	*@return 纹理平铺和偏移。
	*/
	__getset(0,__proto,'tilingOffset',function(){
		return this._shaderValues.getVector(BlinnPhongMaterial.TILINGOFFSET);
		},function(value){
		if (value){
			var valueE=value.elements;
			if (valueE[0] !=1 || valueE[1] !=1 || valueE[2] !=0 || valueE[3] !=0)
				this._defineDatas.add(laya.d3.core.material.BlinnPhongMaterial.SHADERDEFINE_TILINGOFFSET);
			else
			this._defineDatas.remove(laya.d3.core.material.BlinnPhongMaterial.SHADERDEFINE_TILINGOFFSET);
			}else {
			this._defineDatas.remove(laya.d3.core.material.BlinnPhongMaterial.SHADERDEFINE_TILINGOFFSET);
		}
		this._shaderValues.setVector(BlinnPhongMaterial.TILINGOFFSET,value);
	});

	/**
	*设置反照率颜色R分量。
	*@param value 反照率颜色R分量。
	*/
	/**
	*获取反照率颜色R分量。
	*@return 反照率颜色R分量。
	*/
	__getset(0,__proto,'albedoColorR',function(){
		return this._ColorR;
		},function(value){
		this._ColorR=value;
	});

	/**
	*设置反照率颜色G分量。
	*@param value 反照率颜色G分量。
	*/
	/**
	*获取反照率颜色G分量。
	*@return 反照率颜色G分量。
	*/
	__getset(0,__proto,'albedoColorG',function(){
		return this._ColorG;
		},function(value){
		this._ColorG=value;
	});

	/**
	*设置反照率强度。
	*@param value 反照率强度。
	*/
	/**
	*获取反照率强度。
	*@return 反照率强度。
	*/
	__getset(0,__proto,'albedoIntensity',function(){
		return this._albedoIntensity;
		},function(value){
		this._AlbedoIntensity=value;
	});

	/**
	*设置高光颜色R分量。
	*@param value 高光颜色R分量。
	*/
	/**
	*获取高光颜色R轴分量。
	*@return 高光颜色R轴分量。
	*/
	__getset(0,__proto,'specularColorR',function(){
		return this._SpecColorR;
		},function(value){
		this._SpecColorR=value;
	});

	/**
	*设置高光颜色G分量。
	*@param value 高光颜色G分量。
	*/
	/**
	*获取高光颜色G分量。
	*@return 高光颜色G分量。
	*/
	__getset(0,__proto,'specularColorG',function(){
		return this._SpecColorG;
		},function(value){
		this._SpecColorG=value;
	});

	/**
	*设置高光颜色B分量。
	*@param value 高光颜色B分量。
	*/
	/**
	*获取高光颜色B分量。
	*@return 高光颜色B分量。
	*/
	__getset(0,__proto,'specularColorB',function(){
		return this._SpecColorB;
		},function(value){
		this._SpecColorB=value;
	});

	/**
	*设置高光强度,范围为0到1。
	*@param value 高光强度。
	*/
	/**
	*获取高光强度,范围为0到1。
	*@return 高光强度。
	*/
	__getset(0,__proto,'shininess',function(){
		return this._Shininess;
		},function(value){
		this._Shininess=value;
	});

	/**
	*设置法线贴图。
	*@param value 法线贴图。
	*/
	/**
	*获取法线贴图。
	*@return 法线贴图。
	*/
	__getset(0,__proto,'normalTexture',function(){
		return this._shaderValues.getTexture(BlinnPhongMaterial.NORMALTEXTURE);
		},function(value){
		if (value)
			this._defineDatas.add(laya.d3.core.material.BlinnPhongMaterial.SHADERDEFINE_NORMALMAP);
		else
		this._defineDatas.remove(laya.d3.core.material.BlinnPhongMaterial.SHADERDEFINE_NORMALMAP);
		this._shaderValues.setTexture(BlinnPhongMaterial.NORMALTEXTURE,value);
	});

	/**
	*设置高光贴图，高光强度则从该贴图RGB值中获取,如果该值为空则从漫反射贴图的Alpha通道获取。
	*@param value 高光贴图。
	*/
	/**
	*获取高光贴图。
	*@return 高光贴图。
	*/
	__getset(0,__proto,'specularTexture',function(){
		return this._shaderValues.getTexture(BlinnPhongMaterial.SPECULARTEXTURE);
		},function(value){
		if (value)
			this._defineDatas.add(laya.d3.core.material.BlinnPhongMaterial.SHADERDEFINE_SPECULARMAP);
		else
		this._defineDatas.remove(laya.d3.core.material.BlinnPhongMaterial.SHADERDEFINE_SPECULARMAP);
		this._shaderValues.setTexture(BlinnPhongMaterial.SPECULARTEXTURE,value);
	});

	BlinnPhongMaterial.__init__=function(){
		BlinnPhongMaterial.SHADERDEFINE_DIFFUSEMAP=BlinnPhongMaterial.shaderDefines.registerDefine("DIFFUSEMAP");
		BlinnPhongMaterial.SHADERDEFINE_NORMALMAP=BlinnPhongMaterial.shaderDefines.registerDefine("NORMALMAP");
		BlinnPhongMaterial.SHADERDEFINE_SPECULARMAP=BlinnPhongMaterial.shaderDefines.registerDefine("SPECULARMAP");
		BlinnPhongMaterial.SHADERDEFINE_TILINGOFFSET=BlinnPhongMaterial.shaderDefines.registerDefine("TILINGOFFSET");
		BlinnPhongMaterial.SHADERDEFINE_ENABLEVERTEXCOLOR=BlinnPhongMaterial.shaderDefines.registerDefine("ENABLEVERTEXCOLOR");
	}

	BlinnPhongMaterial.SPECULARSOURCE_DIFFUSEMAPALPHA=0;
	BlinnPhongMaterial.SPECULARSOURCE_SPECULARMAP=0;
	BlinnPhongMaterial.RENDERMODE_OPAQUE=0;
	BlinnPhongMaterial.RENDERMODE_CUTOUT=1;
	BlinnPhongMaterial.RENDERMODE_TRANSPARENT=2;
	BlinnPhongMaterial.SHADERDEFINE_DIFFUSEMAP=0;
	BlinnPhongMaterial.SHADERDEFINE_NORMALMAP=0;
	BlinnPhongMaterial.SHADERDEFINE_SPECULARMAP=0;
	BlinnPhongMaterial.SHADERDEFINE_TILINGOFFSET=0;
	BlinnPhongMaterial.SHADERDEFINE_ENABLEVERTEXCOLOR=0;
	__static(BlinnPhongMaterial,
	['ALBEDOTEXTURE',function(){return this.ALBEDOTEXTURE=Shader3D.propertyNameToID("u_DiffuseTexture");},'NORMALTEXTURE',function(){return this.NORMALTEXTURE=Shader3D.propertyNameToID("u_NormalTexture");},'SPECULARTEXTURE',function(){return this.SPECULARTEXTURE=Shader3D.propertyNameToID("u_SpecularTexture");},'ALBEDOCOLOR',function(){return this.ALBEDOCOLOR=Shader3D.propertyNameToID("u_DiffuseColor");},'MATERIALSPECULAR',function(){return this.MATERIALSPECULAR=Shader3D.propertyNameToID("u_MaterialSpecular");},'SHININESS',function(){return this.SHININESS=Shader3D.propertyNameToID("u_Shininess");},'TILINGOFFSET',function(){return this.TILINGOFFSET=Shader3D.propertyNameToID("u_TilingOffset");},'defaultMaterial',function(){return this.defaultMaterial=new BlinnPhongMaterial();},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines(BaseMaterial.shaderDefines);}
	]);
	return BlinnPhongMaterial;
})(BaseMaterial)

/**
*<code>PBRSpecularMaterial</code> 类用于实现PBR(Specular)材质。
*/
//class laya.d3.core.material.PBRSpecularMaterial extends laya.d3.core.material.BaseMaterial
var PBRSpecularMaterial=(function(_super){
	function PBRSpecularMaterial(){
		/**@private */
		this._albedoColor=null;
		/**@private */
		this._specularColor=null;
		/**@private */
		this._emissionColor=null;
		PBRSpecularMaterial.__super.call(this);
		this.setShaderName("PBRSpecular");
		this._albedoColor=new Vector4(1.0,1.0,1.0,1.0);
		this._shaderValues.setVector(PBRSpecularMaterial.ALBEDOCOLOR,new Vector4(1.0,1.0,1.0,1.0));
		this._emissionColor=new Vector4(0.0,0.0,0.0,0.0);
		this._shaderValues.setVector(PBRSpecularMaterial.EMISSIONCOLOR,new Vector4(0.0,0.0,0.0,0.0));
		this._specularColor=new Vector4(0.2,0.2,0.2,0.2);
		this._shaderValues.setVector(PBRSpecularMaterial.SPECULARCOLOR,new Vector4(0.2,0.2,0.2,0.2));
		this._shaderValues.setNumber(PBRSpecularMaterial.SMOOTHNESS,0.5);
		this._shaderValues.setNumber(PBRSpecularMaterial.SMOOTHNESSSCALE,1.0);
		this._shaderValues.setNumber(PBRSpecularMaterial.SMOOTHNESSSOURCE,0);
		this._shaderValues.setNumber(PBRSpecularMaterial.OCCLUSIONSTRENGTH,1.0);
		this._shaderValues.setNumber(PBRSpecularMaterial.NORMALSCALE,1.0);
		this._shaderValues.setNumber(PBRSpecularMaterial.PARALLAXSCALE,0.001);
		this._shaderValues.setBool(PBRSpecularMaterial.ENABLEEMISSION,false);
		this._shaderValues.setNumber(BaseMaterial.ALPHATESTVALUE,0.5);
	}

	__class(PBRSpecularMaterial,'laya.d3.core.material.PBRSpecularMaterial',_super);
	var __proto=PBRSpecularMaterial.prototype;
	/**
	*@inheritDoc
	*/
	__proto.cloneTo=function(destObject){
		_super.prototype.cloneTo.call(this,destObject);
		var destMaterial=destObject;
		this._albedoColor.cloneTo(destMaterial._albedoColor);
		this._specularColor.cloneTo(destMaterial._specularColor);
		this._emissionColor.cloneTo(destMaterial._emissionColor);
	}

	/**
	*设置放射贴图。
	*@param value 放射贴图。
	*/
	/**
	*获取放射贴图。
	*@return 放射贴图。
	*/
	__getset(0,__proto,'emissionTexture',function(){
		return this._shaderValues.getTexture(PBRSpecularMaterial.EMISSIONTEXTURE);
		},function(value){
		if (value)
			this._defineDatas.add(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_EMISSIONTEXTURE);
		else
		this._defineDatas.remove(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_EMISSIONTEXTURE);
		this._shaderValues.setTexture(PBRSpecularMaterial.EMISSIONTEXTURE,value);
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_SpecColorG',function(){
		return this._specularColor.elements[1];
		},function(value){
		this._specularColor.elements[1]=value;
		this.specularColor=this._specularColor;
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
	*设置反射率颜色A分量。
	*@param value 反射率颜色A分量。
	*/
	/**
	*获取反射率颜色A分量。
	*@return 反射率颜色A分量。
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
		return this._shaderValues.getVector(PBRSpecularMaterial.TILINGOFFSET).elements[0];
		},function(x){
		var tilOff=this._shaderValues.getVector(PBRSpecularMaterial.TILINGOFFSET);
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
		return this._specularColor.elements[2];
		},function(value){
		this._specularColor.elements[2]=value;
		this.specularColor=this._specularColor;
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
				this._defineDatas.remove(PBRSpecularMaterial.SHADERDEFINE_ALPHAPREMULTIPLY);
				break ;
			case 1:
				this.renderQueue=/*laya.d3.core.material.BaseMaterial.RENDERQUEUE_ALPHATEST*/2450;
				this.alphaTest=true;
				renderState.depthWrite=true;
				renderState.cull=/*laya.d3.core.material.RenderState.CULL_BACK*/2;
				renderState.blend=/*laya.d3.core.material.RenderState.BLEND_DISABLE*/0;
				renderState.depthTest=/*laya.d3.core.material.RenderState.DEPTHTEST_LESS*/0x0201;
				this._defineDatas.remove(PBRSpecularMaterial.SHADERDEFINE_ALPHAPREMULTIPLY);
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
				this._defineDatas.remove(PBRSpecularMaterial.SHADERDEFINE_ALPHAPREMULTIPLY);
				break ;
				break ;
			case 3:
				this.renderQueue=/*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
				this.alphaTest=false;
				renderState.depthWrite=false;
				renderState.cull=/*laya.d3.core.material.RenderState.CULL_BACK*/2;
				renderState.blend=/*laya.d3.core.material.RenderState.BLEND_ENABLE_ALL*/1;
				renderState.srcBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_ONE*/1;
				renderState.dstBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA*/0x0303;
				renderState.depthTest=/*laya.d3.core.material.RenderState.DEPTHTEST_LESS*/0x0201;
				this._defineDatas.add(PBRSpecularMaterial.SHADERDEFINE_ALPHAPREMULTIPLY);
				break ;
			default :
				throw new Error("PBRSpecularMaterial : renderMode value error.");
			}
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_SpecColorR',function(){
		return this._specularColor.elements[0];
		},function(value){
		this._specularColor.elements[0]=value;
		this.specularColor=this._specularColor;
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
	/**
	*@private
	*/
	__getset(0,__proto,'_Glossiness',function(){
		return this._shaderValues.getNumber(PBRSpecularMaterial.SMOOTHNESS);
		},function(value){
		this._shaderValues.setNumber(PBRSpecularMaterial.SMOOTHNESS,value);
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
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
		return this._shaderValues.getVector(PBRSpecularMaterial.SPECULARCOLOR);
		},function(value){
		this._shaderValues.setVector(PBRSpecularMaterial.SPECULARCOLOR,value);
	});

	/**
	*设置反射率颜色B分量。
	*@param value 反射率颜色B分量。
	*/
	/**
	*获取反射率颜色B分量。
	*@return 反射率颜色B分量。
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
		return this._specularColor.elements[3];
		},function(value){
		this._specularColor.elements[3]=value;
		this.specularColor=this._specularColor;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_GlossMapScale',function(){
		return this._shaderValues.getNumber(PBRSpecularMaterial.SMOOTHNESSSCALE);
		},function(value){
		this._shaderValues.setNumber(PBRSpecularMaterial.SMOOTHNESSSCALE,value);
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_BumpScale',function(){
		return this._shaderValues.getNumber(PBRSpecularMaterial.NORMALSCALE);
		},function(value){
		this._shaderValues.setNumber(PBRSpecularMaterial.NORMALSCALE,value);
	});

	/**
	*@private
	*/
	/**@private */
	__getset(0,__proto,'_Parallax',function(){
		return this._shaderValues.getNumber(PBRSpecularMaterial.PARALLAXSCALE);
		},function(value){
		this._shaderValues.setNumber(PBRSpecularMaterial.PARALLAXSCALE,value);
	});

	/**
	*@private
	*/
	/**@private */
	__getset(0,__proto,'_OcclusionStrength',function(){
		return this._shaderValues.getNumber(PBRSpecularMaterial.OCCLUSIONSTRENGTH);
		},function(value){
		this._shaderValues.setNumber(PBRSpecularMaterial.OCCLUSIONSTRENGTH,value);
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_EmissionColorR',function(){
		return this._emissionColor.elements[0];
		},function(value){
		this._emissionColor.elements[0]=value;
		this.emissionColor=this._emissionColor;
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
		return this._shaderValues.getVector(PBRSpecularMaterial.TILINGOFFSET);
		},function(value){
		if (value){
			var valueE=value.elements;
			if (valueE[0] !=1 || valueE[1] !=1 || valueE[2] !=0 || valueE[3] !=0)
				this._defineDatas.add(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_TILINGOFFSET);
			else
			this._defineDatas.remove(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_TILINGOFFSET);
			}else {
			this._defineDatas.remove(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_TILINGOFFSET);
		}
		this._shaderValues.setVector(PBRSpecularMaterial.TILINGOFFSET,value);
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_EmissionColorG',function(){
		return this._emissionColor.elements[1];
		},function(value){
		this._emissionColor.elements[1]=value;
		this.emissionColor=this._emissionColor;
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
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_EmissionColorB',function(){
		return this._emissionColor.elements[2];
		},function(value){
		this._emissionColor.elements[2]=value;
		this.emissionColor=this._emissionColor;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_EmissionColorA',function(){
		return this._emissionColor.elements[3];
		},function(value){
		this._emissionColor.elements[3]=value;
		this.emissionColor=this._emissionColor;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STY',function(){
		return this._shaderValues.getVector(PBRSpecularMaterial.TILINGOFFSET).elements[1];
		},function(y){
		var tilOff=this._shaderValues.getVector(PBRSpecularMaterial.TILINGOFFSET);
		tilOff.elements[1]=y;
		this.tilingOffset=tilOff;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STZ',function(){
		return this._shaderValues.getVector(PBRSpecularMaterial.TILINGOFFSET).elements[2];
		},function(z){
		var tilOff=this._shaderValues.getVector(PBRSpecularMaterial.TILINGOFFSET);
		tilOff.elements[2]=z;
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
		return this._shaderValues.getVector(PBRSpecularMaterial.TILINGOFFSET).elements[3];
		},function(w){
		var tilOff=this._shaderValues.getVector(PBRSpecularMaterial.TILINGOFFSET);
		tilOff.elements[3]=w;
		this.tilingOffset=tilOff;
	});

	/**
	*设置反射率颜色R分量。
	*@param value 反射率颜色R分量。
	*/
	/**
	*获取反射率颜色R分量。
	*@return 反射率颜色R分量。
	*/
	__getset(0,__proto,'albedoColorR',function(){
		return this._ColorR;
		},function(value){
		this._ColorR=value;
	});

	/**
	*设置反射率颜色G分量。
	*@param value 反射率颜色G分量。
	*/
	/**
	*获取反射率颜色G分量。
	*@return 反射率颜色G分量。
	*/
	__getset(0,__proto,'albedoColorG',function(){
		return this._ColorG;
		},function(value){
		this._ColorG=value;
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
	*设置反射率颜色。
	*@param value 反射率颜色。
	*/
	/**
	*获取反射率颜色。
	*@return 反射率颜色。
	*/
	__getset(0,__proto,'albedoColor',function(){
		return this._albedoColor;
		},function(value){
		this._albedoColor=value;
		this._shaderValues.setVector(PBRSpecularMaterial.ALBEDOCOLOR,value);
	});

	/**
	*设置漫反射贴图。
	*@param value 漫反射贴图。
	*/
	/**
	*获取漫反射贴图。
	*@return 漫反射贴图。
	*/
	__getset(0,__proto,'albedoTexture',function(){
		return this._shaderValues.getTexture(PBRSpecularMaterial.ALBEDOTEXTURE);
		},function(value){
		if (value){
			this._defineDatas.add(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_ALBEDOTEXTURE);
		}
		else{
			this._defineDatas.remove(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_ALBEDOTEXTURE);
		}
		this._shaderValues.setTexture(PBRSpecularMaterial.ALBEDOTEXTURE,value);
	});

	/**
	*设置视差贴图。
	*@param value 视察贴图。
	*/
	/**
	*获取视差贴图。
	*@return 视察贴图。
	*/
	__getset(0,__proto,'parallaxTexture',function(){
		return this._shaderValues.getTexture(PBRSpecularMaterial.PARALLAXTEXTURE);
		},function(value){
		if (value){
			this._defineDatas.add(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_PARALLAXTEXTURE);
		}
		else{
			this._defineDatas.remove(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_PARALLAXTEXTURE);
		}
		this._shaderValues.setTexture(PBRSpecularMaterial.PARALLAXTEXTURE,value);
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
		return this._shaderValues.getTexture(PBRSpecularMaterial.NORMALTEXTURE);
		},function(value){
		if (value){
			this._defineDatas.add(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_NORMALTEXTURE);
		}
		else{
			this._defineDatas.remove(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_NORMALTEXTURE);
		}
		this._shaderValues.setTexture(PBRSpecularMaterial.NORMALTEXTURE,value);
	});

	/**
	*设置放射颜色。
	*@param value 放射颜色。
	*/
	/**
	*获取放射颜色。
	*@return 放射颜色。
	*/
	__getset(0,__proto,'emissionColor',function(){
		return this._shaderValues.getVector(PBRSpecularMaterial.EMISSIONCOLOR);
		},function(value){
		this._shaderValues.setVector(PBRSpecularMaterial.EMISSIONCOLOR,value);
	});

	/**
	*设置视差贴图缩放系数。
	*@param value 视差缩放系数。
	*/
	/**
	*获取视差贴图缩放系数。
	*@return 视差缩放系数。
	*/
	__getset(0,__proto,'parallaxTextureScale',function(){
		return this._Parallax;
		},function(value){
		this._Parallax=Math.max(0.005,Math.min(0.08,value));
	});

	/**
	*设置法线贴图缩放系数。
	*@param value 法线贴图缩放系数。
	*/
	/**
	*获取法线贴图缩放系数。
	*@return 法线贴图缩放系数。
	*/
	__getset(0,__proto,'normalTextureScale',function(){
		return this._BumpScale;
		},function(value){
		this._BumpScale=value;
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
	*设置遮挡贴图。
	*@param value 遮挡贴图。
	*/
	/**
	*获取遮挡贴图。
	*@return 遮挡贴图。
	*/
	__getset(0,__proto,'occlusionTexture',function(){
		return this._shaderValues.getTexture(PBRSpecularMaterial.OCCLUSIONTEXTURE);
		},function(value){
		if (value){
			this._defineDatas.add(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_OCCLUSIONTEXTURE);
		}
		else{
			this._defineDatas.remove(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_OCCLUSIONTEXTURE);
		}
		this._shaderValues.setTexture(PBRSpecularMaterial.OCCLUSIONTEXTURE,value);
	});

	/**
	*设置遮挡贴图强度。
	*@param value 遮挡贴图强度,范围为0到1。
	*/
	/**
	*获取遮挡贴图强度。
	*@return 遮挡贴图强度,范围为0到1。
	*/
	__getset(0,__proto,'occlusionTextureStrength',function(){
		return this._OcclusionStrength;
		},function(value){
		this._OcclusionStrength=Math.max(0.0,Math.min(1.0,value));
	});

	/**
	*设置高光贴图。
	*@param value 高光贴图。
	*/
	/**
	*获取高光贴图。
	*@return 高光贴图。
	*/
	__getset(0,__proto,'specularTexture',function(){
		return this._shaderValues.getTexture(PBRSpecularMaterial.SPECULARTEXTURE);
		},function(value){
		if (value){
			this._defineDatas.add(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_SPECULARTEXTURE);
		}
		else{
			this._defineDatas.remove(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_SPECULARTEXTURE);
		}
		this._shaderValues.setTexture(PBRSpecularMaterial.SPECULARTEXTURE,value);
	});

	/**
	*设置高光颜色R分量。
	*@param value 高光颜色R分量。
	*/
	/**
	*获取高光颜色R分量。
	*@return 高光颜色R分量。
	*/
	__getset(0,__proto,'specularColorR',function(){
		return this._SpecColorR;
		},function(value){
		this._SpecColorR=value;
	});

	/**
	*设置光滑度。
	*@param value 光滑度,范围为0到1。
	*/
	/**
	*获取光滑度。
	*@return 光滑度,范围为0到1。
	*/
	__getset(0,__proto,'smoothness',function(){
		return this._Glossiness;
		},function(value){
		this._Glossiness=Math.max(0.0,Math.min(1.0,value));
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
	*设置光滑度缩放系数。
	*@param value 光滑度缩放系数,范围为0到1。
	*/
	/**
	*获取光滑度缩放系数。
	*@return 光滑度缩放系数,范围为0到1。
	*/
	__getset(0,__proto,'smoothnessTextureScale',function(){
		return this._GlossMapScale;
		},function(value){
		this._GlossMapScale=Math.max(0.0,Math.min(1.0,value));
	});

	/**
	*设置光滑度数据源。
	*@param value 光滑滑度数据源,0或1。
	*/
	/**
	*获取光滑度数据源
	*@return 光滑滑度数据源,0或1。
	*/
	__getset(0,__proto,'smoothnessSource',function(){
		return this._shaderValues.getInt(PBRSpecularMaterial.SMOOTHNESSSOURCE);
		},function(value){
		if (value){
			this._defineDatas.add(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_SMOOTHNESSSOURCE_ALBEDOTEXTURE_ALPHA);
			this._shaderValues.setInt(PBRSpecularMaterial.SMOOTHNESSSOURCE,1);
		}
		else {
			this._defineDatas.remove(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_SMOOTHNESSSOURCE_ALBEDOTEXTURE_ALPHA);
			this._shaderValues.setInt(PBRSpecularMaterial.SMOOTHNESSSOURCE,0);
		}
	});

	/**
	*设置是否激活放射属性。
	*@param value 是否激活放射属性
	*/
	/**
	*获取是否激活放射属性。
	*@return 是否激活放射属性。
	*/
	__getset(0,__proto,'enableEmission',function(){
		return this._shaderValues.getBool(PBRSpecularMaterial.ENABLEEMISSION);
		},function(value){
		if (value)
			this._defineDatas.add(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_EMISSION);
		else {
			this._defineDatas.remove(laya.d3.core.material.PBRSpecularMaterial.SHADERDEFINE_EMISSION);
		}
		this._shaderValues.setBool(PBRSpecularMaterial.ENABLEEMISSION,value);
	});

	/**
	*设置是否开启反射。
	*@param value 是否开启反射。
	*/
	/**
	*获取是否开启反射。
	*@return 是否开启反射。
	*/
	__getset(0,__proto,'enableReflection',function(){
		return this._shaderValues.getBool(PBRSpecularMaterial.ENABLEREFLECT);
		},function(value){
		this._shaderValues.setBool(PBRSpecularMaterial.ENABLEREFLECT,true);
		if (value)
			this._disablePublicDefineDatas.remove(Scene3D.SHADERDEFINE_REFLECTMAP);
		else
		this._disablePublicDefineDatas.add(Scene3D.SHADERDEFINE_REFLECTMAP);
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

	PBRSpecularMaterial.__init__=function(){
		PBRSpecularMaterial.SHADERDEFINE_ALBEDOTEXTURE=PBRSpecularMaterial.shaderDefines.registerDefine("ALBEDOTEXTURE");
		PBRSpecularMaterial.SHADERDEFINE_SPECULARTEXTURE=PBRSpecularMaterial.shaderDefines.registerDefine("SPECULARTEXTURE");
		PBRSpecularMaterial.SHADERDEFINE_SMOOTHNESSSOURCE_ALBEDOTEXTURE_ALPHA=PBRSpecularMaterial.shaderDefines.registerDefine("SMOOTHNESSSOURCE_ALBEDOTEXTURE_ALPHA");
		PBRSpecularMaterial.SHADERDEFINE_NORMALTEXTURE=PBRSpecularMaterial.shaderDefines.registerDefine("NORMALTEXTURE");
		PBRSpecularMaterial.SHADERDEFINE_PARALLAXTEXTURE=PBRSpecularMaterial.shaderDefines.registerDefine("PARALLAXTEXTURE");
		PBRSpecularMaterial.SHADERDEFINE_OCCLUSIONTEXTURE=PBRSpecularMaterial.shaderDefines.registerDefine("OCCLUSIONTEXTURE");
		PBRSpecularMaterial.SHADERDEFINE_EMISSION=PBRSpecularMaterial.shaderDefines.registerDefine("EMISSION");
		PBRSpecularMaterial.SHADERDEFINE_EMISSIONTEXTURE=PBRSpecularMaterial.shaderDefines.registerDefine("EMISSIONTEXTURE");
		PBRSpecularMaterial.SHADERDEFINE_TILINGOFFSET=PBRSpecularMaterial.shaderDefines.registerDefine("TILINGOFFSET");
		PBRSpecularMaterial.SHADERDEFINE_ALPHAPREMULTIPLY=PBRSpecularMaterial.shaderDefines.registerDefine("ALPHAPREMULTIPLY");
	}

	PBRSpecularMaterial.SmoothnessSource_SpecularTexture_Alpha=0;
	PBRSpecularMaterial.SmoothnessSource_AlbedoTexture_Alpha=1;
	PBRSpecularMaterial.RENDERMODE_OPAQUE=0;
	PBRSpecularMaterial.RENDERMODE_CUTOUT=1;
	PBRSpecularMaterial.RENDERMODE_FADE=2;
	PBRSpecularMaterial.RENDERMODE_TRANSPARENT=3;
	PBRSpecularMaterial.SHADERDEFINE_ALBEDOTEXTURE=0;
	PBRSpecularMaterial.SHADERDEFINE_NORMALTEXTURE=0;
	PBRSpecularMaterial.SHADERDEFINE_SMOOTHNESSSOURCE_ALBEDOTEXTURE_ALPHA=0;
	PBRSpecularMaterial.SHADERDEFINE_SPECULARTEXTURE=0;
	PBRSpecularMaterial.SHADERDEFINE_OCCLUSIONTEXTURE=0;
	PBRSpecularMaterial.SHADERDEFINE_PARALLAXTEXTURE=0;
	PBRSpecularMaterial.SHADERDEFINE_EMISSION=0;
	PBRSpecularMaterial.SHADERDEFINE_EMISSIONTEXTURE=0;
	PBRSpecularMaterial.SHADERDEFINE_TILINGOFFSET=0;
	PBRSpecularMaterial.SHADERDEFINE_ALPHAPREMULTIPLY=0;
	PBRSpecularMaterial.SMOOTHNESSSOURCE=-1;
	PBRSpecularMaterial.ENABLEEMISSION=-1;
	PBRSpecularMaterial.ENABLEREFLECT=-1;
	__static(PBRSpecularMaterial,
	['ALBEDOTEXTURE',function(){return this.ALBEDOTEXTURE=Shader3D.propertyNameToID("u_AlbedoTexture");},'SPECULARTEXTURE',function(){return this.SPECULARTEXTURE=Shader3D.propertyNameToID("u_SpecularTexture");},'NORMALTEXTURE',function(){return this.NORMALTEXTURE=Shader3D.propertyNameToID("u_NormalTexture");},'PARALLAXTEXTURE',function(){return this.PARALLAXTEXTURE=Shader3D.propertyNameToID("u_ParallaxTexture");},'OCCLUSIONTEXTURE',function(){return this.OCCLUSIONTEXTURE=Shader3D.propertyNameToID("u_OcclusionTexture");},'EMISSIONTEXTURE',function(){return this.EMISSIONTEXTURE=Shader3D.propertyNameToID("u_EmissionTexture");},'ALBEDOCOLOR',function(){return this.ALBEDOCOLOR=Shader3D.propertyNameToID("u_AlbedoColor");},'SPECULARCOLOR',function(){return this.SPECULARCOLOR=Shader3D.propertyNameToID("u_SpecularColor");},'EMISSIONCOLOR',function(){return this.EMISSIONCOLOR=Shader3D.propertyNameToID("u_EmissionColor");},'SMOOTHNESS',function(){return this.SMOOTHNESS=Shader3D.propertyNameToID("u_smoothness");},'SMOOTHNESSSCALE',function(){return this.SMOOTHNESSSCALE=Shader3D.propertyNameToID("u_smoothnessScale");},'OCCLUSIONSTRENGTH',function(){return this.OCCLUSIONSTRENGTH=Shader3D.propertyNameToID("u_occlusionStrength");},'NORMALSCALE',function(){return this.NORMALSCALE=Shader3D.propertyNameToID("u_normalScale");},'PARALLAXSCALE',function(){return this.PARALLAXSCALE=Shader3D.propertyNameToID("u_parallaxScale");},'TILINGOFFSET',function(){return this.TILINGOFFSET=Shader3D.propertyNameToID("u_TilingOffset");},'defaultMaterial',function(){return this.defaultMaterial=new PBRSpecularMaterial();},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines(BaseMaterial.shaderDefines);}
	]);
	return PBRSpecularMaterial;
})(BaseMaterial)


/**

*/
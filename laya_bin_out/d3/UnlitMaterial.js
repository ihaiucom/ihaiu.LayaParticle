/**
*<code>UnlitMaterial</code> 类用于实现不受光照影响的材质。
*/
//class laya.d3.core.material.UnlitMaterial extends laya.d3.core.material.BaseMaterial
var UnlitMaterial=(function(_super){
	function UnlitMaterial(){
		/**@private */
		this._albedoIntensity=1.0;
		/**@private */
		this._enableVertexColor=false;
		this._albedoColor=new Vector4(1.0,1.0,1.0,1.0);
		UnlitMaterial.__super.call(this);
		this.setShaderName("Unlit");
		this._shaderValues.setVector(UnlitMaterial.ALBEDOCOLOR,new Vector4(1.0,1.0,1.0,1.0));
	}

	__class(UnlitMaterial,'laya.d3.core.material.UnlitMaterial',_super);
	var __proto=UnlitMaterial.prototype;
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
		return this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET).elements[0];
		},function(x){
		var tilOff=this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET);
		tilOff.elements[0]=x;
		this.tilingOffset=tilOff;
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
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_AlbedoIntensity',function(){
		return this._albedoIntensity;
		},function(value){
		if (this._albedoIntensity!==value){
			var finalAlbedo=this._shaderValues.getVector(UnlitMaterial.ALBEDOCOLOR);
			Vector4.scale(this._albedoColor,value,finalAlbedo);
			this._albedoIntensity=value;
			this._shaderValues.setVector(UnlitMaterial.ALBEDOCOLOR,finalAlbedo);
		}
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STZ',function(){
		return this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET).elements[2];
		},function(z){
		var tilOff=this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET);
		tilOff.elements[2]=z;
		this.tilingOffset=tilOff;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STY',function(){
		return this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET).elements[1];
		},function(y){
		var tilOff=this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET);
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
		return this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET).elements[3];
		},function(w){
		var tilOff=this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET);
		tilOff.elements[3]=w;
		this.tilingOffset=tilOff;
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
		var finalAlbedo=this._shaderValues.getVector(UnlitMaterial.ALBEDOCOLOR);
		Vector4.scale(value,this._albedoIntensity,finalAlbedo);
		this._albedoColor=value;
		this._shaderValues.setVector(UnlitMaterial.ALBEDOCOLOR,finalAlbedo);
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
			this._defineDatas.add(laya.d3.core.material.UnlitMaterial.SHADERDEFINE_ENABLEVERTEXCOLOR);
		else
		this._defineDatas.remove(laya.d3.core.material.UnlitMaterial.SHADERDEFINE_ENABLEVERTEXCOLOR);
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
		return this._shaderValues.getTexture(UnlitMaterial.ALBEDOTEXTURE);
		},function(value){
		if (value)
			this._defineDatas.add(laya.d3.core.material.UnlitMaterial.SHADERDEFINE_ALBEDOTEXTURE);
		else
		this._defineDatas.remove(laya.d3.core.material.UnlitMaterial.SHADERDEFINE_ALBEDOTEXTURE);
		this._shaderValues.setTexture(UnlitMaterial.ALBEDOTEXTURE,value);
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
		return this._shaderValues.getVector(UnlitMaterial.TILINGOFFSET);
		},function(value){
		if (value){
			var valueE=value.elements;
			if (valueE[0] !=1 || valueE[1] !=1 || valueE[2] !=0 || valueE[3] !=0)
				this._defineDatas.add(laya.d3.core.material.UnlitMaterial.SHADERDEFINE_TILINGOFFSET);
			else
			this._defineDatas.remove(laya.d3.core.material.UnlitMaterial.SHADERDEFINE_TILINGOFFSET);
			}else {
			this._defineDatas.remove(laya.d3.core.material.UnlitMaterial.SHADERDEFINE_TILINGOFFSET);
		}
		this._shaderValues.setVector(UnlitMaterial.TILINGOFFSET,value);
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
				throw new Error("UnlitMaterial : renderMode value error.");
			}
	});

	UnlitMaterial.__init__=function(){
		UnlitMaterial.SHADERDEFINE_ALBEDOTEXTURE=UnlitMaterial.shaderDefines.registerDefine("ALBEDOTEXTURE");
		UnlitMaterial.SHADERDEFINE_TILINGOFFSET=UnlitMaterial.shaderDefines.registerDefine("TILINGOFFSET");
		UnlitMaterial.SHADERDEFINE_ENABLEVERTEXCOLOR=UnlitMaterial.shaderDefines.registerDefine("ENABLEVERTEXCOLOR");
	}

	UnlitMaterial.RENDERMODE_OPAQUE=0;
	UnlitMaterial.RENDERMODE_CUTOUT=1;
	UnlitMaterial.RENDERMODE_TRANSPARENT=2;
	UnlitMaterial.RENDERMODE_ADDTIVE=3;
	UnlitMaterial.SHADERDEFINE_ALBEDOTEXTURE=0;
	UnlitMaterial.SHADERDEFINE_TILINGOFFSET=0;
	UnlitMaterial.SHADERDEFINE_ENABLEVERTEXCOLOR=0;
	__static(UnlitMaterial,
	['ALBEDOTEXTURE',function(){return this.ALBEDOTEXTURE=Shader3D.propertyNameToID("u_AlbedoTexture");},'ALBEDOCOLOR',function(){return this.ALBEDOCOLOR=Shader3D.propertyNameToID("u_AlbedoColor");},'TILINGOFFSET',function(){return this.TILINGOFFSET=Shader3D.propertyNameToID("u_TilingOffset");},'defaultMaterial',function(){return this.defaultMaterial=new UnlitMaterial();},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines(BaseMaterial.shaderDefines);}
	]);
	return UnlitMaterial;
})(BaseMaterial)


/**
*...
*@author
*/
//class laya.d3.core.pixelLine.PixelLineMaterial extends laya.d3.core.material.BaseMaterial
var PixelLineMaterial=(function(_super){
	function PixelLineMaterial(){
		PixelLineMaterial.__super.call(this);
		this.setShaderName("LineShader");
		this._shaderValues.setVector(PixelLineMaterial.COLOR,new Vector4(1.0,1.0,1.0,1.0));
	}

	__class(PixelLineMaterial,'laya.d3.core.pixelLine.PixelLineMaterial',_super);
	var __proto=PixelLineMaterial.prototype;
	/**
	*设置颜色。
	*@param value 颜色。
	*/
	/**
	*获取颜色。
	*@return 颜色。
	*/
	__getset(0,__proto,'color',function(){
		return this._shaderValues.getVector(PixelLineMaterial.COLOR);
		},function(value){
		this._shaderValues.setVector(PixelLineMaterial.COLOR,value);
	});

	PixelLineMaterial.__init__=function(){}
	__static(PixelLineMaterial,
	['COLOR',function(){return this.COLOR=Shader3D.propertyNameToID("u_Color");},'defaultMaterial',function(){return this.defaultMaterial=new PixelLineMaterial();},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines(BaseMaterial.shaderDefines);}
	]);
	return PixelLineMaterial;
})(BaseMaterial)


/**

*/
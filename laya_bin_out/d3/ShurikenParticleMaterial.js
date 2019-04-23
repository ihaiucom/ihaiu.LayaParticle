/**
*<code>ShurikenParticleMaterial</code> 类用于实现粒子材质。
*/
//class laya.d3.core.particleShuriKen.ShurikenParticleMaterial extends laya.d3.core.material.BaseMaterial
var ShurikenParticleMaterial=(function(_super){
	function ShurikenParticleMaterial(){
		/**@private */
		//this._color=null;
		ShurikenParticleMaterial.__super.call(this);
		this.setShaderName("PARTICLESHURIKEN");
		this._color=new Vector4(1.0,1.0,1.0,1.0);
		this.renderMode=0;
	}

	__class(ShurikenParticleMaterial,'laya.d3.core.particleShuriKen.ShurikenParticleMaterial',_super);
	var __proto=ShurikenParticleMaterial.prototype;
	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_TintColorB',function(){
		return this._color.elements[2];
		},function(value){
		this._color.elements[2]=value;
		this.color=this._color;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STZ',function(){
		return this._shaderValues.getVector(ShurikenParticleMaterial.TILINGOFFSET).elements[2];
		},function(z){
		var tilOff=this._shaderValues.getVector(ShurikenParticleMaterial.TILINGOFFSET);
		tilOff.elements[2]=z;
		this.tilingOffset=tilOff;
	});

	/**
	*设置漫反射贴图。
	*@param value 漫反射贴图。
	*/
	/**
	*获取漫反射贴图。
	*@return 漫反射贴图。
	*/
	__getset(0,__proto,'texture',function(){
		return this._shaderValues.getTexture(ShurikenParticleMaterial.DIFFUSETEXTURE);
		},function(value){
		if (value)
			this._defineDatas.add(laya.d3.core.particleShuriKen.ShurikenParticleMaterial.SHADERDEFINE_DIFFUSEMAP);
		else
		this._defineDatas.remove(laya.d3.core.particleShuriKen.ShurikenParticleMaterial.SHADERDEFINE_DIFFUSEMAP);
		this._shaderValues.setTexture(ShurikenParticleMaterial.DIFFUSETEXTURE,value);
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_TintColorR',function(){
		return this._color.elements[0];
		},function(value){
		this._color.elements[0]=value;
		this.color=this._color;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STW',function(){
		return this._shaderValues.getVector(ShurikenParticleMaterial.TILINGOFFSET).elements[3];
		},function(w){
		var tilOff=this._shaderValues.getVector(ShurikenParticleMaterial.TILINGOFFSET);
		tilOff.elements[3]=w;
		this.tilingOffset=tilOff;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_TintColorG',function(){
		return this._color.elements[1];
		},function(value){
		this._color.elements[1]=value;
		this.color=this._color;
	});

	/**
	*@private
	*/
	/**@private */
	__getset(0,__proto,'_TintColorA',function(){
		return this._color.elements[3];
		},function(value){
		this._color.elements[3]=value;
		this.color=this._color;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STY',function(){
		return this._shaderValues.getVector(ShurikenParticleMaterial.TILINGOFFSET).elements[1];
		},function(y){
		var tilOff=this._shaderValues.getVector(ShurikenParticleMaterial.TILINGOFFSET);
		tilOff.elements[1]=y;
		this.tilingOffset=tilOff;
	});

	/**
	*设置渲染模式。
	*@return 渲染模式。
	*/
	__getset(0,__proto,'renderMode',null,function(value){
		var renderState=this.getRenderState();
		switch (value){
			case 1:
				this.renderQueue=/*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
				renderState.depthWrite=false;
				renderState.cull=/*laya.d3.core.material.RenderState.CULL_NONE*/0;
				renderState.blend=/*laya.d3.core.material.RenderState.BLEND_ENABLE_ALL*/1;
				renderState.srcBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_SRC_ALPHA*/0x0302;
				renderState.dstBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA*/0x0303;
				this.alphaTest=false;
				this._defineDatas.add(ShurikenParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
				break ;
			case 0:
				this.renderQueue=/*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
				renderState.depthWrite=false;
				renderState.cull=/*laya.d3.core.material.RenderState.CULL_NONE*/0;
				renderState.blend=/*laya.d3.core.material.RenderState.BLEND_ENABLE_ALL*/1;
				renderState.srcBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_SRC_ALPHA*/0x0302;
				renderState.dstBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_ONE*/1;
				this.alphaTest=false;
				this._defineDatas.remove(ShurikenParticleMaterial.SHADERDEFINE_ADDTIVEFOG);
				break ;
			default :
				throw new Error("ShurikenParticleMaterial : renderMode value error.");
			}
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STX',function(){
		return this._shaderValues.getVector(ShurikenParticleMaterial.TILINGOFFSET).elements[0];
		},function(x){
		var tilOff=this._shaderValues.getVector(ShurikenParticleMaterial.TILINGOFFSET);
		tilOff.elements[0]=x;
		this.tilingOffset=tilOff;
	});

	/**
	*设置颜色R分量。
	*@param value 颜色R分量。
	*/
	/**
	*获取颜色R分量。
	*@return 颜色R分量。
	*/
	__getset(0,__proto,'colorR',function(){
		return this._TintColorR;
		},function(value){
		this._TintColorR=value;
	});

	/**
	*设置颜色G分量。
	*@param value 颜色G分量。
	*/
	/**
	*获取颜色G分量。
	*@return 颜色G分量。
	*/
	__getset(0,__proto,'colorG',function(){
		return this._TintColorG;
		},function(value){
		this._TintColorG=value;
	});

	/**
	*设置颜色B分量。
	*@param value 颜色B分量。
	*/
	/**
	*获取颜色B分量。
	*@return 颜色B分量。
	*/
	__getset(0,__proto,'colorB',function(){
		return this._TintColorB;
		},function(value){
		this._TintColorB=value;
	});

	/**
	*设置颜色alpha分量。
	*@param value 颜色alpha分量。
	*/
	/**
	*获取颜色Z分量。
	*@return 颜色Z分量。
	*/
	__getset(0,__proto,'colorA',function(){
		return this._TintColorA;
		},function(value){
		this._TintColorA=value;
	});

	/**
	*设置颜色。
	*@param value 颜色。
	*/
	/**
	*获取颜色。
	*@return 颜色。
	*/
	__getset(0,__proto,'color',function(){
		return this._shaderValues.getVector(ShurikenParticleMaterial.TINTCOLOR);
		},function(value){
		if (value)
			this._defineDatas.add(laya.d3.core.particleShuriKen.ShurikenParticleMaterial.SHADERDEFINE_TINTCOLOR);
		else
		this._defineDatas.remove(laya.d3.core.particleShuriKen.ShurikenParticleMaterial.SHADERDEFINE_TINTCOLOR);
		this._shaderValues.setVector(ShurikenParticleMaterial.TINTCOLOR,value);
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
		return this._shaderValues.getVector(ShurikenParticleMaterial.TILINGOFFSET);
		},function(value){
		if (value){
			var valueE=value.elements;
			if (valueE[0] !=1 || valueE[1] !=1 || valueE[2] !=0 || valueE[3] !=0)
				this._defineDatas.add(laya.d3.core.particleShuriKen.ShurikenParticleMaterial.SHADERDEFINE_TILINGOFFSET);
			else
			this._defineDatas.remove(laya.d3.core.particleShuriKen.ShurikenParticleMaterial.SHADERDEFINE_TILINGOFFSET);
			}else {
			this._defineDatas.remove(laya.d3.core.particleShuriKen.ShurikenParticleMaterial.SHADERDEFINE_TILINGOFFSET);
		}
		this._shaderValues.setVector(ShurikenParticleMaterial.TILINGOFFSET,value);
	});

	ShurikenParticleMaterial.__init__=function(){
		ShurikenParticleMaterial.SHADERDEFINE_DIFFUSEMAP=ShurikenParticleMaterial.shaderDefines.registerDefine("DIFFUSEMAP");
		ShurikenParticleMaterial.SHADERDEFINE_TINTCOLOR=ShurikenParticleMaterial.shaderDefines.registerDefine("TINTCOLOR");
		ShurikenParticleMaterial.SHADERDEFINE_ADDTIVEFOG=ShurikenParticleMaterial.shaderDefines.registerDefine("ADDTIVEFOG");
		ShurikenParticleMaterial.SHADERDEFINE_TILINGOFFSET=ShurikenParticleMaterial.shaderDefines.registerDefine("TILINGOFFSET");
	}

	ShurikenParticleMaterial.RENDERMODE_ALPHABLENDED=0;
	ShurikenParticleMaterial.RENDERMODE_ADDTIVE=1;
	ShurikenParticleMaterial.SHADERDEFINE_DIFFUSEMAP=0;
	ShurikenParticleMaterial.SHADERDEFINE_TINTCOLOR=0;
	ShurikenParticleMaterial.SHADERDEFINE_TILINGOFFSET=0;
	ShurikenParticleMaterial.SHADERDEFINE_ADDTIVEFOG=0;
	__static(ShurikenParticleMaterial,
	['DIFFUSETEXTURE',function(){return this.DIFFUSETEXTURE=Shader3D.propertyNameToID("u_texture");},'TINTCOLOR',function(){return this.TINTCOLOR=Shader3D.propertyNameToID("u_Tintcolor");},'TILINGOFFSET',function(){return this.TILINGOFFSET=Shader3D.propertyNameToID("u_TilingOffset");},'defaultMaterial',function(){return this.defaultMaterial=new ShurikenParticleMaterial();},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines(BaseMaterial.shaderDefines);}
	]);
	return ShurikenParticleMaterial;
})(BaseMaterial)


/**

*/
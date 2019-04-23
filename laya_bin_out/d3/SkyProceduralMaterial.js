/**
*<code>SkyProceduralMaterial</code> 类用于实现SkyProceduralMaterial材质。
*/
//class laya.d3.core.material.SkyProceduralMaterial extends laya.d3.core.material.BaseMaterial
var SkyProceduralMaterial=(function(_super){
	function SkyProceduralMaterial(){
		/**@private */
		this._sunDisk=0;
		SkyProceduralMaterial.__super.call(this);
		this.setShaderName("SkyBoxProcedural");
		this.sunDisk=1;
		this.sunSize=0.04;
		this.sunSizeConvergence=5;
		this.atmosphereThickness=1.0;
		this.skyTint=new Vector4(0.5,0.5,0.5,1.0);
		this.groundTint=new Vector4(0.369,0.349,0.341,1.0);
		this.exposure=1.3;
	}

	__class(SkyProceduralMaterial,'laya.d3.core.material.SkyProceduralMaterial',_super);
	var __proto=SkyProceduralMaterial.prototype;
	/**
	*设置曝光强度,范围是0到8。
	*@param value 曝光强度。
	*/
	/**
	*获取曝光强度,范围是0到8。
	*@return 曝光强度。
	*/
	__getset(0,__proto,'exposure',function(){
		return this._shaderValues.getNumber(SkyProceduralMaterial.EXPOSURE);
		},function(value){
		value=Math.min(Math.max(0.0,value),8.0);
		this._shaderValues.setNumber(SkyProceduralMaterial.EXPOSURE,value);
	});

	/**
	*设置太阳尺寸,范围是0到1。
	*@param value 太阳尺寸。
	*/
	/**
	*获取太阳尺寸,范围是0到1。
	*@return 太阳尺寸。
	*/
	__getset(0,__proto,'sunSize',function(){
		return this._shaderValues.getNumber(SkyProceduralMaterial.SUNSIZE);
		},function(value){
		value=Math.min(Math.max(0.0,value),1.0);
		this._shaderValues.setNumber(SkyProceduralMaterial.SUNSIZE,value);
	});

	/**
	*设置太阳状态。
	*@param value 太阳状态。
	*/
	/**
	*获取太阳状态。
	*@return 太阳状态。
	*/
	__getset(0,__proto,'sunDisk',function(){
		return this._sunDisk;
		},function(value){
		switch (value){
			case 1:
				this._defineDatas.remove(SkyProceduralMaterial.SHADERDEFINE_SUN_SIMPLE);
				this._defineDatas.add(SkyProceduralMaterial.SHADERDEFINE_SUN_HIGH_QUALITY);
				break ;
			case 2:
				this._defineDatas.remove(SkyProceduralMaterial.SHADERDEFINE_SUN_HIGH_QUALITY);
				this._defineDatas.add(SkyProceduralMaterial.SHADERDEFINE_SUN_SIMPLE);
				break ;
			case 0:
				this._defineDatas.remove(SkyProceduralMaterial.SHADERDEFINE_SUN_HIGH_QUALITY);
				this._defineDatas.remove(SkyProceduralMaterial.SHADERDEFINE_SUN_SIMPLE);
				break ;
			default :
				throw "SkyBoxProceduralMaterial: unknown sun value.";
			}
		this._sunDisk=value;
	});

	/**
	*设置太阳尺寸收缩,范围是0到20。
	*@param value 太阳尺寸收缩。
	*/
	/**
	*获取太阳尺寸收缩,范围是0到20。
	*@return 太阳尺寸收缩。
	*/
	__getset(0,__proto,'sunSizeConvergence',function(){
		return this._shaderValues.getNumber(SkyProceduralMaterial.SUNSIZECONVERGENCE);
		},function(value){
		value=Math.min(Math.max(0.0,value),20.0);
		this._shaderValues.setNumber(SkyProceduralMaterial.SUNSIZECONVERGENCE,value);
	});

	/**
	*设置大气厚度,范围是0到5。
	*@param value 大气厚度。
	*/
	/**
	*获取大气厚度,范围是0到5。
	*@return 大气厚度。
	*/
	__getset(0,__proto,'atmosphereThickness',function(){
		return this._shaderValues.getNumber(SkyProceduralMaterial.ATMOSPHERETHICKNESS);
		},function(value){
		value=Math.min(Math.max(0.0,value),5.0);
		this._shaderValues.setNumber(SkyProceduralMaterial.ATMOSPHERETHICKNESS,value);
	});

	/**
	*设置地面颜色。
	*@param value 地面颜色。
	*/
	/**
	*获取地面颜色。
	*@return 地面颜色。
	*/
	__getset(0,__proto,'groundTint',function(){
		return this._shaderValues.getVector(SkyProceduralMaterial.GROUNDTINT);
		},function(value){
		this._shaderValues.setVector(SkyProceduralMaterial.GROUNDTINT,value);
	});

	/**
	*设置天空颜色。
	*@param value 天空颜色。
	*/
	/**
	*获取天空颜色。
	*@return 天空颜色。
	*/
	__getset(0,__proto,'skyTint',function(){
		return this._shaderValues.getVector(SkyProceduralMaterial.SKYTINT);
		},function(value){
		this._shaderValues.setVector(SkyProceduralMaterial.SKYTINT,value);
	});

	SkyProceduralMaterial.__init__=function(){
		SkyProceduralMaterial.SHADERDEFINE_SUN_HIGH_QUALITY=SkyProceduralMaterial.shaderDefines.registerDefine("SUN_HIGH_QUALITY");
		SkyProceduralMaterial.SHADERDEFINE_SUN_SIMPLE=SkyProceduralMaterial.shaderDefines.registerDefine("SUN_SIMPLE");
	}

	SkyProceduralMaterial.SUN_NODE=0;
	SkyProceduralMaterial.SUN_HIGH_QUALITY=1;
	SkyProceduralMaterial.SUN_SIMPLE=2;
	SkyProceduralMaterial.SHADERDEFINE_SUN_HIGH_QUALITY=0;
	SkyProceduralMaterial.SHADERDEFINE_SUN_SIMPLE=0;
	__static(SkyProceduralMaterial,
	['SUNSIZE',function(){return this.SUNSIZE=Shader3D.propertyNameToID("u_SunSize");},'SUNSIZECONVERGENCE',function(){return this.SUNSIZECONVERGENCE=Shader3D.propertyNameToID("u_SunSizeConvergence");},'ATMOSPHERETHICKNESS',function(){return this.ATMOSPHERETHICKNESS=Shader3D.propertyNameToID("u_AtmosphereThickness");},'SKYTINT',function(){return this.SKYTINT=Shader3D.propertyNameToID("u_SkyTint");},'GROUNDTINT',function(){return this.GROUNDTINT=Shader3D.propertyNameToID("u_GroundTint");},'EXPOSURE',function(){return this.EXPOSURE=Shader3D.propertyNameToID("u_Exposure");},'defaultMaterial',function(){return this.defaultMaterial=new SkyProceduralMaterial();},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines(BaseMaterial.shaderDefines);}
	]);
	return SkyProceduralMaterial;
})(BaseMaterial)


/**

*/
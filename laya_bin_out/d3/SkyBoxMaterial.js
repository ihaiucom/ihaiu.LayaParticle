/**
*<code>SkyBoxMaterial</code> 类用于实现SkyBoxMaterial材质。
*/
//class laya.d3.core.material.SkyBoxMaterial extends laya.d3.core.material.BaseMaterial
var SkyBoxMaterial=(function(_super){
	/**
	*创建一个 <code>SkyBoxMaterial</code> 实例。
	*/
	function SkyBoxMaterial(){
		SkyBoxMaterial.__super.call(this);
		this.setShaderName("SkyBox");
	}

	__class(SkyBoxMaterial,'laya.d3.core.material.SkyBoxMaterial',_super);
	var __proto=SkyBoxMaterial.prototype;
	/**
	*设置颜色。
	*@param value 颜色。
	*/
	/**
	*获取颜色。
	*@return 颜色。
	*/
	__getset(0,__proto,'tintColor',function(){
		return this._shaderValues.getVector(SkyBoxMaterial.TINTCOLOR);
		},function(value){
		this._shaderValues.setVector(SkyBoxMaterial.TINTCOLOR,value);
	});

	/**
	*设置曝光强度。
	*@param value 曝光强度。
	*/
	/**
	*获取曝光强度。
	*@return 曝光强度。
	*/
	__getset(0,__proto,'exposure',function(){
		return this._shaderValues.getNumber(SkyBoxMaterial.EXPOSURE);
		},function(value){
		this._shaderValues.setNumber(SkyBoxMaterial.EXPOSURE,value);
	});

	/**
	*设置曝光强度。
	*@param value 曝光强度。
	*/
	/**
	*获取曝光强度。
	*@return 曝光强度。
	*/
	__getset(0,__proto,'rotation',function(){
		return this._shaderValues.getNumber(SkyBoxMaterial.ROTATION);
		},function(value){
		this._shaderValues.setNumber(SkyBoxMaterial.ROTATION,value);
	});

	/**
	*设置天空盒纹理。
	*/
	/**
	*获取天空盒纹理。
	*/
	__getset(0,__proto,'textureCube',function(){
		return this._shaderValues.getTexture(SkyBoxMaterial.TEXTURECUBE);
		},function(value){
		return this._shaderValues.setTexture(SkyBoxMaterial.TEXTURECUBE,value);
	});

	__static(SkyBoxMaterial,
	['TINTCOLOR',function(){return this.TINTCOLOR=Shader3D.propertyNameToID("u_TintColor");},'EXPOSURE',function(){return this.EXPOSURE=Shader3D.propertyNameToID("u_Exposure");},'ROTATION',function(){return this.ROTATION=Shader3D.propertyNameToID("u_Rotation");},'TEXTURECUBE',function(){return this.TEXTURECUBE=Shader3D.propertyNameToID("u_CubeTexture");},'defaultMaterial',function(){return this.defaultMaterial=new SkyBoxMaterial();}
	]);
	return SkyBoxMaterial;
})(BaseMaterial)


/**

*/
/**
*<code>ShurikenParticleMaterial</code> 类用于实现拖尾材质。
*/
//class laya.d3.core.trail.TrailMaterial extends laya.d3.core.material.BaseMaterial
var TrailMaterial=(function(_super){
	function TrailMaterial(){
		/**@private */
		this._color=null;
		TrailMaterial.__super.call(this);
		this.setShaderName("Trail");
		this._color=new Vector4(1.0,1.0,1.0,1.0);
		this._shaderValues.setVector(TrailMaterial.TINTCOLOR,new Vector4(1.0,1.0,1.0,1.0));
		this.renderMode=0;
	}

	__class(TrailMaterial,'laya.d3.core.trail.TrailMaterial',_super);
	var __proto=TrailMaterial.prototype;
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
		return this._shaderValues.getVector(TrailMaterial.TILINGOFFSET).elements[2];
		},function(z){
		var tilOff=this._shaderValues.getVector(TrailMaterial.TILINGOFFSET);
		tilOff.elements[2]=z;
		this.tilingOffset=tilOff;
	});

	/**
	*设置贴图。
	*@param value 贴图。
	*/
	/**
	*获取贴图。
	*@return 贴图。
	*/
	__getset(0,__proto,'texture',function(){
		return this._shaderValues.getTexture(TrailMaterial.MAINTEXTURE);
		},function(value){
		if (value)
			this._defineDatas.add(laya.d3.core.trail.TrailMaterial.SHADERDEFINE_MAINTEXTURE);
		else
		this._defineDatas.remove(laya.d3.core.trail.TrailMaterial.SHADERDEFINE_MAINTEXTURE);
		this._shaderValues.setTexture(TrailMaterial.MAINTEXTURE,value);
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
		return this._shaderValues.getVector(TrailMaterial.TILINGOFFSET).elements[3];
		},function(w){
		var tilOff=this._shaderValues.getVector(TrailMaterial.TILINGOFFSET);
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
		return this._shaderValues.getVector(TrailMaterial.TILINGOFFSET).elements[1];
		},function(y){
		var tilOff=this._shaderValues.getVector(TrailMaterial.TILINGOFFSET);
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
				this.alphaTest=false;
				renderState.depthWrite=false;
				renderState.cull=/*laya.d3.core.material.RenderState.CULL_NONE*/0;
				renderState.blend=/*laya.d3.core.material.RenderState.BLEND_ENABLE_ALL*/1;
				renderState.srcBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_SRC_ALPHA*/0x0302;
				renderState.dstBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_ONE*/1;
				renderState.depthTest=/*laya.d3.core.material.RenderState.DEPTHTEST_LESS*/0x0201;
				this._defineDatas.add(TrailMaterial.SHADERDEFINE_ADDTIVEFOG);
				break ;
			case 0:
				this.renderQueue=/*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
				this.alphaTest=false;
				renderState.depthWrite=false;
				renderState.cull=/*laya.d3.core.material.RenderState.CULL_NONE*/0;
				renderState.blend=/*laya.d3.core.material.RenderState.BLEND_ENABLE_ALL*/1;
				renderState.srcBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_SRC_ALPHA*/0x0302;
				renderState.dstBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA*/0x0303;
				renderState.depthTest=/*laya.d3.core.material.RenderState.DEPTHTEST_LESS*/0x0201;
				this._defineDatas.remove(TrailMaterial.SHADERDEFINE_ADDTIVEFOG);
				break ;
			default :
				throw new Error("TrailMaterial : renderMode value error.");
			}
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STX',function(){
		return this._shaderValues.getVector(TrailMaterial.TILINGOFFSET).elements[0];
		},function(x){
		var tilOff=this._shaderValues.getVector(TrailMaterial.TILINGOFFSET);
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
		return this._shaderValues.getVector(TrailMaterial.TINTCOLOR);
		},function(value){
		this._shaderValues.setVector(TrailMaterial.TINTCOLOR,value);
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
	*设置纹理平铺和偏移。
	*@param value 纹理平铺和偏移。
	*/
	/**
	*获取纹理平铺和偏移。
	*@return 纹理平铺和偏移。
	*/
	__getset(0,__proto,'tilingOffset',function(){
		return this._shaderValues.getVector(TrailMaterial.TILINGOFFSET);
		},function(value){
		if (value){
			var valueE=value.elements;
			if (valueE[0] !=1 || valueE[1] !=1 || valueE[2] !=0 || valueE[3] !=0)
				this._defineDatas.add(laya.d3.core.trail.TrailMaterial.SHADERDEFINE_TILINGOFFSET);
			else
			this._defineDatas.remove(laya.d3.core.trail.TrailMaterial.SHADERDEFINE_TILINGOFFSET);
			}else {
			this._defineDatas.remove(laya.d3.core.trail.TrailMaterial.SHADERDEFINE_TILINGOFFSET);
		}
		this._shaderValues.setVector(TrailMaterial.TILINGOFFSET,value);
	});

	TrailMaterial.__init__=function(){
		TrailMaterial.SHADERDEFINE_MAINTEXTURE=TrailMaterial.shaderDefines.registerDefine("MAINTEXTURE");
		TrailMaterial.SHADERDEFINE_TILINGOFFSET=TrailMaterial.shaderDefines.registerDefine("TILINGOFFSET");
		TrailMaterial.SHADERDEFINE_ADDTIVEFOG=TrailMaterial.shaderDefines.registerDefine("ADDTIVEFOG");
	}

	TrailMaterial.RENDERMODE_ALPHABLENDED=0;
	TrailMaterial.RENDERMODE_ADDTIVE=1;
	TrailMaterial.SHADERDEFINE_MAINTEXTURE=0;
	TrailMaterial.SHADERDEFINE_TILINGOFFSET=0;
	TrailMaterial.SHADERDEFINE_ADDTIVEFOG=0;
	__static(TrailMaterial,
	['defaultMaterial',function(){return this.defaultMaterial=new TrailMaterial();},'MAINTEXTURE',function(){return this.MAINTEXTURE=Shader3D.propertyNameToID("u_MainTexture");},'TINTCOLOR',function(){return this.TINTCOLOR=Shader3D.propertyNameToID("u_MainColor");},'TILINGOFFSET',function(){return this.TILINGOFFSET=Shader3D.propertyNameToID("u_TilingOffset");},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines(BaseMaterial.shaderDefines);}
	]);
	return TrailMaterial;
})(BaseMaterial)


/**

*/
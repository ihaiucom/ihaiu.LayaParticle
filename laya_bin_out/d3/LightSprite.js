/**
*<code>LightSprite</code> 类用于创建灯光的父类。
*/
//class laya.d3.core.light.LightSprite extends laya.d3.core.Sprite3D
var LightSprite=(function(_super){
	function LightSprite(){
		/**@private */
		this._intensityColor=null;
		/**@private */
		this._intensity=NaN;
		/**@private */
		this._shadow=false;
		/**@private */
		this._shadowFarPlane=0;
		/**@private */
		this._shadowMapSize=0;
		/**@private */
		this._shadowMapCount=0;
		/**@private */
		this._shadowMapPCFType=0;
		/**@private */
		this._parallelSplitShadowMap=null;
		/**@private */
		this._lightmapBakedType=0;
		/**灯光颜色。 */
		this.color=null;
		LightSprite.__super.call(this);
		this._intensity=1.0;
		this._intensityColor=new Vector3();
		this.color=new Vector3(1.0,1.0,1.0);
		this._shadow=false;
		this._shadowFarPlane=8;
		this._shadowMapSize=512;
		this._shadowMapCount=1;
		this._shadowMapPCFType=0;
		this._lightmapBakedType=LightSprite.LIGHTMAPBAKEDTYPE_REALTIME;
	}

	__class(LightSprite,'laya.d3.core.light.LightSprite',_super);
	var __proto=LightSprite.prototype;
	/**
	*@inheritDoc
	*/
	__proto._parse=function(data){
		_super.prototype._parse.call(this,data);
		var colorData=data.color;
		this.color.fromArray(colorData);
		this.intensity=data.intensity;
		this.lightmapBakedType=data.lightmapBakedType;
	}

	/**
	*@inheritDoc
	*/
	__proto._onActive=function(){
		(this.lightmapBakedType!==LightSprite.LIGHTMAPBAKEDTYPE_BAKED)&& ((this._scene)._addLight(this));
	}

	/**
	*@inheritDoc
	*/
	__proto._onInActive=function(){
		(this.lightmapBakedType!==LightSprite.LIGHTMAPBAKEDTYPE_BAKED)&& ((this._scene)._removeLight(this));
	}

	/**
	*更新灯光相关渲染状态参数。
	*@param state 渲染状态参数。
	*/
	__proto._prepareToScene=function(){
		return false;
	}

	/**
	*设置灯光烘培类型。
	*/
	/**
	*获取灯光烘培类型。
	*/
	__getset(0,__proto,'lightmapBakedType',function(){
		return this._lightmapBakedType;
		},function(value){
		if (this._lightmapBakedType!==value){
			this._lightmapBakedType=value;
			if (this.activeInHierarchy){
				if (value!==LightSprite.LIGHTMAPBAKEDTYPE_BAKED)
					(this._scene)._addLight(this);
				else
				(this._scene)._removeLight(this);
			}
		}
	});

	/**
	*设置阴影PCF类型。
	*@param value PCF类型。
	*/
	/**
	*获取阴影PCF类型。
	*@return PCF类型。
	*/
	__getset(0,__proto,'shadowPCFType',function(){
		return this._shadowMapPCFType;
		},function(value){
		this._shadowMapPCFType=value;
		(this._parallelSplitShadowMap)&& (this._parallelSplitShadowMap.setPCFType(value));
	});

	/**
	*设置灯光强度。
	*@param value 灯光强度
	*/
	/**
	*获取灯光强度。
	*@return 灯光强度
	*/
	__getset(0,__proto,'intensity',function(){
		return this._intensity;
		},function(value){
		this._intensity=value;
	});

	/**
	*设置是否产生阴影。
	*@param value 是否产生阴影。
	*/
	/**
	*获取是否产生阴影。
	*@return 是否产生阴影。
	*/
	__getset(0,__proto,'shadow',function(){
		return this._shadow;
		},function(value){
		throw new Error("LightSprite: must override it.");
	});

	/**
	*设置阴影最远范围。
	*@param value 阴影最远范围。
	*/
	/**
	*获取阴影最远范围。
	*@return 阴影最远范围。
	*/
	__getset(0,__proto,'shadowDistance',function(){
		return this._shadowFarPlane;
		},function(value){
		this._shadowFarPlane=value;
		(this._parallelSplitShadowMap)&& (this._parallelSplitShadowMap.setFarDistance(value));
	});

	/**
	*设置阴影分段数。
	*@param value 阴影分段数。
	*/
	/**
	*获取阴影分段数。
	*@return 阴影分段数。
	*/
	__getset(0,__proto,'shadowPSSMCount',function(){
		return this._shadowMapCount;
		},function(value){
		this._shadowMapCount=value;
		(this._parallelSplitShadowMap)&& (this._parallelSplitShadowMap.shadowMapCount=value);
	});

	/**
	*设置阴影贴图尺寸。
	*@param value 阴影贴图尺寸。
	*/
	/**
	*获取阴影贴图尺寸。
	*@return 阴影贴图尺寸。
	*/
	__getset(0,__proto,'shadowResolution',function(){
		return this._shadowMapSize;
		},function(value){
		this._shadowMapSize=value;
		(this._parallelSplitShadowMap)&& (this._parallelSplitShadowMap.setShadowMapTextureSize(value));
	});

	/**
	*设置灯光的漫反射颜色。
	*@param value 灯光的漫反射颜色。
	*/
	/**
	*获取灯光的漫反射颜色。
	*@return 灯光的漫反射颜色。
	*/
	__getset(0,__proto,'diffuseColor',function(){
		console.log("LightSprite: discard property,please use color property instead.");
		return this.color;
		},function(value){
		console.log("LightSprite: discard property,please use color property instead.");
		this.color=value;
	});

	LightSprite.LIGHTMAPBAKEDTYPE_REALTIME=0;
	LightSprite.LIGHTMAPBAKEDTYPE_MIXED=1;
	LightSprite.LIGHTMAPBAKEDTYPE_BAKED=2;
	return LightSprite;
})(Sprite3D)


/**

*/
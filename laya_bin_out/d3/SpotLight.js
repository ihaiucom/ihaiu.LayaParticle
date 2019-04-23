/**
*<code>SpotLight</code> 类用于创建聚光。
*/
//class laya.d3.core.light.SpotLight extends laya.d3.core.light.LightSprite
var SpotLight=(function(_super){
	function SpotLight(){
		/**@private */
		this._direction=null;
		/**@private */
		this._spotAngle=NaN;
		/**@private */
		this._range=NaN;
		SpotLight.__super.call(this);
		this._spotAngle=30.0;
		this._range=10.0;
		this._direction=new Vector3();
	}

	__class(SpotLight,'laya.d3.core.light.SpotLight',_super);
	var __proto=SpotLight.prototype;
	/**
	*@inheritDoc
	*/
	__proto._onActive=function(){
		_super.prototype._onActive.call(this);
		(this._lightmapBakedType!==LightSprite.LIGHTMAPBAKEDTYPE_BAKED)&&((this.scene)._defineDatas.add(Scene3D.SHADERDEFINE_SPOTLIGHT));
	}

	/**
	*@inheritDoc
	*/
	__proto._onInActive=function(){
		_super.prototype._onInActive.call(this);
		(this._lightmapBakedType!==LightSprite.LIGHTMAPBAKEDTYPE_BAKED)&&((this.scene)._defineDatas.remove(Scene3D.SHADERDEFINE_SPOTLIGHT));
	}

	/**
	*更新聚光相关渲染状态参数。
	*@param state 渲染状态参数。
	*/
	__proto._prepareToScene=function(){
		var scene=this._scene;
		if (scene.enableLight && this.activeInHierarchy){
			var defineDatas=scene._defineDatas;
			var shaderValue=scene._shaderValues;
			Vector3.scale(this.color,this._intensity,this._intensityColor);
			shaderValue.setVector(Scene3D.SPOTLIGHTCOLOR,this._intensityColor);
			shaderValue.setVector(Scene3D.SPOTLIGHTPOS,this.transform.position);
			this.transform.worldMatrix.getForward(this._direction);
			Vector3.normalize(this._direction,this._direction);
			shaderValue.setVector(Scene3D.SPOTLIGHTDIRECTION,this._direction);
			shaderValue.setNumber(Scene3D.SPOTLIGHTRANGE,this.range);
			shaderValue.setNumber(Scene3D.SPOTLIGHTSPOTANGLE,this.spotAngle *Math.PI / 180);
			return true;
			}else {
			return false;
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._parse=function(data){
		_super.prototype._parse.call(this,data);
		this.range=data.range;
		this.spotAngle=data.spotAngle;
	}

	/**
	*设置聚光灯的锥形角度。
	*@param value 聚光灯的锥形角度。
	*/
	/**
	*获取聚光灯的锥形角度。
	*@return 聚光灯的锥形角度。
	*/
	__getset(0,__proto,'spotAngle',function(){
		return this._spotAngle;
		},function(value){
		this._spotAngle=Math.max(Math.min(value,180),0);
	});

	/**
	*设置聚光的范围。
	*@param value 聚光的范围值。
	*/
	/**
	*获取聚光的范围。
	*@return 聚光的范围值。
	*/
	__getset(0,__proto,'range',function(){
		return this._range;
		},function(value){
		this._range=value;
	});

	__static(SpotLight,
	['_tempMatrix0',function(){return this._tempMatrix0=new Matrix4x4();},'_tempMatrix1',function(){return this._tempMatrix1=new Matrix4x4();}
	]);
	return SpotLight;
})(LightSprite)


/**

*/
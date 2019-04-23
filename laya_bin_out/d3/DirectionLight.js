/**
*<code>DirectionLight</code> 类用于创建平行光。
*/
//class laya.d3.core.light.DirectionLight extends laya.d3.core.light.LightSprite
var DirectionLight=(function(_super){
	function DirectionLight(){
		/**@private */
		this._direction=null;
		DirectionLight.__super.call(this);
		this._direction=new Vector3();
	}

	__class(DirectionLight,'laya.d3.core.light.DirectionLight',_super);
	var __proto=DirectionLight.prototype;
	/**
	*@private
	*/
	__proto._initShadow=function(){
		if (this._shadow){
			this._parallelSplitShadowMap=new ParallelSplitShadowMap();
			this.scene.parallelSplitShadowMaps.push(this._parallelSplitShadowMap);
			this.transform.worldMatrix.getForward(this._direction);
			Vector3.normalize(this._direction,this._direction);
			this._parallelSplitShadowMap.setInfo(this.scene,this._shadowFarPlane,this._direction,this._shadowMapSize,this._shadowMapCount,this._shadowMapPCFType);
			}else {
			var defineDatas=(this._scene)._defineDatas;
			var parallelSplitShadowMaps=this.scene.parallelSplitShadowMaps;
			parallelSplitShadowMaps.splice(parallelSplitShadowMaps.indexOf(this._parallelSplitShadowMap),1);
			this._parallelSplitShadowMap.disposeAllRenderTarget();
			this._parallelSplitShadowMap=null;
			defineDatas.remove(Scene3D.SHADERDEFINE_SHADOW_PSSM1);
			defineDatas.remove(Scene3D.SHADERDEFINE_SHADOW_PSSM2);
			defineDatas.remove(Scene3D.SHADERDEFINE_SHADOW_PSSM3);
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._onActive=function(){
		_super.prototype._onActive.call(this);
		this._shadow && (this._initShadow());
		(this._lightmapBakedType!==LightSprite.LIGHTMAPBAKEDTYPE_BAKED)&&((this._scene)._defineDatas.add(Scene3D.SHADERDEFINE_DIRECTIONLIGHT));
	}

	/**
	*@inheritDoc
	*/
	__proto._onInActive=function(){
		_super.prototype._onInActive.call(this);
		(this._lightmapBakedType!==LightSprite.LIGHTMAPBAKEDTYPE_BAKED)&&((this._scene)._defineDatas.remove(Scene3D.SHADERDEFINE_DIRECTIONLIGHT));
	}

	/**
	*更新平行光相关渲染状态参数。
	*@param state 渲染状态参数。
	*/
	__proto._prepareToScene=function(){
		var scene=this._scene;
		if (scene.enableLight && this.activeInHierarchy){
			var defineDatas=scene._defineDatas;
			var shaderValue=scene._shaderValues;
			Vector3.scale(this.color,this._intensity,this._intensityColor);
			shaderValue.setVector(Scene3D.LIGHTDIRCOLOR,this._intensityColor);
			this.transform.worldMatrix.getForward(this._direction);
			Vector3.normalize(this._direction,this._direction);
			shaderValue.setVector(Scene3D.LIGHTDIRECTION,this._direction);
			return true;
			}else {
			return false;
		}
	}

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'shadow',_super.prototype._$get_shadow,function(value){
		if (this._shadow!==value){
			this._shadow=value;
			(this.scene)&& (this._initShadow());
		}
	});

	return DirectionLight;
})(LightSprite)


/**

*/
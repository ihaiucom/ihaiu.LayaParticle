/**
*<code>PointLight</code> 类用于创建点光。
*/
//class laya.d3.core.light.PointLight extends laya.d3.core.light.LightSprite
var PointLight=(function(_super){
	function PointLight(){
		/**@private */
		this._range=NaN;
		this._lightMatrix=new Matrix4x4();
		PointLight.__super.call(this);
		this._range=6.0;
	}

	__class(PointLight,'laya.d3.core.light.PointLight',_super);
	var __proto=PointLight.prototype;
	/**
	*@inheritDoc
	*/
	__proto._onActive=function(){
		_super.prototype._onActive.call(this);
		(this._lightmapBakedType!==LightSprite.LIGHTMAPBAKEDTYPE_BAKED)&&((this._scene)._defineDatas.add(Scene3D.SHADERDEFINE_POINTLIGHT));
	}

	/**
	*@inheritDoc
	*/
	__proto._onInActive=function(){
		_super.prototype._onInActive.call(this);
		(this._lightmapBakedType!==LightSprite.LIGHTMAPBAKEDTYPE_BAKED)&&((this._scene)._defineDatas.remove(Scene3D.SHADERDEFINE_POINTLIGHT));
	}

	/**
	*更新点光相关渲染状态参数。
	*@param state 渲染状态参数。
	*/
	__proto._prepareToScene=function(){
		var scene=this._scene;
		if (scene.enableLight && this.activeInHierarchy){
			var defineDatas=scene._defineDatas;
			var shaderValue=scene._shaderValues;
			Vector3.scale(this.color,this._intensity,this._intensityColor);
			shaderValue.setVector(Scene3D.POINTLIGHTCOLOR,this._intensityColor);
			shaderValue.setVector(Scene3D.POINTLIGHTPOS,this.transform.position);
			shaderValue.setNumber(Scene3D.POINTLIGHTRANGE,this.range);
			var lightMatrix=this._lightMatrix;
			var lightMatrixE=lightMatrix.elements;
			lightMatrix.identity();
			lightMatrixE[0]=lightMatrixE[5]=lightMatrixE[10]=1.0 / this._range;
			var toLightMatrix=PointLight._tempMatrix0;
			this.transform.worldMatrix.invert(toLightMatrix);
			Matrix4x4.multiply(lightMatrix,toLightMatrix,lightMatrix);
			shaderValue.setMatrix4x4(Scene3D.POINTLIGHTMATRIX,lightMatrix);
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
	}

	/**
	*设置点光的范围。
	*@param value 点光的范围。
	*/
	/**
	*获取点光的范围。
	*@return 点光的范围。
	*/
	__getset(0,__proto,'range',function(){
		return this._range;
		},function(value){
		this._range=value;
	});

	__static(PointLight,
	['_tempMatrix0',function(){return this._tempMatrix0=new Matrix4x4();}
	]);
	return PointLight;
})(LightSprite)


/**

*/
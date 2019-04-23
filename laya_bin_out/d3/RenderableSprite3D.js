/**
*<code>RenderableSprite3D</code> 类用于可渲染3D精灵的父类，抽象类不允许实例。
*/
//class laya.d3.core.RenderableSprite3D extends laya.d3.core.Sprite3D
var RenderableSprite3D=(function(_super){
	function RenderableSprite3D(name){
		this.pickColor=null;
		/**@private */
		this._render=null;
		RenderableSprite3D.__super.call(this,name);
	}

	__class(RenderableSprite3D,'laya.d3.core.RenderableSprite3D',_super);
	var __proto=RenderableSprite3D.prototype;
	/**
	*@inheritDoc
	*/
	__proto._onInActive=function(){
		var scene3D=this._scene;
		scene3D._removeRenderObject(this._render);
		(this._render.castShadow)&& (scene3D._removeShadowCastRenderObject(this._render));
	}

	/**
	*@inheritDoc
	*/
	__proto._onActive=function(){
		laya.display.Node.prototype._onActive.call(this);
		var scene3D=this._scene;
		scene3D._addRenderObject(this._render);
		(this._render.castShadow)&& (scene3D._addShadowCastRenderObject(this._render));
	}

	/**
	*@inheritDoc
	*/
	__proto._onActiveInScene=function(){
		laya.display.Node.prototype._onActiveInScene.call(this);
		if (Laya3D._editerEnvironment){
			var scene=this._scene;
			var pickColor=new Vector4();
			scene._allotPickColorByID(this.id,pickColor);
			scene._pickIdToSprite[this.id]=this;
			this._render._shaderValues.setVector(laya.d3.core.RenderableSprite3D.PICKCOLOR,pickColor);
		}
	}

	/**
	*@private
	*/
	__proto._addToInitStaticBatchManager=function(){}
	/**
	*@inheritDoc
	*/
	__proto._setBelongScene=function(scene){
		laya.display.Node.prototype._setBelongScene.call(this,scene);
		this._render._setBelongScene(scene);
	}

	/**
	*@inheritDoc
	*/
	__proto._setUnBelongScene=function(){
		this._render._defineDatas.remove(laya.d3.core.RenderableSprite3D.SAHDERDEFINE_LIGHTMAP);
		laya.display.Node.prototype._setUnBelongScene.call(this);
	}

	/**
	*@inheritDoc
	*/
	__proto._changeHierarchyAnimator=function(animator){
		if (this._hierarchyAnimator){
			var renderableSprites=this._hierarchyAnimator._renderableSprites;
			renderableSprites.splice(renderableSprites.indexOf(this),1);
		}
		if (animator)
			animator._renderableSprites.push(this);
		_super.prototype._changeHierarchyAnimator.call(this,animator);
	}

	/**
	*@inheritDoc
	*/
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._render._destroy();
		this._render=null;
	}

	RenderableSprite3D.__init__=function(){
		RenderableSprite3D.SHADERDEFINE_RECEIVE_SHADOW=RenderableSprite3D.shaderDefines.registerDefine("RECEIVESHADOW");
		RenderableSprite3D.SHADERDEFINE_SCALEOFFSETLIGHTINGMAPUV=RenderableSprite3D.shaderDefines.registerDefine("SCALEOFFSETLIGHTINGMAPUV");
		RenderableSprite3D.SAHDERDEFINE_LIGHTMAP=RenderableSprite3D.shaderDefines.registerDefine("LIGHTMAP");
	}

	RenderableSprite3D.SHADERDEFINE_RECEIVE_SHADOW=0;
	RenderableSprite3D.SHADERDEFINE_SCALEOFFSETLIGHTINGMAPUV=0;
	RenderableSprite3D.SAHDERDEFINE_LIGHTMAP=0;
	__static(RenderableSprite3D,
	['LIGHTMAPSCALEOFFSET',function(){return this.LIGHTMAPSCALEOFFSET=Shader3D.propertyNameToID("u_LightmapScaleOffset");},'LIGHTMAP',function(){return this.LIGHTMAP=Shader3D.propertyNameToID("u_LightMap");},'PICKCOLOR',function(){return this.PICKCOLOR=Shader3D.propertyNameToID("u_PickColor");},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines();}
	]);
	return RenderableSprite3D;
})(Sprite3D)


/**

*/
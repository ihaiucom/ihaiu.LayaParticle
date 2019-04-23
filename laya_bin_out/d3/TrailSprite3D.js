/**
*<code>TrailSprite3D</code> 类用于创建拖尾渲染精灵。
*/
//class laya.d3.core.trail.TrailSprite3D extends laya.d3.core.RenderableSprite3D
var TrailSprite3D=(function(_super){
	function TrailSprite3D(){
		/**@private */
		//this._geometryFilter=null;
		TrailSprite3D.__super.call(this,this.name);
		this._render=new TrailRenderer(this);
		this._geometryFilter=new TrailFilter(this);
	}

	__class(TrailSprite3D,'laya.d3.core.trail.TrailSprite3D',_super);
	var __proto=TrailSprite3D.prototype;
	/**
	*@inheritDoc
	*/
	__proto._parse=function(data){
		laya.d3.core.Sprite3D.prototype._parse.call(this,data);
		var render=this._render;
		var filter=this._geometryFilter;
		var i=0,j=0;
		var materials=data.materials;
		if (materials){
			var sharedMaterials=render.sharedMaterials;
			var materialCount=materials.length;
			sharedMaterials.length=materialCount;
			for (i=0;i < materialCount;i++)
			sharedMaterials[i]=Loader.getRes(materials[i].path);
			render.sharedMaterials=sharedMaterials;
		}
		filter.time=data.time;
		filter.minVertexDistance=data.minVertexDistance;
		filter.widthMultiplier=data.widthMultiplier;
		filter.textureMode=data.textureMode;
		(data.alignment !=null)&& (filter.alignment=data.alignment);
		var widthCurve=[];
		var widthCurveData=data.widthCurve;
		for (i=0,j=widthCurveData.length;i < j;i++){
			var trailkeyframe=new FloatKeyframe();
			trailkeyframe.time=widthCurveData[i].time;
			trailkeyframe.inTangent=widthCurveData[i].inTangent;
			trailkeyframe.outTangent=widthCurveData[i].outTangent;
			trailkeyframe.value=widthCurveData[i].value;
			widthCurve.push(trailkeyframe);
		}
		filter.widthCurve=widthCurve;
		var colorGradientData=data.colorGradient;
		var colorKeys=colorGradientData.colorKeys;
		var alphaKeys=colorGradientData.alphaKeys;
		var colorGradient=new Gradient(colorKeys.length,alphaKeys.length);
		colorGradient.mode=colorGradientData.mode;
		for (i=0,j=colorKeys.length;i < j;i++){
			var colorKey=colorKeys[i];
			colorGradient.addColorRGB(colorKey.time,new Color(colorKey.value[0],colorKey.value[1],colorKey.value[2],1.0));
		}
		for (i=0,j=alphaKeys.length;i < j;i++){
			var alphaKey=alphaKeys[i];
			colorGradient.addColorAlpha(alphaKey.time,alphaKey.value);
		}
		filter.colorGradient=colorGradient;
	}

	/**
	*@inheritDoc
	*/
	__proto._onActive=function(){
		_super.prototype._onActive.call(this);
		this._transform.position.cloneTo(this._geometryFilter._lastPosition);
	}

	/**
	*@inheritDoc
	*/
	__proto.cloneTo=function(destObject){
		laya.d3.core.Sprite3D.prototype.cloneTo.call(this,destObject);
		var i=0,j=0;
		var destTrailSprite3D=destObject;
		var destTrailFilter=destTrailSprite3D.trailFilter;
		destTrailFilter.time=this.trailFilter.time;
		destTrailFilter.minVertexDistance=this.trailFilter.minVertexDistance;
		destTrailFilter.widthMultiplier=this.trailFilter.widthMultiplier;
		destTrailFilter.textureMode=this.trailFilter.textureMode;
		var widthCurveData=this.trailFilter.widthCurve;
		var widthCurve=[];
		for (i=0,j=widthCurveData.length;i < j;i++){
			var keyFrame=new FloatKeyframe();
			widthCurveData[i].cloneTo(keyFrame);
			widthCurve.push(keyFrame);
		}
		destTrailFilter.widthCurve=widthCurve;
		var destColorGradient=new Gradient(this.trailFilter.colorGradient.maxColorRGBKeysCount,this.trailFilter.colorGradient.maxColorAlphaKeysCount);
		this.trailFilter.colorGradient.cloneTo(destColorGradient);
		destTrailFilter.colorGradient=destColorGradient;
		var destTrailRender=destTrailSprite3D.trailRenderer;
		destTrailRender.sharedMaterial=this.trailRenderer.sharedMaterial;
	}

	/**
	*<p>销毁此对象。</p>
	*@param destroyChild 是否同时销毁子节点，若值为true,则销毁子节点，否则不销毁子节点。
	*/
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		if (this.destroyed)
			return;
		_super.prototype.destroy.call(this,destroyChild);
		(this._geometryFilter).destroy();
		this._geometryFilter=null;
	}

	/**
	*获取Trail过滤器。
	*@return Trail过滤器。
	*/
	__getset(0,__proto,'trailFilter',function(){
		return this._geometryFilter;
	});

	/**
	*获取Trail渲染器。
	*@return Trail渲染器。
	*/
	__getset(0,__proto,'trailRenderer',function(){
		return this._render;
	});

	TrailSprite3D.__init__=function(){
		TrailSprite3D.SHADERDEFINE_GRADIENTMODE_BLEND=TrailSprite3D.shaderDefines.registerDefine("GRADIENTMODE_BLEND");
	}

	TrailSprite3D.SHADERDEFINE_GRADIENTMODE_BLEND=0;
	__static(TrailSprite3D,
	['CURTIME',function(){return this.CURTIME=Shader3D.propertyNameToID("u_CurTime");},'LIFETIME',function(){return this.LIFETIME=Shader3D.propertyNameToID("u_LifeTime");},'WIDTHCURVE',function(){return this.WIDTHCURVE=Shader3D.propertyNameToID("u_WidthCurve");},'WIDTHCURVEKEYLENGTH',function(){return this.WIDTHCURVEKEYLENGTH=Shader3D.propertyNameToID("u_WidthCurveKeyLength");},'GRADIENTCOLORKEY',function(){return this.GRADIENTCOLORKEY=Shader3D.propertyNameToID("u_GradientColorkey");},'GRADIENTALPHAKEY',function(){return this.GRADIENTALPHAKEY=Shader3D.propertyNameToID("u_GradientAlphakey");},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines(RenderableSprite3D.shaderDefines);}
	]);
	return TrailSprite3D;
})(RenderableSprite3D)


/**

*/
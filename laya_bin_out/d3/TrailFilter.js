/**
*<code>TrailFilter</code> 类用于创建拖尾过滤器。
*/
//class laya.d3.core.trail.TrailFilter
var TrailFilter=(function(){
	function TrailFilter(owner){
		/**@private */
		this._minVertexDistance=NaN;
		/**@private */
		this._widthMultiplier=NaN;
		/**@private */
		this._time=NaN;
		/**@private */
		this._widthCurve=null;
		/**@private */
		this._colorGradient=null;
		/**@private */
		this._textureMode=0;
		/**@private */
		this._trialGeometry=null;
		/**@private 拖尾总长度*/
		this._totalLength=0;
		this._owner=null;
		this._curtime=0;
		this._trailRenderElementIndex=0;
		this._lastPosition=new Vector3();
		this.alignment=0;
		this._owner=owner;
		this._initDefaultData();
		this.addRenderElement();
	}

	__class(TrailFilter,'laya.d3.core.trail.TrailFilter');
	var __proto=TrailFilter.prototype;
	/**
	*@private
	*/
	__proto.addRenderElement=function(){
		var render=this._owner._render;
		var elements=render._renderElements;
		var material=render.sharedMaterials [0];
		(material)|| (material=TrailMaterial.defaultMaterial);
		var element=new RenderElement();
		element.setTransform(this._owner._transform);
		element.render=render;
		element.material=material;
		this._trialGeometry=new TrailGeometry(this);
		element.setGeometry(this._trialGeometry);
		elements.push(element);
	}

	/**
	*@private
	*/
	__proto._update=function(state){
		var render=this._owner._render;
		this._curtime+=(state.scene).timer._delta / 1000;
		render._shaderValues.setNumber(TrailSprite3D.CURTIME,this._curtime);
		var curPos=this._owner.transform.position;
		var element=render._renderElements[0] ._geometry;
		element._updateDisappear();
		element._updateTrail(state.camera,this._lastPosition,curPos);
		element._updateVertexBufferUV();
		curPos.cloneTo(this._lastPosition);
	}

	/**
	*@private
	*/
	__proto._initDefaultData=function(){
		this.time=5.0;
		this.minVertexDistance=0.1;
		this.widthMultiplier=1;
		this.textureMode=/*laya.d3.core.TextureMode.Stretch*/0;
		var widthKeyFrames=[];
		var widthKeyFrame1=new FloatKeyframe();
		widthKeyFrame1.time=0;
		widthKeyFrame1.inTangent=0;
		widthKeyFrame1.outTangent=0;
		widthKeyFrame1.value=1;
		widthKeyFrames.push(widthKeyFrame1);
		var widthKeyFrame2=new FloatKeyframe();
		widthKeyFrame2.time=1;
		widthKeyFrame2.inTangent=0;
		widthKeyFrame2.outTangent=0;
		widthKeyFrame2.value=1;
		widthKeyFrames.push(widthKeyFrame2);
		this.widthCurve=widthKeyFrames;
		var gradient=new Gradient(2,2);
		gradient.mode=/*laya.d3.core.GradientMode.Blend*/0;
		gradient.addColorRGB(0,Color.WHITE);
		gradient.addColorRGB(1,Color.WHITE);
		gradient.addColorAlpha(0,1);
		gradient.addColorAlpha(1,1);
		this.colorGradient=gradient;
	}

	/**
	*@private
	*/
	__proto.destroy=function(){
		this._trialGeometry.destroy();
		this._trialGeometry=null;
		this._widthCurve=null;
		this._colorGradient=null;
	}

	/**
	*设置宽度倍数。
	*@param value 宽度倍数。
	*/
	/**
	*获取宽度倍数。
	*@return 宽度倍数。
	*/
	__getset(0,__proto,'widthMultiplier',function(){
		return this._widthMultiplier;
		},function(value){
		this._widthMultiplier=value;
	});

	/**
	*设置淡出时间。
	*@param value 淡出时间。
	*/
	/**
	*获取淡出时间。
	*@return 淡出时间。
	*/
	__getset(0,__proto,'time',function(){
		return this._time;
		},function(value){
		this._time=value;
		this._owner._render._shaderValues.setNumber(TrailSprite3D.LIFETIME,value);
	});

	/**
	*设置宽度曲线。
	*@param value 宽度曲线。
	*/
	/**
	*获取宽度曲线。
	*@return 宽度曲线。
	*/
	__getset(0,__proto,'widthCurve',function(){
		return this._widthCurve;
		},function(value){
		this._widthCurve=value;
		var widthCurveFloatArray=new Float32Array(value.length *4);
		var i=0,j=0,index=0;
		for (i=0,j=value.length;i < j;i++){
			widthCurveFloatArray[index++]=value[i].time;
			widthCurveFloatArray[index++]=value[i].inTangent;
			widthCurveFloatArray[index++]=value[i].outTangent;
			widthCurveFloatArray[index++]=value[i].value;
		}
		this._owner._render._shaderValues.setBuffer(TrailSprite3D.WIDTHCURVE,widthCurveFloatArray);
		this._owner._render._shaderValues.setInt(TrailSprite3D.WIDTHCURVEKEYLENGTH,value.length);
	});

	/**
	*设置新旧顶点之间最小距离。
	*@param value 新旧顶点之间最小距离。
	*/
	/**
	*获取新旧顶点之间最小距离。
	*@return 新旧顶点之间最小距离。
	*/
	__getset(0,__proto,'minVertexDistance',function(){
		return this._minVertexDistance;
		},function(value){
		this._minVertexDistance=value;
	});

	/**
	*设置颜色梯度。
	*@param value 颜色梯度。
	*/
	/**
	*获取颜色梯度。
	*@return 颜色梯度。
	*/
	__getset(0,__proto,'colorGradient',function(){
		return this._colorGradient;
		},function(value){
		this._colorGradient=value;
		this._owner._render._shaderValues.setBuffer(TrailSprite3D.GRADIENTCOLORKEY,value._rgbElements);
		this._owner._render._shaderValues.setBuffer(TrailSprite3D.GRADIENTALPHAKEY,value._alphaElements);
		if (value.mode==/*laya.d3.core.GradientMode.Blend*/0){
			this._owner._render._defineDatas.add(TrailSprite3D.SHADERDEFINE_GRADIENTMODE_BLEND);
			}else {
			this._owner._render._defineDatas.remove(TrailSprite3D.SHADERDEFINE_GRADIENTMODE_BLEND);
		}
	});

	/**
	*设置纹理模式。
	*@param value 纹理模式。
	*/
	/**
	*获取纹理模式。
	*@return 纹理模式。
	*/
	__getset(0,__proto,'textureMode',function(){
		return this._textureMode;
		},function(value){
		this._textureMode=value;
	});

	TrailFilter.ALIGNMENT_VIEW=0;
	TrailFilter.ALIGNMENT_TRANSFORM_Z=1;
	return TrailFilter;
})()


/**

*/
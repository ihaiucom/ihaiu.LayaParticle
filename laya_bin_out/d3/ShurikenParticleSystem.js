/**
*<code>ShurikenParticleSystem</code> 类用于创建3D粒子数据模板。
*/
//class laya.d3.core.particleShuriKen.ShurikenParticleSystem extends laya.d3.core.GeometryElement
var ShurikenParticleSystem=(function(_super){
	function ShurikenParticleSystem(owner){
		/**@private */
		//this._boundingSphere=null;
		/**@private */
		//this._boundingBox=null;
		/**@private */
		//this._boundingBoxCorners=null;
		/**@private */
		//this._owner=null;
		/**@private */
		//this._ownerRender=null;
		/**@private */
		//this._vertices=null;
		/**@private */
		//this._floatCountPerVertex=0;
		/**@private */
		//this._startLifeTimeIndex=0;
		/**@private */
		//this._timeIndex=0;
		/**@private */
		//this._simulateUpdate=false;
		/**@private */
		//this._firstActiveElement=0;
		/**@private */
		//this._firstNewElement=0;
		/**@private */
		//this._firstFreeElement=0;
		/**@private */
		//this._firstRetiredElement=0;
		/**@private */
		//this._drawCounter=0;
		/**@private */
		//this._bufferMaxParticles=0;
		/**@private */
		//this._emission=null;
		/**@private */
		//this._shape=null;
		/**@private */
		//this._isEmitting=false;
		/**@private */
		//this._isPlaying=false;
		/**@private */
		//this._isPaused=false;
		/**@private */
		//this._playStartDelay=NaN;
		/**@private 发射的累计时间。*/
		//this._frameRateTime=NaN;
		/**@private 一次循环内的累计时间。*/
		//this._emissionTime=NaN;
		/**@private */
		//this._totalDelayTime=NaN;
		/**@private */
		//this._burstsIndex=0;
		/**@private */
		//this._velocityOverLifetime=null;
		/**@private */
		//this._colorOverLifetime=null;
		/**@private */
		//this._sizeOverLifetime=null;
		/**@private */
		//this._rotationOverLifetime=null;
		/**@private */
		//this._textureSheetAnimation=null;
		/**@private */
		//this._startLifetimeType=0;
		/**@private */
		//this._startLifetimeConstant=NaN;
		/**@private */
		//this._startLifeTimeGradient=null;
		/**@private */
		//this._startLifetimeConstantMin=NaN;
		/**@private */
		//this._startLifetimeConstantMax=NaN;
		/**@private */
		//this._startLifeTimeGradientMin=null;
		/**@private */
		//this._startLifeTimeGradientMax=null;
		/**@private */
		//this._maxStartLifetime=NaN;
		/**@private */
		//this._vertexStride=0;
		/**@private */
		//this._indexStride=0;
		/**@private */
		//this._vertexBuffer=null;
		/**@private */
		//this._indexBuffer=null;
		/**@private */
		//this._currentTime=NaN;
		/**@private */
		//this._startUpdateLoopCount=0;
		/**@private */
		//this._rand=null;
		/**@private */
		//this._randomSeeds=null;
		/**粒子运行的总时长，单位为秒。*/
		//this.duration=NaN;
		/**是否循环。*/
		//this.looping=false;
		/**是否预热。暂不支持*/
		//this.prewarm=false;
		/**开始延迟类型，0为常量模式,1为随机随机双常量模式，不能和prewarm一起使用。*/
		//this.startDelayType=0;
		/**开始播放延迟，不能和prewarm一起使用。*/
		//this.startDelay=NaN;
		/**开始播放最小延迟，不能和prewarm一起使用。*/
		//this.startDelayMin=NaN;
		/**开始播放最大延迟，不能和prewarm一起使用。*/
		//this.startDelayMax=NaN;
		/**开始速度模式，0为恒定速度，2为两个恒定速度的随机插值。缺少1、3模式*/
		//this.startSpeedType=0;
		/**开始速度,0模式。*/
		//this.startSpeedConstant=NaN;
		/**最小开始速度,1模式。*/
		//this.startSpeedConstantMin=NaN;
		/**最大开始速度,1模式。*/
		//this.startSpeedConstantMax=NaN;
		/**开始尺寸是否为3D模式。*/
		//this.threeDStartSize=false;
		/**开始尺寸模式,0为恒定尺寸，2为两个恒定尺寸的随机插值。缺少1、3模式和对应的二种3D模式*/
		//this.startSizeType=0;
		/**开始尺寸，0模式。*/
		//this.startSizeConstant=NaN;
		/**开始三维尺寸，0模式。*/
		//this.startSizeConstantSeparate=null;
		/**最小开始尺寸，2模式。*/
		//this.startSizeConstantMin=NaN;
		/**最大开始尺寸，2模式。*/
		//this.startSizeConstantMax=NaN;
		/**最小三维开始尺寸，2模式。*/
		//this.startSizeConstantMinSeparate=null;
		/**最大三维开始尺寸，2模式。*/
		//this.startSizeConstantMaxSeparate=null;
		/**3D开始旋转，暂不支持*/
		//this.threeDStartRotation=false;
		/**开始旋转模式,0为恒定尺寸，2为两个恒定旋转的随机插值,缺少2种模式,和对应的四种3D模式。*/
		//this.startRotationType=0;
		/**开始旋转，0模式。*/
		//this.startRotationConstant=NaN;
		/**开始三维旋转，0模式。*/
		//this.startRotationConstantSeparate=null;
		/**最小开始旋转，1模式。*/
		//this.startRotationConstantMin=NaN;
		/**最大开始旋转，1模式。*/
		//this.startRotationConstantMax=NaN;
		/**最小开始三维旋转，1模式。*/
		//this.startRotationConstantMinSeparate=null;
		/**最大开始三维旋转，1模式。*/
		//this.startRotationConstantMaxSeparate=null;
		/**随机旋转方向，范围为0.0到1.0*/
		//this.randomizeRotationDirection=NaN;
		/**开始颜色模式，0为恒定颜色，2为两个恒定颜色的随机插值,缺少2种模式。*/
		//this.startColorType=0;
		/**开始颜色，0模式。*/
		//this.startColorConstant=null;
		/**最小开始颜色，1模式。*/
		//this.startColorConstantMin=null;
		/**最大开始颜色，1模式。*/
		//this.startColorConstantMax=null;
		/**重力敏感度。*/
		//this.gravityModifier=NaN;
		/**模拟器空间,0为World,1为Local。暂不支持Custom。*/
		//this.simulationSpace=0;
		/**缩放模式，0为Hiercachy,1为Local,2为World。*/
		//this.scaleMode=0;
		/**激活时是否自动播放。*/
		//this.playOnAwake=false;
		/**随机种子,注:play()前设置有效。*/
		//this.randomSeed=null;
		/**是否使用随机种子。 */
		//this.autoRandomSeed=false;
		/**是否为性能模式,性能模式下会延迟粒子释放。*/
		//this.isPerformanceMode=false;
		ShurikenParticleSystem.__super.call(this);
		this._tempRotationMatrix=new Matrix4x4();
		this._uvLength=new Vector2();
		this._bufferState=new BufferState();
		this._firstActiveElement=0;
		this._firstNewElement=0;
		this._firstFreeElement=0;
		this._firstRetiredElement=0;
		this._owner=owner;
		this._ownerRender=owner.particleRenderer;
		this._boundingBoxCorners=__newvec(8,null);
		this._boundingSphere=new BoundSphere(new Vector3(),Number.MAX_VALUE);
		this._boundingBox=new BoundBox(new Vector3(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE),new Vector3(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE));
		this._currentTime=0;
		this._isEmitting=false;
		this._isPlaying=false;
		this._isPaused=false;
		this._burstsIndex=0;
		this._frameRateTime=0;
		this._emissionTime=0;
		this._totalDelayTime=0;
		this._simulateUpdate=false;
		this._bufferMaxParticles=1;
		this.duration=5.0;
		this.looping=true;
		this.prewarm=false;
		this.startDelayType=0;
		this.startDelay=0.0;
		this.startDelayMin=0.0;
		this.startDelayMax=0.0;
		this._startLifetimeType=0;
		this._startLifetimeConstant=5.0;
		this._startLifeTimeGradient=new GradientDataNumber();
		this._startLifetimeConstantMin=0.0;
		this._startLifetimeConstantMax=5.0;
		this._startLifeTimeGradientMin=new GradientDataNumber();
		this._startLifeTimeGradientMax=new GradientDataNumber();
		this._maxStartLifetime=5.0;
		this.startSpeedType=0;
		this.startSpeedConstant=5.0;
		this.startSpeedConstantMin=0.0;
		this.startSpeedConstantMax=5.0;
		this.threeDStartSize=false;
		this.startSizeType=0;
		this.startSizeConstant=1;
		this.startSizeConstantSeparate=new Vector3(1,1,1);
		this.startSizeConstantMin=0;
		this.startSizeConstantMax=1;
		this.startSizeConstantMinSeparate=new Vector3(0,0,0);
		this.startSizeConstantMaxSeparate=new Vector3(1,1,1);
		this.threeDStartRotation=false;
		this.startRotationType=0;
		this.startRotationConstant=0;
		this.startRotationConstantSeparate=new Vector3(0,0,0);
		this.startRotationConstantMin=0.0;
		this.startRotationConstantMax=0.0;
		this.startRotationConstantMinSeparate=new Vector3(0,0,0);
		this.startRotationConstantMaxSeparate=new Vector3(0,0,0);
		this.randomizeRotationDirection=0.0;
		this.startColorType=0;
		this.startColorConstant=new Vector4(1,1,1,1);
		this.startColorConstantMin=new Vector4(1,1,1,1);
		this.startColorConstantMax=new Vector4(1,1,1,1);
		this.gravityModifier=0.0;
		this.simulationSpace=1;
		this.scaleMode=0;
		this.playOnAwake=true;
		this._rand=new Rand(0);
		this.autoRandomSeed=true;
		this.randomSeed=new Uint32Array(1);
		this._randomSeeds=new Uint32Array(ShurikenParticleSystem._RANDOMOFFSET.length);
		this.isPerformanceMode=true;
		this._emission=new Emission();
		this._emission.enbale=true;
	}

	__class(ShurikenParticleSystem,'laya.d3.core.particleShuriKen.ShurikenParticleSystem',_super);
	var __proto=ShurikenParticleSystem.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	__proto._getVertexBuffer=function(index){
		(index===void 0)&& (index=0);
		if (index===0)
			return this._vertexBuffer;
		else
		return null;
	}

	__proto._getIndexBuffer=function(){
		return this._indexBuffer;
	}

	/**
	*@private
	*/
	__proto._generateBoundingSphere=function(){
		var centerE=this._boundingSphere.center.elements;
		centerE[0]=0;
		centerE[1]=0;
		centerE[2]=0;
		this._boundingSphere.radius=Number.MAX_VALUE;
	}

	/**
	*@private
	*/
	__proto._generateBoundingBox=function(){
		var particle=this._owner;
		var particleRender=particle.particleRenderer;
		var boundMin=this._boundingBox.min;
		var boundMax=this._boundingBox.max;
		var i=0,n=0;
		var maxStartLifeTime=NaN;
		switch (this.startLifetimeType){
			case 0:
				maxStartLifeTime=this.startLifetimeConstant;
				break ;
			case 1:
				maxStartLifeTime=-Number.MAX_VALUE;
				var startLifeTimeGradient=startLifeTimeGradient;
				for (i=0,n=startLifeTimeGradient.gradientCount;i < n;i++)
				maxStartLifeTime=Math.max(maxStartLifeTime,startLifeTimeGradient.getValueByIndex(i));
				break ;
			case 2:
				maxStartLifeTime=Math.max(this.startLifetimeConstantMin,this.startLifetimeConstantMax);
				break ;
			case 3:
				maxStartLifeTime=-Number.MAX_VALUE;
				var startLifeTimeGradientMin=startLifeTimeGradientMin;
				for (i=0,n=startLifeTimeGradientMin.gradientCount;i < n;i++)
				maxStartLifeTime=Math.max(maxStartLifeTime,startLifeTimeGradientMin.getValueByIndex(i));
				var startLifeTimeGradientMax=startLifeTimeGradientMax;
				for (i=0,n=startLifeTimeGradientMax.gradientCount;i < n;i++)
				maxStartLifeTime=Math.max(maxStartLifeTime,startLifeTimeGradientMax.getValueByIndex(i));
				break ;
			};
		var minStartSpeed=NaN,maxStartSpeed=NaN;
		switch (this.startSpeedType){
			case 0:
				minStartSpeed=maxStartSpeed=this.startSpeedConstant;
				break ;
			case 1:
				break ;
			case 2:
				minStartSpeed=this.startLifetimeConstantMin;
				maxStartSpeed=this.startLifetimeConstantMax;
				break ;
			case 3:
				break ;
			};
		var minPosition,maxPosition,minDirection,maxDirection;
		if (this._shape && this._shape.enable){
			}else {
			minPosition=maxPosition=Vector3.ZERO;
			minDirection=Vector3.ZERO;
			maxDirection=Vector3.UnitZ;
		};
		var startMinVelocity=new Vector3(minDirection.x *minStartSpeed,minDirection.y *minStartSpeed,minDirection.z *minStartSpeed);
		var startMaxVelocity=new Vector3(maxDirection.x *maxStartSpeed,maxDirection.y *maxStartSpeed,maxDirection.z *maxStartSpeed);
		if (this._velocityOverLifetime && this._velocityOverLifetime.enbale){
			var lifeMinVelocity;
			var lifeMaxVelocity;
			var velocity=this._velocityOverLifetime.velocity;
			switch (velocity.type){
				case 0:
					lifeMinVelocity=lifeMaxVelocity=velocity.constant;
					break ;
				case 1:
					lifeMinVelocity=lifeMaxVelocity=new Vector3(velocity.gradientX.getAverageValue(),velocity.gradientY.getAverageValue(),velocity.gradientZ.getAverageValue());
					break ;
				case 2:
					lifeMinVelocity=velocity.constantMin;
					lifeMaxVelocity=velocity.constantMax;
					break ;
				case 3:
					lifeMinVelocity=new Vector3(velocity.gradientXMin.getAverageValue(),velocity.gradientYMin.getAverageValue(),velocity.gradientZMin.getAverageValue());
					lifeMaxVelocity=new Vector3(velocity.gradientXMax.getAverageValue(),velocity.gradientYMax.getAverageValue(),velocity.gradientZMax.getAverageValue());
					break ;
				}
		};
		var positionScale,velocityScale;
		var transform=this._owner.transform;
		var worldPosition=transform.position;
		var sizeScale=ShurikenParticleSystem._tempVector39;
		var sizeScaleE=sizeScale.elements;
		var renderMode=particleRender.renderMode;
		switch (this.scaleMode){
			case 0:;
				var scale=transform.scale;
				positionScale=scale;
				sizeScaleE[0]=scale.x;
				sizeScaleE[1]=scale.z;
				sizeScaleE[2]=scale.y;
				(renderMode===1)&& (velocityScale=scale);
				break ;
			case 1:;
				var localScale=transform.localScale;
				positionScale=localScale;
				sizeScaleE[0]=localScale.x;
				sizeScaleE[1]=localScale.z;
				sizeScaleE[2]=localScale.y;
				(renderMode===1)&& (velocityScale=localScale);
				break ;
			case 2:
				positionScale=transform.scale;
				sizeScaleE[0]=sizeScaleE[1]=sizeScaleE[2]=1;
				(renderMode===1)&& (velocityScale=Vector3.ONE);
				break ;
			};
		var minStratPosition,maxStratPosition;
		if (this._velocityOverLifetime && this._velocityOverLifetime.enbale){
			}else {
			minStratPosition=new Vector3(startMinVelocity.x *maxStartLifeTime,startMinVelocity.y *maxStartLifeTime,startMinVelocity.z *maxStartLifeTime);
			maxStratPosition=new Vector3(startMaxVelocity.x *maxStartLifeTime,startMaxVelocity.y *maxStartLifeTime,startMaxVelocity.z *maxStartLifeTime);
			if (this.scaleMode !=2){
				Vector3.add(minPosition,minStratPosition,boundMin);
				Vector3.multiply(positionScale,boundMin,boundMin);
				Vector3.add(maxPosition,maxStratPosition,boundMax);
				Vector3.multiply(positionScale,boundMax,boundMax);
				}else {
				Vector3.multiply(positionScale,minPosition,boundMin);
				Vector3.add(boundMin,minStratPosition,boundMin);
				Vector3.multiply(positionScale,maxPosition,boundMax);
				Vector3.add(boundMax,maxStratPosition,boundMax);
			}
		}
		switch (this.simulationSpace){
			case 0:
				break ;
			case 1:
				Vector3.add(boundMin,worldPosition,boundMin);
				Vector3.add(boundMax,worldPosition,boundMax);
				break ;
			};
		var maxSize=NaN,maxSizeY=NaN;
		switch (this.startSizeType){
			case 0:
				if (this.threeDStartSize){
					var startSizeConstantSeparate=startSizeConstantSeparate;
					maxSize=Math.max(startSizeConstantSeparate.x,startSizeConstantSeparate.y);
					if (renderMode===1)
						maxSizeY=startSizeConstantSeparate.y;
					}else {
					maxSize=this.startSizeConstant;
					if (renderMode===1)
						maxSizeY=this.startSizeConstant;
				}
				break ;
			case 1:
				break ;
			case 2:
				if (this.threeDStartSize){
					var startSizeConstantMaxSeparate=startSizeConstantMaxSeparate;
					maxSize=Math.max(startSizeConstantMaxSeparate.x,startSizeConstantMaxSeparate.y);
					if (renderMode===1)
						maxSizeY=startSizeConstantMaxSeparate.y;
					}else {
					maxSize=this.startSizeConstantMax;
					if (renderMode===1)
						maxSizeY=this.startSizeConstantMax;
				}
				break ;
			case 3:
				break ;
			}
		if (this._sizeOverLifetime && this._sizeOverLifetime.enbale){
			var size=this._sizeOverLifetime.size;
			maxSize *=this._sizeOverLifetime.size.getMaxSizeInGradient();
		};
		var threeDMaxSize=ShurikenParticleSystem._tempVector30;
		var threeDMaxSizeE=threeDMaxSize.elements;
		var rotSize=NaN,nonRotSize=NaN;
		switch (renderMode){
			case 0:
				rotSize=maxSize *ShurikenParticleSystem.halfKSqrtOf2;
				Vector3.scale(sizeScale,maxSize,threeDMaxSize);
				Vector3.subtract(boundMin,threeDMaxSize,boundMin);
				Vector3.add(boundMax,threeDMaxSize,boundMax);
				break ;
			case 1:;
				var maxStretchPosition=ShurikenParticleSystem._tempVector31;
				var maxStretchVelocity=ShurikenParticleSystem._tempVector32;
				var minStretchVelocity=ShurikenParticleSystem._tempVector33;
				var minStretchPosition=ShurikenParticleSystem._tempVector34;
				if (this._velocityOverLifetime && this._velocityOverLifetime.enbale){
					}else {
					Vector3.multiply(velocityScale,startMaxVelocity,maxStretchVelocity);
					Vector3.multiply(velocityScale,startMinVelocity,minStretchVelocity);
				};
				var sizeStretch=maxSizeY *particleRender.stretchedBillboardLengthScale;
				var maxStretchLength=Vector3.scalarLength(maxStretchVelocity)*particleRender.stretchedBillboardSpeedScale+sizeStretch;
				var minStretchLength=Vector3.scalarLength(minStretchVelocity)*particleRender.stretchedBillboardSpeedScale+sizeStretch;
				var norMaxStretchVelocity=ShurikenParticleSystem._tempVector35;
				var norMinStretchVelocity=ShurikenParticleSystem._tempVector36;
				Vector3.normalize(maxStretchVelocity,norMaxStretchVelocity);
				Vector3.scale(norMaxStretchVelocity,maxStretchLength,minStretchPosition);
				Vector3.subtract(maxStratPosition,minStretchPosition,minStretchPosition);
				Vector3.normalize(minStretchVelocity,norMinStretchVelocity);
				Vector3.scale(norMinStretchVelocity,minStretchLength,maxStretchPosition);
				Vector3.add(minStratPosition,maxStretchPosition,maxStretchPosition);
				rotSize=maxSize *ShurikenParticleSystem.halfKSqrtOf2;
				Vector3.scale(sizeScale,rotSize,threeDMaxSize);
				var halfNorMaxStretchVelocity=ShurikenParticleSystem._tempVector37;
				var halfNorMinStretchVelocity=ShurikenParticleSystem._tempVector38;
				Vector3.scale(norMaxStretchVelocity,0.5,halfNorMaxStretchVelocity);
				Vector3.scale(norMinStretchVelocity,0.5,halfNorMinStretchVelocity);
				Vector3.multiply(halfNorMaxStretchVelocity,sizeScale,halfNorMaxStretchVelocity);
				Vector3.multiply(halfNorMinStretchVelocity,sizeScale,halfNorMinStretchVelocity);
				Vector3.add(boundMin,halfNorMinStretchVelocity,boundMin);
				Vector3.min(boundMin,minStretchPosition,boundMin);
				Vector3.subtract(boundMin,threeDMaxSize,boundMin);
				Vector3.subtract(boundMax,halfNorMaxStretchVelocity,boundMax);
				Vector3.max(boundMax,maxStretchPosition,boundMax);
				Vector3.add(boundMax,threeDMaxSize,boundMax);
				break ;
			case 2:
				maxSize *=Math.cos(0.78539816339744830961566084581988);
				nonRotSize=maxSize *0.5;
				threeDMaxSizeE[0]=sizeScale.x *nonRotSize;
				threeDMaxSizeE[1]=sizeScale.z *nonRotSize;
				Vector3.subtract(boundMin,threeDMaxSize,boundMin);
				Vector3.add(boundMax,threeDMaxSize,boundMax);
				break ;
			case 3:
				maxSize *=Math.cos(0.78539816339744830961566084581988);
				nonRotSize=maxSize *0.5;
				Vector3.scale(sizeScale,nonRotSize,threeDMaxSize);
				Vector3.subtract(boundMin,threeDMaxSize,boundMin);
				Vector3.add(boundMax,threeDMaxSize,boundMax);
				break ;
			}
		this._boundingBox.getCorners(this._boundingBoxCorners);
	}

	/**
	*@private
	*/
	__proto._updateEmission=function(){
		if (!this.isAlive)
			return;
		if (this._simulateUpdate){
			this._simulateUpdate=false;
		}
		else{
			var elapsedTime=(this._startUpdateLoopCount!==Stat.loopCount && !this._isPaused)?(this._owner._scene).timer._delta / 1000.0:0;
			elapsedTime=Math.min(ShurikenParticleSystem._maxElapsedTime,elapsedTime);
			this._updateParticles(elapsedTime);
		}
	}

	/**
	*@private
	*/
	__proto._updateParticles=function(elapsedTime){
		if (this._ownerRender.renderMode===4 && !this._ownerRender.mesh)
			return;
		this._currentTime+=elapsedTime;
		this._retireActiveParticles();
		this._freeRetiredParticles();
		this._totalDelayTime+=elapsedTime;
		if (this._totalDelayTime < this._playStartDelay){
			return;
		}
		if (this._emission.enbale&&this._isEmitting &&!this._isPaused)
			this._advanceTime(elapsedTime,this._currentTime);
	}

	/**
	*@private
	*/
	__proto._updateParticlesSimulationRestart=function(time){
		this._firstActiveElement=0;
		this._firstNewElement=0;
		this._firstFreeElement=0;
		this._firstRetiredElement=0;
		this._burstsIndex=0;
		this._frameRateTime=time;
		this._emissionTime=0;
		this._totalDelayTime=0;
		this._currentTime=time;
		var delayTime=time;
		if (delayTime < this._playStartDelay){
			this._totalDelayTime=delayTime;
			return;
		}
		if (this._emission.enbale)
			this._advanceTime(time,time);
	}

	/**
	*@private
	*/
	__proto._retireActiveParticles=function(){
		var epsilon=0.0001;
		while (this._firstActiveElement !=this._firstNewElement){
			var index=this._firstActiveElement *this._floatCountPerVertex *this._vertexStride;
			var timeIndex=index+this._timeIndex;
			var particleAge=this._currentTime-this._vertices[timeIndex];
			if (particleAge+epsilon < this._vertices[index+this._startLifeTimeIndex])
				break ;
			this._vertices[timeIndex]=this._drawCounter;
			this._firstActiveElement++;
			if (this._firstActiveElement >=this._bufferMaxParticles)
				this._firstActiveElement=0;
		}
	}

	/**
	*@private
	*/
	__proto._freeRetiredParticles=function(){
		while (this._firstRetiredElement !=this._firstActiveElement){
			var age=this._drawCounter-this._vertices[this._firstRetiredElement *this._floatCountPerVertex *this._vertexStride+this._timeIndex];
			if (this.isPerformanceMode)
				if (age < 3)
			break ;
			this._firstRetiredElement++;
			if (this._firstRetiredElement >=this._bufferMaxParticles)
				this._firstRetiredElement=0;
		}
	}

	/**
	*@private
	*/
	__proto._burst=function(fromTime,toTime){
		var totalEmitCount=0;
		var bursts=this._emission._bursts;
		for (var n=bursts.length;this._burstsIndex < n;this._burstsIndex++){
			var burst=bursts[this._burstsIndex];
			var burstTime=burst.time;
			if (fromTime<=burstTime && burstTime < toTime){
				var emitCount=0;
				if (this.autoRandomSeed){
					emitCount=MathUtil.lerp(burst.minCount,burst.maxCount,Math.random());
					}else {
					this._rand.seed=this._randomSeeds[0];
					emitCount=MathUtil.lerp(burst.minCount,burst.maxCount,this._rand.getFloat());
					this._randomSeeds[0]=this._rand.seed;
				}
				totalEmitCount+=emitCount;
				}else {
				break ;
			}
		}
		return totalEmitCount;
	}

	/**
	*@private
	*/
	__proto._advanceTime=function(elapsedTime,emitTime){
		var i=0;
		var lastEmissionTime=this._emissionTime;
		this._emissionTime+=elapsedTime;
		var totalEmitCount=0;
		if (this._emissionTime > this.duration){
			if (this.looping){
				totalEmitCount+=this._burst(lastEmissionTime,this._emissionTime);
				this._emissionTime-=this.duration;
				this._burstsIndex=0;
				totalEmitCount+=this._burst(0,this._emissionTime);
				}else {
				totalEmitCount=Math.min(this.maxParticles-this.aliveParticleCount,totalEmitCount);
				for (i=0;i < totalEmitCount;i++)
				this.emit(emitTime);
				this._isPlaying=false;
				this.stop();
				return;
			}
			}else {
			totalEmitCount+=this._burst(lastEmissionTime,this._emissionTime);
		}
		totalEmitCount=Math.min(this.maxParticles-this.aliveParticleCount,totalEmitCount);
		for (i=0;i < totalEmitCount;i++)
		this.emit(emitTime);
		var emissionRate=this.emission.emissionRate;
		if (emissionRate>0){
			var minEmissionTime=1/emissionRate;
			this._frameRateTime+=minEmissionTime;
			this._frameRateTime=this._currentTime-(this._currentTime-this._frameRateTime)% this._maxStartLifetime;
			while (this._frameRateTime <=emitTime){
				if (this.emit(this._frameRateTime))
					this._frameRateTime+=minEmissionTime;
				else
				break ;
			}
			this._frameRateTime=Math.floor(emitTime / minEmissionTime)*minEmissionTime;
		}
	}

	/**
	*@private
	*/
	__proto._initBufferDatas=function(){
		if (this._vertexBuffer){
			this._vertexBuffer.destroy();
			this._indexBuffer.destroy();
		};
		var render=this._ownerRender;
		var renderMode=render.renderMode;
		if (renderMode!==-1 && this.maxParticles > 0){
			var indices,i=0,j=0,m=0,indexOffset=0,perPartOffset=0,vertexDeclaration;;
			var vbMemorySize=0,memorySize=0;
			var mesh=render.mesh;
			if (renderMode===4){
				if(mesh){
					var vertexBufferCount=mesh._vertexBuffers.length;
					if (vertexBufferCount > 1){
						throw new Error("ShurikenParticleSystem: submesh Count mesh be One or all subMeshes have the same vertexDeclaration.");
						}else {
						vertexDeclaration=VertexShurikenParticleMesh.vertexDeclaration;
						this._floatCountPerVertex=vertexDeclaration.vertexStride/4;
						this._startLifeTimeIndex=12;
						this._timeIndex=16;
						this._vertexStride=mesh._vertexBuffers[0].vertexCount;
						var totalVertexCount=this._bufferMaxParticles *this._vertexStride;
						var vbCount=Math.floor(totalVertexCount / 65535)+1;
						var lastVBVertexCount=totalVertexCount % 65535;
						if (vbCount > 1){
							throw new Error("ShurikenParticleSystem:the maxParticleCount multiply mesh vertexCount is large than 65535.");
						}
						vbMemorySize=vertexDeclaration.vertexStride *lastVBVertexCount;
						this._vertexBuffer=new VertexBuffer3D(vbMemorySize,/*laya.webgl.WebGLContext.DYNAMIC_DRAW*/0x88E8);
						this._vertexBuffer.vertexDeclaration=vertexDeclaration;
						this._vertices=new Float32Array(this._floatCountPerVertex *lastVBVertexCount);
						this._indexStride=mesh._indexBuffer.indexCount;
						var indexDatas=mesh._indexBuffer.getData();
						var indexCount=this._bufferMaxParticles *this._indexStride;
						this._indexBuffer=new IndexBuffer3D(/*laya.d3.graphics.IndexBuffer3D.INDEXTYPE_USHORT*/"ushort",indexCount,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4);
						indices=new Uint16Array(indexCount);
						memorySize=vbMemorySize+indexCount *2;
						indexOffset=0;
						for (i=0;i < this._bufferMaxParticles;i++){
							var indexValueOffset=i *this._vertexStride;
							for (j=0,m=indexDatas.length;j < m;j++)
							indices[indexOffset++]=indexValueOffset+indexDatas[j];
						}
						this._indexBuffer.setData(indices);
						this._bufferState.bind();
						this._bufferState.applyVertexBuffer(this._vertexBuffer);
						this._bufferState.applyIndexBuffer(this._indexBuffer);
						this._bufferState.unBind();
					}
				}
				}else {
				vertexDeclaration=VertexShurikenParticleBillboard.vertexDeclaration;
				this._floatCountPerVertex=vertexDeclaration.vertexStride/4;
				this._startLifeTimeIndex=7;
				this._timeIndex=11;
				this._vertexStride=4;
				vbMemorySize=vertexDeclaration.vertexStride *this._bufferMaxParticles *this._vertexStride;
				this._vertexBuffer=new VertexBuffer3D(vbMemorySize,/*laya.webgl.WebGLContext.DYNAMIC_DRAW*/0x88E8);
				this._vertexBuffer.vertexDeclaration=vertexDeclaration;
				this._vertices=new Float32Array(this._floatCountPerVertex *this._bufferMaxParticles *this._vertexStride);
				for (i=0;i < this._bufferMaxParticles;i++){
					perPartOffset=i *this._floatCountPerVertex *this._vertexStride;
					this._vertices[perPartOffset]=-0.5;
					this._vertices[perPartOffset+1]=-0.5;
					this._vertices[perPartOffset+2]=0;
					this._vertices[perPartOffset+3]=1;
					perPartOffset+=this._floatCountPerVertex;
					this._vertices[perPartOffset]=0.5;
					this._vertices[perPartOffset+1]=-0.5;
					this._vertices[perPartOffset+2]=1;
					this._vertices[perPartOffset+3]=1;
					perPartOffset+=this._floatCountPerVertex
					this._vertices[perPartOffset]=0.5;
					this._vertices[perPartOffset+1]=0.5;
					this._vertices[perPartOffset+2]=1;
					this._vertices[perPartOffset+3]=0;
					perPartOffset+=this._floatCountPerVertex
					this._vertices[perPartOffset]=-0.5;
					this._vertices[perPartOffset+1]=0.5;
					this._vertices[perPartOffset+2]=0;
					this._vertices[perPartOffset+3]=0;
				}
				this._indexStride=6;
				this._indexBuffer=new IndexBuffer3D(/*laya.d3.graphics.IndexBuffer3D.INDEXTYPE_USHORT*/"ushort",this._bufferMaxParticles *6,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4);
				indices=new Uint16Array(this._bufferMaxParticles *6);
				for (i=0;i < this._bufferMaxParticles;i++){
					indexOffset=i *6;
					var firstVertex=i *this._vertexStride,secondVertex=firstVertex+2;
					indices[indexOffset++]=firstVertex;
					indices[indexOffset++]=secondVertex;
					indices[indexOffset++]=firstVertex+1;
					indices[indexOffset++]=firstVertex;
					indices[indexOffset++]=firstVertex+3;
					indices[indexOffset++]=secondVertex;
				}
				this._indexBuffer.setData(indices);
				memorySize=vbMemorySize+this._bufferMaxParticles *6 *2;
				this._bufferState.bind();
				this._bufferState.applyVertexBuffer(this._vertexBuffer);
				this._bufferState.applyIndexBuffer(this._indexBuffer);
				this._bufferState.unBind();
			}
			Resource._addMemory(memorySize,memorySize);
		}
	}

	/**
	*@private
	*/
	__proto.destroy=function(){
		_super.prototype.destroy.call(this);
		var memorySize=this._vertexBuffer._byteLength+this._indexBuffer.indexCount *2;
		Resource._addMemory(-memorySize,-memorySize);
		this._bufferState.destroy();
		this._vertexBuffer.destroy();
		this._indexBuffer.destroy();
		this._emission.destroy();
		this._bufferState=null;
		this._vertexBuffer=null;
		this._indexBuffer=null;
		this._owner=null;
		this._vertices=null;
		this._indexBuffer=null;
		this._emission=null;
		this._shape=null;
		this.startLifeTimeGradient=null;
		this.startLifeTimeGradientMin=null;
		this.startLifeTimeGradientMax=null;
		this.startSizeConstantSeparate=null;
		this.startSizeConstantMinSeparate=null;
		this.startSizeConstantMaxSeparate=null;
		this.startRotationConstantSeparate=null;
		this.startRotationConstantMinSeparate=null;
		this.startRotationConstantMaxSeparate=null;
		this.startColorConstant=null;
		this.startColorConstantMin=null;
		this.startColorConstantMax=null;
		this._velocityOverLifetime=null;
		this._colorOverLifetime=null;
		this._sizeOverLifetime=null;
		this._rotationOverLifetime=null;
		this._textureSheetAnimation=null;
	}

	/**
	*发射一个粒子。
	*/
	__proto.emit=function(time){
		var position=ShurikenParticleSystem._tempPosition;
		var direction=ShurikenParticleSystem._tempDirection;
		if (this._shape&&this._shape.enable){
			if (this.autoRandomSeed)
				this._shape.generatePositionAndDirection(position,direction);
			else
			this._shape.generatePositionAndDirection(position,direction,this._rand,this._randomSeeds);
			}else {
			var positionE=position.elements;
			var directionE=direction.elements;
			positionE[0]=positionE[1]=positionE[2]=0;
			directionE[0]=directionE[1]=0;
			directionE[2]=1;
		}
		return this.addParticle(position,direction,time);
	}

	//TODO:提前判断优化
	__proto.addParticle=function(position,direction,time){
		Vector3.normalize(direction,direction);
		var nextFreeParticle=this._firstFreeElement+1;
		if (nextFreeParticle >=this._bufferMaxParticles)
			nextFreeParticle=0;
		if (nextFreeParticle===this._firstRetiredElement)
			return false;
		ShurikenParticleData.create(this,this._ownerRender,this._owner.transform);
		var particleAge=this._currentTime-time;
		if (particleAge >=ShurikenParticleData.startLifeTime)
			return true;
		var randomVelocityX=NaN,randomVelocityY=NaN,randomVelocityZ=NaN,randomColor=NaN,randomSize=NaN,randomRotation=NaN,randomTextureAnimation=NaN;
		var needRandomVelocity=this._velocityOverLifetime && this._velocityOverLifetime.enbale;
		if (needRandomVelocity){
			var velocityType=this._velocityOverLifetime.velocity.type;
			if (velocityType===2 || velocityType===3){
				if (this.autoRandomSeed){
					randomVelocityX=Math.random();
					randomVelocityY=Math.random();
					randomVelocityZ=Math.random();
					}else {
					this._rand.seed=this._randomSeeds[9];
					randomVelocityX=this._rand.getFloat();
					randomVelocityY=this._rand.getFloat();
					randomVelocityZ=this._rand.getFloat();
					this._randomSeeds[9]=this._rand.seed;
				}
				}else {
				needRandomVelocity=false;
			}
			}else {
			needRandomVelocity=false;
		};
		var needRandomColor=this._colorOverLifetime && this._colorOverLifetime.enbale;
		if (needRandomColor){
			var colorType=this._colorOverLifetime.color.type;
			if (colorType===3){
				if (this.autoRandomSeed){
					randomColor=Math.random();
					}else {
					this._rand.seed=this._randomSeeds[10];
					randomColor=this._rand.getFloat();
					this._randomSeeds[10]=this._rand.seed;
				}
				}else {
				needRandomColor=false;
			}
			}else {
			needRandomColor=false;
		};
		var needRandomSize=this._sizeOverLifetime && this._sizeOverLifetime.enbale;
		if (needRandomSize){
			var sizeType=this._sizeOverLifetime.size.type;
			if (sizeType===3){
				if (this.autoRandomSeed){
					randomSize=Math.random();
					}else {
					this._rand.seed=this._randomSeeds[11];
					randomSize=this._rand.getFloat();
					this._randomSeeds[11]=this._rand.seed;
				}
				}else {
				needRandomSize=false;
			}
			}else {
			needRandomSize=false;
		};
		var needRandomRotation=this._rotationOverLifetime && this._rotationOverLifetime.enbale;
		if (needRandomRotation){
			var rotationType=this._rotationOverLifetime.angularVelocity.type;
			if (rotationType===2 || rotationType===3){
				if (this.autoRandomSeed){
					randomRotation=Math.random();
					}else {
					this._rand.seed=this._randomSeeds[12];
					randomRotation=this._rand.getFloat();
					this._randomSeeds[12]=this._rand.seed;
				}
				}else {
				needRandomRotation=false;
			}
			}else {
			needRandomRotation=false;
		};
		var needRandomTextureAnimation=this._textureSheetAnimation && this._textureSheetAnimation.enable;
		if (needRandomTextureAnimation){
			var textureAnimationType=this._textureSheetAnimation.frame.type;
			if (textureAnimationType===3){
				if (this.autoRandomSeed){
					randomTextureAnimation=Math.random();
					}else {
					this._rand.seed=this._randomSeeds[15];
					randomTextureAnimation=this._rand.getFloat();
					this._randomSeeds[15]=this._rand.seed;
				}
				}else {
				needRandomTextureAnimation=false;
			}
			}else {
			needRandomTextureAnimation=false;
		};
		var startIndex=this._firstFreeElement *this._floatCountPerVertex *this._vertexStride;
		var subU=ShurikenParticleData.startUVInfo[0];
		var subV=ShurikenParticleData.startUVInfo[1];
		var startU=ShurikenParticleData.startUVInfo[2];
		var startV=ShurikenParticleData.startUVInfo[3];
		var positionE=position.elements;
		var directionE=direction.elements;
		var meshVertices,meshVertexStride=0,meshPosOffset=0,meshCorOffset=0,meshUVOffset=0,meshVertexIndex=0;
		var render=this._ownerRender;
		if (render.renderMode===4){
			var meshVB=render.mesh._vertexBuffers[0];
			meshVertices=meshVB.getData();
			var meshVertexDeclaration=meshVB.vertexDeclaration;
			meshPosOffset=meshVertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.Vertex.VertexMesh.MESH_POSITION0*/0).offset / 4;
			var colorElement=meshVertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.Vertex.VertexMesh.MESH_COLOR0*/1);
			meshCorOffset=colorElement?colorElement.offset / 4:-1;
			var uvElement=meshVertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.Vertex.VertexMesh.MESH_TEXTURECOORDINATE0*/2);
			meshUVOffset=uvElement?uvElement.offset / 4:-1;
			meshVertexStride=meshVertexDeclaration.vertexStride / 4;
			meshVertexIndex=0;
			}else {
			this._vertices[startIndex+2]=startU;
			this._vertices[startIndex+3]=startV+subV;
			var secondOffset=startIndex+this._floatCountPerVertex;
			this._vertices[secondOffset+2]=startU+subU;
			this._vertices[secondOffset+3]=startV+subV;
			var thirdOffset=secondOffset+this._floatCountPerVertex;
			this._vertices[thirdOffset+2]=startU+subU;
			this._vertices[thirdOffset+3]=startV;
			var fourthOffset=thirdOffset+this._floatCountPerVertex;
			this._vertices[fourthOffset+2]=startU;
			this._vertices[fourthOffset+3]=startV;
		}
		for (var i=startIndex,n=startIndex+this._floatCountPerVertex *this._vertexStride;i < n;i+=this._floatCountPerVertex){
			var offset=0;
			if (render.renderMode===4){
				offset=i;
				var vertexOffset=meshVertexStride *(meshVertexIndex++);
				var meshOffset=vertexOffset+meshPosOffset;
				this._vertices[offset++]=meshVertices[meshOffset++];
				this._vertices[offset++]=meshVertices[meshOffset++];
				this._vertices[offset++]=meshVertices[meshOffset];
				if (meshCorOffset===-1){
					this._vertices[offset++]=1.0;
					this._vertices[offset++]=1.0;
					this._vertices[offset++]=1.0;
					this._vertices[offset++]=1.0;
				}
				else{
					meshOffset=vertexOffset+meshCorOffset;
					this._vertices[offset++]=meshVertices[meshOffset++];
					this._vertices[offset++]=meshVertices[meshOffset++];
					this._vertices[offset++]=meshVertices[meshOffset++];
					this._vertices[offset++]=meshVertices[meshOffset];
				}
				if (meshUVOffset===-1){
					this._vertices[offset++]=0.0;
					this._vertices[offset++]=0.0;
				}
				else{
					meshOffset=vertexOffset+meshUVOffset;
					this._vertices[offset++]=startU+meshVertices[meshOffset++] *subU;
					this._vertices[offset++]=startV+meshVertices[meshOffset] *subV;
				}
				}else {
				offset=i+4;
			}
			this._vertices[offset++]=positionE[0];
			this._vertices[offset++]=positionE[1];
			this._vertices[offset++]=positionE[2];
			this._vertices[offset++]=ShurikenParticleData.startLifeTime;
			this._vertices[offset++]=directionE[0];
			this._vertices[offset++]=directionE[1];
			this._vertices[offset++]=directionE[2];
			this._vertices[offset++]=time;
			this._vertices[offset++]=ShurikenParticleData.startColor[0];
			this._vertices[offset++]=ShurikenParticleData.startColor[1];
			this._vertices[offset++]=ShurikenParticleData.startColor[2];
			this._vertices[offset++]=ShurikenParticleData.startColor[3];
			this._vertices[offset++]=ShurikenParticleData.startSize[0];
			this._vertices[offset++]=ShurikenParticleData.startSize[1];
			this._vertices[offset++]=ShurikenParticleData.startSize[2];
			this._vertices[offset++]=ShurikenParticleData.startRotation[0];
			this._vertices[offset++]=ShurikenParticleData.startRotation[1];
			this._vertices[offset++]=ShurikenParticleData.startRotation[2];
			this._vertices[offset++]=ShurikenParticleData.startSpeed;
			needRandomColor && (this._vertices[offset+1]=randomColor);
			needRandomSize && (this._vertices[offset+2]=randomSize);
			needRandomRotation && (this._vertices[offset+3]=randomRotation);
			needRandomTextureAnimation && (this._vertices[offset+4]=randomTextureAnimation);
			if (needRandomVelocity){
				this._vertices[offset+5]=randomVelocityX;
				this._vertices[offset+6]=randomVelocityY;
				this._vertices[offset+7]=randomVelocityZ;
			}
			switch(this.simulationSpace){
				case 0:
					offset+=8;
					this._vertices[offset++]=ShurikenParticleData.simulationWorldPostion[0];
					this._vertices[offset++]=ShurikenParticleData.simulationWorldPostion[1];
					this._vertices[offset++]=ShurikenParticleData.simulationWorldPostion[2];
					this._vertices[offset++]=ShurikenParticleData.simulationWorldRotation[0];
					this._vertices[offset++]=ShurikenParticleData.simulationWorldRotation[1];
					this._vertices[offset++]=ShurikenParticleData.simulationWorldRotation[2];
					this._vertices[offset++]=ShurikenParticleData.simulationWorldRotation[3];
					break ;
				case 1:
					break ;
				default :
					throw new Error("ShurikenParticleMaterial: SimulationSpace value is invalid.");
				}
		}
		this._firstFreeElement=nextFreeParticle;
		return true;
	}

	__proto.addNewParticlesToVertexBuffer=function(){
		var start=0;
		if (this._firstNewElement < this._firstFreeElement){
			start=this._firstNewElement *this._vertexStride *this._floatCountPerVertex;
			this._vertexBuffer.setData(this._vertices,start,start,(this._firstFreeElement-this._firstNewElement)*this._vertexStride *this._floatCountPerVertex);
			}else {
			start=this._firstNewElement *this._vertexStride *this._floatCountPerVertex;
			this._vertexBuffer.setData(this._vertices,start,start,(this._bufferMaxParticles-this._firstNewElement)*this._vertexStride *this._floatCountPerVertex);
			if (this._firstFreeElement > 0){
				this._vertexBuffer.setData(this._vertices,0,0,this._firstFreeElement *this._vertexStride *this._floatCountPerVertex);
			}
		}
		this._firstNewElement=this._firstFreeElement;
	}

	/**
	*@inheritDoc
	*/
	__proto._getType=function(){
		return ShurikenParticleSystem._type;
	}

	/**
	*@inheritDoc
	*/
	__proto._prepareRender=function(state){
		this._updateEmission();
		if (this._firstNewElement !=this._firstFreeElement)
			this.addNewParticlesToVertexBuffer();
		this._drawCounter++;
		if (this._firstActiveElement !=this._firstFreeElement)
			return true;
		else
		return false;
	}

	/**
	*@private
	*/
	__proto._render=function(state){
		this._bufferState.bind();
		var indexCount=0;
		var gl=LayaGL.instance;
		if (this._firstActiveElement < this._firstFreeElement){
			indexCount=(this._firstFreeElement-this._firstActiveElement)*this._indexStride;
			gl.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,indexCount,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,2 *this._firstActiveElement *this._indexStride);
			Stat.trianglesFaces+=indexCount / 3;
			Stat.renderBatch++;
			}else {
			indexCount=(this._bufferMaxParticles-this._firstActiveElement)*this._indexStride;
			gl.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,indexCount,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,2 *this._firstActiveElement *this._indexStride);
			Stat.trianglesFaces+=indexCount / 3;
			Stat.renderBatch++;
			if (this._firstFreeElement > 0){
				indexCount=this._firstFreeElement *this._indexStride;
				gl.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,indexCount,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,0);
				Stat.trianglesFaces+=indexCount / 3;
				Stat.renderBatch++;
			}
		}
	}

	/**
	*开始发射粒子。
	*/
	__proto.play=function(){
		this._burstsIndex=0;
		this._isEmitting=true;
		this._isPlaying=true;
		this._isPaused=false;
		this._emissionTime=0;
		this._totalDelayTime=0;
		if (!this.autoRandomSeed){
			for (var i=0,n=this._randomSeeds.length;i < n;i++)
			this._randomSeeds[i]=this.randomSeed[0]+ShurikenParticleSystem._RANDOMOFFSET[i];
		}
		switch (this.startDelayType){
			case 0:
				this._playStartDelay=this.startDelay;
				break ;
			case 1:
				if (this.autoRandomSeed){
					this._playStartDelay=MathUtil.lerp(this.startDelayMin,this.startDelayMax,Math.random());
					}else {
					this._rand.seed=this._randomSeeds[2];
					this._playStartDelay=MathUtil.lerp(this.startDelayMin,this.startDelayMax,this._rand.getFloat());
					this._randomSeeds[2]=this._rand.seed;
				}
				break ;
			default :
				throw new Error("Utils3D: startDelayType is invalid.");
			}
		this._frameRateTime=this._currentTime+this._playStartDelay;
		this._startUpdateLoopCount=Stat.loopCount;
	}

	/**
	*暂停发射粒子。
	*/
	__proto.pause=function(){
		this._isPaused=true;
	}

	/**
	*通过指定时间增加粒子播放进度，并暂停播放。
	*@param time 进度时间.如果restart为true,粒子播放时间会归零后再更新进度。
	*@param restart 是否重置播放状态。
	*/
	__proto.simulate=function(time,restart){
		(restart===void 0)&& (restart=true);
		this._simulateUpdate=true;
		if (restart){
			this._updateParticlesSimulationRestart(time);
		}
		else{
			this._isPaused=false;
			this._updateParticles(time);
		}
		this.pause();
	}

	/**
	*停止发射粒子。
	*/
	__proto.stop=function(){
		this._burstsIndex=0;
		this._isEmitting=false;
		this._emissionTime=0;
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var dest=destObject;
		dest.duration=this.duration;
		dest.looping=this.looping;
		dest.prewarm=this.prewarm;
		dest.startDelayType=this.startDelayType;
		dest.startDelay=this.startDelay;
		dest.startDelayMin=this.startDelayMin;
		dest.startDelayMax=this.startDelayMax;
		dest._maxStartLifetime=this._maxStartLifetime;
		dest.startLifetimeType=this.startLifetimeType;
		dest.startLifetimeConstant=this.startLifetimeConstant;
		this.startLifeTimeGradient.cloneTo(dest.startLifeTimeGradient);
		dest.startLifetimeConstantMin=this.startLifetimeConstantMin;
		dest.startLifetimeConstantMax=this.startLifetimeConstantMax;
		this.startLifeTimeGradientMin.cloneTo(dest.startLifeTimeGradientMin);
		this.startLifeTimeGradientMax.cloneTo(dest.startLifeTimeGradientMax);
		dest.startSpeedType=this.startSpeedType;
		dest.startSpeedConstant=this.startSpeedConstant;
		dest.startSpeedConstantMin=this.startSpeedConstantMin;
		dest.startSpeedConstantMax=this.startSpeedConstantMax;
		dest.threeDStartSize=this.threeDStartSize;
		dest.startSizeType=this.startSizeType;
		dest.startSizeConstant=this.startSizeConstant;
		this.startSizeConstantSeparate.cloneTo(dest.startSizeConstantSeparate);
		dest.startSizeConstantMin=this.startSizeConstantMin;
		dest.startSizeConstantMax=this.startSizeConstantMax;
		this.startSizeConstantMinSeparate.cloneTo(dest.startSizeConstantMinSeparate);
		this.startSizeConstantMaxSeparate.cloneTo(dest.startSizeConstantMaxSeparate);
		dest.threeDStartRotation=this.threeDStartRotation;
		dest.startRotationType=this.startRotationType;
		dest.startRotationConstant=this.startRotationConstant;
		this.startRotationConstantSeparate.cloneTo(dest.startRotationConstantSeparate);
		dest.startRotationConstantMin=this.startRotationConstantMin;
		dest.startRotationConstantMax=this.startRotationConstantMax;
		this.startRotationConstantMinSeparate.cloneTo(dest.startRotationConstantMinSeparate);
		this.startRotationConstantMaxSeparate.cloneTo(dest.startRotationConstantMaxSeparate);
		dest.randomizeRotationDirection=this.randomizeRotationDirection;
		dest.startColorType=this.startColorType;
		this.startColorConstant.cloneTo(dest.startColorConstant);
		this.startColorConstantMin.cloneTo(dest.startColorConstantMin);
		this.startColorConstantMax.cloneTo(dest.startColorConstantMax);
		dest.gravityModifier=this.gravityModifier;
		dest.simulationSpace=this.simulationSpace;
		dest.scaleMode=this.scaleMode;
		dest.playOnAwake=this.playOnAwake;
		dest.maxParticles=this.maxParticles;
		(this._emission)&& (dest._emission=this._emission.clone());
		(this.shape)&& (dest.shape=this.shape.clone());
		(this.velocityOverLifetime)&& (dest.velocityOverLifetime=this.velocityOverLifetime.clone());
		(this.colorOverLifetime)&& (dest.colorOverLifetime=this.colorOverLifetime.clone());
		(this.sizeOverLifetime)&& (dest.sizeOverLifetime=this.sizeOverLifetime.clone());
		(this.rotationOverLifetime)&& (dest.rotationOverLifetime=this.rotationOverLifetime.clone());
		(this.textureSheetAnimation)&& (dest.textureSheetAnimation=this.textureSheetAnimation.clone());
		dest.isPerformanceMode=this.isPerformanceMode;
		dest._isEmitting=this._isEmitting;
		dest._isPlaying=this._isPlaying;
		dest._isPaused=this._isPaused;
		dest._playStartDelay=this._playStartDelay;
		dest._frameRateTime=this._frameRateTime;
		dest._emissionTime=this._emissionTime;
		dest._totalDelayTime=this._totalDelayTime;
		dest._burstsIndex=this._burstsIndex;
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var dest=/*__JS__ */new this.constructor();
		this.cloneTo(dest);
		return dest;
	}

	/**设置最大粒子数,注意:谨慎修改此属性，有性能损耗。*/
	/**获取最大粒子数。*/
	__getset(0,__proto,'maxParticles',function(){
		return this._bufferMaxParticles-1;
		},function(value){
		var newMaxParticles=value+1;
		if (newMaxParticles!==this._bufferMaxParticles){
			this._bufferMaxParticles=newMaxParticles;
			this._initBufferDatas();
		}
	});

	/**
	*是否正在发射。
	*/
	__getset(0,__proto,'isEmitting',function(){
		return this._isEmitting;
	});

	/**
	*是否存活。
	*/
	__getset(0,__proto,'isAlive',function(){
		if (this._isPlaying || this.aliveParticleCount > 0)
			return true;
		return false;
	});

	/**
	*设置形状。
	*/
	/**
	*获取形状。
	*/
	__getset(0,__proto,'shape',function(){
		return this._shape;
		},function(value){
		if (this._shape!==value){
			if (value&&value.enable)
				this._owner._render._defineDatas.add(ShuriKenParticle3D.SHADERDEFINE_SHAPE);
			else
			this._owner._render._defineDatas.remove(ShuriKenParticle3D.SHADERDEFINE_SHAPE);
			this._shape=value;
		}
	});

	/**
	*设置生命周期旋转,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
	*@param value 生命周期旋转。
	*/
	/**
	*获取生命周期旋转,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
	*@return 生命周期旋转。
	*/
	__getset(0,__proto,'rotationOverLifetime',function(){
		return this._rotationOverLifetime;
		},function(value){
		var defDat=this._owner._render._defineDatas;
		var shaDat=this._owner._render._shaderValues;
		if (value){
			var rotation=value.angularVelocity;
			if (!rotation)
				return;
			var rotationSeparate=rotation.separateAxes;
			var rotationType=rotation.type;
			if (value.enbale){
				if (rotationSeparate)
					defDat.add(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMESEPERATE);
				else
				defDat.add(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIME);
				switch (rotationType){
					case 0:
						defDat.add(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECONSTANT);
						break ;
					case 1:
						defDat.add(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECURVE);
						break ;
					case 2:
						defDat.add(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCONSTANTS);
						break ;
					case 3:
						defDat.add(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCURVES);
						break ;
					}
				}else {
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIME);
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMESEPERATE);
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECONSTANT);
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECURVE);
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCONSTANTS);
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCURVES);
			}
			switch (rotationType){
				case 0:
					if (rotationSeparate){
						shaDat.setVector(ShuriKenParticle3D.ROLANGULARVELOCITYCONSTSEPRARATE,rotation.constantSeparate);
						}else {
						shaDat.setNumber(ShuriKenParticle3D.ROLANGULARVELOCITYCONST,rotation.constant);
					}
					break ;
				case 1:
					if (rotationSeparate){
						shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTX,rotation.gradientX._elements);
						shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTY,rotation.gradientY._elements);
						shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTZ,rotation.gradientZ._elements);
						}else {
						shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENT,rotation.gradient._elements);
					}
					break ;
				case 2:
					if (rotationSeparate){
						shaDat.setVector(ShuriKenParticle3D.ROLANGULARVELOCITYCONSTSEPRARATE,rotation.constantMinSeparate);
						shaDat.setVector(ShuriKenParticle3D.ROLANGULARVELOCITYCONSTMAXSEPRARATE,rotation.constantMaxSeparate);
						}else {
						shaDat.setNumber(ShuriKenParticle3D.ROLANGULARVELOCITYCONST,rotation.constantMin);
						shaDat.setNumber(ShuriKenParticle3D.ROLANGULARVELOCITYCONSTMAX,rotation.constantMax);
					}
					break ;
				case 3:
					if (rotationSeparate){
						shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTX,rotation.gradientXMin._elements);
						shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTXMAX,rotation.gradientXMax._elements);
						shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTY,rotation.gradientYMin._elements);
						shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTYMAX,rotation.gradientYMax._elements);
						shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTZ,rotation.gradientZMin._elements);
						shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTZMAX,rotation.gradientZMax._elements);
						}else {
						shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENT,rotation.gradientMin._elements);
						shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTMAX,rotation.gradientMax._elements);
					}
					break ;
				}
			}else {
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIME);
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMESEPERATE);
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECONSTANT);
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECURVE);
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCONSTANTS);
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCURVES);
			shaDat.setVector(ShuriKenParticle3D.ROLANGULARVELOCITYCONSTSEPRARATE,null);
			shaDat.setVector(ShuriKenParticle3D.ROLANGULARVELOCITYCONSTMAXSEPRARATE,null);
			shaDat.setNumber(ShuriKenParticle3D.ROLANGULARVELOCITYCONST,undefined);
			shaDat.setNumber(ShuriKenParticle3D.ROLANGULARVELOCITYCONSTMAX,undefined);
			shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTX,null);
			shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTXMAX,null);
			shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTY,null);
			shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTYMAX,null);
			shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTZ,null);
			shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTZMAX,null);
			shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTWMAX,null);
			shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENT,null);
			shaDat.setBuffer(ShuriKenParticle3D.ROLANGULARVELOCITYGRADIENTMAX,null);
		}
		this._rotationOverLifetime=value;
	});

	/**
	*获取发射器。
	*/
	__getset(0,__proto,'emission',function(){
		return this._emission;
	});

	/**
	*获取一次循环内的累计时间。
	*@return 一次循环内的累计时间。
	*/
	__getset(0,__proto,'emissionTime',function(){
		return this._emissionTime > this.duration ? this.duration :this._emissionTime;
	});

	/**
	*粒子存活个数。
	*/
	__getset(0,__proto,'aliveParticleCount',function(){
		if (this._firstNewElement >=this._firstRetiredElement)
			return this._firstNewElement-this._firstRetiredElement;
		else
		return this._bufferMaxParticles-this._firstRetiredElement+this._firstNewElement;
	});

	/**
	*是否正在播放。
	*/
	__getset(0,__proto,'isPlaying',function(){
		return this._isPlaying;
	});

	/**
	*是否已暂停。
	*/
	__getset(0,__proto,'isPaused',function(){
		return this._isPaused;
	});

	/**
	*设置开始生命周期模式,0为固定时间，1为渐变时间，2为两个固定之间的随机插值,3为两个渐变时间的随机插值。
	*/
	/**
	*获取开始生命周期模式,0为固定时间，1为渐变时间，2为两个固定之间的随机插值,3为两个渐变时间的随机插值。
	*/
	__getset(0,__proto,'startLifetimeType',function(){
		return this._startLifetimeType;
		},function(value){
		var i=0,n=0;
		switch (this.startLifetimeType){
			case 0:
				this._maxStartLifetime=this.startLifetimeConstant;
				break ;
			case 1:
				this._maxStartLifetime=-Number.MAX_VALUE;
				var startLifeTimeGradient=startLifeTimeGradient;
				for (i=0,n=startLifeTimeGradient.gradientCount;i < n;i++)
				this._maxStartLifetime=Math.max(this._maxStartLifetime,startLifeTimeGradient.getValueByIndex(i));
				break ;
			case 2:
				this._maxStartLifetime=Math.max(this.startLifetimeConstantMin,this.startLifetimeConstantMax);
				break ;
			case 3:
				this._maxStartLifetime=-Number.MAX_VALUE;
				var startLifeTimeGradientMin=startLifeTimeGradientMin;
				for (i=0,n=startLifeTimeGradientMin.gradientCount;i < n;i++)
				this._maxStartLifetime=Math.max(this._maxStartLifetime,startLifeTimeGradientMin.getValueByIndex(i));
				var startLifeTimeGradientMax=startLifeTimeGradientMax;
				for (i=0,n=startLifeTimeGradientMax.gradientCount;i < n;i++)
				this._maxStartLifetime=Math.max(this._maxStartLifetime,startLifeTimeGradientMax.getValueByIndex(i));
				break ;
			}
		this._startLifetimeType=value;
	});

	/**
	*设置开始生命周期，0模式,单位为秒。
	*/
	/**
	*获取开始生命周期，0模式,单位为秒。
	*/
	__getset(0,__proto,'startLifetimeConstant',function(){
		return this._startLifetimeConstant;
		},function(value){
		if(this._startLifetimeType===0)
			this._maxStartLifetime=value;
		this._startLifetimeConstant=value;
	});

	/**
	*设置最小开始生命周期，2模式,单位为秒。
	*/
	/**
	*获取最小开始生命周期，2模式,单位为秒。
	*/
	__getset(0,__proto,'startLifetimeConstantMin',function(){
		return this._startLifetimeConstantMin;
		},function(value){
		if (this._startLifetimeType===2)
			this._maxStartLifetime=Math.max(value,this._startLifetimeConstantMax);
		this._startLifetimeConstantMin=value;
	});

	/**
	*设置开始渐变生命周期，1模式,单位为秒。
	*/
	/**
	*获取开始渐变生命周期，1模式,单位为秒。
	*/
	__getset(0,__proto,'startLifeTimeGradient',function(){
		return this._startLifeTimeGradient;
		},function(value){
		if (this._startLifetimeType===1){
			this._maxStartLifetime=-Number.MAX_VALUE;
			for (var i=0,n=value.gradientCount;i < n;i++)
			this._maxStartLifetime=Math.max(this._maxStartLifetime,value.getValueByIndex(i));
		}
		this._startLifeTimeGradient=value;
	});

	/**
	*设置最大开始生命周期，2模式,单位为秒。
	*/
	/**
	*获取最大开始生命周期，2模式,单位为秒。
	*/
	__getset(0,__proto,'startLifetimeConstantMax',function(){
		return this._startLifetimeConstantMax;
		},function(value){
		if (this._startLifetimeType===2)
			this._maxStartLifetime=Math.max(this._startLifetimeConstantMin,value);
		this._startLifetimeConstantMax=value;
	});

	/**
	*设置开始渐变最小生命周期，3模式,单位为秒。
	*/
	/**
	*获取开始渐变最小生命周期，3模式,单位为秒。
	*/
	__getset(0,__proto,'startLifeTimeGradientMin',function(){
		return this._startLifeTimeGradientMin;
		},function(value){
		if (this._startLifetimeType===3){
			var i=0,n=0;
			this._maxStartLifetime=-Number.MAX_VALUE;
			for (i=0,n=value.gradientCount;i < n;i++)
			this._maxStartLifetime=Math.max(this._maxStartLifetime,value.getValueByIndex(i));
			for (i=0,n=this._startLifeTimeGradientMax.gradientCount;i < n;i++)
			this._maxStartLifetime=Math.max(this._maxStartLifetime,this._startLifeTimeGradientMax.getValueByIndex(i));
		}
		this._startLifeTimeGradientMin=value;
	});

	/**
	*设置开始渐变最大生命周期，3模式,单位为秒。
	*/
	/**
	*获取开始渐变最大生命周期，3模式,单位为秒。
	*/
	__getset(0,__proto,'startLifeTimeGradientMax',function(){
		return this._startLifeTimeGradientMax;
		},function(value){
		if (this._startLifetimeType===3){
			var i=0,n=0;
			this._maxStartLifetime=-Number.MAX_VALUE;
			for (i=0,n=this._startLifeTimeGradientMin.gradientCount;i < n;i++)
			this._maxStartLifetime=Math.max(this._maxStartLifetime,this._startLifeTimeGradientMin.getValueByIndex(i));
			for (i=0,n=value.gradientCount;i < n;i++)
			this._maxStartLifetime=Math.max(this._maxStartLifetime,value.getValueByIndex(i));
		}
		this._startLifeTimeGradientMax=value;
	});

	/**
	*设置生命周期速度,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
	*@param value 生命周期速度.
	*/
	/**
	*获取生命周期速度,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
	*@return 生命周期速度.
	*/
	__getset(0,__proto,'velocityOverLifetime',function(){
		return this._velocityOverLifetime;
		},function(value){
		var defDat=this._owner._render._defineDatas;
		var shaDat=this._owner._render._shaderValues;
		if (value){
			var velocity=value.velocity;
			var velocityType=velocity.type;
			if (value.enbale){
				switch (velocityType){
					case 0:
						defDat.add(ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECONSTANT);
						break ;
					case 1:
						defDat.add(ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECURVE);
						break ;
					case 2:
						defDat.add(ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCONSTANT);
						break ;
					case 3:
						defDat.add(ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCURVE);
						break ;
					}
				}else {
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECONSTANT);
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECURVE);
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCONSTANT);
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCURVE);
			}
			switch (velocityType){
				case 0:
					shaDat.setVector(ShuriKenParticle3D.VOLVELOCITYCONST,velocity.constant);
					break ;
				case 1:
					shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTX,velocity.gradientX._elements);
					shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTY,velocity.gradientY._elements);
					shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTZ,velocity.gradientZ._elements);
					break ;
				case 2:
					shaDat.setVector(ShuriKenParticle3D.VOLVELOCITYCONST,velocity.constantMin);
					shaDat.setVector(ShuriKenParticle3D.VOLVELOCITYCONSTMAX,velocity.constantMax);
					break ;
				case 3:
					shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTX,velocity.gradientXMin._elements);
					shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTXMAX,velocity.gradientXMax._elements);
					shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTY,velocity.gradientYMin._elements);
					shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTYMAX,velocity.gradientYMax._elements);
					shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTZ,velocity.gradientZMin._elements);
					shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTZMAX,velocity.gradientZMax._elements);
					break ;
				}
			shaDat.setInt(ShuriKenParticle3D.VOLSPACETYPE,value.space);
			}else {
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECONSTANT);
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECURVE);
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCONSTANT);
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCURVE);
			shaDat.setVector(ShuriKenParticle3D.VOLVELOCITYCONST,null);
			shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTX,null);
			shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTY,null);
			shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTZ,null);
			shaDat.setVector(ShuriKenParticle3D.VOLVELOCITYCONST,null);
			shaDat.setVector(ShuriKenParticle3D.VOLVELOCITYCONSTMAX,null);
			shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTX,null);
			shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTXMAX,null);
			shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTY,null);
			shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTYMAX,null);
			shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTZ,null);
			shaDat.setBuffer(ShuriKenParticle3D.VOLVELOCITYGRADIENTZMAX,null);
			shaDat.setInt(ShuriKenParticle3D.VOLSPACETYPE,undefined);
		}
		this._velocityOverLifetime=value;
	});

	/**
	*设置生命周期颜色,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
	*@param value 生命周期颜色
	*/
	/**
	*获取生命周期颜色,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
	*@return 生命周期颜色
	*/
	__getset(0,__proto,'colorOverLifetime',function(){
		return this._colorOverLifetime;
		},function(value){
		var defDat=this._owner._render._defineDatas;
		var shaDat=this._owner._render._shaderValues;
		if (value){
			var color=value.color;
			if (value.enbale){
				switch (color.type){
					case 1:
						defDat.add(ShuriKenParticle3D.SHADERDEFINE_COLOROVERLIFETIME);
						break ;
					case 3:
						defDat.add(ShuriKenParticle3D.SHADERDEFINE_RANDOMCOLOROVERLIFETIME);
						break ;
					}
				}else {
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_COLOROVERLIFETIME);
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_RANDOMCOLOROVERLIFETIME);
			}
			switch (color.type){
				case 1:;
					var gradientColor=color.gradient;
					shaDat.setBuffer(ShuriKenParticle3D.COLOROVERLIFEGRADIENTALPHAS,gradientColor._alphaElements);
					shaDat.setBuffer(ShuriKenParticle3D.COLOROVERLIFEGRADIENTCOLORS,gradientColor._rgbElements);
					break ;
				case 3:;
					var minGradientColor=color.gradientMin;
					var maxGradientColor=color.gradientMax;
					shaDat.setBuffer(ShuriKenParticle3D.COLOROVERLIFEGRADIENTALPHAS,minGradientColor._alphaElements);
					shaDat.setBuffer(ShuriKenParticle3D.COLOROVERLIFEGRADIENTCOLORS,minGradientColor._rgbElements);
					shaDat.setBuffer(ShuriKenParticle3D.MAXCOLOROVERLIFEGRADIENTALPHAS,maxGradientColor._alphaElements);
					shaDat.setBuffer(ShuriKenParticle3D.MAXCOLOROVERLIFEGRADIENTCOLORS,maxGradientColor._rgbElements);
					break ;
				}
			}else {
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_COLOROVERLIFETIME);
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_RANDOMCOLOROVERLIFETIME);
			shaDat.setBuffer(ShuriKenParticle3D.COLOROVERLIFEGRADIENTALPHAS,gradientColor._alphaElements);
			shaDat.setBuffer(ShuriKenParticle3D.COLOROVERLIFEGRADIENTCOLORS,gradientColor._rgbElements);
			shaDat.setBuffer(ShuriKenParticle3D.COLOROVERLIFEGRADIENTALPHAS,minGradientColor._alphaElements);
			shaDat.setBuffer(ShuriKenParticle3D.COLOROVERLIFEGRADIENTCOLORS,minGradientColor._rgbElements);
			shaDat.setBuffer(ShuriKenParticle3D.MAXCOLOROVERLIFEGRADIENTALPHAS,maxGradientColor._alphaElements);
			shaDat.setBuffer(ShuriKenParticle3D.MAXCOLOROVERLIFEGRADIENTCOLORS,maxGradientColor._rgbElements);
		}
		this._colorOverLifetime=value;
	});

	/**
	*设置生命周期尺寸,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
	*@param value 生命周期尺寸
	*/
	/**
	*获取生命周期尺寸,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
	*@return 生命周期尺寸
	*/
	__getset(0,__proto,'sizeOverLifetime',function(){
		return this._sizeOverLifetime;
		},function(value){
		var defDat=this._owner._render._defineDatas;
		var shaDat=this._owner._render._shaderValues;
		if (value){
			var size=value.size;
			var sizeSeparate=size.separateAxes;
			var sizeType=size.type;
			if (value.enbale){
				switch (sizeType){
					case 0:
						if (sizeSeparate)
							defDat.add(ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVESEPERATE);
						else
						defDat.add(ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVE);
						break ;
					case 2:
						if (sizeSeparate)
							defDat.add(ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVESSEPERATE);
						else
						defDat.add(ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVES);
						break ;
					}
				}else {
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVE);
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVESEPERATE);
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVES);
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVESSEPERATE);
			}
			switch (sizeType){
				case 0:
					if (sizeSeparate){
						shaDat.setBuffer(ShuriKenParticle3D.SOLSIZEGRADIENTX,size.gradientX._elements);
						shaDat.setBuffer(ShuriKenParticle3D.SOLSIZEGRADIENTY,size.gradientY._elements);
						shaDat.setBuffer(ShuriKenParticle3D.SOLSizeGradientZ,size.gradientZ._elements);
						}else {
						shaDat.setBuffer(ShuriKenParticle3D.SOLSIZEGRADIENT,size.gradient._elements);
					}
					break ;
				case 2:
					if (sizeSeparate){
						shaDat.setBuffer(ShuriKenParticle3D.SOLSIZEGRADIENTX,size.gradientXMin._elements);
						shaDat.setBuffer(ShuriKenParticle3D.SOLSIZEGRADIENTXMAX,size.gradientXMax._elements);
						shaDat.setBuffer(ShuriKenParticle3D.SOLSIZEGRADIENTY,size.gradientYMin._elements);
						shaDat.setBuffer(ShuriKenParticle3D.SOLSIZEGRADIENTYMAX,size.gradientYMax._elements);
						shaDat.setBuffer(ShuriKenParticle3D.SOLSizeGradientZ,size.gradientZMin._elements);
						shaDat.setBuffer(ShuriKenParticle3D.SOLSizeGradientZMAX,size.gradientZMax._elements);
						}else {
						shaDat.setBuffer(ShuriKenParticle3D.SOLSIZEGRADIENT,size.gradientMin._elements);
						shaDat.setBuffer(ShuriKenParticle3D.SOLSizeGradientMax,size.gradientMax._elements);
					}
					break ;
				}
			}else {
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVE);
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVESEPERATE);
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVES);
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVESSEPERATE);
			shaDat.setBuffer(ShuriKenParticle3D.SOLSIZEGRADIENTX,null);
			shaDat.setBuffer(ShuriKenParticle3D.SOLSIZEGRADIENTXMAX,null);
			shaDat.setBuffer(ShuriKenParticle3D.SOLSIZEGRADIENTY,null);
			shaDat.setBuffer(ShuriKenParticle3D.SOLSIZEGRADIENTYMAX,null);
			shaDat.setBuffer(ShuriKenParticle3D.SOLSizeGradientZ,null);
			shaDat.setBuffer(ShuriKenParticle3D.SOLSizeGradientZMAX,null);
			shaDat.setBuffer(ShuriKenParticle3D.SOLSIZEGRADIENT,null);
			shaDat.setBuffer(ShuriKenParticle3D.SOLSizeGradientMax,null);
		}
		this._sizeOverLifetime=value;
	});

	/**
	*设置生命周期纹理动画,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
	*@param value 生命周期纹理动画。
	*/
	/**
	*获取生命周期纹理动画,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
	*@return 生命周期纹理动画。
	*/
	__getset(0,__proto,'textureSheetAnimation',function(){
		return this._textureSheetAnimation;
		},function(value){
		var defDat=this._owner._render._defineDatas;
		var shaDat=this._owner._render._shaderValues;
		if (value){
			var frameOverTime=value.frame;
			var textureAniType=frameOverTime.type;
			if (value.enable){
				switch (textureAniType){
					case 1:
						defDat.add(ShuriKenParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONCURVE);
						break ;
					case 3:
						defDat.add(ShuriKenParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONRANDOMCURVE);
						break ;
					}
				}else {
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONCURVE);
				defDat.remove(ShuriKenParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONRANDOMCURVE);
			}
			if (textureAniType===1 || textureAniType===3){
				shaDat.setNumber(ShuriKenParticle3D.TEXTURESHEETANIMATIONCYCLES,value.cycles);
				var title=value.tiles;
				var _uvLengthE=this._uvLength.elements;
				_uvLengthE[0]=1.0 / title.x;
				_uvLengthE[1]=1.0 / title.y;
				shaDat.setVector(ShuriKenParticle3D.TEXTURESHEETANIMATIONSUBUVLENGTH,this._uvLength);
			}
			switch (textureAniType){
				case 1:
					shaDat.setBuffer(ShuriKenParticle3D.TEXTURESHEETANIMATIONGRADIENTUVS,frameOverTime.frameOverTimeData._elements);
					break ;
				case 3:
					shaDat.setBuffer(ShuriKenParticle3D.TEXTURESHEETANIMATIONGRADIENTUVS,frameOverTime.frameOverTimeDataMin._elements);
					shaDat.setBuffer(ShuriKenParticle3D.TEXTURESHEETANIMATIONGRADIENTMAXUVS,frameOverTime.frameOverTimeDataMax._elements);
					break ;
				}
			}else {
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONCURVE);
			defDat.remove(ShuriKenParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONRANDOMCURVE);
			shaDat.setNumber(ShuriKenParticle3D.TEXTURESHEETANIMATIONCYCLES,undefined);
			shaDat.setVector(ShuriKenParticle3D.TEXTURESHEETANIMATIONSUBUVLENGTH,null);
			shaDat.setBuffer(ShuriKenParticle3D.TEXTURESHEETANIMATIONGRADIENTUVS,null);
			shaDat.setBuffer(ShuriKenParticle3D.TEXTURESHEETANIMATIONGRADIENTMAXUVS,null);
		}
		this._textureSheetAnimation=value;
	});

	ShurikenParticleSystem.halfKSqrtOf2=1.42 *0.5;
	__static(ShurikenParticleSystem,
	['_RANDOMOFFSET',function(){return this._RANDOMOFFSET=new Uint32Array([0x23571a3e,0xc34f56fe,0x13371337,0x12460f3b,0x6aed452e,0xdec4aea1,0x96aa4de3,0x8d2c8431,0xf3857f6f,0xe0fbd834,0x13740583,0x591bc05c,0x40eb95e4,0xbc524e5f,0xaf502044,0xa614b381,0x1034e524,0xfc524e5f]);},'_maxElapsedTime',function(){return this._maxElapsedTime=1.0 / 3.0;},'_tempVector30',function(){return this._tempVector30=new Vector3();},'_tempVector31',function(){return this._tempVector31=new Vector3();},'_tempVector32',function(){return this._tempVector32=new Vector3();},'_tempVector33',function(){return this._tempVector33=new Vector3();},'_tempVector34',function(){return this._tempVector34=new Vector3();},'_tempVector35',function(){return this._tempVector35=new Vector3();},'_tempVector36',function(){return this._tempVector36=new Vector3();},'_tempVector37',function(){return this._tempVector37=new Vector3();},'_tempVector38',function(){return this._tempVector38=new Vector3();},'_tempVector39',function(){return this._tempVector39=new Vector3();},'_tempPosition',function(){return this._tempPosition=new Vector3();},'_tempDirection',function(){return this._tempDirection=new Vector3();},'_type',function(){return this._type=GeometryElement._typeCounter++;}
	]);
	return ShurikenParticleSystem;
})(GeometryElement)


/**

*/
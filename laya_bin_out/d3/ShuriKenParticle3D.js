/**
*<code>ShuriKenParticle3D</code> 3D粒子。
*/
//class laya.d3.core.particleShuriKen.ShuriKenParticle3D extends laya.d3.core.RenderableSprite3D
var ShuriKenParticle3D=(function(_super){
	function ShuriKenParticle3D(){
		/**@private */
		//this._particleSystem=null;
		ShuriKenParticle3D.__super.call(this,null);
		this._render=new ShurikenParticleRenderer(this);
		this._particleSystem=new ShurikenParticleSystem(this);
		var elements=this._render._renderElements;
		var element=elements[0]=new RenderElement();
		element.setTransform(this._transform);
		element.render=this._render;
		element.setGeometry(this._particleSystem);
		element.material=ShurikenParticleMaterial.defaultMaterial;
	}

	__class(ShuriKenParticle3D,'laya.d3.core.particleShuriKen.ShuriKenParticle3D',_super);
	var __proto=ShuriKenParticle3D.prototype;
	/**
	*@private
	*/
	__proto._initParticleVelocity=function(gradientData){
		var gradient=new GradientDataNumber();
		var velocitysData=gradientData.velocitys;
		for (var i=0,n=velocitysData.length;i < n;i++){
			var valueData=velocitysData[i];
			gradient.add(valueData.key,valueData.value);
		}
		return gradient;
	}

	/**
	*@private
	*/
	__proto._initParticleColor=function(gradientColorData){
		var gradientColor=new Gradient(4,4);
		var alphasData=gradientColorData.alphas;
		var i=0,n=0;
		for (i=0,n=alphasData.length;i < n;i++){
			var alphaData=alphasData[i];
			if ((i===3)&& ((alphaData.key!==1))){
				alphaData.key=1;
				console.log("GradientDataColor warning:the forth key is  be force set to 1.");
			}
			gradientColor.addColorAlpha(alphaData.key,alphaData.value);
		};
		var rgbsData=gradientColorData.rgbs;
		for (i=0,n=rgbsData.length;i < n;i++){
			var rgbData=rgbsData[i];
			var rgbValue=rgbData.value;
			if ((i===3)&& ((rgbData.key!==1))){
				rgbData.key=1;
				console.log("GradientDataColor warning:the forth key is  be force set to 1.");
			}
			gradientColor.addColorRGB(rgbData.key,new Color(rgbValue[0],rgbValue[1],rgbValue[2],1.0));
		}
		return gradientColor;
	}

	/**
	*@private
	*/
	__proto._initParticleSize=function(gradientSizeData){
		var gradientSize=new GradientDataNumber();
		var sizesData=gradientSizeData.sizes;
		for (var i=0,n=sizesData.length;i < n;i++){
			var valueData=sizesData[i];
			gradientSize.add(valueData.key,valueData.value);
		}
		return gradientSize;
	}

	/**
	*@private
	*/
	__proto._initParticleRotation=function(gradientData){
		var gradient=new GradientDataNumber();
		var angularVelocitysData=gradientData.angularVelocitys;
		for (var i=0,n=angularVelocitysData.length;i < n;i++){
			var valueData=angularVelocitysData[i];
			gradient.add(valueData.key,valueData.value / 180.0 *Math.PI);
		}
		return gradient;
	}

	/**
	*@private
	*/
	__proto._initParticleFrame=function(overTimeFramesData){
		var overTimeFrame=new GradientDataInt();
		var framesData=overTimeFramesData.frames;
		for (var i=0,n=framesData.length;i < n;i++){
			var frameData=framesData[i];
			overTimeFrame.add(frameData.key,frameData.value);
		}
		return overTimeFrame;
	}

	/**
	*@inheritDoc
	*/
	__proto._parse=function(data){
		laya.d3.core.Sprite3D.prototype._parse.call(this,data);
		var anglelToRad=Math.PI / 180.0;
		var i=0,n=0;
		var particleRender=this.particleRenderer;
		var material;
		var materialData=data.material;
		(materialData)&& (material=Loader.getRes(materialData.path));
		particleRender.sharedMaterial=material;
		var meshPath=data.meshPath;
		(meshPath)&& (particleRender.mesh=Loader.getRes(meshPath));
		particleRender.renderMode=data.renderMode;
		particleRender.stretchedBillboardCameraSpeedScale=data.stretchedBillboardCameraSpeedScale;
		particleRender.stretchedBillboardSpeedScale=data.stretchedBillboardSpeedScale;
		particleRender.stretchedBillboardLengthScale=data.stretchedBillboardLengthScale;
		particleRender.sortingFudge=data.sortingFudge ? data.sortingFudge :0.0;
		var particleSystem=this.particleSystem;
		particleSystem.isPerformanceMode=data.isPerformanceMode;
		particleSystem.duration=data.duration;
		particleSystem.looping=data.looping;
		particleSystem.prewarm=data.prewarm;
		particleSystem.startDelayType=data.startDelayType;
		particleSystem.startDelay=data.startDelay;
		particleSystem.startDelayMin=data.startDelayMin;
		particleSystem.startDelayMax=data.startDelayMax;
		particleSystem.startLifetimeType=data.startLifetimeType;
		particleSystem.startLifetimeConstant=data.startLifetimeConstant;
		particleSystem.startLifeTimeGradient=ShuriKenParticle3D._initStartLife(data.startLifetimeGradient);
		particleSystem.startLifetimeConstantMin=data.startLifetimeConstantMin;
		particleSystem.startLifetimeConstantMax=data.startLifetimeConstantMax;
		particleSystem.startLifeTimeGradientMin=ShuriKenParticle3D._initStartLife(data.startLifetimeGradientMin);
		particleSystem.startLifeTimeGradientMax=ShuriKenParticle3D._initStartLife(data.startLifetimeGradientMax);
		particleSystem.startSpeedType=data.startSpeedType;
		particleSystem.startSpeedConstant=data.startSpeedConstant;
		particleSystem.startSpeedConstantMin=data.startSpeedConstantMin;
		particleSystem.startSpeedConstantMax=data.startSpeedConstantMax;
		particleSystem.threeDStartSize=data.threeDStartSize;
		particleSystem.startSizeType=data.startSizeType;
		particleSystem.startSizeConstant=data.startSizeConstant;
		var startSizeConstantSeparateArray=data.startSizeConstantSeparate;
		var startSizeConstantSeparateElement=particleSystem.startSizeConstantSeparate.elements;
		startSizeConstantSeparateElement[0]=startSizeConstantSeparateArray[0];
		startSizeConstantSeparateElement[1]=startSizeConstantSeparateArray[1];
		startSizeConstantSeparateElement[2]=startSizeConstantSeparateArray[2];
		particleSystem.startSizeConstantMin=data.startSizeConstantMin;
		particleSystem.startSizeConstantMax=data.startSizeConstantMax;
		var startSizeConstantMinSeparateArray=data.startSizeConstantMinSeparate;
		var startSizeConstantMinSeparateElement=particleSystem.startSizeConstantMinSeparate.elements;
		startSizeConstantMinSeparateElement[0]=startSizeConstantMinSeparateArray[0];
		startSizeConstantMinSeparateElement[1]=startSizeConstantMinSeparateArray[1];
		startSizeConstantMinSeparateElement[2]=startSizeConstantMinSeparateArray[2];
		var startSizeConstantMaxSeparateArray=data.startSizeConstantMaxSeparate;
		var startSizeConstantMaxSeparateElement=particleSystem.startSizeConstantMaxSeparate.elements;
		startSizeConstantMaxSeparateElement[0]=startSizeConstantMaxSeparateArray[0];
		startSizeConstantMaxSeparateElement[1]=startSizeConstantMaxSeparateArray[1];
		startSizeConstantMaxSeparateElement[2]=startSizeConstantMaxSeparateArray[2];
		particleSystem.threeDStartRotation=data.threeDStartRotation;
		particleSystem.startRotationType=data.startRotationType;
		particleSystem.startRotationConstant=data.startRotationConstant *anglelToRad;
		var startRotationConstantSeparateArray=data.startRotationConstantSeparate;
		var startRotationConstantSeparateElement=particleSystem.startRotationConstantSeparate.elements;
		startRotationConstantSeparateElement[0]=startRotationConstantSeparateArray[0] *anglelToRad;
		startRotationConstantSeparateElement[1]=startRotationConstantSeparateArray[1] *anglelToRad;
		startRotationConstantSeparateElement[2]=startRotationConstantSeparateArray[2] *anglelToRad;
		particleSystem.startRotationConstantMin=data.startRotationConstantMin *anglelToRad;
		particleSystem.startRotationConstantMax=data.startRotationConstantMax *anglelToRad;
		var startRotationConstantMinSeparateArray=data.startRotationConstantMinSeparate;
		var startRotationConstantMinSeparateElement=particleSystem.startRotationConstantMinSeparate.elements;
		startRotationConstantMinSeparateElement[0]=startRotationConstantMinSeparateArray[0] *anglelToRad;
		startRotationConstantMinSeparateElement[1]=startRotationConstantMinSeparateArray[1] *anglelToRad;
		startRotationConstantMinSeparateElement[2]=startRotationConstantMinSeparateArray[2] *anglelToRad;
		var startRotationConstantMaxSeparateArray=data.startRotationConstantMaxSeparate;
		var startRotationConstantMaxSeparateElement=particleSystem.startRotationConstantMaxSeparate.elements;
		startRotationConstantMaxSeparateElement[0]=startRotationConstantMaxSeparateArray[0] *anglelToRad;
		startRotationConstantMaxSeparateElement[1]=startRotationConstantMaxSeparateArray[1] *anglelToRad;
		startRotationConstantMaxSeparateElement[2]=startRotationConstantMaxSeparateArray[2] *anglelToRad;
		particleSystem.randomizeRotationDirection=data.randomizeRotationDirection;
		particleSystem.startColorType=data.startColorType;
		var startColorConstantArray=data.startColorConstant;
		var startColorConstantElement=particleSystem.startColorConstant.elements;
		startColorConstantElement[0]=startColorConstantArray[0];
		startColorConstantElement[1]=startColorConstantArray[1];
		startColorConstantElement[2]=startColorConstantArray[2];
		startColorConstantElement[3]=startColorConstantArray[3];
		var startColorConstantMinArray=data.startColorConstantMin;
		var startColorConstantMinElement=particleSystem.startColorConstantMin.elements;
		startColorConstantMinElement[0]=startColorConstantMinArray[0];
		startColorConstantMinElement[1]=startColorConstantMinArray[1];
		startColorConstantMinElement[2]=startColorConstantMinArray[2];
		startColorConstantMinElement[3]=startColorConstantMinArray[3];
		var startColorConstantMaxArray=data.startColorConstantMax;
		var startColorConstantMaxElement=particleSystem.startColorConstantMax.elements;
		startColorConstantMaxElement[0]=startColorConstantMaxArray[0];
		startColorConstantMaxElement[1]=startColorConstantMaxArray[1];
		startColorConstantMaxElement[2]=startColorConstantMaxArray[2];
		startColorConstantMaxElement[3]=startColorConstantMaxArray[3];
		particleSystem.gravityModifier=data.gravityModifier;
		particleSystem.simulationSpace=data.simulationSpace;
		particleSystem.scaleMode=data.scaleMode;
		particleSystem.playOnAwake=data.playOnAwake;
		particleSystem.maxParticles=data.maxParticles;
		var autoRandomSeed=data.autoRandomSeed;
		(autoRandomSeed !=null)&& (particleSystem.autoRandomSeed=autoRandomSeed);
		var randomSeed=data.randomSeed;
		(randomSeed !=null)&& (particleSystem.randomSeed[0]=randomSeed);
		var emissionData=data.emission;
		var emission=particleSystem.emission;
		if (emissionData){
			emission.emissionRate=emissionData.emissionRate;
			var burstsData=emissionData.bursts;
			if (burstsData)
				for (i=0,n=burstsData.length;i < n;i++){
				var brust=burstsData[i];
				emission.addBurst(new Burst(brust.time,brust.min,brust.max));
			}
			emission.enbale=emissionData.enable;
			}else {
			emission.enbale=false;
		};
		var shapeData=data.shape;
		if (shapeData){
			var shape;
			switch (shapeData.shapeType){
				case 0:;
					var sphereShape;
					shape=sphereShape=new SphereShape();
					sphereShape.radius=shapeData.sphereRadius;
					sphereShape.emitFromShell=shapeData.sphereEmitFromShell;
					sphereShape.randomDirection=shapeData.sphereRandomDirection;
					break ;
				case 1:;
					var hemiSphereShape;
					shape=hemiSphereShape=new HemisphereShape();
					hemiSphereShape.radius=shapeData.hemiSphereRadius;
					hemiSphereShape.emitFromShell=shapeData.hemiSphereEmitFromShell;
					hemiSphereShape.randomDirection=shapeData.hemiSphereRandomDirection;
					break ;
				case 2:;
					var coneShape;
					shape=coneShape=new ConeShape();
					coneShape.angle=shapeData.coneAngle *anglelToRad;
					coneShape.radius=shapeData.coneRadius;
					coneShape.length=shapeData.coneLength;
					coneShape.emitType=shapeData.coneEmitType;
					coneShape.randomDirection=shapeData.coneRandomDirection;
					break ;
				case 3:;
					var boxShape;
					shape=boxShape=new BoxShape();
					boxShape.x=shapeData.boxX;
					boxShape.y=shapeData.boxY;
					boxShape.z=shapeData.boxZ;
					boxShape.randomDirection=shapeData.boxRandomDirection;
					break ;
				case 7:;
					var circleShape;
					shape=circleShape=new CircleShape();
					circleShape.radius=shapeData.circleRadius;
					circleShape.arc=shapeData.circleArc *anglelToRad;
					circleShape.emitFromEdge=shapeData.circleEmitFromEdge;
					circleShape.randomDirection=shapeData.circleRandomDirection;
					break ;
				default :;
					var tempShape;
					shape=tempShape=new CircleShape();
					tempShape.radius=shapeData.circleRadius;
					tempShape.arc=shapeData.circleArc *anglelToRad;
					tempShape.emitFromEdge=shapeData.circleEmitFromEdge;
					tempShape.randomDirection=shapeData.circleRandomDirection;
					break ;
				}
			shape.enable=shapeData.enable;
			particleSystem.shape=shape;
		};
		var velocityOverLifetimeData=data.velocityOverLifetime;
		if (velocityOverLifetimeData){
			var velocityData=velocityOverLifetimeData.velocity;
			var velocity;
			switch (velocityData.type){
				case 0:;
					var constantData=velocityData.constant;
					velocity=GradientVelocity.createByConstant(new Vector3(constantData[0],constantData[1],constantData[2]));
					break ;
				case 1:
					velocity=GradientVelocity.createByGradient(this._initParticleVelocity(velocityData.gradientX),this._initParticleVelocity(velocityData.gradientY),this._initParticleVelocity(velocityData.gradientZ));
					break ;
				case 2:;
					var constantMinData=velocityData.constantMin;
					var constantMaxData=velocityData.constantMax;
					velocity=GradientVelocity.createByRandomTwoConstant(new Vector3(constantMinData[0],constantMinData[1],constantMinData[2]),new Vector3(constantMaxData[0],constantMaxData[1],constantMaxData[2]));
					break ;
				case 3:
					velocity=GradientVelocity.createByRandomTwoGradient(this._initParticleVelocity(velocityData.gradientXMin),this._initParticleVelocity(velocityData.gradientXMax),this._initParticleVelocity(velocityData.gradientYMin),this._initParticleVelocity(velocityData.gradientYMax),this._initParticleVelocity(velocityData.gradientZMin),this._initParticleVelocity(velocityData.gradientZMax));
					break ;
				};
			var velocityOverLifetime=new VelocityOverLifetime(velocity);
			velocityOverLifetime.space=velocityOverLifetimeData.space;
			velocityOverLifetime.enbale=velocityOverLifetimeData.enable;
			particleSystem.velocityOverLifetime=velocityOverLifetime;
		};
		var colorOverLifetimeData=data.colorOverLifetime;
		if (colorOverLifetimeData){
			var colorData=colorOverLifetimeData.color;
			var color;
			switch (colorData.type){
				case 0:;
					var constColorData=colorData.constant;
					color=GradientColor.createByConstant(new Vector4(constColorData[0],constColorData[1],constColorData[2],constColorData[3]));
					break ;
				case 1:
					color=GradientColor.createByGradient(this._initParticleColor(colorData.gradient));
					break ;
				case 2:;
					var minConstColorData=colorData.constantMin;
					var maxConstColorData=colorData.constantMax;
					color=GradientColor.createByRandomTwoConstant(new Vector4(minConstColorData[0],minConstColorData[1],minConstColorData[2],minConstColorData[3]),new Vector4(maxConstColorData[0],maxConstColorData[1],maxConstColorData[2],maxConstColorData[3]));
					break ;
				case 3:
					color=GradientColor.createByRandomTwoGradient(this._initParticleColor(colorData.gradientMin),this._initParticleColor(colorData.gradientMax));
					break ;
				};
			var colorOverLifetime=new ColorOverLifetime(color);
			colorOverLifetime.enbale=colorOverLifetimeData.enable;
			particleSystem.colorOverLifetime=colorOverLifetime;
		};
		var sizeOverLifetimeData=data.sizeOverLifetime;
		if (sizeOverLifetimeData){
			var sizeData=sizeOverLifetimeData.size;
			var size;
			switch (sizeData.type){
				case 0:
					if (sizeData.separateAxes){
						size=GradientSize.createByGradientSeparate(this._initParticleSize(sizeData.gradientX),this._initParticleSize(sizeData.gradientY),this._initParticleSize(sizeData.gradientZ));
						}else {
						size=GradientSize.createByGradient(this._initParticleSize(sizeData.gradient));
					}
					break ;
				case 1:
					if (sizeData.separateAxes){
						var constantMinSeparateData=sizeData.constantMinSeparate;
						var constantMaxSeparateData=sizeData.constantMaxSeparate;
						size=GradientSize.createByRandomTwoConstantSeparate(new Vector3(constantMinSeparateData[0],constantMinSeparateData[1],constantMinSeparateData[2]),new Vector3(constantMaxSeparateData[0],constantMaxSeparateData[1],constantMaxSeparateData[2]));
						}else {
						size=GradientSize.createByRandomTwoConstant(sizeData.constantMin,sizeData.constantMax);
					}
					break ;
				case 2:
					if (sizeData.separateAxes){
						size=GradientSize.createByRandomTwoGradientSeparate(this._initParticleSize(sizeData.gradientXMin),this._initParticleSize(sizeData.gradientYMin),this._initParticleSize(sizeData.gradientZMin),this._initParticleSize(sizeData.gradientXMax),this._initParticleSize(sizeData.gradientYMax),this._initParticleSize(sizeData.gradientZMax));
						}else {
						size=GradientSize.createByRandomTwoGradient(this._initParticleSize(sizeData.gradientMin),this._initParticleSize(sizeData.gradientMax));
					}
					break ;
				};
			var sizeOverLifetime=new SizeOverLifetime(size);
			sizeOverLifetime.enbale=sizeOverLifetimeData.enable;
			particleSystem.sizeOverLifetime=sizeOverLifetime;
		};
		var rotationOverLifetimeData=data.rotationOverLifetime;
		if (rotationOverLifetimeData){
			var angularVelocityData=rotationOverLifetimeData.angularVelocity;
			var angularVelocity;
			switch (angularVelocityData.type){
				case 0:
					if (angularVelocityData.separateAxes){
						var conSep=angularVelocityData.constantSeparate;
						angularVelocity=GradientAngularVelocity.createByConstantSeparate(new Vector3(conSep[0]*anglelToRad,conSep[1]*anglelToRad,conSep[2]*anglelToRad));
						}else {
						angularVelocity=GradientAngularVelocity.createByConstant(angularVelocityData.constant *anglelToRad);
					}
					break ;
				case 1:
					if (angularVelocityData.separateAxes){
						angularVelocity=GradientAngularVelocity.createByGradientSeparate(this._initParticleRotation(angularVelocityData.gradientX),this._initParticleRotation(angularVelocityData.gradientY),this._initParticleRotation(angularVelocityData.gradientZ));
						}else {
						angularVelocity=GradientAngularVelocity.createByGradient(this._initParticleRotation(angularVelocityData.gradient));
					}
					break ;
				case 2:
					if (angularVelocityData.separateAxes){
						var minSep=angularVelocityData.constantMinSeparate;
						var maxSep=angularVelocityData.constantMaxSeparate;
						angularVelocity=GradientAngularVelocity.createByRandomTwoConstantSeparate(new Vector3(minSep[0] *anglelToRad,minSep[1] *anglelToRad,minSep[2] *anglelToRad),new Vector3(maxSep[0] *anglelToRad,maxSep[1] *anglelToRad,maxSep[2] *anglelToRad));
						}else {
						angularVelocity=GradientAngularVelocity.createByRandomTwoConstant(angularVelocityData.constantMin *anglelToRad,angularVelocityData.constantMax *anglelToRad);
					}
					break ;
				case 3:
					if (angularVelocityData.separateAxes){
						}else {
						angularVelocity=GradientAngularVelocity.createByRandomTwoGradient(this._initParticleRotation(angularVelocityData.gradientMin),this._initParticleRotation(angularVelocityData.gradientMax));
					}
					break ;
				};
			var rotationOverLifetime=new RotationOverLifetime(angularVelocity);
			rotationOverLifetime.enbale=rotationOverLifetimeData.enable;
			particleSystem.rotationOverLifetime=rotationOverLifetime;
		};
		var textureSheetAnimationData=data.textureSheetAnimation;
		if (textureSheetAnimationData){
			var frameData=textureSheetAnimationData.frame;
			var frameOverTime;
			switch (frameData.type){
				case 0:
					frameOverTime=FrameOverTime.createByConstant(frameData.constant);
					break ;
				case 1:
					frameOverTime=FrameOverTime.createByOverTime(this._initParticleFrame(frameData.overTime));
					break ;
				case 2:
					frameOverTime=FrameOverTime.createByRandomTwoConstant(frameData.constantMin,frameData.constantMax);
					break ;
				case 3:
					frameOverTime=FrameOverTime.createByRandomTwoOverTime(this._initParticleFrame(frameData.overTimeMin),this._initParticleFrame(frameData.overTimeMax));
					break ;
				};
			var startFrameData=textureSheetAnimationData.startFrame;
			var startFrame;
			switch (startFrameData.type){
				case 0:
					startFrame=StartFrame.createByConstant(startFrameData.constant);
					break ;
				case 1:
					startFrame=StartFrame.createByRandomTwoConstant(startFrameData.constantMin,startFrameData.constantMax);
					break ;
				};
			var textureSheetAnimation=new TextureSheetAnimation(frameOverTime,startFrame);
			textureSheetAnimation.enable=textureSheetAnimationData.enable;
			var tilesData=textureSheetAnimationData.tiles;
			textureSheetAnimation.tiles=new Vector2(tilesData[0],tilesData[1]);
			textureSheetAnimation.type=textureSheetAnimationData.type;
			textureSheetAnimation.randomRow=textureSheetAnimationData.randomRow;
			var rowIndex=textureSheetAnimationData.rowIndex;
			(rowIndex!==undefined)&& (textureSheetAnimation.rowIndex=rowIndex);
			textureSheetAnimation.cycles=textureSheetAnimationData.cycles;
			particleSystem.textureSheetAnimation=textureSheetAnimation;
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._activeHierarchy=function(activeChangeComponents){
		laya.display.Node.prototype._activeHierarchy.call(this,activeChangeComponents);
		(this.particleSystem.playOnAwake)&& (this.particleSystem.play());
	}

	/**
	*@inheritDoc
	*/
	__proto._inActiveHierarchy=function(activeChangeComponents){
		laya.display.Node.prototype._inActiveHierarchy.call(this,activeChangeComponents);
		(this.particleSystem.isAlive)&& (this.particleSystem.simulate(0,true));
	}

	/**
	*@private
	*/
	__proto.cloneTo=function(destObject){
		var destShuriKenParticle3D=destObject;
		var destParticleSystem=destShuriKenParticle3D._particleSystem;
		this._particleSystem.cloneTo(destParticleSystem);
		var destParticleRender=destShuriKenParticle3D._render;
		var particleRender=this._render;
		destParticleRender.sharedMaterials=particleRender.sharedMaterials;
		destParticleRender.enable=particleRender.enable;
		destParticleRender.renderMode=particleRender.renderMode;
		destParticleRender.mesh=particleRender.mesh;
		destParticleRender.stretchedBillboardCameraSpeedScale=particleRender.stretchedBillboardCameraSpeedScale;
		destParticleRender.stretchedBillboardSpeedScale=particleRender.stretchedBillboardSpeedScale;
		destParticleRender.stretchedBillboardLengthScale=particleRender.stretchedBillboardLengthScale;
		destParticleRender.sortingFudge=particleRender.sortingFudge;
		laya.d3.core.Sprite3D.prototype.cloneTo.call(this,destObject);
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
		this._particleSystem.destroy();
		this._particleSystem=null;
	}

	/**
	*获取粒子系统。
	*@return 粒子系统。
	*/
	__getset(0,__proto,'particleSystem',function(){
		return this._particleSystem;
	});

	/**
	*获取粒子渲染器。
	*@return 粒子渲染器。
	*/
	__getset(0,__proto,'particleRenderer',function(){
		return this._render;
	});

	ShuriKenParticle3D.__init__=function(){
		ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_BILLBOARD=ShuriKenParticle3D.shaderDefines.registerDefine("SPHERHBILLBOARD");
		ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_STRETCHEDBILLBOARD=ShuriKenParticle3D.shaderDefines.registerDefine("STRETCHEDBILLBOARD");
		ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_HORIZONTALBILLBOARD=ShuriKenParticle3D.shaderDefines.registerDefine("HORIZONTALBILLBOARD");
		ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_VERTICALBILLBOARD=ShuriKenParticle3D.shaderDefines.registerDefine("VERTICALBILLBOARD");
		ShuriKenParticle3D.SHADERDEFINE_COLOROVERLIFETIME=ShuriKenParticle3D.shaderDefines.registerDefine("COLOROVERLIFETIME");
		ShuriKenParticle3D.SHADERDEFINE_RANDOMCOLOROVERLIFETIME=ShuriKenParticle3D.shaderDefines.registerDefine("RANDOMCOLOROVERLIFETIME");
		ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECONSTANT=ShuriKenParticle3D.shaderDefines.registerDefine("VELOCITYOVERLIFETIMECONSTANT");
		ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECURVE=ShuriKenParticle3D.shaderDefines.registerDefine("VELOCITYOVERLIFETIMECURVE");
		ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCONSTANT=ShuriKenParticle3D.shaderDefines.registerDefine("VELOCITYOVERLIFETIMERANDOMCONSTANT");
		ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCURVE=ShuriKenParticle3D.shaderDefines.registerDefine("VELOCITYOVERLIFETIMERANDOMCURVE");
		ShuriKenParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONCURVE=ShuriKenParticle3D.shaderDefines.registerDefine("TEXTURESHEETANIMATIONCURVE");
		ShuriKenParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONRANDOMCURVE=ShuriKenParticle3D.shaderDefines.registerDefine("TEXTURESHEETANIMATIONRANDOMCURVE");
		ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIME=ShuriKenParticle3D.shaderDefines.registerDefine("ROTATIONOVERLIFETIME");
		ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMESEPERATE=ShuriKenParticle3D.shaderDefines.registerDefine("ROTATIONOVERLIFETIMESEPERATE");
		ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECONSTANT=ShuriKenParticle3D.shaderDefines.registerDefine("ROTATIONOVERLIFETIMECONSTANT");
		ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECURVE=ShuriKenParticle3D.shaderDefines.registerDefine("ROTATIONOVERLIFETIMECURVE");
		ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCONSTANTS=ShuriKenParticle3D.shaderDefines.registerDefine("ROTATIONOVERLIFETIMERANDOMCONSTANTS");
		ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCURVES=ShuriKenParticle3D.shaderDefines.registerDefine("ROTATIONOVERLIFETIMERANDOMCURVES");
		ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVE=ShuriKenParticle3D.shaderDefines.registerDefine("SIZEOVERLIFETIMECURVE");
		ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVESEPERATE=ShuriKenParticle3D.shaderDefines.registerDefine("SIZEOVERLIFETIMECURVESEPERATE");
		ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVES=ShuriKenParticle3D.shaderDefines.registerDefine("SIZEOVERLIFETIMERANDOMCURVES");
		ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVESSEPERATE=ShuriKenParticle3D.shaderDefines.registerDefine("SIZEOVERLIFETIMERANDOMCURVESSEPERATE");
		ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_MESH=ShuriKenParticle3D.shaderDefines.registerDefine("RENDERMODE_MESH");
		ShuriKenParticle3D.SHADERDEFINE_SHAPE=ShuriKenParticle3D.shaderDefines.registerDefine("SHAPE");
	}

	ShuriKenParticle3D._initStartLife=function(gradientData){
		var gradient=new GradientDataNumber();
		var startLifetimesData=gradientData.startLifetimes;
		for (var i=0,n=startLifetimesData.length;i < n;i++){
			var valueData=startLifetimesData[i];
			gradient.add(valueData.key,valueData.value);
		}
		return gradient
	}

	ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_BILLBOARD=0;
	ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_STRETCHEDBILLBOARD=0;
	ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_HORIZONTALBILLBOARD=0;
	ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_VERTICALBILLBOARD=0;
	ShuriKenParticle3D.SHADERDEFINE_COLOROVERLIFETIME=0;
	ShuriKenParticle3D.SHADERDEFINE_RANDOMCOLOROVERLIFETIME=0;
	ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECONSTANT=0;
	ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMECURVE=0;
	ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCONSTANT=0;
	ShuriKenParticle3D.SHADERDEFINE_VELOCITYOVERLIFETIMERANDOMCURVE=0;
	ShuriKenParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONCURVE=0;
	ShuriKenParticle3D.SHADERDEFINE_TEXTURESHEETANIMATIONRANDOMCURVE=0;
	ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIME=0;
	ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMESEPERATE=0;
	ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECONSTANT=0;
	ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMECURVE=0;
	ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCONSTANTS=0;
	ShuriKenParticle3D.SHADERDEFINE_ROTATIONOVERLIFETIMERANDOMCURVES=0;
	ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVE=0;
	ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMECURVESEPERATE=0;
	ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVES=0;
	ShuriKenParticle3D.SHADERDEFINE_SIZEOVERLIFETIMERANDOMCURVESSEPERATE=0;
	ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_MESH=0;
	ShuriKenParticle3D.SHADERDEFINE_SHAPE=0;
	__static(ShuriKenParticle3D,
	['WORLDPOSITION',function(){return this.WORLDPOSITION=Shader3D.propertyNameToID("u_WorldPosition");},'WORLDROTATION',function(){return this.WORLDROTATION=Shader3D.propertyNameToID("u_WorldRotation");},'POSITIONSCALE',function(){return this.POSITIONSCALE=Shader3D.propertyNameToID("u_PositionScale");},'SIZESCALE',function(){return this.SIZESCALE=Shader3D.propertyNameToID("u_SizeScale");},'SCALINGMODE',function(){return this.SCALINGMODE=Shader3D.propertyNameToID("u_ScalingMode");},'GRAVITY',function(){return this.GRAVITY=Shader3D.propertyNameToID("u_Gravity");},'THREEDSTARTROTATION',function(){return this.THREEDSTARTROTATION=Shader3D.propertyNameToID("u_ThreeDStartRotation");},'STRETCHEDBILLBOARDLENGTHSCALE',function(){return this.STRETCHEDBILLBOARDLENGTHSCALE=Shader3D.propertyNameToID("u_StretchedBillboardLengthScale");},'STRETCHEDBILLBOARDSPEEDSCALE',function(){return this.STRETCHEDBILLBOARDSPEEDSCALE=Shader3D.propertyNameToID("u_StretchedBillboardSpeedScale");},'SIMULATIONSPACE',function(){return this.SIMULATIONSPACE=Shader3D.propertyNameToID("u_SimulationSpace");},'CURRENTTIME',function(){return this.CURRENTTIME=Shader3D.propertyNameToID("u_CurrentTime");},'VOLVELOCITYCONST',function(){return this.VOLVELOCITYCONST=Shader3D.propertyNameToID("u_VOLVelocityConst");},'VOLVELOCITYGRADIENTX',function(){return this.VOLVELOCITYGRADIENTX=Shader3D.propertyNameToID("u_VOLVelocityGradientX");},'VOLVELOCITYGRADIENTY',function(){return this.VOLVELOCITYGRADIENTY=Shader3D.propertyNameToID("u_VOLVelocityGradientY");},'VOLVELOCITYGRADIENTZ',function(){return this.VOLVELOCITYGRADIENTZ=Shader3D.propertyNameToID("u_VOLVelocityGradientZ");},'VOLVELOCITYCONSTMAX',function(){return this.VOLVELOCITYCONSTMAX=Shader3D.propertyNameToID("u_VOLVelocityConstMax");},'VOLVELOCITYGRADIENTXMAX',function(){return this.VOLVELOCITYGRADIENTXMAX=Shader3D.propertyNameToID("u_VOLVelocityGradientMaxX");},'VOLVELOCITYGRADIENTYMAX',function(){return this.VOLVELOCITYGRADIENTYMAX=Shader3D.propertyNameToID("u_VOLVelocityGradientMaxY");},'VOLVELOCITYGRADIENTZMAX',function(){return this.VOLVELOCITYGRADIENTZMAX=Shader3D.propertyNameToID("u_VOLVelocityGradientMaxZ");},'VOLSPACETYPE',function(){return this.VOLSPACETYPE=Shader3D.propertyNameToID("u_VOLSpaceType");},'COLOROVERLIFEGRADIENTALPHAS',function(){return this.COLOROVERLIFEGRADIENTALPHAS=Shader3D.propertyNameToID("u_ColorOverLifeGradientAlphas");},'COLOROVERLIFEGRADIENTCOLORS',function(){return this.COLOROVERLIFEGRADIENTCOLORS=Shader3D.propertyNameToID("u_ColorOverLifeGradientColors");},'MAXCOLOROVERLIFEGRADIENTALPHAS',function(){return this.MAXCOLOROVERLIFEGRADIENTALPHAS=Shader3D.propertyNameToID("u_MaxColorOverLifeGradientAlphas");},'MAXCOLOROVERLIFEGRADIENTCOLORS',function(){return this.MAXCOLOROVERLIFEGRADIENTCOLORS=Shader3D.propertyNameToID("u_MaxColorOverLifeGradientColors");},'SOLSIZEGRADIENT',function(){return this.SOLSIZEGRADIENT=Shader3D.propertyNameToID("u_SOLSizeGradient");},'SOLSIZEGRADIENTX',function(){return this.SOLSIZEGRADIENTX=Shader3D.propertyNameToID("u_SOLSizeGradientX");},'SOLSIZEGRADIENTY',function(){return this.SOLSIZEGRADIENTY=Shader3D.propertyNameToID("u_SOLSizeGradientY");},'SOLSizeGradientZ',function(){return this.SOLSizeGradientZ=Shader3D.propertyNameToID("u_SOLSizeGradientZ");},'SOLSizeGradientMax',function(){return this.SOLSizeGradientMax=Shader3D.propertyNameToID("u_SOLSizeGradientMax");},'SOLSIZEGRADIENTXMAX',function(){return this.SOLSIZEGRADIENTXMAX=Shader3D.propertyNameToID("u_SOLSizeGradientMaxX");},'SOLSIZEGRADIENTYMAX',function(){return this.SOLSIZEGRADIENTYMAX=Shader3D.propertyNameToID("u_SOLSizeGradientMaxY");},'SOLSizeGradientZMAX',function(){return this.SOLSizeGradientZMAX=Shader3D.propertyNameToID("u_SOLSizeGradientMaxZ");},'ROLANGULARVELOCITYCONST',function(){return this.ROLANGULARVELOCITYCONST=Shader3D.propertyNameToID("u_ROLAngularVelocityConst");},'ROLANGULARVELOCITYCONSTSEPRARATE',function(){return this.ROLANGULARVELOCITYCONSTSEPRARATE=Shader3D.propertyNameToID("u_ROLAngularVelocityConstSeprarate");},'ROLANGULARVELOCITYGRADIENT',function(){return this.ROLANGULARVELOCITYGRADIENT=Shader3D.propertyNameToID("u_ROLAngularVelocityGradient");},'ROLANGULARVELOCITYGRADIENTX',function(){return this.ROLANGULARVELOCITYGRADIENTX=Shader3D.propertyNameToID("u_ROLAngularVelocityGradientX");},'ROLANGULARVELOCITYGRADIENTY',function(){return this.ROLANGULARVELOCITYGRADIENTY=Shader3D.propertyNameToID("u_ROLAngularVelocityGradientY");},'ROLANGULARVELOCITYGRADIENTZ',function(){return this.ROLANGULARVELOCITYGRADIENTZ=Shader3D.propertyNameToID("u_ROLAngularVelocityGradientZ");},'ROLANGULARVELOCITYCONSTMAX',function(){return this.ROLANGULARVELOCITYCONSTMAX=Shader3D.propertyNameToID("u_ROLAngularVelocityConstMax");},'ROLANGULARVELOCITYCONSTMAXSEPRARATE',function(){return this.ROLANGULARVELOCITYCONSTMAXSEPRARATE=Shader3D.propertyNameToID("u_ROLAngularVelocityConstMaxSeprarate");},'ROLANGULARVELOCITYGRADIENTMAX',function(){return this.ROLANGULARVELOCITYGRADIENTMAX=Shader3D.propertyNameToID("u_ROLAngularVelocityGradientMax");},'ROLANGULARVELOCITYGRADIENTXMAX',function(){return this.ROLANGULARVELOCITYGRADIENTXMAX=Shader3D.propertyNameToID("u_ROLAngularVelocityGradientMaxX");},'ROLANGULARVELOCITYGRADIENTYMAX',function(){return this.ROLANGULARVELOCITYGRADIENTYMAX=Shader3D.propertyNameToID("u_ROLAngularVelocityGradientMaxY");},'ROLANGULARVELOCITYGRADIENTZMAX',function(){return this.ROLANGULARVELOCITYGRADIENTZMAX=Shader3D.propertyNameToID("u_ROLAngularVelocityGradientMaxZ");},'ROLANGULARVELOCITYGRADIENTWMAX',function(){return this.ROLANGULARVELOCITYGRADIENTWMAX=Shader3D.propertyNameToID("u_ROLAngularVelocityGradientMaxW");},'TEXTURESHEETANIMATIONCYCLES',function(){return this.TEXTURESHEETANIMATIONCYCLES=Shader3D.propertyNameToID("u_TSACycles");},'TEXTURESHEETANIMATIONSUBUVLENGTH',function(){return this.TEXTURESHEETANIMATIONSUBUVLENGTH=Shader3D.propertyNameToID("u_TSASubUVLength");},'TEXTURESHEETANIMATIONGRADIENTUVS',function(){return this.TEXTURESHEETANIMATIONGRADIENTUVS=Shader3D.propertyNameToID("u_TSAGradientUVs");},'TEXTURESHEETANIMATIONGRADIENTMAXUVS',function(){return this.TEXTURESHEETANIMATIONGRADIENTMAXUVS=Shader3D.propertyNameToID("u_TSAMaxGradientUVs");},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines(RenderableSprite3D.shaderDefines);}
	]);
	return ShuriKenParticle3D;
})(RenderableSprite3D)


/**

*/
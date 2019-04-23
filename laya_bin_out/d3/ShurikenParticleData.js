/**
*<code>/**
*<code>BaseShape</code> 类用于粒子形状。
*/
//class laya.d3.core.particleShuriKen.module.shape.BaseShape
var BaseShape=(function(){
	function BaseShape(){
		/**是否启用。*/
		this.enable=false;
		/**随机方向。*/
		this.randomDirection=false;
	}

	__class(BaseShape,'laya.d3.core.particleShuriKen.module.shape.BaseShape');
	var __proto=BaseShape.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**@private */
	__proto._getShapeBoundBox=function(boundBox){
		throw new Error("BaseShape: must override it.");
	}

	/**@private */
	__proto._getSpeedBoundBox=function(boundBox){
		throw new Error("BaseShape: must override it.");
	}

	/**
	*用于生成粒子初始位置和方向。
	*@param position 粒子位置。
	*@param direction 粒子方向。
	*/
	__proto.generatePositionAndDirection=function(position,direction,rand,randomSeeds){
		throw new Error("BaseShape: must override it.");
	}

	/**
	*@private
	*/
	__proto._calculateProceduralBounds=function(boundBox,emitterPosScale,minMaxBounds){
		this._getShapeBoundBox(boundBox);
		var min=boundBox.min;
		var max=boundBox.max;
		Vector3.multiply(min,emitterPosScale,min);
		Vector3.multiply(max,emitterPosScale,max);
		var speedBounds=new BoundBox(new Vector3(),new Vector3());
		if (this.randomDirection){
			speedBounds.min=new Vector3(-1,-1,-1);
			speedBounds.max=new Vector3(1,1,1);
		}
		else{
			this._getSpeedBoundBox(speedBounds);
		};
		var maxSpeedBound=new BoundBox(new Vector3(),new Vector3());
		var maxSpeedMin=maxSpeedBound.min;
		var maxSpeedMax=maxSpeedBound.max;
		Vector3.scale(speedBounds.min,minMaxBounds.y,maxSpeedMin);
		Vector3.scale(speedBounds.max,minMaxBounds.y,maxSpeedMax);
		Vector3.add(boundBox.min,maxSpeedMin,maxSpeedMin);
		Vector3.add(boundBox.max,maxSpeedMax,maxSpeedMax);
		Vector3.min(boundBox.min,maxSpeedMin,boundBox.min);
		Vector3.max(boundBox.max,maxSpeedMin,boundBox.max);
		var minSpeedBound=new BoundBox(new Vector3(),new Vector3());
		var minSpeedMin=minSpeedBound.min;
		var minSpeedMax=minSpeedBound.max;
		Vector3.scale(speedBounds.min,minMaxBounds.x,minSpeedMin);
		Vector3.scale(speedBounds.max,minMaxBounds.x,minSpeedMax);
		Vector3.min(minSpeedBound.min,minSpeedMax,maxSpeedMin);
		Vector3.max(minSpeedBound.min,minSpeedMax,maxSpeedMax);
		Vector3.min(boundBox.min,maxSpeedMin,boundBox.min);
		Vector3.max(boundBox.max,maxSpeedMin,boundBox.max);
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destShape=destObject;
		destShape.enable=this.enable;
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destShape=/*__JS__ */new this.constructor();
		this.cloneTo(destShape);
		return destShape;
	}

	return BaseShape;
})()


/**
*@private
*/
//class laya.d3.core.particleShuriKen.ShurikenParticleData
var ShurikenParticleData=(function(){
	function ShurikenParticleData(){}
	__class(ShurikenParticleData,'laya.d3.core.particleShuriKen.ShurikenParticleData');
	ShurikenParticleData._getStartLifetimeFromGradient=function(startLifeTimeGradient,emissionTime){
		for (var i=1,n=startLifeTimeGradient.gradientCount;i < n;i++){
			var key=startLifeTimeGradient.getKeyByIndex(i);
			if (key >=emissionTime){
				var lastKey=startLifeTimeGradient.getKeyByIndex(i-1);
				var age=(emissionTime-lastKey)/ (key-lastKey);
				return MathUtil.lerp(startLifeTimeGradient.getValueByIndex(i-1),startLifeTimeGradient.getValueByIndex(i),age)
			}
		}
		throw new Error("ShurikenParticleData: can't get value foam startLifeTimeGradient.");
	}

	ShurikenParticleData._randomInvertRoationArray=function(rotatonE,outE,randomizeRotationDirection,rand,randomSeeds){
		var randDic=NaN;
		if (rand){
			rand.seed=randomSeeds[6];
			randDic=rand.getFloat();
			randomSeeds[6]=rand.seed;
			}else {
			randDic=Math.random();
		}
		if (randDic < randomizeRotationDirection){
			outE[0]=-rotatonE[0];
			outE[1]=-rotatonE[1];
			outE[2]=-rotatonE[2];
			}else {
			outE[0]=rotatonE[0];
			outE[1]=rotatonE[1];
			outE[2]=rotatonE[2];
		}
	}

	ShurikenParticleData._randomInvertRoation=function(rotaton,randomizeRotationDirection,rand,randomSeeds){
		var randDic=NaN;
		if (rand){
			rand.seed=randomSeeds[6];
			randDic=rand.getFloat();
			randomSeeds[6]=rand.seed;
			}else {
			randDic=Math.random();
		}
		if (randDic < randomizeRotationDirection)
			rotaton=-rotaton;
		return rotaton;
	}

	ShurikenParticleData.create=function(particleSystem,particleRender,transform){
		var autoRandomSeed=particleSystem.autoRandomSeed;
		var rand=particleSystem._rand;
		var randomSeeds=particleSystem._randomSeeds;
		switch (particleSystem.startColorType){
			case 0:;
				var constantStartColorE=particleSystem.startColorConstant.elements;
				ShurikenParticleData.startColor[0]=constantStartColorE[0];
				ShurikenParticleData.startColor[1]=constantStartColorE[1];
				ShurikenParticleData.startColor[2]=constantStartColorE[2];
				ShurikenParticleData.startColor[3]=constantStartColorE[3];
				break ;
			case 2:
				if (autoRandomSeed){
					MathUtil.lerpVector4(particleSystem.startColorConstantMin.elements,particleSystem.startColorConstantMax.elements,Math.random(),ShurikenParticleData.startColor);
					}else {
					rand.seed=randomSeeds[3];
					MathUtil.lerpVector4(particleSystem.startColorConstantMin.elements,particleSystem.startColorConstantMax.elements,rand.getFloat(),ShurikenParticleData.startColor);
					randomSeeds[3]=rand.seed;
				}
				break ;
			};
		var colorOverLifetime=particleSystem.colorOverLifetime;
		if (colorOverLifetime && colorOverLifetime.enbale){
			var color=colorOverLifetime.color;
			switch (color.type){
				case 0:
					ShurikenParticleData.startColor[0]=ShurikenParticleData.startColor[0] *color.constant.x;
					ShurikenParticleData.startColor[1]=ShurikenParticleData.startColor[1] *color.constant.y;
					ShurikenParticleData.startColor[2]=ShurikenParticleData.startColor[2] *color.constant.z;
					ShurikenParticleData.startColor[3]=ShurikenParticleData.startColor[3] *color.constant.w;
					break ;
				case 2:;
					var colorRandom=NaN;
					if (autoRandomSeed){
						colorRandom=Math.random();
						}else {
						rand.seed=randomSeeds[10];
						colorRandom=rand.getFloat();
						randomSeeds[10]=rand.seed;
					};
					var minConstantColor=color.constantMin;
					var maxConstantColor=color.constantMax;
					ShurikenParticleData.startColor[0]=ShurikenParticleData.startColor[0] *MathUtil.lerp(minConstantColor.x,maxConstantColor.x,colorRandom);
					ShurikenParticleData.startColor[1]=ShurikenParticleData.startColor[1] *MathUtil.lerp(minConstantColor.y,maxConstantColor.y,colorRandom);
					ShurikenParticleData.startColor[2]=ShurikenParticleData.startColor[2] *MathUtil.lerp(minConstantColor.z,maxConstantColor.z,colorRandom);
					ShurikenParticleData.startColor[3]=ShurikenParticleData.startColor[3] *MathUtil.lerp(minConstantColor.w,maxConstantColor.w,colorRandom);
					break ;
				}
		};
		var particleSize=ShurikenParticleData.startSize;
		switch (particleSystem.startSizeType){
			case 0:
				if (particleSystem.threeDStartSize){
					var startSizeConstantSeparate=particleSystem.startSizeConstantSeparate;
					particleSize[0]=startSizeConstantSeparate.x;
					particleSize[1]=startSizeConstantSeparate.y;
					particleSize[2]=startSizeConstantSeparate.z;
					}else {
					particleSize[0]=particleSize[1]=particleSize[2]=particleSystem.startSizeConstant;
				}
				break ;
			case 2:
				if (particleSystem.threeDStartSize){
					var startSizeConstantMinSeparate=particleSystem.startSizeConstantMinSeparate;
					var startSizeConstantMaxSeparate=particleSystem.startSizeConstantMaxSeparate;
					if (autoRandomSeed){
						particleSize[0]=MathUtil.lerp(startSizeConstantMinSeparate.x,startSizeConstantMaxSeparate.x,Math.random());
						particleSize[1]=MathUtil.lerp(startSizeConstantMinSeparate.y,startSizeConstantMaxSeparate.y,Math.random());
						particleSize[2]=MathUtil.lerp(startSizeConstantMinSeparate.z,startSizeConstantMaxSeparate.z,Math.random());
						}else {
						rand.seed=randomSeeds[4];
						particleSize[0]=MathUtil.lerp(startSizeConstantMinSeparate.x,startSizeConstantMaxSeparate.x,rand.getFloat());
						particleSize[1]=MathUtil.lerp(startSizeConstantMinSeparate.y,startSizeConstantMaxSeparate.y,rand.getFloat());
						particleSize[2]=MathUtil.lerp(startSizeConstantMinSeparate.z,startSizeConstantMaxSeparate.z,rand.getFloat());
						randomSeeds[4]=rand.seed;
					}
					}else {
					if (autoRandomSeed){
						particleSize[0]=particleSize[1]=particleSize[2]=MathUtil.lerp(particleSystem.startSizeConstantMin,particleSystem.startSizeConstantMax,Math.random());
						}else {
						rand.seed=randomSeeds[4];
						particleSize[0]=particleSize[1]=particleSize[2]=MathUtil.lerp(particleSystem.startSizeConstantMin,particleSystem.startSizeConstantMax,rand.getFloat());
						randomSeeds[4]=rand.seed;
					}
				}
				break ;
			};
		var sizeOverLifetime=particleSystem.sizeOverLifetime;
		if (sizeOverLifetime && sizeOverLifetime.enbale && sizeOverLifetime.size.type===1){
			var size=sizeOverLifetime.size;
			if (size.separateAxes){
				if (autoRandomSeed){
					particleSize[0]=particleSize[0] *MathUtil.lerp(size.constantMinSeparate.x,size.constantMaxSeparate.x,Math.random());
					particleSize[1]=particleSize[1] *MathUtil.lerp(size.constantMinSeparate.y,size.constantMaxSeparate.y,Math.random());
					particleSize[2]=particleSize[2] *MathUtil.lerp(size.constantMinSeparate.z,size.constantMaxSeparate.z,Math.random());
					}else {
					rand.seed=randomSeeds[11];
					particleSize[0]=particleSize[0] *MathUtil.lerp(size.constantMinSeparate.x,size.constantMaxSeparate.x,rand.getFloat());
					particleSize[1]=particleSize[1] *MathUtil.lerp(size.constantMinSeparate.y,size.constantMaxSeparate.y,rand.getFloat());
					particleSize[2]=particleSize[2] *MathUtil.lerp(size.constantMinSeparate.z,size.constantMaxSeparate.z,rand.getFloat());
					randomSeeds[11]=rand.seed;
				}
				}else {
				var randomSize=NaN;
				if (autoRandomSeed){
					randomSize=MathUtil.lerp(size.constantMin,size.constantMax,Math.random());
					}else {
					rand.seed=randomSeeds[11];
					randomSize=MathUtil.lerp(size.constantMin,size.constantMax,rand.getFloat());
					randomSeeds[11]=rand.seed;
				}
				particleSize[0]=particleSize[0] *randomSize;
				particleSize[1]=particleSize[1] *randomSize;
				particleSize[2]=particleSize[2] *randomSize;
			}
		};
		var renderMode=particleRender.renderMode;
		if (renderMode!==1){
			switch (particleSystem.startRotationType){
				case 0:
					if (particleSystem.threeDStartRotation){
						var startRotationConstantSeparate=particleSystem.startRotationConstantSeparate;
						var randomRotationE=ShurikenParticleData._tempVector30.elements;
						ShurikenParticleData._randomInvertRoationArray(startRotationConstantSeparate.elements,randomRotationE,particleSystem.randomizeRotationDirection,autoRandomSeed ? null :rand,randomSeeds);
						ShurikenParticleData.startRotation[0]=randomRotationE[0];
						ShurikenParticleData.startRotation[1]=randomRotationE[1];
						if (renderMode!==4)
							ShurikenParticleData.startRotation[2]=-randomRotationE[2];
						else
						ShurikenParticleData.startRotation[2]=randomRotationE[2];
						}else {
						ShurikenParticleData.startRotation[0]=ShurikenParticleData._randomInvertRoation(particleSystem.startRotationConstant,particleSystem.randomizeRotationDirection,autoRandomSeed ? null :rand,randomSeeds);
						ShurikenParticleData.startRotation[1]=0;
						ShurikenParticleData.startRotation[2]=0;
					}
					break ;
				case 2:
					if (particleSystem.threeDStartRotation){
						var startRotationConstantMinSeparate=particleSystem.startRotationConstantMinSeparate;
						var startRotationConstantMaxSeparate=particleSystem.startRotationConstantMaxSeparate;
						var lerpRoationE=ShurikenParticleData._tempVector30.elements;
						if (autoRandomSeed){
							lerpRoationE[0]=MathUtil.lerp(startRotationConstantMinSeparate.x,startRotationConstantMaxSeparate.x,Math.random());
							lerpRoationE[1]=MathUtil.lerp(startRotationConstantMinSeparate.y,startRotationConstantMaxSeparate.y,Math.random());
							lerpRoationE[2]=MathUtil.lerp(startRotationConstantMinSeparate.z,startRotationConstantMaxSeparate.z,Math.random());
							}else {
							rand.seed=randomSeeds[5];
							lerpRoationE[0]=MathUtil.lerp(startRotationConstantMinSeparate.x,startRotationConstantMaxSeparate.x,rand.getFloat());
							lerpRoationE[1]=MathUtil.lerp(startRotationConstantMinSeparate.y,startRotationConstantMaxSeparate.y,rand.getFloat());
							lerpRoationE[2]=MathUtil.lerp(startRotationConstantMinSeparate.z,startRotationConstantMaxSeparate.z,rand.getFloat());
							randomSeeds[5]=rand.seed;
						}
						ShurikenParticleData._randomInvertRoationArray(lerpRoationE,lerpRoationE,particleSystem.randomizeRotationDirection,autoRandomSeed ? null :rand,randomSeeds);
						ShurikenParticleData.startRotation[0]=lerpRoationE[0];
						ShurikenParticleData.startRotation[1]=lerpRoationE[1];
						if (renderMode!==4)
							ShurikenParticleData.startRotation[2]=-lerpRoationE[2];
						else
						ShurikenParticleData.startRotation[2]=lerpRoationE[2];
						}else {
						if (autoRandomSeed){
							ShurikenParticleData.startRotation[0]=ShurikenParticleData._randomInvertRoation(MathUtil.lerp(particleSystem.startRotationConstantMin,particleSystem.startRotationConstantMax,Math.random()),particleSystem.randomizeRotationDirection,autoRandomSeed ? null :rand,randomSeeds);
							}else {
							rand.seed=randomSeeds[5];
							ShurikenParticleData.startRotation[0]=ShurikenParticleData._randomInvertRoation(MathUtil.lerp(particleSystem.startRotationConstantMin,particleSystem.startRotationConstantMax,rand.getFloat()),particleSystem.randomizeRotationDirection,autoRandomSeed ? null :rand,randomSeeds);
							randomSeeds[5]=rand.seed;
						}
					}
					break ;
				}
		}
		switch (particleSystem.startLifetimeType){
			case 0:
				ShurikenParticleData.startLifeTime=particleSystem.startLifetimeConstant;
				break ;
			case 1:
				ShurikenParticleData.startLifeTime=ShurikenParticleData._getStartLifetimeFromGradient(particleSystem.startLifeTimeGradient,particleSystem.emissionTime);
				break ;
			case 2:
				if (autoRandomSeed){
					ShurikenParticleData.startLifeTime=MathUtil.lerp(particleSystem.startLifetimeConstantMin,particleSystem.startLifetimeConstantMax,Math.random());
					}else {
					rand.seed=randomSeeds[7];
					ShurikenParticleData.startLifeTime=MathUtil.lerp(particleSystem.startLifetimeConstantMin,particleSystem.startLifetimeConstantMax,rand.getFloat());
					randomSeeds[7]=rand.seed;
				}
				break ;
			case 3:;
				var emissionTime=particleSystem.emissionTime;
				if (autoRandomSeed){
					ShurikenParticleData.startLifeTime=MathUtil.lerp(ShurikenParticleData._getStartLifetimeFromGradient(particleSystem.startLifeTimeGradientMin,emissionTime),ShurikenParticleData._getStartLifetimeFromGradient(particleSystem.startLifeTimeGradientMax,emissionTime),Math.random());
					}else {
					rand.seed=randomSeeds[7];
					ShurikenParticleData.startLifeTime=MathUtil.lerp(ShurikenParticleData._getStartLifetimeFromGradient(particleSystem.startLifeTimeGradientMin,emissionTime),ShurikenParticleData._getStartLifetimeFromGradient(particleSystem.startLifeTimeGradientMax,emissionTime),rand.getFloat());
					randomSeeds[7]=rand.seed;
				}
				break ;
			}
		switch (particleSystem.startSpeedType){
			case 0:
				ShurikenParticleData.startSpeed=particleSystem.startSpeedConstant;
				break ;
			case 2:
				if (autoRandomSeed){
					ShurikenParticleData.startSpeed=MathUtil.lerp(particleSystem.startSpeedConstantMin,particleSystem.startSpeedConstantMax,Math.random());
					}else {
					rand.seed=randomSeeds[8];
					ShurikenParticleData.startSpeed=MathUtil.lerp(particleSystem.startSpeedConstantMin,particleSystem.startSpeedConstantMax,rand.getFloat());
					randomSeeds[8]=rand.seed;
				}
				break ;
			};
		var textureSheetAnimation=particleSystem.textureSheetAnimation;
		var enableSheetAnimation=textureSheetAnimation && textureSheetAnimation.enable;
		if (enableSheetAnimation){
			var title=textureSheetAnimation.tiles;
			var titleX=title.x,titleY=title.y;
			var subU=1.0 / titleX,subV=1.0 / titleY;
			var startFrameCount=0;
			var startFrame=textureSheetAnimation.startFrame;
			switch (startFrame.type){
				case 0:
					startFrameCount=startFrame.constant;
					break ;
				case 1:
					if (autoRandomSeed){
						startFrameCount=MathUtil.lerp(startFrame.constantMin,startFrame.constantMax,Math.random());
						}else {
						rand.seed=randomSeeds[14];
						startFrameCount=MathUtil.lerp(startFrame.constantMin,startFrame.constantMax,rand.getFloat());
						randomSeeds[14]=rand.seed;
					}
					break ;
				};
			var frame=textureSheetAnimation.frame;
			switch (frame.type){
				case 0:
					startFrameCount+=frame.constant;
					break ;
				case 2:
					if (autoRandomSeed){
						startFrameCount+=MathUtil.lerp(frame.constantMin,frame.constantMax,Math.random());
						}else {
						rand.seed=randomSeeds[15];
						startFrameCount+=MathUtil.lerp(frame.constantMin,frame.constantMax,rand.getFloat());
						randomSeeds[15]=rand.seed;
					}
					break ;
				};
			var startRow=0;
			switch (textureSheetAnimation.type){
				case 0:
					startRow=Math.floor(startFrameCount / titleX);
					break ;
				case 1:
					if (textureSheetAnimation.randomRow){
						if (autoRandomSeed){
							startRow=Math.floor(Math.random()*titleY);
							}else {
							rand.seed=randomSeeds[13];
							startRow=Math.floor(rand.getFloat()*titleY);
							randomSeeds[13]=rand.seed;
						}
						}else {
						startRow=textureSheetAnimation.rowIndex;
					}
					break ;
				};
			var startCol=Math.floor(startFrameCount % titleX);
			ShurikenParticleData.startUVInfo=ShurikenParticleData.startUVInfo;
			ShurikenParticleData.startUVInfo[0]=subU;
			ShurikenParticleData.startUVInfo[1]=subV;
			ShurikenParticleData.startUVInfo[2]=startCol *subU;
			ShurikenParticleData.startUVInfo[3]=startRow *subV;
			}else {
			ShurikenParticleData.startUVInfo=ShurikenParticleData.startUVInfo;
			ShurikenParticleData.startUVInfo[0]=1.0;
			ShurikenParticleData.startUVInfo[1]=1.0;
			ShurikenParticleData.startUVInfo[2]=0.0;
			ShurikenParticleData.startUVInfo[3]=0.0;
		}
		switch (particleSystem.simulationSpace){
			case 0:;
				var positionE=transform.position.elements;
				ShurikenParticleData.simulationWorldPostion[0]=positionE[0];
				ShurikenParticleData.simulationWorldPostion[1]=positionE[1];
				ShurikenParticleData.simulationWorldPostion[2]=positionE[2];
				var rotationE=transform.rotation.elements;
				ShurikenParticleData.simulationWorldRotation[0]=rotationE[0];
				ShurikenParticleData.simulationWorldRotation[1]=rotationE[1];
				ShurikenParticleData.simulationWorldRotation[2]=rotationE[2];
				ShurikenParticleData.simulationWorldRotation[3]=rotationE[3];
				break ;
			case 1:
				break ;
			default :
				throw new Error("ShurikenParticleMaterial: SimulationSpace value is invalid.");
				break ;
			}
	}

	ShurikenParticleData.startLifeTime=NaN;
	ShurikenParticleData.startSpeed=NaN;
	__static(ShurikenParticleData,
	['_tempVector30',function(){return this._tempVector30=new Vector3();},'_tempQuaternion',function(){return this._tempQuaternion=new Quaternion();},'startColor',function(){return this.startColor=new Float32Array(4);},'startSize',function(){return this.startSize=new Float32Array(3);},'startRotation',function(){return this.startRotation=new Float32Array(3);},'startUVInfo',function(){return this.startUVInfo=new Float32Array(4);},'simulationWorldPostion',function(){return this.simulationWorldPostion=new Float32Array(3);},'simulationWorldRotation',function(){return this.simulationWorldRotation=new Float32Array(4);}
	]);
	return ShurikenParticleData;
})()


/**

*/
*/
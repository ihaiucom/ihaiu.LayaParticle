/**
*@private
*/
//class laya.particle.ParticleData
var ParticleData=(function(){
	function ParticleData(){
		this.position=null;
		this.velocity=null;
		this.startColor=null;
		this.endColor=null;
		this.sizeRotation=null;
		this.radius=null;
		this.radian=null;
		this.durationAddScale=NaN;
		this.time=NaN;
	}

	__class(ParticleData,'laya.particle.ParticleData');
	ParticleData.Create=function(settings,position,velocity,time){
		var particleData=new ParticleData();
		particleData.position=position;
		MathUtil.scaleVector3(velocity,settings.emitterVelocitySensitivity,ParticleData._tempVelocity);
		var horizontalVelocity=MathUtil.lerp(settings.minHorizontalVelocity,settings.maxHorizontalVelocity,Math.random());
		var horizontalAngle=Math.random()*Math.PI *2;
		ParticleData._tempVelocity[0]+=horizontalVelocity *Math.cos(horizontalAngle);
		ParticleData._tempVelocity[2]+=horizontalVelocity *Math.sin(horizontalAngle);
		ParticleData._tempVelocity[1]+=MathUtil.lerp(settings.minVerticalVelocity,settings.maxVerticalVelocity,Math.random());
		particleData.velocity=ParticleData._tempVelocity;
		particleData.startColor=ParticleData._tempStartColor;
		particleData.endColor=ParticleData._tempEndColor;
		var i=0;
		if (settings.disableColor){
			for (i=0;i < 3;i++){
				particleData.startColor[i]=1;
				particleData.endColor[i]=1;
			}
			particleData.startColor[i]=MathUtil.lerp(settings.minStartColor[i],settings.maxStartColor[i],Math.random());
			particleData.endColor[i]=MathUtil.lerp(settings.minEndColor[i],settings.maxEndColor[i],Math.random());
		}
		else{
			if (settings.colorComponentInter){
				for (i=0;i < 4;i++){
					particleData.startColor[i]=MathUtil.lerp(settings.minStartColor[i],settings.maxStartColor[i],Math.random());
					particleData.endColor[i]=MathUtil.lerp(settings.minEndColor[i],settings.maxEndColor[i],Math.random());
				}
				}else {
				MathUtil.lerpVector4(settings.minStartColor,settings.maxStartColor,Math.random(),particleData.startColor);
				MathUtil.lerpVector4(settings.minEndColor,settings.maxEndColor,Math.random(),particleData.endColor);
			}
		}
		particleData.sizeRotation=ParticleData._tempSizeRotation;
		var sizeRandom=Math.random();
		particleData.sizeRotation[0]=MathUtil.lerp(settings.minStartSize,settings.maxStartSize,sizeRandom);
		particleData.sizeRotation[1]=MathUtil.lerp(settings.minEndSize,settings.maxEndSize,sizeRandom);
		particleData.sizeRotation[2]=MathUtil.lerp(settings.minRotateSpeed,settings.maxRotateSpeed,Math.random());
		particleData.radius=ParticleData._tempRadius;
		var radiusRandom=Math.random();
		particleData.radius[0]=MathUtil.lerp(settings.minStartRadius,settings.maxStartRadius,radiusRandom);
		particleData.radius[1]=MathUtil.lerp(settings.minEndRadius,settings.maxEndRadius,radiusRandom);
		particleData.radian=ParticleData._tempRadian;
		particleData.radian[0]=MathUtil.lerp(settings.minHorizontalStartRadian,settings.maxHorizontalStartRadian,Math.random());
		particleData.radian[1]=MathUtil.lerp(settings.minVerticalStartRadian,settings.maxVerticalStartRadian,Math.random());
		var useEndRadian=settings.useEndRadian;
		particleData.radian[2]=useEndRadian?MathUtil.lerp(settings.minHorizontalEndRadian,settings.maxHorizontalEndRadian,Math.random()):particleData.radian[0];
		particleData.radian[3]=useEndRadian?MathUtil.lerp(settings.minVerticalEndRadian,settings.maxVerticalEndRadian,Math.random()):particleData.radian[1];
		particleData.durationAddScale=settings.ageAddScale *Math.random();
		particleData.time=time;
		return particleData;
	}

	__static(ParticleData,
	['_tempVelocity',function(){return this._tempVelocity=new Float32Array(3);},'_tempStartColor',function(){return this._tempStartColor=new Float32Array(4);},'_tempEndColor',function(){return this._tempEndColor=new Float32Array(4);},'_tempSizeRotation',function(){return this._tempSizeRotation=new Float32Array(3);},'_tempRadius',function(){return this._tempRadius=new Float32Array(2);},'_tempRadian',function(){return this._tempRadian=new Float32Array(4);}
	]);
	return ParticleData;
})()

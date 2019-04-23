//class laya.particle.ParticleEmitter
var ParticleEmitter=(function(){
	function ParticleEmitter(templet,particlesPerSecond,initialPosition){
		this._templet=null;
		this._timeBetweenParticles=NaN;
		this._previousPosition=null;
		this._timeLeftOver=0;
		this._tempVelocity=new Float32Array([0,0,0]);
		this._tempPosition=new Float32Array([0,0,0]);
		this._templet=templet;
		this._timeBetweenParticles=1.0 / particlesPerSecond;
		this._previousPosition=initialPosition;
	}

	__class(ParticleEmitter,'laya.particle.ParticleEmitter');
	var __proto=ParticleEmitter.prototype;
	__proto.update=function(elapsedTime,newPosition){
		elapsedTime=elapsedTime / 1000;
		if (elapsedTime > 0){
			MathUtil.subtractVector3(newPosition,this._previousPosition,this._tempVelocity);
			MathUtil.scaleVector3(this._tempVelocity,1 / elapsedTime,this._tempVelocity);
			var timeToSpend=this._timeLeftOver+elapsedTime;
			var currentTime=-this._timeLeftOver;
			while (timeToSpend > this._timeBetweenParticles){
				currentTime+=this._timeBetweenParticles;
				timeToSpend-=this._timeBetweenParticles;
				MathUtil.lerpVector3(this._previousPosition,newPosition,currentTime / elapsedTime,this._tempPosition);
				this._templet.addParticleArray(this._tempPosition,this._tempVelocity);
			}
			this._timeLeftOver=timeToSpend;
		}
		this._previousPosition[0]=newPosition[0];
		this._previousPosition[1]=newPosition[1];
		this._previousPosition[2]=newPosition[2];
	}

	return ParticleEmitter;
})()


/**
*@private
*/

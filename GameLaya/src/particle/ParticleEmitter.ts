import ParticleTemplateBase from "./ParticleTemplateBase";
import MathUtil = Laya.MathUtil;
export default class ParticleEmitter
{
    _templet: ParticleTemplateBase =null;
    _timeBetweenParticles: number=NaN;
    _previousPosition: Float32Array=null;
    _timeLeftOver=0;
    _tempVelocity=new Float32Array([0,0,0]);
    _tempPosition=new Float32Array([0,0,0]);

    
    constructor(templet: ParticleTemplateBase, particlesPerSecond: number, initialPosition: Float32Array)
    {

		this._templet=templet;
		this._timeBetweenParticles=1.0 / particlesPerSecond;
		this._previousPosition=initialPosition;
    }


    update(elapsedTime: number, newPosition: Float32Array): void
    {
        elapsedTime=elapsedTime / 1000;
        if (elapsedTime > 0)
        {
			MathUtil.subtractVector3(newPosition,this._previousPosition,this._tempVelocity);
			MathUtil.scaleVector3(this._tempVelocity,1 / elapsedTime,this._tempVelocity);
			var timeToSpend=this._timeLeftOver+elapsedTime;
            var currentTime=-this._timeLeftOver;
            
            while (timeToSpend > this._timeBetweenParticles)
            {
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


}
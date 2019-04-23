import MathUtil = Laya.MathUtil;
import Matrix = Laya.Matrix;


export default class CanvasShader
{
    u_Duration: number = NaN;
    u_EndVelocity: number = NaN;
    u_Gravity: Float32Array = null;
    a_Position: Float32Array = null;
    a_Velocity: Float32Array = null;
    a_StartColor: Float32Array = null;
    a_EndColor: Float32Array = null;
    a_SizeRotation: Float32Array = null;
    a_Radius: Float32Array = null;
    a_Radian: Float32Array = null;
    a_AgeAddScale: number = null;
    gl_Position: Float32Array = null;
    v_Color: Float32Array = null;
    oSize: number = NaN;

    _color = new Float32Array(4);
    _position = new Float32Array(3);

    constructor()
    {

    }

    getLen(position: Float32Array): number
    {
        return Math.sqrt(position[0] *position[0]+position[1] *position[1]+position[2] *position[2]);
    }

    ComputeParticlePosition(position: Float32Array, velocity: Float32Array, age: number, normalizedAge: number): Float32Array
    {
        this._position[0]=position[0];
		this._position[1]=position[1];
        this._position[2]=position[2];
        
		var startVelocity=this.getLen(velocity);
		var endVelocity=startVelocity *this.u_EndVelocity;
		var velocityIntegral=startVelocity *normalizedAge+(endVelocity-startVelocity)*normalizedAge *normalizedAge / 2.0;
		var lenVelocity=NaN;
		lenVelocity=this.getLen(velocity);
		var i=0,len=0;
		len=3;
        for (i=0;i < len;i++)
        {
			this._position[i]=this._position[i]+(velocity[i] / lenVelocity)*velocityIntegral *this.u_Duration;
			this._position[i]+=this.u_Gravity[i] *age *normalizedAge;
        };
        
		var radius= MathUtil.lerp(this.a_Radius[0],this.a_Radius[1],normalizedAge);
		var radianHorizontal= MathUtil.lerp(this.a_Radian[0],this.a_Radian[2],normalizedAge);
		var radianVertical= MathUtil.lerp(this.a_Radian[1],this.a_Radian[3],normalizedAge);
		var r=Math.cos(radianVertical)*radius;
		this._position[1]+=Math.sin(radianVertical)*radius;
		this._position[0]+=Math.cos(radianHorizontal)*r;
		this._position[2]+=Math.sin(radianHorizontal)*r;
		return new Float32Array([this._position[0],this._position[1],0.0,1.0]);
    }


    ComputeParticleSize(startSize: number, endSize: number, normalizedAge: number): number
    {
        var size=MathUtil.lerp(startSize,endSize,normalizedAge);
		return size;
    }

    ComputeParticleRotation(rot: number, age: number): number
    {
        return rot *age;
    }

    ComputeParticleColor(startColor: Float32Array, endColor: Float32Array, normalizedAge: number): Float32Array
    {
        var rst=this._color;
		MathUtil.lerpVector4(startColor,endColor,normalizedAge,rst);
		rst[3]=rst[3]*normalizedAge *(1.0-normalizedAge)*(1.0-normalizedAge)*6.7;
		return rst;
    }

    clamp(value: number, min: number, max: number): number
    {
        if(value<min)return min;
		if(value>max)return max;
		return value;
    }

    getData(age: number): Array<any>
    {
        age *=1.0+this.a_AgeAddScale;
		var normalizedAge=this.clamp(age / this.u_Duration,0.0,1.0);
		this.gl_Position=this.ComputeParticlePosition(this.a_Position,this.a_Velocity,age,normalizedAge);
		var pSize=this.ComputeParticleSize(this.a_SizeRotation[0],this.a_SizeRotation[1],normalizedAge);
		var rotation=this.ComputeParticleRotation(this.a_SizeRotation[2],age);
		this.v_Color=this.ComputeParticleColor(this.a_StartColor,this.a_EndColor,normalizedAge);
		var matric=new Matrix();
		var scale=NaN;
		scale=pSize/this.oSize*2;
		matric.scale(scale,scale);
		matric.rotate(rotation);
		matric.setTranslate(this.gl_Position[0],-this.gl_Position[1]);
		var alpha=NaN;
		alpha=this.v_Color[3];
		return [this.v_Color,alpha,matric,this.v_Color[0]*alpha,this.v_Color[1]*alpha,this.v_Color[2]*alpha];
    }

}
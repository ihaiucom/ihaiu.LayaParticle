//class laya.particle.particleUtils.CanvasShader
var CanvasShader=(function(){
	function CanvasShader(){
		this.u_Duration=NaN;
		this.u_EndVelocity=NaN;
		this.u_Gravity=null;
		this.a_Position=null;
		this.a_Velocity=null;
		this.a_StartColor=null;
		this.a_EndColor=null;
		this.a_SizeRotation=null;
		this.a_Radius=null;
		this.a_Radian=null;
		this.a_AgeAddScale=NaN;
		this.gl_Position=null;
		this.v_Color=null;
		this.oSize=NaN;
		this._color=new Float32Array(4);
		this._position=new Float32Array(3);
	}

	__class(CanvasShader,'laya.particle.particleUtils.CanvasShader');
	var __proto=CanvasShader.prototype;
	__proto.getLen=function(position){
		return Math.sqrt(position[0] *position[0]+position[1] *position[1]+position[2] *position[2]);
	}

	__proto.ComputeParticlePosition=function(position,velocity,age,normalizedAge){
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
		for (i=0;i < len;i++){
			this._position[i]=this._position[i]+(velocity[i] / lenVelocity)*velocityIntegral *this.u_Duration;
			this._position[i]+=this.u_Gravity[i] *age *normalizedAge;
		};
		var radius=MathUtil.lerp(this.a_Radius[0],this.a_Radius[1],normalizedAge);
		var radianHorizontal=MathUtil.lerp(this.a_Radian[0],this.a_Radian[2],normalizedAge);
		var radianVertical=MathUtil.lerp(this.a_Radian[1],this.a_Radian[3],normalizedAge);
		var r=Math.cos(radianVertical)*radius;
		this._position[1]+=Math.sin(radianVertical)*radius;
		this._position[0]+=Math.cos(radianHorizontal)*r;
		this._position[2]+=Math.sin(radianHorizontal)*r;
		return new Float32Array([this._position[0],this._position[1],0.0,1.0]);
	}

	__proto.ComputeParticleSize=function(startSize,endSize,normalizedAge){
		var size=MathUtil.lerp(startSize,endSize,normalizedAge);
		return size;
	}

	__proto.ComputeParticleRotation=function(rot,age){
		return rot *age;
	}

	__proto.ComputeParticleColor=function(startColor,endColor,normalizedAge){
		var rst=this._color;
		MathUtil.lerpVector4(startColor,endColor,normalizedAge,rst);
		rst[3]=rst[3]*normalizedAge *(1.0-normalizedAge)*(1.0-normalizedAge)*6.7;
		return rst;
	}

	__proto.clamp=function(value,min,max){
		if(value<min)return min;
		if(value>max)return max;
		return value;
	}

	__proto.getData=function(age){
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

	return CanvasShader;
})()


/**
*@private
*/

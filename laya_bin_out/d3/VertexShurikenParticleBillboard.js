/**
*<code>VertexShurikenParticle</code> 类用于创建粒子顶点结构。
*/
//class laya.d3.graphics.Vertex.VertexShurikenParticleBillboard extends laya.d3.graphics.Vertex.VertexShuriKenParticle
var VertexShurikenParticleBillboard=(function(_super){
	function VertexShurikenParticleBillboard(cornerTextureCoordinate,positionStartLifeTime,velocity,startColor,startSize,startRotation0,startRotation1,startRotation2,ageAddScale,time,startSpeed,randoms0,randoms1,simulationWorldPostion){
		/**@private */
		this._cornerTextureCoordinate=null;
		/**@private */
		this._positionStartLifeTime=null;
		/**@private */
		this._velocity=null;
		/**@private */
		this._startColor=null;
		/**@private */
		this._startSize=null;
		/**@private */
		this._startRotation0=null;
		/**@private */
		this._startRotation1=null;
		/**@private */
		this._startRotation2=null;
		/**@private */
		this._startLifeTime=NaN;
		/**@private */
		this._time=NaN;
		/**@private */
		this._startSpeed=NaN;
		/**@private */
		this._randoms0=null;
		/**@private */
		this._randoms1=null;
		/**@private */
		this._simulationWorldPostion=null;
		VertexShurikenParticleBillboard.__super.call(this);
		this._cornerTextureCoordinate=cornerTextureCoordinate;
		this._positionStartLifeTime=positionStartLifeTime;
		this._velocity=velocity;
		this._startColor=startColor;
		this._startSize=startSize;
		this._startRotation0=startRotation0;
		this._startRotation1=startRotation1;
		this._startRotation2=startRotation2;
		this._startLifeTime=ageAddScale;
		this._time=time;
		this._startSpeed=startSpeed;
		this._randoms0=this.random0;
		this._randoms1=this.random1;
		this._simulationWorldPostion=simulationWorldPostion;
	}

	__class(VertexShurikenParticleBillboard,'laya.d3.graphics.Vertex.VertexShurikenParticleBillboard',_super);
	var __proto=VertexShurikenParticleBillboard.prototype;
	__getset(0,__proto,'cornerTextureCoordinate',function(){
		return this._cornerTextureCoordinate;
	});

	__getset(0,__proto,'random1',function(){
		return this._randoms1;
	});

	__getset(0,__proto,'startRotation2',function(){
		return this._startRotation2;
	});

	__getset(0,__proto,'positionStartLifeTime',function(){
		return this._positionStartLifeTime;
	});

	__getset(0,__proto,'velocity',function(){
		return this._velocity;
	});

	__getset(0,__proto,'random0',function(){
		return this._randoms0;
	});

	__getset(0,__proto,'startSize',function(){
		return this._startSize;
	});

	__getset(0,__proto,'startColor',function(){
		return this._startColor;
	});

	__getset(0,__proto,'startRotation0',function(){
		return this._startRotation0;
	});

	__getset(0,__proto,'startRotation1',function(){
		return this._startRotation1;
	});

	__getset(0,__proto,'startLifeTime',function(){
		return this._startLifeTime;
	});

	__getset(0,__proto,'time',function(){
		return this._time;
	});

	__getset(0,__proto,'startSpeed',function(){
		return this._startSpeed;
	});

	__getset(0,__proto,'simulationWorldPostion',function(){
		return this._simulationWorldPostion;
	});

	__getset(1,VertexShurikenParticleBillboard,'vertexDeclaration',function(){
		return VertexShurikenParticleBillboard._vertexDeclaration;
	},laya.d3.graphics.Vertex.VertexShuriKenParticle._$SET_vertexDeclaration);

	__static(VertexShurikenParticleBillboard,
	['_vertexDeclaration',function(){return this._vertexDeclaration=new VertexDeclaration(152,[
		new VertexElement(0,/*laya.d3.graphics.VertexElementFormat.Vector4*/"vector4",/*laya.d3.graphics.Vertex.VertexShuriKenParticle.PARTICLE_CORNERTEXTURECOORDINATE0*/0),
		new VertexElement(16,/*laya.d3.graphics.VertexElementFormat.Vector4*/"vector4",/*laya.d3.graphics.Vertex.VertexShuriKenParticle.PARTICLE_SHAPEPOSITIONSTARTLIFETIME*/4),
		new VertexElement(32,/*laya.d3.graphics.VertexElementFormat.Vector4*/"vector4",/*laya.d3.graphics.Vertex.VertexShuriKenParticle.PARTICLE_DIRECTIONTIME*/5),
		new VertexElement(48,/*laya.d3.graphics.VertexElementFormat.Vector4*/"vector4",/*laya.d3.graphics.Vertex.VertexShuriKenParticle.PARTICLE_STARTCOLOR0*/6),
		new VertexElement(64,/*laya.d3.graphics.VertexElementFormat.Vector3*/"vector3",/*laya.d3.graphics.Vertex.VertexShuriKenParticle.PARTICLE_STARTSIZE*/8),
		new VertexElement(76,/*laya.d3.graphics.VertexElementFormat.Vector3*/"vector3",/*laya.d3.graphics.Vertex.VertexShuriKenParticle.PARTICLE_STARTROTATION*/9),
		new VertexElement(88,/*laya.d3.graphics.VertexElementFormat.Single*/"single",/*laya.d3.graphics.Vertex.VertexShuriKenParticle.PARTICLE_STARTSPEED*/10),
		new VertexElement(92,/*laya.d3.graphics.VertexElementFormat.Vector4*/"vector4",/*laya.d3.graphics.Vertex.VertexShuriKenParticle.PARTICLE_RANDOM0*/11),
		new VertexElement(108,/*laya.d3.graphics.VertexElementFormat.Vector4*/"vector4",/*laya.d3.graphics.Vertex.VertexShuriKenParticle.PARTICLE_RANDOM1*/12),
		new VertexElement(124,/*laya.d3.graphics.VertexElementFormat.Vector3*/"vector3",/*laya.d3.graphics.Vertex.VertexShuriKenParticle.PARTICLE_SIMULATIONWORLDPOSTION*/13),
		new VertexElement(136,/*laya.d3.graphics.VertexElementFormat.Vector4*/"vector4",/*laya.d3.graphics.Vertex.VertexShuriKenParticle.PARTICLE_SIMULATIONWORLDROTATION*/14)]);}
	]);
	return VertexShurikenParticleBillboard;
})(VertexShuriKenParticle)


/**

*/
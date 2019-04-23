/**
*<code>FrameOverTime</code> 类用于创建时间帧。
*/
//class laya.d3.core.particleShuriKen.module.FrameOverTime
var FrameOverTime=(function(){
	function FrameOverTime(){
		/**@private */
		this._type=0;
		/**@private */
		this._constant=0;
		/**@private */
		this._overTime=null;
		/**@private */
		this._constantMin=0;
		/**@private */
		this._constantMax=0;
		/**@private */
		this._overTimeMin=null;
		/**@private */
		this._overTimeMax=null;
	}

	__class(FrameOverTime,'laya.d3.core.particleShuriKen.module.FrameOverTime');
	var __proto=FrameOverTime.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destFrameOverTime=destObject;
		destFrameOverTime._type=this._type;
		destFrameOverTime._constant=this._constant;
		this._overTime.cloneTo(destFrameOverTime._overTime);
		destFrameOverTime._constantMin=this._constantMin;
		destFrameOverTime._constantMax=this._constantMax;
		this._overTimeMin.cloneTo(destFrameOverTime._overTimeMin);
		this._overTimeMax.cloneTo(destFrameOverTime._overTimeMax);
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destFrameOverTime=/*__JS__ */new this.constructor();
		this.cloneTo(destFrameOverTime);
		return destFrameOverTime;
	}

	/**
	*时间帧。
	*/
	__getset(0,__proto,'frameOverTimeData',function(){
		return this._overTime;
	});

	/**
	*固定帧。
	*/
	__getset(0,__proto,'constant',function(){
		return this._constant;
	});

	/**
	*生命周期旋转类型,0常量模式，1曲线模式，2随机双常量模式，3随机双曲线模式。
	*/
	__getset(0,__proto,'type',function(){
		return this._type;
	});

	/**
	*最小时间帧。
	*/
	__getset(0,__proto,'frameOverTimeDataMin',function(){
		return this._overTimeMin;
	});

	/**
	*最小固定帧。
	*/
	__getset(0,__proto,'constantMin',function(){
		return this._constantMin;
	});

	/**
	*最大时间帧。
	*/
	__getset(0,__proto,'frameOverTimeDataMax',function(){
		return this._overTimeMax;
	});

	/**
	*最大固定帧。
	*/
	__getset(0,__proto,'constantMax',function(){
		return this._constantMax;
	});

	FrameOverTime.createByConstant=function(constant){
		var rotationOverLifetime=new FrameOverTime();
		rotationOverLifetime._type=0;
		rotationOverLifetime._constant=constant;
		return rotationOverLifetime;
	}

	FrameOverTime.createByOverTime=function(overTime){
		var rotationOverLifetime=new FrameOverTime();
		rotationOverLifetime._type=1;
		rotationOverLifetime._overTime=overTime;
		return rotationOverLifetime;
	}

	FrameOverTime.createByRandomTwoConstant=function(constantMin,constantMax){
		var rotationOverLifetime=new FrameOverTime();
		rotationOverLifetime._type=2;
		rotationOverLifetime._constantMin=constantMin;
		rotationOverLifetime._constantMax=constantMax;
		return rotationOverLifetime;
	}

	FrameOverTime.createByRandomTwoOverTime=function(gradientFrameMin,gradientFrameMax){
		var rotationOverLifetime=new FrameOverTime();
		rotationOverLifetime._type=3;
		rotationOverLifetime._overTimeMin=gradientFrameMin;
		rotationOverLifetime._overTimeMax=gradientFrameMax;
		return rotationOverLifetime;
	}

	return FrameOverTime;
})()


/**
*...
*@author ...
*/
//class laya.d3.graphics.Vertex.VertexMesh
var VertexMesh=(function(){
	function VertexMesh(){}
	__class(VertexMesh,'laya.d3.graphics.Vertex.VertexMesh');
	VertexMesh.getVertexDeclaration=function(vertexFlag,compatible){
		(compatible===void 0)&& (compatible=true);
		var verDec=VertexMesh._vertexDeclarationMap[vertexFlag];
		if (!verDec){
			var subFlags=vertexFlag.split(",");
			var offset=0;
			var elements=[];
			for (var i=0,n=subFlags.length;i < n;i++){
				var element;
				switch (subFlags[i]){
					case "POSITION":
						element=new VertexElement(offset,/*laya.d3.graphics.VertexElementFormat.Vector3*/"vector3",/*CLASS CONST:laya.d3.graphics.Vertex.VertexMesh.MESH_POSITION0*/0);
						offset+=12;
						break ;
					case "NORMAL":
						element=new VertexElement(offset,/*laya.d3.graphics.VertexElementFormat.Vector3*/"vector3",/*CLASS CONST:laya.d3.graphics.Vertex.VertexMesh.MESH_NORMAL0*/3);
						offset+=12;
						break ;
					case "COLOR":
						element=new VertexElement(offset,/*laya.d3.graphics.VertexElementFormat.Vector4*/"vector4",/*CLASS CONST:laya.d3.graphics.Vertex.VertexMesh.MESH_COLOR0*/1);
						offset+=16;
						break ;
					case "UV":
						element=new VertexElement(offset,/*laya.d3.graphics.VertexElementFormat.Vector2*/"vector2",/*CLASS CONST:laya.d3.graphics.Vertex.VertexMesh.MESH_TEXTURECOORDINATE0*/2);
						offset+=8;
						break ;
					case "UV1":
						element=new VertexElement(offset,/*laya.d3.graphics.VertexElementFormat.Vector2*/"vector2",/*CLASS CONST:laya.d3.graphics.Vertex.VertexMesh.MESH_TEXTURECOORDINATE1*/8);
						offset+=8;
						break ;
					case "BLENDWEIGHT":
						element=new VertexElement(offset,/*laya.d3.graphics.VertexElementFormat.Vector4*/"vector4",/*CLASS CONST:laya.d3.graphics.Vertex.VertexMesh.MESH_BLENDWEIGHT0*/7);
						offset+=16;
						break ;
					case "BLENDINDICES":
						if (compatible){
							element=new VertexElement(offset,/*laya.d3.graphics.VertexElementFormat.Vector4*/"vector4",/*CLASS CONST:laya.d3.graphics.Vertex.VertexMesh.MESH_BLENDINDICES0*/6);
							offset+=16;
							}else {
							element=new VertexElement(offset,/*laya.d3.graphics.VertexElementFormat.Byte4*/"byte4",/*CLASS CONST:laya.d3.graphics.Vertex.VertexMesh.MESH_BLENDINDICES0*/6);
							offset+=4;
						}
						break ;
					case "TANGENT":
						element=new VertexElement(offset,/*laya.d3.graphics.VertexElementFormat.Vector4*/"vector4",/*CLASS CONST:laya.d3.graphics.Vertex.VertexMesh.MESH_TANGENT0*/5);
						offset+=16;
						break ;
					default :
						throw "VertexMesh: unknown vertex flag.";
					}
				elements.push(element);
			}
			verDec=new VertexDeclaration(offset,elements);
			VertexMesh._vertexDeclarationMap[vertexFlag]=verDec;
		}
		return verDec;
	}

	VertexMesh.MESH_POSITION0=0;
	VertexMesh.MESH_COLOR0=1;
	VertexMesh.MESH_TEXTURECOORDINATE0=2;
	VertexMesh.MESH_NORMAL0=3;
	VertexMesh.MESH_TANGENT0=5;
	VertexMesh.MESH_BLENDINDICES0=6;
	VertexMesh.MESH_BLENDWEIGHT0=7;
	VertexMesh.MESH_TEXTURECOORDINATE1=8;
	VertexMesh._vertexDeclarationMap={};
	return VertexMesh;
})()


/**

*/
/**
*<code>Plane</code> 类用于创建平面。
*/
//class laya.d3.math.Plane
var Plane=(function(){
	function Plane(normal,d){
		/**平面的向量*/
		this.normal=null;
		/**平面到坐标系原点的距离*/
		this.distance=NaN;
		(d===void 0)&& (d=0);
		this.normal=normal;
		this.distance=d;
	}

	__class(Plane,'laya.d3.math.Plane');
	var __proto=Plane.prototype;
	/**
	*更改平面法线向量的系数，使之成单位长度。
	*/
	__proto.normalize=function(){
		var normalE=this.normal.elements;
		var normalEX=normalE[0];
		var normalEY=normalE[1];
		var normalEZ=normalE[2];
		var magnitude=1 / Math.sqrt(normalEX *normalEX+normalEY *normalEY+normalEZ *normalEZ);
		normalE[0]=normalEX *magnitude;
		normalE[1]=normalEY *magnitude;
		normalE[2]=normalEZ *magnitude;
		this.distance *=magnitude;
	}

	Plane.createPlaneBy3P=function(point1,point2,point3){
		var point1e=point1.elements;
		var point2e=point2.elements;
		var point3e=point3.elements;
		var x1=point2e[0]-point1e[0];
		var y1=point2e[1]-point1e[1];
		var z1=point2e[2]-point1e[2];
		var x2=point3e[0]-point1e[0];
		var y2=point3e[1]-point1e[1];
		var z2=point3e[2]-point1e[2];
		var yz=(y1 *z2)-(z1 *y2);
		var xz=(z1 *x2)-(x1 *z2);
		var xy=(x1 *y2)-(y1 *x2);
		var invPyth=1 / (Math.sqrt((yz *yz)+(xz *xz)+(xy *xy)));
		var x=yz *invPyth;
		var y=xz *invPyth;
		var z=xy *invPyth;
		var TEMPVec3e=Plane._TEMPVec3.elements;
		TEMPVec3e[0]=x;
		TEMPVec3e[1]=y;
		TEMPVec3e[2]=z;
		var d=-((x *point1e[0])+(y *point1e[1])+(z *point1e[2]));
		var plane=new Plane(Plane._TEMPVec3,d);
		return plane;
	}

	Plane.PlaneIntersectionType_Back=0;
	Plane.PlaneIntersectionType_Front=1;
	Plane.PlaneIntersectionType_Intersecting=2;
	__static(Plane,
	['_TEMPVec3',function(){return this._TEMPVec3=new Vector3();}
	]);
	return Plane;
})()


/**
*...
*@author ...
*/
//class laya.d3.physics.shape.HeightfieldColliderShape
var HeightfieldColliderShape=(function(){
	function HeightfieldColliderShape(){}
	__class(HeightfieldColliderShape,'laya.d3.physics.shape.HeightfieldColliderShape');
	return HeightfieldColliderShape;
})()


/**

*/
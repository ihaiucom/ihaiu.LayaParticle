/**
*<code>BoundSphere</code> 类用于创建包围球。
*/
//class laya.d3.math.BoundSphere
var BoundSphere=(function(){
	function BoundSphere(center,radius){
		/**包围球的中心。*/
		this.center=null;
		/**包围球的半径。*/
		this.radius=NaN;
		this.center=center;
		this.radius=radius;
	}

	__class(BoundSphere,'laya.d3.math.BoundSphere');
	var __proto=BoundSphere.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	__proto.toDefault=function(){
		this.center.toDefault();
		this.radius=0;
	}

	/**
	*判断射线是否与碰撞球交叉，并返回交叉距离。
	*@param ray 射线。
	*@return 距离交叉点的距离，-1表示不交叉。
	*/
	__proto.intersectsRayDistance=function(ray){
		return CollisionUtils.intersectsRayAndSphereRD(ray,this);
	}

	/**
	*判断射线是否与碰撞球交叉，并返回交叉点。
	*@param ray 射线。
	*@param outPoint 交叉点。
	*@return 距离交叉点的距离，-1表示不交叉。
	*/
	__proto.intersectsRayPoint=function(ray,outPoint){
		return CollisionUtils.intersectsRayAndSphereRP(ray,this,outPoint);
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var dest=destObject;
		this.center.cloneTo(dest.center);
		dest.radius=this.radius;
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var dest=/*__JS__ */new this.constructor(new Vector3(),new Vector3());
		this.cloneTo(dest);
		return dest;
	}

	BoundSphere.createFromSubPoints=function(points,start,count,out){
		if (points==null){
			throw new Error("points");
		}
		if (start < 0 || start >=points.length){
			throw new Error("start"+start+"Must be in the range [0, "+(points.length-1)+"]");
		}
		if (count < 0 || (start+count)> points.length){
			throw new Error("count"+count+"Must be in the range <= "+points.length+"}");
		};
		var upperEnd=start+count;
		var center=BoundSphere._tempVector3;
		center.elements[0]=0;
		center.elements[1]=0;
		center.elements[2]=0;
		for (var i=start;i < upperEnd;++i){
			Vector3.add(points[i],center,center);
		};
		var outCenter=out.center;
		Vector3.scale(center,1 / count,outCenter);
		var radius=0.0;
		for (i=start;i < upperEnd;++i){
			var distance=Vector3.distanceSquared(outCenter,points[i]);
			if (distance > radius)
				radius=distance;
		}
		out.radius=Math.sqrt(radius);
	}

	BoundSphere.createfromPoints=function(points,out){
		if (points==null){
			throw new Error("points");
		}
		BoundSphere.createFromSubPoints(points,0,points.length,out);
	}

	__static(BoundSphere,
	['_tempVector3',function(){return this._tempVector3=new Vector3();}
	]);
	return BoundSphere;
})()


/**
*...
*@author ...
*/
//class laya.d3.loaders.MeshReader
var MeshReader=(function(){
	function MeshReader(){}
	__class(MeshReader,'laya.d3.loaders.MeshReader');
	MeshReader.read=function(data,mesh,subMeshes){
		var readData=new Byte(data);
		readData.pos=0;
		var version=readData.readUTFString();
		switch (version){
			case "LAYAMODEL:0301":
			case "LAYAMODEL:0400":
			case "LAYAMODEL:0401":
				LoadModelV04.parse(readData,version,mesh,subMeshes);
				break ;
			case "LAYAMODEL:05":
			case "LAYAMODEL:COMPRESSION_05":
				LoadModelV05.parse(readData,version,mesh,subMeshes);
				break ;
			default :
				throw new Error("MeshReader: unknown mesh version.");
			}
		mesh._setSubMeshes(subMeshes);
	}

	return MeshReader;
})()


/**

*/
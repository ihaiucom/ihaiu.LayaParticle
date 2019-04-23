/**
*<code>Picker</code> 类用于创建拾取。
*/
//class laya.d3.utils.Picker
var Picker=(function(){
	/**
	*创建一个 <code>Picker</code> 实例。
	*/
	function Picker(){}
	__class(Picker,'laya.d3.utils.Picker');
	Picker.calculateCursorRay=function(point,viewPort,projectionMatrix,viewMatrix,world,out){
		var x=point.elements[0];
		var y=point.elements[1];
		var nearSource=Picker._tempVector30;
		var nerSourceE=nearSource.elements;
		nerSourceE[0]=x;
		nerSourceE[1]=y;
		nerSourceE[2]=viewPort.minDepth;
		var farSource=Picker._tempVector31;
		var farSourceE=farSource.elements;
		farSourceE[0]=x;
		farSourceE[1]=y;
		farSourceE[2]=viewPort.maxDepth;
		var nearPoint=out.origin;
		var farPoint=Picker._tempVector32;
		viewPort.unprojectFromWVP(nearSource,projectionMatrix,viewMatrix,world,nearPoint);
		viewPort.unprojectFromWVP(farSource,projectionMatrix,viewMatrix,world,farPoint);
		var outDire=out.direction.elements;
		outDire[0]=farPoint.x-nearPoint.x;
		outDire[1]=farPoint.y-nearPoint.y;
		outDire[2]=farPoint.z-nearPoint.z;
		Vector3.normalize(out.direction,out.direction);
	}

	Picker.rayIntersectsTriangle=function(ray,vertex1,vertex2,vertex3){
		var result;
		var edge1=Picker._tempVector30,edge2=Picker._tempVector31;
		Vector3.subtract(vertex2,vertex1,edge1);
		Vector3.subtract(vertex3,vertex1,edge2);
		var directionCrossEdge2=Picker._tempVector32;
		Vector3.cross(ray.direction,edge2,directionCrossEdge2);
		var determinant;
		determinant=Vector3.dot(edge1,directionCrossEdge2);
		if (determinant >-Number.MIN_VALUE && determinant < Number.MIN_VALUE){
			result=Number.NaN;
			return result;
		};
		var inverseDeterminant=1.0 / determinant;
		var distanceVector=Picker._tempVector33;
		Vector3.subtract(ray.origin,vertex1,distanceVector);
		var triangleU;
		triangleU=Vector3.dot(distanceVector,directionCrossEdge2);
		triangleU *=inverseDeterminant;
		if (triangleU < 0 || triangleU > 1){
			result=Number.NaN;
			return result;
		};
		var distanceCrossEdge1=Picker._tempVector34;
		Vector3.cross(distanceVector,edge1,distanceCrossEdge1);
		var triangleV;
		triangleV=Vector3.dot(ray.direction,distanceCrossEdge1);
		triangleV *=inverseDeterminant;
		if (triangleV < 0 || triangleU+triangleV > 1){
			result=Number.NaN;
			return result;
		};
		var rayDistance;
		rayDistance=Vector3.dot(edge2,distanceCrossEdge1);
		rayDistance *=inverseDeterminant;
		if (rayDistance < 0){
			result=Number.NaN;
			return result;
		}
		result=rayDistance;
		return result;
	}

	__static(Picker,
	['_tempVector30',function(){return this._tempVector30=new Vector3();},'_tempVector31',function(){return this._tempVector31=new Vector3();},'_tempVector32',function(){return this._tempVector32=new Vector3();},'_tempVector33',function(){return this._tempVector33=new Vector3();},'_tempVector34',function(){return this._tempVector34=new Vector3();}
	]);
	return Picker;
})()


/**

*/
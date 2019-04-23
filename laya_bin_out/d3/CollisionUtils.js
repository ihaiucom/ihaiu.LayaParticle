/**
*<code>Collision</code> 类用于检测碰撞。
*/
//class laya.d3.math.CollisionUtils
var CollisionUtils=(function(){
	/**
	*创建一个 <code>Collision</code> 实例。
	*/
	function CollisionUtils(){}
	__class(CollisionUtils,'laya.d3.math.CollisionUtils');
	CollisionUtils.distancePlaneToPoint=function(plane,point){
		var dot=Vector3.dot(plane.normal,point);
		return dot-plane.distance;
	}

	CollisionUtils.distanceBoxToPoint=function(box,point){
		var boxMine=box.min.elements;
		var boxMineX=boxMine[0];
		var boxMineY=boxMine[1];
		var boxMineZ=boxMine[2];
		var boxMaxe=box.max.elements;
		var boxMaxeX=boxMaxe[0];
		var boxMaxeY=boxMaxe[1];
		var boxMaxeZ=boxMaxe[2];
		var pointe=point.elements;
		var pointeX=pointe[0];
		var pointeY=pointe[1];
		var pointeZ=pointe[2];
		var distance=0;
		if (pointeX < boxMineX)
			distance+=(boxMineX-pointeX)*(boxMineX-pointeX);
		if (pointeX > boxMaxeX)
			distance+=(boxMaxeX-pointeX)*(boxMaxeX-pointeX);
		if (pointeY < boxMineY)
			distance+=(boxMineY-pointeY)*(boxMineY-pointeY);
		if (pointeY > boxMaxeY)
			distance+=(boxMaxeY-pointeY)*(boxMaxeY-pointeY);
		if (pointeZ < boxMineZ)
			distance+=(boxMineZ-pointeZ)*(boxMineZ-pointeZ);
		if (pointeZ > boxMaxeZ)
			distance+=(boxMaxeZ-pointeZ)*(boxMaxeZ-pointeZ);
		return Math.sqrt(distance);
	}

	CollisionUtils.distanceBoxToBox=function(box1,box2){
		var box1Mine=box1.min.elements;
		var box1MineX=box1Mine[0];
		var box1MineY=box1Mine[1];
		var box1MineZ=box1Mine[2];
		var box1Maxe=box1.max.elements;
		var box1MaxeX=box1Maxe[0];
		var box1MaxeY=box1Maxe[1];
		var box1MaxeZ=box1Maxe[2];
		var box2Mine=box2.min.elements;
		var box2MineX=box2Mine[0];
		var box2MineY=box2Mine[1];
		var box2MineZ=box2Mine[2];
		var box2Maxe=box2.max.elements;
		var box2MaxeX=box2Maxe[0];
		var box2MaxeY=box2Maxe[1];
		var box2MaxeZ=box2Maxe[2];
		var distance=0;
		var delta=NaN;
		if (box1MineX > box2MaxeX){
			delta=box1MineX-box2MaxeX;
			distance+=delta *delta;
			}else if (box2MineX > box1MaxeX){
			delta=box2MineX-box1MaxeX;
			distance+=delta *delta;
		}
		if (box1MineY > box2MaxeY){
			delta=box1MineY-box2MaxeY;
			distance+=delta *delta;
			}else if (box2MineY > box1MaxeY){
			delta=box2MineY-box1MaxeY;
			distance+=delta *delta;
		}
		if (box1MineZ > box2MaxeZ){
			delta=box1MineZ-box2MaxeZ;
			distance+=delta *delta;
			}else if (box2MineZ > box1MaxeZ){
			delta=box2MineZ-box1MaxeZ;
			distance+=delta *delta;
		}
		return Math.sqrt(distance);
	}

	CollisionUtils.distanceSphereToPoint=function(sphere,point){
		var distance=Math.sqrt(Vector3.distanceSquared(sphere.center,point));
		distance-=sphere.radius;
		return Math.max(distance,0);
	}

	CollisionUtils.distanceSphereToSphere=function(sphere1,sphere2){
		var distance=Math.sqrt(Vector3.distanceSquared(sphere1.center,sphere2.center));
		distance-=sphere1.radius+sphere2.radius;
		return Math.max(distance,0);
	}

	CollisionUtils.intersectsRayAndTriangleRD=function(ray,vertex1,vertex2,vertex3,out){
		var rayO=ray.origin;
		var rayOe=rayO.elements;
		var rayOeX=rayOe[0];
		var rayOeY=rayOe[1];
		var rayOeZ=rayOe[2];
		var rayD=ray.direction;
		var rayDe=rayD.elements;
		var rayDeX=rayDe[0];
		var rayDeY=rayDe[1];
		var rayDeZ=rayDe[2];
		var v1e=vertex1.elements;
		var v1eX=v1e[0];
		var v1eY=v1e[1];
		var v1eZ=v1e[2];
		var v2e=vertex2.elements;
		var v2eX=v2e[0];
		var v2eY=v2e[1];
		var v2eZ=v2e[2];
		var v3e=vertex3.elements;
		var v3eX=v3e[0];
		var v3eY=v3e[1];
		var v3eZ=v3e[2];
		var _tempV30e=CollisionUtils._tempV30.elements;
		var _tempV30eX=_tempV30e[0];
		var _tempV30eY=_tempV30e[1];
		var _tempV30eZ=_tempV30e[2];
		_tempV30eX=v2eX-v1eX;
		_tempV30eY=v2eY-v1eY;
		_tempV30eZ=v2eZ-v1eZ;
		var _tempV31e=CollisionUtils._tempV31.elements;
		var _tempV31eX=_tempV31e[0];
		var _tempV31eY=_tempV31e[1];
		var _tempV31eZ=_tempV31e[2];
		_tempV31eX=v3eX-v1eX;
		_tempV31eY=v3eY-v1eY;
		_tempV31eZ=v3eZ-v1eZ;
		var _tempV32e=CollisionUtils._tempV32.elements;
		var _tempV32eX=_tempV32e[0];
		var _tempV32eY=_tempV32e[1];
		var _tempV32eZ=_tempV32e[2];
		_tempV32eX=(rayDeY *_tempV31eZ)-(rayDeZ *_tempV31eY);
		_tempV32eY=(rayDeZ *_tempV31eX)-(rayDeX *_tempV31eZ);
		_tempV32eZ=(rayDeX *_tempV31eY)-(rayDeY *_tempV31eX);
		var determinant=(_tempV30eX *_tempV32eX)+(_tempV30eY *_tempV32eY)+(_tempV30eZ *_tempV32eZ);
		if (MathUtils3D.isZero(determinant)){
			out=0;
			return false;
		};
		var inversedeterminant=1 / determinant;
		var _tempV33e=CollisionUtils._tempV33.elements;
		var _tempV33eX=_tempV33e[0];
		var _tempV33eY=_tempV33e[1];
		var _tempV33eZ=_tempV33e[2];
		_tempV33eX=rayOeX-v1eX;
		_tempV33eY=rayOeY-v1eY;
		_tempV33eZ=rayOeZ-v1eZ;
		var triangleU=(_tempV33eX *_tempV32eX)+(_tempV33eY *_tempV32eY)+(_tempV33eZ *_tempV32eZ);
		triangleU *=inversedeterminant;
		if (triangleU < 0 || triangleU > 1){
			out=0;
			return false;
		};
		var _tempV34e=CollisionUtils._tempV34.elements;
		var _tempV34eX=_tempV34e[0];
		var _tempV34eY=_tempV34e[1];
		var _tempV34eZ=_tempV34e[2];
		_tempV34eX=(_tempV33eY *_tempV30eZ)-(_tempV33eZ *_tempV30eY);
		_tempV34eY=(_tempV33eZ *_tempV30eX)-(_tempV33eX *_tempV30eZ);
		_tempV34eZ=(_tempV33eX *_tempV30eY)-(_tempV33eY *_tempV30eX);
		var triangleV=((rayDeX *_tempV34eX)+(rayDeY *_tempV34eY))+(rayDeZ *_tempV34eZ);
		triangleV *=inversedeterminant;
		if (triangleV < 0 || triangleU+triangleV > 1){
			out=0;
			return false;
		};
		var raydistance=(_tempV31eX *_tempV34eX)+(_tempV31eY *_tempV34eY)+(_tempV31eZ *_tempV34eZ);
		raydistance *=inversedeterminant;
		if (raydistance < 0){
			out=0;
			return false;
		}
		out=raydistance;
		return true;
	}

	CollisionUtils.intersectsRayAndTriangleRP=function(ray,vertex1,vertex2,vertex3,out){
		var distance=NaN;
		if (!CollisionUtils.intersectsRayAndTriangleRD(ray,vertex1,vertex2,vertex3,distance)){
			out=Vector3.ZERO;
			return false;
		}
		Vector3.scale(ray.direction,distance,CollisionUtils._tempV30);
		Vector3.add(ray.origin,CollisionUtils._tempV30,out);
		return true;
	}

	CollisionUtils.intersectsRayAndPoint=function(ray,point){
		Vector3.subtract(ray.origin,point,CollisionUtils._tempV30);
		var b=Vector3.dot(CollisionUtils._tempV30,ray.direction);
		var c=Vector3.dot(CollisionUtils._tempV30,CollisionUtils._tempV30)-MathUtils3D.zeroTolerance;
		if (c > 0 && b > 0)
			return false;
		var discriminant=b *b-c;
		if (discriminant < 0)
			return false;
		return true;
	}

	CollisionUtils.intersectsRayAndRay=function(ray1,ray2,out){
		var ray1o=ray1.origin;
		var ray1oe=ray1o.elements;
		var ray1oeX=ray1oe[0];
		var ray1oeY=ray1oe[1];
		var ray1oeZ=ray1oe[2];
		var ray1d=ray1.direction;
		var ray1de=ray1d.elements;
		var ray1deX=ray1de[0];
		var ray1deY=ray1de[1];
		var ray1deZ=ray1de[2];
		var ray2o=ray2.origin;
		var ray2oe=ray2o.elements;
		var ray2oeX=ray2oe[0];
		var ray2oeY=ray2oe[1];
		var ray2oeZ=ray2oe[2];
		var ray2d=ray2.direction;
		var ray2de=ray2d.elements;
		var ray2deX=ray2de[0];
		var ray2deY=ray2de[1];
		var ray2deZ=ray2de[2];
		Vector3.cross(ray1d,ray2d,CollisionUtils._tempV30);
		var tempV3e=CollisionUtils._tempV30.elements;
		var denominator=Vector3.scalarLength(CollisionUtils._tempV30);
		if (MathUtils3D.isZero(denominator)){
			if (MathUtils3D.nearEqual(ray2oeX,ray1oeX)&& MathUtils3D.nearEqual(ray2oeY,ray1oeY)&& MathUtils3D.nearEqual(ray2oeZ,ray1oeZ)){
				out=Vector3.ZERO;
				return true;
			}
		}
		denominator=denominator *denominator;
		var m11=ray2oeX-ray1oeX;
		var m12=ray2oeY-ray1oeY;
		var m13=ray2oeZ-ray1oeZ;
		var m21=ray2deX;
		var m22=ray2deY;
		var m23=ray2deZ;
		var m31=tempV3e[0];
		var m32=tempV3e[1];
		var m33=tempV3e[2];
		var dets=m11 *m22 *m33+m12 *m23 *m31+m13 *m21 *m32-m11 *m23 *m32-m12 *m21 *m33-m13 *m22 *m31;
		m21=ray1deX;
		m22=ray1deY;
		m23=ray1deZ;
		var dett=m11 *m22 *m33+m12 *m23 *m31+m13 *m21 *m32-m11 *m23 *m32-m12 *m21 *m33-m13 *m22 *m31;
		var s=dets / denominator;
		var t=dett / denominator;
		Vector3.scale(ray1d,s,CollisionUtils._tempV30);
		Vector3.scale(ray2d,s,CollisionUtils._tempV31);
		Vector3.add(ray1o,CollisionUtils._tempV30,CollisionUtils._tempV32);
		Vector3.add(ray2o,CollisionUtils._tempV31,CollisionUtils._tempV33);
		var point1e=CollisionUtils._tempV32.elements;
		var point2e=CollisionUtils._tempV33.elements;
		if (!MathUtils3D.nearEqual(point2e[0],point1e[0])|| !MathUtils3D.nearEqual(point2e[1],point1e[1])|| !MathUtils3D.nearEqual(point2e[2],point1e[2])){
			out=Vector3.ZERO;
			return false;
		}
		out=CollisionUtils._tempV32;
		return true;
	}

	CollisionUtils.intersectsPlaneAndTriangle=function(plane,vertex1,vertex2,vertex3){
		var test1=CollisionUtils.intersectsPlaneAndPoint(plane,vertex1);
		var test2=CollisionUtils.intersectsPlaneAndPoint(plane,vertex2);
		var test3=CollisionUtils.intersectsPlaneAndPoint(plane,vertex3);
		if (test1==Plane.PlaneIntersectionType_Front && test2==Plane.PlaneIntersectionType_Front && test3==Plane.PlaneIntersectionType_Front)
			return Plane.PlaneIntersectionType_Front;
		if (test1==Plane.PlaneIntersectionType_Back && test2==Plane.PlaneIntersectionType_Back && test3==Plane.PlaneIntersectionType_Back)
			return Plane.PlaneIntersectionType_Back;
		return Plane.PlaneIntersectionType_Intersecting;
	}

	CollisionUtils.intersectsRayAndPlaneRD=function(ray,plane,out){
		var planeNor=plane.normal;
		var direction=Vector3.dot(planeNor,ray.direction);
		if (MathUtils3D.isZero(direction)){
			out=0;
			return false;
		};
		var position=Vector3.dot(planeNor,ray.origin);
		out=(-plane.distance-position)/ direction;
		if (out < 0){
			out=0;
			return false;
		}
		return true;
	}

	CollisionUtils.intersectsRayAndPlaneRP=function(ray,plane,out){
		var distance=NaN;
		if (!CollisionUtils.intersectsRayAndPlaneRD(ray,plane,distance)){
			out=Vector3.ZERO;
			return false;
		}
		Vector3.scale(ray.direction,distance,CollisionUtils._tempV30);
		Vector3.add(ray.origin,CollisionUtils._tempV30,CollisionUtils._tempV31);
		out=CollisionUtils._tempV31;
		return true;
	}

	CollisionUtils.intersectsRayAndBoxRD=function(ray,box){
		var rayoe=ray.origin.elements;
		var rayoeX=rayoe[0];
		var rayoeY=rayoe[1];
		var rayoeZ=rayoe[2];
		var rayde=ray.direction.elements;
		var raydeX=rayde[0];
		var raydeY=rayde[1];
		var raydeZ=rayde[2];
		var boxMine=box.min.elements;
		var boxMineX=boxMine[0];
		var boxMineY=boxMine[1];
		var boxMineZ=boxMine[2];
		var boxMaxe=box.max.elements;
		var boxMaxeX=boxMaxe[0];
		var boxMaxeY=boxMaxe[1];
		var boxMaxeZ=boxMaxe[2];
		var out=0;
		var tmax=MathUtils3D.MaxValue;
		if (MathUtils3D.isZero(raydeX)){
			if (rayoeX < boxMineX || rayoeX > boxMaxeX){
				return-1;
			}
			}else {
			var inverse=1 / raydeX;
			var t1=(boxMineX-rayoeX)*inverse;
			var t2=(boxMaxeX-rayoeX)*inverse;
			if (t1 > t2){
				var temp=t1;
				t1=t2;
				t2=temp;
			}
			out=Math.max(t1,out);
			tmax=Math.min(t2,tmax);
			if (out > tmax){
				return-1;
			}
		}
		if (MathUtils3D.isZero(raydeY)){
			if (rayoeY < boxMineY || rayoeY > boxMaxeY){
				return-1;
			}
			}else {
			var inverse1=1 / raydeY;
			var t3=(boxMineY-rayoeY)*inverse1;
			var t4=(boxMaxeY-rayoeY)*inverse1;
			if (t3 > t4){
				var temp1=t3;
				t3=t4;
				t4=temp1;
			}
			out=Math.max(t3,out);
			tmax=Math.min(t4,tmax);
			if (out > tmax){
				return-1;
			}
		}
		if (MathUtils3D.isZero(raydeZ)){
			if (rayoeZ < boxMineZ || rayoeZ > boxMaxeZ){
				return-1;
			}
			}else {
			var inverse2=1 / raydeZ;
			var t5=(boxMineZ-rayoeZ)*inverse2;
			var t6=(boxMaxeZ-rayoeZ)*inverse2;
			if (t5 > t6){
				var temp2=t5;
				t5=t6;
				t6=temp2;
			}
			out=Math.max(t5,out);
			tmax=Math.min(t6,tmax);
			if (out > tmax){
				return-1;
			}
		}
		return out;
	}

	CollisionUtils.intersectsRayAndBoxRP=function(ray,box,out){
		var distance=CollisionUtils.intersectsRayAndBoxRD(ray,box);
		if (distance===-1){
			Vector3.ZERO.cloneTo(out);
			return distance;
		}
		Vector3.scale(ray.direction,distance,CollisionUtils._tempV30);
		Vector3.add(ray.origin,CollisionUtils._tempV30,CollisionUtils._tempV31);
		CollisionUtils._tempV31.cloneTo(out);
		return distance;
	}

	CollisionUtils.intersectsRayAndSphereRD=function(ray,sphere){
		var sphereR=sphere.radius;
		Vector3.subtract(ray.origin,sphere.center,CollisionUtils._tempV30);
		var b=Vector3.dot(CollisionUtils._tempV30,ray.direction);
		var c=Vector3.dot(CollisionUtils._tempV30,CollisionUtils._tempV30)-(sphereR *sphereR);
		if (c > 0 && b > 0){
			return-1;
		};
		var discriminant=b *b-c;
		if (discriminant < 0){
			return-1;
		};
		var distance=-b-Math.sqrt(discriminant);
		if (distance < 0)
			distance=0;
		return distance;
	}

	CollisionUtils.intersectsRayAndSphereRP=function(ray,sphere,out){
		var distance=CollisionUtils.intersectsRayAndSphereRD(ray,sphere);
		if (distance===-1){
			Vector3.ZERO.cloneTo(out);
			return distance;
		}
		Vector3.scale(ray.direction,distance,CollisionUtils._tempV30);
		Vector3.add(ray.origin,CollisionUtils._tempV30,CollisionUtils._tempV31);
		CollisionUtils._tempV31.cloneTo(out);
		return distance;
	}

	CollisionUtils.intersectsSphereAndTriangle=function(sphere,vertex1,vertex2,vertex3){
		var sphereC=sphere.center;
		var sphereR=sphere.radius;
		CollisionUtils.closestPointPointTriangle(sphereC,vertex1,vertex2,vertex3,CollisionUtils._tempV30);
		Vector3.subtract(CollisionUtils._tempV30,sphereC,CollisionUtils._tempV31);
		var dot=Vector3.dot(CollisionUtils._tempV31,CollisionUtils._tempV31);
		return dot <=sphereR *sphereR;
	}

	CollisionUtils.intersectsPlaneAndPoint=function(plane,point){
		var distance=Vector3.dot(plane.normal,point)+plane.distance;
		if (distance > 0)
			return Plane.PlaneIntersectionType_Front;
		if (distance < 0)
			return Plane.PlaneIntersectionType_Back;
		return Plane.PlaneIntersectionType_Intersecting;
	}

	CollisionUtils.intersectsPlaneAndPlane=function(plane1,plane2){
		Vector3.cross(plane1.normal,plane2.normal,CollisionUtils._tempV30);
		var denominator=Vector3.dot(CollisionUtils._tempV30,CollisionUtils._tempV30);
		if (MathUtils3D.isZero(denominator))
			return false;
		return true;
	}

	CollisionUtils.intersectsPlaneAndPlaneRL=function(plane1,plane2,line){
		var plane1nor=plane1.normal;
		var plane2nor=plane2.normal;
		Vector3.cross(plane1nor,plane2nor,CollisionUtils._tempV34);
		var denominator=Vector3.dot(CollisionUtils._tempV34,CollisionUtils._tempV34);
		if (MathUtils3D.isZero(denominator))
			return false;
		Vector3.scale(plane2nor,plane1.distance,CollisionUtils._tempV30);
		Vector3.scale(plane1nor,plane2.distance,CollisionUtils._tempV31);
		Vector3.subtract(CollisionUtils._tempV30,CollisionUtils._tempV31,CollisionUtils._tempV32);
		Vector3.cross(CollisionUtils._tempV32,CollisionUtils._tempV34,CollisionUtils._tempV33);
		Vector3.normalize(CollisionUtils._tempV34,CollisionUtils._tempV34);
		line=new Ray(CollisionUtils._tempV33,CollisionUtils._tempV34);
		return true;
	}

	CollisionUtils.intersectsPlaneAndBox=function(plane,box){
		var planeD=plane.distance;
		var planeNor=plane.normal;
		var planeNore=planeNor.elements;
		var planeNoreX=planeNore[0];
		var planeNoreY=planeNore[1];
		var planeNoreZ=planeNore[2];
		var boxMine=box.min.elements;
		var boxMineX=boxMine[0];
		var boxMineY=boxMine[1];
		var boxMineZ=boxMine[2];
		var boxMaxe=box.max.elements;
		var boxMaxeX=boxMaxe[0];
		var boxMaxeY=boxMaxe[1];
		var boxMaxeZ=boxMaxe[2];
		CollisionUtils._tempV30.elements[0]=(planeNoreX > 0)? boxMineX :boxMaxeX;
		CollisionUtils._tempV30.elements[1]=(planeNoreY > 0)? boxMineY :boxMaxeY;
		CollisionUtils._tempV30.elements[2]=(planeNoreZ > 0)? boxMineZ :boxMaxeZ;
		CollisionUtils._tempV31.elements[0]=(planeNoreX > 0)? boxMaxeX :boxMineX;
		CollisionUtils._tempV31.elements[1]=(planeNoreY > 0)? boxMaxeY :boxMineY;
		CollisionUtils._tempV31.elements[2]=(planeNoreZ > 0)? boxMaxeZ :boxMineZ;
		var distance=Vector3.dot(planeNor,CollisionUtils._tempV30);
		if (distance+planeD > 0)
			return Plane.PlaneIntersectionType_Front;
		distance=Vector3.dot(planeNor,CollisionUtils._tempV31);
		if (distance+planeD < 0)
			return Plane.PlaneIntersectionType_Back;
		return Plane.PlaneIntersectionType_Intersecting;
	}

	CollisionUtils.intersectsPlaneAndSphere=function(plane,sphere){
		var sphereR=sphere.radius;
		var distance=Vector3.dot(plane.normal,sphere.center)+plane.distance;
		if (distance > sphereR)
			return Plane.PlaneIntersectionType_Front;
		if (distance <-sphereR)
			return Plane.PlaneIntersectionType_Back;
		return Plane.PlaneIntersectionType_Intersecting;
	}

	CollisionUtils.intersectsBoxAndBox=function(box1,box2){
		var box1Mine=box1.min.elements;
		var box1Maxe=box1.max.elements;
		var box2Mine=box2.min.elements;
		var box2Maxe=box2.max.elements;
		if (box1Mine[0] > box2Maxe[0] || box2Mine[0] > box1Maxe[0])
			return false;
		if (box1Mine[1] > box2Maxe[1] || box2Mine[1] > box1Maxe[1])
			return false;
		if (box1Mine[2] > box2Maxe[2] || box2Mine[2] > box1Maxe[2])
			return false;
		return true;
	}

	CollisionUtils.intersectsBoxAndSphere=function(box,sphere){
		var sphereC=sphere.center;
		var sphereR=sphere.radius;
		Vector3.Clamp(sphereC,box.min,box.max,CollisionUtils._tempV30);
		var distance=Vector3.distanceSquared(sphereC,CollisionUtils._tempV30);
		return distance <=sphereR *sphereR;
	}

	CollisionUtils.intersectsSphereAndSphere=function(sphere1,sphere2){
		var radiisum=sphere1.radius+sphere2.radius;
		return Vector3.distanceSquared(sphere1.center,sphere2.center)<=radiisum *radiisum;
	}

	CollisionUtils.boxContainsPoint=function(box,point){
		var boxMine=box.min.elements;
		var boxMaxe=box.max.elements;
		var pointe=point.elements;
		if (boxMine[0] <=pointe[0] && boxMaxe[0] >=pointe[0] && boxMine[1] <=pointe[1] && boxMaxe[1] >=pointe[1] && boxMine[2] <=pointe[2] && boxMaxe[2] >=pointe[2])
			return /*laya.d3.math.ContainmentType.Contains*/1;
		return /*laya.d3.math.ContainmentType.Disjoint*/0;
	}

	CollisionUtils.boxContainsBox=function(box1,box2){
		var box1Mine=box1.min.elements;
		var box1MineX=box1Mine[0];
		var box1MineY=box1Mine[1];
		var box1MineZ=box1Mine[2];
		var box1Maxe=box1.max.elements;
		var box1MaxeX=box1Maxe[0];
		var box1MaxeY=box1Maxe[1];
		var box1MaxeZ=box1Maxe[2];
		var box2Mine=box2.min.elements;
		var box2MineX=box2Mine[0];
		var box2MineY=box2Mine[1];
		var box2MineZ=box2Mine[2];
		var box2Maxe=box2.max.elements;
		var box2MaxeX=box2Maxe[0];
		var box2MaxeY=box2Maxe[1];
		var box2MaxeZ=box2Maxe[2];
		if (box1MaxeX < box2MineX || box1MineX > box2MaxeX)
			return /*laya.d3.math.ContainmentType.Disjoint*/0;
		if (box1MaxeY < box2MineY || box1MineY > box2MaxeY)
			return /*laya.d3.math.ContainmentType.Disjoint*/0;
		if (box1MaxeZ < box2MineZ || box1MineZ > box2MaxeZ)
			return /*laya.d3.math.ContainmentType.Disjoint*/0;
		if (box1MineX <=box2MineX && box2MaxeX <=box2MaxeX && box1MineY <=box2MineY && box2MaxeY <=box1MaxeY && box1MineZ <=box2MineZ && box2MaxeZ <=box1MaxeZ){
			return /*laya.d3.math.ContainmentType.Contains*/1;
		}
		return /*laya.d3.math.ContainmentType.Intersects*/2;
	}

	CollisionUtils.boxContainsSphere=function(box,sphere){
		var boxMin=box.min;
		var boxMine=boxMin.elements;
		var boxMineX=boxMine[0];
		var boxMineY=boxMine[1];
		var boxMineZ=boxMine[2];
		var boxMax=box.max;
		var boxMaxe=boxMax.elements;
		var boxMaxeX=boxMaxe[0];
		var boxMaxeY=boxMaxe[1];
		var boxMaxeZ=boxMaxe[2];
		var sphereC=sphere.center;
		var sphereCe=sphereC.elements;
		var sphereCeX=sphereCe[0];
		var sphereCeY=sphereCe[1];
		var sphereCeZ=sphereCe[2];
		var sphereR=sphere.radius;
		Vector3.Clamp(sphereC,boxMin,boxMax,CollisionUtils._tempV30);
		var distance=Vector3.distanceSquared(sphereC,CollisionUtils._tempV30);
		if (distance > sphereR *sphereR)
			return /*laya.d3.math.ContainmentType.Disjoint*/0;
		if ((((boxMineX+sphereR <=sphereCeX)&& (sphereCeX <=boxMaxeX-sphereR))&& ((boxMaxeX-boxMineX > sphereR)&&
			(boxMineY+sphereR <=sphereCeY)))&& (((sphereCeY <=boxMaxeY-sphereR)&& (boxMaxeY-boxMineY > sphereR))&&
		(((boxMineZ+sphereR <=sphereCeZ)&& (sphereCeZ <=boxMaxeZ-sphereR))&& (boxMaxeZ-boxMineZ > sphereR))))
		return /*laya.d3.math.ContainmentType.Contains*/1;
		return /*laya.d3.math.ContainmentType.Intersects*/2;
	}

	CollisionUtils.sphereContainsPoint=function(sphere,point){
		if (Vector3.distanceSquared(point,sphere.center)<=sphere.radius *sphere.radius)
			return /*laya.d3.math.ContainmentType.Contains*/1;
		return /*laya.d3.math.ContainmentType.Disjoint*/0;
	}

	CollisionUtils.sphereContainsTriangle=function(sphere,vertex1,vertex2,vertex3){
		var test1=CollisionUtils.sphereContainsPoint(sphere,vertex1);
		var test2=CollisionUtils.sphereContainsPoint(sphere,vertex2);
		var test3=CollisionUtils.sphereContainsPoint(sphere,vertex3);
		if (test1==/*laya.d3.math.ContainmentType.Contains*/1 && test2==/*laya.d3.math.ContainmentType.Contains*/1 && test3==/*laya.d3.math.ContainmentType.Contains*/1)
			return /*laya.d3.math.ContainmentType.Contains*/1;
		if (CollisionUtils.intersectsSphereAndTriangle(sphere,vertex1,vertex2,vertex3))
			return /*laya.d3.math.ContainmentType.Intersects*/2;
		return /*laya.d3.math.ContainmentType.Disjoint*/0;
	}

	CollisionUtils.sphereContainsBox=function(sphere,box){
		var sphereC=sphere.center;
		var sphereCe=sphereC.elements;
		var sphereCeX=sphereCe[0];
		var sphereCeY=sphereCe[1];
		var sphereCeZ=sphereCe[2];
		var sphereR=sphere.radius;
		var boxMin=box.min;
		var boxMine=boxMin.elements;
		var boxMineX=boxMine[0];
		var boxMineY=boxMine[1];
		var boxMineZ=boxMine[2];
		var boxMax=box.max;
		var boxMaxe=boxMax.elements;
		var boxMaxeX=boxMaxe[0];
		var boxMaxeY=boxMaxe[1];
		var boxMaxeZ=boxMaxe[2];
		var _tempV30e=CollisionUtils._tempV30.elements;
		var _tempV30eX=_tempV30e[0];
		var _tempV30eY=_tempV30e[1];
		var _tempV30eZ=_tempV30e[2];
		if (!CollisionUtils.intersectsBoxAndSphere(box,sphere))
			return /*laya.d3.math.ContainmentType.Disjoint*/0;
		var radiusSquared=sphereR *sphereR;
		_tempV30eX=sphereCeX-boxMineX;
		_tempV30eY=sphereCeY-boxMaxeY;
		_tempV30eZ=sphereCeZ-boxMaxeZ;
		if (Vector3.scalarLengthSquared(CollisionUtils._tempV30)> radiusSquared)
			return /*laya.d3.math.ContainmentType.Intersects*/2;
		_tempV30eX=sphereCeX-boxMaxeX;
		_tempV30eY=sphereCeY-boxMaxeY;
		_tempV30eZ=sphereCeZ-boxMaxeZ;
		if (Vector3.scalarLengthSquared(CollisionUtils._tempV30)> radiusSquared)
			return /*laya.d3.math.ContainmentType.Intersects*/2;
		_tempV30eX=sphereCeX-boxMaxeX;
		_tempV30eY=sphereCeY-boxMineY;
		_tempV30eZ=sphereCeZ-boxMaxeZ;
		if (Vector3.scalarLengthSquared(CollisionUtils._tempV30)> radiusSquared)
			return /*laya.d3.math.ContainmentType.Intersects*/2;
		_tempV30eX=sphereCeX-boxMineX;
		_tempV30eY=sphereCeY-boxMineY;
		_tempV30eZ=sphereCeZ-boxMaxeZ;
		if (Vector3.scalarLengthSquared(CollisionUtils._tempV30)> radiusSquared)
			return /*laya.d3.math.ContainmentType.Intersects*/2;
		_tempV30eX=sphereCeX-boxMineX;
		_tempV30eY=sphereCeY-boxMaxeY;
		_tempV30eZ=sphereCeZ-boxMineZ;
		if (Vector3.scalarLengthSquared(CollisionUtils._tempV30)> radiusSquared)
			return /*laya.d3.math.ContainmentType.Intersects*/2;
		_tempV30eX=sphereCeX-boxMaxeX;
		_tempV30eY=sphereCeY-boxMaxeY;
		_tempV30eZ=sphereCeZ-boxMineZ;
		if (Vector3.scalarLengthSquared(CollisionUtils._tempV30)> radiusSquared)
			return /*laya.d3.math.ContainmentType.Intersects*/2;
		_tempV30eX=sphereCeX-boxMaxeX;
		_tempV30eY=sphereCeY-boxMineY;
		_tempV30eZ=sphereCeZ-boxMineZ;
		if (Vector3.scalarLengthSquared(CollisionUtils._tempV30)> radiusSquared)
			return /*laya.d3.math.ContainmentType.Intersects*/2;
		_tempV30eX=sphereCeX-boxMineX;
		_tempV30eY=sphereCeY-boxMineY;
		_tempV30eZ=sphereCeZ-boxMineZ;
		if (Vector3.scalarLengthSquared(CollisionUtils._tempV30)> radiusSquared)
			return /*laya.d3.math.ContainmentType.Intersects*/2;
		return /*laya.d3.math.ContainmentType.Contains*/1;
	}

	CollisionUtils.sphereContainsSphere=function(sphere1,sphere2){
		var sphere1R=sphere1.radius;
		var sphere2R=sphere2.radius;
		var distance=Vector3.distance(sphere1.center,sphere2.center);
		if (sphere1R+sphere2R < distance)
			return /*laya.d3.math.ContainmentType.Disjoint*/0;
		if (sphere1R-sphere2R < distance)
			return /*laya.d3.math.ContainmentType.Intersects*/2;
		return /*laya.d3.math.ContainmentType.Contains*/1;
	}

	CollisionUtils.closestPointPointTriangle=function(point,vertex1,vertex2,vertex3,out){
		Vector3.subtract(vertex2,vertex1,CollisionUtils._tempV30);
		Vector3.subtract(vertex3,vertex1,CollisionUtils._tempV31);
		Vector3.subtract(point,vertex1,CollisionUtils._tempV32);
		Vector3.subtract(point,vertex2,CollisionUtils._tempV33);
		Vector3.subtract(point,vertex3,CollisionUtils._tempV34);
		var d1=Vector3.dot(CollisionUtils._tempV30,CollisionUtils._tempV32);
		var d2=Vector3.dot(CollisionUtils._tempV31,CollisionUtils._tempV32);
		var d3=Vector3.dot(CollisionUtils._tempV30,CollisionUtils._tempV33);
		var d4=Vector3.dot(CollisionUtils._tempV31,CollisionUtils._tempV33);
		var d5=Vector3.dot(CollisionUtils._tempV30,CollisionUtils._tempV34);
		var d6=Vector3.dot(CollisionUtils._tempV31,CollisionUtils._tempV34);
		if (d1 <=0 && d2 <=0){
			vertex1.cloneTo(out);
			return;
		}
		if (d3 >=0 && d4 <=d3){
			vertex2.cloneTo(out);
			return;
		};
		var vc=d1 *d4-d3 *d2;
		if (vc <=0 && d1 >=0 && d3 <=0){
			var v=d1 / (d1-d3);
			Vector3.scale(CollisionUtils._tempV30,v,out);
			Vector3.add(vertex1,out,out);
			return;
		}
		if (d6 >=0 && d5 <=d6){
			vertex3.cloneTo(out);
			return;
		};
		var vb=d5 *d2-d1 *d6;
		if (vb <=0 && d2 >=0 && d6 <=0){
			var w=d2 / (d2-d6);
			Vector3.scale(CollisionUtils._tempV31,w,out);
			Vector3.add(vertex1,out,out);
			return;
		};
		var va=d3 *d6-d5 *d4;
		if (va <=0 && (d4-d3)>=0 && (d5-d6)>=0){
			var w3=(d4-d3)/ ((d4-d3)+(d5-d6));
			Vector3.subtract(vertex3,vertex2,out);
			Vector3.scale(out,w3,out);
			Vector3.add(vertex2,out,out);
			return;
		};
		var denom=1 / (va+vb+vc);
		var v2=vb *denom;
		var w2=vc *denom;
		Vector3.scale(CollisionUtils._tempV30,v2,CollisionUtils._tempV35);
		Vector3.scale(CollisionUtils._tempV31,w2,CollisionUtils._tempV36);
		Vector3.add(CollisionUtils._tempV35,CollisionUtils._tempV36,out);
		Vector3.add(vertex1,out,out);
	}

	CollisionUtils.closestPointPlanePoint=function(plane,point,out){
		var planeN=plane.normal;
		var t=Vector3.dot(planeN,point)-plane.distance;
		Vector3.scale(planeN,t,CollisionUtils._tempV30);
		Vector3.subtract(point,CollisionUtils._tempV30,out);
	}

	CollisionUtils.closestPointBoxPoint=function(box,point,out){
		Vector3.max(point,box.min,CollisionUtils._tempV30);
		Vector3.min(CollisionUtils._tempV30,box.max,out);
	}

	CollisionUtils.closestPointSpherePoint=function(sphere,point,out){
		var sphereC=sphere.center;
		Vector3.subtract(point,sphereC,out);
		Vector3.normalize(out,out);
		Vector3.scale(out,sphere.radius,out);
		Vector3.add(out,sphereC,out);
	}

	CollisionUtils.closestPointSphereSphere=function(sphere1,sphere2,out){
		var sphere1C=sphere1.center;
		Vector3.subtract(sphere2.center,sphere1C,out);
		Vector3.normalize(out,out);
		Vector3.scale(out,sphere1.radius,out);
		Vector3.add(out,sphere1C,out);
	}

	__static(CollisionUtils,
	['_tempV30',function(){return this._tempV30=new Vector3();},'_tempV31',function(){return this._tempV31=new Vector3();},'_tempV32',function(){return this._tempV32=new Vector3();},'_tempV33',function(){return this._tempV33=new Vector3();},'_tempV34',function(){return this._tempV34=new Vector3();},'_tempV35',function(){return this._tempV35=new Vector3();},'_tempV36',function(){return this._tempV36=new Vector3();}
	]);
	return CollisionUtils;
})()


/**

*/
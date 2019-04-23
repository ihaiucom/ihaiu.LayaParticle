/**
*<code>BoundFrustum</code> 类用于创建锥截体。
*/
//class laya.d3.math.BoundFrustum
var BoundFrustum=(function(){
	function BoundFrustum(matrix){
		/**4x4矩阵*/
		this._matrix=null;
		/**近平面*/
		this._near=null;
		/**远平面*/
		this._far=null;
		/**左平面*/
		this._left=null;
		/**右平面*/
		this._right=null;
		/**顶平面*/
		this._top=null;
		/**底平面*/
		this._bottom=null;
		this._matrix=matrix;
		this._near=new Plane(new Vector3());
		this._far=new Plane(new Vector3());
		this._left=new Plane(new Vector3());
		this._right=new Plane(new Vector3());
		this._top=new Plane(new Vector3());
		this._bottom=new Plane(new Vector3());
		BoundFrustum._getPlanesFromMatrix(this._matrix,this._near,this._far,this._left,this._right,this._top,this._bottom);
	}

	__class(BoundFrustum,'laya.d3.math.BoundFrustum');
	var __proto=BoundFrustum.prototype;
	/**
	*判断是否与其他锥截体相等。
	*@param other 锥截体。
	*/
	__proto.equalsBoundFrustum=function(other){
		return this._matrix.equalsOtherMatrix(other.matrix)
	}

	/**
	*判断是否与其他对象相等。
	*@param obj 对象。
	*/
	__proto.equalsObj=function(obj){
		if ((obj instanceof laya.d3.math.BoundFrustum )){
			var bf=obj;
			return this.equalsBoundFrustum(bf);
		}
		return false;
	}

	/**
	*获取锥截体的任意一平面。
	*0:近平面
	*1:远平面
	*2:左平面
	*3:右平面
	*4:顶平面
	*5:底平面
	*@param index 索引。
	*/
	__proto.getPlane=function(index){
		switch (index){
			case 0:
				return this._near;
			case 1:
				return this._far;
			case 2:
				return this._left;
			case 3:
				return this._right;
			case 4:
				return this._top;
			case 5:
				return this._bottom;
			default :
				return null;
			}
	}

	/**
	*锥截体的8个顶点。
	*@param corners 返回顶点的输出队列。
	*/
	__proto.getCorners=function(corners){
		BoundFrustum._get3PlaneInterPoint(this._near,this._bottom,this._right).cloneTo(corners[0]);
		BoundFrustum._get3PlaneInterPoint(this._near,this._top,this._right).cloneTo(corners[1]);
		BoundFrustum._get3PlaneInterPoint(this._near,this._top,this._left).cloneTo(corners[2]);
		BoundFrustum._get3PlaneInterPoint(this._near,this._bottom,this._left).cloneTo(corners[3]);
		BoundFrustum._get3PlaneInterPoint(this._far,this._bottom,this._right).cloneTo(corners[4]);
		BoundFrustum._get3PlaneInterPoint(this._far,this._top,this._right).cloneTo(corners[5]);
		BoundFrustum._get3PlaneInterPoint(this._far,this._top,this._left).cloneTo(corners[6]);
		BoundFrustum._get3PlaneInterPoint(this._far,this._bottom,this._left).cloneTo(corners[7]);
	}

	/**
	*与点的位置关系。返回-1,包涵;0,相交;1,不相交
	*@param point 点。
	*/
	__proto.containsPoint=function(point){
		var result=Plane.PlaneIntersectionType_Front;
		var planeResult=Plane.PlaneIntersectionType_Front;
		for (var i=0;i < 6;i++){
			switch (i){
				case 0:
					planeResult=CollisionUtils.intersectsPlaneAndPoint(this._near,point);
					break ;
				case 1:
					planeResult=CollisionUtils.intersectsPlaneAndPoint(this._far,point);
					break ;
				case 2:
					planeResult=CollisionUtils.intersectsPlaneAndPoint(this._left,point);
					break ;
				case 3:
					planeResult=CollisionUtils.intersectsPlaneAndPoint(this._right,point);
					break ;
				case 4:
					planeResult=CollisionUtils.intersectsPlaneAndPoint(this._top,point);
					break ;
				case 5:
					planeResult=CollisionUtils.intersectsPlaneAndPoint(this._bottom,point);
					break ;
				}
			switch (planeResult){
				case Plane.PlaneIntersectionType_Back:
					return /*laya.d3.math.ContainmentType.Disjoint*/0;
				case Plane.PlaneIntersectionType_Intersecting:
					result=Plane.PlaneIntersectionType_Intersecting;
					break ;
				}
		}
		switch (result){
			case Plane.PlaneIntersectionType_Intersecting:
				return /*laya.d3.math.ContainmentType.Intersects*/2;
			default :
				return /*laya.d3.math.ContainmentType.Contains*/1;
			}
	}

	/**
	*与包围盒的位置关系。返回-1,包涵;0,相交;1,不相交
	*@param box 包围盒。
	*/
	__proto.containsBoundBox=function(box){
		var p=BoundFrustum._tempV30,n=BoundFrustum._tempV31;
		var plane;
		var result=/*laya.d3.math.ContainmentType.Contains*/1;
		for (var i=0;i < 6;i++){
			plane=this.getPlane(i);
			this._getBoxToPlanePVertexNVertex(box,plane.normal,p,n);
			if (CollisionUtils.intersectsPlaneAndPoint(plane,p)===Plane.PlaneIntersectionType_Back)
				return /*laya.d3.math.ContainmentType.Disjoint*/0;
			if (CollisionUtils.intersectsPlaneAndPoint(plane,n)===Plane.PlaneIntersectionType_Back)
				result=/*laya.d3.math.ContainmentType.Intersects*/2;
		}
		return result;
	}

	/**
	*与包围球的位置关系。返回-1,包涵;0,相交;1,不相交
	*@param sphere 包围球。
	*/
	__proto.containsBoundSphere=function(sphere){
		var result=Plane.PlaneIntersectionType_Front;
		var planeResult=Plane.PlaneIntersectionType_Front;
		for (var i=0;i < 6;i++){
			switch (i){
				case 0:
					planeResult=CollisionUtils.intersectsPlaneAndSphere(this._near,sphere);
					break ;
				case 1:
					planeResult=CollisionUtils.intersectsPlaneAndSphere(this._far,sphere);
					break ;
				case 2:
					planeResult=CollisionUtils.intersectsPlaneAndSphere(this._left,sphere);
					break ;
				case 3:
					planeResult=CollisionUtils.intersectsPlaneAndSphere(this._right,sphere);
					break ;
				case 4:
					planeResult=CollisionUtils.intersectsPlaneAndSphere(this._top,sphere);
					break ;
				case 5:
					planeResult=CollisionUtils.intersectsPlaneAndSphere(this._bottom,sphere);
					break ;
				}
			switch (planeResult){
				case Plane.PlaneIntersectionType_Back:
					return /*laya.d3.math.ContainmentType.Disjoint*/0;
				case Plane.PlaneIntersectionType_Intersecting:
					result=Plane.PlaneIntersectionType_Intersecting;
					break ;
				}
		}
		switch (result){
			case Plane.PlaneIntersectionType_Intersecting:
				return /*laya.d3.math.ContainmentType.Intersects*/2;
			default :
				return /*laya.d3.math.ContainmentType.Contains*/1;
			}
	}

	/**
	*@private
	*/
	__proto._getBoxToPlanePVertexNVertex=function(box,planeNormal,outP,outN){
		var boxMin=box.min;
		var boxMinE=boxMin.elements;
		var boxMax=box.max;
		var boxMaxE=boxMax.elements;
		var planeNorE=planeNormal.elements;
		var planeNorEX=planeNorE[0];
		var planeNorEY=planeNorE[1];
		var planeNorEZ=planeNorE[2];
		boxMin.cloneTo(outP);;
		var outPE=outP.elements;
		if (planeNorEX >=0)
			outPE[0]=boxMaxE[0];
		if (planeNorEY >=0)
			outPE[1]=boxMaxE[1];
		if (planeNorEZ >=0)
			outPE[2]=boxMaxE[2];
		boxMax.cloneTo(outN);
		var outNE=outN.elements;
		if (planeNorEX >=0)
			outNE[0]=boxMinE[0];
		if (planeNorEY >=0)
			outNE[1]=boxMinE[1];
		if (planeNorEZ >=0)
			outNE[2]=boxMinE[2];
	}

	/**
	*获取顶平面。
	*@return 顶平面。
	*/
	__getset(0,__proto,'top',function(){
		return this._top;
	});

	/**
	*设置描述矩阵。
	*@param matrix 描述矩阵。
	*/
	/**
	*获取描述矩阵。
	*@return 描述矩阵。
	*/
	__getset(0,__proto,'matrix',function(){
		return this._matrix;
		},function(matrix){
		this._matrix=matrix;
		BoundFrustum._getPlanesFromMatrix(this._matrix,this._near,this._far,this._left,this._right,this._top,this._bottom);
	});

	/**
	*获取近平面。
	*@return 近平面。
	*/
	__getset(0,__proto,'near',function(){
		return this._near;
	});

	/**
	*获取远平面。
	*@return 远平面。
	*/
	__getset(0,__proto,'far',function(){
		return this._far;
	});

	/**
	*获取左平面。
	*@return 左平面。
	*/
	__getset(0,__proto,'left',function(){
		return this._left;
	});

	/**
	*获取右平面。
	*@return 右平面。
	*/
	__getset(0,__proto,'right',function(){
		return this._right;
	});

	/**
	*获取底平面。
	*@return 底平面。
	*/
	__getset(0,__proto,'bottom',function(){
		return this._bottom;
	});

	BoundFrustum._getPlanesFromMatrix=function(m,np,fp,lp,rp,tp,bp){
		var matrixE=m.elements;
		var m11=matrixE[0];
		var m12=matrixE[1];
		var m13=matrixE[2];
		var m14=matrixE[3];
		var m21=matrixE[4];
		var m22=matrixE[5];
		var m23=matrixE[6];
		var m24=matrixE[7];
		var m31=matrixE[8];
		var m32=matrixE[9];
		var m33=matrixE[10];
		var m34=matrixE[11];
		var m41=matrixE[12];
		var m42=matrixE[13];
		var m43=matrixE[14];
		var m44=matrixE[15];
		var nearNorE=np.normal.elements;
		nearNorE[0]=m14+m13;
		nearNorE[1]=m24+m23;
		nearNorE[2]=m34+m33;
		np.distance=m44+m43;
		np.normalize();
		var farNorE=fp.normal.elements;
		farNorE[0]=m14-m13;
		farNorE[1]=m24-m23;
		farNorE[2]=m34-m33;
		fp.distance=m44-m43;
		fp.normalize();
		var leftNorE=lp.normal.elements;
		leftNorE[0]=m14+m11;
		leftNorE[1]=m24+m21;
		leftNorE[2]=m34+m31;
		lp.distance=m44+m41;
		lp.normalize();
		var rightNorE=rp.normal.elements;
		rightNorE[0]=m14-m11;
		rightNorE[1]=m24-m21;
		rightNorE[2]=m34-m31;
		rp.distance=m44-m41;
		rp.normalize();
		var topNorE=tp.normal.elements;
		topNorE[0]=m14-m12;
		topNorE[1]=m24-m22;
		topNorE[2]=m34-m32;
		tp.distance=m44-m42;
		tp.normalize();
		var bottomNorE=bp.normal.elements;
		bottomNorE[0]=m14+m12;
		bottomNorE[1]=m24+m22;
		bottomNorE[2]=m34+m32;
		bp.distance=m44+m42;
		bp.normalize();
	}

	BoundFrustum._get3PlaneInterPoint=function(p1,p2,p3){
		var p1Nor=p1.normal;
		var p2Nor=p2.normal;
		var p3Nor=p3.normal;
		Vector3.cross(p2Nor,p3Nor,BoundFrustum._tempV30);
		Vector3.cross(p3Nor,p1Nor,BoundFrustum._tempV31);
		Vector3.cross(p1Nor,p2Nor,BoundFrustum._tempV32);
		var a=Vector3.dot(p1Nor,BoundFrustum._tempV30);
		var b=Vector3.dot(p2Nor,BoundFrustum._tempV31);
		var c=Vector3.dot(p3Nor,BoundFrustum._tempV32);
		Vector3.scale(BoundFrustum._tempV30,-p1.distance / a,BoundFrustum._tempV33);
		Vector3.scale(BoundFrustum._tempV31,-p2.distance / b,BoundFrustum._tempV34);
		Vector3.scale(BoundFrustum._tempV32,-p3.distance / c,BoundFrustum._tempV35);
		Vector3.add(BoundFrustum._tempV33,BoundFrustum._tempV34,BoundFrustum._tempV36);
		Vector3.add(BoundFrustum._tempV35,BoundFrustum._tempV36,BoundFrustum._tempV37);
		var v=BoundFrustum._tempV37;
		return v;
	}

	__static(BoundFrustum,
	['_tempV30',function(){return this._tempV30=new Vector3();},'_tempV31',function(){return this._tempV31=new Vector3();},'_tempV32',function(){return this._tempV32=new Vector3();},'_tempV33',function(){return this._tempV33=new Vector3();},'_tempV34',function(){return this._tempV34=new Vector3();},'_tempV35',function(){return this._tempV35=new Vector3();},'_tempV36',function(){return this._tempV36=new Vector3();},'_tempV37',function(){return this._tempV37=new Vector3();}
	]);
	return BoundFrustum;
})()


/**

*/
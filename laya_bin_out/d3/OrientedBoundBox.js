/**
*<code>OrientedBoundBox</code> 类用于创建OBB包围盒。
*/
//class laya.d3.math.OrientedBoundBox
var OrientedBoundBox=(function(){
	function OrientedBoundBox(extents,transformation){
		/**每个轴长度的一半*/
		this.extents=null;
		/**这个矩阵表示包围盒的位置和缩放,它的平移向量表示该包围盒的中心*/
		this.transformation=null;
		this.extents=extents;
		this.transformation=transformation;
	}

	__class(OrientedBoundBox,'laya.d3.math.OrientedBoundBox');
	var __proto=OrientedBoundBox.prototype;
	/**
	*获取OBB包围盒的8个顶点。
	*@param corners 返回顶点的输出队列。
	*/
	__proto.getCorners=function(corners){
		var xve=OrientedBoundBox._tempV30.elements;
		var yve=OrientedBoundBox._tempV31.elements;
		var zve=OrientedBoundBox._tempV32.elements;
		var extentsE=this.extents.elements;
		xve[0]=extentsE[0];
		xve[1]=xve[2]=0;
		yve[1]=extentsE[1];
		yve[0]=yve[2]=0;
		zve[2]=extentsE[2];
		zve[0]=zve[1]=0;
		Vector3.TransformNormal(OrientedBoundBox._tempV30,this.transformation,OrientedBoundBox._tempV30);
		Vector3.TransformNormal(OrientedBoundBox._tempV31,this.transformation,OrientedBoundBox._tempV31);
		Vector3.TransformNormal(OrientedBoundBox._tempV32,this.transformation,OrientedBoundBox._tempV32);
		var center=OrientedBoundBox._tempV33;
		this.transformation.getTranslationVector(center);
		corners.length=8;
		Vector3.add(center,OrientedBoundBox._tempV30,OrientedBoundBox._tempV34);
		Vector3.add(OrientedBoundBox._tempV34,OrientedBoundBox._tempV31,OrientedBoundBox._tempV34);
		Vector3.add(OrientedBoundBox._tempV34,OrientedBoundBox._tempV32,corners[0]);
		Vector3.add(center,OrientedBoundBox._tempV30,OrientedBoundBox._tempV34);
		Vector3.add(OrientedBoundBox._tempV34,OrientedBoundBox._tempV31,OrientedBoundBox._tempV34);
		Vector3.subtract(OrientedBoundBox._tempV34,OrientedBoundBox._tempV32,corners[1]);
		Vector3.subtract(center,OrientedBoundBox._tempV30,OrientedBoundBox._tempV34);
		Vector3.add(OrientedBoundBox._tempV34,OrientedBoundBox._tempV31,OrientedBoundBox._tempV34);
		Vector3.subtract(OrientedBoundBox._tempV34,OrientedBoundBox._tempV32,corners[2]);
		Vector3.subtract(center,OrientedBoundBox._tempV30,OrientedBoundBox._tempV34);
		Vector3.add(OrientedBoundBox._tempV34,OrientedBoundBox._tempV31,OrientedBoundBox._tempV34);
		Vector3.add(OrientedBoundBox._tempV34,OrientedBoundBox._tempV32,corners[3]);
		Vector3.add(center,OrientedBoundBox._tempV30,OrientedBoundBox._tempV34);
		Vector3.subtract(OrientedBoundBox._tempV34,OrientedBoundBox._tempV31,OrientedBoundBox._tempV34);
		Vector3.add(OrientedBoundBox._tempV34,OrientedBoundBox._tempV32,corners[4]);
		Vector3.add(center,OrientedBoundBox._tempV30,OrientedBoundBox._tempV34);
		Vector3.subtract(OrientedBoundBox._tempV34,OrientedBoundBox._tempV31,OrientedBoundBox._tempV34);
		Vector3.subtract(OrientedBoundBox._tempV34,OrientedBoundBox._tempV32,corners[5]);
		Vector3.subtract(center,OrientedBoundBox._tempV30,OrientedBoundBox._tempV34);
		Vector3.subtract(OrientedBoundBox._tempV34,OrientedBoundBox._tempV31,OrientedBoundBox._tempV34);
		Vector3.subtract(OrientedBoundBox._tempV34,OrientedBoundBox._tempV32,corners[6]);
		Vector3.subtract(center,OrientedBoundBox._tempV30,OrientedBoundBox._tempV34);
		Vector3.subtract(OrientedBoundBox._tempV34,OrientedBoundBox._tempV31,OrientedBoundBox._tempV34);
		Vector3.add(OrientedBoundBox._tempV34,OrientedBoundBox._tempV32,corners[7]);
	}

	/**
	*变换该包围盒的矩阵信息。
	*@param mat 矩阵
	*/
	__proto.transform=function(mat){
		Matrix4x4.multiply(this.transformation,mat,this.transformation);
	}

	/**
	*缩放该包围盒
	*@param scaling 各轴的缩放比。
	*/
	__proto.scale=function(scaling){
		Vector3.multiply(this.extents,scaling,this.extents);
	}

	/**
	*平移该包围盒。
	*@param translation 平移参数
	*/
	__proto.translate=function(translation){
		this.transformation.getTranslationVector(OrientedBoundBox._tempV30);
		Vector3.add(OrientedBoundBox._tempV30,translation,OrientedBoundBox._tempV31);
		this.transformation.setTranslationVector(OrientedBoundBox._tempV31);
	}

	/**
	*该包围盒的尺寸。
	*@param out 输出
	*/
	__proto.Size=function(out){
		Vector3.scale(this.extents,2,out);
	}

	/**
	*该包围盒需要考虑的尺寸
	*@param out 输出
	*/
	__proto.getSize=function(out){
		var extentsE=this.extents.elements;
		OrientedBoundBox._tempV30.x=extentsE[0];
		OrientedBoundBox._tempV31.y=extentsE[1];
		OrientedBoundBox._tempV32.z=extentsE[2];
		Vector3.TransformNormal(OrientedBoundBox._tempV30,this.transformation,OrientedBoundBox._tempV30);
		Vector3.TransformNormal(OrientedBoundBox._tempV31,this.transformation,OrientedBoundBox._tempV31);
		Vector3.TransformNormal(OrientedBoundBox._tempV31,this.transformation,OrientedBoundBox._tempV32);
		var oe=out.elements;
		oe[0]=Vector3.scalarLength(OrientedBoundBox._tempV30);
		oe[1]=Vector3.scalarLength(OrientedBoundBox._tempV31);
		oe[2]=Vector3.scalarLength(OrientedBoundBox._tempV32);
	}

	/**
	*该包围盒需要考虑尺寸的平方
	*@param out 输出
	*/
	__proto.getSizeSquared=function(out){
		var extentsE=this.extents.elements;
		OrientedBoundBox._tempV30.x=extentsE[0];
		OrientedBoundBox._tempV31.y=extentsE[1];
		OrientedBoundBox._tempV32.z=extentsE[2];
		Vector3.TransformNormal(OrientedBoundBox._tempV30,this.transformation,OrientedBoundBox._tempV30);
		Vector3.TransformNormal(OrientedBoundBox._tempV31,this.transformation,OrientedBoundBox._tempV31);
		Vector3.TransformNormal(OrientedBoundBox._tempV31,this.transformation,OrientedBoundBox._tempV32);
		var oe=out.elements;
		oe[0]=Vector3.scalarLengthSquared(OrientedBoundBox._tempV30);
		oe[1]=Vector3.scalarLengthSquared(OrientedBoundBox._tempV31);
		oe[2]=Vector3.scalarLengthSquared(OrientedBoundBox._tempV32);
	}

	/**
	*该包围盒的几何中心
	*/
	__proto.getCenter=function(center){
		this.transformation.getTranslationVector(center);
	}

	/**
	*该包围盒是否包含空间中一点
	*@param point 点
	*@return 返回位置关系
	*/
	__proto.containsPoint=function(point){
		var extentsE=this.extents.elements;
		var extentsEX=extentsE[0];
		var extentsEY=extentsE[1];
		var extentsEZ=extentsE[2];
		this.transformation.invert(OrientedBoundBox._tempM0);
		Vector3.transformCoordinate(point,OrientedBoundBox._tempM0,OrientedBoundBox._tempV30);
		var _tempV30e=OrientedBoundBox._tempV30.elements;
		var _tempV30ex=Math.abs(_tempV30e[0]);
		var _tempV30ey=Math.abs(_tempV30e[1]);
		var _tempV30ez=Math.abs(_tempV30e[2]);
		if (MathUtils3D.nearEqual(_tempV30ex,extentsEX)&& MathUtils3D.nearEqual(_tempV30ey,extentsEY)&& MathUtils3D.nearEqual(_tempV30ez,extentsEZ))
			return /*laya.d3.math.ContainmentType.Intersects*/2;
		if (_tempV30ex < extentsEX && _tempV30ey < extentsEY && _tempV30ez < extentsEZ)
			return /*laya.d3.math.ContainmentType.Contains*/1;
		else
		return /*laya.d3.math.ContainmentType.Disjoint*/0;
	}

	/**
	*该包围盒是否包含空间中多点
	*@param point 点
	*@return 返回位置关系
	*/
	__proto.containsPoints=function(points){
		var extentse=this.extents.elements;
		var extentsex=extentse[0];
		var extentsey=extentse[1];
		var extentsez=extentse[2];
		this.transformation.invert(OrientedBoundBox._tempM0);
		var containsAll=true;
		var containsAny=false;
		for (var i=0;i < points.length;i++){
			Vector3.transformCoordinate(points[i],OrientedBoundBox._tempM0,OrientedBoundBox._tempV30);
			var _tempV30e=OrientedBoundBox._tempV30.elements;
			var _tempV30ex=Math.abs(_tempV30e[0]);
			var _tempV30ey=Math.abs(_tempV30e[1]);
			var _tempV30ez=Math.abs(_tempV30e[2]);
			if (MathUtils3D.nearEqual(_tempV30ex,extentsex)&& MathUtils3D.nearEqual(_tempV30ey,extentsey)&& MathUtils3D.nearEqual(_tempV30ez,extentsez))
				containsAny=true;
			if (_tempV30ex < extentsex && _tempV30ey < extentsey && _tempV30ez < extentsez)
				containsAny=true;
			else
			containsAll=false;
		}
		if (containsAll)
			return /*laya.d3.math.ContainmentType.Contains*/1;
		else if (containsAny)
		return /*laya.d3.math.ContainmentType.Intersects*/2;
		else
		return /*laya.d3.math.ContainmentType.Disjoint*/0;
	}

	/**
	*该包围盒是否包含空间中一包围球
	*@param sphere 包围球
	*@param ignoreScale 是否考虑该包围盒的缩放
	*@return 返回位置关系
	*/
	__proto.containsSphere=function(sphere,ignoreScale){
		(ignoreScale===void 0)&& (ignoreScale=false);
		var extentsE=this.extents.elements;
		var extentsEX=extentsE[0];
		var extentsEY=extentsE[1];
		var extentsEZ=extentsE[2];
		var sphereR=sphere.radius;
		this.transformation.invert(OrientedBoundBox._tempM0);
		Vector3.transformCoordinate(sphere.center,OrientedBoundBox._tempM0,OrientedBoundBox._tempV30);
		var locRadius=NaN;
		if (ignoreScale){
			locRadius=sphereR;
			}else {
			Vector3.scale(Vector3.UnitX,sphereR,OrientedBoundBox._tempV31);
			Vector3.TransformNormal(OrientedBoundBox._tempV31,OrientedBoundBox._tempM0,OrientedBoundBox._tempV31);
			locRadius=Vector3.scalarLength(OrientedBoundBox._tempV31);
		}
		Vector3.scale(this.extents,-1,OrientedBoundBox._tempV32);
		Vector3.Clamp(OrientedBoundBox._tempV30,OrientedBoundBox._tempV32,this.extents,OrientedBoundBox._tempV33);
		var distance=Vector3.distanceSquared(OrientedBoundBox._tempV30,OrientedBoundBox._tempV33);
		if (distance > locRadius *locRadius)
			return /*laya.d3.math.ContainmentType.Disjoint*/0;
		var tempV30e=OrientedBoundBox._tempV30.elements;
		var tempV30ex=tempV30e[0];
		var tempV30ey=tempV30e[1];
		var tempV30ez=tempV30e[2];
		var tempV32e=OrientedBoundBox._tempV32.elements;
		var tempV32ex=tempV32e[0];
		var tempV32ey=tempV32e[1];
		var tempV32ez=tempV32e[2];
		if ((((tempV32ex+locRadius <=tempV30ex)&& (tempV30ex <=extentsEX-locRadius))&& ((extentsEX-tempV32ex > locRadius)&& (tempV32ey+locRadius <=tempV30ey)))&& (((tempV30ey <=extentsEY-locRadius)&& (extentsEY-tempV32ey > locRadius))&& (((tempV32ez+locRadius <=tempV30ez)&& (tempV30ez <=extentsEZ-locRadius))&& (extentsEZ-tempV32ez > locRadius)))){
			return /*laya.d3.math.ContainmentType.Contains*/1;
		}
		return /*laya.d3.math.ContainmentType.Intersects*/2;
	}

	/**
	*For accuracy,The transformation matrix for both <see cref="OrientedBoundingBox"/> must not have any scaling applied to it.
	*Anyway,scaling using Scale method will keep this method accurate.
	*该包围盒是否包含空间中另一OBB包围盒
	*@param obb OBB包围盒
	*@return 返回位置关系
	*/
	__proto.containsOrientedBoundBox=function(obb){
		var i=0,k=0;
		obb.getCorners(OrientedBoundBox._corners);
		var cornersCheck=this.containsPoints(OrientedBoundBox._corners);
		if (cornersCheck !=/*laya.d3.math.ContainmentType.Disjoint*/0)
			return cornersCheck;
		var sizeAe=this.extents.elements;
		obb.extents.cloneTo(OrientedBoundBox._tempV35);
		var sizeBe=OrientedBoundBox._tempV35.elements;
		OrientedBoundBox._getRows(this.transformation,OrientedBoundBox._rows1);
		OrientedBoundBox._getRows(obb.transformation,OrientedBoundBox._rows2);
		var extentA=NaN,extentB=NaN,separation=NaN,dotNumber=NaN;
		for (i=0;i < 4;i++){
			for (k=0;k < 4;k++){
				if (i==3 || k==3){
					OrientedBoundBox._tempM0.setElementByRowColumn(i,k,0);
					OrientedBoundBox._tempM1.setElementByRowColumn(i,k,0);
					}else {
					dotNumber=Vector3.dot(OrientedBoundBox._rows1[i],OrientedBoundBox._rows2[k]);
					OrientedBoundBox._tempM0.setElementByRowColumn(i,k,dotNumber);
					OrientedBoundBox._tempM1.setElementByRowColumn(i,k,Math.abs(dotNumber));
				}
			}
		}
		obb.getCenter(OrientedBoundBox._tempV34);
		this.getCenter(OrientedBoundBox._tempV36);
		Vector3.subtract(OrientedBoundBox._tempV34,OrientedBoundBox._tempV36,OrientedBoundBox._tempV30);
		var vsepAe=OrientedBoundBox._tempV31.elements;
		vsepAe[0]=Vector3.dot(OrientedBoundBox._tempV30,OrientedBoundBox._rows1[0]);
		vsepAe[1]=Vector3.dot(OrientedBoundBox._tempV30,OrientedBoundBox._rows1[1]);
		vsepAe[2]=Vector3.dot(OrientedBoundBox._tempV30,OrientedBoundBox._rows1[2]);
		var _tempV32e=OrientedBoundBox._tempV32.elements;
		var _tempV33e=OrientedBoundBox._tempV33.elements;
		for (i=0;i < 3;i++){
			_tempV32e[0]=OrientedBoundBox._tempM1.getElementByRowColumn(i,0);
			_tempV32e[1]=OrientedBoundBox._tempM1.getElementByRowColumn(i,1);
			_tempV32e[2]=OrientedBoundBox._tempM1.getElementByRowColumn(i,2);
			extentA=sizeAe[i];
			extentB=Vector3.dot(OrientedBoundBox._tempV35,OrientedBoundBox._tempV32);
			separation=Math.abs(vsepAe[i]);
			if (separation > extentA+extentB)
				return /*laya.d3.math.ContainmentType.Disjoint*/0;
		}
		for (k=0;k < 3;k++){
			_tempV32e[0]=OrientedBoundBox._tempM1.getElementByRowColumn(0,k);
			_tempV32e[1]=OrientedBoundBox._tempM1.getElementByRowColumn(1,k);
			_tempV32e[2]=OrientedBoundBox._tempM1.getElementByRowColumn(2,k);
			_tempV33e[0]=OrientedBoundBox._tempM0.getElementByRowColumn(0,k);
			_tempV33e[1]=OrientedBoundBox._tempM0.getElementByRowColumn(1,k);
			_tempV33e[2]=OrientedBoundBox._tempM0.getElementByRowColumn(2,k);
			extentA=Vector3.dot(this.extents,OrientedBoundBox._tempV32);
			extentB=sizeBe[k];
			separation=Math.abs(Vector3.dot(OrientedBoundBox._tempV31,OrientedBoundBox._tempV33));
			if (separation > extentA+extentB)
				return /*laya.d3.math.ContainmentType.Disjoint*/0;
		}
		for (i=0;i < 3;i++){
			for (k=0;k < 3;k++){
				var i1=(i+1)% 3,i2=(i+2)% 3;
				var k1=(k+1)% 3,k2=(k+2)% 3;
				extentA=sizeAe[i1] *OrientedBoundBox._tempM1.getElementByRowColumn(i2,k)+sizeAe[i2] *OrientedBoundBox._tempM1.getElementByRowColumn(i1,k);
				extentB=sizeBe[k1] *OrientedBoundBox._tempM1.getElementByRowColumn(i,k2)+sizeBe[k2] *OrientedBoundBox._tempM1.getElementByRowColumn(i,k1);
				separation=Math.abs(vsepAe[i2] *OrientedBoundBox._tempM0.getElementByRowColumn(i1,k)-vsepAe[i1] *OrientedBoundBox._tempM0.getElementByRowColumn(i2,k));
				if (separation > extentA+extentB)
					return /*laya.d3.math.ContainmentType.Disjoint*/0;
			}
		}
		return /*laya.d3.math.ContainmentType.Intersects*/2;
	}

	/**
	*该包围盒是否包含空间中一条线
	*@param point1 点1
	*@param point2 点2
	*@return 返回位置关系
	*/
	__proto.containsLine=function(point1,point2){
		OrientedBoundBox._corners[0]=point1;
		OrientedBoundBox._corners[1]=point2;
		var cornersCheck=this.containsPoints(OrientedBoundBox._corners);
		if (cornersCheck !=/*laya.d3.math.ContainmentType.Disjoint*/0)
			return cornersCheck;
		var extentsE=this.extents.elements;
		var extentsX=extentsE[0];
		var extentsY=extentsE[1];
		var extentsZ=extentsE[2];
		this.transformation.invert(OrientedBoundBox._tempM0);
		Vector3.transformCoordinate(point1,OrientedBoundBox._tempM0,OrientedBoundBox._tempV30);
		Vector3.transformCoordinate(point2,OrientedBoundBox._tempM0,OrientedBoundBox._tempV31);
		Vector3.add(OrientedBoundBox._tempV30,OrientedBoundBox._tempV31,OrientedBoundBox._tempV32);
		Vector3.scale(OrientedBoundBox._tempV32,0.5,OrientedBoundBox._tempV32);
		Vector3.subtract(OrientedBoundBox._tempV30,OrientedBoundBox._tempV32,OrientedBoundBox._tempV33);
		var _tempV33e=OrientedBoundBox._tempV33.elements;
		var _tempV33X=_tempV33e[0];
		var _tempV33Y=_tempV33e[1];
		var _tempV33Z=_tempV33e[2];
		var _tempV34e=OrientedBoundBox._tempV34.elements;
		var _tempV34X=_tempV34e[0]=Math.abs(_tempV33e[0]);
		var _tempV34Y=_tempV34e[1]=Math.abs(_tempV33e[1]);
		var _tempV34Z=_tempV34e[2]=Math.abs(_tempV33e[2]);
		var _tempV32e=OrientedBoundBox._tempV32.elements;
		var _tempV32X=_tempV32e[0];
		var _tempV32Y=_tempV32e[1];
		var _tempV32Z=_tempV32e[2];
		if (Math.abs(_tempV32X)> extentsX+_tempV34X)
			return /*laya.d3.math.ContainmentType.Disjoint*/0;
		if (Math.abs(_tempV32Y)> extentsY+_tempV34Y)
			return /*laya.d3.math.ContainmentType.Disjoint*/0;
		if (Math.abs(_tempV32Z)> extentsZ+_tempV34Z)
			return /*laya.d3.math.ContainmentType.Disjoint*/0;
		if (Math.abs(_tempV32Y *_tempV33Z-_tempV32Z *_tempV33Y)> (extentsY *_tempV34Z+extentsZ *_tempV34Y))
			return /*laya.d3.math.ContainmentType.Disjoint*/0;
		if (Math.abs(_tempV32X *_tempV33Z-_tempV32Z *_tempV33X)> (extentsX *_tempV34Z+extentsZ *_tempV34X))
			return /*laya.d3.math.ContainmentType.Disjoint*/0;
		if (Math.abs(_tempV32X *_tempV33Y-_tempV32Y *_tempV33X)> (extentsX *_tempV34Y+extentsY *_tempV34X))
			return /*laya.d3.math.ContainmentType.Disjoint*/0;
		return /*laya.d3.math.ContainmentType.Intersects*/2;
	}

	/**
	*该包围盒是否包含空间中另一OBB包围盒
	*@param box 包围盒
	*@return 返回位置关系
	*/
	__proto.containsBoundBox=function(box){
		var i=0,k=0;
		var min=box.min;
		var max=box.max;
		box.getCorners(OrientedBoundBox._corners);
		var cornersCheck=this.containsPoints(OrientedBoundBox._corners);
		if (cornersCheck !=/*laya.d3.math.ContainmentType.Disjoint*/0)
			return cornersCheck;
		Vector3.subtract(max,min,OrientedBoundBox._tempV30);
		Vector3.scale(OrientedBoundBox._tempV30,0.5,OrientedBoundBox._tempV30);
		Vector3.add(min,OrientedBoundBox._tempV30,OrientedBoundBox._tempV30);
		Vector3.subtract(max,OrientedBoundBox._tempV30,OrientedBoundBox._tempV31);
		var sizeAe=this.extents.elements;
		var sizeBe=OrientedBoundBox._tempV31.elements;
		OrientedBoundBox._getRows(this.transformation,OrientedBoundBox._rows1);
		this.transformation.invert(OrientedBoundBox._tempM0);
		var extentA=NaN,extentB=NaN,separation=NaN,dotNumber=NaN;
		for (i=0;i < 3;i++){
			for (k=0;k < 3;k++){
				OrientedBoundBox._tempM1.setElementByRowColumn(i,k,Math.abs(OrientedBoundBox._tempM0.getElementByRowColumn(i,k)));
			}
		}
		this.getCenter(OrientedBoundBox._tempV35);
		Vector3.subtract(OrientedBoundBox._tempV30,OrientedBoundBox._tempV35,OrientedBoundBox._tempV32);
		var vsepAe=OrientedBoundBox._tempV31.elements;
		vsepAe[0]=Vector3.dot(OrientedBoundBox._tempV32,OrientedBoundBox._rows1[0]);
		vsepAe[1]=Vector3.dot(OrientedBoundBox._tempV32,OrientedBoundBox._rows1[1]);
		vsepAe[2]=Vector3.dot(OrientedBoundBox._tempV32,OrientedBoundBox._rows1[2]);
		var _tempV33e=OrientedBoundBox._tempV33.elements;
		var _tempV34e=OrientedBoundBox._tempV34.elements;
		for (i=0;i < 3;i++){
			_tempV33e[0]=OrientedBoundBox._tempM1.getElementByRowColumn(i,0);
			_tempV33e[1]=OrientedBoundBox._tempM1.getElementByRowColumn(i,1);
			_tempV33e[2]=OrientedBoundBox._tempM1.getElementByRowColumn(i,2);
			extentA=sizeAe[i];
			extentB=Vector3.dot(OrientedBoundBox._tempV31,OrientedBoundBox._tempV33);
			separation=Math.abs(vsepAe[i]);
			if (separation > extentA+extentB)
				return /*laya.d3.math.ContainmentType.Disjoint*/0;
		}
		for (k=0;k < 3;k++){
			_tempV33e[0]=OrientedBoundBox._tempM1.getElementByRowColumn(0,k);
			_tempV33e[1]=OrientedBoundBox._tempM1.getElementByRowColumn(1,k);
			_tempV33e[2]=OrientedBoundBox._tempM1.getElementByRowColumn(2,k);
			_tempV34e[0]=OrientedBoundBox._tempM0.getElementByRowColumn(0,k);
			_tempV34e[1]=OrientedBoundBox._tempM0.getElementByRowColumn(1,k);
			_tempV34e[2]=OrientedBoundBox._tempM0.getElementByRowColumn(2,k);
			extentA=Vector3.dot(this.extents,OrientedBoundBox._tempV33);
			extentB=sizeBe[k];
			separation=Math.abs(Vector3.dot(OrientedBoundBox._tempV31,OrientedBoundBox._tempV34));
			if (separation > extentA+extentB)
				return /*laya.d3.math.ContainmentType.Disjoint*/0;
		}
		for (i=0;i < 3;i++){
			for (k=0;k < 3;k++){
				var i1=(i+1)% 3,i2=(i+2)% 3;
				var k1=(k+1)% 3,k2=(k+2)% 3;
				extentA=sizeAe[i1] *OrientedBoundBox._tempM1.getElementByRowColumn(i2,k)+sizeAe[i2] *OrientedBoundBox._tempM1.getElementByRowColumn(i1,k);
				extentB=sizeBe[k1] *OrientedBoundBox._tempM1.getElementByRowColumn(i,k2)+sizeBe[k2] *OrientedBoundBox._tempM1.getElementByRowColumn(i,k1);
				separation=Math.abs(vsepAe[i2] *OrientedBoundBox._tempM0.getElementByRowColumn(i1,k)-vsepAe[i1] *OrientedBoundBox._tempM0.getElementByRowColumn(i2,k));
				if (separation > extentA+extentB)
					return /*laya.d3.math.ContainmentType.Disjoint*/0;
			}
		}
		return /*laya.d3.math.ContainmentType.Intersects*/2;
	}

	/**
	*该包围盒是否与空间中另一射线相交
	*@param ray
	*@param out
	*@return
	*/
	__proto.intersectsRay=function(ray,out){
		Vector3.scale(this.extents,-1,OrientedBoundBox._tempV30);
		this.transformation.invert(OrientedBoundBox._tempM0);
		Vector3.TransformNormal(ray.direction,OrientedBoundBox._tempM0,OrientedBoundBox._ray.direction);
		Vector3.transformCoordinate(ray.origin,OrientedBoundBox._tempM0,OrientedBoundBox._ray.origin);
		OrientedBoundBox._boxBound1.min=OrientedBoundBox._tempV30;
		OrientedBoundBox._boxBound1.max=this.extents;
		var intersects=CollisionUtils.intersectsRayAndBoxRP(OrientedBoundBox._ray,OrientedBoundBox._boxBound1,out);
		if (intersects!==-1)
			Vector3.transformCoordinate(out,this.transformation,out);
		return intersects;
	}

	__proto._getLocalCorners=function(corners){
		corners.length=8;
		var extentsE=this.extents.elements;
		OrientedBoundBox._tempV30.x=extentsE[0];
		OrientedBoundBox._tempV31.y=extentsE[1];
		OrientedBoundBox._tempV32.z=extentsE[2];
		Vector3.add(OrientedBoundBox._tempV30,OrientedBoundBox._tempV31,OrientedBoundBox._tempV33);
		Vector3.add(OrientedBoundBox._tempV33,OrientedBoundBox._tempV32,corners[0]);
		Vector3.add(OrientedBoundBox._tempV30,OrientedBoundBox._tempV31,OrientedBoundBox._tempV33);
		Vector3.subtract(OrientedBoundBox._tempV33,OrientedBoundBox._tempV32,corners[1]);
		Vector3.subtract(OrientedBoundBox._tempV31,OrientedBoundBox._tempV30,OrientedBoundBox._tempV33);
		Vector3.subtract(OrientedBoundBox._tempV33,OrientedBoundBox._tempV30,corners[2]);
		Vector3.subtract(OrientedBoundBox._tempV31,OrientedBoundBox._tempV30,OrientedBoundBox._tempV33);
		Vector3.add(OrientedBoundBox._tempV33,OrientedBoundBox._tempV32,corners[3]);
		Vector3.subtract(OrientedBoundBox._tempV30,OrientedBoundBox._tempV31,OrientedBoundBox._tempV33);
		Vector3.add(OrientedBoundBox._tempV33,OrientedBoundBox._tempV32,corners[4]);
		Vector3.subtract(OrientedBoundBox._tempV30,OrientedBoundBox._tempV31,OrientedBoundBox._tempV33);
		Vector3.subtract(OrientedBoundBox._tempV33,OrientedBoundBox._tempV32,corners[5]);
		Vector3.scale(corners[0],-1,corners[6]);
		Vector3.subtract(OrientedBoundBox._tempV32,OrientedBoundBox._tempV30,OrientedBoundBox._tempV33);
		Vector3.subtract(OrientedBoundBox._tempV33,OrientedBoundBox._tempV31,corners[7]);
	}

	/**
	*判断两个包围盒是否相等
	*@param obb obb包围盒
	*@return Boolean
	*/
	__proto.equals=function(obb){
		return this.extents==obb.extents && this.transformation==obb.transformation;
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var dest=destObject;
		this.extents.cloneTo(dest.extents);
		this.transformation.cloneTo(dest.transformation);
	}

	OrientedBoundBox.createByBoundBox=function(box,out){
		var min=box.min;
		var max=box.max;
		Vector3.subtract(max,min,OrientedBoundBox._tempV30);
		Vector3.scale(OrientedBoundBox._tempV30,0.5,OrientedBoundBox._tempV30);
		Vector3.add(min,OrientedBoundBox._tempV30,OrientedBoundBox._tempV31);
		Vector3.subtract(max,OrientedBoundBox._tempV31,OrientedBoundBox._tempV32);
		Matrix4x4.translation(OrientedBoundBox._tempV31,OrientedBoundBox._tempM0);
		var extents=OrientedBoundBox._tempV32.clone();
		var transformation=OrientedBoundBox._tempM0.clone();
		out.extents=extents;
		out.transformation=transformation;
	}

	OrientedBoundBox.createByMinAndMaxVertex=function(min,max){
		Vector3.subtract(max,min,OrientedBoundBox._tempV30);
		Vector3.scale(OrientedBoundBox._tempV30,0.5,OrientedBoundBox._tempV30);
		Vector3.add(min,OrientedBoundBox._tempV30,OrientedBoundBox._tempV31);
		Vector3.subtract(max,OrientedBoundBox._tempV31,OrientedBoundBox._tempV32);
		Matrix4x4.translation(OrientedBoundBox._tempV31,OrientedBoundBox._tempM0);
		var obb=new OrientedBoundBox(OrientedBoundBox._tempV32,OrientedBoundBox._tempM0);
		return obb;
	}

	OrientedBoundBox._getRows=function(mat,out){
		out.length=3;
		var mate=mat.elements;
		var row0e=out[0].elements;
		row0e[0]=mate[0];
		row0e[1]=mate[1];
		row0e[2]=mate[2];
		var row1e=out[1].elements;
		row1e[0]=mate[4];
		row1e[1]=mate[5];
		row1e[2]=mate[6];
		var row2e=out[2].elements;
		row2e[0]=mate[8];
		row2e[1]=mate[9];
		row2e[2]=mate[10];
	}

	OrientedBoundBox.getObbtoObbMatrix4x4=function(a,b,noMatrixScaleApplied,out){
		var at=a.transformation;
		var bt=b.transformation;
		if (noMatrixScaleApplied){
			OrientedBoundBox._getRows(at,OrientedBoundBox._rows1);
			OrientedBoundBox._getRows(bt,OrientedBoundBox._rows2);
			for (var i=0;i < 3;i++){
				for (var k=0;k < 3;k++){
					out.setElementByRowColumn(i,k,Vector3.dot(OrientedBoundBox._rows2[i],OrientedBoundBox._rows1[k]));
				}
			}
			b.getCenter(OrientedBoundBox._tempV30);
			a.getCenter(OrientedBoundBox._tempV31);
			Vector3.subtract(OrientedBoundBox._tempV30,OrientedBoundBox._tempV31,OrientedBoundBox._tempV32);
			var AtoBMe=out.elements;
			AtoBMe[12]=Vector3.dot(OrientedBoundBox._tempV32,OrientedBoundBox._rows1[0]);
			AtoBMe[13]=Vector3.dot(OrientedBoundBox._tempV32,OrientedBoundBox._rows1[1]);
			AtoBMe[14]=Vector3.dot(OrientedBoundBox._tempV32,OrientedBoundBox._rows1[2]);
			AtoBMe[15]=1;
			}else {
			at.invert(OrientedBoundBox._tempM0);
			Matrix4x4.multiply(bt,OrientedBoundBox._tempM0,out);
		}
	}

	OrientedBoundBox.merge=function(a,b,noMatrixScaleApplied){
		var ae=a.extents;
		var at=a.transformation;
		OrientedBoundBox.getObbtoObbMatrix4x4(a,b,noMatrixScaleApplied,OrientedBoundBox._tempM0);
		b._getLocalCorners(OrientedBoundBox._corners);
		Vector3.transformCoordinate(OrientedBoundBox._corners[0],OrientedBoundBox._tempM0,OrientedBoundBox._corners[0]);
		Vector3.transformCoordinate(OrientedBoundBox._corners[1],OrientedBoundBox._tempM0,OrientedBoundBox._corners[1]);
		Vector3.transformCoordinate(OrientedBoundBox._corners[2],OrientedBoundBox._tempM0,OrientedBoundBox._corners[2]);
		Vector3.transformCoordinate(OrientedBoundBox._corners[3],OrientedBoundBox._tempM0,OrientedBoundBox._corners[3]);
		Vector3.transformCoordinate(OrientedBoundBox._corners[4],OrientedBoundBox._tempM0,OrientedBoundBox._corners[4]);
		Vector3.transformCoordinate(OrientedBoundBox._corners[5],OrientedBoundBox._tempM0,OrientedBoundBox._corners[5]);
		Vector3.transformCoordinate(OrientedBoundBox._corners[6],OrientedBoundBox._tempM0,OrientedBoundBox._corners[6]);
		Vector3.transformCoordinate(OrientedBoundBox._corners[7],OrientedBoundBox._tempM0,OrientedBoundBox._corners[7]);
		Vector3.scale(ae,-1,OrientedBoundBox._boxBound1.min);
		ae.cloneTo(OrientedBoundBox._boxBound1.max);
		BoundBox.createfromPoints(OrientedBoundBox._corners,OrientedBoundBox._boxBound2);
		BoundBox.merge(OrientedBoundBox._boxBound2,OrientedBoundBox._boxBound1,OrientedBoundBox._boxBound3);
		var box3Min=OrientedBoundBox._boxBound3.min;
		var box3Max=OrientedBoundBox._boxBound3.max;
		Vector3.subtract(box3Max,box3Min,OrientedBoundBox._tempV30);
		Vector3.scale(OrientedBoundBox._tempV30,0.5,OrientedBoundBox._tempV30);
		Vector3.add(box3Min,OrientedBoundBox._tempV30,OrientedBoundBox._tempV32);
		Vector3.subtract(box3Max,OrientedBoundBox._tempV32,ae);
		Vector3.transformCoordinate(OrientedBoundBox._tempV32,at,OrientedBoundBox._tempV33);
	}

	__static(OrientedBoundBox,
	['_tempV30',function(){return this._tempV30=new Vector3();},'_tempV31',function(){return this._tempV31=new Vector3();},'_tempV32',function(){return this._tempV32=new Vector3();},'_tempV33',function(){return this._tempV33=new Vector3();},'_tempV34',function(){return this._tempV34=new Vector3();},'_tempV35',function(){return this._tempV35=new Vector3();},'_tempV36',function(){return this._tempV36=new Vector3();},'_tempM0',function(){return this._tempM0=new Matrix4x4();},'_tempM1',function(){return this._tempM1=new Matrix4x4();},'_corners',function(){return this._corners=/*new vector.<>*/[new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3()];},'_rows1',function(){return this._rows1=/*new vector.<>*/[new Vector3(),new Vector3(),new Vector3()];},'_rows2',function(){return this._rows2=/*new vector.<>*/[new Vector3(),new Vector3(),new Vector3()];},'_ray',function(){return this._ray=new Ray(new Vector3(),new Vector3());},'_boxBound1',function(){return this._boxBound1=new BoundBox(new Vector3(),new Vector3());},'_boxBound2',function(){return this._boxBound2=new BoundBox(new Vector3(),new Vector3());},'_boxBound3',function(){return this._boxBound3=new BoundBox(new Vector3(),new Vector3());}
	]);
	return OrientedBoundBox;
})()


/**

*/
/**
*<code>Vector3</code> 类用于创建三维向量。
*/
//class laya.d3.math.Vector3 extends laya.d3.math.BaseVector
var Vector3=(function(_super){
	/**
	*创建一个 <code>Vector3</code> 实例。
	*@param x X轴坐标。
	*@param y Y轴坐标。
	*@param z Z轴坐标。
	*/
	function Vector3(x,y,z,nativeElements){
		Vector3.__super.call(this);
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		(z===void 0)&& (z=0);
		var v;
		if (nativeElements){
			v=nativeElements;
			}else {
			v=new Float32Array(3);
		}
		this.elements=v;
		v[0]=x;
		v[1]=y;
		v[2]=z;
	}

	__class(Vector3,'laya.d3.math.Vector3',_super);
	var __proto=Vector3.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*设置xyz值。
	*@param x X值。
	*@param y Y值。
	*@param z Z值。
	*/
	__proto.setValue=function(x,y,z){
		this.elements[0]=x;
		this.elements[1]=y;
		this.elements[2]=z;
	}

	/**
	*从Array数组拷贝值。
	*@param array 数组。
	*@param offset 数组偏移。
	*/
	__proto.fromArray=function(array,offset){
		(offset===void 0)&& (offset=0);
		this.elements[0]=array[offset+0];
		this.elements[1]=array[offset+1];
		this.elements[2]=array[offset+2];
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destVector3=destObject;
		var destE=destVector3.elements;
		var s=this.elements;
		destE[0]=s[0];
		destE[1]=s[1];
		destE[2]=s[2];
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destVector3=/*__JS__ */new this.constructor();
		this.cloneTo(destVector3);
		return destVector3;
	}

	__proto.toDefault=function(){
		this.elements[0]=0;
		this.elements[1]=0;
		this.elements[2]=0;
	}

	/**
	*设置X轴坐标。
	*@param value X轴坐标。
	*/
	/**
	*获取X轴坐标。
	*@return X轴坐标。
	*/
	__getset(0,__proto,'x',function(){
		return this.elements[0];
		},function(value){
		this.elements[0]=value;
	});

	/**
	*设置Y轴坐标。
	*@param value Y轴坐标。
	*/
	/**
	*获取Y轴坐标。
	*@return Y轴坐标。
	*/
	__getset(0,__proto,'y',function(){
		return this.elements[1];
		},function(value){
		this.elements[1]=value;
	});

	/**
	*设置Z轴坐标。
	*@param value Z轴坐标。
	*/
	/**
	*获取Z轴坐标。
	*@return Z轴坐标。
	*/
	__getset(0,__proto,'z',function(){
		return this.elements[2];
		},function(value){
		this.elements[2]=value;
	});

	Vector3.distanceSquared=function(value1,value2){
		var value1e=value1.elements;
		var value2e=value2.elements;
		var x=value1e[0]-value2e[0];
		var y=value1e[1]-value2e[1];
		var z=value1e[2]-value2e[2];
		return (x *x)+(y *y)+(z *z);
	}

	Vector3.distance=function(value1,value2){
		var value1e=value1.elements;
		var value2e=value2.elements;
		var x=value1e[0]-value2e[0];
		var y=value1e[1]-value2e[1];
		var z=value1e[2]-value2e[2];
		return Math.sqrt((x *x)+(y *y)+(z *z));
	}

	Vector3.min=function(a,b,out){
		var e=out.elements;
		var f=a.elements;
		var g=b.elements
		e[0]=Math.min(f[0],g[0]);
		e[1]=Math.min(f[1],g[1]);
		e[2]=Math.min(f[2],g[2]);
	}

	Vector3.max=function(a,b,out){
		var e=out.elements;
		var f=a.elements;
		var g=b.elements
		e[0]=Math.max(f[0],g[0]);
		e[1]=Math.max(f[1],g[1]);
		e[2]=Math.max(f[2],g[2]);
	}

	Vector3.transformQuat=function(source,rotation,out){
		var destination=out.elements;
		var se=source.elements;
		var re=rotation.elements;
		var x=se[0],y=se[1],z=se[2],qx=re[0],qy=re[1],qz=re[2],qw=re[3],
		ix=qw *x+qy *z-qz *y,iy=qw *y+qz *x-qx *z,iz=qw *z+qx *y-qy *x,iw=-qx *x-qy *y-qz *z;
		destination[0]=ix *qw+iw *-qx+iy *-qz-iz *-qy;
		destination[1]=iy *qw+iw *-qy+iz *-qx-ix *-qz;
		destination[2]=iz *qw+iw *-qz+ix *-qy-iy *-qx;
	}

	Vector3.scalarLength=function(a){
		var f=a.elements;
		var x=f[0],y=f[1],z=f[2];
		return Math.sqrt(x *x+y *y+z *z);
	}

	Vector3.scalarLengthSquared=function(a){
		var f=a.elements;
		var x=f[0],y=f[1],z=f[2];
		return x *x+y *y+z *z;
	}

	Vector3.normalize=function(s,out){
		var se=s.elements;
		var oe=out.elements;
		var x=se[0],y=se[1],z=se[2];
		var len=x *x+y *y+z *z;
		if (len > 0){
			len=1 / Math.sqrt(len);
			oe[0]=se[0] *len;
			oe[1]=se[1] *len;
			oe[2]=se[2] *len;
		}
	}

	Vector3.multiply=function(a,b,out){
		var e=out.elements;
		var f=a.elements;
		var g=b.elements
		e[0]=f[0] *g[0];
		e[1]=f[1] *g[1];
		e[2]=f[2] *g[2];
	}

	Vector3.scale=function(a,b,out){
		var e=out.elements;
		var f=a.elements;
		e[0]=f[0] *b;
		e[1]=f[1] *b;
		e[2]=f[2] *b;
	}

	Vector3.lerp=function(a,b,t,out){
		var e=out.elements;
		var f=a.elements;
		var g=b.elements;
		var ax=f[0],ay=f[1],az=f[2];
		e[0]=ax+t *(g[0]-ax);
		e[1]=ay+t *(g[1]-ay);
		e[2]=az+t *(g[2]-az);
	}

	Vector3.transformV3ToV3=function(vector,transform,result){
		var intermediate=Vector3._tempVector4;
		Vector3.transformV3ToV4(vector,transform,intermediate);
		var intermediateElem=intermediate.elements;
		var resultElem=result.elements;
		resultElem[0]=intermediateElem[0];
		resultElem[1]=intermediateElem[1];
		resultElem[2]=intermediateElem[2];
	}

	Vector3.transformV3ToV4=function(vector,transform,result){
		var vectorElem=vector.elements;
		var vectorX=vectorElem[0];
		var vectorY=vectorElem[1];
		var vectorZ=vectorElem[2];
		var transformElem=transform.elements;
		var resultElem=result.elements;
		resultElem[0]=(vectorX *transformElem[0])+(vectorY *transformElem[4])+(vectorZ *transformElem[8])+transformElem[12];
		resultElem[1]=(vectorX *transformElem[1])+(vectorY *transformElem[5])+(vectorZ *transformElem[9])+transformElem[13];
		resultElem[2]=(vectorX *transformElem[2])+(vectorY *transformElem[6])+(vectorZ *transformElem[10])+transformElem[14];
		resultElem[3]=(vectorX *transformElem[3])+(vectorY *transformElem[7])+(vectorZ *transformElem[11])+transformElem[15];
	}

	Vector3.TransformNormal=function(normal,transform,result){
		var normalElem=normal.elements;
		var normalX=normalElem[0];
		var normalY=normalElem[1];
		var normalZ=normalElem[2];
		var transformElem=transform.elements;
		var resultElem=result.elements;
		resultElem[0]=(normalX *transformElem[0])+(normalY *transformElem[4])+(normalZ *transformElem[8]);
		resultElem[1]=(normalX *transformElem[1])+(normalY *transformElem[5])+(normalZ *transformElem[9]);
		resultElem[2]=(normalX *transformElem[2])+(normalY *transformElem[6])+(normalZ *transformElem[10]);
	}

	Vector3.transformCoordinate=function(coordinate,transform,result){
		var coordinateElem=coordinate.elements;
		var coordinateX=coordinateElem[0];
		var coordinateY=coordinateElem[1];
		var coordinateZ=coordinateElem[2];
		var transformElem=transform.elements;
		var w=((coordinateX *transformElem[3])+(coordinateY *transformElem[7])+(coordinateZ *transformElem[11])+transformElem[15]);
		var resultElem=result.elements;
		resultElem[0]=(coordinateX *transformElem[0])+(coordinateY *transformElem[4])+(coordinateZ *transformElem[8])+transformElem[12] / w;
		resultElem[1]=(coordinateX *transformElem[1])+(coordinateY *transformElem[5])+(coordinateZ *transformElem[9])+transformElem[13] / w;
		resultElem[2]=(coordinateX *transformElem[2])+(coordinateY *transformElem[6])+(coordinateZ *transformElem[10])+transformElem[14] / w;
	}

	Vector3.Clamp=function(value,min,max,out){
		var valuee=value.elements;
		var x=valuee[0];
		var y=valuee[1];
		var z=valuee[2];
		var mine=min.elements;
		var mineX=mine[0];
		var mineY=mine[1];
		var mineZ=mine[2];
		var maxe=max.elements;
		var maxeX=maxe[0];
		var maxeY=maxe[1];
		var maxeZ=maxe[2];
		var oute=out.elements;
		x=(x > maxeX)? maxeX :x;
		x=(x < mineX)? mineX :x;
		y=(y > maxeY)? maxeY :y;
		y=(y < mineY)? mineY :y;
		z=(z > maxeZ)? maxeZ :z;
		z=(z < mineZ)? mineZ :z;
		oute[0]=x;
		oute[1]=y;
		oute[2]=z;
	}

	Vector3.add=function(a,b,out){
		var e=out.elements;
		var f=a.elements;
		var g=b.elements
		e[0]=f[0]+g[0];
		e[1]=f[1]+g[1];
		e[2]=f[2]+g[2];
	}

	Vector3.subtract=function(a,b,o){
		var oe=o.elements;
		var ae=a.elements;
		var be=b.elements;
		oe[0]=ae[0]-be[0];
		oe[1]=ae[1]-be[1];
		oe[2]=ae[2]-be[2];
	}

	Vector3.cross=function(a,b,o){
		var ae=a.elements;
		var be=b.elements;
		var oe=o.elements;
		var ax=ae[0],ay=ae[1],az=ae[2],bx=be[0],by=be[1],bz=be[2];
		oe[0]=ay *bz-az *by;
		oe[1]=az *bx-ax *bz;
		oe[2]=ax *by-ay *bx;
	}

	Vector3.dot=function(a,b){
		var ae=a.elements;
		var be=b.elements;
		var r=(ae[0] *be[0])+(ae[1] *be[1])+(ae[2] *be[2]);
		return r;
	}

	Vector3.equals=function(a,b){
		var ae=a.elements;
		var be=b.elements;
		return MathUtils3D.nearEqual(ae[0],be[0])&& MathUtils3D.nearEqual(ae[1],be[1])&& MathUtils3D.nearEqual(ae[2],be[2]);
	}

	Vector3.ZERO=new Vector3(0.0,0.0,0.0);
	Vector3.ONE=new Vector3(1.0,1.0,1.0);
	Vector3.NegativeUnitX=new Vector3(-1,0,0);
	Vector3.UnitX=new Vector3(1,0,0);
	Vector3.UnitY=new Vector3(0,1,0);
	Vector3.UnitZ=new Vector3(0,0,1);
	Vector3.ForwardRH=new Vector3(0,0,-1);
	Vector3.ForwardLH=new Vector3(0,0,1);
	Vector3.Up=new Vector3(0,1,0);
	Vector3.NAN=new Vector3(NaN,NaN,NaN);
	__static(Vector3,
	['_tempVector4',function(){return this._tempVector4=new Vector4();}
	]);
	return Vector3;
})(BaseVector)


/**

*/
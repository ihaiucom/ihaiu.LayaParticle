/**
*<code>Matrix4x4</code> 类用于创建4x4矩阵。
*/
//class laya.d3.math.Matrix4x4
var Matrix4x4=(function(){
	function Matrix4x4(m11,m12,m13,m14,m21,m22,m23,m24,m31,m32,m33,m34,m41,m42,m43,m44,elements){
		/**矩阵元素数组*/
		//this.elements=null;
		(m11===void 0)&& (m11=1);
		(m12===void 0)&& (m12=0);
		(m13===void 0)&& (m13=0);
		(m14===void 0)&& (m14=0);
		(m21===void 0)&& (m21=0);
		(m22===void 0)&& (m22=1);
		(m23===void 0)&& (m23=0);
		(m24===void 0)&& (m24=0);
		(m31===void 0)&& (m31=0);
		(m32===void 0)&& (m32=0);
		(m33===void 0)&& (m33=1);
		(m34===void 0)&& (m34=0);
		(m41===void 0)&& (m41=0);
		(m42===void 0)&& (m42=0);
		(m43===void 0)&& (m43=0);
		(m44===void 0)&& (m44=1);
		var e=elements ? this.elements=elements :this.elements=new Float32Array(16);
		e[0]=m11;
		e[1]=m12;
		e[2]=m13;
		e[3]=m14;
		e[4]=m21;
		e[5]=m22;
		e[6]=m23;
		e[7]=m24;
		e[8]=m31;
		e[9]=m32;
		e[10]=m33;
		e[11]=m34;
		e[12]=m41;
		e[13]=m42;
		e[14]=m43;
		e[15]=m44;
	}

	__class(Matrix4x4,'laya.d3.math.Matrix4x4');
	var __proto=Matrix4x4.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	__proto.setRotation=function(rotation){
		var rotationE=rotation.elements;
		var rotationX=rotationE[0];
		var rotationY=rotationE[1];
		var rotationZ=rotationE[2];
		var rotationW=rotationE[3];
		var xx=rotationX *rotationX;
		var yy=rotationY *rotationY;
		var zz=rotationZ *rotationZ;
		var xy=rotationX *rotationY;
		var zw=rotationZ *rotationW;
		var zx=rotationZ *rotationX;
		var yw=rotationY *rotationW;
		var yz=rotationY *rotationZ;
		var xw=rotationX *rotationW;
		var e=this.elements;
		e[0]=1.0-(2.0 *(yy+zz));
		e[1]=2.0 *(xy+zw);
		e[2]=2.0 *(zx-yw);
		e[4]=2.0 *(xy-zw);
		e[5]=1.0-(2.0 *(zz+xx));
		e[6]=2.0 *(yz+xw);
		e[8]=2.0 *(zx+yw);
		e[9]=2.0 *(yz-xw);
		e[10]=1.0-(2.0 *(yy+xx));
	}

	__proto.setPosition=function(position){
		var positione=position.elements;
		var e=this.elements;
		e[12]=positione[0];
		e[13]=positione[1];
		e[14]=positione[2];
	}

	__proto.getElementByRowColumn=function(row,column){
		if (row < 0 || row > 3)
			throw new Error("row","Rows and columns for matrices run from 0 to 3, inclusive.");
		if (column < 0 || column > 3)
			throw new Error("column","Rows and columns for matrices run from 0 to 3, inclusive.");
		return this.elements[(row *4)+column];
	}

	__proto.setElementByRowColumn=function(row,column,value){
		if (row < 0 || row > 3)
			throw new Error("row","Rows and columns for matrices run from 0 to 3, inclusive.");
		if (column < 0 || column > 3)
			throw new Error("column","Rows and columns for matrices run from 0 to 3, inclusive.");
		this.elements[(row *4)+column]=value;
	}

	/**
	*判断两个4x4矩阵的值是否相等。
	*@param other 4x4矩阵
	*/
	__proto.equalsOtherMatrix=function(other){
		var e=this.elements;
		var oe=other.elements;
		return (MathUtils3D.nearEqual(e[0],oe[0])&& MathUtils3D.nearEqual(e[1],oe[1])&& MathUtils3D.nearEqual(e[2],oe[2])&& MathUtils3D.nearEqual(e[3],oe[3])&& MathUtils3D.nearEqual(e[4],oe[4])&& MathUtils3D.nearEqual(e[5],oe[5])&& MathUtils3D.nearEqual(e[6],oe[6])&& MathUtils3D.nearEqual(e[7],oe[7])&& MathUtils3D.nearEqual(e[8],oe[8])&& MathUtils3D.nearEqual(e[9],oe[9])&& MathUtils3D.nearEqual(e[10],oe[10])&& MathUtils3D.nearEqual(e[11],oe[11])&& MathUtils3D.nearEqual(e[12],oe[12])&& MathUtils3D.nearEqual(e[13],oe[13])&& MathUtils3D.nearEqual(e[14],oe[14])&& MathUtils3D.nearEqual(e[15],oe[15]));
	}

	/**
	*分解矩阵为平移向量、旋转四元数、缩放向量。
	*@param translation 平移向量。
	*@param rotation 旋转四元数。
	*@param scale 缩放向量。
	*@return 是否分解成功。
	*/
	__proto.decomposeTransRotScale=function(translation,rotation,scale){
		var rotationMatrix=Matrix4x4._tempMatrix4x4;
		if (this.decomposeTransRotMatScale(translation,rotationMatrix,scale)){
			Quaternion.createFromMatrix4x4(rotationMatrix,rotation);
			return true;
			}else {
			rotation.identity();
			return false;
		}
	}

	/**
	*分解矩阵为平移向量、旋转矩阵、缩放向量。
	*@param translation 平移向量。
	*@param rotationMatrix 旋转矩阵。
	*@param scale 缩放向量。
	*@return 是否分解成功。
	*/
	__proto.decomposeTransRotMatScale=function(translation,rotationMatrix,scale){
		var e=this.elements;
		var te=translation.elements;
		var re=rotationMatrix.elements;
		var se=scale.elements;
		te[0]=e[12];
		te[1]=e[13];
		te[2]=e[14];
		var m11=e[0],m12=e[1],m13=e[2];
		var m21=e[4],m22=e[5],m23=e[6];
		var m31=e[8],m32=e[9],m33=e[10];
		var sX=se[0]=Math.sqrt((m11 *m11)+(m12 *m12)+(m13 *m13));
		var sY=se[1]=Math.sqrt((m21 *m21)+(m22 *m22)+(m23 *m23));
		var sZ=se[2]=Math.sqrt((m31 *m31)+(m32 *m32)+(m33 *m33));
		if (MathUtils3D.isZero(sX)|| MathUtils3D.isZero(sY)|| MathUtils3D.isZero(sZ)){
			re[1]=re[2]=re[3]=re[4]=re[6]=re[7]=re[8]=re[9]=re[11]=re[12]=re[13]=re[14]=0;
			re[0]=re[5]=re[10]=re[15]=1;
			return false;
		};
		var at=Matrix4x4._tempVector0;
		var atE=at.elements;
		atE[0]=m31 / sZ;
		atE[1]=m32 / sZ;
		atE[2]=m33 / sZ;
		var tempRight=Matrix4x4._tempVector1;
		var tempRightE=tempRight.elements;
		tempRightE[0]=m11 / sX;
		tempRightE[1]=m12 / sX;
		tempRightE[2]=m13 / sX;
		var up=Matrix4x4._tempVector2;
		Vector3.cross(at,tempRight,up);
		var right=Matrix4x4._tempVector1;
		Vector3.cross(up,at,right);
		re[3]=re[7]=re[11]=re[12]=re[13]=re[14]=0;
		re[15]=1;
		re[0]=right.x;
		re[1]=right.y;
		re[2]=right.z;
		re[4]=up.x;
		re[5]=up.y;
		re[6]=up.z;
		re[8]=at.x;
		re[9]=at.y;
		re[10]=at.z;
		((re[0] *m11+re[1] *m12+re[2] *m13)< 0.0)&& (se[0]=-sX);
		((re[4] *m21+re[5] *m22+re[6] *m23)< 0.0)&& (se[1]=-sY);
		((re[8] *m31+re[9] *m32+re[10] *m33)< 0.0)&& (se[2]=-sZ);
		return true;
	}

	/**
	*分解旋转矩阵的旋转为YawPitchRoll欧拉角。
	*@param out float yaw
	*@param out float pitch
	*@param out float roll
	*@return
	*/
	__proto.decomposeYawPitchRoll=function(yawPitchRoll){
		var yawPitchRollE=yawPitchRoll.elements;
		var pitch=Math.asin(-this.elements[9]);
		yawPitchRollE[1]=pitch;
		var test=Math.cos(pitch);
		if (test > MathUtils3D.zeroTolerance){
			yawPitchRollE[2]=Math.atan2(this.elements[1],this.elements[5]);
			yawPitchRollE[0]=Math.atan2(this.elements[8],this.elements[10]);
			}else {
			yawPitchRollE[2]=Math.atan2(-this.elements[4],this.elements[0]);
			yawPitchRollE[0]=0.0;
		}
	}

	/**归一化矩阵 */
	__proto.normalize=function(){
		var v=this.elements;
		var c=v[0],d=v[1],e=v[2],g=Math.sqrt(c *c+d *d+e *e);
		if (g){
			if (g==1)
				return;
			}else {
			v[0]=0;
			v[1]=0;
			v[2]=0;
			return;
		}
		g=1 / g;
		v[0]=c *g;
		v[1]=d *g;
		v[2]=e *g;
	}

	/**计算矩阵的转置矩阵*/
	__proto.transpose=function(){
		var e,t;
		e=this.elements;
		t=e[1];
		e[1]=e[4];
		e[4]=t;
		t=e[2];
		e[2]=e[8];
		e[8]=t;
		t=e[3];
		e[3]=e[12];
		e[12]=t;
		t=e[6];
		e[6]=e[9];
		e[9]=t;
		t=e[7];
		e[7]=e[13];
		e[13]=t;
		t=e[11];
		e[11]=e[14];
		e[14]=t;
		return this;
	}

	/**
	*计算一个矩阵的逆矩阵
	*@param out 输出矩阵
	*/
	__proto.invert=function(out){
		var ae=this.elements;
		var oe=out.elements;
		var a00=ae[0],a01=ae[1],a02=ae[2],a03=ae[3],a10=ae[4],a11=ae[5],a12=ae[6],a13=ae[7],a20=ae[8],a21=ae[9],a22=ae[10],a23=ae[11],a30=ae[12],a31=ae[13],a32=ae[14],a33=ae[15],
		b00=a00 *a11-a01 *a10,b01=a00 *a12-a02 *a10,b02=a00 *a13-a03 *a10,b03=a01 *a12-a02 *a11,b04=a01 *a13-a03 *a11,b05=a02 *a13-a03 *a12,b06=a20 *a31-a21 *a30,b07=a20 *a32-a22 *a30,b08=a20 *a33-a23 *a30,b09=a21 *a32-a22 *a31,b10=a21 *a33-a23 *a31,b11=a22 *a33-a23 *a32,
		det=b00 *b11-b01 *b10+b02 *b09+b03 *b08-b04 *b07+b05 *b06;
		if (Math.abs(det)===0.0){
			return;
		}
		det=1.0 / det;
		oe[0]=(a11 *b11-a12 *b10+a13 *b09)*det;
		oe[1]=(a02 *b10-a01 *b11-a03 *b09)*det;
		oe[2]=(a31 *b05-a32 *b04+a33 *b03)*det;
		oe[3]=(a22 *b04-a21 *b05-a23 *b03)*det;
		oe[4]=(a12 *b08-a10 *b11-a13 *b07)*det;
		oe[5]=(a00 *b11-a02 *b08+a03 *b07)*det;
		oe[6]=(a32 *b02-a30 *b05-a33 *b01)*det;
		oe[7]=(a20 *b05-a22 *b02+a23 *b01)*det;
		oe[8]=(a10 *b10-a11 *b08+a13 *b06)*det;
		oe[9]=(a01 *b08-a00 *b10-a03 *b06)*det;
		oe[10]=(a30 *b04-a31 *b02+a33 *b00)*det;
		oe[11]=(a21 *b02-a20 *b04-a23 *b00)*det;
		oe[12]=(a11 *b07-a10 *b09-a12 *b06)*det;
		oe[13]=(a00 *b09-a01 *b07+a02 *b06)*det;
		oe[14]=(a31 *b01-a30 *b03-a32 *b00)*det;
		oe[15]=(a20 *b03-a21 *b01+a22 *b00)*det;
	}

	/**设置矩阵为单位矩阵*/
	__proto.identity=function(){
		var e=this.elements;
		e[1]=e[2]=e[3]=e[4]=e[6]=e[7]=e[8]=e[9]=e[11]=e[12]=e[13]=e[14]=0;
		e[0]=e[5]=e[10]=e[15]=1;
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var i,s,d;
		s=this.elements;
		d=destObject.elements;
		if (s===d){
			return;
		}
		for (i=0;i < 16;++i){
			d[i]=s[i];
		}
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var dest=/*__JS__ */new this.constructor();
		this.cloneTo(dest);
		return dest;
	}

	/**
	*获取平移向量。
	*@param out 平移向量。
	*/
	__proto.getTranslationVector=function(out){
		var me=this.elements;
		var te=out.elements;
		te[0]=me[12];
		te[1]=me[13];
		te[2]=me[14];
	}

	/**
	*设置平移向量。
	*@param translate 平移向量。
	*/
	__proto.setTranslationVector=function(translate){
		var me=this.elements;
		var ve=translate.elements;
		me[12]=ve[0];
		me[13]=ve[1];
		me[14]=ve[2];
	}

	/**
	*获取前向量。
	*@param out 前向量。
	*/
	__proto.getForward=function(out){
		var me=this.elements;
		var te=out.elements;
		te[0]=-me[8];
		te[1]=-me[9];
		te[2]=-me[10];
	}

	/**
	*设置前向量。
	*@param forward 前向量。
	*/
	__proto.setForward=function(forward){
		var me=this.elements;
		var ve=forward.elements;
		me[8]=-ve[0];
		me[9]=-ve[1];
		me[10]=-ve[2];
	}

	Matrix4x4.createRotationX=function(rad,out){
		var oe=out.elements;
		var s=Math.sin(rad),c=Math.cos(rad);
		oe[1]=oe[2]=oe[3]=oe[4]=oe[7]=oe[8]=oe[11]=oe[12]=oe[13]=oe[14]=0;
		oe[0]=oe[15]=1;
		oe[5]=oe[10]=c;
		oe[6]=s;
		oe[9]=-s;
	}

	Matrix4x4.createRotationY=function(rad,out){
		var oe=out.elements;
		var s=Math.sin(rad),c=Math.cos(rad);
		oe[1]=oe[3]=oe[4]=oe[6]=oe[7]=oe[9]=oe[11]=oe[12]=oe[13]=oe[14]=0;
		oe[5]=oe[15]=1;
		oe[0]=oe[10]=c;
		oe[2]=-s;
		oe[8]=s;
	}

	Matrix4x4.createRotationZ=function(rad,out){
		var oe=out.elements;
		var s=Math.sin(rad),c=Math.cos(rad);
		oe[2]=oe[3]=oe[6]=oe[7]=oe[8]=oe[9]=oe[11]=oe[12]=oe[13]=oe[14]=0;
		oe[10]=oe[15]=1;
		oe[0]=oe[5]=c;
		oe[1]=s;
		oe[4]=-s;
	}

	Matrix4x4.createRotationYawPitchRoll=function(yaw,pitch,roll,result){
		Quaternion.createFromYawPitchRoll(yaw,pitch,roll,Matrix4x4._tempQuaternion);
		Matrix4x4.createRotationQuaternion(Matrix4x4._tempQuaternion,result);
	}

	Matrix4x4.createRotationAxis=function(axis,angle,result){
		var axisE=axis.elements;
		var x=axisE[0];
		var y=axisE[1];
		var z=axisE[2];
		var cos=Math.cos(angle);
		var sin=Math.sin(angle);
		var xx=x *x;
		var yy=y *y;
		var zz=z *z;
		var xy=x *y;
		var xz=x *z;
		var yz=y *z;
		var resultE=result.elements;
		resultE[3]=resultE[7]=resultE[11]=resultE[12]=resultE[13]=resultE[14]=0;
		resultE[15]=1.0;
		resultE[0]=xx+(cos *(1.0-xx));
		resultE[1]=(xy-(cos *xy))+(sin *z);
		resultE[2]=(xz-(cos *xz))-(sin *y);
		resultE[4]=(xy-(cos *xy))-(sin *z);
		resultE[5]=yy+(cos *(1.0-yy));
		resultE[6]=(yz-(cos *yz))+(sin *x);
		resultE[8]=(xz-(cos *xz))+(sin *y);
		resultE[9]=(yz-(cos *yz))-(sin *x);
		resultE[10]=zz+(cos *(1.0-zz));
	}

	Matrix4x4.createRotationQuaternion=function(rotation,result){
		var rotationE=rotation.elements;
		var resultE=result.elements;
		var rotationX=rotationE[0];
		var rotationY=rotationE[1];
		var rotationZ=rotationE[2];
		var rotationW=rotationE[3];
		var xx=rotationX *rotationX;
		var yy=rotationY *rotationY;
		var zz=rotationZ *rotationZ;
		var xy=rotationX *rotationY;
		var zw=rotationZ *rotationW;
		var zx=rotationZ *rotationX;
		var yw=rotationY *rotationW;
		var yz=rotationY *rotationZ;
		var xw=rotationX *rotationW;
		resultE[3]=resultE[7]=resultE[11]=resultE[12]=resultE[13]=resultE[14]=0;
		resultE[15]=1.0;
		resultE[0]=1.0-(2.0 *(yy+zz));
		resultE[1]=2.0 *(xy+zw);
		resultE[2]=2.0 *(zx-yw);
		resultE[4]=2.0 *(xy-zw);
		resultE[5]=1.0-(2.0 *(zz+xx));
		resultE[6]=2.0 *(yz+xw);
		resultE[8]=2.0 *(zx+yw);
		resultE[9]=2.0 *(yz-xw);
		resultE[10]=1.0-(2.0 *(yy+xx));
	}

	Matrix4x4.createTranslate=function(trans,out){
		var te=trans.elements;
		var oe=out.elements;
		oe[4]=oe[8]=oe[1]=oe[9]=oe[2]=oe[6]=oe[3]=oe[7]=oe[11]=0;
		oe[0]=oe[5]=oe[10]=oe[15]=1;
		oe[12]=te[0];
		oe[13]=te[1];
		oe[14]=te[2];
	}

	Matrix4x4.createScaling=function(scale,out){
		var se=scale.elements;
		var oe=out.elements;
		oe[0]=se[0];
		oe[5]=se[1];
		oe[10]=se[2];
		oe[1]=oe[4]=oe[8]=oe[12]=oe[9]=oe[13]=oe[2]=oe[6]=oe[14]=oe[3]=oe[7]=oe[11]=0;
		oe[15]=1;
	}

	Matrix4x4.multiply=function(left,right,out){
		var i,e,a,b,ai0,ai1,ai2,ai3;
		e=out.elements;
		a=left.elements;
		b=right.elements;
		if (e===b){
			b=new Float32Array(16);
			for (i=0;i < 16;++i){
				b[i]=e[i];
			}
		};
		var b0=b[0],b1=b[1],b2=b[2],b3=b[3];
		var b4=b[4],b5=b[5],b6=b[6],b7=b[7];
		var b8=b[8],b9=b[9],b10=b[10],b11=b[11];
		var b12=b[12],b13=b[13],b14=b[14],b15=b[15];
		for (i=0;i < 4;i++){
			ai0=a[i];
			ai1=a[i+4];
			ai2=a[i+8];
			ai3=a[i+12];
			e[i]=ai0 *b0+ai1 *b1+ai2 *b2+ai3 *b3;
			e[i+4]=ai0 *b4+ai1 *b5+ai2 *b6+ai3 *b7;
			e[i+8]=ai0 *b8+ai1 *b9+ai2 *b10+ai3 *b11;
			e[i+12]=ai0 *b12+ai1 *b13+ai2 *b14+ai3 *b15;
		}
	}

	Matrix4x4.multiplyForNative=function(left,right,out){
		LayaGL.instance.matrix4x4Multiply(left.elements,right.elements,out.elements);
	}

	Matrix4x4.createFromQuaternion=function(rotation,out){
		var e=out.elements;
		var q=rotation.elements;
		var x=q[0],y=q[1],z=q[2],w=q[3];
		var x2=x+x;
		var y2=y+y;
		var z2=z+z;
		var xx=x *x2;
		var yx=y *x2;
		var yy=y *y2;
		var zx=z *x2;
		var zy=z *y2;
		var zz=z *z2;
		var wx=w *x2;
		var wy=w *y2;
		var wz=w *z2;
		e[0]=1-yy-zz;
		e[1]=yx+wz;
		e[2]=zx-wy;
		e[3]=0;
		e[4]=yx-wz;
		e[5]=1-xx-zz;
		e[6]=zy+wx;
		e[7]=0;
		e[8]=zx+wy;
		e[9]=zy-wx;
		e[10]=1-xx-yy;
		e[11]=0;
		e[12]=0;
		e[13]=0;
		e[14]=0;
		e[15]=1;
	}

	Matrix4x4.createAffineTransformation=function(trans,rot,scale,out){
		var te=trans.elements;
		var re=rot.elements;
		var se=scale.elements;
		var oe=out.elements;
		var x=re[0],y=re[1],z=re[2],w=re[3],x2=x+x,y2=y+y,z2=z+z;
		var xx=x *x2,xy=x *y2,xz=x *z2,yy=y *y2,yz=y *z2,zz=z *z2;
		var wx=w *x2,wy=w *y2,wz=w *z2,sx=se[0],sy=se[1],sz=se[2];
		oe[0]=(1-(yy+zz))*sx;
		oe[1]=(xy+wz)*sx;
		oe[2]=(xz-wy)*sx;
		oe[3]=0;
		oe[4]=(xy-wz)*sy;
		oe[5]=(1-(xx+zz))*sy;
		oe[6]=(yz+wx)*sy;
		oe[7]=0;
		oe[8]=(xz+wy)*sz;
		oe[9]=(yz-wx)*sz;
		oe[10]=(1-(xx+yy))*sz;
		oe[11]=0;
		oe[12]=te[0];
		oe[13]=te[1];
		oe[14]=te[2];
		oe[15]=1;
	}

	Matrix4x4.createLookAt=function(eye,target,up,out){
		var oE=out.elements;
		var xaxis=Matrix4x4._tempVector0;
		var yaxis=Matrix4x4._tempVector1;
		var zaxis=Matrix4x4._tempVector2;
		Vector3.subtract(eye,target,zaxis);
		Vector3.normalize(zaxis,zaxis);
		Vector3.cross(up,zaxis,xaxis);
		Vector3.normalize(xaxis,xaxis);
		Vector3.cross(zaxis,xaxis,yaxis);
		out.identity();
		oE[0]=xaxis.x;
		oE[4]=xaxis.y;
		oE[8]=xaxis.z;
		oE[1]=yaxis.x;
		oE[5]=yaxis.y;
		oE[9]=yaxis.z;
		oE[2]=zaxis.x;
		oE[6]=zaxis.y;
		oE[10]=zaxis.z;
		oE[12]=-Vector3.dot(xaxis,eye);
		oE[13]=-Vector3.dot(yaxis,eye);
		oE[14]=-Vector3.dot(zaxis,eye);
	}

	Matrix4x4.createPerspective=function(fov,aspect,near,far,out){
		var oe=out.elements;
		var f=1.0 / Math.tan(fov / 2),nf=1 / (near-far);
		oe[0]=f / aspect;
		oe[5]=f;
		oe[10]=(far+near)*nf;
		oe[11]=-1;
		oe[14]=(2 *far *near)*nf;
		oe[1]=oe[2]=oe[3]=oe[4]=oe[6]=oe[7]=oe[8]=oe[9]=oe[12]=oe[13]=oe[15]=0;
	}

	Matrix4x4.createOrthoOffCenterRH=function(left,right,bottom,top,near,far,out){
		var oe=out.elements;
		var lr=1 / (left-right);
		var bt=1 / (bottom-top);
		var nf=1 / (near-far);
		oe[1]=oe[2]=oe[3]=oe[4]=oe[6]=oe[7]=oe[8]=oe[9]=oe[11]=0;
		oe[15]=1;
		oe[0]=-2 *lr;
		oe[5]=-2 *bt;
		oe[10]=2 *nf;
		oe[12]=(left+right)*lr;
		oe[13]=(top+bottom)*bt;
		oe[14]=(far+near)*nf;
	}

	Matrix4x4.billboard=function(objectPosition,cameraPosition,cameraRight,cameraUp,cameraForward,mat){
		Vector3.subtract(objectPosition,cameraPosition,Matrix4x4._tempVector0);
		var lengthSq=Vector3.scalarLengthSquared(Matrix4x4._tempVector0);
		if (MathUtils3D.isZero(lengthSq)){
			Vector3.scale(cameraForward,-1 ,Matrix4x4._tempVector1);
			Matrix4x4._tempVector1.cloneTo(Matrix4x4._tempVector0);
		}
		else{
			Vector3.scale(Matrix4x4._tempVector0,1 / Math.sqrt(lengthSq),Matrix4x4._tempVector0);
		}
		Vector3.cross(cameraUp,Matrix4x4._tempVector0,Matrix4x4._tempVector2);
		Vector3.normalize(Matrix4x4._tempVector2,Matrix4x4._tempVector2);
		Vector3.cross(Matrix4x4._tempVector0,Matrix4x4._tempVector2,Matrix4x4._tempVector3);
		var crosse=Matrix4x4._tempVector2.elements;
		var finale=Matrix4x4._tempVector3.elements;
		var diffee=Matrix4x4._tempVector0.elements;
		var obpose=objectPosition.elements;
		var mate=mat.elements;
		mate[0]=crosse[0];
		mate[1]=crosse[1];
		mate[2]=crosse[2];
		mate[3]=0.0;
		mate[4]=finale[0];
		mate[5]=finale[1];
		mate[6]=finale[2];
		mate[7]=0.0;
		mate[8]=diffee[0];
		mate[9]=diffee[1];
		mate[10]=diffee[2];
		mate[11]=0.0;
		mate[12]=obpose[0];
		mate[13]=obpose[1];
		mate[14]=obpose[2];
		mate[15]=1.0;
	}

	Matrix4x4.translation=function(v3,out){
		var ve=v3.elements;
		var oe=out.elements;
		oe[0]=oe[5]=oe[10]=oe[15]=1;
		oe[12]=ve[0];
		oe[13]=ve[1];
		oe[14]=ve[2];
	}

	__static(Matrix4x4,
	['_tempMatrix4x4',function(){return this._tempMatrix4x4=new Matrix4x4();},'_tempVector0',function(){return this._tempVector0=new Vector3();},'_tempVector1',function(){return this._tempVector1=new Vector3();},'_tempVector2',function(){return this._tempVector2=new Vector3();},'_tempVector3',function(){return this._tempVector3=new Vector3();},'_tempQuaternion',function(){return this._tempQuaternion=new Quaternion();},'DEFAULT',function(){return this.DEFAULT=new Matrix4x4();},'ZERO',function(){return this.ZERO=new Matrix4x4(
		0,0,0,0,
		0,0,0,0,
		0,0,0,0,
		0,0,0,0);}
	]);
	return Matrix4x4;
})()


/**
*...
*@author ...
*/
//class laya.d3.core.GradientMode
var GradientMode=(function(){
	function GradientMode(){}
	__class(GradientMode,'laya.d3.core.GradientMode');
	GradientMode.Blend=0;
	GradientMode.Fixed=1;
	return GradientMode;
})()


/**

*/
//class laya.layagl.MatrixConch
var MatrixConch=(function(){
	function MatrixConch(a,b,c,d,tx,ty,nums){
		/**@private */
		//this._nums=null;
		/**@private 是否有旋转缩放操作*/
		//this._bTransform=false;
		(a===void 0)&& (a=1);
		(b===void 0)&& (b=0);
		(c===void 0)&& (c=0);
		(d===void 0)&& (d=1);
		(tx===void 0)&& (tx=0);
		(ty===void 0)&& (ty=0);
		this._nums=nums=nums ? nums :new Float32Array(6);
		nums[0]=a;
		nums[1]=b;
		nums[2]=c;
		nums[3]=d;
		nums[4]=tx;
		nums[5]=ty;
		this._checkTransform();
	}

	__class(MatrixConch,'laya.layagl.MatrixConch');
	var __proto=MatrixConch.prototype;
	/**
	*将本矩阵设置为单位矩阵。
	*@return 返回矩阵对象本身
	*/
	__proto.identity=function(){
		var nums=this._nums;
		nums[0]=nums[3]=1;
		nums[1]=nums[4]=nums[5]=nums[2]=0;
		this._bTransform=false;
		return this;
	}

	/**@private */
	__proto._checkTransform=function(){
		var nums=this._nums;
		return this._bTransform=(nums[0]!==1 || nums[1]!==0 || nums[2]!==0 || nums[3]!==1);
	}

	/**
	*设置沿 x 、y 轴平移每个点的距离。
	*@param x 沿 x 轴平移每个点的距离。
	*@param y 沿 y 轴平移每个点的距离。
	*@return 返回矩阵对象本身
	*/
	__proto.setTranslate=function(x,y){
		this._nums[4]=x;
		this._nums[5]=y;
		return this;
	}

	/**
	*沿 x 和 y 轴平移矩阵，平移的变化量由 x 和 y 参数指定。
	*@param x 沿 x 轴向右移动的量（以像素为单位）。
	*@param y 沿 y 轴向下移动的量（以像素为单位）。
	*@return 返回矩阵对象本身
	*/
	__proto.translate=function(x,y){
		this._nums[4]+=x;
		this._nums[5]+=y;
		return this;
	}

	/**
	*对矩阵应用缩放转换。
	*@param x 用于沿 x 轴缩放对象的乘数。
	*@param y 用于沿 y 轴缩放对象的乘数。
	*@return 返回矩阵对象本身
	*/
	__proto.scale=function(x,y){
		var nums=this._nums;
		nums[0] *=x;
		nums[3] *=y;
		nums[2] *=x;
		nums[1] *=y;
		nums[4] *=x;
		nums[5] *=y;
		this._bTransform=true;
		return this;
	}

	/**
	*对 Matrix 对象应用旋转转换。
	*@param angle 以弧度为单位的旋转角度。
	*@return 返回矩阵对象本身
	*/
	__proto.rotate=function(angle){
		var nums=this._nums;
		var cos=Math.cos(angle);
		var sin=Math.sin(angle);
		var a1=nums[0];
		var c1=nums[2];
		var tx1=nums[4];
		nums[0]=a1 *cos-nums[1] *sin;
		nums[1]=a1 *sin+nums[1] *cos;
		nums[2]=c1 *cos-nums[3] *sin;
		nums[3]=c1 *sin+nums[3] *cos;
		nums[4]=tx1 *cos-nums[5] *sin;
		nums[5]=tx1 *sin+nums[5] *cos;
		this._bTransform=true;
		return this;
	}

	/**
	*对 Matrix 对象应用倾斜转换。
	*@param x 沿着 X 轴的 2D 倾斜弧度。
	*@param y 沿着 Y 轴的 2D 倾斜弧度。
	*@return 返回矩阵对象本身
	*/
	__proto.skew=function(x,y){
		var nums=this._nums;
		var tanX=Math.tan(x);
		var tanY=Math.tan(y);
		var a1=nums[0];
		var b1=nums[1];
		nums[0]+=tanY *nums[2];
		nums[1]+=tanY *nums[3];
		nums[2]+=tanX *a1;
		nums[3]+=tanX *b1;
		return this;
	}

	/**
	*对指定的点应用当前矩阵的逆转化并返回此点。
	*@param out 待转化的点 Point 对象。
	*@return 返回out
	*/
	__proto.invertTransformPoint=function(out){
		var nums=this._nums;
		var a1=nums[0];
		var b1=nums[1];
		var c1=nums[2];
		var d1=nums[3];
		var tx1=nums[4];
		var n=a1 *d1-b1 *c1;
		var a2=d1 / n;
		var b2=-b1 / n;
		var c2=-c1 / n;
		var d2=a1 / n;
		var tx2=(c1 *nums[5]-d1 *tx1)/ n;
		var ty2=-(a1 *nums[5]-b1 *tx1)/ n;
		return out.setTo(a2 *out.x+c2 *out.y+tx2,b2 *out.x+d2 *out.y+ty2);
	}

	/**
	*将 Matrix 对象表示的几何转换应用于指定点。
	*@param out 用来设定输出结果的点。
	*@return 返回out
	*/
	__proto.transformPoint=function(out){
		var nums=this._nums;
		return out.setTo(nums[0] *out.x+nums[2] *out.y+nums[4],nums[1] *out.x+nums[3] *out.y+nums[5]);
	}

	/**
	*将 Matrix 对象表示的几何转换应用于指定点，忽略tx、ty。
	*@param out 用来设定输出结果的点。
	*@return 返回out
	*/
	__proto.transformPointN=function(out){
		var nums=this._nums;
		return out.setTo(nums[0] *out.x+nums[2] *out.y ,nums[1] *out.x+nums[3] *out.y);
	}

	/**
	*获取 X 轴缩放值。
	*@return X 轴缩放值。
	*/
	__proto.getScaleX=function(){
		var nums=this._nums;
		return nums[1]===0 ? this.a :Math.sqrt(nums[0] *nums[0]+nums[1] *nums[1]);
	}

	/**
	*获取 Y 轴缩放值。
	*@return Y 轴缩放值。
	*/
	__proto.getScaleY=function(){
		var nums=this._nums;
		return nums[2]===0 ? nums[3] :Math.sqrt(nums[2] *nums[2]+nums[3] *nums[3]);
	}

	/**
	*执行原始矩阵的逆转换。
	*@return 返回矩阵对象本身
	*/
	__proto.invert=function(){
		var nums=this._nums;
		var a1=nums[0];
		var b1=nums[1];
		var c1=nums[2];
		var d1=nums[3];
		var tx1=nums[4];
		var n=a1 *d1-b1 *c1;
		nums[0]=d1 / n;
		nums[1]=-b1 / n;
		nums[2]=-c1 / n;
		nums[3]=a1 / n;
		nums[4]=(c1 *this.ty-d1 *tx1)/ n;
		nums[5]=-(a1 *this.ty-b1 *tx1)/ n;
		return this;
	}

	/**
	*将 Matrix 的成员设置为指定值。
	*@param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
	*@param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
	*@param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
	*@param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
	*@param tx 沿 x 轴平移每个点的距离。
	*@param ty 沿 y 轴平移每个点的距离。
	*@return 返回矩阵对象本身
	*/
	__proto.setTo=function(a,b,c,d,tx,ty){
		var nums=this._nums;
		nums[0]=a,nums[1]=b,nums[2]=c,nums[3]=d,nums[4]=tx,nums[5]=ty;
		return this;
	}

	/**
	*将指定矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。
	*@param matrix 要连接到源矩阵的矩阵。
	*@return 当前矩阵。
	*/
	__proto.concat=function(matrix){
		var nums=this._nums;
		var aNums=matrix._nums;
		var a=nums[0];
		var c=nums[2];
		var tx=nums[4];
		nums[0]=a *aNums[0]+nums[1] *aNums[2];
		nums[1]=a *aNums[1]+nums[1] *aNums[3];
		nums[2]=c *aNums[0]+nums[3] *aNums[2];
		nums[3]=c *aNums[1]+nums[3] *aNums[3];
		nums[4]=tx *aNums[0]+nums[5] *aNums[2]+aNums[4];
		nums[5]=tx *aNums[1]+nums[5] *aNums[3]+aNums[5];
		return this;
	}

	/**
	*@private
	*对矩阵应用缩放转换。反向相乘
	*@param x 用于沿 x 轴缩放对象的乘数。
	*@param y 用于沿 y 轴缩放对象的乘数。
	*/
	__proto.scaleEx=function(x,y){
		var nums=this._nums;
		var ba=nums[0],bb=nums[1],bc=nums[2],bd=nums[3];
		if (bb!==0 || bc!==0){
			nums[0]=x *ba;
			nums[1]=x *bb;
			nums[2]=y *bc;
			nums[3]=y *bd;
			}else {
			nums[0]=x *ba;
			nums[1]=0 *bd;
			nums[2]=0 *ba;
			nums[3]=y *bd;
		}
		this._bTransform=true;
	}

	/**
	*@private
	*对 Matrix 对象应用旋转转换。反向相乘
	*@param angle 以弧度为单位的旋转角度。
	*/
	__proto.rotateEx=function(angle){
		var nums=this._nums;
		var cos=Math.cos(angle);
		var sin=Math.sin(angle);
		var ba=nums[0],bb=nums[1],bc=nums[2],bd=nums[3];
		if (bb!==0 || bc!==0){
			nums[0]=cos *ba+sin *bc;
			nums[1]=cos *bb+sin *bd;
			nums[2]=-sin *ba+cos *bc;
			nums[3]=-sin *bb+cos *bd;
			}else {
			nums[0]=cos *ba;
			nums[1]=sin *bd;
			nums[2]=-sin *ba;
			nums[3]=cos *bd;
		}
		this._bTransform=true;
	}

	/**
	*返回此 Matrix 对象的副本。
	*@return 与原始实例具有完全相同的属性的新 Matrix 实例。
	*/
	__proto.clone=function(){
		var nums=this._nums;
		var dec=MatrixConch.create();
		var dNums=dec._nums;
		dNums[0]=nums[0];
		dNums[1]=nums[1];
		dNums[2]=nums[2];
		dNums[3]=nums[3];
		dNums[4]=nums[4];
		dNums[5]=nums[5];
		dec._bTransform=this._bTransform;
		return dec;
	}

	/**
	*将当前 Matrix 对象中的所有矩阵数据复制到指定的 Matrix 对象中。
	*@param dec 要复制当前矩阵数据的 Matrix 对象。
	*@return 已复制当前矩阵数据的 Matrix 对象。
	*/
	__proto.copyTo=function(dec){
		var nums=this._nums;
		var dNums=dec._nums;
		dNums[0]=nums[0];
		dNums[1]=nums[1];
		dNums[2]=nums[2];
		dNums[3]=nums[3];
		dNums[4]=nums[4];
		dNums[5]=nums[5];
		dec._bTransform=this._bTransform;
		return dec;
	}

	/**
	*返回列出该 Matrix 对象属性的文本值。
	*@return 一个字符串，它包含 Matrix 对象的属性值：a、b、c、d、tx 和 ty。
	*/
	__proto.toString=function(){
		return this.a+","+this.b+","+this.c+","+this.d+","+this.tx+","+this.ty;
	}

	/**
	*销毁此对象。
	*/
	__proto.destroy=function(){
		this.recover();
	}

	/**
	*回收到对象池，方便复用
	*/
	__proto.recover=function(){
		MatrixConch._pool.push(this);
	}

	/**缩放或旋转图像时影响像素沿 x 轴定位的值。*/
	__getset(0,__proto,'a',function(){
		return this._nums[0];
		},function(value){
		this._nums[0]=value;
	});

	/**旋转或倾斜图像时影响像素沿 y 轴定位的值。*/
	__getset(0,__proto,'b',function(){
		return this._nums[1];
		},function(value){
		this._nums[1]=value;
	});

	/**旋转或倾斜图像时影响像素沿 x 轴定位的值。*/
	__getset(0,__proto,'c',function(){
		return this._nums[2];
		},function(value){
		this._nums[2]=value;
	});

	/**缩放或旋转图像时影响像素沿 y 轴定位的值。*/
	__getset(0,__proto,'d',function(){
		return this._nums[3];
		},function(value){
		this._nums[3]=value;
	});

	/**沿 x 轴平移每个点的距离。*/
	__getset(0,__proto,'tx',function(){
		return this._nums[4];
		},function(value){
		this._nums[4]=value;
	});

	/**沿 y 轴平移每个点的距离。*/
	__getset(0,__proto,'ty',function(){
		return this._nums[5];
		},function(value){
		this._nums[5]=value;
	});

	MatrixConch.mul=function(m1,m2,out){
		var m1Nums=m1._nums;
		var m2Nums=m2._nums;
		var oNums=out._nums;
		var aa=m1Nums[0],ab=m1Nums[1],ac=m1Nums[2],ad=m1Nums[3],atx=m1Nums[4],aty=m1Nums[5];
		var ba=m2Nums[0],bb=m2Nums[1],bc=m2Nums[2],bd=m2Nums[3],btx=m2Nums[4],bty=m2Nums[5];
		if (bb!==0 || bc!==0){
			oNums[0]=aa *ba+ab *bc;
			oNums[1]=aa *bb+ab *bd;
			oNums[2]=ac *ba+ad *bc;
			oNums[3]=ac *bb+ad *bd;
			oNums[4]=ba *atx+bc *aty+btx;
			oNums[5]=bb *atx+bd *aty+bty;
			}else {
			oNums[0]=aa *ba;
			oNums[1]=ab *bd;
			oNums[2]=ac *ba;
			oNums[3]=ad *bd;
			oNums[4]=ba *atx+btx;
			oNums[5]=bd *aty+bty;
		}
		return out;
	}

	MatrixConch.mul16=function(m1,m2,out){
		var m1Nums=m1._nums;
		var m2Nums=m2._nums;
		var aa=m1Nums[0],ab=m1Nums[1],ac=m1Nums[2],ad=m1Nums[3],atx=m1Nums[4],aty=m1Nums[5];
		var ba=m2Nums[0],bb=m2Nums[1],bc=m2Nums[2],bd=m2Nums[3],btx=m2Nums[4],bty=m2Nums[5];
		if (bb!==0 || bc!==0){
			out[0]=aa *ba+ab *bc;
			out[1]=aa *bb+ab *bd;
			out[4]=ac *ba+ad *bc;
			out[5]=ac *bb+ad *bd;
			out[12]=ba *atx+bc *aty+btx;
			out[13]=bb *atx+bd *aty+bty;
			}else {
			out[0]=aa *ba;
			out[1]=ab *bd;
			out[4]=ac *ba;
			out[5]=ad *bd;
			out[12]=ba *atx+btx;
			out[13]=bd *aty+bty;
		}
		return out;
	}

	MatrixConch.create=function(nums){
		var m;
		if (MatrixConch._pool.length){
			m=MatrixConch._pool.pop();
			nums && (m._nums=nums);
			m.identity();
			return m;
		}else return new MatrixConch(1,0,0,1,0,0,nums);
	}

	MatrixConch.A=0;
	MatrixConch.B=1;
	MatrixConch.C=2;
	MatrixConch.D=3;
	MatrixConch.TX=4;
	MatrixConch.TY=5;
	MatrixConch.EMPTY=new MatrixConch();
	MatrixConch.TEMP=new MatrixConch();
	MatrixConch._pool=[];
	return MatrixConch;
})()


/**
*由于drawTextureM需要一个Texture对象，又不想真的弄一个，所以，做个假的，只封装必须成员
*/

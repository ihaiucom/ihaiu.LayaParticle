/**
*<code>Vector2</code> 类用于创建二维向量。
*/
//class laya.d3.math.Vector2 extends laya.d3.math.BaseVector
var Vector2=(function(_super){
	/**
	*创建一个 <code>Vector2</code> 实例。
	*@param x X轴坐标。
	*@param y Y轴坐标。
	*/
	function Vector2(x,y){
		Vector2.__super.call(this);
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		var v=this.elements=new Float32Array(2);
		v[0]=x;
		v[1]=y;
	}

	__class(Vector2,'laya.d3.math.Vector2',_super);
	var __proto=Vector2.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*从Array数组拷贝值。
	*@param array 数组。
	*@param offset 数组偏移。
	*/
	__proto.fromArray=function(array,offset){
		(offset===void 0)&& (offset=0);
		this.elements[0]=array[offset+0];
		this.elements[1]=array[offset+1];
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destVector2=destObject;
		var destE=destVector2.elements;
		var s=this.elements;
		destE[0]=s[0];
		destE[1]=s[1];
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destVector2=/*__JS__ */new this.constructor();
		this.cloneTo(destVector2);
		return destVector2;
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

	Vector2.scale=function(a,b,out){
		var e=out.elements;
		var f=a.elements;
		e[0]=f[0] *b;
		e[1]=f[1] *b;
	}

	Vector2.dot=function(a,b){
		var ae=a.elements;
		var be=b.elements;
		var r=(ae[0] *be[0])+(ae[1] *be[1]);
		return r;
	}

	Vector2.normalize=function(s,out){
		var se=s.elements;
		var oe=out.elements;
		var x=se[0],y=se[1];
		var len=x *x+y *y;
		if (len > 0){
			len=1 / Math.sqrt(len);
			oe[0]=se[0] *len;
			oe[1]=se[1] *len;
		}
	}

	Vector2.scalarLength=function(a){
		var f=a.elements;
		var x=f[0],y=f[1];
		return Math.sqrt(x *x+y *y);
	}

	__static(Vector2,
	['ZERO',function(){return this.ZERO=new Vector2(0.0,0.0);},'ONE',function(){return this.ONE=new Vector2(1.0,1.0);}
	]);
	return Vector2;
})(BaseVector)


/**
*@private

*/
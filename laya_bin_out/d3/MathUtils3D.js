/**
*<code>MathUtils</code> 类用于创建数学工具。
*/
//class laya.d3.math.MathUtils3D
var MathUtils3D=(function(){
	/**
	*创建一个 <code>MathUtils</code> 实例。
	*/
	function MathUtils3D(){}
	__class(MathUtils3D,'laya.d3.math.MathUtils3D');
	MathUtils3D.isZero=function(v){
		return Math.abs(v)< MathUtils3D.zeroTolerance;
	}

	MathUtils3D.nearEqual=function(n1,n2){
		if (MathUtils3D.isZero(n1-n2))
			return true;
		return false;
	}

	MathUtils3D.fastInvSqrt=function(value){
		if (MathUtils3D.isZero(value))
			return value;
		return 1.0 / Math.sqrt(value);
	}

	__static(MathUtils3D,
	['zeroTolerance',function(){return this.zeroTolerance=1e-6;},'MaxValue',function(){return this.MaxValue=3.40282347e+38;},'MinValue',function(){return this.MinValue=-3.40282347e+38;}
	]);
	return MathUtils3D;
})()


/**

*/
/**
*<code>Rand</code> 类用于通过32位无符号整型随机种子创建随机数。
*/
//class laya.d3.math.Rand
var Rand=(function(){
	function Rand(seed){
		this._temp=new Uint32Array(1);
		this.seeds=new Uint32Array(4);
		this.seeds[0]=seed;
		this.seeds[1]=this.seeds[0] *0x6C078965+1;
		this.seeds[2]=this.seeds[1] *0x6C078965+1;
		this.seeds[3]=this.seeds[2] *0x6C078965+1;
	}

	__class(Rand,'laya.d3.math.Rand');
	var __proto=Rand.prototype;
	/**
	*获取无符号32位整形随机数。
	*@return 无符号32位整形随机数。
	*/
	__proto.getUint=function(){
		this._temp[0]=this.seeds[0] ^ (this.seeds[0] << 11);
		this.seeds[0]=this.seeds[1];
		this.seeds[1]=this.seeds[2];
		this.seeds[2]=this.seeds[3];
		this.seeds[3]=(this.seeds[3] ^ (this.seeds[3] >>> 19))^ (this._temp[0] ^ (this._temp[0] >>> 8));
		return this.seeds[3];
	}

	/**
	*获取0到1之间的浮点随机数。
	*@return 0到1之间的浮点随机数。
	*/
	__proto.getFloat=function(){
		this.getUint();
		return (this.seeds[3] & 0x007FFFFF)*(1.0 / 8388607.0);
	}

	/**
	*获取-1到1之间的浮点随机数。
	*@return-1到1之间的浮点随机数。
	*/
	__proto.getSignedFloat=function(){
		return this.getFloat()*2.0-1.0;
	}

	/**
	*设置随机种子。
	*@param seed 随机种子。
	*/
	/**
	*获取随机种子。
	*@return 随机种子。
	*/
	__getset(0,__proto,'seed',function(){
		return this.seeds[0];
		},function(seed){
		this.seeds[0]=seed;
		this.seeds[1]=this.seeds[0] *0x6C078965+1;
		this.seeds[2]=this.seeds[1] *0x6C078965+1;
		this.seeds[3]=this.seeds[2] *0x6C078965+1;
	});

	Rand.getFloatFromInt=function(v){
		return (v & 0x007FFFFF)*(1.0 / 8388607.0)
	}

	Rand.getByteFromInt=function(v){
		return (v & 0x007FFFFF)>>> 15;
	}

	return Rand;
})()


/**

*/
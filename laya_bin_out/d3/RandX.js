/**
*<code>Rand</code> 类用于通过128位整型种子创建随机数,算法来自:https://github.com/AndreasMadsen/xorshift。
*/
//class laya.d3.math.RandX
var RandX=(function(){
	function RandX(seed){
		/**@private */
		this._state0U=NaN;
		/**@private */
		this._state0L=NaN;
		/**@private */
		this._state1U=NaN;
		/**@private */
		this._state1L=NaN;
		if (!((seed instanceof Array))|| seed.length!==4)
			throw new Error('Rand:Seed must be an array with 4 numbers');
		this._state0U=seed[0] | 0;
		this._state0L=seed[1] | 0;
		this._state1U=seed[2] | 0;
		this._state1L=seed[3] | 0;
	}

	__class(RandX,'laya.d3.math.RandX');
	var __proto=RandX.prototype;
	/**
	*通过2x32位的数组，返回64位的随机数。
	*@return 64位的随机数。
	*/
	__proto.randomint=function(){
		var s1U=this._state0U,s1L=this._state0L;
		var s0U=this._state1U,s0L=this._state1L;
		var sumL=(s0L >>> 0)+(s1L >>> 0);
		var resU=(s0U+s1U+(sumL / 2 >>> 31))>>> 0;
		var resL=sumL >>> 0;
		this._state0U=s0U;
		this._state0L=s0L;
		var t1U=0,t1L=0;
		var t2U=0,t2L=0;
		var a1=23;
		var m1=0xFFFFFFFF << (32-a1);
		t1U=(s1U << a1)| ((s1L & m1)>>> (32-a1));
		t1L=s1L << a1;
		s1U=s1U ^ t1U;
		s1L=s1L ^ t1L;
		t1U=s1U ^ s0U;
		t1L=s1L ^ s0L;
		var a2=18;
		var m2=0xFFFFFFFF >>> (32-a2);
		t2U=s1U >>> a2;
		t2L=(s1L >>> a2)| ((s1U & m2)<< (32-a2));
		t1U=t1U ^ t2U;
		t1L=t1L ^ t2L;
		var a3=5;
		var m3=0xFFFFFFFF >>> (32-a3);
		t2U=s0U >>> a3;
		t2L=(s0L >>> a3)| ((s0U & m3)<< (32-a3));
		t1U=t1U ^ t2U;
		t1L=t1L ^ t2L;
		this._state1U=t1U;
		this._state1L=t1L;
		return [resU,resL];
	}

	/**
	*返回[0,1)之间的随机数。
	*@return
	*/
	__proto.random=function(){
		var t2=this.randomint();
		var t2U=t2[0];
		var t2L=t2[1];
		var eU=0x3FF << (52-32);
		var eL=0;
		var a1=12;
		var m1=0xFFFFFFFF >>> (32-a1);
		var sU=t2U >>> a1;
		var sL=(t2L >>> a1)| ((t2U & m1)<< (32-a1));
		var xU=eU | sU;
		var xL=eL | sL;
		RandX._CONVERTION_BUFFER.setUint32(0,xU,false);
		RandX._CONVERTION_BUFFER.setUint32(4,xL,false);
		var d=/*__JS__ */Rand._CONVERTION_BUFFER.getFloat64(0,false);
		return d-1;
	}

	__static(RandX,
	['_CONVERTION_BUFFER',function(){return this._CONVERTION_BUFFER=new DataView(new ArrayBuffer(8));},'defaultRand',function(){return this.defaultRand=/*__JS__ */new Rand([0,Date.now()/ 65536,0,Date.now()% 65536]);}
	]);
	return RandX;
})()


/**
*...
*@author ...
*/
//class laya.d3.graphics.VertexElementFormat
var VertexElementFormat=(function(){
	function VertexElementFormat(){}
	__class(VertexElementFormat,'laya.d3.graphics.VertexElementFormat');
	VertexElementFormat.getElementInfos=function(element){
		var info=VertexElementFormat._elementInfos[element];
		if (info)
			return info;
		else
		throw "VertexElementFormat: this vertexElementFormat is not implement.";
	}

	VertexElementFormat.Single="single";
	VertexElementFormat.Vector2="vector2";
	VertexElementFormat.Vector3="vector3";
	VertexElementFormat.Vector4="vector4";
	VertexElementFormat.Color="color";
	VertexElementFormat.Byte4="byte4";
	VertexElementFormat.Short2="short2";
	VertexElementFormat.Short4="short4";
	VertexElementFormat.NormalizedShort2="normalizedshort2";
	VertexElementFormat.NormalizedShort4="normalizedshort4";
	VertexElementFormat.HalfVector2="halfvector2";
	VertexElementFormat.HalfVector4="halfvector4";
	__static(VertexElementFormat,
	['_elementInfos',function(){return this._elementInfos={
			"single":[1,/*laya.webgl.WebGLContext.FLOAT*/0x1406,0],
			"vector2":[2,/*laya.webgl.WebGLContext.FLOAT*/0x1406,0],
			"vector3":[3,/*laya.webgl.WebGLContext.FLOAT*/0x1406,0],
			"vector4":[4,/*laya.webgl.WebGLContext.FLOAT*/0x1406,0],
			"color":[4,/*laya.webgl.WebGLContext.FLOAT*/0x1406,0],
			"byte4":[4,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,0],
			"short2":[2,/*laya.webgl.WebGLContext.FLOAT*/0x1406,0],
			"short4":[4,/*laya.webgl.WebGLContext.FLOAT*/0x1406,0],
			"normalizedshort2":[2,/*laya.webgl.WebGLContext.FLOAT*/0x1406,0],
			"normalizedshort4":[4,/*laya.webgl.WebGLContext.FLOAT*/0x1406,0],
			"halfvector2":[2,/*laya.webgl.WebGLContext.FLOAT*/0x1406,0],
			"halfvector4":[4,/*laya.webgl.WebGLContext.FLOAT*/0x1406,0]
	};}

	]);
	return VertexElementFormat;
})()


/**
*@private

*/
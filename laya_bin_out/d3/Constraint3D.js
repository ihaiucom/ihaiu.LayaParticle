/**
*<code>/**
*<code>HalfFloatUtils</code> 类用于创建HalfFloat工具。
*/
//class laya.d3.math.HalfFloatUtils
var HalfFloatUtils=(function(){
	function HalfFloatUtils(){}
	__class(HalfFloatUtils,'laya.d3.math.HalfFloatUtils');
	HalfFloatUtils.__init__=function(){
		for (var i=0;i < 256;++i){
			var e=i-127;
			if (e <-27){
				HalfFloatUtils._baseTable[i | 0x000]=0x0000;
				HalfFloatUtils._baseTable[i | 0x100]=0x8000;
				HalfFloatUtils._shiftTable[i | 0x000]=24;
				HalfFloatUtils._shiftTable[i | 0x100]=24;
				}else if (e <-14){
				HalfFloatUtils._baseTable[i | 0x000]=0x0400 >> (-e-14);
				HalfFloatUtils._baseTable[i | 0x100]=(0x0400 >> (-e-14))| 0x8000;
				HalfFloatUtils._shiftTable[i | 0x000]=-e-1;
				HalfFloatUtils._shiftTable[i | 0x100]=-e-1;
				}else if (e <=15){
				HalfFloatUtils._baseTable[i | 0x000]=(e+15)<< 10;
				HalfFloatUtils._baseTable[i | 0x100]=((e+15)<< 10)| 0x8000;
				HalfFloatUtils._shiftTable[i | 0x000]=13;
				HalfFloatUtils._shiftTable[i | 0x100]=13;
				}else if (e < 128){
				HalfFloatUtils._baseTable[i | 0x000]=0x7c00;
				HalfFloatUtils._baseTable[i | 0x100]=0xfc00;
				HalfFloatUtils._shiftTable[i | 0x000]=24;
				HalfFloatUtils._shiftTable[i | 0x100]=24;
				}else {
				HalfFloatUtils._baseTable[i | 0x000]=0x7c00;
				HalfFloatUtils._baseTable[i | 0x100]=0xfc00;
				HalfFloatUtils._shiftTable[i | 0x000]=13;
				HalfFloatUtils._shiftTable[i | 0x100]=13;
			}
		}
		HalfFloatUtils._mantissaTable[0]=0;
		for (i=1;i < 1024;++i){
			var m=i << 13;
			e=0;
			while ((m & 0x00800000)===0){
				e-=0x00800000;
				m <<=1;
			}
			m &=~0x00800000;
			e+=0x38800000;
			HalfFloatUtils._mantissaTable[i]=m | e;
		}
		for (i=1024;i < 2048;++i){
			HalfFloatUtils._mantissaTable[i]=0x38000000+((i-1024)<< 13);
		}
		HalfFloatUtils._exponentTable[0]=0;
		for (i=1;i < 31;++i){
			HalfFloatUtils._exponentTable[i]=i << 23;
		}
		HalfFloatUtils._exponentTable[31]=0x47800000;
		HalfFloatUtils._exponentTable[32]=0x80000000;
		for (i=33;i < 63;++i){
			HalfFloatUtils._exponentTable[i]=0x80000000+((i-32)<< 23);
		}
		HalfFloatUtils._exponentTable[63]=0xc7800000;
		HalfFloatUtils._offsetTable[0]=0;
		for (i=1;i < 64;++i){
			if (i===32){
				HalfFloatUtils._offsetTable[i]=0;
				}else {
				HalfFloatUtils._offsetTable[i]=1024;
			}
		}
	}

	HalfFloatUtils.roundToFloat16Bits=function(num){
		HalfFloatUtils._floatView[0]=num;
		var f=HalfFloatUtils._uint32View[0];
		var e=(f >> 23)& 0x1ff;
		return HalfFloatUtils._baseTable[e]+((f & 0x007fffff)>> HalfFloatUtils._shiftTable[e]);
	}

	HalfFloatUtils.convertToNumber=function(float16bits){
		var m=float16bits >> 10;
		HalfFloatUtils._uint32View[0]=HalfFloatUtils._mantissaTable[HalfFloatUtils._offsetTable[m]+(float16bits & 0x3ff)]+HalfFloatUtils._exponentTable[m];
		return HalfFloatUtils._floatView[0];
	}

	__static(HalfFloatUtils,
	['_buffer',function(){return this._buffer=new ArrayBuffer(4);},'_floatView',function(){return this._floatView=new Float32Array(HalfFloatUtils._buffer);},'_uint32View',function(){return this._uint32View=new Uint32Array(HalfFloatUtils._buffer);},'_baseTable',function(){return this._baseTable=new Uint32Array(512);},'_shiftTable',function(){return this._shiftTable=new Uint32Array(512);},'_mantissaTable',function(){return this._mantissaTable=new Uint32Array(2048);},'_exponentTable',function(){return this._exponentTable=new Uint32Array(64);},'_offsetTable',function(){return this._offsetTable=new Uint32Array(64);}
	]);
	return HalfFloatUtils;
})()


/**
*...
*@author ...
*/
//class laya.d3.physics.Constraint3D
var Constraint3D=(function(){
	function Constraint3D(){
		/**@private */
		this._nativeConstraint=null;
		/**@private */
		this._simulation=null;
		/**获取刚体A。[只读]*/
		this.rigidbodyA=null;
		/**获取刚体A。[只读]*/
		this.rigidbodyB=null;
	}

	__class(Constraint3D,'laya.d3.physics.Constraint3D');
	return Constraint3D;
})()


/**
*@private
*/
//class laya.d3.MouseTouch
var MouseTouch=(function(){
	function MouseTouch(){
		/**@private */
		this._pressedSprite=null;
		/**@private */
		this._pressedLoopCount=-1;
		/**@private */
		this.sprite=null;
		/**@private */
		this.mousePositionX=0;
		/**@private */
		this.mousePositionY=0;
	}

	__class(MouseTouch,'laya.d3.MouseTouch');
	return MouseTouch;
})()


/**

*/
*/
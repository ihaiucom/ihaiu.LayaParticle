/**
*<code>Color</code> 类用于创建颜色实例。
*/
//class laya.d3.math.Color
var Color=(function(){
	function Color(r,g,b,a){
		/**[只读]向量元素集合。*/
		this.elements=null;
		(r===void 0)&& (r=1);
		(g===void 0)&& (g=1);
		(b===void 0)&& (b=1);
		(a===void 0)&& (a=1);
		var v=this.elements=new Float32Array(4);
		v[0]=r;
		v[1]=g;
		v[2]=b;
		v[3]=a;
	}

	__class(Color,'laya.d3.math.Color');
	var __proto=Color.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destColor=destObject;
		var destE=destColor.elements;
		var s=this.elements;
		destE[0]=s[0];
		destE[1]=s[1];
		destE[2]=s[2];
		destE[3]=s[3];
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
	*设置blue分量。
	*@param value blue分量。
	*/
	/**
	*获取blue分量。
	*@return blue分量。
	*/
	__getset(0,__proto,'b',function(){
		return this.elements[2];
		},function(value){
		this.elements[2]=value;
	});

	/**
	*设置red分量。
	*@param value red分量。
	*/
	/**
	*获取red分量。
	*@return red分量。
	*/
	__getset(0,__proto,'r',function(){
		return this.elements[0];
		},function(value){
		this.elements[0]=value;
	});

	/**
	*设置green分量。
	*@param value green分量。
	*/
	/**
	*获取green分量。
	*@return green分量。
	*/
	__getset(0,__proto,'g',function(){
		return this.elements[1];
		},function(value){
		this.elements[1]=value;
	});

	/**
	*设置alpha分量。
	*@param value alpha分量。
	*/
	/**
	*获取alpha分量。
	*@return alpha分量。
	*/
	__getset(0,__proto,'a',function(){
		return this.elements[3];
		},function(value){
		this.elements[3]=value;
	});

	__static(Color,
	['RED',function(){return this.RED=new Color(1,0,0,1);},'GREEN',function(){return this.GREEN=new Color(0,1,0,1);},'BLUE',function(){return this.BLUE=new Color(0,0,1,1);},'CYAN',function(){return this.CYAN=new Color(0,1,1,1);},'YELLOW',function(){return this.YELLOW=new Color(1,0.92,0.016,1);},'MAGENTA',function(){return this.MAGENTA=new Color(1,0,1,1);},'GRAY',function(){return this.GRAY=new Color(0.5,0.5,0.5,1);},'WHITE',function(){return this.WHITE=new Color(1,1,1,1);},'BLACK',function(){return this.BLACK=new Color(0,0,0,1);}
	]);
	return Color;
})()


/**

*/
/**
*<code>GradientDataNumber</code> 类用于创建浮点渐变。
*/
//class laya.d3.core.particleShuriKen.module.GradientDataNumber
var GradientDataNumber=(function(){
	function GradientDataNumber(){
		/**@private */
		this._currentLength=0;
		/**@private 开发者禁止修改。*/
		this._elements=null;
		this._elements=new Float32Array(8);
	}

	__class(GradientDataNumber,'laya.d3.core.particleShuriKen.module.GradientDataNumber');
	var __proto=GradientDataNumber.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*增加浮点渐变。
	*@param key 生命周期，范围为0到1。
	*@param value 浮点值。
	*/
	__proto.add=function(key,value){
		if (this._currentLength < 8){
			if ((this._currentLength===6)&& ((key!==1))){
				key=1;
				console.log("GradientDataNumber warning:the forth key is  be force set to 1.");
			}
			this._elements[this._currentLength++]=key;
			this._elements[this._currentLength++]=value;
			}else {
			console.log("GradientDataNumber warning:data count must lessEqual than 4");
		}
	}

	/**
	*通过索引获取键。
	*@param index 索引。
	*@return value 键。
	*/
	__proto.getKeyByIndex=function(index){
		return this._elements[index *2];
	}

	/**
	*通过索引获取值。
	*@param index 索引。
	*@return value 值。
	*/
	__proto.getValueByIndex=function(index){
		return this._elements[index *2+1];
	}

	/**
	*获取平均值。
	*/
	__proto.getAverageValue=function(){
		var total=0;
		for (var i=0,n=this._currentLength-2;i < n;i+=2){
			var subValue=this._elements[i+1];
			subValue+=this._elements[i+3];
			subValue=subValue *(this._elements[i+2]-this._elements[i]);
		}
		return total / 2;
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destGradientDataNumber=destObject;
		destGradientDataNumber._currentLength=this._currentLength;
		var destElements=destGradientDataNumber._elements;
		destElements.length=this._elements.length;
		for (var i=0,n=this._elements.length;i < n;i++)
		destElements[i]=this._elements[i];
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destGradientDataNumber=/*__JS__ */new this.constructor();
		this.cloneTo(destGradientDataNumber);
		return destGradientDataNumber;
	}

	/**渐变浮点数量。*/
	__getset(0,__proto,'gradientCount',function(){
		return this._currentLength / 2;
	});

	return GradientDataNumber;
})()


/**

*/
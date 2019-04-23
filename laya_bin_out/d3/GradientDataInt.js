/**
*<code>GradientDataInt</code> 类用于创建整形渐变。
*/
//class laya.d3.core.particleShuriKen.module.GradientDataInt
var GradientDataInt=(function(){
	function GradientDataInt(){
		/**@private */
		this._currentLength=0;
		/**@private 开发者禁止修改。*/
		this._elements=null;
		this._elements=new Float32Array(8);
	}

	__class(GradientDataInt,'laya.d3.core.particleShuriKen.module.GradientDataInt');
	var __proto=GradientDataInt.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*增加整形渐变。
	*@param key 生命周期，范围为0到1。
	*@param value 整形值。
	*/
	__proto.add=function(key,value){
		if (this._currentLength < 8){
			if ((this._currentLength===6)&& ((key!==1))){
				key=1;
				console.log("Warning:the forth key is  be force set to 1.");
			}
			this._elements[this._currentLength++]=key;
			this._elements[this._currentLength++]=value;
			}else {
			console.log("Warning:data count must lessEqual than 4");
		}
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destGradientDataInt=destObject;
		destGradientDataInt._currentLength=this._currentLength;
		var destElements=destGradientDataInt._elements;
		destElements.length=this._elements.length;
		for (var i=0,n=this._elements.length;i < n;i++){
			destElements[i]=this._elements[i];
		}
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destGradientDataInt=/*__JS__ */new this.constructor();
		this.cloneTo(destGradientDataInt);
		return destGradientDataInt;
	}

	/**整形渐变数量。*/
	__getset(0,__proto,'gradientCount',function(){
		return this._currentLength / 2;
	});

	return GradientDataInt;
})()


/**

*/
/**
*<code>GradientDataVector2</code> 类用于创建二维向量渐变。
*/
//class laya.d3.core.particleShuriKen.module.GradientDataVector2
var GradientDataVector2=(function(){
	function GradientDataVector2(){
		/**@private */
		this._currentLength=0;
		/**@private 开发者禁止修改。*/
		this._elements=null;
		this._elements=new Float32Array(12);
	}

	__class(GradientDataVector2,'laya.d3.core.particleShuriKen.module.GradientDataVector2');
	var __proto=GradientDataVector2.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*增加二维向量渐变。
	*@param key 生命周期，范围为0到1。
	*@param value 二维向量值。
	*/
	__proto.add=function(key,value){
		if (this._currentLength < 8){
			if ((this._currentLength===6)&& ((key!==1))){
				key=1;
				console.log("GradientDataVector2 warning:the forth key is  be force set to 1.");
			}
			this._elements[this._currentLength++]=key;
			this._elements[this._currentLength++]=value.x;
			this._elements[this._currentLength++]=value.y;
			}else {
			console.log("GradientDataVector2 warning:data count must lessEqual than 4");
		}
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destGradientDataVector2=destObject;
		destGradientDataVector2._currentLength=this._currentLength;
		var destElements=destGradientDataVector2._elements;
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
		var destGradientDataVector2=/*__JS__ */new this.constructor();
		this.cloneTo(destGradientDataVector2);
		return destGradientDataVector2;
	}

	/**二维向量渐变数量。*/
	__getset(0,__proto,'gradientCount',function(){
		return this._currentLength / 3;
	});

	return GradientDataVector2;
})()


/**

*/
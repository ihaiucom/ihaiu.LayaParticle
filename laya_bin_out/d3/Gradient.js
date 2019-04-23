/**
*<code>Gradient</code> 类用于创建颜色渐变。
*/
//class laya.d3.core.Gradient
var Gradient=(function(){
	function Gradient(maxColorRGBKeyCount,maxColorAlphaKeyCount){
		/**@private */
		this._mode=0;
		/**@private */
		this._maxColorRGBKeysCount=0;
		/**@private */
		this._maxColorAlphaKeysCount=0;
		/**@private */
		this._colorRGBKeysCount=0;
		/**@private */
		this._colorAlphaKeysCount=0;
		/**@private */
		this._alphaElements=null;
		/**@private */
		this._rgbElements=null;
		this._maxColorRGBKeysCount=maxColorRGBKeyCount;
		this._maxColorAlphaKeysCount=maxColorAlphaKeyCount;
		this._rgbElements=new Float32Array(maxColorRGBKeyCount *4);
		this._alphaElements=new Float32Array(maxColorAlphaKeyCount *2);
	}

	__class(Gradient,'laya.d3.core.Gradient');
	var __proto=Gradient.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*增加颜色RGB帧。
	*@param key 生命周期，范围为0到1。
	*@param value RGB值。
	*/
	__proto.addColorRGB=function(key,value){
		if (this._colorRGBKeysCount < this._maxColorRGBKeysCount){
			var offset=this._colorRGBKeysCount *4;
			this._rgbElements[offset]=key;
			this._rgbElements[offset+1]=value.r;
			this._rgbElements[offset+2]=value.g;
			this._rgbElements[offset+3]=value.b;
			this._colorRGBKeysCount++;
			}else {
			console.warn("Gradient:warning:data count must lessEqual than "+this._maxColorRGBKeysCount);
		}
	}

	/**
	*增加颜色Alpha帧。
	*@param key 生命周期，范围为0到1。
	*@param value Alpha值。
	*/
	__proto.addColorAlpha=function(key,value){
		if (this._colorAlphaKeysCount < this._maxColorAlphaKeysCount){
			var offset=this._colorAlphaKeysCount *2;
			this._alphaElements[offset]=key;
			this._alphaElements[offset+1]=value;
			this._colorAlphaKeysCount++;
			}else {
			console.warn("Gradient:warning:data count must lessEqual than "+this._maxColorAlphaKeysCount);
		}
	}

	/**
	*更新颜色RGB帧。
	*@param index 索引。
	*@param key 生命周期，范围为0到1。
	*@param value RGB值。
	*/
	__proto.updateColorRGB=function(index,key,value){
		if (index < this._colorRGBKeysCount){
			var offset=index *4;
			this._rgbElements[offset]=key;
			this._rgbElements[offset+1]=value.r;
			this._rgbElements[offset+2]=value.g;
			this._rgbElements[offset+3]=value.b;
			}else {
			console.warn("Gradient:warning:index must lessEqual than colorRGBKeysCount:"+this._colorRGBKeysCount);
		}
	}

	/**
	*更新颜色Alpha帧。
	*@param index 索引。
	*@param key 生命周期，范围为0到1。
	*@param value Alpha值。
	*/
	__proto.updateColorAlpha=function(index,key,value){
		if (index < this._colorAlphaKeysCount){
			var offset=index *2;
			this._alphaElements[offset]=key;
			this._alphaElements[offset+1]=value;
			}else {
			console.warn("Gradient:warning:index must lessEqual than colorAlphaKeysCount:"+this._colorAlphaKeysCount);
		}
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destGradientDataColor=destObject;
		var i=0,n=0;
		destGradientDataColor._colorAlphaKeysCount=this._colorAlphaKeysCount;
		var destAlphaElements=destGradientDataColor._alphaElements;
		destAlphaElements.length=this._alphaElements.length;
		for (i=0,n=this._alphaElements.length;i < n;i++)
		destAlphaElements[i]=this._alphaElements[i];
		destGradientDataColor._colorRGBKeysCount=this._colorRGBKeysCount;
		var destRGBElements=destGradientDataColor._rgbElements;
		destRGBElements.length=this._rgbElements.length;
		for (i=0,n=this._rgbElements.length;i < n;i++)
		destRGBElements[i]=this._rgbElements[i];
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destGradientDataColor=new Gradient(this._maxColorRGBKeysCount,this._maxColorAlphaKeysCount);
		this.cloneTo(destGradientDataColor);
		return destGradientDataColor;
	}

	/**
	*获取颜色RGB数量。
	*@return 颜色RGB数量。
	*/
	__getset(0,__proto,'colorRGBKeysCount',function(){
		return this._colorRGBKeysCount / 4;
	});

	/**
	*设置梯度模式。
	*@param value 梯度模式。
	*/
	/**
	*获取梯度模式。
	*@return 梯度模式。
	*/
	__getset(0,__proto,'mode',function(){
		return this._mode;
		},function(value){
		this._mode=value;
	});

	/**
	*获取颜色Alpha数量。
	*@return 颜色Alpha数量。
	*/
	__getset(0,__proto,'colorAlphaKeysCount',function(){
		return this._colorAlphaKeysCount / 2;
	});

	/**
	*获取最大颜色RGB帧数量。
	*@return 最大RGB帧数量。
	*/
	__getset(0,__proto,'maxColorRGBKeysCount',function(){
		return this._maxColorRGBKeysCount;
	});

	/**
	*获取最大颜色Alpha帧数量。
	*@return 最大Alpha帧数量。
	*/
	__getset(0,__proto,'maxColorAlphaKeysCount',function(){
		return this._maxColorAlphaKeysCount;
	});

	return Gradient;
})()


/**

*/
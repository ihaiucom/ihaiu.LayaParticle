/**
*<code>PixelLineSprite3D</code> 类用于像素线渲染精灵。
*/
//class laya.d3.core.pixelLine.PixelLineSprite3D extends laya.d3.core.RenderableSprite3D
var PixelLineSprite3D=(function(_super){
	function PixelLineSprite3D(maxCount,name){
		/**@private */
		this._geometryFilter=null;
		(maxCount===void 0)&& (maxCount=2);
		PixelLineSprite3D.__super.call(this,name);
		this._geometryFilter=new PixelLineFilter(this,maxCount);
		this._render=new PixelLineRenderer(this);
		this._changeRenderObjects(this._render,0,PixelLineMaterial.defaultMaterial);
	}

	__class(PixelLineSprite3D,'laya.d3.core.pixelLine.PixelLineSprite3D',_super);
	var __proto=PixelLineSprite3D.prototype;
	/**
	*@inheritDoc
	*/
	__proto._changeRenderObjects=function(sender,index,material){
		var renderObjects=this._render._renderElements;
		(material)|| (material=PixelLineMaterial.defaultMaterial);
		var renderElement=renderObjects[index];
		(renderElement)|| (renderElement=renderObjects[index]=new RenderElement());
		renderElement.setTransform(this._transform);
		renderElement.setGeometry(this._geometryFilter);
		renderElement.render=this._render;
		renderElement.material=material;
	}

	/**
	*增加一条线。
	*@param startPosition 初始点位置
	*@param endPosition 结束点位置
	*@param startColor 初始点颜色
	*@param endColor 结束点颜色
	*/
	__proto.addLine=function(startPosition,endPosition,startColor,endColor){
		if (this._geometryFilter._lineCount!==this._geometryFilter._maxLineCount)
			this._geometryFilter._updateLineData(this._geometryFilter._lineCount++,startPosition,endPosition,startColor,endColor);
		else
		throw "PixelLineSprite3D: lineCount has equal with maxLineCount.";
	}

	/**
	*添加多条线段。
	*@param lines 线段数据
	*/
	__proto.addLines=function(lines){
		var lineCount=this._geometryFilter._lineCount;
		var addCount=lines.length;
		if (lineCount+addCount > this._geometryFilter._maxLineCount){
			throw "PixelLineSprite3D: lineCount plus lines count must less than maxLineCount.";
			}else {
			this._geometryFilter._updateLineDatas(lineCount,lines);
			this._geometryFilter._lineCount+=addCount;
		}
	}

	/**
	*移除一条线段。
	*@param index 索引。
	*/
	__proto.removeLine=function(index){
		if (index < this._geometryFilter._lineCount)
			this._geometryFilter._removeLineData(index);
		else
		throw "PixelLineSprite3D: index must less than lineCount.";
	}

	/**
	*更新线
	*@param index 索引
	*@param startPosition 初始点位置
	*@param endPosition 结束点位置
	*@param startColor 初始点颜色
	*@param endColor 结束点颜色
	*/
	__proto.setLine=function(index,startPosition,endPosition,startColor,endColor){
		if (index < this._geometryFilter._lineCount)
			this._geometryFilter._updateLineData(index,startPosition,endPosition,startColor,endColor);
		else
		throw "PixelLineSprite3D: index must less than lineCount.";
	}

	/**
	*获取线段数据
	*@param out 线段数据。
	*/
	__proto.getLine=function(index,out){
		if (index < this.lineCount)
			this._geometryFilter._getLineData(index,out);
		else
		throw "PixelLineSprite3D: index must less than lineCount.";
	}

	/**
	*清除所有线段。
	*/
	__proto.clear=function(){
		this._geometryFilter._lineCount=0;
	}

	/**
	*设置最大线数量
	*@param value 最大线数量。
	*/
	/**
	*获取最大线数量
	*@return 最大线数量。
	*/
	__getset(0,__proto,'maxLineCount',function(){
		return this._geometryFilter._maxLineCount;
		},function(value){
		this._geometryFilter._resizeLineData(value);
		this._geometryFilter._lineCount=Math.min(this._geometryFilter._lineCount,value);
	});

	/**
	*获取line渲染器。
	*@return line渲染器。
	*/
	__getset(0,__proto,'pixelLineRenderer',function(){
		return this._render;
	});

	/**
	*设置获取线数量。
	*@param value 线段数量。
	*/
	/**
	*获取线数量。
	*@return 线段数量。
	*/
	__getset(0,__proto,'lineCount',function(){
		return this._geometryFilter._lineCount;
		},function(value){
		if (value > this.maxLineCount)
			throw "PixelLineSprite3D: lineCount can't large than maxLineCount";
		else
		this._geometryFilter._lineCount=value;
	});

	return PixelLineSprite3D;
})(RenderableSprite3D)


/**

*/
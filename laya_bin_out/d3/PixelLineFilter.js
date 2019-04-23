/**
*<code>PixelLineFilter</code> 类用于线过滤器。
*/
//class laya.d3.core.pixelLine.PixelLineFilter extends laya.d3.core.GeometryElement
var PixelLineFilter=(function(_super){
	function PixelLineFilter(owner,maxLineCount){
		/**@private */
		this._floatCountPerVertices=7;
		/**@private */
		this._owner=null;
		/**@private */
		this._vertexBuffer=null;
		/**@private */
		this._vertices=null;
		/**@private */
		this._maxLineCount=0;
		/**@private */
		this._lineCount=0;
		PixelLineFilter.__super.call(this);
		this._bufferState=new BufferState();
		var pointCount=maxLineCount *2;
		this._owner=owner;
		this._maxLineCount=maxLineCount;
		this._vertices=new Float32Array(pointCount *this._floatCountPerVertices);
		this._vertexBuffer=new VertexBuffer3D(PixelLineVertex.vertexDeclaration.vertexStride *pointCount,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4,false);
		this._vertexBuffer.vertexDeclaration=PixelLineVertex.vertexDeclaration;
		this._bufferState.bind();
		this._bufferState.applyVertexBuffer(this._vertexBuffer);
		this._bufferState.unBind();
	}

	__class(PixelLineFilter,'laya.d3.core.pixelLine.PixelLineFilter',_super);
	var __proto=PixelLineFilter.prototype;
	/**
	*@private
	*/
	__proto._resizeLineData=function(maxCount){
		var pointCount=maxCount *2;
		var lastVertices=this._vertices;
		this._vertexBuffer.destroy();
		this._maxLineCount=maxCount;
		var vertexCount=pointCount *this._floatCountPerVertices;
		this._vertices=new Float32Array(vertexCount);
		this._vertexBuffer=new VertexBuffer3D(PixelLineVertex.vertexDeclaration.vertexStride *pointCount,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4,false);
		this._vertexBuffer.vertexDeclaration=PixelLineVertex.vertexDeclaration;
		if (vertexCount < lastVertices.length){
			this._vertices.set(new Float32Array(lastVertices.buffer,0,vertexCount));
			this._vertexBuffer.setData(this._vertices,0,0,vertexCount);
			}else {
			this._vertices.set(lastVertices);
			this._vertexBuffer.setData(this._vertices,0,0,lastVertices.length);
		}
		this._bufferState.bind();
		this._bufferState.applyVertexBuffer(this._vertexBuffer);
		this._bufferState.unBind();
	}

	/**
	*@private
	*/
	__proto._updateLineVertices=function(offset,startPosition,endPosition,startColor,endColor){
		var startPositione=startPosition.elements;
		var endPositione=endPosition.elements;
		var startColore=startColor.elements;
		var endColore=endColor.elements;
		this._vertices[offset+0]=startPositione[0];
		this._vertices[offset+1]=startPositione[1];
		this._vertices[offset+2]=startPositione[2];
		this._vertices[offset+3]=startColore[0];
		this._vertices[offset+4]=startColore[1];
		this._vertices[offset+5]=startColore[2];
		this._vertices[offset+6]=startColore[3];
		this._vertices[offset+7]=endPositione[0];
		this._vertices[offset+8]=endPositione[1];
		this._vertices[offset+9]=endPositione[2];
		this._vertices[offset+10]=endColore[0];
		this._vertices[offset+11]=endColore[1];
		this._vertices[offset+12]=endColore[2];
		this._vertices[offset+13]=endColore[3];
	}

	/**
	*@private
	*/
	__proto._removeLineData=function(index){
		var floatCount=this._floatCountPerVertices *2;
		var nextIndex=index+1;
		var offset=index *floatCount;
		var nextOffset=nextIndex *floatCount;
		var rightPartVertices=new Float32Array(this._vertices.buffer,nextIndex *floatCount *4,(this._lineCount-nextIndex)*floatCount);
		this._vertexBuffer.setData(rightPartVertices,offset);
		this._vertices.set(rightPartVertices,offset);
		this._lineCount--;
	}

	/**
	*@private
	*/
	__proto._updateLineData=function(index,startPosition,endPosition,startColor,endColor){
		var floatCount=this._floatCountPerVertices *2;
		var offset=index *floatCount;
		this._updateLineVertices(offset,startPosition,endPosition,startColor,endColor);
		this._vertexBuffer.setData(this._vertices,offset,offset,floatCount);
	}

	/**
	*@private
	*/
	__proto._updateLineDatas=function(index,data){
		var floatCount=this._floatCountPerVertices *2;
		var offset=index *floatCount;
		var count=data.length;
		for (var i=0;i < count;i++){
			var line=data[i];
			this._updateLineVertices((index+i)*floatCount,line.startPosition,line.endPosition,line.startColor,line.endColor);
		}
		this._vertexBuffer.setData(this._vertices,offset,offset,floatCount *count);
	}

	/**
	*获取线段数据
	*@return 线段数据。
	*/
	__proto._getLineData=function(index,out){
		var startPosition=out.startPosition.elements;
		var startColor=out.startColor.elements;
		var endPosition=out.endPosition.elements;
		var endColor=out.endColor.elements;
		var vertices=this._vertices;
		var offset=index *this._floatCountPerVertices *2;
		startPosition[0]=vertices[offset+0];
		startPosition[1]=vertices[offset+1];
		startPosition[2]=vertices[offset+2];
		startColor[0]=vertices[offset+0];
		startColor[1]=vertices[offset+1];
		startColor[2]=vertices[offset+2];
		startColor[3]=vertices[offset+3];
		endPosition[0]=vertices[offset+0];
		endPosition[1]=vertices[offset+1];
		endPosition[2]=vertices[offset+2];
		endColor[0]=vertices[offset+0];
		endColor[1]=vertices[offset+1];
		endColor[2]=vertices[offset+2];
		endColor[3]=vertices[offset+3];
	}

	/**
	*@inheritDoc
	*/
	__proto._prepareRender=function(state){
		return true;
	}

	/**
	*@inheritDoc
	*/
	__proto._render=function(state){
		if (this._lineCount > 0){
			this._bufferState.bind();
			LayaGL.instance.drawArrays(/*laya.webgl.WebGLContext.LINES*/0x0001,0,this._lineCount *2);
			Stat.renderBatch++;
		}
	}

	/**
	*@inheritDoc
	*/
	__proto.destroy=function(){
		if (this._destroyed)
			return;
		_super.prototype.destroy.call(this);
		this._bufferState.destroy();
		this._vertexBuffer.destroy();
		this._bufferState=null;
		this._vertexBuffer=null;
		this._vertices=null;
	}

	return PixelLineFilter;
})(GeometryElement)


/**

*/
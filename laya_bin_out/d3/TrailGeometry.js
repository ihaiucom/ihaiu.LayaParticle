/**
*<code>TrailGeometry</code> 类用于创建拖尾渲染单元。
*/
//class laya.d3.core.trail.TrailGeometry extends laya.d3.core.GeometryElement
var TrailGeometry=(function(_super){
	function TrailGeometry(owner){
		/**@private */
		this._floatCountPerVertices1=8;
		/**@private */
		this._floatCountPerVertices2=1;
		/**@private */
		this._increaseSegementCount=128;
		/**@private */
		this._activeIndex=0;
		/**@private */
		this._endIndex=0;
		/**@private */
		this._needAddFirstVertex=false;
		/**@private */
		this._isTempEndVertex=false;
		/**@private */
		this._subBirthTime=null;
		/**@private */
		this._subDistance=null;
		/**@private */
		this._segementCount=0;
		/**@private */
		this._vertices1=null;
		/**@private */
		this._vertices2=null;
		/**@private */
		this._vertexBuffer1=null;
		/**@private */
		this._vertexBuffer2=null;
		/**@private */
		this._owner=null;
		TrailGeometry.__super.call(this);
		this._lastFixedVertexPosition=new Vector3();
		this._bufferState=new BufferState();
		this._owner=owner;;
		this._resizeData(this._increaseSegementCount,this._bufferState);
	}

	__class(TrailGeometry,'laya.d3.core.trail.TrailGeometry',_super);
	var __proto=TrailGeometry.prototype;
	/**
	*@private
	*/
	__proto._resizeData=function(segementCount,bufferState){
		this._segementCount=this._increaseSegementCount;
		this._subBirthTime=new Float32Array(segementCount);
		this._subDistance=new Float32Array(segementCount);
		var vertexCount=segementCount *2;
		var vertexDeclaration1=VertexTrail.vertexDeclaration1;
		var vertexDeclaration2=VertexTrail.vertexDeclaration2;
		var vertexBuffers=[];
		var vertexbuffer1Size=vertexCount *vertexDeclaration1.vertexStride;
		var vertexbuffer2Size=vertexCount *vertexDeclaration2.vertexStride;
		var memorySize=vertexbuffer1Size+vertexbuffer2Size;
		this._vertices1=new Float32Array(vertexCount *this._floatCountPerVertices1);
		this._vertexBuffer1=new VertexBuffer3D(vertexbuffer1Size,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4,false);
		this._vertexBuffer1.vertexDeclaration=vertexDeclaration1;
		this._vertices2=new Float32Array(vertexCount *this._floatCountPerVertices2);
		this._vertexBuffer2=new VertexBuffer3D(vertexbuffer2Size,/*laya.webgl.WebGLContext.DYNAMIC_DRAW*/0x88E8,false);
		this._vertexBuffer2.vertexDeclaration=vertexDeclaration2;
		vertexBuffers.push(this._vertexBuffer1);
		vertexBuffers.push(this._vertexBuffer2);
		bufferState.bind();
		bufferState.applyVertexBuffers(vertexBuffers);
		bufferState.unBind();
		Resource._addMemory(memorySize,memorySize);
	}

	/**
	*@private
	*/
	__proto._resetData=function(){
		var count=this._endIndex-this._activeIndex;
		if (count==this._segementCount){
			this._vertexBuffer1.destroy();
			this._vertexBuffer2.destroy();
			this._segementCount+=this._increaseSegementCount;
			this._resizeData(this._segementCount,this._bufferState);
		}
		this._vertexBuffer1.setData(this._vertices1,0,this._floatCountPerVertices1 *2 *this._activeIndex,this._floatCountPerVertices1 *2 *count);
		this._vertexBuffer2.setData(this._vertices2,0,this._floatCountPerVertices2 *2 *this._activeIndex,this._floatCountPerVertices2 *2 *count);
		var offset=this._activeIndex *4;
		var rightSubDistance=new Float32Array(this._subDistance.buffer,offset,count);
		var rightSubBirthTime=new Float32Array(this._subBirthTime.buffer,offset,count);
		this._subDistance.set(rightSubDistance,0);
		this._subBirthTime.set(rightSubBirthTime,0);
		this._endIndex=count;
		this._activeIndex=0;
	}

	/**
	*@private
	*更新Trail数据
	*/
	__proto._updateTrail=function(camera,lastPosition,position){
		if (!Vector3.equals(lastPosition,position)){
			if ((this._endIndex-this._activeIndex)===0)
				this._addTrailByFirstPosition(camera,position);
			else
			this._addTrailByNextPosition(camera,position);
		}
	}

	/**
	*@private
	*通过起始位置添加TrailRenderElement起始数据
	*/
	__proto._addTrailByFirstPosition=function(camera,position){
		(this._endIndex===this._segementCount)&& (this._resetData());
		this._subDistance[this._endIndex]=0;
		this._subBirthTime[this._endIndex]=this._owner._curtime;
		this._endIndex++;
		position.cloneTo(this._lastFixedVertexPosition);
		this._needAddFirstVertex=true;
	}

	/**
	*@private
	*通过位置更新TrailRenderElement数据
	*/
	__proto._addTrailByNextPosition=function(camera,position){
		var delVector3=TrailGeometry._tempVector30;
		var pointAtoBVector3=TrailGeometry._tempVector31;
		Vector3.subtract(position,this._lastFixedVertexPosition,delVector3);
		switch (this._owner.alignment){
			case /*laya.d3.core.trail.TrailFilter.ALIGNMENT_VIEW*/0:
				Vector3.cross(delVector3,camera.transform.forward,pointAtoBVector3);
				break ;
			case /*laya.d3.core.trail.TrailFilter.ALIGNMENT_TRANSFORM_Z*/1:
				Vector3.cross(delVector3,this._owner._owner.transform.forward,pointAtoBVector3);
				break ;
			}
		Vector3.normalize(pointAtoBVector3,pointAtoBVector3);
		Vector3.scale(pointAtoBVector3,this._owner.widthMultiplier / 2,pointAtoBVector3);
		var delLength=Vector3.scalarLength(delVector3);
		var tempEndIndex=0;
		var offset=NaN;
		if (this._needAddFirstVertex){
			this._updateVerticesByPositionData(position,pointAtoBVector3,this._endIndex-1);
			this._needAddFirstVertex=false;
		}
		if (delLength-this._owner.minVertexDistance >=MathUtils3D.zeroTolerance){
			if (this._isTempEndVertex){
				tempEndIndex=this._endIndex-1;
				offset=delLength-this._subDistance[tempEndIndex];
				this._updateVerticesByPosition(position,pointAtoBVector3,delLength,tempEndIndex);
				this._owner._totalLength+=offset;
				}else {
				(this._endIndex===this._segementCount)&& (this._resetData());
				this._updateVerticesByPosition(position,pointAtoBVector3,delLength,this._endIndex);
				this._owner._totalLength+=delLength;
				this._endIndex++;
			}
			position.cloneTo(this._lastFixedVertexPosition);
			this._isTempEndVertex=false;
			}else {
			if (this._isTempEndVertex){
				tempEndIndex=this._endIndex-1;
				offset=delLength-this._subDistance[tempEndIndex];
				this._updateVerticesByPosition(position,pointAtoBVector3,delLength,tempEndIndex);
				this._owner._totalLength+=offset;
				}else {
				(this._endIndex===this._segementCount)&& (this._resetData());
				this._updateVerticesByPosition(position,pointAtoBVector3,delLength,this._endIndex);
				this._owner._totalLength+=delLength;
				this._endIndex++;
			}
			this._isTempEndVertex=true;
		}
	}

	/**
	*@private
	*通过位置更新顶点数据
	*/
	__proto._updateVerticesByPositionData=function(position,pointAtoBVector3,index){
		var vertexOffset=this._floatCountPerVertices1 *2 *index;
		var pointE=position.elements;
		var pointAtoBVector3E=pointAtoBVector3.elements;
		var curtime=this._owner._curtime;
		this._vertices1[vertexOffset]=pointE[0];
		this._vertices1[vertexOffset+1]=pointE[1];
		this._vertices1[vertexOffset+2]=pointE[2];
		this._vertices1[vertexOffset+3]=-pointAtoBVector3E[0];
		this._vertices1[vertexOffset+4]=-pointAtoBVector3E[1];
		this._vertices1[vertexOffset+5]=-pointAtoBVector3E[2];
		this._vertices1[vertexOffset+6]=curtime;
		this._vertices1[vertexOffset+7]=1.0;
		this._vertices1[vertexOffset+8]=pointE[0];
		this._vertices1[vertexOffset+9]=pointE[1];
		this._vertices1[vertexOffset+10]=pointE[2];
		this._vertices1[vertexOffset+11]=pointAtoBVector3E[0];
		this._vertices1[vertexOffset+12]=pointAtoBVector3E[1];
		this._vertices1[vertexOffset+13]=pointAtoBVector3E[2];
		this._vertices1[vertexOffset+14]=curtime;
		this._vertices1[vertexOffset+15]=0.0;
		var floatCount=this._floatCountPerVertices1 *2;
		this._vertexBuffer1.setData(this._vertices1,vertexOffset,vertexOffset,floatCount);
	}

	/**
	*@private
	*通过位置更新顶点数据、距离、出生时间
	*/
	__proto._updateVerticesByPosition=function(position,pointAtoBVector3,delDistance,index){
		this._updateVerticesByPositionData(position,pointAtoBVector3,index);
		this._subDistance[index]=delDistance;
		this._subBirthTime[index]=this._owner._curtime;
	}

	/**
	*@private
	*更新VertexBuffer2数据
	*/
	__proto._updateVertexBufferUV=function(){
		var vertexCount=this._endIndex;
		var curLength=0;
		for (var i=this._activeIndex,j=vertexCount;i < j;i++){
			(i!==this._activeIndex)&& (curLength+=this._subDistance[i]);
			var uvX=NaN;
			if (this._owner.textureMode==/*laya.d3.core.TextureMode.Stretch*/0)
				uvX=1.0-curLength / this._owner._totalLength;
			else
			uvX=1.0-(this._owner._totalLength-curLength);
			this._vertices2[i *2]=uvX;
			this._vertices2[i *2+1]=uvX;
		};
		var offset=this._activeIndex *2;
		this._vertexBuffer2.setData(this._vertices2,offset,offset,vertexCount *2-offset);
	}

	/**
	*@private
	*/
	__proto._updateDisappear=function(){
		var count=this._endIndex;
		for (var i=this._activeIndex;i < count;i++){
			if (this._owner._curtime-this._subBirthTime[i] >=this._owner.time+MathUtils3D.zeroTolerance){
				var nextIndex=i+1;
				if (nextIndex!==count)
					this._owner._totalLength-=this._subDistance[nextIndex];
				if (this._isTempEndVertex && (nextIndex===count-1)){
					var offset=this._floatCountPerVertices1 *i *2;
					var fixedPosE=this._lastFixedVertexPosition.elements;
					fixedPosE[0]=this._vertices1[0];
					fixedPosE[1]=this._vertices1[1];
					fixedPosE[2]=this._vertices1[2];
					this._isTempEndVertex=false;
				}
				this._activeIndex++;
				}else {
				break ;
			}
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._getType=function(){
		return TrailGeometry._type;
	}

	/**
	*@inheritDoc
	*/
	__proto._prepareRender=function(state){
		return this._endIndex-this._activeIndex > 1;
	}

	/**
	*@inheritDoc
	*/
	__proto._render=function(state){
		this._bufferState.bind();
		var start=this._activeIndex *2;
		var count=this._endIndex *2-start;
		LayaGL.instance.drawArrays(/*laya.webgl.WebGLContext.TRIANGLE_STRIP*/0x0005,start,count);
		Stat.renderBatch++;
		Stat.trianglesFaces+=count-2;
	}

	/**
	*@private
	*/
	__proto._destroy=function(){
		var memorySize=this._vertexBuffer1._byteLength+this._vertexBuffer2._byteLength;
		Resource._addMemory(-memorySize,-memorySize);
		this._bufferState.destroy();
		this._vertexBuffer1.destroy();
		this._vertexBuffer2.destroy();
		this._bufferState=null;
		this._vertices1=null;
		this._vertexBuffer1=null;
		this._vertices2=null;
		this._vertexBuffer2=null;
		this._subBirthTime=null;
		this._subDistance=null;
		this._lastFixedVertexPosition=null;
	}

	__static(TrailGeometry,
	['_tempVector30',function(){return this._tempVector30=new Vector3();},'_tempVector31',function(){return this._tempVector31=new Vector3();},'_type',function(){return this._type=GeometryElement._typeCounter++;}
	]);
	return TrailGeometry;
})(GeometryElement)


/**

*/
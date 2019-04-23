/**
*<code>SubMeshDynamicBatch</code> 类用于网格动态合并。
*/
//class laya.d3.graphics.SubMeshDynamicBatch extends laya.d3.core.GeometryElement
var SubMeshDynamicBatch=(function(_super){
	function SubMeshDynamicBatch(){
		/**@private */
		this._vertices=null;
		/**@private */
		this._indices=null;
		/**@private */
		this._positionOffset=0;
		/**@private */
		this._normalOffset=0;
		/**@private */
		this._colorOffset=0;
		/**@private */
		this._uv0Offset=0;
		/**@private */
		this._uv1Offset=0;
		/**@private */
		this._sTangentOffset=0;
		/**@private */
		this._vertexBuffer=null;
		/**@private */
		this._indexBuffer=null;
		SubMeshDynamicBatch.__super.call(this);
		this._bufferState=new BufferState();
		var maxVerDec=VertexMesh.getVertexDeclaration("POSITION,NORMAL,COLOR,UV,UV1,TANGENT");
		var maxByteCount=maxVerDec.vertexStride *32000;
		this._vertices=new Float32Array(maxByteCount / 4);
		this._vertexBuffer=new VertexBuffer3D(maxByteCount,/*laya.webgl.WebGLContext.DYNAMIC_DRAW*/0x88E8);
		this._indices=new Int16Array(/*CLASS CONST:laya.d3.graphics.SubMeshDynamicBatch.maxIndicesCount*/32000);
		this._indexBuffer=new IndexBuffer3D(/*laya.d3.graphics.IndexBuffer3D.INDEXTYPE_USHORT*/"ushort",this._indices.length,/*laya.webgl.WebGLContext.DYNAMIC_DRAW*/0x88E8);
		var memorySize=this._vertexBuffer._byteLength+this._indexBuffer._byteLength;
		Resource._addMemory(memorySize,memorySize);
	}

	__class(SubMeshDynamicBatch,'laya.d3.graphics.SubMeshDynamicBatch',_super);
	var __proto=SubMeshDynamicBatch.prototype;
	/**
	*@private
	*/
	__proto._getBatchVertices=function(vertexDeclaration,batchVertices,batchOffset,transform,element,subMesh){
		var vertexFloatCount=vertexDeclaration.vertexStride / 4;
		var oriVertexes=subMesh._vertexBuffer.getData();
		var lightmapScaleOffset=element.render.lightmapScaleOffset;
		var multiSubMesh=element._dynamicMultiSubMesh;
		var vertexCount=element._dynamicVertexCount;
		element._computeWorldPositionsAndNormals(this._positionOffset,this._normalOffset,multiSubMesh,vertexCount);
		var worldPositions=element._dynamicWorldPositions;
		var worldNormals=element._dynamicWorldNormals;
		var indices=subMesh._indices;
		for (var i=0;i < vertexCount;i++){
			var index=multiSubMesh ? indices[i] :i;
			var oriOffset=index *vertexFloatCount;
			var bakeOffset=(i+batchOffset)*vertexFloatCount;
			var oriOff=i *3;
			var bakOff=bakeOffset+this._positionOffset;
			batchVertices[bakOff]=worldPositions[oriOff];
			batchVertices[bakOff+1]=worldPositions[oriOff+1];
			batchVertices[bakOff+2]=worldPositions[oriOff+2];
			if (this._normalOffset!==-1){
				bakOff=bakeOffset+this._normalOffset;
				batchVertices[bakOff]=worldNormals[oriOff];
				batchVertices[bakOff+1]=worldNormals[oriOff+1];
				batchVertices[bakOff+2]=worldNormals[oriOff+2];
			}
			if (this._colorOffset!==-1){
				bakOff=bakeOffset+this._colorOffset;
				oriOff=oriOffset+this._colorOffset;
				batchVertices[bakOff]=oriVertexes[oriOff];
				batchVertices[bakOff+1]=oriVertexes[oriOff+1];
				batchVertices[bakOff+2]=oriVertexes[oriOff+2];
				batchVertices[bakOff+3]=oriVertexes[oriOff+3];
			}
			if (this._uv0Offset!==-1){
				bakOff=bakeOffset+this._uv0Offset;
				oriOff=oriOffset+this._uv0Offset;
				batchVertices[bakOff]=oriVertexes[oriOff];
				batchVertices[bakOff+1]=oriVertexes[oriOff+1];
			}
			if (this._sTangentOffset!==-1){
				bakOff=bakeOffset+this._sTangentOffset;
				oriOff=oriOffset+this._sTangentOffset;
				batchVertices[bakOff]=oriVertexes[oriOff];
				batchVertices[bakOff+1]=oriVertexes[oriOff+1];
				batchVertices[bakOff+2]=oriVertexes[oriOff+2];
				batchVertices[bakOff+3]=oriVertexes[oriOff+3];
				bakOff=bakeOffset+this._sTangentOffset;
				oriOff=oriOffset+this._sTangentOffset;
				batchVertices[bakOff]=oriVertexes[oriOff];
				batchVertices[bakOff+1]=oriVertexes[oriOff+1];
				batchVertices[bakOff+2]=oriVertexes[oriOff+2];
				batchVertices[bakOff+3]=oriVertexes[oriOff+3];
			}
		}
	}

	/**
	*@private
	*/
	__proto._getBatchIndices=function(batchIndices,batchIndexCount,batchVertexCount,transform,subMesh,multiSubMesh){
		var subIndices=subMesh._indices;
		var k=0,m=0,batchOffset=0;
		var isInvert=transform._isFrontFaceInvert;
		if (multiSubMesh){
			if (isInvert){
				for (k=0,m=subIndices.length;k < m;k+=3){
					batchOffset=batchIndexCount+k;
					var index=batchVertexCount+k;
					batchIndices[batchOffset]=index;
					batchIndices[batchOffset+1]=index+2;
					batchIndices[batchOffset+2]=index+1;
				}
				}else {
				for (k=m,m=subIndices.length;k < m;k+=3){
					batchOffset=batchIndexCount+k;
					index=batchVertexCount+k;
					batchIndices[batchOffset]=index;
					batchIndices[batchOffset+1]=index+1;
					batchIndices[batchOffset+2]=index+2;
				}
			}
			}else {
			if (isInvert){
				for (k=0,m=subIndices.length;k < m;k+=3){
					batchOffset=batchIndexCount+k;
					batchIndices[batchOffset]=batchVertexCount+subIndices[k];
					batchIndices[batchOffset+1]=batchVertexCount+subIndices[k+2];
					batchIndices[batchOffset+2]=batchVertexCount+subIndices[k+1];
				}
				}else {
				for (k=m,m=subIndices.length;k < m;k+=3){
					batchOffset=batchIndexCount+k;
					batchIndices[batchOffset]=batchVertexCount+subIndices[k];
					batchIndices[batchOffset+1]=batchVertexCount+subIndices[k+1];
					batchIndices[batchOffset+2]=batchVertexCount+subIndices[k+2];
				}
			}
		}
	}

	/**
	*@private
	*/
	__proto._flush=function(vertexCount,indexCount){
		this._vertexBuffer.setData(this._vertices,0,0,vertexCount *(this._vertexBuffer.vertexDeclaration.vertexStride / 4));
		this._indexBuffer.setData(this._indices,0,0,indexCount);
		LayaGL.instance.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,indexCount,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,0);
		Stat.renderBatch++;
		Stat.trianglesFaces+=indexCount / 3;
	}

	/**
	*@inheritDoc
	*/
	__proto._prepareRender=function(state){
		var element=state.renderElement;
		var vertexDeclaration=element.dynamicVertexDeclaration;
		this._bufferState=MeshRenderDynamicBatchManager.instance._getBufferState(vertexDeclaration);
		this._positionOffset=vertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.Vertex.VertexMesh.MESH_POSITION0*/0).offset / 4;
		var normalElement=vertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.Vertex.VertexMesh.MESH_NORMAL0*/3);
		this._normalOffset=normalElement ? normalElement.offset / 4 :-1;
		var colorElement=vertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.Vertex.VertexMesh.MESH_COLOR0*/1);
		this._colorOffset=colorElement ? colorElement.offset / 4 :-1;
		var uv0Element=vertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.Vertex.VertexMesh.MESH_TEXTURECOORDINATE0*/2);
		this._uv0Offset=uv0Element ? uv0Element.offset / 4 :-1;
		var uv1Element=vertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.Vertex.VertexMesh.MESH_TEXTURECOORDINATE1*/8);
		this._uv1Offset=uv1Element ? uv1Element.offset / 4 :-1;
		var tangentElement=vertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.Vertex.VertexMesh.MESH_TANGENT0*/5);
		this._sTangentOffset=tangentElement ? tangentElement.offset / 4 :-1;
		return true;
	}

	/**
	*@inheritDoc
	*/
	__proto._render=function(context){
		this._bufferState.bind();
		var element=context.renderElement;
		var vertexDeclaration=element.dynamicVertexDeclaration;
		var batchElements=element.dynamicBatchElementList;
		var batchVertexCount=0;
		var batchIndexCount=0;
		var floatStride=vertexDeclaration.vertexStride / 4;
		for (var i=0,n=batchElements.length;i < n;i++){
			var subElement=batchElements [i];
			var subMesh=subElement._geometry;
			var indexCount=subMesh._indexCount;
			if (batchIndexCount+indexCount > /*CLASS CONST:laya.d3.graphics.SubMeshDynamicBatch.maxIndicesCount*/32000){
				this._flush(batchVertexCount,batchIndexCount);
				batchVertexCount=batchIndexCount=0;
			};
			var transform=subElement._transform;
			this._getBatchVertices(vertexDeclaration,this._vertices,batchVertexCount,transform,subElement,subMesh);
			this._getBatchIndices(this._indices,batchIndexCount,batchVertexCount,transform,subMesh,subElement._dynamicMultiSubMesh);
			batchVertexCount+=subElement._dynamicVertexCount;
			batchIndexCount+=indexCount;
		}
		this._flush(batchVertexCount,batchIndexCount);
	}

	SubMeshDynamicBatch.maxAllowVertexCount=10;
	SubMeshDynamicBatch.maxAllowAttribueCount=900;
	SubMeshDynamicBatch.maxIndicesCount=32000;
	SubMeshDynamicBatch.instance=null;
	return SubMeshDynamicBatch;
})(GeometryElement)


/**

*/
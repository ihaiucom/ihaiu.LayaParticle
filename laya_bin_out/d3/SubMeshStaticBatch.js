/**
*<code>SubMeshStaticBatch</code> 类用于网格静态合并。
*/
//class laya.d3.graphics.SubMeshStaticBatch extends laya.d3.core.GeometryElement
var SubMeshStaticBatch=(function(_super){
	function SubMeshStaticBatch(batchOwner,number,vertexDeclaration){
		/**@private */
		//this._currentBatchVertexCount=0;
		/**@private */
		//this._currentBatchIndexCount=0;
		/**@private */
		//this._vertexDeclaration=null;
		/**@private */
		//this._vertexBuffer=null;
		/**@private */
		//this._indexBuffer=null;
		/**@private */
		//this._batchElements=null;
		/**@private */
		//this._batchID=0;
		/**@private [只读]*/
		//this.batchOwner=null;
		/**@private [只读]*/
		//this.number=0;
		SubMeshStaticBatch.__super.call(this);
		this._bufferState=new BufferState();
		this._batchID=SubMeshStaticBatch._batchIDCounter++;
		this._batchElements=[];
		this._currentBatchVertexCount=0;
		this._currentBatchIndexCount=0;
		this._vertexDeclaration=vertexDeclaration;
		this.batchOwner=batchOwner;
		this.number=number;
	}

	__class(SubMeshStaticBatch,'laya.d3.graphics.SubMeshStaticBatch',_super);
	var __proto=SubMeshStaticBatch.prototype;
	Laya.imps(__proto,{"laya.resource.IDispose":true})
	/**
	*@private
	*/
	__proto._getStaticBatchBakedVertexs=function(batchVertices,batchOffset,batchOwnerTransform,transform,render,mesh){
		var vertexBuffer=mesh._vertexBuffers[0];
		var vertexDeclaration=vertexBuffer.vertexDeclaration;
		var positionOffset=vertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.Vertex.VertexMesh.MESH_POSITION0*/0).offset / 4;
		var normalElement=vertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.Vertex.VertexMesh.MESH_NORMAL0*/3);
		var normalOffset=normalElement ? normalElement.offset / 4 :-1;
		var colorElement=vertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.Vertex.VertexMesh.MESH_COLOR0*/1);
		var colorOffset=colorElement ? colorElement.offset / 4 :-1;
		var uv0Element=vertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.Vertex.VertexMesh.MESH_TEXTURECOORDINATE0*/2);
		var uv0Offset=uv0Element ? uv0Element.offset / 4 :-1;
		var uv1Element=vertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.Vertex.VertexMesh.MESH_TEXTURECOORDINATE1*/8);
		var uv1Offset=uv1Element ? uv1Element.offset / 4 :-1;
		var tangentElement=vertexDeclaration.getVertexElementByUsage(/*laya.d3.graphics.Vertex.VertexMesh.MESH_TANGENT0*/5);
		var sTangentOffset=tangentElement ? tangentElement.offset / 4 :-1;
		var bakeVertexFloatCount=18;
		var oriVertexFloatCount=vertexDeclaration.vertexStride / 4;
		var oriVertexes=vertexBuffer.getData();
		var worldMat;
		if (batchOwnerTransform){
			var rootMat=batchOwnerTransform.worldMatrix;
			rootMat.invert(SubMeshStaticBatch._tempMatrix4x40);
			worldMat=SubMeshStaticBatch._tempMatrix4x41;
			Matrix4x4.multiply(SubMeshStaticBatch._tempMatrix4x40,transform.worldMatrix,worldMat);
			}else {
			worldMat=transform.worldMatrix;
		};
		var rotation=SubMeshStaticBatch._tempQuaternion0;
		worldMat.decomposeTransRotScale(SubMeshStaticBatch._tempVector30,rotation,SubMeshStaticBatch._tempVector31);
		var lightmapScaleOffset=render.lightmapScaleOffset;
		var vertexCount=mesh.vertexCount;
		for (var i=0;i < vertexCount;i++){
			var oriOffset=i *oriVertexFloatCount;
			var bakeOffset=(i+batchOffset)*bakeVertexFloatCount;
			Utils3D.transformVector3ArrayToVector3ArrayCoordinate(oriVertexes,oriOffset+positionOffset,worldMat,batchVertices,bakeOffset+0);
			if (normalOffset!==-1)
				Utils3D.transformVector3ArrayByQuat(oriVertexes,oriOffset+normalOffset,rotation,batchVertices,bakeOffset+3);
			var j=0,m=0;
			var bakOff=bakeOffset+6;
			if (colorOffset!==-1){
				var oriOff=oriOffset+colorOffset;
				for (j=0,m=4;j < m;j++)
				batchVertices[bakOff+j]=oriVertexes[oriOff+j];
				}else {
				for (j=0,m=4;j < m;j++)
				batchVertices[bakOff+j]=1.0;
			}
			if (uv0Offset!==-1){
				var absUv0Offset=oriOffset+uv0Offset;
				batchVertices[bakeOffset+10]=oriVertexes[absUv0Offset];
				batchVertices[bakeOffset+11]=oriVertexes[absUv0Offset+1];
			}
			if (lightmapScaleOffset){
				if (uv1Offset!==-1)
					Utils3D.transformLightingMapTexcoordArray(oriVertexes,oriOffset+uv1Offset,lightmapScaleOffset,batchVertices,bakeOffset+12);
				else
				Utils3D.transformLightingMapTexcoordArray(oriVertexes,oriOffset+uv0Offset,lightmapScaleOffset,batchVertices,bakeOffset+12);
			}
			if (sTangentOffset!==-1){
				var absSTanegntOffset=oriOffset+sTangentOffset;
				batchVertices[bakeOffset+14]=oriVertexes[absSTanegntOffset];
				batchVertices[bakeOffset+15]=oriVertexes[absSTanegntOffset+1];
				batchVertices[bakeOffset+16]=oriVertexes[absSTanegntOffset+2];
				batchVertices[bakeOffset+17]=oriVertexes[absSTanegntOffset+3];
			}
		}
		return vertexCount;
	}

	/**
	*@private
	*/
	__proto.addTest=function(sprite){
		var vertexCount=0;
		var subMeshVertexCount=((sprite).meshFilter.sharedMesh).vertexCount;
		vertexCount=this._currentBatchVertexCount+subMeshVertexCount;
		if (vertexCount > 65535)
			return false;
		return true;
	}

	/**
	*@private
	*/
	__proto.add=function(sprite){
		var oldStaticBatch=sprite._render._staticBatch;
		(oldStaticBatch)&& (oldStaticBatch.remove(sprite));
		var mesh=(sprite).meshFilter.sharedMesh;
		var subMeshVertexCount=mesh.vertexCount;
		this._batchElements.push(sprite);
		var render=sprite._render;
		render._isPartOfStaticBatch=true;
		render._staticBatch=this;
		var renderElements=render._renderElements;
		for (var i=0,n=renderElements.length;i < n;i++)
		renderElements[i].staticBatch=this;
		this._currentBatchIndexCount+=mesh._indexBuffer.indexCount;
		this._currentBatchVertexCount+=subMeshVertexCount;
	}

	/**
	*@private
	*/
	__proto.remove=function(sprite){
		var mesh=(sprite).meshFilter.sharedMesh;
		var index=this._batchElements.indexOf(sprite);
		if (index!==-1){
			this._batchElements.splice(index,1);
			var render=sprite._render;
			var renderElements=sprite._render._renderElements;
			for (var i=0,n=renderElements.length;i < n;i++)
			renderElements[i].staticBatch=null;
			var meshVertexCount=mesh.vertexCount;
			this._currentBatchIndexCount=this._currentBatchIndexCount-mesh._indexBuffer.indexCount;
			this._currentBatchVertexCount=this._currentBatchVertexCount-meshVertexCount;
			sprite._render._isPartOfStaticBatch=false;
		}
	}

	/**
	*@private
	*/
	__proto.finishInit=function(){
		if (this._vertexBuffer){
			this._vertexBuffer.destroy();
			this._indexBuffer.destroy();
		};
		var batchVertexCount=0;
		var batchIndexCount=0;
		var rootOwner=this.batchOwner._owner;
		var floatStride=this._vertexDeclaration.vertexStride / 4;
		var vertexDatas=new Float32Array(floatStride *this._currentBatchVertexCount);
		var indexDatas=new Uint16Array(this._currentBatchIndexCount);
		this._vertexBuffer=new VertexBuffer3D(this._vertexDeclaration.vertexStride *this._currentBatchVertexCount,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4);
		this._vertexBuffer.vertexDeclaration=this._vertexDeclaration;
		this._indexBuffer=new IndexBuffer3D(/*laya.d3.graphics.IndexBuffer3D.INDEXTYPE_USHORT*/"ushort",this._currentBatchIndexCount,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4);
		for (var i=0,n=this._batchElements.length;i < n;i++){
			var sprite=this._batchElements [i];
			var mesh=sprite.meshFilter.sharedMesh;
			var meshVerCount=this._getStaticBatchBakedVertexs(vertexDatas,batchVertexCount,rootOwner ? rootOwner._transform :null,sprite._transform,(sprite._render),mesh);
			var indices=mesh._indexBuffer.getData();
			var indexOffset=batchVertexCount;
			var indexEnd=batchIndexCount+indices.length;
			var elements=sprite._render._renderElements;
			for (var j=0,m=mesh.subMeshCount;j < m;j++){
				var subMesh=mesh._subMeshes[j];
				var start=batchIndexCount+subMesh._indexStart;
				var element=elements [j];
				element.staticBatchIndexStart=start;
				element.staticBatchIndexEnd=start+subMesh._indexCount;
			}
			indexDatas.set(indices,batchIndexCount);
			var k=0;
			var isInvert=rootOwner ? (sprite._transform._isFrontFaceInvert!==rootOwner.transform._isFrontFaceInvert):sprite._transform._isFrontFaceInvert;
			if (isInvert){
				for (k=batchIndexCount;k < indexEnd;k+=3){
					indexDatas[k]=indexOffset+indexDatas[k];
					var index1=indexDatas[k+1];
					var index2=indexDatas[k+2];
					indexDatas[k+1]=indexOffset+index2;
					indexDatas[k+2]=indexOffset+index1;
				}
				}else {
				for (k=batchIndexCount;k < indexEnd;k+=3){
					indexDatas[k]=indexOffset+indexDatas[k];
					indexDatas[k+1]=indexOffset+indexDatas[k+1];
					indexDatas[k+2]=indexOffset+indexDatas[k+2];
				}
			}
			batchIndexCount+=indices.length;
			batchVertexCount+=meshVerCount;
		}
		this._vertexBuffer.setData(vertexDatas);
		this._indexBuffer.setData(indexDatas);
		var memorySize=this._vertexBuffer._byteLength+this._indexBuffer._byteLength;
		Resource._addGPUMemory(memorySize);
		this._bufferState.bind();
		this._bufferState.applyVertexBuffer(this._vertexBuffer);
		this._bufferState.applyIndexBuffer(this._indexBuffer);
		this._bufferState.unBind();
	}

	/**
	*@inheritDoc
	*/
	__proto._render=function(state){
		this._bufferState.bind();
		var element=state.renderElement;
		var batchElementList=(element).staticBatchElementList;
		var from=0;
		var end=0;
		for (var i=1,n=batchElementList.length;i < n;i++){
			var lastElement=batchElementList[i-1];
			if (lastElement.staticBatchIndexEnd===batchElementList[i].staticBatchIndexStart){
				end++;
				continue ;
				}else {
				var start=batchElementList[from].staticBatchIndexStart;
				var indexCount=batchElementList[end].staticBatchIndexEnd-start;
				LayaGL.instance.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,indexCount,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,start *2);
				from=++end;
				Stat.renderBatch++;
				Stat.trianglesFaces+=indexCount / 3;
			}
		}
		start=batchElementList[from].staticBatchIndexStart;
		indexCount=batchElementList[end].staticBatchIndexEnd-start;
		LayaGL.instance.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,indexCount,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,start *2);
		Stat.renderBatch++;
		Stat.trianglesFaces+=indexCount / 3;
	}

	/**
	*@private
	*/
	__proto.dispose=function(){
		var memorySize=this._vertexBuffer._byteLength+this._indexBuffer._byteLength;
		Resource._addGPUMemory(-memorySize);
		this._batchElements=null;
		this.batchOwner=null;
		this._vertexDeclaration=null;
		this._bufferState.destroy();
		this._vertexBuffer.destroy();
		this._indexBuffer.destroy();
		this._vertexBuffer=null;
		this._indexBuffer=null;
		this._bufferState=null;
	}

	SubMeshStaticBatch.maxBatchVertexCount=65535;
	SubMeshStaticBatch._batchIDCounter=0;
	__static(SubMeshStaticBatch,
	['_tempVector30',function(){return this._tempVector30=new Vector3();},'_tempVector31',function(){return this._tempVector31=new Vector3();},'_tempQuaternion0',function(){return this._tempQuaternion0=new Quaternion();},'_tempMatrix4x40',function(){return this._tempMatrix4x40=new Matrix4x4();},'_tempMatrix4x41',function(){return this._tempMatrix4x41=new Matrix4x4();}
	]);
	return SubMeshStaticBatch;
})(GeometryElement)


/**

*/
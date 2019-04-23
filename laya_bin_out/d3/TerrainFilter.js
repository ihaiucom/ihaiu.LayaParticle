/**
*<code>TerrainFilter</code> 类用于创建TerrainFilter过滤器。
*/
//class laya.d3.terrain.TerrainFilter extends laya.d3.core.GeometryElement
var TerrainFilter=(function(_super){
	function TerrainFilter(owner,chunkOffsetX,chunkOffsetZ,gridSize,terrainHeightData,heightDataWidth,heightDataHeight,cameraCoordinateInverse){
		this._owner=null;
		this._gridSize=NaN;
		this.memorySize=0;
		this._numberVertices=0;
		this._maxNumberIndices=0;
		this._currentNumberIndices=0;
		this._numberTriangle=0;
		this._vertexBuffer=null;
		this._indexBuffer=null;
		this._indexArrayBuffer=null;
		this._boundingBoxCorners=null;
		this._leafs=null;
		this._leafNum=0;
		this._terrainHeightData=null;
		this._terrainHeightDataWidth=0;
		this._terrainHeightDataHeight=0;
		this._chunkOffsetX=0;
		this._chunkOffsetZ=0;
		this._cameraCoordinateInverse=false;
		this._cameraPos=null;
		this._currentLOD=0;
		//LOD级别 4个叶子节点 第1个叶子的level<<24+第2个叶子的level<<16+第3个叶子的level<<8+第4个叶子的level
		this._perspectiveFactor=NaN;
		this._LODTolerance=0;
		/**@private */
		this._boundingSphere=null;
		/**@private */
		this._boundingBox=null;
		TerrainFilter.__super.call(this);
		this._bufferState=new BufferState();
		this._owner=owner;
		this._cameraPos=new Vector3();
		this._chunkOffsetX=chunkOffsetX;
		this._chunkOffsetZ=chunkOffsetZ;
		this._gridSize=gridSize;
		this._terrainHeightData=terrainHeightData;
		this._terrainHeightDataWidth=heightDataWidth;
		this._terrainHeightDataHeight=heightDataHeight;
		this._leafNum=(TerrainLeaf.CHUNK_GRID_NUM / TerrainLeaf.LEAF_GRID_NUM)*(TerrainLeaf.CHUNK_GRID_NUM / TerrainLeaf.LEAF_GRID_NUM);
		this._leafs=__newvec(this._leafNum);
		this._cameraCoordinateInverse=cameraCoordinateInverse;
		for (var i=0;i < this._leafNum;i++){
			this._leafs[i]=new TerrainLeaf();
		}
		this.recreateResource();
	}

	__class(TerrainFilter,'laya.d3.terrain.TerrainFilter',_super);
	var __proto=TerrainFilter.prototype;
	__proto.recreateResource=function(){
		this._currentNumberIndices=0;
		this._numberTriangle=0;
		var nLeafVertexCount=TerrainLeaf.LEAF_VERTEXT_COUNT;
		var nLeafIndexCount=TerrainLeaf.LEAF_MAX_INDEX_COUNT;
		this._numberVertices=nLeafVertexCount *this._leafNum;
		this._maxNumberIndices=nLeafIndexCount *this._leafNum;
		this._indexArrayBuffer=new Uint16Array(this._maxNumberIndices);
		var vertexDeclaration=VertexPositionTerrain.vertexDeclaration;
		var vertexFloatStride=vertexDeclaration.vertexStride / 4;
		var vertices=new Float32Array(this._numberVertices *vertexFloatStride);
		var nNum=TerrainLeaf.CHUNK_GRID_NUM / TerrainLeaf.LEAF_GRID_NUM;
		var i=0,x=0,z=0;
		for (i=0;i < this._leafNum;i++){
			x=i % nNum;
			z=Math.floor(i / nNum);
			this._leafs[i].calcVertextBuffer(this._chunkOffsetX,this._chunkOffsetZ,x *TerrainLeaf.LEAF_GRID_NUM,z *TerrainLeaf.LEAF_GRID_NUM,this._gridSize,vertices,i *TerrainLeaf.LEAF_PLANE_VERTEXT_COUNT,vertexFloatStride,this._terrainHeightData,this._terrainHeightDataWidth,this._terrainHeightDataHeight,this._cameraCoordinateInverse);
		}
		for (i=0;i < this._leafNum;i++){
			x=i % nNum;
			z=Math.floor(i / nNum);
			this._leafs[i].calcSkirtVertextBuffer(this._chunkOffsetX,this._chunkOffsetZ,x *TerrainLeaf.LEAF_GRID_NUM,z *TerrainLeaf.LEAF_GRID_NUM,this._gridSize,vertices,this._leafNum *TerrainLeaf.LEAF_PLANE_VERTEXT_COUNT+i *TerrainLeaf.LEAF_SKIRT_VERTEXT_COUNT,vertexFloatStride,this._terrainHeightData,this._terrainHeightDataWidth,this._terrainHeightDataHeight);
		}
		this.assembleIndexInit();
		this._vertexBuffer=new VertexBuffer3D(vertexDeclaration.vertexStride *this._numberVertices,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4,false);
		this._vertexBuffer.vertexDeclaration=vertexDeclaration;
		this._indexBuffer=new IndexBuffer3D(/*laya.d3.graphics.IndexBuffer3D.INDEXTYPE_USHORT*/"ushort",this._maxNumberIndices,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4,false);
		this._vertexBuffer.setData(vertices);
		this._indexBuffer.setData(this._indexArrayBuffer);
		this.memorySize=(this._vertexBuffer._byteLength+this._indexBuffer._byteLength)*2;
		this.calcOriginalBoudingBoxAndSphere();
		this._bufferState.bind();
		this._bufferState.applyVertexBuffer(this._vertexBuffer);
		this._bufferState.applyIndexBuffer(this._indexBuffer);
		this._bufferState.unBind();
	}

	__proto.setLODLevel=function(leafsLODLevel){
		if (leafsLODLevel.length !=4)return true;
		var nLOD=((leafsLODLevel[0]+1)<< 24)+((leafsLODLevel[1]+1)<< 16)+((leafsLODLevel[2]+1)<< 8)+(leafsLODLevel[3]+1);
		if (this._currentLOD==nLOD){
			return false;
		}
		this._currentLOD=nLOD;
		return true;
	}

	__proto.assembleIndexInit=function(){
		this._currentNumberIndices=0;
		this._numberTriangle=0;
		var nOffsetIndex=0;
		for (var i=0;i < this._leafNum;i++){
			var planeLODIndex=TerrainLeaf.getPlaneLODIndex(i,0);
			this._indexArrayBuffer.set(planeLODIndex,nOffsetIndex);
			nOffsetIndex+=planeLODIndex.length;
			var skirtLODIndex=TerrainLeaf.getSkirtLODIndex(i,0);
			this._indexArrayBuffer.set(skirtLODIndex,nOffsetIndex);
			nOffsetIndex+=skirtLODIndex.length;
			this._currentNumberIndices+=(planeLODIndex.length+skirtLODIndex.length);
		}
		this._numberTriangle=this._currentNumberIndices / 3;
	}

	__proto.isNeedAssemble=function(camera,cameraPostion){
		var perspectiveFactor=Math.min(camera.viewport.width,camera.viewport.height)/ (2 *Math.tan(Math.PI *camera.fieldOfView / 180.0));
		if (this._perspectiveFactor !=perspectiveFactor){
			this._perspectiveFactor=perspectiveFactor;
			return 1;
		}
		if (this._LODTolerance !=Terrain.LOD_TOLERANCE_VALUE){
			this._LODTolerance=Terrain.LOD_TOLERANCE_VALUE;
			return 1;
		}
		if (Vector3.equals(cameraPostion,this._cameraPos)==false){
			this._cameraPos.x=cameraPostion.x;
			this._cameraPos.y=cameraPostion.y;
			this._cameraPos.z=cameraPostion.z;
			return 2;
		}
		return 0;
	}

	__proto.assembleIndex=function(camera,cameraPostion){
		var nNeedType=this.isNeedAssemble(camera,cameraPostion);
		if (nNeedType > 0){
			for (var i=0;i < this._leafNum;i++){
				TerrainFilter._TEMP_ARRAY_BUFFER[i]=this._leafs[i].determineLod(cameraPostion,this._perspectiveFactor,Terrain.LOD_TOLERANCE_VALUE,nNeedType==1);
			}
			if (this.setLODLevel(TerrainFilter._TEMP_ARRAY_BUFFER)){
				this._currentNumberIndices=0;
				this._numberTriangle=0;
				var nOffsetIndex=0;
				for (i=0;i < this._leafNum;i++){
					var nLODLevel=TerrainFilter._TEMP_ARRAY_BUFFER[i];
					var planeLODIndex=TerrainLeaf.getPlaneLODIndex(i,nLODLevel);
					this._indexArrayBuffer.set(planeLODIndex,nOffsetIndex);
					nOffsetIndex+=planeLODIndex.length;
					var skirtLODIndex=TerrainLeaf.getSkirtLODIndex(i,nLODLevel);
					this._indexArrayBuffer.set(skirtLODIndex,nOffsetIndex);
					nOffsetIndex+=skirtLODIndex.length;
					this._currentNumberIndices+=(planeLODIndex.length+skirtLODIndex.length);
				}
				this._numberTriangle=this._currentNumberIndices / 3;
				return true;
			}
		}
		return false;
	}

	__proto.calcOriginalBoudingBoxAndSphere=function(){
		var sizeOfY=new Vector2(2147483647,-2147483647);
		for (var i=0;i < this._leafNum;i++){
			sizeOfY.x=this._leafs[i]._sizeOfY.x < sizeOfY.x ? this._leafs[i]._sizeOfY.x :sizeOfY.x;
			sizeOfY.y=this._leafs[i]._sizeOfY.y > sizeOfY.y ? this._leafs[i]._sizeOfY.y :sizeOfY.y;
		};
		var min=new Vector3(this._chunkOffsetX *TerrainLeaf.CHUNK_GRID_NUM *this._gridSize,sizeOfY.x,this._chunkOffsetZ *TerrainLeaf.CHUNK_GRID_NUM *this._gridSize);
		var max=new Vector3((this._chunkOffsetX+1)*TerrainLeaf.CHUNK_GRID_NUM *this._gridSize,sizeOfY.y,(this._chunkOffsetZ+1)*TerrainLeaf.CHUNK_GRID_NUM *this._gridSize);
		if (TerrainLeaf.__ADAPT_MATRIX__){
			Vector3.transformV3ToV3(min,TerrainLeaf.__ADAPT_MATRIX__,min);
			Vector3.transformV3ToV3(max,TerrainLeaf.__ADAPT_MATRIX__,max);
		}
		this._boundingBox=new BoundBox(min,max);
		var size=new Vector3();
		Vector3.subtract(max,min,size);
		Vector3.scale(size,0.5,size);
		var center=new Vector3();
		Vector3.add(min,size,center);
		this._boundingSphere=new BoundSphere(center,Vector3.scalarLength(size));
		this._boundingBoxCorners=__newvec(8,null);
		this._boundingBox.getCorners(this._boundingBoxCorners);
	}

	__proto.calcLeafBoudingBox=function(worldMatrix){
		for (var i=0;i < this._leafNum;i++){
			this._leafs[i].calcLeafBoudingBox(worldMatrix);
		}
	}

	__proto.calcLeafBoudingSphere=function(worldMatrix,maxScale){
		for (var i=0;i < this._leafNum;i++){
			this._leafs[i].calcLeafBoudingSphere(worldMatrix,maxScale);
		}
	}

	__proto._getVertexBuffer=function(index){
		(index===void 0)&& (index=0);
		if (index==0){
			return this._vertexBuffer;
		}
		return null;
	}

	__proto._getIndexBuffer=function(){
		return this._indexBuffer;
	}

	/**
	*@inheritDoc
	*/
	__proto._getType=function(){
		return TerrainFilter._type;
	}

	/**
	*@inheritDoc
	*/
	__proto._prepareRender=function(state){
		var terrainMaterial=state.renderElement.material;
		if (terrainMaterial.getRenderState(0).blend==/*laya.d3.core.material.RenderState.BLEND_DISABLE*/0){
			var camera=state.camera;
			if (this.assembleIndex(camera,camera.transform.position)){
				this._indexBuffer.setData(this._indexArrayBuffer);
			}
		}
		return true;
	}

	/**
	*@inheritDoc
	*/
	__proto._render=function(state){
		this._bufferState.bind();
		LayaGL.instance.drawElements(Terrain.RENDER_LINE_MODEL ? /*laya.webgl.WebGLContext.LINES*/0x0001 :/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,this._currentNumberIndices,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,0);
		Stat.trianglesFaces+=this._numberTriangle;
		Stat.renderBatch++;
	}

	/**
	*@inheritDoc
	*/
	__proto.destroy=function(){
		this._owner=null;
		this._bufferState.destroy();
		if (this._vertexBuffer)this._vertexBuffer.destroy();
		if (this._indexBuffer)this._indexBuffer.destroy();
	}

	__static(TerrainFilter,
	['_TEMP_ARRAY_BUFFER',function(){return this._TEMP_ARRAY_BUFFER=new Uint32Array(TerrainLeaf.CHUNK_GRID_NUM / TerrainLeaf.LEAF_GRID_NUM *TerrainLeaf.CHUNK_GRID_NUM / TerrainLeaf.LEAF_GRID_NUM);},'_type',function(){return this._type=GeometryElement._typeCounter++;}
	]);
	return TerrainFilter;
})(GeometryElement)


/**

*/
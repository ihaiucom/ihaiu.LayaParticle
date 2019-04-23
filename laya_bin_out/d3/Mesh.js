/**
*<code>Mesh</code> 类用于创建文件网格数据模板。
*/
//class laya.d3.resource.models.Mesh extends laya.resource.Resource
var Mesh=(function(_super){
	function Mesh(){
		/**@private */
		this._nativeTriangleMesh=null;
		/**@private */
		this._boundingBox=null;
		/**@private */
		this._boundingSphere=null;
		/**@private */
		this._boundingBoxCorners=null;
		/**@private */
		this._subMeshCount=0;
		/**@private 只读,不允许修改。*/
		this._positions=null;
		/**@private */
		this._subMeshes=null;
		/**@private */
		this._vertexBuffers=null;
		/**@private */
		this._indexBuffer=null;
		/**@private */
		this._boneNames=null;
		/**@private */
		this._inverseBindPoses=null;
		/**@private */
		this._inverseBindPosesBuffer=null;
		/**@private */
		this._bindPoseIndices=null;
		/**@private */
		this._skinDataPathMarks=null;
		/**@private */
		this._vertexCount=0;
		Mesh.__super.call(this);
		this._subMeshes=[];
		this._vertexBuffers=[];
		this._skinDataPathMarks=[];
		this._boundingBoxCorners=__newvec(8,null);
	}

	__class(Mesh,'laya.d3.resource.models.Mesh',_super);
	var __proto=Mesh.prototype;
	/**
	*@private
	*/
	__proto._generateBoundingObject=function(){
		this._boundingSphere=new BoundSphere(new Vector3(),0);
		BoundSphere.createfromPoints(this._positions,this._boundingSphere);
		this._boundingBox=new BoundBox(new Vector3(),new Vector3());
		BoundBox.createfromPoints(this._positions,this._boundingBox);
		this._boundingBox.getCorners(this._boundingBoxCorners);
	}

	/**
	*获取网格顶点，并产生数据
	*@return 网格顶点。
	*/
	__proto._getPositions=function(){
		var vertices=[];
		var i=0,j=0,vertexBuffer,positionElement,vertexElements,vertexElement,ofset=0,verticesData;
		var vertexBufferCount=this._vertexBuffers.length;
		for (i=0;i < vertexBufferCount;i++){
			vertexBuffer=this._vertexBuffers[i];
			vertexElements=vertexBuffer.vertexDeclaration.vertexElements;
			for (j=0;j < vertexElements.length;j++){
				vertexElement=vertexElements[j];
				if (vertexElement.elementFormat===/*laya.d3.graphics.VertexElementFormat.Vector3*/"vector3" && vertexElement.elementUsage===/*laya.d3.graphics.Vertex.VertexMesh.MESH_POSITION0*/0){
					positionElement=vertexElement;
					break ;
				}
			}
			verticesData=vertexBuffer.getData();
			for (j=0;j < verticesData.length;j+=vertexBuffer.vertexDeclaration.vertexStride / 4){
				ofset=j+positionElement.offset / 4;
				vertices.push(new Vector3(verticesData[ofset+0],verticesData[ofset+1],verticesData[ofset+2]));
			}
		}
		return vertices;
	}

	/**
	*@private
	*/
	__proto._setSubMeshes=function(subMeshes){
		this._subMeshes=subMeshes
		this._subMeshCount=subMeshes.length;
		for (var i=0;i < this._subMeshCount;i++)
		subMeshes[i]._indexInMesh=i;
		this._positions=this._getPositions();
		this._generateBoundingObject();
	}

	/**
	*@inheritDoc
	*/
	__proto._getSubMesh=function(index){
		return this._subMeshes[index];
	}

	/**
	*@inheritDoc
	*/
	__proto._disposeResource=function(){
		for (var i=0,n=this._subMeshes.length;i < n;i++)
		this._subMeshes[i].destroy();
		this._nativeTriangleMesh && Laya3D._physics3D.destroy(this._nativeTriangleMesh);
		for (i=0,n=this._vertexBuffers.length;i < n;i++)
		this._vertexBuffers[i].destroy();
		this._indexBuffer.destroy();
		this._setCPUMemory(0);
		this._setGPUMemory(0);
		this._vertexBuffers=null;
		this._indexBuffer=null;
		this._subMeshes=null;
		this._nativeTriangleMesh=null;
		this._vertexBuffers=null;
		this._indexBuffer=null;
		this._boneNames=null;
		this._inverseBindPoses=null;
	}

	/**
	*@private
	*/
	__proto._getPhysicMesh=function(){
		if (!this._nativeTriangleMesh){
			var physics3D=Laya3D._physics3D;
			var triangleMesh=new physics3D.btTriangleMesh();
			var nativePositio0=Mesh._nativeTempVector30;
			var nativePositio1=Mesh._nativeTempVector31;
			var nativePositio2=Mesh._nativeTempVector32;
			var positions=this._getPositions();
			var indices=this._indexBuffer.getData();
			for (var i=0,n=indices.length;i < n;i+=3){
				var position0=positions[indices[i]];
				var position1=positions[indices[i+1]];
				var position2=positions[indices[i+2]];
				Utils3D._convertToBulletVec3(position0,nativePositio0,true);
				Utils3D._convertToBulletVec3(position1,nativePositio1,true);
				Utils3D._convertToBulletVec3(position2,nativePositio2,true);
				triangleMesh.addTriangle(nativePositio0,nativePositio1,nativePositio2,true);
			}
			this._nativeTriangleMesh=triangleMesh;
		}
		return this._nativeTriangleMesh;
	}

	/**
	*获取网格的全局默认绑定动作逆矩阵。
	*@return 网格的全局默认绑定动作逆矩阵。
	*/
	__getset(0,__proto,'inverseAbsoluteBindPoses',function(){
		return this._inverseBindPoses;
	});

	/**
	*获取顶点个数
	*/
	__getset(0,__proto,'vertexCount',function(){
		return this._vertexCount;
	});

	/**
	*获取SubMesh的个数。
	*@return SubMesh的个数。
	*/
	__getset(0,__proto,'subMeshCount',function(){
		return this._subMeshCount;
	});

	/**
	*获取AABB包围盒,禁止修改其数据。
	*@return AABB包围盒。
	*/
	__getset(0,__proto,'boundingBox',function(){
		return this._boundingBox;
	});

	/**
	*获取包围球顶点,禁止修改其数据。
	*@return 包围球。
	*/
	__getset(0,__proto,'boundingBoxCorners',function(){
		return this._boundingBoxCorners;
	});

	/**
	*获取包围球,禁止修改其数据。
	*@return 包围球。
	*/
	__getset(0,__proto,'boundingSphere',function(){
		return this._boundingSphere;
	});

	Mesh._parse=function(data,propertyParams,constructParams){
		var mesh=new Mesh();
		MeshReader.read(data,mesh,mesh._subMeshes);
		return mesh;
	}

	Mesh.load=function(url,complete){
		Laya.loader.create(url,complete,null,/*Laya3D.MESH*/"MESH");
	}

	__static(Mesh,
	['_nativeTempVector30',function(){return this._nativeTempVector30=new Laya3D._physics3D.btVector3(0,0,0);},'_nativeTempVector31',function(){return this._nativeTempVector31=new Laya3D._physics3D.btVector3(0,0,0);},'_nativeTempVector32',function(){return this._nativeTempVector32=new Laya3D._physics3D.btVector3(0,0,0);}
	]);
	return Mesh;
})(Resource)


/**

*/
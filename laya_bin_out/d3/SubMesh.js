/**
*<code>SubMesh</code> 类用于创建子网格数据模板。
*/
//class laya.d3.resource.models.SubMesh extends laya.d3.core.GeometryElement
var SubMesh=(function(_super){
	function SubMesh(mesh){
		/**@private */
		this._mesh=null;
		/**@private */
		this._boneIndicesList=null;
		/**@private */
		this._subIndexBufferStart=null;
		/**@private */
		this._subIndexBufferCount=null;
		/**@private */
		this._skinAnimationDatas=null;
		/**@private */
		this._indexInMesh=0;
		/**@private */
		this._vertexStart=0;
		/**@private */
		this._indexStart=0;
		/**@private */
		this._indexCount=0;
		/**@private */
		this._indices=null;
		/**@private [只读]*/
		this._vertexBuffer=null;
		/**@private [只读]*/
		this._indexBuffer=null;
		SubMesh.__super.call(this);
		this._bufferState=new BufferState();
		this._mesh=mesh;
		this._boneIndicesList=[];
		this._subIndexBufferStart=[];
		this._subIndexBufferCount=[];
	}

	__class(SubMesh,'laya.d3.resource.models.SubMesh',_super);
	var __proto=SubMesh.prototype;
	/**
	*@inheritDoc
	*/
	__proto._getType=function(){
		return SubMesh._type;
	}

	/**
	*@inheritDoc
	*/
	__proto._render=function(state){
		this._bufferState.bind();
		var skinAnimationDatas=(state.renderElement).skinnedDatas;
		var boneIndicesListCount=this._boneIndicesList.length;
		var shader=state.shader;
		for (var i=0;i < boneIndicesListCount;i++){
			(skinAnimationDatas)&& (shader.uploadCustomUniform(SkinnedMeshSprite3D.BONES,skinAnimationDatas[i]));
			LayaGL.instance.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,this._subIndexBufferCount[i],/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,this._subIndexBufferStart[i] *2);
		}
		Stat.renderBatch++;
		Stat.trianglesFaces+=this._indexCount / 3;
	}

	/**
	*@private
	*/
	__proto.getIndices=function(){
		return this._indices;
	}

	/**
	*@inheritDoc
	*/
	__proto.destroy=function(){
		if (this._destroyed)
			return;
		_super.prototype.destroy.call(this);
		this._bufferState.destroy();
		this._indexBuffer.destroy();
		this._bufferState=null;
		this._indexBuffer=null;
		this._mesh=null;
		this._boneIndicesList=null;
		this._subIndexBufferStart=null;
		this._subIndexBufferCount=null;
		this._skinAnimationDatas=null;
	}

	__static(SubMesh,
	['_type',function(){return this._type=GeometryElement._typeCounter++;}
	]);
	return SubMesh;
})(GeometryElement)


/**

*/
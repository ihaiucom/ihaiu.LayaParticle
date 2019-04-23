/**
*<code>MeshSprite3DDynamicBatchManager</code> 类用于网格精灵动态批处理管理。
*/
//class laya.d3.graphics.MeshRenderDynamicBatchManager extends laya.d3.graphics.DynamicBatchManager
var MeshRenderDynamicBatchManager=(function(_super){
	function MeshRenderDynamicBatchManager(){
		/**@private [只读]*/
		//this._updateCountMark=0;
		this._cacheBatchRender=[];
		this._cacheBufferStates=[];
		this._opaqueBatchMarks=[];
		MeshRenderDynamicBatchManager.__super.call(this);
		SubMeshDynamicBatch.instance=new SubMeshDynamicBatch();
		this._updateCountMark=0;
	}

	__class(MeshRenderDynamicBatchManager,'laya.d3.graphics.MeshRenderDynamicBatchManager',_super);
	var __proto=MeshRenderDynamicBatchManager.prototype;
	/**
	*@private
	*/
	__proto._getBufferState=function(vertexDeclaration){
		var bufferState=this._cacheBufferStates[vertexDeclaration.id];
		if (!bufferState){
			var instance=SubMeshDynamicBatch.instance;
			bufferState=new BufferState();
			bufferState.bind();
			var vertexBuffer=instance._vertexBuffer;
			vertexBuffer.vertexDeclaration=vertexDeclaration;
			bufferState.applyVertexBuffer(vertexBuffer);
			bufferState.applyIndexBuffer(instance._indexBuffer);
			bufferState.unBind();
			this._cacheBufferStates[vertexDeclaration.id]=bufferState;
		}
		return bufferState;
	}

	/**
	*@private
	*/
	__proto._getBatchRender=function(lightMapIndex,receiveShadow){
		var lightRenders=this._cacheBatchRender[lightMapIndex];
		(lightRenders)|| (lightRenders=this._cacheBatchRender[lightMapIndex]=__newvec(2,null));
		var render=lightRenders[receiveShadow ? 1 :0];
		if (!render){
			render=new MeshRenderer(null);
			render.lightmapIndex=lightMapIndex;
			render.receiveShadow=receiveShadow;
			lightRenders[receiveShadow ? 1 :0]=render;
		}
		return render;
	}

	/**
	*@inheritDoc
	*/
	__proto._getBatchRenderElementFromPool=function(){
		var renderElement=this._batchRenderElementPool [this._batchRenderElementPoolIndex++];
		if (!renderElement){
			renderElement=new SubMeshRenderElement();
			this._batchRenderElementPool[this._batchRenderElementPoolIndex-1]=renderElement;
			renderElement.dynamicBatchElementList=[];
		}
		return renderElement;
	}

	/**
	*@inheritDoc
	*/
	__proto._clear=function(){
		_super.prototype._clear.call(this);
		this._updateCountMark++;
	}

	__static(MeshRenderDynamicBatchManager,
	['instance',function(){return this.instance=new MeshRenderDynamicBatchManager();}
	]);
	return MeshRenderDynamicBatchManager;
})(DynamicBatchManager)


/**

*/
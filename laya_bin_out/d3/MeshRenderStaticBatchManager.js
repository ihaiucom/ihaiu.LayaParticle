/**
*<code>MeshSprite3DStaticBatchManager</code> 类用于网格精灵静态批处理管理。
*/
//class laya.d3.graphics.MeshRenderStaticBatchManager extends laya.d3.graphics.StaticBatchManager
var MeshRenderStaticBatchManager=(function(_super){
	function MeshRenderStaticBatchManager(){
		/**@private [只读]*/
		//this._updateCountMark=0;
		this._opaqueBatchMarks=[];
		MeshRenderStaticBatchManager.__super.call(this);
		this._updateCountMark=0;
	}

	__class(MeshRenderStaticBatchManager,'laya.d3.graphics.MeshRenderStaticBatchManager',_super);
	var __proto=MeshRenderStaticBatchManager.prototype;
	/**
	*@inheritDoc
	*/
	__proto._compare=function(left,right){
		var lRender=left._render,rRender=right._render;
		var leftGeo=(left).meshFilter.sharedMesh,rightGeo=(right).meshFilter.sharedMesh;
		var lightOffset=lRender.lightmapIndex-rRender.lightmapIndex;
		if (lightOffset===0){
			var receiveShadowOffset=(lRender.receiveShadow ? 1 :0)-(rRender.receiveShadow ? 1 :0);
			if (receiveShadowOffset===0){
				var materialOffset=lRender.sharedMaterial.id-rRender.sharedMaterial.id;
				if (materialOffset===0){
					var verDec=leftGeo._vertexBuffers[0].vertexDeclaration.id-rightGeo._vertexBuffers[0].vertexDeclaration.id;
					if (verDec===0){
						return rightGeo._indexBuffer.indexCount-leftGeo._indexBuffer.indexCount;
						}else {
						return verDec;
					}
					}else {
					return materialOffset;
				}
				}else {
				return receiveShadowOffset;
			}
			}else {
			return lightOffset;
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._getBatchRenderElementFromPool=function(){
		var renderElement=this._batchRenderElementPool[this._batchRenderElementPoolIndex++];
		if (!renderElement){
			renderElement=new SubMeshRenderElement();
			this._batchRenderElementPool[this._batchRenderElementPoolIndex-1]=renderElement;
			renderElement.staticBatchElementList=[];
		}
		return renderElement;
	}

	/**
	*@private
	*/
	__proto._getStaticBatch=function(rootOwner,number){
		var key=rootOwner ? rootOwner.id :0;
		var batchOwner=this._staticBatches[key];
		(batchOwner)|| (batchOwner=this._staticBatches[key]=new MeshRenderStaticBatchOwner(rootOwner));
		var batches=batchOwner._batches;
		return (batches[number])|| (batches[number]=new SubMeshStaticBatch(batchOwner,number,MeshRenderStaticBatchManager._verDec));
	}

	/**
	*@inheritDoc
	*/
	__proto._initStaticBatchs=function(rootOwner){
		this._quickSort(this._initBatchSprites,0,this._initBatchSprites.length-1);
		var lastCanMerage=false;
		var curStaticBatch;
		var batchNumber=0;
		for (var i=0,n=this._initBatchSprites.length;i < n;i++){
			var sprite=this._initBatchSprites[i];
			if (lastCanMerage){
				if (curStaticBatch.addTest(sprite)){
					curStaticBatch.add(sprite);
					}else {
					lastCanMerage=false;
					batchNumber++;
				}
				}else {
				var lastIndex=n-1;
				if (i!==lastIndex){
					curStaticBatch=this._getStaticBatch(rootOwner,batchNumber);
					curStaticBatch.add(sprite);
					lastCanMerage=true;
				}
			}
		}
		for (var key in this._staticBatches){
			var batches=this._staticBatches[key]._batches;
			for (i=0,n=batches.length;i < n;i++)
			batches[i].finishInit();
		}
		this._initBatchSprites.length=0;
	}

	/**
	*@private
	*/
	__proto._destroyRenderSprite=function(sprite){
		var staticBatch=sprite._render._staticBatch;
		staticBatch.remove(sprite);
		if (staticBatch._batchElements.length===0){
			var owner=staticBatch.batchOwner._owner;
			var ownerID=owner ? owner.id :0;
			var batches=this._staticBatches[ownerID]._batches;
			batches.splice(staticBatch.number,1)
			if (batches.length===0)
				delete this._staticBatches[ownerID];
			staticBatch.dispose();
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._clear=function(){
		_super.prototype._clear.call(this);
		this._updateCountMark++;
	}

	/**
	*@inheritDoc
	*/
	__proto._garbageCollection=function(){
		for (var key in this._staticBatches){
			var batches=this._staticBatches[key]._batches;
			for (var i=0,n=batches.length;i < n;i++){
				var staticBatch=batches[i];
				if (staticBatch._batchElements.length===0){
					staticBatch.dispose();
					batches.splice(i,1);
					i--,n--;
					if (n===0)
						delete this._staticBatches[key];
				}
			}
		}
	}

	__static(MeshRenderStaticBatchManager,
	['_verDec',function(){return this._verDec=VertexMesh.getVertexDeclaration("POSITION,NORMAL,COLOR,UV,UV1,TANGENT");},'instance',function(){return this.instance=new MeshRenderStaticBatchManager();}
	]);
	return MeshRenderStaticBatchManager;
})(StaticBatchManager)


/**

*/
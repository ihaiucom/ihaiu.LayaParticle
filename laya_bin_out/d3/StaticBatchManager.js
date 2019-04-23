/**
*<code>StaticBatchManager</code> 类用于静态批处理管理的父类。
*/
//class laya.d3.graphics.StaticBatchManager
var StaticBatchManager=(function(){
	function StaticBatchManager(){
		/**@private */
		//this._batchRenderElementPool=null;
		/**@private */
		//this._batchRenderElementPoolIndex=0;
		/**@private */
		//this._initBatchSprites=null;
		/**@private */
		//this._staticBatches=null;
		this._initBatchSprites=[];
		this._staticBatches={};
		this._batchRenderElementPoolIndex=0;
		this._batchRenderElementPool=[];
	}

	__class(StaticBatchManager,'laya.d3.graphics.StaticBatchManager');
	var __proto=StaticBatchManager.prototype;
	/**
	*@private
	*/
	__proto._partition=function(items,left,right){
		var pivot=items[Math.floor((right+left)/ 2)];
		while (left <=right){
			while (this._compare(items[left],pivot)< 0)
			left++;
			while (this._compare(items[right],pivot)> 0)
			right--;
			if (left < right){
				var temp=items[left];
				items[left]=items[right];
				items[right]=temp;
				left++;
				right--;
				}else if (left===right){
				left++;
				break ;
			}
		}
		return left;
	}

	/**
	*@private
	*/
	__proto._quickSort=function(items,left,right){
		if (items.length > 1){
			var index=this._partition(items,left,right);
			var leftIndex=index-1;
			if (left < leftIndex)
				this._quickSort(items,left,leftIndex);
			if (index < right)
				this._quickSort(items,index,right);
		}
	}

	/**
	*@private
	*/
	__proto._compare=function(left,right){
		throw "StaticBatch:must override this function.";
	}

	/**
	*@private
	*/
	__proto._initStaticBatchs=function(rootSprite){
		throw "StaticBatch:must override this function.";
	}

	/**
	*@private
	*/
	__proto._getBatchRenderElementFromPool=function(){
		throw "StaticBatch:must override this function.";
	}

	/**
	*@private
	*/
	__proto._addBatchSprite=function(renderableSprite3D){
		this._initBatchSprites.push(renderableSprite3D);
	}

	/**
	*@private
	*/
	__proto._clear=function(){
		this._batchRenderElementPoolIndex=0;
	}

	/**
	*@private
	*/
	__proto._garbageCollection=function(){
		throw "StaticBatchManager: must override it.";
	}

	/**
	*@private
	*/
	__proto.dispose=function(){
		this._staticBatches=null;
	}

	StaticBatchManager._registerManager=function(manager){
		StaticBatchManager._managers.push(manager);
	}

	StaticBatchManager._addToStaticBatchQueue=function(sprite3D){
		if ((sprite3D instanceof laya.d3.core.RenderableSprite3D )&& sprite3D.isStatic)
			(sprite3D)._addToInitStaticBatchManager();
		for (var i=0,n=sprite3D.numChildren;i < n;i++)
		StaticBatchManager._addToStaticBatchQueue(sprite3D._children [i]);
	}

	StaticBatchManager.combine=function(staticBatchRoot,renderableSprite3Ds){
		var i=0,n=0;
		if (renderableSprite3Ds){
			for (i=0,n=renderableSprite3Ds.length;i < n;i++){
				var renderableSprite3D=renderableSprite3Ds[i];
				(renderableSprite3D.isStatic)&& (renderableSprite3D._addToInitStaticBatchManager());
			}
			}else {
			if (staticBatchRoot)
				StaticBatchManager._addToStaticBatchQueue(staticBatchRoot);
		}
		for (i=0,n=StaticBatchManager._managers.length;i < n;i++){
			var manager=StaticBatchManager._managers[i];
			manager._initStaticBatchs(staticBatchRoot);
		}
	}

	StaticBatchManager._managers=[];
	return StaticBatchManager;
})()


/**

*/
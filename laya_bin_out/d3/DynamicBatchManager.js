/**
*<code>DynamicBatchManager</code> 类用于管理动态批处理。
*/
//class laya.d3.graphics.DynamicBatchManager
var DynamicBatchManager=(function(){
	function DynamicBatchManager(){
		/**@private */
		//this._batchRenderElementPool=null;
		/**@private */
		//this._batchRenderElementPoolIndex=0;
		this._batchRenderElementPool=[];
	}

	__class(DynamicBatchManager,'laya.d3.graphics.DynamicBatchManager');
	var __proto=DynamicBatchManager.prototype;
	/**
	*@private
	*/
	__proto._clear=function(){
		this._batchRenderElementPoolIndex=0;
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
	__proto.dispose=function(){}
	DynamicBatchManager._registerManager=function(manager){
		DynamicBatchManager._managers.push(manager);
	}

	DynamicBatchManager._managers=[];
	return DynamicBatchManager;
})()


/**

*/
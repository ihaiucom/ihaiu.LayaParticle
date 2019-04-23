/**
*<code>/**
*<code>FrustumCulling</code> 类用于裁剪。
*/
//class laya.d3.graphics.FrustumCulling
var FrustumCulling=(function(){
	/**
	*创建一个 <code>FrustumCulling</code> 实例。
	*/
	function FrustumCulling(){}
	__class(FrustumCulling,'laya.d3.graphics.FrustumCulling');
	FrustumCulling.__init__=function(){
		if (Render.isConchApp){
			FrustumCulling._cullingBufferLength=0;
			FrustumCulling._cullingBuffer=new Float32Array(4096);
		}
	}

	FrustumCulling.renderObjectCulling=function(camera,scene,context,renderList){
		var i=0,n=0,j=0,m=0;
		var opaqueQueue=scene._opaqueQueue;
		var transparentQueue=scene._transparentQueue;
		opaqueQueue.clear();
		transparentQueue.clear();
		var staticBatchManagers=StaticBatchManager._managers;
		for (i=0,n=staticBatchManagers.length;i < n;i++)
		staticBatchManagers[i]._clear();
		var dynamicBatchManagers=DynamicBatchManager._managers;
		for (i=0,n=dynamicBatchManagers.length;i < n;i++)
		dynamicBatchManagers[i]._clear();
		var validCount=renderList.length;
		var renders=renderList.elements;
		var boundFrustum=camera.boundFrustum;
		Stat.spriteCount+=validCount;
		var camPos=context.camera._transform.position;
		if (scene.treeRoot){
			scene.treeRoot.cullingObjects(context,boundFrustum,camera,camPos,true);
			}else {
			for (i=0;i < validCount;i++){
				var render=renders [i];
				if (scene.isLayerVisible(render._owner._layer,camera)&& render._enable && render._needRender(boundFrustum)){
					render._visible=true;
					render._distanceForSort=Vector3.distance(render.boundingSphere.center,camPos);
					var elements=render._renderElements;
					for (j=0,m=elements.length;j < m;j++){
						var element=elements[j];
						var renderQueue=scene._getRenderQueue(element.material.renderQueue);
						if (renderQueue.isTransparent)
							element.addToTransparentRenderQueue(context,renderQueue);
						else
						element.addToOpaqueRenderQueue(context,renderQueue);
					}
					}else {
					render._visible=false;
				}
			}
		};
		var count=opaqueQueue.elements.length;
		(count > 0)&& (opaqueQueue._quickSort(0,count-1));
		count=transparentQueue.elements.length;
		(count > 0)&& (transparentQueue._quickSort(0,count-1));
	}

	FrustumCulling.renderObjectCullingNative=function(camera,scene,context,renderList){
		var i=0,n=0,j=0,m=0;
		var opaqueQueue=scene._opaqueQueue;
		var transparentQueue=scene._transparentQueue;
		opaqueQueue.clear();
		transparentQueue.clear();
		var staticBatchManagers=StaticBatchManager._managers;
		for (i=0,n=staticBatchManagers.length;i < n;i++)
		staticBatchManagers[i]._clear();
		var dynamicBatchManagers=DynamicBatchManager._managers;
		for (i=0,n=dynamicBatchManagers.length;i < n;i++)
		dynamicBatchManagers[i]._clear();
		var validCount=renderList.length;
		var renders=renderList.elements;
		for (i=0;i < validCount;i++){
			(renders [i]).boundingSphere;
		};
		var boundFrustum=camera.boundFrustum;
		FrustumCulling.cullingNative(camera._boundFrustumBuffer,FrustumCulling._cullingBuffer,scene._cullingBufferIndices,validCount,scene._cullingBufferResult);
		Stat.spriteCount+=validCount;
		var camPos=context.camera._transform.position;
		for (i=0;i < validCount;i++){
			var render=renders [i];
			if (scene.isLayerVisible(render._owner._layer,camera)&& render._enable && scene._cullingBufferResult[i]){
				render._visible=true;
				render._distanceForSort=Vector3.distance(render.boundingSphere.center,camPos);
				var elements=render._renderElements;
				for (j=0,m=elements.length;j < m;j++){
					var element=elements[j];
					var renderQueue=scene._getRenderQueue(element.material.renderQueue);
					if (renderQueue.isTransparent)
						element.addToTransparentRenderQueue(context,renderQueue);
					else
					element.addToOpaqueRenderQueue(context,renderQueue);
				}
				}else {
				render._visible=false;
			}
		};
		var count=opaqueQueue.elements.length;
		(count > 0)&& (opaqueQueue._quickSort(0,count-1));
		count=transparentQueue.elements.length;
		(count > 0)&& (transparentQueue._quickSort(0,count-1));
	}

	FrustumCulling.cullingNative=function(boundFrustumBuffer,cullingBuffer,cullingBufferIndices,cullingCount,cullingBufferResult){
		return LayaGL.instance.culling(boundFrustumBuffer,cullingBuffer,cullingBufferIndices,cullingCount,cullingBufferResult);
	}

	FrustumCulling._cullingBufferLength=0;
	FrustumCulling._cullingBuffer=null;
	return FrustumCulling;
})()


/**
*创建一个 <code>MeshRenderStaticBatchOwner</code> 实例。
*/
//class laya.d3.graphics.MeshRenderStaticBatchOwner
var MeshRenderStaticBatchOwner=(function(){
	function MeshRenderStaticBatchOwner(owner){
		/**@private */
		//this._owner=null;
		/**@private */
		//this._batches=null;
		/**@private */
		//this._cacheBatchOwner=null;
		this._owner=owner;
		this._batches=[];
		this._cacheBatchOwner=[];
	}

	__class(MeshRenderStaticBatchOwner,'laya.d3.graphics.MeshRenderStaticBatchOwner');
	var __proto=MeshRenderStaticBatchOwner.prototype;
	/**
	*@private
	*/
	__proto._getBatchRender=function(context,lightMapIndex,receiveShadow){
		var lightRenders=this._cacheBatchOwner[lightMapIndex];
		(lightRenders)|| (lightRenders=this._cacheBatchOwner[lightMapIndex]=__newvec(2,null));
		var render=lightRenders[receiveShadow ? 1 :0];
		if (!render){
			render=new MeshRenderer(null);
			render.lightmapIndex=lightMapIndex;
			render.receiveShadow=receiveShadow;
			lightRenders[receiveShadow ? 1 :0]=render;
			render._defineDatas.add(MeshSprite3D.SHADERDEFINE_UV1);
		}
		return render;
	}

	return MeshRenderStaticBatchOwner;
})()


/**
*@private

*/
*/
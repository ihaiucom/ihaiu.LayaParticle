/**
*<code>RenderQuene</code> 类用于实现渲染队列。
*/
//class laya.d3.core.render.RenderQueue
var RenderQueue=(function(){
	function RenderQueue(isTransparent){
		/**@private [只读]*/
		//this.isTransparent=false;
		/**@private */
		//this.elements=null;
		/**@private */
		//this.lastTransparentRenderElement=null;
		/**@private */
		//this.lastTransparentBatched=false;
		(isTransparent===void 0)&& (isTransparent=false);
		this.isTransparent=isTransparent;
		this.elements=[];
	}

	__class(RenderQueue,'laya.d3.core.render.RenderQueue');
	var __proto=RenderQueue.prototype;
	/**
	*@private
	*/
	__proto._compare=function(left,right){
		var renderQueue=left.material.renderQueue-right.material.renderQueue;
		if (renderQueue===0){
			var sort=this.isTransparent ? right.render._distanceForSort-left.render._distanceForSort :left.render._distanceForSort-right.render._distanceForSort;
			return sort+left.render.sortingFudge-right.render.sortingFudge;
			}else {
			return renderQueue;
		}
	}

	/**
	*@private
	*/
	__proto._partitionRenderObject=function(left,right){
		var pivot=this.elements[Math.floor((right+left)/ 2)];
		while (left <=right){
			while (this._compare(this.elements[left],pivot)< 0)
			left++;
			while (this._compare(this.elements[right],pivot)> 0)
			right--;
			if (left < right){
				var temp=this.elements[left];
				this.elements[left]=this.elements[right];
				this.elements[right]=temp;
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
	__proto._quickSort=function(left,right){
		if (this.elements.length > 1){
			var index=this._partitionRenderObject(left,right);
			var leftIndex=index-1;
			if (left < leftIndex)
				this._quickSort(left,leftIndex);
			if (index < right)
				this._quickSort(index,right);
		}
	}

	/**
	*@private
	*渲染队列。
	*@param state 渲染状态。
	*/
	__proto._render=function(context,isTarget,customShader,replacementTag){
		var lastStateRenderState,lastStateRender;
		var loopCount=Stat.loopCount;
		var scene=context.scene;
		var camera=context.camera;
		for (var i=0,n=this.elements.length;i < n;i++){
			var element=this.elements[i];
			var transform=element._transform;
			var render=element.render;
			var geometry=element._geometry;
			var material=element.material;
			context.renderElement=element;
			if (loopCount!==render._updateLoopCount){
				render._renderUpdate(context,transform);
				render._renderUpdateWithCamera(context,transform);
				render._updateLoopCount=loopCount;
				render._updateCamera=camera;
				}else if (camera!==render._updateCamera){
				render._renderUpdateWithCamera(context,transform);
				render._updateCamera=camera;
			}
			if (geometry._prepareRender(context)){
				var subShader=material._shader.getSubShaderAt(0);
				var renderStates=material._renderStates;
				var passes;
				if (customShader){
					if (replacementTag){
						var oriTag=subShader.getFlag(replacementTag);
						if (oriTag){
							var customSubShaders=customShader._subShaders;
							for (var k=0,p=customSubShaders.length;k < p;k++){
								var customSubShader=customSubShaders[k];
								if (oriTag===customSubShader.getFlag(replacementTag)){
									passes=customSubShader._passes;
									break ;
								}
							}
							if (!passes)
								continue ;
							}else {
							continue ;
						}
						}else {
						passes=customShader.getSubShaderAt(0)._passes;
					}
					}else {
					passes=subShader._passes;
				}
				for (var j=0,m=passes.length;j < m;j++){
					var shaderPass=context.shader=passes[j].withCompile((scene._defineDatas.value)& (~material._disablePublicDefineDatas.value),render._defineDatas.value,material._defineDatas.value);
					var switchShader=shaderPass.bind();
					var switchShaderLoop=(loopCount!==shaderPass._uploadLoopCount);
					var uploadScene=(shaderPass._uploadScene!==scene)|| switchShaderLoop;
					if (uploadScene || switchShader){
						shaderPass.uploadUniforms(shaderPass._sceneUniformParamsMap,scene._shaderValues,uploadScene);
						shaderPass._uploadScene=scene;
					};
					var switchCamera=shaderPass._uploadCamera!==camera;
					var uploadSprite3D=(switchCamera || shaderPass._uploadRender!==render)|| switchShaderLoop;
					if (uploadSprite3D || switchShader){
						shaderPass.uploadUniforms(shaderPass._spriteUniformParamsMap,render._shaderValues,uploadSprite3D);
						shaderPass._uploadRender=render;
					};
					var uploadCamera=switchCamera || switchShaderLoop;
					if (uploadCamera || switchShader){
						shaderPass.uploadUniforms(shaderPass._cameraUniformParamsMap,camera._shaderValues,uploadCamera);
						shaderPass._uploadCamera=camera;
					};
					var uploadMaterial=(shaderPass._uploadMaterial!==material)|| switchShaderLoop;
					if (uploadMaterial || switchShader){
						shaderPass.uploadUniforms(shaderPass._materialUniformParamsMap,material._shaderValues,uploadMaterial);
						shaderPass._uploadMaterial=material;
					};
					var renderState=renderStates[j];
					if (lastStateRenderState!==renderState){
						renderState._setRenderStateBlendDepth();
						renderState._setRenderStateFrontFace(isTarget,transform);
						lastStateRenderState=renderState;
						lastStateRender=render;
						}else {
						if (lastStateRender!==render){
							renderState._setRenderStateFrontFace(isTarget,transform);
							lastStateRender=render;
						}
					}
					if (customShader)
						WebGLContext.setBlend(LayaGL.instance,false);
					geometry._render(context);
					shaderPass._uploadLoopCount=loopCount;
				}
			}
		}
	}

	/**
	*@private
	*/
	__proto.clear=function(){
		this.elements.length=0;
		this.lastTransparentRenderElement=null;
		this.lastTransparentBatched=false;
	}

	return RenderQueue;
})()


/**
*@private

*/
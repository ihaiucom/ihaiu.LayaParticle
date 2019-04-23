/**
*<code>Scene3D</code> 类用于实现场景。
*/
//class laya.d3.core.scene.Scene3D extends laya.display.Sprite
var Scene3D=(function(_super){
	function Scene3D(){
		/**@private */
		//this._url=null;
		/**@private */
		//this._group=null;
		/**@private */
		//this._lightmaps=null;
		/**@private */
		this._reflectionMode=1;
		/**@private */
		this._enableLightCount=3;
		/**@private */
		//this._renderTargetTexture=null;
		/**@private */
		//this._enableFog=false;
		/**@private */
		//this._physicsSimulation=null;
		/**@private */
		//this._shaderValues=null;
		/**@private */
		//this._defineDatas=null;
		/**是否启用灯光。*/
		this.enableLight=true;
		/**四/八叉树的根节点。*/
		//this.treeRoot=null;
		/**四/八叉树的尺寸。*/
		//this.treeSize=null;
		/**四/八叉树的层数。*/
		//this.treeLevel=0;
		//阴影相关变量
		//this.parallelSplitShadowMaps=null;
		this._time=0;
		/**@private [NATIVE]*/
		//this._glCommandEncoder=null;
		/**@private [NATIVE]*/
		//this._cullingBufferIndices=null;
		/**@private [NATIVE]*/
		//this._cullingBufferResult=null;
		Scene3D.__super.call(this);
		this._lights=[];
		this._skyRenderer=new SkyRenderer();
		this._input=new Input3D();
		this._timer=Laya.timer;
		this._collsionTestList=[];
		this._renders=new SimpleSingletonList();
		this._opaqueQueue=new RenderQueue(false);
		this._transparentQueue=new RenderQueue(true);
		this._cameraPool=[];
		this._animatorPool=new SimpleSingletonList();
		this._scriptPool=new SimpleSingletonList();
		this._castShadowRenders=new CastShadowList();
		this.currentCreationLayer=Math.pow(2,0);
		this._key=new SubmitKey();
		this._pickIdToSprite=new Object();
		if (Render.isConchApp){
			this._glCommandEncoder=LayaGL.instance.createCommandEncoder(102400,2560,false);
			this._conchData._int32Data[ /*laya.display.SpriteConst.POSLAYAGL3D*/26]=this._glCommandEncoder.getPtrID();
			this._renderType |=/*laya.display.SpriteConst.LAYAGL3D*/0x400;
			this._setRenderType(this._renderType);
			var callback=/*__JS__ */this._callbackFuncObj;
			if (!callback){
				callback=/*__JS__ */this._callbackFuncObj=new CallbackFuncObj();
			}
			this._conchData._int32Data[ /*laya.display.SpriteConst.POSCALLBACK_OBJ_ID*/54]=callback.id;
			callback.addCallbackFunc(3,(this.renderCallbackFromNative).bind(this));
			this._conchData._int32Data[ /*laya.display.SpriteConst.POSLAYA3D_FUN_ID*/62]=3;
		}
		if (Laya3D._enbalePhysics)
			this._physicsSimulation=new PhysicsSimulation(Laya3D.physicsSettings);
		this._lightmaps=[];
		this._defineDatas=new DefineDatas();
		this._shaderValues=new ShaderData(null);
		this.parallelSplitShadowMaps=[];
		this.enableFog=false;
		this.fogStart=300;
		this.fogRange=1000;
		this.fogColor=new Vector3(0.7,0.7,0.7);
		this.ambientColor=new Vector3(0.212,0.227,0.259);
		this.reflectionIntensity=1.0;
		(WebGL.shaderHighPrecision)&& (this._defineDatas.add(Shader3D.SHADERDEFINE_HIGHPRECISION));
		if (Render.isConchApp){
			this._cullingBufferIndices=new Int32Array(1024);
			this._cullingBufferResult=new Int32Array(1024);
		}
		this._shaderValues.setTexture(laya.d3.core.scene.Scene3D.RANGEATTENUATIONTEXTURE,ShaderInit3D._rangeAttenTex);
		this._scene=this;
		if (Laya3D._enbalePhysics && !PhysicsSimulation.disableSimulation)
			this._input.__init__(Render.canvas,this);
	}

	__class(Scene3D,'laya.d3.core.scene.Scene3D',_super);
	var __proto=Scene3D.prototype;
	Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true,"laya.resource.ICreateResource":true})
	/**
	*@private
	*[Editer]
	*/
	__proto._allotPickColorByID=function(id,pickColor){
		var pickColorR=Math.floor(id / (255 *255));
		id-=pickColorR *255 *255;
		var pickColorG=Math.floor(id / 255);
		id-=pickColorG *255;
		var pickColorB=id;
		var pickColore=pickColor.elements;
		pickColore[0]=pickColorR / 255;
		pickColore[1]=pickColorG / 255;
		pickColore[2]=pickColorB / 255;
		pickColore[3]=1.0;
	}

	/**
	*@private
	*[Editer]
	*/
	__proto._searchIDByPickColor=function(pickColor){
		var pickColore=pickColor.elements;
		var id=pickColore[0] *255 *255+pickColore[1] *255+pickColore[2];
		return id;
	}

	/**
	*@private
	*/
	__proto._setLightmapToChildNode=function(sprite){
		if ((sprite instanceof laya.d3.core.RenderableSprite3D ))
			(sprite)._render._applyLightMapParams();
		var children=sprite._children;
		for (var i=0,n=children.length;i < n;i++)
		this._setLightmapToChildNode(children[i]);
	}

	/**
	*@private
	*/
	__proto._update=function(){
		var delta=this.timer._delta / 1000;
		this._time+=delta;
		this._shaderValues.setNumber(laya.d3.core.scene.Scene3D.TIME,this._time);
		var simulation=this._physicsSimulation;
		if (Laya3D._enbalePhysics && !PhysicsSimulation.disableSimulation){
			simulation._updatePhysicsTransformFromRender();
			PhysicsComponent._addUpdateList=false;
			simulation._simulate(delta);
			simulation._updateCharacters();
			PhysicsComponent._addUpdateList=true;
			simulation._updateCollisions();
			simulation._eventScripts();
			this._input._update();
		}
		this._updateScript();
		Animator._update(this);
		this._lateUpdateScript();
	}

	/**
	*@private
	*/
	__proto._binarySearchIndexInCameraPool=function(camera){
		var start=0;
		var end=this._cameraPool.length-1;
		var mid=0;
		while (start <=end){
			mid=Math.floor((start+end)/ 2);
			var midValue=this._cameraPool[mid]._renderingOrder;
			if (midValue==camera._renderingOrder)
				return mid;
			else if (midValue > camera._renderingOrder)
			end=mid-1;
			else
			start=mid+1;
		}
		return start;
	}

	/**
	*@private
	*/
	__proto._setCreateURL=function(url){
		this._url=url;
	}

	/**
	*@private
	*/
	__proto._getGroup=function(){
		return this._group;
	}

	/**
	*@private
	*/
	__proto._setGroup=function(value){
		this._group=value;
	}

	/**
	*@private
	*/
	__proto._updateScript=function(){
		var pool=this._scriptPool;
		var elements=pool.elements;
		for (var i=0,n=pool.length;i < n;i++){
			var script=elements [i];
			(script && script.enabled)&& (script.onUpdate());
		}
	}

	/**
	*@private
	*/
	__proto._lateUpdateScript=function(){
		var pool=this._scriptPool;
		var elements=pool.elements;
		for (var i=0,n=pool.length;i < n;i++){
			var script=elements [i];
			(script && script.enabled)&& (script.onLateUpdate());
		}
	}

	/**
	*@private
	*/
	__proto._preRenderScript=function(){
		var pool=this._scriptPool;
		var elements=pool.elements;
		for (var i=0,n=pool.length;i < n;i++){
			var script=elements [i];
			(script && script.enabled)&& (script.onPreRender());
		}
	}

	/**
	*@private
	*/
	__proto._postRenderScript=function(){
		var pool=this._scriptPool;
		var elements=pool.elements;
		for (var i=0,n=pool.length;i < n;i++){
			var script=elements [i];
			(script && script.enabled)&& (script.onPostRender());
		}
	}

	/**
	*初始化八叉树。
	*@param width 八叉树宽度。
	*@param height 八叉树高度。
	*@param depth 八叉树深度。
	*@param center 八叉树中心点
	*@param level 八叉树层级。
	*/
	__proto.initOctree=function(width,height,depth,center,level){
		(level===void 0)&& (level=6);
		this.treeSize=new Vector3(width,height,depth);
		this.treeLevel=level;
		this.treeRoot=new OctreeNode(this,0);
		this.treeRoot.initRoot(center,this.treeSize);
	}

	/**
	*@private
	*/
	__proto._prepareSceneToRender=function(){
		var lightCount=this._lights.length;
		if (lightCount > 0){
			var renderLightCount=0;
			for (var i=0;i < lightCount;i++){
				if (!this._lights[i]._prepareToScene())
					continue ;
				renderLightCount++;
				if (renderLightCount >=this._enableLightCount)
					break ;
			}
		}
	}

	/**
	*@private
	*/
	__proto._addCamera=function(camera){
		var index=this._binarySearchIndexInCameraPool(camera);
		var order=camera._renderingOrder;
		var count=this._cameraPool.length;
		while (index < count && this._cameraPool[index]._renderingOrder <=order)
		index++;
		this._cameraPool.splice(index,0,camera);
	}

	/**
	*@private
	*/
	__proto._removeCamera=function(camera){
		this._cameraPool.splice(this._cameraPool.indexOf(camera),1);
	}

	/**
	*@private
	*/
	__proto._preCulling=function(context,camera){
		if (camera.useOcclusionCulling){
			FrustumCulling.renderObjectCulling(camera,this,context,this._renders);
			}else {
			FrustumCulling.renderObjectCulling(null,this,context,this._renders);
		}
	}

	/**
	*@private
	*/
	__proto._clear=function(gl,state){
		var viewport=state.viewport;
		var camera=state.camera;
		var renderTarget=camera.renderTarget;
		var vpW=viewport.width;
		var vpH=viewport.height;
		var vpX=viewport.x;
		var vpY=camera._canvasHeight-viewport.y-vpH;
		gl.viewport(vpX,vpY,vpW,vpH);
		var flag=/*laya.webgl.WebGLContext.DEPTH_BUFFER_BIT*/0x00000100;
		var clearFlag=camera.clearFlag;
		if (clearFlag===/*laya.d3.core.BaseCamera.CLEARFLAG_SKY*/1 && !(camera.skyRenderer._isAvailable()|| this._skyRenderer._isAvailable()))
			clearFlag=/*laya.d3.core.BaseCamera.CLEARFLAG_SOLIDCOLOR*/0;
		switch (clearFlag){
			case /*laya.d3.core.BaseCamera.CLEARFLAG_SOLIDCOLOR*/0:;
				var clearColor=camera.clearColor;
				if (clearColor){
					gl.enable(/*laya.webgl.WebGLContext.SCISSOR_TEST*/0x0C11);
					gl.scissor(vpX,vpY,vpW,vpH);
					var clearColorE=clearColor.elements;
					gl.clearColor(clearColorE[0],clearColorE[1],clearColorE[2],clearColorE[3]);
					flag |=/*laya.webgl.WebGLContext.COLOR_BUFFER_BIT*/0x00004000;
				}
				if (renderTarget){
					(clearColor)|| (flag=/*laya.webgl.WebGLContext.COLOR_BUFFER_BIT*/0x00004000);
				switch (renderTarget.depthStencilFormat){
					case /*laya.webgl.resource.BaseTexture.FORMAT_DEPTH_16*/0:
						flag |=/*laya.webgl.WebGLContext.DEPTH_BUFFER_BIT*/0x00000100;
						break ;
					case /*laya.webgl.resource.BaseTexture.FORMAT_STENCIL_8*/1:
						flag |=/*laya.webgl.WebGLContext.STENCIL_BUFFER_BIT*/0x00000400;
						break ;
					case /*laya.webgl.resource.BaseTexture.FORMAT_DEPTHSTENCIL_16_8*/2:
						flag |=/*laya.webgl.WebGLContext.DEPTH_BUFFER_BIT*/0x00000100;
						flag |=/*laya.webgl.WebGLContext.STENCIL_BUFFER_BIT*/0x00000400;
						break ;
					}
			}
			gl.clear(flag);
			if (clearColor)
				gl.disable(/*laya.webgl.WebGLContext.SCISSOR_TEST*/0x0C11);
			break ;
			case /*laya.d3.core.BaseCamera.CLEARFLAG_SKY*/1:
			case /*laya.d3.core.BaseCamera.CLEARFLAG_DEPTHONLY*/2:
			if (renderTarget){
				flag=/*laya.webgl.WebGLContext.COLOR_BUFFER_BIT*/0x00004000;
				switch (renderTarget.depthStencilFormat){
					case /*laya.webgl.resource.BaseTexture.FORMAT_DEPTH_16*/0:
						flag |=/*laya.webgl.WebGLContext.DEPTH_BUFFER_BIT*/0x00000100;
						break ;
					case /*laya.webgl.resource.BaseTexture.FORMAT_STENCIL_8*/1:
						flag |=/*laya.webgl.WebGLContext.STENCIL_BUFFER_BIT*/0x00000400;
						break ;
					case /*laya.webgl.resource.BaseTexture.FORMAT_DEPTHSTENCIL_16_8*/2:
						flag |=/*laya.webgl.WebGLContext.DEPTH_BUFFER_BIT*/0x00000100;
						flag |=/*laya.webgl.WebGLContext.STENCIL_BUFFER_BIT*/0x00000400
						break ;
					}
			}
			gl.clear(flag);
			break ;
			case /*laya.d3.core.BaseCamera.CLEARFLAG_NONE*/3:
			break ;
			default :
			throw new Error("BaseScene:camera clearFlag invalid.");
		}
	}

	/**
	*@private
	*/
	__proto._renderScene=function(gl,state,customShader,replacementTag){
		var camera=state.camera;
		var position=camera.transform.position;
		camera.renderTarget ? this._opaqueQueue._render(state,true,customShader,replacementTag):this._opaqueQueue._render(state,false,customShader,replacementTag);
		if (camera.clearFlag===/*laya.d3.core.BaseCamera.CLEARFLAG_SKY*/1){
			if (camera.skyRenderer._isAvailable())
				camera.skyRenderer._render(state);
			else if (this._skyRenderer._isAvailable())
			this._skyRenderer._render(state);
		}
		camera.renderTarget ? this._transparentQueue._render(state,true,customShader,replacementTag):this._transparentQueue._render(state,false,customShader,replacementTag);
	}

	/**
	*@inheritDoc
	*/
	__proto._parse=function(data){
		var lightMapsData=data.lightmaps;
		if (lightMapsData){
			var lightMapCount=lightMapsData.length;
			var lightmaps=this._lightmaps;
			lightmaps.length=lightMapCount;
			for (var i=0;i < lightMapCount;i++)
			lightmaps[i]=Loader.getRes(lightMapsData[i].path);
			this.setlightmaps(lightmaps);
		};
		var ambientColorData=data.ambientColor;
		if (ambientColorData){
			var ambCol=this.ambientColor;
			ambCol.fromArray(ambientColorData);
			this.ambientColor=ambCol;
		};
		var skyData=data.sky;
		if (skyData){
			this._skyRenderer.material=Loader.getRes(skyData.material.path);
			switch (skyData.mesh){
				case "SkyBox":
					this._skyRenderer.mesh=SkyBox.instance;
					break ;
				case "SkyDome":
					this._skyRenderer.mesh=SkyDome.instance;
					break ;
				default :
					this.skyRenderer.mesh=SkyBox.instance;
				}
		};
		var reflectionTextureData=data.reflectionTexture;
		reflectionTextureData && (this.customReflection=Loader.getRes(reflectionTextureData));
		this.enableFog=data.enableFog;
		this.fogStart=data.fogStart;
		this.fogRange=data.fogRange;
		var fogColorData=data.fogColor;
		if (fogColorData){
			var fogCol=this.fogColor;
			fogCol.fromArray(fogColorData);
			this.fogColor=fogCol;
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._onActive=function(){
		Laya.stage._scene3Ds.push(this);
	}

	/**
	*@inheritDoc
	*/
	__proto._onInActive=function(){
		var scenes=Laya.stage._scene3Ds;
		scenes.splice(scenes.indexOf(this),1);
	}

	/**
	*@private
	*/
	__proto._addLight=function(light){
		if (this._lights.indexOf(light)< 0)this._lights.push(light);
	}

	/**
	*@private
	*/
	__proto._removeLight=function(light){
		var index=this._lights.indexOf(light);
		index >=0 && (this._lights.splice(index,1));
	}

	/**
	*通过蒙版值获取蒙版是否显示。
	*@param mask 蒙版值。
	*@return 是否显示。
	*/
	__proto.isLayerVisible=function(layer,camera){
		return (Math.pow(2,layer)& camera.cullingMask)!=0;
	}

	/**
	*@private
	*/
	__proto.addTreeNode=function(renderObj){
		this.treeRoot.addTreeNode(renderObj);
	}

	/**
	*@private
	*/
	__proto.removeTreeNode=function(renderObj){
		if (!this.treeSize)return;
		if (renderObj._treeNode){
			renderObj._treeNode.removeObject(renderObj);
		}
	}

	/**
	*@private
	*/
	__proto._addRenderObject=function(render){
		if (this.treeRoot){
			this.addTreeNode(render);
			}else {
			this._renders.add(render);
			if (Render.isConchApp){
				var indexInList=render._getIndexInList();
				var length=this._cullingBufferIndices.length;
				if (indexInList >=length){
					var tempIndices=this._cullingBufferIndices;
					var tempResult=this._cullingBufferResult;
					this._cullingBufferIndices=new Int32Array(length+1024);
					this._cullingBufferResult=new Int32Array(length+1024);
					this._cullingBufferIndices.set(tempIndices,0);
					this._cullingBufferResult.set(tempResult,0);
				}
				this._cullingBufferIndices[indexInList]=render._cullingBufferIndex;
			}
		}
	}

	/**
	*@private
	*/
	__proto._removeRenderObject=function(render){
		if (this.treeRoot){
			this.removeTreeNode(render);
			}else {
			var endRender;
			if (Render.isConchApp){
				endRender=this._renders.elements [this._renders.length-1];
			}
			this._renders.remove(render);
			if (Render.isConchApp){
				this._cullingBufferIndices[endRender._getIndexInList()]=endRender._cullingBufferIndex;
			}
		}
	}

	/**
	*@private
	*/
	__proto._addShadowCastRenderObject=function(render){
		if (this.treeRoot){
			this.addTreeNode(render);
			}else {
			this._castShadowRenders.add(render);
		}
	}

	/**
	*@private
	*/
	__proto._removeShadowCastRenderObject=function(render){
		if (this.treeRoot){
			this.removeTreeNode(render);
			}else {
			this._castShadowRenders.remove(render);
		}
	}

	/**
	*@private
	*/
	__proto._getRenderQueue=function(index){
		if (index < /*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000)
			return this._opaqueQueue;
		else
		return this._transparentQueue;
	}

	/**
	*设置光照贴图。
	*@param value 光照贴图。
	*/
	__proto.setlightmaps=function(value){
		this._lightmaps=value;
		for (var i=0,n=this._children.length;i < n;i++)
		this._setLightmapToChildNode(this._children[i]);
	}

	/**
	*获取光照贴图。
	*@return 获取光照贴图。
	*/
	__proto.getlightmaps=function(){
		return this._lightmaps;
	}

	/**
	*@inheritDoc
	*/
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		if (this.destroyed)
			return;
		_super.prototype.destroy.call(this,destroyChild);
		this._skyRenderer.destroy();
		this._skyRenderer=null;
		this._lights=null;
		this._lightmaps=null;
		this._renderTargetTexture=null;
		this._shaderValues=null;
		this._renders=null;
		this._castShadowRenders=null;
		this._cameraPool=null;
		this.treeRoot=null;
		this.treeSize=null;
		this.parallelSplitShadowMaps=null;
		this._physicsSimulation && this._physicsSimulation._destroy();
		Loader.clearRes(this.url);
	}

	/**
	*@inheritDoc
	*/
	__proto.render=function(ctx,x,y){
		(ctx)._curSubmit=Submit.RENDERBASE;
		this._children.length > 0 && ctx.addRenderObject(this);
	}

	/**
	*@private
	*/
	__proto.renderSubmit=function(){
		var gl=LayaGL.instance;
		if (Render.isConchApp){
			if (this._glCommandEncoder)
				this._glCommandEncoder.clearEncoding();
			gl.beginCommandEncoding(this._glCommandEncoder);
		}
		this._prepareSceneToRender();
		var i=0,n=0,n1=0;
		for (i=0,n=this._cameraPool.length,n1=n-1;i < n;i++){
			if (Render.isConchApp)
				ShaderData.setRuntimeValueMode((i==n1)? true :false);
			var camera=this._cameraPool [i];
			camera.enableRender && camera.render();
		}
		if (Render.isConchApp){
			gl.endCommandEncoding();
			Buffer._bindedVertexBuffer=null;
			Buffer._bindedIndexBuffer=null;
		}
		WebGLContext2D.set2DRenderConfig();
		return 1;
	}

	/**
	*@private
	*/
	__proto.getRenderType=function(){
		return 0;
	}

	/**
	*@private
	*/
	__proto.releaseRender=function(){}
	/**
	*@private
	*/
	__proto.reUse=function(context,pos){
		return 0;
	}

	__proto.renderCallbackFromNative=function(){
		this._update();
		this.renderSubmit();
	}

	/**
	*@inheritDoc
	*/
	__proto.renderToNative=function(context,x,y){
		context.gl.block(this._conchData);
	}

	/**
	*设置雾化颜色。
	*@param value 雾化颜色。
	*/
	/**
	*获取雾化颜色。
	*@return 雾化颜色。
	*/
	__getset(0,__proto,'fogColor',function(){
		return this._shaderValues.getVector(laya.d3.core.scene.Scene3D.FOGCOLOR);
		},function(value){
		this._shaderValues.setVector(laya.d3.core.scene.Scene3D.FOGCOLOR,value);
	});

	/**
	*设置是否允许雾化。
	*@param value 是否允许雾化。
	*/
	/**
	*获取是否允许雾化。
	*@return 是否允许雾化。
	*/
	__getset(0,__proto,'enableFog',function(){
		return this._enableFog;
		},function(value){
		if (this._enableFog!==value){
			this._enableFog=value;
			if (value){
				this._defineDatas.add(laya.d3.core.scene.Scene3D.SHADERDEFINE_FOG);
			}else
			this._defineDatas.remove(laya.d3.core.scene.Scene3D.SHADERDEFINE_FOG);
		}
	});

	/**
	*获取资源的URL地址。
	*@return URL地址。
	*/
	__getset(0,__proto,'url',function(){
		return this._url;
	});

	/**
	*设置雾化起始位置。
	*@param value 雾化起始位置。
	*/
	/**
	*获取雾化起始位置。
	*@return 雾化起始位置。
	*/
	__getset(0,__proto,'fogStart',function(){
		return this._shaderValues.getNumber(laya.d3.core.scene.Scene3D.FOGSTART);
		},function(value){
		this._shaderValues.setNumber(laya.d3.core.scene.Scene3D.FOGSTART,value);
	});

	/**
	*设置反射强度。
	*@param 反射强度。
	*/
	/**
	*获取反射强度。
	*@return 反射强度。
	*/
	__getset(0,__proto,'reflectionIntensity',function(){
		return this._shaderValues.getNumber(laya.d3.core.scene.Scene3D.REFLETIONINTENSITY);
		},function(value){
		value=Math.max(Math.min(value,1.0),0.0);
		this._shaderValues.setNumber(laya.d3.core.scene.Scene3D.REFLETIONINTENSITY,value);
	});

	/**
	*获取天空渲染器。
	*@return 天空渲染器。
	*/
	__getset(0,__proto,'skyRenderer',function(){
		return this._skyRenderer;
	});

	/**
	*设置雾化范围。
	*@param value 雾化范围。
	*/
	/**
	*获取雾化范围。
	*@return 雾化范围。
	*/
	__getset(0,__proto,'fogRange',function(){
		return this._shaderValues.getNumber(laya.d3.core.scene.Scene3D.FOGRANGE);
		},function(value){
		this._shaderValues.setNumber(laya.d3.core.scene.Scene3D.FOGRANGE,value);
	});

	/**
	*设置环境光颜色。
	*@param value 环境光颜色。
	*/
	/**
	*获取环境光颜色。
	*@return 环境光颜色。
	*/
	__getset(0,__proto,'ambientColor',function(){
		return this._shaderValues.getVector(laya.d3.core.scene.Scene3D.AMBIENTCOLOR);
		},function(value){
		this._shaderValues.setVector(laya.d3.core.scene.Scene3D.AMBIENTCOLOR,value);
	});

	/**
	*设置反射贴图。
	*@param 反射贴图。
	*/
	/**
	*获取反射贴图。
	*@return 反射贴图。
	*/
	__getset(0,__proto,'customReflection',function(){
		return this._shaderValues.getTexture(laya.d3.core.scene.Scene3D.REFLECTIONTEXTURE);
		},function(value){
		this._shaderValues.setTexture(laya.d3.core.scene.Scene3D.REFLECTIONTEXTURE,value);
		if (value)
			this._defineDatas.add(laya.d3.core.scene.Scene3D.SHADERDEFINE_REFLECTMAP);
		else
		this._defineDatas.remove(laya.d3.core.scene.Scene3D.SHADERDEFINE_REFLECTMAP);
	});

	/**
	*获取物理模拟器。
	*@return 物理模拟器。
	*/
	__getset(0,__proto,'physicsSimulation',function(){
		return this._physicsSimulation;
	});

	/**
	*设置反射模式。
	*@param value 反射模式。
	*/
	/**
	*获取反射模式。
	*@return 反射模式。
	*/
	__getset(0,__proto,'reflectionMode',function(){
		return this._reflectionMode;
		},function(value){
		this._reflectionMode=value;
	});

	/**
	*设置场景时钟。
	*/
	/**
	*获取场景时钟。
	*/
	__getset(0,__proto,'timer',function(){
		return this._timer;
		},function(value){
		this._timer=value;
	});

	/**
	*获取输入。
	*@return 输入。
	*/
	__getset(0,__proto,'input',function(){
		return this._input;
	});

	Scene3D._parse=function(data,propertyParams,constructParams){
		var json=data.data;
		var outBatchSprits=[];
		var scene=Utils3D._createNodeByJson(json,outBatchSprits);
		StaticBatchManager.combine(null,outBatchSprits);
		return scene;
	}

	Scene3D.load=function(url,complete){
		Laya.loader.create(url,complete,null,/*Laya3D.HIERARCHY*/"HIERARCHY");
	}

	Scene3D.REFLECTIONMODE_SKYBOX=0;
	Scene3D.REFLECTIONMODE_CUSTOM=1;
	Scene3D.SHADERDEFINE_FOG=0;
	Scene3D.SHADERDEFINE_DIRECTIONLIGHT=0;
	Scene3D.SHADERDEFINE_POINTLIGHT=0;
	Scene3D.SHADERDEFINE_SPOTLIGHT=0;
	Scene3D.SHADERDEFINE_CAST_SHADOW=0;
	Scene3D.SHADERDEFINE_SHADOW_PSSM1=0;
	Scene3D.SHADERDEFINE_SHADOW_PSSM2=0;
	Scene3D.SHADERDEFINE_SHADOW_PSSM3=0;
	Scene3D.SHADERDEFINE_SHADOW_PCF_NO=0;
	Scene3D.SHADERDEFINE_SHADOW_PCF1=0;
	Scene3D.SHADERDEFINE_SHADOW_PCF2=0;
	Scene3D.SHADERDEFINE_SHADOW_PCF3=0;
	Scene3D.SHADERDEFINE_REFLECTMAP=0;
	__static(Scene3D,
	['FOGCOLOR',function(){return this.FOGCOLOR=Shader3D.propertyNameToID("u_FogColor");},'FOGSTART',function(){return this.FOGSTART=Shader3D.propertyNameToID("u_FogStart");},'FOGRANGE',function(){return this.FOGRANGE=Shader3D.propertyNameToID("u_FogRange");},'LIGHTDIRECTION',function(){return this.LIGHTDIRECTION=Shader3D.propertyNameToID("u_DirectionLight.Direction");},'LIGHTDIRCOLOR',function(){return this.LIGHTDIRCOLOR=Shader3D.propertyNameToID("u_DirectionLight.Color");},'POINTLIGHTPOS',function(){return this.POINTLIGHTPOS=Shader3D.propertyNameToID("u_PointLight.Position");},'POINTLIGHTRANGE',function(){return this.POINTLIGHTRANGE=Shader3D.propertyNameToID("u_PointLight.Range");},'POINTLIGHTATTENUATION',function(){return this.POINTLIGHTATTENUATION=Shader3D.propertyNameToID("u_PointLight.Attenuation");},'POINTLIGHTCOLOR',function(){return this.POINTLIGHTCOLOR=Shader3D.propertyNameToID("u_PointLight.Color");},'SPOTLIGHTPOS',function(){return this.SPOTLIGHTPOS=Shader3D.propertyNameToID("u_SpotLight.Position");},'SPOTLIGHTDIRECTION',function(){return this.SPOTLIGHTDIRECTION=Shader3D.propertyNameToID("u_SpotLight.Direction");},'SPOTLIGHTSPOTANGLE',function(){return this.SPOTLIGHTSPOTANGLE=Shader3D.propertyNameToID("u_SpotLight.Spot");},'SPOTLIGHTRANGE',function(){return this.SPOTLIGHTRANGE=Shader3D.propertyNameToID("u_SpotLight.Range");},'SPOTLIGHTCOLOR',function(){return this.SPOTLIGHTCOLOR=Shader3D.propertyNameToID("u_SpotLight.Color");},'SHADOWDISTANCE',function(){return this.SHADOWDISTANCE=Shader3D.propertyNameToID("u_shadowPSSMDistance");},'SHADOWLIGHTVIEWPROJECT',function(){return this.SHADOWLIGHTVIEWPROJECT=Shader3D.propertyNameToID("u_lightShadowVP");},'SHADOWMAPPCFOFFSET',function(){return this.SHADOWMAPPCFOFFSET=Shader3D.propertyNameToID("u_shadowPCFoffset");},'SHADOWMAPTEXTURE1',function(){return this.SHADOWMAPTEXTURE1=Shader3D.propertyNameToID("u_shadowMap1");},'SHADOWMAPTEXTURE2',function(){return this.SHADOWMAPTEXTURE2=Shader3D.propertyNameToID("u_shadowMap2");},'SHADOWMAPTEXTURE3',function(){return this.SHADOWMAPTEXTURE3=Shader3D.propertyNameToID("u_shadowMap3");},'AMBIENTCOLOR',function(){return this.AMBIENTCOLOR=Shader3D.propertyNameToID("u_AmbientColor");},'REFLECTIONTEXTURE',function(){return this.REFLECTIONTEXTURE=Shader3D.propertyNameToID("u_ReflectTexture");},'REFLETIONINTENSITY',function(){return this.REFLETIONINTENSITY=Shader3D.propertyNameToID("u_ReflectIntensity");},'TIME',function(){return this.TIME=Shader3D.propertyNameToID("u_Time");},'ANGLEATTENUATIONTEXTURE',function(){return this.ANGLEATTENUATIONTEXTURE=Shader3D.propertyNameToID("u_AngleTexture");},'RANGEATTENUATIONTEXTURE',function(){return this.RANGEATTENUATIONTEXTURE=Shader3D.propertyNameToID("u_RangeTexture");},'POINTLIGHTMATRIX',function(){return this.POINTLIGHTMATRIX=Shader3D.propertyNameToID("u_PointLightMatrix");},'SPOTLIGHTMATRIX',function(){return this.SPOTLIGHTMATRIX=Shader3D.propertyNameToID("u_SpotLightMatrix");}
	]);
	return Scene3D;
})(Sprite)


/**

*/
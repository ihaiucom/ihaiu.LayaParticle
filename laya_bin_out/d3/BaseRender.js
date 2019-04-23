/**
*<code>Render</code> 类用于渲染器的父类，抽象类不允许实例。
*/
//class laya.d3.core.render.BaseRender extends laya.events.EventDispatcher
var BaseRender=(function(_super){
	function BaseRender(owner){
		/**@private */
		//this._id=0;
		/**@private */
		//this._lightmapScaleOffset=null;
		/**@private */
		//this._lightmapIndex=0;
		/**@private */
		//this._receiveShadow=false;
		/**@private */
		//this._materialsInstance=null;
		/**@private */
		//this._castShadow=false;
		/**@private [实现IListPool接口]*/
		this._indexInList=-1;
		/**@private */
		this._indexInCastShadowList=-1;
		/**@private */
		//this._boundingSphere=null;
		/**@private */
		//this._boundingBox=null;
		/**@private */
		//this._boundingBoxCenter=null;
		/**@private */
		//this._boundingSphereNeedChange=false;
		/**@private */
		//this._boundingBoxNeedChange=false;
		/**@private */
		//this._boundingBoxCenterNeedChange=false;
		/**@private */
		//this._octreeNodeNeedChange=false;
		/**@private */
		//this._enable=false;
		/**@private */
		//this._shaderValues=null;
		/**@private */
		//this._defineDatas=null;
		/**@private */
		//this._materials=null;
		/**@private */
		//this._scene=null;
		/**@private */
		//this._owner=null;
		/**@private */
		//this._renderElements=null;
		/**@private */
		//this._distanceForSort=NaN;
		/**@private */
		this._visible=true;
		/**@private */
		//this._treeNode=null;
		/**@private */
		//this._updateLoopCount=0;
		/**@private */
		//this._updateCamera=null;
		/**@private */
		this._isPartOfStaticBatch=false;
		/**@private */
		this._staticBatch=null;
		/**排序矫正值。*/
		//this.sortingFudge=NaN;
		/**@private [NATIVE]*/
		//this._cullingBufferIndex=0;
		BaseRender.__super.call(this);
		this._id=++BaseRender._uniqueIDCounter;
		this._indexInCastShadowList=-1;
		this._boundingBox=new BoundBox(new Vector3(),new Vector3());
		this._boundingBoxCenter=new Vector3();
		this._boundingSphere=new BoundSphere(new Vector3(),0);
		if (Render.isConchApp){
			var length=FrustumCulling._cullingBufferLength;
			this._cullingBufferIndex=length;
			var cullingBuffer=FrustumCulling._cullingBuffer;
			var resizeLength=length+5;
			if (resizeLength >=cullingBuffer.length){
				var temp=cullingBuffer;
				cullingBuffer=FrustumCulling._cullingBuffer=new Float32Array(cullingBuffer.length+4096);
				cullingBuffer.set(temp,0);
			}
			cullingBuffer[length]=1;
			FrustumCulling._cullingBufferLength=resizeLength;
		}
		this._boundingSphereNeedChange=true;
		this._boundingBoxNeedChange=true;
		this._boundingBoxCenterNeedChange=true;
		this._octreeNodeNeedChange=true;
		this._materials=[];
		this._renderElements=[];
		this._owner=owner;
		this._enable=true;
		this._materialsInstance=[];
		this._shaderValues=new ShaderData(null);
		this._defineDatas=new DefineDatas();
		this.lightmapIndex=-1;
		this._castShadow=false;
		this.receiveShadow=false;
		this.sortingFudge=0.0;
		(owner)&& (this._owner.transform.on(/*laya.events.Event.TRANSFORM_CHANGED*/"transformchanged",this,this._onWorldMatNeedChange));
	}

	__class(BaseRender,'laya.d3.core.render.BaseRender',_super);
	var __proto=BaseRender.prototype;
	Laya.imps(__proto,{"laya.resource.ISingletonElement":true})
	/**
	*@private
	*/
	__proto._changeMaterialReference=function(lastValue,value){
		(lastValue)&& (lastValue._removeReference());
		value._addReference();
	}

	/**
	*@private
	*/
	__proto._getInstanceMaterial=function(material,index){
		var insMat=/*__JS__ */new material.constructor();
		material.cloneTo(insMat);
		insMat.name=insMat.name+"(Instance)";
		this._materialsInstance[index]=true;
		this._changeMaterialReference(this._materials[index],insMat);
		this._materials[index]=insMat;
		return insMat;
	}

	/**
	*@private
	*/
	__proto._applyLightMapParams=function(){
		if (this._scene && this._lightmapIndex >=0){
			var lightMaps=this._scene.getlightmaps();
			if (this._lightmapIndex < lightMaps.length){
				this._defineDatas.add(RenderableSprite3D.SAHDERDEFINE_LIGHTMAP);
				this._shaderValues.setTexture(RenderableSprite3D.LIGHTMAP,lightMaps[this._lightmapIndex]);
				}else {
				this._defineDatas.remove(RenderableSprite3D.SAHDERDEFINE_LIGHTMAP);
			}
			}else {
			this._defineDatas.remove(RenderableSprite3D.SAHDERDEFINE_LIGHTMAP);
		}
	}

	/**
	*@private
	*/
	__proto._onWorldMatNeedChange=function(){
		this._boundingSphereNeedChange=true;
		this._boundingBoxNeedChange=true;
		this._boundingBoxCenterNeedChange=true;
		this._octreeNodeNeedChange=true;
	}

	/**
	*@private
	*/
	__proto._renderRenderableBoundBox=function(){}
	/**
	*@private
	*/
	__proto._calculateBoundingSphere=function(){
		throw("BaseRender: must override it.");
	}

	/**
	*@private
	*/
	__proto._calculateBoundingBox=function(){
		throw("BaseRender: must override it.");
	}

	/**
	*@private [实现ISingletonElement接口]
	*/
	__proto._getIndexInList=function(){
		return this._indexInList;
	}

	/**
	*@private [实现ISingletonElement接口]
	*/
	__proto._setIndexInList=function(index){
		this._indexInList=index;
	}

	/**
	*@private
	*/
	__proto._setBelongScene=function(scene){
		if (this._scene!==scene){
			this._scene=scene;
			this._applyLightMapParams();
		}
	}

	/**
	*@private
	*@param boundFrustum 如果boundFrustum为空则为摄像机不裁剪模式。
	*/
	__proto._needRender=function(boundFrustum){
		return true;
	}

	/**
	*@private
	*逐精灵执行。
	*/
	__proto._renderUpdate=function(context,transform){}
	/**
	*@private
	*逐精灵和相机执行。
	*/
	__proto._renderUpdateWithCamera=function(context,transform){}
	/**
	*@private
	*/
	__proto._updateOctreeNode=function(){
		var treeNode=this._treeNode;
		if (treeNode && this._octreeNodeNeedChange){
			treeNode.updateObject(this);
			this._octreeNodeNeedChange=false;
		}
	}

	/**
	*@private
	*/
	__proto._destroy=function(){
		this.offAll();
		var i=0,n=0;
		for (i=0,n=this._renderElements.length;i < n;i++)
		this._renderElements[i].destroy();
		for (i=0,n=this._materials.length;i < n;i++)
		(this._materials[i].destroyed)|| (this._materials[i]._removeReference());
		this._renderElements=null;
		this._owner=null;
		this._materials=null;
		this._boundingBox=null;
		this._boundingBoxCenter=null;
		this._boundingSphere=null;
		this._lightmapScaleOffset=null;
	}

	/**
	*获取包围球,只读,不允许修改其值。
	*@return 包围球。
	*/
	__getset(0,__proto,'boundingSphere',function(){
		if (this._boundingSphereNeedChange){
			this._calculateBoundingSphere();
			this._boundingSphereNeedChange=false;
		}
		return this._boundingSphere;
	});

	/**
	*获取唯一标识ID,通常用于识别。
	*/
	__getset(0,__proto,'id',function(){
		return this._id;
	});

	/**
	*设置第一个实例材质。
	*@param value 第一个实例材质。
	*/
	/**
	*返回第一个实例材质,第一次使用会拷贝实例对象。
	*@return 第一个实例材质。
	*/
	__getset(0,__proto,'material',function(){
		var material=this._materials[0];
		if (material && !this._materialsInstance[0]){
			var insMat=this._getInstanceMaterial(material,0);
			var renderElement=this._renderElements[0];
			(renderElement)&& (renderElement.material=insMat);
		}
		return this._materials[0];
		},function(value){
		this.sharedMaterial=value;
	});

	/**
	*是否是静态的一部分。
	*/
	__getset(0,__proto,'isPartOfStaticBatch',function(){
		return this._isPartOfStaticBatch;
	});

	/**
	*设置第一个材质。
	*@param value 第一个材质。
	*/
	/**
	*返回第一个材质。
	*@return 第一个材质。
	*/
	__getset(0,__proto,'sharedMaterial',function(){
		return this._materials[0];
		},function(value){
		var lastValue=this._materials[0];
		if (lastValue!==value){
			this._materials[0]=value;
			this._materialsInstance[0]=false;
			this._changeMaterialReference(lastValue,value);
			var renderElement=this._renderElements[0];
			(renderElement)&& (renderElement.material=value);
		}
	});

	/**
	*设置光照贴图的索引。
	*@param value 光照贴图的索引。
	*/
	/**
	*获取光照贴图的索引。
	*@return 光照贴图的索引。
	*/
	__getset(0,__proto,'lightmapIndex',function(){
		return this._lightmapIndex;
		},function(value){
		if (this._lightmapIndex!==value){
			this._lightmapIndex=value;
			this._applyLightMapParams();
		}
	});

	/**
	*设置光照贴图的缩放和偏移。
	*@param 光照贴图的缩放和偏移。
	*/
	/**
	*获取光照贴图的缩放和偏移。
	*@return 光照贴图的缩放和偏移。
	*/
	__getset(0,__proto,'lightmapScaleOffset',function(){
		return this._lightmapScaleOffset;
		},function(value){
		this._lightmapScaleOffset=value;
		this._shaderValues.setVector(RenderableSprite3D.LIGHTMAPSCALEOFFSET,value);
		this._defineDatas.add(RenderableSprite3D.SHADERDEFINE_SCALEOFFSETLIGHTINGMAPUV);
	});

	/**
	*设置是否产生阴影。
	*@param value 是否产生阴影。
	*/
	/**
	*获取是否产生阴影。
	*@return 是否产生阴影。
	*/
	__getset(0,__proto,'castShadow',function(){
		return this._castShadow;
		},function(value){
		if (this._castShadow!==value){
			if (this._owner.activeInHierarchy){
				if (value)
					this._scene._addShadowCastRenderObject(this);
				else
				this._scene._removeShadowCastRenderObject(this);
			}
			this._castShadow=value;
		}
	});

	/**
	*设置是否可用。
	*@param value 是否可用。
	*/
	/**
	*获取是否可用。
	*@return 是否可用。
	*/
	__getset(0,__proto,'enable',function(){
		return this._enable;
		},function(value){
		this._enable=!!value;
	});

	/**
	*设置实例材质列表。
	*@param value 实例材质列表。
	*/
	/**
	*获取潜拷贝实例材质列表,第一次使用会拷贝实例对象。
	*@return 浅拷贝实例材质列表。
	*/
	__getset(0,__proto,'materials',function(){
		for (var i=0,n=this._materials.length;i < n;i++){
			if (!this._materialsInstance[i]){
				var insMat=this._getInstanceMaterial(this._materials[i],i);
				var renderElement=this._renderElements[i];
				(renderElement)&& (renderElement.material=insMat);
			}
		}
		return this._materials.slice();
		},function(value){
		this.sharedMaterials=value;
	});

	/**
	*设置材质列表。
	*@param value 材质列表。
	*/
	/**
	*获取浅拷贝材质列表。
	*@return 浅拷贝材质列表。
	*/
	__getset(0,__proto,'sharedMaterials',function(){
		var materials=this._materials.slice();
		return materials;
		},function(value){
		if (!value)
			throw new Error("BaseRender: shadredMaterials value can't be null.");
		var len=value.length;
		this._materialsInstance.length=len;
		for (var i=0;i < len;i++){
			var lastValue=this._materials[i];
			if (lastValue!==value[i]){
				this._materialsInstance[i]=false;
				this._changeMaterialReference(lastValue,value[i]);
				var renderElement=this._renderElements[i];
				(renderElement)&& (renderElement.material=value[i]);
			}
		}
		this._materials=value;
	});

	/**
	*获取包围盒,只读,不允许修改其值。
	*@return 包围盒。
	*/
	__getset(0,__proto,'boundingBox',function(){
		if (this._boundingBoxNeedChange){
			this._calculateBoundingBox();
			this._boundingBoxNeedChange=false;
		}
		return this._boundingBox;
	});

	/**
	*获取包围盒中心,不允许修改其值。
	*@return 包围盒中心。
	*/
	__getset(0,__proto,'boundingBoxCenter',function(){
		if (this._boundingBoxCenterNeedChange){
			var boundBox=this.boundingBox;
			Vector3.add(boundBox.min,boundBox.max,this._boundingBoxCenter);
			Vector3.scale(this._boundingBoxCenter,0.5,this._boundingBoxCenter);
			this._boundingBoxCenterNeedChange=false;
		}
		return this._boundingBoxCenter;
	});

	/**
	*设置是否接收阴影属性
	*/
	/**
	*获得是否接收阴影属性
	*/
	__getset(0,__proto,'receiveShadow',function(){
		return this._receiveShadow;
		},function(value){
		if (this._receiveShadow!==value){
			this._receiveShadow=value;
			if (value)
				this._defineDatas.add(RenderableSprite3D.SHADERDEFINE_RECEIVE_SHADOW);
			else
			this._defineDatas.remove(RenderableSprite3D.SHADERDEFINE_RECEIVE_SHADOW);
		}
	});

	BaseRender._uniqueIDCounter=0;
	__static(BaseRender,
	['_tempBoundBoxCorners',function(){return this._tempBoundBoxCorners=/*new vector.<>*/[new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3()];},'_greenColor',function(){return this._greenColor=new Vector4(0.0,1.0,0.0,1.0);}
	]);
	return BaseRender;
})(EventDispatcher)


/**

*/
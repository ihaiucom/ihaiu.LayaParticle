/**
*<code>MeshSprite3D</code> 类用于创建网格。
*/
//class laya.d3.core.MeshSprite3D extends laya.d3.core.RenderableSprite3D
var MeshSprite3D=(function(_super){
	function MeshSprite3D(mesh,name){
		/**@private */
		//this._meshFilter=null;
		MeshSprite3D.__super.call(this,name);
		this._meshFilter=new MeshFilter(this);
		this._render=new MeshRenderer(this);
		(mesh)&& (this._meshFilter.sharedMesh=mesh);
	}

	__class(MeshSprite3D,'laya.d3.core.MeshSprite3D',_super);
	var __proto=MeshSprite3D.prototype;
	/**
	*@inheritDoc
	*/
	__proto._parse=function(data){
		laya.d3.core.Sprite3D.prototype._parse.call(this,data);
		var render=this.meshRenderer;
		var lightmapIndex=data.lightmapIndex;
		(lightmapIndex !=null)&& (render.lightmapIndex=lightmapIndex);
		var lightmapScaleOffsetArray=data.lightmapScaleOffset;
		(lightmapScaleOffsetArray)&& (render.lightmapScaleOffset=new Vector4(lightmapScaleOffsetArray[0],lightmapScaleOffsetArray[1],lightmapScaleOffsetArray[2],lightmapScaleOffsetArray[3]));
		(data.meshPath!=undefined)&& (this.meshFilter.sharedMesh=Loader.getRes(data.meshPath));
		(data.enableRender!=undefined)&& (this.meshRenderer.enable=data.enableRender);
		var materials=data.materials;
		if (materials){
			var sharedMaterials=render.sharedMaterials;
			var materialCount=materials.length;
			sharedMaterials.length=materialCount;
			for (var i=0;i < materialCount;i++){
				sharedMaterials[i]=Loader.getRes(materials[i].path);
			}
			render.sharedMaterials=sharedMaterials;
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._addToInitStaticBatchManager=function(){
		MeshRenderStaticBatchManager.instance._addBatchSprite(this);
	}

	/**
	*@inheritDoc
	*/
	__proto.cloneTo=function(destObject){
		var meshSprite3D=destObject;
		meshSprite3D._meshFilter.sharedMesh=this._meshFilter.sharedMesh;
		var meshRender=this._render;
		var destMeshRender=meshSprite3D._render;
		destMeshRender.enable=meshRender.enable;
		destMeshRender.sharedMaterials=meshRender.sharedMaterials;
		destMeshRender.castShadow=meshRender.castShadow;
		var lightmapScaleOffset=meshRender.lightmapScaleOffset;
		lightmapScaleOffset && (destMeshRender.lightmapScaleOffset=lightmapScaleOffset.clone());
		destMeshRender.lightmapIndex=meshRender.lightmapIndex;
		destMeshRender.receiveShadow=meshRender.receiveShadow;
		destMeshRender.sortingFudge=meshRender.sortingFudge;
		laya.d3.core.Sprite3D.prototype.cloneTo.call(this,destObject);
	}

	/**
	*@inheritDoc
	*/
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		if (this.destroyed)
			return;
		_super.prototype.destroy.call(this,destroyChild);
		this._meshFilter.destroy();
	}

	/**
	*获取网格过滤器。
	*@return 网格过滤器。
	*/
	__getset(0,__proto,'meshFilter',function(){
		return this._meshFilter;
	});

	/**
	*获取网格渲染器。
	*@return 网格渲染器。
	*/
	__getset(0,__proto,'meshRenderer',function(){
		return this._render;
	});

	MeshSprite3D.__init__=function(){
		MeshSprite3D.SHADERDEFINE_UV0=MeshSprite3D.shaderDefines.registerDefine("UV");
		MeshSprite3D.SHADERDEFINE_COLOR=MeshSprite3D.shaderDefines.registerDefine("COLOR");
		MeshSprite3D.SHADERDEFINE_UV1=MeshSprite3D.shaderDefines.registerDefine("UV1");
		StaticBatchManager._registerManager(MeshRenderStaticBatchManager.instance);
		DynamicBatchManager._registerManager(MeshRenderDynamicBatchManager.instance);
	}

	MeshSprite3D.SHADERDEFINE_UV0=0;
	MeshSprite3D.SHADERDEFINE_COLOR=0;
	MeshSprite3D.SHADERDEFINE_UV1=0;
	__static(MeshSprite3D,
	['shaderDefines',function(){return this.shaderDefines=new ShaderDefines(RenderableSprite3D.shaderDefines);}
	]);
	return MeshSprite3D;
})(RenderableSprite3D)


/**

*/
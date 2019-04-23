/**
*<code>SkinnedMeshSprite3D</code> 类用于创建网格。
*/
//class laya.d3.core.SkinnedMeshSprite3D extends laya.d3.core.RenderableSprite3D
var SkinnedMeshSprite3D=(function(_super){
	function SkinnedMeshSprite3D(mesh,name){
		/**@private */
		//this._meshFilter=null;
		SkinnedMeshSprite3D.__super.call(this,name);
		this._meshFilter=new MeshFilter(this);
		this._render=new SkinnedMeshRenderer(this);
		(mesh)&& (this._meshFilter.sharedMesh=mesh);
	}

	__class(SkinnedMeshSprite3D,'laya.d3.core.SkinnedMeshSprite3D',_super);
	var __proto=SkinnedMeshSprite3D.prototype;
	/**
	*@inheritDoc
	*/
	__proto._parse=function(data){
		laya.d3.core.Sprite3D.prototype._parse.call(this,data);
		var render=this.skinnedMeshRenderer;
		var lightmapIndex=data.lightmapIndex;
		(lightmapIndex !=null)&& (render.lightmapIndex=lightmapIndex);
		var lightmapScaleOffsetArray=data.lightmapScaleOffset;
		(lightmapScaleOffsetArray)&& (render.lightmapScaleOffset=new Vector4(lightmapScaleOffsetArray[0],lightmapScaleOffsetArray[1],lightmapScaleOffsetArray[2],lightmapScaleOffsetArray[3]));
		var meshPath;
		meshPath=data.meshPath;
		if (meshPath){
			var mesh=Loader.getRes(meshPath);
			(mesh)&&(this.meshFilter.sharedMesh=mesh);
		};
		var materials=data.materials;
		if (materials){
			var sharedMaterials=render.sharedMaterials;
			var materialCount=materials.length;
			sharedMaterials.length=materialCount;
			for (var i=0;i < materialCount;i++){
				sharedMaterials[i]=Loader.getRes(materials[i].path);
			}
			render.sharedMaterials=sharedMaterials;
		};
		var rootBone=data.rootBone;
		(rootBone)&& (render._setRootBone(rootBone));
		var boundBox=data.boundBox;
		var min=boundBox.min;
		var max=boundBox.max;
		var localBoundBox=new BoundBox(new Vector3(min[0],min[1],min[2]),new Vector3(max[0],max[1],max[2]));
		render.localBoundBox=localBoundBox;
		var boundSphere=data.boundSphere;
		if (boundSphere){
			var center=boundSphere.center;
			var localBoundSphere=new BoundSphere(new Vector3(center[0],center[1],center[2]),boundSphere.radius);
			render.localBoundSphere=localBoundSphere;
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._changeHierarchyAnimator=function(animator){
		var lastAnimator=this._hierarchyAnimator;
		lastAnimator && (lastAnimator.unLinkSprite3DToAvatarNode(this));
		_super.prototype._changeHierarchyAnimator.call(this,animator);
		if (animator && this.skinnedMeshRenderer._rootBone)
			animator.linkSprite3DToAvatarNode(this.skinnedMeshRenderer._rootBone,this);
		this.skinnedMeshRenderer._setCacheAnimator(animator);
	}

	/**
	*@inheritDoc
	*/
	__proto._changeAnimatorAvatar=function(avatar){
		this.skinnedMeshRenderer._setCacheAvatar(avatar);
	}

	/**
	*@inheritDoc
	*/
	__proto.cloneTo=function(destObject){
		var meshSprite3D=destObject;
		meshSprite3D.meshFilter.sharedMesh=this.meshFilter.sharedMesh;
		var meshRender=this._render;
		var destMeshRender=meshSprite3D._render;
		destMeshRender.enable=meshRender.enable;
		destMeshRender.sharedMaterials=meshRender.sharedMaterials;
		destMeshRender.castShadow=meshRender.castShadow;
		var lightmapScaleOffset=meshRender.lightmapScaleOffset;
		lightmapScaleOffset && (destMeshRender.lightmapScaleOffset=lightmapScaleOffset.clone());
		destMeshRender.receiveShadow=meshRender.receiveShadow;
		destMeshRender.sortingFudge=meshRender.sortingFudge;
		destMeshRender._rootBone=meshRender._rootBone;
		var lbp=meshRender.localBoundSphere;
		(lbp)&& (destMeshRender.localBoundSphere=lbp.clone());
		var lbb=meshRender.localBoundBox;
		(lbb)&& (destMeshRender.localBoundBox=lbb.clone());
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
	__getset(0,__proto,'skinnedMeshRenderer',function(){
		return this._render;
	});

	SkinnedMeshSprite3D.__init__=function(){
		SkinnedMeshSprite3D.SHADERDEFINE_BONE=SkinnedMeshSprite3D.shaderDefines.registerDefine("BONE");
	}

	SkinnedMeshSprite3D.SHADERDEFINE_BONE=0;
	__static(SkinnedMeshSprite3D,
	['BONES',function(){return this.BONES=Shader3D.propertyNameToID("u_Bones");},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines(MeshSprite3D.shaderDefines);}
	]);
	return SkinnedMeshSprite3D;
})(RenderableSprite3D)


/**

*/
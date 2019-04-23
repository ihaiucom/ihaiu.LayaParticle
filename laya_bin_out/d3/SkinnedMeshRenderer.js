/**
*<code>SkinMeshRenderer</code> 类用于蒙皮渲染器。
*/
//class laya.d3.core.SkinnedMeshRenderer extends laya.d3.core.MeshRenderer
var SkinnedMeshRenderer=(function(_super){
	function SkinnedMeshRenderer(owner){
		/**@private */
		//this._cacheAvatar=null;
		/**@private */
		//this._cacheMesh=null;
		/**@private */
		//this._cacheAnimationNode=null;
		/**@private */
		//this._skinnedData=null;
		/**@private */
		//this._skinnedDataLoopMarks=null;
		/**@private */
		//this._localBoundingBoxCorners=null;
		/**@private */
		//this._localBoundBox=null;
		/**@private */
		//this._cacheAnimator=null;
		/**@private */
		//this._rootBone=null;
		/**用于裁剪的包围球。 */
		//this.localBoundSphere=null;
		/**@private [NATIVE]*/
		//this._cacheAnimationNodeIndices=null;
		SkinnedMeshRenderer.__super.call(this,owner);
		this._skinnedDataLoopMarks=[];
		this._cacheAnimationNode=[];
		this._localBoundingBoxCorners=__newvec(8,null);
	}

	__class(SkinnedMeshRenderer,'laya.d3.core.SkinnedMeshRenderer',_super);
	var __proto=SkinnedMeshRenderer.prototype;
	/**
	*@private
	*/
	__proto._getCacheAnimationNodes=function(){
		var meshBoneNames=this._cacheMesh._boneNames;
		var bindPoseIndices=this._cacheMesh._bindPoseIndices;
		var innerBindPoseCount=bindPoseIndices.length;
		if (!Render.isConchApp){
			this._cacheAnimationNode.length=innerBindPoseCount;
			var nodeMap=this._cacheAnimator._avatarNodeMap;
			for (var i=0;i < innerBindPoseCount;i++){
				var node=nodeMap[meshBoneNames[bindPoseIndices[i]]];
				this._cacheAnimationNode[i]=node;
			}
			}else {
			this._cacheAnimationNodeIndices=new Uint16Array(innerBindPoseCount);
			var nodeMapC=this._cacheAnimator._avatarNodeMap;
			for (i=0;i < innerBindPoseCount;i++){
				var nodeC=nodeMapC[meshBoneNames[bindPoseIndices[i]]];
				this._cacheAnimationNodeIndices[i]=nodeC._worldMatrixIndex;
			}
		}
	}

	/**
	*@private
	*/
	__proto._computeBoneIndexToMeshWithAsyncAvatar=function(){
		this._computeBoneIndexToMeshWithAsyncMesh();
	}

	/**
	*@private
	*/
	__proto._computeBoneIndexToMeshWithAsyncMesh=function(){
		this._getCacheAnimationNodes();
	}

	/**
	*@private
	*/
	__proto._computeSkinnedData=function(){
		if (this._cacheMesh && this._cacheAvatar){
			var bindPoses=this._cacheMesh._inverseBindPoses;
			var bindPoseInices=this._cacheMesh._bindPoseIndices;
			var pathMarks=this._cacheMesh._skinDataPathMarks;
			for (var i=0,n=this._cacheMesh.subMeshCount;i < n;i++){
				var subBoneIndices=(this._cacheMesh._getSubMesh(i))._boneIndicesList;
				var subData=this._skinnedData[i];
				for (var j=0,m=subBoneIndices.length;j < m;j++){
					var boneIndices=subBoneIndices[j];
					if (Render.isConchApp)
						this._computeSubSkinnedDataNative(this._cacheAnimator._animationNodeWorldMatrixs,this._cacheAnimationNodeIndices,this._cacheMesh._inverseBindPosesBuffer,boneIndices,bindPoseInices,subData[j]);
					else
					this._computeSubSkinnedData(bindPoses,boneIndices,bindPoseInices,subData[j],pathMarks);
				}
				(this._renderElements [i]).skinnedDatas=subData;
			}
		}
	}

	/**
	*@private
	*/
	__proto._computeSubSkinnedData=function(bindPoses,boneIndices,bindPoseInices,data,pathMarks){
		for (var k=0,q=boneIndices.length;k < q;k++){
			var index=boneIndices[k];
			if (this._skinnedDataLoopMarks[index]===Stat.loopCount){
				var p=pathMarks[index];
				var preData=this._skinnedData[p[0]][p[1]];
				var srcIndex=p[2] *16;
				var dstIndex=k *16;
				for (var d=0;d < 16;d++)
				data[dstIndex+d]=preData[srcIndex+d];
				}else {
				Utils3D._mulMatrixArray(this._cacheAnimationNode[index].transform.getWorldMatrix(),bindPoses[bindPoseInices[index]],data,k *16);
				this._skinnedDataLoopMarks[index]=Stat.loopCount;
			}
		}
	}

	/**
	*@private
	*/
	__proto._onMeshChange=function(value){
		_super.prototype._onMeshChange.call(this,value);
		this._cacheMesh=value;
		var subMeshCount=value.subMeshCount;
		this._skinnedData=__newvec(subMeshCount);
		this._skinnedDataLoopMarks.length=(value)._bindPoseIndices.length;
		for (var i=0;i < subMeshCount;i++){
			var subBoneIndices=(value._getSubMesh(i))._boneIndicesList;
			var subCount=subBoneIndices.length;
			var subData=this._skinnedData[i]=__newvec(subCount);
			for (var j=0;j < subCount;j++)
			subData[j]=new Float32Array(subBoneIndices[j].length *16);
		}
		(this._cacheAvatar && value)&& (this._computeBoneIndexToMeshWithAsyncAvatar());
	}

	/**
	*@private
	*/
	__proto._setCacheAnimator=function(animator){
		this._cacheAnimator=animator;
	}

	/**
	*@private
	*/
	__proto._setRootBone=function(name){
		this._rootBone=name;
	}

	/**
	*@private
	*/
	__proto._setCacheAvatar=function(value){
		if (this._cacheAvatar!==value){
			if (this._cacheMesh){
				this._cacheAvatar=value;
				if (value){
					this._defineDatas.add(SkinnedMeshSprite3D.SHADERDEFINE_BONE);
					this._computeBoneIndexToMeshWithAsyncAvatar();
				}
				}else {
				this._cacheAvatar=value;
			}
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._calculateBoundingBox=function(){
		if (this._cacheAnimator){
			if (this._localBoundBox==null)
				this._boundingBox.toDefault();
			else
			this._calculateBoundBoxByInitCorners(this._localBoundingBoxCorners);
			}else {
			_super.prototype._calculateBoundingBox.call(this);
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._calculateBoundingSphere=function(){
		if (this._cacheAnimator){
			if (this.localBoundSphere==null)
				this._boundingSphere.toDefault();
			else
			this._calculateBoundingSphereByInitSphere(this.localBoundSphere);
			}else {
			_super.prototype._calculateBoundingSphere.call(this);
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._updateOctreeNode=function(){
		var treeNode=this._treeNode;
		if (treeNode){
			treeNode.updateObject(this);
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._renderUpdate=function(context,transform){
		if (this._cacheAnimator){
			this._computeSkinnedData();
			var aniOwnerTransParent=(this._cacheAnimator.owner)._transform._parent;
			var worldMat=aniOwnerTransParent ? aniOwnerTransParent.worldMatrix :Matrix4x4.DEFAULT;
			this._shaderValues.setMatrix4x4(Sprite3D.WORLDMATRIX,worldMat);
			}else {
			this._shaderValues.setMatrix4x4(Sprite3D.WORLDMATRIX,transform.worldMatrix);
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._renderUpdateWithCamera=function(context,transform){
		var projectionView=context.projectionViewMatrix;
		if (this._cacheAnimator){
			var aniOwnerTransParent=(this._cacheAnimator.owner)._transform._parent;
			var worldMat=aniOwnerTransParent ? aniOwnerTransParent.worldMatrix :Matrix4x4.DEFAULT;
			Matrix4x4.multiply(projectionView,worldMat,this._projectionViewWorldMatrix);
			}else {
			Matrix4x4.multiply(projectionView,transform.worldMatrix,this._projectionViewWorldMatrix);
		}
		this._shaderValues.setMatrix4x4(Sprite3D.MVPMATRIX,this._projectionViewWorldMatrix);
		if (Laya3D.debugMode)
			this._renderRenderableBoundBox();
	}

	/**
	*@private [NATIVE]
	*/
	__proto._computeSubSkinnedDataNative=function(worldMatrixs,cacheAnimationNodeIndices,inverseBindPosesBuffer,boneIndices,bindPoseInices,data){
		LayaGL.instance.computeSubSkinnedData(worldMatrixs,cacheAnimationNodeIndices,inverseBindPosesBuffer,boneIndices,bindPoseInices,data);
	}

	/**
	*设置包围球。
	*@param value
	*/
	/**
	*获取包围球。
	*@return 包围球。
	*/
	__getset(0,__proto,'localBoundBox',function(){
		return this._localBoundBox;
		},function(value){
		this._localBoundBox=value;
		value.getCorners(this._localBoundingBoxCorners);
	});

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'boundingBoxCenter',function(){
		var boundBox=this.boundingBox;
		Vector3.add(boundBox.min,boundBox.max,this._boundingBoxCenter);
		Vector3.scale(this._boundingBoxCenter,0.5,this._boundingBoxCenter);
		return this._boundingBoxCenter;
	});

	return SkinnedMeshRenderer;
})(MeshRenderer)


/**

*/
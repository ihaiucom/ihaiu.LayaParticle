/**
*<code>MeshRenderer</code> 类用于网格渲染器。
*/
//class laya.d3.core.MeshRenderer extends laya.d3.core.render.BaseRender
var MeshRenderer=(function(_super){
	function MeshRenderer(owner){
		/**@private */
		//this._projectionViewWorldMatrix=null;
		MeshRenderer.__super.call(this,owner);
		this._projectionViewWorldMatrix=new Matrix4x4();
	}

	__class(MeshRenderer,'laya.d3.core.MeshRenderer',_super);
	var __proto=MeshRenderer.prototype;
	/**
	*@private
	*/
	__proto._onMeshChange=function(mesh){
		this._boundingSphereNeedChange=true;
		this._boundingBoxNeedChange=true;
		this._boundingBoxCenterNeedChange=true;
		this._octreeNodeNeedChange=true;
	}

	/**
	*@private
	*/
	__proto._calculateBoundingSphereByInitSphere=function(boundSphere){
		var maxScale=NaN;
		var transform=this._owner.transform;
		var scaleE=transform.scale.elements;
		var scaleX=scaleE[0];
		scaleX || (scaleX=-scaleX);
		var scaleY=scaleE[1];
		scaleY || (scaleY=-scaleY);
		var scaleZ=scaleE[2];
		scaleZ || (scaleZ=-scaleZ);
		if (scaleX >=scaleY && scaleX >=scaleZ)
			maxScale=scaleX;
		else
		maxScale=scaleY >=scaleZ ? scaleY :scaleZ;
		Vector3.transformCoordinate(boundSphere.center,transform.worldMatrix,this._boundingSphere.center);
		this._boundingSphere.radius=boundSphere.radius *maxScale;
		if (Render.isConchApp){
			var centerE=this._boundingSphere.center.elements;
			var buffer=FrustumCulling._cullingBuffer;
			buffer[this._cullingBufferIndex+1]=centerE[0];
			buffer[this._cullingBufferIndex+2]=centerE[1];
			buffer[this._cullingBufferIndex+3]=centerE[2];
			buffer[this._cullingBufferIndex+4]=this._boundingSphere.radius;
		}
	}

	/**
	*@private
	*/
	__proto._calculateBoundBoxByInitCorners=function(corners){
		var worldMat=(this._owner).transform.worldMatrix;
		for (var i=0;i < 8;i++)
		BoundBox.createfromPoints(BaseRender._tempBoundBoxCorners,this._boundingBox);
		Vector3.transformCoordinate(corners[i],worldMat,BaseRender._tempBoundBoxCorners[i]);
	}

	/**
	*@inheritDoc
	*/
	__proto._calculateBoundingSphere=function(){
		var sharedMesh=(this._owner).meshFilter.sharedMesh;
		if (sharedMesh==null || sharedMesh.boundingSphere==null)
			this._boundingSphere.toDefault();
		else
		this._calculateBoundingSphereByInitSphere(sharedMesh.boundingSphere);
	}

	/**
	*@inheritDoc
	*/
	__proto._calculateBoundingBox=function(){
		var sharedMesh=(this._owner).meshFilter.sharedMesh;
		if (sharedMesh==null || sharedMesh.boundingBox==null)
			this._boundingBox.toDefault();
		else
		this._calculateBoundBoxByInitCorners(sharedMesh.boundingBoxCorners);
	}

	/**
	*@inheritDoc
	*/
	__proto._needRender=function(boundFrustum){
		if (boundFrustum)
			return boundFrustum.containsBoundSphere(this.boundingSphere)!==/*laya.d3.math.ContainmentType.Disjoint*/0;
		else
		return true;
	}

	/**
	*@inheritDoc
	*/
	__proto._renderUpdate=function(context,transform){
		if (transform)
			this._shaderValues.setMatrix4x4(Sprite3D.WORLDMATRIX,transform.worldMatrix);
		else
		this._shaderValues.setMatrix4x4(Sprite3D.WORLDMATRIX,Matrix4x4.DEFAULT);
	}

	/**
	*@inheritDoc
	*/
	__proto._renderUpdateWithCamera=function(context,transform){
		var projectionView=context.projectionViewMatrix;
		if (transform){
			Matrix4x4.multiply(projectionView,transform.worldMatrix,this._projectionViewWorldMatrix);
			this._shaderValues.setMatrix4x4(Sprite3D.MVPMATRIX,this._projectionViewWorldMatrix);
			}else {
			this._shaderValues.setMatrix4x4(Sprite3D.MVPMATRIX,projectionView);
		}
		if (Laya3D.debugMode)
			this._renderRenderableBoundBox();
	}

	/**
	*@inheritDoc
	*/
	__proto._destroy=function(){
		(this._isPartOfStaticBatch)&& (MeshRenderStaticBatchManager.instance._destroyRenderSprite(this._owner));
		_super.prototype._destroy.call(this);
	}

	return MeshRenderer;
})(BaseRender)


/**

*/
/**
*<code>MeshRender</code> 类用于网格渲染器。
*/
//class laya.d3.terrain.TerrainRender extends laya.d3.core.render.BaseRender
var TerrainRender=(function(_super){
	function TerrainRender(owner){
		/**@private */
		this._terrainSprite3DOwner=null;
		/**@private */
		this._projectionViewWorldMatrix=null;
		TerrainRender.__super.call(this,owner);
		this._terrainSprite3DOwner=owner;
		this._projectionViewWorldMatrix=new Matrix4x4();
	}

	__class(TerrainRender,'laya.d3.terrain.TerrainRender',_super);
	var __proto=TerrainRender.prototype;
	__proto._calculateBoundingSphere=function(){
		var terrainFilter=this._terrainSprite3DOwner.terrainFilter;
		if (terrainFilter==null){
			this._boundingSphere.toDefault();
			}else {
			var meshBoundingSphere=terrainFilter._boundingSphere;
			var maxScale=NaN;
			var transform=this._terrainSprite3DOwner.transform;
			var scale=transform.scale;
			if (scale.x >=scale.y && scale.x >=scale.z)
				maxScale=scale.x;
			else
			maxScale=scale.y >=scale.z ? scale.y :scale.z;
			Vector3.transformCoordinate(meshBoundingSphere.center,transform.worldMatrix,this._boundingSphere.center);
			this._boundingSphere.radius=meshBoundingSphere.radius *maxScale;
			terrainFilter.calcLeafBoudingSphere(transform.worldMatrix,maxScale);
			if (Render.isConchApp){
				var centerE=this._boundingSphere.center.elements;
				var buffer=FrustumCulling._cullingBuffer;
				buffer[this._cullingBufferIndex+1]=centerE[0];
				buffer[this._cullingBufferIndex+2]=centerE[1];
				buffer[this._cullingBufferIndex+3]=centerE[2];
				buffer[this._cullingBufferIndex+4]=this._boundingSphere.radius;
			}
		}
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
	__proto._calculateBoundingBox=function(){
		var terrainFilter=this._terrainSprite3DOwner.terrainFilter;
		if (terrainFilter==null){
			this._boundingBox.toDefault();
			}else {
			var worldMat=this._terrainSprite3DOwner.transform.worldMatrix;
			var corners=terrainFilter._boundingBoxCorners;
			for (var i=0;i < 8;i++)
			Vector3.transformCoordinate(corners[i],worldMat,BaseRender._tempBoundBoxCorners[i]);
			BoundBox.createfromPoints(BaseRender._tempBoundBoxCorners,this._boundingBox);
			terrainFilter.calcLeafBoudingBox(worldMat);
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._renderUpdate=function(context,transform){
		this._shaderValues.setMatrix4x4(Sprite3D.WORLDMATRIX,transform.worldMatrix);
	}

	/**
	*@inheritDoc
	*/
	__proto._renderUpdateWithCamera=function(context,transform){
		var projectionView=context.projectionViewMatrix;
		Matrix4x4.multiply(projectionView,transform.worldMatrix,this._projectionViewWorldMatrix);
		this._shaderValues.setMatrix4x4(Sprite3D.MVPMATRIX,this._projectionViewWorldMatrix);
	}

	/**
	*@private
	*/
	__proto._destroy=function(){
		_super.prototype._destroy.call(this);
		this._terrainSprite3DOwner=null;
	}

	return TerrainRender;
})(BaseRender)


/**

*/
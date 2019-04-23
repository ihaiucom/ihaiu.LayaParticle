/**
*<code>MeshColliderShape</code> 类用于创建网格碰撞器。
*/
//class laya.d3.physics.shape.MeshColliderShape extends laya.d3.physics.shape.ColliderShape
var MeshColliderShape=(function(_super){
	function MeshColliderShape(){
		/**@private */
		this._mesh=null;
		/**@private */
		this._convex=false;
		MeshColliderShape.__super.call(this);
	}

	__class(MeshColliderShape,'laya.d3.physics.shape.MeshColliderShape',_super);
	var __proto=MeshColliderShape.prototype;
	/**
	*@inheritDoc
	*/
	__proto._setScale=function(value){
		if (this._compoundParent){
			this.updateLocalTransformations();
			}else {
			var valueE=value.elements;
			ColliderShape._nativeScale.setValue(valueE[0],valueE[1],valueE[2]);
			this._nativeShape.setLocalScaling(ColliderShape._nativeScale);
			this._nativeShape.updateBound();
		}
	}

	/**
	*@inheritDoc
	*/
	__proto.cloneTo=function(destObject){
		var destMeshCollider=destObject;
		destMeshCollider.convex=this._convex;
		destMeshCollider.mesh=this._mesh;
		_super.prototype.cloneTo.call(this,destObject);
	}

	/**
	*@inheritDoc
	*/
	__proto.clone=function(){
		var dest=new MeshColliderShape();
		this.cloneTo(dest);
		return dest;
	}

	/**
	*@inheritDoc
	*/
	__proto.destroy=function(){
		if (this._nativeShape){
			var physics3D=Laya3D._physics3D;
			physics3D.destroy(this._nativeShape);
			this._nativeShape=null;
		}
	}

	/**
	*设置网格。
	*@param 网格。
	*/
	/**
	*获取网格。
	*@return 网格。
	*/
	__getset(0,__proto,'mesh',function(){
		return this._mesh;
		},function(value){
		if (this._mesh!==value){
			var physics3D=Laya3D._physics3D;
			if (this._mesh){
				physics3D.destroy(this._nativeShape);
			}
			if (value){
				this._nativeShape=new physics3D.btGImpactMeshShape(value._getPhysicMesh());
				this._nativeShape.updateBound();
			}
			this._mesh=value;
		}
	});

	/**
	*设置是否使用凸多边形。
	*@param value 是否使用凸多边形。
	*/
	/**
	*获取是否使用凸多边形。
	*@return 是否使用凸多边形。
	*/
	__getset(0,__proto,'convex',function(){
		return this._convex;
		},function(value){
		this._convex=value;
	});

	return MeshColliderShape;
})(ColliderShape)


/**

*/
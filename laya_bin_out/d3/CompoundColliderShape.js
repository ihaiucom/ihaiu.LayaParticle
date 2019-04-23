/**
*<code>CompoundColliderShape</code> 类用于创建盒子形状碰撞器。
*/
//class laya.d3.physics.shape.CompoundColliderShape extends laya.d3.physics.shape.ColliderShape
var CompoundColliderShape=(function(_super){
	function CompoundColliderShape(){
		CompoundColliderShape.__super.call(this);
		this._childColliderShapes=[];
		this._type=/*laya.d3.physics.shape.ColliderShape.SHAPETYPES_COMPOUND*/5;
		this._nativeShape=new Laya3D._physics3D.btCompoundShape();
	}

	__class(CompoundColliderShape,'laya.d3.physics.shape.CompoundColliderShape',_super);
	var __proto=CompoundColliderShape.prototype;
	/**
	*@private
	*/
	__proto._clearChildShape=function(shape){
		shape._attatched=false;
		shape._compoundParent=null;
		shape._indexInCompound=-1;
	}

	/**
	*@inheritDoc
	*/
	__proto._addReference=function(){}
	/**
	*@inheritDoc
	*/
	__proto._removeReference=function(){}
	/**
	*@private
	*/
	__proto._updateChildTransform=function(shape){
		var offsetE=shape.localOffset.elements;
		var rotationE=shape.localRotation.elements;
		var nativeOffset=ColliderShape._nativeVector30;
		var nativeQuaternion=ColliderShape._nativQuaternion0;
		var nativeTransform=ColliderShape._nativeTransform0;
		nativeOffset.setValue(-offsetE[0],offsetE[1],offsetE[2]);
		nativeQuaternion.setValue(-rotationE[0],rotationE[1],rotationE[2],-rotationE[3]);
		nativeTransform.setOrigin(nativeOffset);
		nativeTransform.setRotation(nativeQuaternion);
		this._nativeShape.updateChildTransform(shape._indexInCompound,nativeTransform,true);
	}

	/**
	*添加子碰撞器形状。
	*@param shape 子碰撞器形状。
	*/
	__proto.addChildShape=function(shape){
		if (shape._attatched)
			throw "CompoundColliderShape: this shape has attatched to other entity.";
		shape._attatched=true;
		shape._compoundParent=this;
		shape._indexInCompound=this._childColliderShapes.length;
		this._childColliderShapes.push(shape);
		var offsetE=shape.localOffset.elements;
		var rotationE=shape.localRotation.elements;
		CompoundColliderShape._nativeOffset.setValue(-offsetE[0],offsetE[1],offsetE[2]);
		CompoundColliderShape._nativRotation.setValue(-rotationE[0],rotationE[1],rotationE[2],-rotationE[3]);
		CompoundColliderShape._nativeTransform.setOrigin(CompoundColliderShape._nativeOffset);
		CompoundColliderShape._nativeTransform.setRotation(CompoundColliderShape._nativRotation);
		var nativeScale=this._nativeShape.getLocalScaling();
		this._nativeShape.setLocalScaling(CompoundColliderShape._nativeVector3One);
		this._nativeShape.addChildShape(CompoundColliderShape._nativeTransform,shape._nativeShape);
		this._nativeShape.setLocalScaling(nativeScale);
		(this._attatchedCollisionObject)&& (this._attatchedCollisionObject.colliderShape=this);
	}

	/**
	*移除子碰撞器形状。
	*@param shape 子碰撞器形状。
	*/
	__proto.removeChildShape=function(shape){
		if (shape._compoundParent===this){
			var index=shape._indexInCompound;
			this._clearChildShape(shape);
			var endShape=this._childColliderShapes[this._childColliderShapes.length-1];
			endShape._indexInCompound=index;
			this._childColliderShapes[index]=endShape;
			this._childColliderShapes.pop();
			this._nativeShape.removeChildShapeByIndex(index);
		}
	}

	/**
	*清空子碰撞器形状。
	*/
	__proto.clearChildShape=function(){
		for (var i=0,n=this._childColliderShapes.length;i < n;i++){
			this._clearChildShape(this._childColliderShapes[i]);
			this._nativeShape.removeChildShapeByIndex(0);
		}
		this._childColliderShapes.length=0;
	}

	/**
	*获取子形状数量。
	*@return
	*/
	__proto.getChildShapeCount=function(){
		return this._childColliderShapes.length;
	}

	/**
	*@inheritDoc
	*/
	__proto.cloneTo=function(destObject){
		var destCompoundColliderShape=destObject;
		destCompoundColliderShape.clearChildShape();
		for (var i=0,n=this._childColliderShapes.length;i < n;i++)
		destCompoundColliderShape.addChildShape(this._childColliderShapes[i].clone());
	}

	/**
	*@inheritDoc
	*/
	__proto.clone=function(){
		var dest=new CompoundColliderShape();
		this.cloneTo(dest);
		return dest;
	}

	/**
	*@inheritDoc
	*/
	__proto.destroy=function(){
		_super.prototype.destroy.call(this);
		for (var i=0,n=this._childColliderShapes.length;i < n;i++){
			var childShape=this._childColliderShapes[i];
			if (childShape._referenceCount===0)
				childShape.destroy();
		}
	}

	__static(CompoundColliderShape,
	['_nativeVector3One',function(){return this._nativeVector3One=new Laya3D._physics3D.btVector3(1,1,1);},'_nativeTransform',function(){return this._nativeTransform=new Laya3D._physics3D.btTransform();},'_nativeOffset',function(){return this._nativeOffset=new Laya3D._physics3D.btVector3(0,0,0);},'_nativRotation',function(){return this._nativRotation=new Laya3D._physics3D.btQuaternion(0,0,0,1);}
	]);
	return CompoundColliderShape;
})(ColliderShape)


/**

*/
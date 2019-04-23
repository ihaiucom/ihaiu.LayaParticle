/**
*<code>SphereColliderShape</code> 类用于创建球形碰撞器。
*/
//class laya.d3.physics.shape.SphereColliderShape extends laya.d3.physics.shape.ColliderShape
var SphereColliderShape=(function(_super){
	function SphereColliderShape(radius){
		/**@private */
		//this._radius=NaN;
		SphereColliderShape.__super.call(this);
		(radius===void 0)&& (radius=0.5);
		this._radius=radius;
		this._type=/*laya.d3.physics.shape.ColliderShape.SHAPETYPES_SPHERE*/1;
		this._nativeShape=new Laya3D._physics3D.btSphereShape(radius);
	}

	__class(SphereColliderShape,'laya.d3.physics.shape.SphereColliderShape',_super);
	var __proto=SphereColliderShape.prototype;
	/**
	*@inheritDoc
	*/
	__proto.clone=function(){
		var dest=new SphereColliderShape(this._radius);
		this.cloneTo(dest);
		return dest;
	}

	/**
	*获取半径。
	*/
	__getset(0,__proto,'radius',function(){
		return this._radius;
	});

	return SphereColliderShape;
})(ColliderShape)


/**

*/
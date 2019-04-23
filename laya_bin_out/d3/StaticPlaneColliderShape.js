/**
*<code>StaticPlaneColliderShape</code> 类用于创建静态平面碰撞器。
*/
//class laya.d3.physics.shape.StaticPlaneColliderShape extends laya.d3.physics.shape.ColliderShape
var StaticPlaneColliderShape=(function(_super){
	function StaticPlaneColliderShape(normal,offset){
		/**@private */
		//this._offset=NaN;
		/**@private */
		//this._normal=null;
		StaticPlaneColliderShape.__super.call(this);
		this._normal=normal;
		this._offset=offset;
		this._type=/*laya.d3.physics.shape.ColliderShape.SHAPETYPES_STATICPLANE*/6;
		StaticPlaneColliderShape._nativeNormal.setValue(-normal.x,normal.y,normal.z);
		this._nativeShape=new Laya3D._physics3D.btStaticPlaneShape(StaticPlaneColliderShape._nativeNormal,offset);
	}

	__class(StaticPlaneColliderShape,'laya.d3.physics.shape.StaticPlaneColliderShape',_super);
	var __proto=StaticPlaneColliderShape.prototype;
	/**
	*@inheritDoc
	*/
	__proto.clone=function(){
		var dest=new StaticPlaneColliderShape(this._normal,this._offset);
		this.cloneTo(dest);
		return dest;
	}

	__static(StaticPlaneColliderShape,
	['_nativeNormal',function(){return this._nativeNormal=new Laya3D._physics3D.btVector3(0,0,0);}
	]);
	return StaticPlaneColliderShape;
})(ColliderShape)


/**

*/
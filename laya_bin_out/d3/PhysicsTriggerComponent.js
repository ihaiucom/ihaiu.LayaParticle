/**
*<code>PhysicsTriggerComponent</code> 类用于创建物理触发器组件。
*/
//class laya.d3.physics.PhysicsTriggerComponent extends laya.d3.physics.PhysicsComponent
var PhysicsTriggerComponent=(function(_super){
	function PhysicsTriggerComponent(collisionGroup,canCollideWith){
		/**@private */
		this._isTrigger=false;
		PhysicsTriggerComponent.__super.call(this,collisionGroup,canCollideWith);
	}

	__class(PhysicsTriggerComponent,'laya.d3.physics.PhysicsTriggerComponent',_super);
	var __proto=PhysicsTriggerComponent.prototype;
	/**
	*@inheritDoc
	*/
	__proto._onAdded=function(){
		_super.prototype._onAdded.call(this);
		this.isTrigger=this._isTrigger;
	}

	/**
	*@inheritDoc
	*/
	__proto._cloneTo=function(dest){
		_super.prototype._cloneTo.call(this,dest);
		(dest).isTrigger=this._isTrigger;
	}

	/**
	*设置是否为触发器。
	*@param value 是否为触发器。
	*/
	/**
	*获取是否为触发器。
	*@return 是否为触发器。
	*/
	__getset(0,__proto,'isTrigger',function(){
		return this._isTrigger;
		},function(value){
		this._isTrigger=value;
		if (this._nativeColliderObject){
			if (this._enabled && value){
				var flags=this._nativeColliderObject.getCollisionFlags();
				if ((flags & 4)===0)
					this._nativeColliderObject.setCollisionFlags(flags | 4);
			}
		}
	});

	return PhysicsTriggerComponent;
})(PhysicsComponent)


/**

*/
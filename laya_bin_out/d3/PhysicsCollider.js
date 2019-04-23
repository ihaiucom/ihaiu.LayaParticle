/**
*<code>PhysicsCollider</code> 类用于创建物理碰撞器。
*/
//class laya.d3.physics.PhysicsCollider extends laya.d3.physics.PhysicsTriggerComponent
var PhysicsCollider=(function(_super){
	/**
	*创建一个 <code>PhysicsCollider</code> 实例。
	*@param collisionGroup 所属碰撞组。
	*@param canCollideWith 可产生碰撞的碰撞组。
	*/
	function PhysicsCollider(collisionGroup,canCollideWith){
		(collisionGroup===void 0)&& (collisionGroup=/*laya.d3.utils.Physics3DUtils.COLLISIONFILTERGROUP_DEFAULTFILTER*/0x1);
		(canCollideWith===void 0)&& (canCollideWith=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER);
		PhysicsCollider.__super.call(this,collisionGroup,canCollideWith);
	}

	__class(PhysicsCollider,'laya.d3.physics.PhysicsCollider',_super);
	var __proto=PhysicsCollider.prototype;
	/**
	*@inheritDoc
	*/
	__proto._addToSimulation=function(){
		this._simulation._addPhysicsCollider(this,this._collisionGroup,this._canCollideWith);
	}

	/**
	*@inheritDoc
	*/
	__proto._removeFromSimulation=function(){
		this._simulation._removePhysicsCollider(this);
	}

	/**
	*@inheritDoc
	*/
	__proto._parse=function(data){
		(data.friction !=null)&& (this.friction=data.friction);
		(data.rollingFriction !=null)&& (this.rollingFriction=data.rollingFriction);
		(data.restitution !=null)&& (this.restitution=data.restitution);
		(data.isTrigger !=null)&& (this.isTrigger=data.isTrigger);
		laya.d3.physics.PhysicsComponent.prototype._parse.call(this,data);
		this._parseShape(data.shapes);
	}

	/**
	*@inheritDoc
	*/
	__proto._onAdded=function(){
		var physics3D=Laya3D._physics3D;
		var btColObj=new physics3D.btCollisionObject();
		btColObj.setUserIndex(this.id);
		btColObj.forceActivationState(5);
		var flags=btColObj.getCollisionFlags();
		if ((this.owner).isStatic){
			if ((flags & 2)> 0)
				flags=flags ^ 2;
			flags=flags | 1;
			}else {
			if ((flags & 1)> 0)
				flags=flags ^ 1;
			flags=flags | 2;
		}
		btColObj.setCollisionFlags(flags);
		this._nativeColliderObject=btColObj;
		_super.prototype._onAdded.call(this);
	}

	return PhysicsCollider;
})(PhysicsTriggerComponent)


/**

*/
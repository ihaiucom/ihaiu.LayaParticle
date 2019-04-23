/**
*<code>CollisionMap</code> 类用于实现碰撞组合实例图。
*/
//class laya.d3.physics.CollisionTool
var CollisionTool=(function(){
	function CollisionTool(){
		/**@private */
		this._hitResultsPoolIndex=0;
		/**@private */
		this._contactPonintsPoolIndex=0;
		/**@private */
		this._collisions={};
		this._hitResultsPool=[];
		this._contactPointsPool=[];
		this._collisionsPool=[];
	}

	__class(CollisionTool,'laya.d3.physics.CollisionTool');
	var __proto=CollisionTool.prototype;
	/**
	*@private
	*/
	__proto.getHitResult=function(){
		var hitResult=this._hitResultsPool[this._hitResultsPoolIndex++];
		if (!hitResult){
			hitResult=new HitResult();
			this._hitResultsPool.push(hitResult);
		}
		return hitResult;
	}

	/**
	*@private
	*/
	__proto.recoverAllHitResultsPool=function(){
		this._hitResultsPoolIndex=0;
	}

	/**
	*@private
	*/
	__proto.getContactPoints=function(){
		var contactPoint=this._contactPointsPool[this._contactPonintsPoolIndex++];
		if (!contactPoint){
			contactPoint=new ContactPoint();
			this._contactPointsPool.push(contactPoint);
		}
		return contactPoint;
	}

	/**
	*@private
	*/
	__proto.recoverAllContactPointsPool=function(){
		this._contactPonintsPoolIndex=0;
	}

	/**
	*@private
	*/
	__proto.getCollision=function(physicComponentA,physicComponentB){
		var collision;
		var idA=physicComponentA.id;
		var idB=physicComponentB.id;
		var subCollisionFirst=this._collisions[idA];
		if (subCollisionFirst)
			collision=subCollisionFirst[idB];
		if (!collision){
			if (!subCollisionFirst){
				subCollisionFirst={};
				this._collisions[idA]=subCollisionFirst;
			}
			collision=this._collisionsPool.length===0 ? new Collision():this._collisionsPool.pop();
			collision._colliderA=physicComponentA;
			collision._colliderB=physicComponentB;
			subCollisionFirst[idB]=collision;
		}
		return collision;
	}

	/**
	*@private
	*/
	__proto.recoverCollision=function(collision){
		var idA=collision._colliderA.id;
		var idB=collision._colliderB.id;
		this._collisions[idA][idB]=null;
		this._collisionsPool.push(collision);
	}

	/**
	*@private
	*/
	__proto.garbageCollection=function(){
		this._hitResultsPoolIndex=0;
		this._hitResultsPool.length=0;
		this._contactPonintsPoolIndex=0;
		this._contactPointsPool.length=0;
		this._collisionsPool.length=0;
		for (var subCollisionsKey in this._collisionsPool){
			var subCollisions=this._collisionsPool[subCollisionsKey];
			var wholeDelete=true;
			for (var collisionKey in subCollisions){
				if (subCollisions[collisionKey])
					wholeDelete=false;
				else
				delete subCollisions[collisionKey];
			}
			if (wholeDelete)
				delete this._collisionsPool[subCollisionsKey];
		}
	}

	return CollisionTool;
})()


/**

*/
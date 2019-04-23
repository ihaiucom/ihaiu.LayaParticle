/**
*<code>CharacterController</code> 类用于创建角色控制器。
*/
//class laya.d3.physics.CharacterController extends laya.d3.physics.PhysicsComponent
var CharacterController=(function(_super){
	function CharacterController(stepheight,upAxis,collisionGroup,canCollideWith){
		/**@private */
		//this._stepHeight=NaN;
		/**@private */
		this._maxSlope=45.0;
		/**@private */
		this._jumpSpeed=10.0;
		/**@private */
		this._fallSpeed=55.0;
		/**@private */
		//this._nativeKinematicCharacter=null;
		this._upAxis=new Vector3(0,1,0);
		this._gravity=new Vector3(0,-9.8 *3,0);
		(stepheight===void 0)&& (stepheight=0.1);
		(collisionGroup===void 0)&& (collisionGroup=/*laya.d3.utils.Physics3DUtils.COLLISIONFILTERGROUP_DEFAULTFILTER*/0x1);
		(canCollideWith===void 0)&& (canCollideWith=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER);
		this._stepHeight=stepheight;
		(upAxis)&& (this._upAxis=upAxis);
		CharacterController.__super.call(this,collisionGroup,canCollideWith);
	}

	__class(CharacterController,'laya.d3.physics.CharacterController',_super);
	var __proto=CharacterController.prototype;
	/**
	*@private
	*/
	__proto._constructCharacter=function(){
		var physics3D=Laya3D._physics3D;
		if (this._nativeKinematicCharacter)
			physics3D.destroy(this._nativeKinematicCharacter);
		var nativeUpAxis=CharacterController._nativeTempVector30;
		nativeUpAxis.setValue(this._upAxis.x,this._upAxis.y,this._upAxis.z);
		this._nativeKinematicCharacter=new physics3D.btKinematicCharacterController(this._nativeColliderObject,this._colliderShape._nativeShape,this._stepHeight,nativeUpAxis);
		this.fallSpeed=this._fallSpeed;
		this.maxSlope=this._maxSlope;
		this.jumpSpeed=this._jumpSpeed;
		this.gravity=this._gravity;
	}

	/**
	*@inheritDoc
	*/
	__proto._onShapeChange=function(colShape){
		_super.prototype._onShapeChange.call(this,colShape);
		this._constructCharacter();
	}

	/**
	*@inheritDoc
	*/
	__proto._onAdded=function(){
		var physics3D=Laya3D._physics3D;
		var ghostObject=new physics3D.btPairCachingGhostObject();
		ghostObject.setUserIndex(this.id);
		ghostObject.setCollisionFlags(16);
		this._nativeColliderObject=ghostObject;
		if (this._colliderShape)
			this._constructCharacter();
		_super.prototype._onAdded.call(this);
	}

	/**
	*@inheritDoc
	*/
	__proto._addToSimulation=function(){
		this._simulation._characters.push(this);
		this._simulation._addCharacter(this,this._collisionGroup,this._canCollideWith);
	}

	/**
	*@inheritDoc
	*/
	__proto._removeFromSimulation=function(){
		this._simulation._removeCharacter(this);
		var characters=this._simulation._characters;
		characters.splice(characters.indexOf(this),1);
	}

	/**
	*@inheritDoc
	*/
	__proto._cloneTo=function(dest){
		_super.prototype._cloneTo.call(this,dest);
		var destCharacterController=dest;
		destCharacterController.stepHeight=this._stepHeight;
		destCharacterController.upAxis=this._upAxis;
		destCharacterController.maxSlope=this._maxSlope;
		destCharacterController.jumpSpeed=this._jumpSpeed;
		destCharacterController.fallSpeed=this._fallSpeed;
		destCharacterController.gravity=this._gravity;
	}

	/**
	*@inheritDoc
	*/
	__proto._onDestroy=function(){
		Laya3D._physics3D.destroy(this._nativeKinematicCharacter);
		_super.prototype._onDestroy.call(this);
		this._nativeKinematicCharacter=null;
	}

	/**
	*通过指定移动向量移动角色。
	*@param movement 移动向量。
	*/
	__proto.move=function(movement){
		var movementE=movement.elements;
		var nativeMovement=PhysicsComponent._nativeVector30;
		nativeMovement.setValue(-movementE[0],movementE[1],movementE[2]);
		this._nativeKinematicCharacter.setWalkDirection(nativeMovement);
	}

	/**
	*跳跃。
	*@param velocity 跳跃速度。
	*/
	__proto.jump=function(velocity){
		if (velocity){
			var nativeVelocity=PhysicsComponent._nativeVector30;
			Utils3D._convertToBulletVec3(velocity,nativeVelocity,true);
			this._nativeKinematicCharacter.jump(nativeVelocity);
			}else {
			this._nativeKinematicCharacter.jump();
		}
	}

	/**
	*设置角色降落速度。
	*@param value 角色降落速度。
	*/
	/**
	*获取角色降落速度。
	*@return 角色降落速度。
	*/
	__getset(0,__proto,'fallSpeed',function(){
		return this._fallSpeed;
		},function(value){
		this._fallSpeed=value;
		this._nativeKinematicCharacter.setFallSpeed(value);
	});

	/**
	*设置角色行走的脚步高度，表示可跨越的最大高度。
	*@param value 脚步高度。
	*/
	/**
	*获取角色行走的脚步高度，表示可跨越的最大高度。
	*@return 脚步高度。
	*/
	__getset(0,__proto,'stepHeight',function(){
		return this._stepHeight;
		},function(value){
		this._stepHeight=value;
		this._constructCharacter();
	});

	/**
	*设置角色跳跃速度。
	*@param value 角色跳跃速度。
	*/
	/**
	*获取角色跳跃速度。
	*@return 角色跳跃速度。
	*/
	__getset(0,__proto,'jumpSpeed',function(){
		return this._jumpSpeed;
		},function(value){
		this._jumpSpeed=value;
		this._nativeKinematicCharacter.setJumpSpeed(value);
	});

	/**
	*设置重力。
	*@param value 重力。
	*/
	/**
	*获取重力。
	*@return 重力。
	*/
	__getset(0,__proto,'gravity',function(){
		return this._gravity;
		},function(value){
		this._gravity=value;
		var nativeGravity=CharacterController._nativeTempVector30;
		nativeGravity.setValue(-value.x,value.y,value.z);
		this._nativeKinematicCharacter.setGravity(nativeGravity);
	});

	/**
	*设置最大坡度。
	*@param value 最大坡度。
	*/
	/**
	*获取最大坡度。
	*@return 最大坡度。
	*/
	__getset(0,__proto,'maxSlope',function(){
		return this._maxSlope;
		},function(value){
		this._maxSlope=value;
		this._nativeKinematicCharacter.setMaxSlope((value / 180)*Math.PI);
	});

	/**
	*获取角色是否在地表。
	*/
	__getset(0,__proto,'isGrounded',function(){
		return this._nativeKinematicCharacter.onGround();
	});

	/**
	*设置角色的Up轴。
	*@return 角色的Up轴。
	*/
	/**
	*获取角色的Up轴。
	*@return 角色的Up轴。
	*/
	__getset(0,__proto,'upAxis',function(){
		return this._upAxis;
		},function(value){
		this._upAxis=value;
		this._constructCharacter();
	});

	CharacterController.UPAXIS_X=0;
	CharacterController.UPAXIS_Y=1;
	CharacterController.UPAXIS_Z=2;
	__static(CharacterController,
	['_nativeTempVector30',function(){return this._nativeTempVector30=new Laya3D._physics3D.btVector3(0,0,0);}
	]);
	return CharacterController;
})(PhysicsComponent)


/**

*/
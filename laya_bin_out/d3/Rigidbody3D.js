/**
*<code>Rigidbody3D</code> 类用于创建刚体碰撞器。
*/
//class laya.d3.physics.Rigidbody3D extends laya.d3.physics.PhysicsTriggerComponent
var Rigidbody3D=(function(_super){
	function Rigidbody3D(collisionGroup,canCollideWith){
		/**@private */
		//this._nativeMotionState=null;
		/**@private */
		this._isKinematic=false;
		/**@private */
		this._mass=1.0;
		/**@private */
		this._angularDamping=0.0;
		/**@private */
		this._linearDamping=0.0;
		/**@private */
		this._overrideGravity=false;
		/**@private */
		this._detectCollisions=true;
		this._gravity=new Vector3(0,-10,0);
		this._totalTorque=new Vector3(0,0,0);
		this._linearVelocity=new Vector3();
		this._angularVelocity=new Vector3();
		this._linearFactor=new Vector3(1,1,1);
		this._angularFactor=new Vector3(1,1,1);
		(collisionGroup===void 0)&& (collisionGroup=/*laya.d3.utils.Physics3DUtils.COLLISIONFILTERGROUP_DEFAULTFILTER*/0x1);
		(canCollideWith===void 0)&& (canCollideWith=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER);
		Rigidbody3D.__super.call(this,collisionGroup,canCollideWith);
	}

	__class(Rigidbody3D,'laya.d3.physics.Rigidbody3D',_super);
	var __proto=Rigidbody3D.prototype;
	/**
	*@private
	*/
	__proto._updateMass=function(mass){
		if (this._nativeColliderObject && this._colliderShape){
			this._colliderShape._nativeShape.calculateLocalInertia(mass,Rigidbody3D._nativeInertia);
			this._nativeColliderObject.setMassProps(mass,Rigidbody3D._nativeInertia);
			this._nativeColliderObject.updateInertiaTensor();
		}
	}

	/**
	*@private
	*Dynamic刚体,初始化时调用一次。
	*Kinematic刚体,每次物理tick时调用(如果未进入睡眠状态),让物理引擎知道刚体位置。
	*/
	__proto._delegateMotionStateGetWorldTransform=function(worldTransPointer){}
	/**
	*@private
	*Dynamic刚体,物理引擎每帧调用一次,用于更新渲染矩阵。
	*/
	__proto._delegateMotionStateSetWorldTransform=function(worldTransPointer){
		var rigidBody=/*__JS__ */this._rigidbody;
		rigidBody._simulation._updatedRigidbodies++;
		var physics3D=Laya3D._physics3D;
		var worldTrans=physics3D.wrapPointer(worldTransPointer,physics3D.btTransform);
		rigidBody._updateTransformComponent(worldTrans);
	}

	/**
	*@private
	*Dynamic刚体,初始化时调用一次。
	*Kinematic刚体,每次物理tick时调用(如果未进入睡眠状态),让物理引擎知道刚体位置。
	*该函数只有在runtime下调用
	*/
	__proto._delegateMotionStateGetWorldTransformNative=function(ridgidBody3D,worldTransPointer){}
	/**
	*@private
	*Dynamic刚体,物理引擎每帧调用一次,用于更新渲染矩阵。
	*该函数只有在runtime下调用
	*/
	__proto._delegateMotionStateSetWorldTransformNative=function(rigidBody3D,worldTransPointer){
		var rigidBody=rigidBody3D;
		rigidBody._simulation._updatedRigidbodies++;
		var physics3D=Laya3D._physics3D;
		var worldTrans=physics3D.wrapPointer(worldTransPointer,physics3D.btTransform);
		rigidBody._updateTransformComponent(worldTrans);
	}

	/**
	*@inheritDoc
	*/
	__proto._onScaleChange=function(scale){
		laya.d3.physics.PhysicsComponent.prototype._onScaleChange.call(this,scale);
		this._updateMass(this._isKinematic ? 0 :this._mass);
	}

	/**
	*@private
	*/
	__proto._delegateMotionStateClear=function(){
		/*__JS__ */this._rigidbody=null;
	}

	/**
	*@inheritDoc
	*/
	__proto._onAdded=function(){
		var physics3D=Laya3D._physics3D;
		var motionState=new physics3D.LayaMotionState();
		var isConchApp=/*__JS__ */(window.conch !=null);
		if (isConchApp && physics3D.LayaMotionState.prototype.setRigidbody){
			motionState.setRigidbody(this);
			motionState.setNativeGetWorldTransform(this._delegateMotionStateGetWorldTransformNative);
			motionState.setNativeSetWorldTransform(this._delegateMotionStateSetWorldTransformNative);
			}else {
			motionState.getWorldTransform=this._delegateMotionStateGetWorldTransform;
			motionState.setWorldTransform=this._delegateMotionStateSetWorldTransform;
		}
		motionState.clear=this._delegateMotionStateClear;
		motionState._rigidbody=this;
		this._nativeMotionState=motionState;
		var constructInfo=new physics3D.btRigidBodyConstructionInfo(0.0,motionState,null,Rigidbody3D._nativeVector3Zero);
		var btRigid=new physics3D.btRigidBody(constructInfo);
		btRigid.setUserIndex(this.id);
		this._nativeColliderObject=btRigid;
		_super.prototype._onAdded.call(this);
		this.mass=this._mass;
		this.linearFactor=this._linearFactor;
		this.angularFactor=this._angularFactor;
		this.linearDamping=this._linearDamping;
		this.angularDamping=this._angularDamping;
		this.overrideGravity=this._overrideGravity;
		this.gravity=this._gravity;
		this.isKinematic=this._isKinematic;
		physics3D.destroy(constructInfo);
	}

	/**
	*@inheritDoc
	*/
	__proto._onShapeChange=function(colShape){
		laya.d3.physics.PhysicsComponent.prototype._onShapeChange.call(this,colShape);
		if (this._isKinematic){
			this._updateMass(0);
			}else {
			this._nativeColliderObject.setCenterOfMassTransform(this._nativeColliderObject.getWorldTransform());
			this._updateMass(this._mass);
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._parse=function(data){
		(data.friction !=null)&& (this.friction=data.friction);
		(data.rollingFriction !=null)&& (this.rollingFriction=data.rollingFriction);
		(data.restitution !=null)&& (this.restitution=data.restitution);
		(data.isTrigger !=null)&& (this.isTrigger=data.isTrigger);
		(data.mass !=null)&& (this.mass=data.mass);
		(data.isKinematic !=null)&& (this.isKinematic=data.isKinematic);
		(data.linearDamping !=null)&& (this.linearDamping=data.linearDamping);
		(data.angularDamping !=null)&& (this.angularDamping=data.angularDamping);
		(data.overrideGravity !=null)&& (this.overrideGravity=data.overrideGravity);
		if (data.gravity){
			this.gravity.fromArray(data.gravity);
			this.gravity=this.gravity;
		}
		laya.d3.physics.PhysicsComponent.prototype._parse.call(this,data);
		this._parseShape(data.shapes);
	}

	/**
	*@inheritDoc
	*/
	__proto._onDestroy=function(){
		var physics3D=Laya3D._physics3D;
		this._nativeMotionState.clear();
		physics3D.destroy(this._nativeMotionState);
		laya.d3.physics.PhysicsComponent.prototype._onDestroy.call(this);
		this._nativeMotionState=null;
		this._gravity=null;
		this._totalTorque=null;
		this._linearVelocity=null;
		this._angularVelocity=null;
		this._linearFactor=null;
		this._angularFactor=null;
	}

	/**
	*@inheritDoc
	*/
	__proto._addToSimulation=function(){
		this._simulation._addRigidBody(this,this._collisionGroup,this._detectCollisions ? this._canCollideWith :0);
	}

	/**
	*@inheritDoc
	*/
	__proto._removeFromSimulation=function(){
		this._simulation._removeRigidBody(this);
	}

	/**
	*@inheritDoc
	*/
	__proto._cloneTo=function(dest){
		_super.prototype._cloneTo.call(this,dest);
		var destRigidbody3D=dest;
		destRigidbody3D.isKinematic=this._isKinematic;
		destRigidbody3D.mass=this._mass;
		destRigidbody3D.gravity=this._gravity;
		destRigidbody3D.angularDamping=this._angularDamping;
		destRigidbody3D.linearDamping=this._linearDamping;
		destRigidbody3D.overrideGravity=this._overrideGravity;
		destRigidbody3D.linearVelocity=this._linearVelocity;
		destRigidbody3D.angularVelocity=this._angularVelocity;
		destRigidbody3D.linearFactor=this._linearFactor;
		destRigidbody3D.angularFactor=this._angularFactor;
		destRigidbody3D.detectCollisions=this._detectCollisions;
	}

	/**
	*应用作用力。
	*@param force 作用力。
	*@param localOffset 偏移,如果为null则为中心点
	*/
	__proto.applyForce=function(force,localOffset){
		if (this._nativeColliderObject==null)
			throw "Attempted to call a Physics function that is avaliable only when the Entity has been already added to the Scene.";
		var nativeForce=Rigidbody3D._nativeTempVector30;
		var forceE=force.elements;
		nativeForce.setValue(-forceE[0],forceE[1],forceE[2]);
		if (localOffset){
			var localOffsetE=localOffset.elements;
			var nativeOffset=Rigidbody3D._nativeTempVector31;
			nativeOffset.setValue(-localOffsetE[0],localOffsetE[1],localOffsetE[2]);
			this._nativeColliderObject.applyForce(nativeForce,nativeOffset);
			}else {
			this._nativeColliderObject.applyCentralForce(nativeForce);
		}
	}

	/**
	*应用扭转力。
	*@param torque 扭转力。
	*/
	__proto.applyTorque=function(torque){
		if (this._nativeColliderObject==null)
			throw "Attempted to call a Physics function that is avaliable only when the Entity has been already added to the Scene.";
		var nativeTorque=Rigidbody3D._nativeTempVector30;
		var torqueE=torque.elements;
		nativeTorque.setValue(-torqueE[0],torqueE[1],torqueE[2]);
		this._nativeColliderObject.applyTorque(nativeTorque);
	}

	/**
	*应用冲量。
	*@param impulse 冲量。
	*@param localOffset 偏移,如果为null则为中心点。
	*/
	__proto.applyImpulse=function(impulse,localOffset){
		if (this._nativeColliderObject==null)
			throw "Attempted to call a Physics function that is avaliable only when the Entity has been already added to the Scene.";
		var impulseE=impulse.elements;
		Rigidbody3D._nativeImpulse.setValue(-impulseE[0],impulseE[1],impulseE[2]);
		if (localOffset){
			var localOffsetE=localOffset.elements;
			Rigidbody3D._nativeImpulseOffset.setValue(-localOffsetE[0],localOffsetE[1],localOffsetE[2]);
			this._nativeColliderObject.applyImpulse(Rigidbody3D._nativeImpulse,Rigidbody3D._nativeImpulseOffset);
			}else {
			this._nativeColliderObject.applyCentralImpulse(Rigidbody3D._nativeImpulse);
		}
	}

	/**
	*应用扭转冲量。
	*@param torqueImpulse
	*/
	__proto.applyTorqueImpulse=function(torqueImpulse){
		if (this._nativeColliderObject==null)
			throw "Attempted to call a Physics function that is avaliable only when the Entity has been already added to the Scene.";
		var nativeTorqueImpulse=Rigidbody3D._nativeTempVector30;
		var torqueImpulseE=torqueImpulse.elements;
		nativeTorqueImpulse.setValue(-torqueImpulseE[0],torqueImpulseE[1],torqueImpulseE[2]);
		this._nativeColliderObject.applyTorqueImpulse(nativeTorqueImpulse);
	}

	/**
	*唤醒刚体。
	*/
	__proto.wakeUp=function(){
		this._nativeColliderObject && (this._nativeColliderObject.activate(false));
	}

	/**
	*清除应用到刚体上的所有力。
	*/
	__proto.clearForces=function(){
		var rigidBody=this._nativeColliderObject;
		if (rigidBody==null)
			throw "Attempted to call a Physics function that is avaliable only when the Entity has been already added to the Scene.";
		rigidBody.clearForces();
		var nativeZero=Rigidbody3D._nativeVector3Zero;
		rigidBody.setInterpolationAngularVelocity(nativeZero);
		rigidBody.setLinearVelocity(nativeZero);
		rigidBody.setInterpolationAngularVelocity(nativeZero);
		rigidBody.setAngularVelocity(nativeZero);
	}

	/**
	*设置刚体的角阻力。
	*@param value 角阻力。
	*/
	/**
	*获取刚体的角阻力。
	*@return 角阻力。
	*/
	__getset(0,__proto,'angularDamping',function(){
		return this._angularDamping;
		},function(value){
		this._angularDamping=value;
		if (this._nativeColliderObject)
			this._nativeColliderObject.setDamping(this._linearDamping,value);
	});

	/**
	*设置质量。
	*@param value 质量。
	*/
	/**
	*获取质量。
	*@return 质量。
	*/
	__getset(0,__proto,'mass',function(){
		return this._mass;
		},function(value){
		value=Math.max(value,1e-07);
		this._mass=value;
		(this._isKinematic)|| (this._updateMass(value));
	});

	/**
	*设置刚体的线阻力。
	*@param value 线阻力。
	*/
	/**
	*获取刚体的线阻力。
	*@return 线阻力。
	*/
	__getset(0,__proto,'linearDamping',function(){
		return this._linearDamping;
		},function(value){
		this._linearDamping=value;
		if (this._nativeColliderObject)
			this._nativeColliderObject.setDamping(value,this._angularDamping);
	});

	/**
	*设置是否为运动物体，如果为true仅可通过transform属性移动物体,而非其他力相关属性。
	*@param value 是否为运动物体。
	*/
	/**
	*获取是否为运动物体，如果为true仅可通过transform属性移动物体,而非其他力相关属性。
	*@return 是否为运动物体。
	*/
	__getset(0,__proto,'isKinematic',function(){
		return this._isKinematic;
		},function(value){
		this._isKinematic=value;
		var canInSimulation=!!(this._simulation && this._enabled && this._colliderShape);
		canInSimulation && this._removeFromSimulation();
		var natColObj=this._nativeColliderObject;
		var flags=natColObj.getCollisionFlags();
		if (value){
			flags=flags | 2;
			natColObj.setCollisionFlags(flags);
			this._nativeColliderObject.forceActivationState(4);
			this._enableProcessCollisions=false;
			this._updateMass(0);
			}else {
			if ((flags & 2)> 0)
				flags=flags ^ 2;
			natColObj.setCollisionFlags(flags);
			this._nativeColliderObject.setActivationState(1);
			this._enableProcessCollisions=true;
			this._updateMass(this._mass);
		};
		var nativeZero=Rigidbody3D._nativeVector3Zero;
		natColObj.setInterpolationLinearVelocity(nativeZero);
		natColObj.setLinearVelocity(nativeZero);
		natColObj.setInterpolationAngularVelocity(nativeZero);
		natColObj.setAngularVelocity(nativeZero);
		canInSimulation && this._addToSimulation();
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
		Rigidbody3D._nativeGravity.setValue(-value.x,value.y,value.z);
		this._nativeColliderObject.setGravity(Rigidbody3D._nativeGravity);
	});

	/**
	*设置是否重载重力。
	*@param value 是否重载重力。
	*/
	/**
	*获取是否重载重力。
	*@return 是否重载重力。
	*/
	__getset(0,__proto,'overrideGravity',function(){
		return this._overrideGravity;
		},function(value){
		this._overrideGravity=value;
		if (this._nativeColliderObject){
			var flag=this._nativeColliderObject.getFlags();
			if (value){
				if ((flag & 1)===0)
					this._nativeColliderObject.setFlags(flag | 1);
				}else {
				if ((flag & 1)> 0)
					this._nativeColliderObject.setFlags(flag ^ 1);
			}
		}
	});

	/**
	*获取总力。
	*/
	__getset(0,__proto,'totalForce',function(){
		if (this._nativeColliderObject)
			return this._nativeColliderObject.getTotalForce();
		return null;
	});

	/**
	*设置线速度。
	*@param 线速度。
	*/
	/**
	*获取线速度
	*@return 线速度
	*/
	__getset(0,__proto,'linearVelocity',function(){
		if (this._nativeColliderObject)
			Utils3D._convertToLayaVec3(this._nativeColliderObject.getLinearVelocity(),this._linearVelocity,true);
		return this._linearVelocity;
		},function(value){
		this._linearVelocity=value;
		if (this._nativeColliderObject){
			var nativeValue=Rigidbody3D._nativeTempVector30;
			Utils3D._convertToBulletVec3(value,nativeValue,true);
			(this.isSleeping)&& (this.wakeUp());
			this._nativeColliderObject.setLinearVelocity(nativeValue);
		}
	});

	/**
	*设置是否进行碰撞检测。
	*@param value 是否进行碰撞检测。
	*/
	/**
	*获取是否进行碰撞检测。
	*@return 是否进行碰撞检测。
	*/
	__getset(0,__proto,'detectCollisions',function(){
		return this._detectCollisions;
		},function(value){
		if (this._detectCollisions!==value){
			this._detectCollisions=value;
			if (this._colliderShape && this._enabled && this._simulation){
				this._simulation._removeRigidBody(this);
				this._simulation._addRigidBody(this,this._collisionGroup,value ? this._canCollideWith :0);
			}
		}
	});

	/**
	*设置性因子。
	*/
	/**
	*获取性因子。
	*/
	__getset(0,__proto,'linearFactor',function(){
		if (this._nativeColliderObject)
			return this._linearFactor;
		return null;
		},function(value){
		this._linearFactor=value;
		if (this._nativeColliderObject){
			var nativeValue=Rigidbody3D._nativeTempVector30;
			Utils3D._convertToBulletVec3(value,nativeValue,false);
			this._nativeColliderObject.setLinearFactor(nativeValue);
		}
	});

	/**
	*设置角因子。
	*/
	/**
	*获取角因子。
	*/
	__getset(0,__proto,'angularFactor',function(){
		if (this._nativeColliderObject)
			return this._angularFactor;
		return null;
		},function(value){
		this._angularFactor=value;
		if (this._nativeColliderObject){
			var nativeValue=Rigidbody3D._nativeTempVector30;
			Utils3D._convertToBulletVec3(value,nativeValue,false);
			this._nativeColliderObject.setAngularFactor(nativeValue);
		}
	});

	/**
	*设置角速度。
	*@param 角速度
	*/
	/**
	*获取角速度。
	*@return 角速度。
	*/
	__getset(0,__proto,'angularVelocity',function(){
		if (this._nativeColliderObject)
			Utils3D._convertToLayaVec3(this._nativeColliderObject.getAngularVelocity(),this._angularVelocity,true);
		return this._angularVelocity;
		},function(value){
		this._angularVelocity=value;
		if (this._nativeColliderObject){
			var nativeValue=Rigidbody3D._nativeTempVector30;
			Utils3D._convertToBulletVec3(value,nativeValue,true);
			(this.isSleeping)&& (this.wakeUp());
			this._nativeColliderObject.setAngularVelocity(nativeValue);
		}
	});

	/**
	*获取刚体所有扭力。
	*/
	__getset(0,__proto,'totalTorque',function(){
		if (this._nativeColliderObject){
			var nativeTotalTorque=this._nativeColliderObject.getTotalTorque();
			var totalTorqueE=this._totalTorque.elements;
			totalTorqueE[0]=-nativeTotalTorque.x;
			totalTorqueE[1]=nativeTotalTorque.y;
			totalTorqueE[2]=nativeTotalTorque.z;
		}
		return null;
	});

	/**
	*获取是否处于睡眠状态。
	*@return 是否处于睡眠状态。
	*/
	__getset(0,__proto,'isSleeping',function(){
		if (this._nativeColliderObject)
			return this._nativeColliderObject.getActivationState()===/*laya.d3.physics.PhysicsComponent.ACTIVATIONSTATE_ISLAND_SLEEPING*/2;
		return false;
	});

	/**
	*设置刚体睡眠的线速度阈值。
	*@param value 刚体睡眠的线速度阈值。
	*/
	/**
	*获取刚体睡眠的线速度阈值。
	*@return 刚体睡眠的线速度阈值。
	*/
	__getset(0,__proto,'sleepLinearVelocity',function(){
		return this._nativeColliderObject.getLinearSleepingThreshold();
		},function(value){
		this._nativeColliderObject.setSleepingThresholds(value,this._nativeColliderObject.getAngularSleepingThreshold());
	});

	/**
	*设置刚体睡眠的角速度阈值。
	*@param value 刚体睡眠的角速度阈值。
	*/
	/**
	*获取刚体睡眠的角速度阈值。
	*@return 刚体睡眠的角速度阈值。
	*/
	__getset(0,__proto,'sleepAngularVelocity',function(){
		return this._nativeColliderObject.getAngularSleepingThreshold();
		},function(value){
		this._nativeColliderObject.setSleepingThresholds(this._nativeColliderObject.getLinearSleepingThreshold(),value);
	});

	Rigidbody3D.TYPE_STATIC=0;
	Rigidbody3D.TYPE_DYNAMIC=1;
	Rigidbody3D.TYPE_KINEMATIC=2;
	Rigidbody3D._BT_DISABLE_WORLD_GRAVITY=1;
	Rigidbody3D._BT_ENABLE_GYROPSCOPIC_FORCE=2;
	__static(Rigidbody3D,
	['_nativeTempVector30',function(){return this._nativeTempVector30=new Laya3D._physics3D.btVector3(0,0,0);},'_nativeTempVector31',function(){return this._nativeTempVector31=new Laya3D._physics3D.btVector3(0,0,0);},'_nativeVector3Zero',function(){return this._nativeVector3Zero=new Laya3D._physics3D.btVector3(0,0,0);},'_nativeInertia',function(){return this._nativeInertia=new Laya3D._physics3D.btVector3(0,0,0);},'_nativeImpulse',function(){return this._nativeImpulse=new Laya3D._physics3D.btVector3(0,0,0);},'_nativeImpulseOffset',function(){return this._nativeImpulseOffset=new Laya3D._physics3D.btVector3(0,0,0);},'_nativeGravity',function(){return this._nativeGravity=new Laya3D._physics3D.btVector3(0,0,0);}
	]);
	return Rigidbody3D;
})(PhysicsTriggerComponent)


/**
//
*/
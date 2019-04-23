/**
*<code>Simulation</code> 类用于创建物理模拟器。
*/
//class laya.d3.physics.PhysicsSimulation
var PhysicsSimulation=(function(){
	function PhysicsSimulation(configuration,flags){
		/**@private */
		this._nativeDiscreteDynamicsWorld=null;
		/**@private */
		this._nativeCollisionWorld=null;
		/**@private */
		this._nativeDispatcher=null;
		/**@private */
		this._nativeCollisionConfiguration=null;
		/**@private */
		this._nativeBroadphase=null;
		/**@private */
		this._nativeSolverInfo=null;
		/**@private */
		this._nativeDispatchInfo=null;
		/**@private */
		this._nativeClosestRayResultCallback=null;
		/**@private */
		this._nativeAllHitsRayResultCallback=null;
		/**@private */
		this._nativeClosestConvexResultCallback=null;
		/**@private */
		this._nativeAllConvexResultCallback=null;
		/**@private */
		this._updatedRigidbodies=0;
		/**物理引擎在一帧中用于补偿减速的最大次数：模拟器每帧允许的最大模拟次数，如果引擎运行缓慢,可能需要增加该次数，否则模拟器会丢失“时间",引擎间隔时间小于maxSubSteps*fixedTimeStep非常重要。*/
		this.maxSubSteps=1;
		/**物理模拟器帧的间隔时间:通过减少fixedTimeStep可增加模拟精度，默认是1.0 / 60.0。*/
		this.fixedTimeStep=1.0 / 60.0;
		this._gravity=new Vector3(0,-10,0);
		this._nativeVector3Zero=new Laya3D._physics3D.btVector3(0,0,0);
		this._nativeDefaultQuaternion=new Laya3D._physics3D.btQuaternion(0,0,0,-1);
		this._collisionsUtils=new CollisionTool();
		this._previousFrameCollisions=[];
		this._currentFrameCollisions=[];
		this._physicsUpdateList=new PhysicsUpdateList();
		this._characters=[];
		(flags===void 0)&& (flags=0);
		this.maxSubSteps=configuration.maxSubSteps;
		this.fixedTimeStep=configuration.fixedTimeStep;
		var physics3D=Laya3D._physics3D;
		this._nativeCollisionConfiguration=new physics3D.btDefaultCollisionConfiguration();
		this._nativeDispatcher=new physics3D.btCollisionDispatcher(this._nativeCollisionConfiguration);
		this._nativeBroadphase=new physics3D.btDbvtBroadphase();
		this._nativeBroadphase.getOverlappingPairCache().setInternalGhostPairCallback(new physics3D.btGhostPairCallback());
		var conFlags=configuration.flags;
		if (conFlags & 0x1){
			this._nativeCollisionWorld=new physics3D.btCollisionWorld(this._nativeDispatcher,this._nativeBroadphase,this._nativeCollisionConfiguration);
			}else if (conFlags & 0x2){
			throw "PhysicsSimulation:SoftBody processing is not yet available";
			}else {
			var solver=new physics3D.btSequentialImpulseConstraintSolver();
			this._nativeDiscreteDynamicsWorld=new physics3D.btDiscreteDynamicsWorld(this._nativeDispatcher,this._nativeBroadphase,solver,this._nativeCollisionConfiguration);
			this._nativeCollisionWorld=this._nativeDiscreteDynamicsWorld;
		}
		if (this._nativeDiscreteDynamicsWorld){
			this._nativeSolverInfo=this._nativeDiscreteDynamicsWorld.getSolverInfo();
			this._nativeDispatchInfo=this._nativeDiscreteDynamicsWorld.getDispatchInfo();
		}
		this._nativeClosestRayResultCallback=new physics3D.ClosestRayResultCallback(this._nativeVector3Zero,this._nativeVector3Zero);
		this._nativeAllHitsRayResultCallback=new physics3D.AllHitsRayResultCallback(this._nativeVector3Zero,this._nativeVector3Zero);
		this._nativeClosestConvexResultCallback=new physics3D.ClosestConvexResultCallback(this._nativeVector3Zero,this._nativeVector3Zero);
		this._nativeAllConvexResultCallback=new physics3D.AllConvexResultCallback(this._nativeVector3Zero,this._nativeVector3Zero);
		physics3D._btGImpactCollisionAlgorithm_RegisterAlgorithm(this._nativeDispatcher.a);
	}

	__class(PhysicsSimulation,'laya.d3.physics.PhysicsSimulation');
	var __proto=PhysicsSimulation.prototype;
	/**
	*@private
	*/
	__proto._simulate=function(deltaTime){
		this._updatedRigidbodies=0;
		if (this._nativeDiscreteDynamicsWorld)
			this._nativeDiscreteDynamicsWorld.stepSimulation(deltaTime,this.maxSubSteps,this.fixedTimeStep);
		else
		this._nativeCollisionWorld.PerformDiscreteCollisionDetection();
	}

	/**
	*@private
	*/
	__proto._destroy=function(){
		var physics3D=Laya3D._physics3D;
		if (this._nativeDiscreteDynamicsWorld){
			physics3D.destroy(this._nativeDiscreteDynamicsWorld);
			this._nativeDiscreteDynamicsWorld=null;
			}else {
			physics3D.destroy(this._nativeCollisionWorld);
			this._nativeCollisionWorld=null;
		}
		physics3D.destroy(this._nativeBroadphase);
		this._nativeBroadphase=null;
		physics3D.destroy(this._nativeDispatcher);
		this._nativeDispatcher=null;
		physics3D.destroy(this._nativeCollisionConfiguration);
		this._nativeCollisionConfiguration=null;
	}

	/**
	*@private
	*/
	__proto._addPhysicsCollider=function(component,group,mask){
		this._nativeCollisionWorld.addCollisionObject(component._nativeColliderObject,group,mask);
	}

	/**
	*@private
	*/
	__proto._removePhysicsCollider=function(component){
		this._nativeCollisionWorld.removeCollisionObject(component._nativeColliderObject);
	}

	/**
	*@private
	*/
	__proto._addRigidBody=function(rigidBody,group,mask){
		if (!this._nativeDiscreteDynamicsWorld)
			throw "Simulation:Cannot perform this action when the physics engine is set to CollisionsOnly";
		this._nativeCollisionWorld.addRigidBody(rigidBody._nativeColliderObject,group,mask);
	}

	/**
	*@private
	*/
	__proto._removeRigidBody=function(rigidBody){
		if (!this._nativeDiscreteDynamicsWorld)
			throw "Simulation:Cannot perform this action when the physics engine is set to CollisionsOnly";
		this._nativeCollisionWorld.removeRigidBody(rigidBody._nativeColliderObject);
	}

	/**
	*@private
	*/
	__proto._addCharacter=function(character,group,mask){
		if (!this._nativeDiscreteDynamicsWorld)
			throw "Simulation:Cannot perform this action when the physics engine is set to CollisionsOnly";
		this._nativeCollisionWorld.addCollisionObject(character._nativeColliderObject,group,mask);
		this._nativeCollisionWorld.addAction(character._nativeKinematicCharacter);
	}

	/**
	*@private
	*/
	__proto._removeCharacter=function(character){
		if (!this._nativeDiscreteDynamicsWorld)
			throw "Simulation:Cannot perform this action when the physics engine is set to CollisionsOnly";
		this._nativeCollisionWorld.removeCollisionObject(character._nativeColliderObject);
		this._nativeCollisionWorld.removeAction(character._nativeKinematicCharacter);
	}

	/**
	*射线检测第一个碰撞物体。
	*@param from 起始位置。
	*@param to 结束位置。
	*@param out 碰撞结果。
	*@param collisonGroup 射线所属碰撞组。
	*@param collisionMask 与射线可产生碰撞的组。
	*@return 是否成功。
	*/
	__proto.raycastFromTo=function(from,to,out,collisonGroup,collisionMask){
		(collisonGroup===void 0)&& (collisonGroup=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER);
		(collisionMask===void 0)&& (collisionMask=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER);
		var rayResultCall=this._nativeClosestRayResultCallback;
		var rayFrom=PhysicsSimulation._nativeTempVector30;
		var rayTo=PhysicsSimulation._nativeTempVector31;
		var fromE=from.elements;
		var toE=to.elements;
		rayFrom.setValue(-fromE[0],fromE[1],fromE[2]);
		rayTo.setValue(-toE[0],toE[1],toE[2]);
		rayResultCall.set_m_rayFromWorld(rayFrom);
		rayResultCall.set_m_rayToWorld(rayTo);
		rayResultCall.set_m_collisionFilterGroup(collisonGroup);
		rayResultCall.set_m_collisionFilterMask(collisionMask);
		rayResultCall.set_m_collisionObject(null);
		rayResultCall.set_m_closestHitFraction(1);
		this._nativeCollisionWorld.rayTest(rayFrom,rayTo,rayResultCall);
		if (rayResultCall.hasHit()){
			if (out){
				out.succeeded=true;
				out.collider=PhysicsComponent._physicObjectsMap[rayResultCall.get_m_collisionObject().getUserIndex()];
				out.hitFraction=rayResultCall.get_m_closestHitFraction();
				var nativePoint=rayResultCall.get_m_hitPointWorld();
				var pointE=out.point.elements;
				pointE[0]=-nativePoint.x();
				pointE[1]=nativePoint.y();
				pointE[2]=nativePoint.z();
				var nativeNormal=rayResultCall.get_m_hitNormalWorld();
				var normalE=out.normal.elements;
				normalE[0]=-nativeNormal.x();
				normalE[1]=nativeNormal.y();
				normalE[2]=nativeNormal.z();
			}
			return true;
			}else {
			if (out)
				out.succeeded=false;
			return false;
		}
	}

	/**
	*射线检测所有碰撞的物体。
	*@param from 起始位置。
	*@param to 结束位置。
	*@param out 碰撞结果[数组元素会被回收]。
	*@param collisonGroup 射线所属碰撞组。
	*@param collisionMask 与射线可产生碰撞的组。
	*@return 是否成功。
	*/
	__proto.raycastAllFromTo=function(from,to,out,collisonGroup,collisionMask){
		(collisonGroup===void 0)&& (collisonGroup=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER);
		(collisionMask===void 0)&& (collisionMask=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER);
		var rayResultCall=this._nativeAllHitsRayResultCallback;
		var rayFrom=PhysicsSimulation._nativeTempVector30;
		var rayTo=PhysicsSimulation._nativeTempVector31;
		out.length=0;
		var fromE=from.elements;
		var toE=to.elements;
		rayFrom.setValue(-fromE[0],fromE[1],fromE[2]);
		rayTo.setValue(-toE[0],toE[1],toE[2]);
		rayResultCall.set_m_rayFromWorld(rayFrom);
		rayResultCall.set_m_rayToWorld(rayTo);
		rayResultCall.set_m_collisionFilterGroup(collisonGroup);
		rayResultCall.set_m_collisionFilterMask(collisionMask);
		var collisionObjects=rayResultCall.get_m_collisionObjects();
		var nativePoints=rayResultCall.get_m_hitPointWorld();
		var nativeNormals=rayResultCall.get_m_hitNormalWorld();
		var nativeFractions=rayResultCall.get_m_hitFractions();
		collisionObjects.clear();
		nativePoints.clear();
		nativeNormals.clear();
		nativeFractions.clear();
		this._nativeCollisionWorld.rayTest(rayFrom,rayTo,rayResultCall);
		var count=collisionObjects.size();
		if (count > 0){
			this._collisionsUtils.recoverAllHitResultsPool();
			for (var i=0;i < count;i++){
				var hitResult=this._collisionsUtils.getHitResult();
				out.push(hitResult);
				hitResult.succeeded=true;
				hitResult.collider=PhysicsComponent._physicObjectsMap[collisionObjects.at(i).getUserIndex()];
				hitResult.hitFraction=nativeFractions.at(i);
				var nativePoint=nativePoints.at(i);
				var pointE=hitResult.point.elements;
				pointE[0]=-nativePoint.x();
				pointE[1]=nativePoint.y();
				pointE[2]=nativePoint.z();
				var nativeNormal=nativeNormals.at(i);
				var normalE=hitResult.normal.elements;
				normalE[0]=-nativeNormal.x();
				normalE[1]=nativeNormal.y();
				normalE[2]=nativeNormal.z();
			}
			return true;
			}else {
			return false;
		}
	}

	/**
	*射线检测第一个碰撞物体。
	*@param ray 射线
	*@param outHitInfo 与该射线发生碰撞的第一个碰撞器的碰撞信息
	*@param distance 射线长度,默认为最大值
	*@param collisonGroup 射线所属碰撞组。
	*@param collisionMask 与射线可产生碰撞的组。
	*@return 是否检测成功。
	*/
	__proto.rayCast=function(ray,outHitResult,distance,collisonGroup,collisionMask){
		(distance===void 0)&& (distance=2147483647);
		(collisonGroup===void 0)&& (collisonGroup=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER);
		(collisionMask===void 0)&& (collisionMask=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER);
		var from=ray.origin;
		var to=PhysicsSimulation._tempVector30;
		Vector3.normalize(ray.direction,to);
		Vector3.scale(to,distance,to);
		Vector3.add(from,to,to);
		return this.raycastFromTo(from,to,outHitResult,collisonGroup,collisionMask);
	}

	/**
	*射线检测所有碰撞的物体。
	*@param ray 射线
	*@param out 碰撞结果[数组元素会被回收]。
	*@param distance 射线长度,默认为最大值
	*@param collisonGroup 射线所属碰撞组。
	*@param collisionMask 与射线可产生碰撞的组。
	*@return 是否检测成功。
	*/
	__proto.rayCastAll=function(ray,out,distance,collisonGroup,collisionMask){
		(distance===void 0)&& (distance=2147483647);
		(collisonGroup===void 0)&& (collisonGroup=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER);
		(collisionMask===void 0)&& (collisionMask=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER);
		var from=ray.origin;
		var to=PhysicsSimulation._tempVector30;
		Vector3.normalize(ray.direction,to);
		Vector3.scale(to,distance,to);
		Vector3.add(from,to,to);
		return this.raycastAllFromTo(from,to,out,collisonGroup,collisionMask);
	}

	/**
	*形状检测第一个碰撞的物体。
	*@param shape 形状。
	*@param fromPosition 世界空间起始位置。
	*@param toPosition 世界空间结束位置。
	*@param out 碰撞结果。
	*@param fromRotation 起始旋转。
	*@param toRotation 结束旋转。
	*@param collisonGroup 射线所属碰撞组。
	*@param collisionMask 与射线可产生碰撞的组。
	*@return 是否成功。
	*/
	__proto.shapeCast=function(shape,fromPosition,toPosition,out,fromRotation,toRotation,collisonGroup,collisionMask,allowedCcdPenetration){
		(collisonGroup===void 0)&& (collisonGroup=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER);
		(collisionMask===void 0)&& (collisionMask=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER);
		(allowedCcdPenetration===void 0)&& (allowedCcdPenetration=0.0);
		var convexResultCall=this._nativeClosestConvexResultCallback;
		var convexPosFrom=PhysicsSimulation._nativeTempVector30;
		var convexPosTo=PhysicsSimulation._nativeTempVector31;
		var convexRotFrom=PhysicsSimulation._nativeTempVector30;
		var convexRotTo=PhysicsSimulation._nativeTempVector31;
		var convexTransform=PhysicsSimulation._nativeTempTransform0;
		var convexTransTo=PhysicsSimulation._nativeTempTransform1;
		var sweepShape=shape._nativeShape;
		var fromPositionE=fromPosition.elements;
		var toPositionE=toPosition.elements;
		convexPosFrom.setValue(-fromPositionE[0],fromPositionE[1],fromPositionE[2]);
		convexPosTo.setValue(-toPositionE[0],toPositionE[1],toPositionE[2]);
		convexResultCall.set_m_collisionFilterGroup(collisonGroup);
		convexResultCall.set_m_collisionFilterMask(collisionMask);
		convexTransform.setOrigin(convexPosFrom);
		convexTransTo.setOrigin(convexPosTo);
		if (fromRotation){
			var fromRotationE=fromRotation.elements;
			convexRotFrom.setValue(-fromRotationE[0],fromRotationE[1],fromRotationE[2],-fromRotationE[3]);
			convexTransform.setRotation(convexRotFrom);
			}else {
			convexTransform.setRotation(this._nativeDefaultQuaternion);
		}
		if (toRotation){
			var toRotationE=toRotation.elements;
			convexRotTo.setValue(-toRotationE[0],toRotationE[1],toRotationE[2],-toRotationE[2]);
			convexTransTo.setRotation(convexRotTo);
			}else {
			convexTransTo.setRotation(this._nativeDefaultQuaternion);
		}
		convexResultCall.set_m_hitCollisionObject(null);
		convexResultCall.set_m_closestHitFraction(1);
		this._nativeCollisionWorld.convexSweepTest(sweepShape,convexTransform,convexTransTo,convexResultCall,allowedCcdPenetration);
		if (convexResultCall.hasHit()){
			if (out){
				out.succeeded=true;
				out.collider=PhysicsComponent._physicObjectsMap[convexResultCall.get_m_hitCollisionObject().getUserIndex()];
				out.hitFraction=convexResultCall.get_m_closestHitFraction();
				var nativePoint=convexResultCall.get_m_hitPointWorld();
				var nativeNormal=convexResultCall.get_m_hitNormalWorld();
				var pointE=out.point.elements;
				var normalE=out.normal.elements;
				pointE[0]=-nativePoint.x();
				pointE[1]=nativePoint.y();
				pointE[2]=nativePoint.z();
				normalE[0]=-nativeNormal.x();
				normalE[1]=nativeNormal.y();
				normalE[2]=nativeNormal.z();
			}
			return true;
			}else {
			if (out)
				out.succeeded=false;
			return false;
		}
	}

	/**
	*形状检测所有碰撞的物体。
	*@param shape 形状。
	*@param fromPosition 世界空间起始位置。
	*@param toPosition 世界空间结束位置。
	*@param out 碰撞结果[数组元素会被回收]。
	*@param fromRotation 起始旋转。
	*@param toRotation 结束旋转。
	*@param collisonGroup 射线所属碰撞组。
	*@param collisionMask 与射线可产生碰撞的组。
	*@return 是否成功。
	*/
	__proto.shapeCastAll=function(shape,fromPosition,toPosition,out,fromRotation,toRotation,collisonGroup,collisionMask,allowedCcdPenetration){
		(collisonGroup===void 0)&& (collisonGroup=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER);
		(collisionMask===void 0)&& (collisionMask=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER);
		(allowedCcdPenetration===void 0)&& (allowedCcdPenetration=0.0);
		var convexResultCall=this._nativeAllConvexResultCallback;
		var convexPosFrom=PhysicsSimulation._nativeTempVector30;
		var convexPosTo=PhysicsSimulation._nativeTempVector31;
		var convexRotFrom=PhysicsSimulation._nativeTempVector30;
		var convexRotTo=PhysicsSimulation._nativeTempVector31;
		var convexTransform=PhysicsSimulation._nativeTempTransform0;
		var convexTransTo=PhysicsSimulation._nativeTempTransform1;
		var sweepShape=shape._nativeShape;
		out.length=0;
		var fromPositionE=fromPosition.elements;
		var toPositionE=toPosition.elements;
		convexPosFrom.setValue(-fromPositionE[0],fromPositionE[1],fromPositionE[2]);
		convexPosTo.setValue(-toPositionE[0],toPositionE[1],toPositionE[2]);
		convexResultCall.set_m_collisionFilterGroup(collisonGroup);
		convexResultCall.set_m_collisionFilterMask(collisionMask);
		convexTransform.setOrigin(convexPosFrom);
		convexTransTo.setOrigin(convexPosTo);
		if (fromRotation){
			var fromRotationE=fromRotation.elements;
			convexRotFrom.setValue(-fromRotationE[0],fromRotationE[1],fromRotationE[2],-fromRotationE[3]);
			convexTransform.setRotation(convexRotFrom);
			}else {
			convexTransform.setRotation(this._nativeDefaultQuaternion);
		}
		if (toRotation){
			var toRotationE=toRotation.elements;
			convexRotTo.setValue(-toRotationE[0],toRotationE[1],toRotationE[2],-toRotationE[2]);
			convexTransTo.setRotation(convexRotTo);
			}else {
			convexTransTo.setRotation(this._nativeDefaultQuaternion);
		};
		var collisionObjects=convexResultCall.get_m_collisionObjects();
		collisionObjects.clear();
		this._nativeCollisionWorld.convexSweepTest(sweepShape,convexTransform,convexTransTo,convexResultCall,allowedCcdPenetration);
		var count=collisionObjects.size();
		if (count > 0){
			var nativePoints=convexResultCall.get_m_hitPointWorld();
			var nativeNormals=convexResultCall.get_m_hitNormalWorld();
			var nativeFractions=convexResultCall.get_m_hitFractions();
			for (var i=0;i < count;i++){
				var hitResult=this._collisionsUtils.getHitResult();
				out.push(hitResult);
				hitResult.succeeded=true;
				hitResult.collider=PhysicsComponent._physicObjectsMap[collisionObjects.at(i).getUserIndex()];
				hitResult.hitFraction=nativeFractions.at(i);
				var nativePoint=nativePoints.at(i);
				var pointE=hitResult.point.elements;
				pointE[0]=-nativePoint.x();
				pointE[1]=nativePoint.y();
				pointE[2]=nativePoint.z();
				var nativeNormal=nativeNormals.at(i);
				var normalE=hitResult.normal.elements;
				normalE[0]=-nativeNormal.x();
				normalE[1]=nativeNormal.y();
				normalE[2]=nativeNormal.z();
			}
			return true;
			}else {
			return false;
		}
	}

	/**
	*添加刚体运动的约束条件。
	*@param constraint 约束。
	*@param disableCollisionsBetweenLinkedBodies 是否禁用
	*/
	__proto.addConstraint=function(constraint,disableCollisionsBetweenLinkedBodies){
		(disableCollisionsBetweenLinkedBodies===void 0)&& (disableCollisionsBetweenLinkedBodies=false);
		if (!this._nativeDiscreteDynamicsWorld)
			throw "Cannot perform this action when the physics engine is set to CollisionsOnly";
		this._nativeDiscreteDynamicsWorld.addConstraint(constraint._nativeConstraint,disableCollisionsBetweenLinkedBodies);
		constraint._simulation=this;
	}

	/**
	*移除刚体运动的约束条件。
	*/
	__proto.removeConstraint=function(constraint){
		if (!this._nativeDiscreteDynamicsWorld)
			throw "Cannot perform this action when the physics engine is set to CollisionsOnly";
		this._nativeDiscreteDynamicsWorld.removeConstraint(constraint._nativeConstraint);
	}

	/**
	*@private
	*/
	__proto._updatePhysicsTransformFromRender=function(){
		var elements=this._physicsUpdateList.elements;
		for (var i=0,n=this._physicsUpdateList.length;i < n;i++){
			var physicCollider=elements[i];
			physicCollider._derivePhysicsTransformation(false);
			physicCollider._inPhysicUpdateListIndex=-1;
		}
		this._physicsUpdateList.length=0;
	}

	/**
	*@private
	*/
	__proto._updateCharacters=function(){
		for (var i=0,n=this._characters.length;i < n;i++){
			var character=this._characters[i];
			character._updateTransformComponent(character._nativeColliderObject.getWorldTransform());
		}
	}

	/**
	*@private
	*/
	__proto._updateCollisions=function(){
		this._collisionsUtils.recoverAllContactPointsPool();
		var previous=this._currentFrameCollisions;
		this._currentFrameCollisions=this._previousFrameCollisions;
		this._currentFrameCollisions.length=0;
		this._previousFrameCollisions=previous;
		var loopCount=Stat.loopCount;
		var numManifolds=this._nativeDispatcher.getNumManifolds();
		for (var i=0;i < numManifolds;i++){
			var contactManifold=this._nativeDispatcher.getManifoldByIndexInternal(i);
			var componentA=PhysicsComponent._physicObjectsMap[contactManifold.getBody0().getUserIndex()];
			var componentB=PhysicsComponent._physicObjectsMap[contactManifold.getBody1().getUserIndex()];
			var collision=null;
			var isFirstCollision=false;
			var contacts=null;
			var isTrigger=componentA.isTrigger || componentB.isTrigger;
			if (isTrigger && ((componentA.owner)._needProcessTriggers || (componentB.owner)._needProcessTriggers)){
				var numContacts=contactManifold.getNumContacts();
				for (var j=0;j < numContacts;j++){
					var pt=contactManifold.getContactPoint(j);
					var distance=pt.getDistance();
					if (distance <=0){
						collision=this._collisionsUtils.getCollision(componentA,componentB);
						contacts=collision.contacts;
						isFirstCollision=collision._updateFrame!==loopCount;
						if (isFirstCollision){
							collision._isTrigger=true;
							contacts.length=0;
						}
						break ;
					}
				}
				}else if ((componentA.owner)._needProcessCollisions || (componentB.owner)._needProcessCollisions){
				if (componentA._enableProcessCollisions || componentB._enableProcessCollisions){
					numContacts=contactManifold.getNumContacts();
					for (j=0;j < numContacts;j++){
						pt=contactManifold.getContactPoint(j);
						distance=pt.getDistance();
						if (distance <=0){
							var contactPoint=this._collisionsUtils.getContactPoints();
							contactPoint.colliderA=componentA;
							contactPoint.colliderB=componentB;
							contactPoint.distance=distance;
							var nativeNormal=pt.get_m_normalWorldOnB();
							var normalE=contactPoint.normal.elements;
							normalE[0]=-nativeNormal.x();
							normalE[1]=nativeNormal.y();
							normalE[2]=nativeNormal.z();
							var nativePostionA=pt.get_m_positionWorldOnA();
							var positionOnAE=contactPoint.positionOnA.elements;
							positionOnAE[0]=-nativePostionA.x();
							positionOnAE[1]=nativePostionA.y();
							positionOnAE[2]=nativePostionA.z();
							var nativePostionB=pt.get_m_positionWorldOnB();
							var positionOnBE=contactPoint.positionOnB.elements;
							positionOnBE[0]=-nativePostionB.x();
							positionOnBE[1]=nativePostionB.y();
							positionOnBE[2]=nativePostionB.z();
							if (!collision){
								collision=this._collisionsUtils.getCollision(componentA,componentB);
								contacts=collision.contacts;
								isFirstCollision=collision._updateFrame!==loopCount;
								if (isFirstCollision){
									collision._isTrigger=false;
									contacts.length=0;
								}
							}
							contacts.push(contactPoint);
						}
					}
				}
			}
			if (collision && isFirstCollision){
				this._currentFrameCollisions.push(collision);
				collision._setUpdateFrame(loopCount);
			}
		}
	}

	/**
	*@private
	*/
	__proto._eventScripts=function(){
		var loopCount=Stat.loopCount;
		for (var i=0,n=this._currentFrameCollisions.length;i < n;i++){
			var curFrameCol=this._currentFrameCollisions[i];
			var colliderA=curFrameCol._colliderA;
			var colliderB=curFrameCol._colliderB;
			if (colliderA.destroyed || colliderB.destroyed)
				continue ;
			if (loopCount-curFrameCol._lastUpdateFrame===1){
				var ownerA=colliderA.owner;
				var scriptsA=ownerA._scripts;
				if (scriptsA){
					if (curFrameCol._isTrigger){
						if (ownerA._needProcessTriggers){
							for (var j=0,m=scriptsA.length;j < m;j++)
							scriptsA[j].onTriggerStay(colliderB);
						}
						}else {
						if (ownerA._needProcessCollisions){
							for (j=0,m=scriptsA.length;j < m;j++){
								curFrameCol.other=colliderB;
								scriptsA[j].onCollisionStay(curFrameCol);
							}
						}
					}
				};
				var ownerB=colliderB.owner;
				var scriptsB=ownerB._scripts;
				if (scriptsB){
					if (curFrameCol._isTrigger){
						if (ownerB._needProcessTriggers){
							for (j=0,m=scriptsB.length;j < m;j++)
							scriptsB[j].onTriggerStay(colliderA);
						}
						}else {
						if (ownerB._needProcessCollisions){
							for (j=0,m=scriptsB.length;j < m;j++){
								curFrameCol.other=colliderA;
								scriptsB[j].onCollisionStay(curFrameCol);
							}
						}
					}
				}
				}else {
				ownerA=colliderA.owner;
				scriptsA=ownerA._scripts;
				if (scriptsA){
					if (curFrameCol._isTrigger){
						if (ownerA._needProcessTriggers){
							for (j=0,m=scriptsA.length;j < m;j++)
							scriptsA[j].onTriggerEnter(colliderB);
						}
						}else {
						if (ownerA._needProcessCollisions){
							for (j=0,m=scriptsA.length;j < m;j++){
								curFrameCol.other=colliderB;
								scriptsA[j].onCollisionEnter(curFrameCol);
							}
						}
					}
				}
				ownerB=colliderB.owner;
				scriptsB=ownerB._scripts;
				if (scriptsB){
					if (curFrameCol._isTrigger){
						if (ownerB._needProcessTriggers){
							for (j=0,m=scriptsB.length;j < m;j++)
							scriptsB[j].onTriggerEnter(colliderA);
						}
						}else {
						if (ownerB._needProcessCollisions){
							for (j=0,m=scriptsB.length;j < m;j++){
								curFrameCol.other=colliderA;
								scriptsB[j].onCollisionEnter(curFrameCol);
							}
						}
					}
				}
			}
		}
		for (i=0,n=this._previousFrameCollisions.length;i < n;i++){
			var preFrameCol=this._previousFrameCollisions[i];
			var preColliderA=preFrameCol._colliderA;
			var preColliderB=preFrameCol._colliderB;
			if (preColliderA.destroyed || preColliderB.destroyed)
				continue ;
			if (loopCount-preFrameCol._updateFrame===1){
				this._collisionsUtils.recoverCollision(preFrameCol);
				ownerA=preColliderA.owner;
				scriptsA=ownerA._scripts;
				if (scriptsA){
					if (preFrameCol._isTrigger){
						if (ownerA._needProcessTriggers){
							for (j=0,m=scriptsA.length;j < m;j++)
							scriptsA[j].onTriggerExit(preColliderB);
						}
						}else {
						if (ownerA._needProcessCollisions){
							for (j=0,m=scriptsA.length;j < m;j++){
								preFrameCol.other=preColliderB;
								scriptsA[j].onCollisionExit(preFrameCol);
							}
						}
					}
				}
				ownerB=preColliderB.owner;
				scriptsB=ownerB._scripts;
				if (scriptsB){
					if (preFrameCol._isTrigger){
						if (ownerB._needProcessTriggers){
							for (j=0,m=scriptsB.length;j < m;j++)
							scriptsB[j].onTriggerExit(preColliderA);
						}
						}else {
						if (ownerB._needProcessCollisions){
							for (j=0,m=scriptsB.length;j < m;j++){
								preFrameCol.other=preColliderA;
								scriptsB[j].onCollisionExit(preFrameCol);
							}
						}
					}
				}
			}
		}
	}

	/**
	*清除力。
	*/
	__proto.clearForces=function(){
		if (!this._nativeDiscreteDynamicsWorld)
			throw "Cannot perform this action when the physics engine is set to CollisionsOnly";
		this._nativeDiscreteDynamicsWorld.clearForces();
	}

	/**
	*设置重力。
	*/
	/**
	*获取重力。
	*/
	__getset(0,__proto,'gravity',function(){
		if (!this._nativeDiscreteDynamicsWorld)
			throw "Simulation:Cannot perform this action when the physics engine is set to CollisionsOnly";
		return this._gravity;
		},function(value){
		if (!this._nativeDiscreteDynamicsWorld)
			throw "Simulation:Cannot perform this action when the physics engine is set to CollisionsOnly";
		this._gravity=value;
		var gravityE=value.elements;
		var nativeGravity=PhysicsSimulation._nativeTempVector30;
		nativeGravity.setValue(-gravityE[0],gravityE[1],gravityE[2]);
		this._nativeDiscreteDynamicsWorld.setGravity(nativeGravity);
	});

	/**
	*设置是否进行连续碰撞检测。
	*@param value 是否进行连续碰撞检测。
	*/
	/**
	*获取是否进行连续碰撞检测。
	*@return 是否进行连续碰撞检测。
	*/
	__getset(0,__proto,'continuousCollisionDetection',function(){
		return this._nativeDispatchInfo.get_m_useContinuous();
		},function(value){
		this._nativeDispatchInfo.set_m_useContinuous(value);
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'speculativeContactRestitution',function(){
		if (!this._nativeDiscreteDynamicsWorld)
			throw "Simulation:Cannot Cannot perform this action when the physics engine is set to CollisionsOnly";
		return this._nativeDiscreteDynamicsWorld.getApplySpeculativeContactRestitution();
		},function(value){
		if (!this._nativeDiscreteDynamicsWorld)
			throw "Simulation:Cannot Cannot perform this action when the physics engine is set to CollisionsOnly";
		this._nativeDiscreteDynamicsWorld.setApplySpeculativeContactRestitution(value);
	});

	PhysicsSimulation.createConstraint=function(){}
	PhysicsSimulation.PHYSICSENGINEFLAGS_NONE=0x0;
	PhysicsSimulation.PHYSICSENGINEFLAGS_COLLISIONSONLY=0x1;
	PhysicsSimulation.PHYSICSENGINEFLAGS_SOFTBODYSUPPORT=0x2;
	PhysicsSimulation.PHYSICSENGINEFLAGS_MULTITHREADED=0x4;
	PhysicsSimulation.PHYSICSENGINEFLAGS_USEHARDWAREWHENPOSSIBLE=0x8;
	PhysicsSimulation.SOLVERMODE_RANDMIZE_ORDER=1;
	PhysicsSimulation.SOLVERMODE_FRICTION_SEPARATE=2;
	PhysicsSimulation.SOLVERMODE_USE_WARMSTARTING=4;
	PhysicsSimulation.SOLVERMODE_USE_2_FRICTION_DIRECTIONS=16;
	PhysicsSimulation.SOLVERMODE_ENABLE_FRICTION_DIRECTION_CACHING=32;
	PhysicsSimulation.SOLVERMODE_DISABLE_VELOCITY_DEPENDENT_FRICTION_DIRECTION=64;
	PhysicsSimulation.SOLVERMODE_CACHE_FRIENDLY=128;
	PhysicsSimulation.SOLVERMODE_SIMD=256;
	PhysicsSimulation.SOLVERMODE_INTERLEAVE_CONTACT_AND_FRICTION_CONSTRAINTS=512;
	PhysicsSimulation.SOLVERMODE_ALLOW_ZERO_LENGTH_FRICTION_DIRECTIONS=1024;
	PhysicsSimulation.disableSimulation=false;
	__static(PhysicsSimulation,
	['_nativeTempVector30',function(){return this._nativeTempVector30=new Laya3D._physics3D.btVector3(0,0,0);},'_nativeTempVector31',function(){return this._nativeTempVector31=new Laya3D._physics3D.btVector3(0,0,0);},'_nativeTempQuaternion0',function(){return this._nativeTempQuaternion0=new Laya3D._physics3D.btQuaternion(0,0,0,1);},'_nativeTempQuaternion1',function(){return this._nativeTempQuaternion1=new Laya3D._physics3D.btQuaternion(0,0,0,1);},'_nativeTempTransform0',function(){return this._nativeTempTransform0=new Laya3D._physics3D.btTransform();},'_nativeTempTransform1',function(){return this._nativeTempTransform1=new Laya3D._physics3D.btTransform();},'_tempVector30',function(){return this._tempVector30=new Vector3();}
	]);
	return PhysicsSimulation;
})()


/**
*...
*@author ...
*/
//class laya.d3.shadowMap.ParallelSplitShadowMap
var ParallelSplitShadowMap=(function(){
	function ParallelSplitShadowMap(){
		/**@private */
		//this.lastNearPlane=NaN;
		/**@private */
		//this.lastFieldOfView=NaN;
		/**@private */
		//this.lastAspectRatio=NaN;
		/**@private */
		this._currentPSSM=-1;
		/**@private */
		this._shadowMapCount=3;
		/**@private */
		this._maxDistance=200.0;
		/**@private */
		this._ratioOfDistance=1.0 / this._shadowMapCount;
		/**@private */
		this._statesDirty=true;
		/**@private */
		//this.cameras=null;
		/**@private */
		this._shadowMapTextureSize=1024;
		/**@private */
		this._scene=null;
		/**@private */
		this._PCFType=0;
		/**@private */
		this._shaderValueLightVP=null;
		/**@private */
		//this._shaderValueVPs=null;
		this._spiltDistance=new Array(/*CLASS CONST:laya.d3.shadowMap.ParallelSplitShadowMap.MAX_PSSM_COUNT*/3+1);
		this._globalParallelLightDir=new Vector3(0,-1,0);
		this._boundingSphere=new Array(/*CLASS CONST:laya.d3.shadowMap.ParallelSplitShadowMap.MAX_PSSM_COUNT*/3+1);
		this._boundingBox=new Array(/*CLASS CONST:laya.d3.shadowMap.ParallelSplitShadowMap.MAX_PSSM_COUNT*/3+1);
		this._frustumPos=new Array((/*CLASS CONST:laya.d3.shadowMap.ParallelSplitShadowMap.MAX_PSSM_COUNT*/3+1)*4);
		this._uniformDistance=new Array(/*CLASS CONST:laya.d3.shadowMap.ParallelSplitShadowMap.MAX_PSSM_COUNT*/3+1);
		this._logDistance=new Array(/*CLASS CONST:laya.d3.shadowMap.ParallelSplitShadowMap.MAX_PSSM_COUNT*/3+1);
		this._dimension=new Array(/*CLASS CONST:laya.d3.shadowMap.ParallelSplitShadowMap.MAX_PSSM_COUNT*/3+1);
		this._tempLookAt3=new Vector3();
		this._tempLookAt4=new Vector4();
		this._tempValue=new Vector4();
		this._tempPos=new Vector3();
		this._tempLightUp=new Vector3();
		this._tempMin=new Vector4();
		this._tempMax=new Vector4();
		this._tempMatrix44=new Matrix4x4;
		this._splitFrustumCulling=new BoundFrustum(Matrix4x4.DEFAULT);
		this._tempScaleMatrix44=new Matrix4x4();
		this._shadowPCFOffset=new Vector2(1.0 / 1024.0,1.0 / 1024.0);
		this._shaderValueDistance=new Vector4();
		this.cameras=[];
		this._shaderValueVPs=[];
		var i=0;
		for (i=0;i < this._spiltDistance.length;i++){
			this._spiltDistance[i]=0.0;
		}
		for (i=0;i < this._dimension.length;i++){
			this._dimension[i]=new Vector2();
		}
		for (i=0;i < this._frustumPos.length;i++){
			this._frustumPos[i]=new Vector3();
		}
		for (i=0;i < this._boundingBox.length;i++){
			this._boundingBox[i]=new BoundBox(new Vector3(),new Vector3());
		}
		for (i=0;i < this._boundingSphere.length;i++){
			this._boundingSphere[i]=new BoundSphere(new Vector3(),0.0);
		}
		Matrix4x4.createScaling(new Vector3(0.5,0.5,1.0),this._tempScaleMatrix44);
		this._tempScaleMatrix44.elements[12]=0.5;
		this._tempScaleMatrix44.elements[13]=0.5;
	}

	__class(ParallelSplitShadowMap,'laya.d3.shadowMap.ParallelSplitShadowMap');
	var __proto=ParallelSplitShadowMap.prototype;
	__proto.setInfo=function(scene,maxDistance,globalParallelDir,shadowMapTextureSize,numberOfPSSM,PCFType){
		if (numberOfPSSM > /*CLASS CONST:laya.d3.shadowMap.ParallelSplitShadowMap.MAX_PSSM_COUNT*/3){
			this._shadowMapCount=/*CLASS CONST:laya.d3.shadowMap.ParallelSplitShadowMap.MAX_PSSM_COUNT*/3;
		}
		this._scene=scene;
		this._maxDistance=maxDistance;
		this.shadowMapCount=numberOfPSSM;
		this._globalParallelLightDir=globalParallelDir;
		this._ratioOfDistance=1.0 / this._shadowMapCount;
		for (var i=0;i < this._spiltDistance.length;i++){
			this._spiltDistance[i]=0.0;
		}
		this._shadowMapTextureSize=shadowMapTextureSize;
		this._shadowPCFOffset.x=1.0 / this._shadowMapTextureSize;
		this._shadowPCFOffset.y=1.0 / this._shadowMapTextureSize;
		this.setPCFType(PCFType);
		this._statesDirty=true;
	}

	__proto.setPCFType=function(PCFtype){
		this._PCFType=PCFtype;
		var defineData=this._scene._defineDatas;
		switch (this._PCFType){
			case 0:
				defineData.add(Scene3D.SHADERDEFINE_SHADOW_PCF_NO);
				defineData.remove(Scene3D.SHADERDEFINE_SHADOW_PCF1);
				defineData.remove(Scene3D.SHADERDEFINE_SHADOW_PCF2);
				defineData.remove(Scene3D.SHADERDEFINE_SHADOW_PCF3);
				break ;
			case 1:
				defineData.add(Scene3D.SHADERDEFINE_SHADOW_PCF1);
				defineData.remove(Scene3D.SHADERDEFINE_SHADOW_PCF_NO);
				defineData.remove(Scene3D.SHADERDEFINE_SHADOW_PCF2);
				defineData.remove(Scene3D.SHADERDEFINE_SHADOW_PCF3);
				break ;
			case 2:
				defineData.add(Scene3D.SHADERDEFINE_SHADOW_PCF2);
				defineData.remove(Scene3D.SHADERDEFINE_SHADOW_PCF_NO);
				defineData.remove(Scene3D.SHADERDEFINE_SHADOW_PCF1);
				defineData.remove(Scene3D.SHADERDEFINE_SHADOW_PCF3);
				break ;
			case 3:
				defineData.add(Scene3D.SHADERDEFINE_SHADOW_PCF3);
				defineData.remove(Scene3D.SHADERDEFINE_SHADOW_PCF_NO);
				defineData.remove(Scene3D.SHADERDEFINE_SHADOW_PCF1);
				defineData.remove(Scene3D.SHADERDEFINE_SHADOW_PCF2);
				break ;
			}
	}

	__proto.getPCFType=function(){
		return this._PCFType;
	}

	__proto.setFarDistance=function(value){
		if (this._maxDistance !=value){
			this._maxDistance=value;
			this._statesDirty=true;
		}
	}

	__proto.getFarDistance=function(){
		return this._maxDistance;
	}

	/**
	*@private
	*/
	__proto._beginSampler=function(index,sceneCamera){
		if (index < 0 || index > this._shadowMapCount)
			throw new Error("ParallelSplitShadowMap: beginSample invalid index");
		this._currentPSSM=index;
		this._update(sceneCamera);
	}

	/**
	*@private
	*/
	__proto.endSampler=function(sceneCamera){
		this._currentPSSM=-1;
	}

	/**
	*@private
	*/
	__proto._calcAllLightCameraInfo=function(sceneCamera){
		if (this._shadowMapCount===1){
			this._beginSampler(0,sceneCamera);
			this.endSampler(sceneCamera);
			}else {
			for (var i=0,n=this._shadowMapCount+1;i < n;i++){
				this._beginSampler(i,sceneCamera);
				this.endSampler(sceneCamera);
			}
		}
	}

	/**
	*@private
	*/
	__proto._recalculate=function(nearPlane,fieldOfView,aspectRatio){
		this._calcSplitDistance(nearPlane);
		this._calcBoundingBox(fieldOfView,aspectRatio);
		this._rebuildRenderInfo();
	}

	/**
	*@private
	*/
	__proto._update=function(sceneCamera){
		var nearPlane=sceneCamera.nearPlane;
		var fieldOfView=sceneCamera.fieldOfView;
		var aspectRatio=(sceneCamera).aspectRatio;
		if (this._statesDirty || this.lastNearPlane!==nearPlane || this.lastFieldOfView!==fieldOfView || this.lastAspectRatio!==aspectRatio){
			this._recalculate(nearPlane,fieldOfView,aspectRatio);
			this._uploadShaderValue();
			this._statesDirty=false;
			this.lastNearPlane=nearPlane;
			this.lastFieldOfView=fieldOfView;
			this.lastAspectRatio=aspectRatio;
		}
		this._calcLightViewProject(sceneCamera);
	}

	/**
	*@private
	*/
	__proto._uploadShaderValue=function(){
		var defDatas=this._scene._defineDatas;
		switch (this._shadowMapCount){
			case 1:
				defDatas.add(Scene3D.SHADERDEFINE_SHADOW_PSSM1);
				defDatas.remove(Scene3D.SHADERDEFINE_SHADOW_PSSM2);
				defDatas.remove(Scene3D.SHADERDEFINE_SHADOW_PSSM3);
				break ;
			case 2:
				defDatas.add(Scene3D.SHADERDEFINE_SHADOW_PSSM2);
				defDatas.remove(Scene3D.SHADERDEFINE_SHADOW_PSSM1);
				defDatas.remove(Scene3D.SHADERDEFINE_SHADOW_PSSM3);
				break ;
			case 3:
				defDatas.add(Scene3D.SHADERDEFINE_SHADOW_PSSM3);
				defDatas.remove(Scene3D.SHADERDEFINE_SHADOW_PSSM1);
				defDatas.remove(Scene3D.SHADERDEFINE_SHADOW_PSSM2);
				break ;
			};
		var sceneSV=this._scene._shaderValues;
		sceneSV.setVector(Scene3D.SHADOWDISTANCE,this._shaderValueDistance);
		sceneSV.setBuffer(Scene3D.SHADOWLIGHTVIEWPROJECT,this._shaderValueLightVP);
		sceneSV.setVector(Scene3D.SHADOWMAPPCFOFFSET,this._shadowPCFOffset);
		switch (this._shadowMapCount){
			case 3:
				sceneSV.setTexture(Scene3D.SHADOWMAPTEXTURE1,this.cameras[1].renderTarget);
				sceneSV.setTexture(Scene3D.SHADOWMAPTEXTURE2,this.cameras[2].renderTarget)
				sceneSV.setTexture(Scene3D.SHADOWMAPTEXTURE3,this.cameras[3].renderTarget);
				break ;
			case 2:
				sceneSV.setTexture(Scene3D.SHADOWMAPTEXTURE1,this.cameras[1].renderTarget);
				sceneSV.setTexture(Scene3D.SHADOWMAPTEXTURE2,this.cameras[2].renderTarget);
				break ;
			case 1:
				sceneSV.setTexture(Scene3D.SHADOWMAPTEXTURE1,this.cameras[1].renderTarget);
				break ;
			}
	}

	/**
	*@private
	*/
	__proto._calcSplitDistance=function(nearPlane){
		var far=this._maxDistance;
		var invNumberOfPSSM=1.0 / this._shadowMapCount;
		var i=0;
		for (i=0;i <=this._shadowMapCount;i++){
			this._uniformDistance[i]=nearPlane+(far-nearPlane)*i *invNumberOfPSSM;
		};
		var farDivNear=far / nearPlane;
		for (i=0;i <=this._shadowMapCount;i++){
			var n=Math.pow(farDivNear,i *invNumberOfPSSM);
			this._logDistance[i]=nearPlane *n;
		}
		for (i=0;i <=this._shadowMapCount;i++){
			this._spiltDistance[i]=this._uniformDistance[i] *this._ratioOfDistance+this._logDistance[i] *(1.0-this._ratioOfDistance);
		}
		this._shaderValueDistance.x=this._spiltDistance[1];
		this._shaderValueDistance.y=this._spiltDistance[2];
		this._shaderValueDistance.z=this._spiltDistance[3];
		this._shaderValueDistance.w=this._spiltDistance[4];
	}

	/**
	*@private
	*/
	__proto._calcBoundingBox=function(fieldOfView,aspectRatio){
		var fov=3.1415926 *fieldOfView / 180.0;
		var halfTanValue=Math.tan(fov / 2.0);
		var height=NaN;
		var width=NaN;
		var distance=NaN;
		var i=0;
		for (i=0;i <=this._shadowMapCount;i++){
			distance=this._spiltDistance[i];
			height=distance *halfTanValue;
			width=height *aspectRatio;
			var temp=this._frustumPos[i *4+0].elements;
			temp[0]=-width;
			temp[1]=-height;
			temp[2]=-distance;
			temp=this._frustumPos[i *4+1].elements;
			temp[0]=width;
			temp[1]=-height;
			temp[2]=-distance;
			temp=this._frustumPos[i *4+2].elements;
			temp[0]=-width;
			temp[1]=height;
			temp[2]=-distance;
			temp=this._frustumPos[i *4+3].elements;
			temp[0]=width;
			temp[1]=height;
			temp[2]=-distance;
			temp=this._dimension[i].elements;
			temp[0]=width;
			temp[1]=height;
		};
		var d;
		var min;
		var max;
		var center;
		for (i=1;i <=this._shadowMapCount;i++){
			d=this._dimension[i].elements;
			min=this._boundingBox[i].min.elements;
			min[0]=-d[0];
			min[1]=-d[1];
			min[2]=-this._spiltDistance[i];
			max=this._boundingBox[i].max.elements;
			max[0]=d[0];
			max[1]=d[1];
			max[2]=-this._spiltDistance[i-1];
			center=this._boundingSphere[i].center.elements;
			center[0]=(min[0]+max[0])*0.5;
			center[1]=(min[1]+max[1])*0.5;
			center[2]=(min[2]+max[2])*0.5;
			this._boundingSphere[i].radius=Math.sqrt(Math.pow(max[0]-min[0],2)+Math.pow(max[1]-min[1],2)+Math.pow(max[2]-min[2],2))*0.5;
		}
		min=this._boundingBox[0].min.elements;
		d=this._dimension[this._shadowMapCount].elements;
		min[0]=-d[0];
		min[1]=-d[1];
		min[2]=-this._spiltDistance[this._shadowMapCount];
		max=this._boundingBox[0].max.elements;
		max[0]=d[0];
		max[1]=d[1];
		max[2]=-this._spiltDistance[0];
		center=this._boundingSphere[0].center.elements;
		center[0]=(min[0]+max[0])*0.5;
		center[1]=(min[1]+max[1])*0.5;
		center[2]=(min[2]+max[2])*0.5;
		this._boundingSphere[0].radius=Math.sqrt(Math.pow(max[0]-min[0],2)+Math.pow(max[1]-min[1],2)+Math.pow(max[2]-min[2],2))*0.5;
	}

	__proto.calcSplitFrustum=function(sceneCamera){
		if (this._currentPSSM > 0){
			Matrix4x4.createPerspective(3.1416 *sceneCamera.fieldOfView / 180.0,(sceneCamera).aspectRatio,this._spiltDistance[this._currentPSSM-1],this._spiltDistance[this._currentPSSM],this._tempMatrix44);
			}else {
			Matrix4x4.createPerspective(3.1416 *sceneCamera.fieldOfView / 180.0,(sceneCamera).aspectRatio,this._spiltDistance[0],this._spiltDistance[this._shadowMapCount],this._tempMatrix44);
		}
		Matrix4x4.multiply(this._tempMatrix44,(sceneCamera).viewMatrix,this._tempMatrix44);
		this._splitFrustumCulling.matrix=this._tempMatrix44;
	}

	/**
	*@private
	*/
	__proto._rebuildRenderInfo=function(){
		var nNum=this._shadowMapCount+1;
		var i=0;
		this.cameras.length=nNum;
		for (i=0;i < nNum;i++){
			if (!this.cameras[i]){
				var camera=new Camera();
				camera.name="lightCamera"+i;
				camera.clearColor=new Vector4(1.0,1.0,1.0,1.0);
				this.cameras[i]=camera;
			};
			var shadowMap=this.cameras[i].renderTarget;
			if (shadowMap==null || shadowMap.width !=this._shadowMapTextureSize || shadowMap.height !=this._shadowMapTextureSize){
				(shadowMap)&& (shadowMap.destroy());
				shadowMap=new RenderTexture(this._shadowMapTextureSize,this._shadowMapTextureSize,/*laya.webgl.resource.BaseTexture.FORMAT_R8G8B8A8*/1,/*laya.webgl.resource.BaseTexture.FORMAT_DEPTH_16*/0);
				shadowMap.filterMode=/*laya.webgl.resource.BaseTexture.FILTERMODE_POINT*/0;
				this.cameras[i].renderTarget=shadowMap;
			}
		}
	}

	/**
	*@private
	*/
	__proto._calcLightViewProject=function(sceneCamera){
		var boundSphere=this._boundingSphere[this._currentPSSM];
		var cameraMatViewInv=sceneCamera.transform.worldMatrix;
		var radius=boundSphere.radius;
		boundSphere.center.cloneTo(this._tempLookAt3);
		Vector3.transformV3ToV4(this._tempLookAt3,cameraMatViewInv,this._tempLookAt4);
		var lookAt3Element=this._tempLookAt3.elements;
		var lookAt4Element=this._tempLookAt4.elements;
		lookAt3Element[0]=lookAt4Element[0];
		lookAt3Element[1]=lookAt4Element[1];
		lookAt3Element[2]=lookAt4Element[2];
		var lightUpElement=this._tempLightUp.elements;
		sceneCamera.transform.worldMatrix.getForward(ParallelSplitShadowMap._tempVector30);
		var sceneCameraDir=ParallelSplitShadowMap._tempVector30.elements;
		lightUpElement[0]=sceneCameraDir[0];
		lightUpElement[1]=1.0;
		lightUpElement[2]=sceneCameraDir[2];
		Vector3.normalize(this._tempLightUp,this._tempLightUp);
		Vector3.scale(this._globalParallelLightDir,boundSphere.radius *4,this._tempPos);
		Vector3.subtract(this._tempLookAt3,this._tempPos,this._tempPos);
		var curLightCamera=this.cameras[this._currentPSSM];
		curLightCamera.transform.position=this._tempPos;
		curLightCamera.transform.lookAt(this._tempLookAt3,this._tempLightUp,false);
		var tempMaxElements=this._tempMax.elements;
		var tempMinElements=this._tempMin.elements;
		tempMaxElements[0]=tempMaxElements[1]=tempMaxElements[2]=-100000.0;
		tempMaxElements[3]=1.0;
		tempMinElements[0]=tempMinElements[1]=tempMinElements[2]=100000.0;
		tempMinElements[3]=1.0;
		Matrix4x4.multiply(curLightCamera.viewMatrix,cameraMatViewInv,this._tempMatrix44);
		var tempValueElement=this._tempValue.elements;
		var corners=[];
		corners.length=8;
		this._boundingBox[this._currentPSSM].getCorners(corners);
		for (var i=0;i < 8;i++){
			var frustumPosElements=corners[i].elements;
			tempValueElement[0]=frustumPosElements[0];
			tempValueElement[1]=frustumPosElements[1];
			tempValueElement[2]=frustumPosElements[2];
			tempValueElement[3]=1.0;
			Vector4.transformByM4x4(this._tempValue,this._tempMatrix44,this._tempValue);
			tempMinElements[0]=(tempValueElement[0] < tempMinElements[0])? tempValueElement[0] :tempMinElements[0];
			tempMinElements[1]=(tempValueElement[1] < tempMinElements[1])? tempValueElement[1] :tempMinElements[1];
			tempMinElements[2]=(tempValueElement[2] < tempMinElements[2])? tempValueElement[2] :tempMinElements[2];
			tempMaxElements[0]=(tempValueElement[0] > tempMaxElements[0])? tempValueElement[0] :tempMaxElements[0];
			tempMaxElements[1]=(tempValueElement[1] > tempMaxElements[1])? tempValueElement[1] :tempMaxElements[1];
			tempMaxElements[2]=(tempValueElement[2] > tempMaxElements[2])? tempValueElement[2] :tempMaxElements[2];
		}
		Vector4.add(this._tempMax,this._tempMin,this._tempValue);
		tempValueElement[0] *=0.5;
		tempValueElement[1] *=0.5;
		tempValueElement[2] *=0.5;
		tempValueElement[3]=1;
		Vector4.transformByM4x4(this._tempValue,curLightCamera.transform.worldMatrix,this._tempValue);
		var distance=Math.abs(-this._tempMax.z);
		var farPlane=distance > this._maxDistance ? distance :this._maxDistance;
		Vector3.scale(this._globalParallelLightDir,farPlane,this._tempPos);
		var tempPosElement=this._tempPos.elements;
		tempPosElement[0]=tempValueElement[0]-tempPosElement[0];
		tempPosElement[1]=tempValueElement[1]-tempPosElement[1];
		tempPosElement[2]=tempValueElement[2]-tempPosElement[2];
		curLightCamera.transform.position=this._tempPos;
		curLightCamera.transform.lookAt(this._tempLookAt3,this._tempLightUp,false);
		Matrix4x4.createOrthoOffCenterRH(tempMinElements[0],tempMaxElements[0],tempMinElements[1],tempMaxElements[1],1.0,farPlane+0.5 *(tempMaxElements[2]-tempMinElements[2]),curLightCamera.projectionMatrix);
		var projectView=curLightCamera.projectionViewMatrix;
		ParallelSplitShadowMap.multiplyMatrixOutFloat32Array(this._tempScaleMatrix44,projectView,this._shaderValueVPs[this._currentPSSM]);
		this._scene._shaderValues.setBuffer(Scene3D.SHADOWLIGHTVIEWPROJECT,this._shaderValueLightVP);
	}

	__proto.setShadowMapTextureSize=function(size){
		if (size!==this._shadowMapTextureSize){
			this._shadowMapTextureSize=size;
			this._shadowPCFOffset.x=1 / this._shadowMapTextureSize;
			this._shadowPCFOffset.y=1 / this._shadowMapTextureSize;
			this._statesDirty=true;
		}
	}

	__proto.disposeAllRenderTarget=function(){
		for (var i=0,n=this._shadowMapCount+1;i < n;i++){
			if (this.cameras[i].renderTarget){
				this.cameras[i].renderTarget.destroy();
				this.cameras[i].renderTarget=null;
			}
		}
	}

	__getset(0,__proto,'shadowMapCount',function(){
		return this._shadowMapCount;
		},function(value){
		value=value > 0 ? value :1;
		value=value <=3 ? value :3;
		if (this._shadowMapCount !=value){
			this._shadowMapCount=value;
			this._ratioOfDistance=1.0 / this._shadowMapCount;
			this._statesDirty=true;
			this._shaderValueLightVP=new Float32Array(value *16);
			this._shaderValueVPs.length=value;
			for (var i=0;i < value;i++)
			this._shaderValueVPs[i]=new Float32Array(this._shaderValueLightVP.buffer,i *64);
		}
	});

	ParallelSplitShadowMap.multiplyMatrixOutFloat32Array=function(left,right,out){
		var i,a,b,ai0,ai1,ai2,ai3;
		a=left.elements;
		b=right.elements;
		for (i=0;i < 4;i++){
			ai0=a[i];
			ai1=a[i+4];
			ai2=a[i+8];
			ai3=a[i+12];
			out[i]=ai0 *b[0]+ai1 *b[1]+ai2 *b[2]+ai3 *b[3];
			out[i+4]=ai0 *b[4]+ai1 *b[5]+ai2 *b[6]+ai3 *b[7];
			out[i+8]=ai0 *b[8]+ai1 *b[9]+ai2 *b[10]+ai3 *b[11];
			out[i+12]=ai0 *b[12]+ai1 *b[13]+ai2 *b[14]+ai3 *b[15];
		}
	}

	ParallelSplitShadowMap.MAX_PSSM_COUNT=3;
	__static(ParallelSplitShadowMap,
	['_tempVector30',function(){return this._tempVector30=new Vector3();}
	]);
	return ParallelSplitShadowMap;
})()


/**

*/
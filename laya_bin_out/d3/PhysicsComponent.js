/**
*<code>PhysicsComponent</code> 类用于创建物理组件的父类。
*/
//class laya.d3.physics.PhysicsComponent extends laya.components.Component
var PhysicsComponent=(function(_super){
	function PhysicsComponent(collisionGroup,canCollideWith){
		/**@private */
		this._restitution=0.0;
		/**@private */
		this._friction=0.5;
		/**@private */
		this._rollingFriction=0.0;
		/**@private */
		this._ccdMotionThreshold=0.0;
		/**@private */
		this._ccdSweptSphereRadius=0.0;
		/**@private */
		this._colliderShape=null;
		/**@private */
		this._transformFlag=2147483647;
		/**@private */
		//this._nativeColliderObject=null;
		/**@private */
		//this._simulation=null;
		/**@private */
		this._enableProcessCollisions=true;
		/**@private */
		this._inPhysicUpdateListIndex=-1;
		/**是否可以缩放Shape。 */
		this.canScaleShape=true;
		PhysicsComponent.__super.call(this);
		this._collisionGroup=/*laya.d3.utils.Physics3DUtils.COLLISIONFILTERGROUP_DEFAULTFILTER*/0x1;
		this._canCollideWith=Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER;
		this._collisionGroup=collisionGroup;
		this._canCollideWith=canCollideWith;
		PhysicsComponent._physicObjectsMap[this.id]=this;
	}

	__class(PhysicsComponent,'laya.d3.physics.PhysicsComponent',_super);
	var __proto=PhysicsComponent.prototype;
	/**
	*@private
	*/
	__proto._isValid=function(){
		return this._simulation && this._colliderShape && this._enabled;
	}

	/**
	*@inheritDoc
	*/
	__proto._parse=function(data){
		(data.collisionGroup !=null)&& (this.collisionGroup=data.collisionGroup);
		(data.canCollideWith !=null)&& (this.canCollideWith=data.canCollideWith);
		(data.ccdMotionThreshold !=null)&& (this.ccdMotionThreshold=data.ccdMotionThreshold);
		(data.ccdSweptSphereRadius !=null)&& (this.ccdSweptSphereRadius=data.ccdSweptSphereRadius);
	}

	/**
	*@private
	*/
	__proto._parseShape=function(shapesData){
		var shapeCount=shapesData.length;
		if (shapeCount===1){
			var shape=ColliderShape._creatShape(shapesData[0]);
			this.colliderShape=shape;
			}else {
			var compoundShape=new CompoundColliderShape();
			for (var i=0;i < shapeCount;i++){
				shape=ColliderShape._creatShape(shapesData[i]);
				compoundShape.addChildShape(shape);
			}
			this.colliderShape=compoundShape;
		}
	}

	/**
	*@private
	*/
	__proto._onScaleChange=function(scale){
		this._colliderShape._setScale(scale);
	}

	/**
	*@private
	*/
	__proto._setTransformFlag=function(type,value){
		if (value)
			this._transformFlag |=type;
		else
		this._transformFlag &=~type;
	}

	/**
	*@private
	*/
	__proto._getTransformFlag=function(type){
		return (this._transformFlag & type)!=0;
	}

	/**
	*@private
	*/
	__proto._addToSimulation=function(){}
	/**
	*@private
	*/
	__proto._removeFromSimulation=function(){}
	/**
	*@private
	*/
	__proto._derivePhysicsTransformation=function(force){
		this._innerDerivePhysicsTransformation(this._nativeColliderObject.getWorldTransform(),force);
	}

	/**
	*@private
	*通过渲染矩阵更新物理矩阵。
	*/
	__proto._innerDerivePhysicsTransformation=function(physicTransformOut,force){
		var transform=(this.owner)._transform;
		var rotationE=transform.rotation.elements;
		if (force || this._getTransformFlag(/*laya.d3.core.Transform3D.TRANSFORM_WORLDPOSITION*/0x08)){
			var shapeOffset=this._colliderShape.localOffset;
			var shapeOffsetE=shapeOffset.elements;
			var position=transform.position;
			var positionE=position.elements;
			var nativePosition=PhysicsComponent._nativeVector30;
			if (shapeOffsetE[0]!==0 || shapeOffsetE[1]!==0 || shapeOffsetE[2]!==0){
				var physicPosition=PhysicsComponent._tempVector30;
				var physicPositionE=physicPosition.elements;
				PhysicsComponent.physicVector3TransformQuat(shapeOffset,rotationE[0],rotationE[1],rotationE[2],rotationE[3],physicPosition);
				Vector3.add(position,physicPosition,physicPosition);
				nativePosition.setValue(-physicPositionE[0],physicPositionE[1],physicPositionE[2]);
				}else {
				nativePosition.setValue(-positionE[0],positionE[1],positionE[2]);
			}
			physicTransformOut.setOrigin(nativePosition);
			this._setTransformFlag(/*laya.d3.core.Transform3D.TRANSFORM_WORLDPOSITION*/0x08,false);
		}
		if (force || this._getTransformFlag(/*laya.d3.core.Transform3D.TRANSFORM_WORLDQUATERNION*/0x10)){
			var shapeRotation=this._colliderShape.localRotation;
			var shapeRotationE=shapeRotation.elements;
			var nativeRotation=PhysicsComponent._nativeQuaternion0;
			if (shapeRotationE[0]!==0 || shapeRotationE[1]!==0 || shapeRotationE[2]!==0 || shapeRotationE[3]!==1){
				var physicRotation=PhysicsComponent._tempQuaternion0;
				PhysicsComponent.physicQuaternionMultiply(rotationE[0],rotationE[1],rotationE[2],rotationE[3],shapeRotation,physicRotation);
				var physicRotationE=physicRotation.elements;
				nativeRotation.setValue(-physicRotationE[0],physicRotationE[1],physicRotationE[2],-physicRotationE[3]);
				}else {
				nativeRotation.setValue(-rotationE[0],rotationE[1],rotationE[2],-rotationE[3]);
			}
			physicTransformOut.setRotation(nativeRotation);
			this._setTransformFlag(/*laya.d3.core.Transform3D.TRANSFORM_WORLDQUATERNION*/0x10,false);
		}
		if (force || this._getTransformFlag(/*laya.d3.core.Transform3D.TRANSFORM_WORLDSCALE*/0x20)){
			this._onScaleChange(transform.scale);
			this._setTransformFlag(/*laya.d3.core.Transform3D.TRANSFORM_WORLDSCALE*/0x20,false);
		}
	}

	/**
	*@private
	*通过物理矩阵更新渲染矩阵。
	*/
	__proto._updateTransformComponent=function(physicsTransform){
		var localOffset=this._colliderShape.localOffset;
		var localRotation=this._colliderShape.localRotation;
		var shapeOffsetE=localOffset.elements;
		var shapeRotationE=localRotation.elements;
		var transform=(this.owner)._transform;
		var position=transform.position;
		var rotation=transform.rotation;
		var positionE=position.elements;
		var nativePosition=physicsTransform.getOrigin();
		var nativeRotation=physicsTransform.getRotation();
		var nativeRotX=-nativeRotation.x();
		var nativeRotY=nativeRotation.y();
		var nativeRotZ=nativeRotation.z();
		var nativeRotW=-nativeRotation.w();
		if (shapeOffsetE[0]!==0 || shapeOffsetE[1]!==0 || shapeOffsetE[2]!==0){
			var rotShapePosition=PhysicsComponent._tempVector30;
			PhysicsComponent.physicVector3TransformQuat(localOffset,nativeRotX,nativeRotY,nativeRotZ,nativeRotW,rotShapePosition);
			var rotShapePositionE=rotShapePosition.elements;
			positionE[0]=-nativePosition.x()-rotShapePositionE[0];
			positionE[1]=nativePosition.y()-rotShapePositionE[1];
			positionE[2]=nativePosition.z()-rotShapePositionE[2];
			}else {
			positionE[0]=-nativePosition.x();
			positionE[1]=nativePosition.y();
			positionE[2]=nativePosition.z();
		}
		transform.position=position;
		if (shapeRotationE[0]!==0 || shapeRotationE[1]!==0 || shapeRotationE[2]!==0 || shapeRotationE[3]!==1){
			var invertShapeRotaion=PhysicsComponent._tempQuaternion0;
			localRotation.invert(invertShapeRotaion);
			PhysicsComponent.physicQuaternionMultiply(nativeRotX,nativeRotY,nativeRotZ,nativeRotW,invertShapeRotaion,rotation);
			}else {
			var rotationE=rotation.elements;
			rotationE[0]=nativeRotX;
			rotationE[1]=nativeRotY;
			rotationE[2]=nativeRotZ;
			rotationE[3]=nativeRotW;
		}
		transform.rotation=rotation;
	}

	/**
	*@inheritDoc
	*/
	__proto._onEnable=function(){
		this._simulation=(this.owner._scene).physicsSimulation;
		this._nativeColliderObject.setContactProcessingThreshold(1e30);
		if (this._colliderShape && this._enabled){
			this._derivePhysicsTransformation(true);
			this._addToSimulation();
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._onDisable=function(){
		if (this._colliderShape && this._enabled)
			this._removeFromSimulation();
		this._simulation=null;
	}

	/**
	*@private
	*/
	__proto._onShapeChange=function(colShape){
		var btColObj=this._nativeColliderObject;
		var flags=btColObj.getCollisionFlags();
		if (colShape.needsCustomCollisionCallback){
			if ((flags & 8)===0)
				btColObj.setCollisionFlags(flags | 8);
			}else {
			if ((flags & 8)> 0)
				btColObj.setCollisionFlags(flags ^ 8);
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._onAdded=function(){
		this.enabled=this._enabled;
		this.restitution=this._restitution;
		this.friction=this._friction;
		this.rollingFriction=this._rollingFriction;
		this.ccdMotionThreshold=this._ccdMotionThreshold;
		this.ccdSweptSphereRadius=this._ccdSweptSphereRadius;
		(this.owner).transform.on(/*laya.events.Event.TRANSFORM_CHANGED*/"transformchanged",this,this._onTransformChanged);
	}

	/**
	*@inheritDoc
	*/
	__proto._onDestroy=function(){
		var physics3D=Laya3D._physics3D;
		delete PhysicsComponent._physicObjectsMap[this.id];
		physics3D.destroy(this._nativeColliderObject);
		this._colliderShape.destroy();
		_super.prototype._onDestroy.call(this);
		this._nativeColliderObject=null;
		this._colliderShape=null;
		this._simulation=null;
		(this.owner).transform.off(/*laya.events.Event.TRANSFORM_CHANGED*/"transformchanged",this,this._onTransformChanged);
	}

	/**
	*@private
	*/
	__proto._onTransformChanged=function(flag){
		if (PhysicsComponent._addUpdateList){
			flag &=/*laya.d3.core.Transform3D.TRANSFORM_WORLDPOSITION*/0x08 | /*laya.d3.core.Transform3D.TRANSFORM_WORLDQUATERNION*/0x10 | /*laya.d3.core.Transform3D.TRANSFORM_WORLDSCALE*/0x20;
			if (flag){
				this._transformFlag |=flag;
				if (this._isValid()&& this._inPhysicUpdateListIndex===-1)
					this._simulation._physicsUpdateList.add(this);
			}
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._cloneTo=function(dest){
		var destPhysicsComponent=dest;
		destPhysicsComponent.restitution=this._restitution;
		destPhysicsComponent.friction=this._friction;
		destPhysicsComponent.rollingFriction=this._rollingFriction;
		destPhysicsComponent.ccdMotionThreshold=this._ccdMotionThreshold;
		destPhysicsComponent.ccdSweptSphereRadius=this._ccdSweptSphereRadius;
		destPhysicsComponent.collisionGroup=this._collisionGroup;
		destPhysicsComponent.canCollideWith=this._canCollideWith;
		destPhysicsComponent.canScaleShape=this.canScaleShape;
		(this._colliderShape)&& (destPhysicsComponent.colliderShape=this._colliderShape.clone());
	}

	/**
	*获取是否激活。
	*/
	__getset(0,__proto,'isActive',function(){
		return this._nativeColliderObject ? this._nativeColliderObject.isActive():false;
	});

	/**
	*设置弹力。
	*@param 弹力。
	*/
	/**
	*获取弹力。
	*@return 弹力。
	*/
	__getset(0,__proto,'restitution',function(){
		return this._restitution;
		},function(value){
		this._restitution=value;
		this._nativeColliderObject && this._nativeColliderObject.setRestitution(value);
	});

	/**
	*设置摩擦力。
	*@param value 摩擦力。
	*/
	/**
	*获取摩擦力。
	*@return 摩擦力。
	*/
	__getset(0,__proto,'friction',function(){
		return this._friction;
		},function(value){
		this._friction=value;
		this._nativeColliderObject && this._nativeColliderObject.setFriction(value);
	});

	/**
	*设置滚动摩擦力。
	*@param 滚动摩擦力。
	*/
	/**
	*获取滚动摩擦力。
	*@return 滚动摩擦力。
	*/
	__getset(0,__proto,'rollingFriction',function(){
		return this._nativeColliderObject.getRollingFriction();
		},function(value){
		this._rollingFriction=value;
		this._nativeColliderObject && this._nativeColliderObject.setRollingFriction(value);
	});

	/**
	*设置用于连续碰撞检测(CCD)的速度阈值，当物体移动速度小于该值时不进行CCD检测,防止快速移动物体(例如:子弹)错误的穿过其它物体,0表示禁止。
	*@param value 连续碰撞检测(CCD)的速度阈值。
	*/
	/**
	*获取用于连续碰撞检测(CCD)的速度阈值,当物体移动速度小于该值时不进行CCD检测,防止快速移动物体(例如:子弹)错误的穿过其它物体,0表示禁止。
	*@return 连续碰撞检测(CCD)的速度阈值。
	*/
	__getset(0,__proto,'ccdMotionThreshold',function(){
		return this._ccdMotionThreshold;
		},function(value){
		this._ccdMotionThreshold=value;
		this._nativeColliderObject && this._nativeColliderObject.setCcdMotionThreshold(value);
	});

	/**
	*设置用于进入连续碰撞检测(CCD)范围的球半径。
	*@param 球半径。
	*/
	/**
	*获取用于进入连续碰撞检测(CCD)范围的球半径。
	*@return 球半径。
	*/
	__getset(0,__proto,'ccdSweptSphereRadius',function(){
		return this._ccdSweptSphereRadius;
		},function(value){
		this._ccdSweptSphereRadius=value;
		this._nativeColliderObject && this._nativeColliderObject.setCcdSweptSphereRadius(value);
	});

	/**
	*设置所属碰撞组。
	*@param 所属碰撞组。
	*/
	/**
	*获取所属碰撞组。
	*@return 所属碰撞组。
	*/
	__getset(0,__proto,'collisionGroup',function(){
		return this._collisionGroup;
		},function(value){
		if (this._collisionGroup!==value){
			this._collisionGroup=value;
			if (this._simulation && this._colliderShape && this._enabled){
				this._removeFromSimulation();
				this._addToSimulation();
			}
		}
	});

	/**
	*获取模拟器。
	*@return 模拟器。
	*/
	__getset(0,__proto,'simulation',function(){
		return this._simulation;
	});

	/**
	*设置碰撞形状。
	*/
	/**
	*获取碰撞形状。
	*/
	__getset(0,__proto,'colliderShape',function(){
		return this._colliderShape;
		},function(value){
		var lastColliderShape=this._colliderShape;
		if (lastColliderShape){
			lastColliderShape._attatched=false;
			lastColliderShape._attatchedCollisionObject=null;
		}
		this._colliderShape=value;
		if (value){
			if (value._attatched){
				throw "PhysicsComponent: this shape has attatched to other entity.";
				}else {
				value._attatched=true;
				value._attatchedCollisionObject=this;
			}
			if (this._nativeColliderObject){
				this._nativeColliderObject.setCollisionShape(value._nativeShape);
				var canInSimulation=this._simulation && this._enabled;
				(canInSimulation && lastColliderShape)&& (this._removeFromSimulation());
				this._onShapeChange(value);
				if (canInSimulation){
					this._derivePhysicsTransformation(true);
					this._addToSimulation();
				}
			}
			}else {
			if (this._simulation && this._enabled)
				lastColliderShape && this._removeFromSimulation();
		}
	});

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'enabled',_super.prototype._$get_enabled,function(value){
		if (this._simulation && this._colliderShape){
			if (value){
				this._derivePhysicsTransformation(true);
				this._addToSimulation();
				}else {
				this._removeFromSimulation();
			}
		}
		Laya.superSet(Component,this,'enabled',value);
	});

	/**
	*设置可碰撞的碰撞组。
	*@param 可碰撞组。
	*/
	/**
	*获取可碰撞的碰撞组。
	*@return 可碰撞组。
	*/
	__getset(0,__proto,'canCollideWith',function(){
		return this._canCollideWith;
		},function(value){
		if (this._canCollideWith!==value){
			this._canCollideWith=value;
			if (this._simulation && this._colliderShape && this._enabled){
				this._removeFromSimulation();
				this._addToSimulation();
			}
		}
	});

	PhysicsComponent._createAffineTransformationArray=function(tranX,tranY,tranZ,rotX,rotY,rotZ,rotW,scale,outE){
		var x2=rotX+rotX,y2=rotY+rotY,z2=rotZ+rotZ;
		var xx=rotX *x2,xy=rotX *y2,xz=rotX *z2,yy=rotY *y2,yz=rotY *z2,zz=rotZ *z2;
		var wx=rotW *x2,wy=rotW *y2,wz=rotW *z2,sx=scale[0],sy=scale[1],sz=scale[2];
		outE[0]=(1-(yy+zz))*sx;
		outE[1]=(xy+wz)*sx;
		outE[2]=(xz-wy)*sx;
		outE[3]=0;
		outE[4]=(xy-wz)*sy;
		outE[5]=(1-(xx+zz))*sy;
		outE[6]=(yz+wx)*sy;
		outE[7]=0;
		outE[8]=(xz+wy)*sz;
		outE[9]=(yz-wx)*sz;
		outE[10]=(1-(xx+yy))*sz;
		outE[11]=0;
		outE[12]=tranX;
		outE[13]=tranY;
		outE[14]=tranZ;
		outE[15]=1;
	}

	PhysicsComponent.physicVector3TransformQuat=function(source,qx,qy,qz,qw,out){
		var destination=out.elements;
		var se=source.elements;
		var x=se[0],y=se[1],z=se[2],
		ix=qw *x+qy *z-qz *y,iy=qw *y+qz *x-qx *z,iz=qw *z+qx *y-qy *x,iw=-qx *x-qy *y-qz *z;
		destination[0]=ix *qw+iw *-qx+iy *-qz-iz *-qy;
		destination[1]=iy *qw+iw *-qy+iz *-qx-ix *-qz;
		destination[2]=iz *qw+iw *-qz+ix *-qy-iy *-qx;
	}

	PhysicsComponent.physicQuaternionMultiply=function(lx,ly,lz,lw,right,out){
		var re=right.elements;
		var oe=out.elements;
		var rx=re[0];
		var ry=re[1];
		var rz=re[2];
		var rw=re[3];
		var a=(ly *rz-lz *ry);
		var b=(lz *rx-lx *rz);
		var c=(lx *ry-ly *rx);
		var d=(lx *rx+ly *ry+lz *rz);
		oe[0]=(lx *rw+rx *lw)+a;
		oe[1]=(ly *rw+ry *lw)+b;
		oe[2]=(lz *rw+rz *lw)+c;
		oe[3]=lw *rw-d;
	}

	PhysicsComponent.ACTIVATIONSTATE_ACTIVE_TAG=1;
	PhysicsComponent.ACTIVATIONSTATE_ISLAND_SLEEPING=2;
	PhysicsComponent.ACTIVATIONSTATE_WANTS_DEACTIVATION=3;
	PhysicsComponent.ACTIVATIONSTATE_DISABLE_DEACTIVATION=4;
	PhysicsComponent.ACTIVATIONSTATE_DISABLE_SIMULATION=5;
	PhysicsComponent.COLLISIONFLAGS_STATIC_OBJECT=1;
	PhysicsComponent.COLLISIONFLAGS_KINEMATIC_OBJECT=2;
	PhysicsComponent.COLLISIONFLAGS_NO_CONTACT_RESPONSE=4;
	PhysicsComponent.COLLISIONFLAGS_CUSTOM_MATERIAL_CALLBACK=8;
	PhysicsComponent.COLLISIONFLAGS_CHARACTER_OBJECT=16;
	PhysicsComponent.COLLISIONFLAGS_DISABLE_VISUALIZE_OBJECT=32;
	PhysicsComponent.COLLISIONFLAGS_DISABLE_SPU_COLLISION_PROCESSING=64;
	PhysicsComponent._physicObjectsMap={};
	PhysicsComponent._addUpdateList=true;
	__static(PhysicsComponent,
	['_tempVector30',function(){return this._tempVector30=new Vector3();},'_tempQuaternion0',function(){return this._tempQuaternion0=new Quaternion();},'_tempQuaternion1',function(){return this._tempQuaternion1=new Quaternion();},'_tempMatrix4x40',function(){return this._tempMatrix4x40=new Matrix4x4();},'_nativeVector30',function(){return this._nativeVector30=new Laya3D._physics3D.btVector3(0,0,0);},'_nativeQuaternion0',function(){return this._nativeQuaternion0=new Laya3D._physics3D.btQuaternion(0,0,0,1);}
	]);
	return PhysicsComponent;
})(Component)


/**

*/
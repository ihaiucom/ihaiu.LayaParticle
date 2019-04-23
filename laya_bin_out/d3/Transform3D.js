/**
*<code>Transform3D</code> 类用于实现3D变换。
*/
//class laya.d3.core.Transform3D extends laya.events.EventDispatcher
var Transform3D=(function(_super){
	function Transform3D(owner){
		/**@private */
		this._owner=null;
		/**@private */
		this._children=null;
		/**@private */
		this._parent=null;
		/**@private */
		this._dummy=null;
		/**@private */
		this._transformFlag=0;
		/**变换中心点,注意:该中心点不受变换的影响。*/
		this.pivot=null;
		Transform3D.__super.call(this);
		this._localPosition=new Vector3(0,0,0);
		this._localRotation=new Quaternion(0,0,0,1);
		this._localScale=new Vector3(1,1,1);
		this._localRotationEuler=new Vector3(0,0,0);
		this._localMatrix=new Matrix4x4();
		this._position=new Vector3(0,0,0);
		this._rotation=new Quaternion(0,0,0,1);
		this._scale=new Vector3(1,1,1);
		this._rotationEuler=new Vector3(0,0,0);
		this._worldMatrix=new Matrix4x4();
		this._forward=new Vector3();
		this._up=new Vector3();
		this._right=new Vector3();
		this._owner=owner;
		this._children=[];
		this._setTransformFlag(0x01 | 0x02 | 0x04,false);
		this._setTransformFlag(0x08 | 0x10 | 0x80 | 0x20 | 0x40,true);
	}

	__class(Transform3D,'laya.d3.core.Transform3D',_super);
	var __proto=Transform3D.prototype;
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
	__proto._setParent=function(value){
		if (this._parent!==value){
			if (this._parent){
				var parentChilds=this._parent._children;
				var index=parentChilds.indexOf(this);
				parentChilds.splice(index,1);
			}
			if (value){
				value._children.push(this);
				(value)&& (this._onWorldTransform());
			}
			this._parent=value;
		}
	}

	/**
	*@private
	*/
	__proto._updateLocalMatrix=function(){
		if (this.pivot && (this.pivot.x!==0 || this.pivot.y!==0 || this.pivot.z!==0)){
			var scalePivot=Transform3D._tempVector30;
			Vector3.multiply(this.pivot,this._localScale,scalePivot);
			var scaleOffsetPosition=Transform3D._tempVector31;
			Vector3.subtract(scalePivot,this.pivot,scaleOffsetPosition);
			var rotationOffsetPosition=Transform3D._tempVector32;
			var localRot=this.localRotation;
			Vector3.transformQuat(scalePivot,localRot,rotationOffsetPosition);
			Vector3.subtract(rotationOffsetPosition,scalePivot,rotationOffsetPosition);
			var resultLocalPosition=Transform3D._tempVector33;
			Vector3.subtract(this._localPosition,scaleOffsetPosition,resultLocalPosition);
			Vector3.subtract(resultLocalPosition,rotationOffsetPosition,resultLocalPosition);
			Matrix4x4.createAffineTransformation(resultLocalPosition,localRot,this._localScale,this._localMatrix);
			}else {
			Matrix4x4.createAffineTransformation(this._localPosition,this.localRotation,this._localScale,this._localMatrix);
		}
	}

	/**
	*@private
	*/
	__proto._onWorldPositionRotationTransform=function(){
		if (!this._getTransformFlag(0x40)|| !this._getTransformFlag(0x08)|| !this._getTransformFlag(0x10)|| !this._getTransformFlag(0x80)){
			this._setTransformFlag(0x40 | 0x08 | 0x10 | 0x80,true);
			this.event(/*laya.events.Event.TRANSFORM_CHANGED*/"transformchanged",this._transformFlag);
			for (var i=0,n=this._children.length;i < n;i++)
			this._children[i]._onWorldPositionRotationTransform();
		}
	}

	/**
	*@private
	*/
	__proto._onWorldPositionScaleTransform=function(){
		if (!this._getTransformFlag(0x40)|| !this._getTransformFlag(0x08)|| !this._getTransformFlag(0x20)){
			this._setTransformFlag(0x40 | 0x08 | 0x20,true);
			this.event(/*laya.events.Event.TRANSFORM_CHANGED*/"transformchanged",this._transformFlag);
			for (var i=0,n=this._children.length;i < n;i++)
			this._children[i]._onWorldPositionScaleTransform();
		}
	}

	/**
	*@private
	*/
	__proto._onWorldPositionTransform=function(){
		if (!this._getTransformFlag(0x40)|| !this._getTransformFlag(0x08)){
			this._setTransformFlag(0x40 | 0x08,true);
			this.event(/*laya.events.Event.TRANSFORM_CHANGED*/"transformchanged",this._transformFlag);
			for (var i=0,n=this._children.length;i < n;i++)
			this._children[i]._onWorldPositionTransform();
		}
	}

	/**
	*@private
	*/
	__proto._onWorldRotationTransform=function(){
		if (!this._getTransformFlag(0x40)|| !this._getTransformFlag(0x10)|| !this._getTransformFlag(0x80)){
			this._setTransformFlag(0x40 | 0x10 | 0x80,true);
			this.event(/*laya.events.Event.TRANSFORM_CHANGED*/"transformchanged",this._transformFlag);
			for (var i=0,n=this._children.length;i < n;i++)
			this._children[i]._onWorldPositionRotationTransform();
		}
	}

	/**
	*@private
	*/
	__proto._onWorldScaleTransform=function(){
		if (!this._getTransformFlag(0x40)|| !this._getTransformFlag(0x20)){
			this._setTransformFlag(0x40 | 0x20,true);
			this.event(/*laya.events.Event.TRANSFORM_CHANGED*/"transformchanged",this._transformFlag);
			for (var i=0,n=this._children.length;i < n;i++)
			this._children[i]._onWorldPositionScaleTransform();
		}
	}

	/**
	*@private
	*/
	__proto._onWorldTransform=function(){
		if (!this._getTransformFlag(0x40)|| !this._getTransformFlag(0x08)|| !this._getTransformFlag(0x10)|| !this._getTransformFlag(0x80)|| !this._getTransformFlag(0x20)){
			this._setTransformFlag(0x40 | 0x08 | 0x10 | 0x80 | 0x20,true);
			this.event(/*laya.events.Event.TRANSFORM_CHANGED*/"transformchanged",this._transformFlag);
			for (var i=0,n=this._children.length;i < n;i++)
			this._children[i]._onWorldTransform();
		}
	}

	/**
	*平移变换。
	*@param translation 移动距离。
	*@param isLocal 是否局部空间。
	*/
	__proto.translate=function(translation,isLocal){
		(isLocal===void 0)&& (isLocal=true);
		if (isLocal){
			Matrix4x4.createFromQuaternion(this.localRotation,Transform3D._tempMatrix0);
			Vector3.transformCoordinate(translation,Transform3D._tempMatrix0,Transform3D._tempVector30);
			Vector3.add(this.localPosition,Transform3D._tempVector30,this._localPosition);
			this.localPosition=this._localPosition;
			}else {
			Vector3.add(this.position,translation,this._position);
			this.position=this._position;
		}
	}

	/**
	*旋转变换。
	*@param rotations 旋转幅度。
	*@param isLocal 是否局部空间。
	*@param isRadian 是否弧度制。
	*/
	__proto.rotate=function(rotation,isLocal,isRadian){
		(isLocal===void 0)&& (isLocal=true);
		(isRadian===void 0)&& (isRadian=true);
		var rot;
		if (isRadian){
			rot=rotation;
			}else {
			Vector3.scale(rotation,Math.PI / 180.0,Transform3D._tempVector30);
			rot=Transform3D._tempVector30;
		}
		Quaternion.createFromYawPitchRoll(rot.y,rot.x,rot.z,Transform3D._tempQuaternion0);
		if (isLocal){
			Quaternion.multiply(this._localRotation,Transform3D._tempQuaternion0,this._localRotation);
			this.localRotation=this._localRotation;
			}else {
			Quaternion.multiply(Transform3D._tempQuaternion0,this.rotation,this._rotation);
			this.rotation=this._rotation;
		}
	}

	/**
	*观察目标位置。
	*@param target 观察目标。
	*@param up 向上向量。
	*@param isLocal 是否局部空间。
	*/
	__proto.lookAt=function(target,up,isLocal){
		(isLocal===void 0)&& (isLocal=false);
		var targetE=target.elements;
		var eyeE;
		if (isLocal){
			eyeE=this._localPosition.elements;
			if (Math.abs(eyeE[0]-targetE[0])< MathUtils3D.zeroTolerance && Math.abs(eyeE[1]-targetE[1])< MathUtils3D.zeroTolerance && Math.abs(eyeE[2]-targetE[2])< MathUtils3D.zeroTolerance)
				return;
			Quaternion.lookAt(this._localPosition,target,up,this._localRotation);
			this._localRotation.invert(this._localRotation);
			this.localRotation=this._localRotation;
			}else {
			var worldPosition=this.position;
			eyeE=worldPosition.elements;
			if (Math.abs(eyeE[0]-targetE[0])< MathUtils3D.zeroTolerance && Math.abs(eyeE[1]-targetE[1])< MathUtils3D.zeroTolerance && Math.abs(eyeE[2]-targetE[2])< MathUtils3D.zeroTolerance)
				return;
			Quaternion.lookAt(worldPosition,target,up,this._rotation);
			this._rotation.invert(this._rotation);
			this.rotation=this._rotation;
		}
	}

	/**
	*@private
	*/
	__getset(0,__proto,'_isFrontFaceInvert',function(){
		var scale=this.scale;
		var isInvert=scale.x < 0;
		(scale.y < 0)&& (isInvert=!isInvert);
		(scale.z < 0)&& (isInvert=!isInvert);
		return isInvert;
	});

	/**
	*获取所属精灵。
	*/
	__getset(0,__proto,'owner',function(){
		return this._owner;
	});

	/**
	*设置局部位置Y轴分量。
	*@param y 局部位置Y轴分量。
	*/
	/**
	*获取局部位置Y轴分量。
	*@return 局部位置Y轴分量。
	*/
	__getset(0,__proto,'localPositionY',function(){
		return this._localPosition.elements[1];
		},function(y){
		this._localPosition.elements[1]=y;
		this.localPosition=this._localPosition;
	});

	/**
	*设置局部缩放X。
	*@param value 局部缩放X。
	*/
	/**
	*获取局部缩放X。
	*@return 局部缩放X。
	*/
	__getset(0,__proto,'localScaleX',function(){
		return this._localScale.elements[0];
		},function(value){
		this._localScale.elements[0]=value;
		this.localScale=this._localScale;
	});

	/**
	*获取世界矩阵是否需要更新。
	*@return 世界矩阵是否需要更新。
	*/
	__getset(0,__proto,'worldNeedUpdate',function(){
		return this._getTransformFlag(0x40);
	});

	/**
	*设置局部位置X轴分量。
	*@param x 局部位置X轴分量。
	*/
	/**
	*获取局部位置X轴分量。
	*@return 局部位置X轴分量。
	*/
	__getset(0,__proto,'localPositionX',function(){
		return this._localPosition.elements[0];
		},function(x){
		this._localPosition.elements[0]=x;
		this.localPosition=this._localPosition;
	});

	/**
	*设置局部位置。
	*@param value 局部位置。
	*/
	/**
	*获取局部位置。
	*@return 局部位置。
	*/
	__getset(0,__proto,'localPosition',function(){
		return this._localPosition;
		},function(value){
		if (this._localPosition!==value)
			value.cloneTo(this._localPosition);
		this._setTransformFlag(0x04,true);
		this._onWorldPositionTransform();
	});

	/**
	*设置局部位置Z轴分量。
	*@param z 局部位置Z轴分量。
	*/
	/**
	*获取局部位置Z轴分量。
	*@return 局部位置Z轴分量。
	*/
	__getset(0,__proto,'localPositionZ',function(){
		return this._localPosition.elements[2];
		},function(z){
		this._localPosition.elements[2]=z;
		this.localPosition=this._localPosition;
	});

	/**
	*设置局部旋转四元数X分量。
	*@param x 局部旋转四元数X分量。
	*/
	/**
	*获取局部旋转四元数X分量。
	*@return 局部旋转四元数X分量。
	*/
	__getset(0,__proto,'localRotationX',function(){
		return this.localRotation.elements[0];
		},function(x){
		this._localRotation.elements[0]=x;
		this.localRotation=this._localRotation;
	});

	/**
	*设置局部旋转四元数Y分量。
	*@param y 局部旋转四元数Y分量。
	*/
	/**
	*获取局部旋转四元数Y分量。
	*@return 局部旋转四元数Y分量。
	*/
	__getset(0,__proto,'localRotationY',function(){
		return this.localRotation.elements[1];
		},function(y){
		this._localRotation.elements[1]=y;
		this.localRotation=this._localRotation;
	});

	/**
	*设置局部旋转四元数Z分量。
	*@param z 局部旋转四元数Z分量。
	*/
	/**
	*获取局部旋转四元数Z分量。
	*@return 局部旋转四元数Z分量。
	*/
	__getset(0,__proto,'localRotationZ',function(){
		return this.localRotation.elements[2];
		},function(z){
		this._localRotation.elements[2]=z;
		this.localRotation=this._localRotation;
	});

	/**
	*设置局部旋转四元数W分量。
	*@param w 局部旋转四元数W分量。
	*/
	/**
	*获取局部旋转四元数W分量。
	*@return 局部旋转四元数W分量。
	*/
	__getset(0,__proto,'localRotationW',function(){
		return this.localRotation.elements[3];
		},function(w){
		this._localRotation.elements[3]=w;
		this.localRotation=this._localRotation;
	});

	/**
	*设置局部旋转。
	*@param value 局部旋转。
	*/
	/**
	*获取局部旋转。
	*@return 局部旋转。
	*/
	__getset(0,__proto,'localRotation',function(){
		if (this._getTransformFlag(0x01)){
			var eulerE=this._localRotationEuler.elements;
			Quaternion.createFromYawPitchRoll(eulerE[1] / Transform3D._angleToRandin,eulerE[0] / Transform3D._angleToRandin,eulerE[2] / Transform3D._angleToRandin,this._localRotation);
			this._setTransformFlag(0x01,false);
		}
		return this._localRotation;
		},function(value){
		if (this._localRotation!==value)
			value.cloneTo(this._localRotation);
		this._localRotation.normalize(this._localRotation);
		this._setTransformFlag(0x02 | 0x04,true);
		this._setTransformFlag(0x01,false);
		if (this.pivot && (this.pivot.x!==0 || this.pivot.y!==0 || this.pivot.z!==0))
			this._onWorldPositionRotationTransform();
		else
		this._onWorldRotationTransform();
	});

	/**
	*设置局部缩放Y。
	*@param value 局部缩放Y。
	*/
	/**
	*获取局部缩放Y。
	*@return 局部缩放Y。
	*/
	__getset(0,__proto,'localScaleY',function(){
		return this._localScale.elements[1];
		},function(value){
		this._localScale.elements[1]=value;
		this.localScale=this._localScale;
	});

	/**
	*设置局部缩放Z。
	*@param value 局部缩放Z。
	*/
	/**
	*获取局部缩放Z。
	*@return 局部缩放Z。
	*/
	__getset(0,__proto,'localScaleZ',function(){
		return this._localScale.elements[2];
		},function(value){
		this._localScale.elements[2]=value;
		this.localScale=this._localScale;
	});

	/**
	*设置世界位置。
	*@param value 世界位置。
	*/
	/**
	*获取世界位置。
	*@return 世界位置。
	*/
	__getset(0,__proto,'position',function(){
		if (this._getTransformFlag(0x08)){
			if (this._parent !=null){
				var parentPosition=this._parent.position;
				Vector3.multiply(this._localPosition,this._parent.scale,Transform3D._tempVector30);
				Vector3.transformQuat(Transform3D._tempVector30,this._parent.rotation,Transform3D._tempVector30);
				Vector3.add(parentPosition,Transform3D._tempVector30,this._position);
				}else {
				this._localPosition.cloneTo(this._position);
			}
			this._setTransformFlag(0x08,false);
		}
		return this._position;
		},function(value){
		if (this._parent !=null){
			Vector3.subtract(value,this._parent.position,this._localPosition);
			var parentScaleE=this._parent.scale.elements;
			var psX=parentScaleE[0],psY=parentScaleE[1],psZ=parentScaleE[2];
			if (psX!==1.0 || psY!==1.0 || psZ!==1.0){
				var invertScale=Transform3D._tempVector30;
				var invertScaleE=invertScale.elements;
				invertScaleE[0]=1.0 / psX;
				invertScaleE[1]=1.0 / psY;
				invertScaleE[2]=1.0 / psZ;
				Vector3.multiply(this._localPosition,invertScale,this._localPosition);
			};
			var parentRotation=this._parent.rotation;
			parentRotation.invert(Transform3D._tempQuaternion0);
			Vector3.transformQuat(this._localPosition,Transform3D._tempQuaternion0,this._localPosition);
			}else {
			value.cloneTo(this._localPosition);
		}
		this.localPosition=this._localPosition;
		if (this._position!==value)
			value.cloneTo(this._position);
		this._setTransformFlag(0x08,false);
	});

	/**
	*设置局部空间的Y轴欧拉角。
	*@param value 局部空间的Y轴欧拉角。
	*/
	/**
	*获取局部空间的Y轴欧拉角。
	*@return 局部空间的Y轴欧拉角。
	*/
	__getset(0,__proto,'localRotationEulerY',function(){
		return this.localRotationEuler.elements[1];
		},function(value){
		this._localRotationEuler.elements[1]=value;
		this.localRotationEuler=this._localRotationEuler;
	});

	/**
	*设置局部缩放。
	*@param value 局部缩放。
	*/
	/**
	*获取局部缩放。
	*@return 局部缩放。
	*/
	__getset(0,__proto,'localScale',function(){
		return this._localScale;
		},function(value){
		if (this._localScale!==value)
			value.cloneTo(this._localScale);
		this._setTransformFlag(0x04,true);
		if (this.pivot && (this.pivot.x!==0 || this.pivot.y!==0 || this.pivot.z!==0))
			this._onWorldPositionScaleTransform();
		else
		this._onWorldScaleTransform();
	});

	/**
	*设置局部空间的X轴欧拉角。
	*@param value 局部空间的X轴欧拉角。
	*/
	/**
	*获取局部空间的X轴欧拉角。
	*@return 局部空间的X轴欧拉角。
	*/
	__getset(0,__proto,'localRotationEulerX',function(){
		return this.localRotationEuler.elements[0];
		},function(value){
		this._localRotationEuler.elements[0]=value;
		this.localRotationEuler=this._localRotationEuler;
	});

	/**
	*设置局部空间的Z轴欧拉角。
	*@param value 局部空间的Z轴欧拉角。
	*/
	/**
	*获取局部空间的Z轴欧拉角。
	*@return 局部空间的Z轴欧拉角。
	*/
	__getset(0,__proto,'localRotationEulerZ',function(){
		return this.localRotationEuler.elements[2];
		},function(value){
		this._localRotationEuler.elements[2]=value;
		this.localRotationEuler=this._localRotationEuler;
	});

	/**
	*设置局部空间的欧拉角。
	*@param value 欧拉角的旋转值。
	*/
	/**
	*获取局部空间欧拉角。
	*@return 欧拉角的旋转值。
	*/
	__getset(0,__proto,'localRotationEuler',function(){
		if (this._getTransformFlag(0x02)){
			this._localRotation.getYawPitchRoll(Transform3D._tempVector30);
			var eulerE=Transform3D._tempVector30.elements;
			var localRotationEulerE=this._localRotationEuler.elements;
			localRotationEulerE[0]=eulerE[1] *Transform3D._angleToRandin;
			localRotationEulerE[1]=eulerE[0] *Transform3D._angleToRandin;
			localRotationEulerE[2]=eulerE[2] *Transform3D._angleToRandin;
			this._setTransformFlag(0x02,false);
		}
		return this._localRotationEuler;
		},function(value){
		if (this._localRotationEuler!==value)
			value.cloneTo(this._localRotationEuler);
		this._setTransformFlag(0x02,false);
		this._setTransformFlag(0x01 | 0x04,true);
		if (this.pivot && (this.pivot.x!==0 || this.pivot.y!==0 || this.pivot.z!==0))
			this._onWorldPositionRotationTransform();
		else
		this._onWorldRotationTransform();
	});

	/**
	*设置局部矩阵。
	*@param value 局部矩阵。
	*/
	/**
	*获取局部矩阵。
	*@return 局部矩阵。
	*/
	__getset(0,__proto,'localMatrix',function(){
		if (this._getTransformFlag(0x04)){
			this._updateLocalMatrix();
			this._setTransformFlag(0x04,false);
		}
		return this._localMatrix;
		},function(value){
		if (this._localMatrix!==value)
			value.cloneTo(this._localMatrix);
		this._localMatrix.decomposeTransRotScale(this._localPosition,this._localRotation,this._localScale);
		this._setTransformFlag(0x04,false);
		this._onWorldTransform();
	});

	/**
	*设置世界旋转。
	*@param value 世界旋转。
	*/
	/**
	*获取世界旋转。
	*@return 世界旋转。
	*/
	__getset(0,__proto,'rotation',function(){
		if (this._getTransformFlag(0x10)){
			if (this._parent !=null)
				Quaternion.multiply(this._parent.rotation,this.localRotation,this._rotation);
			else
			this.localRotation.cloneTo(this._rotation);
			this._setTransformFlag(0x10,false);
		}
		return this._rotation;
		},function(value){
		if (this._parent !=null){
			this._parent.rotation.invert(Transform3D._tempQuaternion0);
			Quaternion.multiply(Transform3D._tempQuaternion0,value,this._localRotation);
			}else {
			value.cloneTo(this._localRotation);
		}
		this.localRotation=this._localRotation;
		if (value!==this._rotation)
			value.cloneTo(this._rotation);
		this._setTransformFlag(0x10,false);
	});

	/**
	*设置世界缩放。
	*@param value 世界缩放。
	*/
	/**
	*获取世界缩放。
	*@return 世界缩放。
	*/
	__getset(0,__proto,'scale',function(){
		if (!this._getTransformFlag(0x20))
			return this._scale;
		if (this._parent!==null)
			Vector3.multiply(this._parent.scale,this._localScale,this._scale);
		else
		this._localScale.cloneTo(this._scale);
		this._setTransformFlag(0x20,false);
		return this._scale;
		},function(value){
		if (this._parent!==null){
			var pScaleE=this._parent.scale.elements;
			var invPScaleE=Transform3D._tempVector30.elements;
			invPScaleE[0]=1.0 / pScaleE[0];
			invPScaleE[1]=1.0 / pScaleE[1];
			invPScaleE[2]=1.0 / pScaleE[2];
			Vector3.multiply(value,Transform3D._tempVector30,this._localScale);
			}else {
			value.cloneTo(this._localScale);
		}
		this.localScale=this._localScale;
		if (this._scale!==value)
			value.cloneTo(this._scale);
		this._setTransformFlag(0x20,false);
	});

	/**
	*设置世界空间的旋转角度。
	*@param 欧拉角的旋转值，顺序为x、y、z。
	*/
	/**
	*获取世界空间的旋转角度。
	*@return 欧拉角的旋转值，顺序为x、y、z。
	*/
	__getset(0,__proto,'rotationEuler',function(){
		if (this._getTransformFlag(0x80)){
			this.rotation.getYawPitchRoll(Transform3D._tempVector30);
			var eulerE=Transform3D._tempVector30.elements;
			var rotationEulerE=this._rotationEuler.elements;
			rotationEulerE[0]=eulerE[1] *Transform3D._angleToRandin;
			rotationEulerE[1]=eulerE[0] *Transform3D._angleToRandin;
			rotationEulerE[2]=eulerE[2] *Transform3D._angleToRandin;
			this._setTransformFlag(0x80,false);
		}
		return this._rotationEuler;
		},function(value){
		Quaternion.createFromYawPitchRoll(value.y / Transform3D._angleToRandin,value.x / Transform3D._angleToRandin,value.z / Transform3D._angleToRandin,this._rotation);
		this.rotation=this._rotation;
		if (this._rotationEuler!==value)
			value.cloneTo(this._rotationEuler);
		this._setTransformFlag(0x80,false);
	});

	/**
	*设置世界矩阵。
	*@param value 世界矩阵。
	*/
	/**
	*获取世界矩阵。
	*@return 世界矩阵。
	*/
	__getset(0,__proto,'worldMatrix',function(){
		if (this._getTransformFlag(0x40)){
			if (this._parent !=null)
				Matrix4x4.multiply(this._parent.worldMatrix,this.localMatrix,this._worldMatrix);
			else
			this.localMatrix.cloneTo(this._worldMatrix);
			this._setTransformFlag(0x40,false);
		}
		return this._worldMatrix;
		},function(value){
		if (this._parent===null){
			value.cloneTo(this._localMatrix);
			}else {
			this._parent.worldMatrix.invert(this._localMatrix);
			Matrix4x4.multiply(this._localMatrix,value,this._localMatrix);
		}
		this.localMatrix=this._localMatrix;
		if (this._worldMatrix!==value)
			value.cloneTo(this._worldMatrix);
		this._setTransformFlag(0x40,false);
	});

	/**
	*获取向前方向。
	*@return 向前方向。
	*/
	__getset(0,__proto,'forward',function(){
		var worldMatElem=this.worldMatrix.elements;
		this._forward.elements[0]=-worldMatElem[8];
		this._forward.elements[1]=-worldMatElem[9];
		this._forward.elements[2]=-worldMatElem[10];
		return this._forward;
	});

	/**
	*获取向上方向。
	*@return 向上方向。
	*/
	__getset(0,__proto,'up',function(){
		var worldMatElem=this.worldMatrix.elements;
		this._up.elements[0]=worldMatElem[4];
		this._up.elements[1]=worldMatElem[5];
		this._up.elements[2]=worldMatElem[6];
		return this._up;
	});

	/**
	*获取向右方向。
	*@return 向右方向。
	*/
	__getset(0,__proto,'right',function(){
		var worldMatElem=this.worldMatrix.elements;
		this._right.elements[0]=worldMatElem[0];
		this._right.elements[1]=worldMatElem[1];
		this._right.elements[2]=worldMatElem[2];
		return this._right;
	});

	Transform3D.TRANSFORM_LOCALQUATERNION=0x01;
	Transform3D.TRANSFORM_LOCALEULER=0x02;
	Transform3D.TRANSFORM_LOCALMATRIX=0x04;
	Transform3D.TRANSFORM_WORLDPOSITION=0x08;
	Transform3D.TRANSFORM_WORLDQUATERNION=0x10;
	Transform3D.TRANSFORM_WORLDSCALE=0x20;
	Transform3D.TRANSFORM_WORLDMATRIX=0x40;
	Transform3D.TRANSFORM_WORLDEULER=0x80;
	__static(Transform3D,
	['_tempVector30',function(){return this._tempVector30=new Vector3();},'_tempVector31',function(){return this._tempVector31=new Vector3();},'_tempVector32',function(){return this._tempVector32=new Vector3();},'_tempVector33',function(){return this._tempVector33=new Vector3();},'_tempQuaternion0',function(){return this._tempQuaternion0=new Quaternion();},'_tempMatrix0',function(){return this._tempMatrix0=new Matrix4x4();},'_angleToRandin',function(){return this._angleToRandin=180 / Math.PI;}
	]);
	return Transform3D;
})(EventDispatcher)


/**

*/
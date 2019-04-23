/**
*<code>AnimationTransform3D</code> 类用于实现3D变换。
*/
//class laya.d3.animation.AnimationTransform3D extends laya.events.EventDispatcher
var AnimationTransform3D=(function(_super){
	function AnimationTransform3D(owner,localPosition,localRotation,localScale,worldMatrix){
		/**@private */
		//this._localMatrix=null;
		/**@private */
		//this._worldMatrix=null;
		/**@private */
		//this._localPosition=null;
		/**@private */
		//this._localRotation=null;
		/**@private */
		//this._localScale=null;
		/**@private */
		//this._localQuaternionUpdate=false;
		/**@private */
		//this._locaEulerlUpdate=false;
		/**@private */
		//this._localUpdate=false;
		/**@private */
		//this._parent=null;
		/**@private */
		//this._children=null;
		/**@private */
		//this._localRotationEuler=null;
		/**@private */
		//this._owner=null;
		/**@private */
		//this._worldUpdate=false;
		AnimationTransform3D.__super.call(this);
		this._owner=owner;
		this._children=[];
		this._localMatrix=new Float32Array(16);
		if (Render.isConchApp){
			this._localPosition=new Vector3(0,0,0,localPosition);
			this._localRotation=new Quaternion(0,0,0,1,localRotation);
			this._localScale=new Vector3(0,0,0,localScale);
			this._worldMatrix=worldMatrix;
			}else {
			this._localPosition=new Vector3();
			this._localRotation=new Quaternion();
			this._localScale=new Vector3();
			this._worldMatrix=new Float32Array(16);
		}
		this._localQuaternionUpdate=false;
		this._locaEulerlUpdate=false;
		this._localUpdate=false;
		this._worldUpdate=true;
	}

	__class(AnimationTransform3D,'laya.d3.animation.AnimationTransform3D',_super);
	var __proto=AnimationTransform3D.prototype;
	/**
	*@private
	*/
	__proto._getlocalMatrix=function(){
		if (this._localUpdate){
			Utils3D._createAffineTransformationArray(this._localPosition.elements,this._localRotation.elements,this._localScale.elements,this._localMatrix);
			this._localUpdate=false;
		}
		return this._localMatrix;
	}

	/**
	*@private
	*/
	__proto._onWorldTransform=function(){
		if (!this._worldUpdate){
			this._worldUpdate=true;
			for (var i=0,n=this._children.length;i < n;i++)
			this._children[i]._onWorldTransform();
		}
	}

	/**
	*获取世界矩阵。
	*@return 世界矩阵。
	*/
	__proto.getWorldMatrix=function(){
		if (!Render.isConchApp && this._worldUpdate){
			if (this._parent !=null){
				Utils3D.matrix4x4MultiplyFFF(this._parent.getWorldMatrix(),this._getlocalMatrix(),this._worldMatrix);
				}else {
				var locMat=this._getlocalMatrix();
				for (var i=0;i < 16;++i)
				this._worldMatrix[i]=locMat[i];
			}
			this._worldUpdate=false;
		}
		return this._worldMatrix;
	}

	/**
	*设置父3D变换。
	*@param value 父3D变换。
	*/
	__proto.setParent=function(value){
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
	/**
	*@private
	*/
	__getset(0,__proto,'localPosition',function(){
		return this._localPosition;
		},function(value){
		this._localPosition=value;
		this._localUpdate=true;
		this._onWorldTransform();
	});

	/*
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'localRotation',function(){
		if (this._localQuaternionUpdate){
			var eulerE=this._localRotationEuler.elements;
			Quaternion.createFromYawPitchRoll(eulerE[1] / AnimationTransform3D._angleToRandin,eulerE[0] / AnimationTransform3D._angleToRandin,eulerE[2] / AnimationTransform3D._angleToRandin,this._localRotation);
			this._localQuaternionUpdate=false;
		}
		return this._localRotation;
		},function(value){
		this._localRotation=value;
		this._locaEulerlUpdate=true;
		this._localQuaternionUpdate=false;
		this._localUpdate=true;
		this._onWorldTransform();
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'localScale',function(){
		return this._localScale;
		},function(value){
		this._localScale=value;
		this._localUpdate=true;
		this._onWorldTransform();
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'localRotationEuler',function(){
		if (this._locaEulerlUpdate){
			this._localRotation.getYawPitchRoll(AnimationTransform3D._tempVector3);
			var eulerE=AnimationTransform3D._tempVector3.elements;
			var localRotationEulerE=this._localRotationEuler.elements;
			localRotationEulerE[0]=eulerE[1] *AnimationTransform3D._angleToRandin;
			localRotationEulerE[1]=eulerE[0] *AnimationTransform3D._angleToRandin;
			localRotationEulerE[2]=eulerE[2] *AnimationTransform3D._angleToRandin;
			this._locaEulerlUpdate=false;
		}
		return this._localRotationEuler;
		},function(value){
		this._localRotationEuler=value;
		this._locaEulerlUpdate=false;
		this._localQuaternionUpdate=true;
		this._localUpdate=true;
		this._onWorldTransform();
	});

	__static(AnimationTransform3D,
	['_tempVector3',function(){return this._tempVector3=new Vector3();},'_angleToRandin',function(){return this._angleToRandin=180 / Math.PI;}
	]);
	return AnimationTransform3D;
})(EventDispatcher)


/**

*/
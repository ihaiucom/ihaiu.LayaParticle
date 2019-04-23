/**
*<code>CapsuleColliderShape</code> 类用于创建胶囊形状碰撞器。
*/
//class laya.d3.physics.shape.CapsuleColliderShape extends laya.d3.physics.shape.ColliderShape
var CapsuleColliderShape=(function(_super){
	function CapsuleColliderShape(radius,length,orientation){
		/**@private */
		//this._radius=NaN;
		/**@private */
		//this._length=NaN;
		/**@private */
		//this._orientation=0;
		CapsuleColliderShape.__super.call(this);
		(radius===void 0)&& (radius=0.5);
		(length===void 0)&& (length=1.25);
		(orientation===void 0)&& (orientation=/*laya.d3.physics.shape.ColliderShape.SHAPEORIENTATION_UPY*/1);
		this._radius=radius;
		this._length=length;
		this._orientation=orientation;
		this._type=/*laya.d3.physics.shape.ColliderShape.SHAPETYPES_CAPSULE*/3;
		switch (orientation){
			case /*laya.d3.physics.shape.ColliderShape.SHAPEORIENTATION_UPX*/0:
				this._nativeShape=new Laya3D._physics3D.btCapsuleShapeX(radius,length-radius *2);
				break ;
			case /*laya.d3.physics.shape.ColliderShape.SHAPEORIENTATION_UPY*/1:
				this._nativeShape=new Laya3D._physics3D.btCapsuleShape(radius,length-radius *2);
				break ;
			case /*laya.d3.physics.shape.ColliderShape.SHAPEORIENTATION_UPZ*/2:
				this._nativeShape=new Laya3D._physics3D.btCapsuleShapeZ(radius,length-radius *2);
				break ;
			default :
				throw "CapsuleColliderShape:unknown orientation.";
			}
	}

	__class(CapsuleColliderShape,'laya.d3.physics.shape.CapsuleColliderShape',_super);
	var __proto=CapsuleColliderShape.prototype;
	/**
	*@inheritDoc
	*/
	__proto._setScale=function(value){
		var fixScale=CapsuleColliderShape._tempVector30;
		var valueE=value.elements;
		var fixScaleE=fixScale.elements;
		switch (this.orientation){
			case /*laya.d3.physics.shape.ColliderShape.SHAPEORIENTATION_UPX*/0:
				fixScaleE[0]=valueE[0];
				fixScaleE[1]=fixScaleE[2]=Math.max(valueE[1],valueE[2]);
				break ;
			case /*laya.d3.physics.shape.ColliderShape.SHAPEORIENTATION_UPY*/1:
				fixScaleE[1]=valueE[1];
				fixScaleE[0]=fixScaleE[2]=Math.max(valueE[0],valueE[2]);
				break ;
			case /*laya.d3.physics.shape.ColliderShape.SHAPEORIENTATION_UPZ*/2:
				fixScaleE[2]=valueE[2];
				fixScaleE[0]=fixScaleE[1]=Math.max(valueE[0],valueE[1]);
				break ;
			default :
				throw "CapsuleColliderShape:unknown orientation.";
			}
		_super.prototype._setScale.call(this,fixScale);
	}

	/**
	*@inheritDoc
	*/
	__proto.clone=function(){
		var dest=new CapsuleColliderShape(this._radius,this._length,this._orientation);
		this.cloneTo(dest);
		return dest;
	}

	/**
	*获取半径。
	*/
	__getset(0,__proto,'radius',function(){
		return this._radius;
	});

	/**
	*获取长度。
	*/
	__getset(0,__proto,'length',function(){
		return this._length;
	});

	/**
	*获取方向。
	*/
	__getset(0,__proto,'orientation',function(){
		return this._orientation;
	});

	__static(CapsuleColliderShape,
	['_tempVector30',function(){return this._tempVector30=new Vector3();}
	]);
	return CapsuleColliderShape;
})(ColliderShape)


/**

*/
/**
*<code>CylinderColliderShape</code> 类用于创建圆柱碰撞器。
*/
//class laya.d3.physics.shape.CylinderColliderShape extends laya.d3.physics.shape.ColliderShape
var CylinderColliderShape=(function(_super){
	function CylinderColliderShape(radius,height,orientation){
		/**@private */
		//this._orientation=0;
		/**@private */
		this._radius=1;
		/**@private */
		this._height=0.5;
		CylinderColliderShape.__super.call(this);
		(radius===void 0)&& (radius=0.5);
		(height===void 0)&& (height=1.0);
		(orientation===void 0)&& (orientation=/*laya.d3.physics.shape.ColliderShape.SHAPEORIENTATION_UPY*/1);
		this._radius=radius;
		this._height=height;
		this._orientation=orientation;
		this._type=/*laya.d3.physics.shape.ColliderShape.SHAPETYPES_CYLINDER*/2;
		switch (orientation){
			case /*laya.d3.physics.shape.ColliderShape.SHAPEORIENTATION_UPX*/0:
				CylinderColliderShape._nativeSize.setValue(height / 2,radius,radius);
				this._nativeShape=new Laya3D._physics3D.btCylinderShapeX(CylinderColliderShape._nativeSize);
				break ;
			case /*laya.d3.physics.shape.ColliderShape.SHAPEORIENTATION_UPY*/1:
				CylinderColliderShape._nativeSize.setValue(radius,height / 2,radius);
				this._nativeShape=new Laya3D._physics3D.btCylinderShape(CylinderColliderShape._nativeSize);
				break ;
			case /*laya.d3.physics.shape.ColliderShape.SHAPEORIENTATION_UPZ*/2:
				CylinderColliderShape._nativeSize.setValue(radius,radius,height / 2);
				this._nativeShape=new Laya3D._physics3D.btCylinderShapeZ(CylinderColliderShape._nativeSize);
				break ;
			default :
				throw "CapsuleColliderShape:unknown orientation.";
			}
	}

	__class(CylinderColliderShape,'laya.d3.physics.shape.CylinderColliderShape',_super);
	var __proto=CylinderColliderShape.prototype;
	/**
	*@inheritDoc
	*/
	__proto.clone=function(){
		var dest=new CylinderColliderShape(this._radius,this._height,this._orientation);
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
	*获取高度。
	*/
	__getset(0,__proto,'height',function(){
		return this._height;
	});

	/**
	*获取方向。
	*/
	__getset(0,__proto,'orientation',function(){
		return this._orientation;
	});

	__static(CylinderColliderShape,
	['_nativeSize',function(){return this._nativeSize=new Laya3D._physics3D.btVector3(0,0,0);}
	]);
	return CylinderColliderShape;
})(ColliderShape)


/**

*/
/**
*<code>BoxColliderShape</code> 类用于创建盒子形状碰撞器。
*/
//class laya.d3.physics.shape.BoxColliderShape extends laya.d3.physics.shape.ColliderShape
var BoxColliderShape=(function(_super){
	function BoxColliderShape(sizeX,sizeY,sizeZ){
		/**@private */
		//this._sizeX=NaN;
		/**@private */
		//this._sizeY=NaN;
		/**@private */
		//this._sizeZ=NaN;
		BoxColliderShape.__super.call(this);
		(sizeX===void 0)&& (sizeX=1.0);
		(sizeY===void 0)&& (sizeY=1.0);
		(sizeZ===void 0)&& (sizeZ=1.0);
		this._sizeX=sizeX;
		this._sizeY=sizeY;
		this._sizeZ=sizeZ;
		this._type=/*laya.d3.physics.shape.ColliderShape.SHAPETYPES_BOX*/0;
		BoxColliderShape._nativeSize.setValue(sizeX / 2,sizeY / 2,sizeZ / 2);
		this._nativeShape=new Laya3D._physics3D.btBoxShape(BoxColliderShape._nativeSize);
	}

	__class(BoxColliderShape,'laya.d3.physics.shape.BoxColliderShape',_super);
	var __proto=BoxColliderShape.prototype;
	/**
	*@inheritDoc
	*/
	__proto.clone=function(){
		var dest=new BoxColliderShape(this._sizeX,this._sizeY,this._sizeZ);
		this.cloneTo(dest);
		return dest;
	}

	/**
	*获取X轴尺寸。
	*/
	__getset(0,__proto,'sizeX',function(){
		return this._sizeX;
	});

	/**
	*获取Y轴尺寸。
	*/
	__getset(0,__proto,'sizeY',function(){
		return this._sizeY;
	});

	/**
	*获取Z轴尺寸。
	*/
	__getset(0,__proto,'sizeZ',function(){
		return this._sizeZ;
	});

	__static(BoxColliderShape,
	['_nativeSize',function(){return this._nativeSize=new Laya3D._physics3D.btVector3(0,0,0);}
	]);
	return BoxColliderShape;
})(ColliderShape)


/**

*/
/**
*<code>CircleShape</code> 类用于创建环形粒子形状。
*/
//class laya.d3.core.particleShuriKen.module.shape.CircleShape extends laya.d3.core.particleShuriKen.module.shape.BaseShape
var CircleShape=(function(_super){
	function CircleShape(){
		/**发射器半径。*/
		this.radius=NaN;
		/**环形弧度。*/
		this.arc=NaN;
		/**从边缘发射。*/
		this.emitFromEdge=false;
		CircleShape.__super.call(this);
		this.radius=1.0;
		this.arc=360.0 / 180.0 *Math.PI;
		this.emitFromEdge=false;
		this.randomDirection=false;
	}

	__class(CircleShape,'laya.d3.core.particleShuriKen.module.shape.CircleShape',_super);
	var __proto=CircleShape.prototype;
	/**
	*@inheritDoc
	*/
	__proto._getShapeBoundBox=function(boundBox){
		var minE=boundBox.min.elements;
		minE[0]=minE[2]=-this.radius;
		minE[1]=0;
		var maxE=boundBox.max.elements;
		maxE[0]=maxE[2]=this.radius;
		maxE[1]=0;
	}

	/**
	*@inheritDoc
	*/
	__proto._getSpeedBoundBox=function(boundBox){
		var minE=boundBox.min.elements;
		minE[0]=minE[1]=-1;
		minE[2]=0;
		var maxE=boundBox.max.elements;
		maxE[0]=maxE[1]=1;
		maxE[2]=0;
	}

	/**
	*用于生成粒子初始位置和方向。
	*@param position 粒子位置。
	*@param direction 粒子方向。
	*/
	__proto.generatePositionAndDirection=function(position,direction,rand,randomSeeds){
		var rpE=position.elements;
		var positionPointE=CircleShape._tempPositionPoint.elements;
		if (rand){
			rand.seed=randomSeeds[16];
			if (this.emitFromEdge)
				ShapeUtils._randomPointUnitArcCircle(this.arc,CircleShape._tempPositionPoint,rand);
			else
			ShapeUtils._randomPointInsideUnitArcCircle(this.arc,CircleShape._tempPositionPoint,rand);
			randomSeeds[16]=rand.seed;
			}else {
			if (this.emitFromEdge)
				ShapeUtils._randomPointUnitArcCircle(this.arc,CircleShape._tempPositionPoint);
			else
			ShapeUtils._randomPointInsideUnitArcCircle(this.arc,CircleShape._tempPositionPoint);
		}
		rpE[0]=-positionPointE[0];
		rpE[1]=positionPointE[1];
		rpE[2]=0;
		Vector3.scale(position,this.radius,position);
		if (this.randomDirection){
			if (rand){
				rand.seed=randomSeeds[17];
				ShapeUtils._randomPointUnitSphere(direction,rand);
				randomSeeds[17]=rand.seed;
				}else {
				ShapeUtils._randomPointUnitSphere(direction);
			}
			}else {
			position.cloneTo(direction);
		}
	}

	__proto.cloneTo=function(destObject){
		_super.prototype.cloneTo.call(this,destObject);
		var destShape=destObject;
		destShape.radius=this.radius;
		destShape.arc=this.arc;
		destShape.emitFromEdge=this.emitFromEdge;
		destShape.randomDirection=this.randomDirection;
	}

	__static(CircleShape,
	['_tempPositionPoint',function(){return this._tempPositionPoint=new Vector2();}
	]);
	return CircleShape;
})(BaseShape)


/**
*@private

*/
/**
*<code>HemisphereShape</code> 类用于创建半球形粒子形状。
*/
//class laya.d3.core.particleShuriKen.module.shape.HemisphereShape extends laya.d3.core.particleShuriKen.module.shape.BaseShape
var HemisphereShape=(function(_super){
	function HemisphereShape(){
		/**发射器半径。*/
		this.radius=NaN;
		/**从外壳发射。*/
		this.emitFromShell=false;
		HemisphereShape.__super.call(this);
		this.radius=1.0;
		this.emitFromShell=false;
		this.randomDirection=false;
	}

	__class(HemisphereShape,'laya.d3.core.particleShuriKen.module.shape.HemisphereShape',_super);
	var __proto=HemisphereShape.prototype;
	/**
	*@inheritDoc
	*/
	__proto._getShapeBoundBox=function(boundBox){
		var minE=boundBox.min.elements;
		minE[0]=minE[1]=minE[2]=-this.radius;
		var maxE=boundBox.max.elements;
		maxE[0]=maxE[1]=this.radius;
		maxE[2]=0;
	}

	/**
	*@inheritDoc
	*/
	__proto._getSpeedBoundBox=function(boundBox){
		var minE=boundBox.min.elements;
		minE[0]=minE[1]=-1;
		minE[2]=0;
		var maxE=boundBox.max.elements;
		maxE[0]=maxE[1]=maxE[2]=1;
	}

	/**
	*用于生成粒子初始位置和方向。
	*@param position 粒子位置。
	*@param direction 粒子方向。
	*/
	__proto.generatePositionAndDirection=function(position,direction,rand,randomSeeds){
		var rpE=position.elements;
		if (rand){
			rand.seed=randomSeeds[16];
			if (this.emitFromShell)
				ShapeUtils._randomPointUnitSphere(position,rand);
			else
			ShapeUtils._randomPointInsideUnitSphere(position,rand);
			randomSeeds[16]=rand.seed;
			}else {
			if (this.emitFromShell)
				ShapeUtils._randomPointUnitSphere(position);
			else
			ShapeUtils._randomPointInsideUnitSphere(position);
		}
		Vector3.scale(position,this.radius,position);
		var z=rpE[2];
		(z < 0.0)&& (rpE[2]=z *-1.0);
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
		destShape.emitFromShell=this.emitFromShell;
		destShape.randomDirection=this.randomDirection;
	}

	return HemisphereShape;
})(BaseShape)


/**

*/
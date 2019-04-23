/**
*<code>BoxShape</code> 类用于创建球形粒子形状。
*/
//class laya.d3.core.particleShuriKen.module.shape.BoxShape extends laya.d3.core.particleShuriKen.module.shape.BaseShape
var BoxShape=(function(_super){
	function BoxShape(){
		/**发射器X轴长度。*/
		this.x=NaN;
		/**发射器Y轴长度。*/
		this.y=NaN;
		/**发射器Z轴长度。*/
		this.z=NaN;
		BoxShape.__super.call(this);
		this.x=1.0;
		this.y=1.0;
		this.z=1.0;
		this.randomDirection=false;
	}

	__class(BoxShape,'laya.d3.core.particleShuriKen.module.shape.BoxShape',_super);
	var __proto=BoxShape.prototype;
	/**
	*@inheritDoc
	*/
	__proto._getShapeBoundBox=function(boundBox){
		var minE=boundBox.min.elements;
		minE[0]=-this.x *0.5;
		minE[1]=-this.y *0.5;
		minE[2]=-this.z *0.5;
		var maxE=boundBox.max.elements;
		maxE[0]=this.x *0.5;
		maxE[1]=this.y *0.5;
		maxE[2]=this.z *0.5;
	}

	/**
	*@inheritDoc
	*/
	__proto._getSpeedBoundBox=function(boundBox){
		var minE=boundBox.min.elements;
		minE[0]=0.0;
		minE[1]=0.0;
		minE[2]=0.0;
		var maxE=boundBox.max.elements;
		maxE[0]=0.0;
		maxE[1]=1.0;
		maxE[2]=0.0;
	}

	/**
	*用于生成粒子初始位置和方向。
	*@param position 粒子位置。
	*@param direction 粒子方向。
	*/
	__proto.generatePositionAndDirection=function(position,direction,rand,randomSeeds){
		var rpE=position.elements;
		var rdE=direction.elements;
		if (rand){
			rand.seed=randomSeeds[16];
			ShapeUtils._randomPointInsideHalfUnitBox(position,rand);
			randomSeeds[16]=rand.seed;
			}else {
			ShapeUtils._randomPointInsideHalfUnitBox(position);
		}
		rpE[0]=this.x *rpE[0];
		rpE[1]=this.y *rpE[1];
		rpE[2]=this.z *rpE[2];
		if (this.randomDirection){
			if (rand){
				rand.seed=randomSeeds[17];
				ShapeUtils._randomPointUnitSphere(direction,rand);
				randomSeeds[17]=rand.seed;
				}else {
				ShapeUtils._randomPointUnitSphere(direction);
			}
			}else {
			rdE[0]=0.0;
			rdE[1]=0.0;
			rdE[2]=1.0;
		}
	}

	__proto.cloneTo=function(destObject){
		_super.prototype.cloneTo.call(this,destObject);
		var destShape=destObject;
		destShape.x=this.x;
		destShape.y=this.y;
		destShape.z=this.z;
		destShape.randomDirection=this.randomDirection;
	}

	return BoxShape;
})(BaseShape)


/**

*/
/**
*<code>ConeShape</code> 类用于创建锥形粒子形状。
*/
//class laya.d3.core.particleShuriKen.module.shape.ConeShape extends laya.d3.core.particleShuriKen.module.shape.BaseShape
var ConeShape=(function(_super){
	function ConeShape(){
		/**发射角度。*/
		this.angle=NaN;
		/**发射器半径。*/
		this.radius=NaN;
		/**椎体长度。*/
		this.length=NaN;
		/**发射类型,0为Base,1为BaseShell,2为Volume,3为VolumeShell。*/
		this.emitType=0;
		ConeShape.__super.call(this);
		this.angle=25.0 / 180.0 *Math.PI;
		this.radius=1.0;
		this.length=5.0;
		this.emitType=0;
		this.randomDirection=false;
	}

	__class(ConeShape,'laya.d3.core.particleShuriKen.module.shape.ConeShape',_super);
	var __proto=ConeShape.prototype;
	/**
	*@inheritDoc
	*/
	__proto._getShapeBoundBox=function(boundBox){
		var coneRadius2=this.radius+this.length *Math.sin(this.angle);
		var coneLength=this.length *Math.cos(this.angle);
		var minE=boundBox.min.elements;
		minE[0]=minE[1]=-coneRadius2;
		minE[2]=0;
		var maxE=boundBox.max.elements;
		maxE[0]=maxE[1]=coneRadius2;
		maxE[2]=coneLength;
	}

	/**
	*@inheritDoc
	*/
	__proto._getSpeedBoundBox=function(boundBox){
		var sinA=Math.sin(this.angle);
		var minE=boundBox.min.elements;
		minE[0]=minE[1]=-sinA;
		minE[2]=0;
		var maxE=boundBox.max.elements;
		maxE[0]=minE[1]=sinA;
		maxE[2]=1;
	}

	/**
	*用于生成粒子初始位置和方向。
	*@param position 粒子位置。
	*@param direction 粒子方向。
	*/
	__proto.generatePositionAndDirection=function(position,direction,rand,randomSeeds){
		var rpE=position.elements;
		var rdE=direction.elements;
		var positionPointE=ConeShape._tempPositionPoint.elements;
		var positionX=NaN;
		var positionY=NaN;
		var directionPointE;
		var dirCosA=Math.cos(this.angle);
		var dirSinA=Math.sin(this.angle);
		switch (this.emitType){
			case 0:
				if (rand){
					rand.seed=randomSeeds[16];
					ShapeUtils._randomPointInsideUnitCircle(ConeShape._tempPositionPoint,rand);
					randomSeeds[16]=rand.seed;
					}else {
					ShapeUtils._randomPointInsideUnitCircle(ConeShape._tempPositionPoint);
				}
				positionX=positionPointE[0];
				positionY=positionPointE[1];
				rpE[0]=positionX *this.radius;
				rpE[1]=positionY *this.radius;
				rpE[2]=0;
				if (this.randomDirection){
					if (rand){
						rand.seed=randomSeeds[17];
						ShapeUtils._randomPointInsideUnitCircle(ConeShape._tempDirectionPoint,rand);
						randomSeeds[17]=rand.seed;
						}else {
						ShapeUtils._randomPointInsideUnitCircle(ConeShape._tempDirectionPoint);
					}
					directionPointE=ConeShape._tempDirectionPoint.elements;
					rdE[0]=directionPointE[0] *dirSinA;
					rdE[1]=directionPointE[1] *dirSinA;
					}else {
					rdE[0]=positionX *dirSinA;
					rdE[1]=positionY *dirSinA;
				}
				rdE[2]=dirCosA;
				break ;
			case 1:
				if (rand){
					rand.seed=randomSeeds[16];
					ShapeUtils._randomPointUnitCircle(ConeShape._tempPositionPoint,rand);
					randomSeeds[16]=rand.seed;
					}else {
					ShapeUtils._randomPointUnitCircle(ConeShape._tempPositionPoint);
				}
				positionX=positionPointE[0];
				positionY=positionPointE[1];
				rpE[0]=positionX *this.radius;
				rpE[1]=positionY *this.radius;
				rpE[2]=0;
				if (this.randomDirection){
					if (rand){
						rand.seed=randomSeeds[17];
						ShapeUtils._randomPointInsideUnitCircle(ConeShape._tempDirectionPoint,rand);
						randomSeeds[17]=rand.seed;
						}else {
						ShapeUtils._randomPointInsideUnitCircle(ConeShape._tempDirectionPoint);
					}
					directionPointE=ConeShape._tempDirectionPoint.elements;
					rdE[0]=directionPointE[0] *dirSinA;
					rdE[1]=directionPointE[1] *dirSinA;
					}else {
					rdE[0]=positionX *dirSinA;
					rdE[1]=positionY *dirSinA;
				}
				rdE[2]=dirCosA;
				break ;
			case 2:
				if (rand){
					rand.seed=randomSeeds[16];
					ShapeUtils._randomPointInsideUnitCircle(ConeShape._tempPositionPoint,rand);
					}else {
					ShapeUtils._randomPointInsideUnitCircle(ConeShape._tempPositionPoint);
				}
				positionX=positionPointE[0];
				positionY=positionPointE[1];
				rpE[0]=positionX *this.radius;
				rpE[1]=positionY *this.radius;
				rpE[2]=0;
				rdE[0]=positionX *dirSinA;
				rdE[1]=positionY *dirSinA;
				rdE[2]=dirCosA;
				Vector3.normalize(direction,direction);
				if (rand){
					Vector3.scale(direction,this.length *rand.getFloat(),direction);
					randomSeeds[16]=rand.seed;
					}else {
					Vector3.scale(direction,this.length *Math.random(),direction);
				}
				Vector3.add(position,direction,position);
				if (this.randomDirection){
					if (rand){
						rand.seed=randomSeeds[17];
						ShapeUtils._randomPointUnitSphere(direction,rand);
						randomSeeds[17]=rand.seed;
						}else {
						ShapeUtils._randomPointUnitSphere(direction);
					}
				}
				break ;
			case 3:
				if (rand){
					rand.seed=randomSeeds[16];
					ShapeUtils._randomPointUnitCircle(ConeShape._tempPositionPoint,rand);
					}else {
					ShapeUtils._randomPointUnitCircle(ConeShape._tempPositionPoint);
				}
				positionX=positionPointE[0];
				positionY=positionPointE[1];
				rpE[0]=positionX *this.radius;
				rpE[1]=positionY *this.radius;
				rpE[2]=0;
				rdE[0]=positionX *dirSinA;
				rdE[1]=positionY *dirSinA;
				rdE[2]=dirCosA;
				Vector3.normalize(direction,direction);
				if (rand){
					Vector3.scale(direction,this.length *rand.getFloat(),direction);
					randomSeeds[16]=rand.seed;
					}else {
					Vector3.scale(direction,this.length *Math.random(),direction);
				}
				Vector3.add(position,direction,position);
				if (this.randomDirection){
					if (rand){
						rand.seed=randomSeeds[17];
						ShapeUtils._randomPointUnitSphere(direction,rand);
						randomSeeds[17]=rand.seed;
						}else {
						ShapeUtils._randomPointUnitSphere(direction);
					}
				}
				break ;
			default :
				throw new Error("ConeShape:emitType is invalid.");
			}
	}

	__proto.cloneTo=function(destObject){
		_super.prototype.cloneTo.call(this,destObject);
		var destShape=destObject;
		destShape.angle=this.angle;
		destShape.radius=this.radius;
		destShape.length=this.length;
		destShape.emitType=this.emitType;
		destShape.randomDirection=this.randomDirection;
	}

	__static(ConeShape,
	['_tempPositionPoint',function(){return this._tempPositionPoint=new Vector2();},'_tempDirectionPoint',function(){return this._tempDirectionPoint=new Vector2();}
	]);
	return ConeShape;
})(BaseShape)


/**

*/
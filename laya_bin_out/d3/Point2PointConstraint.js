/**
*<code>Point2PointConstraint</code> 类用于创建物理组件的父类。
*/
//class laya.d3.physics.constraints.Point2PointConstraint
var Point2PointConstraint=(function(){
	function Point2PointConstraint(){
		/**@private */
		this._damping=NaN;
		/**@private */
		this._impulseClamp=NaN;
		/**@private */
		this._tau=NaN;
		this._pivotInA=new Vector3();
		this._pivotInB=new Vector3();
	}

	__class(Point2PointConstraint,'laya.d3.physics.constraints.Point2PointConstraint');
	var __proto=Point2PointConstraint.prototype;
	__getset(0,__proto,'pivotInA',function(){
		return this._pivotInA;
		},function(value){
		this._pivotInA=value;
	});

	__getset(0,__proto,'pivotInB',function(){
		return this._pivotInB;
		},function(value){
		this._pivotInB=value;
	});

	__getset(0,__proto,'damping',function(){
		return this._damping;
		},function(value){
		this._damping=value;
	});

	__getset(0,__proto,'impulseClamp',function(){
		return this._impulseClamp;
		},function(value){
		this._impulseClamp=value;
	});

	__getset(0,__proto,'tau',function(){
		return this._tau;
		},function(value){
		this._tau=value;
	});

	return Point2PointConstraint;
})()


/**

*/
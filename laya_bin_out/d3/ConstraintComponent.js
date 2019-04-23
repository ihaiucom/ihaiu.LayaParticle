/**
*<code>ConstraintComponent</code> 类用于创建约束的父类。
*/
//class laya.d3.physics.constraints.ConstraintComponent extends laya.components.Component
var ConstraintComponent=(function(_super){
	function ConstraintComponent(){
		/**@private */
		this._nativeConstraint=null;
		/**@private */
		this._breakingImpulseThreshold=NaN;
		/**@private */
		this._connectedBody=null;
		/**@private */
		this._feedbackEnabled=false;
		ConstraintComponent.__super.call(this);
	}

	__class(ConstraintComponent,'laya.d3.physics.constraints.ConstraintComponent',_super);
	var __proto=ConstraintComponent.prototype;
	/**
	*@inheritDoc
	*/
	__proto._onDestroy=function(){
		var physics3D=Laya3D._physics3D;
		physics3D.destroy(this._nativeConstraint);
		this._nativeConstraint=null;
	}

	/**
	*设置打破冲力阈值。
	*@param value 打破冲力阈值。
	*/
	/**
	*获取打破冲力阈值。
	*@return 打破冲力阈值。
	*/
	__getset(0,__proto,'breakingImpulseThreshold',function(){
		return this._breakingImpulseThreshold;
		},function(value){
		this._nativeConstraint.BreakingImpulseThreshold=value;
		this._breakingImpulseThreshold=value;
	});

	/**
	*@inheritDoc
	*/
	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'enabled',function(){
		return Laya.superGet(Component,this,'enabled');
		},function(value){
		this._nativeConstraint.IsEnabled=value;
		Laya.superSet(Component,this,'enabled',value);
	});

	/**
	*获取应用的冲力。
	*/
	__getset(0,__proto,'appliedImpulse',function(){
		if (!this._feedbackEnabled){
			this._nativeConstraint.EnableFeedback(true);
			this._feedbackEnabled=true;
		}
		return this._nativeConstraint.AppliedImpulse;
	});

	/**
	*设置已连接刚体。
	*@param value 已连接刚体。
	*/
	/**
	*获取已连接的刚体。
	*@return 已连接刚体。
	*/
	__getset(0,__proto,'connectedBody',function(){
		return this._connectedBody;
		},function(value){
		this._connectedBody=value;
	});

	return ConstraintComponent;
})(Component)


/**

*/
/**
*<code>AnimatorPlayState</code> 类用于创建动画播放状态信息。
*/
//class laya.d3.component.AnimatorPlayState
var AnimatorPlayState=(function(){
	function AnimatorPlayState(){
		/**@private */
		//this._finish=false;
		/**@private */
		//this._startPlayTime=NaN;
		/**@private */
		//this._lastElapsedTime=NaN;
		/**@private */
		//this._elapsedTime=NaN;
		/**@private */
		//this._normalizedTime=NaN;
		/**@private */
		//this._normalizedPlayTime=NaN;
		/**@private */
		//this._duration=NaN;
		/**@private */
		//this._playEventIndex=0;
	}

	__class(AnimatorPlayState,'laya.d3.component.AnimatorPlayState');
	var __proto=AnimatorPlayState.prototype;
	/**
	*@private
	*/
	__proto._resetPlayState=function(startTime){
		this._finish=false;
		this._startPlayTime=startTime;
		this._elapsedTime=startTime;
		this._playEventIndex=0.0;
	}

	/**
	*@private
	*/
	__proto._cloneTo=function(dest){
		dest._finish=this._finish;
		dest._startPlayTime=this._startPlayTime;
		dest._elapsedTime=this._elapsedTime;
		dest._playEventIndex=this._playEventIndex;
	}

	/**
	*获取播放状态的归一化时间,整数为循环次数，小数为单次播放时间。
	*/
	__getset(0,__proto,'normalizedTime',function(){
		return this._normalizedTime;
	});

	/**
	*获取当前动画的持续时间，以秒为单位。
	*/
	__getset(0,__proto,'duration',function(){
		return this._duration;
	});

	return AnimatorPlayState;
})()


/**

*/
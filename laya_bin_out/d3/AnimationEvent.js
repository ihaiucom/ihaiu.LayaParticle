/**
*<code>AnimationEvent</code> 类用于实现动画事件。
*/
//class laya.d3.animation.AnimationEvent
var AnimationEvent=(function(){
	function AnimationEvent(){
		/**事件触发时间。*/
		this.time=NaN;
		/**事件触发名称。*/
		this.eventName=null;
		/**事件触发参数。*/
		this.params=null;
	}

	__class(AnimationEvent,'laya.d3.animation.AnimationEvent');
	return AnimationEvent;
})()


/**

*/
//class laya.ani.AnimationState
var AnimationState=(function(){
	function AnimationState(){}
	__class(AnimationState,'laya.ani.AnimationState');
	AnimationState.stopped=0;
	AnimationState.paused=1;
	AnimationState.playing=2;
	return AnimationState;
})()


/**
*@private
*路径作用器
*1，生成根据骨骼计算控制点
*2，根据控制点生成路径，并计算路径上的节点
*3，根据节点，重新调整骨骼位置
*/

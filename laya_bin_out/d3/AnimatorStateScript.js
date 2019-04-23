/**
*<code>AnimatorStateScript</code> 类用于动画状态脚本的父类,该类为抽象类,不允许实例。
*/
//class laya.d3.animation.AnimatorStateScript
var AnimatorStateScript=(function(){
	/**
	*创建一个新的 <code>AnimatorStateScript</code> 实例。
	*/
	function AnimatorStateScript(){}
	__class(AnimatorStateScript,'laya.d3.animation.AnimatorStateScript');
	var __proto=AnimatorStateScript.prototype;
	/**
	*动画状态开始时执行。
	*/
	__proto.onStateEnter=function(){}
	/**
	*动画状态更新时执行。
	*/
	__proto.onStateUpdate=function(){}
	/**
	*动画状态退出时执行。
	*/
	__proto.onStateExit=function(){}
	return AnimatorStateScript;
})()


/**

*/
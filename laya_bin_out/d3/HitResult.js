/**
*<code>HitResult</code> 类用于实现射线检测或形状扫描的结果。
*/
//class laya.d3.physics.HitResult
var HitResult=(function(){
	function HitResult(){
		/**是否成功。 */
		this.succeeded=false;
		/**发生碰撞的碰撞组件。*/
		this.collider=null;
		/**碰撞分数。 */
		this.hitFraction=0;
		this.point=new Vector3();
		this.normal=new Vector3();
	}

	__class(HitResult,'laya.d3.physics.HitResult');
	return HitResult;
})()


/**

*/
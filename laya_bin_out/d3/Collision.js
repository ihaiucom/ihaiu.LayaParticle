/**
*<code>Collision</code> 类用于创建物理碰撞信息。
*/
//class laya.d3.physics.Collision
var Collision=(function(){
	function Collision(){
		/**@private */
		this._lastUpdateFrame=-2147483648;
		/**@private */
		this._updateFrame=-2147483648;
		/**@private */
		this._isTrigger=false;
		/**@private */
		//this._colliderA=null;
		/**@private */
		//this._colliderB=null;
		/**@private [只读]*/
		//this.other=null;
		this.contacts=[];
	}

	__class(Collision,'laya.d3.physics.Collision');
	var __proto=Collision.prototype;
	/**
	*@private
	*/
	__proto._setUpdateFrame=function(farme){
		this._lastUpdateFrame=this._updateFrame;
		this._updateFrame=farme;
	}

	return Collision;
})()


/**
*@private

*/
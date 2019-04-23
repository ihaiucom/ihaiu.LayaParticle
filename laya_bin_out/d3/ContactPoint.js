/**
*<code>ContactPoint</code> 类用于创建物理碰撞信息。
*/
//class laya.d3.physics.ContactPoint
var ContactPoint=(function(){
	function ContactPoint(){
		/**@private */
		this._idCounter=0;
		/**@private */
		//this._id=0;
		/**碰撞器A。*/
		this.colliderA=null;
		/**碰撞器B。*/
		this.colliderB=null;
		/**距离。*/
		this.distance=0;
		this.normal=new Vector3();
		this.positionOnA=new Vector3();
		this.positionOnB=new Vector3();
		this._id=++this._idCounter;
	}

	__class(ContactPoint,'laya.d3.physics.ContactPoint');
	return ContactPoint;
})()


/**

*/
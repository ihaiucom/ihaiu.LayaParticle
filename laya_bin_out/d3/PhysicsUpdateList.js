/**
*<code>PhysicsUpdateList</code> 类用于实现物理更新队列。
*/
//class laya.d3.physics.PhysicsUpdateList extends laya.d3.component.SingletonList
var PhysicsUpdateList=(function(_super){
	/**
	*创建一个新的 <code>PhysicsUpdateList</code> 实例。
	*/
	function PhysicsUpdateList(){
		PhysicsUpdateList.__super.call(this);
	}

	__class(PhysicsUpdateList,'laya.d3.physics.PhysicsUpdateList',_super);
	var __proto=PhysicsUpdateList.prototype;
	/**
	*@private
	*/
	__proto.add=function(element){
		var index=element._inPhysicUpdateListIndex;
		if (index!==-1)
			throw "PhysicsUpdateList:element has  in  PhysicsUpdateList.";
		this._add(element);
		element._inPhysicUpdateListIndex=this.length++;
	}

	return PhysicsUpdateList;
})(SingletonList)


/**

*/
/**
*<code>SimpleSingletonList</code> 类用于实现单例队列。
*/
//class laya.d3.component.SimpleSingletonList extends laya.d3.component.SingletonList
var SimpleSingletonList=(function(_super){
	/**
	*创建一个新的 <code>SimpleSingletonList</code> 实例。
	*/
	function SimpleSingletonList(){
		SimpleSingletonList.__super.call(this);
	}

	__class(SimpleSingletonList,'laya.d3.component.SimpleSingletonList',_super);
	var __proto=SimpleSingletonList.prototype;
	/**
	*@private
	*/
	__proto.add=function(element){
		var index=element._getIndexInList();
		if (index!==-1)
			throw "SimpleSingletonList:"+element+" has  in  SingletonList.";
		this._add(element);
		element._setIndexInList(this.length++);
	}

	/**
	*@private
	*/
	__proto.remove=function(element){
		var index=element._getIndexInList();
		this.length--;
		if (index!==this.length){
			var end=this.elements[this.length];
			this.elements[index]=end;
			end._setIndexInList(index);
		}
		element._setIndexInList(-1);
	}

	return SimpleSingletonList;
})(SingletonList)


/**

*/
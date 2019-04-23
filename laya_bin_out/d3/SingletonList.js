/**
*<code>SingletonList</code> 类用于实现单例队列。
*/
//class laya.d3.component.SingletonList
var SingletonList=(function(){
	function SingletonList(){
		/**@private [只读]*/
		this.length=0;
		this.elements=[];
	}

	__class(SingletonList,'laya.d3.component.SingletonList');
	var __proto=SingletonList.prototype;
	/**
	*@private
	*/
	__proto._add=function(element){
		if (this.length===this.elements.length)
			this.elements.push(element);
		else
		this.elements[this.length]=element;
	}

	return SingletonList;
})()


/**

*/
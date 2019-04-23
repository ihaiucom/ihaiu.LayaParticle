/**
*<code>CastShadowList</code> 类用于实现产生阴影者队列。
*/
//class laya.d3.CastShadowList extends laya.d3.component.SingletonList
var CastShadowList=(function(_super){
	/**
	*创建一个新的 <code>CastShadowList</code> 实例。
	*/
	function CastShadowList(){
		CastShadowList.__super.call(this);
	}

	__class(CastShadowList,'laya.d3.CastShadowList',_super);
	var __proto=CastShadowList.prototype;
	/**
	*@private
	*/
	__proto.add=function(element){
		var index=element._indexInCastShadowList;
		if (index!==-1)
			throw "CastShadowList:element has  in  CastShadowList.";
		this._add(element);
		element._indexInCastShadowList=this.length++;
	}

	/**
	*@private
	*/
	__proto.remove=function(element){
		var index=element._indexInCastShadowList;
		this.length--;
		if (index!==this.length){
			var end=this.elements[this.length];
			this.elements[index]=end;
			end._indexInCastShadowList=index;
		}
		element._indexInCastShadowList=-1;
	}

	return CastShadowList;
})(SingletonList)


/**

*/
/**
*<code>KeyframeNodeList</code> 类用于创建KeyframeNode节点队列。
*/
//class laya.d3.animation.KeyframeNodeList
var KeyframeNodeList=(function(){
	function KeyframeNodeList(){
		this._nodes=[];
	}

	__class(KeyframeNodeList,'laya.d3.animation.KeyframeNodeList');
	var __proto=KeyframeNodeList.prototype;
	/**
	*通过索引获取节点。
	*@param index 索引。
	*@return 节点。
	*/
	__proto.getNodeByIndex=function(index){
		return this._nodes[index];
	}

	/**
	*通过索引设置节点。
	*@param index 索引。
	*@param 节点。
	*/
	__proto.setNodeByIndex=function(index,node){
		this._nodes[index]=node;
	}

	/**
	*设置节点个数。
	*@param value 节点个数。
	*/
	/**
	*获取节点个数。
	*@return 节点个数。
	*/
	__getset(0,__proto,'count',function(){
		return this._nodes.length;
		},function(value){
		this._nodes.length=value;
	});

	return KeyframeNodeList;
})()


/**

*/
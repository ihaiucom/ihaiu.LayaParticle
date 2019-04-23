//class PathFinding.libs.Heap
var Heap=(function(){
	function Heap(cmp){
		this.cmp=null;
		this.nodes=null;
		this.heapFunction=new HeapFunction();
		this.cmp=cmp !=null ? cmp :this.heapFunction.defaultCmp;
		this.nodes=[];
	}

	__class(Heap,'PathFinding.libs.Heap');
	var __proto=Heap.prototype;
	__proto.push=function(x){
		return this.heapFunction.heappush(this.nodes,x,this.cmp);
	}

	__proto.pop=function(){
		return this.heapFunction.heappop(this.nodes,this.cmp);
	}

	__proto.peek=function(){
		return this.nodes[0];
	}

	__proto.contains=function(x){
		return this.nodes.indexOf(x)!==-1;
	}

	__proto.replace=function(x){
		return this.heapFunction.heapreplace(this.nodes,x,this.cmp);
	}

	__proto.pushpop=function(x){
		return this.heapFunction.heappushpop(this.nodes,x,this.cmp);
	}

	__proto.heapify=function(){
		return this.heapFunction.heapify(this.nodes,this.cmp);
	}

	__proto.updateItem=function(x){
		return this.heapFunction.updateItem(this.nodes,x,this.cmp);
	}

	__proto.clear=function(){
		return this.nodes=[];
	}

	__proto.empty=function(){
		return this.nodes.length===0;
	}

	__proto.size=function(){
		return this.nodes.length;
	}

	__proto.clone=function(){
		var heap=new Heap();
		heap.nodes=this.nodes.slice(0);
		return heap;
	}

	__proto.toArray=function(){
		return this.nodes.slice(0);
	}

	return Heap;
})()


/**
*...
*@author dongketao
*/

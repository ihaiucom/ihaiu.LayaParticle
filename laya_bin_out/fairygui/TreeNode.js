//class fairygui.tree.TreeNode
var TreeNode=(function(){
	function TreeNode(hasChild){
		this._data=null;
		this._parent=null;
		this._children=null;
		this._expanded=false;
		this._tree=null;
		this._cell=null;
		this._level=0;
		if(hasChild)
			this._children=[];
	}

	__class(TreeNode,'fairygui.tree.TreeNode');
	var __proto=TreeNode.prototype;
	__proto.setCell=function(value){
		this._cell=value;
	}

	__proto.setLevel=function(value){
		this._level=value;
	}

	__proto.addChild=function(child){
		this.addChildAt(child,this._children.length);
		return child;
	}

	__proto.addChildAt=function(child,index){
		if(!child)
			throw new Error("child is null");
		var numChildren=this._children.length;
		if (index >=0 && index <=numChildren){
			if (child._parent==this){
				this.setChildIndex(child,index);
			}
			else{
				if(child._parent)
					child._parent.removeChild(child);
				var cnt=this._children.length;
				if (index==cnt)
					this._children.push(child);
				else
				this._children.splice(index,0,child);
				child._parent=this;
				child._level=this._level+1;
				child.setTree(this._tree);
				if(this._cell!=null && this._cell.parent!=null && this._expanded)
					this._tree.afterInserted(child);
			}
			return child;
		}
		else{
			throw new Error("Invalid child index");
		}
	}

	__proto.removeChild=function(child){
		var childIndex=this._children.indexOf(child);
		if (childIndex !=-1){
			this.removeChildAt(childIndex);
		}
		return child;
	}

	__proto.removeChildAt=function(index){
		if (index >=0 && index < this.numChildren){
			var child=this._children[index];
			this._children.splice(index,1);
			child._parent=null;
			if(this._tree!=null){
				child.setTree(null);
				this._tree.afterRemoved(child);
			}
			return child;
		}
		else{
			throw new Error("Invalid child index");
		}
	}

	__proto.removeChildren=function(beginIndex,endIndex){
		(beginIndex===void 0)&& (beginIndex=0);
		(endIndex===void 0)&& (endIndex=-1);
		if (endIndex < 0 || endIndex >=this.numChildren)
			endIndex=this.numChildren-1;
		for (var i=beginIndex;i<=endIndex;++i)
		this.removeChildAt(beginIndex);
	}

	__proto.getChildAt=function(index){
		if (index >=0 && index < this.numChildren)
			return this._children[index];
		else
		throw new Error("Invalid child index");
	}

	__proto.getChildIndex=function(child){
		return this._children.indexOf(child);
	}

	__proto.getPrevSibling=function(){
		if(this._parent==null)
			return null;
		var i=this._parent._children.indexOf(this);
		if(i<=0)
			return null;
		return this._parent._children[i-1];
	}

	__proto.getNextSibling=function(){
		if(this._parent==null)
			return null;
		var i=this._parent._children.indexOf(this);
		if(i<0 || i>=this._parent._children.length-1)
			return null;
		return this._parent._children[i+1];
	}

	__proto.setChildIndex=function(child,index){
		var oldIndex=this._children.indexOf(child);
		if (oldIndex==-1)
			throw new Error("Not a child of this container");
		var cnt=this._children.length;
		if(index<0)
			index=0;
		else if(index>cnt)
		index=cnt;
		if(oldIndex==index)
			return;
		this._children.splice(oldIndex,1);
		this._children.splice(index,0,child);
		if(this._cell!=null && this._cell.parent!=null && this._expanded)
			this._tree.afterMoved(child);
	}

	__proto.swapChildren=function(child1,child2){
		var index1=this._children.indexOf(child1);
		var index2=this._children.indexOf(child2);
		if (index1==-1 || index2==-1)
			throw new Error("Not a child of this container");
		this.swapChildrenAt(index1,index2);
	}

	__proto.swapChildrenAt=function(index1,index2){
		var child1=this._children[index1];
		var child2=this._children[index2];
		this.setChildIndex(child1,index2);
		this.setChildIndex(child2,index1);
	}

	__proto.setTree=function(value){
		this._tree=value;
		if(this._tree!=null && this._tree.treeNodeWillExpand && this._expanded)
			this._tree.treeNodeWillExpand.runWith(this);
		if(this._children!=null){
			var cnt=this._children.length;
			for(var i=0;i<cnt;i++){
				var node=this._children[i];
				node._level=this._level+1;
				node.setTree(value);
			}
		}
	}

	__getset(0,__proto,'expanded',function(){
		return this._expanded;
		},function(value){
		if(this._children==null)
			return;
		if(this._expanded!=value){
			this._expanded=value;
			if(this._tree!=null){
				if(this._expanded)
					this._tree.afterExpanded(this);
				else
				this._tree.afterCollapsed(this);
			}
		}
	});

	__getset(0,__proto,'tree',function(){
		return this._tree;
	});

	__getset(0,__proto,'level',function(){
		return this._level;
	});

	__getset(0,__proto,'cell',function(){
		return this._cell;
	});

	__getset(0,__proto,'data',function(){
		return this._data;
		},function(value){
		this._data=value;
	});

	__getset(0,__proto,'parent',function(){
		return this._parent;
	});

	__getset(0,__proto,'isFolder',function(){
		return this._children!=null;
	});

	__getset(0,__proto,'text',function(){
		if(this._cell!=null)
			return this._cell.text;
		else
		return null;
	});

	__getset(0,__proto,'numChildren',function(){
		return this._children.length;
	});

	return TreeNode;
})()



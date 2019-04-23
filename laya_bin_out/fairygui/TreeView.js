//class fairygui.tree.TreeView
var TreeView=(function(){
	function TreeView(list){
		this._list=null;
		this._root=null;
		this._indent=0;
		/**
		*当需要为节点创建一个显示对象时调用这个Handler。参数为节点对象（TreeNode）。应该返回一个GObject。
		*/
		this.treeNodeCreateCell=null;
		/**
		*当节点需要渲染时调用这个Handler。参数为节点对象（TreeNode）。
		*/
		this.treeNodeRender=null;
		/**
		*当目录节点展开或者收缩时调用这个Handler。参数为节点对象（TreeNode）。可以用节点的expanded属性判断目标状态。
		*/
		this.treeNodeWillExpand=null;
		/**
		*当节点被点击时调用这个Handler。参数有两个，第一个为节点对象（TreeNode），第二个为事件对象(Event)。
		*/
		this.treeNodeClick=null;
		this._list=list;
		this._list.removeChildrenToPool();
		this._list.on("fui_click_item",this,this.__clickItem);
		this._root=new TreeNode(true);
		this._root.setTree(this);
		this._root.setCell(this._list);
		this._root.expanded=true;
		this._indent=15;
	}

	__class(TreeView,'fairygui.tree.TreeView');
	var __proto=TreeView.prototype;
	__proto.getSelectedNode=function(){
		if(this._list.selectedIndex!=-1)
			return (this._list.getChildAt(this._list.selectedIndex).data);
		else
		return null;
	}

	__proto.getSelection=function(){
		var sels=this._list.getSelection();
		var cnt=sels.length;
		var ret=[];
		for(var i=0;i<cnt;i++){
			var node=(this._list.getChildAt(sels[i]).data);
			ret.push(node);
		}
		return ret;
	}

	__proto.addSelection=function(node,scrollItToView){
		(scrollItToView===void 0)&& (scrollItToView=false);
		var parentNode=node.parent;
		while(parentNode!=null && parentNode!=this._root){
			parentNode.expanded=true;
			parentNode=parentNode.parent;
		}
		if(!node.cell)
			return;
		this._list.addSelection(this._list.getChildIndex(node.cell),scrollItToView);
	}

	__proto.removeSelection=function(node){
		if(!node.cell)
			return;
		this._list.removeSelection(this._list.getChildIndex(node.cell));
	}

	__proto.clearSelection=function(){
		this._list.clearSelection();
	}

	__proto.getNodeIndex=function(node){
		return this._list.getChildIndex(node.cell);
	}

	__proto.updateNode=function(node){
		if(node.cell==null)
			return;
		if(this.treeNodeRender)
			this.treeNodeRender.runWith(node);
	}

	__proto.updateNodes=function(nodes){
		var cnt=nodes.length;
		for(var i=0;i<cnt;i++){
			var node=nodes[i];
			if(node.cell==null)
				return;
			if(this.treeNodeRender)
				this.treeNodeRender.runWith(node);
		}
	}

	__proto.expandAll=function(folderNode){
		folderNode.expanded=true;
		var cnt=folderNode.numChildren;
		for(var i=0;i<cnt;i++){
			var node=folderNode.getChildAt(i);
			if(node.isFolder)
				this.expandAll(node);
		}
	}

	__proto.collapseAll=function(folderNode){
		if(folderNode!=this._root)
			folderNode.expanded=false;
		var cnt=folderNode.numChildren;
		for(var i=0;i<cnt;i++){
			var node=folderNode.getChildAt(i);
			if(node.isFolder)
				this.collapseAll(node);
		}
	}

	__proto.createCell=function(node){
		if(this.treeNodeCreateCell)
			node.setCell(this.treeNodeCreateCell.runWith(node));
		else
		node.setCell((this._list.itemPool.getObject(this._list.defaultItem)));
		node.cell.data=node;
		var indentObj=node.cell.getChild("indent");
		if(indentObj!=null)
			indentObj.width=(node.level-1)*this._indent;
		var expandButton=(node.cell.getChild("expandButton"));
		if(expandButton){
			if(node.isFolder){
				expandButton.visible=true;
				expandButton.onClick(this,this.__clickExpandButton);
				expandButton.data=node;
				expandButton.selected=node.expanded;
			}
			else
			expandButton.visible=false;
		}
		if(this.treeNodeRender)
			this.treeNodeRender.runWith(node);
	}

	__proto.afterInserted=function(node){
		this.createCell(node);
		var index=this.getInsertIndexForNode(node);
		this._list.addChildAt(node.cell,index);
		if(this.treeNodeRender)
			this.treeNodeRender.runWith(node);
		if(node.isFolder && node.expanded)
			this.checkChildren(node,index);
	}

	__proto.getInsertIndexForNode=function(node){
		var prevNode=node.getPrevSibling();
		if(prevNode==null)
			prevNode=node.parent;
		var insertIndex=this._list.getChildIndex(prevNode.cell)+1;
		var myLevel=node.level;
		var cnt=this._list.numChildren;
		for(var i=insertIndex;i<cnt;i++){
			var testNode=(this._list.getChildAt(i).data);
			if(testNode.level<=myLevel)
				break ;
			insertIndex++;
		}
		return insertIndex;
	}

	__proto.afterRemoved=function(node){
		this.removeNode(node);
	}

	__proto.afterExpanded=function(node){
		if(node!=this._root && this.treeNodeWillExpand)
			this.treeNodeWillExpand(node);
		if(node.cell==null)
			return;
		if(node!=this._root){
			if(this.treeNodeRender)
				this.treeNodeRender.runWith(node);
			var expandButton=(node.cell.getChild("expandButton"));
			if(expandButton)
				expandButton.selected=true;
		}
		if(node.cell.parent!=null)
			this.checkChildren(node,this._list.getChildIndex(node.cell));
	}

	__proto.afterCollapsed=function(node){
		if(node!=this._root && this.treeNodeWillExpand)
			this.treeNodeWillExpand(node);
		if(node.cell==null)
			return;
		if(node!=this._root){
			if(this.treeNodeRender)
				this.treeNodeRender.runWith(node);
			var expandButton=(node.cell.getChild("expandButton"));
			if(expandButton)
				expandButton.selected=false;
		}
		if(node.cell.parent!=null)
			this.hideFolderNode(node);
	}

	__proto.afterMoved=function(node){
		if(!node.isFolder)
			this._list.removeChild(node.cell);
		else
		this.hideFolderNode(node);
		var index=this.getInsertIndexForNode(node);
		this._list.addChildAt(node.cell,index);
		if(node.isFolder && node.expanded)
			this.checkChildren(node,index);
	}

	__proto.checkChildren=function(folderNode,index){
		var cnt=folderNode.numChildren;
		for(var i=0;i<cnt;i++){
			index++;
			var node=folderNode.getChildAt(i);
			if(node.cell==null)
				this.createCell(node);
			if(!node.cell.parent)
				this._list.addChildAt(node.cell,index);
			if(node.isFolder && node.expanded)
				index=this.checkChildren(node,index);
		}
		return index;
	}

	__proto.hideFolderNode=function(folderNode){
		var cnt=folderNode.numChildren;
		for(var i=0;i<cnt;i++){
			var node=folderNode.getChildAt(i);
			if(node.cell && node.cell.parent!=null)
				this._list.removeChild(node.cell);
			if(node.isFolder && node.expanded)
				this.hideFolderNode(node);
		}
	}

	__proto.removeNode=function(node){
		if(node.cell!=null){
			if(node.cell.parent!=null)
				this._list.removeChild(node.cell);
			this._list.returnToPool(node.cell);
			node.cell.data=null;
			node.setCell(null);
		}
		if(node.isFolder){
			var cnt=node.numChildren;
			for(var i=0;i<cnt;i++){
				var node2=node.getChildAt(i);
				this.removeNode(node2);
			}
		}
	}

	__proto.__clickExpandButton=function(evt){
		evt.stopPropagation();
		var expandButton=(GObject.cast(evt.currentTarget));
		var node=(expandButton.parent.data);
		if(this._list.scrollPane!=null){
			var posY=this._list.scrollPane.posY;
			if(expandButton.selected)
				node.expanded=true;
			else
			node.expanded=false;
			this._list.scrollPane.posY=posY;
			this._list.scrollPane.scrollToView(node.cell);
		}
		else{
			if(expandButton.selected)
				node.expanded=true;
			else
			node.expanded=false;
		}
	}

	__proto.__clickItem=function(item,evt){
		if(this._list.scrollPane!=null)
			var posY=this._list.scrollPane.posY;
		var node=(item.data);
		if(this.treeNodeClick)
			this.treeNodeClick.runWith([node,evt]);
		if(this._list.scrollPane!=null){
			this._list.scrollPane.posY=posY;
			if(node.cell)
				this._list.scrollPane.scrollToView(node.cell);
		}
	}

	__getset(0,__proto,'list',function(){
		return this._list;
	});

	__getset(0,__proto,'root',function(){
		return this._root;
	});

	__getset(0,__proto,'indent',function(){
		return this._indent;
		},function(value){
		this._indent=value;
	});

	return TreeView;
})()



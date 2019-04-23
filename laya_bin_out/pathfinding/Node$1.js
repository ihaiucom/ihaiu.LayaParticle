//class PathFinding.core.Node
var Node$1=(function(){
	function Node(x,y,walkable){
		this.x=0;
		this.y=0;
		this.g=0;
		this.f=0;
		this.h=0;
		this.by=0;
		this.parent=null;
		this.opened=null;
		this.closed=null;
		this.tested=null;
		this.retainCount=null;
		this.walkable=false;
		(walkable===void 0)&& (walkable=true);
		this.x=x;
		this.y=y;
		this.walkable=walkable;
	}

	__class(Node,'PathFinding.core.Node',null,'Node$1');
	return Node;
})()


/**
*...
*@author dongketao
*/

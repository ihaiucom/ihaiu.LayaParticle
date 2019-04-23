//class PathFinding.finders.JumpPointFinderBase
var JumpPointFinderBase=(function(){
	function JumpPointFinderBase(opt){
		this.grid=null;
		this.openList=null;
		this.startNode=null;
		this.endNode=null;
		this.heuristic=null;
		this.trackJumpRecursion=false;
		opt=opt || {};
		this.heuristic=opt.heuristic || Heuristic.manhattan;
		this.trackJumpRecursion=opt.trackJumpRecursion || false;
	}

	__class(JumpPointFinderBase,'PathFinding.finders.JumpPointFinderBase');
	var __proto=JumpPointFinderBase.prototype;
	/**
	*Find and return the path.
	*@return {Array<Array<number>>}The path,including both start and
	*end positions.
	*/
	__proto.findPath=function(startX,startY,endX,endY,grid){
		var openList=this.openList=new Heap(function(nodeA,nodeB){
			return nodeA.f-nodeB.f;
		}),startNode=this.startNode=grid.getNodeAt(startX,startY),endNode=this.endNode=grid.getNodeAt(endX,endY),node;
		this.grid=grid;
		startNode.g=0;
		startNode.f=0;
		openList.push(startNode);
		startNode.opened=true;
		while (!openList.empty()){
			node=openList.pop();
			node.closed=true;
			if (node==endNode){
				return Util.expandPath(Util.backtrace(endNode));
			}
			this._identifySuccessors(node);
		}
		return [];
	}

	/**
	*Identify successors for the given node. Runs a jump point search in the
	*direction of each available neighbor,adding any points found to the open
	*list.
	*@protected
	*/
	__proto._identifySuccessors=function(node){
		var grid=this.grid,heuristic=this.heuristic,openList=this.openList,endX=this.endNode.x,endY=this.endNode.y,neighbors,neighbor,jumpPoint,i=0,l=0,x=node.x,y=node.y,jx=0,jy=0,dx=0,dy=0,d=0,ng=0,jumpNode,abs=Math.abs,max=Math.max;
		neighbors=this._findNeighbors(node);
		for (i=0,l=neighbors.length;i < l;++i){
			neighbor=neighbors[i];
			jumpPoint=this._jump(neighbor[0],neighbor[1],x,y);
			if (jumpPoint){
				jx=jumpPoint[0];
				jy=jumpPoint[1];
				jumpNode=grid.getNodeAt(jx,jy);
				if (jumpNode.closed){
					continue ;
				}
				d=Heuristic.octile(abs(jx-x),abs(jy-y));
				ng=node.g+d;
				if (!jumpNode.opened || ng < jumpNode.g){
					jumpNode.g=ng;
					jumpNode.h=jumpNode.h || heuristic(abs(jx-endX),abs(jy-endY));
					jumpNode.f=jumpNode.g+jumpNode.h;
					jumpNode.parent=node;
					if (!jumpNode.opened){
						openList.push(jumpNode);
						jumpNode.opened=true;
					}
					else{
						openList.updateItem(jumpNode);
					}
				}
			}
		}
	}

	__proto._jump=function(x,y,px,py){
		return [];
	}

	__proto._findNeighbors=function(node){
		return [];
	}

	return JumpPointFinderBase;
})()


/**
*...
*@author ...
*/

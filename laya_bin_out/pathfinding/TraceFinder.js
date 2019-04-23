//class PathFinding.finders.TraceFinder
var TraceFinder=(function(){
	function TraceFinder(opt){
		this.allowDiagonal=false;
		this.dontCrossCorners=false;
		this.diagonalMovement=0;
		this.heuristic=null;
		opt=opt || {};
		this.allowDiagonal=opt.allowDiagonal;
		this.dontCrossCorners=opt.dontCrossCorners;
		this.heuristic=opt.heuristic || Heuristic.manhattan;
		this.diagonalMovement=opt.diagonalMovement;
		if (!this.diagonalMovement){
			if (!this.allowDiagonal){
				this.diagonalMovement=DiagonalMovement.Never;
			}
			else{
				if (this.dontCrossCorners){
					this.diagonalMovement=DiagonalMovement.OnlyWhenNoObstacles;
				}
				else{
					this.diagonalMovement=DiagonalMovement.IfAtMostOneObstacle;
				}
			}
		}
		if (this.diagonalMovement==DiagonalMovement.Never){
			this.heuristic=opt.heuristic || Heuristic.manhattan;
		}
		else{
			this.heuristic=opt.heuristic || Heuristic.octile;
		}
	}

	__class(TraceFinder,'PathFinding.finders.TraceFinder');
	var __proto=TraceFinder.prototype;
	__proto.findPath=function(startX,startY,endX,endY,grid){
		var openList=new Heap(function(nodeA,nodeB){
			return nodeA.f-nodeB.f;
		}),startNode=grid.getNodeAt(startX,startY),endNode=grid.getNodeAt(endX,endY),heuristic=this.heuristic,allowDiagonal=this.allowDiagonal,dontCrossCorners=this.dontCrossCorners,abs=Math.abs,SQRT2=Math.SQRT2,node,neighbors,neighbor,i=0,l=0,x=0,y=0,ng=0;
		startNode.g=0;
		startNode.f=0;
		openList.push(startNode);
		startNode.opened=true;
		while (!openList.empty()){
			node=openList.pop();
			node.closed=true;
			if (node===endNode){
				return Util.backtrace(endNode);
			}
			neighbors=grid.getNeighbors(node,this.diagonalMovement);
			for (i=0,l=neighbors.length;i < l;++i){
				neighbor=neighbors[i];
				if (neighbor.closed){
					continue ;
				}
				x=neighbor.x;
				y=neighbor.y;
				ng=node.g+((x-node.x===0 || y-node.y===0)? 1 :SQRT2);
				if (!neighbor.opened || ng < neighbor.g){
					neighbor.g=ng *l / 9;
					neighbor.h=neighbor.h || heuristic(abs(x-endX),abs(y-endY));
					neighbor.f=neighbor.g+neighbor.h;
					neighbor.parent=node;
					if (!neighbor.opened){
						openList.push(neighbor);
						neighbor.opened=true;
					}
					else{
						openList.updateItem(neighbor);
					}
				}
			}
		}
		return [];
	}

	return TraceFinder;
})()


/**
*...
*@author dongketao
*/

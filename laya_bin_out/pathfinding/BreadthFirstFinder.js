//class PathFinding.finders.BreadthFirstFinder
var BreadthFirstFinder=(function(){
	function BreadthFirstFinder(opt){
		this.allowDiagonal=false;
		this.dontCrossCorners=false;
		this.heuristic=null;
		this.weight=0;
		this.diagonalMovement=0;
		opt=opt || {};
		this.allowDiagonal=opt.allowDiagonal;
		this.dontCrossCorners=opt.dontCrossCorners;
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
	}

	__class(BreadthFirstFinder,'PathFinding.finders.BreadthFirstFinder');
	var __proto=BreadthFirstFinder.prototype;
	/**
	*Find and return the the path.
	*@return {Array<Array<number>>}The path,including both start and
	*end positions.
	*/
	__proto.findPath=function(startX,startY,endX,endY,grid){
		var openList=[],diagonalMovement=this.diagonalMovement,startNode=grid.getNodeAt(startX,startY),endNode=grid.getNodeAt(endX,endY),neighbors,neighbor,node,i=0,l=0;
		openList.push(startNode);
		startNode.opened=true;
		while (openList.length){
			node=openList.shift();
			node.closed=true;
			if (node===endNode){
				return Util.backtrace(endNode);
			}
			neighbors=grid.getNeighbors(node,diagonalMovement);
			for (i=0,l=neighbors.length;i < l;++i){
				neighbor=neighbors[i];
				if (neighbor.closed || neighbor.opened){
					continue ;
				}
				openList.push(neighbor);
				neighbor.opened=true;
				neighbor.parent=node;
			}
		}
		return [];
	}

	return BreadthFirstFinder;
})()


/**
*...
*@author dongketao
*/

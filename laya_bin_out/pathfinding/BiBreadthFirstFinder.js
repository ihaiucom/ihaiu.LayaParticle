//class PathFinding.finders.BiBreadthFirstFinder
var BiBreadthFirstFinder=(function(){
	function BiBreadthFirstFinder(opt){
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

	__class(BiBreadthFirstFinder,'PathFinding.finders.BiBreadthFirstFinder');
	var __proto=BiBreadthFirstFinder.prototype;
	/**
	*Find and return the the path.
	*@return {Array<Array<number>>}The path,including both start and
	*end positions.
	*/
	__proto.findPath=function(startX,startY,endX,endY,grid){
		var startNode=grid.getNodeAt(startX,startY),endNode=grid.getNodeAt(endX,endY),startOpenList=[],endOpenList=[],neighbors,neighbor,node,diagonalMovement=this.diagonalMovement,BY_START=0,BY_END=1,i=0,l=0;
		startOpenList.push(startNode);
		startNode.opened=true;
		startNode.by=BY_START;
		endOpenList.push(endNode);
		endNode.opened=true;
		endNode.by=BY_END;
		while (startOpenList.length && endOpenList.length){
			node=startOpenList.shift();
			node.closed=true;
			neighbors=grid.getNeighbors(node,diagonalMovement);
			for (i=0,l=neighbors.length;i < l;++i){
				neighbor=neighbors[i];
				if (neighbor.closed){
					continue ;
				}
				if (neighbor.opened){
					if (neighbor.by===BY_END){
						return Util.biBacktrace(node,neighbor);
					}
					continue ;
				}
				startOpenList.push(neighbor);
				neighbor.parent=node;
				neighbor.opened=true;
				neighbor.by=BY_START;
			}
			node=endOpenList.shift();
			node.closed=true;
			neighbors=grid.getNeighbors(node,diagonalMovement);
			for (i=0,l=neighbors.length;i < l;++i){
				neighbor=neighbors[i];
				if (neighbor.closed){
					continue ;
				}
				if (neighbor.opened){
					if (neighbor.by===BY_START){
						return Util.biBacktrace(neighbor,node);
					}
					continue ;
				}
				endOpenList.push(neighbor);
				neighbor.parent=node;
				neighbor.opened=true;
				neighbor.by=BY_END;
			}
		}
		return [];
	}

	return BiBreadthFirstFinder;
})()


/**
*...
*@author dongketao
*/

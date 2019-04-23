//class PathFinding.finders.BiAStarFinder
var BiAStarFinder=(function(){
	function BiAStarFinder(opt){
		this.allowDiagonal=false;
		this.dontCrossCorners=false;
		this.diagonalMovement=0;
		this.heuristic=null;
		this.weight=0;
		opt=opt || {};
		this.allowDiagonal=opt.allowDiagonal;
		this.dontCrossCorners=opt.dontCrossCorners;
		this.diagonalMovement=opt.diagonalMovement;
		this.heuristic=opt.heuristic || Heuristic.manhattan;
		this.weight=opt.weight || 1;
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

	__class(BiAStarFinder,'PathFinding.finders.BiAStarFinder');
	var __proto=BiAStarFinder.prototype;
	/**
	*Find and return the the path.
	*@return {Array<Array<number>>}The path,including both start and
	*end positions.
	*/
	__proto.findPath=function(startX,startY,endX,endY,grid){
		var cmp=function (nodeA,nodeB){
			return nodeA.f-nodeB.f;
		};
		var startOpenList=new Heap(cmp),endOpenList=new Heap(cmp),startNode=grid.getNodeAt(startX,startY),endNode=grid.getNodeAt(endX,endY),heuristic=this.heuristic,diagonalMovement=this.diagonalMovement,weight=this.weight,abs=Math.abs,SQRT2=Math.SQRT2,node,neighbors,neighbor,i=0,l=0,x=0,y=0,ng=0,BY_START=1,BY_END=2;
		startNode.g=0;
		startNode.f=0;
		startOpenList.push(startNode);
		startNode.opened=BY_START;
		endNode.g=0;
		endNode.f=0;
		endOpenList.push(endNode);
		endNode.opened=BY_END;
		while (!startOpenList.empty()&& !endOpenList.empty()){
			node=startOpenList.pop();
			node.closed=true;
			neighbors=grid.getNeighbors(node,diagonalMovement);
			for (i=0,l=neighbors.length;i < l;++i){
				neighbor=neighbors[i];
				if (neighbor.closed){
					continue ;
				}
				if (neighbor.opened===BY_END){
					return Util.biBacktrace(node,neighbor);
				}
				x=neighbor.x;
				y=neighbor.y;
				ng=node.g+((x-node.x===0 || y-node.y===0)? 1 :SQRT2);
				if (!neighbor.opened || ng < neighbor.g){
					neighbor.g=ng;
					neighbor.h=neighbor.h || weight *heuristic(abs(x-endX),abs(y-endY));
					neighbor.f=neighbor.g+neighbor.h;
					neighbor.parent=node;
					if (!neighbor.opened){
						startOpenList.push(neighbor);
						neighbor.opened=BY_START;
					}
					else{
						startOpenList.updateItem(neighbor);
					}
				}
			}
			node=endOpenList.pop();
			node.closed=true;
			neighbors=grid.getNeighbors(node,diagonalMovement);
			for (i=0,l=neighbors.length;i < l;++i){
				neighbor=neighbors[i];
				if (neighbor.closed){
					continue ;
				}
				if (neighbor.opened===BY_START){
					return Util.biBacktrace(neighbor,node);
				}
				x=neighbor.x;
				y=neighbor.y;
				ng=node.g+((x-node.x===0 || y-node.y===0)? 1 :SQRT2);
				if (!neighbor.opened || ng < neighbor.g){
					neighbor.g=ng;
					neighbor.h=neighbor.h || weight *heuristic(abs(x-startX),abs(y-startY));
					neighbor.f=neighbor.g+neighbor.h;
					neighbor.parent=node;
					if (!neighbor.opened){
						endOpenList.push(neighbor);
						neighbor.opened=BY_END;
					}
					else{
						endOpenList.updateItem(neighbor);
					}
				}
			}
		}
		return [];
	}

	return BiAStarFinder;
})()


/**
*...
*@author dongketao
*/

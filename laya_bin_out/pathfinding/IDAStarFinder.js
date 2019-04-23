//class PathFinding.finders.IDAStarFinder
var IDAStarFinder=(function(){
	function IDAStarFinder(opt){
		this.allowDiagonal=false;
		this.dontCrossCorners=false;
		this.heuristic=null;
		this.weight=0;
		this.diagonalMovement=0;
		this.trackRecursion=false;
		this.timeLimit=NaN;
		opt=opt || {};
		this.allowDiagonal=opt.allowDiagonal;
		this.dontCrossCorners=opt.dontCrossCorners;
		this.diagonalMovement=opt.diagonalMovement;
		this.heuristic=opt.heuristic || Heuristic.manhattan;
		this.weight=opt.weight || 1;
		this.trackRecursion=opt.trackRecursion || false;
		this.timeLimit=opt.timeLimit || Infinity;
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
		if (this.diagonalMovement===DiagonalMovement.Never){
			this.heuristic=opt.heuristic || Heuristic.manhattan;
		}
		else{
			this.heuristic=opt.heuristic || Heuristic.octile;
		}
	}

	__class(IDAStarFinder,'PathFinding.finders.IDAStarFinder');
	var __proto=IDAStarFinder.prototype;
	/**
	*Find and return the the path. When an empty array is returned,either
	*no path is possible,or the maximum execution time is reached.
	*
	*@return {Array<Array<number>>}The path,including both start and
	*end positions.
	*/
	__proto.findPath=function(startX,startY,endX,endY,grid){
		var _$this=this;
		var nodesVisited=0;
		var startTime=new Date().getTime();
		var h=function (a,b){
			return _$this.heuristic(Math.abs(b.x-a.x),Math.abs(b.y-a.y));
		};
		var cost=function (a,b){
			return (a.x===b.x || a.y===b.y)? 1 :Math.SQRT2;
		};
		var search=function (node,g,cutoff,route,depth){
			nodesVisited++;
			if (_$this.timeLimit > 0 && new Date().getTime()-startTime > _$this.timeLimit *1000){
				return Infinity;
			};
			var f=g+h(node,end)*_$this.weight;
			if (f > cutoff){
				return f;
			}
			if (node==end){
				route[depth]=[node.x,node.y];
				return node;
			};
			var min=0,t=0,k=0,neighbour;
			var neighbours=grid.getNeighbors(node,_$this.diagonalMovement);
			for (k=0,min=Infinity;neighbour=neighbours[k];++k){
				if (_$this.trackRecursion){
					neighbour.retainCount=neighbour.retainCount+1 || 1;
					if (neighbour.tested !=true){
						neighbour.tested=true;
					}
				}
				t=search(neighbour,g+cost(node,neighbour),cutoff,route,depth+1);
				if ((t instanceof PathFinding.core.Node )){
					route[depth]=[node.x,node.y];
					return t;
				}
				if (_$this.trackRecursion && (--neighbour.retainCount)===0){
					neighbour.tested=false;
				}
				if (t < min){
					min=t;
				}
			}
			return min;
		};
		var start=grid.getNodeAt(startX,startY);
		var end=grid.getNodeAt(endX,endY);
		var cutOff=h(start,end);
		var j=0,route,t=0;
		for (j=0;true;++j){
			route=[];
			t=search(start,0,cutOff,route,0);
			if (t==Infinity){
				route=[];
				break ;
			}
			if ((t instanceof PathFinding.core.Node )){
				break ;
			}
			cutOff=t;
		}
		return route;
	}

	return IDAStarFinder;
})()


/**
*...
*@author ...
*/

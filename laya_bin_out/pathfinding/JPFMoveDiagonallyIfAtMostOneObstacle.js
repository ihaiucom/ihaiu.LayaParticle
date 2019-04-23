//class PathFinding.finders.JPFMoveDiagonallyIfAtMostOneObstacle extends PathFinding.finders.JumpPointFinderBase
var JPFMoveDiagonallyIfAtMostOneObstacle=(function(_super){
	function JPFMoveDiagonallyIfAtMostOneObstacle(opt){
		JPFMoveDiagonallyIfAtMostOneObstacle.__super.call(this,opt);
	}

	__class(JPFMoveDiagonallyIfAtMostOneObstacle,'PathFinding.finders.JPFMoveDiagonallyIfAtMostOneObstacle',_super);
	var __proto=JPFMoveDiagonallyIfAtMostOneObstacle.prototype;
	/**
	*Search recursively in the direction (parent-> child),stopping only when a
	*jump point is found.
	*@protected
	*@return {Array<Array<number>>}The x,y coordinate of the jump point
	*found,or null if not found
	*/
	__proto._jump=function(x,y,px,py){
		var grid=this.grid,dx=x-px,dy=y-py;
		if (!grid.isWalkableAt(x,y)){
			return null;
		}
		if (this.trackJumpRecursion===true){
			grid.getNodeAt(x,y).tested=true;
		}
		if (grid.getNodeAt(x,y)==this.endNode){
			return [x,y];
		}
		if (dx!==0 && dy!==0){
			if ((grid.isWalkableAt(x-dx,y+dy)&& !grid.isWalkableAt(x-dx,y))|| (grid.isWalkableAt(x+dx,y-dy)&& !grid.isWalkableAt(x,y-dy))){
				return [x,y];
			}
			if (this._jump(x+dx,y,x,y)|| this._jump(x,y+dy,x,y)){
				return [x,y];
			}
		}
		else{
			if (dx!==0){
				if ((grid.isWalkableAt(x+dx,y+1)&& !grid.isWalkableAt(x,y+1))|| (grid.isWalkableAt(x+dx,y-1)&& !grid.isWalkableAt(x,y-1))){
					return [x,y];
				}
			}
			else{
				if ((grid.isWalkableAt(x+1,y+dy)&& !grid.isWalkableAt(x+1,y))|| (grid.isWalkableAt(x-1,y+dy)&& !grid.isWalkableAt(x-1,y))){
					return [x,y];
				}
			}
		}
		if (grid.isWalkableAt(x+dx,y)|| grid.isWalkableAt(x,y+dy)){
			return this._jump(x+dx,y+dy,x,y);
		}
		else{
			return null;
		}
	}

	/**
	*Find the neighbors for the given node. If the node has a parent,
	*prune the neighbors based on the jump point search algorithm,otherwise
	*return all available neighbors.
	*@return {Array<Array<number>>}The neighbors found.
	*/
	__proto._findNeighbors=function(node){
		var parent=node.parent,x=node.x,y=node.y,grid=this.grid,px=0,py=0,nx=0,ny=0,dx=0,dy=0,neighbors=[],neighborNodes,neighborNode,i=0,l=0;
		if (parent){
			px=parent.x;
			py=parent.y;
			dx=(x-px)/ Math.max(Math.abs(x-px),1);
			dy=(y-py)/ Math.max(Math.abs(y-py),1);
			if (dx!==0 && dy!==0){
				if (grid.isWalkableAt(x,y+dy)){
					neighbors.push([x,y+dy]);
				}
				if (grid.isWalkableAt(x+dx,y)){
					neighbors.push([x+dx,y]);
				}
				if (grid.isWalkableAt(x,y+dy)|| grid.isWalkableAt(x+dx,y)){
					neighbors.push([x+dx,y+dy]);
				}
				if (!grid.isWalkableAt(x-dx,y)&& grid.isWalkableAt(x,y+dy)){
					neighbors.push([x-dx,y+dy]);
				}
				if (!grid.isWalkableAt(x,y-dy)&& grid.isWalkableAt(x+dx,y)){
					neighbors.push([x+dx,y-dy]);
				}
			}
			else{
				if (dx===0){
					if (grid.isWalkableAt(x,y+dy)){
						neighbors.push([x,y+dy]);
						if (!grid.isWalkableAt(x+1,y)){
							neighbors.push([x+1,y+dy]);
						}
						if (!grid.isWalkableAt(x-1,y)){
							neighbors.push([x-1,y+dy]);
						}
					}
				}
				else{
					if (grid.isWalkableAt(x+dx,y)){
						neighbors.push([x+dx,y]);
						if (!grid.isWalkableAt(x,y+1)){
							neighbors.push([x+dx,y+1]);
						}
						if (!grid.isWalkableAt(x,y-1)){
							neighbors.push([x+dx,y-1]);
						}
					}
				}
			}
		}
		else{
			neighborNodes=grid.getNeighbors(node,DiagonalMovement.IfAtMostOneObstacle);
			for (i=0,l=neighborNodes.length;i < l;++i){
				neighborNode=neighborNodes[i];
				neighbors.push([neighborNode.x,neighborNode.y]);
			}
		}
		return neighbors;
	}

	return JPFMoveDiagonallyIfAtMostOneObstacle;
})(JumpPointFinderBase)


/**
*...
*@author ...
*/

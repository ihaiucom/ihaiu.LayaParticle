//class PathFinding.finders.JPFNeverMoveDiagonally extends PathFinding.finders.JumpPointFinderBase
var JPFNeverMoveDiagonally=(function(_super){
	function JPFNeverMoveDiagonally(opt){
		JPFNeverMoveDiagonally.__super.call(this,opt);
	}

	__class(JPFNeverMoveDiagonally,'PathFinding.finders.JPFNeverMoveDiagonally',_super);
	var __proto=JPFNeverMoveDiagonally.prototype;
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
		if (dx!==0){
			if ((grid.isWalkableAt(x,y-1)&& !grid.isWalkableAt(x-dx,y-1))|| (grid.isWalkableAt(x,y+1)&& !grid.isWalkableAt(x-dx,y+1))){
				return [x,y];
			}
		}
		else if (dy!==0){
			if ((grid.isWalkableAt(x-1,y)&& !grid.isWalkableAt(x-1,y-dy))|| (grid.isWalkableAt(x+1,y)&& !grid.isWalkableAt(x+1,y-dy))){
				return [x,y];
			}
			if (this._jump(x+1,y,x,y)|| this._jump(x-1,y,x,y)){
				return [x,y];
			}
		}
		else{
			throw new Error("Only horizontal and vertical movements are allowed");
		}
		return this._jump(x+dx,y+dy,x,y);
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
			if (dx!==0){
				if (grid.isWalkableAt(x,y-1)){
					neighbors.push([x,y-1]);
				}
				if (grid.isWalkableAt(x,y+1)){
					neighbors.push([x,y+1]);
				}
				if (grid.isWalkableAt(x+dx,y)){
					neighbors.push([x+dx,y]);
				}
			}
			else if (dy!==0){
				if (grid.isWalkableAt(x-1,y)){
					neighbors.push([x-1,y]);
				}
				if (grid.isWalkableAt(x+1,y)){
					neighbors.push([x+1,y]);
				}
				if (grid.isWalkableAt(x,y+dy)){
					neighbors.push([x,y+dy]);
				}
			}
		}
		else{
			neighborNodes=grid.getNeighbors(node,DiagonalMovement.Never);
			for (i=0,l=neighborNodes.length;i < l;++i){
				neighborNode=neighborNodes[i];
				neighbors.push([neighborNode.x,neighborNode.y]);
			}
		}
		return neighbors;
	}

	return JPFNeverMoveDiagonally;
})(JumpPointFinderBase)



})(window,document,Laya);

if (typeof define === 'function' && define.amd){
	define('laya.core', ['require', "exports"], function(require, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        for (var i in Laya) {
			var o = Laya[i];
            o && o.__isclass && (exports[i] = o);
        }
    });
}
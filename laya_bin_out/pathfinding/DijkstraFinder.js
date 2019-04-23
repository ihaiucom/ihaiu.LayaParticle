//class PathFinding.finders.DijkstraFinder extends PathFinding.finders.AStarFinder
var DijkstraFinder=(function(_super){
	function DijkstraFinder(opt){
		DijkstraFinder.__super.call(this,opt);
		this.heuristic=function (dx,dy){
			return 0;
		};
	}

	__class(DijkstraFinder,'PathFinding.finders.DijkstraFinder',_super);
	return DijkstraFinder;
})(AStarFinder)


/**
*...
*@author ...
*/

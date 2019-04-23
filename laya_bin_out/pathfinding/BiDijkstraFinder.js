//class PathFinding.finders.BiDijkstraFinder extends PathFinding.finders.BiAStarFinder
var BiDijkstraFinder=(function(_super){
	function BiDijkstraFinder(opt){
		BiDijkstraFinder.__super.call(this,opt);
		this.heuristic=function (dx,dy){
			return 0;
		};
	}

	__class(BiDijkstraFinder,'PathFinding.finders.BiDijkstraFinder',_super);
	return BiDijkstraFinder;
})(BiAStarFinder)


/**
*...
*@author ...
*/

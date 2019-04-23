//class PathFinding.finders.BestFirstFinder extends PathFinding.finders.AStarFinder
var BestFirstFinder=(function(_super){
	function BestFirstFinder(opt){
		BestFirstFinder.__super.call(this,opt);
		var orig=this.heuristic;
		this.heuristic=function (dx,dy){
			return orig(dx,dy)*1000000;
		};
	}

	__class(BestFirstFinder,'PathFinding.finders.BestFirstFinder',_super);
	return BestFirstFinder;
})(AStarFinder)


/**
*...
*@author ...
*/

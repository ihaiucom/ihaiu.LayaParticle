//class PathFinding.finders.BiBestFirstFinder extends PathFinding.finders.BiAStarFinder
var BiBestFirstFinder=(function(_super){
	function BiBestFirstFinder(opt){
		BiBestFirstFinder.__super.call(this,opt);
		var orig=this.heuristic;
		this.heuristic=function (dx,dy){
			return orig(dx,dy)*1000000;
		};
	}

	__class(BiBestFirstFinder,'PathFinding.finders.BiBestFirstFinder',_super);
	return BiBestFirstFinder;
})(BiAStarFinder)


/**
*...
*@author ...
*/

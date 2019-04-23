//class PathFinding.core.Heuristic
var Heuristic=(function(){
	function Heuristic(){}
	__class(Heuristic,'PathFinding.core.Heuristic');
	Heuristic.manhattan=function(dx,dy){
		return dx+dy;
	}

	Heuristic.euclidean=function(dx,dy){
		return Math.sqrt(dx *dx+dy *dy);
	}

	Heuristic.octile=function(dx,dy){
		var F=Math.SQRT2-1;
		return (dx < dy)? F *dx+dy :F *dy+dx;
	}

	Heuristic.chebyshev=function(dx,dy){
		return Math.max(dx,dy);
	}

	return Heuristic;
})()


/**
*...
*@author dongketao
*/

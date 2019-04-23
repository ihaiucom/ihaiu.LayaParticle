//class fairygui.utils.ChildHitArea extends laya.utils.HitArea
var ChildHitArea=(function(_super){
	function ChildHitArea(child,reversed){
		this._child=null;
		this._reversed=false;
		ChildHitArea.__super.call(this);
		this._child=child;
		this._reversed=reversed;
		if(this._reversed)
			this.unHit=child.hitArea.hit;
		else
		this.hit=child.hitArea.hit;
	}

	__class(ChildHitArea,'fairygui.utils.ChildHitArea',_super);
	var __proto=ChildHitArea.prototype;
	__proto.contains=function(x,y){
		var tPos;
		tPos=Point.TEMP;
		tPos.setTo(0,0);
		tPos=this._child.toParentPoint(tPos);
		if (this._reversed)
			return !HitArea._isHitGraphic(x-tPos.x,y-tPos.y,this.unHit);
		else
		return HitArea._isHitGraphic(x-tPos.x,y-tPos.y,this.hit);
	}

	return ChildHitArea;
})(HitArea)



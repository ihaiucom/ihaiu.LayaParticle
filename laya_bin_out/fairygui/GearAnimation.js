//class fairygui.gears.GearAnimation extends fairygui.gears.GearBase
var GearAnimation=(function(_super){
	var GearAnimationValue;
	function GearAnimation(owner){
		this._storage=null;
		this._default=null;
		GearAnimation.__super.call(this,owner);
	}

	__class(GearAnimation,'fairygui.gears.GearAnimation',_super);
	var __proto=GearAnimation.prototype;
	__proto.init=function(){
		this._default=new GearAnimationValue((this._owner).playing,
		(this._owner).frame);
		this._storage={};
	}

	__proto.addStatus=function(pageId,buffer){
		var gv;
		if (pageId==null)
			gv=this._default;
		else {
			gv=new GearAnimationValue();
			this._storage[pageId]=gv;
		}
		gv.playing=buffer.readBool();
		gv.frame=buffer.getInt32();
	}

	__proto.apply=function(){
		this._owner._gearLocked=true;
		var gv=this._storage[this._controller.selectedPageId];
		if (!gv)
			gv=this._default;
		(this._owner).frame=gv.frame;
		(this._owner).playing=gv.playing;
		this._owner._gearLocked=false;
	}

	__proto.updateState=function(){
		var mc=(this._owner);
		var gv=this._storage[this._controller.selectedPageId];
		if(!gv){
			gv=new GearAnimationValue();
			this._storage[this._controller.selectedPageId]=gv;
		}
		gv.frame=mc.frame;
		gv.playing=mc.playing;
	}

	GearAnimation.__init$=function(){
		
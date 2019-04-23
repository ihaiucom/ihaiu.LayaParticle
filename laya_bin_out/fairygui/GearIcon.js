//class fairygui.gears.GearIcon extends fairygui.gears.GearBase
var GearIcon=(function(_super){
	function GearIcon(owner){
		this._storage=null;
		this._default=null;
		GearIcon.__super.call(this,owner);
	}

	__class(GearIcon,'fairygui.gears.GearIcon',_super);
	var __proto=GearIcon.prototype;
	__proto.init=function(){
		this._default=this._owner.icon;
		this._storage={};
	}

	__proto.addStatus=function(pageId,buffer){
		if(pageId==null)
			this._default=buffer.readS();
		else
		this._storage[pageId]=buffer.readS();
	}

	__proto.apply=function(){
		this._owner._gearLocked=true;
		var data=this._storage[this._controller.selectedPageId];
		if(data!==undefined)
			this._owner.icon=data;
		else
		this._owner.icon=this._default;
		this._owner._gearLocked=false;
	}

	__proto.updateState=function(){
		this._storage[this._controller.selectedPageId]=this._owner.icon;
	}

	return GearIcon;
})(GearBase)



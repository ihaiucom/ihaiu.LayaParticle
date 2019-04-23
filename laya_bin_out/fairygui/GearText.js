//class fairygui.gears.GearText extends fairygui.gears.GearBase
var GearText=(function(_super){
	function GearText(owner){
		this._storage=null;
		this._default=null;
		GearText.__super.call(this,owner);
	}

	__class(GearText,'fairygui.gears.GearText',_super);
	var __proto=GearText.prototype;
	__proto.init=function(){
		this._default=this._owner.text;
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
			this._owner.text=data;
		else
		this._owner.text=this._default;
		this._owner._gearLocked=false;
	}

	__proto.updateState=function(){
		this._storage[this._controller.selectedPageId]=this._owner.text;
	}

	return GearText;
})(GearBase)



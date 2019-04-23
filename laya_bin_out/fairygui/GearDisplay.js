//class fairygui.gears.GearDisplay extends fairygui.gears.GearBase
var GearDisplay=(function(_super){
	function GearDisplay(owner){
		this.pages=null;
		this._visible=0;
		this._displayLockToken=0;
		GearDisplay.__super.call(this,owner);
		this._displayLockToken=1;
	}

	__class(GearDisplay,'fairygui.gears.GearDisplay',_super);
	var __proto=GearDisplay.prototype;
	__proto.init=function(){
		this.pages=null;
	}

	__proto.addLock=function(){
		this._visible++;
		return this._displayLockToken;
	}

	__proto.releaseLock=function(token){
		if(token==this._displayLockToken)
			this._visible--;
	}

	__proto.apply=function(){
		this._displayLockToken++;
		if(this._displayLockToken<=0)
			this._displayLockToken=1;
		if(this.pages==null || this.pages.length==0
			|| this.pages.indexOf(this._controller.selectedPageId)!=-1)
		this._visible=1;
		else
		this._visible=0;
	}

	__getset(0,__proto,'connected',function(){
		return this._controller==null || this._visible>0;
	});

	return GearDisplay;
})(GearBase)



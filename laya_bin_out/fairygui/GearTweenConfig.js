//class fairygui.gears.GearTweenConfig
var GearTweenConfig=(function(){
	function GearTweenConfig(){
		this.tween=false;
		this.easeType=0;
		this.duration=NaN;
		this.delay=NaN;
		this._displayLockToken=NaN;
		this._tweener=null;
		this.tween=true;
		this.easeType=5;
		this.duration=0.3;
		this.delay=0;
	}

	__class(GearTweenConfig,'fairygui.gears.GearTweenConfig');
	return GearTweenConfig;
})()



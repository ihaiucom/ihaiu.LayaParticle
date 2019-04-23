//class fairygui.gears.GearXY extends fairygui.gears.GearBase
var GearXY=(function(_super){
	function GearXY(owner){
		this._storage=null;
		this._default=null;
		GearXY.__super.call(this,owner);
	}

	__class(GearXY,'fairygui.gears.GearXY',_super);
	var __proto=GearXY.prototype;
	__proto.init=function(){
		this._default=new Point(this._owner.x,this._owner.y);
		this._storage={};
	}

	__proto.addStatus=function(pageId,buffer){
		var gv;
		if (pageId==null)
			gv=this._default;
		else {
			gv=new Point();
			this._storage[pageId]=gv;
		}
		gv.x=buffer.getInt32();
		gv.y=buffer.getInt32();
	}

	__proto.apply=function(){
		var pt=this._storage[this._controller.selectedPageId];
		if (!pt)
			pt=this._default;
		if(this._tweenConfig!=null && this._tweenConfig.tween && !UIPackage._constructing && !GearBase.disableAllTweenEffect){
			if (this._tweenConfig._tweener !=null){
				if (this._tweenConfig._tweener.endValue.x !=pt.x || this._tweenConfig._tweener.endValue.y !=pt.y){
					this._tweenConfig._tweener.kill(true);
					this._tweenConfig._tweener=null;
				}
				else
				return;
			}
			if (this._owner.x !=pt.x || this._owner.y !=pt.y){
				if(this._owner.checkGearController(0,this._controller))
					this._tweenConfig._displayLockToken=this._owner.addDisplayLock();
				this._tweenConfig._tweener=GTween.to2(this._owner.x,this._owner.y,pt.x,pt.y,this._tweenConfig.duration)
				.setDelay(this._tweenConfig.delay)
				.setEase(this._tweenConfig.easeType)
				.setTarget(this)
				.onUpdate(this.__tweenUpdate,this)
				.onComplete(this.__tweenComplete,this);
			}
		}
		else {
			this._owner._gearLocked=true;
			this._owner.setXY(pt.x,pt.y);
			this._owner._gearLocked=false;
		}
	}

	__proto.__tweenUpdate=function(tweener){
		this._owner._gearLocked=true;
		this._owner.setXY(tweener.value.x,tweener.value.y);
		this._owner._gearLocked=false;
	}

	__proto.__tweenComplete=function(){
		if(this._tweenConfig._displayLockToken!=0){
			this._owner.releaseDisplayLock(this._tweenConfig._displayLockToken);
			this._tweenConfig._displayLockToken=0;
		}
		this._tweenConfig._tweener=null;
	}

	__proto.updateState=function(){
		var pt=this._storage[this._controller.selectedPageId];
		if(!pt){
			pt=new Point();
			this._storage[this._controller.selectedPageId]=pt;
		}
		pt.x=this._owner.x;
		pt.y=this._owner.y;
	}

	__proto.updateFromRelations=function(dx,dy){
		if(this._controller==null || this._storage==null)
			return;
		for (var key in this._storage){
			var pt=this._storage[key];
			pt.x+=dx;
			pt.y+=dy;
		}
		this._default.x+=dx;
		this._default.y+=dy;
		this.updateState();
	}

	return GearXY;
})(GearBase)



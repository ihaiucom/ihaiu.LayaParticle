//class fairygui.gears.GearLook extends fairygui.gears.GearBase
var GearLook=(function(_super){
	var GearLookValue;
	function GearLook(owner){
		this._storage=null;
		this._default=null;
		GearLook.__super.call(this,owner);
	}

	__class(GearLook,'fairygui.gears.GearLook',_super);
	var __proto=GearLook.prototype;
	__proto.init=function(){
		this._default=new GearLookValue(this._owner.alpha,this._owner.rotation,this._owner.grayed,this._owner.touchable);
		this._storage={};
	}

	__proto.addStatus=function(pageId,buffer){
		var gv;
		if (pageId==null)
			gv=this._default;
		else {
			gv=new GearLookValue();
			this._storage[pageId]=gv;
		}
		gv.alpha=buffer.getFloat32();
		gv.rotation=buffer.getFloat32();
		gv.grayed=buffer.readBool();
		gv.touchable=buffer.readBool();
	}

	__proto.apply=function(){
		var gv=this._storage[this._controller.selectedPageId];
		if(!gv)
			gv=this._default;
		if(this._tweenConfig!=null && this._tweenConfig.tween && !UIPackage._constructing && !GearBase.disableAllTweenEffect){
			this._owner._gearLocked=true;
			this._owner.grayed=gv.grayed;
			this._owner.touchable=gv.touchable;
			this._owner._gearLocked=false;
			if (this._tweenConfig._tweener !=null){
				if (this._tweenConfig._tweener.endValue.x !=gv.alpha || this._tweenConfig._tweener.endValue.y !=gv.rotation){
					this._tweenConfig._tweener.kill(true);
					this._tweenConfig._tweener=null;
				}
				else
				return;
			};
			var a=gv.alpha!=this._owner.alpha;
			var b=gv.rotation!=this._owner.rotation;
			if(a || b){
				if(this._owner.checkGearController(0,this._controller))
					this._tweenConfig._displayLockToken=this._owner.addDisplayLock();
				this._tweenConfig._tweener=GTween.to2(this._owner.alpha,this._owner.rotation,gv.alpha,gv.rotation,this._tweenConfig.duration)
				.setDelay(this._tweenConfig.delay)
				.setEase(this._tweenConfig.easeType)
				.setUserData((a ? 1 :0)+(b ? 2 :0))
				.setTarget(this)
				.onUpdate(this.__tweenUpdate,this)
				.onComplete(this.__tweenComplete,this);
			}
		}
		else {
			this._owner._gearLocked=true;
			this._owner.grayed=gv.grayed;
			this._owner.alpha=gv.alpha;
			this._owner.rotation=gv.rotation;
			this._owner.touchable=gv.touchable;
			this._owner._gearLocked=false;
		}
	}

	__proto.__tweenUpdate=function(tweener){
		var flag=tweener.userData;
		this._owner._gearLocked=true;
		if ((flag & 1)!=0)
			this._owner.alpha=tweener.value.x;
		if ((flag & 2)!=0)
			this._owner.rotation=tweener.value.y;
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
		var gv=this._storage[this._controller.selectedPageId];
		if(!gv){
			gv=new GearLookValue();
			this._storage[this._controller.selectedPageId]=gv;
		}
		gv.alpha=this._owner.alpha;
		gv.rotation=this._owner.rotation;
		gv.grayed=this._owner.grayed;
		gv.touchable=this._owner.touchable;
	}

	GearLook.__init$=function(){
		
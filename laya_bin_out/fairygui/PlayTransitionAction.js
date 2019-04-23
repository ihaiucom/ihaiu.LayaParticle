//class fairygui.action.PlayTransitionAction extends fairygui.action.ControllerAction
var PlayTransitionAction=(function(_super){
	function PlayTransitionAction(){
		this.transitionName=null;
		this.playTimes=1;
		this.delay=0;
		this.stopOnExit=false;
		this._currentTransition=null;
		PlayTransitionAction.__super.call(this);
	}

	__class(PlayTransitionAction,'fairygui.action.PlayTransitionAction',_super);
	var __proto=PlayTransitionAction.prototype;
	__proto.enter=function(controller){
		var trans=controller.parent.getTransition(this.transitionName);
		if(trans){
			if(this._currentTransition && this._currentTransition.playing)
				trans.changePlayTimes(this.playTimes);
			else
			trans.play(null,this.playTimes,this.delay);
			this._currentTransition=trans;
		}
	}

	__proto.leave=function(controller){
		if(this.stopOnExit && this._currentTransition){
			this._currentTransition.stop();
			this._currentTransition=null;
		}
	}

	__proto.setup=function(buffer){
		_super.prototype.setup.call(this,buffer);
		this.transitionName=buffer.readS();
		this.playTimes=buffer.getInt32();
		this.delay=buffer.getFloat32();
		this.stopOnExit=buffer.readBool();
	}

	return PlayTransitionAction;
})(ControllerAction)



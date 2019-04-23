//class fairygui.Transition
var Transition=(function(){
	var TransitionActionType,TransitionItem,TweenConfig,TValue_Visible,TValue_Animation,TValue_Sound,TValue_Transition,TValue_Shake,TValue_Text,TValue;
	function Transition(owner){
		this.name=null;
		this._owner=null;
		this._ownerBaseX=NaN;
		this._ownerBaseY=NaN;
		this._items=null;
		this._totalTimes=0;
		this._totalTasks=0;
		this._playing=false;
		this._paused=false;
		this._onComplete=null;
		this._options=0;
		this._reversed=false;
		this._totalDuration=NaN;
		this._autoPlay=false;
		this._autoPlayTimes=0;
		this._autoPlayDelay=NaN;
		this._timeScale=NaN;
		this._startTime=NaN;
		this._endTime=NaN;
		this.OPTION_IGNORE_DISPLAY_CONTROLLER=1;
		this.OPTION_AUTO_STOP_DISABLED=2;
		this.OPTION_AUTO_STOP_AT_END=4;
		this._owner=owner;
		this._items=[];
		this._totalDuration=0;
		this._autoPlayTimes=1;
		this._autoPlayDelay=0;
		this._timeScale=1;
		this._startTime=0;
		this._endTime=0;
	}

	__class(Transition,'fairygui.Transition');
	var __proto=Transition.prototype;
	__proto.play=function(onComplete,times,delay,startTime,endTime){
		(times===void 0)&& (times=1);
		(delay===void 0)&& (delay=0);
		(startTime===void 0)&& (startTime=0);
		(endTime===void 0)&& (endTime=-1);
		this._play(onComplete,times,delay,startTime,endTime,false);
	}

	__proto.playReverse=function(onComplete,times,delay,startTime,endTime){
		(times===void 0)&& (times=1);
		(delay===void 0)&& (delay=0);
		(startTime===void 0)&& (startTime=0);
		(endTime===void 0)&& (endTime=-1);
		this._play(onComplete,1,delay,startTime,endTime,true);
	}

	__proto.changePlayTimes=function(value){
		this._totalTimes=value;
	}

	__proto.setAutoPlay=function(value,times,delay){
		(times===void 0)&& (times=1);
		(delay===void 0)&& (delay=0);
		if (this._autoPlay !=value){
			this._autoPlay=value;
			this._autoPlayTimes=times;
			this._autoPlayDelay=delay;
			if (this._autoPlay){
				if (this._owner.onStage)
					this.play(null,null,this._autoPlayTimes,this._autoPlayDelay);
			}
			else{
				if (!this._owner.onStage)
					this.stop(false,true);
			}
		}
	}

	__proto._play=function(onComplete,times,delay,startTime,endTime,reversed){
		(times===void 0)&& (times=1);
		(delay===void 0)&& (delay=0);
		(startTime===void 0)&& (startTime=0);
		(endTime===void 0)&& (endTime=-1);
		(reversed===void 0)&& (reversed=false);
		this.stop(true,true);
		this._totalTimes=times;
		this._reversed=reversed;
		this._startTime=startTime;
		this._endTime=endTime;
		this._playing=true;
		this._paused=false;
		this._onComplete=onComplete;
		var cnt=this._items.length;
		for (var i=0;i < cnt;i++){
			var item=this._items[i];
			if(item.target==null){
				if (item.targetId)
					item.target=this._owner.getChildById(item.targetId);
				else
				item.target=this._owner;
			}
			else if (item.target !=this._owner && item.target.parent !=this._owner)
			item.target=null;
			if (item.target !=null && item.type==10){
				var trans=(item.target).getTransition(item.value.transName);
				if(trans==this)
					trans=null;
				if (trans !=null){
					if (item.value.playTimes==0){
						var j=0;
						for (j=i-1;j >=0;j--){
							var item2=this._items[j];
							if (item2.type==10){
								if (item2.value.trans==trans){
									item2.value.stopTime=item.time-item2.time;
									break ;
								}
							}
						}
						if(j<0)
							item.value.stopTime=0;
						else
						trans=null;
					}
					else
					item.value.stopTime=-1;
				}
				item.value.trans=trans;
			}
		}
		if(delay==0)
			this.onDelayedPlay();
		else
		GTween.delayedCall(delay).onComplete(this.onDelayedPlay,this);
	}

	__proto.stop=function(setToComplete,processCallback){
		(setToComplete===void 0)&& (setToComplete=true);
		(processCallback===void 0)&& (processCallback=false);
		if (!this._playing)
			return;
		this._playing=false;
		this._totalTasks=0;
		this._totalTimes=0;
		var handler=this._onComplete;
		this._onComplete=null;
		GTween.kill(this);
		var cnt=this._items.length;
		if(this._reversed){
			for (var i=cnt-1;i >=0;i--){
				var item=this._items[i];
				if(item.target==null)
					continue ;
				this.stopItem(item,setToComplete);
			}
		}
		else{
			for (i=0;i < cnt;i++){
				item=this._items[i];
				if(item.target==null)
					continue ;
				this.stopItem(item,setToComplete);
			}
		}
		if (processCallback && handler !=null){
			handler.run();
		}
	}

	__proto.stopItem=function(item,setToComplete){
		if (item.displayLockToken!=0){
			item.target.releaseDisplayLock(item.displayLockToken);
			item.displayLockToken=0;
		}
		if (item.tweener !=null){
			item.tweener.kill(setToComplete);
			item.tweener=null;
			if (item.type==11 && !setToComplete){
				item.target._gearLocked=true;
				item.target.setXY(item.target.x-item.value.lastOffsetX,item.target.y-item.value.lastOffsetY);
				item.target._gearLocked=false;
			}
		}
		if (item.type==10){
			var trans=item.value.trans;
			if (trans !=null)
				trans.stop(setToComplete,false);
		}
	}

	__proto.setPaused=function(paused){
		if (!this._playing || this._paused==paused)
			return;
		this._paused=paused;
		var tweener=GTween.getTween(this);
		if (tweener !=null)
			tweener.setPaused(paused);
		var cnt=this._items.length;
		for (var i=0;i < cnt;i++){
			var item=this._items[i];
			if (item.target==null)
				continue ;
			if (item.type==10){
				if (item.value.trans !=null)
					item.value.trans.setPaused(paused);
			}
			else if (item.type==7){
				if (paused){
					item.value.flag=(item.target).playing;
					(item.target).playing=false;
				}
				else
				(item.target).playing=item.value.flag;
			}
			if (item.tweener !=null)
				item.tweener.setPaused(paused);
		}
	}

	__proto.dispose=function(){
		if(this._playing)
			GTween.kill(this);
		var cnt=this._items.length;
		for (var i=0;i < cnt;i++){
			var item=this._items[i];
			if (item.tweener !=null){
				item.tweener.kill();
				item.tweener=null;
			}
			item.target=null;
			item.hook=null;
			if (item.tweenConfig !=null)
				item.tweenConfig.endHook=null;
		}
		this._items.length=0;
		this._playing=false;
		this._onComplete=null;
	}

	__proto.setValue=function(label,__args){
		var args=[];for(var i=1,sz=arguments.length;i<sz;i++)args.push(arguments[i]);
		var cnt=this._items.length;
		var value;
		for (var i=0;i < cnt;i++){
			var item=this._items[i];
			if (item.label==label){
				if (item.tweenConfig !=null)
					value=item.tweenConfig.startValue;
				else
				value=item.value;
			}
			else if (item.tweenConfig !=null && item.tweenConfig.endLabel==label){
				value=item.tweenConfig.endValue;
			}
			else
			continue ;
			switch (item.type){
				case 0:
				case 1:
				case 3:
				case 2:
				case 13:
					value.b1=true;
					value.b2=true;
					value.f1=parseFloat(args[0]);
					value.f2=parseFloat(args[1]);
					break ;
				case 4:
					value.f1=parseFloat(args[0]);
					break ;
				case 5:
					value.f1=parseFloat(args[0]);
					break ;
				case 6:
					value.f1=parseFloat(args[0]);
					break ;
				case 7:
					value.frame=parseInt(args[0]);
					if (args.length > 1)
						value.playing=args[1];
					break ;
				case 8:
					value.visible=args[0];
					break ;
				case 9:
					value.sound=args[0];
					if(args.length > 1)
						value.volume=parseFloat(args[1]);
					break ;
				case 10:
					value.transName=args[0];
					if (args.length > 1)
						value.playTimes=parseInt(args[1]);
					break ;
				case 11:
					value.amplitude=parseFloat(args[0]);
					if (args.length > 1)
						value.duration=parseFloat(args[1]);
					break ;
				case 12:
					value.f1=parseFloat(args[0]);
					value.f2=parseFloat(args[1]);
					value.f3=parseFloat(args[2]);
					value.f4=parseFloat(args[3]);
					break ;
				case 14:
				case 15:
					value.text=args[0];
					break ;
				}
		}
	}

	__proto.setHook=function(label,callback){
		var cnt=this._items.length;
		for (var i=0;i < cnt;i++){
			var item=this._items[i];
			if (item.label==label){
				item.hook=callback;
				break ;
			}
			else if (item.tweenConfig !=null && item.tweenConfig.endLabel==label){
				item.tweenConfig.endHook=callback;
				break ;
			}
		}
	}

	__proto.clearHooks=function(){
		var cnt=this._items.length;
		for (var i=0;i < cnt;i++){
			var item=this._items[i];
			item.hook=null;
			if (item.tweenConfig !=null)
				item.tweenConfig.endHook=null;
		}
	}

	__proto.setTarget=function(label,newTarget){
		var cnt=this._items.length;
		for (var i=0;i < cnt;i++){
			var item=this._items[i];
			if (item.label==label){
				item.targetId=newTarget.id;
				item.target=null;
			}
		}
	}

	__proto.setDuration=function(label,value){
		var cnt=this._items.length;
		for (var i=0;i < cnt;i++){
			var item=this._items[i];
			if (item.tweenConfig !=null && item.label==label)
				item.tweenConfig.duration=value;
		}
	}

	__proto.getLabelTime=function(label){
		var cnt=this._items.length;
		for (var i=0;i < cnt;i++){
			var item=this._items[i];
			if (item.label==label)
				return item.time;
			else if (item.tweenConfig !=null && item.tweenConfig.endLabel==label)
			return item.time+item.tweenConfig.duration;
		}
		return Number.NaN;
	}

	__proto.updateFromRelations=function(targetId,dx,dy){
		var cnt=this._items.length;
		if (cnt==0)
			return;
		for (var i=0;i < cnt;i++){
			var item=this._items[i];
			if (item.type==0 && item.targetId==targetId){
				if (item.tweenConfig!=null){
					item.tweenConfig.startValue.f1+=dx;
					item.tweenConfig.startValue.f2+=dy;
					item.tweenConfig.endValue.f1+=dx;
					item.tweenConfig.endValue.f2+=dy;
				}
				else{
					item.value.f1+=dx;
					item.value.f2+=dy;
				}
			}
		}
	}

	__proto.onOwnerAddedToStage=function(){
		if (this._autoPlay && !this._playing)
			this.play(null,this._autoPlayTimes,this._autoPlayDelay);
	}

	__proto.onOwnerRemovedFromStage=function(){
		if ((this._options & this.OPTION_AUTO_STOP_DISABLED)==0)
			this.stop((this._options & this.OPTION_AUTO_STOP_AT_END)!=0 ? true :false,false);
	}

	__proto.onDelayedPlay=function(){
		this.internalPlay();
		this._playing=this._totalTasks>0;
		if (this._playing){
			if ((this._options & this.OPTION_IGNORE_DISPLAY_CONTROLLER)!=0){
				var cnt=this._items.length;
				for (var i=0;i < cnt;i++){
					var item=this._items[i];
					if (item.target !=null && item.target!=this._owner)
						item.displayLockToken=item.target.addDisplayLock();
				}
			}
		}
		else if (this._onComplete !=null){
			var handler=this._onComplete;
			this._onComplete=null;
			handler.run();
		}
	}

	__proto.internalPlay=function(){
		this._ownerBaseX=this._owner.x;
		this._ownerBaseY=this._owner.y;
		this._totalTasks=0;
		var cnt=this._items.length;
		var item;
		var needSkipAnimations=false;
		if (!this._reversed){
			for (var i=0;i < cnt;i++){
				item=this._items[i];
				if (item.target==null)
					continue ;
				if (item.type==7 && this._startTime !=0 && item.time <=this._startTime){
					needSkipAnimations=true;
					item.value.flag=false;
				}
				else
				this.playItem(item);
			}
		}
		else{
			for (i=cnt-1;i >=0;i--){
				item=this._items[i];
				if (item.target==null)
					continue ;
				this.playItem(item);
			}
		}
		if (needSkipAnimations)
			this.skipAnimations();
	}

	__proto.playItem=function(item){
		var time=NaN;
		if (item.tweenConfig !=null){
			if (this._reversed)
				time=(this._totalDuration-item.time-item.tweenConfig.duration);
			else
			time=item.time;
			if (this._endTime==-1 || time <=this._endTime){
				var startValue;
				var endValue;
				if(this._reversed){
					startValue=item.tweenConfig.endValue;
					endValue=item.tweenConfig.startValue;
				}
				else{
					startValue=item.tweenConfig.startValue;
					endValue=item.tweenConfig.endValue;
				}
				item.value.b1=startValue.b1 || endValue.b1;
				item.value.b2=startValue.b2 || endValue.b2;
				switch(item.type){
					case 0:
					case 1:
					case 2:
					case 13:
						item.tweener=GTween.to2(startValue.f1,startValue.f2,endValue.f1,endValue.f2,item.tweenConfig.duration);
						break ;
					case 4:
					case 5:
						item.tweener=GTween.to(startValue.f1,endValue.f1,item.tweenConfig.duration);
						break ;
					case 6:
						item.tweener=GTween.toColor(startValue.f1,endValue.f1,item.tweenConfig.duration);
						break ;
					case 12:
						item.tweener=GTween.to4(startValue.f1,startValue.f2,startValue.f3,startValue.f4,
						endValue.f1,endValue.f2,endValue.f3,endValue.f4,item.tweenConfig.duration);
						break ;
					}
				item.tweener.setDelay(time)
				.setEase(item.tweenConfig.easeType)
				.setRepeat(item.tweenConfig.repeat,item.tweenConfig.yoyo)
				.setTimeScale(this._timeScale)
				.setTarget(item)
				.onStart(this.onTweenStart,this)
				.onUpdate(this.onTweenUpdate,this)
				.onComplete(this.onTweenComplete,this);
				if (this._endTime >=0)
					item.tweener.setBreakpoint(this._endTime-time);
				this._totalTasks++;
			}
		}
		else if(item.type==11){
			if (this._reversed)
				time=(this._totalDuration-item.time-item.value.duration);
			else
			time=item.time;
			item.value.offsetX=item.value.offsetY=0;
			item.value.lastOffsetX=item.value.lastOffsetY=0;
			item.tweener=GTween.shake(0,0,item.value.amplitude,item.value.duration)
			.setDelay(time)
			.setTimeScale(this._timeScale)
			.setTarget(item)
			.onUpdate(this.onTweenUpdate,this)
			.onComplete(this.onTweenComplete,this);
			if (this._endTime >=0)
				item.tweener.setBreakpoint(this._endTime-item.time);
			this._totalTasks++;
		}
		else{
			if (this._reversed)
				time=(this._totalDuration-item.time);
			else
			time=item.time;
			if (time <=this._startTime){
				this.applyValue(item);
				this.callHook(item,false);
			}
			else if (this._endTime==-1 || time <=this._endTime){
				this._totalTasks++;
				item.tweener=GTween.delayedCall(time)
				.setTimeScale(this._timeScale)
				.setTarget(item)
				.onComplete(this.onDelayedPlayItem,this);
			}
		}
		if (item.tweener !=null)
			item.tweener.seek(this._startTime);
	}

	__proto.skipAnimations=function(){
		var frame=0;
		var playStartTime=NaN;
		var playTotalTime=NaN;
		var value;
		var target;
		var item;
		var cnt=this._items.length;
		for (var i=0;i < cnt;i++){
			item=this._items[i];
			if (item.type !=7 || item.time > this._startTime)
				continue ;
			value=item.value;
			if (value.flag)
				continue ;
			target=(item.target);
			frame=target.frame;
			playStartTime=target.playing ? 0 :-1;
			playTotalTime=0;
			for (var j=i;j < cnt;j++){
				item=this._items[j];
				if (item.type !=7 || item.target !=target || item.time > this._startTime)
					continue ;
				value=item.value;
				value.flag=true;
				if (value.frame !=-1){
					frame=value.frame;
					if (value.playing)
						playStartTime=item.time;
					else
					playStartTime=-1;
					playTotalTime=0;
				}
				else{
					if (value.playing){
						if (playStartTime < 0)
							playStartTime=item.time;
					}
					else{
						if (playStartTime >=0)
							playTotalTime+=(item.time-playStartTime);
						playStartTime=-1;
					}
				}
				this.callHook(item,false);
			}
			if (playStartTime >=0)
				playTotalTime+=(this._startTime-playStartTime);
			target.playing=playStartTime>=0;
			target.frame=frame;
			if (playTotalTime > 0)
				target.advance(playTotalTime*1000);
		}
	}

	__proto.onDelayedPlayItem=function(tweener){
		var item=tweener.target;
		item.tweener=null;
		this._totalTasks--;
		this.applyValue(item);
		this.callHook(item,false);
		this.checkAllComplete();
	}

	__proto.onTweenStart=function(tweener){
		var item=tweener.target;
		if (item.type==0 || item.type==1){
			var startValue;
			var endValue;
			if (this._reversed){
				startValue=item.tweenConfig.endValue;
				endValue=item.tweenConfig.startValue;
			}
			else{
				startValue=item.tweenConfig.startValue;
				endValue=item.tweenConfig.endValue;
			}
			if (item.type==0){
				if (item.target !=this._owner){
					if (!startValue.b1)
						startValue.f1=item.target.x;
					if (!startValue.b2)
						startValue.f2=item.target.y;
				}
				else{
					if (!startValue.b1)
						startValue.f1=item.target.x-this._ownerBaseX;
					if (!startValue.b2)
						startValue.f2=item.target.y-this._ownerBaseY;
				}
			}
			else{
				if (!startValue.b1)
					startValue.f1=item.target.width;
				if (!startValue.b2)
					startValue.f2=item.target.height;
			}
			if (!endValue.b1)
				endValue.f1=startValue.f1;
			if (!endValue.b2)
				endValue.f2=startValue.f2;
			tweener.startValue.x=startValue.f1;
			tweener.startValue.y=startValue.f2;
			tweener.endValue.x=endValue.f1;
			tweener.endValue.y=endValue.f2;
		}
		this.callHook(item,false);
	}

	__proto.onTweenUpdate=function(tweener){
		var item=tweener.target;
		switch (item.type){
			case 0:
			case 1:
			case 2:
			case 13:
				item.value.f1=tweener.value.x;
				item.value.f2=tweener.value.y;
				break ;
			case 4:
			case 5:
				item.value.f1=tweener.value.x;
				break ;
			case 6:
				item.value.f1=tweener.value.color;
				break ;
			case 12:
				item.value.f1=tweener.value.x;
				item.value.f2=tweener.value.y;
				item.value.f3=tweener.value.z;
				item.value.f4=tweener.value.w;
				break ;
			case 11:
				item.value.offsetX=tweener.deltaValue.x;
				item.value.offsetY=tweener.deltaValue.y;
				break ;
			}
		this.applyValue(item);
	}

	__proto.onTweenComplete=function(tweener){
		var item=tweener.target;
		item.tweener=null;
		this._totalTasks--;
		if (tweener.allCompleted)
			this.callHook(item,true);
		this.checkAllComplete();
	}

	__proto.onPlayTransCompleted=function(item){
		this._totalTasks--;
		this.checkAllComplete();
	}

	__proto.callHook=function(item,tweenEnd){
		if (tweenEnd){
			if (item.tweenConfig!=null && item.tweenConfig.endHook !=null)
				item.tweenConfig.endHook.run();
		}
		else{
			if (item.time >=this._startTime && item.hook !=null)
				item.hook.run();
		}
	}

	__proto.checkAllComplete=function(){
		if (this._playing && this._totalTasks==0){
			if (this._totalTimes < 0){
				this.internalPlay();
			}
			else{
				this._totalTimes--;
				if (this._totalTimes > 0)
					this.internalPlay();
				else{
					this._playing=false;
					var cnt=this._items.length;
					for (var i=0;i < cnt;i++){
						var item=this._items[i];
						if (item.target !=null && item.displayLockToken!=0){
							item.target.releaseDisplayLock(item.displayLockToken);
							item.displayLockToken=0;
						}
					}
					if (this._onComplete !=null){
						var handler=this._onComplete;
						this._onComplete=null;
						handler.run();
					}
				}
			}
		}
	}

	__proto.applyValue=function(item){
		item.target._gearLocked=true;
		switch (item.type){
			case 0:
				if(item.target==this._owner){
					var f1=NaN,f2=NaN;
					if (!item.value.b1)
						f1=item.target.x;
					else
					f1=item.value.f1+this._ownerBaseX;
					if (!item.value.b2)
						f2=item.target.y;
					else
					f2=item.value.f2+this._ownerBaseY;
					item.target.setXY(f1,f2);
				}
				else{
					if (!item.value.b1)
						item.value.f1=item.target.x;
					if (!item.value.b2)
						item.value.f2=item.target.y;
					item.target.setXY(item.value.f1,item.value.f2);
				}
				break ;
			case 1:
				if (!item.value.b1)
					item.value.f1=item.target.width;
				if (!item.value.b2)
					item.value.f2=item.target.height;
				item.target.setSize(item.value.f1,item.value.f2);
				break ;
			case 3:
				item.target.setPivot(item.value.f1,item.value.f2,item.target.pivotAsAnchor);
				break ;
			case 4:
				item.target.alpha=item.value.f1;
				break ;
			case 5:
				item.target.rotation=item.value.f1;
				break ;
			case 2:
				item.target.setScale(item.value.f1,item.value.f2);
				break ;
			case 13:
				item.target.setSkew(item.value.f1,item.value.f2);
				break ;
			case 6:
				(item.target).color=ToolSet.convertToHtmlColor(item.value.f1,false);
				break ;
			case 7:
				if (item.value.frame>=0)
					(item.target).frame=item.value.frame;
				(item.target).playing=item.value.playing;
				(item.target).timeScale=this._timeScale;
				break ;
			case 8:
				item.target.visible=item.value.visible;
				break ;
			case 10:
				if (this._playing){
					var trans=item.value.trans;
					if (trans !=null){
						this._totalTasks++;
						var startTime=this._startTime > item.time ? (this._startTime-item.time):0;
						var endTime=this._endTime >=0 ? (this._endTime-item.time):-1;
						if (item.value.stopTime >=0 && (endTime < 0 || endTime > item.value.stopTime))
							endTime=item.value.stopTime;
						trans.timeScale=this._timeScale;
						trans._play(Handler.create(this,this.onPlayTransCompleted,[item]),item.value.playTimes,0,startTime,endTime,this._reversed);
					}
				}
				break ;
			case 9:
				if (this._playing && item.time >=this._startTime){
					if(item.value.audioClip==null){
						var pi=UIPackage.getItemByURL(item.value.sound);
						if(pi)
							item.value.audioClip=pi.file;
						else
						item.value.audioClip=item.value.sound;
					}
					if(item.value.audioClip)
						GRoot.inst.playOneShotSound(item.value.audioClip,item.value.volume);
				}
				break ;
			case 11:
				item.target.setXY(item.target.x-item.value.lastOffsetX+item.value.offsetX,item.target.y-item.value.lastOffsetY+item.value.offsetY);
				item.value.lastOffsetX=item.value.offsetX;
				item.value.lastOffsetY=item.value.offsetY;
				break ;
			case 12:{
					var arr=item.target.filters;
					var cm=new ColorMatrix();
					cm.adjustBrightness(item.value.f1);
					cm.adjustContrast(item.value.f2);
					cm.adjustSaturation(item.value.f3);
					cm.adjustHue(item.value.f4);
					arr=[new ColorFilter(cm)];
					item.target.filters=arr;
					break ;
				}
			case 14:
				item.target.text=item.value.text;
				break ;
			case 15:
				item.target.icon=item.value.text;
				break ;
			}
		item.target._gearLocked=false;
	}

	__proto.setup=function(buffer){
		this.name=buffer.readS();
		this._options=buffer.getInt32();
		this._autoPlay=buffer.readBool();
		this._autoPlayTimes=buffer.getInt32();
		this._autoPlayDelay=buffer.getFloat32();
		var cnt=buffer.getInt16();
		for (var i=0;i < cnt;i++){
			var dataLen=buffer.getInt16();
			var curPos=buffer.pos;
			buffer.seek(curPos,0);
			var item=new TransitionItem(buffer.readByte());
			this._items[i]=item;
			item.time=buffer.getFloat32();
			var targetId=buffer.getInt16();
			if (targetId < 0)
				item.targetId="";
			else
			item.targetId=this._owner.getChildAt(targetId).id;
			item.label=buffer.readS();
			if (buffer.readBool()){
				buffer.seek(curPos,1);
				item.tweenConfig=new TweenConfig();
				item.tweenConfig.duration=buffer.getFloat32();
				if (item.time+item.tweenConfig.duration > this._totalDuration)
					this._totalDuration=item.time+item.tweenConfig.duration;
				item.tweenConfig.easeType=buffer.readByte();
				item.tweenConfig.repeat=buffer.getInt32();
				item.tweenConfig.yoyo=buffer.readBool();
				item.tweenConfig.endLabel=buffer.readS();
				buffer.seek(curPos,2);
				this.decodeValue(item,buffer,item.tweenConfig.startValue);
				buffer.seek(curPos,3);
				this.decodeValue(item,buffer,item.tweenConfig.endValue);
			}
			else{
				if (item.time > this._totalDuration)
					this._totalDuration=item.time;
				buffer.seek(curPos,2);
				this.decodeValue(item,buffer,item.value);
			}
			buffer.pos=curPos+dataLen;
		}
	}

	__proto.decodeValue=function(item,buffer,value){
		switch(item.type){
			case 0:
			case 1:
			case 3:
			case 13:
				value.b1=buffer.readBool();
				value.b2=buffer.readBool();
				value.f1=buffer.getFloat32();
				value.f2=buffer.getFloat32();
				break ;
			case 4:
			case 5:
				value.f1=buffer.getFloat32();
				break ;
			case 2:
				value.f1=buffer.getFloat32();
				value.f2=buffer.getFloat32();
				break ;
			case 6:
				value.f1=buffer.readColor();
				break ;
			case 7:
				value.playing=buffer.readBool();
				value.frame=buffer.getInt32();
				break ;
			case 8:
				value.visible=buffer.readBool();
				break ;
			case 9:
				value.sound=buffer.readS();
				value.volume=buffer.getFloat32();
				break ;
			case 10:
				value.transName=buffer.readS();
				value.playTimes=buffer.getInt32();
				break ;
			case 11:
				value.amplitude=buffer.getFloat32();
				value.duration=buffer.getFloat32();
				break ;
			case 12:
				value.f1=buffer.getFloat32();
				value.f2=buffer.getFloat32();
				value.f3=buffer.getFloat32();
				value.f4=buffer.getFloat32();
				break ;
			case 14:
			case 15:
				value.text=buffer.readS();
				break ;
			}
	}

	__getset(0,__proto,'playing',function(){
		return this._playing;
	});

	__getset(0,__proto,'timeScale',function(){
		return this._timeScale;
		},function(value){
		if(this._timeScale !=value){
			this._timeScale=value;
			if (this._playing){
				var cnt=this._items.length;
				for (var i=0;i < cnt;i++){
					var item=this._items[i];
					if (item.tweener !=null)
						item.tweener.setTimeScale(value);
					else if (item.type==10){
						if(item.value.trans !=null)
							item.value.trans.timeScale=value;
					}
					else if(item.type==7){
						if(item.target !=null)
							(item.target).timeScale=value;
					}
				}
			}
		}
	});

	Transition.__init$=function(){
		
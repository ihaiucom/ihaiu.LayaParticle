//class fairygui.tween.GTweener
var GTweener=(function(){
	function GTweener(){
		this._target=null;
		this._propType=null;
		this._killed=false;
		this._paused=false;
		this._delay=NaN;
		this._duration=NaN;
		this._breakpoint=NaN;
		this._easeType=0;
		this._easeOvershootOrAmplitude=NaN;
		this._easePeriod=NaN;
		this._repeat=0;
		this._yoyo=false;
		this._timeScale=NaN;
		this._snapping=false;
		this._userData=null;
		this._onUpdate=null;
		this._onUpdateCaller=null;
		this._onStart=null;
		this._onStartCaller=null;
		this._onComplete=null;
		this._onCompleteCaller=null;
		this._startValue=null;
		this._endValue=null;
		this._value=null;
		this._deltaValue=null;
		this._valueSize=0;
		this._started=false;
		this._ended=0;
		this._elapsedTime=NaN;
		this._normalizedTime=NaN;
		this._startValue=new TweenValue();
		this._endValue=new TweenValue();
		this._value=new TweenValue();
		this._deltaValue=new TweenValue();
		this._reset();
	}

	__class(GTweener,'fairygui.tween.GTweener');
	var __proto=GTweener.prototype;
	__proto.setDelay=function(value){
		this._delay=value;
		return this;
	}

	__proto.setDuration=function(value){
		this._duration=value;
		return this;
	}

	__proto.setBreakpoint=function(value){
		this._breakpoint=value;
		return this;
	}

	__proto.setEase=function(value){
		this._easeType=value;
		return this;
	}

	__proto.setEasePeriod=function(value){
		this._easePeriod=value;
		return this;
	}

	__proto.setEaseOvershootOrAmplitude=function(value){
		this._easeOvershootOrAmplitude=value;
		return this;
	}

	__proto.setRepeat=function(repeat,yoyo){
		(yoyo===void 0)&& (yoyo=false);
		this._repeat=repeat;
		this._yoyo=yoyo;
		return this;
	}

	__proto.setTimeScale=function(value){
		this._timeScale=value;
		return this;
	}

	__proto.setSnapping=function(value){
		this._snapping=value;
		return this;
	}

	__proto.setTarget=function(value,propType){
		this._target=value;
		this._propType=propType;
		return this;
	}

	__proto.setUserData=function(value){
		this._userData=value;
		return this;
	}

	__proto.onUpdate=function(callback,caller){
		this._onUpdate=callback;
		this._onUpdateCaller=caller;
		return this;
	}

	__proto.onStart=function(callback,caller){
		this._onStart=callback;
		this._onStartCaller=caller;
		return this;
	}

	__proto.onComplete=function(callback,caller){
		this._onComplete=callback;
		this._onCompleteCaller=caller;
		return this;
	}

	__proto.setPaused=function(paused){
		this._paused=paused;
		return this;
	}

	/**
	*seek position of the tween,in seconds.
	*/
	__proto.seek=function(time){
		if (this._killed)
			return;
		this._elapsedTime=time;
		if (this._elapsedTime < this._delay){
			if (this._started)
				this._elapsedTime=this._delay;
			else
			return;
		}
		this.update();
	}

	__proto.kill=function(complete){
		(complete===void 0)&& (complete=false);
		if (this._killed)
			return;
		if (complete){
			if (this._ended==0){
				if (this._breakpoint >=0)
					this._elapsedTime=this._delay+this._breakpoint;
				else if (this._repeat >=0)
				this._elapsedTime=this._delay+this._duration *(this._repeat+1);
				else
				this._elapsedTime=this._delay+this._duration *2;
				this.update();
			}
			this.callCompleteCallback();
		}
		this._killed=true;
	}

	__proto._to=function(start,end,duration){
		this._valueSize=1;
		this._startValue.x=start;
		this._endValue.x=end;
		this._duration=duration;
		return this;
	}

	__proto._to2=function(start,start2,end,end2,duration){
		this._valueSize=2;
		this._startValue.x=start;
		this._endValue.x=end;
		this._startValue.y=start2;
		this._endValue.y=end2;
		this._duration=duration;
		return this;
	}

	__proto._to3=function(start,start2,start3,end,end2,end3,duration){
		this._valueSize=3;
		this._startValue.x=start;
		this._endValue.x=end;
		this._startValue.y=start2;
		this._endValue.y=end2;
		this._startValue.z=start3;
		this._endValue.z=end3;
		this._duration=duration;
		return this;
	}

	__proto._to4=function(start,start2,start3,start4,end,end2,end3,end4,duration){
		this._valueSize=4;
		this._startValue.x=start;
		this._endValue.x=end;
		this._startValue.y=start2;
		this._endValue.y=end2;
		this._startValue.z=start3;
		this._endValue.z=end3;
		this._startValue.w=start4;
		this._endValue.w=end4;
		this._duration=duration;
		return this;
	}

	__proto._toColor=function(start,end,duration){
		this._valueSize=4;
		this._startValue.color=start;
		this._endValue.color=end;
		this._duration=duration;
		return this;
	}

	__proto._shake=function(startX,startY,amplitude,duration){
		this._valueSize=5;
		this._startValue.x=startX;
		this._startValue.y=startY;
		this._startValue.w=amplitude;
		this._duration=duration;
		this._easeType=0;
		return this;
	}

	__proto._init=function(){
		this._delay=0;
		this._duration=0;
		this._breakpoint=-1;
		this._easeType=5;
		this._timeScale=1;
		this._easePeriod=0;
		this._easeOvershootOrAmplitude=1.70158;
		this._snapping=false;
		this._repeat=0;
		this._yoyo=false;
		this._valueSize=0;
		this._started=false;
		this._paused=false;
		this._killed=false;
		this._elapsedTime=0;
		this._normalizedTime=0;
		this._ended=0;
	}

	__proto._reset=function(){
		this._target=null;
		this._userData=null;
		this._onStart=this._onUpdate=this._onComplete=null;
		this._onStartCaller=this._onUpdateCaller=this._onCompleteCaller=null;
	}

	__proto._update=function(dt){
		if (this._timeScale !=1)
			dt *=this._timeScale;
		if (dt==0)
			return;
		if (this._ended !=0){
			this.callCompleteCallback();
			this._killed=true;
			return;
		}
		this._elapsedTime+=dt;
		this.update();
		if (this._ended !=0){
			if (!this._killed){
				this.callCompleteCallback();
				this._killed=true;
			}
		}
	}

	__proto.update=function(){
		this._ended=0;
		if (this._valueSize==0){
			if (this._elapsedTime >=this._delay+this._duration)
				this._ended=1;
			return;
		}
		if (!this._started){
			if (this._elapsedTime < this._delay)
				return;
			this._started=true;
			this.callStartCallback();
			if (this._killed)
				return;
		};
		var reversed=false;
		var tt=this._elapsedTime-this._delay;
		if (this._breakpoint >=0 && tt >=this._breakpoint){
			tt=this._breakpoint;
			this._ended=2;
		}
		if (this._repeat !=0){
			var round=Math.floor(tt / this._duration);
			tt-=this._duration *round;
			if (this._yoyo)
				reversed=round % 2==1;
			if (this._repeat > 0 && this._repeat-round < 0){
				if (this._yoyo)
					reversed=this._repeat % 2==1;
				tt=this._duration;
				this._ended=1;
			}
		}
		else if (tt >=this._duration){
			tt=this._duration;
			this._ended=1;
		}
		this._normalizedTime=EaseManager.evaluate(this._easeType,reversed ? (this._duration-tt):tt,this._duration,
		this._easeOvershootOrAmplitude,this._easePeriod);
		this._value.setZero();
		this._deltaValue.setZero();
		if (this._valueSize==5){
			if (this._ended==0){
				var r=this._startValue.w*(1-this._normalizedTime);
				var rx=(Math.random()*2-1)*r;
				var ry=(Math.random()*2-1)*r;
				rx=rx > 0 ? Math.ceil(rx):Math.floor(rx);
				ry=ry > 0 ? Math.ceil(ry):Math.floor(ry);
				this._deltaValue.x=rx;
				this._deltaValue.y=ry;
				this._value.x=this._startValue.x+rx;
				this._value.y=this._startValue.y+ry;
			}
			else{
				this._value.x=this._startValue.x;
				this._value.y=this._startValue.y;
			}
		}
		else{
			for (var i=0;i < this._valueSize;i++){
				var n1=this._startValue.getField(i);
				var n2=this._endValue.getField(i);
				var f=n1+(n2-n1)*this._normalizedTime;
				if (this._snapping)
					f=Math.round(f);
				this._deltaValue.setField(i,f-this._value.getField(i));
				this._value.setField(i,f);
			}
		}
		if (this._target !=null && this._propType !=null){
			if((typeof this._propType=='function')){
				switch(this._valueSize){
					case 1:
						this._propType.call(this._target,this._value.x);
						break ;
					case 2:
						this._propType.call(this._target,this._value.x,this._value.y);
						break ;
					case 3:
						this._propType.call(this._target,this._value.x,this._value.y,this._value.z);
						break ;
					case 4:
						this._propType.call(this._target,this._value.x,this._value.y,this._value.z,this._value.w);
						break ;
					case 5:
						this._propType.call(this._target,this._value.color);
						break ;
					case 6:
						this._propType.call(this._target,this._value.x,this._value.y);
						break ;
					}
			}
			else{
				if(this._valueSize==5)
					this._target[this._propType]=this._value.color;
				else
				this._target[this._propType]=this._value.x;
			}
		}
		this.callUpdateCallback();
	}

	__proto.callStartCallback=function(){
		if (this._onStart !=null){
			if(GTween.catchCallbackExceptions){
				try{
					this._onStart.call(this._onStartCaller,this);
				}
				catch(err){
					console.log("FairyGUI: error in start callback > "+err.message);
				}
			}
			else
			this._onStart.call(this._onStartCaller,this);
		}
	}

	__proto.callUpdateCallback=function(){
		if (this._onUpdate !=null){
			if(GTween.catchCallbackExceptions){
				try{
					this._onUpdate.call(this._onUpdateCaller,this);
				}
				catch(err){
					console.log("FairyGUI: error in update callback > "+err.message);
				}
			}
			else
			this._onUpdate.call(this._onUpdateCaller,this);
		}
	}

	__proto.callCompleteCallback=function(){
		if (this._onComplete !=null){
			if(GTween.catchCallbackExceptions){
				try{
					this._onComplete.call(this._onCompleteCaller,this);
				}
				catch(err){
					console.log("FairyGUI: error in complete callback > "+err.message);
				}
			}
			else
			this._onComplete.call(this._onCompleteCaller,this);
		}
	}

	__getset(0,__proto,'target',function(){
		return this._target;
	});

	__getset(0,__proto,'delay',function(){
		return this._delay;
	});

	__getset(0,__proto,'duration',function(){
		return this._duration;
	});

	__getset(0,__proto,'value',function(){
		return this._value;
	});

	__getset(0,__proto,'userData',function(){
		return this._userData;
	});

	__getset(0,__proto,'repeat',function(){
		return this._repeat;
	});

	__getset(0,__proto,'startValue',function(){
		return this._startValue;
	});

	__getset(0,__proto,'endValue',function(){
		return this._endValue;
	});

	__getset(0,__proto,'deltaValue',function(){
		return this._deltaValue;
	});

	__getset(0,__proto,'normalizedTime',function(){
		return this._normalizedTime;
	});

	__getset(0,__proto,'completed',function(){
		return this._ended !=0;
	});

	__getset(0,__proto,'allCompleted',function(){
		return this._ended==1;
	});

	return GTweener;
})()



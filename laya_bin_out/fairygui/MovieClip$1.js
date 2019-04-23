//class fairygui.display.MovieClip extends fairygui.display.Image
var MovieClip$1=(function(_super){
	function MovieClip(){
		this.interval=0;
		this.swing=false;
		this.repeatDelay=0;
		this.timeScale=1;
		this._playing=true;
		this._frameCount=0;
		this._frames=null;
		this._frame=0;
		this._start=0;
		this._end=0;
		this._times=0;
		this._endAt=0;
		this._status=0;
		//0-none,1-next loop,2-ending,3-ended
		this._endHandler=null;
		this._frameElapsed=0;
		//当前帧延迟
		this._reversed=false;
		this._repeatedCount=0;
		MovieClip.__super.call(this);
		this.mouseEnabled=false;
		this.setPlaySettings();
		this.on("display",this,this.__addToStage);
		this.on("undisplay",this,this.__removeFromStage);
	}

	__class(MovieClip,'fairygui.display.MovieClip',_super,'MovieClip$1');
	var __proto=MovieClip.prototype;
	//从start帧开始，播放到end帧（-1表示结尾），重复times次（0表示无限循环），循环结束后，停止在endAt帧（-1表示参数end）
	__proto.rewind=function(){
		this._frame=0;
		this._frameElapsed=0;
		this._reversed=false;
		this._repeatedCount=0;
		this.drawFrame();
	}

	__proto.syncStatus=function(anotherMc){
		this._frame=anotherMc._frame;
		this._frameElapsed=anotherMc._frameElapsed;
		this._reversed=anotherMc._reversed;
		this._repeatedCount=anotherMc._repeatedCount;
		this.drawFrame();
	}

	__proto.advance=function(timeInMiniseconds){
		var beginFrame=this._frame;
		var beginReversed=this._reversed;
		var backupTime=timeInMiniseconds;
		while (true){
			var tt=this.interval+this._frames[this._frame].addDelay;
			if (this._frame==0 && this._repeatedCount > 0)
				tt+=this.repeatDelay;
			if (timeInMiniseconds < tt){
				this._frameElapsed=0;
				break ;
			}
			timeInMiniseconds-=tt;
			if (this.swing){
				if (this._reversed){
					this._frame--;
					if (this._frame <=0){
						this._frame=0;
						this._repeatedCount++;
						this._reversed=!this._reversed;
					}
				}
				else{
					this._frame++;
					if (this._frame > this._frameCount-1){
						this._frame=Math.max(0,this._frameCount-2);
						this._repeatedCount++;
						this._reversed=!this._reversed;
					}
				}
			}
			else{
				this._frame++;
				if (this._frame > this._frameCount-1){
					this._frame=0;
					this._repeatedCount++;
				}
			}
			if (this._frame==beginFrame && this._reversed==beginReversed){
				var roundTime=backupTime-timeInMiniseconds;
				timeInMiniseconds-=Math.floor(timeInMiniseconds / roundTime)*roundTime;
			}
		}
		this.drawFrame();
	}

	//从start帧开始，播放到end帧（-1表示结尾），重复times次（0表示无限循环），循环结束后，停止在endAt帧（-1表示参数end）
	__proto.setPlaySettings=function(start,end,times,endAt,endHandler){
		(start===void 0)&& (start=0);
		(end===void 0)&& (end=-1);
		(times===void 0)&& (times=0);
		(endAt===void 0)&& (endAt=-1);
		this._start=start;
		this._end=end;
		if(this._end==-1 || this._end>this._frameCount-1)
			this._end=this._frameCount-1;
		this._times=times;
		this._endAt=endAt;
		if (this._endAt==-1)
			this._endAt=this._end;
		this._status=0;
		this._endHandler=endHandler;
		this.frame=start;
	}

	__proto.update=function(){
		if (!this._playing || this._frameCount==0 || this._status==3)
			return;
		var dt=Laya.timer.delta;
		if(dt>100)
			dt=100;
		if(this.timeScale!=1)
			dt *=this.timeScale;
		this._frameElapsed+=dt;
		var tt=this.interval+this._frames[this._frame].addDelay;
		if (this._frame==0 && this._repeatedCount > 0)
			tt+=this.repeatDelay;
		if (this._frameElapsed < tt)
			return;
		this._frameElapsed-=tt;
		if (this._frameElapsed > this.interval)
			this._frameElapsed=this.interval;
		if (this.swing){
			if (this._reversed){
				this._frame--;
				if (this._frame <=0){
					this._frame=0;
					this._repeatedCount++;
					this._reversed=!this._reversed;
				}
			}
			else{
				this._frame++;
				if (this._frame > this._frameCount-1){
					this._frame=Math.max(0,this._frameCount-2);
					this._repeatedCount++;
					this._reversed=!this._reversed;
				}
			}
		}
		else{
			this._frame++;
			if (this._frame > this._frameCount-1){
				this._frame=0;
				this._repeatedCount++;
			}
		}
		if (this._status==1){
			this._frame=this._start;
			this._frameElapsed=0;
			this._status=0;
		}
		else if (this._status==2){
			this._frame=this._endAt;
			this._frameElapsed=0;
			this._status=3;
			if(this._endHandler!=null){
				var handler=this._endHandler;
				this._endHandler=null;
				handler.run();
			}
		}
		else{
			if (this._frame==this._end){
				if (this._times > 0){
					this._times--;
					if (this._times==0)
						this._status=2;
					else
					this._status=1;
				}
				else if (this._start !=0)
				this._status=1;
			}
		}
		this.drawFrame();
	}

	__proto.drawFrame=function(){
		if (this._frameCount>0 && this._frame < this._frames.length){
			var frame=this._frames[this._frame];
			this.texture=frame.texture;
		}
		else
		this.texture=null;
		this.rebuild();
	}

	__proto.checkTimer=function(){
		if (this._playing && this._frameCount>0 && this.stage!=null)
			Laya.timer.frameLoop(1,this,this.update);
		else
		Laya.timer.clear(this,this.update);
	}

	__proto.__addToStage=function(){
		if(this._playing && this._frameCount>0)
			Laya.timer.frameLoop(1,this,this.update);
	}

	__proto.__removeFromStage=function(){
		Laya.timer.clear(this,this.update);
	}

	__getset(0,__proto,'frames',function(){
		return this._frames;
		},function(value){
		this._frames=value;
		this._scaleByTile=false;
		this._scale9Grid=null;
		if (this._frames !=null){
			this._frameCount=this._frames.length;
			if(this._end==-1 || this._end > this._frameCount-1)
				this._end=this._frameCount-1;
			if(this._endAt==-1 || this._endAt > this._frameCount-1)
				this._endAt=this._frameCount-1;
			if(this._frame < 0 || this._frame > this._frameCount-1)
				this._frame=this._frameCount-1;
			this._frameElapsed=0;
			this._repeatedCount=0;
			this._reversed=false;
		}
		else
		this._frameCount=0;
		this.drawFrame();
		this.checkTimer();
	});

	__getset(0,__proto,'playing',function(){
		return this._playing;
		},function(value){
		if(this._playing!=value){
			this._playing=value;
			this.checkTimer();
		}
	});

	__getset(0,__proto,'frameCount',function(){
		return this._frameCount;
	});

	__getset(0,__proto,'frame',function(){
		return this._frame;
		},function(value){
		if (this._frame !=value){
			if(this._frames!=null && value>=this._frameCount)
				value=this._frameCount-1;
			this._frame=value;
			this._frameElapsed=0;
			this.drawFrame();
		}
	});

	return MovieClip;
})(Image$1)


	Laya.__init([GBasicTextField,GList,AsyncOperation,GearLook,UIPackage,GearColor,Transition,EaseManager,GearAnimation,GearSize,RelationItem]);
})(window,document,Laya);

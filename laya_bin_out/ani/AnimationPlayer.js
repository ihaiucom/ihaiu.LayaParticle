//class laya.ani.AnimationPlayer extends laya.events.EventDispatcher
var AnimationPlayer=(function(_super){
	function AnimationPlayer(){
		/**@private */
		this._destroyed=false;
		/**数据模板*/
		this._templet=null;
		/**当前精确时间，不包括重播时间*/
		this._currentTime=NaN;
		/**当前帧时间，不包括重播时间*/
		this._currentFrameTime=NaN;
		/**动画播放的起始时间位置*/
		this._playStart=NaN;
		/**动画播放的结束时间位置*/
		this._playEnd=NaN;
		/**动画播放一次的总时间*/
		this._playDuration=NaN;
		/**动画播放总时间*/
		this._overallDuration=NaN;
		/**是否在一帧结束时停止*/
		this._stopWhenCircleFinish=false;
		/**已播放时间，包括重播时间*/
		this._elapsedPlaybackTime=NaN;
		/**播放时帧数*/
		this._startUpdateLoopCount=NaN;
		/**当前动画索引*/
		this._currentAnimationClipIndex=0;
		/**当前帧数*/
		this._currentKeyframeIndex=0;
		/**是否暂停*/
		this._paused=false;
		/**默认帧率,必须大于0*/
		this._cacheFrameRate=0;
		/**帧率间隔时间*/
		this._cacheFrameRateInterval=NaN;
		/**缓存播放速率*/
		this._cachePlayRate=NaN;
		this._fullFrames=null;
		/**是否缓存*/
		this.isCache=true;
		/**播放速率*/
		this.playbackRate=1.0;
		/**停止时是否归零*/
		this.returnToZeroStopped=false;
		AnimationPlayer.__super.call(this);
		this._destroyed=false;
		this._currentAnimationClipIndex=-1;
		this._currentKeyframeIndex=-1;
		this._currentTime=0.0;
		this._overallDuration=Number.MAX_VALUE;
		this._stopWhenCircleFinish=false;
		this._elapsedPlaybackTime=0;
		this._startUpdateLoopCount=-1;
		this._cachePlayRate=1.0;
		this.cacheFrameRate=60;
		this.returnToZeroStopped=false;
	}

	__class(AnimationPlayer,'laya.ani.AnimationPlayer',_super);
	var __proto=AnimationPlayer.prototype;
	Laya.imps(__proto,{"laya.resource.IDestroy":true})
	/**
	*@private
	*/
	__proto._onTempletLoadedComputeFullKeyframeIndices=function(cachePlayRate,cacheFrameRate,templet){
		if (this._templet===templet && this._cachePlayRate===cachePlayRate && this._cacheFrameRate===cacheFrameRate)
			this._computeFullKeyframeIndices();
	}

	/**
	*@private
	*/
	__proto._computeFullKeyframeIndices=function(){
		var anifullFrames=this._fullFrames=[];
		var templet=this._templet;
		var cacheFrameInterval=this._cacheFrameRateInterval *this._cachePlayRate;
		for (var i=0,iNum=templet.getAnimationCount();i < iNum;i++){
			var aniFullFrame=[];
			if (!templet.getAnimation(i).nodes){
				anifullFrames.push(aniFullFrame);
				continue ;
			}
			for (var j=0,jNum=templet.getAnimation(i).nodes.length;j < jNum;j++){
				var node=templet.getAnimation(i).nodes[j];
				var frameCount=Math.floor(node.playTime / cacheFrameInterval+0.01);
				var nodeFullFrames=new Uint16Array(frameCount+1);
				var lastFrameIndex=-1;
				for (var n=0,nNum=node.keyFrame.length;n < nNum;n++){
					var keyFrame=node.keyFrame[n];
					var tm=keyFrame.startTime;
					var endTm=tm+keyFrame.duration+cacheFrameInterval;
					do {
						var frameIndex=Math.floor(tm / cacheFrameInterval+0.5);
						for (var k=lastFrameIndex+1;k < frameIndex;k++)
						nodeFullFrames[k]=n;
						lastFrameIndex=frameIndex;
						nodeFullFrames[frameIndex]=n;
						tm+=cacheFrameInterval;
					}while (tm <=endTm);
				}
				aniFullFrame.push(nodeFullFrames);
			}
			anifullFrames.push(aniFullFrame);
		}
	}

	/**
	*@private
	*/
	__proto._onAnimationTempletLoaded=function(){
		(this.destroyed)|| (this._calculatePlayDuration());
	}

	/**
	*@private
	*/
	__proto._calculatePlayDuration=function(){
		if (this.state!==/*laya.ani.AnimationState.stopped*/0){
			var oriDuration=this._templet.getAniDuration(this._currentAnimationClipIndex);
			(this._playEnd===0)&& (this._playEnd=oriDuration);
			if (this._playEnd > oriDuration)
				this._playEnd=oriDuration;
			this._playDuration=this._playEnd-this._playStart;
		}
	}

	/**
	*@private
	*/
	__proto._setPlayParams=function(time,cacheFrameInterval){
		this._currentTime=time;
		this._currentKeyframeIndex=Math.floor((this.currentPlayTime)/ cacheFrameInterval+0.01);
		this._currentFrameTime=this._currentKeyframeIndex *cacheFrameInterval;
	}

	/**
	*@private
	*/
	__proto._setPlayParamsWhenStop=function(currentAniClipPlayDuration,cacheFrameInterval){
		this._currentTime=currentAniClipPlayDuration;
		this._currentKeyframeIndex=Math.floor(currentAniClipPlayDuration / cacheFrameInterval+0.01);
		this._currentFrameTime=this._currentKeyframeIndex *cacheFrameInterval;
		this._currentAnimationClipIndex=-1;
	}

	/**
	*@private
	*/
	__proto._update=function(elapsedTime){
		if (this._currentAnimationClipIndex===-1 || this._paused || !this._templet)
			return;
		var cacheFrameInterval=this._cacheFrameRateInterval *this._cachePlayRate;
		var time=0;
		(this._startUpdateLoopCount!==Stat.loopCount)&& (time=elapsedTime *this.playbackRate,this._elapsedPlaybackTime+=time);
		var currentAniClipPlayDuration=this.playDuration;
		if ((this._overallDuration!==0 && this._elapsedPlaybackTime >=this._overallDuration)|| (this._overallDuration===0 && this._elapsedPlaybackTime >=currentAniClipPlayDuration)){
			this._setPlayParamsWhenStop(currentAniClipPlayDuration,cacheFrameInterval);
			this.event(/*laya.events.Event.STOPPED*/"stopped");
			return;
		}
		time+=this._currentTime;
		if (currentAniClipPlayDuration > 0){
			if (time >=currentAniClipPlayDuration){
				do {
					time-=currentAniClipPlayDuration;
					if (this._stopWhenCircleFinish){
						this._setPlayParamsWhenStop(currentAniClipPlayDuration,cacheFrameInterval);
						this._stopWhenCircleFinish=false;
						this.event(/*laya.events.Event.STOPPED*/"stopped");
						return;
					}
					if (time < currentAniClipPlayDuration){
						this._setPlayParams(time,cacheFrameInterval);
						this.event(/*laya.events.Event.COMPLETE*/"complete");
					}
				}while (time >=currentAniClipPlayDuration)
				}else {
				this._setPlayParams(time,cacheFrameInterval);
			}
			}else {
			if (this._stopWhenCircleFinish){
				this._setPlayParamsWhenStop(currentAniClipPlayDuration,cacheFrameInterval);
				this._stopWhenCircleFinish=false;
				this.event(/*laya.events.Event.STOPPED*/"stopped");
				return;
			}
			this._currentTime=this._currentFrameTime=this._currentKeyframeIndex=0;
			this.event(/*laya.events.Event.COMPLETE*/"complete");
		}
	}

	/**
	*@private
	*/
	__proto._destroy=function(){
		this.offAll();
		this._templet=null;
		this._fullFrames=null;
		this._destroyed=true;
	}

	/**
	*播放动画。
	*@param index 动画索引。
	*@param playbackRate 播放速率。
	*@param duration 播放时长（0为1次,Number.MAX_VALUE为循环播放）。
	*@param playStart 播放的起始时间位置。
	*@param playEnd 播放的结束时间位置。（0为动画一次循环的最长结束时间位置）。
	*/
	__proto.play=function(index,playbackRate,overallDuration,playStart,playEnd){
		(index===void 0)&& (index=0);
		(playbackRate===void 0)&& (playbackRate=1.0);
		(overallDuration===void 0)&& (overallDuration=2147483647);
		(playStart===void 0)&& (playStart=0);
		(playEnd===void 0)&& (playEnd=0);
		if (!this._templet)
			throw new Error("AnimationPlayer:templet must not be null,maybe you need to set url.");
		if (overallDuration < 0 || playStart < 0 || playEnd < 0)
			throw new Error("AnimationPlayer:overallDuration,playStart and playEnd must large than zero.");
		if ((playEnd!==0)&& (playStart > playEnd))
			throw new Error("AnimationPlayer:start must less than end.");
		this._currentTime=0;
		this._currentFrameTime=0;
		this._elapsedPlaybackTime=0;
		this.playbackRate=playbackRate;
		this._overallDuration=overallDuration;
		this._playStart=playStart;
		this._playEnd=playEnd;
		this._paused=false;
		this._currentAnimationClipIndex=index;
		this._currentKeyframeIndex=0;
		this._startUpdateLoopCount=Stat.loopCount;
		this.event(/*laya.events.Event.PLAYED*/"played");
		this._calculatePlayDuration();
		this._update(0);
	}

	/**
	*播放动画。
	*@param index 动画索引。
	*@param playbackRate 播放速率。
	*@param duration 播放时长（0为1次,Number.MAX_VALUE为循环播放）。
	*@param playStartFrame 播放的原始起始帧率位置。
	*@param playEndFrame 播放的原始结束帧率位置。（0为动画一次循环的最长结束时间位置）。
	*/
	__proto.playByFrame=function(index,playbackRate,overallDuration,playStartFrame,playEndFrame,fpsIn3DBuilder){
		(index===void 0)&& (index=0);
		(playbackRate===void 0)&& (playbackRate=1.0);
		(overallDuration===void 0)&& (overallDuration=2147483647);
		(playStartFrame===void 0)&& (playStartFrame=0);
		(playEndFrame===void 0)&& (playEndFrame=0);
		(fpsIn3DBuilder===void 0)&& (fpsIn3DBuilder=30);
		var interval=1000.0 / fpsIn3DBuilder;
		this.play(index,playbackRate,overallDuration,playStartFrame *interval,playEndFrame *interval);
	}

	/**
	*停止播放当前动画
	*@param immediate 是否立即停止
	*/
	__proto.stop=function(immediate){
		(immediate===void 0)&& (immediate=true);
		if (immediate){
			this._currentTime=this._currentFrameTime=this._currentKeyframeIndex=0;
			this._currentAnimationClipIndex=-1;
			this.event(/*laya.events.Event.STOPPED*/"stopped");
			}else {
			this._stopWhenCircleFinish=true;
		}
	}

	/**
	*@private
	*/
	__proto.destroy=function(){}
	/**
	*动画播放的结束时间位置。
	*@return 结束时间位置。
	*/
	__getset(0,__proto,'playEnd',function(){
		return this._playEnd;
	});

	/**
	*设置动画数据模板,注意：修改此值会有计算开销。
	*@param value 动画数据模板
	*/
	/**
	*获取动画数据模板
	*@param value 动画数据模板
	*/
	__getset(0,__proto,'templet',function(){
		return this._templet;
		},function(value){
		if (!this.state===/*laya.ani.AnimationState.stopped*/0)
			this.stop(true);
		if (this._templet!==value){
			this._templet=value;
			this._computeFullKeyframeIndices();
		}
	});

	/**
	*动画播放的起始时间位置。
	*@return 起始时间位置。
	*/
	__getset(0,__proto,'playStart',function(){
		return this._playStart;
	});

	/**
	*获取动画播放一次的总时间
	*@return 动画播放一次的总时间
	*/
	__getset(0,__proto,'playDuration',function(){
		return this._playDuration;
	});

	/**
	*获取当前播放状态
	*@return 当前播放状态
	*/
	__getset(0,__proto,'state',function(){
		if (this._currentAnimationClipIndex===-1)
			return /*laya.ani.AnimationState.stopped*/0;
		if (this._paused)
			return /*laya.ani.AnimationState.paused*/1;
		return /*laya.ani.AnimationState.playing*/2;
	});

	/**
	*获取当前帧数
	*@return 当前帧数
	*/
	__getset(0,__proto,'currentKeyframeIndex',function(){
		return this._currentKeyframeIndex;
	});

	/**
	*获取动画播放的总总时间
	*@return 动画播放的总时间
	*/
	__getset(0,__proto,'overallDuration',function(){
		return this._overallDuration;
	});

	/**
	*获取当前帧时间，不包括重播时间
	*@return value 当前时间
	*/
	__getset(0,__proto,'currentFrameTime',function(){
		return this._currentFrameTime;
	});

	/**
	*获取当前动画索引
	*@return value 当前动画索引
	*/
	__getset(0,__proto,'currentAnimationClipIndex',function(){
		return this._currentAnimationClipIndex;
	});

	/**
	*获取当前精确时间，不包括重播时间
	*@return value 当前时间
	*/
	__getset(0,__proto,'currentPlayTime',function(){
		return this._currentTime+this._playStart;
	});

	/**
	*设置缓存播放速率,默认值为1.0,注意：修改此值会有计算开销。*
	*@return value 缓存播放速率。
	*/
	/**
	*获取缓存播放速率。*
	*@return 缓存播放速率。
	*/
	__getset(0,__proto,'cachePlayRate',function(){
		return this._cachePlayRate;
		},function(value){
		if (this._cachePlayRate!==value){
			this._cachePlayRate=value;
			if (this._templet)
				this._computeFullKeyframeIndices();
		}
	});

	/**
	*设置默认帧率,每秒60帧,注意：修改此值会有计算开销。*
	*@return value 缓存帧率
	*/
	/**
	*获取默认帧率*
	*@return value 默认帧率
	*/
	__getset(0,__proto,'cacheFrameRate',function(){
		return this._cacheFrameRate;
		},function(value){
		if (this._cacheFrameRate!==value){
			this._cacheFrameRate=value;
			this._cacheFrameRateInterval=1000.0 / this._cacheFrameRate;
			if (this._templet)
				this._computeFullKeyframeIndices();
		}
	});

	/**
	*设置当前播放位置
	*@param value 当前时间
	*/
	__getset(0,__proto,'currentTime',null,function(value){
		if (this._currentAnimationClipIndex===-1 || !this._templet)
			return;
		if (value < this._playStart || value > this._playEnd)
			throw new Error("AnimationPlayer:value must large than playStartTime,small than playEndTime.");
		this._startUpdateLoopCount=Stat.loopCount;
		var cacheFrameInterval=this._cacheFrameRateInterval *this._cachePlayRate;
		this._currentTime=value;
		this._currentKeyframeIndex=Math.floor(this.currentPlayTime / cacheFrameInterval);
		this._currentFrameTime=this._currentKeyframeIndex *cacheFrameInterval;
	});

	/**
	*设置是否暂停
	*@param value 是否暂停
	*/
	/**
	*获取当前是否暂停
	*@return 是否暂停
	*/
	__getset(0,__proto,'paused',function(){
		return this._paused;
		},function(value){
		this._paused=value;
		value && this.event(/*laya.events.Event.PAUSED*/"paused");
	});

	/**
	*获取缓存帧率间隔时间
	*@return 缓存帧率间隔时间
	*/
	__getset(0,__proto,'cacheFrameRateInterval',function(){
		return this._cacheFrameRateInterval;
	});

	/**
	*获取是否已销毁。
	*@return 是否已销毁。
	*/
	__getset(0,__proto,'destroyed',function(){
		return this._destroyed;
	});

	return AnimationPlayer;
})(EventDispatcher)


/**
*@private
*/

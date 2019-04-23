//class laya.device.media.Video extends laya.display.Sprite
var Video=(function(_super){
	function Video(width,height){
		this.htmlVideo=null;
		this.videoElement=null;
		this.internalTexture=null;
		(width===void 0)&& (width=320);
		(height===void 0)&& (height=240);
		Video.__super.call(this);
		if (Render.isConchApp || Render.isWebGL){
			this.htmlVideo=new WebGLVideo();
		}
		else{
			this.htmlVideo=new HtmlVideo();
		}
		this.videoElement=this.htmlVideo.getVideo();
		this.videoElement.layaTarget=this;
		this.internalTexture=new Texture(this.htmlVideo);
		this.videoElement.addEventListener("abort",Video.onAbort);
		this.videoElement.addEventListener("canplay",Video.onCanplay);
		this.videoElement.addEventListener("canplaythrough",Video.onCanplaythrough);
		this.videoElement.addEventListener("durationchange",Video.onDurationchange);
		this.videoElement.addEventListener("emptied",Video.onEmptied);
		this.videoElement.addEventListener("error",Video.onError);
		this.videoElement.addEventListener("loadeddata",Video.onLoadeddata);
		this.videoElement.addEventListener("loadedmetadata",Video.onLoadedmetadata);
		this.videoElement.addEventListener("loadstart",Video.onLoadstart);
		this.videoElement.addEventListener("pause",Video.onPause);
		this.videoElement.addEventListener("play",Video.onPlay);
		this.videoElement.addEventListener("playing",Video.onPlaying);
		this.videoElement.addEventListener("progress",Video.onProgress);
		this.videoElement.addEventListener("ratechange",Video.onRatechange);
		this.videoElement.addEventListener("seeked",Video.onSeeked);
		this.videoElement.addEventListener("seeking",Video.onSeeking);
		this.videoElement.addEventListener("stalled",Video.onStalled);
		this.videoElement.addEventListener("suspend",Video.onSuspend);
		this.videoElement.addEventListener("timeupdate",Video.onTimeupdate);
		this.videoElement.addEventListener("volumechange",Video.onVolumechange);
		this.videoElement.addEventListener("waiting",Video.onWaiting);
		this.videoElement.addEventListener("ended",this.onPlayComplete['bind'](this));
		this.size(width,height);
		if (Browser.onMobile){
			/*__JS__ */this.onDocumentClick=this.onDocumentClick.bind(this);
			Browser.document.addEventListener("touchend",this.onDocumentClick);
		}
	}

	__class(Video,'laya.device.media.Video',_super);
	var __proto=Video.prototype;
	__proto.onPlayComplete=function(e){
		this.event("ended");
		if(!Render.isConchApp || !this.videoElement.loop)
			Laya.timer.clear(this,this.renderCanvas);
	}

	/**
	*设置播放源。
	*@param url 播放源路径。
	*/
	__proto.load=function(url){
		if (url.indexOf("blob:")==0)
			this.videoElement.src=url;
		else
		this.htmlVideo.setSource(url,laya.device.media.Video.MP4);
	}

	/**
	*开始播放视频。
	*/
	__proto.play=function(){
		this.videoElement.play();
		Laya.timer.frameLoop(1,this,this.renderCanvas);
	}

	/**
	*暂停视频播放。
	*/
	__proto.pause=function(){
		this.videoElement.pause();
		Laya.timer.clear(this,this.renderCanvas);
	}

	/**
	*重新加载视频。
	*/
	__proto.reload=function(){
		this.videoElement.load();
	}

	/**
	*检测是否支持播放指定格式视频。
	*@param type 参数为Video.MP4 / Video.OGG / Video.WEBM之一。
	*@return 表示支持的级别。可能的值：
	*<ul>
	*<li>"probably"，Video.SUPPORT_PROBABLY-浏览器最可能支持该音频/视频类型</li>
	*<li>"maybe"，Video.SUPPORT_MAYBY-浏览器也许支持该音频/视频类型</li>
	*<li>""，Video.SUPPORT_NO-（空字符串）浏览器不支持该音频/视频类型</li>
	*</ul>
	*/
	__proto.canPlayType=function(type){
		var typeString;
		switch (type){
			case laya.device.media.Video.MP4:
				typeString="video/mp4";
				break ;
			case laya.device.media.Video.OGG:
				typeString="video/ogg";
				break ;
			case laya.device.media.Video.WEBM:
				typeString="video/webm";
				break ;
			}
		return this.videoElement.canPlayType(typeString);
	}

	__proto.renderCanvas=function(){
		if (this.readyState===0)
			return;
		if (Render.isConchApp || Render.isWebGL)
			this.htmlVideo['updateTexture']();
		this.graphics.clear();
		this.graphics.drawTexture(this.internalTexture,0,0,this.width,this.height);
	}

	__proto.onDocumentClick=function(){
		this.videoElement.play();
		this.videoElement.pause();
		Browser.document.removeEventListener("touchend",this.onDocumentClick);
	}

	__proto.size=function(width,height){
		_super.prototype.size.call(this,width,height)
		if (Render.isConchApp){
			var transform=Utils.getTransformRelativeToWindow(this,0,0);
			this.videoElement.width=width *transform.scaleX;
		}
		else{
			this.videoElement.width=width / Browser.pixelRatio;
		}
		if (this.paused)this.renderCanvas();
		return this;
	}

	/**
	*销毁内部事件绑定。
	*/
	__proto.destroy=function(detroyChildren){
		(detroyChildren===void 0)&& (detroyChildren=true);
		_super.prototype.destroy.call(this,detroyChildren);
		this.videoElement.removeEventListener("abort",Video.onAbort);
		this.videoElement.removeEventListener("canplay",Video.onCanplay);
		this.videoElement.removeEventListener("canplaythrough",Video.onCanplaythrough);
		this.videoElement.removeEventListener("durationchange",Video.onDurationchange);
		this.videoElement.removeEventListener("emptied",Video.onEmptied);
		this.videoElement.removeEventListener("error",Video.onError);
		this.videoElement.removeEventListener("loadeddata",Video.onLoadeddata);
		this.videoElement.removeEventListener("loadedmetadata",Video.onLoadedmetadata);
		this.videoElement.removeEventListener("loadstart",Video.onLoadstart);
		this.videoElement.removeEventListener("pause",Video.onPause);
		this.videoElement.removeEventListener("play",Video.onPlay);
		this.videoElement.removeEventListener("playing",Video.onPlaying);
		this.videoElement.removeEventListener("progress",Video.onProgress);
		this.videoElement.removeEventListener("ratechange",Video.onRatechange);
		this.videoElement.removeEventListener("seeked",Video.onSeeked);
		this.videoElement.removeEventListener("seeking",Video.onSeeking);
		this.videoElement.removeEventListener("stalled",Video.onStalled);
		this.videoElement.removeEventListener("suspend",Video.onSuspend);
		this.videoElement.removeEventListener("timeupdate",Video.onTimeupdate);
		this.videoElement.removeEventListener("volumechange",Video.onVolumechange);
		this.videoElement.removeEventListener("waiting",Video.onWaiting);
		this.videoElement.removeEventListener("ended",this.onPlayComplete);
		this.pause();
		this.videoElement.layaTarget=null
		this.videoElement=null;
		this.htmlVideo.destroy();
	}

	__proto.syncVideoPosition=function(){
		var stage=Laya.stage;
		var rec;
		rec=Utils.getGlobalPosAndScale(this);
		var a=stage._canvasTransform.a,d=stage._canvasTransform.d;
		var x=rec.x *stage.clientScaleX *a+stage.offset.x;
		var y=rec.y *stage.clientScaleY *d+stage.offset.y;
		this.videoElement.style.left=x+'px';;
		this.videoElement.style.top=y+'px';
		this.videoElement.width=this.width / Browser.pixelRatio;
		this.videoElement.height=this.height / Browser.pixelRatio;
	}

	/**
	*buffered 属性返回 TimeRanges(JS)对象。TimeRanges 对象表示用户的音视频缓冲范围。缓冲范围指的是已缓冲音视频的时间范围。如果用户在音视频中跳跃播放，会得到多个缓冲范围。
	*<p>buffered.length返回缓冲范围个数。如获取第一个缓冲范围则是buffered.start(0)和buffered.end(0)。以秒计。</p>
	*@return TimeRanges(JS)对象
	*/
	__getset(0,__proto,'buffered',function(){
		return this.videoElement.buffered;
	});

	/**
	*获取视频源尺寸。ready事件触发后可用。
	*/
	__getset(0,__proto,'videoWidth',function(){
		return this.videoElement.videoWidth;
	});

	/**
	*获取当前播放源路径。
	*/
	__getset(0,__proto,'currentSrc',function(){
		return this.videoElement.currentSrc;
	});

	/**
	*设置和获取当前播放头位置。
	*/
	__getset(0,__proto,'currentTime',function(){
		return this.videoElement.currentTime;
		},function(value){
		this.videoElement.currentTime=value;
		this.renderCanvas();
	});

	/**
	*返回音频/视频的播放是否已结束
	*/
	__getset(0,__proto,'ended',function(){
		return this.videoElement.ended;
	});

	/**
	*设置和获取当前音量。
	*/
	__getset(0,__proto,'volume',function(){
		return this.videoElement.volume;
		},function(value){
		this.videoElement.volume=value;
	});

	__getset(0,__proto,'videoHeight',function(){
		return this.videoElement.videoHeight;
	});

	/**
	*表示视频元素的就绪状态：
	*<ul>
	*<li>0=HAVE_NOTHING-没有关于音频/视频是否就绪的信息</li>
	*<li>1=HAVE_METADATA-关于音频/视频就绪的元数据</li>
	*<li>2=HAVE_CURRENT_DATA-关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒</li>
	*<li>3=HAVE_FUTURE_DATA-当前及至少下一帧的数据是可用的</li>
	*<li>4=HAVE_ENOUGH_DATA-可用数据足以开始播放</li>
	*</ul>
	*/
	__getset(0,__proto,'readyState',function(){
		return this.videoElement.readyState;
	});

	/**
	*获取视频长度（秒）。ready事件触发后可用。
	*/
	__getset(0,__proto,'duration',function(){
		return this.videoElement.duration;
	});

	/**
	*返回表示音频/视频错误状态的 MediaError（JS）对象。
	*/
	__getset(0,__proto,'error',function(){
		return this.videoElement.error;
	});

	/**
	*设置或返回音频/视频是否应在结束时重新播放。
	*/
	__getset(0,__proto,'loop',function(){
		return this.videoElement.loop;
		},function(value){
		this.videoElement.loop=value;
	});

	/**
	*设置视频的x坐标
	*/
	__getset(0,__proto,'x',_super.prototype._$get_x,function(val){
		Laya.superSet(Sprite,this,'x',val);
		if (Render.isConchApp){
			var transform=Utils.getTransformRelativeToWindow(this,0,0);
			this.videoElement.style.left=transform.x;
		}
	});

	/**
	*设置视频的y坐标
	*/
	__getset(0,__proto,'y',_super.prototype._$get_y,function(val){
		Laya.superSet(Sprite,this,'y',val);
		if (Render.isConchApp){
			var transform=Utils.getTransformRelativeToWindow(this,0,0);
			this.videoElement.style.top=transform.y;
		}
	});

	/**
	*playbackRate 属性设置或返回音频/视频的当前播放速度。如：
	*<ul>
	*<li>1.0 正常速度</li>
	*<li>0.5 半速（更慢）</li>
	*<li>2.0 倍速（更快）</li>
	*<li>-1.0 向后，正常速度</li>
	*<li>-0.5 向后，半速</li>
	*</ul>
	*<p>只有 Google Chrome 和 Safari 支持 playbackRate 属性。</p>
	*/
	__getset(0,__proto,'playbackRate',function(){
		return this.videoElement.playbackRate;
		},function(value){
		this.videoElement.playbackRate=value;
	});

	/**
	*获取和设置静音状态。
	*/
	__getset(0,__proto,'muted',function(){
		return this.videoElement.muted;
		},function(value){
		this.videoElement.muted=value;
	});

	/**
	*返回视频是否暂停
	*/
	__getset(0,__proto,'paused',function(){
		return this.videoElement.paused;
	});

	/**
	*preload 属性设置或返回是否在页面加载后立即加载视频。可赋值如下：
	*<ul>
	*<li>auto 指示一旦页面加载，则开始加载视频。</li>
	*<li>metadata 指示当页面加载后仅加载音频/视频的元数据。</li>
	*<li>none 指示页面加载后不应加载音频/视频。</li>
	*</ul>
	*/
	__getset(0,__proto,'preload',function(){
		return this.videoElement.preload;
		},function(value){
		this.videoElement.preload=value;
	});

	/**
	*参见 <i>http://www.w3school.com.cn/tags/av_prop_seekable.asp</i>。
	*/
	__getset(0,__proto,'seekable',function(){
		return this.videoElement.seekable;
	});

	/**
	*seeking 属性返回用户目前是否在音频/视频中寻址。
	*寻址中（Seeking）指的是用户在音频/视频中移动/跳跃到新的位置。
	*/
	__getset(0,__proto,'seeking',function(){
		return this.videoElement.seeking;
	});

	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		if (Render.isConchApp){
			var transform=Utils.getTransformRelativeToWindow(this,0,0);
			this.videoElement.width=value *transform.scaleX;
		}
		else{
			this.videoElement.width=this.width / Browser.pixelRatio;
		}
		Laya.superSet(Sprite,this,'width',value);
		if (this.paused)this.renderCanvas();
	});

	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		if (Render.isConchApp){
			var transform=Utils.getTransformRelativeToWindow(this,0,0);
			this.videoElement.height=value *transform.scaleY;
		}
		else{
			this.videoElement.height=this.height / Browser.pixelRatio;
		}
		Laya.superSet(Sprite,this,'height',value);
	});

	Video.onAbort=function(e){e.target.layaTarget.event("abort")}
	Video.onCanplay=function(e){e.target.layaTarget.event("canplay")}
	Video.onCanplaythrough=function(e){e.target.layaTarget.event("canplaythrough")}
	Video.onDurationchange=function(e){e.target.layaTarget.event("durationchange")}
	Video.onEmptied=function(e){e.target.layaTarget.event("emptied")}
	Video.onError=function(e){e.target.layaTarget.event("error")}
	Video.onLoadeddata=function(e){e.target.layaTarget.event("loadeddata")}
	Video.onLoadedmetadata=function(e){e.target.layaTarget.event("loadedmetadata")}
	Video.onLoadstart=function(e){e.target.layaTarget.event("loadstart")}
	Video.onPause=function(e){e.target.layaTarget.event("pause")}
	Video.onPlay=function(e){e.target.layaTarget.event("play")}
	Video.onPlaying=function(e){e.target.layaTarget.event("playing")}
	Video.onProgress=function(e){e.target.layaTarget.event("progress")}
	Video.onRatechange=function(e){e.target.layaTarget.event("ratechange")}
	Video.onSeeked=function(e){e.target.layaTarget.event("seeked")}
	Video.onSeeking=function(e){e.target.layaTarget.event("seeking")}
	Video.onStalled=function(e){e.target.layaTarget.event("stalled")}
	Video.onSuspend=function(e){e.target.layaTarget.event("suspend")}
	Video.onTimeupdate=function(e){e.target.layaTarget.event("timeupdate")}
	Video.onVolumechange=function(e){e.target.layaTarget.event("volumechange")}
	Video.onWaiting=function(e){e.target.layaTarget.event("waiting")}
	Video.MP4=1;
	Video.OGG=2;
	Video.CAMERA=4;
	Video.WEBM=8;
	Video.SUPPORT_PROBABLY="probably";
	Video.SUPPORT_MAYBY="maybe";
	Video.SUPPORT_NO="";
	return Video;
})(Sprite)


/**
*@private
*/

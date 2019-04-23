/**
*<code>SoundManager</code> 是一个声音管理类。提供了对背景音乐、音效的播放控制方法。
*引擎默认有两套声音方案：WebAudio和H5Audio
*播放音效，优先使用WebAudio播放声音，如果WebAudio不可用，则用H5Audio播放，H5Audio在部分机器上有兼容问题（比如不能混音，播放有延迟等）。
*播放背景音乐，则使用H5Audio播放（使用WebAudio会增加特别大的内存，并且要等加载完毕后才能播放，有延迟）
*建议背景音乐用mp3类型，音效用wav或者mp3类型（如果打包为app，音效只能用wav格式）。
*详细教程及声音格式请参考：http://ldc2.layabox.com/doc/?nav=ch-as-1-7-0
*/
//class laya.media.SoundManager
var SoundManager=(function(){
	function SoundManager(){}
	__class(SoundManager,'laya.media.SoundManager');
	__getset(1,SoundManager,'useAudioMusic',function(){
		return SoundManager._useAudioMusic;
		},function(value){
		SoundManager._useAudioMusic=value;
		if (value){
			SoundManager._musicClass=AudioSound;
			}else{
			SoundManager._musicClass=null;
		}
	});

	/**
	*失去焦点后是否自动停止背景音乐。
	*@param v Boolean 失去焦点后是否自动停止背景音乐。
	*
	*/
	/**
	*失去焦点后是否自动停止背景音乐。
	*/
	__getset(1,SoundManager,'autoStopMusic',function(){
		return SoundManager._autoStopMusic;
		},function(v){
		Laya.stage.off(/*laya.events.Event.BLUR*/"blur",null,SoundManager._stageOnBlur);
		Laya.stage.off(/*laya.events.Event.FOCUS*/"focus",null,SoundManager._stageOnFocus);
		Laya.stage.off(/*laya.events.Event.VISIBILITY_CHANGE*/"visibilitychange",null,SoundManager._visibilityChange);
		SoundManager._autoStopMusic=v;
		if (v){
			Laya.stage.on(/*laya.events.Event.BLUR*/"blur",null,SoundManager._stageOnBlur);
			Laya.stage.on(/*laya.events.Event.FOCUS*/"focus",null,SoundManager._stageOnFocus);
			Laya.stage.on(/*laya.events.Event.VISIBILITY_CHANGE*/"visibilitychange",null,SoundManager._visibilityChange);
		}
	});

	/**
	*背景音乐和所有音效是否静音。
	*/
	__getset(1,SoundManager,'muted',function(){
		return SoundManager._muted;
		},function(value){
		if (value==SoundManager._muted)return;
		if (value){
			SoundManager.stopAllSound();
		}
		SoundManager.musicMuted=value;
		SoundManager._muted=value;
	});

	/**
	*背景音乐（不包括音效）是否静音。
	*/
	__getset(1,SoundManager,'musicMuted',function(){
		return SoundManager._musicMuted;
		},function(value){
		if (value==SoundManager._musicMuted)return;
		if (value){
			if (SoundManager._bgMusic){
				if (SoundManager._musicChannel&&!SoundManager._musicChannel.isStopped){
					if (Render.isConchApp){
						/*__JS__ */if (SoundManager._musicChannel._audio)SoundManager._musicChannel._audio.muted=true;;
					}
					else {
						SoundManager._musicChannel.pause();
					}
					}else{
					SoundManager._musicChannel=null;
				}
				}else{
				SoundManager._musicChannel=null;
			}
			SoundManager._musicMuted=value;
			}else {
			SoundManager._musicMuted=value;
			if (SoundManager._bgMusic){
				if (SoundManager._musicChannel){
					if (Render.isConchApp){
						/*__JS__ */if(SoundManager._musicChannel._audio)SoundManager._musicChannel._audio.muted=false;;
					}
					else {
						SoundManager._musicChannel.resume();
					}
				}
			}
		}
	});

	/**
	*所有音效（不包括背景音乐）是否静音。
	*/
	__getset(1,SoundManager,'soundMuted',function(){
		return SoundManager._soundMuted;
		},function(value){
		SoundManager._soundMuted=value;
	});

	SoundManager.__init__=function(){
		var win=Browser.window;
		var supportWebAudio=win["AudioContext"] || win["webkitAudioContext"] || win["mozAudioContext"] ? true :false;
		if (supportWebAudio)WebAudioSound.initWebAudio();
		SoundManager._soundClass=supportWebAudio?WebAudioSound:AudioSound;
		AudioSound._initMusicAudio();
		SoundManager._musicClass=AudioSound;
		return supportWebAudio;
	}

	SoundManager.addChannel=function(channel){
		if (SoundManager._channels.indexOf(channel)>=0)return;
		SoundManager._channels.push(channel);
	}

	SoundManager.removeChannel=function(channel){
		var i=0;
		for (i=SoundManager._channels.length-1;i >=0;i--){
			if (SoundManager._channels[i]==channel){
				SoundManager._channels.splice(i,1);
			}
		}
	}

	SoundManager.disposeSoundLater=function(url){
		SoundManager._lastSoundUsedTimeDic[url]=Browser.now();
		if (!SoundManager._isCheckingDispose){
			SoundManager._isCheckingDispose=true;
			Laya.timer.loop(5000,null,SoundManager._checkDisposeSound);
		}
	}

	SoundManager._checkDisposeSound=function(){
		var key;
		var tTime=Browser.now();
		var hasCheck=false;
		for (key in SoundManager._lastSoundUsedTimeDic){
			if (tTime-SoundManager._lastSoundUsedTimeDic[key]>30000){
				delete SoundManager._lastSoundUsedTimeDic[key];
				SoundManager.disposeSoundIfNotUsed(key);
				}else{
				hasCheck=true;
			}
		}
		if (!hasCheck){
			SoundManager._isCheckingDispose=false;
			Laya.timer.clear(null,SoundManager._checkDisposeSound);
		}
	}

	SoundManager.disposeSoundIfNotUsed=function(url){
		var i=0;
		for (i=SoundManager._channels.length-1;i >=0;i--){
			if (SoundManager._channels[i].url==url){
				return;
			}
		}
		SoundManager.destroySound(url);
	}

	SoundManager._visibilityChange=function(){
		if (Laya.stage.isVisibility){
			SoundManager._stageOnFocus();
			}else {
			SoundManager._stageOnBlur();
		}
	}

	SoundManager._stageOnBlur=function(){
		SoundManager._isActive=false;
		if (SoundManager._musicChannel){
			if (!SoundManager._musicChannel.isStopped){
				SoundManager._blurPaused=true;
				SoundManager._musicChannel.pause();
			}
		}
		SoundManager.stopAllSound();
		Laya.stage.once(/*laya.events.Event.MOUSE_DOWN*/"mousedown",null,SoundManager._stageOnFocus);
	}

	SoundManager._recoverWebAudio=function(){
		if(WebAudioSound.ctx&&WebAudioSound.ctx.state!="running"&&WebAudioSound.ctx.resume)
			WebAudioSound.ctx.resume();
	}

	SoundManager._stageOnFocus=function(){
		SoundManager._isActive=true;
		SoundManager._recoverWebAudio();
		Laya.stage.off(/*laya.events.Event.MOUSE_DOWN*/"mousedown",null,SoundManager._stageOnFocus);
		if (SoundManager._blurPaused){
			if (SoundManager._musicChannel && SoundManager._musicChannel.isStopped){
				SoundManager._blurPaused=false;
				SoundManager._musicChannel.resume();
			}
		}
	}

	SoundManager.playSound=function(url,loops,complete,soundClass,startTime){
		(loops===void 0)&& (loops=1);
		(startTime===void 0)&& (startTime=0);
		if (!SoundManager._isActive || !url)return null;
		if (SoundManager._muted)return null;
		SoundManager._recoverWebAudio();
		url=URL.formatURL(url);
		if (url==SoundManager._bgMusic){
			if (SoundManager._musicMuted)return null;
			}else {
			if (Render.isConchApp){
				var ext=Utils.getFileExtension(url);
				if (ext !="wav" && ext !="ogg"){
					alert("The sound only supports wav or ogg format,for optimal performance reason,please refer to the official website document.");
					return null;
				}
			}
			if (SoundManager._soundMuted)return null;
		};
		var tSound;
		if (!Browser.onMiniGame){
			tSound=Laya.loader.getRes(url);
		}
		if (!soundClass)soundClass=SoundManager._soundClass;
		if (!tSound){
			tSound=new soundClass();
			tSound.load(url);
			if (!Browser.onMiniGame){
				Loader.cacheRes(url,tSound);
			}
		};
		var channel;
		channel=tSound.play(startTime,loops);
		if (!channel)return null;
		channel.url=url;
		channel.volume=(url==SoundManager._bgMusic)? SoundManager.musicVolume :SoundManager.soundVolume;
		channel.completeHandler=complete;
		return channel;
	}

	SoundManager.destroySound=function(url){
		var tSound=Laya.loader.getRes(url);
		if (tSound){
			Loader.clearRes(url);
			tSound.dispose();
		}
	}

	SoundManager.playMusic=function(url,loops,complete,startTime){
		(loops===void 0)&& (loops=0);
		(startTime===void 0)&& (startTime=0);
		url=URL.formatURL(url);
		SoundManager._bgMusic=url;
		if (SoundManager._musicChannel)SoundManager._musicChannel.stop();
		return SoundManager._musicChannel=SoundManager.playSound(url,loops,complete,SoundManager._musicClass,startTime);
	}

	SoundManager.stopSound=function(url){
		url=URL.formatURL(url);
		var i=0;
		var channel;
		for (i=SoundManager._channels.length-1;i >=0;i--){
			channel=SoundManager._channels[i];
			if (channel.url==url){
				channel.stop();
			}
		}
	}

	SoundManager.stopAll=function(){
		SoundManager._bgMusic=null;
		var i=0;
		var channel;
		for (i=SoundManager._channels.length-1;i >=0;i--){
			channel=SoundManager._channels[i];
			channel.stop();
		}
	}

	SoundManager.stopAllSound=function(){
		var i=0;
		var channel;
		for (i=SoundManager._channels.length-1;i >=0;i--){
			channel=SoundManager._channels[i];
			if (channel.url !=SoundManager._bgMusic){
				channel.stop();
			}
		}
	}

	SoundManager.stopMusic=function(){
		if (SoundManager._musicChannel)SoundManager._musicChannel.stop();
		SoundManager._bgMusic=null;
	}

	SoundManager.setSoundVolume=function(volume,url){
		if (url){
			url=URL.formatURL(url);
			SoundManager._setVolume(url,volume);
			}else {
			SoundManager.soundVolume=volume;
			var i=0;
			var channel;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				channel=SoundManager._channels[i];
				if (channel.url !=SoundManager._bgMusic){
					channel.volume=volume;
				}
			}
		}
	}

	SoundManager.setMusicVolume=function(volume){
		SoundManager.musicVolume=volume;
		SoundManager._setVolume(SoundManager._bgMusic,volume);
	}

	SoundManager._setVolume=function(url,volume){
		url=URL.formatURL(url);
		var i=0;
		var channel;
		for (i=SoundManager._channels.length-1;i >=0;i--){
			channel=SoundManager._channels[i];
			if (channel.url==url){
				channel.volume=volume;
			}
		}
	}

	SoundManager.musicVolume=1;
	SoundManager.soundVolume=1;
	SoundManager.playbackRate=1;
	SoundManager._useAudioMusic=true;
	SoundManager._muted=false;
	SoundManager._soundMuted=false;
	SoundManager._musicMuted=false;
	SoundManager._bgMusic=null;
	SoundManager._musicChannel=null;
	SoundManager._channels=[];
	SoundManager._autoStopMusic=false;
	SoundManager._blurPaused=false;
	SoundManager._isActive=true;
	SoundManager._soundClass=null;
	SoundManager._musicClass=null;
	SoundManager._lastSoundUsedTimeDic={};
	SoundManager._isCheckingDispose=false;
	SoundManager.autoReleaseSound=true;
	return SoundManager;
})()


/**
*<p> <code>Pool</code> 是对象池类，用于对象的存储、重复使用。</p>
*<p>合理使用对象池，可以有效减少对象创建的开销，避免频繁的垃圾回收，从而优化游戏流畅度。</p>
*/
//class laya.utils.Pool
var Pool=(function(){
	function Pool(){}
	__class(Pool,'laya.utils.Pool');
	Pool.getPoolBySign=function(sign){
		return Pool._poolDic[sign] || (Pool._poolDic[sign]=[]);
	}

	Pool.clearBySign=function(sign){
		if (Pool._poolDic[sign])Pool._poolDic[sign].length=0;
	}

	Pool.recover=function(sign,item){
		if (item["__InPool"])return;
		item["__InPool"]=true;
		Pool.getPoolBySign(sign).push(item);
	}

	Pool.recoverByClass=function(instance){
		if (instance){
			var className=instance["__className"] || instance.constructor._$gid;
			if (className)Pool.recover(className,instance);
		}
	}

	Pool._getClassSign=function(cla){
		var className=cla["__className"] || cla["_$gid"];
		if (!className){
			cla["_$gid"]=className=Utils.getGID()+"";
		}
		return className;
	}

	Pool.createByClass=function(cls){
		return Pool.getItemByClass(Pool._getClassSign(cls),cls);
	}

	Pool.getItemByClass=function(sign,cls){
		if (!Pool._poolDic[sign])return new cls();
		var pool=Pool.getPoolBySign(sign);
		if (pool.length){
			var rst=pool.pop();
			rst["__InPool"]=false;
			}else {
			rst=new cls();
		}
		return rst;
	}

	Pool.getItemByCreateFun=function(sign,createFun,caller){
		var pool=Pool.getPoolBySign(sign);
		var rst=pool.length ? pool.pop():createFun.call(caller);
		rst["__InPool"]=false;
		return rst;
	}

	Pool.getItem=function(sign){
		var pool=Pool.getPoolBySign(sign);
		var rst=pool.length ? pool.pop():null;
		if (rst){
			rst["__InPool"]=false;
		}
		return rst;
	}

	Pool.POOLSIGN="__InPool";
	Pool._poolDic={};
	return Pool;
})()


/**
*模板，预制件
*/
//class laya.components.Prefab
var Prefab=(function(){
	function Prefab(){
		/**@private */
		this.json=null;
	}

	__class(Prefab,'laya.components.Prefab');
	var __proto=Prefab.prototype;
	/**
	*通过预制创建实例
	*/
	__proto.create=function(){
		if (this.json)return SceneUtils.createByData(null,this.json);
		return null;
	}

	return Prefab;
})()


/**
*@private
*精灵渲染器
*/
//class laya.renders.RenderSprite
var RenderSprite=(function(){
	function RenderSprite(type,next){
		/**@private */
		//this._next=null;
		/**@private */
		//this._fun=null;
		if (LayaGLQuickRunner.map[type]){
			this._fun=LayaGLQuickRunner.map[type];
			this._next=RenderSprite.NORENDER;
			return;
		}
		this._next=next || RenderSprite.NORENDER;
		switch (type){
			case 0:
				this._fun=this._no;
				return;
			case /*laya.display.SpriteConst.ALPHA*/0x01:
				this._fun=this._alpha;
				return;
			case /*laya.display.SpriteConst.TRANSFORM*/0x02:
				this._fun=this._transform;
				return;
			case /*laya.display.SpriteConst.BLEND*/0x04:
				this._fun=this._blend;
				return;
			case /*laya.display.SpriteConst.CANVAS*/0x08:
				this._fun=this._canvas;
				return;
			case /*laya.display.SpriteConst.MASK*/0x20:
				this._fun=this._mask;
				return;
			case /*laya.display.SpriteConst.CLIP*/0x40:
				this._fun=this._clip;
				return;
			case /*laya.display.SpriteConst.STYLE*/0x80:
				this._fun=this._style;
				return;
			case /*laya.display.SpriteConst.GRAPHICS*/0x200:
				this._fun=this._graphics;
				return;
			case /*laya.display.SpriteConst.CHILDS*/0x2000:
				this._fun=this._children;
				return;
			case /*laya.display.SpriteConst.CUSTOM*/0x800:
				this._fun=this._custom;
				return;
			case /*laya.display.SpriteConst.TEXTURE*/0x100:
				this._fun=this._texture;
				return;
			case /*laya.display.SpriteConst.FILTERS*/0x10:
				this._fun=Filter._filter;
				return;
			case 0x11111:
				this._fun=RenderSprite._initRenderFun;
				return;
			}
		this.onCreate(type);
	}

	__class(RenderSprite,'laya.renders.RenderSprite');
	var __proto=RenderSprite.prototype;
	__proto.onCreate=function(type){}
	__proto._style=function(sprite,context,x,y){
		var style=sprite._style;
		if (style.render !=null)style.render(sprite,context,x,y);
		var next=this._next;
		next._fun.call(next,sprite,context,x,y);
	}

	__proto._no=function(sprite,context,x,y){}
	//TODO:coverage
	__proto._custom=function(sprite,context,x,y){
		sprite.customRender(context,x,y);
		this._next._fun.call(this._next,sprite,context,x-sprite.pivotX,y-sprite.pivotY);
	}

	__proto._clip=function(sprite,context,x,y){
		var next=this._next;
		if (next==RenderSprite.NORENDER)return;
		var r=sprite._style.scrollRect;
		context.save();
		context.clipRect(x,y,r.width,r.height);
		next._fun.call(next,sprite,context,x-r.x,y-r.y);
		context.restore();
	}

	//TODO:coverage
	__proto._blend=function(sprite,context,x,y){
		var style=sprite._style;
		if (style.blendMode){
			context.globalCompositeOperation=style.blendMode;
		};
		var next=this._next;
		next._fun.call(next,sprite,context,x,y);
		context.globalCompositeOperation="source-over";
	}

	//TODO:coverage
	__proto._mask=function(sprite,context,x,y){
		var next=this._next;
		next._fun.call(next,sprite,context,x,y);
		var mask=sprite.mask;
		if (mask){
			context.globalCompositeOperation="destination-in";
			if (mask.numChildren > 0 || !mask.graphics._isOnlyOne()){
				mask.cacheAs="bitmap";
			}
			mask.render(context,x-sprite._style.pivotX,y-sprite._style.pivotY);
		}
		context.globalCompositeOperation="source-over";
	}

	__proto._texture=function(sprite,context,x,y){
		var tex=sprite.texture;
		if(tex._getSource())
			context.drawTexture(tex,x-sprite.pivotX+tex.offsetX,y-sprite.pivotY+tex.offsetY,sprite._width || tex.width,sprite._height || tex.height);
		var next=this._next;
		next._fun.call(next,sprite,context,x,y);
	}

	__proto._graphics=function(sprite,context,x,y){
		sprite._graphics && sprite._graphics._render(sprite,context,x-sprite.pivotX,y-sprite.pivotY);
		var next=this._next;
		next._fun.call(next,sprite,context,x,y);
	}

	//TODO:coverage
	__proto._image=function(sprite,context,x,y){
		var style=sprite._style;
		context.drawTexture2(x,y,style.pivotX,style.pivotY,sprite.transform,sprite._graphics._one);
	}

	//TODO:coverage
	__proto._image2=function(sprite,context,x,y){
		var style=sprite._style;
		context.drawTexture2(x,y,style.pivotX,style.pivotY,sprite.transform,sprite._graphics._one);
	}

	//TODO:coverage
	__proto._alpha=function(sprite,context,x,y){
		var style=sprite._style;
		var alpha;
		if ((alpha=style.alpha)> 0.01 || sprite._needRepaint()){
			var temp=context.globalAlpha;
			context.globalAlpha *=alpha;
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
			context.globalAlpha=temp;
		}
	}

	__proto._transform=function(sprite,context,x,y){
		var transform=sprite.transform,_next=this._next;
		var style=sprite._style;
		if (transform && _next !=RenderSprite.NORENDER){
			context.save();
			context.transform(transform.a,transform.b,transform.c,transform.d,transform.tx+x,transform.ty+y);
			_next._fun.call(_next,sprite,context,0,0);
			context.restore();
		}else
		_next._fun.call(_next,sprite,context,x,y);
	}

	__proto._children=function(sprite,context,x,y){
		var style=sprite._style;
		var childs=sprite._children,n=childs.length,ele;
		x=x-sprite.pivotX;
		y=y-sprite.pivotY;
		var textLastRender=sprite._getBit(/*laya.Const.DRAWCALL_OPTIMIZE*/0x100)&& context.drawCallOptimize(true);
		if (style.viewport){
			var rect=style.viewport;
			var left=rect.x;
			var top=rect.y;
			var right=rect.right;
			var bottom=rect.bottom;
			var _x=NaN,_y=NaN;
			for (i=0;i < n;++i){
				if ((ele=childs [i])._visible && ((_x=ele._x)< right && (_x+ele.width)> left && (_y=ele._y)< bottom && (_y+ele.height)> top)){
					ele.render(context,x,y);
				}
			}
			}else {
			for (var i=0;i < n;++i)
			(ele=(childs [i]))._visible && ele.render(context,x,y);
		}
		textLastRender && context.drawCallOptimize(false);
	}

	__proto._canvas=function(sprite,context,x,y){
		var _cacheStyle=sprite._cacheStyle;
		var _next=this._next;
		if (!_cacheStyle.enableCanvasRender){
			_next._fun.call(_next,sprite,context,x,y);
			return;
		}
		_cacheStyle.cacheAs==='bitmap' ? (Stat.canvasBitmap++):(Stat.canvasNormal++);
		var cacheNeedRebuild=false;
		var textNeedRestore=false;
		if (Render.isWebGL && _cacheStyle.canvas){
			var canv=_cacheStyle.canvas;
			var ctx=canv.context;
			var charRIs=canv.touches;
			if (charRIs){
				for (var ci=0;ci < charRIs.length;ci++){
					if (charRIs[ci].deleted){
						textNeedRestore=true;
						break ;
					}
				}
			}
			cacheNeedRebuild=canv.isCacheValid && !canv.isCacheValid();
		}
		if (sprite._needRepaint()|| (!_cacheStyle.canvas)|| textNeedRestore ||cacheNeedRebuild || Laya.stage.isGlobalRepaint()){
			if (Render.isWebGL && _cacheStyle.cacheAs==='normal'){
				if (/*__JS__ */context._targets){
					_next._fun.call(_next,sprite,context,x,y);
					return;
					}else{
					this._canvas_webgl_normal_repaint(sprite,context);
				}
				}else{
				this._canvas_repaint(sprite,context,x,y);
			}
		};
		var tRec=_cacheStyle.cacheRect;
		context.drawCanvas(_cacheStyle.canvas,x+tRec.x,y+tRec.y,tRec.width,tRec.height);
	}

	__proto._canvas_repaint=function(sprite,context,x,y){
		var _cacheStyle=sprite._cacheStyle;
		var _next=this._next;
		var tx;
		var canvas=_cacheStyle.canvas;
		var left;
		var top;
		var tRec;
		var tCacheType=_cacheStyle.cacheAs;
		var w,h;
		var scaleX,scaleY;
		var scaleInfo;
		scaleInfo=_cacheStyle._calculateCacheRect(sprite,tCacheType,x,y);
		scaleX=scaleInfo.x;
		scaleY=scaleInfo.y;
		tRec=_cacheStyle.cacheRect;
		w=tRec.width *scaleX;
		h=tRec.height *scaleY;
		left=tRec.x;
		top=tRec.y;
		if (Render.isWebGL && tCacheType==='bitmap' && (w > 2048 || h > 2048)){
			console.warn("cache bitmap size larger than 2048,cache ignored");
			_cacheStyle.releaseContext();
			_next._fun.call(_next,sprite,context,x,y);
			return;
		}
		if (!canvas){
			_cacheStyle.createContext();
			canvas=_cacheStyle.canvas;
		}
		tx=canvas.context;
		tx.sprite=sprite;
		(canvas.width !=w || canvas.height !=h)&& canvas.size(w,h);
		if (tCacheType==='bitmap')tx.asBitmap=true;
		else if (tCacheType==='normal')tx.asBitmap=false;
		tx.clear();
		if (scaleX !=1 || scaleY !=1){
			var ctx=tx;
			ctx.save();
			ctx.scale(scaleX,scaleY);
			_next._fun.call(_next,sprite,tx,-left,-top);
			ctx.restore();
			sprite._applyFilters();
			}else {
			ctx=tx;
			_next._fun.call(_next,sprite,tx,-left,-top);
			sprite._applyFilters();
		}
		if (_cacheStyle.staticCache)_cacheStyle.reCache=false;
		Stat.canvasReCache++;
	}

	__proto._canvas_webgl_normal_repaint=function(sprite,context){
		var _cacheStyle=sprite._cacheStyle;
		var _next=this._next;
		var canvas=_cacheStyle.canvas;
		var tCacheType=_cacheStyle.cacheAs;
		var scaleInfo=_cacheStyle._calculateCacheRect(sprite,tCacheType,0,0);
		if (!canvas){
			canvas=_cacheStyle.canvas=/*__JS__ */new Laya.WebGLCacheAsNormalCanvas(context,sprite);
		};
		var tx=canvas.context;
		canvas['startRec']();
		_next._fun.call(_next,sprite,tx,sprite.pivotX,sprite.pivotY);
		sprite._applyFilters();
		Stat.canvasReCache++;
		canvas['endRec']();
	}

	RenderSprite.__init__=function(){
		LayaGLQuickRunner.__init__();
		var i=0,len=0;
		var initRender;
		initRender=RunDriver.createRenderSprite(0x11111,null);
		len=RenderSprite.renders.length=/*laya.display.SpriteConst.CHILDS*/0x2000 *2;
		for (i=0;i < len;i++)
		RenderSprite.renders[i]=initRender;
		RenderSprite.renders[0]=RunDriver.createRenderSprite(0,null);
		function _initSame (value,o){
			var n=0;
			for (var i=0;i < value.length;i++){
				n |=value[i];
				RenderSprite.renders[n]=o;
			}
		}
	}

	RenderSprite._initRenderFun=function(sprite,context,x,y){
		var type=sprite._renderType;
		var r=RenderSprite.renders[type]=RenderSprite._getTypeRender(type);
		r._fun(sprite,context,x,y);
	}

	RenderSprite._getTypeRender=function(type){
		if (LayaGLQuickRunner.map[type])return RunDriver.createRenderSprite(type,null);
		var rst=null;
		var tType=/*laya.display.SpriteConst.CHILDS*/0x2000;
		while (tType > 0){
			if (tType & type)
				rst=RunDriver.createRenderSprite(tType,rst);
			tType=tType >> 1;
		}
		return rst;
	}

	RenderSprite.INIT=0x11111;
	RenderSprite.renders=[];
	RenderSprite.NORENDER=new RenderSprite(0,null);
	return RenderSprite;
})()


/**

*/
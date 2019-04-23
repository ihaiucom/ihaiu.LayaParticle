/**
*<code>Timer</code> 是时钟管理类。它是一个单例，不要手动实例化此类，应该通过 Laya.timer 访问。
*/
//class laya.utils.Timer
var Timer=(function(){
	var TimerHandler;
	function Timer(autoActive){
		/**时针缩放。*/
		this.scale=1;
		/**当前的帧数。*/
		this.currFrame=0;
		/**@private 两帧之间的时间间隔,单位毫秒。*/
		this._delta=0;
		/**@private */
		this._map=[];
		/**@private */
		this._handlers=[];
		/**@private */
		this._temp=[];
		/**@private */
		this._count=0;
		this.currTimer=Browser.now();
		this._lastTimer=Browser.now();
		(autoActive===void 0)&& (autoActive=true);
		autoActive && Laya.systemTimer && Laya.systemTimer.frameLoop(1,this,this._update);
	}

	__class(Timer,'laya.utils.Timer');
	var __proto=Timer.prototype;
	/**
	*@private
	*帧循环处理函数。
	*/
	__proto._update=function(){
		if (this.scale <=0){
			this._lastTimer=Browser.now();
			return;
		};
		var frame=this.currFrame=this.currFrame+this.scale;
		var now=Browser.now();
		this._delta=(now-this._lastTimer)*this.scale;
		var timer=this.currTimer=this.currTimer+this._delta;
		this._lastTimer=now;
		var handlers=this._handlers;
		this._count=0;
		for (var i=0,n=handlers.length;i < n;i++){
			var handler=handlers[i];
			if (handler.method!==null){
				var t=handler.userFrame ? frame :timer;
				if (t >=handler.exeTime){
					if (handler.repeat){
						if (!handler.jumpFrame){
							handler.exeTime+=handler.delay;
							handler.run(false);
							if (t > handler.exeTime){
								handler.exeTime+=Math.ceil((t-handler.exeTime)/ handler.delay)*handler.delay;
							}
							}else {
							while (t >=handler.exeTime){
								handler.exeTime+=handler.delay;
								handler.run(false);
							}
						}
						}else {
						handler.run(true);
					}
				}
				}else {
				this._count++;
			}
		}
		if (this._count > 30 || frame % 200===0)this._clearHandlers();
	}

	/**@private */
	__proto._clearHandlers=function(){
		var handlers=this._handlers;
		for (var i=0,n=handlers.length;i < n;i++){
			var handler=handlers[i];
			if (handler.method!==null)this._temp.push(handler);
			else this._recoverHandler(handler);
		}
		this._handlers=this._temp;
		handlers.length=0;
		this._temp=handlers;
	}

	/**@private */
	__proto._recoverHandler=function(handler){
		if (this._map[handler.key]==handler)this._map[handler.key]=null;
		handler.clear();
		Timer._pool.push(handler);
	}

	/**@private */
	__proto._create=function(useFrame,repeat,delay,caller,method,args,coverBefore){
		if (!delay){
			method.apply(caller,args);
			return null;
		}
		if (coverBefore){
			var handler=this._getHandler(caller,method);
			if (handler){
				handler.repeat=repeat;
				handler.userFrame=useFrame;
				handler.delay=delay;
				handler.caller=caller;
				handler.method=method;
				handler.args=args;
				handler.exeTime=delay+(useFrame ? this.currFrame :this.currTimer+Browser.now()-this._lastTimer);
				return handler;
			}
		}
		handler=Timer._pool.length > 0 ? Timer._pool.pop():new TimerHandler();
		handler.repeat=repeat;
		handler.userFrame=useFrame;
		handler.delay=delay;
		handler.caller=caller;
		handler.method=method;
		handler.args=args;
		handler.exeTime=delay+(useFrame ? this.currFrame :this.currTimer+Browser.now()-this._lastTimer);
		this._indexHandler(handler);
		this._handlers.push(handler);
		return handler;
	}

	/**@private */
	__proto._indexHandler=function(handler){
		var caller=handler.caller;
		var method=handler.method;
		var cid=caller ? caller.$_GID || (caller.$_GID=Utils.getGID()):0;
		var mid=method.$_TID || (method.$_TID=(Timer._mid++)*100000);
		handler.key=cid+mid;
		this._map[handler.key]=handler;
	}

	/**
	*定时执行一次。
	*@param delay 延迟时间(单位为毫秒)。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*@param args 回调参数。
	*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
	*/
	__proto.once=function(delay,caller,method,args,coverBefore){
		(coverBefore===void 0)&& (coverBefore=true);
		this._create(false,false,delay,caller,method,args,coverBefore);
	}

	/**
	*定时重复执行。
	*@param delay 间隔时间(单位毫秒)。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*@param args 回调参数。
	*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
	*@param jumpFrame 时钟是否跳帧。基于时间的循环回调，单位时间间隔内，如能执行多次回调，出于性能考虑，引擎默认只执行一次，设置jumpFrame=true后，则回调会连续执行多次
	*/
	__proto.loop=function(delay,caller,method,args,coverBefore,jumpFrame){
		(coverBefore===void 0)&& (coverBefore=true);
		(jumpFrame===void 0)&& (jumpFrame=false);
		var handler=this._create(false,true,delay,caller,method,args,coverBefore);
		if (handler)handler.jumpFrame=jumpFrame;
	}

	/**
	*定时执行一次(基于帧率)。
	*@param delay 延迟几帧(单位为帧)。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*@param args 回调参数。
	*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
	*/
	__proto.frameOnce=function(delay,caller,method,args,coverBefore){
		(coverBefore===void 0)&& (coverBefore=true);
		this._create(true,false,delay,caller,method,args,coverBefore);
	}

	/**
	*定时重复执行(基于帧率)。
	*@param delay 间隔几帧(单位为帧)。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*@param args 回调参数。
	*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
	*/
	__proto.frameLoop=function(delay,caller,method,args,coverBefore){
		(coverBefore===void 0)&& (coverBefore=true);
		this._create(true,true,delay,caller,method,args,coverBefore);
	}

	/**返回统计信息。*/
	__proto.toString=function(){
		return " handlers:"+this._handlers.length+" pool:"+Timer._pool.length;
	}

	/**
	*清理定时器。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*/
	__proto.clear=function(caller,method){
		var handler=this._getHandler(caller,method);
		if (handler){
			this._map[handler.key]=null;
			handler.key=0;
			handler.clear();
		}
	}

	/**
	*清理对象身上的所有定时器。
	*@param caller 执行域(this)。
	*/
	__proto.clearAll=function(caller){
		if (!caller)return;
		for (var i=0,n=this._handlers.length;i < n;i++){
			var handler=this._handlers[i];
			if (handler.caller===caller){
				this._map[handler.key]=null;
				handler.key=0;
				handler.clear();
			}
		}
	}

	/**@private */
	__proto._getHandler=function(caller,method){
		var cid=caller ? caller.$_GID || (caller.$_GID=Utils.getGID()):0;
		var mid=method.$_TID || (method.$_TID=(Timer._mid++)*100000);
		return this._map[cid+mid];
	}

	/**
	*延迟执行。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*@param args 回调参数。
	*/
	__proto.callLater=function(caller,method,args){
		CallLater.I.callLater(caller,method,args);
	}

	/**
	*立即执行 callLater 。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*/
	__proto.runCallLater=function(caller,method){
		CallLater.I.runCallLater(caller,method);
	}

	/**
	*立即提前执行定时器，执行之后从队列中删除
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*/
	__proto.runTimer=function(caller,method){
		var handler=this._getHandler(caller,method);
		if (handler && handler.method !=null){
			this._map[handler.key]=null;
			handler.run(true);
		}
	}

	/**
	*暂停时钟
	*/
	__proto.pause=function(){
		this.scale=0;
	}

	/**
	*恢复时钟
	*/
	__proto.resume=function(){
		this.scale=1;
	}

	/**两帧之间的时间间隔,单位毫秒。*/
	__getset(0,__proto,'delta',function(){
		return this._delta;
	});

	Timer._pool=[];
	Timer._mid=1;
	Timer.__init$=function(){
		/**@private */
		//class TimerHandler
		TimerHandler=(function(){
			function TimerHandler(){
				this.key=0;
				this.repeat=false;
				this.delay=0;
				this.userFrame=false;
				this.exeTime=0;
				this.caller=null;
				this.method=null;
				this.args=null;
				this.jumpFrame=false;
			}
			__class(TimerHandler,'');
			var __proto=TimerHandler.prototype;
			__proto.clear=function(){
				this.caller=null;
				this.method=null;
				this.args=null;
			}
			__proto.run=function(withClear){
				var caller=this.caller;
				if (caller && caller.destroyed)return this.clear();
				var method=this.method;
				var args=this.args;
				withClear && this.clear();
				if (method==null)return;
				args ? method.apply(caller,args):method.call(caller);
			}
			return TimerHandler;
		})()
	}

	return Timer;
})()


/**
*绘制文本边框
*/
//class laya.display.cmd.FillBorderTextCmd
var FillBorderTextCmd=(function(){
	function FillBorderTextCmd(){
		/**
		*在画布上输出的文本。
		*/
		//this.text=null;
		/**
		*开始绘制文本的 x 坐标位置（相对于画布）。
		*/
		//this.x=NaN;
		/**
		*开始绘制文本的 y 坐标位置（相对于画布）。
		*/
		//this.y=NaN;
		/**
		*定义字体和字号，比如"20px Arial"。
		*/
		//this.font=null;
		/**
		*定义文本颜色，比如"#ff0000"。
		*/
		//this.fillColor=null;
		/**
		*定义镶边文本颜色。
		*/
		//this.borderColor=null;
		/**
		*镶边线条宽度。
		*/
		//this.lineWidth=NaN;
		/**
		*文本对齐方式，可选值："left"，"center"，"right"。
		*/
		//this.textAlign=null;
	}

	__class(FillBorderTextCmd,'laya.display.cmd.FillBorderTextCmd');
	var __proto=FillBorderTextCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("FillBorderTextCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.fillBorderText(this.text,this.x+gx,this.y+gy,this.font,this.fillColor,this.borderColor,this.lineWidth,this.textAlign);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "FillBorderText";
	});

	FillBorderTextCmd.create=function(text,x,y,font,fillColor,borderColor,lineWidth,textAlign){
		var cmd=Pool.getItemByClass("FillBorderTextCmd",FillBorderTextCmd);
		cmd.text=text;
		cmd.x=x;
		cmd.y=y;
		cmd.font=font;
		cmd.fillColor=fillColor;
		cmd.borderColor=borderColor;
		cmd.lineWidth=lineWidth;
		cmd.textAlign=textAlign;
		return cmd;
	}

	FillBorderTextCmd.ID="FillBorderText";
	return FillBorderTextCmd;
})()


/**
*填充贴图
*/
//class laya.display.cmd.FillTextureCmd
var FillTextureCmd=(function(){
	function FillTextureCmd(){
		/**
		*纹理。
		*/
		//this.texture=null;
		/**
		*X轴偏移量。
		*/
		//this.x=NaN;
		/**
		*Y轴偏移量。
		*/
		//this.y=NaN;
		/**
		*（可选）宽度。
		*/
		//this.width=NaN;
		/**
		*（可选）高度。
		*/
		//this.height=NaN;
		/**
		*（可选）填充类型 repeat|repeat-x|repeat-y|no-repeat
		*/
		//this.type=null;
		/**
		*（可选）贴图纹理偏移
		*/
		//this.offset=null;
		/**@private */
		//this.other=null;
	}

	__class(FillTextureCmd,'laya.display.cmd.FillTextureCmd');
	var __proto=FillTextureCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this.texture=null;
		this.offset=null;
		this.other=null;
		Pool.recover("FillTextureCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.fillTexture(this.texture,this.x+gx,this.y+gy,this.width,this.height,this.type,this.offset,this.other);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "FillTexture";
	});

	FillTextureCmd.create=function(texture,x,y,width,height,type,offset,other){
		var cmd=Pool.getItemByClass("FillTextureCmd",FillTextureCmd);
		cmd.texture=texture;
		cmd.x=x;
		cmd.y=y;
		cmd.width=width;
		cmd.height=height;
		cmd.type=type;
		cmd.offset=offset;
		cmd.other=other;
		return cmd;
	}

	FillTextureCmd.ID="FillTexture";
	return FillTextureCmd;
})()


/**
*绘制边框
*@private
*/
//class laya.display.cmd.FillBorderWordsCmd
var FillBorderWordsCmd=(function(){
	function FillBorderWordsCmd(){
		/**
		*文字数组
		*/
		//this.words=null;
		/**
		*开始绘制文本的 x 坐标位置（相对于画布）。
		*/
		//this.x=NaN;
		/**
		*开始绘制文本的 y 坐标位置（相对于画布）。
		*/
		//this.y=NaN;
		/**
		*定义字体和字号，比如"20px Arial"。
		*/
		//this.font=null;
		/**
		*定义文本颜色，比如"#ff0000"。
		*/
		//this.fillColor=null;
		/**
		*定义镶边文本颜色。
		*/
		//this.borderColor=null;
		/**
		*镶边线条宽度。
		*/
		//this.lineWidth=0;
	}

	__class(FillBorderWordsCmd,'laya.display.cmd.FillBorderWordsCmd');
	var __proto=FillBorderWordsCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this.words=null;
		Pool.recover("FillBorderWordsCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.fillBorderWords(this.words,this.x+gx,this.y+gy,this.font,this.fillColor,this.borderColor,this.lineWidth);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "FillBorderWords";
	});

	FillBorderWordsCmd.create=function(words,x,y,font,fillColor,borderColor,lineWidth){
		var cmd=Pool.getItemByClass("FillBorderWordsCmd",FillBorderWordsCmd);
		cmd.words=words;
		cmd.x=x;
		cmd.y=y;
		cmd.font=font;
		cmd.fillColor=fillColor;
		cmd.borderColor=borderColor;
		cmd.lineWidth=lineWidth;
		return cmd;
	}

	FillBorderWordsCmd.ID="FillBorderWords";
	return FillBorderWordsCmd;
})()


/**
*@private

*/
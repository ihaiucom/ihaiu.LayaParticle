/**
*<code>/**
*<code>/**
*<code>Keyboard</code> 类的属性是一些常数，这些常数表示控制游戏时最常用的键。
*/
//class laya.events.Keyboard
var Keyboard=(function(){
	function Keyboard(){}
	__class(Keyboard,'laya.events.Keyboard');
	Keyboard.NUMBER_0=48;
	Keyboard.NUMBER_1=49;
	Keyboard.NUMBER_2=50;
	Keyboard.NUMBER_3=51;
	Keyboard.NUMBER_4=52;
	Keyboard.NUMBER_5=53;
	Keyboard.NUMBER_6=54;
	Keyboard.NUMBER_7=55;
	Keyboard.NUMBER_8=56;
	Keyboard.NUMBER_9=57;
	Keyboard.A=65;
	Keyboard.B=66;
	Keyboard.C=67;
	Keyboard.D=68;
	Keyboard.E=69;
	Keyboard.F=70;
	Keyboard.G=71;
	Keyboard.H=72;
	Keyboard.I=73;
	Keyboard.J=74;
	Keyboard.K=75;
	Keyboard.L=76;
	Keyboard.M=77;
	Keyboard.N=78;
	Keyboard.O=79;
	Keyboard.P=80;
	Keyboard.Q=81;
	Keyboard.R=82;
	Keyboard.S=83;
	Keyboard.T=84;
	Keyboard.U=85;
	Keyboard.V=86;
	Keyboard.W=87;
	Keyboard.X=88;
	Keyboard.Y=89;
	Keyboard.Z=90;
	Keyboard.F1=112;
	Keyboard.F2=113;
	Keyboard.F3=114;
	Keyboard.F4=115;
	Keyboard.F5=116;
	Keyboard.F6=117;
	Keyboard.F7=118;
	Keyboard.F8=119;
	Keyboard.F9=120;
	Keyboard.F10=121;
	Keyboard.F11=122;
	Keyboard.F12=123;
	Keyboard.F13=124;
	Keyboard.F14=125;
	Keyboard.F15=126;
	Keyboard.NUMPAD=21;
	Keyboard.NUMPAD_0=96;
	Keyboard.NUMPAD_1=97;
	Keyboard.NUMPAD_2=98;
	Keyboard.NUMPAD_3=99;
	Keyboard.NUMPAD_4=100;
	Keyboard.NUMPAD_5=101;
	Keyboard.NUMPAD_6=102;
	Keyboard.NUMPAD_7=103;
	Keyboard.NUMPAD_8=104;
	Keyboard.NUMPAD_9=105;
	Keyboard.NUMPAD_ADD=107;
	Keyboard.NUMPAD_DECIMAL=110;
	Keyboard.NUMPAD_DIVIDE=111;
	Keyboard.NUMPAD_ENTER=108;
	Keyboard.NUMPAD_MULTIPLY=106;
	Keyboard.NUMPAD_SUBTRACT=109;
	Keyboard.SEMICOLON=186;
	Keyboard.EQUAL=187;
	Keyboard.COMMA=188;
	Keyboard.MINUS=189;
	Keyboard.PERIOD=190;
	Keyboard.SLASH=191;
	Keyboard.BACKQUOTE=192;
	Keyboard.LEFTBRACKET=219;
	Keyboard.BACKSLASH=220;
	Keyboard.RIGHTBRACKET=221;
	Keyboard.QUOTE=222;
	Keyboard.ALTERNATE=18;
	Keyboard.BACKSPACE=8;
	Keyboard.CAPS_LOCK=20;
	Keyboard.COMMAND=15;
	Keyboard.CONTROL=17;
	Keyboard.DELETE=46;
	Keyboard.ENTER=13;
	Keyboard.ESCAPE=27;
	Keyboard.PAGE_UP=33;
	Keyboard.PAGE_DOWN=34;
	Keyboard.END=35;
	Keyboard.HOME=36;
	Keyboard.LEFT=37;
	Keyboard.UP=38;
	Keyboard.RIGHT=39;
	Keyboard.DOWN=40;
	Keyboard.SHIFT=16;
	Keyboard.SPACE=32;
	Keyboard.TAB=9;
	Keyboard.INSERT=45;
	return Keyboard;
})()


/**
*绘制圆形
*/
//class laya.display.cmd.DrawCircleCmd
var DrawCircleCmd=(function(){
	function DrawCircleCmd(){
		/**
		*圆点X 轴位置。
		*/
		//this.x=NaN;
		/**
		*圆点Y 轴位置。
		*/
		//this.y=NaN;
		/**
		*半径。
		*/
		//this.radius=NaN;
		/**
		*填充颜色，或者填充绘图的渐变对象。
		*/
		//this.fillColor=null;
		/**
		*（可选）边框颜色，或者填充绘图的渐变对象。
		*/
		//this.lineColor=null;
		/**
		*（可选）边框宽度。
		*/
		//this.lineWidth=NaN;
		/**@private */
		//this.vid=0;
	}

	__class(DrawCircleCmd,'laya.display.cmd.DrawCircleCmd');
	var __proto=DrawCircleCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this.fillColor=null;
		this.lineColor=null;
		Pool.recover("DrawCircleCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context._drawCircle(this.x+gx,this.y+gy,this.radius,this.fillColor,this.lineColor,this.lineWidth,this.vid);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "DrawCircle";
	});

	DrawCircleCmd.create=function(x,y,radius,fillColor,lineColor,lineWidth,vid){
		var cmd=Pool.getItemByClass("DrawCircleCmd",DrawCircleCmd);
		cmd.x=x;
		cmd.y=y;
		cmd.radius=radius;
		cmd.fillColor=fillColor;
		cmd.lineColor=lineColor;
		cmd.lineWidth=lineWidth;
		cmd.vid=vid;
		return cmd;
	}

	DrawCircleCmd.ID="DrawCircle";
	return DrawCircleCmd;
})()


/**
*<p><code>MouseManager</code> 是鼠标、触摸交互管理器。</p>
*<p>鼠标事件流包括捕获阶段、目标阶段、冒泡阶段。<br/>
*捕获阶段：此阶段引擎会从stage开始递归检测stage及其子对象，直到找到命中的目标对象或者未命中任何对象；<br/>
*目标阶段：找到命中的目标对象；<br/>
*冒泡阶段：事件离开目标对象，按节点层级向上逐层通知，直到到达舞台的过程。</p>
*/
//class laya.events.MouseManager
var MouseManager=(function(){
	function MouseManager(){
		/**canvas 上的鼠标X坐标。*/
		this.mouseX=0;
		/**canvas 上的鼠标Y坐标。*/
		this.mouseY=0;
		/**是否禁用除 stage 以外的鼠标事件检测。*/
		this.disableMouseEvent=false;
		/**鼠标按下的时间。单位为毫秒。*/
		this.mouseDownTime=0;
		/**鼠标移动精度。*/
		this.mouseMoveAccuracy=2;
		this._stage=null;
		/**@private 希望capture鼠标事件的对象。*/
		this._captureSp=null;
		/**@private capture对象独占消息 */
		this._captureExlusiveMode=false;
		/**@private 在发送事件的过程中，是否发送给了_captureSp */
		this._hitCaputreSp=false;
		this._target=null;
		this._lastMoveTimer=0;
		this._isLeftMouse=false;
		this._touchIDs={};
		this._id=1;
		this._tTouchID=0;
		this._event=new Event();
		this._captureChain=[];
		this._matrix=new Matrix();
		this._point=new Point();
		this._rect=new Rectangle();
		this._prePoint=new Point();
		this._curTouchID=NaN;
	}

	__class(MouseManager,'laya.events.MouseManager');
	var __proto=MouseManager.prototype;
	/**
	*@private
	*初始化。
	*/
	__proto.__init__=function(stage,canvas){
		var _$this=this;
		this._stage=stage;
		var _this=this;
		canvas.oncontextmenu=function (e){
			if (MouseManager.enabled)return false;
		}
		canvas.addEventListener('mousedown',function(e){
			if (MouseManager.enabled){
				if(!Browser.onIE)e.preventDefault();
				_this.mouseDownTime=Browser.now();
				_$this.runEvent(e);
			}
		});
		canvas.addEventListener('mouseup',function(e){
			if (MouseManager.enabled){
				e.preventDefault();
				_this.mouseDownTime=-Browser.now();
				_$this.runEvent(e);
			}
		},true);
		canvas.addEventListener('mousemove',function(e){
			if (MouseManager.enabled){
				e.preventDefault();
				var now=Browser.now();
				if (now-_this._lastMoveTimer < 10)return;
				_this._lastMoveTimer=now;
				_$this.runEvent(e);
			}
		},true);
		canvas.addEventListener("mouseout",function(e){
			if (MouseManager.enabled)_$this.runEvent(e);
		})
		canvas.addEventListener("mouseover",function(e){
			if (MouseManager.enabled)_$this.runEvent(e);
		})
		canvas.addEventListener("touchstart",function(e){
			if (MouseManager.enabled){
				if (!MouseManager._isFirstTouch&&!Input.isInputting)e.preventDefault();
				_this.mouseDownTime=Browser.now();
				_$this.runEvent(e);
			}
		});
		canvas.addEventListener("touchend",function(e){
			if (MouseManager.enabled){
				if (!MouseManager._isFirstTouch&&!Input.isInputting)e.preventDefault();
				MouseManager._isFirstTouch=false;
				_this.mouseDownTime=-Browser.now();
				_$this.runEvent(e);
				}else {
				_$this._curTouchID=NaN;
			}
		},true);
		canvas.addEventListener("touchmove",function(e){
			if (MouseManager.enabled){
				e.preventDefault();
				_$this.runEvent(e);
			}
		},true);
		canvas.addEventListener("touchcancel",function(e){
			if (MouseManager.enabled){
				e.preventDefault();
				_$this.runEvent(e);
				}else {
				_$this._curTouchID=NaN;
			}
		},true);
		canvas.addEventListener('mousewheel',function(e){
			if (MouseManager.enabled)_$this.runEvent(e);
		});
		canvas.addEventListener('DOMMouseScroll',function(e){
			if (MouseManager.enabled)_$this.runEvent(e);
		});
	}

	__proto.initEvent=function(e,nativeEvent){
		var _this=this;
		_this._event._stoped=false;
		_this._event.nativeEvent=nativeEvent || e;
		_this._target=null;
		this._point.setTo(e.pageX || e.clientX,e.pageY || e.clientY);
		if (this._stage._canvasTransform){
			this._stage._canvasTransform.invertTransformPoint(this._point);
			_this.mouseX=this._point.x;
			_this.mouseY=this._point.y;
		}
		_this._event.touchId=e.identifier || 0;
		this._tTouchID=_this._event.touchId;
		var evt;
		evt=TouchManager.I._event;
		evt._stoped=false;
		evt.nativeEvent=_this._event.nativeEvent;
		evt.touchId=_this._event.touchId;
	}

	__proto.checkMouseWheel=function(e){
		this._event.delta=e.wheelDelta ? e.wheelDelta *0.025 :-e.detail;
		var _lastOvers=TouchManager.I.getLastOvers();
		for (var i=0,n=_lastOvers.length;i < n;i++){
			var ele=_lastOvers[i];
			ele.event(/*laya.events.Event.MOUSE_WHEEL*/"mousewheel",this._event.setTo(/*laya.events.Event.MOUSE_WHEEL*/"mousewheel",ele,this._target));
		}
	}

	// _stage.event(Event.MOUSE_WHEEL,_event.setTo(Event.MOUSE_WHEEL,_stage,_target));
	__proto.onMouseMove=function(ele){
		TouchManager.I.onMouseMove(ele,this._tTouchID);
	}

	__proto.onMouseDown=function(ele){
		if (Input.isInputting && Laya.stage.focus && Laya.stage.focus["focus"] && !Laya.stage.focus.contains(this._target)){
			var pre_input=Laya.stage.focus['_tf'] || Laya.stage.focus;
			var new_input=ele['_tf'] || ele;
			if ((new_input instanceof laya.display.Input )&& new_input.multiline==pre_input.multiline)
				pre_input['_focusOut']();
			else
			pre_input.focus=false;
		}
		TouchManager.I.onMouseDown(ele,this._tTouchID,this._isLeftMouse);
	}

	__proto.onMouseUp=function(ele){
		TouchManager.I.onMouseUp(ele,this._tTouchID,this._isLeftMouse);
	}

	__proto.check=function(sp,mouseX,mouseY,callBack){
		this._point.setTo(mouseX,mouseY);
		sp.fromParentPoint(this._point);
		mouseX=this._point.x;
		mouseY=this._point.y;
		var scrollRect=sp._style.scrollRect;
		if (scrollRect){
			this._rect.setTo(scrollRect.x,scrollRect.y,scrollRect.width,scrollRect.height);
			if (!this._rect.contains(mouseX,mouseY))return false;
		}
		if (!this.disableMouseEvent){
			if (sp.hitTestPrior && !sp.mouseThrough && !this.hitTest(sp,mouseX,mouseY)){
				return false;
			}
			for (var i=sp._children.length-1;i >-1;i--){
				var child=sp._children[i];
				if (!child.destroyed && child._mouseState > 1 && child._visible){
					if (this.check(child,mouseX,mouseY,callBack))return true;
				}
			}
			for (i=sp._extUIChild.length-1;i >=0;i--){
				var c=sp._extUIChild[i];
				if (!c.destroyed && c._mouseState > 1 && c._visible){
					if (this.check(c,mouseX,mouseY,callBack))return true;
				}
			}
		};
		var isHit=(sp.hitTestPrior && !sp.mouseThrough && !this.disableMouseEvent)? true :this.hitTest(sp,mouseX,mouseY);
		if (isHit){
			this._target=sp;
			callBack.call(this,sp);
			if (this._target==this._hitCaputreSp){
				this._hitCaputreSp=true;
			}
			}else if (callBack===this.onMouseUp && sp===this._stage){
			this._target=this._stage;
			callBack.call(this,this._target);
		}
		return isHit;
	}

	__proto.hitTest=function(sp,mouseX,mouseY){
		var isHit=false;
		if (sp.scrollRect){
			mouseX-=sp._style.scrollRect.x;
			mouseY-=sp._style.scrollRect.y;
		};
		var hitArea=sp._style.hitArea;
		if (hitArea && hitArea._hit){
			return hitArea.contains(mouseX,mouseY);
		}
		if (sp.width > 0 && sp.height > 0 || sp.mouseThrough || hitArea){
			if (!sp.mouseThrough){
				isHit=(hitArea ? hitArea :this._rect.setTo(0,0,sp.width,sp.height)).contains(mouseX,mouseY);
				}else {
				isHit=sp.getGraphicBounds().contains(mouseX,mouseY);
			}
		}
		return isHit;
	}

	__proto._checkAllBaseUI=function(mousex,mousey,callback){
		var ret=this.handleExclusiveCapture(this.mouseX,this.mouseY,callback);
		if (ret)return true;
		ret=this.check(this._stage,this.mouseX,this.mouseY,callback);
		return this.handleCapture(this.mouseX,this.mouseY,callback)||ret;
	}

	/**
	*处理3d界面。
	*@param mousex
	*@param mousey
	*@param callback
	*@return
	*/
	__proto.check3DUI=function(mousex,mousey,callback){
		var uis=this._stage._3dUI;
		var i=0;
		var ret=false;
		for (;i < uis.length;i++){
			var curui=uis[i];
			this._stage._curUIBase=curui;
			if(!curui.destroyed && curui._mouseState > 1 && curui._visible){
				ret=ret || this.check(curui,this.mouseX,this.mouseY,callback);
			}
		}
		this._stage._curUIBase=this._stage;
		return ret;
	}

	__proto.handleExclusiveCapture=function(mousex,mousey,callback){
		if (this._captureExlusiveMode && this._captureSp && this._captureChain.length > 0){
			var cursp;
			this._point.setTo(mousex,mousey);
			for (var i=0;i < this._captureChain.length;i++){
				cursp=this._captureChain[i];
				cursp.fromParentPoint(this._point);
			}
			this._target=cursp;
			callback.call(this,cursp);
			return true;
		}
		return false;
	}

	__proto.handleCapture=function(mousex,mousey,callback){
		if (!this._hitCaputreSp && this._captureSp && this._captureChain.length > 0){
			var cursp;
			this._point.setTo(mousex,mousey);
			for (var i=0;i < this._captureChain.length;i++){
				cursp=this._captureChain[i];
				cursp.fromParentPoint(this._point);
			}
			this._target=cursp;
			callback.call(this,cursp);
			return true;
		}
		return false;
	}

	/**
	*执行事件处理。
	*/
	__proto.runEvent=function(evt){
		var _this=this;
		var i=0,n=0,touch;
		if (evt.type!=='mousemove')this._prePoint.x=this._prePoint.y=-1000000;
		switch (evt.type){
			case 'mousedown':
				this._touchIDs[0]=this._id++;
				if (!MouseManager._isTouchRespond){
					this._isLeftMouse=evt.button===0;
					this.initEvent(evt);
					this._checkAllBaseUI(this.mouseX,this.mouseY,this.onMouseDown);
				}else
				MouseManager._isTouchRespond=false;
				break ;
			case 'mouseup':
				this._isLeftMouse=evt.button===0;
				this.initEvent(evt);
				this._checkAllBaseUI(this.mouseX,this.mouseY,this.onMouseUp);
				break ;
			case 'mousemove':
				if ((Math.abs(this._prePoint.x-evt.clientX)+Math.abs(this._prePoint.y-evt.clientY))>=this.mouseMoveAccuracy){
					this._prePoint.x=evt.clientX;
					this._prePoint.y=evt.clientY;
					this.initEvent(evt);
					this._checkAllBaseUI(this.mouseX,this.mouseY,this.onMouseMove);
				}
				break ;
			case "touchstart":
				MouseManager._isTouchRespond=true;
				this._isLeftMouse=true;
				var touches=evt.changedTouches;
				for (i=0,n=touches.length;i < n;i++){
					touch=touches[i];
					if (MouseManager.multiTouchEnabled || isNaN(this._curTouchID)){
						this._curTouchID=touch.identifier;
						if (this._id % 200===0)this._touchIDs={};
						this._touchIDs[touch.identifier]=this._id++;
						this.initEvent(touch,evt);
						this._checkAllBaseUI(this.mouseX,this.mouseY,this.onMouseDown);
					}
				}
				break ;
			case "touchend":
			case "touchcancel":
				MouseManager._isTouchRespond=true;
				this._isLeftMouse=true;
				var touchends=evt.changedTouches;
				for (i=0,n=touchends.length;i < n;i++){
					touch=touchends[i];
					if (MouseManager.multiTouchEnabled || touch.identifier==this._curTouchID){
						this._curTouchID=NaN;
						this.initEvent(touch,evt);
						var isChecked=false;
						isChecked=this._checkAllBaseUI(this.mouseX,this.mouseY,this.onMouseUp);
						if (!isChecked){
							this.onMouseUp(null);
						}
					}
				}
				break ;
			case "touchmove":;
				var touchemoves=evt.changedTouches;
				for (i=0,n=touchemoves.length;i < n;i++){
					touch=touchemoves[i];
					if (MouseManager.multiTouchEnabled || touch.identifier==this._curTouchID){
						this.initEvent(touch,evt);
						this._checkAllBaseUI(this.mouseX,this.mouseY,this.onMouseMove);
					}
				}
				break ;
			case "wheel":
			case "mousewheel":
			case "DOMMouseScroll":
				this.checkMouseWheel(evt);
				break ;
			case "mouseout":
				TouchManager.I.stageMouseOut();
				break ;
			case "mouseover":
				this._stage.event(/*laya.events.Event.MOUSE_OVER*/"mouseover",this._event.setTo(/*laya.events.Event.MOUSE_OVER*/"mouseover",this._stage,this._stage));
				break ;
			}
	}

	/**
	*
	*@param sp
	*@param exlusive 是否是独占模式
	*/
	__proto.setCapture=function(sp,exclusive){
		(exclusive===void 0)&& (exclusive=false);
		this._captureSp=sp;
		this._captureExlusiveMode=exclusive;
		this._captureChain.length=0;
		this._captureChain.push(sp);
		var cursp=sp;
		while (true){
			if (cursp==Laya.stage)break ;
			if (cursp==Laya.stage._curUIBase)break ;
			cursp=cursp.parent;
			if (!cursp)break ;
			this._captureChain.splice(0,0,cursp);
		}
	}

	__proto.releaseCapture=function(){
		console.log('release capture');
		this._captureSp=null;
	}

	MouseManager.enabled=true;
	MouseManager.multiTouchEnabled=true;
	MouseManager._isTouchRespond=false;
	MouseManager._isFirstTouch=true;
	__static(MouseManager,
	['instance',function(){return this.instance=new MouseManager();}
	]);
	return MouseManager;
})()


/**
*绘制连续曲线
*/
//class laya.display.cmd.DrawLinesCmd
var DrawLinesCmd=(function(){
	function DrawLinesCmd(){
		/**
		*开始绘制的X轴位置。
		*/
		//this.x=NaN;
		/**
		*开始绘制的Y轴位置。
		*/
		//this.y=NaN;
		/**
		*线段的点集合。格式:[x1,y1,x2,y2,x3,y3...]。
		*/
		//this.points=null;
		/**
		*线段颜色，或者填充绘图的渐变对象。
		*/
		//this.lineColor=null;
		/**
		*（可选）线段宽度。
		*/
		//this.lineWidth=NaN;
		/**@private */
		//this.vid=0;
	}

	__class(DrawLinesCmd,'laya.display.cmd.DrawLinesCmd');
	var __proto=DrawLinesCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this.points=null;
		this.lineColor=null;
		Pool.recover("DrawLinesCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context._drawLines(this.x+gx,this.y+gy,this.points,this.lineColor,this.lineWidth,this.vid);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "DrawLines";
	});

	DrawLinesCmd.create=function(x,y,points,lineColor,lineWidth,vid){
		var cmd=Pool.getItemByClass("DrawLinesCmd",DrawLinesCmd);
		cmd.x=x;
		cmd.y=y;
		cmd.points=points;
		cmd.lineColor=lineColor;
		cmd.lineWidth=lineWidth;
		cmd.vid=vid;
		return cmd;
	}

	DrawLinesCmd.ID="DrawLines";
	return DrawLinesCmd;
})()


/**
*@private

*/
*/
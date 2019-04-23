/**
*<code>/**
*<code>/**
*<code>HTMLChar</code> 是一个 HTML 字符类。
*/
//class laya.utils.HTMLChar
var HTMLChar=(function(){
	function HTMLChar(){
		/**x坐标*/
		//this.x=NaN;
		/**y坐标*/
		//this.y=NaN;
		/**宽*/
		//this.width=NaN;
		/**高*/
		//this.height=NaN;
		/**表示是否是正常单词(英文|.|数字)。*/
		//this.isWord=false;
		/**字符。*/
		//this.char=null;
		/**字符数量。*/
		//this.charNum=NaN;
		/**CSS 样式。*/
		//this.style=null;
		this.reset();
	}

	__class(HTMLChar,'laya.utils.HTMLChar');
	var __proto=HTMLChar.prototype;
	/**
	*根据指定的字符、宽高、样式，创建一个 <code>HTMLChar</code> 类的实例。
	*@param char 字符。
	*@param w 宽度。
	*@param h 高度。
	*@param style CSS 样式。
	*/
	__proto.setData=function(char,w,h,style){
		this.char=char;
		this.charNum=char.charCodeAt(0);
		this.x=this.y=0;
		this.width=w;
		this.height=h;
		this.style=style;
		this.isWord=!HTMLChar._isWordRegExp.test(char);
		return this;
	}

	/**
	*重置
	*/
	__proto.reset=function(){
		this.x=this.y=this.width=this.height=0;
		this.isWord=false;
		this.char=null;
		this.charNum=0;
		this.style=null;
		return this;
	}

	//TODO:coverage
	__proto.recover=function(){
		Pool.recover("HTMLChar",this.reset());
	}

	/**@private */
	__proto._isChar=function(){
		return true;
	}

	/**@private */
	__proto._getCSSStyle=function(){
		return this.style;
	}

	HTMLChar.create=function(){
		return Pool.getItemByClass("HTMLChar",HTMLChar);
	}

	HTMLChar._isWordRegExp=new RegExp("[\\w\.]","");
	return HTMLChar;
})()


/**
*绘制粒子
*@private
*/
//class laya.display.cmd.DrawParticleCmd
var DrawParticleCmd=(function(){
	function DrawParticleCmd(){
		//this._templ=null;
	}

	__class(DrawParticleCmd,'laya.display.cmd.DrawParticleCmd');
	var __proto=DrawParticleCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._templ=null;
		Pool.recover("DrawParticleCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.drawParticle(gx,gy,this._templ);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "DrawParticleCmd";
	});

	DrawParticleCmd.create=function(_temp){
		var cmd=Pool.getItemByClass("DrawParticleCmd",DrawParticleCmd);
		cmd._templ=_temp;
		return cmd;
	}

	DrawParticleCmd.ID="DrawParticleCmd";
	return DrawParticleCmd;
})()


/**
*<p><code>KeyBoardManager</code> 是键盘事件管理类。该类从浏览器中接收键盘事件，并派发该事件。</p>
*<p>派发事件时若 Stage.focus 为空则只从 Stage 上派发该事件，否则将从 Stage.focus 对象开始一直冒泡派发该事件。所以在 Laya.stage 上监听键盘事件一定能够收到，如果在其他地方监听，则必须处在Stage.focus的冒泡链上才能收到该事件。</p>
*<p>用户可以通过代码 Laya.stage.focus=someNode 的方式来设置focus对象。</p>
*<p>用户可统一的根据事件对象中 e.keyCode 来判断按键类型，该属性兼容了不同浏览器的实现。</p>
*/
//class laya.events.KeyBoardManager
var KeyBoardManager=(function(){
	function KeyBoardManager(){}
	__class(KeyBoardManager,'laya.events.KeyBoardManager');
	KeyBoardManager.__init__=function(){
		KeyBoardManager._addEvent("keydown");
		KeyBoardManager._addEvent("keypress");
		KeyBoardManager._addEvent("keyup");
	}

	KeyBoardManager._addEvent=function(type){
		Browser.document.addEventListener(type,function(e){
			laya.events.KeyBoardManager._dispatch(e,type);
		},true);
	}

	KeyBoardManager._dispatch=function(e,type){
		if (!KeyBoardManager.enabled)return;
		KeyBoardManager._event._stoped=false;
		KeyBoardManager._event.nativeEvent=e;
		KeyBoardManager._event.keyCode=e.keyCode || e.which || e.charCode;
		if (type==="keydown")KeyBoardManager._pressKeys[KeyBoardManager._event.keyCode]=true;
		else if (type==="keyup")KeyBoardManager._pressKeys[KeyBoardManager._event.keyCode]=null;
		var target=(Laya.stage.focus && (Laya.stage.focus.event !=null)&& Laya.stage.focus.displayedInStage)? Laya.stage.focus :Laya.stage;
		var ct=target;
		while (ct){
			ct.event(type,KeyBoardManager._event.setTo(type,ct,target));
			ct=ct.parent;
		}
	}

	KeyBoardManager.hasKeyDown=function(key){
		return KeyBoardManager._pressKeys[key];
	}

	KeyBoardManager._pressKeys={};
	KeyBoardManager.enabled=true;
	__static(KeyBoardManager,
	['_event',function(){return this._event=new Event();}
	]);
	return KeyBoardManager;
})()


/**

*/
*/
*/
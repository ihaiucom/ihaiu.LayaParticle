/**
*<code>Script</code> 类用于创建脚本的父类，该类为抽象类，不允许实例。
*组件的生命周期
*/
//class laya.components.Script extends laya.components.Component
var Script=(function(_super){
	function Script(){
		Script.__super.call(this);;
	}

	__class(Script,'laya.components.Script',_super);
	var __proto=Script.prototype;
	/**
	*@inheritDoc
	*/
	__proto._onAwake=function(){
		this.onAwake();
		if (this.onStart!==laya.components.Script.prototype.onStart){
			Laya.startTimer.callLater(this,this.onStart);
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._onEnable=function(){
		var proto=laya.components.Script.prototype;
		if (this.onTriggerEnter!==proto.onTriggerEnter){
			this.owner.on(/*laya.events.Event.TRIGGER_ENTER*/"triggerenter",this,this.onTriggerEnter);
		}
		if (this.onTriggerStay!==proto.onTriggerStay){
			this.owner.on(/*laya.events.Event.TRIGGER_STAY*/"triggerstay",this,this.onTriggerStay);
		}
		if (this.onTriggerExit!==proto.onTriggerExit){
			this.owner.on(/*laya.events.Event.TRIGGER_EXIT*/"triggerexit",this,this.onTriggerExit);
		}
		if (this.onMouseDown!==proto.onMouseDown){
			this.owner.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onMouseDown);
		}
		if (this.onMouseUp!==proto.onMouseUp){
			this.owner.on(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.onMouseUp);
		}
		if (this.onClick!==proto.onClick){
			this.owner.on(/*laya.events.Event.CLICK*/"click",this,this.onClick);
		}
		if (this.onStageMouseDown!==proto.onStageMouseDown){
			Laya.stage.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onStageMouseDown);
		}
		if (this.onStageMouseUp!==proto.onStageMouseUp){
			Laya.stage.on(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.onStageMouseUp);
		}
		if (this.onStageClick!==proto.onStageClick){
			Laya.stage.on(/*laya.events.Event.CLICK*/"click",this,this.onStageClick);
		}
		if (this.onStageMouseMove!==proto.onStageMouseMove){
			Laya.stage.on(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this,this.onStageMouseMove);
		}
		if (this.onDoubleClick!==proto.onDoubleClick){
			this.owner.on(/*laya.events.Event.DOUBLE_CLICK*/"doubleclick",this,this.onDoubleClick);
		}
		if (this.onRightClick!==proto.onRightClick){
			this.owner.on(/*laya.events.Event.RIGHT_CLICK*/"rightclick",this,this.onRightClick);
		}
		if (this.onMouseMove!==proto.onMouseMove){
			this.owner.on(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this,this.onMouseMove);
		}
		if (this.onMouseOver!==proto.onMouseOver){
			this.owner.on(/*laya.events.Event.MOUSE_OVER*/"mouseover",this,this.onMouseOver);
		}
		if (this.onMouseOut!==proto.onMouseOut){
			this.owner.on(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onMouseOut);
		}
		if (this.onKeyDown!==proto.onKeyDown){
			Laya.stage.on(/*laya.events.Event.KEY_DOWN*/"keydown",this,this.onKeyDown);
		}
		if (this.onKeyPress!==proto.onKeyPress){
			Laya.stage.on(/*laya.events.Event.KEY_PRESS*/"keypress",this,this.onKeyPress);
		}
		if (this.onKeyUp!==proto.onKeyUp){
			Laya.stage.on(/*laya.events.Event.KEY_UP*/"keyup",this,this.onKeyUp);
		}
		if (this.onUpdate!==proto.onUpdate){
			Laya.updateTimer.frameLoop(1,this,this.onUpdate);
		}
		if (this.onLateUpdate!==proto.onLateUpdate){
			Laya.lateTimer.frameLoop(1,this,this.onLateUpdate);
		}
		if (this.onPreRender!==proto.onPreRender){
			Laya.lateTimer.frameLoop(1,this,this.onPreRender);
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._onDisable=function(){
		this.owner.offAllCaller(this);
		Laya.stage.offAllCaller(this);
		Laya.startTimer.clearAll(this);
		Laya.updateTimer.clearAll(this);
		Laya.lateTimer.clearAll(this);
	}

	/**
	*@inheritDoc
	*/
	__proto._isScript=function(){
		return true;
	}

	/**
	*@inheritDoc
	*/
	__proto._onDestroy=function(){
		this.onDestroy();
	}

	/**
	*组件被激活后执行，此时所有节点和组件均已创建完毕，次方法只执行一次
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onAwake=function(){}
	/**
	*组件被启用后执行，比如节点被添加到舞台后
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onEnable=function(){}
	/**
	*第一次执行update之前执行，只会执行一次
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onStart=function(){}
	/**
	*开始碰撞时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onTriggerEnter=function(other,self,contact){}
	/**
	*持续碰撞时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onTriggerStay=function(other,self,contact){}
	/**
	*结束碰撞时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onTriggerExit=function(other,self,contact){}
	/**
	*鼠标按下时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onMouseDown=function(e){}
	/**
	*鼠标抬起时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onMouseUp=function(e){}
	/**
	*鼠标点击时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onClick=function(e){}
	/**
	*鼠标在舞台按下时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onStageMouseDown=function(e){}
	/**
	*鼠标在舞台抬起时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onStageMouseUp=function(e){}
	/**
	*鼠标在舞台点击时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onStageClick=function(e){}
	/**
	*鼠标在舞台移动时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onStageMouseMove=function(e){}
	/**
	*鼠标双击时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onDoubleClick=function(e){}
	/**
	*鼠标右键点击时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onRightClick=function(e){}
	/**
	*鼠标移动时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onMouseMove=function(e){}
	/**
	*鼠标经过节点时触发
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onMouseOver=function(e){}
	/**
	*鼠标离开节点时触发
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onMouseOut=function(e){}
	/**
	*键盘按下时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onKeyDown=function(e){}
	/**
	*键盘产生一个字符时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onKeyPress=function(e){}
	/**
	*键盘抬起时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onKeyUp=function(e){}
	/**
	*每帧更新时执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onUpdate=function(){}
	/**
	*每帧更新时执行，在update之后执行，尽量不要在这里写大循环逻辑或者使用getComponent方法
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onLateUpdate=function(){}
	/**
	*渲染之前执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onPreRender=function(){}
	/**
	*渲染之后执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onPostRender=function(){}
	/**
	*组件被禁用时执行，比如从节点从舞台移除后
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onDisable=function(){}
	/**
	*手动调用节点销毁时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onDestroy=function(){}
	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'isSingleton',function(){
		return false;
	});

	return Script;
})(Component)


/**
*@private

*/
/**
*<code>Script3D</code> 类用于创建脚本的父类,该类为抽象类,不允许实例。
*/
//class laya.d3.component.Script3D extends laya.components.Component
var Script3D=(function(_super){
	function Script3D(){
		Script3D.__super.call(this);;
	}

	__class(Script3D,'laya.d3.component.Script3D',_super);
	var __proto=Script3D.prototype;
	/**
	*@private
	*/
	__proto._checkProcessTriggers=function(){
		var prototype=laya.d3.component.Script3D.prototype;
		if (this.onTriggerEnter!==prototype.onTriggerEnter)
			return true;
		if (this.onTriggerStay!==prototype.onTriggerStay)
			return true;
		if (this.onTriggerExit!==prototype.onTriggerExit)
			return true;
		return false;
	}

	/**
	*@private
	*/
	__proto._checkProcessCollisions=function(){
		var prototype=laya.d3.component.Script3D.prototype;
		if (this.onCollisionEnter!==prototype.onCollisionEnter)
			return true;
		if (this.onCollisionStay!==prototype.onCollisionStay)
			return true;
		if (this.onCollisionExit!==prototype.onCollisionExit)
			return true;
		return false;
	}

	/**
	*@inheritDoc
	*/
	__proto._onAwake=function(){
		this.onAwake();
		if (this.onStart!==laya.d3.component.Script3D.prototype.onStart)
			Laya.startTimer.callLater(this,this.onStart);
	}

	/**
	*@inheritDoc
	*/
	__proto._onEnable=function(){
		(this.owner)._scene._scriptPool.add(this);
		var proto=laya.d3.component.Script3D.prototype;
		if (this.onKeyDown!==proto.onKeyDown){
			Laya.stage.on(/*laya.events.Event.KEY_DOWN*/"keydown",this,this.onKeyDown);
		}
		if (this.onKeyPress!==proto.onKeyPress){
			Laya.stage.on(/*laya.events.Event.KEY_PRESS*/"keypress",this,this.onKeyUp);
		}
		if (this.onKeyUp!==proto.onKeyUp){
			Laya.stage.on(/*laya.events.Event.KEY_UP*/"keyup",this,this.onKeyUp);
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._onDisable=function(){
		(this.owner)._scene._scriptPool.remove(this);
		this.owner.offAllCaller(this);
		Laya.stage.offAllCaller(this);
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
	__proto._onAdded=function(){
		var sprite=this.owner;
		var scripts=sprite._scripts;
		scripts || (sprite._scripts=scripts=[]);
		scripts.push(this);
		if (!sprite._needProcessCollisions)
			sprite._needProcessCollisions=this._checkProcessCollisions();
		if (!sprite._needProcessTriggers)
			sprite._needProcessTriggers=this._checkProcessTriggers();
	}

	/**
	*@inheritDoc
	*/
	__proto._onDestroy=function(){
		var scripts=(this.owner)._scripts;
		scripts.splice(scripts.indexOf(this),1);
		var sprite=this.owner;
		sprite._needProcessTriggers=false;
		for (var i=0,n=scripts.length;i < n;i++){
			if (scripts[i]._checkProcessTriggers()){
				sprite._needProcessTriggers=true;
				break ;
			}
		}
		sprite._needProcessCollisions=false;
		for (i=0,n=scripts.length;i < n;i++){
			if (scripts[i]._checkProcessCollisions()){
				sprite._needProcessCollisions=true;
				break ;
			}
		}
		this.onDestroy();
	}

	/**
	*创建后只执行一次
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onAwake=function(){}
	/**
	*每次启动后执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onEnable=function(){}
	/**
	*第一次执行update之前执行，只会执行一次
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onStart=function(){}
	/**
	*开始触发时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onTriggerEnter=function(other){}
	/**
	*持续触发时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onTriggerStay=function(other){}
	/**
	*结束触发时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onTriggerExit=function(other){}
	/**
	*开始碰撞时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onCollisionEnter=function(collision){}
	/**
	*持续碰撞时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onCollisionStay=function(collision){}
	/**
	*结束碰撞时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onCollisionExit=function(collision){}
	/**
	*鼠标按下时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onMouseDown=function(){}
	/**
	*鼠标拖拽时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onMouseDrag=function(){}
	/**
	*鼠标点击时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onMouseClick=function(){}
	/**
	*鼠标弹起时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onMouseUp=function(){}
	/**
	*鼠标进入时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onMouseEnter=function(){}
	/**
	*鼠标经过时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onMouseOver=function(){}
	/**
	*鼠标离开时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onMouseOut=function(){}
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
	*每帧更新时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onUpdate=function(){}
	/**
	*每帧更新时执行，在update之后执行
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
	*禁用时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onDisable=function(){}
	/**
	*销毁时执行
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onDestroy=function(){}
	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'isSingleton',function(){
		return false;
	});

	return Script3D;
})(Component)


/**

*/
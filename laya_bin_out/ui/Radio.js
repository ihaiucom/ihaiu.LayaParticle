/**
*<code>Radio</code> 控件使用户可在一组互相排斥的选择中做出一种选择。
*用户一次只能选择 <code>Radio</code> 组中的一个成员。选择未选中的组成员将取消选择该组中当前所选的 <code>Radio</code> 控件。
*@see laya.ui.RadioGroup
*/
//class laya.ui.Radio extends laya.ui.Button
var Radio=(function(_super){
	function Radio(skin,label){
		/**@private */
		this._value=null;
		(label===void 0)&& (label="");
		Radio.__super.call(this,skin,label);
	}

	__class(Radio,'laya.ui.Radio',_super);
	var __proto=Radio.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._value=null;
	}

	/**@inheritDoc */
	__proto.preinitialize=function(){
		laya.ui.UIComponent.prototype.preinitialize.call(this);
		this.toggle=false;
		this._autoSize=false;
	}

	/**@inheritDoc */
	__proto.initialize=function(){
		_super.prototype.initialize.call(this);
		this.createText();
		this._text.align="left";
		this._text.valign="top";
		this._text.width=0;
		this.on(/*laya.events.Event.CLICK*/"click",this,this.onClick);
	}

	/**
	*@private
	*对象的<code>Event.CLICK</code>事件侦听处理函数。
	*/
	__proto.onClick=function(e){
		this.selected=true;
	}

	/**
	*获取或设置 <code>Radio</code> 关联的可选用户定义值。
	*/
	__getset(0,__proto,'value',function(){
		return this._value !=null ? this._value :this.label;
		},function(obj){
		this._value=obj;
	});

	return Radio;
})(Button)


/**

*/
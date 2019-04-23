/**
*<code>/**
*<code>CommonScript</code> 类用于创建公共脚本类。
*/
//class laya.components.CommonScript extends laya.components.Component
var CommonScript=(function(_super){
	function CommonScript(){
		CommonScript.__super.call(this);
	}

	__class(CommonScript,'laya.components.CommonScript',_super);
	var __proto=CommonScript.prototype;
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

	return CommonScript;
})(Component)


/**
*文本的样式类
*/
//class laya.display.css.TextStyle extends laya.display.css.SpriteStyle
var TextStyle=(function(_super){
	function TextStyle(){
		/**
		*表示使用此文本格式的文本是否为斜体。
		*@default false
		*/
		this.italic=false;
		/**
		*<p>表示使用此文本格式的文本段落的水平对齐方式。</p>
		*@default "left"
		*/
		//this.align=null;
		/**
		*<p>表示使用此文本格式的文本字段是否自动换行。</p>
		*如果 wordWrap 的值为 true，则该文本字段自动换行；如果值为 false，则该文本字段不自动换行。
		*@default false。
		*/
		//this.wordWrap=false;
		/**
		*<p>垂直行间距（以像素为单位）</p>
		*/
		//this.leading=NaN;
		/**
		*<p>默认边距信息</p>
		*<p>[左边距，上边距，右边距，下边距]（边距以像素为单位）</p>
		*/
		//this.padding=null;
		/**
		*文本背景颜色，以字符串表示。
		*/
		//this.bgColor=null;
		/**
		*文本边框背景颜色，以字符串表示。
		*/
		//this.borderColor=null;
		/**
		*<p>指定文本字段是否是密码文本字段。</p>
		*如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。
		*/
		//this.asPassword=false;
		/**
		*<p>描边宽度（以像素为单位）。</p>
		*默认值0，表示不描边。
		*@default 0
		*/
		//this.stroke=NaN;
		/**
		*<p>描边颜色，以字符串表示。</p>
		*@default "#000000";
		*/
		//this.strokeColor=null;
		/**是否为粗体*/
		//this.bold=false;
		/**是否显示下划线*/
		//this.underline=false;
		/**下划线颜色*/
		//this.underlineColor=null;
		/**当前使用的位置字体。*/
		//this.currBitmapFont=null;
		TextStyle.__super.call(this);
	}

	__class(TextStyle,'laya.display.css.TextStyle',_super);
	var __proto=TextStyle.prototype;
	__proto.reset=function(){
		_super.prototype.reset.call(this);
		this.italic=false;
		this.align="left";
		this.wordWrap=false;
		this.leading=0;
		this.padding=[0,0,0,0];
		this.bgColor=null;
		this.borderColor=null;
		this.asPassword=false;
		this.stroke=0;
		this.strokeColor="#000000";
		this.bold=false;
		this.underline=false;
		this.underlineColor=null;
		this.currBitmapFont=null;
		return this;
	}

	__proto.recover=function(){
		if (this===TextStyle.EMPTY)
			return;
		Pool.recover("TextStyle",this.reset());
	}

	/**@inheritDoc */
	__proto.render=function(sprite,context,x,y){
		(this.bgColor || this.borderColor)&& context.drawRect(x,y,sprite.width,sprite.height,this.bgColor,this.borderColor,1);
	}

	TextStyle.create=function(){
		return Pool.getItemByClass("TextStyle",TextStyle);
	}

	TextStyle.EMPTY=new TextStyle();
	return TextStyle;
})(SpriteStyle)


/**

*/
*/
/**
*<code>TextInput</code> 类用于创建显示对象以显示和输入文本。
*
*@example <caption>以下示例代码，创建了一个 <code>TextInput</code> 实例。</caption>
*package
*{
	*import laya.display.Stage;
	*import laya.ui.TextInput;
	*import laya.utils.Handler;
	*public class TextInput_Example
	*{
		*public function TextInput_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/input.png"],Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*var textInput:TextInput=new TextInput("这是一个TextInput实例。");//创建一个 TextInput 类的实例对象 textInput 。
			*textInput.skin="resource/ui/input.png";//设置 textInput 的皮肤。
			*textInput.sizeGrid="4,4,4,4";//设置 textInput 的网格信息。
			*textInput.color="#008fff";//设置 textInput 的文本颜色。
			*textInput.font="Arial";//设置 textInput 的文本字体。
			*textInput.bold=true;//设置 textInput 的文本显示为粗体。
			*textInput.fontSize=30;//设置 textInput 的字体大小。
			*textInput.wordWrap=true;//设置 textInput 的文本自动换行。
			*textInput.x=100;//设置 textInput 对象的属性 x 的值，用于控制 textInput 对象的显示位置。
			*textInput.y=100;//设置 textInput 对象的属性 y 的值，用于控制 textInput 对象的显示位置。
			*textInput.width=300;//设置 textInput 的宽度。
			*textInput.height=200;//设置 textInput 的高度。
			*Laya.stage.addChild(textInput);//将 textInput 添加到显示列表。
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*Laya.loader.load(["resource/ui/input.png"],laya.utils.Handler.create(this,onLoadComplete));//加载资源。
*function onLoadComplete(){
	*var textInput=new laya.ui.TextInput("这是一个TextInput实例。");//创建一个 TextInput 类的实例对象 textInput 。
	*textInput.skin="resource/ui/input.png";//设置 textInput 的皮肤。
	*textInput.sizeGrid="4,4,4,4";//设置 textInput 的网格信息。
	*textInput.color="#008fff";//设置 textInput 的文本颜色。
	*textInput.font="Arial";//设置 textInput 的文本字体。
	*textInput.bold=true;//设置 textInput 的文本显示为粗体。
	*textInput.fontSize=30;//设置 textInput 的字体大小。
	*textInput.wordWrap=true;//设置 textInput 的文本自动换行。
	*textInput.x=100;//设置 textInput 对象的属性 x 的值，用于控制 textInput 对象的显示位置。
	*textInput.y=100;//设置 textInput 对象的属性 y 的值，用于控制 textInput 对象的显示位置。
	*textInput.width=300;//设置 textInput 的宽度。
	*textInput.height=200;//设置 textInput 的高度。
	*Laya.stage.addChild(textInput);//将 textInput 添加到显示列表。
	*}
*@example
*import Stage=laya.display.Stage;
*import TextInput=laya.ui.TextInput;
*import Handler=laya.utils.Handler;
*class TextInput_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/input.png"],Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*var textInput:TextInput=new TextInput("这是一个TextInput实例。");//创建一个 TextInput 类的实例对象 textInput 。
		*textInput.skin="resource/ui/input.png";//设置 textInput 的皮肤。
		*textInput.sizeGrid="4,4,4,4";//设置 textInput 的网格信息。
		*textInput.color="#008fff";//设置 textInput 的文本颜色。
		*textInput.font="Arial";//设置 textInput 的文本字体。
		*textInput.bold=true;//设置 textInput 的文本显示为粗体。
		*textInput.fontSize=30;//设置 textInput 的字体大小。
		*textInput.wordWrap=true;//设置 textInput 的文本自动换行。
		*textInput.x=100;//设置 textInput 对象的属性 x 的值，用于控制 textInput 对象的显示位置。
		*textInput.y=100;//设置 textInput 对象的属性 y 的值，用于控制 textInput 对象的显示位置。
		*textInput.width=300;//设置 textInput 的宽度。
		*textInput.height=200;//设置 textInput 的高度。
		*Laya.stage.addChild(textInput);//将 textInput 添加到显示列表。
		*}
	*}
*/
//class laya.ui.TextInput extends laya.ui.Label
var TextInput=(function(_super){
	function TextInput(text){
		/**@private */
		this._bg=null;
		/**@private */
		this._skin=null;
		TextInput.__super.call(this);
		(text===void 0)&& (text="");
		this.text=text;
		this.skin=this.skin;
	}

	__class(TextInput,'laya.ui.TextInput',_super);
	var __proto=TextInput.prototype;
	/**@inheritDoc */
	__proto.preinitialize=function(){
		this.mouseEnabled=true;
	}

	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._bg && this._bg.destroy();
		this._bg=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._tf=new Input());
		this._tf.padding=Styles.inputLabelPadding;
		this._tf.on(/*laya.events.Event.INPUT*/"input",this,this._onInput);
		this._tf.on(/*laya.events.Event.ENTER*/"enter",this,this._onEnter);
		this._tf.on(/*laya.events.Event.BLUR*/"blur",this,this._onBlur);
		this._tf.on(/*laya.events.Event.FOCUS*/"focus",this,this._onFocus);
	}

	/**
	*@private
	*/
	__proto._onFocus=function(){
		this.event(/*laya.events.Event.FOCUS*/"focus",this);
	}

	/**
	*@private
	*/
	__proto._onBlur=function(){
		this.event(/*laya.events.Event.BLUR*/"blur",this);
	}

	/**
	*@private
	*/
	__proto._onInput=function(){
		this.event(/*laya.events.Event.INPUT*/"input",this);
	}

	/**
	*@private
	*/
	__proto._onEnter=function(){
		this.event(/*laya.events.Event.ENTER*/"enter",this);
	}

	/**@inheritDoc */
	__proto.initialize=function(){
		this.width=128;
		this.height=22;
	}

	__proto._skinLoaded=function(){
		this._bg || (this.graphics=this._bg=new AutoBitmap());
		this._bg.source=Loader.getRes(this._skin);
		this._width && (this._bg.width=this._width);
		this._height && (this._bg.height=this._height);
		this._sizeChanged();
		this.event(/*laya.events.Event.LOADED*/"loaded");
	}

	/**选中输入框内的文本。*/
	__proto.select=function(){
		(this._tf).select();
	}

	__proto.setSelection=function(startIndex,endIndex){
		(this._tf).setSelection(startIndex,endIndex);
	}

	/**
	*当前文本内容字符串。
	*@see laya.display.Text.text
	*/
	__getset(0,__proto,'text',_super.prototype._$get_text,function(value){
		if (this._tf.text !=value){
			value=value+"";
			this._tf.text=value;
			this.event(/*laya.events.Event.CHANGE*/"change");
		}
	});

	/**
	*表示此对象包含的文本背景 <code>AutoBitmap</code> 组件实例。
	*/
	__getset(0,__proto,'bg',function(){
		return this._bg;
		},function(value){
		this.graphics=this._bg=value;
	});

	/**
	*<p>指示当前是否是文本域。</p>
	*值为true表示当前是文本域，否则不是文本域。
	*/
	__getset(0,__proto,'multiline',function(){
		return (this._tf).multiline;
		},function(value){
		(this._tf).multiline=value;
	});

	/**
	*@copy laya.ui.Image#skin
	*/
	__getset(0,__proto,'skin',function(){
		return this._skin;
		},function(value){
		if (this._skin !=value){
			this._skin=value;
			if (this._skin&&!Loader.getRes(this._skin)){
				Laya.loader.load(this._skin,Handler.create(this,this._skinLoaded),null,/*laya.net.Loader.IMAGE*/"image",1);
				}else{
				this._skinLoaded();
			}
		}
	});

	/**
	*<p>当前实例的背景图（ <code>AutoBitmap</code> ）实例的有效缩放网格数据。</p>
	*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
	*<ul><li>例如："4,4,4,4,1"</li></ul></p>
	*@see laya.ui.AutoBitmap.sizeGrid
	*/
	__getset(0,__proto,'sizeGrid',function(){
		return this._bg && this._bg.sizeGrid ? this._bg.sizeGrid.join(","):null;
		},function(value){
		this._bg || (this.graphics=this._bg=new AutoBitmap());
		this._bg.sizeGrid=UIUtils.fillArray(Styles.defaultSizeGrid,value,Number);
	});

	/**@inheritDoc */
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(Label,this,'width',value);
		this._bg && (this._bg.width=value);
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(Label,this,'height',value);
		this._bg && (this._bg.height=value);
	});

	/**
	*设置可编辑状态。
	*/
	__getset(0,__proto,'editable',function(){
		return (this._tf).editable;
		},function(value){
		(this._tf).editable=value;
	});

	/**限制输入的字符。*/
	__getset(0,__proto,'restrict',function(){
		return (this._tf).restrict;
		},function(pattern){
		(this._tf).restrict=pattern;
	});

	/**
	*@copy laya.display.Input#prompt
	*/
	__getset(0,__proto,'prompt',function(){
		return (this._tf).prompt;
		},function(value){
		(this._tf).prompt=value;
	});

	/**
	*@copy laya.display.Input#promptColor
	*/
	__getset(0,__proto,'promptColor',function(){
		return (this._tf).promptColor;
		},function(value){
		(this._tf).promptColor=value;
	});

	/**
	*@copy laya.display.Input#maxChars
	*/
	__getset(0,__proto,'maxChars',function(){
		return (this._tf).maxChars;
		},function(value){
		(this._tf).maxChars=value;
	});

	/**
	*@copy laya.display.Input#focus
	*/
	__getset(0,__proto,'focus',function(){
		return (this._tf).focus;
		},function(value){
		(this._tf).focus=value;
	});

	/**
	*@copy laya.display.Input#type
	*/
	__getset(0,__proto,'type',function(){
		return (this._tf).type;
		},function(value){
		(this._tf).type=value;
	});

	return TextInput;
})(Label)


/**

*/
/**
*<code>TextArea</code> 类用于创建显示对象以显示和输入文本。
*@example <caption>以下示例代码，创建了一个 <code>TextArea</code> 实例。</caption>
*package
*{
	*import laya.ui.TextArea;
	*import laya.utils.Handler;
	*public class TextArea_Example
	*{
		*public function TextArea_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/input.png"],Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*var textArea:TextArea=new TextArea("这个一个TextArea实例。");//创建一个 TextArea 类的实例对象 textArea 。
			*textArea.skin="resource/ui/input.png";//设置 textArea 的皮肤。
			*textArea.sizeGrid="4,4,4,4";//设置 textArea 的网格信息。
			*textArea.color="#008fff";//设置 textArea 的文本颜色。
			*textArea.font="Arial";//设置 textArea 的字体。
			*textArea.bold=true;//设置 textArea 的文本显示为粗体。
			*textArea.fontSize=20;//设置 textArea 的文本字体大小。
			*textArea.wordWrap=true;//设置 textArea 的文本自动换行。
			*textArea.x=100;//设置 textArea 对象的属性 x 的值，用于控制 textArea 对象的显示位置。
			*textArea.y=100;//设置 textArea 对象的属性 y 的值，用于控制 textArea 对象的显示位置。
			*textArea.width=300;//设置 textArea 的宽度。
			*textArea.height=200;//设置 textArea 的高度。
			*Laya.stage.addChild(textArea);//将 textArea 添加到显示列表。
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高、渲染模式
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*Laya.loader.load(["resource/ui/input.png"],laya.utils.Handler.create(this,onLoadComplete));//加载资源。
*function onLoadComplete(){
	*var textArea=new laya.ui.TextArea("这个一个TextArea实例。");//创建一个 TextArea 类的实例对象 textArea 。
	*textArea.skin="resource/ui/input.png";//设置 textArea 的皮肤。
	*textArea.sizeGrid="4,4,4,4";//设置 textArea 的网格信息。
	*textArea.color="#008fff";//设置 textArea 的文本颜色。
	*textArea.font="Arial";//设置 textArea 的字体。
	*textArea.bold=true;//设置 textArea 的文本显示为粗体。
	*textArea.fontSize=20;//设置 textArea 的文本字体大小。
	*textArea.wordWrap=true;//设置 textArea 的文本自动换行。
	*textArea.x=100;//设置 textArea 对象的属性 x 的值，用于控制 textArea 对象的显示位置。
	*textArea.y=100;//设置 textArea 对象的属性 y 的值，用于控制 textArea 对象的显示位置。
	*textArea.width=300;//设置 textArea 的宽度。
	*textArea.height=200;//设置 textArea 的高度。
	*Laya.stage.addChild(textArea);//将 textArea 添加到显示列表。
	*}
*@example
*import TextArea=laya.ui.TextArea;
*import Handler=laya.utils.Handler;
*class TextArea_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/input.png"],Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*var textArea:TextArea=new TextArea("这个一个TextArea实例。");//创建一个 TextArea 类的实例对象 textArea 。
		*textArea.skin="resource/ui/input.png";//设置 textArea 的皮肤。
		*textArea.sizeGrid="4,4,4,4";//设置 textArea 的网格信息。
		*textArea.color="#008fff";//设置 textArea 的文本颜色。
		*textArea.font="Arial";//设置 textArea 的字体。
		*textArea.bold=true;//设置 textArea 的文本显示为粗体。
		*textArea.fontSize=20;//设置 textArea 的文本字体大小。
		*textArea.wordWrap=true;//设置 textArea 的文本自动换行。
		*textArea.x=100;//设置 textArea 对象的属性 x 的值，用于控制 textArea 对象的显示位置。
		*textArea.y=100;//设置 textArea 对象的属性 y 的值，用于控制 textArea 对象的显示位置。
		*textArea.width=300;//设置 textArea 的宽度。
		*textArea.height=200;//设置 textArea 的高度。
		*Laya.stage.addChild(textArea);//将 textArea 添加到显示列表。
		*}
	*}
*/
//class laya.ui.TextArea extends laya.ui.TextInput
var TextArea=(function(_super){
	function TextArea(text){
		/**@private */
		this._vScrollBar=null;
		/**@private */
		this._hScrollBar=null;
		(text===void 0)&& (text="");
		TextArea.__super.call(this,text);
		this.on(/*laya.events.Event.CHANGE*/"change",this,this._onTextChange);
	}

	__class(TextArea,'laya.ui.TextArea',_super);
	var __proto=TextArea.prototype;
	__proto._onTextChange=function(){
		this.callLater(this.changeScroll);
	}

	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._vScrollBar && this._vScrollBar.destroy();
		this._hScrollBar && this._hScrollBar.destroy();
		this._vScrollBar=null;
		this._hScrollBar=null;
	}

	__proto.initialize=function(){
		this.width=180;
		this.height=150;
		this._tf.wordWrap=true;
		this.multiline=true;
	}

	__proto.onVBarChanged=function(e){
		if (this._tf.scrollY !=this._vScrollBar.value){
			this._tf.scrollY=this._vScrollBar.value;
		}
	}

	__proto.onHBarChanged=function(e){
		if (this._tf.scrollX !=this._hScrollBar.value){
			this._tf.scrollX=this._hScrollBar.value;
		}
	}

	__proto.changeScroll=function(){
		var vShow=this._vScrollBar && this._tf.maxScrollY > 0;
		var hShow=this._hScrollBar && this._tf.maxScrollX > 0;
		var showWidth=vShow ? this._width-this._vScrollBar.width :this._width;
		var showHeight=hShow ? this._height-this._hScrollBar.height :this._height;
		var padding=this._tf.padding || Styles.labelPadding;
		this._tf.width=showWidth;
		this._tf.height=showHeight;
		if (this._vScrollBar){
			this._vScrollBar.x=this._width-this._vScrollBar.width-padding[2];
			this._vScrollBar.y=padding[1];
			this._vScrollBar.height=this._height-(hShow ? this._hScrollBar.height :0)-padding[1]-padding[3];
			this._vScrollBar.scrollSize=1;
			this._vScrollBar.thumbPercent=showHeight / Math.max(this._tf.textHeight,showHeight);
			this._vScrollBar.setScroll(1,this._tf.maxScrollY,this._tf.scrollY);
			this._vScrollBar.visible=vShow;
		}
		if (this._hScrollBar){
			this._hScrollBar.x=padding[0];
			this._hScrollBar.y=this._height-this._hScrollBar.height-padding[3];
			this._hScrollBar.width=this._width-(vShow ? this._vScrollBar.width :0)-padding[0]-padding[2];
			this._hScrollBar.scrollSize=Math.max(showWidth *0.033,1);
			this._hScrollBar.thumbPercent=showWidth / Math.max(this._tf.textWidth,showWidth);
			this._hScrollBar.setScroll(0,this.maxScrollX,this.scrollX);
			this._hScrollBar.visible=hShow;
		}
	}

	/**滚动到某个位置*/
	__proto.scrollTo=function(y){
		this.commitMeasure();
		this._tf.scrollY=y;
	}

	/**垂直滚动值*/
	__getset(0,__proto,'scrollY',function(){
		return this._tf.scrollY;
	});

	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(TextInput,this,'width',value);
		this.callLater(this.changeScroll);
	});

	/**水平滚动条实体*/
	__getset(0,__proto,'hScrollBar',function(){
		return this._hScrollBar;
	});

	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(TextInput,this,'height',value);
		this.callLater(this.changeScroll);
	});

	/**水平滚动最大值*/
	__getset(0,__proto,'maxScrollX',function(){
		return this._tf.maxScrollX;
	});

	/**垂直滚动条皮肤*/
	__getset(0,__proto,'vScrollBarSkin',function(){
		return this._vScrollBar ? this._vScrollBar.skin :null;
		},function(value){
		if (this._vScrollBar==null){
			this.addChild(this._vScrollBar=new VScrollBar());
			this._vScrollBar.on(/*laya.events.Event.CHANGE*/"change",this,this.onVBarChanged);
			this._vScrollBar.target=this._tf;
			this.callLater(this.changeScroll);
		}
		this._vScrollBar.skin=value;
	});

	/**水平滚动条皮肤*/
	__getset(0,__proto,'hScrollBarSkin',function(){
		return this._hScrollBar ? this._hScrollBar.skin :null;
		},function(value){
		if (this._hScrollBar==null){
			this.addChild(this._hScrollBar=new HScrollBar());
			this._hScrollBar.on(/*laya.events.Event.CHANGE*/"change",this,this.onHBarChanged);
			this._hScrollBar.mouseWheelEnable=false;
			this._hScrollBar.target=this._tf;
			this.callLater(this.changeScroll);
		}
		this._hScrollBar.skin=value;
	});

	/**垂直滚动条实体*/
	__getset(0,__proto,'vScrollBar',function(){
		return this._vScrollBar;
	});

	/**垂直滚动最大值*/
	__getset(0,__proto,'maxScrollY',function(){
		return this._tf.maxScrollY;
	});

	/**水平滚动值*/
	__getset(0,__proto,'scrollX',function(){
		return this._tf.scrollX;
	});

	return TextArea;
})(TextInput)


/**

*/
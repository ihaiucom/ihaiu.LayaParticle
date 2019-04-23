/**
*<code>Button</code> 组件用来表示常用的多态按钮。 <code>Button</code> 组件可显示文本标签、图标或同时显示两者。 *
*<p>可以是单态，两态和三态，默认三态(up,over,down)。</p>
*
*@example <caption>以下示例代码，创建了一个 <code>Button</code> 实例。</caption>
*package
*{
	*import laya.ui.Button;
	*import laya.utils.Handler;
	*public class Button_Example
	*{
		*public function Button_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load("resource/ui/button.png",Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*trace("资源加载完成！");
			*var button:Button=new Button("resource/ui/button.png","label");//创建一个 Button 类的实例对象 button ,并传入它的皮肤。
			*button.x=100;//设置 button 对象的属性 x 的值，用于控制 button 对象的显示位置。
			*button.y=100;//设置 button 对象的属性 y 的值，用于控制 button 对象的显示位置。
			*button.clickHandler=new Handler(this,onClickButton,[button]);//设置 button 的点击事件处理器。
			*Laya.stage.addChild(button);//将此 button 对象添加到显示列表。
			*}
		*private function onClickButton(button:Button):void
		*{
			*trace("按钮button被点击了！");
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
*Laya.loader.load("resource/ui/button.png",laya.utils.Handler.create(this,loadComplete));//加载资源
*function loadComplete()
*{
	*console.log("资源加载完成！");
	*var button=new laya.ui.Button("resource/ui/button.png","label");//创建一个 Button 类的实例对象 button ,传入它的皮肤skin和标签label。
	*button.x=100;//设置 button 对象的属性 x 的值，用于控制 button 对象的显示位置。
	*button.y=100;//设置 button 对象的属性 y 的值，用于控制 button 对象的显示位置。
	*button.clickHandler=laya.utils.Handler.create(this,onClickButton,[button],false);//设置 button 的点击事件处理函数。
	*Laya.stage.addChild(button);//将此 button 对象添加到显示列表。
	*}
*function onClickButton(button)
*{
	*console.log("按钮被点击了。",button);
	*}
*@example
*import Button=laya.ui.Button;
*import Handler=laya.utils.Handler;
*class Button_Example{
	*constructor()
	*{
		*Laya.init(640,800);
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load("resource/ui/button.png",laya.utils.Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete()
	*{
		*var button:Button=new Button("resource/ui/button.png","label");//创建一个 Button 类的实例对象 button ,并传入它的皮肤。
		*button.x=100;//设置 button 对象的属性 x 的值，用于控制 button 对象的显示位置。
		*button.y=100;//设置 button 对象的属性 y 的值，用于控制 button 对象的显示位置。
		*button.clickHandler=new Handler(this,this.onClickButton,[button]);//设置 button 的点击事件处理器。
		*Laya.stage.addChild(button);//将此 button 对象添加到显示列表。
		*}
	*private onClickButton(button:Button):void
	*{
		*console.log("按钮button被点击了！")
		*}
	*}
*/
//class laya.ui.Button extends laya.ui.UIComponent
var Button=(function(_super){
	function Button(skin,label){
		/**
		*指定按钮按下时是否是切换按钮的显示状态。
		*
		*@example 以下示例代码，创建了一个 <code>Button</code> 实例，并设置为切换按钮。
		*@example
		*package
		*{
			*import laya.ui.Button;
			*import laya.utils.Handler;
			*public class Button_toggle
			*{
				*public function Button_toggle()
				*{
					*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
					*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
					*Laya.loader.load("resource/ui/button.png",Handler.create(this,onLoadComplete));
					*}
				*private function onLoadComplete():void
				*{
					*trace("资源加载完成！");
					*var button:Button=new Button("resource/ui/button.png","label");//创建一个 Button 实例对象 button ,传入它的皮肤skin和标签label。
					*button.x=100;//设置 button 对象的属性 x 的值，用于控制 button 对象的显示位置。
					*button.y=100;//设置 button 对象的属性 y 的值，用于控制 button 对象的显示位置。
					*button.toggle=true;//设置 button 对象为切换按钮。
					*button.clickHandler=new Handler(this,onClickButton,[button]);//设置 button 的点击事件处理器。
					*Laya.stage.addChild(button);//将此 button 对象添加到显示列表。
					*}
				*private function onClickButton(button:Button):void
				*{
					*trace("button.selected = "+button.selected);
					*}
				*}
			*}
		*@example
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load("resource/ui/button.png",laya.utils.Handler.create(this,loadComplete));//加载资源
		*function loadComplete()
		*{
			*console.log("资源加载完成！");
			*var button=new laya.ui.Button("resource/ui/button.png","label");//创建一个 Button 类的实例对象 button ,传入它的皮肤skin和标签label。
			*button.x=100;//设置 button 对象的属性 x 的值，用于控制 button 对象的显示位置。
			*button.y=100;//设置 button 对象的属性 y 的值，用于控制 button 对象的显示位置。
			*button.toggle=true;//设置 button 对象为切换按钮。
			*button.clickHandler=laya.utils.Handler.create(this,onClickButton,[button],false);//设置 button 的点击事件处理器。
			*Laya.stage.addChild(button);//将此 button 对象添加到显示列表。
			*}
		*function onClickButton(button)
		*{
			*console.log("button.selected = ",button.selected);
			*}
		*@example
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load("button.png",null,null,null,null,null);//加载资源
		*function loadComplete(){
			*console.log("资源加载完成！");
			*var button:laya.ui.Button=new laya.ui.Button("button.png","label");//创建一个 Button 类的实例对象 button ,传入它的皮肤skin和标签label。
			*button.x=100;//设置 button 对象的属性 x 的值，用于控制 button 对象的显示位置。
			*button.y=100;//设置 button 对象的属性 y 的值，用于控制 button 对象的显示位置。
			*button.toggle=true;//设置 button 对象为切换按钮。
			*button.clickHandler=laya.utils.Handler.create(this,onClickButton,[button],false);//设置 button 的点击事件处理器。
			*Laya.stage.addChild(button);//将此 button 对象添加到显示列表。
			*}
		*function onClickButton(button){
			*console.log("button.selected = ",button.selected);
			*}
		*/
		this.toggle=false;
		/**
		*@private
		*/
		this._bitmap=null;
		/**
		*@private
		*按钮上的文本。
		*/
		this._text=null;
		/**
		*@private
		*按钮文本标签描边的颜色值。
		*/
		this._strokeColors=null;
		/**
		*@private
		*按钮的状态值。
		*/
		this._state=0;
		/**
		*@private
		*表示按钮的选中状态。
		*/
		this._selected=false;
		/**
		*@private
		*按钮的皮肤资源。
		*/
		this._skin=null;
		/**
		*@private
		*指定此显示对象是否自动计算并改变大小等属性。
		*/
		this._autoSize=true;
		/**
		*@private
		*源数据。
		*/
		this._sources=null;
		/**
		*@private
		*按钮的点击事件函数。
		*/
		this._clickHandler=null;
		/**
		*@private
		*/
		this._stateChanged=false;
		Button.__super.call(this);
		this._labelColors=Styles.buttonLabelColors;
		this._stateNum=Styles.buttonStateNum;
		(label===void 0)&& (label="");
		this.skin=skin;
		this.label=label;
	}

	__class(Button,'laya.ui.Button',_super);
	var __proto=Button.prototype;
	Laya.imps(__proto,{"laya.ui.ISelect":true})
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._bitmap && this._bitmap.destroy();
		this._text && this._text.destroy(destroyChild);
		this._bitmap=null;
		this._text=null;
		this._clickHandler=null;
		this._labelColors=this._sources=this._strokeColors=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.graphics=this._bitmap=new AutoBitmap();
	}

	/**@private */
	__proto.createText=function(){
		if (!this._text){
			this._text=new Text();
			this._text.overflow=/*laya.display.Text.HIDDEN*/"hidden";
			this._text.align="center";
			this._text.valign="middle";
			this._text.width=this._width;
			this._text.height=this._height;
		}
	}

	/**@inheritDoc */
	__proto.initialize=function(){
		if (this._mouseState!==1){
			this.mouseEnabled=true;
			this._setBit(/*laya.Const.HAS_MOUSE*/0x40,true);
		}
		this._createListener(/*laya.events.Event.MOUSE_OVER*/"mouseover",this,this.onMouse,null,false,false);
		this._createListener(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onMouse,null,false,false);
		this._createListener(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onMouse,null,false,false);
		this._createListener(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.onMouse,null,false,false);
		this._createListener(/*laya.events.Event.CLICK*/"click",this,this.onMouse,null,false,false);
	}

	/**
	*对象的 <code>Event.MOUSE_OVER、Event.MOUSE_OUT、Event.MOUSE_DOWN、Event.MOUSE_UP、Event.CLICK</code> 事件侦听处理函数。
	*@param e Event 对象。
	*/
	__proto.onMouse=function(e){
		if (this.toggle===false && this._selected)return;
		if (e.type===/*laya.events.Event.CLICK*/"click"){
			this.toggle && (this.selected=!this._selected);
			this._clickHandler && this._clickHandler.run();
			return;
		}
		!this._selected && (this.state=Button.stateMap[e.type]);
	}

	__proto._skinLoaded=function(){
		this.callLater(this.changeClips);
		this._setStateChanged();
		this._sizeChanged();
		this.event(/*laya.events.Event.LOADED*/"loaded");
	}

	/**
	*@private
	*对象的资源切片发生改变。
	*/
	__proto.changeClips=function(){
		var img=Loader.getRes(this._skin);
		if (!img){
			console.log("lose skin",this._skin);
			return;
		};
		var width=img.sourceWidth;
		var height=img.sourceHeight / this._stateNum;
		img.$_GID || (img.$_GID=Utils.getGID());
		var key=img.$_GID+"-"+this._stateNum;
		var clips=WeakObject.I.get(key);
		if (!Utils.isOkTextureList(clips)){
			clips=null;
		}
		if (clips)this._sources=clips;
		else {
			this._sources=[];
			if (this._stateNum===1){
				this._sources.push(img);
				}else {
				for (var i=0;i < this._stateNum;i++){
					this._sources.push(Texture.createFromTexture(img,0,height *i,width,height));
				}
			}
			WeakObject.I.set(key,this._sources);
		}
		if (this._autoSize){
			this._bitmap.width=this._width || width;
			this._bitmap.height=this._height || height;
			if (this._text){
				this._text.width=this._bitmap.width;
				this._text.height=this._bitmap.height;
			}
			}else {
			this._text && (this._text.x=width);
		}
	}

	/**
	*@inheritDoc
	*/
	__proto.measureWidth=function(){
		this.runCallLater(this.changeClips);
		if (this._autoSize)return this._bitmap.width;
		this.runCallLater(this.changeState);
		return this._bitmap.width+(this._text ? this._text.width :0);
	}

	/**
	*@inheritDoc
	*/
	__proto.measureHeight=function(){
		this.runCallLater(this.changeClips);
		return this._text ? Math.max(this._bitmap.height,this._text.height):this._bitmap.height;
	}

	/**
	*@private
	*改变对象的状态。
	*/
	__proto.changeState=function(){
		this._stateChanged=false;
		this.runCallLater(this.changeClips);
		var index=this._state < this._stateNum ? this._state :this._stateNum-1;
		this._sources && (this._bitmap.source=this._sources[index]);
		if (this.label){
			this._text.color=this._labelColors[index];
			if (this._strokeColors)this._text.strokeColor=this._strokeColors[index];
		}
	}

	/**@private */
	__proto._setStateChanged=function(){
		if (!this._stateChanged){
			this._stateChanged=true;
			this.callLater(this.changeState);
		}
	}

	/**
	*<p>对象的皮肤资源地址。</p>
	*支持单态，两态和三态，用 <code>stateNum</code> 属性设置
	*<p>对象的皮肤地址，以字符串表示。</p>
	*@see #stateNum
	*/
	__getset(0,__proto,'skin',function(){
		return this._skin;
		},function(value){
		if (this._skin !=value){
			this._skin=value;
			if (value){
				if (!Loader.getRes(value)){
					Laya.loader.load(this._skin,Handler.create(this,this._skinLoaded),null,/*laya.net.Loader.IMAGE*/"image",1);
					}else{
					this._skinLoaded();
				}
				}else {
				this._skinLoaded();
			}
		}
	});

	/**
	*表示按钮文本标签的边距。
	*<p><b>格式：</b>"上边距,右边距,下边距,左边距"。</p>
	*/
	__getset(0,__proto,'labelPadding',function(){
		this.createText();
		return this._text.padding.join(",");
		},function(value){
		this.createText();
		this._text.padding=UIUtils.fillArray(Styles.labelPadding,value,Number);
	});

	/**
	*对象的状态值。
	*@see #stateMap
	*/
	__getset(0,__proto,'state',function(){
		return this._state;
		},function(value){
		if (this._state !=value){
			this._state=value;
			this._setStateChanged();
		}
	});

	/**
	*按钮文本标签 <code>Text</code> 控件。
	*/
	__getset(0,__proto,'text',function(){
		this.createText();
		return this._text;
	});

	/**
	*<p>指定对象的状态值，以数字表示。</p>
	*<p>默认值为3。此值决定皮肤资源图片的切割方式。</p>
	*<p><b>取值：</b>
	*<li>1：单态。图片不做切割，按钮的皮肤状态只有一种。</li>
	*<li>2：两态。图片将以竖直方向被等比切割为2部分，从上向下，依次为
	*弹起状态皮肤、
	*按下和经过及选中状态皮肤。</li>
	*<li>3：三态。图片将以竖直方向被等比切割为3部分，从上向下，依次为
	*弹起状态皮肤、
	*经过状态皮肤、
	*按下和选中状态皮肤</li>
	*</p>
	*/
	__getset(0,__proto,'stateNum',function(){
		return this._stateNum;
		},function(value){
		if ((typeof value=='string')){
			value=parseInt(value);
		}
		if (this._stateNum !=value){
			this._stateNum=value < 1 ? 1 :value > 3 ? 3 :value;
			this.callLater(this.changeClips);
		}
	});

	/**
	*按钮的文本内容。
	*/
	__getset(0,__proto,'label',function(){
		return this._text ? this._text.text :null;
		},function(value){
		if (!this._text && !value)return;
		this.createText();
		if (this._text.text !=value){
			value && !this._text.parent && this.addChild(this._text);
			this._text.text=(value+"").replace(/\\n/g,"\n");
			this._setStateChanged();
		}
	});

	/**
	*表示按钮文本标签的字体大小。
	*@see laya.display.Text.fontSize()
	*/
	__getset(0,__proto,'labelSize',function(){
		this.createText();
		return this._text.fontSize;
		},function(value){
		this.createText();
		this._text.fontSize=value
	});

	/**
	*表示按钮的选中状态。
	*<p>如果值为true，表示该对象处于选中状态。否则该对象处于未选中状态。</p>
	*/
	__getset(0,__proto,'selected',function(){
		return this._selected;
		},function(value){
		if (this._selected !=value){
			this._selected=value;
			this.state=this._selected ? 2 :0;
			this.event(/*laya.events.Event.CHANGE*/"change");
		}
	});

	/**
	*表示按钮各个状态下的描边颜色。
	*<p><b>格式:</b> "upColor,overColor,downColor,disableColor"。</p>
	*/
	__getset(0,__proto,'strokeColors',function(){
		return this._strokeColors ? this._strokeColors.join(","):"";
		},function(value){
		this._strokeColors=UIUtils.fillArray(Styles.buttonLabelColors,value,String);
		this._setStateChanged();
	});

	/**
	*表示按钮各个状态下的文本颜色。
	*<p><b>格式:</b> "upColor,overColor,downColor,disableColor"。</p>
	*/
	__getset(0,__proto,'labelColors',function(){
		return this._labelColors.join(",");
		},function(value){
		this._labelColors=UIUtils.fillArray(Styles.buttonLabelColors,value,String);
		this._setStateChanged();
	});

	/**
	*<p>描边宽度（以像素为单位）。</p>
	*默认值0，表示不描边。
	*@see laya.display.Text.stroke()
	*/
	__getset(0,__proto,'labelStroke',function(){
		this.createText();
		return this._text.stroke;
		},function(value){
		this.createText();
		this._text.stroke=value
	});

	/**
	*<p>描边颜色，以字符串表示。</p>
	*默认值为 "#000000"（黑色）;
	*@see laya.display.Text.strokeColor()
	*/
	__getset(0,__proto,'labelStrokeColor',function(){
		this.createText();
		return this._text.strokeColor;
		},function(value){
		this.createText();
		this._text.strokeColor=value
	});

	/**
	*表示按钮文本标签是否为粗体字。
	*@see laya.display.Text.bold()
	*/
	__getset(0,__proto,'labelBold',function(){
		this.createText();
		return this._text.bold;
		},function(value){
		this.createText();
		this._text.bold=value;
	});

	/**
	*表示按钮文本标签的字体名称，以字符串形式表示。
	*@see laya.display.Text.font()
	*/
	__getset(0,__proto,'labelFont',function(){
		this.createText();
		return this._text.font;
		},function(value){
		this.createText();
		this._text.font=value;
	});

	/**标签对齐模式，默认为居中对齐。*/
	__getset(0,__proto,'labelAlign',function(){
		this.createText()
		return this._text.align;
		},function(value){
		this.createText()
		this._text.align=value;
	});

	/**
	*对象的点击事件处理器函数（无默认参数）。
	*/
	__getset(0,__proto,'clickHandler',function(){
		return this._clickHandler;
		},function(value){
		this._clickHandler=value;
	});

	/**
	*<p>当前实例的位图 <code>AutoImage</code> 实例的有效缩放网格数据。</p>
	*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
	*<ul><li>例如："4,4,4,4,1"</li></ul></p>
	*@see laya.ui.AutoBitmap.sizeGrid
	*/
	__getset(0,__proto,'sizeGrid',function(){
		if (this._bitmap.sizeGrid)return this._bitmap.sizeGrid.join(",");
		return null;
		},function(value){
		this._bitmap.sizeGrid=UIUtils.fillArray(Styles.defaultSizeGrid,value,Number);
	});

	/**@inheritDoc */
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(UIComponent,this,'width',value);
		if (this._autoSize){
			this._bitmap.width=value;
			this._text && (this._text.width=value);
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(UIComponent,this,'height',value);
		if (this._autoSize){
			this._bitmap.height=value;
			this._text && (this._text.height=value);
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if ((typeof value=='number')|| (typeof value=='string'))this.label=value+"";
		else Laya.superSet(UIComponent,this,'dataSource',value);
	});

	/**图标x,y偏移，格式：100,100*/
	__getset(0,__proto,'iconOffset',function(){
		return this._bitmap._offset ? this._bitmap._offset.join(","):null;
		},function(value){
		if (value)this._bitmap._offset=UIUtils.fillArray([1,1],value,Number);
		else this._bitmap._offset=[];
	});

	__static(Button,
	['stateMap',function(){return this.stateMap={"mouseup":0,"mouseover":1,"mousedown":2,"mouseout":0};}
	]);
	return Button;
})(UIComponent)


/**

*/
/**
*<code>ColorPicker</code> 组件将显示包含多个颜色样本的列表，用户可以从中选择颜色。
*
*@example <caption>以下示例代码，创建了一个 <code>ColorPicker</code> 实例。</caption>
*package
*{
	*import laya.ui.ColorPicker;
	*import laya.utils.Handler;
	*public class ColorPicker_Example
	*{
		*public function ColorPicker_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load("resource/ui/color.png",Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*trace("资源加载完成！");
			*var colorPicket:ColorPicker=new ColorPicker();//创建一个 ColorPicker 类的实例对象 colorPicket 。
			*colorPicket.skin="resource/ui/color.png";//设置 colorPicket 的皮肤。
			*colorPicket.x=100;//设置 colorPicket 对象的属性 x 的值，用于控制 colorPicket 对象的显示位置。
			*colorPicket.y=100;//设置 colorPicket 对象的属性 y 的值，用于控制 colorPicket 对象的显示位置。
			*colorPicket.changeHandler=new Handler(this,onChangeColor,[colorPicket]);//设置 colorPicket 的颜色改变回调函数。
			*Laya.stage.addChild(colorPicket);//将此 colorPicket 对象添加到显示列表。
			*}
		*private function onChangeColor(colorPicket:ColorPicker):void
		*{
			*trace("当前选择的颜色： "+colorPicket.selectedColor);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*Laya.loader.load("resource/ui/color.png",laya.utils.Handler.create(this,loadComplete));//加载资源
*function loadComplete()
*{
	*console.log("资源加载完成！");
	*var colorPicket=new laya.ui.ColorPicker();//创建一个 ColorPicker 类的实例对象 colorPicket 。
	*colorPicket.skin="resource/ui/color.png";//设置 colorPicket 的皮肤。
	*colorPicket.x=100;//设置 colorPicket 对象的属性 x 的值，用于控制 colorPicket 对象的显示位置。
	*colorPicket.y=100;//设置 colorPicket 对象的属性 y 的值，用于控制 colorPicket 对象的显示位置。
	*colorPicket.changeHandler=laya.utils.Handler.create(this,onChangeColor,[colorPicket],false);//设置 colorPicket 的颜色改变回调函数。
	*Laya.stage.addChild(colorPicket);//将此 colorPicket 对象添加到显示列表。
	*}
*function onChangeColor(colorPicket)
*{
	*console.log("当前选择的颜色： "+colorPicket.selectedColor);
	*}
*@example
*import ColorPicker=laya.ui.ColorPicker;
*import Handler=laya.utils.Handler;
*class ColorPicker_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load("resource/ui/color.png",Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*console.log("资源加载完成！");
		*var colorPicket:ColorPicker=new ColorPicker();//创建一个 ColorPicker 类的实例对象 colorPicket 。
		*colorPicket.skin="resource/ui/color.png";//设置 colorPicket 的皮肤。
		*colorPicket.x=100;//设置 colorPicket 对象的属性 x 的值，用于控制 colorPicket 对象的显示位置。
		*colorPicket.y=100;//设置 colorPicket 对象的属性 y 的值，用于控制 colorPicket 对象的显示位置。
		*colorPicket.changeHandler=new Handler(this,this.onChangeColor,[colorPicket]);//设置 colorPicket 的颜色改变回调函数。
		*Laya.stage.addChild(colorPicket);//将此 colorPicket 对象添加到显示列表。
		*}
	*private onChangeColor(colorPicket:ColorPicker):void {
		*console.log("当前选择的颜色： "+colorPicket.selectedColor);
		*}
	*}
*/
//class laya.ui.ColorPicker extends laya.ui.UIComponent
var ColorPicker=(function(_super){
	function ColorPicker(){
		/**
		*当颜色发生改变时执行的函数处理器。
		*默认返回参数color：颜色值字符串。
		*/
		this.changeHandler=null;
		/**
		*@private
		*指定每个正方形的颜色小格子的宽高（以像素为单位）。
		*/
		this._gridSize=11;
		/**
		*@private
		*表示颜色样本列表面板的背景颜色值。
		*/
		this._bgColor="#ffffff";
		/**
		*@private
		*表示颜色样本列表面板的边框颜色值。
		*/
		this._borderColor="#000000";
		/**
		*@private
		*表示颜色样本列表面板选择或输入的颜色值。
		*/
		this._inputColor="#000000";
		/**
		*@private
		*表示颜色输入框的背景颜色值。
		*/
		this._inputBgColor="#efefef";
		/**
		*@private
		*表示颜色样本列表面板。
		*/
		this._colorPanel=null;
		/**
		*@private
		*表示颜色网格。
		*/
		this._colorTiles=null;
		/**
		*@private
		*表示颜色块显示对象。
		*/
		this._colorBlock=null;
		/**
		*@private
		*表示颜色输入框控件 <code>Input</code> 。
		*/
		this._colorInput=null;
		/**
		*@private
		*表示点击后显示颜色样本列表面板的按钮控件 <code>Button</code> 。
		*/
		this._colorButton=null;
		/**
		*@private
		*表示颜色值列表。
		*/
		this._colors=[];
		/**
		*@private
		*表示选择的颜色值。
		*/
		this._selectedColor="#000000";
		/**@private */
		this._panelChanged=false;
		ColorPicker.__super.call(this);
	}

	__class(ColorPicker,'laya.ui.ColorPicker',_super);
	var __proto=ColorPicker.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._colorPanel && this._colorPanel.destroy(destroyChild);
		this._colorButton && this._colorButton.destroy(destroyChild);
		this._colorPanel=null;
		this._colorTiles=null;
		this._colorBlock=null;
		this._colorInput=null;
		this._colorButton=null;
		this._colors=null;
		this.changeHandler=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._colorButton=new Button());
		this._colorPanel=new Box();
		this._colorPanel.size(230,166);
		this._colorPanel.addChild(this._colorTiles=new Sprite());
		this._colorPanel.addChild(this._colorBlock=new Sprite());
		this._colorPanel.addChild(this._colorInput=new Input());
	}

	/**@inheritDoc */
	__proto.initialize=function(){
		this._colorButton.on(/*laya.events.Event.CLICK*/"click",this,this.onColorButtonClick);
		this._colorBlock.pos(5,5);
		this._colorInput.pos(60,5);
		this._colorInput.size(60,20);
		this._colorInput.on(/*laya.events.Event.CHANGE*/"change",this,this.onColorInputChange);
		this._colorInput.on(/*laya.events.Event.KEY_DOWN*/"keydown",this,this.onColorFieldKeyDown);
		this._colorTiles.pos(5,30);
		this._colorTiles.on(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this,this.onColorTilesMouseMove);
		this._colorTiles.on(/*laya.events.Event.CLICK*/"click",this,this.onColorTilesClick);
		this._colorTiles.size(20 *this._gridSize,12 *this._gridSize);
		this._colorPanel.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onPanelMouseDown);
		this.bgColor=this._bgColor;
	}

	__proto.onPanelMouseDown=function(e){
		e.stopPropagation();
	}

	/**
	*改变颜色样本列表面板。
	*/
	__proto.changePanel=function(){
		this._panelChanged=false;
		var g=this._colorPanel.graphics;
		g.clear(true);
		g.drawRect(0,0,230,166,this._bgColor,this._borderColor);
		this.drawBlock(this._selectedColor);
		this._colorInput.borderColor=this._borderColor;
		this._colorInput.bgColor=this._inputBgColor;
		this._colorInput.color=this._inputColor;
		g=this._colorTiles.graphics;
		g.clear(true);
		var mainColors=[0x000000,0x333333,0x666666,0x999999,0xCCCCCC,0xFFFFFF,0xFF0000,0x00FF00,0x0000FF,0xFFFF00,0x00FFFF,0xFF00FF];
		for (var i=0;i < 12;i++){
			for (var j=0;j < 20;j++){
				var color=0;
				if (j===0)color=mainColors[i];
				else if (j===1)color=0x000000;
				else color=(((i *3+j / 6)% 3 << 0)+((i / 6)<< 0)*3)*0x33 << 16 | j % 6 *0x33 << 8 | (i << 0)% 6 *0x33;
				var strColor=UIUtils.toColor(color);
				this._colors.push(strColor);
				var x=j *this._gridSize;
				var y=i *this._gridSize;
				g.drawRect(x,y,this._gridSize,this._gridSize,strColor,"#000000");
			}
		}
	}

	/**
	*颜色样本列表面板的显示按钮的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
	*/
	__proto.onColorButtonClick=function(e){
		if (this._colorPanel.parent)this.close();
		else this.open();
	}

	/**
	*打开颜色样本列表面板。
	*/
	__proto.open=function(){
		var p=this.localToGlobal(new Point());
		var px=p.x+this._colorPanel.width <=Laya.stage.width ? p.x :Laya.stage.width-this._colorPanel.width;
		var py=p.y+this._colorButton.height;
		py=py+this._colorPanel.height <=Laya.stage.height ? py :p.y-this._colorPanel.height;
		this._colorPanel.pos(px,py);
		this._colorPanel.zOrder=1001;
		Laya._currentStage.addChild(this._colorPanel);
		Laya.stage.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.removeColorBox);
	}

	/**
	*关闭颜色样本列表面板。
	*/
	__proto.close=function(){
		Laya.stage.off(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.removeColorBox);
		this._colorPanel.removeSelf();
	}

	/**
	*舞台的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
	*/
	__proto.removeColorBox=function(e){
		this.close();
	}

	/**
	*小格子色块的 <code>Event.KEY_DOWN</code> 事件侦听处理函数。
	*/
	__proto.onColorFieldKeyDown=function(e){
		if (e.keyCode==13){
			if (this._colorInput.text)this.selectedColor=this._colorInput.text;
			else this.selectedColor=null;
			this.close();
			e.stopPropagation();
		}
	}

	/**
	*颜色值输入框 <code>Event.CHANGE</code> 事件侦听处理函数。
	*/
	__proto.onColorInputChange=function(e){
		if (this._colorInput.text)this.drawBlock(this._colorInput.text);
		else this.drawBlock("#FFFFFF");
	}

	/**
	*小格子色块的 <code>Event.CLICK</code> 事件侦听处理函数。
	*/
	__proto.onColorTilesClick=function(e){
		this.selectedColor=this.getColorByMouse();
		this.close();
	}

	/**
	*@private
	*小格子色块的 <code>Event.MOUSE_MOVE</code> 事件侦听处理函数。
	*/
	__proto.onColorTilesMouseMove=function(e){
		this._colorInput.focus=false;
		var color=this.getColorByMouse();
		this._colorInput.text=color;
		this.drawBlock(color);
	}

	/**
	*通过鼠标位置取对应的颜色块的颜色值。
	*/
	__proto.getColorByMouse=function(){
		var point=this._colorTiles.getMousePoint();
		var x=Math.floor(point.x / this._gridSize);
		var y=Math.floor(point.y / this._gridSize);
		return this._colors[y *20+x];
	}

	/**
	*绘制颜色块。
	*@param color 需要绘制的颜色块的颜色值。
	*/
	__proto.drawBlock=function(color){
		var g=this._colorBlock.graphics;
		g.clear(true);
		var showColor=color ? color :"#ffffff";
		g.drawRect(0,0,50,20,showColor,this._borderColor);
		color || g.drawLine(0,0,50,20,"#ff0000");
	}

	/**
	*改变颜色。
	*/
	__proto.changeColor=function(){
		var g=this.graphics;
		g.clear(true);
		var showColor=this._selectedColor || "#000000";
		g.drawRect(0,0,this._colorButton.width,this._colorButton.height,showColor);
	}

	/**@private */
	__proto._setPanelChanged=function(){
		if (!this._panelChanged){
			this._panelChanged=true;
			this.callLater(this.changePanel);
		}
	}

	/**
	*表示颜色输入框的背景颜色值。
	*/
	__getset(0,__proto,'inputBgColor',function(){
		return this._inputBgColor;
		},function(value){
		this._inputBgColor=value;
		this._setPanelChanged();
	});

	/**
	*表示选择的颜色值。
	*/
	__getset(0,__proto,'selectedColor',function(){
		return this._selectedColor;
		},function(value){
		if (this._selectedColor !=value){
			this._selectedColor=this._colorInput.text=value;
			this.drawBlock(value);
			this.changeColor();
			this.changeHandler && this.changeHandler.runWith(this._selectedColor);
			this.event(/*laya.events.Event.CHANGE*/"change",Event.EMPTY.setTo(/*laya.events.Event.CHANGE*/"change",this,this));
		}
	});

	/**
	*@copy laya.ui.Button#skin
	*/
	__getset(0,__proto,'skin',function(){
		return this._colorButton.skin;
		},function(value){
		this._colorButton.once(/*laya.events.Event.LOADED*/"loaded",this,this.changeColor);
		this._colorButton.skin=value;
	});

	/**
	*表示颜色样本列表面板的背景颜色值。
	*/
	__getset(0,__proto,'bgColor',function(){
		return this._bgColor;
		},function(value){
		this._bgColor=value;
		this._setPanelChanged();
	});

	/**
	*表示颜色样本列表面板的边框颜色值。
	*/
	__getset(0,__proto,'borderColor',function(){
		return this._borderColor;
		},function(value){
		this._borderColor=value;
		this._setPanelChanged();
	});

	/**
	*表示颜色样本列表面板选择或输入的颜色值。
	*/
	__getset(0,__proto,'inputColor',function(){
		return this._inputColor;
		},function(value){
		this._inputColor=value;
		this._setPanelChanged();
	});

	return ColorPicker;
})(UIComponent)


/**

*/
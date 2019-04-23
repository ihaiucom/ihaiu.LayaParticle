/**
*<code>/**
*<code>ProgressBar</code> 组件显示内容的加载进度。
*@example <caption>以下示例代码，创建了一个新的 <code>ProgressBar</code> 实例，设置了它的皮肤、位置、宽高、网格等信息，并添加到舞台上。</caption>
*package
*{
	*import laya.ui.ProgressBar;
	*import laya.utils.Handler;
	*public class ProgressBar_Example
	*{
		*private var progressBar:ProgressBar;
		*public function ProgressBar_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/progress.png","resource/ui/progress$bar.png"],Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*progressBar=new ProgressBar("resource/ui/progress.png");//创建一个 ProgressBar 类的实例对象 progressBar 。
			*progressBar.x=100;//设置 progressBar 对象的属性 x 的值，用于控制 progressBar 对象的显示位置。
			*progressBar.y=100;//设置 progressBar 对象的属性 y 的值，用于控制 progressBar 对象的显示位置。
			*progressBar.value=0.3;//设置 progressBar 的进度值。
			*progressBar.width=200;//设置 progressBar 的宽度。
			*progressBar.height=50;//设置 progressBar 的高度。
			*progressBar.sizeGrid="5,10,5,10";//设置 progressBar 的网格信息。
			*progressBar.changeHandler=new Handler(this,onChange);//设置 progressBar 的value值改变时执行的处理器。
			*Laya.stage.addChild(progressBar);//将 progressBar 添加到显示列表。
			*Laya.timer.once(3000,this,changeValue);//设定 3000ms（毫秒）后，执行函数changeValue。
			*}
		*private function changeValue():void
		*{
			*trace("改变进度条的进度值。");
			*progressBar.value=0.6;
			*}
		*private function onChange(value:Number):void
		*{
			*trace("进度发生改变： value=" ,value);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var res=["resource/ui/progress.png","resource/ui/progress$bar.png"];
*Laya.loader.load(res,laya.utils.Handler.create(this,onLoadComplete));//加载资源。
*function onLoadComplete()
*{
	*progressBar=new laya.ui.ProgressBar("resource/ui/progress.png");//创建一个 ProgressBar 类的实例对象 progressBar 。
	*progressBar.x=100;//设置 progressBar 对象的属性 x 的值，用于控制 progressBar 对象的显示位置。
	*progressBar.y=100;//设置 progressBar 对象的属性 y 的值，用于控制 progressBar 对象的显示位置。
	*progressBar.value=0.3;//设置 progressBar 的进度值。
	*progressBar.width=200;//设置 progressBar 的宽度。
	*progressBar.height=50;//设置 progressBar 的高度。
	*progressBar.sizeGrid="10,5,10,5";//设置 progressBar 的网格信息。
	*progressBar.changeHandler=new laya.utils.Handler(this,onChange);//设置 progressBar 的value值改变时执行的处理器。
	*Laya.stage.addChild(progressBar);//将 progressBar 添加到显示列表。
	*Laya.timer.once(3000,this,changeValue);//设定 3000ms（毫秒）后，执行函数changeValue。
	*}
*function changeValue()
*{
	*console.log("改变进度条的进度值。");
	*progressBar.value=0.6;
	*}
*function onChange(value)
*{
	*console.log("进度发生改变： value=" ,value);
	*}
*@example
*import ProgressBar=laya.ui.ProgressBar;
*import Handler=laya.utils.Handler;
*class ProgressBar_Example {
	*private progressBar:ProgressBar;
	*public ProgressBar_Example(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/progress.png","resource/ui/progress$bar.png"],Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*this.progressBar=new ProgressBar("resource/ui/progress.png");//创建一个 ProgressBar 类的实例对象 progressBar 。
		*this.progressBar.x=100;//设置 progressBar 对象的属性 x 的值，用于控制 progressBar 对象的显示位置。
		*this.progressBar.y=100;//设置 progressBar 对象的属性 y 的值，用于控制 progressBar 对象的显示位置。
		*this.progressBar.value=0.3;//设置 progressBar 的进度值。
		*this.progressBar.width=200;//设置 progressBar 的宽度。
		*this.progressBar.height=50;//设置 progressBar 的高度。
		*this.progressBar.sizeGrid="5,10,5,10";//设置 progressBar 的网格信息。
		*this.progressBar.changeHandler=new Handler(this,this.onChange);//设置 progressBar 的value值改变时执行的处理器。
		*Laya.stage.addChild(this.progressBar);//将 progressBar 添加到显示列表。
		*Laya.timer.once(3000,this,this.changeValue);//设定 3000ms（毫秒）后，执行函数changeValue。
		*}
	*private changeValue():void {
		*console.log("改变进度条的进度值。");
		*this.progressBar.value=0.6;
		*}
	*private onChange(value:number):void {
		*console.log("进度发生改变： value=",value);
		*}
	*}
*/
//class laya.ui.ProgressBar extends laya.ui.UIComponent
var ProgressBar=(function(_super){
	function ProgressBar(skin){
		/**
		*当 <code>ProgressBar</code> 实例的 <code>value</code> 属性发生变化时的函数处理器。
		*<p>默认返回参数<code>value</code> 属性（进度值）。</p>
		*/
		this.changeHandler=null;
		/**@private */
		this._bg=null;
		/**@private */
		this._bar=null;
		/**@private */
		this._skin=null;
		/**@private */
		this._value=0.5;
		ProgressBar.__super.call(this);
		this.skin=skin;
	}

	__class(ProgressBar,'laya.ui.ProgressBar',_super);
	var __proto=ProgressBar.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._bg && this._bg.destroy(destroyChild);
		this._bar && this._bar.destroy(destroyChild);
		this._bg=this._bar=null;
		this.changeHandler=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._bg=new Image());
		this.addChild(this._bar=new Image());
		this._bar._bitmap.autoCacheCmd=false;
	}

	__proto._skinLoaded=function(){
		this._bg.skin=this._skin;
		this._bar.skin=this._skin.replace(".png","$bar.png");
		this.callLater(this.changeValue);
		this._sizeChanged();
		this.event(/*laya.events.Event.LOADED*/"loaded");
	}

	/**@inheritDoc */
	__proto.measureWidth=function(){
		return this._bg.width;
	}

	/**@inheritDoc */
	__proto.measureHeight=function(){
		return this._bg.height;
	}

	/**
	*@private
	*更改进度值的显示。
	*/
	__proto.changeValue=function(){
		if (this.sizeGrid){
			var grid=this.sizeGrid.split(",");
			var left=Number(grid[3]);
			var right=Number(grid[1]);
			var max=this.width-left-right;
			var sw=max *this._value;
			this._bar.width=left+right+sw;
			this._bar.visible=this._bar.width > left+right;
			}else {
			this._bar.width=this.width *this._value;
		}
	}

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if ((typeof value=='number')|| (typeof value=='string'))this.value=Number(value);
		else Laya.superSet(UIComponent,this,'dataSource',value);
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

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(UIComponent,this,'height',value);
		this._bg.height=this._height;
		this._bar.height=this._height;
	});

	/**
	*获取进度条对象。
	*/
	__getset(0,__proto,'bar',function(){
		return this._bar;
	});

	/**
	*当前的进度量。
	*<p><b>取值：</b>介于0和1之间。</p>
	*/
	__getset(0,__proto,'value',function(){
		return this._value;
		},function(num){
		if (this._value !=num){
			num=num > 1 ? 1 :num < 0 ? 0 :num;
			this._value=num;
			this.callLater(this.changeValue);
			this.event(/*laya.events.Event.CHANGE*/"change");
			this.changeHandler && this.changeHandler.runWith(num);
		}
	});

	/**
	*获取背景条对象。
	*/
	__getset(0,__proto,'bg',function(){
		return this._bg;
	});

	/**
	*<p>当前 <code>ProgressBar</code> 实例的进度条背景位图（ <code>Image</code> 实例）的有效缩放网格数据。</p>
	*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
	*<ul><li>例如："4,4,4,4,1"</li></ul></p>
	*@see laya.ui.AutoBitmap.sizeGrid
	*/
	__getset(0,__proto,'sizeGrid',function(){
		return this._bg.sizeGrid;
		},function(value){
		this._bg.sizeGrid=this._bar.sizeGrid=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(UIComponent,this,'width',value);
		this._bg.width=this._width;
		this.callLater(this.changeValue);
	});

	return ProgressBar;
})(UIComponent)


/**鼠标提示管理类*/
//class laya.ui.TipManager extends laya.ui.UIComponent
var TipManager=(function(_super){
	function TipManager(){
		this._tipBox=null;
		this._tipText=null;
		this._defaultTipHandler=null;
		TipManager.__super.call(this);
		this._tipBox=new UIComponent();
		this._tipBox.addChild(this._tipText=new Text());
		this._tipText.x=this._tipText.y=5;
		this._tipText.color=TipManager.tipTextColor;
		this._defaultTipHandler=this._showDefaultTip;
		Laya.stage.on(/*laya.ui.UIEvent.SHOW_TIP*/"showtip",this,this._onStageShowTip);
		Laya.stage.on(/*laya.ui.UIEvent.HIDE_TIP*/"hidetip",this,this._onStageHideTip);
		this.zOrder=1100
	}

	__class(TipManager,'laya.ui.TipManager',_super);
	var __proto=TipManager.prototype;
	/**
	*@private
	*/
	__proto._onStageHideTip=function(e){
		Laya.timer.clear(this,this._showTip);
		this.closeAll();
		this.removeSelf();
	}

	/**
	*@private
	*/
	__proto._onStageShowTip=function(data){
		Laya.timer.once(TipManager.tipDelay,this,this._showTip,[data],true);
	}

	/**
	*@private
	*/
	__proto._showTip=function(tip){
		if ((typeof tip=='string')){
			var text=String(tip);
			if (Boolean(text)){
				this._defaultTipHandler(text);
			}
			}else if ((tip instanceof laya.utils.Handler )){
			(tip).run();
			}else if ((typeof tip=='function')){
			(tip).apply();
		}
		if (true){
			Laya.stage.on(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this,this._onStageMouseMove);
			Laya.stage.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._onStageMouseDown);
		}
		this._onStageMouseMove(null);
	}

	/**
	*@private
	*/
	__proto._onStageMouseDown=function(e){
		this.closeAll();
	}

	/**
	*@private
	*/
	__proto._onStageMouseMove=function(e){
		this._showToStage(this,TipManager.offsetX,TipManager.offsetY);
	}

	/**
	*@private
	*/
	__proto._showToStage=function(dis,offX,offY){
		(offX===void 0)&& (offX=0);
		(offY===void 0)&& (offY=0);
		var rec=dis.getBounds();
		dis.x=Laya.stage.mouseX+offX;
		dis.y=Laya.stage.mouseY+offY;
		if (dis._x+rec.width > Laya.stage.width){
			dis.x-=rec.width+offX;
		}
		if (dis._y+rec.height > Laya.stage.height){
			dis.y-=rec.height+offY;
		}
	}

	/**关闭所有鼠标提示*/
	__proto.closeAll=function(){
		Laya.timer.clear(this,this._showTip);
		Laya.stage.off(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this,this._onStageMouseMove);
		Laya.stage.off(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._onStageMouseDown);
		this.removeChildren();
	}

	/**
	*显示显示对象类型的tip
	*/
	__proto.showDislayTip=function(tip){
		this.addChild(tip);
		this._showToStage(this);
		Laya._currentStage.addChild(this);
	}

	/**
	*@private
	*/
	__proto._showDefaultTip=function(text){
		this._tipText.text=text;
		var g=this._tipBox.graphics;
		g.clear(true);
		g.drawRect(0,0,this._tipText.width+10,this._tipText.height+10,TipManager.tipBackColor);
		this.addChild(this._tipBox);
		this._showToStage(this);
		Laya._currentStage.addChild(this);
	}

	/**默认鼠标提示函数*/
	__getset(0,__proto,'defaultTipHandler',function(){
		return this._defaultTipHandler;
		},function(value){
		this._defaultTipHandler=value;
	});

	TipManager.offsetX=10;
	TipManager.offsetY=15;
	TipManager.tipTextColor="#ffffff";
	TipManager.tipBackColor="#111111";
	TipManager.tipDelay=200;
	return TipManager;
})(UIComponent)


/**

*/
*/
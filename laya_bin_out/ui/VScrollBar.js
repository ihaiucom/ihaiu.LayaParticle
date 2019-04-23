/**
*<code>/**
*<code>Dialog</code> 组件是一个弹出对话框，实现对话框弹出，拖动，模式窗口功能。
*可以通过UIConfig设置弹出框背景透明度，模式窗口点击边缘是否关闭等
*通过设置zOrder属性，可以更改弹出的层次
*通过设置popupEffect和closeEffect可以设置弹出效果和关闭效果，如果不想有任何弹出关闭效果，可以设置前述属性为空
*
*@example <caption>以下示例代码，创建了一个 <code>Dialog</code> 实例。</caption>
*package
*{
	*import laya.ui.Dialog;
	*import laya.utils.Handler;
	*public class Dialog_Example
	*{
		*private var dialog:Dialog_Instance;
		*public function Dialog_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load("resource/ui/btn_close.png",Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*dialog=new Dialog_Instance();//创建一个 Dialog_Instance 类的实例对象 dialog。
			*dialog.dragArea="0,0,150,50";//设置 dialog 的拖拽区域。
			*dialog.show();//显示 dialog。
			*dialog.closeHandler=new Handler(this,onClose);//设置 dialog 的关闭函数处理器。
			*}
		*private function onClose(name:String):void
		*{
			*if (name==Dialog.CLOSE)
			*{
				*trace("通过点击 name 为"+name+"的组件，关闭了dialog。");
				*}
			*}
		*}
	*}
*import laya.ui.Button;
*import laya.ui.Dialog;
*import laya.ui.Image;
*class Dialog_Instance extends Dialog
*{
	*function Dialog_Instance():void
	*{
		*var bg:Image=new Image("resource/ui/bg.png");
		*bg.sizeGrid="40,10,5,10";
		*bg.width=150;
		*bg.height=250;
		*addChild(bg);
		*var image:Image=new Image("resource/ui/image.png");
		*addChild(image);
		*var button:Button=new Button("resource/ui/btn_close.png");
		*button.name=Dialog.CLOSE;//设置button的name属性值。
		*button.x=0;
		*button.y=0;
		*addChild(button);
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高、渲染模式
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var dialog;
*Laya.loader.load("resource/ui/btn_close.png",laya.utils.Handler.create(this,loadComplete));//加载资源
*(function (_super){//新建一个类Dialog_Instance继承自laya.ui.Dialog。
	*function Dialog_Instance(){
		*Dialog_Instance.__super.call(this);//初始化父类
		*var bg=new laya.ui.Image("resource/ui/bg.png");//新建一个 Image 类的实例 bg 。
		*bg.sizeGrid="10,40,10,5";//设置 bg 的网格信息。
		*bg.width=150;//设置 bg 的宽度。
		*bg.height=250;//设置 bg 的高度。
		*this.addChild(bg);//将 bg 添加到显示列表。
		*var image=new laya.ui.Image("resource/ui/image.png");//新建一个 Image 类的实例 image 。
		*this.addChild(image);//将 image 添加到显示列表。
		*var button=new laya.ui.Button("resource/ui/btn_close.png");//新建一个 Button 类的实例 bg 。
		*button.name=laya.ui.Dialog.CLOSE;//设置 button 的 name 属性值。
		*button.x=0;//设置 button 对象的属性 x 的值，用于控制 button 对象的显示位置。
		*button.y=0;//设置 button 对象的属性 y 的值，用于控制 button 对象的显示位置。
		*this.addChild(button);//将 button 添加到显示列表。
		*};
	*Laya.class(Dialog_Instance,"mypackage.dialogExample.Dialog_Instance",_super);//注册类Dialog_Instance。
	*})(laya.ui.Dialog);
*function loadComplete(){
	*console.log("资源加载完成！");
	*dialog=new mypackage.dialogExample.Dialog_Instance();//创建一个 Dialog_Instance 类的实例对象 dialog。
	*dialog.dragArea="0,0,150,50";//设置 dialog 的拖拽区域。
	*dialog.show();//显示 dialog。
	*dialog.closeHandler=new laya.utils.Handler(this,onClose);//设置 dialog 的关闭函数处理器。
	*}
*function onClose(name){
	*if (name==laya.ui.Dialog.CLOSE){
		*console.log("通过点击 name 为"+name+"的组件，关闭了dialog。");
		*}
	*}
*@example
*import Dialog=laya.ui.Dialog;
*import Handler=laya.utils.Handler;
*class Dialog_Example {
	*private dialog:Dialog_Instance;
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load("resource/ui/btn_close.png",Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*this.dialog=new Dialog_Instance();//创建一个 Dialog_Instance 类的实例对象 dialog。
		*this.dialog.dragArea="0,0,150,50";//设置 dialog 的拖拽区域。
		*this.dialog.show();//显示 dialog。
		*this.dialog.closeHandler=new Handler(this,this.onClose);//设置 dialog 的关闭函数处理器。
		*}
	*private onClose(name:string):void {
		*if (name==Dialog.CLOSE){
			*console.log("通过点击 name 为"+name+"的组件，关闭了dialog。");
			*}
		*}
	*}
*import Button=laya.ui.Button;
*class Dialog_Instance extends Dialog {
	*Dialog_Instance():void {
		*var bg:laya.ui.Image=new laya.ui.Image("resource/ui/bg.png");
		*bg.sizeGrid="40,10,5,10";
		*bg.width=150;
		*bg.height=250;
		*this.addChild(bg);
		*var image:laya.ui.Image=new laya.ui.Image("resource/ui/image.png");
		*this.addChild(image);
		*var button:Button=new Button("resource/ui/btn_close.png");
		*button.name=Dialog.CLOSE;//设置button的name属性值。
		*button.x=0;
		*button.y=0;
		*this.addChild(button);
		*}
	*}
*/
//class laya.ui.Dialog extends laya.ui.View
var Dialog=(function(_super){
	function Dialog(){
		/**
		*对话框被关闭时会触发的回调函数处理器。
		*<p>回调函数参数为用户点击的按钮名字name:String。</p>
		*/
		this.closeHandler=null;
		/**
		*弹出对话框效果，可以设置一个效果代替默认的弹出效果，如果不想有任何效果，可以赋值为null
		*全局默认弹出效果可以通过manager.popupEffect修改
		*/
		this.popupEffect=null;
		/**
		*关闭对话框效果，可以设置一个效果代替默认的关闭效果，如果不想有任何效果，可以赋值为null
		*全局默认关闭效果可以通过manager.closeEffect修改
		*/
		this.closeEffect=null;
		/**组名称*/
		this.group=null;
		/**是否是模式窗口*/
		this.isModal=false;
		/**是否显示弹出效果*/
		this.isShowEffect=true;
		/**指定对话框是否居中弹。<p>如果值为true，则居中弹出，否则，则根据对象坐标显示，默认为true。</p>*/
		this.isPopupCenter=true;
		/**关闭类型，点击name为"close"，"cancel"，"sure"，"no"，"yes"，"no"的按钮时，会自动记录点击按钮的名称*/
		this.closeType=null;
		/**@private */
		this._dragArea=null;
		/**@private */
		this._param=null;
		/**@private */
		this._effectTween=null;
		Dialog.__super.call(this);
		this.popupEffect=Dialog.manager.popupEffectHandler;
		this.closeEffect=Dialog.manager.closeEffectHandler;
		this._dealDragArea();
		this.on(/*laya.events.Event.CLICK*/"click",this,this._onClick);
	}

	__class(Dialog,'laya.ui.Dialog',_super);
	var __proto=Dialog.prototype;
	/**@private 提取拖拽区域*/
	__proto._dealDragArea=function(){
		var dragTarget=this.getChildByName("drag");
		if (dragTarget){
			this.dragArea=dragTarget._x+","+dragTarget._y+","+dragTarget.width+","+dragTarget.height;
			dragTarget.removeSelf();
		}
	}

	/**@private */
	__proto._onMouseDown=function(e){
		var point=this.getMousePoint();
		if (this._dragArea.contains(point.x,point.y))this.startDrag();
		else this.stopDrag();
	}

	/**@private 处理默认点击事件*/
	__proto._onClick=function(e){
		var btn=e.target;
		if (btn){
			switch (btn.name){
				case "close":
				case "cancel":
				case "sure":
				case "no":
				case "ok":
				case "yes":
					this.close(btn.name);
					return;
				}
		}
	}

	/**@inheritDoc */
	__proto.open=function(closeOther,param){
		(closeOther===void 0)&& (closeOther=true);
		this._dealDragArea();
		this._param=param;
		Dialog.manager.open(this,closeOther,this.isShowEffect);
		Dialog.manager.lock(false);
	}

	/**
	*关闭对话框。
	*@param type 关闭的原因，会传递给onClosed函数
	*/
	__proto.close=function(type){
		this.closeType=type;
		Dialog.manager.close(this);
	}

	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this.closeHandler=null;
		this.popupEffect=null;
		this.closeEffect=null;
		this._dragArea=null;
		_super.prototype.destroy.call(this,destroyChild);
	}

	/**
	*显示对话框（以非模式窗口方式显示）。
	*@param closeOther 是否关闭其它的对话框。若值为true则关闭其它对话框。
	*@param showEffect 是否显示弹出效果
	*/
	__proto.show=function(closeOther,showEffect){
		(closeOther===void 0)&& (closeOther=false);
		(showEffect===void 0)&& (showEffect=true);
		this._open(false,closeOther,showEffect);
	}

	/**
	*显示对话框（以模式窗口方式显示）。
	*@param closeOther 是否关闭其它的对话框。若值为true则关闭其它对话框。
	*@param showEffect 是否显示弹出效果
	*/
	__proto.popup=function(closeOther,showEffect){
		(closeOther===void 0)&& (closeOther=false);
		(showEffect===void 0)&& (showEffect=true);
		this._open(true,closeOther,showEffect);
	}

	/**@private */
	__proto._open=function(modal,closeOther,showEffect){
		this.isModal=modal;
		this.isShowEffect=showEffect;
		Dialog.manager.lock(true);
		this.open(closeOther);
	}

	/**
	*用来指定对话框的拖拽区域。默认值为"0,0,0,0"。
	*<p><b>格式：</b>构成一个矩形所需的 x,y,width,heith 值，用逗号连接为字符串。
	*例如："0,0,100,200"。</p>
	*@see #includeExamplesSummary 请参考示例
	*/
	__getset(0,__proto,'dragArea',function(){
		if (this._dragArea)return this._dragArea.toString();
		return null;
		},function(value){
		if (value){
			var a=UIUtils.fillArray([0,0,0,0],value,Number);
			this._dragArea=new Rectangle(a[0],a[1],a[2],a[3]);
			this.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._onMouseDown);
			}else {
			this._dragArea=null;
			this.off(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._onMouseDown);
		}
	});

	/**弹出框的显示状态；如果弹框处于显示中，则为true，否则为false;*/
	__getset(0,__proto,'isPopup',function(){
		return this.parent !=null;
	});

	/**@inheritDoc */
	__getset(0,__proto,'zOrder',_super.prototype._$get_zOrder,function(value){
		Laya.superSet(View,this,'zOrder',value);
		Dialog.manager._checkMask();
	});

	/**对话框管理容器，所有的对话框都在该容器内，并且受管理器管理，可以自定义自己的管理器，来更改窗口管理的流程。
	*任意对话框打开和关闭，都会触发管理类的open和close事件*/
	__getset(1,Dialog,'manager',function(){
		return Dialog._manager=Dialog._manager|| new DialogManager();
		},function(value){
		Dialog._manager=value;
	});

	Dialog.setLockView=function(view){
		Dialog.manager.setLockView(view);
	}

	Dialog.lock=function(value){
		Dialog.manager.lock(value);
	}

	Dialog.closeAll=function(){
		Dialog.manager.closeAll();
	}

	Dialog.getDialogsByGroup=function(group){
		return Dialog.manager.getDialogsByGroup(group);
	}

	Dialog.closeByGroup=function(group){
		return Dialog.manager.closeByGroup(group);
	}

	Dialog.CLOSE="close";
	Dialog.CANCEL="cancel";
	Dialog.SURE="sure";
	Dialog.NO="no";
	Dialog.YES="yes";
	Dialog.OK="ok";
	Dialog._manager=null;
	return Dialog;
})(View)


/**
*
*使用 <code>VScrollBar</code> （垂直 <code>ScrollBar</code> ）控件，可以在因数据太多而不能在显示区域完全显示时控制显示的数据部分。
*
*@example <caption>以下示例代码，创建了一个 <code>VScrollBar</code> 实例。</caption>
*package
*{
	*import laya.ui.vScrollBar;
	*import laya.ui.VScrollBar;
	*import laya.utils.Handler;
	*public class VScrollBar_Example
	*{
		*private var vScrollBar:VScrollBar;
		*public function VScrollBar_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png"],Handler.create(this,onLoadComplete));
			*}
		*private function onLoadComplete():void
		*{
			*vScrollBar=new VScrollBar();//创建一个 vScrollBar 类的实例对象 hScrollBar 。
			*vScrollBar.skin="resource/ui/vscroll.png";//设置 vScrollBar 的皮肤。
			*vScrollBar.x=100;//设置 vScrollBar 对象的属性 x 的值，用于控制 vScrollBar 对象的显示位置。
			*vScrollBar.y=100;//设置 vScrollBar 对象的属性 y 的值，用于控制 vScrollBar 对象的显示位置。
			*vScrollBar.changeHandler=new Handler(this,onChange);//设置 vScrollBar 的滚动变化处理器。
			*Laya.stage.addChild(vScrollBar);//将此 vScrollBar 对象添加到显示列表。
			*}
		*private function onChange(value:Number):void
		*{
			*trace("滚动条的位置： value="+value);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var vScrollBar;
*var res=["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png"];
*Laya.loader.load(res,laya.utils.Handler.create(this,onLoadComplete));//加载资源。
*function onLoadComplete(){
	*vScrollBar=new laya.ui.VScrollBar();//创建一个 vScrollBar 类的实例对象 hScrollBar 。
	*vScrollBar.skin="resource/ui/vscroll.png";//设置 vScrollBar 的皮肤。
	*vScrollBar.x=100;//设置 vScrollBar 对象的属性 x 的值，用于控制 vScrollBar 对象的显示位置。
	*vScrollBar.y=100;//设置 vScrollBar 对象的属性 y 的值，用于控制 vScrollBar 对象的显示位置。
	*vScrollBar.changeHandler=new laya.utils.Handler(this,onChange);//设置 vScrollBar 的滚动变化处理器。
	*Laya.stage.addChild(vScrollBar);//将此 vScrollBar 对象添加到显示列表。
	*}
*function onChange(value){
	*console.log("滚动条的位置： value="+value);
	*}
*@example
*import VScrollBar=laya.ui.VScrollBar;
*import Handler=laya.utils.Handler;
*class VScrollBar_Example {
	*private vScrollBar:VScrollBar;
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png"],Handler.create(this,this.onLoadComplete));
		*}
	*private onLoadComplete():void {
		*this.vScrollBar=new VScrollBar();//创建一个 vScrollBar 类的实例对象 hScrollBar 。
		*this.vScrollBar.skin="resource/ui/vscroll.png";//设置 vScrollBar 的皮肤。
		*this.vScrollBar.x=100;//设置 vScrollBar 对象的属性 x 的值，用于控制 vScrollBar 对象的显示位置。
		*this.vScrollBar.y=100;//设置 vScrollBar 对象的属性 y 的值，用于控制 vScrollBar 对象的显示位置。
		*this.vScrollBar.changeHandler=new Handler(this,this.onChange);//设置 vScrollBar 的滚动变化处理器。
		*Laya.stage.addChild(this.vScrollBar);//将此 vScrollBar 对象添加到显示列表。
		*}
	*private onChange(value:number):void {
		*console.log("滚动条的位置： value="+value);
		*}
	*}
*/
//class laya.ui.VScrollBar extends laya.ui.ScrollBar
var VScrollBar=(function(_super){
	function VScrollBar(){
		VScrollBar.__super.call(this);;
	}

	__class(VScrollBar,'laya.ui.VScrollBar',_super);
	return VScrollBar;
})(ScrollBar)


/**
*使用 <code>HScrollBar</code> （水平 <code>ScrollBar</code> ）控件，可以在因数据太多而不能在显示区域完全显示时控制显示的数据部分。
*@example <caption>以下示例代码，创建了一个 <code>HScrollBar</code> 实例。</caption>
*package
*{
	*import laya.ui.HScrollBar;
	*import laya.utils.Handler;
	*public class HScrollBar_Example
	*{
		*private var hScrollBar:HScrollBar;
		*public function HScrollBar_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/hscroll.png","resource/ui/hscroll$bar.png","resource/ui/hscroll$down.png","resource/ui/hscroll$up.png"],Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*hScrollBar=new HScrollBar();//创建一个 HScrollBar 类的实例对象 hScrollBar 。
			*hScrollBar.skin="resource/ui/hscroll.png";//设置 hScrollBar 的皮肤。
			*hScrollBar.x=100;//设置 hScrollBar 对象的属性 x 的值，用于控制 hScrollBar 对象的显示位置。
			*hScrollBar.y=100;//设置 hScrollBar 对象的属性 y 的值，用于控制 hScrollBar 对象的显示位置。
			*hScrollBar.changeHandler=new Handler(this,onChange);//设置 hScrollBar 的滚动变化处理器。
			*Laya.stage.addChild(hScrollBar);//将此 hScrollBar 对象添加到显示列表。
			*}
		*private function onChange(value:Number):void
		*{
			*trace("滚动条的位置： value="+value);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var hScrollBar;
*var res=["resource/ui/hscroll.png","resource/ui/hscroll$bar.png","resource/ui/hscroll$down.png","resource/ui/hscroll$up.png"];
*Laya.loader.load(res,laya.utils.Handler.create(this,onLoadComplete));//加载资源。
*function onLoadComplete(){
	*console.log("资源加载完成！");
	*hScrollBar=new laya.ui.HScrollBar();//创建一个 HScrollBar 类的实例对象 hScrollBar 。
	*hScrollBar.skin="resource/ui/hscroll.png";//设置 hScrollBar 的皮肤。
	*hScrollBar.x=100;//设置 hScrollBar 对象的属性 x 的值，用于控制 hScrollBar 对象的显示位置。
	*hScrollBar.y=100;//设置 hScrollBar 对象的属性 y 的值，用于控制 hScrollBar 对象的显示位置。
	*hScrollBar.changeHandler=new laya.utils.Handler(this,onChange);//设置 hScrollBar 的滚动变化处理器。
	*Laya.stage.addChild(hScrollBar);//将此 hScrollBar 对象添加到显示列表。
	*}
*function onChange(value)
*{
	*console.log("滚动条的位置： value="+value);
	*}
*@example
*import HScrollBar=laya.ui.HScrollBar;
*import Handler=laya.utils.Handler;
*class HScrollBar_Example {
	*private hScrollBar:HScrollBar;
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/hscroll.png","resource/ui/hscroll$bar.png","resource/ui/hscroll$down.png","resource/ui/hscroll$up.png"],Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*this.hScrollBar=new HScrollBar();//创建一个 HScrollBar 类的实例对象 hScrollBar 。
		*this.hScrollBar.skin="resource/ui/hscroll.png";//设置 hScrollBar 的皮肤。
		*this.hScrollBar.x=100;//设置 hScrollBar 对象的属性 x 的值，用于控制 hScrollBar 对象的显示位置。
		*this.hScrollBar.y=100;//设置 hScrollBar 对象的属性 y 的值，用于控制 hScrollBar 对象的显示位置。
		*this.hScrollBar.changeHandler=new Handler(this,this.onChange);//设置 hScrollBar 的滚动变化处理器。
		*Laya.stage.addChild(this.hScrollBar);//将此 hScrollBar 对象添加到显示列表。
		*}
	*private onChange(value:number):void {
		*console.log("滚动条的位置： value="+value);
		*}
	*}
*/
//class laya.ui.HScrollBar extends laya.ui.ScrollBar
var HScrollBar=(function(_super){
	function HScrollBar(){
		HScrollBar.__super.call(this);;
	}

	__class(HScrollBar,'laya.ui.HScrollBar',_super);
	var __proto=HScrollBar.prototype;
	/**@inheritDoc */
	__proto.initialize=function(){
		_super.prototype.initialize.call(this);
		this.slider.isVertical=false;
	}

	return HScrollBar;
})(ScrollBar)


/**

*/
*/
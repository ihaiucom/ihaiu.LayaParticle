/**
*<code>/**
*<code>/**
*<code>ComboBox</code> 组件包含一个下拉列表，用户可以从该列表中选择单个值。
*
*@example <caption>以下示例代码，创建了一个 <code>ComboBox</code> 实例。</caption>
*package
*{
	*import laya.ui.ComboBox;
	*import laya.utils.Handler;
	*public class ComboBox_Example
	*{
		*public function ComboBox_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load("resource/ui/button.png",Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*trace("资源加载完成！");
			*var comboBox:ComboBox=new ComboBox("resource/ui/button.png","item0,item1,item2,item3,item4,item5");//创建一个 ComboBox 类的实例对象 comboBox ,传入它的皮肤和标签集。
			*comboBox.x=100;//设置 comboBox 对象的属性 x 的值，用于控制 comboBox 对象的显示位置。
			*comboBox.y=100;//设置 comboBox 对象的属性 x 的值，用于控制 comboBox 对象的显示位置。
			*comboBox.selectHandler=new Handler(this,onSelect);//设置 comboBox 选择项改变时执行的处理器。
			*Laya.stage.addChild(comboBox);//将此 comboBox 对象添加到显示列表。
			*}
		*private function onSelect(index:int):void
		*{
			*trace("当前选中的项对象索引： ",index);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高。
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
*Laya.loader.load("resource/ui/button.png",laya.utils.Handler.create(this,loadComplete));//加载资源
*function loadComplete(){
	*console.log("资源加载完成！");
	*var comboBox=new laya.ui.ComboBox("resource/ui/button.png","item0,item1,item2,item3,item4,item5");//创建一个 ComboBox 类的实例对象 comboBox ,传入它的皮肤和标签集。
	*comboBox.x=100;//设置 comboBox 对象的属性 x 的值，用于控制 comboBox 对象的显示位置。
	*comboBox.y=100;//设置 comboBox 对象的属性 x 的值，用于控制 comboBox 对象的显示位置。
	*comboBox.selectHandler=new laya.utils.Handler(this,onSelect);//设置 comboBox 选择项改变时执行的处理器。
	*Laya.stage.addChild(comboBox);//将此 comboBox 对象添加到显示列表。
	*}
*function onSelect(index)
*{
	*console.log("当前选中的项对象索引： ",index);
	*}
*@example
*import ComboBox=laya.ui.ComboBox;
*import Handler=laya.utils.Handler;
*class ComboBox_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load("resource/ui/button.png",Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*console.log("资源加载完成！");
		*var comboBox:ComboBox=new ComboBox("resource/ui/button.png","item0,item1,item2,item3,item4,item5");//创建一个 ComboBox 类的实例对象 comboBox ,传入它的皮肤和标签集。
		*comboBox.x=100;//设置 comboBox 对象的属性 x 的值，用于控制 comboBox 对象的显示位置。
		*comboBox.y=100;//设置 comboBox 对象的属性 x 的值，用于控制 comboBox 对象的显示位置。
		*comboBox.selectHandler=new Handler(this,this.onSelect);//设置 comboBox 选择项改变时执行的处理器。
		*Laya.stage.addChild(comboBox);//将此 comboBox 对象添加到显示列表。
		*}
	*private onSelect(index:number):void {
		*console.log("当前选中的项对象索引： ",index);
		*}
	*}
*
*/
//class laya.ui.ComboBox extends laya.ui.UIComponent
var ComboBox=(function(_super){
	function ComboBox(skin,labels){
		/**@private */
		this._visibleNum=6;
		/**
		*@private
		*/
		this._button=null;
		/**
		*@private
		*/
		this._list=null;
		/**
		*@private
		*/
		this._isOpen=false;
		/**
		*@private
		*/
		this._itemSize=12;
		/**
		*@private
		*/
		this._labels=[];
		/**
		*@private
		*/
		this._selectedIndex=-1;
		/**
		*@private
		*/
		this._selectHandler=null;
		/**
		*@private
		*/
		this._itemHeight=NaN;
		/**
		*@private
		*/
		this._listHeight=NaN;
		/**
		*@private
		*/
		this._listChanged=false;
		/**
		*@private
		*/
		this._itemChanged=false;
		/**
		*@private
		*/
		this._scrollBarSkin=null;
		/**
		*@private
		*/
		this._isCustomList=false;
		/**
		*渲染项，用来显示下拉列表展示对象
		*/
		this.itemRender=null;
		ComboBox.__super.call(this);
		this._itemColors=Styles.comboBoxItemColors;
		this.skin=skin;
		this.labels=labels;
	}

	__class(ComboBox,'laya.ui.ComboBox',_super);
	var __proto=ComboBox.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._button && this._button.destroy(destroyChild);
		this._list && this._list.destroy(destroyChild);
		this._button=null;
		this._list=null;
		this._itemColors=null;
		this._labels=null;
		this._selectHandler=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._button=new Button());
		this._button.text.align="left";
		this._button.labelPadding="0,0,0,5";
		this._button.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onButtonMouseDown);
	}

	__proto._createList=function(){
		this._list=new List();
		if (this._scrollBarSkin)this._list.vScrollBarSkin=this._scrollBarSkin;
		this._setListEvent(this._list);
	}

	__proto._setListEvent=function(list){
		this._list.selectEnable=true;
		this._list.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onListDown);
		this._list.mouseHandler=Handler.create(this,this.onlistItemMouse,null,false);
		if (this._list.scrollBar)this._list.scrollBar.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onScrollBarDown);
	}

	/**
	*@private
	*/
	__proto.onListDown=function(e){
		e.stopPropagation();
	}

	__proto.onScrollBarDown=function(e){
		e.stopPropagation();
	}

	__proto.onButtonMouseDown=function(e){
		this.callLater(this.switchTo,[!this._isOpen]);
	}

	/**@inheritDoc */
	__proto.measureWidth=function(){
		return this._button.width;
	}

	/**@inheritDoc */
	__proto.measureHeight=function(){
		return this._button.height;
	}

	/**
	*@private
	*/
	__proto.changeList=function(){
		this._listChanged=false;
		var labelWidth=this.width-2;
		var labelColor=this._itemColors[2];
		this._itemHeight=this._itemSize+6;
		this._list.itemRender=this.itemRender || {type:"Box",child:[{type:"Label",props:{name:"label",x:1,padding:"3,3,3,3",width:labelWidth,height:this._itemHeight,fontSize:this._itemSize,color:labelColor}}]};
		this._list.repeatY=this._visibleNum;
		this._list.refresh();
	}

	/**
	*@private
	*下拉列表的鼠标事件响应函数。
	*/
	__proto.onlistItemMouse=function(e,index){
		var type=e.type;
		if (type===/*laya.events.Event.MOUSE_OVER*/"mouseover" || type===/*laya.events.Event.MOUSE_OUT*/"mouseout"){
			if (this._isCustomList)return;
			var box=this._list.getCell(index);
			if (!box)return;
			var label=box.getChildByName("label");
			if (label){
				if (type===/*laya.events.Event.ROLL_OVER*/"mouseover"){
					label.bgColor=this._itemColors[0];
					label.color=this._itemColors[1];
					}else {
					label.bgColor=null;
					label.color=this._itemColors[2];
				}
			}
			}else if (type===/*laya.events.Event.CLICK*/"click"){
			this.selectedIndex=index;
			this.isOpen=false;
		}
	}

	/**
	*@private
	*/
	__proto.switchTo=function(value){
		this.isOpen=value;
	}

	/**
	*更改下拉列表的打开状态。
	*/
	__proto.changeOpen=function(){
		this.isOpen=!this._isOpen;
	}

	/**
	*更改下拉列表。
	*/
	__proto.changeItem=function(){
		this._itemChanged=false;
		this._listHeight=this._labels.length > 0 ? Math.min(this._visibleNum,this._labels.length)*this._itemHeight :this._itemHeight;
		if (!this._isCustomList){
			var g=this._list.graphics;
			g.clear(true);
			g.drawRect(0,0,this.width-1,this._listHeight,this._itemColors[4],this._itemColors[3]);
		};
		var a=this._list.array || [];
		a.length=0;
		for (var i=0,n=this._labels.length;i < n;i++){
			a.push({label:this._labels[i]});
		}
		this._list.height=this._listHeight;
		this._list.array=a;
	}

	__proto.changeSelected=function(){
		this._button.label=this.selectedLabel;
	}

	__proto._onStageMouseWheel=function(e){
		if(!this._list||this._list.contains(e.target))return;
		this.removeList(null);
	}

	/**
	*关闭下拉列表。
	*/
	__proto.removeList=function(e){
		Laya.stage.off(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.removeList);
		Laya.stage.off(/*laya.events.Event.MOUSE_WHEEL*/"mousewheel",this,this._onStageMouseWheel);
		this.isOpen=false;
	}

	/**
	*表示选择的下拉列表项的索引。
	*/
	__getset(0,__proto,'selectedIndex',function(){
		return this._selectedIndex;
		},function(value){
		if (this._selectedIndex !=value){
			this._selectedIndex=value;
			if (this._labels.length > 0)this.changeSelected();
			else this.callLater(this.changeSelected);
			this.event(/*laya.events.Event.CHANGE*/"change",[Event.EMPTY.setTo(/*laya.events.Event.CHANGE*/"change",this,this)]);
			this._selectHandler && this._selectHandler.runWith(this._selectedIndex);
		}
	});

	/**
	*@copy laya.ui.Button#skin
	*/
	__getset(0,__proto,'skin',function(){
		return this._button.skin;
		},function(value){
		if (this._button.skin !=value){
			this._button.skin=value;
			this._listChanged=true;
		}
	});

	/**
	*获取或设置没有滚动条的下拉列表中可显示的最大行数。
	*/
	__getset(0,__proto,'visibleNum',function(){
		return this._visibleNum;
		},function(value){
		this._visibleNum=value;
		this._listChanged=true;
	});

	/**@inheritDoc */
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(UIComponent,this,'width',value);
		this._button.width=this._width;
		this._itemChanged=true;
		this._listChanged=true;
	});

	/**
	*表示选择的下拉列表项的的标签。
	*/
	__getset(0,__proto,'selectedLabel',function(){
		return this._selectedIndex >-1 && this._selectedIndex < this._labels.length ? this._labels[this._selectedIndex] :null;
		},function(value){
		this.selectedIndex=this._labels.indexOf(value);
	});

	/**
	*标签集合字符串。
	*/
	__getset(0,__proto,'labels',function(){
		return this._labels.join(",");
		},function(value){
		if (this._labels.length > 0)this.selectedIndex=-1;
		if (value)this._labels=value.split(",");
		else this._labels.length=0;
		this._itemChanged=true;
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(UIComponent,this,'height',value);
		this._button.height=this._height;
	});

	/**
	*改变下拉列表的选择项时执行的处理器(默认返回参数index:int)。
	*/
	__getset(0,__proto,'selectHandler',function(){
		return this._selectHandler;
		},function(value){
		this._selectHandler=value;
	});

	/**
	*表示按钮文本标签是否为粗体字。
	*@see laya.display.Text#bold
	*/
	__getset(0,__proto,'labelBold',function(){
		return this._button.text.bold;
		},function(value){
		this._button.text.bold=value
	});

	/**
	*下拉列表项颜色。
	*<p><b>格式：</b>"悬停或被选中时背景颜色,悬停或被选中时标签颜色,标签颜色,边框颜色,背景颜色"</p>
	*/
	__getset(0,__proto,'itemColors',function(){
		return String(this._itemColors)
		},function(value){
		this._itemColors=UIUtils.fillArray(this._itemColors,value,String);
		this._listChanged=true;
	});

	/**
	*下拉列表项标签的字体大小。
	*/
	__getset(0,__proto,'itemSize',function(){
		return this._itemSize;
		},function(value){
		this._itemSize=value;
		this._listChanged=true;
	});

	/**
	*获取对 <code>ComboBox</code> 组件所包含的 <code>VScrollBar</code> 滚动条组件的引用。
	*/
	__getset(0,__proto,'scrollBar',function(){
		return this.list.scrollBar;
	});

	/**
	*表示下拉列表的打开状态。
	*/
	__getset(0,__proto,'isOpen',function(){
		return this._isOpen;
		},function(value){
		if (this._isOpen !=value){
			this._isOpen=value;
			this._button.selected=this._isOpen;
			if (this._isOpen){
				this._list || this._createList();
				this._listChanged && !this._isCustomList && this.changeList();
				this._itemChanged && this.changeItem();
				var p=this.localToGlobal(Point.TEMP.setTo(0,0));
				var py=p.y+this._button.height;
				py=py+this._listHeight <=Laya.stage.height ? py :p.y-this._listHeight;
				this._list.pos(p.x,py);
				this._list.zOrder=1001;
				Laya._currentStage.addChild(this._list);
				Laya.stage.once(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.removeList);
				Laya.stage.on(/*laya.events.Event.MOUSE_WHEEL*/"mousewheel",this,this._onStageMouseWheel);
				this._list.selectedIndex=this._selectedIndex;
				}else {
				this._list && this._list.removeSelf();
			}
		}
	});

	/**
	*滚动条皮肤。
	*/
	__getset(0,__proto,'scrollBarSkin',function(){
		return this._scrollBarSkin;
		},function(value){
		this._scrollBarSkin=value;
	});

	/**
	*<p>当前实例的位图 <code>AutoImage</code> 实例的有效缩放网格数据。</p>
	*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
	*<ul><li>例如："4,4,4,4,1"</li></ul></p>
	*@see laya.ui.AutoBitmap.sizeGrid
	*/
	__getset(0,__proto,'sizeGrid',function(){
		return this._button.sizeGrid;
		},function(value){
		this._button.sizeGrid=value;
	});

	/**
	*获取对 <code>ComboBox</code> 组件所包含的 <code>Button</code> 组件的引用。
	*/
	__getset(0,__proto,'button',function(){
		return this._button;
	});

	/**
	*获取对 <code>ComboBox</code> 组件所包含的 <code>List</code> 列表组件的引用。
	*/
	__getset(0,__proto,'list',function(){
		this._list || this._createList();
		return this._list;
		},function(value){
		if (value){
			value.removeSelf();
			this._isCustomList=true;
			this._list=value;
			this._setListEvent(value);
			this._itemHeight=value.getCell(0).height+value.spaceY;
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if (((typeof value=='number')&& Math.floor(value)==value)|| (typeof value=='string'))this.selectedIndex=parseInt(value);
		else if ((value instanceof Array))this.labels=(value).join(",");
		else Laya.superSet(UIComponent,this,'dataSource',value);
	});

	/**
	*获取或设置对 <code>ComboBox</code> 组件所包含的 <code>Button</code> 组件的文本标签颜色。
	*<p><b>格式：</b>upColor,overColor,downColor,disableColor</p>
	*/
	__getset(0,__proto,'labelColors',function(){
		return this._button.labelColors;
		},function(value){
		if (this._button.labelColors !=value){
			this._button.labelColors=value;
		}
	});

	/**
	*获取或设置对 <code>ComboBox</code> 组件所包含的 <code>Button</code> 组件的文本边距。
	*<p><b>格式：</b>上边距,右边距,下边距,左边距</p>
	*/
	__getset(0,__proto,'labelPadding',function(){
		return this._button.text.padding.join(",");
		},function(value){
		this._button.text.padding=UIUtils.fillArray(Styles.labelPadding,value,Number);
	});

	/**
	*获取或设置对 <code>ComboBox</code> 组件所包含的 <code>Button</code> 组件的标签字体大小。
	*/
	__getset(0,__proto,'labelSize',function(){
		return this._button.text.fontSize;
		},function(value){
		this._button.text.fontSize=value
	});

	/**
	*表示按钮文本标签的字体名称，以字符串形式表示。
	*@see laya.display.Text#font
	*/
	__getset(0,__proto,'labelFont',function(){
		return this._button.text.font;
		},function(value){
		this._button.text.font=value
	});

	/**
	*表示按钮的状态值。
	*@see laya.ui.Button#stateNum
	*/
	__getset(0,__proto,'stateNum',function(){
		return this._button.stateNum;
		},function(value){
		this._button.stateNum=value
	});

	return ComboBox;
})(UIComponent)


/**
*微信开放数据展示组件，直接实例本组件，即可根据组件宽高，位置，以最优的方式显示开放域数据
*/
//class laya.ui.WXOpenDataViewer extends laya.ui.UIComponent
var WXOpenDataViewer=(function(_super){
	function WXOpenDataViewer(){
		this._$4__texture=null;
		WXOpenDataViewer.__super.call(this);
		this._width=this._height=200;
		var tex=new Texture();
		if (Laya["Texture2D"]){
			tex.bitmap=new Laya["Texture2D"]();
			this.texture=tex;
			}else {
			throw new Error("WXOpenDataViewer:webgl not found!");
		}
	}

	__class(WXOpenDataViewer,'laya.ui.WXOpenDataViewer',_super);
	var __proto=WXOpenDataViewer.prototype;
	__proto.onEnable=function(){
		this.postMsg({type:"display",rate:Laya.stage.frameRate});
		if (window.wx && window.sharedCanvas)Laya.timer.frameLoop(1,this,this._onLoop);
	}

	__proto.onDisable=function(){
		this.postMsg({type:"undisplay"});
		Laya.timer.clear(this,this._onLoop);
	}

	__proto._onLoop=function(){
		this.texture.bitmap.loadImageSource(window.sharedCanvas);
	}

	__proto._postMsg=function(){
		var mat=new Matrix();
		mat.translate(this.x,this.y);
		var stage=Laya.stage;
		mat.scale(stage._canvasTransform.getScaleX()*this.globalScaleX *stage.transform.getScaleX(),stage._canvasTransform.getScaleY()*this.globalScaleY *stage.transform.getScaleY());
		this.postMsg({type:"changeMatrix",a:mat.a,b:mat.b,c:mat.c,d:mat.d,tx:mat.tx,ty:mat.ty,w:this.width,h:this.height});
	}

	/**向开放数据域发送消息*/
	__proto.postMsg=function(msg){
		if (window.wx && window.wx.getOpenDataContext){
			var openDataContext=window.wx.getOpenDataContext();
			openDataContext.postMessage(msg);
		}
	}

	__getset(0,__proto,'x',_super.prototype._$get_x,function(value){
		Laya.superSet(UIComponent,this,'x',value);
		this.callLater(this._postMsg);
	});

	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(UIComponent,this,'width',value);
		if (window.sharedCanvas)window.sharedCanvas.width=value;
		this.callLater(this._postMsg);
	});

	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(UIComponent,this,'height',value);
		if (window.sharedCanvas)window.sharedCanvas.height=value;
		this.callLater(this._postMsg);
	});

	__getset(0,__proto,'y',_super.prototype._$get_y,function(value){
		Laya.superSet(UIComponent,this,'y',value);
		this.callLater(this._postMsg);
	});

	return WXOpenDataViewer;
})(UIComponent)


/**
*<p> <code>Clip</code> 类是位图切片动画。</p>
*<p> <code>Clip</code> 可将一张图片，按横向分割数量 <code>clipX</code> 、竖向分割数量 <code>clipY</code> ，
*或横向分割每个切片的宽度 <code>clipWidth</code> 、竖向分割每个切片的高度 <code>clipHeight</code> ，
*从左向右，从上到下，分割组合为一个切片动画。</p>
*Image和Clip组件是唯一支持异步加载的两个组件，比如clip.skin="abc/xxx.png"，其他UI组件均不支持异步加载。
*
*@example <caption>以下示例代码，创建了一个 <code>Clip</code> 实例。</caption>
*package
*{
	*import laya.ui.Clip;
	*public class Clip_Example
	*{
		*private var clip:Clip;
		*public function Clip_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*onInit();
			*}
		*private function onInit():void
		*{
			*clip=new Clip("resource/ui/clip_num.png",10,1);//创建一个 Clip 类的实例对象 clip ,传入它的皮肤skin和横向分割数量、竖向分割数量。
			*clip.autoPlay=true;//设置 clip 动画自动播放。
			*clip.interval=100;//设置 clip 动画的播放时间间隔。
			*clip.x=100;//设置 clip 对象的属性 x 的值，用于控制 clip 对象的显示位置。
			*clip.y=100;//设置 clip 对象的属性 y 的值，用于控制 clip 对象的显示位置。
			*clip.on(Event.CLICK,this,onClick);//给 clip 添加点击事件函数侦听。
			*Laya.stage.addChild(clip);//将此 clip 对象添加到显示列表。
			*}
		*private function onClick():void
		*{
			*trace("clip 的点击事件侦听处理函数。clip.total="+clip.total);
			*if (clip.isPlaying==true)
			*{
				*clip.stop();//停止动画。
				*}else {
				*clip.play();//播放动画。
				*}
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var clip;
*Laya.loader.load("resource/ui/clip_num.png",laya.utils.Handler.create(this,loadComplete));//加载资源
*function loadComplete(){
	*console.log("资源加载完成！");
	*clip=new laya.ui.Clip("resource/ui/clip_num.png",10,1);//创建一个 Clip 类的实例对象 clip ,传入它的皮肤skin和横向分割数量、竖向分割数量。
	*clip.autoPlay=true;//设置 clip 动画自动播放。
	*clip.interval=100;//设置 clip 动画的播放时间间隔。
	*clip.x=100;//设置 clip 对象的属性 x 的值，用于控制 clip 对象的显示位置。
	*clip.y=100;//设置 clip 对象的属性 y 的值，用于控制 clip 对象的显示位置。
	*clip.on(Event.CLICK,this,onClick);//给 clip 添加点击事件函数侦听。
	*Laya.stage.addChild(clip);//将此 clip 对象添加到显示列表。
	*}
*function onClick()
*{
	*console.log("clip 的点击事件侦听处理函数。");
	*if(clip.isPlaying==true)
	*{
		*clip.stop();
		*}else {
		*clip.play();
		*}
	*}
*@example
*import Clip=laya.ui.Clip;
*import Handler=laya.utils.Handler;
*class Clip_Example {
	*private clip:Clip;
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*this.onInit();
		*}
	*private onInit():void {
		*this.clip=new Clip("resource/ui/clip_num.png",10,1);//创建一个 Clip 类的实例对象 clip ,传入它的皮肤skin和横向分割数量、竖向分割数量。
		*this.clip.autoPlay=true;//设置 clip 动画自动播放。
		*this.clip.interval=100;//设置 clip 动画的播放时间间隔。
		*this.clip.x=100;//设置 clip 对象的属性 x 的值，用于控制 clip 对象的显示位置。
		*this.clip.y=100;//设置 clip 对象的属性 y 的值，用于控制 clip 对象的显示位置。
		*this.clip.on(laya.events.Event.CLICK,this,this.onClick);//给 clip 添加点击事件函数侦听。
		*Laya.stage.addChild(this.clip);//将此 clip 对象添加到显示列表。
		*}
	*private onClick():void {
		*console.log("clip 的点击事件侦听处理函数。clip.total="+this.clip.total);
		*if (this.clip.isPlaying==true){
			*this.clip.stop();//停止动画。
			*}else {
			*this.clip.play();//播放动画。
			*}
		*}
	*}
*
*/
//class laya.ui.Clip extends laya.ui.UIComponent
var Clip=(function(_super){
	function Clip(url,clipX,clipY){
		/**@private */
		this._sources=null;
		/**@private */
		this._bitmap=null;
		/**@private */
		this._skin=null;
		/**@private */
		this._clipX=1;
		/**@private */
		this._clipY=1;
		/**@private */
		this._clipWidth=0;
		/**@private */
		this._clipHeight=0;
		/**@private */
		this._autoPlay=false;
		/**@private */
		this._interval=50;
		/**@private */
		this._complete=null;
		/**@private */
		this._isPlaying=false;
		/**@private */
		this._index=0;
		/**@private */
		this._clipChanged=false;
		/**@private */
		this._group=null;
		/**@private */
		this._toIndex=-1;
		Clip.__super.call(this);
		(clipX===void 0)&& (clipX=1);
		(clipY===void 0)&& (clipY=1);
		this._clipX=clipX;
		this._clipY=clipY;
		this.skin=url;
	}

	__class(Clip,'laya.ui.Clip',_super);
	var __proto=Clip.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,true);
		this._bitmap && this._bitmap.destroy();
		this._bitmap=null;
		this._sources=null;
	}

	/**
	*销毁对象并释放加载的皮肤资源。
	*/
	__proto.dispose=function(){
		this.destroy(true);
		Laya.loader.clearRes(this._skin);
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.graphics=this._bitmap=new AutoBitmap();
	}

	/**@private */
	__proto._onDisplay=function(e){
		if (this._isPlaying){
			if (this._getBit(/*laya.Const.DISPLAYED_INSTAGE*/0x80))this.play();
			else this.stop();
			}else if (this._autoPlay){
			this.play();
		}
	}

	__proto._skinLoaded=function(){
		this._setClipChanged();
		this._sizeChanged();
		this.event(/*laya.events.Event.LOADED*/"loaded");
	}

	/**
	*@private
	*改变切片的资源、切片的大小。
	*/
	__proto.changeClip=function(){
		this._clipChanged=false;
		if (!this._skin)return;
		var img=Loader.getRes(this._skin);
		if (img){
			this.loadComplete(this._skin,img);
			}else {
			Laya.loader.load(this._skin,Handler.create(this,this.loadComplete,[this._skin]));
		}
	}

	/**
	*@private
	*加载切片图片资源完成函数。
	*@param url 资源地址。
	*@param img 纹理。
	*/
	__proto.loadComplete=function(url,img){
		if (url===this._skin && img){
			var w=this._clipWidth || Math.ceil(img.sourceWidth / this._clipX);
			var h=this._clipHeight || Math.ceil(img.sourceHeight / this._clipY);
			var key=this._skin+w+h;
			var clips=WeakObject.I.get(key);
			if (!Utils.isOkTextureList(clips)){
				clips=null;
			}
			if (clips)this._sources=clips;
			else {
				this._sources=[];
				for (var i=0;i < this._clipY;i++){
					for (var j=0;j < this._clipX;j++){
						this._sources.push(Texture.createFromTexture(img,w *j,h *i,w,h));
					}
				}
				WeakObject.I.set(key,this._sources);
			}
			this.index=this._index;
			this.event(/*laya.events.Event.LOADED*/"loaded");
			this.onCompResize();
		}
	}

	/**@inheritDoc */
	__proto.measureWidth=function(){
		this.runCallLater(this.changeClip);
		return this._bitmap.width;
	}

	/**@inheritDoc */
	__proto.measureHeight=function(){
		this.runCallLater(this.changeClip);
		return this._bitmap.height;
	}

	/**
	*播放动画。
	*@param from 开始索引
	*@param to 结束索引，-1为不限制
	*/
	__proto.play=function(from,to){
		(from===void 0)&& (from=0);
		(to===void 0)&& (to=-1);
		this._isPlaying=true;
		this.index=from;
		this._toIndex=to;
		this._index++;
		Laya.timer.loop(this.interval,this,this._loop);
		this.on(/*laya.events.Event.DISPLAY*/"display",this,this._onDisplay);
		this.on(/*laya.events.Event.UNDISPLAY*/"undisplay",this,this._onDisplay);
	}

	/**
	*@private
	*/
	__proto._loop=function(){
		if (this._visible && this._sources){
			this._index++;
			if (this._toIndex >-1 && this._index >=this._toIndex)this.stop();
			else if (this._index >=this._sources.length)this._index=0;
			this.index=this._index;
		}
	}

	/**
	*停止动画。
	*/
	__proto.stop=function(){
		this._isPlaying=false;
		Laya.timer.clear(this,this._loop);
		this.event(/*laya.events.Event.COMPLETE*/"complete");
	}

	/**@private */
	__proto._setClipChanged=function(){
		if (!this._clipChanged){
			this._clipChanged=true;
			this.callLater(this.changeClip);
		}
	}

	/**
	*表示动画播放间隔时间(以毫秒为单位)。
	*/
	__getset(0,__proto,'interval',function(){
		return this._interval;
		},function(value){
		if (this._interval !=value){
			this._interval=value;
			if (this._isPlaying)this.play();
		}
	});

	/**
	*@copy laya.ui.Image#skin
	*/
	__getset(0,__proto,'skin',function(){
		return this._skin;
		},function(value){
		if (this._skin !=value){
			this._skin=value;
			if (value){
				if(!Loader.getRes(value)){
					Laya.loader.load(this._skin,Handler.create(this,this._skinLoaded),null,/*laya.net.Loader.IMAGE*/"image",1);
					}else{
					this._skinLoaded();
				}
				}else {
				this._bitmap.source=null;
			}
		}
	});

	/**
	*源数据。
	*/
	__getset(0,__proto,'sources',function(){
		return this._sources;
		},function(value){
		this._sources=value;
		this.index=this._index;
		this.event(/*laya.events.Event.LOADED*/"loaded");
	});

	/**X轴（横向）切片数量。*/
	__getset(0,__proto,'clipX',function(){
		return this._clipX;
		},function(value){
		this._clipX=value || 1;
		this._setClipChanged()
	});

	/**Y轴(竖向)切片数量。*/
	__getset(0,__proto,'clipY',function(){
		return this._clipY;
		},function(value){
		this._clipY=value || 1;
		this._setClipChanged()
	});

	/**
	*切片动画的总帧数。
	*/
	__getset(0,__proto,'total',function(){
		this.runCallLater(this.changeClip);
		return this._sources ? this._sources.length :0;
	});

	/**
	*横向分割时每个切片的宽度，与 <code>clipX</code> 同时设置时优先级高于 <code>clipX</code> 。
	*/
	__getset(0,__proto,'clipWidth',function(){
		return this._clipWidth;
		},function(value){
		this._clipWidth=value;
		this._setClipChanged()
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

	/**
	*资源分组。
	*/
	__getset(0,__proto,'group',function(){
		return this._group;
		},function(value){
		if (value && this._skin)Loader.setGroup(this._skin,value);
		this._group=value;
	});

	/**
	*竖向分割时每个切片的高度，与 <code>clipY</code> 同时设置时优先级高于 <code>clipY</code> 。
	*/
	__getset(0,__proto,'clipHeight',function(){
		return this._clipHeight;
		},function(value){
		this._clipHeight=value;
		this._setClipChanged()
	});

	/**@inheritDoc */
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(UIComponent,this,'width',value);
		this._bitmap.width=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(UIComponent,this,'height',value);
		this._bitmap.height=value;
	});

	/**
	*当前帧索引。
	*/
	__getset(0,__proto,'index',function(){
		return this._index;
		},function(value){
		this._index=value;
		this._bitmap && this._sources && (this._bitmap.source=this._sources[value]);
		this.event(/*laya.events.Event.CHANGE*/"change");
	});

	/**
	*表示是否自动播放动画，若自动播放值为true,否则值为false;
	*<p>可控制切片动画的播放、停止。</p>
	*/
	__getset(0,__proto,'autoPlay',function(){
		return this._autoPlay;
		},function(value){
		if (this._autoPlay !=value){
			this._autoPlay=value;
			value ? this.play():this.stop();
		}
	});

	/**
	*表示动画的当前播放状态。
	*如果动画正在播放中，则为true，否则为flash。
	*/
	__getset(0,__proto,'isPlaying',function(){
		return this._isPlaying;
		},function(value){
		this._isPlaying=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if (((typeof value=='number')&& Math.floor(value)==value)|| (typeof value=='string'))this.index=parseInt(value);
		else Laya.superSet(UIComponent,this,'dataSource',value);
	});

	/**
	
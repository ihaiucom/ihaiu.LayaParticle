/**
*<code>Image</code> 类是用于表示位图图像或绘制图形的显示对象。
*Image和Clip组件是唯一支持异步加载的两个组件，比如img.skin="abc/xxx.png"，其他UI组件均不支持异步加载。
*
*@example <caption>以下示例代码，创建了一个新的 <code>Image</code> 实例，设置了它的皮肤、位置信息，并添加到舞台上。</caption>
*package
*{
	*import laya.ui.Image;
	*public class Image_Example
	*{
		*public function Image_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*onInit();
			*}
		*private function onInit():void
		*{
			*var bg:Image=new Image("resource/ui/bg.png");//创建一个 Image 类的实例对象 bg ,并传入它的皮肤。
			*bg.x=100;//设置 bg 对象的属性 x 的值，用于控制 bg 对象的显示位置。
			*bg.y=100;//设置 bg 对象的属性 y 的值，用于控制 bg 对象的显示位置。
			*bg.sizeGrid="40,10,5,10";//设置 bg 对象的网格信息。
			*bg.width=150;//设置 bg 对象的宽度。
			*bg.height=250;//设置 bg 对象的高度。
			*Laya.stage.addChild(bg);//将此 bg 对象添加到显示列表。
			*var image:Image=new Image("resource/ui/image.png");//创建一个 Image 类的实例对象 image ,并传入它的皮肤。
			*image.x=100;//设置 image 对象的属性 x 的值，用于控制 image 对象的显示位置。
			*image.y=100;//设置 image 对象的属性 y 的值，用于控制 image 对象的显示位置。
			*Laya.stage.addChild(image);//将此 image 对象添加到显示列表。
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*onInit();
*function onInit(){
	*var bg=new laya.ui.Image("resource/ui/bg.png");//创建一个 Image 类的实例对象 bg ,并传入它的皮肤。
	*bg.x=100;//设置 bg 对象的属性 x 的值，用于控制 bg 对象的显示位置。
	*bg.y=100;//设置 bg 对象的属性 y 的值，用于控制 bg 对象的显示位置。
	*bg.sizeGrid="40,10,5,10";//设置 bg 对象的网格信息。
	*bg.width=150;//设置 bg 对象的宽度。
	*bg.height=250;//设置 bg 对象的高度。
	*Laya.stage.addChild(bg);//将此 bg 对象添加到显示列表。
	*var image=new laya.ui.Image("resource/ui/image.png");//创建一个 Image 类的实例对象 image ,并传入它的皮肤。
	*image.x=100;//设置 image 对象的属性 x 的值，用于控制 image 对象的显示位置。
	*image.y=100;//设置 image 对象的属性 y 的值，用于控制 image 对象的显示位置。
	*Laya.stage.addChild(image);//将此 image 对象添加到显示列表。
	*}
*@example
*class Image_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*this.onInit();
		*}
	*private onInit():void {
		*var bg:laya.ui.Image=new laya.ui.Image("resource/ui/bg.png");//创建一个 Image 类的实例对象 bg ,并传入它的皮肤。
		*bg.x=100;//设置 bg 对象的属性 x 的值，用于控制 bg 对象的显示位置。
		*bg.y=100;//设置 bg 对象的属性 y 的值，用于控制 bg 对象的显示位置。
		*bg.sizeGrid="40,10,5,10";//设置 bg 对象的网格信息。
		*bg.width=150;//设置 bg 对象的宽度。
		*bg.height=250;//设置 bg 对象的高度。
		*Laya.stage.addChild(bg);//将此 bg 对象添加到显示列表。
		*var image:laya.ui.Image=new laya.ui.Image("resource/ui/image.png");//创建一个 Image 类的实例对象 image ,并传入它的皮肤。
		*image.x=100;//设置 image 对象的属性 x 的值，用于控制 image 对象的显示位置。
		*image.y=100;//设置 image 对象的属性 y 的值，用于控制 image 对象的显示位置。
		*Laya.stage.addChild(image);//将此 image 对象添加到显示列表。
		*}
	*}
*@see laya.ui.AutoBitmap
*/
//class laya.ui.Image extends laya.ui.UIComponent
var Image=(function(_super){
	function Image(skin){
		/**@private */
		this._bitmap=null;
		/**@private */
		this._skin=null;
		/**@private */
		this._group=null;
		Image.__super.call(this);
		this.skin=skin;
	}

	__class(Image,'laya.ui.Image',_super);
	var __proto=Image.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,true);
		this._bitmap && this._bitmap.destroy();
		this._bitmap=null;
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
		this._bitmap.autoCacheCmd=false;
	}

	/**
	*@private
	*设置皮肤资源。
	*/
	__proto.setSource=function(url,img){
		if (url===this._skin && img){
			this.source=img
			this.onCompResize();
		}
	}

	/**@inheritDoc */
	__proto.measureWidth=function(){
		return this._bitmap.width;
	}

	/**@inheritDoc */
	__proto.measureHeight=function(){
		return this._bitmap.height;
	}

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if ((typeof value=='string'))this.skin=value;
		else Laya.superSet(UIComponent,this,'dataSource',value);
	});

	/**
	*@copy laya.ui.AutoBitmap#source
	*/
	__getset(0,__proto,'source',function(){
		return this._bitmap.source;
		},function(value){
		if (!this._bitmap)return;
		this._bitmap.source=value;
		this.event(/*laya.events.Event.LOADED*/"loaded");
		this.repaint();
	});

	/**
	*<p>对象的皮肤地址，以字符串表示。</p>
	*<p>如果资源未加载，则先加载资源，加载完成后应用于此对象。</p>
	*<b>注意：</b>资源加载完成后，会自动缓存至资源库中。
	*/
	__getset(0,__proto,'skin',function(){
		return this._skin;
		},function(value){
		if (this._skin !=value){
			this._skin=value;
			if (value){
				var source=Loader.getRes(value);
				if (source){
					this.source=source;
					this.onCompResize();
				}else Laya.loader.load(this._skin,Handler.create(this,this.setSource,[this._skin]),null,/*laya.net.Loader.IMAGE*/"image",1,true,this._group);
				}else {
				this.source=null;
			}
		}
	});

	/**
	*<p>当前实例的位图 <code>AutoImage</code> 实例的有效缩放网格数据。</p>
	*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
	*<ul><li>例如："4,4,4,4,1"。</li></ul></p>
	*@see laya.ui.AutoBitmap#sizeGrid
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

	/**@inheritDoc */
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(UIComponent,this,'width',value);
		this._bitmap.width=value==0 ? 0.0000001 :value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(UIComponent,this,'height',value);
		this._bitmap.height=value==0 ? 0.0000001 :value;
	});

	return Image;
})(UIComponent)


/**
*使用 <code>Slider</code> 控件，用户可以通过在滑块轨道的终点之间移动滑块来选择值。
*<p>滑块的当前值由滑块端点（对应于滑块的最小值和最大值）之间滑块的相对位置确定。</p>
*<p>滑块允许最小值和最大值之间特定间隔内的值。滑块还可以使用数据提示显示其当前值。</p>
*
*@see laya.ui.HSlider
*@see laya.ui.VSlider
*/
//class laya.ui.Slider extends laya.ui.UIComponent
var Slider=(function(_super){
	function Slider(skin){
		/**
		*数据变化处理器。
		*<p>默认回调参数为滑块位置属性 <code>value</code>属性值：Number 。</p>
		*/
		this.changeHandler=null;
		/**
		*一个布尔值，指示是否为垂直滚动。如果值为true，则为垂直方向，否则为水平方向。
		*<p>默认值为：true。</p>
		*@default true
		*/
		this.isVertical=true;
		/**
		*一个布尔值，指示是否显示标签。
		*@default true
		*/
		this.showLabel=true;
		/**@private */
		this._allowClickBack=false;
		/**@private */
		this._max=100;
		/**@private */
		this._min=0;
		/**@private */
		this._tick=1;
		/**@private */
		this._value=0;
		/**@private */
		this._skin=null;
		/**@private */
		this._bg=null;
		/**@private */
		this._progress=null;
		/**@private */
		this._bar=null;
		/**@private */
		this._tx=NaN;
		/**@private */
		this._ty=NaN;
		/**@private */
		this._maxMove=NaN;
		/**@private */
		this._globalSacle=null;
		Slider.__super.call(this);
		this.skin=skin;
	}

	__class(Slider,'laya.ui.Slider',_super);
	var __proto=Slider.prototype;
	/**
	*@inheritDoc
	*/
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._bg && this._bg.destroy(destroyChild);
		this._bar && this._bar.destroy(destroyChild);
		this._progress && this._progress.destroy(destroyChild);
		this._bg=null;
		this._bar=null;
		this._progress=null;
		this.changeHandler=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._bg=new Image());
		this.addChild(this._bar=new Button());
	}

	/**@inheritDoc */
	__proto.initialize=function(){
		this._bar.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onBarMouseDown);
		this._bg.sizeGrid=this._bar.sizeGrid="4,4,4,4,0";
		if (this._progress)this._progress.sizeGrid=this._bar.sizeGrid;
		this.allowClickBack=true;
	}

	/**
	*@private
	*滑块的的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
	*/
	__proto.onBarMouseDown=function(e){
		this._globalSacle || (this._globalSacle=new Point());
		this._globalSacle.setTo(this.globalScaleX || 0.01,this.globalScaleY || 0.01);
		this._maxMove=this.isVertical ? (this.height-this._bar.height):(this.width-this._bar.width);
		this._tx=Laya.stage.mouseX;
		this._ty=Laya.stage.mouseY;
		Laya.stage.on(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this,this.mouseMove);
		Laya.stage.once(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.mouseUp);
		Laya.stage.once(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.mouseUp);
		this.showValueText();
	}

	/**
	*@private
	*显示标签。
	*/
	__proto.showValueText=function(){
		if (this.showLabel){
			var label=laya.ui.Slider.label;
			this.addChild(label);
			label.textField.changeText(this._value+"");
			if (this.isVertical){
				label.x=this._bar._x+20;
				label.y=(this._bar.height-label.height)*0.5+this._bar._y;
				}else {
				label.y=this._bar._y-20;
				label.x=(this._bar.width-label.width)*0.5+this._bar._x;
			}
		}
	}

	/**
	*@private
	*隐藏标签。
	*/
	__proto.hideValueText=function(){
		laya.ui.Slider.label && laya.ui.Slider.label.removeSelf();
	}

	/**
	*@private
	*/
	__proto.mouseUp=function(e){
		Laya.stage.off(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this,this.mouseMove);
		Laya.stage.off(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.mouseUp);
		Laya.stage.off(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.mouseUp);
		this.sendChangeEvent(/*laya.events.Event.CHANGED*/"changed");
		this.hideValueText();
	}

	/**
	*@private
	*/
	__proto.mouseMove=function(e){
		var oldValue=this._value;
		if (this.isVertical){
			this._bar.y+=(Laya.stage.mouseY-this._ty)/ this._globalSacle.y;
			if (this._bar._y > this._maxMove)this._bar.y=this._maxMove;
			else if (this._bar._y < 0)this._bar.y=0;
			this._value=this._bar._y / this._maxMove *(this._max-this._min)+this._min;
			if(this._progress)this._progress.height=this._bar._y+0.5*this._bar.height;
			}else {
			this._bar.x+=(Laya.stage.mouseX-this._tx)/ this._globalSacle.x;
			if (this._bar._x > this._maxMove)this._bar.x=this._maxMove;
			else if (this._bar._x < 0)this._bar.x=0;
			this._value=this._bar._x / this._maxMove *(this._max-this._min)+this._min;
			if(this._progress)this._progress.width=this._bar._x+0.5*this._bar.width;
		}
		this._tx=Laya.stage.mouseX;
		this._ty=Laya.stage.mouseY;
		if (this._tick !=0){
			var pow=Math.pow(10,(this._tick+"").length-1);
			this._value=Math.round(Math.round(this._value / this._tick)*this._tick *pow)/ pow;
		}
		if (this._value !=oldValue){
			this.sendChangeEvent();
		}
		this.showValueText();
	}

	/**
	*@private
	*/
	__proto.sendChangeEvent=function(type){
		(type===void 0)&& (type=/*laya.events.Event.CHANGE*/"change");
		this.event(type);
		this.changeHandler && this.changeHandler.runWith(this._value);
	}

	__proto._skinLoaded=function(){
		this._bg.skin=this._skin;
		this._bar.skin=this._skin.replace(".png","$bar.png");
		var progressSkin=this._skin.replace(".png","$progress.png");
		if (Loader.getRes(progressSkin)){
			if (!this._progress){
				this.addChild(this._progress=new Image());
				this._progress.sizeGrid=this._bar.sizeGrid;
				this.setChildIndex(this._progress,1);
			}
			this._progress.skin=progressSkin;
		}
		this.setBarPoint();
		this.callLater(this.changeValue);
		this._sizeChanged();
		this.event(/*laya.events.Event.LOADED*/"loaded");
	}

	/**
	*@private
	*设置滑块的位置信息。
	*/
	__proto.setBarPoint=function(){
		if (this.isVertical)this._bar.x=Math.round((this._bg.width-this._bar.width)*0.5);
		else this._bar.y=Math.round((this._bg.height-this._bar.height)*0.5);
	}

	/**@inheritDoc */
	__proto.measureWidth=function(){
		return Math.max(this._bg.width,this._bar.width);
	}

	/**@inheritDoc */
	__proto.measureHeight=function(){
		return Math.max(this._bg.height,this._bar.height);
	}

	/**@inheritDoc */
	__proto._sizeChanged=function(){
		_super.prototype._sizeChanged.call(this);
		if (this.isVertical)this._bg.height=this.height;
		else this._bg.width=this.width;
		this.setBarPoint();
		this.changeValue();
	}

	/**
	*设置滑动条的信息。
	*@param min 滑块的最小值。
	*@param max 滑块的最小值。
	*@param value 滑块的当前值。
	*/
	__proto.setSlider=function(min,max,value){
		this._value=-1;
		this._min=min;
		this._max=max > min ? max :min;
		this.value=value < min ? min :value > max ? max :value;
	}

	/**
	*@private
	*改变滑块的位置值。
	*/
	__proto.changeValue=function(){
		if (this.tick !=0){
			var pow=Math.pow(10,(this._tick+"").length-1);
			this._value=Math.round(Math.round(this._value / this._tick)*this._tick *pow)/ pow;
		}
		this._value=this._value > this._max ? this._max :this._value < this._min ? this._min :this._value;
		var num=this._max-this._min;
		if (num===0)num=1;
		if (this.isVertical){
			this._bar.y=(this._value-this._min)/ num *(this.height-this._bar.height);
			if(this._progress)this._progress.height=this._bar._y+0.5*this._bar.height;
		}
		else{
			this._bar.x=(this._value-this._min)/ num *(this.width-this._bar.width);
			if(this._progress)this._progress.width=this._bar._x+0.5*this._bar.width;
		}
	}

	/**
	*@private
	*滑动条的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
	*/
	__proto.onBgMouseDown=function(e){
		var point=this._bg.getMousePoint();
		if (this.isVertical)this.value=point.y / (this.height-this._bar.height)*(this._max-this._min)+this._min;
		else this.value=point.x / (this.width-this._bar.width)*(this._max-this._min)+this._min;
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
				Laya.loader.load([this._skin,this._skin.replace(".png","$bar.png")],Handler.create(this,this._skinLoaded));
				}else{
				this._skinLoaded();
			}
		}
	});

	/**
	*滑动的刻度值，滑动数值为tick的整数倍。默认值为1。
	*/
	__getset(0,__proto,'tick',function(){
		return this._tick;
		},function(value){
		if (this._tick !=value){
			this._tick=value;
			this.callLater(this.changeValue);
		}
	});

	/**
	*<p>当前实例的背景图（ <code>Image</code> ）和滑块按钮（ <code>Button</code> ）实例的有效缩放网格数据。</p>
	*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
	*<ul><li>例如："4,4,4,4,1"</li></ul></p>
	*@see laya.ui.AutoBitmap.sizeGrid
	*/
	__getset(0,__proto,'sizeGrid',function(){
		return this._bg.sizeGrid;
		},function(value){
		this._bg.sizeGrid=value;
		this._bar.sizeGrid=value;
		if (this._progress)this._progress.sizeGrid=this._bar.sizeGrid;
	});

	/**
	*一个布尔值，指定是否允许通过点击滑动条改变 <code>Slider</code> 的 <code>value</code> 属性值。
	*/
	__getset(0,__proto,'allowClickBack',function(){
		return this._allowClickBack;
		},function(value){
		if (this._allowClickBack !=value){
			this._allowClickBack=value;
			if (value)this._bg.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onBgMouseDown);
			else this._bg.off(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onBgMouseDown);
		}
	});

	/**
	*获取或设置表示最高位置的数字。 默认值为100。
	*/
	__getset(0,__proto,'max',function(){
		return this._max;
		},function(value){
		if (this._max !=value){
			this._max=value;
			this.callLater(this.changeValue);
		}
	});

	/**
	*获取或设置表示最低位置的数字。 默认值为0。
	*/
	__getset(0,__proto,'min',function(){
		return this._min;
		},function(value){
		if (this._min !=value){
			this._min=value;
			this.callLater(this.changeValue);
		}
	});

	/**
	*表示滑块按钮的引用。
	*/
	__getset(0,__proto,'bar',function(){
		return this._bar;
	});

	/**
	*获取或设置表示当前滑块位置的数字。
	*/
	__getset(0,__proto,'value',function(){
		return this._value;
		},function(num){
		if (this._value !=num){
			var oldValue=this._value;
			this._value=num;
			this.changeValue();
			if (this._value !=oldValue){
				this.sendChangeEvent();
			}
		}
	});

	__static(Slider,
	['label',function(){return this.label=new Label();}
	]);
	return Slider;
})(UIComponent)


/**
*<p> <code>Label</code> 类用于创建显示对象以显示文本。</p>
*
*@example <caption>以下示例代码，创建了一个 <code>Label</code> 实例。</caption>
*package
*{
	*import laya.ui.Label;
	*public class Label_Example
	*{
		*public function Label_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*onInit();
			*}
		*private function onInit():void
		*{
			*var label:Label=new Label();//创建一个 Label 类的实例对象 label 。
			*label.font="Arial";//设置 label 的字体。
			*label.bold=true;//设置 label 显示为粗体。
			*label.leading=4;//设置 label 的行间距。
			*label.wordWrap=true;//设置 label 自动换行。
			*label.padding="10,10,10,10";//设置 label 的边距。
			*label.color="#ff00ff";//设置 label 的颜色。
			*label.text="Hello everyone,我是一个可爱的文本！";//设置 label 的文本内容。
			*label.x=100;//设置 label 对象的属性 x 的值，用于控制 label 对象的显示位置。
			*label.y=100;//设置 label 对象的属性 y 的值，用于控制 label 对象的显示位置。
			*label.width=300;//设置 label 的宽度。
			*label.height=200;//设置 label 的高度。
			*Laya.stage.addChild(label);//将 label 添加到显示列表。
			*var passwordLabel:Label=new Label("请原谅我，我不想被人看到我心里话。");//创建一个 Label 类的实例对象 passwordLabel 。
			*passwordLabel.asPassword=true;//设置 passwordLabel 的显示反式为密码显示。
			*passwordLabel.x=100;//设置 passwordLabel 对象的属性 x 的值，用于控制 passwordLabel 对象的显示位置。
			*passwordLabel.y=350;//设置 passwordLabel 对象的属性 y 的值，用于控制 passwordLabel 对象的显示位置。
			*passwordLabel.width=300;//设置 passwordLabel 的宽度。
			*passwordLabel.color="#000000";//设置 passwordLabel 的文本颜色。
			*passwordLabel.bgColor="#ccffff";//设置 passwordLabel 的背景颜色。
			*passwordLabel.fontSize=20;//设置 passwordLabel 的文本字体大小。
			*Laya.stage.addChild(passwordLabel);//将 passwordLabel 添加到显示列表。
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*onInit();
*function onInit(){
	*var label=new laya.ui.Label();//创建一个 Label 类的实例对象 label 。
	*label.font="Arial";//设置 label 的字体。
	*label.bold=true;//设置 label 显示为粗体。
	*label.leading=4;//设置 label 的行间距。
	*label.wordWrap=true;//设置 label 自动换行。
	*label.padding="10,10,10,10";//设置 label 的边距。
	*label.color="#ff00ff";//设置 label 的颜色。
	*label.text="Hello everyone,我是一个可爱的文本！";//设置 label 的文本内容。
	*label.x=100;//设置 label 对象的属性 x 的值，用于控制 label 对象的显示位置。
	*label.y=100;//设置 label 对象的属性 y 的值，用于控制 label 对象的显示位置。
	*label.width=300;//设置 label 的宽度。
	*label.height=200;//设置 label 的高度。
	*Laya.stage.addChild(label);//将 label 添加到显示列表。
	*var passwordLabel=new laya.ui.Label("请原谅我，我不想被人看到我心里话。");//创建一个 Label 类的实例对象 passwordLabel 。
	*passwordLabel.asPassword=true;//设置 passwordLabel 的显示反式为密码显示。
	*passwordLabel.x=100;//设置 passwordLabel 对象的属性 x 的值，用于控制 passwordLabel 对象的显示位置。
	*passwordLabel.y=350;//设置 passwordLabel 对象的属性 y 的值，用于控制 passwordLabel 对象的显示位置。
	*passwordLabel.width=300;//设置 passwordLabel 的宽度。
	*passwordLabel.color="#000000";//设置 passwordLabel 的文本颜色。
	*passwordLabel.bgColor="#ccffff";//设置 passwordLabel 的背景颜色。
	*passwordLabel.fontSize=20;//设置 passwordLabel 的文本字体大小。
	*Laya.stage.addChild(passwordLabel);//将 passwordLabel 添加到显示列表。
	*}
*@example
*import Label=laya.ui.Label;
*class Label_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*this.onInit();
		*}
	*private onInit():void {
		*var label:Label=new Label();//创建一个 Label 类的实例对象 label 。
		*label.font="Arial";//设置 label 的字体。
		*label.bold=true;//设置 label 显示为粗体。
		*label.leading=4;//设置 label 的行间距。
		*label.wordWrap=true;//设置 label 自动换行。
		*label.padding="10,10,10,10";//设置 label 的边距。
		*label.color="#ff00ff";//设置 label 的颜色。
		*label.text="Hello everyone,我是一个可爱的文本！";//设置 label 的文本内容。
		*label.x=100;//设置 label 对象的属性 x 的值，用于控制 label 对象的显示位置。
		*label.y=100;//设置 label 对象的属性 y 的值，用于控制 label 对象的显示位置。
		*label.width=300;//设置 label 的宽度。
		*label.height=200;//设置 label 的高度。
		*Laya.stage.addChild(label);//将 label 添加到显示列表。
		*var passwordLabel:Label=new Label("请原谅我，我不想被人看到我心里话。");//创建一个 Label 类的实例对象 passwordLabel 。
		*passwordLabel.asPassword=true;//设置 passwordLabel 的显示反式为密码显示。
		*passwordLabel.x=100;//设置 passwordLabel 对象的属性 x 的值，用于控制 passwordLabel 对象的显示位置。
		*passwordLabel.y=350;//设置 passwordLabel 对象的属性 y 的值，用于控制 passwordLabel 对象的显示位置。
		*passwordLabel.width=300;//设置 passwordLabel 的宽度。
		*passwordLabel.color="#000000";//设置 passwordLabel 的文本颜色。
		*passwordLabel.bgColor="#ccffff";//设置 passwordLabel 的背景颜色。
		*passwordLabel.fontSize=20;//设置 passwordLabel 的文本字体大小。
		*Laya.stage.addChild(passwordLabel);//将 passwordLabel 添加到显示列表。
		*}
	*}
*@see laya.display.Text
*/
//class laya.ui.Label extends laya.ui.UIComponent
var Label=(function(_super){
	function Label(text){
		/**
		*@private
		*文本 <code>Text</code> 实例。
		*/
		this._tf=null;
		Label.__super.call(this);
		(text===void 0)&& (text="");
		this.text=text;
	}

	__class(Label,'laya.ui.Label',_super);
	var __proto=Label.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._tf=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._tf=new Text());
	}

	/**@copy laya.display.Text#changeText()
	**/
	__proto.changeText=function(text){
		this._tf.changeText(text);
	}

	/**
	*@inheritDoc
	*/
	__proto.measureWidth=function(){
		return this._tf.width;
	}

	/**
	*@inheritDoc
	*/
	__proto.measureHeight=function(){
		return this._tf.height;
	}

	/**
	*<p>边距信息</p>
	*<p>"上边距，右边距，下边距 , 左边距（边距以像素为单位）"</p>
	*@see laya.display.Text.padding
	*/
	__getset(0,__proto,'padding',function(){
		return this._tf.padding.join(",");
		},function(value){
		this._tf.padding=UIUtils.fillArray(Styles.labelPadding,value,Number);
	});

	/**
	*@copy laya.display.Text#bold
	*/
	__getset(0,__proto,'bold',function(){
		return this._tf.bold;
		},function(value){
		this._tf.bold=value;
	});

	/**
	*@copy laya.display.Text#align
	*/
	__getset(0,__proto,'align',function(){
		return this._tf.align;
		},function(value){
		this._tf.align=value;
	});

	/**
	*当前文本内容字符串。
	*@see laya.display.Text.text
	*/
	__getset(0,__proto,'text',function(){
		return this._tf.text;
		},function(value){
		if (this._tf.text !=value){
			if(value)
				value=UIUtils.adptString(value+"");
			this._tf.text=value;
			this.event(/*laya.events.Event.CHANGE*/"change");
			if (!this._width || !this._height)this.onCompResize();
		}
	});

	/**
	*@copy laya.display.Text#italic
	*/
	__getset(0,__proto,'italic',function(){
		return this._tf.italic;
		},function(value){
		this._tf.italic=value;
	});

	/**
	*@copy laya.display.Text#wordWrap
	*/
	/**
	*@copy laya.display.Text#wordWrap
	*/
	__getset(0,__proto,'wordWrap',function(){
		return this._tf.wordWrap;
		},function(value){
		this._tf.wordWrap=value;
	});

	/**
	*@copy laya.display.Text#font
	*/
	__getset(0,__proto,'font',function(){
		return this._tf.font;
		},function(value){
		this._tf.font=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if ((typeof value=='number')|| (typeof value=='string'))this.text=value+"";
		else Laya.superSet(UIComponent,this,'dataSource',value);
	});

	/**
	*@copy laya.display.Text#color
	*/
	__getset(0,__proto,'color',function(){
		return this._tf.color;
		},function(value){
		this._tf.color=value;
	});

	/**
	*@copy laya.display.Text#valign
	*/
	__getset(0,__proto,'valign',function(){
		return this._tf.valign;
		},function(value){
		this._tf.valign=value;
	});

	/**
	*@copy laya.display.Text#leading
	*/
	__getset(0,__proto,'leading',function(){
		return this._tf.leading;
		},function(value){
		this._tf.leading=value;
	});

	/**
	*@copy laya.display.Text#fontSize
	*/
	__getset(0,__proto,'fontSize',function(){
		return this._tf.fontSize;
		},function(value){
		this._tf.fontSize=value;
	});

	/**
	*@copy laya.display.Text#bgColor
	*/
	__getset(0,__proto,'bgColor',function(){
		return this._tf.bgColor
		},function(value){
		this._tf.bgColor=value;
	});

	/**
	*@copy laya.display.Text#borderColor
	*/
	__getset(0,__proto,'borderColor',function(){
		return this._tf.borderColor
		},function(value){
		this._tf.borderColor=value;
	});

	/**
	*@copy laya.display.Text#stroke
	*/
	__getset(0,__proto,'stroke',function(){
		return this._tf.stroke;
		},function(value){
		this._tf.stroke=value;
	});

	/**
	*@copy laya.display.Text#strokeColor
	*/
	__getset(0,__proto,'strokeColor',function(){
		return this._tf.strokeColor;
		},function(value){
		this._tf.strokeColor=value;
	});

	/**
	*文本控件实体 <code>Text</code> 实例。
	*/
	__getset(0,__proto,'textField',function(){
		return this._tf;
	});

	/**
	*@inheritDoc
	*/
	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'width',function(){
		if (this._width || this._tf.text)return Laya.superGet(UIComponent,this,'width');
		return 0;
		},function(value){
		Laya.superSet(UIComponent,this,'width',value);
		this._tf.width=value;
	});

	/**
	*@inheritDoc
	*/
	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'height',function(){
		if (this._height || this._tf.text)return Laya.superGet(UIComponent,this,'height');
		return 0;
		},function(value){
		Laya.superSet(UIComponent,this,'height',value);
		this._tf.height=value;
	});

	/**
	*@copy laya.display.Text#overflow
	*/
	/**
	*@copy laya.display.Text#overflow
	*/
	__getset(0,__proto,'overflow',function(){
		return this._tf.overflow;
		},function(value){
		this._tf.overflow=value;
	});

	/**
	*@copy laya.display.Text#underline
	*/
	/**
	*@copy laya.display.Text#underline
	*/
	__getset(0,__proto,'underline',function(){
		return this._tf.underline;
		},function(value){
		this._tf.underline=value;
	});

	/**
	*@copy laya.display.Text#underlineColor
	*/
	/**
	*@copy laya.display.Text#underlineColor
	*/
	__getset(0,__proto,'underlineColor',function(){
		return this._tf.underlineColor;
		},function(value){
		this._tf.underlineColor=value;
	});

	return Label;
})(UIComponent)


/**

*/
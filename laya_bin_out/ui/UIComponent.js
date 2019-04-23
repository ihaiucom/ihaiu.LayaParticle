/**
*<code>Component</code> 是ui控件类的基类。
*<p>生命周期：preinitialize > createChildren > initialize > 组件构造函数</p>
*/
//class laya.ui.UIComponent extends laya.display.Sprite
var UIComponent=(function(_super){
	function UIComponent(){
		/**@private 控件的数据源。 */
		this._dataSource=null;
		/**@private 鼠标悬停提示 */
		this._toolTip=null;
		/**@private 标签 */
		this._tag=null;
		/**@private 禁用 */
		this._disabled=false;
		/**@private 变灰*/
		this._gray=false;
		UIComponent.__super.call(this);
		this._anchorX=NaN;
		this._anchorY=NaN;
		this._widget=Widget.EMPTY;
		this.preinitialize();
		this.createChildren();
		this.initialize();
	}

	__class(UIComponent,'laya.ui.UIComponent',_super);
	var __proto=UIComponent.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._dataSource=null;
		this._tag=null;
		this._toolTip=null;
	}

	/**
	*<p>预初始化。</p>
	*@internal 子类可在此函数内设置、修改属性默认值
	*/
	__proto.preinitialize=function(){}
	/**
	*<p>创建并添加控件子节点。</p>
	*@internal 子类可在此函数内创建并添加子节点。
	*/
	__proto.createChildren=function(){}
	/**
	*<p>控件初始化。</p>
	*@internal 在此子对象已被创建，可以对子对象进行修改。
	*/
	__proto.initialize=function(){}
	/**
	*<p>显示对象的实际显示区域宽度（以像素为单位）。</p>
	*/
	__proto.measureWidth=function(){
		var max=0;
		this.commitMeasure();
		for (var i=this.numChildren-1;i >-1;i--){
			var comp=this.getChildAt(i);
			if (comp._visible){
				max=Math.max(comp._x+comp.width *comp.scaleX,max);
			}
		}
		return max;
	}

	/**
	*<p>立即执行影响宽高度量的延迟调用函数。</p>
	*@internal <p>使用 <code>runCallLater</code> 函数，立即执行影响宽高度量的延迟运行函数(使用 <code>callLater</code> 设置延迟执行函数)。</p>
	*@see #callLater()
	*@see #runCallLater()
	*/
	__proto.commitMeasure=function(){}
	/**
	*<p>显示对象的实际显示区域高度（以像素为单位）。</p>
	*/
	__proto.measureHeight=function(){
		var max=0;
		this.commitMeasure();
		for (var i=this.numChildren-1;i >-1;i--){
			var comp=this.getChildAt(i);
			if (comp._visible){
				max=Math.max(comp._y+comp.height *comp.scaleY,max);
			}
		}
		return max;
	}

	__proto._sizeChanged=function(){
		if (!isNaN(this._anchorX))this.pivotX=this.anchorX *this.width;
		if (!isNaN(this._anchorY))this.pivotY=this.anchorY *this.height;
		this.event(/*laya.events.Event.RESIZE*/"resize");
		if (this._widget!==Widget.EMPTY)this._widget.resetLayout();
	}

	/**
	*对象的 <code>Event.MOUSE_OVER</code> 事件侦听处理函数。
	*/
	__proto.onMouseOver=function(e){
		Laya.stage.event(/*laya.ui.UIEvent.SHOW_TIP*/"showtip",this._toolTip);
	}

	/**
	*对象的 <code>Event.MOUSE_OUT</code> 事件侦听处理函数。
	*/
	__proto.onMouseOut=function(e){
		Laya.stage.event(/*laya.ui.UIEvent.HIDE_TIP*/"hidetip",this._toolTip);
	}

	/**
	*@private
	*<p>获取对象的布局样式。请不要直接修改此对象</p>
	*/
	__proto._getWidget=function(){
		this._widget===Widget.EMPTY && (this._widget=this.addComponent(Widget));
		return this._widget;
	}

	/**@private */
	__proto.onCompResize=function(){
		this._sizeChanged();
	}

	__proto._childChanged=function(child){
		this.callLater(this._sizeChanged);
		_super.prototype._childChanged.call(this,child);
	}

	/**
	*<p>在父容器中，此对象的垂直方向中轴线与父容器的垂直方向中心线的距离（以像素为单位）。</p>
	*/
	__getset(0,__proto,'centerY',function(){
		return this._widget.centerY;
		},function(value){
		if (value !=this._widget.centerY){
			this._getWidget().centerY=value;
		}
	});

	/**@inheritDoc */
	/**
	*<p>表示显示对象的宽度，以像素为单位。</p>
	*<p><b>注：</b>当值为0时，宽度为自适应大小。</p>
	*/
	__getset(0,__proto,'width',function(){
		if (this._width)return this._width;
		return this.measureWidth();
		},function(value){
		if (Laya.superGet(Sprite,this,'width')==value)return;
		Laya.superSet(Sprite,this,'width',value);
		this.callLater(this._sizeChanged);
	});

	/**
	*<p>从组件底边到其内容区域底边之间的垂直距离（以像素为单位）。</p>
	*/
	__getset(0,__proto,'bottom',function(){
		return this._widget.bottom;
		},function(value){
		if (value !=this._widget.bottom){
			this._getWidget().bottom=value;
		}
	});

	/**@inheritDoc */
	/**
	*<p>表示显示对象的高度，以像素为单位。</p>
	*<p><b>注：</b>当值为0时，高度为自适应大小。</p>
	*/
	__getset(0,__proto,'height',function(){
		if (this._height)return this._height;
		return this.measureHeight();
		},function(value){
		if (Laya.superGet(Sprite,this,'height')==value)return;
		Laya.superSet(Sprite,this,'height',value);
		this.callLater(this._sizeChanged);
	});

	/**
	*<p>从组件左边到其内容区域左边之间的水平距离（以像素为单位）。</p>
	*/
	__getset(0,__proto,'left',function(){
		return this._widget.left;
		},function(value){
		if (value !=this._widget.left){
			this._getWidget().left=value;
		}
	});

	/**
	*<p>数据赋值，通过对UI赋值来控制UI显示逻辑。</p>
	*<p>简单赋值会更改组件的默认属性，使用大括号可以指定组件的任意属性进行赋值。</p>
	*@example
	//默认属性赋值
	dataSource={label1:"改变了label",checkbox1:true};//(更改了label1的text属性值，更改checkbox1的selected属性)。
	//任意属性赋值
	dataSource={label2:{text:"改变了label",size:14},checkbox2:{selected:true,x:10}};
	*/
	__getset(0,__proto,'dataSource',function(){
		return this._dataSource;
		},function(value){
		this._dataSource=value;
		for (var prop in this._dataSource){
			if (this.hasOwnProperty(prop)&& !((typeof (this[prop])=='function'))){
				this[prop]=this._dataSource[prop];
			}
		}
	});

	/**
	*<p>在父容器中，此对象的水平方向中轴线与父容器的水平方向中心线的距离（以像素为单位）。</p>
	*/
	__getset(0,__proto,'centerX',function(){
		return this._widget.centerX;
		},function(value){
		if (value !=this._widget.centerX){
			this._getWidget().centerX=value;
		}
	});

	/**
	*<p>从组件顶边到其内容区域顶边之间的垂直距离（以像素为单位）。</p>
	*/
	__getset(0,__proto,'top',function(){
		return this._widget.top;
		},function(value){
		if (value !=this._widget.top){
			this._getWidget().top=value;
		}
	});

	/**
	*<p>从组件右边到其内容区域右边之间的水平距离（以像素为单位）。</p>
	*/
	__getset(0,__proto,'right',function(){
		return this._widget.right;
		},function(value){
		if (value !=this._widget.right){
			this._getWidget().right=value;
		}
	});

	/**
	*<p>对象的标签。</p>
	*@internal 冗余字段，可以用来储存数据。
	*/
	__getset(0,__proto,'tag',function(){
		return this._tag;
		},function(value){
		this._tag=value;
	});

	/**
	*<p>鼠标悬停提示。</p>
	*<p>可以赋值为文本 <code>String</code> 或函数 <code>Handler</code> ，用来实现自定义样式的鼠标提示和参数携带等。</p>
	*@example
	*private var _testTips:TestTipsUI=new TestTipsUI();
	*private function testTips():void {
		//简单鼠标提示
		*btn2.toolTip="这里是鼠标提示&lt;b&gt;粗体&lt;/b&gt;&lt;br&gt;换行";
		//自定义的鼠标提示
		*btn1.toolTip=showTips1;
		//带参数的自定义鼠标提示
		*clip.toolTip=new Handler(this,showTips2,["clip"]);
		*}
	*private function showTips1():void {
		*_testTips.label.text="这里是按钮["+btn1.label+"]";
		*tip.addChild(_testTips);
		*}
	*private function showTips2(name:String):void {
		*_testTips.label.text="这里是"+name;
		*tip.addChild(_testTips);
		*}
	*/
	__getset(0,__proto,'toolTip',function(){
		return this._toolTip;
		},function(value){
		if (this._toolTip !=value){
			this._toolTip=value;
			if (value !=null){
				this.on(/*laya.events.Event.MOUSE_OVER*/"mouseover",this,this.onMouseOver);
				this.on(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onMouseOut);
				}else {
				this.off(/*laya.events.Event.MOUSE_OVER*/"mouseover",this,this.onMouseOver);
				this.off(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onMouseOut);
			}
		}
	});

	/**是否变灰。*/
	__getset(0,__proto,'gray',function(){
		return this._gray;
		},function(value){
		if (value!==this._gray){
			this._gray=value;
			UIUtils.gray(this,value);
		}
	});

	/**是否禁用页面，设置为true后，会变灰并且禁用鼠标。*/
	__getset(0,__proto,'disabled',function(){
		return this._disabled;
		},function(value){
		if (value!==this._disabled){
			this.gray=this._disabled=value;
			this.mouseEnabled=!value;
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'scaleX',_super.prototype._$get_scaleX,function(value){
		if (Laya.superGet(Sprite,this,'scaleX')==value)return;
		Laya.superSet(Sprite,this,'scaleX',value);
		this.event(/*laya.events.Event.RESIZE*/"resize");
	});

	/**@inheritDoc */
	__getset(0,__proto,'scaleY',_super.prototype._$get_scaleY,function(value){
		if (Laya.superGet(Sprite,this,'scaleY')==value)return;
		Laya.superSet(Sprite,this,'scaleY',value);
		this.event(/*laya.events.Event.RESIZE*/"resize");
	});

	/**X锚点，值为0-1，设置anchorX值最终通过pivotX值来改变节点轴心点。*/
	__getset(0,__proto,'anchorX',function(){
		return this._anchorX;
		},function(value){
		if (this._anchorX !=value){
			this._anchorX=value;
			this.callLater(this._sizeChanged);
		}
	});

	/**Y锚点，值为0-1，设置anchorY值最终通过pivotY值来改变节点轴心点。*/
	__getset(0,__proto,'anchorY',function(){
		return this._anchorY;
		},function(value){
		if (this._anchorY !=value){
			this._anchorY=value
			this.callLater(this._sizeChanged);
		}
	});

	return UIComponent;
})(Sprite)


/**

*/
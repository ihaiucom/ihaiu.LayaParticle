/**
*<code>View</code> 是一个视图类，2.0开始，更改继承至Scene类，相对于Scene，增加相对布局功能。
*/
//class laya.ui.View extends laya.display.Scene
var View=(function(_super){
	function View(){
		/**@private */
		this._watchMap={};
		/**@private 相对布局组件*/
		this._widget=null;
		/**@private 控件的数据源。 */
		this._dataSource=null;
		this._anchorX=NaN;
		this._anchorY=NaN;
		this._widget=Widget.EMPTY;
		View.__super.call(this);
	}

	__class(View,'laya.ui.View',_super);
	var __proto=View.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this._watchMap=null;
		_super.prototype.destroy.call(this,destroyChild);
	}

	/**@private */
	__proto.changeData=function(key){
		var arr=this._watchMap[key];
		if (!arr)return;
		for (var i=0,n=arr.length;i < n;i++){
			var watcher=arr[i];
			watcher.exe(this);
		}
	}

	/**@private */
	__proto._sizeChanged=function(){
		if (!isNaN(this._anchorX))this.pivotX=this.anchorX *this.width;
		if (!isNaN(this._anchorY))this.pivotY=this.anchorY *this.height;
		this.event(/*laya.events.Event.RESIZE*/"resize");
	}

	/**
	*@private
	*<p>获取对象的布局样式。请不要直接修改此对象</p>
	*/
	__proto._getWidget=function(){
		this._widget===Widget.EMPTY && (this._widget=this.addComponent(Widget));
		return this._widget;
	}

	/**@private 兼容老版本*/
	__proto.loadUI=function(path){
		var uiView=View.uiMap[path];
		View.uiMap && this.createView(uiView);
	}

	/**X锚点，值为0-1，设置anchorX值最终通过pivotX值来改变节点轴心点。*/
	__getset(0,__proto,'anchorX',function(){
		return this._anchorX;
		},function(value){
		if (this._anchorX !=value){
			this._anchorX=value;
			this.callLater(this._sizeChanged);
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
	*<p>从组件底边到其内容区域底边之间的垂直距离（以像素为单位）。</p>
	*/
	__getset(0,__proto,'bottom',function(){
		return this._widget.bottom;
		},function(value){
		if (value !=this._widget.bottom){
			this._getWidget().bottom=value;
		}
	});

	/**@see laya.ui.UIComponent#dataSource*/
	__getset(0,__proto,'dataSource',function(){
		return this._dataSource;
		},function(value){
		this._dataSource=value;
		for (var name in value){
			var comp=this.getChildByName(name);
			if ((comp instanceof laya.ui.UIComponent ))comp.dataSource=value[name];
			else if (this.hasOwnProperty(name)&& !((typeof (this[name])=='function')))this[name]=value[name];
		}
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
	*<p>从组件右边到其内容区域右边之间的水平距离（以像素为单位）。</p>
	*/
	__getset(0,__proto,'right',function(){
		return this._widget.right;
		},function(value){
		if (value !=this._widget.right){
			this._getWidget().right=value;
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

	View.regComponent=function(key,compClass){
		ClassUtils.regClass(key,compClass);
	}

	View.regViewRuntime=function(key,compClass){
		ClassUtils.regClass(key,compClass);
	}

	View.regUI=function(url,json){
		Laya.loader.cacheRes(url,json);
	}

	View.uiMap={};
	View.__init$=function(){
		ClassUtils.regShortClassName([ViewStack,Button,TextArea,ColorPicker,Box,ScaleBox,Button,CheckBox,Clip,ComboBox,UIComponent,HScrollBar,HSlider,Image,Label,List,Panel,ProgressBar,Radio,RadioGroup,ScrollBar,Slider,Tab,TextInput,View,Dialog,VScrollBar,VSlider,Tree,HBox,VBox,Sprite,Animation,Text,FontClip]);
	}

	return View;
})(Scene)


/**

*/
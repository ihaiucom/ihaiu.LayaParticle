/**
*<code>/**
*<code>ViewStack</code> 类用于视图堆栈类，用于视图的显示等设置处理。
*/
//class laya.ui.ViewStack extends laya.ui.Box
var ViewStack=(function(_super){
	function ViewStack(){
		/**@private */
		this._items=null;
		/**@private */
		this._selectedIndex=0;
		ViewStack.__super.call(this);
		this._setIndexHandler=Handler.create(this,this.setIndex,null,false);
	}

	__class(ViewStack,'laya.ui.ViewStack',_super);
	var __proto=ViewStack.prototype;
	Laya.imps(__proto,{"laya.ui.IItem":true})
	/**
	*批量设置视图对象。
	*@param views 视图对象数组。
	*/
	__proto.setItems=function(views){
		this.removeChildren();
		var index=0;
		for (var i=0,n=views.length;i < n;i++){
			var item=views[i];
			if (item){
				item.name="item"+index;
				this.addChild(item);
				index++;
			}
		}
		this.initItems();
	}

	/**
	*添加视图。
	*@internal 添加视图对象，并设置此视图对象的<code>name</code> 属性。
	*@param view 需要添加的视图对象。
	*/
	__proto.addItem=function(view){
		view.name="item"+this._items.length;
		this.addChild(view);
		this.initItems();
	}

	__proto._afterInited=function(){
		this.initItems();
	}

	/**
	*初始化视图对象集合。
	*/
	__proto.initItems=function(){
		this._items=[];
		for (var i=0;i < 10000;i++){
			var item=this.getChildByName("item"+i);
			if (item==null){
				break ;
			}
			this._items.push(item);
			item.visible=(i==this._selectedIndex);
		}
	}

	/**
	*@private
	*通过对象的索引设置项对象的 <code>selected</code> 属性值。
	*@param index 需要设置的对象的索引。
	*@param selected 表示对象的选中状态。
	*/
	__proto.setSelect=function(index,selected){
		if (this._items && index >-1 && index < this._items.length){
			this._items[index].visible=selected;
		}
	}

	/**
	*@private
	*设置属性<code>selectedIndex</code>的值。
	*@param index 选中项索引值。
	*/
	__proto.setIndex=function(index){
		this.selectedIndex=index;
	}

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if (((typeof value=='number')&& Math.floor(value)==value)|| (typeof value=='string')){
			this.selectedIndex=parseInt(value);
			}else {
			for (var prop in this._dataSource){
				if (this.hasOwnProperty(prop)){
					this[prop]=this._dataSource[prop];
				}
			}
		}
	});

	/**
	*表示当前视图索引。
	*/
	__getset(0,__proto,'selectedIndex',function(){
		return this._selectedIndex;
		},function(value){
		if (this._selectedIndex !=value){
			this.setSelect(this._selectedIndex,false);
			this._selectedIndex=value;
			this.setSelect(this._selectedIndex,true);
		}
	});

	/**
	*获取或设置当前选择的项对象。
	*/
	__getset(0,__proto,'selection',function(){
		return this._selectedIndex >-1 && this._selectedIndex < this._items.length ? this._items[this._selectedIndex] :null;
		},function(value){
		this.selectedIndex=this._items.indexOf(value);
	});

	/**
	*视图集合数组。
	*/
	__getset(0,__proto,'items',function(){
		return this._items;
	});

	/**
	*索引设置处理器。
	*<p>默认回调参数：index:int</p>
	*/
	__getset(0,__proto,'setIndexHandler',function(){
		return this._setIndexHandler;
		},function(value){
		this._setIndexHandler=value;
	});

	return ViewStack;
})(Box)


/**
*使用 <code>VSlider</code> 控件，用户可以通过在滑块轨道的终点之间移动滑块来选择值。
*<p> <code>VSlider</code> 控件采用垂直方向。滑块轨道从下往上扩展，而标签位于轨道的左右两侧。</p>
*
*@example <caption>以下示例代码，创建了一个 <code>VSlider</code> 实例。</caption>
*package
*{
	*import laya.ui.HSlider;
	*import laya.ui.VSlider;
	*import laya.utils.Handler;
	*public class VSlider_Example
	*{
		*private var vSlider:VSlider;
		*public function VSlider_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/vslider.png","resource/ui/vslider$bar.png"],Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*vSlider=new VSlider();//创建一个 VSlider 类的实例对象 vSlider 。
			*vSlider.skin="resource/ui/vslider.png";//设置 vSlider 的皮肤。
			*vSlider.min=0;//设置 vSlider 最低位置值。
			*vSlider.max=10;//设置 vSlider 最高位置值。
			*vSlider.value=2;//设置 vSlider 当前位置值。
			*vSlider.tick=1;//设置 vSlider 刻度值。
			*vSlider.x=100;//设置 vSlider 对象的属性 x 的值，用于控制 vSlider 对象的显示位置。
			*vSlider.y=100;//设置 vSlider 对象的属性 y 的值，用于控制 vSlider 对象的显示位置。
			*vSlider.changeHandler=new Handler(this,onChange);//设置 vSlider 位置变化处理器。
			*Laya.stage.addChild(vSlider);//把 vSlider 添加到显示列表。
			*}
		*private function onChange(value:Number):void
		*{
			*trace("滑块的位置： value="+value);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var vSlider;
*Laya.loader.load(["resource/ui/vslider.png","resource/ui/vslider$bar.png"],laya.utils.Handler.create(this,onLoadComplete));//加载资源。
*function onLoadComplete(){
	*vSlider=new laya.ui.VSlider();//创建一个 VSlider 类的实例对象 vSlider 。
	*vSlider.skin="resource/ui/vslider.png";//设置 vSlider 的皮肤。
	*vSlider.min=0;//设置 vSlider 最低位置值。
	*vSlider.max=10;//设置 vSlider 最高位置值。
	*vSlider.value=2;//设置 vSlider 当前位置值。
	*vSlider.tick=1;//设置 vSlider 刻度值。
	*vSlider.x=100;//设置 vSlider 对象的属性 x 的值，用于控制 vSlider 对象的显示位置。
	*vSlider.y=100;//设置 vSlider 对象的属性 y 的值，用于控制 vSlider 对象的显示位置。
	*vSlider.changeHandler=new laya.utils.Handler(this,onChange);//设置 vSlider 位置变化处理器。
	*Laya.stage.addChild(vSlider);//把 vSlider 添加到显示列表。
	*}
*function onChange(value){
	*console.log("滑块的位置： value="+value);
	*}
*@example
*import HSlider=laya.ui.HSlider;
*import VSlider=laya.ui.VSlider;
*import Handler=laya.utils.Handler;
*class VSlider_Example {
	*private vSlider:VSlider;
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/vslider.png","resource/ui/vslider$bar.png"],Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*this.vSlider=new VSlider();//创建一个 VSlider 类的实例对象 vSlider 。
		*this.vSlider.skin="resource/ui/vslider.png";//设置 vSlider 的皮肤。
		*this.vSlider.min=0;//设置 vSlider 最低位置值。
		*this.vSlider.max=10;//设置 vSlider 最高位置值。
		*this.vSlider.value=2;//设置 vSlider 当前位置值。
		*this.vSlider.tick=1;//设置 vSlider 刻度值。
		*this.vSlider.x=100;//设置 vSlider 对象的属性 x 的值，用于控制 vSlider 对象的显示位置。
		*this.vSlider.y=100;//设置 vSlider 对象的属性 y 的值，用于控制 vSlider 对象的显示位置。
		*this.vSlider.changeHandler=new Handler(this,this.onChange);//设置 vSlider 位置变化处理器。
		*Laya.stage.addChild(this.vSlider);//把 vSlider 添加到显示列表。
		*}
	*private onChange(value:number):void {
		*console.log("滑块的位置： value="+value);
		*}
	*}
*@see laya.ui.Slider
*/
//class laya.ui.VSlider extends laya.ui.Slider
var VSlider=(function(_super){
	function VSlider(){
		VSlider.__super.call(this);;
	}

	__class(VSlider,'laya.ui.VSlider',_super);
	return VSlider;
})(Slider)


/**

*/
*/
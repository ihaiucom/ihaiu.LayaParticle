/**
*<code>/**
*<code>/**
*<code>List</code> 控件可显示项目列表。默认为垂直方向列表。可通过UI编辑器自定义列表。
*
*@example <caption>以下示例代码，创建了一个 <code>List</code> 实例。</caption>
*package
*{
	*import laya.ui.List;
	*import laya.utils.Handler;
	*public class List_Example
	*{
		*public function List_Example()
		*{
			*Laya.init(640,800,"false");//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png"],Handler.create(this,onLoadComplete));
			*}
		*private function onLoadComplete():void
		*{
			*var arr:Array=[];//创建一个数组，用于存贮列表的数据信息。
			*for (var i:int=0;i &lt;20;i++)
			*{
				*arr.push({label:"item"+i});
				*}
			*var list:List=new List();//创建一个 List 类的实例对象 list 。
			*list.itemRender=Item;//设置 list 的单元格渲染器。
			*list.repeatX=1;//设置 list 的水平方向单元格数量。
			*list.repeatY=10;//设置 list 的垂直方向单元格数量。
			*list.vScrollBarSkin="resource/ui/vscroll.png";//设置 list 的垂直方向滚动条皮肤。
			*list.array=arr;//设置 list 的列表数据源。
			*list.pos(100,100);//设置 list 的位置。
			*list.selectEnable=true;//设置 list 可选。
			*list.selectHandler=new Handler(this,onSelect);//设置 list 改变选择项执行的处理器。
			*Laya.stage.addChild(list);//将 list 添加到显示列表。
			*}
		*private function onSelect(index:int):void
		*{
			*trace("当前选择的项目索引： index= ",index);
			*}
		*}
	*}
*import laya.ui.Box;
*import laya.ui.Label;
*class Item extends Box
*{
	*public function Item()
	*{
		*graphics.drawRect(0,0,100,20,null,"#ff0000");
		*var label:Label=new Label();
		*label.text="100000";
		*label.name="label";//设置 label 的name属性值。
		*label.size(100,20);
		*addChild(label);
		*}
	*}
*@example
*(function (_super){
	*function Item(){
		*Item.__super.call(this);//初始化父类
		*this.graphics.drawRect(0,0,100,20,"#ff0000");
		*var label=new laya.ui.Label();//创建一个 Label 类的实例对象 label 。
		*label.text="100000";//设置 label 的文本内容。
		*label.name="label";//设置 label 的name属性值。
		*label.size(100,20);//设置 label 的宽度、高度。
		*this.addChild(label);//将 label 添加到显示列表。
		*};
	*Laya.class(Item,"mypackage.listExample.Item",_super);//注册类 Item 。
	*})(laya.ui.Box);
*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
*var res=["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png"];
*Laya.loader.load(res,new laya.utils.Handler(this,onLoadComplete));//加载资源。
*function onLoadComplete(){
	*var arr=[];//创建一个数组，用于存贮列表的数据信息。
	*for (var i=0;i &lt;20;i++){
		*arr.push({label:"item"+i});
		*}
	*var list=new laya.ui.List();//创建一个 List 类的实例对象 list 。
	*list.itemRender=mypackage.listExample.Item;//设置 list 的单元格渲染器。
	*list.repeatX=1;//设置 list 的水平方向单元格数量。
	*list.repeatY=10;//设置 list 的垂直方向单元格数量。
	*list.vScrollBarSkin="resource/ui/vscroll.png";//设置 list 的垂直方向滚动条皮肤。
	*list.array=arr;//设置 list 的列表数据源。
	*list.pos(100,100);//设置 list 的位置。
	*list.selectEnable=true;//设置 list 可选。
	*list.selectHandler=new laya.utils.Handler(this,onSelect);//设置 list 改变选择项执行的处理器。
	*Laya.stage.addChild(list);//将 list 添加到显示列表。
	*}
*function onSelect(index)
*{
	*console.log("当前选择的项目索引： index= ",index);
	*}
*
*@example
*import List=laya.ui.List;
*import Handler=laya.utils.Handler;
*public class List_Example {
	*public List_Example(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png"],Handler.create(this,this.onLoadComplete));
		*}
	*private onLoadComplete():void {
		*var arr=[];//创建一个数组，用于存贮列表的数据信息。
		*for (var i:number=0;i &lt;20;i++)
		*{
			*arr.push({label:"item"+i });
			*}
		*var list:List=new List();//创建一个 List 类的实例对象 list 。
		*list.itemRender=Item;//设置 list 的单元格渲染器。
		*list.repeatX=1;//设置 list 的水平方向单元格数量。
		*list.repeatY=10;//设置 list 的垂直方向单元格数量。
		*list.vScrollBarSkin="resource/ui/vscroll.png";//设置 list 的垂直方向滚动条皮肤。
		*list.array=arr;//设置 list 的列表数据源。
		*list.pos(100,100);//设置 list 的位置。
		*list.selectEnable=true;//设置 list 可选。
		*list.selectHandler=new Handler(this,this.onSelect);//设置 list 改变选择项执行的处理器。
		*Laya.stage.addChild(list);//将 list 添加到显示列表。
		*}
	*private onSelect(index:number):void {
		*console.log("当前选择的项目索引： index= ",index);
		*}
	*}
*import Box=laya.ui.Box;
*import Label=laya.ui.Label;
*class Item extends Box {
	*constructor(){
		*this.graphics.drawRect(0,0,100,20,null,"#ff0000");
		*var label:Label=new Label();
		*label.text="100000";
		*label.name="label";//设置 label 的name属性值。
		*label.size(100,20);
		*this.addChild(label);
		*}
	*}
*/
//class laya.ui.List extends laya.ui.Box
var List=(function(_super){
	function List(){
		/**改变 <code>List</code> 的选择项时执行的处理器，(默认返回参数： 项索引（index:int）)。*/
		this.selectHandler=null;
		/**单元格渲染处理器(默认返回参数cell:Box,index:int)。*/
		this.renderHandler=null;
		/**单元格鼠标事件处理器(默认返回参数e:Event,index:int)。*/
		this.mouseHandler=null;
		/**指定是否可以选择，若值为true则可以选择，否则不可以选择。 @default false*/
		this.selectEnable=false;
		/**最大分页数。*/
		this.totalPage=0;
		/**@private */
		this._$componentType="List";
		/**@private */
		this._content=null;
		/**@private */
		this._scrollBar=null;
		/**@private */
		this._itemRender=null;
		/**@private */
		this._repeatX=0;
		/**@private */
		this._repeatY=0;
		/**@private */
		this._repeatX2=0;
		/**@private */
		this._repeatY2=0;
		/**@private */
		this._spaceX=0;
		/**@private */
		this._spaceY=0;
		/**@private */
		this._array=null;
		/**@private */
		this._startIndex=0;
		/**@private */
		this._selectedIndex=-1;
		/**@private */
		this._page=0;
		/**@private */
		this._isVertical=true;
		/**@private */
		this._cellSize=20;
		/**@private */
		this._cellOffset=0;
		/**@private */
		this._isMoved=false;
		/**是否缓存内容，如果数据源较少，并且list内无动画，设置此属性为true能大大提高性能 */
		this.cacheContent=false;
		/**@private */
		this._createdLine=0;
		/**@private */
		this._cellChanged=false;
		/**@private */
		this._usedCache=null;
		/**@private */
		this._elasticEnabled=false;
		this._preLen=0;
		List.__super.call(this);
		this._cells=[];
		this._offset=new Point();
	}

	__class(List,'laya.ui.List',_super);
	var __proto=List.prototype;
	Laya.imps(__proto,{"laya.ui.IRender":true,"laya.ui.IItem":true})
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this._content && this._content.destroy(destroyChild);
		this._scrollBar && this._scrollBar.destroy(destroyChild);
		laya.ui.UIComponent.prototype.destroy.call(this,destroyChild);
		this._content=null;
		this._scrollBar=null;
		this._itemRender=null;
		this._cells=null;
		this._array=null;
		this.selectHandler=this.renderHandler=this.mouseHandler=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._content=new Box());
	}

	__proto.onScrollStart=function(){
		this._usedCache || (this._usedCache=Laya.superGet(Box,this,'cacheAs'));
		Laya.superSet(Box,this,'cacheAs',"none");
		this._scrollBar.once(/*laya.events.Event.END*/"end",this,this.onScrollEnd);
	}

	__proto.onScrollEnd=function(){
		Laya.superSet(Box,this,'cacheAs',this._usedCache);
	}

	__proto._removePreScrollBar=function(){
		var preNode=this.removeChildByName("scrollBar");
		if (preNode)preNode.destroy(true);
	}

	/**
	*@private
	*更改单元格的信息。
	*@internal 在此销毁、创建单元格，并设置单元格的位置等属性。相当于此列表内容发送改变时调用此函数。
	*/
	__proto.changeCells=function(){
		this._cellChanged=false;
		if (this._itemRender){
			this.scrollBar=this.getChildByName("scrollBar");
			var cell=this._getOneCell();
			var cellWidth=(cell.width+this._spaceX)|| 1;
			var cellHeight=(cell.height+this._spaceY)|| 1;
			if (this._width > 0)this._repeatX2=this._isVertical ? Math.round(this._width / cellWidth):Math.ceil(this._width / cellWidth);
			if (this._height > 0)this._repeatY2=this._isVertical ? Math.ceil(this._height / cellHeight):Math.round(this._height / cellHeight);
			var listWidth=this._width ? this._width :(cellWidth *this.repeatX-this._spaceX);
			var listHeight=this._height ? this._height :(cellHeight *this.repeatY-this._spaceY);
			this._cellSize=this._isVertical ? cellHeight :cellWidth;
			this._cellOffset=this._isVertical ? (cellHeight *Math.max(this._repeatY2,this._repeatY)-listHeight-this._spaceY):(cellWidth *Math.max(this._repeatX2,this._repeatX)-listWidth-this._spaceX);
			if (this._isVertical && this.vScrollBarSkin)this._scrollBar.height=listHeight;
			else if (!this._isVertical && this.hScrollBarSkin)this._scrollBar.width=listWidth;
			this.setContentSize(listWidth,listHeight);
			var numX=this._isVertical ? this.repeatX :this.repeatY;
			var numY=(this._isVertical ? this.repeatY :this.repeatX)+(this._scrollBar ? 1 :0);
			this._createItems(0,numX,numY);
			this._createdLine=numY;
			if (this._array){
				this.array=this._array;
				this.runCallLater(this.renderItems);
			}
		}
	}

	__proto._getOneCell=function(){
		if (this._cells.length===0){
			var item=this.createItem();
			this._offset.setTo(item._x,item._y);
			if (this.cacheContent)return item;
			this._cells.push(item);
		}
		return this._cells[0];
	}

	__proto._createItems=function(startY,numX,numY){
		var box=this._content;
		var cell=this._getOneCell();
		var cellWidth=cell.width+this._spaceX;
		var cellHeight=cell.height+this._spaceY;
		if (this.cacheContent){
			var cacheBox=new Box();
			cacheBox.cacheAs="normal";
			cacheBox.pos((this._isVertical ? 0 :startY)*cellWidth,(this._isVertical ? startY :0)*cellHeight);
			this._content.addChild(cacheBox);
			box=cacheBox;
			}else {
			var arr=[];
			for (var i=this._cells.length-1;i >-1;i--){
				var item=this._cells[i];
				item.removeSelf();
				arr.push(item);
			}
			this._cells.length=0;
		}
		for (var k=startY;k < numY;k++){
			for (var l=0;l < numX;l++){
				if (arr && arr.length){
					cell=arr.pop();
					}else {
					cell=this.createItem();
				}
				cell.x=(this._isVertical ? l :k)*cellWidth-box._x;
				cell.y=(this._isVertical ? k :l)*cellHeight-box._y;
				cell.name="item"+(k *numX+l);
				box.addChild(cell);
				this.addCell(cell);
			}
		}
	}

	__proto.createItem=function(){
		var arr=[];
		if ((typeof this._itemRender=='function')){
			var box=new this._itemRender();
			}else {
			box=SceneUtils.createComp(this._itemRender,null,null,arr)
		}
		if (arr.length==0 && box["_watchMap"]){
			var watchMap=box["_watchMap"];
			for (var name in watchMap){
				var a=watchMap[name];
				for (var i=0;i < a.length;i++){
					var watcher=a[i];
					arr.push(watcher.comp,watcher.prop,watcher.value)
				}
			}
		}
		if (arr.length)box["_$bindData"]=arr;
		return box;
	}

	/**
	*@private
	*添加单元格。
	*@param cell 需要添加的单元格对象。
	*/
	__proto.addCell=function(cell){
		cell.on(/*laya.events.Event.CLICK*/"click",this,this.onCellMouse);
		cell.on(/*laya.events.Event.RIGHT_CLICK*/"rightclick",this,this.onCellMouse);
		cell.on(/*laya.events.Event.MOUSE_OVER*/"mouseover",this,this.onCellMouse);
		cell.on(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.onCellMouse);
		cell.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.onCellMouse);
		cell.on(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.onCellMouse);
		this._cells.push(cell);
	}

	__proto._afterInited=function(){
		this.initItems();
	}

	/**
	*初始化单元格信息。
	*/
	__proto.initItems=function(){
		if (!this._itemRender && this.getChildByName("item0")!=null){
			this.repeatX=1;
			var count=0;
			count=0;
			for (var i=0;i < 10000;i++){
				var cell=this.getChildByName("item"+i);
				if (cell){
					this.addCell(cell);
					count++;
					continue ;
				}
				break ;
			}
			this.repeatY=count;
		}
	}

	/**
	*设置可视区域大小。
	*<p>以（0，0，width参数，height参数）组成的矩形区域为可视区域。</p>
	*@param width 可视区域宽度。
	*@param height 可视区域高度。
	*/
	__proto.setContentSize=function(width,height){
		this._content.width=width;
		this._content.height=height;
		if (this._scrollBar || this._offset.x !=0 || this._offset.y !=0){
			this._content._style.scrollRect || (this._content.scrollRect=Rectangle.create());
			this._content._style.scrollRect.setTo(-this._offset.x,-this._offset.y,width,height);
			this._content.scrollRect=this._content.scrollRect;
		}
		this.event(/*laya.events.Event.RESIZE*/"resize");
	}

	/**
	*@private
	*单元格的鼠标事件侦听处理函数。
	*/
	__proto.onCellMouse=function(e){
		if (e.type===/*laya.events.Event.MOUSE_DOWN*/"mousedown")this._isMoved=false;
		var cell=e.currentTarget;
		var index=this._startIndex+this._cells.indexOf(cell);
		if (index < 0)return;
		if (e.type===/*laya.events.Event.CLICK*/"click" || e.type===/*laya.events.Event.RIGHT_CLICK*/"rightclick"){
			if (this.selectEnable && !this._isMoved)this.selectedIndex=index;
			else this.changeCellState(cell,true,0);
			}else if ((e.type===/*laya.events.Event.MOUSE_OVER*/"mouseover" || e.type===/*laya.events.Event.MOUSE_OUT*/"mouseout")&& this._selectedIndex!==index){
			this.changeCellState(cell,e.type===/*laya.events.Event.MOUSE_OVER*/"mouseover",0);
		}
		this.mouseHandler && this.mouseHandler.runWith([e,index]);
	}

	/**
	*@private
	*改变单元格的可视状态。
	*@param cell 单元格对象。
	*@param visable 是否显示。
	*@param index 单元格的属性 <code>index</code> 值。
	*/
	__proto.changeCellState=function(cell,visible,index){
		var selectBox=cell.getChildByName("selectBox");
		if (selectBox){
			this.selectEnable=true;
			selectBox.visible=visible;
			selectBox.index=index;
		}
	}

	/**@inheritDoc */
	__proto._sizeChanged=function(){
		laya.ui.UIComponent.prototype._sizeChanged.call(this);
		this.setContentSize(this.width,this.height);
		if (this._scrollBar)this.callLater(this.onScrollBarChange);
	}

	/**
	*@private
	*滚动条的 <code>Event.CHANGE</code> 事件侦听处理函数。
	*/
	__proto.onScrollBarChange=function(e){
		this.runCallLater(this.changeCells);
		var scrollValue=this._scrollBar.value;
		var lineX=(this._isVertical ? this.repeatX :this.repeatY);
		var lineY=(this._isVertical ? this.repeatY :this.repeatX);
		var scrollLine=Math.floor(scrollValue / this._cellSize);
		if (!this.cacheContent){
			var index=scrollLine *lineX;
			var num=0;
			if (index > this._startIndex){
				num=index-this._startIndex;
				var down=true;
				var toIndex=this._startIndex+lineX *(lineY+1);
				this._isMoved=true;
				}else if (index < this._startIndex){
				num=this._startIndex-index;
				down=false;
				toIndex=this._startIndex-1;
				this._isMoved=true;
			}
			for (var i=0;i < num;i++){
				if (down){
					var cell=this._cells.shift();
					this._cells[this._cells.length]=cell;
					var cellIndex=toIndex+i;
					}else {
					cell=this._cells.pop();
					this._cells.unshift(cell);
					cellIndex=toIndex-i;
				};
				var pos=Math.floor(cellIndex / lineX)*this._cellSize;
				this._isVertical ? cell.y=pos :cell.x=pos;
				this.renderItem(cell,cellIndex);
			}
			this._startIndex=index;
			this.changeSelectStatus();
			}else {
			num=(lineY+1);
			if (this._createdLine-scrollLine < num){
				this._createItems(this._createdLine,lineX,this._createdLine+num);
				this.renderItems(this._createdLine *lineX,0);
				this._createdLine+=num;
			}
		};
		var r=this._content._style.scrollRect;
		if (this._isVertical){
			r.y=scrollValue-this._offset.y;
			r.x=-this._offset.x;
			}else {
			r.y=-this._offset.y;
			r.x=scrollValue-this._offset.x;
		}
		this._content.scrollRect=r;
	}

	__proto.posCell=function(cell,cellIndex){
		if (!this._scrollBar)return;
		var lineX=(this._isVertical ? this.repeatX :this.repeatY);
		var lineY=(this._isVertical ? this.repeatY :this.repeatX);
		var pos=Math.floor(cellIndex / lineX)*this._cellSize;
		this._isVertical ? cell._y=pos :cell.x=pos;
	}

	/**
	*@private
	*改变单元格的选择状态。
	*/
	__proto.changeSelectStatus=function(){
		for (var i=0,n=this._cells.length;i < n;i++){
			this.changeCellState(this._cells[i],this._selectedIndex===this._startIndex+i,1);
		}
	}

	/**
	*@private
	*渲染单元格列表。
	*/
	__proto.renderItems=function(from,to){
		(from===void 0)&& (from=0);
		(to===void 0)&& (to=0);
		for (var i=from,n=to || this._cells.length;i < n;i++){
			this.renderItem(this._cells[i],this._startIndex+i);
		}
		this.changeSelectStatus();
	}

	/**
	*渲染一个单元格。
	*@param cell 需要渲染的单元格对象。
	*@param index 单元格索引。
	*/
	__proto.renderItem=function(cell,index){
		if (this._array && index >=0 && index < this._array.length){
			cell.visible=true;
			if (cell["_$bindData"]){
				cell["_dataSource"]=this._array[index];
				this._bindData(cell,this._array[index]);
			}else cell.dataSource=this._array[index];
			if (!this.cacheContent){
				this.posCell(cell,index);
			}
			if (this.hasListener(/*laya.events.Event.RENDER*/"render"))this.event(/*laya.events.Event.RENDER*/"render",[cell,index]);
			if (this.renderHandler)this.renderHandler.runWith([cell,index]);
			}else {
			cell.visible=false;
			cell.dataSource=null;
		}
	}

	__proto._bindData=function(cell,data){
		var arr=cell._$bindData;
		for (var i=0,n=arr.length;i < n;i++){
			var ele=arr[i++];
			var prop=arr[i++];
			var value=arr[i];
			var fun=UIUtils.getBindFun(value);
			ele[prop]=fun.call(this,data);
		}
	}

	/**
	*更新数据源，不刷新list，只增加滚动长度
	*@param array 数据源
	*/
	__proto.updateArray=function(array){
		this._array=array;
		var freshStart=0;
		if (this._array){
			freshStart=this._preLen-this._startIndex;
			if (freshStart >=0)
				this.renderItems(freshStart);
			this._preLen=this._array.length;
		}
		if (this._scrollBar){
			var length=array.length;
			var numX=this._isVertical ? this.repeatX :this.repeatY;
			var numY=this._isVertical ? this.repeatY :this.repeatX;
			var lineCount=Math.ceil(length / numX);
			if (lineCount >=numY){
				this._scrollBar.thumbPercent=numY / lineCount;
				this._scrollBar.slider["_max"]=(lineCount-numY)*this._cellSize+this._cellOffset;
			}
		}
	}

	/**
	*刷新列表数据源。
	*/
	__proto.refresh=function(){
		this.array=this._array;
	}

	/**
	*获取单元格数据源。
	*@param index 单元格索引。
	*/
	__proto.getItem=function(index){
		if (index >-1 && index < this._array.length){
			return this._array[index];
		}
		return null;
	}

	/**
	*修改单元格数据源。
	*@param index 单元格索引。
	*@param source 单元格数据源。
	*/
	__proto.changeItem=function(index,source){
		if (index >-1 && index < this._array.length){
			this._array[index]=source;
			if (index >=this._startIndex && index < this._startIndex+this._cells.length){
				this.renderItem(this.getCell(index),index);
			}
		}
	}

	/**
	*设置单元格数据源。
	*@param index 单元格索引。
	*@param source 单元格数据源。
	*/
	__proto.setItem=function(index,source){
		this.changeItem(index,source);
	}

	/**
	*添加单元格数据源。
	*@param souce 数据源。
	*/
	__proto.addItem=function(souce){
		this._array.push(souce);
		this.array=this._array;
	}

	/**
	*添加单元格数据源到对应的数据索引处。
	*@param souce 单元格数据源。
	*@param index 索引。
	*/
	__proto.addItemAt=function(souce,index){
		this._array.splice(index,0,souce);
		this.array=this._array;
	}

	/**
	*通过数据源索引删除单元格数据源。
	*@param index 需要删除的数据源索引值。
	*/
	__proto.deleteItem=function(index){
		this._array.splice(index,1);
		this.array=this._array;
	}

	/**
	*通过可视单元格索引，获取单元格。
	*@param index 可视单元格索引。
	*@return 单元格对象。
	*/
	__proto.getCell=function(index){
		this.runCallLater(this.changeCells);
		if (index >-1 && this._cells){
			return this._cells[(index-this._startIndex)% this._cells.length];
		}
		return null;
	}

	/**
	*<p>滚动列表，以设定的数据索引对应的单元格为当前可视列表的第一项。</p>
	*@param index 单元格在数据列表中的索引。
	*/
	__proto.scrollTo=function(index){
		if (this._scrollBar){
			var numX=this._isVertical ? this.repeatX :this.repeatY;
			this._scrollBar.value=Math.floor(index / numX)*this._cellSize;
			}else {
			this.startIndex=index;
		}
	}

	/**
	*<p>缓动滚动列表，以设定的数据索引对应的单元格为当前可视列表的第一项。</p>
	*@param index 单元格在数据列表中的索引。
	*@param time 缓动时间。
	*@param complete 缓动结束回掉
	*/
	__proto.tweenTo=function(index,time,complete){
		(time===void 0)&& (time=200);
		if (this._scrollBar){
			this._scrollBar.stopScroll();
			var numX=this._isVertical ? this.repeatX :this.repeatY;
			Tween.to(this._scrollBar,{value:Math.floor(index / numX)*this._cellSize},time,null,complete,0,true);
			}else {
			this.startIndex=index;
			if (complete)complete.run();
		}
	}

	/**@private */
	__proto._setCellChanged=function(){
		if (!this._cellChanged){
			this._cellChanged=true;
			this.callLater(this.changeCells);
		}
	}

	__proto.commitMeasure=function(){
		this.runCallLater(this.changeCells);
	}

	/**@inheritDoc */
	__getset(0,__proto,'cacheAs',_super.prototype._$get_cacheAs,function(value){
		Laya.superSet(Box,this,'cacheAs',value);
		if (this._scrollBar){
			this._usedCache=null;
			if (value!=="none")this._scrollBar.on(/*laya.events.Event.START*/"start",this,this.onScrollStart);
			else this._scrollBar.off(/*laya.events.Event.START*/"start",this,this.onScrollStart);
		}
	});

	/**
	*获取对 <code>List</code> 组件所包含的内容容器 <code>Box</code> 组件的引用。
	*/
	__getset(0,__proto,'content',function(){
		return this._content;
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		if (value !=this._height){
			Laya.superSet(Box,this,'height',value);
			this._setCellChanged();
		}
	});

	/**
	*单元格渲染器。
	*<p><b>取值：</b>
	*<ol>
	*<li>单元格类对象。</li>
	*<li> UI 的 JSON 描述。</li>
	*</ol></p>
	*/
	__getset(0,__proto,'itemRender',function(){
		return this._itemRender;
		},function(value){
		if (this._itemRender !=value){
			this._itemRender=value;
			for (var i=this._cells.length-1;i >-1;i--){
				this._cells[i].destroy();
			}
			this._cells.length=0;
			this._setCellChanged();
		}
	});

	/**
	*垂直方向滚动条皮肤。
	*/
	__getset(0,__proto,'vScrollBarSkin',function(){
		return this._scrollBar ? this._scrollBar.skin :null;
		},function(value){
		this._removePreScrollBar();
		var scrollBar=new VScrollBar();
		scrollBar.name="scrollBar";
		scrollBar.right=0;
		scrollBar.skin=value;
		scrollBar.elasticDistance=this._elasticEnabled ? 200 :0;
		this.scrollBar=scrollBar;
		this.addChild(scrollBar);
		this._setCellChanged();
	});

	/**
	*列表的当前页码。
	*/
	__getset(0,__proto,'page',function(){
		return this._page;
		},function(value){
		this._page=value
		if (this._array){
			this._page=value > 0 ? value :0;
			this._page=this._page < this.totalPage ? this._page :this.totalPage-1;
			this.startIndex=this._page *this.repeatX *this.repeatY;
		}
	});

	/**
	*水平方向滚动条皮肤。
	*/
	__getset(0,__proto,'hScrollBarSkin',function(){
		return this._scrollBar ? this._scrollBar.skin :null;
		},function(value){
		this._removePreScrollBar();
		var scrollBar=new HScrollBar();
		scrollBar.name="scrollBar";
		scrollBar.bottom=0;
		scrollBar.skin=value;
		scrollBar.elasticDistance=this._elasticEnabled ? 200 :0;
		this.scrollBar=scrollBar;
		this.addChild(scrollBar);
		this._setCellChanged();
	});

	/**
	*水平方向显示的单元格数量。
	*/
	__getset(0,__proto,'repeatX',function(){
		return this._repeatX > 0 ? this._repeatX :this._repeatX2 > 0 ? this._repeatX2 :1;
		},function(value){
		this._repeatX=value;
		this._setCellChanged();
	});

	/**
	*获取对 <code>List</code> 组件所包含的滚动条 <code>ScrollBar</code> 组件的引用。
	*/
	__getset(0,__proto,'scrollBar',function(){
		return this._scrollBar;
		},function(value){
		if (this._scrollBar !=value){
			this._scrollBar=value;
			if (value){
				this._isVertical=this._scrollBar.isVertical;
				this.addChild(this._scrollBar);
				this._scrollBar.on(/*laya.events.Event.CHANGE*/"change",this,this.onScrollBarChange);
			}
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		if (value !=this._width){
			Laya.superSet(Box,this,'width',value);
			this._setCellChanged();
		}
	});

	/**
	*垂直方向显示的单元格数量。
	*/
	__getset(0,__proto,'repeatY',function(){
		return this._repeatY > 0 ? this._repeatY :this._repeatY2 > 0 ? this._repeatY2 :1;
		},function(value){
		this._repeatY=value;
		this._setCellChanged();
	});

	/**
	*水平方向显示的单元格之间的间距（以像素为单位）。
	*/
	__getset(0,__proto,'spaceX',function(){
		return this._spaceX;
		},function(value){
		this._spaceX=value;
		this._setCellChanged();
	});

	/**
	*垂直方向显示的单元格之间的间距（以像素为单位）。
	*/
	__getset(0,__proto,'spaceY',function(){
		return this._spaceY;
		},function(value){
		this._spaceY=value;
		this._setCellChanged();
	});

	/**
	*表示当前选择的项索引。selectedIndex值更改会引起list重新渲染
	*/
	__getset(0,__proto,'selectedIndex',function(){
		return this._selectedIndex;
		},function(value){
		if (this._selectedIndex !=value){
			this._selectedIndex=value;
			this.changeSelectStatus();
			this.event(/*laya.events.Event.CHANGE*/"change");
			this.selectHandler && this.selectHandler.runWith(value);
			this.startIndex=this._startIndex;
		}
	});

	/**
	*当前选中的单元格数据源。
	*/
	__getset(0,__proto,'selectedItem',function(){
		return this._selectedIndex !=-1 ? this._array[this._selectedIndex] :null;
		},function(value){
		this.selectedIndex=this._array.indexOf(value);
	});

	/**
	*列表的数据总个数。
	*/
	__getset(0,__proto,'length',function(){
		return this._array ? this._array.length :0;
	});

	/**
	*获取或设置当前选择的单元格对象。
	*/
	__getset(0,__proto,'selection',function(){
		return this.getCell(this._selectedIndex);
		},function(value){
		this.selectedIndex=this._startIndex+this._cells.indexOf(value);
	});

	/**
	*当前显示的单元格列表的开始索引。
	*/
	__getset(0,__proto,'startIndex',function(){
		return this._startIndex;
		},function(value){
		this._startIndex=value > 0 ? value :0;
		this.callLater(this.renderItems);
	});

	/**
	*列表数据源。
	*/
	__getset(0,__proto,'array',function(){
		return this._array;
		},function(value){
		this.runCallLater(this.changeCells);
		this._array=value || [];
		this._preLen=this._array.length;
		var length=this._array.length;
		this.totalPage=Math.ceil(length / (this.repeatX *this.repeatY));
		this._selectedIndex=this._selectedIndex < length ? this._selectedIndex :length-1;
		this.startIndex=this._startIndex;
		if (this._scrollBar){
			this._scrollBar.stopScroll();
			var numX=this._isVertical ? this.repeatX :this.repeatY;
			var numY=this._isVertical ? this.repeatY :this.repeatX;
			var lineCount=Math.ceil(length / numX);
			var total=this._cellOffset > 0 ? this.totalPage+1 :this.totalPage;
			if (total > 1 && lineCount >=numY){
				this._scrollBar.scrollSize=this._cellSize;
				this._scrollBar.thumbPercent=numY / lineCount;
				this._scrollBar.setScroll(0,(lineCount-numY)*this._cellSize+this._cellOffset,this._scrollBar.value);
				this._scrollBar.target=this._content;
				}else {
				this._scrollBar.setScroll(0,0,0);
				this._scrollBar.target=this._content;
			}
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if (((typeof value=='number')&& Math.floor(value)==value)|| (typeof value=='string'))this.selectedIndex=parseInt(value);
		else if ((value instanceof Array))this.array=value
		else Laya.superSet(Box,this,'dataSource',value);
	});

	/**
	*单元格集合。
	*/
	__getset(0,__proto,'cells',function(){
		this.runCallLater(this.changeCells);
		return this._cells;
	});

	/**是否开启橡皮筋效果*/
	__getset(0,__proto,'elasticEnabled',function(){
		return this._elasticEnabled;
		},function(value){
		this._elasticEnabled=value;
		if (this._scrollBar){
			this._scrollBar.elasticDistance=value?200:0;
		}
	});

	return List;
})(Box)


/**
*使用 <code>HSlider</code> 控件，用户可以通过在滑块轨道的终点之间移动滑块来选择值。
*<p> <code>HSlider</code> 控件采用水平方向。滑块轨道从左向右扩展，而标签位于轨道的顶部或底部。</p>
*
*@example <caption>以下示例代码，创建了一个 <code>HSlider</code> 实例。</caption>
*package
*{
	*import laya.ui.HSlider;
	*import laya.utils.Handler;
	*public class HSlider_Example
	*{
		*private var hSlider:HSlider;
		*public function HSlider_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/hslider.png","resource/ui/hslider$bar.png"],Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*hSlider=new HSlider();//创建一个 HSlider 类的实例对象 hSlider 。
			*hSlider.skin="resource/ui/hslider.png";//设置 hSlider 的皮肤。
			*hSlider.min=0;//设置 hSlider 最低位置值。
			*hSlider.max=10;//设置 hSlider 最高位置值。
			*hSlider.value=2;//设置 hSlider 当前位置值。
			*hSlider.tick=1;//设置 hSlider 刻度值。
			*hSlider.x=100;//设置 hSlider 对象的属性 x 的值，用于控制 hSlider 对象的显示位置。
			*hSlider.y=100;//设置 hSlider 对象的属性 y 的值，用于控制 hSlider 对象的显示位置。
			*hSlider.changeHandler=new Handler(this,onChange);//设置 hSlider 位置变化处理器。
			*Laya.stage.addChild(hSlider);//把 hSlider 添加到显示列表。
			*}
		*private function onChange(value:Number):void
		*{
			*trace("滑块的位置： value="+value);
			*}
		*}
	*}
*@example
*Laya.init(640,800,"canvas");//设置游戏画布宽高、渲染模式
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var hSlider;
*var res=["resource/ui/hslider.png","resource/ui/hslider$bar.png"];
*Laya.loader.load(res,laya.utils.Handler.create(this,onLoadComplete));
*function onLoadComplete(){
	*console.log("资源加载完成！");
	*hSlider=new laya.ui.HSlider();//创建一个 HSlider 类的实例对象 hSlider 。
	*hSlider.skin="resource/ui/hslider.png";//设置 hSlider 的皮肤。
	*hSlider.min=0;//设置 hSlider 最低位置值。
	*hSlider.max=10;//设置 hSlider 最高位置值。
	*hSlider.value=2;//设置 hSlider 当前位置值。
	*hSlider.tick=1;//设置 hSlider 刻度值。
	*hSlider.x=100;//设置 hSlider 对象的属性 x 的值，用于控制 hSlider 对象的显示位置。
	*hSlider.y=100;//设置 hSlider 对象的属性 y 的值，用于控制 hSlider 对象的显示位置。
	*hSlider.changeHandler=new laya.utils.Handler(this,onChange);//设置 hSlider 位置变化处理器。
	*Laya.stage.addChild(hSlider);//把 hSlider 添加到显示列表。
	*}
*function onChange(value)
*{
	*console.log("滑块的位置： value="+value);
	*}
*@example
*import Handler=laya.utils.Handler;
*import HSlider=laya.ui.HSlider;
*class HSlider_Example {
	*private hSlider:HSlider;
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/hslider.png","resource/ui/hslider$bar.png"],Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete():void {
		*this.hSlider=new HSlider();//创建一个 HSlider 类的实例对象 hSlider 。
		*this.hSlider.skin="resource/ui/hslider.png";//设置 hSlider 的皮肤。
		*this.hSlider.min=0;//设置 hSlider 最低位置值。
		*this.hSlider.max=10;//设置 hSlider 最高位置值。
		*this.hSlider.value=2;//设置 hSlider 当前位置值。
		*this.hSlider.tick=1;//设置 hSlider 刻度值。
		*this.hSlider.x=100;//设置 hSlider 对象的属性 x 的值，用于控制 hSlider 对象的显示位置。
		*this.hSlider.y=100;//设置 hSlider 对象的属性 y 的值，用于控制 hSlider 对象的显示位置。
		*this.hSlider.changeHandler=new Handler(this,this.onChange);//设置 hSlider 位置变化处理器。
		*Laya.stage.addChild(this.hSlider);//把 hSlider 添加到显示列表。
		*}
	*private onChange(value:number):void {
		*console.log("滑块的位置： value="+value);
		*}
	*}
*
*@see laya.ui.Slider
*/
//class laya.ui.HSlider extends laya.ui.Slider
var HSlider=(function(_super){
	/**
	*创建一个 <code>HSlider</code> 类实例。
	*@param skin 皮肤。
	*/
	function HSlider(skin){
		HSlider.__super.call(this,skin);
		this.isVertical=false;
	}

	__class(HSlider,'laya.ui.HSlider',_super);
	return HSlider;
})(Slider)


/**
*自适应缩放容器，容器设置大小后，容器大小始终保持stage大小，子内容按照原始最小宽高比缩放
*/
//class laya.ui.ScaleBox extends laya.ui.Box
var ScaleBox=(function(_super){
	function ScaleBox(){
		this._oldW=0;
		this._oldH=0;
		ScaleBox.__super.call(this);
	}

	__class(ScaleBox,'laya.ui.ScaleBox',_super);
	var __proto=ScaleBox.prototype;
	__proto.onEnable=function(){
		Laya.stage.on("resize",this,this.onResize);
		this.onResize();
	}

	__proto.onDisable=function(){
		Laya.stage.off("resize",this,this.onResize);
	}

	__proto.onResize=function(){
		if (this.width > 0 && this.height > 0){
			var scale=Math.min(Laya.stage.width / this._oldW,Laya.stage.height / this._oldH);
			Laya.superSet(Box,this,'width',Laya.stage.width);
			Laya.superSet(Box,this,'height',Laya.stage.height);
			this.scale(scale,scale);
		}
	}

	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(Box,this,'width',value);
		this._oldW=value;
	});

	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(Box,this,'height',value);
		this._oldH=value;
	});

	return ScaleBox;
})(Box)


/**

*/
*/
*/
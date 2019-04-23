//class fairygui.GList extends fairygui.GComponent
var GList=(function(_super){
	var ItemInfo;
	function GList(){
		/**
		*itemRenderer(int index,GObject item);
		*/
		this.itemRenderer=null;
		/**
		*itemProvider(index:int):String;
		*/
		this.itemProvider=null;
		this.scrollItemToViewOnClick=false;
		this.foldInvisibleItems=false;
		this._layout=0;
		this._lineCount=0;
		this._columnCount=0;
		this._lineGap=0;
		this._columnGap=0;
		this._defaultItem=null;
		this._autoResizeItem=false;
		this._selectionMode=0;
		this._align=null;
		this._verticalAlign=null;
		this._selectionController=null;
		this._lastSelectedIndex=0;
		this._pool=null;
		//Virtual List support
		this._virtual=false;
		this._loop=false;
		this._numItems=0;
		this._realNumItems=0;
		this._firstIndex=0;
		//the top left index
		this._curLineItemCount=0;
		//item count in one line
		this._curLineItemCount2=0;
		//只用在页面模式，表示垂直方向的项目数
		this._itemSize=null;
		this._virtualListChanged=0;
		//1-content changed,2-size changed
		this._virtualItems=null;
		this._eventLocked=false;
		this.itemInfoVer=0;
		GList.__super.call(this);
		this._trackBounds=true;
		this._pool=new GObjectPool();
		this._layout=0;
		this._autoResizeItem=true;
		this._lastSelectedIndex=-1;
		this._selectionMode=0;
		this.opaque=true;
		this.scrollItemToViewOnClick=true;
		this._align="left";
		this._verticalAlign="top";
		this._container=new Sprite();
		this._displayObject.addChild(this._container);
	}

	__class(GList,'fairygui.GList',_super);
	var __proto=GList.prototype;
	__proto.dispose=function(){
		this._pool.clear();
		_super.prototype.dispose.call(this);
	}

	__proto.getFromPool=function(url){
		if (!url)
			url=this._defaultItem;
		var obj=this._pool.getObject(url);
		if(obj!=null)
			obj.visible=true;
		return obj;
	}

	__proto.returnToPool=function(obj){
		obj.displayObject.cacheAs="none";
		this._pool.returnObject(obj);
	}

	__proto.addChildAt=function(child,index){
		(index===void 0)&& (index=0);
		_super.prototype.addChildAt.call(this,child,index);
		if ((child instanceof fairygui.GButton )){
			var button=(child);
			button.selected=false;
			button.changeStateOnClick=false;
		}
		child.on("click",this,this.__clickItem);
		return child;
	}

	__proto.addItem=function(url){
		if (!url)
			url=this._defaultItem;
		return this.addChild(UIPackage.createObjectFromURL(url));
	}

	__proto.addItemFromPool=function(url){
		return this.addChild(this.getFromPool(url));
	}

	__proto.removeChildAt=function(index,dispose){
		(dispose===void 0)&& (dispose=false);
		var child=_super.prototype.removeChildAt.call(this,index);
		if(dispose)
			child.dispose();
		else
		child.off("click",this,this.__clickItem);
		return child;
	}

	__proto.removeChildToPoolAt=function(index){
		(index===void 0)&& (index=0);
		var child=_super.prototype.removeChildAt.call(this,index);
		this.returnToPool(child);
	}

	__proto.removeChildToPool=function(child){
		this.removeChild(child);
		this.returnToPool(child);
	}

	__proto.removeChildrenToPool=function(beginIndex,endIndex){
		(beginIndex===void 0)&& (beginIndex=0);
		(endIndex===void 0)&& (endIndex=-1);
		if (endIndex < 0 || endIndex >=this._children.length)
			endIndex=this._children.length-1;
		for (var i=beginIndex;i <=endIndex;++i)
		this.removeChildToPoolAt(beginIndex);
	}

	__proto.getSelection=function(){
		var ret=[];
		var i=0;
		if (this._virtual){
			for (i=0;i < this._realNumItems;i++){
				var ii=this._virtualItems[i];
				if (((ii.obj instanceof fairygui.GButton ))&& (ii.obj).selected
					|| ii.obj==null && ii.selected){
					var j=i;
					if (this._loop){
						j=i % this._numItems;
						if (ret.indexOf(j)!=-1)
							continue ;
					}
					ret.push(j);
				}
			}
		}
		else{
			var cnt=this._children.length;
			for (i=0;i < cnt;i++){
				var obj=this._children[i].asButton;
				if (obj !=null && obj.selected)
					ret.push(i);
			}
		}
		return ret;
	}

	__proto.addSelection=function(index,scrollItToView){
		(scrollItToView===void 0)&& (scrollItToView=false);
		if(this._selectionMode==3)
			return;
		this.checkVirtualList();
		if(this._selectionMode==0)
			this.clearSelection();
		if (scrollItToView)
			this.scrollToView(index);
		this._lastSelectedIndex=index;
		var obj=null;
		if (this._virtual){
			var ii=this._virtualItems[index];
			if (ii.obj !=null)
				obj=ii.obj.asButton;
			ii.selected=true;
		}
		else
		obj=this.getChildAt(index).asButton;
		if (obj !=null && !obj.selected){
			obj.selected=true;
			this.updateSelectionController(index);
		}
	}

	__proto.removeSelection=function(index){
		if(this._selectionMode==3)
			return;
		var obj=null;
		if (this._virtual){
			var ii=this._virtualItems[index];
			if (ii.obj !=null)
				obj=ii.obj.asButton;
			ii.selected=false;
		}
		else
		obj=this.getChildAt(index).asButton;
		if (obj !=null)
			obj.selected=false;
	}

	__proto.clearSelection=function(){
		var i=0;
		if (this._virtual){
			for (i=0;i < this._realNumItems;i++){
				var ii=this._virtualItems[i];
				if ((ii.obj instanceof fairygui.GButton ))
					(ii.obj).selected=false;
				ii.selected=false;
			}
		}
		else{
			var cnt=this._children.length;
			for (i=0;i < cnt;i++){
				var obj=this._children[i].asButton;
				if (obj !=null)
					obj.selected=false;
			}
		}
	}

	__proto.clearSelectionExcept=function(g){
		var i=0;
		if (this._virtual){
			for (i=0;i < this._realNumItems;i++){
				var ii=this._virtualItems[i];
				if (ii.obj !=g){
					if (((ii.obj instanceof fairygui.GButton )))
						(ii.obj).selected=false;
					ii.selected=false;
				}
			}
		}
		else{
			var cnt=this._children.length;
			for (i=0;i < cnt;i++){
				var obj=this._children[i].asButton;
				if (obj !=null && obj !=g)
					obj.selected=false;
			}
		}
	}

	__proto.selectAll=function(){
		this.checkVirtualList();
		var last=-1;
		var i=0;
		if (this._virtual){
			for (i=0;i < this._realNumItems;i++){
				var ii=this._virtualItems[i];
				if (((ii.obj instanceof fairygui.GButton ))&& !(ii.obj).selected){
					(ii.obj).selected=true;
					last=i;
				}
				ii.selected=true;
			}
		}
		else{
			var cnt=this._children.length;
			for (i=0;i < cnt;i++){
				var obj=this._children[i].asButton;
				if (obj !=null && !obj.selected){
					obj.selected=true;
					last=i;
				}
			}
		}
		if(last!=-1)
			this.updateSelectionController(last);
	}

	__proto.selectNone=function(){
		this.clearSelection();
	}

	__proto.selectReverse=function(){
		this.checkVirtualList();
		var last=-1;
		var i=0;
		if (this._virtual){
			for (i=0;i < this._realNumItems;i++){
				var ii=this._virtualItems[i];
				if ((ii.obj instanceof fairygui.GButton )){
					(ii.obj).selected=!(ii.obj).selected;
					if ((ii.obj).selected)
						last=i;
				}
				ii.selected=!ii.selected;
			}
		}
		else{
			var cnt=this._children.length;
			for (i=0;i < cnt;i++){
				var obj=this._children[i].asButton;
				if (obj !=null){
					obj.selected=!obj.selected;
					if (obj.selected)
						last=i;
				}
			}
		}
		if(last!=-1)
			this.updateSelectionController(last);
	}

	__proto.handleArrowKey=function(dir){
		(dir===void 0)&& (dir=0);
		var index=this.selectedIndex;
		if (index==-1)
			return;
		switch (dir){
			case 1:
				if (this._layout==0 || this._layout==3){
					index--;
					if (index >=0){
						this.clearSelection();
						this.addSelection(index,true);
					}
				}
				else if (this._layout==2 || this._layout==4){
					var current=this._children[index];
					var k=0;
					for (var i=index-1;i >=0;i--){
						var obj=this._children[i];
						if (obj.y !=current.y){
							current=obj;
							break ;
						}
						k++;
					}
					for (;i >=0;i--){
						obj=this._children[i];
						if (obj.y !=current.y){
							this.clearSelection();
							this.addSelection(i+k+1,true);
							break ;
						}
					}
				}
				break ;
			case 3:
				if (this._layout==1 || this._layout==2 || this._layout==4){
					index++;
					if (index < this._children.length){
						this.clearSelection();
						this.addSelection(index,true);
					}
				}
				else if (this._layout==3){
					current=this._children[index];
					k=0;
					var cnt=this._children.length;
					for (i=index+1;i < cnt;i++){
						obj=this._children[i];
						if (obj.x !=current.x){
							current=obj;
							break ;
						}
						k++;
					}
					for (;i < cnt;i++){
						obj=this._children[i];
						if (obj.x !=current.x){
							this.clearSelection();
							this.addSelection(i-k-1,true);
							break ;
						}
					}
				}
				break ;
			case 5:
				if (this._layout==0 || this._layout==3){
					index++;
					if (index < this._children.length){
						this.clearSelection();
						this.addSelection(index,true);
					}
				}
				else if (this._layout==2 || this._layout==4){
					current=this._children[index];
					k=0;
					cnt=this._children.length;
					for (i=index+1;i < cnt;i++){
						obj=this._children[i];
						if (obj.y !=current.y){
							current=obj;
							break ;
						}
						k++;
					}
					for (;i < cnt;i++){
						obj=this._children[i];
						if (obj.y !=current.y){
							this.clearSelection();
							this.addSelection(i-k-1,true);
							break ;
						}
					}
				}
				break ;
			case 7:
				if (this._layout==1 || this._layout==2 || this._layout==4){
					index--;
					if (index >=0){
						this.clearSelection();
						this.addSelection(index,true);
					}
				}
				else if (this._layout==3){
					current=this._children[index];
					k=0;
					for (i=index-1;i >=0;i--){
						obj=this._children[i];
						if (obj.x !=current.x){
							current=obj;
							break ;
						}
						k++;
					}
					for (;i >=0;i--){
						obj=this._children[i];
						if (obj.x !=current.x){
							this.clearSelection();
							this.addSelection(i+k+1,true);
							break ;
						}
					}
				}
				break ;
			}
	}

	__proto.__clickItem=function(evt){
		if (this._scrollPane !=null && this._scrollPane.isDragged)
			return;
		var item=GObject.cast(evt.currentTarget);
		this.setSelectionOnEvent(item,evt);
		if(this._scrollPane && this.scrollItemToViewOnClick)
			this._scrollPane.scrollToView(item,true);
		this.displayObject.event("fui_click_item",[item,Events.createEvent("fui_click_item",this.displayObject,evt)]);
	}

	__proto.setSelectionOnEvent=function(item,evt){
		if (!((item instanceof fairygui.GButton ))|| this._selectionMode==3)
			return;
		var dontChangeLastIndex=false;
		var button=(item);
		var index=this.childIndexToItemIndex(this.getChildIndex(item));
		if (this._selectionMode==0){
			if (!button.selected){
				this.clearSelectionExcept(button);
				button.selected=true;
			}
		}
		else {
			if (evt.shiftKey){
				if (!button.selected){
					if (this._lastSelectedIndex !=-1){
						var min=Math.min(this._lastSelectedIndex,index);
						var max=Math.max(this._lastSelectedIndex,index);
						max=Math.min(max,this.numItems-1);
						var i=0;
						if (this._virtual){
							for (i=min;i <=max;i++){
								var ii=this._virtualItems[i];
								if ((ii.obj instanceof fairygui.GButton ))
									(ii.obj).selected=true;
								ii.selected=true;
							}
						}
						else{
							for(i=min;i<=max;i++){
								var obj=this.getChildAt(i).asButton;
								if(obj!=null)
									obj.selected=true;
							}
						}
						dontChangeLastIndex=true;
					}
					else {
						button.selected=true;
					}
				}
			}
			else if (evt.ctrlKey || this._selectionMode==2){
				button.selected=!button.selected;
			}
			else {
				if (!button.selected){
					this.clearSelectionExcept(button);
					button.selected=true;
				}
				else
				this.clearSelectionExcept(button);
			}
		}
		if (!dontChangeLastIndex)
			this._lastSelectedIndex=index;
		if(button.selected)
			this.updateSelectionController(index);
	}

	__proto.resizeToFit=function(itemCount,minSize){
		(itemCount===void 0)&& (itemCount=1000000);
		(minSize===void 0)&& (minSize=0);
		this.ensureBoundsCorrect();
		var curCount=this.numItems;
		if (itemCount > curCount)
			itemCount=curCount;
		if(this._virtual){
			var lineCount=Math.ceil(itemCount / this._curLineItemCount);
			if(this._layout==0 || this._layout==2)
				this.viewHeight=lineCount *this._itemSize.y+Math.max(0,lineCount-1)*this._lineGap;
			else
			this.viewWidth=lineCount *this._itemSize.x+Math.max(0,lineCount-1)*this._columnGap;
		}
		else if(itemCount==0){
			if (this._layout==0 || this._layout==2)
				this.viewHeight=minSize;
			else
			this.viewWidth=minSize;
		}
		else {
			var i=itemCount-1;
			var obj=null;
			while (i >=0){
				obj=this.getChildAt(i);
				if (!this.foldInvisibleItems || obj.visible)
					break ;
				i--;
			}
			if (i < 0){
				if (this._layout==0 || this._layout==2)
					this.viewHeight=minSize;
				else
				this.viewWidth=minSize;
			}
			else {
				var size=0;
				if (this._layout==0 || this._layout==2){
					size=obj.y+obj.height;
					if (size < minSize)
						size=minSize;
					this.viewHeight=size;
				}
				else {
					size=obj.x+obj.width;
					if (size < minSize)
						size=minSize;
					this.viewWidth=size;
				}
			}
		}
	}

	__proto.getMaxItemWidth=function(){
		var cnt=this._children.length;
		var max=0;
		for (var i=0;i < cnt;i++){
			var child=this.getChildAt(i);
			if (child.width > max)
				max=child.width;
		}
		return max;
	}

	__proto.handleSizeChanged=function(){
		_super.prototype.handleSizeChanged.call(this);
		this.setBoundsChangedFlag();
		if (this._virtual)
			this.setVirtualListChangedFlag(true);
	}

	__proto.handleControllerChanged=function(c){
		_super.prototype.handleControllerChanged.call(this,c);
		if (this._selectionController==c)
			this.selectedIndex=c.selectedIndex;
	}

	__proto.updateSelectionController=function(index){
		if (this._selectionController !=null && !this._selectionController.changing
			&& index < this._selectionController.pageCount){
			var c=this._selectionController;
			this._selectionController=null;
			c.selectedIndex=index;
			this._selectionController=c;
		}
	}

	__proto.getSnappingPosition=function(xValue,yValue,resultPoint){
		if (this._virtual){
			if(!resultPoint)
				resultPoint=new Point();
			var saved=NaN;
			var index=0;
			if (this._layout==0 || this._layout==2){
				saved=yValue;
				fairygui.GList.pos_param=yValue;
				index=this.getIndexOnPos1(false);
				yValue=fairygui.GList.pos_param;
				if (index < this._virtualItems.length && saved-yValue > this._virtualItems[index].height / 2 && index < this._realNumItems)
					yValue+=this._virtualItems[index].height+this._lineGap;
			}
			else if (this._layout==1 || this._layout==3){
				saved=xValue;
				fairygui.GList.pos_param=xValue;
				index=this.getIndexOnPos2(false);
				xValue=fairygui.GList.pos_param;
				if (index < this._virtualItems.length && saved-xValue > this._virtualItems[index].width / 2 && index < this._realNumItems)
					xValue+=this._virtualItems[index].width+this._columnGap;
			}
			else{
				saved=xValue;
				fairygui.GList.pos_param=xValue;
				index=this.getIndexOnPos3(false);
				xValue=fairygui.GList.pos_param;
				if (index < this._virtualItems.length && saved-xValue > this._virtualItems[index].width / 2 && index < this._realNumItems)
					xValue+=this._virtualItems[index].width+this._columnGap;
			}
			resultPoint.x=xValue;
			resultPoint.y=yValue;
			return resultPoint;
		}
		else
		return _super.prototype.getSnappingPosition.call(this,xValue,yValue,resultPoint);
	}

	__proto.scrollToView=function(index,ani,setFirst){
		(ani===void 0)&& (ani=false);
		(setFirst===void 0)&& (setFirst=false);
		if (this._virtual){
			if(this._numItems==0)
				return;
			this.checkVirtualList();
			if (index >=this._virtualItems.length)
				throw new Error("Invalid child index: "+index+">"+this._virtualItems.length);
			if(this._loop)
				index=Math.floor(this._firstIndex/this._numItems)*this._numItems+index;
			var rect;
			var ii=this._virtualItems[index];
			var pos=0;
			var i=0;
			if (this._layout==0 || this._layout==2){
				for (i=this._curLineItemCount-1;i < index;i+=this._curLineItemCount)
				pos+=this._virtualItems[i].height+this._lineGap;
				rect=new Rectangle(0,pos,this._itemSize.x,ii.height);
			}
			else if (this._layout==1 || this._layout==3){
				for (i=this._curLineItemCount-1;i < index;i+=this._curLineItemCount)
				pos+=this._virtualItems[i].width+this._columnGap;
				rect=new Rectangle(pos,0,ii.width,this._itemSize.y);
			}
			else{
				var page=index / (this._curLineItemCount *this._curLineItemCount2);
				rect=new Rectangle(page *this.viewWidth+(index % this._curLineItemCount)*(ii.width+this._columnGap),
				(index / this._curLineItemCount)% this._curLineItemCount2 *(ii.height+this._lineGap),
				ii.width,ii.height);
			}
			setFirst=true;
			if (this._scrollPane !=null)
				this._scrollPane.scrollToView(rect,ani,setFirst);
		}
		else{
			var obj=this.getChildAt(index);
			if (this._scrollPane !=null)
				this._scrollPane.scrollToView(obj,ani,setFirst);
			else if (this.parent !=null && this.parent.scrollPane !=null)
			this.parent.scrollPane.scrollToView(obj,ani,setFirst);
		}
	}

	__proto.getFirstChildInView=function(){
		return this.childIndexToItemIndex(_super.prototype.getFirstChildInView.call(this));
	}

	__proto.childIndexToItemIndex=function(index){
		if (!this._virtual)
			return index;
		if (this._layout==4){
			for (var i=this._firstIndex;i < this._realNumItems;i++){
				if (this._virtualItems[i].obj !=null){
					index--;
					if (index < 0)
						return i;
				}
			}
			return index;
		}
		else{
			index+=this._firstIndex;
			if (this._loop && this._numItems > 0)
				index=index % this._numItems;
			return index;
		}
	}

	__proto.itemIndexToChildIndex=function(index){
		if (!this._virtual)
			return index;
		if (this._layout==4){
			return this.getChildIndex(this._virtualItems[index].obj);
		}
		else{
			if (this._loop && this._numItems > 0){
				var j=this._firstIndex % this._numItems;
				if (index >=j)
					index=index-j;
				else
				index=this._numItems-j+index;
			}
			else
			index-=this._firstIndex;
			return index;
		}
	}

	__proto.setVirtual=function(){
		this._setVirtual(false);
	}

	/**
	*Set the list to be virtual list,and has loop behavior.
	*/
	__proto.setVirtualAndLoop=function(){
		this._setVirtual(true);
	}

	__proto._setVirtual=function(loop){
		if(!this._virtual){
			if(this._scrollPane==null)
				throw new Error("Virtual list must be scrollable!");
			if(loop){
				if(this._layout==2 || this._layout==3)
					throw new Error("Loop list is not supported for FlowHorizontal or FlowVertical layout!");
				this._scrollPane.bouncebackEffect=false;
			}
			this._virtual=true;
			this._loop=loop;
			this._virtualItems=[];
			this.removeChildrenToPool();
			if(this._itemSize==null){
				this._itemSize=new Point();
				var obj=this.getFromPool(null);
				if (obj==null){
					throw new Error("Virtual List must have a default list item resource.");
				}
				else{
					this._itemSize.x=obj.width;
					this._itemSize.y=obj.height;
				}
				this.returnToPool(obj);
			}
			if(this._layout==0 || this._layout==2){
				this._scrollPane.scrollStep=this._itemSize.y;
				if(this._loop)
					this._scrollPane._loop=2;
			}
			else{
				this._scrollPane.scrollStep=this._itemSize.x;
				if(this._loop)
					this._scrollPane._loop=1;
			}
			this.on("fui_scroll",this,this.__scrolled);
			this.setVirtualListChangedFlag(true);
		}
	}

	__proto.refreshVirtualList=function(){
		this.setVirtualListChangedFlag(false);
	}

	__proto.checkVirtualList=function(){
		if(this._virtualListChanged!=0){
			this._refreshVirtualList();
			Laya.timer.clear(this,this._refreshVirtualList);
		}
	}

	__proto.setVirtualListChangedFlag=function(layoutChanged){
		(layoutChanged===void 0)&& (layoutChanged=false);
		if(layoutChanged)
			this._virtualListChanged=2;
		else if(this._virtualListChanged==0)
		this._virtualListChanged=1;
		Laya.timer.callLater(this,this._refreshVirtualList);
	}

	__proto._refreshVirtualList=function(){
		var layoutChanged=this._virtualListChanged==2;
		this._virtualListChanged=0;
		this._eventLocked=true;
		if (layoutChanged){
			if (this._layout==0 || this._layout==1)
				this._curLineItemCount=1;
			else if (this._layout==2){
				if (this._columnCount > 0)
					this._curLineItemCount=this._columnCount;
				else{
					this._curLineItemCount=Math.floor((this._scrollPane.viewWidth+this._columnGap)/ (this._itemSize.x+this._columnGap));
					if (this._curLineItemCount <=0)
						this._curLineItemCount=1;
				}
			}
			else if (this._layout==3){
				if (this._lineCount > 0)
					this._curLineItemCount=this._lineCount;
				else{
					this._curLineItemCount=Math.floor((this._scrollPane.viewHeight+this._lineGap)/ (this._itemSize.y+this._lineGap));
					if (this._curLineItemCount <=0)
						this._curLineItemCount=1;
				}
			}
			else{
				if (this._columnCount > 0)
					this._curLineItemCount=this._columnCount;
				else{
					this._curLineItemCount=Math.floor((this._scrollPane.viewWidth+this._columnGap)/ (this._itemSize.x+this._columnGap));
					if (this._curLineItemCount <=0)
						this._curLineItemCount=1;
				}
				if (this._lineCount > 0)
					this._curLineItemCount2=this._lineCount;
				else{
					this._curLineItemCount2=Math.floor((this._scrollPane.viewHeight+this._lineGap)/ (this._itemSize.y+this._lineGap));
					if (this._curLineItemCount2 <=0)
						this._curLineItemCount2=1;
				}
			}
		};
		var ch=0,cw=0;
		if (this._realNumItems > 0){
			var i=0;
			var len=Math.ceil(this._realNumItems / this._curLineItemCount)*this._curLineItemCount;
			var len2=Math.min(this._curLineItemCount,this._realNumItems);
			if (this._layout==0 || this._layout==2){
				for (i=0;i < len;i+=this._curLineItemCount)
				ch+=this._virtualItems[i].height+this._lineGap;
				if (ch > 0)
					ch-=this._lineGap;
				if (this._autoResizeItem)
					cw=this._scrollPane.viewWidth;
				else{
					for (i=0;i < len2;i++)
					cw+=this._virtualItems[i].width+this._columnGap;
					if (cw > 0)
						cw-=this._columnGap;
				}
			}
			else if (this._layout==1 || this._layout==3){
				for (i=0;i < len;i+=this._curLineItemCount)
				cw+=this._virtualItems[i].width+this._columnGap;
				if (cw > 0)
					cw-=this._columnGap;
				if (this._autoResizeItem)
					ch=this._scrollPane.viewHeight;
				else{
					for (i=0;i < len2;i++)
					ch+=this._virtualItems[i].height+this._lineGap;
					if (ch > 0)
						ch-=this._lineGap;
				}
			}
			else{
				var pageCount=Math.ceil(len / (this._curLineItemCount *this._curLineItemCount2));
				cw=pageCount *this.viewWidth;
				ch=this.viewHeight;
			}
		}
		this.handleAlign(cw,ch);
		this._scrollPane.setContentSize(cw,ch);
		this._eventLocked=false;
		this.handleScroll(true);
	}

	__proto.__scrolled=function(evt){
		this.handleScroll(false);
	}

	__proto.getIndexOnPos1=function(forceUpdate){
		if (this._realNumItems < this._curLineItemCount){
			GList.pos_param=0;
			return 0;
		};
		var i=0;
		var pos2=NaN;
		var pos3=NaN;
		if (this.numChildren > 0 && !forceUpdate){
			pos2=this.getChildAt(0).y;
			if (pos2 > GList.pos_param){
				for (i=this._firstIndex-this._curLineItemCount;i >=0;i-=this._curLineItemCount){
					pos2-=(this._virtualItems[i].height+this._lineGap);
					if (pos2 <=GList.pos_param){
						GList.pos_param=pos2;
						return i;
					}
				}
				GList.pos_param=0;
				return 0;
			}
			else{
				for (i=this._firstIndex;i < this._realNumItems;i+=this._curLineItemCount){
					pos3=pos2+this._virtualItems[i].height+this._lineGap;
					if (pos3 > GList.pos_param){
						GList.pos_param=pos2;
						return i;
					}
					pos2=pos3;
				}
				GList.pos_param=pos2;
				return this._realNumItems-this._curLineItemCount;
			}
		}
		else{
			pos2=0;
			for (i=0;i < this._realNumItems;i+=this._curLineItemCount){
				pos3=pos2+this._virtualItems[i].height+this._lineGap;
				if (pos3 > GList.pos_param){
					GList.pos_param=pos2;
					return i;
				}
				pos2=pos3;
			}
			GList.pos_param=pos2;
			return this._realNumItems-this._curLineItemCount;
		}
	}

	__proto.getIndexOnPos2=function(forceUpdate){
		if (this._realNumItems < this._curLineItemCount){
			GList.pos_param=0;
			return 0;
		};
		var i=0;
		var pos2=NaN;
		var pos3=NaN;
		if (this.numChildren > 0 && !forceUpdate){
			pos2=this.getChildAt(0).x;
			if (pos2 > GList.pos_param){
				for (i=this._firstIndex-this._curLineItemCount;i >=0;i-=this._curLineItemCount){
					pos2-=(this._virtualItems[i].width+this._columnGap);
					if (pos2 <=GList.pos_param){
						GList.pos_param=pos2;
						return i;
					}
				}
				GList.pos_param=0;
				return 0;
			}
			else{
				for (i=this._firstIndex;i < this._realNumItems;i+=this._curLineItemCount){
					pos3=pos2+this._virtualItems[i].width+this._columnGap;
					if (pos3 > GList.pos_param){
						GList.pos_param=pos2;
						return i;
					}
					pos2=pos3;
				}
				GList.pos_param=pos2;
				return this._realNumItems-this._curLineItemCount;
			}
		}
		else{
			pos2=0;
			for (i=0;i < this._realNumItems;i+=this._curLineItemCount){
				pos3=pos2+this._virtualItems[i].width+this._columnGap;
				if (pos3 > GList.pos_param){
					GList.pos_param=pos2;
					return i;
				}
				pos2=pos3;
			}
			GList.pos_param=pos2;
			return this._realNumItems-this._curLineItemCount;
		}
	}

	__proto.getIndexOnPos3=function(forceUpdate){
		if (this._realNumItems < this._curLineItemCount){
			GList.pos_param=0;
			return 0;
		};
		var viewWidth=this.viewWidth;
		var page=Math.floor(GList.pos_param / viewWidth);
		var startIndex=page *(this._curLineItemCount *this._curLineItemCount2);
		var pos2=page *viewWidth;
		var i=0;
		var pos3=NaN;
		for (i=0;i < this._curLineItemCount;i++){
			pos3=pos2+this._virtualItems[startIndex+i].width+this._columnGap;
			if (pos3 > GList.pos_param){
				GList.pos_param=pos2;
				return startIndex+i;
			}
			pos2=pos3;
		}
		GList.pos_param=pos2;
		return startIndex+this._curLineItemCount-1;
	}

	__proto.handleScroll=function(forceUpdate){
		if (this._eventLocked)
			return;
		if (this._layout==0 || this._layout==2){
			var enterCounter=0;
			while(this.handleScroll1(forceUpdate)){
				enterCounter++;
				forceUpdate=false;
				if(enterCounter>20){
					console.log("FairyGUI: list will never be filled as the item renderer function always returns a different size.");
					break ;
				}
			}
			this.handleArchOrder1();
		}
		else if (this._layout==1 || this._layout==3){
			enterCounter=0;
			while(this.handleScroll2(forceUpdate)){
				enterCounter++;
				forceUpdate=false;
				if(enterCounter>20){
					console.log("FairyGUI: list will never be filled as the item renderer function always returns a different size.");
					break ;
				}
			}
			this.handleArchOrder2();
		}
		else{
			this.handleScroll3(forceUpdate);
		}
		this._boundsChanged=false;
	}

	__proto.handleScroll1=function(forceUpdate){
		var pos=this._scrollPane.scrollingPosY;
		var max=pos+this._scrollPane.viewHeight;
		var end=max==this._scrollPane.contentHeight;
		fairygui.GList.pos_param=pos;
		var newFirstIndex=this.getIndexOnPos1(forceUpdate);
		pos=fairygui.GList.pos_param;
		if (newFirstIndex==this._firstIndex && !forceUpdate)
			return false;
		var oldFirstIndex=this._firstIndex;
		this._firstIndex=newFirstIndex;
		var curIndex=newFirstIndex;
		var forward=oldFirstIndex > newFirstIndex;
		var childCount=this.numChildren;
		var lastIndex=oldFirstIndex+childCount-1;
		var reuseIndex=forward ? lastIndex :oldFirstIndex;
		var curX=0,curY=pos;
		var needRender=false;
		var deltaSize=0;
		var firstItemDeltaSize=0;
		var url=this.defaultItem;
		var ii,ii2;
		var i=0,j=0;
		var partSize=(this._scrollPane.viewWidth-this._columnGap *(this._curLineItemCount-1))/ this._curLineItemCount;
		this.itemInfoVer++;
		while (curIndex < this._realNumItems && (end || curY < max)){
			ii=this._virtualItems[curIndex];
			if (ii.obj==null || forceUpdate){
				if (this.itemProvider !=null){
					url=this.itemProvider.runWith(curIndex % this._numItems);
					if (url==null)
						url=this._defaultItem;
					url=UIPackage.normalizeURL(url);
				}
				if (ii.obj !=null && ii.obj.resourceURL !=url){
					if ((ii.obj instanceof fairygui.GButton ))
						ii.selected=(ii.obj).selected;
					this.removeChildToPool(ii.obj);
					ii.obj=null;
				}
			}
			if (ii.obj==null){
				if (forward){
					for (j=reuseIndex;j >=oldFirstIndex;j--){
						ii2=this._virtualItems[j];
						if (ii2.obj !=null && ii2.updateFlag !=this.itemInfoVer && ii2.obj.resourceURL==url){
							if ((ii2.obj instanceof fairygui.GButton ))
								ii2.selected=(ii2.obj).selected;
							ii.obj=ii2.obj;
							ii2.obj=null;
							if (j==reuseIndex)
								reuseIndex--;
							break ;
						}
					}
				}
				else{
					for (j=reuseIndex;j <=lastIndex;j++){
						ii2=this._virtualItems[j];
						if (ii2.obj !=null && ii2.updateFlag !=this.itemInfoVer && ii2.obj.resourceURL==url){
							if ((ii2.obj instanceof fairygui.GButton ))
								ii2.selected=(ii2.obj).selected;
							ii.obj=ii2.obj;
							ii2.obj=null;
							if (j==reuseIndex)
								reuseIndex++;
							break ;
						}
					}
				}
				if (ii.obj !=null){
					this.setChildIndex(ii.obj,forward ? curIndex-newFirstIndex :this.numChildren);
				}
				else{
					ii.obj=this._pool.getObject(url);
					if (forward)
						this.addChildAt(ii.obj,curIndex-newFirstIndex);
					else
					this.addChild(ii.obj);
				}
				if ((ii.obj instanceof fairygui.GButton ))
					(ii.obj).selected=ii.selected;
				needRender=true;
			}
			else
			needRender=forceUpdate;
			if (needRender){
				if (this._autoResizeItem && (this._layout==0 || this._columnCount > 0))
					ii.obj.setSize(partSize,ii.obj.height,true);
				this.itemRenderer.runWith([curIndex % this._numItems,ii.obj]);
				if (curIndex % this._curLineItemCount==0){
					deltaSize+=Math.ceil(ii.obj.height)-ii.height;
					if (curIndex==newFirstIndex && oldFirstIndex > newFirstIndex){
						firstItemDeltaSize=Math.ceil(ii.obj.height)-ii.height;
					}
				}
				ii.width=Math.ceil(ii.obj.width);
				ii.height=Math.ceil(ii.obj.height);
			}
			ii.updateFlag=this.itemInfoVer;
			ii.obj.setXY(curX,curY);
			if (curIndex==newFirstIndex)
				max+=ii.height;
			curX+=ii.width+this._columnGap;
			if (curIndex % this._curLineItemCount==this._curLineItemCount-1){
				curX=0;
				curY+=ii.height+this._lineGap;
			}
			curIndex++;
		}
		for (i=0;i < childCount;i++){
			ii=this._virtualItems[oldFirstIndex+i];
			if (ii.updateFlag !=this.itemInfoVer && ii.obj !=null){
				if ((ii.obj instanceof fairygui.GButton ))
					ii.selected=(ii.obj).selected;
				this.removeChildToPool(ii.obj);
				ii.obj=null;
			}
		}
		childCount=this._children.length;
		for (i=0;i < childCount;i++){
			var obj=this._virtualItems[newFirstIndex+i].obj;
			if (this._children[i] !=obj)
				this.setChildIndex(obj,i);
		}
		if (deltaSize !=0 || firstItemDeltaSize !=0)
			this._scrollPane.changeContentSizeOnScrolling(0,deltaSize,0,firstItemDeltaSize);
		if (curIndex > 0 && this.numChildren > 0 && this._container.y < 0 && this.getChildAt(0).y >-this._container.y)
			return true;
		else
		return false;
	}

	__proto.handleScroll2=function(forceUpdate){
		var pos=this._scrollPane.scrollingPosX;
		var max=pos+this._scrollPane.viewWidth;
		var end=pos==this._scrollPane.contentWidth;
		fairygui.GList.pos_param=pos;
		var newFirstIndex=this.getIndexOnPos2(forceUpdate);
		pos=fairygui.GList.pos_param;
		if (newFirstIndex==this._firstIndex && !forceUpdate)
			return false;
		var oldFirstIndex=this._firstIndex;
		this._firstIndex=newFirstIndex;
		var curIndex=newFirstIndex;
		var forward=oldFirstIndex > newFirstIndex;
		var childCount=this.numChildren;
		var lastIndex=oldFirstIndex+childCount-1;
		var reuseIndex=forward ? lastIndex :oldFirstIndex;
		var curX=pos,curY=0;
		var needRender=false;
		var deltaSize=0;
		var firstItemDeltaSize=0;
		var url=this.defaultItem;
		var ii,ii2;
		var i=0,j=0;
		var partSize=(this._scrollPane.viewHeight-this._lineGap *(this._curLineItemCount-1))/ this._curLineItemCount;
		this.itemInfoVer++;
		while (curIndex < this._realNumItems && (end || curX < max)){
			ii=this._virtualItems[curIndex];
			if (ii.obj==null || forceUpdate){
				if (this.itemProvider !=null){
					url=this.itemProvider.runWith(curIndex % this._numItems);
					if (url==null)
						url=this._defaultItem;
					url=UIPackage.normalizeURL(url);
				}
				if (ii.obj !=null && ii.obj.resourceURL !=url){
					if ((ii.obj instanceof fairygui.GButton ))
						ii.selected=(ii.obj).selected;
					this.removeChildToPool(ii.obj);
					ii.obj=null;
				}
			}
			if (ii.obj==null){
				if (forward){
					for (j=reuseIndex;j >=oldFirstIndex;j--){
						ii2=this._virtualItems[j];
						if (ii2.obj !=null && ii2.updateFlag !=this.itemInfoVer && ii2.obj.resourceURL==url){
							if ((ii2.obj instanceof fairygui.GButton ))
								ii2.selected=(ii2.obj).selected;
							ii.obj=ii2.obj;
							ii2.obj=null;
							if (j==reuseIndex)
								reuseIndex--;
							break ;
						}
					}
				}
				else{
					for (j=reuseIndex;j <=lastIndex;j++){
						ii2=this._virtualItems[j];
						if (ii2.obj !=null && ii2.updateFlag !=this.itemInfoVer && ii2.obj.resourceURL==url){
							if ((ii2.obj instanceof fairygui.GButton ))
								ii2.selected=(ii2.obj).selected;
							ii.obj=ii2.obj;
							ii2.obj=null;
							if (j==reuseIndex)
								reuseIndex++;
							break ;
						}
					}
				}
				if (ii.obj !=null){
					this.setChildIndex(ii.obj,forward ? curIndex-newFirstIndex :this.numChildren);
				}
				else{
					ii.obj=this._pool.getObject(url);
					if (forward)
						this.addChildAt(ii.obj,curIndex-newFirstIndex);
					else
					this.addChild(ii.obj);
				}
				if ((ii.obj instanceof fairygui.GButton ))
					(ii.obj).selected=ii.selected;
				needRender=true;
			}
			else
			needRender=forceUpdate;
			if (needRender){
				if (this._autoResizeItem && (this._layout==1 || this._lineCount > 0))
					ii.obj.setSize(ii.obj.width,partSize,true);
				this.itemRenderer.runWith([curIndex % this._numItems,ii.obj]);
				if (curIndex % this._curLineItemCount==0){
					deltaSize+=Math.ceil(ii.obj.width)-ii.width;
					if (curIndex==newFirstIndex && oldFirstIndex > newFirstIndex){
						firstItemDeltaSize=Math.ceil(ii.obj.width)-ii.width;
					}
				}
				ii.width=Math.ceil(ii.obj.width);
				ii.height=Math.ceil(ii.obj.height);
			}
			ii.updateFlag=this.itemInfoVer;
			ii.obj.setXY(curX,curY);
			if (curIndex==newFirstIndex)
				max+=ii.width;
			curY+=ii.height+this._lineGap;
			if (curIndex % this._curLineItemCount==this._curLineItemCount-1){
				curY=0;
				curX+=ii.width+this._columnGap;
			}
			curIndex++;
		}
		for (i=0;i < childCount;i++){
			ii=this._virtualItems[oldFirstIndex+i];
			if (ii.updateFlag !=this.itemInfoVer && ii.obj !=null){
				if ((ii.obj instanceof fairygui.GButton ))
					ii.selected=(ii.obj).selected;
				this.removeChildToPool(ii.obj);
				ii.obj=null;
			}
		}
		childCount=this._children.length;
		for (i=0;i < childCount;i++){
			var obj=this._virtualItems[newFirstIndex+i].obj;
			if (this._children[i] !=obj)
				this.setChildIndex(obj,i);
		}
		if (deltaSize !=0 || firstItemDeltaSize !=0)
			this._scrollPane.changeContentSizeOnScrolling(deltaSize,0,firstItemDeltaSize,0);
		if (curIndex > 0 && this.numChildren > 0 && this._container.x < 0 && this.getChildAt(0).x >-this._container.x)
			return true;
		else
		return false;
	}

	__proto.handleScroll3=function(forceUpdate){
		var pos=this._scrollPane.scrollingPosX;
		fairygui.GList.pos_param=pos;
		var newFirstIndex=this.getIndexOnPos3(forceUpdate);
		pos=fairygui.GList.pos_param;
		if (newFirstIndex==this._firstIndex && !forceUpdate)
			return;
		var oldFirstIndex=this._firstIndex;
		this._firstIndex=newFirstIndex;
		var reuseIndex=oldFirstIndex;
		var virtualItemCount=this._virtualItems.length;
		var pageSize=this._curLineItemCount *this._curLineItemCount2;
		var startCol=newFirstIndex % this._curLineItemCount;
		var viewWidth=this.viewWidth;
		var page=Math.floor(newFirstIndex / pageSize);
		var startIndex=page *pageSize;
		var lastIndex=startIndex+pageSize *2;
		var needRender=false;
		var i=0;
		var ii,ii2;
		var col=0;
		var url=this._defaultItem;
		var partWidth=(this._scrollPane.viewWidth-this._columnGap *(this._curLineItemCount-1))/ this._curLineItemCount;
		var partHeight=(this._scrollPane.viewHeight-this._lineGap *(this._curLineItemCount2-1))/ this._curLineItemCount2;
		this.itemInfoVer++;
		for (i=startIndex;i < lastIndex;i++){
			if (i >=this._realNumItems)
				continue ;
			col=i % this._curLineItemCount;
			if (i-startIndex < pageSize){
				if (col < startCol)
					continue ;
			}
			else{
				if (col > startCol)
					continue ;
			}
			ii=this._virtualItems[i];
			ii.updateFlag=this.itemInfoVer;
		};
		var lastObj=null;
		var insertIndex=0;
		for (i=startIndex;i < lastIndex;i++){
			if (i >=this._realNumItems)
				continue ;
			ii=this._virtualItems[i];
			if (ii.updateFlag !=this.itemInfoVer)
				continue ;
			if (ii.obj==null){
				while (reuseIndex < virtualItemCount){
					ii2=this._virtualItems[reuseIndex];
					if (ii2.obj !=null && ii2.updateFlag !=this.itemInfoVer){
						if ((ii2.obj instanceof fairygui.GButton ))
							ii2.selected=(ii2.obj).selected;
						ii.obj=ii2.obj;
						ii2.obj=null;
						break ;
					}
					reuseIndex++;
				}
				if (insertIndex==-1)
					insertIndex=this.getChildIndex(lastObj)+1;
				if (ii.obj==null){
					if (this.itemProvider !=null){
						url=this.itemProvider.runWith(i % this._numItems);
						if (url==null)
							url=this._defaultItem;
						url=UIPackage.normalizeURL(url);
					}
					ii.obj=this._pool.getObject(url);
					this.addChildAt(ii.obj,insertIndex);
				}
				else{
					insertIndex=this.setChildIndexBefore(ii.obj,insertIndex);
				}
				insertIndex++;
				if ((ii.obj instanceof fairygui.GButton ))
					(ii.obj).selected=ii.selected;
				needRender=true;
			}
			else{
				needRender=forceUpdate;
				insertIndex=-1;
				lastObj=ii.obj;
			}
			if (needRender){
				if (this._autoResizeItem){
					if (this._curLineItemCount==this._columnCount && this._curLineItemCount2==this._lineCount)
						ii.obj.setSize(partWidth,partHeight,true);
					else if (this._curLineItemCount==this._columnCount)
					ii.obj.setSize(partWidth,ii.obj.height,true);
					else if (this._curLineItemCount2==this._lineCount)
					ii.obj.setSize(ii.obj.width,partHeight,true);
				}
				this.itemRenderer.runWith([i % this._numItems,ii.obj]);
				ii.width=Math.ceil(ii.obj.width);
				ii.height=Math.ceil(ii.obj.height);
			}
		};
		var borderX=(startIndex / pageSize)*viewWidth;
		var xx=borderX;
		var yy=0;
		var lineHeight=0;
		for (i=startIndex;i < lastIndex;i++){
			if (i >=this._realNumItems)
				continue ;
			ii=this._virtualItems[i];
			if (ii.updateFlag==this.itemInfoVer)
				ii.obj.setXY(xx,yy);
			if (ii.height > lineHeight)
				lineHeight=ii.height;
			if (i % this._curLineItemCount==this._curLineItemCount-1){
				xx=borderX;
				yy+=lineHeight+this._lineGap;
				lineHeight=0;
				if (i==startIndex+pageSize-1){
					borderX+=viewWidth;
					xx=borderX;
					yy=0;
				}
			}
			else
			xx+=ii.width+this._columnGap;
		}
		for (i=reuseIndex;i < virtualItemCount;i++){
			ii=this._virtualItems[i];
			if (ii.updateFlag !=this.itemInfoVer && ii.obj !=null){
				if ((ii.obj instanceof fairygui.GButton ))
					ii.selected=(ii.obj).selected;
				this.removeChildToPool(ii.obj);
				ii.obj=null;
			}
		}
	}

	__proto.handleArchOrder1=function(){
		if (this.childrenRenderOrder==2){
			var mid=this._scrollPane.posY+this.viewHeight / 2;
			var minDist=Number.POSITIVE_INFINITY;
			var dist=0;
			var apexIndex=0;
			var cnt=this.numChildren;
			for (var i=0;i < cnt;i++){
				var obj=this.getChildAt(i);
				if (!this.foldInvisibleItems || obj.visible){
					dist=Math.abs(mid-obj.y-obj.height / 2);
					if (dist < minDist){
						minDist=dist;
						apexIndex=i;
					}
				}
			}
			this.apexIndex=apexIndex;
		}
	}

	__proto.handleArchOrder2=function(){
		if (this.childrenRenderOrder==2){
			var mid=this._scrollPane.posX+this.viewWidth / 2;
			var minDist=Number.POSITIVE_INFINITY;
			var dist=0;
			var apexIndex=0;
			var cnt=this.numChildren;
			for (var i=0;i < cnt;i++){
				var obj=this.getChildAt(i);
				if (!this.foldInvisibleItems || obj.visible){
					dist=Math.abs(mid-obj.x-obj.width / 2);
					if (dist < minDist){
						minDist=dist;
						apexIndex=i;
					}
				}
			}
			this.apexIndex=apexIndex;
		}
	}

	__proto.handleAlign=function(contentWidth,contentHeight){
		var newOffsetX=0;
		var newOffsetY=0;
		if (contentHeight < this.viewHeight){
			if (this._verticalAlign=="middle")
				newOffsetY=Math.floor((this.viewHeight-contentHeight)/ 2);
			else if (this._verticalAlign=="bottom")
			newOffsetY=this.viewHeight-contentHeight;
		}
		if (contentWidth < this.viewWidth){
			if (this._align=="center")
				newOffsetX=Math.floor((this.viewWidth-contentWidth)/ 2);
			else if (this._align=="right")
			newOffsetX=this.viewWidth-contentWidth;
		}
		if (newOffsetX!=this._alignOffset.x || newOffsetY!=this._alignOffset.y){
			this._alignOffset.setTo(newOffsetX,newOffsetY);
			if (this._scrollPane !=null)
				this._scrollPane.adjustMaskContainer();
			else
			this._container.pos(this._margin.left+this._alignOffset.x,this._margin.top+this._alignOffset.y);
		}
	}

	__proto.updateBounds=function(){
		if(this._virtual)
			return;
		var i=0;
		var child;
		var curX=0;
		var curY=0;
		var maxWidth=0;
		var maxHeight=0;
		var cw=0,ch=0;
		var j=0;
		var page=0;
		var k=0;
		var cnt=this._children.length;
		var viewWidth=this.viewWidth;
		var viewHeight=this.viewHeight;
		var lineSize=0;
		var lineStart=0;
		var ratio=NaN;
		if(this._layout==0){
			for(i=0;i<cnt;i++){
				child=this.getChildAt(i);
				if (this.foldInvisibleItems && !child.visible)
					continue ;
				if (curY !=0)
					curY+=this._lineGap;
				child.y=curY;
				if (this._autoResizeItem)
					child.setSize(viewWidth,child.height,true);
				curY+=Math.ceil(child.height);
				if(child.width>maxWidth)
					maxWidth=child.width;
			}
			cw=Math.ceil(maxWidth);
			ch=curY;
		}
		else if(this._layout==1){
			for(i=0;i<cnt;i++){
				child=this.getChildAt(i);
				if (this.foldInvisibleItems && !child.visible)
					continue ;
				if(curX!=0)
					curX+=this._columnGap;
				child.x=curX;
				if (this._autoResizeItem)
					child.setSize(child.width,viewHeight,true);
				curX+=Math.ceil(child.width);
				if(child.height>maxHeight)
					maxHeight=child.height;
			}
			cw=curX;
			ch=Math.ceil(maxHeight);
		}
		else if(this._layout==2){
			if (this._autoResizeItem && this._columnCount > 0){
				for (i=0;i < cnt;i++){
					child=this.getChildAt(i);
					if (this.foldInvisibleItems && !child.visible)
						continue ;
					lineSize+=child.sourceWidth;
					j++;
					if (j==this._columnCount || i==cnt-1){
						ratio=(viewWidth-lineSize-(j-1)*this._columnGap)/ lineSize;
						curX=0;
						for (j=lineStart;j <=i;j++){
							child=this.getChildAt(j);
							if (this.foldInvisibleItems && !child.visible)
								continue ;
							child.setXY(curX,curY);
							if (j < i){
								child.setSize(child.sourceWidth+Math.round(child.sourceWidth *ratio),child.height,true);
								curX+=Math.ceil(child.width)+this._columnGap;
							}
							else{
								child.setSize(viewWidth-curX,child.height,true);
							}
							if (child.height > maxHeight)
								maxHeight=child.height;
						}
						curY+=Math.ceil(maxHeight)+this._lineGap;
						maxHeight=0;
						j=0;
						lineStart=i+1;
						lineSize=0;
					}
				}
				ch=curY+Math.ceil(maxHeight);
				cw=viewWidth;
			}
			else{
				for(i=0;i<cnt;i++){
					child=this.getChildAt(i);
					if (this.foldInvisibleItems && !child.visible)
						continue ;
					if(curX!=0)
						curX+=this._columnGap;
					if (this._columnCount !=0 && j >=this._columnCount
						|| this._columnCount==0 && curX+child.width > viewWidth && maxHeight !=0){
						curX=0;
						curY+=Math.ceil(maxHeight)+this._lineGap;
						maxHeight=0;
						j=0;
					}
					child.setXY(curX,curY);
					curX+=Math.ceil(child.width);
					if (curX > maxWidth)
						maxWidth=curX;
					if (child.height > maxHeight)
						maxHeight=child.height;
					j++;
				}
				ch=curY+Math.ceil(maxHeight);
				cw=Math.ceil(maxWidth);
			}
		}
		else if (this._layout==3){
			if (this._autoResizeItem && this._lineCount > 0){
				for (i=0;i < cnt;i++){
					child=this.getChildAt(i);
					if (this.foldInvisibleItems && !child.visible)
						continue ;
					lineSize+=child.sourceHeight;
					j++;
					if (j==this._lineCount || i==cnt-1){
						ratio=(viewHeight-lineSize-(j-1)*this._lineGap)/ lineSize;
						curY=0;
						for (j=lineStart;j <=i;j++){
							child=this.getChildAt(j);
							if (this.foldInvisibleItems && !child.visible)
								continue ;
							child.setXY(curX,curY);
							if (j < i){
								child.setSize(child.width,child.sourceHeight+Math.round(child.sourceHeight *ratio),true);
								curY+=Math.ceil(child.height)+this._lineGap;
							}
							else{
								child.setSize(child.width,viewHeight-curY,true);
							}
							if (child.width > maxWidth)
								maxWidth=child.width;
						}
						curX+=Math.ceil(maxWidth)+this._columnGap;
						maxWidth=0;
						j=0;
						lineStart=i+1;
						lineSize=0;
					}
				}
				cw=curX+Math.ceil(maxWidth);
				ch=viewHeight;
			}
			else{
				for(i=0;i<cnt;i++){
					child=this.getChildAt(i);
					if (this.foldInvisibleItems && !child.visible)
						continue ;
					if(curY!=0)
						curY+=this._lineGap;
					if (this._lineCount !=0 && j >=this._lineCount
						|| this._lineCount==0 && curY+child.height > viewHeight && maxWidth !=0){
						curY=0;
						curX+=Math.ceil(maxWidth)+this._columnGap;
						maxWidth=0;
						j=0;
					}
					child.setXY(curX,curY);
					curY+=Math.ceil(child.height);
					if (curY > maxHeight)
						maxHeight=curY;
					if (child.width > maxWidth)
						maxWidth=child.width;
					j++;
				}
				cw=curX+Math.ceil(maxWidth);
				ch=Math.ceil(maxHeight);
			}
		}
		else{
			var eachHeight=0;
			if(this._autoResizeItem && this._lineCount>0)
				eachHeight=Math.floor((viewHeight-(this._lineCount-1)*this._lineGap)/this._lineCount);
			if (this._autoResizeItem && this._columnCount > 0){
				for (i=0;i < cnt;i++){
					child=this.getChildAt(i);
					if (this.foldInvisibleItems && !child.visible)
						continue ;
					if (j==0 && (this._lineCount !=0 && k >=this._lineCount
						|| this._lineCount==0 && curY+child.height > viewHeight)){
						page++;
						curY=0;
						k=0;
					}
					lineSize+=child.sourceWidth;
					j++;
					if (j==this._columnCount || i==cnt-1){
						ratio=(viewWidth-lineSize-(j-1)*this._columnGap)/ lineSize;
						curX=0;
						for (j=lineStart;j <=i;j++){
							child=this.getChildAt(j);
							if (this.foldInvisibleItems && !child.visible)
								continue ;
							child.setXY(page *viewWidth+curX,curY);
							if (j < i){
								child.setSize(child.sourceWidth+Math.round(child.sourceWidth *ratio),
								this._lineCount>0?eachHeight:child.height,true);
								curX+=Math.ceil(child.width)+this._columnGap;
							}
							else{
								child.setSize(viewWidth-curX,this._lineCount>0?eachHeight:child.height,true);
							}
							if (child.height > maxHeight)
								maxHeight=child.height;
						}
						curY+=Math.ceil(maxHeight)+this._lineGap;
						maxHeight=0;
						j=0;
						lineStart=i+1;
						lineSize=0;
						k++;
					}
				}
			}
			else{
				for (i=0;i < cnt;i++){
					child=this.getChildAt(i);
					if (this.foldInvisibleItems && !child.visible)
						continue ;
					if (curX !=0)
						curX+=this._columnGap;
					if (this._autoResizeItem && this._lineCount > 0)
						child.setSize(child.width,eachHeight,true);
					if (this._columnCount !=0 && j >=this._columnCount
						|| this._columnCount==0 && curX+child.width > viewWidth && maxHeight !=0){
						curX=0;
						curY+=Math.ceil(maxHeight)+this._lineGap;
						maxHeight=0;
						j=0;
						k++;
						if (this._lineCount !=0 && k >=this._lineCount
							|| this._lineCount==0 && curY+child.height > viewHeight && maxWidth !=0){
							page++;
							curY=0;
							k=0;
						}
					}
					child.setXY(page *viewWidth+curX,curY);
					curX+=Math.ceil(child.width);
					if (curX > maxWidth)
						maxWidth=curX;
					if (child.height > maxHeight)
						maxHeight=child.height;
					j++;
				}
			}
			ch=page > 0 ? viewHeight :curY+Math.ceil(maxHeight);
			cw=(page+1)*viewWidth;
		}
		this.handleAlign(cw,ch);
		this.setBounds(0,0,cw,ch);
	}

	__proto.setup_beforeAdd=function(buffer,beginPos){
		fairygui.GObject.prototype.setup_beforeAdd.call(this,buffer,beginPos);
		buffer.seek(beginPos,5);
		var i=0;
		var j=0;
		var cnt=0;
		var i1=0;
		var i2=0;
		var nextPos=0;
		var str;
		this._layout=buffer.readByte();
		this._selectionMode=buffer.readByte();
		i1=buffer.readByte();
		this._align=i1==0?"left":(i1==1?"center":"right");
		i1=buffer.readByte();
		this._verticalAlign=i1==0?"top":(i1==1?"middle":"bottom");
		this._lineGap=buffer.getInt16();
		this._columnGap=buffer.getInt16();
		this._lineCount=buffer.getInt16();
		this._columnCount=buffer.getInt16();
		this._autoResizeItem=buffer.readBool();
		this._childrenRenderOrder=buffer.readByte();
		this._apexIndex=buffer.getInt16();
		if (buffer.readBool()){
			this._margin.top=buffer.getInt32();
			this._margin.bottom=buffer.getInt32();
			this._margin.left=buffer.getInt32();
			this._margin.right=buffer.getInt32();
		};
		var overflow=buffer.readByte();
		if (overflow==2){
			var savedPos=buffer.pos;
			buffer.seek(beginPos,7);
			this.setupScroll(buffer);
			buffer.pos=savedPos;
		}
		else
		this.setupOverflow(overflow);
		if (buffer.readBool())
			buffer.skip(8);
		buffer.seek(beginPos,8);
		this._defaultItem=buffer.readS();
		var itemCount=buffer.getInt16();
		for (i=0;i < itemCount;i++){
			nextPos=buffer.getInt16();
			nextPos+=buffer.pos;
			str=buffer.readS();
			if (str==null){
				str=this.defaultItem;
				if (!str){
					buffer.pos=nextPos;
					continue ;
				}
			};
			var obj=this.getFromPool(str);
			if (obj !=null){
				this.addChild(obj);
				str=buffer.readS();
				if (str !=null)
					obj.text=str;
				str=buffer.readS();
				if (str !=null && ((obj instanceof fairygui.GButton )))
					(obj).selectedTitle=str;
				str=buffer.readS();
				if (str !=null)
					obj.icon=str;
				str=buffer.readS();
				if (str !=null && ((obj instanceof fairygui.GButton )))
					(obj).selectedIcon=str;
				str=buffer.readS();
				if (str !=null)
					obj.name=str;
				if ((obj instanceof fairygui.GComponent )){
					cnt=buffer.getInt16();
					for (j=0;j < cnt;j++){
						var cc=(obj).getController(buffer.readS());
						str=buffer.readS();
						if (cc !=null)
							cc.selectedPageId=str;
					}
				}
			}
			buffer.pos=nextPos;
		}
	}

	__proto.setup_afterAdd=function(buffer,beginPos){
		_super.prototype.setup_afterAdd.call(this,buffer,beginPos);
		buffer.seek(beginPos,6);
		var i=buffer.getInt16();
		if (i !=-1)
			this._selectionController=this.parent.getControllerAt(i);
	}

	/**
	*@see ListLayoutType
	*/
	/**
	*@see ListLayoutType
	*/
	__getset(0,__proto,'layout',function(){
		return this._layout;
		},function(value){
		if (this._layout !=value){
			this._layout=value;
			this.setBoundsChangedFlag();
			if(this._virtual)
				this.setVirtualListChangedFlag(true);
		}
	});

	__getset(0,__proto,'align',function(){
		return this._align;
		},function(value){
		if(this._align!=value){
			this._align=value;
			this.setBoundsChangedFlag();
			if (this._virtual)
				this.setVirtualListChangedFlag(true);
		}
	});

	__getset(0,__proto,'lineCount',function(){
		return this._lineCount;
		},function(value){
		if (this._lineCount !=value){
			this._lineCount=value;
			if (this._layout==3 || this._layout==4){
				this.setBoundsChangedFlag();
				if (this._virtual)
					this.setVirtualListChangedFlag(true);
			}
		}
	});

	__getset(0,__proto,'columnCount',function(){
		return this._columnCount;
		},function(value){
		if (this._columnCount !=value){
			this._columnCount=value;
			if (this._layout==2 || this._layout==4){
				this.setBoundsChangedFlag();
				if (this._virtual)
					this.setVirtualListChangedFlag(true);
			}
		}
	});

	__getset(0,__proto,'lineGap',function(){
		return this._lineGap;
		},function(value){
		if (this._lineGap !=value){
			this._lineGap=value;
			this.setBoundsChangedFlag();
			if(this._virtual)
				this.setVirtualListChangedFlag(true);
		}
	});

	__getset(0,__proto,'columnGap',function(){
		return this._columnGap;
		},function(value){
		if(this._columnGap !=value){
			this._columnGap=value;
			this.setBoundsChangedFlag();
			if (this._virtual)
				this.setVirtualListChangedFlag(true);
		}
	});

	__getset(0,__proto,'verticalAlign',function(){
		return this._verticalAlign;
		},function(value){
		if(this._verticalAlign!=value){
			this._verticalAlign=value;
			this.setBoundsChangedFlag();
			if (this._virtual)
				this.setVirtualListChangedFlag(true);
		}
	});

	__getset(0,__proto,'virtualItemSize',function(){
		return this._itemSize;
		},function(value){
		if(this._virtual){
			if(this._itemSize==null)
				this._itemSize=new Point();
			this._itemSize.setTo(value.x,value.y);
			this.setVirtualListChangedFlag(true);
		}
	});

	__getset(0,__proto,'defaultItem',function(){
		return this._defaultItem;
		},function(val){
		this._defaultItem=val;
	});

	__getset(0,__proto,'autoResizeItem',function(){
		return this._autoResizeItem;
		},function(value){
		if(this._autoResizeItem !=value){
			this._autoResizeItem=value;
			this.setBoundsChangedFlag();
			if (this._virtual)
				this.setVirtualListChangedFlag(true);
		}
	});

	/**
	*@see ListSelectionMode
	*/
	/**
	*@see ListSelectionMode
	*/
	__getset(0,__proto,'selectionMode',function(){
		return this._selectionMode;
		},function(value){
		this._selectionMode=value;
	});

	__getset(0,__proto,'selectionController',function(){
		return this._selectionController;
		},function(value){
		this._selectionController=value;
	});

	__getset(0,__proto,'itemPool',function(){
		return this._pool;
	});

	__getset(0,__proto,'selectedIndex',function(){
		var i=0;
		if (this._virtual){
			for (i=0;i < this._realNumItems;i++){
				var ii=this._virtualItems[i];
				if (((ii.obj instanceof fairygui.GButton ))&& (ii.obj).selected
					|| ii.obj==null && ii.selected){
					if (this._loop)
						return i % this._numItems;
					else
					return i;
				}
			}
		}
		else{
			var cnt=this._children.length;
			for (i=0;i < cnt;i++){
				var obj=this._children[i].asButton;
				if (obj !=null && obj.selected)
					return i;
			}
		}
		return-1;
		},function(value){
		if (value >=0 && value < this.numItems){
			if(this._selectionMode!=0)
				this.clearSelection();
			this.addSelection(value);
		}
		else
		this.clearSelection();
	});

	/**
	*Set the list item count.
	*If the list is not virtual,specified Number of items will be created.
	*If the list is virtual,only items in view will be created.
	*/
	__getset(0,__proto,'numItems',function(){
		if(this._virtual)
			return this._numItems;
		else
		return this._children.length;
		},function(value){
		var i=0;
		if (this._virtual){
			if (this.itemRenderer==null)
				throw new Error("Set itemRenderer first!");
			this._numItems=value;
			if (this._loop)
				this._realNumItems=this._numItems *6;
			else
			this._realNumItems=this._numItems;
			var oldCount=this._virtualItems.length;
			if (this._realNumItems > oldCount){
				for (i=oldCount;i < this._realNumItems;i++){
					var ii=new ItemInfo();
					ii.width=this._itemSize.x;
					ii.height=this._itemSize.y;
					this._virtualItems.push(ii);
				}
			}
			else{
				for (i=this._realNumItems;i < oldCount;i++)
				this._virtualItems[i].selected=false;
			}
			if (this._virtualListChanged !=0)
				Laya.timer.clear(this,this._refreshVirtualList);
			this._refreshVirtualList();
		}
		else{
			var cnt=this._children.length;
			if (value > cnt){
				for (i=cnt;i < value;i++){
					if (this.itemProvider==null)
						this.addItemFromPool();
					else
					this.addItemFromPool(this.itemProvider.runWith(i));
				}
			}
			else{
				this.removeChildrenToPool(value,cnt);
			}
			if (this.itemRenderer !=null){
				for (i=0;i < value;i++)
				this.itemRenderer.runWith([i,this.getChildAt(i)]);
			}
		}
	});

	GList.pos_param=NaN;
	GList.__init$=function(){
		
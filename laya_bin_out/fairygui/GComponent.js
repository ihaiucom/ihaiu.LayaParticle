//class fairygui.GComponent extends fairygui.GObject
var GComponent=(function(_super){
	function GComponent(){
		this._sortingChildCount=0;
		this._opaque=false;
		this._applyingController=null;
		this._mask=null;
		this._margin=null;
		this._trackBounds=false;
		this._boundsChanged=false;
		this._childrenRenderOrder=0;
		this._apexIndex=0;
		this._buildingDisplayList=false;
		this._children=null;
		this._controllers=null;
		this._transitions=null;
		this._container=null;
		this._scrollPane=null;
		this._alignOffset=null;
		GComponent.__super.call(this);
		this._children=[];
		this._controllers=[];
		this._transitions=[];
		this._margin=new Margin();
		this._alignOffset=new Point();
		this._opaque=false;
	}

	__class(GComponent,'fairygui.GComponent',_super);
	var __proto=GComponent.prototype;
	__proto.createDisplayObject=function(){
		_super.prototype.createDisplayObject.call(this);
		this._displayObject.mouseEnabled=true;
		this._displayObject.mouseThrough=true;
		this._container=this._displayObject;
	}

	__proto.dispose=function(){
		var i=0;
		var cnt=0;
		cnt=this._transitions.length;
		for (i=0;i < cnt;++i){
			var trans=this._transitions[i];
			trans.dispose();
		}
		cnt=this._controllers.length;
		for (i=0;i < cnt;++i){
			var cc=this._controllers[i];
			cc.dispose();
		}
		if (this.scrollPane !=null)
			this.scrollPane.dispose();
		cnt=this._children.length;
		for(i=cnt-1;i >=0;--i){
			var obj=this._children[i];
			obj.parent=null;
			obj.dispose();
		}
		this._boundsChanged=false;
		this._mask=null;
		_super.prototype.dispose.call(this);
	}

	__proto.addChild=function(child){
		this.addChildAt(child,this._children.length);
		return child;
	}

	__proto.addChildAt=function(child,index){
		(index===void 0)&& (index=0);
		if(!child)
			throw "child is null";
		var numChildren=this._children.length;
		if(index >=0 && index <=numChildren){
			if(child.parent==this){
				this.setChildIndex(child,index);
			}
			else {
				child.removeFromParent();
				child.parent=this;
				var cnt=this._children.length;
				if(child.sortingOrder !=0){
					this._sortingChildCount++;
					index=this.getInsertPosForSortingChild(child);
				}
				else if(this._sortingChildCount > 0){
					if(index > (cnt-this._sortingChildCount))
						index=cnt-this._sortingChildCount;
				}
				if(index==cnt)
					this._children.push(child);
				else
				this._children.splice(index,0,child);
				this.childStateChanged(child);
				this.setBoundsChangedFlag();
			}
			return child;
		}
		else {
			throw "Invalid child index";
		}
	}

	__proto.getInsertPosForSortingChild=function(target){
		var cnt=this._children.length;
		var i=0;
		for(i=0;i < cnt;i++){
			var child=this._children[i];
			if(child==target)
				continue ;
			if(target.sortingOrder < child.sortingOrder)
				break ;
		}
		return i;
	}

	__proto.removeChild=function(child,dispose){
		(dispose===void 0)&& (dispose=false);
		var childIndex=this._children.indexOf(child);
		if(childIndex !=-1){
			this.removeChildAt(childIndex,dispose);
		}
		return child;
	}

	__proto.removeChildAt=function(index,dispose){
		(dispose===void 0)&& (dispose=false);
		if(index >=0 && index < this.numChildren){
			var child=this._children[index];
			child.parent=null;
			if(child.sortingOrder !=0)
				this._sortingChildCount--;
			this._children.splice(index,1);
			child.group=null;
			if(child.inContainer){
				this._container.removeChild(child.displayObject);
				if (this._childrenRenderOrder==2)
					Laya.timer.callLater(this,this.buildNativeDisplayList);
			}
			if(dispose)
				child.dispose();
			this.setBoundsChangedFlag();
			return child;
		}
		else {
			throw "Invalid child index";
		}
	}

	__proto.removeChildren=function(beginIndex,endIndex,dispose){
		(beginIndex===void 0)&& (beginIndex=0);
		(endIndex===void 0)&& (endIndex=-1);
		(dispose===void 0)&& (dispose=false);
		if(endIndex < 0 || endIndex >=this.numChildren)
			endIndex=this.numChildren-1;
		for(var i=beginIndex;i <=endIndex;++i)
		this.removeChildAt(beginIndex,dispose);
	}

	__proto.getChildAt=function(index){
		(index===void 0)&& (index=0);
		if(index >=0 && index < this.numChildren)
			return this._children[index];
		else
		throw "Invalid child index";
	}

	__proto.getChild=function(name){
		var cnt=this._children.length;
		for(var i=0;i < cnt;++i){
			if(this._children[i].name==name)
				return this._children[i];
		}
		return null;
	}

	__proto.getVisibleChild=function(name){
		var cnt=this._children.length;
		for(var i=0;i < cnt;++i){
			var child=this._children[i];
			if(child.internalVisible && child.internalVisible2 && child.name==name)
				return child;
		}
		return null;
	}

	__proto.getChildInGroup=function(name,group){
		var cnt=this._children.length;
		for(var i=0;i < cnt;++i){
			var child=this._children[i];
			if(child.group==group && child.name==name)
				return child;
		}
		return null;
	}

	__proto.getChildById=function(id){
		var cnt=this._children.length;
		for(var i=0;i < cnt;++i){
			if(this._children[i]._id==id)
				return this._children[i];
		}
		return null;
	}

	__proto.getChildIndex=function(child){
		return this._children.indexOf(child);
	}

	__proto.setChildIndex=function(child,index){
		(index===void 0)&& (index=0);
		var oldIndex=this._children.indexOf(child);
		if(oldIndex==-1)
			throw "Not a child of this container";
		if(child.sortingOrder !=0)
			return;
		var cnt=this._children.length;
		if(this._sortingChildCount > 0){
			if(index > (cnt-this._sortingChildCount-1))
				index=cnt-this._sortingChildCount-1;
		}
		this._setChildIndex(child,oldIndex,index);
	}

	__proto.setChildIndexBefore=function(child,index){
		var oldIndex=this._children.indexOf(child);
		if (oldIndex==-1)
			throw "Not a child of this container";
		if(child.sortingOrder!=0)
			return oldIndex;
		var cnt=this._children.length;
		if(this._sortingChildCount>0){
			if (index > (cnt-this._sortingChildCount-1))
				index=cnt-this._sortingChildCount-1;
		}
		if (oldIndex < index)
			return this._setChildIndex(child,oldIndex,index-1);
		else
		return this._setChildIndex(child,oldIndex,index);
	}

	__proto._setChildIndex=function(child,oldIndex,index){
		var cnt=this._children.length;
		if(index > cnt)
			index=cnt;
		if(oldIndex==index)
			return oldIndex;
		this._children.splice(oldIndex,1);
		this._children.splice(index,0,child);
		if(child.inContainer){
			var displayIndex=0;
			var g;
			var i=0;
			if (this._childrenRenderOrder==0){
				for(i=0;i<index;i++){
					g=this._children[i];
					if(g.inContainer)
						displayIndex++;
				}
				if(displayIndex==this._container.numChildren)
					displayIndex--;
				this._container.setChildIndex(child.displayObject,displayIndex);
			}
			else if (this._childrenRenderOrder==1){
				for (i=cnt-1;i > index;i--){
					g=this._children[i];
					if (g.inContainer)
						displayIndex++;
				}
				if(displayIndex==this._container.numChildren)
					displayIndex--;
				this._container.setChildIndex(child.displayObject,displayIndex);
			}
			else{
				Laya.timer.callLater(this,this.buildNativeDisplayList);
			}
			this.setBoundsChangedFlag();
		}
		return index;
	}

	__proto.swapChildren=function(child1,child2){
		var index1=this._children.indexOf(child1);
		var index2=this._children.indexOf(child2);
		if(index1==-1 || index2==-1)
			throw "Not a child of this container";
		this.swapChildrenAt(index1,index2);
	}

	__proto.swapChildrenAt=function(index1,index2){
		(index2===void 0)&& (index2=0);
		var child1=this._children[index1];
		var child2=this._children[index2];
		this.setChildIndex(child1,index2);
		this.setChildIndex(child2,index1);
	}

	__proto.isAncestorOf=function(child){
		if (child==null)
			return false;
		var p=child.parent;
		while(p){
			if(p==this)
				return true;
			p=p.parent;
		}
		return false;
	}

	__proto.addController=function(controller){
		this._controllers.push(controller);
		controller.parent=this;
		this.applyController(controller);
	}

	__proto.getControllerAt=function(index){
		return this._controllers[index];
	}

	__proto.getController=function(name){
		var cnt=this._controllers.length;
		for(var i=0;i < cnt;++i){
			var c=this._controllers[i];
			if(c.name==name)
				return c;
		}
		return null;
	}

	__proto.removeController=function(c){
		var index=this._controllers.indexOf(c);
		if(index==-1)
			throw new Error("controller not exists");
		c.parent=null;
		this._controllers.splice(index,1);
		var length=this._children.length;
		for(var i=0;i < length;i++){
			var child=this._children[i];
			child.handleControllerChanged(c);
		}
	}

	__proto.childStateChanged=function(child){
		if(this._buildingDisplayList)
			return;
		var cnt=this._children.length;
		if((child instanceof fairygui.GGroup )){
			for(var i=0;i < cnt;i++){
				var g=this._children[i];
				if(g.group==child)
					this.childStateChanged(g);
			}
			return;
		}
		if(!child.displayObject)
			return;
		if(child.internalVisible && child.displayObject!=this._displayObject.mask){
			if(!child.displayObject.parent){
				var index=0
				if (this._childrenRenderOrder==0){
					for (i=0;i < cnt;i++){
						g=this._children[i];
						if (g==child)
							break ;
						if (g.displayObject !=null && g.displayObject.parent !=null)
							index++;
					}
					this._container.addChildAt(child.displayObject,index);
				}
				else if (this._childrenRenderOrder==1){
					for (i=cnt-1;i >=0;i--){
						g=this._children[i];
						if (g==child)
							break ;
						if (g.displayObject !=null && g.displayObject.parent !=null)
							index++;
					}
					this._container.addChildAt(child.displayObject,index);
				}
				else{
					this._container.addChild(child.displayObject);
					Laya.timer.callLater(this,this.buildNativeDisplayList);
				}
			}
		}
		else {
			if(child.displayObject.parent){
				this._container.removeChild(child.displayObject);
				if (this._childrenRenderOrder==2)
					Laya.timer.callLater(this,this.buildNativeDisplayList);
			}
		}
	}

	__proto.buildNativeDisplayList=function(){
		var cnt=this._children.length;
		if (cnt==0)
			return;
		var i=0;
		var child;
		switch (this._childrenRenderOrder){
			case 0:{
					for (i=0;i < cnt;i++){
						child=this._children[i];
						if (child.displayObject !=null && child.internalVisible)
							this._container.addChild(child.displayObject);
					}
				}
				break ;
			case 1:{
					for (i=cnt-1;i >=0;i--){
						child=this._children[i];
						if (child.displayObject !=null && child.internalVisible)
							this._container.addChild(child.displayObject);
					}
				}
				break ;
			case 2:{
					for (i=0;i < this._apexIndex;i++){
						child=this._children[i];
						if (child.displayObject !=null && child.internalVisible)
							this._container.addChild(child.displayObject);
					}
					for (i=cnt-1;i >=this._apexIndex;i--){
						child=this._children[i];
						if (child.displayObject !=null && child.internalVisible)
							this._container.addChild(child.displayObject);
					}
				}
				break ;
			}
	}

	__proto.applyController=function(c){
		this._applyingController=c;
		var child;
		var length=this._children.length;
		for(var i=0;i < length;i++){
			child=this._children[i];
			child.handleControllerChanged(c);
		}
		this._applyingController=null;
		c.runActions();
	}

	__proto.applyAllControllers=function(){
		var cnt=this._controllers.length;
		for(var i=0;i < cnt;++i){
			this.applyController(this._controllers[i]);
		}
	}

	__proto.adjustRadioGroupDepth=function(obj,c){
		var cnt=this._children.length;
		var i=NaN;
		var child;
		var myIndex=-1,maxIndex=-1;
		for(i=0;i < cnt;i++){
			child=this._children[i];
			if(child==obj){
				myIndex=i;
			}
			else if(((child instanceof fairygui.GButton ))
			&& (child).relatedController==c){
				if(i > maxIndex)
					maxIndex=i;
			}
		}
		if(myIndex < maxIndex){
			if(this._applyingController!=null)
				this._children[maxIndex].handleControllerChanged(this._applyingController);
			this.swapChildrenAt(myIndex,maxIndex);
		}
	}

	__proto.getTransitionAt=function(index){
		return this._transitions[index];
	}

	__proto.getTransition=function(transName){
		var cnt=this._transitions.length;
		for(var i=0;i < cnt;++i){
			var trans=this._transitions[i];
			if(trans.name==transName)
				return trans;
		}
		return null;
	}

	__proto.isChildInView=function(child){
		if(this._displayObject.scrollRect !=null){
			return child.x+child.width >=0 && child.x <=this.width
			&& child.y+child.height >=0 && child.y <=this.height;
		}
		else if(this._scrollPane !=null){
			return this._scrollPane.isChildInView(child);
		}
		else
		return true;
	}

	__proto.getFirstChildInView=function(){
		var cnt=this._children.length;
		for(var i=0;i < cnt;++i){
			var child=this._children[i];
			if(this.isChildInView(child))
				return i;
		}
		return-1;
	}

	__proto.setMask=function(value,reversed){
		if(this._mask && this._mask!=value){
			if(this._mask.blendMode=="destination-out")
				this._mask.blendMode=null;
		}
		this._mask=value;
		if(!this._mask){
			this._displayObject.mask=null;
			if((this._displayObject.hitArea instanceof fairygui.utils.ChildHitArea ))
				this._displayObject.hitArea=null;
			return;
		}
		if(this._mask.hitArea){
			this._displayObject.hitArea=new ChildHitArea(this._mask,reversed);
			this._displayObject.mouseThrough=false;
			this._displayObject.hitTestPrior=true;
		}
		if(reversed){
			this._displayObject.mask=null;
			this._displayObject.cacheAs="bitmap";
			this._mask.blendMode="destination-out";
		}
		else
		this._displayObject.mask=this._mask;
	}

	__proto.updateHitArea=function(){
		if((this._displayObject.hitArea instanceof fairygui.utils.PixelHitTest )){
			var hitTest=(this._displayObject.hitArea);
			if(this.sourceWidth!=0)
				hitTest.scaleX=this.width/this.sourceWidth;
			if(this.sourceHeight!=0)
				hitTest.scaleY=this.height/this.sourceHeight;
		}
		else if((this._displayObject.hitArea instanceof laya.maths.Rectangle )){
			this._displayObject.hitArea.setTo(0,0,this.width,this.height);
		}
	}

	__proto.updateMask=function(){
		var rect=this._displayObject.scrollRect;
		if(rect==null)
			rect=new Rectangle();
		rect.x=this._margin.left;
		rect.y=this._margin.top;
		rect.width=this.width-this._margin.right;
		rect.height=this.height-this._margin.bottom;
		this._displayObject.scrollRect=rect;
	}

	__proto.setupScroll=function(buffer){
		if (this._displayObject==this._container){
			this._container=new Sprite();
			this._displayObject.addChild(this._container);
		}
		this._scrollPane=new ScrollPane(this);
		this._scrollPane.setup(buffer);
	}

	__proto.setupOverflow=function(overflow){
		if(overflow==1){
			if (this._displayObject==this._container){
				this._container=new Sprite();
				this._displayObject.addChild(this._container);
			}
			this.updateMask();
			this._container.pos(this._margin.left,this._margin.top);
		}
		else if(this._margin.left !=0 || this._margin.top !=0){
			if (this._displayObject==this._container){
				this._container=new Sprite();
				this._displayObject.addChild(this._container);
			}
			this._container.pos(this._margin.left,this._margin.top);
		}
	}

	__proto.handleSizeChanged=function(){
		_super.prototype.handleSizeChanged.call(this);
		if(this._scrollPane)
			this._scrollPane.onOwnerSizeChanged();
		else if(this._displayObject.scrollRect !=null)
		this.updateMask();
		if(this._displayObject.hitArea!=null)
			this.updateHitArea();
	}

	__proto.handleGrayedChanged=function(){
		var c=this.getController("grayed");
		if(c !=null){
			c.selectedIndex=this.grayed ? 1 :0;
			return;
		};
		var v=this.grayed;
		var cnt=this._children.length;
		for(var i=0;i < cnt;++i){
			this._children[i].grayed=v;
		}
	}

	__proto.handleControllerChanged=function(c){
		_super.prototype.handleControllerChanged.call(this,c);
		if (this._scrollPane !=null)
			this._scrollPane.handleControllerChanged(c);
	}

	__proto.setBoundsChangedFlag=function(){
		if (!this._scrollPane && !this._trackBounds)
			return;
		if (!this._boundsChanged){
			this._boundsChanged=true;
			Laya.timer.callLater(this,this.__render);
		}
	}

	__proto.__render=function(){
		if (this._boundsChanged){
			var i1=0;
			var len=this._children.length;
			var child
			for(i1=0;i1 < len;i1++){
				child=this._children[i1];
				child.ensureSizeCorrect();
			}
			this.updateBounds();
		}
	}

	__proto.ensureBoundsCorrect=function(){
		var i1=0;
		var len=this._children.length;
		var child
		for(i1=0;i1 < len;i1++){
			child=this._children[i1];
			child.ensureSizeCorrect();
		}
		if (this._boundsChanged)
			this.updateBounds();
	}

	__proto.updateBounds=function(){
		var ax=0,ay=0,aw=0,ah=0;
		var len=this._children.length;
		if(len > 0){
			ax=Number.POSITIVE_INFINITY,ay=Number.POSITIVE_INFINITY;
			var ar=Number.NEGATIVE_INFINITY,ab=Number.NEGATIVE_INFINITY;
			var tmp=0;
			var i1=0;
			for(i1=0;i1 < len;i1++){
				var child=this._children[i1];
				tmp=child.x;
				if(tmp < ax)
					ax=tmp;
				tmp=child.y;
				if(tmp < ay)
					ay=tmp;
				tmp=child.x+child.actualWidth;
				if(tmp > ar)
					ar=tmp;
				tmp=child.y+child.actualHeight;
				if(tmp > ab)
					ab=tmp;
			}
			aw=ar-ax;
			ah=ab-ay;
		}
		this.setBounds(ax,ay,aw,ah);
	}

	__proto.setBounds=function(ax,ay,aw,ah){
		this._boundsChanged=false;
		if (this._scrollPane)
			this._scrollPane.setContentSize(Math.round(ax+aw),Math.round(ay+ah));
	}

	__proto.getSnappingPosition=function(xValue,yValue,resultPoint){
		if(!resultPoint)
			resultPoint=new Point();
		var cnt=this._children.length;
		if(cnt==0){
			resultPoint.x=0;
			resultPoint.y=0;
			return resultPoint;
		}
		this.ensureBoundsCorrect();
		var obj=null;
		var prev=null;
		var i=0;
		if(yValue !=0){
			for(;i < cnt;i++){
				obj=this._children[i];
				if(yValue < obj.y){
					if(i==0){
						yValue=0;
						break ;
					}
					else {
						prev=this._children[i-1];
						if(yValue < prev.y+prev.actualHeight / 2)
							yValue=prev.y;
						else
						yValue=obj.y;
						break ;
					}
				}
			}
			if(i==cnt)
				yValue=obj.y;
		}
		if(xValue !=0){
			if(i > 0)
				i--;
			for(;i < cnt;i++){
				obj=this._children[i];
				if(xValue < obj.x){
					if(i==0){
						xValue=0;
						break ;
					}
					else {
						prev=this._children[i-1];
						if(xValue < prev.x+prev.actualWidth / 2)
							xValue=prev.x;
						else
						xValue=obj.x;
						break ;
					}
				}
			}
			if(i==cnt)
				xValue=obj.x;
		}
		resultPoint.x=xValue;
		resultPoint.y=yValue;
		return resultPoint;
	}

	__proto.childSortingOrderChanged=function(child,oldValue,newValue){
		(newValue===void 0)&& (newValue=0);
		if (newValue==0){
			this._sortingChildCount--;
			this.setChildIndex(child,this._children.length);
		}
		else {
			if (oldValue==0)
				this._sortingChildCount++;
			var oldIndex=this._children.indexOf(child);
			var index=this.getInsertPosForSortingChild(child);
			if (oldIndex < index)
				this._setChildIndex(child,oldIndex,index-1);
			else
			this._setChildIndex(child,oldIndex,index);
		}
	}

	__proto.constructFromResource=function(){
		this.constructFromResource2(null,0);
	}

	__proto.constructFromResource2=function(objectPool,poolIndex){
		if (!this.packageItem.decoded){
			this.packageItem.decoded=true;
			TranslationHelper.translateComponent(this.packageItem);
		};
		var i=0;
		var dataLen=0;
		var curPos=0;
		var nextPos=0;
		var f1=NaN;
		var f2=NaN;
		var i1=0;
		var i2=0;
		var buffer=this.packageItem.rawData;
		buffer.seek(0,0);
		this._underConstruct=true;
		this.sourceWidth=buffer.getInt32();
		this.sourceHeight=buffer.getInt32();
		this.initWidth=this.sourceWidth;
		this.initHeight=this.sourceHeight;
		this.setSize(this.sourceWidth,this.sourceHeight);
		if (buffer.readBool()){
			this.minWidth=buffer.getInt32();
			this.maxWidth=buffer.getInt32();
			this.minHeight=buffer.getInt32();
			this.maxHeight=buffer.getInt32();
		}
		if (buffer.readBool()){
			f1=buffer.getFloat32();
			f2=buffer.getFloat32();
			this.internalSetPivot(f1,f2,buffer.readBool());
		}
		if (buffer.readBool()){
			this._margin.top=buffer.getInt32();
			this._margin.bottom=buffer.getInt32();
			this._margin.left=buffer.getInt32();
			this._margin.right=buffer.getInt32();
		};
		var overflow=buffer.readByte();
		if (overflow==2){
			var savedPos=buffer.pos;
			buffer.seek(0,7);
			this.setupScroll(buffer);
			buffer.pos=savedPos;
		}
		else
		this.setupOverflow(overflow);
		if (buffer.readBool())
			buffer.skip(8);
		this._buildingDisplayList=true;
		buffer.seek(0,1);
		var controllerCount=buffer.getInt16();
		for (i=0;i < controllerCount;i++){
			nextPos=buffer.getInt16();
			nextPos+=buffer.pos;
			var controller=new Controller();
			this._controllers.push(controller);
			controller.parent=this;
			controller.setup(buffer);
			buffer.pos=nextPos;
		}
		buffer.seek(0,2);
		var child;
		var childCount=buffer.getInt16();
		for (i=0;i < childCount;i++){
			dataLen=buffer.getInt16();
			curPos=buffer.pos;
			if (objectPool !=null)
				child=objectPool[poolIndex+i];
			else{
				buffer.seek(curPos,0);
				var type=buffer.readByte();
				var src=buffer.readS();
				var pkgId=buffer.readS();
				var pi=null;
				if (src !=null){
					var pkg;
					if (pkgId !=null)
						pkg=UIPackage.getById(pkgId);
					else
					pkg=this.packageItem.owner;
					pi=pkg !=null ? pkg.getItemById(src):null;
				}
				if (pi !=null){
					child=UIObjectFactory.newObject(pi);
					child.packageItem=pi;
					child.constructFromResource();
				}
				else
				child=UIObjectFactory.newObject2(type);
			}
			child._underConstruct=true;
			child.setup_beforeAdd(buffer,curPos);
			child.parent=this;
			this._children.push(child);
			buffer.pos=curPos+dataLen;
		}
		buffer.seek(0,3);
		this.relations.setup(buffer,true);
		buffer.seek(0,2);
		buffer.skip(2);
		for (i=0;i < childCount;i++){
			nextPos=buffer.getInt16();
			nextPos+=buffer.pos;
			buffer.seek(buffer.pos,3);
			this._children[i].relations.setup(buffer,false);
			buffer.pos=nextPos;
		}
		buffer.seek(0,2);
		buffer.skip(2);
		for (i=0;i < childCount;i++){
			nextPos=buffer.getInt16();
			nextPos+=buffer.pos;
			child=this._children[i];
			child.setup_afterAdd(buffer,buffer.pos);
			child._underConstruct=false;
			buffer.pos=nextPos;
		}
		buffer.seek(0,4);
		buffer.skip(2);
		this.opaque=buffer.readBool();
		var maskId=buffer.getInt16();
		if (maskId !=-1){
			this.setMask(this.getChildAt(maskId).displayObject,buffer.readBool());
		};
		var hitTestId=buffer.readS();
		if (hitTestId !=null){
			pi=this.packageItem.owner.getItemById(hitTestId);
			if (pi !=null && pi.pixelHitTestData !=null){
				i1=buffer.getInt32();
				i2=buffer.getInt32();
				this._displayObject.hitArea=new PixelHitTest(pi.pixelHitTestData,i1,i2);
				this._displayObject.mouseThrough=false;
				this._displayObject.hitTestPrior=true;
			}
		}
		buffer.seek(0,5);
		var transitionCount=buffer.getInt16();
		for (i=0;i < transitionCount;i++){
			nextPos=buffer.getInt16();
			nextPos+=buffer.pos;
			var trans=new Transition(this);
			trans.setup(buffer);
			this._transitions.push(trans);
			buffer.pos=nextPos;
		}
		if (this._transitions.length > 0){
			this.displayObject.on("display",this,this.___added);
			this.displayObject.on("undisplay",this,this.___removed);
		}
		this.applyAllControllers();
		this._buildingDisplayList=false;
		this._underConstruct=false;
		this.buildNativeDisplayList();
		this.setBoundsChangedFlag();
		if (this.packageItem.objectType !=9)
			this.constructExtension(buffer);
		this.constructFromXML(null);
	}

	__proto.constructExtension=function(buffer){}
	__proto.constructFromXML=function(xml){}
	__proto.setup_afterAdd=function(buffer,beginPos){
		_super.prototype.setup_afterAdd.call(this,buffer,beginPos);
		buffer.seek(beginPos,4);
		var pageController=buffer.getInt16();
		if (pageController !=-1 && this._scrollPane !=null)
			this._scrollPane.pageController=this._parent.getControllerAt(pageController);
		var cnt=buffer.getInt16();
		for (var i=0;i < cnt;i++){
			var cc=this.getController(buffer.readS());
			var pageId=buffer.readS();
			if(cc)
				cc.selectedPageId=pageId;
		}
	}

	__proto.___added=function(){
		var cnt=this._transitions.length;
		for(var i=0;i < cnt;++i){
			this._transitions[i].onOwnerAddedToStage();
		}
	}

	__proto.___removed=function(){
		var cnt=this._transitions.length;
		for(var i=0;i < cnt;++i){
			this._transitions[i].onOwnerRemovedFromStage();
		}
	}

	__getset(0,__proto,'numChildren',function(){
		return this._children.length;
	});

	__getset(0,__proto,'displayListContainer',function(){
		return this._container;
	});

	/**
	*@see ChildrenRenderOrder
	*/
	/**
	*@see ChildrenRenderOrder
	*/
	__getset(0,__proto,'childrenRenderOrder',function(){
		return this._childrenRenderOrder;
		},function(value){
		if (this._childrenRenderOrder !=value){
			this._childrenRenderOrder=value;
			this.buildNativeDisplayList();
		}
	});

	__getset(0,__proto,'opaque',function(){
		return this._opaque;
		},function(value){
		if(this._opaque!=value){
			this._opaque=value;
			if (this._opaque){
				if(this._displayObject.hitArea==null)
					this._displayObject.hitArea=new Rectangle();
				if((this._displayObject.hitArea instanceof laya.maths.Rectangle ))
					this._displayObject.hitArea.setTo(0,0,this.width,this.height);
				this._displayObject.mouseThrough=false;
			}
			else {
				if((this._displayObject.hitArea instanceof laya.maths.Rectangle ))
					this._displayObject.hitArea=null;
				this._displayObject.mouseThrough=true;
			}
		}
	});

	__getset(0,__proto,'controllers',function(){
		return this._controllers;
	});

	__getset(0,__proto,'scrollPane',function(){
		return this._scrollPane;
	});

	__getset(0,__proto,'margin',function(){
		return this._margin;
		},function(value){
		this._margin.copy(value);
		if(this._displayObject.scrollRect!=null){
			this._container.pos(this._margin.left+this._alignOffset.x,this._margin.top+this._alignOffset.y);
		}
		this.handleSizeChanged();
	});

	__getset(0,__proto,'apexIndex',function(){
		return this._apexIndex;
		},function(value){
		if (this._apexIndex !=value){
			this._apexIndex=value;
			if (this._childrenRenderOrder==2)
				this.buildNativeDisplayList();
		}
	});

	__getset(0,__proto,'mask',function(){
		return this._mask;
		},function(value){
		this.setMask(value,false);
	});

	__getset(0,__proto,'viewHeight',function(){
		if (this._scrollPane !=null)
			return this._scrollPane.viewHeight;
		else
		return this.height-this._margin.top-this._margin.bottom;
		},function(value){
		if (this._scrollPane !=null)
			this._scrollPane.viewHeight=value;
		else
		this.height=value+this._margin.top+this._margin.bottom;
	});

	__getset(0,__proto,'baseUserData',function(){
		var buffer=this.packageItem.rawData;
		buffer.seek(0,4);
		return buffer.readS();
	});

	__getset(0,__proto,'viewWidth',function(){
		if (this._scrollPane !=null)
			return this._scrollPane.viewWidth;
		else
		return this.width-this._margin.left-this._margin.right;
		},function(value){
		if (this._scrollPane !=null)
			this._scrollPane.viewWidth=value;
		else
		this.width=value+this._margin.left+this._margin.right;
	});

	return GComponent;
})(GObject)



//class fairygui.ScrollPane
var ScrollPane=(function(){
	function ScrollPane(owner){
		this._owner=null;
		this._container=null;
		this._maskContainer=null;
		this._alignContainer=null;
		this._scrollType=0;
		this._scrollStep=0;
		this._mouseWheelStep=0;
		this._decelerationRate=NaN;
		this._scrollBarMargin=null;
		this._bouncebackEffect=false;
		this._touchEffect=false;
		this._scrollBarDisplayAuto=false;
		this._vScrollNone=false;
		this._hScrollNone=false;
		this._needRefresh=false;
		this._refreshBarAxis=null;
		this._displayOnLeft=false;
		this._snapToItem=false;
		this._displayInDemand=false;
		this._mouseWheelEnabled=false;
		this._pageMode=false;
		this._inertiaDisabled=false;
		this._xPos=NaN;
		this._yPos=NaN;
		this._viewSize=null;
		this._contentSize=null;
		this._overlapSize=null;
		this._pageSize=null;
		this._containerPos=null;
		this._beginTouchPos=null;
		this._lastTouchPos=null;
		this._lastTouchGlobalPos=null;
		this._velocity=null;
		this._velocityScale=NaN;
		this._lastMoveTime=NaN;
		this._isHoldAreaDone=false;
		this._aniFlag=0;
		this._scrollBarVisible=false;
		this._loop=0;
		this._headerLockedSize=0;
		this._footerLockedSize=0;
		this._refreshEventDispatching=false;
		this._tweening=0;
		this._tweenTime=null;
		this._tweenDuration=null;
		this._tweenStart=null;
		this._tweenChange=null;
		this._pageController=null;
		this._hzScrollBar=null;
		this._vtScrollBar=null;
		this._header=null;
		this._footer=null;
		this.isDragged=false;
		;
		this._owner=owner;
		this._maskContainer=new Sprite();
		this._owner.displayObject.addChild(this._maskContainer);
		this._container=this._owner._container;
		this._container.pos(0,0);
		this._maskContainer.addChild(this._container);
		this._scrollBarVisible=true;
		this._mouseWheelEnabled=true;
		this._xPos=0;
		this._yPos=0;
		this._aniFlag=0;
		this._footerLockedSize=0;
		this._headerLockedSize=0;
		this._scrollBarMargin=new Margin();
		this._viewSize=new Point();
		this._contentSize=new Point();
		this._pageSize=new Point(1,1);
		this._overlapSize=new Point();
		this._tweenTime=new Point();
		this._tweenStart=new Point();
		this._tweenDuration=new Point();
		this._tweenChange=new Point();
		this._velocity=new Point();
		this._containerPos=new Point();
		this._beginTouchPos=new Point();
		this._lastTouchPos=new Point();
		this._lastTouchGlobalPos=new Point();
		this._scrollStep=UIConfig$1.defaultScrollStep;
		this._mouseWheelStep=this._scrollStep*2;
		this._decelerationRate=UIConfig$1.defaultScrollDecelerationRate;
		this._owner.on("mousedown",this,this.__mouseDown);
		this._owner.on("mousewheel",this,this.__mouseWheel);
	}

	__class(ScrollPane,'fairygui.ScrollPane');
	var __proto=ScrollPane.prototype;
	__proto.setup=function(buffer){
		this._scrollType=buffer.readByte();
		var scrollBarDisplay=buffer.readByte();
		var flags=buffer.getInt32();
		if (buffer.readBool()){
			this._scrollBarMargin.top=buffer.getInt32();
			this._scrollBarMargin.bottom=buffer.getInt32();
			this._scrollBarMargin.left=buffer.getInt32();
			this._scrollBarMargin.right=buffer.getInt32();
		};
		var vtScrollBarRes=buffer.readS();
		var hzScrollBarRes=buffer.readS();
		var headerRes=buffer.readS();
		var footerRes=buffer.readS();
		this._displayOnLeft=(flags & 1)!=0;
		this._snapToItem=(flags & 2)!=0;
		this._displayInDemand=(flags & 4)!=0;
		this._pageMode=(flags & 8)!=0;
		if(flags & 16)
			this._touchEffect=true;
		else if(flags & 32)
		this._touchEffect=false;
		else
		this._touchEffect=UIConfig$1.defaultScrollTouchEffect;
		if(flags & 64)
			this._bouncebackEffect=true;
		else if(flags & 128)
		this._bouncebackEffect=false;
		else
		this._bouncebackEffect=UIConfig$1.defaultScrollBounceEffect;
		this._inertiaDisabled=(flags & 256)!=0;
		if((flags & 512)==0)
			this._maskContainer.scrollRect=new Rectangle();
		if(scrollBarDisplay==0)
			scrollBarDisplay=UIConfig$1.defaultScrollBarDisplay;
		if(scrollBarDisplay !=3){
			if(this._scrollType==2 || this._scrollType==1){
				var res=vtScrollBarRes ? vtScrollBarRes :UIConfig$1.verticalScrollBar;
				if(res){
					this._vtScrollBar=(UIPackage.createObjectFromURL(res));
					if(!this._vtScrollBar)
						throw "cannot create scrollbar from "+res;
					this._vtScrollBar.setScrollPane(this,true);
					this._owner.displayObject.addChild(this._vtScrollBar.displayObject);
				}
			}
			if(this._scrollType==2 || this._scrollType==0){
				res=hzScrollBarRes ? hzScrollBarRes :UIConfig$1.horizontalScrollBar;
				if(res){
					this._hzScrollBar=(UIPackage.createObjectFromURL(res));
					if(!this._hzScrollBar)
						throw "cannot create scrollbar from "+res;
					this._hzScrollBar.setScrollPane(this,false);
					this._owner.displayObject.addChild(this._hzScrollBar.displayObject);
				}
			}
			this._scrollBarDisplayAuto=scrollBarDisplay==2;
			if(this._scrollBarDisplayAuto){
				this._scrollBarVisible=false;
				if(this._vtScrollBar)
					this._vtScrollBar.displayObject.visible=false;
				if(this._hzScrollBar)
					this._hzScrollBar.displayObject.visible=false;
			}
		}
		else
		this._mouseWheelEnabled=false;
		if (headerRes){
			this._header=UIPackage.createObjectFromURL(headerRes);
			if (this._header==null)
				throw new Error("FairyGUI: cannot create scrollPane header from "+headerRes);
		}
		if (footerRes){
			this._footer=UIPackage.createObjectFromURL(footerRes);
			if (this._footer==null)
				throw new Error("FairyGUI: cannot create scrollPane footer from "+footerRes);
		}
		if (this._header !=null || this._footer !=null)
			this._refreshBarAxis=(this._scrollType==2 || this._scrollType==1)? "y" :"x";
		this.setSize(this.owner.width,this.owner.height);
	}

	__proto.dispose=function(){
		if (this._tweening !=0)
			Laya.timer.clear(this,this.tweenUpdate);
		this._pageController=null;
		if (this._hzScrollBar !=null)
			this._hzScrollBar.dispose();
		if (this._vtScrollBar !=null)
			this._vtScrollBar.dispose();
		if (this._header !=null)
			this._header.dispose();
		if (this._footer !=null)
			this._footer.dispose();
	}

	__proto.setPercX=function(value,ani){
		(ani===void 0)&& (ani=false);
		this._owner.ensureBoundsCorrect();
		this.setPosX(this._overlapSize.x *ToolSet.clamp01(value),ani);
	}

	__proto.setPercY=function(value,ani){
		(ani===void 0)&& (ani=false);
		this._owner.ensureBoundsCorrect();
		this.setPosY(this._overlapSize.y *ToolSet.clamp01(value),ani);
	}

	__proto.setPosX=function(value,ani){
		(ani===void 0)&& (ani=false);
		this._owner.ensureBoundsCorrect();
		if (this._loop==1)
			value=this.loopCheckingNewPos(value,"x");
		value=ToolSet.clamp(value,0,this._overlapSize.x);
		if (value !=this._xPos){
			this._xPos=value;
			this.posChanged(ani);
		}
	}

	__proto.setPosY=function(value,ani){
		(ani===void 0)&& (ani=false);
		this._owner.ensureBoundsCorrect();
		if (this._loop==1)
			value=this.loopCheckingNewPos(value,"y");
		value=ToolSet.clamp(value,0,this._overlapSize.y);
		if (value !=this._yPos){
			this._yPos=value;
			this.posChanged(ani);
		}
	}

	__proto.setCurrentPageX=function(value,ani){
		if (this._pageMode && this._overlapSize.x>0)
			this.setPosX(value *this._pageSize.x,ani);
	}

	__proto.setCurrentPageY=function(value,ani){
		if (this._pageMode && this._overlapSize.y>0)
			this.setPosY(value *this._pageSize.y,ani);
	}

	__proto.scrollTop=function(ani){
		(ani===void 0)&& (ani=false);
		this.setPercY(0,ani);
	}

	__proto.scrollBottom=function(ani){
		(ani===void 0)&& (ani=false);
		this.setPercY(1,ani);
	}

	__proto.scrollUp=function(ratio,ani){
		(ratio===void 0)&& (ratio=1);
		(ani===void 0)&& (ani=false);
		if (this._pageMode)
			this.setPosY(this._yPos-this._pageSize.y *ratio,ani);
		else
		this.setPosY(this._yPos-this._scrollStep *ratio,ani);;
	}

	__proto.scrollDown=function(ratio,ani){
		(ratio===void 0)&& (ratio=1);
		(ani===void 0)&& (ani=false);
		if (this._pageMode)
			this.setPosY(this._yPos+this._pageSize.y *ratio,ani);
		else
		this.setPosY(this._yPos+this._scrollStep *ratio,ani);
	}

	__proto.scrollLeft=function(ratio,ani){
		(ratio===void 0)&& (ratio=1);
		(ani===void 0)&& (ani=false);
		if (this._pageMode)
			this.setPosX(this._xPos-this._pageSize.x *ratio,ani);
		else
		this.setPosX(this._xPos-this._scrollStep *ratio,ani);
	}

	__proto.scrollRight=function(ratio,ani){
		(ratio===void 0)&& (ratio=1);
		(ani===void 0)&& (ani=false);
		if (this._pageMode)
			this.setPosX(this._xPos+this._pageSize.x *ratio,ani);
		else
		this.setPosX(this._xPos+this._scrollStep *ratio,ani);
	}

	__proto.scrollToView=function(target,ani,setFirst){
		(ani===void 0)&& (ani=false);
		(setFirst===void 0)&& (setFirst=false);
		this._owner.ensureBoundsCorrect();
		if(this._needRefresh)
			this.refresh();
		var rect;
		if((target instanceof fairygui.GObject )){
			if(target.parent !=this._owner){
				target.parent.localToGlobalRect(target.x,target.y,
				target.width,target.height,fairygui.ScrollPane.sHelperRect);
				rect=this._owner.globalToLocalRect(fairygui.ScrollPane.sHelperRect.x,fairygui.ScrollPane.sHelperRect.y,
				fairygui.ScrollPane.sHelperRect.width,fairygui.ScrollPane.sHelperRect.height,fairygui.ScrollPane.sHelperRect);
			}
			else {
				rect=fairygui.ScrollPane.sHelperRect;
				rect.setTo(target.x,target.y,target.width,target.height);
			}
		}
		else
		rect=(target);
		if(this._overlapSize.y>0){
			var bottom=this._yPos+this._viewSize.y;
			if(setFirst || rect.y<=this._yPos || rect.height>=this._viewSize.y){
				if(this._pageMode)
					this.setPosY(Math.floor(rect.y/this._pageSize.y)*this._pageSize.y,ani);
				else
				this.setPosY(rect.y,ani);
			}
			else if(rect.y+rect.height>bottom){
				if(this._pageMode)
					this.setPosY(Math.floor(rect.y/this._pageSize.y)*this._pageSize.y,ani);
				else if (rect.height <=this._viewSize.y/2)
				this.setPosY(rect.y+rect.height*2-this._viewSize.y,ani);
				else
				this.setPosY(rect.y+rect.height-this._viewSize.y,ani);
			}
		}
		if(this._overlapSize.x>0){
			var right=this._xPos+this._viewSize.x;
			if(setFirst || rect.x<=this._xPos || rect.width>=this._viewSize.x){
				if(this._pageMode)
					this.setPosX(Math.floor(rect.x/this._pageSize.x)*this._pageSize.x,ani);
				else
				this.setPosX(rect.x,ani);
			}
			else if(rect.x+rect.width>right){
				if(this._pageMode)
					this.setPosX(Math.floor(rect.x/this._pageSize.x)*this._pageSize.x,ani);
				else if (rect.width <=this._viewSize.x/2)
				this.setPosX(rect.x+rect.width*2-this._viewSize.x,ani);
				else
				this.setPosX(rect.x+rect.width-this._viewSize.x,ani);
			}
		}
		if(!ani && this._needRefresh)
			this.refresh();
	}

	__proto.isChildInView=function(obj){
		if(this._overlapSize.y>0){
			var dist=obj.y+this._container.y;
			if(dist<-obj.height || dist>this._viewSize.y)
				return false;
		}
		if(this._overlapSize.x>0){
			dist=obj.x+this._container.x;
			if(dist<-obj.width || dist>this._viewSize.x)
				return false;
		}
		return true;
	}

	__proto.cancelDragging=function(){
		this._owner.displayObject.stage.off("mousemove",this,this.__mouseMove);
		this._owner.displayObject.stage.off("mouseup",this,this.__mouseUp);
		this._owner.displayObject.stage.off("click",this,this.__click);
		if (ScrollPane.draggingPane==this)
			ScrollPane.draggingPane=null;
		ScrollPane._gestureFlag=0;
		this.isDragged=false;
		this._maskContainer.mouseEnabled=true;
	}

	__proto.lockHeader=function(size){
		if (this._headerLockedSize==size)
			return;
		this._headerLockedSize=size;
		if (!this._refreshEventDispatching && this._container[this._refreshBarAxis] >=0){
			this._tweenStart.setTo(this._container.x,this._container.y);
			this._tweenChange.setTo(0,0);
			this._tweenChange[this._refreshBarAxis]=this._headerLockedSize-this._tweenStart[this._refreshBarAxis];
			this._tweenDuration.setTo(0.3,0.3);
			this._tweenTime.setTo(0,0);
			this._tweening=2;
			Laya.timer.frameLoop(1,this,this.tweenUpdate);
		}
	}

	__proto.lockFooter=function(size){
		if (this._footerLockedSize==size)
			return;
		this._footerLockedSize=size;
		if (!this._refreshEventDispatching && this._container[this._refreshBarAxis] <=-this._overlapSize[this._refreshBarAxis]){
			this._tweenStart.setTo(this._container.x,this._container.y);
			this._tweenChange.setTo(0,0);
			var max=this._overlapSize[this._refreshBarAxis];
			if (max==0)
				max=Math.max(this._contentSize[this._refreshBarAxis]+this._footerLockedSize-this._viewSize[this._refreshBarAxis],0);
			else
			max+=this._footerLockedSize;
			this._tweenChange[this._refreshBarAxis]=-max-this._tweenStart[this._refreshBarAxis];
			this._tweenDuration.setTo(0.3,0.3);
			this._tweenTime.setTo(0,0);
			this._tweening=2;
			Laya.timer.frameLoop(1,this,this.tweenUpdate);
		}
	}

	__proto.onOwnerSizeChanged=function(){
		this.setSize(this._owner.width,this._owner.height);
		this.posChanged(false);
	}

	__proto.handleControllerChanged=function(c){
		if (this._pageController==c){
			if (this._scrollType==0)
				this.setCurrentPageX(c.selectedIndex,true);
			else
			this.setCurrentPageY(c.selectedIndex,true);
		}
	}

	__proto.updatePageController=function(){
		if (this._pageController !=null && !this._pageController.changing){
			var index=0;
			if (this._scrollType==0)
				index=this.currentPageX;
			else
			index=this.currentPageY;
			if (index < this._pageController.pageCount){
				var c=this._pageController;
				this._pageController=null;
				c.selectedIndex=index;
				this._pageController=c;
			}
		}
	}

	__proto.adjustMaskContainer=function(){
		var mx=NaN,my=NaN;
		if (this._displayOnLeft && this._vtScrollBar !=null)
			mx=Math.floor(this._owner.margin.left+this._vtScrollBar.width);
		else
		mx=Math.floor(this._owner.margin.left);
		my=Math.floor(this._owner.margin.top);
		this._maskContainer.pos(mx,my);
		if(this._owner._alignOffset.x!=0 || this._owner._alignOffset.y!=0){
			if(this._alignContainer==null){
				this._alignContainer=new Sprite();
				this._maskContainer.addChild(this._alignContainer);
				this._alignContainer.addChild(this._container);
			}
			this._alignContainer.pos(this._owner._alignOffset.x,this._owner._alignOffset.y);
		}
		else if(this._alignContainer){
			this._alignContainer.pos(0,0);
		}
	}

	__proto.setSize=function(aWidth,aHeight){
		this.adjustMaskContainer();
		if (this._hzScrollBar){
			this._hzScrollBar.y=aHeight-this._hzScrollBar.height;
			if(this._vtScrollBar && !this._vScrollNone){
				this._hzScrollBar.width=aWidth-this._vtScrollBar.width-this._scrollBarMargin.left-this._scrollBarMargin.right;
				if(this._displayOnLeft)
					this._hzScrollBar.x=this._scrollBarMargin.left+this._vtScrollBar.width;
				else
				this._hzScrollBar.x=this._scrollBarMargin.left;
			}
			else {
				this._hzScrollBar.width=aWidth-this._scrollBarMargin.left-this._scrollBarMargin.right;
				this._hzScrollBar.x=this._scrollBarMargin.left;
			}
		}
		if (this._vtScrollBar){
			if (!this._displayOnLeft)
				this._vtScrollBar.x=aWidth-this._vtScrollBar.width;
			if(this._hzScrollBar)
				this._vtScrollBar.height=aHeight-this._hzScrollBar.height-this._scrollBarMargin.top-this._scrollBarMargin.bottom;
			else
			this._vtScrollBar.height=aHeight-this._scrollBarMargin.top-this._scrollBarMargin.bottom;
			this._vtScrollBar.y=this._scrollBarMargin.top;
		}
		this._viewSize.x=aWidth;
		this._viewSize.y=aHeight;
		if(this._hzScrollBar && !this._hScrollNone)
			this._viewSize.y-=this._hzScrollBar.height;
		if(this._vtScrollBar && !this._vScrollNone)
			this._viewSize.x-=this._vtScrollBar.width;
		this._viewSize.x-=(this._owner.margin.left+this._owner.margin.right);
		this._viewSize.y-=(this._owner.margin.top+this._owner.margin.bottom);
		this._viewSize.x=Math.max(1,this._viewSize.x);
		this._viewSize.y=Math.max(1,this._viewSize.y);
		this._pageSize.x=this._viewSize.x;
		this._pageSize.y=this._viewSize.y;
		this.handleSizeChanged();
	}

	__proto.setContentSize=function(aWidth,aHeight){
		if(this._contentSize.x==aWidth && this._contentSize.y==aHeight)
			return;
		this._contentSize.x=aWidth;
		this._contentSize.y=aHeight;
		this.handleSizeChanged();
	}

	__proto.changeContentSizeOnScrolling=function(deltaWidth,deltaHeight,deltaPosX,deltaPosY){
		var isRightmost=this._xPos==this._overlapSize.x;
		var isBottom=this._yPos==this._overlapSize.y;
		this._contentSize.x+=deltaWidth;
		this._contentSize.y+=deltaHeight;
		this.handleSizeChanged();
		if (this._tweening==1){
			if (deltaWidth !=0 && isRightmost && this._tweenChange.x < 0){
				this._xPos=this._overlapSize.x;
				this._tweenChange.x=-this._xPos-this._tweenStart.x;
			}
			if (deltaHeight !=0 && isBottom && this._tweenChange.y < 0){
				this._yPos=this._overlapSize.y;
				this._tweenChange.y=-this._yPos-this._tweenStart.y;
			}
		}
		else if (this._tweening==2){
			if (deltaPosX !=0){
				this._container.x-=deltaPosX;
				this._tweenStart.x-=deltaPosX;
				this._xPos=-this._container.x;
			}
			if (deltaPosY !=0){
				this._container.y-=deltaPosY;
				this._tweenStart.y-=deltaPosY;
				this._yPos=-this._container.y;
			}
		}
		else if (this.isDragged){
			if (deltaPosX !=0){
				this._container.x-=deltaPosX;
				this._containerPos.x-=deltaPosX;
				this._xPos=-this._container.x;
			}
			if (deltaPosY !=0){
				this._container.y-=deltaPosY;
				this._containerPos.y-=deltaPosY;
				this._yPos=-this._container.y;
			}
		}
		else{
			if (deltaWidth !=0 && isRightmost){
				this._xPos=this._overlapSize.x;
				this._container.x=-this._xPos;
			}
			if (deltaHeight !=0 && isBottom){
				this._yPos=this._overlapSize.y;
				this._container.y=-this._yPos;
			}
		}
		if (this._pageMode)
			this.updatePageController();
	}

	__proto.handleSizeChanged=function(onScrolling){
		(onScrolling===void 0)&& (onScrolling=false);
		if(this._displayInDemand){
			if(this._vtScrollBar){
				if(this._contentSize.y<=this._viewSize.y){
					if(!this._vScrollNone){
						this._vScrollNone=true;
						this._viewSize.x+=this._vtScrollBar.width;
					}
				}
				else{
					if(this._vScrollNone){
						this._vScrollNone=false;
						this._viewSize.x-=this._vtScrollBar.width;
					}
				}
			}
			if(this._hzScrollBar){
				if(this._contentSize.x<=this._viewSize.x){
					if(!this._hScrollNone){
						this._hScrollNone=true;
						this._viewSize.y+=this._hzScrollBar.height;
					}
				}
				else{
					if(this._hScrollNone){
						this._hScrollNone=false;
						this._viewSize.y-=this._hzScrollBar.height;
					}
				}
			}
		}
		if(this._vtScrollBar){
			if(this._viewSize.y<this._vtScrollBar.minSize)
				this._vtScrollBar.displayObject.visible=false;
			else{
				this._vtScrollBar.displayObject.visible=this._scrollBarVisible && !this._vScrollNone;
				if(this._contentSize.y==0)
					this._vtScrollBar.displayPerc=0;
				else
				this._vtScrollBar.displayPerc=Math.min(1,this._viewSize.y/this._contentSize.y);
			}
		}
		if(this._hzScrollBar){
			if(this._viewSize.x<this._hzScrollBar.minSize)
				this._hzScrollBar.displayObject.visible=false;
			else{
				this._hzScrollBar.displayObject.visible=this._scrollBarVisible && !this._hScrollNone;
				if(this._contentSize.x==0)
					this._hzScrollBar.displayPerc=0;
				else
				this._hzScrollBar.displayPerc=Math.min(1,this._viewSize.x/this._contentSize.x);
			}
		};
		var rect=this._maskContainer.scrollRect;
		if (rect){
			rect.width=this._viewSize.x;
			rect.height=this._viewSize.y;
			this._maskContainer.scrollRect=rect;
		}
		if (this._scrollType==0 || this._scrollType==2)
			this._overlapSize.x=Math.ceil(Math.max(0,this._contentSize.x-this._viewSize.x));
		else
		this._overlapSize.x=0;
		if (this._scrollType==1 || this._scrollType==2)
			this._overlapSize.y=Math.ceil(Math.max(0,this._contentSize.y-this._viewSize.y));
		else
		this._overlapSize.y=0;
		this._xPos=ToolSet.clamp(this._xPos,0,this._overlapSize.x);
		this._yPos=ToolSet.clamp(this._yPos,0,this._overlapSize.y);
		if(this._refreshBarAxis!=null){
			var max=this._overlapSize[this._refreshBarAxis];
			if (max==0)
				max=Math.max(this._contentSize[this._refreshBarAxis]+this._footerLockedSize-this._viewSize[this._refreshBarAxis],0);
			else
			max+=this._footerLockedSize;
			if (this._refreshBarAxis=="x"){
				this._container.pos(ToolSet.clamp(this._container.x,-max,this._headerLockedSize),
				ToolSet.clamp(this._container.y,-this._overlapSize.y,0));
			}
			else{
				this._container.pos(ToolSet.clamp(this._container.x,-this._overlapSize.x,0),
				ToolSet.clamp(this._container.y,-max,this._headerLockedSize));
			}
			if (this._header !=null){
				if (this._refreshBarAxis=="x")
					this._header.height=this._viewSize.y;
				else
				this._header.width=this._viewSize.x;
			}
			if (this._footer !=null){
				if (this._refreshBarAxis=="y")
					this._footer.height=this._viewSize.y;
				else
				this._footer.width=this._viewSize.x;
			}
		}
		else{
			this._container.pos(ToolSet.clamp(this._container.x,-this._overlapSize.x,0),
			ToolSet.clamp(this._container.y,-this._overlapSize.y,0));
		}
		this.syncScrollBar(true);
		this.checkRefreshBar();
		if (this._pageMode)
			this.updatePageController();
	}

	__proto.posChanged=function(ani){
		if (this._aniFlag==0)
			this._aniFlag=ani ? 1 :-1;
		else if (this._aniFlag==1 && !ani)
		this._aniFlag=-1;
		this._needRefresh=true;
		Laya.timer.callLater(this,this.refresh);
	}

	__proto.refresh=function(){
		this._needRefresh=false;
		Laya.timer.clear(this,this.refresh);
		if (this._pageMode || this._snapToItem){
			ScrollPane.sEndPos.setTo(-this._xPos,-this._yPos);
			this.alignPosition(ScrollPane.sEndPos,false);
			this._xPos=-ScrollPane.sEndPos.x;
			this._yPos=-ScrollPane.sEndPos.y;
		}
		this.refresh2();
		Events.dispatch("fui_scroll",this._owner.displayObject);
		if (this._needRefresh){
			this._needRefresh=false;
			Laya.timer.clear(this,this.refresh);
			this.refresh2();
		}
		this.syncScrollBar();
		this._aniFlag=0;
	}

	__proto.refresh2=function(){
		if (this._aniFlag==1 && !this.isDragged){
			var posX=NaN;
			var posY=NaN;
			if (this._overlapSize.x > 0)
				posX=-Math.floor(this._xPos);
			else{
				if (this._container.x !=0)
					this._container.x=0;
				posX=0;
			}
			if (this._overlapSize.y > 0)
				posY=-Math.floor(this._yPos);
			else{
				if (this._container.y !=0)
					this._container.y=0;
				posY=0;
			}
			if (posX !=this._container.x || posY !=this._container.y){
				this._tweening=1;
				this._tweenTime.setTo(0,0);
				this._tweenDuration.setTo(0.5,0.5);
				this._tweenStart.setTo(this._container.x,this._container.y);
				this._tweenChange.setTo(posX-this._tweenStart.x,posY-this._tweenStart.y);
				Laya.timer.frameLoop(1,this,this.tweenUpdate);
			}
			else if (this._tweening !=0)
			this.killTween();
		}
		else{
			if (this._tweening !=0)
				this.killTween();
			this._container.pos(Math.floor(-this._xPos),Math.floor(-this._yPos));
			this.loopCheckingCurrent();
		}
		if (this._pageMode)
			this.updatePageController();
	}

	__proto.syncScrollBar=function(end){
		(end===void 0)&& (end=false);
		if (this._vtScrollBar !=null){
			this._vtScrollBar.scrollPerc=this._overlapSize.y==0 ? 0 :ToolSet.clamp(-this._container.y,0,this._overlapSize.y)/ this._overlapSize.y;
			if (this._scrollBarDisplayAuto)
				this.showScrollBar(!end);
		}
		if (this._hzScrollBar !=null){
			this._hzScrollBar.scrollPerc=this._overlapSize.x==0 ? 0 :ToolSet.clamp(-this._container.x,0,this._overlapSize.x)/ this._overlapSize.x;
			if (this._scrollBarDisplayAuto)
				this.showScrollBar(!end);
		}
		if(end)
			this._maskContainer.mouseEnabled=true;
	}

	__proto.__mouseDown=function(){
		if(!this._touchEffect)
			return;
		if(this._tweening!=0){
			this.killTween();
			this.isDragged=true;
		}
		else
		this.isDragged=false;
		var pt=this._owner.globalToLocal(Laya.stage.mouseX,Laya.stage.mouseY,fairygui.ScrollPane.sHelperPoint);
		this._containerPos.setTo(this._container.x,this._container.y);
		this._beginTouchPos.setTo(pt.x,pt.y);
		this._lastTouchPos.setTo(pt.x,pt.y);
		this._lastTouchGlobalPos.setTo(Laya.stage.mouseX,Laya.stage.mouseY);
		this._isHoldAreaDone=false;
		this._velocity.setTo(0,0);
		this._velocityScale=1;
		this._lastMoveTime=Laya.timer.currTimer/1000;
		this._owner.displayObject.stage.on("mousemove",this,this.__mouseMove);
		this._owner.displayObject.stage.on("mouseup",this,this.__mouseUp);
		this._owner.displayObject.stage.on("click",this,this.__click);
	}

	__proto.__mouseMove=function(){
		if(!this._touchEffect)
			return;
		if (ScrollPane.draggingPane !=null && ScrollPane.draggingPane !=this || GObject.draggingObject !=null)
			return;
		var sensitivity=UIConfig$1.touchScrollSensitivity;
		var pt=this._owner.globalToLocal(Laya.stage.mouseX,Laya.stage.mouseY,fairygui.ScrollPane.sHelperPoint);
		var diff=NaN,diff2=NaN;
		var sv=false,sh=false,st=false;
		if (this._scrollType==1){
			if (!this._isHoldAreaDone){
				ScrollPane._gestureFlag |=1;
				diff=Math.abs(this._beginTouchPos.y-pt.y);
				if (diff < sensitivity)
					return;
				if ((ScrollPane._gestureFlag & 2)!=0){
					diff2=Math.abs(this._beginTouchPos.x-pt.x);
					if (diff < diff2)
						return;
				}
			}
			sv=true;
		}
		else if (this._scrollType==0){
			if (!this._isHoldAreaDone){
				ScrollPane._gestureFlag |=2;
				diff=Math.abs(this._beginTouchPos.x-pt.x);
				if (diff < sensitivity)
					return;
				if ((ScrollPane._gestureFlag & 1)!=0){
					diff2=Math.abs(this._beginTouchPos.y-pt.y);
					if (diff < diff2)
						return;
				}
			}
			sh=true;
		}
		else{
			ScrollPane._gestureFlag=3;
			if (!this._isHoldAreaDone){
				diff=Math.abs(this._beginTouchPos.y-pt.y);
				if (diff < sensitivity){
					diff=Math.abs(this._beginTouchPos.x-pt.x);
					if (diff < sensitivity)
						return;
				}
			}
			sv=sh=true;
		};
		var newPosX=Math.floor(this._containerPos.x+pt.x-this._beginTouchPos.x);
		var newPosY=Math.floor(this._containerPos.y+pt.y-this._beginTouchPos.y);
		if (sv){
			if (newPosY > 0){
				if (!this._bouncebackEffect)
					this._container.y=0;
				else if (this._header !=null && this._header.maxHeight !=0)
				this._container.y=Math.floor(Math.min(newPosY *0.5,this._header.maxHeight));
				else
				this._container.y=Math.floor(Math.min(newPosY *0.5,this._viewSize.y *0.5));
			}
			else if (newPosY <-this._overlapSize.y){
				if (!this._bouncebackEffect)
					this._container.y=-this._overlapSize.y;
				else if (this._footer !=null && this._footer.maxHeight > 0)
				this._container.y=Math.floor(Math.max((newPosY+this._overlapSize.y)*0.5,-this._footer.maxHeight)-this._overlapSize.y);
				else
				this._container.y=Math.floor(Math.max((newPosY+this._overlapSize.y)*0.5,-this._viewSize.y *0.5)-this._overlapSize.y);
			}
			else
			this._container.y=newPosY;
		}
		if (sh){
			if (newPosX > 0){
				if (!this._bouncebackEffect)
					this._container.x=0;
				else if (this._header !=null && this._header.maxWidth !=0)
				this._container.x=Math.floor(Math.min(newPosX *0.5,this._header.maxWidth));
				else
				this._container.x=Math.floor(Math.min(newPosX *0.5,this._viewSize.x *0.5));
			}
			else if (newPosX < 0-this._overlapSize.x){
				if (!this._bouncebackEffect)
					this._container.x=-this._overlapSize.x;
				else if (this._footer !=null && this._footer.maxWidth > 0)
				this._container.x=Math.floor(Math.max((newPosX+this._overlapSize.x)*0.5,-this._footer.maxWidth)-this._overlapSize.x);
				else
				this._container.x=Math.floor(Math.max((newPosX+this._overlapSize.x)*0.5,-this._viewSize.x *0.5)-this._overlapSize.x);
			}
			else
			this._container.x=newPosX;
		};
		var frameRate=Laya.stage.frameRate=="slow"?30:60;
		var now=Laya.timer.currTimer/1000;
		var deltaTime=Math.max(now-this._lastMoveTime,1/frameRate);
		var deltaPositionX=pt.x-this._lastTouchPos.x;
		var deltaPositionY=pt.y-this._lastTouchPos.y;
		if (!sh)
			deltaPositionX=0;
		if (!sv)
			deltaPositionY=0;
		if(deltaTime!=0){
			var elapsed=deltaTime *frameRate-1;
			if (elapsed > 1){
				var factor=Math.pow(0.833,elapsed);
				this._velocity.x=this._velocity.x *factor;
				this._velocity.y=this._velocity.y *factor;
			}
			this._velocity.x=ToolSet.lerp(this._velocity.x,deltaPositionX *60 / frameRate / deltaTime,deltaTime *10);
			this._velocity.y=ToolSet.lerp(this._velocity.y,deltaPositionY *60 / frameRate / deltaTime,deltaTime *10);
		};
		var deltaGlobalPositionX=this._lastTouchGlobalPos.x-Laya.stage.mouseX;
		var deltaGlobalPositionY=this._lastTouchGlobalPos.y-Laya.stage.mouseY;
		if (deltaPositionX !=0)
			this._velocityScale=Math.abs(deltaGlobalPositionX / deltaPositionX);
		else if (deltaPositionY !=0)
		this._velocityScale=Math.abs(deltaGlobalPositionY / deltaPositionY);
		this._lastTouchPos.setTo(pt.x,pt.y);
		this._lastTouchGlobalPos.setTo(Laya.stage.mouseX,Laya.stage.mouseY);
		this._lastMoveTime=now;
		if (this._overlapSize.x > 0)
			this._xPos=ToolSet.clamp(-this._container.x,0,this._overlapSize.x);
		if (this._overlapSize.y > 0)
			this._yPos=ToolSet.clamp(-this._container.y,0,this._overlapSize.y);
		if (this._loop !=0){
			newPosX=this._container.x;
			newPosY=this._container.y;
			if (this.loopCheckingCurrent()){
				this._containerPos.x+=this._container.x-newPosX;
				this._containerPos.y+=this._container.y-newPosY;
			}
		}
		ScrollPane.draggingPane=this;
		this._isHoldAreaDone=true;
		this.isDragged=true;
		this._maskContainer.mouseEnabled=false;
		this.syncScrollBar();
		this.checkRefreshBar();
		if (this._pageMode)
			this.updatePageController();
		Events.dispatch("fui_scroll",this._owner.displayObject);
	}

	__proto.__mouseUp=function(){
		this._owner.displayObject.stage.off("mousemove",this,this.__mouseMove);
		this._owner.displayObject.stage.off("mouseup",this,this.__mouseUp);
		this._owner.displayObject.stage.off("click",this,this.__click);
		if (ScrollPane.draggingPane==this)
			ScrollPane.draggingPane=null;
		ScrollPane._gestureFlag=0;
		if (!this.isDragged || !this._touchEffect){
			this.isDragged=false;
			this._maskContainer.mouseEnabled=true;
			return;
		}
		this.isDragged=false;
		this._maskContainer.mouseEnabled=true;
		this._tweenStart.setTo(this._container.x,this._container.y);
		ScrollPane.sEndPos.setTo(this._tweenStart.x,this._tweenStart.y);
		var flag=false;
		if (this._container.x > 0){
			ScrollPane.sEndPos.x=0;
			flag=true;
		}
		else if (this._container.x <-this._overlapSize.x){
			ScrollPane.sEndPos.x=-this._overlapSize.x;
			flag=true;
		}
		if (this._container.y > 0){
			ScrollPane.sEndPos.y=0;
			flag=true;
		}
		else if (this._container.y <-this._overlapSize.y){
			ScrollPane.sEndPos.y=-this._overlapSize.y;
			flag=true;
		}
		if (flag){
			this._tweenChange.setTo(ScrollPane.sEndPos.x-this._tweenStart.x,ScrollPane.sEndPos.y-this._tweenStart.y);
			if (this._tweenChange.x <-UIConfig$1.touchDragSensitivity || this._tweenChange.y <-UIConfig$1.touchDragSensitivity){
				this._refreshEventDispatching=true;
				Events.dispatch("fui_pull_down_release",this._owner.displayObject);
				this._refreshEventDispatching=false;
			}
			else if (this._tweenChange.x > UIConfig$1.touchDragSensitivity || this._tweenChange.y > UIConfig$1.touchDragSensitivity){
				this._refreshEventDispatching=true;
				Events.dispatch("fui_pull_up_release",this._owner.displayObject);
				this._refreshEventDispatching=false;
			}
			if (this._headerLockedSize > 0 && ScrollPane.sEndPos[this._refreshBarAxis]==0){
				ScrollPane.sEndPos[this._refreshBarAxis]=this._headerLockedSize;
				this._tweenChange.x=ScrollPane.sEndPos.x-this._tweenStart.x;
				this._tweenChange.y=ScrollPane.sEndPos.y-this._tweenStart.y;
			}
			else if (this._footerLockedSize > 0 && ScrollPane.sEndPos[this._refreshBarAxis]==-this._overlapSize[this._refreshBarAxis]){
				var max=this._overlapSize[this._refreshBarAxis];
				if (max==0)
					max=Math.max(this._contentSize[this._refreshBarAxis]+this._footerLockedSize-this._viewSize[this._refreshBarAxis],0);
				else
				max+=this._footerLockedSize;
				ScrollPane.sEndPos[this._refreshBarAxis]=-max;
				this._tweenChange.x=ScrollPane.sEndPos.x-this._tweenStart.x;
				this._tweenChange.y=ScrollPane.sEndPos.y-this._tweenStart.y;
			}
			this._tweenDuration.setTo(0.3,0.3);
		}
		else{
			if (!this._inertiaDisabled){
				var frameRate=Laya.stage.frameRate=="slow"?30:60;
				var elapsed=(Laya.timer.currTimer/1000-this._lastMoveTime)*frameRate-1;
				if (elapsed > 1){
					var factor=Math.pow(0.833,elapsed);
					this._velocity.x=this._velocity.x *factor;
					this._velocity.y=this._velocity.y *factor;
				}
				this.updateTargetAndDuration(this._tweenStart,ScrollPane.sEndPos);
			}
			else
			this._tweenDuration.setTo(0.3,0.3);
			ScrollPane.sOldChange.setTo(ScrollPane.sEndPos.x-this._tweenStart.x,ScrollPane.sEndPos.y-this._tweenStart.y);
			this.loopCheckingTarget(ScrollPane.sEndPos);
			if (this._pageMode || this._snapToItem)
				this.alignPosition(ScrollPane.sEndPos,true);
			this._tweenChange.x=ScrollPane.sEndPos.x-this._tweenStart.x;
			this._tweenChange.y=ScrollPane.sEndPos.y-this._tweenStart.y;
			if (this._tweenChange.x==0 && this._tweenChange.y==0){
				if (this._scrollBarDisplayAuto)
					this.showScrollBar(false);
				return;
			}
			if (this._pageMode || this._snapToItem){
				this.fixDuration("x",ScrollPane.sOldChange.x);
				this.fixDuration("y",ScrollPane.sOldChange.y);
			}
		}
		this._tweening=2;
		this._tweenTime.setTo(0,0);
		Laya.timer.frameLoop(1,this,this.tweenUpdate);
	}

	__proto.__click=function(){
		this.isDragged=false;
	}

	__proto.__mouseWheel=function(evt){
		if(!this._mouseWheelEnabled)
			return;
		var pt=this._owner.globalToLocal(Laya.stage.mouseX,Laya.stage.mouseY,fairygui.ScrollPane.sHelperPoint);
		var delta=evt["delta"];
		delta=delta>0?-1:(delta<0?1:0);
		if (this._overlapSize.x > 0 && this._overlapSize.y==0){
			if (this._pageMode)
				this.setPosX(this._xPos+this._pageSize.x *delta,false);
			else
			this.setPosX(this._xPos+this._mouseWheelStep *delta,false);
		}
		else {
			if (this._pageMode)
				this.setPosY(this._yPos+this._pageSize.y *delta,false);
			else
			this.setPosY(this._yPos+this._mouseWheelStep *delta,false);
		}
	}

	__proto.__rollOver=function(){
		this.showScrollBar(true);
	}

	__proto.__rollOut=function(){
		this.showScrollBar(false);
	}

	__proto.showScrollBar=function(val){
		if (val){
			this.__showScrollBar(true);
			Laya.timer.clear(this,this.__showScrollBar);
		}
		else
		Laya.timer.once(500,this,this.__showScrollBar,[val]);
	}

	__proto.__showScrollBar=function(val){
		this._scrollBarVisible=val && this._viewSize.x>0 && this._viewSize.y>0;
		if (this._vtScrollBar)
			this._vtScrollBar.displayObject.visible=this._scrollBarVisible && !this._vScrollNone;
		if (this._hzScrollBar)
			this._hzScrollBar.displayObject.visible=this._scrollBarVisible && !this._hScrollNone;
	}

	__proto.getLoopPartSize=function(division,axis){
		return (this._contentSize[axis]+(axis=="x" ? (this._owner).columnGap :(this._owner).lineGap))/ division;
	}

	__proto.loopCheckingCurrent=function(){
		var changed=false;
		if (this._loop==1 && this._overlapSize.x > 0){
			if (this._xPos < 0.001){
				this._xPos+=this.getLoopPartSize(2,"x");
				changed=true;
			}
			else if (this._xPos >=this._overlapSize.x){
				this._xPos-=this.getLoopPartSize(2,"x");
				changed=true;
			}
		}
		else if (this._loop==2 && this._overlapSize.y > 0){
			if (this._yPos < 0.001){
				this._yPos+=this.getLoopPartSize(2,"y");
				changed=true;
			}
			else if (this._yPos >=this._overlapSize.y){
				this._yPos-=this.getLoopPartSize(2,"y");
				changed=true;
			}
		}
		if (changed)
			this._container.pos(Math.floor(-this._xPos),Math.floor(-this._yPos));
		return changed;
	}

	__proto.loopCheckingTarget=function(endPos){
		if (this._loop==1)
			this.loopCheckingTarget2(endPos,"x");
		if (this._loop==2)
			this.loopCheckingTarget2(endPos,"y");
	}

	__proto.loopCheckingTarget2=function(endPos,axis){
		var halfSize=NaN;
		var tmp=NaN;
		if (endPos[axis] > 0){
			halfSize=this.getLoopPartSize(2,axis);
			tmp=this._tweenStart[axis]-halfSize;
			if (tmp <=0 && tmp >=-this._overlapSize[axis]){
				endPos[axis]-=halfSize;
				this._tweenStart[axis]=tmp;
			}
		}
		else if (endPos[axis] <-this._overlapSize[axis]){
			halfSize=this.getLoopPartSize(2,axis);
			tmp=this._tweenStart[axis]+halfSize;
			if (tmp <=0 && tmp >=-this._overlapSize[axis]){
				endPos[axis]+=halfSize;
				this._tweenStart[axis]=tmp;
			}
		}
	}

	__proto.loopCheckingNewPos=function(value,axis){
		if (this._overlapSize[axis]==0)
			return value;
		var pos=axis=="x" ? this._xPos :this._yPos;
		var changed=false;
		var v=NaN;
		if (value < 0.001){
			value+=this.getLoopPartSize(2,axis);
			if (value > pos){
				v=this.getLoopPartSize(6,axis);
				v=Math.ceil((value-pos)/ v)*v;
				pos=ToolSet.clamp(pos+v,0,this._overlapSize[axis]);
				changed=true;
			}
		}
		else if (value >=this._overlapSize[axis]){
			value-=this.getLoopPartSize(2,axis);
			if (value < pos){
				v=this.getLoopPartSize(6,axis);
				v=Math.ceil((pos-value)/ v)*v;
				pos=ToolSet.clamp(pos-v,0,this._overlapSize[axis]);
				changed=true;
			}
		}
		if (changed){
			if (axis=="x")
				this._container.x=-Math.floor(pos);
			else
			this._container.y=-Math.floor(pos);
		}
		return value;
	}

	__proto.alignPosition=function(pos,inertialScrolling){
		if (this._pageMode){
			pos.x=this.alignByPage(pos.x,"x",inertialScrolling);
			pos.y=this.alignByPage(pos.y,"y",inertialScrolling);
		}
		else if (this._snapToItem){
			var pt=this._owner.getSnappingPosition(-pos.x,-pos.y,ScrollPane.sHelperPoint);
			if (pos.x < 0 && pos.x >-this._overlapSize.x)
				pos.x=-pt.x;
			if (pos.y < 0 && pos.y >-this._overlapSize.y)
				pos.y=-pt.y;
		}
	}

	__proto.alignByPage=function(pos,axis,inertialScrolling){
		var page=0;
		if (pos > 0)
			page=0;
		else if (pos <-this._overlapSize[axis])
		page=Math.ceil(this._contentSize[axis] / this._pageSize[axis])-1;
		else{
			page=Math.floor(-pos / this._pageSize[axis]);
			var change=inertialScrolling ? (pos-this._containerPos[axis]):(pos-this._container[axis]);
			var testPageSize=Math.min(this._pageSize[axis],this._contentSize[axis]-(page+1)*this._pageSize[axis]);
			var delta=-pos-page *this._pageSize[axis];
			if (Math.abs(change)> this._pageSize[axis]){
				if (delta > testPageSize *0.5)
					page++;
			}
			else{
				if (delta > testPageSize *(change < 0 ? 0.3 :0.7))
					page++;
			}
			pos=-page *this._pageSize[axis];
			if (pos <-this._overlapSize[axis])
				pos=-this._overlapSize[axis];
		}
		if (inertialScrolling){
			var oldPos=this._tweenStart[axis];
			var oldPage=0;
			if (oldPos > 0)
				oldPage=0;
			else if (oldPos <-this._overlapSize[axis])
			oldPage=Math.ceil(this._contentSize[axis] / this._pageSize[axis])-1;
			else
			oldPage=Math.floor(-oldPos / this._pageSize[axis]);
			var startPage=Math.floor(-this._containerPos[axis] / this._pageSize[axis]);
			if (Math.abs(page-startPage)> 1 && Math.abs(oldPage-startPage)<=1){
				if (page > startPage)
					page=startPage+1;
				else
				page=startPage-1;
				pos=-page *this._pageSize[axis];
			}
		}
		return pos;
	}

	__proto.updateTargetAndDuration=function(orignPos,resultPos){
		resultPos.x=this.updateTargetAndDuration2(orignPos.x,"x");
		resultPos.y=this.updateTargetAndDuration2(orignPos.y,"y");
	}

	__proto.updateTargetAndDuration2=function(pos,axis){
		var v=this._velocity[axis];
		var duration=0;
		if (pos > 0)
			pos=0;
		else if (pos <-this._overlapSize[axis])
		pos=-this._overlapSize[axis];
		else{
			var v2=Math.abs(v)*this._velocityScale;
			if(Browser.onMobile)
				v2 *=1136 / Math.max(Laya.stage.width,Laya.stage.height);
			var ratio=0;
			if (this._pageMode || !Browser.onMobile){
				if (v2 > 500)
					ratio=Math.pow((v2-500)/ 500,2);
			}
			else{
				if (v2 > 1000)
					ratio=Math.pow((v2-1000)/ 1000,2);
			}
			if (ratio !=0){
				if (ratio > 1)
					ratio=1;
				v2 *=ratio;
				v *=ratio;
				this._velocity[axis]=v;
				duration=Math.log(60 / v2)/Math.log(this._decelerationRate)/ 60;
				var change=Math.floor(v *duration *0.4);
				pos+=change;
			}
		}
		if (duration < 0.3)
			duration=0.3;
		this._tweenDuration[axis]=duration;
		return pos;
	}

	__proto.fixDuration=function(axis,oldChange){
		if (this._tweenChange[axis]==0 || Math.abs(this._tweenChange[axis])>=Math.abs(oldChange))
			return;
		var newDuration=Math.abs(this._tweenChange[axis] / oldChange)*this._tweenDuration[axis];
		if (newDuration < 0.3)
			newDuration=0.3;
		this._tweenDuration[axis]=newDuration;
	}

	__proto.killTween=function(){
		if (this._tweening==1){
			this._container.pos(this._tweenStart.x+this._tweenChange.x,this._tweenStart.y+this._tweenChange.y);
			Events.dispatch("fui_scroll",this._owner.displayObject);
		}
		this._tweening=0;
		Laya.timer.clear(this,this.tweenUpdate);
		Events.dispatch("fui_scroll_end",this._owner.displayObject);
	}

	__proto.checkRefreshBar=function(){
		if (this._header==null && this._footer==null)
			return;
		var pos=this._container[this._refreshBarAxis];
		if (this._header !=null){
			if (pos > 0){
				if (this._header.displayObject.parent==null)
					this._maskContainer.addChildAt(this._header.displayObject,0);
				var pt=ScrollPane.sHelperPoint;
				pt.setTo(this._header.width,this._header.height);
				pt[this._refreshBarAxis]=pos;
				this._header.setSize(pt.x,pt.y);
			}
			else{
				if (this._header.displayObject.parent !=null)
					this._maskContainer.removeChild(this._header.displayObject);
			}
		}
		if (this._footer !=null){
			var max=this._overlapSize[this._refreshBarAxis];
			if (pos <-max || max==0 && this._footerLockedSize > 0){
				if (this._footer.displayObject.parent==null)
					this._maskContainer.addChildAt(this._footer.displayObject,0);
				pt=ScrollPane.sHelperPoint;
				pt.setTo(this._footer.x,this._footer.y);
				if (max > 0)
					pt[this._refreshBarAxis]=pos+this._contentSize[this._refreshBarAxis];
				else
				pt[this._refreshBarAxis]=Math.max(Math.min(pos+this._viewSize[this._refreshBarAxis],this._viewSize[this._refreshBarAxis]-this._footerLockedSize),
				this._viewSize[this._refreshBarAxis]-this._contentSize[this._refreshBarAxis]);
				this._footer.setXY(pt.x,pt.y);
				pt.setTo(this._footer.width,this._footer.height);
				if (max > 0)
					pt[this._refreshBarAxis]=-max-pos;
				else
				pt[this._refreshBarAxis]=this._viewSize[this._refreshBarAxis]-this._footer[this._refreshBarAxis];
				this._footer.setSize(pt.x,pt.y);
			}
			else{
				if (this._footer.displayObject.parent !=null)
					this._maskContainer.removeChild(this._footer.displayObject);
			}
		}
	}

	__proto.tweenUpdate=function(){
		var nx=this.runTween("x");
		var ny=this.runTween("y");
		this._container.pos(nx,ny);
		if (this._tweening==2){
			if (this._overlapSize.x > 0)
				this._xPos=ToolSet.clamp(-nx,0,this._overlapSize.x);
			if (this._overlapSize.y > 0)
				this._yPos=ToolSet.clamp(-ny,0,this._overlapSize.y);
			if (this._pageMode)
				this.updatePageController();
		}
		if (this._tweenChange.x==0 && this._tweenChange.y==0){
			this._tweening=0;
			Laya.timer.clear(this,this.tweenUpdate);
			this.loopCheckingCurrent();
			this.syncScrollBar(true);
			this.checkRefreshBar();
			Events.dispatch("fui_scroll",this._owner.displayObject);
			Events.dispatch("fui_scroll_end",this._owner.displayObject);
		}
		else{
			this.syncScrollBar(false);
			this.checkRefreshBar();
			Events.dispatch("fui_scroll",this._owner.displayObject);
		}
	}

	__proto.runTween=function(axis){
		var newValue=NaN;
		if (this._tweenChange[axis] !=0){
			this._tweenTime[axis]+=Laya.timer.delta/1000;
			if (this._tweenTime[axis] >=this._tweenDuration[axis]){
				newValue=this._tweenStart[axis]+this._tweenChange[axis];
				this._tweenChange[axis]=0;
			}
			else{
				var ratio=ScrollPane.easeFunc(this._tweenTime[axis],this._tweenDuration[axis]);
				newValue=this._tweenStart[axis]+Math.floor(this._tweenChange[axis] *ratio);
			};
			var threshold1=0;
			var threshold2=-this._overlapSize[axis];
			if (this._headerLockedSize > 0 && this._refreshBarAxis==axis)
				threshold1=this._headerLockedSize;
			if (this._footerLockedSize > 0 && this._refreshBarAxis==axis){
				var max=this._overlapSize[this._refreshBarAxis];
				if (max==0)
					max=Math.max(this._contentSize[this._refreshBarAxis]+this._footerLockedSize-this._viewSize[this._refreshBarAxis],0);
				else
				max+=this._footerLockedSize;
				threshold2=-max;
			}
			if (this._tweening==2 && this._bouncebackEffect){
				if (newValue > 20+threshold1 && this._tweenChange[axis] > 0
					|| newValue > threshold1 && this._tweenChange[axis]==0){
					this._tweenTime[axis]=0;
					this._tweenDuration[axis]=0.3;
					this._tweenChange[axis]=-newValue+threshold1;
					this._tweenStart[axis]=newValue;
				}
				else if (newValue < threshold2-20 && this._tweenChange[axis] < 0
				|| newValue < threshold2 && this._tweenChange[axis]==0){
					this._tweenTime[axis]=0;
					this._tweenDuration[axis]=0.3;
					this._tweenChange[axis]=threshold2-newValue;
					this._tweenStart[axis]=newValue;
				}
			}
			else{
				if (newValue > threshold1){
					newValue=threshold1;
					this._tweenChange[axis]=0;
				}
				else if (newValue < threshold2){
					newValue=threshold2;
					this._tweenChange[axis]=0;
				}
			}
		}
		else
		newValue=this._container[axis];
		return newValue;
	}

	__getset(0,__proto,'viewWidth',function(){
		return this._viewSize.x;
		},function(value){
		value=value+this._owner.margin.left+this._owner.margin.right;
		if (this._vtScrollBar !=null)
			value+=this._vtScrollBar.width;
		this._owner.width=value;
	});

	__getset(0,__proto,'percY',function(){
		return this._overlapSize.y==0 ? 0 :this._yPos / this._overlapSize.y;
		},function(value){
		this.setPercY(value,false);
	});

	__getset(0,__proto,'owner',function(){
		return this._owner;
	});

	__getset(0,__proto,'bouncebackEffect',function(){
		return this._bouncebackEffect;
		},function(sc){
		this._bouncebackEffect=sc;
	});

	__getset(0,__proto,'vtScrollBar',function(){
		return this._vtScrollBar;
	});

	__getset(0,__proto,'hzScrollBar',function(){
		return this._hzScrollBar;
	});

	__getset(0,__proto,'header',function(){
		return this._header;
	});

	__getset(0,__proto,'footer',function(){
		return this._footer;
	});

	__getset(0,__proto,'isBottomMost',function(){
		return this._yPos==this._overlapSize.y || this._overlapSize.y==0;
	});

	__getset(0,__proto,'touchEffect',function(){
		return this._touchEffect;
		},function(sc){
		this._touchEffect=sc;
	});

	__getset(0,__proto,'contentWidth',function(){
		return this._contentSize.x;
	});

	__getset(0,__proto,'scrollStep',function(){
		return this._scrollStep;
		},function(val){
		this._scrollStep=val;
		if(this._scrollStep==0)
			this._scrollStep=UIConfig$1.defaultScrollStep;
		this._mouseWheelStep=this._scrollStep*2;
	});

	__getset(0,__proto,'viewHeight',function(){
		return this._viewSize.y;
		},function(value){
		value=value+this._owner.margin.top+this._owner.margin.bottom;
		if (this._hzScrollBar !=null)
			value+=this._hzScrollBar.height;
		this._owner.height=value;
	});

	__getset(0,__proto,'posX',function(){
		return this._xPos;
		},function(value){
		this.setPosX(value,false);
	});

	__getset(0,__proto,'snapToItem',function(){
		return this._snapToItem;
		},function(value){
		this._snapToItem=value;
	});

	__getset(0,__proto,'mouseWheelEnabled',function(){
		return this._mouseWheelEnabled;
		},function(value){
		this._mouseWheelEnabled=value;
	});

	__getset(0,__proto,'decelerationRate',function(){
		return this._decelerationRate;
		},function(value){
		this._decelerationRate=value;
	});

	__getset(0,__proto,'percX',function(){
		return this._overlapSize.x==0 ? 0 :this._xPos / this._overlapSize.x;
		},function(value){
		this.setPercX(value,false);
	});

	__getset(0,__proto,'posY',function(){
		return this._yPos;
		},function(value){
		this.setPosY(value,false);
	});

	__getset(0,__proto,'contentHeight',function(){
		return this._contentSize.y;
	});

	__getset(0,__proto,'currentPageX',function(){
		if (!this._pageMode)
			return 0;
		var page=Math.floor(this._xPos / this._pageSize.x);
		if (this._xPos-page *this._pageSize.x > this._pageSize.x *0.5)
			page++;
		return page;
		},function(value){
		this.setCurrentPageX(value,false);
	});

	__getset(0,__proto,'currentPageY',function(){
		if (!this._pageMode)
			return 0;
		var page=Math.floor(this._yPos / this._pageSize.y);
		if (this._yPos-page *this._pageSize.y > this._pageSize.y *0.5)
			page++;
		return page;
		},function(value){
		this.setCurrentPageY(value,false);
	});

	__getset(0,__proto,'isRightMost',function(){
		return this._xPos==this._overlapSize.x || this._overlapSize.x==0;
	});

	__getset(0,__proto,'pageController',function(){
		return this._pageController;
		},function(value){
		this._pageController=value;
	});

	__getset(0,__proto,'scrollingPosX',function(){
		return ToolSet.clamp(-this._container.x,0,this._overlapSize.x);
	});

	__getset(0,__proto,'scrollingPosY',function(){
		return ToolSet.clamp(-this._container.y,0,this._overlapSize.y);
	});

	ScrollPane.easeFunc=function(t,d){
		return (t=t / d-1)*t *t+1;
	}

	ScrollPane.draggingPane=null;
	ScrollPane._gestureFlag=0;
	ScrollPane.TWEEN_TIME_GO=0.5;
	ScrollPane.TWEEN_TIME_DEFAULT=0.3;
	ScrollPane.PULL_RATIO=0.5;
	__static(ScrollPane,
	['sHelperPoint',function(){return this.sHelperPoint=new Point();},'sHelperRect',function(){return this.sHelperRect=new Rectangle();},'sEndPos',function(){return this.sEndPos=new Point();},'sOldChange',function(){return this.sOldChange=new Point();}
	]);
	return ScrollPane;
})()



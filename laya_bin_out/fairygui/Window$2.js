//class fairygui.Window extends fairygui.GComponent
var Window$2=(function(_super){
	function Window(){
		this._contentPane=null;
		this._modalWaitPane=null;
		this._closeButton=null;
		this._dragArea=null;
		this._contentArea=null;
		this._frame=null;
		this._modal=false;
		this._uiSources=null;
		this._inited=false;
		this._loading=false;
		this._requestingCmd=0;
		this.bringToFontOnClick=false;
		Window.__super.call(this);
		this.focusable=true;
		this._uiSources=[];
		this.bringToFontOnClick=UIConfig$1.bringWindowToFrontOnClick;
		this.displayObject.on("display",this,this.__onShown);
		this.displayObject.on("undisplay",this,this.__onHidden);
		this.displayObject.on("mousedown",this,this.__mouseDown);
	}

	__class(Window,'fairygui.Window',_super,'Window$2');
	var __proto=Window.prototype;
	__proto.addUISource=function(source){
		this._uiSources.push(source);
	}

	__proto.show=function(){
		GRoot.inst.showWindow(this);
	}

	__proto.showOn=function(root){
		root.showWindow(this);
	}

	__proto.hide=function(){
		if(this.isShowing)
			this.doHideAnimation();
	}

	__proto.hideImmediately=function(){
		var r=((this.parent instanceof fairygui.GRoot ))? (this.parent):null;
		if(!r)
			r=GRoot.inst;
		r.hideWindowImmediately(this);
	}

	__proto.centerOn=function(r,restraint){
		(restraint===void 0)&& (restraint=false);
		this.setXY(Math.round((r.width-this.width)/ 2),Math.round((r.height-this.height)/ 2));
		if(restraint){
			this.addRelation(r,3);
			this.addRelation(r,10);
		}
	}

	__proto.toggleStatus=function(){
		if(this.isTop)
			this.hide();
		else
		this.show();
	}

	__proto.bringToFront=function(){
		this.root.bringToFront(this);
	}

	__proto.showModalWait=function(requestingCmd){
		(requestingCmd===void 0)&& (requestingCmd=0);
		if(requestingCmd !=0)
			this._requestingCmd=requestingCmd;
		if(UIConfig$1.windowModalWaiting){
			if(!this._modalWaitPane)
				this._modalWaitPane=UIPackage.createObjectFromURL(UIConfig$1.windowModalWaiting);
			this.layoutModalWaitPane();
			this.addChild(this._modalWaitPane);
		}
	}

	__proto.layoutModalWaitPane=function(){
		if(this._contentArea !=null){
			var pt=this._frame.localToGlobal();
			pt=this.globalToLocal(pt.x,pt.y,pt);
			this._modalWaitPane.setXY(pt.x+this._contentArea.x,pt.y+this._contentArea.y);
			this._modalWaitPane.setSize(this._contentArea.width,this._contentArea.height);
		}
		else
		this._modalWaitPane.setSize(this.width,this.height);
	}

	__proto.closeModalWait=function(requestingCmd){
		(requestingCmd===void 0)&& (requestingCmd=0);
		if(requestingCmd !=0){
			if(this._requestingCmd !=requestingCmd)
				return false;
		}
		this._requestingCmd=0;
		if(this._modalWaitPane && this._modalWaitPane.parent !=null)
			this.removeChild(this._modalWaitPane);
		return true;
	}

	__proto.init=function(){
		if(this._inited || this._loading)
			return;
		if(this._uiSources.length > 0){
			this._loading=false;
			var cnt=this._uiSources.length;
			for(var i=0;i < cnt;i++){
				var lib=this._uiSources[i];
				if(!lib.loaded){
					lib.load(this.__uiLoadComplete,this);
					this._loading=true;
				}
			}
			if(!this._loading)
				this._init();
		}
		else
		this._init();
	}

	__proto.onInit=function(){}
	__proto.onShown=function(){}
	__proto.onHide=function(){}
	__proto.doShowAnimation=function(){
		this.onShown();
	}

	__proto.doHideAnimation=function(){
		this.hideImmediately();
	}

	__proto.__uiLoadComplete=function(){
		var cnt=this._uiSources.length;
		for(var i=0;i < cnt;i++){
			var lib=this._uiSources[i];
			if(!lib.loaded)
				return;
		}
		this._loading=false;
		this._init();
	}

	__proto._init=function(){
		this._inited=true;
		this.onInit();
		if(this.isShowing)
			this.doShowAnimation();
	}

	__proto.dispose=function(){
		if(this.parent !=null)
			this.hideImmediately();
		_super.prototype.dispose.call(this);
	}

	__proto.closeEventHandler=function(){
		this.hide();
	}

	__proto.__onShown=function(){
		if(!this._inited)
			this.init();
		else
		this.doShowAnimation();
	}

	__proto.__onHidden=function(){
		this.closeModalWait();
		this.onHide();
	}

	__proto.__mouseDown=function(){
		if(this.isShowing && this.bringToFontOnClick)
			this.bringToFront();
	}

	__proto.__dragStart=function(evt){
		GObject.cast(evt.currentTarget).stopDrag();
		this.startDrag();
	}

	__getset(0,__proto,'contentPane',function(){
		return this._contentPane;
		},function(val){
		if(this._contentPane !=val){
			if(this._contentPane !=null)
				this.removeChild(this._contentPane);
			this._contentPane=val;
			if(this._contentPane !=null){
				this.addChild(this._contentPane);
				this.setSize(this._contentPane.width,this._contentPane.height);
				this._contentPane.addRelation(this,24);
				this._frame=(this._contentPane.getChild("frame"));
				if(this._frame !=null){
					this.closeButton=this._frame.getChild("closeButton");
					this.dragArea=this._frame.getChild("dragArea");
					this.contentArea=this._frame.getChild("contentArea");
				}
			}
		}
	});

	__getset(0,__proto,'isShowing',function(){
		return this.parent !=null;
	});

	__getset(0,__proto,'isTop',function(){
		return this.parent !=null && this.parent.getChildIndex(this)==this.parent.numChildren-1;
	});

	__getset(0,__proto,'modal',function(){
		return this._modal;
		},function(val){
		this._modal=val;
	});

	__getset(0,__proto,'dragArea',function(){
		return this._dragArea;
		},function(value){
		if(this._dragArea !=value){
			if(this._dragArea !=null){
				this._dragArea.draggable=false;
				this._dragArea.off("fui_drag_start",this,this.__dragStart);
			}
			this._dragArea=value;
			if(this._dragArea !=null){
				if((this._dragArea instanceof fairygui.GGraph ))
					this._dragArea.asGraph.drawRect(0,null,null);
				this._dragArea.draggable=true;
				this._dragArea.on("fui_drag_start",this,this.__dragStart);
			}
		}
	});

	__getset(0,__proto,'frame',function(){
		return this._frame;
	});

	__getset(0,__proto,'closeButton',function(){
		return this._closeButton;
		},function(value){
		if(this._closeButton !=null)
			this._closeButton.offClick(this,this.closeEventHandler);
		this._closeButton=value;
		if(this._closeButton !=null)
			this._closeButton.onClick(this,this.closeEventHandler);
	});

	__getset(0,__proto,'contentArea',function(){
		return this._contentArea;
		},function(value){
		this._contentArea=value;
	});

	__getset(0,__proto,'modalWaiting',function(){
		return this._modalWaitPane && this._modalWaitPane.parent !=null;
	});

	return Window;
})(GComponent)



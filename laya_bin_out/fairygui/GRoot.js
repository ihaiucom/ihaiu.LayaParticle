//class fairygui.GRoot extends fairygui.GComponent
var GRoot=(function(_super){
	function GRoot(){
		this._modalLayer=null;
		this._popupStack=null;
		this._justClosedPopups=null;
		this._modalWaitPane=null;
		this._focusedObject=null;
		this._tooltipWin=null;
		this._defaultTooltipWin=null;
		this._checkPopups=false;
		GRoot.__super.call(this);
		if(fairygui.GRoot._inst==null)
			fairygui.GRoot._inst=this;
		this.opaque=false;
		this._popupStack=[];
		this._justClosedPopups=[];
		this.displayObject.once("display",this,this.__addedToStage);
	}

	__class(GRoot,'fairygui.GRoot',_super);
	var __proto=GRoot.prototype;
	__proto.showWindow=function(win){
		this.addChild(win);
		win.requestFocus();
		if(win.x > this.width)
			win.x=this.width-win.width;
		else if(win.x+win.width < 0)
		win.x=0;
		if(win.y > this.height)
			win.y=this.height-win.height;
		else if(win.y+win.height < 0)
		win.y=0;
		this.adjustModalLayer();
	}

	__proto.hideWindow=function(win){
		win.hide();
	}

	__proto.hideWindowImmediately=function(win){
		if(win.parent==this)
			this.removeChild(win);
		this.adjustModalLayer();
	}

	__proto.bringToFront=function(win){
		var cnt=this.numChildren;
		var i=NaN;
		if(this._modalLayer.parent!=null && !win.modal)
			i=this.getChildIndex(this._modalLayer)-1;
		else
		i=cnt-1;
		for(;i >=0;i--){
			var g=this.getChildAt(i);
			if(g==win)
				return;
			if((g instanceof fairygui.Window ))
				break ;
		}
		if(i>=0)
			this.setChildIndex(win,i);
	}

	__proto.showModalWait=function(msg){
		if(UIConfig$1.globalModalWaiting !=null){
			if(this._modalWaitPane==null)
				this._modalWaitPane=UIPackage.createObjectFromURL(UIConfig$1.globalModalWaiting);
			this._modalWaitPane.setSize(this.width,this.height);
			this._modalWaitPane.addRelation(this,24);
			this.addChild(this._modalWaitPane);
			this._modalWaitPane.text=msg;
		}
	}

	__proto.closeModalWait=function(){
		if(this._modalWaitPane !=null && this._modalWaitPane.parent !=null)
			this.removeChild(this._modalWaitPane);
	}

	__proto.closeAllExceptModals=function(){
		var arr=this._children.slice();
		var cnt=arr.length;
		for(var i=0;i < cnt;i++){
			var g=arr[i];
			if(((g instanceof fairygui.Window ))&& !(g).modal)
				(g).hide();
		}
	}

	__proto.closeAllWindows=function(){
		var arr=this._children.slice();
		var cnt=arr.length;
		for(var i=0;i < cnt;i++){
			var g=arr[i];
			if((g instanceof fairygui.Window ))
				(g).hide();
		}
	}

	__proto.getTopWindow=function(){
		var cnt=this.numChildren;
		for(var i=cnt-1;i >=0;i--){
			var g=this.getChildAt(i);
			if((g instanceof fairygui.Window )){
				return (g);
			}
		}
		return null;
	}

	__proto.showPopup=function(popup,target,downward){
		if(this._popupStack.length > 0){
			var k=this._popupStack.indexOf(popup);
			if(k !=-1){
				for(var i=this._popupStack.length-1;i >=k;i--)
				this.removeChild(this._popupStack.pop());
			}
		}
		this._popupStack.push(popup);
		if (target !=null){
			var p=target;
			while (p !=null){
				if (p.parent==this){
					if (popup.sortingOrder < p.sortingOrder){
						popup.sortingOrder=p.sortingOrder;
					}
					break ;
				}
				p=p.parent;
			}
		}
		this.addChild(popup);
		this.adjustModalLayer();
		var pos;
		var sizeW=0,sizeH=0;
		if(target){
			pos=target.localToGlobal();
			sizeW=target.width;
			sizeH=target.height;
		}
		else {
			pos=this.globalToLocal(Laya.stage.mouseX,Laya.stage.mouseY);
		};
		var xx=NaN,yy=NaN;
		xx=pos.x;
		if(xx+popup.width > this.width)
			xx=xx+sizeW-popup.width;
		yy=pos.y+sizeH;
		if((downward==null && yy+popup.height > this.height)
			|| downward==false){
			yy=pos.y-popup.height-1;
			if(yy < 0){
				yy=0;
				xx+=sizeW / 2;
			}
		}
		popup.x=xx;
		popup.y=yy;
	}

	__proto.togglePopup=function(popup,target,downward){
		if(this._justClosedPopups.indexOf(popup)!=-1)
			return;
		this.showPopup(popup,target,downward);
	}

	__proto.hidePopup=function(popup){
		if(popup !=null){
			var k=this._popupStack.indexOf(popup);
			if(k !=-1){
				for(var i=this._popupStack.length-1;i >=k;i--)
				this.closePopup(this._popupStack.pop());
			}
		}
		else {
			var cnt=this._popupStack.length;
			for(i=cnt-1;i >=0;i--)
			this.closePopup(this._popupStack[i]);
			this._popupStack.length=0;
		}
	}

	__proto.closePopup=function(target){
		if(target.parent !=null){
			if((target instanceof fairygui.Window ))
				(target).hide();
			else
			this.removeChild(target);
		}
	}

	__proto.showTooltips=function(msg){
		if (this._defaultTooltipWin==null){
			var resourceURL=UIConfig$1.tooltipsWin;
			if (!resourceURL){
				Log.print("UIConfig.tooltipsWin not defined");
				return;
			}
			this._defaultTooltipWin=UIPackage.createObjectFromURL(resourceURL);
		}
		this._defaultTooltipWin.text=msg;
		this.showTooltipsWin(this._defaultTooltipWin);
	}

	__proto.showTooltipsWin=function(tooltipWin,position){
		this.hideTooltips();
		this._tooltipWin=tooltipWin;
		var xx=0;
		var yy=0;
		if (position==null){
			xx=Laya.stage.mouseX+10;
			yy=Laya.stage.mouseY+20;
		}
		else {
			xx=position.x;
			yy=position.y;
		};
		var pt=this.globalToLocal(xx,yy);
		xx=pt.x;
		yy=pt.y;
		if (xx+this._tooltipWin.width > this.width){
			xx=xx-this._tooltipWin.width-1;
			if (xx < 0)
				xx=10;
		}
		if (yy+this._tooltipWin.height > this.height){
			yy=yy-this._tooltipWin.height-1;
			if (xx-this._tooltipWin.width-1 > 0)
				xx=xx-this._tooltipWin.width-1;
			if (yy < 0)
				yy=10;
		}
		this._tooltipWin.x=xx;
		this._tooltipWin.y=yy;
		this.addChild(this._tooltipWin);
	}

	__proto.hideTooltips=function(){
		if (this._tooltipWin !=null){
			if (this._tooltipWin.parent)
				this.removeChild(this._tooltipWin);
			this._tooltipWin=null;
		}
	}

	__proto.getObjectUnderPoint=function(globalX,globalY){
		return null;
	}

	__proto.setFocus=function(value){
		if(this._focusedObject!=value){
			this._focusedObject=value;
			this.displayObject.event("fui_focus_changed");
		}
	}

	__proto.playOneShotSound=function(url,volumeScale){
		(volumeScale===void 0)&& (volumeScale=1);
		if(ToolSet.startsWith(url,"ui://"))
			return;
		SoundManager.playSound(url);
	}

	__proto.adjustModalLayer=function(){
		var cnt=this.numChildren;
		if (this._modalWaitPane !=null && this._modalWaitPane.parent !=null)
			this.setChildIndex(this._modalWaitPane,cnt-1);
		for(var i=cnt-1;i >=0;i--){
			var g=this.getChildAt(i);
			if(((g instanceof fairygui.Window ))&& (g).modal){
				if(this._modalLayer.parent==null)
					this.addChildAt(this._modalLayer,i);
				else
				this.setChildIndexBefore(this._modalLayer,i);
				return;
			}
		}
		if (this._modalLayer.parent !=null)
			this.removeChild(this._modalLayer);
	}

	__proto.__addedToStage=function(){
		Laya.stage.on("mousedown",this,this.__stageMouseDown);
		Laya.stage.on("mouseup",this,this.__stageMouseUp);
		this._modalLayer=new GGraph();
		this._modalLayer.setSize(this.width,this.height);
		this._modalLayer.drawRect(0,null,UIConfig$1.modalLayerColor);
		this._modalLayer.addRelation(this,24);
		this.displayObject.stage.on("resize",this,this.__winResize);
		this.__winResize();
	}

	__proto.checkPopups=function(clickTarget){
		if(this._checkPopups)
			return;
		this._checkPopups=true;
		this._justClosedPopups.length=0;
		if (this._popupStack.length > 0){
			var mc=clickTarget;
			while (mc !=this.displayObject.stage && mc !=null){
				if (mc["$owner"]){
					var pindex=this._popupStack.indexOf(mc["$owner"]);
					if (pindex !=-1){
						for(var i=this._popupStack.length-1;i > pindex;i--){
							var popup=this._popupStack.pop();
							this.closePopup(popup);
							this._justClosedPopups.push(popup);
						}
						return;
					}
				}
				mc=mc.parent;
			};
			var cnt=this._popupStack.length;
			for(i=cnt-1;i >=0;i--){
				popup=this._popupStack[i];
				this.closePopup(popup);
				this._justClosedPopups.push(popup);
			}
			this._popupStack.length=0;
		}
	}

	__proto.__stageMouseDown=function(evt){
		var mc=evt.target;
		while (mc !=this.displayObject.stage && mc !=null){
			if (mc["$owner"]){
				var gg=mc["$owner"];
				if (gg.touchable && gg.focusable){
					this.setFocus(gg);
					break ;
				}
			}
			mc=mc.parent;
		}
		if (this._tooltipWin !=null)
			this.hideTooltips();
		this.checkPopups(evt.target);
	}

	__proto.__stageMouseUp=function(){
		this._checkPopups=false;
	}

	__proto.__winResize=function(){
		this.setSize(Laya.stage.width,Laya.stage.height);
	}

	__getset(0,__proto,'focus',function(){
		if (this._focusedObject && !this._focusedObject.onStage)
			this._focusedObject=null;
		return this._focusedObject;
		},function(value){
		if (value && (!value.focusable || !value.onStage))
			throw "invalid focus target";
		this.setFocus(value);
	});

	__getset(0,__proto,'hasAnyPopup',function(){
		return this._popupStack.length !=0;
	});

	__getset(0,__proto,'modalLayer',function(){
		return this._modalLayer;
	});

	__getset(0,__proto,'hasModalWindow',function(){
		return this._modalLayer.parent !=null;
	});

	__getset(0,__proto,'modalWaiting',function(){
		return this._modalWaitPane && this._modalWaitPane.inContainer;
	});

	__getset(0,__proto,'volumeScale',function(){
		return SoundManager.soundVolume;
		},function(value){
		SoundManager.soundVolume=value;
	});

	__getset(1,GRoot,'inst',function(){
		if(fairygui.GRoot._inst==null)
			new GRoot();
		return fairygui.GRoot._inst;
	},fairygui.GComponent._$SET_inst);

	GRoot._inst=null;
	return GRoot;
})(GComponent)



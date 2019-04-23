//class fairygui.GButton extends fairygui.GComponent
var GButton=(function(_super){
	function GButton(){
		this._titleObject=null;
		this._iconObject=null;
		this._relatedController=null;
		this._mode=0;
		this._selected=false;
		this._title=null;
		this._selectedTitle=null;
		this._icon=null;
		this._selectedIcon=null;
		this._sound=null;
		this._soundVolumeScale=0;
		this._pageOption=null;
		this._buttonController=null;
		this._changeStateOnClick=false;
		this._linkedPopup=null;
		this._downEffect=0;
		this._downEffectValue=0;
		this._downScaled=false;
		this._down=false;
		this._over=false;
		GButton.__super.call(this);
		this._mode=0;
		this._title="";
		this._icon="";
		this._sound=UIConfig$1.buttonSound;
		this._soundVolumeScale=UIConfig$1.buttonSoundVolumeScale;
		this._pageOption=new PageOption();
		this._changeStateOnClick=true;
		this._downEffectValue=0.8;
	}

	__class(GButton,'fairygui.GButton',_super);
	var __proto=GButton.prototype;
	__proto.getTextField=function(){
		if ((this._titleObject instanceof fairygui.GTextField ))
			return this._titleObject;
		else if ((this._titleObject instanceof fairygui.GLabel ))
		return (this._titleObject).getTextField();
		else if ((this._titleObject instanceof fairygui.GButton ))
		return (this._titleObject).getTextField();
		else
		return null;
	}

	__proto.fireClick=function(downEffect){
		(downEffect===void 0)&& (downEffect=true);
		if (downEffect && this._mode==0){
			this.setState("over");
			Laya.timer.once(100,this,this.setState,["down"],false);
			Laya.timer.once(200,this,this.setState,["up"],false);
		}
		this.__click(Events.createEvent("click",this.displayObject));
	}

	__proto.setState=function(val){
		if (this._buttonController)
			this._buttonController.selectedPage=val;
		if(this._downEffect==1){
			var cnt=this.numChildren;
			if(val=="down" || val=="selectedOver" || val=="selectedDisabled"){
				var r=this._downEffectValue *255;
				var color=Utils.toHexColor((r << 16)+(r << 8)+r);
				for(var i=0;i < cnt;i++){
					var obj=this.getChildAt(i);
					if(((obj instanceof fairygui.GImage ))|| ((obj instanceof fairygui.GLoader ))
						|| ((obj instanceof fairygui.GMovieClip )))
					(obj).color=color;
				}
			}
			else {
				for(i=0;i < cnt;i++){
					obj=this.getChildAt(i);
					if(((obj instanceof fairygui.GImage ))|| ((obj instanceof fairygui.GLoader ))
						|| ((obj instanceof fairygui.GMovieClip )))
					(obj).color="#FFFFFF";
				}
			}
		}
		else if(this._downEffect==2){
			if(val=="down" || val=="selectedOver" || val=="selectedDisabled"){
				if(!this._downScaled){
					this.setScale(this.scaleX*this._downEffectValue,this.scaleY*this._downEffectValue);
					this._downScaled=true;
				}
			}
			else{
				if(this._downScaled){
					this.setScale(this.scaleX/this._downEffectValue,this.scaleY/this._downEffectValue);
					this._downScaled=false;
				}
			}
		}
	}

	__proto.handleControllerChanged=function(c){
		_super.prototype.handleControllerChanged.call(this,c);
		if (this._relatedController==c)
			this.selected=this._pageOption.id==c.selectedPageId;
	}

	__proto.handleGrayedChanged=function(){
		if(this._buttonController && this._buttonController.hasPage("disabled")){
			if(this.grayed){
				if(this._selected && this._buttonController.hasPage("selectedDisabled"))
					this.setState("selectedDisabled");
				else
				this.setState("disabled");
			}
			else if(this._selected)
			this.setState("down");
			else
			this.setState("up");
		}
		else
		_super.prototype.handleGrayedChanged.call(this);
	}

	__proto.constructExtension=function(buffer){
		buffer.seek(0,6);
		this._mode=buffer.readByte();
		var str=buffer.readS();
		if(str)
			this._sound=str;
		this._soundVolumeScale=buffer.getFloat32();
		this._downEffect=buffer.readByte();
		this._downEffectValue=buffer.getFloat32();
		if(this._downEffect==2)
			this.setPivot(0.5,0.5,this.pivotAsAnchor);
		this._buttonController=this.getController("button");
		this._titleObject=this.getChild("title");
		this._iconObject=this.getChild("icon");
		if (this._titleObject !=null)
			this._title=this._titleObject.text;
		if (this._iconObject !=null)
			this._icon=this._iconObject.icon;
		if (this._mode==0)
			this.setState("up");
		this.on("mouseover",this,this.__rollover);
		this.on("mouseout",this,this.__rollout);
		this.on("mousedown",this,this.__mousedown);
		this.on("click",this,this.__click);
	}

	__proto.setup_afterAdd=function(buffer,beginPos){
		_super.prototype.setup_afterAdd.call(this,buffer,beginPos);
		if (!buffer.seek(beginPos,6))
			return;
		if (buffer.readByte()!=this.packageItem.objectType)
			return;
		var str;
		var iv=0;
		str=buffer.readS();
		if (str !=null)
			this.title=str;
		str=buffer.readS();
		if (str !=null)
			this.selectedTitle=str;
		str=buffer.readS();
		if (str !=null)
			this.icon=str;
		str=buffer.readS();
		if (str !=null)
			this.selectedIcon=str;
		if (buffer.readBool())
			this.titleColor=buffer.readColorS();
		iv=buffer.getInt32();
		if (iv !=0)
			this.titleFontSize=iv;
		iv=buffer.getInt16();
		if (iv >=0)
			this._relatedController=this.parent.getControllerAt(iv);
		this.pageOption.id=buffer.readS();
		str=buffer.readS();
		if (str !=null)
			this._sound=str;
		if (buffer.readBool())
			this._soundVolumeScale=buffer.getFloat32();
		this.selected=buffer.readBool();
	}

	__proto.__rollover=function(){
		if(!this._buttonController || !this._buttonController.hasPage("over"))
			return;
		this._over=true;
		if (this._down)
			return;
		if(this.grayed && this._buttonController.hasPage("disabled"))
			return;
		this.setState(this._selected ? "selectedOver" :"over");
	}

	__proto.__rollout=function(){
		if(!this._buttonController || !this._buttonController.hasPage("over"))
			return;
		this._over=false;
		if (this._down)
			return;
		if(this.grayed && this._buttonController.hasPage("disabled"))
			return;
		this.setState(this._selected ? "down" :"up");
	}

	__proto.__mousedown=function(evt){
		this._down=true;
		GRoot.inst.checkPopups(evt.target);
		Laya.stage.on("mouseup",this,this.__mouseup);
		if(this._mode==0){
			if(this.grayed && this._buttonController && this._buttonController.hasPage("disabled"))
				this.setState("selectedDisabled");
			else
			this.setState("down");
		}
		if (this._linkedPopup !=null){
			if ((this._linkedPopup instanceof fairygui.Window ))
				(this._linkedPopup).toggleStatus();
			else
			this.root.togglePopup(this._linkedPopup,this);
		}
	}

	__proto.__mouseup=function(){
		if (this._down){
			Laya.stage.off("mouseup",this,this.__mouseup);
			this._down=false;
			if(this._displayObject==null)
				return;
			if(this._mode==0){
				if(this.grayed && this._buttonController && this._buttonController.hasPage("disabled"))
					this.setState("disabled");
				else if(this._over)
				this.setState("over");
				else
				this.setState("up");
			}
		}
	}

	__proto.__click=function(evt){
		if(this._sound){
			var pi=UIPackage.getItemByURL(this._sound);
			if (pi)
				GRoot.inst.playOneShotSound(pi.file);
			else
			GRoot.inst.playOneShotSound(this._sound);
		}
		if (this._mode==1){
			if(this._changeStateOnClick){
				this.selected=!this._selected;
				Events.dispatch("fui_state_changed",this.displayObject,evt);
			}
		}
		else if (this._mode==2){
			if (this._changeStateOnClick && !this._selected){
				this.selected=true;
				Events.dispatch("fui_state_changed",this.displayObject,evt);
			}
		}
		else{
			if(this._relatedController)
				this._relatedController.selectedPageId=this._pageOption.id;
		}
	}

	__getset(0,__proto,'relatedController',function(){
		return this._relatedController;
		},function(val){
		if (val !=this._relatedController){
			this._relatedController=val;
			this._pageOption.controller=val;
			this._pageOption.clear();
		}
	});

	__getset(0,__proto,'icon',function(){
		return this._icon;
		},function(value){
		this._icon=value;
		value=(this._selected && this._selectedIcon)? this._selectedIcon :this._icon;
		if(this._iconObject!=null)
			this._iconObject.icon=value;
		this.updateGear(7);
	});

	__getset(0,__proto,'titleFontSize',function(){
		var tf=this.getTextField();
		if(tf!=null)
			return tf.fontSize;
		else
		return 0;
		},function(value){
		var tf=this.getTextField();
		if(tf!=null)
			tf.fontSize=value;
	});

	__getset(0,__proto,'selectedIcon',function(){
		return this._selectedIcon;
		},function(value){
		this._selectedIcon=value;
		value=(this._selected && this._selectedIcon)? this._selectedIcon :this._icon;
		if(this._iconObject!=null)
			this._iconObject.icon=value;
	});

	__getset(0,__proto,'title',function(){
		return this._title;
		},function(value){
		this._title=value;
		if (this._titleObject)
			this._titleObject.text=(this._selected && this._selectedTitle)? this._selectedTitle :this._title;
		this.updateGear(6);
	});

	__getset(0,__proto,'text',function(){
		return this.title;
		},function(value){
		this.title=value;
	});

	__getset(0,__proto,'selectedTitle',function(){
		return this._selectedTitle;
		},function(value){
		this._selectedTitle=value;
		if (this._titleObject)
			this._titleObject.text=(this._selected && this._selectedTitle)? this._selectedTitle :this._title;
	});

	__getset(0,__proto,'soundVolumeScale',function(){
		return this._soundVolumeScale;
		},function(value){
		this._soundVolumeScale=value;
	});

	__getset(0,__proto,'sound',function(){
		return this._sound;
		},function(val){
		this._sound=val;
	});

	__getset(0,__proto,'titleColor',function(){
		var tf=this.getTextField();
		if(tf!=null)
			return tf.color;
		else
		return "#000000";
		},function(value){
		var tf=this.getTextField();
		if(tf!=null)
			tf.color=value;
		this.updateGear(4);
	});

	__getset(0,__proto,'selected',function(){
		return this._selected;
		},function(val){
		if (this._mode==0)
			return;
		if (this._selected !=val){
			this._selected=val;
			if(this.grayed && this._buttonController && this._buttonController.hasPage("disabled")){
				if(this._selected)
					this.setState("selectedDisabled");
				else
				this.setState("disabled");
			}
			else {
				if(this._selected)
					this.setState(this._over ? "selectedOver" :"down");
				else
				this.setState(this._over ? "over" :"up");
			}
			if(this._selectedTitle && this._titleObject)
				this._titleObject.text=this._selected ? this._selectedTitle :this._title;
			if(this._selectedIcon){
				var str=this._selected ? this._selectedIcon :this._icon;
				if(this._iconObject!=null)
					this._iconObject.icon=str;
			}
			if(this._relatedController
				&& this._parent
			&& !this._parent._buildingDisplayList){
				if(this._selected){
					this._relatedController.selectedPageId=this._pageOption.id;
					if(this._relatedController.autoRadioGroupDepth)
						this._parent.adjustRadioGroupDepth(this,this._relatedController);
				}
				else if(this._mode==1 && this._relatedController.selectedPageId==this._pageOption.id)
				this._relatedController.oppositePageId=this._pageOption.id;
			}
		}
	});

	/**
	*@see ButtonMode
	*/
	/**
	*@see ButtonMode
	*/
	__getset(0,__proto,'mode',function(){
		return this._mode;
		},function(value){
		if (this._mode !=value){
			if (value==0)
				this.selected=false;
			this._mode=value;
		}
	});

	__getset(0,__proto,'pageOption',function(){
		return this._pageOption;
	});

	__getset(0,__proto,'changeStateOnClick',function(){
		return this._changeStateOnClick;
		},function(value){
		this._changeStateOnClick=value;
	});

	__getset(0,__proto,'linkedPopup',function(){
		return this._linkedPopup;
		},function(value){
		this._linkedPopup=value;
	});

	GButton.UP="up";
	GButton.DOWN="down";
	GButton.OVER="over";
	GButton.SELECTED_OVER="selectedOver";
	GButton.DISABLED="disabled";
	GButton.SELECTED_DISABLED="selectedDisabled";
	return GButton;
})(GComponent)



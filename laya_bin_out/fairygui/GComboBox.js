//class fairygui.GComboBox extends fairygui.GComponent
var GComboBox=(function(_super){
	function GComboBox(){
		this.dropdown=null;
		this._titleObject=null;
		this._iconObject=null;
		this._list=null;
		this._items=null;
		this._icons=null;
		this._values=null;
		this._popupDirection=0;
		this._visibleItemCount=0;
		this._itemsUpdated=false;
		this._selectedIndex=0;
		this._buttonController=null;
		this._selectionController=null;
		this._down=false;
		this._over=false;
		GComboBox.__super.call(this);
		this._visibleItemCount=UIConfig$1.defaultComboBoxVisibleItemCount;
		this._itemsUpdated=true;
		this._selectedIndex=-1;
		this._items=[];
		this._values=[];
	}

	__class(GComboBox,'fairygui.GComboBox',_super);
	var __proto=GComboBox.prototype;
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

	__proto.setState=function(val){
		if (this._buttonController)
			this._buttonController.selectedPage=val;
	}

	__proto.handleControllerChanged=function(c){
		_super.prototype.handleControllerChanged.call(this,c);
		if (this._selectionController==c)
			this.selectedIndex=c.selectedIndex;
	}

	__proto.updateSelectionController=function(){
		if (this._selectionController !=null && !this._selectionController.changing
			&& this._selectedIndex < this._selectionController.pageCount){
			var c=this._selectionController;
			this._selectionController=null;
			c.selectedIndex=this._selectedIndex;
			this._selectionController=c;
		}
	}

	__proto.dispose=function(){
		if(this.dropdown){
			this.dropdown.dispose();
			this.dropdown=null;
		}
		this._selectionController=null;
		_super.prototype.dispose.call(this);
	}

	__proto.constructExtension=function(buffer){
		var str;
		this._buttonController=this.getController("button");
		this._titleObject=this.getChild("title");
		this._iconObject=this.getChild("icon");
		str=buffer.readS();
		if (str){
			this.dropdown=(UIPackage.createObjectFromURL(str));
			if (!this.dropdown){
				Log.print("下拉框必须为元件");
				return;
			}
			this.dropdown.name="this._dropdownObject";
			this._list=this.dropdown.getChild("list").asList;
			if (this._list==null){
				Log.print(this.resourceURL+": 下拉框的弹出元件里必须包含名为list的列表");
				return;
			}
			this._list.on("fui_click_item",this,this.__clickItem);
			this._list.addRelation(this.dropdown,14);
			this._list.removeRelation(this.dropdown,15);
			this.dropdown.addRelation(this._list,15);
			this.dropdown.removeRelation(this._list,14);
			this.dropdown.displayObject.on("undisplay",this,this.__popupWinClosed);
		}
		this.on("mouseover",this,this.__rollover);
		this.on("mouseout",this,this.__rollout);
		this.on("mousedown",this,this.__mousedown);
	}

	__proto.setup_afterAdd=function(buffer,beginPos){
		_super.prototype.setup_afterAdd.call(this,buffer,beginPos);
		if (!buffer.seek(beginPos,6))
			return;
		if (buffer.readByte()!=this.packageItem.objectType)
			return;
		var i=0;
		var iv=0;
		var nextPos=0;
		var str;
		var itemCount=buffer.getInt16();
		for (i=0;i < itemCount;i++){
			nextPos=buffer.getInt16();
			nextPos+=buffer.pos;
			this._items[i]=buffer.readS();
			this._values[i]=buffer.readS();
			str=buffer.readS();
			if (str !=null){
				if (this._icons==null)
					this._icons=[];
				this._icons[i]=str;
			}
			buffer.pos=nextPos;
		}
		str=buffer.readS();
		if (str !=null){
			this.text=str;
			this._selectedIndex=this._items.indexOf(str);
		}
		else if (this._items.length > 0){
			this._selectedIndex=0;
			this.text=this._items[0];
		}
		else
		this._selectedIndex=-1;
		str=buffer.readS();
		if (str !=null)
			this.icon=str;
		if (buffer.readBool())
			this.titleColor=buffer.readColorS();
		iv=buffer.getInt32();
		if (iv > 0)
			this._visibleItemCount=iv;
		this._popupDirection=buffer.readByte();
		iv=buffer.getInt16();
		if (iv >=0)
			this._selectionController=this.parent.getControllerAt(iv);
	}

	__proto.showDropdown=function(){
		if (this._itemsUpdated){
			this._itemsUpdated=false;
			this._list.removeChildrenToPool();
			var cnt=this._items.length;
			for (var i=0;i < cnt;i++){
				var item=this._list.addItemFromPool();
				item.name=i < this._values.length ? this._values[i] :"";
				item.text=this._items[i];
				item.icon=(this._icons !=null && i < this._icons.length)? this._icons[i] :null;
			}
			this._list.resizeToFit(this._visibleItemCount);
		}
		this._list.selectedIndex=-1;
		this.dropdown.width=this.width;
		var downward=null;
		if (this._popupDirection==2)
			downward=true;
		else if (this._popupDirection==1)
		downward=false;
		this.root.togglePopup(this.dropdown,this,downward);
		if (this.dropdown.parent)
			this.setState("down");
	}

	__proto.__popupWinClosed=function(){
		if(this._over)
			this.setState("over");
		else
		this.setState("up");
	}

	__proto.__clickItem=function(itemObject,evt){
		Laya.timer.callLater(this,this.__clickItem2,[this._list.getChildIndex(itemObject),evt])
	}

	__proto.__clickItem2=function(index,evt){
		if ((this.dropdown.parent instanceof fairygui.GRoot ))
			(this.dropdown.parent).hidePopup();
		this._selectedIndex=-1;
		this.selectedIndex=index;
		Events.dispatch("fui_state_changed",this.displayObject,evt);
	}

	__proto.__rollover=function(){
		this._over=true;
		if (this._down || this.dropdown && this.dropdown.parent)
			return;
		this.setState("over");
	}

	__proto.__rollout=function(){
		this._over=false;
		if (this._down || this.dropdown && this.dropdown.parent)
			return;
		this.setState("up");
	}

	__proto.__mousedown=function(evt){
		if((evt.target instanceof laya.display.Input ))
			return;
		this._down=true;
		GRoot.inst.checkPopups(evt.target);
		Laya.stage.on("mouseup",this,this.__mouseup);
		if (this.dropdown)
			this.showDropdown();
	}

	__proto.__mouseup=function(){
		if(this._down){
			this._down=false;
			Laya.stage.off("mouseup",this,this.__mouseup);
			if(this.dropdown && !this.dropdown.parent){
				if(this._over)
					this.setState("over");
				else
				this.setState("up");
			}
		}
	}

	__getset(0,__proto,'text',function(){
		if (this._titleObject)
			return this._titleObject.text;
		else
		return null;
		},function(value){
		if (this._titleObject)
			this._titleObject.text=value;
		this.updateGear(6);
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

	__getset(0,__proto,'icon',function(){
		if(this._iconObject)
			return this._iconObject.icon;
		else
		return null;
		},function(value){
		if(this._iconObject)
			this._iconObject.icon=value;
		this.updateGear(7);
	});

	__getset(0,__proto,'icons',function(){
		return this._icons;
		},function(value){
		this._icons=value;
		if (this._icons !=null && this._selectedIndex !=-1 && this._selectedIndex < this._icons.length)
			this.icon=this._icons[this._selectedIndex];
	});

	__getset(0,__proto,'selectionController',function(){
		return this._selectionController;
		},function(value){
		this._selectionController=value;
	});

	__getset(0,__proto,'visibleItemCount',function(){
		return this._visibleItemCount;
		},function(value){
		this._visibleItemCount=value;
	});

	/**
	*@see PopupDirection
	*/
	/**
	*@see PopupDirection
	*/
	__getset(0,__proto,'popupDirection',function(){
		return this._popupDirection;
		},function(value){
		this._popupDirection=value;
	});

	__getset(0,__proto,'items',function(){
		return this._items;
		},function(value){
		if(!value)
			this._items.length=0;
		else
		this._items=value.concat();
		if(this._items.length>0){
			if(this._selectedIndex>=this._items.length)
				this._selectedIndex=this._items.length-1;
			else if(this._selectedIndex==-1)
			this._selectedIndex=0;
			this.text=this._items[this._selectedIndex];
			if (this._icons !=null && this._selectedIndex < this._icons.length)
				this.icon=this._icons[this._selectedIndex];
		}
		else{
			this.text="";
			if (this._icons !=null)
				this.icon=null;
			this._selectedIndex=-1;
		}
		this._itemsUpdated=true;
	});

	__getset(0,__proto,'values',function(){
		return this._values;
		},function(value){
		if (!value)
			this._values.length=0;
		else
		this._values=value.concat();
	});

	__getset(0,__proto,'selectedIndex',function(){
		return this._selectedIndex;
		},function(val){
		if(this._selectedIndex==val)
			return;
		this._selectedIndex=val;
		if(this._selectedIndex>=0 && this._selectedIndex<this._items.length){
			this.text=this._items[this._selectedIndex];
			if (this._icons !=null && this._selectedIndex < this._icons.length)
				this.icon=this._icons[this._selectedIndex];
		}
		else{
			this.text="";
			if (this._icons !=null)
				this.icon=null;
		}
		this.updateSelectionController();
	});

	__getset(0,__proto,'value',function(){
		return this._values[this._selectedIndex];
		},function(val){
		this.selectedIndex=this._values.indexOf(val);
	});

	return GComboBox;
})(GComponent)



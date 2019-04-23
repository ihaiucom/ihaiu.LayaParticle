//class fairygui.PopupMenu
var PopupMenu=(function(){
	function PopupMenu(resourceURL){
		this._contentPane=null;
		this._list=null;
		if(!resourceURL){
			resourceURL=UIConfig$1.popupMenu;
			if(!resourceURL)
				throw "UIConfig.popupMenu not defined";
		}
		this._contentPane=UIPackage.createObjectFromURL(resourceURL).asCom;
		this._contentPane.on("display",this,this.__addedToStage);
		this._list=(this._contentPane.getChild("list"));
		this._list.removeChildrenToPool();
		this._list.addRelation(this._contentPane,14);
		this._list.removeRelation(this._contentPane,15);
		this._contentPane.addRelation(this._list,15);
		this._list.on("fui_click_item",this,this.__clickItem);
	}

	__class(PopupMenu,'fairygui.PopupMenu');
	var __proto=PopupMenu.prototype;
	__proto.dispose=function(){
		this._contentPane.dispose();
	}

	__proto.addItem=function(caption,handler){
		var item=this._list.addItemFromPool().asButton;
		item.title=caption;
		item.data=handler;
		item.grayed=false;
		var c=item.getController("checked");
		if(c !=null)
			c.selectedIndex=0;
		return item;
	}

	__proto.addItemAt=function(caption,index,handler){
		var item=this._list.getFromPool().asButton;
		this._list.addChildAt(item,index);
		item.title=caption;
		item.data=handler;
		item.grayed=false;
		var c=item.getController("checked");
		if(c !=null)
			c.selectedIndex=0;
		return item;
	}

	__proto.addSeperator=function(){
		if(UIConfig$1.popupMenu_seperator==null)
			throw "UIConfig.popupMenu_seperator not defined";
		this.list.addItemFromPool(UIConfig$1.popupMenu_seperator);
	}

	__proto.getItemName=function(index){
		var item=this._list.getChildAt(index);
		return item.name;
	}

	__proto.setItemText=function(name,caption){
		var item=this._list.getChild(name).asButton;
		item.title=caption;
	}

	__proto.setItemVisible=function(name,visible){
		var item=this._list.getChild(name).asButton;
		if(item.visible !=visible){
			item.visible=visible;
			this._list.setBoundsChangedFlag();
		}
	}

	__proto.setItemGrayed=function(name,grayed){
		var item=this._list.getChild(name).asButton;
		item.grayed=grayed;
	}

	__proto.setItemCheckable=function(name,checkable){
		var item=this._list.getChild(name).asButton;
		var c=item.getController("checked");
		if(c !=null){
			if(checkable){
				if(c.selectedIndex==0)
					c.selectedIndex=1;
			}
			else
			c.selectedIndex=0;
		}
	}

	__proto.setItemChecked=function(name,checked){
		var item=this._list.getChild(name).asButton;
		var c=item.getController("checked");
		if(c !=null)
			c.selectedIndex=checked?2:1;
	}

	__proto.isItemChecked=function(name){
		var item=this._list.getChild(name).asButton;
		var c=item.getController("checked");
		if(c !=null)
			return c.selectedIndex==2;
		else
		return false;
	}

	__proto.removeItem=function(name){
		var item=this._list.getChild(name);
		if(item !=null){
			var index=this._list.getChildIndex(item);
			this._list.removeChildToPoolAt(index);
			return true;
		}
		else
		return false;
	}

	__proto.clearItems=function(){
		this._list.removeChildrenToPool();
	}

	__proto.show=function(target,downward){
		var r=target !=null?target.root:GRoot.inst;
		r.showPopup(this.contentPane,((target instanceof fairygui.GRoot ))?null:target,downward);
	}

	__proto.__clickItem=function(itemObject){
		Laya.timer.once(100,this,this.__clickItem2,[itemObject]);
	}

	__proto.__clickItem2=function(itemObject){
		if(!((itemObject instanceof fairygui.GButton )))
			return;
		if(itemObject.grayed){
			this._list.selectedIndex=-1;
			return;
		};
		var c=itemObject.asCom.getController("checked");
		if(c !=null && c.selectedIndex !=0){
			if(c.selectedIndex==1)
				c.selectedIndex=2;
			else
			c.selectedIndex=1;
		};
		var r=(this._contentPane.parent);
		r.hidePopup(this.contentPane);
		if(itemObject.data !=null){
			(itemObject.data).run();
		}
	}

	__proto.__addedToStage=function(){
		this._list.selectedIndex=-1;
		this._list.resizeToFit(100000,10);
	}

	__getset(0,__proto,'itemCount',function(){
		return this._list.numChildren;
	});

	__getset(0,__proto,'contentPane',function(){
		return this._contentPane;
	});

	__getset(0,__proto,'list',function(){
		return this._list;
	});

	return PopupMenu;
})()


/**
*Use for GProgressBar.titleType and GSlider.titleType
*/

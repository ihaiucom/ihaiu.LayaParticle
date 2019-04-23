//class fairygui.Controller extends laya.events.EventDispatcher
var Controller=(function(_super){
	function Controller(){
		this._selectedIndex=0;
		this._previousIndex=0;
		this._pageIds=null;
		this._pageNames=null;
		this._actions=null;
		this.name=null;
		this.parent=null;
		this.autoRadioGroupDepth=false;
		this.changing=false;
		Controller.__super.call(this);
		this._pageIds=[];
		this._pageNames=[];
		this._selectedIndex=-1;
		this._previousIndex=-1;
	}

	__class(Controller,'fairygui.Controller',_super);
	var __proto=Controller.prototype;
	__proto.dispose=function(){
		this.offAll();
	}

	//功能和设置selectedIndex一样，但不会触发事件
	__proto.setSelectedIndex=function(value){
		(value===void 0)&& (value=0);
		if (this._selectedIndex !=value){
			if(value > this._pageIds.length-1)
				throw "index out of bounds: "+value;
			this.changing=true;
			this._previousIndex=this._selectedIndex;
			this._selectedIndex=value;
			this.parent.applyController(this);
			this.changing=false;
		}
	}

	//功能和设置selectedPage一样，但不会触发事件
	__proto.setSelectedPage=function(value){
		var i=this._pageNames.indexOf(value);
		if (i==-1)
			i=0;
		this.setSelectedIndex(i);
	}

	__proto.getPageName=function(index){
		(index===void 0)&& (index=0);
		return this._pageNames[index];
	}

	__proto.addPage=function(name){
		(name===void 0)&& (name="");
		this.addPageAt(name,this._pageIds.length);
	}

	__proto.addPageAt=function(name,index){
		(index===void 0)&& (index=0);
		var nid=""+(fairygui.Controller._nextPageId++);
		if (index==this._pageIds.length){
			this._pageIds.push(nid);
			this._pageNames.push(name);
		}
		else {
			this._pageIds.splice(index,0,nid);
			this._pageNames.splice(index,0,name);
		}
	}

	__proto.removePage=function(name){
		var i=this._pageNames.indexOf(name);
		if (i !=-1){
			this._pageIds.splice(i,1);
			this._pageNames.splice(i,1);
			if (this._selectedIndex >=this._pageIds.length)
				this.selectedIndex=this._selectedIndex-1;
			else
			this.parent.applyController(this);
		}
	}

	__proto.removePageAt=function(index){
		(index===void 0)&& (index=0);
		this._pageIds.splice(index,1);
		this._pageNames.splice(index,1);
		if (this._selectedIndex >=this._pageIds.length)
			this.selectedIndex=this._selectedIndex-1;
		else
		this.parent.applyController(this);
	}

	__proto.clearPages=function(){
		this._pageIds.length=0;
		this._pageNames.length=0;
		if (this._selectedIndex !=-1)
			this.selectedIndex=-1;
		else
		this.parent.applyController(this);
	}

	__proto.hasPage=function(aName){
		return this._pageNames.indexOf(aName)!=-1;
	}

	__proto.getPageIndexById=function(aId){
		return this._pageIds.indexOf(aId);
	}

	__proto.getPageIdByName=function(aName){
		var i=this._pageNames.indexOf(aName);
		if(i !=-1)
			return this._pageIds[i];
		else
		return null;
	}

	__proto.getPageNameById=function(aId){
		var i=this._pageIds.indexOf(aId);
		if(i !=-1)
			return this._pageNames[i];
		else
		return null;
	}

	__proto.getPageId=function(index){
		(index===void 0)&& (index=0);
		return this._pageIds[index];
	}

	__proto.runActions=function(){
		if(this._actions){
			var cnt=this._actions.length;
			for(var i=0;i<cnt;i++){
				this._actions[i].run(this,this.previousPageId,this.selectedPageId);
			}
		}
	}

	__proto.setup=function(buffer){
		var beginPos=buffer.pos;
		buffer.seek(beginPos,0);
		this.name=buffer.readS();
		this.autoRadioGroupDepth=buffer.readBool();
		buffer.seek(beginPos,1);
		var i=0;
		var nextPos=0;
		var cnt=buffer.getInt16();
		for (i=0;i < cnt;i++){
			this._pageIds.push(buffer.readS());
			this._pageNames.push(buffer.readS());
		}
		buffer.seek(beginPos,2);
		cnt=buffer.getInt16();
		if (cnt > 0){
			if (this._actions==null)
				this._actions=[];
			for (i=0;i < cnt;i++){
				nextPos=buffer.getInt16();
				nextPos+=buffer.pos;
				var action=ControllerAction.createAction(buffer.readByte());
				action.setup(buffer);
				this._actions.push(action);
				buffer.pos=nextPos;
			}
		}
		if (this.parent !=null && this._pageIds.length > 0)
			this._selectedIndex=0;
		else
		this._selectedIndex=-1;
	}

	__getset(0,__proto,'selectedIndex',function(){
		return this._selectedIndex;
		},function(value){
		if(this._selectedIndex !=value){
			if(value > this._pageIds.length-1)
				throw "index out of bounds: "+value;
			this.changing=true;
			this._previousIndex=this._selectedIndex;
			this._selectedIndex=value;
			this.parent.applyController(this);
			this.event("fui_state_changed");
			this.changing=false;
		}
	});

	__getset(0,__proto,'selectedPage',function(){
		if (this._selectedIndex==-1)
			return null;
		else
		return this._pageNames[this._selectedIndex];
		},function(val){
		var i=this._pageNames.indexOf(val);
		if (i==-1)
			i=0;
		this.selectedIndex=i;
	});

	__getset(0,__proto,'previsousIndex',function(){
		return this._previousIndex;
	});

	__getset(0,__proto,'previousPage',function(){
		if (this._previousIndex==-1)
			return null;
		else
		return this._pageNames[this._previousIndex];
	});

	__getset(0,__proto,'pageCount',function(){
		return this._pageIds.length;
	});

	__getset(0,__proto,'selectedPageId',function(){
		if (this._selectedIndex==-1)
			return null;
		else
		return this._pageIds[this._selectedIndex];
		},function(val){
		var i=this._pageIds.indexOf(val);
		this.selectedIndex=i;
	});

	__getset(0,__proto,'previousPageId',function(){
		if(this._previousIndex==-1)
			return null;
		else
		return this._pageIds[this._previousIndex];
	});

	__getset(0,__proto,'oppositePageId',null,function(val){
		var i=this._pageIds.indexOf(val);
		if(i > 0)
			this.selectedIndex=0;
		else if(this._pageIds.length > 1)
		this.selectedIndex=1;
	});

	Controller._nextPageId=0;
	return Controller;
})(EventDispatcher)



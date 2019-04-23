//class fairygui.DragDropManager
var DragDropManager=(function(){
	function DragDropManager(){
		this._agent=null;
		this._sourceData=null;
		this._agent=new GLoader();
		this._agent.draggable=true;
		this._agent.touchable=false;
		this._agent.setSize(100,100);
		this._agent.setPivot(0.5,0.5,true);
		this._agent.align="center";
		this._agent.verticalAlign="middle";
		this._agent.sortingOrder=1000000;
		this._agent.on("fui_drag_end",this,this.__dragEnd);
	}

	__class(DragDropManager,'fairygui.DragDropManager');
	var __proto=DragDropManager.prototype;
	__proto.startDrag=function(source,icon,sourceData,touchPointID){
		(touchPointID===void 0)&& (touchPointID=-1);
		if(this._agent.parent !=null)
			return;
		this._sourceData=sourceData;
		this._agent.url=icon;
		GRoot.inst.addChild(this._agent);
		var pt=GRoot.inst.globalToLocal(Laya.stage.mouseX,Laya.stage.mouseY);
		this._agent.setXY(pt.x,pt.y);
		this._agent.startDrag(touchPointID);
	}

	__proto.cancel=function(){
		if(this._agent.parent !=null){
			this._agent.stopDrag();
			GRoot.inst.removeChild(this._agent);
			this._sourceData=null;
		}
	}

	__proto.__dragEnd=function(evt){
		if(this._agent.parent==null)
			return;
		GRoot.inst.removeChild(this._agent);
		var sourceData=this._sourceData;
		this._sourceData=null;
		var obj=GObject.cast(evt.target);
		while(obj !=null){
			if(obj.displayObject.hasListener("fui_drop")){
				obj.requestFocus();
				obj.displayObject.event("fui_drop",[sourceData,Events.createEvent("fui_drop",obj.displayObject,evt)]);
				return;
			}
			obj=obj.parent;
		}
	}

	__getset(0,__proto,'dragAgent',function(){
		return this._agent;
	});

	__getset(0,__proto,'dragging',function(){
		return this._agent.parent !=null;
	});

	__getset(1,DragDropManager,'inst',function(){
		if(fairygui.DragDropManager._inst==null)
			fairygui.DragDropManager._inst=new DragDropManager();
		return fairygui.DragDropManager._inst;
	});

	DragDropManager._inst=null;
	return DragDropManager;
})()



//class fairygui.gears.GearColor extends fairygui.gears.GearBase
var GearColor=(function(_super){
	var GearColorValue;
	function GearColor(owner){
		this._storage=null;
		this._default=null;
		GearColor.__super.call(this,owner);
	}

	__class(GearColor,'fairygui.gears.GearColor',_super);
	var __proto=GearColor.prototype;
	__proto.init=function(){
		if(this._owner["strokeColor"]!=undefined)
			this._default=new GearColorValue(this._owner["color"],this._owner["strokeColor"]);
		else
		this._default=new GearColorValue(this._owner["color"],null);
		this._storage={};
	}

	__proto.addStatus=function(pageId,buffer){
		var gv;
		if (pageId==null)
			gv=this._default;
		else {
			gv=new GearColorValue();
			this._storage[pageId]=gv;
		}
		gv.color=buffer.readColorS();
		gv.strokeColor=buffer.readColorS();
	}

	__proto.apply=function(){
		this._owner._gearLocked=true;
		var gv=this._storage[this._controller.selectedPageId];
		if(!gv)
			gv=this._default;
		(this._owner).color=gv.color;
		if(this._owner["strokeColor"]!=undefined && gv.strokeColor!=null)
			this._owner["strokeColor"]=gv.strokeColor;
		this._owner._gearLocked=false;
	}

	__proto.updateState=function(){
		var gv=this._storage[this._controller.selectedPageId];
		if(!gv){
			gv=new GearColorValue(null,null);
			this._storage[this._controller.selectedPageId]=gv;
		}
		gv.color=(this._owner).color;
		if(this._owner["strokeColor"]!=undefined)
			gv.strokeColor=this._owner["strokeColor"];
	}

	GearColor.__init$=function(){
		
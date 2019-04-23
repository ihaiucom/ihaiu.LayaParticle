//class fairygui.action.ChangePageAction extends fairygui.action.ControllerAction
var ChangePageAction=(function(_super){
	function ChangePageAction(){
		this.objectId=null;
		this.controllerName=null;
		this.targetPage=null;
		ChangePageAction.__super.call(this);
	}

	__class(ChangePageAction,'fairygui.action.ChangePageAction',_super);
	var __proto=ChangePageAction.prototype;
	__proto.enter=function(controller){
		if(!this.controllerName)
			return;
		var gcom;
		if(this.objectId)
			gcom=controller.parent.getChildById(this.objectId);
		else
		gcom=controller.parent;
		if(gcom){
			var cc=gcom.getController(this.controllerName);
			if(cc && cc!=controller && !cc.changing)
				cc.selectedPageId=this.targetPage;
		}
	}

	__proto.setup=function(buffer){
		_super.prototype.setup.call(this,buffer);
		this.objectId=buffer.readS();
		this.controllerName=buffer.readS();
		this.targetPage=buffer.readS();
	}

	return ChangePageAction;
})(ControllerAction)



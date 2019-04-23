//class fairygui.action.ControllerAction
var ControllerAction=(function(){
	function ControllerAction(){
		this.fromPage=null;
		this.toPage=null;
	}

	__class(ControllerAction,'fairygui.action.ControllerAction');
	var __proto=ControllerAction.prototype;
	__proto.run=function(controller,prevPage,curPage){
		if((this.fromPage==null || this.fromPage.length==0 || this.fromPage.indexOf(prevPage)!=-1)
			&& (this.toPage==null || this.toPage.length==0 || this.toPage.indexOf(curPage)!=-1))
		this.enter(controller);
		else
		this.leave(controller);
	}

	__proto.enter=function(controller){}
	__proto.leave=function(controller){}
	__proto.setup=function(buffer){
		var cnt=0;
		var i=0;
		cnt=buffer.getInt16();
		this.fromPage=[];
		for (i=0;i < cnt;i++)
		this.fromPage[i]=buffer.readS();
		cnt=buffer.getInt16();
		this.toPage=[];
		for (i=0;i < cnt;i++)
		this.toPage[i]=buffer.readS();
	}

	ControllerAction.createAction=function(type){
		switch(type){
			case 0:
				return new PlayTransitionAction();
			case 1:
				return new ChangePageAction();
			}
		return null;
	}

	return ControllerAction;
})()



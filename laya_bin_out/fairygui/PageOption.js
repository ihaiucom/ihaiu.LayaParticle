//class fairygui.PageOption
var PageOption=(function(){
	function PageOption(){
		this._controller=null;
		this._id=null;
	}

	__class(PageOption,'fairygui.PageOption');
	var __proto=PageOption.prototype;
	__proto.clear=function(){
		this._id=null;
	}

	__getset(0,__proto,'controller',null,function(val){
		this._controller=val;
	});

	__getset(0,__proto,'index',function(){
		if (this._id)
			return this._controller.getPageIndexById(this._id);
		else
		return-1;
		},function(pageIndex){
		this._id=this._controller.getPageId(pageIndex);
	});

	__getset(0,__proto,'name',function(){
		if (this._id)
			return this._controller.getPageNameById(this._id);
		else
		return null;
		},function(pageName){
		this._id=this._controller.getPageIdByName(pageName);
	});

	__getset(0,__proto,'id',function(){
		return this._id;
		},function(id){
		this._id=id;
	});

	return PageOption;
})()


/**
*Use for GComboBox.popupDirection
*/

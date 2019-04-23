//class fairygui.gears.GearBase
var GearBase=(function(){
	function GearBase(owner){
		this._owner=null;
		this._controller=null;
		this._tweenConfig=null;
		this._owner=owner;
	}

	__class(GearBase,'fairygui.gears.GearBase');
	var __proto=GearBase.prototype;
	__proto.setup=function(buffer){
		this._controller=this._owner.parent.getControllerAt(buffer.getInt16());
		this.init();
		var cnt=0;
		var i=0;
		var page;
		if ((this instanceof fairygui.gears.GearDisplay )){
			cnt=buffer.getInt16();
			var pages=[];
			for (i=0;i < cnt;i++)
			pages[i]=buffer.readS();
			(this).pages=pages;
		}
		else{
			cnt=buffer.getInt16();
			for (i=0;i < cnt;i++){
				page=buffer.readS();
				if (page==null)
					continue ;
				this.addStatus(page,buffer);
			}
			if (buffer.readBool())
				this.addStatus(null,buffer);
		}
		if (buffer.readBool()){
			this._tweenConfig=new GearTweenConfig();
			this._tweenConfig.easeType=buffer.readByte();
			this._tweenConfig.duration=buffer.getFloat32();
			this._tweenConfig.delay=buffer.getFloat32();
		}
	}

	__proto.updateFromRelations=function(dx,dy){}
	__proto.addStatus=function(pageId,buffer){}
	__proto.init=function(){}
	__proto.apply=function(){}
	__proto.updateState=function(){}
	__getset(0,__proto,'controller',function(){
		return this._controller;
		},function(val){
		if (val !=this._controller){
			this._controller=val;
			if(this._controller)
				this.init();
		}
	});

	__getset(0,__proto,'tweenConfig',function(){
		if(this._tweenConfig==null)
			this._tweenConfig=new GearTweenConfig();
		return this._tweenConfig;
	});

	GearBase.disableAllTweenEffect=false;
	return GearBase;
})()



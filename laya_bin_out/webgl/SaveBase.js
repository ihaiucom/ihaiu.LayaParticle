//class laya.webgl.canvas.save.SaveBase
var SaveBase=(function(){
	function SaveBase(){
		//this._valueName=null;
		//this._value=null;
		//this._dataObj=null;
		//this._newSubmit=false;
	}

	__class(SaveBase,'laya.webgl.canvas.save.SaveBase');
	var __proto=SaveBase.prototype;
	Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
	__proto.isSaveMark=function(){return false;}
	__proto.restore=function(context){
		this._dataObj[this._valueName]=this._value;
		SaveBase.POOL[SaveBase.POOL._length++]=this;
		this._newSubmit && (context._curSubmit=Submit.RENDERBASE);
	}

	SaveBase._createArray=function(){
		var value=[];
		value._length=0;
		return value;
	}

	SaveBase._init=function(){
		var namemap=SaveBase._namemap={};
		namemap[0x1]="ALPHA";
		namemap[0x2]="fillStyle";
		namemap[0x8]="font";
		namemap[0x100]="lineWidth";
		namemap[0x200]="strokeStyle";
		namemap[0x2000]="_mergeID";
		namemap[0x400]=namemap[0x800]=namemap[0x1000]=[];
		namemap[0x4000]="textBaseline";
		namemap[0x8000]="textAlign";
		namemap[0x10000]="_nBlendType";
		namemap[0x100000]="shader";
		namemap[0x200000]="filters";
		namemap[0x800000]='_colorFiler';
		return namemap;
	}

	SaveBase.save=function(context,type,dataObj,newSubmit){
		if ((context._saveMark._saveuse & type)!==type){
			context._saveMark._saveuse |=type;
			var cache=SaveBase.POOL;
			var o=cache._length > 0 ? cache[--cache._length] :(new SaveBase());
			o._value=dataObj[o._valueName=SaveBase._namemap[type]];
			o._dataObj=dataObj;
			o._newSubmit=newSubmit;
			var _save=context._save;
			_save[_save._length++]=o;
		}
	}

	SaveBase.POOL=laya.webgl.canvas.save.SaveBase._createArray();
	SaveBase._namemap=SaveBase._init();
	return SaveBase;
})()



//class laya.webgl.canvas.save.SaveTranslate
var SaveTranslate=(function(){
	function SaveTranslate(){
		this._mat=new Matrix();
	}

	__class(SaveTranslate,'laya.webgl.canvas.save.SaveTranslate');
	var __proto=SaveTranslate.prototype;
	Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
	__proto.isSaveMark=function(){return false;}
	__proto.restore=function(context){
		this._mat.copyTo(context._curMat);
		SaveTranslate.POOL[SaveTranslate.POOL._length++]=this;
	}

	SaveTranslate.save=function(context){
		var no=SaveTranslate.POOL;
		var o=no._length > 0 ? no[--no._length] :(new SaveTranslate());
		context._curMat.copyTo(o._mat);
		var _save=context._save;
		_save[_save._length++]=o;
	}

	SaveTranslate.POOL=SaveBase._createArray();
	return SaveTranslate;
})()


/**
*...
*@author ww
*/

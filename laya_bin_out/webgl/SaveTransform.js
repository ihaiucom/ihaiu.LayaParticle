//class laya.webgl.canvas.save.SaveTransform
var SaveTransform=(function(){
	function SaveTransform(){
		//this._savematrix=null;
		this._matrix=new Matrix();
	}

	__class(SaveTransform,'laya.webgl.canvas.save.SaveTransform');
	var __proto=SaveTransform.prototype;
	Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
	__proto.isSaveMark=function(){return false;}
	__proto.restore=function(context){
		context._curMat=this._savematrix;
		SaveTransform.POOL[SaveTransform.POOL._length++]=this;
	}

	SaveTransform.save=function(context){
		var _saveMark=context._saveMark;
		if ((_saveMark._saveuse & /*laya.webgl.canvas.save.SaveBase.TYPE_TRANSFORM*/0x800)===/*laya.webgl.canvas.save.SaveBase.TYPE_TRANSFORM*/0x800)return;
		_saveMark._saveuse |=/*laya.webgl.canvas.save.SaveBase.TYPE_TRANSFORM*/0x800;
		var no=SaveTransform.POOL;
		var o=no._length > 0 ? no[--no._length] :(new SaveTransform());
		o._savematrix=context._curMat;
		context._curMat=context._curMat.copyTo(o._matrix);
		var _save=context._save;
		_save[_save._length++]=o;
	}

	SaveTransform.POOL=SaveBase._createArray();
	return SaveTransform;
})()


/**
*...
*@author ww
*/

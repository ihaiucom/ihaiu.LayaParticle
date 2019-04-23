//class laya.webgl.canvas.save.SaveClipRect
var SaveClipRect=(function(){
	function SaveClipRect(){
		this._clipInfoID=-1;
		this._globalClipMatrix=new Matrix();
		this._clipRect=new Rectangle();
	}

	__class(SaveClipRect,'laya.webgl.canvas.save.SaveClipRect');
	var __proto=SaveClipRect.prototype;
	Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
	__proto.isSaveMark=function(){return false;}
	__proto.restore=function(context){
		this._globalClipMatrix.copyTo(context._globalClipMatrix);
		this._clipRect.clone(context._clipRect);
		context._clipInfoID=this._clipInfoID;
		SaveClipRect.POOL[SaveClipRect.POOL._length++]=this;
	}

	SaveClipRect.save=function(context){
		if ((context._saveMark._saveuse & /*laya.webgl.canvas.save.SaveBase.TYPE_CLIPRECT*/0x20000)==/*laya.webgl.canvas.save.SaveBase.TYPE_CLIPRECT*/0x20000)return;
		context._saveMark._saveuse |=/*laya.webgl.canvas.save.SaveBase.TYPE_CLIPRECT*/0x20000;
		var cache=SaveClipRect.POOL;
		var o=cache._length > 0 ? cache[--cache._length] :(new SaveClipRect());
		context._globalClipMatrix.copyTo(o._globalClipMatrix);
		context._clipRect.clone(o._clipRect);
		o._clipInfoID=context._clipInfoID;
		var _save=context._save;
		_save[_save._length++]=o;
	}

	SaveClipRect.POOL=SaveBase._createArray();
	return SaveClipRect;
})()


/**
*...
*@author ww
*/

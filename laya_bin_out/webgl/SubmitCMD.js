//class laya.webgl.submit.SubmitCMD
var SubmitCMD=(function(){
	function SubmitCMD(){
		this.fun=null;
		this._this=null;
		this.args=null;
		this._ref=1;
		this._key=new SubmitKey();
	}

	__class(SubmitCMD,'laya.webgl.submit.SubmitCMD');
	var __proto=SubmitCMD.prototype;
	Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
	__proto.renderSubmit=function(){
		this.fun.apply(this._this,this.args);
		return 1;
	}

	//TODO:coverage
	__proto.getRenderType=function(){
		return 0;
	}

	//TODO:coverage
	__proto.reUse=function(context,pos){
		this._ref++;
		return pos;
	}

	__proto.releaseRender=function(){
		if((--this._ref)<1){
			var pool=SubmitCMD.POOL;
			pool[pool._length++]=this;
		}
	}

	//TODO:coverage
	__proto.clone=function(context,mesh,pos){
		return null;
	}

	SubmitCMD.create=function(args,fun,thisobj){
		var o=SubmitCMD.POOL._length?SubmitCMD.POOL[--SubmitCMD.POOL._length]:new SubmitCMD();
		o.fun=fun;
		o.args=args;
		o._this=thisobj;
		o._ref=1;
		o._key.clear();
		return o;
	}

	SubmitCMD.POOL=(SubmitCMD.POOL=[],SubmitCMD.POOL._length=0,SubmitCMD.POOL);
	return SubmitCMD;
})()


/**
*...
*@author ww
*/

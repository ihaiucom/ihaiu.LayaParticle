//class laya.layagl.ConchGraphicsAdpt
var ConchGraphicsAdpt=(function(){
	function ConchGraphicsAdpt(){
		this._commandEncoder=null;
	}

	__class(ConchGraphicsAdpt,'laya.layagl.ConchGraphicsAdpt');
	var __proto=ConchGraphicsAdpt.prototype;
	//TODO:coverage
	__proto._createData=function(){
		this._commandEncoder=LayaGL.instance.createCommandEncoder(128,64,true);
	}

	//TODO:coverage
	__proto._clearData=function(){
		if (this._commandEncoder)this._commandEncoder.clearEncoding();
	}

	//TODO:coverage
	__proto._destroyData=function(){
		if (this._commandEncoder){
			this._commandEncoder.clearEncoding();
			this._commandEncoder=null;
		}
	}

	ConchGraphicsAdpt.__init__=function(){
		var spP=Graphics["prototype"];
		var mP=ConchGraphicsAdpt["prototype"];
		var funs=[
		"_createData",
		"_clearData",
		"_destroyData"];
		var i=0,len=0;
		len=funs.length;
		var tFunName;
		for (i=0;i < len;i++){
			tFunName=funs[i];
			spP[tFunName]=mP[tFunName];
		}
	}

	return ConchGraphicsAdpt;
})()



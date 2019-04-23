//class laya.webgl.resource.CharInternalTexture
var CharInternalTexture=(function(){
	function CharInternalTexture(par){
		this._par=null;
		this._loaded=true;
		//drawTextureM的条件
		this.bitmap={};
		this.bitmap.id=par.id;
		this._par=par;
	}

	__class(CharInternalTexture,'laya.webgl.resource.CharInternalTexture');
	var __proto=CharInternalTexture.prototype;
	__proto._getSource=function(){
		return this._par._source;
	}

	return CharInternalTexture;
})()


;
/**
*...
*@author James
*/

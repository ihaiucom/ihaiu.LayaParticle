//class laya.webgl.utils.Buffer
var Buffer=(function(){
	function Buffer(){
		//当前gl绑定的indexBuffer
		this._glBuffer=null;
		this._buffer=null;
		//可能为Float32Array、Uint16Array、Uint8Array、ArrayBuffer等。
		this._bufferType=0;
		this._bufferUsage=0;
		this._byteLength=0;
		this._glBuffer=LayaGL.instance.createBuffer()
	}

	__class(Buffer,'laya.webgl.utils.Buffer');
	var __proto=Buffer.prototype;
	/**
	*@private
	*绕过全局状态判断,例如VAO局部状态设置
	*/
	__proto._bindForVAO=function(){}
	//TODO:coverage
	__proto.bind=function(){
		return false;
	}

	/**
	*@private
	*/
	__proto.destroy=function(){
		if (this._glBuffer){
			LayaGL.instance.deleteBuffer(this._glBuffer);
			this._glBuffer=null;
		}
	}

	__getset(0,__proto,'bufferUsage',function(){
		return this._bufferUsage;
	});

	Buffer._bindedVertexBuffer=null;
	Buffer._bindedIndexBuffer=null;
	return Buffer;
})()


/**
*@private
*封装GL命令
*/

//class laya.webgl.utils.IndexBuffer2D extends laya.webgl.utils.Buffer2D
var IndexBuffer2D=(function(_super){
	function IndexBuffer2D(bufferUsage){
		this._uint16Array=null;
		(bufferUsage===void 0)&& (bufferUsage=0x88e4);
		IndexBuffer2D.__super.call(this);
		this._bufferUsage=bufferUsage;
		this._bufferType=/*laya.webgl.WebGLContext.ELEMENT_ARRAY_BUFFER*/0x8893;
		this._buffer=new ArrayBuffer(8);
	}

	__class(IndexBuffer2D,'laya.webgl.utils.IndexBuffer2D',_super);
	var __proto=IndexBuffer2D.prototype;
	__proto._checkArrayUse=function(){
		this._uint16Array && (this._uint16Array=new Uint16Array(this._buffer));
	}

	__proto.getUint16Array=function(){
		return this._uint16Array || (this._uint16Array=new Uint16Array(this._buffer));
	}

	/**
	*@inheritDoc
	*/
	__proto._bindForVAO=function(){
		LayaGL.instance.bindBuffer(/*laya.webgl.WebGLContext.ELEMENT_ARRAY_BUFFER*/0x8893,this._glBuffer);
	}

	/**
	*@inheritDoc
	*/
	__proto.bind=function(){
		if (Buffer._bindedIndexBuffer!==this._glBuffer){
			LayaGL.instance.bindBuffer(/*laya.webgl.WebGLContext.ELEMENT_ARRAY_BUFFER*/0x8893,this._glBuffer);
			Buffer._bindedIndexBuffer=this._glBuffer;
			return true;
		}
		return false;
	}

	__proto.destory=function(){
		this._uint16Array=null;
		this._buffer=null;
	}

	__proto.disposeResource=function(){
		this._disposeResource();
	}

	IndexBuffer2D.create=function(bufferUsage){
		(bufferUsage===void 0)&& (bufferUsage=0x88e4);
		return new IndexBuffer2D(bufferUsage);
	}

	return IndexBuffer2D;
})(Buffer2D)



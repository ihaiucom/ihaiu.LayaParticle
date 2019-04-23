//class laya.webgl.utils.VertexBuffer2D extends laya.webgl.utils.Buffer2D
var VertexBuffer2D=(function(_super){
	function VertexBuffer2D(vertexStride,bufferUsage){
		this._floatArray32=null;
		this._uint32Array=null;
		this._vertexStride=0;
		VertexBuffer2D.__super.call(this);
		this._vertexStride=vertexStride;
		this._bufferUsage=bufferUsage;
		this._bufferType=/*laya.webgl.WebGLContext.ARRAY_BUFFER*/0x8892;
		this._buffer=new ArrayBuffer(8);
		this._floatArray32=new Float32Array(this._buffer);
		this._uint32Array=new Uint32Array(this._buffer);
	}

	__class(VertexBuffer2D,'laya.webgl.utils.VertexBuffer2D',_super);
	var __proto=VertexBuffer2D.prototype;
	__proto.getFloat32Array=function(){
		return this._floatArray32;
	}

	/**
	*在当前位置插入float数组。
	*@param data
	*@param pos
	*/
	__proto.appendArray=function(data){
		var oldoff=this._byteLength >> 2;
		this.setByteLength(this._byteLength+data.length *4);
		var vbdata=this.getFloat32Array();
		vbdata.set(data,oldoff);
		this._upload=true;
	}

	__proto._checkArrayUse=function(){
		this._floatArray32 && (this._floatArray32=new Float32Array(this._buffer));
		this._uint32Array && (this._uint32Array=new Uint32Array(this._buffer));
	}

	//只删除buffer，不disableVertexAttribArray
	__proto.deleteBuffer=function(){
		this._disposeResource();
	}

	/**
	*@inheritDoc
	*/
	__proto._bindForVAO=function(){
		LayaGL.instance.bindBuffer(/*laya.webgl.WebGLContext.ARRAY_BUFFER*/0x8892,this._glBuffer);
	}

	/**
	*@inheritDoc
	*/
	__proto.bind=function(){
		if (Buffer._bindedVertexBuffer!==this._glBuffer){
			LayaGL.instance.bindBuffer(/*laya.webgl.WebGLContext.ARRAY_BUFFER*/0x8892,this._glBuffer);
			Buffer._bindedVertexBuffer=this._glBuffer;
			return true;
		}
		return false;
	}

	__proto.destroy=function(){
		laya.webgl.utils.Buffer.prototype.destroy.call(this);
		this._byteLength=0;
		this._upload=true;
		this._buffer=null;
		this._floatArray32=null;
	}

	__getset(0,__proto,'vertexStride',function(){
		return this._vertexStride;
	});

	VertexBuffer2D.create=function(vertexStride,bufferUsage){
		(bufferUsage===void 0)&& (bufferUsage=0x88e8);
		return new VertexBuffer2D(vertexStride,bufferUsage);
	}

	return VertexBuffer2D;
})(Buffer2D)


/**
*<code>BaseTexture</code> 纹理的父类，抽象类，不允许实例。
*/

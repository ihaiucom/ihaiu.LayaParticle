/**
*<code>IndexBuffer3D</code> 类用于创建索引缓冲。
*/
//class laya.d3.graphics.IndexBuffer3D extends laya.webgl.utils.Buffer
var IndexBuffer3D=(function(_super){
	function IndexBuffer3D(indexType,indexCount,bufferUsage,canRead){
		/**@private */
		this._indexType=null;
		/**@private */
		this._indexTypeByteCount=0;
		/**@private */
		this._indexCount=0;
		/**@private */
		this._canRead=false;
		(bufferUsage===void 0)&& (bufferUsage=0x88E4);
		(canRead===void 0)&& (canRead=false);
		IndexBuffer3D.__super.call(this);
		this._indexType=indexType;
		this._indexCount=indexCount;
		this._bufferUsage=bufferUsage;
		this._bufferType=/*laya.webgl.WebGLContext.ELEMENT_ARRAY_BUFFER*/0x8893;
		this._canRead=canRead;
		var byteLength=0;
		if (indexType==/*CLASS CONST:laya.d3.graphics.IndexBuffer3D.INDEXTYPE_USHORT*/"ushort")
			this._indexTypeByteCount=2;
		else if (indexType==/*CLASS CONST:laya.d3.graphics.IndexBuffer3D.INDEXTYPE_UBYTE*/"ubyte")
		this._indexTypeByteCount=1;
		else
		throw new Error("unidentification index type.");
		byteLength=this._indexTypeByteCount *indexCount;
		this._byteLength=byteLength;
		var curBufSta=BufferStateBase._curBindedBufferState;
		if (curBufSta){
			if (curBufSta._bindedIndexBuffer===this){
				LayaGL.instance.bufferData(this._bufferType,byteLength,this._bufferUsage);
				}else {
				curBufSta.unBind();
				this.bind();
				LayaGL.instance.bufferData(this._bufferType,byteLength,this._bufferUsage);
				curBufSta.bind();
			}
			}else {
			this.bind();
			LayaGL.instance.bufferData(this._bufferType,byteLength,this._bufferUsage);
		}
		if (canRead){
			if (indexType==/*CLASS CONST:laya.d3.graphics.IndexBuffer3D.INDEXTYPE_USHORT*/"ushort")
				this._buffer=new Uint16Array(indexCount);
			else if (indexType==/*CLASS CONST:laya.d3.graphics.IndexBuffer3D.INDEXTYPE_UBYTE*/"ubyte")
			this._buffer=new Uint8Array(indexCount);
		}
	}

	__class(IndexBuffer3D,'laya.d3.graphics.IndexBuffer3D',_super);
	var __proto=IndexBuffer3D.prototype;
	/**
	*@inheritDoc
	*/
	__proto._bindForVAO=function(){
		if (BufferStateBase._curBindedBufferState){
			LayaGL.instance.bindBuffer(/*laya.webgl.WebGLContext.ELEMENT_ARRAY_BUFFER*/0x8893,this._glBuffer);
			}else {
			throw "IndexBuffer3D: must bind current BufferState.";
		}
	}

	/**
	*@inheritDoc
	*/
	__proto.bind=function(){
		if (BufferStateBase._curBindedBufferState){
			throw "IndexBuffer3D: must unbind current BufferState.";
			}else {
			if (Buffer._bindedIndexBuffer!==this._glBuffer){
				LayaGL.instance.bindBuffer(/*laya.webgl.WebGLContext.ELEMENT_ARRAY_BUFFER*/0x8893,this._glBuffer);
				Buffer._bindedIndexBuffer=this._glBuffer;
				return true;
				}else {
				return false;
			}
		}
	}

	/**
	*设置数据。
	*@param data 索引数据。
	*@param bufferOffset 索引缓冲中的偏移。
	*@param dataStartIndex 索引数据的偏移。
	*@param dataCount 索引数据的数量。
	*/
	__proto.setData=function(data,bufferOffset,dataStartIndex,dataCount){
		(bufferOffset===void 0)&& (bufferOffset=0);
		(dataStartIndex===void 0)&& (dataStartIndex=0);
		(dataCount===void 0)&& (dataCount=4294967295);
		var byteCount=0;
		if (this._indexType==/*CLASS CONST:laya.d3.graphics.IndexBuffer3D.INDEXTYPE_USHORT*/"ushort"){
			byteCount=2;
			if (dataStartIndex!==0 || dataCount!==4294967295)
				data=new Uint16Array(data.buffer,dataStartIndex *byteCount,dataCount);
			}else if (this._indexType==/*CLASS CONST:laya.d3.graphics.IndexBuffer3D.INDEXTYPE_UBYTE*/"ubyte"){
			byteCount=1;
			if (dataStartIndex!==0 || dataCount!==4294967295)
				data=new Uint8Array(data.buffer,dataStartIndex *byteCount,dataCount);
		};
		var curBufSta=BufferStateBase._curBindedBufferState;
		if (curBufSta){
			if (curBufSta._bindedIndexBuffer===this){
				LayaGL.instance.bufferSubData(this._bufferType,bufferOffset *byteCount,data);
				}else {
				curBufSta.unBind();
				this.bind();
				LayaGL.instance.bufferSubData(this._bufferType,bufferOffset *byteCount,data);
				curBufSta.bind();
			}
			}else {
			this.bind();
			LayaGL.instance.bufferSubData(this._bufferType,bufferOffset *byteCount,data);
		}
		if (this._canRead){
			if (bufferOffset!==0 || dataStartIndex!==0 || dataCount!==4294967295){
				var maxLength=this._buffer.length-bufferOffset;
				if (dataCount > maxLength)
					dataCount=maxLength;
				for (var i=0;i < dataCount;i++)
				this._buffer[bufferOffset+i]=data[i];
				}else {
				this._buffer=data;
			}
		}
	}

	/**
	*获取索引数据。
	*@return 索引数据。
	*/
	__proto.getData=function(){
		if (this._canRead)
			return this._buffer;
		else
		throw new Error("Can't read data from VertexBuffer with only write flag!");
	}

	/**
	*@inheritDoc
	*/
	__proto.destroy=function(){
		_super.prototype.destroy.call(this);
		this._buffer=null;
	}

	/**
	*获取索引类型。
	*@return 索引类型。
	*/
	__getset(0,__proto,'indexType',function(){
		return this._indexType;
	});

	/**
	*获取索引类型字节数量。
	*@return 索引类型字节数量。
	*/
	__getset(0,__proto,'indexTypeByteCount',function(){
		return this._indexTypeByteCount;
	});

	/**
	*获取索引个数。
	*@return 索引个数。
	*/
	__getset(0,__proto,'indexCount',function(){
		return this._indexCount;
	});

	/**
	*获取是否可读。
	*@return 是否可读。
	*/
	__getset(0,__proto,'canRead',function(){
		return this._canRead;
	});

	IndexBuffer3D.INDEXTYPE_UBYTE="ubyte";
	IndexBuffer3D.INDEXTYPE_USHORT="ushort";
	return IndexBuffer3D;
})(Buffer)


/**

*/
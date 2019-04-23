/**
*<code>VertexBuffer3D</code> 类用于创建顶点缓冲。
*/
//class laya.d3.graphics.VertexBuffer3D extends laya.webgl.utils.Buffer
var VertexBuffer3D=(function(_super){
	function VertexBuffer3D(byteLength,bufferUsage,canRead,dateType){
		/**@private */
		this._vertexCount=0;
		/**@private */
		this._canRead=false;
		/**@private */
		this._dataType=0;
		/**@private */
		this._vertexDeclaration=null;
		(canRead===void 0)&& (canRead=false);
		(dateType===void 0)&& (dateType=0);
		VertexBuffer3D.__super.call(this);
		this._vertexCount=-1;
		this._bufferUsage=bufferUsage;
		this._bufferType=/*laya.webgl.WebGLContext.ARRAY_BUFFER*/0x8892;
		this._canRead=canRead;
		this._dataType=dateType;
		this._byteLength=byteLength;
		this.bind();
		LayaGL.instance.bufferData(this._bufferType,this._byteLength,this._bufferUsage);
		if (canRead){
			switch (dateType){
				case 0:
					this._buffer=new Float32Array(byteLength / 4);
					break ;
				case 1:
					this._buffer=new Uint8Array(byteLength);
					break ;
				}
		}
	}

	__class(VertexBuffer3D,'laya.d3.graphics.VertexBuffer3D',_super);
	var __proto=VertexBuffer3D.prototype;
	/**
	*@inheritDoc
	*/
	__proto.bind=function(){
		if (Buffer._bindedVertexBuffer!==this._glBuffer){
			LayaGL.instance.bindBuffer(/*laya.webgl.WebGLContext.ARRAY_BUFFER*/0x8892,this._glBuffer);
			Buffer._bindedVertexBuffer=this._glBuffer;
			return true;
			}else {
			return false;
		}
	}

	/**
	*设置数据。
	*@param data 顶点数据。
	*@param bufferOffset 顶点缓冲中的偏移。
	*@param dataStartIndex 顶点数据的偏移。
	*@param dataCount 顶点数据的数量。
	*/
	__proto.setData=function(data,bufferOffset,dataStartIndex,dataCount){
		(bufferOffset===void 0)&& (bufferOffset=0);
		(dataStartIndex===void 0)&& (dataStartIndex=0);
		(dataCount===void 0)&& (dataCount=4294967295);
		this.bind();
		var needSubData=dataStartIndex!==0 || dataCount!==4294967295;
		if (needSubData){
			switch (this._dataType){
				case 0:
					data=new Float32Array(data.buffer,dataStartIndex *4,dataCount);
					break ;
				case 1:
					data=new Uint8Array(data.buffer,dataStartIndex,dataCount);
					break ;
				}
		}
		switch (this._dataType){
			case 0:
				LayaGL.instance.bufferSubData(this._bufferType,bufferOffset *4,data);
				break ;
			case 1:
				LayaGL.instance.bufferSubData(this._bufferType,bufferOffset,data);
				break ;
			}
		if (this._canRead)
			this._buffer.set(data,bufferOffset);
	}

	/**
	*获取顶点数据。
	*@return 顶点数据。
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
		this._vertexDeclaration=null;
	}

	/**
	*获取顶点声明。
	*/
	/**
	*获取顶点声明。
	*/
	__getset(0,__proto,'vertexDeclaration',function(){
		return this._vertexDeclaration;
		},function(value){
		if (this._vertexDeclaration!==value){
			this._vertexDeclaration=value;
			this._vertexCount=value ? this._byteLength / value.vertexStride :-1;
		}
	});

	/**
	*获取顶点个数。
	*@return 顶点个数。
	*/
	__getset(0,__proto,'vertexCount',function(){
		return this._vertexCount;
	});

	/**
	*获取是否可读。
	*@return 是否可读。
	*/
	__getset(0,__proto,'canRead',function(){
		return this._canRead;
	});

	VertexBuffer3D.DATATYPE_FLOAT32ARRAY=0;
	VertexBuffer3D.DATATYPE_UINT8ARRAY=1;
	return VertexBuffer3D;
})(Buffer)


/**

*/
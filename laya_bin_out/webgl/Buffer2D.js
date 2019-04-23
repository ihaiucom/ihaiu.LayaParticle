//class laya.webgl.utils.Buffer2D extends laya.webgl.utils.Buffer
var Buffer2D=(function(_super){
	function Buffer2D(){
		this._maxsize=0;
		this._upload=true;
		this._uploadSize=0;
		this._bufferSize=0;
		this._u8Array=null;
		Buffer2D.__super.call(this);
	}

	__class(Buffer2D,'laya.webgl.utils.Buffer2D',_super);
	var __proto=Buffer2D.prototype;
	__proto.setByteLength=function(value){
		if (this._byteLength!==value){
			value <=this._bufferSize || (this._resizeBuffer(value *2+256,true));
			this._byteLength=value;
		}
	}

	/**
	*在当前的基础上需要多大空间，单位是byte
	*@param sz
	*@return 增加大小之前的写位置。单位是byte
	*/
	__proto.needSize=function(sz){
		var old=this._byteLength;
		if (sz){
			var needsz=this._byteLength+sz;
			needsz <=this._bufferSize || (this._resizeBuffer(needsz << 1,true));
			this._byteLength=needsz;
		}
		return old;
	}

	__proto._bufferData=function(){
		this._maxsize=Math.max(this._maxsize,this._byteLength);
		if (Stat.loopCount % 30==0){
			if (this._buffer.byteLength > (this._maxsize+64)){
				this._buffer=this._buffer.slice(0,this._maxsize+64);
				this._bufferSize=this._buffer.byteLength;
				this._checkArrayUse();
			}
			this._maxsize=this._byteLength;
		}
		if (this._uploadSize < this._buffer.byteLength){
			this._uploadSize=this._buffer.byteLength;
			LayaGL.instance.bufferData(this._bufferType,this._uploadSize,this._bufferUsage);
		}
		LayaGL.instance.bufferSubData(this._bufferType,0,this._buffer);
	}

	//TODO:coverage
	__proto._bufferSubData=function(offset,dataStart,dataLength){
		(offset===void 0)&& (offset=0);
		(dataStart===void 0)&& (dataStart=0);
		(dataLength===void 0)&& (dataLength=0);
		this._maxsize=Math.max(this._maxsize,this._byteLength);
		if (Stat.loopCount % 30==0){
			if (this._buffer.byteLength > (this._maxsize+64)){
				this._buffer=this._buffer.slice(0,this._maxsize+64);
				this._bufferSize=this._buffer.byteLength;
				this._checkArrayUse();
			}
			this._maxsize=this._byteLength;
		}
		if (this._uploadSize < this._buffer.byteLength){
			this._uploadSize=this._buffer.byteLength;
			LayaGL.instance.bufferData(this._bufferType,this._uploadSize,this._bufferUsage);
		}
		if (dataStart || dataLength){
			var subBuffer=this._buffer.slice(dataStart,dataLength);
			LayaGL.instance.bufferSubData(this._bufferType,offset,subBuffer);
			}else {
			LayaGL.instance.bufferSubData(this._bufferType,offset,this._buffer);
		}
	}

	/**
	*buffer重新分配了，继承类根据需要做相应的处理。
	*/
	__proto._checkArrayUse=function(){}
	/**
	*给vao使用的 _bind_upload函数。不要与已经绑定的判断是否相同
	*@return
	*/
	__proto._bind_uploadForVAO=function(){
		if (!this._upload)
			return false;
		this._upload=false;
		this._bindForVAO();
		this._bufferData();
		return true;
	}

	__proto._bind_upload=function(){
		if (!this._upload)
			return false;
		this._upload=false;
		this.bind();
		this._bufferData();
		return true;
	}

	//TODO:coverage
	__proto._bind_subUpload=function(offset,dataStart,dataLength){
		(offset===void 0)&& (offset=0);
		(dataStart===void 0)&& (dataStart=0);
		(dataLength===void 0)&& (dataLength=0);
		if (!this._upload)
			return false;
		this._upload=false;
		this.bind();
		this._bufferSubData(offset,dataStart,dataLength);
		return true;
	}

	/**
	*重新分配buffer大小，如果nsz比原来的小则什么都不做。
	*@param nsz buffer大小，单位是byte。
	*@param copy 是否拷贝原来的buffer的数据。
	*@return
	*/
	__proto._resizeBuffer=function(nsz,copy){
		if (nsz < this._buffer.byteLength)
			return this;
		if (copy && this._buffer && this._buffer.byteLength > 0){
			var newbuffer=new ArrayBuffer(nsz);
			var oldU8Arr=(this._u8Array && this._u8Array.buffer==this._buffer)?this._u8Array :new Uint8Array(this._buffer);
			this._u8Array=new Uint8Array(newbuffer);
			this._u8Array.set(oldU8Arr,0);
			this._buffer=newbuffer;
			}else{
			this._buffer=new ArrayBuffer(nsz);
		}
		this._checkArrayUse();
		this._upload=true;
		this._bufferSize=this._buffer.byteLength;
		return this;
	}

	__proto.append=function(data){
		this._upload=true;
		var byteLen=0,n;
		byteLen=data.byteLength;
		if ((data instanceof Uint8Array)){
			this._resizeBuffer(this._byteLength+byteLen,true);
			n=new Uint8Array(this._buffer,this._byteLength);
			}else if ((data instanceof Uint16Array)){
			this._resizeBuffer(this._byteLength+byteLen,true);
			n=new Uint16Array(this._buffer,this._byteLength);
			}else if ((data instanceof Float32Array)){
			this._resizeBuffer(this._byteLength+byteLen,true);
			n=new Float32Array(this._buffer,this._byteLength);
		}
		n.set(data,0);
		this._byteLength+=byteLen;
		this._checkArrayUse();
	}

	//TODO:coverage
	__proto.appendU16Array=function(data,len){
		this._resizeBuffer(this._byteLength+len*2,true);
		var u=new Uint16Array(this._buffer,this._byteLength,len);
		for (var i=0;i < len;i++){
			u[i]=data[i];
		}
		this._byteLength+=len *2;
		this._checkArrayUse();
	}

	//TODO:coverage
	__proto.appendEx=function(data,type){
		this._upload=true;
		var byteLen=0,n;
		byteLen=data.byteLength;
		this._resizeBuffer(this._byteLength+byteLen,true);
		n=new type(this._buffer,this._byteLength);
		n.set(data,0);
		this._byteLength+=byteLen;
		this._checkArrayUse();
	}

	//TODO:coverage
	__proto.appendEx2=function(data,type,dataLen,perDataLen){
		(perDataLen===void 0)&& (perDataLen=1);
		this._upload=true;
		var byteLen=0,n;
		byteLen=dataLen*perDataLen;
		this._resizeBuffer(this._byteLength+byteLen,true);
		n=new type(this._buffer,this._byteLength);
		var i=0;
		for (i=0;i < dataLen;i++){
			n[i]=data[i];
		}
		this._byteLength+=byteLen;
		this._checkArrayUse();
	}

	//TODO:coverage
	__proto.getBuffer=function(){
		return this._buffer;
	}

	__proto.setNeedUpload=function(){
		this._upload=true;
	}

	//TODO:coverage
	__proto.getNeedUpload=function(){
		return this._upload;
	}

	//TODO:coverage
	__proto.upload=function(){
		var scuess=this._bind_upload();
		LayaGL.instance.bindBuffer(this._bufferType,null);
		if(this._bufferType==/*laya.webgl.WebGLContext.ARRAY_BUFFER*/0x8892)Buffer._bindedVertexBuffer=null;
		if(this._bufferType==/*laya.webgl.WebGLContext.ELEMENT_ARRAY_BUFFER*/0x8893)Buffer._bindedIndexBuffer=null;
		BaseShader.activeShader=null
		return scuess;
	}

	//TODO:coverage
	__proto.subUpload=function(offset,dataStart,dataLength){
		(offset===void 0)&& (offset=0);
		(dataStart===void 0)&& (dataStart=0);
		(dataLength===void 0)&& (dataLength=0);
		var scuess=this._bind_subUpload();
		LayaGL.instance.bindBuffer(this._bufferType,null);
		if(this._bufferType==/*laya.webgl.WebGLContext.ARRAY_BUFFER*/0x8892)Buffer._bindedVertexBuffer=null;
		if(this._bufferType==/*laya.webgl.WebGLContext.ELEMENT_ARRAY_BUFFER*/0x8893)Buffer._bindedIndexBuffer=null;
		BaseShader.activeShader=null
		return scuess;
	}

	__proto._disposeResource=function(){
		this._upload=true;
		this._uploadSize=0;
	}

	/**
	*清理数据。保留ArrayBuffer
	*/
	__proto.clear=function(){
		this._byteLength=0;
		this._upload=true;
	}

	//反正常常要拷贝老的数据，所以保留这个可以提高效率
	__getset(0,__proto,'bufferLength',function(){
		return this._buffer.byteLength;
	});

	__getset(0,__proto,'byteLength',null,function(value){
		this.setByteLength(value);
	});

	Buffer2D.__int__=function(gl){}
	Buffer2D.FLOAT32=4;
	Buffer2D.SHORT=2;
	return Buffer2D;
})(Buffer)



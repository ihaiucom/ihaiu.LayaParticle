//class laya.webgl.BufferStateBase
var BufferStateBase=(function(){
	function BufferStateBase(){
		/**@private [只读]*/
		this._nativeVertexArrayObject=null;
		/**@private [只读]*/
		this._bindedIndexBuffer=null;
		this._nativeVertexArrayObject=LayaGL.instance.createVertexArray();
	}

	__class(BufferStateBase,'laya.webgl.BufferStateBase');
	var __proto=BufferStateBase.prototype;
	/**
	*@private
	*/
	__proto.bind=function(){
		if (BufferStateBase._curBindedBufferState!==this){
			LayaGL.instance.bindVertexArray(this._nativeVertexArrayObject);
			BufferStateBase._curBindedBufferState=this;
		}
	}

	/**
	*@private
	*/
	__proto.unBind=function(){
		if (BufferStateBase._curBindedBufferState===this){
			LayaGL.instance.bindVertexArray(null);
			BufferStateBase._curBindedBufferState=null;
			}else {
			throw "BufferState: must call bind() function first.";
		}
	}

	/**
	*@private
	*/
	__proto.bindForNative=function(){
		LayaGL.instance.bindVertexArray(this._nativeVertexArrayObject);
		BufferStateBase._curBindedBufferState=this;
	}

	/**
	*@private
	*/
	__proto.unBindForNative=function(){
		LayaGL.instance.bindVertexArray(null);
		BufferStateBase._curBindedBufferState=null;
	}

	/**
	*@private
	*/
	__proto.destroy=function(){
		LayaGL.instance.deleteVertexArray(this._nativeVertexArrayObject);
	}

	BufferStateBase._curBindedBufferState=null;
	return BufferStateBase;
})()


/**
*...
*@author ww
*/

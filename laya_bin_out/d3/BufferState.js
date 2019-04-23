/**
*<code>BufferState</code> 类用于实现渲染所需的Buffer状态集合。
*/
//class laya.d3.core.BufferState extends laya.webgl.BufferStateBase
var BufferState=(function(_super){
	/**
	*创建一个 <code>BufferState</code> 实例。
	*/
	function BufferState(){
		BufferState.__super.call(this);
	}

	__class(BufferState,'laya.d3.core.BufferState',_super);
	var __proto=BufferState.prototype;
	/**
	*@private
	*vertexBuffer的vertexDeclaration不能为空,该函数比较消耗性能，建议初始化时使用。
	*/
	__proto.applyVertexBuffer=function(vertexBuffer){
		if (BufferStateBase._curBindedBufferState===this){
			var gl=LayaGL.instance;
			var verDec=vertexBuffer.vertexDeclaration;
			var valueData=null;
			if (Render.isConchApp)
				valueData=verDec._shaderValues._nativeArray;
			else
			valueData=verDec._shaderValues._data;
			vertexBuffer.bind();
			for (var k in valueData){
				var loc=parseInt(k);
				var attribute=valueData[k];
				gl.enableVertexAttribArray(loc);
				gl.vertexAttribPointer(loc,attribute[0],attribute[1],!!attribute[2],attribute[3],attribute[4]);
			}
			}else {
			throw "BufferState: must call bind() function first.";
		}
	}

	/**
	*@private
	*vertexBuffers中的vertexDeclaration不能为空,该函数比较消耗性能，建议初始化时使用。
	*/
	__proto.applyVertexBuffers=function(vertexBuffers){
		if (BufferStateBase._curBindedBufferState===this){
			var gl=LayaGL.instance;
			for (var i=0,n=vertexBuffers.length;i < n;i++){
				var verBuf=vertexBuffers[i];
				var verDec=verBuf.vertexDeclaration;
				var valueData=null;
				if (Render.isConchApp)
					valueData=verDec._shaderValues._nativeArray;
				else
				valueData=verDec._shaderValues._data;
				verBuf.bind();
				for (var k in valueData){
					var loc=parseInt(k);
					var attribute=valueData[k];
					gl.enableVertexAttribArray(loc);
					gl.vertexAttribPointer(loc,attribute[0],attribute[1],!!attribute[2],attribute[3],attribute[4]);
				}
			}
			}else {
			throw "BufferState: must call bind() function first.";
		}
	}

	/**
	*@private
	*/
	__proto.applyIndexBuffer=function(indexBuffer){
		if (BufferStateBase._curBindedBufferState===this){
			if (this._bindedIndexBuffer!==indexBuffer){
				indexBuffer._bindForVAO();
				this._bindedIndexBuffer=indexBuffer;
			}
			}else {
			throw "BufferState: must call bind() function first.";
		}
	}

	return BufferState;
})(BufferStateBase)


/**

*/
/**
*<code>VertexDeclaration</code> 类用于生成顶点声明。
*/
//class laya.d3.graphics.VertexDeclaration
var VertexDeclaration=(function(){
	function VertexDeclaration(vertexStride,vertexElements){
		/**@private */
		this._id=0;
		/**@private */
		this._vertexStride=0;
		/**@private */
		this._vertexElementsDic=null;
		/**@private */
		this._shaderValues=null;
		/**@private */
		this._defineDatas=null;
		/**@private [只读]*/
		this.vertexElements=null;
		this._id=++VertexDeclaration._uniqueIDCounter;
		this._defineDatas=new DefineDatas();
		this._vertexElementsDic={};
		this._vertexStride=vertexStride;
		this.vertexElements=vertexElements;
		var count=vertexElements.length;
		this._shaderValues=new ShaderData(null);
		for (var j=0;j < count;j++){
			var vertexElement=vertexElements[j];
			var name=vertexElement.elementUsage;
			this._vertexElementsDic[name]=vertexElement;
			var value=new Int32Array(5);
			var elmentInfo=VertexElementFormat.getElementInfos(vertexElement.elementFormat);
			value[0]=elmentInfo[0];
			value[1]=elmentInfo[1];
			value[2]=elmentInfo[2];
			value[3]=this._vertexStride;
			value[4]=vertexElement.offset;
			this._shaderValues.setAttribute(name,value);
		}
	}

	__class(VertexDeclaration,'laya.d3.graphics.VertexDeclaration');
	var __proto=VertexDeclaration.prototype;
	/**
	*@private
	*/
	__proto.getVertexElementByUsage=function(usage){
		return this._vertexElementsDic[usage];
	}

	/**
	*@private
	*/
	__proto.unBinding=function(){}
	/**
	*获取唯一标识ID(通常用于优化或识别)。
	*@return 唯一标识ID
	*/
	__getset(0,__proto,'id',function(){
		return this._id;
	});

	/**
	*@private
	*/
	__getset(0,__proto,'vertexStride',function(){
		return this._vertexStride;
	});

	VertexDeclaration._uniqueIDCounter=1;
	return VertexDeclaration;
})()


/**
*@private

*/
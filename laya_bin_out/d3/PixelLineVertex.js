/**
*<code>/**
*<code>DefineDatas</code> 类用于创建宏定义数据。
*/
//class laya.d3.shader.DefineDatas
var DefineDatas=(function(){
	function DefineDatas(){
		/**@private [只读]*/
		//this.value=0;
		this.value=0;
	}

	__class(DefineDatas,'laya.d3.shader.DefineDatas');
	var __proto=DefineDatas.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*增加Shader宏定义。
	*@param value 宏定义。
	*/
	__proto.add=function(define){
		this.value |=define;
	}

	/**
	*移除Shader宏定义。
	*@param value 宏定义。
	*/
	__proto.remove=function(define){
		this.value &=~define;
	}

	/**
	*是否包含Shader宏定义。
	*@param value 宏定义。
	*/
	__proto.has=function(define){
		return (this.value & define)> 0;
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destDefineData=destObject;
		destDefineData.value=this.value;
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var dest=/*__JS__ */new this.constructor();
		this.cloneTo(dest);
		return dest;
	}

	return DefineDatas;
})()


/**
*...
*@author
*/
//class laya.d3.core.pixelLine.PixelLineVertex
var PixelLineVertex=(function(){
	function PixelLineVertex(){}
	__class(PixelLineVertex,'laya.d3.core.pixelLine.PixelLineVertex');
	var __proto=PixelLineVertex.prototype;
	__getset(0,__proto,'vertexDeclaration',function(){
		return PixelLineVertex._vertexDeclaration;
	});

	__getset(1,PixelLineVertex,'vertexDeclaration',function(){
		return PixelLineVertex._vertexDeclaration;
	});

	__static(PixelLineVertex,
	['_vertexDeclaration',function(){return this._vertexDeclaration=new VertexDeclaration(28,
		[new VertexElement(0,/*laya.d3.graphics.VertexElementFormat.Vector3*/"vector3",/*laya.d3.graphics.Vertex.VertexMesh.MESH_POSITION0*/0),
		new VertexElement(12,/*laya.d3.graphics.VertexElementFormat.Vector4*/"vector4",/*laya.d3.graphics.Vertex.VertexMesh.MESH_COLOR0*/1)]);}
	]);
	return PixelLineVertex;
})()


/**

*/
*/
/**
*<code>SkyBox</code> 类用于创建天空盒。
*/
//class laya.d3.resource.models.SkyBox extends laya.d3.resource.models.SkyMesh
var SkyBox=(function(_super){
	/**
	*创建一个 <code>SkyBox</code> 实例。
	*/
	function SkyBox(){
		SkyBox.__super.call(this);
		var halfHeight=0.5;
		var halfWidth=0.5;
		var halfDepth=0.5;
		var vertices=new Float32Array([-halfDepth,halfHeight,-halfWidth,halfDepth,halfHeight,-halfWidth,halfDepth,halfHeight,halfWidth,-halfDepth,halfHeight,halfWidth,
		-halfDepth,-halfHeight,-halfWidth,halfDepth,-halfHeight,-halfWidth,halfDepth,-halfHeight,halfWidth,-halfDepth,-halfHeight,halfWidth]);
		var indices=new Uint8Array([0,1,2,2,3,0,
		4,7,6,6,5,4,
		0,3,7,7,4,0,
		1,5,6,6,2,1,
		3,2,6,6,7,3,
		0,4,5,5,1,0]);
		var verDec=VertexMesh.getVertexDeclaration("POSITION");
		this._vertexBuffer=new VertexBuffer3D(verDec.vertexStride *8,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4,false);
		this._vertexBuffer.vertexDeclaration=verDec;
		this._indexBuffer=new IndexBuffer3D(/*laya.d3.graphics.IndexBuffer3D.INDEXTYPE_UBYTE*/"ubyte",36,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4,false);
		this._vertexBuffer.setData(vertices);
		this._indexBuffer.setData(indices);
		var bufferState=new BufferState();
		bufferState.bind();
		bufferState.applyVertexBuffer(this._vertexBuffer);
		bufferState.applyIndexBuffer(this._indexBuffer);
		bufferState.unBind();
		this._bufferState=bufferState;
	}

	__class(SkyBox,'laya.d3.resource.models.SkyBox',_super);
	var __proto=SkyBox.prototype;
	/**
	*@inheritDoc
	*/
	__proto._render=function(state){
		LayaGL.instance.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,36,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,0);
		Stat.trianglesFaces+=12;
		Stat.renderBatch++;
	}

	SkyBox.__init__=function(){
		SkyBox.instance=new SkyBox();
	}

	SkyBox.instance=null;
	return SkyBox;
})(SkyMesh)


/**

*/
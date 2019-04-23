/**
*<code>VertexPositionTerrain</code> 类用于创建位置、法线、纹理1、纹理2顶点结构。
*/
//class laya.d3.graphics.Vertex.VertexPositionTerrain
var VertexPositionTerrain=(function(){
	function VertexPositionTerrain(position,normal,textureCoord0,textureCoord1){
		this._position=null;
		this._normal=null;
		this._textureCoord0=null;
		this._textureCoord1=null;
		this._position=position;
		this._normal=normal;
		this._textureCoord0=textureCoord0;
		this._textureCoord1=textureCoord1;
	}

	__class(VertexPositionTerrain,'laya.d3.graphics.Vertex.VertexPositionTerrain');
	var __proto=VertexPositionTerrain.prototype;
	Laya.imps(__proto,{"laya.d3.graphics.IVertex":true})
	__getset(0,__proto,'normal',function(){
		return this._normal;
	});

	__getset(0,__proto,'position',function(){
		return this._position;
	});

	__getset(0,__proto,'textureCoord0',function(){
		return this._textureCoord0;
	});

	__getset(0,__proto,'textureCoord1',function(){
		return this._textureCoord1;
	});

	__getset(0,__proto,'vertexDeclaration',function(){
		return VertexPositionTerrain._vertexDeclaration;
	});

	__getset(1,VertexPositionTerrain,'vertexDeclaration',function(){
		return VertexPositionTerrain._vertexDeclaration;
	});

	VertexPositionTerrain.TERRAIN_POSITION0=0;
	VertexPositionTerrain.TERRAIN_NORMAL0=1;
	VertexPositionTerrain.TERRAIN_TEXTURECOORDINATE0=2;
	VertexPositionTerrain.TERRAIN_TEXTURECOORDINATE1=3;
	__static(VertexPositionTerrain,
	['_vertexDeclaration',function(){return this._vertexDeclaration=new VertexDeclaration(40,[
		new VertexElement(0,/*laya.d3.graphics.VertexElementFormat.Vector3*/"vector3",/*CLASS CONST:laya.d3.graphics.Vertex.VertexPositionTerrain.TERRAIN_POSITION0*/0),
		new VertexElement(12,/*laya.d3.graphics.VertexElementFormat.Vector3*/"vector3",/*CLASS CONST:laya.d3.graphics.Vertex.VertexPositionTerrain.TERRAIN_NORMAL0*/1),
		new VertexElement(24,/*laya.d3.graphics.VertexElementFormat.Vector2*/"vector2",/*CLASS CONST:laya.d3.graphics.Vertex.VertexPositionTerrain.TERRAIN_TEXTURECOORDINATE0*/2),
		new VertexElement(32,/*laya.d3.graphics.VertexElementFormat.Vector2*/"vector2",/*CLASS CONST:laya.d3.graphics.Vertex.VertexPositionTerrain.TERRAIN_TEXTURECOORDINATE1*/3)]);}
	]);
	return VertexPositionTerrain;
})()


/**

*/
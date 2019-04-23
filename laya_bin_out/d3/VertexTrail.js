/**
*<code>VertexTrail</code> 类用于创建拖尾顶点结构。
*/
//class laya.d3.core.trail.VertexTrail
var VertexTrail=(function(){
	function VertexTrail(){}
	__class(VertexTrail,'laya.d3.core.trail.VertexTrail');
	var __proto=VertexTrail.prototype;
	Laya.imps(__proto,{"laya.d3.graphics.IVertex":true})
	__getset(0,__proto,'vertexDeclaration',function(){
		return VertexTrail._vertexDeclaration1;
	});

	__getset(1,VertexTrail,'vertexDeclaration1',function(){
		return VertexTrail._vertexDeclaration1;
	});

	__getset(1,VertexTrail,'vertexDeclaration2',function(){
		return VertexTrail._vertexDeclaration2;
	});

	VertexTrail.TRAIL_POSITION0=0;
	VertexTrail.TRAIL_OFFSETVECTOR=1;
	VertexTrail.TRAIL_TIME0=2;
	VertexTrail.TRAIL_TEXTURECOORDINATE0Y=3;
	VertexTrail.TRAIL_TEXTURECOORDINATE0X=4;
	__static(VertexTrail,
	['_vertexDeclaration1',function(){return this._vertexDeclaration1=new VertexDeclaration(32,
		[new VertexElement(0,/*laya.d3.graphics.VertexElementFormat.Vector3*/"vector3",/*CLASS CONST:laya.d3.core.trail.VertexTrail.TRAIL_POSITION0*/0),
		new VertexElement(12,/*laya.d3.graphics.VertexElementFormat.Vector3*/"vector3",/*CLASS CONST:laya.d3.core.trail.VertexTrail.TRAIL_OFFSETVECTOR*/1),
		new VertexElement(24,/*laya.d3.graphics.VertexElementFormat.Single*/"single",/*CLASS CONST:laya.d3.core.trail.VertexTrail.TRAIL_TIME0*/2),
		new VertexElement(28,/*laya.d3.graphics.VertexElementFormat.Single*/"single",/*CLASS CONST:laya.d3.core.trail.VertexTrail.TRAIL_TEXTURECOORDINATE0Y*/3)]);},'_vertexDeclaration2',function(){return this._vertexDeclaration2=new VertexDeclaration(4,
		[new VertexElement(0,/*laya.d3.graphics.VertexElementFormat.Single*/"single",/*CLASS CONST:laya.d3.core.trail.VertexTrail.TRAIL_TEXTURECOORDINATE0X*/4)]);}
	]);
	return VertexTrail;
})()


/**

*/
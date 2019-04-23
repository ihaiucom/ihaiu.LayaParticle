//class laya.webgl.shader.d2.skinAnishader.SkinMeshBuffer
var SkinMeshBuffer=(function(){
	function SkinMeshBuffer(){
		this.ib=null;
		this.vb=null;
		var gl=WebGL.mainContext;
		this.ib=IndexBuffer2D.create(/*laya.webgl.WebGLContext.DYNAMIC_DRAW*/0x88E8);
		this.vb=VertexBuffer2D.create(8);
	}

	__class(SkinMeshBuffer,'laya.webgl.shader.d2.skinAnishader.SkinMeshBuffer');
	var __proto=SkinMeshBuffer.prototype;
	//TODO:coverage
	__proto.addSkinMesh=function(skinMesh){
		skinMesh.getData2(this.vb,this.ib,this.vb._byteLength / 32);
	}

	__proto.reset=function(){
		this.vb.clear();
		this.ib.clear();
	}

	SkinMeshBuffer.getInstance=function(){
		return SkinMeshBuffer.instance=SkinMeshBuffer.instance|| new SkinMeshBuffer();
	}

	SkinMeshBuffer.instance=null;
	return SkinMeshBuffer;
})()


/**
*...
*@author ww
*/

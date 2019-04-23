//class laya.ani.bone.canvasmesh.MeshData
var MeshData=(function(){
	function MeshData(){
		/**
		*纹理
		*/
		this.texture=null;
		/**
		*uv数据
		*/
		this.uvs=[0,0,1,0,1,1,0,1];
		/**
		*顶点数据
		*/
		this.vertices=[0,0,100,0,100,100,0,100];
		/**
		*顶点索引
		*/
		this.indexes=[0,1,3,3,1,2];
		/**
		*uv变换矩阵
		*/
		this.uvTransform=null;
		/**
		*是否有uv变化矩阵
		*/
		this.useUvTransform=false;
		/**
		*扩展像素,用来去除黑边
		*/
		this.canvasPadding=1;
	}

	__class(MeshData,'laya.ani.bone.canvasmesh.MeshData');
	var __proto=MeshData.prototype;
	//TODO:coverage
	__proto.getBounds=function(){
		return Rectangle._getWrapRec(this.vertices);
	}

	return MeshData;
})()


/**
*@private
*...
*@author ww
*/

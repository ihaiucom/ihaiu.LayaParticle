//class laya.ani.bone.canvasmesh.SkinMeshForGraphic extends laya.ani.bone.canvasmesh.MeshData
var SkinMeshForGraphic=(function(_super){
	function SkinMeshForGraphic(){
		/**
		*矩阵
		*/
		this.transform=null;
		SkinMeshForGraphic.__super.call(this);
	}

	__class(SkinMeshForGraphic,'laya.ani.bone.canvasmesh.SkinMeshForGraphic',_super);
	var __proto=SkinMeshForGraphic.prototype;
	__proto.init2=function(texture,ps,verticles,uvs){
		if (this.transform){
			this.transform=null;
		};
		var _ps=ps || [0,1,3,3,1,2];
		this.texture=texture;
		if (Render.isWebGL){
			this.indexes=new Uint16Array(_ps);
			this.vertices=new Float32Array(verticles);
			this.uvs=new Float32Array(uvs);
		}
		else {
			this.indexes=_ps;
			this.vertices=verticles;
			this.uvs=uvs;
		}
	}

	return SkinMeshForGraphic;
})(MeshData)


/**
*@private
*<code>AnimationTemplet</code> 类用于动画模板资源。
*/

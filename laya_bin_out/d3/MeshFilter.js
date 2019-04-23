/**
*<code>MeshFilter</code> 类用于创建网格过滤器。
*/
//class laya.d3.core.MeshFilter
var MeshFilter=(function(){
	function MeshFilter(owner){
		/**@private */
		this._owner=null;
		/**@private */
		this._sharedMesh=null;
		this._owner=owner;
	}

	__class(MeshFilter,'laya.d3.core.MeshFilter');
	var __proto=MeshFilter.prototype;
	/**
	*@private
	*/
	__proto._getMeshDefine=function(mesh){
		var define=0;
		for (var i=0,n=mesh._subMeshCount;i < n;i++){
			var subMesh=mesh._getSubMesh(i);
			var vertexElements=subMesh._vertexBuffer._vertexDeclaration.vertexElements;
			for (var j=0,m=vertexElements.length;j < m;j++){
				var vertexElement=vertexElements[j];
				var name=vertexElement.elementUsage;
				switch (name){
					case /*laya.d3.graphics.Vertex.VertexMesh.MESH_COLOR0*/1:
						define |=MeshSprite3D.SHADERDEFINE_COLOR;
						break
					case /*laya.d3.graphics.Vertex.VertexMesh.MESH_TEXTURECOORDINATE0*/2:
						define |=MeshSprite3D.SHADERDEFINE_UV0;
						break ;
					case /*laya.d3.graphics.Vertex.VertexMesh.MESH_TEXTURECOORDINATE1*/8:
						define |=MeshSprite3D.SHADERDEFINE_UV1;
						break ;
					}
			}
		}
		return define;
	}

	/**
	*@private
	*/
	__proto._changeRenderObjectsByMesh=function(){
		var renderElementsCount=this._sharedMesh.subMeshCount;
		this._owner._render._renderElements.length=renderElementsCount;
		for (var i=0;i < renderElementsCount;i++){
			var render=this._owner._render;
			var elements=render._renderElements;
			var renderElement=elements[i];
			if (renderElement){
				renderElement.setGeometry(this._sharedMesh._getSubMesh(i));
				}else {
				var material=render.sharedMaterials[i];
				(material)|| (material=BlinnPhongMaterial.defaultMaterial);
				renderElement=elements[i]=new SubMeshRenderElement();
				renderElement.setTransform(this._owner._transform);
				renderElement.render=render;
				renderElement.material=material;
				renderElement.setGeometry(this._sharedMesh._getSubMesh(i));
			}
		}
	}

	/**
	*@inheritDoc
	*/
	__proto.destroy=function(){
		this._owner=null;
		(this._sharedMesh)&& (this._sharedMesh._removeReference(),this._sharedMesh=null);
	}

	/**
	*设置共享网格。
	*@return value 共享网格。
	*/
	/**
	*获取共享网格。
	*@return 共享网格。
	*/
	__getset(0,__proto,'sharedMesh',function(){
		return this._sharedMesh;
		},function(value){
		if (this._sharedMesh!==value){
			var defineDatas=this._owner._render._defineDatas;
			var lastValue=this._sharedMesh;
			if (lastValue){
				lastValue._removeReference();
				defineDatas.remove(this._getMeshDefine(lastValue));
			}
			value._addReference();
			this._sharedMesh=value;
			defineDatas.add(this._getMeshDefine(value));
			this._changeRenderObjectsByMesh();
		}
		(this._owner._render)._onMeshChange(value);
	});

	return MeshFilter;
})()


/**

*/
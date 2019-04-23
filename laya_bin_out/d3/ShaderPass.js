/**
*<code>ShaderPass</code> 类用于实现ShaderPass。
*/
//class laya.d3.shader.ShaderPass extends laya.webgl.utils.ShaderCompile
var ShaderPass=(function(_super){
	function ShaderPass(owner,vs,ps){
		/**@private */
		//this._owner=null;
		/**@private */
		//this._cacheSharders=null;
		/**@private */
		//this._publicValidDefine=0;
		/**@private */
		//this._spriteValidDefine=0;
		/**@private */
		//this._materialValidDefine=0;
		/**@private */
		//this._validDefineMap=null;
		this._renderState=new RenderState();
		this._owner=owner;
		this._cacheSharders=[];
		this._publicValidDefine=0;
		this._spriteValidDefine=0;
		this._materialValidDefine=0;
		this._validDefineMap={};
		ShaderPass.__super.call(this,vs,ps,null,this._validDefineMap);
		var publicDefineMap=this._owner._publicDefinesMap;
		var spriteDefineMap=this._owner._spriteDefinesMap;
		var materialDefineMap=this._owner._materialDefinesMap;
		for (var k in this._validDefineMap){
			if (publicDefineMap[k] !=null)
				this._publicValidDefine |=publicDefineMap[k];
			else if (spriteDefineMap[k] !=null)
			this._spriteValidDefine |=spriteDefineMap[k];
			else if (materialDefineMap[k] !=null)
			this._materialValidDefine |=materialDefineMap[k];
		}
	}

	__class(ShaderPass,'laya.d3.shader.ShaderPass',_super);
	var __proto=ShaderPass.prototype;
	/**
	*@private
	*/
	__proto._definesToNameDic=function(value,int2Name){
		var o={};
		var d=1;
		for (var i=0;i < 32;i++){
			d=1 << i;
			if (d > value)break ;
			if (value & d){
				var name=int2Name[d];
				o[name]="";
			}
		}
		return o;
	}

	/**
	*@inheritDoc
	*/
	__proto._compileToTree=function(parent,lines,start,includefiles,defs){
		var node,preNode;
		var text,name,fname;
		var ofs=0,words,noUseNode;
		var i=0,n=0,j=0;
		for (i=start;i < lines.length;i++){
			text=lines[i];
			if (text.length < 1)continue ;
			ofs=text.indexOf("//");
			if (ofs===0)continue ;
			if (ofs >=0)text=text.substr(0,ofs);
			node=noUseNode || new ShaderNode(includefiles);
			noUseNode=null;
			node.text=text;
			if ((ofs=text.indexOf("#"))>=0){
				name="#";
				for (j=ofs+1,n=text.length;j < n;j++){
					var c=text.charAt(j);
					if (c===' ' || c==='\t' || c==='?')break ;
					name+=c;
				}
				node.name=name;
				switch (name){
					case "#ifdef":
					case "#ifndef":
						node.setParent(parent);
						parent=node;
						if (defs){
							words=text.substr(j).split(ShaderCompile._splitToWordExps3);
							for (j=0;j < words.length;j++){
								text=words[j];
								text.length && (defs[text]=true);
							}
						}
						continue ;
					case "#if":
					case "#elif":
						node.setParent(parent);
						parent=node;
						if (defs){
							words=text.substr(j).split(ShaderCompile._splitToWordExps3);
							for (j=0;j < words.length;j++){
								text=words[j];
								text.length && text !="defined" && (defs[text]=true);
							}
						}
						continue ;
					case "#else":
						parent=parent.parent;
						preNode=parent.childs[parent.childs.length-1];
						node.setParent(parent);
						parent=node;
						continue ;
					case "#endif":
						parent=parent.parent;
						preNode=parent.childs[parent.childs.length-1];
						node.setParent(parent);
						continue ;
					case "#include":
						words=ShaderCompile.splitToWords(text,null);
						var inlcudeFile=ShaderCompile.includes[words[1]];
						if (!inlcudeFile){
							throw "ShaderCompile error no this include file:"+words[1];
						}
						if ((ofs=words[0].indexOf("?"))< 0){
							node.setParent(parent);
							text=inlcudeFile.getWith(words[2]=='with' ? words[3] :null);
							this._compileToTree(node,text.split('\n'),0,includefiles,defs);
							node.text="";
							continue ;
						}
						node.setCondition(words[0].substr(ofs+1),1);
						node.text=inlcudeFile.getWith(words[2]=='with' ? words[3] :null);
						break ;
					case "#import":
						words=ShaderCompile.splitToWords(text,null);
						fname=words[1];
						includefiles.push({node:node,file:ShaderCompile.includes[fname],ofs:node.text.length});
						continue ;
					}
				}else {
				preNode=parent.childs[parent.childs.length-1];
				if (preNode && !preNode.name){
					includefiles.length > 0 && ShaderCompile.splitToWords(text,preNode);
					noUseNode=node;
					preNode.text+="\n"+text;
					continue ;
				}
				includefiles.length > 0 && ShaderCompile.splitToWords(text,node);
			}
			node.setParent(parent);
		}
	}

	/**
	*@private
	*/
	__proto.withCompile=function(publicDefine,spriteDefine,materialDefine){
		publicDefine &=this._publicValidDefine;
		spriteDefine &=this._spriteValidDefine;
		materialDefine &=this._materialValidDefine;
		var shader;
		var spriteDefShaders,materialDefShaders;
		spriteDefShaders=this._cacheSharders[publicDefine];
		if (spriteDefShaders){
			materialDefShaders=spriteDefShaders[spriteDefine];
			if (materialDefShaders){
				shader=materialDefShaders[materialDefine];
				if (shader)
					return shader;
				}else {
				materialDefShaders=spriteDefShaders[spriteDefine]=[];
			}
			}else {
			spriteDefShaders=this._cacheSharders[publicDefine]=[];
			materialDefShaders=spriteDefShaders[spriteDefine]=[];
		};
		var publicDefGroup=this._definesToNameDic(publicDefine,this._owner._publicDefines);
		var spriteDefGroup=this._definesToNameDic(spriteDefine,this._owner._spriteDefines);
		var materialDefGroup=this._definesToNameDic(materialDefine,this._owner._materialDefines);
		var key;
		if (Shader3D.debugMode){
			var publicDefGroupStr="";
			for (key in publicDefGroup)
			publicDefGroupStr+=key+" ";
			var spriteDefGroupStr="";
			for (key in spriteDefGroup)
			spriteDefGroupStr+=key+" ";
			var materialDefGroupStr="";
			for (key in materialDefGroup)
			materialDefGroupStr+=key+" ";
			if (!WebGL.shaderHighPrecision)
				publicDefine+=Shader3D.SHADERDEFINE_HIGHPRECISION;
			console.log("%cShader3DDebugMode---(Name:"+this._owner._owner._name+" PassIndex:"+this._owner._passes.indexOf(this)+" PublicDefine:"+publicDefine+" SpriteDefine:"+spriteDefine+" MaterialDefine:"+materialDefine+" PublicDefineGroup:"+publicDefGroupStr+" SpriteDefineGroup:"+spriteDefGroupStr+"MaterialDefineGroup: "+materialDefGroupStr+")---ShaderCompile3DDebugMode","color:green");
		};
		var defMap={};
		var defineStr="";
		if (publicDefGroup){
			for (key in publicDefGroup){
				defineStr+="#define "+key+"\n";
				defMap[key]=true;
			}
		}
		if (spriteDefGroup){
			for (key in spriteDefGroup){
				defineStr+="#define "+key+"\n";
				defMap[key]=true;
			}
		}
		if (materialDefGroup){
			for (key in materialDefGroup){
				defineStr+="#define "+key+"\n";
				defMap[key]=true;
			}
		};
		var vs=this._VS.toscript(defMap,[]);
		var vsVersion='';
		if (vs[0].indexOf('#version')==0){
			vsVersion=vs[0]+'\n';
			vs.shift();
		};
		var ps=this._PS.toscript(defMap,[]);
		var psVersion='';
		if (ps[0].indexOf('#version')==0){
			psVersion=ps[0]+'\n';
			ps.shift();
		}
		shader=new ShaderInstance(vsVersion+defineStr+vs.join('\n'),psVersion+defineStr+ps.join('\n'),this._owner._attributeMap,this._owner._uniformMap);
		materialDefShaders[materialDefine]=shader;
		return shader;
	}

	/**
	*获取渲染状态。
	*@return 渲染状态。
	*/
	__getset(0,__proto,'renderState',function(){
		return this._renderState;
	});

	return ShaderPass;
})(ShaderCompile)


/**
*@private
*/
//class laya.d3.core.render.SubMeshRenderElement extends laya.d3.core.render.RenderElement
var SubMeshRenderElement=(function(_super){
	function SubMeshRenderElement(){
		/**@private */
		//this._dynamicWorldPositionNormalNeedUpdate=false;
		/**@private */
		//this._dynamicBatch=false;
		/**@private */
		//this._dynamicMultiSubMesh=false;
		/**@private */
		//this._dynamicVertexCount=0;
		/**@private */
		//this._dynamicWorldPositions=null;
		/**@private */
		//this._dynamicWorldNormals=null;
		/**@private */
		//this.skinnedDatas=null;
		/**@private */
		//this.staticBatchIndexStart=0;
		/**@private */
		//this.staticBatchIndexEnd=0;
		/**@private */
		//this.staticBatchElementList=null;
		/**@private */
		//this.dynamicBatchElementList=null;
		/**@private */
		//this.dynamicVertexDeclaration=null;
		SubMeshRenderElement.__super.call(this);
		this._dynamicWorldPositionNormalNeedUpdate=true;
	}

	__class(SubMeshRenderElement,'laya.d3.core.render.SubMeshRenderElement',_super);
	var __proto=SubMeshRenderElement.prototype;
	/**
	*@private
	*/
	__proto._onWorldMatrixChanged=function(){
		this._dynamicWorldPositionNormalNeedUpdate=true;
	}

	/**
	*@inheritDoc
	*/
	__proto._computeWorldPositionsAndNormals=function(positionOffset,normalOffset,multiSubMesh,vertexCount){
		if (this._dynamicWorldPositionNormalNeedUpdate){
			var subMesh=this._geometry;
			var vertexBuffer=subMesh._vertexBuffer;
			var vertexFloatCount=vertexBuffer.vertexDeclaration.vertexStride / 4;
			var oriVertexes=vertexBuffer.getData();
			var worldMat=this._transform.worldMatrix;
			var rotation=this._transform.rotation;
			var indices=subMesh._indices;
			for (var i=0;i < vertexCount;i++){
				var index=multiSubMesh ? indices[i] :i;
				var oriOffset=index *vertexFloatCount;
				var bakeOffset=i *3;
				Utils3D.transformVector3ArrayToVector3ArrayCoordinate(oriVertexes,oriOffset+positionOffset,worldMat,this._dynamicWorldPositions,bakeOffset);
				(normalOffset!==-1)&& (Utils3D.transformVector3ArrayByQuat(oriVertexes,oriOffset+normalOffset,rotation,this._dynamicWorldNormals,bakeOffset));
			}
			this._dynamicWorldPositionNormalNeedUpdate=false;
		}
	}

	/**
	*@inheritDoc
	*/
	__proto.setTransform=function(transform){
		if (this._transform!==transform){
			(this._transform)&& (this._transform.off(/*laya.events.Event.TRANSFORM_CHANGED*/"transformchanged",this,this._onWorldMatrixChanged));
			(transform)&& (transform.on(/*laya.events.Event.TRANSFORM_CHANGED*/"transformchanged",this,this._onWorldMatrixChanged));
			this._dynamicWorldPositionNormalNeedUpdate=true;
			this._transform=transform;
		}
	}

	/**
	*@inheritDoc
	*/
	__proto.setGeometry=function(geometry){
		if (this._geometry!==geometry){
			var subMesh=geometry;
			var mesh=subMesh._mesh;
			if (mesh){
				var multiSubMesh=mesh._subMeshCount > 1;
				var dynBatVerCount=multiSubMesh ? subMesh._indexCount :mesh._vertexCount;
				if (dynBatVerCount <=/*laya.d3.graphics.SubMeshDynamicBatch.maxAllowVertexCount*/10){
					var length=dynBatVerCount *3;
					this._dynamicBatch=true;
					this._dynamicWorldPositions=new Float32Array(length);
					this._dynamicWorldNormals=new Float32Array(length);
					this._dynamicVertexCount=dynBatVerCount;
					this._dynamicMultiSubMesh=multiSubMesh;
					}else {
					this._dynamicBatch=false;
				}
			}
			this._geometry=geometry;
		}
	}

	/**
	*@inheritDoc
	*/
	__proto.addToOpaqueRenderQueue=function(context,queue){
		var subMeshStaticBatch=this.staticBatch;
		var elements=queue.elements;
		if (subMeshStaticBatch){
			var staManager=MeshRenderStaticBatchManager.instance;
			var staLightIndex=this.render.lightmapIndex+1;
			var staLightMapMarks=(staManager._opaqueBatchMarks[staLightIndex])|| (staManager._opaqueBatchMarks[staLightIndex]=[]);
			var staReceiveShadowMarks=(staLightMapMarks[this.render.receiveShadow ? 0 :1])|| (staLightMapMarks[this.render.receiveShadow ? 0 :1]=[]);
			var staMaterialMarks=(staReceiveShadowMarks[this.material.id])|| (staReceiveShadowMarks[this.material.id]=[]);
			var staBatchMarks=(staMaterialMarks[subMeshStaticBatch._batchID])|| (staMaterialMarks[subMeshStaticBatch._batchID]=new Array(3));
			if (staManager._updateCountMark===staBatchMarks[0]){
				var staBatchIndex=staBatchMarks[1];
				if (staBatchMarks[2]){
					elements[staBatchIndex].staticBatchElementList.push(this);
					}else {
					var staOriElement=elements[staBatchIndex];
					var staOriRender=staOriElement.render;
					var staBatchElement=staManager._getBatchRenderElementFromPool();
					staBatchElement.setGeometry(subMeshStaticBatch);
					staBatchElement.material=staOriElement.material;
					var staRootOwner=subMeshStaticBatch.batchOwner._owner;
					var staBatchTransform=staRootOwner ? staRootOwner._transform :null;
					staBatchElement.setTransform(staBatchTransform);
					var staBatchRender=subMeshStaticBatch.batchOwner._getBatchRender(context,staOriRender.lightmapIndex,staOriRender.receiveShadow);
					staBatchRender._setBelongScene(context.scene);
					staBatchRender._distanceForSort=staOriRender._distanceForSort;
					staBatchElement.render=staBatchRender;
					var staBatchList=staBatchElement.staticBatchElementList;
					staBatchList.length=0;
					staBatchList.push(staOriElement);
					staBatchList.push(this);
					elements[staBatchIndex]=staBatchElement;
					staBatchMarks[2]=true;
				}
				}else {
				staBatchMarks[0]=staManager._updateCountMark;
				staBatchMarks[1]=elements.length;
				staBatchMarks[2]=false;
				elements.push(this);
			}
			}else {
			if (this._dynamicBatch){
				var verDec=(this._geometry)._vertexBuffer.vertexDeclaration;
				var dynManager=MeshRenderDynamicBatchManager.instance;
				var dynLightIndex=this.render.lightmapIndex+1;
				var dynLightMapMarks=(dynManager._opaqueBatchMarks[dynLightIndex])|| (dynManager._opaqueBatchMarks[dynLightIndex]=[]);
				var dynReceiveShadowMarks=(dynLightMapMarks[this.render.receiveShadow ? 0 :1])|| (dynLightMapMarks[this.render.receiveShadow ? 0 :1]=[]);
				var dynMaterialMarks=(dynReceiveShadowMarks[this.material.id])|| (dynReceiveShadowMarks[this.material.id]=[]);
				var dynBatchMarks=(dynMaterialMarks[verDec.id])|| (dynMaterialMarks[verDec.id]=new Array(3));
				if (dynManager._updateCountMark===dynBatchMarks[0]){
					var dynBatchIndex=dynBatchMarks[1];
					if (dynBatchMarks[2]){
						elements[dynBatchIndex].dynamicBatchElementList.push(this);
						}else {
						var dynOriElement=elements[dynBatchIndex];
						var dynOriRender=dynOriElement.render;
						var dynBatchElement=dynManager._getBatchRenderElementFromPool();
						dynBatchElement.setGeometry(SubMeshDynamicBatch.instance);
						dynBatchElement.material=dynOriElement.material;
						dynBatchElement.setTransform(null);
						var dynBatchRender=dynManager._getBatchRender(dynOriRender.lightmapIndex,dynOriRender.receiveShadow);
						dynBatchRender._setBelongScene(context.scene);
						dynBatchRender._distanceForSort=dynOriRender._distanceForSort;
						dynBatchElement.render=dynBatchRender;
						dynBatchElement.dynamicVertexDeclaration=verDec;
						var dynBatchList=dynBatchElement.dynamicBatchElementList;
						dynBatchList.length=0;
						dynBatchList.push(dynOriElement);
						dynBatchList.push(this);
						elements[dynBatchIndex]=dynBatchElement;
						dynBatchMarks[2]=true;
					}
					}else {
					dynBatchMarks[0]=dynManager._updateCountMark;
					dynBatchMarks[1]=elements.length;
					dynBatchMarks[2]=false;
					elements.push(this);
				}
				}else {
				elements.push(this);
			}
		}
	}

	/**
	*@inheritDoc
	*/
	__proto.addToTransparentRenderQueue=function(context,queue){
		var subMeshStaticBatch=this.staticBatch;
		var elements=queue.elements;
		if (subMeshStaticBatch){
			var staManager=MeshRenderStaticBatchManager.instance;
			var staLastElement=queue.lastTransparentRenderElement;
			if (staLastElement){
				var staLastRender=staLastElement.render;
				if (staLastElement._geometry._getType()!==this._geometry._getType()|| staLastElement.staticBatch!==subMeshStaticBatch || staLastElement.material!==this.material || staLastRender.receiveShadow!==this.render.receiveShadow || staLastRender.lightmapIndex!==this.render.lightmapIndex){
					elements.push(this);
					queue.lastTransparentBatched=false;
					}else {
					if (queue.lastTransparentBatched){
						(elements [elements.length-1]).staticBatchElementList.push((this));
						}else {
						var staBatchElement=staManager._getBatchRenderElementFromPool();
						staBatchElement.setGeometry(subMeshStaticBatch);
						staBatchElement.material=staLastElement.material;
						var staRootOwner=subMeshStaticBatch.batchOwner._owner;
						var staBatchTransform=staRootOwner ? staRootOwner._transform :null;
						staBatchElement.setTransform(staBatchTransform);
						var staBatchRender=subMeshStaticBatch.batchOwner._getBatchRender(context,staLastRender.lightmapIndex,staLastRender.receiveShadow);
						staBatchRender._setBelongScene(context.scene);
						staBatchRender._distanceForSort=staLastRender._distanceForSort;
						staBatchElement.render=staBatchRender;
						var staBatchList=staBatchElement.staticBatchElementList;
						staBatchList.length=0;
						staBatchList.push(staLastElement);
						staBatchList.push(this);
						elements[elements.length-1]=staBatchElement;
					}
					queue.lastTransparentBatched=true;
				}
				}else {
				elements.push(this);
				queue.lastTransparentBatched=false;
			}
			}else {
			if (this._dynamicBatch){
				var verDec=(this._geometry)._vertexBuffer.vertexDeclaration;
				var dynManager=MeshRenderDynamicBatchManager.instance;
				var dynLastElement=queue.lastTransparentRenderElement;
				if (dynLastElement){
					var dynLastRender=dynLastElement.render;
					if (dynLastElement._geometry._getType()!==this._geometry._getType()|| (dynLastElement._geometry)._vertexBuffer._vertexDeclaration!==verDec || dynLastElement.material!==this.material || dynLastRender.receiveShadow!==this.render.receiveShadow || dynLastRender.lightmapIndex!==this.render.lightmapIndex){
						elements.push(this);
						queue.lastTransparentBatched=false;
						}else {
						if (queue.lastTransparentBatched){
							(elements [elements.length-1]).dynamicBatchElementList.push((this));
							}else {
							var dynBatchElement=dynManager._getBatchRenderElementFromPool();
							dynBatchElement.setGeometry(SubMeshDynamicBatch.instance);
							dynBatchElement.material=dynLastElement.material;
							dynBatchElement.setTransform(null);
							var dynBatchRender=dynManager._getBatchRender(dynLastRender.lightmapIndex,dynLastRender.receiveShadow);
							dynBatchRender._setBelongScene(context.scene);
							dynBatchRender._distanceForSort=dynLastRender._distanceForSort;
							dynBatchElement.render=dynBatchRender;
							dynBatchElement.dynamicVertexDeclaration=verDec;
							var dynBatchList=dynBatchElement.dynamicBatchElementList;
							dynBatchList.length=0;
							dynBatchList.push(dynLastElement);
							dynBatchList.push(this);
							elements[elements.length-1]=dynBatchElement;
						}
						queue.lastTransparentBatched=true;
					}
					}else {
					elements.push(this);
					queue.lastTransparentBatched=false;
				}
				}else {
				elements.push(this);
			}
		}
		queue.lastTransparentRenderElement=this;
	}

	/**
	*@inheritDoc
	*/
	__proto.destroy=function(){
		_super.prototype.destroy.call(this);
		this._dynamicWorldPositions=null;
		this._dynamicWorldNormals=null;
		this.skinnedDatas=null;
		this.staticBatch=null;
		this.staticBatchElementList=null;
		this.dynamicBatchElementList=null;
		this.dynamicVertexDeclaration=null;
	}

	return SubMeshRenderElement;
})(RenderElement)


/**
*@private

*/
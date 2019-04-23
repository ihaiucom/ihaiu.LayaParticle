/**
*<code>LoadModel</code> 类用于模型加载。
*/
//class laya.d3.loaders.LoadModelV04
var LoadModelV04=(function(){
	function LoadModelV04(){}
	__class(LoadModelV04,'laya.d3.loaders.LoadModelV04');
	LoadModelV04.parse=function(readData,version,mesh,subMeshes){
		LoadModelV04._mesh=mesh;
		LoadModelV04._subMeshes=subMeshes;
		LoadModelV04._version=version;
		LoadModelV04._readData=readData;
		LoadModelV04.READ_DATA();
		LoadModelV04.READ_BLOCK();
		LoadModelV04.READ_STRINGS();
		for (var i=0,n=LoadModelV04._BLOCK.count;i < n;i++){
			LoadModelV04._readData.pos=LoadModelV04._BLOCK.blockStarts[i];
			var index=LoadModelV04._readData.getUint16();
			var blockName=LoadModelV04._strings[index];
			var fn=LoadModelV04["READ_"+blockName];
			if (fn==null)
				throw new Error("model file err,no this function:"+index+" "+blockName);
			else
			fn.call();
		}
		LoadModelV04._mesh._bindPoseIndices=new Uint16Array(LoadModelV04._bindPoseIndices);
		LoadModelV04._bindPoseIndices.length=0;
		LoadModelV04._strings.length=0;
		LoadModelV04._readData=null;
		LoadModelV04._version=null;
		LoadModelV04._mesh=null;
		LoadModelV04._subMeshes=null;
	}

	LoadModelV04._readString=function(){
		return LoadModelV04._strings[LoadModelV04._readData.getUint16()];
	}

	LoadModelV04.READ_DATA=function(){
		LoadModelV04._DATA.offset=LoadModelV04._readData.getUint32();
		LoadModelV04._DATA.size=LoadModelV04._readData.getUint32();
	}

	LoadModelV04.READ_BLOCK=function(){
		var count=LoadModelV04._BLOCK.count=LoadModelV04._readData.getUint16();
		var blockStarts=LoadModelV04._BLOCK.blockStarts=[];
		var blockLengths=LoadModelV04._BLOCK.blockLengths=[];
		for (var i=0;i < count;i++){
			blockStarts.push(LoadModelV04._readData.getUint32());
			blockLengths.push(LoadModelV04._readData.getUint32());
		}
	}

	LoadModelV04.READ_STRINGS=function(){
		var offset=LoadModelV04._readData.getUint32();
		var count=LoadModelV04._readData.getUint16();
		var prePos=LoadModelV04._readData.pos;
		LoadModelV04._readData.pos=offset+LoadModelV04._DATA.offset;
		for (var i=0;i < count;i++)
		LoadModelV04._strings[i]=LoadModelV04._readData.readUTFString();
		LoadModelV04._readData.pos=prePos;
	}

	LoadModelV04.READ_MESH=function(){
		var name=LoadModelV04._readString();
		var arrayBuffer=LoadModelV04._readData.__getBuffer();
		var i=0,n=0;
		var memorySize=0;
		var vertexBufferCount=LoadModelV04._readData.getInt16();
		var offset=LoadModelV04._DATA.offset;
		for (i=0;i < vertexBufferCount;i++){
			var vbStart=offset+LoadModelV04._readData.getUint32();
			var vbLength=LoadModelV04._readData.getUint32();
			var vbDatas=new Float32Array(arrayBuffer.slice(vbStart,vbStart+vbLength));
			var bufferAttribute=LoadModelV04._readString();
			var vertexDeclaration;
			switch (LoadModelV04._version){
				case "LAYAMODEL:0301":
				case "LAYAMODEL:0400":
					vertexDeclaration=VertexMesh.getVertexDeclaration(bufferAttribute);
					break ;
				case "LAYAMODEL:0401":
					vertexDeclaration=VertexMesh.getVertexDeclaration(bufferAttribute,false);
					break ;
				default :
					throw new Error("LoadModelV03: unknown version.");
				}
			if (!vertexDeclaration)
				throw new Error("LoadModelV03: unknown vertexDeclaration.");
			var vertexBuffer=new VertexBuffer3D(vbDatas.length *4,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4,true);
			vertexBuffer.vertexDeclaration=vertexDeclaration;
			vertexBuffer.setData(vbDatas);
			LoadModelV04._mesh._vertexBuffers.push(vertexBuffer);
			LoadModelV04._mesh._vertexCount+=vertexBuffer.vertexCount;
			memorySize+=vbDatas.length *4;
		};
		var ibStart=offset+LoadModelV04._readData.getUint32();
		var ibLength=LoadModelV04._readData.getUint32();
		var ibDatas=new Uint16Array(arrayBuffer.slice(ibStart,ibStart+ibLength));
		var indexBuffer=new IndexBuffer3D(/*laya.d3.graphics.IndexBuffer3D.INDEXTYPE_USHORT*/"ushort",ibLength / 2,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4,true);
		indexBuffer.setData(ibDatas);
		LoadModelV04._mesh._indexBuffer=indexBuffer;
		memorySize+=indexBuffer.indexCount *2;
		LoadModelV04._mesh._setCPUMemory(memorySize);
		LoadModelV04._mesh._setGPUMemory(memorySize);
		var boneNames=LoadModelV04._mesh._boneNames=[];
		var boneCount=LoadModelV04._readData.getUint16();
		boneNames.length=boneCount;
		for (i=0;i < boneCount;i++)
		boneNames[i]=LoadModelV04._strings[LoadModelV04._readData.getUint16()];
		LoadModelV04._readData.pos+=8;
		var bindPoseDataStart=LoadModelV04._readData.getUint32();
		var bindPoseDataLength=LoadModelV04._readData.getUint32();
		var bindPoseDatas=new Float32Array(arrayBuffer.slice(offset+bindPoseDataStart,offset+bindPoseDataStart+bindPoseDataLength));
		var bindPoseFloatCount=bindPoseDatas.length;
		var bindPoseCount=bindPoseFloatCount / 16;
		var bindPoseBuffer=LoadModelV04._mesh._inverseBindPosesBuffer=new ArrayBuffer(bindPoseFloatCount *4);
		LoadModelV04._mesh._inverseBindPoses=__newvec(bindPoseCount);
		for (i=0;i < bindPoseFloatCount;i+=16){
			var inverseGlobalBindPose=new Matrix4x4(bindPoseDatas[i+0],bindPoseDatas[i+1],bindPoseDatas[i+2],bindPoseDatas[i+3],bindPoseDatas[i+4],bindPoseDatas[i+5],bindPoseDatas[i+6],bindPoseDatas[i+7],bindPoseDatas[i+8],bindPoseDatas[i+9],bindPoseDatas[i+10],bindPoseDatas[i+11],bindPoseDatas[i+12],bindPoseDatas[i+13],bindPoseDatas[i+14],bindPoseDatas[i+15],new Float32Array(bindPoseBuffer,i *4,16));
			LoadModelV04._mesh._inverseBindPoses[i / 16]=inverseGlobalBindPose;
		}
		return true;
	}

	LoadModelV04.READ_SUBMESH=function(){
		var arrayBuffer=LoadModelV04._readData.__getBuffer();
		var submesh=new SubMesh(LoadModelV04._mesh);
		var vbIndex=LoadModelV04._readData.getInt16();
		LoadModelV04._readData.getUint32();
		LoadModelV04._readData.getUint32();
		var ibStart=LoadModelV04._readData.getUint32();
		var ibCount=LoadModelV04._readData.getUint32();
		var indexBuffer=LoadModelV04._mesh._indexBuffer;
		submesh._indexBuffer=indexBuffer;
		submesh._indexStart=ibStart;
		submesh._indexCount=ibCount;
		submesh._indices=new Uint16Array(indexBuffer.getData().buffer,ibStart *2,ibCount);
		var vertexBuffer=LoadModelV04._mesh._vertexBuffers[vbIndex];
		submesh._vertexBuffer=vertexBuffer;
		var bufferState=submesh._bufferState;
		bufferState.bind();
		bufferState.applyVertexBuffer(vertexBuffer);
		bufferState.applyIndexBuffer(indexBuffer);
		bufferState.unBind();
		var offset=LoadModelV04._DATA.offset;
		var subIndexBufferStart=submesh._subIndexBufferStart;
		var subIndexBufferCount=submesh._subIndexBufferCount;
		var boneIndicesList=submesh._boneIndicesList;
		var drawCount=LoadModelV04._readData.getUint16();
		subIndexBufferStart.length=drawCount;
		subIndexBufferCount.length=drawCount;
		boneIndicesList.length=drawCount;
		var pathMarks=LoadModelV04._mesh._skinDataPathMarks;
		var bindPoseIndices=LoadModelV04._bindPoseIndices;
		var subMeshIndex=LoadModelV04._subMeshes.length;
		for (var i=0;i < drawCount;i++){
			subIndexBufferStart[i]=LoadModelV04._readData.getUint32();
			subIndexBufferCount[i]=LoadModelV04._readData.getUint32();
			var boneDicofs=LoadModelV04._readData.getUint32();
			var boneDicCount=LoadModelV04._readData.getUint32();
			var boneIndices=boneIndicesList[i]=new Uint16Array(arrayBuffer.slice(offset+boneDicofs,offset+boneDicofs+boneDicCount));
			for (var j=0,m=boneIndices.length;j < m;j++){
				var index=boneIndices[j];
				var combineIndex=bindPoseIndices.indexOf(index);
				if (combineIndex===-1){
					boneIndices[j]=bindPoseIndices.length;
					bindPoseIndices.push(index);
					pathMarks.push([subMeshIndex,i,j]);
					}else {
					boneIndices[j]=combineIndex;
				}
			}
		}
		LoadModelV04._subMeshes.push(submesh);
		return true;
	}

	LoadModelV04._strings=[];
	LoadModelV04._readData=null;
	LoadModelV04._version=null;
	LoadModelV04._mesh=null;
	LoadModelV04._subMeshes=null;
	LoadModelV04._bindPoseIndices=[];
	__static(LoadModelV04,
	['_BLOCK',function(){return this._BLOCK={count:0};},'_DATA',function(){return this._DATA={offset:0,size:0};}
	]);
	return LoadModelV04;
})()


/**

*/
/**
*<code>LoadModelV05</code> 类用于模型加载。
*/
//class laya.d3.loaders.LoadModelV05
var LoadModelV05=(function(){
	function LoadModelV05(){}
	__class(LoadModelV05,'laya.d3.loaders.LoadModelV05');
	LoadModelV05.parse=function(readData,version,mesh,subMeshes){
		LoadModelV05._mesh=mesh;
		LoadModelV05._subMeshes=subMeshes;
		LoadModelV05._version=version;
		LoadModelV05._readData=readData;
		LoadModelV05.READ_DATA();
		LoadModelV05.READ_BLOCK();
		LoadModelV05.READ_STRINGS();
		for (var i=0,n=LoadModelV05._BLOCK.count;i < n;i++){
			LoadModelV05._readData.pos=LoadModelV05._BLOCK.blockStarts[i];
			var index=LoadModelV05._readData.getUint16();
			var blockName=LoadModelV05._strings[index];
			var fn=LoadModelV05["READ_"+blockName];
			if (fn==null)
				throw new Error("model file err,no this function:"+index+" "+blockName);
			else
			fn.call();
		}
		LoadModelV05._mesh._bindPoseIndices=new Uint16Array(LoadModelV05._bindPoseIndices);
		LoadModelV05._bindPoseIndices.length=0;
		LoadModelV05._strings.length=0;
		LoadModelV05._readData=null;
		LoadModelV05._version=null;
		LoadModelV05._mesh=null;
		LoadModelV05._subMeshes=null;
	}

	LoadModelV05._readString=function(){
		return LoadModelV05._strings[LoadModelV05._readData.getUint16()];
	}

	LoadModelV05.READ_DATA=function(){
		LoadModelV05._DATA.offset=LoadModelV05._readData.getUint32();
		LoadModelV05._DATA.size=LoadModelV05._readData.getUint32();
	}

	LoadModelV05.READ_BLOCK=function(){
		var count=LoadModelV05._BLOCK.count=LoadModelV05._readData.getUint16();
		var blockStarts=LoadModelV05._BLOCK.blockStarts=[];
		var blockLengths=LoadModelV05._BLOCK.blockLengths=[];
		for (var i=0;i < count;i++){
			blockStarts.push(LoadModelV05._readData.getUint32());
			blockLengths.push(LoadModelV05._readData.getUint32());
		}
	}

	LoadModelV05.READ_STRINGS=function(){
		var offset=LoadModelV05._readData.getUint32();
		var count=LoadModelV05._readData.getUint16();
		var prePos=LoadModelV05._readData.pos;
		LoadModelV05._readData.pos=offset+LoadModelV05._DATA.offset;
		for (var i=0;i < count;i++)
		LoadModelV05._strings[i]=LoadModelV05._readData.readUTFString();
		LoadModelV05._readData.pos=prePos;
	}

	LoadModelV05.READ_MESH=function(){
		var i=0,n=0;
		var memorySize=0;
		var name=LoadModelV05._readString();
		var arrayBuffer=LoadModelV05._readData.__getBuffer();
		var vertexBufferCount=LoadModelV05._readData.getInt16();
		var offset=LoadModelV05._DATA.offset;
		for (i=0;i < vertexBufferCount;i++){
			var vbStart=offset+LoadModelV05._readData.getUint32();
			var vertexCount=LoadModelV05._readData.getUint32();
			var vertexFlag=LoadModelV05._readString();
			var vertexDeclaration=VertexMesh.getVertexDeclaration(vertexFlag,false);
			var vertexStride=vertexDeclaration.vertexStride;
			var vertexData=new ArrayBuffer(vertexStride *vertexCount);
			var floatData=new Float32Array(vertexData);
			var subVertexFlags=vertexFlag.split(",");
			var subVertexCount=subVertexFlags.length;
			switch (LoadModelV05._version){
				case "LAYAMODEL:05":
					floatData=new Float32Array(arrayBuffer.slice(vbStart,vbStart+vertexCount *vertexStride));
					break ;
				case "LAYAMODEL:COMPRESSION_05":;
					var lastPosition=LoadModelV05._readData.pos;
					floatData=new Float32Array(vertexData);
					var uint8Data=new Uint8Array(vertexData);
					LoadModelV05._readData.pos=vbStart;
					for (var j=0;j < vertexCount;j++){
						var subOffset=0;
						var verOffset=j *vertexStride;
						for (var k=0;k < subVertexCount;k++){
						switch (subVertexFlags[k]){
							case "POSITION":
								subOffset=verOffset / 4;
								floatData[subOffset]=HalfFloatUtils.convertToNumber(LoadModelV05._readData.getUint16());
								floatData[subOffset+1]=HalfFloatUtils.convertToNumber(LoadModelV05._readData.getUint16());
								floatData[subOffset+2]=HalfFloatUtils.convertToNumber(LoadModelV05._readData.getUint16());
								verOffset+=12;
								break ;
							case "NORMAL":
								subOffset=verOffset / 4;
								floatData[subOffset]=LoadModelV05._readData.getUint8()/ 127.5-1;
								floatData[subOffset+1]=LoadModelV05._readData.getUint8()/ 127.5-1;
								floatData[subOffset+2]=LoadModelV05._readData.getUint8()/ 127.5-1;
								verOffset+=12;
								break ;
							case "COLOR":
								subOffset=verOffset / 4;
								floatData[subOffset]=LoadModelV05._readData.getUint8()/ 255;
								floatData[subOffset+1]=LoadModelV05._readData.getUint8()/ 255;
								floatData[subOffset+2]=LoadModelV05._readData.getUint8()/ 255;
								floatData[subOffset+3]=LoadModelV05._readData.getUint8()/ 255;
								verOffset+=16;
								break ;
							case "UV":
								subOffset=verOffset / 4;
								floatData[subOffset]=HalfFloatUtils.convertToNumber(LoadModelV05._readData.getUint16());
								floatData[subOffset+1]=HalfFloatUtils.convertToNumber(LoadModelV05._readData.getUint16());
								verOffset+=8;
								break ;
							case "UV1":
								subOffset=verOffset / 4;
								floatData[subOffset]=HalfFloatUtils.convertToNumber(LoadModelV05._readData.getUint16());
								floatData[subOffset+1]=HalfFloatUtils.convertToNumber(LoadModelV05._readData.getUint16());
								verOffset+=8;
								break ;
							case "BLENDWEIGHT":
								subOffset=verOffset / 4;
								floatData[subOffset]=LoadModelV05._readData.getUint8()/ 255;
								floatData[subOffset+1]=LoadModelV05._readData.getUint8()/ 255;
								floatData[subOffset+2]=LoadModelV05._readData.getUint8()/ 255;
								floatData[subOffset+3]=LoadModelV05._readData.getUint8()/ 255;
								verOffset+=16;
								break ;
							case "BLENDINDICES":
								uint8Data[verOffset]=LoadModelV05._readData.getUint8();
								uint8Data[verOffset+1]=LoadModelV05._readData.getUint8();
								uint8Data[verOffset+2]=LoadModelV05._readData.getUint8();
								uint8Data[verOffset+3]=LoadModelV05._readData.getUint8();
								verOffset+=4;
								break ;
							case "TANGENT":
								subOffset=verOffset / 4;
								floatData[subOffset]=LoadModelV05._readData.getUint8()/ 127.5-1;
								floatData[subOffset+1]=LoadModelV05._readData.getUint8()/ 127.5-1;
								floatData[subOffset+2]=LoadModelV05._readData.getUint8()/ 127.5-1;
								floatData[subOffset+3]=LoadModelV05._readData.getUint8()/ 127.5-1;
								verOffset+=16;
								break ;
							}
					}
				}
				LoadModelV05._readData.pos=lastPosition;
				break ;
			};
			var vertexBuffer=new VertexBuffer3D(vertexData.byteLength,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4,true);
			vertexBuffer.vertexDeclaration=vertexDeclaration;
			vertexBuffer.setData(floatData);
			LoadModelV05._mesh._vertexBuffers.push(vertexBuffer);
			LoadModelV05._mesh._vertexCount+=vertexBuffer.vertexCount;
			memorySize+=floatData.length *4;
		};
		var ibStart=offset+LoadModelV05._readData.getUint32();
		var ibLength=LoadModelV05._readData.getUint32();
		var ibDatas=new Uint16Array(arrayBuffer.slice(ibStart,ibStart+ibLength));
		var indexBuffer=new IndexBuffer3D(/*laya.d3.graphics.IndexBuffer3D.INDEXTYPE_USHORT*/"ushort",ibLength / 2,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4,true);
		indexBuffer.setData(ibDatas);
		LoadModelV05._mesh._indexBuffer=indexBuffer;
		memorySize+=indexBuffer.indexCount *2;
		LoadModelV05._mesh._setCPUMemory(memorySize);
		LoadModelV05._mesh._setGPUMemory(memorySize);
		var boneNames=LoadModelV05._mesh._boneNames=[];
		var boneCount=LoadModelV05._readData.getUint16();
		boneNames.length=boneCount;
		for (i=0;i < boneCount;i++)
		boneNames[i]=LoadModelV05._strings[LoadModelV05._readData.getUint16()];
		var bindPoseDataStart=LoadModelV05._readData.getUint32();
		var bindPoseDataLength=LoadModelV05._readData.getUint32();
		var bindPoseDatas=new Float32Array(arrayBuffer.slice(offset+bindPoseDataStart,offset+bindPoseDataStart+bindPoseDataLength));
		var bindPoseFloatCount=bindPoseDatas.length;
		var bindPoseCount=bindPoseFloatCount / 16;
		var bindPoseBuffer=LoadModelV05._mesh._inverseBindPosesBuffer=new ArrayBuffer(bindPoseFloatCount *4);
		LoadModelV05._mesh._inverseBindPoses=__newvec(bindPoseCount);
		for (i=0;i < bindPoseFloatCount;i+=16){
			var inverseGlobalBindPose=new Matrix4x4(bindPoseDatas[i+0],bindPoseDatas[i+1],bindPoseDatas[i+2],bindPoseDatas[i+3],bindPoseDatas[i+4],bindPoseDatas[i+5],bindPoseDatas[i+6],bindPoseDatas[i+7],bindPoseDatas[i+8],bindPoseDatas[i+9],bindPoseDatas[i+10],bindPoseDatas[i+11],bindPoseDatas[i+12],bindPoseDatas[i+13],bindPoseDatas[i+14],bindPoseDatas[i+15],new Float32Array(bindPoseBuffer,i *4,16));
			LoadModelV05._mesh._inverseBindPoses[i / 16]=inverseGlobalBindPose;
		}
		return true;
	}

	LoadModelV05.READ_SUBMESH=function(){
		var arrayBuffer=LoadModelV05._readData.__getBuffer();
		var submesh=new SubMesh(LoadModelV05._mesh);
		var vbIndex=LoadModelV05._readData.getInt16();
		var ibStart=LoadModelV05._readData.getUint32();
		var ibCount=LoadModelV05._readData.getUint32();
		var indexBuffer=LoadModelV05._mesh._indexBuffer;
		submesh._indexBuffer=indexBuffer;
		submesh._indexStart=ibStart;
		submesh._indexCount=ibCount;
		submesh._indices=new Uint16Array(indexBuffer.getData().buffer,ibStart *2,ibCount);
		var vertexBuffer=LoadModelV05._mesh._vertexBuffers[vbIndex];
		submesh._vertexBuffer=vertexBuffer;
		var bufferState=submesh._bufferState;
		bufferState.bind();
		bufferState.applyVertexBuffer(vertexBuffer);
		bufferState.applyIndexBuffer(indexBuffer);
		bufferState.unBind();
		var offset=LoadModelV05._DATA.offset;
		var subIndexBufferStart=submesh._subIndexBufferStart;
		var subIndexBufferCount=submesh._subIndexBufferCount;
		var boneIndicesList=submesh._boneIndicesList;
		var drawCount=LoadModelV05._readData.getUint16();
		subIndexBufferStart.length=drawCount;
		subIndexBufferCount.length=drawCount;
		boneIndicesList.length=drawCount;
		var pathMarks=LoadModelV05._mesh._skinDataPathMarks;
		var bindPoseIndices=LoadModelV05._bindPoseIndices;
		var subMeshIndex=LoadModelV05._subMeshes.length;
		for (var i=0;i < drawCount;i++){
			subIndexBufferStart[i]=LoadModelV05._readData.getUint32();
			subIndexBufferCount[i]=LoadModelV05._readData.getUint32();
			var boneDicofs=LoadModelV05._readData.getUint32();
			var boneDicCount=LoadModelV05._readData.getUint32();
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
		LoadModelV05._subMeshes.push(submesh);
		return true;
	}

	LoadModelV05._strings=[];
	LoadModelV05._readData=null;
	LoadModelV05._version=null;
	LoadModelV05._mesh=null;
	LoadModelV05._subMeshes=null;
	LoadModelV05._bindPoseIndices=[];
	__static(LoadModelV05,
	['_BLOCK',function(){return this._BLOCK={count:0};},'_DATA',function(){return this._DATA={offset:0,size:0};}
	]);
	return LoadModelV05;
})()


/**

*/
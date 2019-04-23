/**
*<code>PrimitiveMesh</code> 类用于创建简单网格。
*/
//class laya.d3.resource.models.PrimitiveMesh
var PrimitiveMesh=(function(){
	function PrimitiveMesh(){}
	__class(PrimitiveMesh,'laya.d3.resource.models.PrimitiveMesh');
	PrimitiveMesh._createMesh=function(vertexDeclaration,vertices,indices){
		var mesh=new Mesh();
		var subMesh=new SubMesh(mesh);
		var vertexBuffer=new VertexBuffer3D(vertices.length *4,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4,true);
		vertexBuffer.vertexDeclaration=vertexDeclaration;
		vertexBuffer.setData(vertices);
		mesh._vertexBuffers.push(vertexBuffer);
		mesh._vertexCount+=vertexBuffer.vertexCount;
		var indexBuffer=new IndexBuffer3D(/*laya.d3.graphics.IndexBuffer3D.INDEXTYPE_USHORT*/"ushort",indices.length,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4,true);
		indexBuffer.setData(indices);
		mesh._indexBuffer=indexBuffer;
		var bufferState=subMesh._bufferState;
		bufferState.bind();
		bufferState.applyVertexBuffer(vertexBuffer);
		bufferState.applyIndexBuffer(indexBuffer);
		bufferState.unBind();
		subMesh._vertexBuffer=vertexBuffer;
		subMesh._indexBuffer=indexBuffer;
		subMesh._indexStart=0;
		subMesh._indexCount=indexBuffer.indexCount;
		var subIndexBufferStart=subMesh._subIndexBufferStart;
		var subIndexBufferCount=subMesh._subIndexBufferCount;
		var boneIndicesList=subMesh._boneIndicesList;
		subIndexBufferStart.length=1;
		subIndexBufferCount.length=1;
		boneIndicesList.length=1;
		subIndexBufferStart[0]=0;
		subIndexBufferCount[0]=indexBuffer.indexCount;
		var subMeshes=[];
		subMeshes.push(subMesh);
		mesh._setSubMeshes(subMeshes);
		var memorySize=vertexBuffer._byteLength+indexBuffer._byteLength;
		mesh._setCPUMemory(memorySize);
		mesh._setGPUMemory(memorySize);
		return mesh;
	}

	PrimitiveMesh.createBox=function(long,height,width){
		(long===void 0)&& (long=1);
		(height===void 0)&& (height=1);
		(width===void 0)&& (width=1);
		var vertexCount=24;
		var indexCount=36;
		var vertexDeclaration=VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
		var halfLong=long / 2;
		var halfHeight=height / 2;
		var halfWidth=width / 2;
		var vertices=new Float32Array([
		-halfLong,halfHeight,-halfWidth,0,1,0,0,0,halfLong,halfHeight,-halfWidth,0,1,0,1,0,halfLong,halfHeight,halfWidth,0,1,0,1,1,-halfLong,halfHeight,halfWidth,0,1,0,0,1,
		-halfLong,-halfHeight,-halfWidth,0,-1,0,0,1,halfLong,-halfHeight,-halfWidth,0,-1,0,1,1,halfLong,-halfHeight,halfWidth,0,-1,0,1,0,-halfLong,-halfHeight,halfWidth,0,-1,0,0,0,
		-halfLong,halfHeight,-halfWidth,-1,0,0,0,0,-halfLong,halfHeight,halfWidth,-1,0,0,1,0,-halfLong,-halfHeight,halfWidth,-1,0,0,1,1,-halfLong,-halfHeight,-halfWidth,-1,0,0,0,1,
		halfLong,halfHeight,-halfWidth,1,0,0,1,0,halfLong,halfHeight,halfWidth,1,0,0,0,0,halfLong,-halfHeight,halfWidth,1,0,0,0,1,halfLong,-halfHeight,-halfWidth,1,0,0,1,1,
		-halfLong,halfHeight,halfWidth,0,0,1,0,0,halfLong,halfHeight,halfWidth,0,0,1,1,0,halfLong,-halfHeight,halfWidth,0,0,1,1,1,-halfLong,-halfHeight,halfWidth,0,0,1,0,1,
		-halfLong,halfHeight,-halfWidth,0,0,-1,1,0,halfLong,halfHeight,-halfWidth,0,0,-1,0,0,halfLong,-halfHeight,-halfWidth,0,0,-1,0,1,-halfLong,-halfHeight,-halfWidth,0,0,-1,1,1]);
		var indices=new Uint16Array([
		0,1,2,2,3,0,
		4,7,6,6,5,4,
		8,9,10,10,11,8,
		12,15,14,14,13,12,
		16,17,18,18,19,16,
		20,23,22,22,21,20]);
		return PrimitiveMesh._createMesh(vertexDeclaration,vertices,indices);
	}

	PrimitiveMesh.createCapsule=function(radius,height,stacks,slices){
		(radius===void 0)&& (radius=0.5);
		(height===void 0)&& (height=2);
		(stacks===void 0)&& (stacks=16);
		(slices===void 0)&& (slices=32);
		var vertexCount=(stacks+1)*(slices+1)*2+(slices+1)*2;
		var indexCount=(3 *stacks *(slices+1))*2 *2+2 *slices *3;
		var vertexDeclaration=VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
		var vertexFloatStride=vertexDeclaration.vertexStride / 4;
		var vertices=new Float32Array(vertexCount *vertexFloatStride);
		var indices=new Uint16Array(indexCount);
		var stackAngle=(Math.PI / 2.0)/ stacks;
		var sliceAngle=(Math.PI *2.0)/ slices;
		var hcHeight=height / 2-radius;
		var posX=0;
		var posY=0;
		var posZ=0;
		var vc=0;
		var ic=0;
		var verticeCount=0;
		var stack=0,slice=0;
		for (stack=0;stack <=stacks;stack++){
			for (slice=0;slice <=slices;slice++){
				posX=radius *Math.cos(stack *stackAngle)*Math.cos(slice *sliceAngle+Math.PI);
				posY=radius *Math.sin(stack *stackAngle);
				posZ=radius *Math.cos(stack *stackAngle)*Math.sin(slice *sliceAngle+Math.PI);
				vertices[vc++]=posX;
				vertices[vc++]=posY+hcHeight;
				vertices[vc++]=posZ;
				vertices[vc++]=posX;
				vertices[vc++]=posY;
				vertices[vc++]=posZ;
				vertices[vc++]=1-slice / slices;
				vertices[vc++]=(1-stack / stacks)*((Math.PI *radius / 2)/ (height+Math.PI *radius));
				if (stack < stacks){
					indices[ic++]=(stack *(slices+1))+slice+(slices+1);
					indices[ic++]=(stack *(slices+1))+slice;
					indices[ic++]=(stack *(slices+1))+slice+1;
					indices[ic++]=(stack *(slices+1))+slice+(slices);
					indices[ic++]=(stack *(slices+1))+slice;
					indices[ic++]=(stack *(slices+1))+slice+(slices+1);
				}
			}
		}
		verticeCount+=(stacks+1)*(slices+1);
		for (stack=0;stack <=stacks;stack++){
			for (slice=0;slice <=slices;slice++){
				posX=radius *Math.cos(stack *stackAngle)*Math.cos(slice *sliceAngle+Math.PI);
				posY=radius *Math.sin(-stack *stackAngle);
				posZ=radius *Math.cos(stack *stackAngle)*Math.sin(slice *sliceAngle+Math.PI);
				vertices[vc++]=posX;
				vertices[vc++]=posY-hcHeight;
				vertices[vc++]=posZ;
				vertices[vc++]=posX;
				vertices[vc++]=posY;
				vertices[vc++]=posZ;
				vertices[vc++]=1-slice / slices;
				vertices[vc++]=((stack / stacks)*(Math.PI *radius / 2)+(height+Math.PI *radius / 2))/ (height+Math.PI *radius);
				if (stack < stacks){
					indices[ic++]=verticeCount+(stack *(slices+1))+slice;
					indices[ic++]=verticeCount+(stack *(slices+1))+slice+(slices+1);
					indices[ic++]=verticeCount+(stack *(slices+1))+slice+1;
					indices[ic++]=verticeCount+(stack *(slices+1))+slice;
					indices[ic++]=verticeCount+(stack *(slices+1))+slice+(slices);
					indices[ic++]=verticeCount+(stack *(slices+1))+slice+(slices+1);
				}
			}
		}
		verticeCount+=(stacks+1)*(slices+1);
		for (slice=0;slice <=slices;slice++){
			posX=radius *Math.cos(slice *sliceAngle+Math.PI);
			posY=hcHeight;
			posZ=radius *Math.sin(slice *sliceAngle+Math.PI);
			vertices[vc++]=posX;
			vertices[vc+(slices+1)*8-1]=posX;
			vertices[vc++]=posY;
			vertices[vc+(slices+1)*8-1]=-posY;
			vertices[vc++]=posZ;
			vertices[vc+(slices+1)*8-1]=posZ;
			vertices[vc++]=posX;
			vertices[vc+(slices+1)*8-1]=posX;
			vertices[vc++]=0;
			vertices[vc+(slices+1)*8-1]=0;
			vertices[vc++]=posZ;
			vertices[vc+(slices+1)*8-1]=posZ;
			vertices[vc++]=1-slice *1 / slices;
			vertices[vc+(slices+1)*8-1]=1-slice *1 / slices;
			vertices[vc++]=(Math.PI *radius / 2)/ (height+Math.PI *radius);
			vertices[vc+(slices+1)*8-1]=(Math.PI *radius / 2+height)/ (height+Math.PI *radius);
		}
		for (slice=0;slice < slices;slice++){
			indices[ic++]=slice+verticeCount+(slices+1);
			indices[ic++]=slice+verticeCount+1;
			indices[ic++]=slice+verticeCount;
			indices[ic++]=slice+verticeCount+(slices+1);
			indices[ic++]=slice+verticeCount+(slices+1)+1;
			indices[ic++]=slice+verticeCount+1;
		}
		verticeCount+=2 *(slices+1);
		return PrimitiveMesh._createMesh(vertexDeclaration,vertices,indices);
	}

	PrimitiveMesh.createCone=function(radius,height,slices){
		(radius===void 0)&& (radius=0.5);
		(height===void 0)&& (height=1);
		(slices===void 0)&& (slices=32);
		var vertexCount=(slices+1+1)+(slices+1)*2;
		var indexCount=6 *slices+3 *slices;
		var vertexDeclaration=VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
		var vertexFloatStride=vertexDeclaration.vertexStride / 4;
		var vertices=new Float32Array(vertexCount *vertexFloatStride);
		var indices=new Uint16Array(indexCount);
		var sliceAngle=(Math.PI *2.0)/ slices;
		var halfHeight=height / 2;
		var curAngle=0;
		var verticeCount=0;
		var posX=0;
		var posY=0;
		var posZ=0;
		var normal=new Vector3();
		var downV3=new Vector3(0,-1,0);
		var upPoint=new Vector3(0,halfHeight,0);
		var downPoint=new Vector3();
		var v3=new Vector3();
		var q4=new Quaternion();
		var rotateAxis=new Vector3();
		var rotateRadius=NaN;
		var vc=0;
		var ic=0;
		for (var rv=0;rv <=slices;rv++){
			curAngle=rv *sliceAngle;
			posX=Math.cos(curAngle+Math.PI)*radius;
			posY=halfHeight;
			posZ=Math.sin(curAngle+Math.PI)*radius;
			vertices[vc++]=0;
			vertices[vc+(slices+1)*8-1]=posX;
			vertices[vc++]=posY;
			vertices[vc+(slices+1)*8-1]=-posY;
			vertices[vc++]=0;
			vertices[vc+(slices+1)*8-1]=posZ;
			normal.x=posX;
			normal.y=0;
			normal.z=posZ;
			downPoint.x=posX;
			downPoint.y=-posY;
			downPoint.z=posZ;
			Vector3.subtract(downPoint,upPoint,v3);
			Vector3.normalize(v3,v3);
			rotateRadius=Math.acos(Vector3.dot(downV3,v3));
			Vector3.cross(downV3,v3,rotateAxis);
			Vector3.normalize(rotateAxis,rotateAxis);
			Quaternion.createFromAxisAngle(rotateAxis,rotateRadius,q4);
			Vector3.normalize(normal,normal);
			Vector3.transformQuat(normal,q4,normal);
			Vector3.normalize(normal,normal);
			vertices[vc++]=normal.x;
			vertices[vc+(slices+1)*8-1]=normal.x;
			vertices[vc++]=normal.y;
			vertices[vc+(slices+1)*8-1]=normal.y;
			vertices[vc++]=normal.z;
			vertices[vc+(slices+1)*8-1]=normal.z;
			vertices[vc++]=1-rv *1 / slices;
			vertices[vc+(slices+1)*8-1]=1-rv *1 / slices;
			vertices[vc++]=0;
			vertices[vc+(slices+1)*8-1]=1;
		}
		vc+=(slices+1)*8;
		for (var ri=0;ri < slices;ri++){
			indices[ic++]=ri+verticeCount+(slices+1);
			indices[ic++]=ri+verticeCount+1;
			indices[ic++]=ri+verticeCount;
			indices[ic++]=ri+verticeCount+(slices+1);
			indices[ic++]=ri+verticeCount+(slices+1)+1;
			indices[ic++]=ri+verticeCount+1;
		}
		verticeCount+=2 *(slices+1);
		for (var bv=0;bv <=slices;bv++){
			if (bv===0){
				vertices[vc++]=0;
				vertices[vc++]=-halfHeight;
				vertices[vc++]=0;
				vertices[vc++]=0;
				vertices[vc++]=-1;
				vertices[vc++]=0;
				vertices[vc++]=0.5;
				vertices[vc++]=0.5;
			}
			curAngle=bv *sliceAngle;
			posX=Math.cos(curAngle+Math.PI)*radius;
			posY=-halfHeight;
			posZ=Math.sin(curAngle+Math.PI)*radius;
			vertices[vc++]=posX;
			vertices[vc++]=posY;
			vertices[vc++]=posZ;
			vertices[vc++]=0;
			vertices[vc++]=-1;
			vertices[vc++]=0;
			vertices[vc++]=0.5+Math.cos(curAngle)*0.5;
			vertices[vc++]=0.5+Math.sin(curAngle)*0.5;
		}
		for (var bi=0;bi < slices;bi++){
			indices[ic++]=0+verticeCount;
			indices[ic++]=bi+2+verticeCount;
			indices[ic++]=bi+1+verticeCount;
		}
		verticeCount+=slices+1+1;
		return PrimitiveMesh._createMesh(vertexDeclaration,vertices,indices);
	}

	PrimitiveMesh.createCylinder=function(radius,height,slices){
		(radius===void 0)&& (radius=0.5);
		(height===void 0)&& (height=2);
		(slices===void 0)&& (slices=32);
		var vertexCount=(slices+1+1)+(slices+1)*2+(slices+1+1);
		var indexCount=3 *slices+6 *slices+3 *slices;
		var vertexDeclaration=VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
		var vertexFloatStride=vertexDeclaration.vertexStride / 4;
		var vertices=new Float32Array(vertexCount *vertexFloatStride);
		var indices=new Uint16Array(indexCount);
		var sliceAngle=(Math.PI *2.0)/ slices;
		var halfHeight=height / 2;
		var curAngle=0;
		var verticeCount=0;
		var posX=0;
		var posY=0;
		var posZ=0;
		var vc=0;
		var ic=0;
		for (var tv=0;tv <=slices;tv++){
			if (tv===0){
				vertices[vc++]=0;
				vertices[vc++]=halfHeight;
				vertices[vc++]=0;
				vertices[vc++]=0;
				vertices[vc++]=1;
				vertices[vc++]=0;
				vertices[vc++]=0.5;
				vertices[vc++]=0.5;
			}
			curAngle=tv *sliceAngle;
			posX=Math.cos(curAngle)*radius;
			posY=halfHeight;
			posZ=Math.sin(curAngle)*radius;
			vertices[vc++]=posX;
			vertices[vc++]=posY;
			vertices[vc++]=posZ;
			vertices[vc++]=0;
			vertices[vc++]=1;
			vertices[vc++]=0;
			vertices[vc++]=0.5+Math.cos(curAngle)*0.5;
			vertices[vc++]=0.5+Math.sin(curAngle)*0.5;
		}
		for (var ti=0;ti < slices;ti++){
			indices[ic++]=0;
			indices[ic++]=ti+1;
			indices[ic++]=ti+2;
		}
		verticeCount+=slices+1+1;
		for (var rv=0;rv <=slices;rv++){
			curAngle=rv *sliceAngle;
			posX=Math.cos(curAngle+Math.PI)*radius;
			posY=halfHeight;
			posZ=Math.sin(curAngle+Math.PI)*radius;
			vertices[vc++]=posX;
			vertices[vc+(slices+1)*8-1]=posX;
			vertices[vc++]=posY;
			vertices[vc+(slices+1)*8-1]=-posY;
			vertices[vc++]=posZ;
			vertices[vc+(slices+1)*8-1]=posZ;
			vertices[vc++]=posX;
			vertices[vc+(slices+1)*8-1]=posX;
			vertices[vc++]=0;
			vertices[vc+(slices+1)*8-1]=0;
			vertices[vc++]=posZ;
			vertices[vc+(slices+1)*8-1]=posZ;
			vertices[vc++]=1-rv *1 / slices;
			vertices[vc+(slices+1)*8-1]=1-rv *1 / slices;
			vertices[vc++]=0;
			vertices[vc+(slices+1)*8-1]=1;
		}
		vc+=(slices+1)*8;
		for (var ri=0;ri < slices;ri++){
			indices[ic++]=ri+verticeCount+(slices+1);
			indices[ic++]=ri+verticeCount+1;
			indices[ic++]=ri+verticeCount;
			indices[ic++]=ri+verticeCount+(slices+1);
			indices[ic++]=ri+verticeCount+(slices+1)+1;
			indices[ic++]=ri+verticeCount+1;
		}
		verticeCount+=2 *(slices+1);
		for (var bv=0;bv <=slices;bv++){
			if (bv===0){
				vertices[vc++]=0;
				vertices[vc++]=-halfHeight;
				vertices[vc++]=0;
				vertices[vc++]=0;
				vertices[vc++]=-1;
				vertices[vc++]=0;
				vertices[vc++]=0.5;
				vertices[vc++]=0.5;
			}
			curAngle=bv *sliceAngle;
			posX=Math.cos(curAngle+Math.PI)*radius;
			posY=-halfHeight;
			posZ=Math.sin(curAngle+Math.PI)*radius;
			vertices[vc++]=posX;
			vertices[vc++]=posY;
			vertices[vc++]=posZ;
			vertices[vc++]=0;
			vertices[vc++]=-1;
			vertices[vc++]=0;
			vertices[vc++]=0.5+Math.cos(curAngle)*0.5;
			vertices[vc++]=0.5+Math.sin(curAngle)*0.5;
		}
		for (var bi=0;bi < slices;bi++){
			indices[ic++]=0+verticeCount;
			indices[ic++]=bi+2+verticeCount;
			indices[ic++]=bi+1+verticeCount;
		}
		verticeCount+=slices+1+1;
		return PrimitiveMesh._createMesh(vertexDeclaration,vertices,indices);
	}

	PrimitiveMesh.createPlane=function(long,width,stacks,slices){
		(long===void 0)&& (long=10);
		(width===void 0)&& (width=10);
		(stacks===void 0)&& (stacks=10);
		(slices===void 0)&& (slices=10);
		var vertexCount=(stacks+1)*(slices+1);
		var indexCount=stacks *slices *2 *3;
		var indices=new Uint16Array(indexCount);
		var vertexDeclaration=VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
		var vertexFloatStride=vertexDeclaration.vertexStride / 4;
		var vertices=new Float32Array(vertexCount *vertexFloatStride);
		var halfLong=long / 2;
		var halfWidth=width / 2;
		var stacksLong=long / stacks;
		var slicesWidth=width / slices;
		var verticeCount=0;
		for (var i=0;i <=slices;i++){
			for (var j=0;j <=stacks;j++){
				vertices[verticeCount++]=j *stacksLong-halfLong;
				vertices[verticeCount++]=0;
				vertices[verticeCount++]=i *slicesWidth-halfWidth;
				vertices[verticeCount++]=0;
				vertices[verticeCount++]=1;
				vertices[verticeCount++]=0;
				vertices[verticeCount++]=j *1 / stacks;
				vertices[verticeCount++]=i *1 / slices;
			}
		};
		var indiceIndex=0;
		for (i=0;i < slices;i++){
			for (j=0;j < stacks;j++){
				indices[indiceIndex++]=(i+1)*(stacks+1)+j;
				indices[indiceIndex++]=i *(stacks+1)+j;
				indices[indiceIndex++]=(i+1)*(stacks+1)+j+1;
				indices[indiceIndex++]=i *(stacks+1)+j;
				indices[indiceIndex++]=i *(stacks+1)+j+1;
				indices[indiceIndex++]=(i+1)*(stacks+1)+j+1;
			}
		}
		return PrimitiveMesh._createMesh(vertexDeclaration,vertices,indices);
	}

	PrimitiveMesh.createQuad=function(long,width){
		(long===void 0)&& (long=1);
		(width===void 0)&& (width=1);
		var vertexCount=4;
		var indexCount=6;
		var vertexDeclaration=VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
		var vertexFloatStride=vertexDeclaration.vertexStride / 4;
		var halfLong=long / 2;
		var halfWidth=width / 2;
		var vertices=new Float32Array([
		-halfLong,halfWidth,0,0,0,1,0,0,halfLong,halfWidth,0,0,0,1,1,0,-halfLong,-halfWidth,0,0,0,1,0,1,halfLong,-halfWidth,0,0,0,1,1,1,]);
		var indices=new Uint16Array([
		0,1,2,3,2,1,]);
		return PrimitiveMesh._createMesh(vertexDeclaration,vertices,indices);
	}

	PrimitiveMesh.createSphere=function(radius,stacks,slices){
		(radius===void 0)&& (radius=0.5);
		(stacks===void 0)&& (stacks=32);
		(slices===void 0)&& (slices=32);
		var vertexCount=(stacks+1)*(slices+1);
		var indexCount=(3 *stacks *(slices+1))*2;
		var indices=new Uint16Array(indexCount);
		var vertexDeclaration=VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
		var vertexFloatStride=vertexDeclaration.vertexStride / 4;
		var vertices=new Float32Array(vertexCount *vertexFloatStride);
		var stackAngle=Math.PI / stacks;
		var sliceAngle=(Math.PI *2.0)/ slices;
		var vertexIndex=0;
		vertexCount=0;
		indexCount=0;
		for (var stack=0;stack < (stacks+1);stack++){
			var r=Math.sin(stack *stackAngle);
			var y=Math.cos(stack *stackAngle);
			for (var slice=0;slice < (slices+1);slice++){
				var x=r *Math.sin(slice *sliceAngle+Math.PI *1 / 2);
				var z=r *Math.cos(slice *sliceAngle+Math.PI *1 / 2);
				vertices[vertexCount+0]=x *radius;
				vertices[vertexCount+1]=y *radius;
				vertices[vertexCount+2]=z *radius;
				vertices[vertexCount+3]=x;
				vertices[vertexCount+4]=y;
				vertices[vertexCount+5]=z;
				vertices[vertexCount+6]=slice / slices;
				vertices[vertexCount+7]=stack / stacks;
				vertexCount+=vertexFloatStride;
				if (stack !=(stacks-1)){
					indices[indexCount++]=vertexIndex+(slices+1);
					indices[indexCount++]=vertexIndex;
					indices[indexCount++]=vertexIndex+1;
					indices[indexCount++]=vertexIndex+(slices);
					indices[indexCount++]=vertexIndex;
					indices[indexCount++]=vertexIndex+(slices+1);
					vertexIndex++;
				}
			}
		}
		return PrimitiveMesh._createMesh(vertexDeclaration,vertices,indices);
	}

	return PrimitiveMesh;
})()


/**

*/
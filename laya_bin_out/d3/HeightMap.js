/**
*<code>HeightMap</code> 类用于实现高度图数据。
*/
//class laya.d3.core.HeightMap
var HeightMap=(function(){
	function HeightMap(width,height,minHeight,maxHeight){
		/**@private */
		this._datas=null;
		/**@private */
		this._w=0;
		/**@private */
		this._h=0;
		/**@private */
		this._minHeight=NaN;
		/**@private */
		this._maxHeight=NaN;
		this._datas=[];
		this._w=width;
		this._h=height;
		this._minHeight=minHeight;
		this._maxHeight=maxHeight;
	}

	__class(HeightMap,'laya.d3.core.HeightMap');
	var __proto=HeightMap.prototype;
	/**@private */
	__proto._inBounds=function(row,col){
		return row >=0 && row < this._h && col >=0 && col < this._w;
	}

	/**
	*获取高度。
	*@param row 列数。
	*@param col 行数。
	*@return 高度。
	*/
	__proto.getHeight=function(row,col){
		if (this._inBounds(row,col))
			return this._datas[row][col];
		else
		return NaN;
	}

	/**
	*获取宽度。
	*@return value 宽度。
	*/
	__getset(0,__proto,'width',function(){
		return this._w;
	});

	/**
	*获取高度。
	*@return value 高度。
	*/
	__getset(0,__proto,'height',function(){
		return this._h;
	});

	/**
	*最大高度。
	*@return value 最大高度。
	*/
	__getset(0,__proto,'maxHeight',function(){
		return this._maxHeight;
	});

	/**
	*最大高度。
	*@return value 最大高度。
	*/
	__getset(0,__proto,'minHeight',function(){
		return this._minHeight;
	});

	HeightMap.creatFromMesh=function(mesh,width,height,outCellSize){
		var vertices=[];
		var indexs=[];
		var submesheCount=mesh.subMeshCount;
		for (var i=0;i < submesheCount;i++){
			var subMesh=mesh._getSubMesh(i);
			var vertexBuffer=subMesh._vertexBuffer;
			var verts=vertexBuffer.getData();
			var subMeshVertices=[];
			for (var j=0;j < verts.length;j+=vertexBuffer.vertexDeclaration.vertexStride / 4){
				var position=new Vector3(verts[j+0],verts[j+1],verts[j+2]);
				subMeshVertices.push(position);
			}
			vertices.push(subMeshVertices);
			var ib=subMesh._indexBuffer;
			indexs.push(ib.getData());
		};
		var boundingBox=mesh.boundingBox;
		var minX=boundingBox.min.x;
		var minZ=boundingBox.min.z;
		var maxX=boundingBox.max.x;
		var maxZ=boundingBox.max.z;
		var minY=boundingBox.min.y;
		var maxY=boundingBox.max.y;
		var widthSize=maxX-minX;
		var heightSize=maxZ-minZ;
		var cellWidth=outCellSize.elements[0]=widthSize / (width-1);
		var cellHeight=outCellSize.elements[1]=heightSize / (height-1);
		var heightMap=new HeightMap(width,height,minY,maxY);
		var ray=HeightMap._tempRay;
		var rayDirE=ray.direction.elements;
		rayDirE[0]=0;
		rayDirE[1]=-1;
		rayDirE[2]=0;
		var heightOffset=0.1;
		var rayY=maxY+heightOffset;
		ray.origin.elements[1]=rayY;
		for (var h=0;h < height;h++){
			var posZ=minZ+h *cellHeight;
			heightMap._datas[h]=[];
			for (var w=0;w < width;w++){
				var posX=minX+w *cellWidth;
				var rayOriE=ray.origin.elements;
				rayOriE[0]=posX;
				rayOriE[2]=posZ;
				var closestIntersection=HeightMap._getPosition(ray,vertices,indexs);
				heightMap._datas[h][w]=(closestIntersection===Number.MAX_VALUE)? NaN :rayY-closestIntersection;
			}
		}
		return heightMap;
	}

	HeightMap.createFromImage=function(texture,minHeight,maxHeight){
		var textureWidth=texture.width;
		var textureHeight=texture.height;
		var heightMap=new HeightMap(textureWidth,textureHeight,minHeight,maxHeight);
		var compressionRatio=(maxHeight-minHeight)/ 254;
		var pixelsInfo=texture.getPixels();
		var index=0;
		for (var h=0;h <textureHeight;h++){
			var colDatas=heightMap._datas[h]=[];
			for (var w=0;w < textureWidth;w++){
				var r=pixelsInfo[index++];
				var g=pixelsInfo[index++];
				var b=pixelsInfo[index++];
				var a=pixelsInfo[index++];
				if (r==255 && g==255 && b==255 && a==255)
					colDatas[w]=NaN;
				else {
					colDatas[w]=(r+g+b)/ 3 *compressionRatio+minHeight;
				}
			}
		}
		return heightMap;
	}

	HeightMap._getPosition=function(ray,vertices,indexs){
		var closestIntersection=Number.MAX_VALUE;
		for (var i=0;i < vertices.length;i++){
			var subMeshVertices=vertices[i];
			var subMeshIndexes=indexs[i];
			for (var j=0;j < subMeshIndexes.length;j+=3){
				var vertex1=subMeshVertices[subMeshIndexes[j+0]];
				var vertex2=subMeshVertices[subMeshIndexes[j+1]];
				var vertex3=subMeshVertices[subMeshIndexes[j+2]];
				var intersection=Picker.rayIntersectsTriangle(ray,vertex1,vertex2,vertex3);
				if (!isNaN(intersection)&& intersection < closestIntersection){
					closestIntersection=intersection;
				}
			}
		}
		return closestIntersection;
	}

	__static(HeightMap,
	['_tempRay',function(){return this._tempRay=new Ray(new Vector3(),new Vector3());}
	]);
	return HeightMap;
})()


/**

*/
/**
*<code>TerrainLeaf</code> Terrain的叶子节点
*/
//class laya.d3.terrain.TerrainLeaf
var TerrainLeaf=(function(){
	function TerrainLeaf(){
		this._boundingSphere=null;
		this._boundingBox=null;
		this._sizeOfY=null;
		this._currentLODLevel=0;
		this._lastDistanceToEye=NaN;
		this._originalBoundingSphere=null;
		this._originalBoundingBox=null;
		this._originalBoundingBoxCorners=null;
		this._bUseStrip=false;
		this._gridSize=NaN;
		this._beginGridX=0;
		//针对整个大地形的偏移
		this._beginGridZ=0;
		//针对整个大地形的偏移
		this._LODError=null;
		TerrainLeaf.__init__();
		this._currentLODLevel=0;
	}

	__class(TerrainLeaf,'laya.d3.terrain.TerrainLeaf');
	var __proto=TerrainLeaf.prototype;
	__proto.calcVertextNorml=function(x,z,terrainHeightData,heighDataWidth,heightDataHeight,normal){
		var dZ=0,dX=0;
		dX=TerrainLeaf.getHeightFromTerrainHeightData(x-1,z-1,terrainHeightData,heighDataWidth,heightDataHeight)*-1.0;
		dX+=TerrainLeaf.getHeightFromTerrainHeightData(x-1,z,terrainHeightData,heighDataWidth,heightDataHeight)*-1.0;
		dX+=TerrainLeaf.getHeightFromTerrainHeightData(x-1,z+1,terrainHeightData,heighDataWidth,heightDataHeight)*-1.0;
		dX+=TerrainLeaf.getHeightFromTerrainHeightData(x+1,z-1,terrainHeightData,heighDataWidth,heightDataHeight)*1.0;
		dX+=TerrainLeaf.getHeightFromTerrainHeightData(x+1,z,terrainHeightData,heighDataWidth,heightDataHeight)*1.0;
		dX+=TerrainLeaf.getHeightFromTerrainHeightData(x+1,z+1,terrainHeightData,heighDataWidth,heightDataHeight)*1.0;
		dZ=TerrainLeaf.getHeightFromTerrainHeightData(x-1,z-1,terrainHeightData,heighDataWidth,heightDataHeight)*-1.0;
		dZ+=TerrainLeaf.getHeightFromTerrainHeightData(x,z-1,terrainHeightData,heighDataWidth,heightDataHeight)*-1.0;
		dZ+=TerrainLeaf.getHeightFromTerrainHeightData(x+1,z-1,terrainHeightData,heighDataWidth,heightDataHeight)*-1.0;
		dZ+=TerrainLeaf.getHeightFromTerrainHeightData(x-1,z+1,terrainHeightData,heighDataWidth,heightDataHeight)*1.0;
		dZ+=TerrainLeaf.getHeightFromTerrainHeightData(x,z+1,terrainHeightData,heighDataWidth,heightDataHeight)*1.0;
		dZ+=TerrainLeaf.getHeightFromTerrainHeightData(x+1,z+1,terrainHeightData,heighDataWidth,heightDataHeight)*1.0;
		normal.x=-dX;
		normal.y=6;
		normal.z=-dZ;
		Vector3.normalize(normal,normal);
	}

	__proto.calcVertextNormlUV=function(x,z,terrainWidth,terrainHeight,normal){
		normal.x=x / terrainWidth;
		normal.y=z / terrainHeight;
		normal.z=z / terrainHeight;
	}

	__proto.calcVertextBuffer=function(offsetChunkX,offsetChunkZ,beginX,beginZ,girdSize,vertextBuffer,offset,strideSize,terrainHeightData,heighDataWidth,heightDataHeight,cameraCoordinateInverse){
		if (cameraCoordinateInverse==true && !TerrainLeaf.__ADAPT_MATRIX__){
			TerrainLeaf.__ADAPT_MATRIX__=new Matrix4x4();
			var mat=new Matrix4x4();
			Matrix4x4.createRotationY(Math.PI,TerrainLeaf.__ADAPT_MATRIX__);
			Matrix4x4.createTranslate(new Vector3(0,0,(heightDataHeight-1)*girdSize),mat);
			Matrix4x4.multiply(mat,TerrainLeaf.__ADAPT_MATRIX__,TerrainLeaf.__ADAPT_MATRIX__);
			TerrainLeaf.__ADAPT_MATRIX_INV__=new Matrix4x4();
			TerrainLeaf.__ADAPT_MATRIX__.invert(TerrainLeaf.__ADAPT_MATRIX_INV__);
		}
		this._gridSize=girdSize;
		this._beginGridX=offsetChunkX *TerrainLeaf.CHUNK_GRID_NUM+beginX;
		this._beginGridZ=offsetChunkZ *TerrainLeaf.CHUNK_GRID_NUM+beginZ;
		var nNum=offset *strideSize;
		var minY=2147483647;
		var maxY=-2147483648;
		var normal=new Vector3();
		for (var i=0,s=TerrainLeaf.LEAF_GRID_NUM+1;i < s;i++){
			for (var j=0,s1=TerrainLeaf.LEAF_GRID_NUM+1;j < s1;j++){
				TerrainLeaf.__VECTOR3__.x=(this._beginGridX+j)*this._gridSize;
				TerrainLeaf.__VECTOR3__.z=(this._beginGridZ+i)*this._gridSize;
				TerrainLeaf.__VECTOR3__.y=terrainHeightData[(this._beginGridZ+i)*(heighDataWidth)+(this._beginGridX+j)];
				minY=TerrainLeaf.__VECTOR3__.y < minY ? TerrainLeaf.__VECTOR3__.y :minY;
				maxY=TerrainLeaf.__VECTOR3__.y > maxY ? TerrainLeaf.__VECTOR3__.y :maxY;
				if (TerrainLeaf.__ADAPT_MATRIX__){
					Vector3.transformV3ToV3(TerrainLeaf.__VECTOR3__,TerrainLeaf.__ADAPT_MATRIX__,TerrainLeaf.__VECTOR3__);
				}
				vertextBuffer[nNum]=TerrainLeaf.__VECTOR3__.x;
				nNum++;
				vertextBuffer[nNum]=TerrainLeaf.__VECTOR3__.y;
				nNum++;
				vertextBuffer[nNum]=TerrainLeaf.__VECTOR3__.z;
				nNum++;
				this.calcVertextNormlUV(this._beginGridX+j,this._beginGridZ+i,heighDataWidth,heightDataHeight,normal);
				vertextBuffer[nNum]=normal.x;
				nNum++;
				vertextBuffer[nNum]=normal.y;
				nNum++;
				vertextBuffer[nNum]=normal.z;
				nNum++;
				vertextBuffer[nNum]=(beginX+j)/ TerrainLeaf.CHUNK_GRID_NUM;
				nNum++;
				vertextBuffer[nNum]=(beginZ+i)/ TerrainLeaf.CHUNK_GRID_NUM;
				nNum++;
				vertextBuffer[nNum]=this._beginGridX+j;
				nNum++;
				vertextBuffer[nNum]=this._beginGridZ+i;
				nNum++;
			}
		}
		this._sizeOfY=new Vector2(minY-1,maxY+1);
		this.calcLODErrors(terrainHeightData,heighDataWidth,heightDataHeight);
		this.calcOriginalBoudingBoxAndSphere();
	}

	__proto.calcSkirtVertextBuffer=function(offsetChunkX,offsetChunkZ,beginX,beginZ,girdSize,vertextBuffer,offset,strideSize,terrainHeightData,heighDataWidth,heightDataHeight){
		this._gridSize=girdSize;
		this._beginGridX=offsetChunkX *TerrainLeaf.CHUNK_GRID_NUM+beginX;
		this._beginGridZ=offsetChunkZ *TerrainLeaf.CHUNK_GRID_NUM+beginZ;
		var nNum=offset *strideSize;
		var i=0,j=0,s=TerrainLeaf.LEAF_GRID_NUM+1;
		var normal=new Vector3();
		var hZIndex=0;
		var hXIndex=0;
		var h=0;
		var zh=0;
		var xh=0;
		for (i=0;i < 2;i++){
			for (j=0;j < s;j++){
				TerrainLeaf.__VECTOR3__.x=(this._beginGridX+j)*this._gridSize;
				TerrainLeaf.__VECTOR3__.y=(i==1 ? terrainHeightData[this._beginGridZ *heighDataWidth+(this._beginGridX+j)] :-this._gridSize);
				TerrainLeaf.__VECTOR3__.z=(this._beginGridZ+0)*this._gridSize;
				if (TerrainLeaf.__ADAPT_MATRIX__){
					Vector3.transformV3ToV3(TerrainLeaf.__VECTOR3__,TerrainLeaf.__ADAPT_MATRIX__,TerrainLeaf.__VECTOR3__);
				}
				vertextBuffer[nNum]=TerrainLeaf.__VECTOR3__.x;
				nNum++;
				vertextBuffer[nNum]=TerrainLeaf.__VECTOR3__.y;
				nNum++;
				vertextBuffer[nNum]=TerrainLeaf.__VECTOR3__.z;
				nNum++;
				if (i==0){
					hZIndex=(this._beginGridZ-1);
					}else {
					hZIndex=this._beginGridZ;
				}
				this.calcVertextNormlUV(this._beginGridX+j,hZIndex,heighDataWidth,heightDataHeight,normal);
				vertextBuffer[nNum]=normal.x;
				nNum++;
				vertextBuffer[nNum]=normal.y;
				nNum++;
				vertextBuffer[nNum]=normal.z;
				nNum++;
				vertextBuffer[nNum]=(beginX+j)/ TerrainLeaf.CHUNK_GRID_NUM;
				nNum++;
				vertextBuffer[nNum]=(beginZ+0)/ TerrainLeaf.CHUNK_GRID_NUM;
				nNum++;
				vertextBuffer[nNum]=this._beginGridX+j;
				nNum++;
				vertextBuffer[nNum]=hZIndex;
				nNum++;
			}
		}
		for (i=0;i < 2;i++){
			for (j=0;j < s;j++){
				TerrainLeaf.__VECTOR3__.x=(this._beginGridX+j)*this._gridSize;
				TerrainLeaf.__VECTOR3__.y=(i==0 ? terrainHeightData[(this._beginGridZ+TerrainLeaf.LEAF_GRID_NUM)*(heighDataWidth)+(this._beginGridX+j)] :-this._gridSize);
				TerrainLeaf.__VECTOR3__.z=(this._beginGridZ+TerrainLeaf.LEAF_GRID_NUM)*this._gridSize;
				if (TerrainLeaf.__ADAPT_MATRIX__){
					Vector3.transformV3ToV3(TerrainLeaf.__VECTOR3__,TerrainLeaf.__ADAPT_MATRIX__,TerrainLeaf.__VECTOR3__);
				}
				vertextBuffer[nNum]=TerrainLeaf.__VECTOR3__.x;
				nNum++;
				vertextBuffer[nNum]=TerrainLeaf.__VECTOR3__.y;
				nNum++;
				vertextBuffer[nNum]=TerrainLeaf.__VECTOR3__.z;
				nNum++;
				if (i==0){
					hZIndex=this._beginGridZ+TerrainLeaf.LEAF_GRID_NUM;
					}else {
					hZIndex=(this._beginGridZ+TerrainLeaf.LEAF_GRID_NUM+1);
				}
				this.calcVertextNormlUV(this._beginGridX+j,hZIndex,heighDataWidth,heightDataHeight,normal);
				vertextBuffer[nNum]=normal.x;
				nNum++;
				vertextBuffer[nNum]=normal.y;
				nNum++;
				vertextBuffer[nNum]=normal.z;
				nNum++;
				vertextBuffer[nNum]=(beginX+j)/ TerrainLeaf.CHUNK_GRID_NUM;
				nNum++;
				vertextBuffer[nNum]=(beginZ+TerrainLeaf.LEAF_GRID_NUM)/ TerrainLeaf.CHUNK_GRID_NUM;
				nNum++;
				vertextBuffer[nNum]=this._beginGridX+j;
				nNum++;
				vertextBuffer[nNum]=hZIndex;
				nNum++;
			}
		}
		for (i=0;i < 2;i++){
			for (j=0;j < s;j++){
				TerrainLeaf.__VECTOR3__.x=(this._beginGridX+0)*this._gridSize;
				TerrainLeaf.__VECTOR3__.y=(i==0 ? terrainHeightData[(this._beginGridZ+j)*(heighDataWidth)+(this._beginGridX+0)] :-this._gridSize);
				TerrainLeaf.__VECTOR3__.z=(this._beginGridZ+j)*this._gridSize;
				if (TerrainLeaf.__ADAPT_MATRIX__){
					Vector3.transformV3ToV3(TerrainLeaf.__VECTOR3__,TerrainLeaf.__ADAPT_MATRIX__,TerrainLeaf.__VECTOR3__);
				}
				vertextBuffer[nNum]=TerrainLeaf.__VECTOR3__.x;
				nNum++;
				vertextBuffer[nNum]=TerrainLeaf.__VECTOR3__.y;
				nNum++;
				vertextBuffer[nNum]=TerrainLeaf.__VECTOR3__.z;
				nNum++;
				if (i==0){
					hXIndex=this._beginGridX;
					}else {
					hXIndex=(this._beginGridX-1);
				}
				this.calcVertextNormlUV(hXIndex,this._beginGridZ+j,heighDataWidth,heightDataHeight,normal);
				vertextBuffer[nNum]=normal.x;
				nNum++;
				vertextBuffer[nNum]=normal.y;
				nNum++;
				vertextBuffer[nNum]=normal.z;
				nNum++;
				vertextBuffer[nNum]=(beginX+0)/ TerrainLeaf.CHUNK_GRID_NUM;
				nNum++;
				vertextBuffer[nNum]=(beginZ+j)/ TerrainLeaf.CHUNK_GRID_NUM;
				nNum++;
				vertextBuffer[nNum]=hXIndex;
				nNum++;
				vertextBuffer[nNum]=this._beginGridZ+j;
				nNum++;
			}
		}
		for (i=0;i < 2;i++){
			for (j=0;j < s;j++){
				TerrainLeaf.__VECTOR3__.x=(this._beginGridX+TerrainLeaf.LEAF_GRID_NUM)*this._gridSize;
				TerrainLeaf.__VECTOR3__.y=(i==1 ? terrainHeightData[(this._beginGridZ+j)*(heighDataWidth)+(this._beginGridX+TerrainLeaf.LEAF_GRID_NUM)] :-this._gridSize);
				TerrainLeaf.__VECTOR3__.z=(this._beginGridZ+j)*this._gridSize;
				if (TerrainLeaf.__ADAPT_MATRIX__){
					Vector3.transformV3ToV3(TerrainLeaf.__VECTOR3__,TerrainLeaf.__ADAPT_MATRIX__,TerrainLeaf.__VECTOR3__);
				}
				vertextBuffer[nNum]=TerrainLeaf.__VECTOR3__.x;
				nNum++;
				vertextBuffer[nNum]=TerrainLeaf.__VECTOR3__.y;
				nNum++;
				vertextBuffer[nNum]=TerrainLeaf.__VECTOR3__.z;
				nNum++;
				if (i==0){
					hXIndex=this._beginGridX+TerrainLeaf.LEAF_GRID_NUM+1;
					}else {
					hXIndex=this._beginGridX+TerrainLeaf.LEAF_GRID_NUM;
				}
				this.calcVertextNormlUV(hXIndex,this._beginGridZ+j,heighDataWidth,heightDataHeight,normal);
				vertextBuffer[nNum]=normal.x;
				nNum++;
				vertextBuffer[nNum]=normal.y;
				nNum++;
				vertextBuffer[nNum]=normal.z;
				nNum++;
				vertextBuffer[nNum]=(beginX+TerrainLeaf.LEAF_GRID_NUM)/ TerrainLeaf.CHUNK_GRID_NUM;
				nNum++;
				vertextBuffer[nNum]=(beginZ+j)/ TerrainLeaf.CHUNK_GRID_NUM;
				nNum++;
				vertextBuffer[nNum]=hXIndex;
				nNum++;
				vertextBuffer[nNum]=this._beginGridZ+j;
				nNum++;
			}
		}
	}

	__proto.calcOriginalBoudingBoxAndSphere=function(){
		var min=new Vector3(this._beginGridX *this._gridSize,this._sizeOfY.x,this._beginGridZ *this._gridSize);
		var max=new Vector3((this._beginGridX+TerrainLeaf.LEAF_GRID_NUM)*this._gridSize,this._sizeOfY.y,(this._beginGridZ+TerrainLeaf.LEAF_GRID_NUM)*this._gridSize);
		if (TerrainLeaf.__ADAPT_MATRIX__){
			Vector3.transformV3ToV3(min,TerrainLeaf.__ADAPT_MATRIX__,min);
			Vector3.transformV3ToV3(max,TerrainLeaf.__ADAPT_MATRIX__,max);
		}
		this._originalBoundingBox=new BoundBox(min,max);
		var size=new Vector3();
		Vector3.subtract(max,min,size);
		Vector3.scale(size,0.5,size);
		var center=new Vector3();
		Vector3.add(min,size,center);
		this._originalBoundingSphere=new BoundSphere(center,Vector3.scalarLength(size));
		this._originalBoundingBoxCorners=__newvec(8,null);
		this._originalBoundingBox.getCorners(this._originalBoundingBoxCorners);
		this._boundingBox=new BoundBox(new Vector3(-0.5,-0.5,-0.5),new Vector3(0.5,0.5,0.5));
		this._boundingSphere=new BoundSphere(new Vector3(0,0,0),1);
	}

	__proto.calcLeafBoudingBox=function(worldMatrix){
		for (var i=0;i < 8;i++){
			Vector3.transformCoordinate(this._originalBoundingBoxCorners[i],worldMatrix,BaseRender._tempBoundBoxCorners[i]);
		}
		BoundBox.createfromPoints(BaseRender._tempBoundBoxCorners,this._boundingBox);
	}

	__proto.calcLeafBoudingSphere=function(worldMatrix,maxScale){
		Vector3.transformCoordinate(this._originalBoundingSphere.center,worldMatrix,this._boundingSphere.center);
		this._boundingSphere.radius=this._originalBoundingSphere.radius *maxScale;
	}

	__proto.calcLODErrors=function(terrainHeightData,heighDataWidth,heightDataHeight){
		this._LODError=new Float32Array(TerrainLeaf._maxLODLevel+1);
		var step=1;
		for (var i=0,n=TerrainLeaf._maxLODLevel+1;i < n;i++){
			var maxError=0;
			for (var y=0,n1=TerrainLeaf.LEAF_GRID_NUM;y < n1;y+=step){
				for (var x=0,n2=TerrainLeaf.LEAF_GRID_NUM;x < n2;x+=step){
					var z00=terrainHeightData[(this._beginGridZ+y)*heighDataWidth+(this._beginGridX+x)];
					var z10=terrainHeightData[(this._beginGridZ+y)*heighDataWidth+(this._beginGridX+x)+step];
					var z01=terrainHeightData[(this._beginGridZ+y+step)*heighDataWidth+(this._beginGridX+x)];
					var z11=terrainHeightData[(this._beginGridZ+y+step)*heighDataWidth+(this._beginGridX+x)+step];
					for (var j=0;j < step;j++){
						var ys=j / step;
						for (var k=0;k < step;k++){
							var xs=k / step;
							var z=terrainHeightData[(this._beginGridZ+y+j)*heighDataWidth+(this._beginGridX+x)+k];
							var iz=(xs+ys <=1)? (z00+(z10-z00)*xs+(z01-z00)*ys):(z11+(z01-z11)*(1-xs)+(z10-z11)*(1-ys));
							var error=Math.abs(iz-z);
							maxError=Math.max(maxError,error);
						}
					}
				}
			}
			step *=2;
			this._LODError[i]=maxError;
		}
	}

	__proto.determineLod=function(eyePos,perspectiveFactor,tolerance,tolerAndPerspectiveChanged){
		var nDistanceToEye=Vector3.distance(eyePos,this._boundingSphere.center);
		var n=TerrainLeaf._maxLODLevel;
		if (!tolerAndPerspectiveChanged){
			if (this._lastDistanceToEye==nDistanceToEye){
				return this._currentLODLevel;
				}else if (this._lastDistanceToEye > nDistanceToEye){
				n=this._currentLODLevel;
			}
		}
		for (var i=n;i >=1;i--){
			if (Terrain.LOD_DISTANCE_FACTOR *this._LODError[i] / nDistanceToEye *perspectiveFactor < tolerance){
				this._currentLODLevel=i;
				break ;
			}
		}
		this._lastDistanceToEye=nDistanceToEye;
		return this._currentLODLevel;
	}

	TerrainLeaf.__init__=function(){
		if (!TerrainLeaf._bInit){
			var nLeafNum=(TerrainLeaf.CHUNK_GRID_NUM / TerrainLeaf.LEAF_GRID_NUM)*(TerrainLeaf.CHUNK_GRID_NUM / TerrainLeaf.LEAF_GRID_NUM);
			TerrainLeaf._planeLODIndex=__newvec(nLeafNum);
			var i=0,j=0,k=0,n=0,n1=0,nOffset=0;
			var nOriginIndexArray=null,nTempIndex=null;
			for (i=0;i < nLeafNum;i++){
				TerrainLeaf._planeLODIndex[i]=new Array(TerrainLeaf._maxLODLevel+1);
			}
			for (i=0,n=TerrainLeaf._maxLODLevel+1;i < n;i++){
				TerrainLeaf._planeLODIndex[0][i]=TerrainLeaf.calcPlaneLODIndex(i);
			}
			for (i=1;i < nLeafNum;i++){
				nOffset=i *TerrainLeaf.LEAF_PLANE_VERTEXT_COUNT;
				for (j=0,n1=TerrainLeaf._maxLODLevel+1;j < n1;j++){
					nOriginIndexArray=TerrainLeaf._planeLODIndex[0][j];
					nTempIndex=new Uint16Array(nOriginIndexArray.length);
					for (k=0;k < nOriginIndexArray.length;k++){
						nTempIndex[k]=nOriginIndexArray[k]+nOffset;
					}
					TerrainLeaf._planeLODIndex[i][j]=nTempIndex;
				}
			}
			TerrainLeaf._skirtLODIndex=__newvec(nLeafNum);
			for (i=0;i < nLeafNum;i++){
				TerrainLeaf._skirtLODIndex[i]=new Array(TerrainLeaf._maxLODLevel+1);
			}
			for (i=0,n=TerrainLeaf._maxLODLevel+1;i < n;i++){
				TerrainLeaf._skirtLODIndex[0][i]=TerrainLeaf.calcSkirtLODIndex(i);
			}
			for (i=1;i < nLeafNum;i++){
				nOffset=i *TerrainLeaf.LEAF_SKIRT_VERTEXT_COUNT;
				for (j=0,n1=TerrainLeaf._maxLODLevel+1;j < n1;j++){
					nOriginIndexArray=TerrainLeaf._skirtLODIndex[0][j];
					nTempIndex=new Uint16Array(nOriginIndexArray.length);
					for (k=0;k < nOriginIndexArray.length;k++){
						nTempIndex[k]=nOriginIndexArray[k]+nOffset;
					}
					TerrainLeaf._skirtLODIndex[i][j]=nTempIndex;
				}
			}
			TerrainLeaf._bInit=true;
		}
	}

	TerrainLeaf.getPlaneLODIndex=function(leafIndex,LODLevel){
		return TerrainLeaf._planeLODIndex[leafIndex][LODLevel];
	}

	TerrainLeaf.getSkirtLODIndex=function(leafIndex,LODLevel){
		return TerrainLeaf._skirtLODIndex[leafIndex][LODLevel];
	}

	TerrainLeaf.calcPlaneLODIndex=function(level){
		if (level > TerrainLeaf._maxLODLevel)level=TerrainLeaf._maxLODLevel;
		var nGridNumAddOne=TerrainLeaf.LEAF_GRID_NUM+1;
		var nNum=0;
		var indexBuffer=null;
		var nLODGridNum=laya.d3.terrain.TerrainLeaf.LEAF_GRID_NUM / Math.pow(2,level);
		indexBuffer=new Uint16Array(nLODGridNum *nLODGridNum *6);
		var nGridSpace=laya.d3.terrain.TerrainLeaf.LEAF_GRID_NUM / nLODGridNum;
		for (var i=0;i < TerrainLeaf.LEAF_GRID_NUM;i+=nGridSpace){
			for (var j=0;j < TerrainLeaf.LEAF_GRID_NUM;j+=nGridSpace){
				indexBuffer[nNum]=(i+nGridSpace)*nGridNumAddOne+j;
				nNum++;
				indexBuffer[nNum]=i *nGridNumAddOne+j;
				nNum++;
				indexBuffer[nNum]=i *nGridNumAddOne+j+nGridSpace;
				nNum++;
				indexBuffer[nNum]=i *nGridNumAddOne+j+nGridSpace;
				nNum++;
				indexBuffer[nNum]=(i+nGridSpace)*nGridNumAddOne+j+nGridSpace;
				nNum++;
				indexBuffer[nNum]=(i+nGridSpace)*nGridNumAddOne+j;
				nNum++;
			}
		}
		return indexBuffer;
	}

	TerrainLeaf.calcSkirtLODIndex=function(level){
		if (level > TerrainLeaf._maxLODLevel)level=TerrainLeaf._maxLODLevel;
		var nSkirtIndexOffset=(TerrainLeaf.CHUNK_GRID_NUM / TerrainLeaf.LEAF_GRID_NUM)*(TerrainLeaf.CHUNK_GRID_NUM / TerrainLeaf.LEAF_GRID_NUM)*TerrainLeaf.LEAF_PLANE_VERTEXT_COUNT;
		var nGridNumAddOne=TerrainLeaf.LEAF_GRID_NUM+1;
		var nNum=0;
		var indexBuffer=null;
		var nLODGridNum=laya.d3.terrain.TerrainLeaf.LEAF_GRID_NUM / Math.pow(2,level);
		indexBuffer=new Uint16Array(nLODGridNum *4 *6);
		var nGridSpace=laya.d3.terrain.TerrainLeaf.LEAF_GRID_NUM / nLODGridNum;
		for (var j=0;j < 4;j++){
			for (var i=0;i < TerrainLeaf.LEAF_GRID_NUM;i+=nGridSpace){
				indexBuffer[nNum]=nSkirtIndexOffset+nGridNumAddOne+i;
				nNum++;
				indexBuffer[nNum]=nSkirtIndexOffset+i;
				nNum++;
				indexBuffer[nNum]=nSkirtIndexOffset+i+nGridSpace;
				nNum++;
				indexBuffer[nNum]=nSkirtIndexOffset+i+nGridSpace;
				nNum++;
				indexBuffer[nNum]=nSkirtIndexOffset+nGridNumAddOne+i+nGridSpace;
				nNum++;
				indexBuffer[nNum]=nSkirtIndexOffset+nGridNumAddOne+i;
				nNum++;
			}
			nSkirtIndexOffset+=nGridNumAddOne *2;
		}
		return indexBuffer;
	}

	TerrainLeaf.getHeightFromTerrainHeightData=function(x,z,terrainHeightData,heighDataWidth,heightDataHeight){
		x=x < 0 ? 0 :x;
		x=(x >=heighDataWidth)? heighDataWidth-1 :x;
		z=z < 0 ? 0 :z;
		z=(z >=heightDataHeight)? heightDataHeight-1 :z;
		return terrainHeightData[z *heighDataWidth+x];
	}

	TerrainLeaf.CHUNK_GRID_NUM=64;
	TerrainLeaf.LEAF_GRID_NUM=32;
	TerrainLeaf.__ADAPT_MATRIX__=null;
	TerrainLeaf.__ADAPT_MATRIX_INV__=null;
	TerrainLeaf._planeLODIndex=null;
	TerrainLeaf._skirtLODIndex=null;
	TerrainLeaf._bInit=false;
	__static(TerrainLeaf,
	['LEAF_PLANE_VERTEXT_COUNT',function(){return this.LEAF_PLANE_VERTEXT_COUNT=(TerrainLeaf.LEAF_GRID_NUM+1)*(TerrainLeaf.LEAF_GRID_NUM+1);},'LEAF_SKIRT_VERTEXT_COUNT',function(){return this.LEAF_SKIRT_VERTEXT_COUNT=(TerrainLeaf.LEAF_GRID_NUM+1)*2 *4;},'LEAF_VERTEXT_COUNT',function(){return this.LEAF_VERTEXT_COUNT=TerrainLeaf.LEAF_PLANE_VERTEXT_COUNT+TerrainLeaf.LEAF_SKIRT_VERTEXT_COUNT;},'LEAF_PLANE_MAX_INDEX_COUNT',function(){return this.LEAF_PLANE_MAX_INDEX_COUNT=TerrainLeaf.LEAF_GRID_NUM *TerrainLeaf.LEAF_GRID_NUM *6;},'LEAF_SKIRT_MAX_INDEX_COUNT',function(){return this.LEAF_SKIRT_MAX_INDEX_COUNT=TerrainLeaf.LEAF_GRID_NUM *4 *6;},'LEAF_MAX_INDEX_COUNT',function(){return this.LEAF_MAX_INDEX_COUNT=TerrainLeaf.LEAF_PLANE_MAX_INDEX_COUNT+TerrainLeaf.LEAF_SKIRT_MAX_INDEX_COUNT;},'__VECTOR3__',function(){return this.__VECTOR3__=new Vector3();},'_maxLODLevel',function(){return this._maxLODLevel=/*__JS__ */Math.log2(TerrainLeaf.LEAF_GRID_NUM);}
	]);
	return TerrainLeaf;
})()


/**

*/
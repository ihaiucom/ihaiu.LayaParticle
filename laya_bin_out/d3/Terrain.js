/**
*<code>Terrain</code> 类用于创建地块。
*/
//class laya.d3.terrain.Terrain extends laya.d3.core.Sprite3D
var Terrain=(function(_super){
	function Terrain(terrainRes){
		//地形资源
		this._terrainRes=null;
		this._lightmapScaleOffset=null;
		Terrain.__super.call(this);
		this._lightmapScaleOffset=new Vector4(1,1,0,0);
		if (terrainRes){
			this._terrainRes=terrainRes;
			this.buildTerrain(terrainRes);
		}
	}

	__class(Terrain,'laya.d3.terrain.Terrain',_super);
	var __proto=Terrain.prototype;
	/**
	*@inheritDoc
	*/
	__proto._parse=function(data){
		_super.prototype._parse.call(this,data);
		this.terrainRes=Loader.getRes(data.dataPath);
		var lightmapIndex=data.lightmapIndex;
		if (lightmapIndex !=null)
			this.setLightmapIndex(lightmapIndex);
		var lightmapScaleOffsetArray=data.lightmapScaleOffset;
		if (lightmapScaleOffsetArray)
			this.setLightmapScaleOffset(new Vector4(lightmapScaleOffsetArray[0],lightmapScaleOffsetArray[1],lightmapScaleOffsetArray[2],lightmapScaleOffsetArray[3]));
	}

	__proto.setLightmapIndex=function(value){
		for (var i=0;i < this._children.length;i++){
			var terrainChunk=this._children[i];
			terrainChunk.terrainRender.lightmapIndex=value;
		}
	}

	__proto.setLightmapScaleOffset=function(value){
		if (!value)return;
		value.cloneTo(this._lightmapScaleOffset);
		for (var i=0;i < this._children.length;i++){
			var terrainChunk=this._children[i];
			terrainChunk.terrainRender.lightmapScaleOffset=this._lightmapScaleOffset;
		}
	}

	__proto.disableLight=function(){
		for (var i=0,n=this._children.length;i < n;i++){
			var terrainChunk=this._children[i];
			for (var j=0,m=terrainChunk._render.sharedMaterials.length;j < m;j++){
				var terrainMaterial=terrainChunk._render.sharedMaterials [j];
				terrainMaterial.disableLight();
			}
		}
	}

	//建筑地形
	__proto.buildTerrain=function(terrainRes){
		var chunkNumX=terrainRes._chunkNumX;
		var chunkNumZ=terrainRes._chunkNumZ;
		var heightData=terrainRes._heightData;
		var n=0;
		for (var i=0;i < chunkNumZ;i++){
			for (var j=0;j < chunkNumX;j++){
				var terrainChunk=new TerrainChunk(j,i,terrainRes._gridSize,heightData._terrainHeightData,heightData._width,heightData._height,terrainRes._cameraCoordinateInverse);
				var chunkInfo=terrainRes._chunkInfos[n++];
				for (var k=0;k < chunkInfo.alphaMap.length;k++){
					var nNum=chunkInfo.detailID[k].length;
					var sDetialTextureUrl1=(nNum > 0)? terrainRes._detailTextureInfos[chunkInfo.detailID[k][0]].diffuseTexture :null;
					var sDetialTextureUrl2=(nNum > 1)? terrainRes._detailTextureInfos[chunkInfo.detailID[k][1]].diffuseTexture :null;
					var sDetialTextureUrl3=(nNum > 2)? terrainRes._detailTextureInfos[chunkInfo.detailID[k][2]].diffuseTexture :null;
					var sDetialTextureUrl4=(nNum > 3)? terrainRes._detailTextureInfos[chunkInfo.detailID[k][3]].diffuseTexture :null;
					var detialScale1=(nNum > 0)? terrainRes._detailTextureInfos[chunkInfo.detailID[k][0]].scale :null;
					var detialScale2=(nNum > 1)? terrainRes._detailTextureInfos[chunkInfo.detailID[k][1]].scale :null;
					var detialScale3=(nNum > 2)? terrainRes._detailTextureInfos[chunkInfo.detailID[k][2]].scale :null;
					var detialScale4=(nNum > 3)? terrainRes._detailTextureInfos[chunkInfo.detailID[k][3]].scale :null;
					terrainChunk.buildRenderElementAndMaterial(nNum,chunkInfo.normalMap,chunkInfo.alphaMap[k],sDetialTextureUrl1,sDetialTextureUrl2,sDetialTextureUrl3,sDetialTextureUrl4,terrainRes._materialInfo.ambientColor,terrainRes._materialInfo.diffuseColor,terrainRes._materialInfo.specularColor,detialScale1 ? detialScale1.x :1,detialScale1 ? detialScale1.y :1,detialScale2 ? detialScale2.x :1,detialScale2 ? detialScale2.y :1,detialScale3 ? detialScale3.x :1,detialScale3 ? detialScale3.y :1,detialScale4 ? detialScale4.x :1,detialScale4 ? detialScale4.y :1);
				}
				terrainChunk.terrainRender.receiveShadow=true;
				terrainChunk.terrainRender.lightmapScaleOffset=this._lightmapScaleOffset;
				this.addChild(terrainChunk);
			}
		}
	}

	/**
	*获取地形X轴长度。
	*@return 地形X轴长度。
	*/
	__proto.width=function(){
		return this._terrainRes._chunkNumX *TerrainLeaf.CHUNK_GRID_NUM *this._terrainRes._gridSize;
	}

	/**
	*获取地形Z轴长度。
	*@return 地形Z轴长度。
	*/
	__proto.depth=function(){
		return this._terrainRes._chunkNumZ *TerrainLeaf.CHUNK_GRID_NUM *this._terrainRes._gridSize;
	}

	/**
	*获取地形高度。
	*@param x X轴坐标。
	*@param z Z轴坐标。
	*/
	__proto.getHeightXZ=function(x,z){
		if (!this._terrainRes)
			return NaN;
		x-=this.transform.position.x;
		z-=this.transform.position.z;
		if (!Terrain.__VECTOR3__){
			Terrain.__VECTOR3__=new Vector3();
		}
		Terrain.__VECTOR3__.elements[0]=x;
		Terrain.__VECTOR3__.elements[1]=0;
		Terrain.__VECTOR3__.elements[2]=z;
		Vector3.transformV3ToV3(Terrain.__VECTOR3__,TerrainLeaf.__ADAPT_MATRIX_INV__,Terrain.__VECTOR3__);
		x=Terrain.__VECTOR3__.elements[0];
		z=Terrain.__VECTOR3__.elements[2];
		if (x < 0 || x > this.width()|| z < 0 || z > this.depth())
			return NaN;
		var gridSize=this._terrainRes._gridSize;
		var nIndexX=parseInt(""+x / gridSize);
		var nIndexZ=parseInt(""+z / gridSize);
		var offsetX=x-nIndexX *gridSize;
		var offsetZ=z-nIndexZ *gridSize;
		var h1=NaN;
		var h2=NaN;
		var h3=NaN;
		var u=NaN;
		var v=NaN;
		var heightData=this._terrainRes._heightData;
		if (offsetX+offsetZ > gridSize){
			h1=heightData._terrainHeightData[(nIndexZ+1-1)*heightData._width+nIndexX+1];
			h2=heightData._terrainHeightData[(nIndexZ+1-1)*heightData._width+nIndexX];
			h3=heightData._terrainHeightData[(nIndexZ-1)*heightData._width+nIndexX+1];
			u=(gridSize-offsetX)/ gridSize;
			v=(gridSize-offsetZ)/ gridSize;
			return h1+(h2-h1)*u+(h3-h1)*v;
			}else {
			h1=heightData._terrainHeightData[Math.max(0.0,nIndexZ-1)*heightData._width+nIndexX];
			h2=heightData._terrainHeightData[Math.min(heightData._width *heightData._height-1,(nIndexZ+1-1)*heightData._width+nIndexX)];
			h3=heightData._terrainHeightData[Math.min(heightData._width *heightData._height-1,Math.max(0.0,nIndexZ-1)*heightData._width+nIndexX+1)];
			u=offsetX / gridSize;
			v=offsetZ / gridSize;
			return h1+(h2-h1)*v+(h3-h1)*u;
		}
	}

	__getset(0,__proto,'terrainRes',null,function(value){
		if (value){
			this._terrainRes=value;
			this.buildTerrain(value);
		}
	});

	Terrain.load=function(url){
		Laya.loader.create(url,null,null,/*Laya3D.TERRAINRES*/"TERRAIN",null,null,1,false);
	}

	Terrain.RENDER_LINE_MODEL=false;
	Terrain.LOD_TOLERANCE_VALUE=4;
	Terrain.LOD_DISTANCE_FACTOR=2.0;
	Terrain.__VECTOR3__=null;
	return Terrain;
})(Sprite3D)


/**

*/
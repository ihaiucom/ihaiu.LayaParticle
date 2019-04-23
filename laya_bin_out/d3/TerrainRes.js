/**
*<code>TerrainRes</code> 类用于描述地形信息。
*/
//class laya.d3.terrain.TerrainRes extends laya.resource.Resource
var TerrainRes=(function(_super){
	function TerrainRes(){
		this._version=NaN;
		this._cameraCoordinateInverse=false;
		this._gridSize=NaN;
		this._chunkNumX=0;
		this._chunkNumZ=0;
		this._heightDataX=0;
		this._heightDataZ=0;
		this._heightDataBitType=0;
		this._heightDataValue=NaN;
		this._heightDataUrl=null;
		this._detailTextureInfos=null;
		this._chunkInfos=null;
		this._heightData=null;
		this._materialInfo=null;
		this._alphaMaps=null;
		this._normalMaps=null;
		TerrainRes.__super.call(this);
	}

	__class(TerrainRes,'laya.d3.terrain.TerrainRes',_super);
	var __proto=TerrainRes.prototype;
	__proto.parseData=function(data){
		var json=data[0];
		var resouMap=data[1];
		this._version=json.version;
		if (this._version==1.0){
			this._cameraCoordinateInverse=json.cameraCoordinateInverse;
			this._gridSize=json.gridSize;
			this._chunkNumX=json.chunkNumX;
			this._chunkNumZ=json.chunkNumZ;
			var heightData=json.heightData;
			this._heightDataX=heightData.numX;
			this._heightDataZ=heightData.numZ;
			this._heightDataBitType=heightData.bitType;
			this._heightDataValue=heightData.value;
			this._heightDataUrl=resouMap[heightData.url];
			this._materialInfo=new MaterialInfo();
			if (json.material){
				var ambient=json.material.ambient;
				var diffuse=json.material.diffuse;
				var specular=json.material.specular;
				this._materialInfo.ambientColor=new Vector3(ambient[0],ambient[1],ambient[2]);
				this._materialInfo.diffuseColor=new Vector3(diffuse[0],diffuse[1],diffuse[2]);
				this._materialInfo.specularColor=new Vector4(specular[0],specular[1],specular[2],specular[3]);
			};
			var detailTextures=json.detailTexture;
			this._detailTextureInfos=__newvec(detailTextures.length);
			for (var i=0;i < detailTextures.length;i++){
				var detail=detailTextures[i];
				var info=new DetailTextureInfo();
				info.diffuseTexture=resouMap[detail.diffuse];
				info.normalTexture=detail.normal ? resouMap[detail.normal] :null;
				if (detail.scale){
					info.scale=new Vector2(detail.scale[0],detail.scale[1]);
					}else {
					info.scale=new Vector2(1,1);
				}
				if (detail.offset){
					info.offset=new Vector2(detail.offset[0],detail.offset[1]);
					}else {
					info.offset=new Vector2(0,0);
				}
				this._detailTextureInfos[i]=info;
			};
			var alphaMaps=json.alphaMap;
			this._alphaMaps=__newvec(alphaMaps.length);
			for (i=0;i < this._alphaMaps.length;i++){
				this._alphaMaps[i]=json.alphaMap[i];
			};
			var normalMaps=json.normalMap;
			this._normalMaps=__newvec(normalMaps.length);
			for (i=0;i < this._normalMaps.length;i++){
				this._normalMaps[i]=json.normalMap[i];
			};
			var jchunks=json.chunkInfo;
			if (this._chunkNumX *this._chunkNumZ !=jchunks.length){
				alert("terrain data error");
				return false;
			}
			this._chunkInfos=__newvec(jchunks.length);
			for (i=0;i < jchunks.length;i++){
				var jchunk=jchunks[i];
				var chunkinfo=new ChunkInfo();
				var nAlphaMapNum=jchunk.alphaMap.length;
				var nDetailIDNum=jchunk.detailID.length;
				if (nAlphaMapNum !=nDetailIDNum){
					alert("terrain chunk data error");
					return false;
				}
				chunkinfo.alphaMap=__newvec(nAlphaMapNum);
				chunkinfo.detailID=__newvec(nDetailIDNum);
				chunkinfo.normalMap=resouMap[this._normalMaps[jchunk.normalMap]];
				for (var j=0;j < nAlphaMapNum;j++){
					chunkinfo.alphaMap[j]=resouMap[this._alphaMaps[jchunk.alphaMap[j]]];
					var jid=jchunk.detailID[j];
					var nIDNum=jid.length;
					chunkinfo.detailID[j]=new Uint8Array(nIDNum);
					for (var k=0;k < nIDNum;k++){
						chunkinfo.detailID[j][k]=jid[k];
					}
				}
				this._chunkInfos[i]=chunkinfo;
			}
			this._heightData=Loader.getRes(this._heightDataUrl);
			this.onLoadTerrainComplete(this._heightData);
		}
		return true;
	}

	__proto.onLoadTerrainComplete=function(heightData){}
	TerrainRes._parse=function(data,propertyParams,constructParams){
		var terrainRes=new TerrainRes();
		terrainRes.parseData(data);
		return terrainRes;
	}

	TerrainRes.load=function(url,complete){
		Laya.loader.create(url,complete,null,/*Laya3D.TERRAINRES*/"TERRAIN",null,null,1,false);
	}

	return TerrainRes;
})(Resource)


/**

*/
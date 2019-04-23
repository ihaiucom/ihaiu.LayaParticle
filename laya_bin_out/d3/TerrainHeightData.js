/**
*<code>TerrainHeightData</code> 类用于描述地形高度信息。
*/
//class laya.d3.terrain.TerrainHeightData extends laya.resource.Resource
var TerrainHeightData=(function(_super){
	function TerrainHeightData(width,height,bitType,value){
		this._terrainHeightData=null;
		this._width=0;
		this._height=0;
		this._bitType=0;
		this._value=NaN;
		TerrainHeightData.__super.call(this);
		this._width=width;
		this._height=height;
		this._bitType=bitType;
		this._value=value;
	}

	__class(TerrainHeightData,'laya.d3.terrain.TerrainHeightData',_super);
	TerrainHeightData._pharse=function(data,propertyParams,constructParams){
		var terrainHeightData=new TerrainHeightData(constructParams[0],constructParams[1],constructParams[2],constructParams[3]);
		var buffer;
		var ratio=NaN;
		if (terrainHeightData._bitType==8){
			buffer=new Uint8Array(data);
			ratio=1.0 / 255.0;
			}else if (terrainHeightData._bitType==16){
			buffer=new Int16Array(data);
			ratio=1.0 / 32766.0;
		}
		terrainHeightData._terrainHeightData=new Float32Array(terrainHeightData._height *terrainHeightData._width);
		for (var i=0,n=terrainHeightData._height *terrainHeightData._width;i < n;i++){
			terrainHeightData._terrainHeightData[i]=(buffer[i] *ratio *terrainHeightData._value)/ 2;
		}
	}

	TerrainHeightData.load=function(url,complete,widht,height,bitType,value){
		Laya.loader.create(url,complete,null,/*Laya3D.TERRAINHEIGHTDATA*/"TERRAINHEIGHTDATA",[widht,height,bitType,value],null,1,false);
	}

	return TerrainHeightData;
})(Resource)


/**

*/
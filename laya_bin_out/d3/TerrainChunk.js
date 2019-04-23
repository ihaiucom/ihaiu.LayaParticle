/**
*<code>TerrainChunk</code> 类用于创建地块。
*/
//class laya.d3.terrain.TerrainChunk extends laya.d3.core.RenderableSprite3D
var TerrainChunk=(function(_super){
	function TerrainChunk(chunkOffsetX,chunkOffsetZ,girdSize,terrainHeightData,heightDataWidth,heightDataHeight,cameraCoordinateInverse,name){
		/**@private */
		this._terrainFilter=null;
		TerrainChunk.__super.call(this,name);
		this._terrainFilter=new TerrainFilter(this,chunkOffsetX,chunkOffsetZ,girdSize,terrainHeightData,heightDataWidth,heightDataHeight,cameraCoordinateInverse);
		this._render=new TerrainRender(this);
	}

	__class(TerrainChunk,'laya.d3.terrain.TerrainChunk',_super);
	var __proto=TerrainChunk.prototype;
	__proto.buildRenderElementAndMaterial=function(detailNum,normalMap,alphaMapUrl,detailUrl1,detailUrl2,detailUrl3,detailUrl4,ambientColor,diffuseColor,specularColor,sx1,sy1,sx2,sy2,sx3,sy3,sx4,sy4){
		(sx1===void 0)&& (sx1=1);
		(sy1===void 0)&& (sy1=1);
		(sx2===void 0)&& (sx2=1);
		(sy2===void 0)&& (sy2=1);
		(sx3===void 0)&& (sx3=1);
		(sy3===void 0)&& (sy3=1);
		(sx4===void 0)&& (sx4=1);
		(sy4===void 0)&& (sy4=1);
		var terrainMaterial=new TerrainMaterial();
		if (diffuseColor)terrainMaterial.diffuseColor=diffuseColor;
		if (ambientColor)terrainMaterial.ambientColor=ambientColor;
		if (specularColor)terrainMaterial.specularColor=specularColor;
		terrainMaterial.splatAlphaTexture=Loader.getRes(alphaMapUrl);
		terrainMaterial.normalTexture=normalMap ? Loader.getRes(normalMap):null;
		terrainMaterial.diffuseTexture1=detailUrl1 ? Loader.getRes(detailUrl1):null;
		terrainMaterial.diffuseTexture2=detailUrl2 ? Loader.getRes(detailUrl2):null;
		terrainMaterial.diffuseTexture3=detailUrl3 ? Loader.getRes(detailUrl3):null;
		terrainMaterial.diffuseTexture4=detailUrl4 ? Loader.getRes(detailUrl4):null;
		terrainMaterial.setDiffuseScale1(sx1,sy1);
		terrainMaterial.setDiffuseScale2(sx2,sy2);
		terrainMaterial.setDiffuseScale3(sx3,sy3);
		terrainMaterial.setDiffuseScale4(sx4,sy4);
		terrainMaterial.setDetailNum(detailNum);
		if (this._render._renderElements.length !=0){
			terrainMaterial.renderMode=/*laya.d3.core.material.TerrainMaterial.RENDERMODE_TRANSPARENT*/2;
		};
		var renderElement=new RenderElement();
		renderElement.setTransform(this._transform);
		renderElement.render=this._render;
		renderElement.setGeometry(this._terrainFilter);
		this._render._renderElements.push(renderElement);
		this._render.sharedMaterial=terrainMaterial;
	}

	__proto.cloneTo=function(destObject){
		console.log("Terrain Chunk can't clone");
	}

	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		if (this.destroyed)
			return;
		_super.prototype.destroy.call(this,destroyChild);
		this._terrainFilter.destroy();
		this._terrainFilter=null;
	}

	/**
	*获取地形过滤器。
	*@return 地形过滤器。
	*/
	__getset(0,__proto,'terrainFilter',function(){
		return this._terrainFilter;
	});

	/**
	*获取地形渲染器。
	*@return 地形渲染器。
	*/
	__getset(0,__proto,'terrainRender',function(){
		return this._render;
	});

	return TerrainChunk;
})(RenderableSprite3D)


/**

*/
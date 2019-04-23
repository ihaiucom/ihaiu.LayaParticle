//class laya.map.MapLayer extends laya.display.Sprite
var MapLayer=(function(_super){
	function MapLayer(){
		this._map=null;
		this._mapData=null;
		this._tileWidthHalf=0;
		this._tileHeightHalf=0;
		this._mapWidthHalf=0;
		this._mapHeightHalf=0;
		/**
		*@private
		*/
		this._gridSpriteArray=[];
		this._objDic=null;
		//用来做字典，方便查询
		this._dataDic=null;
		//临时变量
		this._properties=null;
		/**被合到的层*/
		this.tarLayer=null;
		/**当前Layer的名称*/
		this.layerName=null;
		MapLayer.__super.call(this);
		this._tempMapPos=new Point();
	}

	__class(MapLayer,'laya.map.MapLayer',_super);
	var __proto=MapLayer.prototype;
	/**
	*解析LAYER数据，以及初始化一些数据
	*@param layerData 地图数据中，layer数据的引用
	*@param map 地图的引用
	*/
	__proto.init=function(layerData,map){
		this._map=map;
		this._mapData=layerData.data;
		var tHeight=layerData.height;
		var tWidth=layerData.width;
		var tTileW=map.tileWidth;
		var tTileH=map.tileHeight;
		this.layerName=layerData.name;
		this._properties=layerData.properties;
		this.alpha=layerData.opacity;
		this._tileWidthHalf=tTileW / 2;
		this._tileHeightHalf=tTileH / 2;
		this._mapWidthHalf=this._map.width / 2-this._tileWidthHalf;
		this._mapHeightHalf=this._map.height / 2;
		switch (layerData.type){
			case "tilelayer":
				break ;
			case "objectgroup":;
				var tObjectGid=0;
				var tArray=layerData.objects;
				if (tArray.length > 0){
					this._objDic={};
					this._dataDic={};
				};
				var tObjectData;
				var tObjWidth=NaN;
				var tObjHeight=NaN;
				for (var i=0;i < tArray.length;i++){
					tObjectData=tArray[i];
					this._dataDic[tObjectData.name]=tObjectData;
					if (tObjectData.visible==true){
						tObjWidth=tObjectData.width;
						tObjHeight=tObjectData.height;
						var tSprite=map.getSprite(tObjectData.gid,tObjWidth,tObjHeight);
						if (tSprite !=null){
						switch (this._map.orientation){
							case /*laya.map.TiledMap.ORIENTATION_ISOMETRIC*/"isometric":
								this.getScreenPositionByTilePos(tObjectData.x / tTileH,tObjectData.y / tTileH,Point.TEMP);
								tSprite.pivot(tObjWidth / 2,tObjHeight / 2);
								tSprite.rotation=tObjectData.rotation;
								tSprite.x=tSprite.relativeX=Point.TEMP.x+this._map.viewPortX;
								tSprite.y=tSprite.relativeY=Point.TEMP.y+this._map.viewPortY-tObjHeight / 2;
								break ;
							case /*laya.map.TiledMap.ORIENTATION_STAGGERED*/"staggered":
								tSprite.pivot(tObjWidth / 2,tObjHeight / 2);
								tSprite.rotation=tObjectData.rotation;
								tSprite.x=tSprite.relativeX=tObjectData.x+tObjWidth / 2;
								tSprite.y=tSprite.relativeY=tObjectData.y-tObjHeight / 2;
								break ;
							case /*laya.map.TiledMap.ORIENTATION_ORTHOGONAL*/"orthogonal":
								tSprite.pivot(tObjWidth / 2,tObjHeight / 2);
								tSprite.rotation=tObjectData.rotation;
								tSprite.x=tSprite.relativeX=tObjectData.x+tObjWidth / 2;
								tSprite.y=tSprite.relativeY=tObjectData.y-tObjHeight / 2;
								break ;
							case /*laya.map.TiledMap.ORIENTATION_HEXAGONAL*/"hexagonal":
								tSprite.x=tSprite.relativeX=tObjectData.x;
								tSprite.y=tSprite.relativeY=tObjectData.y;
								break ;
							}
						this.addChild(tSprite);
						this._gridSpriteArray.push(tSprite);
						this._objDic[tObjectData.name]=tSprite;
					}
				}
			}
			break ;
		}
	}

	/**
	*通过名字获取控制对象，如果找不到返回为null
	*@param objName 所要获取对象的名字
	*@return
	*/
	__proto.getObjectByName=function(objName){
		if (this._objDic){
			return this._objDic[objName];
		}
		return null;
	}

	/**
	*通过名字获取数据，如果找不到返回为null
	*@param objName 所要获取对象的名字
	*@return
	*/
	__proto.getObjectDataByName=function(objName){
		if (this._dataDic){
			return this._dataDic[objName];
		}
		return null;
	}

	/**
	*得到地图层的自定义属性
	*@param name
	*@return
	*/
	__proto.getLayerProperties=function(name){
		if (this._properties){
			return this._properties[name];
		}
		return null;
	}

	/**
	*得到指定格子的数据
	*@param tileX 格子坐标X
	*@param tileY 格子坐标Y
	*@return
	*/
	__proto.getTileData=function(tileX,tileY){
		if (tileY >=0 && tileY < this._map.numRowsTile && tileX >=0 && tileX < this._map.numColumnsTile){
			var tIndex=tileY *this._map.numColumnsTile+tileX;
			var tMapData=this._mapData;
			if (tMapData !=null && tIndex < tMapData.length){
				return tMapData[tIndex];
			}
		}
		return 0;
	}

	/**
	*通过地图坐标得到屏幕坐标
	*@param tileX 格子坐标X
	*@param tileY 格子坐标Y
	*@param screenPos 把计算好的屏幕坐标数据，放到此对象中
	*/
	__proto.getScreenPositionByTilePos=function(tileX,tileY,screenPos){
		if (screenPos){
			switch (this._map.orientation){
				case /*laya.map.TiledMap.ORIENTATION_ISOMETRIC*/"isometric":
					screenPos.x=this._map.width / 2-(tileY-tileX)*this._tileWidthHalf;
					screenPos.y=(tileY+tileX)*this._tileHeightHalf;
					break ;
				case /*laya.map.TiledMap.ORIENTATION_STAGGERED*/"staggered":
					tileX=Math.floor(tileX);
					tileY=Math.floor(tileY);
					screenPos.x=tileX *this._map.tileWidth+(tileY & 1)*this._tileWidthHalf;
					screenPos.y=tileY *this._tileHeightHalf;
					break ;
				case /*laya.map.TiledMap.ORIENTATION_ORTHOGONAL*/"orthogonal":
					screenPos.x=tileX *this._map.tileWidth;
					screenPos.y=tileY *this._map.tileHeight;
					break ;
				case /*laya.map.TiledMap.ORIENTATION_HEXAGONAL*/"hexagonal":
					tileX=Math.floor(tileX);
					tileY=Math.floor(tileY);
					var tTileHeight=this._map.tileHeight *2 / 3;
					screenPos.x=(tileX *this._map.tileWidth+tileY % 2 *this._tileWidthHalf)% this._map.gridWidth;
					screenPos.y=(tileY *tTileHeight)% this._map.gridHeight;
					break ;
				}
			screenPos.x=(screenPos.x+this._map.viewPortX)*this._map.scale;
			screenPos.y=(screenPos.y+this._map.viewPortY)*this._map.scale;
		}
	}

	/**
	*通过屏幕坐标来获取选中格子的数据
	*@param screenX 屏幕坐标x
	*@param screenY 屏幕坐标y
	*@return
	*/
	__proto.getTileDataByScreenPos=function(screenX,screenY){
		var tData=0;
		if (this.getTilePositionByScreenPos(screenX,screenY,this._tempMapPos)){
			tData=this.getTileData(Math.floor(this._tempMapPos.x),Math.floor(this._tempMapPos.y));
		}
		return tData;
	}

	/**
	*通过屏幕坐标来获取选中格子的索引
	*@param screenX 屏幕坐标x
	*@param screenY 屏幕坐标y
	*@param result 把计算好的格子坐标，放到此对象中
	*@return
	*/
	__proto.getTilePositionByScreenPos=function(screenX,screenY,result){
		screenX=screenX/this._map.scale-this._map.viewPortX;
		screenY=screenY/this._map.scale-this._map.viewPortY;
		var tTileW=this._map.tileWidth;
		var tTileH=this._map.tileHeight;
		var tV=0;
		var tU=0;
		switch (this._map.orientation){
			case /*laya.map.TiledMap.ORIENTATION_ISOMETRIC*/"isometric":;
				var tDirX=screenX-this._map.width / 2;
				var tDirY=screenY;
				tV=-(tDirX / tTileW-tDirY / tTileH);
				tU=tDirX / tTileW+tDirY / tTileH;
				if (result){
					result.x=tU;
					result.y=tV;
				}
				return true;
				break ;
			case /*laya.map.TiledMap.ORIENTATION_STAGGERED*/"staggered":
				if (result){
					var cx=0,cy=0,rx=0,ry=0;
					cx=Math.floor(screenX / tTileW)*tTileW+tTileW / 2;
					cy=Math.floor(screenY / tTileH)*tTileH+tTileH / 2;
					rx=(screenX-cx)*tTileH / 2;
					ry=(screenY-cy)*tTileW / 2;
					if (Math.abs(rx)+Math.abs(ry)<=tTileW *tTileH / 4){
						tU=Math.floor(screenX / tTileW);
						tV=Math.floor(screenY / tTileH)*2;
						}else {
						screenX=screenX-tTileW / 2;
						tU=Math.floor(screenX / tTileW)+1;
						screenY=screenY-tTileH / 2;
						tV=Math.floor(screenY / tTileH)*2+1;
					}
					result.x=tU-(tV & 1);
					result.y=tV;
				}
				return true;
				break ;
			case /*laya.map.TiledMap.ORIENTATION_ORTHOGONAL*/"orthogonal":
				tU=screenX / tTileW;
				tV=screenY / tTileH;
				if (result){
					result.x=tU;
					result.y=tV;
				}
				return true;
				break ;
			case /*laya.map.TiledMap.ORIENTATION_HEXAGONAL*/"hexagonal":;
				var tTileHeight=tTileH *2 / 3;
				tV=screenY / tTileHeight;
				tU=(screenX-tV % 2 *this._tileWidthHalf)/ tTileW;
				if (result){
					result.x=tU;
					result.y=tV;
				}
				break ;
			}
		return false;
	}

	/**
	*得到一个GridSprite
	*@param gridX 当前Grid的X轴索引
	*@param gridY 当前Grid的Y轴索引
	*@return 一个GridSprite对象
	*/
	__proto.getDrawSprite=function(gridX,gridY){
		var tSprite=new GridSprite();
		tSprite.relativeX=gridX *this._map.gridWidth;
		tSprite.relativeY=gridY *this._map.gridHeight;
		tSprite.initData(this._map);
		this._gridSpriteArray.push(tSprite);
		return tSprite;
	}

	/**
	*更新此层中块的坐标
	*手动刷新的目的是，保持层级的宽和高保持最小，加快渲染
	*/
	__proto.updateGridPos=function(){
		var tSprite;
		for (var i=0;i < this._gridSpriteArray.length;i++){
			tSprite=this._gridSpriteArray[i];
			if ((tSprite._visible || tSprite.isAloneObject)&& tSprite.drawImageNum > 0){
				tSprite.updatePos();
			}
		}
	}

	/**
	*@private
	*把tile画到指定的显示对象上
	*@param gridSprite 被指定显示的目标
	*@param tileX 格子的X轴坐标
	*@param tileY 格子的Y轴坐标
	*@return
	*/
	__proto.drawTileTexture=function(gridSprite,tileX,tileY){
		if (tileY >=0 && tileY < this._map.numRowsTile && tileX >=0 && tileX < this._map.numColumnsTile){
			var tIndex=tileY *this._map.numColumnsTile+tileX;
			var tMapData=this._mapData;
			if (tMapData !=null && tIndex < tMapData.length){
				if (tMapData[tIndex] !=0){
					var tTileTexSet=this._map.getTexture(tMapData[tIndex]);
					if (tTileTexSet){
						var tX=0;
						var tY=0;
						var tTexture=tTileTexSet.texture;
						switch (this._map.orientation){
							case /*laya.map.TiledMap.ORIENTATION_STAGGERED*/"staggered":
								tX=tileX *this._map.tileWidth % this._map.gridWidth+(tileY & 1)*this._tileWidthHalf;
								tY=tileY *this._tileHeightHalf % this._map.gridHeight;
								break ;
							case /*laya.map.TiledMap.ORIENTATION_ORTHOGONAL*/"orthogonal":
								tX=tileX *this._map.tileWidth % this._map.gridWidth;
								tY=tileY *this._map.tileHeight % this._map.gridHeight;
								break ;
							case /*laya.map.TiledMap.ORIENTATION_ISOMETRIC*/"isometric":
								tX=(this._mapWidthHalf+(tileX-tileY)*this._tileWidthHalf)% this._map.gridWidth;
								tY=((tileX+tileY)*this._tileHeightHalf)% this._map.gridHeight;
								break ;
							case /*laya.map.TiledMap.ORIENTATION_HEXAGONAL*/"hexagonal":;
								var tTileHeight=this._map.tileHeight *2 / 3;
								tX=(tileX *this._map.tileWidth+tileY % 2 *this._tileWidthHalf)% this._map.gridWidth;
								tY=(tileY *tTileHeight)% this._map.gridHeight;
								break ;
							}
						if (tTileTexSet.isAnimation){
							var tAnimationSprite=new TileAniSprite();
							tAnimationSprite.x=tX;
							tAnimationSprite.y=tY;
							tAnimationSprite.setTileTextureSet(tIndex.toString(),tTileTexSet);
							gridSprite.addAniSprite(tAnimationSprite);
							gridSprite.addChild(tAnimationSprite);
							gridSprite.isHaveAnimation=true;
							}else {
							gridSprite.graphics.drawImage(tTileTexSet.texture,tX+tTileTexSet.offX,tY+tTileTexSet.offY);
						}
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	*@private
	*清理当前对象
	*/
	__proto.clearAll=function(){
		this._map=null;
		this._mapData=null;
		this._tileWidthHalf=0;
		this._tileHeightHalf=0;
		this._mapWidthHalf=0;
		this._mapHeightHalf=0;
		this.layerName=null;
		var i=0;
		if (this._objDic){
			for (var p in this._objDic){
				delete this._objDic[p];
			}
			this._objDic=null;
		}
		if (this._dataDic){
			for (p in this._dataDic){
				delete this._dataDic[p];
			}
			this._dataDic=null;
		};
		var tGridSprite;
		for (i=0;i < this._gridSpriteArray.length;i++){
			tGridSprite=this._gridSpriteArray[i];
			tGridSprite.clearAll();
		}
		this._properties=null;
		this._tempMapPos=null;
		this.tarLayer=null;
	}

	return MapLayer;
})(Sprite)


/**
*TildMap的动画显示对象（一个动画（TileTexSet），可以绑定多个动画显示对象（TileAniSprite））
*@author ...
*/

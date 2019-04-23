//class laya.map.TiledMap
var TiledMap=(function(){
	var GRect,TileMapAniData,TileSet;
	function TiledMap(){
		//json数据
		this._jsonData=null;
		//存放地图中用到的所有子纹理数据
		this._tileTexSetArr=[];
		//主纹理数据，主要在释放纹理资源时使用
		this._texArray=[];
		//地图信息中的一些基本数据
		this._x=0;
		//地图的坐标
		this._y=0;
		//_height=_mapTileH *_mapH
		this._width=0;
		//地图的宽度
		this._height=0;
		//地图的高度
		this._mapW=0;
		//地图的横向格子数
		this._mapH=0;
		//地图的竖向格子数
		this._mapTileW=0;
		//tile的宽度
		this._mapTileH=0;
		//地图的显示对象
		this._mapSprite=null;
		//地图的显示对象
		this._layerArray=[];
		//这里保存所有的MapLayer对象
		this._renderLayerArray=[];
		//这里保存需要渲染的MapLayer对象
		this._gridArray=[];
		//地图块相关的
		this._showGridKey=false;
		//是否显示块边界线（用来调试用）
		this._totalGridNum=0;
		//一层中的GridSprite的总数
		this._gridW=0;
		//地图的横向块数
		this._gridH=0;
		//地图的坚向块数
		this._gridWidth=450;
		//块的默认宽度
		this._gridHeight=450;
		//块的默认高度
		this._jsonLoader=null;
		//用来加载JSON文件用的LOADER
		this._loader=null;
		//用来加载纹理数据用的LOADER
		this._tileSetArray=[];
		//用来存放还需要哪些儿纹理等待加载
		this._currTileSet=null;
		//正在加载的纹理需要的数据源
		this._completeHandler=null;
		//上次视口显示的块范围
		this._index=0;
		this._animationDic={};
		//需要创建的动画数据
		this._properties=null;
		//当前地图的自定义属性
		this._tileProperties={};
		//图块属性
		this._tileProperties2={};
		//默认的地图类型（具体要看JSON文件）
		this._orientation="orthogonal";
		//默认的tile渲染顺序（具体要看JSON文件）
		this._renderOrder="right-down";
		//调试用的颜色组合
		this._colorArray=["FF","00","33","66"];
		//缩放相关的操作
		this._scale=1;
		this._pivotScaleX=0.5;
		this._pivotScaleY=0.5;
		this._centerX=0;
		this._centerY=0;
		/**@private */
		this._viewPortX=0;
		/**@private */
		this._viewPortY=0;
		this._viewPortWidth=0;
		this._viewPortHeight=0;
		//是否开启线性取样
		this._enableLinear=true;
		//资源的相对路径
		this._resPath=null;
		this._pathArray=null;
		//把地图限制在显示区域
		this._limitRange=false;
		/**
		*是否自动缓存没有动画的地块
		*/
		this.autoCache=true;
		/**
		*自动缓存类型,地图较大时建议使用normal
		*/
		this.autoCacheType="normal";
		/**
		*是否合并图层,开启合并图层时，图层属性内可添加layer属性，运行时将会将相邻的layer属性相同的图层进行合并以提高性能
		*/
		this.enableMergeLayer=false;
		/**
		*是否移除被覆盖的格子,地块可添加type属性，type不为0时表示不透明，被不透明地块遮挡的地块将会被剔除以提高性能
		*/
		this.removeCoveredTile=false;
		/**
		*是否显示大格子里显示的贴图数量
		*/
		this.showGridTextureCount=false;
		/**
		*是否调整地块边缘消除缩放导致的缝隙
		*/
		this.antiCrack=true;
		/**
		*是否在加载完成之后cache所有大格子
		*/
		this.cacheAllAfterInit=false;
		this._texutreStartDic={};
		this._rect=new Rectangle();
		this._paddingRect=new Rectangle();
		this._mapRect=new GRect();
		this._mapLastRect=new GRect();
	}

	__class(TiledMap,'laya.map.TiledMap');
	var __proto=TiledMap.prototype;
	/**
	*创建地图
	*@param mapName JSON文件名字
	*@param viewRect 视口区域
	*@param completeHandler 地图创建完成的回调函数
	*@param viewRectPadding 视口扩充区域，把视口区域上、下、左、右扩充一下，防止视口移动时的穿帮
	*@param gridSize grid大小
	*@param enableLinear 是否开启线性取样（为false时，可以解决地图黑线的问题，但画质会锐化）
	*@param limitRange 把地图限制在显示区域
	*/
	__proto.createMap=function(mapName,viewRect,completeHandler,viewRectPadding,gridSize,enableLinear,limitRange){
		(enableLinear===void 0)&& (enableLinear=true);
		(limitRange===void 0)&& (limitRange=false);
		this._enableLinear=enableLinear;
		this._limitRange=limitRange;
		this._rect.x=viewRect.x;
		this._rect.y=viewRect.y;
		this._rect.width=viewRect.width;
		this._rect.height=viewRect.height;
		this._viewPortWidth=viewRect.width / this._scale;
		this._viewPortHeight=viewRect.height / this._scale;
		this._completeHandler=completeHandler;
		if (viewRectPadding){
			this._paddingRect.copyFrom(viewRectPadding);
		}
		else {
			this._paddingRect.setTo(0,0,0,0);
		}
		if (gridSize){
			this._gridWidth=gridSize.x;
			this._gridHeight=gridSize.y;
		};
		var tIndex=mapName.lastIndexOf("/");
		if (tIndex >-1){
			this._resPath=mapName.substr(0,tIndex);
			this._pathArray=this._resPath.split("/");
		}
		else {
			this._resPath="";
			this._pathArray=[];
		}
		this._jsonLoader=new Loader();
		this._jsonLoader.once("complete",this,this.onJsonComplete);
		this._jsonLoader.load(mapName,/*laya.net.Loader.JSON*/"json",false);
	}

	/**
	*json文件读取成功后，解析里面的纹理数据，进行加载
	*@param e JSON数据
	*/
	__proto.onJsonComplete=function(e){
		this._mapSprite=new Sprite();
		Laya.stage.addChild(this._mapSprite);
		var tJsonData=this._jsonData=e;
		this._properties=tJsonData.properties;
		this._orientation=tJsonData.orientation;
		this._renderOrder=tJsonData.renderorder;
		this._mapW=tJsonData.width;
		this._mapH=tJsonData.height;
		this._mapTileW=tJsonData.tilewidth;
		this._mapTileH=tJsonData.tileheight;
		this._width=this._mapTileW *this._mapW;
		this._height=this._mapTileH *this._mapH;
		if (this._orientation=="staggered"){
			this._height=(0.5+this._mapH *0.5)*this._mapTileH;
		}
		this._mapLastRect.top=this._mapLastRect.bottom=this._mapLastRect.left=this._mapLastRect.right=-1;
		var tArray=tJsonData.tilesets;
		var tileset;
		var tTileSet;
		var i=0;
		for (i=0;i < tArray.length;i++){
			tileset=tArray[i];
			tTileSet=new TileSet();
			tTileSet.init(tileset);
			if (tTileSet.properties && tTileSet.properties.ignore)continue ;
			this._tileProperties[i]=tTileSet.tileproperties;
			this.addTileProperties(tTileSet.tileproperties);
			this._tileSetArray.push(tTileSet);
			var tTiles=tileset.tiles;
			if (tTiles){
				for (var p in tTiles){
					var tAnimation=tTiles[p].animation;
					if (tAnimation){
						var tAniData=new TileMapAniData();
						this._animationDic[p]=tAniData;
						tAniData.image=tileset.image;
						for (var j=0;j < tAnimation.length;j++){
							var tAnimationItem=tAnimation[j];
							tAniData.mAniIdArray.push(tAnimationItem.tileid);
							tAniData.mDurationTimeArray.push(tAnimationItem.duration);
						}
					}
				}
			}
		}
		this._tileTexSetArr.push(null);
		if (this._tileSetArray.length > 0){
			tTileSet=this._currTileSet=this._tileSetArray.shift();
			this._loader=new Loader();
			this._loader.once("complete",this,this.onTextureComplete);
			var tPath=this.mergePath(this._resPath,tTileSet.image);
			this._loader.load(tPath,/*laya.net.Loader.IMAGE*/"image",false);
		}
	}

	/**
	*合并路径
	*@param resPath
	*@param relativePath
	*@return
	*/
	__proto.mergePath=function(resPath,relativePath){
		var tResultPath="";
		var tImageArray=relativePath.split("/");
		var tParentPathNum=0;
		var i=0;
		for (i=tImageArray.length-1;i >=0;i--){
			if (tImageArray[i]==".."){
				tParentPathNum++;
			}
		}
		if (tParentPathNum==0){
			if (this._pathArray.length > 0){
				tResultPath=resPath+"/"+relativePath;
			}
			else {
				tResultPath=relativePath;
			}
			return tResultPath;
		};
		var tSrcNum=this._pathArray.length-tParentPathNum;
		if (tSrcNum < 0){
			console.log("[error]path does not exist",this._pathArray,tImageArray,resPath,relativePath);
		}
		for (i=0;i < tSrcNum;i++){
			if (i==0){
				tResultPath+=this._pathArray[i];
			}
			else {
				tResultPath=tResultPath+"/"+this._pathArray[i];
			}
		}
		for (i=tParentPathNum;i < tImageArray.length;i++){
			tResultPath=tResultPath+"/"+tImageArray[i];
		}
		return tResultPath;
	}

	/**
	*纹理加载完成，如果所有的纹理加载，开始初始化地图
	*@param e 纹理数据
	*/
	__proto.onTextureComplete=function(e){
		var json=this._jsonData;
		var tTexture=e;
		if (Render.isWebGL && (!this._enableLinear)){
			tTexture.bitmap.minFifter=0x2600;
			tTexture.bitmap.magFifter=0x2600;
			tTexture.bitmap.enableMerageInAtlas=false;
		}
		this._texArray.push(tTexture);
		var tSubTexture=null;
		var tTileSet=this._currTileSet;
		var tTileTextureW=tTileSet.tilewidth;
		var tTileTextureH=tTileSet.tileheight;
		var tImageWidth=tTileSet.imagewidth;
		var tImageHeight=tTileSet.imageheight;
		var tFirstgid=tTileSet.firstgid;
		var tTileWNum=Math.floor((tImageWidth-tTileSet.margin-tTileTextureW)/ (tTileTextureW+tTileSet.spacing))+1;
		var tTileHNum=Math.floor((tImageHeight-tTileSet.margin-tTileTextureH)/ (tTileTextureH+tTileSet.spacing))+1;
		var tTileTexSet=null;
		this._texutreStartDic[tTileSet.image]=this._tileTexSetArr.length;
		for (var i=0;i < tTileHNum;i++){
			for (var j=0;j < tTileWNum;j++){
				tTileTexSet=new TileTexSet();
				tTileTexSet.offX=tTileSet.titleoffsetX;
				tTileTexSet.offY=tTileSet.titleoffsetY-(tTileTextureH-this._mapTileH);
				tTileTexSet.texture=Texture.createFromTexture(tTexture,tTileSet.margin+(tTileTextureW+tTileSet.spacing)*j,tTileSet.margin+(tTileTextureH+tTileSet.spacing)*i,tTileTextureW,tTileTextureH);
				if(this.antiCrack)
					this.adptTexture(tTileTexSet.texture);
				this._tileTexSetArr.push(tTileTexSet);
				tTileTexSet.gid=this._tileTexSetArr.length;
			}
		}
		if (this._tileSetArray.length > 0){
			tTileSet=this._currTileSet=this._tileSetArray.shift();
			this._loader.once("complete",this,this.onTextureComplete);
			var tPath=this.mergePath(this._resPath,tTileSet.image);
			this._loader.load(tPath,/*laya.net.Loader.IMAGE*/"image",false);
		}
		else {
			this._currTileSet=null;
			this.initMap();
		}
	}

	__proto.adptTexture=function(tex){
		if (!tex)return;
		var pX=tex.uv[0];
		var pX1=tex.uv[2];
		var pY=tex.uv[1];
		var pY1=tex.uv[7];
		var dW=1 / tex.bitmap.width;
		var dH=1 / tex.bitmap.height;
		tex.uv[0]=tex.uv[6]=pX+dW;
		tex.uv[2]=tex.uv[4]=pX1-dW;
		tex.uv[1]=tex.uv[3]=pY+dH;
		tex.uv[5]=tex.uv[7]=pY1-dH;
	}

	/**
	*初始化地图
	*/
	__proto.initMap=function(){
		var i=0,n=0;
		for (var p in this._animationDic){
			var tAniData=this._animationDic[p];
			var gStart=0;
			gStart=this._texutreStartDic[tAniData.image];
			var tTileTexSet=this.getTexture(parseInt(p)+gStart);
			if (tAniData.mAniIdArray.length > 0){
				tTileTexSet.textureArray=[];
				tTileTexSet.durationTimeArray=tAniData.mDurationTimeArray;
				tTileTexSet.isAnimation=true;
				tTileTexSet.animationTotalTime=0;
				for (i=0,n=tTileTexSet.durationTimeArray.length;i < n;i++){
					tTileTexSet.animationTotalTime+=tTileTexSet.durationTimeArray[i];
				}
				for (i=0,n=tAniData.mAniIdArray.length;i < n;i++){
					var tTexture=this.getTexture(tAniData.mAniIdArray[i]+gStart);
					tTileTexSet.textureArray.push(tTexture);
				}
			}
		}
		this._gridWidth=Math.floor(this._gridWidth / this._mapTileW)*this._mapTileW;
		this._gridHeight=Math.floor(this._gridHeight / this._mapTileH)*this._mapTileH;
		if (this._gridWidth < this._mapTileW){
			this._gridWidth=this._mapTileW;
		}
		if (this._gridHeight < this._mapTileH){
			this._gridHeight=this._mapTileH;
		}
		this._gridW=Math.ceil(this._width / this._gridWidth);
		this._gridH=Math.ceil(this._height / this._gridHeight);
		this._totalGridNum=this._gridW *this._gridH;
		for (i=0;i < this._gridH;i++){
			var tGridArray=[];
			this._gridArray.push(tGridArray);
			for (var j=0;j < this._gridW;j++){
				tGridArray.push(null);
			}
		};
		var tLayerArray=this._jsonData.layers;
		var isFirst=true;
		var tTarLayerID=1;
		var tLayerTarLayerName;
		var preLayerTarName;
		var preLayer;
		for (var tLayerLoop=0;tLayerLoop < tLayerArray.length;tLayerLoop++){
			var tLayerData=tLayerArray[tLayerLoop];
			if (tLayerData.visible==true){
				var tMapLayer=new MapLayer();
				tMapLayer.init(tLayerData,this);
				if (!this.enableMergeLayer){
					this._mapSprite.addChild(tMapLayer);
					this._renderLayerArray.push(tMapLayer);
					}else{
					tLayerTarLayerName=tMapLayer.getLayerProperties("layer");
					isFirst=isFirst || (!preLayer)|| (tLayerTarLayerName !=preLayerTarName);
					if (isFirst){
						isFirst=false;
						tMapLayer.tarLayer=tMapLayer;
						preLayer=tMapLayer;
						this._mapSprite.addChild(tMapLayer);
						this._renderLayerArray.push(tMapLayer);
						}else{
						tMapLayer.tarLayer=preLayer;
					}
					preLayerTarName=tLayerTarLayerName;
				}
				this._layerArray.push(tMapLayer);
			}
		}
		if (this.removeCoveredTile){
			this.adptTiledMapData();
		}
		if (this.cacheAllAfterInit){
			this.cacheAllGrid();
		}
		this.moveViewPort(this._rect.x,this._rect.y);
		if (this._completeHandler !=null){
			this._completeHandler.run();
		}
	}

	//这里应该发送消息，通知上层，地图创建完成
	__proto.addTileProperties=function(tileDataDic){
		var key;
		for (key in tileDataDic){
			this._tileProperties2[key]=tileDataDic[key];
		}
	}

	__proto.getTileUserData=function(id,sign,defaultV){
		if (!this._tileProperties2 || !this._tileProperties2[id] || !(sign in this._tileProperties2[id]))return defaultV;
		return this._tileProperties2[id][sign];
	}

	__proto.adptTiledMapData=function(){
		var i=0,len=0;
		len=this._layerArray.length;
		var tLayer;
		var noNeeds={};
		var tDatas;
		for (i=len-1;i >=0;i--){
			tLayer=this._layerArray[i];
			tDatas=tLayer._mapData;
			if (!tDatas)continue ;
			this.removeCoverd(tDatas,noNeeds);
			this.collectCovers(tDatas,noNeeds,i);
		}
	}

	__proto.removeCoverd=function(datas,noNeeds){
		var i=0,len=0;
		len=datas.length;
		for (i=0;i < len;i++){
			if (noNeeds[i]){
				datas[i]=0;
			}
		}
	}

	__proto.collectCovers=function(datas,noNeeds,layer){
		var i=0,len=0;
		len=datas.length;
		var tTileData=0;
		var isCover=0;
		for (i=0;i < len;i++){
			tTileData=datas[i];
			if (tTileData > 0){
				isCover=this.getTileUserData(tTileData-1,"type",0);
				if (isCover > 0){
					noNeeds[i]=tTileData;
				}
			}
		}
	}

	/**
	*得到一块指定的地图纹理
	*@param index 纹理的索引值，默认从1开始
	*@return
	*/
	__proto.getTexture=function(index){
		if (index < this._tileTexSetArr.length){
			return this._tileTexSetArr[index];
		}
		return null;
	}

	/**
	*得到地图的自定义属性
	*@param name 属性名称
	*@return
	*/
	__proto.getMapProperties=function(name){
		if (this._properties){
			return this._properties[name];
		}
		return null;
	}

	/**
	*得到tile自定义属性
	*@param index 地图块索引
	*@param id 具体的TileSetID
	*@param name 属性名称
	*@return
	*/
	__proto.getTileProperties=function(index,id,name){
		if (this._tileProperties[index] && this._tileProperties[index][id]){
			return this._tileProperties[index][id][name];
		}
		return null;
	}

	/**
	*通过纹理索引，生成一个可控制物件
	*@param index 纹理的索引值，默认从1开始
	*@return
	*/
	__proto.getSprite=function(index,width,height){
		if (0 < this._tileTexSetArr.length){
			var tGridSprite=new GridSprite();
			tGridSprite.initData(this,true);
			tGridSprite.size(width,height);
			var tTileTexSet=this._tileTexSetArr[index];
			if (tTileTexSet !=null && tTileTexSet.texture !=null){
				if (tTileTexSet.isAnimation){
					var tAnimationSprite=new TileAniSprite();
					this._index++;
					tAnimationSprite.setTileTextureSet(this._index.toString(),tTileTexSet);
					tGridSprite.addAniSprite(tAnimationSprite);
					tGridSprite.addChild(tAnimationSprite);
				}
				else {
					tGridSprite.graphics.drawImage(tTileTexSet.texture,0,0,width,height);
				}
				tGridSprite.drawImageNum++;
			}
			return tGridSprite;
		}
		return null;
	}

	/**
	*设置视口的缩放中心点（例如：scaleX=scaleY=0.5,就是以视口中心缩放）
	*@param scaleX
	*@param scaleY
	*/
	__proto.setViewPortPivotByScale=function(scaleX,scaleY){
		this._pivotScaleX=scaleX;
		this._pivotScaleY=scaleY;
	}

	/**
	*移动视口
	*@param moveX 视口的坐标x
	*@param moveY 视口的坐标y
	*/
	__proto.moveViewPort=function(moveX,moveY){
		this._x=-moveX;
		this._y=-moveY;
		this._rect.x=moveX;
		this._rect.y=moveY;
		this.updateViewPort();
	}

	/**
	*改变视口大小
	*@param moveX 视口的坐标x
	*@param moveY 视口的坐标y
	*@param width 视口的宽
	*@param height 视口的高
	*/
	__proto.changeViewPort=function(moveX,moveY,width,height){
		if (moveX==this._rect.x && moveY==this._rect.y && width==this._rect.width && height==this._rect.height)return;
		this._x=-moveX;
		this._y=-moveY;
		this._rect.x=moveX;
		this._rect.y=moveY;
		this._rect.width=width;
		this._rect.height=height;
		this._viewPortWidth=width / this._scale;
		this._viewPortHeight=height / this._scale;
		this.updateViewPort();
	}

	/**
	*在锚点的基础上计算，通过宽和高，重新计算视口
	*@param width 新视口宽
	*@param height 新视口高
	*@param rect 返回的结果
	*@return
	*/
	__proto.changeViewPortBySize=function(width,height,rect){
		if (rect==null){
			rect=new Rectangle();
		}
		this._centerX=this._rect.x+this._rect.width *this._pivotScaleX;
		this._centerY=this._rect.y+this._rect.height *this._pivotScaleY;
		rect.x=this._centerX-width *this._pivotScaleX;
		rect.y=this._centerY-height *this._pivotScaleY;
		rect.width=width;
		rect.height=height;
		this.changeViewPort(rect.x,rect.y,rect.width,rect.height);
		return rect;
	}

	/**
	*刷新视口
	*/
	__proto.updateViewPort=function(){
		this._centerX=this._rect.x+this._rect.width *this._pivotScaleX;
		this._centerY=this._rect.y+this._rect.height *this._pivotScaleY;
		var posChanged=false;
		var preValue=this._viewPortX;
		this._viewPortX=this._centerX-this._rect.width *this._pivotScaleX / this._scale;
		if (preValue !=this._viewPortX){
			posChanged=true;
			}else {
			preValue=this._viewPortY;
		}
		this._viewPortY=this._centerY-this._rect.height *this._pivotScaleY / this._scale;
		if (!posChanged && preValue !=this._viewPortY){
			posChanged=true;
		}
		if (this._limitRange){
			var tRight=this._viewPortX+this._viewPortWidth;
			if (tRight > this._width){
				this._viewPortX=this._width-this._viewPortWidth;
			};
			var tBottom=this._viewPortY+this._viewPortHeight;
			if (tBottom > this._height){
				this._viewPortY=this._height-this._viewPortHeight;
			}
			if (this._viewPortX < 0){
				this._viewPortX=0;
			}
			if (this._viewPortY < 0){
				this._viewPortY=0;
			}
		};
		var tPaddingRect=this._paddingRect;
		this._mapRect.top=Math.floor((this._viewPortY-tPaddingRect.y)/ this._gridHeight);
		this._mapRect.bottom=Math.floor((this._viewPortY+this._viewPortHeight+tPaddingRect.height+tPaddingRect.y)/ this._gridHeight);
		this._mapRect.left=Math.floor((this._viewPortX-tPaddingRect.x)/ this._gridWidth);
		this._mapRect.right=Math.floor((this._viewPortX+this._viewPortWidth+tPaddingRect.width+tPaddingRect.x)/ this._gridWidth);
		if (this._mapRect.top !=this._mapLastRect.top || this._mapRect.bottom !=this._mapLastRect.bottom || this._mapRect.left !=this._mapLastRect.left || this._mapRect.right !=this._mapLastRect.right){
			this.clipViewPort();
			this._mapLastRect.top=this._mapRect.top;
			this._mapLastRect.bottom=this._mapRect.bottom;
			this._mapLastRect.left=this._mapRect.left;
			this._mapLastRect.right=this._mapRect.right;
			posChanged=true;
		}
		if (!posChanged)return;
		var tMapLayer;
		var len=this._renderLayerArray.length;
		for (var i=0;i < len;i++){
			tMapLayer=this._renderLayerArray[i];
			if (tMapLayer._gridSpriteArray.length > 0)
				tMapLayer.updateGridPos();
		}
	}

	/**
	*GRID裁剪
	*/
	__proto.clipViewPort=function(){
		var tSpriteNum=0;
		var tSprite;
		var tIndex=0;
		var tSub=0;
		var tAdd=0;
		var i=0,j=0;
		if (this._mapRect.left > this._mapLastRect.left){
			tSub=this._mapRect.left-this._mapLastRect.left;
			if (tSub > 0){
				for (j=this._mapLastRect.left;j < this._mapLastRect.left+tSub;j++){
					for (i=this._mapLastRect.top;i <=this._mapLastRect.bottom;i++){
						this.hideGrid(j,i);
					}
				}
			}
		}
		else {
			tAdd=Math.min(this._mapLastRect.left,this._mapRect.right+1)-this._mapRect.left;
			if (tAdd > 0){
				for (j=this._mapRect.left;j < this._mapRect.left+tAdd;j++){
					for (i=this._mapRect.top;i <=this._mapRect.bottom;i++){
						this.showGrid(j,i);
					}
				}
			}
		}
		if (this._mapRect.right > this._mapLastRect.right){
			tAdd=this._mapRect.right-this._mapLastRect.right;
			if (tAdd > 0){
				for (j=Math.max(this._mapLastRect.right+1,this._mapRect.left);j <=this._mapLastRect.right+tAdd;j++){
					for (i=this._mapRect.top;i <=this._mapRect.bottom;i++){
						this.showGrid(j,i);
					}
				}
			}
		}
		else {
			tSub=this._mapLastRect.right-this._mapRect.right
			if (tSub > 0){
				for (j=this._mapRect.right+1;j <=this._mapRect.right+tSub;j++){
					for (i=this._mapLastRect.top;i <=this._mapLastRect.bottom;i++){
						this.hideGrid(j,i);
					}
				}
			}
		}
		if (this._mapRect.top > this._mapLastRect.top){
			tSub=this._mapRect.top-this._mapLastRect.top;
			if (tSub > 0){
				for (i=this._mapLastRect.top;i < this._mapLastRect.top+tSub;i++){
					for (j=this._mapLastRect.left;j <=this._mapLastRect.right;j++){
						this.hideGrid(j,i);
					}
				}
			}
		}
		else {
			tAdd=Math.min(this._mapLastRect.top,this._mapRect.bottom+1)-this._mapRect.top;
			if (tAdd > 0){
				for (i=this._mapRect.top;i < this._mapRect.top+tAdd;i++){
					for (j=this._mapRect.left;j <=this._mapRect.right;j++){
						this.showGrid(j,i);
					}
				}
			}
		}
		if (this._mapRect.bottom > this._mapLastRect.bottom){
			tAdd=this._mapRect.bottom-this._mapLastRect.bottom;
			if (tAdd > 0){
				for (i=Math.max(this._mapLastRect.bottom+1,this._mapRect.top);i <=this._mapLastRect.bottom+tAdd;i++){
					for (j=this._mapRect.left;j <=this._mapRect.right;j++){
						this.showGrid(j,i);
					}
				}
			}
		}
		else {
			tSub=this._mapLastRect.bottom-this._mapRect.bottom
			if (tSub > 0){
				for (i=this._mapRect.bottom+1;i <=this._mapRect.bottom+tSub;i++){
					for (j=this._mapLastRect.left;j <=this._mapLastRect.right;j++){
						this.hideGrid(j,i);
					}
				}
			}
		}
	}

	/**
	*显示指定的GRID
	*@param gridX
	*@param gridY
	*/
	__proto.showGrid=function(gridX,gridY){
		if (gridX < 0 || gridX >=this._gridW || gridY < 0 || gridY >=this._gridH){
			return;
		};
		var i=0,j=0;
		var tGridSprite;
		var tTempArray=this._gridArray[gridY][gridX];
		if (tTempArray==null){
			tTempArray=this.getGridArray(gridX,gridY);
		}
		else {
			for (i=0;i < tTempArray.length && i < this._layerArray.length;i++){
				var tLayerSprite=this._layerArray[i];
				if (tLayerSprite && tTempArray[i]){
					tGridSprite=tTempArray[i];
					if (tGridSprite._visible==false && tGridSprite.drawImageNum > 0){
						tGridSprite.show();
					}
				}
			}
		}
	}

	__proto.cacheAllGrid=function(){
		var i=0,j=0;
		var tempArr;
		for (i=0;i < this._gridW;i++){
			for (j=0;j < this._gridH;j++){
				tempArr=this.getGridArray(i,j);
				this.cacheGridsArray(tempArr);
			}
		}
	}

	__proto.cacheGridsArray=function(arr){
		var canvas;
		if (!TiledMap._tempCanvas){
			TiledMap._tempCanvas=new HTMLCanvas();
			var tx=TiledMap._tempCanvas.context;
			if (!tx){
				tx=TiledMap._tempCanvas.getContext('2d');
				tx.__tx=0;
				tx.__ty=0;
			}
		}
		canvas=TiledMap._tempCanvas;
		canvas.context.asBitmap=false;
		var i=0,len=0;
		len=arr.length;
		var tGrid;
		for (i=0;i < len;i++){
			tGrid=arr[i];
			canvas.clear();
			canvas.size(1,1);
			tGrid.render(canvas.context,0,0);
			tGrid.hide();
		}
		canvas.clear();
		canvas.size(1,1);
	}

	__proto.getGridArray=function(gridX,gridY){
		var i=0,j=0;
		var tGridSprite;
		var tTempArray=this._gridArray[gridY][gridX];
		if (tTempArray==null){
			tTempArray=this._gridArray[gridY][gridX]=[];
			var tLeft=0;
			var tRight=0;
			var tTop=0;
			var tBottom=0;
			var tGridWidth=this._gridWidth;
			var tGridHeight=this._gridHeight;
			switch (this.orientation){
				case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_ISOMETRIC*/"isometric":
					tLeft=Math.floor(gridX *tGridWidth);
					tRight=Math.floor(gridX *tGridWidth+tGridWidth);
					tTop=Math.floor(gridY *tGridHeight);
					tBottom=Math.floor(gridY *tGridHeight+tGridHeight);
					var tLeft1=0,tRight1=0,tTop1=0,tBottom1=0;
					break ;
				case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_STAGGERED*/"staggered":
					tLeft=Math.floor(gridX *tGridWidth / this._mapTileW);
					tRight=Math.floor((gridX *tGridWidth+tGridWidth)/ this._mapTileW);
					tTop=Math.floor(gridY *tGridHeight / (this._mapTileH / 2));
					tBottom=Math.floor((gridY *tGridHeight+tGridHeight)/ (this._mapTileH / 2));
					break ;
				case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_ORTHOGONAL*/"orthogonal":
					tLeft=Math.floor(gridX *tGridWidth / this._mapTileW);
					tRight=Math.floor((gridX *tGridWidth+tGridWidth)/ this._mapTileW);
					tTop=Math.floor(gridY *tGridHeight / this._mapTileH);
					tBottom=Math.floor((gridY *tGridHeight+tGridHeight)/ this._mapTileH);
					break ;
				case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_HEXAGONAL*/"hexagonal":;
					var tHeight=this._mapTileH *2 / 3;
					tLeft=Math.floor(gridX *tGridWidth / this._mapTileW);
					tRight=Math.ceil((gridX *tGridWidth+tGridWidth)/ this._mapTileW);
					tTop=Math.floor(gridY *tGridHeight / tHeight);
					tBottom=Math.ceil((gridY *tGridHeight+tGridHeight)/ tHeight);
					break ;
				};
			var tLayer=null;
			var tTGridSprite;
			var tDrawMapLayer;
			for (var z=0;z < this._layerArray.length;z++){
				tLayer=this._layerArray[z];
				if (this.enableMergeLayer){
					if (tLayer.tarLayer !=tDrawMapLayer){
						tTGridSprite=null;
						tDrawMapLayer=tLayer.tarLayer;
					}
					if (!tTGridSprite){
						tTGridSprite=tDrawMapLayer.getDrawSprite(gridX,gridY);
						tTempArray.push(tTGridSprite);
					}
					tGridSprite=tTGridSprite;
				}
				else {
					tGridSprite=tLayer.getDrawSprite(gridX,gridY);
					tTempArray.push(tGridSprite);
				};
				var tColorStr;
				if (this._showGridKey){
					tColorStr="#";
					tColorStr+=this._colorArray[Math.floor(Math.random()*this._colorArray.length)];
					tColorStr+=this._colorArray[Math.floor(Math.random()*this._colorArray.length)];
					tColorStr+=this._colorArray[Math.floor(Math.random()*this._colorArray.length)];
				}
				switch (this.orientation){
					case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_ISOMETRIC*/"isometric":;
						var tHalfTileHeight=this.tileHeight / 2;
						var tHalfTileWidth=this.tileWidth / 2;
						var tHalfMapWidth=this._width / 2;
						tTop1=Math.floor(tTop / tHalfTileHeight);
						tBottom1=Math.floor(tBottom / tHalfTileHeight);
						tLeft1=this._mapW+Math.floor((tLeft-tHalfMapWidth)/ tHalfTileWidth);
						tRight1=this._mapW+Math.floor((tRight-tHalfMapWidth)/ tHalfTileWidth);
						var tMapW=this._mapW *2;
						var tMapH=this._mapH *2;
						if (tTop1 < 0){
							tTop1=0;
						}
						if (tTop1 >=tMapH){
							tTop1=tMapH-1;
						}
						if (tBottom1 < 0){
							tBottom=0;
						}
						if (tBottom1 >=tMapH){
							tBottom1=tMapH-1;
						}
						tGridSprite.zOrder=this._totalGridNum *z+gridY *this._gridW+gridX;
						for (i=tTop1;i < tBottom1;i++){
							for (j=0;j <=i;j++){
								var tIndexX=i-j;
								var tIndexY=j;
								var tIndexValue=(tIndexX-tIndexY)+this._mapW;
								if (tIndexValue > tLeft1 && tIndexValue <=tRight1){
									if (tLayer.drawTileTexture(tGridSprite,tIndexX,tIndexY)){
										tGridSprite.drawImageNum++;
									}
								}
							}
						}
						break ;
					case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_STAGGERED*/"staggered":
						tGridSprite.zOrder=z *this._totalGridNum+gridY *this._gridW+gridX;
						for (i=tTop;i < tBottom;i++){
							for (j=tLeft;j < tRight;j++){
								if (tLayer.drawTileTexture(tGridSprite,j,i)){
									tGridSprite.drawImageNum++;
								}
							}
						}
						break ;
					case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_ORTHOGONAL*/"orthogonal":
					case /*CLASS CONST:laya.map.TiledMap.ORIENTATION_HEXAGONAL*/"hexagonal":
					switch (this._renderOrder){
						case "right-down":
							tGridSprite.zOrder=z *this._totalGridNum+gridY *this._gridW+gridX;
							for (i=tTop;i < tBottom;i++){
								for (j=tLeft;j < tRight;j++){
									if (tLayer.drawTileTexture(tGridSprite,j,i)){
										tGridSprite.drawImageNum++;
									}
								}
							}
							break ;
						case "right-up":
							tGridSprite.zOrder=z *this._totalGridNum+(this._gridH-1-gridY)*this._gridW+gridX;
							for (i=tBottom-1;i >=tTop;i--){
								for (j=tLeft;j < tRight;j++){
									if (tLayer.drawTileTexture(tGridSprite,j,i)){
										tGridSprite.drawImageNum++;
									}
								}
							}
							break ;
						case "left-down":
							tGridSprite.zOrder=z *this._totalGridNum+gridY *this._gridW+(this._gridW-1-gridX);
							for (i=tTop;i < tBottom;i++){
								for (j=tRight-1;j >=tLeft;j--){
									if (tLayer.drawTileTexture(tGridSprite,j,i)){
										tGridSprite.drawImageNum++;
									}
								}
							}
							break ;
						case "left-up":
							tGridSprite.zOrder=z *this._totalGridNum+(this._gridH-1-gridY)*this._gridW+(this._gridW-1-gridX);
							for (i=tBottom-1;i >=tTop;i--){
								for (j=tRight-1;j >=tLeft;j--){
									if (tLayer.drawTileTexture(tGridSprite,j,i)){
										tGridSprite.drawImageNum++;
									}
								}
							}
							break ;
						}
					break ;
				}
				if (!tGridSprite.isHaveAnimation){
					tGridSprite.autoSize=true;
					if (this.autoCache)
						tGridSprite.cacheAs=this.autoCacheType;
					tGridSprite.autoSize=false;
				}
				if (!this.enableMergeLayer){
					if (tGridSprite.drawImageNum > 0){
						tLayer.addChild(tGridSprite);
					}
					if (this._showGridKey){
						tGridSprite.graphics.drawRect(0,0,tGridWidth,tGridHeight,null,tColorStr);
					}
					}else{
					if (tTGridSprite && tTGridSprite.drawImageNum > 0&&tDrawMapLayer){
						tDrawMapLayer.addChild(tTGridSprite);
					}
				}
			}
			if (this.enableMergeLayer&&this.showGridTextureCount){
				if (tTGridSprite){
					tTGridSprite.graphics.fillText(tTGridSprite.drawImageNum+"",20,20,null,"#ff0000","left");
				}
			}
		}
		return tTempArray;
	}

	/**
	*隐藏指定的GRID
	*@param gridX
	*@param gridY
	*/
	__proto.hideGrid=function(gridX,gridY){
		if (gridX < 0 || gridX >=this._gridW || gridY < 0 || gridY >=this._gridH){
			return;
		};
		var tTempArray=this._gridArray[gridY][gridX];
		if (tTempArray){
			var tGridSprite;
			for (var i=0;i < tTempArray.length;i++){
				tGridSprite=tTempArray[i];
				if (tGridSprite.drawImageNum > 0){
					if (tGridSprite !=null){
						tGridSprite.hide();
					}
				}
			}
		}
	}

	/**
	*得到对象层上的某一个物品
	*@param layerName 层的名称
	*@param objectName 所找物品的名称
	*@return
	*/
	__proto.getLayerObject=function(layerName,objectName){
		var tLayer=null;
		for (var i=0;i < this._layerArray.length;i++){
			tLayer=this._layerArray[i];
			if (tLayer.layerName==layerName){
				break ;
			}
		}
		if (tLayer){
			return tLayer.getObjectByName(objectName);
		}
		return null;
	}

	/**
	*销毁地图
	*/
	__proto.destroy=function(){
		this._orientation="orthogonal";
		this._jsonData=null;
		var i=0;
		var j=0;
		var z=0;
		this._gridArray=[];
		var tTileTexSet;
		for (i=0;i < this._tileTexSetArr.length;i++){
			tTileTexSet=this._tileTexSetArr[i];
			if (tTileTexSet){
				tTileTexSet.clearAll();
			}
		}
		this._tileTexSetArr=[];
		var tTexture;
		for (i=0;i < this._texArray.length;i++){
			tTexture=this._texArray[i];
			tTexture.destroy();
		}
		this._texArray=[];
		this._width=0;
		this._height=0;
		this._mapW=0;
		this._mapH=0;
		this._mapTileW=0;
		this._mapTileH=0;
		this._rect.setTo(0,0,0,0);
		var tLayer;
		for (i=0;i < this._layerArray.length;i++){
			tLayer=this._layerArray[i];
			tLayer.clearAll();
		}
		this._layerArray=[];
		this._renderLayerArray=[];
		if (this._mapSprite){
			this._mapSprite.destroy();
			this._mapSprite=null;
		}
		this._jsonLoader=null;
		this._loader=null;
		var tDic=this._animationDic;
		for (var p in tDic){
			delete tDic[p];
		}
		this._properties=null;
		tDic=this._tileProperties;
		for (p in tDic){
			delete tDic[p];
		}
		this._currTileSet=null;
		this._completeHandler=null;
		this._mapRect.clearAll();
		this._mapLastRect.clearAll();
		this._tileSetArray=[];
		this._gridWidth=450;
		this._gridHeight=450;
		this._gridW=0;
		this._gridH=0;
		this._x=0;
		this._y=0;
		this._index=0;
		this._enableLinear=true;
		this._resPath=null;
		this._pathArray=null;
	}

	/**
	*整个地图的显示容器
	*@return 地图的显示容器
	*/
	__proto.mapSprite=function(){
		return this._mapSprite;
	}

	/**
	*得到指定的MapLayer
	*@param layerName 要找的层名称
	*@return
	*/
	__proto.getLayerByName=function(layerName){
		var tMapLayer;
		for (var i=0;i < this._layerArray.length;i++){
			tMapLayer=this._layerArray[i];
			if (layerName==tMapLayer.layerName){
				return tMapLayer;
			}
		}
		return null;
	}

	/**
	*通过索引得MapLayer
	*@param index 要找的层索引
	*@return
	*/
	__proto.getLayerByIndex=function(index){
		if (index < this._layerArray.length){
			return this._layerArray[index];
		}
		return null;
	}

	/**
	*当前地图类型
	*/
	__getset(0,__proto,'orientation',function(){
		return this._orientation;
	});

	/**
	*@private
	*视口x坐标
	*/
	__getset(0,__proto,'viewPortX',function(){
		return-this._viewPortX;
	});

	/**
	*设置地图缩放
	*@param scale
	*/
	/**
	*得到当前地图的缩放
	*/
	__getset(0,__proto,'scale',function(){
		return this._scale;
		},function(scale){
		if (scale <=0)
			return;
		this._scale=scale;
		this._viewPortWidth=this._rect.width / scale;
		this._viewPortHeight=this._rect.height / scale;
		this._mapSprite.scale(this._scale,this._scale);
		this.updateViewPort();
	});

	/**
	*格子的宽度
	*/
	__getset(0,__proto,'tileWidth',function(){
		return this._mapTileW;
	});

	/**
	*@private
	*视口的y坐标
	*/
	__getset(0,__proto,'viewPortY',function(){
		return-this._viewPortY;
	});

	/**
	*格子的高度
	*/
	__getset(0,__proto,'tileHeight',function(){
		return this._mapTileH;
	});

	/**
	*地图的宽度
	*/
	__getset(0,__proto,'width',function(){
		return this._width;
	});

	/**
	*地图竖向的格子数
	*/
	__getset(0,__proto,'numRowsTile',function(){
		return this._mapH;
	});

	/**
	*地图横向的格子数
	*/
	__getset(0,__proto,'numColumnsTile',function(){
		return this._mapW;
	});

	/**
	*地图的高度
	*/
	__getset(0,__proto,'height',function(){
		return this._height;
	});

	/**
	*@private
	*视口的宽度
	*/
	__getset(0,__proto,'viewPortWidth',function(){
		return this._viewPortWidth;
	});

	/**
	*@private
	*视口的高度
	*/
	__getset(0,__proto,'viewPortHeight',function(){
		return this._viewPortHeight;
	});

	/**
	*地图的x坐标
	*/
	__getset(0,__proto,'x',function(){
		return this._x;
	});

	/**
	*地图的y坐标
	*/
	__getset(0,__proto,'y',function(){
		return this._y;
	});

	/**
	*块的宽度
	*/
	__getset(0,__proto,'gridWidth',function(){
		return this._gridWidth;
	});

	/**
	*块的高度
	*/
	__getset(0,__proto,'gridHeight',function(){
		return this._gridHeight;
	});

	/**
	*地图的横向块数
	*/
	__getset(0,__proto,'numColumnsGrid',function(){
		return this._gridW;
	});

	/**
	*地图的坚向块数
	*/
	__getset(0,__proto,'numRowsGrid',function(){
		return this._gridH;
	});

	/**
	*tile渲染顺序
	*/
	__getset(0,__proto,'renderOrder',function(){
		return this._renderOrder;
	});

	TiledMap.ORIENTATION_ORTHOGONAL="orthogonal";
	TiledMap.ORIENTATION_ISOMETRIC="isometric";
	TiledMap.ORIENTATION_STAGGERED="staggered";
	TiledMap.ORIENTATION_HEXAGONAL="hexagonal";
	TiledMap.RENDERORDER_RIGHTDOWN="right-down";
	TiledMap.RENDERORDER_RIGHTUP="right-up";
	TiledMap.RENDERORDER_LEFTDOWN="left-down";
	TiledMap.RENDERORDER_LEFTUP="left-up";
	TiledMap._tempCanvas=null;
	TiledMap.__init$=function(){
		
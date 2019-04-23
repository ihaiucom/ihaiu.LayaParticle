//class laya.map.TileTexSet
var TileTexSet=(function(){
	function TileTexSet(){
		/**唯一标识*/
		this.gid=-1;
		/**子纹理的引用*/
		this.texture=null;
		/**纹理显示时的坐标偏移X*/
		this.offX=0;
		/**纹理显示时的坐标偏移Y*/
		this.offY=0;
		/**当前要播放动画的纹理序列*/
		this.textureArray=null;
		/**当前动画每帧的时间间隔*/
		this.durationTimeArray=null;
		/**动画播放的总时间 */
		this.animationTotalTime=0;
		/**true表示当前纹理，是一组动画，false表示当前只有一个纹理*/
		this.isAnimation=false;
		this._spriteNum=0;
		//当前动画有多少个显示对象
		this._aniDic=null;
		//通过显示对象的唯一名字，去保存显示显示对象
		this._frameIndex=0;
		//当前动画播放到第几帧
		this._time=0;
		//距离上次动画刷新，过了多少长时间
		this._interval=0;
		//每帧刷新的时间间隔
		this._preFrameTime=0;
	}

	__class(TileTexSet,'laya.map.TileTexSet');
	var __proto=TileTexSet.prototype;
	/**
	*加入一个动画显示对象到此动画中
	*@param aniName //显示对象的名字
	*@param sprite //显示对象
	*/
	__proto.addAniSprite=function(aniName,sprite){
		if (this.animationTotalTime==0){
			return;
		}
		if (this._aniDic==null){
			this._aniDic={};
		}
		if (this._spriteNum==0){
			Laya.timer.frameLoop(3,this,this.animate);
			this._preFrameTime=Browser.now();
			this._frameIndex=0;
			this._time=0;
			this._interval=0;
		}
		this._spriteNum++;
		this._aniDic[aniName]=sprite;
		if (this.textureArray && this._frameIndex < this.textureArray.length){
			var tTileTextureSet=this.textureArray[this._frameIndex];
			this.drawTexture(sprite,tTileTextureSet);
		}
	}

	/**
	*把动画画到所有注册的SPRITE上
	*/
	__proto.animate=function(){
		if (this.textureArray && this.textureArray.length > 0 && this.durationTimeArray && this.durationTimeArray.length > 0){
			var tNow=Browser.now();
			this._interval=tNow-this._preFrameTime;
			this._preFrameTime=tNow;
			if (this._interval > this.animationTotalTime){
				this._interval=this._interval % this.animationTotalTime;
			}
			this._time+=this._interval;
			var tTime=this.durationTimeArray[this._frameIndex];
			while (this._time > tTime){
				this._time-=tTime;
				this._frameIndex++;
				if (this._frameIndex >=this.durationTimeArray.length || this._frameIndex >=this.textureArray.length){
					this._frameIndex=0;
				};
				var tTileTextureSet=this.textureArray[this._frameIndex];
				var tSprite;
				for (var p in this._aniDic){
					tSprite=this._aniDic[p];
					this.drawTexture(tSprite,tTileTextureSet);
				}
				tTime=this.durationTimeArray[this._frameIndex];
			}
		}
	}

	__proto.drawTexture=function(sprite,tileTextSet){
		sprite.graphics.clear(true);
		sprite.graphics.drawImage(tileTextSet.texture,tileTextSet.offX,tileTextSet.offY);
	}

	/**
	*移除不需要更新的SPRITE
	*@param _name
	*/
	__proto.removeAniSprite=function(_name){
		if (this._aniDic && this._aniDic[_name]){
			delete this._aniDic[_name];
			this._spriteNum--
			if (this._spriteNum==0){
				Laya.timer.clear(this,this.animate);
			}
		}
	}

	/**
	*显示当前动画的使用情况
	*/
	__proto.showDebugInfo=function(){
		var tInfo=null;
		if (this._spriteNum > 0){
			tInfo="TileTextureSet::gid:"+this.gid.toString()+" 动画数:"+this._spriteNum.toString();
		}
		return tInfo;
	}

	/**
	*清理
	*/
	__proto.clearAll=function(){
		this.gid=-1;
		if (this.texture){
			this.texture.destroy();
			this.texture=null;
		}
		this.offX=0;
		this.offY=0;
		this.textureArray=null;
		this.durationTimeArray=null;
		this.isAnimation=false;
		this._spriteNum=0;
		this._aniDic=null;
		this._frameIndex=0;
		this._preFrameTime=0;
		this._time=0;
		this._interval=0;
	}

	return TileTexSet;
})()


/**
*tiledMap是整个地图的核心
*地图以层级来划分地图（例如：地表层，植被层，建筑层）
*每层又以分块（GridSprite)来处理显示对象，只显示在视口区域的区
*每块又包括N*N个格子（tile)
*格子类型又分为动画格子跟图片格子两种
*@author ...
*/

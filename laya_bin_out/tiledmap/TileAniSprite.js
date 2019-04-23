//class laya.map.TileAniSprite extends laya.display.Sprite
var TileAniSprite=(function(_super){
	function TileAniSprite(){
		this._tileTextureSet=null;
		//动画的引用
		this._aniName=null;
		TileAniSprite.__super.call(this);
	}

	__class(TileAniSprite,'laya.map.TileAniSprite',_super);
	var __proto=TileAniSprite.prototype;
	/**
	*确定当前显示对象的名称以及属于哪个动画
	*@param aniName 当前动画显示对象的名字，名字唯一
	*@param tileTextureSet 当前显示对象属于哪个动画（一个动画，可以绑定多个同类显示对象）
	*/
	__proto.setTileTextureSet=function(aniName,tileTextureSet){
		this._aniName=aniName;
		this._tileTextureSet=tileTextureSet;
		tileTextureSet.addAniSprite(this._aniName,this);
	}

	/**
	*把当前动画加入到对应的动画刷新列表中
	*/
	__proto.show=function(){
		this._tileTextureSet.addAniSprite(this._aniName,this);
	}

	/**
	*把当前动画从对应的动画刷新列表中移除
	*/
	__proto.hide=function(){
		this._tileTextureSet.removeAniSprite(this._aniName);
	}

	/**
	*清理
	*/
	__proto.clearAll=function(){
		this._tileTextureSet.removeAniSprite(this._aniName);
		this.destroy();
		this._tileTextureSet=null;
		this._aniName=null;
	}

	return TileAniSprite;
})(Sprite)


/**
*地图的每层都会分块渲染处理
*本类就是地图的块数据
*@author ...
*/

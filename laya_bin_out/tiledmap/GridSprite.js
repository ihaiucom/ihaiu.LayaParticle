//class laya.map.GridSprite extends laya.display.Sprite
var GridSprite=(function(_super){
	function GridSprite(){
		/**相对于地图X轴的坐标*/
		this.relativeX=0;
		/**相对于地图Y轴的坐标*/
		this.relativeY=0;
		/**是否用于对象层的独立物件*/
		this.isAloneObject=false;
		/**当前GRID中是否有动画*/
		this.isHaveAnimation=false;
		/**当前GRID包含的动画*/
		this.aniSpriteArray=null;
		/**当前GRID包含多少个TILE(包含动画)*/
		this.drawImageNum=0;
		this._map=null;
		GridSprite.__super.call(this);
	}

	__class(GridSprite,'laya.map.GridSprite',_super);
	var __proto=GridSprite.prototype;
	/**
	*传入必要的参数，用于裁剪，跟确认此对象类型
	*@param map 把地图的引用传进来，参与一些裁剪计算
	*@param objectKey true:表示当前GridSprite是个活动对象，可以控制，false:地图层的组成块
	*/
	__proto.initData=function(map,objectKey){
		(objectKey===void 0)&& (objectKey=false);
		this._map=map;
		this.isAloneObject=objectKey;
	}

	/**
	*把一个动画对象绑定到当前GridSprite
	*@param sprite 动画的显示对象
	*/
	__proto.addAniSprite=function(sprite){
		if (this.aniSpriteArray==null){
			this.aniSpriteArray=[];
		}
		this.aniSpriteArray.push(sprite);
	}

	/**
	*显示当前GridSprite，并把上面的动画全部显示
	*/
	__proto.show=function(){
		if (!this._visible){
			this.visible=true;
			if (this.aniSpriteArray==null){
				return;
			};
			var tAniSprite;
			for (var i=0;i < this.aniSpriteArray.length;i++){
				tAniSprite=this.aniSpriteArray[i];
				tAniSprite.show();
			}
		}
	}

	/**
	*隐藏当前GridSprite，并把上面绑定的动画全部移除
	*/
	__proto.hide=function(){
		if (this._visible){
			this.visible=false;
			if (this.aniSpriteArray==null){
				return;
			};
			var tAniSprite;
			for (var i=0;i < this.aniSpriteArray.length;i++){
				tAniSprite=this.aniSpriteArray[i];
				tAniSprite.hide();
			}
		}
	}

	/**
	*刷新坐标，当我们自己控制一个GridSprite移动时，需要调用此函数，手动刷新
	*/
	__proto.updatePos=function(){
		if (this.isAloneObject){
			if (this._map){
				this.x=this.relativeX-this._map._viewPortX;
				this.y=this.relativeY-this._map._viewPortY;
			}
			if (this._x < 0 || this._x > this._map.viewPortWidth || this._y < 0 || this._y > this._map.viewPortHeight){
				this.hide();
				}else {
				this.show();
			}
			}else {
			if (this._map){
				this.x=this.relativeX-this._map._viewPortX;
				this.y=this.relativeY-this._map._viewPortY;
			}
		}
	}

	/**
	*重置当前对象的所有属性
	*/
	__proto.clearAll=function(){
		if (this._map){
			this._map=null;
		}
		this.visible=false;
		var tAniSprite;
		if (this.aniSpriteArray !=null){
			for (var i=0;i < this.aniSpriteArray.length;i++){
				tAniSprite=this.aniSpriteArray[i];
				tAniSprite.clearAll();
			}
		}
		this.destroy();
		this.relativeX=0;
		this.relativeY=0;
		this.isHaveAnimation=false;
		this.aniSpriteArray=null;
		this.drawImageNum=0;
	}

	return GridSprite;
})(Sprite)


	Laya.__init([TiledMap]);
})(window,document,Laya);

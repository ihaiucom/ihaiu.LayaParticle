//class fairygui.PackageItem
var PackageItem=(function(){
	function PackageItem(){
		this.owner=null;
		this.type=0;
		this.objectType=0;
		this.id=null;
		this.name=null;
		this.width=0;
		this.height=0;
		this.file=null;
		this.decoded=false;
		this.rawData=null;
		//image
		this.scale9Grid=null;
		this.scaleByTile=false;
		this.tileGridIndice=0;
		this.smoothing=false;
		this.texture=null;
		this.pixelHitTestData=null;
		//movieclip
		this.interval=0;
		this.repeatDelay=0;
		this.swing=false;
		this.frames=null;
		//componenet
		this.extensionType=null;
		//font
		this.bitmapFont=null;
	}

	__class(PackageItem,'fairygui.PackageItem');
	var __proto=PackageItem.prototype;
	__proto.load=function(){
		return this.owner.getItemAsset(this);
	}

	__proto.toString=function(){
		return this.name;
	}

	return PackageItem;
})()



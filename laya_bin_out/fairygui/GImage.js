//class fairygui.GImage extends fairygui.GObject
var GImage=(function(_super){
	function GImage(){
		this.image=null;
		this._flip=0;
		GImage.__super.call(this);
	}

	__class(GImage,'fairygui.GImage',_super);
	var __proto=GImage.prototype;
	Laya.imps(__proto,{"fairygui.gears.IColorGear":true})
	__proto.createDisplayObject=function(){
		this._displayObject=this.image=new Image$1();
		this.image.mouseEnabled=false;
		this._displayObject["$owner"]=this;
	}

	__proto.constructFromResource=function(){
		this.packageItem.load();
		this.sourceWidth=this.packageItem.width;
		this.sourceHeight=this.packageItem.height;
		this.initWidth=this.sourceWidth;
		this.initHeight=this.sourceHeight;
		this.image.scale9Grid=this.packageItem.scale9Grid;
		this.image.scaleByTile=this.packageItem.scaleByTile;
		this.image.tileGridIndice=this.packageItem.tileGridIndice;
		this.image.texture=this.packageItem.texture;
		this.setSize(this.sourceWidth,this.sourceHeight);
	}

	__proto.handleXYChanged=function(){
		_super.prototype.handleXYChanged.call(this);
		if(this._flip !=0){
			if(this.scaleX==-1)
				this.image.x+=this.width;
			if(this.scaleY==-1)
				this.image.y+=this.height;
		}
	}

	__proto.setup_beforeAdd=function(buffer,beginPos){
		_super.prototype.setup_beforeAdd.call(this,buffer,beginPos);
		buffer.seek(beginPos,5);
		if (buffer.readBool())
			this.color=buffer.readColorS();
		this.flip=buffer.readByte();
		this.image.fillMethod=buffer.readByte();
		if (this.image.fillMethod !=0){
			this.image.fillOrigin=buffer.readByte();
			this.image.fillClockwise=buffer.readBool();
			this.image.fillAmount=buffer.getFloat32();
		}
	}

	__getset(0,__proto,'color',function(){
		return this.image.color;
		},function(value){
		if(this.image.color !=value){
			this.image.color=value;
			this.updateGear(4);
		}
	});

	__getset(0,__proto,'fillClockwise',function(){
		return this.image.fillClockwise;
		},function(value){
		this.image.fillClockwise=value;
	});

	/**
	*@see FlipType
	*/
	/**
	*@see FlipType
	*/
	__getset(0,__proto,'flip',function(){
		return this._flip;
		},function(value){
		if(this._flip!=value){
			this._flip=value;
			var sx=1,sy=1;
			if(this._flip==1 || this._flip==3)
				sx=-1;
			if(this._flip==2 || this._flip==3)
				sy=-1;
			this.setScale(sx,sy);
			this.handleXYChanged();
		}
	});

	__getset(0,__proto,'fillMethod',function(){
		return this.image.fillMethod;
		},function(value){
		this.image.fillMethod=value;
	});

	__getset(0,__proto,'fillOrigin',function(){
		return this.image.fillOrigin;
		},function(value){
		this.image.fillOrigin=value;
	});

	__getset(0,__proto,'fillAmount',function(){
		return this.image.fillAmount;
		},function(value){
		this.image.fillAmount=value;
	});

	return GImage;
})(GObject)



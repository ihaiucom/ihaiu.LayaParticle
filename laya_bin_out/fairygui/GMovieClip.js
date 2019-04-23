//class fairygui.GMovieClip extends fairygui.GObject
var GMovieClip=(function(_super){
	function GMovieClip(){
		this._movieClip=null;
		GMovieClip.__super.call(this);
		this._sizeImplType=1;
	}

	__class(GMovieClip,'fairygui.GMovieClip',_super);
	var __proto=GMovieClip.prototype;
	Laya.imps(__proto,{"fairygui.gears.IAnimationGear":true,"fairygui.gears.IColorGear":true})
	__proto.createDisplayObject=function(){
		this._displayObject=this._movieClip=new MovieClip$1();
		this._movieClip.mouseEnabled=false;
		this._displayObject["$owner"]=this;
	}

	__proto.rewind=function(){
		this._movieClip.rewind();
	}

	__proto.syncStatus=function(anotherMc){
		this._movieClip.syncStatus(anotherMc._movieClip);
	}

	__proto.advance=function(timeInMiniseconds){
		this._movieClip.advance(timeInMiniseconds);
	}

	//从start帧开始，播放到end帧（-1表示结尾），重复times次（0表示无限循环），循环结束后，停止在endAt帧（-1表示参数end）
	__proto.setPlaySettings=function(start,end,times,endAt,endHandler){
		(start===void 0)&& (start=0);
		(end===void 0)&& (end=-1);
		(times===void 0)&& (times=0);
		(endAt===void 0)&& (endAt=-1);
		this._movieClip.setPlaySettings(start,end,times,endAt,endHandler);
	}

	__proto.constructFromResource=function(){
		this.sourceWidth=this.packageItem.width;
		this.sourceHeight=this.packageItem.height;
		this.initWidth=this.sourceWidth;
		this.initHeight=this.sourceHeight;
		this.setSize(this.sourceWidth,this.sourceHeight);
		this.packageItem.load();
		this._movieClip.interval=this.packageItem.interval;
		this._movieClip.swing=this.packageItem.swing;
		this._movieClip.repeatDelay=this.packageItem.repeatDelay;
		this._movieClip.frames=this.packageItem.frames;
		this._movieClip.boundsRect=new Rectangle(0,0,this.sourceWidth,this.sourceHeight);
	}

	__proto.setup_beforeAdd=function(buffer,beginPos){
		_super.prototype.setup_beforeAdd.call(this,buffer,beginPos);
		buffer.seek(beginPos,5);
		if (buffer.readBool())
			this.color=buffer.readColorS();
		buffer.readByte();
		this._movieClip.frame=buffer.getInt32();
		this._movieClip.playing=buffer.readBool();
	}

	__getset(0,__proto,'color',function(){
		return "#FFFFFF";
		},function(value){
	});

	__getset(0,__proto,'playing',function(){
		return this._movieClip.playing;
		},function(value){
		if (this._movieClip.playing !=value){
			this._movieClip.playing=value;
			this.updateGear(5);
		}
	});

	__getset(0,__proto,'timeScale',function(){
		return this._movieClip.timeScale;
		},function(value){
		this._movieClip.timeScale=value;
	});

	__getset(0,__proto,'frame',function(){
		return this._movieClip.frame;
		},function(value){
		if (this._movieClip.frame !=value){
			this._movieClip.frame=value;
			this.updateGear(5);
		}
	});

	return GMovieClip;
})(GObject)



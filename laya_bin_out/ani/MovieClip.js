//class laya.ani.swf.MovieClip extends laya.display.Sprite
var MovieClip=(function(_super){
	function MovieClip(parentMovieClip){
		/**@private 数据起始位置。*/
		this._start=0;
		/**@private 当前位置。*/
		this._Pos=0;
		/**@private 数据。*/
		this._data=null;
		/**@private */
		this._curIndex=0;
		/**@private */
		this._preIndex=0;
		/**@private */
		this._playIndex=0;
		/**@private */
		this._playing=false;
		/**@private */
		this._ended=true;
		/**@private 总帧数。*/
		this._count=0;
		/**@private id_data起始位置表*/
		this._ids=null;
		/**@private */
		this._loadedImage={};
		/**@private id_实例表*/
		this._idOfSprite=null;
		/**@private 父mc*/
		this._parentMovieClip=null;
		/**@private 需要更新的movieClip表*/
		this._movieClipList=null;
		/**@private */
		this._labels=null;
		/**资源根目录。*/
		this.basePath=null;
		/**@private */
		this._atlasPath=null;
		/**@private */
		this._url=null;
		/**@private */
		this._isRoot=false;
		/**@private */
		this._completeHandler=null;
		/**@private */
		this._endFrame=-1;
		/**播放间隔(单位：毫秒)。*/
		this.interval=30;
		/**是否循环播放 */
		this.loop=false;
		MovieClip.__super.call(this);
		this._ids={};
		this._idOfSprite=[];
		this._reset();
		this._playing=false;
		this._parentMovieClip=parentMovieClip;
		if (!parentMovieClip){
			this._movieClipList=[this];
			this._isRoot=true;
			this._setBitUp(/*laya.Const.DISPLAY*/0x10);
			}else {
			this._isRoot=false;
			this._movieClipList=parentMovieClip._movieClipList;
			this._movieClipList.push(this);
		}
	}

	__class(MovieClip,'laya.ani.swf.MovieClip',_super);
	var __proto=MovieClip.prototype;
	/**
	*<p>销毁此对象。以及销毁引用的Texture</p>
	*@param destroyChild 是否同时销毁子节点，若值为true,则销毁子节点，否则不销毁子节点。
	*/
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this._clear();
		_super.prototype.destroy.call(this,destroyChild);
	}

	/**@private */
	__proto._setDisplay=function(value){
		_super.prototype._setDisplay.call(this,value);
		if (this._isRoot){
			this._$3__onDisplay(value);
		}
	}

	/**@private */
	__proto._$3__onDisplay=function(value){
		if (value)this.timer.loop(this.interval,this,this.updates,null,true);
		else this.timer.clear(this,this.updates);
	}

	//TODO:coverage
	__proto.updates=function(){
		if (this._parentMovieClip)return;
		var i=0,len=0;
		len=this._movieClipList.length;
		for (i=0;i < len;i++){
			this._movieClipList[i]&&this._movieClipList[i]._update();
		}
	}

	/**
	*增加一个标签到index帧上，播放到此index后会派发label事件
	*@param label 标签名称
	*@param index 索引位置
	*/
	__proto.addLabel=function(label,index){
		if (!this._labels)this._labels={};
		this._labels[index]=label;
	}

	/**
	*删除某个标签
	*@param label 标签名字，如果label为空，则删除所有Label
	*/
	__proto.removeLabel=function(label){
		if (!label)this._labels=null;
		else if (!this._labels){
			for (var name in this._labels){
				if (this._labels[name]===label){
					delete this._labels[name];
					break ;
				}
			}
		}
	}

	//TODO:coverage
	__proto._update=function(){
		if (!this._data)return;
		if (!this._playing)return;
		this._playIndex++;
		if (this._playIndex >=this._count){
			if (!this.loop){
				this._playIndex--;
				this.stop();
				return;
			}
			this._playIndex=0;
		}
		this._parseFrame(this._playIndex);
		if (this._labels && this._labels[this._playIndex])this.event(/*laya.events.Event.LABEL*/"label",this._labels[this._playIndex]);
		if (this._endFrame!=-1&&this._endFrame==this._playIndex){
			this._endFrame=-1;
			if (this._completeHandler !=null){
				var handler=this._completeHandler;
				this._completeHandler=null;
				handler.run();
			}
			this.stop();
		}
	}

	/**
	*停止播放动画。
	*/
	__proto.stop=function(){
		this._playing=false;
	}

	/**
	*跳到某帧并停止播放动画。
	*@param frame 要跳到的帧
	*/
	__proto.gotoAndStop=function(index){
		this.index=index;
		this.stop();
	}

	/**
	*@private
	*清理。
	*/
	__proto._clear=function(){
		this.stop();
		this._idOfSprite.length=0;
		if (!this._parentMovieClip){
			this.timer.clear(this,this.updates);
			var i=0,len=0;
			len=this._movieClipList.length;
			for (i=0;i < len;i++){
				if (this._movieClipList[i] !=this)
					this._movieClipList[i]._clear();
			}
			this._movieClipList.length=0;
		}
		if (this._atlasPath){
			Loader.clearRes(this._atlasPath);
		};
		var key;
		for (key in this._loadedImage){
			if (this._loadedImage[key]){
				Loader.clearRes(key);
				this._loadedImage[key]=false;
			}
		}
		this.removeChildren();
		this.graphics=null;
		this._parentMovieClip=null;
	}

	/**
	*播放动画。
	*@param index 帧索引。
	*/
	__proto.play=function(index,loop){
		(index===void 0)&& (index=0);
		(loop===void 0)&& (loop=true);
		this.loop=loop;
		this._playing=true;
		if (this._data)
			this._displayFrame(index);
	}

	//TODO:coverage
	__proto._displayFrame=function(frameIndex){
		(frameIndex===void 0)&& (frameIndex=-1);
		if (frameIndex !=-1){
			if (this._curIndex > frameIndex)this._reset();
			this._parseFrame(frameIndex);
		}
	}

	/**@private */
	__proto._reset=function(rm){
		(rm===void 0)&& (rm=true);
		if (rm && this._curIndex !=1)this.removeChildren();
		this._preIndex=this._curIndex=-1;
		this._Pos=this._start;
	}

	//TODO:coverage
	__proto._parseFrame=function(frameIndex){
		var curChild=this;
		var mc,sp,key=0,type=0,tPos=0,ttype=0,ifAdd=false;
		var _idOfSprite=this._idOfSprite,_data=this._data,eStr;
		if (this._ended)this._reset();
		_data.pos=this._Pos;
		this._ended=false;
		this._playIndex=frameIndex;
		if (this._curIndex > frameIndex&&frameIndex<this._preIndex){
			this._reset(true);
			_data.pos=this._Pos;
		}
		while ((this._curIndex <=frameIndex)&& (!this._ended)){
			type=_data.getUint16();
			switch (type){
				case 12:
					key=_data.getUint16();
					tPos=this._ids[_data.getUint16()];
					this._Pos=_data.pos;
					_data.pos=tPos;
					if ((ttype=_data.getUint8())==0){
						var pid=_data.getUint16();
						sp=_idOfSprite[key]
						if (!sp){
							sp=_idOfSprite[key]=new Sprite();
							var spp=new Sprite();
							spp.loadImage(this.basePath+pid+".png");
							this._loadedImage[this.basePath+pid+".png"]=true;
							sp.addChild(spp);
							spp.size(_data.getFloat32(),_data.getFloat32());
							var mat=_data._getMatrix();
							spp.transform=mat;
						}
						sp.alpha=1;
						}else if (ttype==1){
						mc=_idOfSprite[key]
						if (!mc){
							_idOfSprite[key]=mc=new MovieClip(this);
							mc.interval=this.interval;
							mc._ids=this._ids;
							mc.basePath=this.basePath;
							mc._setData(_data,tPos);
							mc._initState();
							mc.play(0);
						}
						mc.alpha=1;
					}
					_data.pos=this._Pos;
					break ;
				case 3:;
					var node=_idOfSprite[ _data.getUint16()];
					if (node){
						this.addChild(node);
						node.zOrder=_data.getUint16();
						ifAdd=true;
					}
					break ;
				case 4:
					node=_idOfSprite[ _data.getUint16()];
					node && node.removeSelf();
					break ;
				case 5:
					_idOfSprite[_data.getUint16()][MovieClip._ValueList[_data.getUint16()]]=(_data.getFloat32());
					break ;
				case 6:
					_idOfSprite[_data.getUint16()].visible=(_data.getUint8()> 0);
					break ;
				case 7:
					sp=_idOfSprite[ _data.getUint16()];
					var mt=sp.transform || Matrix.create();
					mt.setTo(_data.getFloat32(),_data.getFloat32(),_data.getFloat32(),_data.getFloat32(),_data.getFloat32(),_data.getFloat32());
					sp.transform=mt;
					break ;
				case 8:
					_idOfSprite[_data.getUint16()].setPos(_data.getFloat32(),_data.getFloat32());
					break ;
				case 9:
					_idOfSprite[_data.getUint16()].setSize(_data.getFloat32(),_data.getFloat32());
					break ;
				case 10:
					_idOfSprite[ _data.getUint16()].alpha=_data.getFloat32();
					break ;
				case 11:
					_idOfSprite[_data.getUint16()].setScale(_data.getFloat32(),_data.getFloat32());
					break ;
				case 98:
					eStr=_data.getString();
					this.event(eStr);
					if (eStr=="stop")this.stop();
					break ;
				case 99:
					this._curIndex=_data.getUint16();
					ifAdd && this.updateZOrder();
					break ;
				case 100:
					this._count=this._curIndex+1;
					this._ended=true;
					if (this._playing){
						this.event(/*laya.events.Event.FRAME*/"enterframe");
						this.event(/*laya.events.Event.END*/"end");
						this.event(/*laya.events.Event.COMPLETE*/"complete");
					}
					this._reset(false);
					break ;
				}
		}
		if (this._playing&&!this._ended)this.event(/*laya.events.Event.FRAME*/"enterframe");
		this._Pos=_data.pos;
	}

	//TODO:coverage
	__proto._setData=function(data,start){
		this._data=data;
		this._start=start+3;
	}

	/**
	*加载资源。
	*@param url swf 资源地址。
	*@param atlas 是否使用图集资源
	*@param atlasPath 图集路径，默认使用与swf同名的图集
	*/
	__proto.load=function(url,atlas,atlasPath){
		(atlas===void 0)&& (atlas=false);
		this._url=url;
		if(atlas)this._atlasPath=atlasPath?atlasPath:url.split(".swf")[0]+".json";
		this.stop();
		this._clear();
		this._movieClipList=[this];
		var urls;
		urls=[ {url:url,type:/*laya.net.Loader.BUFFER*/"arraybuffer" }];
		if (this._atlasPath){
			urls.push({url:this._atlasPath,type:/*laya.net.Loader.ATLAS*/"atlas" });
		}
		Laya.loader.load(urls,Handler.create(this,this._onLoaded));
	}

	/**@private */
	__proto._onLoaded=function(){
		var data;
		data=Loader.getRes(this._url);
		if (!data){
			this.event(/*laya.events.Event.ERROR*/"error","file not find");
			return;
		}
		if (this._atlasPath && !Loader.getAtlas(this._atlasPath)){
			this.event(/*laya.events.Event.ERROR*/"error","Atlas not find");
			return;
		}
		this.basePath=this._atlasPath?Loader.getAtlas(this._atlasPath).dir:this._url.split(".swf")[0]+"/image/";
		this._initData(data);
	}

	//TODO:coverage
	__proto._initState=function(){
		this._reset();
		this._ended=false;
		var preState=this._playing;
		this._playing=false;
		this._curIndex=0;
		while (!this._ended)this._parseFrame(++this._curIndex);
		this._playing=preState;
	}

	//TODO:coverage
	__proto._initData=function(data){
		this._data=new Byte(data);
		var i=0,len=this._data.getUint16();
		for (i=0;i < len;i++)this._ids[this._data.getInt16()]=this._data.getInt32();
		this.interval=1000 / this._data.getUint16();
		this._setData(this._data,this._ids[32767]);
		this._initState();
		this.play(0);
		this.event(/*laya.events.Event.LOADED*/"loaded");
		if (!this._parentMovieClip)this.timer.loop(this.interval,this,this.updates,null,true);
	}

	/**
	*从开始索引播放到结束索引，结束之后出发complete回调
	*@param start 开始索引
	*@param end 结束索引
	*@param complete 结束回调
	*/
	__proto.playTo=function(start,end,complete){
		this._completeHandler=complete;
		this._endFrame=end;
		this.play(start,false);
	}

	/**当前播放索引。*/
	__getset(0,__proto,'index',function(){
		return this._playIndex;
		},function(value){
		this._playIndex=value;
		if (this._data)
			this._displayFrame(this._playIndex);
		if (this._labels && this._labels[value])this.event(/*laya.events.Event.LABEL*/"label",this._labels[value]);
	});

	/**
	*帧总数。
	*/
	__getset(0,__proto,'count',function(){
		return this._count;
	});

	/**
	*是否在播放中
	*/
	__getset(0,__proto,'playing',function(){
		return this._playing;
	});

	/**
	*资源地址。
	*/
	__getset(0,__proto,'url',null,function(path){
		this.load(path);
	});

	MovieClip._ValueList=["x","y","width","height","scaleX","scaleY","rotation","alpha"];
	return MovieClip;
})(Sprite)


/**
*动画模板类
*/

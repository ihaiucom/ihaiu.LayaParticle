/**
*<code>/**
*<code>/**
*<code>Loader</code> 类可用来加载文本、JSON、XML、二进制、图像等资源。
*/
//class laya.net.Loader extends laya.events.EventDispatcher
var Loader=(function(_super){
	function Loader(){
		/**@private 加载后的数据对象，只读*/
		this._data=null;
		/**@private */
		this._url=null;
		/**@private */
		this._type=null;
		/**@private */
		this._cache=false;
		/**@private */
		this._http=null;
		/**@private */
		this._useWorkerLoader=false;
		/**@private 自定义解析不派发complete事件，但会派发loaded事件，手动调用endLoad方法再派发complete事件*/
		this._customParse=false;
		/**@private */
		this._constructParams=null;
		/**@private */
		this._propertyParams=null;
		/**@private */
		this._createCache=false;
		Loader.__super.call(this);
	}

	__class(Loader,'laya.net.Loader',_super);
	var __proto=Loader.prototype;
	/**
	*加载资源。加载错误会派发 Event.ERROR 事件，参数为错误信息。
	*@param url 资源地址。
	*@param type (default=null)资源类型。可选值为：Loader.TEXT、Loader.JSON、Loader.XML、Loader.BUFFER、Loader.IMAGE、Loader.SOUND、Loader.ATLAS、Loader.FONT。如果为null，则根据文件后缀分析类型。
	*@param cache (default=true)是否缓存数据。
	*@param group (default=null)分组名称。
	*@param ignoreCache (default=false)是否忽略缓存，强制重新加载。
	*@param useWorkerLoader(default=false)是否使用worker加载（只针对IMAGE类型和ATLAS类型，并且浏览器支持的情况下生效）
	*/
	__proto.load=function(url,type,cache,group,ignoreCache,useWorkerLoader){
		(cache===void 0)&& (cache=true);
		(ignoreCache===void 0)&& (ignoreCache=false);
		(useWorkerLoader===void 0)&& (useWorkerLoader=false);
		if (!url){
			this.onLoaded(null);
			return;
		}
		Loader.setGroup(url,"666");
		this._url=url;
		if (url.indexOf("data:image")===0)type="image";
		else url=URL.formatURL(url);
		this._type=type || (type=Loader.getTypeFromUrl(this._url));
		this._cache=cache;
		this._useWorkerLoader=useWorkerLoader;
		this._data=null;
		if (useWorkerLoader)WorkerLoader.enableWorkerLoader();
		if (!ignoreCache && Loader.loadedMap[url]){
			this._data=Loader.loadedMap[url];
			this.event(/*laya.events.Event.PROGRESS*/"progress",1);
			this.event(/*laya.events.Event.COMPLETE*/"complete",this._data);
			return;
		}
		if (group)Loader.setGroup(url,group);
		if (Loader.parserMap[type] !=null){
			this._customParse=true;
			if (((Loader.parserMap[type])instanceof laya.utils.Handler ))Loader.parserMap[type].runWith(this);
			else Loader.parserMap[type].call(null,this);
			return;
		}
		if (type==="image" || type==="htmlimage" || type==="nativeimage")return this._loadImage(url);
		if (type==="sound")return this._loadSound(url);
		if (type==="ttf")return this._loadTTF(url);
		var contentType;
		switch (type){
			case "atlas":
			case "prefab":
			case "plf":
				contentType="json";
				break ;
			case "font":
				contentType="xml";
				break ;
			default :
				contentType=type;
			}
		if (Loader.preLoadedMap[url]){
			this.onLoaded(Loader.preLoadedMap[url]);
			}else {
			if (!this._http){
				this._http=new HttpRequest();
				this._http.on(/*laya.events.Event.PROGRESS*/"progress",this,this.onProgress);
				this._http.on(/*laya.events.Event.ERROR*/"error",this,this.onError);
				this._http.on(/*laya.events.Event.COMPLETE*/"complete",this,this.onLoaded);
			}
			this._http.send(url,null,"get",contentType);
		}
	}

	/**
	*@private
	*加载TTF资源。
	*@param url 资源地址。
	*/
	__proto._loadTTF=function(url){
		url=URL.formatURL(url);
		var ttfLoader=new TTFLoader();
		ttfLoader.complete=Handler.create(this,this.onLoaded);
		ttfLoader.load(url);
	}

	/**
	*@private
	*加载图片资源。
	*@param url 资源地址。
	*/
	__proto._loadImage=function(url){
		url=URL.formatURL(url);
		var _this=this;
		var image;
		function clear (){
			var img=image;
			if (img){
				img.onload=null;
				img.onerror=null;
				delete Loader._imgCache[url];
			}
		};
		var onerror=function (){
			clear();
			_this.event(/*laya.events.Event.ERROR*/"error","Load image failed");
		}
		if (this._type==="nativeimage"){
			var onload=function (){
				clear();
				_this.onLoaded(image);
			};
			image=new Browser.window.Image();
			image.crossOrigin="";
			image.onload=onload;
			image.onerror=onerror;
			image.src=url;
			Loader._imgCache[url]=image;
			}else {
			var imageSource=new Browser.window.Image();
			onload=function (){
				image=HTMLImage.create(imageSource.width,imageSource.height);
				image.loadImageSource(imageSource,true);
				image._setCreateURL(url);
				clear();
				_this.onLoaded(image);
			};
			imageSource.crossOrigin="";
			imageSource.onload=onload;
			imageSource.onerror=onerror;
			imageSource.src=url;
			image=imageSource;
			Loader._imgCache[url]=imageSource;
		}
	}

	/**
	*@private
	*加载声音资源。
	*@param url 资源地址。
	*/
	__proto._loadSound=function(url){
		var sound=(new SoundManager._soundClass());
		var _this=this;
		sound.on(/*laya.events.Event.COMPLETE*/"complete",this,soundOnload);
		sound.on(/*laya.events.Event.ERROR*/"error",this,soundOnErr);
		sound.load(url);
		function soundOnload (){
			clear();
			_this.onLoaded(sound);
		}
		function soundOnErr (){
			clear();
			sound.dispose();
			_this.event(/*laya.events.Event.ERROR*/"error","Load sound failed");
		}
		function clear (){
			sound.offAll();
		}
	}

	/**@private */
	__proto.onProgress=function(value){
		if (this._type==="atlas")this.event(/*laya.events.Event.PROGRESS*/"progress",value *0.3);
		else this.event(/*laya.events.Event.PROGRESS*/"progress",value);
	}

	/**@private */
	__proto.onError=function(message){
		this.event(/*laya.events.Event.ERROR*/"error",message);
	}

	/**
	*资源加载完成的处理函数。
	*@param data 数据。
	*/
	__proto.onLoaded=function(data){
		var type=this._type;
		if (type=="plf"){
			this.parsePLFData(data);
			this.complete(data);
			}else if (type==="image"){
			var tex=new Texture(data);
			tex.url=this._url;
			this.complete(tex);
			}else if (type==="sound" || type==="htmlimage" || type==="nativeimage"){
			this.complete(data);
			}else if (type==="atlas"){
			if (!data.url && !data._setContext){
				if (!this._data){
					this._data=data;
					if (data.meta && data.meta.image){
						var toloadPics=data.meta.image.split(",");
						var split=this._url.indexOf("/")>=0 ? "/" :"\\";
						var idx=this._url.lastIndexOf(split);
						var folderPath=idx >=0 ? this._url.substr(0,idx+1):"";
						for (var i=0,len=toloadPics.length;i < len;i++){
							toloadPics[i]=folderPath+toloadPics[i];
						}
						}else {
						toloadPics=[this._url.replace(".json",".png")];
					}
					toloadPics.reverse();
					data.toLoads=toloadPics;
					data.pics=[];
				}
				this.event(/*laya.events.Event.PROGRESS*/"progress",0.3+1 / toloadPics.length *0.6);
				return this._loadImage(toloadPics.pop());
				}else {
				this._data.pics.push(data);
				if (this._data.toLoads.length > 0){
					this.event(/*laya.events.Event.PROGRESS*/"progress",0.3+1 / this._data.toLoads.length *0.6);
					return this._loadImage(this._data.toLoads.pop());
				};
				var frames=this._data.frames;
				var cleanUrl=this._url.split("?")[0];
				var directory=(this._data.meta && this._data.meta.prefix)? this._data.meta.prefix :cleanUrl.substring(0,cleanUrl.lastIndexOf("."))+"/";
				var pics=this._data.pics;
				var atlasURL=URL.formatURL(this._url);
				var map=Loader.atlasMap[atlasURL] || (Loader.atlasMap[atlasURL]=[]);
				map.dir=directory;
				var scaleRate=1;
				if (this._data.meta && this._data.meta.scale && this._data.meta.scale !=1){
					scaleRate=parseFloat(this._data.meta.scale);
					for (var name in frames){
						var obj=frames[name];
						var tPic=pics[obj.frame.idx ? obj.frame.idx :0];
						var url=URL.formatURL(directory+name);
						tPic.scaleRate=scaleRate;
						var tTexture;
						tTexture=Texture._create(tPic,obj.frame.x,obj.frame.y,obj.frame.w,obj.frame.h,obj.spriteSourceSize.x,obj.spriteSourceSize.y,obj.sourceSize.w,obj.sourceSize.h,laya.net.Loader.getRes(url));
						Loader.cacheRes(url,tTexture);
						tTexture.url=url;
						map.push(url);
					}
					}else {
					for (name in frames){
						obj=frames[name];
						tPic=pics[obj.frame.idx ? obj.frame.idx :0];
						url=URL.formatURL(directory+name);
						tTexture=Texture._create(tPic,obj.frame.x,obj.frame.y,obj.frame.w,obj.frame.h,obj.spriteSourceSize.x,obj.spriteSourceSize.y,obj.sourceSize.w,obj.sourceSize.h,laya.net.Loader.getRes(url));
						Loader.cacheRes(url,tTexture);
						tTexture.url=url;
						map.push(url);
					}
				}
				delete this._data.pics;
				this.complete(this._data);
			}
			}else if (type==="font"){
			if (!data._source){
				this._data=data;
				this.event(/*laya.events.Event.PROGRESS*/"progress",0.5);
				return this._loadImage(this._url.replace(".fnt",".png"));
				}else {
				var bFont=new BitmapFont();
				bFont.parseFont(this._data,new Texture(data));
				var tArr=this._url.split(".fnt")[0].split("/");
				var fontName=tArr[tArr.length-1];
				Text.registerBitmapFont(fontName,bFont);
				this._data=bFont;
				this.complete(this._data);
			}
			}else if (type==="prefab"){
			var prefab=new Prefab();
			prefab.json=data;
			this.complete(prefab);
			}else {
			this.complete(data);
		}
	}

	__proto.parsePLFData=function(plfData){
		var type;
		var filePath;
		var fileDic;
		for (type in plfData){
			fileDic=plfData[type];
			switch (type){
				case "json":
				case "text":
					for (filePath in fileDic){
						Loader.preLoadedMap[URL.formatURL(filePath)]=fileDic[filePath]
					}
					break ;
				default :
					for (filePath in fileDic){
						Loader.preLoadedMap[URL.formatURL(filePath)]=fileDic[filePath]
					}
				}
		}
	}

	/**
	*加载完成。
	*@param data 加载的数据。
	*/
	__proto.complete=function(data){
		this._data=data;
		if (this._customParse){
			this.event(/*laya.events.Event.LOADED*/"loaded",(data instanceof Array)? [data] :data);
			}else {
			Loader._loaders.push(this);
			if (!Loader._isWorking)Loader.checkNext();
		}
	}

	/**
	*结束加载，处理是否缓存及派发完成事件 <code>Event.COMPLETE</code> 。
	*@param content 加载后的数据
	*/
	__proto.endLoad=function(content){
		content && (this._data=content);
		if (this._cache)Loader.cacheRes(this._url,this._data);
		this.event(/*laya.events.Event.PROGRESS*/"progress",1);
		this.event(/*laya.events.Event.COMPLETE*/"complete",(this.data instanceof Array)? [this.data] :this.data);
	}

	/**加载地址。*/
	__getset(0,__proto,'url',function(){
		return this._url;
	});

	/**返回的数据。*/
	__getset(0,__proto,'data',function(){
		return this._data;
	});

	/**是否缓存。*/
	__getset(0,__proto,'cache',function(){
		return this._cache;
	});

	/**加载类型。*/
	__getset(0,__proto,'type',function(){
		return this._type;
	});

	Loader.getTypeFromUrl=function(url){
		var type=Utils.getFileExtension(url);
		if (type)return Loader.typeMap[type];
		console.warn("Not recognize the resources suffix",url);
		return "text";
	}

	Loader.checkNext=function(){
		Loader._isWorking=true;
		var startTimer=Browser.now();
		var thisTimer=startTimer;
		while (Loader._startIndex < Loader._loaders.length){
			thisTimer=Browser.now();
			Loader._loaders[Loader._startIndex].endLoad();
			Loader._startIndex++;
			if (Browser.now()-startTimer > Loader.maxTimeOut){
				console.warn("loader callback cost a long time:"+(Browser.now()-startTimer)+" url="+Loader._loaders[Loader._startIndex-1].url);
				Laya.systemTimer.frameOnce(1,null,Loader.checkNext);
				return;
			}
		}
		Loader._loaders.length=0;
		Loader._startIndex=0;
		Loader._isWorking=false;
	}

	Loader.clearRes=function(url){
		url=URL.formatURL(url);
		var arr=Loader.getAtlas(url);
		if (arr){
			for (var i=0,n=arr.length;i < n;i++){
				var resUrl=arr[i];
				var tex=Loader.getRes(resUrl);
				delete Loader.loadedMap[resUrl];
				if (tex)tex.destroy();
			}
			arr.length=0;
			delete Loader.atlasMap[url];
			delete Loader.loadedMap[url];
			}else {
			var res=Loader.loadedMap[url];
			if (res){
				delete Loader.loadedMap[url];
				if ((res instanceof laya.resource.Texture )&& res.bitmap)(res).destroy();
			}
		}
	}

	Loader.clearTextureRes=function(url){
		url=URL.formatURL(url);
		var arr=laya.net.Loader.getAtlas(url);
		var res=(arr && arr.length > 0)? laya.net.Loader.getRes(arr[0]):laya.net.Loader.getRes(url);
		if ((res instanceof laya.resource.Texture ))
			res.disposeBitmap();
	}

	Loader.getRes=function(url){
		return Loader.loadedMap[URL.formatURL(url)];
	}

	Loader.getAtlas=function(url){
		return Loader.atlasMap[URL.formatURL(url)];
	}

	Loader.cacheRes=function(url,data){
		url=URL.formatURL(url);
		if (Loader.loadedMap[url] !=null){
			console.warn("Resources already exist,is repeated loading:",url);
			}else {
			Loader.loadedMap[url]=data;
		}
	}

	Loader.setGroup=function(url,group){
		if (!Loader.groupMap[group])Loader.groupMap[group]=[];
		Loader.groupMap[group].push(url);
	}

	Loader.clearResByGroup=function(group){
		if (!Loader.groupMap[group])return;
		var arr=Loader.groupMap[group],i=0,len=arr.length;
		for (i=0;i < len;i++){
			Loader.clearRes(arr[i]);
		}
		arr.length=0;
	}

	Loader.TEXT="text";
	Loader.JSON="json";
	Loader.PREFAB="prefab";
	Loader.XML="xml";
	Loader.BUFFER="arraybuffer";
	Loader.IMAGE="image";
	Loader.SOUND="sound";
	Loader.ATLAS="atlas";
	Loader.FONT="font";
	Loader.TTF="ttf";
	Loader.PLF="plf";
	Loader.HIERARCHY="HIERARCHY";
	Loader.MESH="MESH";
	Loader.MATERIAL="MATERIAL";
	Loader.TEXTURE2D="TEXTURE2D";
	Loader.TEXTURECUBE="TEXTURECUBE";
	Loader.ANIMATIONCLIP="ANIMATIONCLIP";
	Loader.AVATAR="AVATAR";
	Loader.TERRAINHEIGHTDATA="TERRAINHEIGHTDATA";
	Loader.TERRAINRES="TERRAIN";
	Loader.typeMap={"ttf":"ttf","png":"image","jpg":"image","jpeg":"image","txt":"text","json":"json","prefab":"prefab","xml":"xml","als":"atlas","atlas":"atlas","mp3":"sound","ogg":"sound","wav":"sound","part":"json","fnt":"font","pkm":"pkm","plf":"plf","scene":"json","ani":"json","sk":"arraybuffer"};
	Loader.parserMap={};
	Loader.maxTimeOut=100;
	Loader.groupMap={};
	Loader.loadedMap={};
	Loader.atlasMap={};
	Loader.preLoadedMap={};
	Loader._imgCache={};
	Loader._loaders=[];
	Loader._isWorking=false;
	Loader._startIndex=0;
	return Loader;
})(EventDispatcher)


/**
*<p> <code>Socket</code> 封装了 HTML5 WebSocket ，允许服务器端与客户端进行全双工（full-duplex）的实时通信，并且允许跨域通信。在建立连接后，服务器和 Browser/Client Agent 都能主动的向对方发送或接收文本和二进制数据。</p>
*<p>要使用 <code>Socket</code> 类的方法，请先使用构造函数 <code>new Socket</code> 创建一个 <code>Socket</code> 对象。 <code>Socket</code> 以异步方式传输和接收数据。</p>
*/
//class laya.net.Socket extends laya.events.EventDispatcher
var Socket=(function(_super){
	function Socket(host,port,byteClass,protocols){
		/**@private */
		this._endian=null;
		/**@private */
		this._socket=null;
		/**@private */
		this._connected=false;
		/**@private */
		this._addInputPosition=0;
		/**@private */
		this._input=null;
		/**@private */
		this._output=null;
		/**
		*不再缓存服务端发来的数据，如果传输的数据为字符串格式，建议设置为true，减少二进制转换消耗。
		*/
		this.disableInput=false;
		/**
		*用来发送和接收数据的 <code>Byte</code> 类。
		*/
		this._byteClass=null;
		/**
		*<p>子协议名称。子协议名称字符串，或由多个子协议名称字符串构成的数组。必须在调用 connect 或者 connectByUrl 之前进行赋值，否则无效。</p>
		*<p>指定后，只有当服务器选择了其中的某个子协议，连接才能建立成功，否则建立失败，派发 Event.ERROR 事件。</p>
		*@see https://html.spec.whatwg.org/multipage/comms.html#dom-websocket
		*/
		this.protocols=[];
		Socket.__super.call(this);
		(port===void 0)&& (port=0);
		this._byteClass=byteClass ? byteClass :Byte;
		this.protocols=protocols;
		this.endian="bigEndian";
		if (host && port > 0 && port < 65535)this.connect(host,port);
	}

	__class(Socket,'laya.net.Socket',_super);
	var __proto=Socket.prototype;
	/**
	*<p>连接到指定的主机和端口。</p>
	*<p>连接成功派发 Event.OPEN 事件；连接失败派发 Event.ERROR 事件；连接被关闭派发 Event.CLOSE 事件；接收到数据派发 Event.MESSAGE 事件； 除了 Event.MESSAGE 事件参数为数据内容，其他事件参数都是原生的 HTML DOM Event 对象。</p>
	*@param host 服务器地址。
	*@param port 服务器端口。
	*/
	__proto.connect=function(host,port){
		var url="ws://"+host+":"+port;
		this.connectByUrl(url);
	}

	/**
	*<p>连接到指定的服务端 WebSocket URL。 URL 类似 ws://yourdomain:port。</p>
	*<p>连接成功派发 Event.OPEN 事件；连接失败派发 Event.ERROR 事件；连接被关闭派发 Event.CLOSE 事件；接收到数据派发 Event.MESSAGE 事件； 除了 Event.MESSAGE 事件参数为数据内容，其他事件参数都是原生的 HTML DOM Event 对象。</p>
	*@param url 要连接的服务端 WebSocket URL。 URL 类似 ws://yourdomain:port。
	*/
	__proto.connectByUrl=function(url){
		var _$this=this;
		if (this._socket !=null)this.close();
		this._socket && this.cleanSocket();
		if (!this.protocols || this.protocols.length==0){
			this._socket=new Browser.window.WebSocket(url);
			}else {
			this._socket=new Browser.window.WebSocket(url,this.protocols);
		}
		this._socket.binaryType="arraybuffer";
		this._output=new this._byteClass();
		this._output.endian=this.endian;
		this._input=new this._byteClass();
		this._input.endian=this.endian;
		this._addInputPosition=0;
		this._socket.onopen=function (e){
			_$this._onOpen(e);
		};
		this._socket.onmessage=function (msg){
			_$this._onMessage(msg);
		};
		this._socket.onclose=function (e){
			_$this._onClose(e);
		};
		this._socket.onerror=function (e){
			_$this._onError(e);
		};
	}

	/**
	*清理Socket：关闭Socket链接，关闭事件监听，重置Socket
	*/
	__proto.cleanSocket=function(){
		this.close();
		this._connected=false;
		this._socket.onopen=null;
		this._socket.onmessage=null;
		this._socket.onclose=null;
		this._socket.onerror=null;
		this._socket=null;
	}

	/**
	*关闭连接。
	*/
	__proto.close=function(){
		if (this._socket !=null){
			try {
				this._socket.close();
			}catch (e){}
		}
	}

	/**
	*@private
	*连接建立成功 。
	*/
	__proto._onOpen=function(e){
		this._connected=true;
		this.event(/*laya.events.Event.OPEN*/"open",e);
	}

	/**
	*@private
	*接收到数据处理方法。
	*@param msg 数据。
	*/
	__proto._onMessage=function(msg){
		if (!msg || !msg.data)return;
		var data=msg.data;
		if (this.disableInput && data){
			this.event(/*laya.events.Event.MESSAGE*/"message",data);
			return;
		}
		if (this._input.length > 0 && this._input.bytesAvailable < 1){
			this._input.clear();
			this._addInputPosition=0;
		};
		var pre=this._input.pos;
		!this._addInputPosition && (this._addInputPosition=0);
		this._input.pos=this._addInputPosition;
		if (data){
			if ((typeof data=='string')){
				this._input.writeUTFBytes(data);
				}else {
				this._input.writeArrayBuffer(data);
			}
			this._addInputPosition=this._input.pos;
			this._input.pos=pre;
		}
		this.event(/*laya.events.Event.MESSAGE*/"message",data);
	}

	/**
	*@private
	*连接被关闭处理方法。
	*/
	__proto._onClose=function(e){
		this._connected=false;
		this.event(/*laya.events.Event.CLOSE*/"close",e)
	}

	/**
	*@private
	*出现异常处理方法。
	*/
	__proto._onError=function(e){
		this.event(/*laya.events.Event.ERROR*/"error",e)
	}

	/**
	*发送数据到服务器。
	*@param data 需要发送的数据，可以是String或者ArrayBuffer。
	*/
	__proto.send=function(data){
		this._socket.send(data);
	}

	/**
	*发送缓冲区中的数据到服务器。
	*/
	__proto.flush=function(){
		if (this._output && this._output.length > 0){
			var evt;
			try {
				this._socket && this._socket.send(this._output.__getBuffer().slice(0,this._output.length));
				}catch (e){
				evt=e;
			}
			this._output.endian=this.endian;
			this._output.clear();
			if (evt)this.event(/*laya.events.Event.ERROR*/"error",evt);
		}
	}

	/**
	*缓存的服务端发来的数据。
	*/
	__getset(0,__proto,'input',function(){
		return this._input;
	});

	/**
	*表示需要发送至服务端的缓冲区中的数据。
	*/
	__getset(0,__proto,'output',function(){
		return this._output;
	});

	/**
	*表示此 Socket 对象目前是否已连接。
	*/
	__getset(0,__proto,'connected',function(){
		return this._connected;
	});

	/**
	*<p>主机字节序，是 CPU 存放数据的两种不同顺序，包括小端字节序和大端字节序。</p>
	*<p> LITTLE_ENDIAN ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。</p>
	*<p> BIG_ENDIAN ：大端字节序，地址低位存储值的高位，地址高位存储值的低位。</p>
	*/
	__getset(0,__proto,'endian',function(){
		return this._endian;
		},function(value){
		this._endian=value;
		if (this._input !=null)this._input.endian=value;
		if (this._output !=null)this._output.endian=value;
	});

	Socket.LITTLE_ENDIAN="littleEndian";
	Socket.BIG_ENDIAN="bigEndian";
	return Socket;
})(EventDispatcher)


/**
*@private
*web audio api方式播放声音
*/
//class laya.media.webaudio.WebAudioSound extends laya.events.EventDispatcher
var WebAudioSound=(function(_super){
	function WebAudioSound(){
		/**
		*声音URL
		*/
		this.url=null;
		/**
		*是否已加载完成
		*/
		this.loaded=false;
		/**
		*声音文件数据
		*/
		this.data=null;
		/**
		*声音原始文件数据
		*/
		this.audioBuffer=null;
		/**
		*待播放的声音列表
		*/
		this.__toPlays=null;
		/**
		*@private
		*/
		this._disposed=false;
		WebAudioSound.__super.call(this);
	}

	__class(WebAudioSound,'laya.media.webaudio.WebAudioSound',_super);
	var __proto=WebAudioSound.prototype;
	/**
	*加载声音
	*@param url
	*
	*/
	__proto.load=function(url){
		var me=this;
		url=URL.formatURL(url);
		this.url=url;
		this.audioBuffer=WebAudioSound._dataCache[url];
		if (this.audioBuffer){
			this._loaded(this.audioBuffer);
			return;
		}
		WebAudioSound.e.on("loaded:"+url,this,this._loaded);
		WebAudioSound.e.on("err:"+url,this,this._err);
		if (WebAudioSound.__loadingSound[url]){
			return;
		}
		WebAudioSound.__loadingSound[url]=true;
		var request=new Browser.window.XMLHttpRequest();
		request.open("GET",url,true);
		request.responseType="arraybuffer";
		request.onload=function (){
			if (me._disposed){
				me._removeLoadEvents();
				return;
			}
			me.data=request.response;
			WebAudioSound.buffs.push({"buffer":me.data,"url":me.url});
			WebAudioSound.decode();
		};
		request.onerror=function (e){
			me._err();
		}
		request.send();
	}

	__proto._err=function(){
		this._removeLoadEvents();
		WebAudioSound.__loadingSound[this.url]=false;
		this.event(/*laya.events.Event.ERROR*/"error");
	}

	__proto._loaded=function(audioBuffer){
		this._removeLoadEvents();
		if (this._disposed){
			return;
		}
		this.audioBuffer=audioBuffer;
		WebAudioSound._dataCache[this.url]=this.audioBuffer;
		this.loaded=true;
		this.event(/*laya.events.Event.COMPLETE*/"complete");
	}

	__proto._removeLoadEvents=function(){
		WebAudioSound.e.off("loaded:"+this.url,this,this._loaded);
		WebAudioSound.e.off("err:"+this.url,this,this._err);
	}

	__proto.__playAfterLoaded=function(){
		if (!this.__toPlays)return;
		var i=0,len=0;
		var toPlays;
		toPlays=this.__toPlays;
		len=toPlays.length;
		var tParams;
		for (i=0;i < len;i++){
			tParams=toPlays[i];
			if (tParams[2] && !(tParams [2]).isStopped){
				this.play(tParams[0],tParams[1],tParams[2]);
			}
		}
		this.__toPlays.length=0;
	}

	/**
	*播放声音
	*@param startTime 起始时间
	*@param loops 循环次数
	*@return
	*
	*/
	__proto.play=function(startTime,loops,channel){
		(startTime===void 0)&& (startTime=0);
		(loops===void 0)&& (loops=0);
		channel=channel ? channel :new WebAudioSoundChannel();
		if (!this.audioBuffer){
			if (this.url){
				if (!this.__toPlays)this.__toPlays=[];
				this.__toPlays.push([startTime,loops,channel]);
				this.once(/*laya.events.Event.COMPLETE*/"complete",this,this.__playAfterLoaded);
				this.load(this.url);
			}
		}
		channel.url=this.url;
		channel.loops=loops;
		channel["audioBuffer"]=this.audioBuffer;
		channel.startTime=startTime;
		channel.play();
		SoundManager.addChannel(channel);
		return channel;
	}

	__proto.dispose=function(){
		this._disposed=true;
		delete WebAudioSound._dataCache[this.url];
		delete WebAudioSound.__loadingSound[this.url];
		this.audioBuffer=null;
		this.data=null;
		this.__toPlays=[];
	}

	__getset(0,__proto,'duration',function(){
		if (this.audioBuffer){
			return this.audioBuffer.duration;
		}
		return 0;
	});

	WebAudioSound.decode=function(){
		if (WebAudioSound.buffs.length <=0 || WebAudioSound.isDecoding){
			return;
		}
		WebAudioSound.isDecoding=true;
		WebAudioSound.tInfo=WebAudioSound.buffs.shift();
		WebAudioSound.ctx.decodeAudioData(WebAudioSound.tInfo["buffer"],WebAudioSound._done,WebAudioSound._fail);
	}

	WebAudioSound._done=function(audioBuffer){
		WebAudioSound.e.event("loaded:"+WebAudioSound.tInfo.url,audioBuffer);
		WebAudioSound.isDecoding=false;
		WebAudioSound.decode();
	}

	WebAudioSound._fail=function(){
		WebAudioSound.e.event("err:"+WebAudioSound.tInfo.url,null);
		WebAudioSound.isDecoding=false;
		WebAudioSound.decode();
	}

	WebAudioSound._playEmptySound=function(){
		if (WebAudioSound.ctx==null){
			return;
		};
		var source=WebAudioSound.ctx.createBufferSource();
		source.buffer=WebAudioSound._miniBuffer;
		source.connect(WebAudioSound.ctx.destination);
		source.start(0,0,0);
	}

	WebAudioSound._unlock=function(){
		if (WebAudioSound._unlocked){
			return;
		}
		WebAudioSound._playEmptySound();
		if (WebAudioSound.ctx.state=="running"){
			Browser.document.removeEventListener("mousedown",WebAudioSound._unlock,true);
			Browser.document.removeEventListener("touchend",WebAudioSound._unlock,true);
			Browser.document.removeEventListener("touchstart",WebAudioSound._unlock,true);
			WebAudioSound._unlocked=true;
		}
	}

	WebAudioSound.initWebAudio=function(){
		if (WebAudioSound.ctx.state !="running"){
			WebAudioSound._unlock();
			Browser.document.addEventListener("mousedown",WebAudioSound._unlock,true);
			Browser.document.addEventListener("touchend",WebAudioSound._unlock,true);
			Browser.document.addEventListener("touchstart",WebAudioSound._unlock,true);
		}
	}

	WebAudioSound._dataCache={};
	WebAudioSound.buffs=[];
	WebAudioSound.isDecoding=false;
	WebAudioSound._unlocked=false;
	WebAudioSound.tInfo=null;
	WebAudioSound.__loadingSound={};
	__static(WebAudioSound,
	['window',function(){return this.window=Browser.window;},'webAudioEnabled',function(){return this.webAudioEnabled=WebAudioSound.window["AudioContext"] || WebAudioSound.window["webkitAudioContext"] || WebAudioSound.window["mozAudioContext"];},'ctx',function(){return this.ctx=WebAudioSound.webAudioEnabled ? new (WebAudioSound.window["AudioContext"] || WebAudioSound.window["webkitAudioContext"] || WebAudioSound.window["mozAudioContext"])():undefined;},'_miniBuffer',function(){return this._miniBuffer=WebAudioSound.ctx.createBuffer(1,1,22050);},'e',function(){return this.e=new EventDispatcher();}
	]);
	return WebAudioSound;
})(EventDispatcher)


/**
*<p><code>ColorFilter</code> 是颜色滤镜。使用 ColorFilter 类可以将 4 x 5 矩阵转换应用于输入图像上的每个像素的 RGBA 颜色和 Alpha 值，以生成具有一组新的 RGBA 颜色和 Alpha 值的结果。该类允许饱和度更改、色相旋转、亮度转 Alpha 以及各种其他效果。您可以将滤镜应用于任何显示对象（即，从 Sprite 类继承的对象）。</p>
*<p>注意：对于 RGBA 值，最高有效字节代表红色通道值，其后的有效字节分别代表绿色、蓝色和 Alpha 通道值。</p>
*/
//class laya.filters.ColorFilter extends laya.filters.Filter
var ColorFilter=(function(_super){
	function ColorFilter(mat){
		/**@private */
		//this._mat=null;
		/**@private */
		//this._alpha=null;
		/**当前使用的矩阵*/
		//this._matrix=null;
		ColorFilter.__super.call(this);
		if (!mat)mat=this._copyMatrix(ColorFilter.IDENTITY_MATRIX);
		this._mat=new Float32Array(16);
		this._alpha=new Float32Array(4);
		this.setByMatrix(mat);
		this._action=new ColorFilterAction();
		this._action.data=this;
	}

	__class(ColorFilter,'laya.filters.ColorFilter',_super);
	var __proto=ColorFilter.prototype;
	Laya.imps(__proto,{"laya.filters.IFilter":true})
	/**
	*设置为灰色滤镜
	*/
	__proto.gray=function(){
		return this.setByMatrix(ColorFilter.GRAY_MATRIX);
	}

	/**
	*设置为变色滤镜
	*@param red 红色增量,范围:0~255
	*@param green 绿色增量,范围:0~255
	*@param blue 蓝色增量,范围:0~255
	*@param alpha alpha,范围:0~1
	*/
	__proto.color=function(red,green,blue,alpha){
		(red===void 0)&& (red=0);
		(green===void 0)&& (green=0);
		(blue===void 0)&& (blue=0);
		(alpha===void 0)&& (alpha=1);
		return this.setByMatrix([1,0,0,0,red,0,1,0,0,green,0,0,1,0,blue,0,0,0,1,alpha]);
	}

	/**
	*设置滤镜色
	*@param color 颜色值
	*/
	__proto.setColor=function(color){
		var arr=ColorUtils.create(color).arrColor;
		var mt=[0,0,0,0,256 *arr[0],0,0,0,0,256 *arr[1],0,0,0,0,256 *arr[2],0,0,0,1,0];
		return this.setByMatrix(mt);
	}

	/**
	*设置矩阵数据
	*@param matrix 由 20 个项目（排列成 4 x 5 矩阵）组成的数组
	*@return this
	*/
	__proto.setByMatrix=function(matrix){
		if (this._matrix !=matrix)this._copyMatrix(matrix);
		var j=0;
		var z=0;
		for (var i=0;i < 20;i++){
			if (i % 5 !=4){
				this._mat[j++]=matrix[i];
				}else {
				this._alpha[z++]=matrix[i];
			}
		}
		return this;
	}

	/**
	*调整颜色，包括亮度，对比度，饱和度和色调
	*@param brightness 亮度,范围:-100~100
	*@param contrast 对比度,范围:-100~100
	*@param saturation 饱和度,范围:-100~100
	*@param hue 色调,范围:-180~180
	*@return this
	*/
	__proto.adjustColor=function(brightness,contrast,saturation,hue){
		this.adjustHue(hue);
		this.adjustContrast(contrast);
		this.adjustBrightness(brightness);
		this.adjustSaturation(saturation);
		return this;
	}

	/**
	*调整亮度
	*@param brightness 亮度,范围:-100~100
	*@return this
	*/
	__proto.adjustBrightness=function(brightness){
		brightness=this._clampValue(brightness,100);
		if (brightness==0 || isNaN(brightness))return this;
		return this._multiplyMatrix([1,0,0,0,brightness,0,1,0,0,brightness,0,0,1,0,brightness,0,0,0,1,0,0,0,0,0,1]);
	}

	/**
	*调整对比度
	*@param contrast 对比度,范围:-100~100
	*@return this
	*/
	__proto.adjustContrast=function(contrast){
		contrast=this._clampValue(contrast,100);
		if (contrast==0 || isNaN(contrast))return this;
		var x=NaN;
		if (contrast < 0){
			x=127+contrast / 100 *127
			}else {
			x=contrast % 1;
			if (x==0){
				x=ColorFilter.DELTA_INDEX[contrast];
				}else {
				x=ColorFilter.DELTA_INDEX[(contrast << 0)] *(1-x)+ColorFilter.DELTA_INDEX[(contrast << 0)+1] *x;
			}
			x=x *127+127;
		};
		var x1=x / 127;
		var x2=(127-x)*0.5;
		return this._multiplyMatrix([x1,0,0,0,x2,0,x1,0,0,x2,0,0,x1,0,x2,0,0,0,1,0,0,0,0,0,1]);
	}

	/**
	*调整饱和度
	*@param saturation 饱和度,范围:-100~100
	*@return this
	*/
	__proto.adjustSaturation=function(saturation){
		saturation=this._clampValue(saturation,100);
		if (saturation==0 || isNaN(saturation))return this;
		var x=1+((saturation > 0)? 3 *saturation / 100 :saturation / 100);
		var dx=1-x;
		var r=0.3086 *dx;
		var g=0.6094 *dx;
		var b=0.0820 *dx;
		return this._multiplyMatrix([r+x,g,b,0,0,r,g+x,b,0,0,r,g,b+x,0,0,0,0,0,1,0,0,0,0,0,1]);
	}

	/**
	*调整色调
	*@param hue 色调,范围:-180~180
	*@return this
	*/
	__proto.adjustHue=function(hue){
		hue=this._clampValue(hue,180)/ 180 *Math.PI;
		if (hue==0 || isNaN(hue))return this;
		var cos=Math.cos(hue);
		var sin=Math.sin(hue);
		var r=0.213;
		var g=0.715;
		var b=0.072;
		return this._multiplyMatrix([r+cos *(1-r)+sin *(-r),g+cos *(-g)+sin *(-g),b+cos *(-b)+sin *(1-b),0,0,r+cos *(-r)+sin *(0.143),g+cos *(1-g)+sin *(0.140),b+cos *(-b)+sin *(-0.283),0,0,r+cos *(-r)+sin *(-(1-r)),g+cos *(-g)+sin *(g),b+cos *(1-b)+sin *(b),0,0,0,0,0,1,0,0,0,0,0,1]);
	}

	/**
	*重置成单位矩阵，去除滤镜效果
	*/
	__proto.reset=function(){
		return this.setByMatrix(this._copyMatrix(ColorFilter.IDENTITY_MATRIX));
	}

	/**
	*矩阵乘法
	*@param matrix
	*@return this
	*/
	__proto._multiplyMatrix=function(matrix){
		var col=[];
		this._matrix=this._fixMatrix(this._matrix);
		for (var i=0;i < 5;i++){
			for (var j=0;j < 5;j++){
				col[j]=this._matrix[j+i *5];
			}
			for (j=0;j < 5;j++){
				var val=0;
				for (var k=0;k < 5;k++){
					val+=matrix[j+k *5] *col[k];
				}
				this._matrix[j+i *5]=val;
			}
		}
		return this.setByMatrix(this._matrix);
	}

	/**
	*规范值的范围
	*@param val 当前值
	*@param limit 值的范围-limit~limit
	*/
	__proto._clampValue=function(val,limit){
		return Math.min(limit,Math.max(-limit,val));
	}

	/**
	*规范矩阵,将矩阵调整到正确的大小
	*@param matrix 需要调整的矩阵
	*/
	__proto._fixMatrix=function(matrix){
		if (matrix==null)return ColorFilter.IDENTITY_MATRIX;
		if (matrix.length < 25)matrix=matrix.slice(0,matrix.length).concat(ColorFilter.IDENTITY_MATRIX.slice(matrix.length,25));
		else if (matrix.length > 25)matrix=matrix.slice(0,25);
		return matrix;
	}

	/**
	*复制矩阵
	*/
	__proto._copyMatrix=function(matrix){
		var len=25;
		if (!this._matrix)this._matrix=[];
		for (var i=0;i < len;i++){
			this._matrix[i]=matrix[i];
		}
		return this._matrix;
	}

	/**@private */
	__getset(0,__proto,'type',function(){
		return 0x20;
	});

	ColorFilter.LENGTH=25;
	__static(ColorFilter,
	['DELTA_INDEX',function(){return this.DELTA_INDEX=[0,0.01,0.02,0.04,0.05,0.06,0.07,0.08,0.1,0.11,0.12,0.14,0.15,0.16,0.17,0.18,0.20,0.21,0.22,0.24,0.25,0.27,0.28,0.30,0.32,0.34,0.36,0.38,0.40,0.42,0.44,0.46,0.48,0.5,0.53,0.56,0.59,0.62,0.65,0.68,0.71,0.74,0.77,0.80,0.83,0.86,0.89,0.92,0.95,0.98,1.0,1.06,1.12,1.18,1.24,1.30,1.36,1.42,1.48,1.54,1.60,1.66,1.72,1.78,1.84,1.90,1.96,2.0,2.12,2.25,2.37,2.50,2.62,2.75,2.87,3.0,3.2,3.4,3.6,3.8,4.0,4.3,4.7,4.9,5.0,5.5,6.0,6.5,6.8,7.0,7.3,7.5,7.8,8.0,8.4,8.7,9.0,9.4,9.6,9.8,10.0];},'GRAY_MATRIX',function(){return this.GRAY_MATRIX=[0.3086,0.6094,0.082,0,0,0.3086,0.6094,0.082,0,0,0.3086,0.6094,0.082,0,0,0,0,0,1,0];},'IDENTITY_MATRIX',function(){return this.IDENTITY_MATRIX=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1];}
	]);
	return ColorFilter;
})(Filter)


/**

*/
*/
*/
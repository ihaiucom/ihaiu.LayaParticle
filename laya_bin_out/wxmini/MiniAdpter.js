//class laya.wx.mini.MiniAdpter
var MiniAdpter=(function(){
	function MiniAdpter(){}
	__class(MiniAdpter,'laya.wx.mini.MiniAdpter');
	MiniAdpter.getJson=function(data){
		return JSON.parse(data);
	}

	MiniAdpter.enable=function(){
		MiniAdpter.init(Laya.isWXPosMsg,Laya.isWXOpenDataContext);
	}

	MiniAdpter.init=function(isPosMsg,isSon){
		(isPosMsg===void 0)&& (isPosMsg=false);
		(isSon===void 0)&& (isSon=false);
		if (MiniAdpter._inited)return;
		MiniAdpter._inited=true;
		MiniAdpter.window=/*__JS__ */window;
		if (MiniAdpter.window.navigator.userAgent.indexOf('MiniGame')< 0)return;
		MiniAdpter.isZiYu=isSon;
		MiniAdpter.isPosMsgYu=isPosMsg;
		MiniAdpter.EnvConfig={};
		if (!MiniAdpter.isZiYu){
			MiniFileMgr.setNativeFileDir("/layaairGame");
			MiniFileMgr.existDir(MiniFileMgr.fileNativeDir,Handler.create(MiniAdpter,MiniAdpter.onMkdirCallBack));
		}
		MiniAdpter.systemInfo=/*__JS__ */wx.getSystemInfoSync();
		MiniAdpter.window.focus=function (){
		};
		Laya['_getUrlPath']=function (){
		};
		MiniAdpter.window.logtime=function (str){
		};
		MiniAdpter.window.alertTimeLog=function (str){
		};
		MiniAdpter.window.resetShareInfo=function (){
		};
		MiniAdpter.window.CanvasRenderingContext2D=function (){
		};
		MiniAdpter.window.CanvasRenderingContext2D.prototype=MiniAdpter.window.wx.createCanvas().getContext('2d').__proto__;
		MiniAdpter.window.document.body.appendChild=function (){
		};
		MiniAdpter.EnvConfig.pixelRatioInt=0;
		Browser["_pixelRatio"]=MiniAdpter.pixelRatio();
		MiniAdpter._preCreateElement=Browser.createElement;
		Browser["createElement"]=MiniAdpter.createElement;
		RunDriver.createShaderCondition=MiniAdpter.createShaderCondition;
		Utils['parseXMLFromString']=MiniAdpter.parseXMLFromString;
		Input['_createInputElement']=MiniInput['_createInputElement'];
		MiniAdpter.EnvConfig.load=Loader.prototype.load;
		Loader.prototype.load=MiniLoader.prototype.load;
		Loader.prototype._loadImage=MiniImage.prototype._loadImage;
		MiniLocalStorage.__init__();
		LocalStorage._baseClass=MiniLocalStorage;
		MiniAdpter.window.wx.onMessage(MiniAdpter._onMessage);
	}

	MiniAdpter._onMessage=function(data){
		switch (data.type){
			case "changeMatrix":
				Laya.stage.transform.identity();
				Laya.stage._width=data.w;
				Laya.stage._height=data.h;
				Laya.stage._canvasTransform=new Matrix(data.a,data.b,data.c,data.d,data.tx,data.ty);
				break ;
			case "display":
				Laya.stage.frameRate=data.rate || /*laya.display.Stage.FRAME_FAST*/"fast";
				break ;
			case "undisplay":
				Laya.stage.frameRate=/*laya.display.Stage.FRAME_SLEEP*/"sleep";
				break ;
			}
		if (data['isLoad']=="opendatacontext"){
			if (data.url){
				MiniFileMgr.ziyuFileData[data.url]=data.atlasdata;
				MiniFileMgr.ziyuFileTextureData[data.imgReadyUrl]=data.imgNativeUrl;
			}
			}else if (data['isLoad']=="openJsondatacontext"){
			if (data.url){
				MiniFileMgr.ziyuFileData[data.url]=data.atlasdata;
			}
			}else if (data['isLoad']=="openJsondatacontextPic"){
			MiniFileMgr.ziyuFileTextureData[data.imgReadyUrl]=data.imgNativeUrl;
		}
	}

	MiniAdpter.getUrlEncode=function(url,type){
		if (type=="arraybuffer")
			return "";
		return "utf8";
	}

	MiniAdpter.downLoadFile=function(fileUrl,fileType,callBack,encoding){
		(fileType===void 0)&& (fileType="");
		(encoding===void 0)&& (encoding="utf8");
		var fileObj=MiniFileMgr.getFileInfo(fileUrl);
		if (!fileObj)
			MiniFileMgr.downLoadFile(fileUrl,fileType,callBack,encoding);
		else {
			callBack !=null && callBack.runWith([0]);
		}
	}

	MiniAdpter.remove=function(fileUrl,callBack){
		MiniFileMgr.deleteFile("",fileUrl,callBack,"",0);
	}

	MiniAdpter.removeAll=function(){
		MiniFileMgr.deleteAll();
	}

	MiniAdpter.hasNativeFile=function(fileUrl){
		return MiniFileMgr.isLocalNativeFile(fileUrl);
	}

	MiniAdpter.getFileInfo=function(fileUrl){
		return MiniFileMgr.getFileInfo(fileUrl);
	}

	MiniAdpter.getFileList=function(){
		return MiniFileMgr.filesListObj;
	}

	MiniAdpter.exitMiniProgram=function(){
		MiniAdpter.window["wx"].exitMiniProgram();
	}

	MiniAdpter.onMkdirCallBack=function(errorCode,data){
		if (!errorCode)
			MiniFileMgr.filesListObj=JSON.parse(data.data);
	}

	MiniAdpter.pixelRatio=function(){
		if (!MiniAdpter.EnvConfig.pixelRatioInt){
			try {
				MiniAdpter.EnvConfig.pixelRatioInt=MiniAdpter.systemInfo.pixelRatio;
				return MiniAdpter.systemInfo.pixelRatio;
			}catch (error){}
		}
		return MiniAdpter.EnvConfig.pixelRatioInt;
	}

	MiniAdpter.createElement=function(type){
		if (type=="canvas"){
			var _source;
			if (MiniAdpter.idx==1){
				if (MiniAdpter.isZiYu){
					_source=/*__JS__ */sharedCanvas;
					_source.style={};
					}else {
					_source=/*__JS__ */window.canvas;
				}
				}else {
				_source=/*__JS__ */window.wx.createCanvas();
			}
			MiniAdpter.idx++;
			return _source;
			}else if (type=="textarea" || type=="input"){
			return MiniAdpter.onCreateInput(type);
			}else if (type=="div"){
			var node=MiniAdpter._preCreateElement(type);
			node.contains=function (value){
				return null
			};
			node.removeChild=function (value){
			};
			return node;
			}else {
			return MiniAdpter._preCreateElement(type);
		}
	}

	MiniAdpter.onCreateInput=function(type){
		var node=MiniAdpter._preCreateElement(type);
		node.focus=MiniInput.wxinputFocus;
		node.blur=MiniInput.wxinputblur;
		node.style={};
		node.value=0;
		node.parentElement={};
		node.placeholder={};
		node.type={};
		node.setColor=function (value){
		};
		node.setType=function (value){
		};
		node.setFontFace=function (value){
		};
		node.addEventListener=function (value){
		};
		node.contains=function (value){
			return null
		};
		node.removeChild=function (value){
		};
		return node;
	}

	MiniAdpter.createShaderCondition=function(conditionScript){
		var _$this=this;
		var func=function (){
			var abc=conditionScript;
			return _$this[conditionScript.replace("this.","")];
		}
		return func;
	}

	MiniAdpter.sendAtlasToOpenDataContext=function(url){
		if (!laya.wx.mini.MiniAdpter.isZiYu){
			var atlasJson=Loader.getRes(URL.formatURL(url));
			if (atlasJson){
				var textureArr=(atlasJson.meta.image).split(",");
				if (atlasJson.meta && atlasJson.meta.image){
					var toloadPics=atlasJson.meta.image.split(",");
					var split=url.indexOf("/")>=0 ? "/" :"\\";
					var idx=url.lastIndexOf(split);
					var folderPath=idx >=0 ? url.substr(0,idx+1):"";
					for (var i=0,len=toloadPics.length;i < len;i++){
						toloadPics[i]=folderPath+toloadPics[i];
					}
					}else {
					toloadPics=[url.replace(".json",".png")];
				}
				for (i=0;i < toloadPics.length;i++){
					var tempAtlasPngUrl=toloadPics[i];
					MiniAdpter.postInfoToContext(url,tempAtlasPngUrl,atlasJson);
				}
				}else {
				throw "传递的url没有获取到对应的图集数据信息，请确保图集已经过！";
			}
		}
	}

	MiniAdpter.postInfoToContext=function(url,atlaspngUrl,atlasJson){
		var postData={"frames":atlasJson.frames,"meta":atlasJson.meta};
		var textureUrl=atlaspngUrl;
		var fileObj=MiniFileMgr.getFileInfo(URL.formatURL(atlaspngUrl));
		if (fileObj){
			var fileMd5Name=fileObj.md5;
			var fileNativeUrl=MiniFileMgr.getFileNativePath(fileMd5Name);
			}else {
			fileNativeUrl=textureUrl;
		}
		if (fileNativeUrl){
			/*__JS__ */wx.postMessage({url:url,atlasdata:postData,imgNativeUrl:fileNativeUrl,imgReadyUrl:textureUrl,isLoad:"opendatacontext"});
			}else {
			throw "获取图集的磁盘url路径不存在！";
		}
	}

	MiniAdpter.sendSinglePicToOpenDataContext=function(url){
		var tempTextureUrl=URL.formatURL(url);
		var fileObj=MiniFileMgr.getFileInfo(tempTextureUrl);
		if (fileObj){
			var fileMd5Name=fileObj.md5;
			var fileNativeUrl=MiniFileMgr.getFileNativePath(fileMd5Name);
			url=tempTextureUrl;
			}else {
			fileNativeUrl=url;
		}
		if (fileNativeUrl){
			/*__JS__ */wx.postMessage({url:url,imgNativeUrl:fileNativeUrl,imgReadyUrl:url,isLoad:"openJsondatacontextPic"});
			}else {
			throw "获取图集的磁盘url路径不存在！";
		}
	}

	MiniAdpter.sendJsonDataToDataContext=function(url){
		if (!laya.wx.mini.MiniAdpter.isZiYu){
			var atlasJson=Loader.getRes(url);
			if (atlasJson){
				/*__JS__ */wx.postMessage({url:url,atlasdata:atlasJson,isLoad:"openJsondatacontext"});
				}else {
				throw "传递的url没有获取到对应的图集数据信息，请确保图集已经过！";
			}
		}
	}

	MiniAdpter.EnvConfig=null;
	MiniAdpter.window=null;
	MiniAdpter._preCreateElement=null;
	MiniAdpter._inited=false;
	MiniAdpter.systemInfo=null;
	MiniAdpter.isZiYu=false;
	MiniAdpter.isPosMsgYu=false;
	MiniAdpter.autoCacheFile=true;
	MiniAdpter.minClearSize=(5 *1024 *1024);
	MiniAdpter.subNativeFiles=null;
	MiniAdpter.subNativeheads=[];
	MiniAdpter.subMaps=[];
	MiniAdpter.AutoCacheDownFile=false;
	MiniAdpter.parseXMLFromString=function(value){
		var rst;
		var Parser;
		value=value.replace(/>\s+</g,'><');
		try {
			/*__JS__ */rst=(new window.Parser.DOMParser()).parseFromString(value,'text/xml');
			}catch (error){
			throw "需要引入xml解析库文件";
		}
		return rst;
	}

	MiniAdpter.idx=1;
	__static(MiniAdpter,
	['nativefiles',function(){return this.nativefiles=["layaNativeDir","wxlocal"];}
	]);
	return MiniAdpter;
})()


/**@private **/

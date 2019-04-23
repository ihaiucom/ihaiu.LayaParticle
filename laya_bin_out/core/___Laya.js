/**
*<code>Laya</code> 是全局对象的引用入口集。
*Laya类引用了一些常用的全局对象，比如Laya.stage：舞台，Laya.timer：时间管理器，Laya.loader：加载管理器，使用时注意大小写。
*/
//class Laya
var ___Laya=(function(){
	//function Laya(){}
	/**
	*表示是否捕获全局错误并弹出提示。默认为false。
	*适用于移动设备等不方便调试的时候，设置为true后，如有未知错误，可以弹窗抛出详细错误堆栈。
	*/
	__getset(1,Laya,'alertGlobalError',null,function(value){
		var erralert=0;
		if (value){
			Browser.window.onerror=function (msg,url,line,column,detail){
				if (erralert++< 5 && detail)
					alert("出错啦，请把此信息截图给研发商\n"+msg+"\n"+detail.stack);
			}
			}else {
			Browser.window.onerror=null;
		}
	});

	Laya.init=function(width,height,__plugins){
		var plugins=[];for(var i=2,sz=arguments.length;i<sz;i++)plugins.push(arguments[i]);
		if (Laya._isinit)return;
		Laya._isinit=true;
		ArrayBuffer.prototype.slice || (ArrayBuffer.prototype.slice=Laya._arrayBufferSlice);
		Browser.__init__();
		if (!Render.isConchApp){
			Context.__init__();
		}
		Laya.systemTimer=new Timer(false);
		Laya.startTimer=new Timer(false);
		Laya.physicsTimer=new Timer(false);
		Laya.updateTimer=new Timer(false);
		Laya.lateTimer=new Timer(false);
		Laya.timer=new Timer(false);
		Laya.loader=new LoaderManager();
		WeakObject.__init__();
		var isWebGLEnabled=false;
		for (var i=0,n=plugins.length;i < n;i++){
			if (plugins[i] && plugins[i].enable){
				plugins[i].enable();
				if (typeof plugins[i]==="WebGL")isWebGLEnabled=true;
			}
		}
		if (Render.isConchApp){
			if (!isWebGLEnabled)/*__JS__ */laya.webgl.WebGL.enable();
			RunDriver.enableNative();
		}
		CacheManger.beginCheck();
		Laya._currentStage=Laya.stage=new Stage();
		Laya._getUrlPath();
		Laya.render=new Render(0,0);
		Laya.stage.size(width,height);
		window.stage=Laya.stage;
		RenderSprite.__init__();
		KeyBoardManager.__init__();
		MouseManager.instance.__init__(Laya.stage,Render.canvas);
		Input.__init__();
		SoundManager.autoStopMusic=true;
		return Render.canvas;
	}

	Laya._getUrlPath=function(){
		var location=Browser.window.location;
		var pathName=location.pathname;
		pathName=pathName.charAt(2)==':' ? pathName.substring(1):pathName;
		URL.rootPath=URL.basePath=URL.getPath(location.protocol=="file:" ? pathName :location.protocol+"//"+location.host+location.pathname);
	}

	Laya._arrayBufferSlice=function(start,end){
		var arr=/*__JS__ */this;
		var arrU8List=new Uint8Array(arr,start,end-start);
		var newU8List=new Uint8Array(arrU8List.length);
		newU8List.set(arrU8List);
		return newU8List.buffer;
	}

	Laya._runScript=function(script){
		return Browser.window[Laya._evcode](script);
	}

	Laya.enableDebugPanel=function(debugJsPath){
		(debugJsPath===void 0)&& (debugJsPath="libs/laya.debugtool.js");
		if (!Laya["DebugPanel"]){
			var script=Browser.createElement("script");
			script.onload=function (){
				Laya["DebugPanel"].enable();
			}
			script.src=debugJsPath;
			Browser.document.body.appendChild(script);
			}else {
			Laya["DebugPanel"].enable();
		}
	}

	Laya.stage=null;
	Laya.systemTimer=null;
	Laya.startTimer=null;
	Laya.physicsTimer=null;
	Laya.updateTimer=null;
	Laya.lateTimer=null;
	Laya.timer=null;
	Laya.loader=null;
	Laya.version="2.0.0";
	Laya.render=null;
	Laya._currentStage=null;
	Laya._isinit=false;
	Laya.isWXOpenDataContext=false;
	Laya.isWXPosMsg=false;
	__static(Laya,
	['conchMarket',function(){return this.conchMarket=/*__JS__ */window.conch?conchMarket:null;},'PlatformClass',function(){return this.PlatformClass=/*__JS__ */window.PlatformClass;},'_evcode',function(){return this._evcode="eva"+"l";}
	]);
	return Laya;
})()


/**
*@private

*/
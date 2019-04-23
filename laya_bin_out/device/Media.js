

/**
*Media用于捕捉摄像头和麦克风。可以捕捉任意之一，或者同时捕捉两者。<code>getCamera</code>前可以使用<code>supported()</code>检查当前浏览器是否支持。
*<b>NOTE:</b>
*<p>目前Media在移动平台只支持Android，不支持IOS。只可在FireFox完整地使用，Chrome测试时无法捕捉视频。</p>
*/

//class laya.device.media.Media
var Media=(function(){
	function Media(){}
	__class(Media,'laya.device.media.Media');
	Media.supported=function(){
		return !!Browser.window.navigator.getUserMedia;
	}

	Media.getMedia=function(options,onSuccess,onError){
		if (Browser.window.navigator.getUserMedia){
			Browser.window.navigator.getUserMedia(options,function(stream){
				onSuccess.runWith(Browser.window.URL.createObjectURL(stream));
				},function(err){
				onError.runWith(err);
			});
		}
	}

	Media.__init$=function(){
		/*__JS__ */navigator.getUserMedia=navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;;
	}

	return Media;
})()



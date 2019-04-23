//class laya.device.media.HtmlVideo extends laya.resource.Bitmap
var HtmlVideo=(function(_super){
	function HtmlVideo(){
		this.video=null;
		this._source=null;
		HtmlVideo.__super.call(this);
		this._width=1;
		this._height=1;
		this.createDomElement();
	}

	__class(HtmlVideo,'laya.device.media.HtmlVideo',_super);
	var __proto=HtmlVideo.prototype;
	__proto.createDomElement=function(){
		var _$this=this;
		this._source=this.video=Browser.createElement("video");
		var style=this.video.style;
		style.position='absolute';
		style.top='0px';
		style.left='0px';
		this.video.addEventListener("loadedmetadata",(function(){
			this._w=_$this.video.videoWidth;
			this._h=_$this.video.videoHeight;
		})['bind'](this));
	}

	__proto.setSource=function(url,extension){
		while(this.video.childElementCount)
		this.video.firstChild.remove();
		if (extension & Video.MP4)
			this.appendSource(url,"video/mp4");
		if (extension & Video.OGG)
			this.appendSource(url+".ogg","video/ogg");
	}

	__proto.appendSource=function(source,type){
		var sourceElement=Browser.createElement("source");
		sourceElement.src=source;
		sourceElement.type=type;
		this.video.appendChild(sourceElement);
	}

	__proto.getVideo=function(){
		return this.video;
	}

	__proto._getSource=function(){
		return this._source;
	}

	HtmlVideo.create=function(){
		return new HtmlVideo();
	}

	return HtmlVideo;
})(Bitmap)


/**
*<code>Video</code>将视频显示到Canvas上。<code>Video</code>可能不会在所有浏览器有效。
*<p>关于Video支持的所有事件参见：<i>http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp</i>。</p>
*<p>
*<b>注意：</b><br/>
*在PC端可以在任何时机调用<code>play()</code>因此，可以在程序开始运行时就使Video开始播放。但是在移动端，只有在用户第一次触碰屏幕后才可以调用play()，所以移动端不可能在程序开始运行时就自动开始播放Video。
*</p>
*
*<p>MDN Video链接： <i>https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video</i></p>
*/

//class laya.device.media.WebGLVideo extends laya.device.media.HtmlVideo
var WebGLVideo=(function(_super){
	function WebGLVideo(){
		this.gl=null;
		this.preTarget=null;
		this.preTexture=null;
		WebGLVideo.__super.call(this);
		if(!Render.isConchApp && Browser.onIPhone)
			return;
		this.gl=/*__JS__ */Render.isConchApp ? LayaGLContext.instance :WebGL.mainContext;
		this._source=this.gl.createTexture();
		WebGLContext.bindTexture(this.gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,this._source);
		this.gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
		this.gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
		this.gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MAG_FILTER*/0x2800,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
		this.gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
		WebGLContext.bindTexture(this.gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,null);
	}

	__class(WebGLVideo,'laya.device.media.WebGLVideo',_super);
	var __proto=WebGLVideo.prototype;
	//(preTarget && preTexture)&& (WebGLContext.bindTexture(gl,preTarget,preTexture));
	__proto.updateTexture=function(){
		if(!Render.isConchApp && Browser.onIPhone)
			return;
		WebGLContext.bindTexture(this.gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,this._source);
		this.gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,/*laya.webgl.WebGLContext.RGB*/0x1907,/*laya.webgl.WebGLContext.RGB*/0x1907,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,this.video);
		WebGLVideo.curBindSource=this._source;
	}

	__proto.destroy=function(){
		if (this._source){
			this.gl=/*__JS__ */Render.isConchApp ? LayaGLContext.instance :WebGL.mainContext;
			if (WebGLVideo.curBindSource==this._source){
				WebGLContext.bindTexture(this.gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,null);
				WebGLVideo.curBindSource=null;
			}
			this.gl.deleteTexture(this._source);
		}
		laya.resource.Resource.prototype.destroy.call(this);
	}

	__getset(0,__proto,'_glTexture',function(){
		return this._source;
	});

	WebGLVideo.curBindSource=null;
	return WebGLVideo;
})(HtmlVideo)


	Laya.__init([Media]);

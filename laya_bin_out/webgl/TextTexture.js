//class laya.webgl.text.TextTexture extends laya.resource.Resource
var TextTexture=(function(_super){
	function TextTexture(textureW,textureH){
		this._source=null;
		// webgl 贴图
		this._texW=0;
		this._texH=0;
		this.__destroyed=false;
		//父类有，但是private
		this._discardTm=0;
		//释放的时间。超过一定时间会被真正删除
		this.genID=0;
		// 这个对象会重新利用，为了能让引用他的人知道自己引用的是否有效，加个id
		this.bitmap={id:0,_glTexture:null};
		//samekey的判断用的
		this.curUsedCovRate=0;
		// 当前使用到的使用率。根据面积算的
		this.curUsedCovRateAtlas=0;
		// 大图集中的占用率。由于大图集分辨率低，所以会浪费一些空间
		this.lastTouchTm=0;
		this.ri=null;
		TextTexture.__super.call(this);
		this._texW=textureW || TextRender.atlasWidth;
		this._texH=textureH || TextRender.atlasWidth;
		this.bitmap.id=this.id;
		this.lock=true;
	}

	__class(TextTexture,'laya.webgl.text.TextTexture',_super);
	var __proto=TextTexture.prototype;
	//防止被资源管理清除
	__proto.recreateResource=function(){
		if (this._source)
			return;
		var gl=Render.isConchApp?LayaGL.instance.getDefaultCommandEncoder():WebGL.mainContext;
		var glTex=this._source=gl.createTexture();
		this.bitmap._glTexture=glTex;
		WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,glTex);
		gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,this._texW,this._texH,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,null);
		gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
		gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MAG_FILTER*/0x2800,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
		gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
		gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
		if (TextRender.debugUV){
			this.fillWhite();
		}
	}

	/**
	*
	*@param data
	*@param x 拷贝位置。
	*@param y
	*@param uv
	*@return uv数组 如果uv不为空就返回传入的uv，否则new一个数组
	*/
	__proto.addChar=function(data,x,y,uv){
		if(TextRender.isWan1Wan){
			return this.addCharCanvas(data ,x,y,uv);
		}
		!this._source && this.recreateResource();
		var gl=Render.isConchApp?LayaGL.instance.getDefaultCommandEncoder():WebGL.mainContext;
		WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,this._source);
		!Render.isConchApp && gl.pixelStorei(/*laya.webgl.WebGLContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL*/0x9241,true);
		var dt=data.data;
		if (/*__JS__ */data.data instanceof Uint8ClampedArray)
			dt=new Uint8Array(dt.buffer);
		gl.texSubImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,x,y,data.width,data.height,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,dt);
		!Render.isConchApp && gl.pixelStorei(/*laya.webgl.WebGLContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL*/0x9241,false);
		var u0=NaN;
		var v0=NaN;
		var u1=NaN;
		var v1=NaN;
		if(Render.isConchApp){
			u0=x / this._texW;
			v0=y / this._texH;
			u1=(x+data.width)/ this._texW;
			v1=(y+data.height)/ this._texH;
			}else{
			u0=(x+1)/ this._texW;
			v0=(y+1)/ this._texH;
			u1=(x+data.width-1)/ this._texW;
			v1=(y+data.height-1)/ this._texH;
		}
		uv=uv || new Array(8);
		uv[0]=u0,uv[1]=v0;
		uv[2]=u1,uv[3]=v0;
		uv[4]=u1,uv[5]=v1;
		uv[6]=u0,uv[7]=v1;
		return uv;
	}

	/**
	*玩一玩不支持 getImageData
	*@param canv
	*@param x
	*@param y
	*/
	__proto.addCharCanvas=function(canv,x,y,uv){
		!this._source && this.recreateResource();
		var gl=Render.isConchApp?LayaGL.instance.getDefaultCommandEncoder():WebGL.mainContext;
		WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,this._source);
		!Render.isConchApp && gl.pixelStorei(/*laya.webgl.WebGLContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL*/0x9241,true);
		gl.texSubImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,x,y,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,canv);
		!Render.isConchApp && gl.pixelStorei(/*laya.webgl.WebGLContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL*/0x9241,false);
		var u0=NaN;
		var v0=NaN;
		var u1=NaN;
		var v1=NaN;
		if(Render.isConchApp){
			u0=x / this._texW;
			v0=y / this._texH;
			u1=(x+canv.width)/ this._texW;
			v1=(y+canv.height)/ this._texH;
			}else{
			u0=(x+1)/ this._texW;
			v0=(y+1)/ this._texH;
			u1=(x+canv.width-1)/ this._texW;
			v1=(y+canv.height-1)/ this._texH;
		}
		uv=uv || new Array(8);
		uv[0]=u0,uv[1]=v0;
		uv[2]=u1,uv[3]=v0;
		uv[4]=u1,uv[5]=v1;
		uv[6]=u0,uv[7]=v1;
		return uv;
	}

	/**
	*填充白色。调试用。
	*/
	__proto.fillWhite=function(){
		!this._source && this.recreateResource();
		var gl=Render.isConchApp?LayaGL.instance.getDefaultCommandEncoder():WebGL.mainContext;
		var dt=new Uint8Array(this._texW *this._texH *4);
		(dt).fill(0xff);
		gl.texSubImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,0,0,this._texW,this._texH,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,dt);
	}

	__proto.discard=function(){
		if (this._texW !=TextRender.atlasWidth || this._texH !=TextRender.atlasWidth){
			this.destroy();
			return;
		}
		this.genID++;
		if (TextTexture.poolLen >=TextTexture.pool.length){
			TextTexture.pool=TextTexture.pool.concat(new Array(10));
		}
		this._discardTm=Laya.stage.getFrameTm();
		TextTexture.pool[TextTexture.poolLen++]=this;
	}

	__proto.destroy=function(){
		console.log('destroy TextTexture');
		this.__destroyed=true;
		var gl=Render.isConchApp?LayaGL.instance.getDefaultCommandEncoder():WebGL.mainContext;
		this._source && gl.deleteTexture(this._source);
		this._source=null;
	}

	__proto.touchRect=function(ri,curloop){
		if (this.lastTouchTm !=curloop){
			this.curUsedCovRate=0;
			this.curUsedCovRateAtlas=0;
			this.lastTouchTm=curloop;
		};
		var texw2=TextRender.atlasWidth *TextRender.atlasWidth;
		var gridw2=TextAtlas.atlasGridW *TextAtlas.atlasGridW;
		this.curUsedCovRate+=(ri.bmpWidth *ri.bmpHeight)/ texw2;
		this.curUsedCovRateAtlas+=(Math.ceil(ri.bmpWidth / TextAtlas.atlasGridW)*Math.ceil(ri.bmpHeight / TextAtlas.atlasGridW))/ (texw2 / gridw2);
	}

	__proto._getSource=function(){
		return this._source;
	}

	// for debug
	__proto.drawOnScreen=function(x,y){}
	// 为了与当前的文字渲染兼容的补丁
	__getset(0,__proto,'texture',function(){
		return this;
	});

	TextTexture.getTextTexture=function(w,h){
		if (w !=TextRender.atlasWidth || w !=TextRender.atlasWidth)
			return new TextTexture(w,h);
		if (TextTexture.poolLen > 0){
			var ret=TextTexture.pool[--TextTexture.poolLen];
			if (TextTexture.poolLen > 0)
				TextTexture.clean();
			return ret;
		}
		return new TextTexture(w,h);
	}

	TextTexture.clean=function(){
		var curtm=Laya.stage.getFrameTm();
		if (TextTexture.cleanTm===0)TextTexture.cleanTm=curtm;
		if (curtm-TextTexture.cleanTm >=TextRender.checkCleanTextureDt){
			for (var i=0;i < TextTexture.poolLen;i++){
				var p=TextTexture.pool[i];
				if (curtm-p._discardTm >=TextRender.destroyUnusedTextureDt){
					p.destroy();
					TextTexture.pool[i]=TextTexture.pool[TextTexture.poolLen-1];
					TextTexture.poolLen--;
					i--;
				}
			}
			TextTexture.cleanTm=curtm;
		}
	}

	TextTexture.poolLen=0;
	TextTexture.cleanTm=0;
	__static(TextTexture,
	['pool',function(){return this.pool=new Array(10);}
	]);
	return TextTexture;
})(Resource)



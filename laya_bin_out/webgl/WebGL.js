//class laya.webgl.WebGL
var WebGL=(function(){
	function WebGL(){}
	__class(WebGL,'laya.webgl.WebGL');
	WebGL._uint8ArraySlice=function(){
		var _this=/*__JS__ */this;
		var sz=_this.length;
		var dec=new Uint8Array(_this.length);
		for (var i=0;i < sz;i++)dec[i]=_this[i];
		return dec;
	}

	WebGL._float32ArraySlice=function(){
		var _this=/*__JS__ */this;
		var sz=_this.length;
		var dec=new Float32Array(_this.length);
		for (var i=0;i < sz;i++)dec[i]=_this[i];
		return dec;
	}

	WebGL._uint16ArraySlice=function(__arg){
		var arg=arguments;
		var _this=/*__JS__ */this;
		var sz=0;
		var dec;
		var i=0;
		if (arg.length===0){
			sz=_this.length;
			dec=new Uint16Array(sz);
			for (i=0;i < sz;i++)
			dec[i]=_this[i];
			}else if (arg.length===2){
			var start=arg[0];
			var end=arg[1];
			if (end > start){
				sz=end-start;
				dec=new Uint16Array(sz);
				for (i=start;i < end;i++)
				dec[i-start]=_this[i];
				}else {
				dec=new Uint16Array(0);
			}
		}
		return dec;
	}

	WebGL._nativeRender_enable=function(){
		if (WebGL.isNativeRender_enable)
			return;
		WebGL.isNativeRender_enable=true;
		HTMLImage.create=function (width,height){
			var tex=new Texture2D(width,height,/*laya.webgl.resource.BaseTexture.FORMAT_R8G8B8A8*/1,false,false);
			tex.wrapModeU=/*laya.webgl.resource.BaseTexture.WARPMODE_CLAMP*/1;
			tex.wrapModeV=/*laya.webgl.resource.BaseTexture.WARPMODE_CLAMP*/1;
			return tex;
		}
		WebGLContext.__init_native();
		RenderState2D.width=Browser.window.innerWidth;
		RenderState2D.height=Browser.window.innerHeight;
		RunDriver.measureText=function (txt,font){
			window["conchTextCanvas"].font=font;
			return window["conchTextCanvas"].measureText(txt);
		}
		RunDriver.enableNative=function (){
			(LayaGLRunner).uploadShaderUniforms=LayaGLRunner.uploadShaderUniformsForNative;
			var stage=Stage;
			stage.prototype.repaint=stage.prototype.repaintForNative;
			stage.prototype.render=stage.prototype.renderToNative;
			var bufferStateBase=BufferStateBase;
			bufferStateBase.prototype.bind=BufferStateBase.prototype.bindForNative;
			bufferStateBase.prototype.unBind=BufferStateBase.prototype.unBindForNative;
			if (Render.isConchApp){
				/*__JS__ */CommandEncoder=window.GLCommandEncoder;
				/*__JS__ */LayaGL=window.LayaGLContext;
				var prototypeContext=/*__JS__ */window.CanvasRenderingContext.prototype;
				var protoLast=LayaGLRenderingContext.prototype;
				/*__JS__ */LayaGLRenderingContext=window.CanvasRenderingContext;
				prototypeContext.drawImage=protoLast.drawImage;
				prototypeContext.drawTexture=protoLast.drawTexture;
				prototypeContext.fillText=protoLast.fillText;
				prototypeContext.save=protoLast.save;
				prototypeContext.restore=protoLast.restore;
				prototypeContext.translate=protoLast.translate;
				prototypeContext.scale=protoLast.scale;
				prototypeContext.rotate=protoLast.rotate;
				prototypeContext.transform=protoLast.transform;
				prototypeContext.beginRT=protoLast.beginRT;
				prototypeContext.endRT=protoLast.endRT;
				prototypeContext.drawCanvas=protoLast.drawCanvas;
				prototypeContext.drawTarget=protoLast.drawTarget;
				prototypeContext._$get_asBitmap=protoLast._$get_asBitmap;
				prototypeContext._$set_asBitmap=protoLast._$set_asBitmap;
				prototypeContext.toBase64=protoLast.toBase64;
				prototypeContext.getImageData=protoLast.getImageData;
				/*__JS__ */__getset (0,prototypeContext,'asBitmap',prototypeContext._$get_asBitmap,prototypeContext._$set_asBitmap);
				ConchPropertyAdpt.rewriteProperties();
			}
			ConchSpriteAdpt.init();
			LayaNative2D.__init__();
		}
		RunDriver.clear=function (color){
			var c=ColorUtils.create(color).arrColor;
			var gl=LayaGL.instance;
			if (c)gl.clearColor(c[0],c[1],c[2],c[3]);
			gl.clear(/*laya.webgl.WebGLContext.COLOR_BUFFER_BIT*/0x00004000 | /*laya.webgl.WebGLContext.DEPTH_BUFFER_BIT*/0x00000100 | /*laya.webgl.WebGLContext.STENCIL_BUFFER_BIT*/0x00000400);
		}
		RunDriver.drawToCanvas=function (sprite,_renderType,canvasWidth,canvasHeight,offsetX,offsetY){
			var canvas=new HTMLCanvas(true);
			canvas.size(canvasWidth,canvasHeight);
			var context=canvas.getContext("2d");
			context.asBitmap=true;
			var canvasCmd=LayaGL.instance.createCommandEncoder(128,64,false);
			canvasCmd.beginEncoding();
			canvasCmd.clearEncoding();
			var layagl=LayaGL.instance;
			var lastContext=layagl.getCurrentContext();
			layagl.setCurrentContext(context);
			context.beginRT();
			layagl.save();
			var temp=ConchSpriteAdpt._tempFloatArrayMatrix;
			temp[0]=1;
			temp[1]=0;
			temp[2]=0;
			temp[3]=1;
			temp[4]=offsetX;
			temp[5]=offsetY;
			layagl.setGlobalValue(LayaNative2D.GLOBALVALUE_MATRIX32,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,temp);
			(sprite).writeBlockToNative();
			layagl.restore();
			layagl.setCurrentContext(lastContext);
			layagl.commitContextToGPU(context);
			context.endRT();
			canvasCmd.endEncoding();
			layagl.useCommandEncoder(canvasCmd.getPtrID(),-1,0);
			return canvas;
		}
		HTMLCanvas.prototype.getTexture=function (){
			if (!this._texture){
				this._texture=this.context._targets;
				this._texture.uv=RenderTexture2D.flipyuv;
				this._texture.bitmap=this._texture;
			}
			return this._texture;
		}
	}

	WebGL._webglRender_enable=function(){
		if (Render.isWebGL)return;
		Render.isWebGL=true;
		RunDriver.initRender=function (canvas,w,h){
			function getWebGLContext (canvas){
				var gl;
				var names=["webgl2","webgl","experimental-webgl","webkit-3d","moz-webgl"];
				if (!Config.useWebGL2){
					names.shift();
				}
				for (var i=0;i < names.length;i++){
					try {
						gl=canvas.getContext(names[i],{stencil:Config.isStencil,alpha:Config.isAlpha,antialias:Config.isAntialias,premultipliedAlpha:Config.premultipliedAlpha,preserveDrawingBuffer:Config.preserveDrawingBuffer});
					}catch (e){}
					if (gl){
						(names[i]==='webgl2')&& (laya.webgl.WebGL._isWebGL2=true);
						new LayaGL();
						return gl;
					}
				}
				return null;
			};
			var gl=LayaGL.instance=laya.webgl.WebGL.mainContext=getWebGLContext(Render._mainCanvas.source);
			if (!gl)
				return false;
			canvas.size(w,h);
			WebGLContext.__init__(gl);
			WebGLContext2D.__init__();
			Submit.__init__();
			var ctx=new WebGLContext2D();
			Render._context=ctx;
			canvas._setContext(ctx);
			laya.webgl.WebGL.shaderHighPrecision=false;
			try {
				var precisionFormat=gl.getShaderPrecisionFormat(/*laya.webgl.WebGLContext.FRAGMENT_SHADER*/0x8B30,/*laya.webgl.WebGLContext.HIGH_FLOAT*/0x8DF2);
				precisionFormat.precision ? WebGL.shaderHighPrecision=true :WebGL.shaderHighPrecision=false;
			}catch (e){}
			LayaGL.instance=gl;
			System.__init__();
			ShaderDefines2D.__init__();
			Value2D.__init__();
			Shader2D.__init__();
			Buffer2D.__int__(gl);
			BlendMode._init_(gl);
			return true;
		}
		HTMLImage.create=function (width,height){
			var tex=new Texture2D(width,height,/*laya.webgl.resource.BaseTexture.FORMAT_R8G8B8A8*/1,false,false);
			tex.wrapModeU=/*laya.webgl.resource.BaseTexture.WARPMODE_CLAMP*/1;
			tex.wrapModeV=/*laya.webgl.resource.BaseTexture.WARPMODE_CLAMP*/1;
			return tex;
		}
		RunDriver.createRenderSprite=function (type,next){
			return new RenderSprite3D(type,next);
		}
		RunDriver.changeWebGLSize=function (width,height){
			laya.webgl.WebGL.onStageResize(width,height);
		}
		RunDriver.clear=function (color){
			WebGLContext2D.set2DRenderConfig();
			RenderState2D.worldScissorTest && laya.webgl.WebGL.mainContext.disable(/*laya.webgl.WebGLContext.SCISSOR_TEST*/0x0C11);
			var ctx=Render.context;
			var c=(ctx._submits._length==0 || Config.preserveDrawingBuffer)? ColorUtils.create(color).arrColor :Laya.stage._wgColor;
			if (c)ctx.clearBG(c[0],c[1],c[2],c[3]);
			RenderState2D.clear();
		}
		RunDriver.drawToCanvas=function (sprite,_renderType,canvasWidth,canvasHeight,offsetX,offsetY){
			offsetX-=sprite.x;
			offsetY-=sprite.y;
			offsetX |=0;
			offsetY |=0;
			canvasWidth |=0;
			canvasHeight |=0;
			var ctx=new WebGLContext2D();
			ctx.size(canvasWidth,canvasHeight);
			ctx.asBitmap=true;
			ctx._targets.start();
			RenderSprite.renders[_renderType]._fun(sprite,ctx,offsetX,offsetY);
			ctx.flush();
			ctx._targets.end();
			ctx._targets.restore();
			var dt=ctx._targets.getData(0,0,canvasWidth,canvasHeight);
			ctx.destroy();
			var imgdata=/*__JS__ */new ImageData(canvasWidth,canvasHeight);;
			var lineLen=canvasWidth *4;
			var temp=new Uint8Array(lineLen);
			var dst=imgdata.data;
			var y=canvasHeight-1;
			var off=y *lineLen;
			var srcoff=0;
			for (;y >=0;y--){
				dst.set(dt.subarray(srcoff,srcoff+lineLen),off);
				off-=lineLen;
				srcoff+=lineLen;
			};
			var canv=new HTMLCanvas(true);
			canv.size(canvasWidth,canvasHeight);
			var ctx2d=canv.getContext('2d');
			/*__JS__ */ctx2d.putImageData(imgdata,0,0);;
			return canv;
		}
		RunDriver.getTexturePixels=function (value,x,y,width,height){
			var st=0,dst=0,i=0;
			var tex2d=value.bitmap;
			var texw=tex2d.width;
			var texh=tex2d.height;
			if (x+width > texw)width-=(x+width)-texw;
			if (y+height > texh)height-=(y+height)-texh;
			if (width <=0 || height <=0)return null;
			var wstride=width *4;
			var pix=null;
			try {
				pix=tex2d.getPixels();
			}catch (e){}
			if (pix){
				if(x==0&&y==0&&width==texw&&height==texh)
					return pix;
				var ret=new Uint8Array(width *height *4);
				wstride=texw *4;
				st=x*4;
				dst=(y+height-1)*wstride+x*4;
				for (i=height-1;i >=0;i--){
					ret.set(dt.slice(dst,dst+width*4),st);
					st+=wstride;
					dst-=wstride;
				}
				return ret;
			};
			var ctx=new WebGLContext2D();
			ctx.size(width,height);
			ctx.asBitmap=true;
			var uv=null;
			if (x !=0 || y !=0 || width !=texw || height !=texh){
				uv=value.uv.concat();
				var stu=uv[0];
				var stv=uv[1];
				var uvw=uv[2]-stu;
				var uvh=uv[7]-stv;
				var uk=uvw / texw;
				var vk=uvh / texh;
				uv=[
				stu+x *uk,stv+y *vk,
				stu+(x+width)*uk,stv+y *vk,
				stu+(x+width)*uk,stv+(y+height)*vk,
				stu+x *uk,stv+(y+height)*vk,];
			}
			(ctx)._drawTextureM(value,0,0,width,height,null,1.0,uv);
			ctx._targets.start();
			ctx.flush();
			ctx._targets.end();
			ctx._targets.restore();
			var dt=ctx._targets.getData(0,0,width,height);
			ctx.destroy();
			ret=new Uint8Array(width *height *4);
			st=0;
			dst=(height-1)*wstride;
			for (i=height-1;i >=0;i--){
				ret.set(dt.slice(dst,dst+wstride),st);
				st+=wstride;
				dst-=wstride;
			}
			return ret;
		}
		Filter._filter=function (sprite,context,x,y){
			var webglctx=context;
			var next=this._next;
			if (next){
				var filters=sprite.filters,len=filters.length;
				if (len==1 && (filters[0].type==/*laya.filters.Filter.COLOR*/0x20)){
					context.save();
					context.setColorFilter(filters[0]);
					next._fun.call(next,sprite,context,x,y);
					context.restore();
					return;
				};
				var svCP=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
				var b;
				var p=Point.TEMP;
				var tMatrix=webglctx._curMat;
				var mat=Matrix.create();
				tMatrix.copyTo(mat);
				var tPadding=0;
				var tHalfPadding=0;
				var tIsHaveGlowFilter=false;
				var source=null;
				var out=sprite._cacheStyle.filterCache || null;
				if (!out || sprite.getRepaint()!=0){
					tIsHaveGlowFilter=sprite._isHaveGlowFilter();
					if (tIsHaveGlowFilter){
						tPadding=50;
						tHalfPadding=25;
					}
					b=new Rectangle();
					b.copyFrom(sprite.getSelfBounds());
					b.x+=sprite.x;
					b.y+=sprite.y;
					b.x-=sprite.pivotX+4;
					b.y-=sprite.pivotY+4;
					var tSX=b.x;
					var tSY=b.y;
					b.width+=(tPadding+8);
					b.height+=(tPadding+8);
					p.x=b.x *mat.a+b.y *mat.c;
					p.y=b.y *mat.d+b.x *mat.b;
					b.x=p.x;
					b.y=p.y;
					p.x=b.width *mat.a+b.height *mat.c;
					p.y=b.height *mat.d+b.width *mat.b;
					b.width=p.x;
					b.height=p.y;
					if (b.width <=0 || b.height <=0){
						return;
					}
					out && WebGLRTMgr.releaseRT(out);
					source=WebGLRTMgr.getRT(b.width,b.height);
					var outRT=out=WebGLRTMgr.getRT(b.width,b.height);
					sprite._getCacheStyle().filterCache=out;
					webglctx.pushRT();
					webglctx.useRT(source);
					var tX=sprite.x-tSX+tHalfPadding;
					var tY=sprite.y-tSY+tHalfPadding;
					next._fun.call(next,sprite,context,tX,tY);
					webglctx.useRT(outRT);
					for (var i=0;i < len;i++){
						if (i !=0){
							webglctx.useRT(source);
							webglctx.drawTarget(outRT,0,0,b.width,b.height,Matrix.TEMP.identity(),svCP,null,BlendMode.TOINT.overlay);
							webglctx.useRT(outRT);
						};
						var fil=filters[i];
						switch (fil.type){
							case /*laya.filters.Filter.BLUR*/0x10:
								fil._glRender && fil._glRender.render(source,context,b.width,b.height,fil);
								break ;
							case /*laya.filters.Filter.GLOW*/0x08:
								fil._glRender && fil._glRender.render(source,context,b.width,b.height,fil);
								break ;
							case /*laya.filters.Filter.COLOR*/0x20:
								webglctx.setColorFilter(fil);
								webglctx.drawTarget(source,0,0,b.width,b.height,Matrix.EMPTY.identity(),Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0));
								webglctx.setColorFilter(null);
								break ;
							}
					}
					webglctx.popRT();
					}else {
					tIsHaveGlowFilter=sprite._cacheStyle.hasGlowFilter || false;
					if (tIsHaveGlowFilter){
						tPadding=50;
						tHalfPadding=25;
					}
					b=sprite.getBounds();
					if (b.width <=0 || b.height <=0){
						return;
					}
					b.width+=tPadding;
					b.height+=tPadding;
					p.x=b.x *mat.a+b.y *mat.c;
					p.y=b.y *mat.d+b.x *mat.b;
					b.x=p.x;
					b.y=p.y;
					p.x=b.width *mat.a+b.height *mat.c;
					p.y=b.height *mat.d+b.width *mat.b;
					b.width=p.x;
					b.height=p.y;
				}
				x=x-tHalfPadding-sprite.x;
				y=y-tHalfPadding-sprite.y;
				p.setTo(x,y);
				mat.transformPoint(p);
				x=p.x+b.x;
				y=p.y+b.y;
				webglctx._drawRenderTexture(out,x,y,b.width,b.height,Matrix.TEMP.identity(),1.0,RenderTexture2D.defuv);
				if(source){
					var submit=SubmitCMD.create([source],function(s){
						s.destroy();
					},this);
					source=null;
					context.addRenderObject(submit);
				}
				mat.destroy();
			}
		}
		HTMLCanvas.prototype.getTexture=function (){
			if (!this._texture){
				var bitmap=new Texture2D();
				bitmap.loadImageSource(this.source);
				this._texture=new Texture(bitmap);
			}
			return this._texture;
		}
		Float32Array.prototype.slice || (Float32Array.prototype.slice=WebGL._float32ArraySlice);
		Uint16Array.prototype.slice || (Uint16Array.prototype.slice=WebGL._uint16ArraySlice);
		Uint8Array.prototype.slice || (Uint8Array.prototype.slice=WebGL._uint8ArraySlice);
	}

	WebGL.enable=function(){
		Browser.__init__();
		if (!Browser._supportWebGL)
			return false;
		if (Render.isConchApp){
			WebGL._nativeRender_enable();
			}else {
			WebGL._webglRender_enable();
		}
		return true;
	}

	WebGL.onStageResize=function(width,height){
		if (WebGL.mainContext==null)return;
		WebGL.mainContext.viewport(0,0,width,height);
		RenderState2D.width=width;
		RenderState2D.height=height;
	}

	WebGL.mainContext=null;
	WebGL.shaderHighPrecision=false;
	WebGL._isWebGL2=false;
	WebGL.isNativeRender_enable=false;
	return WebGL;
})()



//class laya.layagl.LayaGLRenderingContext
var LayaGLRenderingContext=(function(){
	function LayaGLRenderingContext(){
		//TODO:coverage
		this._customCmds=null;
		//TODO:这个变量没有,下面有编译错误,临时整个
		this._targets=null;
		this._width=0;
		this._height=0;
		this._cmdEncoder=null;
	}

	__class(LayaGLRenderingContext,'laya.layagl.LayaGLRenderingContext');
	var __proto=LayaGLRenderingContext.prototype;
	//TODO:coverage
	__proto.drawTexture=function(texture,x,y,width,height){
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		this.drawImage(texture,x,y,width,height);
	}

	//TODO:coverage
	__proto.drawImage=function(texture,x,y,width,height){
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		this._customCmds.push(DrawImageCmd.create.call(this,texture,x,y,width,height));
	}

	//TODO:coverage
	__proto.fillText=function(text,x,y,font,color,textAlign){
		this._customCmds.push(FillTextCmd.create.call(this,text,x,y,font||Text.defaultFontStr(),color,textAlign));
	}

	//TODO:coverage
	__proto.save=function(){
		this._customCmds.push(SaveCmd.create.call(this));
	}

	//TODO:coverage
	__proto.restore=function(){
		this._customCmds.push(RestoreCmd.create.call(this));
	}

	//TODO:coverage
	__proto.translate=function(tx,ty){
		this._customCmds.push(TranslateCmd.create.call(this,tx,ty));
	}

	//TODO:coverage
	__proto.rotate=function(angle,pivotX,pivotY){
		(pivotX===void 0)&& (pivotX=0);
		(pivotY===void 0)&& (pivotY=0);
		this._customCmds.push(RotateCmd.create.call(this,angle,pivotX,pivotY));
	}

	//TODO:coverage
	__proto.scale=function(scaleX,scaleY,pivotX,pivotY){
		(pivotX===void 0)&& (pivotX=0);
		(pivotY===void 0)&& (pivotY=0);
		this._customCmds.push(ScaleCmd.create.call(this,scaleX,scaleY,pivotX,pivotY));
	}

	//TODO:coverage
	__proto.transform=function(matrix,pivotX,pivotY){
		(pivotX===void 0)&& (pivotX=0);
		(pivotY===void 0)&& (pivotY=0);
		this._customCmds.push(TransformCmd.create.call(this,matrix,pivotX,pivotY));
	}

	//TODO:coverage
	__proto.beginRT=function(){
		RenderTexture2D.pushRT();
		this._targets.start();
		this.clear();
	}

	__proto.clear=function(){}
	//TODO:coverage
	__proto.endRT=function(){
		RenderTexture2D.popRT();
	}

	//TODO:coverage
	__proto.drawCanvas=function(canvas,x,y){
		var target=canvas.context._targets;
		this._customCmds.push(DrawCanvasCmd.create.call(this,target,x,y,target.width,target.height));
	}

	//TODO:coverage
	__proto.drawTarget=function(commandEncoder,texture,x,y,width,height){
		var vbData=new ArrayBuffer(24 *4);
		var _i32b=new Int32Array(vbData);
		var _fb=new Float32Array(vbData);
		var w=width !=0 ? width :texture.width;
		var h=height !=0 ? height :texture.height;
		var uv=RenderTexture2D.flipyuv;
		var ix=0;
		_fb[ix++]=x;_fb[ix++]=y;_fb[ix++]=uv[0];_fb[ix++]=uv[1];_i32b[ix++]=0xffffffff;_i32b[ix++]=0xffffffff;
		_fb[ix++]=x+w;_fb[ix++]=y;_fb[ix++]=uv[2];_fb[ix++]=uv[3];_i32b[ix++]=0xffffffff;_i32b[ix++]=0xffffffff;
		_fb[ix++]=x+w;_fb[ix++]=y+h;_fb[ix++]=uv[4];_fb[ix++]=uv[5];_i32b[ix++]=0xffffffff;_i32b[ix++]=0xffffffff;
		_fb[ix++]=x;_fb[ix++]=y+h;_fb[ix++]=uv[6];_fb[ix++]=uv[7];_i32b[ix++]=0xffffffff;_i32b[ix++]=0xffffffff;
		commandEncoder.useProgramEx(LayaNative2D.PROGRAMEX_DRAWTEXTURE);
		commandEncoder.useVDO(LayaNative2D.VDO_MESHQUADTEXTURE);
		commandEncoder.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
		commandEncoder.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
		commandEncoder.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
		commandEncoder.uniformTexture(0,/*laya.webgl.WebGLContext.TEXTURE0*/0x84C0,texture._getSource());
		commandEncoder.setRectMesh(1,vbData);
		commandEncoder.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
		commandEncoder.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
	}

	__proto.getImageData=function(x,y,width,height,callBack){
		var w=this._targets.sourceWidth;
		var h=this._targets.sourceHeight;
		if (x < 0 || y < 0 || width < 0 || height < 0 || width > w || height > h){
			return;
		}
		if (!this._cmdEncoder){
			this._cmdEncoder=LayaGL.instance.createCommandEncoder(128,64,false);
		};
		var gl=LayaGL.instance;
		this._cmdEncoder.beginEncoding();
		this._cmdEncoder.clearEncoding();
		RenderTexture2D.pushRT();
		this._targets.start();
		gl.readPixelsAsync(x,y,width,height,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,function(data){
			/*__JS__ */callBack(data);
		});
		this.endRT();
		this._cmdEncoder.endEncoding();
		gl.useCommandEncoder(this._cmdEncoder.getPtrID(),-1,0);
	}

	__proto.toBase64=function(type,encoderOptions,callBack){
		var width=this._targets.sourceWidth;
		var height=this._targets.sourceHeight;
		this.getImageData(0,0,width,height,function(data){
			/*__JS__ */var base64=conchToBase64(type,encoderOptions,data,width,height);
			/*__JS__ */callBack(base64);
		});
	}

	__getset(0,__proto,'asBitmap',function(){
		return !this._targets;
		},function(value){
		if (value){
			this._targets || (this._targets=new RenderTexture2D(this._width,this._height,/*laya.webgl.resource.BaseTexture.FORMAT_R8G8B8A8*/1,-1));
			if (!this._width || !this._height)
				throw Error("asBitmap no size!");
		}
		else{
			this._targets=null;
		}
	});

	return LayaGLRenderingContext;
})()


/**
*填充文字命令
*/

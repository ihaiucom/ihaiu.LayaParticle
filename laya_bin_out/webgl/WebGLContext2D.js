//class laya.webgl.canvas.WebGLContext2D extends laya.resource.Context
var WebGLContext2D=(function(_super){
	var ContextParams;
	function WebGLContext2D(){
		this._drawTriUseAbsMatrix=false;
		//还原2D视口
		this._id=++WebGLContext2D._COUNT;
		//this._other=null;
		//this._renderNextSubmitIndex=0;
		this._path=null;
		//this._primitiveValue2D=null;
		this._drawCount=1;
		this._maxNumEle=0;
		this._renderCount=0;
		this._isConvexCmd=true;
		//arc等是convex的，moveTo,linTo就不是了
		this._submits=null;
		this._curSubmit=null;
		//当前将要使用的设置。用来跟上一次的_curSubmit比较
		//this._mesh=null;
		//用Mesh2D代替_vb,_ib. 当前使用的mesh
		//this._pathMesh=null;
		//矢量专用mesh。
		//this._triangleMesh=null;
		//drawTriangles专用mesh。由于ib不固定，所以不能与_mesh通用
		this.meshlist=[];
		//用矩阵描述的clip信息。最终的点投影到这个矩阵上，在0~1之间就可见。
		this._clipInfoID=0;
		//生成clipid的，原来是 _clipInfoID=++_clipInfoID 这样会有问题，导致兄弟clip的id都相同
		//this._curMat=null;
		//计算矩阵缩放的缓存
		this._lastMatScaleX=1.0;
		this._lastMatScaleY=1.0;
		this._lastMat_a=1.0;
		this._lastMat_b=0.0;
		this._lastMat_c=0.0;
		this._lastMat_d=1.0;
		this._nBlendType=0;
		//this._save=null;
		//this._targets=null;
		//this._charSubmitCache=null;
		this._saveMark=null;
		/**
		*所cacheAs精灵
		*对于cacheas bitmap的情况，如果图片还没准备好，需要有机会重画，所以要保存sprite。例如在图片
		*加载完成后，调用repaint
		*/
		//this.sprite=null;
		//文字颜色。使用顶点色
		this._drawTextureUseColor=false;
		this._italicDeg=0;
		//文字的倾斜角度
		this._lastTex=null;
		//上次使用的texture。主要是给fillrect用，假装自己也是一个drawtexture
		this._fillColor=0;
		this._flushCnt=0;
		//给fillrect用
		//this._colorFiler=null;
		this.drawTexAlign=false;
		/*******************************************start矢量绘制***************************************************/
		this.mId=-1;
		this.mHaveKey=false;
		this.mHaveLineKey=false;
		WebGLContext2D.__super.call(this);
		this._width=99999999;
		this._height=99999999;
		this._submitKey=new SubmitKey();
		this._transedPoints=new Array(8);
		this._temp4Points=new Array(8);
		this._clipRect=WebGLContext2D.MAXCLIPRECT;
		this._globalClipMatrix=new Matrix(/*CLASS CONST:laya.webgl.canvas.WebGLContext2D._MAXSIZE*/99999999,0,0,/*CLASS CONST:laya.webgl.canvas.WebGLContext2D._MAXSIZE*/99999999,0,0);
		this._shader2D=new Shader2D();
		this.mOutPoint
		WebGLContext2D._contextcount++;
		if (!WebGLContext2D.defTexture){
			var defTex2d=new Texture2D(2,2);
			defTex2d.setPixels(new Uint8Array(16));
			WebGLContext2D.defTexture=new Texture(defTex2d);
		}
		this._lastTex=WebGLContext2D.defTexture;
		this.clear();
	}

	__class(WebGLContext2D,'laya.webgl.canvas.WebGLContext2D',_super);
	var __proto=WebGLContext2D.prototype;
	__proto.clearBG=function(r,g,b,a){
		var gl=WebGL.mainContext;
		gl.clearColor(r,g,b,a);
		gl.clear(/*laya.webgl.WebGLContext.COLOR_BUFFER_BIT*/0x00004000);
	}

	//TODO:coverage
	__proto._getSubmits=function(){
		return this._submits;
	}

	__proto._releaseMem=function(){
		if (!this._submits)
			return;
		this._curMat.destroy();
		this._curMat=null;
		this._shader2D.destroy();
		this._shader2D=null;
		this._charSubmitCache.clear();
		for (var i=0,n=this._submits._length;i < n;i++){
			this._submits[i].releaseRender();
		}
		this._submits.length=0;
		this._submits._length=0;
		this._submits=null;
		this._curSubmit=null;
		this._path=null;
		this._save=null;
		var sz=0;
		for (i=0,sz=this.meshlist.length;i < sz;i++){
			var curm=this.meshlist[i];
			curm.destroy();
		}
		this.meshlist.length=0;
		this.sprite=null;
		this._targets && (this._targets.destroy());
		this._targets=null;
	}

	//TODO:coverage
	__proto.destroy=function(){
		--WebGLContext2D._contextcount;
		this.sprite=null;
		this._releaseMem();
		this._charSubmitCache.destroy();
		this._targets && this._targets.destroy();
		this._targets=null;
		this._mesh.destroy();
	}

	__proto.clear=function(){
		if (!this._submits){
			this._other=ContextParams.DEFAULT;
			this._curMat=Matrix.create();
			this._charSubmitCache=new CharSubmitCache();
			this._mesh=MeshQuadTexture.getAMesh();
			this.meshlist.push(this._mesh);
			this._pathMesh=MeshVG.getAMesh();
			this.meshlist.push(this._pathMesh);
			this._triangleMesh=MeshTexture.getAMesh();
			this.meshlist.push(this._triangleMesh);
			this._submits=[];
			this._save=[SaveMark.Create(this)];
			this._save.length=10;
			this._shader2D=new Shader2D();
		}
		this._submitKey.clear();
		this._mesh.clearVB();
		this._renderCount++;
		this._drawCount=1;
		this._other=ContextParams.DEFAULT;
		this._other.lineWidth=this._shader2D.ALPHA=1.0;
		this._nBlendType=0;
		this._clipRect=WebGLContext2D.MAXCLIPRECT;
		this._curSubmit=Submit.RENDERBASE;
		Submit.RENDERBASE._ref=0xFFFFFF;
		Submit.RENDERBASE._numEle=0;
		this._shader2D.fillStyle=this._shader2D.strokeStyle=DrawStyle.DEFAULT;
		for (var i=0,n=this._submits._length;i < n;i++)
		this._submits[i].releaseRender();
		this._submits._length=0;
		this._curMat.identity();
		this._other.clear();
		this._saveMark=this._save[0];
		this._save._length=1;
	}

	/**
	*设置ctx的size，这个不允许直接设置，必须是canvas调过来的。所以这个函数里也不用考虑canvas相关的东西
	*@param w
	*@param h
	*/
	__proto.size=function(w,h){
		if (this._width !=w || this._height !=h){
			this._width=w;
			this._height=h;
			if (this._targets){
				this._targets.destroy();
				this._targets=new RenderTexture2D(w,h,/*laya.webgl.resource.BaseTexture.FORMAT_R8G8B8A8*/1,-1);
			}
			if (Render._context==this){
				WebGL.mainContext.viewport(0,0,w,h);
				RenderState2D.width=w;
				RenderState2D.height=h;
			}
		}
		if (w===0 && h===0)this._releaseMem();
	}

	/**
	*获得当前矩阵的缩放值
	*避免每次都计算getScaleX
	*@return
	*/
	__proto.getMatScaleX=function(){
		if (this._lastMat_a==this._curMat.a && this._lastMat_b==this._curMat.b)
			return this._lastMatScaleX;
		this._lastMatScaleX=this._curMat.getScaleX();
		this._lastMat_a=this._curMat.a;
		this._lastMat_b=this._curMat.b;
		return this._lastMatScaleX;
	}

	__proto.getMatScaleY=function(){
		if (this._lastMat_c==this._curMat.c && this._lastMat_d==this._curMat.d)
			return this._lastMatScaleY;
		this._lastMatScaleY=this._curMat.getScaleY();
		this._lastMat_c=this._curMat.c;
		this._lastMat_d=this._curMat.d;
		return this._lastMatScaleY;
	}

	//TODO
	__proto.setFillColor=function(color){
		this._fillColor=color;
	}

	__proto.getFillColor=function(){
		return this._fillColor;
	}

	__proto.translate=function(x,y){
		if (x!==0 || y!==0){
			SaveTranslate.save(this);
			if (this._curMat._bTransform){
				SaveTransform.save(this);
				this._curMat.tx+=(x *this._curMat.a+y *this._curMat.c);
				this._curMat.ty+=(x *this._curMat.b+y *this._curMat.d);
				}else {
				this._curMat.tx=x;
				this._curMat.ty=y;
			}
		}
	}

	__proto.save=function(){
		this._save[this._save._length++]=SaveMark.Create(this);
	}

	__proto.restore=function(){
		var sz=this._save._length;
		var lastBlend=this._nBlendType;
		if (sz < 1)
			return;
		for (var i=sz-1;i >=0;i--){
			var o=this._save[i];
			o.restore(this);
			if (o.isSaveMark()){
				this._save._length=i;
				return;
			}
		}
		if (lastBlend !=this._nBlendType){
			this._curSubmit=Submit.RENDERBASE;
		}
	}

	//TODO:coverage
	__proto.fillText=function(txt,x,y,fontStr,color,align){
		this._fillText(txt,null,x,y,fontStr,color,null,0,null);
	}

	/**
	*
	*@param txt
	*@param words HTMLChar 数组，是已经在外面排好版的一个数组
	*@param x
	*@param y
	*@param fontStr
	*@param color
	*@param strokeColor
	*@param lineWidth
	*@param textAlign
	*@param underLine
	*/
	__proto._fillText=function(txt,words,x,y,fontStr,color,strokeColor,lineWidth,textAlign,underLine){
		(underLine===void 0)&& (underLine=0);
		if (txt)
			WebGLContext2D._textRender.filltext(this,txt,x,y,fontStr,color,strokeColor,lineWidth,textAlign,underLine);
		else if(words)
		WebGLContext2D._textRender.fillWords(this,words,x,y,fontStr,color,strokeColor,lineWidth);
	}

	__proto._fast_filltext=function(data,x,y,fontObj,color,strokeColor,lineWidth,textAlign,underLine){
		(underLine===void 0)&& (underLine=0);
		WebGLContext2D._textRender._fast_filltext(this,data,null,x,y,fontObj,color,strokeColor,lineWidth,textAlign,underLine);
	}

	//TODO:coverage
	__proto.fillWords=function(words,x,y,fontStr,color){
		this._fillText(null,words,x,y,fontStr,color,null,-1,null,0);
	}

	//TODO:coverage
	__proto.fillBorderWords=function(words,x,y,font,color,borderColor,lineWidth){
		this._fillBorderText(null,words,x,y,font,color,borderColor,lineWidth,null);
	}

	__proto.drawText=function(text,x,y,font,color,textAlign){
		this._fillText(text,null,x,y,font,ColorUtils.create(color).strColor,null,-1,textAlign);
	}

	/**
	*只画边框
	*@param text
	*@param x
	*@param y
	*@param font
	*@param color
	*@param lineWidth
	*@param textAlign
	*/
	__proto.strokeWord=function(text,x,y,font,color,lineWidth,textAlign){;
		this._fillText(text,null,x,y,font,null,ColorUtils.create(color).strColor,lineWidth || 1,textAlign);
	}

	/**
	*即画文字又画边框
	*@param txt
	*@param x
	*@param y
	*@param fontStr
	*@param fillColor
	*@param borderColor
	*@param lineWidth
	*@param textAlign
	*/
	__proto.fillBorderText=function(txt,x,y,fontStr,fillColor,borderColor,lineWidth,textAlign){
		this._fillBorderText(txt,null,x,y,fontStr,ColorUtils.create(fillColor).strColor,ColorUtils.create(borderColor).strColor,lineWidth,textAlign);
	}

	__proto._fillBorderText=function(txt,words,x,y,fontStr,fillColor,borderColor,lineWidth,textAlign){
		this._fillText(txt,words,x,y,fontStr,fillColor,borderColor,lineWidth || 1,textAlign);
	}

	__proto._fillRect=function(x,y,width,height,rgba){
		var submit=this._curSubmit;
		var sameKey=submit && (submit._key.submitType===/*laya.webgl.submit.Submit.KEY_DRAWTEXTURE*/2 && submit._key.blendShader===this._nBlendType);
		if (this._mesh.vertNum+4 > 65535){
			this._mesh=MeshQuadTexture.getAMesh();
			this.meshlist.push(this._mesh);
			sameKey=false;
		}
		sameKey && (sameKey=sameKey&& this.isSameClipInfo(submit));
		this.transformQuad(x,y,width,height,0,this._curMat,this._transedPoints);
		if(!this.clipedOff(this._transedPoints)){
			this._mesh.addQuad(this._transedPoints,Texture.NO_UV,rgba,false);
			if (!sameKey){
				submit=this._curSubmit=SubmitTexture.create(this,this._mesh,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0));
				this._submits[this._submits._length++]=submit;
				this._copyClipInfo(submit,this._globalClipMatrix);
				submit.shaderValue.textureHost=this._lastTex;
				submit._key.other=(this._lastTex && this._lastTex.bitmap)?this._lastTex.bitmap.id:-1
				submit._renderType=/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016;
			}
			this._curSubmit._numEle+=6;
			this._mesh.indexNum+=6;
			this._mesh.vertNum+=4;
		}
	}

	__proto.fillRect=function(x,y,width,height,fillStyle){
		var drawstyle=fillStyle? DrawStyle.create(fillStyle):this._shader2D.fillStyle;
		var rgba=this.mixRGBandAlpha(drawstyle.toInt());
		this._fillRect(x,y,width,height,rgba);
	}

	//TODO:coverage
	__proto.fillTexture=function(texture,x,y,width,height,type,offset,other){
		if (!texture._getSource()){
			this.sprite && Laya.systemTimer.callLater(this,this._repaintSprite);
			return;
		};
		var submit=this._curSubmit;
		var sameKey=false;
		if (this._mesh.vertNum+4 > 65535){
			this._mesh=MeshQuadTexture.getAMesh();
			this.meshlist.push(this._mesh);
			sameKey=false;
		};
		var tex2d=texture.bitmap;
		var repeatx=true;
		var repeaty=true;
		switch(type){
			case "repeat":break ;
			case "repeat-x":repeaty=false;break ;
			case "repeat-y":repeatx=false;break ;
			case "no-repeat":repeatx=repeaty=false;break ;
			default :break ;
			};
		var uv=this._temp4Points;
		var stu=0;
		var stv=0;
		var stx=0,sty=0,edx=0,edy=0;
		if (offset.x < 0){
			stx=x;
			stu=(-offset.x %texture.width)/ texture.width;
			}else {
			stx=x+offset.x;
		}
		if (offset.y < 0){
			sty=y;
			stv=(-offset.y %texture.height)/ texture.height;
			}else {
			sty=y+offset.y;
		}
		edx=x+width;
		edy=y+height;
		(!repeatx)&& (edx=Math.min(edx,x+offset.x+texture.width));
		(!repeaty)&& (edy=Math.min(edy,y+offset.y+texture.height));
		if (edx < x || edy < y)
			return;
		if (stx > edx || sty > edy)
			return;
		var edu=(edx-x-offset.x)/texture.width;
		var edv=(edy-y-offset.y)/ texture.height;
		this.transformQuad(stx,sty,edx-stx,edy-sty,0,this._curMat,this._transedPoints);
		uv[0]=stu;uv[1]=stv;uv[2]=edu;uv[3]=stv;uv[4]=edu;uv[5]=edv;uv[6]=stu;uv[7]=edv;
		if (!this.clipedOff(this._transedPoints)){
			var rgba=this._mixRGBandAlpha(0xffffffff,this._shader2D.ALPHA);
			this._mesh.addQuad(this._transedPoints,uv,rgba,true);
			var sv=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
			sv.defines.add(/*laya.webgl.shader.d2.ShaderDefines2D.FILLTEXTURE*/0x100);
			(sv).u_TexRange=texture.uvrect;
			submit=this._curSubmit=SubmitTexture.create(this,this._mesh,sv);
			this._submits[this._submits._length++]=submit;
			this._copyClipInfo(submit,this._globalClipMatrix);
			submit.shaderValue.textureHost=texture;
			submit._renderType=/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016;
			this._curSubmit._numEle+=6;
			this._mesh.indexNum+=6;
			this._mesh.vertNum+=4;
		}
		this.breakNextMerge();
	}

	/**
	*反正只支持一种filter，就不要叫setFilter了，直接叫setColorFilter
	*@param value
	*/
	__proto.setColorFilter=function(filter){
		SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_COLORFILTER*/0x800000,this,true);
		this._colorFiler=filter;
		this._curSubmit=Submit.RENDERBASE;
	}

	//_reCalculateBlendShader();
	__proto.drawTexture=function(tex,x,y,width,height){
		this._drawTextureM(tex,x,y,width,height,null,1,null);
	}

	__proto.drawTextures=function(tex,pos,tx,ty){
		if (!tex._getSource()){
			this.sprite && Laya.systemTimer.callLater(this,this._repaintSprite);
			return;
		};
		var n=pos.length / 2;
		var ipos=0;
		for (var i=0;i < n;i++){
			this._inner_drawTexture(tex,tex.bitmap.id,pos[ipos++]+tx,pos[ipos++]+ty,0,0,null,null,1.0,false);
		}
	}

	//TODO:coverage
	__proto._drawTextureAddSubmit=function(imgid,tex){
		var submit=null;
		submit=SubmitTexture.create(this,this._mesh,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0));
		this._submits[this._submits._length++]=submit;
		submit.shaderValue.textureHost=tex;
		submit._key.other=imgid;
		submit._renderType=/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016;
		this._curSubmit=submit;
	}

	//shader.ALPHA=alphaBack;
	__proto._drawTextureM=function(tex,x,y,width,height,m,alpha,uv){
		if (!tex._getSource()){
			if (this.sprite){
				Laya.systemTimer.callLater(this,this._repaintSprite);
			}
			return false;
		}
		return this._inner_drawTexture(tex,tex.bitmap.id,x,y,width,height,m,uv,alpha,false);
	}

	__proto._drawRenderTexture=function(tex,x,y,width,height,m,alpha,uv){
		return this._inner_drawTexture(tex,-1,x,y,width,height,m,uv,1.0,false);
	}

	//TODO:coverage
	__proto.submitDebugger=function(){
		this._submits[this._submits._length++]=SubmitCMD.create([],function(){debugger;},this);
	}

	/*
	private function copyClipInfo(submit:Submit,clipInfo:Array):void {
		var cd:Array=submit.shaderValue.clipDir;
		cd[0]=clipInfo[2];cd[1]=clipInfo[3];cd[2]=clipInfo[4];cd[3]=clipInfo[5];
		var cp:Array=submit.shaderValue.clipRect;
		cp[0]=clipInfo[0];cp[1]=clipInfo[1];
		submit.clipInfoID=this._clipInfoID;
	}

	*/
	__proto._copyClipInfo=function(submit,clipInfo){
		var cm=submit.shaderValue.clipMatDir;
		cm[0]=clipInfo.a;cm[1]=clipInfo.b;cm[2]=clipInfo.c;cm[3]=clipInfo.d;
		var cmp=submit.shaderValue.clipMatPos;
		cmp[0]=clipInfo.tx;cmp[1]=clipInfo.ty;
		submit.clipInfoID=this._clipInfoID;
	}

	__proto.isSameClipInfo=function(submit){
		return (submit.clipInfoID===this._clipInfoID);
	}

	/**
	*这个还是会检查是否合并
	*@param tex
	*@param minVertNum
	*/
	__proto._useNewTex2DSubmit=function(tex,minVertNum){
		if (this._mesh.vertNum+minVertNum > 65535){
			this._mesh=MeshQuadTexture.getAMesh();
			this.meshlist.push(this._mesh);
		};
		var submit=SubmitTexture.create(this,this._mesh,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0));
		this._submits[this._submits._length++]=this._curSubmit=submit;
		submit.shaderValue.textureHost=tex;
		this._copyClipInfo(submit,this._globalClipMatrix);
	}

	/**
	*使用上面的设置（texture，submit，alpha，clip），画一个rect
	*/
	__proto._drawTexRect=function(x,y,w,h,uv){
		this.transformQuad(x,y,w,h,this._italicDeg,this._curMat,this._transedPoints);
		var ops=this._transedPoints;
		ops[0]=(ops[0]+0.5)| 0;
		ops[1]=(ops[1]+0.5)| 0;
		ops[2]=(ops[2]+0.5)| 0;
		ops[3]=(ops[3]+0.5)| 0;
		ops[4]=(ops[4]+0.5)| 0;
		ops[5]=(ops[5]+0.5)| 0;
		ops[6]=(ops[6]+0.5)| 0;
		ops[7]=(ops[7]+0.5)| 0;
		if (!this.clipedOff(this._transedPoints)){
			this._mesh.addQuad(this._transedPoints,uv ,this._fillColor,true);
			this._curSubmit._numEle+=6;
			this._mesh.indexNum+=6;
			this._mesh.vertNum+=4;
		}
	}

	__proto.drawCallOptimize=function(enbale){
		this._charSubmitCache.enable(enbale,this);
		return enbale;
	}

	/**
	*
	*@param tex {Texture | RenderTexture }
	*@param imgid 图片id用来比较合并的
	*@param x
	*@param y
	*@param width
	*@param height
	*@param m
	*@param alpha
	*@param uv
	*@return
	*/
	__proto._inner_drawTexture=function(tex,imgid,x,y,width,height,m,uv,alpha,lastRender){
		var preKey=this._curSubmit._key;
		uv=uv || /*__JS__ */tex._uv
		if (preKey.submitType===/*laya.webgl.submit.Submit.KEY_TRIANGLES*/4 && preKey.other===imgid){
			var tv=WebGLContext2D._drawTexToDrawTri_Vert;
			tv[0]=x;tv[1]=y;tv[2]=x+width,tv[3]=y,tv[4]=x+width,tv[5]=y+height,tv[6]=x,tv[7]=y+height;
			this._drawTriUseAbsMatrix=true;
			this.drawTriangles(tex,0,0,tv,(uv ),WebGLContext2D._drawTexToDrawTri_Index,m,alpha,null,'normal');
			this._drawTriUseAbsMatrix=false;
			return true;
		};
		var ops=lastRender?this._charSubmitCache.getPos():this._transedPoints;
		this.transformQuad(x,y,width || tex.width,height || tex.height,this._italicDeg,m || this._curMat,ops);
		if (this.drawTexAlign){
			ops[0]=(ops[0]+0.5)| 0;
			ops[1]=(ops[1]+0.5)| 0;
			ops[2]=(ops[2]+0.5)| 0;
			ops[3]=(ops[3]+0.5)| 0;
			ops[4]=(ops[4]+0.5)| 0;
			ops[5]=(ops[5]+0.5)| 0;
			ops[6]=(ops[6]+0.5)| 0;
			ops[7]=(ops[7]+0.5)| 0;
			this.drawTexAlign=false;
		};
		var rgba=this._mixRGBandAlpha(0xffffffff,this._shader2D.ALPHA *alpha);
		if (lastRender){
			this._charSubmitCache.add(this,tex,imgid,ops,uv ,rgba);
			return true;
		}
		this._drawCount++;
		var sameKey=imgid >=0 && preKey.submitType===/*laya.webgl.submit.Submit.KEY_DRAWTEXTURE*/2 && preKey.other===imgid;
		sameKey && (sameKey=sameKey&& this.isSameClipInfo(this._curSubmit));
		this._lastTex=tex;
		if (this._mesh.vertNum+4 > 65535){
			this._mesh=MeshQuadTexture.getAMesh();
			this.meshlist.push(this._mesh);
			sameKey=false;
		}
		if (!this.clipedOff(this._transedPoints)){
			this._mesh.addQuad(ops,uv ,rgba,true);
			if (!sameKey){
				var submit=SubmitTexture.create(this,this._mesh,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0));
				this._submits[this._submits._length++]=this._curSubmit=submit;
				submit.shaderValue.textureHost=tex;
				submit._key.other=imgid;
				this._copyClipInfo(submit,this._globalClipMatrix);
			}
			this._curSubmit._numEle+=6;
			this._mesh.indexNum+=6;
			this._mesh.vertNum+=4;
			return true;
		}
		return false;
	}

	/**
	*转换4个顶点。为了效率这个不做任何检查。需要调用者的配合。
	*@param a 输入。8个元素表示4个点
	*@param out 输出
	*/
	__proto.transform4Points=function(a,m,out){
		var tx=m.tx;
		var ty=m.ty;
		if (m._bTransform){
			out[0]=a[0] *m.a+a[1] *m.c+tx;out[1]=a[0] *m.b+a[1] *m.d+ty;
			out[2]=a[2] *m.a+a[3] *m.c+tx;out[3]=a[2] *m.b+a[3] *m.d+ty;
			out[4]=a[4] *m.a+a[5] *m.c+tx;out[5]=a[4] *m.b+a[5] *m.d+ty;
			out[6]=a[6] *m.a+a[7] *m.c+tx;out[7]=a[6] *m.b+a[7] *m.d+ty;
			}else {
			out[0]=a[0]+tx;out[1]=a[1]+ty;
			out[2]=a[2]+tx;out[3]=a[3]+ty;
			out[4]=a[4]+tx;out[5]=a[5]+ty;
			out[6]=a[6]+tx;out[7]=a[7]+ty;
		}
	}

	/**
	*pt所描述的多边形完全在clip外边，整个被裁掉了
	*@param pt
	*@return
	*/
	__proto.clipedOff=function(pt){
		if (this._clipRect.width <=0 || this._clipRect.height <=0)
			return true;
		return false;
	}

	/**
	*应用当前矩阵。把转换后的位置放到输出数组中。
	*@param x
	*@param y
	*@param w
	*@param h
	*@param italicDeg 倾斜角度，单位是度。0度无，目前是下面不动。以后要做成可调的
	*/
	__proto.transformQuad=function(x,y,w,h,italicDeg,m,out){
		var xoff=0;
		if (italicDeg !=0){
			xoff=Math.tan(italicDeg *Math.PI / 180)*h;
		};
		var maxx=x+w;var maxy=y+h;
		this._temp4Points[0]=x+xoff;this._temp4Points[1]=y;
		this._temp4Points[2]=maxx+xoff;this._temp4Points[3]=y;
		this._temp4Points[4]=maxx;this._temp4Points[5]=maxy;
		this._temp4Points[6]=x;this._temp4Points[7]=maxy;
		this.transform4Points(this._temp4Points,m,out);
	}

	__proto.pushRT=function(){
		this.addRenderObject(SubmitCMD.create(null,RenderTexture2D.pushRT,this));
	}

	__proto.popRT=function(){
		this.addRenderObject(SubmitCMD.create(null,RenderTexture2D.popRT,this));
		this.breakNextMerge();
	}

	//TODO:coverage
	__proto.useRT=function(rt){
		function _use (rt){
			if (!rt){
				throw 'error useRT'
				}else{
				rt.start();
				rt.clear(0,0,0,0);
			}
		}
		this.addRenderObject(SubmitCMD.create([rt],_use,this));
		this.breakNextMerge();
	}

	//TODO:coverage
	__proto.RTRestore=function(rt){
		function _restore (rt){
			rt.restore();
		}
		this.addRenderObject(SubmitCMD.create([rt],_restore,this));
		this.breakNextMerge();
	}

	/**
	*强制拒绝submit合并
	*例如切换rt的时候
	*/
	__proto.breakNextMerge=function(){
		this._curSubmit=Submit.RENDERBASE;
	}

	//TODO:coverage
	__proto._repaintSprite=function(){
		this.sprite && this.sprite.repaint();
	}

	/**
	*
	*@param tex
	*@param x
	*@param y
	*@param width
	*@param height
	*@param transform 图片本身希望的矩阵
	*@param tx 节点的位置
	*@param ty
	*@param alpha
	*/
	__proto.drawTextureWithTransform=function(tex,x,y,width,height,transform,tx,ty,alpha,blendMode,colorfilter){
		var oldcomp=null;
		if (blendMode){
			oldcomp=this.globalCompositeOperation;
			this.globalCompositeOperation=blendMode;
		};
		var oldColorFilter=this._colorFiler;
		if (colorfilter){
			this.setColorFilter(colorfilter);
		}
		if (!transform){
			this._drawTextureM(tex,x+tx,y+ty,width,height,null,alpha,null);
			if (blendMode){
				this.globalCompositeOperation=oldcomp;
			}
			if (colorfilter){
				this.setColorFilter(oldColorFilter);
			}
			return;
		};
		var curMat=this._curMat;
		WebGLContext2D._tmpMatrix.a=transform.a;WebGLContext2D._tmpMatrix.b=transform.b;WebGLContext2D._tmpMatrix.c=transform.c;WebGLContext2D._tmpMatrix.d=transform.d;WebGLContext2D._tmpMatrix.tx=transform.tx+tx;WebGLContext2D._tmpMatrix.ty=transform.ty+ty;
		WebGLContext2D._tmpMatrix._bTransform=transform._bTransform;
		if (transform && curMat._bTransform){
			Matrix.mul(WebGLContext2D._tmpMatrix,curMat,WebGLContext2D._tmpMatrix);
			transform=WebGLContext2D._tmpMatrix;
			transform._bTransform=true;
			}else {
			transform=WebGLContext2D._tmpMatrix;
		}
		this._drawTextureM(tex,x,y,width,height,transform,alpha,null);
		if (blendMode){
			this.globalCompositeOperation=oldcomp;
		}
		if (colorfilter){
			this.setColorFilter(oldColorFilter);
		}
	}

	/**
	**把ctx中的submits提交。结果渲染到target上
	*@param ctx
	*@param target
	*/
	__proto._flushToTarget=function(context,target){
		RenderState2D.worldScissorTest=false;
		WebGL.mainContext.disable(/*laya.webgl.WebGLContext.SCISSOR_TEST*/0x0C11);
		var preAlpha=RenderState2D.worldAlpha;
		var preMatrix4=RenderState2D.worldMatrix4;
		var preMatrix=RenderState2D.worldMatrix;
		var preShaderDefines=RenderState2D.worldShaderDefines;
		RenderState2D.worldMatrix=Matrix.EMPTY;
		RenderState2D.restoreTempArray();
		RenderState2D.worldMatrix4=RenderState2D.TEMPMAT4_ARRAY;
		RenderState2D.worldAlpha=1;
		BaseShader.activeShader=null;
		target.start();
		if(context._submits._length>0)
			target.clear(0,0,0,0);
		context._curSubmit=Submit.RENDERBASE;
		context.flush();
		context.clear();
		target.restore();
		context._curSubmit=Submit.RENDERBASE;
		BaseShader.activeShader=null;
		RenderState2D.worldAlpha=preAlpha;
		RenderState2D.worldMatrix4=preMatrix4;
		RenderState2D.worldMatrix=preMatrix;
	}

	//RenderState2D.worldShaderDefines=preShaderDefines;
	__proto.drawCanvas=function(canvas,x,y,width,height){
		var src=canvas.context;
		var submit;
		if (src._targets){
			if (src._submits._length > 0){
				submit=SubmitCMD.create([src,src._targets],this._flushToTarget,this);
				this._submits[this._submits._length++]=submit;
			}
			this._drawRenderTexture(src._targets,x,y,width,height,null,1.0,RenderTexture2D.flipyuv);
			this._curSubmit=Submit.RENDERBASE;
			}else {
			var canv=canvas;
			if (canv.touches){
				(canv.touches).forEach(function(v){v.touch();});
			}
			submit=SubmitCanvas.create(canvas,this._shader2D.ALPHA,this._shader2D.filters);
			this._submits[this._submits._length++]=submit;
			(submit)._key.clear();
			var mat=(submit)._matrix;
			this._curMat.copyTo(mat);
			var tx=mat.tx,ty=mat.ty;
			mat.tx=mat.ty=0;
			mat.transformPoint(Point.TEMP.setTo(x,y));
			mat.translate(Point.TEMP.x+tx,Point.TEMP.y+ty);
			Matrix.mul(canv.invMat,mat,mat);
			this._curSubmit=Submit.RENDERBASE;
		}
	}

	__proto.drawTarget=function(rt,x,y,width,height,m,shaderValue,uv,blend){
		(blend===void 0)&& (blend=-1);
		this._drawCount++;
		var rgba=this.mixRGBandAlpha(this._drawTextureUseColor?(this.fillStyle?this.fillStyle.toInt():0):0xffffffff);
		if (this._mesh.vertNum+4 > 65535){
			this._mesh=MeshQuadTexture.getAMesh();
			this.meshlist.push(this._mesh);
		}
		this.transformQuad(x,y,width,height,0,m || this._curMat,this._transedPoints);
		if(!this.clipedOff(this._transedPoints)){
			this._mesh.addQuad(this._transedPoints,uv || Texture.DEF_UV,0xffffffff,true);
			var submit=this._curSubmit=SubmitTarget.create(this,this._mesh,shaderValue,rt);
			submit.blendType=(blend==-1)?this._nBlendType:blend;
			this._copyClipInfo(submit,this._globalClipMatrix);
			submit._numEle=6;
			this._mesh.indexNum+=6;
			this._mesh.vertNum+=4;
			this._maxNumEle=Math.max(this._maxNumEle,submit._numEle);
			this._submits[this._submits._length++]=submit;
			this._curSubmit=Submit.RENDERBASE
			return true;
		}
		this._curSubmit=Submit.RENDERBASE
		return false;
	}

	__proto.drawTriangles=function(tex,x,y,vertices,uvs,indices,matrix,alpha,color,blendMode){
		if (!tex._getSource()){
			if (this.sprite){
				Laya.systemTimer.callLater(this,this._repaintSprite);
			}
			return;
		}
		this._drawCount++;
		var oldColorFilter=null;
		var needRestorFilter=false;
		if (color){
			oldColorFilter=this._colorFiler;
			this._colorFiler=color;
			this._curSubmit=Submit.RENDERBASE;
			needRestorFilter=oldColorFilter!=color;
		};
		var webGLImg=tex.bitmap;
		var preKey=this._curSubmit._key;
		var sameKey=preKey.submitType===/*laya.webgl.submit.Submit.KEY_TRIANGLES*/4 && preKey.other===webGLImg.id && preKey.blendShader==this._nBlendType;
		var rgba=this._mixRGBandAlpha(0xffffffff,this._shader2D.ALPHA *alpha);
		var vertNum=vertices.length / 2;
		var eleNum=indices.length;
		if (this._triangleMesh.vertNum+vertNum > 65535){
			this._triangleMesh=MeshTexture.getAMesh();
			this.meshlist.push(this._triangleMesh);
			sameKey=false;
		}
		if (!sameKey){
			var submit=this._curSubmit=SubmitTexture.create(this,this._triangleMesh,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0));
			submit.shaderValue.textureHost=tex;
			submit._renderType=/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016;
			submit._key.submitType=/*laya.webgl.submit.Submit.KEY_TRIANGLES*/4;
			submit._key.other=webGLImg.id;
			this._copyClipInfo(submit,this._globalClipMatrix);
			this._submits[this._submits._length++]=submit;
		}
		if (!matrix){
			WebGLContext2D._tmpMatrix.a=1;WebGLContext2D._tmpMatrix.b=0;WebGLContext2D._tmpMatrix.c=0;WebGLContext2D._tmpMatrix.d=1;WebGLContext2D._tmpMatrix.tx=x;WebGLContext2D._tmpMatrix.ty=y;
			}else {
			WebGLContext2D._tmpMatrix.a=matrix.a;WebGLContext2D._tmpMatrix.b=matrix.b;WebGLContext2D._tmpMatrix.c=matrix.c;WebGLContext2D._tmpMatrix.d=matrix.d;WebGLContext2D._tmpMatrix.tx=matrix.tx+x;WebGLContext2D._tmpMatrix.ty=matrix.ty+y;
		}
		if(!this._drawTriUseAbsMatrix){
			Matrix.mul(WebGLContext2D._tmpMatrix,this._curMat,WebGLContext2D._tmpMatrix);
		}
		this._triangleMesh.addData(vertices,uvs,indices,WebGLContext2D._tmpMatrix,rgba,this);
		this._curSubmit._numEle+=eleNum;
		this._maxNumEle=Math.max(this._maxNumEle,this._curSubmit._numEle);
		if (needRestorFilter){
			this._colorFiler=oldColorFilter;
			this._curSubmit=Submit.RENDERBASE;
		}
	}

	//return true;
	__proto.transform=function(a,b,c,d,tx,ty){
		SaveTransform.save(this);
		Matrix.mul(Matrix.TEMP.setTo(a,b,c,d,tx,ty),this._curMat,this._curMat);
		this._curMat._checkTransform();
	}

	//TODO:coverage
	__proto._transformByMatrix=function(matrix,tx,ty){
		matrix.setTranslate(tx,ty);
		Matrix.mul(matrix,this._curMat,this._curMat);
		matrix.setTranslate(0,0);
		this._curMat._bTransform=true;
	}

	//TODO:coverage
	__proto.setTransformByMatrix=function(value){
		value.copyTo(this._curMat);
	}

	__proto.rotate=function(angle){
		SaveTransform.save(this);
		this._curMat.rotateEx(angle);
	}

	__proto.scale=function(scaleX,scaleY){
		SaveTransform.save(this);
		this._curMat.scaleEx(scaleX,scaleY);
	}

	__proto.clipRect=function(x,y,width,height){
		SaveClipRect.save(this);
		if (this._clipRect==WebGLContext2D.MAXCLIPRECT){
			this._clipRect=new Rectangle(x,y,width,height);
			}else {
			this._clipRect.width=width;
			this._clipRect.height=height;
			this._clipRect.x=x;
			this._clipRect.y=y;
		}
		WebGLContext2D._clipID_Gen++;
		WebGLContext2D._clipID_Gen %=10000;
		this._clipInfoID=WebGLContext2D._clipID_Gen;
		var cm=this._globalClipMatrix;
		var minx=cm.tx;
		var miny=cm.ty;
		var maxx=minx+cm.a;
		var maxy=miny+cm.d;
		if (this._clipRect.width >=/*CLASS CONST:laya.webgl.canvas.WebGLContext2D._MAXSIZE*/99999999){
			cm.a=cm.d=/*CLASS CONST:laya.webgl.canvas.WebGLContext2D._MAXSIZE*/99999999;
			cm.b=cm.c=cm.tx=cm.ty=0;
			}else {
			if (this._curMat._bTransform){
				cm.tx=this._clipRect.x *this._curMat.a+this._clipRect.y *this._curMat.c+this._curMat.tx;
				cm.ty=this._clipRect.x *this._curMat.b+this._clipRect.y *this._curMat.d+this._curMat.ty;
				cm.a=this._clipRect.width *this._curMat.a;
				cm.b=this._clipRect.width *this._curMat.b;
				cm.c=this._clipRect.height *this._curMat.c;
				cm.d=this._clipRect.height *this._curMat.d;
				}else {
				cm.tx=this._clipRect.x+this._curMat.tx;
				cm.ty=this._clipRect.y+this._curMat.ty;
				cm.a=this._clipRect.width;
				cm.b=cm.c=0;
				cm.d=this._clipRect.height;
			}
		}
		if (cm.a > 0 && cm.d > 0){
			var cmaxx=cm.tx+cm.a;
			var cmaxy=cm.ty+cm.d;
			if (cmaxx <=minx ||cmaxy<=miny || cm.tx>=maxx || cm.ty>=maxy){
				cm.a=-0.1;cm.d=-0.1;
				}else{
				if (cm.tx < minx){
					cm.a-=(minx-cm.tx);
					cm.tx=minx;
				}
				if (cmaxx > maxx){
					cm.a-=(cmaxx-maxx);
				}
				if (cm.ty < miny){
					cm.d-=(miny-cm.ty);
					cm.ty=miny;
				}
				if (cmaxy > maxy){
					cm.d-=(cmaxy-maxy);
				}
				if (cm.a <=0)cm.a=-0.1;
				if (cm.d <=0)cm.d=-0.1;
			}
		}
	}

	//TODO:coverage
	__proto.drawMesh=function(x,y,ib,vb,numElement,mat,shader,shaderValues,startIndex){
		(startIndex===void 0)&& (startIndex=0);
		;
	}

	__proto.addRenderObject=function(o){
		this._submits[this._submits._length++]=o;
	}

	/**
	*
	*@param start
	*@param end
	*/
	__proto.submitElement=function(start,end){
		var mainCtx=Render._context===this;
		var renderList=this._submits;
		var ret=(renderList)._length;
		end < 0 && (end=(renderList)._length);
		var submit=Submit.RENDERBASE;
		while (start < end){
			this._renderNextSubmitIndex=start+1;
			if (renderList[start]===Submit.RENDERBASE){
				start++;
				continue ;
			}
			Submit.preRender=submit;
			submit=renderList[start];
			start+=submit.renderSubmit();
		}
		return ret;
	}

	__proto.flush=function(){
		var ret=this.submitElement(0,this._submits._length);
		this._path && this._path.reset();
		SkinMeshBuffer.instance && SkinMeshBuffer.getInstance().reset();
		this._curSubmit=Submit.RENDERBASE;
		for (var i=0,sz=this.meshlist.length;i < sz;i++){
			var curm=this.meshlist[i];
			curm.canReuse?(curm.releaseMesh()):(curm.destroy());
		}
		this.meshlist.length=0;
		this._mesh=MeshQuadTexture.getAMesh();
		this._pathMesh=MeshVG.getAMesh();
		this._triangleMesh=MeshTexture.getAMesh();
		this.meshlist.push(this._mesh,this._pathMesh,this._triangleMesh);
		this._flushCnt++;
		if (this._flushCnt % 60==0 && Render._context==this){
			var texRender=Laya['textRender'];
			if(texRender)
				texRender.GC(false);
		}
		return ret;
	}

	__proto.setPathId=function(id){
		this.mId=id;
		if (this.mId !=-1){
			this.mHaveKey=false;
			var tVGM=VectorGraphManager.getInstance();
			if (tVGM.shapeDic[this.mId]){
				this.mHaveKey=true;
			}
			this.mHaveLineKey=false;
			if (tVGM.shapeLineDic[this.mId]){
				this.mHaveLineKey=true;
			}
		}
	}

	__proto.beginPath=function(convex){
		(convex===void 0)&& (convex=false);
		var tPath=this._getPath();
		tPath.beginPath(convex);
	}

	__proto.closePath=function(){
		this._path.closePath();
	}

	/**
	*添加一个path。
	*@param points [x,y,x,y....] 这个会被保存下来，所以调用者需要注意复制。
	*@param close 是否闭合
	*@param convex 是否是凸多边形。convex的优先级是这个最大。fill的时候的次之。其实fill的时候不应该指定convex，因为可以多个path
	*@param dx 需要添加的平移。这个需要在应用矩阵之前应用。
	*@param dy
	*/
	__proto.addPath=function(points,close,convex,dx,dy){
		var ci=0;
		for (var i=0,sz=points.length / 2;i < sz;i++){
			var x1=points[ci]+dx,y1=points[ci+1]+dy;
			points[ci]=x1;
			points[ci+1]=y1;
			ci+=2;
		}
		this._getPath().push(points,convex);
	}

	__proto.fill=function(){
		var m=this._curMat;
		var tPath=this._getPath();
		var submit=this._curSubmit;
		var sameKey=(submit._key.submitType===/*laya.webgl.submit.Submit.KEY_VG*/3 && submit._key.blendShader===this._nBlendType);
		sameKey && (sameKey=sameKey&&this.isSameClipInfo(submit));
		if (!sameKey){
			this._curSubmit=this.addVGSubmit(this._pathMesh);
		};
		var rgba=this.mixRGBandAlpha(this.fillStyle.toInt());
		var curEleNum=0;
		var idx;
		for (var i=0,sz=tPath.paths.length;i < sz;i++){
			var p=tPath.paths[i];
			var vertNum=p.path.length / 2;
			if (vertNum < 3 ||(vertNum==3 && !p.convex))
				continue ;
			var cpath=p.path.concat();
			var pi=0;
			var xp=0,yp=0;
			var _x=NaN,_y=NaN;
			if (m._bTransform){
				for (pi=0;pi < vertNum;pi++){
					xp=pi << 1;
					yp=xp+1;
					_x=cpath[xp];
					_y=cpath[yp];
					cpath[xp]=m.a *_x+m.c *_y+m.tx;
					cpath[yp]=m.b *_x+m.d *_y+m.ty;
				}
				}else {
				for (pi=0;pi < vertNum;pi++){
					xp=pi << 1;
					yp=xp+1;
					_x=cpath[xp];
					_y=cpath[yp];
					cpath[xp]=_x+m.tx;
					cpath[yp]=_y+m.ty;
				}
			}
			if (this._pathMesh.vertNum+vertNum > 65535){
				this._curSubmit._numEle+=curEleNum;
				curEleNum=0;
				this._pathMesh=MeshVG.getAMesh();
				this._curSubmit=this.addVGSubmit(this._pathMesh);
			};
			var curvert=this._pathMesh.vertNum;
			if (p.convex){
				var faceNum=vertNum-2;
				idx=new Array(faceNum *3);
				var idxpos=0;
				for (var fi=0;fi < faceNum;fi++){
					idx[idxpos++]=curvert;
					idx[idxpos++]=fi+1+curvert;
					idx[idxpos++]=fi+2+curvert;
				}
			}
			else {
				idx=Earcut.earcut(cpath,null,2);
				if (curvert > 0){
					for (var ii=0;ii < idx.length;ii++){
						idx[ii]+=curvert;
					}
				}
			}
			this._pathMesh.addVertAndIBToMesh(this,cpath,rgba,idx);
			curEleNum+=idx.length;
		}
		this._curSubmit._numEle+=curEleNum;
	}

	__proto.addVGSubmit=function(mesh){
		var submit=Submit.createShape(this,mesh,0,Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.PRIMITIVE*/0x04,0));
		submit._key.submitType=/*laya.webgl.submit.Submit.KEY_VG*/3;
		this._submits[this._submits._length++]=submit;
		this._copyClipInfo(submit,this._globalClipMatrix);
		return submit;
	}

	__proto.stroke=function(){
		if (this.lineWidth > 0){
			var rgba=this.mixRGBandAlpha(this.strokeStyle._color.numColor);
			var tPath=this._getPath();
			var submit=this._curSubmit;
			var sameKey=(submit._key.submitType===/*laya.webgl.submit.Submit.KEY_VG*/3 && submit._key.blendShader===this._nBlendType);
			sameKey && (sameKey=sameKey&& this.isSameClipInfo(submit));
			if (!sameKey){
				this._curSubmit=this.addVGSubmit(this._pathMesh);
			};
			var curEleNum=0;
			for (var i=0,sz=tPath.paths.length;i < sz;i++){
				var p=tPath.paths[i];
				if (p.path.length <=0)
					continue ;
				var idx=[];
				var vertex=[];
				var maxVertexNum=p.path.length *2;
				if (maxVertexNum < 2)
					continue ;
				if (this._pathMesh.vertNum+maxVertexNum > 65535){
					this._curSubmit._numEle+=curEleNum;
					curEleNum=0;
					this._pathMesh=MeshVG.getAMesh();
					this.meshlist.push(this._pathMesh);
					this._curSubmit=this.addVGSubmit(this._pathMesh);
				}
				BasePoly.createLine2(p.path,idx,this.lineWidth,this._pathMesh.vertNum,vertex,p.loop);
				var ptnum=vertex.length / 2;
				var m=this._curMat;
				var pi=0;
				var xp=0,yp=0;
				var _x=NaN,_y=NaN;
				if (m._bTransform){
					for (pi=0;pi < ptnum;pi++){
						xp=pi << 1;
						yp=xp+1;
						_x=vertex[xp];
						_y=vertex[yp];
						vertex[xp]=m.a *_x+m.c *_y+m.tx;
						vertex[yp]=m.b *_x+m.d *_y+m.ty;
					}
					}else {
					for (pi=0;pi < ptnum;pi++){
						xp=pi << 1;
						yp=xp+1;
						_x=vertex[xp];
						_y=vertex[yp];
						vertex[xp]=_x+m.tx;
						vertex[yp]=_y+m.ty;
					}
				}
				this._pathMesh.addVertAndIBToMesh(this,vertex,rgba,idx);
				curEleNum+=idx.length;
			}
			this._curSubmit._numEle+=curEleNum;
		}
	}

	__proto.moveTo=function(x,y){
		var tPath=this._getPath();
		tPath.newPath();
		tPath._lastOriX=x;
		tPath._lastOriY=y;
		tPath.addPoint(x,y);
	}

	/**
	*
	*@param x
	*@param y
	*@param b 是否应用矩阵
	*/
	__proto.lineTo=function(x,y){
		var tPath=this._getPath();
		if (Math.abs(x-tPath._lastOriX)<1e-3 && Math.abs(y-tPath._lastOriY)<1e-3)
			return;
		tPath._lastOriX=x;
		tPath._lastOriY=y;
		tPath.addPoint(x,y);
	}

	/*
	override public function drawCurves(x:Number,y:Number,points:Array,lineColor:*,lineWidth:Number=1):void {
		//setPathId(-1);
		beginPath();
		strokeStyle=lineColor;
		this.lineWidth=lineWidth;
		var points:Array=points;
		//movePath(x,y);TODO 这个被去掉了
		moveTo(points[0],points[1]);
		var i:int=2,n:int=points.length;
		while (i < n){
			quadraticCurveTo(points[i++],points[i++],points[i++],points[i++]);
		}
		stroke();
	}

	*/
	__proto.arcTo=function(x1,y1,x2,y2,r){
		var i=0;
		var x=0,y=0;
		var dx=this._path._lastOriX-x1;
		var dy=this._path._lastOriY-y1;
		var len1=Math.sqrt(dx*dx+dy*dy);
		if (len1 <=0.000001){
			return;
		};
		var ndx=dx / len1;
		var ndy=dy / len1;
		var dx2=x2-x1;
		var dy2=y2-y1;
		var len22=dx2*dx2+dy2*dy2;
		var len2=Math.sqrt(len22);
		if (len2 <=0.000001){
			return;
		};
		var ndx2=dx2 / len2;
		var ndy2=dy2 / len2;
		var odx=ndx+ndx2;
		var ody=ndy+ndy2;
		var olen=Math.sqrt(odx*odx+ody*ody);
		if (olen <=0.000001){
			return;
		};
		var nOdx=odx / olen;
		var nOdy=ody / olen;
		var alpha=Math.acos(nOdx*ndx+nOdy*ndy);
		var halfAng=Math.PI / 2-alpha;
		len1=r / Math.tan(halfAng);
		var ptx1=len1*ndx+x1;
		var pty1=len1*ndy+y1;
		var orilen=Math.sqrt(len1 *len1+r *r);
		var orix=x1+nOdx*orilen;
		var oriy=y1+nOdy*orilen;
		var ptx2=len1*ndx2+x1;
		var pty2=len1*ndy2+y1;
		var dir=ndx *ndy2-ndy *ndx2;
		var fChgAng=0;
		var sinx=0.0;
		var cosx=0.0;
		if (dir >=0){
			fChgAng=halfAng *2;
			var fda=fChgAng / WebGLContext2D.SEGNUM;
			sinx=Math.sin(fda);
			cosx=Math.cos(fda);
		}
		else {
			fChgAng=-halfAng *2;
			fda=fChgAng / WebGLContext2D.SEGNUM;
			sinx=Math.sin(fda);
			cosx=Math.cos(fda);
		};
		var lastx=this._path._lastOriX,lasty=this._path._lastOriY;
		var _x1=ptx1 ,_y1=pty1;
		if (Math.abs(_x1-this._path._lastOriX)>0.1 || Math.abs(_y1-this._path._lastOriY)>0.1){
			x=_x1;
			y=_y1;
			lastx=_x1;
			lasty=_y1;
			this._path.addPoint(x,y);
		};
		var cvx=ptx1-orix;
		var cvy=pty1-oriy;
		var tx=0.0;
		var ty=0.0;
		for (i=0;i < WebGLContext2D.SEGNUM;i++){
			var cx=cvx*cosx+cvy*sinx;
			var cy=-cvx*sinx+cvy*cosx;
			x=cx+orix;
			y=cy+oriy;
			if (Math.abs(lastx-x)>0.1 || Math.abs(lasty-y)>0.1){
				this._path.addPoint(x,y);
				lastx=x;
				lasty=y;
			}
			cvx=cx;
			cvy=cy;
		}
	}

	__proto.arc=function(cx,cy,r,startAngle,endAngle,counterclockwise,b){
		(counterclockwise===void 0)&& (counterclockwise=false);
		(b===void 0)&& (b=true);
		var a=0,da=0,hda=0,kappa=0;
		var dx=0,dy=0,x=0,y=0,tanx=0,tany=0;
		var px=0,py=0,ptanx=0,ptany=0;
		var i=0,ndivs=0,nvals=0;
		da=endAngle-startAngle;
		if (!counterclockwise){
			if (Math.abs(da)>=Math.PI *2){
				da=Math.PI *2;
				}else {
				while (da < 0.0){
					da+=Math.PI *2;
				}
			}
			}else {
			if (Math.abs(da)>=Math.PI *2){
				da=-Math.PI *2;
				}else {
				while (da > 0.0){
					da-=Math.PI *2;
				}
			}
		};
		var sx=this.getMatScaleX();
		var sy=this.getMatScaleY();
		var sr=r *(sx > sy?sx:sy);
		var cl=2 *Math.PI *sr;
		ndivs=(Math.max(cl / 10,10))|0;
		hda=(da / ndivs)/ 2.0;
		kappa=Math.abs(4 / 3 *(1-Math.cos(hda))/ Math.sin(hda));
		if (counterclockwise)
			kappa=-kappa;
		nvals=0;
		var tPath=this._getPath();
		var _x1=NaN,_y1=NaN;
		for (i=0;i <=ndivs;i++){
			a=startAngle+da *(i / ndivs);
			dx=Math.cos(a);
			dy=Math.sin(a);
			x=cx+dx *r;
			y=cy+dy *r;
			if (x !=this._path._lastOriX || y !=this._path._lastOriY){
				tPath.addPoint(x,y);
			}
		}
		dx=Math.cos(endAngle);
		dy=Math.sin(endAngle);
		x=cx+dx *r;
		y=cy+dy *r;
		if (x !=this._path._lastOriX|| y !=this._path._lastOriY){
			tPath.addPoint(x,y);
		}
	}

	__proto.quadraticCurveTo=function(cpx,cpy,x,y){
		var tBezier=Bezier.I;
		var tResultArray=[];
		var tArray=tBezier.getBezierPoints([this._path._lastOriX,this._path._lastOriY,cpx,cpy,x,y],30,2);
		for (var i=0,n=tArray.length / 2;i < n;i++){
			this.lineTo(tArray[i *2],tArray[i *2+1]);
		}
		this.lineTo(x,y);
	}

	//TODO:coverage
	__proto.rect=function(x,y,width,height){
		this._other=this._other.make();
		this._other.path || (this._other.path=new Path());
		this._other.path.rect(x,y,width,height);
	}

	/**
	*把颜色跟当前设置的alpha混合
	*@return
	*/
	__proto.mixRGBandAlpha=function(color){
		return this._mixRGBandAlpha(color,this._shader2D.ALPHA);
	}

	__proto._mixRGBandAlpha=function(color,alpha){
		var a=((color & 0xff000000)>>> 24);
		if (a !=0){
			a*=alpha;
			}else {
			a=alpha*255;
		}
		return (color & 0x00ffffff)| (a << 24);
	}

	__proto.strokeRect=function(x,y,width,height,parameterLineWidth){
		var tW=parameterLineWidth *0.5;
		if (this.lineWidth > 0){
			var rgba=this.mixRGBandAlpha(this.strokeStyle._color.numColor);
			var hw=this.lineWidth / 2;
			this._fillRect(x-hw,y-hw,width+this.lineWidth,this.lineWidth,rgba);
			this._fillRect(x-hw,y-hw+height,width+this.lineWidth,this.lineWidth,rgba);
			this._fillRect(x-hw,y+hw,this.lineWidth,height-this.lineWidth,rgba);
			this._fillRect(x-hw+width,y+hw,this.lineWidth,height-this.lineWidth,rgba);
		}
	}

	//右
	__proto.clip=function(){}
	//TODO:coverage
	__proto.drawParticle=function(x,y,pt){
		pt.x=x;
		pt.y=y;
		this._submits[this._submits._length++]=pt;
	}

	__proto._getPath=function(){
		return this._path || (this._path=new Path());
	}

	/*,_shader2D.ALPHA=1*/
	__getset(0,__proto,'globalCompositeOperation',function(){
		return BlendMode.NAMES[this._nBlendType];
		},function(value){
		var n=BlendMode.TOINT[value];
		n==null || (this._nBlendType===n)|| (SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_GLOBALCOMPOSITEOPERATION*/0x10000,this,true),this._curSubmit=Submit.RENDERBASE,this._nBlendType=n);
	});

	__getset(0,__proto,'strokeStyle',function(){
		return this._shader2D.strokeStyle;
		},function(value){
		this._shader2D.strokeStyle.equal(value)|| (SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_STROKESTYLE*/0x200,this._shader2D,false),this._shader2D.strokeStyle=DrawStyle.create(value),this._submitKey.other=-this._shader2D.strokeStyle.toInt());
	});

	__getset(0,__proto,'globalAlpha',function(){
		return this._shader2D.ALPHA;
		},function(value){
		value=Math.floor(value *1000)/ 1000;
		if (value !=this._shader2D.ALPHA){
			SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_ALPHA*/0x1,this._shader2D,false);
			this._shader2D.ALPHA=value;
		}
	});

	/**
	*当前canvas请求保存渲染结果。
	*实现：
	*如果value==true，就要给_target赋值
	*@param value {Boolean}
	*/
	__getset(0,__proto,'asBitmap',null,function(value){
		if (value){
			this._targets || (this._targets=new RenderTexture2D(this._width,this._height,/*laya.webgl.resource.BaseTexture.FORMAT_R8G8B8A8*/1,-1));
			if (!this._width || !this._height)
				throw Error("asBitmap no size!");
			}else {
			this._targets && this._targets.destroy();
			this._targets=null;
		}
	});

	__getset(0,__proto,'fillStyle',function(){
		return this._shader2D.fillStyle;
		},function(value){
		if (!this._shader2D.fillStyle.equal(value)){
			SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_FILESTYLE*/0x2,this._shader2D,false);
			this._shader2D.fillStyle=DrawStyle.create(value);
			this._submitKey.other=-this._shader2D.fillStyle.toInt();
		}
	});

	__getset(0,__proto,'textAlign',function(){
		return this._other.textAlign;
		},function(value){
		(this._other.textAlign===value)|| (this._other=this._other.make(),SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_TEXTALIGN*/0x8000,this._other,false),this._other.textAlign=value);
	});

	__getset(0,__proto,'lineWidth',function(){
		return this._other.lineWidth;
		},function(value){
		(this._other.lineWidth===value)|| (this._other=this._other.make(),SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_LINEWIDTH*/0x100,this._other,false),this._other.lineWidth=value);
	});

	__getset(0,__proto,'textBaseline',function(){
		return this._other.textBaseline;
		},function(value){
		(this._other.textBaseline===value)|| (this._other=this._other.make(),SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_TEXTBASELINE*/0x4000,this._other,false),this._other.textBaseline=value);
	});

	__getset(0,__proto,'font',null,function(str){
		this._other=this._other.make();
		SaveBase.save(this,/*laya.webgl.canvas.save.SaveBase.TYPE_FONT*/0x8,this._other,false);
	});

	//注意这个是对外接口
	__getset(0,__proto,'canvas',function(){
		return this._canvas;
	});

	WebGLContext2D.__init__=function(){
		ContextParams.DEFAULT=new ContextParams();
		WebGLCacheAsNormalCanvas;
	}

	WebGLContext2D.set2DRenderConfig=function(){
		var gl=LayaGL.instance;
		WebGLContext.setBlend(gl,true);
		WebGLContext.setBlendFunc(gl,/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303);
		WebGLContext.setDepthTest(gl,false);
		WebGLContext.setCullFace(gl,false);
		WebGLContext.setDepthMask(gl,true);
		WebGLContext.setFrontFace(gl,/*laya.webgl.WebGLContext.CCW*/0x0901);
		gl.viewport(0,0,RenderState2D.width,RenderState2D.height);
	}

	WebGLContext2D._tempPoint=new Point();
	WebGLContext2D._SUBMITVBSIZE=32000;
	WebGLContext2D._MAXSIZE=99999999;
	WebGLContext2D._MAXVERTNUM=65535;
	WebGLContext2D.MAXCLIPRECT=new Rectangle(0,0,99999999,99999999);
	WebGLContext2D._COUNT=0;
	WebGLContext2D._tmpMatrix=new Matrix();
	WebGLContext2D.SEGNUM=32;
	WebGLContext2D._contextcount=0;
	WebGLContext2D._clipID_Gen=0;
	WebGLContext2D.defTexture=null;
	__static(WebGLContext2D,
	['_drawStyleTemp',function(){return this._drawStyleTemp=new DrawStyle(null);},'_keyMap',function(){return this._keyMap=new StringKey();},'_drawTexToDrawTri_Vert',function(){return this._drawTexToDrawTri_Vert=new Float32Array(8);},'_drawTexToDrawTri_Index',function(){return this._drawTexToDrawTri_Index=new Uint16Array([0,1,2,0,2,3]);},'_textRender',function(){return this._textRender=TextRender.useOldCharBook?new CharBook():(new TextRender());}
	]);
	WebGLContext2D.__init$=function(){
		/*下面的方式是有bug的。canvas是直接save，restore，现在是为了优化，但是有bug，所以先不重载了
		override public function saveTransform(matrix:Matrix):void {
			this._curMat.copyTo(matrix);
		}
		override public function restoreTransform(matrix:Matrix):void {
			matrix.copyTo(this._curMat);
		}
		override public function transformByMatrix(matrix:Matrix,tx:Number,ty:Number):void {
			var mat:Matrix=_curMat;
			matrix.setTranslate(tx,ty);
			Matrix.mul(matrix,mat,mat);
			matrix.setTranslate(0,0);
			mat._bTransform=true;
		}
		*/
		
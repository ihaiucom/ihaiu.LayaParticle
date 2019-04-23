//class laya.layagl.ConchSpriteAdpt extends laya.display.Node
var ConchSpriteAdpt=(function(_super){
	function ConchSpriteAdpt(){
		//this._drawSimpleImageData=null;
		//this._drawCanvasParamData=null;
		//this._drawSimpleRectParamData=null;
		//this._drawRectBorderParamData=null;
		//this._canvasBeginCmd=null;
		//this._canvasEndCmd=null;
		this._customRenderCmd=null;
		this._customCmds=null;
		//this._callbackFuncObj=null;
		//this._filterBeginCmd=null;
		//this._filterEndCmd=null;
		//this._maskCmd=null;
		//this._dataf32=null;
		//this._datai32=null;
		/**@private */
		this._x=0;
		/**@private */
		this._y=0;
		/**@private */
		this._renderType=0;
		this._bRepaintCanvas=false;
		this._lastContext=null;
		ConchSpriteAdpt.__super.call(this);
	}

	__class(ConchSpriteAdpt,'laya.layagl.ConchSpriteAdpt',_super);
	var __proto=ConchSpriteAdpt.prototype;
	__proto.createData=function(){
		var nSize=/*laya.display.SpriteConst.POSSIZE*/77 *4;
		this._conchData=/*__JS__ */new ParamData(nSize,false);
		this._datai32=this._conchData._int32Data;
		this._dataf32=this._conchData._float32Data;
		this._dataf32[ /*laya.display.SpriteConst.POSREPAINT*/4]=1;
		this._datai32[ /*laya.display.SpriteConst.POSFRAMECOUNT*/3]=-1;
		this._datai32[ /*laya.display.SpriteConst.POSBUFFERBEGIN*/1]=0;
		this._datai32[ /*laya.display.SpriteConst.POSBUFFEREND*/2]=0;
		this._datai32[ /*laya.display.SpriteConst.POSCOLOR*/22]=0xFFFFFFFF;
		this._datai32[ /*laya.display.SpriteConst.POSVISIBLE_NATIVE*/5]=1;
		this._dataf32[ /*laya.display.SpriteConst.POSPIVOTX*/8]=0;
		this._dataf32[ /*laya.display.SpriteConst.POSPIVOTY*/9]=0;
		this._dataf32[ /*laya.display.SpriteConst.POSSCALEX*/10]=1;
		this._dataf32[ /*laya.display.SpriteConst.POSSCALEY*/11]=1;
		this._dataf32[ /*laya.display.SpriteConst.POSMATRIX*/16]=1;
		this._dataf32[ /*laya.display.SpriteConst.POSMATRIX*/16+1]=0;
		this._dataf32[ /*laya.display.SpriteConst.POSMATRIX*/16+2]=0;
		this._dataf32[ /*laya.display.SpriteConst.POSMATRIX*/16+3]=1;
		this._dataf32[ /*laya.display.SpriteConst.POSMATRIX*/16+4]=0;
		this._dataf32[ /*laya.display.SpriteConst.POSMATRIX*/16+5]=0;
		this._datai32[ /*laya.display.SpriteConst.POSSIM_TEXTURE_ID*/24]=-1;
		this._datai32[ /*laya.display.SpriteConst.POSSIM_TEXTURE_DATA*/25]=-1;
		this._datai32[ /*laya.display.SpriteConst.POSCUSTOM*/27]=-1;
		this._datai32[ /*laya.display.SpriteConst.POSCLIP*/28]=0;
		this._datai32[ /*laya.display.SpriteConst.POSCLIP*/28+1]=0;
		this._datai32[ /*laya.display.SpriteConst.POSCLIP*/28+2]=1000000;
		this._datai32[ /*laya.display.SpriteConst.POSCLIP*/28+3]=1000000;
		this._datai32[ /*laya.display.SpriteConst.POSCACHE_CANVAS_SKIP_PAINT_FLAG*/63]=0;
		this._datai32[ /*laya.display.SpriteConst.POSBLEND_SRC*/71]=/*laya.webgl.WebGLContext.ONE*/1;
		this._datai32[ /*laya.display.SpriteConst.POSBLEND_DEST*/72]=/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303;
		this._datai32[ /*laya.display.SpriteConst.POSGRAPHICS_CALLBACK_FUN_ID*/68]=-1;
		this._renderType |=/*laya.display.SpriteConst.TRANSFORM*/0x02;
		this._setRenderType(this._renderType);
	}

	//TODO:coverage
	__proto._createTransform=function(){
		return MatrixConch.create(new Float32Array(6));
	}

	//TODO:coverage
	__proto._setTransform=function(value){
		var f32=this._conchData._float32Data;
		f32[ /*laya.display.SpriteConst.POSTRANSFORM_FLAG*/15]=0;
		f32[ /*laya.display.SpriteConst.POSMATRIX*/16]=value.a;
		f32[ /*laya.display.SpriteConst.POSMATRIX*/16+1]=value.b;
		f32[ /*laya.display.SpriteConst.POSMATRIX*/16+2]=value.c;
		f32[ /*laya.display.SpriteConst.POSMATRIX*/16+3]=value.d;
		f32[ /*laya.display.SpriteConst.POSMATRIX*/16+4]=value.tx;
		f32[ /*laya.display.SpriteConst.POSMATRIX*/16+5]=value.ty;
	}

	/**@private */
	__proto._setTranformChange=function(){
		(this)._tfChanged=true;
		(this).parentRepaint(/*laya.display.SpriteConst.REPAINT_CACHE*/0x02);
	}

	//TODO:coverage
	__proto._setGraphics=function(value){
		this._datai32[ /*laya.display.SpriteConst.POSGRAPICS*/23]=(value)._commandEncoder.getPtrID();
	}

	__proto._setGraphicsCallBack=function(){
		if (!this._callbackFuncObj){
			this._callbackFuncObj=/*__JS__ */new CallbackFuncObj();
		}
		this._datai32[ /*laya.display.SpriteConst.POSCALLBACK_OBJ_ID*/54]=this._callbackFuncObj.id;
		this._callbackFuncObj.addCallbackFunc(5,(this.updateParticleFromNative).bind(this));
		this._datai32[ /*laya.display.SpriteConst.POSGRAPHICS_CALLBACK_FUN_ID*/68]=5;
	}

	//TODO:coverage
	__proto._setCacheAs=function(value){
		DrawCanvasCmdNative.createCommandEncoder();
		if (!this._drawCanvasParamData){
			this._drawCanvasParamData=/*__JS__ */new ParamData(33 *4,true);
		}
		if (!this._callbackFuncObj){
			this._callbackFuncObj=/*__JS__ */new CallbackFuncObj();
		}
		if (!this._canvasBeginCmd){
			this._canvasBeginCmd=LayaGL.instance.createCommandEncoder(128,64,false);
		}
		if (!this._canvasEndCmd){
			this._canvasEndCmd=LayaGL.instance.createCommandEncoder(128,64,false);
		}
		this._datai32[ /*laya.display.SpriteConst.POSCALLBACK_OBJ_ID*/54]=this._callbackFuncObj.id;
		this._callbackFuncObj.addCallbackFunc(1,(this.canvasBeginRenderFromNative).bind(this));
		this._callbackFuncObj.addCallbackFunc(2,(this.canvasEndRenderFromNative).bind(this));
		this._datai32[ /*laya.display.SpriteConst.POSCANVAS_CALLBACK_FUN_ID*/56]=1;
		this._datai32[ /*laya.display.SpriteConst.POSCANVAS_CALLBACK_END_FUN_ID*/57]=2;
		this._datai32[ /*laya.display.SpriteConst.POSCANVAS_BEGIN_CMD_ID*/58]=this._canvasBeginCmd.getPtrID();
		this._datai32[ /*laya.display.SpriteConst.POSCANVAS_END_CMD_ID*/59]=this._canvasEndCmd.getPtrID();
		this._datai32[ /*laya.display.SpriteConst.POSCANVAS_DRAW_TARGET_CMD_ID*/60]=DrawCanvasCmdNative._DRAW_CANVAS_CMD_ENCODER_.getPtrID();
		this._datai32[ /*laya.display.SpriteConst.POSCANVAS_DRAW_TARGET_PARAM_ID*/61]=this._drawCanvasParamData.getPtrID();
	}

	//TODO:coverage
	__proto._setX=function(value){
		this._x=this._dataf32[ /*laya.display.SpriteConst.POSX*/6]=value;
		this._dataf32[ /*laya.display.SpriteConst.POSTRANSFORM_FLAG*/15]=1.0;
	}

	//TODO:coverage
	__proto._setY=function(value){
		this._y=this._dataf32[ /*laya.display.SpriteConst.POSY*/7]=value;
		this._dataf32[ /*laya.display.SpriteConst.POSTRANSFORM_FLAG*/15]=1.0;
	}

	//TODO:coverage
	__proto._setWidth=function(texture,width){
		if (texture && texture.getIsReady()){
			this._setTextureEx(texture,true);
		}
	}

	//TODO:coverage
	__proto._setHeight=function(texture,height){
		if (texture && texture.getIsReady()){
			this._setTextureEx(texture,true);
		}
	}

	//TODO:coverage
	__proto._setPivotX=function(value){
		this._renderType |=/*laya.display.SpriteConst.TRANSFORM*/0x02;
		this._dataf32[ /*laya.display.SpriteConst.POSPIVOTX*/8]=value;
		this._dataf32[ /*laya.display.SpriteConst.POSTRANSFORM_FLAG*/15]=1.0;
	}

	//TODO:coverage
	__proto._getPivotX=function(){
		return this._dataf32[ /*laya.display.SpriteConst.POSPIVOTX*/8];
	}

	//TODO:coverage
	__proto._setPivotY=function(value){
		this._renderType |=/*laya.display.SpriteConst.TRANSFORM*/0x02;
		this._dataf32[ /*laya.display.SpriteConst.POSPIVOTY*/9]=value;
		this._dataf32[ /*laya.display.SpriteConst.POSTRANSFORM_FLAG*/15]=1.0;
	}

	//TODO:coverage
	__proto._getPivotY=function(){
		return this._dataf32[ /*laya.display.SpriteConst.POSPIVOTY*/9];
	}

	//TODO:coverage
	__proto._setAlpha=function(value){
		var style=/*__JS__ */this.getStyle();
		style.alpha=value;
		value=value > 1 ? 1 :value;
		value=value < 0 ? 0 :value;
		var nColor=this._datai32[ /*laya.display.SpriteConst.POSCOLOR*/22];
		var nAlpha=nColor >> 24;
		nAlpha=value *255;
		nColor=(nColor & 0xffffff)| nAlpha<<24;
		this._datai32[ /*laya.display.SpriteConst.POSCOLOR*/22]=nColor;
		if (value!==1)
			this._renderType |=/*laya.display.SpriteConst.ALPHA*/0x01;
		else
		this._renderType &=~ /*laya.display.SpriteConst.ALPHA*/0x01;
		this._setRenderType(this._renderType);
		this.parentRepaint();
	}

	//TODO:coverage
	__proto._setRenderType=function(type){
		this._datai32[ /*laya.display.SpriteConst.POSRENDERTYPE*/0]=type;
		if (!LayaGLTemplate.GLS[type]){
			LayaGLTemplate.createByRenderType(type);
			LayaGLTemplate.createByRenderTypeEnd(type);
		}
	}

	__proto.parentRepaint=function(){}
	__proto._getAlpha=function(){
		return (this._datai32[ /*laya.display.SpriteConst.POSCOLOR*/22]>>>24)/255;
	}

	__proto._setScaleX=function(value){
		(this)._style.scaleX=this._dataf32[ /*laya.display.SpriteConst.POSSCALEX*/10]=value;
		this._dataf32[ /*laya.display.SpriteConst.POSTRANSFORM_FLAG*/15]=1.0;
	}

	__proto._setScaleY=function(value){
		(this)._style.scaleY=this._dataf32[ /*laya.display.SpriteConst.POSSCALEY*/11]=value;
		this._dataf32[ /*laya.display.SpriteConst.POSTRANSFORM_FLAG*/15]=1.0;
	}

	__proto._setSkewX=function(value){
		(this)._style.skewX=this._dataf32[ /*laya.display.SpriteConst.POSSKEWX*/12]=value;
		this._dataf32[ /*laya.display.SpriteConst.POSTRANSFORM_FLAG*/15]=1.0;
	}

	__proto._setSkewY=function(value){
		(this)._style.skewY=this._dataf32[ /*laya.display.SpriteConst.POSSKEWY*/13]=value;
		this._dataf32[ /*laya.display.SpriteConst.POSTRANSFORM_FLAG*/15]=1.0;
	}

	__proto._setRotation=function(value){
		(this)._style.rotation=this._dataf32[ /*laya.display.SpriteConst.POSROTATION*/14]=value;
		this._dataf32[ /*laya.display.SpriteConst.POSTRANSFORM_FLAG*/15]=1.0;
	}

	__proto._setBgStyleColor=function(x,y,width,height,fillColor){
		var _fb=null;
		var _i32b=null;
		if (!this._drawSimpleRectParamData){
			this._drawSimpleRectParamData=/*__JS__ */new ParamData(26 *4,true);
		}
		_fb=this._drawSimpleRectParamData._float32Data;
		_i32b=this._drawSimpleRectParamData._int32Data;
		var c1=ColorUtils.create(fillColor);
		var nFillColor=c1.numColor;
		_i32b[0]=1;
		_i32b[1]=24 *4;
		var ix=2;
		_fb[ix++]=x;_fb[ix++]=y;_fb[ix++]=0;_fb[ix++]=0;_i32b[ix++]=nFillColor;_fb[ix++]=0xffffffff;
		_fb[ix++]=x+width;_fb[ix++]=y;_fb[ix++]=0;_fb[ix++]=0;_i32b[ix++]=nFillColor;_fb[ix++]=0xffffffff;
		_fb[ix++]=x+width;_fb[ix++]=y+height;_fb[ix++]=0;_fb[ix++]=0;_i32b[ix++]=nFillColor;_fb[ix++]=0xffffffff;
		_fb[ix++]=x;_fb[ix++]=y+height;_fb[ix++]=0;_fb[ix++]=0;_i32b[ix++]=nFillColor;_fb[ix++]=0xffffffff;
		this._datai32[ /*laya.display.SpriteConst.POSSIM_RECT_FILL_DATA*/74]=this._drawSimpleRectParamData.getPtrID();
		LayaGL.syncBufferToRenderThread(this._drawSimpleRectParamData);
		this._datai32[ /*laya.display.SpriteConst.POSSIM_RECT_FILL_CMD*/73]=LayaNative2D._SIMPLE_RECT_CMDENCODER_.getPtrID();
	}

	__proto._setBorderStyleColor=function(x,y,width,height,fillColor,borderWidth){
		var _fb=null;
		var _i32b=null;
		if (!this._drawRectBorderParamData){
			this._drawRectBorderParamData=/*__JS__ */new ParamData(59 *4,true);
		}
		_fb=this._drawRectBorderParamData._float32Data;
		_i32b=this._drawRectBorderParamData._int32Data;
		var _linePoints=[];
		var _line_ibArray=[];
		var _line_vbArray=[];
		_linePoints.push(x);_linePoints.push(y);
		_linePoints.push(x+width);_linePoints.push(y);
		_linePoints.push(x+width);_linePoints.push(y+height);
		_linePoints.push(x);_linePoints.push(y+height);
		_linePoints.push(x);_linePoints.push(y-borderWidth / 2)
		BasePoly.createLine2(_linePoints,_line_ibArray,borderWidth,0,_line_vbArray,false);
		var _line_vertNum=_linePoints.length;
		_fb=this._drawRectBorderParamData._float32Data;
		_i32b=this._drawRectBorderParamData._int32Data;
		var _i16b=this._drawRectBorderParamData._int16Data;
		var c1=ColorUtils.create(fillColor);
		var nLineColor=c1.numColor;
		_i32b[0]=0;
		_i32b[1]=30 *4;
		_i32b[2]=0;
		_i32b[3]=_line_ibArray.length *2;
		_i32b[4]=0;
		var ix=5;
		for (var i=0;i < _line_vertNum;i++){
			_fb[ix++]=_line_vbArray[i *2];_fb[ix++]=_line_vbArray[i *2+1];_i32b[ix++]=nLineColor;
		}
		ix=35 *2;
		for (var ii=0;ii < _line_ibArray.length;ii++){
			_i16b[ix++]=_line_ibArray[ii];
		}
		this._datai32[ /*laya.display.SpriteConst.POSSIM_RECT_STROKE_DATA*/76]=this._drawRectBorderParamData.getPtrID();
		LayaGL.syncBufferToRenderThread(this._drawRectBorderParamData);
		this._datai32[ /*laya.display.SpriteConst.POSSIM_RECT_STROKE_CMD*/75]=LayaNative2D._RECT_BORDER_CMD_ENCODER_.getPtrID();
	}

	__proto._setTextureEx=function(value,isloaded){
		var _fb=null;
		var _i32b=null;
		if (!this._drawSimpleImageData){
			this._drawSimpleImageData=/*__JS__ */new ParamData(29 *4,true);
			_fb=this._drawSimpleImageData._float32Data;
			_i32b=this._drawSimpleImageData._int32Data;
			_i32b[0]=3;
			_i32b[1]=/*laya.webgl.WebGLContext.TEXTURE0*/0x84C0;
			_i32b[2]=isloaded?value.bitmap._glTexture.id:0;
			_i32b[3]=1;
			_i32b[4]=24 *4;
			var uv=value.uv;
			_fb[5]=0;_fb[6]=0;_fb[7]=uv[0];_fb[8]=uv[1];_i32b[9]=0xffffffff;_i32b[10]=0xffffffff;
			_fb[11]=0;_fb[12]=0;_fb[13]=uv[2];_fb[14]=uv[3];_i32b[15]=0xffffffff;_i32b[16]=0xffffffff;
			_fb[17]=0;_fb[18]=0;_fb[19]=uv[4];_fb[20]=uv[5];_i32b[21]=0xffffffff;_i32b[22]=0xffffffff;
			_fb[23]=0;_fb[24]=0;_fb[25]=uv[6];_fb[26]=uv[7];_i32b[27]=0xffffffff;_i32b[28]=0xffffffff;
		}
		_fb=this._drawSimpleImageData._float32Data;
		_i32b=this._drawSimpleImageData._int32Data;
		_i32b[2]=isloaded?value.bitmap._glTexture.id:0;
		var w=isloaded?value.width:0;
		var h=isloaded?value.height:0;
		var spW=(this)._width;
		var spH=(this)._height;
		w=spW > 0 ? spW :w;
		h=spH > 0 ? spH :h;
		_fb[11]=_fb[17]=w;
		_fb[18]=_fb[24]=h;
		var nPtrID=this._drawSimpleImageData.getPtrID();
		this._datai32[ /*laya.display.SpriteConst.POSSIM_TEXTURE_DATA*/25]=nPtrID;
		LayaGL.syncBufferToRenderThread(this._drawSimpleImageData);
		this._datai32[ /*laya.display.SpriteConst.POSSIM_TEXTURE_ID*/24]=LayaNative2D._SIMPLE_TEXTURE_CMDENCODER_.getPtrID();
	}

	//TODO:coverage
	__proto._setTexture=function(value){
		if (!value)return;
		if (value.getIsReady()){
			this._setTextureEx(value,true);
		}
		else{
			this._setTextureEx(value,false);
			value.on(/*laya.events.Event.READY*/"ready",this,this._setTextureEx,[value,true]);
		}
	}

	//TODO:coverage
	__proto._setCustomRender=function(){
		if (!this._callbackFuncObj){
			this._callbackFuncObj=/*__JS__ */new CallbackFuncObj();
		}
		this._customCmds=[];
		this._callbackFuncObj.addCallbackFunc(0,(this.customRenderFromNative).bind(this));
		this._customRenderCmd=LayaGL.instance.createCommandEncoder(128,64,true);
		this._datai32[ /*laya.display.SpriteConst.POSCALLBACK_OBJ_ID*/54]=this._callbackFuncObj.id;
		this._datai32[ /*laya.display.SpriteConst.POSCUSTOM_CALLBACK_FUN_ID*/55]=0;
		this._datai32[ /*laya.display.SpriteConst.POSCUSTOM*/27]=this._customRenderCmd.getPtrID();
	}

	//TODO:coverage
	__proto._setScrollRect=function(value){
		this._dataf32[ /*laya.display.SpriteConst.POSCLIP*/28]=0;
		this._dataf32[ /*laya.display.SpriteConst.POSCLIP*/28+1]=0;
		this._dataf32[ /*laya.display.SpriteConst.POSCLIP*/28+2]=value.width;
		this._dataf32[ /*laya.display.SpriteConst.POSCLIP*/28+3]=value.height;
		this._dataf32[ /*laya.display.SpriteConst.POSCLIP_NEG_POS*/32]=-value.x;
		this._dataf32[ /*laya.display.SpriteConst.POSCLIP_NEG_POS*/32+1]=-value.y;
		value["onPropertyChanged"]=(this._setScrollRect).bind(this);
	}

	//TODO:coverage
	__proto._setColorFilter=function(value){
		if (!this._callbackFuncObj){
			this._callbackFuncObj=/*__JS__ */new CallbackFuncObj();
		}
		if (!this._filterBeginCmd){
			this._filterBeginCmd=LayaGL.instance.createCommandEncoder(128,64,false);
		}
		if (!this._filterEndCmd){
			this._filterEndCmd=LayaGL.instance.createCommandEncoder(128,64,true);
		}
		this._datai32[ /*laya.display.SpriteConst.POSCALLBACK_OBJ_ID*/54]=this._callbackFuncObj.id;
		this._callbackFuncObj.addCallbackFunc(3,(this.filterBeginRenderFromNative).bind(this));
		this._callbackFuncObj.addCallbackFunc(4,(this.filterEndRenderFromNative).bind(this));
		this._datai32[ /*laya.display.SpriteConst.POSFILTER_CALLBACK_FUN_ID*/65]=3;
		this._datai32[ /*laya.display.SpriteConst.POSFILTER_BEGIN_CMD_ID*/64]=this._filterBeginCmd.getPtrID();
		this._datai32[ /*laya.display.SpriteConst.POSFILTER_END_CALLBACK_FUN_ID*/67]=4;
		this._datai32[ /*laya.display.SpriteConst.POSFILTER_END_CMD_ID*/66]=this._filterEndCmd.getPtrID();
	}

	__proto._setMask=function(value){
		value.cacheAs="bitmap";
		if (!this._callbackFuncObj){
			this._callbackFuncObj=/*__JS__ */new CallbackFuncObj();
		}
		if (!this._maskCmd){
			this._maskCmd=LayaGL.instance.createCommandEncoder(128,64,false);
		}
		this._datai32[ /*laya.display.SpriteConst.POSCALLBACK_OBJ_ID*/54]=this._callbackFuncObj.id;
		this._callbackFuncObj.addCallbackFunc(6,(this.maskRenderFromNative).bind(this));
		this._datai32[ /*laya.display.SpriteConst.POSMASK_CALLBACK_FUN_ID*/69]=6;
		this._datai32[ /*laya.display.SpriteConst.POSMASK_CMD_ID*/70]=this._maskCmd.getPtrID();
	}

	//TODO:coverage
	__proto._adjustTransform=function(){
		var m=(this)._transform || ((this)._transform=this._createTransform());
		m._bTransform=true;
		LayaGL.instance.calcMatrixFromScaleSkewRotation(this._conchData._data["_ptrID"],/*laya.display.SpriteConst.POSTRANSFORM_FLAG*/15*4,/*laya.display.SpriteConst.POSMATRIX*/16*4,/*laya.display.SpriteConst.POSX*/6*4,/*laya.display.SpriteConst.POSY*/7*4,/*laya.display.SpriteConst.POSPIVOTX*/8*4,
		/*laya.display.SpriteConst.POSPIVOTY*/9*4,/*laya.display.SpriteConst.POSSCALEX*/10*4,/*laya.display.SpriteConst.POSSCALEY*/11*4,/*laya.display.SpriteConst.POSSKEWX*/12*4,/*laya.display.SpriteConst.POSSKEWY*/13*4,/*laya.display.SpriteConst.POSROTATION*/14*4);
		var f32=this._conchData._float32Data;
		m.a=f32[ /*laya.display.SpriteConst.POSMATRIX*/16];
		m.b=f32[ /*laya.display.SpriteConst.POSMATRIX*/16+1];
		m.c=f32[ /*laya.display.SpriteConst.POSMATRIX*/16+2];
		m.d=f32[ /*laya.display.SpriteConst.POSMATRIX*/16+3];
		m.tx=0;
		m.ty=0;
		return m;
	}

	__proto._setBlendMode=function(value){
		switch(value){
			case /*laya.webgl.canvas.BlendMode.NORMAL*/"normal":
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_SRC*/71]=/*laya.webgl.WebGLContext.ONE*/1;
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_DEST*/72]=/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303;
				break ;
			case /*laya.webgl.canvas.BlendMode.ADD*/"add":
			case /*laya.webgl.canvas.BlendMode.LIGHTER*/"lighter":
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_SRC*/71]=/*laya.webgl.WebGLContext.ONE*/1;
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_DEST*/72]=/*laya.webgl.WebGLContext.DST_ALPHA*/0x0304;
				break ;
			case /*laya.webgl.canvas.BlendMode.MULTIPLY*/"multiply":
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_SRC*/71]=/*laya.webgl.WebGLContext.DST_COLOR*/0x0306;
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_DEST*/72]=/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303;
				break ;
			case /*laya.webgl.canvas.BlendMode.SCREEN*/"screen":
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_SRC*/71]=/*laya.webgl.WebGLContext.ONE*/1;
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_DEST*/72]=/*laya.webgl.WebGLContext.ONE*/1;
				break ;
			case /*laya.webgl.canvas.BlendMode.OVERLAY*/"overlay":
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_SRC*/71]=/*laya.webgl.WebGLContext.ONE*/1;
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_DEST*/72]=/*laya.webgl.WebGLContext.ONE_MINUS_SRC_COLOR*/0x0301;
				break ;
			case /*laya.webgl.canvas.BlendMode.LIGHT*/"light":
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_SRC*/71]=/*laya.webgl.WebGLContext.ONE*/1;
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_DEST*/72]=/*laya.webgl.WebGLContext.ONE*/1;
				break ;
			case /*laya.webgl.canvas.BlendMode.MASK*/"mask":
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_SRC*/71]=/*laya.webgl.WebGLContext.ZERO*/0;
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_DEST*/72]=/*laya.webgl.WebGLContext.SRC_ALPHA*/0x0302;
				break ;
			case /*laya.webgl.canvas.BlendMode.DESTINATIONOUT*/"destination-out":
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_SRC*/71]=/*laya.webgl.WebGLContext.ZERO*/0;
				this._datai32[ /*laya.display.SpriteConst.POSBLEND_DEST*/72]=/*laya.webgl.WebGLContext.ZERO*/0;
				break ;
			default :
				alert("_setBlendMode Unknown type");
				break ;
			}
	}

	//TODO:coverage
	__proto.customRenderFromNative=function(){
		var context=LayaGL.instance.getCurrentContext();
		this._customRenderCmd.beginEncoding();
		this._customRenderCmd.clearEncoding();
		context["_commandEncoder"]=this._customRenderCmd;
		context["_customCmds"]=this._customCmds;
		for (var i=0,n=this._customCmds.length;i < n;i++){
			this._customCmds[i].recover();
		}
		this._customCmds.length=0;
		(this).customRender(context,0,0);
		this._customRenderCmd.endEncoding();
	}

	//TODO:coverage
	__proto.canvasBeginRenderFromNative=function(){
		var layagl=LayaGL.instance;
		var htmlCanvas=null;
		var htmlContext=null;
		var cacheStyle=(this)._cacheStyle;
		if (cacheStyle.canvas && this._datai32[ /*laya.display.SpriteConst.POSREPAINT*/4]==0){
			htmlCanvas=cacheStyle.canvas;
			if (this._bRepaintCanvas !=false){
				this.setChildrenNativeVisible(false);
				this._bRepaintCanvas=false;
			}
			this._datai32[ /*laya.display.SpriteConst.POSCACHE_CANVAS_SKIP_PAINT_FLAG*/63]=1;
		}
		else{
			this._canvasBeginCmd.beginEncoding();
			this._canvasBeginCmd.clearEncoding();
			htmlCanvas=laya.layagl.ConchSpriteAdpt.buildCanvas((this),0,0);
			if (htmlCanvas){
				this._datai32[ /*laya.display.SpriteConst.POSCACHE_CANVAS_SKIP_PAINT_FLAG*/63]=0;
				this._lastContext=layagl.getCurrentContext();
				htmlContext=htmlCanvas.context;
				var target=htmlContext._targets;
				DrawCanvasCmdNative.setParamData(this._drawCanvasParamData,target,-/*laya.display.css.CacheStyle.CANVAS_EXTEND_EDGE*/16,-/*laya.display.css.CacheStyle.CANVAS_EXTEND_EDGE*/16,target.width,target.height);
				layagl.setCurrentContext(htmlContext);
				htmlContext.beginRT();
				layagl.save();
				ConchSpriteAdpt._tempFloatArrayMatrix[0]=1;ConchSpriteAdpt._tempFloatArrayMatrix[1]=0;ConchSpriteAdpt._tempFloatArrayMatrix[2]=0;ConchSpriteAdpt._tempFloatArrayMatrix[3]=1;
				ConchSpriteAdpt._tempFloatArrayMatrix[4]=/*laya.display.css.CacheStyle.CANVAS_EXTEND_EDGE*/16;ConchSpriteAdpt._tempFloatArrayMatrix[5]=/*laya.display.css.CacheStyle.CANVAS_EXTEND_EDGE*/16;
				layagl.setGlobalValue(LayaNative2D.GLOBALVALUE_MATRIX32,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,ConchSpriteAdpt._tempFloatArrayMatrix);
				if (this._bRepaintCanvas !=true){
					this.setChildrenNativeVisible(true);
					this._bRepaintCanvas=true;
				}
			}
			this._canvasBeginCmd.endEncoding();
		}
	}

	//TODO:coverage
	__proto.setChildrenNativeVisible=function(visible){
		var childs=this._children,ele;
		var n=childs.length;
		for (var i=0;i < n;++i){
			ele=childs[i];
			ele._datai32[ /*laya.display.SpriteConst.POSVISIBLE_NATIVE*/5]=visible?1:0;
			ele.setChildrenNativeVisible(visible);
		}
	}

	//TODO:coverage
	__proto.canvasEndRenderFromNative=function(){
		var layagl=LayaGL.instance;
		this._canvasEndCmd.beginEncoding();
		this._canvasEndCmd.clearEncoding();
		if (this._bRepaintCanvas){
			var context=LayaGL.instance.getCurrentContext();
			layagl.restore();
			layagl.setCurrentContext(this._lastContext);
			layagl.commitContextToGPU(context);
			context.endRT();
			layagl.blendFunc(/*laya.webgl.WebGLContext.ONE*/1,/*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303);
		}
		this._canvasEndCmd.endEncoding();
	}

	//TODO:coverage
	__proto.filterBeginRenderFromNative=function(){
		var sprite=this;
		var layagl=LayaGL.instance;
		this._filterBeginCmd.beginEncoding();
		this._filterBeginCmd.clearEncoding();
		var filters=(this)._getCacheStyle().filters;
		var len=filters.length;
		if (((filters[0])instanceof laya.filters.ColorFilter )){
			layagl.addShaderMacro(LayaNative2D.SHADER_MACRO_COLOR_FILTER);
			var colorFilter=filters[0];
			layagl.setGlobalValue(LayaNative2D.GLOBALVALUE_COLORFILTER_COLOR,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,colorFilter._mat);
			layagl.setGlobalValue(LayaNative2D.GLOBALVALUE_COLORFILTER_ALPHA,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,colorFilter._alpha);
		}
		else{
			var p=Point.TEMP;
			var mat=Matrix.create();
			var tPadding=0;
			var tHalfPadding=0;
			var tIsHaveGlowFilter=sprite._isHaveGlowFilter();
			if (tIsHaveGlowFilter){
				tPadding=50;
				tHalfPadding=25;
			};
			var b=new Rectangle();
			b.copyFrom((sprite).getSelfBounds());
			b.x+=(sprite).x;
			b.y+=(sprite).y;
			b.x-=(sprite).pivotX+4;
			b.y-=(sprite).pivotY+4;
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
			};
			var filterTarget=sprite._getCacheStyle().filterCache;
			if (filterTarget){
				WebGLRTMgr.releaseRT(filterTarget);
			}
			filterTarget=WebGLRTMgr.getRT(b.width,b.height);
			sprite._getCacheStyle().filterCache=filterTarget;
			ConchSpriteAdpt.useRenderTarget(filterTarget);
			ConchSpriteAdpt._tempFloatArrayMatrix[0]=1;ConchSpriteAdpt._tempFloatArrayMatrix[1]=0;ConchSpriteAdpt._tempFloatArrayMatrix[2]=0;ConchSpriteAdpt._tempFloatArrayMatrix[3]=1;
			ConchSpriteAdpt._tempFloatArrayMatrix[4]=sprite.x-tSX+tHalfPadding;
			ConchSpriteAdpt._tempFloatArrayMatrix[5]=sprite.y-tSY+tHalfPadding;
			layagl.setGlobalValue(LayaNative2D.GLOBALVALUE_MATRIX32,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,ConchSpriteAdpt._tempFloatArrayMatrix);
		}
		this._filterBeginCmd.endEncoding();
	}

	//TODO:coverage
	__proto.filterEndRenderFromNative=function(){
		this._filterEndCmd.beginEncoding();
		this._filterEndCmd.clearEncoding();
		var sprite=this;
		var layagl=LayaGL.instance;
		var filters=(this)._getCacheStyle().filters;
		if (((filters[0])instanceof laya.filters.ColorFilter )){
		}
		else{
			layagl.restore();
			var context=LayaGL.instance.getCurrentContext();
			var target=RenderTexture2D.currentActive;
			RenderTexture2D.popRT();
			if(/*__JS__ */filters[0] instanceof Laya.BlurFilter){
				layagl.addShaderMacro(LayaNative2D.SHADER_MACRO_BLUR_FILTER);
				var blurFilter=filters[0];
				ConchSpriteAdpt._tempFloatArrayBuffer2[0]=target.width;
				ConchSpriteAdpt._tempFloatArrayBuffer2[1]=target.height;
				layagl.setGlobalValue(LayaNative2D.GLOBALVALUE_BLURFILTER_BLURINFO,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,ConchSpriteAdpt._tempFloatArrayBuffer2);
				layagl.setGlobalValue(LayaNative2D.GLOBALVALUE_BLURFILTER_STRENGTH,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,blurFilter.getStrenth_sig2_2sig2_native());
				context.drawTarget(this._filterEndCmd,target,-4,-4,0,0);
			}
			else if(/*__JS__ */filters[0] instanceof Laya.GlowFilter){
				var w=target.width;
				var h=target.height;
				var target1=WebGLRTMgr.getRT(w,h);
				ConchSpriteAdpt.useRenderTarget(target1);
				layagl.addShaderMacro(LayaNative2D.SHADER_MACRO_GLOW_FILTER);
				var glowFilter=filters[0];
				var info2=glowFilter.getBlurInfo2Native();
				info2[0]=w;
				info2[1]=h;
				layagl.setGlobalValue(LayaNative2D.GLOBALVALUE_GLOWFILTER_COLOR,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,glowFilter.getColorNative());
				layagl.setGlobalValue(LayaNative2D.GLOBALVALUE_GLOWFILTER_BLURINFO1,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,glowFilter.getBlurInfo1Native());
				layagl.setGlobalValue(LayaNative2D.GLOBALVALUE_GLOWFILTER_BLURINFO2,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,info2);
				context.drawTarget(this._filterEndCmd,target,-/*laya.display.css.CacheStyle.CANVAS_EXTEND_EDGE*/16,-/*laya.display.css.CacheStyle.CANVAS_EXTEND_EDGE*/16,0,0);
				layagl.restore();
				RenderTexture2D.popRT();
				context.drawTarget(this._filterEndCmd,target1,-29,-29,0,0);
				context.drawTarget(this._filterEndCmd,target,-29,-29,0,0);
			}
		}
		this._filterEndCmd.endEncoding();
		LayaGL.syncBufferToRenderThread(this._filterEndCmd);
	}

	__proto.maskRenderFromNative=function(){
		this._maskCmd.beginEncoding();
		this._maskCmd.clearEncoding();
		var layagl=LayaGL.instance;
		var context=layagl.getCurrentContext();
		var mask=(this).mask;
		if (mask){
			if (mask._children.length > 0){
				layagl.blockStart(mask._conchData);
				(mask)._renderChilds(context);
				layagl.blockEnd(mask._conchData);
			}
			else{
				layagl.block(mask._conchData);
			}
		}
		ConchSpriteAdpt._tempInt1[0]=/*laya.webgl.WebGLContext.DST_ALPHA*/0x0304;
		layagl.setGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,ConchSpriteAdpt._tempInt1);
		ConchSpriteAdpt._tempInt1[0]=/*laya.webgl.WebGLContext.ZERO*/0;
		layagl.setGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,ConchSpriteAdpt._tempInt1);
		this._maskCmd.endEncoding();
	}

	__proto.updateParticleFromNative=function(){
		(this).tempCmd.updateParticle();
	}

	ConchSpriteAdpt.createMatrix=function(a,b,c,d,tx,ty,nums){
		(a===void 0)&& (a=1);
		(b===void 0)&& (b=0);
		(c===void 0)&& (c=0);
		(d===void 0)&& (d=1);
		(tx===void 0)&& (tx=0);
		(ty===void 0)&& (ty=0);
		return new MatrixConch(a,b,c,d,tx,ty,nums);
	}

	ConchSpriteAdpt.init=function(){
		ConchCmdReplace.__init__();
		ConchGraphicsAdpt.__init__();
		var spP=Sprite["prototype"];
		var mP=ConchSpriteAdpt["prototype"];
		var funs=[
		"_createTransform",
		"_setTransform",
		"_setGraphics",
		"_setGraphicsCallBack",
		"_setCacheAs",
		"_setX",
		"_setY",
		"_setPivotX",
		"_getPivotX",
		"_setPivotY",
		"_getPivotY",
		"_setAlpha",
		"_getAlpha",
		"_setScaleX",
		"_setScaleY",
		"_setSkewX",
		"_setSkewY",
		"_setRotation",
		"_adjustTransform",
		"_setRenderType",
		"_setTexture",
		"_setTextureEx",
		"_setCustomRender",
		"_setScrollRect",
		"_setColorFilter",
		"customRenderFromNative",
		"canvasBeginRenderFromNative",
		"canvasEndRenderFromNative",
		"setChildrenNativeVisible",
		"filterBeginRenderFromNative",
		"filterEndRenderFromNative",
		"updateParticleFromNative",
		"_setMask",
		"maskRenderFromNative",
		"_setBlendMode",
		"_setBgStyleColor",
		"_setBorderStyleColor",
		"_setWidth",
		"_setHeight",
		"_setTranformChange",];
		var i=0,len=0;
		len=funs.length;
		var tFunName;
		for (i=0;i < len;i++){
			tFunName=funs[i];
			spP[tFunName]=mP[tFunName];
		}
		spP["createGLBuffer"]=mP["createData"];
		Matrix._createFun=ConchSpriteAdpt.createMatrix;
		var sprite=Sprite;
		spP.render=spP.renderToNative=ConchSprite.prototype.renderToNative;
		spP.repaint=spP.repaintForNative=ConchSprite.prototype.repaintForNative;
		spP.parentRepaint=spP.parentRepaintForNative=ConchSprite.prototype.parentRepaintForNative;
		spP._renderChilds=ConchSprite.prototype._renderChilds;
		spP.writeBlockToNative=ConchSprite.prototype.writeBlockToNative;
		spP._writeBlockChilds=ConchSprite.prototype._writeBlockChilds;
	}

	ConchSpriteAdpt.useRenderTarget=function(target){
		var layagl=LayaGL.instance;
		RenderTexture2D.pushRT();
		target.start();
		layagl.clearColor(0,0,0,0);
		layagl.clear(/*laya.webgl.WebGLContext.COLOR_BUFFER_BIT*/0x00004000 | /*laya.webgl.WebGLContext.DEPTH_BUFFER_BIT*/0x00000100 | /*laya.webgl.WebGLContext.STENCIL_BUFFER_BIT*/0x00000400);
		layagl.save();
		ConchSpriteAdpt._tempFloatArrayBuffer2[0]=target.width;
		ConchSpriteAdpt._tempFloatArrayBuffer2[1]=target.height;
		layagl.setGlobalValue(LayaNative2D.GLOBALVALUE_VIEWS,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,ConchSpriteAdpt._tempFloatArrayBuffer2);
	}

	ConchSpriteAdpt.buildCanvas=function(sprite,x,y){
		var _cacheStyle=sprite._cacheStyle;
		var tx;
		var canvas=_cacheStyle.canvas;
		var left;
		var top;
		var tRec;
		var tCacheType=_cacheStyle.cacheAs;
		var w,h;
		var scaleX,scaleY;
		var scaleInfo;
		scaleInfo=_cacheStyle._calculateCacheRect(sprite,tCacheType,x,y);
		scaleX=scaleInfo.x;
		scaleY=scaleInfo.y;
		tRec=_cacheStyle.cacheRect;
		w=tRec.width *scaleX;
		h=tRec.height *scaleY;
		left=tRec.x;
		top=tRec.y;
		if (tCacheType==='bitmap' && (w > 2048 || h > 2048)){
			alert("cache bitmap size larger than 2048,cache ignored");
			_cacheStyle.releaseContext();
			return null;
		}
		if (!canvas){
			_cacheStyle.createContext();
			canvas=_cacheStyle.canvas;
		}
		tx=canvas.context;
		canvas.context.sprite=sprite;
		if (canvas.width !=w || canvas.height !=h){
			canvas.size(w,h);
			if (tx._targets){
				tx._targets.destroy();
				tx._targets=null;
			}
		}
		if (tCacheType==='bitmap')canvas.context.asBitmap=true;
		else if (tCacheType==='normal')canvas.context.asBitmap=false;
		if (tCacheType==='normal'){
			tx.touches=[];
		}
		return canvas;
	}

	__static(ConchSpriteAdpt,
	['_tempFloatArrayBuffer2',function(){return this._tempFloatArrayBuffer2=new Float32Array(2);},'_tempFloatArrayMatrix',function(){return this._tempFloatArrayMatrix=new Float32Array(6);},'_tempInt1',function(){return this._tempInt1=new Int32Array(1);}
	]);
	return ConchSpriteAdpt;
})(Node)



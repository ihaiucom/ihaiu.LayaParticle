//class laya.layagl.cmdNative.DrawRectCmdNative
var DrawRectCmdNative=(function(){
	function DrawRectCmdNative(){
		this._graphicsCmdEncoder=null;
		this._index=0;
		this._paramData=null;
		this._x=NaN;
		this._y=NaN;
		this._width=NaN;
		this._height=NaN;
		this._fillColor=null;
		this._lineColor=null;
		this._lineWidth=NaN;
		this._line_vertNum=0;
		this._cmdCurrentPos=0;
		this._linePoints=[];
		this._line_ibArray=[];
		this._line_vbArray=[];
	}

	__class(DrawRectCmdNative,'laya.layagl.cmdNative.DrawRectCmdNative');
	var __proto=DrawRectCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._linePoints.length=0;
		this._line_ibArray.length=0;
		this._line_vbArray.length=0;
		this._graphicsCmdEncoder=null;
		Pool.recover("DrawRectCmd",this);
	}

	__getset(0,__proto,'lineColor',function(){
		return this._lineColor;
		},function(value){
		this._graphicsCmdEncoder._idata[this._cmdCurrentPos+1]=DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.getPtrID();
		LayaGL.syncBufferToRenderThread(this._graphicsCmdEncoder);
		this._lineColor=value;
		var _i32b=this._paramData._int32Data;
		var c2=ColorUtils.create(value);
		var nLineColor=c2.numColor;
		var ix=DrawRectCmdNative._PARAM_LINE_VB_POS_;
		for (var i=0;i < this._line_vertNum;i++){
			ix++;ix++;_i32b[ix++]=nLineColor;
		}
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'cmdID',function(){
		return "DrawRect";
	});

	__getset(0,__proto,'fillColor',function(){
		return this._fillColor;
		},function(value){
		this._fillColor=value;
		if (typeof value==='string'){
			var c1=ColorUtils.create(this._fillColor);
			var nFillColor=c1.numColor;
			var _i32b=this._paramData._int32Data;
			_i32b[DrawRectCmdNative._PARAM_VB_POS_+4]=nFillColor;
			_i32b[DrawRectCmdNative._PARAM_VB_POS_+10]=nFillColor;
			_i32b[DrawRectCmdNative._PARAM_VB_POS_+16]=nFillColor;
			_i32b[DrawRectCmdNative._PARAM_VB_POS_+22]=nFillColor;
		}
		else{
			_i32b=this._paramData._int32Data;
			_i32b[DrawRectCmdNative._PARAM_VB_POS_+4]=value;
			_i32b[DrawRectCmdNative._PARAM_VB_POS_+10]=value;
			_i32b[DrawRectCmdNative._PARAM_VB_POS_+16]=value;
			_i32b[DrawRectCmdNative._PARAM_VB_POS_+22]=value;
		}
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'width',function(){
		return this._width;
		},function(value){
		this._width=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawRectCmdNative._PARAM_VB_POS_+6]=this._x+this._width;
		_fb[DrawRectCmdNative._PARAM_VB_POS_+12]=this._x+this._width;
		if (this.lineColor){
			this._line_ibArray.length=0;
			this._line_vbArray.length=0;
			this._linePoints[2]=this._x+this._width;
			this._linePoints[4]=this._x+this._width;
			BasePoly.createLine2(this._linePoints,this._line_ibArray,this._lineWidth,0,this._line_vbArray,false);
			this._line_vertNum=this._linePoints.length;
			var ix=DrawRectCmdNative._PARAM_LINE_VB_POS_;
			for (var i=0;i < this._line_vertNum;i++){
				_fb[ix++]=this._line_vbArray[i *2];_fb[ix++]=this._line_vbArray[i *2+1];ix++;
			}
		}
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'x',function(){
		return this._x;
		},function(value){
		this._x=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawRectCmdNative._PARAM_VB_POS_]=this._x;
		_fb[DrawRectCmdNative._PARAM_VB_POS_+6]=this._x+this._width;
		_fb[DrawRectCmdNative._PARAM_VB_POS_+12]=this._x+this._width;
		_fb[DrawRectCmdNative._PARAM_VB_POS_+18]=this._x;
		if (this.lineColor){
			this._line_ibArray.length=0;
			this._line_vbArray.length=0;
			this._linePoints[0]=this._x;this._linePoints[2]=this._x+this._width;
			this._linePoints[4]=this._x+this._width;this._linePoints[6]=this._x;this._linePoints[8]=this._x;
			BasePoly.createLine2(this._linePoints,this._line_ibArray,this._lineWidth,0,this._line_vbArray,false);
			var ix=DrawRectCmdNative._PARAM_LINE_VB_POS_;
			for (var i=0;i < this._line_vertNum;i++){
				_fb[ix++]=this._line_vbArray[i *2];_fb[ix++]=this._line_vbArray[i *2+1];ix++;
			}
		}
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'y',function(){
		return this._y;
		},function(value){
		this._y=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawRectCmdNative._PARAM_VB_POS_+1]=this._y;
		_fb[DrawRectCmdNative._PARAM_VB_POS_+7]=this._y;
		_fb[DrawRectCmdNative._PARAM_VB_POS_+13]=this._y+this._height;
		_fb[DrawRectCmdNative._PARAM_VB_POS_+19]=this._y+this._height;
		if (this.lineColor){
			this._line_ibArray.length=0;
			this._line_vbArray.length=0;
			this._linePoints[1]=this._y;this._linePoints[3]=this._y;
			this._linePoints[5]=this._y+this._height;this._linePoints[7]=this._y+this._height;this._linePoints[9]=this._y-this._lineWidth / 2;
			BasePoly.createLine2(this._linePoints,this._line_ibArray,this._lineWidth,0,this._line_vbArray,false);
			var ix=DrawRectCmdNative._PARAM_LINE_VB_POS_;
			for (var i=0;i < this._line_vertNum;i++){
				_fb[ix++]=this._line_vbArray[i *2];_fb[ix++]=this._line_vbArray[i *2+1];ix++;
			}
		}
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'height',function(){
		return this._height;
		},function(value){
		this._height=value;
		var _fb=this._paramData._float32Data;
		_fb[DrawRectCmdNative._PARAM_VB_POS_+13]=this._y+this._height;
		_fb[DrawRectCmdNative._PARAM_VB_POS_+19]=this._y+this._height;
		if (this.lineColor){
			this._line_ibArray.length=0;
			this._line_vbArray.length=0;
			this._linePoints[5]=this._y+this._height;
			this._linePoints[7]=this._y+this._height;
			BasePoly.createLine2(this._linePoints,this._line_ibArray,this._lineWidth,0,this._line_vbArray,false);
			var ix=DrawRectCmdNative._PARAM_LINE_VB_POS_;
			for (var i=0;i < this._line_vertNum;i++){
				_fb[ix++]=this._line_vbArray[i *2];_fb[ix++]=this._line_vbArray[i *2+1];ix++;
			}
		}
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'lineWidth',function(){
		return this._lineWidth;
		},function(value){
		if (this.lineColor){
			this._graphicsCmdEncoder._idata[this._cmdCurrentPos+1]=DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.getPtrID();
			LayaGL.syncBufferToRenderThread(this._graphicsCmdEncoder);
		}
		this._lineWidth=value;
		this._line_ibArray.length=0;
		this._line_vbArray.length=0;
		this._linePoints[9]=this._y-this._lineWidth / 2;
		BasePoly.createLine2(this._linePoints,this._line_ibArray,this._lineWidth,0,this._line_vbArray,false);
		this._line_vertNum=this._linePoints.length;
		var _fb=this._paramData._float32Data;
		var ix=DrawRectCmdNative._PARAM_LINE_VB_POS_;
		for (var i=0;i < this._line_vertNum;i++){
			_fb[ix++]=this._line_vbArray[i *2];_fb[ix++]=this._line_vbArray[i *2+1];ix++;
		}
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	DrawRectCmdNative.create=function(x,y,width,height,fillColor,lineColor,lineWidth){
		var cmd=Pool.getItemByClass("DrawRectCmd",DrawRectCmdNative);
		cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		if (!DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_){
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(300,32,true);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWTEXTURE);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHQUADTEXTURE);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.setRectMeshByParamData(DrawRectCmdNative._PARAM_RECT_NUM_POS_ *4,DrawRectCmdNative._PARAM_VB_POS_ *4,DrawRectCmdNative._PARAM_VB_SIZE_POS_ *4);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWVG);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHVG);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.setMeshByParamData(DrawRectCmdNative._PARAM_LINE_VB_POS_ *4,DrawRectCmdNative._PARAM_LINE_VB_OFFSET_POS_ *4,DrawRectCmdNative._PARAM_LINE_VB_SIZE_POS_ *4,DrawRectCmdNative._PARAM_LINE_IB_POS_ *4,DrawRectCmdNative._PARAM_LINE_IB_OFFSET_POS_ *4,DrawRectCmdNative._PARAM_LINE_IB_SIZE_POS_ *4,DrawRectCmdNative._PARAM_LINE_IBELEMENT_OFFSET_POS_ *4);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_);
		}
		if (!DrawRectCmdNative._DRAW_RECT_CMD_ENCODER_){
			DrawRectCmdNative._DRAW_RECT_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(152,32,true);
			DrawRectCmdNative._DRAW_RECT_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawRectCmdNative._DRAW_RECT_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWTEXTURE);
			DrawRectCmdNative._DRAW_RECT_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHQUADTEXTURE);
			DrawRectCmdNative._DRAW_RECT_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawRectCmdNative._DRAW_RECT_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawRectCmdNative._DRAW_RECT_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawRectCmdNative._DRAW_RECT_CMD_ENCODER_.setRectMeshByParamData(DrawRectCmdNative._PARAM_RECT_NUM_POS_*4,DrawRectCmdNative._PARAM_VB_POS_ *4,DrawRectCmdNative._PARAM_VB_SIZE_POS_ *4);
			DrawRectCmdNative._DRAW_RECT_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawRectCmdNative._DRAW_RECT_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawRectCmdNative._DRAW_RECT_CMD_ENCODER_);
		}
		if (!cmd._paramData){
			cmd._paramData=/*__JS__ */new ParamData(73*4,true);
			}{
			cmd._x=x;
			cmd._y=y;
			cmd._width=width;
			cmd._height=height;
			cmd._fillColor=fillColor;
			cmd._lineColor=lineColor;
			cmd._lineWidth=lineWidth;
			var c1=ColorUtils.create(fillColor);
			var nFillColor=c1.numColor;
			var _fb=cmd._paramData._float32Data;
			var _i32b=cmd._paramData._int32Data;
			_i32b[DrawRectCmdNative._PARAM_RECT_NUM_POS_]=1;
			_i32b[DrawRectCmdNative._PARAM_VB_SIZE_POS_]=24 *4;
			var ix=DrawRectCmdNative._PARAM_VB_POS_;
			_fb[ix++]=x;_fb[ix++]=y;_fb[ix++]=0;_fb[ix++]=0;_i32b[ix++]=nFillColor;_fb[ix++]=0xffffffff;
			_fb[ix++]=x+width;_fb[ix++]=y;_fb[ix++]=0;_fb[ix++]=0;_i32b[ix++]=nFillColor;_fb[ix++]=0xffffffff;
			_fb[ix++]=x+width;_fb[ix++]=y+height;_fb[ix++]=0;_fb[ix++]=0;_i32b[ix++]=nFillColor;_fb[ix++]=0xffffffff;
			_fb[ix++]=x;_fb[ix++]=y+height;_fb[ix++]=0;_fb[ix++]=0;_i32b[ix++]=nFillColor;_fb[ix++]=0xffffffff;
			cmd._linePoints.push(x);cmd._linePoints.push(y);
			cmd._linePoints.push(x+width);cmd._linePoints.push(y);
			cmd._linePoints.push(x+width);cmd._linePoints.push(y+height);
			cmd._linePoints.push(x);cmd._linePoints.push(y+height);
			cmd._linePoints.push(x);cmd._linePoints.push(y-lineWidth/ 2)
			if (lineColor){
				BasePoly.createLine2(cmd._linePoints,cmd._line_ibArray,lineWidth,0,cmd._line_vbArray,false);
				cmd._line_vertNum=cmd._linePoints.length;
				_i32b[DrawRectCmdNative._PARAM_LINE_VB_SIZE_POS_]=30 *4;
				var c2=ColorUtils.create(lineColor);
				var nLineColor=c2.numColor;
				ix=DrawRectCmdNative._PARAM_LINE_VB_POS_;
				for (var i=0;i < cmd._line_vertNum;i++){
					_fb[ix++]=cmd._line_vbArray[i *2];_fb[ix++]=cmd._line_vbArray[i *2+1];_i32b[ix++]=nLineColor;
				}
				_i32b[DrawRectCmdNative._PARAM_LINE_IB_SIZE_POS_]=cmd._line_ibArray.length *2;
				var _i16b=cmd._paramData._int16Data;
				ix=DrawRectCmdNative._PARAM_LINE_IB_POS_*2;
				for (var ii=0;ii < cmd._line_ibArray.length;ii++){
					_i16b[ix++]=cmd._line_ibArray[ii];
				}
			}
			else{
				cmd._lineWidth=1;
				var temp_lineColor="#ffffff";
				BasePoly.createLine2(cmd._linePoints,cmd._line_ibArray,cmd._lineWidth,0,cmd._line_vbArray,false);
				cmd._line_vertNum=cmd._linePoints.length;
				_i32b[DrawRectCmdNative._PARAM_LINE_VB_SIZE_POS_]=30 *4;
				c2=ColorUtils.create(temp_lineColor);
				nLineColor=c2.numColor;
				ix=DrawRectCmdNative._PARAM_LINE_VB_POS_;
				for (i=0;i < cmd._line_vertNum;i++){
					_fb[ix++]=cmd._line_vbArray[i *2];_fb[ix++]=cmd._line_vbArray[i *2+1];_i32b[ix++]=nLineColor;
				}
				_i32b[DrawRectCmdNative._PARAM_LINE_IB_SIZE_POS_]=cmd._line_ibArray.length *2;
				_i16b=cmd._paramData._int16Data;
				ix=DrawRectCmdNative._PARAM_LINE_IB_POS_*2;
				for (ii=0;ii < cmd._line_ibArray.length;ii++){
					_i16b[ix++]=cmd._line_ibArray[ii];
				}
			}
			_i32b[DrawRectCmdNative._PARAM_LINE_VB_OFFSET_POS_]=0;
			_i32b[DrawRectCmdNative._PARAM_LINE_IB_OFFSET_POS_]=0;
			_i32b[DrawRectCmdNative._PARAM_LINE_IBELEMENT_OFFSET_POS_]=0;
			LayaGL.syncBufferToRenderThread(cmd._paramData);
		}
		if (lineColor){
			cmd._cmdCurrentPos=cmd._graphicsCmdEncoder.useCommandEncoder(DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		}
		else{
			cmd._cmdCurrentPos=cmd._graphicsCmdEncoder.useCommandEncoder(DrawRectCmdNative._DRAW_RECT_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		}
		LayaGL.syncBufferToRenderThread(cmd._graphicsCmdEncoder);
		return cmd;
	}

	DrawRectCmdNative.ID="DrawRect";
	DrawRectCmdNative._DRAW_RECT_CMD_ENCODER_=null;
	DrawRectCmdNative._DRAW_RECT_LINE_CMD_ENCODER_=null;
	DrawRectCmdNative._PARAM_RECT_NUM_POS_=0;
	DrawRectCmdNative._PARAM_VB_SIZE_POS_=1;
	DrawRectCmdNative._PARAM_VB_POS_=2;
	DrawRectCmdNative._PARAM_LINE_VB_SIZE_POS_=26;
	DrawRectCmdNative._PARAM_LINE_VB_POS_=27;
	DrawRectCmdNative._PARAM_LINE_IB_SIZE_POS_=57;
	DrawRectCmdNative._PARAM_LINE_IB_POS_=58;
	DrawRectCmdNative._PARAM_LINE_VB_OFFSET_POS_=70;
	DrawRectCmdNative._PARAM_LINE_IB_OFFSET_POS_=71;
	DrawRectCmdNative._PARAM_LINE_IBELEMENT_OFFSET_POS_=72;
	return DrawRectCmdNative;
})()


/**
*@private
*<code>ShaderCompile</code> 类用于实现Shader编译。
*/

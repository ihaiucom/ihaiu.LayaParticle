//class laya.layagl.cmdNative.DrawPolyCmdNative
var DrawPolyCmdNative=(function(){
	function DrawPolyCmdNative(){
		this._graphicsCmdEncoder=null;
		this._graphicsCmdEncoder_lines=null;
		this._paramData=null;
		this._x=NaN;
		this._y=NaN;
		this._points=null;
		this._fillColor=null;
		this._lineColor=null;
		this._lineWidth=NaN;
		this._isConvexPolygon=false;
		this._vid=0;
		this._vertNum=0;
		this._line_vertNum=0;
		this.ibBuffer=null;
		this.vbBuffer=null;
		this.line_ibBuffer=null;
		this.line_vbBuffer=null;
		this._ibSize=0;
		this._vbSize=0;
		this._line_ibSize=0;
		this._line_vbSize=0;
		this._cmdCurrentPos=0;
		this._linePoints=[];
		this._line_vbArray=[];
		this._line_ibArray=[];
	}

	__class(DrawPolyCmdNative,'laya.layagl.cmdNative.DrawPolyCmdNative');
	var __proto=DrawPolyCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._points=null;
		this._fillColor=null;
		this._lineColor=null;
		this._linePoints.length=0;
		this._line_vbArray.length=0;
		this._line_ibArray.length=0;
		Pool.recover("DrawPolyCmd",this);
	}

	__getset(0,__proto,'lineColor',function(){
		return this._lineColor;
		},function(value){
		this._graphicsCmdEncoder._idata[this._cmdCurrentPos+1]=DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_.getPtrID();
		LayaGL.syncBufferToRenderThread(this._graphicsCmdEncoder);
		this._lineColor=value;
		if (this._lineColor && this.line_vbBuffer){
			var c2=ColorUtils.create(this._lineColor);
			var nColor2=c2.numColor;
			var _line_vb_i32b=this.line_vbBuffer._int32Data;
			var ix=0;
			for (var i=0;i < this._line_vertNum;i++){
				ix++;ix++;_line_vb_i32b[ix++]=nColor2;
			}
			LayaGL.syncBufferToRenderThread(this.line_vbBuffer);
		}
	});

	__getset(0,__proto,'points',function(){
		return this._points;
		},function(value){
		this._points=value;{
			this._vertNum=value.length / 2;
			var vertNumCopy=this._vertNum;
			var cur=Earcut.earcut(value,null,2);
			if (cur.length > 0){
				if (!this.ibBuffer || this.ibBuffer.getByteLength()< cur.length*2){
					this.ibBuffer=/*__JS__ */new ParamData(cur.length*2,true,true);
				}
				this._ibSize=cur.length *2;
				var _ib=this.ibBuffer._int16Data;
				var idxpos=0;
				for (var ii=0;ii < cur.length;ii++){
					_ib[idxpos++]=cur[ii];
				}
			}
			if (!this.vbBuffer || this.vbBuffer.getByteLength()< this._vertNum *3 *4){
				this.vbBuffer=/*__JS__ */new ParamData(vertNumCopy*3 *4,true);
			}
			this._vbSize=this._vertNum *3 *4;
			var c1=ColorUtils.create(this._fillColor);
			var nColor=c1.numColor;
			var _vb=this.vbBuffer._float32Data;
			var _vb_i32b=this.vbBuffer._int32Data;
			var ix=0;
			for (var i=0;i < this._vertNum;i++){
				_vb[ix++]=this._points[i *2]+this._x;_vb[ix++]=this._points[i *2+1]+this._y;_vb_i32b[ix++]=nColor;
			}
		};
		var _i32b=this._paramData._int32Data;
		_i32b[DrawPolyCmdNative._PARAM_VB_POS_]=this.vbBuffer.getPtrID();
		_i32b[DrawPolyCmdNative._PARAM_IB_POS_]=this.ibBuffer.getPtrID();
		_i32b[DrawPolyCmdNative._PARAM_VB_SIZE_POS_]=this._vbSize;
		_i32b[DrawPolyCmdNative._PARAM_IB_SIZE_POS_]=this._ibSize;
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
		LayaGL.syncBufferToRenderThread(this.ibBuffer);
		LayaGL.syncBufferToRenderThread(this._paramData);
		if (this.lineColor){
			{
				var lineVertNumCopy=0;
				this._linePoints.length=0;
				this._line_ibArray.length=0;
				this._line_vbArray.length=0;
				for (i=0;i < value.length;i++){
					this._linePoints.push(value[i]);
				}
				this._linePoints.push(value[0]);
				this._linePoints.push(value[1]);
				BasePoly.createLine2(this._linePoints,this._line_ibArray,this._lineWidth,0,this._line_vbArray,false);
				this._line_vertNum=this._linePoints.length;
				lineVertNumCopy=this._line_vertNum;
				if (!this.line_ibBuffer || this.line_ibBuffer.getByteLength()< (this._line_vertNum-2)*3*2){
					this.line_ibBuffer=/*__JS__ */new ParamData((lineVertNumCopy-2)*3*2,true,true);
				}
				this._line_ibSize=(this._line_vertNum-2)*3 *2;
				var _line_ib=this.line_ibBuffer._int16Data;
				idxpos=0;
				for (ii=0;ii < (this._line_vertNum-2)*3;ii++){
					_line_ib[idxpos++]=this._line_ibArray[ii];
				}
				if (!this.line_vbBuffer || this.line_vbBuffer.getByteLength()< this._line_vertNum*3 *4){
					this.line_vbBuffer=/*__JS__ */new ParamData(lineVertNumCopy*3 *4,true);
				}
				this._line_vbSize=this._line_vertNum *3 *4;
				var c2=ColorUtils.create(this._lineColor);
				var nColor2=c2.numColor;
				var _line_vb=this.line_vbBuffer._float32Data;
				var _line_vb_i32b=this.line_vbBuffer._int32Data;
				ix=0;
				for (i=0;i < this._line_vertNum;i++){
					_line_vb[ix++]=this._line_vbArray[i *2]+this._x;
					_line_vb[ix++]=this._line_vbArray[i *2+1]+this._y;
					_line_vb_i32b[ix++]=nColor2;
				}
			}
			_i32b=this._paramData._int32Data;
			_i32b[DrawPolyCmdNative._PARAM_LINE_VB_POS_]=this.line_vbBuffer.getPtrID();
			_i32b[DrawPolyCmdNative._PARAM_LINE_IB_POS_]=this.line_ibBuffer.getPtrID();
			_i32b[DrawPolyCmdNative._PARAM_LINE_VB_SIZE_POS_]=this._line_vbSize;
			_i32b[DrawPolyCmdNative._PARAM_LINE_IB_SIZE_POS_]=this._line_ibSize;
			LayaGL.syncBufferToRenderThread(this.line_vbBuffer);
			LayaGL.syncBufferToRenderThread(this.line_ibBuffer);
		}
	});

	__getset(0,__proto,'cmdID',function(){
		return "DrawPoly";
	});

	__getset(0,__proto,'fillColor',function(){
		return this._fillColor;
		},function(value){
		this._fillColor=value;
		var c1=ColorUtils.create(this._fillColor);
		var nColor=c1.numColor;
		var _i32b=this.vbBuffer._int32Data;
		var ix=0;
		for (var i=0;i < this._vertNum;i++){
			ix++;ix++;_i32b[ix++]=nColor;
		}
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
	});

	__getset(0,__proto,'x',function(){
		return this._x;
		},function(value){
		this._x=value;
		var _vb=this.vbBuffer._float32Data;
		var ix=0;
		for (var i=0;i < this._vertNum;i++){
			_vb[ix++]=this._points[i *2]+this._x;ix++;ix++;
		}
		if (this._lineColor){
			var _line_vb=this.line_vbBuffer._float32Data;
			ix=0;
			for (i=0;i < this._line_vertNum;i++){
				_line_vb[ix++]=this._line_vbArray[i *2]+this._x;ix++;ix++;
			}
			LayaGL.syncBufferToRenderThread(this.line_vbBuffer);
		}
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
	});

	__getset(0,__proto,'isConvexPolygon',function(){
		return this._isConvexPolygon;
		},function(value){
		this._isConvexPolygon=value;
	});

	__getset(0,__proto,'vid',function(){
		return this._vid;
		},function(value){
		this._vid=value;
	});

	__getset(0,__proto,'y',function(){
		return this._y;
		},function(value){
		this._y=value;
		var _vb=this.vbBuffer._float32Data;
		var ix=0;
		for (var i=0;i < this._vertNum;i++){
			ix++;_vb[ix++]=this._points[i *2+1]+this._y;ix++;
		}
		if (this._lineColor){
			var _line_vb=this.line_vbBuffer._float32Data;
			ix=0;
			for (i=0;i < this._line_vertNum;i++){
				ix++;_line_vb[ix++]=this._line_vbArray[i *2+1]+this._y;ix++;
			}
			LayaGL.syncBufferToRenderThread(this.line_vbBuffer);
		}
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
	});

	__getset(0,__proto,'lineWidth',function(){
		return this._lineWidth;
		},function(value){
		if (this.lineColor){
			this._graphicsCmdEncoder._idata[this._cmdCurrentPos+1]=DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_.getPtrID();
			LayaGL.syncBufferToRenderThread(this._graphicsCmdEncoder);
		}
		this._lineWidth=value;
		this._linePoints.length=0;
		this._line_ibArray.length=0;
		this._line_vbArray.length=0;
		for (var i=0;i < this._points.length;i++){
			this._linePoints.push(this._points[i]);
		}
		this._linePoints.push(this._points[0]);
		this._linePoints.push(this._points[1]);
		BasePoly.createLine2(this._linePoints,this._line_ibArray,this._lineWidth,0,this._line_vbArray,false);
		var _line_vb=this.line_vbBuffer._float32Data;
		var ix=0;
		for (i=0;i < this._line_vertNum;i++){
			_line_vb[ix++]=this._line_vbArray[i *2]+this._x;
			_line_vb[ix++]=this._line_vbArray[i *2+1]+this._y;
			ix++;
		}
		LayaGL.syncBufferToRenderThread(this.line_vbBuffer);
	});

	DrawPolyCmdNative.create=function(x,y,points,fillColor,lineColor,lineWidth,isConvexPolygon,vid){
		var cmd=Pool.getItemByClass("DrawPolyCmd",DrawPolyCmdNative);
		cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		if (!DrawPolyCmdNative._DRAW_POLY_CMD_ENCODER_){
			DrawPolyCmdNative._DRAW_POLY_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(168,32,true);
			DrawPolyCmdNative._DRAW_POLY_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawPolyCmdNative._DRAW_POLY_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWVG);
			DrawPolyCmdNative._DRAW_POLY_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHVG);
			DrawPolyCmdNative._DRAW_POLY_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawPolyCmdNative._DRAW_POLY_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawPolyCmdNative._DRAW_POLY_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawPolyCmdNative._DRAW_POLY_CMD_ENCODER_.setMeshExByParamData(DrawPolyCmdNative._PARAM_VB_POS_ *4,DrawPolyCmdNative._PARAM_VB_OFFSET_POS_ *4,DrawPolyCmdNative._PARAM_VB_SIZE_POS_ *4,DrawPolyCmdNative._PARAM_IB_POS_ *4,DrawPolyCmdNative._PARAM_IB_OFFSET_POS_ *4,DrawPolyCmdNative._PARAM_IB_SIZE_POS_ *4,DrawPolyCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_ *4);
			DrawPolyCmdNative._DRAW_POLY_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawPolyCmdNative._DRAW_POLY_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawPolyCmdNative._DRAW_POLY_CMD_ENCODER_);
		}
		if (!DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_){
			DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(244,32,true);
			DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWVG);
			DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHVG);
			DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_.setMeshExByParamData(DrawPolyCmdNative._PARAM_VB_POS_ *4,DrawPolyCmdNative._PARAM_VB_OFFSET_POS_ *4,DrawPolyCmdNative._PARAM_VB_SIZE_POS_ *4,DrawPolyCmdNative._PARAM_IB_POS_ *4,DrawPolyCmdNative._PARAM_IB_OFFSET_POS_ *4,DrawPolyCmdNative._PARAM_IB_SIZE_POS_ *4,DrawPolyCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_ *4);
			DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_.setMeshExByParamData(DrawPolyCmdNative._PARAM_LINE_VB_POS_ *4,DrawPolyCmdNative._PARAM_LINE_VB_OFFSET_POS_ *4,DrawPolyCmdNative._PARAM_LINE_VB_SIZE_POS_ *4,DrawPolyCmdNative._PARAM_LINE_IB_POS_ *4,DrawPolyCmdNative._PARAM_LINE_VB_OFFSET_POS_ *4,DrawPolyCmdNative._PARAM_LINE_IB_SIZE_POS_ *4,DrawPolyCmdNative._PARAM_LINE_INDEX_ELEMENT_OFFSET_POS_ *4);
			DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_);
		}
		if (!cmd._paramData){
			cmd._paramData=/*__JS__ */new ParamData(17 *4,true);
			}{
			cmd._x=x;
			cmd._y=y;
			cmd._points=points;
			cmd._fillColor=fillColor;
			cmd._lineColor=lineColor;
			cmd._lineWidth=lineWidth;
			cmd._isConvexPolygon=isConvexPolygon;
			cmd._vertNum=points.length / 2;
			var vertNumCopy=cmd._vertNum;
			var cur=Earcut.earcut(points,null,2);
			if (cur.length > 0){
				if (!cmd.ibBuffer || cmd.ibBuffer.getByteLength()< cur.length*2){
					cmd.ibBuffer=/*__JS__ */new ParamData(cur.length*2,true,true);
				}
				cmd._ibSize=cur.length *2;
				var _ib=cmd.ibBuffer._int16Data;
				var idxpos=0;
				for (var ii=0;ii < cur.length;ii++){
					_ib[idxpos++]=cur[ii];
				}
			};
			var c1=ColorUtils.create(fillColor);
			var nColor=c1.numColor;
			if (!cmd.vbBuffer || cmd.vbBuffer.getByteLength()< cmd._vertNum *3 *4){
				cmd.vbBuffer=/*__JS__ */new ParamData(vertNumCopy *3 *4,true);
			}
			cmd._vbSize=cmd._vertNum *3 *4;
			var _vb=cmd.vbBuffer._float32Data;
			var _vb_i32b=cmd.vbBuffer._int32Data;
			var ix=0;
			for (var i=0;i < cmd._vertNum;i++){
				_vb[ix++]=points[i *2]+x;_vb[ix++]=points[i *2+1]+y;_vb_i32b[ix++]=nColor;
			}
			for (i=0;i < points.length;i++){
				cmd._linePoints.push(points[i]);
			}
			cmd._linePoints.push(points[0]);
			cmd._linePoints.push(points[1]);
			if (lineColor){
				BasePoly.createLine2(cmd._linePoints,cmd._line_ibArray,lineWidth,0,cmd._line_vbArray,false);
				cmd._line_vertNum=cmd._linePoints.length;
				var lineVertNumCopy=cmd._line_vertNum;
				if (!cmd.line_ibBuffer || cmd.line_ibBuffer.getByteLength()< (cmd._line_vertNum-2)*3*2){
					cmd.line_ibBuffer=/*__JS__ */new ParamData((lineVertNumCopy-2)*3*2,true,true);
				}
				cmd._line_ibSize=(cmd._line_vertNum-2)*3 *2;
				var _line_ib=cmd.line_ibBuffer._int16Data;
				idxpos=0;
				for (ii=0;ii < (cmd._line_vertNum-2)*3;ii++){
					_line_ib[idxpos++]=cmd._line_ibArray[ii];
				}
				if (!cmd.line_vbBuffer || cmd.line_vbBuffer.getByteLength()< cmd._line_vertNum*3 *4){
					cmd.line_vbBuffer=/*__JS__ */new ParamData(lineVertNumCopy*3 *4,true);
				}
				cmd._line_vbSize=cmd._line_vertNum *3 *4;
				var c2=ColorUtils.create(lineColor);
				var nColor2=c2.numColor;
				var _line_vb=cmd.line_vbBuffer._float32Data;
				var _line_vb_i32b=cmd.line_vbBuffer._int32Data;
				ix=0;
				for (i=0;i < cmd._line_vertNum;i++){
					_line_vb[ix++]=cmd._line_vbArray[i *2]+x;_line_vb[ix++]=cmd._line_vbArray[i *2+1]+y;_line_vb_i32b[ix++]=nColor2;
				}
			}
			else{
				cmd._lineWidth=1;
				var temp_lineColor="#ffffff";
				BasePoly.createLine2(cmd._linePoints,cmd._line_ibArray,cmd._lineWidth,0,cmd._line_vbArray,false);
				cmd._line_vertNum=cmd._linePoints.length;
				lineVertNumCopy=cmd._line_vertNum;
				if (!cmd.line_ibBuffer || cmd.line_ibBuffer.getByteLength()< (cmd._line_vertNum-2)*3*2){
					cmd.line_ibBuffer=/*__JS__ */new ParamData((lineVertNumCopy-2)*3*2,true,true);
				}
				cmd._line_ibSize=(cmd._line_vertNum-2)*3 *2;
				_line_ib=cmd.line_ibBuffer._int16Data;
				idxpos=0;
				for (ii=0;ii < (cmd._line_vertNum-2)*3;ii++){
					_line_ib[idxpos++]=cmd._line_ibArray[ii];
				}
				if (!cmd.line_vbBuffer || cmd.line_vbBuffer.getByteLength()< cmd._line_vertNum*3 *4){
					cmd.line_vbBuffer=/*__JS__ */new ParamData(lineVertNumCopy*3 *4,true);
				}
				cmd._line_vbSize=cmd._line_vertNum *3 *4;
				c2=ColorUtils.create(temp_lineColor);
				nColor2=c2.numColor;
				_line_vb=cmd.line_vbBuffer._float32Data;
				_line_vb_i32b=cmd.line_vbBuffer._int32Data;
				ix=0;
				for (i=0;i < cmd._line_vertNum;i++){
					_line_vb[ix++]=cmd._line_vbArray[i *2]+x;_line_vb[ix++]=cmd._line_vbArray[i *2+1]+y;_line_vb_i32b[ix++]=nColor2;
				}
			}
		};
		var _fb=cmd._paramData._float32Data;
		var _i32b=cmd._paramData._int32Data;
		_i32b[0]=1;
		_i32b[1]=8 *4;
		if (cmd.ibBuffer==null){
			return null;
		}
		_i32b[DrawPolyCmdNative._PARAM_VB_POS_]=cmd.vbBuffer.getPtrID();
		_i32b[DrawPolyCmdNative._PARAM_IB_POS_]=cmd.ibBuffer.getPtrID();
		_i32b[DrawPolyCmdNative._PARAM_VB_SIZE_POS_]=cmd._vbSize;
		_i32b[DrawPolyCmdNative._PARAM_IB_SIZE_POS_]=cmd._ibSize;
		_i32b[DrawPolyCmdNative._PARAM_VB_OFFSET_POS_]=0;
		_i32b[DrawPolyCmdNative._PARAM_IB_OFFSET_POS_]=0;
		_i32b[DrawPolyCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_]=0;
		_fb[DrawPolyCmdNative._PARAM_ISCONVEXT_POS_]=isConvexPolygon;
		LayaGL.syncBufferToRenderThread(cmd.vbBuffer);
		LayaGL.syncBufferToRenderThread(cmd.ibBuffer);
		_i32b[DrawPolyCmdNative._PARAM_LINE_VB_POS_]=cmd.line_vbBuffer.getPtrID();
		_i32b[DrawPolyCmdNative._PARAM_LINE_IB_POS_]=cmd.line_ibBuffer.getPtrID();
		_i32b[DrawPolyCmdNative._PARAM_LINE_VB_SIZE_POS_]=cmd._line_vbSize;
		_i32b[DrawPolyCmdNative._PARAM_LINE_IB_SIZE_POS_]=cmd._line_ibSize;
		_i32b[DrawPolyCmdNative._PARAM_LINE_VB_OFFSET_POS_]=0;
		_i32b[DrawPolyCmdNative._PARAM_LINE_IB_OFFSET_POS_]=0;
		_i32b[DrawPolyCmdNative._PARAM_LINE_INDEX_ELEMENT_OFFSET_POS_]=0;
		LayaGL.syncBufferToRenderThread(cmd.line_vbBuffer);
		LayaGL.syncBufferToRenderThread(cmd.line_ibBuffer);
		LayaGL.syncBufferToRenderThread(cmd._paramData);
		if (lineColor){
			cmd._cmdCurrentPos=cmd._graphicsCmdEncoder.useCommandEncoder(DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		}
		else{
			cmd._cmdCurrentPos=cmd._graphicsCmdEncoder.useCommandEncoder(DrawPolyCmdNative._DRAW_POLY_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		}
		LayaGL.syncBufferToRenderThread(cmd._graphicsCmdEncoder);
		return cmd;
	}

	DrawPolyCmdNative.ID="DrawPoly";
	DrawPolyCmdNative._DRAW_POLY_CMD_ENCODER_=null;
	DrawPolyCmdNative._DRAW_POLY_LINES_CMD_ENCODER_=null;
	DrawPolyCmdNative._PARAM_VB_POS_=2;
	DrawPolyCmdNative._PARAM_IB_POS_=3;
	DrawPolyCmdNative._PARAM_VB_SIZE_POS_=4;
	DrawPolyCmdNative._PARAM_IB_SIZE_POS_=5;
	DrawPolyCmdNative._PARAM_LINE_VB_POS_=6;
	DrawPolyCmdNative._PARAM_LINE_IB_POS_=7;
	DrawPolyCmdNative._PARAM_LINE_VB_SIZE_POS_=8;
	DrawPolyCmdNative._PARAM_LINE_IB_SIZE_POS_=9;
	DrawPolyCmdNative._PARAM_ISCONVEXT_POS_=10;
	DrawPolyCmdNative._PARAM_VB_OFFSET_POS_=11;
	DrawPolyCmdNative._PARAM_IB_OFFSET_POS_=12;
	DrawPolyCmdNative._PARAM_LINE_VB_OFFSET_POS_=13;
	DrawPolyCmdNative._PARAM_LINE_IB_OFFSET_POS_=14;
	DrawPolyCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_=15;
	DrawPolyCmdNative._PARAM_LINE_INDEX_ELEMENT_OFFSET_POS_=16;
	return DrawPolyCmdNative;
})()



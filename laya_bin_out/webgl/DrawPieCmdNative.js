//class laya.layagl.cmdNative.DrawPieCmdNative
var DrawPieCmdNative=(function(){
	function DrawPieCmdNative(){
		this._graphicsCmdEncoder=null;
		this._paramData=null;
		this._paramID=null;
		this._x=NaN;
		this._y=NaN;
		this._radius=NaN;
		this._startAngle=NaN;
		this._endAngle=NaN;
		this._fillColor=null;
		this._lineColor=null;
		this._lineWidth=NaN;
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
		this._points=[];
		this._linePoints=[];
		this._line_vbArray=[];
		this._line_ibArray=[];
	}

	__class(DrawPieCmdNative,'laya.layagl.cmdNative.DrawPieCmdNative');
	var __proto=DrawPieCmdNative.prototype;
	__proto._arc=function(cx,cy,r,startAngle,endAngle,counterclockwise,b){
		(counterclockwise===void 0)&& (counterclockwise=false);
		(b===void 0)&& (b=true);
		var newPoints=[];
		newPoints.push(0);
		newPoints.push(0);
		var a=0,da=0,hda=0,kappa=0;
		var dx=0,dy=0,x=0,y=0,tanx=0,tany=0;
		var px=0,py=0,ptanx=0,ptany=0;
		var i=0,ndivs=0,nvals=0;
		da=endAngle-startAngle;
		if (!counterclockwise){
			if (Math.abs(da)>=Math.PI *2){
				da=Math.PI *2;
			}
			else{
				while (da < 0.0){
					da+=Math.PI *2;
				}
			}
		}
		else{
			if (Math.abs(da)>=Math.PI *2){
				da=-Math.PI *2;
			}
			else{
				while (da > 0.0){
					da-=Math.PI *2;
				}
			}
		}
		if (r < 101){
			ndivs=Math.max(10,da *r / 5);
		}
		else if (r < 201){
			ndivs=Math.max(10,da *r / 20);
		}
		else{
			ndivs=Math.max(10,da *r / 40);
		}
		hda=(da / ndivs)/ 2.0;
		kappa=Math.abs(4 / 3 *(1-Math.cos(hda))/ Math.sin(hda));
		if (counterclockwise){
			kappa=-kappa;
		}
		nvals=0;
		var _x1=NaN,_y1=NaN;
		var lastOriX=0,lastOriY=0;
		for (i=0;i <=ndivs;i++){
			a=startAngle+da *(i / ndivs);
			dx=Math.cos(a);
			dy=Math.sin(a);
			x=cx+dx *r;
			y=cy+dy *r;
			if (x !=lastOriX || y !=lastOriY){
				newPoints.push(x);
				newPoints.push(y);
			}
			lastOriX=x;
			lastOriY=y;
		}
		dx=Math.cos(endAngle);
		dy=Math.sin(endAngle);
		x=cx+dx *r;
		y=cy+dy *r;
		if (x !=lastOriX || y !=lastOriY){
			newPoints.push(x);
			newPoints.push(y);
		}
		return newPoints;
	}

	__proto._setData=function(x,y,fillColor,points,lineColor,lineWidth){{
			this._vertNum=points.length / 2;
			var vertNumCopy=this._vertNum;
			var curvert=0;
			var faceNum=this._vertNum-2;
			if (!this.ibBuffer || this.ibBuffer.getByteLength()< faceNum *3 *2){
				this.ibBuffer=/*__JS__ */new ParamData(faceNum*3*2,true,true);
			}
			this._ibSize=faceNum *3 *2;
			var _ib=this.ibBuffer._int16Data;
			var idxpos=0;
			for (var fi=0;fi < faceNum;fi++){
				_ib[idxpos++]=curvert;
				_ib[idxpos++]=fi+1+curvert;
				_ib[idxpos++]=fi+2+curvert;
			}
			if (!this.vbBuffer || this.vbBuffer.getByteLength()< this._vertNum *3 *4){
				this.vbBuffer=/*__JS__ */new ParamData(vertNumCopy*3 *4,true);
			}
			this._vbSize=this._vertNum *3 *4;
			var c1=ColorUtils.create(fillColor);
			var nColor=c1.numColor;
			var _vb=this.vbBuffer._float32Data;
			var _vb_i32b=this.vbBuffer._int32Data;
			var ix=0;
			for (var i=0;i < this._vertNum;i++){
				_vb[ix++]=points[i *2]+x;_vb[ix++]=points[i *2+1]+y;_vb_i32b[ix++]=nColor;
			};
			var lineVertNumCopy=0;
			this._linePoints.length=0;
			this._line_ibArray.length=0;
			this._line_vbArray.length=0;
			for (i=0;i < points.length;i++){
				this._linePoints.push(points[i]);
			}
			this._linePoints.push(points[0]);
			this._linePoints.push(points[1]);
			if (lineColor){
				BasePoly.createLine2(this._linePoints,this._line_ibArray,lineWidth,0,this._line_vbArray,false);
				this._line_vertNum=this._linePoints.length;
				lineVertNumCopy=this._line_vertNum;
				if (!this.line_ibBuffer || this.line_ibBuffer.getByteLength()< (this._line_vertNum-2)*3*2){
					this.line_ibBuffer=/*__JS__ */new ParamData((lineVertNumCopy-2)*3*2,true,true);
				}
				this._line_ibSize=(this._line_vertNum-2)*3 *2;
				var _line_ib=this.line_ibBuffer._int16Data;
				idxpos=0;
				for (var ii=0;ii < (this._line_vertNum-2)*3;ii++){
					_line_ib[idxpos++]=this._line_ibArray[ii];
				}
				if (!this.line_vbBuffer || this.line_vbBuffer.getByteLength()< this._line_vertNum*3 *4){
					this.line_vbBuffer=/*__JS__ */new ParamData(lineVertNumCopy*3 *4,true);
				}
				this._line_vbSize=this._line_vertNum *3 *4;
				var c2=ColorUtils.create(lineColor);
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
			else{
				this._lineWidth=1;
				var temp_lineColor='#FFFFFF';
				BasePoly.createLine2(this._linePoints,this._line_ibArray,this._lineWidth,0,this._line_vbArray,false);
				this._line_vertNum=this._linePoints.length;
				lineVertNumCopy=this._line_vertNum;
				if (!this.line_ibBuffer || this.line_ibBuffer.getByteLength()< (this._line_vertNum-2)*3*2){
					this.line_ibBuffer=/*__JS__ */new ParamData((lineVertNumCopy-2)*3*2,true,true);
				}
				this._line_ibSize=(this._line_vertNum-2)*3 *2;
				_line_ib=this.line_ibBuffer._int16Data;
				idxpos=0;
				for (ii=0;ii < (this._line_vertNum-2)*3;ii++){
					_line_ib[idxpos++]=this._line_ibArray[ii];
				}
				if (!this.line_vbBuffer || this.line_vbBuffer.getByteLength()< this._line_vertNum*3 *4){
					this.line_vbBuffer=/*__JS__ */new ParamData(lineVertNumCopy*3 *4,true);
				}
				this._line_vbSize=this._line_vertNum *3 *4;
				c2=ColorUtils.create(temp_lineColor);
				nColor2=c2.numColor;
				_line_vb=this.line_vbBuffer._float32Data;
				_line_vb_i32b=this.line_vbBuffer._int32Data;
				ix=0;
				for (i=0;i < this._line_vertNum;i++){
					_line_vb[ix++]=this._line_vbArray[i *2]+this._x;
					_line_vb[ix++]=this._line_vbArray[i *2+1]+this._y;
					_line_vb_i32b[ix++]=nColor2;
				}
			}
		}
	}

	__proto._saveToParamData=function(){
		var _fb=this._paramData._float32Data;
		var _i32b=this._paramData._int32Data;
		_i32b[0]=1;
		_i32b[1]=8*4;
		_i32b[DrawPieCmdNative._PARAM_VB_POS_]=this.vbBuffer.getPtrID();
		_i32b[DrawPieCmdNative._PARAM_IB_POS_]=this.ibBuffer.getPtrID();
		_i32b[DrawPieCmdNative._PARAM_VB_SIZE_POS_]=this._vbSize;
		_i32b[DrawPieCmdNative._PARAM_IB_SIZE_POS_]=this._ibSize;
		_i32b[DrawPieCmdNative._PARAM_VB_OFFSET_POS_]=0;
		_i32b[DrawPieCmdNative._PARAM_IB_OFFSET_POS_]=0;
		_i32b[DrawPieCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_]=0;
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
		LayaGL.syncBufferToRenderThread(this.ibBuffer);
		_i32b[DrawPieCmdNative._PARAM_LINE_VB_POS_]=this.line_vbBuffer.getPtrID();
		_i32b[DrawPieCmdNative._PARAM_LINE_IB_POS_]=this.line_ibBuffer.getPtrID();
		_i32b[DrawPieCmdNative._PARAM_LINE_VB_SIZE_POS_]=this._line_vbSize;
		_i32b[DrawPieCmdNative._PARAM_LINE_IB_SIZE_POS_]=this._line_ibSize;
		_i32b[DrawPieCmdNative._PARAM_LINE_VB_OFFSET_POS_]=0;
		_i32b[DrawPieCmdNative._PARAM_LINE_IB_OFFSET_POS_]=0;
		_i32b[DrawPieCmdNative._PARAM_LINE_INDEX_ELEMENT_OFFSET_POS_]=0;
		LayaGL.syncBufferToRenderThread(this.line_vbBuffer);
		LayaGL.syncBufferToRenderThread(this.line_ibBuffer);
	}

	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._fillColor=null;
		this._lineColor=null;
		this._points.length=0;
		this._linePoints.length=0;
		this._line_vbArray.length=0;
		this._line_ibArray.length=0;
		Pool.recover("DrawPieCmd",this);
	}

	__getset(0,__proto,'lineColor',function(){
		return this._lineColor;
		},function(value){
		if (!this._lineColor&&this._lineWidth){
			this._graphicsCmdEncoder._idata[this._cmdCurrentPos+1]=DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_.getPtrID();
			LayaGL.syncBufferToRenderThread(this._graphicsCmdEncoder);
		}
		this._lineColor=value;
		this._linePoints.length=0;
		this._line_ibArray.length=0;
		this._line_vbArray.length=0;
		for (var i=0;i < this._points.length;i++){
			this._linePoints.push(this._points[i]);
		}
		this._linePoints.push(this._points[0]);
		this._linePoints.push(this._points[1]);
		BasePoly.createLine2(this._linePoints,this._line_ibArray,this._lineWidth,0,this._line_vbArray,false);
		this._line_vertNum=this._linePoints.length;
		var lineVertNumCopy=this._line_vertNum;
		if (!this.line_ibBuffer || this.line_ibBuffer.getByteLength()< (this._line_vertNum-2)*3*2){
			this.line_ibBuffer=/*__JS__ */new ParamData((lineVertNumCopy-2)*3*2,true,true);
		}
		this._line_ibSize=(this._line_vertNum-2)*3 *2;
		var _line_ib=this.line_ibBuffer._int16Data;
		var idxpos=0;
		for (var ii=0;ii < (this._line_vertNum-2)*3;ii++){
			_line_ib[idxpos++]=this._line_ibArray[ii];
		}
		if (!this.line_vbBuffer || this.line_vbBuffer.getByteLength()< this._line_vertNum*3 *4){
			this.line_vbBuffer=/*__JS__ */new ParamData(lineVertNumCopy*3 *4,true);
		}
		this._line_vbSize=this._line_vertNum *3 *4;
		var c2=ColorUtils.create(value);
		var nColor2=c2.numColor;
		var _line_vb=this.line_vbBuffer._float32Data;
		var _line_vb_i32b=this.line_vbBuffer._int32Data;
		var ix=0;
		for (i=0;i < this._line_vertNum;i++){
			_line_vb[ix++]=this._line_vbArray[i *2]+this._x;
			_line_vb[ix++]=this._line_vbArray[i *2+1]+this._y;
			_line_vb_i32b[ix++]=nColor2;
		}
		LayaGL.syncBufferToRenderThread(this.line_ibBuffer);
		LayaGL.syncBufferToRenderThread(this.line_vbBuffer);
	});

	__getset(0,__proto,'startAngle',function(){
		return this._startAngle*180/Math.PI;
		},function(value){
		this._startAngle=value *Math.PI / 180;
		this._points=this._arc(0,0,this._radius,value *Math.PI / 180 ,this._endAngle);
		this._setData(this._x,this._y,this._fillColor,this._points,this._lineColor,this._lineWidth);
		this._saveToParamData();
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'cmdID',function(){
		return "DrawPie";
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

	__getset(0,__proto,'radius',function(){
		return this._radius;
		},function(value){
		this._points=this._arc(0,0,value,this._startAngle,this._endAngle);
		this._setData(this._x,this._y,this._fillColor,this._points,this._lineColor,this._lineWidth);
		this._saveToParamData();
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'endAngle',function(){
		return this._endAngle*180/Math.PI;
		},function(value){
		this._endAngle=value *Math.PI / 180;
		this._points=this._arc(0,0,this._radius,this._startAngle,value*Math.PI / 180);
		this._setData(this._x,this._y,this._fillColor,this._points,this._lineColor,this._lineWidth);
		this._saveToParamData();
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'lineWidth',function(){
		return this._lineWidth;
		},function(value){
		if (this.lineColor){
			this._graphicsCmdEncoder._idata[this._cmdCurrentPos+1]=DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_.getPtrID();
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
		BasePoly.createLine2(this._linePoints,this._line_ibArray,value,0,this._line_vbArray,false);
		this._line_vertNum=this._linePoints.length;
		var lineVertNumCopy=this._line_vertNum;
		if (!this.line_ibBuffer || this.line_ibBuffer.getByteLength()< (this._line_vertNum-2)*3*2){
			this.line_ibBuffer=/*__JS__ */new ParamData((lineVertNumCopy-2)*3*2,true,true);
		}
		this._line_ibSize=(this._line_vertNum-2)*3 *2;
		var _line_ib=this.line_ibBuffer._int16Data;
		var idxpos=0;
		for (var ii=0;ii < (this._line_vertNum-2)*3;ii++){
			_line_ib[idxpos++]=this._line_ibArray[ii];
		}
		if (!this.line_vbBuffer || this.line_vbBuffer.getByteLength()< this._line_vertNum*3 *4){
			this.line_vbBuffer=/*__JS__ */new ParamData(lineVertNumCopy*3 *4,true);
		}
		this._line_vbSize=this._line_vertNum *3 *4;
		var c2=ColorUtils.create(this.lineColor);
		var nColor2=c2.numColor;
		var _line_vb=this.line_vbBuffer._float32Data;
		var _line_vb_i32b=this.line_vbBuffer._int32Data;
		var ix=0;
		for (i=0;i < this._line_vertNum;i++){
			_line_vb[ix++]=this._line_vbArray[i *2]+this._x;
			_line_vb[ix++]=this._line_vbArray[i *2+1]+this._y;
			_line_vb_i32b[ix++]=nColor2;
		}
		LayaGL.syncBufferToRenderThread(this.line_ibBuffer);
		LayaGL.syncBufferToRenderThread(this.line_vbBuffer);
	});

	DrawPieCmdNative.create=function(x,y,radius,startAngle,endAngle,fillColor,lineColor,lineWidth,vid){
		var cmd=Pool.getItemByClass("DrawPieCmd",DrawPieCmdNative);
		cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		if (!DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_){
			DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(244,32,true);
			DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWVG);
			DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHVG);
			DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_.setMeshExByParamData(DrawPieCmdNative._PARAM_VB_POS_ *4,DrawPieCmdNative._PARAM_VB_OFFSET_POS_*4,DrawPieCmdNative._PARAM_VB_SIZE_POS_ *4,DrawPieCmdNative._PARAM_IB_POS_ *4,DrawPieCmdNative._PARAM_IB_OFFSET_POS_*4,DrawPieCmdNative._PARAM_IB_SIZE_POS_ *4,DrawPieCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_ *4);
			DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_.setMeshExByParamData(DrawPieCmdNative._PARAM_LINE_VB_POS_ *4,DrawPieCmdNative._PARAM_LINE_VB_OFFSET_POS_*4,DrawPieCmdNative._PARAM_LINE_VB_SIZE_POS_ *4,DrawPieCmdNative._PARAM_LINE_IB_POS_ *4,DrawPieCmdNative._PARAM_LINE_IB_OFFSET_POS_*4,DrawPieCmdNative._PARAM_LINE_IB_SIZE_POS_ *4,DrawPieCmdNative._PARAM_LINE_INDEX_ELEMENT_OFFSET_POS_ *4);
			DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_);
		}
		if (!DrawPieCmdNative._DRAW_PIE_CMD_ENCODER_){
			DrawPieCmdNative._DRAW_PIE_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(168,32,true);
			DrawPieCmdNative._DRAW_PIE_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawPieCmdNative._DRAW_PIE_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWVG);
			DrawPieCmdNative._DRAW_PIE_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHVG);
			DrawPieCmdNative._DRAW_PIE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawPieCmdNative._DRAW_PIE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawPieCmdNative._DRAW_PIE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawPieCmdNative._DRAW_PIE_CMD_ENCODER_.setMeshExByParamData(DrawPieCmdNative._PARAM_VB_POS_ *4,DrawPieCmdNative._PARAM_VB_OFFSET_POS_*4,DrawPieCmdNative._PARAM_VB_SIZE_POS_ *4,DrawPieCmdNative._PARAM_IB_POS_ *4,DrawPieCmdNative._PARAM_IB_OFFSET_POS_*4,DrawPieCmdNative._PARAM_IB_SIZE_POS_ *4,DrawPieCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_ *4);
			DrawPieCmdNative._DRAW_PIE_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawPieCmdNative._DRAW_PIE_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawPieCmdNative._DRAW_PIE_CMD_ENCODER_);
		}
		if (!cmd._paramData){
			cmd._paramData=/*__JS__ */new ParamData(16 *4,true);
			}{
			cmd._x=x;
			cmd._y=y;
			cmd._radius=radius;
			cmd._startAngle=startAngle;
			cmd._endAngle=endAngle;
			cmd._fillColor=fillColor;
			cmd._lineColor=lineColor;
			cmd._lineWidth=lineWidth;
			cmd._points=cmd._arc(0,0,radius,startAngle,endAngle);
			cmd._setData(x,y,fillColor,cmd._points,lineColor,lineWidth);
		}
		cmd._saveToParamData();
		LayaGL.syncBufferToRenderThread(cmd._paramData);
		if (lineColor){
			cmd._cmdCurrentPos=cmd._graphicsCmdEncoder.useCommandEncoder(DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		}
		else{
			cmd._cmdCurrentPos=cmd._graphicsCmdEncoder.useCommandEncoder(DrawPieCmdNative._DRAW_PIE_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		}
		LayaGL.syncBufferToRenderThread(cmd._graphicsCmdEncoder);
		return cmd;
	}

	DrawPieCmdNative.ID="DrawPie";
	DrawPieCmdNative._DRAW_PIE_CMD_ENCODER_=null;
	DrawPieCmdNative._DRAW_PIE_LINES_CMD_ENCODER_=null;
	DrawPieCmdNative._PARAM_VB_POS_=2;
	DrawPieCmdNative._PARAM_IB_POS_=3;
	DrawPieCmdNative._PARAM_LINE_VB_POS_=4;
	DrawPieCmdNative._PARAM_LINE_IB_POS_=5;
	DrawPieCmdNative._PARAM_VB_SIZE_POS_=6;
	DrawPieCmdNative._PARAM_IB_SIZE_POS_=7;
	DrawPieCmdNative._PARAM_LINE_VB_SIZE_POS_=8;
	DrawPieCmdNative._PARAM_LINE_IB_SIZE_POS_=9;
	DrawPieCmdNative._PARAM_VB_OFFSET_POS_=10;
	DrawPieCmdNative._PARAM_IB_OFFSET_POS_=11;
	DrawPieCmdNative._PARAM_LINE_VB_OFFSET_POS_=12;
	DrawPieCmdNative._PARAM_LINE_IB_OFFSET_POS_=13;
	DrawPieCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_=14;
	DrawPieCmdNative._PARAM_LINE_INDEX_ELEMENT_OFFSET_POS_=15;
	return DrawPieCmdNative;
})()


/**
*...
*@author ...
*/

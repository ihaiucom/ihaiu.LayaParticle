//class laya.layagl.cmdNative.DrawCurvesCmdNative
var DrawCurvesCmdNative=(function(){
	function DrawCurvesCmdNative(){
		this._graphicsCmdEncoder=null;
		this._paramData=null;
		this._x=0;
		this._y=0;
		this._points=[];
		this._lineColor=null;
		this._lineWidth=NaN;
		this.lastOriX=0;
		this.lastOriY=0;
		this.tArray=[];
		this._vertNum=0;
		this.ibBuffer=null;
		this.vbBuffer=null;
		this._ibSize=0;
		this._vbSize=0;
		this._ibArray=[];
		this._vbArray=[];
	}

	__class(DrawCurvesCmdNative,'laya.layagl.cmdNative.DrawCurvesCmdNative');
	var __proto=DrawCurvesCmdNative.prototype;
	__proto._getPoints=function(points){
		var newPoints=[];
		this._points.push(points[0]);
		this._points.push(points[1]);
		var i=2,n=points.length;
		while (i < n){
			this._quadraticCurveTo(newPoints,points[i++],points[i++],points[i++],points[i++]);
		}
		return newPoints;
	}

	__proto._quadraticCurveTo=function(points,cpx,cpy,x,y){
		var tBezier=Bezier.I;
		if (this.tArray.length==0){
			this.lastOriX=this._points[0];
			this.lastOriY=this._points[1];
		}
		else{
			this.lastOriX=this.tArray[this.tArray.length-2];
			this.lastOriY=this.tArray[this.tArray.length-1];
		}
		this.tArray=tBezier.getBezierPoints([this.lastOriX,this.lastOriY,cpx,cpy,x,y],30,2);
		for (var i=2,n=this.tArray.length;i < n;i++){
			points.push(this.tArray[i]);
		}
	}

	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._lineColor=null;
		this._points.length=0;
		this.tArray.length=0;
		this._ibArray.length=0;
		this._vbArray.length=0;
		Pool.recover("DrawCurvesCmd",this);
	}

	__getset(0,__proto,'lineColor',function(){
		return this._lineColor;
		},function(value){
		this._lineColor=value;
		var c1=ColorUtils.create(this._lineColor);
		var nColor=c1.numColor;
		var _i32b=this.vbBuffer._int32Data;
		var ix=0;
		for (var i=0;i < this._vertNum;i++){
			ix++;ix++;_i32b[ix++]=nColor;
		}
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
	});

	__getset(0,__proto,'points',function(){
		return this._points;
		},function(value){
		this._points.length=0;
		this.lastOriX=0;this.lastOriY=0;
		this._points=this._getPoints(value);
		this._ibArray.length=0;
		this._vbArray.length=0;
		BasePoly.createLine2(this._points,this._ibArray,this.lineWidth,0,this._vbArray,false);
		var c1=ColorUtils.create(this._lineColor);
		var nColor=c1.numColor;
		this._vertNum=this._points.length;
		var vertNumCopy=this._vertNum;
		if (!this.vbBuffer || this.vbBuffer.getByteLength()< this._vertNum*3*4){
			this.vbBuffer=/*__JS__ */new ParamData(vertNumCopy*3*4,true);
		}
		this._vbSize=this._vertNum *3 *4;
		var _vb=this.vbBuffer._float32Data;
		var _i32b=this.vbBuffer._int32Data;
		var ix=0;
		for (var i=0;i < this._vertNum;i++){
			_vb[ix++]=this._vbArray[i *2]+this.x;_vb[ix++]=this._vbArray[i *2+1]+this.y;_i32b[ix++]=nColor;
		}
		if (!this.ibBuffer || this.ibBuffer.getByteLength()< (this._vertNum-2)*3 *2){
			this.ibBuffer=/*__JS__ */new ParamData((vertNumCopy-2)*3 *2,true,true);
		}
		this._ibSize=(this._vertNum-2)*3 *2;
		var _ib=this.ibBuffer._int16Data;
		for (var ii=0;ii < (this._vertNum-2)*3;ii++){
			_ib[ii]=this._ibArray[ii];
		}
		_i32b=this._paramData._int32Data;
		_i32b[DrawCurvesCmdNative._PARAM_VB_SIZE_POS_]=this._vbSize;
		_i32b[DrawCurvesCmdNative._PARAM_IB_SIZE_POS_]=this._ibSize;
		LayaGL.syncBufferToRenderThread(this.ibBuffer);
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'cmdID',function(){
		return "DrawCurves";
	});

	__getset(0,__proto,'x',function(){
		return this._x;
		},function(value){
		this._x=value;
		var _vb=this.vbBuffer._float32Data;
		var ix=0;
		for (var i=0;i < this._vertNum;i++){
			_vb[ix++]=this._vbArray[i *2]+this._x;ix++;ix++;
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
			ix++;_vb[ix++]=this._vbArray[i *2+1]+this._y;ix++;
		}
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
	});

	__getset(0,__proto,'lineWidth',function(){
		return this._lineWidth;
		},function(value){
		this._lineWidth=value;
		this._ibArray.length=0;
		this._vbArray.length=0;
		BasePoly.createLine2(this._points,this._ibArray,this._lineWidth,0,this._vbArray,false);
		var _vb=this.vbBuffer._float32Data;
		var ix=0;
		for (var i=0;i < this._vertNum;i++){
			_vb[ix++]=this._vbArray[i *2]+this.x;_vb[ix++]=this._vbArray[i *2+1]+this.y;ix++;
		}
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
	});

	DrawCurvesCmdNative.create=function(x,y,points,lineColor,lineWidth){
		var cmd=Pool.getItemByClass("DrawCurvesCmd",DrawCurvesCmdNative);
		cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		if (!DrawCurvesCmdNative._DRAW_CURVES_CMD_ENCODER_){
			DrawCurvesCmdNative._DRAW_CURVES_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(152,32,true);
			DrawCurvesCmdNative._DRAW_CURVES_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWVG);
			DrawCurvesCmdNative._DRAW_CURVES_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHVG);
			DrawCurvesCmdNative._DRAW_CURVES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawCurvesCmdNative._DRAW_CURVES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawCurvesCmdNative._DRAW_CURVES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawCurvesCmdNative._DRAW_CURVES_CMD_ENCODER_.setMeshExByParamData(DrawCurvesCmdNative._PARAM_VB_POS_ *4,DrawCurvesCmdNative._PARAM_VB_OFFSET_POS_ *4,DrawCurvesCmdNative._PARAM_VB_SIZE_POS_ *4,DrawCurvesCmdNative._PARAM_IB_POS_ *4,DrawCurvesCmdNative._PARAM_IB_OFFSET_POS_ *4,DrawCurvesCmdNative._PARAM_IB_SIZE_POS_ *4,DrawCurvesCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_ *4);
			DrawCurvesCmdNative._DRAW_CURVES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawCurvesCmdNative._DRAW_CURVES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawCurvesCmdNative._DRAW_CURVES_CMD_ENCODER_);
		}
		if (!cmd._paramData){
			cmd._paramData=/*__JS__ */new ParamData(8 *4,true);
			}{
			cmd._x=x;
			cmd._y=y;
			cmd._lineColor=lineColor;
			cmd._lineWidth=lineWidth;
			cmd._points=cmd._getPoints(points);
			BasePoly.createLine2(cmd._points,cmd._ibArray,lineWidth,0,cmd._vbArray,false);
			var c1=ColorUtils.create(lineColor);
			var nColor=c1.numColor;
			cmd._vertNum=cmd._points.length;
			var vertNumCopy=cmd._vertNum;
			if (!cmd.vbBuffer || cmd.vbBuffer.getByteLength()< cmd._vertNum*3*4){
				cmd.vbBuffer=/*__JS__ */new ParamData(vertNumCopy*3*4,true);
			}
			cmd._vbSize=cmd._vertNum *3 *4;
			var _vb=cmd.vbBuffer._float32Data;
			var _i32b=cmd.vbBuffer._int32Data;
			var ix=0;
			for (var i=0;i < cmd._vertNum;i++){
				_vb[ix++]=cmd._vbArray[i *2]+x;_vb[ix++]=cmd._vbArray[i *2+1]+y;_i32b[ix++]=nColor;
			}
			if (!cmd.ibBuffer || cmd.ibBuffer.getByteLength()< (cmd._vertNum-2)*3 *2){
				cmd.ibBuffer=/*__JS__ */new ParamData((vertNumCopy-2)*3 *2,true,true);
			}
			cmd._ibSize=(cmd._vertNum-2)*3 *2;
			var _ib=cmd.ibBuffer._int16Data;
			for (var ii=0;ii < (cmd._vertNum-2)*3;ii++){
				_ib[ii]=cmd._ibArray[ii];
			}
		};
		var _fb=cmd._paramData._float32Data;
		_i32b=cmd._paramData._int32Data;
		_i32b[0]=1;
		_i32b[DrawCurvesCmdNative._PARAM_VB_POS_]=cmd.vbBuffer.getPtrID();
		_i32b[DrawCurvesCmdNative._PARAM_IB_POS_]=cmd.ibBuffer.getPtrID();
		_i32b[DrawCurvesCmdNative._PARAM_VB_SIZE_POS_]=cmd._vbSize;
		_i32b[DrawCurvesCmdNative._PARAM_IB_SIZE_POS_]=cmd._ibSize;
		_i32b[DrawCurvesCmdNative._PARAM_VB_OFFSET_POS_]=0;
		_i32b[DrawCurvesCmdNative._PARAM_IB_OFFSET_POS_]=0;
		_i32b[DrawCurvesCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_]=0;
		LayaGL.syncBufferToRenderThread(cmd.vbBuffer);
		LayaGL.syncBufferToRenderThread(cmd.ibBuffer);
		LayaGL.syncBufferToRenderThread(cmd._paramData);
		cmd._graphicsCmdEncoder.useCommandEncoder(DrawCurvesCmdNative._DRAW_CURVES_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		LayaGL.syncBufferToRenderThread(cmd._graphicsCmdEncoder);
		return cmd;
	}

	DrawCurvesCmdNative.ID="DrawCurves";
	DrawCurvesCmdNative._DRAW_CURVES_CMD_ENCODER_=null;
	DrawCurvesCmdNative._PARAM_VB_POS_=1;
	DrawCurvesCmdNative._PARAM_IB_POS_=2;
	DrawCurvesCmdNative._PARAM_VB_SIZE_POS_=3;
	DrawCurvesCmdNative._PARAM_IB_SIZE_POS_=4;
	DrawCurvesCmdNative._PARAM_VB_OFFSET_POS_=5;
	DrawCurvesCmdNative._PARAM_IB_OFFSET_POS_=6;
	DrawCurvesCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_=7;
	return DrawCurvesCmdNative;
})()


/**
*TODO如果占用内存较大,这个结构有很多成员可以临时计算
*/

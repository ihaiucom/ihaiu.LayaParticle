//class laya.layagl.cmdNative.DrawLinesCmdNative
var DrawLinesCmdNative=(function(){
	function DrawLinesCmdNative(){
		this._graphicsCmdEncoder=null;
		this._paramData=null;
		this._x=NaN;
		this._y=NaN;
		this._points=null;
		this._lineColor=null;
		this._lineWidth=NaN;
		this._vid=0;
		this._vertNum=0;
		this.ibBuffer=null;
		this.vbBuffer=null;
		this._ibSize=0;
		this._vbSize=0;
		this._ibArray=[];
		this._vbArray=[];
	}

	__class(DrawLinesCmdNative,'laya.layagl.cmdNative.DrawLinesCmdNative');
	var __proto=DrawLinesCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._points=null;
		this._lineColor=null;
		this._ibArray.length=0;
		this._vbArray.length=0;
		Pool.recover("DrawLinesCmd",this);
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
		this._points=value;
		this._ibArray.length=0;
		this._vbArray.length=0;
		BasePoly.createLine2(this._points,this._ibArray,this._lineWidth,0,this._vbArray,false);
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
		_i32b[DrawLinesCmdNative._PARAM_VB_SIZE_POS_]=this._vbSize;
		_i32b[DrawLinesCmdNative._PARAM_IB_SIZE_POS_]=this._ibSize;
		LayaGL.syncBufferToRenderThread(this.ibBuffer);
		LayaGL.syncBufferToRenderThread(this.vbBuffer);
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'cmdID',function(){
		return "DrawLines";
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

	DrawLinesCmdNative.create=function(x,y,points,lineColor,lineWidth,vid){
		var cmd=Pool.getItemByClass("DrawLinesCmd",DrawLinesCmdNative);
		cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		if (!DrawLinesCmdNative._DRAW_LINES_CMD_ENCODER_){
			DrawLinesCmdNative._DRAW_LINES_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(152,32,true);
			DrawLinesCmdNative._DRAW_LINES_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWVG);
			DrawLinesCmdNative._DRAW_LINES_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHVG);
			DrawLinesCmdNative._DRAW_LINES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawLinesCmdNative._DRAW_LINES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawLinesCmdNative._DRAW_LINES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawLinesCmdNative._DRAW_LINES_CMD_ENCODER_.setMeshExByParamData(DrawLinesCmdNative._PARAM_VB_POS_ *4,DrawLinesCmdNative._PARAM_VB_OFFSET_POS_ *4,DrawLinesCmdNative._PARAM_VB_SIZE_POS_ *4,DrawLinesCmdNative._PARAM_IB_POS_ *4,DrawLinesCmdNative._PARAM_IB_OFFSET_POS_ *4,DrawLinesCmdNative._PARAM_IB_SIZE_POS_ *4,DrawLinesCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_ *4);
			DrawLinesCmdNative._DRAW_LINES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawLinesCmdNative._DRAW_LINES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawLinesCmdNative._DRAW_LINES_CMD_ENCODER_);
		}
		if (!cmd._paramData){
			cmd._paramData=/*__JS__ */new ParamData(11 *4,true);
			}{
			cmd._x=x;
			cmd._y=y;
			cmd._points=points;
			cmd._lineColor=lineColor;
			cmd._lineWidth=lineWidth;
			cmd._vid=vid;
			BasePoly.createLine2(points,cmd._ibArray,lineWidth,0,cmd._vbArray,false);
			var c1=ColorUtils.create(lineColor);
			var nColor=c1.numColor;
			cmd._vertNum=points.length;
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
		_i32b[DrawLinesCmdNative._PARAM_VB_POS_]=cmd.vbBuffer.getPtrID();
		_i32b[DrawLinesCmdNative._PARAM_IB_POS_]=cmd.ibBuffer.getPtrID();
		if (!lineColor){
			_fb[DrawLinesCmdNative._PARAM_LINECOLOR_POS_]=0xff0000ff;
		}
		else{
			_fb[DrawLinesCmdNative._PARAM_LINECOLOR_POS_]=lineColor;
		}
		_fb[DrawLinesCmdNative._PARAM_LINEWIDTH_POS_]=lineWidth;
		_fb[DrawLinesCmdNative._PARAM_VID_POS_]=vid;
		_i32b[DrawLinesCmdNative._PARAM_VB_SIZE_POS_]=cmd._vbSize;
		_i32b[DrawLinesCmdNative._PARAM_IB_SIZE_POS_]=cmd._ibSize;
		_i32b[DrawLinesCmdNative._PARAM_VB_OFFSET_POS_]=0;
		_i32b[DrawLinesCmdNative._PARAM_IB_OFFSET_POS_]=0;
		_i32b[DrawLinesCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_]=0;
		LayaGL.syncBufferToRenderThread(cmd.vbBuffer);
		LayaGL.syncBufferToRenderThread(cmd.ibBuffer);
		LayaGL.syncBufferToRenderThread(cmd._paramData);
		cmd._graphicsCmdEncoder.useCommandEncoder(DrawLinesCmdNative._DRAW_LINES_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		LayaGL.syncBufferToRenderThread(cmd._graphicsCmdEncoder);
		return cmd;
	}

	DrawLinesCmdNative.ID="DrawLines";
	DrawLinesCmdNative._DRAW_LINES_CMD_ENCODER_=null;
	DrawLinesCmdNative._PARAM_VB_POS_=1;
	DrawLinesCmdNative._PARAM_IB_POS_=2;
	DrawLinesCmdNative._PARAM_LINECOLOR_POS_=3;
	DrawLinesCmdNative._PARAM_LINEWIDTH_POS_=4;
	DrawLinesCmdNative._PARAM_VID_POS_=5;
	DrawLinesCmdNative._PARAM_VB_SIZE_POS_=6;
	DrawLinesCmdNative._PARAM_IB_SIZE_POS_=7;
	DrawLinesCmdNative._PARAM_VB_OFFSET_POS_=8;
	DrawLinesCmdNative._PARAM_IB_OFFSET_POS_=9;
	DrawLinesCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_=10;
	return DrawLinesCmdNative;
})()


/**
*...
*@author ww
*/

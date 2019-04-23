//class laya.layagl.cmdNative.DrawLineCmdNative
var DrawLineCmdNative=(function(){
	function DrawLineCmdNative(){
		this._graphicsCmdEncoder=null;
		this._paramData=null;
		this._fromX=NaN;
		this._fromY=NaN;
		this._toX=NaN;
		this._toY=NaN;
		this._lineColor=null;
		this._lineWidth=NaN;
		this._vid=0;
	}

	__class(DrawLineCmdNative,'laya.layagl.cmdNative.DrawLineCmdNative');
	var __proto=DrawLineCmdNative.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("DrawLineCmd",this);
	}

	__getset(0,__proto,'lineColor',function(){
		return this._lineColor;
		},function(value){
		this._lineColor=value;
		var c1=ColorUtils.create(this.lineColor);
		var nColor=c1.numColor;
		var _i32b=this._paramData._int32Data;
		var ix=DrawLineCmdNative._PARAM_VB_POS_;
		ix++;ix++;_i32b[ix++]=nColor;
		ix++;ix++;_i32b[ix++]=nColor;
		ix++;ix++;_i32b[ix++]=nColor;
		ix++;ix++;_i32b[ix++]=nColor;
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'cmdID',function(){
		return "DrawLine";
	});

	__getset(0,__proto,'toY',function(){
		return this._toY;
		},function(value){
		this._toY=value;
		var points=[this._fromX,this._fromY,this._toX,this._toY];
		var vbArray=[];
		var ibArray=[];
		BasePoly.createLine2(points,ibArray,this._lineWidth,0,vbArray,false);
		var _fb=this._paramData._float32Data;
		var _i32b=this._paramData._int32Data;
		var _i16b=this._paramData._int16Data;
		var ix=DrawLineCmdNative._PARAM_VB_POS_;
		_fb[ix++]=vbArray[0];_fb[ix++]=vbArray[1];ix++;
		_fb[ix++]=vbArray[2];_fb[ix++]=vbArray[3];ix++;
		_fb[ix++]=vbArray[4];_fb[ix++]=vbArray[5];ix++;
		_fb[ix++]=vbArray[6];_fb[ix++]=vbArray[7];ix++;
		var ibx=DrawLineCmdNative._PARAM_IB_POS_*2;
		_i16b[ibx++]=ibArray[0];_i16b[ibx++]=ibArray[1];
		_i16b[ibx++]=ibArray[2];_i16b[ibx++]=ibArray[3];
		_i16b[ibx++]=ibArray[4];_i16b[ibx++]=ibArray[5];
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'fromX',function(){
		return this._fromX;
		},function(value){
		this._fromX=value;
		var points=[this._fromX,this._fromY,this._toX,this._toY];
		var vbArray=[];
		var ibArray=[];
		BasePoly.createLine2(points,ibArray,this._lineWidth,0,vbArray,false);
		var _fb=this._paramData._float32Data;
		var _i32b=this._paramData._int32Data;
		var _i16b=this._paramData._int16Data;
		var ix=DrawLineCmdNative._PARAM_VB_POS_;
		_fb[ix++]=vbArray[0];_fb[ix++]=vbArray[1];ix++;
		_fb[ix++]=vbArray[2];_fb[ix++]=vbArray[3];ix++;
		_fb[ix++]=vbArray[4];_fb[ix++]=vbArray[5];ix++;
		_fb[ix++]=vbArray[6];_fb[ix++]=vbArray[7];ix++;
		var ibx=DrawLineCmdNative._PARAM_IB_POS_*2;
		_i16b[ibx++]=ibArray[0];_i16b[ibx++]=ibArray[1];
		_i16b[ibx++]=ibArray[2];_i16b[ibx++]=ibArray[3];
		_i16b[ibx++]=ibArray[4];_i16b[ibx++]=ibArray[5];
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'vid',function(){
		return this._vid;
		},function(value){
		this._vid=value;
	});

	__getset(0,__proto,'toX',function(){
		return this._toX;
		},function(value){
		this._toX=value;
		var points=[this._fromX,this._fromY,this._toX,this._toY];
		var vbArray=[];
		var ibArray=[];
		BasePoly.createLine2(points,ibArray,this._lineWidth,0,vbArray,false);
		var _fb=this._paramData._float32Data;
		var _i32b=this._paramData._int32Data;
		var _i16b=this._paramData._int16Data;
		var ix=DrawLineCmdNative._PARAM_VB_POS_;
		_fb[ix++]=vbArray[0];_fb[ix++]=vbArray[1];ix++;
		_fb[ix++]=vbArray[2];_fb[ix++]=vbArray[3];ix++;
		_fb[ix++]=vbArray[4];_fb[ix++]=vbArray[5];ix++;
		_fb[ix++]=vbArray[6];_fb[ix++]=vbArray[7];ix++;
		var ibx=DrawLineCmdNative._PARAM_IB_POS_*2;
		_i16b[ibx++]=ibArray[0];_i16b[ibx++]=ibArray[1];
		_i16b[ibx++]=ibArray[2];_i16b[ibx++]=ibArray[3];
		_i16b[ibx++]=ibArray[4];_i16b[ibx++]=ibArray[5];
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'fromY',function(){
		return this._fromY;
		},function(value){
		this._fromY=value;
		var points=[this._fromX,this._fromY,this._toX,this._toY];
		var vbArray=[];
		var ibArray=[];
		BasePoly.createLine2(points,ibArray,this._lineWidth,0,vbArray,false);
		var _fb=this._paramData._float32Data;
		var _i32b=this._paramData._int32Data;
		var _i16b=this._paramData._int16Data;
		var ix=DrawLineCmdNative._PARAM_VB_POS_;
		_fb[ix++]=vbArray[0];_fb[ix++]=vbArray[1];ix++;
		_fb[ix++]=vbArray[2];_fb[ix++]=vbArray[3];ix++;
		_fb[ix++]=vbArray[4];_fb[ix++]=vbArray[5];ix++;
		_fb[ix++]=vbArray[6];_fb[ix++]=vbArray[7];ix++;
		var ibx=DrawLineCmdNative._PARAM_IB_POS_*2;
		_i16b[ibx++]=ibArray[0];_i16b[ibx++]=ibArray[1];
		_i16b[ibx++]=ibArray[2];_i16b[ibx++]=ibArray[3];
		_i16b[ibx++]=ibArray[4];_i16b[ibx++]=ibArray[5];
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'lineWidth',function(){
		return this._lineWidth;
		},function(value){
		this._lineWidth=value;
		var points=[this._fromX,this._fromY,this._toX,this._toY];
		var vbArray=[];
		var ibArray=[];
		BasePoly.createLine2(points,ibArray,this.lineWidth,0,vbArray,false);
		var _fb=this._paramData._float32Data;
		var _i32b=this._paramData._int32Data;
		var _i16b=this._paramData._int16Data;
		var ix=DrawLineCmdNative._PARAM_VB_POS_;
		_fb[ix++]=vbArray[0];_fb[ix++]=vbArray[1];ix++;
		_fb[ix++]=vbArray[2];_fb[ix++]=vbArray[3];ix++;
		_fb[ix++]=vbArray[4];_fb[ix++]=vbArray[5];ix++;
		_fb[ix++]=vbArray[6];_fb[ix++]=vbArray[7];ix++;
		var ibx=DrawLineCmdNative._PARAM_IB_POS_*2;
		_i16b[ibx++]=ibArray[0];_i16b[ibx++]=ibArray[1];
		_i16b[ibx++]=ibArray[2];_i16b[ibx++]=ibArray[3];
		_i16b[ibx++]=ibArray[4];_i16b[ibx++]=ibArray[5];
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	DrawLineCmdNative.create=function(fromX,fromY,toX,toY,lineColor,lineWidth,vid){
		var cmd=Pool.getItemByClass("DrawLineCmd",DrawLineCmdNative);
		cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		if (!DrawLineCmdNative._DRAW_LINE_CMD_ENCODER_){
			DrawLineCmdNative._DRAW_LINE_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(152,32,true);
			DrawLineCmdNative._DRAW_LINE_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWVG);
			DrawLineCmdNative._DRAW_LINE_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHVG);
			DrawLineCmdNative._DRAW_LINE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawLineCmdNative._DRAW_LINE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawLineCmdNative._DRAW_LINE_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawLineCmdNative._DRAW_LINE_CMD_ENCODER_.setMeshByParamData(DrawLineCmdNative._PARAM_VB_POS_*4,DrawLineCmdNative._PARAM_VB_OFFSET_POS_*4,1*4,DrawLineCmdNative._PARAM_IB_POS_*4,DrawLineCmdNative._PARAM_IB_OFFSET_POS_*4,2*4,DrawLineCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_*4);
			DrawLineCmdNative._DRAW_LINE_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawLineCmdNative._DRAW_LINE_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawLineCmdNative._DRAW_LINE_CMD_ENCODER_);
		}
		if (!cmd._paramData){
			cmd._paramData=/*__JS__ */new ParamData(24 *4,true);
			}{
			cmd._fromX=fromX;
			cmd._fromY=fromY;
			cmd._toX=toX;
			cmd._toY=toY;
			cmd._lineColor=lineColor;
			cmd._lineWidth=lineWidth;
			cmd._vid=vid;
			var c1=ColorUtils.create(lineColor);
			var nColor=c1.numColor;
			var points=[fromX,fromY,toX,toY];
			var vbArray=[];
			var ibArray=[];
			BasePoly.createLine2(points,ibArray,lineWidth,0,vbArray,false);
			var _fb=cmd._paramData._float32Data;
			var _i32b=cmd._paramData._int32Data;
			var _i16b=cmd._paramData._int16Data;
			_i32b[0]=1;
			_i32b[1]=12 *4;
			_i32b[2]=6 *2;
			_i32b[DrawLineCmdNative._PARAM_VB_OFFSET_POS_]=0;
			_i32b[DrawLineCmdNative._PARAM_IB_OFFSET_POS_]=0;
			_i32b[DrawLineCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_]=0;
			var ix=DrawLineCmdNative._PARAM_VB_POS_;
			_fb[ix++]=vbArray[0];_fb[ix++]=vbArray[1];_i32b[ix++]=nColor;
			_fb[ix++]=vbArray[2];_fb[ix++]=vbArray[3];_i32b[ix++]=nColor;
			_fb[ix++]=vbArray[4];_fb[ix++]=vbArray[5];_i32b[ix++]=nColor;
			_fb[ix++]=vbArray[6];_fb[ix++]=vbArray[7];_i32b[ix++]=nColor;
			var ibx=DrawLineCmdNative._PARAM_IB_POS_*2;
			_i16b[ibx++]=ibArray[0];_i16b[ibx++]=ibArray[1];
			_i16b[ibx++]=ibArray[2];_i16b[ibx++]=ibArray[3];
			_i16b[ibx++]=ibArray[4];_i16b[ibx++]=ibArray[5];
			if (!lineColor){
				_fb[DrawLineCmdNative._PARAM_LINECOLOR_POS_]=0xff0000ff;
			}
			else{
				_fb[DrawLineCmdNative._PARAM_LINECOLOR_POS_]=lineColor;
			}
			_fb[DrawLineCmdNative._PARAM_LINEWIDTH_POS_]=lineWidth;
			_fb[DrawLineCmdNative._PARAM_VID_POS_]=vid;
			LayaGL.syncBufferToRenderThread(cmd._paramData);
		}
		cmd._graphicsCmdEncoder.useCommandEncoder(DrawLineCmdNative._DRAW_LINE_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		LayaGL.syncBufferToRenderThread(cmd._graphicsCmdEncoder);
		return cmd;
	}

	DrawLineCmdNative.ID="DrawLine";
	DrawLineCmdNative._DRAW_LINE_CMD_ENCODER_=null;
	DrawLineCmdNative._PARAM_VB_POS_=3;
	DrawLineCmdNative._PARAM_IB_POS_=15;
	DrawLineCmdNative._PARAM_LINECOLOR_POS_=18;
	DrawLineCmdNative._PARAM_LINEWIDTH_POS_=19;
	DrawLineCmdNative._PARAM_VID_POS_=20;
	DrawLineCmdNative._PARAM_VB_OFFSET_POS_=21;
	DrawLineCmdNative._PARAM_IB_OFFSET_POS_=22;
	DrawLineCmdNative._PARAM_INDEX_ELEMENT_OFFSET_POS_=23;
	return DrawLineCmdNative;
})()


/**
*填充文字命令
*/

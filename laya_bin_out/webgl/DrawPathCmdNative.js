//class laya.layagl.cmdNative.DrawPathCmdNative
var DrawPathCmdNative=(function(){
	function DrawPathCmdNative(){
		this._graphicsCmdEncoder=null;
		this._paramData=null;
		this._graphicsCmdEncoder_fill=null;
		this._paramData_fill=null;
		this._x=NaN;
		this._y=NaN;
		this._paths=null;
		this._brush=null;
		this._pen=null;
		this._vertNum=0;
		this._startOriX=0;
		this._startOriY=0;
		this._lastOriX=0;
		this._lastOriY=0;
		this.SEGNUM=32;
		this.lines_ibBuffer=null;
		this.lines_vbBuffer=null;
		this._lines_ibSize=0;
		this._lines_vbSize=0;
		this.fill_ibBuffer=null;
		this.fill_vbBuffer=null;
		this._fill_ibSize=0;
		this._fill_vbSize=0;
		this._cmdCurrentPos=0;
		this._points=[];
		this._lines_ibArray=[];
		this._lines_vbArray=[];
		this._fill_ibArray=[];
		this._fill_vbArray=[];
	}

	__class(DrawPathCmdNative,'laya.layagl.cmdNative.DrawPathCmdNative');
	var __proto=DrawPathCmdNative.prototype;
	__proto._arcTo=function(path){
		var x1=path[1];
		var y1=path[2];
		var x2=path[3];
		var y2=path[4];
		var r=path[5];
		var i=0;
		var x=0,y=0;
		var dx=this._lastOriX-x1;
		var dy=this._lastOriY-y1;
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
			var fda=fChgAng / this.SEGNUM;
			sinx=Math.sin(fda);
			cosx=Math.cos(fda);
		}
		else {
			fChgAng=-halfAng *2;
			fda=fChgAng / this.SEGNUM;
			sinx=Math.sin(fda);
			cosx=Math.cos(fda);
		};
		var lastx=this._lastOriX,lasty=this._lastOriY;
		var cvx=ptx1-orix;
		var cvy=pty1-oriy;
		var tx=0.0;
		var ty=0.0;
		for (i=0;i < this.SEGNUM;i++){
			var cx=cvx*cosx+cvy*sinx;
			var cy=-cvx*sinx+cvy*cosx;
			x=cx+orix;
			y=cy+oriy;
			if (Math.abs(lastx-x)>0.1 || Math.abs(lasty-y)>0.1){
				this._points.push(x);
				this._points.push(y);
			}
			cvx=cx;
			cvy=cy;
		}
	}

	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._paths=null;
		this._brush=null;
		this._pen=null;
		this._points.length=0;
		this._lines_ibArray.length=0;
		this._lines_vbArray.length=0;
		this._fill_ibArray.length=0;
		this._fill_vbArray.length=0;
		Pool.recover("DrawPathCmd",this);
	}

	__getset(0,__proto,'cmdID',function(){
		return "DrawPath";
	});

	__getset(0,__proto,'paths',function(){
		return this._paths;
		},function(value){
		this._paths=value;
	});

	__getset(0,__proto,'x',function(){
		return this._x;
		},function(value){
		this._x=value;
		var _vb=this.lines_vbBuffer._float32Data;
		var ix=0;
		for (var i=0;i < this._vertNum;i++){
			_vb[ix++]=this._lines_vbArray[i *2]+value;ix++;ix++;
		}
		LayaGL.syncBufferToRenderThread(this.lines_vbBuffer);
	});

	__getset(0,__proto,'y',function(){
		return this._y;
		},function(value){
		this._y=value;
		var _vb=this.lines_vbBuffer._float32Data;
		var ix=0;
		for (var i=0;i < this._vertNum;i++){
			ix++;_vb[ix++]=this._lines_vbArray[i *2+1]+value;ix++;
		}
		LayaGL.syncBufferToRenderThread(this.lines_vbBuffer);
	});

	__getset(0,__proto,'brush',function(){
		return this._brush;
		},function(value){
		if (!this._brush){
			this._graphicsCmdEncoder._idata[this._cmdCurrentPos+1]=DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_.getPtrID();
			LayaGL.syncBufferToRenderThread(this._graphicsCmdEncoder);
		}
		this._brush=value;
		var vertNumCopy=this._vertNum;
		var cur=Earcut.earcut(this._points,null,2);
		if (cur.length > 0){
			if (!this.fill_ibBuffer || this.fill_ibBuffer.getByteLength()< cur.length*2){
				this.fill_ibBuffer=/*__JS__ */new ParamData(cur.length*2,true,true);
			}
			this._fill_ibSize=cur.length *2;
			var _ib=this.fill_ibBuffer._int16Data;
			var idxpos=0;
			for (var ii=0;ii < cur.length;ii++){
				_ib[idxpos++]=cur[ii];
			}
		};
		var c1=ColorUtils.create(value.fillStyle);
		var nColor=c1.numColor;
		if (!this.fill_vbBuffer || this.fill_vbBuffer.getByteLength()< this._vertNum *3 *4){
			this.fill_vbBuffer=/*__JS__ */new ParamData(vertNumCopy*3 *4,true);
		}
		this._fill_vbSize=this._vertNum *3 *4;
		var _vb=this.fill_vbBuffer._float32Data;
		var _vb_i32b=this.fill_vbBuffer._int32Data;
		var ix=0;
		for (var i=0;i < this._vertNum;i++){
			_vb[ix++]=this._points[i *2]+this.x;_vb[ix++]=this._points[i *2+1]+this.y;_vb_i32b[ix++]=nColor;
		};
		var _i32b=this._paramData._int32Data;
		_i32b[DrawPathCmdNative._PARAM_FILL_VB_POS_]=this.fill_vbBuffer.getPtrID();
		_i32b[DrawPathCmdNative._PARAM_FILL_IB_POS_]=this.fill_ibBuffer.getPtrID();
		_i32b[DrawPathCmdNative._PARAM_FILL_VB_SIZE_POS_]=this._fill_vbSize;
		_i32b[DrawPathCmdNative._PARAM_FILL_IB_SIZE_POS_]=this._fill_ibSize;
		LayaGL.syncBufferToRenderThread(this.fill_vbBuffer);
		LayaGL.syncBufferToRenderThread(this.fill_ibBuffer);
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	__getset(0,__proto,'pen',function(){
		return this._pen;
		},function(value){
		this._pen=value;
		this._lines_ibArray.length=0;
		this._lines_vbArray.length=0;
		BasePoly.createLine2(this._points,this._lines_ibArray,value.lineWidth,0,this._lines_vbArray,false);
		var c1=ColorUtils.create(value.strokeStyle);
		var nColor=c1.numColor;
		var vertNumCopy=this._vertNum;
		if (!this.lines_vbBuffer || this.lines_vbBuffer.getByteLength()< this._vertNum*3*4){
			this.lines_vbBuffer=/*__JS__ */new ParamData(vertNumCopy*3*4,true);
		}
		this._lines_vbSize=this._vertNum *3 *4;
		var _vb=this.lines_vbBuffer._float32Data;
		var _i32b=this.lines_vbBuffer._int32Data;
		var ix=0;
		for (var i=0;i < this._vertNum;i++){
			_vb[ix++]=this._lines_vbArray[i *2]+this.x;_vb[ix++]=this._lines_vbArray[i *2+1]+this.y;_i32b[ix++]=nColor;
		}
		if (!this.lines_ibBuffer || this.lines_ibBuffer.getByteLength()< (this._vertNum-2)*3 *2){
			this.lines_ibBuffer=/*__JS__ */new ParamData((vertNumCopy-2)*3 *2,true,true);
		}
		this._lines_ibSize=(this._vertNum-2)*3 *2;
		var _ib=this.lines_ibBuffer._int16Data;
		for (var ii=0;ii < (this._vertNum-2)*3;ii++){
			_ib[ii]=this._lines_ibArray[ii];
		}
		_i32b=this._paramData._int32Data;
		_i32b[DrawPathCmdNative._PARAM_LINES_VB_POS_]=this.lines_vbBuffer.getPtrID();
		_i32b[DrawPathCmdNative._PARAM_LINES_IB_POS_]=this.lines_ibBuffer.getPtrID();
		_i32b[DrawPathCmdNative._PARAM_LINES_VB_SIZE_POS_]=this._lines_vbSize;
		_i32b[DrawPathCmdNative._PARAM_LINES_IB_SIZE_POS_]=this._lines_ibSize;
		LayaGL.syncBufferToRenderThread(this.lines_vbBuffer);
		LayaGL.syncBufferToRenderThread(this.lines_ibBuffer);
		LayaGL.syncBufferToRenderThread(this._paramData);
	});

	DrawPathCmdNative.create=function(x,y,paths,brush,pen){
		var cmd=Pool.getItemByClass("DrawPathCmd",DrawPathCmdNative);
		cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		if (!DrawPathCmdNative._DRAW_LINES_CMD_ENCODER_){
			DrawPathCmdNative._DRAW_LINES_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(188,32,true);
			DrawPathCmdNative._DRAW_LINES_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawPathCmdNative._DRAW_LINES_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWVG);
			DrawPathCmdNative._DRAW_LINES_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHVG);
			DrawPathCmdNative._DRAW_LINES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawPathCmdNative._DRAW_LINES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawPathCmdNative._DRAW_LINES_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawPathCmdNative._DRAW_LINES_CMD_ENCODER_.setMeshExByParamData(DrawPathCmdNative._PARAM_LINES_VB_POS_ *4,DrawPathCmdNative._PARAM_LINE_VB_OFFSET_POS_*4,DrawPathCmdNative._PARAM_LINES_VB_SIZE_POS_ *4,DrawPathCmdNative._PARAM_LINES_IB_POS_ *4,DrawPathCmdNative._PARAM_LINE_IB_OFFSET_POS_*4,DrawPathCmdNative._PARAM_LINES_IB_SIZE_POS_ *4,DrawPathCmdNative._PARAM_FILL_INDEX_ELEMENT_OFFSET_POS_ *4);
			DrawPathCmdNative._DRAW_LINES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawPathCmdNative._DRAW_LINES_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawPathCmdNative._DRAW_LINES_CMD_ENCODER_);
		}
		if (!DrawPathCmdNative._DRAW_FILL_CMD_ENCODER_){
			DrawPathCmdNative._DRAW_FILL_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(168,32,true);
			DrawPathCmdNative._DRAW_FILL_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawPathCmdNative._DRAW_FILL_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWVG);
			DrawPathCmdNative._DRAW_FILL_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHVG);
			DrawPathCmdNative._DRAW_FILL_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawPathCmdNative._DRAW_FILL_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawPathCmdNative._DRAW_FILL_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawPathCmdNative._DRAW_FILL_CMD_ENCODER_.setMeshExByParamData(DrawPathCmdNative._PARAM_FILL_VB_POS_ *4,DrawPathCmdNative._PARAM_FILL_VB_OFFSET_POS_*4,DrawPathCmdNative._PARAM_FILL_VB_SIZE_POS_ *4,DrawPathCmdNative._PARAM_FILL_IB_POS_ *4,DrawPathCmdNative._PARAM_FILL_IB_OFFSET_POS_*4,DrawPathCmdNative._PARAM_FILL_IB_SIZE_POS_ *4,DrawPathCmdNative._PARAM_FILL_INDEX_ELEMENT_OFFSET_POS_ *4);
			DrawPathCmdNative._DRAW_FILL_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawPathCmdNative._DRAW_FILL_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawPathCmdNative._DRAW_FILL_CMD_ENCODER_);
		}
		if (!DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_){
			DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(244,32,true);
			DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWVG);
			DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHVG);
			DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_VIEWS,0);
			DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
			DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_.uniformEx(LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
			DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_.setMeshExByParamData(DrawPathCmdNative._PARAM_FILL_VB_POS_ *4,DrawPathCmdNative._PARAM_FILL_VB_OFFSET_POS_*4,DrawPathCmdNative._PARAM_FILL_VB_SIZE_POS_ *4,DrawPathCmdNative._PARAM_FILL_IB_POS_ *4,DrawPathCmdNative._PARAM_FILL_IB_OFFSET_POS_*4,DrawPathCmdNative._PARAM_FILL_IB_SIZE_POS_ *4,DrawPathCmdNative._PARAM_FILL_INDEX_ELEMENT_OFFSET_POS_ *4);
			DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_.setMeshExByParamData(DrawPathCmdNative._PARAM_LINES_VB_POS_ *4,DrawPathCmdNative._PARAM_LINE_VB_OFFSET_POS_*4,DrawPathCmdNative._PARAM_LINES_VB_SIZE_POS_ *4,DrawPathCmdNative._PARAM_LINES_IB_POS_ *4,DrawPathCmdNative._PARAM_LINE_IB_OFFSET_POS_*4,DrawPathCmdNative._PARAM_LINES_IB_SIZE_POS_ *4,DrawPathCmdNative._PARAM_LINE_INDEX_ELEMENT_OFFSET_POS_ *4);
			DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
			LayaGL.syncBufferToRenderThread(DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_);
		}
		if (!cmd._paramData){
			cmd._paramData=/*__JS__ */new ParamData(15 *4,true);
			}{
			cmd._x=x;
			cmd._y=y;
			cmd._paths=paths;
			cmd._brush=brush;
			cmd._pen=pen;
			for (var i=0,n=paths.length;i < n;i++){
				var path=paths[i];
				if (i==0){
					cmd._startOriX=path[1];
					cmd._startOriY=path[2];
				}
				switch(path[0]){
					case "moveTo":
						cmd._lastOriX=path[1];
						cmd._lastOriY=path[2];
						cmd._points.push(path[1]);
						cmd._points.push(path[2]);
						break ;
					case "lineTo":
						cmd._lastOriX=path[1];
						cmd._lastOriY=path[2];
						cmd._points.push(path[1]);
						cmd._points.push(path[2]);
						break ;
					case "arcTo":
						cmd._arcTo(path);
						break ;
					case "closePath":
						cmd._points.push(cmd._startOriX);
						cmd._points.push(cmd._startOriY);
						break ;
					}
			}
			cmd._vertNum=cmd._points.length;
			if(pen){
				BasePoly.createLine2(cmd._points,cmd._lines_ibArray,pen.lineWidth,0,cmd._lines_vbArray,false);
				var c1=ColorUtils.create(pen.strokeStyle);
				var nColor=c1.numColor;
				var vertNumCopy=cmd._vertNum;
				if (!cmd.lines_vbBuffer || cmd.lines_vbBuffer.getByteLength()< cmd._vertNum*3*4){
					cmd.lines_vbBuffer=/*__JS__ */new ParamData(vertNumCopy*3*4,true);
				}
				cmd._lines_vbSize=cmd._vertNum *3 *4;
				var _vb=cmd.lines_vbBuffer._float32Data;
				var _i32b=cmd.lines_vbBuffer._int32Data;
				var ix=0;
				for (i=0;i < cmd._vertNum;i++){
					_vb[ix++]=cmd._lines_vbArray[i *2]+x;_vb[ix++]=cmd._lines_vbArray[i *2+1]+y;_i32b[ix++]=nColor;
				}
				if (!cmd.lines_ibBuffer || cmd.lines_ibBuffer.getByteLength()< (cmd._vertNum-2)*3 *2){
					cmd.lines_ibBuffer=/*__JS__ */new ParamData((vertNumCopy-2)*3 *2,true,true);
				}
				cmd._lines_ibSize=(cmd._vertNum-2)*3 *2;
				var _ib=cmd.lines_ibBuffer._int16Data;
				for (var ii=0;ii < (cmd._vertNum-2)*3;ii++){
					_ib[ii]=cmd._lines_ibArray[ii];
				}
			}
			if (brush){
				vertNumCopy=cmd._vertNum;
				var cur=Earcut.earcut(cmd._points,null,2);
				if (cur.length > 0){
					if (!cmd.fill_ibBuffer || cmd.fill_ibBuffer.getByteLength()< cur.length*2){
						cmd.fill_ibBuffer=/*__JS__ */new ParamData(cur.length*2,true,true);
					}
					cmd._fill_ibSize=cur.length *2;
					_ib=cmd.fill_ibBuffer._int16Data;
					var idxpos=0;
					for (ii=0;ii < cur.length;ii++){
						_ib[idxpos++]=cur[ii];
					}
				}
				c1=ColorUtils.create(brush.fillStyle);
				nColor=c1.numColor;
				if (!cmd.fill_vbBuffer || cmd.fill_vbBuffer.getByteLength()< cmd._vertNum *3 *4){
					cmd.fill_vbBuffer=/*__JS__ */new ParamData(vertNumCopy*3 *4,true);
				}
				cmd._fill_vbSize=cmd._vertNum *3 *4;
				_vb=cmd.fill_vbBuffer._float32Data;
				var _vb_i32b=cmd.fill_vbBuffer._int32Data;
				_vb_i32b=cmd.fill_vbBuffer._int32Data;
				ix=0;
				for (i=0;i < cmd._vertNum;i++){
					_vb[ix++]=cmd._points[i *2]+x;_vb[ix++]=cmd._points[i *2+1]+y;_vb_i32b[ix++]=nColor;
				}
			}
		};
		var _fb=cmd._paramData._float32Data;
		_i32b=cmd._paramData._int32Data;
		_i32b[0]=1;
		if (pen){
			_i32b[DrawPathCmdNative._PARAM_LINES_VB_POS_]=cmd.lines_vbBuffer.getPtrID();
			_i32b[DrawPathCmdNative._PARAM_LINES_IB_POS_]=cmd.lines_ibBuffer.getPtrID();
			_i32b[DrawPathCmdNative._PARAM_LINES_VB_SIZE_POS_]=cmd._lines_vbSize;
			_i32b[DrawPathCmdNative._PARAM_LINES_IB_SIZE_POS_]=cmd._lines_ibSize;
			_i32b[DrawPathCmdNative._PARAM_LINE_VB_OFFSET_POS_]=0;
			_i32b[DrawPathCmdNative._PARAM_LINE_IB_OFFSET_POS_]=0;
			_i32b[DrawPathCmdNative._PARAM_LINE_INDEX_ELEMENT_OFFSET_POS_]=0;
			LayaGL.syncBufferToRenderThread(cmd.lines_vbBuffer);
			LayaGL.syncBufferToRenderThread(cmd.lines_ibBuffer);
		}
		if (brush){
			_i32b[DrawPathCmdNative._PARAM_FILL_VB_POS_]=cmd.fill_vbBuffer.getPtrID();
			_i32b[DrawPathCmdNative._PARAM_FILL_IB_POS_]=cmd.fill_ibBuffer.getPtrID();
			_i32b[DrawPathCmdNative._PARAM_FILL_VB_SIZE_POS_]=cmd._fill_vbSize;
			_i32b[DrawPathCmdNative._PARAM_FILL_IB_SIZE_POS_]=cmd._fill_ibSize;
			_i32b[DrawPathCmdNative._PARAM_FILL_VB_OFFSET_POS_]=0;
			_i32b[DrawPathCmdNative._PARAM_FILL_IB_OFFSET_POS_]=0;
			_i32b[DrawPathCmdNative._PARAM_FILL_INDEX_ELEMENT_OFFSET_POS_]=0;
			LayaGL.syncBufferToRenderThread(cmd.fill_vbBuffer);
			LayaGL.syncBufferToRenderThread(cmd.fill_ibBuffer);
		}
		LayaGL.syncBufferToRenderThread(cmd._paramData);
		if (brush && pen){
			cmd._cmdCurrentPos=cmd._graphicsCmdEncoder.useCommandEncoder(DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		}
		else if (brush && !pen){
			cmd._cmdCurrentPos=cmd._graphicsCmdEncoder.useCommandEncoder(DrawPathCmdNative._DRAW_FILL_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		}
		else if (!brush && pen){
			cmd._cmdCurrentPos=cmd._graphicsCmdEncoder.useCommandEncoder(DrawPathCmdNative._DRAW_LINES_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		}
		LayaGL.syncBufferToRenderThread(cmd._graphicsCmdEncoder);
		return cmd;
	}

	DrawPathCmdNative.ID="DrawPath";
	DrawPathCmdNative._DRAW_LINES_CMD_ENCODER_=null;
	DrawPathCmdNative._DRAW_LINES_FILL_CMD_ENCODER_=null;
	DrawPathCmdNative._DRAW_FILL_CMD_ENCODER_=null;
	DrawPathCmdNative._PARAM_LINES_VB_POS_=1;
	DrawPathCmdNative._PARAM_LINES_IB_POS_=2;
	DrawPathCmdNative._PARAM_LINES_VB_SIZE_POS_=3;
	DrawPathCmdNative._PARAM_LINES_IB_SIZE_POS_=4;
	DrawPathCmdNative._PARAM_FILL_VB_POS_=5;
	DrawPathCmdNative._PARAM_FILL_IB_POS_=6;
	DrawPathCmdNative._PARAM_FILL_VB_SIZE_POS_=7;
	DrawPathCmdNative._PARAM_FILL_IB_SIZE_POS_=8;
	DrawPathCmdNative._PARAM_FILL_VB_OFFSET_POS_=9;
	DrawPathCmdNative._PARAM_FILL_IB_OFFSET_POS_=10;
	DrawPathCmdNative._PARAM_LINE_VB_OFFSET_POS_=11;
	DrawPathCmdNative._PARAM_LINE_IB_OFFSET_POS_=12;
	DrawPathCmdNative._PARAM_FILL_INDEX_ELEMENT_OFFSET_POS_=13;
	DrawPathCmdNative._PARAM_LINE_INDEX_ELEMENT_OFFSET_POS_=14;
	return DrawPathCmdNative;
})()



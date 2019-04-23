/**
*<code>/**
*<code>ColorFilterAction</code> 是一个颜色滤镜应用类。
*/
//class laya.filters.ColorFilterAction
var ColorFilterAction=(function(){
	function ColorFilterAction(){
		this.data=null;
	}

	__class(ColorFilterAction,'laya.filters.ColorFilterAction');
	var __proto=ColorFilterAction.prototype;
	/**
	*给指定的对象应用颜色滤镜。
	*@param srcCanvas 需要应用画布对象。
	*@return 应用了滤镜后的画布对象。
	*/
	__proto.apply=function(srcCanvas){
		var canvas=srcCanvas.canvas;
		var ctx=canvas.context;
		if (canvas.width==0 || canvas.height==0)return canvas;
		var imgdata=ctx.getImageData(0,0,canvas.width,canvas.height);
		var data=imgdata.data;
		var nData;
		for (var i=0,n=data.length;i < n;i+=4){
			nData=this.getColor(data[i],data[i+1],data[i+2],data[i+3]);
			if (data[i+3]==0)continue ;
			data[i]=nData[0];
			data[i+1]=nData[1];
			data[i+2]=nData[2];
			data[i+3]=nData[3];
		}
		ctx.putImageData(imgdata,0,0);
		return srcCanvas;
	}

	__proto.getColor=function(red,green,blue,alpha){
		var rst=[];
		if (this.data._mat && this.data._alpha){
			var mat=this.data._mat;
			var tempAlpha=this.data._alpha;
			rst[0]=mat[0] *red+mat[1] *green+mat[2] *blue+mat[3] *alpha+tempAlpha[0];
			rst[1]=mat[4] *red+mat[5] *green+mat[6] *blue+mat[7] *alpha+tempAlpha[1];
			rst[2]=mat[8] *red+mat[9] *green+mat[10] *blue+mat[11] *alpha+tempAlpha[2];
			rst[3]=mat[12] *red+mat[13] *green+mat[14] *blue+mat[15] *alpha+tempAlpha[3];
		}
		return rst;
	}

	return ColorFilterAction;
})()


/**
*@private
*Graphic bounds数据类
*/
//class laya.display.GraphicsBounds
var GraphicsBounds=(function(){
	function GraphicsBounds(){
		/**@private */
		//this._temp=null;
		/**@private */
		//this._bounds=null;
		/**@private */
		//this._rstBoundPoints=null;
		/**@private */
		this._cacheBoundsType=false;
		/**@private */
		//this._graphics=null;
	}

	__class(GraphicsBounds,'laya.display.GraphicsBounds');
	var __proto=GraphicsBounds.prototype;
	/**
	*销毁
	*/
	__proto.destroy=function(){
		this._graphics=null;
		this._cacheBoundsType=false;
		if (this._temp)this._temp.length=0;
		if (this._rstBoundPoints)this._rstBoundPoints.length=0;
		if (this._bounds)this._bounds.recover();
		this._bounds=null;
		Pool.recover("GraphicsBounds",this);
	}

	/**
	*重置数据
	*/
	__proto.reset=function(){
		this._temp && (this._temp.length=0);
	}

	/**
	*获取位置及宽高信息矩阵(比较耗CPU，频繁使用会造成卡顿，尽量少用)。
	*@param realSize （可选）使用图片的真实大小，默认为false
	*@return 位置与宽高组成的 一个 Rectangle 对象。
	*/
	__proto.getBounds=function(realSize){
		(realSize===void 0)&& (realSize=false);
		if (!this._bounds || !this._temp || this._temp.length < 1 || realSize !=this._cacheBoundsType){
			this._bounds=Rectangle._getWrapRec(this.getBoundPoints(realSize),this._bounds)
		}
		this._cacheBoundsType=realSize;
		return this._bounds;
	}

	/**
	*@private
	*@param realSize （可选）使用图片的真实大小，默认为false
	*获取端点列表。
	*/
	__proto.getBoundPoints=function(realSize){
		(realSize===void 0)&& (realSize=false);
		if (!this._temp || this._temp.length < 1 || realSize !=this._cacheBoundsType)
			this._temp=this._getCmdPoints(realSize);
		this._cacheBoundsType=realSize;
		return this._rstBoundPoints=Utils.copyArray(this._rstBoundPoints,this._temp);
	}

	__proto._getCmdPoints=function(realSize){
		(realSize===void 0)&& (realSize=false);
		var context=Render._context;
		var cmds=this._graphics.cmds;
		var rst;
		rst=this._temp || (this._temp=[]);
		rst.length=0;
		if (!cmds && this._graphics._one !=null){
			GraphicsBounds._tempCmds.length=0;
			GraphicsBounds._tempCmds.push(this._graphics._one);
			cmds=GraphicsBounds._tempCmds;
		}
		if (!cmds)return rst;
		var matrixs=GraphicsBounds._tempMatrixArrays;
		matrixs.length=0;
		var tMatrix=GraphicsBounds._initMatrix;
		tMatrix.identity();
		var tempMatrix=GraphicsBounds._tempMatrix;
		var cmd;
		var tex;
		for (var i=0,n=cmds.length;i < n;i++){
			cmd=cmds[i];
			switch (cmd.cmdID){
				case /*laya.display.cmd.AlphaCmd.ID*/"Alpha":
					matrixs.push(tMatrix);
					tMatrix=tMatrix.clone();
					break ;
				case /*laya.display.cmd.RestoreCmd.ID*/"Restore":
					tMatrix=matrixs.pop();
					break ;
				case /*laya.display.cmd.ScaleCmd.ID*/"Scale":
					tempMatrix.identity();
					tempMatrix.translate(-cmd.pivotX,-cmd.pivotY);
					tempMatrix.scale(cmd.scaleX,cmd.scaleY);
					tempMatrix.translate(cmd.pivotX,cmd.pivotY);
					this._switchMatrix(tMatrix,tempMatrix);
					break ;
				case /*laya.display.cmd.RotateCmd.ID*/"Rotate":
					tempMatrix.identity();
					tempMatrix.translate(-cmd.pivotX,-cmd.pivotY);
					tempMatrix.rotate(cmd.angle);
					tempMatrix.translate(cmd.pivotX,cmd.pivotY);
					this._switchMatrix(tMatrix,tempMatrix);
					break ;
				case /*laya.display.cmd.TranslateCmd.ID*/"Translate":
					tempMatrix.identity();
					tempMatrix.translate(cmd.tx,cmd.ty);
					this._switchMatrix(tMatrix,tempMatrix);
					break ;
				case /*laya.display.cmd.TransformCmd.ID*/"Transform":
					tempMatrix.identity();
					tempMatrix.translate(-cmd.pivotX,-cmd.pivotY);
					tempMatrix.concat(cmd.matrix);
					tempMatrix.translate(cmd.pivotX,cmd.pivotY);
					this._switchMatrix(tMatrix,tempMatrix);
					break ;
				case /*laya.display.cmd.DrawImageCmd.ID*/"DrawImage":
				case /*laya.display.cmd.FillTextureCmd.ID*/"FillTexture":
					GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd.x,cmd.y,cmd.width,cmd.height),tMatrix);
					break ;
				case /*laya.display.cmd.DrawTextureCmd.ID*/"DrawTexture":
					tMatrix.copyTo(tempMatrix);
					if(cmd.matrix)
						tempMatrix.concat(cmd.matrix);
					GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd.x,cmd.y,cmd.width,cmd.height),tempMatrix);
					break ;
				case /*laya.display.cmd.DrawImageCmd.ID*/"DrawImage":
					tex=cmd.texture;
					if (realSize){
						if (cmd.width && cmd.height){
							GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd.x,cmd.y,cmd.width,cmd.height),tMatrix);
							}else {
							GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd.x,cmd.y,tex.width,tex.height),tMatrix);
						}
						}else {
						var wRate=(cmd.width || tex.sourceWidth)/ tex.width;
						var hRate=(cmd.height || tex.sourceHeight)/ tex.height;
						var oWidth=wRate *tex.sourceWidth;
						var oHeight=hRate *tex.sourceHeight;
						var offX=tex.offsetX > 0 ? tex.offsetX :0;
						var offY=tex.offsetY > 0 ? tex.offsetY :0;
						offX *=wRate;
						offY *=hRate;
						GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd.x-offX,cmd.y-offY,oWidth,oHeight),tMatrix);
					}
					break ;
				case /*laya.display.cmd.FillTextureCmd.ID*/"FillTexture":
					if (cmd.width && cmd.height){
						GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd.x,cmd.y,cmd.width,cmd.height),tMatrix);
						}else {
						tex=cmd.texture;
						GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd.x,cmd.y,tex.width,tex.height),tMatrix);
					}
					break ;
				case /*laya.display.cmd.DrawTextureCmd.ID*/"DrawTexture":;
					var drawMatrix;
					if (cmd.matrix){
						tMatrix.copyTo(tempMatrix);
						tempMatrix.concat(cmd.matrix);
						drawMatrix=tempMatrix;
						}else {
						drawMatrix=tMatrix;
					}
					if (realSize){
						if (cmd.width && cmd.height){
							GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd.x,cmd.y,cmd.width,cmd.height),drawMatrix);
							}else {
							tex=cmd.texture;
							GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd.x,cmd.y,tex.width,tex.height),drawMatrix);
						}
						}else {
						tex=cmd.texture;
						wRate=(cmd.width || tex.sourceWidth)/ tex.width;
						hRate=(cmd.height || tex.sourceHeight)/ tex.height;
						oWidth=wRate *tex.sourceWidth;
						oHeight=hRate *tex.sourceHeight;
						offX=tex.offsetX > 0 ? tex.offsetX :0;
						offY=tex.offsetY > 0 ? tex.offsetY :0;
						offX *=wRate;
						offY *=hRate;
						GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd.x-offX,cmd.y-offY,oWidth,oHeight),drawMatrix);
					}
					break ;
				case /*laya.display.cmd.DrawRectCmd.ID*/"DrawRect":
					GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd.x,cmd.y,cmd.width,cmd.height),tMatrix);
					break ;
				case /*laya.display.cmd.DrawCircleCmd.ID*/"DrawCircle":
					GraphicsBounds._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd.x-cmd.radius,cmd.y-cmd.radius,cmd.radius+cmd.radius,cmd.radius+cmd.radius),tMatrix);
					break ;
				case /*laya.display.cmd.DrawLineCmd.ID*/"DrawLine":
					GraphicsBounds._tempPoints.length=0;
					var lineWidth=NaN;
					lineWidth=cmd.lineWidth *0.5;
					if (cmd.fromX==cmd.toX){
						GraphicsBounds._tempPoints.push(cmd.fromX+lineWidth,cmd.fromY,cmd.toX+lineWidth,cmd.toY,cmd.fromX-lineWidth,cmd.fromY,cmd.toX-lineWidth,cmd.toY);
						}else if (cmd.fromY==cmd.toY){
						GraphicsBounds._tempPoints.push(cmd.fromX,cmd.fromY+lineWidth,cmd.toX,cmd.toY+lineWidth,cmd.fromX,cmd.fromY-lineWidth,cmd.toX,cmd.toY-lineWidth);
						}else {
						GraphicsBounds._tempPoints.push(cmd.fromX,cmd.fromY,cmd.toX,cmd.toY);
					}
					GraphicsBounds._addPointArrToRst(rst,GraphicsBounds._tempPoints,tMatrix);
					break ;
				case /*laya.display.cmd.DrawCurvesCmd.ID*/"DrawCurves":
					GraphicsBounds._addPointArrToRst(rst,Bezier.I.getBezierPoints(cmd.points),tMatrix,cmd.x,cmd.y);
					break ;
				case /*laya.display.cmd.DrawLinesCmd.ID*/"DrawLines":
				case /*laya.display.cmd.DrawPolyCmd.ID*/"DrawPoly":
					GraphicsBounds._addPointArrToRst(rst,cmd.points,tMatrix,cmd.x,cmd.y);
					break ;
				case /*laya.display.cmd.DrawPathCmd.ID*/"DrawPath":
					GraphicsBounds._addPointArrToRst(rst,this._getPathPoints(cmd.paths),tMatrix,cmd.x,cmd.y);
					break ;
				case /*laya.display.cmd.DrawPieCmd.ID*/"DrawPie":
					GraphicsBounds._addPointArrToRst(rst,this._getPiePoints(cmd.x,cmd.y,cmd.radius,cmd.startAngle,cmd.endAngle),tMatrix);
					break ;
				}
		}
		if (rst.length > 200){
			rst=Utils.copyArray(rst,Rectangle._getWrapRec(rst)._getBoundPoints());
		}else if (rst.length > 8)
		rst=GrahamScan.scanPList(rst);
		return rst;
	}

	__proto._switchMatrix=function(tMatix,tempMatrix){
		tempMatrix.concat(tMatix);
		tempMatrix.copyTo(tMatix);
	}

	__proto._getPiePoints=function(x,y,radius,startAngle,endAngle){
		var rst=GraphicsBounds._tempPoints;
		GraphicsBounds._tempPoints.length=0;
		rst.push(x,y);
		var dP=Math.PI / 10;
		var i=NaN;
		for (i=startAngle;i < endAngle;i+=dP){
			rst.push(x+radius *Math.cos(i),y+radius *Math.sin(i));
		}
		if (endAngle !=i){
			rst.push(x+radius *Math.cos(endAngle),y+radius *Math.sin(endAngle));
		}
		return rst;
	}

	__proto._getPathPoints=function(paths){
		var i=0,len=0;
		var rst=GraphicsBounds._tempPoints;
		rst.length=0;
		len=paths.length;
		var tCMD;
		for (i=0;i < len;i++){
			tCMD=paths[i];
			if (tCMD.length > 1){
				rst.push(tCMD[1],tCMD[2]);
				if (tCMD.length > 3){
					rst.push(tCMD[3],tCMD[4]);
				}
			}
		}
		return rst;
	}

	GraphicsBounds.create=function(){
		return Pool.getItemByClass("GraphicsBounds",GraphicsBounds);
	}

	GraphicsBounds._addPointArrToRst=function(rst,points,matrix,dx,dy){
		(dx===void 0)&& (dx=0);
		(dy===void 0)&& (dy=0);
		var i=0,len=0;
		len=points.length;
		for (i=0;i < len;i+=2){
			GraphicsBounds._addPointToRst(rst,points[i]+dx,points[i+1]+dy,matrix);
		}
	}

	GraphicsBounds._addPointToRst=function(rst,x,y,matrix){
		var _tempPoint=Point.TEMP;
		_tempPoint.setTo(x ? x :0,y ? y :0);
		matrix.transformPoint(_tempPoint);
		rst.push(_tempPoint.x,_tempPoint.y);
	}

	GraphicsBounds._tempPoints=[];
	GraphicsBounds._tempMatrixArrays=[];
	GraphicsBounds._tempCmds=[];
	__static(GraphicsBounds,
	['_tempMatrix',function(){return this._tempMatrix=new Matrix();},'_initMatrix',function(){return this._initMatrix=new Matrix();}
	]);
	return GraphicsBounds;
})()


/**

*/
*/
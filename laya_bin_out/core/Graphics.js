/**
*<code>Graphics</code> 类用于创建绘图显示对象。Graphics可以同时绘制多个位图或者矢量图，还可以结合save，restore，transform，scale，rotate，translate，alpha等指令对绘图效果进行变化。
*Graphics以命令流方式存储，可以通过cmds属性访问所有命令流。Graphics是比Sprite更轻量级的对象，合理使用能提高应用性能(比如把大量的节点绘图改为一个节点的Graphics命令集合，能减少大量节点创建消耗)。
*@see laya.display.Sprite#graphics
*/
//class laya.display.Graphics
var Graphics=(function(){
	function Graphics(){
		/**@private */
		//this._sp=null;
		/**@private */
		this._one=null;
		/**@private */
		this._cmds=null;
		/**@private */
		//this._vectorgraphArray=null;
		/**@private */
		//this._graphicBounds=null;
		/**@private */
		this.autoDestroy=false;
		this._render=this._renderEmpty;
		this._createData();
	}

	__class(Graphics,'laya.display.Graphics');
	var __proto=Graphics.prototype;
	/**@private */
	__proto._createData=function(){}
	/**@private */
	__proto._clearData=function(){}
	/**@private */
	__proto._destroyData=function(){}
	/**
	*<p>销毁此对象。</p>
	*/
	__proto.destroy=function(){
		this.clear(true);
		if (this._graphicBounds)this._graphicBounds.destroy();
		this._graphicBounds=null;
		this._vectorgraphArray=null;
		if (this._sp){
			this._sp._renderType=0;
			this._sp._setRenderType(0);
			this._sp=null;
		}
		this._destroyData();
	}

	/**
	*<p>清空绘制命令。</p>
	*@param recoverCmds 是否回收绘图指令数组，设置为true，则对指令数组进行回收以节省内存开销，建议设置为true进行回收，但如果手动引用了数组，不建议回收
	*/
	__proto.clear=function(recoverCmds){
		(recoverCmds===void 0)&& (recoverCmds=true);
		if (recoverCmds){
			var tCmd=this._one;
			if (this._cmds){
				var i=0,len=this._cmds.length;
				for (i=0;i < len;i++){
					tCmd=this._cmds[i];
					tCmd.recover();
				}
				this._cmds.length=0;
				}else if (tCmd){
				tCmd.recover();
			}
			}else {
			this._cmds=null;
		}
		this._one=null;
		this._render=this._renderEmpty;
		this._clearData();
		if (this._sp){
			this._sp._renderType &=~ /*laya.display.SpriteConst.GRAPHICS*/0x200;
			this._sp._setRenderType(this._sp._renderType);
		}
		this._repaint();
		if (this._vectorgraphArray){
			for (i=0,len=this._vectorgraphArray.length;i < len;i++){
				VectorGraphManager.getInstance().deleteShape(this._vectorgraphArray[i]);
			}
			this._vectorgraphArray.length=0;
		}
	}

	/**@private */
	__proto._clearBoundsCache=function(){
		if (this._graphicBounds)this._graphicBounds.reset();
	}

	/**@private */
	__proto._initGraphicBounds=function(){
		if (!this._graphicBounds){
			this._graphicBounds=GraphicsBounds.create();
			this._graphicBounds._graphics=this;
		}
	}

	/**
	*@private
	*重绘此对象。
	*/
	__proto._repaint=function(){
		this._clearBoundsCache();
		this._sp && this._sp.repaint();
	}

	//TODO:coverage
	__proto._isOnlyOne=function(){
		return !this._cmds || this._cmds.length===0;
	}

	/**
	*获取位置及宽高信息矩阵(比较耗CPU，频繁使用会造成卡顿，尽量少用)。
	*@param realSize （可选）使用图片的真实大小，默认为false
	*@return 位置与宽高组成的 一个 Rectangle 对象。
	*/
	__proto.getBounds=function(realSize){
		(realSize===void 0)&& (realSize=false);
		this._initGraphicBounds();
		return this._graphicBounds.getBounds(realSize);
	}

	/**
	*@private
	*@param realSize （可选）使用图片的真实大小，默认为false
	*获取端点列表。
	*/
	__proto.getBoundPoints=function(realSize){
		(realSize===void 0)&& (realSize=false);
		this._initGraphicBounds();
		return this._graphicBounds.getBoundPoints(realSize);
	}

	/**
	*绘制单独图片
	*@param texture 纹理。
	*@param x （可选）X轴偏移量。
	*@param y （可选）Y轴偏移量。
	*@param width （可选）宽度。
	*@param height （可选）高度。
	*/
	__proto.drawImage=function(texture,x,y,width,height){
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		if (!texture)return null;
		if (!width)width=texture.sourceWidth;
		if (!height)height=texture.sourceHeight;
		if (texture.getIsReady()){
			var wRate=width / texture.sourceWidth;
			var hRate=height / texture.sourceHeight;
			width=texture.width *wRate;
			height=texture.height *hRate;
			if (width <=0 || height <=0)return null;
			x+=texture.offsetX *wRate;
			y+=texture.offsetY *hRate;
		}
		if (this._sp){
			this._sp._renderType |=/*laya.display.SpriteConst.GRAPHICS*/0x200;
			this._sp._setRenderType(this._sp._renderType);
		};
		var args=DrawImageCmd.create.call(this,texture,x,y,width,height);
		if (this._one==null){
			this._one=args;
			this._render=this._renderOneImg;
			}else {
			this._saveToCmd(null,args);
		}
		this._repaint();
		return args;
	}

	/**
	*绘制纹理，相比drawImage功能更强大，性能会差一些
	*@param texture 纹理。
	*@param x （可选）X轴偏移量。
	*@param y （可选）Y轴偏移量。
	*@param width （可选）宽度。
	*@param height （可选）高度。
	*@param matrix （可选）矩阵信息。
	*@param alpha （可选）透明度。
	*@param color （可选）颜色滤镜。
	*@param blendMode （可选）混合模式。
	*/
	__proto.drawTexture=function(texture,x,y,width,height,matrix,alpha,color,blendMode){
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		(alpha===void 0)&& (alpha=1);
		if (!texture || alpha < 0.01)return null;
		if (!texture.getIsReady())return null;
		if (!width)width=texture.sourceWidth;
		if (!height)height=texture.sourceHeight;
		if (texture.getIsReady()){
			var offset=(!Render.isWebGL && (Browser.onFirefox || Browser.onEdge || Browser.onIE || Browser.onSafari))? 0.5 :0;
			var wRate=width / texture.sourceWidth;
			var hRate=height / texture.sourceHeight;
			width=texture.width *wRate;
			height=texture.height *hRate;
			if (width <=0 || height <=0)return null;
			x+=texture.offsetX *wRate;
			y+=texture.offsetY *hRate;
			x-=offset;
			y-=offset;
			width+=2 *offset;
			height+=2 *offset;
		}
		if (this._sp){
			this._sp._renderType |=/*laya.display.SpriteConst.GRAPHICS*/0x200;
			this._sp._setRenderType(this._sp._renderType);
		}
		if (!Render.isConchApp && !Render.isWebGL && (blendMode || color)){
			var canvas=new HTMLCanvas();
			canvas.size(width,height);
			var ctx=canvas.getContext('2d');
			ctx.drawTexture(texture,0,0,width,height);
			texture=new Texture(canvas);
			if (color){
				var filter=new ColorFilterAction();
				var colorArr=ColorUtils.create(color).arrColor;
				filter.data=new ColorFilter().color(colorArr[0] *255,colorArr[1] *255,colorArr[2] *255);
				filter.apply({canvas:canvas});
			}
		};
		var args=DrawTextureCmd.create.call(this,texture,x,y,width,height,matrix,alpha,color,blendMode);
		this._repaint();
		return this._saveToCmd(null,args);
	}

	/**
	*批量绘制同样纹理。
	*@param texture 纹理。
	*@param pos 绘制次数和坐标。
	*/
	__proto.drawTextures=function(texture,pos){
		if (!texture)return null;
		return this._saveToCmd(Render._context._drawTextures,DrawTexturesCmd.create.call(this,texture,pos));
	}

	/**
	*绘制一组三角形
	*@param texture 纹理。
	*@param x X轴偏移量。
	*@param y Y轴偏移量。
	*@param vertices 顶点数组。
	*@param indices 顶点索引。
	*@param uvData UV数据。
	*@param matrix 缩放矩阵。
	*@param alpha alpha
	*@param color 颜色变换
	*@param blendMode blend模式
	*/
	__proto.drawTriangles=function(texture,x,y,vertices,uvs,indices,matrix,alpha,color,blendMode){
		(alpha===void 0)&& (alpha=1);
		return this._saveToCmd(Render._context.drawTriangles,DrawTrianglesCmd.create.call(this,texture,x,y,vertices,uvs,indices,matrix,alpha,color,blendMode));
	}

	/**
	*用texture填充。
	*@param texture 纹理。
	*@param x X轴偏移量。
	*@param y Y轴偏移量。
	*@param width （可选）宽度。
	*@param height （可选）高度。
	*@param type （可选）填充类型 repeat|repeat-x|repeat-y|no-repeat
	*@param offset （可选）贴图纹理偏移
	*
	*/
	__proto.fillTexture=function(texture,x,y,width,height,type,offset){
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		(type===void 0)&& (type="repeat");
		if (texture && texture.getIsReady())
			return this._saveToCmd(Render._context._fillTexture,FillTextureCmd.create.call(this,texture,x,y,width,height,type,offset || Point.EMPTY,{}));
		else
		return null;
	}

	/**
	*@private
	*保存到命令流。
	*/
	__proto._saveToCmd=function(fun,args){
		if (this._sp)
		{
			this._sp._renderType |=/*laya.display.SpriteConst.GRAPHICS*/0x200;
			this._sp._setRenderType(this._sp._renderType);
		}

		if (this._one==null)
		{
			this._one=args;
			this._render=this._renderOne;
		}
		else 
		{
			this._render=this._renderAll;
			(this._cmds || (this._cmds=[])).length===0 && this._cmds.push(this._one);
			this._cmds.push(args);
		}

		this._repaint();
		return args;
	}

	/**
	*设置剪裁区域，超出剪裁区域的坐标不显示。
	*@param x X 轴偏移量。
	*@param y Y 轴偏移量。
	*@param width 宽度。
	*@param height 高度。
	*/
	__proto.clipRect=function(x,y,width,height){
		return this._saveToCmd(Render._context._clipRect,ClipRectCmd.create.call(this,x,y,width,height));
	}

	/**
	*在画布上绘制文本。
	*@param text 在画布上输出的文本。
	*@param x 开始绘制文本的 x 坐标位置（相对于画布）。
	*@param y 开始绘制文本的 y 坐标位置（相对于画布）。
	*@param font 定义字号和字体，比如"20px Arial"。
	*@param color 定义文本颜色，比如"#ff0000"。
	*@param textAlign 文本对齐方式，可选值："left"，"center"，"right"。
	*/
	__proto.fillText=function(text,x,y,font,color,textAlign){
		return this._saveToCmd(Render._context._fillText,FillTextCmd.create.call(this,text,x,y,font || Text.defaultFontStr(),color,textAlign));
	}

	/**
	*在画布上绘制“被填充且镶边的”文本。
	*@param text 在画布上输出的文本。
	*@param x 开始绘制文本的 x 坐标位置（相对于画布）。
	*@param y 开始绘制文本的 y 坐标位置（相对于画布）。
	*@param font 定义字体和字号，比如"20px Arial"。
	*@param fillColor 定义文本颜色，比如"#ff0000"。
	*@param borderColor 定义镶边文本颜色。
	*@param lineWidth 镶边线条宽度。
	*@param textAlign 文本对齐方式，可选值："left"，"center"，"right"。
	*/
	__proto.fillBorderText=function(text,x,y,font,fillColor,borderColor,lineWidth,textAlign){
		return this._saveToCmd(Render._context._fillBorderText,FillBorderTextCmd.create.call(this,text,x,y,font || Text.defaultFontStr(),fillColor,borderColor,lineWidth,textAlign));
	}

	/***@private */
	__proto.fillWords=function(words,x,y,font,color){
		return this._saveToCmd(Render._context._fillWords,FillWordsCmd.create.call(this,words,x,y,font || Text.defaultFontStr(),color));
	}

	/***@private */
	__proto.fillBorderWords=function(words,x,y,font,fillColor,borderColor,lineWidth){
		return this._saveToCmd(Render._context._fillBorderWords,FillBorderWordsCmd.create.call(this,words,x,y,font || Text.defaultFontStr(),fillColor,borderColor,lineWidth));
	}

	/**
	*在画布上绘制文本（没有填色）。文本的默认颜色是黑色。
	*@param text 在画布上输出的文本。
	*@param x 开始绘制文本的 x 坐标位置（相对于画布）。
	*@param y 开始绘制文本的 y 坐标位置（相对于画布）。
	*@param font 定义字体和字号，比如"20px Arial"。
	*@param color 定义文本颜色，比如"#ff0000"。
	*@param lineWidth 线条宽度。
	*@param textAlign 文本对齐方式，可选值："left"，"center"，"right"。
	*/
	__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
		return this._saveToCmd(Render._context._strokeText,StrokeTextCmd.create.call(this,text,x,y,font || Text.defaultFontStr(),color,lineWidth,textAlign));
	}

	/**
	*设置透明度。
	*@param value 透明度。
	*/
	__proto.alpha=function(alpha){
		return this._saveToCmd(Render._context._alpha,AlphaCmd.create.call(this,alpha));
	}

	/**
	*替换绘图的当前转换矩阵。
	*@param mat 矩阵。
	*@param pivotX （可选）水平方向轴心点坐标。
	*@param pivotY （可选）垂直方向轴心点坐标。
	*/
	__proto.transform=function(matrix,pivotX,pivotY){
		(pivotX===void 0)&& (pivotX=0);
		(pivotY===void 0)&& (pivotY=0);
		return this._saveToCmd(Render._context._transform,TransformCmd.create.call(this,matrix,pivotX,pivotY));
	}

	/**
	*旋转当前绘图。(推荐使用transform，性能更高)
	*@param angle 旋转角度，以弧度计。
	*@param pivotX （可选）水平方向轴心点坐标。
	*@param pivotY （可选）垂直方向轴心点坐标。
	*/
	__proto.rotate=function(angle,pivotX,pivotY){
		(pivotX===void 0)&& (pivotX=0);
		(pivotY===void 0)&& (pivotY=0);
		return this._saveToCmd(Render._context._rotate,RotateCmd.create.call(this,angle,pivotX,pivotY));
	}

	/**
	*缩放当前绘图至更大或更小。(推荐使用transform，性能更高)
	*@param scaleX 水平方向缩放值。
	*@param scaleY 垂直方向缩放值。
	*@param pivotX （可选）水平方向轴心点坐标。
	*@param pivotY （可选）垂直方向轴心点坐标。
	*/
	__proto.scale=function(scaleX,scaleY,pivotX,pivotY){
		(pivotX===void 0)&& (pivotX=0);
		(pivotY===void 0)&& (pivotY=0);
		return this._saveToCmd(Render._context._scale,ScaleCmd.create.call(this,scaleX,scaleY,pivotX,pivotY));
	}

	/**
	*重新映射画布上的 (0,0)位置。
	*@param x 添加到水平坐标（x）上的值。
	*@param y 添加到垂直坐标（y）上的值。
	*/
	__proto.translate=function(tx,ty){
		return this._saveToCmd(Render._context._translate,TranslateCmd.create.call(this,tx,ty));
	}

	/**
	*保存当前环境的状态。
	*/
	__proto.save=function(){
		return this._saveToCmd(Render._context._save,SaveCmd.create.call(this));
	}

	/**
	*返回之前保存过的路径状态和属性。
	*/
	__proto.restore=function(){
		return this._saveToCmd(Render._context._restore,RestoreCmd.create.call(this));
	}

	/**
	*@private
	*替换文本内容。
	*@param text 文本内容。
	*@return 替换成功则值为true，否则值为flase。
	*/
	__proto.replaceText=function(text){
		this._repaint();
		var cmds=this._cmds;
		if (!cmds){
			if (this._one && this._isTextCmd(this._one)){
				this._one.text=text;
				return true;
			}
			}else {
			for (var i=cmds.length-1;i >-1;i--){
				if (this._isTextCmd(cmds[i])){
					cmds[i].text=text;
					return true;
				}
			}
		}
		return false;
	}

	/**@private */
	__proto._isTextCmd=function(cmd){
		var cmdID=cmd.cmdID;
		return cmdID==/*laya.display.cmd.FillTextCmd.ID*/"FillText" || cmdID==/*laya.display.cmd.StrokeTextCmd.ID*/"StrokeText" || cmdID==/*laya.display.cmd.FillBorderTextCmd.ID*/"FillBorderText";
	}

	/**
	*@private
	*替换文本颜色。
	*@param color 颜色。
	*/
	__proto.replaceTextColor=function(color){
		this._repaint();
		var cmds=this._cmds;
		if (!cmds){
			if (this._one && this._isTextCmd(this._one)){
				this._setTextCmdColor(this._one,color);
			}
			}else {
			for (var i=cmds.length-1;i >-1;i--){
				if (this._isTextCmd(cmds[i])){
					this._setTextCmdColor(cmds[i],color);
				}
			}
		}
	}

	/**@private */
	__proto._setTextCmdColor=function(cmdO,color){
		var cmdID=cmdO.cmdID;
		switch (cmdID){
			case /*laya.display.cmd.FillTextCmd.ID*/"FillText":
			case /*laya.display.cmd.StrokeTextCmd.ID*/"StrokeText":
				cmdO.color=color;
				break ;
			case /*laya.display.cmd.FillBorderTextCmd.ID*/"FillBorderText":
			case /*laya.display.cmd.FillBorderWordsCmd.ID*/"FillBorderWords":
			case /*laya.display.cmd.FillBorderTextCmd.ID*/"FillBorderText":
				cmdO.fillColor=color;
				break ;
			}
	}

	/**
	*加载并显示一个图片。
	*@param url 图片地址。
	*@param x （可选）显示图片的x位置。
	*@param y （可选）显示图片的y位置。
	*@param width （可选）显示图片的宽度，设置为0表示使用图片默认宽度。
	*@param height （可选）显示图片的高度，设置为0表示使用图片默认高度。
	*@param complete （可选）加载完成回调。
	*/
	__proto.loadImage=function(url,x,y,width,height,complete){
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		var tex=Loader.getRes(url);
		if (!tex){
			tex=new Texture();
			tex.load(url);
			Loader.cacheRes(url,tex);
			tex.once(/*laya.events.Event.READY*/"ready",this,this.drawImage,[tex,x,y,width,height]);
			}else {
			if (!tex.getIsReady()){
				tex.once(/*laya.events.Event.READY*/"ready",this,this.drawImage,[tex,x,y,width,height]);
			}else
			this.drawImage(tex,x,y,width,height);
		}
		if (complete !=null){
			tex.getIsReady()? complete.call(this._sp):tex.on(/*laya.events.Event.READY*/"ready",this._sp,complete);
		}
	}

	/**
	*@private
	*/
	__proto._renderEmpty=function(sprite,context,x,y){}
	/**
	*@private
	*/
	__proto._renderAll=function(sprite,context,x,y){
		var cmds=this._cmds,cmd;
		for (var i=0,n=cmds.length;i < n;i++){
			(cmd=cmds[i]).run(context,x,y);
		}
	}

	/**
	*@private
	*/
	__proto._renderOne=function(sprite,context,x,y){
		this._one.run(context,x,y);
	}

	/**
	*@private
	*/
	__proto._renderOneImg=function(sprite,context,x,y){
		this._one.run(context,x,y);
	}

	/**
	*绘制一条线。
	*@param fromX X轴开始位置。
	*@param fromY Y轴开始位置。
	*@param toX X轴结束位置。
	*@param toY Y轴结束位置。
	*@param lineColor 颜色。
	*@param lineWidth （可选）线条宽度。
	*/
	__proto.drawLine=function(fromX,fromY,toX,toY,lineColor,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		var tId=0;
		if (Render.isWebGL){
			tId=VectorGraphManager.getInstance().getId();
			if (this._vectorgraphArray==null)this._vectorgraphArray=[];
			this._vectorgraphArray.push(tId);
		};
		var offset=(lineWidth < 1 || lineWidth % 2===0)? 0 :0.5;
		return this._saveToCmd(Render._context._drawLine,DrawLineCmd.create.call(this,fromX+offset,fromY+offset,toX+offset,toY+offset,lineColor,lineWidth,tId));
	}

	/**
	*绘制一系列线段。
	*@param x 开始绘制的X轴位置。
	*@param y 开始绘制的Y轴位置。
	*@param points 线段的点集合。格式:[x1,y1,x2,y2,x3,y3...]。
	*@param lineColor 线段颜色，或者填充绘图的渐变对象。
	*@param lineWidth （可选）线段宽度。
	*/
	__proto.drawLines=function(x,y,points,lineColor,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		var tId=0;
		if (!points || points.length < 4)return null;
		if (Render.isWebGL){
			tId=VectorGraphManager.getInstance().getId();
			if (this._vectorgraphArray==null)this._vectorgraphArray=[];
			this._vectorgraphArray.push(tId);
		};
		var offset=(lineWidth < 1 || lineWidth % 2===0)? 0 :0.5;
		return this._saveToCmd(Render._context._drawLines,DrawLinesCmd.create.call(this,x+offset,y+offset,points,lineColor,lineWidth,tId));
	}

	/**
	*绘制一系列曲线。
	*@param x 开始绘制的 X 轴位置。
	*@param y 开始绘制的 Y 轴位置。
	*@param points 线段的点集合，格式[controlX,controlY,anchorX,anchorY...]。
	*@param lineColor 线段颜色，或者填充绘图的渐变对象。
	*@param lineWidth （可选）线段宽度。
	*/
	__proto.drawCurves=function(x,y,points,lineColor,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		return this._saveToCmd(Render._context._drawCurves,DrawCurvesCmd.create.call(this,x,y,points,lineColor,lineWidth));
	}

	/**
	*绘制矩形。
	*@param x 开始绘制的 X 轴位置。
	*@param y 开始绘制的 Y 轴位置。
	*@param width 矩形宽度。
	*@param height 矩形高度。
	*@param fillColor 填充颜色，或者填充绘图的渐变对象。
	*@param lineColor （可选）边框颜色，或者填充绘图的渐变对象。
	*@param lineWidth （可选）边框宽度。
	*/
	__proto.drawRect=function(x,y,width,height,fillColor,lineColor,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		var offset=(lineWidth >=1 && lineColor)? lineWidth / 2 :0;
		var lineOffset=lineColor ? lineWidth :0;
		return this._saveToCmd(Render._context.drawRect,DrawRectCmd.create.call(this,x+offset,y+offset,width-lineOffset,height-lineOffset,fillColor,lineColor,lineWidth));
	}

	/**
	*绘制圆形。
	*@param x 圆点X 轴位置。
	*@param y 圆点Y 轴位置。
	*@param radius 半径。
	*@param fillColor 填充颜色，或者填充绘图的渐变对象。
	*@param lineColor （可选）边框颜色，或者填充绘图的渐变对象。
	*@param lineWidth （可选）边框宽度。
	*/
	__proto.drawCircle=function(x,y,radius,fillColor,lineColor,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		var offset=(lineWidth >=1 && lineColor)? lineWidth / 2 :0;
		var tId=0;
		if (Render.isWebGL){
			tId=VectorGraphManager.getInstance().getId();
			if (this._vectorgraphArray==null)this._vectorgraphArray=[];
			this._vectorgraphArray.push(tId);
		}
		return this._saveToCmd(Render._context._drawCircle,DrawCircleCmd.create.call(this,x,y,radius-offset,fillColor,lineColor,lineWidth,tId));
	}

	/**
	*绘制扇形。
	*@param x 开始绘制的 X 轴位置。
	*@param y 开始绘制的 Y 轴位置。
	*@param radius 扇形半径。
	*@param startAngle 开始角度。
	*@param endAngle 结束角度。
	*@param fillColor 填充颜色，或者填充绘图的渐变对象。
	*@param lineColor （可选）边框颜色，或者填充绘图的渐变对象。
	*@param lineWidth （可选）边框宽度。
	*/
	__proto.drawPie=function(x,y,radius,startAngle,endAngle,fillColor,lineColor,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		var offset=(lineWidth >=1 && lineColor)? lineWidth / 2 :0;
		var lineOffset=lineColor ? lineWidth :0;
		var tId=0;
		if (Render.isWebGL){
			tId=VectorGraphManager.getInstance().getId();
			if (this._vectorgraphArray==null)this._vectorgraphArray=[];
			this._vectorgraphArray.push(tId);
		}
		return this._saveToCmd(Render._context._drawPie,DrawPieCmd.create.call(this,x+offset,y+offset,radius-lineOffset,Utils.toRadian(startAngle),Utils.toRadian(endAngle),fillColor,lineColor,lineWidth,tId));
	}

	/**
	*绘制多边形。
	*@param x 开始绘制的 X 轴位置。
	*@param y 开始绘制的 Y 轴位置。
	*@param points 多边形的点集合。
	*@param fillColor 填充颜色，或者填充绘图的渐变对象。
	*@param lineColor （可选）边框颜色，或者填充绘图的渐变对象。
	*@param lineWidth （可选）边框宽度。
	*/
	__proto.drawPoly=function(x,y,points,fillColor,lineColor,lineWidth){
		(lineWidth===void 0)&& (lineWidth=1);
		var tId=0;
		if (Render.isWebGL){
			tId=VectorGraphManager.getInstance().getId();
			if (this._vectorgraphArray==null)this._vectorgraphArray=[];
			this._vectorgraphArray.push(tId);
			var tIsConvexPolygon=false;
			if (points.length > 6){
				tIsConvexPolygon=false;
				}else {
				tIsConvexPolygon=true;
			}
		};
		var offset=(lineWidth >=1 && lineColor)? (lineWidth % 2===0 ? 0 :0.5):0;
		return this._saveToCmd(Render._context._drawPoly,DrawPolyCmd.create.call(this,x+offset,y+offset,points,fillColor,lineColor,lineWidth,tIsConvexPolygon,tId));
	}

	/**
	*绘制路径。
	*@param x 开始绘制的 X 轴位置。
	*@param y 开始绘制的 Y 轴位置。
	*@param paths 路径集合，路径支持以下格式：[["moveTo",x,y],["lineTo",x,y],["arcTo",x1,y1,x2,y2,r],["closePath"]]。
	*@param brush （可选）刷子定义，支持以下设置{fillStyle:"#FF0000"}。
	*@param pen （可选）画笔定义，支持以下设置{strokeStyle,lineWidth,lineJoin:"bevel|round|miter",lineCap:"butt|round|square",miterLimit}。
	*/
	__proto.drawPath=function(x,y,paths,brush,pen){
		return this._saveToCmd(Render._context._drawPath,DrawPathCmd.create.call(this,x,y,paths,brush,pen));
	}

	/**
	*@private
	*命令流。存储了所有绘制命令。
	*/
	__getset(0,__proto,'cmds',function(){
		return this._cmds;
		},function(value){
		if (this._sp){
			this._sp._renderType |=/*laya.display.SpriteConst.GRAPHICS*/0x200;
			this._sp._setRenderType(this._sp._renderType);
		}
		this._cmds=value;
		this._render=this._renderAll;
		this._repaint();
	});

	return Graphics;
})()


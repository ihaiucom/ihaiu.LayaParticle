//class laya.webgl.resource.CharRender_Canvas extends laya.webgl.resource.ICharRender
var CharRender_Canvas=(function(_super){
	function CharRender_Canvas(maxw,maxh,scalefont,useImageData,showdbg){
		this.lastScaleX=1.0;
		this.lastScaleY=1.0;
		this.needResetScale=false;
		this.maxTexW=0;
		this.maxTexH=0;
		this.scaleFontSize=true;
		this.showDbgInfo=false;
		this.supportImageData=true;
		CharRender_Canvas.__super.call(this);
		(scalefont===void 0)&& (scalefont=true);
		(useImageData===void 0)&& (useImageData=true);
		(showdbg===void 0)&& (showdbg=false);
		this.maxTexW=maxw;
		this.maxTexH=maxh;
		this.scaleFontSize=scalefont;
		this.supportImageData=useImageData;
		this.showDbgInfo=showdbg;
		if (!CharRender_Canvas.canvas){
			CharRender_Canvas.canvas=window.document.createElement('canvas');
			CharRender_Canvas.canvas.width=1024;
			CharRender_Canvas.canvas.height=512;
			CharRender_Canvas.canvas.style.left="-10000px";
			CharRender_Canvas.canvas.style.position="absolute";
			/*__JS__ */document.body.appendChild(CharRender_Canvas.canvas);;
			CharRender_Canvas.ctx=CharRender_Canvas.canvas.getContext('2d');
		}
	}

	__class(CharRender_Canvas,'laya.webgl.resource.CharRender_Canvas',_super);
	var __proto=CharRender_Canvas.prototype;
	__proto.getWidth=function(font,str){
		if (!CharRender_Canvas.ctx)return 0;
		if(CharRender_Canvas.ctx._lastFont!=font){
			CharRender_Canvas.ctx.font=font;
			CharRender_Canvas.ctx._lastFont=font;
		}
		return CharRender_Canvas.ctx.measureText(str).width;
	}

	__proto.scale=function(sx,sy){
		if (!this.supportImageData){
			this.lastScaleX=sx;
			this.lastScaleY=sy;
			return;
		}
		if (this.lastScaleX !=sx || this.lastScaleY !=sy){
			CharRender_Canvas.ctx.setTransform(sx,0,0,sy,0,0);
			this.lastScaleX=sx;
			this.lastScaleY=sy;
		}
	}

	/**
	*TODO stroke
	*@param char
	*@param font
	*@param cri 修改里面的width。
	*@return
	*/
	__proto.getCharBmp=function(char,font,lineWidth,colStr,strokeColStr,cri,margin_left,margin_top,margin_right,margin_bottom,rect){
		if (!this.supportImageData)
			return this.getCharCanvas(char,font,lineWidth,colStr,strokeColStr,cri,margin_left,margin_top,margin_right,margin_bottom);
		if (CharRender_Canvas.ctx.font !=font){
			CharRender_Canvas.ctx.font=font;
			CharRender_Canvas.ctx._lastFont=font;
		}
		cri.width=CharRender_Canvas.ctx.measureText(char).width;
		var w=cri.width *this.lastScaleX;
		var h=cri.height*this.lastScaleY;
		w+=(margin_left+margin_right)*this.lastScaleX;
		h+=(margin_top+margin_bottom)*this.lastScaleY;
		w=Math.ceil(w);
		h=Math.ceil(h);
		w=Math.min(w,laya.webgl.resource.CharRender_Canvas.canvas.width);
		h=Math.min(h,laya.webgl.resource.CharRender_Canvas.canvas.height);
		var clearW=w+lineWidth *2+1;
		var clearH=h+lineWidth *2+1;
		if (rect){
			clearW=Math.max(clearW,rect[0]+rect[2]+1);
			clearH=Math.max(clearH,rect[1]+rect[3]+1);
		}
		CharRender_Canvas.ctx.clearRect(0,0,clearW,clearH);
		CharRender_Canvas.ctx.save();
		CharRender_Canvas.ctx.textBaseline="top";
		if (lineWidth > 0){
			CharRender_Canvas.ctx.strokeStyle=strokeColStr;
			CharRender_Canvas.ctx.lineWidth=lineWidth;
			CharRender_Canvas.ctx.strokeText(char,margin_left,margin_top);
		}
		CharRender_Canvas.ctx.fillStyle=colStr;
		CharRender_Canvas.ctx.fillText(char,margin_left,margin_top);
		if (this.showDbgInfo){
			CharRender_Canvas.ctx.strokeStyle='#ff0000';
			CharRender_Canvas.ctx.strokeRect(0,0,w,h);
			CharRender_Canvas.ctx.strokeStyle='#00ff00';
			CharRender_Canvas.ctx.strokeRect(margin_left,margin_top,cri.width,cri.height);
		}
		if (rect){
			if (rect[2]==-1)rect[2]=Math.ceil((cri.width+lineWidth)*this.lastScaleX);
		};
		var imgdt=rect?(CharRender_Canvas.ctx.getImageData(rect[0],rect[1],rect[2],rect[3])):(CharRender_Canvas.ctx.getImageData(0,0,w,h));
		CharRender_Canvas.ctx.restore();
		cri.bmpWidth=imgdt.width;
		cri.bmpHeight=imgdt.height;
		return imgdt;
	}

	__proto.getCharCanvas=function(char,font,lineWidth,colStr,strokeColStr,cri,margin_left,margin_top,margin_right,margin_bottom){
		if (CharRender_Canvas.ctx.font !=font){
			CharRender_Canvas.ctx.font=font;
			CharRender_Canvas.ctx._lastFont=font;
		}
		cri.width=CharRender_Canvas.ctx.measureText(char).width;
		var w=cri.width *this.lastScaleX;
		var h=cri.height*this.lastScaleY;
		w+=(margin_left+margin_right)*this.lastScaleX;
		h+=((margin_top+margin_bottom)*this.lastScaleY+1);
		w=Math.min(w,this.maxTexW);
		h=Math.min(h,this.maxTexH);
		CharRender_Canvas.canvas.width=Math.min(w+1,this.maxTexW);
		CharRender_Canvas.canvas.height=Math.min(h+1,this.maxTexH);
		CharRender_Canvas.ctx.font=font;
		CharRender_Canvas.ctx.clearRect(0,0,w+1+lineWidth,h+1+lineWidth);
		CharRender_Canvas.ctx.setTransform(1,0,0,1,0,0);
		CharRender_Canvas.ctx.save();
		if (this.scaleFontSize){
			CharRender_Canvas.ctx.scale(this.lastScaleX,this.lastScaleY);
		}
		CharRender_Canvas.ctx.translate(margin_left,margin_top);
		CharRender_Canvas.ctx.textAlign="left";
		CharRender_Canvas.ctx.textBaseline="top";
		if (lineWidth > 0){
			CharRender_Canvas.ctx.strokeStyle=strokeColStr;
			CharRender_Canvas.ctx.fillStyle=colStr;
			CharRender_Canvas.ctx.lineWidth=lineWidth;
			if (CharRender_Canvas.ctx.fillAndStrokeText){
				CharRender_Canvas.ctx.fillAndStrokeText(char,0,0);
				}else{
				CharRender_Canvas.ctx.strokeText(char,0,0);
				CharRender_Canvas.ctx.fillText(char,0,0);
			}
			}else {
			CharRender_Canvas.ctx.fillStyle=colStr;
			CharRender_Canvas.ctx.fillText(char,0,0);
		}
		if (this.showDbgInfo){
			CharRender_Canvas.ctx.strokeStyle='#ff0000';
			CharRender_Canvas.ctx.strokeRect(0,0,w,h);
			CharRender_Canvas.ctx.strokeStyle='#00ff00';
			CharRender_Canvas.ctx.strokeRect(0,0,cri.width,cri.height);
		}
		CharRender_Canvas.ctx.restore();
		cri.bmpWidth=CharRender_Canvas.canvas.width;
		cri.bmpHeight=CharRender_Canvas.canvas.height;
		return CharRender_Canvas.canvas;
	}

	__getset(0,__proto,'canvasWidth',function(){
		return CharRender_Canvas.canvas.width;
		},function(w){
		if (CharRender_Canvas.canvas.width==w)
			return;
		CharRender_Canvas.canvas.width=w;
		if (w > 2048){
			console.warn("画文字设置的宽度太大，超过2048了");
		}
		CharRender_Canvas.ctx.setTransform(1,0,0,1,0,0);
		CharRender_Canvas.ctx.scale(this.lastScaleX,this.lastScaleY);
	});

	CharRender_Canvas.canvas=null;
	CharRender_Canvas.ctx=null;
	return CharRender_Canvas;
})(ICharRender)


/**
*...
*@author ...
*/

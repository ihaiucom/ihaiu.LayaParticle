//class laya.webgl.resource.CharRender_Native extends laya.webgl.resource.ICharRender
var CharRender_Native=(function(_super){
	function CharRender_Native(){
		this.lastFont='';
		CharRender_Native.__super.call(this);
	}

	__class(CharRender_Native,'laya.webgl.resource.CharRender_Native',_super);
	var __proto=CharRender_Native.prototype;
	//TODO:coverage
	__proto.getWidth=function(font,str){
		if (!window.conchTextCanvas)return 0;
		if (this.lastFont !=font){
			window.conchTextCanvas.font=font;
			this.lastFont=font;
		}
		return window.conchTextCanvas.measureText(str).width;
	}

	__proto.scale=function(sx,sy){}
	//TODO:coverage
	__proto.getCharBmp=function(char,font,lineWidth,colStr,strokeColStr,size,margin_left,margin_top,margin_right,margin_bottom,rect){
		if (!window.conchTextCanvas)return null;
		if(this.lastFont!=font){
			window.conchTextCanvas.font=font;
			this.lastFont=font;
		};
		var w=size.width=window.conchTextCanvas.measureText(char).width;
		var h=size.height;
		w+=(margin_left+margin_right);
		h+=(margin_top+margin_bottom);
		var c1=ColorUtils.create(strokeColStr);
		var nStrokeColor=c1.numColor;
		var c2=ColorUtils.create(colStr);
		var nTextColor=c2.numColor;
		var textInfo=window.conchTextCanvas.getTextBitmapData(char,nTextColor,lineWidth>2?2:lineWidth,nStrokeColor);
		size.bmpWidth=textInfo.width;
		size.bmpHeight=textInfo.height;
		return textInfo;
	}

	return CharRender_Native;
})(ICharRender)


/**
*cache as normal 模式下的生成的canvas的渲染。
*/

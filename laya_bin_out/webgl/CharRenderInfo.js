//class laya.webgl.resource.CharRenderInfo
var CharRenderInfo=(function(){
	function CharRenderInfo(){
		this.char='';
		// 调试用
		this.tex=null;
		//
		this.deleted=false;
		// [0,0,1,1];//uv
		this.pos=0;
		//数组下标
		this.width=0;
		//字体宽度。测量的宽度，用来排版。没有缩放
		this.height=0;
		//字体高度。没有缩放
		this.bmpWidth=0;
		//实际图片的宽度。可能与排版用的width不一致。包含缩放和margin
		this.bmpHeight=0;
		this.orix=0;
		// 原点位置，通常都是所在区域的左上角
		this.oriy=0;
		this.touchTick=0;
		//
		this.isSpace=false;
		this.uv=new Array(8);
	}

	__class(CharRenderInfo,'laya.webgl.resource.CharRenderInfo');
	var __proto=CharRenderInfo.prototype;
	//是否是空格，如果是空格，则只有width有效
	__proto.touch=function(){
		var curLoop=Stat.loopCount;
		if (this.touchTick !=curLoop){
			this.tex.touchRect(this,curLoop);
		}
		this.touchTick=curLoop;
	}

	return CharRenderInfo;
})()


/**
*...
*@author ww
*/

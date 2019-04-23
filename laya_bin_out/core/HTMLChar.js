/**
*<code>HTMLChar</code> 是一个 HTML 字符类。
*/
//class laya.utils.HTMLChar
var HTMLChar=(function(){
	function HTMLChar(){
		/**x坐标*/
		//this.x=NaN;
		/**y坐标*/
		//this.y=NaN;
		/**宽*/
		//this.width=NaN;
		/**高*/
		//this.height=NaN;
		/**表示是否是正常单词(英文|.|数字)。*/
		//this.isWord=false;
		/**字符。*/
		//this.char=null;
		/**字符数量。*/
		//this.charNum=NaN;
		/**CSS 样式。*/
		//this.style=null;
		this.reset();
	}

	__class(HTMLChar,'laya.utils.HTMLChar');
	var __proto=HTMLChar.prototype;
	/**
	*根据指定的字符、宽高、样式，创建一个 <code>HTMLChar</code> 类的实例。
	*@param char 字符。
	*@param w 宽度。
	*@param h 高度。
	*@param style CSS 样式。
	*/
	__proto.setData=function(char,w,h,style){
		this.char=char;
		this.charNum=char.charCodeAt(0);
		this.x=this.y=0;
		this.width=w;
		this.height=h;
		this.style=style;
		this.isWord=!HTMLChar._isWordRegExp.test(char);
		return this;
	}

	/**
	*重置
	*/
	__proto.reset=function(){
		this.x=this.y=this.width=this.height=0;
		this.isWord=false;
		this.char=null;
		this.charNum=0;
		this.style=null;
		return this;
	}

	//TODO:coverage
	__proto.recover=function(){
		Pool.recover("HTMLChar",this.reset());
	}

	/**@private */
	__proto._isChar=function(){
		return true;
	}

	/**@private */
	__proto._getCSSStyle=function(){
		return this.style;
	}

	HTMLChar.create=function(){
		return Pool.getItemByClass("HTMLChar",HTMLChar);
	}

	HTMLChar._isWordRegExp=new RegExp("[\\w\.]","");
	return HTMLChar;
})()

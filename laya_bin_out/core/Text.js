/**
*<code>/**
*<code>HTMLCanvas</code> 是 Html Canvas 的代理类，封装了 Canvas 的属性和方法。
*/
//class laya.resource.HTMLCanvas extends laya.resource.Bitmap
var HTMLCanvas=(function(_super){
	function HTMLCanvas(createCanvas){
		//this._ctx=null;
		//this._source=null;
		//this._texture=null;
		HTMLCanvas.__super.call(this);
		(createCanvas===void 0)&& (createCanvas=false);
		if(createCanvas || !Render.isWebGL)
			this._source=Browser.createElement("canvas");
		else {
			this._source=this;
		}
		this.lock=true;
	}

	__class(HTMLCanvas,'laya.resource.HTMLCanvas',_super);
	var __proto=HTMLCanvas.prototype;
	__proto._getSource=function(){
		return this._source;
	}

	/**
	*清空画布内容。
	*/
	__proto.clear=function(){
		this._ctx && this._ctx.clear();
		if (this._texture){
			this._texture.destroy();
			this._texture=null;
		}
	}

	/**
	*销毁。
	*/
	__proto.destroy=function(){
		this._ctx && this._ctx.destroy();
		this._ctx=null;
	}

	/**
	*释放。
	*/
	__proto.release=function(){}
	/**
	*@private
	*设置 Canvas 渲染上下文。是webgl用来替换_ctx用的
	*@param context Canvas 渲染上下文。
	*/
	__proto._setContext=function(context){
		this._ctx=context;
	}

	/**
	*获取 Canvas 渲染上下文。
	*@param contextID 上下文ID.
	*@param other
	*@return Canvas 渲染上下文 Context 对象。
	*/
	__proto.getContext=function(contextID,other){
		return this.context;
	}

	//TODO:coverage
	__proto.getMemSize=function(){
		return 0;
	}

	/**
	*设置宽高。
	*@param w 宽度。
	*@param h 高度。
	*/
	__proto.size=function(w,h){
		if (this._width !=w || this._height !=h || (this._source && (this._source.width !=w || this._source.height !=h))){
			this._width=w;
			this._height=h;
			this._setGPUMemory(w *h *4);
			this._ctx && this._ctx.size && this._ctx.size(w,h);
			this._source && (this._source.height=h,this._source.width=w);
			if (this._texture){
				this._texture.destroy();
				this._texture=null;
			}
		}
	}

	/**
	*获取texture实例
	*/
	__proto.getTexture=function(){
		if (!this._texture){
			this._texture=new Texture(this,Texture.DEF_UV);
		}
		return this._texture;
	}

	/**
	*把图片转换为base64信息
	*@param type "image/png"
	*@param encoderOptions 质量参数，取值范围为0-1
	*@param callBack 完成回调，返回base64数据
	*/
	__proto.toBase64=function(type,encoderOptions,callBack){
		if (this._source){
			if (Render.isConchApp && this._source.toBase64){
				this._source.toBase64(type,encoderOptions,callBack);
			}
			else {
				var base64Data=this._source.toDataURL(type,encoderOptions);
				callBack(base64Data);
			}
		}
	}

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'source',function(){
		return this._source;
	});

	/**
	*Canvas 渲染上下文。
	*/
	__getset(0,__proto,'context',function(){
		if (this._ctx)return this._ctx;
		if (Render.isWebGL && this._source==this){
			this._ctx=/*__JS__ */new laya.webgl.canvas.WebGLContext2D();;
			}else {
			this._ctx=this._source.getContext(Render.isConchApp?'layagl':'2d');
		}
		this._ctx._canvas=this;
		return this._ctx;
	});

	return HTMLCanvas;
})(Bitmap)


/**
*<p> <code>Text</code> 类用于创建显示对象以显示文本。</p>
*<p>
*注意：如果运行时系统找不到设定的字体，则用系统默认的字体渲染文字，从而导致显示异常。(通常电脑上显示正常，在一些移动端因缺少设置的字体而显示异常)。
*</p>
*@example
*package
*{
	*import laya.display.Text;
	*public class Text_Example
	*{
		*public function Text_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*onInit();
			*}
		*private function onInit():void
		*{
			*var text:Text=new Text();//创建一个 Text 类的实例对象 text 。
			*text.text="这个是一个 Text 文本示例。";
			*text.color="#008fff";//设置 text 的文本颜色。
			*text.font="Arial";//设置 text 的文本字体。
			*text.bold=true;//设置 text 的文本显示为粗体。
			*text.fontSize=30;//设置 text 的字体大小。
			*text.wordWrap=true;//设置 text 的文本自动换行。
			*text.x=100;//设置 text 对象的属性 x 的值，用于控制 text 对象的显示位置。
			*text.y=100;//设置 text 对象的属性 y 的值，用于控制 text 对象的显示位置。
			*text.width=300;//设置 text 的宽度。
			*text.height=200;//设置 text 的高度。
			*text.italic=true;//设置 text 的文本显示为斜体。
			*text.borderColor="#fff000";//设置 text 的文本边框颜色。
			*Laya.stage.addChild(text);//将 text 添加到显示列表。
			*}
		*}
	*}
*@example
*Text_Example();
*function Text_Example()
*{
	*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
	*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
	*onInit();
	*}
*function onInit()
*{
	*var text=new laya.display.Text();//创建一个 Text 类的实例对象 text 。
	*text.text="这个是一个 Text 文本示例。";
	*text.color="#008fff";//设置 text 的文本颜色。
	*text.font="Arial";//设置 text 的文本字体。
	*text.bold=true;//设置 text 的文本显示为粗体。
	*text.fontSize=30;//设置 text 的字体大小。
	*text.wordWrap=true;//设置 text 的文本自动换行。
	*text.x=100;//设置 text 对象的属性 x 的值，用于控制 text 对象的显示位置。
	*text.y=100;//设置 text 对象的属性 y 的值，用于控制 text 对象的显示位置。
	*text.width=300;//设置 text 的宽度。
	*text.height=200;//设置 text 的高度。
	*text.italic=true;//设置 text 的文本显示为斜体。
	*text.borderColor="#fff000";//设置 text 的文本边框颜色。
	*Laya.stage.addChild(text);//将 text 添加到显示列表。
	*}
*@example
*class Text_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*this.onInit();
		*}
	*private onInit():void {
		*var text:laya.display.Text=new laya.display.Text();//创建一个 Text 类的实例对象 text 。
		*text.text="这个是一个 Text 文本示例。";
		*text.color="#008fff";//设置 text 的文本颜色。
		*text.font="Arial";//设置 text 的文本字体。
		*text.bold=true;//设置 text 的文本显示为粗体。
		*text.fontSize=30;//设置 text 的字体大小。
		*text.wordWrap=true;//设置 text 的文本自动换行。
		*text.x=100;//设置 text 对象的属性 x 的值，用于控制 text 对象的显示位置。
		*text.y=100;//设置 text 对象的属性 y 的值，用于控制 text 对象的显示位置。
		*text.width=300;//设置 text 的宽度。
		*text.height=200;//设置 text 的高度。
		*text.italic=true;//设置 text 的文本显示为斜体。
		*text.borderColor="#fff000";//设置 text 的文本边框颜色。
		*Laya.stage.addChild(text);//将 text 添加到显示列表。
		*}
	*}
*/
//class laya.display.Text extends laya.display.Sprite
var Text=(function(_super){
	function Text(){
		/**@private */
		this._clipPoint=null;
		/**@private 表示文本内容字符串。*/
		this._text=null;
		/**@private 表示文本内容是否发生改变。*/
		this._isChanged=false;
		/**@private 表示文本的宽度，以像素为单位。*/
		this._textWidth=0;
		/**@private 表示文本的高度，以像素为单位。*/
		this._textHeight=0;
		/**@private 存储文字行数信息。*/
		this._lines=[];
		/**@private 保存每行宽度*/
		this._lineWidths=[];
		/**@private 文本的内容位置 X 轴信息。*/
		this._startX=0;
		/**@private 文本的内容位置X轴信息。 */
		this._startY=0;
		/**@private */
		this._words=null;
		/**@private */
		this._charSize={};
		/**@private */
		this._valign="top";
		/**@private */
		this._color="#000000";
		Text.__super.call(this);
		this._fontSize=Text.defaultFontSize;
		this._font=Text.defaultFont;
		this.overflow="visible";
		this._style=TextStyle.EMPTY;
	}

	__class(Text,'laya.display.Text',_super);
	var __proto=Text.prototype;
	/**
	*@private
	*获取样式。
	*@return 样式 Style 。
	*/
	__proto.getStyle=function(){
		this._style===TextStyle.EMPTY && (this._style=TextStyle.create());
		return this._style;
	}

	__proto._getTextStyle=function(){
		if (this._style===TextStyle.EMPTY){
			this._style=TextStyle.create();
		}
		return this._style;
	}

	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._clipPoint=null;
		this._lines=null;
		this._lineWidths=null;
		this._words=null;
		this._charSize=null;
	}

	/**
	*@private
	*@inheritDoc
	*/
	__proto._getBoundPointsM=function(ifRotate){
		(ifRotate===void 0)&& (ifRotate=false);
		var rec=Rectangle.TEMP;
		rec.setTo(0,0,this.width,this.height);
		return rec._getBoundPoints();
	}

	/**
	*@inheritDoc
	*/
	__proto.getGraphicBounds=function(realSize){
		(realSize===void 0)&& (realSize=false);
		var rec=Rectangle.TEMP;
		rec.setTo(0,0,this.width,this.height);
		return rec;
	}

	/**
	*@private
	*/
	__proto._getCSSStyle=function(){
		return this._style;
	}

	/**
	*<p>根据指定的文本，从语言包中取当前语言的文本内容。并对此文本中的{i}文本进行替换。</p>
	*<p>设置Text.langPacks语言包后，即可使用lang获取里面的语言</p>
	*<p>例如：
	*<li>（1）text 的值为“我的名字”，先取到这个文本对应的当前语言版本里的值“My name”，将“My name”设置为当前文本的内容。</li>
	*<li>（2）text 的值为“恭喜你赢得{0}个钻石，{1}经验。”，arg1 的值为100，arg2 的值为200。
	*则先取到这个文本对应的当前语言版本里的值“Congratulations on your winning {0}diamonds,{1}experience.”，
	*然后将文本里的{0}、{1}，依据括号里的数字从0开始替换为 arg1、arg2 的值。
	*将替换处理后的文本“Congratulations on your winning 100 diamonds,200 experience.”设置为当前文本的内容。
	*</li>
	*</p>
	*@param text 文本内容。
	*@param ...args 文本替换参数。
	*/
	__proto.lang=function(text,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10){
		text=Text.langPacks && Text.langPacks[text] ? Text.langPacks[text] :text;
		if (arguments.length < 2){
			this._text=text;
			}else {
			for (var i=0,n=arguments.length;i < n;i++){
				text=text.replace("{"+i+"}",arguments[i+1]);
			}
			this._text=text;
		}
	}

	/**
	*@private
	*/
	__proto._getContextFont=function(){
		return (this.italic ? "italic " :"")+(this.bold ? "bold " :"")+this.fontSize+"px "+(Browser.onIPhone ? (laya.display.Text.fontFamilyMap[this.font] || this.font):this.font);
	}

	/**
	*@private
	*/
	__proto._isPassWordMode=function(){
		var style=this._style;
		var password=style.asPassword;
		if (("prompt" in this)&& this['prompt']==this._text)
			password=false;
		return password;
	}

	/**
	*@private
	*/
	__proto._getPassWordTxt=function(txt){
		var len=txt.length;
		var word;
		word="";
		for (var j=len;j > 0;j--){
			word+="●";
		}
		return word;
	}

	/**
	*@private
	*渲染文字。
	*@param begin 开始渲染的行索引。
	*@param visibleLineCount 渲染的行数。
	*/
	__proto._renderText=function(){
		var padding=this.padding;
		var visibleLineCount=this._lines.length;
		if (this.overflow !="visible"){
			visibleLineCount=Math.min(visibleLineCount,Math.floor((this.height-padding[0]-padding[2])/ (this.leading+this._charSize.height))+1);
		};
		var beginLine=this.scrollY / (this._charSize.height+this.leading)| 0;
		var graphics=this.graphics;
		graphics.clear(true);
		var ctxFont=this._getContextFont();
		Browser.context.font=ctxFont;
		var startX=padding[3];
		var textAlgin="left";
		var lines=this._lines;
		var lineHeight=this.leading+this._charSize.height;
		var tCurrBitmapFont=(this._style).currBitmapFont;
		if (tCurrBitmapFont){
			lineHeight=this.leading+tCurrBitmapFont.getMaxHeight();
		};
		var startY=padding[0];
		if ((!tCurrBitmapFont)&& this._width > 0 && this._textWidth <=this._width){
			if (this.align=="right"){
				textAlgin="right";
				startX=this._width-padding[1];
				}else if (this.align=="center"){
				textAlgin="center";
				startX=this._width *0.5+padding[3]-padding[1];
			}
		}
		if (this._height > 0){
			var tempVAlign=(this._textHeight > this._height)? "top" :this.valign;
			if (tempVAlign==="middle")
				startY=(this._height-visibleLineCount *lineHeight)*0.5+padding[0]-padding[2];
			else if (tempVAlign==="bottom")
			startY=this._height-visibleLineCount *lineHeight-padding[2];
		};
		var style=this._style;
		if (tCurrBitmapFont && tCurrBitmapFont.autoScaleSize){
			var bitmapScale=tCurrBitmapFont.fontSize / this.fontSize;
		}
		if (this._clipPoint){
			graphics.save();
			if (tCurrBitmapFont && tCurrBitmapFont.autoScaleSize){
				var tClipWidth=0;
				var tClipHeight=0;
				this._width ? tClipWidth=(this._width-padding[3]-padding[1]):tClipWidth=this._textWidth;
				this._height ? tClipHeight=(this._height-padding[0]-padding[2]):tClipHeight=this._textHeight;
				tClipWidth *=bitmapScale;
				tClipHeight *=bitmapScale;
				graphics.clipRect(padding[3],padding[0],tClipWidth,tClipHeight);
				}else {
				graphics.clipRect(padding[3],padding[0],this._width ? (this._width-padding[3]-padding[1]):this._textWidth,this._height ? (this._height-padding[0]-padding[2]):this._textHeight);
			}
			this.repaint();
		};
		var password=style.asPassword;
		if (("prompt" in this)&& this['prompt']==this._text)
			password=false;
		var x=0,y=0;
		var end=Math.min(this._lines.length,visibleLineCount+beginLine)|| 1;
		for (var i=beginLine;i < end;i++){
			var word=lines[i];
			var _word;
			if (password){
				var len=word.length;
				word="";
				for (var j=len;j > 0;j--){
					word+="●";
				}
			}
			if (word==null)word="";
			x=startX-(this._clipPoint ? this._clipPoint.x :0);
			y=startY+lineHeight *i-(this._clipPoint ? this._clipPoint.y :0);
			this.underline && this._drawUnderline(textAlgin,x,y,i);
			if (tCurrBitmapFont){
				var tWidth=this.width;
				if (tCurrBitmapFont.autoScaleSize){
					tWidth=this.width *bitmapScale;
				}
				tCurrBitmapFont._drawText(word,this,x,y,this.align,tWidth);
				}else {
				if (Render.isWebGL){
					this._words || (this._words=[]);
					_word=this._words.length > (i-beginLine)? this._words[i-beginLine] :new WordText();
					_word.setText(word);
					}else {
					_word=word;
				}
				style.stroke ? graphics.fillBorderText(_word,x,y,ctxFont,this.color,style.strokeColor,style.stroke,textAlgin):graphics.fillText(_word,x,y,ctxFont,this.color,textAlgin);
			}
		}
		if (tCurrBitmapFont && tCurrBitmapFont.autoScaleSize){
			var tScale=1 / bitmapScale;
			this.scale(tScale,tScale);
		}
		if (this._clipPoint)graphics.restore();
		this._startX=startX;
		this._startY=startY;
	}

	/**
	*@private
	*绘制下划线
	*@param x 本行坐标
	*@param y 本行坐标
	*@param lineIndex 本行索引
	*/
	__proto._drawUnderline=function(align,x,y,lineIndex){
		var lineWidth=this._lineWidths[lineIndex];
		switch (align){
			case 'center':
				x-=lineWidth / 2;
				break ;
			case 'right':
				x-=lineWidth;
				break ;
			case 'left':
			default :
				break ;
			}
		y+=this._charSize.height;
		this._graphics.drawLine(x,y,x+lineWidth,y,this.underlineColor || this.color,1);
	}

	/**
	*<p>排版文本。</p>
	*<p>进行宽高计算，渲染、重绘文本。</p>
	*/
	__proto.typeset=function(){
		this._isChanged=false;
		if (!this._text){
			this._clipPoint=null;
			this._textWidth=this._textHeight=0;
			this.graphics.clear(true);
			return;
		}
		if (Render.isConchApp){
			/*__JS__ */window.conchTextCanvas.font=this._getContextFont();;
			}else{
			Browser.context.font=this._getContextFont();
		}
		this._lines.length=0;
		this._lineWidths.length=0;
		if (this._isPassWordMode()){
			this._parseLines(this._getPassWordTxt(this._text));
		}else
		this._parseLines(this._text);
		this._evalTextSize();
		if (this._checkEnabledViewportOrNot())this._clipPoint || (this._clipPoint=new Point(0,0));
		else this._clipPoint=null;
		this._renderText();
	}

	/**@private */
	__proto._evalTextSize=function(){
		var nw=NaN,nh=NaN;
		nw=Math.max.apply(this,this._lineWidths);
		if ((this._style).currBitmapFont)
			nh=this._lines.length *((this._style).currBitmapFont.getMaxHeight()+this.leading)+this.padding[0]+this.padding[2];
		else
		nh=this._lines.length *(this._charSize.height+this.leading)+this.padding[0]+this.padding[2];
		if (nw !=this._textWidth || nh !=this._textHeight){
			this._textWidth=nw;
			this._textHeight=nh;
		}
	}

	/**@private */
	__proto._checkEnabledViewportOrNot=function(){
		return this.overflow=="scroll" && ((this._width > 0 && this._textWidth > this._width)|| (this._height > 0 && this._textHeight > this._height));
	}

	/**
	*<p>快速更改显示文本。不进行排版计算，效率较高。</p>
	*<p>如果只更改文字内容，不更改文字样式，建议使用此接口，能提高效率。</p>
	*@param text 文本内容。
	*/
	__proto.changeText=function(text){
		if (this._text!==text){
			this.lang(text+"");
			if (this._graphics && this._graphics.replaceText(this._text)){
				}else {
				this.typeset();
			}
		}
	}

	/**
	*@private
	*分析文本换行。
	*/
	__proto._parseLines=function(text){
		var needWordWrapOrTruncate=this.wordWrap || this.overflow=="hidden";
		if (needWordWrapOrTruncate){
			var wordWrapWidth=this._getWordWrapWidth();
		};
		var bitmapFont=(this._style).currBitmapFont;
		if (bitmapFont){
			this._charSize.width=bitmapFont.getMaxWidth();
			this._charSize.height=bitmapFont.getMaxHeight();
			}else {
			var measureResult=null;
			if (Render.isConchApp){
				measureResult=/*__JS__ */window.conchTextCanvas.measureText(this._testWord);
				}else {
				measureResult=Browser.context.measureText(Text._testWord);
			}
			this._charSize.width=measureResult.width;
			this._charSize.height=(measureResult.height || this.fontSize);
		};
		var lines=text.replace(/\r\n/g,"\n").split("\n");
		for (var i=0,n=lines.length;i < n;i++){
			var line=lines[i];
			if (needWordWrapOrTruncate)
				this._parseLine(line,wordWrapWidth);
			else {
				this._lineWidths.push(this._getTextWidth(line));
				this._lines.push(line);
			}
		}
	}

	/**
	*@private
	*解析行文本。
	*@param line 某行的文本。
	*@param wordWrapWidth 文本的显示宽度。
	*/
	__proto._parseLine=function(line,wordWrapWidth){
		var ctx=Browser.context;
		var lines=this._lines;
		var maybeIndex=0;
		var execResult;
		var charsWidth=NaN;
		var wordWidth=NaN;
		var startIndex=0;
		charsWidth=this._getTextWidth(line);
		if (charsWidth <=wordWrapWidth){
			lines.push(line);
			this._lineWidths.push(charsWidth);
			return;
		}
		charsWidth=this._charSize.width;
		maybeIndex=Math.floor(wordWrapWidth / charsWidth);
		(maybeIndex==0)&& (maybeIndex=1);
		charsWidth=this._getTextWidth(line.substring(0,maybeIndex));
		wordWidth=charsWidth;
		for (var j=maybeIndex,m=line.length;j < m;j++){
			charsWidth=this._getTextWidth(line.charAt(j));
			wordWidth+=charsWidth;
			if (wordWidth > wordWrapWidth){
				if (this.wordWrap){
					var newLine=line.substring(startIndex,j);
					if (newLine.charCodeAt(newLine.length-1)< 255){
						execResult=/(?:\w|-)+$/.exec(newLine);
						if (execResult){
							j=execResult.index+startIndex;
							if (execResult.index==0)j+=newLine.length;
							else newLine=line.substring(startIndex,j);
						}
					}
					lines.push(newLine);
					this._lineWidths.push(wordWidth-charsWidth);
					startIndex=j;
					if (j+maybeIndex < m){
						j+=maybeIndex;
						charsWidth=this._getTextWidth(line.substring(startIndex,j));
						wordWidth=charsWidth;
						j--;
						}else {
						lines.push(line.substring(startIndex,m));
						this._lineWidths.push(this._getTextWidth(lines[lines.length-1]));
						startIndex=-1;
						break ;
					}
					}else if (this.overflow=="hidden"){
					lines.push(line.substring(0,j));
					this._lineWidths.push(this._getTextWidth(lines[lines.length-1]));
					return;
				}
			}
		}
		if (this.wordWrap && startIndex !=-1){
			lines.push(line.substring(startIndex,m));
			this._lineWidths.push(this._getTextWidth(lines[lines.length-1]));
		}
	}

	/**@private */
	__proto._getTextWidth=function(text){
		var bitmapFont=(this._style).currBitmapFont;
		if (bitmapFont)return bitmapFont.getTextWidth(text);
		else {
			if (Render.isConchApp){
				return /*__JS__ */window.conchTextCanvas.measureText(text).width;;
			}
			else return Browser.context.measureText(text).width;
		}
	}

	/**
	*@private
	*获取换行所需的宽度。
	*/
	__proto._getWordWrapWidth=function(){
		var p=this.padding;
		var w=NaN;
		var bitmapFont=(this._style).currBitmapFont;
		if (bitmapFont && bitmapFont.autoScaleSize)w=this._width *(bitmapFont.fontSize / this.fontSize);
		else w=this._width;
		if (w <=0){
			w=this.wordWrap ? 100 :Browser.width;
		}
		w <=0 && (w=100);
		return w-p[3]-p[1];
	}

	/**
	*返回字符在本类实例的父坐标系下的坐标。
	*@param charIndex 索引位置。
	*@param out （可选）输出的Point引用。
	*@return Point 字符在本类实例的父坐标系下的坐标。如果out参数不为空，则将结果赋值给指定的Point对象，否则创建一个新的Point对象返回。建议使用Point.TEMP作为out参数，可以省去Point对象创建和垃圾回收的开销，尤其是在需要频繁执行的逻辑中，比如帧循环和MOUSE_MOVE事件回调函数里面。
	*/
	__proto.getCharPoint=function(charIndex,out){
		this._isChanged && Laya.systemTimer.runCallLater(this,this.typeset);
		var len=0,lines=this._lines,startIndex=0;
		for (var i=0,n=lines.length;i < n;i++){
			len+=lines[i].length;
			if (charIndex < len){
				var line=i;
				break ;
			}
			startIndex=len;
		};
		var ctxFont=(this.italic ? "italic " :"")+(this.bold ? "bold " :"")+this.fontSize+"px "+this.font;
		Browser.context.font=ctxFont;
		var width=this._getTextWidth(this._text.substring(startIndex,charIndex));
		var point=out || new Point();
		return point.setTo(this._startX+width-(this._clipPoint ? this._clipPoint.x :0),this._startY+line *(this._charSize.height+this.leading)-(this._clipPoint ? this._clipPoint.y :0));
	}

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'width',function(){
		if (this._width)return this._width;
		return this.textWidth+this.padding[1]+this.padding[3];
		},function(value){
		if (value !=this._width){
			Laya.superSet(Sprite,this,'width',value);
			this.isChanged=true;
			if (this.borderColor){
				this._setBorderStyleColor(0,0,this.width,this.height,this.borderColor,1);
			}
		}
	});

	/**
	*表示文本的宽度，以像素为单位。
	*/
	__getset(0,__proto,'textWidth',function(){
		this._isChanged && Laya.systemTimer.runCallLater(this,this.typeset);
		return this._textWidth;
	});

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'height',function(){
		if (this._height)return this._height;
		return this.textHeight;
		},function(value){
		if (value !=this._height){
			Laya.superSet(Sprite,this,'height',value);
			this.isChanged=true;
			if (this.borderColor){
				this._setBorderStyleColor(0,0,this.width,this.height,this.borderColor,1);
			}
		}
	});

	/**
	*表示文本的高度，以像素为单位。
	*/
	__getset(0,__proto,'textHeight',function(){
		this._isChanged && Laya.systemTimer.runCallLater(this,this.typeset);
		return this._textHeight;
	});

	/**
	*<p>边距信息。</p>
	*<p>数据格式：[上边距，右边距，下边距，左边距]（边距以像素为单位）。</p>
	*/
	__getset(0,__proto,'padding',function(){
		return (this._style).padding;
		},function(value){
		if ((typeof value=='string')){
			var arr;
			arr=(value).split(",");
			var i=0,len=0;
			len=arr.length;
			while (arr.length < 4){
				arr.push(0);
			}
			for (i=0;i < len;i++){
				arr[i]=parseFloat(arr[i])|| 0;
			}
			value=arr;
		}
		this._getTextStyle().padding=value;
		this.isChanged=true;
	});

	/**
	*<p>指定文本是否为粗体字。</p>
	*<p>默认值为 false，这意味着不使用粗体字。如果值为 true，则文本为粗体字。</p>
	*/
	__getset(0,__proto,'bold',function(){
		return (this._style).bold;
		},function(value){
		this._getTextStyle().bold=value;
		this.isChanged=true;
	});

	/**当前文本的内容字符串。*/
	__getset(0,__proto,'text',function(){
		return this._text || "";
		},function(value){
		if (this._text!==value){
			this.lang(value+"");
			this.isChanged=true;
			this.event(/*laya.events.Event.CHANGE*/"change");
			if (this.borderColor){
				this._setBorderStyleColor(0,0,this.width,this.height,this.borderColor,1);
			}
		}
	});

	/**
	*<p>表示文本的颜色值。可以通过 <code>Text.defaultColor</code> 设置默认颜色。</p>
	*<p>默认值为黑色。</p>
	*/
	__getset(0,__proto,'color',function(){
		return this._color;
		},function(value){
		if (this._color !=value){
			this._color=value;
			if (!this._isChanged && this._graphics){
				this._graphics.replaceTextColor(this.color)
				}else {
				this.isChanged=true;
			}
		}
	});

	/**
	*<p>文本的字体名称，以字符串形式表示。</p>
	*<p>默认值为："Arial"，可以通过Text.defaultFont设置默认字体。</p>
	*<p>如果运行时系统找不到设定的字体，则用系统默认的字体渲染文字，从而导致显示异常。(通常电脑上显示正常，在一些移动端因缺少设置的字体而显示异常)。</p>
	*@see laya.display.Text#defaultFont
	*/
	__getset(0,__proto,'font',function(){
		return this._font;
		},function(value){
		if ((this._style).currBitmapFont){
			this._getTextStyle().currBitmapFont=null;
			this.scale(1,1);
		}
		if (Text._bitmapFonts && Text._bitmapFonts[value]){
			this._getTextStyle().currBitmapFont=Text._bitmapFonts[value];
		}
		this._font=value;
		this.isChanged=true;
	});

	/**
	*<p>指定文本的字体大小（以像素为单位）。</p>
	*<p>默认为20像素，可以通过 <code>Text.defaultFontSize</code> 设置默认大小。</p>
	*/
	__getset(0,__proto,'fontSize',function(){
		return this._fontSize;
		},function(value){
		if (this._fontSize !=value){
			this._fontSize=value;
			this.isChanged=true;
		}
	});

	/**
	*<p>表示使用此文本格式的文本是否为斜体。</p>
	*<p>默认值为 false，这意味着不使用斜体。如果值为 true，则文本为斜体。</p>
	*/
	__getset(0,__proto,'italic',function(){
		return (this._style).italic;
		},function(value){
		this._getTextStyle().italic=value;
		this.isChanged=true;
	});

	/**
	*<p>表示文本的水平显示方式。</p>
	*<p><b>取值：</b>
	*<li>"left"： 居左对齐显示。</li>
	*<li>"center"： 居中对齐显示。</li>
	*<li>"right"： 居右对齐显示。</li>
	*</p>
	*/
	__getset(0,__proto,'align',function(){
		return (this._style).align;
		},function(value){
		this._getTextStyle().align=value;
		this.isChanged=true;
	});

	/**
	*<p>表示文本的垂直显示方式。</p>
	*<p><b>取值：</b>
	*<li>"top"： 居顶部对齐显示。</li>
	*<li>"middle"： 居中对齐显示。</li>
	*<li>"bottom"： 居底部对齐显示。</li>
	*</p>
	*/
	__getset(0,__proto,'valign',function(){
		return this._valign;
		},function(value){
		this._valign=value;
		this.isChanged=true;
	});

	/**
	*<p>表示文本是否自动换行，默认为false。</p>
	*<p>若值为true，则自动换行；否则不自动换行。</p>
	*/
	__getset(0,__proto,'wordWrap',function(){
		return (this._style).wordWrap;
		},function(value){
		this._getTextStyle().wordWrap=value;
		this.isChanged=true;
	});

	/**
	*垂直行间距（以像素为单位）。
	*/
	__getset(0,__proto,'leading',function(){
		return (this._style).leading;
		},function(value){
		this._getTextStyle().leading=value;
		this.isChanged=true;
	});

	/**
	*文本背景颜色，以字符串表示。
	*/
	__getset(0,__proto,'bgColor',function(){
		return (this._style).bgColor;
		},function(value){
		this._getTextStyle().bgColor=value;
		this._renderType |=/*laya.display.SpriteConst.STYLE*/0x80;
		this._setBgStyleColor(0,0,this.width,this.height,value);
		this._setRenderType(this._renderType);
		this.isChanged=true;
	});

	/**
	*文本边框背景颜色，以字符串表示。
	*/
	__getset(0,__proto,'borderColor',function(){
		return (this._style).borderColor;
		},function(value){
		this._getTextStyle().borderColor=value;
		this._renderType |=/*laya.display.SpriteConst.STYLE*/0x80;
		this._setBorderStyleColor(0,0,this.width,this.height,value,1);
		this._setRenderType(this._renderType);
		this.isChanged=true;
	});

	/**
	*<p>描边宽度（以像素为单位）。</p>
	*<p>默认值0，表示不描边。</p>
	*/
	__getset(0,__proto,'stroke',function(){
		return (this._style).stroke;
		},function(value){
		this._getTextStyle().stroke=value;
		this.isChanged=true;
	});

	/**
	*<p>描边颜色，以字符串表示。</p>
	*<p>默认值为 "#000000"（黑色）;</p>
	*/
	__getset(0,__proto,'strokeColor',function(){
		return (this._style).strokeColor;
		},function(value){
		this._getTextStyle().strokeColor=value;
		this.isChanged=true;
	});

	/**
	*@private
	*一个布尔值，表示文本的属性是否有改变。若为true表示有改变。
	*/
	__getset(0,__proto,'isChanged',null,function(value){
		if (this._isChanged!==value){
			this._isChanged=value;
			value && Laya.systemTimer.callLater(this,this.typeset);
		}
	});

	/**
	*<p>设置横向滚动量。</p>
	*<p>即使设置超出滚动范围的值，也会被自动限制在可能的最大值处。</p>
	*/
	/**
	*获取横向滚动量。
	*/
	__getset(0,__proto,'scrollX',function(){
		if (!this._clipPoint)return 0;
		return this._clipPoint.x;
		},function(value){
		if (this.overflow !="scroll" || (this.textWidth < this._width || !this._clipPoint))return;
		value=value < this.padding[3] ? this.padding[3] :value;
		var maxScrollX=this._textWidth-this._width;
		value=value > maxScrollX ? maxScrollX :value;
		this._clipPoint.x=value;
		this._renderText();
	});

	/**
	*设置纵向滚动量（px)。即使设置超出滚动范围的值，也会被自动限制在可能的最大值处。
	*/
	/**
	*获取纵向滚动量。
	*/
	__getset(0,__proto,'scrollY',function(){
		if (!this._clipPoint)return 0;
		return this._clipPoint.y;
		},function(value){
		if (this.overflow !="scroll" || (this.textHeight < this._height || !this._clipPoint))return;
		value=value < this.padding[0] ? this.padding[0] :value;
		var maxScrollY=this._textHeight-this._height;
		value=value > maxScrollY ? maxScrollY :value;
		this._clipPoint.y=value;
		this._renderText();
	});

	/**
	*获取横向可滚动最大值。
	*/
	__getset(0,__proto,'maxScrollX',function(){
		return (this.textWidth < this._width)? 0 :this._textWidth-this._width;
	});

	/**
	*获取纵向可滚动最大值。
	*/
	__getset(0,__proto,'maxScrollY',function(){
		return (this.textHeight < this._height)? 0 :this._textHeight-this._height;
	});

	/**返回文字行信息*/
	__getset(0,__proto,'lines',function(){
		if (this._isChanged)this.typeset();
		return this._lines;
	});

	/**下划线的颜色，为null则使用字体颜色。*/
	__getset(0,__proto,'underlineColor',function(){
		return (this._style).underlineColor;
		},function(value){
		this._getTextStyle().underlineColor=value;
		if (!this._isChanged)this._renderText();
	});

	/**是否显示下划线。*/
	__getset(0,__proto,'underline',function(){
		return (this._style).underline;
		},function(value){
		this._getTextStyle().underline=value;
	});

	Text.defaultFontStr=function(){
		return Text.defaultFontSize+"px "+Text.defaultFont;
	}

	Text.registerBitmapFont=function(name,bitmapFont){
		Text._bitmapFonts || (Text._bitmapFonts={});
		Text._bitmapFonts[name]=bitmapFont;
	}

	Text.unregisterBitmapFont=function(name,destroy){
		(destroy===void 0)&& (destroy=true);
		if (Text._bitmapFonts && Text._bitmapFonts[name]){
			var tBitmapFont=Text._bitmapFonts[name];
			if (destroy)tBitmapFont.destroy();
			delete Text._bitmapFonts[name];
		}
	}

	Text.VISIBLE="visible";
	Text.SCROLL="scroll";
	Text.HIDDEN="hidden";
	Text.defaultFontSize=12;
	Text.defaultFont="Arial";
	Text.langPacks=null;
	Text.isComplexText=false;
	Text._testWord="游";
	Text._bitmapFonts=null;
	Text.CharacterCache=true;
	Text.RightToLeft=false;
	__static(Text,
	['fontFamilyMap',function(){return this.fontFamilyMap={"报隶":"报隶-简","黑体":"黑体-简","楷体":"楷体-简","兰亭黑":"兰亭黑-简","隶变":"隶变-简","凌慧体":"凌慧体-简","翩翩体":"翩翩体-简","苹方":"苹方-简","手札体":"手札体-简","宋体":"宋体-简","娃娃体":"娃娃体-简","魏碑":"魏碑-简","行楷":"行楷-简","雅痞":"雅痞-简","圆体":"圆体-简"};}
	]);
	return Text;
})(Sprite)


/**
*@private
*/
//class laya.media.SoundNode extends laya.display.Sprite
var SoundNode=(function(_super){
	function SoundNode(){
		this.url=null;
		this._channel=null;
		this._tar=null;
		this._playEvents=null;
		this._stopEvents=null;
		SoundNode.__super.call(this);
		this.visible=false;
		this.on(/*laya.events.Event.ADDED*/"added",this,this._onParentChange);
		this.on(/*laya.events.Event.REMOVED*/"removed",this,this._onParentChange);
	}

	__class(SoundNode,'laya.media.SoundNode',_super);
	var __proto=SoundNode.prototype;
	/**@private */
	__proto._onParentChange=function(){
		this.target=this.parent;
	}

	/**
	*播放
	*@param loops 循环次数
	*@param complete 完成回调
	*
	*/
	__proto.play=function(loops,complete){
		(loops===void 0)&& (loops=1);
		if (isNaN(loops)){
			loops=1;
		}
		if (!this.url)return;
		this.stop();
		this._channel=SoundManager.playSound(this.url,loops,complete);
	}

	/**
	*停止播放
	*
	*/
	__proto.stop=function(){
		if (this._channel && !this._channel.isStopped){
			this._channel.stop();
		}
		this._channel=null;
	}

	/**@private */
	__proto._setPlayAction=function(tar,event,action,add){
		(add===void 0)&& (add=true);
		if (!this[action])return;
		if (!tar)return;
		if (add){
			tar.on(event,this,this[action]);
			}else {
			tar.off(event,this,this[action]);
		}
	}

	/**@private */
	__proto._setPlayActions=function(tar,events,action,add){
		(add===void 0)&& (add=true);
		if (!tar)return;
		if (!events)return;
		var eventArr=events.split(",");
		var i=0,len=0;
		len=eventArr.length;
		for (i=0;i < len;i++){
			this._setPlayAction(tar,eventArr[i],action,add);
		}
	}

	/**
	*设置触发播放的事件
	*@param events
	*
	*/
	__getset(0,__proto,'playEvent',null,function(events){
		this._playEvents=events;
		if (!events)return;
		if (this._tar){
			this._setPlayActions(this._tar,events,"play");
		}
	});

	/**
	*设置控制播放的对象
	*@param tar
	*
	*/
	__getset(0,__proto,'target',null,function(tar){
		if (this._tar){
			this._setPlayActions(this._tar,this._playEvents,"play",false);
			this._setPlayActions(this._tar,this._stopEvents,"stop",false);
		}
		this._tar=tar;
		if (this._tar){
			this._setPlayActions(this._tar,this._playEvents,"play",true);
			this._setPlayActions(this._tar,this._stopEvents,"stop",true);
		}
	});

	/**
	*设置触发停止的事件
	*@param events
	*
	*/
	__getset(0,__proto,'stopEvent',null,function(events){
		this._stopEvents=events;
		if (!events)return;
		if (this._tar){
			this._setPlayActions(this._tar,events,"stop");
		}
	});

	return SoundNode;
})(Sprite)


/**
*@private
*<p> <code>HTMLImage</code> 用于创建 HTML Image 元素。</p>
*<p>请使用 <code>HTMLImage.create()<code>获取新实例，不要直接使用 <code>new HTMLImage<code> 。</p>
*/
//class laya.resource.HTMLImage extends laya.resource.Bitmap
var HTMLImage=(function(_super){
	function HTMLImage(){
		/**@private */
		//this._source=null;
		HTMLImage.__super.call(this);
	}

	__class(HTMLImage,'laya.resource.HTMLImage',_super);
	var __proto=HTMLImage.prototype;
	/**
	*通过图片源填充纹理,可为HTMLImageElement、HTMLCanvasElement、HTMLVideoElement、ImageBitmap、ImageData。
	*/
	__proto.loadImageSource=function(source){
		var width=source.width;
		var height=source.height;
		if (width <=0 || height <=0)
			throw new Error("HTMLImage:width or height must large than 0.");
		this._width=width;
		this._height=height;
		this._source=source;
		this._setGPUMemory(width *height *4);
		this._activeResource();
	}

	//TODO:coverage
	__proto._disposeResource=function(){
		(this._source)&& (this._source=null,this._setGPUMemory(0));
	}

	//TODO:coverage
	__proto._getSource=function(){
		return this._source;
	}

	HTMLImage.create=function(width,height){
		return new HTMLImage();
	}

	return HTMLImage;
})(Bitmap)


/**
*<p>动画基类，提供了基础的动画播放控制方法和帧标签事件相关功能。</p>
*<p>可以继承此类，但不要直接实例化此类，因为有些方法需要由子类实现。</p>
*/
//class laya.display.AnimationBase extends laya.display.Sprite
var AnimationBase=(function(_super){
	function AnimationBase(){
		/**是否循环播放，调用play(...)方法时，会将此值设置为指定的参数值。*/
		this.loop=false;
		/**播放顺序类型：AnimationBase.WRAP_POSITIVE为正序播放(默认值)，AnimationBase.WRAP_REVERSE为倒序播放，AnimationBase.WRAP_PINGPONG为pingpong播放(当按指定顺序播放完结尾后，如果继续播发，则会改变播放顺序)。*/
		this.wrapMode=0;
		/**@private */
		this._index=0;
		/**@private */
		this._count=0;
		/**@private */
		this._isPlaying=false;
		/**@private */
		this._labels=null;
		/**是否是逆序播放*/
		this._isReverse=false;
		/**@private */
		this._frameRateChanged=false;
		/**@private */
		this._actionName=null;
		/**@private */
		this._controlNode=null;
		AnimationBase.__super.call(this);
		this._interval=Config.animationInterval;
		this._setBitUp(/*laya.Const.DISPLAY*/0x10);
	}

	__class(AnimationBase,'laya.display.AnimationBase',_super);
	var __proto=AnimationBase.prototype;
	/**
	*<p>开始播放动画。play(...)方法被设计为在创建实例后的任何时候都可以被调用，当相应的资源加载完毕、调用动画帧填充方法(set frames)或者将实例显示在舞台上时，会判断是否正在播放中，如果是，则进行播放。</p>
	*<p>配合wrapMode属性，可设置动画播放顺序类型。</p>
	*@param start （可选）指定动画播放开始的索引(int)或帧标签(String)。帧标签可以通过addLabel(...)和removeLabel(...)进行添加和删除。
	*@param loop （可选）是否循环播放。
	*@param name （可选）动画名称。
	*/
	__proto.play=function(start,loop,name){
		(start===void 0)&& (start=0);
		(loop===void 0)&& (loop=true);
		(name===void 0)&& (name="");
		this._isPlaying=true;
		this._actionName=name;
		this.index=((typeof start=='string'))? this._getFrameByLabel(start):start;
		this.loop=loop;
		this._isReverse=this.wrapMode===1;
		if (this.index==0 && this._isReverse){
			this.index=this.count-1;
		}
		if (this.interval > 0)this.timerLoop(this.interval,this,this._frameLoop,null,true,true);
	}

	/**@private */
	__proto._getFrameByLabel=function(label){
		for (var i=0;i < this._count;i++){
			var item=this._labels[i];
			if (item && (item).indexOf(label)>-1)return i;
		}
		return 0;
	}

	/**@private */
	__proto._frameLoop=function(){
		if (this._isReverse){
			this._index--;
			if (this._index < 0){
				if (this.loop){
					if (this.wrapMode==2){
						this._index=this._count > 0 ? 1 :0;
						this._isReverse=false;
						}else {
						this._index=this._count-1;
					}
					this.event(/*laya.events.Event.COMPLETE*/"complete");
					}else {
					this._index=0;
					this.stop();
					this.event(/*laya.events.Event.COMPLETE*/"complete");
					return;
				}
			}
			}else {
			this._index++;
			if (this._index >=this._count){
				if (this.loop){
					if (this.wrapMode==2){
						this._index=this._count-2 >=0 ? this._count-2 :0;
						this._isReverse=true;
						}else {
						this._index=0;
					}
					this.event(/*laya.events.Event.COMPLETE*/"complete");
					}else {
					this._index--;
					this.stop();
					this.event(/*laya.events.Event.COMPLETE*/"complete");
					return;
				}
			}
		}
		this.index=this._index;
	}

	/**@private */
	__proto._setControlNode=function(node){
		if (this._controlNode){
			this._controlNode.off(/*laya.events.Event.DISPLAY*/"display",this,this._resumePlay);
			this._controlNode.off(/*laya.events.Event.UNDISPLAY*/"undisplay",this,this._resumePlay);
		}
		this._controlNode=node;
		if (node && node !=this){
			node.on(/*laya.events.Event.DISPLAY*/"display",this,this._resumePlay);
			node.on(/*laya.events.Event.UNDISPLAY*/"undisplay",this,this._resumePlay);
		}
	}

	/**@private */
	__proto._setDisplay=function(value){
		_super.prototype._setDisplay.call(this,value);
		this._resumePlay();
	}

	/**@private */
	__proto._resumePlay=function(){
		if (this._isPlaying){
			if (this._controlNode.displayedInStage)this.play(this._index,this.loop,this._actionName);
			else this.clearTimer(this,this._frameLoop);
		}
	}

	/**
	*停止动画播放。
	*/
	__proto.stop=function(){
		this._isPlaying=false;
		this.clearTimer(this,this._frameLoop);
	}

	/**
	*增加一个帧标签到指定索引的帧上。当动画播放到此索引的帧时会派发Event.LABEL事件，派发事件是在完成当前帧画面更新之后。
	*@param label 帧标签名称
	*@param index 帧索引
	*/
	__proto.addLabel=function(label,index){
		if (!this._labels)this._labels={};
		if (!this._labels[index])this._labels[index]=[];
		this._labels[index].push(label);
	}

	/**
	*删除指定的帧标签。
	*@param label 帧标签名称。注意：如果为空，则删除所有帧标签！
	*/
	__proto.removeLabel=function(label){
		if (!label)this._labels=null;
		else if (this._labels){
			for (var name in this._labels){
				this._removeLabelFromList(this._labels[name],label);
			}
		}
	}

	/**@private */
	__proto._removeLabelFromList=function(list,label){
		if (!list)return;
		for (var i=list.length-1;i >=0;i--){
			if (list[i]==label){
				list.splice(i,1);
			}
		}
	}

	/**
	*将动画切换到指定帧并停在那里。
	*@param position 帧索引或帧标签
	*/
	__proto.gotoAndStop=function(position){
		this.index=((typeof position=='string'))? this._getFrameByLabel(position):position;
		this.stop();
	}

	/**
	*@private
	*显示到某帧
	*@param value 帧索引
	*/
	__proto._displayToIndex=function(value){}
	/**
	*停止动画播放，并清理对象属性。之后可存入对象池，方便对象复用。
	*@return 返回对象本身
	*/
	__proto.clear=function(){
		this.stop();
		this._labels=null;
		return this;
	}

	/**
	*<p>动画播放的帧间隔时间(单位：毫秒)。默认值依赖于Config.animationInterval=50，通过Config.animationInterval可以修改默认帧间隔时间。</p>
	*<p>要想为某动画设置独立的帧间隔时间，可以使用set interval，注意：如果动画正在播放，设置后会重置帧循环定时器的起始时间为当前时间，也就是说，如果频繁设置interval，会导致动画帧更新的时间间隔会比预想的要慢，甚至不更新。</p>
	*/
	__getset(0,__proto,'interval',function(){
		return this._interval;
		},function(value){
		if (this._interval !=value){
			this._frameRateChanged=true;
			this._interval=value;
			if (this._isPlaying && value > 0){
				this.timerLoop(value,this,this._frameLoop,null,true,true);
			}
		}
	});

	/**
	*是否正在播放中。
	*/
	__getset(0,__proto,'isPlaying',function(){
		return this._isPlaying;
	});

	/**
	*动画当前帧的索引。
	*/
	__getset(0,__proto,'index',function(){
		return this._index;
		},function(value){
		this._index=value;
		this._displayToIndex(value);
		if (this._labels && this._labels[value]){
			var tArr=this._labels[value];
			for (var i=0,len=tArr.length;i < len;i++){
				this.event(/*laya.events.Event.LABEL*/"label",tArr[i]);
			}
		}
	});

	/**
	*当前动画中帧的总数。
	*/
	__getset(0,__proto,'count',function(){
		return this._count;
	});

	AnimationBase.WRAP_POSITIVE=0;
	AnimationBase.WRAP_REVERSE=1;
	AnimationBase.WRAP_PINGPONG=2;
	return AnimationBase;
})(Sprite)


/**
*<p> <code>Stage</code> 是舞台类，显示列表的根节点，所有显示对象都在舞台上显示。通过 Laya.stage 单例访问。</p>
*<p>Stage提供几种适配模式，不同的适配模式会产生不同的画布大小，画布越大，渲染压力越大，所以要选择合适的适配方案。</p>
*<p>Stage提供不同的帧率模式，帧率越高，渲染压力越大，越费电，合理使用帧率甚至动态更改帧率有利于改进手机耗电。</p>
*/
//class laya.display.Stage extends laya.display.Sprite
var Stage=(function(_super){
	function Stage(){
		/**当前焦点对象，此对象会影响当前键盘事件的派发主体。*/
		this.focus=null;
		/**帧率类型，支持三种模式：fast-60帧(默认)，slow-30帧，mouse-30帧（鼠标活动后会自动加速到60，鼠标不动2秒后降低为30帧，以节省消耗），sleep-1帧。*/
		this._frameRate="fast";
		/**设计宽度（初始化时设置的宽度Laya.init(width,height)）*/
		this.designWidth=0;
		/**设计高度（初始化时设置的高度Laya.init(width,height)）*/
		this.designHeight=0;
		/**画布是否发生翻转。*/
		this.canvasRotation=false;
		/**画布的旋转角度。*/
		this.canvasDegree=0;
		/**
		*<p>设置是否渲染，设置为false，可以停止渲染，画面会停留到最后一次渲染上，减少cpu消耗，此设置不影响时钟。</p>
		*<p>比如非激活状态，可以设置renderingEnabled=false以节省消耗。</p>
		**/
		this.renderingEnabled=true;
		/**是否启用屏幕适配，可以适配后，在某个时候关闭屏幕适配，防止某些操作导致的屏幕意外改变*/
		this.screenAdaptationEnabled=true;
		/**@private */
		this._screenMode="none";
		/**@private */
		this._scaleMode="noscale";
		/**@private */
		this._alignV="top";
		/**@private */
		this._alignH="left";
		/**@private */
		this._bgColor="black";
		/**@private */
		this._mouseMoveTime=0;
		/**@private */
		this._renderCount=0;
		/**@private */
		this._safariOffsetY=0;
		/**@private */
		this._frameStartTime=0;
		/**@private */
		this._isFocused=false;
		/**@private */
		this._isVisibility=false;
		/**@private webgl Color*/
		this._wgColor=[0,0,0,1];
		/**@private */
		this._scene3Ds=[];
		/**@private */
		this._globalRepaintSet=false;
		/**@private */
		this._globalRepaintGet=false;
		/**@private */
		this._curUIBase=null;
		Stage.__super.call(this);
		this.offset=new Point();
		this._canvasTransform=new Matrix();
		this._previousOrientation=Browser.window.orientation;
		this._3dUI=[];
		var _$this=this;
		this.transform=Matrix.create();
		this.mouseEnabled=true;
		this.hitTestPrior=true;
		this.autoSize=false;
		this._setBit(/*laya.Const.DISPLAYED_INSTAGE*/0x80,true);
		this._setBit(/*laya.Const.ACTIVE_INHIERARCHY*/0x02,true);
		this._isFocused=true;
		this._isVisibility=true;
		var window=Browser.window;
		var _me=this;
		window.addEventListener("focus",function(){
			_$this._isFocused=true;
			_me.event(/*laya.events.Event.FOCUS*/"focus");
			_me.event(/*laya.events.Event.FOCUS_CHANGE*/"focuschange");
		});
		window.addEventListener("blur",function(){
			_$this._isFocused=false;
			_me.event(/*laya.events.Event.BLUR*/"blur");
			_me.event(/*laya.events.Event.FOCUS_CHANGE*/"focuschange");
			if (_me._isInputting())Input["inputElement"].target.focus=false;
		});
		var hidden="hidden",state="visibilityState",visibilityChange="visibilitychange";
		var document=window.document;
		if (typeof document.hidden!=="undefined"){
			visibilityChange="visibilitychange";
			state="visibilityState";
			}else if (typeof document.mozHidden!=="undefined"){
			visibilityChange="mozvisibilitychange";
			state="mozVisibilityState";
			}else if (typeof document.msHidden!=="undefined"){
			visibilityChange="msvisibilitychange";
			state="msVisibilityState";
			}else if (typeof document.webkitHidden!=="undefined"){
			visibilityChange="webkitvisibilitychange";
			state="webkitVisibilityState";
		}
		window.document.addEventListener(visibilityChange,visibleChangeFun);
		function visibleChangeFun (){
			if (Browser.document[state]=="hidden"){
				_$this._isVisibility=false;
				if (_me._isInputting())Input["inputElement"].target.focus=false;
				}else {
				_$this._isVisibility=true;
			}
			_$this.renderingEnabled=_$this._isVisibility;
			_me.event(/*laya.events.Event.VISIBILITY_CHANGE*/"visibilitychange");
		}
		window.addEventListener("resize",function(){
			var orientation=Browser.window.orientation;
			if (orientation !=null && orientation !=_$this._previousOrientation && _me._isInputting()){
				Input["inputElement"].target.focus=false;
			}
			_$this._previousOrientation=orientation;
			if (_me._isInputting())return;
			if (Browser.onSafari)
				_me._safariOffsetY=(Browser.window.__innerHeight || Browser.document.body.clientHeight || Browser.document.documentElement.clientHeight)-Browser.window.innerHeight;
			_me._resetCanvas();
		});
		window.addEventListener("orientationchange",function(e){
			_me._resetCanvas();
		});
		this.on(/*laya.events.Event.MOUSE_MOVE*/"mousemove",this,this._onmouseMove);
		if (Browser.onMobile)this.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._onmouseMove);
	}

	__class(Stage,'laya.display.Stage',_super);
	var __proto=Stage.prototype;
	/**
	*@private
	*在移动端输入时，输入法弹出期间不进行画布尺寸重置。
	*/
	__proto._isInputting=function(){
		return (Browser.onMobile && Input.isInputting);
	}

	/**@private */
	__proto._changeCanvasSize=function(){
		this.setScreenSize(Browser.clientWidth *Browser.pixelRatio,Browser.clientHeight *Browser.pixelRatio);
	}

	/**@private */
	__proto._resetCanvas=function(){
		if (!this.screenAdaptationEnabled)return;
		this._changeCanvasSize();
	}

	/**
	*设置屏幕大小，场景会根据屏幕大小进行适配。可以动态调用此方法，来更改游戏显示的大小。
	*@param screenWidth 屏幕宽度。
	*@param screenHeight 屏幕高度。
	*/
	__proto.setScreenSize=function(screenWidth,screenHeight){
		var rotation=false;
		if (this._screenMode!=="none"){
			var screenType=screenWidth / screenHeight < 1 ? "vertical" :"horizontal";
			rotation=screenType!==this._screenMode;
			if (rotation){
				var temp=screenHeight;
				screenHeight=screenWidth;
				screenWidth=temp;
			}
		}
		this.canvasRotation=rotation;
		var canvas=Render._mainCanvas;
		var canvasStyle=canvas.source.style;
		var mat=this._canvasTransform.identity();
		var scaleMode=this._scaleMode;
		var scaleX=screenWidth / this.designWidth;
		var scaleY=screenHeight / this.designHeight;
		var canvasWidth=this.designWidth;
		var canvasHeight=this.designHeight;
		var realWidth=screenWidth;
		var realHeight=screenHeight;
		var pixelRatio=Browser.pixelRatio;
		this._width=this.designWidth;
		this._height=this.designHeight;
		switch (scaleMode){
			case "noscale":
				scaleX=scaleY=1;
				realWidth=this.designWidth;
				realHeight=this.designHeight;
				break ;
			case "showall":
				scaleX=scaleY=Math.min(scaleX,scaleY);
				canvasWidth=realWidth=Math.round(this.designWidth *scaleX);
				canvasHeight=realHeight=Math.round(this.designHeight *scaleY);
				break ;
			case "noborder":
				scaleX=scaleY=Math.max(scaleX,scaleY);
				realWidth=Math.round(this.designWidth *scaleX);
				realHeight=Math.round(this.designHeight *scaleY);
				break ;
			case "full":
				scaleX=scaleY=1;
				this._width=canvasWidth=screenWidth;
				this._height=canvasHeight=screenHeight;
				break ;
			case "fixedwidth":
				scaleY=scaleX;
				this._height=canvasHeight=Math.round(screenHeight / scaleX);
				break ;
			case "fixedheight":
				scaleX=scaleY;
				this._width=canvasWidth=Math.round(screenWidth / scaleY);
				break ;
			case "fixedauto":
				if ((screenWidth / screenHeight)< (this.designWidth / this.designHeight)){
					scaleY=scaleX;
					this._height=canvasHeight=Math.round(screenHeight / scaleX);
					}else {
					scaleX=scaleY;
					this._width=canvasWidth=Math.round(screenWidth / scaleY);
				}
				break ;
			}
		scaleX *=this.scaleX;
		scaleY *=this.scaleY;
		if (scaleX===1 && scaleY===1){
			this.transform.identity();
			}else {
			this.transform.a=this._formatData(scaleX / (realWidth / canvasWidth));
			this.transform.d=this._formatData(scaleY / (realHeight / canvasHeight));
		}
		if (Render.isConchApp){
			this._conchData._float32Data[ /*laya.display.SpriteConst.POSSCALEX*/10]=this._formatData(scaleX / (realWidth / canvasWidth));
			this._conchData._float32Data[ /*laya.display.SpriteConst.POSSCALEY*/11]=this._formatData(scaleY / (realHeight / canvasHeight));
			this._conchData._float32Data[ /*laya.display.SpriteConst.POSTRANSFORM_FLAG*/15]=1;
		}
		canvas.size(canvasWidth,canvasHeight);
		RunDriver.changeWebGLSize(canvasWidth,canvasHeight);
		mat.scale(realWidth / canvasWidth / pixelRatio,realHeight / canvasHeight / pixelRatio);
		if (this._alignH==="left")this.offset.x=0;
		else if (this._alignH==="right")this.offset.x=screenWidth-realWidth;
		else this.offset.x=(screenWidth-realWidth)*0.5 / pixelRatio;
		if (this._alignV==="top")this.offset.y=0;
		else if (this._alignV==="bottom")this.offset.y=screenHeight-realHeight;
		else this.offset.y=(screenHeight-realHeight)*0.5 / pixelRatio;
		this.offset.x=Math.round(this.offset.x);
		this.offset.y=Math.round(this.offset.y);
		mat.translate(this.offset.x,this.offset.y);
		if (this._safariOffsetY)mat.translate(0,this._safariOffsetY);
		this.canvasDegree=0;
		if (rotation){
			if (this._screenMode==="horizontal"){
				mat.rotate(Math.PI / 2);
				mat.translate(screenHeight / pixelRatio,0);
				this.canvasDegree=90;
				}else {
				mat.rotate(-Math.PI / 2);
				mat.translate(0,screenWidth / pixelRatio);
				this.canvasDegree=-90;
			}
		}
		mat.a=this._formatData(mat.a);
		mat.d=this._formatData(mat.d);
		mat.tx=this._formatData(mat.tx);
		mat.ty=this._formatData(mat.ty);
		this.transform=this.transform;
		canvasStyle.transformOrigin=canvasStyle.webkitTransformOrigin=canvasStyle.msTransformOrigin=canvasStyle.mozTransformOrigin=canvasStyle.oTransformOrigin="0px 0px 0px";
		canvasStyle.transform=canvasStyle.webkitTransform=canvasStyle.msTransform=canvasStyle.mozTransform=canvasStyle.oTransform="matrix("+mat.toString()+")";
		if (this._safariOffsetY)mat.translate(0,-this._safariOffsetY);
		mat.translate(parseInt(canvasStyle.left)|| 0,parseInt(canvasStyle.top)|| 0);
		this.visible=true;
		this._repaint |=/*laya.display.SpriteConst.REPAINT_CACHE*/0x02;
		this.event(/*laya.events.Event.RESIZE*/"resize");
	}

	/**@private */
	__proto._formatData=function(value){
		if (Math.abs(value)< 0.000001)return 0;
		if (Math.abs(1-value)< 0.001)return value > 0 ? 1 :-1;
		return value;
	}

	/**@inheritDoc */
	__proto.getMousePoint=function(){
		return Point.TEMP.setTo(this.mouseX,this.mouseY);
	}

	/**@inheritDoc */
	__proto.repaint=function(type){
		(type===void 0)&& (type=/*laya.display.SpriteConst.REPAINT_CACHE*/0x02);
		this._repaint |=type;
	}

	/**@inheritDoc */
	__proto.repaintForNative=function(type){
		(type===void 0)&& (type=/*laya.display.SpriteConst.REPAINT_CACHE*/0x02);
		this._conchData._int32Data[ /*laya.display.SpriteConst.POSREPAINT*/4] |=type;
	}

	/**@inheritDoc */
	__proto.parentRepaint=function(type){
		(type===void 0)&& (type=/*laya.display.SpriteConst.REPAINT_CACHE*/0x02);
	}

	/**@private */
	__proto._loop=function(){
		this._globalRepaintGet=this._globalRepaintSet;
		this._globalRepaintSet=false;
		this.render(Render._context,0,0);
		return true;
	}

	/**@private */
	__proto.getFrameTm=function(){
		return this._frameStartTime;
	}

	/**@private */
	__proto._onmouseMove=function(e){
		this._mouseMoveTime=Browser.now();
	}

	/**
	*<p>获得距当前帧开始后，过了多少时间，单位为毫秒。</p>
	*<p>可以用来判断函数内时间消耗，通过合理控制每帧函数处理消耗时长，避免一帧做事情太多，对复杂计算分帧处理，能有效降低帧率波动。</p>
	*/
	__proto.getTimeFromFrameStart=function(){
		return Browser.now()-this._frameStartTime;
	}

	/**@inheritDoc */
	__proto.render=function(context,x,y){
		Stage._dbgSprite.graphics.clear();
		if (this._frameRate==="sleep"){
			var now=Browser.now();
			if (now-this._frameStartTime >=1000)this._frameStartTime=now;
			else return;
			}else {
			if (!this._visible){
				this._renderCount++;
				if (this._renderCount % 5===0){
					CallLater.I._update();
					Stat.loopCount++;
					this._updateTimers();
				}
				return;
			}
			this._frameStartTime=Browser.now();
		}
		this._renderCount++;
		var frameMode=this._frameRate==="mouse" ? (((this._frameStartTime-this._mouseMoveTime)< 2000)? "fast" :"slow"):this._frameRate;
		var isFastMode=(frameMode!=="slow");
		var isDoubleLoop=(this._renderCount % 2===0);
		Stat.renderSlow=!isFastMode;
		if (isFastMode || isDoubleLoop){
			CallLater.I._update();
			Stat.loopCount++;
			if (!Render.isConchApp){
				if (Render.isWebGL && this.renderingEnabled){
					for (var i=0,n=this._scene3Ds.length;i < n;i++)
					this._scene3Ds[i]._update();
					context.clear();
					_super.prototype.render.call(this,context,x,y);
					Stat._show && Stat._sp && Stat._sp.render(context,x,y);
				}
			}
		}
		Stage._dbgSprite.render(context,0,0);
		if (isFastMode || !isDoubleLoop){
			if (this.renderingEnabled){
				if (Render.isWebGL){
					RunDriver.clear(this._bgColor);
					context.flush();
					VectorGraphManager.instance && VectorGraphManager.getInstance().endDispose();
					}else {
					RunDriver.clear(this._bgColor);
					_super.prototype.render.call(this,context,x,y);
					Stat._show && Stat._sp && Stat._sp.render(context,x,y);
					if (Render.isConchApp)context.gl.commit();
				}
			}
			this._updateTimers();
		}
	}

	__proto._updateTimers=function(){
		Laya.systemTimer._update();
		Laya.startTimer._update();
		Laya.physicsTimer._update();
		Laya.updateTimer._update();
		Laya.lateTimer._update();
		Laya.timer._update();
	}

	__proto.renderToNative=function(context,x,y){
		this._renderCount++;
		Stat.loopCount++;
		if (!this._visible){
			if (this._renderCount % 5===0){
				CallLater.I._update();
				Stat.loopCount++;
				this._updateTimers();
				CallLater.I._update();
			}
			return;
		}
		CallLater.I._update();
		this._updateTimers();
		CallLater.I._update();
		if (this.renderingEnabled){
			RunDriver.clear(this._bgColor);
			_super.prototype.render.call(this,context,x,y);
			Stat._show && Stat._sp && Stat._sp.render(context,x,y);
			context.gl.commit();
		}
	}

	/**@private */
	__proto._requestFullscreen=function(){
		var element=Browser.document.documentElement;
		if (element.requestFullscreen){
			element.requestFullscreen();
			}else if (element.mozRequestFullScreen){
			element.mozRequestFullScreen();
			}else if (element.webkitRequestFullscreen){
			element.webkitRequestFullscreen();
			}else if (element.msRequestFullscreen){
			element.msRequestFullscreen();
		}
	}

	/**@private */
	__proto._fullScreenChanged=function(){
		Laya.stage.event(/*laya.events.Event.FULL_SCREEN_CHANGE*/"fullscreenchange");
	}

	/**退出全屏模式*/
	__proto.exitFullscreen=function(){
		var document=Browser.document;
		if (document.exitFullscreen){
			document.exitFullscreen();
			}else if (document.mozCancelFullScreen){
			document.mozCancelFullScreen();
			}else if (document.webkitExitFullscreen){
			document.webkitExitFullscreen();
		}
	}

	/**@private */
	__proto.isGlobalRepaint=function(){
		return this._globalRepaintGet;
	}

	/**@private */
	__proto.setGlobalRepaint=function(){
		this._globalRepaintSet=true;
	}

	/**@private */
	__proto.add3DUI=function(uibase){
		var uiroot=/*__JS__ */uibase.rootView;
		if (this._3dUI.indexOf(uiroot)>=0)return;
		this._3dUI.push(uiroot);
	}

	/**@private */
	__proto.remove3DUI=function(uibase){
		var uiroot=/*__JS__ */uibase.rootView;
		var p=this._3dUI.indexOf(uiroot);
		if (p >=0){
			this._3dUI.splice(p,1);
			return true;
		}
		return false;
	}

	/**当前视窗由缩放模式导致的 Y 轴缩放系数。*/
	__getset(0,__proto,'clientScaleY',function(){
		return this._transform ? this._transform.getScaleY():1;
	});

	/**@inheritDoc */
	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		this.designWidth=value;
		Laya.superSet(Sprite,this,'width',value);
		Laya.systemTimer.callLater(this,this._changeCanvasSize);
	});

	/**
	*舞台是否获得焦点。
	*/
	__getset(0,__proto,'isFocused',function(){
		return this._isFocused;
	});

	/**
	*<p>水平对齐方式。默认值为"left"。</p>
	*<p><ul>取值范围：
	*<li>"left" ：居左对齐；</li>
	*<li>"center" ：居中对齐；</li>
	*<li>"right" ：居右对齐；</li>
	*</ul></p>
	*/
	__getset(0,__proto,'alignH',function(){
		return this._alignH;
		},function(value){
		this._alignH=value;
		Laya.systemTimer.callLater(this,this._changeCanvasSize);
	});

	/**@inheritDoc */
	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		this.designHeight=value;
		Laya.superSet(Sprite,this,'height',value);
		Laya.systemTimer.callLater(this,this._changeCanvasSize);
	});

	/**@inheritDoc */
	__getset(0,__proto,'transform',function(){
		if (this._tfChanged)this._adjustTransform();
		return this._transform=this._transform|| this._createTransform();
	},_super.prototype._$set_transform);

	/**
	*舞台是否处于可见状态(是否进入后台)。
	*/
	__getset(0,__proto,'isVisibility',function(){
		return this._isVisibility;
	});

	/**
	*<p>缩放模式。默认值为 "noscale"。</p>
	*<p><ul>取值范围：
	*<li>"noscale" ：不缩放；</li>
	*<li>"exactfit" ：全屏不等比缩放；</li>
	*<li>"showall" ：最小比例缩放；</li>
	*<li>"noborder" ：最大比例缩放；</li>
	*<li>"full" ：不缩放，stage的宽高等于屏幕宽高；</li>
	*<li>"fixedwidth" ：宽度不变，高度根据屏幕比缩放；</li>
	*<li>"fixedheight" ：高度不变，宽度根据屏幕比缩放；</li>
	*<li>"fixedauto" ：根据宽高比，自动选择使用fixedwidth或fixedheight；</li>
	*</ul></p>
	*/
	__getset(0,__proto,'scaleMode',function(){
		return this._scaleMode;
		},function(value){
		this._scaleMode=value;
		Laya.systemTimer.callLater(this,this._changeCanvasSize);
	});

	/**
	*<p>垂直对齐方式。默认值为"top"。</p>
	*<p><ul>取值范围：
	*<li>"top" ：居顶部对齐；</li>
	*<li>"middle" ：居中对齐；</li>
	*<li>"bottom" ：居底部对齐；</li>
	*</ul></p>
	*/
	__getset(0,__proto,'alignV',function(){
		return this._alignV;
		},function(value){
		this._alignV=value;
		Laya.systemTimer.callLater(this,this._changeCanvasSize);
	});

	/**舞台的背景颜色，默认为黑色，null为透明。*/
	__getset(0,__proto,'bgColor',function(){
		return this._bgColor;
		},function(value){
		this._bgColor=value;
		if (Render.isWebGL){
			if (value)
				this._wgColor=ColorUtils.create(value).arrColor;
			else
			this._wgColor=null;
		}
		if (Browser.onLimixiu){
			this._wgColor=ColorUtils.create(value).arrColor;
			}else if (value){
			Render.canvas.style.background=value;
			}else {
			Render.canvas.style.background="none";
		}
		if (Render.isConchApp){
			this._renderType |=/*laya.display.SpriteConst.STYLE*/0x80;
			this._setBgStyleColor(0,0,this.width,this.height,value);
			this._setRenderType(this._renderType);
		}
	});

	/**鼠标在 Stage 上的 X 轴坐标。*/
	__getset(0,__proto,'mouseX',function(){
		return Math.round(MouseManager.instance.mouseX / this.clientScaleX);
	});

	/**鼠标在 Stage 上的 Y 轴坐标。*/
	__getset(0,__proto,'mouseY',function(){
		return Math.round(MouseManager.instance.mouseY / this.clientScaleY);
	});

	/**当前视窗由缩放模式导致的 X 轴缩放系数。*/
	__getset(0,__proto,'clientScaleX',function(){
		return this._transform ? this._transform.getScaleX():1;
	});

	/**
	*<p>场景布局类型。</p>
	*<p><ul>取值范围：
	*<li>"none" ：不更改屏幕</li>
	*<li>"horizontal" ：自动横屏</li>
	*<li>"vertical" ：自动竖屏</li>
	*</ul></p>
	*/
	__getset(0,__proto,'screenMode',function(){
		return this._screenMode;
		},function(value){
		this._screenMode=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'visible',_super.prototype._$get_visible,function(value){
		if (this.visible!==value){
			Laya.superSet(Sprite,this,'visible',value);
			var style=Render._mainCanvas.source.style;
			style.visibility=value ? "visible" :"hidden";
		}
	});

	/**
	*<p>是否开启全屏，用户点击后进入全屏。</p>
	*<p>兼容性提示：部分浏览器不允许点击进入全屏，比如Iphone等。</p>
	*/
	__getset(0,__proto,'fullScreenEnabled',null,function(value){
		var document=Browser.document;
		var canvas=Render.canvas;
		if (value){
			canvas.addEventListener('mousedown',this._requestFullscreen);
			canvas.addEventListener('touchstart',this._requestFullscreen);
			document.addEventListener("fullscreenchange",this._fullScreenChanged);
			document.addEventListener("mozfullscreenchange",this._fullScreenChanged);
			document.addEventListener("webkitfullscreenchange",this._fullScreenChanged);
			document.addEventListener("msfullscreenchange",this._fullScreenChanged);
			}else {
			canvas.removeEventListener('mousedown',this._requestFullscreen);
			canvas.removeEventListener('touchstart',this._requestFullscreen);
			document.removeEventListener("fullscreenchange",this._fullScreenChanged);
			document.removeEventListener("mozfullscreenchange",this._fullScreenChanged);
			document.removeEventListener("webkitfullscreenchange",this._fullScreenChanged);
			document.removeEventListener("msfullscreenchange",this._fullScreenChanged);
		}
	});

	__getset(0,__proto,'frameRate',function(){
		if (!Render.isConchApp){
			return this._frameRate;
			}else {
			return /*__JS__ */this._frameRateNative;
		}
		},function(value){
		if (!Render.isConchApp){
			this._frameRate=value;
			}else {
			switch (value){
				case "fast":
					window.conch.config.setLimitFPS(60);
					break ;
				case "mouse":
					window.conch.config.setMouseFrame(2000);
					break ;
				case "slow":
					window.conch.config.setSlowFrame(true);
					break ;
				case "sleep":
					window.conch.config.setLimitFPS(1);
					break ;
				}
			/*__JS__ */this._frameRateNative=value;
		}
	});

	Stage.SCALE_NOSCALE="noscale";
	Stage.SCALE_EXACTFIT="exactfit";
	Stage.SCALE_SHOWALL="showall";
	Stage.SCALE_NOBORDER="noborder";
	Stage.SCALE_FULL="full";
	Stage.SCALE_FIXED_WIDTH="fixedwidth";
	Stage.SCALE_FIXED_HEIGHT="fixedheight";
	Stage.SCALE_FIXED_AUTO="fixedauto";
	Stage.ALIGN_LEFT="left";
	Stage.ALIGN_RIGHT="right";
	Stage.ALIGN_CENTER="center";
	Stage.ALIGN_TOP="top";
	Stage.ALIGN_MIDDLE="middle";
	Stage.ALIGN_BOTTOM="bottom";
	Stage.SCREEN_NONE="none";
	Stage.SCREEN_HORIZONTAL="horizontal";
	Stage.SCREEN_VERTICAL="vertical";
	Stage.FRAME_FAST="fast";
	Stage.FRAME_SLOW="slow";
	Stage.FRAME_MOUSE="mouse";
	Stage.FRAME_SLEEP="sleep";
	__static(Stage,
	['_dbgSprite',function(){return this._dbgSprite=new Sprite();}
	]);
	return Stage;
})(Sprite)


//class laya.utils.PerfHUD extends laya.display.Sprite
var PerfHUD=(function(_super){
	function PerfHUD(){
		this.datas=[];
		this.hud_width=800;
		this.hud_height=200;
		this.gMinV=0;
		this.gMaxV=100;
		this.textSpace=40;
		this._now=null;
		this.sttm=0;
		PerfHUD.__super.call(this);
		this.xdata=new Array(PerfHUD.DATANUM);
		this.ydata=new Array(PerfHUD.DATANUM);
		PerfHUD.inst=this;
		this._renderType |=/*laya.display.SpriteConst.CUSTOM*/0x800;
		this._setRenderType(this._renderType);
		this._setCustomRender();
		this.addDataDef(0,0xffffff,'frame',1.0);
		this.addDataDef(1,0x00ff00,'update',1.0);
		this.addDataDef(2,0xff0000,'flush',1.0);
		this._now=/*__JS__ */performance?performance.now.bind(performance):Date.now;
	}

	__class(PerfHUD,'laya.utils.PerfHUD',_super);
	var __proto=PerfHUD.prototype;
	//TODO:coverage
	__proto.now=function(){
		return this._now();
	}

	//TODO:coverage
	__proto.start=function(){
		this.sttm=this._now();
	}

	//TODO:coverage
	__proto.end=function(i){
		var dt=this._now()-this.sttm;
		this.updateValue(i,dt);
	}

	//TODO:coverage
	__proto.config=function(w,h){
		this.hud_width=w;
		this.hud_height=h;
	}

	//TODO:coverage
	__proto.addDataDef=function(id,color,name,scale){
		this.datas[id]=new PerfData(id,color,name,scale);
	}

	//TODO:coverage
	__proto.updateValue=function(id,v){
		this.datas[id].addData(v);
	}

	//TODO:coverage
	__proto.v2y=function(v){
		var bb=this._y+this.hud_height *(1-(v-this.gMinV)/ this.gMaxV);
		return this._y+this.hud_height*(1-(v-this.gMinV)/this.gMaxV);
	}

	//TODO:coverage
	__proto.drawHLine=function(ctx,v,color,text){
		var sx=this._x;
		var ex=this._x+this.hud_width;
		var sy=this.v2y(v);
		ctx.fillText(text,sx,sy-6,null,'green');
		sx+=this.textSpace;
		ctx.fillStyle=color;
		ctx.fillRect(sx,sy,this._x+this.hud_width,1);
	}

	//TODO:coverage
	__proto.customRender=function(ctx,x,y){
		var now=/*__JS__ */performance.now();;
		if (PerfHUD._lastTm <=0)PerfHUD._lastTm=now;
		this.updateValue(0,now-PerfHUD._lastTm);
		PerfHUD._lastTm=now;
		ctx.save();
		ctx.fillRect(this._x,this._y,this.hud_width,this.hud_height+4,'#000000cc');
		ctx.globalAlpha=0.9;
		this.drawHLine(ctx,0,'green','    0');
		this.drawHLine(ctx,10,'green','  10');
		this.drawHLine(ctx,16.667,'red',' ');
		this.drawHLine(ctx,20,'green','50|20');
		this.drawHLine(ctx,16.667 *2,'yellow','');
		this.drawHLine(ctx,16.667 *3,'yellow','');
		this.drawHLine(ctx,16.667 *4,'yellow','');
		this.drawHLine(ctx,50,'green','20|50');
		this.drawHLine(ctx,100,'green','10|100');
		for (var di=0,sz=this.datas.length;di < sz;di++){
			var cd=this.datas[di];
			if (!cd)continue ;
			var dtlen=cd.datas.length;
			var dx=(this.hud_width-this.textSpace)/dtlen;
			var cx=cd.datapos;
			var _cx=this._x+this.textSpace;
			ctx.fillStyle=cd.color;
			for (var dtsz=dtlen;cx < dtsz;cx++){
				var sty=this.v2y(cd.datas[cx] *cd.scale);
				ctx.fillRect(_cx,sty,dx,this.hud_height+this._y-sty);
				_cx+=dx;
			}
			for (cx=0;cx < cd.datapos;cx++){
				sty=this.v2y(cd.datas[cx] *cd.scale);
				ctx.fillRect(_cx,sty,dx,this.hud_height+this._y-sty);
				_cx+=dx;
			}
		}
		ctx.restore();
	}

	PerfHUD._lastTm=0;
	PerfHUD._now=0;
	PerfHUD.DATANUM=300;
	PerfHUD.inst=null;
	PerfHUD.drawTexTm=0;
	return PerfHUD;
})(Sprite)


/**
*场景类，负责场景创建，加载，销毁等功能
*场景被从节点移除后，并不会被自动垃圾机制回收，如果想回收，请调用destroy接口，可以通过unDestroyedScenes属性查看还未被销毁的场景列表
*/
//class laya.display.Scene extends laya.display.Sprite
var Scene=(function(_super){
	function Scene(){
		/**场景被关闭后，是否自动销毁（销毁节点和使用到的资源），默认为false*/
		this.autoDestroyAtClosed=false;
		/**场景地址*/
		this.url=null;
		/**场景时钟*/
		this._timer=null;
		/**@private */
		this._viewCreated=false;
		/**@private */
		this._idMap=null;
		/**@private */
		this._$componentType="Scene";
		Scene.__super.call(this);
		this._setBit(/*laya.Const.NOT_READY*/0x08,true);
		Scene.unDestroyedScenes.push(this);
		this._scene=this;
		this.createChildren();
	}

	__class(Scene,'laya.display.Scene',_super);
	var __proto=Scene.prototype;
	/**
	*@private 兼容老项目
	*/
	__proto.createChildren=function(){}
	/**
	*@private 兼容老项目
	*装载场景视图。用于加载模式。
	*@param path 场景地址。
	*/
	__proto.loadScene=function(path){
		var url=path.indexOf(".")>-1 ? path :path+".scene";
		var view=Laya.loader.getRes(url);
		if (view){
			this.createView(view);
			}else {
			Laya.loader.resetProgress();
			var loader=new SceneLoader();
			loader.on(/*laya.events.Event.COMPLETE*/"complete",this,this._onSceneLoaded,[url]);
			loader.load(url);
		}
	}

	//Laya.loader.load(url,Handler.create(this,createView),null,Loader.JSON);
	__proto._onSceneLoaded=function(url){
		this.createView(Loader.getRes(url));
	}

	/**
	*@private 兼容老项目
	*通过视图数据创建视图。
	*@param uiView 视图数据信息。
	*/
	__proto.createView=function(view){
		if (view && !this._viewCreated){
			this._viewCreated=true;
			SceneUtils.createByData(this,view);
		}
	}

	/**
	*根据IDE内的节点id，获得节点实例
	*/
	__proto.getNodeByID=function(id){
		if (this._idMap)return this._idMap[id];
		return null;
	}

	/**
	*打开场景。【注意】被关闭的场景，如果没有设置autoDestroyAtRemoved=true，则资源可能不能被回收，需要自己手动回收
	*@param closeOther 是否关闭其他场景，默认为true（可选）
	*@param param 打开页面的参数，会传递给onOpened方法（可选）
	*/
	__proto.open=function(closeOther,param){
		(closeOther===void 0)&& (closeOther=true);
		if (closeOther)Scene.closeAll();
		Scene.root.addChild(this.scene);
		this.onOpened(param);
	}

	/**场景打开完成后，调用此方法（如果有弹出动画，则在动画完成后执行）*/
	__proto.onOpened=function(param){}
	/**
	*关闭场景
	*【注意】被关闭的场景，如果没有设置autoDestroyAtRemoved=true，则资源可能不能被回收，需要自己手动回收
	*@param type 关闭的原因，会传递给onClosed函数
	*/
	__proto.close=function(type){
		if (this.autoDestroyAtClosed)this.destroy();
		else this.removeSelf();
		this.onClosed(type);
	}

	/**关闭完成后，调用此方法（如果有关闭动画，则在动画完成后执行）
	*@param type 如果是点击默认关闭按钮触发，则传入关闭按钮的名字(name)，否则为null。
	*/
	__proto.onClosed=function(type){}
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this._idMap=null;
		_super.prototype.destroy.call(this,destroyChild);
		var list=laya.display.Scene.unDestroyedScenes;
		for (var i=list.length-1;i >-1;i--){
			if (list[i]===this){
				list.splice(i,1);
				return;
			}
		}
	}

	/**@private */
	__proto._sizeChanged=function(){
		this.event(/*laya.events.Event.RESIZE*/"resize");
	}

	/**@inheritDoc */
	__getset(0,__proto,'scaleX',_super.prototype._$get_scaleX,function(value){
		if (Laya.superGet(Sprite,this,'scaleX')==value)return;
		Laya.superSet(Sprite,this,'scaleX',value);
		this.event(/*laya.events.Event.RESIZE*/"resize");
	});

	/**@inheritDoc */
	__getset(0,__proto,'scaleY',_super.prototype._$get_scaleY,function(value){
		if (Laya.superGet(Sprite,this,'scaleY')==value)return;
		Laya.superSet(Sprite,this,'scaleY',value);
		this.event(/*laya.events.Event.RESIZE*/"resize");
	});

	/**@inheritDoc */
	/**@inheritDoc */
	__getset(0,__proto,'width',function(){
		if (this._width)return this._width;
		var max=0;
		for (var i=this.numChildren-1;i >-1;i--){
			var comp=this.getChildAt(i);
			if (comp._visible){
				max=Math.max(comp._x+comp.width *comp.scaleX,max);
			}
		}
		return max;
		},function(value){
		if (Laya.superGet(Sprite,this,'width')==value)return;
		Laya.superSet(Sprite,this,'width',value);
		this.callLater(this._sizeChanged);
	});

	/**场景时钟*/
	__getset(0,__proto,'timer',function(){
		return this._timer || Laya.timer;
		},function(value){
		this._timer=value;
	});

	/**@inheritDoc */
	/**@inheritDoc */
	__getset(0,__proto,'height',function(){
		if (this._height)return this._height;
		var max=0;
		for (var i=this.numChildren-1;i >-1;i--){
			var comp=this.getChildAt(i);
			if (comp._visible){
				max=Math.max(comp._y+comp.height *comp.scaleY,max);
			}
		}
		return max;
		},function(value){
		if (Laya.superGet(Sprite,this,'height')==value)return;
		Laya.superSet(Sprite,this,'height',value);
		this.callLater(this._sizeChanged);
	});

	/**获取场景根容器*/
	__getset(1,Scene,'root',function(){
		if (!Scene._root){
			Scene._root=Laya.stage.addChild(new Sprite());
			Scene._root.name="root";
			Laya.stage.on("resize",null,resize);
			function resize (){
				Scene._root.size(Laya.stage.width,Laya.stage.height);
				Scene._root.event(/*laya.events.Event.RESIZE*/"resize");
			}
			resize();
		}
		return Scene._root;
	},laya.display.Sprite._$SET_root);

	Scene.load=function(url,complete,progress){
		Laya.loader.resetProgress();
		var loader=new SceneLoader();
		loader.on(/*laya.events.Event.PROGRESS*/"progress",null,onProgress);
		loader.once(/*laya.events.Event.COMPLETE*/"complete",null,create);
		loader.load(url);
		function onProgress (value){
			if (Scene._loadPage)Scene._loadPage.event("progress",value);
			progress && progress.runWith(value);
		}
		function create (){
			loader.off(/*laya.events.Event.PROGRESS*/"progress",null,onProgress);
			var obj=Loader.getRes(url);
			if (!obj)throw "Can not find scene:"+url;
			if (!obj.props)throw "Scene data is error:"+url;
			var runtime=obj.props.runtime ? obj.props.runtime :obj.type;
			var clas=ClassUtils.getClass(runtime);
			if (obj.props.renderType=="instance"){
				var scene=clas.instance || (clas.instance=new clas());
				}else {
				scene=new clas();
			}
			if (scene && (scene instanceof laya.display.Node )){
				scene.url=url;
				if (!scene._getBit(/*laya.Const.NOT_READY*/0x08)){
					complete && complete.runWith(scene);
					}else {
					scene.on("onViewCreated",null,function(){
						complete && complete.runWith(scene)
					})
					scene.createView(obj);
				}
				Scene.hideLoadingPage();
				}else {
				throw "Can not find scene:"+runtime;
			}
		}
	}

	Scene.open=function(url,closeOther,param,complete,progress){
		(closeOther===void 0)&& (closeOther=true);
		if ((param instanceof laya.utils.Handler )){
			var temp=complete;
			complete=param;
			param=temp;
		}
		Scene.showLoadingPage();
		Scene.load(url,Handler.create(null,this._onSceneLoaded,[closeOther,complete,param]),progress);
	}

	Scene._onSceneLoaded=function(closeOther,complete,param,scene){
		scene.open(closeOther,param);
		if (complete)complete.runWith(scene);
	}

	Scene.close=function(url,name){
		(name===void 0)&& (name="");
		var flag=false;
		var list=laya.display.Scene.unDestroyedScenes;
		for (var i=0,n=list.length;i < n;i++){
			var scene=list[i];
			if (scene && scene.parent && scene.url===url && scene.name==name){
				scene.close();
				flag=true;
			}
		}
		return flag;
	}

	Scene.closeAll=function(){
		var root=laya.display.Scene.root;
		for (var i=0,n=root.numChildren;i < n;i++){
			var scene=root.getChildAt(0);
			if ((scene instanceof laya.display.Scene ))scene.close();
			else scene.removeSelf();
		}
	}

	Scene.destroy=function(url,name){
		(name===void 0)&& (name="");
		var flag=false;
		var list=laya.display.Scene.unDestroyedScenes;
		for (var i=0,n=list.length;i < n;i++){
			var scene=list[i];
			if (scene.url===url && scene.name==name){
				scene.destroy();
				flag=true;
			}
		}
		return flag;
	}

	Scene.gc=function(){
		Resource.destroyUnusedResources();
	}

	Scene.setLoadingPage=function(loadPage){
		if (Scene._loadPage !=loadPage){
			Scene._loadPage=loadPage;
		}
	}

	Scene.showLoadingPage=function(param,delay){
		(delay===void 0)&& (delay=500);
		if (Scene._loadPage){
			Laya.systemTimer.clear(null,Scene._showLoading);
			Laya.systemTimer.clear(null,Scene._hideLoading);
			Laya.systemTimer.once(delay,null,Scene._showLoading,[param],false);
		}
	}

	Scene._showLoading=function(param){
		Laya.stage.addChild(Scene._loadPage);
		Scene._loadPage.onOpened(param);
	}

	Scene._hideLoading=function(){
		Scene._loadPage.close();
	}

	Scene.hideLoadingPage=function(delay){
		(delay===void 0)&& (delay=500);
		if (Scene._loadPage){
			Laya.systemTimer.clear(null,Scene._showLoading);
			Laya.systemTimer.clear(null,Scene._hideLoading);
			Laya.systemTimer.once(delay,null,Scene._hideLoading);
		}
	}

	Scene.unDestroyedScenes=[];
	Scene._root=null;
	Scene._loadPage=null;
	return Scene;
})(Sprite)


/**
*节点关键帧动画播放类。解析播放IDE内制作的节点动画。
*/
//class laya.display.FrameAnimation extends laya.display.AnimationBase
var FrameAnimation=(function(_super){
	function FrameAnimation(){
		/**@private id对象表*/
		this._targetDic=null;
		/**@private 动画数据*/
		this._animationData=null;
		/**@private */
		this._usedFrames=null;
		FrameAnimation.__super.call(this);
		if (FrameAnimation._sortIndexFun===null){
			FrameAnimation._sortIndexFun=MathUtil.sortByKey("index",false,true);
		}
	}

	__class(FrameAnimation,'laya.display.FrameAnimation',_super);
	var __proto=FrameAnimation.prototype;
	/**
	*@private
	*初始化动画数据
	*@param targetDic 节点ID索引
	*@param animationData 动画数据
	*/
	__proto._setUp=function(targetDic,animationData){
		this._targetDic=targetDic;
		this._animationData=animationData;
		this.interval=1000 / animationData.frameRate;
		if (animationData.parsed){
			this._count=animationData.count;
			this._labels=animationData.labels;
			this._usedFrames=animationData.animationNewFrames;
			}else {
			this._usedFrames=[];
			this._calculateDatas();
			animationData.parsed=true;
			animationData.labels=this._labels;
			animationData.count=this._count;
			animationData.animationNewFrames=this._usedFrames;
		}
	}

	/**@inheritDoc */
	__proto.clear=function(){
		_super.prototype.clear.call(this);
		this._targetDic=null;
		this._animationData=null;
		return this;
	}

	/**@inheritDoc */
	__proto._displayToIndex=function(value){
		if (!this._animationData)return;
		if (value < 0)value=0;
		if (value > this._count)value=this._count;
		var nodes=this._animationData.nodes,i=0,len=nodes.length;
		for (i=0;i < len;i++){
			this._displayNodeToFrame(nodes[i],value);
		}
	}

	/**
	*@private
	*将节点设置到某一帧的状态
	*@param node 节点ID
	*@param frame
	*@param targetDic 节点表
	*/
	__proto._displayNodeToFrame=function(node,frame,targetDic){
		if (!targetDic)targetDic=this._targetDic;
		var target=targetDic[node.target];
		if (!target){
			return;
		};
		var frames=node.frames,key,propFrames,value;
		var keys=node.keys,i=0,len=keys.length;
		for (i=0;i < len;i++){
			key=keys[i];
			propFrames=frames[key];
			if (propFrames.length > frame){
				value=propFrames[frame];
				}else {
				value=propFrames[propFrames.length-1];
			}
			target[key]=value;
		};
		var funkeys=node.funkeys;
		len=funkeys.length;
		var funFrames;
		if (len==0)return;
		for (i=0;i < len;i++){
			key=funkeys[i];
			funFrames=frames[key];
			if (funFrames[frame]!==undefined){
				target[key]&&target[key].apply(target,funFrames[frame]);
			}
		}
	}

	/**
	*@private
	*计算帧数据
	*/
	__proto._calculateDatas=function(){
		if (!this._animationData)return;
		var nodes=this._animationData.nodes,i=0,len=nodes.length,tNode;
		this._count=0;
		for (i=0;i < len;i++){
			tNode=nodes[i];
			this._calculateKeyFrames(tNode);
		}
		this._count+=1;
	}

	/**
	*@private
	*计算某个节点的帧数据
	*/
	__proto._calculateKeyFrames=function(node){
		var keyFrames=node.keyframes,key,tKeyFrames,target=node.target;
		if (!node.frames)node.frames={};
		if (!node.keys)node.keys=[];
		else node.keys.length=0;
		if (!node.funkeys)node.funkeys=[];
		else node.funkeys.length=0;
		if (!node.initValues)node.initValues={};
		for (key in keyFrames){
			var isFun=key.indexOf("()")!=-1;
			tKeyFrames=keyFrames[key];
			if (isFun)key=key.substr(0,key.length-2);
			if (!node.frames[key]){
				node.frames[key]=[];
			}
			if (!isFun){
				if (this._targetDic && this._targetDic[target]){
					node.initValues[key]=this._targetDic[target][key];
				}
				tKeyFrames.sort(FrameAnimation._sortIndexFun);
				node.keys.push(key);
				this._calculateNodePropFrames(tKeyFrames,node.frames[key],key,target);
			}
			else{
				node.funkeys.push(key);
				var map=node.frames[key];
				for (var i=0;i < tKeyFrames.length;i++){
					var temp=tKeyFrames[i];
					map[temp.index]=temp.value;
					if (temp.index > this._count)this._count=temp.index;
				}
			}
		}
	}

	/**
	*重置节点，使节点恢复到动画之前的状态，方便其他动画控制
	*/
	__proto.resetNodes=function(){
		if (!this._targetDic)return;
		if (!this._animationData)return;
		var nodes=this._animationData.nodes,i=0,len=nodes.length;
		var tNode;
		var initValues;
		for (i=0;i < len;i++){
			tNode=nodes[i];
			initValues=tNode.initValues;
			if (!initValues)continue ;
			var target=this._targetDic[tNode.target];
			if (!target)continue ;
			var key;
			for (key in initValues){
				target[key]=initValues[key];
			}
		}
	}

	/**
	*@private
	*计算节点某个属性的帧数据
	*/
	__proto._calculateNodePropFrames=function(keyframes,frames,key,target){
		var i=0,len=keyframes.length-1;
		frames.length=keyframes[len].index+1;
		for (i=0;i < len;i++){
			this._dealKeyFrame(keyframes[i]);
			this._calculateFrameValues(keyframes[i],keyframes[i+1],frames);
		}
		if (len==0){
			frames[0]=keyframes[0].value;
			if (this._usedFrames)this._usedFrames[keyframes[0].index]=true;
		}
		this._dealKeyFrame(keyframes[i]);
	}

	/**
	*@private
	*/
	__proto._dealKeyFrame=function(keyFrame){
		if (keyFrame.label && keyFrame.label !="")this.addLabel(keyFrame.label,keyFrame.index);
	}

	/**
	*@private
	*计算两个关键帧直接的帧数据
	*/
	__proto._calculateFrameValues=function(startFrame,endFrame,result){
		var i=0,easeFun;
		var start=startFrame.index,end=endFrame.index;
		var startValue=startFrame.value;
		var dValue=endFrame.value-startFrame.value;
		var dLen=end-start;
		var frames=this._usedFrames;
		if (end > this._count)this._count=end;
		if (startFrame.tween){
			easeFun=Ease[startFrame.tweenMethod];
			if (easeFun==null)easeFun=Ease.linearNone;
			for (i=start;i < end;i++){
				result[i]=easeFun(i-start,startValue,dValue,dLen);
				if (frames)frames[i]=true;
			}
			}else {
			for (i=start;i < end;i++){
				result[i]=startValue;
			}
		}
		if (frames){
			frames[startFrame.index]=true;
			frames[endFrame.index]=true;
		}
		result[endFrame.index]=endFrame.value;
	}

	FrameAnimation._sortIndexFun=null;
	return FrameAnimation;
})(AnimationBase)


/**
*<p><code>Input</code> 类用于创建显示对象以显示和输入文本。</p>
*<p>Input 类封装了原生的文本输入框，由于不同浏览器的差异，会导致此对象的默认文本的位置与用户点击输入时的文本的位置有少许的偏差。</p>
*/
//class laya.display.Input extends laya.display.Text
var Input=(function(_super){
	function Input(){
		/**@private */
		this._focus=false;
		/**@private */
		this._multiline=false;
		/**@private */
		this._editable=true;
		/**@private */
		this._restrictPattern=null;
		this._type="text";
		/**输入提示符。*/
		this._prompt='';
		/**输入提示符颜色。*/
		this._promptColor="#A9A9A9";
		this._originColor="#000000";
		this._content='';
		Input.__super.call(this);
		this._maxChars=1E5;
		this._width=100;
		this._height=20;
		this.multiline=false;
		this.overflow=/*laya.display.Text.SCROLL*/"scroll";
		this.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this._onMouseDown);
		this.on(/*laya.events.Event.UNDISPLAY*/"undisplay",this,this._onUnDisplay);
	}

	__class(Input,'laya.display.Input',_super);
	var __proto=Input.prototype;
	/**
	*设置光标位置和选取字符。
	*@param startIndex 光标起始位置。
	*@param endIndex 光标结束位置。
	*/
	__proto.setSelection=function(startIndex,endIndex){
		this.focus=true;
		laya.display.Input.inputElement.selectionStart=startIndex;
		laya.display.Input.inputElement.selectionEnd=endIndex;
	}

	__proto._onUnDisplay=function(e){
		this.focus=false;
	}

	__proto._onMouseDown=function(e){
		this.focus=true;
	}

	/**
	*在输入期间，如果 Input 实例的位置改变，调用_syncInputTransform同步输入框的位置。
	*/
	__proto._syncInputTransform=function(){
		var inputElement=this.nativeInput;
		var transform=Utils.getTransformRelativeToWindow(this,this.padding[3],this.padding[0]);
		var inputWid=this._width-this.padding[1]-this.padding[3];
		var inputHei=this._height-this.padding[0]-this.padding[2];
		if (Render.isConchApp){
			inputElement.setScale(transform.scaleX,transform.scaleY);
			inputElement.setSize(inputWid,inputHei);
			inputElement.setPos(transform.x,transform.y);
			}else {
			Input.inputContainer.style.transform=Input.inputContainer.style.webkitTransform="scale("+transform.scaleX+","+transform.scaleY+") rotate("+(Laya.stage.canvasDegree)+"deg)";
			inputElement.style.width=inputWid+'px';
			inputElement.style.height=inputHei+'px';
			Input.inputContainer.style.left=transform.x+'px';
			Input.inputContainer.style.top=transform.y+'px';
		}
	}

	/**选中当前实例的所有文本。*/
	__proto.select=function(){
		this.nativeInput.select();
	}

	__proto._setInputMethod=function(){
		Input.input.parentElement && (Input.inputContainer.removeChild(Input.input));
		Input.area.parentElement && (Input.inputContainer.removeChild(Input.area));
		Input.inputElement=(this._multiline ? Input.area :Input.input);
		Input.inputContainer.appendChild(Input.inputElement);
		if (Text.RightToLeft){
			Input.inputElement.style.direction="rtl";
		}
	}

	__proto._focusIn=function(){
		laya.display.Input.isInputting=true;
		var input=this.nativeInput;
		this._focus=true;
		var cssStyle=input.style;
		cssStyle.whiteSpace=(this.wordWrap ? "pre-wrap" :"nowrap");
		this._setPromptColor();
		input.readOnly=!this._editable;
		if (Render.isConchApp){
			input.setType(this._type);
			input.setForbidEdit(!this._editable);
		}
		input.maxLength=this._maxChars;
		var padding=this.padding;
		input.type=this._type;
		input.value=this._content;
		input.placeholder=this._prompt;
		Laya.stage.off(/*laya.events.Event.KEY_DOWN*/"keydown",this,this._onKeyDown);
		Laya.stage.on(/*laya.events.Event.KEY_DOWN*/"keydown",this,this._onKeyDown);
		Laya.stage.focus=this;
		this.event(/*laya.events.Event.FOCUS*/"focus");
		if (Browser.onPC)input.focus();
		if(!Browser.onMiniGame && !Browser.onBDMiniGame){
			var temp=this._text;
			this._text=null;
		}
		this.typeset();
		input.setColor(this._originColor);
		input.setFontSize(this.fontSize);
		input.setFontFace(Browser.onIPhone ? (Text.fontFamilyMap[this.font] || this.font):this.font);
		if (Render.isConchApp){
			input.setMultiAble && input.setMultiAble(this._multiline);
		}
		cssStyle.lineHeight=(this.leading+this.fontSize)+"px";
		cssStyle.fontStyle=(this.italic ? "italic" :"normal");
		cssStyle.fontWeight=(this.bold ? "bold" :"normal");
		cssStyle.textAlign=this.align;
		cssStyle.padding="0 0";
		this._syncInputTransform();
		if (!Render.isConchApp && Browser.onPC)
			Laya.systemTimer.frameLoop(1,this,this._syncInputTransform);
	}

	// 设置DOM输入框提示符颜色。
	__proto._setPromptColor=function(){
		Input.promptStyleDOM=Browser.getElementById("promptStyle");
		if (!Input.promptStyleDOM){
			Input.promptStyleDOM=Browser.createElement("style");
			Input.promptStyleDOM.setAttribute("id","promptStyle");
			Browser.document.head.appendChild(Input.promptStyleDOM);
		}
		Input.promptStyleDOM.innerText="input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {"+"color:"+this._promptColor+"}"+"input:-moz-placeholder, textarea:-moz-placeholder {"+"color:"+this._promptColor+"}"+"input::-moz-placeholder, textarea::-moz-placeholder {"+"color:"+this._promptColor+"}"+"input:-ms-input-placeholder, textarea:-ms-input-placeholder {"+"color:"+this._promptColor+"}";
	}

	/**@private */
	__proto._focusOut=function(){
		laya.display.Input.isInputting=false;
		this._focus=false;
		this._text=null;
		this._content=this.nativeInput.value;
		if (!this._content){
			Laya.superSet(Text,this,'text',this._prompt);
			Laya.superSet(Text,this,'color',this._promptColor);
			}else {
			Laya.superSet(Text,this,'text',this._content);
			Laya.superSet(Text,this,'color',this._originColor);
		}
		Laya.stage.off(/*laya.events.Event.KEY_DOWN*/"keydown",this,this._onKeyDown);
		Laya.stage.focus=null;
		this.event(/*laya.events.Event.BLUR*/"blur");
		this.event(/*laya.events.Event.CHANGE*/"change");
		if (Render.isConchApp)this.nativeInput.blur();
		Browser.onPC && Laya.systemTimer.clear(this,this._syncInputTransform);
	}

	/**@private */
	__proto._onKeyDown=function(e){
		if (e.keyCode===13){
			if (Browser.onMobile && !this._multiline)
				this.focus=false;
			this.event(/*laya.events.Event.ENTER*/"enter");
		}
	}

	__proto.changeText=function(text){
		this._content=text;
		if (this._focus){
			this.nativeInput.value=text || '';
			this.event(/*laya.events.Event.CHANGE*/"change");
		}else
		_super.prototype.changeText.call(this,text);
	}

	/**@inheritDoc */
	__getset(0,__proto,'color',_super.prototype._$get_color,function(value){
		if (this._focus)
			this.nativeInput.setColor(value);
		Laya.superSet(Text,this,'color',this._content?value:this._promptColor);
		this._originColor=value;
	});

	/**表示是否是多行输入框。*/
	__getset(0,__proto,'multiline',function(){
		return this._multiline;
		},function(value){
		this._multiline=value;
		this.valign=value ? "top" :"middle";
	});

	/**
	*<p>字符数量限制，默认为10000。</p>
	*<p>设置字符数量限制时，小于等于0的值将会限制字符数量为10000。</p>
	*/
	__getset(0,__proto,'maxChars',function(){
		return this._maxChars;
		},function(value){
		if (value <=0)
			value=1E5;
		this._maxChars=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'text',function(){
		if (this._focus)
			return this.nativeInput.value;
		else
		return this._content || "";
		},function(value){
		Laya.superSet(Text,this,'color',this._originColor);
		value+='';
		if (this._focus){
			this.nativeInput.value=value || '';
			this.event(/*laya.events.Event.CHANGE*/"change");
			}else {
			if (!this._multiline)
				value=value.replace(/\r?\n/g,'');
			this._content=value;
			if (value)
				Laya.superSet(Text,this,'text',value);
			else {
				Laya.superSet(Text,this,'text',this._prompt);
				Laya.superSet(Text,this,'color',this.promptColor);
			}
		}
	});

	/**
	*获取对输入框的引用实例。
	*/
	__getset(0,__proto,'nativeInput',function(){
		return this._multiline ? Input.area :Input.input;
	});

	// 因此 调用focus接口是无法都在移动平台立刻弹出键盘的
	/**
	*表示焦点是否在此实例上。
	*/
	__getset(0,__proto,'focus',function(){
		return this._focus;
		},function(value){
		var input=this.nativeInput;
		if (this._focus!==value){
			if (value){
				if (input.target){
					input.target._focusOut();
					}else {
					this._setInputMethod();
				}
				input.target=this;
				this._focusIn();
				}else {
				input.target=null;
				this._focusOut();
				Browser.document.body.scrollTop=0;
				input.blur();
				if (Render.isConchApp)input.setPos(-10000,-10000);
				else if (Input.inputContainer.contains(input))Input.inputContainer.removeChild(input);
			}
		}
	});

	/**
	*是否可编辑。
	*/
	__getset(0,__proto,'editable',function(){
		return this._editable;
		},function(value){
		this._editable=value;
		if (Render.isConchApp){
			Input.input.setForbidEdit(!value);
		}
	});

	/**@inheritDoc */
	__getset(0,__proto,'bgColor',_super.prototype._$get_bgColor,function(value){
		Laya.superSet(Text,this,'bgColor',value);
		if(Render.isConchApp)
			this.nativeInput.setBgColor(value);
	});

	/**限制输入的字符。*/
	__getset(0,__proto,'restrict',function(){
		if (this._restrictPattern){
			return this._restrictPattern.source;
		}
		return "";
		},function(pattern){
		if (pattern){
			pattern="[^"+pattern+"]";
			if (pattern.indexOf("^^")>-1)
				pattern=pattern.replace("^^","");
			this._restrictPattern=new RegExp(pattern,"g");
		}else
		this._restrictPattern=null;
	});

	/**
	*设置输入提示符。
	*/
	__getset(0,__proto,'prompt',function(){
		return this._prompt;
		},function(value){
		if (!this._text && value)
			Laya.superSet(Text,this,'color',this._promptColor);
		this.promptColor=this._promptColor;
		if (this._text)
			Laya.superSet(Text,this,'text',(this._text==this._prompt)?value:this._text);
		else
		Laya.superSet(Text,this,'text',value);
		this._prompt=Text.langPacks && Text.langPacks[value] ? Text.langPacks[value] :value;
	});

	/**
	*设置输入提示符颜色。
	*/
	__getset(0,__proto,'promptColor',function(){
		return this._promptColor;
		},function(value){
		this._promptColor=value;
		if (!this._content)Laya.superSet(Text,this,'color',value);
	});

	/**
	*<p>输入框类型为Input静态常量之一。</p>
	*<ul>
	*<li>TYPE_TEXT</li>
	*<li>TYPE_PASSWORD</li>
	*<li>TYPE_EMAIL</li>
	*<li>TYPE_URL</li>
	*<li>TYPE_NUMBER</li>
	*<li>TYPE_RANGE</li>
	*<li>TYPE_DATE</li>
	*<li>TYPE_MONTH</li>
	*<li>TYPE_WEEK</li>
	*<li>TYPE_TIME</li>
	*<li>TYPE_DATE_TIME</li>
	*<li>TYPE_DATE_TIME_LOCAL</li>
	*</ul>
	*<p>平台兼容性参见http://www.w3school.com.cn/html5/html_5_form_input_types.asp。</p>
	*/
	__getset(0,__proto,'type',function(){
		return this._type;
		},function(value){
		if (value==="password")this._getTextStyle().asPassword=true;
		else this._getTextStyle().asPassword=false;
		this._type=value;
	});

	Input.__init__=function(){
		Input._createInputElement();
		if (Browser.onMobile){
			var isTrue=false;
			if(Browser.onMiniGame || Browser.onBDMiniGame){
				isTrue=true;
			}
			Render.canvas.addEventListener(Input.IOS_IFRAME ?(isTrue ? "touchend" :"click"):"touchend",Input._popupInputMethod);
		}
	}

	Input._popupInputMethod=function(e){
		if (!laya.display.Input.isInputting)return;
		var input=laya.display.Input.inputElement;
		input.focus();
	}

	Input._createInputElement=function(){
		Input._initInput(Input.area=Browser.createElement("textarea"));
		Input._initInput(Input.input=Browser.createElement("input"));
		Input.inputContainer=Browser.createElement("div");
		Input.inputContainer.style.position="absolute";
		Input.inputContainer.style.zIndex=1E5;
		Browser.container.appendChild(Input.inputContainer);
		Input.inputContainer.setPos=function (x,y){
			Input.inputContainer.style.left=x+'px';
			Input.inputContainer.style.top=y+'px';
		};
	}

	Input._initInput=function(input){
		var style=input.style;
		style.cssText="position:absolute;overflow:hidden;resize:none;transform-origin:0 0;-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-o-transform-origin:0 0;";
		style.resize='none';
		style.backgroundColor='transparent';
		style.border='none';
		style.outline='none';
		style.zIndex=1;
		input.addEventListener('input',Input._processInputting);
		input.addEventListener('mousemove',Input._stopEvent);
		input.addEventListener('mousedown',Input._stopEvent);
		input.addEventListener('touchmove',Input._stopEvent);
		input.setFontFace=function (fontFace){input.style.fontFamily=fontFace;};
		if(!Render.isConchApp){
			input.setColor=function (color){input.style.color=color;};
			input.setFontSize=function (fontSize){input.style.fontSize=fontSize+'px';};
		}
	}

	Input._processInputting=function(e){
		var input=laya.display.Input.inputElement.target;
		if (!input)return;
		var value=laya.display.Input.inputElement.value;
		if (input._restrictPattern){
			value=value.replace(/\u2006|\x27/g,"");
			if (input._restrictPattern.test(value)){
				value=value.replace(input._restrictPattern,"");
				laya.display.Input.inputElement.value=value;
			}
		}
		input._text=value;
		input.event(/*laya.events.Event.INPUT*/"input");
	}

	Input._stopEvent=function(e){
		if (e.type=='touchmove')
			e.preventDefault();
		e.stopPropagation && e.stopPropagation();
	}

	Input.TYPE_TEXT="text";
	Input.TYPE_PASSWORD="password";
	Input.TYPE_EMAIL="email";
	Input.TYPE_URL="url";
	Input.TYPE_NUMBER="number";
	Input.TYPE_RANGE="range";
	Input.TYPE_DATE="date";
	Input.TYPE_MONTH="month";
	Input.TYPE_WEEK="week";
	Input.TYPE_TIME="time";
	Input.TYPE_DATE_TIME="datetime";
	Input.TYPE_DATE_TIME_LOCAL="datetime-local";
	Input.TYPE_SEARCH="search";
	Input.input=null;
	Input.area=null;
	Input.inputElement=null;
	Input.inputContainer=null;
	Input.confirmButton=null;
	Input.promptStyleDOM=null;
	Input.inputHeight=45;
	Input.isInputting=false;
	Input.stageMatrix=null;
	__static(Input,
	['IOS_IFRAME',function(){return this.IOS_IFRAME=(Browser.onIOS && Browser.window.top !=Browser.window.self);}
	]);
	return Input;
})(Text)


/**
*<p> <code>Animation</code> 是Graphics动画类。实现了基于Graphics的动画创建、播放、控制接口。</p>
*<p>本类使用了动画模版缓存池，它以一定的内存开销来节省CPU开销，当相同的动画模版被多次使用时，相比于每次都创建新的动画模版，使用动画模版缓存池，只需创建一次，缓存之后多次复用，从而节省了动画模版创建的开销。</p>
*<p>动画模版缓存池，以key-value键值对存储，key可以自定义，也可以从指定的配置文件中读取，value为对应的动画模版，是一个Graphics对象数组，每个Graphics对象对应一个帧图像，动画的播放实质就是定时切换Graphics对象。</p>
*<p>使用set source、loadImages(...)、loadAtlas(...)、loadAnimation(...)方法可以创建动画模版。使用play(...)可以播放指定动画。</p>
*@example <caption>以下示例代码，创建了一个 <code>Text</code> 实例。</caption>
*package
*{
	*import laya.display.Animation;
	*import laya.net.Loader;
	*import laya.utils.Handler;
	*public class Animation_Example
	*{
		*public function Animation_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*init();//初始化
			*}
		*private function init():void
		*{
			*var animation:Animation=new Animation();//创建一个 Animation 类的实例对象 animation 。
			*animation.loadAtlas("resource/ani/fighter.json");//加载图集并播放
			*animation.x=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
			*animation.y=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
			*animation.interval=50;//设置 animation 对象的动画播放间隔时间，单位：毫秒。
			*animation.play();//播放动画。
			*Laya.stage.addChild(animation);//将 animation 对象添加到显示列表。
			*}
		*}
	*}
*
*@example
*Animation_Example();
*function Animation_Example(){
	*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
	*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
	*init();//初始化
	*}
*function init()
*{
	*var animation=new Laya.Animation();//创建一个 Animation 类的实例对象 animation 。
	*animation.loadAtlas("resource/ani/fighter.json");//加载图集并播放
	*animation.x=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
	*animation.y=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
	*animation.interval=50;//设置 animation 对象的动画播放间隔时间，单位：毫秒。
	*animation.play();//播放动画。
	*Laya.stage.addChild(animation);//将 animation 对象添加到显示列表。
	*}
*
*@example
*import Animation=laya.display.Animation;
*class Animation_Example {
	*constructor(){
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*this.init();
		*}
	*private init():void {
		*var animation:Animation=new Laya.Animation();//创建一个 Animation 类的实例对象 animation 。
		*animation.loadAtlas("resource/ani/fighter.json");//加载图集并播放
		*animation.x=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
		*animation.y=200;//设置 animation 对象的属性 x 的值，用于控制 animation 对象的显示位置。
		*animation.interval=50;//设置 animation 对象的动画播放间隔时间，单位：毫秒。
		*animation.play();//播放动画。
		*Laya.stage.addChild(animation);//将 animation 对象添加到显示列表。
		*}
	*}
*new Animation_Example();
*/
//class laya.display.Animation extends laya.display.AnimationBase
var Animation=(function(_super){
	function Animation(){
		/**@private */
		this._frames=null;
		/**@private */
		this._url=null;
		Animation.__super.call(this);
		this._setControlNode(this);
	}

	__class(Animation,'laya.display.Animation',_super);
	var __proto=Animation.prototype;
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this.stop();
		laya.display.Sprite.prototype.destroy.call(this,destroyChild);
		this._frames=null;
		this._labels=null;
	}

	/**
	*<p>开始播放动画。会在动画模版缓存池中查找key值为name的动画模版，存在则用此动画模版初始化当前序列帧， 如果不存在，则使用当前序列帧。</p>
	*<p>play(...)方法被设计为在创建实例后的任何时候都可以被调用，调用后就处于播放状态，当相应的资源加载完毕、调用动画帧填充方法(set frames)或者将实例显示在舞台上时，会判断是否处于播放状态，如果是，则开始播放。</p>
	*<p>配合wrapMode属性，可设置动画播放顺序类型。</p>
	*@param start （可选）指定动画播放开始的索引(int)或帧标签(String)。帧标签可以通过addLabel(...)和removeLabel(...)进行添加和删除。
	*@param loop （可选）是否循环播放。
	*@param name （可选）动画模板在动画模版缓存池中的key，也可认为是动画名称。如果name为空，则播放当前动画序列帧；如果不为空，则在动画模版缓存池中寻找key值为name的动画模版，如果存在则用此动画模版初始化当前序列帧并播放，如果不存在，则仍然播放当前动画序列帧；如果没有当前动画的帧数据，则不播放，但该实例仍然处于播放状态。
	*/
	__proto.play=function(start,loop,name){
		(start===void 0)&& (start=0);
		(loop===void 0)&& (loop=true);
		(name===void 0)&& (name="");
		if (name)this._setFramesFromCache(name,true);
		_super.prototype.play.call(this,start,loop,name);
	}

	/**@private */
	__proto._setFramesFromCache=function(name,showWarn){
		(showWarn===void 0)&& (showWarn=false);
		if (this._url)name=this._url+"#"+name;
		if (name && Animation.framesMap[name]){
			var tAniO=Animation.framesMap[name];
			if ((tAniO instanceof Array)){
				this._frames=Animation.framesMap[name];
				this._count=this._frames.length;
				}else {
				if (tAniO.nodeRoot){
					Animation.framesMap[name]=GraphicAnimation.parseAnimationByData(tAniO);
					tAniO=Animation.framesMap[name];
				}
				this._frames=tAniO.frames;
				this._count=this._frames.length;
				if (!this._frameRateChanged)this._interval=tAniO.interval;
				this._labels=this._copyLabels(tAniO.labels);
			}
			return true;
			}else {
			if (showWarn)console.log("ani not found:",name);
		}
		return false;
	}

	/**@private */
	__proto._copyLabels=function(labels){
		if (!labels)return null;
		var rst;
		rst={};
		var key;
		for (key in labels){
			rst[key]=Utils.copyArray([],labels[key]);
		}
		return rst;
	}

	/**@private */
	__proto._frameLoop=function(){
		if (this._visible && this._style.alpha > 0.01 && this._frames){
			_super.prototype._frameLoop.call(this);
		}
	}

	/**@private */
	__proto._displayToIndex=function(value){
		if (this._frames)this.graphics=this._frames[value];
	}

	/**
	*停止动画播放，并清理对象属性。之后可存入对象池，方便对象复用。
	*/
	__proto.clear=function(){
		_super.prototype.clear.call(this);
		this.stop();
		this.graphics=null;
		this._frames=null;
		this._labels=null;
		return this;
	}

	/**
	*<p>根据指定的动画模版初始化当前动画序列帧。选择动画模版的过程如下：1. 动画模版缓存池中key为cacheName的动画模版；2. 如果不存在，则加载指定的图片集合并创建动画模版。注意：只有指定不为空的cacheName，才能将创建好的动画模版以此为key缓存到动画模版缓存池，否则不进行缓存。</p>
	*<p>动画模版缓存池是以一定的内存开销来节省CPU开销，当相同的动画模版被多次使用时，相比于每次都创建新的动画模版，使用动画模版缓存池，只需创建一次，缓存之后多次复用，从而节省了动画模版创建的开销。</p>
	*<p>因为返回值为Animation对象本身，所以可以使用如下语法：loadImages(...).loadImages(...).play(...);。</p>
	*@param urls 图片路径集合。需要创建动画模版时，会以此为数据源。参数形如：[url1,url2,url3,...]。
	*@param cacheName （可选）动画模板在动画模版缓存池中的key。如果此参数不为空，表示使用动画模版缓存池。如果动画模版缓存池中存在key为cacheName的动画模版，则使用此模版。否则，创建新的动画模版，如果cacheName不为空，则以cacheName为key缓存到动画模版缓存池中，如果cacheName为空，不进行缓存。
	*@return 返回Animation对象本身。
	*/
	__proto.loadImages=function(urls,cacheName){
		(cacheName===void 0)&& (cacheName="");
		this._url="";
		if (!this._setFramesFromCache(cacheName)){
			this.frames=Animation.framesMap[cacheName] ? Animation.framesMap[cacheName] :Animation.createFrames(urls,cacheName);
		}
		return this;
	}

	/**
	*<p>根据指定的动画模版初始化当前动画序列帧。选择动画模版的过程如下：1. 动画模版缓存池中key为cacheName的动画模版；2. 如果不存在，则加载指定的图集并创建动画模版。</p>
	*<p>注意：只有指定不为空的cacheName，才能将创建好的动画模版以此为key缓存到动画模版缓存池，否则不进行缓存。</p>
	*<p>动画模版缓存池是以一定的内存开销来节省CPU开销，当相同的动画模版被多次使用时，相比于每次都创建新的动画模版，使用动画模版缓存池，只需创建一次，缓存之后多次复用，从而节省了动画模版创建的开销。</p>
	*<p>因为返回值为Animation对象本身，所以可以使用如下语法：loadAtlas(...).loadAtlas(...).play(...);。</p>
	*@param url 图集路径。需要创建动画模版时，会以此为数据源。
	*@param loaded （可选）使用指定图集初始化动画完毕的回调。
	*@param cacheName （可选）动画模板在动画模版缓存池中的key。如果此参数不为空，表示使用动画模版缓存池。如果动画模版缓存池中存在key为cacheName的动画模版，则使用此模版。否则，创建新的动画模版，如果cacheName不为空，则以cacheName为key缓存到动画模版缓存池中，如果cacheName为空，不进行缓存。
	*@return 返回动画本身。
	*/
	__proto.loadAtlas=function(url,loaded,cacheName){
		(cacheName===void 0)&& (cacheName="");
		this._url="";
		var _this=this;
		if (!_this._setFramesFromCache(cacheName)){
			function onLoaded (loadUrl){
				if (url===loadUrl){
					_this.frames=Animation.framesMap[cacheName] ? Animation.framesMap[cacheName] :Animation.createFrames(url,cacheName);
					if (loaded)loaded.run();
				}
			}
			if (Loader.getAtlas(url))onLoaded(url);
			else Laya.loader.load(url,Handler.create(null,onLoaded,[url]),null,/*laya.net.Loader.ATLAS*/"atlas");
		}
		return this;
	}

	/**
	*<p>加载并解析由LayaAir IDE制作的动画文件，此文件中可能包含多个动画。默认帧率为在IDE中设计的帧率，如果调用过set interval，则使用此帧间隔对应的帧率。加载后创建动画模版，并缓存到动画模版缓存池，key "url#动画名称" 对应相应动画名称的动画模板，key "url#" 对应动画模版集合的默认动画模版。</p>
	*<p>注意：如果调用本方法前，还没有预加载动画使用的图集，请将atlas参数指定为对应的图集路径，否则会导致动画创建失败。</p>
	*<p>动画模版缓存池是以一定的内存开销来节省CPU开销，当相同的动画模版被多次使用时，相比于每次都创建新的动画模版，使用动画模版缓存池，只需创建一次，缓存之后多次复用，从而节省了动画模版创建的开销。</p>
	*<p>因为返回值为Animation对象本身，所以可以使用如下语法：loadAnimation(...).loadAnimation(...).play(...);。</p>
	*@param url 动画文件路径。可由LayaAir IDE创建并发布。
	*@param loaded （可选）使用指定动画资源初始化动画完毕的回调。
	*@param atlas （可选）动画用到的图集地址（可选）。
	*@return 返回动画本身。
	*/
	__proto.loadAnimation=function(url,loaded,atlas){
		this._url=url;
		var _this=this;
		if (!this._actionName)this._actionName="";
		if (!_this._setFramesFromCache(this._actionName)){
			if (!atlas || Loader.getAtlas(atlas)){
				this._loadAnimationData(url,loaded,atlas);
				}else {
				Laya.loader.load(atlas,Handler.create(this,this._loadAnimationData,[url,loaded,atlas]),null,/*laya.net.Loader.ATLAS*/"atlas")
			}
			}else {
			_this._setFramesFromCache(this._actionName,true);
			this.index=0;
			if (loaded)loaded.run();
		}
		return this;
	}

	/**@private */
	__proto._loadAnimationData=function(url,loaded,atlas){
		var _$this=this;
		if (atlas && !Loader.getAtlas(atlas)){
			console.warn("atlas load fail:"+atlas);
			return;
		};
		var _this=this;
		function onLoaded (loadUrl){
			if (!Loader.getRes(loadUrl))return;
			if (url===loadUrl){
				var tAniO;
				if (!Animation.framesMap[url+"#"]){
					var aniData=GraphicAnimation.parseAnimationData(Loader.getRes(url));
					if (!aniData)return;
					var aniList=aniData.animationList;
					var i=0,len=aniList.length;
					var defaultO;
					for (i=0;i < len;i++){
						tAniO=aniList[i];
						Animation.framesMap[url+"#"+tAniO.name]=tAniO;
						if (!defaultO)defaultO=tAniO;
					}
					if (defaultO){
						Animation.framesMap[url+"#"]=defaultO;
						_this._setFramesFromCache(_$this._actionName,true);
						_$this.index=0;
					}
					_$this._resumePlay();
					}else {
					_this._setFramesFromCache(_$this._actionName,true);
					_$this.index=0;
					_$this._resumePlay();
				}
				if (loaded)loaded.run();
			}
			Loader.clearRes(url);
		}
		if (Loader.getRes(url))onLoaded(url);
		else Laya.loader.load(url,Handler.create(null,onLoaded,[url]),null,/*laya.net.Loader.JSON*/"json");
	}

	/**
	*当前动画的帧图像数组。本类中，每个帧图像是一个Graphics对象，而动画播放就是定时切换Graphics对象的过程。
	*/
	__getset(0,__proto,'frames',function(){
		return this._frames;
		},function(value){
		this._frames=value;
		if (value){
			this._count=value.length;
			if (this._actionName)this._setFramesFromCache(this._actionName,true);
			this.index=this._index;
		}
	});

	/**
	*是否自动播放，默认为false。如果设置为true，则动画被创建并添加到舞台后自动播放。
	*/
	__getset(0,__proto,'autoPlay',null,function(value){
		if (value)this.play();
		else this.stop();
	});

	/**
	*<p>动画数据源。</p>
	*<p>类型如下：<br/>
	*1. LayaAir IDE动画文件路径：使用此类型需要预加载所需的图集资源，否则会创建失败，如果不想预加载或者需要创建完毕的回调，请使用loadAnimation(...)方法；<br/>
	*2. 图集路径：使用此类型创建的动画模版不会被缓存到动画模版缓存池中，如果需要缓存或者创建完毕的回调，请使用loadAtlas(...)方法；<br/>
	*3. 图片路径集合：使用此类型创建的动画模版不会被缓存到动画模版缓存池中，如果需要缓存，请使用loadImages(...)方法。</p>
	*@param value 数据源。比如：图集："xx/a1.atlas"；图片集合："a1.png,a2.png,a3.png"；LayaAir IDE动画"xx/a1.ani"。
	*/
	__getset(0,__proto,'source',null,function(value){
		if (value.indexOf(".ani")>-1)this.loadAnimation(value);
		else if (value.indexOf(".json")>-1 || value.indexOf("als")>-1 || value.indexOf("atlas")>-1)this.loadAtlas(value);
		else this.loadImages(value.split(","));
	});

	/**
	*设置自动播放的动画名称，在LayaAir IDE中可以创建的多个动画组成的动画集合，选择其中一个动画名称进行播放。
	*/
	__getset(0,__proto,'autoAnimation',null,function(value){
		this.play(0,true,value);
	});

	Animation.createFrames=function(url,name){
		var arr;
		if ((typeof url=='string')){
			var atlas=Loader.getAtlas(url);
			if (atlas && atlas.length){
				arr=[];
				for (var i=0,n=atlas.length;i < n;i++){
					var g=new Graphics();
					g.drawImage(Loader.getRes(atlas[i]),0,0);
					arr.push(g);
				}
			}
			}else if ((url instanceof Array)){
			arr=[];
			for (i=0,n=url.length;i < n;i++){
				g=new Graphics();
				g.loadImage(url[i],0,0);
				arr.push(g);
			}
		}
		if (name)Animation.framesMap[name]=arr;
		return arr;
	}

	Animation.clearCache=function(key){
		var cache=Animation.framesMap;
		var val;
		var key2=key+"#";
		for (val in cache){
			if (val===key || val.indexOf(key2)===0){
				delete Animation.framesMap[val];
			}
		}
	}

	Animation.framesMap={};
	return Animation;
})(AnimationBase)


/**
*<p> 动效模板。用于为指定目标对象添加动画效果。每个动效有唯一的目标对象，而同一个对象可以添加多个动效。 当一个动效开始播放时，其他动效会自动停止播放。</p>
*<p> 可以通过LayaAir IDE创建。 </p>
*/
//class laya.display.EffectAnimation extends laya.display.FrameAnimation
var EffectAnimation=(function(_super){
	function EffectAnimation(){
		/**@private */
		this._target=null;
		/**@private */
		this._playEvent=null;
		/**@private */
		this._initData={};
		/**@private */
		this._aniKeys=null;
		/**@private */
		this._effectClass=null;
		EffectAnimation.__super.call(this);
	}

	__class(EffectAnimation,'laya.display.EffectAnimation',_super);
	var __proto=EffectAnimation.prototype;
	/**@private */
	__proto._onOtherBegin=function(effect){
		if (effect===this)return;
		this.stop();
	}

	/**@private */
	__proto._addEvent=function(){
		if (!this._target || !this._playEvent)return;
		this._setControlNode(this._target);
		this._target.on(this._playEvent,this,this._onPlayAction);
	}

	/**@private */
	__proto._onPlayAction=function(){
		this.play(0,false);
	}

	__proto.play=function(start,loop,name){
		(start===void 0)&& (start=0);
		(loop===void 0)&& (loop=true);
		(name===void 0)&& (name="");
		if (!this._target)
			return;
		this._target.event("effectbegin",[this]);
		this._recordInitData();
		laya.display.AnimationBase.prototype.play.call(this,start,loop,name);
	}

	/**@private */
	__proto._recordInitData=function(){
		if (!this._aniKeys)return;
		var i=0,len=0;
		len=this._aniKeys.length;
		var key;
		for (i=0;i < len;i++){
			key=this._aniKeys[i];
			this._initData[key]=this._target[key];
		}
	}

	/**@private */
	__proto._displayToIndex=function(value){
		if (!this._animationData)return;
		if (value < 0)value=0;
		if (value > this._count)value=this._count;
		var nodes=this._animationData.nodes,i=0,len=nodes.length;
		len=len > 1 ? 1 :len;
		for (i=0;i < len;i++){
			this._displayNodeToFrame(nodes[i],value);
		}
	}

	/**@private */
	__proto._displayNodeToFrame=function(node,frame,targetDic){
		if (!this._target)return;
		var target=this._target;
		var frames=node.frames,key,propFrames,value;
		var keys=node.keys,i=0,len=keys.length;
		var secondFrames=node.secondFrames;
		var tSecondFrame=0;
		var easeFun;
		var tKeyFrames;
		var startFrame;
		var endFrame;
		for (i=0;i < len;i++){
			key=keys[i];
			propFrames=frames[key];
			tSecondFrame=secondFrames[key];
			if (tSecondFrame==-1){
				value=this._initData[key];
				}else {
				if (frame < tSecondFrame){
					tKeyFrames=node.keyframes[key];
					startFrame=tKeyFrames[0];
					if (startFrame.tween){
						easeFun=Ease[startFrame.tweenMethod];
						if (easeFun==null)easeFun=Ease.linearNone;
						endFrame=tKeyFrames[1];
						value=easeFun(frame,this._initData[key],endFrame.value-this._initData[key],endFrame.index);
						}else {
						value=this._initData[key];
					}
					}else {
					if (propFrames.length > frame)value=propFrames[frame];
					else value=propFrames[propFrames.length-1];
				}
			}
			target[key]=value;
		}
	}

	/**@private */
	__proto._calculateKeyFrames=function(node){
		_super.prototype._calculateKeyFrames.call(this,node);
		var keyFrames=node.keyframes,key,tKeyFrames,target=node.target;
		var secondFrames={};
		node.secondFrames=secondFrames;
		for (key in keyFrames){
			tKeyFrames=keyFrames[key];
			if (tKeyFrames.length <=1)secondFrames[key]=-1;
			else secondFrames[key]=tKeyFrames[1].index;
		}
	}

	/**
	*本实例的目标对象。通过本实例控制目标对象的属性变化。
	*@param v 指定的目标对象。
	*/
	__getset(0,__proto,'target',function(){
		return this._target;
		},function(v){
		if (this._target)this._target.off("effectbegin",this,this._onOtherBegin);
		this._target=v;
		if (this._target)this._target.on("effectbegin",this,this._onOtherBegin);
		this._addEvent();
	});

	/**
	*设置开始播放的事件。本实例会侦听目标对象的指定事件，触发后播放相应动画效果。
	*@param event
	*/
	__getset(0,__proto,'playEvent',null,function(event){
		this._playEvent=event;
		if (!event)return;
		this._addEvent();
	});

	/**
	*设置动画数据。
	*@param uiData
	*/
	__getset(0,__proto,'effectData',null,function(uiData){
		if (uiData){
			var aniData=uiData["animations"];
			if (aniData && aniData[0]){
				var data=aniData[0];
				this._setUp({},data);
				if (data.nodes && data.nodes[0]){
					this._aniKeys=data.nodes[0].keys;
				}
			}
		}
	});

	/**
	*设置提供数据的类。
	*@param classStr 类路径
	*/
	__getset(0,__proto,'effectClass',null,function(classStr){
		this._effectClass=ClassUtils.getClass(classStr);
		if (this._effectClass){
			var uiData=this._effectClass["uiView"];
			if (uiData){
				var aniData=uiData["animations"];
				if (aniData && aniData[0]){
					var data=aniData[0];
					this._setUp({},data);
					if (data.nodes && data.nodes[0]){
						this._aniKeys=data.nodes[0].keys;
					}
				}
			}
		}
	});

	EffectAnimation.EFFECT_BEGIN="effectbegin";
	return EffectAnimation;
})(FrameAnimation)


/**
*Graphics动画解析器
*@private
*/
//class laya.utils.GraphicAnimation extends laya.display.FrameAnimation
var GraphicAnimation=(function(_super){
	var GraphicNode;
	function GraphicAnimation(){
		/**@private */
		this.animationList=null;
		/**@private */
		this.animationDic=null;
		/**@private */
		this._nodeList=null;
		/**@private */
		this._nodeDefaultProps=null;
		/**@private */
		this._gList=null;
		/**@private */
		this._nodeIDAniDic={};
		/**@private */
		this._rootNode=null;
		/**@private */
		this._nodeGDic=null;
		GraphicAnimation.__super.call(this);
	}

	__class(GraphicAnimation,'laya.utils.GraphicAnimation',_super);
	var __proto=GraphicAnimation.prototype;
	/**@private */
	__proto._parseNodeList=function(uiView){
		if (!this._nodeList)this._nodeList=[];
		this._nodeDefaultProps[uiView.compId]=uiView.props;
		if (uiView.compId)this._nodeList.push(uiView.compId);
		var childs=uiView.child;
		if (childs){
			var i=0,len=childs.length;
			for (i=0;i < len;i++){
				this._parseNodeList(childs[i]);
			}
		}
	}

	/**@private */
	__proto._calGraphicData=function(aniData){
		this._setUp(null,aniData);
		this._createGraphicData();
		if (this._nodeIDAniDic){
			var key;
			for (key in this._nodeIDAniDic){
				this._nodeIDAniDic[key]=null;
			}
		}
	}

	/**@private */
	__proto._createGraphicData=function(){
		var gList=[];
		var i=0,len=this.count;
		var animationDataNew=this._usedFrames;
		if (!animationDataNew)animationDataNew=[];
		var preGraphic;
		for (i=0;i < len;i++){
			if (animationDataNew[i] || !preGraphic){
				preGraphic=this._createFrameGraphic(i);
			}
			gList.push(preGraphic);
		}
		this._gList=gList;
	}

	/**@private */
	__proto._createFrameGraphic=function(frame){
		var g=new Graphics();
		if (!GraphicAnimation._rootMatrix)GraphicAnimation._rootMatrix=new Matrix();
		this._updateNodeGraphic(this._rootNode,frame,GraphicAnimation._rootMatrix,g);
		return g;
	}

	__proto._updateNodeGraphic=function(node,frame,parentTransfrom,g,alpha){
		(alpha===void 0)&& (alpha=1);
		var tNodeG;
		tNodeG=this._nodeGDic[node.compId]=this._getNodeGraphicData(node.compId,frame,this._nodeGDic[node.compId]);
		if (!tNodeG.resultTransform)
			tNodeG.resultTransform=new Matrix();
		var tResultTransform;
		tResultTransform=tNodeG.resultTransform;
		Matrix.mul(tNodeG.transform,parentTransfrom,tResultTransform);
		var tTex;
		var tGraphicAlpha=tNodeG.alpha *alpha;
		if (tGraphicAlpha < 0.01)return;
		if (tNodeG.skin){
			tTex=this._getTextureByUrl(tNodeG.skin);
			if (tTex){
				if (tResultTransform._checkTransform()){
					g.drawTexture(tTex,0,0,tNodeG.width,tNodeG.height,tResultTransform,tGraphicAlpha);
					tNodeG.resultTransform=null;
					}else {
					g.drawTexture(tTex,tResultTransform.tx,tResultTransform.ty,tNodeG.width,tNodeG.height,null,tGraphicAlpha);
				}
			}
		};
		var childs=node.child;
		if (!childs)return;
		var i=0,len=0;
		len=childs.length;
		for (i=0;i < len;i++){
			this._updateNodeGraphic(childs[i],frame,tResultTransform,g,tGraphicAlpha);
		}
	}

	__proto._updateNoChilds=function(tNodeG,g){
		if (!tNodeG.skin)return;
		var tTex=this._getTextureByUrl(tNodeG.skin);
		if (!tTex)return;
		var tTransform=tNodeG.transform;
		tTransform._checkTransform();
		var onlyTranslate=false;
		onlyTranslate=!tTransform._bTransform;
		if (!onlyTranslate){
			g.drawTexture(tTex,0,0,tNodeG.width,tNodeG.height,tTransform.clone(),tNodeG.alpha);
			}else {
			g.drawTexture(tTex,tTransform.tx,tTransform.ty,tNodeG.width,tNodeG.height,null,tNodeG.alpha);
		}
	}

	__proto._updateNodeGraphic2=function(node,frame,g){
		var tNodeG;
		tNodeG=this._nodeGDic[node.compId]=this._getNodeGraphicData(node.compId,frame,this._nodeGDic[node.compId]);
		if (!node.child){
			this._updateNoChilds(tNodeG,g);
			return;
		};
		var tTransform=tNodeG.transform;
		tTransform._checkTransform();
		var onlyTranslate=false;
		onlyTranslate=!tTransform._bTransform;
		var hasTrans=false;
		hasTrans=onlyTranslate && (tTransform.tx !=0 || tTransform.ty !=0);
		var ifSave=false;
		ifSave=(tTransform._bTransform)|| tNodeG.alpha !=1;
		if (ifSave)g.save();
		if (tNodeG.alpha !=1)g.alpha(tNodeG.alpha);
		if (!onlyTranslate)g.transform(tTransform.clone());
		else if (hasTrans)g.translate(tTransform.tx,tTransform.ty);
		var childs=node.child;
		var tTex;
		if (tNodeG.skin){
			tTex=this._getTextureByUrl(tNodeG.skin);
			if (tTex){
				g.drawImage(tTex,0,0,tNodeG.width,tNodeG.height);
			}
		}
		if (childs){
			var i=0,len=0;
			len=childs.length;
			for (i=0;i < len;i++){
				this._updateNodeGraphic2(childs[i],frame,g);
			}
		}
		if (ifSave){
			g.restore();
			}else {
			if (!onlyTranslate){
				g.transform(tTransform.clone().invert());
				}else if (hasTrans){
				g.translate(-tTransform.tx,-tTransform.ty);
			}
		}
	}

	/**@private */
	__proto._calculateKeyFrames=function(node){
		_super.prototype._calculateKeyFrames.call(this,node);
		this._nodeIDAniDic[node.target]=node;
	}

	/**@private */
	__proto.getNodeDataByID=function(nodeID){
		return this._nodeIDAniDic[nodeID];
	}

	/**@private */
	__proto._getParams=function(obj,params,frame,obj2){
		var rst=GraphicAnimation._temParam;
		rst.length=params.length;
		var i=0,len=params.length;
		for (i=0;i < len;i++){
			rst[i]=this._getObjVar(obj,params[i][0],frame,params[i][1],obj2);
		}
		return rst;
	}

	/**@private */
	__proto._getObjVar=function(obj,key,frame,noValue,obj2){
		if (obj.hasOwnProperty(key)){
			var vArr=obj[key];
			if (frame >=vArr.length)frame=vArr.length-1;
			return obj[key][frame];
		}
		if (obj2.hasOwnProperty(key)){
			return obj2[key];
		}
		return noValue;
	}

	__proto._getNodeGraphicData=function(nodeID,frame,rst){
		if (!rst)
			rst=new GraphicNode();
		if (!rst.transform){
			rst.transform=new Matrix();
			}else {
			rst.transform.identity();
		};
		var node=this.getNodeDataByID(nodeID);
		if (!node)return rst;
		var frameData=node.frames;
		var params=this._getParams(frameData,GraphicAnimation._drawTextureCmd,frame,this._nodeDefaultProps[nodeID]);
		var url=params[0];
		var width=NaN,height=NaN;
		var px=params[5],py=params[6];
		var aX=params[13],aY=params[14];
		var sx=params[7],sy=params[8];
		var rotate=params[9];
		var skewX=params[11],skewY=params[12]
		width=params[3];
		height=params[4];
		if (width==0 || height==0)url=null;
		if (width==-1)width=0;
		if (height==-1)height=0;
		var tex;
		rst.skin=url;
		rst.width=width;
		rst.height=height;
		if (url){
			tex=this._getTextureByUrl(url);
			if (tex){
				if (!width)
					width=tex.sourceWidth;
				if (!height)
					height=tex.sourceHeight;
				}else {
				console.warn("lost skin:",url,",you may load pics first");
			}
		}
		rst.alpha=params[10];
		var m=rst.transform;
		if (aX !=0){
			px=aX *width;
		}
		if (aY !=0){
			py=aY *height;
		}
		if (px !=0 || py !=0){
			m.translate(-px,-py);
		};
		var tm=null;
		if (rotate || sx!==1 || sy!==1 || skewX || skewY){
			tm=GraphicAnimation._tempMt;
			tm.identity();
			tm._bTransform=true;
			var skx=(rotate-skewX)*0.0174532922222222;
			var sky=(rotate+skewY)*0.0174532922222222;
			var cx=Math.cos(sky);
			var ssx=Math.sin(sky);
			var cy=Math.sin(skx);
			var ssy=Math.cos(skx);
			tm.a=sx *cx;
			tm.b=sx *ssx;
			tm.c=-sy *cy;
			tm.d=sy *ssy;
			tm.tx=tm.ty=0;
		}
		if (tm){
			m=Matrix.mul(m,tm,m);
		}
		m.translate(params[1],params[2]);
		return rst;
	}

	/**@private */
	__proto._getTextureByUrl=function(url){
		return Loader.getRes(url);
	}

	/**@private */
	__proto.setAniData=function(uiView,aniName){
		if (uiView.animations){
			this._nodeDefaultProps={};
			this._nodeGDic={};
			if (this._nodeList)this._nodeList.length=0;
			this._rootNode=uiView;
			this._parseNodeList(uiView);
			var aniDic={};
			var anilist=[];
			var animations=uiView.animations;
			var i=0,len=animations.length;
			var tAniO;
			for (i=0;i < len;i++){
				tAniO=animations[i];
				this._labels=null;
				if (aniName && aniName !=tAniO.name){
					continue ;
				}
				if (!tAniO)
					continue ;
				try {
					this._calGraphicData(tAniO);
					}catch (e){
					console.warn("parse animation fail:"+tAniO.name+",empty animation created");
					this._gList=[];
				};
				var frameO={};
				frameO.interval=1000 / tAniO["frameRate"];
				frameO.frames=this._gList;
				frameO.labels=this._labels;
				frameO.name=tAniO.name;
				anilist.push(frameO);
				aniDic[tAniO.name]=frameO;
			}
			this.animationList=anilist;
			this.animationDic=aniDic;
		}
		GraphicAnimation._temParam.length=0;
	}

	__proto.parseByData=function(aniData){
		var rootNode,aniO;
		rootNode=aniData.nodeRoot;
		aniO=aniData.aniO;
		delete aniData.nodeRoot;
		delete aniData.aniO;
		this._nodeDefaultProps={};
		this._nodeGDic={};
		if (this._nodeList)this._nodeList.length=0;
		this._rootNode=rootNode;
		this._parseNodeList(rootNode);
		this._labels=null;
		try {
			this._calGraphicData(aniO);
			}catch (e){
			console.warn("parse animation fail:"+aniO.name+",empty animation created");
			this._gList=[];
		};
		var frameO=aniData;
		frameO.interval=1000 / aniO["frameRate"];
		frameO.frames=this._gList;
		frameO.labels=this._labels;
		frameO.name=aniO.name;
		return frameO;
	}

	/**@private */
	__proto.setUpAniData=function(uiView){
		if (uiView.animations){
			var aniDic={};
			var anilist=[];
			var animations=uiView.animations;
			var i=0,len=animations.length;
			var tAniO;
			for (i=0;i < len;i++){
				tAniO=animations[i];
				if (!tAniO)continue ;
				var frameO={};
				frameO.name=tAniO.name;
				frameO.aniO=tAniO;
				frameO.nodeRoot=uiView;
				anilist.push(frameO);
				aniDic[tAniO.name]=frameO;
			}
			this.animationList=anilist;
			this.animationDic=aniDic;
		}
	}

	/**@private */
	__proto._clear=function(){
		this.animationList=null;
		this.animationDic=null;
		this._gList=null;
		this._nodeGDic=null;
	}

	GraphicAnimation.parseAnimationByData=function(animationObject){
		if (!GraphicAnimation._I)GraphicAnimation._I=new GraphicAnimation();
		var rst;
		rst=GraphicAnimation._I.parseByData(animationObject);
		GraphicAnimation._I._clear();
		return rst;
	}

	GraphicAnimation.parseAnimationData=function(aniData){
		if (!GraphicAnimation._I)GraphicAnimation._I=new GraphicAnimation();
		GraphicAnimation._I.setUpAniData(aniData);
		var rst;
		rst={};
		rst.animationList=GraphicAnimation._I.animationList;
		rst.animationDic=GraphicAnimation._I.animationDic;
		GraphicAnimation._I._clear();
		return rst;
	}

	GraphicAnimation._temParam=[];
	GraphicAnimation._I=null;
	GraphicAnimation._rootMatrix=null;
	__static(GraphicAnimation,
	['_drawTextureCmd',function(){return this._drawTextureCmd=[["skin",null],["x",0],["y",0],["width",-1],["height",-1],["pivotX",0],["pivotY",0],["scaleX",1],["scaleY",1],["rotation",0],["alpha",1],["skewX",0],["skewY",0],["anchorX",0],["anchorY",0]];},'_tempMt',function(){return this._tempMt=new Matrix();}
	]);
	GraphicAnimation.__init$=function(){
		//class GraphicNode
		GraphicNode=(function(){
			function GraphicNode(){
				this.skin=null;
				this.transform=null;
				this.resultTransform=null;
				this.width=NaN;
				this.height=NaN;
				this.alpha=1;
			}
			__class(GraphicNode,'');
			return GraphicNode;
		})()
	}

	return GraphicAnimation;
})(FrameAnimation)


	Laya.__init([EventDispatcher,LoaderManager,GraphicAnimation,SceneUtils,Timer,CallLater,LocalStorage,TimeLine]);
})(window,document,Laya);

(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;

	var BlurFilter=laya.filters.BlurFilter,ColorFilter=laya.filters.ColorFilter,ColorUtils=laya.utils.ColorUtils;
	var Component=laya.components.Component,Ease=laya.utils.Ease,Event=laya.events.Event,GlowFilter=laya.filters.GlowFilter;
	var Handler=laya.utils.Handler,Node=laya.display.Node,Sprite=laya.display.Sprite,Tween=laya.utils.Tween,Utils=laya.utils.Utils;
//class LayaMain
var LayaMain=(function(){
	/*[COMPILER OPTIONS:normal]*/
	function LayaMain(){}
	__class(LayaMain,'LayaMain');
	return LayaMain;
})()


/**
*...
*@author ww
*/
//class laya.effect.FilterSetterBase
var FilterSetterBase=(function(){
	function FilterSetterBase(){
		this._filter=null;
		this._target=null;
	}

	__class(FilterSetterBase,'laya.effect.FilterSetterBase');
	var __proto=FilterSetterBase.prototype;
	__proto.paramChanged=function(){
		Laya.systemTimer.callLater(this,this.buildFilter);
	}

	__proto.buildFilter=function(){
		if (this._target){
			this.addFilter(this._target);
		}
	}

	__proto.addFilter=function(sprite){
		if (!sprite)return;
		if (!sprite.filters){
			sprite.filters=[this._filter];
			}else{
			var preFilters;
			preFilters=sprite.filters;
			if (preFilters.indexOf(this._filter)< 0){
				preFilters.push(this._filter);
				sprite.filters=Utils.copyArray([],preFilters);
			}
		}
	}

	__proto.removeFilter=function(sprite){
		if (!sprite)return;
		sprite.filters=null;
	}

	__getset(0,__proto,'target',null,function(value){
		if (this._target !=value){
			this._target=value;
			this.paramChanged();
		}
	});

	return FilterSetterBase;
})()


/**
*@Script {name:ButtonEffect}
*@author ww
*/
//class laya.effect.ButtonEffect
var ButtonEffect=(function(){
	function ButtonEffect(){
		this._tar=null;
		this._curState=0;
		this._curTween=null;
		/**
		*effectScale
		*@prop {name:effectScale,type:number,tips:"缩放值",default:"1.5"}
		*/
		this.effectScale=1.5;
		/**
		*tweenTime
		*@prop {name:tweenTime,type:number,tips:"缓动时长",default:"300"}
		*/
		this.tweenTime=300;
		/**
		*effectEase
		*@prop {name:effectEase,type:ease,tips:"效果缓动类型"}
		*/
		this.effectEase=null;
		/**
		*backEase
		*@prop {name:backEase,type:ease,tips:"恢复缓动类型"}
		*/
		this.backEase=null;
	}

	__class(ButtonEffect,'laya.effect.ButtonEffect');
	var __proto=ButtonEffect.prototype;
	__proto.toChangedState=function(){
		this._curState=1;
		if (this._curTween)Tween.clear(this._curTween);
		this._curTween=Tween.to(this._tar,{scaleX:this.effectScale,scaleY:this.effectScale },this.tweenTime,Ease[this.effectEase],Handler.create(this,this.tweenComplete));
	}

	__proto.toInitState=function(){
		if (this._curState==2)return;
		if (this._curTween)Tween.clear(this._curTween);
		this._curState=2;
		this._curTween=Tween.to(this._tar,{scaleX:1,scaleY:1 },this.tweenTime,Ease[this.backEase],Handler.create(this,this.tweenComplete));
	}

	__proto.tweenComplete=function(){
		this._curState=0;
		this._curTween=null;
	}

	/**
	*设置控制对象
	*@param tar
	*/
	__getset(0,__proto,'target',null,function(tar){
		this._tar=tar;
		tar.on(/*laya.events.Event.MOUSE_DOWN*/"mousedown",this,this.toChangedState);
		tar.on(/*laya.events.Event.MOUSE_UP*/"mouseup",this,this.toInitState);
		tar.on(/*laya.events.Event.MOUSE_OUT*/"mouseout",this,this.toInitState);
	});

	return ButtonEffect;
})()


/**
*效果插件基类，基于对象池管理
*/
//class laya.effect.EffectBase extends laya.components.Component
var EffectBase=(function(_super){
	function EffectBase(){
		/**动画持续时间，单位为毫秒*/
		this.duration=1000;
		/**动画延迟时间，单位为毫秒*/
		this.delay=0;
		/**重复次数，默认为播放一次*/
		this.repeat=0;
		/**缓动类型，如果为空，则默认为匀速播放*/
		this.ease=null;
		/**触发事件，如果为空，则创建时触发*/
		this.eventName=null;
		/**效用作用的目标对象，如果为空，则是脚本所在的节点本身*/
		this.target=null;
		/**效果结束后，是否自动移除节点*/
		this.autoDestroyAtComplete=true;
		this._comlete=null;
		this._tween=null;
		EffectBase.__super.call(this);
	}

	__class(EffectBase,'laya.effect.EffectBase',_super);
	var __proto=EffectBase.prototype;
	__proto._onAwake=function(){this.target=this.target|| this.owner;
		if (this.autoDestroyAtComplete)this._comlete=Handler.create(this.target,this.target.destroy,null,false);
		if (this.eventName)this.owner.on(this.eventName,this,this._exeTween);
		else this._exeTween();
	}

	__proto._exeTween=function(){
		this._tween=this._doTween();
		this._tween.repeat=this.repeat;
	}

	__proto._doTween=function(){
		return null;
	}

	__proto.onReset=function(){
		this.duration=1000;
		this.delay=0;
		this.repeat=0;
		this.ease=null;
		this.target=null;
		if (this.eventName){
			this.owner.off(this.eventName,this,this._exeTween);
			this.eventName=null;
		}
		if (this._comlete){
			this._comlete.recover();
			this._comlete=null;
		}
		if (this._tween){
			this._tween.clear();
			this._tween=null;
		}
	}

	return EffectBase;
})(Component)


/**
*...
*@author ww
*/
//class laya.effect.GlowFilterSetter extends laya.effect.FilterSetterBase
var GlowFilterSetter=(function(_super){
	function GlowFilterSetter(){
		/**
		*滤镜的颜色
		*/
		this._color="#ff0000";
		/**
		*边缘模糊的大小 0~20
		*/
		this._blur=4;
		/**
		*X轴方向的偏移
		*/
		this._offX=6;
		/**
		*Y轴方向的偏移
		*/
		this._offY=6;
		GlowFilterSetter.__super.call(this);
		this._filter=new GlowFilter(this._color);
	}

	__class(GlowFilterSetter,'laya.effect.GlowFilterSetter',_super);
	var __proto=GlowFilterSetter.prototype;
	__proto.buildFilter=function(){
		this._filter=new GlowFilter(this.color,this.blur,this.offX,this.offY);
		_super.prototype.buildFilter.call(this);
	}

	__getset(0,__proto,'blur',function(){
		return this._blur;
		},function(value){
		this._blur=value;
		this.paramChanged();
	});

	__getset(0,__proto,'color',function(){
		return this._color;
		},function(value){
		this._color=value;
		this.paramChanged();
	});

	__getset(0,__proto,'offX',function(){
		return this._offX;
		},function(value){
		this._offX=value;
		this.paramChanged();
	});

	__getset(0,__proto,'offY',function(){
		return this._offY;
		},function(value){
		this._offY=value;
		this.paramChanged();
	});

	return GlowFilterSetter;
})(FilterSetterBase)


/**
*...
*@author ww
*/
//class laya.effect.BlurFilterSetter extends laya.effect.FilterSetterBase
var BlurFilterSetter=(function(_super){
	function BlurFilterSetter(){
		this._strength=4;
		BlurFilterSetter.__super.call(this);
		this._filter=new BlurFilter(this.strength);
	}

	__class(BlurFilterSetter,'laya.effect.BlurFilterSetter',_super);
	var __proto=BlurFilterSetter.prototype;
	__proto.buildFilter=function(){
		this._filter=new BlurFilter(this.strength);
		_super.prototype.buildFilter.call(this);
	}

	__getset(0,__proto,'strength',function(){
		return this._strength;
		},function(value){
		this._strength=value;
	});

	return BlurFilterSetter;
})(FilterSetterBase)


/**
*...
*@author ww
*/
//class laya.effect.ColorFilterSetter extends laya.effect.FilterSetterBase
var ColorFilterSetter=(function(_super){
	function ColorFilterSetter(){
		/**
		*brightness 亮度,范围:-100~100
		*/
		this._brightness=0;
		/**
		*contrast 对比度,范围:-100~100
		*/
		this._contrast=0;
		/**
		*saturation 饱和度,范围:-100~100
		*/
		this._saturation=0;
		/**
		*hue 色调,范围:-180~180
		*/
		this._hue=0;
		/**
		*red red增量,范围:0~255
		*/
		this._red=0;
		/**
		*green green增量,范围:0~255
		*/
		this._green=0;
		/**
		*blue blue增量,范围:0~255
		*/
		this._blue=0;
		/**
		*alpha alpha增量,范围:0~255
		*/
		this._alpha=0;
		this._color=null;
		ColorFilterSetter.__super.call(this);
		this._filter=new ColorFilter();
	}

	__class(ColorFilterSetter,'laya.effect.ColorFilterSetter',_super);
	var __proto=ColorFilterSetter.prototype;
	__proto.buildFilter=function(){
		this._filter.reset();
		this._filter.color(this.red,this.green,this.blue,this.alpha);
		this._filter.adjustHue(this.hue);
		this._filter.adjustContrast(this.contrast);
		this._filter.adjustBrightness(this.brightness);
		this._filter.adjustSaturation(this.saturation);
		_super.prototype.buildFilter.call(this);
	}

	__getset(0,__proto,'brightness',function(){
		return this._brightness;
		},function(value){
		this._brightness=value;
		this.paramChanged();
	});

	__getset(0,__proto,'alpha',function(){
		return this._alpha;
		},function(value){
		this._alpha=value;
		this.paramChanged();
	});

	__getset(0,__proto,'contrast',function(){
		return this._contrast;
		},function(value){
		this._contrast=value;
		this.paramChanged();
	});

	__getset(0,__proto,'hue',function(){
		return this._hue;
		},function(value){
		this._hue=value;
		this.paramChanged();
	});

	__getset(0,__proto,'saturation',function(){
		return this._saturation;
		},function(value){
		this._saturation=value;
		this.paramChanged();
	});

	__getset(0,__proto,'green',function(){
		return this._green;
		},function(value){
		this._green=value;
		this.paramChanged();
	});

	__getset(0,__proto,'red',function(){
		return this._red;
		},function(value){
		this._red=value;
		this.paramChanged();
	});

	__getset(0,__proto,'blue',function(){
		return this._blue;
		},function(value){
		this._blue=value;
		this.paramChanged();
	});

	__getset(0,__proto,'color',function(){
		return this._color;
		},function(value){
		this._color=value;
		var colorO;
		colorO=ColorUtils.create(value);
		this._red=colorO.arrColor[0] *255;
		this._green=colorO.arrColor[1] *255;
		this._blue=colorO.arrColor[2] *255;
		this.paramChanged();
	});

	return ColorFilterSetter;
})(FilterSetterBase)


/**
*淡入效果
*/
//class laya.effect.FadeIn extends laya.effect.EffectBase
var FadeIn=(function(_super){
	function FadeIn(){
		FadeIn.__super.call(this);;
	}

	__class(FadeIn,'laya.effect.FadeIn',_super);
	var __proto=FadeIn.prototype;
	__proto._doTween=function(){
		this.target.alpha=0;
		return Tween.to(this.target,{alpha:1},this.duration,Ease[this.ease],this._comlete,this.delay);
	}

	return FadeIn;
})(EffectBase)


/**
*淡出效果
*/
//class laya.effect.FadeOut extends laya.effect.EffectBase
var FadeOut=(function(_super){
	function FadeOut(){
		FadeOut.__super.call(this);;
	}

	__class(FadeOut,'laya.effect.FadeOut',_super);
	var __proto=FadeOut.prototype;
	__proto._doTween=function(){
		this.target.alpha=1;
		return Tween.to(this.target,{alpha:0},this.duration,Ease[this.ease],this._comlete,this.delay);
	}

	return FadeOut;
})(EffectBase)



	/**LayaGameStart**/
	new LayaMain();

})(window,document,Laya);

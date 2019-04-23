//class fairygui.GBasicTextField extends fairygui.GTextField
var GBasicTextField=(function(_super){
	var LineInfo,TextExt;
	function GBasicTextField(){
		this.textField=null;
		this._font=null;
		this._color=null;
		this._ubbEnabled=false;
		this._singleLine=false;
		this._letterSpacing=0;
		this._autoSize=0;
		this._widthAutoSize=false;
		this._heightAutoSize=false;
		this._updatingSize=false;
		this._textWidth=0;
		this._textHeight=0;
		this._bitmapFont=null;
		this._lines=null;
		GBasicTextField.__super.call(this);
		this._text="";
		this._color="#000000";
		this.textField.align="left";
		this.textField.font=UIConfig$1.defaultFont;
		this._autoSize=1;
		this._widthAutoSize=this._heightAutoSize=true;
		this.textField["_sizeDirty"]=false;
	}

	__class(GBasicTextField,'fairygui.GBasicTextField',_super);
	var __proto=GBasicTextField.prototype;
	__proto.createDisplayObject=function(){
		this._displayObject=this.textField=new TextExt(this);
		this._displayObject["$owner"]=this;
		this._displayObject.mouseEnabled=false;
	}

	__proto.setAutoSize=function(value){
		this._autoSize=value;
		this._widthAutoSize=value==1;
		this._heightAutoSize=value==1 || value==2;
		this.textField.wordWrap=!this._widthAutoSize && !this._singleLine;
		if(!this._underConstruct){
			if(!this._heightAutoSize)
				this.textField.size(this.width,this.height);
			else if(!this._widthAutoSize)
			this.textField.width=this.width;
		}
	}

	__proto.ensureSizeCorrect=function(){
		if (!this._underConstruct && this.textField["_isChanged"])
			this.textField.typeset();
	}

	__proto.typeset=function(){
		if(this._bitmapFont!=null)
			this.renderWithBitmapFont();
		else if(this._widthAutoSize || this._heightAutoSize)
		this.updateSize();
	}

	__proto.updateSize=function(){
		this._textWidth=Math.ceil(this.textField.textWidth);
		this._textHeight=Math.ceil(this.textField.textHeight);
		var w=NaN,h=0;
		if(this._widthAutoSize){
			w=this._textWidth;
			if(this.textField.width!=w){
				this.textField.width=w;
				if(this.textField.align!="left")
					this.textField["baseTypeset"]();
			}
		}
		else
		w=this.width;
		if(this._heightAutoSize){
			h=this._textHeight;
			if(!this._widthAutoSize){
				if(this.textField.height!=this._textHeight)
					this.textField.height=this._textHeight;
			}
		}
		else {
			h=this.height;
			if(this._textHeight > h)
				this._textHeight=h;
			if(this.textField.height!=this._textHeight)
				this.textField.height=this._textHeight;
		}
		this._updatingSize=true;
		this.setSize(w,h);
		this._updatingSize=false;
	}

	__proto.renderWithBitmapFont=function(){
		var gr=this._displayObject.graphics;
		gr.clear();
		if (!this._lines)
			this._lines=[];
		else
		LineInfo.returnList(this._lines);
		var letterSpacing=this.letterSpacing;
		var lineSpacing=this.leading-1;
		var rectWidth=this.width-2 *2;
		var lineWidth=0,lineHeight=0,lineTextHeight=0;
		var glyphWidth=0,glyphHeight=0;
		var wordChars=0,wordStart=0,wordEnd=0;
		var lastLineHeight=0;
		var lineBuffer="";
		var lineY=2;
		var line;
		var wordWrap=!this._widthAutoSize && !this._singleLine;
		var fontSize=this.fontSize;
		var fontScale=this._bitmapFont.resizable?fontSize/this._bitmapFont.size:1;
		this._textWidth=0;
		this._textHeight=0;
		var text2=this._text;
		if (this._templateVars !=null)
			text2=this.parseTemplate(text2);
		var textLength=text2.length;
		for (var offset=0;offset < textLength;++offset){
			var ch=text2.charAt(offset);
			var cc=ch.charCodeAt(0);
			if (cc==10){
				lineBuffer+=ch;
				line=LineInfo.borrow();
				line.width=lineWidth;
				if (lineTextHeight==0){
					if (lastLineHeight==0)
						lastLineHeight=fontSize;
					if (lineHeight==0)
						lineHeight=lastLineHeight;
					lineTextHeight=lineHeight;
				}
				line.height=lineHeight;
				lastLineHeight=lineHeight;
				line.textHeight=lineTextHeight;
				line.text=lineBuffer;
				line.y=lineY;
				lineY+=(line.height+lineSpacing);
				if (line.width > this._textWidth)
					this._textWidth=line.width;
				this._lines.push(line);
				lineBuffer="";
				lineWidth=0;
				lineHeight=0;
				lineTextHeight=0;
				wordChars=0;
				wordStart=0;
				wordEnd=0;
				continue ;
			}
			if (cc>=65 && cc<=90 || cc>=97 && cc<=122){
				if (wordChars==0)
					wordStart=lineWidth;
				wordChars++;
			}
			else{
				if (wordChars > 0)
					wordEnd=lineWidth;
				wordChars=0;
			}
			if (cc==32){
				glyphWidth=Math.ceil(fontSize / 2);
				glyphHeight=fontSize;
			}
			else {
				var glyph=this._bitmapFont.glyphs[ch];
				if (glyph){
					glyphWidth=Math.ceil(glyph.advance*fontScale);
					glyphHeight=Math.ceil(glyph.lineHeight*fontScale);
				}
				else {
					glyphWidth=0;
					glyphHeight=0;
				}
			}
			if (glyphHeight > lineTextHeight)
				lineTextHeight=glyphHeight;
			if (glyphHeight > lineHeight)
				lineHeight=glyphHeight;
			if (lineWidth !=0)
				lineWidth+=letterSpacing;
			lineWidth+=glyphWidth;
			if (!wordWrap || lineWidth <=rectWidth){
				lineBuffer+=ch;
			}
			else {
				line=LineInfo.borrow();
				line.height=lineHeight;
				line.textHeight=lineTextHeight;
				if (lineBuffer.length==0){
					line.text=ch;
				}
				else if (wordChars > 0 && wordEnd > 0){
					lineBuffer+=ch;
					var len=lineBuffer.length-wordChars;
					line.text=ToolSet.trimRight(lineBuffer.substr(0,len));
					line.width=wordEnd;
					lineBuffer=lineBuffer.substr(len);
					lineWidth-=wordStart;
				}
				else {
					line.text=lineBuffer;
					line.width=lineWidth-(glyphWidth+letterSpacing);
					lineBuffer=ch;
					lineWidth=glyphWidth;
					lineHeight=glyphHeight;
					lineTextHeight=glyphHeight;
				}
				line.y=lineY;
				lineY+=(line.height+lineSpacing);
				if (line.width > this._textWidth)
					this._textWidth=line.width;
				wordChars=0;
				wordStart=0;
				wordEnd=0;
				this._lines.push(line);
			}
		}
		if (lineBuffer.length > 0){
			line=LineInfo.borrow();
			line.width=lineWidth;
			if (lineHeight==0)
				lineHeight=lastLineHeight;
			if (lineTextHeight==0)
				lineTextHeight=lineHeight;
			line.height=lineHeight;
			line.textHeight=lineTextHeight;
			line.text=lineBuffer;
			line.y=lineY;
			if (line.width > this._textWidth)
				this._textWidth=line.width;
			this._lines.push(line);
		}
		if (this._textWidth > 0)
			this._textWidth+=2 *2;
		var count=this._lines.length;
		if (count==0){
			this._textHeight=0;
		}
		else {
			line=this._lines[this._lines.length-1];
			this._textHeight=line.y+line.height+2;
		};
		var w=NaN,h=0;
		if (this._widthAutoSize){
			if (this._textWidth==0)
				w=0;
			else
			w=this._textWidth;
		}
		else
		w=this.width;
		if (this._heightAutoSize){
			if (this._textHeight==0)
				h=0;
			else
			h=this._textHeight;
		}
		else
		h=this.height;
		this._updatingSize=true;
		this.setSize(w,h);
		this._updatingSize=false;
		this.doAlign();
		if (w==0 || h==0)
			return;
		var charX=2;
		var lineIndent=0;
		var charIndent=0;
		rectWidth=this.width-2 *2;
		var lineCount=this._lines.length;
		for (var i=0;i < lineCount;i++){
			line=this._lines[i];
			charX=2;
			if (this.align=="center")
				lineIndent=(rectWidth-line.width)/ 2;
			else if (this.align=="right")
			lineIndent=rectWidth-line.width;
			else
			lineIndent=0;
			textLength=line.text.length;
			for (var j=0;j < textLength;j++){
				ch=line.text.charAt(j);
				cc=ch.charCodeAt(0);
				if(cc==10)
					continue ;
				if(cc==32){
					charX+=this._letterSpacing+Math.ceil(fontSize/2);
					continue ;
				}
				glyph=this._bitmapFont.glyphs[ch];
				if (glyph !=null){
					charIndent=(line.height+line.textHeight)/ 2-Math.ceil(glyph.lineHeight*fontScale);
					if(glyph.texture){
						gr.drawTexture(glyph.texture,
						charX+lineIndent+Math.ceil(glyph.offsetX*fontScale),
						line.y+charIndent+Math.ceil(glyph.offsetY*fontScale),
						glyph.texture.width *fontScale,
						glyph.texture.height *fontScale);
					}
					charX+=letterSpacing+Math.ceil(glyph.advance*fontScale);
				}
				else {
					charX+=letterSpacing;
				}
			}
		}
	}

	//line loop
	__proto.handleSizeChanged=function(){
		if(this._updatingSize)
			return;
		if(this._underConstruct)
			this.textField.size(this.width,this.height);
		else{
			if(this._bitmapFont!=null){
				if(!this._widthAutoSize)
					this.textField["setChanged"]();
				else
				this.doAlign();
			}
			else {
				if(!this._widthAutoSize){
					if(!this._heightAutoSize)
						this.textField.size(this.width,this.height);
					else
					this.textField.width=this.width;
				}
			}
		}
	}

	__proto.handleGrayedChanged=function(){
		fairygui.GObject.prototype.handleGrayedChanged.call(this);
		if(this.grayed)
			this.textField.color="#AAAAAA";
		else
		this.textField.color=this._color;
	}

	__proto.doAlign=function(){
		if(this.valign=="top" || this._textHeight==0)
			this._yOffset=2;
		else {
			var dh=this.height-this._textHeight;
			if(dh < 0)
				dh=0;
			if(this.valign=="middle")
				this._yOffset=Math.floor(dh / 2);
			else
			this._yOffset=Math.floor(dh);
		}
		this.handleXYChanged();
	}

	__proto.flushVars=function(){
		this.text=this._text;
	}

	__getset(0,__proto,'bold',function(){
		return this.textField.bold;
		},function(value){
		this.textField.bold=value;
	});

	__getset(0,__proto,'letterSpacing',function(){
		return this._letterSpacing;
		},function(value){
		this._letterSpacing=value;
	});

	__getset(0,__proto,'align',function(){
		return this.textField.align;
		},function(value){
		this.textField.align=value;
	});

	__getset(0,__proto,'text',function(){
		return this._text;
		},function(value){
		this._text=value;
		if(this._text==null)
			this._text="";
		if(this._bitmapFont==null){
			if(this._widthAutoSize)
				this.textField.width=10000;
			var text2=this._text;
			if (this._templateVars !=null)
				text2=this.parseTemplate(text2);
			if(this._ubbEnabled)
				this.textField.text=ToolSet.removeUBB(ToolSet.encodeHTML(text2));
			else
			this.textField.text=text2;
		}
		else{
			this.textField.text="";
			this.textField["setChanged"]();
		}
		if(this.parent && this.parent._underConstruct)
			this.textField.typeset();
	});

	__getset(0,__proto,'color',function(){
		return this._color;
		},function(value){
		if (this._color !=value){
			this._color=value;
			if (this._gearColor.controller)
				this._gearColor.updateState();
			if(this.grayed)
				this.textField.color="#AAAAAA";
			else
			this.textField.color=this._color;
		}
	});

	__getset(0,__proto,'font',function(){
		return this.textField.font;
		},function(value){
		this._font=value;
		if(ToolSet.startsWith(this._font,"ui://"))
			this._bitmapFont=UIPackage.getItemAssetByURL(this._font);
		else
		this._bitmapFont=null;
		if(this._bitmapFont!=null){
			this.textField["setChanged"]();
		}
		else {
			if(this._font)
				this.textField.font=this._font;
			else
			this.textField.font=UIConfig$1.defaultFont;
		}
	});

	__getset(0,__proto,'leading',function(){
		return this.textField.leading;
		},function(value){
		this.textField.leading=value;
	});

	__getset(0,__proto,'fontSize',function(){
		return this.textField.fontSize;
		},function(value){
		this.textField.fontSize=value;
	});

	__getset(0,__proto,'valign',function(){
		return this.textField.valign;
		},function(value){
		this.textField.valign=value;
	});

	__getset(0,__proto,'italic',function(){
		return this.textField.italic;
		},function(value){
		this.textField.italic=value;
	});

	__getset(0,__proto,'underline',function(){
		return this.textField.underline;
		},function(value){
		this.textField.underline=value;
	});

	__getset(0,__proto,'singleLine',function(){
		return this._singleLine;
		},function(value){
		this._singleLine=value;
		this.textField.wordWrap=!this._widthAutoSize && !this._singleLine;
	});

	__getset(0,__proto,'stroke',function(){
		return this.textField.stroke;
		},function(value){
		this.textField.stroke=value;
	});

	__getset(0,__proto,'strokeColor',function(){
		return this.textField.strokeColor;
		},function(value){
		this.textField.strokeColor=value;
		this.updateGear(4);
	});

	__getset(0,__proto,'ubbEnabled',function(){
		return this._ubbEnabled;
		},function(value){
		this._ubbEnabled=value;
	});

	__getset(0,__proto,'autoSize',function(){
		return this._autoSize;
		},function(value){
		if (this._autoSize !=value){
			this.setAutoSize(value);
		}
	});

	__getset(0,__proto,'textWidth',function(){
		if (this.textField["_isChanged"])
			this.textField.typeset();
		return this._textWidth;
	});

	GBasicTextField.GUTTER_X=2;
	GBasicTextField.GUTTER_Y=2;
	GBasicTextField.__init$=function(){
		
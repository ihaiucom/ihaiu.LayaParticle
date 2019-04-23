//class laya.webgl.resource.CharBook
var CharBook=(function(){
	var charPageTrash;
	function CharBook(){
		//private var fontPages:*={};//以font family为key。里面是一个以height为key的page列表
		this.fontPages=[];
		//用数组方式保存 CharPages,原来用Object不利于遍历
		this.fontPagesName=[];
		//当前选中的font
		this._curPage=null;
		//当前选中的page
		this.tempUV=[0,0,1,0,1,1,0,1];
		//用来去掉context的缩放的矩阵
		this.fontScaleX=1.0;
		//临时缩放。
		this.fontScaleY=1.0;
		this._curStrPos=0;
		this.tempMat=new Matrix();
		var bugIOS=false;
		var miniadp=Laya['MiniAdpter'];
		if (miniadp && miniadp.systemInfo && miniadp.systemInfo.system){
			bugIOS=miniadp.systemInfo.system.toLowerCase()==='ios 10.1.1';
		}
		if (Browser.onMiniGame && !bugIOS)CharBook.isWan1Wan=true;
		CharBook.charbookInst=this;
		Laya['textRender']=this;
		CharPages.charRender=Render.isConchApp ? (new CharRender_Native()):(new CharRender_Canvas(CharBook.textureWidth,CharBook.textureWidth,CharBook.scaleFontWithCtx,!CharBook.isWan1Wan,CharBook.debug));
	}

	__class(CharBook,'laya.webgl.resource.CharBook');
	var __proto=CharBook.prototype;
	/**
	*选择一个合适大小的page。 这里会考虑整体缩放。
	*@param fontFamily
	*@param fontsize 这个是原始大小，没有缩放的
	*@return
	*/
	__proto.selectFont=function(fontFamily,fontsize){
		var scale=Math.max(this.fontScaleX,this.fontScaleY);
		var scaledFontSz=fontsize *scale;
		var ret;
		if (fontFamily===CharBook._lastFont && scaledFontSz===CharBook._lastFontSz){
			ret=CharBook._lastCharPage;
			}else {
			var sz=CharPages.getBmpSize(fontsize)*scale;
			var szid=Math.floor(sz / CharBook.gridSize);
			var key=fontFamily+szid;
			var fid=this.fontPagesName.indexOf(key);
			if (fid < 0){
				var selFontPages=new CharPages(fontFamily,sz,Render.isConchApp ? 0 :Math.ceil((fontsize / 4.0)));
				this.fontPages.push(selFontPages);
				this.fontPagesName.push(key);
				ret=selFontPages;
				}else {
				ret=this.fontPages[fid];
			}
			ret.selectSize(fontsize,sz);
			CharBook._lastFont=fontFamily;
			CharBook._lastFontSz=scaledFontSz;
			CharBook._lastCharPage=ret;
		}
		return ret;
	}

	/**
	*从string中取出一个完整的char，例如emoji的话要多个
	*会修改 _curStrPos
	*TODO 由于各种文字中的组合写法，这个需要能扩展，以便支持泰文等
	*@param str
	*@param start 开始位置
	*/
	__proto.getNextChar=function(str){
		var len=str.length;
		var start=this._curStrPos;
		if (start >=len)
			return null;
		var link=false;
		var i=start;
		var state=0;
		for (;i < len;i++){
			var c=str.charCodeAt(i);
			if ((c >>> 11)==0x1b){
				if (state==1)break ;
				state=1;
				i++;
			}
			else if (c===0xfe0e || c===0xfe0f){}
			else if (c==0x200d){
				state=2;
				}else {
				if (state==0)state=1;
				else if (state==1)break ;
				else if (state==2){}
			}
		}
		this._curStrPos=i;
		return str.substring(start,i);
	}

	//TODO:coverage
	__proto.hasFreedText=function(txts,startid){
		if (txts && txts.length > 0){
			for (var i=startid,sz=txts.length;i < sz;i++){
				var pri=txts[i];
				if (!pri)continue ;
				for (var j=0,pisz=pri.length;j < pisz;j++){
					var riSaved=(pri [j]).ri;
					if (riSaved.deleted || riSaved.tex.__destroyed){
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	*参数都是直接的，不需要自己再从字符串解析
	*@param ctx
	*@param data
	*@param x
	*@param y
	*@param fontObj
	*@param color
	*@param strokeColor
	*@param lineWidth
	*@param textAlign
	*@param underLine
	*/
	__proto._fast_filltext=function(ctx,data,htmlchars,x,y,font,color,strokeColor,lineWidth,textAlign,underLine){
		(underLine===void 0)&& (underLine=0);
		if (data && data.length < 1)return;
		if (htmlchars && htmlchars.length < 1)return;
		CharBook._curFont=font._font;
		this.fontScaleX=this.fontScaleY=1.0;
		if (CharBook.scaleFontWithCtx){
			var sx=ctx.getMatScaleX();
			var sy=ctx.getMatScaleY();
			if (sx < 1e-4 || sy < 1e-1)
				return;
			if (sx > 1)this.fontScaleX=sx;
			if (sy > 1)this.fontScaleY=sy;
		}
		font._italic && (ctx._italicDeg=12);
		this._curPage=this.selectFont(font._family,font._size);
		var curx=x;
		var wt=data;
		var str=data;
		var strWidth=0;
		var isWT=!htmlchars && ((data instanceof laya.utils.WordText ));
		var isHtmlChar=!!htmlchars;
		var sameTexData=(CharBook.cacheRenderInfoInWordText && isWT)? wt.pageChars :[];
		if (isWT){
			str=wt._text;
			strWidth=wt.width;
			if (strWidth < 0){
				strWidth=wt.width=this._curPage.getWidth(str);
			}
			}else {
			strWidth=str?this._curPage.getWidth(str):0;
		}
		switch (textAlign){
			case Context.ENUM_TEXTALIGN_CENTER:
				curx=x-strWidth / 2;
				break ;
			case Context.ENUM_TEXTALIGN_RIGHT:
				curx=x-strWidth;
				break ;
			default :
				curx=x;
			}
		if (wt && wt.lastGCCnt !=this._curPage.gcCnt){
			wt.lastGCCnt=this._curPage.gcCnt;
			if (this.hasFreedText(sameTexData,wt.startID)){
				sameTexData=wt.pageChars=[];
			}
		};
		var startTexID=isWT ? wt.startID :0;
		var startTexIDStroke=isWT ? wt.startIDStroke :0;
		if (!sameTexData || sameTexData.length < 1){
			var scaleky=null;
			if (CharBook.scaleFontWithCtx){
				CharPages.charRender.scale(Math.max(this.fontScaleX,1.0),Math.max(this.fontScaleY,1.0));
				if (this.fontScaleX > 1.0 || this.fontScaleY > 1.0)
					scaleky=""+((this.fontScaleX *10)| 0)+((this.fontScaleY *10)| 0);
			}
			startTexID=-1;
			startTexIDStroke=-1;
			var stx=0;
			var sty=0;
			this._curStrPos=0;
			var curstr;
			if (isHtmlChar){
				var chc=htmlchars[this._curStrPos++];
				curstr=chc.char;
				stx=chc.x;
				sty=chc.y;
				}else {
				curstr=this.getNextChar(str);
			};
			var bold=font._bold;
			while (curstr){
				var ri;
				ri=this._curPage.getChar(curstr,lineWidth,font._size,color,strokeColor,bold,false,scaleky);
				if (!ri){
					break ;
				}
				ri.char=curstr;
				if (ri.isSpace){
					}else {
					var add=sameTexData[ri.tex.id];
					if (!add){
						sameTexData[ri.tex.id]=add=[];
						if (startTexID < 0 || startTexID > ri.tex.id)
							startTexID=ri.tex.id;
					}
					add.push({ri:ri,x:stx,y:sty,w:ri.bmpWidth / this.fontScaleX,h:ri.bmpHeight / this.fontScaleY});
				}
				if (isHtmlChar){
					chc=htmlchars[this._curStrPos++];
					if (chc){
						curstr=chc.char;
						stx=chc.x;
						sty=chc.y;
						}else {
						curstr=null;
					}
					}else {
					curstr=this.getNextChar(str);
					stx+=ri.width;
				}
			}
			if (isWT){
				wt.startID=startTexID;
				wt.startIDStroke=startTexIDStroke;
			}
		}
		this._drawResortedWords(ctx,curx,sameTexData,startTexID,y);
		ctx._italicDeg=0;
	}

	__proto.fillWords=function(ctx,data,x,y,fontStr,color,strokeColor,lineWidth){
		if (!data)return;
		if (data.length <=0)return;
		var nColor=ColorUtils.create(color).numColor;
		var nStrokeColor=strokeColor ? ColorUtils.create(strokeColor).numColor :0;
		CharBook._curFont=fontStr;
		var font=FontInfo.Parse(fontStr);
		this._fast_filltext(ctx,null,data,x,y,font,color,strokeColor,lineWidth,0,0);
	}

	/**
	*
	*TEST
	*emoji:'💗'
	*arabic:'سلام'
	*组合:'ă'
	*泰语:'ฏ๎๎๎๎๎๎๎๎๎๎๎๎๎๎๎'
	*天城文:'कि' *
	*/
	__proto.filltext=function(ctx,data,x,y,fontStr,color,strokeColor,lineWidth,textAlign,underLine){
		(underLine===void 0)&& (underLine=0);
		if (data.length <=0)
			return;
		var nColor=ColorUtils.create(color).numColor;
		var nStrokeColor=strokeColor ? ColorUtils.create(strokeColor).numColor :0;
		CharBook._curFont=fontStr;
		var font=FontInfo.Parse(fontStr);
		var nTextAlign=0;
		switch (textAlign){
			case 'center':
				nTextAlign=Context.ENUM_TEXTALIGN_CENTER;
				break ;
			case 'right':
				nTextAlign=Context.ENUM_TEXTALIGN_RIGHT;
				break ;
			}
		this._fast_filltext(ctx,data,null,x,y,font,color,strokeColor,lineWidth,nTextAlign,underLine);
	}

	//TODO:coverage
	__proto.filltext_native=function(ctx,data,htmlchars,x,y,fontStr,color,strokeColor,lineWidth,textAlign,underLine){
		(underLine===void 0)&& (underLine=0);
		if (data && data.length <=0)
			return;
		var nColor=ColorUtils.create(color).numColor;
		var nStrokeColor=strokeColor ? ColorUtils.create(strokeColor).numColor :0;
		CharBook._curFont=fontStr;
		this.fontScaleX=this.fontScaleY=1.0;
		if (CharBook.scaleFontWithCtx){
			var sx=ctx._curMat.getScaleX();
			var sy=ctx._curMat.getScaleY();
			if (sx < 1e-4 || sy < 1e-1)
				return;
			this.fontScaleX=sx;
			this.fontScaleY=sy;
			CharPages.charRender.scale(this.fontScaleX,this.fontScaleY);
		};
		var font=FontInfo.Parse(fontStr);
		var fontFamily=font._family;
		var bold=font._bold;
		if (font._italic){
			ctx._italicDeg=12;
		}
		this._curPage=this.selectFont(fontFamily,font._size *this.fontScaleX);
		var curx=x;
		var wt=data;
		var str=data;
		var strWidth=0;
		var isWT=!htmlchars && ((str instanceof laya.utils.WordText ));
		var isHtmlChar=!!htmlchars;
		var sameTexData=(CharBook.cacheRenderInfoInWordText && isWT)? wt.pageChars :[];
		if (isWT){
			str=wt.toString();
			strWidth=wt.width;
			if (strWidth < 0){
				strWidth=wt.width=this._curPage.getWidth(str);
			}
			}else {
			strWidth=this._curPage.getWidth(str);
		}
		switch (textAlign){
			case 'center':
				curx=x-strWidth / 2;
				break ;
			case 'right':
				curx=x-strWidth;
				break ;
			default :
				curx=x;
			}
		if (sameTexData){
			var needRebuild=false;
			for (var i=0,sz=sameTexData.length;i < sz;i++){
				var pri=sameTexData[i];
				if (!pri)continue ;
				for (var j=0,pisz=pri.length;j < pisz;j++){
					var riSaved=pri[j];
					if (riSaved.ri.tex.__destroyed){
						needRebuild=true;
						break ;
					}
				}
				if (needRebuild)break ;
			}
			if (needRebuild)
				sameTexData=wt.pageChars=[];
		}
		if (!sameTexData || sameTexData.length <=0){
			var scaleky=null;
			if (CharBook.scaleFontWithCtx){
				CharPages.charRender.scale(Math.max(this.fontScaleX,1.0),Math.max(this.fontScaleY,1.0));
				if (this.fontScaleX > 1.0 || this.fontScaleY > 1.0)
					scaleky=""+((this.fontScaleX *10)| 0)+((this.fontScaleY *10)| 0);
			};
			var stx=0;
			var sty=0;
			this._curStrPos=0;
			var curstr;
			if (isHtmlChar){
				var chc=htmlchars[this._curStrPos++];
				curstr=chc.char;
				stx=chc.x;
				sty=chc.y;
				}else {
				curstr=this.getNextChar(str);
			}
			bold=font._bold;
			while (curstr){
				var ri;
				ri=this._curPage.getChar(curstr,lineWidth,font._size,color,strokeColor,bold,false,scaleky);
				if (ri.isSpace){
					}else {
					var add=sameTexData[ri.tex.id];
					if (!add){
						sameTexData[ri.tex.id]=add=[];
					}
					add.push({ri:ri,x:stx,y:sty,color:color,nColor:nColor});
				}
				if (isHtmlChar){
					chc=htmlchars[this._curStrPos++];
					if (chc){
						curstr=chc.char;
						stx=chc.x;
						sty=chc.y;
						}else {
						curstr=null;
					}
					}else {
					stx+=ri.width;
					curstr=this.getNextChar(str);
				}
			}
		};
		var lastUseColor=ctx._drawTextureUseColor;
		this._drawResortedWords_native(ctx,curx,sameTexData,y);
		ctx._drawTextureUseColor=lastUseColor;
		ctx._italicDeg=0;
	}

	/**
	*画出重新按照贴图顺序分组的文字。
	*@param samePagesData
	*@param startx 保存的数据是相对位置，所以需要加上这个便宜，相对位置更灵活一些。
	*@param y {int}因为这个只能画在一行上所以没有必要保存y。所以这里再把y传进来
	*/
	__proto._drawResortedWords=function(ctx,startx,samePagesData,startID,y){
		var lastColor=ctx.getFillColor();
		ctx.setFillColor(ctx.mixRGBandAlpha(0xffffff));
		startx-=this._curPage.margin_left;
		y-=this._curPage.margin_top;
		var isLastRender=ctx._charSubmitCache._enbale;
		for (var i=startID,sz=samePagesData.length;i < sz;i++){
			var pri=samePagesData[i];
			if (!pri)continue ;
			var pisz=pri.length;
			if (pisz <=0)continue ;
			for (var j=0;j < pisz;j++){
				var riSaved=pri[j];
				var ri=riSaved.ri;
				if (ri.isSpace)continue ;
				ri.touch();
				ctx.drawTexAlign=true;
				ctx._inner_drawTexture(ri.tex.texture,(ri.tex.texture).bitmap.id,startx+riSaved.x ,y+riSaved.y ,riSaved.w,riSaved.h,null,ri.uv,1.0,isLastRender);
				if ((ctx).touches){
					(ctx).touches.push(ri);
				}
			}
		}
		ctx.setFillColor(lastColor);
	}

	//TODO:coverage
	__proto._drawResortedWords_native=function(ctx,startx,samePagesData,y){
		var lastcolor=0;
		for (var i=0,sz=samePagesData.length;i < sz;i++){
			var pri=samePagesData[i];
			if (!pri)continue ;
			for (var j=0,pisz=pri.length;j < pisz;j++){
				var riSaved=pri[j];
				var ri=riSaved.ri;
				if (ri.isSpace)continue ;
				ctx._drawTextureUseColor=false;
				if (lastcolor !=riSaved.nColor){
					ctx.fillStyle=riSaved.color;
					lastcolor=riSaved.nColor;
				}
				ri.touch();
				this._drawCharRenderInfo(ctx,riSaved.ri,startx+riSaved.x,riSaved.y+y);
			}
		}
	}

	//TODO:coverage
	__proto._drawCharRenderInfo=function(ctx,ri,x,y){
		ctx._drawTextureM(ri.tex.texture,x-this._curPage.margin_left,y-this._curPage.margin_top,ri.bmpWidth,ri.bmpHeight,null,1.0,ri.uv);
		if ((ctx).touches){
			(ctx).touches.push(ri);
		}
	}

	// for debug
	__proto.listPages=function(){
		var _$this=this;
		console.log('打印所有页的信息:');
		this.fontPages.forEach(function(cp,i){
			var name=_$this.fontPagesName[i];
			var minsz=parseInt(name.substr(cp.fontFamily.length))*CharBook.gridSize;
			console.log('===================================');
			console.log('名字:',_$this.fontPagesName[i],'大小范围:',minsz,minsz+CharBook.gridSize);
			cp.printPagesInfo();
		});
	}

	/**
	*垃圾回收
	*/
	__proto.GC=function(force){
		var i=0,sz=this.fontPages.length;
		this.fontPages.forEach(function(p){p.removeLRU();});
	}

	CharBook.textureWidth=512;
	CharBook.cacheRenderInfoInWordText=true;
	CharBook.scaleFontWithCtx=true;
	CharBook.gridSize=16;
	CharBook.debug=false;
	CharBook._curFont=null;
	CharBook.charbookInst=null;
	CharBook._fontMem=0;
	CharBook._lastFont=null;
	CharBook._lastFontSz=0;
	CharBook._lastCharPage=null;
	CharBook.isWan1Wan=false;
	__static(CharBook,
	['_uint32',function(){return this._uint32=new Uint32Array(1);},'trash',function(){return this.trash=new charPageTrash(CharBook.textureWidth);}
	]);
	CharBook.__init$=function(){
		/**
		*charPageTexture的缓存管理，反正所有的贴图大小都是一致的，完全可以重复利用。
		*/
		
//class laya.webgl.resource.CharPages
var CharPages=(function(){
	function CharPages(fontFamily,bmpDataSize,marginSz){
		//private static var ctx:*=null;
		this.pages=[];
		// CharPageTexture
		this.fontFamily=null;
		this._slotW=0;
		//格子的大小
		this._gridW=0;
		//以格子为单位的宽
		this._gridNum=0;
		//public var _textureHeight:int=1024;//
		this._baseSize=0;
		//0~15=0， 16~31=1，...
		this._lastSz=0;
		this._spaceWidthMap=[];
		//空格宽度的缓存。CharRenderInfo类型。主要用了 width
		this._minScoreID=-1;
		//得分最小的page
		this._selectedSizeIdx=0;
		//限制到1~16内
		this.margin_left=0;
		//有的字体会超出边界，所以加一个外围保护
		this.margin_top=0;
		this.margin_bottom=0;
		this.margin_right=0;
		this.gcCnt=0;
		this._textureWidth=CharBook.textureWidth;
		this.fontFamily=fontFamily;
		this.margin_top=
		this.margin_left=
		this.margin_right=this.margin_bottom=marginSz;
		this._baseSize=Math.floor(bmpDataSize / CharBook.gridSize)*CharBook.gridSize;
		this._selectedSizeIdx=(bmpDataSize-this._baseSize)|0;
		this._slotW=Math.ceil(bmpDataSize / CharBook.gridSize)*CharBook.gridSize
		this._gridW=Math.floor(this._textureWidth / this._slotW);
		if (this._gridW <=0){
			console.error("文字太大,需要修改texture大小");
			debugger;
			this._gridW=1;
		}
		this._gridNum=this._gridW *this._gridW;
		console.log('gridInfo:slotW='+this._slotW+',gridw='+this._gridW+',gridNum='+this._gridNum+',textureW='+this._textureWidth);
	}

	__class(CharPages,'laya.webgl.resource.CharPages');
	var __proto=CharPages.prototype;
	__proto.getWidth=function(str){
		return CharPages.charRender.getWidth(CharBook._curFont,str);
	}

	/**
	*pages最多有16个元素，代表不同的大小的文字（偏离basesize）这个函数表示选择哪个大小
	*@param sz
	*@param extsz 扩展后的大小。
	*/
	__proto.selectSize=function(sz,extsz){
		this._selectedSizeIdx=(extsz-this._baseSize)|0;
	}

	/**
	*返回空格的宽度。通过底层获得，所以这里用了缓存。
	*@param touch
	*@return
	*/
	__proto.getSpaceChar=function(touch){
		if (this._spaceWidthMap[this._selectedSizeIdx]){
			return this._spaceWidthMap[this._selectedSizeIdx];
		};
		var ret=new CharRenderInfo();
		this._spaceWidthMap[this._selectedSizeIdx]=ret;
		ret.width=this.getWidth(' ');
		ret.isSpace=true;
		return ret;
	}

	/**
	*添加一个文字到texture
	*@param str
	*@param bold 是否加粗
	*@param touch 是否touch,如果保存起来以后再处理就设置为false
	*@param scalekey 可能有缩放
	*@return
	*/
	__proto.getChar=function(str,lineWidth,fontsize,color,strokeColor,bold,touch,scalekey){
		if (str===' ')
			return this.getSpaceChar(touch);
		var key=(lineWidth > 0?(str+'_'+lineWidth+strokeColor):str);
		var ret;
		key+=color;
		bold && (key+='B');
		scalekey && (key+=scalekey);
		for (var i=0,sz=this.pages.length;i < sz;i++){
			var cp=this.pages[i];
			var cpmap=cp.charMaps[this._selectedSizeIdx];
			if (cpmap){
				ret=cpmap.get(key);
				if (ret){
					touch && ret.touch();
					return ret;
				}
			}
		}
		ret=this._getASlot();
		if (!ret)
			return null;
		var charmaps=ret.tex.charMaps[this._selectedSizeIdx];
		(!charmaps)&& (charmaps=ret.tex.charMaps[this._selectedSizeIdx]=new Map());
		charmaps.set(key,ret);
		touch && ret.touch();
		ret.height=fontsize;
		var bmp=this.getCharBmp(str,CharBook._curFont,lineWidth,color,strokeColor,ret);
		var cy=Math.floor(ret.pos / this._gridW);
		var cx=ret.pos % this._gridW;
		var _curX=cx *this._slotW;
		var _curY=cy *this._slotW;
		var texW=this._textureWidth;
		var minx=_curX / texW;
		var miny=_curY / texW;
		var maxx=(_curX+bmp.width)/ texW;
		var maxy=(_curY+bmp.height)/ texW;
		var uv=ret.uv;
		uv[0]=minx;uv[1]=miny;
		uv[2]=maxx;uv[3]=miny;
		uv[4]=maxx;uv[5]=maxy;
		uv[6]=minx;uv[7]=maxy;
		ret.tex.addChar(bmp,_curX,_curY);
		return ret;
	}

	/**
	*从所有的page中找一个空格子
	*如果没有地方了，就创建一个新的charpageTexture
	*/
	__proto._getASlot=function(){
		var sz=this.pages.length;
		var cp;
		var ret;
		var pos=0;
		for (var i=0;i < sz;i++){
			cp=this.pages[i];
			ret=cp.findAGrid();
			if (ret){
				return ret;
			}
		}
		cp=CharBook.trash.getAPage(this._gridNum);
		this.pages.push(cp);
		ret=cp.findAGrid();
		if (!ret){
			console.error("_getASlot error!");
		}
		return ret;
	}

	//TODO:coverage
	__proto.getAllPageScore=function(){
		var i=0,sz=this.pages.length;
		var curTick=Stat.loopCount;
		var score=0;
		var minScore=10000;
		for (;i < sz;i++){
			var cp=this.pages[i];
			if (cp._scoreTick==curTick){
				score+=cp._score;
				}else {
				cp._score=0;
			}
			if (cp._score < minScore){
				minScore=cp._score;
				this._minScoreID=i;
			}
		}
		return score;
	}

	//TODO:coverage
	__proto.removeLRU=function(){
		var freed=this._gridNum *this.pages.length-this.getAllPageScore();
		if (freed>=this._gridNum){
			if (this._minScoreID >=0){
				var cp=this.pages[this._minScoreID];
				console.log('remove fontpage: delpageid='+this._minScoreID+', total='+this.pages.length+',gcCnt:'+(this.gcCnt+1));
				var used=cp._score;
				cp.printDebugInfo();
				CharBook.trash.discardPage(cp);
				this.pages[this._minScoreID]=this.pages[this.pages.length-1];
				this.pages.pop();
				var curloop=Stat.loopCount;
				var i=0,sz=this.pages.length;
				for(;i < sz && used > 0;i++){
					cp=this.pages[i];
					console.log('clean page '+i);
					var cleaned=cp.removeOld(curloop);
					used-=cleaned;
				}
			}
			this.gcCnt++;
			return true;
		}
		return false;
	}

	//TODO:coverage
	__proto.getCharBmp=function(char,font,lineWidth,colStr,strokeColStr,size){
		return CharPages.charRender.getCharBmp(char,font,lineWidth,colStr,strokeColStr,size,this.margin_left,this.margin_top,this.margin_right,this.margin_bottom);
	}

	// for debug
	__proto.printPagesInfo=function(){
		console.log('拥有页数: ',this.pages.length);
		console.log('基本大小:',this._baseSize);
		console.log('格子宽度:',this._slotW);
		console.log('每行格子数:',this._gridW);
		console.log('贴图大小:',this._textureWidth);
		console.log('    边界:',this.margin_left,this.margin_top);
		console.log('得分最少页:',this._minScoreID);
		console.log('  GC次数:',this.gcCnt);
		console.log(' -------页信息-------');
		this.pages.forEach(function(cp){
			cp.printDebugInfo(true);
		});
		console.log(' -----页信息结束-------');
	}

	CharPages.getBmpSize=function(fonstsize){
		return fonstsize *1.5;
	}

	CharPages.charRender=null;
	return CharPages;
})()


/**
*...
*@author ww
*/

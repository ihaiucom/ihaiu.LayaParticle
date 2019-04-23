//class fairygui.utils.UBBParser
var UBBParser=(function(){
	function UBBParser(){
		this._text=null;
		this._readPos=0;
		this._handlers=null;
		this.smallFontSize=12;
		this.normalFontSize=14;
		this.largeFontSize=16;
		this.defaultImgWidth=0;
		this.defaultImgHeight=0;
		this._handlers={};
		this._handlers["url"]=this.onTag_URL;
		this._handlers["img"]=this.onTag_IMG;
		this._handlers["b"]=this.onTag_Simple;
		this._handlers["i"]=this.onTag_Simple;
		this._handlers["u"]=this.onTag_Simple;
		this._handlers["sup"]=this.onTag_Simple;
		this._handlers["sub"]=this.onTag_Simple;
		this._handlers["color"]=this.onTag_COLOR;
		this._handlers["font"]=this.onTag_FONT;
		this._handlers["size"]=this.onTag_SIZE;
	}

	__class(UBBParser,'fairygui.utils.UBBParser');
	var __proto=UBBParser.prototype;
	__proto.onTag_URL=function(tagName,end,attr){
		if (!end){
			if (attr !=null)
				return "<a href=\""+attr+"\" target=\"_blank\">";
			else {
				var href=this.getTagText();
				return "<a href=\""+href+"\" target=\"_blank\">";
			}
		}
		else
		return "</a>";
	}

	__proto.onTag_IMG=function(tagName,end,attr){
		if (!end){
			var src=this.getTagText(true);
			if (!src)
				return null;
			if (this.defaultImgWidth)
				return "<img src=\""+src+"\" width=\""+this.defaultImgWidth+"\" height=\""+this.defaultImgHeight+"\"/>";
			else
			return "<img src=\""+src+"\"/>";
		}
		else
		return null;
	}

	__proto.onTag_Simple=function(tagName,end,attr){
		return end ? ("</"+tagName+">"):("<"+tagName+">");
	}

	__proto.onTag_COLOR=function(tagName,end,attr){
		if (!end)
			return "<font color=\""+attr+"\">";
		else
		return "</font>";
	}

	__proto.onTag_FONT=function(tagName,end,attr){
		if (!end)
			return "<font face=\""+attr+"\">";
		else
		return "</font>";
	}

	__proto.onTag_SIZE=function(tagName,end,attr){
		if (!end){
			if (attr=="normal")
				attr=""+this.normalFontSize;
			else if (attr=="small")
			attr=""+this.smallFontSize;
			else if (attr=="large")
			attr=""+this.largeFontSize;
			else if (attr.length && attr.charAt(0)=="+")
			attr=""+(this.smallFontSize+parseInt(attr.substr(1)));
			else if (attr.length && attr.charAt(0)=="-")
			attr=""+(this.smallFontSize-parseInt(attr.substr(1)));
			return "<font size=\""+attr+"\">";
		}
		else
		return "</font>";
	}

	__proto.getTagText=function(remove){
		(remove===void 0)&& (remove=false);
		var pos1=this._readPos;
		var pos2=0;
		var result="";
		while ((pos2=this._text.indexOf("[",pos1))!=-1){
			if (this._text.charCodeAt(pos2-1)==92){
				result+=this._text.substring(pos1,pos2-1);
				result+="[";
				pos1=pos2+1;
			}
			else{
				result+=this._text.substring(pos1,pos2);
				break ;
			}
		}
		if (pos2==-1)
			return null;
		if (remove)
			this._readPos=pos2;
		return result;
	}

	__proto.parse=function(text,remove){
		(remove===void 0)&& (remove=false);
		this._text=text;
		var pos1=0,pos2=0,pos3=0;
		var end=false;
		var tag,attr;
		var repl;
		var func;
		var result="";
		while((pos2=this._text.indexOf("[",pos1))!=-1){
			if (pos2 > 0 && this._text.charCodeAt(pos2-1)==92){
				result+=this._text.substring(pos1,pos2-1);
				result+="[";
				pos1=pos2+1;
				continue ;
			}
			result+=this._text.substring(pos1,pos2);
			pos1=pos2;
			pos2=this._text.indexOf("]",pos1);
			if(pos2==-1)
				break ;
			end=this._text.charAt(pos1+1)=='/';
			tag=this._text.substring(end?pos1+2:pos1+1,pos2);
			this._readPos=pos2+1;
			attr=null;
			repl=null;
			pos3=tag.indexOf("=");
			if(pos3!=-1){
				attr=tag.substring(pos3+1);
				tag=tag.substring(0,pos3);
			}
			tag=tag.toLowerCase();
			func=this._handlers[tag];
			if(func!=null){
				if(!remove){
					repl=func.call(this,tag,end,attr);
					if(repl!=null)
						result+=repl;
				}
			}
			else
			result+=this._text.substring(pos1,this._readPos);
			pos1=this._readPos;
		}
		if (pos1 < this._text.length)
			result+=this._text.substr(pos1);
		this._text=null;
		return result;
	}

	__static(UBBParser,
	['inst',function(){return this.inst=new UBBParser();}
	]);
	return UBBParser;
})()



//class fairygui.utils.ToolSet
var ToolSet=(function(){
	function ToolSet(){}
	__class(ToolSet,'fairygui.utils.ToolSet');
	ToolSet.getFileName=function(source){
		var i=source.lastIndexOf("/");
		if (i !=-1)
			source=source.substr(i+1);
		i=source.lastIndexOf("\\");
		if (i !=-1)
			source=source.substr(i+1);
		i=source.lastIndexOf(".");
		if (i !=-1)
			return source.substring(0,i);
		else
		return source;
	}

	ToolSet.startsWith=function(source,str,ignoreCase){
		(ignoreCase===void 0)&& (ignoreCase=false);
		if (!source)
			return false;
		else if (source.length < str.length)
		return false;
		else {
			source=source.substring(0,str.length);
			if (!ignoreCase)
				return source==str;
			else
			return source.toLowerCase()==str.toLowerCase();
		}
	}

	ToolSet.endsWith=function(source,str,ignoreCase){
		(ignoreCase===void 0)&& (ignoreCase=false);
		if (!source)
			return false;
		else if (source.length < str.length)
		return false;
		else {
			source=source.substring(source.length-str.length);
			if (!ignoreCase)
				return source==str;
			else
			return source.toLowerCase()==str.toLowerCase();
		}
	}

	ToolSet.trim=function(targetString){
		return fairygui.utils.ToolSet.trimLeft(fairygui.utils.ToolSet.trimRight(targetString));
	}

	ToolSet.trimLeft=function(targetString){
		var tempChar="";
		for (var i=0;i < targetString.length;i++){
			tempChar=targetString.charAt(i);
			if (tempChar !=" " && tempChar !="\n" && tempChar !="\r"){
				break ;
			}
		}
		return targetString.substr(i);
	}

	ToolSet.trimRight=function(targetString){
		var tempChar="";
		for (var i=targetString.length-1;i >=0;i--){
			tempChar=targetString.charAt(i);
			if (tempChar !=" " && tempChar !="\n" && tempChar !="\r"){
				break ;
			}
		}
		return targetString.substring(0,i+1);
	}

	ToolSet.convertToHtmlColor=function(argb,hasAlpha){
		(hasAlpha===void 0)&& (hasAlpha=false);
		var alpha;
		if (hasAlpha)
			alpha=(argb >> 24 & 0xFF).toString(16);
		else
		alpha="";
		var red=(argb >> 16 & 0xFF).toString(16);
		var green=(argb >> 8 & 0xFF).toString(16);
		var blue=(argb & 0xFF).toString(16);
		if (alpha.length==1)
			alpha="0"+alpha;
		if (red.length==1)
			red="0"+red;
		if (green.length==1)
			green="0"+green;
		if (blue.length==1)
			blue="0"+blue;
		return "#"+alpha+red+green+blue;
	}

	ToolSet.convertFromHtmlColor=function(str,hasAlpha){
		(hasAlpha===void 0)&& (hasAlpha=false);
		if (str.length < 1)
			return 0;
		if (str.charAt(0)=="#")
			str=str.substr(1);
		if (str.length==8)
			return (parseInt(str.substr(0,2),16)<< 24)+parseInt(str.substr(2),16);
		else if (hasAlpha)
		return 0xFF000000+parseInt(str,16);
		else
		return parseInt(str,16);
	}

	ToolSet.displayObjectToGObject=function(obj){
		while (obj !=null && !((obj instanceof laya.display.Stage ))){
			if (obj["$owner"])
				return obj["$owner"];
			obj=obj.parent;
		}
		return null;
	}

	ToolSet.encodeHTML=function(str){
		if (!str)
			return "";
		else
		return str.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;").replace("'","&apos;");
	}

	ToolSet.parseUBB=function(text){
		return fairygui.utils.ToolSet.defaultUBBParser.parse(text);
	}

	ToolSet.removeUBB=function(text){
		return fairygui.utils.ToolSet.defaultUBBParser.parse(text,true);
	}

	ToolSet.clamp=function(value,min,max){
		if(value<min)
			value=min;
		else if(value>max)
		value=max;
		return value;
	}

	ToolSet.clamp01=function(value){
		if(value>1)
			value=1;
		else if(value<0)
		value=0;
		return value;
	}

	ToolSet.lerp=function(start,end,percent){
		return (start+percent*(end-start));
	}

	__static(ToolSet,
	['defaultUBBParser',function(){return this.defaultUBBParser=new UBBParser();}
	]);
	return ToolSet;
})()



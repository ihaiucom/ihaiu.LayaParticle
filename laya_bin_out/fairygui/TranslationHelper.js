//class fairygui.TranslationHelper
var TranslationHelper=(function(){
	function TranslationHelper(){}
	__class(TranslationHelper,'fairygui.TranslationHelper');
	TranslationHelper.loadFromXML=function(source){
		TranslationHelper.strings={};
		var xml=Utils.parseXMLFromString(source);
		var resNode=TranslationHelper.findChildNode(xml,"resources");
		var nodes=resNode.childNodes;
		var length1=nodes.length;
		for (var i1=0;i1 < length1;i1++){
			var cxml=nodes[i1];
			if (cxml.nodeName=="string"){
				var key=cxml.getAttribute("name");
				var text=cxml.textContent;
				var i=key.indexOf("-");
				if(i==-1)
					continue ;
				var key2=key.substr(0,i);
				var key3=key.substr(i+1);
				var col=TranslationHelper.strings[key2];
				if(!col){
					col={};
					TranslationHelper.strings[key2]=col;
				}
				col[key3]=text;
			}
		}
	}

	TranslationHelper.translateComponent=function(item){
		if(TranslationHelper.strings==null)
			return;
		var compStrings=TranslationHelper.strings[item.owner.id+item.id];
		if(compStrings==null)
			return;
		var elementId,value;
		var buffer=item.rawData;
		var nextPos=0;
		var itemCount=0;
		var i=0,j=0,k=0;
		var dataLen=0;
		var curPos=0;
		var valueCnt=0;
		var page;
		buffer.seek(0,2);
		var childCount=buffer.getInt16();
		for (i=0;i < childCount;i++){
			dataLen=buffer.getInt16();
			curPos=buffer.pos;
			buffer.seek(curPos,0);
			var type=buffer.readByte();
			buffer.skip(4);
			elementId=buffer.readS();
			if (type==9){
				if (buffer.seek(curPos,6))
					type=buffer.readByte();
			}
			buffer.seek(curPos,1);
			if((value=compStrings[elementId+"-tips"])!=null)
				buffer.writeS(value);
			buffer.seek(curPos,2);
			var gearCnt=buffer.getInt16();
			for (j=0;j < gearCnt;j++){
				nextPos=buffer.getInt16();
				nextPos+=buffer.pos;
				if (buffer.readByte()==6){
					buffer.skip(2);
					valueCnt=buffer.getInt16();
					for (k=0;k < valueCnt;k++){
						page=buffer.readS();
						if (page !=null){
							if((value=compStrings[elementId+"-texts_"+k])!=null)
								buffer.writeS(value);
							else
							buffer.skip(2);
						}
					}
					if (buffer.readBool()&& (value=compStrings[elementId+"-texts_def"])!=null)
						buffer.writeS(value);
				}
				buffer.pos=nextPos;
			}
			switch (type){
				case 6:
				case 7:
				case 8:{
						if ((value=compStrings[elementId])!=null){
							buffer.seek(curPos,6);
							buffer.writeS(value);
						}
						if ((value=compStrings[elementId+"-prompt"])!=null){
							buffer.seek(curPos,4);
							buffer.writeS(value);
						}
						break ;
					}
				case 10:{
						buffer.seek(curPos,8);
						buffer.skip(2);
						itemCount=buffer.getInt16();
						for (j=0;j<itemCount;j++){
							nextPos=buffer.getInt16();
							nextPos+=buffer.pos;
							buffer.skip(2);
							if ((value=compStrings[elementId+"-"+j])!=null)
								buffer.writeS(value);
							else
							buffer.skip(2);
							if ((value=compStrings[elementId+"-"+j+"-0"])!=null)
								buffer.writeS(value);
							buffer.pos=nextPos;
						}
						break ;
					}
				case 11:{
						if (buffer.seek(curPos,6)&& buffer.readByte()==type){
							if ((value=compStrings[elementId])!=null)
								buffer.writeS(value);
							else
							buffer.skip(2);
							buffer.skip(2);
							if (buffer.readBool())
								buffer.skip(4);
							buffer.skip(4);
							if (buffer.readBool()&& (value=compStrings[elementId+"-prompt"])!=null)
								buffer.writeS(value);
						}
						break ;
					}
				case 12:{
						if (buffer.seek(curPos,6)&& buffer.readByte()==type){
							if ((value=compStrings[elementId])!=null)
								buffer.writeS(value);
							else
							buffer.skip(2);
							if ((value=compStrings[elementId+"-0"])!=null)
								buffer.writeS(value);
						}
						break ;
					}
				case 13:{
						if (buffer.seek(curPos,6)&& buffer.readByte()==type){
							itemCount=buffer.getInt16();
							for (j=0;j < itemCount;j++){
								nextPos=buffer.getInt16();
								nextPos+=buffer.pos;
								if ((value=compStrings[elementId+"-"+j])!=null)
									buffer.writeS(value);
								buffer.pos=nextPos;
							}
							if ((value=compStrings[elementId])!=null)
								buffer.writeS(value);
						}
						break ;
					}
				}
			buffer.pos=curPos+dataLen;
		}
	}

	TranslationHelper.findChildNode=function(xml,name){
		var col=xml.childNodes;
		var length1=col.length;
		if (length1>0){
			for (var i1=0;i1 < length1;i1++){
				var cxml=col[i1];
				if (cxml.nodeName==name){
					return cxml;
				}
			}
		}
		return null;
	}

	TranslationHelper.strings=null;
	return TranslationHelper;
})()



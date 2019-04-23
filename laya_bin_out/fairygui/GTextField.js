//class fairygui.GTextField extends fairygui.GObject
var GTextField=(function(_super){
	function GTextField(){
		this._gearColor=null;
		this._templateVars=null;
		this._text=null;
		GTextField.__super.call(this);
		this._gearColor=new GearColor(this);
	}

	__class(GTextField,'fairygui.GTextField',_super);
	var __proto=GTextField.prototype;
	Laya.imps(__proto,{"fairygui.gears.IColorGear":true})
	__proto.parseTemplate=function(template){
		var pos1=0,pos2=0,pos3=0;
		var tag;
		var value;
		var result="";
		while((pos2=template.indexOf("{",pos1))!=-1){
			if (pos2 > 0 && template.charCodeAt(pos2-1)==92){
				result+=template.substring(pos1,pos2-1);
				result+="{";
				pos1=pos2+1;
				continue ;
			}
			result+=template.substring(pos1,pos2);
			pos1=pos2;
			pos2=template.indexOf("}",pos1);
			if(pos2==-1)
				break ;
			if(pos2==pos1+1){
				result+=template.substr(pos1,2);
				pos1=pos2+1;
				continue ;
			}
			tag=template.substring(pos1+1,pos2);
			pos3=tag.indexOf("=");
			if(pos3!=-1){
				value=this._templateVars[tag.substring(0,pos3)];
				if(value==null)
					result+=tag.substring(pos3+1);
				else
				result+=value;
			}
			else{
				value=this._templateVars[tag];
				if(value!=null)
					result+=value;
			}
			pos1=pos2+1;
		}
		if (pos1 < template.length)
			result+=template.substr(pos1);
		return result;
	}

	__proto.setVar=function(name,value){
		if(!this._templateVars)
			this._templateVars={};
		this._templateVars[name]=value;
		return this;
	}

	__proto.flushVars=function(){
		this.text=this._text;
	}

	__proto.handleControllerChanged=function(c){
		_super.prototype.handleControllerChanged.call(this,c);
		if(this._gearColor.controller==c)
			this._gearColor.apply();
	}

	__proto.setup_beforeAdd=function(buffer,beginPos){
		_super.prototype.setup_beforeAdd.call(this,buffer,beginPos);
		buffer.seek(beginPos,5);
		var iv=0;
		this.font=buffer.readS();
		this.fontSize=buffer.getInt16();
		this.color=buffer.readColorS();
		iv=buffer.readByte();
		this.align=iv==0?"left":(iv==1?"center":"right");
		iv=buffer.readByte();
		this.valign=iv==0?"top":(iv==1?"middle":"bottom");
		this.leading=buffer.getInt16();
		this.letterSpacing=buffer.getInt16();
		this.ubbEnabled=buffer.readBool();
		this.autoSize=buffer.readByte();
		this.underline=buffer.readBool();
		this.italic=buffer.readBool();
		this.bold=buffer.readBool();
		this.singleLine=buffer.readBool();
		if (buffer.readBool()){
			this.strokeColor=buffer.readColorS();
			this.stroke=buffer.getFloat32()+1;
		}
		if (buffer.readBool())
			buffer.skip(12);
		if (buffer.readBool())
			this._templateVars={};
	}

	__proto.setup_afterAdd=function(buffer,beginPos){
		_super.prototype.setup_afterAdd.call(this,buffer,beginPos);
		buffer.seek(beginPos,6);
		var str=buffer.readS();
		if (str !=null)
			this.text=str;
	}

	__getset(0,__proto,'color',function(){
		return null;
		},function(value){
	});

	__getset(0,__proto,'font',function(){
		return null;
		},function(value){
	});

	__getset(0,__proto,'templateVars',function(){
		return this._templateVars;
		},function(value){
		if(this._templateVars==null && value==null)
			return;
		this._templateVars=value;
		this.flushVars();
	});

	__getset(0,__proto,'leading',function(){
		return 0;
		},function(value){
	});

	__getset(0,__proto,'fontSize',function(){
		return 0;
		},function(value){
	});

	__getset(0,__proto,'bold',function(){
		return false;
		},function(value){
	});

	__getset(0,__proto,'letterSpacing',function(){
		return 0;
		},function(value){
	});

	__getset(0,__proto,'align',function(){
		return null;
		},function(value){
	});

	__getset(0,__proto,'valign',function(){
		return null;
		},function(value){
	});

	__getset(0,__proto,'italic',function(){
		return false;
		},function(value){
	});

	__getset(0,__proto,'underline',function(){
		return false;
		},function(value){
	});

	__getset(0,__proto,'singleLine',function(){
		return false;
		},function(value){
	});

	__getset(0,__proto,'stroke',function(){
		return 0;
		},function(value){
	});

	__getset(0,__proto,'strokeColor',function(){
		return null;
		},function(value){
	});

	__getset(0,__proto,'ubbEnabled',function(){
		return false;
		},function(value){
	});

	/**
	*@see AutoSizeType
	*/
	/**
	*@see AutoSizeType
	*/
	__getset(0,__proto,'autoSize',function(){
		return 0;
		},function(value){
	});

	__getset(0,__proto,'textWidth',function(){
		return 0;
	});

	return GTextField;
})(GObject)



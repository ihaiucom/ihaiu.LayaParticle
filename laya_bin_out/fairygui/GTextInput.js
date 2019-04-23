//class fairygui.GTextInput extends fairygui.GTextField
var GTextInput=(function(_super){
	function GTextInput(){
		this.input=null;
		GTextInput.__super.call(this);
	}

	__class(GTextInput,'fairygui.GTextInput',_super);
	var __proto=GTextInput.prototype;
	__proto.createDisplayObject=function(){
		this._displayObject=this.input=new Input();
		this._displayObject.mouseEnabled=true;
		this._displayObject["$owner"]=this;
	}

	__proto.handleSizeChanged=function(){
		this.input.size(this.width,this.height);
	}

	__proto.setup_beforeAdd=function(buffer,beginPos){
		_super.prototype.setup_beforeAdd.call(this,buffer,beginPos);
		buffer.seek(beginPos,4);
		var str=buffer.readS();
		if (str !=null)
			this.promptText=str;
		str=buffer.readS();
		if (str !=null)
			this.input.restrict=str;
		var iv=buffer.getInt32();
		if (iv !=0)
			this.input.maxChars=iv;
		iv=buffer.getInt32();
		if (iv !=0){
			if(iv==4)
				this.keyboardType="number";
			else if(iv==3)
			this.keyboardType="url";
		}
		if (buffer.readBool())
			this.password=true;
	}

	__getset(0,__proto,'bold',function(){
		return this.input.bold;
		},function(value){
		this.input.bold=value;
	});

	__getset(0,__proto,'align',function(){
		return this.input.align;
		},function(value){
		this.input.align=value;
	});

	__getset(0,__proto,'text',function(){
		return this.input.text;
		},function(value){
		this.input.text=value;
	});

	__getset(0,__proto,'password',function(){
		return this.input.type=="password";
		},function(value){
		if (value)
			this.input.type="password";
		else
		this.input.type="text";
	});

	__getset(0,__proto,'color',function(){
		return this.input.color;
		},function(value){
		this.input.color=value;
	});

	__getset(0,__proto,'font',function(){
		return this.input.font;
		},function(value){
		this.input.font=value;
	});

	__getset(0,__proto,'leading',function(){
		return this.input.leading;
		},function(value){
		this.input.leading=value;
	});

	__getset(0,__proto,'maxLength',function(){
		return this.input.maxChars;
		},function(value){
		this.input.maxChars=value;
	});

	__getset(0,__proto,'fontSize',function(){
		return this.input.fontSize;
		},function(value){
		this.input.fontSize=value;
	});

	__getset(0,__proto,'valign',function(){
		return this.input.valign;
		},function(value){
		this.input.valign=value;
	});

	__getset(0,__proto,'italic',function(){
		return this.input.italic;
		},function(value){
		this.input.italic=value;
	});

	__getset(0,__proto,'singleLine',function(){
		return !this.input.multiline;
		},function(value){
		this.input.multiline=!value;
	});

	__getset(0,__proto,'stroke',function(){
		return this.input.stroke;
		},function(value){
		this.input.stroke=value;
	});

	__getset(0,__proto,'strokeColor',function(){
		return this.input.strokeColor;
		},function(value){
		this.input.strokeColor=value;
		this.updateGear(4);
	});

	__getset(0,__proto,'keyboardType',function(){
		return this.input.type;
		},function(value){
		this.input.type=value;
	});

	__getset(0,__proto,'editable',function(){
		return this.input.editable;
		},function(value){
		this.input.editable=value;
	});

	__getset(0,__proto,'promptText',function(){
		return this.input.prompt;
		},function(value){
		this.input.prompt=value;
	});

	__getset(0,__proto,'restrict',function(){
		return this.input.restrict;
		},function(value){
		this.input.restrict=value;
	});

	__getset(0,__proto,'textWidth',function(){
		return this.input.textWidth;
	});

	return GTextInput;
})(GTextField)



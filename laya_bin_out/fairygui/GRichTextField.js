//class fairygui.GRichTextField extends fairygui.GTextField
var GRichTextField=(function(_super){
	function GRichTextField(){
		this.div=null;
		this._ubbEnabled=false;
		this._color=null;
		GRichTextField.__super.call(this);
		this._text="";
	}

	__class(GRichTextField,'fairygui.GRichTextField',_super);
	var __proto=GRichTextField.prototype;
	__proto.createDisplayObject=function(){
		this._displayObject=this.div=new HTMLDivElement();
		this._displayObject.mouseEnabled=true;
		this._displayObject["$owner"]=this;
	}

	__proto.handleSizeChanged=function(){
		this.div.size(this.width,this.height);
	}

	__getset(0,__proto,'bold',function(){
		return this.div.style.bold;
		},function(value){
		this.div.style.bold=value;
	});

	__getset(0,__proto,'align',function(){
		return this.div.style.align;
		},function(value){
		this.div.style.align=value;
	});

	__getset(0,__proto,'text',function(){
		return this._text;
		},function(value){
			
		this._text=value;
		var text2=this._text;
		if (this._templateVars !=null)
			text2=this.parseTemplate(text2);
		if(this._ubbEnabled)
			this.div.innerHTML=ToolSet.parseUBB(text2);
		else
		this.div.innerHTML=text2;
	});

	__getset(0,__proto,'color',function(){
		return this._color;
		},function(value){
		if (this._color !=value){
			this._color=value;
			this.div.style.color=value;
			if (this._gearColor.controller)
				this._gearColor.updateState();
		}
	});

	__getset(0,__proto,'font',function(){
		return this.div.style.font;
		},function(value){
		if(value)
			this.div.style.font=value;
		else
		this.div.style.font=UIConfig$1.defaultFont;
	});

	__getset(0,__proto,'leading',function(){
		return this.div.style.leading;
		},function(value){
		this.div.style.leading=value;
	});

	__getset(0,__proto,'fontSize',function(){
		return this.div.style.fontSize;
		},function(value){
		this.div.style.fontSize=value;
	});

	__getset(0,__proto,'valign',function(){
		return this.div.style.valign;
		},function(value){
		this.div.style.valign=value;
	});

	__getset(0,__proto,'italic',function(){
		return this.div.style.italic;
		},function(value){
		this.div.style.italic=value;
	});

	__getset(0,__proto,'stroke',function(){
		return this.div.style.stroke;
		},function(value){
		this.div.style.stroke=value;
	});

	__getset(0,__proto,'strokeColor',function(){
		return this.div.style.strokeColor;
		},function(value){
		this.div.style.strokeColor=value;
		this.updateGear(4);
	});

	__getset(0,__proto,'ubbEnabled',function(){
		return this._ubbEnabled;
		},function(value){
		this._ubbEnabled=value;
	});

	return GRichTextField;
})(GTextField)



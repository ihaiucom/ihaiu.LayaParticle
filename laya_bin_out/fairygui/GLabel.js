//class fairygui.GLabel extends fairygui.GComponent
var GLabel=(function(_super){
	function GLabel(){
		this._titleObject=null;
		this._iconObject=null;
		GLabel.__super.call(this);
	}

	__class(GLabel,'fairygui.GLabel',_super);
	var __proto=GLabel.prototype;
	Laya.imps(__proto,{"fairygui.gears.IColorGear":true})
	__proto.getTextField=function(){
		if ((this._titleObject instanceof fairygui.GTextField ))
			return this._titleObject;
		else if ((this._titleObject instanceof fairygui.GLabel ))
		return (this._titleObject).getTextField();
		else if ((this._titleObject instanceof fairygui.GButton ))
		return (this._titleObject).getTextField();
		else
		return null;
	}

	__proto.constructExtension=function(buffer){
		this._titleObject=this.getChild("title");
		this._iconObject=this.getChild("icon");
	}

	__proto.setup_afterAdd=function(buffer,beginPos){
		_super.prototype.setup_afterAdd.call(this,buffer,beginPos);
		if (!buffer.seek(beginPos,6))
			return;
		if (buffer.readByte()!=this.packageItem.objectType)
			return;
		var str;
		str=buffer.readS();
		if (str !=null)
			this.title=str;
		str=buffer.readS();
		if (str !=null)
			this.icon=str;
		if (buffer.readBool())
			this.titleColor=buffer.readColorS();
		var iv=buffer.getInt32();
		if (iv !=0)
			this.titleFontSize=iv;
		if (buffer.readBool()){
			var input=this.getTextField();
			if (input !=null){
				str=buffer.readS();
				if (str !=null)
					input.promptText=str;
				str=buffer.readS();
				if (str !=null)
					input.restrict=str;
				iv=buffer.getInt32();
				if (iv !=0)
					input.maxLength=iv;
				iv=buffer.getInt32();
				if (iv !=0){
					if(iv==4)
						input.keyboardType="number";
					else if(iv==3)
					input.keyboardType="url";
				}
				if (buffer.readBool())
					input.password=true;
			}
			else
			buffer.skip(13);
		}
	}

	__getset(0,__proto,'color',function(){
		return this.titleColor;
		},function(value){
		this.titleColor=value;
	});

	__getset(0,__proto,'icon',function(){
		if(this._iconObject!=null)
			return this._iconObject.icon;
		else
		return null;
		},function(value){
		if(this._iconObject!=null)
			this._iconObject.icon=value;
		this.updateGear(7);
	});

	__getset(0,__proto,'editable',function(){
		if (this._titleObject && ((this._titleObject instanceof fairygui.GTextInput )))
			return this._titleObject.asTextInput.editable;
		else
		return false;
		},function(val){
		if (this._titleObject)
			this._titleObject.asTextInput.editable=val;
	});

	__getset(0,__proto,'title',function(){
		if (this._titleObject)
			return this._titleObject.text;
		else
		return null;
		},function(value){
		if (this._titleObject)
			this._titleObject.text=value;
		this.updateGear(6);
	});

	__getset(0,__proto,'text',function(){
		return this.title;
		},function(value){
		this.title=value;
	});

	__getset(0,__proto,'titleColor',function(){
		var tf=this.getTextField();
		if(tf!=null)
			return tf.color;
		else
		return "#000000";
		},function(value){
		var tf=this.getTextField();
		if(tf!=null)
			tf.color=value;
		this.updateGear(4);
	});

	__getset(0,__proto,'titleFontSize',function(){
		var tf=this.getTextField();
		if(tf!=null)
			return tf.fontSize;
		else
		return 0;
		},function(value){
		var tf=this.getTextField();
		if(tf!=null)
			tf.fontSize=value;
	});

	return GLabel;
})(GComponent)



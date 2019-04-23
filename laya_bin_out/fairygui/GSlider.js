//class fairygui.GSlider extends fairygui.GComponent
var GSlider=(function(_super){
	function GSlider(){
		this._max=0;
		this._value=0;
		this._titleType=0;
		this._reverse=false;
		this._titleObject=null;
		this._barObjectH=null;
		this._barObjectV=null;
		this._barMaxWidth=0;
		this._barMaxHeight=0;
		this._barMaxWidthDelta=0;
		this._barMaxHeightDelta=0;
		this._gripObject=null;
		this._clickPos=null;
		this._clickPercent=0;
		this._barStartX=0;
		this._barStartY=0;
		this.changeOnClick=true;
		/**是否可拖动开关**/
		this.canDrag=true;
		GSlider.__super.call(this);
		this._titleType=0;
		this._value=50;
		this._max=100;
		this._clickPos=new laya.maths.Point();
	}

	__class(GSlider,'fairygui.GSlider',_super);
	var __proto=GSlider.prototype;
	__proto.update=function(){
		var percent=Math.min(this._value / this._max,1);
		this.updateWidthPercent(percent);
	}

	__proto.updateWidthPercent=function(percent){
		if (this._titleObject){
			switch (this._titleType){
				case 0:
					this._titleObject.text=Math.round(percent *100)+"%";
					break ;
				case 1:
					this._titleObject.text=this._value+"/"+this._max;
					break ;
				case 2:
					this._titleObject.text=""+this._value;
					break ;
				case 3:
					this._titleObject.text=""+this._max;
					break ;
				}
		};
		var fullWidth=this.width-this._barMaxWidthDelta;
		var fullHeight=this.height-this._barMaxHeightDelta;
		if(!this._reverse){
			if(this._barObjectH)
				this._barObjectH.width=Math.round(fullWidth*percent);
			if(this._barObjectV)
				this._barObjectV.height=Math.round(fullHeight*percent);
		}
		else{
			if(this._barObjectH){
				this._barObjectH.width=Math.round(fullWidth*percent);
				this._barObjectH.x=this._barStartX+(fullWidth-this._barObjectH.width);
			}
			if(this._barObjectV){
				this._barObjectV.height=Math.round(fullHeight*percent);
				this._barObjectV.y=this._barStartY+(fullHeight-this._barObjectV.height);
			}
		}
	}

	__proto.constructExtension=function(buffer){
		buffer.seek(0,6);
		this._titleType=buffer.readByte();
		this._reverse=buffer.readBool();
		this._titleObject=(this.getChild("title"));
		this._barObjectH=this.getChild("bar");
		this._barObjectV=this.getChild("bar_v");
		this._gripObject=this.getChild("grip");
		if(this._barObjectH){
			this._barMaxWidth=this._barObjectH.width;
			this._barMaxWidthDelta=this.width-this._barMaxWidth;
			this._barStartX=this._barObjectH.x;
		}
		if(this._barObjectV){
			this._barMaxHeight=this._barObjectV.height;
			this._barMaxHeightDelta=this.height-this._barMaxHeight;
			this._barStartY=this._barObjectV.y;
		}
		if(this._gripObject){
			this._gripObject.on("mousedown",this,this.__gripMouseDown);
		}
		this.displayObject.on("mousedown",this,this.__barMouseDown);
	}

	__proto.handleSizeChanged=function(){
		_super.prototype.handleSizeChanged.call(this);
		if(this._barObjectH)
			this._barMaxWidth=this.width-this._barMaxWidthDelta;
		if(this._barObjectV)
			this._barMaxHeight=this.height-this._barMaxHeightDelta;
		if(!this._underConstruct)
			this.update();
	}

	__proto.setup_afterAdd=function(buffer,beginPos){
		_super.prototype.setup_afterAdd.call(this,buffer,beginPos);
		if (!buffer.seek(beginPos,6)){
			this.update();
			return;
		}
		if (buffer.readByte()!=this.packageItem.objectType){
			this.update();
			return;
		}
		this._value=buffer.getInt32();
		this._max=buffer.getInt32();
		this.update();
	}

	__proto.__gripMouseDown=function(evt){
		this.canDrag=true;
		evt.stopPropagation();
		this._clickPos=this.globalToLocal(Laya.stage.mouseX,Laya.stage.mouseY);
		this._clickPercent=this._value / this._max;
		Laya.stage.on("mousemove",this,this.__gripMouseMove);
		Laya.stage.on("mouseup",this,this.__gripMouseUp);
	}

	__proto.__gripMouseMove=function(evt){
		if(!this.canDrag){
			return;
		};
		var pt=this.globalToLocal(Laya.stage.mouseX,Laya.stage.mouseY,fairygui.GSlider.sSilderHelperPoint);
		var deltaX=pt.x-this._clickPos.x;
		var deltaY=pt.y-this._clickPos.y;
		if(this._reverse){
			deltaX=-deltaX;
			deltaY=-deltaY;
		};
		var percent=NaN;
		if (this._barObjectH)
			percent=this._clickPercent+deltaX / this._barMaxWidth;
		else
		percent=this._clickPercent+deltaY / this._barMaxHeight;
		if (percent > 1)
			percent=1;
		else if (percent < 0)
		percent=0;
		var newValue=Math.round(this._max *percent);
		if (newValue !=this._value){
			this._value=newValue;
			Events.dispatch("fui_state_changed",this.displayObject,evt);
		}
		this.updateWidthPercent(percent);
	}

	__proto.__gripMouseUp=function(evt){
		Laya.stage.off("mousemove",this,this.__gripMouseMove);
		Laya.stage.off("mouseup",this,this.__gripMouseUp);
	}

	__proto.__barMouseDown=function(evt){
		if(!this.changeOnClick)
			return;
		var pt=this._gripObject.globalToLocal(evt.stageX,evt.stageY,fairygui.GSlider.sSilderHelperPoint);
		var percent=this._value/this._max;
		var delta=NaN;
		if(this._barObjectH)
			delta=(pt.x-this._gripObject.width/2)/this._barMaxWidth;
		if(this._barObjectV)
			delta=(pt.y-this._gripObject.height/2)/this._barMaxHeight;
		if(this._reverse)
			percent-=delta;
		else
		percent+=delta;
		if(percent>1)
			percent=1;
		else if(percent<0)
		percent=0;
		var newValue=Math.round(this._max*percent);
		if(newValue!=this._value){
			this._value=newValue;
			Events.dispatch("fui_state_changed",this.displayObject,evt);
		}
		this.updateWidthPercent(percent);
	}

	__getset(0,__proto,'max',function(){
		return this._max;
		},function(value){
		if (this._max !=value){
			this._max=value;
			this.update();
		}
	});

	/**
	*@see ProgressTitleType
	*/
	/**
	*@see ProgressTitleType
	*/
	__getset(0,__proto,'titleType',function(){
		return this._titleType;
		},function(value){
		this._titleType=value;
	});

	__getset(0,__proto,'value',function(){
		return this._value;
		},function(value){
		if (this._value !=value){
			this._value=value;
			this.update();
		}
	});

	__static(GSlider,
	['sSilderHelperPoint',function(){return this.sSilderHelperPoint=new Point();}
	]);
	return GSlider;
})(GComponent)



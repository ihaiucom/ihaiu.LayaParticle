//class fairygui.GProgressBar extends fairygui.GComponent
var GProgressBar=(function(_super){
	function GProgressBar(){
		this._max=0;
		this._value=0;
		this._titleType=0;
		this._reverse=false;
		this._titleObject=null;
		this._aniObject=null;
		this._barObjectH=null;
		this._barObjectV=null;
		this._barMaxWidth=0;
		this._barMaxHeight=0;
		this._barMaxWidthDelta=0;
		this._barMaxHeightDelta=0;
		this._barStartX=0;
		this._barStartY=0;
		this._tweening=false;
		GProgressBar.__super.call(this);
		this._titleType=0;
		this._value=50;
		this._max=100;
	}

	__class(GProgressBar,'fairygui.GProgressBar',_super);
	var __proto=GProgressBar.prototype;
	__proto.tweenValue=function(value,duration){
		var _$this=this;
		if(this._value !=value){
			if(this._tweening){
				GTween.kill(this,false,this.update);
				this._tweening=false;
			};
			var oldValule=this._value;
			this._value=value;
			this._tweening=true;
			return GTween.to(oldValule,this._value,duration).setTarget(this,this.update).setEase(0)
			.onComplete(function(){_$this._tweening=false;},this);
		}
		else
		return null;
	}

	__proto.update=function(newValue){
		var percent=this._max!=0?Math.min(newValue / this._max,1):0;
		if(this._titleObject){
			switch(this._titleType){
				case 0:
					this._titleObject.text=Math.round(percent *100)+"%";
					break ;
				case 1:
					this._titleObject.text=Math.round(newValue)+"/"+Math.round(this._max);
					break ;
				case 2:
					this._titleObject.text=""+Math.round(newValue);
					break ;
				case 3:
					this._titleObject.text=""+Math.round(this._max);
					break ;
				}
		};
		var fullWidth=this.width-this._barMaxWidthDelta;
		var fullHeight=this.height-this._barMaxHeightDelta;
		if(!this._reverse){
			if(this._barObjectH){
				if (((this._barObjectH instanceof fairygui.GImage ))&& (this._barObjectH).fillMethod !=0)
					(this._barObjectH).fillAmount=percent;
				else
				this._barObjectH.width=Math.round(fullWidth *percent);
			}
			if(this._barObjectV){
				if (((this._barObjectV instanceof fairygui.GImage ))&& (this._barObjectV).fillMethod !=0)
					(this._barObjectV).fillAmount=percent;
				else
				this._barObjectV.height=Math.round(fullHeight *percent);
			}
		}
		else {
			if(this._barObjectH){
				if (((this._barObjectH instanceof fairygui.GImage ))&& (this._barObjectH).fillMethod !=0)
					(this._barObjectH).fillAmount=1-percent;
				else{
					this._barObjectH.width=Math.round(fullWidth *percent);
					this._barObjectH.x=this._barStartX+(fullWidth-this._barObjectH.width);
				}
			}
			if(this._barObjectV){
				if (((this._barObjectV instanceof fairygui.GImage ))&& (this._barObjectV).fillMethod !=0)
					(this._barObjectV).fillAmount=1-percent;
				else{
					this._barObjectV.height=Math.round(fullHeight *percent);
					this._barObjectV.y=this._barStartY+(fullHeight-this._barObjectV.height);
				}
			}
		}
		if((this._aniObject instanceof fairygui.GMovieClip ))
			(this._aniObject).frame=Math.round(percent *100);
	}

	__proto.constructExtension=function(buffer){
		buffer.seek(0,6);
		this._titleType=buffer.readByte();
		this._reverse=buffer.readBool();
		this._titleObject=(this.getChild("title"));
		this._barObjectH=this.getChild("bar");
		this._barObjectV=this.getChild("bar_v");
		this._aniObject=this.getChild("ani");
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
	}

	__proto.handleSizeChanged=function(){
		_super.prototype.handleSizeChanged.call(this);
		if(this._barObjectH)
			this._barMaxWidth=this.width-this._barMaxWidthDelta;
		if(this._barObjectV)
			this._barMaxHeight=this.height-this._barMaxHeightDelta;
		if(!this._underConstruct)
			this.update(this._value);
	}

	__proto.setup_afterAdd=function(buffer,beginPos){
		_super.prototype.setup_afterAdd.call(this,buffer,beginPos);
		if (!buffer.seek(beginPos,6)){
			this.update(this._value);
			return;
		}
		if (buffer.readByte()!=this.packageItem.objectType){
			this.update(this._value);
			return;
		}
		this._value=buffer.getInt32();
		this._max=buffer.getInt32();
		this.update(this._value);
	}

	__proto.dispose=function(){
		if(this._tweening)
			GTween.kill(this);
		_super.prototype.dispose.call(this);
	}

	__getset(0,__proto,'max',function(){
		return this._max;
		},function(value){
		if(this._max !=value){
			this._max=value;
			this.update(this._value);
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
		if(this._titleType !=value){
			this._titleType=value;
			this.update(this._value);
		}
	});

	__getset(0,__proto,'value',function(){
		return this._value;
		},function(value){
		if(this._tweening){
			GTween.kill(this,true,this.update);
			this._tweening=false;
		}
		if(this._value !=value){
			this._value=value;
			this.update(this._value);
		}
	});

	return GProgressBar;
})(GComponent)



//class fairygui.RelationItem
var RelationItem=(function(){
	var RelationDef;
	function RelationItem(owner){
		this._owner=null;
		this._target=null;
		this._defs=null;
		this._targetX=NaN;
		this._targetY=NaN;
		this._targetWidth=NaN;
		this._targetHeight=NaN;
		this._owner=owner;
		this._defs=[];
	}

	__class(RelationItem,'fairygui.RelationItem');
	var __proto=RelationItem.prototype;
	__proto.add=function(relationType,usePercent){
		if (relationType==24){
			this.add(14,usePercent);
			this.add(15,usePercent);
			return;
		};
		var cnt=this._defs.length;
		for(var i=0;i<cnt;i++){
			if (this._defs[i].type==relationType)
				return;
		}
		this.internalAdd(relationType,usePercent);
	}

	__proto.internalAdd=function(relationType,usePercent){
		if (relationType==24){
			this.internalAdd(14,usePercent);
			this.internalAdd(15,usePercent);
			return;
		};
		var info=new RelationDef();
		info.percent=usePercent;
		info.type=relationType;
		info.axis=(relationType <=6 || relationType==14 || relationType >=16 && relationType <=19)? 0 :1;
		this._defs.push(info);
		if (usePercent || relationType==1 || relationType==3 || relationType==5
			|| relationType==8 || relationType==10 || relationType==12)
		this._owner.pixelSnapping=true;
	}

	__proto.remove=function(relationType){
		if (relationType==24){
			this.remove(14);
			this.remove(15);
			return;
		};
		var dc=this._defs.length;
		for (var k=0;k < dc;k++){
			if (this._defs[k].type==relationType){
				this._defs.splice(k,1);
				break ;
			}
		}
	}

	__proto.copyFrom=function(source){
		this.target=source.target;
		this._defs.length=0;
		var cnt=source._defs.length;
		for(var i=0;i<cnt;i++){
			var info=source._defs[i];
			var info2=new RelationDef();
			info2.copyFrom(info);
			this._defs.push(info2);
		}
	}

	__proto.dispose=function(){
		if (this._target !=null){
			this.releaseRefTarget(this._target);
			this._target=null;
		}
	}

	__proto.applyOnSelfResized=function(dWidth,dHeight,applyPivot){
		var cnt=this._defs.length;
		if(cnt==0)
			return;
		var ox=this._owner.x;
		var oy=this._owner.y;
		for (var i=0;i < cnt;i++){
			var info=this._defs[i];
			switch (info.type){
				case 3:
					this._owner.x-=(0.5-(applyPivot ? this._owner.pivotX :0))*dWidth;
					break ;
				case 5:
				case 4:
				case 6:
					this._owner.x-=(1-(applyPivot ? this._owner.pivotX :0))*dWidth;
					break ;
				case 10:
					this._owner.y-=(0.5-(applyPivot ? this._owner.pivotY :0))*dHeight;
					break ;
				case 12:
				case 11:
				case 13:
					this._owner.y-=(1-(applyPivot ? this._owner.pivotY :0))*dHeight;
					break ;
				}
		}
		if (ox!=this._owner.x || oy!=this._owner.y){
			ox=this._owner.x-ox;
			oy=this._owner.y-oy;
			this._owner.updateGearFromRelations(1,ox,oy);
			if (this._owner.parent !=null && this._owner.parent._transitions.length > 0){
				cnt=this._owner.parent._transitions.length;
				for(var j=0;j<cnt;j++){
					var trans=this._owner.parent._transitions[j];
					trans.updateFromRelations(this._owner.id,ox,oy);
				}
			}
		}
	}

	__proto.applyOnXYChanged=function(info,dx,dy){
		var tmp=NaN;
		switch (info.type){
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
				this._owner.x+=dx;
				break ;
			case 7:
			case 8:
			case 9:
			case 10:
			case 11:
			case 12:
			case 13:
				this._owner.y+=dy;
				break ;
			case 14:
			case 15:
				break ;
			case 16:
			case 17:
				tmp=this._owner.xMin;
				this._owner.width=this._owner._rawWidth-dx;
				this._owner.xMin=tmp+dx;
				break ;
			case 18:
			case 19:
				tmp=this._owner.xMin;
				this._owner.width=this._owner._rawWidth+dx;
				this._owner.xMin=tmp;
				break ;
			case 20:
			case 21:
				tmp=this._owner.yMin;
				this._owner.height=this._owner._rawHeight-dy;
				this._owner.yMin=tmp+dy;
				break ;
			case 22:
			case 23:
				tmp=this._owner.yMin;
				this._owner.height=this._owner._rawHeight+dy;
				this._owner.yMin=tmp;
				break ;
			}
	}

	__proto.applyOnSizeChanged=function(info){
		var pos=0,pivot=0,delta=0;
		var v=NaN,tmp=NaN;
		if (info.axis==0){
			if (this._target !=this._owner.parent){
				pos=this._target.x;
				if (this._target.pivotAsAnchor)
					pivot=this._target.pivotX;
			}
			if (info.percent){
				if (this._targetWidth !=0)
					delta=this._target._width / this._targetWidth;
			}
			else
			delta=this._target._width-this._targetWidth;
		}
		else{
			if (this._target !=this._owner.parent){
				pos=this._target.y;
				if (this._target.pivotAsAnchor)
					pivot=this._target.pivotY;
			}
			if (info.percent){
				if (this._targetHeight !=0)
					delta=this._target._height / this._targetHeight;
			}
			else
			delta=this._target._height-this._targetHeight;
		}
		switch (info.type){
			case 0:
				if (info.percent)
					this._owner.xMin=pos+(this._owner.xMin-pos)*delta;
				else if (pivot !=0)
				this._owner.x+=delta *(-pivot);
				break ;
			case 1:
				if (info.percent)
					this._owner.xMin=pos+(this._owner.xMin-pos)*delta;
				else
				this._owner.x+=delta *(0.5-pivot);
				break ;
			case 2:
				if (info.percent)
					this._owner.xMin=pos+(this._owner.xMin-pos)*delta;
				else
				this._owner.x+=delta *(1-pivot);
				break ;
			case 3:
				if (info.percent)
					this._owner.xMin=pos+(this._owner.xMin+this._owner._rawWidth *0.5-pos)*delta-this._owner._rawWidth *0.5;
				else
				this._owner.x+=delta *(0.5-pivot);
				break ;
			case 4:
				if (info.percent)
					this._owner.xMin=pos+(this._owner.xMin+this._owner._rawWidth-pos)*delta-this._owner._rawWidth;
				else if (pivot !=0)
				this._owner.x+=delta *(-pivot);
				break ;
			case 5:
				if (info.percent)
					this._owner.xMin=pos+(this._owner.xMin+this._owner._rawWidth-pos)*delta-this._owner._rawWidth;
				else
				this._owner.x+=delta *(0.5-pivot);
				break ;
			case 6:
				if (info.percent)
					this._owner.xMin=pos+(this._owner.xMin+this._owner._rawWidth-pos)*delta-this._owner._rawWidth;
				else
				this._owner.x+=delta *(1-pivot);
				break ;
			case 7:
				if (info.percent)
					this._owner.yMin=pos+(this._owner.yMin-pos)*delta;
				else if (pivot !=0)
				this._owner.y+=delta *(-pivot);
				break ;
			case 8:
				if (info.percent)
					this._owner.yMin=pos+(this._owner.yMin-pos)*delta;
				else
				this._owner.y+=delta *(0.5-pivot);
				break ;
			case 9:
				if (info.percent)
					this._owner.yMin=pos+(this._owner.yMin-pos)*delta;
				else
				this._owner.y+=delta *(1-pivot);
				break ;
			case 10:
				if (info.percent)
					this._owner.yMin=pos+(this._owner.yMin+this._owner._rawHeight *0.5-pos)*delta-this._owner._rawHeight *0.5;
				else
				this._owner.y+=delta *(0.5-pivot);
				break ;
			case 11:
				if (info.percent)
					this._owner.yMin=pos+(this._owner.yMin+this._owner._rawHeight-pos)*delta-this._owner._rawHeight;
				else if (pivot !=0)
				this._owner.y+=delta *(-pivot);
				break ;
			case 12:
				if (info.percent)
					this._owner.yMin=pos+(this._owner.yMin+this._owner._rawHeight-pos)*delta-this._owner._rawHeight;
				else
				this._owner.y+=delta *(0.5-pivot);
				break ;
			case 13:
				if (info.percent)
					this._owner.yMin=pos+(this._owner.yMin+this._owner._rawHeight-pos)*delta-this._owner._rawHeight;
				else
				this._owner.y+=delta *(1-pivot);
				break ;
			case 14:
				if (this._owner._underConstruct && this._owner==this._target.parent)
					v=this._owner.sourceWidth-this._target.initWidth;
				else
				v=this._owner._rawWidth-this._targetWidth;
				if (info.percent)
					v=v *delta;
				if (this._target==this._owner.parent){
					if (this._owner.pivotAsAnchor){
						tmp=this._owner.xMin;
						this._owner.setSize(this._target._width+v,this._owner._rawHeight,true);
						this._owner.xMin=tmp;
					}
					else
					this._owner.setSize(this._target._width+v,this._owner._rawHeight,true);
				}
				else
				this._owner.width=this._target._width+v;
				break ;
			case 15:
				if (this._owner._underConstruct && this._owner==this._target.parent)
					v=this._owner.sourceHeight-this._target.initHeight;
				else
				v=this._owner._rawHeight-this._targetHeight;
				if (info.percent)
					v=v *delta;
				if (this._target==this._owner.parent){
					if (this._owner.pivotAsAnchor){
						tmp=this._owner.yMin;
						this._owner.setSize(this._owner._rawWidth,this._target._height+v,true);
						this._owner.yMin=tmp;
					}
					else
					this._owner.setSize(this._owner._rawWidth,this._target._height+v,true);
				}
				else
				this._owner.height=this._target._height+v;
				break ;
			case 16:
				tmp=this._owner.xMin;
				if (info.percent)
					v=pos+(tmp-pos)*delta-tmp;
				else
				v=delta *(-pivot);
				this._owner.width=this._owner._rawWidth-v;
				this._owner.xMin=tmp+v;
				break ;
			case 17:
				tmp=this._owner.xMin;
				if (info.percent)
					v=pos+(tmp-pos)*delta-tmp;
				else
				v=delta *(1-pivot);
				this._owner.width=this._owner._rawWidth-v;
				this._owner.xMin=tmp+v;
				break ;
			case 18:
				tmp=this._owner.xMin;
				if (info.percent)
					v=pos+(tmp+this._owner._rawWidth-pos)*delta-(tmp+this._owner._rawWidth);
				else
				v=delta *(-pivot);
				this._owner.width=this._owner._rawWidth+v;
				this._owner.xMin=tmp;
				break ;
			case 19:
				tmp=this._owner.xMin;
				if (info.percent){
					if (this._owner==this._target.parent){
						if (this._owner._underConstruct)
							this._owner.width=pos+this._target._width-this._target._width *pivot+
						(this._owner.sourceWidth-pos-this._target.initWidth+this._target.initWidth *pivot)*delta;
						else
						this._owner.width=pos+(this._owner._rawWidth-pos)*delta;
					}
					else{
						v=pos+(tmp+this._owner._rawWidth-pos)*delta-(tmp+this._owner._rawWidth);
						this._owner.width=this._owner._rawWidth+v;
						this._owner.xMin=tmp;
					}
				}
				else{
					if (this._owner==this._target.parent){
						if (this._owner._underConstruct)
							this._owner.width=this._owner.sourceWidth+(this._target._width-this._target.initWidth)*(1-pivot);
						else
						this._owner.width=this._owner._rawWidth+delta *(1-pivot);
					}
					else{
						v=delta *(1-pivot);
						this._owner.width=this._owner._rawWidth+v;
						this._owner.xMin=tmp;
					}
				}
				break ;
			case 20:
				tmp=this._owner.yMin;
				if (info.percent)
					v=pos+(tmp-pos)*delta-tmp;
				else
				v=delta *(-pivot);
				this._owner.height=this._owner._rawHeight-v;
				this._owner.yMin=tmp+v;
				break ;
			case 21:
				tmp=this._owner.yMin;
				if (info.percent)
					v=pos+(tmp-pos)*delta-tmp;
				else
				v=delta *(1-pivot);
				this._owner.height=this._owner._rawHeight-v;
				this._owner.yMin=tmp+v;
				break ;
			case 22:
				tmp=this._owner.yMin;
				if (info.percent)
					v=pos+(tmp+this._owner._rawHeight-pos)*delta-(tmp+this._owner._rawHeight);
				else
				v=delta *(-pivot);
				this._owner.height=this._owner._rawHeight+v;
				this._owner.yMin=tmp;
				break ;
			case 23:
				tmp=this._owner.yMin;
				if (info.percent){
					if (this._owner==this._target.parent){
						if (this._owner._underConstruct)
							this._owner.height=pos+this._target._height-this._target._height *pivot+
						(this._owner.sourceHeight-pos-this._target.initHeight+this._target.initHeight *pivot)*delta;
						else
						this._owner.height=pos+(this._owner._rawHeight-pos)*delta;
					}
					else{
						v=pos+(tmp+this._owner._rawHeight-pos)*delta-(tmp+this._owner._rawHeight);
						this._owner.height=this._owner._rawHeight+v;
						this._owner.yMin=tmp;
					}
				}
				else{
					if (this._owner==this._target.parent){
						if (this._owner._underConstruct)
							this._owner.height=this._owner.sourceHeight+(this._target._height-this._target.initHeight)*(1-pivot);
						else
						this._owner.height=this._owner._rawHeight+delta *(1-pivot);
					}
					else{
						v=delta *(1-pivot);
						this._owner.height=this._owner._rawHeight+v;
						this._owner.yMin=tmp;
					}
				}
				break ;
			}
	}

	__proto.addRefTarget=function(target){
		if (target !=this._owner.parent)
			target.on("fui_xy_changed",this,this.__targetXYChanged);
		target.on("fui_size_changed",this,this.__targetSizeChanged);
		target.on("fui_size_delay_change",this,this.__targetSizeWillChange);
		this._targetX=this._target.x;
		this._targetY=this._target.y;
		this._targetWidth=this._target._width;
		this._targetHeight=this._target._height;
	}

	__proto.releaseRefTarget=function(target){
		if(target.displayObject==null)
			return;
		target.off("fui_xy_changed",this,this.__targetXYChanged);
		target.off("fui_size_changed",this,this.__targetSizeChanged);
		target.off("fui_size_delay_change",this,this.__targetSizeWillChange);
	}

	__proto.__targetXYChanged=function(target){
		if (this._owner.relations.handling!=null || this._owner.group!=null && this._owner.group._updating){
			this._targetX=this._target.x;
			this._targetY=this._target.y;
			return;
		}
		this._owner.relations.handling=target;
		var ox=this._owner.x;
		var oy=this._owner.y;
		var dx=this._target.x-this._targetX;
		var dy=this._target.y-this._targetY;
		var cnt=this._defs.length;
		for(var i=0;i<cnt;i++){
			this.applyOnXYChanged(this._defs[i],dx,dy);
		}
		this._targetX=this._target.x;
		this._targetY=this._target.y;
		if (ox!=this._owner.x || oy!=this._owner.y){
			ox=this._owner.x-ox;
			oy=this._owner.y-oy;
			this._owner.updateGearFromRelations(1,ox,oy);
			if (this._owner.parent !=null && this._owner.parent._transitions.length > 0){
				cnt=this._owner.parent._transitions.length;
				for(var j=0;j<cnt;j++){
					var trans=this._owner.parent._transitions[j];
					trans.updateFromRelations(this._owner.id,ox,oy);
				}
			}
		}
		this._owner.relations.handling=null;
	}

	__proto.__targetSizeChanged=function(target){
		if (this._owner.relations.handling!=null){
			this._targetWidth=this._target._width;
			this._targetHeight=this._target._height;
			return;
		}
		this._owner.relations.handling=target;
		var ox=this._owner.x;
		var oy=this._owner.y;
		var ow=this._owner._rawWidth;
		var oh=this._owner._rawHeight;
		var cnt=this._defs.length;
		for(var i=0;i<cnt;i++){
			this.applyOnSizeChanged(this._defs[i]);
		}
		this._targetWidth=this._target._width;
		this._targetHeight=this._target._height;
		if (ox!=this._owner.x || oy!=this._owner.y){
			ox=this._owner.x-ox;
			oy=this._owner.y-oy;
			this._owner.updateGearFromRelations(1,ox,oy);
			if (this._owner.parent !=null && this._owner.parent._transitions.length > 0){
				cnt=this._owner.parent._transitions.length;
				for(var j=0;j<cnt;j++){
					var trans=this._owner.parent._transitions[j];
					trans.updateFromRelations(this._owner.id,ox,oy);
				}
			}
		}
		if (ow!=this._owner._rawWidth || oh!=this._owner._rawHeight){
			ow=this._owner._rawWidth-ow;
			oh=this._owner._rawHeight-oh;
			this._owner.updateGearFromRelations(2,ow,oh);
		}
		this._owner.relations.handling=null;
	}

	__proto.__targetSizeWillChange=function(target){
		this._owner.relations.sizeDirty=true;
	}

	__getset(0,__proto,'owner',function(){
		return this._owner;
	});

	__getset(0,__proto,'target',function(){
		return this._target;
		},function(value){
		if(this._target!=value){
			if(this._target)
				this.releaseRefTarget(this._target);
			this._target=value;
			if(this._target)
				this.addRefTarget(this._target);
		}
	});

	__getset(0,__proto,'isEmpty',function(){
		return this._defs.length==0;
	});

	RelationItem.__init$=function(){
		
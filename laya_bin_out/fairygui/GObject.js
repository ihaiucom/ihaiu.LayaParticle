//class fairygui.GObject
var GObject=(function(){
	function GObject(){
		this.data=null;
		this.packageItem=null;
		this._x=0;
		this._y=0;
		this._alpha=1;
		this._rotation=0;
		this._visible=true;
		this._touchable=true;
		this._grayed=false;
		this._draggable=false;
		this._scaleX=1;
		this._scaleY=1;
		this._skewX=0;
		this._skewY=0;
		this._pivotX=0;
		this._pivotY=0;
		this._pivotAsAnchor=false;
		this._pivotOffsetX=0;
		this._pivotOffsetY=0;
		this._sortingOrder=0;
		this._internalVisible=true;
		this._handlingController=false;
		this._focusable=false;
		this._tooltips=null;
		this._pixelSnapping=false;
		this._relations=null;
		this._group=null;
		this._gears=null;
		this._dragBounds=null;
		this._displayObject=null;
		this._yOffset=0;
		this.minWidth=0;
		this.minHeight=0;
		this.maxWidth=0;
		this.maxHeight=0;
		this.sourceWidth=0;
		this.sourceHeight=0;
		this.initWidth=0;
		this.initHeight=0;
		this._parent=null;
		this._width=0;
		this._height=0;
		this._rawWidth=0;
		this._rawHeight=0;
		this._id=null;
		this._name=null;
		this._underConstruct=false;
		this._gearLocked=false;
		this._sizePercentInGroup=0;
		this._touchDownPoint=null;
		;
		this._id=""+fairygui.GObject._gInstanceCounter++;
		this._name="";
		this.createDisplayObject();
		this._relations=new Relations(this);
		this._gears=__newvec(8,null);
	}

	__class(GObject,'fairygui.GObject');
	var __proto=GObject.prototype;
	__proto.setXY=function(xv,yv){
		if(this._x !=xv || this._y !=yv){
			var dx=xv-this._x;
			var dy=yv-this._y;
			this._x=xv;
			this._y=yv;
			this.handleXYChanged();
			if((this instanceof fairygui.GGroup ))
				(this).moveChildren(dx,dy);
			this.updateGear(1);
			if(this._parent && !((this._parent instanceof fairygui.GList ))){
				this._parent.setBoundsChangedFlag();
				if (this._group !=null)
					this._group.setBoundsChangedFlag();
				this.displayObject.event("fui_xy_changed");
			}
			if (GObject.draggingObject==this && !GObject.sUpdateInDragging)
				this.localToGlobalRect(0,0,this.width,this.height,GObject.sGlobalRect);
		}
	}

	__proto.center=function(restraint){
		(restraint===void 0)&& (restraint=false);
		var r;
		if(this._parent !=null)
			r=this.parent;
		else
		r=this.root;
		this.setXY((r.width-this.width)/ 2,(r.height-this.height)/ 2);
		if(restraint){
			this.addRelation(r,3);
			this.addRelation(r,10);
		}
	}

	__proto.setSize=function(wv,hv,ignorePivot){
		(ignorePivot===void 0)&& (ignorePivot=false);
		if(this._rawWidth !=wv || this._rawHeight !=hv){
			this._rawWidth=wv;
			this._rawHeight=hv;
			if(wv<this.minWidth)
				wv=this.minWidth;
			if(hv<this.minHeight)
				hv=this.minHeight;
			if(this.maxWidth>0 && wv>this.maxWidth)
				wv=this.maxWidth;
			if(this.maxHeight>0 && hv>this.maxHeight)
				hv=this.maxHeight;
			var dWidth=wv-this._width;
			var dHeight=hv-this._height;
			this._width=wv;
			this._height=hv;
			this.handleSizeChanged();
			if(this._pivotX !=0 || this._pivotY !=0){
				if(!this._pivotAsAnchor){
					if(!ignorePivot)
						this.setXY(this.x-this._pivotX *dWidth,this.y-this._pivotY *dHeight);
					this.updatePivotOffset();
				}
				else
				this.applyPivot();
			}
			if ((this instanceof fairygui.GGroup ))
				(this).resizeChildren(dWidth,dHeight);
			this.updateGear(2);
			if(this._parent){
				this._relations.onOwnerSizeChanged(dWidth,dHeight,this._pivotAsAnchor || !ignorePivot);
				this._parent.setBoundsChangedFlag();
				if (this._group !=null)
					this._group.setBoundsChangedFlag(true);
			}
			this.displayObject.event("fui_size_changed");
		}
	}

	__proto.ensureSizeCorrect=function(){}
	__proto.setScale=function(sx,sy){
		if(this._scaleX !=sx || this._scaleY !=sy){
			this._scaleX=sx;
			this._scaleY=sy;
			this.handleScaleChanged();
			this.applyPivot();
			this.updateGear(2);
		}
	}

	__proto.setSkew=function(sx,sy){
		if(this._skewX !=sx || this._skewY !=sy){
			this._skewX=sx;
			this._skewY=sy;
			if(this._displayObject!=null){
				this._displayObject.skew(-sx,sy);
				this.applyPivot();
			}
		}
	}

	__proto.setPivot=function(xv,yv,asAnchor){
		(yv===void 0)&& (yv=0);
		(asAnchor===void 0)&& (asAnchor=false);
		if(this._pivotX !=xv || this._pivotY !=yv || this._pivotAsAnchor!=asAnchor){
			this._pivotX=xv;
			this._pivotY=yv;
			this._pivotAsAnchor=asAnchor;
			this.updatePivotOffset();
			this.handleXYChanged();
		}
	}

	__proto.internalSetPivot=function(xv,yv,asAnchor){
		this._pivotX=xv;
		this._pivotY=yv;
		this._pivotAsAnchor=asAnchor;
		if(this._pivotAsAnchor)
			this.handleXYChanged();
	}

	__proto.updatePivotOffset=function(){
		if(this._displayObject!=null){
			if(this._displayObject.transform && (this._pivotX!=0 || this._pivotY!=0)){
				fairygui.GObject.sHelperPoint.x=this._pivotX*this._width;
				fairygui.GObject.sHelperPoint.y=this._pivotY*this._height;
				var pt=this._displayObject.transform.transformPoint(fairygui.GObject.sHelperPoint);
				this._pivotOffsetX=this._pivotX*this._width-pt.x;
				this._pivotOffsetY=this._pivotY*this._height-pt.y;
			}
			else{
				this._pivotOffsetX=0;
				this._pivotOffsetY=0;
			}
		}
	}

	__proto.applyPivot=function(){
		if(this._pivotX !=0 || this._pivotY !=0){
			this.updatePivotOffset();
			this.handleXYChanged();
		}
	}

	__proto.requestFocus=function(){
		var p=this;
		while (p && !p._focusable)
		p=p.parent;
		if (p !=null)
			this.root.focus=p;
	}

	__proto.__rollOver=function(evt){
		Laya.timer.once(100,this,this.__doShowTooltips);
	}

	__proto.__doShowTooltips=function(){
		var r=this.root;
		if(r)
			this.root.showTooltips(this._tooltips);
	}

	__proto.__rollOut=function(evt){
		Laya.timer.clear(this,this.__doShowTooltips);
		this.root.hideTooltips();
	}

	__proto.getGear=function(index){
		var gear=this._gears[index];
		if (gear==null){
			switch (index){
				case 0:
					gear=new GearDisplay(this);
					break ;
				case 1:
					gear=new GearXY(this);
					break ;
				case 2:
					gear=new GearSize(this);
					break ;
				case 3:
					gear=new GearLook(this);
					break ;
				case 4:
					gear=new GearColor(this);
					break ;
				case 5:
					gear=new GearAnimation(this);
					break ;
				case 6:
					gear=new GearText(this);
					break ;
				case 7:
					gear=new GearIcon(this);
					break ;
				default :
					throw new Error("FairyGUI: invalid gear index!");
				}
			this._gears[index]=gear;
		}
		return gear;
	}

	__proto.updateGear=function(index){
		if(this._underConstruct || this._gearLocked)
			return;
		var gear=this._gears[index];
		if (gear!=null && gear.controller!=null)
			gear.updateState();
	}

	__proto.checkGearController=function(index,c){
		return this._gears[index] !=null && this._gears[index].controller==c;
	}

	__proto.updateGearFromRelations=function(index,dx,dy){
		if (this._gears[index] !=null)
			this._gears[index].updateFromRelations(dx,dy);
	}

	__proto.addDisplayLock=function(){
		var gearDisplay=(this._gears[0]);
		if(gearDisplay && gearDisplay.controller){
			var ret=gearDisplay.addLock();
			this.checkGearDisplay();
			return ret;
		}
		else
		return 0;
	}

	__proto.releaseDisplayLock=function(token){
		var gearDisplay=(this._gears[0]);
		if(gearDisplay && gearDisplay.controller){
			gearDisplay.releaseLock(token);
			this.checkGearDisplay();
		}
	}

	__proto.checkGearDisplay=function(){
		if(this._handlingController)
			return;
		var connected=this._gears[0]==null || (this._gears[0]).connected;
		if(connected!=this._internalVisible){
			this._internalVisible=connected;
			if(this._parent)
				this._parent.childStateChanged(this);
		}
	}

	__proto.addRelation=function(target,relationType,usePercent){
		(usePercent===void 0)&& (usePercent=false);
		this._relations.add(target,relationType,usePercent);
	}

	__proto.removeRelation=function(target,relationType){
		(relationType===void 0)&& (relationType=0);
		this._relations.remove(target,relationType);
	}

	__proto.removeFromParent=function(){
		if (this._parent)
			this._parent.removeChild(this);
	}

	__proto.dispose=function(){
		this.removeFromParent();
		this._relations.dispose();
		this._displayObject.destroy();
		this._displayObject=null;
	}

	__proto.onClick=function(thisObj,listener,args){
		this.on("click",thisObj,listener,args);
	}

	__proto.offClick=function(thisObj,listener){
		this.off("click",thisObj,listener);
	}

	__proto.hasClickListener=function(){
		return this._displayObject.hasListener("click");
	}

	__proto.on=function(type,thisObject,listener,args){
		this._displayObject.on(type,thisObject,listener,args);
	}

	__proto.off=function(type,thisObject,listener){
		this._displayObject.off(type,thisObject,listener);
	}

	__proto.startDrag=function(touchPointID){
		(touchPointID===void 0)&& (touchPointID=-1);
		if (this._displayObject.stage==null)
			return;
		this.dragBegin();
	}

	__proto.stopDrag=function(){
		this.dragEnd();
	}

	__proto.localToGlobal=function(ax,ay,resultPoint){
		(ax===void 0)&& (ax=0);
		(ay===void 0)&& (ay=0);
		if(this._pivotAsAnchor){
			ax+=this._pivotX*this._width;
			ay+=this._pivotY*this._height;
		}
		if(!resultPoint){
			resultPoint=fairygui.GObject.sHelperPoint;
			resultPoint.x=ax;
			resultPoint.y=ay;
			return this._displayObject.localToGlobal(resultPoint,true);
		}
		else{
			resultPoint.x=ax;
			resultPoint.y=ay;
			return this._displayObject.localToGlobal(resultPoint,false);
		}
	}

	__proto.globalToLocal=function(ax,ay,resultPoint){
		(ax===void 0)&& (ax=0);
		(ay===void 0)&& (ay=0);
		if(!resultPoint){
			resultPoint=fairygui.GObject.sHelperPoint;
			resultPoint.x=ax;
			resultPoint.y=ay;
			resultPoint=this._displayObject.globalToLocal(resultPoint,true);
		}
		else{
			resultPoint.x=ax;
			resultPoint.y=ay;
			this._displayObject.globalToLocal(resultPoint,false);
		}
		if(this._pivotAsAnchor){
			resultPoint.x-=this._pivotX*this._width;
			resultPoint.y-=this._pivotY*this._height;
		}
		return resultPoint;
	}

	__proto.localToGlobalRect=function(ax,ay,aWidth,aHeight,resultRect){
		(ax===void 0)&& (ax=0);
		(ay===void 0)&& (ay=0);
		(aWidth===void 0)&& (aWidth=0);
		(aHeight===void 0)&& (aHeight=0);
		if(resultRect==null)
			resultRect=new Rectangle();
		var pt=this.localToGlobal(ax,ay);
		resultRect.x=pt.x;
		resultRect.y=pt.y;
		pt=this.localToGlobal(ax+aWidth,ay+aHeight);
		resultRect.width=pt.x-resultRect.x;
		resultRect.height=pt.y-resultRect.y;
		return resultRect;
	}

	__proto.globalToLocalRect=function(ax,ay,aWidth,aHeight,resultRect){
		(ax===void 0)&& (ax=0);
		(ay===void 0)&& (ay=0);
		(aWidth===void 0)&& (aWidth=0);
		(aHeight===void 0)&& (aHeight=0);
		if(resultRect==null)
			resultRect=new Rectangle();
		var pt=this.globalToLocal(ax,ay);
		resultRect.x=pt.x;
		resultRect.y=pt.y;
		pt=this.globalToLocal(ax+aWidth,ay+aHeight);
		resultRect.width=pt.x-resultRect.x;
		resultRect.height=pt.y-resultRect.y;
		return resultRect;
	}

	__proto.handleControllerChanged=function(c){
		this._handlingController=true;
		for (var i=0;i < 8;i++){
			var gear=this._gears[i];
			if (gear !=null && gear.controller==c)
				gear.apply();
		}
		this._handlingController=false;
		this.checkGearDisplay();
	}

	__proto.createDisplayObject=function(){
		this._displayObject=new Sprite();
		this._displayObject["$owner"]=this;
	}

	__proto.handleXYChanged=function(){
		var xv=this._x;
		var yv=this._y+this._yOffset;
		if(this._pivotAsAnchor){
			xv-=this._pivotX*this._width;
			yv-=this._pivotY*this._height;
		}
		if(this._pixelSnapping){
			xv=Math.round(xv);
			yv=Math.round(yv);
		}
		this._displayObject.pos(xv+this._pivotOffsetX,yv+this._pivotOffsetY);
	}

	__proto.handleSizeChanged=function(){
		if(this._displayObject!=null)
			this._displayObject.size(this._width,this._height);
	}

	__proto.handleScaleChanged=function(){
		if(this._displayObject!=null)
			this._displayObject.scale(this._scaleX,this._scaleY);
	}

	__proto.handleGrayedChanged=function(){
		if(this._displayObject){
			if(this._grayed){
				if(GObject.grayFilter==null)
					GObject.grayFilter=new ColorFilter([0.3086,0.6094,0.082,0,0,0.3086,0.6094,0.082,0,0,0.3086,0.6094,0.082,0,0,0,0,0,1,0]);
				this._displayObject.filters=[GObject.grayFilter];
			}
			else
			this._displayObject.filters=null;
		}
	}

	__proto.handleAlphaChanged=function(){
		if(this._displayObject)
			this._displayObject.alpha=this._alpha;
	}

	__proto.handleVisibleChanged=function(){
		if(this._displayObject)
			this._displayObject.visible=this.internalVisible2;
	}

	__proto.constructFromResource=function(){}
	__proto.setup_beforeAdd=function(buffer,beginPos){
		buffer.seek(beginPos,0);
		buffer.skip(5);
		var f1=NaN;
		var f2=NaN;
		this._id=buffer.readS();
		this._name=buffer.readS();
		f1=buffer.getInt32();
		f2=buffer.getInt32();
		this.setXY(f1,f2);
		if (buffer.readBool()){
			this.initWidth=buffer.getInt32();
			this.initHeight=buffer.getInt32();
			this.setSize(this.initWidth,this.initHeight,true);
		}
		if (buffer.readBool()){
			this.minWidth=buffer.getInt32();
			this.maxWidth=buffer.getInt32();
			this.minHeight=buffer.getInt32();
			this.maxHeight=buffer.getInt32();
		}
		if (buffer.readBool()){
			f1=buffer.getFloat32();
			f2=buffer.getFloat32();
			this.setScale(f1,f2);
		}
		if (buffer.readBool()){
			f1=buffer.getFloat32();
			f2=buffer.getFloat32();
			this.setSkew(f1,f2);
		}
		if (buffer.readBool()){
			f1=buffer.getFloat32();
			f2=buffer.getFloat32();
			this.setPivot(f1,f2,buffer.readBool());
		}
		f1=buffer.getFloat32();
		if (f1 !=1)
			this.alpha=f1;
		f1=buffer.getFloat32();
		if (f1 !=0)
			this.rotation=f1;
		if (!buffer.readBool())
			this.visible=false;
		if (!buffer.readBool())
			this.touchable=false;
		if (buffer.readBool())
			this.grayed=true;
		var bm=buffer.readByte();
		if(bm==2)
			this.blendMode="lighter";
		var filter=buffer.readByte();
		if (filter==1){
			var cm=new ColorMatrix();
			cm.adjustBrightness(buffer.getFloat32());
			cm.adjustContrast(buffer.getFloat32());
			cm.adjustSaturation(buffer.getFloat32());
			cm.adjustHue(buffer.getFloat32());
			var cf=new ColorFilter(cm);
			this.filters=[cf];
		};
		var str=buffer.readS();
		if (str !=null)
			this.data=str;
	}

	__proto.setup_afterAdd=function(buffer,beginPos){
		buffer.seek(beginPos,1);
		var str=buffer.readS();
		if (str !=null)
			this.tooltips=str;
		var groupId=buffer.getInt16();
		if (groupId >=0)
			this.group=this.parent.getChildAt(groupId);
		buffer.seek(beginPos,2);
		var cnt=buffer.getInt16();
		for (var i=0;i < cnt;i++){
			var nextPos=buffer.getInt16();
			nextPos+=buffer.pos;
			var gear=this.getGear(buffer.readByte());
			gear.setup(buffer);
			buffer.pos=nextPos;
		}
	}

	__proto.initDrag=function(){
		if (this._draggable)
			this.on("mousedown",this,this.__begin);
		else
		this.off("mousedown",this,this.__begin);
	}

	__proto.dragBegin=function(){
		if (fairygui.GObject.draggingObject !=null)
			fairygui.GObject.draggingObject.stopDrag();
		fairygui.GObject.sGlobalDragStart.x=Laya.stage.mouseX;
		fairygui.GObject.sGlobalDragStart.y=Laya.stage.mouseY;
		this.localToGlobalRect(0,0,this.width,this.height,fairygui.GObject.sGlobalRect);
		fairygui.GObject.draggingObject=this;
		Laya.stage.on("mousemove",this,this.__moving2);
		Laya.stage.on("mouseup",this,this.__end2);
	}

	__proto.dragEnd=function(){
		if (fairygui.GObject.draggingObject==this){
			Laya.stage.off("mousemove",this,this.__moving2);
			Laya.stage.off("mouseup",this,this.__end2);
			fairygui.GObject.draggingObject=null;
		}
		fairygui.GObject.sDraggingQuery=false;
	}

	__proto.reset=function(){
		Laya.stage.off("mousemove",this,this.__moving);
		Laya.stage.off("mouseup",this,this.__end);
	}

	__proto.__begin=function(){
		if(this._touchDownPoint==null)
			this._touchDownPoint=new Point();
		this._touchDownPoint.x=Laya.stage.mouseX;
		this._touchDownPoint.y=Laya.stage.mouseY;
		Laya.stage.on("mousemove",this,this.__moving);
		Laya.stage.on("mouseup",this,this.__end);
	}

	__proto.__end=function(){
		this.reset();
	}

	__proto.__moving=function(evt){
		var sensitivity=UIConfig$1.touchDragSensitivity;
		if(this._touchDownPoint !=null
			&& Math.abs(this._touchDownPoint.x-Laya.stage.mouseX)< sensitivity
		&& Math.abs(this._touchDownPoint.y-Laya.stage.mouseY)< sensitivity)
		return;
		this.reset();
		fairygui.GObject.sDraggingQuery=true;
		Events.dispatch("fui_drag_start",this._displayObject,evt);
		if (fairygui.GObject.sDraggingQuery)
			this.dragBegin();
	}

	__proto.__moving2=function(evt){
		var xx=Laya.stage.mouseX-fairygui.GObject.sGlobalDragStart.x+fairygui.GObject.sGlobalRect.x;
		var yy=Laya.stage.mouseY-fairygui.GObject.sGlobalDragStart.y+fairygui.GObject.sGlobalRect.y;
		if(this._dragBounds !=null){
			var rect=GRoot.inst.localToGlobalRect(this._dragBounds.x,this._dragBounds.y,
			this._dragBounds.width,this._dragBounds.height,fairygui.GObject.sDragHelperRect);
			if(xx < rect.x)
				xx=rect.x;
			else if(xx+fairygui.GObject.sGlobalRect.width > rect.right){
				xx=rect.right-fairygui.GObject.sGlobalRect.width;
				if(xx < rect.x)
					xx=rect.x;
			}
			if(yy < rect.y)
				yy=rect.y;
			else if(yy+fairygui.GObject.sGlobalRect.height > rect.bottom){
				yy=rect.bottom-fairygui.GObject.sGlobalRect.height;
				if(yy < rect.y)
					yy=rect.y;
			}
		}
		GObject.sUpdateInDragging=true;
		var pt=this.parent.globalToLocal(xx,yy,fairygui.GObject.sHelperPoint);
		this.setXY(Math.round(pt.x),Math.round(pt.y));
		GObject.sUpdateInDragging=false;
		Events.dispatch("fui_drag_move",this._displayObject,evt);
	}

	__proto.__end2=function(evt){
		if (fairygui.GObject.draggingObject==this){
			this.stopDrag();
			Events.dispatch("fui_drag_end",this._displayObject,evt);
		}
	}

	__getset(0,__proto,'yMin',function(){
		return this._pivotAsAnchor ? (this._y-this._height *this._pivotY):this._y;
		},function(value){
		if (this._pivotAsAnchor)
			this.setXY(this._x,value+this._height *this._pivotY);
		else
		this.setXY(this._x,value);
	});

	__getset(0,__proto,'id',function(){
		return this._id;
	});

	__getset(0,__proto,'name',function(){
		return this._name;
		},function(value){
		this._name=value;
	});

	__getset(0,__proto,'rotation',function(){
		return this._rotation;
		},function(value){
		if(this._rotation !=value){
			this._rotation=value;
			if(this._displayObject!=null){
				this._displayObject.rotation=this.normalizeRotation;
				this.applyPivot();
			}
			this.updateGear(3);
		}
	});

	__getset(0,__proto,'width',function(){
		this.ensureSizeCorrect();
		if(this._relations.sizeDirty)
			this._relations.ensureRelationsSizeCorrect();
		return this._width;
		},function(value){
		this.setSize(value,this._rawHeight);
	});

	__getset(0,__proto,'x',function(){
		return this._x;
		},function(value){
		this.setXY(value,this._y);
	});

	__getset(0,__proto,'draggable',function(){
		return this._draggable;
		},function(value){
		if (this._draggable !=value){
			this._draggable=value;
			this.initDrag();
		}
	});

	__getset(0,__proto,'y',function(){
		return this._y;
		},function(value){
		this.setXY(this._x,value);
	});

	__getset(0,__proto,'gearXY',function(){
		return (this.getGear(1));
	});

	__getset(0,__proto,'xMin',function(){
		return this._pivotAsAnchor ? (this._x-this._width *this._pivotX):this._x;
		},function(value){
		if (this._pivotAsAnchor)
			this.setXY(value+this._width *this._pivotX,this._y);
		else
		this.setXY(value,this._y);
	});

	__getset(0,__proto,'pixelSnapping',function(){
		return this._pixelSnapping;
		},function(value){
		if(this._pixelSnapping!=value){
			this._pixelSnapping=value;
			this.handleXYChanged();
		}
	});

	__getset(0,__proto,'height',function(){
		this.ensureSizeCorrect();
		if(this._relations.sizeDirty)
			this._relations.ensureRelationsSizeCorrect();
		return this._height;
		},function(value){
		this.setSize(this._rawWidth,value);
	});

	__getset(0,__proto,'asButton',function(){
		return this;
	});

	__getset(0,__proto,'actualWidth',function(){
		return this.width *Math.abs(this._scaleX);
	});

	__getset(0,__proto,'actualHeight',function(){
		return this.height *Math.abs(this._scaleY);
	});

	__getset(0,__proto,'blendMode',function(){
		return this._displayObject.blendMode;
		},function(value){
		this._displayObject.blendMode=value;
	});

	__getset(0,__proto,'scaleX',function(){
		return this._scaleX;
		},function(value){
		this.setScale(value,this._scaleY);
	});

	__getset(0,__proto,'scaleY',function(){
		return this._scaleY;
		},function(value){
		this.setScale(this._scaleX,value);
	});

	__getset(0,__proto,'skewX',function(){
		return this._skewX;
		},function(value){
		this.setSkew(value,this._skewY);
	});

	__getset(0,__proto,'pivotAsAnchor',function(){
		return this._pivotAsAnchor;
	});

	__getset(0,__proto,'skewY',function(){
		return this._skewY;
		},function(value){
		this.setSkew(this._skewX,value);
	});

	__getset(0,__proto,'pivotX',function(){
		return this._pivotX;
		},function(value){
		this.setPivot(value,this._pivotY);
	});

	__getset(0,__proto,'asLoader',function(){
		return this;
	});

	__getset(0,__proto,'asTextInput',function(){
		return this;
	});

	__getset(0,__proto,'displayObject',function(){
		return this._displayObject;
	});

	__getset(0,__proto,'normalizeRotation',function(){
		var rot=this._rotation % 360;
		if(rot > 180)
			rot=rot-360;
		else if(rot <-180)
		rot=360+rot;
		return rot;
	});

	__getset(0,__proto,'pivotY',function(){
		return this._pivotY;
		},function(value){
		this.setPivot(this._pivotX,value);
	});

	__getset(0,__proto,'touchable',function(){
		return this._touchable;
		},function(value){
		if(this._touchable!=value){
			this._touchable=value;
			this.updateGear(3);
			if(((this instanceof fairygui.GImage ))|| ((this instanceof fairygui.GMovieClip ))
				|| ((this instanceof fairygui.GTextField ))&& !((this instanceof fairygui.GTextInput ))&& !((this instanceof fairygui.GRichTextField )))
			return;
			if(this._displayObject !=null)
				this._displayObject.mouseEnabled=this._touchable;
		}
	});

	__getset(0,__proto,'alpha',function(){
		return this._alpha;
		},function(value){
		if(this._alpha!=value){
			this._alpha=value;
			this.handleAlphaChanged();
			this.updateGear(3);
		}
	});

	__getset(0,__proto,'grayed',function(){
		return this._grayed;
		},function(value){
		if(this._grayed !=value){
			this._grayed=value;
			this.handleGrayedChanged();
			this.updateGear(3);
		}
	});

	__getset(0,__proto,'dragBounds',function(){
		return this._dragBounds;
		},function(value){
		this._dragBounds=value;
	});

	__getset(0,__proto,'asProgress',function(){
		return this;
	});

	__getset(0,__proto,'enabled',function(){
		return !this._grayed && this._touchable;
		},function(value){
		this.grayed=!value;
		this.touchable=value;
	});

	__getset(0,__proto,'sortingOrder',function(){
		return this._sortingOrder;
		},function(value){
		if (value < 0)
			value=0;
		if (this._sortingOrder !=value){
			var old=this._sortingOrder;
			this._sortingOrder=value;
			if (this._parent !=null)
				this._parent.childSortingOrderChanged(this,old,this._sortingOrder);
		}
	});

	__getset(0,__proto,'visible',function(){
		return this._visible;
		},function(value){
		if (this._visible !=value){
			this._visible=value;
			this.handleVisibleChanged();
			if (this._parent)
				this._parent.setBoundsChangedFlag();
		}
	});

	__getset(0,__proto,'internalVisible',function(){
		return this._internalVisible && (!this._group || this._group.internalVisible)
		&& !this._displayObject._cacheStyle.maskParent;
	});

	__getset(0,__proto,'icon',function(){
		return null;
		},function(value){
	});

	__getset(0,__proto,'internalVisible2',function(){
		return this._visible && (!this._group || this._group.internalVisible2);
	});

	__getset(0,__proto,'asGraph',function(){
		return this;
	});

	__getset(0,__proto,'gearSize',function(){
		return (this.getGear(2));
	});

	__getset(0,__proto,'focusable',function(){
		return this._focusable;
		},function(value){
		this._focusable=value;
	});

	__getset(0,__proto,'focused',function(){
		return this.root.focus==this;
	});

	__getset(0,__proto,'tooltips',function(){
		return this._tooltips;
		},function(value){
		if(this._tooltips){
			this.off("mouseover",this,this.__rollOver);
			this.off("mouseout",this,this.__rollOut);
		}
		this._tooltips=value;
		if(this._tooltips){
			this.on("mouseover",this,this.__rollOver);
			this.on("mouseout",this,this.__rollOut);
		}
	});

	__getset(0,__proto,'dragging',function(){
		return fairygui.GObject.draggingObject==this;
	});

	__getset(0,__proto,'group',function(){
		return this._group;
		},function(value){
		if (this._group !=value){
			if (this._group !=null)
				this._group.setBoundsChangedFlag(true);
			this._group=value;
			if (this._group !=null)
				this._group.setBoundsChangedFlag(true);
		}
	});

	__getset(0,__proto,'filters',function(){
		return this._displayObject.filters;
		},function(value){
		this._displayObject.filters=value;
	});

	__getset(0,__proto,'inContainer',function(){
		return this._displayObject !=null && this._displayObject.parent !=null;
	});

	__getset(0,__proto,'resourceURL',function(){
		if (this.packageItem !=null)
			return "ui://"+this.packageItem.owner.id+this.packageItem.id;
		else
		return null;
	});

	__getset(0,__proto,'onStage',function(){
		return this._displayObject !=null && this._displayObject.stage !=null;
	});

	__getset(0,__proto,'root',function(){
		if((this instanceof fairygui.GRoot ))
			return (this);
		var p=this._parent;
		while (p){
			if ((p instanceof fairygui.GRoot ))
				return (p);
			p=p.parent;
		}
		return GRoot.inst;
	});

	__getset(0,__proto,'gearLook',function(){
		return (this.getGear(3));
	});

	__getset(0,__proto,'asCom',function(){
		return this;
	});

	__getset(0,__proto,'relations',function(){
		return this._relations;
	});

	__getset(0,__proto,'parent',function(){
		return this._parent;
		},function(val){
		this._parent=val;
	});

	__getset(0,__proto,'asLabel',function(){
		return this;
	});

	__getset(0,__proto,'asImage',function(){
		return this;
	});

	__getset(0,__proto,'asTextField',function(){
		return this;
	});

	__getset(0,__proto,'asGroup',function(){
		return this;
	});

	__getset(0,__proto,'asRichTextField',function(){
		return this;
	});

	__getset(0,__proto,'asList',function(){
		return this;
	});

	__getset(0,__proto,'asSlider',function(){
		return this;
	});

	__getset(0,__proto,'asComboBox',function(){
		return this;
	});

	__getset(0,__proto,'asMovieClip',function(){
		return this;
	});

	__getset(0,__proto,'text',function(){
		return null;
		},function(value){
	});

	GObject.cast=function(sprite){
		return (sprite["$owner"]);
	}

	GObject.draggingObject=null;
	GObject._gInstanceCounter=0;
	GObject.grayFilter=null;
	GObject.sDraggingQuery=false;
	GObject.sUpdateInDragging=false;
	__static(GObject,
	['sGlobalDragStart',function(){return this.sGlobalDragStart=new Point();},'sGlobalRect',function(){return this.sGlobalRect=new Rectangle();},'sHelperPoint',function(){return this.sHelperPoint=new Point();},'sDragHelperRect',function(){return this.sDragHelperRect=new Rectangle();}
	]);
	return GObject;
})()



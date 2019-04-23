//class fairygui.GGroup extends fairygui.GObject
var GGroup=(function(_super){
	function GGroup(){
		this._layout=0;
		this._lineGap=0;
		this._columnGap=0;
		this._percentReady=false;
		this._boundsChanged=false;
		this._updating=0;
		GGroup.__super.call(this);
	}

	__class(GGroup,'fairygui.GGroup',_super);
	var __proto=GGroup.prototype;
	__proto.setBoundsChangedFlag=function(childSizeChanged){
		(childSizeChanged===void 0)&& (childSizeChanged=false);
		if (this._updating==0 && this.parent !=null){
			if (childSizeChanged)
				this._percentReady=false;
			if(!this._boundsChanged){
				this._boundsChanged=true;
				if(this._layout!=0)
					Laya.timer.callLater(this,this.ensureBoundsCorrect);
			}
		}
	}

	__proto.ensureBoundsCorrect=function(){
		if (this._boundsChanged)
			this.updateBounds();
	}

	__proto.updateBounds=function(){
		Laya.timer.clear(this,this.ensureBoundsCorrect);
		this._boundsChanged=false;
		if (this.parent==null)
			return;
		this.handleLayout();
		var cnt=this._parent.numChildren;
		var i=0;
		var child;
		var ax=Number.POSITIVE_INFINITY,ay=Number.POSITIVE_INFINITY;
		var ar=Number.NEGATIVE_INFINITY,ab=Number.NEGATIVE_INFINITY;
		var tmp=0;
		var empty=true;
		for(i=0;i<cnt;i++){
			child=this._parent.getChildAt(i);
			if(child.group==this){
				tmp=child.x;
				if(tmp<ax)
					ax=tmp;
				tmp=child.y;
				if(tmp<ay)
					ay=tmp;
				tmp=child.x+child.width;
				if(tmp>ar)
					ar=tmp;
				tmp=child.y+child.height;
				if(tmp>ab)
					ab=tmp;
				empty=false;
			}
		}
		if (!empty){
			this._updating=1;
			this.setXY(ax,ay);
			this._updating=2;
			this.setSize(ar-ax,ab-ay);
		}
		else{
			this._updating=2;
			this.setSize(0,0);
		}
		this._updating=0;
	}

	__proto.handleLayout=function(){
		this._updating |=1;
		var child;
		var i=0;
		var cnt=0;
		if (this._layout==1){
			var curX=NaN;
			cnt=this.parent.numChildren;
			for (i=0;i < cnt;i++){
				child=this.parent.getChildAt(i);
				if (child.group !=this)
					continue ;
				if (isNaN(curX))
					curX=Math.floor(child.x);
				else
				child.x=curX;
				if (child.width !=0)
					curX+=Math.floor(child.width+this._columnGap);
			}
			if (!this._percentReady)
				this.updatePercent();
		}
		else if (this._layout==2){
			var curY=NaN;
			cnt=this.parent.numChildren;
			for (i=0;i < cnt;i++){
				child=this.parent.getChildAt(i);
				if (child.group !=this)
					continue ;
				if (isNaN(curY))
					curY=Math.floor(child.y);
				else
				child.y=curY;
				if (child.height !=0)
					curY+=Math.floor(child.height+this._lineGap);
			}
			if (!this._percentReady)
				this.updatePercent();
		}
		this._updating &=2;
	}

	__proto.updatePercent=function(){
		this._percentReady=true;
		var cnt=this.parent.numChildren;
		var i=0;
		var child;
		var size=0;
		if (this._layout==1){
			for (i=0;i < cnt;i++){
				child=this.parent.getChildAt(i);
				if (child.group !=this)
					continue ;
				size+=child.width;
			}
			for (i=0;i < cnt;i++){
				child=this.parent.getChildAt(i);
				if (child.group !=this)
					continue ;
				if (size > 0)
					child._sizePercentInGroup=child.width / size;
				else
				child._sizePercentInGroup=0;
			}
		}
		else{
			for (i=0;i < cnt;i++){
				child=this.parent.getChildAt(i);
				if (child.group !=this)
					continue ;
				size+=child.height;
			}
			for (i=0;i < cnt;i++){
				child=this.parent.getChildAt(i);
				if (child.group !=this)
					continue ;
				if (size > 0)
					child._sizePercentInGroup=child.height / size;
				else
				child._sizePercentInGroup=0;
			}
		}
	}

	__proto.moveChildren=function(dx,dy){
		if ((this._updating & 1)!=0 || this.parent==null)
			return;
		this._updating |=1;
		var cnt=this.parent.numChildren;
		var i=0;
		var child;
		for (i=0;i < cnt;i++){
			child=this.parent.getChildAt(i);
			if (child.group==this){
				child.setXY(child.x+dx,child.y+dy);
			}
		}
		this._updating &=2;
	}

	__proto.resizeChildren=function(dw,dh){
		if (this._layout==0 || (this._updating & 2)!=0 || this.parent==null)
			return;
		this._updating |=2;
		if (!this._percentReady)
			this.updatePercent();
		var cnt=this.parent.numChildren;
		var i=0;
		var j=0;
		var child;
		var last=-1;
		var numChildren=0;
		var lineSize=0;
		var remainSize=0;
		var found=false;
		for (i=0;i < cnt;i++){
			child=this.parent.getChildAt(i);
			if (child.group !=this)
				continue ;
			last=i;
			numChildren++;
		}
		if (this._layout==1){
			remainSize=lineSize=this.width-(numChildren-1)*this._columnGap;
			var curX=NaN;
			var nw=NaN;
			for (i=0;i < cnt;i++){
				child=this.parent.getChildAt(i);
				if (child.group !=this)
					continue ;
				if (isNaN(curX))
					curX=Math.floor(child.x);
				else
				child.x=curX;
				if (last==i)
					nw=remainSize;
				else
				nw=Math.round(child._sizePercentInGroup *lineSize);
				child.setSize(nw,child._rawHeight+dh,true);
				remainSize-=child.width;
				if (last==i){
					if (remainSize >=1){
						for (j=0;j <=i;j++){
							child=this.parent.getChildAt(j);
							if (child.group !=this)
								continue ;
							if (!found){
								nw=child.width+remainSize;
								if ((child.maxWidth==0 || nw < child.maxWidth)
									&& (child.minWidth==0 || nw > child.minWidth)){
									child.setSize(nw,child.height,true);
									found=true;
								}
							}
							else
							child.x+=remainSize;
						}
					}
				}
				else
				curX+=(child.width+this._columnGap);
			}
		}
		else if (this._layout==2){
			remainSize=lineSize=this.height-(numChildren-1)*this._lineGap;
			var curY=NaN;
			var nh=NaN;
			for (i=0;i < cnt;i++){
				child=this.parent.getChildAt(i);
				if (child.group !=this)
					continue ;
				if (isNaN(curY))
					curY=Math.floor(child.y);
				else
				child.y=curY;
				if (last==i)
					nh=remainSize;
				else
				nh=Math.round(child._sizePercentInGroup *lineSize);
				child.setSize(child._rawWidth+dw,nh,true);
				remainSize-=child.height;
				if (last==i){
					if (remainSize >=1){
						for (j=0;j <=i;j++){
							child=this.parent.getChildAt(j);
							if (child.group !=this)
								continue ;
							if (!found){
								nh=child.height+remainSize;
								if ((child.maxHeight==0 || nh < child.maxHeight)
									&& (child.minHeight==0 || nh > child.minHeight)){
									child.setSize(child.width,nh,true);
									found=true;
								}
							}
							else
							child.y+=remainSize;
						}
					}
				}
				else
				curY+=(child.height+this._lineGap);
			}
		}
		this._updating &=1;
	}

	__proto.handleAlphaChanged=function(){
		if(this._underConstruct)
			return;
		var cnt=this._parent.numChildren;
		for(var i=0;i<cnt;i++){
			var child=this._parent.getChildAt(i);
			if(child.group==this)
				child.alpha=this.alpha;
		}
	}

	__proto.handleVisibleChanged=function(){
		if(!this._parent)
			return;
		var cnt=this._parent.numChildren;
		for(var i=0;i<cnt;i++){
			var child=this._parent.getChildAt(i);
			if(child.group==this)
				child.handleVisibleChanged();
		}
	}

	__proto.setup_beforeAdd=function(buffer,beginPos){
		_super.prototype.setup_beforeAdd.call(this,buffer,beginPos);
		buffer.seek(beginPos,5);
		this._layout=buffer.readByte();
		this._lineGap=buffer.getInt32();
		this._columnGap=buffer.getInt32();
	}

	__proto.setup_afterAdd=function(buffer,beginPos){
		_super.prototype.setup_afterAdd.call(this,buffer,beginPos);
		if(!this.visible)
			this.handleVisibleChanged();
	}

	/**
	*@see GroupLayout
	*/
	/**
	*@see GroupLayout
	*/
	__getset(0,__proto,'layout',function(){
		return this._layout;
		},function(value){
		if(this._layout !=value){
			this._layout=value;
			this.setBoundsChangedFlag(true);
		}
	});

	__getset(0,__proto,'columnGap',function(){
		return this._columnGap;
		},function(value){
		if(this._columnGap !=value){
			this._columnGap=value;
			this.setBoundsChangedFlag();
		}
	});

	__getset(0,__proto,'lineGap',function(){
		return this._lineGap;
		},function(value){
		if(this._lineGap !=value){
			this._lineGap=value;
			this.setBoundsChangedFlag();
		}
	});

	return GGroup;
})(GObject)



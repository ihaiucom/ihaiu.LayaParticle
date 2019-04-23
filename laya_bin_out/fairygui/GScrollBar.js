//class fairygui.GScrollBar extends fairygui.GComponent
var GScrollBar=(function(_super){
	function GScrollBar(){
		this._grip=null;
		this._arrowButton1=null;
		this._arrowButton2=null;
		this._bar=null;
		this._target=null;
		this._vertical=false;
		this._scrollPerc=0;
		this._fixedGripSize=false;
		this._dragOffset=null;
		GScrollBar.__super.call(this);
		this._dragOffset=new laya.maths.Point();
		this._scrollPerc=0;
	}

	__class(GScrollBar,'fairygui.GScrollBar',_super);
	var __proto=GScrollBar.prototype;
	__proto.setScrollPane=function(target,vertical){
		this._target=target;
		this._vertical=vertical;
	}

	__proto.constructExtension=function(buffer){
		buffer.seek(0,6);
		this._fixedGripSize=buffer.readBool();
		this._grip=this.getChild("grip");
		if(!this._grip){
			Log.print("需要定义grip");
			return;
		}
		this._bar=this.getChild("bar");
		if(!this._bar){
			Log.print("需要定义bar");
			return;
		}
		this._arrowButton1=this.getChild("arrow1");
		this._arrowButton2=this.getChild("arrow2");
		this._grip.on("mousedown",this,this.__gripMouseDown);
		if(this._arrowButton1)
			this._arrowButton1.on("mousedown",this,this.__arrowButton1Click);
		if(this._arrowButton2)
			this._arrowButton2.on("mousedown",this,this.__arrowButton2Click);
		this.on("mousedown",this,this.__barMouseDown);
	}

	__proto.__gripMouseDown=function(evt){
		if (!this._bar)
			return;
		evt.stopPropagation();
		Laya.stage.on("mousemove",this,this.__gripMouseMove);
		Laya.stage.on("mouseup",this,this.__gripMouseUp);
		this.globalToLocal(Laya.stage.mouseX,Laya.stage.mouseY,this._dragOffset);
		this._dragOffset.x-=this._grip.x;
		this._dragOffset.y-=this._grip.y;
	}

	__proto.__gripMouseMove=function(){
		var pt=this.globalToLocal(Laya.stage.mouseX,Laya.stage.mouseY,fairygui.GScrollBar.sScrollbarHelperPoint);
		if (this._vertical){
			var curY=pt.y-this._dragOffset.y;
			this._target.setPercY((curY-this._bar.y)/ (this._bar.height-this._grip.height),false);
		}
		else {
			var curX=pt.x-this._dragOffset.x;
			this._target.setPercX((curX-this._bar.x)/ (this._bar.width-this._grip.width),false);
		}
	}

	__proto.__gripMouseUp=function(evt){
		if (!this._bar)
			return;
		Laya.stage.off("mousemove",this,this.__gripMouseMove);
		Laya.stage.off("mouseup",this,this.__gripMouseUp);
	}

	__proto.__arrowButton1Click=function(evt){
		evt.stopPropagation();
		if (this._vertical)
			this._target.scrollUp();
		else
		this._target.scrollLeft();
	}

	__proto.__arrowButton2Click=function(evt){
		evt.stopPropagation();
		if (this._vertical)
			this._target.scrollDown();
		else
		this._target.scrollRight();
	}

	__proto.__barMouseDown=function(evt){
		var pt=this._grip.globalToLocal(Laya.stage.mouseX,Laya.stage.mouseY,fairygui.GScrollBar.sScrollbarHelperPoint);
		if (this._vertical){
			if (pt.y < 0)
				this._target.scrollUp(4);
			else
			this._target.scrollDown(4);
		}
		else {
			if (pt.x < 0)
				this._target.scrollLeft(4);
			else
			this._target.scrollRight(4);
		}
	}

	__getset(0,__proto,'displayPerc',null,function(val){
		if (this._vertical){
			if(!this._fixedGripSize)
				this._grip.height=val *this._bar.height;
			this._grip.y=this._bar.y+(this._bar.height-this._grip.height)*this._scrollPerc;
		}
		else {
			if(!this._fixedGripSize)
				this._grip.width=val *this._bar.width;
			this._grip.x=this._bar.x+(this._bar.width-this._grip.width)*this._scrollPerc;
		}
	});

	__getset(0,__proto,'scrollPerc',null,function(val){
		this._scrollPerc=val;
		if (this._vertical)
			this._grip.y=this._bar.y+(this._bar.height-this._grip.height)*this._scrollPerc;
		else
		this._grip.x=this._bar.x+(this._bar.width-this._grip.width)*this._scrollPerc;
	});

	__getset(0,__proto,'minSize',function(){
		if (this._vertical)
			return (this._arrowButton1 !=null ? this._arrowButton1.height :0)+(this._arrowButton2 !=null ? this._arrowButton2.height :0);
		else
		return (this._arrowButton1 !=null ? this._arrowButton1.width :0)+(this._arrowButton2 !=null ? this._arrowButton2.width :0);
	});

	__static(GScrollBar,
	['sScrollbarHelperPoint',function(){return this.sScrollbarHelperPoint=new Point();}
	]);
	return GScrollBar;
})(GComponent)



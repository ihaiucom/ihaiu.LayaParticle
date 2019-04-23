//class fairygui.GGraph extends fairygui.GObject
var GGraph=(function(_super){
	function GGraph(){
		this._type=0;
		this._lineSize=NaN;
		this._lineColor=null;
		this._fillColor=null;
		this._cornerRadius=null;
		this._hitArea=null;
		GGraph.__super.call(this);
		this._type=0;
		this._lineSize=1;
		this._lineColor="#000000"
		this._fillColor="#FFFFFF";
		this._cornerRadius=null;
	}

	__class(GGraph,'fairygui.GGraph',_super);
	var __proto=GGraph.prototype;
	Laya.imps(__proto,{"fairygui.gears.IColorGear":true})
	__proto.drawRect=function(lineSize,lineColor,fillColor,cornerRadius){
		this._type=1;
		this._lineSize=lineSize;
		this._lineColor=lineColor;
		this._fillColor=fillColor;
		this._cornerRadius=cornerRadius;
		this.drawCommon();
	}

	__proto.drawEllipse=function(lineSize,lineColor,fillColor){
		this._type=2;
		this._lineSize=lineSize;
		this._lineColor=lineColor;
		this._fillColor=fillColor;
		this.drawCommon();
	}

	__proto.drawCommon=function(){
		this._displayObject.mouseEnabled=this.touchable;
		var gr=this._displayObject.graphics;
		gr.clear();
		var w=this.width;
		var h=this.height;
		if(w==0 || h==0)
			return;
		var fillColor=this._fillColor;
		var lineColor=this._lineColor;
		if(Render.isWebGL && ToolSet.startsWith(fillColor,"rgba")){
			var arr=fillColor.substring(5,fillColor.lastIndexOf(")")).split(",");
			var a=parseFloat(arr[3]);
			if(a==0)
				fillColor=null;
			else {
				fillColor=Utils.toHexColor((parseInt(arr[0])<<16)+(parseInt(arr[1])<<8)+parseInt(arr[2]));
				this.alpha=a;
			}
		}
		if (this._type==1){
			if(this._cornerRadius!=null){
				var paths=[
				["moveTo",this._cornerRadius[0],0],
				["lineTo",w-this._cornerRadius[1],0],
				["arcTo",w,0,w,this._cornerRadius[1],this._cornerRadius[1]],
				["lineTo",w,h-this._cornerRadius[3]],
				["arcTo",w,h,w-this._cornerRadius[3],h,this._cornerRadius[3]],
				["lineTo",this._cornerRadius[2],h],
				["arcTo",0,h,0,h-this._cornerRadius[2],this._cornerRadius[2]],
				["lineTo",0,this._cornerRadius[0]],
				["arcTo",0,0,this._cornerRadius[0],0,this._cornerRadius[0]],
				["closePath"]];
				gr.drawPath(0,0,paths,{fillStyle:fillColor},this._lineSize>0?{strokeStyle:lineColor,lineWidth:this._lineSize}:null);
			}
			else
			gr.drawRect(0,0,w,h,fillColor,this._lineSize>0?lineColor:null,this._lineSize);
			}else{
			gr.drawCircle(w/2,h/2,w/2,fillColor,this._lineSize>0?lineColor:null,this._lineSize);
		}
		this._displayObject.repaint();
	}

	__proto.replaceMe=function(target){
		if (!this._parent)
			throw "parent not set";
		target.name=this.name;
		target.alpha=this.alpha;
		target.rotation=this.rotation;
		target.visible=this.visible;
		target.touchable=this.touchable;
		target.grayed=this.grayed;
		target.setXY(this.x,this.y);
		target.setSize(this.width,this.height);
		var index=this._parent.getChildIndex(this);
		this._parent.addChildAt(target,index);
		target.relations.copyFrom(this.relations);
		this._parent.removeChild(this,true);
	}

	__proto.addBeforeMe=function(target){
		if (this._parent==null)
			throw "parent not set";
		var index=this._parent.getChildIndex(this);
		this._parent.addChildAt(target,index);
	}

	__proto.addAfterMe=function(target){
		if (this._parent==null)
			throw "parent not set";
		var index=this._parent.getChildIndex(this);
		index++;
		this._parent.addChildAt(target,index);
	}

	__proto.setNativeObject=function(obj){
		this._type=0;
		this._displayObject.mouseEnabled=this.touchable;
		this._displayObject.graphics.clear();
		this._displayObject.addChild(obj);
	}

	__proto.createDisplayObject=function(){
		_super.prototype.createDisplayObject.call(this);
		this._displayObject.mouseEnabled=false;
		this._hitArea=new HitArea();
		this._hitArea.hit=this._displayObject.graphics;
		this._displayObject.hitArea=this._hitArea;
	}

	__proto.handleSizeChanged=function(){
		_super.prototype.handleSizeChanged.call(this);
		if(this._type !=0)
			this.drawCommon();
	}

	__proto.setup_beforeAdd=function(buffer,beginPos){
		_super.prototype.setup_beforeAdd.call(this,buffer,beginPos);
		buffer.seek(beginPos,5);
		this._type=buffer.readByte();
		if (this._type!=0){
			this._lineSize=buffer.getInt32();
			this._lineColor=buffer.readColorS(true);
			this._fillColor=buffer.readColorS(true);
			if (buffer.readBool()){
				this._cornerRadius=[];
				for (var i=0;i < 4;i++)
				this._cornerRadius[i]=buffer.getFloat32();
			}
			this.drawCommon();
		}
	}

	__getset(0,__proto,'color',function(){
		return this._fillColor;
		},function(value){
		this._fillColor=value;
		if(this._type!=0)
			this.drawCommon();
	});

	return GGraph;
})(GObject)



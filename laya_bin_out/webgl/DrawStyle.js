//class laya.webgl.canvas.DrawStyle
var DrawStyle=(function(){
	function DrawStyle(value){
		this._color=null;
		this.setValue(value);
	}

	__class(DrawStyle,'laya.webgl.canvas.DrawStyle');
	var __proto=DrawStyle.prototype;
	__proto.setValue=function(value){
		if (value){
			this._color=((value instanceof laya.utils.ColorUtils ))?(value):ColorUtils.create(value);
		}
		else this._color=ColorUtils.create("#000000");
	}

	__proto.reset=function(){
		this._color=ColorUtils.create("#000000");
	}

	__proto.toInt=function(){
		return this._color.numColor;
	}

	__proto.equal=function(value){
		if ((typeof value=='string'))return this._color.strColor===value;
		if ((value instanceof laya.utils.ColorUtils ))return this._color.numColor===(value).numColor;
		return false;
	}

	__proto.toColorStr=function(){
		return this._color.strColor;
	}

	DrawStyle.create=function(value){
		if (value){
			var color=((value instanceof laya.utils.ColorUtils ))?(value):ColorUtils.create(value);
			return color._drawStyle || (color._drawStyle=new DrawStyle(value));
		}
		return DrawStyle.DEFAULT;
	}

	__static(DrawStyle,
	['DEFAULT',function(){return this.DEFAULT=new DrawStyle("#000000");}
	]);
	return DrawStyle;
})()



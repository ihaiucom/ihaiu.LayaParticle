//class fairygui.utils.PixelHitTest extends laya.utils.HitArea
var PixelHitTest=(function(_super){
	function PixelHitTest(data,offsetX,offsetY){
		this._data=null;
		this.offsetX=0;
		this.offsetY=0;
		this.scaleX=NaN;
		this.scaleY=NaN;
		PixelHitTest.__super.call(this);
		(offsetX===void 0)&& (offsetX=0);
		(offsetY===void 0)&& (offsetY=0);
		this._data=data;
		this.offsetX=offsetX;
		this.offsetY=offsetY;
		this.scaleX=1;
		this.scaleY=1;
	}

	__class(PixelHitTest,'fairygui.utils.PixelHitTest',_super);
	var __proto=PixelHitTest.prototype;
	__proto.contains=function(x,y){
		x=Math.floor((x / this.scaleX-this.offsetX)*this._data.scale);
		y=Math.floor((y / this.scaleY-this.offsetY)*this._data.scale);
		if (x < 0 || y < 0 || x >=this._data.pixelWidth)
			return false;
		var pos=y *this._data.pixelWidth+x;
		var pos2=Math.floor(pos / 8);
		var pos3=pos % 8;
		if (pos2 >=0 && pos2 < this._data.pixels.length)
			return ((this._data.pixels[pos2] >> pos3)& 0x1)==1;
		else
		return false;
	}

	return PixelHitTest;
})(HitArea)



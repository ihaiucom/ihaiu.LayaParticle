//class fairygui.utils.PixelHitTestData
var PixelHitTestData=(function(){
	function PixelHitTestData(){
		this.pixelWidth=0;
		this.scale=NaN;
		this.pixels=null;
	}

	__class(PixelHitTestData,'fairygui.utils.PixelHitTestData');
	var __proto=PixelHitTestData.prototype;
	__proto.load=function(ba){
		ba.getInt32();
		this.pixelWidth=ba.getInt32();
		this.scale=1/ba.readByte();
		var len=ba.getInt32();
		this.pixels=__newvec(len);
		for(var i=0;i<len;i++){
			var j=ba.readByte();
			if(j<0)
				j+=256;
			this.pixels[i]=j;
		}
	}

	return PixelHitTestData;
})()



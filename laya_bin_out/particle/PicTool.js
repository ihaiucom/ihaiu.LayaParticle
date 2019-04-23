

//class laya.particle.particleUtils.PicTool
var PicTool=(function(){
	function PicTool(){}
	__class(PicTool,'laya.particle.particleUtils.PicTool');
	PicTool.getCanvasPic=function(img,color){
		img=img.bitmap;
		var canvas=new HTMLCanvas();
		var ctx=canvas.getContext('2d');
		canvas.size(img.width,img.height);
		var red=(color >> 16 & 0xFF);
		var green=(color >> 8 & 0xFF);
		var blue=(color & 0xFF);
		if(Render.isConchApp){
			ctx.setFilter(red/255,green/255,blue/255,0);
		}
		ctx.drawImage(img.source||img._source,0,0);
		if (!Render.isConchApp){
			var imgdata=ctx.getImageData(0,0,canvas.width,canvas.height);
			var data=imgdata.data;
			for (var i=0,n=data.length;i < n;i+=4){
				if (data[i+3]==0)continue ;
				data[i]=red;
				data[i+1]=green;
				data[i+2]=blue;
			}
			ctx.putImageData(imgdata,0,0);
		}
		return canvas;
	}

	PicTool.getRGBPic=function(img){
		var rst;
		rst=[new Texture(PicTool.getCanvasPic(img,0xFF0000)),new Texture(PicTool.getCanvasPic(img,0x00FF00)),new Texture(PicTool.getCanvasPic(img,0x0000FF))];
		return rst;
	}

	return PicTool;
})()
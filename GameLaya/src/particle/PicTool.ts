import Texture = Laya.Texture;
import Render = Laya.Render;
import HTMLCanvas = Laya.HTMLCanvas;

export default class PicTool
{
    
    static getCanvasPic(img: any, color: number): any
    {
        img=img.bitmap;
		var canvas=new HTMLCanvas();
		var ctx:any =canvas.getContext('2d');
		canvas.size(img.width, img.height);
		var red=(color >> 16 & 0xFF);
		var green=(color >> 8 & 0xFF);
        var blue=(color & 0xFF);
        
        if(Render.isConchApp)
        {
			ctx.setFilter(red/255,green/255,blue/255,0);
        }
        
        ctx.drawImage(img.source||img._source,0,0);
        
        if (!Render.isConchApp)
        {
			var imgdata=ctx.getImageData(0,0,canvas.width,canvas.height);
			var data=imgdata.data;
            for (var i=0,n=data.length;i < n;i+=4)
            {
				if (data[i+3]==0)continue ;
				data[i]=red;
				data[i+1]=green;
				data[i+2]=blue;
			}
			ctx.putImageData(imgdata,0,0);
		}
		return canvas;

    }


    static getRGBPic(img: any): Array<any>
    {
        var rst;
        rst=[
            new Texture(PicTool.getCanvasPic(img,0xFF0000)),
            new Texture(PicTool.getCanvasPic(img,0x00FF00)),
            new Texture(PicTool.getCanvasPic(img,0x0000FF))
        ];
		return rst;
    }
}
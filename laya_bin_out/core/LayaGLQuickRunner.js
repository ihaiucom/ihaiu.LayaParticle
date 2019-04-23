/**
*<code>/**
*<code>ColorUtils</code> 是一个颜色值处理类。
*/
//class laya.utils.ColorUtils
var ColorUtils=(function(){
	function ColorUtils(value){
		//TODO:delete？
		this.arrColor=[];
		/**字符串型颜色值。*/
		//this.strColor=null;
		/**uint 型颜色值。*/
		//this.numColor=0;
		/**@private TODO:*/
		//this._drawStyle=null;
		if (value==null){
			this.strColor="#00000000";
			this.numColor=0;
			this.arrColor=[0,0,0,0];
			return;
		};
		var i=0,len=0;
		var color=0;
		if ((typeof value=='string')){
			if ((value).indexOf("rgba(")>=0||(value).indexOf("rgb(")>=0){
				var tStr=value;
				var beginI=0,endI=0;
				beginI=tStr.indexOf("(");
				endI=tStr.indexOf(")");
				tStr=tStr.substring(beginI+1,endI);
				this.arrColor=tStr.split(",");
				len=this.arrColor.length;
				for (i=0;i < len;i++){
					this.arrColor[i]=parseFloat(this.arrColor[i]);
					if (i < 3){
						this.arrColor[i]=Math.round(this.arrColor[i]);
					}
				}
				if (this.arrColor.length==4){
					color=((this.arrColor[0] *256+this.arrColor[1])*256+this.arrColor[2])*256+Math.round(this.arrColor[3] *255);
					}else{
					color=((this.arrColor[0] *256+this.arrColor[1])*256+this.arrColor[2]);
				}
				this.strColor=value;
				}else{
				this.strColor=value;
				value.charAt(0)==='#' && (value=value.substr(1));
				len=value.length;
				if (len===3 || len===4){
					var temp="";
					for (i=0;i < len;i++){
						temp+=(value[i]+value[i]);
					}
					value=temp;
				}
				color=parseInt(value,16);
			}
			}else {
			color=value;
			this.strColor=Utils.toHexColor(color);
		}
		if (this.strColor.indexOf("rgba")>=0 || this.strColor.length===9){
			this.arrColor=[((0xFF000000 & color)>>>24)/ 255,((0xFF0000 & color)>> 16)/ 255,((0xFF00 & color)>>8)/ 255,(0xFF & color)/ 255];
			this.numColor=(0xff000000&color)>>>24|(color & 0xff0000)>> 8 | (color & 0x00ff00)<<8 | ((color & 0xff)<<24);
			}else {
			this.arrColor=[((0xFF0000 & color)>> 16)/ 255,((0xFF00 & color)>> 8)/ 255,(0xFF & color)/ 255,1];
			this.numColor=0xff000000|(color & 0xff0000)>> 16 | (color & 0x00ff00)| (color & 0xff)<< 16;
		}
		(this.arrColor).__id=++ColorUtils._COLODID;
	}

	__class(ColorUtils,'laya.utils.ColorUtils');
	ColorUtils._initDefault=function(){
		ColorUtils._DEFAULT={};
		for (var i in ColorUtils._COLOR_MAP)ColorUtils._SAVE[i]=ColorUtils._DEFAULT[i]=new ColorUtils(ColorUtils._COLOR_MAP[i]);
		return ColorUtils._DEFAULT;
	}

	ColorUtils._initSaveMap=function(){
		ColorUtils._SAVE_SIZE=0;
		ColorUtils._SAVE={};
		for (var i in ColorUtils._DEFAULT)ColorUtils._SAVE[i]=ColorUtils._DEFAULT[i];
	}

	ColorUtils.create=function(value){
		var key=value+"";
		var color=ColorUtils._SAVE[key];
		if (color !=null)return color;
		if (ColorUtils._SAVE_SIZE < 1000)ColorUtils._initSaveMap();
		return ColorUtils._SAVE[key]=new ColorUtils(value);
	}

	ColorUtils._SAVE={};
	ColorUtils._SAVE_SIZE=0;
	ColorUtils._COLOR_MAP={"purple":"#800080","orange":"#ffa500","white":'#FFFFFF',"red":'#FF0000',"green":'#00FF00',"blue":'#0000FF',"black":'#000000',"yellow":'#FFFF00','gray':'#808080' };
	ColorUtils._DEFAULT=ColorUtils._initDefault();
	ColorUtils._COLODID=1;
	return ColorUtils;
})()


/**
*@private
*快速节点命令执行器
*多个指令组合才有意义，单个指令没必要在下面加
*/
//class laya.renders.LayaGLQuickRunner
var LayaGLQuickRunner=(function(){
	function LayaGLQuickRunner(){}
	__class(LayaGLQuickRunner,'laya.renders.LayaGLQuickRunner');
	LayaGLQuickRunner.__init__=function(){
		LayaGLQuickRunner.map[ /*laya.display.SpriteConst.ALPHA*/0x01 | /*laya.display.SpriteConst.TRANSFORM*/0x02 | /*laya.display.SpriteConst.GRAPHICS*/0x200]=LayaGLQuickRunner.alpha_transform_drawLayaGL;
		LayaGLQuickRunner.map[ /*laya.display.SpriteConst.ALPHA*/0x01 | /*laya.display.SpriteConst.GRAPHICS*/0x200]=LayaGLQuickRunner.alpha_drawLayaGL;
		LayaGLQuickRunner.map[ /*laya.display.SpriteConst.TRANSFORM*/0x02 | /*laya.display.SpriteConst.GRAPHICS*/0x200]=LayaGLQuickRunner.transform_drawLayaGL;
		LayaGLQuickRunner.map[ /*laya.display.SpriteConst.TRANSFORM*/0x02 | /*laya.display.SpriteConst.CHILDS*/0x2000]=LayaGLQuickRunner.transform_drawNodes;
		LayaGLQuickRunner.map[ /*laya.display.SpriteConst.ALPHA*/0x01 | /*laya.display.SpriteConst.TRANSFORM*/0x02 | /*laya.display.SpriteConst.TEXTURE*/0x100]=LayaGLQuickRunner.alpha_transform_drawTexture;
		LayaGLQuickRunner.map[ /*laya.display.SpriteConst.ALPHA*/0x01 | /*laya.display.SpriteConst.TEXTURE*/0x100]=LayaGLQuickRunner.alpha_drawTexture;
		LayaGLQuickRunner.map[ /*laya.display.SpriteConst.TRANSFORM*/0x02 | /*laya.display.SpriteConst.TEXTURE*/0x100]=LayaGLQuickRunner.transform_drawTexture;
		LayaGLQuickRunner.map[ /*laya.display.SpriteConst.GRAPHICS*/0x200 | /*laya.display.SpriteConst.CHILDS*/0x2000]=LayaGLQuickRunner.drawLayaGL_drawNodes;
	}

	LayaGLQuickRunner.transform_drawTexture=function(sprite,context,x,y){
		var style=sprite._style;
		var tex=sprite.texture;
		context.saveTransform(LayaGLQuickRunner.curMat);
		context.transformByMatrix(sprite.transform,x,y);
		context.drawTexture(tex,-sprite.pivotX,-sprite.pivotY,sprite._width || tex.width,sprite._height || tex.height);
		context.restoreTransform(LayaGLQuickRunner.curMat);
	}

	LayaGLQuickRunner.alpha_drawTexture=function(sprite,context,x,y){
		var style=sprite._style;
		var alpha=NaN;
		var tex=sprite.texture;
		if ((alpha=style.alpha)> 0.01 || sprite._needRepaint()){
			var temp=context.globalAlpha;
			context.globalAlpha *=alpha;
			context.drawTexture(tex,x-style.pivotX+tex.offsetX,y-style.pivotY+tex.offsetY,sprite._width || tex.width,sprite._height || tex.height);
			context.globalAlpha=temp;
		}
	}

	LayaGLQuickRunner.alpha_transform_drawTexture=function(sprite,context,x,y){
		var style=sprite._style;
		var alpha=NaN;
		var tex=sprite.texture;
		if ((alpha=style.alpha)> 0.01 || sprite._needRepaint()){
			var temp=context.globalAlpha;
			context.globalAlpha *=alpha;
			context.saveTransform(LayaGLQuickRunner.curMat);
			context.transformByMatrix(sprite.transform,x,y);
			context.drawTexture(tex,-style.pivotX+tex.offsetX,-style.pivotY+tex.offsetY,sprite._width || tex.width,sprite._height || tex.height);
			context.restoreTransform(LayaGLQuickRunner.curMat);
			context.globalAlpha=temp;
		}
	}

	LayaGLQuickRunner.alpha_transform_drawLayaGL=function(sprite,context,x,y){
		var style=sprite._style;
		var alpha=NaN;
		if ((alpha=style.alpha)> 0.01 || sprite._needRepaint()){
			var temp=context.globalAlpha;
			context.globalAlpha *=alpha;
			context.saveTransform(LayaGLQuickRunner.curMat);
			context.transformByMatrix(sprite.transform,x,y);
			sprite._graphics && sprite._graphics._render(sprite,context,-style.pivotX,-style.pivotY);
			context.restoreTransform(LayaGLQuickRunner.curMat);
			context.globalAlpha=temp;
		}
	}

	LayaGLQuickRunner.alpha_drawLayaGL=function(sprite,context,x,y){
		var style=sprite._style;
		var alpha=NaN;
		if ((alpha=style.alpha)> 0.01 || sprite._needRepaint()){
			var temp=context.globalAlpha;
			context.globalAlpha *=alpha;
			sprite._graphics && sprite._graphics._render(sprite,context,x-style.pivotX,y-style.pivotY);
			context.globalAlpha=temp;
		}
	}

	LayaGLQuickRunner.transform_drawLayaGL=function(sprite,context,x,y){
		var style=sprite._style;
		context.saveTransform(LayaGLQuickRunner.curMat);
		context.transformByMatrix(sprite.transform,x,y);
		sprite._graphics && sprite._graphics._render(sprite,context,-style.pivotX,-style.pivotY);
		context.restoreTransform(LayaGLQuickRunner.curMat);
	}

	LayaGLQuickRunner.transform_drawNodes=function(sprite,context,x,y){
		var textLastRender=sprite._getBit(/*laya.Const.DRAWCALL_OPTIMIZE*/0x100)&& context.drawCallOptimize(true);
		var style=sprite._style;
		context.saveTransform(LayaGLQuickRunner.curMat);
		context.transformByMatrix(sprite.transform,x,y);
		x=-style.pivotX;
		y=-style.pivotY;
		var childs=sprite._children,n=childs.length,ele;
		if (style.viewport){
			var rect=style.viewport;
			var left=rect.x;
			var top=rect.y;
			var right=rect.right;
			var bottom=rect.bottom;
			var _x=NaN,_y=NaN;
			for (i=0;i < n;++i){
				if ((ele=childs [i])._visible && ((_x=ele._x)< right && (_x+ele.width)> left && (_y=ele._y)< bottom && (_y+ele.height)> top)){
					ele.render(context,x,y);
				}
			}
			}else {
			for (var i=0;i < n;++i)
			(ele=(childs [i]))._visible && ele.render(context,x,y);
		}
		context.restoreTransform(LayaGLQuickRunner.curMat);
		textLastRender && context.drawCallOptimize(false);
	}

	LayaGLQuickRunner.drawLayaGL_drawNodes=function(sprite,context,x,y){
		var textLastRender=sprite._getBit(/*laya.Const.DRAWCALL_OPTIMIZE*/0x100)&& context.drawCallOptimize(true);
		var style=sprite._style;
		x=x-style.pivotX;
		y=y-style.pivotY;
		sprite._graphics && sprite._graphics._render(sprite,context,x,y);
		var childs=sprite._children,n=childs.length,ele;
		if (style.viewport){
			var rect=style.viewport;
			var left=rect.x;
			var top=rect.y;
			var right=rect.right;
			var bottom=rect.bottom;
			var _x=NaN,_y=NaN;
			for (i=0;i < n;++i){
				if ((ele=childs [i])._visible && ((_x=ele._x)< right && (_x+ele.width)> left && (_y=ele._y)< bottom && (_y+ele.height)> top)){
					ele.render(context,x,y);
				}
			}
			}else {
			for (var i=0;i < n;++i)
			(ele=(childs [i]))._visible && ele.render(context,x,y);
		}
		textLastRender && context.drawCallOptimize(false);
	}

	LayaGLQuickRunner.map={};
	__static(LayaGLQuickRunner,
	['curMat',function(){return this.curMat=new Matrix();}
	]);
	return LayaGLQuickRunner;
})()


/**
*绘制单个贴图
*/
//class laya.display.cmd.DrawTextureCmd
var DrawTextureCmd=(function(){
	function DrawTextureCmd(){
		/**
		*纹理。
		*/
		//this.texture=null;
		/**
		*（可选）X轴偏移量。
		*/
		//this.x=NaN;
		/**
		*（可选）Y轴偏移量。
		*/
		//this.y=NaN;
		/**
		*（可选）宽度。
		*/
		//this.width=NaN;
		/**
		*（可选）高度。
		*/
		//this.height=NaN;
		/**
		*（可选）矩阵信息。
		*/
		//this.matrix=null;
		/**
		*（可选）透明度。
		*/
		//this.alpha=NaN;
		/**
		*（可选）颜色滤镜。
		*/
		//this.color=null;
		//this.colorFlt=null;
		/**
		*（可选）混合模式。
		*/
		//this.blendMode=null;
	}

	__class(DrawTextureCmd,'laya.display.cmd.DrawTextureCmd');
	var __proto=DrawTextureCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this.texture._removeReference();
		this.texture=null;
		this.matrix=null;
		Pool.recover("DrawTextureCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.drawTextureWithTransform(this.texture,this.x,this.y,this.width,this.height,this.matrix,gx,gy,this.alpha,this.blendMode,this.colorFlt);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "DrawTexture";
	});

	DrawTextureCmd.create=function(texture,x,y,width,height,matrix,alpha,color,blendMode){
		var cmd=Pool.getItemByClass("DrawTextureCmd",DrawTextureCmd);
		cmd.texture=texture;
		texture._addReference();
		cmd.x=x;
		cmd.y=y;
		cmd.width=width;
		cmd.height=height;
		cmd.matrix=matrix;
		cmd.alpha=alpha;
		cmd.color=color;
		cmd.blendMode=blendMode;
		if (color){
			cmd.colorFlt=new ColorFilter();
			cmd.colorFlt.setColor(color);
		}
		return cmd;
	}

	DrawTextureCmd.ID="DrawTexture";
	return DrawTextureCmd;
})()


/**

*/
*/
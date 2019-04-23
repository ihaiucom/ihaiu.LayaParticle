/**
*<code>/**
*<code>Filter</code> 是滤镜基类。
*/
//class laya.filters.Filter
var Filter=(function(){
	function Filter(){
		/**@private */
		this._action=null;
		/**@private*/
		this._glRender=null;
	}

	__class(Filter,'laya.filters.Filter');
	var __proto=Filter.prototype;
	Laya.imps(__proto,{"laya.filters.IFilter":true})
	/**@private 滤镜类型。*/
	__getset(0,__proto,'type',function(){return-1});
	Filter.BLUR=0x10;
	Filter.COLOR=0x20;
	Filter.GLOW=0x08;
	Filter._filter=null;
	Filter._recycleScope=null;
	return Filter;
})()


/**
*裁剪命令
*/
//class laya.display.cmd.ClipRectCmd
var ClipRectCmd=(function(){
	function ClipRectCmd(){
		/**
		*X 轴偏移量。
		*/
		//this.x=NaN;
		/**
		*Y 轴偏移量。
		*/
		//this.y=NaN;
		/**
		*宽度。
		*/
		//this.width=NaN;
		/**
		*高度。
		*/
		//this.height=NaN;
	}

	__class(ClipRectCmd,'laya.display.cmd.ClipRectCmd');
	var __proto=ClipRectCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("ClipRectCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.clipRect(this.x+gx,this.y+gy,this.width,this.height);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "ClipRect";
	});

	ClipRectCmd.create=function(x,y,width,height){
		var cmd=Pool.getItemByClass("ClipRectCmd",ClipRectCmd);
		cmd.x=x;
		cmd.y=y;
		cmd.width=width;
		cmd.height=height;
		return cmd;
	}

	ClipRectCmd.ID="ClipRect";
	return ClipRectCmd;
})()


/**
*绘制图片
*/
//class laya.display.cmd.DrawImageCmd
var DrawImageCmd=(function(){
	function DrawImageCmd(){
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
	}

	__class(DrawImageCmd,'laya.display.cmd.DrawImageCmd');
	var __proto=DrawImageCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this.texture._removeReference();
		this.texture=null;
		Pool.recover("DrawImageCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.drawTexture(this.texture,this.x+gx,this.y+gy,this.width,this.height);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "DrawImage";
	});

	DrawImageCmd.create=function(texture,x,y,width,height){
		var cmd=Pool.getItemByClass("DrawImageCmd",DrawImageCmd);
		cmd.texture=texture;
		texture._addReference();
		cmd.x=x;
		cmd.y=y;
		cmd.width=width;
		cmd.height=height;
		return cmd;
	}

	DrawImageCmd.ID="DrawImage";
	return DrawImageCmd;
})()


/**
*绘制多边形
*/
//class laya.display.cmd.DrawPolyCmd
var DrawPolyCmd=(function(){
	function DrawPolyCmd(){
		/**
		*开始绘制的 X 轴位置。
		*/
		//this.x=NaN;
		/**
		*开始绘制的 Y 轴位置。
		*/
		//this.y=NaN;
		/**
		*多边形的点集合。
		*/
		//this.points=null;
		/**
		*填充颜色，或者填充绘图的渐变对象。
		*/
		//this.fillColor=null;
		/**
		*（可选）边框颜色，或者填充绘图的渐变对象。
		*/
		//this.lineColor=null;
		/**
		*可选）边框宽度。
		*/
		//this.lineWidth=NaN;
		/**@private */
		//this.isConvexPolygon=false;
		/**@private */
		//this.vid=0;
	}

	__class(DrawPolyCmd,'laya.display.cmd.DrawPolyCmd');
	var __proto=DrawPolyCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this.points=null;
		this.fillColor=null;
		this.lineColor=null;
		Pool.recover("DrawPolyCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context._drawPoly(this.x+gx,this.y+gy,this.points,this.fillColor,this.lineColor,this.lineWidth,this.isConvexPolygon,this.vid);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "DrawPoly";
	});

	DrawPolyCmd.create=function(x,y,points,fillColor,lineColor,lineWidth,isConvexPolygon,vid){
		var cmd=Pool.getItemByClass("DrawPolyCmd",DrawPolyCmd);
		cmd.x=x;
		cmd.y=y;
		cmd.points=points;
		cmd.fillColor=fillColor;
		cmd.lineColor=lineColor;
		cmd.lineWidth=lineWidth;
		cmd.isConvexPolygon=isConvexPolygon;
		cmd.vid=vid;
		return cmd;
	}

	DrawPolyCmd.ID="DrawPoly";
	return DrawPolyCmd;
})()


/**
*<p>资源版本的生成由layacmd或IDE完成，使用 <code>ResourceVersion</code> 简化使用过程。</p>
*<p>调用 <code>enable</code> 启用资源版本管理。</p>
*/
//class laya.net.ResourceVersion
var ResourceVersion=(function(){
	function ResourceVersion(){}
	__class(ResourceVersion,'laya.net.ResourceVersion');
	ResourceVersion.enable=function(manifestFile,callback,type){
		(type===void 0)&& (type=2);
		laya.net.ResourceVersion.type=type;
		Laya.loader.load(manifestFile,Handler.create(null,ResourceVersion.onManifestLoaded,[callback]),null,/*laya.net.Loader.JSON*/"json");
		URL.customFormat=ResourceVersion.addVersionPrefix;
	}

	ResourceVersion.onManifestLoaded=function(callback,data){
		ResourceVersion.manifest=data;
		callback.run();
		if (!data){
			console.warn("资源版本清单文件不存在，不使用资源版本管理。忽略ERR_FILE_NOT_FOUND错误。");
		}
	}

	ResourceVersion.addVersionPrefix=function(originURL){
		originURL=URL.getAdptedFilePath(originURL);
		if (ResourceVersion.manifest && ResourceVersion.manifest[originURL]){
			if (ResourceVersion.type==2)return ResourceVersion.manifest[originURL];
			return ResourceVersion.manifest[originURL]+"/"+originURL;
		}
		return originURL;
	}

	ResourceVersion.FOLDER_VERSION=1;
	ResourceVersion.FILENAME_VERSION=2;
	ResourceVersion.manifest=null;
	ResourceVersion.type=1;
	return ResourceVersion;
})()


/**

*/
*/
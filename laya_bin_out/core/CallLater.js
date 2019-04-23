/**
*<code>/**
*<code>/**
*<code>Log</code> 类用于在界面内显示日志记录信息。
*注意：在加速器内不可使用
*/
//class laya.utils.Log
var Log=(function(){
	function Log(){}
	__class(Log,'laya.utils.Log');
	Log.enable=function(){
		if (!Log._logdiv){
			Log._logdiv=Browser.createElement('div');
			Log._logdiv.style.cssText="border:white;padding:4px;overflow-y:auto;z-index:1000000;background:rgba(100,100,100,0.6);color:white;position: absolute;left:0px;top:0px;width:50%;height:50%;";
			Browser.document.body.appendChild(Log._logdiv);
			Log._btn=Browser.createElement("button");
			Log._btn.innerText="Hide";
			Log._btn.style.cssText="z-index:1000001;position: absolute;left:10px;top:10px;";
			Log._btn.onclick=Log.toggle;
			Browser.document.body.appendChild(Log._btn);
		}
	}

	Log.toggle=function(){
		var style=Log._logdiv.style;
		if (style.display===""){
			Log._btn.innerText="Show";
			style.display="none";
			}else {
			Log._btn.innerText="Hide";
			style.display="";
		}
	}

	Log.print=function(value){
		if (Log._logdiv){
			if (Log._count >=Log.maxCount)Log.clear();
			Log._count++;
			Log._logdiv.innerText+=value+"\n";
			if (Log.autoScrollToBottom){
				if (Log._logdiv.scrollHeight-Log._logdiv.scrollTop-Log._logdiv.clientHeight < 50){
					Log._logdiv.scrollTop=Log._logdiv.scrollHeight;
				}
			}
		}
	}

	Log.clear=function(){
		Log._logdiv.innerText="";
		Log._count=0;
	}

	Log._logdiv=null;
	Log._btn=null;
	Log._count=0;
	Log.maxCount=50;
	Log.autoScrollToBottom=true;
	return Log;
})()


/**
*@private
*/
//class laya.net.AtlasInfoManager
var AtlasInfoManager=(function(){
	function AtlasInfoManager(){}
	__class(AtlasInfoManager,'laya.net.AtlasInfoManager');
	AtlasInfoManager.enable=function(infoFile,callback){
		Laya.loader.load(infoFile,Handler.create(null,AtlasInfoManager._onInfoLoaded,[callback]),null,/*laya.net.Loader.JSON*/"json");
	}

	AtlasInfoManager._onInfoLoaded=function(callback,data){
		var tKey;
		var tPrefix;
		var tArr;
		var i=0,len=0;
		for (tKey in data){
			tArr=data[tKey];
			tPrefix=tArr[0];
			tArr=tArr[1];
			len=tArr.length;
			for (i=0;i < len;i++){
				AtlasInfoManager._fileLoadDic[tPrefix+tArr[i]]=tKey;
			}
		}
		callback && callback.run();
	}

	AtlasInfoManager.getFileLoadPath=function(file){
		return AtlasInfoManager._fileLoadDic[file] || file;
	}

	AtlasInfoManager._fileLoadDic={};
	return AtlasInfoManager;
})()


/**
*@private
*/
//class laya.utils.CallLater
var CallLater=(function(){
	var LaterHandler;
	function CallLater(){
		/**@private */
		this._pool=[];
		/**@private */
		this._map=[];
		/**@private */
		this._laters=[];
	}

	__class(CallLater,'laya.utils.CallLater');
	var __proto=CallLater.prototype;
	/**
	*@private
	*帧循环处理函数。
	*/
	__proto._update=function(){
		var laters=this._laters;
		var len=laters.length;
		if (len > 0){
			for (var i=0,n=len-1;i <=n;i++){
				var handler=laters[i];
				this._map[handler.key]=null;
				if (handler.method!==null){
					handler.run();
					handler.clear();
				}
				this._pool.push(handler);
				i===n && (n=laters.length-1);
			}
			laters.length=0;
		}
	}

	/**@private */
	__proto._getHandler=function(caller,method){
		var cid=caller ? caller.$_GID || (caller.$_GID=Utils.getGID()):0;
		var mid=method.$_TID || (method.$_TID=(Timer._mid++)*100000);
		return this._map[cid+mid];
	}

	/**
	*延迟执行。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*@param args 回调参数。
	*/
	__proto.callLater=function(caller,method,args){
		if (this._getHandler(caller,method)==null){
			if (this._pool.length)
				var handler=this._pool.pop();
			else handler=new LaterHandler();
			handler.caller=caller;
			handler.method=method;
			handler.args=args;
			var cid=caller ? caller.$_GID :0;
			var mid=method["$_TID"];
			handler.key=cid+mid;
			this._map[handler.key]=handler
			this._laters.push(handler);
		}
	}

	/**
	*立即执行 callLater 。
	*@param caller 执行域(this)。
	*@param method 定时器回调函数。
	*/
	__proto.runCallLater=function(caller,method){
		var handler=this._getHandler(caller,method);
		if (handler && handler.method !=null){
			this._map[handler.key]=null;
			handler.run();
			handler.clear();
		}
	}

	CallLater.I=new CallLater();
	CallLater.__init$=function(){
		/**@private */
		//class LaterHandler
		LaterHandler=(function(){
			function LaterHandler(){
				this.key=0;
				this.caller=null;
				this.method=null;
				this.args=null;
			}
			__class(LaterHandler,'');
			var __proto=LaterHandler.prototype;
			__proto.clear=function(){
				this.caller=null;
				this.method=null;
				this.args=null;
			}
			__proto.run=function(){
				var caller=this.caller;
				if (caller && caller.destroyed)return this.clear();
				var method=this.method;
				var args=this.args;
				if (method==null)return;
				args ? method.apply(caller,args):method.call(caller);
			}
			return LaterHandler;
		})()
	}

	return CallLater;
})()


/**
*根据路径绘制矢量图形
*/
//class laya.display.cmd.DrawPathCmd
var DrawPathCmd=(function(){
	function DrawPathCmd(){
		/**
		*开始绘制的 X 轴位置。
		*/
		//this.x=NaN;
		/**
		*开始绘制的 Y 轴位置。
		*/
		//this.y=NaN;
		/**
		*路径集合，路径支持以下格式：[["moveTo",x,y],["lineTo",x,y],["arcTo",x1,y1,x2,y2,r],["closePath"]]。
		*/
		//this.paths=null;
		/**
		*（可选）刷子定义，支持以下设置{fillStyle:"#FF0000"}。
		*/
		//this.brush=null;
		/**
		*（可选）画笔定义，支持以下设置{strokeStyle,lineWidth,lineJoin:"bevel|round|miter",lineCap:"butt|round|square",miterLimit}。
		*/
		//this.pen=null;
	}

	__class(DrawPathCmd,'laya.display.cmd.DrawPathCmd');
	var __proto=DrawPathCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this.paths=null;
		this.brush=null;
		this.pen=null;
		Pool.recover("DrawPathCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context._drawPath(this.x+gx,this.y+gy,this.paths,this.brush,this.pen);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "DrawPath";
	});

	DrawPathCmd.create=function(x,y,paths,brush,pen){
		var cmd=Pool.getItemByClass("DrawPathCmd",DrawPathCmd);
		cmd.x=x;
		cmd.y=y;
		cmd.paths=paths;
		cmd.brush=brush;
		cmd.pen=pen;
		return cmd;
	}

	DrawPathCmd.ID="DrawPath";
	return DrawPathCmd;
})()


/**
*绘制三角形命令
*/
//class laya.display.cmd.DrawTrianglesCmd
var DrawTrianglesCmd=(function(){
	function DrawTrianglesCmd(){
		/**
		*纹理。
		*/
		//this.texture=null;
		/**
		*X轴偏移量。
		*/
		//this.x=NaN;
		/**
		*Y轴偏移量。
		*/
		//this.y=NaN;
		/**
		*顶点数组。
		*/
		//this.vertices=null;
		/**
		*UV数据。
		*/
		//this.uvs=null;
		/**
		*顶点索引。
		*/
		//this.indices=null;
		/**
		*缩放矩阵。
		*/
		//this.matrix=null;
		/**
		*alpha
		*/
		//this.alpha=NaN;
		/**
		*blend模式
		*/
		//this.blendMode=null;
		/**
		*颜色变换
		*/
		//this.color=null;
	}

	__class(DrawTrianglesCmd,'laya.display.cmd.DrawTrianglesCmd');
	var __proto=DrawTrianglesCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this.texture=null;
		this.vertices=null;
		this.uvs=null;
		this.indices=null;
		this.matrix=null;
		Pool.recover("DrawTrianglesCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.drawTriangles(this.texture,this.x+gx,this.y+gy,this.vertices,this.uvs,this.indices,this.matrix,this.alpha,this.color,this.blendMode);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "DrawTriangles";
	});

	DrawTrianglesCmd.create=function(texture,x,y,vertices,uvs,indices,matrix,alpha,color,blendMode){
		var cmd=Pool.getItemByClass("DrawTrianglesCmd",DrawTrianglesCmd);
		cmd.texture=texture;
		cmd.x=x;
		cmd.y=y;
		cmd.vertices=vertices;
		cmd.uvs=uvs;
		cmd.indices=indices;
		cmd.matrix=matrix;
		cmd.alpha=alpha;
		if (color){
			cmd.color=new ColorFilter();
			var c=ColorUtils.create(color).arrColor;
			cmd.color.color(c[0]*255,c[1]*255,c[2]*255,c[3]*255);
		}
		cmd.blendMode=blendMode;
		return cmd;
	}

	DrawTrianglesCmd.ID="DrawTriangles";
	return DrawTrianglesCmd;
})()


/**
*<p> <code>Stat</code> 是一个性能统计面板，可以实时更新相关的性能参数。</p>
*<p>参与统计的性能参数如下（所有参数都是每大约1秒进行更新）：<br/>
*FPS(Canvas)/FPS(WebGL)：Canvas 模式或者 WebGL 模式下的帧频，也就是每秒显示的帧数，值越高、越稳定，感觉越流畅；<br/>
*Sprite：统计所有渲染节点（包括容器）数量，它的大小会影响引擎进行节点遍历、数据组织和渲染的效率。其值越小，游戏运行效率越高；<br/>
*DrawCall：此值是决定性能的重要指标，其值越小，游戏运行效率越高。Canvas模式下表示每大约1秒的图像绘制次数；WebGL模式下表示每大约1秒的渲染提交批次，每次准备数据并通知GPU渲染绘制的过程称为1次DrawCall，在每次DrawCall中除了在通知GPU的渲染上比较耗时之外，切换材质与shader也是非常耗时的操作；<br/>
*CurMem：Canvas模式下，表示内存占用大小，值越小越好，过高会导致游戏闪退；WebGL模式下，表示内存与显存的占用，值越小越好；<br/>
*Shader：是 WebGL 模式独有的性能指标，表示每大约1秒 Shader 提交次数，值越小越好；<br/>
*Canvas：由三个数值组成，只有设置 CacheAs 后才会有值，默认为0/0/0。从左到右数值的意义分别为：每帧重绘的画布数量 / 缓存类型为"normal"类型的画布数量 / 缓存类型为"bitmap"类型的画布数量。</p>
*/
//class laya.utils.Stat
var Stat=(function(){
	function Stat(){}
	__class(Stat,'laya.utils.Stat');
	/**
	*点击性能统计显示区域的处理函数。
	*/
	__getset(1,Stat,'onclick',null,function(fn){
		if (Stat._sp){
			Stat._sp.on("click",Stat._sp,fn);
		}
		if (Stat._canvas){
			Stat._canvas.source.onclick=fn;
			Stat._canvas.source.style.pointerEvents='';
		}
	});

	Stat.show=function(x,y){
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		if (!Browser.onMiniGame && !Browser.onLimixiu)Stat._useCanvas=true;
		Stat._show=true;
		Stat._fpsData.length=60;
		if (Render.isConchApp){
			Stat._view[0]={title:"FPS",value:"_fpsStr",color:"yellow",units:"int"};
			}else {
			Stat._view[0]={title:"FPS(Canvas)",value:"_fpsStr",color:"yellow",units:"int"};
		}
		Stat._view[1]={title:"Sprite",value:"_spriteStr",color:"white",units:"int"};
		Stat._view[2]={title:"RenderBatch",value:"renderBatch",color:"white",units:"int"};
		Stat._view[3]={title:"CPUMemory",value:"cpuMemory",color:"yellow",units:"M"};
		Stat._view[4]={title:"GPUMemory",value:"gpuMemory",color:"yellow",units:"M"};
		if (Render.isWebGL){
			Stat._view[5]={title:"Shader",value:"shaderCall",color:"white",units:"int"};
			if (!Render.is3DMode){
				Stat._view[0].title="FPS(WebGL)";
				Stat._view[6]={title:"Canvas",value:"_canvasStr",color:"white",units:"int"};
				}else {
				Stat._view[0].title="FPS(3D)";
				Stat._view[6]={title:"TriFaces",value:"trianglesFaces",color:"white",units:"int"};
			}
		}else {}
		if (Stat._useCanvas){
			Stat.createUIPre(x,y);
		}else
		Stat.createUI(x,y);
		Stat.enable();
	}

	Stat.createUIPre=function(x,y){
		var pixel=Browser.pixelRatio;
		Stat._width=pixel *130;
		Stat._vx=pixel *75;
		Stat._height=pixel *(Stat._view.length *12+3 *pixel)+4;
		Stat._fontSize=12 *pixel;
		for (var i=0;i < Stat._view.length;i++){
			Stat._view[i].x=4;
			Stat._view[i].y=i *Stat._fontSize+2 *pixel;
		}
		if (Render.isConchApp){
			Stat._sp=new Sprite();
			Stat._titleSp=new Sprite();
			Stat._bgSp=new Sprite();
			Stat._bgSp.graphics.drawRect(x,y,Stat._width,Stat._height,"#969696");
			Stat._bgSp.alpha=0.8;
			Stat._sp.zOrder=100000;
			Stat._titleSp.zOrder=100000;
			Stat._bgSp.zOrder=100000;
			Stat._bgSp.addChild(Stat._sp);
			Stat._bgSp.addChild(Stat._titleSp);
			Laya.stage.addChild(Stat._bgSp);
			}else {
			if (!Stat._canvas){
				Stat._canvas=new HTMLCanvas(true);
				Stat._canvas.size(Stat._width,Stat._height);
				Stat._ctx=Stat._canvas.getContext('2d');
				Stat._ctx.textBaseline="top";
				Stat._ctx.font=Stat._fontSize+"px Arial";
				Stat._canvas.source.style.cssText="pointer-events:none;background:rgba(150,150,150,0.8);z-index:100000;position: absolute;direction:ltr;left:"+x+"px;top:"+y+"px;width:"+(Stat._width / pixel)+"px;height:"+(Stat._height / pixel)+"px;";
			}
			Browser.container.appendChild(Stat._canvas.source);
		}
		Stat._first=true;
		Stat.loop();
		Stat._first=false;
	}

	Stat.createUI=function(x,y){
		var stat=Stat._sp;
		var pixel=Browser.pixelRatio;
		if (!stat){
			stat=new Sprite();
			Stat._leftText=new Text();
			Stat._leftText.pos(5,5);
			Stat._leftText.color="#ffffff";
			stat.addChild(Stat._leftText);
			Stat._txt=new Text();
			Stat._txt.pos(80 *pixel,5);
			Stat._txt.color="#ffffff";
			stat.addChild(Stat._txt);
			Stat._sp=stat;
		}
		stat.pos(x,y);
		var text="";
		for (var i=0;i < Stat._view.length;i++){
			var one=Stat._view[i];
			text+=one.title+"\n";
		}
		Stat._leftText.text=text;
		var width=pixel *138;
		var height=pixel *(Stat._view.length *12+3 *pixel)+4;
		Stat._txt.fontSize=Stat._fontSize *pixel;
		Stat._leftText.fontSize=Stat._fontSize *pixel;
		stat.size(width,height);
		stat.graphics.clear();
		stat.graphics.alpha(0.5);
		stat.graphics.drawRect(0,0,width,height,"#999999");
		stat.graphics.alpha(2);
		Stat.loop();
	}

	Stat.enable=function(){
		Laya.systemTimer.frameLoop(1,Stat,Stat.loop);
	}

	Stat.hide=function(){
		Stat._show=false;
		Laya.systemTimer.clear(Stat,Stat.loop);
		if (Stat._canvas){
			Browser.removeElement(Stat._canvas.source);
		}
	}

	Stat.clear=function(){
		Stat.trianglesFaces=Stat.renderBatch=Stat.shaderCall=Stat.spriteCount=Stat.spriteRenderUseCacheCount=Stat.treeNodeCollision=Stat.treeSpriteCollision=Stat.canvasNormal=Stat.canvasBitmap=Stat.canvasReCache=0;
	}

	Stat.loop=function(){
		Stat._count++;
		var timer=Browser.now();
		if (timer-Stat._timer < 1000)return;
		var count=Stat._count;
		Stat.FPS=Math.round((count *1000)/ (timer-Stat._timer));
		if (Stat._show){
			Stat.trianglesFaces=Math.round(Stat.trianglesFaces / count);
			if (!Stat._useCanvas){
				Stat.renderBatch=Math.round(Stat.renderBatch / count)-1;
				Stat.shaderCall=Math.round(Stat.shaderCall / count);
				Stat.spriteCount=Math.round(Stat.spriteCount / count)-4;
				}else {
				Stat.renderBatch=Math.round(Stat.renderBatch / count);
				Stat.shaderCall=Math.round(Stat.shaderCall / count);
				Stat.spriteCount=Math.round(Stat.spriteCount / count)-1;
			}
			Stat.spriteRenderUseCacheCount=Math.round(Stat.spriteRenderUseCacheCount / count);
			Stat.canvasNormal=Math.round(Stat.canvasNormal / count);
			Stat.canvasBitmap=Math.round(Stat.canvasBitmap / count);
			Stat.canvasReCache=Math.ceil(Stat.canvasReCache / count);
			Stat.treeNodeCollision=Math.round(Stat.treeNodeCollision / count);
			Stat.treeSpriteCollision=Math.round(Stat.treeSpriteCollision / count);
			var delay=Stat.FPS > 0 ? Math.floor(1000 / Stat.FPS).toString():" ";
			Stat._fpsStr=Stat.FPS+(Stat.renderSlow ? " slow" :"")+" "+delay;
			Stat._spriteStr=Stat.spriteCount+(Stat.spriteRenderUseCacheCount ? ("/"+Stat.spriteRenderUseCacheCount):'');
			Stat._canvasStr=Stat.canvasReCache+"/"+Stat.canvasNormal+"/"+Stat.canvasBitmap;
			Stat.cpuMemory=Resource.cpuMemory;
			Stat.gpuMemory=Resource.gpuMemory;
			if (Stat._useCanvas){
				Stat.renderInfoPre();
			}else
			Stat.renderInfo();
			Stat.clear();
		}
		Stat._count=0;
		Stat._timer=timer;
	}

	Stat.renderInfoPre=function(){
		var i=0;
		var one;
		var value;
		if (Render.isConchApp){
			Stat._sp.graphics.clear();
			for (i=0;i < Stat._view.length;i++){
				one=Stat._view[i];
				if (Stat._first){
					Stat._titleSp.graphics.fillText(one.title,one.x,one.y,Stat._fontSize+"px Arial","#ffffff","left");
				}
				value=Stat[one.value];
				(one.units=="M")&& (value=Math.floor(value / (1024 *1024)*100)/ 100+" M");
				Stat._sp.graphics.fillText(value+"",one.x+Stat._vx,one.y,Stat._fontSize+"px Arial",one.color,"left");
			}
			}else {
			if (Stat._canvas){
				var ctx=Stat._ctx;
				ctx.clearRect(Stat._first ? 0 :Stat._vx,0,Stat._width,Stat._height);
				for (i=0;i < Stat._view.length;i++){
					one=Stat._view[i];
					if (Stat._first){
						ctx.fillStyle="white";
						ctx.fillText(one.title,one.x,one.y);
					}
					ctx.fillStyle=one.color;
					value=Stat[one.value];
					(one.units=="M")&& (value=Math.floor(value / (1024 *1024)*100)/ 100+" M");
					ctx.fillText(value+"",one.x+Stat._vx,one.y);
				}
			}
		}
	}

	Stat.renderInfo=function(){
		var text="";
		for (var i=0;i < Stat._view.length;i++){
			var one=Stat._view[i];
			var value=Stat[one.value];
			(one.units=="M")&& (value=Math.floor(value / (1024 *1024)*100)/ 100+" M");
			(one.units=="K")&& (value=Math.floor(value / (1024)*100)/ 100+" K");
			text+=value+"\n";
		}
		Stat._txt.text=text;
	}

	Stat.FPS=0;
	Stat.loopCount=0;
	Stat.shaderCall=0;
	Stat.renderBatch=0;
	Stat.trianglesFaces=0;
	Stat.spriteCount=0;
	Stat.spriteRenderUseCacheCount=0;
	Stat.treeNodeCollision=0;
	Stat.treeSpriteCollision=0;
	Stat.canvasNormal=0;
	Stat.canvasBitmap=0;
	Stat.canvasReCache=0;
	Stat.renderSlow=false;
	Stat.gpuMemory=0;
	Stat.cpuMemory=0;
	Stat._fpsStr=null;
	Stat._canvasStr=null;
	Stat._spriteStr=null;
	Stat._fpsData=[];
	Stat._timer=0;
	Stat._count=0;
	Stat._view=[];
	Stat._fontSize=12;
	Stat._txt=null;
	Stat._leftText=null;
	Stat._sp=null;
	Stat._titleSp=null;
	Stat._bgSp=null;
	Stat._show=false;
	Stat._useCanvas=false;
	Stat._canvas=null;
	Stat._ctx=null;
	Stat._first=false;
	Stat._vx=NaN;
	Stat._width=0;
	Stat._height=100;
	return Stat;
})()


/**
*@private
*Graphic bounds数据类
*/
//class laya.display.css.BoundsStyle
var BoundsStyle=(function(){
	function BoundsStyle(){
		/**@private */
		//this.bounds=null;
		/**用户设的bounds*/
		//this.userBounds=null;
		/**缓存的bounds顶点,sprite计算bounds用*/
		//this.temBM=null;
	}

	__class(BoundsStyle,'laya.display.css.BoundsStyle');
	var __proto=BoundsStyle.prototype;
	/**
	*重置
	*/
	__proto.reset=function(){
		if(this.bounds)this.bounds.recover();
		if(this.userBounds)this.userBounds.recover();
		this.bounds=null;
		this.userBounds=null;
		this.temBM=null;
		return this;
	}

	/**
	*回收
	*/
	__proto.recover=function(){
		Pool.recover("BoundsStyle",this.reset());
	}

	BoundsStyle.create=function(){
		return Pool.getItemByClass("BoundsStyle",BoundsStyle);
	}

	return BoundsStyle;
})()


/**
*绘制扇形
*/
//class laya.display.cmd.DrawPieCmd
var DrawPieCmd=(function(){
	function DrawPieCmd(){
		/**
		*开始绘制的 X 轴位置。
		*/
		//this.x=NaN;
		/**
		*开始绘制的 Y 轴位置。
		*/
		//this.y=NaN;
		/**
		*扇形半径。
		*/
		//this.radius=NaN;
		//this._startAngle=NaN;
		//this._endAngle=NaN;
		/**
		*填充颜色，或者填充绘图的渐变对象。
		*/
		//this.fillColor=null;
		/**
		*（可选）边框颜色，或者填充绘图的渐变对象。
		*/
		//this.lineColor=null;
		/**
		*（可选）边框宽度。
		*/
		//this.lineWidth=NaN;
		/**@private */
		//this.vid=0;
	}

	__class(DrawPieCmd,'laya.display.cmd.DrawPieCmd');
	var __proto=DrawPieCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this.fillColor=null;
		this.lineColor=null;
		Pool.recover("DrawPieCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context._drawPie(this.x+gx,this.y+gy,this.radius,this._startAngle,this._endAngle,this.fillColor,this.lineColor,this.lineWidth,this.vid);
	}

	/**
	*开始角度。
	*/
	__getset(0,__proto,'startAngle',function(){
		return this._startAngle *180 / Math.PI;
		},function(value){
		this._startAngle=value *Math.PI / 180;
	});

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "DrawPie";
	});

	/**
	*结束角度。
	*/
	__getset(0,__proto,'endAngle',function(){
		return this._endAngle *180 / Math.PI;
		},function(value){
		this._endAngle=value *Math.PI / 180;
	});

	DrawPieCmd.create=function(x,y,radius,startAngle,endAngle,fillColor,lineColor,lineWidth,vid){
		var cmd=Pool.getItemByClass("DrawPieCmd",DrawPieCmd);
		cmd.x=x;
		cmd.y=y;
		cmd.radius=radius;
		cmd._startAngle=startAngle;
		cmd._endAngle=endAngle;
		cmd.fillColor=fillColor;
		cmd.lineColor=lineColor;
		cmd.lineWidth=lineWidth;
		cmd.vid=vid;
		return cmd;
	}

	DrawPieCmd.ID="DrawPie";
	return DrawPieCmd;
})()


/**
*<p><code>KeyLocation</code> 类包含表示在键盘或类似键盘的输入设备上按键位置的常量。</p>
*<p><code>KeyLocation</code> 常数用在键盘事件对象的 <code>keyLocation </code>属性中。</p>
*/
//class laya.events.KeyLocation
var KeyLocation=(function(){
	function KeyLocation(){}
	__class(KeyLocation,'laya.events.KeyLocation');
	KeyLocation.STANDARD=0;
	KeyLocation.LEFT=1;
	KeyLocation.RIGHT=2;
	KeyLocation.NUM_PAD=3;
	return KeyLocation;
})()


/**
*@private
*基于个数的对象缓存管理器
*/
//class laya.utils.PoolCache
var PoolCache=(function(){
	function PoolCache(){
		/**
		*对象在Pool中的标识
		*/
		this.sign=null;
		/**
		*允许缓存的最大数量
		*/
		this.maxCount=1000;
	}

	__class(PoolCache,'laya.utils.PoolCache');
	var __proto=PoolCache.prototype;
	/**
	*获取缓存的对象列表
	*@return
	*
	*/
	__proto.getCacheList=function(){
		return Pool.getPoolBySign(this.sign);
	}

	/**
	*尝试清理缓存
	*@param force 是否强制清理
	*
	*/
	__proto.tryDispose=function(force){
		var list;
		list=Pool.getPoolBySign(this.sign);
		if (list.length > this.maxCount){
			list.splice(this.maxCount,list.length-this.maxCount);
		}
	}

	PoolCache.addPoolCacheManager=function(sign,maxCount){
		(maxCount===void 0)&& (maxCount=100);
		var cache;
		cache=new PoolCache();
		cache.sign=sign;
		cache.maxCount=maxCount;
		CacheManger.regCacheByFunction(Utils.bind(cache.tryDispose,cache),Utils.bind(cache.getCacheList,cache));
	}

	return PoolCache;
})()


/**
*填充文字命令
*@private
*/
//class laya.display.cmd.FillWordsCmd
var FillWordsCmd=(function(){
	function FillWordsCmd(){
		/**
		*文字数组
		*/
		//this.words=null;
		/**
		*开始绘制文本的 x 坐标位置（相对于画布）。
		*/
		//this.x=NaN;
		/**
		*开始绘制文本的 y 坐标位置（相对于画布）。
		*/
		//this.y=NaN;
		/**
		*定义字体和字号，比如"20px Arial"。
		*/
		//this.font=null;
		/**
		*定义文本颜色，比如"#ff0000"。
		*/
		//this.color=null;
	}

	__class(FillWordsCmd,'laya.display.cmd.FillWordsCmd');
	var __proto=FillWordsCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this.words=null;
		Pool.recover("FillWordsCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.fillWords(this.words,this.x+gx,this.y+gy,this.font,this.color);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "FillWords";
	});

	FillWordsCmd.create=function(words,x,y,font,color){
		var cmd=Pool.getItemByClass("FillWordsCmd",FillWordsCmd);
		cmd.words=words;
		cmd.x=x;
		cmd.y=y;
		cmd.font=font;
		cmd.color=color;
		return cmd;
	}

	FillWordsCmd.ID="FillWords";
	return FillWordsCmd;
})()


/**
*矩阵命令
*/
//class laya.display.cmd.TransformCmd
var TransformCmd=(function(){
	function TransformCmd(){
		/**
		*矩阵。
		*/
		//this.matrix=null;
		/**
		*（可选）水平方向轴心点坐标。
		*/
		//this.pivotX=NaN;
		/**
		*（可选）垂直方向轴心点坐标。
		*/
		//this.pivotY=NaN;
	}

	__class(TransformCmd,'laya.display.cmd.TransformCmd');
	var __proto=TransformCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this.matrix=null;
		Pool.recover("TransformCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context._transform(this.matrix,this.pivotX+gx,this.pivotY+gy);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "Transform";
	});

	TransformCmd.create=function(matrix,pivotX,pivotY){
		var cmd=Pool.getItemByClass("TransformCmd",TransformCmd);
		cmd.matrix=matrix;
		cmd.pivotX=pivotX;
		cmd.pivotY=pivotY;
		return cmd;
	}

	TransformCmd.ID="Transform";
	return TransformCmd;
})()


/**
*@private
*计算贝塞尔曲线的工具类。
*/
//class laya.maths.Bezier
var Bezier=(function(){
	function Bezier(){
		/**@private */
		this._controlPoints=[new Point(),new Point(),new Point()];
		this._calFun=this.getPoint2;
	}

	__class(Bezier,'laya.maths.Bezier');
	var __proto=Bezier.prototype;
	/**@private */
	__proto._switchPoint=function(x,y){
		var tPoint=this._controlPoints.shift();
		tPoint.setTo(x,y);
		this._controlPoints.push(tPoint);
	}

	/**
	*计算二次贝塞尔点。
	*/
	__proto.getPoint2=function(t,rst){
		var p1=this._controlPoints[0];
		var p2=this._controlPoints[1];
		var p3=this._controlPoints[2];
		var lineX=Math.pow((1-t),2)*p1.x+2 *t *(1-t)*p2.x+Math.pow(t,2)*p3.x;
		var lineY=Math.pow((1-t),2)*p1.y+2 *t *(1-t)*p2.y+Math.pow(t,2)*p3.y;
		rst.push(lineX,lineY);
	}

	/**
	*计算三次贝塞尔点
	*/
	__proto.getPoint3=function(t,rst){
		var p1=this._controlPoints[0];
		var p2=this._controlPoints[1];
		var p3=this._controlPoints[2];
		var p4=this._controlPoints[3];
		var lineX=Math.pow((1-t),3)*p1.x+3 *p2.x *t *(1-t)*(1-t)+3 *p3.x *t *t *(1-t)+p4.x *Math.pow(t,3);
		var lineY=Math.pow((1-t),3)*p1.y+3 *p2.y *t *(1-t)*(1-t)+3 *p3.y *t *t *(1-t)+p4.y *Math.pow(t,3);
		rst.push(lineX,lineY);
	}

	/**
	*计算贝塞尔点序列
	*/
	__proto.insertPoints=function(count,rst){
		var i=NaN;
		count=count > 0 ? count :5;
		var dLen=NaN;
		dLen=1 / count;
		for (i=0;i <=1;i+=dLen){
			this._calFun(i,rst);
		}
	}

	/**
	*获取贝塞尔曲线上的点。
	*@param pList 控制点[x0,y0,x1,y1...]
	*@param inSertCount 每次曲线的插值数量
	*/
	__proto.getBezierPoints=function(pList,inSertCount,count){
		(inSertCount===void 0)&& (inSertCount=5);
		(count===void 0)&& (count=2);
		var i=0,len=0;
		len=pList.length;
		if (len < (count+1)*2)return [];
		var rst=[];
		switch (count){
			case 2:
				this._calFun=this.getPoint2;
				break ;
			case 3:
				this._calFun=this.getPoint3;
				break ;
			default :
				return [];
			}
		while (this._controlPoints.length <=count){
			this._controlPoints.push(Point.create());
		}
		for (i=0;i < count *2;i+=2){
			this._switchPoint(pList[i],pList[i+1]);
		}
		for (i=count *2;i < len;i+=2){
			this._switchPoint(pList[i],pList[i+1]);
			if ((i / 2)% count==0)this.insertPoints(inSertCount,rst);
		}
		return rst;
	}

	__static(Bezier,
	['I',function(){return this.I=new Bezier();}
	]);
	return Bezier;
})()


//class laya.utils.PerfData
var PerfData=(function(){
	function PerfData(id,color,name,scale){
		this.id=0;
		this.name=null;
		this.color=0;
		this.scale=1.0;
		this.datapos=0;
		this.datas=new Array(PerfHUD.DATANUM);
		this.id=id;
		this.color=color;
		this.name=name;
		this.scale=scale;
	}

	__class(PerfData,'laya.utils.PerfData');
	var __proto=PerfData.prototype;
	__proto.addData=function(v){
		this.datas[this.datapos]=v;
		this.datapos++;
		this.datapos %=PerfHUD.DATANUM;
	}

	return PerfData;
})()


/**

*/
*/
*/
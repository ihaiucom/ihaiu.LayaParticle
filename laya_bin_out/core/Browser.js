/**
*<code>Browser</code> 是浏览器代理类。封装浏览器及原生 js 提供的一些功能。
*/
//class laya.utils.Browser
var Browser=(function(){
	function Browser(){}
	__class(Browser,'laya.utils.Browser');
	/**获得设备像素比。*/
	__getset(1,Browser,'pixelRatio',function(){
		if (Browser._pixelRatio < 0){
			Browser.__init__();
			if (Browser.userAgent.indexOf("Mozilla/6.0(Linux; Android 6.0; HUAWEI NXT-AL10 Build/HUAWEINXT-AL10)")>-1)Browser._pixelRatio=2;
			else {
				var ctx=Browser.context;
				var backingStore=ctx.backingStorePixelRatio || ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
				Browser._pixelRatio=(Browser._window.devicePixelRatio || 1)/ backingStore;
				if (Browser._pixelRatio < 1)Browser._pixelRatio=1;
			}
		}
		return Browser._pixelRatio;
	});

	/**浏览器窗口物理高度。考虑了设备像素比。*/
	__getset(1,Browser,'height',function(){
		Browser.__init__();
		return ((Laya.stage && Laya.stage.canvasRotation)? Browser.clientWidth :Browser.clientHeight)*Browser.pixelRatio;
	});

	/**
	*浏览器窗口可视宽度。
	*通过分析浏览器信息获得。浏览器多个属性值优先级为：window.innerWidth(包含滚动条宽度)> document.body.clientWidth(不包含滚动条宽度)，如果前者为0或为空，则选择后者。
	*/
	__getset(1,Browser,'clientWidth',function(){
		Browser.__init__();
		return Browser._window.innerWidth || Browser._document.body.clientWidth;
	});

	/**浏览器原生 window 对象的引用。*/
	__getset(1,Browser,'window',function(){
		return Browser._window || Browser.__init__();
	});

	/**
	*浏览器窗口可视高度。
	*通过分析浏览器信息获得。浏览器多个属性值优先级为：window.innerHeight(包含滚动条高度)> document.body.clientHeight(不包含滚动条高度)> document.documentElement.clientHeight(不包含滚动条高度)，如果前者为0或为空，则选择后者。
	*/
	__getset(1,Browser,'clientHeight',function(){
		Browser.__init__();
		return Browser._window.innerHeight || Browser._document.body.clientHeight || Browser._document.documentElement.clientHeight;
	});

	/**浏览器窗口物理宽度。考虑了设备像素比。*/
	__getset(1,Browser,'width',function(){
		Browser.__init__();
		return ((Laya.stage && Laya.stage.canvasRotation)? Browser.clientHeight :Browser.clientWidth)*Browser.pixelRatio;
	});

	/**画布容器，用来盛放画布的容器。方便对画布进行控制*/
	__getset(1,Browser,'container',function(){
		if (!Browser._container){
			Browser.__init__();
			Browser._container=Browser.createElement("div");
			Browser._container.id="layaContainer";
			Browser._document.body.appendChild(Browser._container);
		}
		return Browser._container;
		},function(value){
		Browser._container=value;
	});

	/**浏览器原生 document 对象的引用。*/
	__getset(1,Browser,'document',function(){
		Browser.__init__();
		return Browser._document;
	});

	Browser.__init__=function(){
		if (Browser._window)return Browser._window;
		var win=Browser._window=/*__JS__ */window;
		var doc=Browser._document=win.document;
		var u=Browser.userAgent=win.navigator.userAgent;
		var libs=win._layalibs;
		if (libs){
			libs.sort(function(a,b){
				return a.i > b.i;
			});
			for (var j=0;j < libs.length;j++){
				libs[j].f(win,doc,Laya);
			}
		}
		if (u.indexOf("MiniGame")>-1){
			if (!Laya["MiniAdpter"]){
				console.error("请先添加小游戏适配库,详细教程：https://ldc2.layabox.com/doc/?nav=zh-ts-5-0-0");
				}else {
				Laya["MiniAdpter"].enable();
			}
		}
		if (u.indexOf("SwanGame")>-1){
			if (!Laya["BMiniAdapter"]){
				console.error("请先添加百度小游戏适配库,详细教程：https://ldc2.layabox.com/doc/?nav=zh-ts-5-0-0");
				}else {
				Laya["BMiniAdapter"].enable();
			}
		}
		win.trace=console.log;
		win.requestAnimationFrame=win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame || function (fun){
			return win.setTimeout(fun,1000 / 60);
		};
		var bodyStyle=doc.body.style;
		bodyStyle.margin=0;
		bodyStyle.overflow='hidden';
		bodyStyle['-webkit-user-select']='none';
		bodyStyle['-webkit-tap-highlight-color']='rgba(200,200,200,0)';
		var metas=doc.getElementsByTagName('meta');
		var i=0,flag=false,content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no';
		while (i < metas.length){
			var meta=metas[i];
			if (meta.name=='viewport'){
				meta.content=content;
				flag=true;
				break ;
			}
			i++;
		}
		if (!flag){
			meta=doc.createElement('meta');
			meta.name='viewport',meta.content=content;
			doc.getElementsByTagName('head')[0].appendChild(meta);
		}
		Browser.onMobile=u.indexOf("Mobile")>-1;
		Browser.onIOS=!!u.match(/\(i[^;]+;(U;)? CPU.+Mac OS X/);
		Browser.onIPhone=u.indexOf("iPhone")>-1;
		Browser.onMac=/*[SAFE]*/ u.indexOf("Mac OS X")>-1;
		Browser.onIPad=u.indexOf("iPad")>-1;
		Browser.onAndroid=u.indexOf('Android')>-1 || u.indexOf('Adr')>-1;
		Browser.onWP=u.indexOf("Windows Phone")>-1;
		Browser.onQQBrowser=u.indexOf("QQBrowser")>-1;
		Browser.onMQQBrowser=u.indexOf("MQQBrowser")>-1 || (u.indexOf("Mobile")>-1 && u.indexOf("QQ")>-1);
		Browser.onIE=!!win.ActiveXObject || "ActiveXObject" in win;
		Browser.onWeiXin=u.indexOf('MicroMessenger')>-1;
		Browser.onSafari=/*[SAFE]*/ u.indexOf("Safari")>-1;
		Browser.onPC=!Browser.onMobile;
		Browser.onMiniGame=/*[SAFE]*/ u.indexOf('MiniGame')>-1;
		Browser.onBDMiniGame=/*[SAFE]*/ u.indexOf('SwanGame')>-1;
		Browser.onLimixiu=/*[SAFE]*/ u.indexOf('limixiu')>-1;
		Browser.supportLocalStorage=LocalStorage.__init__();
		Browser.supportWebAudio=SoundManager.__init__();
		Render._mainCanvas=new HTMLCanvas(true);
		var style=Render._mainCanvas.source.style;
		style.position='absolute';
		style.top=style.left="0px";
		style.background="#000000";
		Browser.canvas=new HTMLCanvas(true);
		Browser.context=Browser.canvas.getContext('2d');
		var tmpCanv=new HTMLCanvas(true);
		var names=["webgl","experimental-webgl","webkit-3d","moz-webgl"];
		var gl=null;
		for (i=0;i < names.length;i++){
			try {
				gl=tmpCanv.source.getContext(names[i]);
			}catch (e){}
			if (gl){
				Browser._supportWebGL=true;
				break ;
			}
		}
		return win;
	}

	Browser.createElement=function(type){
		Browser.__init__();
		return Browser._document.createElement(type);
	}

	Browser.getElementById=function(type){
		Browser.__init__();
		return Browser._document.getElementById(type);
	}

	Browser.removeElement=function(ele){
		if (ele && ele.parentNode)ele.parentNode.removeChild(ele);
	}

	Browser.now=function(){
		return /*__JS__ */Date.now();;
	}

	Browser.userAgent=null;
	Browser.onMobile=false;
	Browser.onIOS=false;
	Browser.onMac=false;
	Browser.onIPhone=false;
	Browser.onIPad=false;
	Browser.onAndroid=false;
	Browser.onWP=false;
	Browser.onQQBrowser=false;
	Browser.onMQQBrowser=false;
	Browser.onSafari=false;
	Browser.onIE=false;
	Browser.onWeiXin=false;
	Browser.onPC=false;
	Browser.onMiniGame=false;
	Browser.onBDMiniGame=false;
	Browser.onLimixiu=false;
	Browser.onFirefox=false;
	Browser.onEdge=false;
	Browser.supportWebAudio=false;
	Browser.supportLocalStorage=false;
	Browser.canvas=null;
	Browser.context=null;
	Browser._window=null;
	Browser._document=null;
	Browser._container=null;
	Browser._pixelRatio=-1;
	Browser._supportWebGL=false;
	return Browser;
})()


/**
*绘制描边文字
*/
//class laya.display.cmd.StrokeTextCmd
var StrokeTextCmd=(function(){
	function StrokeTextCmd(){
		/**
		*在画布上输出的文本。
		*/
		//this.text=null;
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
		/**
		*线条宽度。
		*/
		//this.lineWidth=NaN;
		/**
		*文本对齐方式，可选值："left"，"center"，"right"。
		*/
		//this.textAlign=null;
	}

	__class(StrokeTextCmd,'laya.display.cmd.StrokeTextCmd');
	var __proto=StrokeTextCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("StrokeTextCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.strokeWord(this.text,this.x+gx,this.y+gy,this.font,this.color,this.lineWidth,this.textAlign);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "StrokeText";
	});

	StrokeTextCmd.create=function(text,x,y,font,color,lineWidth,textAlign){
		var cmd=Pool.getItemByClass("StrokeTextCmd",StrokeTextCmd);
		cmd.text=text;
		cmd.x=x;
		cmd.y=y;
		cmd.font=font;
		cmd.color=color;
		cmd.lineWidth=lineWidth;
		cmd.textAlign=textAlign;
		return cmd;
	}

	StrokeTextCmd.ID="StrokeText";
	return StrokeTextCmd;
})()


/**
*<p><code>Rectangle</code> 对象是按其位置（由它左上角的点 (x,y)确定）以及宽度和高度定义的区域。</p>
*<p>Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。</p>
*/
//class laya.maths.Rectangle
var Rectangle=(function(){
	function Rectangle(x,y,width,height){
		/**矩形左上角的 X 轴坐标。*/
		//this.x=NaN;
		/**矩形左上角的 Y 轴坐标。*/
		//this.y=NaN;
		/**矩形的宽度。*/
		//this.width=NaN;
		/**矩形的高度。*/
		//this.height=NaN;
		(x===void 0)&& (x=0);
		(y===void 0)&& (y=0);
		(width===void 0)&& (width=0);
		(height===void 0)&& (height=0);
		this.x=x;
		this.y=y;
		this.width=width;
		this.height=height;
	}

	__class(Rectangle,'laya.maths.Rectangle');
	var __proto=Rectangle.prototype;
	/**
	*将 Rectangle 的属性设置为指定值。
	*@param x x 矩形左上角的 X 轴坐标。
	*@param y x 矩形左上角的 Y 轴坐标。
	*@param width 矩形的宽度。
	*@param height 矩形的高。
	*@return 返回属性值修改后的矩形对象本身。
	*/
	__proto.setTo=function(x,y,width,height){
		this.x=x;
		this.y=y;
		this.width=width;
		this.height=height;
		return this;
	}

	/**
	*重置
	*/
	__proto.reset=function(){
		this.x=this.y=this.width=this.height=0;
		return this;
	}

	/**
	*回收
	*/
	__proto.recover=function(){
		Pool.recover("Rectangle",this.reset());
	}

	/**
	*复制 source 对象的属性值到此矩形对象中。
	*@param sourceRect 源 Rectangle 对象。
	*@return 返回属性值修改后的矩形对象本身。
	*/
	__proto.copyFrom=function(source){
		this.x=source.x;
		this.y=source.y;
		this.width=source.width;
		this.height=source.height;
		return this;
	}

	/**
	*确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
	*@param x 点的 X 轴坐标值（水平位置）。
	*@param y 点的 Y 轴坐标值（垂直位置）。
	*@return 如果 Rectangle 对象包含指定的点，则值为 true；否则为 false。
	*/
	__proto.contains=function(x,y){
		if (this.width <=0 || this.height <=0)return false;
		if (x >=this.x && x < this.right){
			if (y >=this.y && y < this.bottom){
				return true;
			}
		}
		return false;
	}

	/**
	*确定在 rect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
	*@param rect Rectangle 对象。
	*@return 如果传入的矩形对象与此对象相交，则返回 true 值，否则返回 false。
	*/
	__proto.intersects=function(rect){
		return !(rect.x > (this.x+this.width)|| (rect.x+rect.width)< this.x || rect.y > (this.y+this.height)|| (rect.y+rect.height)< this.y);
	}

	/**
	*如果在 rect 参数中指定的 Rectangle 对象与此 Rectangle 对象相交，则返回交集区域作为 Rectangle 对象。如果矩形不相交，则此方法返回null。
	*@param rect 待比较的矩形区域。
	*@param out （可选）待输出的矩形区域。如果为空则创建一个新的。建议：尽量复用对象，减少对象创建消耗。
	*@return 返回相交的矩形区域对象。
	*/
	__proto.intersection=function(rect,out){
		if (!this.intersects(rect))return null;
		out || (out=new Rectangle());
		out.x=Math.max(this.x,rect.x);
		out.y=Math.max(this.y,rect.y);
		out.width=Math.min(this.right,rect.right)-out.x;
		out.height=Math.min(this.bottom,rect.bottom)-out.y;
		return out;
	}

	/**
	*<p>矩形联合，通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。</p>
	*<p>注意：union()方法忽略高度或宽度值为 0 的矩形，如：var rect2:Rectangle=new Rectangle(300,300,50,0);</p>
	*@param 要添加到此 Rectangle 对象的 Rectangle 对象。
	*@param out 用于存储输出结果的矩形对象。如果为空，则创建一个新的。建议：尽量复用对象，减少对象创建消耗。Rectangle.TEMP对象用于对象复用。
	*@return 充当两个矩形的联合的新 Rectangle 对象。
	*/
	__proto.union=function(source,out){
		out || (out=new Rectangle());
		this.clone(out);
		if (source.width <=0 || source.height <=0)return out;
		out.addPoint(source.x,source.y);
		out.addPoint(source.right,source.bottom);
		return this;
	}

	/**
	*返回一个 Rectangle 对象，其 x、y、width 和 height 属性的值与当前 Rectangle 对象的对应值相同。
	*@param out （可选）用于存储结果的矩形对象。如果为空，则创建一个新的。建议：尽量复用对象，减少对象创建消耗。。Rectangle.TEMP对象用于对象复用。
	*@return Rectangle 对象，其 x、y、width 和 height 属性的值与当前 Rectangle 对象的对应值相同。
	*/
	__proto.clone=function(out){
		out || (out=new Rectangle());
		out.x=this.x;
		out.y=this.y;
		out.width=this.width;
		out.height=this.height;
		return out;
	}

	/**
	*当前 Rectangle 对象的水平位置 x 和垂直位置 y 以及高度 width 和宽度 height 以逗号连接成的字符串。
	*/
	__proto.toString=function(){
		return this.x+","+this.y+","+this.width+","+this.height;
	}

	/**
	*检测传入的 Rectangle 对象的属性是否与当前 Rectangle 对象的属性 x、y、width、height 属性值都相等。
	*@param rect 待比较的 Rectangle 对象。
	*@return 如果判断的属性都相等，则返回 true ,否则返回 false。
	*/
	__proto.equals=function(rect){
		if (!rect || rect.x!==this.x || rect.y!==this.y || rect.width!==this.width || rect.height!==this.height)return false;
		return true;
	}

	/**
	*<p>为当前矩形对象加一个点，以使当前矩形扩展为包含当前矩形和此点的最小矩形。</p>
	*<p>此方法会修改本对象。</p>
	*@param x 点的 X 坐标。
	*@param y 点的 Y 坐标。
	*@return 返回此 Rectangle 对象。
	*/
	__proto.addPoint=function(x,y){
		this.x > x && (this.width+=this.x-x,this.x=x);
		this.y > y && (this.height+=this.y-y,this.y=y);
		if (this.width < x-this.x)this.width=x-this.x;
		if (this.height < y-this.y)this.height=y-this.y;
		return this;
	}

	/**
	*@private
	*返回代表当前矩形的顶点数据。
	*@return 顶点数据。
	*/
	__proto._getBoundPoints=function(){
		var rst=Rectangle._temB;
		rst.length=0;
		if (this.width==0 || this.height==0)return rst;
		rst.push(this.x,this.y,this.x+this.width,this.y,this.x,this.y+this.height,this.x+this.width,this.y+this.height);
		return rst;
	}

	/**
	*确定此 Rectangle 对象是否为空。
	*@return 如果 Rectangle 对象的宽度或高度小于等于 0，则返回 true 值，否则返回 false。
	*/
	__proto.isEmpty=function(){
		if (this.width <=0 || this.height <=0)return true;
		return false;
	}

	/**此矩形右侧的 X 轴坐标。 x 和 width 属性的和。*/
	__getset(0,__proto,'right',function(){
		return this.x+this.width;
	});

	/**此矩形底端的 Y 轴坐标。y 和 height 属性的和。*/
	__getset(0,__proto,'bottom',function(){
		return this.y+this.height;
	});

	Rectangle.create=function(){
		return Pool.getItemByClass("Rectangle",Rectangle);
	}

	Rectangle._getBoundPointS=function(x,y,width,height){
		var rst=Rectangle._temA;
		rst.length=0;
		if (width==0 || height==0)return rst;
		rst.push(x,y,x+width,y,x,y+height,x+width,y+height);
		return rst;
	}

	Rectangle._getWrapRec=function(pointList,rst){
		if (!pointList || pointList.length < 1)return rst ? rst.setTo(0,0,0,0):Rectangle.TEMP.setTo(0,0,0,0);
		rst=rst ? rst :laya.maths.Rectangle.create();
		var i,len=pointList.length,minX,maxX,minY,maxY,tPoint=Point.TEMP;
		minX=minY=99999;
		maxX=maxY=-minX;
		for (i=0;i < len;i+=2){
			tPoint.x=pointList[i];
			tPoint.y=pointList[i+1];
			minX=minX < tPoint.x ? minX :tPoint.x;
			minY=minY < tPoint.y ? minY :tPoint.y;
			maxX=maxX > tPoint.x ? maxX :tPoint.x;
			maxY=maxY > tPoint.y ? maxY :tPoint.y;
		}
		return rst.setTo(minX,minY,maxX-minX,maxY-minY);
	}

	Rectangle.EMPTY=new Rectangle();
	Rectangle.TEMP=new Rectangle();
	Rectangle._temB=[];
	Rectangle._temA=[];
	return Rectangle;
})()


/**
*缩放命令
*/
//class laya.display.cmd.ScaleCmd
var ScaleCmd=(function(){
	function ScaleCmd(){
		/**
		*水平方向缩放值。
		*/
		//this.scaleX=NaN;
		/**
		*垂直方向缩放值。
		*/
		//this.scaleY=NaN;
		/**
		*（可选）水平方向轴心点坐标。
		*/
		//this.pivotX=NaN;
		/**
		*（可选）垂直方向轴心点坐标。
		*/
		//this.pivotY=NaN;
	}

	__class(ScaleCmd,'laya.display.cmd.ScaleCmd');
	var __proto=ScaleCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("ScaleCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context._scale(this.scaleX,this.scaleY,this.pivotX+gx,this.pivotY+gy);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "Scale";
	});

	ScaleCmd.create=function(scaleX,scaleY,pivotX,pivotY){
		var cmd=Pool.getItemByClass("ScaleCmd",ScaleCmd);
		cmd.scaleX=scaleX;
		cmd.scaleY=scaleY;
		cmd.pivotX=pivotX;
		cmd.pivotY=pivotY;
		return cmd;
	}

	ScaleCmd.ID="Scale";
	return ScaleCmd;
})()


/**
*透明命令
*/
//class laya.display.cmd.AlphaCmd
var AlphaCmd=(function(){
	function AlphaCmd(){
		/**
		*透明度
		*/
		//this.alpha=NaN;
	}

	__class(AlphaCmd,'laya.display.cmd.AlphaCmd');
	var __proto=AlphaCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("AlphaCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.alpha(this.alpha);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "Alpha";
	});

	AlphaCmd.create=function(alpha){
		var cmd=Pool.getItemByClass("AlphaCmd",AlphaCmd);
		cmd.alpha=alpha;
		return cmd;
	}

	AlphaCmd.ID="Alpha";
	return AlphaCmd;
})()


/**
*@private
*TODO:
*/
//class laya.utils.VectorGraphManager
var VectorGraphManager=(function(){
	function VectorGraphManager(){
		this.useDic={};
		this.shapeDic={};
		this.shapeLineDic={};
		this._id=0;
		this._checkKey=false;
		this._freeIdArray=[];
		if (Render.isWebGL){
			CacheManger.regCacheByFunction(Utils.bind(this.startDispose,this),Utils.bind(this.getCacheList,this));
		}
	}

	__class(VectorGraphManager,'laya.utils.VectorGraphManager');
	var __proto=VectorGraphManager.prototype;
	/**
	*得到个空闲的ID
	*@return
	*/
	__proto.getId=function(){
		return this._id++;
	}

	/**
	*添加一个图形到列表中
	*@param id
	*@param shape
	*/
	__proto.addShape=function(id,shape){
		this.shapeDic[id]=shape;
		if (!this.useDic[id]){
			this.useDic[id]=true;
		}
	}

	/**
	*添加一个线图形到列表中
	*@param id
	*@param Line
	*/
	__proto.addLine=function(id,Line){
		this.shapeLineDic[id]=Line;
		if (!this.shapeLineDic[id]){
			this.shapeLineDic[id]=true;
		}
	}

	/**
	*检测一个对象是否在使用中
	*@param id
	*/
	__proto.getShape=function(id){
		if (this._checkKey){
			if (this.useDic[id] !=null){
				this.useDic[id]=true;
			}
		}
	}

	/**
	*删除一个图形对象
	*@param id
	*/
	__proto.deleteShape=function(id){
		if (this.shapeDic[id]){
			this.shapeDic[id]=null;
			delete this.shapeDic[id];
		}
		if (this.shapeLineDic[id]){
			this.shapeLineDic[id]=null;
			delete this.shapeLineDic[id];
		}
		if (this.useDic[id] !=null){
			delete this.useDic[id];
		}
	}

	/**
	*得到缓存列表
	*@return
	*/
	__proto.getCacheList=function(){
		var str;
		var list=[];
		for (str in this.shapeDic){
			list.push(this.shapeDic[str]);
		}
		for (str in this.shapeLineDic){
			list.push(this.shapeLineDic[str]);
		}
		return list;
	}

	/**
	*开始清理状态，准备销毁
	*/
	__proto.startDispose=function(key){
		var str;
		for (str in this.useDic){
			this.useDic[str]=false;
		}
		this._checkKey=true;
	}

	/**
	*确认销毁
	*/
	__proto.endDispose=function(){
		if (this._checkKey){
			var str;
			for (str in this.useDic){
				if (!this.useDic[str]){
					this.deleteShape(str);
				}
			}
			this._checkKey=false;
		}
	}

	VectorGraphManager.getInstance=function(){
		return VectorGraphManager.instance=VectorGraphManager.instance|| new VectorGraphManager();
	}

	VectorGraphManager.instance=null;
	return VectorGraphManager;
})()


/**
*@private
*/
//class laya.utils.WordText
var WordText=(function(){
	function WordText(){
		//TODO:
		this.id=NaN;
		this.save=[];
		this.toUpperCase=null;
		this.changed=false;
		this._text=null;
		this.width=-1;
		//整个WordText的长度。-1表示没有计算还。
		this.pageChars=[];
		//把本对象的字符按照texture分组保存的文字信息。里面又是一个数组。具体含义见使用的地方。
		this.startID=0;
		//上面的是个数组，但是可能前面都是空的，加个起始位置
		this.startIDStroke=0;
		this.lastGCCnt=0;
	}

	__class(WordText,'laya.utils.WordText');
	var __proto=WordText.prototype;
	//如果文字gc了，需要检查缓存是否有效，这里记录上次检查对应的gc值。
	__proto.setText=function(txt){
		this.changed=true;
		this._text=txt;
		this.width=-1;
		this.pageChars=[];
	}

	//TODO:coverage
	__proto.toString=function(){
		return this._text;
	}

	//TODO:coverage
	__proto.charCodeAt=function(i){
		return this._text ? this._text.charCodeAt(i):NaN;
	}

	//TODO:coverage
	__proto.charAt=function(i){
		return this._text ? this._text.charAt(i):null;
	}

	__proto.cleanCache=function(){
		this.pageChars=[];
		this.startID=0;
	}

	__getset(0,__proto,'length',function(){
		return this._text ? this._text.length :0;
	});

	return WordText;
})()


/**
*旋转命令
*/
//class laya.display.cmd.RotateCmd
var RotateCmd=(function(){
	function RotateCmd(){
		/**
		*旋转角度，以弧度计。
		*/
		//this.angle=NaN;
		/**
		*（可选）水平方向轴心点坐标。
		*/
		//this.pivotX=NaN;
		/**
		*（可选）垂直方向轴心点坐标。
		*/
		//this.pivotY=NaN;
	}

	__class(RotateCmd,'laya.display.cmd.RotateCmd');
	var __proto=RotateCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("RotateCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context._rotate(this.angle,this.pivotX+gx,this.pivotY+gy);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "Rotate";
	});

	RotateCmd.create=function(angle,pivotX,pivotY){
		var cmd=Pool.getItemByClass("RotateCmd",RotateCmd);
		cmd.angle=angle;
		cmd.pivotX=pivotX;
		cmd.pivotY=pivotY;
		return cmd;
	}

	RotateCmd.ID="Rotate";
	return RotateCmd;
})()


/**
*绘制矩形
*/
//class laya.display.cmd.DrawRectCmd
var DrawRectCmd=(function(){
	function DrawRectCmd(){
		/**
		*开始绘制的 X 轴位置。
		*/
		//this.x=NaN;
		/**
		*开始绘制的 Y 轴位置。
		*/
		//this.y=NaN;
		/**
		*矩形宽度。
		*/
		//this.width=NaN;
		/**
		*矩形高度。
		*/
		//this.height=NaN;
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
	}

	__class(DrawRectCmd,'laya.display.cmd.DrawRectCmd');
	var __proto=DrawRectCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this.fillColor=null;
		this.lineColor=null;
		Pool.recover("DrawRectCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.drawRect(this.x+gx,this.y+gy,this.width,this.height,this.fillColor,this.lineColor,this.lineWidth);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "DrawRect";
	});

	DrawRectCmd.create=function(x,y,width,height,fillColor,lineColor,lineWidth){
		var cmd=Pool.getItemByClass("DrawRectCmd",DrawRectCmd);
		cmd.x=x;
		cmd.y=y;
		cmd.width=width;
		cmd.height=height;
		cmd.fillColor=fillColor;
		cmd.lineColor=lineColor;
		cmd.lineWidth=lineWidth;
		return cmd;
	}

	DrawRectCmd.ID="DrawRect";
	return DrawRectCmd;
})()


/**
*@private

*/
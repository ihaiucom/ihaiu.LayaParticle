/**
*<code>/**
*<code>/**
*<code>/**
*<code>Component</code> 类用于创建组件的基类。
*/
//class laya.components.Component
var Component=(function(){
	function Component(){
		/**@private [实现IListPool接口]*/
		//this._destroyed=false;
		/**@private [实现IListPool接口]*/
		//this._indexInList=0;
		/**@private */
		//this._id=0;
		/**@private */
		//this._enabled=false;
		/**@private */
		//this._awaked=false;
		/**
		*[只读]获取所属Node节点。
		*@readonly
		*/
		//this.owner=null;
		this._id=Utils.getGID();
		this._resetComp();
	}

	__class(Component,'laya.components.Component');
	var __proto=Component.prototype;
	Laya.imps(__proto,{"laya.resource.ISingletonElement":true,"laya.resource.IDestroy":true})
	/**
	*@private
	*/
	__proto._isScript=function(){
		return false;
	}

	/**
	*@private
	*/
	__proto._resetComp=function(){
		this._indexInList=-1;
		this._enabled=true;
		this._awaked=false;
		this.owner=null;
	}

	/**
	*[实现IListPool接口]
	*@private
	*/
	__proto._getIndexInList=function(){
		return this._indexInList;
	}

	/**
	*[实现IListPool接口]
	*@private
	*/
	__proto._setIndexInList=function(index){
		this._indexInList=index;
	}

	/**
	*被添加到节点后调用，可根据需要重写此方法
	*@private
	*/
	__proto._onAdded=function(){}
	/**
	*被激活后调用，可根据需要重写此方法
	*@private
	*/
	__proto._onAwake=function(){}
	/**
	*被激活后调用，可根据需要重写此方法
	*@private
	*/
	__proto._onEnable=function(){}
	/**
	*被禁用时调用，可根据需要重写此方法
	*@private
	*/
	__proto._onDisable=function(){}
	/**
	*被添加到Scene后调用，无论Scene是否在舞台上，可根据需要重写此方法
	*@private
	*/
	__proto._onEnableInScene=function(){}
	/**
	*从Scene移除后调用，无论Scene是否在舞台上，可根据需要重写此方法
	*@private
	*/
	__proto._onDisableInScene=function(){}
	/**
	*被销毁时调用，可根据需要重写此方法
	*@private
	*/
	__proto._onDestroy=function(){}
	/**
	*重置组件参数到默认值，如果实现了这个函数，则组件会被重置并且自动回收到对象池，方便下次复用
	*如果没有重置，则不进行回收复用
	*此方法为虚方法，使用时重写覆盖即可
	*/
	__proto.onReset=function(){}
	/**
	*@private
	*/
	__proto._parse=function(data){}
	/**
	*@private
	*/
	__proto._cloneTo=function(dest){}
	/**
	*@private
	*/
	__proto._setActive=function(value){
		if (value){
			if (!this._awaked){
				this._awaked=true;
				this._onAwake();
			}
			this._enabled && this._onEnable();
			}else {
			this._enabled && this._onDisable();
		}
	}

	/**
	*@private
	*/
	__proto._setActiveInScene=function(value){
		if (value)this._onEnableInScene();
		else this._onDisableInScene();
	}

	/**
	*销毁组件
	*/
	__proto.destroy=function(){
		if (this.owner)this.owner._destroyComponent(this);
	}

	/**
	*@private
	*/
	__proto._destroy=function(){
		if (this.owner.activeInHierarchy && this._enabled){
			this._setActive(false);
			(this._isScript())&& ((this).onDisable());
		}
		this.owner._scene && this._setActiveInScene(false);
		this._onDestroy();
		this._destroyed=true;
		if (this.onReset!==laya.components.Component.prototype.onReset){
			this.onReset();
			this._resetComp();
			Pool.recoverByClass(this);
			}else {
			this._resetComp();
		}
	}

	/**
	*获取唯一标识ID。
	*/
	__getset(0,__proto,'id',function(){
		return this._id;
	});

	/**
	*获取是否启用组件。
	*/
	__getset(0,__proto,'enabled',function(){
		return this._enabled;
		},function(value){
		this._enabled=value;
		if (this.owner){
			if (value)
				this.owner.activeInHierarchy && this._onEnable();
			else
			this.owner.activeInHierarchy && this._onDisable();
		}
	});

	/**
	*获取是否为单实例组件。
	*/
	__getset(0,__proto,'isSingleton',function(){
		return true;
	});

	/**
	*获取是否已经销毁 。
	*/
	__getset(0,__proto,'destroyed',function(){
		return this._destroyed;
	});

	return Component;
})()


/**
*鼠标点击区域，可以设置绘制一系列矢量图作为点击区域和非点击区域（目前只支持圆形，矩形，多边形）
*
*/
//class laya.utils.HitArea
var HitArea=(function(){
	function HitArea(){
		/**@private */
		this._hit=null;
		/**@private */
		this._unHit=null;
	}

	__class(HitArea,'laya.utils.HitArea');
	var __proto=HitArea.prototype;
	/**
	*检测对象是否包含指定的点。
	*@param x 点的 X 轴坐标值（水平位置）。
	*@param y 点的 Y 轴坐标值（垂直位置）。
	*@return 如果包含指定的点，则值为 true；否则为 false。
	*/
	__proto.contains=function(x,y){
		if (!HitArea._isHitGraphic(x,y,this.hit))return false;
		return !HitArea._isHitGraphic(x,y,this.unHit);
	}

	/**
	*可点击区域，可以设置绘制一系列矢量图作为点击区域（目前只支持圆形，矩形，多边形）
	*/
	__getset(0,__proto,'hit',function(){
		if (!this._hit)this._hit=new Graphics();
		return this._hit;
		},function(value){
		this._hit=value;
	});

	/**
	*不可点击区域，可以设置绘制一系列矢量图作为非点击区域（目前只支持圆形，矩形，多边形）
	*/
	__getset(0,__proto,'unHit',function(){
		if (!this._unHit)this._unHit=new Graphics();
		return this._unHit;
		},function(value){
		this._unHit=value;
	});

	HitArea._isHitGraphic=function(x,y,graphic){
		if (!graphic)return false;
		var cmds=graphic.cmds;
		if (!cmds && graphic._one){
			cmds=HitArea._cmds;
			cmds.length=1;
			cmds[0]=graphic._one;
		}
		if (!cmds)return false;
		var i=0,len=0;
		len=cmds.length;
		var cmd;
		for (i=0;i < len;i++){
			cmd=cmds[i];
			if (!cmd)continue ;
			switch (cmd.cmdID){
				case "Translate":
					x-=cmd.tx;
					y-=cmd.ty;
				}
			if (HitArea._isHitCmd(x,y,cmd))return true;
		}
		return false;
	}

	HitArea._isHitCmd=function(x,y,cmd){
		if (!cmd)return false;
		var rst=false;
		switch (cmd.cmdID){
			case "DrawRect":
				HitArea._rect.setTo(cmd.x,cmd.y,cmd.width,cmd.height);
				rst=HitArea._rect.contains(x,y);
				break ;
			case "DrawCircle":;
				var d=NaN;
				x-=cmd.x;
				y-=cmd.y;
				d=x *x+y *y;
				rst=d < cmd.radius *cmd.radius;
				break ;
			case "DrawPoly":
				x-=cmd.x;
				y-=cmd.y;
				rst=HitArea._ptInPolygon(x,y,cmd.points);
				break ;
			}
		return rst;
	}

	HitArea._ptInPolygon=function(x,y,areaPoints){
		var p=HitArea._ptPoint;
		p.setTo(x,y);
		var nCross=0;
		var p1x=NaN,p1y=NaN,p2x=NaN,p2y=NaN;
		var len=0;
		len=areaPoints.length;
		for (var i=0;i < len;i+=2){
			p1x=areaPoints[i];
			p1y=areaPoints[i+1];
			p2x=areaPoints[(i+2)% len];
			p2y=areaPoints[(i+3)% len];
			if (p1y==p2y)continue ;
			if (p.y < Math.min(p1y,p2y))continue ;
			if (p.y >=Math.max(p1y,p2y))continue ;
			var tx=(p.y-p1y)*(p2x-p1x)/ (p2y-p1y)+p1x;
			if (tx > p.x)nCross++;
		}
		return (nCross % 2==1);
	}

	HitArea._cmds=[];
	__static(HitArea,
	['_rect',function(){return this._rect=new Rectangle();},'_ptPoint',function(){return this._ptPoint=new Point();}
	]);
	return HitArea;
})()


/**
*Config 用于配置一些全局参数。如需更改，请在初始化引擎之前设置。
*/
//class Config
var Config=(function(){
	function Config(){}
	__class(Config,'Config');
	Config.animationInterval=50;
	Config.isAntialias=false;
	Config.isAlpha=false;
	Config.premultipliedAlpha=true;
	Config.isStencil=true;
	Config.preserveDrawingBuffer=false;
	Config.webGL2D_MeshAllocMaxMem=true;
	Config.is2DPixelArtGame=false;
	Config.useWebGL2=false;
	return Config;
})()


/**
*恢复命令，和save配套使用
*/
//class laya.display.cmd.RestoreCmd
var RestoreCmd=(function(){
	function RestoreCmd(){}
	__class(RestoreCmd,'laya.display.cmd.RestoreCmd');
	var __proto=RestoreCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("RestoreCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.restore();
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "Restore";
	});

	RestoreCmd.create=function(){
		var cmd=Pool.getItemByClass("RestoreCmd",RestoreCmd);
		return cmd;
	}

	RestoreCmd.ID="Restore";
	return RestoreCmd;
})()


/**
*@private
*凸包算法。
*/
//class laya.maths.GrahamScan
var GrahamScan=(function(){
	function GrahamScan(){}
	__class(GrahamScan,'laya.maths.GrahamScan');
	GrahamScan.multiply=function(p1,p2,p0){
		return ((p1.x-p0.x)*(p2.y-p0.y)-(p2.x-p0.x)*(p1.y-p0.y));
	}

	GrahamScan.dis=function(p1,p2){
		return (p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y);
	}

	GrahamScan._getPoints=function(count,tempUse,rst){
		(tempUse===void 0)&& (tempUse=false);
		if (!GrahamScan._mPointList)GrahamScan._mPointList=[];
		while (GrahamScan._mPointList.length < count)GrahamScan._mPointList.push(new Point());
		if (!rst)rst=[];
		rst.length=0;
		if (tempUse){
			GrahamScan.getFrom(rst,GrahamScan._mPointList,count);
			}else {
			GrahamScan.getFromR(rst,GrahamScan._mPointList,count);
		}
		return rst;
	}

	GrahamScan.getFrom=function(rst,src,count){
		var i=0;
		for (i=0;i < count;i++){
			rst.push(src[i]);
		}
		return rst;
	}

	GrahamScan.getFromR=function(rst,src,count){
		var i=0;
		for (i=0;i < count;i++){
			rst.push(src.pop());
		}
		return rst;
	}

	GrahamScan.pListToPointList=function(pList,tempUse){
		(tempUse===void 0)&& (tempUse=false);
		var i=0,len=pList.length / 2,rst=GrahamScan._getPoints(len,tempUse,GrahamScan._tempPointList);
		for (i=0;i < len;i++){
			rst[i].setTo(pList[i+i],pList[i+i+1]);
		}
		return rst;
	}

	GrahamScan.pointListToPlist=function(pointList){
		var i=0,len=pointList.length,rst=GrahamScan._temPList,tPoint;
		rst.length=0;
		for (i=0;i < len;i++){
			tPoint=pointList[i];
			rst.push(tPoint.x,tPoint.y);
		}
		return rst;
	}

	GrahamScan.scanPList=function(pList){
		return Utils.copyArray(pList,GrahamScan.pointListToPlist(GrahamScan.scan(GrahamScan.pListToPointList(pList,true))));
	}

	GrahamScan.scan=function(PointSet){
		var i=0,j=0,k=0,top=2,tmp,n=PointSet.length,ch;
		var _tmpDic={};
		var key;
		ch=GrahamScan._temArr;
		ch.length=0;
		n=PointSet.length;
		for (i=n-1;i >=0;i--){
			tmp=PointSet[i];
			key=tmp.x+"_"+tmp.y;
			if (!_tmpDic.hasOwnProperty(key)){
				_tmpDic[key]=true;
				ch.push(tmp);
			}
		}
		n=ch.length;
		Utils.copyArray(PointSet,ch);
		for (i=1;i < n;i++)
		if ((PointSet[i].y < PointSet[k].y)|| ((PointSet[i].y==PointSet[k].y)&& (PointSet[i].x < PointSet[k].x)))
			k=i;
		tmp=PointSet[0];
		PointSet[0]=PointSet[k];
		PointSet[k]=tmp;
		for (i=1;i < n-1;i++){
			k=i;
			for (j=i+1;j < n;j++)
			if ((GrahamScan.multiply(PointSet[j],PointSet[k],PointSet[0])> 0)|| ((GrahamScan.multiply(PointSet[j],PointSet[k],PointSet[0])==0)&& (GrahamScan.dis(PointSet[0],PointSet[j])< GrahamScan.dis(PointSet[0],PointSet[k]))))
				k=j;
			tmp=PointSet[i];
			PointSet[i]=PointSet[k];
			PointSet[k]=tmp;
		}
		ch=GrahamScan._temArr;
		ch.length=0;
		if (PointSet.length < 3){
			return Utils.copyArray(ch,PointSet);
		}
		ch.push(PointSet[0],PointSet[1],PointSet[2]);
		for (i=3;i < n;i++){
			while (ch.length >=2 && GrahamScan.multiply(PointSet[i],ch[ch.length-1],ch[ch.length-2])>=0)ch.pop();
			PointSet[i] && ch.push(PointSet[i]);
		}
		return ch;
	}

	GrahamScan._mPointList=null;
	GrahamScan._tempPointList=[];
	GrahamScan._temPList=[];
	GrahamScan._temArr=[];
	return GrahamScan;
})()


/**
*<p><code>URL</code> 提供URL格式化，URL版本管理的类。</p>
*<p>引擎加载资源的时候，会自动调用formatURL函数格式化URL路径</p>
*<p>通过basePath属性可以设置网络基础路径</p>
*<p>通过设置customFormat函数，可以自定义URL格式化的方式</p>
*<p>除了默认的通过增加后缀的格式化外，通过VersionManager类，可以开启IDE提供的，基于目录的管理方式来替代 "?v=" 的管理方式</p>
*@see laya.net.VersionManager
*/
//class laya.net.URL
var URL=(function(){
	function URL(url){
		/**@private */
		this._url=null;
		/**@private */
		this._path=null;
		this._url=URL.formatURL(url);
		this._path=URL.getPath(url);
	}

	__class(URL,'laya.net.URL');
	var __proto=URL.prototype;
	/**地址的文件夹路径（不包括文件名）。*/
	__getset(0,__proto,'path',function(){
		return this._path;
	});

	/**格式化后的地址。*/
	__getset(0,__proto,'url',function(){
		return this._url;
	});

	URL.formatURL=function(url){
		if (!url)return "null path";
		if (url.indexOf(":")> 0)return url;
		if (URL.customFormat !=null)url=URL.customFormat(url);
		if (url.indexOf(":")> 0)return url;
		var char1=url.charAt(0);
		if (char1==="."){
			return URL._formatRelativePath(URL.basePath+url);
			}else if (char1==='~'){
			return URL.rootPath+url.substring(1);
			}else if (char1==="d"){
			if (url.indexOf("data:image")===0)return url;
			}else if (char1==="/"){
			return url;
		}
		return URL.basePath+url;
	}

	URL._formatRelativePath=function(value){
		var parts=value.split("/");
		for (var i=0,len=parts.length;i < len;i++){
			if (parts[i]=='..'){
				parts.splice(i-1,2);
				i-=2;
			}
		}
		return parts.join('/');
	}

	URL.getPath=function(url){
		var ofs=url.lastIndexOf('/');
		return ofs > 0 ? url.substr(0,ofs+1):"";
	}

	URL.getFileName=function(url){
		var ofs=url.lastIndexOf('/');
		return ofs > 0 ? url.substr(ofs+1):url;
	}

	URL.getAdptedFilePath=function(url){
		if (!URL.exportSceneToJson || !url)return url;
		var i=0,len=0;
		len=URL._adpteTypeList.length;
		var tArr;
		for (i=0;i < len;i++){
			tArr=URL._adpteTypeList[i];
			url=url.replace(tArr[0],tArr[1]);
		}
		return url;
	}

	URL.version={};
	URL.exportSceneToJson=false;
	URL.basePath="";
	URL.rootPath="";
	URL.customFormat=function(url){
		var newUrl=URL.version[url];
		if (!Render.isConchApp && newUrl)url+="?v="+newUrl;
		return url;
	}

	__static(URL,
	['_adpteTypeList',function(){return this._adpteTypeList=[[".scene3d",".json"],[".scene",".json"],[".taa",".json"],[".prefab",".json"]];}
	]);
	return URL;
})()


/**

*/
*/
*/
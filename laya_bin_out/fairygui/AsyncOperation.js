//class fairygui.AsyncOperation
var AsyncOperation=(function(){
	var DisplayListItem;
	function AsyncOperation(){
		/**
		*callback(obj:GObject)
		*/
		this.callback=null;
		this._itemList=null;
		this._objectPool=null;
		this._index=0;
		this._itemList=[];
		this._objectPool=[];
	}

	__class(AsyncOperation,'fairygui.AsyncOperation');
	var __proto=AsyncOperation.prototype;
	__proto.createObject=function(pkgName,resName){
		var pkg=UIPackage.getByName(pkgName);
		if(pkg){
			var pi=pkg.getItemByName(resName);
			if(!pi)
				throw new Error("resource not found: "+resName);
			this.internalCreateObject(pi);
		}
		else
		throw new Error("package not found: "+pkgName);
	}

	__proto.createObjectFromURL=function(url){
		var pi=UIPackage.getItemByURL(url);
		if(pi)
			this.internalCreateObject(pi);
		else
		throw new Error("resource not found: "+url);
	}

	__proto.cancel=function(){
		Laya.timer.clear(this,this.run);
		this._itemList.length=0;
		if(this._objectPool.length>0){
			var cnt=this._objectPool.length;
			for(var i=0;i<cnt;i++){
				this._objectPool[i].dispose();
			}
			this._objectPool.length=0;
		}
	}

	__proto.internalCreateObject=function(item){
		this._itemList.length=0;
		this._objectPool.length=0;
		var di=new DisplayListItem(item,9);
		di.childCount=this.collectComponentChildren(item);
		this._itemList.push(di);
		this._index=0;
		Laya.timer.frameLoop(1,this,this.run);
	}

	__proto.collectComponentChildren=function(item){
		var buffer=item.rawData;
		buffer.seek(0,2);
		var di;
		var pi;
		var i=0;
		var dataLen=0;
		var curPos=0;
		var pkg;
		var dcnt=buffer.getInt16();
		for (i=0;i < dcnt;i++){
			dataLen=buffer.getInt16();
			curPos=buffer.pos;
			buffer.seek(curPos,0);
			var type=buffer.readByte();
			var src=buffer.readS();
			var pkgId=buffer.readS();
			buffer.pos=curPos;
			if (src !=null){
				if (pkgId !=null)
					pkg=UIPackage.getById(pkgId);
				else
				pkg=item.owner;
				pi=pkg !=null ? pkg.getItemById(src):null;
				di=new DisplayListItem(pi,type);
				if (pi !=null && pi.type==3)
					di.childCount=this.collectComponentChildren(pi);
			}
			else{
				di=new DisplayListItem(null,type);
				if (type==10)
					di.listItemCount=this.collectListChildren(buffer);
			}
			this._itemList.push(di);
			buffer.pos=curPos+dataLen;
		}
		return dcnt;
	}

	__proto.collectListChildren=function(buffer){
		buffer.seek(buffer.pos,8);
		var listItemCount=0;
		var i=0;
		var nextPos=0;
		var url;
		var pi;
		var di;
		var defaultItem=buffer.readS();
		var itemCount=buffer.getInt16();
		for (i=0;i < itemCount;i++){
			nextPos=buffer.getInt16();
			nextPos+=buffer.pos;
			url=buffer.readS();
			if (url==null)
				url=defaultItem;
			if (url){
				pi=UIPackage.getItemByURL(url);
				if (pi !=null){
					di=new DisplayListItem(pi,pi.objectType);
					if (pi.type==3)
						di.childCount=this.collectComponentChildren(pi);
					this._itemList.push(di);
					listItemCount++;
				}
			}
			buffer.pos=nextPos;
		}
		return listItemCount;
	}

	__proto.run=function(){
		var obj;
		var di;
		var poolStart=0;
		var k=0;
		var t=Browser.now();
		var frameTime=UIConfig$1.frameTimeForAsyncUIConstruction;
		var totalItems=this._itemList.length;
		while(this._index<totalItems){
			di=this._itemList[this._index];
			if (di.packageItem !=null){
				obj=UIObjectFactory.newObject(di.packageItem);
				obj.packageItem=di.packageItem;
				this._objectPool.push(obj);
				UIPackage._constructing++;
				if (di.packageItem.type==3){
					poolStart=this._objectPool.length-di.childCount-1;
					(obj).constructFromResource2(this._objectPool,poolStart);
					this._objectPool.splice(poolStart,di.childCount);
				}
				else{
					obj.constructFromResource();
				}
				UIPackage._constructing--;
			}
			else{
				obj=UIObjectFactory.newObject2(di.type);
				this._objectPool.push(obj);
				if (di.type==10 && di.listItemCount > 0){
					poolStart=this._objectPool.length-di.listItemCount-1;
					for (k=0;k < di.listItemCount;k++)
					(obj).itemPool.returnObject(this._objectPool[k+poolStart]);
					this._objectPool.splice(poolStart,di.listItemCount);
				}
			}
			this._index++;
			if ((this._index % 5==0)&& Browser.now()-t >=frameTime)
				return;
		}
		Laya.timer.clear(this,this.run);
		var result=this._objectPool[0];
		this._itemList.length=0;
		this._objectPool.length=0;
		if(this.callback!=null)
			this.callback.runWith(result);
	}

	AsyncOperation.__init$=function(){
		
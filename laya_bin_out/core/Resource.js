/**
*<code>Resource</code> 资源存取类。
*/
//class laya.resource.Resource extends laya.events.EventDispatcher
var Resource=(function(_super){
	function Resource(){
		/**@private */
		//this._id=0;
		/**@private */
		//this._url=null;
		/**@private */
		this._cpuMemory=0;
		/**@private */
		this._gpuMemory=0;
		/**@private */
		//this._destroyed=false;
		/**@private */
		//this._referenceCount=0;
		/**是否加锁，如果true为不能使用自动释放机制。*/
		//this.lock=false;
		/**名称。 */
		//this.name=null;
		Resource.__super.call(this);
		this._id=++Resource._uniqueIDCounter;
		this._destroyed=false;
		this._referenceCount=0;
		Resource._idResourcesMap[this.id]=this;
		this.lock=false;
	}

	__class(Resource,'laya.resource.Resource',_super);
	var __proto=Resource.prototype;
	Laya.imps(__proto,{"laya.resource.ICreateResource":true,"laya.resource.IDestroy":true})
	/**
	*@private
	*/
	__proto._setCPUMemory=function(value){
		var offsetValue=value-this._cpuMemory;
		this._cpuMemory=value;
		Resource._addCPUMemory(offsetValue);
	}

	/**
	*@private
	*/
	__proto._setGPUMemory=function(value){
		var offsetValue=value-this._gpuMemory;
		this._gpuMemory=value;
		Resource._addGPUMemory(offsetValue);
	}

	/**
	*@private
	*/
	__proto._setCreateURL=function(url){
		if (this._url!==url){
			var resList;
			if (this._url){
				resList=Resource._urlResourcesMap[this._url];
				resList.splice(resList.indexOf(this),1);
				(resList.length===0)&& (delete Resource._urlResourcesMap[this._url]);
			}
			if (url){
				resList=Resource._urlResourcesMap[url];
				(resList)|| (Resource._urlResourcesMap[url]=resList=[]);
				resList.push(this);
			}
			this._url=url;
		}
	}

	/**
	*@private
	*/
	__proto._addReference=function(count){
		(count===void 0)&& (count=1);
		this._referenceCount+=count;
	}

	/**
	*@private
	*/
	__proto._removeReference=function(count){
		(count===void 0)&& (count=1);
		this._referenceCount-=count;
	}

	/**
	*@private
	*/
	__proto._clearReference=function(){
		this._referenceCount=0;
	}

	/**
	*@private
	*/
	__proto._recoverResource=function(){}
	/**
	*@private
	*/
	__proto._disposeResource=function(){}
	/**
	*@private
	*/
	__proto._activeResource=function(){}
	/**
	*销毁资源,销毁后资源不能恢复。
	*/
	__proto.destroy=function(){
		if (this._destroyed)
			return;
		this._destroyed=true;
		this.lock=false;
		this._disposeResource();
		delete Resource._idResourcesMap[this.id];
		var resList;
		if (this._url){
			resList=Resource._urlResourcesMap[this._url];
			if (resList){
				resList.splice(resList.indexOf(this),1);
				(resList.length===0)&& (delete Resource._urlResourcesMap[this._url]);
			};
			var resou=Loader.getRes(this._url);
			(resou==this)&& (delete Loader.loadedMap[this._url]);
		}
	}

	/**
	*获取唯一标识ID,通常用于识别。
	*/
	__getset(0,__proto,'id',function(){
		return this._id;
	});

	/**
	*显存大小。
	*/
	__getset(0,__proto,'gpuMemory',function(){
		return this._gpuMemory;
	});

	/**
	*获取资源的URL地址。
	*@return URL地址。
	*/
	__getset(0,__proto,'url',function(){
		return this._url;
	});

	/**
	*内存大小。
	*/
	__getset(0,__proto,'cpuMemory',function(){
		return this._cpuMemory;
	});

	/**
	*是否已处理。
	*/
	__getset(0,__proto,'destroyed',function(){
		return this._destroyed;
	});

	/**
	*获取资源的引用计数。
	*/
	__getset(0,__proto,'referenceCount',function(){
		return this._referenceCount;
	});

	/**
	*当前内存，以字节为单位。
	*/
	__getset(1,Resource,'cpuMemory',function(){
		return this._cpuMemory;
	},laya.events.EventDispatcher._$SET_cpuMemory);

	/**
	*当前显存，以字节为单位。
	*/
	__getset(1,Resource,'gpuMemory',function(){
		return this._gpuMemory;
	},laya.events.EventDispatcher._$SET_gpuMemory);

	Resource._addCPUMemory=function(size){
		this._cpuMemory+=size;
	}

	Resource._addGPUMemory=function(size){
		this._gpuMemory+=size;
	}

	Resource._addMemory=function(cpuSize,gpuSize){
		this._cpuMemory+=cpuSize;
		this._gpuMemory+=gpuSize;
	}

	Resource.getResourceByID=function(id){
		return Resource._idResourcesMap[id];
	}

	Resource.getResourceByURL=function(url,index){
		(index===void 0)&& (index=0);
		return Resource._urlResourcesMap[url][index];
	}

	Resource.destroyUnusedResources=function(){
		for (var k in Resource._idResourcesMap){
			var res=Resource._idResourcesMap[k];
			if (!res.lock && res._referenceCount===0)
				res.destroy();
		}
	}

	Resource._uniqueIDCounter=0;
	Resource._idResourcesMap={};
	Resource._urlResourcesMap={};
	Resource._cpuMemory=0;
	Resource._gpuMemory=0;
	return Resource;
})(EventDispatcher)


/**

*/
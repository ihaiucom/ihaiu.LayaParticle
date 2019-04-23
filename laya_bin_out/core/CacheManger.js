

/**
*@private
*对象缓存统一管理类
*/
//class laya.utils.CacheManger
var CacheManger=(function(){
	function CacheManger(){}
	__class(CacheManger,'laya.utils.CacheManger');
	CacheManger.regCacheByFunction=function(disposeFunction,getCacheListFunction){
		CacheManger.unRegCacheByFunction(disposeFunction,getCacheListFunction);
		var cache;
		cache={tryDispose:disposeFunction,getCacheList:getCacheListFunction};
		CacheManger._cacheList.push(cache);
	}

	CacheManger.unRegCacheByFunction=function(disposeFunction,getCacheListFunction){
		var i=0,len=0;
		len=CacheManger._cacheList.length;
		for (i=0;i < len;i++){
			if (CacheManger._cacheList[i].tryDispose==disposeFunction && CacheManger._cacheList[i].getCacheList==getCacheListFunction){
				CacheManger._cacheList.splice(i,1);
				return;
			}
		}
	}

	CacheManger.forceDispose=function(){
		var i=0,len=CacheManger._cacheList.length;
		for (i=0;i < len;i++){
			CacheManger._cacheList[i].tryDispose(true);
		}
	}

	CacheManger.beginCheck=function(waitTime){
		(waitTime===void 0)&& (waitTime=15000);
		Laya.systemTimer.loop(waitTime,null,CacheManger._checkLoop);
	}

	CacheManger.stopCheck=function(){
		Laya.systemTimer.clear(null,CacheManger._checkLoop);
	}

	CacheManger._checkLoop=function(){
		var cacheList=CacheManger._cacheList;
		if (cacheList.length < 1)return;
		var tTime=Browser.now();
		var count=0;
		var len=0;
		len=count=cacheList.length;
		while (count > 0){
			CacheManger._index++;
			CacheManger._index=CacheManger._index % len;
			cacheList[CacheManger._index].tryDispose(false);
			if (Browser.now()-tTime > CacheManger.loopTimeLimit)break ;
			count--;
		}
	}

	CacheManger.loopTimeLimit=2;
	CacheManger._cacheList=[];
	CacheManger._index=0;
	return CacheManger;
})()
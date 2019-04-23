//class fairygui.GObjectPool
var GObjectPool=(function(){
	function GObjectPool(){
		this._pool=null;
		this._count=0;
		this._pool={};
	}

	__class(GObjectPool,'fairygui.GObjectPool');
	var __proto=GObjectPool.prototype;
	__proto.clear=function(){
		for (var i1 in this._pool){
			var arr=this._pool[i1];
			var cnt=arr.length;
			for (var i=0;i < cnt;i++)
			arr[i].dispose();
		}
		this._pool={};
		this._count=0;
	}

	__proto.getObject=function(url){
		url=UIPackage.normalizeURL(url);
		if(url==null)
			return null;
		var arr=this._pool[url];
		if (arr !=null && arr.length>0){
			this._count--;
			return arr.shift();
		};
		var child=UIPackage.createObjectFromURL(url);
		return child;
	}

	__proto.returnObject=function(obj){
		var url=obj.resourceURL;
		if (!url)
			return;
		var arr=this._pool[url];
		if (arr==null){
			arr=[];
			this._pool[url]=arr;
		}
		this._count++;
		arr.push(obj);
	}

	__getset(0,__proto,'count',function(){
		return this._count;
	});

	return GObjectPool;
})()


/**
*Use for GGroup.layout
*/

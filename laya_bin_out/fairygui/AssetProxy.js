//class fairygui.AssetProxy
var AssetProxy=(function(){
	function AssetProxy(){
		this._asset=null;
		this._asset=Laya.loader;
	}

	__class(AssetProxy,'fairygui.AssetProxy');
	var __proto=AssetProxy.prototype;
	__proto.getRes=function(url){
		return this._asset.getRes(url);
	}

	__proto.load=function(url,complete,progress,type,priority,cache){
		(priority===void 0)&& (priority=1);
		(cache===void 0)&& (cache=true);
		this._asset.load(url,complete,progress,type,priority,cache);
	}

	__proto.setAsset=function(asset){
		this._asset=asset;
	}

	__getset(1,AssetProxy,'inst',function(){
		if(fairygui.AssetProxy._inst==null)
			AssetProxy._inst=new AssetProxy();
		return fairygui.AssetProxy._inst;
	});

	AssetProxy._inst=null;
	return AssetProxy;
})()



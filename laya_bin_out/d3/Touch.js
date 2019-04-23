/**
*<code>Touch</code> 类用于实现触摸描述。
*/
//class laya.d3.Touch
var Touch=(function(){
	function Touch(){
		/**@private [实现IListPool接口]*/
		this._indexInList=-1;
		/**@private */
		this._identifier=-1;
		this._position=new Vector2();
	}

	__class(Touch,'laya.d3.Touch');
	var __proto=Touch.prototype;
	Laya.imps(__proto,{"laya.resource.ISingletonElement":true})
	/**
	*@private [实现ISingletonElement接口]
	*/
	__proto._getIndexInList=function(){
		return this._indexInList;
	}

	/**
	*@private [实现ISingletonElement接口]
	*/
	__proto._setIndexInList=function(index){
		this._indexInList=index;
	}

	/**
	*获取唯一识别ID。
	*@return 唯一识别ID。
	*/
	__getset(0,__proto,'identifier',function(){
		return this._identifier;
	});

	/**
	*获取触摸点的像素坐标。
	*@return 触摸点的像素坐标 [只读]。
	*/
	__getset(0,__proto,'position',function(){
		return this._position;
	});

	return Touch;
})()


/**

*/
/**
*<code>GeometryElement</code> 类用于实现几何体元素,该类为抽象类。
*/
//class laya.d3.core.GeometryElement
var GeometryElement=(function(){
	function GeometryElement(){
		/**@private */
		//this._destroyed=false;
		this._destroyed=false;
	}

	__class(GeometryElement,'laya.d3.core.GeometryElement');
	var __proto=GeometryElement.prototype;
	Laya.imps(__proto,{"laya.resource.IDestroy":true})
	/**
	*获取几何体类型。
	*/
	__proto._getType=function(){
		throw "GeometryElement:must override it.";
	}

	/**
	*@private
	*@return 是否需要渲染。
	*/
	__proto._prepareRender=function(state){
		return true;
	}

	/**
	*@private
	*/
	__proto._render=function(state){
		throw "GeometryElement:must override it.";
	}

	/**
	*销毁。
	*/
	__proto.destroy=function(){
		if (this._destroyed)
			return;
		this._destroyed=true;
	}

	/**
	*获取是否销毁。
	*@return 是否销毁。
	*/
	__getset(0,__proto,'destroyed',function(){
		return this._destroyed;
	});

	GeometryElement._typeCounter=0;
	return GeometryElement;
})()


/**

*/
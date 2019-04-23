/**
*<code>Config3D</code> 类用于创建3D初始化配置。
*/
//class Config3D
var Config3D=(function(){
	function Config3D(){
		/**@private */
		this._defaultPhysicsMemory=16;
		/**@private */
		this._editerEnvironment=false;
		/**
		*是否开启抗锯齿。
		*/
		this.isAntialias=true;
		/**
		*设置画布是否透明。
		*/
		this.isAlpha=false;
		/**
		*设置画布是否预乘。
		*/
		this.premultipliedAlpha=true;
		/**
		*设置画布的是否开启模板缓冲。
		*/
		this.isStencil=true;
	}

	__class(Config3D,'Config3D');
	var __proto=Config3D.prototype;
	/**
	*设置默认物理功能初始化内存，单位为M。
	*@param value 默认物理功能初始化内存。
	*/
	/**
	*获取默认物理功能初始化内存，单位为M。
	*@return 默认物理功能初始化内存。
	*/
	__getset(0,__proto,'defaultPhysicsMemory',function(){
		return this._defaultPhysicsMemory;
		},function(value){
		if (value < 16)
			throw "defaultPhysicsMemory must large than 16M";
		this._defaultPhysicsMemory=value;
	});

	__static(Config3D,
	['_defaultConfig',function(){return this._defaultConfig=new Config3D();}
	]);
	return Config3D;
})()


/**

*/
/**
*<code>ColorOverLifetime</code> 类用于粒子的生命周期颜色。
*/
//class laya.d3.core.particleShuriKen.module.ColorOverLifetime
var ColorOverLifetime=(function(){
	function ColorOverLifetime(color){
		/**@private */
		this._color=null;
		/**是否启用。*/
		this.enbale=false;
		this._color=color;
	}

	__class(ColorOverLifetime,'laya.d3.core.particleShuriKen.module.ColorOverLifetime');
	var __proto=ColorOverLifetime.prototype;
	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destColorOverLifetime=destObject;
		this._color.cloneTo(destColorOverLifetime._color);
		destColorOverLifetime.enbale=this.enbale;
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destColor;
		switch (this._color.type){
			case 0:
				destColor=GradientColor.createByConstant(this._color.constant.clone());
				break ;
			case 1:
				destColor=GradientColor.createByGradient(this._color.gradient.clone());
				break ;
			case 2:
				destColor=GradientColor.createByRandomTwoConstant(this._color.constantMin.clone(),this._color.constantMax.clone());
				break ;
			case 3:
				destColor=GradientColor.createByRandomTwoGradient(this._color.gradientMin.clone(),this._color.gradientMax.clone());
				break ;
			};
		var destColorOverLifetime=/*__JS__ */new this.constructor(destColor);
		destColorOverLifetime.enbale=this.enbale;
		return destColorOverLifetime;
	}

	/**
	*获取颜色。
	*/
	__getset(0,__proto,'color',function(){
		return this._color;
	});

	return ColorOverLifetime;
})()


/**
*@private
*/
//class laya.d3.animation.KeyframeNode
var KeyframeNode=(function(){
	function KeyframeNode(){
		/**@private */
		this._indexInList=0;
		/**@private */
		this.type=0;
		/**@private */
		this.fullPath=null;
		/**@private */
		this.propertyOwner=null;
		/**@private */
		this.data=null;
		this._ownerPath=[];
		this._propertys=[];
		this._keyFrames=[];
	}

	__class(KeyframeNode,'laya.d3.animation.KeyframeNode');
	var __proto=KeyframeNode.prototype;
	/**
	*@private
	*/
	__proto._setOwnerPathCount=function(value){
		this._ownerPath.length=value;
	}

	/**
	*@private
	*/
	__proto._setOwnerPathByIndex=function(index,value){
		this._ownerPath[index]=value;
	}

	/**
	*@private
	*/
	__proto._joinOwnerPath=function(sep){
		return this._ownerPath.join(sep);
	}

	/**
	*@private
	*/
	__proto._setPropertyCount=function(value){
		this._propertys.length=value;
	}

	/**
	*@private
	*/
	__proto._setPropertyByIndex=function(index,value){
		this._propertys[index]=value;
	}

	/**
	*@private
	*/
	__proto._joinProperty=function(sep){
		return this._propertys.join(sep);
	}

	/**
	*@private
	*/
	__proto._setKeyframeCount=function(value){
		this._keyFrames.length=value;
	}

	/**
	*@private
	*/
	__proto._setKeyframeByIndex=function(index,value){
		this._keyFrames[index]=value;
	}

	/**
	*通过索引获取精灵路径。
	*@param index 索引。
	*/
	__proto.getOwnerPathByIndex=function(index){
		return this._ownerPath[index];
	}

	/**
	*通过索引获取属性路径。
	*@param index 索引。
	*/
	__proto.getPropertyByIndex=function(index){
		return this._propertys[index];
	}

	/**
	*通过索引获取帧。
	*@param index 索引。
	*/
	__proto.getKeyframeByIndex=function(index){
		return this._keyFrames[index];
	}

	/**
	*获取精灵路径个数。
	*@return 精灵路径个数。
	*/
	__getset(0,__proto,'ownerPathCount',function(){
		return this._ownerPath.length;
	});

	/**
	*获取属性路径个数。
	*@return 数量路径个数。
	*/
	__getset(0,__proto,'propertyCount',function(){
		return this._propertys.length;
	});

	/**
	*获取帧个数。
	*帧个数。
	*/
	__getset(0,__proto,'keyFramesCount',function(){
		return this._keyFrames.length;
	});

	return KeyframeNode;
})()


/**

*/
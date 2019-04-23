/**
*<code>AnimatorControllerLayer</code> 类用于创建动画控制器层。
*/
//class laya.d3.component.AnimatorControllerLayer
var AnimatorControllerLayer=(function(){
	function AnimatorControllerLayer(name){
		/**@private 0:常规播放、1:动态融合播放、2:固定融合播放*/
		//this._playType=0;
		/**@private */
		//this._crossDuration=NaN;
		/**@private */
		//this._crossPlayState=null;
		/**@private */
		//this._crossMark=0;
		/**@private */
		//this._crossNodesOwnersCount=0;
		/**@private */
		//this._crossNodesOwners=null;
		/**@private */
		//this._crossNodesOwnersIndicesMap=null;
		/**@private */
		//this._srcCrossClipNodeIndices=null;
		/**@private */
		//this._destCrossClipNodeIndices=null;
		/**@private */
		//this._defaultState=null;
		/**@private */
		//this._currentPlayState=null;
		/**@private */
		this._statesMap={};
		/**@private */
		//this._states=null;
		/**@private */
		//this._playStateInfo=null;
		/**@private */
		//this._crossPlayStateInfo=null;
		/**层的名称。*/
		//this.name=null;
		/**名称。*/
		//this.blendingMode=0;
		/**权重。*/
		//this.defaultWeight=0;
		/**激活时是否自动播放*/
		this.playOnWake=true;
		this._playType=-1;
		this._crossMark=0;
		this._crossDuration=-1;
		this._crossNodesOwnersIndicesMap={};
		this._crossNodesOwnersCount=0;
		this._crossNodesOwners=[];
		this._defaultState=null;
		this._currentPlayState=null;
		this._states=[];
		this._playStateInfo=new AnimatorPlayState();
		this._crossPlayStateInfo=new AnimatorPlayState();
		this._srcCrossClipNodeIndices=[];
		this._destCrossClipNodeIndices=[];
		this.name=name;
		this.defaultWeight=1.0;
		this.blendingMode=laya.d3.component.AnimatorControllerLayer.BLENDINGMODE_OVERRIDE;
	}

	__class(AnimatorControllerLayer,'laya.d3.component.AnimatorControllerLayer');
	var __proto=AnimatorControllerLayer.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*@private
	*/
	__proto.getAnimatorState=function(name){
		var state=this._statesMap[name];
		return state ? state :null;
	}

	/**
	*@private
	*/
	__proto.destroy=function(){
		this._statesMap=null;
		this._states=null;
		this._playStateInfo=null;
		this._crossPlayStateInfo=null;
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var dest=destObject;
		dest.name=this.name;
		dest.blendingMode=this.blendingMode;
		dest.defaultWeight=this.defaultWeight;
		dest.playOnWake=this.playOnWake;
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var dest=/*__JS__ */new this.constructor();
		this.cloneTo(dest);
		return dest;
	}

	AnimatorControllerLayer.BLENDINGMODE_OVERRIDE=0;
	AnimatorControllerLayer.BLENDINGMODE_ADDTIVE=1;
	return AnimatorControllerLayer;
})()


/**

*/
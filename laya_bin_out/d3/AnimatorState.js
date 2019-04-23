/**
*<code>AnimatorState</code> 类用于创建动作状态。
*/
//class laya.d3.component.AnimatorState
var AnimatorState=(function(){
	function AnimatorState(){
		/**@private */
		//this._clip=null;
		/**@private */
		//this._currentFrameIndices=null;
		/**@private */
		//this._scripts=null;
		/**名称。*/
		//this.name=null;
		/**动画播放速度,1.0为正常播放速度。*/
		this.speed=1.0;
		/**动作播放起始时间。*/
		this.clipStart=0.0;
		/**动作播放结束时间。*/
		this.clipEnd=1.0;
		this._nodeOwners=[];
	}

	__class(AnimatorState,'laya.d3.component.AnimatorState');
	var __proto=AnimatorState.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*@private
	*/
	__proto._resetFrameIndices=function(){
		for (var i=0,n=this._currentFrameIndices.length;i < n;i++)
		this._currentFrameIndices[i]=-1;
	}

	/**
	*添加脚本。
	*@param type 组件类型。
	*@return 脚本。
	*
	*/
	__proto.addScript=function(type){
		var script=new type();this._scripts=this._scripts|| [];
		this._scripts.push(script);
		return script;
	}

	/**
	*获取脚本。
	*@param type 组件类型。
	*@return 脚本。
	*
	*/
	__proto.getScript=function(type){
		if (this._scripts){
			for (var i=0,n=this._scripts.length;i < n;i++){
				var script=this._scripts[i];
				if (Laya.__typeof(script,type))
					return script;
			}
		}
		return null;
	}

	/**
	*获取脚本集合。
	*@param type 组件类型。
	*@return 脚本集合。
	*
	*/
	__proto.getScripts=function(type){
		var coms;
		if (this._scripts){
			for (var i=0,n=this._scripts.length;i < n;i++){
				var script=this._scripts[i];
				if (Laya.__typeof(script,type)){coms=coms|| [];
					coms.push(script);
				}
			}
		}
		return coms;
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var dest=destObject;
		dest.name=this.name;
		dest.speed=this.speed;
		dest.clipStart=this.clipStart;
		dest.clipEnd=this.clipEnd;
		dest.clip=this._clip;
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

	/**
	*设置动作。
	*@param value 动作。
	*/
	/**
	*获取动作。
	*@return 动作
	*/
	__getset(0,__proto,'clip',function(){
		return this._clip;
		},function(value){
		this._clip=value;
		this._currentFrameIndices=new Int16Array(value._nodes.count);
		this._resetFrameIndices();
	});

	return AnimatorState;
})()


/**

*/
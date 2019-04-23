/**
*<code>BoneNode</code> 类用于实现骨骼节点。
*/
//class laya.d3.animation.AnimationNode
var AnimationNode=(function(){
	function AnimationNode(localPosition,localRotation,localScale,worldMatrix){
		/**@private */
		//this._children=null;
		/**@private */
		//this._parent=null;
		/**@private [只读]*/
		//this.transform=null;
		/**节点名称。 */
		//this.name=null;
		/**@private [NATIVE]*/
		//this._worldMatrixIndex=0;
		this._children=[];
		this.transform=new AnimationTransform3D(this,localPosition,localRotation,localScale,worldMatrix);
	}

	__class(AnimationNode,'laya.d3.animation.AnimationNode');
	var __proto=AnimationNode.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*添加子节点。
	*@param child 子节点。
	*/
	__proto.addChild=function(child){
		child._parent=this;
		child.transform.setParent(this.transform);
		this._children.push(child);
	}

	/**
	*移除子节点。
	*@param child 子节点。
	*/
	__proto.removeChild=function(child){
		var index=this._children.indexOf(child);
		(index!==-1)&& (this._children.splice(index,1));
	}

	/**
	*根据名字获取子节点。
	*@param name 名字。
	*/
	__proto.getChildByName=function(name){
		for (var i=0,n=this._children.length;i < n;i++){
			var child=this._children[i];
			if (child.name===name)
				return child;
		}
		return null;
	}

	/**
	*根据索引获取子节点。
	*@param index 索引。
	*/
	__proto.getChildByIndex=function(index){
		return this._children[index];
	}

	/**
	*获取子节点的个数。
	*/
	__proto.getChildCount=function(){
		return this._children.length;
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destNode=destObject;
		destNode.name=this.name;
		for (var i=0,n=this._children.length;i < n;i++){
			var child=this._children[i];
			var destChild=child.clone();
			destNode.addChild(destChild);
			var transform=child.transform;
			var destTransform=destChild.transform;
			var destLocalPosition=destTransform.localPosition;
			var destLocalRotation=destTransform.localRotation;
			var destLocalScale=destTransform.localScale;
			transform.localPosition.cloneTo(destLocalPosition);
			transform.localRotation.cloneTo(destLocalRotation);
			transform.localScale.cloneTo(destLocalScale);
			destTransform.localPosition=destLocalPosition;
			destTransform.localRotation=destLocalRotation;
			destTransform.localScale=destLocalScale;
		}
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var dest=new AnimationNode();
		this.cloneTo(dest);
		return dest;
	}

	/**
	*@private [NATIVE]
	*/
	__proto._cloneNative=function(localPositions,localRotations,localScales,animationNodeWorldMatrixs,animationNodeParentIndices,parentIndex,avatar){
		var curID=avatar._nativeCurCloneCount;
		animationNodeParentIndices[curID]=parentIndex;
		var localPosition=new Float32Array(localPositions.buffer,curID *3 *4,3);
		var localRotation=new Float32Array(localRotations.buffer,curID *4 *4,4);
		var localScale=new Float32Array(localScales.buffer,curID *3 *4,3);
		var worldMatrix=new Float32Array(animationNodeWorldMatrixs.buffer,curID *16 *4,16);
		var dest=new AnimationNode(localPosition,localRotation,localScale,worldMatrix);
		dest._worldMatrixIndex=curID;
		this._cloneToNative(dest,localPositions,localRotations,localScales,animationNodeWorldMatrixs,animationNodeParentIndices,curID,avatar);
		return dest;
	}

	/**
	*@private [NATIVE]
	*/
	__proto._cloneToNative=function(destObject,localPositions,localRotations,localScales,animationNodeWorldMatrixs,animationNodeParentIndices,parentIndex,avatar){
		var destNode=destObject;
		destNode.name=this.name;
		for (var i=0,n=this._children.length;i < n;i++){
			var child=this._children[i];
			avatar._nativeCurCloneCount++;
			var destChild=child._cloneNative(localPositions,localRotations,localScales,animationNodeWorldMatrixs,animationNodeParentIndices,parentIndex,avatar);
			destNode.addChild(destChild);
			var transform=child.transform;
			var destTransform=destChild.transform;
			var destLocalPosition=destTransform.localPosition;
			var destLocalRotation=destTransform.localRotation;
			var destLocalScale=destTransform.localScale;
			transform.localPosition.cloneTo(destLocalPosition);
			transform.localRotation.cloneTo(destLocalRotation);
			transform.localScale.cloneTo(destLocalScale);
			destTransform.localPosition=destLocalPosition;
			destTransform.localRotation=destLocalRotation;
			destTransform.localScale=destLocalScale;
		}
	}

	return AnimationNode;
})()


/**

*/
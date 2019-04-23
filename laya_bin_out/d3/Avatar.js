/**
*<code>Avatar</code> 类用于创建Avatar。
*/
//class laya.d3.core.Avatar extends laya.resource.Resource
var Avatar=(function(_super){
	function Avatar(){
		/**@private */
		this._rootNode=null;
		/**@private [NATIVE]*/
		this._nativeNodeCount=0;
		/**@private [NATIVE]*/
		this._nativeCurCloneCount=0;
		Avatar.__super.call(this);
	}

	__class(Avatar,'laya.d3.core.Avatar',_super);
	var __proto=Avatar.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*@private
	*/
	__proto._initCloneToAnimator=function(destNode,destAnimator){
		destAnimator._avatarNodeMap[destNode.name]=destNode;
		for (var i=0,n=destNode.getChildCount();i < n;i++)
		this._initCloneToAnimator(destNode.getChildByIndex(i),destAnimator);
	}

	/**
	*@private
	*/
	__proto._parseNode=function(nodaData,node){
		var name=nodaData.props.name;
		node.name=name;
		var props=nodaData.props;
		var transform=node.transform;
		var pos=transform.localPosition;
		var rot=transform.localRotation;
		var sca=transform.localScale;
		pos.fromArray(props.translate);
		rot.fromArray(props.rotation);
		sca.fromArray(props.scale);
		transform.localPosition=pos;
		transform.localRotation=rot;
		transform.localScale=sca;
		var childrenData=nodaData.child;
		for (var j=0,n=childrenData.length;j < n;j++){
			var childData=childrenData[j];
			var childBone=new AnimationNode(new Float32Array(3),new Float32Array(4),new Float32Array(3),new Float32Array(16));
			node.addChild(childBone);
			if (Render.isConchApp)
				this._nativeNodeCount++;
			this._parseNode(childData,childBone);
		}
	}

	/**
	*克隆数据到Avatr。
	*@param destObject 克隆源。
	*/
	__proto._cloneDatasToAnimator=function(destAnimator){
		var destRoot;
		destRoot=this._rootNode.clone();
		var transform=this._rootNode.transform;
		var destTransform=destRoot.transform;
		var destPosition=destTransform.localPosition;
		var destRotation=destTransform.localRotation;
		var destScale=destTransform.localScale;
		transform.localPosition.cloneTo(destPosition);
		transform.localRotation.cloneTo(destRotation);
		transform.localScale.cloneTo(destScale);
		destTransform.localPosition=destPosition;
		destTransform.localRotation=destRotation;
		destTransform.localScale=destScale;
		destAnimator._avatarNodeMap={};
		this._initCloneToAnimator(destRoot,destAnimator);
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destAvatar=destObject;
		var destRoot=this._rootNode.clone();
		destAvatar._rootNode=destRoot;
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
	*@private [NATIVE]
	*/
	__proto._cloneDatasToAnimatorNative=function(destAnimator){
		var animationNodeLocalPositions=new Float32Array(this._nativeNodeCount *3);
		var animationNodeLocalRotations=new Float32Array(this._nativeNodeCount *4);
		var animationNodeLocalScales=new Float32Array(this._nativeNodeCount *3);
		var animationNodeWorldMatrixs=new Float32Array(this._nativeNodeCount *16);
		var animationNodeParentIndices=new Int16Array(this._nativeNodeCount);
		destAnimator._animationNodeLocalPositions=animationNodeLocalPositions;
		destAnimator._animationNodeLocalRotations=animationNodeLocalRotations;
		destAnimator._animationNodeLocalScales=animationNodeLocalScales;
		destAnimator._animationNodeWorldMatrixs=animationNodeWorldMatrixs;
		destAnimator._animationNodeParentIndices=animationNodeParentIndices;
		this._nativeCurCloneCount=0;
		var destRoot=this._rootNode._cloneNative(animationNodeLocalPositions,animationNodeLocalRotations,animationNodeLocalScales,animationNodeWorldMatrixs,animationNodeParentIndices,-1,this);
		var transform=this._rootNode.transform;
		var destTransform=destRoot.transform;
		var destPosition=destTransform.localPosition;
		var destRotation=destTransform.localRotation;
		var destScale=destTransform.localScale;
		transform.localPosition.cloneTo(destPosition);
		transform.localRotation.cloneTo(destRotation);
		transform.localScale.cloneTo(destScale);
		destTransform.localPosition=destPosition;
		destTransform.localRotation=destRotation;
		destTransform.localScale=destScale;
		destAnimator._avatarNodeMap={};
		this._initCloneToAnimator(destRoot,destAnimator);
	}

	Avatar._parse=function(data,propertyParams,constructParams){
		var avatar=new Avatar();
		avatar._rootNode=new AnimationNode(new Float32Array(3),new Float32Array(4),new Float32Array(3),new Float32Array(16));
		if (Render.isConchApp)
			avatar._nativeNodeCount++;
		if (data.version){
			var rootNode=data.rootNode;
			(rootNode)&& (avatar._parseNode(rootNode,avatar._rootNode));
		}
		return avatar;
	}

	Avatar.load=function(url,complete){
		Laya.loader.create(url,complete,null,/*Laya3D.AVATAR*/"AVATAR");
	}

	return Avatar;
})(Resource)


/**
*@private

*/
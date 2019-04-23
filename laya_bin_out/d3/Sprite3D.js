/**
*<code>Sprite3D</code> 类用于实现3D精灵。
*/
//class laya.d3.core.Sprite3D extends laya.display.Node
var Sprite3D=(function(_super){
	function Sprite3D(name,isStatic){
		/**@private */
		//this._id=0;
		/**@private */
		//this._url=null;
		/**@private */
		//this._isStatic=false;
		/**@private */
		//this._layer=0;
		/**@private */
		//this._scripts=null;
		/**@private */
		//this._transform=null;
		/**@private */
		//this._hierarchyAnimator=null;
		/**@private */
		this._needProcessCollisions=false;
		/**@private */
		this._needProcessTriggers=false;
		Sprite3D.__super.call(this);
		(isStatic===void 0)&& (isStatic=false);
		this._id=++Sprite3D._uniqueIDCounter;
		this._transform=new Transform3D(this);
		this._isStatic=isStatic;
		this.layer=0;
		this.name=name ? name :"New Sprite3D";
	}

	__class(Sprite3D,'laya.d3.core.Sprite3D',_super);
	var __proto=Sprite3D.prototype;
	Laya.imps(__proto,{"laya.resource.ICreateResource":true,"laya.d3.core.IClone":true})
	/**
	*@private
	*/
	__proto._setCreateURL=function(url){
		this._url=url;
	}

	/**
	*@private
	*/
	__proto._changeAnimatorsToLinkSprite3D=function(sprite3D,isLink,path){
		var animator=this.getComponent(Animator);
		if (animator){
			if (!animator.avatar)
				sprite3D._changeAnimatorToLinkSprite3DNoAvatar(animator,isLink,path);
		}
		if (this._parent && (this._parent instanceof laya.d3.core.Sprite3D )){
			path.unshift(this._parent.name);
			var p=this._parent;
			(p._hierarchyAnimator)&& (p._changeAnimatorsToLinkSprite3D(sprite3D,isLink,path));
		}
	}

	/**
	*@private
	*/
	__proto._setHierarchyAnimator=function(animator,parentAnimator){
		this._changeHierarchyAnimator(animator);
		this._changeAnimatorAvatar(animator.avatar);
		for (var i=0,n=this._children.length;i < n;i++){
			var child=this._children[i];
			(child._hierarchyAnimator==parentAnimator)&& (child._setHierarchyAnimator(animator,parentAnimator));
		}
	}

	/**
	*@private
	*/
	__proto._clearHierarchyAnimator=function(animator,parentAnimator){
		this._changeHierarchyAnimator(parentAnimator);
		this._changeAnimatorAvatar(parentAnimator ? parentAnimator.avatar :null);
		for (var i=0,n=this._children.length;i < n;i++){
			var child=this._children[i];
			(child._hierarchyAnimator==animator)&& (child._clearHierarchyAnimator(animator,parentAnimator));
		}
	}

	/**
	*@private
	*/
	__proto._changeHierarchyAnimatorAvatar=function(animator,avatar){
		this._changeAnimatorAvatar(avatar);
		for (var i=0,n=this._children.length;i < n;i++){
			var child=this._children[i];
			(child._hierarchyAnimator==animator)&& (child._changeHierarchyAnimatorAvatar(animator,avatar));
		}
	}

	/**
	*@private
	*/
	__proto._changeAnimatorToLinkSprite3DNoAvatar=function(animator,isLink,path){
		animator._handleSpriteOwnersBySprite(isLink,path,this);
		for (var i=0,n=this._children.length;i < n;i++){
			var child=this._children[i];
			var index=path.length;
			path.push(child.name);
			child._changeAnimatorToLinkSprite3DNoAvatar(animator,isLink,path);
			path.splice(index,1);
		}
	}

	/**
	*@private
	*/
	__proto._changeHierarchyAnimator=function(animator){
		this._hierarchyAnimator=animator;
	}

	/**
	*@private
	*/
	__proto._changeAnimatorAvatar=function(avatar){}
	/**
	*@inheritDoc
	*/
	__proto._onAdded=function(){
		if ((this._parent instanceof laya.d3.core.Sprite3D )){
			var parent3D=this._parent;
			this.transform._setParent(parent3D.transform);
			if (parent3D._hierarchyAnimator){
				(!this._hierarchyAnimator)&& (this._setHierarchyAnimator(parent3D._hierarchyAnimator,null));
				parent3D._changeAnimatorsToLinkSprite3D(this,true,/*new vector.<>*/[this.name]);
			}
		}
		_super.prototype._onAdded.call(this);
	}

	/**
	*@inheritDoc
	*/
	__proto._onRemoved=function(){
		_super.prototype._onRemoved.call(this);
		if ((this._parent instanceof laya.d3.core.Sprite3D )){
			var parent3D=this._parent;
			this.transform._setParent(null);
			if (parent3D._hierarchyAnimator){
				(this._hierarchyAnimator==parent3D._hierarchyAnimator)&& (this._clearHierarchyAnimator(parent3D._hierarchyAnimator,null));
				parent3D._changeAnimatorsToLinkSprite3D(this,false,/*new vector.<>*/[this.name]);
			}
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._parse=function(data){
		(data.isStatic!==undefined)&& (this._isStatic=data.isStatic);
		(data.active!==undefined)&& (this.active=data.active);
		(data.name !=undefined)&& (this.name=data.name);
		if (data.position!==undefined){
			var loccalPosition=this.transform.localPosition;
			loccalPosition.fromArray(data.position);
			this.transform.localPosition=loccalPosition;
		}
		if (data.rotationEuler!==undefined){
			var localRotationEuler=this.transform.localRotationEuler;
			localRotationEuler.fromArray(data.rotationEuler);
			this.transform.localRotationEuler=localRotationEuler;
		}
		if (data.rotation!==undefined){
			var localRotation=this.transform.localRotation;
			localRotation.fromArray(data.rotation);
			this.transform.localRotation=localRotation;
		}
		if (data.scale!==undefined){
			var localScale=this.transform.localScale;
			localScale.fromArray(data.scale);
			this.transform.localScale=localScale;
		}
		(data.layer !=undefined)&& (this.layer=data.layer);
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		if (this.destroyed)
			throw new Error("Sprite3D: Can't be cloned if the Sprite3D has destroyed.");
		var destSprite3D=destObject;
		for (var i=0,n=this._children.length;i < n;i++)
		destSprite3D.addChild(this._children[i].clone());
		destSprite3D.name=this.name;
		destSprite3D.destroyed=this.destroyed;
		destSprite3D.active=this.active;
		var destLocalPosition=destSprite3D.transform.localPosition;
		this.transform.localPosition.cloneTo(destLocalPosition);
		destSprite3D.transform.localPosition=destLocalPosition;
		var destLocalRotation=destSprite3D.transform.localRotation;
		this.transform.localRotation.cloneTo(destLocalRotation);
		destSprite3D.transform.localRotation=destLocalRotation;
		var destLocalScale=destSprite3D.transform.localScale;
		this.transform.localScale.cloneTo(destLocalScale);
		destSprite3D.transform.localScale=destLocalScale;
		destSprite3D._isStatic=this._isStatic;
		destSprite3D.layer=this.layer;
		this._cloneTo(destSprite3D);
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destSprite3D=/*__JS__ */new this.constructor();
		this.cloneTo(destSprite3D);
		return destSprite3D;
	}

	/**
	*@inheritDoc
	*/
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		if (this.destroyed)
			return;
		_super.prototype.destroy.call(this,destroyChild);
		this._transform=null;
		this._scripts=null;
		this._url && Loader.clearRes(this._url);
	}

	/**
	*获取唯一标识ID。
	*@return 唯一标识ID。
	*/
	__getset(0,__proto,'id',function(){
		return this._id;
	});

	/**
	*获取资源的URL地址。
	*@return URL地址。
	*/
	__getset(0,__proto,'url',function(){
		return this._url;
	});

	/**
	*设置蒙版。
	*@param value 蒙版。
	*/
	/**
	*获取蒙版。
	*@return 蒙版。
	*/
	__getset(0,__proto,'layer',function(){
		return this._layer;
		},function(value){
		if (this._layer!==value){
			if (value >=0 && value <=30){
				this._layer=value;
				}else {
				throw new Error("Layer value must be 0-30.");
			}
		}
	});

	/**
	*获取精灵变换。
	*@return 精灵变换。
	*/
	__getset(0,__proto,'transform',function(){
		return this._transform;
	});

	/**
	*获取是否为静态。
	*@return 是否为静态。
	*/
	__getset(0,__proto,'isStatic',function(){
		return this._isStatic;
	});

	Sprite3D._parse=function(data,propertyParams,constructParams){
		var json=data.data;
		var outBatchSprits=[];
		var sprite=Utils3D._createNodeByJson(json,outBatchSprits);
		StaticBatchManager.combine(sprite,outBatchSprits);
		return sprite;
	}

	Sprite3D.__init__=function(){}
	Sprite3D.instantiate=function(original,parent,worldPositionStays,position,rotation){
		(worldPositionStays===void 0)&& (worldPositionStays=true);
		var destSprite3D=original.clone();
		(parent)&& (parent.addChild(destSprite3D));
		var transform=destSprite3D.transform;
		if (worldPositionStays){
			var worldMatrix=transform.worldMatrix;
			original.transform.worldMatrix.cloneTo(worldMatrix);
			transform.worldMatrix=worldMatrix;
			}else {
			(position)&& (transform.position=position);
			(rotation)&& (transform.rotation=rotation);
		}
		return destSprite3D;
	}

	Sprite3D.load=function(url,complete){
		Laya.loader.create(url,complete,null,/*Laya3D.HIERARCHY*/"HIERARCHY");
	}

	Sprite3D._uniqueIDCounter=0;
	__static(Sprite3D,
	['WORLDMATRIX',function(){return this.WORLDMATRIX=Shader3D.propertyNameToID("u_WorldMat");},'MVPMATRIX',function(){return this.MVPMATRIX=Shader3D.propertyNameToID("u_MvpMatrix");}
	]);
	return Sprite3D;
})(Node)


/**

*/
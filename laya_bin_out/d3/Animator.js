/**
*<code>Animator</code> 类用于创建动画组件。
*/
//class laya.d3.component.Animator extends laya.components.Component
var Animator=(function(_super){
	function Animator(){
		/**@private */
		//this._speed=NaN;
		/**@private */
		//this._avatar=null;
		/**@private */
		//this._keyframeNodeOwnerMap=null;
		/**@private */
		//this._updateMark=0;
		/**@private */
		//this._controllerLayers=null;
		/**@private */
		//this._linkSprites=null;
		/**@private */
		//this._avatarNodeMap=null;
		/**@private */
		this._linkAvatarSpritesData={};
		/**@private [NATIVE]*/
		//this._animationNodeLocalPositions=null;
		/**@private [NATIVE]*/
		//this._animationNodeLocalRotations=null;
		/**@private [NATIVE]*/
		//this._animationNodeLocalScales=null;
		/**@private [NATIVE]*/
		//this._animationNodeWorldMatrixs=null;
		/**@private [NATIVE]*/
		//this._animationNodeParentIndices=null;
		this._keyframeNodeOwners=[];
		this._linkAvatarSprites=[];
		this._renderableSprites=[];
		this.cullingMode=2;
		Animator.__super.call(this);
		this._controllerLayers=[];
		this._linkSprites={};
		this._speed=1.0;
		this._keyframeNodeOwnerMap={};
		this._updateMark=0;
	}

	__class(Animator,'laya.d3.component.Animator',_super);
	var __proto=Animator.prototype;
	/**
	*@private
	*/
	__proto._linkToSprites=function(linkSprites){
		for (var k in linkSprites){
			var nodeOwner=this.owner;
			var path=linkSprites[k];
			for (var j=0,m=path.length;j < m;j++){
				var p=path[j];
				if (p===""){
					break ;
					}else {
					nodeOwner=nodeOwner.getChildByName(p);
					if (!nodeOwner)
						break ;
				}
			}
			(nodeOwner)&& (this.linkSprite3DToAvatarNode(k,nodeOwner));
		}
	}

	/**
	*@private
	*/
	__proto._addKeyframeNodeOwner=function(clipOwners,node,propertyOwner){
		var nodeIndex=node._indexInList;
		var fullPath=node.fullPath;
		var keyframeNodeOwner=this._keyframeNodeOwnerMap[fullPath];
		if (keyframeNodeOwner){
			keyframeNodeOwner.referenceCount++;
			clipOwners[nodeIndex]=keyframeNodeOwner;
			}else {
			var property=propertyOwner;
			for (var i=0,n=node.propertyCount;i < n;i++){
				property=property[node.getPropertyByIndex(i)];
				if (!property)
					break ;
			}
			keyframeNodeOwner=this._keyframeNodeOwnerMap[fullPath]=new KeyframeNodeOwner();
			keyframeNodeOwner.fullPath=fullPath;
			keyframeNodeOwner.indexInList=this._keyframeNodeOwners.length;
			keyframeNodeOwner.referenceCount=1;
			keyframeNodeOwner.propertyOwner=propertyOwner;
			var propertyCount=node.propertyCount;
			var propertys=__newvec(propertyCount);
			for (i=0;i < propertyCount;i++)
			propertys[i]=node.getPropertyByIndex(i);
			keyframeNodeOwner.property=propertys;
			keyframeNodeOwner.type=node.type;
			if (property){
				if (node.type===0)
					keyframeNodeOwner.defaultValue=property;
				else
				keyframeNodeOwner.defaultValue=property.elements.slice();
			}
			this._keyframeNodeOwners.push(keyframeNodeOwner);
			clipOwners[nodeIndex]=keyframeNodeOwner;
		}
	}

	/**
	*@private
	*/
	__proto._removeKeyframeNodeOwner=function(nodeOwners,node){
		var fullPath=node.fullPath;
		var keyframeNodeOwner=this._keyframeNodeOwnerMap[fullPath];
		if (keyframeNodeOwner){
			keyframeNodeOwner.referenceCount--;
			if (keyframeNodeOwner.referenceCount===0){
				delete this._keyframeNodeOwnerMap[fullPath];
				this._keyframeNodeOwners.splice(this._keyframeNodeOwners.indexOf(keyframeNodeOwner),1);
			}
			nodeOwners[node._indexInList]=null;
		}
	}

	/**
	*@private
	*/
	__proto._getOwnersByClip=function(clipStateInfo){
		var frameNodes=clipStateInfo._clip._nodes;
		var frameNodesCount=frameNodes.count;
		var nodeOwners=clipStateInfo._nodeOwners;
		nodeOwners.length=frameNodesCount;
		for (var i=0;i < frameNodesCount;i++){
			var node=frameNodes.getNodeByIndex(i);
			var property=this._avatar ? this._avatarNodeMap[this._avatar._rootNode.name] :this.owner;
			for (var j=0,m=node.ownerPathCount;j < m;j++){
				var ownPat=node.getOwnerPathByIndex(j);
				if (ownPat===""){
					break ;
					}else {
					property=property.getChildByName(ownPat);
					if (!property)
						break ;
				}
			}
			if (property){
				var propertyOwner=node.propertyOwner;
				(propertyOwner)&& (property=property[propertyOwner]);
				property && this._addKeyframeNodeOwner(nodeOwners,node,property);
			}
		}
	}

	/**
	*@private
	*/
	__proto._getOwnersByClipAsync=function(clipStateInfo){
		var clip=clipStateInfo._clip;
		this._getOwnersByClip(clipStateInfo);
	}

	/**
	*@private
	*/
	__proto._getAvatarOwnersAndInitDatasAsync=function(){
		for (var i=0,n=this._controllerLayers.length;i < n;i++){
			var clipStateInfos=this._controllerLayers[i]._states;
			for (var j=0,m=clipStateInfos.length;j < m;j++)
			this._getOwnersByClipAsync(clipStateInfos[j]);
		}
		this._avatar._cloneDatasToAnimator(this);
		for (var k in this._linkAvatarSpritesData){
			var sprites=this._linkAvatarSpritesData[k];
			if (sprites){
				for (var c=0,p=sprites.length;c < p;c++)
				this._isLinkSpriteToAnimationNode(sprites[c],k,true);
			}
		}
	}

	/**
	*@private
	*/
	__proto._eventScript=function(scripts,clipState,playState,from,to){
		var events=clipState._clip._events;
		var eventIndex=playState._playEventIndex;
		for (var n=events.length;eventIndex < n;eventIndex++){
			var eve=events[eventIndex];
			var eventTime=eve.time;
			if (from <=eventTime && eventTime < to){
				for (var j=0,m=scripts.length;j < m;j++){
					var script=scripts[j];
					var fun=script[eve.eventName];
					(fun)&& (fun.apply(script,eve.params));
				}
				}else {
				break ;
			}
		}
		playState._playEventIndex=eventIndex;
	}

	/**
	*@private
	*/
	__proto._updatePlayer=function(animatorState,playState,elapsedTime,islooping){
		var clipDuration=animatorState._clip._duration *(animatorState.clipEnd-animatorState.clipStart);
		var lastElapsedTime=playState._elapsedTime;
		var elapsedPlaybackTime=lastElapsedTime+elapsedTime;
		playState._lastElapsedTime=lastElapsedTime;
		playState._elapsedTime=elapsedPlaybackTime;
		var normalizedTime=elapsedPlaybackTime / clipDuration;
		playState._normalizedTime=normalizedTime;
		var playTime=normalizedTime % 1.0;
		playState._normalizedPlayTime=playTime < 0?playTime+1.0:playTime;
		playState._duration=clipDuration;
		var scripts=animatorState._scripts;
		if ((!islooping && elapsedPlaybackTime >=clipDuration)){
			playState._finish=true;
			playState._elapsedTime=clipDuration;
			playState._normalizedPlayTime=1.0;
			if (scripts){
				for (var i=0,n=scripts.length;i < n;i++)
				scripts[i].onStateExit();
			}
			return;
		}
		if (clipDuration > 0){
			if (elapsedPlaybackTime >=clipDuration){
				do {
					elapsedPlaybackTime-=clipDuration;
					playState._playEventIndex=0;
				}while (elapsedPlaybackTime >=clipDuration)
			}
			}else {
			playState._resetPlayState(0.0);
		}
		if (scripts){
			for (i=0,n=scripts.length;i < n;i++)
			scripts[i].onStateUpdate();
		}
	}

	/**
	*@private
	*/
	__proto._updateEventScript=function(stateInfo,playStateInfo,islooping){
		var scripts=(this.owner)._scripts;
		if (scripts){
			var clipDuration=stateInfo._clip._duration;
			var lastElapsedTime=playStateInfo._lastElapsedTime;
			var elapsedTime=playStateInfo._elapsedTime;
			var lastLoop=Math.floor(lastElapsedTime / clipDuration);
			var loop=Math.floor(elapsedTime / clipDuration);
			var lastTime=lastElapsedTime % clipDuration;
			var time=elapsedTime % clipDuration;
			var loopCount=loop-lastLoop;
			if (islooping){
				if (loopCount > 0){
					this._eventScript(scripts,stateInfo,playStateInfo,lastTime,clipDuration);
					for (var i=0,n=loopCount-1;i < n;i++)
					this._eventScript(scripts,stateInfo,playStateInfo,0,clipDuration);
					this._eventScript(scripts,stateInfo,playStateInfo,0,time);
					}else {
					this._eventScript(scripts,stateInfo,playStateInfo,lastTime,time);
				}
				}else {
				if (loopCount > 0)
					this._eventScript(scripts,stateInfo,playStateInfo,lastTime,clipDuration);
				else
				this._eventScript(scripts,stateInfo,playStateInfo,lastTime,time);
			}
		}
	}

	/**
	*@private
	*/
	__proto._updateClipDatas=function(animatorState,addtive,playStateInfo,scale){
		var clip=animatorState._clip;
		var clipDuration=clip._duration;
		var curPlayTime=animatorState.clipStart *clipDuration+playStateInfo._normalizedPlayTime *playStateInfo._duration;
		var currentFrameIndices=animatorState._currentFrameIndices;
		var frontPlay=playStateInfo._elapsedTime > playStateInfo._lastElapsedTime;
		clip._evaluateClipDatasRealTime(clip._nodes,curPlayTime,currentFrameIndices,addtive,frontPlay);
	}

	/**
	*@private
	*/
	__proto._applyFloat=function(pro,proName,nodeOwner,additive,weight,isFirstLayer,data){
		if (nodeOwner.updateMark===this._updateMark){
			if (additive){
				pro[proName]+=weight *(data);
				}else {
				var oriValue=pro[proName];
				pro[proName]=oriValue+weight *(data-oriValue);
			}
			}else {
			if (isFirstLayer){
				if (additive)
					pro[proName]=nodeOwner.defaultValue+data;
				else
				pro[proName]=data;
				}else {
				if (additive){
					pro[proName]=nodeOwner.defaultValue+weight *(data);
					}else {
					var defValue=nodeOwner.defaultValue;
					pro[proName]=defValue+weight *(data-defValue);
				}
			}
		}
	}

	/**
	*@private
	*/
	__proto._applyPositionAndRotationEuler=function(nodeOwner,additive,weight,isFirstLayer,data,out){
		if (nodeOwner.updateMark===this._updateMark){
			if (additive){
				out[0]+=weight *data[0];
				out[1]+=weight *data[1];
				out[2]+=weight *data[2];
				}else {
				var oriX=out[0];
				var oriY=out[1];
				var oriZ=out[2];
				out[0]=oriX+weight *(data[0]-oriX);
				out[1]=oriY+weight *(data[1]-oriY);
				out[2]=oriZ+weight *(data[2]-oriZ);
			}
			}else {
			if (isFirstLayer){
				if (additive){
					var defValue=nodeOwner.defaultValue;
					out[0]=defValue[0]+data[0];
					out[1]=defValue[1]+data[1];
					out[2]=defValue[2]+data[2];
					}else {
					out[0]=data[0];
					out[1]=data[1];
					out[2]=data[2];
				}
				}else {
				defValue=nodeOwner.defaultValue;
				if (additive){
					out[0]=defValue[0]+weight *data[0];
					out[1]=defValue[1]+weight *data[1];
					out[2]=defValue[2]+weight *data[2];
					}else {
					var defX=defValue[0];
					var defY=defValue[1];
					var defZ=defValue[2];
					out[0]=defX+weight *(data[0]-defX);
					out[1]=defY+weight *(data[1]-defY);
					out[2]=defZ+weight *(data[2]-defZ);
				}
			}
		}
	}

	/**
	*@private
	*/
	__proto._applyRotation=function(nodeOwner,additive,weight,isFirstLayer,clipRot,localRotationE){
		if (nodeOwner.updateMark===this._updateMark){
			if (additive){
				var tempQuat=Animator._tempQuaternionArray1;
				Utils3D.quaternionWeight(clipRot,weight,tempQuat);
				Utils3D.quaterionNormalize(tempQuat,tempQuat);
				Utils3D.quaternionMultiply(localRotationE,tempQuat,localRotationE);
				}else {
				Quaternion._lerpArray(localRotationE,clipRot,weight,localRotationE);
			}
			}else {
			if (isFirstLayer){
				if (additive){
					var defaultRot=nodeOwner.defaultValue;
					Utils3D.quaternionMultiply(defaultRot,clipRot,localRotationE);
					}else {
					localRotationE[0]=clipRot[0];
					localRotationE[1]=clipRot[1];
					localRotationE[2]=clipRot[2];
					localRotationE[3]=clipRot[3];
				}
				}else {
				defaultRot=nodeOwner.defaultValue;
				if (additive){
					tempQuat=Animator._tempQuaternionArray1;
					Utils3D.quaternionWeight(clipRot,weight,tempQuat);
					Utils3D.quaterionNormalize(tempQuat,tempQuat);
					Utils3D.quaternionMultiply(defaultRot,tempQuat,localRotationE);
					}else {
					Quaternion._lerpArray(defaultRot,clipRot,weight,localRotationE);
				}
			}
		}
	}

	/**
	*@private
	*/
	__proto._applyScale=function(nodeOwner,additive,weight,isFirstLayer,clipSca,localScaleE){
		if (nodeOwner.updateMark===this._updateMark){
			if (additive){
				var scale=Animator._tempVector3Array1;
				Utils3D.scaleWeight(clipSca,weight,scale);
				localScaleE[0]=localScaleE[0] *scale[0];
				localScaleE[1]=localScaleE[1] *scale[1];
				localScaleE[2]=localScaleE[2] *scale[2];
				}else {
				Utils3D.scaleBlend(localScaleE,clipSca,weight,localScaleE);
			}
			}else {
			if (isFirstLayer){
				if (additive){
					var defaultSca=nodeOwner.defaultValue;
					localScaleE[0]=defaultSca[0] *clipSca[0];
					localScaleE[1]=defaultSca[1] *clipSca[1];
					localScaleE[2]=defaultSca[2] *clipSca[2];
					}else {
					localScaleE[0]=clipSca[0];
					localScaleE[1]=clipSca[1];
					localScaleE[2]=clipSca[2];
				}
				}else {
				defaultSca=nodeOwner.defaultValue;
				if (additive){
					scale=Animator._tempVector3Array1;
					Utils3D.scaleWeight(clipSca,weight,scale);
					localScaleE[0]=defaultSca[0] *scale[0];
					localScaleE[1]=defaultSca[1] *scale[1];
					localScaleE[2]=defaultSca[2] *scale[2];
					}else {
					Utils3D.scaleBlend(defaultSca,clipSca,weight,localScaleE);
				}
			}
		}
	}

	/**
	*@private
	*/
	__proto._applyCrossData=function(nodeOwner,additive,weight,isFirstLayer,srcValue,desValue,crossWeight){
		var pro=nodeOwner.propertyOwner;
		if (pro){
			switch (nodeOwner.type){
				case 0:;
					var proPat=nodeOwner.property;
					var m=proPat.length-1;
					for (var j=0;j < m;j++){
						pro=pro[proPat[j]];
						if (!pro)
							break ;
					};
					var crossValue=srcValue+crossWeight *(desValue-srcValue);
					this._applyFloat(pro,proPat[m],nodeOwner,additive,weight,isFirstLayer,crossValue);
					break ;
				case 1:;
					var localPos=pro.localPosition;
					var position=Animator._tempVector3Array0;
					var srcX=srcValue[0],srcY=srcValue[1],srcZ=srcValue[2];
					position[0]=srcX+crossWeight *(desValue[0]-srcX);
					position[1]=srcY+crossWeight *(desValue[1]-srcY);
					position[2]=srcZ+crossWeight *(desValue[2]-srcZ);
					this._applyPositionAndRotationEuler(nodeOwner,additive,weight,isFirstLayer,position,localPos.elements);
					pro.localPosition=localPos;
					break ;
				case 2:;
					var localRot=pro.localRotation;
					var rotation=Animator._tempQuaternionArray0;
					Quaternion._lerpArray(srcValue,desValue,crossWeight,rotation);
					this._applyRotation(nodeOwner,additive,weight,isFirstLayer,rotation,localRot.elements);
					pro.localRotation=localRot;
					break ;
				case 3:;
					var localSca=pro.localScale;
					var scale=Animator._tempVector3Array0;
					Utils3D.scaleBlend(srcValue,desValue,crossWeight,scale);
					this._applyScale(nodeOwner,additive,weight,isFirstLayer,scale,localSca.elements);
					pro.localScale=localSca;
					break ;
				case 4:;
					var localEuler=pro.localRotationEuler;
					var rotationEuler=Animator._tempVector3Array0;
					srcX=srcValue[0],srcY=srcValue[1],srcZ=srcValue[2];
					rotationEuler[0]=srcX+crossWeight *(desValue[0]-srcX);
					rotationEuler[1]=srcY+crossWeight *(desValue[1]-srcY);
					rotationEuler[2]=srcZ+crossWeight *(desValue[2]-srcZ);
					this._applyPositionAndRotationEuler(nodeOwner,additive,weight,isFirstLayer,rotationEuler,localEuler.elements);
					pro.localRotationEuler=localEuler;
					break ;
				}
			nodeOwner.updateMark=this._updateMark;
		}
	}

	/**
	*@private
	*/
	__proto._setClipDatasToNode=function(stateInfo,additive,weight,isFirstLayer){
		var nodes=stateInfo._clip._nodes;
		var nodeOwners=stateInfo._nodeOwners;
		for (var i=0,n=nodes.count;i < n;i++){
			var nodeOwner=nodeOwners[i];
			if (nodeOwner){
				var pro=nodeOwner.propertyOwner;
				if (pro){
					switch (nodeOwner.type){
						case 0:;
							var proPat=nodeOwner.property;
							var m=proPat.length-1;
							for (var j=0;j < m;j++){
								pro=pro[proPat[j]];
								if (!pro)
									break ;
							}
							this._applyFloat(pro,proPat[m],nodeOwner,additive,weight,isFirstLayer,nodes.getNodeByIndex(i).data);
							break ;
						case 1:;
							var localPos=pro.localPosition;
							this._applyPositionAndRotationEuler(nodeOwner,additive,weight,isFirstLayer,nodes.getNodeByIndex(i).data,localPos.elements);
							pro.localPosition=localPos;
							break ;
						case 2:;
							var localRot=pro.localRotation;
							this._applyRotation(nodeOwner,additive,weight,isFirstLayer,nodes.getNodeByIndex(i).data,localRot.elements);
							pro.localRotation=localRot;
							break ;
						case 3:;
							var localSca=pro.localScale;
							this._applyScale(nodeOwner,additive,weight,isFirstLayer,nodes.getNodeByIndex(i).data,localSca.elements);
							pro.localScale=localSca;
							break ;
						case 4:;
							var localEuler=pro.localRotationEuler;
							this._applyPositionAndRotationEuler(nodeOwner,additive,weight,isFirstLayer,nodes.getNodeByIndex(i).data,localEuler.elements);
							pro.localRotationEuler=localEuler;
							break ;
						}
					nodeOwner.updateMark=this._updateMark;
				}
			}
		}
	}

	/**
	*@private
	*/
	__proto._setCrossClipDatasToNode=function(controllerLayer,srcState,destState,crossWeight,isFirstLayer){
		var nodeOwners=controllerLayer._crossNodesOwners;
		var ownerCount=controllerLayer._crossNodesOwnersCount;
		var additive=controllerLayer.blendingMode!==AnimatorControllerLayer.BLENDINGMODE_OVERRIDE;
		var weight=controllerLayer.defaultWeight;
		var destDataIndices=controllerLayer._destCrossClipNodeIndices;
		var destNodes=destState._clip._nodes;
		var destNodeOwners=destState._nodeOwners;
		var srcDataIndices=controllerLayer._srcCrossClipNodeIndices;
		var srcNodeOwners=srcState._nodeOwners;
		var srcNodes=srcState._clip._nodes;
		for (var i=0;i < ownerCount;i++){
			var nodeOwner=nodeOwners[i];
			if (nodeOwner){
				var srcIndex=srcDataIndices[i];
				var destIndex=destDataIndices[i];
				var srcValue=srcIndex!==-1 ? srcNodes.getNodeByIndex(srcIndex).data :destNodeOwners[destIndex].defaultValue;
				var desValue=destIndex!==-1 ? destNodes.getNodeByIndex(destIndex).data :srcNodeOwners[srcIndex].defaultValue;
				this._applyCrossData(nodeOwner,additive,weight,isFirstLayer,srcValue,desValue,crossWeight);
			}
		}
	}

	/**
	*@private
	*/
	__proto._setFixedCrossClipDatasToNode=function(controllerLayer,destState,crossWeight,isFirstLayer){
		var nodeOwners=controllerLayer._crossNodesOwners;
		var ownerCount=controllerLayer._crossNodesOwnersCount;
		var additive=controllerLayer.blendingMode!==AnimatorControllerLayer.BLENDINGMODE_OVERRIDE;
		var weight=controllerLayer.defaultWeight;
		var destDataIndices=controllerLayer._destCrossClipNodeIndices;
		var destNodes=destState._clip._nodes;
		for (var i=0;i < ownerCount;i++){
			var nodeOwner=nodeOwners[i];
			if (nodeOwner){
				var destIndex=destDataIndices[i];
				var srcValue=nodeOwner.crossFixedValue;
				var desValue=destIndex!==-1 ? destNodes.getNodeByIndex(destIndex).data :nodeOwner.defaultValue;
				this._applyCrossData(nodeOwner,additive,weight,isFirstLayer,srcValue,desValue,crossWeight);
			}
		}
	}

	/**
	*@private
	*/
	__proto._revertDefaultKeyframeNodes=function(clipStateInfo){
		var nodeOwners=clipStateInfo._nodeOwners;
		for (var i=0,n=nodeOwners.length;i < n;i++){
			var nodeOwner=nodeOwners[i];
			if (nodeOwner){
				var pro=nodeOwner.propertyOwner;
				if (pro){
					switch (nodeOwner.type){
						case 0:;
							var proPat=nodeOwner.property;
							var m=proPat.length-1;
							for (var j=0;j < m;j++){
								pro=pro[proPat[j]];
								if (!pro)
									break ;
							}
						pro[proPat[m]]=nodeOwner.defaultValue;
							break ;
						case 1:;
							var locPos=pro.localPosition;
							var locPosE=locPos.elements;
						var def=nodeOwner.defaultValue;
							locPosE[0]=def[0];
							locPosE[1]=def[1];
							locPosE[2]=def[2];
							pro.localPosition=locPos;
							break ;
						case 2:;
							var locRot=pro.localRotation;
							var locRotE=locRot.elements;
						def=nodeOwner.defaultValue;
							locRotE[0]=def[0];
							locRotE[1]=def[1];
							locRotE[2]=def[2];
							locRotE[3]=def[3];
							pro.localRotation=locRot;
							break ;
						case 3:;
							var locSca=pro.localScale;
							var locScaE=locSca.elements;
						def=nodeOwner.defaultValue;
							locScaE[0]=def[0];
							locScaE[1]=def[1];
							locScaE[2]=def[2];
							pro.localScale=locSca;
							break ;
						case 4:;
							var locEul=pro.localRotationEuler;
							var locEulE=locEul.elements;
						def=nodeOwner.defaultValue;
							locEulE[0]=def[0];
							locEulE[1]=def[1];
							locEulE[2]=def[2];
							pro.localRotationEuler=locEul;
							break ;
						default :
							throw "Animator:unknown type.";
						}
				}
			}
		}
	}

	/**
	*@private
	*/
	__proto._removeClip=function(clipStateInfos,statesMap,index,state){
		var clip=state._clip;
		clip._removeReference();
		clipStateInfos.splice(index,1);
		delete statesMap[state.name];
		var clipStateInfo=clipStateInfos[index];
		var frameNodes=clip._nodes;
		var nodeOwners=clipStateInfo._nodeOwners;
		for (var i=0,n=frameNodes.count;i < n;i++)
		this._removeKeyframeNodeOwner(nodeOwners,frameNodes.getNodeByIndex(i));
	}

	/**
	*@private
	*/
	__proto._isLinkSpriteToAnimationNodeData=function(sprite,nodeName,isLink){
		var linkSprites=this._linkAvatarSpritesData[nodeName];
		if (isLink){
			linkSprites || (this._linkAvatarSpritesData[nodeName]=linkSprites=[]);
			linkSprites.push(sprite);
			}else {
			linkSprites.splice(sprite,1);
		}
	}

	/**
	*@private
	*/
	__proto._isLinkSpriteToAnimationNode=function(sprite,nodeName,isLink){
		if (this._avatar){
			var node=this._avatarNodeMap[nodeName];
			if (node){
				if (isLink){
					sprite._transform._dummy=node.transform;
					this._linkAvatarSprites.push(sprite);
					var nodeTransform=node.transform;
					var spriteTransform=sprite.transform;
					if (!spriteTransform.owner.isStatic && nodeTransform){
						var spriteWorldMatrix=spriteTransform.worldMatrix;
						var ownParTra=(this.owner)._transform._parent;
						if (ownParTra){
							Utils3D.matrix4x4MultiplyMFM(ownParTra.worldMatrix,nodeTransform.getWorldMatrix(),spriteWorldMatrix);
							}else {
							var sprWorE=spriteWorldMatrix.elements;
							var nodWorE=nodeTransform.getWorldMatrix();
							for (var i=0;i < 16;i++)
							sprWorE[i]=nodWorE[i];
						}
						spriteTransform.worldMatrix=spriteWorldMatrix;
					}
					}else {
					sprite._transform._dummy=null;
					this._linkAvatarSprites.splice(this._linkAvatarSprites.indexOf(sprite),1);
				}
			}
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._onAdded=function(){
		var parent=this.owner._parent;
		(this.owner)._setHierarchyAnimator(this,parent ? (parent)._hierarchyAnimator :null);
		(this.owner)._changeAnimatorToLinkSprite3DNoAvatar(this,true,/*new vector.<>*/[]);
	}

	/**
	*@inheritDoc
	*/
	__proto._onDestroy=function(){
		var parent=this.owner._parent;
		(this.owner)._clearHierarchyAnimator(this,parent ? (parent)._hierarchyAnimator :null);
		(this.owner)._changeAnimatorToLinkSprite3DNoAvatar(this,false,/*new vector.<>*/[]);
	}

	/**
	*@inheritDoc
	*/
	__proto._onEnableInScene=function(){
		(this.owner._scene)._animatorPool.add(this);
	}

	/**
	*@inheritDoc
	*/
	__proto._onDisableInScene=function(){
		(this.owner._scene)._animatorPool.remove(this);
	}

	/**
	*@inheritDoc
	*/
	__proto._onEnable=function(){
		for (var i=0,n=this._controllerLayers.length;i < n;i++){
			if (this._controllerLayers[i].playOnWake){
				var defaultClip=this.getDefaultState(i);
				(defaultClip)&& (this.play(null,i,0));
			}
		}
	}

	/**
	*@private
	*/
	__proto._handleSpriteOwnersBySprite=function(isLink,path,sprite){
		for (var i=0,n=this._controllerLayers.length;i < n;i++){
			var clipStateInfos=this._controllerLayers[i]._states;
			for (var j=0,m=clipStateInfos.length;j < m;j++){
				var clipStateInfo=clipStateInfos[j];
				var clip=clipStateInfo._clip;
				var nodePath=path.join("/");
				var ownersNodes=clip._nodesMap[nodePath];
				if (ownersNodes){
					var nodeOwners=clipStateInfo._nodeOwners;
					for (var k=0,p=ownersNodes.length;k < p;k++){
						if (isLink)
							this._addKeyframeNodeOwner(nodeOwners,ownersNodes[k],sprite);
						else
						this._removeKeyframeNodeOwner(nodeOwners,ownersNodes[k]);
					}
				}
			}
		}
	}

	/**
	*@private
	*/
	__proto._updateAvatarNodesToSprite=function(){
		for (var i=0,n=this._linkAvatarSprites.length;i < n;i++){
			var sprite=this._linkAvatarSprites[i];
			var nodeTransform=sprite.transform._dummy;
			var spriteTransform=sprite.transform;
			if (!spriteTransform.owner.isStatic && nodeTransform){
				var spriteWorldMatrix=spriteTransform.worldMatrix;
				var ownParTra=(this.owner)._transform._parent;
				if (ownParTra){
					Utils3D.matrix4x4MultiplyMFM(ownParTra.worldMatrix,nodeTransform.getWorldMatrix(),spriteWorldMatrix);
					}else {
					var sprWorE=spriteWorldMatrix.elements;
					var nodWorE=nodeTransform.getWorldMatrix();
					for (var j=0;j < 16;j++)
					sprWorE[j]=nodWorE[j];
				}
				spriteTransform.worldMatrix=spriteWorldMatrix;
			}
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._parse=function(data){
		var avatarData=data.avatar;
		if (avatarData){
			this.avatar=Loader.getRes(avatarData.path);
			var linkSprites=avatarData.linkSprites;
			this._linkSprites=linkSprites;
			this._linkToSprites(linkSprites);
		};
		var clipPaths=data.clipPaths;
		var play=data.playOnWake;
		var layersData=data.layers;
		for (var i=0;i < layersData.length;i++){
			var layerData=layersData[i];
			var animatorLayer=new AnimatorControllerLayer(layerData.name);
			if (i===0)
				animatorLayer.defaultWeight=1.0;
			else
			animatorLayer.defaultWeight=layerData.weight;
			var blendingModeData=layerData.blendingMode;
			(blendingModeData)&& (animatorLayer.blendingMode=blendingModeData);
			this.addControllerLayer(animatorLayer);
			var states=layerData.states;
			for (var j=0,m=states.length;j < m;j++){
				var state=states[j];
				var clipPath=state.clipPath;
				if (clipPath){
					var name=state.name;
					var motion;
					motion=Loader.getRes(clipPath);
					if (motion){
						var animatorState=new AnimatorState();
						animatorState.name=name;
						animatorState.clip=motion;
						motion._addReference();
						this.addState(animatorState,i);
						(j===0)&& (this.setDefaultClip(name,i));
					}
				}
			}
			(play!==undefined)&& (animatorLayer.playOnWake=play);
		};
		var cullingModeData=data.cullingMode;
		(cullingModeData!==undefined)&& (this.cullingMode=cullingModeData);
	}

	/**
	*@private
	*/
	__proto._update=function(){
		if (this._speed===0)
			return;
		var needRender=false;
		if (this.cullingMode===2){
			needRender=false;
			for (var i=0,n=this._renderableSprites.length;i < n;i++){
				if (this._renderableSprites[i]._render._visible){
					needRender=true;
					break ;
				}
			}
			}else {
			needRender=true;
		}
		this._updateMark++;
		var timer=(this.owner._scene).timer;
		var delta=timer._delta / 1000.0;
		var timerScale=timer.scale;
		for (i=0,n=this._controllerLayers.length;i < n;i++){
			var controllerLayer=this._controllerLayers[i];
			var playStateInfo=controllerLayer._playStateInfo;
			var crossPlayStateInfo=controllerLayer._crossPlayStateInfo;
			addtive=controllerLayer.blendingMode!==AnimatorControllerLayer.BLENDINGMODE_OVERRIDE;
			switch (controllerLayer._playType){
				case 0:;
					var animatorState=controllerLayer._currentPlayState;
					var clip=animatorState._clip;
					var speed=this._speed *animatorState.speed;
					var finish=playStateInfo._finish;
					finish || this._updatePlayer(animatorState,playStateInfo,delta *speed,clip.islooping);
					if (needRender){
						var addtive=controllerLayer.blendingMode!==AnimatorControllerLayer.BLENDINGMODE_OVERRIDE;
						this._updateClipDatas(animatorState,addtive,playStateInfo,timerScale *speed);
					this._setClipDatasToNode(animatorState,addtive,controllerLayer.defaultWeight,i===0);
						finish || this._updateEventScript(animatorState,playStateInfo,clip.islooping);
					}
					break ;
				case 1:
					animatorState=controllerLayer._currentPlayState;
					clip=animatorState._clip;
					var crossClipState=controllerLayer._crossPlayState;
					var crossClip=crossClipState._clip;
					var crossDuratuion=controllerLayer._crossDuration;
					var startPlayTime=crossPlayStateInfo._startPlayTime;
					var crossClipDuration=crossClip._duration-startPlayTime;
					var crossScale=crossDuratuion > crossClipDuration ? crossClipDuration / crossDuratuion :1.0;
					var crossSpeed=this._speed *crossClipState.speed;
					this._updatePlayer(crossClipState,crossPlayStateInfo,delta *crossScale *crossSpeed,crossClip.islooping);
					var crossWeight=((crossPlayStateInfo._elapsedTime-startPlayTime)/ crossScale)/ crossDuratuion;
					if (crossWeight >=1.0){
						if (needRender){
							this._updateClipDatas(crossClipState,addtive,crossPlayStateInfo,timerScale *crossSpeed);
						this._setClipDatasToNode(crossClipState,addtive,controllerLayer.defaultWeight,i===0);
							controllerLayer._playType=0;
							controllerLayer._currentPlayState=crossClipState;
							crossPlayStateInfo._cloneTo(playStateInfo);
						}
						}else {
						if (!playStateInfo._finish){
							speed=this._speed *animatorState.speed;
							this._updatePlayer(animatorState,playStateInfo,delta *speed,clip.islooping);
							if (needRender){
								this._updateClipDatas(animatorState,addtive,playStateInfo,timerScale *speed);
							}
						}
						if (needRender){
							this._updateClipDatas(crossClipState,addtive,crossPlayStateInfo,timerScale *crossScale *crossSpeed);
							this._setCrossClipDatasToNode(controllerLayer,animatorState,crossClipState,crossWeight,i===0);
						}
					}
					if (needRender){
						this._updateEventScript(animatorState,playStateInfo,false);
						this._updateEventScript(crossClipState,crossPlayStateInfo,crossClip.islooping);
					}
					break ;
				case 2:
					crossClipState=controllerLayer._crossPlayState;
					crossClip=crossClipState._clip;
					crossDuratuion=controllerLayer._crossDuration;
					startPlayTime=crossPlayStateInfo._startPlayTime;
					crossClipDuration=crossClip._duration-startPlayTime;
					crossScale=crossDuratuion > crossClipDuration ? crossClipDuration / crossDuratuion :1.0;
					crossSpeed=this._speed *crossClipState.speed;
					this._updatePlayer(crossClipState,crossPlayStateInfo,delta *crossScale *crossSpeed,crossClip.islooping);
					if (needRender){
						crossWeight=((crossPlayStateInfo._elapsedTime-startPlayTime)/ crossScale)/ crossDuratuion;
						if (crossWeight >=1.0){
							this._updateClipDatas(crossClipState,addtive,crossPlayStateInfo,timerScale *crossSpeed);
							this._setClipDatasToNode(crossClipState,addtive,1.0,i===0);
							controllerLayer._playType=0;
							controllerLayer._currentPlayState=crossClipState;
							crossPlayStateInfo._cloneTo(playStateInfo);
							}else {
							this._updateClipDatas(crossClipState,addtive,crossPlayStateInfo,timerScale *crossScale *crossSpeed);
							this._setFixedCrossClipDatasToNode(controllerLayer,crossClipState,crossWeight,i===0);
						}
						this._updateEventScript(crossClipState,crossPlayStateInfo,crossClip.islooping);
					}
					break ;
				}
		}
		if (needRender){
			if (this._avatar){
				Render.isConchApp && this._updateAnimationNodeWorldMatix(this._animationNodeLocalPositions,this._animationNodeLocalRotations,this._animationNodeLocalScales,this._animationNodeWorldMatrixs,this._animationNodeParentIndices);
				this._updateAvatarNodesToSprite();
			}
		}
	}

	/**
	*@private
	*/
	__proto._cloneTo=function(dest){
		var animator=dest;
		animator.avatar=this.avatar;
		for (var i=0,n=this._controllerLayers.length;i < n;i++){
			var controllLayer=this._controllerLayers[i];
			animator.addControllerLayer(controllLayer.clone());
			var animatorStates=controllLayer._states;
			for (var j=0,m=animatorStates.length;j < m;j++){
				var state=animatorStates[j];
				animator.addState(state.clone(),i);
				(j==0)&& (animator.setDefaultClip(state.name,i));
			}
		}
		animator._linkSprites=this._linkSprites;
		animator._linkToSprites(this._linkSprites);
	}

	/**
	*获取默认动画状态。
	*@param layerIndex 层索引。
	*@return 默认动画状态。
	*/
	__proto.getDefaultState=function(layerIndex){
		(layerIndex===void 0)&& (layerIndex=0);
		var controllerLayer=this._controllerLayers[layerIndex];
		return controllerLayer._defaultState;
	}

	/**
	*设置默认动画片段。
	*@param playName 默认动画片段名称。
	*/
	__proto.setDefaultClip=function(playName,layerIndex){
		(layerIndex===void 0)&& (layerIndex=0);
		var controllerLayer=this._controllerLayers[layerIndex];
		controllerLayer._defaultState=controllerLayer._statesMap[playName];
	}

	/**
	*添加动画状态。
	*@param state 动画状态。
	*@param layerIndex 层索引。
	*/
	__proto.addState=function(state,layerIndex){
		(layerIndex===void 0)&& (layerIndex=0);
		var stateName=state.name;
		var controllerLayer=this._controllerLayers[layerIndex];
		var statesMap=controllerLayer._statesMap;
		var states=controllerLayer._states;
		if (statesMap[stateName]){
			throw "Animator:this stat's name has exist.";
			}else {
			statesMap[stateName]=state;
			states.push(state);
			state._clip._addReference();
			if (this._avatar){
				this._getOwnersByClipAsync(state);
				}else {
				this._getOwnersByClipAsync(state);
			}
		}
	}

	/**
	*移除动画状态。
	*@param state 动画状态。
	*@param layerIndex 层索引。
	*/
	__proto.removeState=function(state,layerIndex){
		(layerIndex===void 0)&& (layerIndex=0);
		var controllerLayer=this._controllerLayers[layerIndex];
		var clipStateInfos=controllerLayer._states;
		var statesMap=controllerLayer._statesMap;
		var index=-1;
		for (var i=0,n=clipStateInfos.length;i < n;i++){
			if (clipStateInfos[i]===state){
				index=i;
				break ;
			}
		}
		if (index!==-1)
			this._removeClip(clipStateInfos,statesMap,index,state);
	}

	/**
	*添加控制器层。
	*/
	__proto.addControllerLayer=function(controllderLayer){
		this._controllerLayers.push(controllderLayer);
	}

	/**
	*获取控制器层。
	*/
	__proto.getControllerLayer=function(layerInex){
		(layerInex===void 0)&& (layerInex=0);
		return this._controllerLayers[layerInex];
	}

	/**
	*获取当前的播放状态。
	*@param layerIndex 层索引。
	*@return 动画播放状态。
	*/
	__proto.getCurrentAnimatorPlayState=function(layerInex){
		(layerInex===void 0)&& (layerInex=0);
		return this._controllerLayers[layerInex]._playStateInfo;
	}

	/**
	*播放动画。
	*@param name 如果为null则播放默认动画，否则按名字播放动画片段。
	*@param layerIndex 层索引。
	*@param normalizedTime 归一化的播放起始时间。
	*/
	__proto.play=function(name,layerIndex,normalizedTime){
		(layerIndex===void 0)&& (layerIndex=0);
		(normalizedTime===void 0)&& (normalizedTime=Number.NEGATIVE_INFINITY);
		var controllerLayer=this._controllerLayers[layerIndex];
		var defaultState=controllerLayer._defaultState;
		if (!name && !defaultState)
			throw new Error("Animator:must have  default clip value,please set clip property.");
		var curPlayState=controllerLayer._currentPlayState;
		var playStateInfo=controllerLayer._playStateInfo;
		var animatorState=name ? controllerLayer._statesMap[name] :defaultState;
		var clipDuration=animatorState._clip._duration;
		if (curPlayState!==animatorState){
			if (normalizedTime!==Number.NEGATIVE_INFINITY)
				playStateInfo._resetPlayState(clipDuration *normalizedTime);
			else
			playStateInfo._resetPlayState(0.0);
			(curPlayState!==null && curPlayState!==animatorState)&& (this._revertDefaultKeyframeNodes(curPlayState));
			controllerLayer._playType=0;
			controllerLayer._currentPlayState=animatorState;
			}else {
			if (normalizedTime!==Number.NEGATIVE_INFINITY){
				playStateInfo._resetPlayState(clipDuration *normalizedTime);
				controllerLayer._playType=0;
			}
		};
		var scripts=animatorState._scripts;
		if (scripts){
			for (var i=0,n=scripts.length;i < n;i++)
			scripts[i].onStateEnter();
		}
	}

	/**
	*在当前动画状态和目标动画状态之间进行融合过渡播放。
	*@param name 目标动画状态。
	*@param transitionDuration 过渡时间,该值为当前动画状态的归一化时间，值在0.0~1.0之间。
	*@param layerIndex 层索引。
	*@param normalizedTime 归一化的播放起始时间。
	*/
	__proto.crossFade=function(name,transitionDuration,layerIndex,normalizedTime){
		(layerIndex===void 0)&& (layerIndex=0);
		(normalizedTime===void 0)&& (normalizedTime=Number.NEGATIVE_INFINITY);
		var controllerLayer=this._controllerLayers[layerIndex];
		var destAnimatorState=controllerLayer._statesMap[name];
		if (destAnimatorState){
			var playType=controllerLayer._playType;
			if (playType===-1){
				this.play(name,layerIndex,normalizedTime);
				return;
			};
			var crossPlayStateInfo=controllerLayer._crossPlayStateInfo;
			var crossNodeOwners=controllerLayer._crossNodesOwners;
			var crossNodeOwnerIndicesMap=controllerLayer._crossNodesOwnersIndicesMap;
			var srcAnimatorState=controllerLayer._currentPlayState;
			var destNodeOwners=destAnimatorState._nodeOwners;
			var destCrossClipNodeIndices=controllerLayer._destCrossClipNodeIndices;
			var destClip=destAnimatorState._clip;
			var destNodes=destClip._nodes;
			var destNodesMap=destClip._nodesDic;
			switch (playType){
				case 0:;
					var srcNodeOwners=srcAnimatorState._nodeOwners;
					var scrCrossClipNodeIndices=controllerLayer._srcCrossClipNodeIndices;
					var srcClip=srcAnimatorState._clip;
					var srcNodes=srcClip._nodes;
					var srcNodesMap=srcClip._nodesDic;
					controllerLayer._playType=1;
					var crossMark=++controllerLayer._crossMark;
					var crossCount=controllerLayer._crossNodesOwnersCount=0;
					for (var i=0,n=srcNodes.count;i < n;i++){
						var srcNode=srcNodes.getNodeByIndex(i);
						var srcIndex=srcNode._indexInList;
						var srcNodeOwner=srcNodeOwners[srcIndex];
						if (srcNodeOwner){
							var srcFullPath=srcNode.fullPath;
							scrCrossClipNodeIndices[crossCount]=srcIndex;
							var destNode=destNodesMap[srcFullPath];
							if (destNode)
								destCrossClipNodeIndices[crossCount]=destNode._indexInList;
							else
							destCrossClipNodeIndices[crossCount]=-1;
							crossNodeOwnerIndicesMap[srcFullPath]=crossMark;
							crossNodeOwners[crossCount]=srcNodeOwner;
							crossCount++;
						}
					}
					for (i=0,n=destNodes.count;i < n;i++){
						destNode=destNodes.getNodeByIndex(i);
						var destIndex=destNode._indexInList;
						var destNodeOwner=destNodeOwners[destIndex];
						if (destNodeOwner){
							var destFullPath=destNode.fullPath;
							if (!srcNodesMap[destFullPath]){
								scrCrossClipNodeIndices[crossCount]=-1;
								destCrossClipNodeIndices[crossCount]=destIndex;
								crossNodeOwnerIndicesMap[destFullPath]=crossMark;
								crossNodeOwners[crossCount]=destNodeOwner;
								crossCount++;
							}
						}
					}
					break ;
				case 1:
				case 2:
					controllerLayer._playType=2;
					for (i=0,n=crossNodeOwners.length;i < n;i++){
						var nodeOwner=crossNodeOwners[i];
						nodeOwner.saveCrossFixedValue();
						destNode=destNodesMap[nodeOwner.fullPath];
						if (destNode)
							destCrossClipNodeIndices[i]=destNode._indexInList;
						else
						destCrossClipNodeIndices[i]=-1;
					}
					crossCount=controllerLayer._crossNodesOwnersCount;
					crossMark=controllerLayer._crossMark;
					for (i=0,n=destNodes.count;i < n;i++){
						destNode=destNodes.getNodeByIndex(i);
						destIndex=destNode._indexInList;
						destNodeOwner=destNodeOwners[destIndex];
						if (destNodeOwner){
							destFullPath=destNode.fullPath;
							if (crossNodeOwnerIndicesMap[destFullPath]!==crossMark){
								destCrossClipNodeIndices[crossCount]=destIndex;
								crossNodeOwnerIndicesMap[destFullPath]=crossMark;
								nodeOwner=destNodeOwners[destIndex];
								crossNodeOwners[crossCount]=nodeOwner;
								nodeOwner.saveCrossFixedValue();
								crossCount++;
							}
						}
					}
					break ;
				default :
				}
			controllerLayer._crossNodesOwnersCount=crossCount;
			controllerLayer._crossPlayState=destAnimatorState;
			controllerLayer._crossDuration=srcAnimatorState._clip._duration *transitionDuration;
			if (normalizedTime!==Number.NEGATIVE_INFINITY)
				crossPlayStateInfo._resetPlayState(destClip._duration *normalizedTime);
			else
			crossPlayStateInfo._resetPlayState(0.0);
		};
		var scripts=destAnimatorState._scripts;
		if (scripts){
			for (i=0,n=scripts.length;i < n;i++)
			scripts[i].onStateEnter();
		}
	}

	/**
	*关联精灵节点到Avatar节点,此Animator必须有Avatar文件。
	*@param nodeName 关联节点的名字。
	*@param sprite3D 精灵节点。
	*@return 是否关联成功。
	*/
	__proto.linkSprite3DToAvatarNode=function(nodeName,sprite3D){
		if (sprite3D._hierarchyAnimator===this){
			this._isLinkSpriteToAnimationNodeData(sprite3D,nodeName,true);
			this._isLinkSpriteToAnimationNode(sprite3D,nodeName,true);
			return true;
			}else {
			throw("Animator:sprite3D must belong to this Animator");
			return false;
		}
	}

	/**
	*解除精灵节点到Avatar节点的关联,此Animator必须有Avatar文件。
	*@param sprite3D 精灵节点。
	*@return 是否解除关联成功。
	*/
	__proto.unLinkSprite3DToAvatarNode=function(sprite3D){
		if (sprite3D._hierarchyAnimator===this){
			var dummy=sprite3D.transform._dummy;
			if (dummy){
				var nodeName=dummy._owner.name;
				this._isLinkSpriteToAnimationNodeData(sprite3D,nodeName,false);
				this._isLinkSpriteToAnimationNode(sprite3D,nodeName,false);
				return true;
				}else {
				return false;
			}
			}else {
			throw("Animator:sprite3D must belong to this Animator");
			return false;
		}
	}

	/**
	*@inheritDoc
	*/
	__proto.destroy=function(){
		_super.prototype.destroy.call(this);
		for (var i=0,n=this._controllerLayers.length;i < n;i++){
			var clipStateInfos=this._controllerLayers[i]._states;
			for (var j=0,m=clipStateInfos.length;j < m;j++)
			clipStateInfos[j]._clip._removeReference();
		}
	}

	/**
	*@private
	*[NATIVE]
	*/
	__proto._updateAnimationNodeWorldMatix=function(localPositions,localRotations,localScales,worldMatrixs,parentIndices){
		LayaGL.instance.updateAnimationNodeWorldMatix(localPositions,localRotations,localScales,parentIndices,worldMatrixs);
	}

	/**
	*设置avatar。
	*@param value avatar。
	*/
	/**
	*获取avatar。
	*@return avator。
	*/
	__getset(0,__proto,'avatar',function(){
		return this._avatar;
		},function(value){
		if (this._avatar!==value){
			this._avatar=value;
			if (value){
				this._getAvatarOwnersAndInitDatasAsync();
				(this.owner)._changeHierarchyAnimatorAvatar(this,value);
				}else {
				var parent=this.owner._parent;
				(this.owner)._changeHierarchyAnimatorAvatar(this,parent ? (parent)._hierarchyAnimator._avatar :null);
			}
		}
	});

	/**
	*设置动画的播放速度,1.0为正常播放速度。
	*@param 动画的播放速度。
	*/
	/**
	*获取动画的播放速度,1.0为正常播放速度。
	*@return 动画的播放速度。
	*/
	__getset(0,__proto,'speed',function(){
		return this._speed;
		},function(value){
		this._speed=value;
	});

	Animator._update=function(scene){
		var pool=scene._animatorPool;
		var elements=pool.elements;
		for (var i=0,n=pool.length;i < n;i++){
			var animator=elements[i];
			(animator && animator.enabled)&& (animator._update());
		}
	}

	Animator._tempVector3Array0=new Float32Array(3);
	Animator._tempVector3Array1=new Float32Array(3);
	Animator._tempQuaternionArray0=new Float32Array(4);
	Animator._tempQuaternionArray1=new Float32Array(4);
	Animator.CULLINGMODE_ALWAYSANIMATE=0;
	Animator.CULLINGMODE_CULLCOMPLETELY=2;
	return Animator;
})(Component)


/**

*/
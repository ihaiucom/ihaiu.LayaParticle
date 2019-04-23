//class laya.ani.AnimationTemplet extends laya.resource.Resource
var AnimationTemplet=(function(_super){
	function AnimationTemplet(){
		/**@private */
		//this._aniVersion=null;
		/**@private */
		this._aniMap={};
		/**@private */
		//this._publicExtData=null;
		/**@private */
		//this._useParent=false;
		/**@private */
		//this.unfixedCurrentFrameIndexes=null;
		/**@private */
		//this.unfixedCurrentTimes=null;
		/**@private */
		//this.unfixedKeyframes=null;
		/**@private */
		this.unfixedLastAniIndex=-1;
		/**@private */
		//this._aniClassName=null;
		/**@private */
		//this._animationDatasCache=null;
		AnimationTemplet.__super.call(this);
		this._anis=new Array;
	}

	__class(AnimationTemplet,'laya.ani.AnimationTemplet',_super);
	var __proto=AnimationTemplet.prototype;
	/**
	*@private
	*/
	__proto.parse=function(data){
		var reader=new Byte(data);
		this._aniVersion=reader.readUTFString();
		AnimationParser01.parse(this,reader);
	}

	/**
	*@private
	*/
	__proto._calculateKeyFrame=function(node,keyframeCount,keyframeDataCount){
		var keyFrames=node.keyFrame;
		keyFrames[keyframeCount]=keyFrames[0];
		for (var i=0;i < keyframeCount;i++){
			var keyFrame=keyFrames[i];
			for (var j=0;j < keyframeDataCount;j++){
				keyFrame.dData[j]=(keyFrame.duration===0)? 0 :(keyFrames[i+1].data[j]-keyFrame.data[j])/ keyFrame.duration;
				keyFrame.nextData[j]=keyFrames[i+1].data[j];
			}
		}
		keyFrames.length--;
	}

	//TODO:coverage
	__proto._onAsynLoaded=function(data,propertyParams){
		var reader=new Byte(data);
		this._aniVersion=reader.readUTFString();
		switch (this._aniVersion){
			case "LAYAANIMATION:02":
				AnimationParser02.parse(this,reader);
				break ;
			default :
				AnimationParser01.parse(this,reader);
			}
	}

	__proto.getAnimationCount=function(){
		return this._anis.length;
	}

	__proto.getAnimation=function(aniIndex){
		return this._anis[aniIndex];
	}

	__proto.getAniDuration=function(aniIndex){
		return this._anis[aniIndex].playTime;
	}

	//TODO:coverage
	__proto.getNodes=function(aniIndex){
		return this._anis[aniIndex].nodes;
	}

	__proto.getNodeIndexWithName=function(aniIndex,name){
		return this._anis[aniIndex].bone3DMap[name];
	}

	__proto.getNodeCount=function(aniIndex){
		return this._anis[aniIndex].nodes.length;
	}

	__proto.getTotalkeyframesLength=function(aniIndex){
		return this._anis[aniIndex].totalKeyframeDatasLength;
	}

	__proto.getPublicExtData=function(){
		return this._publicExtData;
	}

	//TODO:coverage
	__proto.getAnimationDataWithCache=function(key,cacheDatas,aniIndex,frameIndex){
		var aniDatas=cacheDatas[aniIndex];
		if (!aniDatas){
			return null;
			}else {
			var keyDatas=aniDatas[key];
			if (!keyDatas)
				return null;
			else {
				return keyDatas[frameIndex];
			}
		}
	}

	//TODO:coverage
	__proto.setAnimationDataWithCache=function(key,cacheDatas,aniIndex,frameIndex,data){
		var aniDatas=(cacheDatas[aniIndex])|| (cacheDatas[aniIndex]={});
		var aniDatasCache=(aniDatas[key])|| (aniDatas[key]=[]);
		aniDatasCache[frameIndex]=data;
	}

	//TODO:coverage
	__proto.getOriginalData=function(aniIndex,originalData,nodesFrameIndices,frameIndex,playCurTime){
		var oneAni=this._anis[aniIndex];
		var nodes=oneAni.nodes;
		var j=0;
		for (var i=0,n=nodes.length,outOfs=0;i < n;i++){
			var node=nodes[i];
			var key;
			key=node.keyFrame[nodesFrameIndices[i][frameIndex]];
			node.dataOffset=outOfs;
			var dt=playCurTime-key.startTime;
			var lerpType=node.lerpType;
			if (lerpType){
				switch (lerpType){
					case 0:
					case 1:
						for (j=0;j < node.keyframeWidth;)
						j+=node.interpolationMethod[j](node,j,originalData,outOfs+j,key.data,dt,key.dData,key.duration,key.nextData);
						break ;
					case 2:;
						var interpolationData=key.interpolationData;
						var interDataLen=interpolationData.length;
						var dataIndex=0;
						for (j=0;j < interDataLen;){
							var type=interpolationData[j];
						switch (type){
							case 6:
								j+=AnimationTemplet.interpolation[type](node,dataIndex,originalData,outOfs+dataIndex,key.data,dt,key.dData,key.duration,key.nextData,interpolationData,j+1);
								break ;
							case 7:
								j+=AnimationTemplet.interpolation[type](node,dataIndex,originalData,outOfs+dataIndex,key.data,dt,key.dData,key.duration,key.nextData,interpolationData,j+1);
								break ;
							default :
								j+=AnimationTemplet.interpolation[type](node,dataIndex,originalData,outOfs+dataIndex,key.data,dt,key.dData,key.duration,key.nextData);
							}
						dataIndex++;
					}
					break ;
				}
				}else {
				for (j=0;j < node.keyframeWidth;)
				j+=node.interpolationMethod[j](node,j,originalData,outOfs+j,key.data,dt,key.dData,key.duration,key.nextData);
			}
			outOfs+=node.keyframeWidth;
		}
	}

	//TODO:coverage
	__proto.getNodesCurrentFrameIndex=function(aniIndex,playCurTime){
		var ani=this._anis[aniIndex];
		var nodes=ani.nodes;
		if (aniIndex!==this.unfixedLastAniIndex){
			this.unfixedCurrentFrameIndexes=new Uint32Array(nodes.length);
			this.unfixedCurrentTimes=new Float32Array(nodes.length);
			this.unfixedLastAniIndex=aniIndex;
		}
		for (var i=0,n=nodes.length,outOfs=0;i < n;i++){
			var node=nodes[i];
			if (playCurTime < this.unfixedCurrentTimes[i])
				this.unfixedCurrentFrameIndexes[i]=0;
			this.unfixedCurrentTimes[i]=playCurTime;
			while ((this.unfixedCurrentFrameIndexes[i] < node.keyFrame.length)){
				if (node.keyFrame[this.unfixedCurrentFrameIndexes[i]].startTime > this.unfixedCurrentTimes[i])
					break ;
				this.unfixedCurrentFrameIndexes[i]++;
			}
			this.unfixedCurrentFrameIndexes[i]--;
		}
		return this.unfixedCurrentFrameIndexes;
	}

	//TODO:coverage
	__proto.getOriginalDataUnfixedRate=function(aniIndex,originalData,playCurTime){
		var oneAni=this._anis[aniIndex];
		var nodes=oneAni.nodes;
		if (aniIndex!==this.unfixedLastAniIndex){
			this.unfixedCurrentFrameIndexes=new Uint32Array(nodes.length);
			this.unfixedCurrentTimes=new Float32Array(nodes.length);
			this.unfixedKeyframes=__newvec(nodes.length);
			this.unfixedLastAniIndex=aniIndex;
		};
		var j=0;
		for (var i=0,n=nodes.length,outOfs=0;i < n;i++){
			var node=nodes[i];
			if (playCurTime < this.unfixedCurrentTimes[i])
				this.unfixedCurrentFrameIndexes[i]=0;
			this.unfixedCurrentTimes[i]=playCurTime;
			while (this.unfixedCurrentFrameIndexes[i] < node.keyFrame.length){
				if (node.keyFrame[this.unfixedCurrentFrameIndexes[i]].startTime > this.unfixedCurrentTimes[i])
					break ;
				this.unfixedKeyframes[i]=node.keyFrame[this.unfixedCurrentFrameIndexes[i]];
				this.unfixedCurrentFrameIndexes[i]++;
			};
			var key=this.unfixedKeyframes[i];
			node.dataOffset=outOfs;
			var dt=playCurTime-key.startTime;
			var lerpType=node.lerpType;
			if (lerpType){
				switch (node.lerpType){
					case 0:
					case 1:
						for (j=0;j < node.keyframeWidth;)
						j+=node.interpolationMethod[j](node,j,originalData,outOfs+j,key.data,dt,key.dData,key.duration,key.nextData);
						break ;
					case 2:;
						var interpolationData=key.interpolationData;
						var interDataLen=interpolationData.length;
						var dataIndex=0;
						for (j=0;j < interDataLen;){
							var type=interpolationData[j];
						switch (type){
							case 6:
								j+=AnimationTemplet.interpolation[type](node,dataIndex,originalData,outOfs+dataIndex,key.data,dt,key.dData,key.duration,key.nextData,interpolationData,j+1);
								break ;
							case 7:
								j+=AnimationTemplet.interpolation[type](node,dataIndex,originalData,outOfs+dataIndex,key.data,dt,key.dData,key.duration,key.nextData,interpolationData,j+1);
								break ;
							default :
								j+=AnimationTemplet.interpolation[type](node,dataIndex,originalData,outOfs+dataIndex,key.data,dt,key.dData,key.duration,key.nextData);
							}
						dataIndex++;
					}
					break ;
				}
				}else {
				for (j=0;j < node.keyframeWidth;)
				j+=node.interpolationMethod[j](node,j,originalData,outOfs+j,key.data,dt,key.dData,key.duration,key.nextData);
			}
			outOfs+=node.keyframeWidth;
		}
	}

	AnimationTemplet._LinearInterpolation_0=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData){
		out[outOfs]=data[index]+dt *dData[index];
		return 1;
	}

	AnimationTemplet._QuaternionInterpolation_1=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData){
		var amount=duration===0 ? 0 :dt / duration;
		MathUtil.slerpQuaternionArray(data,index,nextData,index,amount,out,outOfs);
		return 4;
	}

	AnimationTemplet._AngleInterpolation_2=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData){
		return 0;
	}

	AnimationTemplet._RadiansInterpolation_3=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData){
		return 0;
	}

	AnimationTemplet._Matrix4x4Interpolation_4=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData){
		for (var i=0;i < 16;i++,index++)
		out[outOfs+i]=data[index]+dt *dData[index];
		return 16;
	}

	AnimationTemplet._NoInterpolation_5=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData){
		out[outOfs]=data[index];
		return 1;
	}

	AnimationTemplet._BezierInterpolation_6=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData,offset){
		(offset===void 0)&& (offset=0);
		out[outOfs]=data[index]+(nextData[index]-data[index])*BezierLerp.getBezierRate(dt / duration,interData[offset],interData[offset+1],interData[offset+2],interData[offset+3]);
		return 5;
	}

	AnimationTemplet._BezierInterpolation_7=function(bone,index,out,outOfs,data,dt,dData,duration,nextData,interData,offset){
		(offset===void 0)&& (offset=0);
		out[outOfs]=interData[offset+4]+interData[offset+5] *BezierLerp.getBezierRate((dt *0.001+interData[offset+6])/ interData[offset+7],interData[offset],interData[offset+1],interData[offset+2],interData[offset+3]);
		return 9;
	}

	AnimationTemplet.interpolation=[AnimationTemplet._LinearInterpolation_0,AnimationTemplet._QuaternionInterpolation_1,AnimationTemplet._AngleInterpolation_2,AnimationTemplet._RadiansInterpolation_3,AnimationTemplet._Matrix4x4Interpolation_4,AnimationTemplet._NoInterpolation_5,AnimationTemplet._BezierInterpolation_6,AnimationTemplet._BezierInterpolation_7];
	return AnimationTemplet;
})(Resource)


/**
*骨骼动画由<code>Templet</code>，<code>AnimationPlayer</code>，<code>Skeleton</code>三部分组成。
*/

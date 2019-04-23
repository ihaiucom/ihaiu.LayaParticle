/**
*<code>AnimationClip</code> 类用于动画片段资源。
*/
//class laya.d3.animation.AnimationClip extends laya.resource.Resource
var AnimationClip=(function(_super){
	function AnimationClip(){
		/**@private */
		//this._version=null;
		/**@private */
		//this._duration=NaN;
		/**@private */
		//this._frameRate=0;
		/**@private */
		//this._nodesDic=null;
		/**@private */
		//this._nodesMap=null;
		/**@private */
		//this._events=null;
		/**是否循环。*/
		//this.islooping=false;
		AnimationClip.__super.call(this);
		this._nodes=new KeyframeNodeList();
		this._events=[];
	}

	__class(AnimationClip,'laya.d3.animation.AnimationClip',_super);
	var __proto=AnimationClip.prototype;
	/**
	*获取动画片段时长。
	*/
	__proto.duration=function(){
		return this._duration;
	}

	/**
	*@private
	*/
	__proto._hermiteInterpolate=function(frame,nextFrame,t,dur){
		var t0=frame.outTangent,t1=nextFrame.inTangent;
		if (/*__JS__ */Number.isFinite(t0)&& Number.isFinite(t1)){
			var t2=t *t;
			var t3=t2 *t;
			var a=2.0 *t3-3.0 *t2+1.0;
			var b=t3-2.0 *t2+t;
			var c=t3-t2;
			var d=-2.0 *t3+3.0 *t2;
			return a *frame.value+b *t0 *dur+c *t1 *dur+d *nextFrame.value;
		}else
		return frame.value;
	}

	/**
	*@private
	*/
	__proto._hermiteInterpolateArray=function(frame,nextFrame,t,dur,out){
		var d0=frame.data;
		var d1=nextFrame.data;
		var outTanOffset=out.length;
		var pOffset=outTanOffset *2;
		var a=NaN,b=NaN,c=NaN,d=NaN;
		for (var i=0,n=out.length;i < n;i++){
			var t0=d0[outTanOffset+i],t1=d1[i];
			if (/*__JS__ */Number.isFinite(t0)&& Number.isFinite(t1)){
				if (i===0){
					var t2=t *t;
					var t3=t2 *t;
					a=2.0 *t3-3.0 *t2+1.0;
					b=t3-2.0 *t2+t;
					c=t3-t2;
					d=-2.0 *t3+3.0 *t2;
				}
				out[i]=a *d0[pOffset+i]+b *t0 *dur+c *t1 *dur+d *d1[pOffset+i];
			}else
			out[i]=d0[pOffset+i];
		}
	}

	/**
	*@private
	*/
	__proto._evaluateClipDatasRealTime=function(nodes,playCurTime,realTimeCurrentFrameIndexes,addtive,frontPlay){
		for (var i=0,n=nodes.count;i < n;i++){
			var node=nodes.getNodeByIndex(i);
			var type=node.type;
			var nextFrameIndex=0;
			var keyFrames=node._keyFrames;
			var keyFramesCount=keyFrames.length;
			var frameIndex=realTimeCurrentFrameIndexes[i];
			if (frontPlay){
				if ((frameIndex!==-1)&& (playCurTime < keyFrames[frameIndex].time)){
					frameIndex=-1;
					realTimeCurrentFrameIndexes[i]=frameIndex;
				}
				nextFrameIndex=frameIndex+1;
				while (nextFrameIndex < keyFramesCount){
					if (keyFrames[nextFrameIndex].time > playCurTime)
						break ;
					frameIndex++;
					nextFrameIndex++;
					realTimeCurrentFrameIndexes[i]=frameIndex;
				}
				}else {
				nextFrameIndex=frameIndex+1;
				if ((nextFrameIndex!==keyFramesCount)&& (playCurTime > keyFrames[nextFrameIndex].time)){
					frameIndex=keyFramesCount-1;
					realTimeCurrentFrameIndexes[i]=frameIndex;
				}
				nextFrameIndex=frameIndex+1;
				while (frameIndex >-1){
					if (keyFrames[frameIndex].time < playCurTime)
						break ;
					frameIndex--;
					nextFrameIndex--;
					realTimeCurrentFrameIndexes[i]=frameIndex;
				}
			};
			var isEnd=nextFrameIndex===keyFramesCount;
			switch (type){
				case 0:
					if (frameIndex!==-1){
						var frame=keyFrames [frameIndex];
						if (isEnd){
							node.data=frame.value;
							}else {
							var nextFarme=keyFrames [nextFrameIndex];
							var d=nextFarme.time-frame.time;
							var t=NaN;
							if (d!==0)
								t=(playCurTime-frame.time)/ d;
							else
							t=0;
							node.data=this._hermiteInterpolate(frame,nextFarme,t,d);
						}
						}else {
						node.data=(keyFrames [0]).value;
					}
					if (addtive)
						node.data-=(keyFrames [0]).value;
					break ;
				case 1:
				case 4:;
					var clipData=node.data;
					this._evaluateFrameNodeArrayDatasRealTime(keyFrames,frameIndex,isEnd,playCurTime,3,clipData);
					if (addtive){
						var firstFrameValue=(keyFrames [0]).data;
						clipData[0]-=firstFrameValue[6];
						clipData[1]-=firstFrameValue[7];
						clipData[2]-=firstFrameValue[8];
					}
					break ;
				case 2:
					clipData=node.data;
					this._evaluateFrameNodeArrayDatasRealTime(keyFrames,frameIndex,isEnd,playCurTime,4,clipData);
					if (addtive){
						var tempQuat=AnimationClip._tempQuaternionArray0;
						firstFrameValue=(keyFrames [0]).data;
						Utils3D.quaternionConjugate(firstFrameValue,8,tempQuat);
						Utils3D.quaternionMultiply(tempQuat,clipData,clipData);
					}
					break ;
				case 3:
					clipData=node.data;
					this._evaluateFrameNodeArrayDatasRealTime(keyFrames,frameIndex,isEnd,playCurTime,3,clipData);
					if (addtive){
						firstFrameValue=(keyFrames [0]).data;
						clipData[0] /=firstFrameValue[6];
						clipData[1] /=firstFrameValue[7];
						clipData[2] /=firstFrameValue[8];
					}
					break ;
				default :
					throw "AnimationClip:unknown node type.";
				}
		}
	}

	__proto._evaluateClipDatasRealTimeForNative=function(nodes,playCurTime,realTimeCurrentFrameIndexes,addtive){
		LayaGL.instance.evaluateClipDatasRealTime(nodes._nativeObj,playCurTime,realTimeCurrentFrameIndexes,addtive);
	}

	/**
	*@private
	*/
	__proto._evaluateFrameNodeArrayDatasRealTime=function(keyFrames,frameIndex,isEnd,playCurTime,width,outDatas){
		var dataOffset=width *2;
		if (frameIndex!==-1){
			var frame=keyFrames[frameIndex];
			if (isEnd){
				var frameData=frame.data;
				for (var j=0;j < width;j++)
				outDatas[j]=frameData[dataOffset+j];
				}else {
				var nextKeyFrame=keyFrames[frameIndex+1];
				var t=NaN;
				var startTime=frame.time;
				var d=nextKeyFrame.time-startTime;
				if (d!==0)
					t=(playCurTime-startTime)/ d;
				else
				t=0;
				this._hermiteInterpolateArray(frame,nextKeyFrame,t,d,outDatas);
			}
			}else {
			var firstFrameDatas=keyFrames[0].data;
			for (j=0;j < width;j++)
			outDatas[j]=firstFrameDatas[dataOffset+j];
		}
	}

	/**
	*@private
	*/
	__proto._binarySearchEventIndex=function(time){
		var start=0;
		var end=this._events.length-1;
		var mid=0;
		while (start <=end){
			mid=Math.floor((start+end)/ 2);
			var midValue=this._events[mid].time;
			if (midValue==time)
				return mid;
			else if (midValue > time)
			end=mid-1;
			else
			start=mid+1;
		}
		return start;
	}

	/**
	*添加动画事件。
	*/
	__proto.addEvent=function(event){
		var index=this._binarySearchEventIndex(event.time);
		this._events.splice(index,0,event);
	}

	/**
	*@inheritDoc
	*/
	__proto._disposeResource=function(){
		this._version=null;
		this._nodes=null;
		this._nodesMap=null;
	}

	AnimationClip._parse=function(data,propertyParams,constructParams){
		var clip=new AnimationClip();
		var reader=new Byte(data);
		clip._version=reader.readUTFString();
		switch (clip._version){
			case "LAYAANIMATION:03":
				AnimationClipParser03.parse(clip,reader);
				break ;
			default :
				throw "unknown animationClip version.";
			}
		return clip;
	}

	AnimationClip.load=function(url,complete){
		Laya.loader.create(url,complete,null,/*Laya3D.ANIMATIONCLIP*/"ANIMATIONCLIP");
	}

	__static(AnimationClip,
	['_tempQuaternionArray0',function(){return this._tempQuaternionArray0=new Float32Array(4);}
	]);
	return AnimationClip;
})(Resource)


/**

*/
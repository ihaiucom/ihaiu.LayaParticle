//class laya.ani.AnimationParser01
var AnimationParser01=(function(){
	function AnimationParser01(){}
	__class(AnimationParser01,'laya.ani.AnimationParser01');
	AnimationParser01.parse=function(templet,reader){
		var data=reader.__getBuffer();
		var i=0,j=0,k=0,n=0,l=0,m=0,o=0;
		var aniClassName=reader.readUTFString();
		templet._aniClassName=aniClassName;
		var strList=reader.readUTFString().split("\n");
		var aniCount=reader.getUint8();
		var publicDataPos=reader.getUint32();
		var publicExtDataPos=reader.getUint32();
		var publicData;
		if (publicDataPos > 0)
			publicData=data.slice(publicDataPos,publicExtDataPos);
		var publicRead=new Byte(publicData);
		if (publicExtDataPos > 0)
			templet._publicExtData=data.slice(publicExtDataPos,data.byteLength);
		templet._useParent=!!reader.getUint8();
		templet._anis.length=aniCount;
		for (i=0;i < aniCount;i++){
			var ani=templet._anis[i]=new AnimationContent();
			{};
			ani.nodes=new Array;
			var name=ani.name=strList[reader.getUint16()];
			templet._aniMap[name]=i;
			ani.bone3DMap={};
			ani.playTime=reader.getFloat32();
			var boneCount=ani.nodes.length=reader.getUint8();
			ani.totalKeyframeDatasLength=0;
			for (j=0;j < boneCount;j++){
				var node=ani.nodes[j]=new AnimationNodeContent();
				{};
				node.childs=[];
				var nameIndex=reader.getInt16();
				if (nameIndex >=0){
					node.name=strList[nameIndex];
					ani.bone3DMap[node.name]=j;
				}
				node.keyFrame=new Array;
				node.parentIndex=reader.getInt16();
				node.parentIndex==-1 ? node.parent=null :node.parent=ani.nodes[node.parentIndex]
				node.lerpType=reader.getUint8();
				var keyframeParamsOffset=reader.getUint32();
				publicRead.pos=keyframeParamsOffset;
				var keyframeDataCount=node.keyframeWidth=publicRead.getUint16();
				ani.totalKeyframeDatasLength+=keyframeDataCount;
				if (node.lerpType===0 || node.lerpType===1){
					node.interpolationMethod=[];
					node.interpolationMethod.length=keyframeDataCount;
					for (k=0;k < keyframeDataCount;k++)
					node.interpolationMethod[k]=AnimationTemplet.interpolation[publicRead.getUint8()];
				}
				if (node.parent !=null)
					node.parent.childs.push(node);
				var privateDataLen=reader.getUint16();
				if (privateDataLen > 0){
					node.extenData=data.slice(reader.pos,reader.pos+privateDataLen);
					reader.pos+=privateDataLen;
				};
				var keyframeCount=reader.getUint16();
				node.keyFrame.length=keyframeCount;
				var startTime=0;
				var keyFrame;
				for (k=0,n=keyframeCount;k < n;k++){
					keyFrame=node.keyFrame[k]=new KeyFramesContent();
					{};
					keyFrame.duration=reader.getFloat32();
					keyFrame.startTime=startTime;
					if (node.lerpType===2){
						keyFrame.interpolationData=[];
						var interDataLength=reader.getUint8();
						var lerpType=0;
						lerpType=reader.getFloat32();
						switch (lerpType){
							case 254:
								keyFrame.interpolationData.length=keyframeDataCount;
								for (o=0;o < keyframeDataCount;o++)
								keyFrame.interpolationData[o]=0;
								break ;
							case 255:
								keyFrame.interpolationData.length=keyframeDataCount;
								for (o=0;o < keyframeDataCount;o++)
								keyFrame.interpolationData[o]=5;
								break ;
							default :
								keyFrame.interpolationData.push(lerpType);
								for (m=1;m < interDataLength;m++){
									keyFrame.interpolationData.push(reader.getFloat32());
								}
							}
					}
					keyFrame.data=new Float32Array(keyframeDataCount);
					keyFrame.dData=new Float32Array(keyframeDataCount);
					keyFrame.nextData=new Float32Array(keyframeDataCount);
					for (l=0;l < keyframeDataCount;l++){
						keyFrame.data[l]=reader.getFloat32();
						if (keyFrame.data[l] >-0.00000001 && keyFrame.data[l] < 0.00000001)keyFrame.data[l]=0;
					}
					startTime+=keyFrame.duration;
				}
				keyFrame.startTime=ani.playTime;
				node.playTime=ani.playTime;
				templet._calculateKeyFrame(node,keyframeCount,keyframeDataCount);
			}
		}
	}

	return AnimationParser01;
})()


/**
*@private
*/

//class laya.ani.AnimationParser02
var AnimationParser02=(function(){
	function AnimationParser02(){}
	__class(AnimationParser02,'laya.ani.AnimationParser02');
	AnimationParser02.READ_DATA=function(){
		AnimationParser02._DATA.offset=AnimationParser02._reader.getUint32();
		AnimationParser02._DATA.size=AnimationParser02._reader.getUint32();
	}

	AnimationParser02.READ_BLOCK=function(){
		var count=AnimationParser02._BLOCK.count=AnimationParser02._reader.getUint16();
		var blockStarts=AnimationParser02._BLOCK.blockStarts=[];
		var blockLengths=AnimationParser02._BLOCK.blockLengths=[];
		for (var i=0;i < count;i++){
			blockStarts.push(AnimationParser02._reader.getUint32());
			blockLengths.push(AnimationParser02._reader.getUint32());
		}
	}

	AnimationParser02.READ_STRINGS=function(){
		var offset=AnimationParser02._reader.getUint32();
		var count=AnimationParser02._reader.getUint16();
		var prePos=AnimationParser02._reader.pos;
		AnimationParser02._reader.pos=offset+AnimationParser02._DATA.offset;
		for (var i=0;i < count;i++)
		AnimationParser02._strings[i]=AnimationParser02._reader.readUTFString();
		AnimationParser02._reader.pos=prePos;
	}

	AnimationParser02.parse=function(templet,reader){
		AnimationParser02._templet=templet;
		AnimationParser02._reader=reader;
		var arrayBuffer=reader.__getBuffer();
		AnimationParser02.READ_DATA();
		AnimationParser02.READ_BLOCK();
		AnimationParser02.READ_STRINGS();
		for (var i=0,n=AnimationParser02._BLOCK.count;i < n;i++){
			var index=reader.getUint16();
			var blockName=AnimationParser02._strings[index];
			var fn=AnimationParser02["READ_"+blockName];
			if (fn==null)
				throw new Error("model file err,no this function:"+index+" "+blockName);
			else
			fn.call();
		}
	}

	AnimationParser02.READ_ANIMATIONS=function(){
		var reader=AnimationParser02._reader;
		var arrayBuffer=reader.__getBuffer();
		var i=0,j=0,k=0,n=0,l=0;
		var keyframeWidth=reader.getUint16();
		var interpolationMethod=[];
		interpolationMethod.length=keyframeWidth;
		for (i=0;i < keyframeWidth;i++)
		interpolationMethod[i]=AnimationTemplet.interpolation[reader.getByte()];
		var aniCount=reader.getUint8();
		AnimationParser02._templet._anis.length=aniCount;
		for (i=0;i < aniCount;i++){
			var ani=AnimationParser02._templet._anis[i]=
			{};
			ani.nodes=new Array;
			var aniName=ani.name=AnimationParser02._strings[reader.getUint16()];
			AnimationParser02._templet._aniMap[aniName]=i;
			ani.bone3DMap={};
			ani.playTime=reader.getFloat32();
			var boneCount=ani.nodes.length=reader.getInt16();
			ani.totalKeyframeDatasLength=0;
			for (j=0;j < boneCount;j++){
				var node=ani.nodes[j]=
				{};
				node.keyframeWidth=keyframeWidth;
				node.childs=[];
				var nameIndex=reader.getUint16();
				if (nameIndex >=0){
					node.name=AnimationParser02._strings[nameIndex];
					ani.bone3DMap[node.name]=j;
				}
				node.keyFrame=new Array;
				node.parentIndex=reader.getInt16();
				node.parentIndex==-1 ? node.parent=null :node.parent=ani.nodes[node.parentIndex]
				ani.totalKeyframeDatasLength+=keyframeWidth;
				node.interpolationMethod=interpolationMethod;
				if (node.parent !=null)
					node.parent.childs.push(node);
				var keyframeCount=reader.getUint16();
				node.keyFrame.length=keyframeCount;
				var keyFrame=null,lastKeyFrame=null;
				for (k=0,n=keyframeCount;k < n;k++){
					keyFrame=node.keyFrame[k]=
					{};
					keyFrame.startTime=reader.getFloat32();
					(lastKeyFrame)&& (lastKeyFrame.duration=keyFrame.startTime-lastKeyFrame.startTime);
					keyFrame.dData=new Float32Array(keyframeWidth);
					keyFrame.nextData=new Float32Array(keyframeWidth);
					var offset=AnimationParser02._DATA.offset;
					var keyframeDataOffset=reader.getUint32();
					var keyframeDataLength=keyframeWidth *4;
					var keyframeArrayBuffer=arrayBuffer.slice(offset+keyframeDataOffset,offset+keyframeDataOffset+keyframeDataLength);
					keyFrame.data=new Float32Array(keyframeArrayBuffer);
					lastKeyFrame=keyFrame;
				}
				keyFrame.duration=0;
				node.playTime=ani.playTime;
				AnimationParser02._templet._calculateKeyFrame(node,keyframeCount,keyframeWidth);
			}
		}
	}

	AnimationParser02._templet=null;
	AnimationParser02._reader=null;
	AnimationParser02._strings=[];
	__static(AnimationParser02,
	['_BLOCK',function(){return this._BLOCK={count:0};},'_DATA',function(){return this._DATA={offset:0,size:0};}
	]);
	return AnimationParser02;
})()


/**
*@private
*/

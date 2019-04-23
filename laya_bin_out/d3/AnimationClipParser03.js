/**
*<code>/**
*<code>VertexPositionNormalTexture</code> 类用于创建位置、纹理顶点结构。
*/
//class laya.d3.graphics.Vertex.VertexPositionTexture0
var VertexPositionTexture0=(function(){
	function VertexPositionTexture0(position,textureCoordinate0){
		this._position=null;
		this._textureCoordinate0=null;
		this._position=position;
		this._textureCoordinate0=textureCoordinate0;
	}

	__class(VertexPositionTexture0,'laya.d3.graphics.Vertex.VertexPositionTexture0');
	var __proto=VertexPositionTexture0.prototype;
	Laya.imps(__proto,{"laya.d3.graphics.IVertex":true})
	__getset(0,__proto,'position',function(){
		return this._position;
	});

	__getset(0,__proto,'textureCoordinate0',function(){
		return this._textureCoordinate0;
	});

	__getset(0,__proto,'vertexDeclaration',function(){
		return VertexPositionTexture0._vertexDeclaration;
	});

	__getset(1,VertexPositionTexture0,'vertexDeclaration',function(){
		return VertexPositionTexture0._vertexDeclaration;
	});

	__static(VertexPositionTexture0,
	['_vertexDeclaration',function(){return this._vertexDeclaration=new VertexDeclaration(20,[
		new VertexElement(0,/*laya.d3.graphics.VertexElementFormat.Vector3*/"vector3",/*laya.d3.graphics.Vertex.VertexMesh.MESH_POSITION0*/0),
		new VertexElement(12,/*laya.d3.graphics.VertexElementFormat.Vector2*/"vector2",/*laya.d3.graphics.Vertex.VertexMesh.MESH_TEXTURECOORDINATE0*/2)]);}
	]);
	return VertexPositionTexture0;
})()


/**
*@private
*/
//class laya.d3.animation.AnimationClipParser03
var AnimationClipParser03=(function(){
	function AnimationClipParser03(){}
	__class(AnimationClipParser03,'laya.d3.animation.AnimationClipParser03');
	AnimationClipParser03.READ_DATA=function(){
		AnimationClipParser03._DATA.offset=AnimationClipParser03._reader.getUint32();
		AnimationClipParser03._DATA.size=AnimationClipParser03._reader.getUint32();
	}

	AnimationClipParser03.READ_BLOCK=function(){
		var count=AnimationClipParser03._BLOCK.count=AnimationClipParser03._reader.getUint16();
		var blockStarts=AnimationClipParser03._BLOCK.blockStarts=[];
		var blockLengths=AnimationClipParser03._BLOCK.blockLengths=[];
		for (var i=0;i < count;i++){
			blockStarts.push(AnimationClipParser03._reader.getUint32());
			blockLengths.push(AnimationClipParser03._reader.getUint32());
		}
	}

	AnimationClipParser03.READ_STRINGS=function(){
		var offset=AnimationClipParser03._reader.getUint32();
		var count=AnimationClipParser03._reader.getUint16();
		var prePos=AnimationClipParser03._reader.pos;
		AnimationClipParser03._reader.pos=offset+AnimationClipParser03._DATA.offset;
		for (var i=0;i < count;i++)
		AnimationClipParser03._strings[i]=AnimationClipParser03._reader.readUTFString();
		AnimationClipParser03._reader.pos=prePos;
	}

	AnimationClipParser03.parse=function(clip,reader){
		AnimationClipParser03._animationClip=clip;
		AnimationClipParser03._reader=reader;
		var arrayBuffer=reader.__getBuffer();
		AnimationClipParser03.READ_DATA();
		AnimationClipParser03.READ_BLOCK();
		AnimationClipParser03.READ_STRINGS();
		for (var i=0,n=AnimationClipParser03._BLOCK.count;i < n;i++){
			var index=reader.getUint16();
			var blockName=AnimationClipParser03._strings[index];
			var fn=AnimationClipParser03["READ_"+blockName];
			if (fn==null)
				throw new Error("model file err,no this function:"+index+" "+blockName);
			else
			fn.call();
		}
	}

	AnimationClipParser03.READ_ANIMATIONS=function(){
		var i=0,j=0;
		var node;
		var reader=AnimationClipParser03._reader;
		var buffer=reader.__getBuffer();
		var startTimeTypes=[];
		var startTimeTypeCount=reader.getUint16();
		startTimeTypes.length=startTimeTypeCount;
		for (i=0;i < startTimeTypeCount;i++)
		startTimeTypes[i]=reader.getFloat32();
		var clip=AnimationClipParser03._animationClip;
		clip.name=AnimationClipParser03._strings[reader.getUint16()];
		var clipDur=clip._duration=reader.getFloat32();
		clip.islooping=!!reader.getByte();
		clip._frameRate=reader.getInt16();
		var nodeCount=reader.getInt16();
		var nodes=clip._nodes;
		nodes.count=nodeCount;
		var nodesMap=clip._nodesMap={};
		var nodesDic=clip._nodesDic={};
		for (i=0;i < nodeCount;i++){
			node=new KeyframeNode();
			nodes.setNodeByIndex(i,node);
			node._indexInList=i;
			var type=node.type=reader.getUint8();
			var pathLength=reader.getUint16();
			node._setOwnerPathCount(pathLength);
			for (j=0;j < pathLength;j++)
			node._setOwnerPathByIndex(j,AnimationClipParser03._strings[reader.getUint16()]);
			var nodePath=node._joinOwnerPath("/");
			var mapArray=nodesMap[nodePath];
			(mapArray)|| (nodesMap[nodePath]=mapArray=[]);
			mapArray.push(node);
			node.propertyOwner=AnimationClipParser03._strings[reader.getUint16()];
			var propertyLength=reader.getUint16();
			node._setPropertyCount(propertyLength);
			for (j=0;j < propertyLength;j++)
			node._setPropertyByIndex(j,AnimationClipParser03._strings[reader.getUint16()]);
			var fullPath=nodePath+"."+node.propertyOwner+"."+node._joinProperty(".");
			nodesDic[fullPath]=node;
			node.fullPath=fullPath;
			var keyframeCount=reader.getUint16();
			node._setKeyframeCount(keyframeCount);
			var startTime=NaN;
			switch (type){
				case 0:
					break ;
				case 1:
				case 3:
				case 4:
					node.data=new Float32Array(3);
					break ;
				case 2:
					node.data=new Float32Array(4);
					break ;
				default :
					throw "AnimationClipParser03:unknown type.";
				}
			for (j=0;j < keyframeCount;j++){
				switch (type){
					case 0:;
						var floatKeyframe=new FloatKeyframe();
						node._setKeyframeByIndex(j,floatKeyframe);
						startTime=floatKeyframe.time=startTimeTypes[reader.getUint16()];
						floatKeyframe.inTangent=reader.getFloat32();
						floatKeyframe.outTangent=reader.getFloat32();
						floatKeyframe.value=reader.getFloat32();
						break ;
					case 1:
					case 3:
					case 4:;
						var floatArrayKeyframe=new FloatArrayKeyframe();
						node._setKeyframeByIndex(j,floatArrayKeyframe);
						startTime=floatArrayKeyframe.time=startTimeTypes[reader.getUint16()];
						var data=floatArrayKeyframe.data=new Float32Array(3 *3);
						for (var k=0;k < 3;k++)
						data[k]=reader.getFloat32();
						for (k=0;k < 3;k++)
						data[3+k]=reader.getFloat32();
						for (k=0;k < 3;k++)
						data[6+k]=reader.getFloat32();
						break ;
					case 2:
						floatArrayKeyframe=new FloatArrayKeyframe();
						node._setKeyframeByIndex(j,floatArrayKeyframe);
						startTime=floatArrayKeyframe.time=startTimeTypes[reader.getUint16()];
						data=floatArrayKeyframe.data=new Float32Array(3 *4);
						for (k=0;k < 4;k++)
						data[k]=reader.getFloat32();
						for (k=0;k < 4;k++)
						data[4+k]=reader.getFloat32();
						for (k=0;k < 4;k++)
						data[8+k]=reader.getFloat32();
						break ;
					default :
						throw "AnimationClipParser03:unknown type.";
					}
			}
		};
		var eventCount=reader.getUint16();
		for (i=0;i < eventCount;i++){
			var event=new AnimationEvent();
			event.time=reader.getFloat32();
			event.eventName=AnimationClipParser03._strings[reader.getUint16()];
			var params;
			var paramCount=reader.getUint16();
			(paramCount > 0)&& (event.params=params=[]);
			for (j=0;j < paramCount;j++){
				var eventType=reader.getByte();
				switch (eventType){
					case 0:
						params.push(!!reader.getByte());
						break ;
					case 1:
						params.push(reader.getInt32());
						break ;
					case 2:
						params.push(reader.getFloat32());
						break ;
					case 3:
						params.push(AnimationClipParser03._strings[reader.getUint16()]);
						break ;
					default :
						throw new Error("unknown type.");
					}
			}
			clip.addEvent(event);
		}
	}

	AnimationClipParser03._animationClip=null;
	AnimationClipParser03._reader=null;
	AnimationClipParser03._strings=[];
	__static(AnimationClipParser03,
	['_BLOCK',function(){return this._BLOCK={count:0};},'_DATA',function(){return this._DATA={offset:0,size:0};}
	]);
	return AnimationClipParser03;
})()


/**

*/
*/
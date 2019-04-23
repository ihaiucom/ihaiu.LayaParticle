/**
*<code>Utils3D</code> 类用于创建3D工具。
*/
//class laya.d3.utils.Utils3D
var Utils3D=(function(){
	function Utils3D(){}
	__class(Utils3D,'laya.d3.utils.Utils3D');
	Utils3D._convertToLayaVec3=function(bVector,out,inverseX){
		var outE=out.elements;
		outE[0]=inverseX ?-bVector.x():bVector.x();
		outE[1]=bVector.y();
		outE[2]=bVector.z();
	}

	Utils3D._convertToBulletVec3=function(lVector,out,inverseX){
		var lVectorE=lVector.elements;
		out.setValue(inverseX ?-lVectorE[0] :lVectorE[0],lVectorE[1],lVectorE[2]);
	}

	Utils3D._rotationTransformScaleSkinAnimation=function(tx,ty,tz,qx,qy,qz,qw,sx,sy,sz,outArray,outOffset){
		var re=Utils3D._tempArray16_0;
		var se=Utils3D._tempArray16_1;
		var tse=Utils3D._tempArray16_2;
		var x2=qx+qx;
		var y2=qy+qy;
		var z2=qz+qz;
		var xx=qx *x2;
		var yx=qy *x2;
		var yy=qy *y2;
		var zx=qz *x2;
		var zy=qz *y2;
		var zz=qz *z2;
		var wx=qw *x2;
		var wy=qw *y2;
		var wz=qw *z2;
		re[15]=1;
		re[0]=1-yy-zz;
		re[1]=yx+wz;
		re[2]=zx-wy;
		re[4]=yx-wz;
		re[5]=1-xx-zz;
		re[6]=zy+wx;
		re[8]=zx+wy;
		re[9]=zy-wx;
		re[10]=1-xx-yy;
		se[15]=1;
		se[0]=sx;
		se[5]=sy;
		se[10]=sz;
		var i,a,b,e,ai0,ai1,ai2,ai3;
		for (i=0;i < 4;i++){
			ai0=re[i];
			ai1=re[i+4];
			ai2=re[i+8];
			ai3=re[i+12];
			tse[i]=ai0;
			tse[i+4]=ai1;
			tse[i+8]=ai2;
			tse[i+12]=ai0 *tx+ai1 *ty+ai2 *tz+ai3;
		}
		for (i=0;i < 4;i++){
			ai0=tse[i];
			ai1=tse[i+4];
			ai2=tse[i+8];
			ai3=tse[i+12];
			outArray[i+outOffset]=ai0 *se[0]+ai1 *se[1]+ai2 *se[2]+ai3 *se[3];
			outArray[i+outOffset+4]=ai0 *se[4]+ai1 *se[5]+ai2 *se[6]+ai3 *se[7];
			outArray[i+outOffset+8]=ai0 *se[8]+ai1 *se[9]+ai2 *se[10]+ai3 *se[11];
			outArray[i+outOffset+12]=ai0 *se[12]+ai1 *se[13]+ai2 *se[14]+ai3 *se[15];
		}
	}

	Utils3D._createSceneByJsonForMaker=function(nodeData,outBatchSprites,initTool){
		var scene3d=Utils3D._createNodeByJsonForMaker(nodeData,outBatchSprites,initTool);
		Utils3D._addComponentByJsonForMaker(nodeData,outBatchSprites,initTool);
		return scene3d;
	}

	Utils3D._createNodeByJsonForMaker=function(nodeData,outBatchSprites,initTool){
		var node;
		switch (nodeData.type){
			case "Scene3D":
				node=new Scene3D();
				break ;
			case "Sprite3D":
				node=new Sprite3D();
				break ;
			case "MeshSprite3D":
				node=new MeshSprite3D();
				(outBatchSprites)&& (outBatchSprites.push(node));
				break ;
			case "SkinnedMeshSprite3D":
				node=new SkinnedMeshSprite3D();
				break ;
			case "ShuriKenParticle3D":
				node=new ShuriKenParticle3D();
				break ;
			case "Terrain":
				node=new Terrain();
				break ;
			case "Camera":
				node=new Camera();
				break ;
			case "DirectionLight":
				node=new DirectionLight();
				break ;
			case "PointLight":
				node=new PointLight();
				break ;
			case "SpotLight":
				node=new SpotLight();
				break ;
			case "TrailSprite3D":
				node=new TrailSprite3D();
				break ;
			default :;
				var clas=ClassUtils.getClass(nodeData.props.runtime);
				node=new clas();
				break ;
			};
		var childData=nodeData.child;
		if (childData){
			for (var i=0,n=childData.length;i < n;i++){
				var child=Utils3D._createNodeByJsonForMaker(childData[i],outBatchSprites,initTool);
				node.addChild(child);
			}
		};
		var compId=nodeData.compId;
		(node).compId=compId;
		node._parse(nodeData.props);
		if (initTool){
			initTool._idMap[compId]=node;
		}
		Utils3D._compIdToNode[compId]=node;
		var componentsData=nodeData.components;
		if (componentsData){
			for (var j=0,m=componentsData.length;j < m;j++){
				var data=componentsData[j];
				clas=Browser.window.Laya[data.type];
				if (!clas){
					clas=Browser.window;
					var clasPaths=data.type.split('.');
					clasPaths.forEach(function(cls){
						clas=clas[cls];
					});
				}
				if (typeof(clas)=='function'){
					var comp=new clas();
					if (initTool){
						initTool._idMap[data.compId]=comp;
						console.log(data.compId);
					}
					}else {
					console.warn("Utils3D:Unkown component type.");
				}
			}
		}
		return node;
	}

	Utils3D._addComponentByJsonForMaker=function(nodeData,outBatchSprites,initTool){
		var compId=nodeData.compId;
		var node=Utils3D._compIdToNode[compId];
		var childData=nodeData.child;
		if (childData){
			for (var i=0,n=childData.length;i < n;i++){
				var child=Utils3D._addComponentByJsonForMaker(childData[i],outBatchSprites,initTool);
			}
		};
		var componentsData=nodeData.components;
		if (componentsData){
			for (var j=0,m=componentsData.length;j < m;j++){
				var data=componentsData[j];
				clas=Browser.window.Laya[data.type];
				if (!clas){
					var clasPaths=data.type.split('.');
					var clas=Browser.window;
					clasPaths.forEach(function(cls){
						clas=clas[cls];
					});
				}
				if (typeof(clas)=='function'){
					var component=initTool._idMap[data.compId];
					node.addComponentIntance(component);
					component._parse(data);
					}else {
					console.warn("Utils3D:Unkown component type.");
				}
			}
		}
	}

	Utils3D._createNodeByJson=function(nodeData,outBatchSprites){
		var node;
		switch (nodeData.type){
			case "Scene3D":
				node=new Scene3D();
				break ;
			case "Sprite3D":
				node=new Sprite3D();
				break ;
			case "MeshSprite3D":
				node=new MeshSprite3D();
				(outBatchSprites)&& (outBatchSprites.push(node));
				break ;
			case "SkinnedMeshSprite3D":
				node=new SkinnedMeshSprite3D();
				break ;
			case "ShuriKenParticle3D":
				node=new ShuriKenParticle3D();
				break ;
			case "Terrain":
				node=new Terrain();
				break ;
			case "Camera":
				node=new Camera();
				break ;
			case "DirectionLight":
				node=new DirectionLight();
				break ;
			case "PointLight":
				node=new PointLight();
				break ;
			case "SpotLight":
				node=new SpotLight();
				break ;
			case "TrailSprite3D":
				node=new TrailSprite3D();
				break ;
			default :
				throw new Error("Utils3D:unidentified class type in (.lh) file.");
			};
		var childData=nodeData.child;
		if (childData){
			for (var i=0,n=childData.length;i < n;i++){
				var child=Utils3D._createNodeByJson(childData[i],outBatchSprites)
				node.addChild(child);
			}
		};
		var componentsData=nodeData.components;
		if (componentsData){
			for (var j=0,m=componentsData.length;j < m;j++){
				var data=componentsData[j];
				clas=Browser.window.Laya[data.type];
				if (!clas){
					var clasPaths=data.type.split('.');
					var clas=Browser.window;
					clasPaths.forEach(function(cls){
						clas=clas[cls];
					});
				}
				if (typeof(clas)=='function'){
					var component=node.addComponent(clas);
					component._parse(data);
					}else {
					console.warn("Unkown component type.");
				}
			}
		}
		node._parse(nodeData.props);
		return node;
	}

	Utils3D._computeBoneAndAnimationDatasByBindPoseMatrxix=function(bones,curData,inverGlobalBindPose,outBonesDatas,outAnimationDatas,boneIndexToMesh){
		var offset=0;
		var matOffset=0;
		var i;
		var parentOffset;
		var boneLength=bones.length;
		for (i=0;i < boneLength;offset+=bones[i].keyframeWidth,matOffset+=16,i++){
			laya.d3.utils.Utils3D._rotationTransformScaleSkinAnimation(curData[offset+0],curData[offset+1],curData[offset+2],curData[offset+3],curData[offset+4],curData[offset+5],curData[offset+6],curData[offset+7],curData[offset+8],curData[offset+9],outBonesDatas,matOffset);
			if (i !=0){
				parentOffset=bones[i].parentIndex *16;
				laya.d3.utils.Utils3D.mulMatrixByArray(outBonesDatas,parentOffset,outBonesDatas,matOffset,outBonesDatas,matOffset);
			}
		};
		var n=inverGlobalBindPose.length;
		for (i=0;i < n;i++){
			laya.d3.utils.Utils3D.mulMatrixByArrayAndMatrixFast(outBonesDatas,boneIndexToMesh[i] *16,inverGlobalBindPose[i],outAnimationDatas,i *16);
		}
	}

	Utils3D._computeAnimationDatasByArrayAndMatrixFast=function(inverGlobalBindPose,bonesDatas,outAnimationDatas,boneIndexToMesh){
		for (var i=0,n=inverGlobalBindPose.length;i < n;i++)
		laya.d3.utils.Utils3D.mulMatrixByArrayAndMatrixFast(bonesDatas,boneIndexToMesh[i] *16,inverGlobalBindPose[i],outAnimationDatas,i *16);
	}

	Utils3D._computeBoneAndAnimationDatasByBindPoseMatrxixOld=function(bones,curData,inverGlobalBindPose,outBonesDatas,outAnimationDatas){
		var offset=0;
		var matOffset=0;
		var i;
		var parentOffset;
		var boneLength=bones.length;
		for (i=0;i < boneLength;offset+=bones[i].keyframeWidth,matOffset+=16,i++){
			laya.d3.utils.Utils3D._rotationTransformScaleSkinAnimation(curData[offset+7],curData[offset+8],curData[offset+9],curData[offset+3],curData[offset+4],curData[offset+5],curData[offset+6],curData[offset+0],curData[offset+1],curData[offset+2],outBonesDatas,matOffset);
			if (i !=0){
				parentOffset=bones[i].parentIndex *16;
				laya.d3.utils.Utils3D.mulMatrixByArray(outBonesDatas,parentOffset,outBonesDatas,matOffset,outBonesDatas,matOffset);
			}
		};
		var n=inverGlobalBindPose.length;
		for (i=0;i < n;i++){
			var arrayOffset=i *16;
			laya.d3.utils.Utils3D.mulMatrixByArrayAndMatrixFast(outBonesDatas,arrayOffset,inverGlobalBindPose[i],outAnimationDatas,arrayOffset);
		}
	}

	Utils3D._computeAnimationDatasByArrayAndMatrixFastOld=function(inverGlobalBindPose,bonesDatas,outAnimationDatas){
		var n=inverGlobalBindPose.length;
		for (var i=0;i < n;i++){
			var arrayOffset=i *16;
			laya.d3.utils.Utils3D.mulMatrixByArrayAndMatrixFast(bonesDatas,arrayOffset,inverGlobalBindPose[i],outAnimationDatas,arrayOffset);
		}
	}

	Utils3D._computeRootAnimationData=function(bones,curData,animationDatas){
		for (var i=0,offset=0,matOffset=0,boneLength=bones.length;i < boneLength;offset+=bones[i].keyframeWidth,matOffset+=16,i++)
		laya.d3.utils.Utils3D.createAffineTransformationArray(curData[offset+0],curData[offset+1],curData[offset+2],curData[offset+3],curData[offset+4],curData[offset+5],curData[offset+6],curData[offset+7],curData[offset+8],curData[offset+9],animationDatas,matOffset);
	}

	Utils3D.transformVector3ArrayByQuat=function(sourceArray,sourceOffset,rotation,outArray,outOffset){
		var re=rotation.elements;
		var x=sourceArray[sourceOffset],y=sourceArray[sourceOffset+1],z=sourceArray[sourceOffset+2],qx=re[0],qy=re[1],qz=re[2],qw=re[3],ix=qw *x+qy *z-qz *y,iy=qw *y+qz *x-qx *z,iz=qw *z+qx *y-qy *x,iw=-qx *x-qy *y-qz *z;
		outArray[outOffset]=ix *qw+iw *-qx+iy *-qz-iz *-qy;
		outArray[outOffset+1]=iy *qw+iw *-qy+iz *-qx-ix *-qz;
		outArray[outOffset+2]=iz *qw+iw *-qz+ix *-qy-iy *-qx;
	}

	Utils3D.mulMatrixByArray=function(leftArray,leftOffset,rightArray,rightOffset,outArray,outOffset){
		var i,ai0,ai1,ai2,ai3;
		if (outArray===rightArray){
			rightArray=Utils3D._tempArray16_3;
			for (i=0;i < 16;++i){
				rightArray[i]=outArray[outOffset+i];
			}
			rightOffset=0;
		}
		for (i=0;i < 4;i++){
			ai0=leftArray[leftOffset+i];
			ai1=leftArray[leftOffset+i+4];
			ai2=leftArray[leftOffset+i+8];
			ai3=leftArray[leftOffset+i+12];
			outArray[outOffset+i]=ai0 *rightArray[rightOffset+0]+ai1 *rightArray[rightOffset+1]+ai2 *rightArray[rightOffset+2]+ai3 *rightArray[rightOffset+3];
			outArray[outOffset+i+4]=ai0 *rightArray[rightOffset+4]+ai1 *rightArray[rightOffset+5]+ai2 *rightArray[rightOffset+6]+ai3 *rightArray[rightOffset+7];
			outArray[outOffset+i+8]=ai0 *rightArray[rightOffset+8]+ai1 *rightArray[rightOffset+9]+ai2 *rightArray[rightOffset+10]+ai3 *rightArray[rightOffset+11];
			outArray[outOffset+i+12]=ai0 *rightArray[rightOffset+12]+ai1 *rightArray[rightOffset+13]+ai2 *rightArray[rightOffset+14]+ai3 *rightArray[rightOffset+15];
		}
	}

	Utils3D.mulMatrixByArrayFast=function(leftArray,leftOffset,rightArray,rightOffset,outArray,outOffset){
		var i,ai0,ai1,ai2,ai3;
		for (i=0;i < 4;i++){
			ai0=leftArray[leftOffset+i];
			ai1=leftArray[leftOffset+i+4];
			ai2=leftArray[leftOffset+i+8];
			ai3=leftArray[leftOffset+i+12];
			outArray[outOffset+i]=ai0 *rightArray[rightOffset+0]+ai1 *rightArray[rightOffset+1]+ai2 *rightArray[rightOffset+2]+ai3 *rightArray[rightOffset+3];
			outArray[outOffset+i+4]=ai0 *rightArray[rightOffset+4]+ai1 *rightArray[rightOffset+5]+ai2 *rightArray[rightOffset+6]+ai3 *rightArray[rightOffset+7];
			outArray[outOffset+i+8]=ai0 *rightArray[rightOffset+8]+ai1 *rightArray[rightOffset+9]+ai2 *rightArray[rightOffset+10]+ai3 *rightArray[rightOffset+11];
			outArray[outOffset+i+12]=ai0 *rightArray[rightOffset+12]+ai1 *rightArray[rightOffset+13]+ai2 *rightArray[rightOffset+14]+ai3 *rightArray[rightOffset+15];
		}
	}

	Utils3D.mulMatrixByArrayAndMatrixFast=function(leftArray,leftOffset,rightMatrix,outArray,outOffset){
		var i,ai0,ai1,ai2,ai3;
		var rightMatrixE=rightMatrix.elements;
		var m11=rightMatrixE[0],m12=rightMatrixE[1],m13=rightMatrixE[2],m14=rightMatrixE[3];
		var m21=rightMatrixE[4],m22=rightMatrixE[5],m23=rightMatrixE[6],m24=rightMatrixE[7];
		var m31=rightMatrixE[8],m32=rightMatrixE[9],m33=rightMatrixE[10],m34=rightMatrixE[11];
		var m41=rightMatrixE[12],m42=rightMatrixE[13],m43=rightMatrixE[14],m44=rightMatrixE[15];
		var ai0LeftOffset=leftOffset;
		var ai1LeftOffset=leftOffset+4;
		var ai2LeftOffset=leftOffset+8;
		var ai3LeftOffset=leftOffset+12;
		var ai0OutOffset=outOffset;
		var ai1OutOffset=outOffset+4;
		var ai2OutOffset=outOffset+8;
		var ai3OutOffset=outOffset+12;
		for (i=0;i < 4;i++){
			ai0=leftArray[ai0LeftOffset+i];
			ai1=leftArray[ai1LeftOffset+i];
			ai2=leftArray[ai2LeftOffset+i];
			ai3=leftArray[ai3LeftOffset+i];
			outArray[ai0OutOffset+i]=ai0 *m11+ai1 *m12+ai2 *m13+ai3 *m14;
			outArray[ai1OutOffset+i]=ai0 *m21+ai1 *m22+ai2 *m23+ai3 *m24;
			outArray[ai2OutOffset+i]=ai0 *m31+ai1 *m32+ai2 *m33+ai3 *m34;
			outArray[ai3OutOffset+i]=ai0 *m41+ai1 *m42+ai2 *m43+ai3 *m44;
		}
	}

	Utils3D.createAffineTransformationArray=function(tX,tY,tZ,rX,rY,rZ,rW,sX,sY,sZ,outArray,outOffset){
		var x2=rX+rX,y2=rY+rY,z2=rZ+rZ;
		var xx=rX *x2,xy=rX *y2,xz=rX *z2,yy=rY *y2,yz=rY *z2,zz=rZ *z2;
		var wx=rW *x2,wy=rW *y2,wz=rW *z2;
		outArray[outOffset+0]=(1-(yy+zz))*sX;
		outArray[outOffset+1]=(xy+wz)*sX;
		outArray[outOffset+2]=(xz-wy)*sX;
		outArray[outOffset+3]=0;
		outArray[outOffset+4]=(xy-wz)*sY;
		outArray[outOffset+5]=(1-(xx+zz))*sY;
		outArray[outOffset+6]=(yz+wx)*sY;
		outArray[outOffset+7]=0;
		outArray[outOffset+8]=(xz+wy)*sZ;
		outArray[outOffset+9]=(yz-wx)*sZ;
		outArray[outOffset+10]=(1-(xx+yy))*sZ;
		outArray[outOffset+11]=0;
		outArray[outOffset+12]=tX;
		outArray[outOffset+13]=tY;
		outArray[outOffset+14]=tZ;
		outArray[outOffset+15]=1;
	}

	Utils3D.transformVector3ArrayToVector3ArrayCoordinate=function(source,sourceOffset,transform,result,resultOffset){
		var coordinateX=source[sourceOffset+0];
		var coordinateY=source[sourceOffset+1];
		var coordinateZ=source[sourceOffset+2];
		var transformElem=transform.elements;
		var w=((coordinateX *transformElem[3])+(coordinateY *transformElem[7])+(coordinateZ *transformElem[11])+transformElem[15]);
		result[resultOffset]=(coordinateX *transformElem[0])+(coordinateY *transformElem[4])+(coordinateZ *transformElem[8])+transformElem[12] / w;
		result[resultOffset+1]=(coordinateX *transformElem[1])+(coordinateY *transformElem[5])+(coordinateZ *transformElem[9])+transformElem[13] / w;
		result[resultOffset+2]=(coordinateX *transformElem[2])+(coordinateY *transformElem[6])+(coordinateZ *transformElem[10])+transformElem[14] / w;
	}

	Utils3D.transformLightingMapTexcoordArray=function(source,sourceOffset,lightingMapScaleOffset,result,resultOffset){
		var lightingMapScaleOffsetE=lightingMapScaleOffset.elements;
		result[resultOffset+0]=source[sourceOffset+0] *lightingMapScaleOffsetE[0]+lightingMapScaleOffsetE[2];
		result[resultOffset+1]=1.0-((1.0-source[sourceOffset+1])*lightingMapScaleOffsetE[1]+lightingMapScaleOffsetE[3]);
	}

	Utils3D.getURLVerion=function(url){
		var index=url.indexOf("?");
		return index >=0 ? url.substr(index):null;
	}

	Utils3D._quaternionCreateFromYawPitchRollArray=function(yaw,pitch,roll,out){
		var halfRoll=roll *0.5;
		var halfPitch=pitch *0.5;
		var halfYaw=yaw *0.5;
		var sinRoll=Math.sin(halfRoll);
		var cosRoll=Math.cos(halfRoll);
		var sinPitch=Math.sin(halfPitch);
		var cosPitch=Math.cos(halfPitch);
		var sinYaw=Math.sin(halfYaw);
		var cosYaw=Math.cos(halfYaw);
		out[0]=(cosYaw *sinPitch *cosRoll)+(sinYaw *cosPitch *sinRoll);
		out[1]=(sinYaw *cosPitch *cosRoll)-(cosYaw *sinPitch *sinRoll);
		out[2]=(cosYaw *cosPitch *sinRoll)-(sinYaw *sinPitch *cosRoll);
		out[3]=(cosYaw *cosPitch *cosRoll)+(sinYaw *sinPitch *sinRoll);
	}

	Utils3D._createAffineTransformationArray=function(trans,rot,scale,outE){
		var x=rot[0],y=rot[1],z=rot[2],w=rot[3],x2=x+x,y2=y+y,z2=z+z;
		var xx=x *x2,xy=x *y2,xz=x *z2,yy=y *y2,yz=y *z2,zz=z *z2;
		var wx=w *x2,wy=w *y2,wz=w *z2,sx=scale[0],sy=scale[1],sz=scale[2];
		outE[0]=(1-(yy+zz))*sx;
		outE[1]=(xy+wz)*sx;
		outE[2]=(xz-wy)*sx;
		outE[3]=0;
		outE[4]=(xy-wz)*sy;
		outE[5]=(1-(xx+zz))*sy;
		outE[6]=(yz+wx)*sy;
		outE[7]=0;
		outE[8]=(xz+wy)*sz;
		outE[9]=(yz-wx)*sz;
		outE[10]=(1-(xx+yy))*sz;
		outE[11]=0;
		outE[12]=trans[0];
		outE[13]=trans[1];
		outE[14]=trans[2];
		outE[15]=1;
	}

	Utils3D._mulMatrixArray=function(leftMatrixE,rightMatrix,outArray,outOffset){
		var i,ai0,ai1,ai2,ai3;
		var rightMatrixE=rightMatrix.elements;
		var m11=rightMatrixE[0],m12=rightMatrixE[1],m13=rightMatrixE[2],m14=rightMatrixE[3];
		var m21=rightMatrixE[4],m22=rightMatrixE[5],m23=rightMatrixE[6],m24=rightMatrixE[7];
		var m31=rightMatrixE[8],m32=rightMatrixE[9],m33=rightMatrixE[10],m34=rightMatrixE[11];
		var m41=rightMatrixE[12],m42=rightMatrixE[13],m43=rightMatrixE[14],m44=rightMatrixE[15];
		var ai0OutOffset=outOffset;
		var ai1OutOffset=outOffset+4;
		var ai2OutOffset=outOffset+8;
		var ai3OutOffset=outOffset+12;
		for (i=0;i < 4;i++){
			ai0=leftMatrixE[i];
			ai1=leftMatrixE[i+4];
			ai2=leftMatrixE[i+8];
			ai3=leftMatrixE[i+12];
			outArray[ai0OutOffset+i]=ai0 *m11+ai1 *m12+ai2 *m13+ai3 *m14;
			outArray[ai1OutOffset+i]=ai0 *m21+ai1 *m22+ai2 *m23+ai3 *m24;
			outArray[ai2OutOffset+i]=ai0 *m31+ai1 *m32+ai2 *m33+ai3 *m34;
			outArray[ai3OutOffset+i]=ai0 *m41+ai1 *m42+ai2 *m43+ai3 *m44;
		}
	}

	Utils3D.getYawPitchRoll=function(quaternion,out){
		Utils3D.transformQuat(Vector3.ForwardRH,quaternion,Quaternion.TEMPVector31);
		Utils3D.transformQuat(Vector3.Up,quaternion,Quaternion.TEMPVector32);
		var upe=Quaternion.TEMPVector32.elements;
		Utils3D.angleTo(Vector3.ZERO,Quaternion.TEMPVector31,Quaternion.TEMPVector33);
		var anglee=Quaternion.TEMPVector33.elements;
		if (anglee[0]==Math.PI / 2){
			anglee[1]=Utils3D.arcTanAngle(upe[2],upe[0]);
			anglee[2]=0;
			}else if (anglee[0]==-Math.PI / 2){
			anglee[1]=Utils3D.arcTanAngle(-upe[2],-upe[0]);
			anglee[2]=0;
			}else {
			Matrix4x4.createRotationY(-anglee[1],Quaternion.TEMPMatrix0);
			Matrix4x4.createRotationX(-anglee[0],Quaternion.TEMPMatrix1);
			Vector3.transformCoordinate(Quaternion.TEMPVector32,Quaternion.TEMPMatrix0,Quaternion.TEMPVector32);
			Vector3.transformCoordinate(Quaternion.TEMPVector32,Quaternion.TEMPMatrix1,Quaternion.TEMPVector32);
			anglee[2]=Utils3D.arcTanAngle(upe[1],-upe[0]);
		}
		if (anglee[1] <=-Math.PI)
			anglee[1]=Math.PI;
		if (anglee[2] <=-Math.PI)
			anglee[2]=Math.PI;
		if (anglee[1] >=Math.PI && anglee[2] >=Math.PI){
			anglee[1]=0;
			anglee[2]=0;
			anglee[0]=Math.PI-anglee[0];
		}
		out[0]=anglee[1];
		out[1]=anglee[0];
		out[2]=anglee[2];
	}

	Utils3D.arcTanAngle=function(x,y){
		if (x==0){
			if (y==1)
				return Math.PI / 2;
			return-Math.PI / 2;
		}
		if (x > 0)
			return Math.atan(y / x);
		if (x < 0){
			if (y > 0)
				return Math.atan(y / x)+Math.PI;
			return Math.atan(y / x)-Math.PI;
		}
		return 0;
	}

	Utils3D.angleTo=function(from,location,angle){
		Vector3.subtract(location,from,Quaternion.TEMPVector30);
		Vector3.normalize(Quaternion.TEMPVector30,Quaternion.TEMPVector30);
		angle.elements[0]=Math.asin(Quaternion.TEMPVector30.y);
		angle.elements[1]=Utils3D.arcTanAngle(-Quaternion.TEMPVector30.z,-Quaternion.TEMPVector30.x);
	}

	Utils3D.transformQuat=function(source,rotation,out){
		var destination=out.elements;
		var se=source.elements;
		var re=rotation;
		var x=se[0],y=se[1],z=se[2],qx=re[0],qy=re[1],qz=re[2],qw=re[3],
		ix=qw *x+qy *z-qz *y,iy=qw *y+qz *x-qx *z,iz=qw *z+qx *y-qy *x,iw=-qx *x-qy *y-qz *z;
		destination[0]=ix *qw+iw *-qx+iy *-qz-iz *-qy;
		destination[1]=iy *qw+iw *-qy+iz *-qx-ix *-qz;
		destination[2]=iz *qw+iw *-qz+ix *-qy-iy *-qx;
	}

	Utils3D.quaterionNormalize=function(f,e){
		var x=f[0],y=f[1],z=f[2],w=f[3];
		var len=x *x+y *y+z *z+w *w;
		if (len > 0){
			len=1 / Math.sqrt(len);
			e[0]=x *len;
			e[1]=y *len;
			e[2]=z *len;
			e[3]=w *len;
		}
	}

	Utils3D.quaterionSlerp=function(left,right,t,out){
		var ax=left[0],ay=left[1],az=left[2],aw=left[3],bx=right[0],by=right[1],bz=right[2],bw=right[3];
		var omega,cosom,sinom,scale0,scale1;
		cosom=ax *bx+ay *by+az *bz+aw *bw;
		if (cosom < 0.0){
			cosom=-cosom;
			bx=-bx;
			by=-by;
			bz=-bz;
			bw=-bw;
		}
		if ((1.0-cosom)> 0.000001){
			omega=Math.acos(cosom);
			sinom=Math.sin(omega);
			scale0=Math.sin((1.0-t)*omega)/ sinom;
			scale1=Math.sin(t *omega)/ sinom;
			}else {
			scale0=1.0-t;
			scale1=t;
		}
		out[0]=scale0 *ax+scale1 *bx;
		out[1]=scale0 *ay+scale1 *by;
		out[2]=scale0 *az+scale1 *bz;
		out[3]=scale0 *aw+scale1 *bw;
	}

	Utils3D.quaternionMultiply=function(le,re,oe){
		var lx=le[0];
		var ly=le[1];
		var lz=le[2];
		var lw=le[3];
		var rx=re[0];
		var ry=re[1];
		var rz=re[2];
		var rw=re[3];
		var a=(ly *rz-lz *ry);
		var b=(lz *rx-lx *rz);
		var c=(lx *ry-ly *rx);
		var d=(lx *rx+ly *ry+lz *rz);
		oe[0]=(lx *rw+rx *lw)+a;
		oe[1]=(ly *rw+ry *lw)+b;
		oe[2]=(lz *rw+rz *lw)+c;
		oe[3]=lw *rw-d;
	}

	Utils3D.quaternionWeight=function(f,weight,e){
		e[0]=f[0] *weight;
		e[1]=f[1] *weight;
		e[2]=f[2] *weight;
		e[3]=f[3];
	}

	Utils3D.quaternionInvert=function(f,e){
		var a0=f[0],a1=f[1],a2=f[2],a3=f[3];
		var dot=a0 *a0+a1 *a1+a2 *a2+a3 *a3;
		var invDot=dot ? 1.0 / dot :0;
		e[0]=-a0 *invDot;
		e[1]=-a1 *invDot;
		e[2]=-a2 *invDot;
		e[3]=a3 *invDot;
	}

	Utils3D.quaternionConjugate=function(value,offset,result){
		result[0]=-value[offset];
		result[1]=-value[offset+1];
		result[2]=-value[offset+2];
		result[3]=value[offset+3];
	}

	Utils3D.scaleWeight=function(s,w,out){
		var sX=s[0],sY=s[1],sZ=s[2];
		out[0]=sX > 0 ? Math.pow(Math.abs(sX),w):-Math.pow(Math.abs(sX),w);
		out[1]=sY > 0 ? Math.pow(Math.abs(sY),w):-Math.pow(Math.abs(sY),w);
		out[2]=sZ > 0 ? Math.pow(Math.abs(sZ),w):-Math.pow(Math.abs(sZ),w);
	}

	Utils3D.scaleBlend=function(sa,sb,w,out){
		var saw=Utils3D._tempVector3Array0;
		var sbw=Utils3D._tempVector3Array1;
		Utils3D.scaleWeight(sa,1.0-w,saw);
		Utils3D.scaleWeight(sb,w,sbw);
		var sng=w > 0.5 ? sb :sa;
		out[0]=sng[0] > 0 ? Math.abs(saw[0] *sbw[0]):-Math.abs(saw[0] *sbw[0]);
		out[1]=sng[1] > 0 ? Math.abs(saw[1] *sbw[1]):-Math.abs(saw[1] *sbw[1]);
		out[2]=sng[2] > 0 ? Math.abs(saw[2] *sbw[2]):-Math.abs(saw[2] *sbw[2]);
	}

	Utils3D.matrix4x4MultiplyFFF=function(a,b,e){
		var i,ai0,ai1,ai2,ai3;
		if (e===b){
			b=new Float32Array(16);
			for (i=0;i < 16;++i){
				b[i]=e[i];
			}
		};
		var b0=b[0],b1=b[1],b2=b[2],b3=b[3];
		var b4=b[4],b5=b[5],b6=b[6],b7=b[7];
		var b8=b[8],b9=b[9],b10=b[10],b11=b[11];
		var b12=b[12],b13=b[13],b14=b[14],b15=b[15];
		for (i=0;i < 4;i++){
			ai0=a[i];
			ai1=a[i+4];
			ai2=a[i+8];
			ai3=a[i+12];
			e[i]=ai0 *b0+ai1 *b1+ai2 *b2+ai3 *b3;
			e[i+4]=ai0 *b4+ai1 *b5+ai2 *b6+ai3 *b7;
			e[i+8]=ai0 *b8+ai1 *b9+ai2 *b10+ai3 *b11;
			e[i+12]=ai0 *b12+ai1 *b13+ai2 *b14+ai3 *b15;
		}
	}

	Utils3D.matrix4x4MultiplyFFFForNative=function(a,b,e){
		LayaGL.instance.matrix4x4Multiply(a,b,e);
	}

	Utils3D.matrix4x4MultiplyMFM=function(left,right,out){
		Utils3D.matrix4x4MultiplyFFF(left.elements,right,out.elements);
	}

	Utils3D._buildTexture2D=function(width,height,format,colorFunc,mipmaps){
		(mipmaps===void 0)&& (mipmaps=false);
		var texture=new Texture2D(width,height,format,mipmaps,true);
		texture.anisoLevel=1;
		texture.filterMode=/*laya.webgl.resource.BaseTexture.FILTERMODE_POINT*/0;
		TextureGenerator._generateTexture2D(texture,width,height,colorFunc);
		return texture;
	}

	Utils3D._tempVector3Array0=new Float32Array(3);
	Utils3D._tempVector3Array1=new Float32Array(3);
	Utils3D._tempArray4_0=new Float32Array(4);
	Utils3D._tempArray16_0=new Float32Array(16);
	Utils3D._tempArray16_1=new Float32Array(16);
	Utils3D._tempArray16_2=new Float32Array(16);
	Utils3D._tempArray16_3=new Float32Array(16);
	__static(Utils3D,
	['_tempVector3_0',function(){return this._tempVector3_0=new Vector3();},'_tempVector3_1',function(){return this._tempVector3_1=new Vector3();},'_tempVector3_2',function(){return this._tempVector3_2=new Vector3();},'_tempVector3_3',function(){return this._tempVector3_3=new Vector3();},'_tempVector3_4',function(){return this._tempVector3_4=new Vector3();},'_tempVector3_5',function(){return this._tempVector3_5=new Vector3();},'_tempVector3_6',function(){return this._tempVector3_6=new Vector3();},'_compIdToNode',function(){return this._compIdToNode=new Object();}
	]);
	return Utils3D;
})()


/**

*/
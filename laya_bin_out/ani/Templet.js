//class laya.ani.bone.Templet extends laya.ani.AnimationTemplet
var Templet=(function(_super){
	function Templet(){
		this._mainTexture=null;
		this._textureJson=null;
		this._graphicsCache=[];
		/**存放原始骨骼信息 */
		this.srcBoneMatrixArr=[];
		/**IK数据 */
		this.ikArr=[];
		/**transform数据 */
		this.tfArr=[];
		/**path数据 */
		this.pathArr=[];
		/**存放插槽数据的字典 */
		this.boneSlotDic={};
		/**绑定插槽数据的字典 */
		this.bindBoneBoneSlotDic={};
		/**存放插糟数据的数组 */
		this.boneSlotArray=[];
		/**皮肤数据 */
		this.skinDataArray=[];
		/**皮肤的字典数据 */
		this.skinDic={};
		/**存放纹理数据 */
		this.subTextureDic={};
		/**是否解析失败 */
		this.isParseFail=false;
		/**反转矩阵，有些骨骼动画要反转才能显示 */
		this.yReverseMatrix=null;
		/**渲染顺序动画数据 */
		this.drawOrderAniArr=[];
		/**事件动画数据 */
		this.eventAniArr=[];
		/**@private 索引对应的名称 */
		this.attachmentNames=null;
		/**顶点动画数据 */
		this.deformAniArr=[];
		this._isDestroyed=false;
		this._rate=30;
		this.isParserComplete=false;
		this.aniSectionDic={};
		this._skBufferUrl=null;
		this._textureDic={};
		this._loadList=null;
		this._path=null;
		/**@private */
		this.tMatrixDataLen=0;
		this.mRootBone=null;
		Templet.__super.call(this);
		this.skinSlotDisplayDataArr=[];
		this.mBoneArr=[];
	}

	__class(Templet,'laya.ani.bone.Templet',_super);
	var __proto=Templet.prototype;
	__proto.loadAni=function(url){
		this._skBufferUrl=url;
		Laya.loader.load(url,Handler.create(this,this.onComplete),null,/*laya.net.Loader.BUFFER*/"arraybuffer");
	}

	__proto.onComplete=function(content){
		if (this._isDestroyed){
			this.destroy();
			return;
		};
		var tSkBuffer=Loader.getRes(this._skBufferUrl);
		if (!tSkBuffer){
			this.event(/*laya.events.Event.ERROR*/"error","load failed:"+this._skBufferUrl);
			return;
		}
		this._path=this._skBufferUrl.slice(0,this._skBufferUrl.lastIndexOf("/"))+"/";
		this.parseData(null,tSkBuffer);
	}

	/**
	*解析骨骼动画数据
	*@param texture 骨骼动画用到的纹理
	*@param skeletonData 骨骼动画信息及纹理分块信息
	*@param playbackRate 缓冲的帧率数据（会根据帧率去分帧）
	*/
	__proto.parseData=function(texture,skeletonData,playbackRate){
		(playbackRate===void 0)&& (playbackRate=30);
		if(!this._path&&this.url)this._path=this.url.slice(0,this.url.lastIndexOf("/"))+"/";
		this._mainTexture=texture;
		if (this._mainTexture){
			if (Render.isWebGL && texture.bitmap){
				texture.bitmap.enableMerageInAtlas=false;
			}
		}
		this._rate=playbackRate;
		this.parse(skeletonData);
	}

	/**
	*创建动画
	*0,使用模板缓冲的数据，模板缓冲的数据，不允许修改 （内存开销小，计算开销小，不支持换装）
	*1,使用动画自己的缓冲区，每个动画都会有自己的缓冲区，相当耗费内存 （内存开销大，计算开销小，支持换装）
	*2,使用动态方式，去实时去画 （内存开销小，计算开销大，支持换装,不建议使用）
	*@param aniMode 0 动画模式，0:不支持换装,1,2支持换装
	*@return
	*/
	__proto.buildArmature=function(aniMode){
		(aniMode===void 0)&& (aniMode=0);
		return new Skeleton(this,aniMode);
	}

	/**
	*@private
	*解析动画
	*@param data 解析的二进制数据
	*@param playbackRate 帧率
	*/
	__proto.parse=function(data){
		_super.prototype.parse.call(this,data);
		this.event(/*laya.events.Event.LOADED*/"loaded",this);
		if (this._aniVersion !=Templet.LAYA_ANIMATION_VISION){
			console.log("[Error] 版本不一致，请使用IDE版本配套的重新导出"+this._aniVersion+"->"+Templet.LAYA_ANIMATION_VISION);
		}
		if (this._mainTexture){
			this._parsePublicExtData();
			}else {
			this._parseTexturePath();
		}
	}

	//}
	__proto._parseTexturePath=function(){
		if (this._isDestroyed){
			this.destroy();
			return;
		};
		var i=0;
		this._loadList=[];
		var tByte=new Byte(this.getPublicExtData());
		var tX=0,tY=0,tWidth=0,tHeight=0;
		var tFrameX=0,tFrameY=0,tFrameWidth=0,tFrameHeight=0;
		var tTempleData=0;
		var tTextureLen=tByte.getInt32();
		var tTextureName=tByte.readUTFString();
		var tTextureNameArr=tTextureName.split("\n");
		var tTexture;
		var tSrcTexturePath;
		for (i=0;i < tTextureLen;i++){
			tSrcTexturePath=this._path+tTextureNameArr[i *2];
			tTextureName=tTextureNameArr[i *2+1];
			tX=tByte.getFloat32();
			tY=tByte.getFloat32();
			tWidth=tByte.getFloat32();
			tHeight=tByte.getFloat32();
			tTempleData=tByte.getFloat32();
			tFrameX=isNaN(tTempleData)? 0 :tTempleData;
			tTempleData=tByte.getFloat32();
			tFrameY=isNaN(tTempleData)? 0 :tTempleData;
			tTempleData=tByte.getFloat32();
			tFrameWidth=isNaN(tTempleData)? tWidth :tTempleData;
			tTempleData=tByte.getFloat32();
			tFrameHeight=isNaN(tTempleData)? tHeight :tTempleData;
			if (this._loadList.indexOf(tSrcTexturePath)==-1){
				this._loadList.push(tSrcTexturePath);
			}
		}
		Laya.loader.load(this._loadList,Handler.create(this,this._textureComplete));
	}

	/**
	*纹理加载完成
	*/
	__proto._textureComplete=function(){
		var tTexture;
		var tTextureName;
		for (var i=0,n=this._loadList.length;i < n;i++){
			tTextureName=this._loadList[i];
			tTexture=this._textureDic[tTextureName]=Loader.getRes(tTextureName);
			if (Render.isWebGL && tTexture && tTexture.bitmap){
				tTexture.bitmap.enableMerageInAtlas=false;
			}
		}
		this._parsePublicExtData();
	}

	/**
	*解析自定义数据
	*/
	__proto._parsePublicExtData=function(){
		var i=0,j=0,k=0,l=0,n=0;
		for (i=0,n=this.getAnimationCount();i < n;i++){
			this._graphicsCache.push([]);
		};
		var isSpine=false;
		isSpine=this._aniClassName !="Dragon";
		var tByte=new Byte(this.getPublicExtData());
		var tX=0,tY=0,tWidth=0,tHeight=0;
		var tFrameX=0,tFrameY=0,tFrameWidth=0,tFrameHeight=0;
		var tTempleData=0;
		var tTextureLen=tByte.getInt32();
		var tTextureName=tByte.readUTFString();
		var tTextureNameArr=tTextureName.split("\n");
		var tTexture;
		var tSrcTexturePath;
		for (i=0;i < tTextureLen;i++){
			tTexture=this._mainTexture;
			tSrcTexturePath=this._path+tTextureNameArr[i *2];
			tTextureName=tTextureNameArr[i *2+1];
			if (this._mainTexture==null){
				tTexture=this._textureDic[tSrcTexturePath];
			}
			if (!tTexture){
				this.event(/*laya.events.Event.ERROR*/"error",this);
				this.isParseFail=true;
				return;
			}
			tX=tByte.getFloat32();
			tY=tByte.getFloat32();
			tWidth=tByte.getFloat32();
			tHeight=tByte.getFloat32();
			tTempleData=tByte.getFloat32();
			tFrameX=isNaN(tTempleData)? 0 :tTempleData;
			tTempleData=tByte.getFloat32();
			tFrameY=isNaN(tTempleData)? 0 :tTempleData;
			tTempleData=tByte.getFloat32();
			tFrameWidth=isNaN(tTempleData)? tWidth :tTempleData;
			tTempleData=tByte.getFloat32();
			tFrameHeight=isNaN(tTempleData)? tHeight :tTempleData;
			this.subTextureDic[tTextureName]=Texture.create(tTexture,tX,tY,tWidth,tHeight,-tFrameX,-tFrameY,tFrameWidth,tFrameHeight);
		}
		this._mainTexture=tTexture;
		var tAniCount=tByte.getUint16();
		var tSectionArr;
		for (i=0;i < tAniCount;i++){
			tSectionArr=[];
			tSectionArr.push(tByte.getUint16());
			tSectionArr.push(tByte.getUint16());
			tSectionArr.push(tByte.getUint16());
			tSectionArr.push(tByte.getUint16());
			this.aniSectionDic[i]=tSectionArr;
		};
		var tBone;
		var tParentBone;
		var tName;
		var tParentName;
		var tBoneLen=tByte.getInt16();
		var tBoneDic={};
		var tRootBone;
		for (i=0;i < tBoneLen;i++){
			tBone=new Bone();
			if (i==0){
				tRootBone=tBone;
				}else {
				tBone.root=tRootBone;
			}
			tBone.d=isSpine?-1:1;
			tName=tByte.readUTFString();
			tParentName=tByte.readUTFString();
			tBone.length=tByte.getFloat32();
			if (tByte.getByte()==1){
				tBone.inheritRotation=false;
			}
			if (tByte.getByte()==1){
				tBone.inheritScale=false;
			}
			tBone.name=tName;
			if (tParentName){
				tParentBone=tBoneDic[tParentName];
				if (tParentBone){
					tParentBone.addChild(tBone);
					}else {
					this.mRootBone=tBone;
				}
			}
			tBoneDic[tName]=tBone;
			this.mBoneArr.push(tBone);
		}
		this.tMatrixDataLen=tByte.getUint16();
		var tLen=tByte.getUint16();
		var parentIndex=0;
		var boneLength=Math.floor(tLen / this.tMatrixDataLen);
		var tResultTransform;
		var tMatrixArray=this.srcBoneMatrixArr;
		for (i=0;i < boneLength;i++){
			tResultTransform=new Transform();
			tResultTransform.scX=tByte.getFloat32();
			tResultTransform.skX=tByte.getFloat32();
			tResultTransform.skY=tByte.getFloat32();
			tResultTransform.scY=tByte.getFloat32();
			tResultTransform.x=tByte.getFloat32();
			tResultTransform.y=tByte.getFloat32();
			if (this.tMatrixDataLen===8){
				tResultTransform.skewX=tByte.getFloat32();
				tResultTransform.skewY=tByte.getFloat32();
			}
			tMatrixArray.push(tResultTransform);
			tBone=this.mBoneArr[i];
			tBone.transform=tResultTransform;
		};
		var tIkConstraintData;
		var tIkLen=tByte.getUint16();
		var tIkBoneLen=0;
		for (i=0;i < tIkLen;i++){
			tIkConstraintData=new IkConstraintData();
			tIkBoneLen=tByte.getUint16();
			for (j=0;j < tIkBoneLen;j++){
				tIkConstraintData.boneNames.push(tByte.readUTFString());
				tIkConstraintData.boneIndexs.push(tByte.getInt16());
			}
			tIkConstraintData.name=tByte.readUTFString();
			tIkConstraintData.targetBoneName=tByte.readUTFString();
			tIkConstraintData.targetBoneIndex=tByte.getInt16();
			tIkConstraintData.bendDirection=tByte.getFloat32();
			tIkConstraintData.mix=tByte.getFloat32();
			tIkConstraintData.isSpine=isSpine;
			this.ikArr.push(tIkConstraintData);
		};
		var tTfConstraintData;
		var tTfLen=tByte.getUint16();
		var tTfBoneLen=0;
		for (i=0;i < tTfLen;i++){
			tTfConstraintData=new TfConstraintData();
			tTfBoneLen=tByte.getUint16();
			for (j=0;j < tTfBoneLen;j++){
				tTfConstraintData.boneIndexs.push(tByte.getInt16());
			}
			tTfConstraintData.name=tByte.getUTFString();
			tTfConstraintData.targetIndex=tByte.getInt16();
			tTfConstraintData.rotateMix=tByte.getFloat32();
			tTfConstraintData.translateMix=tByte.getFloat32();
			tTfConstraintData.scaleMix=tByte.getFloat32();
			tTfConstraintData.shearMix=tByte.getFloat32();
			tTfConstraintData.offsetRotation=tByte.getFloat32();
			tTfConstraintData.offsetX=tByte.getFloat32();
			tTfConstraintData.offsetY=tByte.getFloat32();
			tTfConstraintData.offsetScaleX=tByte.getFloat32();
			tTfConstraintData.offsetScaleY=tByte.getFloat32();
			tTfConstraintData.offsetShearY=tByte.getFloat32();
			this.tfArr.push(tTfConstraintData);
		};
		var tPathConstraintData;
		var tPathLen=tByte.getUint16();
		var tPathBoneLen=0;
		for (i=0;i < tPathLen;i++){
			tPathConstraintData=new PathConstraintData();
			tPathConstraintData.name=tByte.readUTFString();
			tPathBoneLen=tByte.getUint16();
			for (j=0;j < tPathBoneLen;j++){
				tPathConstraintData.bones.push(tByte.getInt16());
			}
			tPathConstraintData.target=tByte.readUTFString();
			tPathConstraintData.positionMode=tByte.readUTFString();
			tPathConstraintData.spacingMode=tByte.readUTFString();
			tPathConstraintData.rotateMode=tByte.readUTFString();
			tPathConstraintData.offsetRotation=tByte.getFloat32();
			tPathConstraintData.position=tByte.getFloat32();
			tPathConstraintData.spacing=tByte.getFloat32();
			tPathConstraintData.rotateMix=tByte.getFloat32();
			tPathConstraintData.translateMix=tByte.getFloat32();
			this.pathArr.push(tPathConstraintData);
		};
		var tDeformSlotLen=0;
		var tDeformSlotDisplayLen=0;
		var tDSlotIndex=0;
		var tDAttachment;
		var tDeformTimeLen=0;
		var tDTime=NaN;
		var tDeformVecticesLen=0;
		var tDeformAniData;
		var tDeformSlotData;
		var tDeformSlotDisplayData;
		var tDeformVectices;
		var tDeformAniLen=tByte.getInt16();
		for (i=0;i < tDeformAniLen;i++){
			var tDeformSkinLen=tByte.getUint8();
			var tSkinDic={};
			this.deformAniArr.push(tSkinDic);
			for (var f=0;f < tDeformSkinLen;f++){
				tDeformAniData=new DeformAniData();
				tDeformAniData.skinName=tByte.getUTFString();
				tSkinDic[tDeformAniData.skinName]=tDeformAniData;
				tDeformSlotLen=tByte.getInt16();
				for (j=0;j < tDeformSlotLen;j++){
					tDeformSlotData=new DeformSlotData();
					tDeformAniData.deformSlotDataList.push(tDeformSlotData);
					tDeformSlotDisplayLen=tByte.getInt16();
					for (k=0;k < tDeformSlotDisplayLen;k++){
						tDeformSlotDisplayData=new DeformSlotDisplayData();
						tDeformSlotData.deformSlotDisplayList.push(tDeformSlotDisplayData);
						tDeformSlotDisplayData.slotIndex=tDSlotIndex=tByte.getInt16();
						tDeformSlotDisplayData.attachment=tDAttachment=tByte.getUTFString();
						tDeformTimeLen=tByte.getInt16();
						for (l=0;l < tDeformTimeLen;l++){
							if (tByte.getByte()==1){
								tDeformSlotDisplayData.tweenKeyList.push(true);
								}else {
								tDeformSlotDisplayData.tweenKeyList.push(false);
							}
							tDTime=tByte.getFloat32();
							tDeformSlotDisplayData.timeList.push(tDTime);
							tDeformVectices=[];
							tDeformSlotDisplayData.vectices.push(tDeformVectices);
							tDeformVecticesLen=tByte.getInt16();
							for (n=0;n < tDeformVecticesLen;n++){
								tDeformVectices.push(tByte.getFloat32());
							}
						}
					}
				}
			}
		};
		var tDrawOrderArr;
		var tDrawOrderAniLen=tByte.getInt16();
		var tDrawOrderLen=0;
		var tDrawOrderData;
		var tDoLen=0;
		for (i=0;i < tDrawOrderAniLen;i++){
			tDrawOrderLen=tByte.getInt16();
			tDrawOrderArr=[];
			for (j=0;j < tDrawOrderLen;j++){
				tDrawOrderData=new DrawOrderData();
				tDrawOrderData.time=tByte.getFloat32();
				tDoLen=tByte.getInt16();
				for (k=0;k < tDoLen;k++){
					tDrawOrderData.drawOrder.push(tByte.getInt16());
				}
				tDrawOrderArr.push(tDrawOrderData);
			}
			this.drawOrderAniArr.push(tDrawOrderArr);
		};
		var tEventArr;
		var tEventAniLen=tByte.getInt16();
		var tEventLen=0;
		var tEventData;
		for (i=0;i < tEventAniLen;i++){
			tEventLen=tByte.getInt16();
			tEventArr=[];
			for (j=0;j < tEventLen;j++){
				tEventData=new EventData();
				tEventData.name=tByte.getUTFString();
				tEventData.intValue=tByte.getInt32();
				tEventData.floatValue=tByte.getFloat32();
				tEventData.stringValue=tByte.getUTFString();
				tEventData.time=tByte.getFloat32();
				tEventArr.push(tEventData);
			}
			this.eventAniArr.push(tEventArr);
		};
		var tAttachmentLen=tByte.getInt16();
		if (tAttachmentLen > 0){
			this.attachmentNames=[];
			for (i=0;i < tAttachmentLen;i++){
				this.attachmentNames.push(tByte.getUTFString());
			}
		};
		var tBoneSlotLen=tByte.getInt16();
		var tDBBoneSlot;
		var tDBBoneSlotArr;
		for (i=0;i < tBoneSlotLen;i++){
			tDBBoneSlot=new BoneSlot();
			tDBBoneSlot.name=tByte.readUTFString();
			tDBBoneSlot.parent=tByte.readUTFString();
			tDBBoneSlot.attachmentName=tByte.readUTFString();
			tDBBoneSlot.srcDisplayIndex=tDBBoneSlot.displayIndex=tByte.getInt16();
			tDBBoneSlot.templet=this;
			this.boneSlotDic[tDBBoneSlot.name]=tDBBoneSlot;
			tDBBoneSlotArr=this.bindBoneBoneSlotDic[tDBBoneSlot.parent];
			if (tDBBoneSlotArr==null){
				this.bindBoneBoneSlotDic[tDBBoneSlot.parent]=tDBBoneSlotArr=[];
			}
			tDBBoneSlotArr.push(tDBBoneSlot);
			this.boneSlotArray.push(tDBBoneSlot);
		};
		var tNameString=tByte.readUTFString();
		var tNameArray=tNameString.split("\n");
		var tNameStartIndex=0;
		var tSkinDataLen=tByte.getUint8();
		var tSkinData,tSlotData,tDisplayData;
		var tSlotDataLen=0,tDisplayDataLen=0;
		var tUvLen=0,tWeightLen=0,tTriangleLen=0,tVerticeLen=0,tLengthLen=0;
		for (i=0;i < tSkinDataLen;i++){
			tSkinData=new SkinData();
			tSkinData.name=tNameArray[tNameStartIndex++];
			tSlotDataLen=tByte.getUint8();
			for (j=0;j < tSlotDataLen;j++){
				tSlotData=new SlotData();
				tSlotData.name=tNameArray[tNameStartIndex++];
				tDBBoneSlot=this.boneSlotDic[tSlotData.name];
				tDisplayDataLen=tByte.getUint8();
				for (k=0;k < tDisplayDataLen;k++){
					tDisplayData=new SkinSlotDisplayData();
					this.skinSlotDisplayDataArr.push(tDisplayData);
					tDisplayData.name=tNameArray[tNameStartIndex++];
					tDisplayData.attachmentName=tNameArray[tNameStartIndex++];
					tDisplayData.transform=new Transform();
					tDisplayData.transform.scX=tByte.getFloat32();
					tDisplayData.transform.skX=tByte.getFloat32();
					tDisplayData.transform.skY=tByte.getFloat32();
					tDisplayData.transform.scY=tByte.getFloat32();
					tDisplayData.transform.x=tByte.getFloat32();
					tDisplayData.transform.y=tByte.getFloat32();
					tSlotData.displayArr.push(tDisplayData);
					tDisplayData.width=tByte.getFloat32();
					tDisplayData.height=tByte.getFloat32();
					tDisplayData.type=tByte.getUint8();
					tDisplayData.verLen=tByte.getUint16();
					tBoneLen=tByte.getUint16();
					if (tBoneLen > 0){
						tDisplayData.bones=[];
						for (l=0;l < tBoneLen;l++){
							var tBoneId=tByte.getUint16();
							tDisplayData.bones.push(tBoneId);
						}
					}
					tUvLen=tByte.getUint16();
					if (tUvLen > 0){
						tDisplayData.uvs=[];
						for (l=0;l < tUvLen;l++){
							tDisplayData.uvs.push(tByte.getFloat32());
						}
					}
					tWeightLen=tByte.getUint16();
					if (tWeightLen > 0){
						tDisplayData.weights=[];
						for (l=0;l < tWeightLen;l++){
							tDisplayData.weights.push(tByte.getFloat32());
						}
					}
					tTriangleLen=tByte.getUint16();
					if (tTriangleLen > 0){
						tDisplayData.triangles=[];
						for (l=0;l < tTriangleLen;l++){
							tDisplayData.triangles.push(tByte.getUint16());
						}
					}
					tVerticeLen=tByte.getUint16();
					if (tVerticeLen > 0){
						tDisplayData.vertices=[];
						for (l=0;l < tVerticeLen;l++){
							tDisplayData.vertices.push(tByte.getFloat32());
						}
					}
					tLengthLen=tByte.getUint16();
					if (tLengthLen > 0){
						tDisplayData.lengths=[];
						for (l=0;l < tLengthLen;l++){
							tDisplayData.lengths.push(tByte.getFloat32());
						}
					}
				}
				tSkinData.slotArr.push(tSlotData);
			}
			this.skinDic[tSkinData.name]=tSkinData;
			this.skinDataArray.push(tSkinData);
		};
		var tReverse=tByte.getUint8();
		if (tReverse==1){
			this.yReverseMatrix=new Matrix(1,0,0,-1,0,0);
			if (tRootBone){
				tRootBone.setTempMatrix(this.yReverseMatrix);
			}
			}else {
			if (tRootBone){
				tRootBone.setTempMatrix(new Matrix());
			}
		}
		this.showSkinByIndex(this.boneSlotDic,0);
		this.isParserComplete=true;
		this.event(/*laya.events.Event.COMPLETE*/"complete",this);
	}

	/**
	*得到指定的纹理
	*@param name 纹理的名字
	*@return
	*/
	__proto.getTexture=function(name){
		var tTexture=this.subTextureDic[name];
		if (!tTexture){
			tTexture=this.subTextureDic[name.substr(0,name.length-1)];
		}
		if (tTexture==null){
			return this._mainTexture;
		}
		return tTexture;
	}

	/**
	*@private
	*显示指定的皮肤
	*@param boneSlotDic 插糟字典的引用
	*@param skinIndex 皮肤的索引
	*@param freshDisplayIndex 是否重置插槽纹理
	*/
	__proto.showSkinByIndex=function(boneSlotDic,skinIndex,freshDisplayIndex){
		(freshDisplayIndex===void 0)&& (freshDisplayIndex=true);
		if (skinIndex < 0 && skinIndex >=this.skinDataArray.length)return false;
		var i=0,n=0;
		var tBoneSlot;
		var tSlotData;
		var tSkinData=this.skinDataArray[skinIndex];
		if (tSkinData){
			for (i=0,n=tSkinData.slotArr.length;i < n;i++){
				tSlotData=tSkinData.slotArr[i];
				if (tSlotData){
					tBoneSlot=boneSlotDic[tSlotData.name];
					if (tBoneSlot){
						tBoneSlot.showSlotData(tSlotData,freshDisplayIndex);
						if (freshDisplayIndex&&tBoneSlot.attachmentName !="undefined" && tBoneSlot.attachmentName !="null"){
							tBoneSlot.showDisplayByName(tBoneSlot.attachmentName);
							}else {
							tBoneSlot.showDisplayByIndex(tBoneSlot.displayIndex);
						}
					}
				}
			}
			return true;
		}
		return false;
	}

	/**
	*通过皮肤名字得到皮肤索引
	*@param skinName 皮肤名称
	*@return
	*/
	__proto.getSkinIndexByName=function(skinName){
		var tSkinData;
		for (var i=0,n=this.skinDataArray.length;i < n;i++){
			tSkinData=this.skinDataArray[i];
			if (tSkinData.name==skinName){
				return i;
			}
		}
		return-1;
	}

	/**
	*@private
	*得到缓冲数据
	*@param aniIndex 动画索引
	*@param frameIndex 帧索引
	*@return
	*/
	__proto.getGrahicsDataWithCache=function(aniIndex,frameIndex){
		if (this._graphicsCache[aniIndex] && this._graphicsCache[aniIndex][frameIndex]){
			return this._graphicsCache[aniIndex][frameIndex];
		}
		return null;
	}

	/**
	*@private
	*保存缓冲grahpics
	*@param aniIndex 动画索引
	*@param frameIndex 帧索引
	*@param graphics 要保存的数据
	*/
	__proto.setGrahicsDataWithCache=function(aniIndex,frameIndex,graphics){
		this._graphicsCache[aniIndex][frameIndex]=graphics;
	}

	__proto.deleteAniData=function(aniIndex){
		if (this._anis[aniIndex]){
			var tAniDataO=this._anis[aniIndex];
			tAniDataO.bone3DMap=null;
			tAniDataO.nodes=null;
		}
	}

	/**
	*释放纹理
	*/
	__proto.destroy=function(){
		this._isDestroyed=true;
		var tTexture;
		/*for each*/for(var $each_tTexture in this.subTextureDic){
			tTexture=this.subTextureDic[$each_tTexture];
			if(tTexture)
				tTexture.destroy();
		}
		var $each_tTexture;
		/*for each*/for($each_tTexture in this._textureDic){
			tTexture=this._textureDic[$each_tTexture];
			if(tTexture)
				tTexture.destroy();
		};
		var tSkinSlotDisplayData;
		for (var i=0,n=this.skinSlotDisplayDataArr.length;i < n;i++){
			tSkinSlotDisplayData=this.skinSlotDisplayDataArr[i];
			tSkinSlotDisplayData.destory();
		}
		this.skinSlotDisplayDataArr.length=0;
		if (this.url){
			delete Templet.TEMPLET_DICTIONARY[this.url];
		}
		laya.resource.Resource.prototype.destroy.call(this);
	}

	/**
	*通过索引得动画名称
	*@param index
	*@return
	*/
	__proto.getAniNameByIndex=function(index){
		var tAni=this.getAnimation(index);
		if (tAni)return tAni.name;
		return null;
	}

	__getset(0,__proto,'rate',function(){
		return this._rate;
		},function(v){
		this._rate=v;
	});

	Templet.LAYA_ANIMATION_VISION="LAYAANIMATION:1.6.0";
	Templet.TEMPLET_DICTIONARY=null;
	return Templet;
})(AnimationTemplet)



})(window,document,Laya);

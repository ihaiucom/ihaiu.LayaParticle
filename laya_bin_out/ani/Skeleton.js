//class laya.ani.bone.Skeleton extends laya.display.Sprite
var Skeleton=(function(_super){
	function Skeleton(templet,aniMode){
		this._templet=null;
		/**@private */
		this._player=null;
		/**@private */
		this._curOriginalData=null;
		//当前骨骼的偏移数据
		this._boneMatrixArray=[];
		//当前骨骼动画的最终结果数据
		this._lastTime=0;
		//上次的帧时间
		this._currAniName=null;
		this._currAniIndex=-1;
		this._pause=true;
		/**@private */
		this._aniClipIndex=-1;
		/**@private */
		this._clipIndex=-1;
		this._skinIndex=0;
		this._skinName="default";
		this._aniMode=0;
		//当前动画自己的缓冲区
		this._graphicsCache=null;
		this._boneSlotDic=null;
		this._bindBoneBoneSlotDic=null;
		this._boneSlotArray=null;
		this._index=-1;
		this._total=-1;
		this._indexControl=false;
		//加载路径
		this._aniPath=null;
		this._texturePath=null;
		this._complete=null;
		this._loadAniMode=0;
		this._yReverseMatrix=null;
		this._ikArr=null;
		this._tfArr=null;
		this._pathDic=null;
		this._rootBone=null;
		/**@private */
		this._boneList=null;
		/**@private */
		this._aniSectionDic=null;
		this._eventIndex=0;
		this._drawOrderIndex=0;
		this._drawOrder=null;
		this._lastAniClipIndex=-1;
		this._lastUpdateAniClipIndex=-1;
		Skeleton.__super.call(this);
		(aniMode===void 0)&& (aniMode=0);
		if (templet)this.init(templet,aniMode);
	}

	__class(Skeleton,'laya.ani.bone.Skeleton',_super);
	var __proto=Skeleton.prototype;
	/**
	*初始化动画
	*@param templet 模板
	*@param aniMode 动画模式
	*<table>
	*<tr><th>模式</th><th>描述</th></tr>
	*<tr>
	*<td>0</td> <td>使用模板缓冲的数据，模板缓冲的数据，不允许修改（内存开销小，计算开销小，不支持换装）</td>
	*</tr>
	*<tr>
	*<td>1</td> <td>使用动画自己的缓冲区，每个动画都会有自己的缓冲区，相当耗费内存 （内存开销大，计算开销小，支持换装）</td>
	*</tr>
	*<tr>
	*<td>2</td> <td>使用动态方式，去实时去画（内存开销小，计算开销大，支持换装,不建议使用）</td>
	*</tr>
	*</table>
	*/
	__proto.init=function(templet,aniMode){
		(aniMode===void 0)&& (aniMode=0);
		var i=0,n=0;
		if (aniMode==1){
			this._graphicsCache=[];
			for (i=0,n=templet.getAnimationCount();i < n;i++){
				this._graphicsCache.push([]);
			}
		}
		this._yReverseMatrix=templet.yReverseMatrix;
		this._aniMode=aniMode;
		this._templet=templet;
		this._player=new AnimationPlayer();
		this._player.cacheFrameRate=templet.rate;
		this._player.templet=templet;
		this._player.play();
		this._parseSrcBoneMatrix();
		this._boneList=templet.mBoneArr;
		this._rootBone=templet.mRootBone;
		this._aniSectionDic=templet.aniSectionDic;
		if (templet.ikArr.length > 0){
			this._ikArr=[];
			for (i=0,n=templet.ikArr.length;i < n;i++){
				this._ikArr.push(new IkConstraint(templet.ikArr[i],this._boneList));
			}
		}
		if (templet.pathArr.length > 0){
			var tPathData;
			var tPathConstraint;
			if (this._pathDic==null)this._pathDic={};
			var tBoneSlot;
			for (i=0,n=templet.pathArr.length;i < n;i++){
				tPathData=templet.pathArr[i];
				tPathConstraint=new PathConstraint(tPathData,this._boneList);
				tBoneSlot=this._boneSlotDic[tPathData.name];
				if (tBoneSlot){
					tPathConstraint=new PathConstraint(tPathData,this._boneList);
					tPathConstraint.target=tBoneSlot;
				}
				this._pathDic[tPathData.name]=tPathConstraint;
			}
		}
		if (templet.tfArr.length > 0){
			this._tfArr=[];
			for (i=0,n=templet.tfArr.length;i < n;i++){
				this._tfArr.push(new TfConstraint(templet.tfArr[i],this._boneList));
			}
		}
		if (templet.skinDataArray.length > 0){
			var tSkinData=this._templet.skinDataArray[this._skinIndex];
			this._skinName=tSkinData.name;
		}
		this._player.on(/*laya.events.Event.PLAYED*/"played",this,this._onPlay);
		this._player.on(/*laya.events.Event.STOPPED*/"stopped",this,this._onStop);
		this._player.on(/*laya.events.Event.PAUSED*/"paused",this,this._onPause);
	}

	/**
	*通过加载直接创建动画
	*@param path 要加载的动画文件路径
	*@param complete 加载完成的回调函数
	*@param aniMode 与<code>Skeleton.init</code>的<code>aniMode</code>作用一致
	*/
	__proto.load=function(path,complete,aniMode){
		(aniMode===void 0)&& (aniMode=0);
		this._aniPath=path;
		this._complete=complete;
		this._loadAniMode=aniMode;
		Laya.loader.load([{url:path,type:/*laya.net.Loader.BUFFER*/"arraybuffer"}],Handler.create(this,this._onLoaded));
	}

	/**
	*加载完成
	*/
	__proto._onLoaded=function(){
		var arraybuffer=Loader.getRes(this._aniPath);
		if (arraybuffer==null)return;
		if (Templet.TEMPLET_DICTIONARY==null){
			Templet.TEMPLET_DICTIONARY={};
		};
		var tFactory;
		tFactory=Templet.TEMPLET_DICTIONARY[this._aniPath];
		if (tFactory){
			if (tFactory.isParseFail){
				this._parseFail();
				}else {
				if (tFactory.isParserComplete){
					this._parseComplete();
					}else {
					tFactory.on(/*laya.events.Event.COMPLETE*/"complete",this,this._parseComplete);
					tFactory.on(/*laya.events.Event.ERROR*/"error",this,this._parseFail);
				}
			}
			}else {
			tFactory=new Templet();
			tFactory._setCreateURL(this._aniPath);
			Templet.TEMPLET_DICTIONARY[this._aniPath]=tFactory;
			tFactory.on(/*laya.events.Event.COMPLETE*/"complete",this,this._parseComplete);
			tFactory.on(/*laya.events.Event.ERROR*/"error",this,this._parseFail);
			tFactory.isParserComplete=false;
			tFactory.parseData(null,arraybuffer);
		}
	}

	/**
	*解析完成
	*/
	__proto._parseComplete=function(){
		var tTemple=Templet.TEMPLET_DICTIONARY[this._aniPath];
		if (tTemple){
			this.init(tTemple,this._loadAniMode);
			this.play(0,true);
		}
		this._complete && this._complete.runWith(this);
	}

	/**
	*解析失败
	*/
	__proto._parseFail=function(){
		console.log("[Error]:"+this._aniPath+"解析失败");
	}

	/**
	*传递PLAY事件
	*/
	__proto._onPlay=function(){
		this.event(/*laya.events.Event.PLAYED*/"played");
	}

	/**
	*传递STOP事件
	*/
	__proto._onStop=function(){
		var tEventData;
		var tEventAniArr=this._templet.eventAniArr;
		var tEventArr=tEventAniArr[this._aniClipIndex];
		if (tEventArr && this._eventIndex < tEventArr.length){
			for (;this._eventIndex < tEventArr.length;this._eventIndex++){
				tEventData=tEventArr[this._eventIndex];
				if (tEventData.time >=this._player.playStart && tEventData.time <=this._player.playEnd){
					this.event(/*laya.events.Event.LABEL*/"label",tEventData);
				}
			}
		}
		this._drawOrder=null;
		this.event(/*laya.events.Event.STOPPED*/"stopped");
	}

	/**
	*传递PAUSE事件
	*/
	__proto._onPause=function(){
		this.event(/*laya.events.Event.PAUSED*/"paused");
	}

	/**
	*创建骨骼的矩阵，保存每次计算的最终结果
	*/
	__proto._parseSrcBoneMatrix=function(){
		var i=0,n=0;
		n=this._templet.srcBoneMatrixArr.length;
		for (i=0;i < n;i++){
			this._boneMatrixArray.push(new Matrix());
		}
		if (this._aniMode==0){
			this._boneSlotDic=this._templet.boneSlotDic;
			this._bindBoneBoneSlotDic=this._templet.bindBoneBoneSlotDic;
			this._boneSlotArray=this._templet.boneSlotArray;
			}else {
			if (this._boneSlotDic==null)this._boneSlotDic={};
			if (this._bindBoneBoneSlotDic==null)this._bindBoneBoneSlotDic={};
			if (this._boneSlotArray==null)this._boneSlotArray=[];
			var tArr=this._templet.boneSlotArray;
			var tBS;
			var tBSArr;
			for (i=0,n=tArr.length;i < n;i++){
				tBS=tArr[i];
				tBSArr=this._bindBoneBoneSlotDic[tBS.parent];
				if (tBSArr==null){
					this._bindBoneBoneSlotDic[tBS.parent]=tBSArr=[];
				}
				this._boneSlotDic[tBS.name]=tBS=tBS.copy();
				tBSArr.push(tBS);
				this._boneSlotArray.push(tBS);
			}
		}
	}

	__proto._emitMissedEvents=function(startTime,endTime,startIndex){
		(startIndex===void 0)&& (startIndex=0);
		var tEventAniArr=this._templet.eventAniArr;
		var tEventArr=tEventAniArr[this._player.currentAnimationClipIndex];
		if (tEventArr){
			var i=0,len=0;
			var tEventData;
			len=tEventArr.length;
			for (i=startIndex;i < len;i++){
				tEventData=tEventArr[i];
				if (tEventData.time >=this._player.playStart && tEventData.time <=this._player.playEnd){
					this.event(/*laya.events.Event.LABEL*/"label",tEventData);
				}
			}
		}
	}

	/**
	*更新动画
	*@param autoKey true为正常更新，false为index手动更新
	*/
	__proto._update=function(autoKey){
		(autoKey===void 0)&& (autoKey=true);
		if (this._pause)return;
		if (autoKey && this._indexControl){
			return;
		};
		var tCurrTime=this.timer.currTimer;
		var preIndex=this._player.currentKeyframeIndex;
		var dTime=tCurrTime-this._lastTime;
		if (autoKey){
			this._player._update(dTime);
			}else {
			preIndex=-1;
		}
		this._lastTime=tCurrTime;
		if (!this._player)return;
		this._index=this._clipIndex=this._player.currentKeyframeIndex;
		if (this._index < 0)return;
		if (dTime > 0 && this._clipIndex==preIndex && this._lastUpdateAniClipIndex==this._aniClipIndex){
			return;
		}
		this._lastUpdateAniClipIndex=this._aniClipIndex;
		if (preIndex > this._clipIndex && this._eventIndex !=0){
			this._emitMissedEvents(this._player.playStart,this._player.playEnd,this._eventIndex);
			this._eventIndex=0;
		};
		var tEventData;
		var tEventAniArr=this._templet.eventAniArr;
		var tEventArr=tEventAniArr[this._aniClipIndex];
		if (tEventArr && this._eventIndex < tEventArr.length){
			tEventData=tEventArr[this._eventIndex];
			if (tEventData.time >=this._player.playStart && tEventData.time <=this._player.playEnd){
				if (this._player.currentPlayTime >=tEventData.time){
					this.event(/*laya.events.Event.LABEL*/"label",tEventData);
					this._eventIndex++;
				}
				}else {
				this._eventIndex++;
			}
		};
		var tGraphics;
		if (this._aniMode==0){
			tGraphics=this._templet.getGrahicsDataWithCache(this._aniClipIndex,this._clipIndex);
			if (tGraphics){
				if (this.graphics !=tGraphics){
					this.graphics=tGraphics;
				}
				return;
				}else {
				var i=0,minIndex=0;
				minIndex=this._clipIndex;
				while ((!this._templet.getGrahicsDataWithCache(this._aniClipIndex,minIndex-1))&& (minIndex > 0)){
					minIndex--;
				}
				if (minIndex < this._clipIndex){
					for (i=minIndex;i < this._clipIndex;i++){
						this._createGraphics(i);
					}
				}
				tGraphics=this._templet.getGrahicsDataWithCache(this._aniClipIndex,this._clipIndex);
				if (tGraphics){
					if (this.graphics !=tGraphics){
						this.graphics=tGraphics;
					}
					return;
				}
			}
			}else if (this._aniMode==1){
			tGraphics=this._getGrahicsDataWithCache(this._aniClipIndex,this._clipIndex);
			if (tGraphics){
				if (this.graphics !=tGraphics){
					this.graphics=tGraphics;
				}
				return;
				}else {
				minIndex=this._clipIndex;
				while ((!this._getGrahicsDataWithCache(this._aniClipIndex,minIndex-1))&& (minIndex > 0)){
					minIndex--;
				}
				if (minIndex < this._clipIndex){
					for (i=minIndex;i < this._clipIndex;i++){
						this._createGraphics(i);
					}
				}
			}
		}
		this._createGraphics();
	}

	/**
	*@private
	*创建grahics图像
	*/
	__proto._createGraphics=function(_clipIndex){
		(_clipIndex===void 0)&& (_clipIndex=-1);
		if (_clipIndex==-1)_clipIndex=this._clipIndex;
		var curTime=_clipIndex *this._player.cacheFrameRateInterval;
		var tDrawOrderData;
		var tDrawOrderAniArr=this._templet.drawOrderAniArr;
		var tDrawOrderArr=tDrawOrderAniArr[this._aniClipIndex];
		if (tDrawOrderArr && tDrawOrderArr.length > 0){
			this._drawOrderIndex=0;
			tDrawOrderData=tDrawOrderArr[this._drawOrderIndex];
			while (curTime >=tDrawOrderData.time){
				this._drawOrder=tDrawOrderData.drawOrder;
				this._drawOrderIndex++;
				if (this._drawOrderIndex >=tDrawOrderArr.length){
					break ;
				}
				tDrawOrderData=tDrawOrderArr[this._drawOrderIndex];
			}
		};
		var tGraphics;
		if (this._aniMode==0 || this._aniMode==1){
			this.graphics=GraphicsAni.create();
			}else {
			if ((this.graphics instanceof laya.ani.GraphicsAni )){
				this.graphics.clear();
				}else {
				this.graphics=GraphicsAni.create();
			}
		}
		tGraphics=this.graphics;
		var bones=this._templet.getNodes(this._aniClipIndex);
		this._templet.getOriginalData(this._aniClipIndex,this._curOriginalData,this._player._fullFrames[this._aniClipIndex],_clipIndex,curTime);
		var tSectionArr=this._aniSectionDic[this._aniClipIndex];
		var tParentMatrix;
		var tStartIndex=0;
		var i=0,j=0,k=0,n=0;
		var tDBBoneSlot;
		var tDBBoneSlotArr;
		var tParentTransform;
		var tSrcBone;
		var boneCount=this._templet.srcBoneMatrixArr.length;
		for (i=0,n=tSectionArr[0];i < boneCount;i++){
			tSrcBone=this._boneList[i];
			tParentTransform=this._templet.srcBoneMatrixArr[i];
			tSrcBone.resultTransform.scX=tParentTransform.scX *this._curOriginalData[tStartIndex++];
			tSrcBone.resultTransform.skX=tParentTransform.skX+this._curOriginalData[tStartIndex++];
			tSrcBone.resultTransform.skY=tParentTransform.skY+this._curOriginalData[tStartIndex++];
			tSrcBone.resultTransform.scY=tParentTransform.scY *this._curOriginalData[tStartIndex++];
			tSrcBone.resultTransform.x=tParentTransform.x+this._curOriginalData[tStartIndex++];
			tSrcBone.resultTransform.y=tParentTransform.y+this._curOriginalData[tStartIndex++];
			if (this._templet.tMatrixDataLen===8){
				tSrcBone.resultTransform.skewX=tParentTransform.skewX+this._curOriginalData[tStartIndex++];
				tSrcBone.resultTransform.skewY=tParentTransform.skewY+this._curOriginalData[tStartIndex++];
			}
		};
		var tSlotDic={};
		var tSlotAlphaDic={};
		var tBoneData;
		for (n+=tSectionArr[1];i < n;i++){
			tBoneData=bones[i];
			tSlotDic[tBoneData.name]=this._curOriginalData[tStartIndex++];
			tSlotAlphaDic[tBoneData.name]=this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
		};
		var tBendDirectionDic={};
		var tMixDic={};
		for (n+=tSectionArr[2];i < n;i++){
			tBoneData=bones[i];
			tBendDirectionDic[tBoneData.name]=this._curOriginalData[tStartIndex++];
			tMixDic[tBoneData.name]=this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
			this._curOriginalData[tStartIndex++];
		}
		if (this._pathDic){
			var tPathConstraint;
			for (n+=tSectionArr[3];i < n;i++){
				tBoneData=bones[i];
				tPathConstraint=this._pathDic[tBoneData.name];
				if (tPathConstraint){
					var tByte=new Byte(tBoneData.extenData);
					switch (tByte.getByte()){
						case 1:
							tPathConstraint.position=this._curOriginalData[tStartIndex++];
							break ;
						case 2:
							tPathConstraint.spacing=this._curOriginalData[tStartIndex++];
							break ;
						case 3:
							tPathConstraint.rotateMix=this._curOriginalData[tStartIndex++];
							tPathConstraint.translateMix=this._curOriginalData[tStartIndex++];
							break ;
						}
				}
			}
		}
		if (this._yReverseMatrix){
			this._rootBone.update(this._yReverseMatrix);
			}else {
			this._rootBone.update(Matrix.TEMP.identity());
		}
		if (this._ikArr){
			var tIkConstraint;
			for (i=0,n=this._ikArr.length;i < n;i++){
				tIkConstraint=this._ikArr[i];
				if (tBendDirectionDic.hasOwnProperty(tIkConstraint.name)){
					tIkConstraint.bendDirection=tBendDirectionDic[tIkConstraint.name];
				}
				if (tMixDic.hasOwnProperty(tIkConstraint.name)){
					tIkConstraint.mix=tMixDic[tIkConstraint.name]
				}
				tIkConstraint.apply();
			}
		}
		if (this._pathDic){
			for (var tPathStr in this._pathDic){
				tPathConstraint=this._pathDic[tPathStr];
				tPathConstraint.apply(this._boneList,tGraphics);
			}
		}
		if (this._tfArr){
			var tTfConstraint;
			for (i=0,k=this._tfArr.length;i < k;i++){
				tTfConstraint=this._tfArr[i];
				tTfConstraint.apply();
			}
		}
		for (i=0,k=this._boneList.length;i < k;i++){
			tSrcBone=this._boneList[i];
			tDBBoneSlotArr=this._bindBoneBoneSlotDic[tSrcBone.name];
			tSrcBone.resultMatrix.copyTo(this._boneMatrixArray[i]);
			if (tDBBoneSlotArr){
				for (j=0,n=tDBBoneSlotArr.length;j < n;j++){
					tDBBoneSlot=tDBBoneSlotArr[j];
					if (tDBBoneSlot){
						tDBBoneSlot.setParentMatrix(tSrcBone.resultMatrix);
					}
				}
			}
		};
		var tDeformDic={};
		var tDeformAniArr=this._templet.deformAniArr;
		var tDeformAniData;
		var tDeformSlotData;
		var tDeformSlotDisplayData;
		if (tDeformAniArr && tDeformAniArr.length > 0){
			if (this._lastAniClipIndex !=this._aniClipIndex){
				this._lastAniClipIndex=this._aniClipIndex;
				for (i=0,n=this._boneSlotArray.length;i < n;i++){
					tDBBoneSlot=this._boneSlotArray[i];
					tDBBoneSlot.deformData=null;
				}
			};
			var tSkinDeformAni=tDeformAniArr[this._aniClipIndex];
			tDeformAniData=(tSkinDeformAni["default"]);
			this._setDeform(tDeformAniData,tDeformDic,this._boneSlotArray,curTime);
			var tSkin;
			for (tSkin in tSkinDeformAni){
				if (tSkin !="default" && tSkin !=this._skinName){
					tDeformAniData=tSkinDeformAni [tSkin];
					this._setDeform(tDeformAniData,tDeformDic,this._boneSlotArray,curTime);
				}
			}
			tDeformAniData=(tSkinDeformAni[this._skinName]);
			this._setDeform(tDeformAniData,tDeformDic,this._boneSlotArray,curTime);
		};
		var tSlotData2;
		var tSlotData3;
		var tObject;
		if (this._drawOrder){
			for (i=0,n=this._drawOrder.length;i < n;i++){
				tDBBoneSlot=this._boneSlotArray[this._drawOrder[i]];
				tSlotData2=tSlotDic[tDBBoneSlot.name];
				tSlotData3=tSlotAlphaDic[tDBBoneSlot.name];
				if (!isNaN(tSlotData3)){
					tGraphics.save();
					tGraphics.alpha(tSlotData3);
				}
				if (!isNaN(tSlotData2)&& tSlotData2 !=-2){
					if (this._templet.attachmentNames){
						tDBBoneSlot.showDisplayByName(this._templet.attachmentNames[tSlotData2]);
						}else {
						tDBBoneSlot.showDisplayByIndex(tSlotData2);
					}
				}
				if (tDeformDic[this._drawOrder[i]]){
					tObject=tDeformDic[this._drawOrder[i]];
					if (tDBBoneSlot.currDisplayData && tObject[tDBBoneSlot.currDisplayData.attachmentName]){
						tDBBoneSlot.deformData=tObject[tDBBoneSlot.currDisplayData.attachmentName];
						}else {
						tDBBoneSlot.deformData=null;
					}
					}else {
					tDBBoneSlot.deformData=null;
				}
				if (!isNaN(tSlotData3)){
					tDBBoneSlot.draw(tGraphics,this._boneMatrixArray,this._aniMode==2,tSlotData3);
					}else {
					tDBBoneSlot.draw(tGraphics,this._boneMatrixArray,this._aniMode==2);
				}
				if (!isNaN(tSlotData3)){
					tGraphics.restore();
				}
			}
			}else {
			for (i=0,n=this._boneSlotArray.length;i < n;i++){
				tDBBoneSlot=this._boneSlotArray[i];
				tSlotData2=tSlotDic[tDBBoneSlot.name];
				tSlotData3=tSlotAlphaDic[tDBBoneSlot.name];
				if (!isNaN(tSlotData3)){
					tGraphics.save();
					tGraphics.alpha(tSlotData3);
				}
				if (!isNaN(tSlotData2)&& tSlotData2 !=-2){
					if (this._templet.attachmentNames){
						tDBBoneSlot.showDisplayByName(this._templet.attachmentNames[tSlotData2]);
						}else {
						tDBBoneSlot.showDisplayByIndex(tSlotData2);
					}
				}
				if (tDeformDic[i]){
					tObject=tDeformDic[i];
					if (tDBBoneSlot.currDisplayData && tObject[tDBBoneSlot.currDisplayData.attachmentName]){
						tDBBoneSlot.deformData=tObject[tDBBoneSlot.currDisplayData.attachmentName];
						}else {
						tDBBoneSlot.deformData=null;
					}
					}else {
					tDBBoneSlot.deformData=null;
				}
				if (!isNaN(tSlotData3)){
					tDBBoneSlot.draw(tGraphics,this._boneMatrixArray,this._aniMode==2,tSlotData3);
					}else {
					tDBBoneSlot.draw(tGraphics,this._boneMatrixArray,this._aniMode==2);
				}
				if (!isNaN(tSlotData3)){
					tGraphics.restore();
				}
			}
		}
		if (this._aniMode==0){
			this._templet.setGrahicsDataWithCache(this._aniClipIndex,_clipIndex,tGraphics);
			this._checkIsAllParsed(this._aniClipIndex);
			}else if (this._aniMode==1){
			this._setGrahicsDataWithCache(this._aniClipIndex,_clipIndex,tGraphics);
		}
	}

	__proto._checkIsAllParsed=function(_aniClipIndex){
		var i=0,len=0;
		len=Math.floor(0.01+this._templet.getAniDuration(_aniClipIndex)/ 1000 *this._player.cacheFrameRate);
		for (i=0;i < len;i++){
			if (!this._templet.getGrahicsDataWithCache(_aniClipIndex,i))return;
		}
		if (!this._templet.getGrahicsDataWithCache(_aniClipIndex,len)){
			this._createGraphics(len);
			return;
		}
		this._templet.deleteAniData(_aniClipIndex);
	}

	/**
	*设置deform数据
	*@param tDeformAniData
	*@param tDeformDic
	*@param _boneSlotArray
	*@param curTime
	*/
	__proto._setDeform=function(tDeformAniData,tDeformDic,_boneSlotArray,curTime){
		if (!tDeformAniData)return;
		var tDeformSlotData;
		var tDeformSlotDisplayData;
		var tDBBoneSlot;
		var i=0,n=0,j=0;
		if (tDeformAniData){
			for (i=0,n=tDeformAniData.deformSlotDataList.length;i < n;i++){
				tDeformSlotData=tDeformAniData.deformSlotDataList[i];
				for (j=0;j < tDeformSlotData.deformSlotDisplayList.length;j++){
					tDeformSlotDisplayData=tDeformSlotData.deformSlotDisplayList[j];
					tDBBoneSlot=_boneSlotArray[tDeformSlotDisplayData.slotIndex];
					tDeformSlotDisplayData.apply(curTime,tDBBoneSlot);
					if (!tDeformDic[tDeformSlotDisplayData.slotIndex]){
						tDeformDic[tDeformSlotDisplayData.slotIndex]={};
					}
					tDeformDic[tDeformSlotDisplayData.slotIndex][tDeformSlotDisplayData.attachment]=tDeformSlotDisplayData.deformData;
				}
			}
		}
	}

	/**
	*得到当前动画的数量
	*@return 当前动画的数量
	*/
	__proto.getAnimNum=function(){
		return this._templet.getAnimationCount();
	}

	/**
	*得到指定动画的名字
	*@param index 动画的索引
	*/
	__proto.getAniNameByIndex=function(index){
		return this._templet.getAniNameByIndex(index);
	}

	/**
	*通过名字得到插槽的引用
	*@param name 动画的名字
	*@return 插槽的引用
	*/
	__proto.getSlotByName=function(name){
		return this._boneSlotDic[name];
	}

	/**
	*通过名字显示一套皮肤
	*@param name 皮肤的名字
	*@param freshSlotIndex 是否将插槽纹理重置到初始化状态
	*/
	__proto.showSkinByName=function(name,freshSlotIndex){
		(freshSlotIndex===void 0)&& (freshSlotIndex=true);
		this.showSkinByIndex(this._templet.getSkinIndexByName(name),freshSlotIndex);
	}

	/**
	*通过索引显示一套皮肤
	*@param skinIndex 皮肤索引
	*@param freshSlotIndex 是否将插槽纹理重置到初始化状态
	*/
	__proto.showSkinByIndex=function(skinIndex,freshSlotIndex){
		(freshSlotIndex===void 0)&& (freshSlotIndex=true);
		for (var i=0;i < this._boneSlotArray.length;i++){
			(this._boneSlotArray [i]).showSlotData(null,freshSlotIndex);
		}
		if (this._templet.showSkinByIndex(this._boneSlotDic,skinIndex,freshSlotIndex)){
			var tSkinData=this._templet.skinDataArray[skinIndex];
			this._skinIndex=skinIndex;
			this._skinName=tSkinData.name;
		}
		this._clearCache();
	}

	/**
	*设置某插槽的皮肤
	*@param slotName 插槽名称
	*@param index 插糟皮肤的索引
	*/
	__proto.showSlotSkinByIndex=function(slotName,index){
		if (this._aniMode==0)return;
		var tBoneSlot=this.getSlotByName(slotName);
		if (tBoneSlot){
			tBoneSlot.showDisplayByIndex(index);
		}
		this._clearCache();
	}

	/**
	*设置某插槽的皮肤
	*@param slotName 插槽名称
	*@param name 皮肤名称
	*/
	__proto.showSlotSkinByName=function(slotName,name){
		if (this._aniMode==0)return;
		var tBoneSlot=this.getSlotByName(slotName);
		if (tBoneSlot){
			tBoneSlot.showDisplayByName(name);
		}
		this._clearCache();
	}

	/**
	*替换插槽贴图名
	*@param slotName 插槽名称
	*@param oldName 要替换的贴图名
	*@param newName 替换后的贴图名
	*/
	__proto.replaceSlotSkinName=function(slotName,oldName,newName){
		if (this._aniMode==0)return;
		var tBoneSlot=this.getSlotByName(slotName);
		if (tBoneSlot){
			tBoneSlot.replaceDisplayByName(oldName,newName);
		}
		this._clearCache();
	}

	/**
	*替换插槽的贴图索引
	*@param slotName 插槽名称
	*@param oldIndex 要替换的索引
	*@param newIndex 替换后的索引
	*/
	__proto.replaceSlotSkinByIndex=function(slotName,oldIndex,newIndex){
		if (this._aniMode==0)return;
		var tBoneSlot=this.getSlotByName(slotName);
		if (tBoneSlot){
			tBoneSlot.replaceDisplayByIndex(oldIndex,newIndex);
		}
		this._clearCache();
	}

	/**
	*设置自定义皮肤
	*@param name 插糟的名字
	*@param texture 自定义的纹理
	*/
	__proto.setSlotSkin=function(slotName,texture){
		if (this._aniMode==0)return;
		var tBoneSlot=this.getSlotByName(slotName);
		if (tBoneSlot){
			tBoneSlot.replaceSkin(texture);
		}
		this._clearCache();
	}

	/**
	*换装的时候，需要清一下缓冲区
	*/
	__proto._clearCache=function(){
		if (this._aniMode==1){
			for (var i=0,n=this._graphicsCache.length;i < n;i++){
				for (var j=0,len=this._graphicsCache[i].length;j < len;j++){
					var gp=this._graphicsCache[i][j];
					if (gp !=this.graphics){
						GraphicsAni.recycle(gp);
					}
				}
				this._graphicsCache[i].length=0;
			}
		}
	}

	/**
	*播放动画
	*
	*@param nameOrIndex 动画名字或者索引
	*@param loop 是否循环播放
	*@param force false,如果要播的动画跟上一个相同就不生效,true,强制生效
	*@param start 起始时间
	*@param end 结束时间
	*@param freshSkin 是否刷新皮肤数据
	*/
	__proto.play=function(nameOrIndex,loop,force,start,end,freshSkin){
		(force===void 0)&& (force=true);
		(start===void 0)&& (start=0);
		(end===void 0)&& (end=0);
		(freshSkin===void 0)&& (freshSkin=true);
		this._indexControl=false;
		var index=-1;
		var duration=NaN;
		if (loop){
			duration=2147483647;
			}else {
			duration=0;
		}
		if ((typeof nameOrIndex=='string')){
			for (var i=0,n=this._templet.getAnimationCount();i < n;i++){
				var animation=this._templet.getAnimation(i);
				if (animation && nameOrIndex==animation.name){
					index=i;
					break ;
				}
			}
			}else {
			index=nameOrIndex;
		}
		if (index >-1 && index < this.getAnimNum()){
			this._aniClipIndex=index;
			if (force || this._pause || this._currAniIndex !=index){
				this._currAniIndex=index;
				this._curOriginalData=new Float32Array(this._templet.getTotalkeyframesLength(index));
				this._drawOrder=null;
				this._eventIndex=0;
				this._player.play(index,this._player.playbackRate,duration,start,end);
				if (freshSkin)
					this._templet.showSkinByIndex(this._boneSlotDic,this._skinIndex);
				if (this._pause){
					this._pause=false;
					this._lastTime=Browser.now();
					this.timer.frameLoop(1,this,this._update,null,true);
				}
				this._update();
			}
		}
	}

	/**
	*停止动画
	*/
	__proto.stop=function(){
		if (!this._pause){
			this._pause=true;
			if (this._player){
				this._player.stop(true);
			}
			this.timer.clear(this,this._update);
		}
	}

	/**
	*设置动画播放速率
	*@param value 1为标准速率
	*/
	__proto.playbackRate=function(value){
		if (this._player){
			this._player.playbackRate=value;
		}
	}

	/**
	*暂停动画的播放
	*/
	__proto.paused=function(){
		if (!this._pause){
			this._pause=true;
			if (this._player){
				this._player.paused=true;
			}
			this.timer.clear(this,this._update);
		}
	}

	/**
	*恢复动画的播放
	*/
	__proto.resume=function(){
		this._indexControl=false;
		if (this._pause){
			this._pause=false;
			if (this._player){
				this._player.paused=false;
			}
			this._lastTime=Browser.now();
			this.timer.frameLoop(1,this,this._update,null,true);
		}
	}

	/**
	*@private
	*得到缓冲数据
	*@param aniIndex
	*@param frameIndex
	*@return
	*/
	__proto._getGrahicsDataWithCache=function(aniIndex,frameIndex){
		return this._graphicsCache[aniIndex][frameIndex];
	}

	/**
	*@private
	*保存缓冲grahpics
	*@param aniIndex
	*@param frameIndex
	*@param graphics
	*/
	__proto._setGrahicsDataWithCache=function(aniIndex,frameIndex,graphics){
		this._graphicsCache[aniIndex][frameIndex]=graphics;
	}

	/**
	*销毁当前动画
	*/
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		_super.prototype.destroy.call(this,destroyChild);
		this._templet=null;
		if (this._player)this._player.offAll();
		this._player=null;
		this._curOriginalData=null;
		this._boneMatrixArray.length=0;
		this._lastTime=0;
		this.timer.clear(this,this._update);
	}

	/**
	*设置动画路径
	*/
	/**
	*得到资源的URL
	*/
	__getset(0,__proto,'url',function(){
		return this._aniPath;
		},function(path){
		this.load(path);
	});

	/**
	*@private
	*设置帧索引
	*/
	/**
	*@private
	*得到帧索引
	*/
	__getset(0,__proto,'index',function(){
		return this._index;
		},function(value){
		if (this.player){
			this._index=value;
			this._player.currentTime=this._index *1000 / this._player.cacheFrameRate;
			this._indexControl=true;
			this._update(false);
		}
	});

	/**
	*得到总帧数据
	*/
	__getset(0,__proto,'total',function(){
		if (this._templet && this._player){
			this._total=Math.floor(this._templet.getAniDuration(this._player.currentAnimationClipIndex)/ 1000 *this._player.cacheFrameRate);
			}else {
			this._total=-1;
		}
		return this._total;
	});

	/**
	*得到动画模板的引用
	*/
	__getset(0,__proto,'templet',function(){
		return this._templet;
	});

	/**
	*得到播放器的引用
	*/
	__getset(0,__proto,'player',function(){
		return this._player;
	});

	Skeleton.useSimpleMeshInCanvas=false;
	return Skeleton;
})(Sprite)


/**
*<p> <code>MovieClip</code> 用于播放经过工具处理后的 swf 动画。</p>
*/

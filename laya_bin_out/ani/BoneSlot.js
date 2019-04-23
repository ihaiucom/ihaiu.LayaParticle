//class laya.ani.bone.BoneSlot
var BoneSlot=(function(){
	function BoneSlot(){
		/**插槽名称 */
		this.name=null;
		/**插槽绑定的骨骼名称 */
		this.parent=null;
		/**插糟显示数据数据的名称 */
		this.attachmentName=null;
		/**原始数据的索引 */
		this.srcDisplayIndex=-1;
		/**判断对象是否是原对象 */
		this.type="src";
		/**模板的指针 */
		this.templet=null;
		/**当前插槽对应的数据 */
		this.currSlotData=null;
		/**当前插槽显示的纹理 */
		this.currTexture=null;
		/**显示对象对应的数据 */
		this.currDisplayData=null;
		/**显示皮肤的索引 */
		this.displayIndex=-1;
		/**@private */
		this.originalIndex=-1;
		/**用户自定义的皮肤 */
		this._diyTexture=null;
		this._parentMatrix=null;
		this._resultMatrix=null;
		/**索引替换表 */
		this._replaceDic={};
		/**当前diyTexture的动画纹理 */
		this._curDiyUV=null;
		this._curDiyVS=null;
		/**实时模式下，复用使用 */
		this._skinSprite=null;
		/**@private 变形动画数据 */
		this.deformData=null;
		this._mVerticleArr=null;
		this._preGraphicVerticle=null;
		this._preGraphicMatrix=null;
	}

	__class(BoneSlot,'laya.ani.bone.BoneSlot');
	var __proto=BoneSlot.prototype;
	/**
	*设置要显示的插槽数据
	*@param slotData
	*@param disIndex
	*@param freshIndex 是否重置纹理
	*/
	__proto.showSlotData=function(slotData,freshIndex){
		(freshIndex===void 0)&& (freshIndex=true);
		this.currSlotData=slotData;
		if(freshIndex)
			this.displayIndex=this.srcDisplayIndex;
		this.currDisplayData=null;
		this.currTexture=null;
	}

	/**
	*通过名字显示指定对象
	*@param name
	*/
	__proto.showDisplayByName=function(name){
		if (this.currSlotData){
			this.showDisplayByIndex(this.currSlotData.getDisplayByName(name));
		}
	}

	/**
	*替换贴图名
	*@param tarName 要替换的贴图名
	*@param newName 替换后的贴图名
	*/
	__proto.replaceDisplayByName=function(tarName,newName){
		if (!this.currSlotData)return;
		var preIndex=0;
		preIndex=this.currSlotData.getDisplayByName(tarName);
		var newIndex=0;
		newIndex=this.currSlotData.getDisplayByName(newName);
		this.replaceDisplayByIndex(preIndex,newIndex);
	}

	/**
	*替换贴图索引
	*@param tarIndex 要替换的索引
	*@param newIndex 替换后的索引
	*/
	__proto.replaceDisplayByIndex=function(tarIndex,newIndex){
		if (!this.currSlotData)return;
		this._replaceDic[tarIndex]=newIndex;
		if (this.originalIndex==tarIndex){
			this.showDisplayByIndex(tarIndex);
		}
	}

	/**
	*指定显示对象
	*@param index
	*/
	__proto.showDisplayByIndex=function(index){
		this.originalIndex=index;
		if (this._replaceDic[index]!=null)index=this._replaceDic[index];
		if (this.currSlotData && index >-1 && index < this.currSlotData.displayArr.length){
			this.displayIndex=index;
			this.currDisplayData=this.currSlotData.displayArr[index];
			if (this.currDisplayData){
				var tName=this.currDisplayData.name;
				this.currTexture=this.templet.getTexture(tName);
				if (this.currTexture && this.currDisplayData.type==0 && this.currDisplayData.uvs){
					this.currTexture=this.currDisplayData.createTexture(this.currTexture);
				}
			}
			}else {
			this.displayIndex=-1;
			this.currDisplayData=null;
			this.currTexture=null;
		}
	}

	/**
	*替换皮肤
	*@param _texture
	*/
	__proto.replaceSkin=function(_texture){
		this._diyTexture=_texture;
		if (this._curDiyUV)this._curDiyUV.length=0;
		if (this.currDisplayData&&this._diyTexture==this.currDisplayData.texture){
			this._diyTexture=null;
		}
	}

	//TODO:coverage
	__proto.setParentMatrix=function(parentMatrix){
		this._parentMatrix=parentMatrix;
	}

	//TODO:coverage
	__proto.getSaveVerticle=function(tArr){
		if (BoneSlot.useSameMatrixAndVerticle&&this._preGraphicVerticle && BoneSlot.isSameArr(tArr,this._preGraphicVerticle)){
			tArr=this._preGraphicVerticle;
			}else{
			tArr=Utils.copyArray([],tArr);
			this._preGraphicVerticle=tArr;
		}
		return tArr;
	}

	//TODO:coverage
	__proto.getSaveMatrix=function(tResultMatrix){
		if (BoneSlot.useSameMatrixAndVerticle&&this._preGraphicMatrix && BoneSlot.isSameMatrix(tResultMatrix,this._preGraphicMatrix)){
			tResultMatrix=this._preGraphicMatrix;
			}else{
			var newMatrix=tResultMatrix.clone();
			tResultMatrix=newMatrix;
			this._preGraphicMatrix=tResultMatrix;
		}
		return tResultMatrix;
	}

	/**
	*把纹理画到Graphics上
	*@param graphics
	*@param noUseSave
	*/
	__proto.draw=function(graphics,boneMatrixArray,noUseSave,alpha){
		(noUseSave===void 0)&& (noUseSave=false);
		(alpha===void 0)&& (alpha=1);
		if ((this._diyTexture==null && this.currTexture==null)|| this.currDisplayData==null){
			if (!(this.currDisplayData && this.currDisplayData.type==3)){
				return;
			}
		};
		var tTexture=this.currTexture;
		if (this._diyTexture)tTexture=this._diyTexture;
		var tSkinSprite;
		switch (this.currDisplayData.type){
			case 0:
				if (graphics){
					var tCurrentMatrix=this.getDisplayMatrix();
					if (this._parentMatrix){
						var tRotateKey=false;
						if (tCurrentMatrix){
							Matrix.mul(tCurrentMatrix,this._parentMatrix,Matrix.TEMP);
							var tResultMatrix;
							if (noUseSave){
								if (this._resultMatrix==null)this._resultMatrix=new Matrix();
								tResultMatrix=this._resultMatrix;
								}else {
								tResultMatrix=BoneSlot._tempResultMatrix;
							}
							if ((!Render.isWebGL && !Render.isConchApp && this.currDisplayData.uvs)|| ((Render.isWebGL || Render.isConchApp)&& this._diyTexture && this.currDisplayData.uvs)){
								var tTestMatrix=BoneSlot._tempMatrix;
								tTestMatrix.identity();
								if (this.currDisplayData.uvs[1] > this.currDisplayData.uvs[5]){
									tTestMatrix.d=-1;
								}
								if (this.currDisplayData.uvs[0] > this.currDisplayData.uvs[4]
									&& this.currDisplayData.uvs[1] > this.currDisplayData.uvs[5]){
									tRotateKey=true;
									tTestMatrix.rotate(-Math.PI/2);
								}
								Matrix.mul(tTestMatrix,Matrix.TEMP,tResultMatrix);
								}else {
								Matrix.TEMP.copyTo(tResultMatrix);
							}
							if (!noUseSave){
								tResultMatrix=this.getSaveMatrix(tResultMatrix);
							}
							tResultMatrix._checkTransform();
							if (tRotateKey){
								graphics.drawTexture(tTexture,-this.currDisplayData.height / 2,-this.currDisplayData.width / 2,this.currDisplayData.height,this.currDisplayData.width,tResultMatrix);
								}else {
								graphics.drawTexture(tTexture,-this.currDisplayData.width / 2,-this.currDisplayData.height / 2,this.currDisplayData.width,this.currDisplayData.height,tResultMatrix);
							}
						}
					}
				}
				break ;
			case 1:
				if (noUseSave){
					if (this._skinSprite==null){
						this._skinSprite=BoneSlot.createSkinMesh();
					}
					tSkinSprite=this._skinSprite;
					}else {
					tSkinSprite=BoneSlot.createSkinMesh();
				}
				if (tSkinSprite==null){
					return;
				};
				var tIBArray;
				var tRed=1;
				var tGreed=1;
				var tBlue=1;
				var tAlpha=1;
				if (this.currDisplayData.bones==null){
					var tVertices=this.currDisplayData.weights;
					if (this.deformData){
						tVertices=this.deformData;
					};
					var tUVs;
					if (this._diyTexture){
						if (!this._curDiyUV){
							this._curDiyUV=[];
						}
						if (this._curDiyUV.length==0){
							this._curDiyUV=UVTools.getRelativeUV(this.currTexture.uv,this.currDisplayData.uvs,this._curDiyUV);
							this._curDiyUV=UVTools.getAbsoluteUV(this._diyTexture.uv,this._curDiyUV,this._curDiyUV);
						}
						tUVs=this._curDiyUV;
						}else{
						tUVs=this.currDisplayData.uvs;
					}
					this._mVerticleArr=tVertices;
					var tTriangleNum=this.currDisplayData.triangles.length / 3;
					tIBArray=this.currDisplayData.triangles;
					if (this.deformData){
						if (!noUseSave){
							this._mVerticleArr=this.getSaveVerticle(this._mVerticleArr);
						}
					}
					tSkinSprite.init2(tTexture,tIBArray,this._mVerticleArr,tUVs);
					var tCurrentMatrix2=this.getDisplayMatrix();
					if (this._parentMatrix){
						if (tCurrentMatrix2){
							Matrix.mul(tCurrentMatrix2,this._parentMatrix,Matrix.TEMP);
							var tResultMatrix2;
							if (noUseSave){
								if (this._resultMatrix==null)this._resultMatrix=new Matrix();
								tResultMatrix2=this._resultMatrix;
								}else {
								tResultMatrix2=BoneSlot._tempResultMatrix;
							}
							Matrix.TEMP.copyTo(tResultMatrix2);
							if (!noUseSave){
								tResultMatrix2=this.getSaveMatrix(tResultMatrix2);
							}
							tSkinSprite.transform=tResultMatrix2;
						}
					}
					}else {
					this.skinMesh(boneMatrixArray,tSkinSprite,alpha);
				}
				graphics.drawSkin(tSkinSprite);
				break ;
			case 2:
				if (noUseSave){
					if (this._skinSprite==null){
						this._skinSprite=BoneSlot.createSkinMesh();
					}
					tSkinSprite=this._skinSprite;
					}else {
					tSkinSprite=BoneSlot.createSkinMesh();
				}
				if (tSkinSprite==null){
					return;
				}
				this.skinMesh(boneMatrixArray,tSkinSprite,alpha);
				graphics.drawSkin(tSkinSprite);
				break ;
			case 3:
				break ;
			}
	}

	/**
	*显示蒙皮动画
	*@param boneMatrixArray 当前帧的骨骼矩阵
	*/
	__proto.skinMesh=function(boneMatrixArray,skinSprite,alpha){
		var tTexture=this.currTexture;
		var tBones=this.currDisplayData.bones;
		var tUvs;
		if (this._diyTexture){
			tTexture=this._diyTexture;
			if (!this._curDiyUV){
				this._curDiyUV=[];
			}
			if (this._curDiyUV.length==0){
				this._curDiyUV=UVTools.getRelativeUV(this.currTexture.uv,this.currDisplayData.uvs,this._curDiyUV);
				this._curDiyUV=UVTools.getAbsoluteUV(this._diyTexture.uv,this._curDiyUV,this._curDiyUV);
			}
			tUvs=this._curDiyUV;
			}else{
			tUvs=this.currDisplayData.uvs;
		};
		var tWeights=this.currDisplayData.weights;
		var tTriangles=this.currDisplayData.triangles;
		var tIBArray;
		var tRx=0;
		var tRy=0;
		var nn=0;
		var tMatrix;
		var tX=NaN;
		var tY=NaN;
		var tB=0;
		var tWeight=0;
		var tVertices;
		var i=0,j=0,n=0;
		var tRed=1;
		var tGreed=1;
		var tBlue=1;
		var tAlpha=alpha;
		BoneSlot._tempVerticleArr.length=0;
		tVertices=BoneSlot._tempVerticleArr;
		if (this.deformData && this.deformData.length > 0){
			var f=0;
			for (i=0,n=tBones.length;i < n;){
				nn=tBones[i++]+i;
				tRx=0,tRy=0;
				for (;i < nn;i++){
					tMatrix=boneMatrixArray[tBones[i]]
					tX=tWeights[tB]+this.deformData[f++];
					tY=tWeights[tB+1]+this.deformData[f++];
					tWeight=tWeights[tB+2];
					tRx+=(tX *tMatrix.a+tY *tMatrix.c+tMatrix.tx)*tWeight;
					tRy+=(tX *tMatrix.b+tY *tMatrix.d+tMatrix.ty)*tWeight;
					tB+=3;
				}
				tVertices.push(tRx,tRy);
			}
			}else {
			for (i=0,n=tBones.length;i < n;){
				nn=tBones[i++]+i;
				tRx=0,tRy=0;
				for (;i < nn;i++){
					tMatrix=boneMatrixArray[tBones[i]]
					tX=tWeights[tB];
					tY=tWeights[tB+1];
					tWeight=tWeights[tB+2];
					tRx+=(tX *tMatrix.a+tY *tMatrix.c+tMatrix.tx)*tWeight;
					tRy+=(tX *tMatrix.b+tY *tMatrix.d+tMatrix.ty)*tWeight;
					tB+=3;
				}
				tVertices.push(tRx,tRy);
			}
		}
		this._mVerticleArr=tVertices;
		tIBArray=tTriangles;
		this._mVerticleArr=this.getSaveVerticle(this._mVerticleArr);
		skinSprite.init2(tTexture,tIBArray,this._mVerticleArr,tUvs);
	}

	/**
	*画骨骼的起始点，方便调试
	*@param graphics
	*/
	__proto.drawBonePoint=function(graphics){
		if (graphics && this._parentMatrix){
			graphics.drawCircle(this._parentMatrix.tx,this._parentMatrix.ty,5,"#ff0000");
		}
	}

	//TODO:coverage
	__proto.getDisplayMatrix=function(){
		if (this.currDisplayData){
			return this.currDisplayData.transform.getMatrix();
		}
		return null;
	}

	/**
	*得到插糟的矩阵
	*@return
	*/
	__proto.getMatrix=function(){
		return this._resultMatrix;
	}

	/**
	*用原始数据拷贝出一个
	*@return
	*/
	__proto.copy=function(){
		var tBoneSlot=new BoneSlot();
		tBoneSlot.type="copy";
		tBoneSlot.name=this.name;
		tBoneSlot.attachmentName=this.attachmentName;
		tBoneSlot.srcDisplayIndex=this.srcDisplayIndex;
		tBoneSlot.parent=this.parent;
		tBoneSlot.displayIndex=this.displayIndex;
		tBoneSlot.templet=this.templet;
		tBoneSlot.currSlotData=this.currSlotData;
		tBoneSlot.currTexture=this.currTexture;
		tBoneSlot.currDisplayData=this.currDisplayData;
		return tBoneSlot;
	}

	BoneSlot.createSkinMesh=function(){
		return new SkinMeshForGraphic();
	}

	BoneSlot.isSameArr=function(arrA,arrB){
		if (arrA.length !=arrB.length)return false;
		var i=0,len=0;
		len=arrA.length;
		for (i=0;i < len;i++){
			if (arrA[i] !=arrB[i])return false;
		}
		return true;
	}

	BoneSlot.isSameMatrix=function(mtA,mtB){
		return mtA.a==mtB.a && mtA.b==mtB.b && mtA.c==mtB.c && mtA.d==mtB.d && Math.abs(mtA.tx-mtB.tx)<0.00001 && Math.abs(mtA.ty-mtB.ty)<0.00001;
	}

	BoneSlot.useSameMatrixAndVerticle=true;
	BoneSlot._tempVerticleArr=[];
	__static(BoneSlot,
	['_tempMatrix',function(){return this._tempMatrix=new Matrix();},'_tempResultMatrix',function(){return this._tempResultMatrix=new Matrix();}
	]);
	return BoneSlot;
})()


/**
*@private
*/

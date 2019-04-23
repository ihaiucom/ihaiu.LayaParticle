/**
*<code>/**
*<code>BaseCamera</code> 类用于创建摄像机的父类。
*/
//class laya.d3.core.BaseCamera extends laya.d3.core.Sprite3D
var BaseCamera=(function(_super){
	function BaseCamera(nearPlane,farPlane){
		/**@private 渲染顺序。*/
		//this._renderingOrder=0;
		/**@private 近裁剪面。*/
		//this._nearPlane=NaN;
		/**@private 远裁剪面。*/
		//this._farPlane=NaN;
		/**@private 视野。*/
		//this._fieldOfView=NaN;
		/**@private 正交投影的垂直尺寸。*/
		//this._orthographicVerticalSize=NaN;
		/**@private */
		//this._orthographic=false;
		/**@private 渲染目标。*/
		//this._renderTarget=null;
		/**@private 是否使用用户自定义投影矩阵，如果使用了用户投影矩阵，摄像机投影矩阵相关的参数改变则不改变投影矩阵的值，需调用ResetProjectionMatrix方法。*/
		//this._useUserProjectionMatrix=false;
		/**@private */
		//this._shaderValues=null;
		/**@private [只读] 需先调用viewport保证值正确。*/
		//this._canvasWidth=NaN;
		/**@private [只读] 需先调用viewport保证值正确。*/
		//this._canvasHeight=NaN;
		/**清楚标记。*/
		//this.clearFlag=0;
		/**摄像机的清除颜色。*/
		//this.clearColor=null;
		/**可视层位标记遮罩值,支持混合 例:cullingMask=Math.pow(2,0)|Math.pow(2,1)为第0层和第1层可见。*/
		//this.cullingMask=0;
		/**渲染时是否用遮挡剔除。 */
		//this.useOcclusionCulling=false;
		BaseCamera.__super.call(this);
		this._skyRenderer=new SkyRenderer();
		(nearPlane===void 0)&& (nearPlane=0.3);
		(farPlane===void 0)&& (farPlane=1000);
		this._shaderValues=new ShaderData(null);
		this._fieldOfView=60;
		this._useUserProjectionMatrix=false;
		this._orthographic=false;
		this._orthographicVerticalSize=10;
		this.renderingOrder=0;
		this._nearPlane=nearPlane;
		this._farPlane=farPlane;
		this.cullingMask=2147483647;
		this.clearFlag=/*CLASS CONST:laya.d3.core.BaseCamera.CLEARFLAG_SOLIDCOLOR*/0;
		this.useOcclusionCulling=true;
		this._calculateProjectionMatrix();
		Laya.stage.on(/*laya.events.Event.RESIZE*/"resize",this,this._onScreenSizeChanged);
	}

	__class(BaseCamera,'laya.d3.core.BaseCamera',_super);
	var __proto=BaseCamera.prototype;
	/**
	*通过RenderingOrder属性对摄像机机型排序。
	*/
	__proto._sortCamerasByRenderingOrder=function(){
		if (this.displayedInStage){
			var cameraPool=this.scene._cameraPool;
			var n=cameraPool.length-1;
			for (var i=0;i < n;i++){
				if (cameraPool[i].renderingOrder > cameraPool[n].renderingOrder){
					var tempCamera=cameraPool[i];
					cameraPool[i]=cameraPool[n];
					cameraPool[n]=tempCamera;
				}
			}
		}
	}

	/**
	*@private
	*/
	__proto._calculateProjectionMatrix=function(){}
	/**
	*@private
	*/
	__proto._onScreenSizeChanged=function(){
		this._calculateProjectionMatrix();
	}

	/**
	*@private
	*/
	__proto._prepareCameraToRender=function(){
		var cameraSV=this._shaderValues;
		cameraSV.setVector(laya.d3.core.BaseCamera.CAMERAPOS,this.transform.position);
		cameraSV.setVector(laya.d3.core.BaseCamera.CAMERADIRECTION,this.transform.forward);
		cameraSV.setVector(laya.d3.core.BaseCamera.CAMERAUP,this.transform.up);
	}

	/**
	*@private
	*/
	__proto._prepareCameraViewProject=function(vieMat,proMat,vieProNoTraSca){
		var cameraSV=this._shaderValues;
		cameraSV.setMatrix4x4(laya.d3.core.BaseCamera.VIEWMATRIX,vieMat);
		cameraSV.setMatrix4x4(laya.d3.core.BaseCamera.PROJECTMATRIX,proMat);
		this.transform.worldMatrix.cloneTo(BaseCamera._tempMatrix4x40);
		BaseCamera._tempMatrix4x40.transpose();
		Matrix4x4.multiply(proMat,BaseCamera._tempMatrix4x40,vieProNoTraSca);
		cameraSV.setMatrix4x4(laya.d3.core.BaseCamera.VPMATRIX_NO_TRANSLATE,vieProNoTraSca);
	}

	/**
	*相机渲染。
	*@param shader 着色器。
	*@param replacementTag 着色器替换标记。
	*/
	__proto.render=function(shader,replacementTag){}
	/**
	*增加可视图层,layer值为0到31层。
	*@param layer 图层。
	*/
	__proto.addLayer=function(layer){
		this.cullingMask |=Math.pow(2,layer);
	}

	/**
	*移除可视图层,layer值为0到31层。
	*@param layer 图层。
	*/
	__proto.removeLayer=function(layer){
		this.cullingMask &=~Math.pow(2,layer);
	}

	/**
	*增加所有图层。
	*/
	__proto.addAllLayers=function(){
		this.cullingMask=2147483647;
	}

	/**
	*移除所有图层。
	*/
	__proto.removeAllLayers=function(){
		this.cullingMask=0;
	}

	__proto.resetProjectionMatrix=function(){
		this._useUserProjectionMatrix=false;
		this._calculateProjectionMatrix();
	}

	/**
	*@inheritDoc
	*/
	__proto._onActive=function(){
		(this._scene)._addCamera(this);
	}

	/**
	*@inheritDoc
	*/
	__proto._onInActive=function(){
		(this._scene)._removeCamera(this);
	}

	/**
	*@inheritDoc
	*/
	__proto._parse=function(data){
		_super.prototype._parse.call(this,data);
		var clearFlagData=data.clearFlag;
		(clearFlagData!==undefined)&& (this.clearFlag=clearFlagData);
		this.orthographic=data.orthographic;
		this.fieldOfView=data.fieldOfView;
		this.nearPlane=data.nearPlane;
		this.farPlane=data.farPlane;
		var color=data.clearColor;
		this.clearColor=new Vector4(color[0],color[1],color[2],color[3]);
		var skyboxMaterial=data.skyboxMaterial;
		if (skyboxMaterial){
			this._skyRenderer.material=Loader.getRes(skyboxMaterial.path);
		}
	}

	/**
	*@inheritDoc
	*/
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this.renderTarget=null;
		this._skyRenderer.destroy();
		this._skyRenderer=null;
		Laya.stage.off(/*laya.events.Event.RESIZE*/"resize",this,this._onScreenSizeChanged);
		_super.prototype.destroy.call(this,destroyChild);
	}

	__getset(0,__proto,'renderingOrder',function(){
		return this._renderingOrder;
		},function(value){
		this._renderingOrder=value;
		this._sortCamerasByRenderingOrder();
	});

	/**
	*获取天空渲染器。
	*@return 天空渲染器。
	*/
	__getset(0,__proto,'skyRenderer',function(){
		return this._skyRenderer;
	});

	/**
	*设置远裁面。
	*@param value 远裁面。
	*/
	/**
	*获取远裁面。
	*@return 远裁面。
	*/
	__getset(0,__proto,'farPlane',function(){
		return this._farPlane;
		},function(vaule){
		this._farPlane=vaule;
		this._calculateProjectionMatrix();
	});

	/**
	*设置渲染场景的渲染目标。
	*@param value 渲染场景的渲染目标。
	*/
	/**
	*获取渲染场景的渲染目标。
	*@return 渲染场景的渲染目标。
	*/
	__getset(0,__proto,'renderTarget',function(){
		return this._renderTarget;
		},function(value){
		if (this._renderTarget!==value){
			this._renderTarget=value;
			this._calculateProjectionMatrix();
		}
	});

	/**
	*设置是否正交投影矩阵。
	*@param 是否正交投影矩阵。
	*/
	/**
	*获取是否正交投影矩阵。
	*@return 是否正交投影矩阵。
	*/
	__getset(0,__proto,'orthographic',function(){
		return this._orthographic;
		},function(vaule){
		this._orthographic=vaule;
		this._calculateProjectionMatrix();
	});

	/**
	*设置视野。
	*@param value 视野。
	*/
	/**
	*获取视野。
	*@return 视野。
	*/
	__getset(0,__proto,'fieldOfView',function(){
		return this._fieldOfView;
		},function(value){
		this._fieldOfView=value;
		this._calculateProjectionMatrix();
	});

	/**
	*设置近裁面。
	*@param value 近裁面。
	*/
	/**
	*获取近裁面。
	*@return 近裁面。
	*/
	__getset(0,__proto,'nearPlane',function(){
		return this._nearPlane;
		},function(value){
		this._nearPlane=value;
		this._calculateProjectionMatrix();
	});

	/**
	*设置正交投影垂直矩阵尺寸。
	*@param 正交投影垂直矩阵尺寸。
	*/
	/**
	*获取正交投影垂直矩阵尺寸。
	*@return 正交投影垂直矩阵尺寸。
	*/
	__getset(0,__proto,'orthographicVerticalSize',function(){
		return this._orthographicVerticalSize;
		},function(vaule){
		this._orthographicVerticalSize=vaule;
		this._calculateProjectionMatrix();
	});

	BaseCamera.VPMATRIX=3;
	BaseCamera.RENDERINGTYPE_DEFERREDLIGHTING="DEFERREDLIGHTING";
	BaseCamera.RENDERINGTYPE_FORWARDRENDERING="FORWARDRENDERING";
	BaseCamera.CLEARFLAG_SOLIDCOLOR=0;
	BaseCamera.CLEARFLAG_SKY=1;
	BaseCamera.CLEARFLAG_DEPTHONLY=2;
	BaseCamera.CLEARFLAG_NONE=3;
	__static(BaseCamera,
	['_tempMatrix4x40',function(){return this._tempMatrix4x40=new Matrix4x4();},'CAMERAPOS',function(){return this.CAMERAPOS=Shader3D.propertyNameToID("u_CameraPos");},'VIEWMATRIX',function(){return this.VIEWMATRIX=Shader3D.propertyNameToID("u_View");},'PROJECTMATRIX',function(){return this.PROJECTMATRIX=Shader3D.propertyNameToID("u_Projection");},'VPMATRIX_NO_TRANSLATE',function(){return this.VPMATRIX_NO_TRANSLATE=Shader3D.propertyNameToID("u_MvpMatrix");},'CAMERADIRECTION',function(){return this.CAMERADIRECTION=Shader3D.propertyNameToID("u_CameraDirection");},'CAMERAUP',function(){return this.CAMERAUP=Shader3D.propertyNameToID("u_CameraUp");},'_invertYScaleMatrix',function(){return this._invertYScaleMatrix=new Matrix4x4(1,0,0,0,0,-1,0,0,0,0,1,0,0,0,0,1);},'_invertYProjectionMatrix',function(){return this._invertYProjectionMatrix=new Matrix4x4();},'_invertYProjectionViewMatrix',function(){return this._invertYProjectionViewMatrix=new Matrix4x4();}
	]);
	return BaseCamera;
})(Sprite3D)


/**
*...
*@author ...
*/
//class laya.d3.core.material.TerrainMaterial extends laya.d3.core.material.BaseMaterial
var TerrainMaterial=(function(_super){
	function TerrainMaterial(){
		this._diffuseScale1=null;
		this._diffuseScale2=null;
		this._diffuseScale3=null;
		this._diffuseScale4=null;
		TerrainMaterial.__super.call(this);
		this.setShaderName("Terrain");
		this.renderMode=1;
		this._diffuseScale1=new Vector2();
		this._diffuseScale2=new Vector2();
		this._diffuseScale3=new Vector2();
		this._diffuseScale4=new Vector2();
		this.ambientColor=new Vector3(0.6,0.6,0.6);
		this.diffuseColor=new Vector3(1.0,1.0,1.0);
		this.specularColor=new Vector4(0.2,0.2,0.2,32.0);
	}

	__class(TerrainMaterial,'laya.d3.core.material.TerrainMaterial',_super);
	var __proto=TerrainMaterial.prototype;
	__proto.setDiffuseScale1=function(x,y){
		this._diffuseScale1.x=x;
		this._diffuseScale1.y=y;
		this._shaderValues.setVector(6,this._diffuseScale1);
	}

	__proto.setDiffuseScale2=function(x,y){
		this._diffuseScale2.x=x;
		this._diffuseScale2.y=y;
		this._shaderValues.setVector(7,this._diffuseScale2);
	}

	__proto.setDiffuseScale3=function(x,y){
		this._diffuseScale3.x=x;
		this._diffuseScale3.y=y;
		this._shaderValues.setVector(8,this._diffuseScale3);
	}

	__proto.setDiffuseScale4=function(x,y){
		this._diffuseScale4.x=x;
		this._diffuseScale4.y=y;
		this._shaderValues.setVector(9,this._diffuseScale4);
	}

	__proto.setDetailNum=function(value){
		switch (value){
			case 1:
				this._defineDatas.add(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				this._defineDatas.remove(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				this._defineDatas.remove(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				this._defineDatas.remove(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				break ;
			case 2:
				this._defineDatas.add(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				this._defineDatas.remove(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				this._defineDatas.remove(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				this._defineDatas.remove(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				break ;
			case 3:
				this._defineDatas.add(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				this._defineDatas.remove(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				this._defineDatas.remove(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				this._defineDatas.remove(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				break ;
			case 4:
				this._defineDatas.add(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				this._defineDatas.remove(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				this._defineDatas.remove(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				this._defineDatas.remove(laya.d3.core.material.TerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				break ;
			}
	}

	__proto.disableLight=function(){
		this._disablePublicDefineDatas.add(Scene3D.SHADERDEFINE_POINTLIGHT | Scene3D.SHADERDEFINE_SPOTLIGHT | Scene3D.SHADERDEFINE_DIRECTIONLIGHT);
	}

	/**
	*@inheritDoc
	*/
	__proto.setShaderName=function(name){
		_super.prototype.setShaderName.call(this,name);
	}

	/**
	*设置渲染模式。
	*@return 渲染模式。
	*/
	__getset(0,__proto,'renderMode',null,function(value){
		var renderState=this.getRenderState();
		switch (value){
			case 1:
				this.renderQueue=/*laya.d3.core.material.BaseMaterial.RENDERQUEUE_OPAQUE*/2000;
				renderState.depthWrite=true;
				renderState.cull=/*laya.d3.core.material.RenderState.CULL_BACK*/2;
				renderState.blend=/*laya.d3.core.material.RenderState.BLEND_DISABLE*/0;
				renderState.depthTest=/*laya.d3.core.material.RenderState.DEPTHTEST_LESS*/0x0201;
				break ;
			case 2:
				this.renderQueue=/*laya.d3.core.material.BaseMaterial.RENDERQUEUE_OPAQUE*/2000;
				renderState.depthWrite=false;
				renderState.cull=/*laya.d3.core.material.RenderState.CULL_BACK*/2;
				renderState.blend=/*laya.d3.core.material.RenderState.BLEND_ENABLE_ALL*/1;
				renderState.srcBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_SRC_ALPHA*/0x0302;
				renderState.dstBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA*/0x0303;
				renderState.depthTest=/*laya.d3.core.material.RenderState.DEPTHTEST_LEQUAL*/0x0203;
				break ;
			default :
				throw new Error("TerrainMaterial:renderMode value error.");
			}
	});

	/**
	*设置第二层贴图。
	*@param value 第二层贴图。
	*/
	/**
	*获取第二层贴图。
	*@return 第二层贴图。
	*/
	__getset(0,__proto,'diffuseTexture2',function(){
		return this._shaderValues.getTexture(3);
		},function(value){
		this._shaderValues.setTexture(3,value);
	});

	__getset(0,__proto,'ambientColor',function(){
		return this._shaderValues.getVector(10);
		},function(value){
		this._shaderValues.setVector(10,value);
	});

	/**
	*设置第四层贴图。
	*@param value 第四层贴图。
	*/
	/**
	*获取第四层贴图。
	*@return 第四层贴图。
	*/
	__getset(0,__proto,'diffuseTexture4',function(){
		return this._shaderValues.getTexture(5);
		},function(value){
		this._shaderValues.setTexture(5,value);
	});

	__getset(0,__proto,'diffuseColor',function(){
		return this._shaderValues.getVector(11);
		},function(value){
		this._shaderValues.setVector(11,value);
	});

	/**
	*设置第一层贴图。
	*@param value 第一层贴图。
	*/
	/**
	*获取第一层贴图。
	*@return 第一层贴图。
	*/
	__getset(0,__proto,'diffuseTexture1',function(){
		return this._shaderValues.getTexture(2);
		},function(value){
		this._shaderValues.setTexture(2,value);
	});

	__getset(0,__proto,'specularColor',function(){
		return this._shaderValues.getVector(12);
		},function(value){
		this._shaderValues.setVector(12,value);
	});

	/**
	*设置第三层贴图。
	*@param value 第三层贴图。
	*/
	/**
	*获取第三层贴图。
	*@return 第三层贴图。
	*/
	__getset(0,__proto,'diffuseTexture3',function(){
		return this._shaderValues.getTexture(4);
		},function(value){
		this._shaderValues.setTexture(4,value);
	});

	/**
	*设置splatAlpha贴图。
	*@param value splatAlpha贴图。
	*/
	/**
	*获取splatAlpha贴图。
	*@return splatAlpha贴图。
	*/
	__getset(0,__proto,'splatAlphaTexture',function(){
		return this._shaderValues.getTexture(0);
		},function(value){
		this._shaderValues.setTexture(0,value);
	});

	__getset(0,__proto,'normalTexture',function(){
		return this._shaderValues.getTexture(1);
		},function(value){
		this._shaderValues.setTexture(1,value);
	});

	TerrainMaterial.__init__=function(){
		TerrainMaterial.SHADERDEFINE_DETAIL_NUM1=TerrainMaterial.shaderDefines.registerDefine("DETAIL_NUM1");
		TerrainMaterial.SHADERDEFINE_DETAIL_NUM2=TerrainMaterial.shaderDefines.registerDefine("DETAIL_NUM2");
		TerrainMaterial.SHADERDEFINE_DETAIL_NUM4=TerrainMaterial.shaderDefines.registerDefine("DETAIL_NUM4");
		TerrainMaterial.SHADERDEFINE_DETAIL_NUM3=TerrainMaterial.shaderDefines.registerDefine("DETAIL_NUM3");
	}

	TerrainMaterial.RENDERMODE_OPAQUE=1;
	TerrainMaterial.RENDERMODE_TRANSPARENT=2;
	TerrainMaterial.SPLATALPHATEXTURE=0;
	TerrainMaterial.NORMALTEXTURE=1;
	TerrainMaterial.DIFFUSETEXTURE1=2;
	TerrainMaterial.DIFFUSETEXTURE2=3;
	TerrainMaterial.DIFFUSETEXTURE3=4;
	TerrainMaterial.DIFFUSETEXTURE4=5;
	TerrainMaterial.DIFFUSESCALE1=6;
	TerrainMaterial.DIFFUSESCALE2=7;
	TerrainMaterial.DIFFUSESCALE3=8;
	TerrainMaterial.DIFFUSESCALE4=9;
	TerrainMaterial.MATERIALAMBIENT=10;
	TerrainMaterial.MATERIALDIFFUSE=11;
	TerrainMaterial.MATERIALSPECULAR=12;
	TerrainMaterial.SHADERDEFINE_DETAIL_NUM1=0;
	TerrainMaterial.SHADERDEFINE_DETAIL_NUM2=0;
	TerrainMaterial.SHADERDEFINE_DETAIL_NUM3=0;
	TerrainMaterial.SHADERDEFINE_DETAIL_NUM4=0;
	__static(TerrainMaterial,
	['defaultMaterial',function(){return this.defaultMaterial=new TerrainMaterial();},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines(BaseMaterial.shaderDefines);}
	]);
	return TerrainMaterial;
})(BaseMaterial)


/**
*...
*@author wzy
*/
//class laya.d3.core.material.EffectMaterial extends laya.d3.core.material.BaseMaterial
var EffectMaterial=(function(_super){
	function EffectMaterial(){
		/**@private */
		this._color=null;
		EffectMaterial.__super.call(this);
		this.setShaderName("Effect");
		this._color=new Vector4(1.0,1.0,1.0,1.0);
		this._shaderValues.setVector(EffectMaterial.TINTCOLOR,new Vector4(1.0,1.0,1.0,1.0));
	}

	__class(EffectMaterial,'laya.d3.core.material.EffectMaterial',_super);
	var __proto=EffectMaterial.prototype;
	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_TintColorB',function(){
		return this._color.elements[2];
		},function(value){
		this._color.elements[2]=value;
		this.color=this._color;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STZ',function(){
		return this._shaderValues.getVector(EffectMaterial.TILINGOFFSET).elements[2];
		},function(z){
		var tilOff=this._shaderValues.getVector(EffectMaterial.TILINGOFFSET);
		tilOff.elements[2]=z;
		this.tilingOffset=tilOff;
	});

	/**
	*设置贴图。
	*@param value 贴图。
	*/
	/**
	*获取贴图。
	*@return 贴图。
	*/
	__getset(0,__proto,'texture',function(){
		return this._shaderValues.getTexture(EffectMaterial.MAINTEXTURE);
		},function(value){
		if (value)
			this._defineDatas.add(laya.d3.core.material.EffectMaterial.SHADERDEFINE_MAINTEXTURE);
		else
		this._defineDatas.remove(laya.d3.core.material.EffectMaterial.SHADERDEFINE_MAINTEXTURE);
		this._shaderValues.setTexture(EffectMaterial.MAINTEXTURE,value);
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_TintColorR',function(){
		return this._color.elements[0];
		},function(value){
		this._color.elements[0]=value;
		this.color=this._color;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STW',function(){
		return this._shaderValues.getVector(EffectMaterial.TILINGOFFSET).elements[3];
		},function(w){
		var tilOff=this._shaderValues.getVector(EffectMaterial.TILINGOFFSET);
		tilOff.elements[3]=w;
		this.tilingOffset=tilOff;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_TintColorG',function(){
		return this._color.elements[1];
		},function(value){
		this._color.elements[1]=value;
		this.color=this._color;
	});

	/**
	*@private
	*/
	/**@private */
	__getset(0,__proto,'_TintColorA',function(){
		return this._color.elements[3];
		},function(value){
		this._color.elements[3]=value;
		this.color=this._color;
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STY',function(){
		return this._shaderValues.getVector(EffectMaterial.TILINGOFFSET).elements[1];
		},function(y){
		var tilOff=this._shaderValues.getVector(EffectMaterial.TILINGOFFSET);
		tilOff.elements[1]=y;
		this.tilingOffset=tilOff;
	});

	/**
	*设置渲染模式。
	*@return 渲染模式。
	*/
	__getset(0,__proto,'renderMode',null,function(value){
		var renderState=this.getRenderState();
		switch (value){
			case 0:
				this.renderQueue=/*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
				this.alphaTest=false;
				renderState.depthWrite=false;
				renderState.cull=/*laya.d3.core.material.RenderState.CULL_NONE*/0;
				renderState.blend=/*laya.d3.core.material.RenderState.BLEND_ENABLE_ALL*/1;
				renderState.srcBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_SRC_ALPHA*/0x0302;
				renderState.dstBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_ONE*/1;
				renderState.depthTest=/*laya.d3.core.material.RenderState.DEPTHTEST_LESS*/0x0201;
				this._defineDatas.add(EffectMaterial.SHADERDEFINE_ADDTIVEFOG);
				break ;
			case 1:
				this.renderQueue=/*laya.d3.core.material.BaseMaterial.RENDERQUEUE_TRANSPARENT*/3000;
				this.alphaTest=false;
				renderState.depthWrite=false;
				renderState.cull=/*laya.d3.core.material.RenderState.CULL_NONE*/0;
				renderState.blend=/*laya.d3.core.material.RenderState.BLEND_ENABLE_ALL*/1;
				renderState.srcBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_SRC_ALPHA*/0x0302;
				renderState.dstBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA*/0x0303;
				renderState.depthTest=/*laya.d3.core.material.RenderState.DEPTHTEST_LESS*/0x0201;
				this._defineDatas.remove(EffectMaterial.SHADERDEFINE_ADDTIVEFOG);
				break ;
			default :
				throw new Error("MeshEffectMaterial : renderMode value error.");
			}
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'_MainTex_STX',function(){
		return this._shaderValues.getVector(EffectMaterial.TILINGOFFSET).elements[0];
		},function(x){
		var tilOff=this._shaderValues.getVector(EffectMaterial.TILINGOFFSET);
		tilOff.elements[0]=x;
		this.tilingOffset=tilOff;
	});

	/**
	*设置颜色R分量。
	*@param value 颜色R分量。
	*/
	/**
	*获取颜色R分量。
	*@return 颜色R分量。
	*/
	__getset(0,__proto,'colorR',function(){
		return this._TintColorR;
		},function(value){
		this._TintColorR=value;
	});

	/**
	*设置颜色G分量。
	*@param value 颜色G分量。
	*/
	/**
	*获取颜色G分量。
	*@return 颜色G分量。
	*/
	__getset(0,__proto,'colorG',function(){
		return this._TintColorG;
		},function(value){
		this._TintColorG=value;
	});

	/**
	*设置颜色B分量。
	*@param value 颜色B分量。
	*/
	/**
	*获取颜色B分量。
	*@return 颜色B分量。
	*/
	__getset(0,__proto,'colorB',function(){
		return this._TintColorB;
		},function(value){
		this._TintColorB=value;
	});

	/**
	*设置颜色alpha分量。
	*@param value 颜色alpha分量。
	*/
	/**
	*获取颜色Z分量。
	*@return 颜色Z分量。
	*/
	__getset(0,__proto,'colorA',function(){
		return this._TintColorA;
		},function(value){
		this._TintColorA=value;
	});

	/**
	*设置颜色。
	*@param value 颜色。
	*/
	/**
	*获取颜色。
	*@return 颜色。
	*/
	__getset(0,__proto,'color',function(){
		return this._shaderValues.getVector(EffectMaterial.TINTCOLOR);
		},function(value){
		this._shaderValues.setVector(EffectMaterial.TINTCOLOR,value);
	});

	/**
	*获取纹理平铺和偏移X分量。
	*@param x 纹理平铺和偏移X分量。
	*/
	/**
	*获取纹理平铺和偏移X分量。
	*@return 纹理平铺和偏移X分量。
	*/
	__getset(0,__proto,'tilingOffsetX',function(){
		return this._MainTex_STX;
		},function(x){
		this._MainTex_STX=x;
	});

	/**
	*获取纹理平铺和偏移Y分量。
	*@param y 纹理平铺和偏移Y分量。
	*/
	/**
	*获取纹理平铺和偏移Y分量。
	*@return 纹理平铺和偏移Y分量。
	*/
	__getset(0,__proto,'tilingOffsetY',function(){
		return this._MainTex_STY;
		},function(y){
		this._MainTex_STY=y;
	});

	/**
	*获取纹理平铺和偏移Z分量。
	*@param z 纹理平铺和偏移Z分量。
	*/
	/**
	*获取纹理平铺和偏移Z分量。
	*@return 纹理平铺和偏移Z分量。
	*/
	__getset(0,__proto,'tilingOffsetZ',function(){
		return this._MainTex_STZ;
		},function(z){
		this._MainTex_STZ=z;
	});

	/**
	*获取纹理平铺和偏移W分量。
	*@param w 纹理平铺和偏移W分量。
	*/
	/**
	*获取纹理平铺和偏移W分量。
	*@return 纹理平铺和偏移W分量。
	*/
	__getset(0,__proto,'tilingOffsetW',function(){
		return this._MainTex_STW;
		},function(w){
		this._MainTex_STW=w;
	});

	/**
	*设置纹理平铺和偏移。
	*@param value 纹理平铺和偏移。
	*/
	/**
	*获取纹理平铺和偏移。
	*@return 纹理平铺和偏移。
	*/
	__getset(0,__proto,'tilingOffset',function(){
		return this._shaderValues.getVector(EffectMaterial.TILINGOFFSET);
		},function(value){
		if (value){
			var valueE=value.elements;
			if (valueE[0] !=1 || valueE[1] !=1 || valueE[2] !=0 || valueE[3] !=0)
				this._defineDatas.add(laya.d3.core.material.EffectMaterial.SHADERDEFINE_TILINGOFFSET);
			else
			this._defineDatas.remove(laya.d3.core.material.EffectMaterial.SHADERDEFINE_TILINGOFFSET);
			}else {
			this._defineDatas.remove(laya.d3.core.material.EffectMaterial.SHADERDEFINE_TILINGOFFSET);
		}
		this._shaderValues.setVector(EffectMaterial.TILINGOFFSET,value);
	});

	EffectMaterial.__init__=function(){
		EffectMaterial.SHADERDEFINE_MAINTEXTURE=EffectMaterial.shaderDefines.registerDefine("MAINTEXTURE");
		EffectMaterial.SHADERDEFINE_TILINGOFFSET=EffectMaterial.shaderDefines.registerDefine("TILINGOFFSET");
		EffectMaterial.SHADERDEFINE_ADDTIVEFOG=EffectMaterial.shaderDefines.registerDefine("ADDTIVEFOG");
	}

	EffectMaterial.RENDERMODE_ADDTIVE=0;
	EffectMaterial.RENDERMODE_ALPHABLENDED=1;
	EffectMaterial.SHADERDEFINE_MAINTEXTURE=0;
	EffectMaterial.SHADERDEFINE_TILINGOFFSET=0;
	EffectMaterial.SHADERDEFINE_ADDTIVEFOG=0;
	__static(EffectMaterial,
	['defaultMaterial',function(){return this.defaultMaterial=new EffectMaterial();},'MAINTEXTURE',function(){return this.MAINTEXTURE=Shader3D.propertyNameToID("u_AlbedoTexture");},'TINTCOLOR',function(){return this.TINTCOLOR=Shader3D.propertyNameToID("u_AlbedoColor");},'TILINGOFFSET',function(){return this.TILINGOFFSET=Shader3D.propertyNameToID("u_TilingOffset");},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines(BaseMaterial.shaderDefines);}
	]);
	return EffectMaterial;
})(BaseMaterial)


/**
*...
*@author
*/
//class laya.d3.core.material.WaterPrimaryMaterial extends laya.d3.core.material.BaseMaterial
var WaterPrimaryMaterial=(function(_super){
	function WaterPrimaryMaterial(){
		WaterPrimaryMaterial.__super.call(this);
		this.setShaderName("WaterPrimary");
		this._shaderValues.setVector(WaterPrimaryMaterial.HORIZONCOLOR,new Vector4(0.172 ,0.463 ,0.435 ,0));
		this._shaderValues.setNumber(WaterPrimaryMaterial.WAVESCALE,0.15);
		this._shaderValues.setVector(WaterPrimaryMaterial.WAVESPEED,new Vector4(19,9,-16,-7));
	}

	__class(WaterPrimaryMaterial,'laya.d3.core.material.WaterPrimaryMaterial',_super);
	var __proto=WaterPrimaryMaterial.prototype;
	/**
	*设置波动速率。
	*@param value 波动速率。
	*/
	/**
	*获取波动速率。
	*@return 波动速率。
	*/
	__getset(0,__proto,'waveSpeed',function(){
		return this._shaderValues.getVector(WaterPrimaryMaterial.WAVESPEED);
		},function(value){
		this._shaderValues.setVector(WaterPrimaryMaterial.WAVESPEED,value);
	});

	/**
	*设置地平线颜色。
	*@param value 地平线颜色。
	*/
	/**
	*获取地平线颜色。
	*@return 地平线颜色。
	*/
	__getset(0,__proto,'horizonColor',function(){
		return this._shaderValues.getVector(WaterPrimaryMaterial.HORIZONCOLOR);
		},function(value){
		this._shaderValues.setVector(WaterPrimaryMaterial.HORIZONCOLOR,value);
	});

	/**
	*设置主贴图。
	*@param value 主贴图。
	*/
	/**
	*获取主贴图。
	*@return 主贴图。
	*/
	__getset(0,__proto,'mainTexture',function(){
		return this._shaderValues.getTexture(WaterPrimaryMaterial.MAINTEXTURE);
		},function(value){
		if (value)
			this._defineDatas.add(laya.d3.core.material.WaterPrimaryMaterial.SHADERDEFINE_MAINTEXTURE);
		else
		this._defineDatas.remove(laya.d3.core.material.WaterPrimaryMaterial.SHADERDEFINE_MAINTEXTURE);
		this._shaderValues.setTexture(WaterPrimaryMaterial.MAINTEXTURE,value);
	});

	/**
	*设置法线贴图。
	*@param value 法线贴图。
	*/
	/**
	*获取法线贴图。
	*@return 法线贴图。
	*/
	__getset(0,__proto,'normalTexture',function(){
		return this._shaderValues.getTexture(WaterPrimaryMaterial.NORMALTEXTURE);
		},function(value){
		if (value)
			this._defineDatas.add(laya.d3.core.material.WaterPrimaryMaterial.SHADERDEFINE_NORMALTEXTURE);
		else
		this._defineDatas.remove(laya.d3.core.material.WaterPrimaryMaterial.SHADERDEFINE_NORMALTEXTURE);
		this._shaderValues.setTexture(WaterPrimaryMaterial.NORMALTEXTURE,value);
	});

	/**
	*设置波动缩放系数。
	*@param value 波动缩放系数。
	*/
	/**
	*获取波动缩放系数。
	*@return 波动缩放系数。
	*/
	__getset(0,__proto,'waveScale',function(){
		return this._shaderValues.getNumber(WaterPrimaryMaterial.WAVESCALE);
		},function(value){
		this._shaderValues.setNumber(WaterPrimaryMaterial.WAVESCALE,value);
	});

	WaterPrimaryMaterial.__init__=function(){
		WaterPrimaryMaterial.SHADERDEFINE_MAINTEXTURE=WaterPrimaryMaterial.shaderDefines.registerDefine("MAINTEXTURE");
		WaterPrimaryMaterial.SHADERDEFINE_NORMALTEXTURE=WaterPrimaryMaterial.shaderDefines.registerDefine("NORMALTEXTURE");
	}

	WaterPrimaryMaterial.SHADERDEFINE_MAINTEXTURE=0;
	WaterPrimaryMaterial.SHADERDEFINE_NORMALTEXTURE=0;
	__static(WaterPrimaryMaterial,
	['HORIZONCOLOR',function(){return this.HORIZONCOLOR=Shader3D.propertyNameToID("u_HorizonColor");},'MAINTEXTURE',function(){return this.MAINTEXTURE=Shader3D.propertyNameToID("u_MainTexture");},'NORMALTEXTURE',function(){return this.NORMALTEXTURE=Shader3D.propertyNameToID("u_NormalTexture");},'WAVESCALE',function(){return this.WAVESCALE=Shader3D.propertyNameToID("u_WaveScale");},'WAVESPEED',function(){return this.WAVESPEED=Shader3D.propertyNameToID("u_WaveSpeed");},'defaultMaterial',function(){return this.defaultMaterial=new WaterPrimaryMaterial();},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines(BaseMaterial.shaderDefines);}
	]);
	return WaterPrimaryMaterial;
})(BaseMaterial)


/**
*...
*@author ...
*/
//class laya.d3.core.material.ExtendTerrainMaterial extends laya.d3.core.material.BaseMaterial
var ExtendTerrainMaterial=(function(_super){
	function ExtendTerrainMaterial(){
		/**@private */
		this._enableLighting=true;
		ExtendTerrainMaterial.__super.call(this);
		this.setShaderName("ExtendTerrain");
		this.renderMode=1;
	}

	__class(ExtendTerrainMaterial,'laya.d3.core.material.ExtendTerrainMaterial',_super);
	var __proto=ExtendTerrainMaterial.prototype;
	__proto._setDetailNum=function(value){
		switch (value){
			case 1:
				this._defineDatas.add(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
				break ;
			case 2:
				this._defineDatas.add(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
				break ;
			case 3:
				this._defineDatas.add(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
				break ;
			case 4:
				this._defineDatas.add(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
				break ;
			case 5:
				this._defineDatas.add(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
				this._defineDatas.remove(laya.d3.core.material.ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
				break ;
			}
	}

	__getset(0,__proto,'diffuseScaleOffset2',null,function(scaleOffset2){
		this._shaderValues.setVector(ExtendTerrainMaterial.DIFFUSESCALEOFFSET2,scaleOffset2);
	});

	/**
	*设置splatAlpha贴图。
	*@param value splatAlpha贴图。
	*/
	/**
	*获取splatAlpha贴图。
	*@return splatAlpha贴图。
	*/
	__getset(0,__proto,'splatAlphaTexture',function(){
		return this._shaderValues.getTexture(ExtendTerrainMaterial.SPLATALPHATEXTURE);
		},function(value){
		this._shaderValues.setTexture(ExtendTerrainMaterial.SPLATALPHATEXTURE,value);
	});

	__getset(0,__proto,'diffuseScaleOffset3',null,function(scaleOffset3){
		this._shaderValues.setVector(ExtendTerrainMaterial.DIFFUSESCALEOFFSET3,scaleOffset3);
	});

	/**
	*设置第一层贴图。
	*@param value 第一层贴图。
	*/
	__getset(0,__proto,'diffuseTexture1',null,function(value){
		this._shaderValues.setTexture(ExtendTerrainMaterial.DIFFUSETEXTURE1,value);
		this._setDetailNum(1);
	});

	/**
	*设置渲染模式。
	*@return 渲染模式。
	*/
	__getset(0,__proto,'renderMode',null,function(value){
		var renderState=this.getRenderState();
		switch (value){
			case 1:
				this.renderQueue=/*laya.d3.core.material.BaseMaterial.RENDERQUEUE_OPAQUE*/2000;
				renderState.depthWrite=true;
				renderState.cull=/*laya.d3.core.material.RenderState.CULL_BACK*/2;
				renderState.blend=/*laya.d3.core.material.RenderState.BLEND_DISABLE*/0;
				renderState.depthTest=/*laya.d3.core.material.RenderState.DEPTHTEST_LESS*/0x0201;
				break ;
			case 2:
				this.renderQueue=/*laya.d3.core.material.BaseMaterial.RENDERQUEUE_OPAQUE*/2000;
				renderState.depthWrite=false;
				renderState.cull=/*laya.d3.core.material.RenderState.CULL_BACK*/2;
				renderState.blend=/*laya.d3.core.material.RenderState.BLEND_ENABLE_ALL*/1;
				renderState.srcBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_SRC_ALPHA*/0x0302;
				renderState.dstBlend=/*laya.d3.core.material.RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA*/0x0303;
				renderState.depthTest=/*laya.d3.core.material.RenderState.DEPTHTEST_LEQUAL*/0x0203;
				break ;
			default :
				throw new Error("ExtendTerrainMaterial:renderMode value error.");
			}
	});

	/**
	*设置第二层贴图。
	*@param value 第二层贴图。
	*/
	/**
	*获取第二层贴图。
	*@return 第二层贴图。
	*/
	__getset(0,__proto,'diffuseTexture2',function(){
		return this._shaderValues.getTexture(ExtendTerrainMaterial.DIFFUSETEXTURE2);
		},function(value){
		this._shaderValues.setTexture(ExtendTerrainMaterial.DIFFUSETEXTURE2,value);
		this._setDetailNum(2);
	});

	__getset(0,__proto,'diffuseScaleOffset1',null,function(scaleOffset1){
		this._shaderValues.setVector(ExtendTerrainMaterial.DIFFUSESCALEOFFSET1,scaleOffset1);
	});

	/**
	*设置第三层贴图。
	*@param value 第三层贴图。
	*/
	/**
	*获取第三层贴图。
	*@return 第三层贴图。
	*/
	__getset(0,__proto,'diffuseTexture3',function(){
		return this._shaderValues.getTexture(ExtendTerrainMaterial.DIFFUSETEXTURE3);
		},function(value){
		this._shaderValues.setTexture(ExtendTerrainMaterial.DIFFUSETEXTURE3,value);
		this._setDetailNum(3);
	});

	/**
	*设置第四层贴图。
	*@param value 第四层贴图。
	*/
	/**
	*获取第四层贴图。
	*@return 第四层贴图。
	*/
	__getset(0,__proto,'diffuseTexture4',function(){
		return this._shaderValues.getTexture(ExtendTerrainMaterial.DIFFUSETEXTURE4);
		},function(value){
		this._shaderValues.setTexture(ExtendTerrainMaterial.DIFFUSETEXTURE4,value);
		this._setDetailNum(4);
	});

	/**
	*设置第五层贴图。
	*@param value 第五层贴图。
	*/
	/**
	*获取第五层贴图。
	*@return 第五层贴图。
	*/
	__getset(0,__proto,'diffuseTexture5',function(){
		return this._shaderValues.getTexture(ExtendTerrainMaterial.DIFFUSETEXTURE5);
		},function(value){
		this._shaderValues.setTexture(ExtendTerrainMaterial.DIFFUSETEXTURE5,value);
		this._setDetailNum(5);
	});

	__getset(0,__proto,'diffuseScaleOffset4',null,function(scaleOffset4){
		this._shaderValues.setVector(ExtendTerrainMaterial.DIFFUSESCALEOFFSET4,scaleOffset4);
	});

	__getset(0,__proto,'diffuseScaleOffset5',null,function(scaleOffset5){
		this._shaderValues.setVector(ExtendTerrainMaterial.DIFFUSESCALEOFFSET5,scaleOffset5);
	});

	/**
	*设置是否启用光照。
	*@param value 是否启用光照。
	*/
	/**
	*获取是否启用光照。
	*@return 是否启用光照。
	*/
	__getset(0,__proto,'enableLighting',function(){
		return this._enableLighting;
		},function(value){
		if (this._enableLighting!==value){
			if (value)
				this._disablePublicDefineDatas.remove(Scene3D.SHADERDEFINE_POINTLIGHT | Scene3D.SHADERDEFINE_SPOTLIGHT | Scene3D.SHADERDEFINE_DIRECTIONLIGHT);
			else
			this._disablePublicDefineDatas.add(Scene3D.SHADERDEFINE_POINTLIGHT | Scene3D.SHADERDEFINE_SPOTLIGHT | Scene3D.SHADERDEFINE_DIRECTIONLIGHT);
			this._enableLighting=value;
		}
	});

	ExtendTerrainMaterial.__init__=function(){
		ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM1=ExtendTerrainMaterial.shaderDefines.registerDefine("ExtendTerrain_DETAIL_NUM1");
		ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM2=ExtendTerrainMaterial.shaderDefines.registerDefine("ExtendTerrain_DETAIL_NUM2");
		ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM3=ExtendTerrainMaterial.shaderDefines.registerDefine("ExtendTerrain_DETAIL_NUM3");
		ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM4=ExtendTerrainMaterial.shaderDefines.registerDefine("ExtendTerrain_DETAIL_NUM4");
		ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM5=ExtendTerrainMaterial.shaderDefines.registerDefine("ExtendTerrain_DETAIL_NUM5");
	}

	ExtendTerrainMaterial.RENDERMODE_OPAQUE=1;
	ExtendTerrainMaterial.RENDERMODE_TRANSPARENT=2;
	ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM1=0;
	ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM2=0;
	ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM3=0;
	ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM4=0;
	ExtendTerrainMaterial.SHADERDEFINE_DETAIL_NUM5=0;
	__static(ExtendTerrainMaterial,
	['SPLATALPHATEXTURE',function(){return this.SPLATALPHATEXTURE=Shader3D.propertyNameToID("u_SplatAlphaTexture");},'DIFFUSETEXTURE1',function(){return this.DIFFUSETEXTURE1=Shader3D.propertyNameToID("u_DiffuseTexture1");},'DIFFUSETEXTURE2',function(){return this.DIFFUSETEXTURE2=Shader3D.propertyNameToID("u_DiffuseTexture2");},'DIFFUSETEXTURE3',function(){return this.DIFFUSETEXTURE3=Shader3D.propertyNameToID("u_DiffuseTexture3");},'DIFFUSETEXTURE4',function(){return this.DIFFUSETEXTURE4=Shader3D.propertyNameToID("u_DiffuseTexture4");},'DIFFUSETEXTURE5',function(){return this.DIFFUSETEXTURE5=Shader3D.propertyNameToID("u_DiffuseTexture5");},'DIFFUSESCALEOFFSET1',function(){return this.DIFFUSESCALEOFFSET1=Shader3D.propertyNameToID("u_DiffuseScaleOffset1");},'DIFFUSESCALEOFFSET2',function(){return this.DIFFUSESCALEOFFSET2=Shader3D.propertyNameToID("u_DiffuseScaleOffset2");},'DIFFUSESCALEOFFSET3',function(){return this.DIFFUSESCALEOFFSET3=Shader3D.propertyNameToID("u_DiffuseScaleOffset3");},'DIFFUSESCALEOFFSET4',function(){return this.DIFFUSESCALEOFFSET4=Shader3D.propertyNameToID("u_DiffuseScaleOffset4");},'DIFFUSESCALEOFFSET5',function(){return this.DIFFUSESCALEOFFSET5=Shader3D.propertyNameToID("u_DiffuseScaleOffset5");},'shaderDefines',function(){return this.shaderDefines=new ShaderDefines(BaseMaterial.shaderDefines);}
	]);
	return ExtendTerrainMaterial;
})(BaseMaterial)


/**

*/
*/
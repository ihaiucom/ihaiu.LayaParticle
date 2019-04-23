/**
*<code>Camera</code> 类用于创建摄像机。
*/
//class laya.d3.core.Camera extends laya.d3.core.BaseCamera
var Camera=(function(_super){
	function Camera(aspectRatio,nearPlane,farPlane){
		/**@private */
		//this._aspectRatio=NaN;
		/**@private */
		//this._viewport=null;
		/**@private */
		//this._normalizedViewport=null;
		/**@private */
		//this._viewMatrix=null;
		/**@private */
		//this._projectionMatrix=null;
		/**@private */
		//this._projectionViewMatrix=null;
		/**@private */
		//this._projectionViewMatrixNoTranslateScale=null;
		/**@private */
		//this._boundFrustum=null;
		/**@private */
		this._updateViewMatrix=true;
		/**@private [NATIVE]*/
		//this._boundFrustumBuffer=null;
		/**是否允许渲染。*/
		this.enableRender=true;
		(aspectRatio===void 0)&& (aspectRatio=0);
		(nearPlane===void 0)&& (nearPlane=0.3);
		(farPlane===void 0)&& (farPlane=1000);
		this._viewMatrix=new Matrix4x4();
		this._projectionMatrix=new Matrix4x4();
		this._projectionViewMatrix=new Matrix4x4();
		this._projectionViewMatrixNoTranslateScale=new Matrix4x4();
		this._viewport=new Viewport(0,0,0,0);
		this._normalizedViewport=new Viewport(0,0,1,1);
		this._aspectRatio=aspectRatio;
		this._boundFrustum=new BoundFrustum(Matrix4x4.DEFAULT);
		if (Render.isConchApp)
			this._boundFrustumBuffer=new Float32Array(24);
		Camera.__super.call(this,nearPlane,farPlane);
		this.transform.on(/*laya.events.Event.TRANSFORM_CHANGED*/"transformchanged",this,this._onTransformChanged);
	}

	__class(Camera,'laya.d3.core.Camera',_super);
	var __proto=Camera.prototype;
	/**
	*@private
	*/
	__proto._onTransformChanged=function(flag){
		flag &=/*laya.d3.core.Transform3D.TRANSFORM_WORLDMATRIX*/0x40;
		(flag)&& (this._updateViewMatrix=true);
	}

	/**
	*@private
	*/
	__proto._calculationViewport=function(normalizedViewport,width,height){
		this._viewport.x=normalizedViewport.x *width;
		this._viewport.y=normalizedViewport.y *height;
		this._viewport.width=Math.min(Math.max(normalizedViewport.width *width,0),width);
		this._viewport.height=Math.min(Math.max(normalizedViewport.height *height,0),height);
	}

	/**
	*@inheritDoc
	*/
	__proto._parse=function(data){
		_super.prototype._parse.call(this,data);
		var viewport=data.viewport;
		this.normalizedViewport=new Viewport(viewport[0],viewport[1],viewport[2],viewport[3]);
	}

	/**
	*@inheritDoc
	*/
	__proto._calculateProjectionMatrix=function(){
		if (!this._useUserProjectionMatrix){
			if (this._orthographic){
				var halfWidth=this.orthographicVerticalSize *this.aspectRatio *0.5;
				var halfHeight=this.orthographicVerticalSize *0.5;
				Matrix4x4.createOrthoOffCenterRH(-halfWidth,halfWidth,-halfHeight,halfHeight,this.nearPlane,this.farPlane,this._projectionMatrix);
				}else {
				Matrix4x4.createPerspective(3.1416 *this.fieldOfView / 180.0,this.aspectRatio,this.nearPlane,this.farPlane,this._projectionMatrix);
			}
		}
	}

	/**
	*@inheritDoc
	*/
	__proto.render=function(shader,replacementTag){
		var gl=LayaGL.instance;
		var context=RenderContext3D._instance;
		var scene=context.scene=this._scene;
		if (!scene)
			return;
		if (scene.parallelSplitShadowMaps[0]){
			ShaderData.setRuntimeValueMode(false);
			var parallelSplitShadowMap=scene.parallelSplitShadowMaps[0];
			parallelSplitShadowMap._calcAllLightCameraInfo(this);
			scene._defineDatas.add(Scene3D.SHADERDEFINE_CAST_SHADOW);
			for (var i=0,n=parallelSplitShadowMap.shadowMapCount;i < n;i++){
				var smCamera=parallelSplitShadowMap.cameras[i];
				context.camera=smCamera;
				context.projectionViewMatrix=smCamera.projectionViewMatrix;
				FrustumCulling.renderObjectCulling(smCamera,scene,context,scene._castShadowRenders);
				var shadowMap=parallelSplitShadowMap.cameras[i+1].renderTarget;
				shadowMap.start();
				context.camera=smCamera;
				context.viewport=smCamera.viewport;
				smCamera._prepareCameraToRender();
				smCamera._prepareCameraViewProject(smCamera.viewMatrix,smCamera.projectionMatrix,smCamera._projectionViewMatrixNoTranslateScale);
				scene._clear(gl,context);
				var queue=scene._opaqueQueue;
				queue._render(context,false);
				shadowMap.end();
			}
			scene._defineDatas.remove(Scene3D.SHADERDEFINE_CAST_SHADOW);
			ShaderData.setRuntimeValueMode(true);
		}
		context.camera=this;
		scene._preRenderScript();
		var viewMat,projectMat;
		viewMat=context.viewMatrix=this.viewMatrix;
		var renderTar=this._renderTarget;
		if (renderTar){
			renderTar.start();
			Matrix4x4.multiply(BaseCamera._invertYScaleMatrix,this._projectionMatrix,BaseCamera._invertYProjectionMatrix);
			Matrix4x4.multiply(BaseCamera._invertYScaleMatrix,this.projectionViewMatrix,BaseCamera._invertYProjectionViewMatrix);
			projectMat=context.projectionMatrix=BaseCamera._invertYProjectionMatrix;
			context.projectionViewMatrix=BaseCamera._invertYProjectionViewMatrix;
			}else {
			projectMat=context.projectionMatrix=this._projectionMatrix;
			context.projectionViewMatrix=this.projectionViewMatrix;
		}
		context.viewport=this.viewport;
		this._prepareCameraToRender();
		this._prepareCameraViewProject(viewMat,projectMat,this._projectionViewMatrixNoTranslateScale);
		scene._preCulling(context,this);
		scene._clear(gl,context);
		scene._renderScene(gl,context,shader,replacementTag);
		scene._postRenderScript();
		(renderTar)&& (renderTar.end());
	}

	/**
	*计算从屏幕空间生成的射线。
	*@param point 屏幕空间的位置位置。
	*@return out 输出射线。
	*/
	__proto.viewportPointToRay=function(point,out){
		Picker.calculateCursorRay(point,this.viewport,this._projectionMatrix,this.viewMatrix,null,out);
	}

	/**
	*计算从裁切空间生成的射线。
	*@param point 裁切空间的位置。。
	*@return out 输出射线。
	*/
	__proto.normalizedViewportPointToRay=function(point,out){
		var finalPoint=Camera._tempVector20;
		var vp=this.viewport;
		var nVpPosE=point.elements;
		var vpPosE=finalPoint.elements;
		vpPosE[0]=nVpPosE[0] *vp.width;
		vpPosE[1]=nVpPosE[1] *vp.height;
		Picker.calculateCursorRay(finalPoint,this.viewport,this._projectionMatrix,this.viewMatrix,null,out);
	}

	/**
	*计算从世界空间准换三维坐标到屏幕空间。
	*@param position 世界空间的位置。
	*@return out 输出位置。
	*/
	__proto.worldToViewportPoint=function(position,out){
		Matrix4x4.multiply(this._projectionMatrix,this._viewMatrix,this._projectionViewMatrix);
		this.viewport.project(position,this._projectionViewMatrix,out);
		var outE=out.elements;
		outE[0]=outE[0] / Laya.stage.clientScaleX;
		outE[1]=outE[1] / Laya.stage.clientScaleY;
	}

	/**
	*计算从世界空间准换三维坐标到裁切空间。
	*@param position 世界空间的位置。
	*@return out 输出位置。
	*/
	__proto.worldToNormalizedViewportPoint=function(position,out){
		Matrix4x4.multiply(this._projectionMatrix,this._viewMatrix,this._projectionViewMatrix);
		this.normalizedViewport.project(position,this._projectionViewMatrix,out);
		var outE=out.elements;
		outE[0]=outE[0] / Laya.stage.clientScaleX;
		outE[1]=outE[1] / Laya.stage.clientScaleY;
	}

	/**
	*转换2D屏幕坐标系统到3D正交投影下的坐标系统，注:只有正交模型下有效。
	*@param source 源坐标。
	*@param out 输出坐标。
	*@return 是否转换成功。
	*/
	__proto.convertScreenCoordToOrthographicCoord=function(source,out){
		if (this._orthographic){
			var clientWidth=RenderContext3D.clientWidth;
			var clientHeight=RenderContext3D.clientHeight;
			var ratioX=this.orthographicVerticalSize *this.aspectRatio / clientWidth;
			var ratioY=this.orthographicVerticalSize / clientHeight;
			var sE=source.elements;
			var oE=out.elements;
			oE[0]=(-clientWidth / 2+sE[0])*ratioX;
			oE[1]=(clientHeight / 2-sE[1])*ratioY;
			oE[2]=(this.nearPlane-this.farPlane)*(sE[2]+1)/ 2-this.nearPlane;
			Vector3.transformCoordinate(out,this.transform.worldMatrix,out);
			return true;
			}else {
			return false;
		}
	}

	/**
	*@inheritDoc
	*/
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this.transform.off(/*laya.events.Event.TRANSFORM_CHANGED*/"transformchanged",this,this._onTransformChanged);
		_super.prototype.destroy.call(this,destroyChild);
	}

	/**
	*获取视图投影矩阵。
	*@return 视图投影矩阵。
	*/
	__getset(0,__proto,'projectionViewMatrix',function(){
		Matrix4x4.multiply(this.projectionMatrix,this.viewMatrix,this._projectionViewMatrix);
		return this._projectionViewMatrix;
	});

	/**
	*设置横纵比。
	*@param value 横纵比。
	*/
	/**
	*获取横纵比。
	*@return 横纵比。
	*/
	__getset(0,__proto,'aspectRatio',function(){
		if (this._aspectRatio===0){
			var vp=this.viewport;
			return vp.width / vp.height;
		}
		return this._aspectRatio;
		},function(value){
		if (value < 0)
			throw new Error("Camera: the aspect ratio has to be a positive real number.");
		this._aspectRatio=value;
		this._calculateProjectionMatrix();
	});

	/**
	*获取摄像机视锥。
	*/
	__getset(0,__proto,'boundFrustum',function(){
		this._boundFrustum.matrix=this.projectionViewMatrix;
		if (Render.isConchApp){
			var near=this._boundFrustum.near;
			var far=this._boundFrustum.far;
			var left=this._boundFrustum.left;
			var right=this._boundFrustum.right;
			var top=this._boundFrustum.top;
			var bottom=this._boundFrustum.bottom;
			var nearNE=near.normal.elements;
			var farNE=far.normal.elements;
			var leftNE=left.normal.elements;
			var rightNE=right.normal.elements;
			var topNE=top.normal.elements;
			var bottomNE=bottom.normal.elements;
			var buffer=this._boundFrustumBuffer;
			buffer[0]=nearNE[0],buffer[1]=nearNE[1],buffer[2]=nearNE[2],buffer[3]=near.distance;
			buffer[4]=farNE[0],buffer[5]=farNE[1],buffer[6]=farNE[2],buffer[7]=far.distance;
			buffer[8]=leftNE[0],buffer[9]=leftNE[1],buffer[10]=leftNE[2],buffer[11]=left.distance;
			buffer[12]=rightNE[0],buffer[13]=rightNE[1],buffer[14]=rightNE[2],buffer[15]=right.distance;
			buffer[16]=topNE[0],buffer[17]=topNE[1],buffer[18]=topNE[2],buffer[19]=top.distance;
			buffer[20]=bottomNE[0],buffer[21]=bottomNE[1],buffer[22]=bottomNE[2],buffer[23]=bottom.distance;
		}
		return this._boundFrustum;
	});

	/**
	*设置屏幕空间的视口。
	*@param 屏幕空间的视口。
	*/
	/**
	*获取屏幕空间的视口。
	*@return 屏幕空间的视口。
	*/
	__getset(0,__proto,'viewport',function(){
		var width=0;
		var height=0;
		if (this._renderTarget){
			width=this._renderTarget.width;
			height=this._renderTarget.height;
			}else {
			width=RenderContext3D.clientWidth;
			height=RenderContext3D.clientHeight;
		}
		if (width!==this._canvasWidth || height!==this._canvasHeight){
			this._calculationViewport(this._normalizedViewport,width,height);
			this._canvasWidth=width;
			this._canvasHeight=height;
		}
		return this._viewport;
		},function(value){
		var width=0;
		var height=0;
		if (this._renderTarget){
			width=this._canvasWidth=this._renderTarget.width;
			height=this._canvasHeight=this._renderTarget.height;
			}else {
			width=this._canvasWidth=RenderContext3D.clientWidth;
			height=this._canvasHeight=RenderContext3D.clientHeight;
		}
		this._normalizedViewport.x=value.x / width;
		this._normalizedViewport.y=value.y / height;
		this._normalizedViewport.width=value.width / width;
		this._normalizedViewport.height=value.height / height;
		this._calculationViewport(this._normalizedViewport,width,height);
		this._calculateProjectionMatrix();
	});

	/**
	*设置裁剪空间的视口。
	*@return 裁剪空间的视口。
	*/
	/**
	*获取裁剪空间的视口。
	*@return 裁剪空间的视口。
	*/
	__getset(0,__proto,'normalizedViewport',function(){
		return this._normalizedViewport;
		},function(value){
		var width=0;
		var height=0;
		if (this._renderTarget){
			width=this._canvasWidth=this._renderTarget.width;
			height=this._canvasHeight=this._renderTarget.height;
			}else {
			width=this._canvasWidth=RenderContext3D.clientWidth;
			height=this._canvasHeight=RenderContext3D.clientHeight;
		}
		this._normalizedViewport=value;
		this._calculationViewport(value,width,height);
		this._calculateProjectionMatrix();
	});

	/**设置投影矩阵。*/
	/**获取投影矩阵。*/
	__getset(0,__proto,'projectionMatrix',function(){
		return this._projectionMatrix;
		},function(value){
		this._projectionMatrix=value;
		this._useUserProjectionMatrix=true;
	});

	/**
	*获取视图矩阵。
	*@return 视图矩阵。
	*/
	__getset(0,__proto,'viewMatrix',function(){
		if (this._updateViewMatrix){
			var scale=this.transform.scale;
			var scaleX=scale.x;
			var scaleY=scale.y;
			var scaleZ=scale.z;
			var viewMatE=this._viewMatrix.elements;
			this.transform.worldMatrix.cloneTo(this._viewMatrix)
			viewMatE[0] /=scaleX;
			viewMatE[1] /=scaleX;
			viewMatE[2] /=scaleX;
			viewMatE[4] /=scaleY;
			viewMatE[5] /=scaleY;
			viewMatE[6] /=scaleY;
			viewMatE[8] /=scaleZ;
			viewMatE[9] /=scaleZ;
			viewMatE[10] /=scaleZ;
			this._viewMatrix.invert(this._viewMatrix);
			this._updateViewMatrix=false;
		}
		return this._viewMatrix;
	});

	__static(Camera,
	['_tempVector20',function(){return this._tempVector20=new Vector2();}
	]);
	return Camera;
})(BaseCamera)


/**

*/
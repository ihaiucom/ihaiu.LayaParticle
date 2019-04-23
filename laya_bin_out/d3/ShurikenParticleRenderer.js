/**
*<code>ShurikenParticleRender</code> 类用于创建3D粒子渲染器。
*/
//class laya.d3.core.particleShuriKen.ShurikenParticleRenderer extends laya.d3.core.render.BaseRender
var ShurikenParticleRenderer=(function(_super){
	function ShurikenParticleRenderer(owner){
		/**@private */
		//this._defaultBoundBox=null;
		/**@private */
		//this._renderMode=0;
		/**@private */
		//this._mesh=null;
		/**拉伸广告牌模式摄像机速度缩放,暂不支持。*/
		//this.stretchedBillboardCameraSpeedScale=NaN;
		/**拉伸广告牌模式速度缩放。*/
		//this.stretchedBillboardSpeedScale=NaN;
		/**拉伸广告牌模式长度缩放。*/
		//this.stretchedBillboardLengthScale=NaN;
		this._finalGravity=new Vector3();
		this._tempRotationMatrix=new Matrix4x4();
		ShurikenParticleRenderer.__super.call(this,owner);
		this._defaultBoundBox=new BoundBox(new Vector3(),new Vector3());
		this._renderMode=-1;
		this.stretchedBillboardCameraSpeedScale=0.0;
		this.stretchedBillboardSpeedScale=0.0;
		this.stretchedBillboardLengthScale=1.0;
	}

	__class(ShurikenParticleRenderer,'laya.d3.core.particleShuriKen.ShurikenParticleRenderer',_super);
	var __proto=ShurikenParticleRenderer.prototype;
	/**
	*@inheritDoc
	*/
	__proto._calculateBoundingBox=function(){
		var minE=this._boundingBox.min.elements;
		minE[0]=-Number.MAX_VALUE;
		minE[1]=-Number.MAX_VALUE;
		minE[2]=-Number.MAX_VALUE;
		var maxE=this._boundingBox.min.elements;
		maxE[0]=Number.MAX_VALUE;
		maxE[1]=Number.MAX_VALUE;
		maxE[2]=Number.MAX_VALUE;
	}

	/**
	*@inheritDoc
	*/
	__proto._calculateBoundingSphere=function(){
		var oriBoundSphere=(this._owner).particleSystem._boundingSphere;
		var maxScale=NaN;
		var transform=this._owner.transform;
		var scaleE=transform.scale.elements;
		var scaleX=Math.abs(scaleE[0]);
		var scaleY=Math.abs(scaleE[1]);
		var scaleZ=Math.abs(scaleE[2]);
		if (scaleX >=scaleY && scaleX >=scaleZ)
			maxScale=scaleX;
		else
		maxScale=scaleY >=scaleZ ? scaleY :scaleZ;
		Vector3.transformCoordinate(oriBoundSphere.center,transform.worldMatrix,this._boundingSphere.center);
		this._boundingSphere.radius=oriBoundSphere.radius *maxScale;
		if (Render.isConchApp){
			var centerE=this._boundingSphere.center.elements;
			var buffer=FrustumCulling._cullingBuffer;
			buffer[this._cullingBufferIndex+1]=centerE[0];
			buffer[this._cullingBufferIndex+2]=centerE[1];
			buffer[this._cullingBufferIndex+3]=centerE[2];
			buffer[this._cullingBufferIndex+4]=this._boundingSphere.radius;
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._needRender=function(boundFrustum){
		if (boundFrustum){
			if (boundFrustum.containsBoundSphere(this.boundingSphere)!==/*laya.d3.math.ContainmentType.Disjoint*/0){
				if ((this._owner).particleSystem.isAlive)
					return true;
				else
				return false;
				}else {
				return false;
			}
			}else {
			return true;
		}
	}

	/**
	*@inheritDoc
	*/
	__proto._renderUpdate=function(context,transfrom){
		var particleSystem=(this._owner).particleSystem;
		var sv=this._shaderValues;
		var transform=this._owner.transform;
		switch (particleSystem.simulationSpace){
			case 0:
				break ;
			case 1:
				sv.setVector(ShuriKenParticle3D.WORLDPOSITION,transform.position);
				sv.setQuaternion(ShuriKenParticle3D.WORLDROTATION,transform.rotation);
				break ;
			default :
				throw new Error("ShurikenParticleMaterial: SimulationSpace value is invalid.");
			}
		switch (particleSystem.scaleMode){
			case 0:;
				var scale=transform.scale;
				sv.setVector(ShuriKenParticle3D.POSITIONSCALE,scale);
				sv.setVector(ShuriKenParticle3D.SIZESCALE,scale);
				break ;
			case 1:;
				var localScale=transform.localScale;
				sv.setVector(ShuriKenParticle3D.POSITIONSCALE,localScale);
				sv.setVector(ShuriKenParticle3D.SIZESCALE,localScale);
				break ;
			case 2:
				sv.setVector(ShuriKenParticle3D.POSITIONSCALE,transform.scale);
				sv.setVector(ShuriKenParticle3D.SIZESCALE,Vector3.ONE);
				break ;
			}
		Vector3.scale(Physics3DUtils.gravity,particleSystem.gravityModifier,this._finalGravity);
		sv.setVector(ShuriKenParticle3D.GRAVITY,this._finalGravity);
		sv.setInt(ShuriKenParticle3D.SIMULATIONSPACE,particleSystem.simulationSpace);
		sv.setBool(ShuriKenParticle3D.THREEDSTARTROTATION,particleSystem.threeDStartRotation);
		sv.setInt(ShuriKenParticle3D.SCALINGMODE,particleSystem.scaleMode);
		sv.setNumber(ShuriKenParticle3D.STRETCHEDBILLBOARDLENGTHSCALE,this.stretchedBillboardLengthScale);
		sv.setNumber(ShuriKenParticle3D.STRETCHEDBILLBOARDSPEEDSCALE,this.stretchedBillboardSpeedScale);
		sv.setNumber(ShuriKenParticle3D.CURRENTTIME,particleSystem._currentTime);
		if (Laya3D.debugMode)
			this._renderRenderableBoundBox();
	}

	/**
	*@inheritDoc
	*/
	__proto._destroy=function(){
		_super.prototype._destroy.call(this);
		(this._mesh)&& (this._mesh._removeReference(),this._mesh=null);
	}

	/**
	*@inheritDoc
	*/
	__getset(0,__proto,'boundingBox',function(){
		if (!(this._owner).particleSystem.isAlive){
			return this._defaultBoundBox;
			}else {
			if (this._boundingBoxNeedChange){
				this._calculateBoundingBox();
				this._boundingBoxNeedChange=false;
			}
			return this._boundingBox;
		}
	});

	/**
	*设置渲染模式,0为BILLBOARD、1为STRETCHEDBILLBOARD、2为HORIZONTALBILLBOARD、3为VERTICALBILLBOARD、4为MESH。
	*@param value 渲染模式。
	*/
	/**
	*获取渲染模式。
	*@return 渲染模式。
	*/
	__getset(0,__proto,'renderMode',function(){
		return this._renderMode;
		},function(value){
		if (this._renderMode!==value){
			var defineDatas=this._defineDatas;
			switch (this._renderMode){
				case 0:
					defineDatas.remove(ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_BILLBOARD);
					break ;
				case 1:
					defineDatas.remove(ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_STRETCHEDBILLBOARD);
					break ;
				case 2:
					defineDatas.remove(ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_HORIZONTALBILLBOARD);
					break ;
				case 3:
					defineDatas.remove(ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_VERTICALBILLBOARD);
					break ;
				case 4:
					defineDatas.remove(ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_MESH);
					break ;
				}
			this._renderMode=value;
			switch (value){
				case 0:
					defineDatas.add(ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_BILLBOARD);
					break ;
				case 1:
					defineDatas.add(ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_STRETCHEDBILLBOARD);
					break ;
				case 2:
					defineDatas.add(ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_HORIZONTALBILLBOARD);
					break ;
				case 3:
					defineDatas.add(ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_VERTICALBILLBOARD);
					break ;
				case 4:
					defineDatas.add(ShuriKenParticle3D.SHADERDEFINE_RENDERMODE_MESH);
					break ;
				default :
					throw new Error("ShurikenParticleRender: unknown renderMode Value.");
				}
			(this._owner).particleSystem._initBufferDatas();
		}
	});

	/**
	*设置网格渲染模式所使用的Mesh,rendderMode为4时生效。
	*@param value 网格模式所使用Mesh。
	*/
	/**
	*获取网格渲染模式所使用的Mesh,rendderMode为4时生效。
	*@return 网格模式所使用Mesh。
	*/
	__getset(0,__proto,'mesh',function(){
		return this._mesh
		},function(value){
		if (this._mesh!==value){
			(this._mesh)&& (this._mesh._removeReference());
			this._mesh=value;
			(value)&& (value._addReference());
			(this._owner).particleSystem._initBufferDatas();
		}
	});

	return ShurikenParticleRenderer;
})(BaseRender)


/**

*/
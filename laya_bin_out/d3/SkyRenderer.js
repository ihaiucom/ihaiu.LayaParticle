/**
*<code>SkyRenderer</code> 类用于实现天空渲染器。
*/
//class laya.d3.resource.models.SkyRenderer
var SkyRenderer=(function(){
	function SkyRenderer(){
		/**@private */
		this._material=null;
		this._mesh=SkyBox.instance;
	}

	__class(SkyRenderer,'laya.d3.resource.models.SkyRenderer');
	var __proto=SkyRenderer.prototype;
	/**
	*@private
	*是否可用。
	*/
	__proto._isAvailable=function(){
		return this._material && this._mesh;
	}

	/**
	*@private
	*/
	__proto._render=function(state){
		if (this._material && this._mesh){
			var gl=LayaGL.instance;
			var scene=state.scene;
			var camera=state.camera;
			WebGLContext.setCullFace(gl,false);
			WebGLContext.setDepthFunc(gl,/*laya.webgl.WebGLContext.LEQUAL*/0x0203);
			WebGLContext.setDepthMask(gl,false);
			var shader=state.shader=this._material._shader.getSubShaderAt(0)._passes[0].withCompile(0,0,this._material._defineDatas.value);
			var switchShader=shader.bind();
			var switchShaderLoop=(Stat.loopCount!==shader._uploadLoopCount);
			var uploadScene=(shader._uploadScene!==scene)|| switchShaderLoop;
			if (uploadScene || switchShader){
				shader.uploadUniforms(shader._sceneUniformParamsMap,scene._shaderValues,uploadScene);
				shader._uploadScene=scene;
			};
			var uploadCamera=(shader._uploadCamera!==camera)|| switchShaderLoop;
			if (uploadCamera || switchShader){
				shader.uploadUniforms(shader._cameraUniformParamsMap,camera._shaderValues,uploadCamera);
				shader._uploadCamera=camera;
			};
			var uploadMaterial=(shader._uploadMaterial!==this._material)|| switchShaderLoop;
			if (uploadMaterial || switchShader){
				shader.uploadUniforms(shader._materialUniformParamsMap,this._material._shaderValues,uploadMaterial);
				shader._uploadMaterial=this._material;
			}
			this._mesh._bufferState.bind();
			this._mesh._render(state);
			WebGLContext.setDepthFunc(gl,/*laya.webgl.WebGLContext.LESS*/0x0201);
			WebGLContext.setDepthMask(gl,true);
		}
	}

	/**
	*@private
	*/
	__proto.destroy=function(){
		if (this._material){
			this._material._removeReference();
			this._material=null;
		}
	}

	/**
	*设置材质。
	*@param 材质。
	*/
	/**
	*获取材质。
	*@return 材质。
	*/
	__getset(0,__proto,'material',function(){
		return this._material;
		},function(value){
		if (this._material!==value){
			(this._material)&& (this._material._removeReference());
			(value)&& (value._addReference());
			this._material=value;
		}
	});

	/**
	*设置网格。
	*@param 网格。
	*/
	/**
	*获取网格。
	*@return 网格。
	*/
	__getset(0,__proto,'mesh',function(){
		return this._mesh;
		},function(value){
		if (this._mesh!==value){
			this._mesh=value;
		}
	});

	return SkyRenderer;
})()


/**

*/
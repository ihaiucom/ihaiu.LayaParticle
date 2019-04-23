//class laya.layagl.LayaGLRunner
var LayaGLRunner=(function(){
	function LayaGLRunner(){}
	__class(LayaGLRunner,'laya.layagl.LayaGLRunner');
	LayaGLRunner.uploadShaderUniforms=function(layaGL,commandEncoder,shaderData,uploadUnTexture){
		var data=shaderData._data;
		var shaderUniform=commandEncoder.getArrayData();
		var shaderCall=0;
		for (var i=0,n=shaderUniform.length;i < n;i++){
			var one=shaderUniform[i];
			if (uploadUnTexture || one.textureID!==-1){
				var value=data[one.dataOffset];
				if (value !=null)
					shaderCall+=one.fun.call(one.caller,one,value);
			}
		}
		return shaderCall;
	}

	LayaGLRunner.uploadCustomUniform=function(layaGL,custom,index,data){
		var shaderCall=0;
		var one=custom[index];
		if (one && data !=null)
			shaderCall+=one.fun.call(one.caller,one,data);
		return shaderCall;
	}

	LayaGLRunner.uploadShaderUniformsForNative=function(layaGL,commandEncoder,shaderData){
		var nType=/*laya.layagl.LayaGL.UPLOAD_SHADER_UNIFORM_TYPE_ID*/0;
		if (shaderData._runtimeCopyValues.length >=0){
			nType=/*laya.layagl.LayaGL.UPLOAD_SHADER_UNIFORM_TYPE_DATA*/1;
		};
		var data=shaderData._data;
		return layaGL.uploadShaderUniforms(commandEncoder,data,nType);
	}

	return LayaGLRunner;
})()


/**
*管理若干张CharPageTexture
*里面的字体属于相同字体，相同大小
*清理方式：
*每隔一段时间检查一下是否能合并，一旦发现可以省出一整张贴图，就开始清理
*/

//class laya.webgl.shader.BaseShader extends laya.resource.Resource
var BaseShader=(function(_super){
	//当前绑定的shader
	function BaseShader(){
		BaseShader.__super.call(this);
	}

	__class(BaseShader,'laya.webgl.shader.BaseShader',_super);
	BaseShader.activeShader=null;
	BaseShader.bindShader=null;
	return BaseShader;
})(Resource)



//class laya.layagl.CommandEncoder
var CommandEncoder=(function(){
	function CommandEncoder(layagl,reserveSize,adjustSize,isSyncToRenderThread){
		this._idata=[];
	}

	__class(CommandEncoder,'laya.layagl.CommandEncoder');
	var __proto=CommandEncoder.prototype;
	//TODO:coverage
	__proto.getArrayData=function(){
		return this._idata;
	}

	//TODO:coverage
	__proto.getPtrID=function(){
		return 0;
	}

	__proto.beginEncoding=function(){}
	__proto.endEncoding=function(){}
	//TODO:coverage
	__proto.clearEncoding=function(){
		this._idata.length=0;
	}

	//TODO:coverage
	__proto.getCount=function(){
		return this._idata.length;
	}

	//TODO:coverage
	__proto.add_ShaderValue=function(o){
		this._idata.push(o);
	}

	//TODO:coverage
	__proto.addShaderUniform=function(one){
		this.add_ShaderValue(one);
	}

	return CommandEncoder;
})()



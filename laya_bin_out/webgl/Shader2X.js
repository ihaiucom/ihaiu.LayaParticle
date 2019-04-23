//class laya.webgl.shader.d2.Shader2X extends laya.webgl.shader.Shader
var Shader2X=(function(_super){
	function Shader2X(vs,ps,saveName,nameMap,bindAttrib){
		this._params2dQuick2=null;
		this._shaderValueWidth=0;
		this._shaderValueHeight=0;
		Shader2X.__super.call(this,vs,ps,saveName,nameMap,bindAttrib);
	}

	__class(Shader2X,'laya.webgl.shader.d2.Shader2X',_super);
	var __proto=Shader2X.prototype;
	//TODO:coverage
	__proto._disposeResource=function(){
		_super.prototype._disposeResource.call(this);
		this._params2dQuick2=null;
	}

	//TODO:coverage
	__proto.upload2dQuick2=function(shaderValue){
		this.upload(shaderValue,this._params2dQuick2 || this._make2dQuick2());
	}

	//去掉size的所有的uniform
	__proto._make2dQuick2=function(){
		if (!this._params2dQuick2){
			this._params2dQuick2=[];
			var params=this._params,one;
			for (var i=0,n=params.length;i < n;i++){
				one=params[i];
				if (one.name!=="size")this._params2dQuick2.push(one);
			}
		}
		return this._params2dQuick2;
	}

	Shader2X.create=function(vs,ps,saveName,nameMap,bindAttrib){
		return new Shader2X(vs,ps,saveName,nameMap,bindAttrib);
	}

	return Shader2X;
})(Shader)


	Laya.__init([CharBook,Path,WebGLContext2D]);
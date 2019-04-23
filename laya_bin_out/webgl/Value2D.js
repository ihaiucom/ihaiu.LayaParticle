//class laya.webgl.shader.d2.value.Value2D
var Value2D=(function(){
	function Value2D(mainID,subID){
		this.size=[0,0];
		this.alpha=1.0;
		//这个目前只给setIBVB用。其他的都放到attribute的color中了
		//this.mmat=null;
		//worldmatrix，是4x4的，因为为了shader使用方便。 TODO 换成float32Array
		//this.u_MvpMatrix=null;
		//this.texture=null;
		this.ALPHA=1.0;
		//这个？
		//this.shader=null;
		//this.mainID=0;
		this.subID=0;
		//this.filters=null;
		//this.textureHost=null;
		//public var fillStyle:DrawStyle;//TODO 这个有什么用？
		//this.color=null;
		//public var strokeStyle:DrawStyle;
		//this.colorAdd=null;
		//this.u_mmat2=null;
		this.ref=1;
		//this._attribLocation=null;
		//[name,location,name,location...] 由继承类赋值。这个最终会传给对应的shader
		//this._inClassCache=null;
		this._cacheID=0;
		this.clipMatDir=[ /*laya.webgl.canvas.WebGLContext2D._MAXSIZE*/99999999,0,0,/*laya.webgl.canvas.WebGLContext2D._MAXSIZE*/99999999];
		this.clipMatPos=[0,0];
		this.defines=new ShaderDefines2D();
		this.mainID=mainID;
		this.subID=subID;
		this.textureHost=null;
		this.texture=null;
		this.color=null;
		this.colorAdd=null;
		this.u_mmat2=null;
		this._cacheID=mainID|subID;
		this._inClassCache=Value2D._cache[this._cacheID];
		if (mainID>0 && !this._inClassCache){
			this._inClassCache=Value2D._cache[this._cacheID]=[];
			this._inClassCache._length=0;
		}
		this.clear();
	}

	__class(Value2D,'laya.webgl.shader.d2.value.Value2D');
	var __proto=Value2D.prototype;
	__proto.setValue=function(value){}
	//public function refresh():ShaderValue
	__proto._ShaderWithCompile=function(){
		var ret=Shader.withCompile2D(0,this.mainID,this.defines.toNameDic(),this.mainID | this.defines._value,Shader2X.create,this._attribLocation);
		return ret;
	}

	__proto.upload=function(){
		var renderstate2d=RenderState2D;
		RenderState2D.worldMatrix4===RenderState2D.TEMPMAT4_ARRAY || this.defines.addInt(/*laya.webgl.shader.d2.ShaderDefines2D.WORLDMAT*/0x80);
		this.mmat=renderstate2d.worldMatrix4;
		if (RenderState2D.matWVP){
			this.defines.addInt(/*laya.webgl.shader.d2.ShaderDefines2D.MVP3D*/0x800);
			this.u_MvpMatrix=RenderState2D.matWVP.elements;
		};
		var sd=Shader.sharders[this.mainID | this.defines._value] || this._ShaderWithCompile();
		if (sd._shaderValueWidth!==renderstate2d.width || sd._shaderValueHeight!==renderstate2d.height){
			this.size[0]=renderstate2d.width;
			this.size[1]=renderstate2d.height;
			sd._shaderValueWidth=renderstate2d.width;
			sd._shaderValueHeight=renderstate2d.height;
			sd.upload(this,null);
		}
		else{
			sd.upload(this,sd._params2dQuick2 || sd._make2dQuick2());
		}
	}

	//TODO:coverage
	__proto.setFilters=function(value){
		this.filters=value;
		if (!value)
			return;
		var n=value.length,f;
		for (var i=0;i < n;i++){
			f=value[i];
			if (f){
				this.defines.add(f.type);
				f.action.setValue(this);
			}
		}
	}

	__proto.clear=function(){
		this.defines._value=this.subID+(WebGL.shaderHighPrecision? /*laya.webgl.shader.d2.ShaderDefines2D.SHADERDEFINE_FSHIGHPRECISION*/0x400:0);
	}

	__proto.release=function(){
		if ((--this.ref)< 1){
			this._inClassCache && (this._inClassCache[this._inClassCache._length++]=this);
			this.clear();
			this.filters=null;
			this.ref=1;
		}
	}

	Value2D._initone=function(type,classT){
		Value2D._typeClass[type]=classT;
		Value2D._cache[type]=[];
		Value2D._cache[type]._length=0;
	}

	Value2D.__init__=function(){
		Value2D._initone(/*laya.webgl.shader.d2.ShaderDefines2D.PRIMITIVE*/0x04,PrimitiveSV);
		Value2D._initone(/*laya.webgl.shader.d2.ShaderDefines2D.SKINMESH*/0x200,SkinSV);
		Value2D._initone(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,TextureSV);
		Value2D._initone(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01 | /*laya.webgl.shader.d2.ShaderDefines2D.FILTERGLOW*/0x08,TextureSV);
	}

	Value2D.create=function(mainType,subType){
		var types=Value2D._cache[mainType|subType];
		if (types._length)
			return types[--types._length];
		else
		return new Value2D._typeClass[mainType|subType](subType);
	}

	Value2D._cache=[];
	Value2D._typeClass=[];
	Value2D.TEMPMAT4_ARRAY=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
	return Value2D;
})()



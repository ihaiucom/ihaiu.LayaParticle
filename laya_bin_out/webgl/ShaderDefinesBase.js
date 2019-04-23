//class laya.webgl.shader.ShaderDefinesBase
var ShaderDefinesBase=(function(){
	function ShaderDefinesBase(name2int,int2name,int2nameMap){
		this._value=0;
		//this._name2int=null;
		//this._int2name=null;
		//this._int2nameMap=null;
		this._name2int=name2int;
		this._int2name=int2name;
		this._int2nameMap=int2nameMap;
	}

	__class(ShaderDefinesBase,'laya.webgl.shader.ShaderDefinesBase');
	var __proto=ShaderDefinesBase.prototype;
	//TODO:coverage
	__proto.add=function(value){
		if ((typeof value=='string'))value=this._name2int[value];
		this._value |=value;
		return this._value;
	}

	__proto.addInt=function(value){
		this._value |=value;
		return this._value;
	}

	//TODO:coverage
	__proto.remove=function(value){
		if ((typeof value=='string'))value=this._name2int[value];
		this._value &=(~value);
		return this._value;
	}

	//TODO:coverage
	__proto.isDefine=function(def){
		return (this._value & def)===def;
	}

	//TODO:coverage
	__proto.getValue=function(){
		return this._value;
	}

	__proto.setValue=function(value){
		this._value=value;
	}

	__proto.toNameDic=function(){
		var r=this._int2nameMap[this._value];
		return r ? r :ShaderDefinesBase._toText(this._value,this._int2name,this._int2nameMap);
	}

	ShaderDefinesBase._reg=function(name,value,_name2int,_int2name){
		_name2int[name]=value;
		_int2name[value]=name;
	}

	ShaderDefinesBase._toText=function(value,_int2name,_int2nameMap){
		var r=_int2nameMap[value];
		if (r)return r;
		var o={};
		var d=1;
		for (var i=0;i < 32;i++){
			d=1 << i;
			if (d > value)break ;
			if (value & d){
				var name=_int2name[d];
				name && (o[name]="");
			}
		}
		_int2nameMap[value]=o;
		return o;
	}

	ShaderDefinesBase._toInt=function(names,_name2int){
		var words=names.split('.');
		var num=0;
		for (var i=0,n=words.length;i < n;i++){
			var value=_name2int[words[i]];
			if (!value)throw new Error("Defines to int err:"+names+"/"+words[i]);
			num |=value;
		}
		return num;
	}

	return ShaderDefinesBase;
})()



/**
*<code>SubShader</code> 类用于创建SubShader。
*/
//class laya.d3.shader.SubShader
var SubShader=(function(){
	function SubShader(attributeMap,uniformMap,spriteDefines,materialDefines){
		/**@private */
		this._attributeMap=null;
		/**@private */
		this._uniformMap=null;
		/**@private */
		this._publicDefines=null;
		/**@private */
		this._publicDefinesMap=null;
		/**@private */
		this._spriteDefines=null;
		/**@private */
		this._spriteDefinesMap=null;
		/**@private */
		this._materialDefines=null;
		/**@private */
		this._materialDefinesMap=null;
		/**@private */
		this._owner=null;
		/**@private */
		this._flags={};
		this._passes=[];
		this._publicDefines=[];
		this._publicDefinesMap={};
		this._spriteDefines=[];
		this._spriteDefinesMap={};
		this._materialDefines=[];
		this._materialDefinesMap={};
		this._addDefines(this._publicDefines,this._publicDefinesMap,Shader3D._globleDefines);
		(spriteDefines)&& (this._addDefines(this._spriteDefines,this._spriteDefinesMap,spriteDefines.defines));
		(materialDefines)&& (this._addDefines(this._materialDefines,this._materialDefinesMap,materialDefines.defines));
		this._attributeMap=attributeMap;
		this._uniformMap=uniformMap;
	}

	__class(SubShader,'laya.d3.shader.SubShader');
	var __proto=SubShader.prototype;
	/**
	*@private
	*/
	__proto._addDefines=function(defines,definesMap,supportDefines){
		for (var k in supportDefines){
			var name=supportDefines[k];
			var i=parseInt(k);
			defines[i]=name;
			definesMap[name]=i;
		}
	}

	/**
	*通过名称获取宏定义值。
	*@param name 名称。
	*@return 宏定义值。
	*/
	__proto.getMaterialDefineByName=function(name){
		return this._materialDefinesMap[name];
	}

	/**
	*添加标记。
	*@param key 标记键。
	*@param value 标记值。
	*/
	__proto.setFlag=function(key,value){
		if (value)
			this._flags[key]=value;
		else
		delete this._flags[key];
	}

	/**
	*获取标记值。
	*@return key 标记键。
	*/
	__proto.getFlag=function(key){
		return this._flags[key];
	}

	/**
	*@private
	*/
	__proto.addShaderPass=function(vs,ps){
		this._passes.push(new ShaderPass(this,vs,ps));
	}

	return SubShader;
})()


/**

*/
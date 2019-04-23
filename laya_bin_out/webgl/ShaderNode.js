//class laya.webgl.utils.ShaderNode
var ShaderNode=(function(){
	function ShaderNode(includefiles){
		this.childs=[];
		this.text="";
		this.parent=null;
		this.name=null;
		this.noCompile=false;
		this.includefiles=null;
		this.condition=null;
		this.conditionType=0;
		this.useFuns="";
		this.z=0;
		this.src=null;
		this.includefiles=includefiles;
	}

	__class(ShaderNode,'laya.webgl.utils.ShaderNode');
	var __proto=ShaderNode.prototype;
	__proto.setParent=function(parent){
		parent.childs.push(this);
		this.z=parent.z+1;
		this.parent=parent;
	}

	__proto.setCondition=function(condition,type){
		if (condition){
			this.conditionType=type;
			condition=condition.replace(/(\s*$)/g,"");
			this.condition=function (){
				return this[condition];
			}
			this.condition.__condition=condition;
		}
	}

	__proto.toscript=function(def,out){
		return this._toscript(def,out,++ShaderNode.__id);
	}

	__proto._toscript=function(def,out,id){
		if (this.childs.length < 1 && !this.text)return out;
		var outIndex=out.length;
		if (this.condition){
			var ifdef=!!this.condition.call(def);
			this.conditionType===/*laya.webgl.utils.ShaderCompile.IFDEF_ELSE*/2 && (ifdef=!ifdef);
			if (!ifdef)return out;
		}
		this.text && out.push(this.text);
		this.childs.length > 0 && this.childs.forEach(function(o,index,arr){
			o._toscript(def,out,id);
		});
		if (this.includefiles.length > 0 && this.useFuns.length > 0){
			var funsCode;
			for (var i=0,n=this.includefiles.length;i < n;i++){
				if (this.includefiles[i].curUseID==id){
					continue ;
				}
				funsCode=this.includefiles[i].file.getFunsScript(this.useFuns);
				if (funsCode.length > 0){
					this.includefiles[i].curUseID=id;
					out[0]=funsCode+out[0];
				}
			}
		}
		return out;
	}

	ShaderNode.__id=1;
	return ShaderNode;
})()


/**
*...
*@author ww
*/

/**
*<code>UIUtils</code> 是文本工具集。
*/
//class laya.ui.UIUtils
var UIUtils=(function(){
	function UIUtils(){}
	__class(UIUtils,'laya.ui.UIUtils');
	UIUtils.fillArray=function(arr,str,type){
		var temp=arr.concat();
		if (str){
			var a=str.split(",");
			for (var i=0,n=Math.min(temp.length,a.length);i < n;i++){
				var value=a[i];
				temp[i]=(value=="true" ? true :(value=="false" ? false :value));
				if (type !=null)temp[i]=type(value);
			}
		}
		return temp;
	}

	UIUtils.toColor=function(color){
		return Utils.toHexColor(color);
	}

	UIUtils.gray=function(traget,isGray){
		(isGray===void 0)&& (isGray=true);
		if (isGray){
			UIUtils.addFilter(traget,UIUtils.grayFilter);
			}else {
			UIUtils.clearFilter(traget,ColorFilter);
		}
	}

	UIUtils.addFilter=function(target,filter){
		var filters=target.filters || [];
		filters.push(filter);
		target.filters=filters;
	}

	UIUtils.clearFilter=function(target,filterType){
		var filters=target.filters;
		if (filters !=null && filters.length > 0){
			for (var i=filters.length-1;i >-1;i--){
				var filter=filters[i];
				if (Laya.__typeof(filter,filterType))filters.splice(i,1);
			}
			target.filters=filters;
		}
	}

	UIUtils._getReplaceStr=function(word){
		return UIUtils.escapeSequence[word];
	}

	UIUtils.adptString=function(str){
		return str.replace(/\\(\w)/g,UIUtils._getReplaceStr);
	}

	UIUtils.getBindFun=function(value){
		var fun=UIUtils._funMap.get(value);
		if (fun==null){
			var temp="\""+value+"\"";
			temp=temp.replace(/^"\${|}"$/g,"").replace(/\${/g,"\"+").replace(/}/g,"+\"");
			var str="(function(data){if(data==null)return;with(data){try{\nreturn "+temp+"\n}catch(e){}}})";
			fun=Laya._runScript(str);
			UIUtils._funMap.set(value,fun);
		}
		return fun;
	}

	__static(UIUtils,
	['grayFilter',function(){return this.grayFilter=new ColorFilter([0.3086,0.6094,0.082,0,0,0.3086,0.6094,0.082,0,0,0.3086,0.6094,0.082,0,0,0,0,0,1,0]);},'escapeSequence',function(){return this.escapeSequence={"\\n":"\n","\\t":"\t"};},'_funMap',function(){return this._funMap=new WeakObject();}
	]);
	return UIUtils;
})()


/**

*/
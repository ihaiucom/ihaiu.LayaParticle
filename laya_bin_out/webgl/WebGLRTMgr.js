//class laya.webgl.resource.WebGLRTMgr
var WebGLRTMgr=(function(){
	function WebGLRTMgr(){}
	__class(WebGLRTMgr,'laya.webgl.resource.WebGLRTMgr');
	WebGLRTMgr.getRT=function(w,h){
		w=w | 0;
		h=h | 0;
		if (w >=10000){
			console.error('getRT error! w too big');
		};
		var key=h *10000+w;
		var sw=WebGLRTMgr.dict[key];
		var ret;
		if (sw){
			if (sw.length > 0){
				ret=sw.pop();
				ret._mgrKey=key;
				return ret;
			}
		}
		ret=new RenderTexture2D(w,h,/*laya.webgl.resource.BaseTexture.FORMAT_R8G8B8A8*/1,-1);
		ret._mgrKey=key;
		return ret;
	}

	WebGLRTMgr.releaseRT=function(rt){
		if (rt._mgrKey <=0)
			return;
		var sw=WebGLRTMgr.dict[rt._mgrKey];
		!sw && (sw=[],WebGLRTMgr.dict[rt._mgrKey]=sw);
		rt._mgrKey=0;
		sw.push(rt);
	}

	WebGLRTMgr.dict={};
	return WebGLRTMgr;
})()



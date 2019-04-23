//class laya.filters.BlurFilter extends laya.filters.Filter
var BlurFilter=(function(_super){
	function BlurFilter(strength){
		/**模糊滤镜的强度(值越大，越不清晰 */
		this.strength=NaN;
		this.strength_sig2_2sig2_gauss1=[];
		//给shader用的。避免创建对象
		this.strength_sig2_native=null;
		//给native用的
		this.renderFunc=null;
		BlurFilter.__super.call(this);
		(strength===void 0)&& (strength=4);
		this.strength=strength;
		this._action=null;
		this._glRender=new BlurFilterGLRender();
	}

	__class(BlurFilter,'laya.filters.BlurFilter',_super);
	var __proto=BlurFilter.prototype;
	__proto.getStrenth_sig2_2sig2_native=function(){
		if (!this.strength_sig2_native){
			this.strength_sig2_native=new Float32Array(4);
		};
		var sigma=this.strength/3.0;
		var sigma2=sigma *sigma;
		this.strength_sig2_native[0]=this.strength;
		this.strength_sig2_native[1]=sigma2;
		this.strength_sig2_native[2]=2.0*sigma2;
		this.strength_sig2_native[3]=1.0 / (2.0 *Math.PI *sigma2);
		return this.strength_sig2_native;
	}

	/**
	*@private
	*当前滤镜的类型
	*/
	__getset(0,__proto,'type',function(){
		return 0x10;
	});

	return BlurFilter;
})(Filter)


/**
*发光滤镜(也可以当成阴影滤使用）
*/

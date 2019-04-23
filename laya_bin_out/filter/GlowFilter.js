//class laya.filters.GlowFilter extends laya.filters.Filter
var GlowFilter=(function(_super){
	function GlowFilter(color,blur,offX,offY){
		//给shader用
		this._sv_blurInfo2=[0,0,1,0];
		/**滤镜的颜色*/
		this._color=null;
		this._color_native=null;
		this._blurInof1_native=null;
		this._blurInof2_native=null;
		GlowFilter.__super.call(this);
		this._elements=new Float32Array(9);
		this._sv_blurInfo1=new Array(4);
		(blur===void 0)&& (blur=4);
		(offX===void 0)&& (offX=6);
		(offY===void 0)&& (offY=6);
		this._color=new ColorUtils(color);
		this.blur=Math.min(blur,20);
		this.offX=offX;
		this.offY=offY;
		this._sv_blurInfo1[0]=this._sv_blurInfo1[1]=this.blur;this._sv_blurInfo1[2]=offX;this._sv_blurInfo1[3]=-offY;
		this._glRender=new GlowFilterGLRender();
	}

	__class(GlowFilter,'laya.filters.GlowFilter',_super);
	var __proto=GlowFilter.prototype;
	/**@private */
	__proto.getColor=function(){
		return this._color.arrColor;
	}

	__proto.getColorNative=function(){
		if (!this._color_native){
			this._color_native=new Float32Array(4);
		};
		var color=this.getColor();
		this._color_native[0]=color[0];
		this._color_native[1]=color[1];
		this._color_native[2]=color[2];
		this._color_native[3]=color[3];
		return this._color_native;
	}

	__proto.getBlurInfo1Native=function(){
		if (!this._blurInof1_native){
			this._blurInof1_native=new Float32Array(4);
		}
		this._blurInof1_native[0]=this._blurInof1_native[1]=this.blur;
		this._blurInof1_native[2]=this.offX;
		this._blurInof1_native[3]=this.offY;
		return this._blurInof1_native;
	}

	__proto.getBlurInfo2Native=function(){
		if (!this._blurInof2_native){
			this._blurInof2_native=new Float32Array(4);
		}
		this._blurInof2_native[2]=1;
		return this._blurInof2_native;
	}

	/**
	*@private
	*滤镜类型
	*/
	__getset(0,__proto,'type',function(){
		return 0x08;
	});

	/**@private */
	/**@private */
	__getset(0,__proto,'offY',function(){
		return this._elements[6];
		},function(value){
		this._elements[6]=value;
		this._sv_blurInfo1[3]=-value;
	});

	/**@private */
	/**@private */
	__getset(0,__proto,'offX',function(){
		return this._elements[5];
		},function(value){
		this._elements[5]=value;
		this._sv_blurInfo1[2]=value;
	});

	/**@private */
	/**@private */
	__getset(0,__proto,'blur',function(){
		return this._elements[4];
		},function(value){
		this._elements[4]=value;
		this._sv_blurInfo1[0]=this._sv_blurInfo1[1]=value;
	});

	return GlowFilter;
})(Filter)



})(window,document,Laya);

//class laya.webgl.resource.CharPageTexture extends laya.resource.Resource
var CharPageTexture=(function(_super){
	function CharPageTexture(textureW,textureH,gridNum){
		//假装自己是一个Texture对象
		this.texture=null;
		this._source=null;
		//格子的使用状态。使用的为1
		this._used=null;
		this._startFindPos=0;
		//private var _mgr:CharPages;
		this._texW=0;
		this._texH=0;
		this._gridNum=0;
		/**
		*charMaps 最多有16个，表示在与basesize的距离。每个元素是一个Object,里面保存了具体的ChareRenderInfo信息，key是 str+color+bold
		*/
		this.charMaps=([]);
		//public var charMap:*={};//本页保存的文字信息
		this._score=0;
		//本帧使用的文字的个数
		this._scoreTick=0;
		//_score是哪一帧计算的
		this.__destroyed=false;
		//父类有，但是private
		this._discardTm=0;
		//释放的时间。超过一定时间会被真正删除
		this.genID=0;
		this.ArrCharRenderInfo=[];
		CharPageTexture.__super.call(this);
		this._texW=textureW;
		this._texH=textureH;
		this._gridNum=gridNum;
		this.texture=new CharInternalTexture(this);
		this.setGridNum(gridNum);
		this.lock=true;
	}

	__class(CharPageTexture,'laya.webgl.resource.CharPageTexture',_super);
	var __proto=CharPageTexture.prototype;
	/**
	*找一个空余的格子。
	*@return
	*/
	__proto.findAGrid=function(){
		for (var i=this._startFindPos;i < this._gridNum;i++){
			if (this._used[i]==0){
				this._startFindPos=i+1;
				this._used[i]=1;
				var ri=this.ArrCharRenderInfo[i]=new CharRenderInfo();
				ri.tex=this;
				ri.pos=i;
				return ri;
			}
		}
		return null;
	}

	//TODO:coverage
	__proto.removeGrid=function(pos){
		if(this.ArrCharRenderInfo[pos]){
			this.ArrCharRenderInfo[pos].deleted=true;
		}
		this._used[pos]=0;
		if (pos < this._startFindPos)
			this._startFindPos=pos;
	}

	//TODO:coverage
	__proto.removeOld=function(tm){
		var num=0;
		var charMap=null;
		for (var i=0,sz=this.charMaps.length;i < sz;i++){
			charMap=this.charMaps[i];
			if (!charMap)continue ;
			var me=this;
			charMap.forEach(function(v,k,m){
				if (v){
					if (v.touchTick < tm){
						console.log('remove char '+k);
						me.removeGrid(v.pos);
						/*__JS__ */m.delete(k);;
						num++;
					}
				}
			});
		}
		return num;
	}

	// _used 后面有人请求的时候再处理
	__proto.reset=function(){
		this._discardTm=Laya.stage.getFrameTm();
		this._startFindPos=0;
		this.charMaps=([]);
		this._score=0;
		this._scoreTick=0;
		this.__destroyed=true;
		this.ArrCharRenderInfo.forEach(function(v){v.deleted=true;});
	}

	__proto.setGridNum=function(gridNum){
		this._gridNum=gridNum;
		if (!this._used || this._used.length !=this._gridNum){
			this._used=new Uint8Array(gridNum);
			}else {
			if ((this._used).fill)(this._used).fill(0);
			else {
				for (var i=0;i < this._used.length;i++)this._used[i]=0;
			}
		}
	}

	__proto.recreateResource=function(){
		if (this._source)
			return;
		var gl=Render.isConchApp?LayaGL.instance.getDefaultCommandEncoder():WebGL.mainContext;
		var glTex=this._source=gl.createTexture();
		this.texture.bitmap._glTexture=this._source;
		WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,glTex);
		gl.texImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,this._texW,this._texH,0,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,null);
		gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MIN_FILTER*/0x2801,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
		gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_MAG_FILTER*/0x2800,/*laya.webgl.WebGLContext.LINEAR*/0x2601);
		gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_S*/0x2802,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
		gl.texParameteri(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,/*laya.webgl.WebGLContext.TEXTURE_WRAP_T*/0x2803,/*laya.webgl.WebGLContext.CLAMP_TO_EDGE*/0x812F);
	}

	/**
	*
	*@param data
	*@param x 拷贝位置。
	*@param y
	*/
	__proto.addChar=function(data,x,y){
		if (CharBook.isWan1Wan){
			this.addCharCanvas(data ,x,y);
			return;
		}
		!this._source && this.recreateResource();
		var gl=Render.isConchApp?LayaGL.instance.getDefaultCommandEncoder():WebGL.mainContext;
		WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,this._source);
		!Render.isConchApp && gl.pixelStorei(/*laya.webgl.WebGLContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL*/0x9241,true);
		var dt=data.data;
		if (/*__JS__ */data.data instanceof Uint8ClampedArray)
			dt=new Uint8Array(dt.buffer);
		gl.texSubImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,x,y,data.width,data.height,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,dt);
		!Render.isConchApp && gl.pixelStorei(/*laya.webgl.WebGLContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL*/0x9241,false);
	}

	/**
	*玩一玩不支持 getImageData
	*@param canv
	*@param x
	*@param y
	*/
	__proto.addCharCanvas=function(canv,x,y){
		!this._source && this.recreateResource();
		var gl=Render.isConchApp?LayaGL.instance.getDefaultCommandEncoder():WebGL.mainContext;
		WebGLContext.bindTexture(gl,/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,this._source);
		!Render.isConchApp && gl.pixelStorei(/*laya.webgl.WebGLContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL*/0x9241,true);
		gl.texSubImage2D(/*laya.webgl.WebGLContext.TEXTURE_2D*/0x0DE1,0,x,y,/*laya.webgl.WebGLContext.RGBA*/0x1908,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,canv);
		!Render.isConchApp && gl.pixelStorei(/*laya.webgl.WebGLContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL*/0x9241,false);
	}

	//TODO:coverage
	__proto.destroy=function(){
		console.log('destroy CharPageTexture');
		this.__destroyed=true;
		var gl=Render.isConchApp?LayaGL.instance.getDefaultCommandEncoder():WebGL.mainContext;
		this._source && gl.deleteTexture(this._source);
		this._source=null;
		this.ArrCharRenderInfo.forEach(function(v){v.deleted=true;});
	}

	__proto.touchRect=function(ri,curloop){
		if(this._scoreTick!=curloop){
			this._score=0;
			this._scoreTick=curloop;
		}
		this._score++;
	}

	/**
	*打印调试相关的关键信息
	*/
	__proto.printDebugInfo=function(detail){
		(detail===void 0)&& (detail=false);
		console.log('。得分:',this._score,', 算分时间:',this._scoreTick,',格子数:',this._gridNum);
		var gridw=Math.sqrt(this._gridNum);
		var num=0;
		for (var i=0,sz=this.charMaps.length;i < sz;i++){
			var charMap=this.charMaps[i];
			if (!charMap)continue ;
			var me=this;
			var data='';
			if (detail){
				console.log('   与基本大小差'+i+'的map信息:');
			}
			charMap.forEach(function(v,k,m){
				if (v){
					if (detail){
						console.log(
						'      key:',k,
						' 位置:',(v.pos / gridw)| 0,(v.pos % gridw)| 0,
						' 宽高:',v.bmpWidth,v.bmpHeight,
						' 是否删除:',v.deleted,
						' touch时间:',v.touchTick);
					}else
					data+=k;
				}
			});
			if(!detail)
				console.log('data[',i,']:',data);
		}
	}

	return CharPageTexture;
})(Resource)


/**
*...
*@author ww
*/

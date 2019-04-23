//class laya.webgl.utils.MeshQuadTexture extends laya.webgl.utils.Mesh2D
var MeshQuadTexture=(function(_super){
	//private static var _num;
	function MeshQuadTexture(){
		MeshQuadTexture.__super.call(this,laya.webgl.utils.MeshQuadTexture.const_stride,4,4);
		this.canReuse=true;
		this.setAttributes(laya.webgl.utils.MeshQuadTexture._fixattriInfo);
		if(!laya.webgl.utils.MeshQuadTexture._fixib){
			this.createQuadIB(MeshQuadTexture._maxIB);
			laya.webgl.utils.MeshQuadTexture._fixib=this._ib;
			}else {
			this._ib=laya.webgl.utils.MeshQuadTexture._fixib;
			this._quadNum=MeshQuadTexture._maxIB;
		}
	}

	__class(MeshQuadTexture,'laya.webgl.utils.MeshQuadTexture',_super);
	var __proto=MeshQuadTexture.prototype;
	/**
	*把本对象放到回收池中，以便getMesh能用。
	*/
	__proto.releaseMesh=function(){
		this._vb.setByteLength(0);
		this.vertNum=0;
		this.indexNum=0;
		laya.webgl.utils.MeshQuadTexture._POOL.push(this);
	}

	__proto.destroy=function(){
		this._vb.destroy();
		this._vb.deleteBuffer();
	}

	/**
	*
	*@param pos
	*@param uv
	*@param color
	*@param clip ox,oy,xx,xy,yx,yy
	*@param useTex 是否使用贴图。false的话是给fillRect用的
	*/
	__proto.addQuad=function(pos,uv,color,useTex){
		var vb=this._vb;
		var vpos=(vb._byteLength >> 2);
		vb.setByteLength((vpos+laya.webgl.utils.MeshQuadTexture.const_stride)<<2);
		var vbdata=vb._floatArray32 || vb.getFloat32Array();
		var vbu32Arr=vb._uint32Array;
		var cpos=vpos;
		var useTexVal=useTex?0xff:0;
		vbdata[cpos++]=pos[0];vbdata[cpos++]=pos[1];vbdata[cpos++]=uv[0];vbdata[cpos++]=uv[1];vbu32Arr[cpos++]=color;vbu32Arr[cpos++]=useTexVal;
		vbdata[cpos++]=pos[2];vbdata[cpos++]=pos[3];vbdata[cpos++]=uv[2];vbdata[cpos++]=uv[3];vbu32Arr[cpos++]=color;vbu32Arr[cpos++]=useTexVal;
		vbdata[cpos++]=pos[4];vbdata[cpos++]=pos[5];vbdata[cpos++]=uv[4];vbdata[cpos++]=uv[5];vbu32Arr[cpos++]=color;vbu32Arr[cpos++]=useTexVal;
		vbdata[cpos++]=pos[6];vbdata[cpos++]=pos[7];vbdata[cpos++]=uv[6];vbdata[cpos++]=uv[7];vbu32Arr[cpos++]=color;vbu32Arr[cpos++]=useTexVal;
		vb._upload=true;
	}

	MeshQuadTexture.getAMesh=function(){
		if (laya.webgl.utils.MeshQuadTexture._POOL.length){
			return laya.webgl.utils.MeshQuadTexture._POOL.pop();
		}
		return new MeshQuadTexture();
	}

	MeshQuadTexture.const_stride=24;
	MeshQuadTexture._fixib=null;
	MeshQuadTexture._maxIB=16 *1024;
	MeshQuadTexture._POOL=[];
	__static(MeshQuadTexture,
	['_fixattriInfo',function(){return this._fixattriInfo=[
		/*laya.webgl.WebGLContext.FLOAT*/0x1406,4,0,
		/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,4,16,
		/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,4,20];}
	]);
	return MeshQuadTexture;
})(Mesh2D)


/**
*用来画矢量的mesh。顶点格式固定为 x,y,rgba
*/

//class laya.webgl.utils.MeshTexture extends laya.webgl.utils.Mesh2D
var MeshTexture=(function(_super){
	function MeshTexture(){
		MeshTexture.__super.call(this,laya.webgl.utils.MeshTexture.const_stride,4,4);
		this.canReuse=true;
		this.setAttributes(laya.webgl.utils.MeshTexture._fixattriInfo);
	}

	__class(MeshTexture,'laya.webgl.utils.MeshTexture',_super);
	var __proto=MeshTexture.prototype;
	__proto.addData=function(vertices,uvs,idx,matrix,rgba,ctx){
		var vertsz=vertices.length / 2;
		var startpos=this._vb.needSize(vertsz *MeshTexture.const_stride);
		var f32pos=startpos >> 2;
		var vbdata=this._vb._floatArray32 || this._vb.getFloat32Array();
		var vbu32Arr=this._vb._uint32Array;
		var ci=0;
		for (var i=0;i < vertsz;i++){
			var x=vertices[ci],y=vertices[ci+1];
			var x1=x *matrix.a+y *matrix.c+matrix.tx;
			var y1=x *matrix.b+y *matrix.d+matrix.ty;
			vbdata[f32pos++]=x1;vbdata[f32pos++]=y1;
			vbdata[f32pos++]=uvs[ci];vbdata[f32pos++]=uvs[ci+1];
			ci+=2;
			vbu32Arr[f32pos++]=rgba;
			vbu32Arr[f32pos++]=0xff;
		}
		this._vb.setNeedUpload();
		var vertN=this.vertNum;
		if (vertN > 0){
			var sz=idx.length;
			if (sz > MeshTexture.tmpIdx.length)MeshTexture.tmpIdx=new Uint16Array(sz);
			for (var ii=0;ii < sz;ii++){
				MeshTexture.tmpIdx[ii]=idx[ii]+vertN;
			}
			this._ib.appendU16Array(MeshTexture.tmpIdx,idx.length);
			}else {
			this._ib.append(idx);
		}
		this._ib.setNeedUpload();
		this.vertNum+=vertsz;
		this.indexNum+=idx.length;
	}

	/**
	*把本对象放到回收池中，以便getMesh能用。
	*/
	__proto.releaseMesh=function(){
		this._vb.setByteLength(0);
		this._ib.setByteLength(0);
		this.vertNum=0;
		this.indexNum=0;
		laya.webgl.utils.MeshTexture._POOL.push(this);
	}

	__proto.destroy=function(){
		this._ib.destroy();
		this._vb.destroy();
		this._ib.disposeResource();
		this._vb.deleteBuffer();
	}

	MeshTexture.getAMesh=function(){
		if (laya.webgl.utils.MeshTexture._POOL.length){
			return laya.webgl.utils.MeshTexture._POOL.pop();
		}
		return new MeshTexture();
	}

	MeshTexture.const_stride=24;
	MeshTexture._POOL=[];
	__static(MeshTexture,
	['_fixattriInfo',function(){return this._fixattriInfo=[
		/*laya.webgl.WebGLContext.FLOAT*/0x1406,4,0,
		/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,4,16,
		/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,4,20];},'tmpIdx',function(){return this.tmpIdx=new Uint16Array(4);}
	]);
	return MeshTexture;
})(Mesh2D)



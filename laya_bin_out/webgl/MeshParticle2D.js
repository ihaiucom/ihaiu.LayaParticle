//class laya.webgl.utils.MeshParticle2D extends laya.webgl.utils.Mesh2D
var MeshParticle2D=(function(_super){
	//TODO:coverage
	function MeshParticle2D(maxNum){
		MeshParticle2D.__super.call(this,laya.webgl.utils.MeshParticle2D.const_stride,maxNum*4*MeshParticle2D.const_stride,4);
		this.canReuse=true;
		this.setAttributes(laya.webgl.utils.MeshParticle2D._fixattriInfo);
		this.createQuadIB(maxNum);
		this._quadNum=maxNum;
	}

	__class(MeshParticle2D,'laya.webgl.utils.MeshParticle2D',_super);
	var __proto=MeshParticle2D.prototype;
	__proto.setMaxParticleNum=function(maxNum){
		this._vb._resizeBuffer(maxNum *4 *MeshParticle2D.const_stride,false);
		this.createQuadIB(maxNum);
	}

	//TODO:coverage
	__proto.releaseMesh=function(){
		debugger;
		this._vb.setByteLength(0);
		this.vertNum=0;
		this.indexNum=0;
		laya.webgl.utils.MeshParticle2D._POOL.push(this);
	}

	//TODO:coverage
	__proto.destroy=function(){
		this._ib.destroy();
		this._vb.destroy();
		this._vb.deleteBuffer();
	}

	MeshParticle2D.getAMesh=function(maxNum){
		if (laya.webgl.utils.MeshParticle2D._POOL.length){
			var ret=laya.webgl.utils.MeshParticle2D._POOL.pop();
			ret.setMaxParticleNum(maxNum);
			return ret;
		}
		return new MeshParticle2D(maxNum);
	}

	MeshParticle2D.const_stride=29*4;
	MeshParticle2D._POOL=[];
	__static(MeshParticle2D,
	['_fixattriInfo',function(){return this._fixattriInfo=[
		/*laya.webgl.WebGLContext.FLOAT*/0x1406,4,0,
		/*laya.webgl.WebGLContext.FLOAT*/0x1406,3,16,
		/*laya.webgl.WebGLContext.FLOAT*/0x1406,3,28,
		/*laya.webgl.WebGLContext.FLOAT*/0x1406,4,40,
		/*laya.webgl.WebGLContext.FLOAT*/0x1406,4,56,
		/*laya.webgl.WebGLContext.FLOAT*/0x1406,3,72,
		/*laya.webgl.WebGLContext.FLOAT*/0x1406,2,84,
		/*laya.webgl.WebGLContext.FLOAT*/0x1406,4,92,
		/*laya.webgl.WebGLContext.FLOAT*/0x1406,1,108,
		/*laya.webgl.WebGLContext.FLOAT*/0x1406,1,112];}
	]);
	return MeshParticle2D;
})(Mesh2D)



//class laya.webgl.utils.MeshVG extends laya.webgl.utils.Mesh2D
var MeshVG=(function(_super){
	function MeshVG(){
		MeshVG.__super.call(this,laya.webgl.utils.MeshVG.const_stride,4,4);
		this.canReuse=true;
		this.setAttributes(laya.webgl.utils.MeshVG._fixattriInfo);
	}

	__class(MeshVG,'laya.webgl.utils.MeshVG',_super);
	var __proto=MeshVG.prototype;
	/**
	*往矢量mesh中添加顶点和index。会把rgba和points在mesh中合并。
	*@param points 顶点数组，只包含x,y。[x,y,x,y...]
	*@param rgba rgba颜色
	*@param ib index数组。
	*/
	__proto.addVertAndIBToMesh=function(ctx,points,rgba,ib){
		var startpos=this._vb.needSize(points.length / 2 *MeshVG.const_stride);
		var f32pos=startpos >> 2;
		var vbdata=this._vb._floatArray32 || this._vb.getFloat32Array();
		var vbu32Arr=this._vb._uint32Array;
		var ci=0;
		var sz=points.length / 2;
		for (var i=0;i < sz;i++){
			vbdata[f32pos++]=points[ci];vbdata[f32pos++]=points[ci+1];ci+=2;
			vbu32Arr[f32pos++]=rgba;
		}
		this._vb.setNeedUpload();
		this._ib.append(new Uint16Array(ib));
		this._ib.setNeedUpload();
		this.vertNum+=sz;
		this.indexNum+=ib.length;
	}

	/**
	*把本对象放到回收池中，以便getMesh能用。
	*/
	__proto.releaseMesh=function(){
		this._vb.setByteLength(0);
		this._ib.setByteLength(0);
		this.vertNum=0;
		this.indexNum=0;
		laya.webgl.utils.MeshVG._POOL.push(this);
	}

	__proto.destroy=function(){
		this._ib.destroy();
		this._vb.destroy();
		this._ib.disposeResource();
		this._vb.deleteBuffer();
	}

	MeshVG.getAMesh=function(){
		if (laya.webgl.utils.MeshVG._POOL.length){
			return laya.webgl.utils.MeshVG._POOL.pop();
		}
		return new MeshVG();
	}

	MeshVG.const_stride=12;
	MeshVG._POOL=[];
	__static(MeshVG,
	['_fixattriInfo',function(){return this._fixattriInfo=[
		/*laya.webgl.WebGLContext.FLOAT*/0x1406,2,0,
		/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,4,8];}
	]);
	return MeshVG;
})(Mesh2D)


/**
*与MeshQuadTexture基本相同。不过index不是固定的
*/

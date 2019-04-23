//class laya.webgl.canvas.WebGLCacheAsNormalCanvas
var WebGLCacheAsNormalCanvas=(function(){
	function WebGLCacheAsNormalCanvas(ctx,sp){
		this.submitStartPos=0;
		// 对应的context的submit的开始的地方
		this.submitEndPos=0;
		this.context=null;
		this.touches=[];
		//记录的文字信息。cacheas normal的话，文字要能正确touch
		this.submits=[];
		// 从context中剪切的submit
		this.sprite=null;
		// submit需要关联稳定独立的mesh。所以这里要创建自己的mesh对象
		this._mesh=null;
		//用Mesh2D代替_vb,_ib. 当前使用的mesh
		this._pathMesh=null;
		//矢量专用mesh。
		this._triangleMesh=null;
		//drawTriangles专用mesh。由于ib不固定，所以不能与_mesh通用
		this.meshlist=[];
		// 原始context的原始值
		this._oldMesh=null;
		this._oldPathMesh=null;
		this._oldTriMesh=null;
		this._oldMeshList=null;
		//private var oldMatrix:Matrix=null;//本地画的时候完全不应用矩阵，所以需要先保存老的，以便恢复 这样会丢失缩放信息，导致文字模糊，所以不用这种方式了
		this.oldTx=0;
		this.oldTy=0;
		this.cachedClipInfo=new Matrix();
		this.invMat=new Matrix();
		this.context=ctx;
		this.sprite=sp;
		ctx._globalClipMatrix.copyTo(this.cachedClipInfo);
	}

	__class(WebGLCacheAsNormalCanvas,'laya.webgl.canvas.WebGLCacheAsNormalCanvas');
	var __proto=WebGLCacheAsNormalCanvas.prototype;
	__proto.startRec=function(){
		if (this.context._charSubmitCache._enbale){
			this.context._charSubmitCache.enable(false,this.context);
			this.context._charSubmitCache.enable(true,this.context);
		}
		this.touches.length=0;
		(this.context).touches=this.touches;
		this.context._globalClipMatrix.copyTo(this.cachedClipInfo);
		this.submits.length=0;
		this.submitStartPos=this.context._submits._length;
		for (var i=0,sz=this.meshlist.length;i < sz;i++){
			var curm=this.meshlist[i];
			curm.canReuse?(curm.releaseMesh()):(curm.destroy());
		}
		this.meshlist.length=0;
		this._mesh=MeshQuadTexture.getAMesh();
		this._pathMesh=MeshVG.getAMesh();
		this._triangleMesh=MeshTexture.getAMesh();
		this.meshlist.push(this._mesh);
		this.meshlist.push(this._pathMesh);
		this.meshlist.push(this._triangleMesh);
		this.context._curSubmit=Submit.RENDERBASE;
		this._oldMesh=this.context._mesh;
		this._oldPathMesh=this.context._pathMesh;
		this._oldTriMesh=this.context._triangleMesh;
		this._oldMeshList=this.context.meshlist;
		this.context._mesh=this._mesh;
		this.context._pathMesh=this._pathMesh;
		this.context._triangleMesh=this._triangleMesh;
		this.context.meshlist=this.meshlist;
		this.oldTx=this.context._curMat.tx;
		this.oldTy=this.context._curMat.ty;
		this.context._curMat.tx=0;
		this.context._curMat.ty=0;
		this.context._curMat.copyTo(this.invMat);
		this.invMat.invert();
	}

	//context._curMat=matI;
	__proto.endRec=function(){
		if (this.context._charSubmitCache._enbale){
			this.context._charSubmitCache.enable(false,this.context);
			this.context._charSubmitCache.enable(true,this.context);
		};
		var parsubmits=(this.context)._submits;
		this.submitEndPos=parsubmits._length;
		var num=this.submitEndPos-this.submitStartPos;
		for (var i=0;i < num;i++){
			this.submits.push(parsubmits[this.submitStartPos+i]);
		}
		parsubmits._length-=num;
		this.context._mesh=this._oldMesh;
		this.context._pathMesh=this._oldPathMesh;
		this.context._triangleMesh=this._oldTriMesh;
		this.context.meshlist=this._oldMeshList;
		this.context._curSubmit=Submit.RENDERBASE;
		this.context._curMat.tx=this.oldTx;
		this.context._curMat.ty=this.oldTy;
		(this.context).touches=null;
	}

	/**
	*当前缓存是否还有效。例如clip变了就失效了，因为clip太难自动处理
	*@return
	*/
	__proto.isCacheValid=function(){
		var curclip=this.context._globalClipMatrix;
		if (curclip.a !=this.cachedClipInfo.a || curclip.b !=this.cachedClipInfo.b || curclip.c !=this.cachedClipInfo.c
			|| curclip.d !=this.cachedClipInfo.d || curclip.tx !=this.cachedClipInfo.tx || curclip.ty !=this.cachedClipInfo.ty)
		return false;
		return true;
	}

	__proto.flushsubmit=function(){
		var curSubmit=Submit.RENDERBASE;
		this.submits.forEach(function(subm){
			if (subm==Submit.RENDERBASE)return;
			Submit.preRender=curSubmit;
			curSubmit=subm;
			subm.renderSubmit();
		});
	}

	__proto.releaseMem=function(){}
	__static(WebGLCacheAsNormalCanvas,
	['matI',function(){return this.matI=new Matrix();}
	]);
	return WebGLCacheAsNormalCanvas;
})()



//class laya.webgl.utils.Mesh2D
var Mesh2D=(function(){
	function Mesh2D(stride,vballoc,iballoc){
		this._stride=0;
		//顶点结构大小。每个mesh的顶点结构是固定的。
		this.vertNum=0;
		//当前的顶点的个数
		this.indexNum=0;
		//实际index 个数。例如一个三角形是3个。由于ib本身可能超过实际使用的数量，所以需要一个indexNum
		this._applied=false;
		//是否已经设置给webgl了
		this._vb=null;
		//vb和ib都可能需要在外部修改，所以public
		this._ib=null;
		this._vao=null;
		this._attribInfo=null;
		//保存起来的属性定义数组。
		this._quadNum=0;
		//public static var meshlist:Array=[];//活着的mesh对象列表。
		this.canReuse=false;
		this._stride=stride;
		this._vb=new VertexBuffer2D(stride,/*laya.webgl.WebGLContext.DYNAMIC_DRAW*/0x88E8);
		if (vballoc){
			this._vb._resizeBuffer(vballoc,false);
			}else{
			Config.webGL2D_MeshAllocMaxMem && this._vb._resizeBuffer(64 *1024 *stride,false);
		}
		this._ib=new IndexBuffer2D();
		if (iballoc){
			this._ib._resizeBuffer(iballoc,false);
		}
	}

	__class(Mesh2D,'laya.webgl.utils.Mesh2D');
	var __proto=Mesh2D.prototype;
	//TODO:coverage
	__proto.cloneWithNewVB=function(){
		var mesh=new Mesh2D(this._stride,0,0);
		mesh._ib=this._ib;
		mesh._quadNum=this._quadNum;
		mesh._attribInfo=this._attribInfo;
		return mesh;
	}

	//TODO:coverage
	__proto.cloneWithNewVBIB=function(){
		var mesh=new Mesh2D(this._stride,0,0);
		mesh._attribInfo=this._attribInfo;
		return mesh;
	}

	//TODO:coverage
	__proto.getVBW=function(){
		this._vb.setNeedUpload();
		return this._vb;
	}

	//TODO:coverage
	__proto.getVBR=function(){
		return this._vb;
	}

	//TODO:coverage
	__proto.getIBR=function(){
		return this._ib;
	}

	//TODO:coverage
	__proto.getIBW=function(){
		this._ib.setNeedUpload();
		return this._ib;
	}

	/**
	*直接创建一个固定的ib。按照固定四边形的索引。
	*@param var QuadNum
	*/
	__proto.createQuadIB=function(QuadNum){
		this._quadNum=QuadNum;
		this._ib._resizeBuffer(QuadNum *6 *2,false);
		this._ib.byteLength=this._ib.bufferLength;
		var bd=this._ib.getUint16Array();
		var idx=0;
		var curvert=0;
		for (var i=0;i < QuadNum;i++){
			bd[idx++]=curvert;
			bd[idx++]=curvert+2;
			bd[idx++]=curvert+1;
			bd[idx++]=curvert;
			bd[idx++]=curvert+3;
			bd[idx++]=curvert+2;
			curvert+=4;
		}
		this._ib.setNeedUpload();
	}

	/**
	*设置mesh的属性。每3个一组，对应的location分别是0,1,2...
	*含义是：type,size,offset
	*不允许多流。因此stride是固定的，offset只是在一个vertex之内。
	*@param attribs
	*/
	__proto.setAttributes=function(attribs){
		this._attribInfo=attribs;
		if (this._attribInfo.length % 3 !=0){
			throw 'Mesh2D setAttributes error!';
		}
	}

	/**
	*初始化VAO的配置，只需要执行一次。以后使用的时候直接bind就行
	*@param gl
	*/
	__proto.configVAO=function(gl){
		if (this._applied)
			return;
		this._applied=true;
		if (!this._vao){
			this._vao=new BufferState2D();
		}
		this._vao.bind();
		this._vb._bindForVAO();
		this._ib.setNeedUpload();
		this._ib._bind_uploadForVAO();
		var attribNum=this._attribInfo.length / 3;
		var idx=0;
		for (var i=0;i < attribNum;i++){
			var _size=this._attribInfo[idx+1];
			var _type=this._attribInfo[idx];
			var _off=this._attribInfo[idx+2];
			gl.enableVertexAttribArray(i);
			gl.vertexAttribPointer(i,_size,_type,false,this._stride,_off);
			idx+=3;
		}
		this._vao.unBind();
	}

	/**
	*应用这个mesh
	*@param gl
	*/
	__proto.useMesh=function(gl){
		this._applied || this.configVAO(gl);
		this._vao.bind();
		this._vb.bind();
		this._ib._bind_upload()|| this._ib.bind();
		this._vb._bind_upload()|| this._vb.bind();
	}

	//TODO:coverage
	__proto.getEleNum=function(){
		return this._ib.getBuffer().byteLength / 2;
	}

	/**
	*子类实现。用来把自己放到对应的回收池中，以便复用。
	*/
	__proto.releaseMesh=function(){}
	/**
	*释放资源。
	*/
	__proto.destroy=function(){}
	/**
	*清理vb数据
	*/
	__proto.clearVB=function(){
		this._vb.clear();
	}

	Mesh2D._gvaoid=0;
	return Mesh2D;
})()



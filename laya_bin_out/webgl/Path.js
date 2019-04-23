//class laya.webgl.canvas.Path
var Path=(function(){
	var renderPath;
	function Path(){
		//public var _rect:Rectangle;
		this._lastOriX=0;
		//moveto等的原始位置。没有经过内部矩阵变换的
		this._lastOriY=0;
		this.paths=[];
		//所有的路径。{@type renderPath[] }
		this._curPath=null;
	}

	__class(Path,'laya.webgl.canvas.Path');
	var __proto=Path.prototype;
	__proto.beginPath=function(convex){
		this.paths.length=1;
		this._curPath=this.paths[0]=new renderPath();
		this._curPath.convex=convex;
	}

	//_curPath.path=[];
	__proto.closePath=function(){
		this._curPath.loop=true;
	}

	__proto.newPath=function(){
		this._curPath=new renderPath();
		this.paths.push(this._curPath);
	}

	__proto.addPoint=function(pointX,pointY){
		this._curPath.path.push(pointX,pointY);
	}

	//直接添加一个完整的path
	__proto.push=function(points,convex){
		if (!this._curPath){
			this._curPath=new renderPath();
			this.paths.push(this._curPath);
			}else if (this._curPath.path.length > 0){
			this._curPath=new renderPath();
			this.paths.push(this._curPath);
		};
		var rp=this._curPath;
		rp.path=points.slice();
		rp.convex=convex;
	}

	__proto.reset=function(){
		this.paths.length=0;
	}

	Path.__init$=function(){
		//TODO 复用
		
/**
*<code>Viewport</code> 类用于创建视口。
*/
//class laya.d3.math.Viewport
var Viewport=(function(){
	function Viewport(x,y,width,height){
		/**X轴坐标*/
		//this.x=NaN;
		/**Y轴坐标*/
		//this.y=NaN;
		/**宽度*/
		//this.width=NaN;
		/**高度*/
		//this.height=NaN;
		/**最小深度*/
		//this.minDepth=NaN;
		/**最大深度*/
		//this.maxDepth=NaN;
		this.minDepth=0.0;
		this.maxDepth=1.0;
		this.x=x;
		this.y=y;
		this.width=width;
		this.height=height;
	}

	__class(Viewport,'laya.d3.math.Viewport');
	var __proto=Viewport.prototype;
	/**
	*变换一个三维向量。
	*@param source 源三维向量。
	*@param matrix 变换矩阵。
	*@param vector 输出三维向量。
	*/
	__proto.project=function(source,matrix,out){
		Vector3.transformV3ToV3(source,matrix,out);
		var sourceEleme=source.elements;
		var matrixEleme=matrix.elements;
		var outEleme=out.elements;
		var a=(((sourceEleme[0] *matrixEleme[3])+(sourceEleme[1] *matrixEleme[7]))+(sourceEleme[2] *matrixEleme[11]))+matrixEleme[15];
		if (a!==1.0){
			outEleme[0]=outEleme[0] / a;
			outEleme[1]=outEleme[1] / a;
			outEleme[2]=outEleme[2] / a;
		}
		outEleme[0]=(((outEleme[0]+1.0)*0.5)*this.width)+this.x;
		outEleme[1]=(((-outEleme[1]+1.0)*0.5)*this.height)+this.y;
		outEleme[2]=(outEleme[2] *(this.maxDepth-this.minDepth))+this.minDepth;
	}

	__proto.project1=function(source,matrix,out){
		var v4=Vector3._tempVector4;
		Vector3.transformV3ToV4(source,matrix,v4);
		var v4e=v4.elements;
		var dist=v4e[3];
		if (dist < 1e-1 && dist >-1e-6)dist=1e-6;
		v4e[0] /=dist;
		v4e[1] /=dist;
		v4e[2] /=dist;
		var outEleme=out.elements;
		outEleme[0]=(v4e[0]+1)*this.width / 2+this.x;
		outEleme[1]=(-v4e[1]+1)*this.height / 2+this.y;
		outEleme[2]=v4e[3];
		return;
	}

	/**
	*反变换一个三维向量。
	*@param source 源三维向量。
	*@param matrix 变换矩阵。
	*@param vector 输出三维向量。
	*/
	__proto.unprojectFromMat=function(source,matrix,out){
		var sourceEleme=source.elements;
		var matrixEleme=matrix.elements;
		var outEleme=out.elements;
		outEleme[0]=(((sourceEleme[0]-this.x)/ (this.width))*2.0)-1.0;
		outEleme[1]=-((((sourceEleme[1]-this.y)/ (this.height))*2.0)-1.0);
		var halfDepth=(this.maxDepth-this.minDepth)/ 2;
		outEleme[2]=(sourceEleme[2]-this.minDepth-halfDepth)/ halfDepth;
		var a=(((outEleme[0] *matrixEleme[3])+(outEleme[1] *matrixEleme[7]))+(outEleme[2] *matrixEleme[11]))+matrixEleme[15];
		Vector3.transformV3ToV3(out,matrix,out);
		if (a!==1.0){
			outEleme[0]=outEleme[0] / a;
			outEleme[1]=outEleme[1] / a;
			outEleme[2]=outEleme[2] / a;
		}
	}

	/**
	*反变换一个三维向量。
	*@param source 源三维向量。
	*@param projection 透视投影矩阵。
	*@param view 视图矩阵。
	*@param world 世界矩阵,可设置为null。
	*@param out 输出向量。
	*/
	__proto.unprojectFromWVP=function(source,projection,view,world,out){
		Matrix4x4.multiply(projection,view,Viewport._tempMatrix4x4);
		(world)&& (Matrix4x4.multiply(Viewport._tempMatrix4x4,world,Viewport._tempMatrix4x4));
		Viewport._tempMatrix4x4.invert(Viewport._tempMatrix4x4);
		this.unprojectFromMat(source,Viewport._tempMatrix4x4,out);
	}

	/**
	*克隆
	*@param out
	*/
	__proto.cloneTo=function(out){
		out.x=this.x;
		out.y=this.y;
		out.width=this.width;
		out.height=this.height;
		out.minDepth=this.minDepth;
		out.maxDepth=this.maxDepth;
	}

	__static(Viewport,
	['_tempMatrix4x4',function(){return this._tempMatrix4x4=new Matrix4x4();}
	]);
	return Viewport;
})()


/**

*/
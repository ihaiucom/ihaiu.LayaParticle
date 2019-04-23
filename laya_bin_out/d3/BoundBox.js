/**
*<code>BoundBox</code> 类用于创建包围盒。
*/
//class laya.d3.math.BoundBox
var BoundBox=(function(){
	function BoundBox(min,max){
		/**最小顶点。*/
		this.min=null;
		/**最大顶点。*/
		this.max=null;
		this.min=min;
		this.max=max;
	}

	__class(BoundBox,'laya.d3.math.BoundBox');
	var __proto=BoundBox.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*获取包围盒的8个角顶点。
	*@param corners 返回顶点的输出队列。
	*/
	__proto.getCorners=function(corners){
		corners.length=8;
		var mine=this.min.elements;
		var maxe=this.max.elements;
		var minX=mine[0];
		var minY=mine[1];
		var minZ=mine[2];
		var maxX=maxe[0];
		var maxY=maxe[1];
		var maxZ=maxe[2];
		corners[0]=new Vector3(minX,maxY,maxZ);
		corners[1]=new Vector3(maxX,maxY,maxZ);
		corners[2]=new Vector3(maxX,minY,maxZ);
		corners[3]=new Vector3(minX,minY,maxZ);
		corners[4]=new Vector3(minX,maxY,minZ);
		corners[5]=new Vector3(maxX,maxY,minZ);
		corners[6]=new Vector3(maxX,minY,minZ);
		corners[7]=new Vector3(minX,minY,minZ);
	}

	__proto.toDefault=function(){
		this.min.toDefault();
		this.max.toDefault();
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var dest=destObject;
		this.min.cloneTo(dest.min);
		this.max.cloneTo(dest.max);
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var dest=/*__JS__ */new this.constructor(new Vector3(),new Vector3());
		this.cloneTo(dest);
		return dest;
	}

	BoundBox.createfromPoints=function(points,out){
		if (points==null)
			throw new Error("points");
		var min=out.min;
		var max=out.max;
		var minE=min.elements;
		minE[0]=Number.MAX_VALUE;
		minE[1]=Number.MAX_VALUE;
		minE[2]=Number.MAX_VALUE;
		var maxE=max.elements;
		maxE[0]=-Number.MAX_VALUE;
		maxE[1]=-Number.MAX_VALUE;
		maxE[2]=-Number.MAX_VALUE;
		for (var i=0,n=points.length;i < n;++i){
			Vector3.min(min,points[i],min);
			Vector3.max(max,points[i],max);
		}
	}

	BoundBox.merge=function(box1,box2,out){
		Vector3.min(box1.min,box2.min,out.min);
		Vector3.max(box1.max,box2.max,out.max);
	}

	return BoundBox;
})()


/**
*@private

*/
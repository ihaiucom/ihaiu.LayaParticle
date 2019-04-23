/**
*<code>PixelLineRenderer</code> 类用于线渲染器。
*/
//class laya.d3.core.pixelLine.PixelLineRenderer extends laya.d3.core.render.BaseRender
var PixelLineRenderer=(function(_super){
	function PixelLineRenderer(owner){
		/**@private */
		this._projectionViewWorldMatrix=null;
		PixelLineRenderer.__super.call(this,owner);
		this._projectionViewWorldMatrix=new Matrix4x4();
	}

	__class(PixelLineRenderer,'laya.d3.core.pixelLine.PixelLineRenderer',_super);
	var __proto=PixelLineRenderer.prototype;
	/**
	*@inheritDoc
	*/
	__proto._calculateBoundingBox=function(){
		var minE=this._boundingBox.min.elements;
		minE[0]=-Number.MAX_VALUE;
		minE[1]=-Number.MAX_VALUE;
		minE[2]=-Number.MAX_VALUE;
		var maxE=this._boundingBox.min.elements;
		maxE[0]=Number.MAX_VALUE;
		maxE[1]=Number.MAX_VALUE;
		maxE[2]=Number.MAX_VALUE;
	}

	/**
	*@inheritDoc
	*/
	__proto._calculateBoundingSphere=function(){
		var centerE=this._boundingSphere.center.elements;
		centerE[0]=0;
		centerE[1]=0;
		centerE[2]=0;
		this._boundingSphere.radius=Number.MAX_VALUE;
	}

	/**
	*@inheritDoc
	*/
	__proto._renderUpdateWithCamera=function(context,transform){
		var projectionView=context.projectionViewMatrix;
		var sv=this._shaderValues;
		if (transform){
			var worldMat=transform.worldMatrix;
			sv.setMatrix4x4(Sprite3D.WORLDMATRIX,worldMat);
			Matrix4x4.multiply(projectionView,worldMat,this._projectionViewWorldMatrix);
			sv.setMatrix4x4(Sprite3D.MVPMATRIX,this._projectionViewWorldMatrix);
			}else {
			sv.setMatrix4x4(Sprite3D.WORLDMATRIX,Matrix4x4.DEFAULT);
			sv.setMatrix4x4(Sprite3D.MVPMATRIX,projectionView);
		}
	}

	return PixelLineRenderer;
})(BaseRender)


/**

*/
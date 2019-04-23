/**
*<code>TrailRenderer</code> 类用于创建拖尾渲染器。
*/
//class laya.d3.core.trail.TrailRenderer extends laya.d3.core.render.BaseRender
var TrailRenderer=(function(_super){
	function TrailRenderer(owner){
		this._projectionViewWorldMatrix=new Matrix4x4();
		TrailRenderer.__super.call(this,owner);
	}

	__class(TrailRenderer,'laya.d3.core.trail.TrailRenderer',_super);
	var __proto=TrailRenderer.prototype;
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
		this._owner.transform.position.cloneTo(this._boundingSphere.center);
		this._boundingSphere.radius=Number.MAX_VALUE;
	}

	/**
	*@inheritDoc
	*/
	__proto._needRender=function(boundFrustum){
		return true;
	}

	/**
	*@inheritDoc
	*/
	__proto._renderUpdate=function(state,transform){
		_super.prototype._renderUpdate.call(this,state,transform);
		(this._owner).trailFilter._update(state);
	}

	/**
	*@inheritDoc
	*/
	__proto._renderUpdateWithCamera=function(context,transform){
		var projectionView=context.projectionViewMatrix;
		if (transform){
			Matrix4x4.multiply(projectionView,transform.worldMatrix,this._projectionViewWorldMatrix);
			this._shaderValues.setMatrix4x4(Sprite3D.MVPMATRIX,this._projectionViewWorldMatrix);
			}else {
			this._shaderValues.setMatrix4x4(Sprite3D.MVPMATRIX,projectionView);
		}
		if (Laya3D.debugMode)
			this._renderRenderableBoundBox();
	}

	return TrailRenderer;
})(BaseRender)


/**

*/
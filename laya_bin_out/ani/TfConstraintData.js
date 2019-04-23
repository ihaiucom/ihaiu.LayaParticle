//class laya.ani.bone.TfConstraintData
var TfConstraintData=(function(){
	function TfConstraintData(){
		this.name=null;
		this.targetIndex=0;
		this.rotateMix=NaN;
		this.translateMix=NaN;
		this.scaleMix=NaN;
		this.shearMix=NaN;
		this.offsetRotation=NaN;
		this.offsetX=NaN;
		this.offsetY=NaN;
		this.offsetScaleX=NaN;
		this.offsetScaleY=NaN;
		this.offsetShearY=NaN;
		this.boneIndexs=[];
	}

	__class(TfConstraintData,'laya.ani.bone.TfConstraintData');
	return TfConstraintData;
})()


/**
*@private
*/

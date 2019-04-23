//class laya.ani.bone.PathConstraintData
var PathConstraintData=(function(){
	function PathConstraintData(){
		this.name=null;
		this.target=null;
		this.positionMode=null;
		this.spacingMode=null;
		this.rotateMode=null;
		this.offsetRotation=NaN;
		this.position=NaN;
		this.spacing=NaN;
		this.rotateMix=NaN;
		this.translateMix=NaN;
		this.bones=[];
	}

	__class(PathConstraintData,'laya.ani.bone.PathConstraintData');
	return PathConstraintData;
})()


/**
*@private
*/

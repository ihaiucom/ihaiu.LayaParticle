//class laya.ani.bone.IkConstraintData
var IkConstraintData=(function(){
	function IkConstraintData(){
		this.name=null;
		this.targetBoneName=null;
		this.bendDirection=1;
		this.mix=1;
		this.isSpine=true;
		this.targetBoneIndex=-1;
		this.boneNames=[];
		this.boneIndexs=[];
	}

	__class(IkConstraintData,'laya.ani.bone.IkConstraintData');
	return IkConstraintData;
})()


/**
*用于UV转换的工具类
*@private
*/

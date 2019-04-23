//class laya.ani.AnimationNodeContent
var AnimationNodeContent=(function(){
	function AnimationNodeContent(){
		this.name=null;
		this.parentIndex=0;
		this.parent=null;
		this.keyframeWidth=0;
		this.lerpType=0;
		this.interpolationMethod=null;
		this.childs=null;
		this.keyFrame=null;
		//=new Vector.<KeyFramesContent>;
		this.playTime=NaN;
		this.extenData=null;
		this.dataOffset=0;
	}

	__class(AnimationNodeContent,'laya.ani.AnimationNodeContent');
	return AnimationNodeContent;
})()


/**
*@private
*/

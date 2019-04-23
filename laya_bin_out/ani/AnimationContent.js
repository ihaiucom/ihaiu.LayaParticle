//class laya.ani.AnimationContent
var AnimationContent=(function(){
	function AnimationContent(){
		this.nodes=null;
		this.name=null;
		this.playTime=NaN;
		this.bone3DMap=null;
		this.totalKeyframeDatasLength=0;
	}

	__class(AnimationContent,'laya.ani.AnimationContent');
	return AnimationContent;
})()


/**
*@private
*/

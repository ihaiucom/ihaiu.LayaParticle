//class laya.ani.KeyFramesContent
var KeyFramesContent=(function(){
	function KeyFramesContent(){
		this.startTime=NaN;
		this.duration=NaN;
		this.interpolationData=null;
		//私有插值方式 [type0(插值类型),Data0(插值数据,可为空)，type1(插值类型),Data1(插值数据,可为空)] 注意：254全线性插值，255全不插值
		this.data=null;
		//=new Float32Array();
		this.dData=null;
		//=new Float32Array();
		this.nextData=null;
	}

	__class(KeyFramesContent,'laya.ani.KeyFramesContent');
	return KeyFramesContent;
})()


/**
*@private
*/

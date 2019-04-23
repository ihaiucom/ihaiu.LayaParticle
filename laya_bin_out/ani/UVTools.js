//class laya.ani.bone.UVTools
var UVTools=(function(){
	function UVTools(){}
	__class(UVTools,'laya.ani.bone.UVTools');
	UVTools.getRelativeUV=function(bigUV,smallUV,rst){
		var startX=bigUV[0];
		var width=bigUV[2]-bigUV[0];
		var startY=bigUV[1];
		var height=bigUV[5]-bigUV[1];
		if(!rst)rst=[];
		rst.length=smallUV.length;
		var i=0,len=0;
		len=rst.length;
		var dWidth=1 / width;
		var dHeight=1 / height;
		for (i=0;i < len;i+=2){
			rst[i]=(smallUV[i]-startX)*dWidth;
			rst[i+1]=(smallUV[i+1]-startY)*dHeight;
		}
		return rst;
	}

	UVTools.getAbsoluteUV=function(bigUV,smallUV,rst){
		if (bigUV[0]==0 && bigUV[1]==0 && bigUV[4]==1 && bigUV[5]==1){
			if (rst){
				Utils.copyArray(rst,smallUV);
				return rst;
				}else{
				return smallUV;
			}
		};
		var startX=bigUV[0];
		var width=bigUV[2]-bigUV[0];
		var startY=bigUV[1];
		var height=bigUV[5]-bigUV[1];
		if(!rst)rst=[];
		rst.length=smallUV.length;
		var i=0,len=0;
		len=rst.length;
		for (i=0;i < len;i+=2){
			rst[i]=smallUV[i]*width+startX;
			rst[i+1]=smallUV[i+1]*height+startY;
		}
		return rst;
	}

	return UVTools;
})()


/**
*@private
*/

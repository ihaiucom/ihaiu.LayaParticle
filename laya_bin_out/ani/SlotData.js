//class laya.ani.bone.SlotData
var SlotData=(function(){
	function SlotData(){
		this.name=null;
		this.displayArr=[];
	}

	__class(SlotData,'laya.ani.bone.SlotData');
	var __proto=SlotData.prototype;
	__proto.getDisplayByName=function(name){
		var tDisplay;
		for (var i=0,n=this.displayArr.length;i < n;i++){
			tDisplay=this.displayArr[i];
			if (tDisplay.attachmentName==name){
				return i;
			}
		}
		return-1;
	}

	return SlotData;
})()


/**
*@private
*@author ...
*/

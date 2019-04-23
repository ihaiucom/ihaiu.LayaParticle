/**
*<code>KeyframeNodeOwner</code> 类用于保存帧节点的拥有者信息。
*/
//class laya.d3.component.KeyframeNodeOwner
var KeyframeNodeOwner=(function(){
	function KeyframeNodeOwner(){
		/**@private */
		this.indexInList=-1;
		/**@private */
		this.referenceCount=0;
		/**@private */
		this.updateMark=-1;
		/**@private */
		this.type=-1;
		/**@private */
		this.fullPath=null;
		/**@private */
		this.propertyOwner=null;
		/**@private */
		this.property=null;
		/**@private */
		this.defaultValue=null;
		/**@private */
		this.crossFixedValue=null;
	}

	__class(KeyframeNodeOwner,'laya.d3.component.KeyframeNodeOwner');
	var __proto=KeyframeNodeOwner.prototype;
	/**
	*@private
	*/
	__proto.saveCrossFixedValue=function(){
		var pro=this.propertyOwner;
		if (pro){
			switch (this.type){
				case 0:;
					var proPat=this.property;
					var m=proPat.length-1;
					for (var j=0;j < m;j++){
						pro=pro[proPat[j]];
						if (!pro)
							break ;
					}
					this.crossFixedValue=pro[proPat[m]];
					break ;
				case 1:;
					var locPosE=pro.localPosition.elements;
					this.crossFixedValue || (this.crossFixedValue=new Float32Array(3));
					this.crossFixedValue[0]=locPosE[0];
					this.crossFixedValue[1]=locPosE[1];
					this.crossFixedValue[2]=locPosE[2];
					break ;
				case 2:;
					var locRotE=pro.localRotation.elements;
					this.crossFixedValue || (this.crossFixedValue=new Float32Array(4));
					this.crossFixedValue[0]=locRotE[0];
					this.crossFixedValue[1]=locRotE[1];
					this.crossFixedValue[2]=locRotE[2];
					this.crossFixedValue[3]=locRotE[3];
					break ;
				case 3:;
					var locScaE=pro.localScale.elements;
					this.crossFixedValue || (this.crossFixedValue=new Float32Array(3));
					this.crossFixedValue[0]=locScaE[0];
					this.crossFixedValue[1]=locScaE[1];
					this.crossFixedValue[2]=locScaE[2];
					break ;
				case 4:;
					var locEulE=pro.localRotationEuler.elements;
					this.crossFixedValue || (this.crossFixedValue=new Float32Array(3));
					this.crossFixedValue[0]=locEulE[0];
					this.crossFixedValue[1]=locEulE[1];
					this.crossFixedValue[2]=locEulE[2];
					break ;
				default :
					throw "Animator:unknown type.";
				}
		}
	}

	return KeyframeNodeOwner;
})()


/**
*...
*@author ...
*/
//class laya.d3.core.scene.SceneManager
var SceneManager=(function(){
	function SceneManager(){}
	__class(SceneManager,'laya.d3.core.scene.SceneManager');
	return SceneManager;
})()


/**

*/
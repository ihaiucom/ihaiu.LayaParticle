/**
*<code>Physics</code> 类用于简单物理检测。
*/
//class laya.d3.utils.Physics3DUtils
var Physics3DUtils=(function(){
	/**
	*创建一个 <code>Physics</code> 实例。
	*/
	function Physics3DUtils(){}
	__class(Physics3DUtils,'laya.d3.utils.Physics3DUtils');
	Physics3DUtils.setColliderCollision=function(collider1,collider2,collsion){}
	Physics3DUtils.getIColliderCollision=function(collider1,collider2){
		return false;
	}

	Physics3DUtils.COLLISIONFILTERGROUP_DEFAULTFILTER=0x1;
	Physics3DUtils.COLLISIONFILTERGROUP_STATICFILTER=0x2;
	Physics3DUtils.COLLISIONFILTERGROUP_KINEMATICFILTER=0x4;
	Physics3DUtils.COLLISIONFILTERGROUP_DEBRISFILTER=0x8;
	Physics3DUtils.COLLISIONFILTERGROUP_SENSORTRIGGER=0x10;
	Physics3DUtils.COLLISIONFILTERGROUP_CHARACTERFILTER=0x20;
	Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1=0x40;
	Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2=0x80;
	Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3=0x100;
	Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER4=0x200;
	Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER5=0x400;
	Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER6=0x800;
	Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER7=0x1000;
	Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER8=0x2000;
	Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER9=0x4000;
	Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER10=0x8000;
	Physics3DUtils.COLLISIONFILTERGROUP_ALLFILTER=-1;
	__static(Physics3DUtils,
	['gravity',function(){return this.gravity=new Vector3(0,-9.81,0);}
	]);
	return Physics3DUtils;
})()


/**

*/
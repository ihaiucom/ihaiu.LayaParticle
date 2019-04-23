//class laya.webgl.shapes.EarcutNode
var EarcutNode=(function(){
	function EarcutNode(i,x,y){
		this.i=null;
		this.x=null;
		this.y=null;
		this.prev=null;
		this.next=null;
		this.z=null;
		this.prevZ=null;
		this.nextZ=null;
		this.steiner=null;
		this.i=i;
		this.x=x;
		this.y=y;
		this.prev=null;
		this.next=null;
		this.z=null;
		this.prevZ=null;
		this.nextZ=null;
		this.steiner=false;
	}

	__class(EarcutNode,'laya.webgl.shapes.EarcutNode');
	return EarcutNode;
})()



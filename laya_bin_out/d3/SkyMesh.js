/**
*<code>SkyMesh</code> 类用于实现天空网格。
*/
//class laya.d3.resource.models.SkyMesh
var SkyMesh=(function(){
	function SkyMesh(){
		/**@private */
		this._vertexBuffer=null;
		/**@private */
		this._indexBuffer=null;
		/**@private */
		this._bufferState=null;
	}

	__class(SkyMesh,'laya.d3.resource.models.SkyMesh');
	var __proto=SkyMesh.prototype;
	/**
	*@private
	*/
	__proto._render=function(state){}
	return SkyMesh;
})()


/**

*/
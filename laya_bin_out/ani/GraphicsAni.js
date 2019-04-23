//class laya.ani.GraphicsAni extends laya.display.Graphics
var GraphicsAni=(function(_super){
	function GraphicsAni(){
		GraphicsAni.__super.call(this);;
	}

	__class(GraphicsAni,'laya.ani.GraphicsAni',_super);
	var __proto=GraphicsAni.prototype;
	//TODO:coverage
	__proto.drawSkin=function(skinA){
		this.drawTriangles(skinA.texture,0,0,skinA.vertices,skinA.uvs,skinA.indexes,skinA.transform||Matrix.EMPTY);
	}

	GraphicsAni.create=function(){
		var rs=GraphicsAni._caches.pop();
		return rs||new GraphicsAni();
	}

	GraphicsAni.recycle=function(graphics){
		graphics.clear();
		GraphicsAni._caches.push(graphics);
	}

	GraphicsAni._caches=[];
	return GraphicsAni;
})(Graphics)


/**
*...
*@author ww
*/

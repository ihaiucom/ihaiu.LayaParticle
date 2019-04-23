/**
*<code>SkyDome</code> 类用于创建天空盒。
*/
//class laya.d3.resource.models.SkyDome extends laya.d3.resource.models.SkyMesh
var SkyDome=(function(_super){
	function SkyDome(stacks,slices){
		/**@private */
		this._stacks=0;
		/**@private */
		this._slices=0;
		SkyDome.__super.call(this);
		(stacks===void 0)&& (stacks=48);
		(slices===void 0)&& (slices=48);
		this._stacks=stacks;
		this._slices=slices;
		var vertexDeclaration=VertexPositionTexture0.vertexDeclaration;
		var vertexFloatCount=vertexDeclaration.vertexStride / 4;
		var numberVertices=(this._stacks+1)*(this._slices+1);
		var numberIndices=(3 *this._stacks *(this._slices+1))*2;
		var vertices=new Float32Array(numberVertices *vertexFloatCount);
		var indices=new Uint16Array(numberIndices);
		var stackAngle=Math.PI / this._stacks;
		var sliceAngle=(Math.PI *2.0)/ this._slices;
		var vertexIndex=0;
		var vertexCount=0;
		var indexCount=0;
		for (var stack=0;stack < (this._stacks+1);stack++){
			var r=Math.sin(stack *stackAngle);
			var y=Math.cos(stack *stackAngle);
			for (var slice=0;slice < (this._slices+1);slice++){
				var x=r *Math.sin(slice *sliceAngle);
				var z=r *Math.cos(slice *sliceAngle);
				vertices[vertexCount+0]=x *SkyDome._radius;
				vertices[vertexCount+1]=y *SkyDome._radius;
				vertices[vertexCount+2]=z *SkyDome._radius;
				vertices[vertexCount+3]=-(slice / this._slices)+0.75;
				vertices[vertexCount+4]=stack / this._stacks;
				vertexCount+=vertexFloatCount;
				if (stack !=(this._stacks-1)){
					indices[indexCount++]=vertexIndex+1;
					indices[indexCount++]=vertexIndex;
					indices[indexCount++]=vertexIndex+(this._slices+1);
					indices[indexCount++]=vertexIndex+(this._slices+1);
					indices[indexCount++]=vertexIndex;
					indices[indexCount++]=vertexIndex+(this._slices);
					vertexIndex++;
				}
			}
		}
		this._vertexBuffer=new VertexBuffer3D(vertices.length *4,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4,false);
		this._vertexBuffer.vertexDeclaration=vertexDeclaration;
		this._indexBuffer=new IndexBuffer3D(/*laya.d3.graphics.IndexBuffer3D.INDEXTYPE_USHORT*/"ushort",indices.length,/*laya.webgl.WebGLContext.STATIC_DRAW*/0x88E4,false);
		this._vertexBuffer.setData(vertices);
		this._indexBuffer.setData(indices);
		var bufferState=new BufferState();
		bufferState.bind();
		bufferState.applyVertexBuffer(this._vertexBuffer);
		bufferState.applyIndexBuffer(this._indexBuffer);
		bufferState.unBind();
		this._bufferState=bufferState;
	}

	__class(SkyDome,'laya.d3.resource.models.SkyDome',_super);
	var __proto=SkyDome.prototype;
	__proto._render=function(state){
		var indexCount=this._indexBuffer.indexCount;
		LayaGL.instance.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,indexCount,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,0);
		Stat.trianglesFaces+=indexCount / 3;
		Stat.renderBatch++;
	}

	/**
	*获取堆数。
	*/
	__getset(0,__proto,'stacks',function(){
		return this._stacks;
	});

	/**
	*获取层数。
	*/
	__getset(0,__proto,'slices',function(){
		return this._slices;
	});

	SkyDome.__init__=function(){
		SkyDome.instance=new SkyDome();
	}

	SkyDome._radius=1;
	SkyDome.instance=null;
	return SkyDome;
})(SkyMesh)


/**

*/
//class laya.ani.bone.SkinSlotDisplayData
var SkinSlotDisplayData=(function(){
	function SkinSlotDisplayData(){
		this.name=null;
		this.attachmentName=null;
		this.type=0;
		this.transform=null;
		this.width=NaN;
		this.height=NaN;
		this.texture=null;
		this.bones=null;
		this.uvs=null;
		this.weights=null;
		this.triangles=null;
		this.vertices=null;
		this.lengths=null;
		this.verLen=0;
	}

	__class(SkinSlotDisplayData,'laya.ani.bone.SkinSlotDisplayData');
	var __proto=SkinSlotDisplayData.prototype;
	__proto.createTexture=function(currTexture){
		if (this.texture)return this.texture;
		this.texture=new Texture(currTexture.bitmap,this.uvs);
		if (this.uvs[0] > this.uvs[4]
			&& this.uvs[1] > this.uvs[5]){
			this.texture.width=currTexture.height;
			this.texture.height=currTexture.width;
			this.texture.offsetX=-currTexture.offsetX;
			this.texture.offsetY=-currTexture.offsetY;
			this.texture.sourceWidth=currTexture.sourceHeight;
			this.texture.sourceHeight=currTexture.sourceWidth;
			}else {
			this.texture.width=currTexture.width;
			this.texture.height=currTexture.height;
			this.texture.offsetX=-currTexture.offsetX;
			this.texture.offsetY=-currTexture.offsetY;
			this.texture.sourceWidth=currTexture.sourceWidth;
			this.texture.sourceHeight=currTexture.sourceHeight;
		}
		if (!Render.isWebGL){
			if (this.uvs[1] > this.uvs[5]){
				this.texture.offsetY=this.texture.sourceHeight-this.texture.height-this.texture.offsetY;
			}
		}
		return this.texture;
	}

	__proto.destory=function(){
		if (this.texture)this.texture.destroy();
	}

	return SkinSlotDisplayData;
})()


/**
*@private
*@author ...
*/

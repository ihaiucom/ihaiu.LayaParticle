/**
*<code>ColliderShape</code> 类用于创建形状碰撞器的父类，该类为抽象类。
*/
//class laya.d3.physics.shape.ColliderShape
var ColliderShape=(function(){
	function ColliderShape(){
		/**@private */
		//this._nativeShape=null;
		/**@private */
		//this._type=0;
		/**@private */
		this._attatched=false;
		/**@private */
		this._indexInCompound=-1;
		/**@private */
		this._compoundParent=null;
		/**@private */
		this._attatchedCollisionObject=null;
		/**@private */
		this._referenceCount=0;
		this.needsCustomCollisionCallback=false;
		this._scale=new Vector3(1,1,1);
		this._centerMatrix=new Matrix4x4();
		this._localOffset=new Vector3(0,0,0);
		this._localRotation=new Quaternion(0,0,0,1);
	}

	__class(ColliderShape,'laya.d3.physics.shape.ColliderShape');
	var __proto=ColliderShape.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*@private
	*/
	__proto._setScale=function(value){
		if (this._compoundParent){
			this.updateLocalTransformations();
			}else {
			var valueE=value.elements;
			ColliderShape._nativeScale.setValue(valueE[0],valueE[1],valueE[2]);
			this._nativeShape.setLocalScaling(ColliderShape._nativeScale);
		}
	}

	/**
	*@private
	*/
	__proto._addReference=function(){
		this._referenceCount++;
	}

	/**
	*@private
	*/
	__proto._removeReference=function(){
		this._referenceCount--;
	}

	/**
	*更新本地偏移,如果修改LocalOffset或LocalRotation需要调用。
	*/
	__proto.updateLocalTransformations=function(){
		if (this._compoundParent){
			var offset=ColliderShape._tempVector30;
			Vector3.multiply(this.localOffset,this._scale,offset);
			ColliderShape._createAffineTransformation(offset.elements,this.localRotation.elements,this._centerMatrix.elements);
			}else {
			ColliderShape._createAffineTransformation(this.localOffset.elements,this.localRotation.elements,this._centerMatrix.elements);
		}
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destColliderShape=destObject;
		this._localOffset.cloneTo(destColliderShape.localOffset);
		this._localRotation.cloneTo(destColliderShape.localRotation);
		destColliderShape.localOffset=destColliderShape.localOffset;
		destColliderShape.localRotation=destColliderShape.localRotation;
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		return null;
	}

	/**
	*@private
	*/
	__proto.destroy=function(){
		if (this._nativeShape){
			Laya3D._physics3D.destroy(this._nativeShape);
			this._nativeShape=null;
		}
	}

	/**
	*获取碰撞类型。
	*@return 碰撞类型。
	*/
	__getset(0,__proto,'type',function(){
		return this._type;
	});

	/**
	*设置Shape的本地偏移。
	*@param Shape的本地偏移。
	*/
	/**
	*获取Shape的本地偏移。
	*@return Shape的本地偏移。
	*/
	__getset(0,__proto,'localOffset',function(){
		return this._localOffset;
		},function(value){
		this._localOffset=value;
		if (this._compoundParent)
			this._compoundParent._updateChildTransform(this);
	});

	/**
	*设置Shape的本地旋转。
	*@param Shape的本地旋转。
	*/
	/**
	*获取Shape的本地旋转。
	*@return Shape的本地旋转。
	*/
	__getset(0,__proto,'localRotation',function(){
		return this._localRotation;
		},function(value){
		this._localRotation=value;
		if (this._compoundParent)
			this._compoundParent._updateChildTransform(this);
	});

	ColliderShape._creatShape=function(shapeData){
		var colliderShape;
		switch (shapeData.type){
			case "BoxColliderShape":;
				var sizeData=shapeData.size;
				colliderShape=sizeData ? new BoxColliderShape(sizeData[0],sizeData[1],sizeData[2]):new BoxColliderShape();
				break ;
			case "SphereColliderShape":
				colliderShape=new SphereColliderShape(shapeData.radius);
				break ;
			case "CapsuleColliderShape":
				colliderShape=new CapsuleColliderShape(shapeData.radius,shapeData.height,shapeData.orientation);
				break ;
			case "MeshColliderShape":;
				var meshCollider=new MeshColliderShape();
				shapeData.mesh && (meshCollider.mesh=Loader.getRes(shapeData.mesh));
				colliderShape=meshCollider;
				break ;
			case "ConeColliderShape":
				colliderShape=new ConeColliderShape(shapeData.radius,shapeData.height,shapeData.orientation);
				break ;
			case "CylinderColliderShape":
				colliderShape=new CylinderColliderShape(shapeData.radius,shapeData.height,shapeData.orientation);
				break ;
			default :
				throw "unknown shape type.";
			}
		if (shapeData.center){
			var localOffset=colliderShape.localOffset;
			localOffset.fromArray(shapeData.center);
			colliderShape.localOffset=localOffset;
		}
		return colliderShape;
	}

	ColliderShape._createAffineTransformation=function(trans,rot,outE){
		var x=rot[0],y=rot[1],z=rot[2],w=rot[3],x2=x+x,y2=y+y,z2=z+z;
		var xx=x *x2,xy=x *y2,xz=x *z2,yy=y *y2,yz=y *z2,zz=z *z2;
		var wx=w *x2,wy=w *y2,wz=w *z2;
		outE[0]=(1-(yy+zz));
		outE[1]=(xy+wz);
		outE[2]=(xz-wy);
		outE[3]=0;
		outE[4]=(xy-wz);
		outE[5]=(1-(xx+zz));
		outE[6]=(yz+wx);
		outE[7]=0;
		outE[8]=(xz+wy);
		outE[9]=(yz-wx);
		outE[10]=(1-(xx+yy));
		outE[11]=0;
		outE[12]=trans[0];
		outE[13]=trans[1];
		outE[14]=trans[2];
		outE[15]=1;
	}

	ColliderShape.SHAPEORIENTATION_UPX=0;
	ColliderShape.SHAPEORIENTATION_UPY=1;
	ColliderShape.SHAPEORIENTATION_UPZ=2;
	ColliderShape.SHAPETYPES_BOX=0;
	ColliderShape.SHAPETYPES_SPHERE=1;
	ColliderShape.SHAPETYPES_CYLINDER=2;
	ColliderShape.SHAPETYPES_CAPSULE=3;
	ColliderShape.SHAPETYPES_CONVEXHULL=4;
	ColliderShape.SHAPETYPES_COMPOUND=5;
	ColliderShape.SHAPETYPES_STATICPLANE=6;
	ColliderShape.SHAPETYPES_CONE=7;
	__static(ColliderShape,
	['_tempVector30',function(){return this._tempVector30=new Vector3();},'_nativeScale',function(){return this._nativeScale=new Laya3D._physics3D.btVector3(1,1,1);},'_nativeVector30',function(){return this._nativeVector30=new Laya3D._physics3D.btVector3(0,0,0);},'_nativQuaternion0',function(){return this._nativQuaternion0=new Laya3D._physics3D.btQuaternion(0,0,0,1);},'_nativeTransform0',function(){return this._nativeTransform0=new Laya3D._physics3D.btTransform();}
	]);
	return ColliderShape;
})()


/**
*...
*@author
*/
//class laya.d3.resource.TextureGenerator
var TextureGenerator=(function(){
	function TextureGenerator(){}
	__class(TextureGenerator,'laya.d3.resource.TextureGenerator');
	TextureGenerator.lightAttenTexture=function(x,y,maxX,maxY,index,data){
		var sqrRange=x / maxX;
		var atten=1.0 / (1.0+25.0 *sqrRange);
		if (sqrRange >=0.64){
			if (sqrRange > 1.0){
				atten=0;
				}else {
				atten *=1-(sqrRange-0.64)/ (1-0.64);
			}
		}
		data[index]=Math.floor(atten *255.0+0.5);
	}

	TextureGenerator.haloTexture=function(x,y,maxX,maxY,index,data){
		maxX >>=1;
		maxY >>=1;
		var xFac=(x-maxX)/ maxX;
		var yFac=(y-maxY)/ maxY;
		var sqrRange=xFac *xFac+yFac *yFac;
		if (sqrRange > 1.0){
			sqrRange=1.0;
		}
		data[index]=Math.floor((1.0-sqrRange)*255.0+0.5);
	}

	TextureGenerator._generateTexture2D=function(texture,textureWidth,textureHeight,func){
		var index=0;
		var size=0;
		switch (texture.format){
			case /*laya.webgl.resource.BaseTexture.FORMAT_R8G8B8*/0:
				size=3;
				break ;
			case /*laya.webgl.resource.BaseTexture.FORMAT_R8G8B8A8*/1:
				size=4;
				break ;
			case /*laya.webgl.resource.BaseTexture.FORMAT_ALPHA8*/2:
				size=1;
				break ;
			default :
				throw "GeneratedTexture._generateTexture: unkonw texture format.";
			};
		var data=new Uint8Array(textureWidth *textureHeight *size);
		for (var y=0;y < textureHeight;y++){
			for (var x=0;x < textureWidth;x++){
				func(x,y,textureWidth,textureHeight,index,data);
				index+=size;
			}
		}
		texture.setPixels(data);
	}

	return TextureGenerator;
})()


/**
*@private

*/
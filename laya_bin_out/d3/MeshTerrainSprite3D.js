/**
*<code>TerrainMeshSprite3D</code> 类用于创建网格。
*/
//class laya.d3.core.MeshTerrainSprite3D extends laya.d3.core.MeshSprite3D
var MeshTerrainSprite3D=(function(_super){
	function MeshTerrainSprite3D(mesh,heightMap,name){
		/**@private */
		this._minX=NaN;
		/**@private */
		this._minZ=NaN;
		/**@private */
		this._cellSize=null;
		/**@private */
		this._heightMap=null;
		MeshTerrainSprite3D.__super.call(this,mesh,name);
		this._heightMap=heightMap;
		this._cellSize=new Vector2();
	}

	__class(MeshTerrainSprite3D,'laya.d3.core.MeshTerrainSprite3D',_super);
	var __proto=MeshTerrainSprite3D.prototype;
	/**
	*@private
	*/
	__proto._disableRotation=function(){
		var rotation=this.transform.rotation;
		rotation.elements[0]=0;
		rotation.elements[1]=0;
		rotation.elements[2]=0;
		rotation.elements[3]=1;
		this.transform.rotation=rotation;
	}

	/**
	*@private
	*/
	__proto._getScaleX=function(){
		var worldMat=this.transform.worldMatrix;
		var worldMatE=worldMat.elements;
		var m11=worldMatE[0];
		var m12=worldMatE[1];
		var m13=worldMatE[2];
		return Math.sqrt((m11 *m11)+(m12 *m12)+(m13 *m13));
	}

	/**
	*@private
	*/
	__proto._getScaleZ=function(){
		var worldMat=this.transform.worldMatrix;
		var worldMatE=worldMat.elements;
		var m31=worldMatE[8];
		var m32=worldMatE[9];
		var m33=worldMatE[10];
		return Math.sqrt((m31 *m31)+(m32 *m32)+(m33 *m33));
	}

	/**
	*@private
	*/
	__proto._initCreateFromMesh=function(heightMapWidth,heightMapHeight){
		this._heightMap=HeightMap.creatFromMesh(this.meshFilter.sharedMesh,heightMapWidth,heightMapHeight,this._cellSize);
		var boundingBox=this.meshFilter.sharedMesh.boundingBox;
		var min=boundingBox.min;
		var max=boundingBox.max;
		this._minX=min.x;
		this._minZ=min.z;
	}

	/**
	*@private
	*/
	__proto._initCreateFromMeshHeightMap=function(texture,minHeight,maxHeight){
		var boundingBox=this.meshFilter.sharedMesh.boundingBox;
		this._heightMap=HeightMap.createFromImage(texture,minHeight,maxHeight);
		this._computeCellSize(boundingBox);
		var min=boundingBox.min;
		var max=boundingBox.max;
		this._minX=min.x;
		this._minZ=min.z;
	}

	/**
	*@private
	*/
	__proto._computeCellSize=function(boundingBox){
		var min=boundingBox.min;
		var max=boundingBox.max;
		var minX=min.x;
		var minZ=min.z;
		var maxX=max.x;
		var maxZ=max.z;
		var widthSize=maxX-minX;
		var heightSize=maxZ-minZ;
		this._cellSize.elements[0]=widthSize / (this._heightMap.width-1);
		this._cellSize.elements[1]=heightSize / (this._heightMap.height-1);
	}

	/**
	*@private
	*/
	__proto._update=function(state){
		this._disableRotation();
	}

	/**
	*获取地形高度。
	*@param x X轴坐标。
	*@param z Z轴坐标。
	*/
	__proto.getHeight=function(x,z){
		MeshTerrainSprite3D._tempVector3.elements[0]=x;
		MeshTerrainSprite3D._tempVector3.elements[1]=0;
		MeshTerrainSprite3D._tempVector3.elements[2]=z;
		this._disableRotation();
		var worldMat=this.transform.worldMatrix;
		worldMat.invert(MeshTerrainSprite3D._tempMatrix4x4);
		Vector3.transformCoordinate(MeshTerrainSprite3D._tempVector3,MeshTerrainSprite3D._tempMatrix4x4,MeshTerrainSprite3D._tempVector3);
		x=MeshTerrainSprite3D._tempVector3.elements[0];
		z=MeshTerrainSprite3D._tempVector3.elements[2];
		var c=(x-this._minX)/ this._cellSize.x;
		var d=(z-this._minZ)/ this._cellSize.y;
		var row=Math.floor(d);
		var col=Math.floor(c);
		var s=c-col;
		var t=d-row;
		var uy=NaN;
		var vy=NaN;
		var worldMatE=worldMat.elements;
		var m21=worldMatE[4];
		var m22=worldMatE[5];
		var m23=worldMatE[6];
		var scaleY=Math.sqrt((m21 *m21)+(m22 *m22)+(m23 *m23));
		var translateY=worldMatE[13];
		var h01=this._heightMap.getHeight(row,col+1);
		var h10=this._heightMap.getHeight((row+1),col);
		if (isNaN(h01)|| isNaN(h10))
			return NaN;
		if (s+t <=1.0){
			var h00=this._heightMap.getHeight(row,col);
			if (isNaN(h00))
				return NaN;
			uy=h01-h00;
			vy=h10-h00;
			return (h00+s *uy+t *vy)*scaleY+translateY;
			}else {
			var h11=this._heightMap.getHeight((row+1),col+1);
			if (isNaN(h11))
				return NaN;
			uy=h10-h11;
			vy=h01-h11;
			return (h11+(1.0-s)*uy+(1.0-t)*vy)*scaleY+translateY;
		}
	}

	/**
	*获取地形X轴最小位置。
	*@return 地形X轴最小位置。
	*/
	__getset(0,__proto,'minX',function(){
		var worldMat=this.transform.worldMatrix;
		var worldMatE=worldMat.elements;
		return this._minX *this._getScaleX()+worldMatE[12];
	});

	/**
	*获取地形X轴长度。
	*@return 地形X轴长度。
	*/
	__getset(0,__proto,'width',function(){
		return (this._heightMap.width-1)*this._cellSize.x *this._getScaleX();
	});

	/**
	*获取地形Z轴最小位置。
	*@return 地形X轴最小位置。
	*/
	__getset(0,__proto,'minZ',function(){
		var worldMat=this.transform.worldMatrix;
		var worldMatE=worldMat.elements;
		return this._minZ *this._getScaleZ()+worldMatE[14];
	});

	/**
	*获取地形Z轴长度。
	*@return 地形Z轴长度。
	*/
	__getset(0,__proto,'depth',function(){
		return (this._heightMap.height-1)*this._cellSize.y *this._getScaleZ();
	});

	MeshTerrainSprite3D.createFromMesh=function(mesh,heightMapWidth,heightMapHeight,name){
		var meshTerrainSprite3D=new MeshTerrainSprite3D(mesh,null,name);
		meshTerrainSprite3D._initCreateFromMesh(heightMapWidth,heightMapHeight);
		return meshTerrainSprite3D;
	}

	MeshTerrainSprite3D.createFromMeshAndHeightMap=function(mesh,texture,minHeight,maxHeight,name){
		var meshTerrainSprite3D=new MeshTerrainSprite3D(mesh,null,name);
		meshTerrainSprite3D._initCreateFromMeshHeightMap(texture,minHeight,maxHeight);
		return meshTerrainSprite3D;
	}

	__static(MeshTerrainSprite3D,
	['_tempVector3',function(){return this._tempVector3=new Vector3();},'_tempMatrix4x4',function(){return this._tempMatrix4x4=new Matrix4x4();}
	]);
	return MeshTerrainSprite3D;
})(MeshSprite3D)


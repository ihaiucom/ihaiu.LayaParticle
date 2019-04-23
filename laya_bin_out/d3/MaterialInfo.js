/**
*<code>MaterialInfo</code> 类用于描述地形材质信息。
*/
//class laya.d3.terrain.unit.MaterialInfo
var MaterialInfo=(function(){
	function MaterialInfo(){
		this.ambientColor=null;
		this.diffuseColor=null;
		this.specularColor=null;
		;
	}

	__class(MaterialInfo,'laya.d3.terrain.unit.MaterialInfo');
	return MaterialInfo;
})()


/**
*@private
*/
//class laya.d3.shader.ShaderData
var ShaderData=(function(){
	function ShaderData(ownerResource){
		/**@private */
		//this._ownerResource=null;
		/**@private */
		//this._data=null;
		/**@private [NATIVE]*/
		//this._int32Data=null;
		/**@private [NATIVE]*/
		//this._float32Data=null;
		/**@private [NATIVE]*/
		//this._nativeArray=null;
		/**@private [NATIVE]*/
		//this._frameCount=0;
		/**@private [NATIVE]*/
		this._runtimeCopyValues=[];
		this._ownerResource=ownerResource;
		this._initData();
	}

	__class(ShaderData,'laya.d3.shader.ShaderData');
	var __proto=ShaderData.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*@private
	*/
	__proto._initData=function(){
		this._data=new Object();
	}

	/**
	*获取布尔。
	*@param index shader索引。
	*@return 布尔。
	*/
	__proto.getBool=function(index){
		return this._data[index];
	}

	/**
	*设置布尔。
	*@param index shader索引。
	*@param value 布尔。
	*/
	__proto.setBool=function(index,value){
		this._data[index]=value;
	}

	/**
	*获取整形。
	*@param index shader索引。
	*@return 整形。
	*/
	__proto.getInt=function(index){
		return this._data[index];
	}

	/**
	*设置整型。
	*@param index shader索引。
	*@param value 整形。
	*/
	__proto.setInt=function(index,value){
		this._data[index]=value;
	}

	/**
	*获取浮点。
	*@param index shader索引。
	*@return 浮点。
	*/
	__proto.getNumber=function(index){
		return this._data[index];
	}

	/**
	*设置浮点。
	*@param index shader索引。
	*@param value 浮点。
	*/
	__proto.setNumber=function(index,value){
		this._data[index]=value;
	}

	/**
	*获取颜色。
	*@param index shader索引。
	*@return 颜色向量。
	*/
	__proto.getVector=function(index){
		return this._data[index];
	}

	/**
	*设置向量。
	*@param index shader索引。
	*@param value 向量。
	*/
	__proto.setVector=function(index,value){
		this._data[index]=value;
	}

	/**
	*获取四元数。
	*@param index shader索引。
	*@return 四元。
	*/
	__proto.getQuaternion=function(index){
		return this._data[index];
	}

	/**
	*设置四元数。
	*@param index shader索引。
	*@param value 四元数。
	*/
	__proto.setQuaternion=function(index,value){
		this._data[index]=value;
	}

	/**
	*获取矩阵。
	*@param index shader索引。
	*@return 矩阵。
	*/
	__proto.getMatrix4x4=function(index){
		return this._data[index];
	}

	/**
	*设置矩阵。
	*@param index shader索引。
	*@param value 矩阵。
	*/
	__proto.setMatrix4x4=function(index,value){
		this._data[index]=value;
	}

	/**
	*获取Buffer。
	*@param index shader索引。
	*@return
	*/
	__proto.getBuffer=function(shaderIndex){
		return this._data[shaderIndex];
	}

	/**
	*设置Buffer。
	*@param index shader索引。
	*@param value buffer数据。
	*/
	__proto.setBuffer=function(index,value){
		this._data[index]=value;
	}

	/**
	*设置纹理。
	*@param index shader索引。
	*@param value 纹理。
	*/
	__proto.setTexture=function(index,value){
		var lastValue=this._data[index];
		this._data[index]=value;
		if (this._ownerResource && this._ownerResource.referenceCount > 0){
			(lastValue)&& (lastValue._removeReference());
			(value)&& (value._addReference());
		}
	}

	/**
	*获取纹理。
	*@param index shader索引。
	*@return 纹理。
	*/
	__proto.getTexture=function(index){
		return this._data[index];
	}

	/**
	*设置Attribute。
	*@param index shader索引。
	*@param value 纹理。
	*/
	__proto.setAttribute=function(index,value){
		this._data[index]=value;
	}

	/**
	*获取Attribute。
	*@param index shader索引。
	*@return 纹理。
	*/
	__proto.getAttribute=function(index){
		return this._data[index];
	}

	/**
	*获取长度。
	*@return 长度。
	*/
	__proto.getLength=function(){
		return this._data.length;
	}

	/**
	*设置长度。
	*@param 长度。
	*/
	__proto.setLength=function(value){
		this._data.length=value;
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var dest=destObject;
		var destData=dest._data;
		for (var k in this._data){
			var value=this._data[k];
			if (value){
				if ((typeof value=='number')){
					destData[k]=value;
					}else if (((typeof value=='number')&& Math.floor(value)==value)){
					destData[k]=value;
					}else if ((typeof value=='boolean')){
					destData[k]=value;
					}else if ((value instanceof laya.d3.math.Vector2 )){
					var v2=(destData[k])|| (destData[k]=new Vector2());
					(value).cloneTo(v2);
					destData[k]=v2;
					}else if ((value instanceof laya.d3.math.Vector3 )){
					var v3=(destData[k])|| (destData[k]=new Vector3());
					(value).cloneTo(v3);
					destData[k]=v3;
					}else if ((value instanceof laya.d3.math.Vector4 )){
					var v4=(destData[k])|| (destData[k]=new Vector4());
					(value).cloneTo(v4);
					destData[k]=v4;
					}else if ((value instanceof laya.d3.math.Matrix4x4 )){
					var mat=(destData[k])|| (destData[k]=new Matrix4x4());
					(value).cloneTo(mat);
					destData[k]=mat;
					}else if ((value instanceof laya.webgl.resource.BaseTexture )){
					destData[k]=value;
				}
			}
		}
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneToForNative=function(destObject){
		var dest=destObject;
		var diffSize=this._int32Data.length-dest._int32Data.length;
		if (diffSize > 0){
			dest.needRenewArrayBufferForNative(this._int32Data.length);
		}
		dest._int32Data.set(this._int32Data,0);
		var destData=dest._nativeArray;
		var dataCount=this._nativeArray.length;
		destData.length=dataCount;
		for (var i=0;i < dataCount;i++){
			var value=this._nativeArray[i];
			if (value){
				if ((typeof value=='number')){
					destData[i]=value;
					dest.setNumber(i,value);
					}else if (((typeof value=='number')&& Math.floor(value)==value)){
					destData[i]=value;
					dest.setInt(i,value);
					}else if ((typeof value=='boolean')){
					destData[i]=value;
					dest.setBool(i,value);
					}else if ((value instanceof laya.d3.math.Vector2 )){
					var v2=(destData[i])|| (destData[i]=new Vector2());
					(value).cloneTo(v2);
					destData[i]=v2;
					dest.setVector(i,v2);
					}else if ((value instanceof laya.d3.math.Vector3 )){
					var v3=(destData[i])|| (destData[i]=new Vector3());
					(value).cloneTo(v3);
					destData[i]=v3;
					dest.setVector(i,v3);
					}else if ((value instanceof laya.d3.math.Vector4 )){
					var v4=(destData[i])|| (destData[i]=new Vector4());
					(value).cloneTo(v4);
					destData[i]=v4;
					dest.setVector(i,v4);
					}else if ((value instanceof laya.d3.math.Matrix4x4 )){
					var mat=(destData[i])|| (destData[i]=new Matrix4x4());
					(value).cloneTo(mat);
					destData[i]=mat;
					dest.setMatrix4x4(i,mat);
					}else if ((value instanceof laya.webgl.resource.BaseTexture )){
					destData[i]=value;
					dest.setTexture(i,value);
				}
			}
		}
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var dest=/*__JS__ */new this.constructor();
		this.cloneTo(dest);
		return dest;
	}

	/**
	*@private [NATIVE]
	*/
	__proto._initDataForNative=function(){
		var length=8;
		if (!length){
			alert("ShaderData _initDataForNative error length=0");
		}
		this._frameCount=-1;
		this._runtimeCopyValues.length=0;
		this._nativeArray=[];
		this._data=new ArrayBuffer(length *4);
		this._int32Data=new Int32Array(this._data);
		this._float32Data=new Float32Array(this._data);
		LayaGL.createArrayBufferRef(this._data,/*laya.layagl.LayaGL.ARRAY_BUFFER_TYPE_DATA*/0,true);
	}

	__proto.needRenewArrayBufferForNative=function(index){
		if (index >=this._int32Data.length){
			var nByteLen=(index+1)*4;
			var pre=this._int32Data;
			var preConchRef=this._data["conchRef"];
			var prePtrID=this._data["_ptrID"];
			this._data=new ArrayBuffer(nByteLen);
			this._int32Data=new Int32Array(this._data);
			this._float32Data=new Float32Array(this._data);
			this._data["conchRef"]=preConchRef;
			this._data["_ptrID"]=prePtrID;
			pre && this._int32Data.set(pre,0);
			/*__JS__ */conch.updateArrayBufferRef(this._data['_ptrID'],preConchRef.isSyncToRender(),this._data);
		}
	}

	/**
	*@private [NATIVE]
	*/
	__proto.getIntForNative=function(index){
		return this._int32Data[index];
	}

	/**
	*@private [NATIVE]
	*/
	__proto.setIntForNative=function(index,value){
		this.needRenewArrayBufferForNative(index);
		this._int32Data[index]=value;
	}

	/**
	*@private [NATIVE]
	*/
	__proto.getBoolForNative=function(index){
		return this._int32Data[index]==1;
	}

	/**
	*@private [NATIVE]
	*/
	__proto.setBoolForNative=function(index,value){
		this.needRenewArrayBufferForNative(index);
		this._int32Data[index]=value;
	}

	/**
	*@private [NATIVE]
	*/
	__proto.getNumberForNative=function(index){
		return this._float32Data[index];
	}

	/**
	*@private [NATIVE]
	*/
	__proto.setNumberForNative=function(index,value){
		this.needRenewArrayBufferForNative(index);
		this._float32Data[index]=value;
	}

	/**
	*@private [NATIVE]
	*/
	__proto.getMatrix4x4ForNative=function(index){
		alert("ShaderData getMatrix4x4 can't support");
		return null;
	}

	/**
	*@private [NATIVE]
	*/
	__proto.setMatrix4x4ForNative=function(index,value){
		this.needRenewArrayBufferForNative(index);
		this._nativeArray[index]=value;
		var nPtrID=this.setReferenceForNative(value.elements);
		this._int32Data[index]=nPtrID;
	}

	/**
	*@private [NATIVE]
	*/
	__proto.getVectorForNative=function(index){
		return this._nativeArray[index];
	}

	/**
	*@private [NATIVE]
	*/
	__proto.setVectorForNative=function(index,value){
		this.needRenewArrayBufferForNative(index);
		this._nativeArray[index]=value;
		var nPtrID=this.setReferenceForNative(value.elements);
		this._int32Data[index]=nPtrID;
	}

	/**
	*@private [NATIVE]
	*/
	__proto.getQuaternionForNative=function(index){
		alert("ShaderData getQuaternion can't support");
		return null;
	}

	/**
	*@private [NATIVE]
	*/
	__proto.setQuaternionForNative=function(index,value){
		this.needRenewArrayBufferForNative(index);
		this._nativeArray[index]=value;
		var nPtrID=this.setReferenceForNative(value.elements);
		this._int32Data[index]=nPtrID;
	}

	/**
	*@private [NATIVE]
	*/
	__proto.getBufferForNative=function(shaderIndex){
		alert("ShaderData getBuffer can't support");
		return null;
	}

	/**
	*@private [NATIVE]
	*/
	__proto.setBufferForNative=function(index,value){
		this.needRenewArrayBufferForNative(index);
		this._nativeArray[index]=value;
		var nPtrID=this.setReferenceForNative(value);
		this._int32Data[index]=nPtrID;
	}

	/**
	*@private [NATIVE]
	*/
	__proto.getAttributeForNative=function(index){
		alert("ShaderData  getAttribute can't support");
		return null;
	}

	/**
	*@private [NATIVE]
	*/
	__proto.setAttributeForNative=function(index,value){
		this._nativeArray[index]=value;
		if (!value["_ptrID"]){
			LayaGL.createArrayBufferRef(value,/*laya.layagl.LayaGL.ARRAY_BUFFER_TYPE_DATA*/0,true);
		}
		LayaGL.syncBufferToRenderThread(value);
		this._int32Data[index]=value["_ptrID"];
	}

	/**
	*@private [NATIVE]
	*/
	__proto.getTextureForNative=function(index){
		alert("ShaderData getTexture can't support");
		return null;
	}

	/**
	*@private [NATIVE]
	*/
	__proto.setTextureForNative=function(index,value){
		if (!value)return;
		this.needRenewArrayBufferForNative(index);
		this._nativeArray[index]=value;
		var lastValue=this._nativeArray[index];
		this._int32Data[index]=value._getSource().id;
		if (this._ownerResource && this._ownerResource.referenceCount > 0){
			(lastValue)&& (lastValue._removeReference());
			(value)&& (value._addReference());
		}
	}

	__proto.setReferenceForNative=function(value){
		this.clearRuntimeCopyArray();
		var nRefID=0;
		var nPtrID=0;
		if (ShaderData._SET_RUNTIME_VALUE_MODE_REFERENCE_){
			LayaGL.createArrayBufferRefs(value,/*laya.layagl.LayaGL.ARRAY_BUFFER_TYPE_DATA*/0,true,/*laya.layagl.LayaGL.ARRAY_BUFFER_REF_REFERENCE*/0);
			nRefID=0;
			nPtrID=value.getPtrID(nRefID);
			}else {
			LayaGL.createArrayBufferRefs(value,/*laya.layagl.LayaGL.ARRAY_BUFFER_TYPE_DATA*/0,true,/*laya.layagl.LayaGL.ARRAY_BUFFER_REF_COPY*/1);
			nRefID=value.getRefNum()-1;
			nPtrID=value.getPtrID(nRefID);
			this._runtimeCopyValues.push({"obj":value,"refID":nRefID,"ptrID":nPtrID});
		}
		LayaGL.syncBufferToRenderThread(value,nRefID);
		return nPtrID;
	}

	__proto.clearRuntimeCopyArray=function(){
		var currentFrame=LayaGL.getFrameCount();
		if (this._frameCount !=currentFrame){
			this._frameCount=currentFrame;
			for (var i=0,n=this._runtimeCopyValues.length;i < n;i++){
				var obj=this._runtimeCopyValues[i];
				obj.obj.clearRefNum();
			}
			this._runtimeCopyValues.length=0;
		}
	}

	ShaderData.setRuntimeValueMode=function(bReference){
		ShaderData._SET_RUNTIME_VALUE_MODE_REFERENCE_=bReference;
	}

	ShaderData._SET_RUNTIME_VALUE_MODE_REFERENCE_=true;
	return ShaderData;
})()


/**

*/
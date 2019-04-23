/**
*<code>Laya3D</code> 类用于初始化3D设置。
*/
//class Laya3D
var Laya3D=(function(){
	/**
	*创建一个 <code>Laya3D</code> 实例。
	*/
	function Laya3D(){}
	__class(Laya3D,'Laya3D');
	/**
	*获取是否可以启用物理。
	*@param 是否启用物理。
	*/
	__getset(1,Laya3D,'enbalePhysics',function(){
		return Laya3D._enbalePhysics;
	});

	Laya3D._cancelLoadByUrl=function(url){
		Laya.loader.cancelLoadByUrl(url);
		Laya3D._innerFirstLevelLoaderManager.cancelLoadByUrl(url);
		Laya3D._innerSecondLevelLoaderManager.cancelLoadByUrl(url);
		Laya3D._innerThirdLevelLoaderManager.cancelLoadByUrl(url);
		Laya3D._innerFourthLevelLoaderManager.cancelLoadByUrl(url);
	}

	Laya3D._changeWebGLSize=function(width,height){
		WebGL.onStageResize(width,height);
		RenderContext3D.clientWidth=width;
		RenderContext3D.clientHeight=height;
	}

	Laya3D.__init__=function(width,height,config){
		Config.isAntialias=config.isAntialias;
		Config.isAlpha=config.isAlpha;
		Config.premultipliedAlpha=config.premultipliedAlpha;
		Config.isStencil=config.isStencil;
		if (!WebGL.enable()){
			alert("Laya3D init error,must support webGL!");
			return;
		}
		RunDriver.changeWebGLSize=Laya3D._changeWebGLSize;
		Render.is3DMode=true;
		Laya.init(width,height);
		if (!Render.isConchApp){
			LayaGL.instance=WebGL.mainContext;
			LayaGL.instance.createCommandEncoder=function (reserveSize,adjustSize,isSyncToRenderThread){
				(reserveSize===void 0)&& (reserveSize=128);
				(adjustSize===void 0)&& (adjustSize=64);
				(isSyncToRenderThread===void 0)&& (isSyncToRenderThread=false);
				return new CommandEncoder(this,reserveSize,adjustSize,isSyncToRenderThread);
			}
		}
		if (Render.isConchApp)Laya3D.enableNative3D();
		Sprite3D.__init__();
		RenderableSprite3D.__init__();
		MeshSprite3D.__init__();
		SkinnedMeshSprite3D.__init__();
		ShuriKenParticle3D.__init__();
		BaseMaterial.__init__();
		BlinnPhongMaterial.__init__();
		PBRStandardMaterial.__init__();
		PBRSpecularMaterial.__init__();
		SkyProceduralMaterial.__init__();
		UnlitMaterial.__init__();
		TrailSprite3D.__init__();
		TrailMaterial.__init__();
		EffectMaterial.__init__();
		WaterPrimaryMaterial.__init__();
		ShurikenParticleMaterial.__init__();
		TerrainMaterial.__init__();
		ExtendTerrainMaterial.__init__();
		ShaderInit3D.__init__();
		Texture2D.__init__();
		TextureCube.__init__();
		SkyBox.__init__();
		SkyDome.__init__();
		FrustumCulling.__init__();
		HalfFloatUtils.__init__();
		var createMap=LoaderManager.createMap;
		createMap["lh"]=[ /*CLASS CONST:Laya3D.HIERARCHY*/"HIERARCHY",Sprite3D._parse];
		createMap["ls"]=[ /*CLASS CONST:Laya3D.HIERARCHY*/"HIERARCHY",Scene3D._parse];
		createMap["lm"]=[ /*CLASS CONST:Laya3D.MESH*/"MESH",Mesh._parse];
		createMap["lmat"]=[ /*CLASS CONST:Laya3D.MATERIAL*/"MATERIAL",BaseMaterial._parse];
		createMap["ltc"]=[ /*CLASS CONST:Laya3D.TEXTURECUBE*/"TEXTURECUBE",TextureCube._parse];
		createMap["jpg"]=[ /*CLASS CONST:Laya3D.TEXTURE2D*/"TEXTURE2D",Texture2D._parse];
		createMap["jpeg"]=[ /*CLASS CONST:Laya3D.TEXTURE2D*/"TEXTURE2D",Texture2D._parse];
		createMap["bmp"]=[ /*CLASS CONST:Laya3D.TEXTURE2D*/"TEXTURE2D",Texture2D._parse];
		createMap["gif"]=[ /*CLASS CONST:Laya3D.TEXTURE2D*/"TEXTURE2D",Texture2D._parse];
		createMap["png"]=[ /*CLASS CONST:Laya3D.TEXTURE2D*/"TEXTURE2D",Texture2D._parse];
		createMap["dds"]=[ /*CLASS CONST:Laya3D.TEXTURE2D*/"TEXTURE2D",Texture2D._parse];
		createMap["ktx"]=[ /*CLASS CONST:Laya3D.TEXTURE2D*/"TEXTURE2D",Texture2D._parse];
		createMap["pvr"]=[ /*CLASS CONST:Laya3D.TEXTURE2D*/"TEXTURE2D",Texture2D._parse];
		createMap["lani"]=[ /*CLASS CONST:Laya3D.ANIMATIONCLIP*/"ANIMATIONCLIP",AnimationClip._parse];
		createMap["lav"]=[ /*CLASS CONST:Laya3D.AVATAR*/"AVATAR",Avatar._parse];
		createMap["thdata"]=[ /*CLASS CONST:Laya3D.TERRAINHEIGHTDATA*/"TERRAINHEIGHTDATA",TerrainHeightData._pharse];
		var parserMap=Loader.parserMap;
		parserMap[ /*CLASS CONST:Laya3D.HIERARCHY*/"HIERARCHY"]=Laya3D._loadHierarchy;
		parserMap[ /*CLASS CONST:Laya3D.MESH*/"MESH"]=Laya3D._loadMesh;
		parserMap[ /*CLASS CONST:Laya3D.MATERIAL*/"MATERIAL"]=Laya3D._loadMaterial;
		parserMap[ /*CLASS CONST:Laya3D.TEXTURECUBE*/"TEXTURECUBE"]=Laya3D._loadTextureCube;
		parserMap[ /*CLASS CONST:Laya3D.TEXTURE2D*/"TEXTURE2D"]=Laya3D._loadTexture2D;
		parserMap[ /*CLASS CONST:Laya3D.ANIMATIONCLIP*/"ANIMATIONCLIP"]=Laya3D._loadAnimationClip;
		parserMap[ /*CLASS CONST:Laya3D.AVATAR*/"AVATAR"]=Laya3D._loadAvatar;
		Laya3D._innerFirstLevelLoaderManager.on(/*laya.events.Event.ERROR*/"error",null,Laya3D._eventLoadManagerError);
		Laya3D._innerSecondLevelLoaderManager.on(/*laya.events.Event.ERROR*/"error",null,Laya3D._eventLoadManagerError);
		Laya3D._innerThirdLevelLoaderManager.on(/*laya.events.Event.ERROR*/"error",null,Laya3D._eventLoadManagerError);
		Laya3D._innerFourthLevelLoaderManager.on(/*laya.events.Event.ERROR*/"error",null,Laya3D._eventLoadManagerError);
	}

	Laya3D.enableNative3D=function(){
		if (Render.isConchApp){
			/*__JS__ */LayaGL=window.LayaGLContext;
			var shaderData=ShaderData;
			var shader3D=ShaderInstance;
			var skinnedMeshRender=SkinnedMeshRenderer;
			var avatar=Avatar;
			var frustumCulling=FrustumCulling;
			shaderData.prototype._initData=shaderData.prototype._initDataForNative;
			shaderData.prototype.setBool=shaderData.prototype.setBoolForNative;
			shaderData.prototype.getBool=shaderData.prototype.getBoolForNative;
			shaderData.prototype.setInt=shaderData.prototype.setIntForNative;
			shaderData.prototype.getInt=shaderData.prototype.getIntForNative;
			shaderData.prototype.setNumber=shaderData.prototype.setNumberForNative;
			shaderData.prototype.getNumber=shaderData.prototype.getNumberForNative;
			shaderData.prototype.setVector=shaderData.prototype.setVectorForNative;
			shaderData.prototype.getVector=shaderData.prototype.getVectorForNative;
			shaderData.prototype.setQuaternion=shaderData.prototype.setQuaternionForNative;
			shaderData.prototype.getQuaternion=shaderData.prototype.getQuaternionForNative;
			shaderData.prototype.setMatrix4x4=shaderData.prototype.setMatrix4x4ForNative;
			shaderData.prototype.getMatrix4x4=shaderData.prototype.getMatrix4x4ForNative;
			shaderData.prototype.setBuffer=shaderData.prototype.setBufferForNative;
			shaderData.prototype.getBuffer=shaderData.prototype.getBufferForNative;
			shaderData.prototype.setTexture=shaderData.prototype.setTextureForNative;
			shaderData.prototype.getTexture=shaderData.prototype.getTextureForNative;
			shaderData.prototype.setAttribute=shaderData.prototype.setAttributeForNative;
			shaderData.prototype.getAttribute=shaderData.prototype.getAttributeForNative;
			shaderData.prototype.cloneTo=shaderData.prototype.cloneToForNative;
			shader3D.prototype._uniformMatrix2fv=shader3D.prototype._uniformMatrix2fvForNative;
			shader3D.prototype._uniformMatrix3fv=shader3D.prototype._uniformMatrix3fvForNative;
			shader3D.prototype._uniformMatrix4fv=shader3D.prototype._uniformMatrix4fvForNative;
			avatar.prototype._cloneDatasToAnimator=avatar.prototype._cloneDatasToAnimatorNative;
			frustumCulling.renderObjectCulling=FrustumCulling.renderObjectCullingNative;
			/*__JS__ */FloatKeyframe=window.conchFloatKeyframe;
			/*__JS__ */FloatArrayKeyframe=window.conchFloatArrayKeyframe;
			/*__JS__ */KeyframeNode=window.conchKeyframeNode;
			/*__JS__ */KeyframeNodeList=window.conchKeyframeNodeList;
			var animationClip=AnimationClip;
			animationClip.prototype._evaluateClipDatasRealTime=animationClip.prototype._evaluateClipDatasRealTimeForNative;
		}
		WebGL.shaderHighPrecision=false;
		var precisionFormat=LayaGL.instance.getShaderPrecisionFormat(/*laya.webgl.WebGLContext.FRAGMENT_SHADER*/0x8B30,/*laya.webgl.WebGLContext.HIGH_FLOAT*/0x8DF2);
		precisionFormat.precision ? WebGL.shaderHighPrecision=true :WebGL.shaderHighPrecision=false;
	}

	Laya3D.formatRelativePath=function(base,value){
		var path;
		path=base+value;
		var char1=value.charAt(0);
		if (char1==="."){
			var parts=path.split("/");
			for (var i=0,len=parts.length;i < len;i++){
				if (parts[i]=='..'){
					var index=i-1;
					if (index > 0 && parts[index]!=='..'){
						parts.splice(index,2);
						i-=2;
					}
				}
			}
			path=parts.join('/');
		}
		(URL.customFormat !=null)&& (path=URL.customFormat(path,null));
		return path;
	}

	Laya3D._endLoad=function(loader,content,subResous){
		if (subResous){
			for (var i=0,n=subResous.length;i < n;i++){
				var resou=Loader.getRes(subResous[i]);
				(resou)&& (resou._removeReference());
			}
		}
		loader.endLoad(content);
	}

	Laya3D._eventLoadManagerError=function(msg){
		Laya.loader.event(/*laya.events.Event.ERROR*/"error",msg);
	}

	Laya3D._addHierarchyInnerUrls=function(urls,urlMap,urlVersion,hierarchyBasePath,path,type,constructParams,propertyParams){
		var formatUrl=Laya3D.formatRelativePath(hierarchyBasePath,path);
		(urlVersion)&& (formatUrl=formatUrl+urlVersion);
		urls.push({url:formatUrl,type:type,constructParams:constructParams,propertyParams:propertyParams});
		urlMap.push(formatUrl);
		return formatUrl;
	}

	Laya3D._getSprite3DHierarchyInnerUrls=function(node,firstLevelUrls,secondLevelUrls,thirdLevelUrls,fourthLelUrls,subUrls,urlVersion,hierarchyBasePath){
		var i=0,n=0;
		var props=node.props;
		switch (node.type){
			case "Scene3D":;
				var lightmaps=props.lightmaps;
				for (i=0,n=lightmaps.length;i < n;i++){
					var lightMap=lightmaps[i];
					lightMap.path=Laya3D._addHierarchyInnerUrls(fourthLelUrls,subUrls,urlVersion,hierarchyBasePath,lightMap.path,/*CLASS CONST:Laya3D.TEXTURE2D*/"TEXTURE2D",lightMap.constructParams,lightMap.propertyParams);
				};
				var reflectionTextureData=props.reflectionTexture;
				(reflectionTextureData)&& (props.reflectionTexture=Laya3D._addHierarchyInnerUrls(thirdLevelUrls,subUrls,urlVersion,hierarchyBasePath,reflectionTextureData,/*CLASS CONST:Laya3D.TEXTURECUBE*/"TEXTURECUBE"));
				if (props.sky){
					var skyboxMaterial=props.sky.material;
					(skyboxMaterial)&& (skyboxMaterial.path=Laya3D._addHierarchyInnerUrls(secondLevelUrls,subUrls,urlVersion,hierarchyBasePath,skyboxMaterial.path,/*CLASS CONST:Laya3D.MATERIAL*/"MATERIAL"));
				}
				break ;
			case "Camera":;
				var skyboxMatData=props.skyboxMaterial;
				(skyboxMatData)&& (skyboxMatData.path=Laya3D._addHierarchyInnerUrls(secondLevelUrls,subUrls,urlVersion,hierarchyBasePath,skyboxMatData.path,/*CLASS CONST:Laya3D.MATERIAL*/"MATERIAL"));
				break ;
			case "TrailSprite3D":
			case "MeshSprite3D":
			case "SkinnedMeshSprite3D":;
				var meshPath=props.meshPath;
				(meshPath)&& (props.meshPath=Laya3D._addHierarchyInnerUrls(firstLevelUrls,subUrls,urlVersion,hierarchyBasePath,meshPath,/*CLASS CONST:Laya3D.MESH*/"MESH"));
				var materials=props.materials;
				if (materials)
					for (i=0,n=materials.length;i < n;i++)
				materials[i].path=Laya3D._addHierarchyInnerUrls(secondLevelUrls,subUrls,urlVersion,hierarchyBasePath,materials[i].path,/*CLASS CONST:Laya3D.MATERIAL*/"MATERIAL");
				break ;
			case "ShuriKenParticle3D":;
				var parMeshPath=props.meshPath;
				(parMeshPath)&& (props.meshPath=Laya3D._addHierarchyInnerUrls(firstLevelUrls,subUrls,urlVersion,hierarchyBasePath,parMeshPath,/*CLASS CONST:Laya3D.MESH*/"MESH"));
				props.material.path=Laya3D._addHierarchyInnerUrls(secondLevelUrls,subUrls,urlVersion,hierarchyBasePath,props.material.path,/*CLASS CONST:Laya3D.MATERIAL*/"MATERIAL");
				break ;
			case "Terrain":
				Laya3D._addHierarchyInnerUrls(fourthLelUrls,subUrls,urlVersion,hierarchyBasePath,props.dataPath,"TERRAIN");
				break ;
			};
		var components=node.components;
		if (components){
			for (var k=0,p=components.length;k < p;k++){
				var component=components[k];
				switch (component.type){
					case "Animator":;
						var avatarPath=component.avatarPath;
						var avatarData=component.avatar;
						(avatarData)&& (avatarData.path=Laya3D._addHierarchyInnerUrls(fourthLelUrls,subUrls,urlVersion,hierarchyBasePath,avatarData.path,"AVATAR"));
						var clipPaths=component.clipPaths;
						if (!clipPaths){
							var layersData=component.layers;
							for (i=0;i < layersData.length;i++){
								var states=layersData[i].states;
								for (var j=0,m=states.length;j < m;j++){
									var clipPath=states[j].clipPath;
									(clipPath)&& (states[j].clipPath=Laya3D._addHierarchyInnerUrls(fourthLelUrls,subUrls,urlVersion,hierarchyBasePath,clipPath,"ANIMATIONCLIP"));
								}
							}
							}else {
							for (i=0,n=clipPaths.length;i < n;i++)
							clipPaths[i]=Laya3D._addHierarchyInnerUrls(fourthLelUrls,subUrls,urlVersion,hierarchyBasePath,clipPaths[i],"ANIMATIONCLIP");
						}
						break ;
					case "PhysicsCollider":
					case "Rigidbody3D":
					case "CharacterController":;
						var shapes=component.shapes;
						for (i=0;i < shapes.length;i++){
							var shape=shapes[i];
							if (shape.type==="MeshColliderShape"){
								var mesh=shape.mesh;
								(mesh)&& (shape.mesh=Laya3D._addHierarchyInnerUrls(firstLevelUrls,subUrls,urlVersion,hierarchyBasePath,mesh,/*CLASS CONST:Laya3D.MESH*/"MESH"));
							}
						}
						break ;
					}
			}
		};
		var children=node.child;
		for (i=0,n=children.length;i < n;i++)
		Laya3D._getSprite3DHierarchyInnerUrls(children[i],firstLevelUrls,secondLevelUrls,thirdLevelUrls,fourthLelUrls,subUrls,urlVersion,hierarchyBasePath);
	}

	Laya3D._loadHierarchy=function(loader){
		loader.on(/*laya.events.Event.LOADED*/"loaded",null,Laya3D._onHierarchylhLoaded,[loader]);
		loader.load(loader.url,/*laya.net.Loader.JSON*/"json",false,null,true);
	}

	Laya3D._onHierarchylhLoaded=function(loader,lhData){
		var url=loader.url;
		var urlVersion=Utils3D.getURLVerion(url);
		var hierarchyBasePath=URL.getPath(url);
		var firstLevUrls=[];
		var secondLevUrls=[];
		var thirdLevUrls=[];
		var forthLevUrls=[];
		var subUrls=[];
		Laya3D._getSprite3DHierarchyInnerUrls(lhData.data,firstLevUrls,secondLevUrls,thirdLevUrls,forthLevUrls,subUrls,urlVersion,hierarchyBasePath);
		var urlCount=firstLevUrls.length+secondLevUrls.length+forthLevUrls.length;
		var totalProcessCount=urlCount+1;
		var weight=1 / totalProcessCount;
		Laya3D._onProcessChange(loader,0,weight,1.0);
		if (forthLevUrls.length > 0){
			var processCeil=urlCount / totalProcessCount;
			var processHandler=Handler.create(null,Laya3D._onProcessChange,[loader,weight,processCeil],false);
			Laya3D._innerFourthLevelLoaderManager._create(forthLevUrls,false,Handler.create(null,Laya3D._onHierarchyInnerForthLevResouLoaded,[loader,processHandler,lhData,subUrls,firstLevUrls,secondLevUrls,thirdLevUrls,weight+processCeil *forthLevUrls.length,processCeil]),processHandler,null,null,null,1,true);
			}else {
			Laya3D._onHierarchyInnerForthLevResouLoaded(loader,null,lhData,subUrls,firstLevUrls,secondLevUrls,thirdLevUrls,weight,processCeil);
		}
	}

	Laya3D._onHierarchyInnerForthLevResouLoaded=function(loader,processHandler,lhData,subUrls,firstLevUrls,secondLevUrls,thirdLevUrls,processOffset,processCeil){
		(processHandler)&& (processHandler.recover());
		if (thirdLevUrls.length > 0){
			var process=Handler.create(null,Laya3D._onProcessChange,[loader,processOffset,processCeil],false);
			Laya3D._innerThirdLevelLoaderManager._create(thirdLevUrls,false,Handler.create(null,Laya3D._onHierarchyInnerThirdLevResouLoaded,[loader,process,lhData,subUrls,firstLevUrls,secondLevUrls,processOffset+processCeil *secondLevUrls.length,processCeil]),processHandler,null,null,null,1,true);
			}else {
			Laya3D._onHierarchyInnerThirdLevResouLoaded(loader,null,lhData,subUrls,firstLevUrls,secondLevUrls,processOffset,processCeil);
		}
	}

	Laya3D._onHierarchyInnerThirdLevResouLoaded=function(loader,processHandler,lhData,subUrls,firstLevUrls,secondLevUrls,processOffset,processCeil){
		(processHandler)&& (processHandler.recover());
		if (secondLevUrls.length > 0){
			var process=Handler.create(null,Laya3D._onProcessChange,[loader,processOffset,processCeil],false);
			Laya3D._innerSecondLevelLoaderManager._create(secondLevUrls,false,Handler.create(null,Laya3D._onHierarchyInnerSecondLevResouLoaded,[loader,process,lhData,subUrls,firstLevUrls,processOffset+processCeil *secondLevUrls.length,processCeil]),processHandler,null,null,null,1,true);
			}else {
			Laya3D._onHierarchyInnerSecondLevResouLoaded(loader,null,lhData,subUrls,firstLevUrls,processOffset,processCeil);
		}
	}

	Laya3D._onHierarchyInnerSecondLevResouLoaded=function(loader,processHandler,lhData,subUrls,firstLevUrls,processOffset,processCeil){
		(processHandler)&& (processHandler.recover());
		if (firstLevUrls.length > 0){
			var process=Handler.create(null,Laya3D._onProcessChange,[loader,processOffset,processCeil],false);
			Laya3D._innerFirstLevelLoaderManager._create(firstLevUrls,false,Handler.create(null,Laya3D._onHierarchyInnerFirstLevResouLoaded,[loader,process,lhData,subUrls]),processHandler,null,null,null,1,true);
			}else {
			Laya3D._onHierarchyInnerFirstLevResouLoaded(loader,null,lhData,subUrls);
		}
	}

	Laya3D._onHierarchyInnerFirstLevResouLoaded=function(loader,processHandler,lhData,subUrls){
		(processHandler)&& (processHandler.recover());
		loader._cache=loader._createCache;
		var item=lhData.data.type==="Scene3D" ? Scene3D._parse(lhData,loader._propertyParams,loader._constructParams):Sprite3D._parse(lhData,loader._propertyParams,loader._constructParams);
		Laya3D._endLoad(loader,item,subUrls);
	}

	Laya3D._loadMesh=function(loader){
		loader.on(/*laya.events.Event.LOADED*/"loaded",null,Laya3D._onMeshLmLoaded,[loader]);
		loader.load(loader.url,/*laya.net.Loader.BUFFER*/"arraybuffer",false,null,true);
	}

	Laya3D._onMeshLmLoaded=function(loader,lmData){
		loader._cache=loader._createCache;
		var mesh=Mesh._parse(lmData,loader._propertyParams,loader._constructParams);
		Laya3D._endLoad(loader,mesh);
	}

	Laya3D._loadMaterial=function(loader){
		loader.on(/*laya.events.Event.LOADED*/"loaded",null,Laya3D._onMaterilLmatLoaded,[loader]);
		loader.load(loader.url,/*laya.net.Loader.JSON*/"json",false,null,true);
	}

	Laya3D._onMaterilLmatLoaded=function(loader,lmatData){
		var url=loader.url;
		var urlVersion=Utils3D.getURLVerion(url);
		var materialBasePath=URL.getPath(url);
		var urls=[];
		var subUrls=[];
		var customProps=lmatData.customProps;
		var formatSubUrl;
		var version=lmatData.version;
		switch (version){
			case "LAYAMATERIAL:01":
			case "LAYAMATERIAL:02":;
				var i=0,n=0;
				var textures=lmatData.props.textures;
				if (textures){
					for (i=0,n=textures.length;i < n;i++){
						var tex2D=textures[i];
						var tex2DPath=tex2D.path;
						if (tex2DPath){
							formatSubUrl=Laya3D.formatRelativePath(materialBasePath,tex2DPath);
							(urlVersion)&& (formatSubUrl=formatSubUrl+urlVersion);
							urls.push({url:formatSubUrl,constructParams:tex2D.constructParams,propertyParams:tex2D.propertyParams});
							subUrls.push(formatSubUrl);
							tex2D.path=formatSubUrl;
						}
					}
				}
				break ;
			default :
				throw new Error("Laya3D:unkonwn version.");
			};
		var urlCount=urls.length;
		var totalProcessCount=urlCount+1;
		var lmatWeight=1 / totalProcessCount;
		Laya3D._onProcessChange(loader,0,lmatWeight,1.0);
		if (urlCount > 0){
			var processHandler=Handler.create(null,Laya3D._onProcessChange,[loader,lmatWeight,urlCount / totalProcessCount],false);
			Laya3D._innerFourthLevelLoaderManager._create(urls,false,Handler.create(null,Laya3D._onMateialTexturesLoaded,[loader,processHandler,lmatData,subUrls]),processHandler,null,null,null,1,true);
			}else {
			Laya3D._onMateialTexturesLoaded(loader,null,lmatData,null);
		}
	}

	Laya3D._onMateialTexturesLoaded=function(loader,processHandler,lmatData,subUrls){
		loader._cache=loader._createCache;
		var mat=BaseMaterial._parse(lmatData,loader._propertyParams,loader._constructParams);
		Laya3D._endLoad(loader,mat,subUrls);
		(processHandler)&& (processHandler.recover());
	}

	Laya3D._loadAvatar=function(loader){
		loader.load(loader.url,/*laya.net.Loader.JSON*/"json",false,null,true);
		loader.on(/*laya.events.Event.LOADED*/"loaded",null,function(data){
			loader._cache=loader._createCache;
			var avatar=Avatar._parse(data,loader._propertyParams,loader._constructParams);
			Laya3D._endLoad(loader,avatar);
		});
	}

	Laya3D._loadAnimationClip=function(loader){
		loader.load(loader.url,/*laya.net.Loader.BUFFER*/"arraybuffer",false,null,true);
		loader.on(/*laya.events.Event.LOADED*/"loaded",null,function(data){
			loader._cache=loader._createCache;
			var clip=AnimationClip._parse(data,loader._propertyParams,loader._constructParams);
			Laya3D._endLoad(loader,clip);
		});
	}

	Laya3D._loadTexture2D=function(loader){
		var url=loader.url;
		var index=url.lastIndexOf('.')+1;
		var verIndex=url.indexOf('?');
		var endIndex=verIndex==-1 ? url.length :verIndex;
		var ext=url.substr(index,endIndex-index);
		var type;
		switch (ext){
			case "jpg":
			case "jpeg":
			case "bmp":
			case "gif":
			case "png":
				type="nativeimage";
				break ;
			case "dds":
			case "ktx":
			case "pvr":
				type=/*laya.net.Loader.BUFFER*/"arraybuffer";
				break ;
			}
		loader.load(loader.url,type,false,null,true);
		loader.on(/*laya.events.Event.LOADED*/"loaded",null,function(image){
			loader._cache=loader._createCache;
			var tex=Texture2D._parse(image,loader._propertyParams,loader._constructParams);
			Laya3D._endLoad(loader,tex);
		});
	}

	Laya3D._loadTextureCube=function(loader){
		loader.load(loader.url,/*laya.net.Loader.JSON*/"json",false,null,true);
		loader.on(/*laya.events.Event.LOADED*/"loaded",null,Laya3D._onTextureCubeLtcLoaded,[loader]);
	}

	Laya3D._onTextureCubeLtcLoaded=function(loader,ltcData){
		var ltcBasePath=URL.getPath(loader.url);
		var urls=[Laya3D.formatRelativePath(ltcBasePath,ltcData.front),Laya3D.formatRelativePath(ltcBasePath,ltcData.back),Laya3D.formatRelativePath(ltcBasePath,ltcData.left),Laya3D.formatRelativePath(ltcBasePath,ltcData.right),Laya3D.formatRelativePath(ltcBasePath,ltcData.up),Laya3D.formatRelativePath(ltcBasePath,ltcData.down)];
		var ltcWeight=1.0 / 7.0;
		Laya3D._onProcessChange(loader,0,ltcWeight,1.0);
		var processHandler=Handler.create(null,Laya3D._onProcessChange,[loader,ltcWeight,6 / 7],false);
		Laya3D._innerFourthLevelLoaderManager.load(urls,Handler.create(null,Laya3D._onTextureCubeImagesLoaded,[loader,urls,processHandler]),processHandler,"nativeimage");
	}

	Laya3D._onTextureCubeImagesLoaded=function(loader,urls,processHandler){
		var images=new Array(6);
		for (var i=0;i < 6;i++)
		images[i]=Loader.getRes(urls[i]);
		loader._cache=loader._createCache;
		var tex=TextureCube._parse(images,loader._propertyParams,loader._constructParams);
		processHandler.recover();
		for (i=0;i < 6;i++)
		Loader.clearRes(urls[i]);
		Laya3D._endLoad(loader,tex);
	}

	Laya3D._onProcessChange=function(loader,offset,weight,process){
		process=offset+process *weight;
		(process < 1.0)&& (loader.event(/*laya.events.Event.PROGRESS*/"progress",process));
	}

	Laya3D.init=function(width,height,config,compolete){
		if (Laya3D._isInit)
			return;
		Laya3D._isInit=true;
		config=config || Config3D._defaultConfig;
		Laya3D._editerEnvironment=config._editerEnvironment;
		var physics3D=window.Physics3D;
		if (physics3D==null)
		{
			Laya3D._enbalePhysics=false;
			Laya3D.__init__(width,height,config);
			compolete && compolete.run();
			
		}else 
		{
			Laya3D._enbalePhysics=true;
			physics3D(config.defaultPhysicsMemory *1024 *1024).then(function(){
				Laya3D.__init__(width,height,config);
				compolete && compolete.run();
			});
		}
	}

	// Hierarchy资源。
	Laya3D.HIERARCHY="HIERARCHY";
	// Mesh资源。
	Laya3D.MESH="MESH";
	// Material资源。
	Laya3D.MATERIAL="MATERIAL";
	//Texture2D资源。
	Laya3D.TEXTURE2D="TEXTURE2D";
	// TextureCube资源
	Laya3D.TEXTURECUBE="TEXTURECUBE";
	// AnimationClip资源。
	Laya3D.ANIMATIONCLIP="ANIMATIONCLIP";
	// Avatar资源。
	Laya3D.AVATAR="AVATAR";
	// Terrain资源。
	Laya3D.TERRAINHEIGHTDATA="TERRAINHEIGHTDATA";
	// Terrain资源。
	Laya3D.TERRAINRES="TERRAIN";
	Laya3D._isInit=false;
	Laya3D._enbalePhysics=false;
	Laya3D._editerEnvironment=false;
	Laya3D.debugMode=false;
	__static(Laya3D,
	['_innerFirstLevelLoaderManager',function(){return this._innerFirstLevelLoaderManager=new LoaderManager();},'_innerSecondLevelLoaderManager',function(){return this._innerSecondLevelLoaderManager=new LoaderManager();},'_innerThirdLevelLoaderManager',function(){return this._innerThirdLevelLoaderManager=new LoaderManager();},'_innerFourthLevelLoaderManager',function(){return this._innerFourthLevelLoaderManager=new LoaderManager();},'_physics3D',function(){return this._physics3D=window.Physics3D;},'physicsSettings',function(){return this.physicsSettings=new PhysicsSettings();}
	]);
	return Laya3D;
})()


/**
*...
*@author ...
*/
//class laya.d3.core.particleShuriKen.module.shape.ShapeUtils
var ShapeUtils=(function(){
	function ShapeUtils(){}
	__class(ShapeUtils,'laya.d3.core.particleShuriKen.module.shape.ShapeUtils');
	ShapeUtils._randomPointUnitArcCircle=function(arc,out,rand){
		var outE=out.elements;
		var angle=NaN;
		if (rand)
			angle=rand.getFloat()*arc;
		else
		angle=Math.random()*arc;
		outE[0]=Math.cos(angle);
		outE[1]=Math.sin(angle);
	}

	ShapeUtils._randomPointInsideUnitArcCircle=function(arc,out,rand){
		var outE=out.elements;
		ShapeUtils._randomPointUnitArcCircle(arc,out,rand);
		var range=NaN;
		if (rand)
			range=Math.pow(rand.getFloat(),1.0 / 2.0);
		else
		range=Math.pow(Math.random(),1.0 / 2.0);
		outE[0]=outE[0] *range;
		outE[1]=outE[1] *range;
	}

	ShapeUtils._randomPointUnitCircle=function(out,rand){
		var outE=out.elements;
		var angle=NaN;
		if (rand)
			angle=rand.getFloat()*Math.PI *2;
		else
		angle=Math.random()*Math.PI *2;
		outE[0]=Math.cos(angle);
		outE[1]=Math.sin(angle);
	}

	ShapeUtils._randomPointInsideUnitCircle=function(out,rand){
		var outE=out.elements;
		ShapeUtils._randomPointUnitCircle(out);
		var range=NaN;
		if (rand)
			range=Math.pow(rand.getFloat(),1.0 / 2.0);
		else
		range=Math.pow(Math.random(),1.0 / 2.0);
		outE[0]=outE[0] *range;
		outE[1]=outE[1] *range;
	}

	ShapeUtils._randomPointUnitSphere=function(out,rand){
		var outE=out.elements;
		var z=NaN;
		var a=NaN;
		if (rand){
			z=outE[2]=rand.getFloat()*2-1.0;
			a=rand.getFloat()*Math.PI *2;
			}else {
			z=outE[2]=Math.random()*2-1.0;
			a=Math.random()*Math.PI *2;
		};
		var r=Math.sqrt(1.0-z *z);
		outE[0]=r *Math.cos(a);
		outE[1]=r *Math.sin(a);
	}

	ShapeUtils._randomPointInsideUnitSphere=function(out,rand){
		var outE=out.elements;
		ShapeUtils._randomPointUnitSphere(out);
		var range=NaN;
		if (rand)
			range=Math.pow(rand.getFloat(),1.0 / 3.0);
		else
		range=Math.pow(Math.random(),1.0 / 3.0);
		outE[0]=outE[0] *range;
		outE[1]=outE[1] *range;
		outE[2]=outE[2] *range;
	}

	ShapeUtils._randomPointInsideHalfUnitBox=function(out,rand){
		var outE=out.elements;
		if (rand){
			outE[0]=(rand.getFloat()-0.5);
			outE[1]=(rand.getFloat()-0.5);
			outE[2]=(rand.getFloat()-0.5);
			}else {
			outE[0]=(Math.random()-0.5);
			outE[1]=(Math.random()-0.5);
			outE[2]=(Math.random()-0.5);
		}
	}

	return ShapeUtils;
})()


/**

*/
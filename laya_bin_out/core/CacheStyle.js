/**
*<code>/**
*<code>/**
*<code>/**
*<code>/**
*<code>/**
*<code>Render</code> 是渲染管理类。它是一个单例，可以使用 Laya.render 访问。
*/
//class laya.renders.Render
var Render=(function(){
	function Render(width,height){
		/**@private */
		this._timeId=0;
		Render._mainCanvas.source.id="layaCanvas";
		Render._mainCanvas.source.width=width;
		Render._mainCanvas.source.height=height;
		if (laya.renders.Render.isConchApp){
			Browser.document.body.appendChild(Render._mainCanvas.source);
		}
		else{
			Browser.container.appendChild(Render._mainCanvas.source);
		}
		RunDriver.initRender(Render._mainCanvas,width,height);
		Browser.window.requestAnimationFrame(loop);
		function loop (stamp){
			Laya.stage._loop();
			Browser.window.requestAnimationFrame(loop);
		}
		Laya.stage.on("visibilitychange",this,this._onVisibilitychange);
	}

	__class(Render,'laya.renders.Render');
	var __proto=Render.prototype;
	/**@private */
	__proto._onVisibilitychange=function(){
		if (!Laya.stage.isVisibility){
			this._timeId=Browser.window.setInterval(this._enterFrame,1000);
			}else if (this._timeId !=0){
			Browser.window.clearInterval(this._timeId);
		}
	}

	/**@private */
	__proto._enterFrame=function(e){
		Laya.stage._loop();
	}

	/**目前使用的渲染器。*/
	__getset(1,Render,'context',function(){
		return Render._context;
	});

	/**渲染使用的原生画布引用。 */
	__getset(1,Render,'canvas',function(){
		return Render._mainCanvas.source;
	});

	Render._context=null;
	Render._mainCanvas=null;
	Render.isWebGL=false;
	Render.is3DMode=false;
	__static(Render,
	['isConchApp',function(){return this.isConchApp=/*__JS__ */(window.conch !=null);}
	]);
	return Render;
})()


/**
*绘制Canvas贴图
*@private
*/
//class laya.display.cmd.DrawCanvasCmd
var DrawCanvasCmd=(function(){
	function DrawCanvasCmd(){
		this._graphicsCmdEncoder=null;
		this._index=0;
		this._paramData=null;
		/**
		*绘图数据
		*/
		this.texture=null;
		/**
		*绘制区域起始位置x
		*/
		this.x=NaN;
		/**
		*绘制区域起始位置y
		*/
		this.y=NaN;
		/**
		*绘制区域宽
		*/
		this.width=NaN;
		/**
		*绘制区域高
		*/
		this.height=NaN;
	}

	__class(DrawCanvasCmd,'laya.display.cmd.DrawCanvasCmd');
	var __proto=DrawCanvasCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._graphicsCmdEncoder=null;
		Pool.recover("DrawCanvasCmd",this);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "DrawCanvasCmd";
	});

	DrawCanvasCmd.create=function(texture,x,y,width,height){
		return null;
	}

	DrawCanvasCmd.ID="DrawCanvasCmd";
	DrawCanvasCmd._DRAW_IMAGE_CMD_ENCODER_=null;
	DrawCanvasCmd._PARAM_TEXTURE_POS_=2;
	DrawCanvasCmd._PARAM_VB_POS_=5;
	return DrawCanvasCmd;
})()


/**
*@private
*Context扩展类
*/
//class laya.resource.Context
var Context=(function(){
	function Context(){
		//this._canvas=null;
	}

	__class(Context,'laya.resource.Context');
	var __proto=Context.prototype;
	//TODO:coverage
	__proto.drawCanvas=function(canvas,x,y,width,height){
		Stat.renderBatch++;
		this.drawImage(canvas._source,x,y,width,height);
	}

	//TODO:coverage
	__proto._drawRect=function(x,y,width,height,style){
		Stat.renderBatch++;
		style && (this.fillStyle=style);
		/*__JS__ */this.fillRect(x,y,width,height);
	}

	//TODO:coverage
	__proto.drawText=function(text,x,y,font,color,textAlign){
		Stat.renderBatch++;
		if (arguments.length > 3 && font !=null){
			this.font=font;
			this.fillStyle=color;
			/*__JS__ */this.textAlign=textAlign;
			this.textBaseline="top";
		}
		/*__JS__ */this.fillText(text,x,y);
	}

	//TODO:coverage
	__proto.fillBorderText=function(text,x,y,font,fillColor,borderColor,lineWidth,textAlign){
		Stat.renderBatch++;
		this.font=font;
		this.fillStyle=fillColor;
		this.textBaseline="top";
		/*__JS__ */this.strokeStyle=borderColor;
		/*__JS__ */this.lineWidth=lineWidth;
		/*__JS__ */this.textAlign=textAlign;
		/*__JS__ */this.strokeText(text,x,y);
		/*__JS__ */this.fillText(text,x,y);
	}

	//TODO:coverage
	__proto.fillWords=function(words,x,y,font,color){
		font && (this.font=font);
		color && (this.fillStyle=color);
		this.textBaseline="top";
		/*__JS__ */this.textAlign='left';
		for (var i=0,n=words.length;i < n;i++){
			var a=words[i];
			/*__JS__ */this.fillText(a.char,a.x+x,a.y+y);
		}
	}

	//TODO:coverage
	__proto.fillBorderWords=function(words,x,y,font,color,borderColor,lineWidth){
		font && (this.font=font);
		color && (this.fillStyle=color);
		this.textBaseline="top";
		/*__JS__ */this.lineWidth=lineWidth;
		/*__JS__ */this.textAlign='left';
		/*__JS__ */this.strokeStyle=borderColor;
		for (var i=0,n=words.length;i < n;i++){
			var a=words[i];
			/*__JS__ */this.strokeText(a.char,a.x+x,a.y+y);
			/*__JS__ */this.fillText(a.char,a.x+x,a.y+y);
		}
	}

	//TODO:coverage
	__proto.strokeWord=function(text,x,y,font,color,lineWidth,textAlign){
		Stat.renderBatch++;
		if (arguments.length > 3 && font !=null){
			this.font=font;
			/*__JS__ */this.strokeStyle=color;
			/*__JS__ */this.lineWidth=lineWidth;
			/*__JS__ */this.textAlign=textAlign;
			this.textBaseline="top";
		}
		/*__JS__ */this.strokeText(text,x,y);
	}

	//TODO:coverage
	__proto.setTransformByMatrix=function(value){
		this.setTransform(value.a,value.b,value.c,value.d,value.tx,value.ty);
	}

	//TODO:coverage
	__proto.clipRect=function(x,y,width,height){
		Stat.renderBatch++;
		this.beginPath();
		this.rect(x,y,width,height);
		this.clip();
	}

	//TODO:coverage
	__proto.drawTextureWithTransform=function(tex,tx,ty,width,height,m,gx,gy,alpha,blendMode,colorfilter){
		if (!tex._getSource())
			return;
		Stat.renderBatch++;
		var alphaChanged=alpha!==1;
		if (alphaChanged){
			var temp=this.globalAlpha;
			this.globalAlpha *=alpha;
		}
		if (blendMode)
			this.globalCompositeOperation=blendMode;
		var uv=tex.uv,w=tex.bitmap._width,h=tex.bitmap._height;
		if (m){
			this.save();
			this.transform(m.a,m.b,m.c,m.d,m.tx+gx,m.ty+gy);
			this.drawImage(tex.bitmap._source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,tx,ty,width,height);
			this.restore();
			}else {
			this.drawImage(tex.bitmap._source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,gx+tx,gy+ty,width,height);
		}
		if (alphaChanged)
			this.globalAlpha=temp;
		if (blendMode)
			this.globalCompositeOperation="source-over";
	}

	//TODO:coverage
	__proto.drawTexture2=function(x,y,pivotX,pivotY,m,args2){
		var tex=args2[0];
		Stat.renderBatch++;
		var uv=tex.uv,w=tex.bitmap._width,h=tex.bitmap._height;
		if (m){
			this.save();
			this.transform(m.a,m.b,m.c,m.d,m.tx+x,m.ty+y);
			this.drawImage(tex.bitmap._source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,args2[1]-pivotX,args2[2]-pivotY,args2[3],args2[4]);
			this.restore();
			}else {
			this.drawImage(tex.bitmap._source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,args2[1]-pivotX+x,args2[2]-pivotY+y,args2[3],args2[4]);
		}
	}

	//TODO:coverage
	__proto.fillTexture=function(texture,x,y,width,height,type,offset,other){
		if (!other.pat){
			if (texture.uv !=Texture.DEF_UV){
				var canvas=new HTMLCanvas();
				canvas.getContext('2d');
				canvas.size(texture.width,texture.height);
				canvas.context.drawTexture(texture,0,0,texture.width,texture.height);
				texture=new Texture(canvas);
			}
			other.pat=this.createPattern(texture.bitmap._source,type);
		};
		var oX=x,oY=y;
		var sX=0,sY=0;
		if (offset){
			oX+=offset.x % texture.width;
			oY+=offset.y % texture.height;
			sX-=offset.x % texture.width;
			sY-=offset.y % texture.height;
		}
		this.translate(oX,oY);
		this._drawRect(sX,sY,width,height,other.pat);
		this.translate(-oX,-oY);
	}

	/**@private */
	__proto.flush=function(){
		return 0;
	}

	/**@private */
	__proto.destroy=function(){
		/*__JS__ */this.canvas.width=this.canvas.height=0;
	}

	/**@private */
	__proto.clear=function(){
		if(!Render.isConchApp)this.clearRect(0,0,Render._mainCanvas.width,Render._mainCanvas.height);
	}

	//TODO:coverage
	__proto.drawTriangle=function(texture,vertices,uvs,index0,index1,index2,matrix,canvasPadding){
		var source=texture.bitmap;
		var textureSource=source._getSource();
		var textureWidth=texture.width;
		var textureHeight=texture.height;
		var sourceWidth=source.width;
		var sourceHeight=source.height;
		var u0=uvs[index0] *sourceWidth;
		var u1=uvs[index1] *sourceWidth;
		var u2=uvs[index2] *sourceWidth;
		var v0=uvs[index0+1] *sourceHeight;
		var v1=uvs[index1+1] *sourceHeight;
		var v2=uvs[index2+1] *sourceHeight;
		var x0=vertices[index0];
		var x1=vertices[index1];
		var x2=vertices[index2];
		var y0=vertices[index0+1];
		var y1=vertices[index1+1];
		var y2=vertices[index2+1];
		if (canvasPadding){
			var paddingX=1;
			var paddingY=1;
			var centerX=(x0+x1+x2)/ 3;
			var centerY=(y0+y1+y2)/ 3;
			var normX=x0-centerX;
			var normY=y0-centerY;
			var dist=Math.sqrt((normX *normX)+(normY *normY));
			x0=centerX+((normX / dist)*(dist+paddingX));
			y0=centerY+((normY / dist)*(dist+paddingY));
			normX=x1-centerX;
			normY=y1-centerY;
			dist=Math.sqrt((normX *normX)+(normY *normY));
			x1=centerX+((normX / dist)*(dist+paddingX));
			y1=centerY+((normY / dist)*(dist+paddingY));
			normX=x2-centerX;
			normY=y2-centerY;
			dist=Math.sqrt((normX *normX)+(normY *normY));
			x2=centerX+((normX / dist)*(dist+paddingX));
			y2=centerY+((normY / dist)*(dist+paddingY));
		}
		this.save();
		if (matrix)
			this.transform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx,matrix.ty);
		this.beginPath();
		this.moveTo(x0,y0);
		this.lineTo(x1,y1);
		this.lineTo(x2,y2);
		this.closePath();
		this.clip();
		var delta=(u0 *v1)+(v0 *u2)+(u1 *v2)-(v1 *u2)-(v0 *u1)-(u0 *v2);
		var dDelta=1 / delta;
		var deltaA=(x0 *v1)+(v0 *x2)+(x1 *v2)-(v1 *x2)-(v0 *x1)-(x0 *v2);
		var deltaB=(u0 *x1)+(x0 *u2)+(u1 *x2)-(x1 *u2)-(x0 *u1)-(u0 *x2);
		var deltaC=(u0 *v1 *x2)+(v0 *x1 *u2)+(x0 *u1 *v2)-(x0 *v1 *u2)-(v0 *u1 *x2)-(u0 *x1 *v2);
		var deltaD=(y0 *v1)+(v0 *y2)+(y1 *v2)-(v1 *y2)-(v0 *y1)-(y0 *v2);
		var deltaE=(u0 *y1)+(y0 *u2)+(u1 *y2)-(y1 *u2)-(y0 *u1)-(u0 *y2);
		var deltaF=(u0 *v1 *y2)+(v0 *y1 *u2)+(y0 *u1 *v2)-(y0 *v1 *u2)-(v0 *u1 *y2)-(u0 *y1 *v2);
		this.transform(deltaA *dDelta,deltaD *dDelta,deltaB *dDelta,deltaE *dDelta,deltaC *dDelta,deltaF *dDelta);
		this.drawImage(textureSource,texture.uv[0] *sourceWidth,texture.uv[1] *sourceHeight,textureWidth,textureHeight,texture.uv[0] *sourceWidth,texture.uv[1] *sourceHeight,textureWidth,textureHeight);
		this.restore();
	}

	//=============新增==================
	__proto.transformByMatrix=function(matrix,tx,ty){
		this.transform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx+tx,matrix.ty+ty);
	}

	__proto.saveTransform=function(matrix){
		this.save();
	}

	__proto.restoreTransform=function(matrix){
		this.restore();
	}

	__proto.drawRect=function(x,y,width,height,fillColor,lineColor,lineWidth){
		var ctx=this;
		if (fillColor !=null){
			ctx.fillStyle=fillColor;
			ctx.fillRect(x,y,width,height);
		}
		if (lineColor !=null){
			ctx.strokeStyle=lineColor;
			ctx.lineWidth=lineWidth;
			ctx.strokeRect(x,y,width,height);
		}
	}

	//TODO:coverage
	__proto.drawTexture=function(tex,x,y,width,height){
		var source=tex._getSource();
		if (!source)return;
		Stat.renderBatch++;
		var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
		this.drawImage(source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x,y,width,height);
	}

	__proto.drawTextures=function(tex,pos,tx,ty){
		Stat.renderBatch+=pos.length / 2;
		var w=tex.width;
		var h=tex.height;
		for (var i=0,sz=pos.length;i < sz;i+=2){
			this.drawTexture(tex,pos[i]+tx,pos[i+1]+ty,w,h);
		}
	}

	//TODO:coverage
	__proto.drawTriangles=function(texture,x,y,vertices,uvs,indices,matrix,alpha,color,blendMode){
		var i=0,len=indices.length;
		this.translate(x,y);
		for (i=0;i < len;i+=3){
			var index0=indices[i] *2;
			var index1=indices[i+1] *2;
			var index2=indices[i+2] *2;
			this.drawTriangle(texture,vertices,uvs,index0,index1,index2,matrix,true);
		}
		this.translate(-x,-y);
	}

	__proto.alpha=function(value){
		this.globalAlpha *=value;
	}

	//TODO:coverage
	__proto._transform=function(mat,pivotX,pivotY){
		this.translate(pivotX,pivotY);
		this.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
		this.translate(-pivotX,-pivotY);
	}

	__proto._rotate=function(angle,pivotX,pivotY){
		this.translate(pivotX,pivotY);
		this.rotate(angle);
		this.translate(-pivotX,-pivotY);
	}

	__proto._scale=function(scaleX,scaleY,pivotX,pivotY){
		this.translate(pivotX,pivotY);
		this.scale(scaleX,scaleY);
		this.translate(-pivotX,-pivotY);
	}

	__proto._drawLine=function(x,y,fromX,fromY,toX,toY,lineColor,lineWidth,vid){
		this.beginPath();
		this.strokeStyle=lineColor;
		this.lineWidth=lineWidth;
		this.moveTo(x+fromX,y+fromY);
		this.lineTo(x+toX,y+toY);
		this.stroke();
	}

	__proto._drawLines=function(x,y,points,lineColor,lineWidth,vid){
		Render.isWebGL && this.setPathId(vid);
		this.beginPath();
		this.strokeStyle=lineColor;
		this.lineWidth=lineWidth;
		var i=2,n=points.length;
		if (Render.isWebGL){
			this.addPath(points.slice(),false,false,x,y);
			}else {
			this.moveTo(x+points[0],y+points[1]);
			while (i < n){
				this.lineTo(x+points[i++],y+points[i++]);
			}
		}
		this.stroke();
	}

	__proto.drawCurves=function(x,y,points,lineColor,lineWidth){
		this.beginPath();
		this.strokeStyle=lineColor;
		this.lineWidth=lineWidth;
		this.moveTo(x+points[0],y+points[1]);
		var i=2,n=points.length;
		while (i < n){
			this.quadraticCurveTo(x+points[i++],y+points[i++],x+points[i++],y+points[i++]);
		}
		this.stroke();
	}

	__proto._fillAndStroke=function(fillColor,strokeColor,lineWidth,isConvexPolygon){
		(isConvexPolygon===void 0)&& (isConvexPolygon=false);
		if (fillColor !=null){
			this.fillStyle=fillColor;
			this.fill();
		}
		if (strokeColor !=null && lineWidth > 0){
			this.strokeStyle=strokeColor;
			this.lineWidth=lineWidth;
			this.stroke();
		}
	}

	__proto._drawCircle=function(x,y,radius,fillColor,lineColor,lineWidth,vid){
		Stat.renderBatch++;
		Render.isWebGL? /*__JS__ */this.beginPath(true):this.beginPath();
		this.arc(x,y,radius,0,Context.PI2);
		this.closePath();
		this._fillAndStroke(fillColor,lineColor,lineWidth);
	}

	//矢量方法
	__proto._drawPie=function(x,y,radius,startAngle,endAngle,fillColor,lineColor,lineWidth,vid){
		this.beginPath();
		this.moveTo(x ,y);
		this.arc(x,y,radius,startAngle,endAngle);
		this.closePath();
		this._fillAndStroke(fillColor,lineColor,lineWidth);
	}

	//ctx.translate(-x-args[0],-y-args[1]);
	__proto._drawPoly=function(x,y,points,fillColor,lineColor,lineWidth,isConvexPolygon,vid){
		var i=2,n=points.length;
		this.beginPath();
		if (Render.isWebGL){
			this.setPathId(vid);
			this.addPath(points.slice(),true,isConvexPolygon,x,y);
			}else {
			this.moveTo(x+points[0],y+points[1]);
			while (i < n){
				this.lineTo(x+points[i++],y+points[i++]);
			}
		}
		this.closePath();
		this._fillAndStroke(fillColor,lineColor,lineWidth,isConvexPolygon);
	}

	__proto._drawPath=function(x,y,paths,brush,pen){
		this.beginPath();
		for (var i=0,n=paths.length;i < n;i++){
			var path=paths[i];
			switch (path[0]){
				case "moveTo":
					this.moveTo(x+path[1],y+path[2]);
					break ;
				case "lineTo":
					this.lineTo(x+path[1],y+path[2]);
					break ;
				case "arcTo":
					this.arcTo(x+path[1],y+path[2],x+path[3],y+path[4],path[5]);
					break ;
				case "closePath":
					this.closePath();
					break ;
				}
		}
		if (brush !=null){
			this.fillStyle=brush.fillStyle;
			this.fill();
		}
		if (pen !=null){
			this.strokeStyle=pen.strokeStyle;
			this.lineWidth=pen.lineWidth || 1;
			this.lineJoin=pen.lineJoin;
			this.lineCap=pen.lineCap;
			this.miterLimit=pen.miterLimit;
			this.stroke();
		}
	}

	__proto.drawParticle=function(x,y,pt){}
	Context.__init__=function(to){
		var from=laya.resource.Context.prototype;
		to=to || /*__JS__ */CanvasRenderingContext2D.prototype;
		if(to.init2d)return;
		to.init2d=true;
		var funs=["saveTransform","restoreTransform","transformByMatrix","drawTriangles","drawTriangle",'drawTextures','fillWords','fillBorderWords','drawRect','strokeWord','drawText','fillTexture','setTransformByMatrix','clipRect','drawTexture','drawTexture2','drawTextureWithTransform','flush','clear','destroy','drawCanvas','fillBorderText','drawCurves',"_drawRect","alpha","_transform","_rotate","_scale","_drawLine","_drawLines","_drawCircle","_fillAndStroke","_drawPie","_drawPoly","_drawPath","drawTextureWithTransform"];
		funs.forEach(function(i){
			to[i]=from[i];
		});
	}

	Context.ENUM_TEXTALIGN_DEFAULT=0;
	Context.ENUM_TEXTALIGN_CENTER=1;
	Context.ENUM_TEXTALIGN_RIGHT=2;
	Context.PI2=2 *Math.PI;
	return Context;
})()


/**
*@private 场景辅助类
*/
//class laya.utils.SceneUtils
var SceneUtils=(function(){
	var DataWatcher,InitTool;
	function SceneUtils(){}
	__class(SceneUtils,'laya.utils.SceneUtils');
	SceneUtils.getBindFun=function(value){
		var fun=SceneUtils._funMap.get(value);
		if (fun==null){
			var temp="\""+value+"\"";
			temp=temp.replace(/^"\${|}"$/g,"").replace(/\${/g,"\"+").replace(/}/g,"+\"");
			var str="(function(data){if(data==null)return;with(data){try{\nreturn "+temp+"\n}catch(e){}}})";
			fun=Laya._runScript(str);
			SceneUtils._funMap.set(value,fun);
		}
		return fun;
	}

	SceneUtils.createByData=function(root,uiView){
		var tInitTool=InitTool.create();
		root=SceneUtils.createComp(uiView,root,root,null,tInitTool);
		root._setBit(/*laya.Const.NOT_READY*/0x08,true);
		if (root.hasOwnProperty("_idMap")){
			root["_idMap"]=tInitTool._idMap;
		}
		if (uiView.animations){
			var anilist=[];
			var animations=uiView.animations;
			var i=0,len=animations.length;
			var tAni;
			var tAniO;
			for (i=0;i < len;i++){
				tAni=new FrameAnimation();
				tAniO=animations[i];
				tAni._setUp(tInitTool._idMap,tAniO);
				root[tAniO.name]=tAni;
				tAni._setControlNode(root);
				switch (tAniO.action){
					case 1:
						tAni.play(0,false);
						break ;
					case 2:
						tAni.play(0,true);
						break ;
					}
				anilist.push(tAni);
			}
			root._aniList=anilist;
		}
		if (root._$componentType==="Scene" && root._width > 0 && uiView.props.hitTestPrior==null && !root.mouseThrough)
			root.hitTestPrior=true;
		tInitTool.beginLoad(root);
		return root;
	}

	SceneUtils.createInitTool=function(){
		return InitTool.create();
	}

	SceneUtils.createComp=function(uiView,comp,view,dataMap,initTool){
		if (uiView.type=="Scene3D"||uiView.type=="Sprite3D"){
			var outBatchSprits=[];
			var scene3D=Laya["Utils3D"]._createSceneByJsonForMaker(uiView,outBatchSprits,initTool);
			if (uiView.type=="Sprite3D")
				Laya["StaticBatchManager"].combine(scene3D,outBatchSprits);
			else
			Laya["StaticBatchManager"].combine(null,outBatchSprits);
			return scene3D;
		}
		comp=comp || SceneUtils.getCompInstance(uiView);
		if (!comp){
			if (uiView.props && uiView.props.runtime)
				console.warn("runtime not found:"+uiView.props.runtime);
			else
			console.warn("can not create:"+uiView.type);
			return null;
		};
		var child=uiView.child;
		if (child){
			var isList=comp["_$componentType"]=="List";
			for (var i=0,n=child.length;i < n;i++){
				var node=child[i];
				if (comp.hasOwnProperty("itemRender")&& (node.props.name=="render" || node.props.renderType==="render")){
					comp["itemRender"]=node;
					}else if (node.type=="Graphic"){
					ClassUtils._addGraphicsToSprite(node,comp);
					}else if (ClassUtils._isDrawType(node.type)){
					ClassUtils._addGraphicToSprite(node,comp,true);
					}else {
					if (isList){
						var arr=[];
						var tChild=SceneUtils.createComp(node,null,view,arr,initTool);
						if (arr.length)
							tChild["_$bindData"]=arr;
						}else {
						tChild=SceneUtils.createComp(node,null,view,dataMap,initTool);
					}
					if (node.type=="Script"){
						if ((tChild instanceof laya.components.Component )){
							comp._addComponentInstance(tChild);
							}else {
							if ("owner" in tChild){
								tChild["owner"]=comp;
								}else if ("target" in tChild){
								tChild["target"]=comp;
							}
						}
						}else if (node.props.renderType=="mask" || node.props.name=="mask"){
						comp.mask=tChild;
						}else {(
						tChild instanceof laya.display.Node )&& comp.addChild(tChild);
					}
				}
			}
		};
		var props=uiView.props;
		for (var prop in props){
			var value=props[prop];
			if ((typeof value=='string')&& (value.indexOf("@node:")>=0 || value.indexOf("@Prefab:")>=0)){
				if (initTool){
					initTool.addNodeRef(comp,prop,value);
				}
			}else
			SceneUtils.setCompValue(comp,prop,value,view,dataMap);
		}
		if (comp._afterInited){
			comp._afterInited();
		}
		if (uiView.compId && initTool && initTool._idMap){
			initTool._idMap[uiView.compId]=comp;
		}
		return comp;
	}

	SceneUtils.setCompValue=function(comp,prop,value,view,dataMap){
		if ((typeof value=='string')&& value.indexOf("${")>-1){
			SceneUtils._sheet || (SceneUtils._sheet=ClassUtils.getClass("laya.data.Table"));
			if (!SceneUtils._sheet){
				console.warn("Can not find class Sheet");
				return;
			}
			if (dataMap){
				dataMap.push(comp,prop,value);
				}else if (view){
				if (value.indexOf("].")==-1){
					value=value.replace(".","[0].");
				};
				var watcher=new DataWatcher(comp,prop,value);
				watcher.exe(view);
				var one,temp;
				var str=value.replace(/\[.*?\]\./g,".");
				while ((one=SceneUtils._parseWatchData.exec(str))!=null){
					var key1=one[1];
					while ((temp=SceneUtils._parseKeyWord.exec(key1))!=null){
						var key2=temp[0];
						var arr=(view._watchMap[key2] || (view._watchMap[key2]=[]));
						arr.push(watcher);
						SceneUtils._sheet.I.notifer.on(key2,view,view.changeData,[key2]);
					}
					arr=(view._watchMap[key1] || (view._watchMap[key1]=[]));
					arr.push(watcher);
					SceneUtils._sheet.I.notifer.on(key1,view,view.changeData,[key1]);
				}
			}
			return;
		}
		if (prop==="var" && view){
			view[value]=comp;
			}else {
			comp[prop]=(value==="true" ? true :(value==="false" ? false :value));
		}
	}

	SceneUtils.getCompInstance=function(json){
		if (json.type=="UIView"){
			if (json.props && json.props.pageData){
				return SceneUtils.createByData(null,json.props.pageData);
			}
		};
		var runtime=(json.props && json.props.runtime)|| json.type;
		var compClass=ClassUtils.getClass(runtime);
		if (!compClass)throw "Can not find class "+runtime;
		if (json.type==="Script" && compClass.prototype._doAwake){
			var comp=Pool.createByClass(compClass);
			comp._destroyed=false;
			return comp;
		}
		if (json.props && json.props.hasOwnProperty("renderType")&& json.props["renderType"]=="instance"){
			if (!compClass["instance"])compClass["instance"]=new compClass();
			return compClass["instance"];
		}
		return new compClass();
	}

	SceneUtils._sheet=null;
	__static(SceneUtils,
	['_funMap',function(){return this._funMap=new WeakObject();},'_parseWatchData',function(){return this._parseWatchData=/\${(.*?)}/g;},'_parseKeyWord',function(){return this._parseKeyWord=/[a-zA-Z_][a-zA-Z0-9_]*(?:(?:\.[a-zA-Z_][a-zA-Z0-9_]*)+)/g;}
	]);
	SceneUtils.__init$=function(){
		/**
		*@private 场景辅助类
		*/
		//class DataWatcher
		DataWatcher=(function(){
			function DataWatcher(comp,prop,value){
				this.comp=null;
				this.prop=null;
				this.value=null;
				this.comp=comp;
				this.prop=prop;
				this.value=value;
			}
			__class(DataWatcher,'');
			var __proto=DataWatcher.prototype;
			__proto.exe=function(view){
				var fun=SceneUtils.getBindFun(this.value);
				this.comp[this.prop]=fun.call(this,view);
			}
			return DataWatcher;
		})()
		/**
		*@private 场景辅助类
		*/
		//class InitTool
		InitTool=(function(){
			function InitTool(){
				/**@private */
				this._nodeRefList=null;
				/**@private */
				this._initList=null;
				this._loadList=null;
				/**@private */
				this._idMap=null;
				this._scene=null;
			}
			__class(InitTool,'');
			var __proto=InitTool.prototype;
			//TODO:coverage
			__proto.reset=function(){
				this._nodeRefList=null;
				this._initList=null;
				this._idMap=null;
				this._loadList=null;
				this._scene=null;
			}
			//TODO:coverage
			__proto.recover=function(){
				this.reset();
				Pool.recover("InitTool",this);
			}
			//TODO:coverage
			__proto.addLoadRes=function(url,type){
				if (!this._loadList)this._loadList=[];
				if (!type){
					this._loadList.push(url);
					}else {
					this._loadList.push({url:url,type:type});
				}
			}
			//TODO:coverage
			__proto.addNodeRef=function(node,prop,referStr){
				if (!this._nodeRefList)this._nodeRefList=[];
				this._nodeRefList.push([node,prop,referStr]);
				if (referStr.indexOf("@Prefab:")>=0){
					this.addLoadRes(referStr.replace("@Prefab:",""),/*laya.net.Loader.PREFAB*/"prefab");
				}
			}
			//TODO:coverage
			__proto.setNodeRef=function(){
				if (!this._nodeRefList)return;
				if (!this._idMap){
					this._nodeRefList=null;
					return;
				};
				var i=0,len=0;
				len=this._nodeRefList.length;
				var tRefInfo;
				for (i=0;i < len;i++){
					tRefInfo=this._nodeRefList[i];
					tRefInfo[0][tRefInfo[1]]=this.getReferData(tRefInfo[2]);
				}
				this._nodeRefList=null;
			}
			//TODO:coverage
			__proto.getReferData=function(referStr){
				if (referStr.indexOf("@Prefab:")>=0){
					var prefab;
					prefab=Loader.getRes(referStr.replace("@Prefab:",""));
					return prefab;
					}else if (referStr.indexOf("@arr:")>=0){
					referStr=referStr.replace("@arr:","");
					var list;
					list=referStr.split(",");
					var i=0,len=0;
					var tStr;
					len=list.length;
					for (i=0;i < len;i++){
						tStr=list[i];
						if (tStr){
							list[i]=this._idMap[tStr.replace("@node:","")];
							}else {
							list[i]=null;
						}
					}
					return list;
					}else {
					return this._idMap[referStr.replace("@node:","")];
				}
			}
			//TODO:coverage
			__proto.addInitItem=function(item){
				if (!this._initList)this._initList=[];
				this._initList.push(item);
			}
			//TODO:coverage
			__proto.doInits=function(){
				if (!this._initList)return;
				this._initList=null;
			}
			//TODO:coverage
			__proto.finish=function(){
				this.setNodeRef();
				this.doInits();
				this._scene._setBit(/*laya.Const.NOT_READY*/0x08,false);
				if (this._scene.parent && this._scene.parent.activeInHierarchy && this._scene.active)this._scene._processActive();
				this._scene.event("onViewCreated");
				this.recover();
			}
			//TODO:coverage
			__proto.beginLoad=function(scene){
				this._scene=scene;
				if (!this._loadList || this._loadList.length < 1){
					this.finish();
					}else {
					Laya.loader.load(this._loadList,Handler.create(this,this.finish));
				}
			}
			InitTool.create=function(){
				var tool=Pool.getItemByClass("InitTool",InitTool);
				tool._idMap=[];
				return tool;
			}
			return InitTool;
		})()
	}

	return SceneUtils;
})()


/**
*根据坐标集合绘制多个贴图
*/
//class laya.display.cmd.DrawTexturesCmd
var DrawTexturesCmd=(function(){
	function DrawTexturesCmd(){
		/**
		*纹理。
		*/
		//this.texture=null;
		/**
		*绘制次数和坐标。
		*/
		//this.pos=null;
	}

	__class(DrawTexturesCmd,'laya.display.cmd.DrawTexturesCmd');
	var __proto=DrawTexturesCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this.texture._removeReference();
		this.texture=null;
		this.pos=null;
		Pool.recover("DrawTexturesCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.drawTextures(this.texture,this.pos,gx,gy);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "DrawTextures";
	});

	DrawTexturesCmd.create=function(texture,pos){
		var cmd=Pool.getItemByClass("DrawTexturesCmd",DrawTexturesCmd);
		cmd.texture=texture;
		texture._addReference();
		cmd.pos=pos;
		return cmd;
	}

	DrawTexturesCmd.ID="DrawTextures";
	return DrawTexturesCmd;
})()


/**
*@private
*存储cache相关
*/
//class laya.display.css.CacheStyle
var CacheStyle=(function(){
	function CacheStyle(){
		/**当前实际的cache状态*/
		//this.cacheAs=null;
		/**是否开启canvas渲染*/
		//this.enableCanvasRender=false;
		/**用户设的cacheAs类型*/
		//this.userSetCache=null;
		/**是否需要为滤镜cache*/
		//this.cacheForFilters=false;
		/**是否为静态缓存*/
		//this.staticCache=false;
		/**是否需要刷新缓存*/
		//this.reCache=false;
		/**mask对象*/
		//this.mask=null;
		/**作为mask时的父对象*/
		//this.maskParent=null;
		/**滤镜数据*/
		//this.filters=null;
		/**当前缓存区域*/
		//this.cacheRect=null;
		/**当前使用的canvas*/
		//this.canvas=null;
		/**滤镜数据*/
		//this.filterCache=null;
		/**是否有发光滤镜*/
		//this.hasGlowFilter=false;
		this.reset();
	}

	__class(CacheStyle,'laya.display.css.CacheStyle');
	var __proto=CacheStyle.prototype;
	/**
	*是否需要Bitmap缓存
	*@return
	*/
	__proto.needBitmapCache=function(){
		return this.cacheForFilters || !!this.mask;
	}

	/**
	*是否需要开启canvas渲染
	*/
	__proto.needEnableCanvasRender=function(){
		return this.userSetCache !="none" || this.cacheForFilters || !!this.mask;
	}

	/**
	*释放cache的资源
	*/
	__proto.releaseContext=function(){
		if (this.canvas && (this.canvas).size){
			Pool.recover("CacheCanvas",this.canvas);
			this.canvas.size(0,0);
		}
		this.canvas=null;
	}

	__proto.createContext=function(){
		if (!this.canvas){
			this.canvas=Pool.getItem("CacheCanvas")|| new HTMLCanvas(!Render.isWebGL);
			var tx=this.canvas.context;
			if (!tx){
				tx=this.canvas.getContext('2d');
			}
		}
	}

	/**
	*释放滤镜资源
	*/
	__proto.releaseFilterCache=function(){
		var fc=this.filterCache;
		if (fc){
			fc.destroy();
			fc.recycle();
			this.filterCache=null;
		}
	}

	/**
	*回收
	*/
	__proto.recover=function(){
		if (this===CacheStyle.EMPTY)return;
		Pool.recover("SpriteCache",this.reset());
	}

	/**
	*重置
	*/
	__proto.reset=function(){
		this.releaseContext();
		this.releaseFilterCache();
		this.cacheAs="none";
		this.enableCanvasRender=false;
		this.userSetCache="none";
		this.cacheForFilters=false;
		this.staticCache=false;
		this.reCache=true;
		this.mask=null;
		this.maskParent=null;
		this.filterCache=null;
		this.filters=null;
		this.hasGlowFilter=false;
		if(this.cacheRect)this.cacheRect.recover();
		this.cacheRect=null;
		return this
	}

	__proto._calculateCacheRect=function(sprite,tCacheType,x,y){
		var bWebGL=false;
		if (Render.isWebGL || Render.isConchApp){
			bWebGL=true;
		};
		var _cacheStyle=sprite._cacheStyle;
		if (!_cacheStyle.cacheRect)
			_cacheStyle.cacheRect=Rectangle.create();
		var tRec;
		if (!bWebGL || tCacheType==="bitmap"){
			tRec=sprite.getSelfBounds();
			if (!Render.isConchApp){
				tRec.width=tRec.width+16*2;
				tRec.height=tRec.height+16*2;
			}
			else{
				tRec.width=tRec.x+tRec.width+16*2;
				tRec.height=tRec.x+tRec.height+16*2;
			}
			tRec.x=tRec.x-sprite.pivotX;
			tRec.y=tRec.y-sprite.pivotY;
			tRec.x=tRec.x-16;
			tRec.y=tRec.y-16;
			tRec.x=Math.floor(tRec.x+x)-x;
			tRec.y=Math.floor(tRec.y+y)-y;
			tRec.width=Math.floor(tRec.width);
			tRec.height=Math.floor(tRec.height);
			_cacheStyle.cacheRect.copyFrom(tRec);
			}else {
			_cacheStyle.cacheRect.setTo(-sprite._style.pivotX,-sprite._style.pivotY,1,1);
		}
		tRec=_cacheStyle.cacheRect;
		var scaleX=bWebGL ? 1 :Browser.pixelRatio *Laya.stage.clientScaleX;
		var scaleY=bWebGL ? 1 :Browser.pixelRatio *Laya.stage.clientScaleY;
		if (!bWebGL){
			var chainScaleX=1;
			var chainScaleY=1;
			var tar;
			tar=sprite;
			while (tar && tar !=Laya.stage){
				chainScaleX *=tar.scaleX;
				chainScaleY *=tar.scaleY;
				tar=tar.parent;
			}
			if (chainScaleX > 1)scaleX *=chainScaleX;
			if (chainScaleY > 1)scaleY *=chainScaleY;
		}
		if (sprite._style.scrollRect){
			var scrollRect=sprite._style.scrollRect;
			tRec.x-=scrollRect.x;
			tRec.y-=scrollRect.y;
		}
		CacheStyle._scaleInfo.setTo(scaleX,scaleY);
		return CacheStyle._scaleInfo;
	}

	CacheStyle.create=function(){
		return Pool.getItemByClass("SpriteCache",CacheStyle);
	}

	CacheStyle.EMPTY=new CacheStyle();
	CacheStyle.CANVAS_EXTEND_EDGE=16;
	__static(CacheStyle,
	['_scaleInfo',function(){return this._scaleInfo=new Point();}
	]);
	return CacheStyle;
})()


/**
*位移命令
*/
//class laya.display.cmd.TranslateCmd
var TranslateCmd=(function(){
	function TranslateCmd(){
		/**
		*添加到水平坐标（x）上的值。
		*/
		//this.tx=NaN;
		/**
		*添加到垂直坐标（y）上的值。
		*/
		//this.ty=NaN;
	}

	__class(TranslateCmd,'laya.display.cmd.TranslateCmd');
	var __proto=TranslateCmd.prototype;
	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		Pool.recover("TranslateCmd",this);
	}

	/**@private */
	__proto.run=function(context,gx,gy){
		context.translate(this.tx,this.ty);
	}

	/**@private */
	__getset(0,__proto,'cmdID',function(){
		return "Translate";
	});

	TranslateCmd.create=function(tx,ty){
		var cmd=Pool.getItemByClass("TranslateCmd",TranslateCmd);
		cmd.tx=tx;
		cmd.ty=ty;
		return cmd;
	}

	TranslateCmd.ID="Translate";
	return TranslateCmd;
})()


/**
*@private

*/
*/
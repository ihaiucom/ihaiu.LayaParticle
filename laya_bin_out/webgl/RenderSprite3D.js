//class laya.webgl.utils.RenderSprite3D extends laya.renders.RenderSprite
var RenderSprite3D=(function(_super){
	function RenderSprite3D(type,next){
		RenderSprite3D.__super.call(this,type,next);
	}

	__class(RenderSprite3D,'laya.webgl.utils.RenderSprite3D',_super);
	var __proto=RenderSprite3D.prototype;
	__proto.onCreate=function(type){
		switch (type){
			case /*laya.display.SpriteConst.BLEND*/0x04:
				this._fun=this._blend;
				return;
			}
	}

	/**
	*mask的渲染。 sprite有mask属性的情况下，来渲染这个sprite
	*@param sprite
	*@param context
	*@param x
	*@param y
	*/
	__proto._mask=function(sprite,context,x,y){
		var next=this._next;
		var mask=sprite.mask;
		var submitCMD;
		var ctx=context;
		if (mask){
			ctx.save();
			var preBlendMode=ctx.globalCompositeOperation;
			var tRect=new Rectangle();
			tRect.copyFrom(mask.getBounds());
			tRect.width=Math.round(tRect.width);
			tRect.height=Math.round(tRect.height);
			tRect.x=Math.round(tRect.x);
			tRect.y=Math.round(tRect.y);
			if (tRect.width > 0 && tRect.height > 0){
				var w=tRect.width;
				var h=tRect.height;
				var tmpRT=WebGLRTMgr.getRT(w,h);
				ctx.breakNextMerge();
				ctx.pushRT();
				ctx.addRenderObject(SubmitCMD.create([ctx,tmpRT,w,h],laya.webgl.utils.RenderSprite3D.tmpTarget,this));
				mask.render(ctx,-tRect.x,-tRect.y);
				ctx.breakNextMerge();
				ctx.popRT();
				ctx.save();
				ctx.clipRect(x+tRect.x-sprite.getStyle().pivotX,y+tRect.y-sprite.getStyle().pivotY,w,h);
				next._fun.call(next,sprite,ctx,x,y);
				ctx.restore();
				preBlendMode=ctx.globalCompositeOperation;
				ctx.addRenderObject(SubmitCMD.create(["mask"],laya.webgl.utils.RenderSprite3D.setBlendMode,this));
				var shaderValue=Value2D.create(/*laya.webgl.shader.d2.ShaderDefines2D.TEXTURE2D*/0x01,0);
				var uv=Texture.INV_UV;
				ctx.drawTarget(tmpRT,x+tRect.x-sprite.getStyle().pivotX ,y+tRect.y-sprite.getStyle().pivotY,w,h,Matrix.TEMP.identity(),shaderValue,uv,6);
				ctx.addRenderObject(SubmitCMD.create([tmpRT],laya.webgl.utils.RenderSprite3D.recycleTarget,this));
				ctx.addRenderObject(SubmitCMD.create([preBlendMode],laya.webgl.utils.RenderSprite3D.setBlendMode,this));
			}
			ctx.restore();
			}else {
			next._fun.call(next,sprite,context,x,y);
		}
	}

	__proto._blend=function(sprite,context,x,y){
		var style=sprite._style;
		var next=this._next;
		if (style.blendMode){
			context.save();
			context.globalCompositeOperation=style.blendMode;
			next._fun.call(next,sprite,context,x,y);
			context.restore();
			}else {
			next._fun.call(next,sprite,context,x,y);
		}
	}

	RenderSprite3D.tmpTarget=function(ctx,rt,w,h){
		rt.start();
		rt.clear(0,0,0,0);
	}

	RenderSprite3D.recycleTarget=function(rt){
		WebGLRTMgr.releaseRT(rt);
	}

	RenderSprite3D.setBlendMode=function(blendMode){
		var gl=WebGL.mainContext;
		BlendMode.targetFns[BlendMode.TOINT[blendMode]](gl);
	}

	__static(RenderSprite3D,
	['tempUV',function(){return this.tempUV=new Array(8);}
	]);
	return RenderSprite3D;
})(RenderSprite)



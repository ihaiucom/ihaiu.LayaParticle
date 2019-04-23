//class laya.layagl.LayaGLTemplate
var LayaGLTemplate=(function(){
	function LayaGLTemplate(){
		this._commStr="";
		this._commandEncoder=null;
		this._id=0;
		this._commandEncoder=LayaGL.instance.createCommandEncoder(64,16,false);
	}

	__class(LayaGLTemplate,'laya.layagl.LayaGLTemplate');
	var __proto=LayaGLTemplate.prototype;
	//TODO:coverage
	__proto.addComd=function(funcName,argsArray){
		this._commStr+=funcName+"("+argsArray+");";
		this._commandEncoder[funcName].apply(this._commandEncoder,argsArray);
	}

	LayaGLTemplate.createByRenderType=function(renderType){
		var template=LayaGLTemplate.GLS[renderType]=new LayaGLTemplate();
		if (Render.isConchApp){
			LayaGL.instance.setGLTemplate(renderType,template._commandEncoder.getPtrID());
		};
		var n=/*laya.display.SpriteConst.ALPHA*/0x01;
		while (n <=/*laya.display.SpriteConst.CHILDS*/0x2000){
			var tempType=renderType & n;
			if (tempType && LayaGLTemplate.__FUN_PARAM__[n]){
				var objArr=LayaGLTemplate.__FUN_PARAM__[n];
				for (var i=0,sz=objArr.length;i < sz;i++){
					var obj=objArr[i];
					template.addComd(obj.func,obj.args);
				}
			}
			n <<=1;
		}
		template._id=renderType;
		console.log("template="+template._commStr);
		return template;
	}

	LayaGLTemplate.createByRenderTypeEnd=function(renderType){
		var template=LayaGLTemplate.GLSE[renderType]=new LayaGLTemplate();
		if (Render.isConchApp){
			LayaGL.instance.setEndGLTemplate(renderType,template._commandEncoder.getPtrID());
		};
		var n=/*laya.display.SpriteConst.CHILDS*/0x2000;
		while (n > /*laya.display.SpriteConst.ALPHA*/0x01){
			var tempType=renderType & n;
			if (tempType && LayaGLTemplate.__FUN_PARAM_END_[n]){
				var objArr=LayaGLTemplate.__FUN_PARAM_END_[n];
				for (var i=0,sz=objArr.length;i < sz;i++){
					var obj=objArr[i];
					template.addComd(obj.func,obj.args);
				}
			}
			n >>=1;
		}
		template._id=renderType;
		console.log("templateEnd="+template._commStr);
		return template;
	}

	LayaGLTemplate.__init__=function(){
		LayaGLTemplate.__FUN_PARAM__[ /*laya.display.SpriteConst.ALPHA*/0x01]=[{func:"setGlobalValueByParamData",args:[LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15,/*laya.display.SpriteConst.POSCOLOR*/22*4] }];
		LayaGLTemplate.__FUN_PARAM__[ /*laya.display.SpriteConst.TRANSFORM*/0x02]=[ {func:"calcLocalMatrix32",args:[ /*laya.display.SpriteConst.POSTRANSFORM_FLAG*/15*4,/*laya.display.SpriteConst.POSMATRIX*/16*4,/*laya.display.SpriteConst.POSX*/6*4,/*laya.display.SpriteConst.POSY*/7*4,/*laya.display.SpriteConst.POSPIVOTX*/8*4,/*laya.display.SpriteConst.POSPIVOTY*/9*4,/*laya.display.SpriteConst.POSSCALEX*/10*4,/*laya.display.SpriteConst.POSSCALEY*/11*4,/*laya.display.SpriteConst.POSSKEWX*/12*4,/*laya.display.SpriteConst.POSSKEWY*/13*4,/*laya.display.SpriteConst.POSROTATION*/14*4]},
		{func:"setGlobalValueByParamData",args:[LayaNative2D.GLOBALVALUE_MATRIX32,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7,/*laya.display.SpriteConst.POSMATRIX*/16 *4] }];
		LayaGLTemplate.__FUN_PARAM__[ /*laya.display.SpriteConst.BLEND*/0x04]=[ {func:"setGlobalValueByParamData",args:[LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,/*laya.display.SpriteConst.POSBLEND_SRC*/71 *4] },
		{func:"setGlobalValueByParamData",args:[LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST,/*laya.layagl.LayaGL.VALUE_OPERATE_SET*/8,/*laya.display.SpriteConst.POSBLEND_DEST*/72 *4] }];
		LayaGLTemplate.__FUN_PARAM__[ /*laya.display.SpriteConst.TEXTURE*/0x100]=[{func:"useCommandEncoderByParamData",args:[ /*laya.display.SpriteConst.POSSIM_TEXTURE_ID*/24*4,/*laya.display.SpriteConst.POSSIM_TEXTURE_DATA*/25 *4,/*laya.layagl.LayaGL.EXECUTE_RENDER_THREAD_BUFFER*/1] }];
		LayaGLTemplate.__FUN_PARAM__[ /*laya.display.SpriteConst.GRAPHICS*/0x200]=[ {func:"callbackJSByParamData",args:[ /*laya.display.SpriteConst.POSCALLBACK_OBJ_ID*/54*4,/*laya.display.SpriteConst.POSGRAPHICS_CALLBACK_FUN_ID*/68 *4] },
		{func:"useCommandEncoderByParamData",args:[ /*laya.display.SpriteConst.POSGRAPICS*/23 *4,-1,/*laya.layagl.LayaGL.EXECUTE_RENDER_THREAD_BUFFER*/1] }];
		LayaGLTemplate.__FUN_PARAM__[ /*laya.display.SpriteConst.LAYAGL3D*/0x400]=[{func:"callbackJSByParamData",args:[ /*laya.display.SpriteConst.POSCALLBACK_OBJ_ID*/54*4,/*laya.display.SpriteConst.POSLAYA3D_FUN_ID*/62 *4] },
		{func:"useCommandEncoderByParamData",args:[ /*laya.display.SpriteConst.POSLAYAGL3D*/26 *4,-1,/*laya.layagl.LayaGL.EXECUTE_COPY_TO_RENDER3D*/3] }];
		LayaGLTemplate.__FUN_PARAM__[ /*laya.display.SpriteConst.CUSTOM*/0x800]=[{func:"callbackJSByParamData",args:[ /*laya.display.SpriteConst.POSCALLBACK_OBJ_ID*/54*4,/*laya.display.SpriteConst.POSCUSTOM_CALLBACK_FUN_ID*/55 *4] },
		{func:"useCommandEncoderByParamData",args:[ /*laya.display.SpriteConst.POSCUSTOM*/27 *4,-1,/*laya.layagl.LayaGL.EXECUTE_RENDER_THREAD_BUFFER*/1] }];
		LayaGLTemplate.__FUN_PARAM__[ /*laya.display.SpriteConst.CLIP*/0x40]=[ {func:"setClipByParamData",args:[LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,LayaNative2D.GLOBALVALUE_MATRIX32,/*laya.display.SpriteConst.POSCLIP*/28 *4] },
		{func:"setGlobalValueByParamData",args:[LayaNative2D.GLOBALVALUE_MATRIX32,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_TRANSLATE*/9,/*laya.display.SpriteConst.POSCLIP_NEG_POS*/32 *4] }];
		LayaGLTemplate.__FUN_PARAM__[ /*laya.display.SpriteConst.FILTERS*/0x10]=[ {func:"callbackJSByParamData",args:[ /*laya.display.SpriteConst.POSCALLBACK_OBJ_ID*/54 *4,/*laya.display.SpriteConst.POSFILTER_CALLBACK_FUN_ID*/65 *4] },
		{func:"useCommandEncoderByParamData",args:[ /*laya.display.SpriteConst.POSFILTER_BEGIN_CMD_ID*/64 *4,-1,/*laya.layagl.LayaGL.EXECUTE_JS_THREAD_BUFFER*/0] }];
		LayaGLTemplate.__FUN_PARAM__[ /*laya.display.SpriteConst.MASK*/0x20]=[ {func:"callbackJSByParamData",args:[ /*laya.display.SpriteConst.POSCALLBACK_OBJ_ID*/54 *4,/*laya.display.SpriteConst.POSMASK_CALLBACK_FUN_ID*/69 *4] },
		{func:"useCommandEncoderByParamData",args:[ /*laya.display.SpriteConst.POSMASK_CMD_ID*/70 *4,-1,/*laya.layagl.LayaGL.EXECUTE_JS_THREAD_BUFFER*/0] }];
		LayaGLTemplate.__FUN_PARAM__[ /*laya.display.SpriteConst.CANVAS*/0x08]=[ {func:"callbackJSByParamData",args:[ /*laya.display.SpriteConst.POSCALLBACK_OBJ_ID*/54 *4,/*laya.display.SpriteConst.POSCANVAS_CALLBACK_FUN_ID*/56 *4] },
		{func:"loadDataToRegByParamData",args:[0,/*laya.display.SpriteConst.POSCACHE_CANVAS_SKIP_PAINT_FLAG*/63 *4,4] },
		{func:"ifGreater0",args:[0,2147483647] },
		{func:"useCommandEncoderByParamData",args:[ /*laya.display.SpriteConst.POSCANVAS_BEGIN_CMD_ID*/58 *4,-1,/*laya.layagl.LayaGL.EXECUTE_JS_THREAD_BUFFER*/0] }];
		LayaGLTemplate.__FUN_PARAM__[ /*laya.display.SpriteConst.STYLE*/0x80]=[{func:"useCommandEncoderByParamData",args:[ /*laya.display.SpriteConst.POSSIM_RECT_FILL_CMD*/73 *4,/*laya.display.SpriteConst.POSSIM_RECT_FILL_DATA*/74 *4,/*laya.layagl.LayaGL.EXECUTE_RENDER_THREAD_BUFFER*/1] },
		{func:"useCommandEncoderByParamData",args:[ /*laya.display.SpriteConst.POSSIM_RECT_STROKE_CMD*/75 *4,/*laya.display.SpriteConst.POSSIM_RECT_STROKE_DATA*/76 *4,/*laya.layagl.LayaGL.EXECUTE_RENDER_THREAD_BUFFER*/1] }];
	}

	LayaGLTemplate.__init_END_=function(){
		LayaGLTemplate.__FUN_PARAM_END_[ /*laya.display.SpriteConst.FILTERS*/0x10]=[ {func:"loadDataToRegByParamData",args:[0,/*laya.display.SpriteConst.POSCACHE_CANVAS_SKIP_PAINT_FLAG*/63 *4,4] },
		{func:"ifGreater0",args:[0,2] },
		{func:"callbackJSByParamData",args:[ /*laya.display.SpriteConst.POSCALLBACK_OBJ_ID*/54 *4,/*laya.display.SpriteConst.POSFILTER_END_CALLBACK_FUN_ID*/67 *4] },
		{func:"useCommandEncoderByParamData",args:[ /*laya.display.SpriteConst.POSFILTER_END_CMD_ID*/66 *4,-1,/*laya.layagl.LayaGL.EXECUTE_RENDER_THREAD_BUFFER*/1] }];
		LayaGLTemplate.__FUN_PARAM_END_[ /*laya.display.SpriteConst.CANVAS*/0x08]=[ {func:"callbackJSByParamData",args:[ /*laya.display.SpriteConst.POSCALLBACK_OBJ_ID*/54 *4,/*laya.display.SpriteConst.POSCANVAS_CALLBACK_END_FUN_ID*/57 *4] },
		{func:"useCommandEncoderByParamData",args:[ /*laya.display.SpriteConst.POSCANVAS_END_CMD_ID*/59 *4,-1,/*laya.layagl.LayaGL.EXECUTE_JS_THREAD_BUFFER*/0] },
		{func:"useCommandEncoderByParamData",args:[ /*laya.display.SpriteConst.POSCANVAS_DRAW_TARGET_CMD_ID*/60*4,/*laya.display.SpriteConst.POSCANVAS_DRAW_TARGET_PARAM_ID*/61*4,/*laya.layagl.LayaGL.EXECUTE_RENDER_THREAD_BUFFER*/1] }];
	}

	LayaGLTemplate.GLS=[];
	LayaGLTemplate.GLSE=[];
	LayaGLTemplate.__FUN_PARAM__=[];
	LayaGLTemplate.__FUN_PARAM_END_=[];
	return LayaGLTemplate;
})()


/**
*key:font
*下面是各种大小的page
*每个大小的page可以有多个
*/

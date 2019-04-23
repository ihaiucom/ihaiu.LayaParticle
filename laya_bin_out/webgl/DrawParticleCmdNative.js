//class laya.layagl.cmdNative.DrawParticleCmdNative
var DrawParticleCmdNative=(function(){
	function DrawParticleCmdNative(){
		this._graphicsCmdEncoder=null;
		this._paramData=null;
		this.vbBuffer=null;
		this._template=null;
		this._floatCountPerVertex=29;
		//0~2为Position,3~5Velocity,6~9为StartColor,10~13为EndColor,14~16位SizeRotation,17到18位Radius,19~22位Radian,23为DurationAddScaleShaderValue,24为Time,25~28为CornerTextureCoordinate
		this._firstNewElement=0;
		this._firstFreeElement=0;
		this._firstActiveElement=0;
		this._firstRetiredElement=0;
		this._maxParticleNum=0;
	}

	__class(DrawParticleCmdNative,'laya.layagl.cmdNative.DrawParticleCmdNative');
	var __proto=DrawParticleCmdNative.prototype;
	__proto.updateParticle=function(){
		if (this._template.texture){
			this._template.updateParticleForNative();
			var _sv=this._template.sv;
			var _i32b=this._paramData._int32Data;
			var _fb=this._paramData._float32Data;
			var i=0;
			var n=0;
			_fb[DrawParticleCmdNative._PARAM_CURRENTTIME_POS_]=_sv.u_CurrentTime;
			_fb[DrawParticleCmdNative._PARAM_DURATION_POS_]=_sv.u_Duration;
			_fb[DrawParticleCmdNative._PARAM_ENDVEL_POS_]=_sv.u_EndVelocity;
			_fb[DrawParticleCmdNative._PARAM_GRAVITY_POS_]=_sv.u_Gravity[0];
			_fb[DrawParticleCmdNative._PARAM_GRAVITY_POS_+1]=_sv.u_Gravity[1];
			_fb[DrawParticleCmdNative._PARAM_GRAVITY_POS_+2]=_sv.u_Gravity[2];
			_sv.size[0]=RenderState2D.width;
			_sv.size[1]=RenderState2D.height;
			_fb[DrawParticleCmdNative._PARAM_SIZE_POS_]=_sv.size[0];
			_fb[DrawParticleCmdNative._PARAM_SIZE_POS_+1]=_sv.size[1];
			_fb[DrawParticleCmdNative._PARAM_MAT_POS_]=1;_fb[DrawParticleCmdNative._PARAM_MAT_POS_+1]=0;_fb[DrawParticleCmdNative._PARAM_MAT_POS_+2]=0;_fb[DrawParticleCmdNative._PARAM_MAT_POS_+3]=0;
			_fb[DrawParticleCmdNative._PARAM_MAT_POS_+4]=0;_fb[DrawParticleCmdNative._PARAM_MAT_POS_+5]=1;_fb[DrawParticleCmdNative._PARAM_MAT_POS_+6]=0;_fb[DrawParticleCmdNative._PARAM_MAT_POS_+7]=0;
			_fb[DrawParticleCmdNative._PARAM_MAT_POS_+8]=0;_fb[DrawParticleCmdNative._PARAM_MAT_POS_+9]=0;_fb[DrawParticleCmdNative._PARAM_MAT_POS_+10]=1;_fb[DrawParticleCmdNative._PARAM_MAT_POS_+11]=0;
			_fb[DrawParticleCmdNative._PARAM_MAT_POS_+12]=0;_fb[DrawParticleCmdNative._PARAM_MAT_POS_+13]=0;_fb[DrawParticleCmdNative._PARAM_MAT_POS_+14]=0;_fb[DrawParticleCmdNative._PARAM_MAT_POS_+15]=1;
			_i32b[DrawParticleCmdNative._PARAM_TEXTURE_LOC_POS_]=/*laya.webgl.WebGLContext.TEXTURE0*/0x84C0;
			_i32b[DrawParticleCmdNative._PARAM_TEXTURE_POS_]=this._template.texture.bitmap._glTexture.id;
			this.vbBuffer=this._template.getConchMesh();
			this._firstNewElement=this._template.getFirstNewElement();
			this._firstFreeElement=this._template.getFirstFreeElement();
			this._firstActiveElement=this._template.getFirstActiveElement();
			this._firstRetiredElement=this._template.getFirstRetiredElement();
			var vb1Size=0;
			var vb2Size=0;
			var vb1Offset=0;
			var vb2Offset=0;
			var rect1_num=0;
			var rect2_num=0;
			if (this._firstActiveElement !=this._firstFreeElement){
				if (this._firstActiveElement < this._firstFreeElement){
					_i32b[DrawParticleCmdNative._PARAM_REGDATA_POS_]=1;
					rect1_num=this._firstFreeElement-this._firstActiveElement;
					vb1Size=(this._firstFreeElement-this._firstActiveElement)*this._floatCountPerVertex *4 *4;
					vb1Offset=this._firstActiveElement *this._floatCountPerVertex *4 *4;
				}
				else{
					_i32b[DrawParticleCmdNative._PARAM_REGDATA_POS_]=0;{
						rect1_num=this._maxParticleNum-this._firstActiveElement;
						vb1Size=(this._maxParticleNum-this._firstActiveElement)*this._floatCountPerVertex *4 *4;
						vb1Offset=this._firstActiveElement *this._floatCountPerVertex *4 *4;
						}{
						if (this._firstFreeElement > 0){
							rect2_num=this._firstFreeElement;
							vb2Size=this._firstFreeElement *this._floatCountPerVertex *4 *4;
							vb2Offset=0;
							}else {
							_i32b[DrawParticleCmdNative._PARAM_REGDATA_POS_]=1;
						}
					}
				}
			}
			_i32b[DrawParticleCmdNative._PARAM_VB1_POS_]=this.vbBuffer.getPtrID();
			_i32b[DrawParticleCmdNative._PARAM_RECT1_NUM_POS_]=rect1_num;
			_i32b[DrawParticleCmdNative._PARAM_VB1_SIZE_POS_]=vb1Size;
			_i32b[DrawParticleCmdNative._PARAM_VB1_OFFSET_POS_]=vb1Offset;
			LayaGL.syncBufferToRenderThread(this.vbBuffer);
			if (vb2Size > 0){
				_i32b[DrawParticleCmdNative._PARAM_VB2_POS_]=this.vbBuffer.getPtrID();
				_i32b[DrawParticleCmdNative._PARAM_RECT2_NUM_POS_]=rect2_num;
				_i32b[DrawParticleCmdNative._PARAM_VB2_SIZE_POS_]=vb2Size;
				_i32b[DrawParticleCmdNative._PARAM_VB2_OFFSET_POS_]=vb2Offset;
			}
			LayaGL.syncBufferToRenderThread(this._paramData);
			this._template.addDrawCounter();
		}
	}

	/**
	*回收到对象池
	*/
	__proto.recover=function(){
		this._template=null;
		Pool.recover("DrawParticleCmd",this);
	}

	__getset(0,__proto,'cmdID',function(){
		return "DrawParticleCmd";
	});

	DrawParticleCmdNative.create=function(_temp){
		var cmd=Pool.getItemByClass("DrawParticleCmd",DrawParticleCmdNative);
		cmd._graphicsCmdEncoder=/*__JS__ */this._commandEncoder;;
		if (!DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_){
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(284,32,true);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.blendFuncByGlobalValue(LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.useProgramEx(LayaNative2D.PROGRAMEX_DRAWPARTICLE);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.useVDO(LayaNative2D.VDO_MESHPARTICLE);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.uniformByParamData(0,DrawParticleCmdNative._PARAM_CURRENTTIME_POS_ *4);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.uniformByParamData(1,DrawParticleCmdNative._PARAM_DURATION_POS_ *4);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.uniformByParamData(2,DrawParticleCmdNative._PARAM_ENDVEL_POS_ *4);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.uniformByParamData(3,DrawParticleCmdNative._PARAM_GRAVITY_POS_ *4);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.uniformByParamData(4,DrawParticleCmdNative._PARAM_SIZE_POS_ *4);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.uniformByParamData(5,DrawParticleCmdNative._PARAM_MAT_POS_ *4);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.uniformTextureByParamData(DrawParticleCmdNative._PARAM_TEXTURE_UNIFORMLOC_POS_*4,DrawParticleCmdNative._PARAM_TEXTURE_LOC_POS_*4,DrawParticleCmdNative._PARAM_TEXTURE_POS_*4);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.setRectMeshExByParamData(DrawParticleCmdNative._PARAM_RECT1_NUM_POS_*4,DrawParticleCmdNative._PARAM_VB1_POS_ *4,DrawParticleCmdNative._PARAM_VB1_SIZE_POS_ *4,DrawParticleCmdNative._PARAM_VB1_OFFSET_POS_ *4);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,1,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.loadDataToRegByParamData(0,DrawParticleCmdNative._PARAM_REGDATA_POS_*4,4);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.ifGreater0(0,2);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.setRectMeshExByParamData(DrawParticleCmdNative._PARAM_RECT2_NUM_POS_*4,DrawParticleCmdNative._PARAM_VB2_POS_ *4,DrawParticleCmdNative._PARAM_VB2_SIZE_POS_ *4,DrawParticleCmdNative._PARAM_VB2_OFFSET_POS_ *4);
			DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.modifyMesh(LayaNative2D.GLOBALVALUE_MATRIX32,1,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
			LayaGL.syncBufferToRenderThread(DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_);
		}
		if (!cmd._paramData){
			cmd._paramData=/*__JS__ */new ParamData(36*4,true);
			}{
			cmd._template=_temp;
			cmd._maxParticleNum=_temp.settings.maxPartices;
			var _i32b=cmd._paramData._int32Data;
			var _sv=_temp._sv;
			var _fb=cmd._paramData._float32Data;
			var i=0;
			_fb[DrawParticleCmdNative._PARAM_CURRENTTIME_POS_]=-1;
			_fb[DrawParticleCmdNative._PARAM_DURATION_POS_]=-1;
			_fb[DrawParticleCmdNative._PARAM_ENDVEL_POS_]=-1;
			_fb[DrawParticleCmdNative._PARAM_GRAVITY_POS_]=-1;
			_fb[DrawParticleCmdNative._PARAM_GRAVITY_POS_+1]=-1;
			_fb[DrawParticleCmdNative._PARAM_GRAVITY_POS_+2]=-1;
			_fb[DrawParticleCmdNative._PARAM_SIZE_POS_]=-1;
			_fb[DrawParticleCmdNative._PARAM_SIZE_POS_+1]=-1;
			for (i=0;i < 16;i++){
				_fb[DrawParticleCmdNative._PARAM_MAT_POS_+i]=-1;
			}
			_i32b[DrawParticleCmdNative._PARAM_TEXTURE_LOC_POS_]=-1;
			_i32b[DrawParticleCmdNative._PARAM_TEXTURE_POS_]=-1;
			_i32b[DrawParticleCmdNative._PARAM_TEXTURE_UNIFORMLOC_POS_]=6;
			_i32b[DrawParticleCmdNative._PARAM_REGDATA_POS_]=0;
			_i32b[DrawParticleCmdNative._PARAM_VB1_POS_]=-1;
			_i32b[DrawParticleCmdNative._PARAM_VB2_POS_]=-1;
			_i32b[DrawParticleCmdNative._PARAM_VB1_SIZE_POS_]=-1;
			_i32b[DrawParticleCmdNative._PARAM_VB2_SIZE_POS_]=-1;
			_i32b[DrawParticleCmdNative._PARAM_RECT1_NUM_POS_]=-1;
			_i32b[DrawParticleCmdNative._PARAM_RECT2_NUM_POS_]=-1;
			LayaGL.syncBufferToRenderThread(cmd._paramData);
		}
		cmd._graphicsCmdEncoder.useCommandEncoder(DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_.getPtrID(),cmd._paramData.getPtrID(),-1);
		LayaGL.syncBufferToRenderThread(cmd._graphicsCmdEncoder);
		return cmd;
	}

	DrawParticleCmdNative.ID="DrawParticleCmd";
	DrawParticleCmdNative._DRAW_PARTICLE_CMD_ENCODER_=null;
	DrawParticleCmdNative._PARAM_VB1_POS_=0;
	DrawParticleCmdNative._PARAM_VB2_POS_=1;
	DrawParticleCmdNative._PARAM_VB1_SIZE_POS_=2;
	DrawParticleCmdNative._PARAM_VB2_SIZE_POS_=3;
	DrawParticleCmdNative._PARAM_CURRENTTIME_POS_=4;
	DrawParticleCmdNative._PARAM_DURATION_POS_=5;
	DrawParticleCmdNative._PARAM_ENDVEL_POS_=6;
	DrawParticleCmdNative._PARAM_GRAVITY_POS_=7;
	DrawParticleCmdNative._PARAM_SIZE_POS_=10;
	DrawParticleCmdNative._PARAM_MAT_POS_=12;
	DrawParticleCmdNative._PARAM_TEXTURE_LOC_POS_=28;
	DrawParticleCmdNative._PARAM_TEXTURE_POS_=29;
	DrawParticleCmdNative._PARAM_REGDATA_POS_=30;
	DrawParticleCmdNative._PARAM_TEXTURE_UNIFORMLOC_POS_=31;
	DrawParticleCmdNative._PARAM_RECT1_NUM_POS_=32;
	DrawParticleCmdNative._PARAM_RECT2_NUM_POS_=33;
	DrawParticleCmdNative._PARAM_VB1_OFFSET_POS_=34;
	DrawParticleCmdNative._PARAM_VB2_OFFSET_POS_=35;
	return DrawParticleCmdNative;
})()



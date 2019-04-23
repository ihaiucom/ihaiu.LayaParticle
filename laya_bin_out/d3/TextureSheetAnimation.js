/**
*<code>TextureSheetAnimation</code> 类用于创建粒子帧动画。
*/
//class laya.d3.core.particleShuriKen.module.TextureSheetAnimation
var TextureSheetAnimation=(function(){
	function TextureSheetAnimation(frame,startFrame){
		/**@private */
		this._frame=null;
		/**@private */
		this._startFrame=null;
		/**纹理平铺。*/
		this.tiles=null;
		/**类型,0为whole sheet、1为singal row。*/
		this.type=0;
		/**是否随机行，type为1时有效。*/
		this.randomRow=false;
		/**行索引,type为1时有效。*/
		this.rowIndex=0;
		/**循环次数。*/
		this.cycles=0;
		/**UV通道类型,0为Noting,1为Everything,待补充,暂不支持。*/
		this.enableUVChannels=0;
		/**是否启用*/
		this.enable=false;
		this.tiles=new Vector2(1,1);
		this.type=0;
		this.randomRow=true;
		this.rowIndex=0;
		this.cycles=1;
		this.enableUVChannels=1;
		this._frame=frame;
		this._startFrame=startFrame;
	}

	__class(TextureSheetAnimation,'laya.d3.core.particleShuriKen.module.TextureSheetAnimation');
	var __proto=TextureSheetAnimation.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destTextureSheetAnimation=destObject;
		this.tiles.cloneTo(destTextureSheetAnimation.tiles);
		destTextureSheetAnimation.type=this.type;
		destTextureSheetAnimation.randomRow=this.randomRow;
		this._frame.cloneTo(destTextureSheetAnimation._frame);
		this._startFrame.cloneTo(destTextureSheetAnimation._startFrame);
		destTextureSheetAnimation.cycles=this.cycles;
		destTextureSheetAnimation.enableUVChannels=this.enableUVChannels;
		destTextureSheetAnimation.enable=this.enable;
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destFrame;
		switch (this._frame.type){
			case 0:
				destFrame=FrameOverTime.createByConstant(this._frame.constant);
				break ;
			case 1:
				destFrame=FrameOverTime.createByOverTime(this._frame.frameOverTimeData.clone());
				break ;
			case 2:
				destFrame=FrameOverTime.createByRandomTwoConstant(this._frame.constantMin,this._frame.constantMax);
				break ;
			case 3:
				destFrame=FrameOverTime.createByRandomTwoOverTime(this._frame.frameOverTimeDataMin.clone(),this._frame.frameOverTimeDataMax.clone());
				break ;
			};
		var destStartFrame;
		switch (this._startFrame.type){
			case 0:
				destStartFrame=StartFrame.createByConstant(this._startFrame.constant);
				break ;
			case 1:
				destStartFrame=StartFrame.createByRandomTwoConstant(this._startFrame.constantMin,this._startFrame.constantMax);
				break ;
			};
		var destTextureSheetAnimation=/*__JS__ */new this.constructor(destFrame,destStartFrame);
		this.tiles.cloneTo(destTextureSheetAnimation.tiles);
		destTextureSheetAnimation.type=this.type;
		destTextureSheetAnimation.randomRow=this.randomRow;
		destTextureSheetAnimation.cycles=this.cycles;
		destTextureSheetAnimation.enableUVChannels=this.enableUVChannels;
		destTextureSheetAnimation.enable=this.enable;
		return destTextureSheetAnimation;
	}

	/**获取时间帧率。*/
	__getset(0,__proto,'frame',function(){
		return this._frame;
	});

	/**获取开始帧率。*/
	__getset(0,__proto,'startFrame',function(){
		return this._startFrame;
	});

	return TextureSheetAnimation;
})()


/**

*/
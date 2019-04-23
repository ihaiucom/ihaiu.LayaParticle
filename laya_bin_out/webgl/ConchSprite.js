//class laya.layagl.ConchSprite extends laya.display.Sprite
var ConchSprite=(function(_super){
	function ConchSprite(){
		ConchSprite.__super.call(this);;
	}

	__class(ConchSprite,'laya.layagl.ConchSprite',_super);
	var __proto=ConchSprite.prototype;
	//TODO:coverage
	__proto.parentRepaintForNative=function(type){
		(type===void 0)&& (type=/*laya.display.SpriteConst.REPAINT_CACHE*/0x02);
		var p=this._parent;
		if (p){
			if (!((p._conchData._int32Data[ /*laya.display.SpriteConst.POSREPAINT*/4]&type)==type)){
				p._conchData._int32Data[ /*laya.display.SpriteConst.POSREPAINT*/4] |=type;
				p.parentRepaintForNative(type);
			}
		}
	}

	//TODO:coverage
	__proto.renderToNative=function(context,x,y){
		var layagl=context.gl;
		var nCurentFrameCount=LayaGL.getFrameCount()-1;
		var iData=this._conchData._int32Data;
		var nRepaint=iData[ /*laya.display.SpriteConst.POSREPAINT*/4];
		if (this._children.length > 0){
			if (nCurentFrameCount !=iData[ /*laya.display.SpriteConst.POSFRAMECOUNT*/3] || (nRepaint > 0 && ((nRepaint & /*laya.display.SpriteConst.REPAINT_NODE*/0x01)==/*laya.display.SpriteConst.REPAINT_NODE*/0x01))){
				layagl.blockStart(this._conchData);
				this._renderChilds(context);
				layagl.blockEnd(this._conchData);
			}
			else{
				layagl.copyCmdBuffer(this._conchData._int32Data[ /*laya.display.SpriteConst.POSBUFFERBEGIN*/1],this._conchData._int32Data[ /*laya.display.SpriteConst.POSBUFFEREND*/2]);
			}
		}
		else{
			layagl.block(this._conchData);
		}
	}

	__proto.writeBlockToNative=function(){
		var layagl=LayaGL.instance;
		if (this._children.length > 0){
			layagl.blockStart(this._conchData);
			this._writeBlockChilds();
			layagl.blockEnd(this._conchData);
		}
		else{
			layagl.block(this._conchData);
		}
	}

	//TODO:coverage
	__proto._renderChilds=function(context){
		var childs=this._children,ele;
		var i=0,n=childs.length;
		var style=(this)._style;
		if (style.viewport){
			var rect=style.viewport;
			var left=rect.x;
			var top=rect.y;
			var right=rect.right;
			var bottom=rect.bottom;
			var _x=NaN,_y=NaN;
			for (;i < n;++i){
				if ((ele=childs[i])._visible && ((_x=ele._x)< right && (_x+ele.width)> left && (_y=ele._y)< bottom && (_y+ele.height)> top))
					ele.renderToNative(context);
			}
			}else {
			for (;i < n;++i)
			(ele=childs[i])._visible && ele.renderToNative(context);
		}
	}

	__proto._writeBlockChilds=function(){
		var childs=this._children,ele;
		var i=0,n=childs.length;
		var style=(this)._style;
		if (style.viewport){
			var rect=style.viewport;
			var left=rect.x;
			var top=rect.y;
			var right=rect.right;
			var bottom=rect.bottom;
			var _x=NaN,_y=NaN;
			for (;i < n;++i){
				if ((ele=childs[i])._visible && ((_x=ele._x)< right && (_x+ele.width)> left && (_y=ele._y)< bottom && (_y+ele.height)> top))
					ele.writeBlockToNative();
			}
			}else {
			for (;i < n;++i)
			(ele=childs[i])._visible && ele.writeBlockToNative();
		}
	}

	//TODO:coverage
	__proto.repaintForNative=function(type){
		(type===void 0)&& (type=/*laya.display.SpriteConst.REPAINT_CACHE*/0x02);
		if (!((this._conchData._int32Data[ /*laya.display.SpriteConst.POSREPAINT*/4] & type)==type)){
			this._conchData._int32Data[ /*laya.display.SpriteConst.POSREPAINT*/4] |=type;
			this.parentRepaintForNative(type);
		}
	}

	return ConchSprite;
})(Sprite)



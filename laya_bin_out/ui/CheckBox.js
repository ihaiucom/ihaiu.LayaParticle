/**
*<code>CheckBox</code> 组件还可以显示可选的文本标签，默认该标签位于 CheckBox 右侧。
*<p><code>CheckBox</code> 使用 <code>dataSource</code>赋值时的的默认属性是：<code>selected</code>。</p>
*
*@example <caption>以下示例代码，创建了一个 <code>CheckBox</code> 实例。</caption>
*package
*{
	*import laya.ui.CheckBox;
	*import laya.utils.Handler;
	*public class CheckBox_Example
	*{
		*public function CheckBox_Example()
		*{
			*Laya.init(640,800);//设置游戏画布宽高。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load("resource/ui/check.png",Handler.create(this,onLoadComplete));//加载资源。
			*}
		*private function onLoadComplete():void
		*{
			*trace("资源加载完成！");
			*var checkBox:CheckBox=new CheckBox("resource/ui/check.png","这个是一个CheckBox组件。");//创建一个 CheckBox 类的实例对象 checkBox ,传入它的皮肤skin和标签label。
			*checkBox.x=100;//设置 checkBox 对象的属性 x 的值，用于控制 checkBox 对象的显示位置。
			*checkBox.y=100;//设置 checkBox 对象的属性 y 的值，用于控制 checkBox 对象的显示位置。
			*checkBox.clickHandler=new Handler(this,onClick,[checkBox]);//设置 checkBox 的点击事件处理器。
			*Laya.stage.addChild(checkBox);//将此 checkBox 对象添加到显示列表。
			*}
		*private function onClick(checkBox:CheckBox):void
		*{
			*trace("输出选中状态: checkBox.selected = "+checkBox.selected);
			*}
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*Laya.loader.load("resource/ui/check.png",laya.utils.Handler.create(this,loadComplete));//加载资源
*function loadComplete()
*{
	*console.log("资源加载完成！");
	*var checkBox:laya.ui.CheckBox=new laya.ui.CheckBox("resource/ui/check.png","这个是一个CheckBox组件。");//创建一个 CheckBox 类的类的实例对象 checkBox ,传入它的皮肤skin和标签label。
	*checkBox.x=100;//设置 checkBox 对象的属性 x 的值，用于控制 checkBox 对象的显示位置。
	*checkBox.y=100;//设置 checkBox 对象的属性 y 的值，用于控制 checkBox 对象的显示位置。
	*checkBox.clickHandler=new laya.utils.Handler(this,this.onClick,[checkBox],false);//设置 checkBox 的点击事件处理器。
	*Laya.stage.addChild(checkBox);//将此 checkBox 对象添加到显示列表。
	*}
*function onClick(checkBox)
*{
	*console.log("checkBox.selected = ",checkBox.selected);
	*}
*@example
*import CheckBox=laya.ui.CheckBox;
*import Handler=laya.utils.Handler;
*class CheckBox_Example{
	*constructor()
	*{
		*Laya.init(640,800);
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load("resource/ui/check.png",Handler.create(this,this.onLoadComplete));//加载资源。
		*}
	*private onLoadComplete()
	*{
		*var checkBox:CheckBox=new CheckBox("resource/ui/check.png","这个是一个CheckBox组件。");//创建一个 CheckBox 类的实例对象 checkBox ,传入它的皮肤skin和标签label。
		*checkBox.x=100;//设置 checkBox 对象的属性 x 的值，用于控制 checkBox 对象的显示位置。
		*checkBox.y=100;//设置 checkBox 对象的属性 y 的值，用于控制 checkBox 对象的显示位置。
		*checkBox.clickHandler=new Handler(this,this.onClick,[checkBox]);//设置 checkBox 的点击事件处理器。
		*Laya.stage.addChild(checkBox);//将此 checkBox 对象添加到显示列表。
		*}
	*private onClick(checkBox:CheckBox):void
	*{
		*console.log("输出选中状态: checkBox.selected = "+checkBox.selected);
		*}
	*}
*/
//class laya.ui.CheckBox extends laya.ui.Button
var CheckBox=(function(_super){
	/**
	*创建一个新的 <code>CheckBox</code> 组件实例。
	*@param skin 皮肤资源地址。
	*@param label 文本标签的内容。
	*/
	function CheckBox(skin,label){
		(label===void 0)&& (label="");
		CheckBox.__super.call(this,skin,label);
	}

	__class(CheckBox,'laya.ui.CheckBox',_super);
	var __proto=CheckBox.prototype;
	/**@inheritDoc */
	__proto.preinitialize=function(){
		laya.ui.UIComponent.prototype.preinitialize.call(this);
		this.toggle=true;
		this._autoSize=false;
	}

	/**@inheritDoc */
	__proto.initialize=function(){
		_super.prototype.initialize.call(this);
		this.createText();
		this._text.align="left";
		this._text.valign="top";
		this._text.width=0;
	}

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if ((typeof value=='boolean'))this.selected=value;
		else if ((typeof value=='string'))this.selected=value==="true";
		else Laya.superSet(Button,this,'dataSource',value);
	});

	return CheckBox;
})(Button)


/**
*字体切片，简化版的位图字体，只需设置一个切片图片和文字内容即可使用，效果同位图字体
*使用方式：设置位图字体皮肤skin，设置皮肤对应的字体内容sheet（如果多行，可以使用空格换行），示例：
*fontClip.skin="font1.png";//设置皮肤
*fontClip.sheet="abc123 456";//设置皮肤对应的内容，空格换行。此皮肤为2行5列（显示时skin会被等分为2行5列），第一行对应的文字为"abc123"，第二行为"456"
*fontClip.value="a1326";//显示"a1326"文字
*/
//class laya.ui.FontClip extends laya.ui.Clip
var FontClip=(function(_super){
	function FontClip(skin,sheet){
		/**数值*/
		this._valueArr=null;
		/**文字内容数组**/
		this._indexMap=null;
		/**位图字体内容**/
		this._sheet=null;
		/**@private */
		this._direction="horizontal";
		/**X方向间隙*/
		this._spaceX=0;
		/**Y方向间隙*/
		this._spaceY=0;
		/**@private 水平对齐方式*/
		this._align="left";
		/**@private 显示文字宽*/
		this._wordsW=0;
		/**@private 显示文字高*/
		this._wordsH=0;
		FontClip.__super.call(this);
		if (skin)this.skin=skin;
		if (sheet)this.sheet=sheet;
	}

	__class(FontClip,'laya.ui.FontClip',_super);
	var __proto=FontClip.prototype;
	__proto.createChildren=function(){
		this._bitmap=new AutoBitmap();
		this.on(/*laya.events.Event.LOADED*/"loaded",this,this._onClipLoaded);
	}

	/**
	*资源加载完毕
	*/
	__proto._onClipLoaded=function(){
		this.callLater(this.changeValue);
	}

	/**渲染数值*/
	__proto.changeValue=function(){
		if (!this._sources)return;
		if (!this._valueArr)return;
		this.graphics.clear(true);
		var texture;
		texture=this._sources[0];
		if (!texture)return;
		var isHorizontal=(this._direction==="horizontal");
		if (isHorizontal){
			this._wordsW=this._valueArr.length *(texture.sourceWidth+this.spaceX);
			this._wordsH=texture.sourceHeight;
			}else{
			this._wordsW=texture.sourceWidth;
			this._wordsH=(texture.sourceHeight+this.spaceY)*this._valueArr.length;
		};
		var dX=0;
		if (this._width){
			switch(this._align){
				case "center":
					dX=0.5 *(this._width-this._wordsW);
					break ;
				case "right":
					dX=this._width-this._wordsW;
					break ;
				default :
					dX=0;
				}
		}
		for (var i=0,sz=this._valueArr.length;i < sz;i++){
			var index=this._indexMap[this._valueArr.charAt(i)];
			if (!this.sources[index])continue ;
			texture=this.sources[index];
			if (isHorizontal)this.graphics.drawImage(texture,dX+i *(texture.sourceWidth+this.spaceX),0,texture.sourceWidth,texture.sourceHeight);
			else this.graphics.drawImage(texture,0+dX,i *(texture.sourceHeight+this.spaceY),texture.sourceWidth,texture.sourceHeight);
		}
		if (!this._width){
			this._widget.resetLayoutX();
			this.callLater(this._sizeChanged);
		}
		if (!this._height){
			this._widget.resetLayoutY();
			this.callLater(this._sizeChanged);
		}
	}

	__proto.measureWidth=function(){
		return this._wordsW;
	}

	__proto.measureHeight=function(){
		return this._wordsH;
	}

	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		this._valueArr=null;
		this._indexMap=null;
		this.graphics.clear(true);
		this.removeSelf();
		this.off(/*laya.events.Event.LOADED*/"loaded",this,this._onClipLoaded);
		_super.prototype.destroy.call(this,destroyChild);
	}

	/**
	*设置位图字体内容，空格代表换行。比如"abc123 456"，代表第一行对应的文字为"abc123"，第二行为"456"
	*/
	__getset(0,__proto,'sheet',function(){
		return this._sheet;
		},function(value){
		value+="";
		this._sheet=value;
		var arr=value.split(" ");
		this._clipX=String(arr[0]).length;
		this.clipY=arr.length;
		this._indexMap={};
		for (var i=0;i < this._clipY;i++){
			var line=arr[i].split("");
			for (var j=0,n=line.length;j < n;j++){
				this._indexMap[line[j]]=i *this._clipX+j;
			}
		}
	});

	__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
		Laya.superSet(Clip,this,'height',value);
		this.callLater(this.changeValue);
	});

	/**
	*布局方向。
	*<p>默认值为"horizontal"。</p>
	*<p><b>取值：</b>
	*<li>"horizontal"：表示水平布局。</li>
	*<li>"vertical"：表示垂直布局。</li>
	*</p>
	*/
	__getset(0,__proto,'direction',function(){
		return this._direction;
		},function(value){
		this._direction=value;
		this.callLater(this.changeValue);
	});

	/**
	*设置位图字体的显示内容
	*/
	__getset(0,__proto,'value',function(){
		if (!this._valueArr)return "";
		return this._valueArr;
		},function(value){
		value+="";
		this._valueArr=value;
		this.callLater(this.changeValue);
	});

	__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
		Laya.superSet(Clip,this,'width',value);
		this.callLater(this.changeValue);
	});

	/**X方向文字间隙*/
	__getset(0,__proto,'spaceX',function(){
		return this._spaceX;
		},function(value){
		this._spaceX=value;
		if (this._direction==="horizontal")this.callLater(this.changeValue);
	});

	/**Y方向文字间隙*/
	__getset(0,__proto,'spaceY',function(){
		return this._spaceY;
		},function(value){
		this._spaceY=value;
		if (!(this._direction==="horizontal"))this.callLater(this.changeValue);
	});

	/**水平对齐方式*/
	__getset(0,__proto,'align',function(){
		return this._align;
		},function(v){
		this._align=v;
		this.callLater(this.changeValue);
	});

	return FontClip;
})(Clip)


/**

*/
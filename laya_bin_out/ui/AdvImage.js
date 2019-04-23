/**
*<code>/**
*<code>Group</code> 是 <code>Tab</code> 和 <code>RadioGroup</code> 的基类。</p>
*/
//class laya.ui.UIGroup extends laya.ui.Box
var UIGroup=(function(_super){
	function UIGroup(labels,skin){
		/**
		*改变 <code>Group</code> 的选择项时执行的处理器，(默认返回参数： 项索引（index:int）)。
		*/
		this.selectHandler=null;
		/**@private */
		this._items=null;
		/**@private */
		this._selectedIndex=-1;
		/**@private */
		this._skin=null;
		/**@private */
		this._direction="horizontal";
		/**@private */
		this._space=0;
		/**@private */
		this._labels=null;
		/**@private */
		this._labelColors=null;
		/**@private */
		this._labelFont=null;
		/**@private */
		this._labelStrokeColor=null;
		/**@private */
		this._strokeColors=null;
		/**@private */
		this._labelStroke=NaN;
		/**@private */
		this._labelSize=0;
		/**@private */
		this._labelBold=false;
		/**@private */
		this._labelPadding=null;
		/**@private */
		this._labelAlign=null;
		/**@private */
		this._stateNum=0;
		/**@private */
		this._labelChanged=false;
		UIGroup.__super.call(this);
		this.skin=skin;
		this.labels=labels;
	}

	__class(UIGroup,'laya.ui.UIGroup',_super);
	var __proto=UIGroup.prototype;
	Laya.imps(__proto,{"laya.ui.IItem":true})
	/**@inheritDoc */
	__proto.preinitialize=function(){
		this.mouseEnabled=true;
	}

	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		laya.ui.UIComponent.prototype.destroy.call(this,destroyChild);
		this._items && (this._items.length=0);
		this._items=null;
		this.selectHandler=null;
	}

	/**
	*添加一个项对象，返回此项对象的索引id。
	*
	*@param item 需要添加的项对象。
	*@param autoLayOut 是否自动布局，如果为true，会根据 <code>direction</code> 和 <code>space</code> 属性计算item的位置。
	*@return
	*/
	__proto.addItem=function(item,autoLayOut){
		(autoLayOut===void 0)&& (autoLayOut=true);
		var display=item;
		var index=this._items.length;
		display.name="item"+index;
		this.addChild(display);
		this.initItems();
		if (autoLayOut && index > 0){
			var preItem=this._items [index-1];
			if (this._direction=="horizontal"){
				display.x=preItem._x+preItem.width+this._space;
				}else {
				display.y=preItem._y+preItem.height+this._space;
			}
			}else {
			if (autoLayOut){
				display.x=0;
				display.y=0;
			}
		}
		return index;
	}

	/**
	*删除一个项对象。
	*@param item 需要删除的项对象。
	*@param autoLayOut 是否自动布局，如果为true，会根据 <code>direction</code> 和 <code>space</code> 属性计算item的位置。
	*/
	__proto.delItem=function(item,autoLayOut){
		(autoLayOut===void 0)&& (autoLayOut=true);
		var index=this._items.indexOf(item);
		if (index !=-1){
			var display=item;
			this.removeChild(display);
			for (var i=index+1,n=this._items.length;i < n;i++){
				var child=this._items [i];
				child.name="item"+(i-1);
				if (autoLayOut){
					if (this._direction=="horizontal"){
						child.x-=display.width+this._space;
						}else {
						child.y-=display.height+this._space;
					}
				}
			}
			this.initItems();
			if (this._selectedIndex >-1){
				var newIndex=0;
				newIndex=this._selectedIndex < this._items.length ? this._selectedIndex :(this._selectedIndex-1);
				this._selectedIndex=-1;
				this.selectedIndex=newIndex;
			}
		}
	}

	__proto._afterInited=function(){
		this.initItems();
	}

	/**
	*初始化项对象们。
	*/
	__proto.initItems=function(){
		this._items || (this._items=[]);
		this._items.length=0;
		for (var i=0;i < 10000;i++){
			var item=this.getChildByName("item"+i);
			if (item==null)break ;
			this._items.push(item);
			item.selected=(i===this._selectedIndex);
			item.clickHandler=Handler.create(this,this.itemClick,[i],false);
		}
	}

	/**
	*@private
	*项对象的点击事件侦听处理函数。
	*@param index 项索引。
	*/
	__proto.itemClick=function(index){
		this.selectedIndex=index;
	}

	/**
	*@private
	*通过对象的索引设置项对象的 <code>selected</code> 属性值。
	*@param index 需要设置的项对象的索引。
	*@param selected 表示项对象的选中状态。
	*/
	__proto.setSelect=function(index,selected){
		if (this._items && index >-1 && index < this._items.length)this._items[index].selected=selected;
	}

	__proto._skinLoaded=function(){
		this._setLabelChanged();
		this.event(/*laya.events.Event.LOADED*/"loaded");
	}

	/**
	*@private
	*创建一个项显示对象。
	*@param skin 项对象的皮肤。
	*@param label 项对象标签。
	*/
	__proto.createItem=function(skin,label){
		return null;
	}

	/**
	*@private
	*更改项对象的属性值。
	*/
	__proto.changeLabels=function(){
		this._labelChanged=false;
		if (this._items){
			var left=0
			for (var i=0,n=this._items.length;i < n;i++){
				var btn=this._items [i];
				this._skin && (btn.skin=this._skin);
				this._labelColors && (btn.labelColors=this._labelColors);
				this._labelSize && (btn.labelSize=this._labelSize);
				this._labelStroke && (btn.labelStroke=this._labelStroke);
				this._labelStrokeColor && (btn.labelStrokeColor=this._labelStrokeColor);
				this._strokeColors && (btn.strokeColors=this._strokeColors);
				this._labelBold && (btn.labelBold=this._labelBold);
				this._labelPadding && (btn.labelPadding=this._labelPadding);
				this._labelAlign && (btn.labelAlign=this._labelAlign);
				this._stateNum && (btn.stateNum=this._stateNum);
				this._labelFont && (btn.labelFont=this._labelFont);
				if (this._direction==="horizontal"){
					btn.y=0;
					btn.x=left;
					left+=btn.width+this._space;
					}else {
					btn.x=0;
					btn.y=left;
					left+=btn.height+this._space;
				}
			}
		}
		this._sizeChanged();
	}

	/**@inheritDoc */
	__proto.commitMeasure=function(){
		this.runCallLater(this.changeLabels);
	}

	/**@private */
	__proto._setLabelChanged=function(){
		if (!this._labelChanged){
			this._labelChanged=true;
			this.callLater(this.changeLabels);
		}
	}

	/**
	*<p>描边颜色，以字符串表示。</p>
	*默认值为 "#000000"（黑色）;
	*@see laya.display.Text.strokeColor()
	*/
	__getset(0,__proto,'labelStrokeColor',function(){
		return this._labelStrokeColor;
		},function(value){
		if (this._labelStrokeColor !=value){
			this._labelStrokeColor=value;
			this._setLabelChanged();
		}
	});

	/**
	*@copy laya.ui.Image#skin
	*/
	__getset(0,__proto,'skin',function(){
		return this._skin;
		},function(value){
		if (this._skin !=value){
			this._skin=value;
			if (this._skin&&!Loader.getRes(this._skin)){
				Laya.loader.load(this._skin,Handler.create(this,this._skinLoaded),null,/*laya.net.Loader.IMAGE*/"image",1);
				}else{
				this._skinLoaded();
			}
		}
	});

	/**
	*表示当前选择的项索引。默认值为-1。
	*/
	__getset(0,__proto,'selectedIndex',function(){
		return this._selectedIndex;
		},function(value){
		if (this._selectedIndex !=value){
			this.setSelect(this._selectedIndex,false);
			this._selectedIndex=value;
			this.setSelect(value,true);
			this.event(/*laya.events.Event.CHANGE*/"change");
			this.selectHandler && this.selectHandler.runWith(this._selectedIndex);
		}
	});

	/**
	*标签集合字符串。以逗号做分割，如"item0,item1,item2,item3,item4,item5"。
	*/
	__getset(0,__proto,'labels',function(){
		return this._labels;
		},function(value){
		if (this._labels !=value){
			this._labels=value;
			this.removeChildren();
			this._setLabelChanged();
			if (this._labels){
				var a=this._labels.split(",");
				for (var i=0,n=a.length;i < n;i++){
					var item=this.createItem(this._skin,a[i]);
					item.name="item"+i;
					this.addChild(item);
				}
			}
			this.initItems();
		}
	});

	/**
	*<p>表示各个状态下的描边颜色。</p>
	*@see laya.display.Text.strokeColor()
	*/
	__getset(0,__proto,'strokeColors',function(){
		return this._strokeColors;
		},function(value){
		if (this._strokeColors !=value){
			this._strokeColors=value;
			this._setLabelChanged();
		}
	});

	/**
	*@copy laya.ui.Button#labelColors()
	*/
	__getset(0,__proto,'labelColors',function(){
		return this._labelColors;
		},function(value){
		if (this._labelColors !=value){
			this._labelColors=value;
			this._setLabelChanged();
		}
	});

	/**
	*<p>描边宽度（以像素为单位）。</p>
	*默认值0，表示不描边。
	*@see laya.display.Text.stroke()
	*/
	__getset(0,__proto,'labelStroke',function(){
		return this._labelStroke;
		},function(value){
		if (this._labelStroke !=value){
			this._labelStroke=value;
			this._setLabelChanged();
		}
	});

	/**
	*表示按钮文本标签的字体大小。
	*/
	__getset(0,__proto,'labelSize',function(){
		return this._labelSize;
		},function(value){
		if (this._labelSize !=value){
			this._labelSize=value;
			this._setLabelChanged();
		}
	});

	/**
	*表示按钮的状态值，以数字表示，默认为3态。
	*@see laya.ui.Button#stateNum
	*/
	__getset(0,__proto,'stateNum',function(){
		return this._stateNum;
		},function(value){
		if (this._stateNum !=value){
			this._stateNum=value;
			this._setLabelChanged();
		}
	});

	/**
	*表示按钮文本标签是否为粗体字。
	*/
	__getset(0,__proto,'labelBold',function(){
		return this._labelBold;
		},function(value){
		if (this._labelBold !=value){
			this._labelBold=value;
			this._setLabelChanged();
		}
	});

	/**
	*表示按钮文本标签的字体名称，以字符串形式表示。
	*@see laya.display.Text.font()
	*/
	__getset(0,__proto,'labelFont',function(){
		return this._labelFont;
		},function(value){
		if (this._labelFont !=value){
			this._labelFont=value;
			this._setLabelChanged();
		}
	});

	/**
	*表示按钮文本标签的边距。
	*<p><b>格式：</b>"上边距,右边距,下边距,左边距"。</p>
	*/
	__getset(0,__proto,'labelPadding',function(){
		return this._labelPadding;
		},function(value){
		if (this._labelPadding !=value){
			this._labelPadding=value;
			this._setLabelChanged();
		}
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
		this._setLabelChanged();
	});

	/**
	*项对象们之间的间隔（以像素为单位）。
	*/
	__getset(0,__proto,'space',function(){
		return this._space;
		},function(value){
		this._space=value;
		this._setLabelChanged();
	});

	/**
	*项对象们的存放数组。
	*/
	__getset(0,__proto,'items',function(){
		return this._items;
	});

	/**
	*获取或设置当前选择的项对象。
	*/
	__getset(0,__proto,'selection',function(){
		return this._selectedIndex >-1 && this._selectedIndex < this._items.length ? this._items[this._selectedIndex] :null;
		},function(value){
		this.selectedIndex=this._items.indexOf(value);
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		if (((typeof value=='number')&& Math.floor(value)==value)|| (typeof value=='string'))this.selectedIndex=parseInt(value);
		else if ((value instanceof Array))this.labels=(value).join(",");
		else Laya.superSet(Box,this,'dataSource',value);
	});

	return UIGroup;
})(Box)


/**
*广告插件
*@author 小松
*@date-2018-09-19
*/
//class laya.ui.AdvImage extends laya.ui.Image
var AdvImage=(function(_super){
	function AdvImage(skin){
		/**广告列表数据**/
		this.advsListArr=[];
		/**资源列表请求地址**/
		this.resUrl="https://unioncdn.layabox.com/config/iconlist.json";
		/**广告列表信息**/
		this._data=[];
		/**每6分钟重新请求一次新广告列表**/
		this._resquestTime=360000;
		/**微信跳转appid**/
		this._appid=null;
		/**播放索引**/
		this._playIndex=0;
		/**轮播间隔时间**/
		this._lunboTime=5000;
		AdvImage.__super.call(this);
		this._http=new Browser.window.XMLHttpRequest();
		this.skin=skin;
		this.setLoadUrl();
		this.init();
		this.size(120,120);
	}

	__class(AdvImage,'laya.ui.AdvImage',_super);
	var __proto=AdvImage.prototype;
	/**设置导量加载地址**/
	__proto.setLoadUrl=function(){
		if(Browser.onLimixiu){
			this.resUrl="https://abc.layabox.com/public/wyw/gconfig.json";
		}
	}

	__proto.init=function(){
		if(this.isSupportJump()){
			if(Browser.onMiniGame || Browser.onBDMiniGame){
				Laya.timer.loop(this._resquestTime,this,this.onGetAdvsListData);
			}
			this.onGetAdvsListData();
			this.initEvent();
		}else
		this.visible=false;
	}

	__proto.initEvent=function(){
		this.on(/*laya.events.Event.CLICK*/"click",this,this.onAdvsImgClick);
	}

	__proto.onAdvsImgClick=function(){
		var currentJumpUrl=this.getCurrentAppidObj();
		if(currentJumpUrl)
			this.jumptoGame();
	}

	__proto.revertAdvsData=function(){
		if(this.advsListArr[this._playIndex]){
			this.visible=true;
			if(Browser.onLimixiu){
				var ww="https://abc.layabox.com/public/icon/";
				this.visible=true;
				var advsObj=this.advsListArr[this._playIndex];
				if(advsObj){
					if(Browser.onLimixiu &&/*__JS__ */GameStatusInfo.gameId==advsObj.gameid){
						this.onLunbo();
						}else{
						this.skin=ww+advsObj.iconUrl;
						this.size(103,126);
					}
				}
				}else{
				this.skin=this.advsListArr[this._playIndex];
			}
		}
	}

	/**当前小游戏环境是否支持游戏跳转功能**/
	__proto.isSupportJump=function(){
		if(Browser.onMiniGame){
			var isSupperJump=(typeof /*__JS__ */wx.navigateToMiniProgram=='function');
			return isSupperJump;
			}else if(Browser.onLimixiu){
			if(/*__JS__ */BK.QQ.skipGame)
				return true;
		}else if(Browser.onBDMiniGame)
		return true;
		return false;
	}

	/**
	*跳转游戏
	*@param callBack Function 回调参数说明：type 0 跳转成功；1跳转失败；2跳转接口调用成功
	*/
	__proto.jumptoGame=function(){
		var _$this=this;
		var advsObj=this.advsListArr[this._playIndex];
		var desGameId=parseInt(advsObj.gameid);
		var extendInfo=advsObj.extendInfo;
		var path=advsObj.path;
		if(Browser.onLimixiu){
			if(!advsObj.isLunBo){
				if(!advsObj.isLunBo){
					var gameAdvsObj=LocalStorage.getJSON("gameObj");
					if(!gameAdvsObj){
						gameAdvsObj={};
					}
					if(!gameAdvsObj[advsObj.gameid]){
						gameAdvsObj[advsObj.gameid]={};
					}
					gameAdvsObj[advsObj.gameid]={isclick:true};
					LocalStorage.setJSON("gameObj",gameAdvsObj);
					this.advsListArr.splice(this._playIndex,1);
				}
			}
			/*__JS__ */BK.QQ.skipGame(desGameId,extendInfo);
			this.updateAdvsInfo();
			}else if(Browser.onMiniGame){
			if(this.isSupportJump()){
				/*__JS__ */wx.navigateToMiniProgram({
					appId:advsObj.gameid,
					path:path,
					extraData:extendInfo,
					envVersion:"release",
					success:function success (){
						console.log("-------------跳转成功--------------");
					},
					fail:function fail (){
						console.log("-------------跳转失败--------------");
					},
					complete:function complete (){
						console.log("-------------跳转接口调用成功--------------");
						_$this.updateAdvsInfo();
					}.bind(this)
				});
			}
			}else if(Browser.onBDMiniGame){
			}else{
			this.visible=false;
		}
	}

	__proto.updateAdvsInfo=function(){
		this.visible=false;
		this.onLunbo();
		Laya.timer.loop(this._lunboTime,this,this.onLunbo);
	}

	__proto.onLunbo=function(){
		if(this._playIndex >=this.advsListArr.length-1)
			this._playIndex=0;
		else
		this._playIndex+=1;
		this.visible=true;
		this.revertAdvsData();
	}

	/**获取轮播数据**/
	__proto.getCurrentAppidObj=function(){
		return this.advsListArr[this._playIndex];
	}

	/**
	*获取广告列表数据信息
	*/
	__proto.onGetAdvsListData=function(){
		var _this=this;
		var random=AdvImage.randRange(10000,1000000);
		var url=this.resUrl+"?"+random;
		this._http.open("get",url,true);
		this._http.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
		this._http.responseType="text";
		this._http.onerror=function (e){
			_this._onError(e);
		}
		this._http.onload=function (e){
			_this._onLoad(e);
		}
		this._http.send(null);
	}

	/**
	*@private
	*请求出错侦的听处理函数。
	*@param e 事件对象。
	*/
	__proto._onError=function(e){
		this.error("Request failed Status:"+this._http.status+" text:"+this._http.statusText);
	}

	/**
	*@private
	*请求消息返回的侦听处理函数。
	*@param e 事件对象。
	*/
	__proto._onLoad=function(e){
		var http=this._http;
		var status=http.status!==undefined ? http.status :200;
		if (status===200 || status===204 || status===0){
			this.complete();
			}else {
			this.error("["+http.status+"]"+http.statusText+":"+http.responseURL);
		}
	}

	/**
	*@private
	*请求错误的处理函数。
	*@param message 错误信息。
	*/
	__proto.error=function(message){
		this.event(/*laya.events.Event.ERROR*/"error",message);
	}

	/**
	*@private
	*请求成功完成的处理函数。
	*/
	__proto.complete=function(){
		var flag=true;
		try {
			this._data=this._http.response || this._http.responseText;
			this._data=JSON.parse(this._data);
			if(Browser.onLimixiu){
				this.advsListArr=this.getAdvsQArr(this._data);
				if(this.advsListArr.length){
					this.updateAdvsInfo();
					this.revertAdvsData();
					}else{
					this.visible=false;
				}
				}else{
				this.advsListArr=this._data.list;
				this._appid=this._data.appid;
				this.updateAdvsInfo();
				this.revertAdvsData();
			}
			}catch (e){
			flag=false;
			this.error(e.message);
		}
	}

	/**转换数据**/
	__proto.getAdvsQArr=function(data){
		var tempArr=[];
		var gameAdvsObj=LocalStorage.getJSON("gameObj");
		for(var key in data){
			var tempObj=data[key];
			if(gameAdvsObj && gameAdvsObj[tempObj.gameid] && !tempObj.isQiangZhi)
				continue ;
			tempArr.push(tempObj);
		}
		return tempArr;
	}

	/**
	*@private
	*清除当前请求。
	*/
	__proto.clear=function(){
		var http=this._http;
		http.onerror=http.onabort=http.onprogress=http.onload=null;
	}

	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		Laya.timer.clear(this,this.onLunbo);
		_super.prototype.destroy.call(this,true);
		this.clear();
		Laya.timer.clear(this,this.onGetAdvsListData);
	}

	AdvImage.randRange=function(minNum,maxNum){
		return (Math.floor(Math.random()*(maxNum-minNum+1))+minNum);
	}

	return AdvImage;
})(Image)


/**

*/
*/
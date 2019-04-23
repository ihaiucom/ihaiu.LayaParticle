//class laya.layagl.QuickTestTool
var QuickTestTool=(function(){
	function QuickTestTool(){
		this._renderType=0;
		this._repaint=0;
		this._x=NaN;
		this._y=NaN;
	}

	__class(QuickTestTool,'laya.layagl.QuickTestTool');
	var __proto=QuickTestTool.prototype;
	//TODO:coverage
	__proto.render=function(context,x,y){
		Stat.spriteCount++;
		QuickTestTool._addType(this._renderType);
		QuickTestTool.showRenderTypeInfo(this._renderType);
		RenderSprite.renders[this._renderType]._fun(this,context,x+this._x,y+this._y);
		this._repaint=0;
	}

	//TODO:coverage
	__proto._stageRender=function(context,x,y){
		QuickTestTool._countStart();
		QuickTestTool._PreStageRender.call(Laya.stage,context,x,y);
		QuickTestTool._countEnd();
	}

	QuickTestTool.getMCDName=function(type){
		return QuickTestTool._typeToNameDic[type];
	}

	QuickTestTool.showRenderTypeInfo=function(type,force){
		(force===void 0)&& (force=false);
		if (!force&&QuickTestTool.showedDic[type])
			return;
		QuickTestTool.showedDic[type]=true;
		if (!QuickTestTool._rendertypeToStrDic[type]){
			var arr=[];
			var tType=0;
			tType=1;
			while (tType <=type){
				if (tType & type){
					arr.push(QuickTestTool.getMCDName(tType & type));
				}
				tType=tType << 1;
			}
			QuickTestTool._rendertypeToStrDic[type]=arr.join(",");
		}
		console.log("cmd:",QuickTestTool._rendertypeToStrDic[type]);
	}

	QuickTestTool.__init__=function(){
		QuickTestTool._typeToNameDic[ /*laya.display.SpriteConst.ALPHA*/0x01]="ALPHA";
		QuickTestTool._typeToNameDic[ /*laya.display.SpriteConst.TRANSFORM*/0x02]="TRANSFORM";
		QuickTestTool._typeToNameDic[ /*laya.display.SpriteConst.TEXTURE*/0x100]="TEXTURE";
		QuickTestTool._typeToNameDic[ /*laya.display.SpriteConst.GRAPHICS*/0x200]="GRAPHICS";
		QuickTestTool._typeToNameDic[ /*laya.display.SpriteConst.ONECHILD*/0x1000]="ONECHILD";
		QuickTestTool._typeToNameDic[ /*laya.display.SpriteConst.CHILDS*/0x2000]="CHILDS";
		QuickTestTool._typeToNameDic[ /*laya.display.SpriteConst.TRANSFORM*/0x02 | /*laya.display.SpriteConst.ALPHA*/0x01]="TRANSFORM|ALPHA";
		QuickTestTool._typeToNameDic[ /*laya.display.SpriteConst.CANVAS*/0x08]="CANVAS";
		QuickTestTool._typeToNameDic[ /*laya.display.SpriteConst.BLEND*/0x04]="BLEND";
		QuickTestTool._typeToNameDic[ /*laya.display.SpriteConst.FILTERS*/0x10]="FILTERS";
		QuickTestTool._typeToNameDic[ /*laya.display.SpriteConst.MASK*/0x20]="MASK";
		QuickTestTool._typeToNameDic[ /*laya.display.SpriteConst.CLIP*/0x40]="CLIP";
		QuickTestTool._typeToNameDic[ /*laya.display.SpriteConst.LAYAGL3D*/0x400]="LAYAGL3D";
	}

	QuickTestTool._countStart=function(){
		var key;
		for (key in QuickTestTool._countDic){
			QuickTestTool._countDic[key]=0;
		}
	}

	QuickTestTool._countEnd=function(){
		QuickTestTool._i++;
		if (QuickTestTool._i > 60){
			QuickTestTool.showCountInfo();
			QuickTestTool._i=0;
		}
	}

	QuickTestTool._addType=function(type){
		if (!QuickTestTool._countDic[type]){
			QuickTestTool._countDic[type]=1;
			}else{
			QuickTestTool._countDic[type]+=1;
		}
	}

	QuickTestTool.showCountInfo=function(){
		console.log("===================");
		var key;
		for (key in QuickTestTool._countDic){
			console.log("count:"+QuickTestTool._countDic[key]);
			QuickTestTool.showRenderTypeInfo(key,true);
		}
	}

	QuickTestTool.enableQuickTest=function(){
		QuickTestTool.__init__();
		Sprite["prototype"]["render"]=QuickTestTool["prototype"]["render"];
		QuickTestTool._PreStageRender=Stage["prototype"]["render"];
		Stage["prototype"]["render"]=QuickTestTool["prototype"]["_stageRender"];
	}

	QuickTestTool.showedDic={};
	QuickTestTool._rendertypeToStrDic={};
	QuickTestTool._typeToNameDic={};
	QuickTestTool._PreStageRender=null;
	QuickTestTool._countDic={};
	QuickTestTool._i=0;
	return QuickTestTool;
})()


/**
*...
*@author xie
*/

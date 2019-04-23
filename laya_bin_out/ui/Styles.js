/**
*<code>Styles</code> 定义了组件常用的样式属性。
*/
//class laya.ui.Styles
var Styles=(function(){
	function Styles(){}
	__class(Styles,'laya.ui.Styles');
	Styles.labelColor="#000000";
	Styles.buttonStateNum=3;
	Styles.scrollBarMinNum=15;
	Styles.scrollBarDelayTime=500;
	__static(Styles,
	['defaultSizeGrid',function(){return this.defaultSizeGrid=[4,4,4,4,0];},'labelPadding',function(){return this.labelPadding=[2,2,2,2];},'inputLabelPadding',function(){return this.inputLabelPadding=[1,1,1,3];},'buttonLabelColors',function(){return this.buttonLabelColors=["#32556b","#32cc6b","#ff0000","#C0C0C0"];},'comboBoxItemColors',function(){return this.comboBoxItemColors=["#5e95b6","#ffffff","#000000","#8fa4b1","#ffffff"];}
	]);
	return Styles;
})()


/**全局配置*/
//class UIConfig
var UIConfig=(function(){
	function UIConfig(){}
	__class(UIConfig,'UIConfig');
	UIConfig.touchScrollEnable=true;
	UIConfig.mouseWheelEnable=true;
	UIConfig.showButtons=true;
	UIConfig.popupBgColor="#000000";
	UIConfig.popupBgAlpha=0.5;
	UIConfig.closeDialogOnSide=true;
	return UIConfig;
})()


/**

*/
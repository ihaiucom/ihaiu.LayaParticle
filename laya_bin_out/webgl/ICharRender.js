//class laya.webgl.resource.ICharRender
var ICharRender=(function(){
	function ICharRender(){}
	__class(ICharRender,'laya.webgl.resource.ICharRender');
	var __proto=ICharRender.prototype;
	__proto.getWidth=function(font,str){return 0;}
	__proto.scale=function(sx,sy){}
	/**
	*TODO stroke
	*@param char
	*@param font
	*@param size 返回宽高
	*@return
	*/
	__proto.getCharBmp=function(char,font,lineWidth,colStr,strokeColStr,size,margin_left,margin_top,margin_right,margin_bottom,rect){
		return null;
	}

	__getset(0,__proto,'canvasWidth',function(){
		return 0;
		},function(w){
	});

	return ICharRender;
})()


/**
*@private
*普通命令执行器
*/

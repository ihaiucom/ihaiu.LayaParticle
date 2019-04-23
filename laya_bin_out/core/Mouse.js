/**
*<code>Mouse</code> 类用于控制鼠标光标样式。
*/
//class laya.utils.Mouse
var Mouse=(function(){
	function Mouse(){}
	__class(Mouse,'laya.utils.Mouse');
	/**
	*设置鼠标样式
	*@param cursorStr
	*例如auto move no-drop col-resize
	*all-scroll pointer not-allowed row-resize
	*crosshair progress e-resize ne-resize
	*default text n-resize nw-resize
	*help vertical-text s-resize se-resize
	*inherit wait w-resize sw-resize
	*/
	__getset(1,Mouse,'cursor',function(){
		return Mouse._style.cursor;
		},function(cursorStr){
		Mouse._style.cursor=cursorStr;
	});

	Mouse.hide=function(){
		if (Mouse.cursor !="none"){
			Mouse._preCursor=Mouse.cursor;
			Mouse.cursor="none";
		}
	}

	Mouse.show=function(){
		if (Mouse.cursor=="none"){
			if (Mouse._preCursor){
				Mouse.cursor=Mouse._preCursor;
				}else {
				Mouse.cursor="auto";
			}
		}
	}

	Mouse._preCursor=null;
	__static(Mouse,
	['_style',function(){return this._style=Browser.document.body.style;}
	]);
	return Mouse;
})()


/**

*/
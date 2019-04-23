/**
*<code>TextMesh</code> 类用于创建文本网格。
*/
//class laya.d3.text.TextMesh
var TextMesh=(function(){
	function TextMesh(){
		/**@private */
		this._vertices=null;
		/**@private */
		this._vertexBuffer=null;
		/**@private */
		this._text=null;
		/**@private */
		this._fontSize=0;
		/**@private */
		this._color=null;
	}

	__class(TextMesh,'laya.d3.text.TextMesh');
	var __proto=TextMesh.prototype;
	/**
	*@private
	*/
	__proto._createVertexBuffer=function(charCount){}
	/**
	*@private
	*/
	__proto._resizeVertexBuffer=function(charCount){}
	/**
	*@private
	*/
	__proto._addChar=function(){}
	/**
	*设置文本。
	*@param value 文本。
	*/
	/**
	*获取文本。
	*@return 文本。
	*/
	__getset(0,__proto,'text',function(){
		return this._text;
		},function(value){
		this._text=value;
	});

	/**
	*设置字体储存。
	*@return 字体尺寸。
	*/
	/**
	*获取字体尺寸。
	*@param value 字体尺寸。
	*/
	__getset(0,__proto,'fontSize',function(){
		return this._fontSize;
		},function(value){
		this._fontSize=value;
	});

	/**
	*设置颜色。
	*@param 颜色。
	*/
	/**
	*获取颜色。
	*@return 颜色。
	*/
	__getset(0,__proto,'color',function(){
		return this._color;
		},function(value){
		this._color=value;
	});

	TextMesh._indexBuffer=null;
	return TextMesh;
})()


/**

*/
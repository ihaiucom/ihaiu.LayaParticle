//class laya.layagl.ConchPropertyAdpt
var ConchPropertyAdpt=(function(){
	function ConchPropertyAdpt(){}
	__class(ConchPropertyAdpt,'laya.layagl.ConchPropertyAdpt');
	ConchPropertyAdpt.rewriteProperties=function(){
		laya.layagl.ConchPropertyAdpt.rewriteNumProperty(Rectangle.prototype,"x");
		laya.layagl.ConchPropertyAdpt.rewriteNumProperty(Rectangle.prototype,"y");
		laya.layagl.ConchPropertyAdpt.rewriteNumProperty(Rectangle.prototype,"width");
		laya.layagl.ConchPropertyAdpt.rewriteNumProperty(Rectangle.prototype,"height");
		laya.layagl.ConchPropertyAdpt.rewriteFunc(Rectangle.prototype,"recover");
	}

	ConchPropertyAdpt.rewriteNumProperty=function(proto,p){
		Object["defineProperty"](proto,p,{
			"get":function (){
				return this["_"+p] || 0;
			},
			"set":function (v){
				this["_"+p]=v;
				if (this.onPropertyChanged){
					this.onPropertyChanged(this);
				}
			}
		});
	}

	ConchPropertyAdpt.rewriteFunc=function(proto,p){
		proto["__"+p]=proto[p];
		proto[p]=function (){
			proto["__"+p].call(this);
			if (this.onPropertyChanged)
				this.onPropertyChanged=null;
		}
	}

	return ConchPropertyAdpt;
})()


/**
*<p> <code>Matrix</code> 类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。</p>
*<p>您可以对一个显示对象执行不同的图形转换，方法是设置 Matrix 对象的属性，将该 Matrix 对象应用于 Transform 对象的 matrix 属性，然后应用该 Transform 对象作为显示对象的 transform 属性。这些转换函数包括平移（x 和 y 重新定位）、旋转、缩放和倾斜。</p>
*/

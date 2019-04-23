//class fairygui.tween.TweenValue
var TweenValue=(function(){
	function TweenValue(){
		this.x=NaN;
		this.y=NaN;
		this.z=NaN;
		this.w=NaN;
		this.x=this.y=this.z=this.w=0;
	}

	__class(TweenValue,'fairygui.tween.TweenValue');
	var __proto=TweenValue.prototype;
	__proto.getField=function(index){
		switch (index){
			case 0:
				return this.x;
			case 1:
				return this.y;
			case 2:
				return this.z;
			case 3:
				return this.w;
			default :
				throw new Error("Index out of bounds: "+index);
			}
	}

	__proto.setField=function(index,value){
		switch (index){
			case 0:
				this.x=value;
				break ;
			case 1:
				this.y=value;
				break ;
			case 2:
				this.z=value;
				break ;
			case 3:
				this.w=value;
				break ;
			default :
				throw new Error("Index out of bounds: "+index);
			}
	}

	__proto.setZero=function(){
		this.x=this.y=this.z=this.w=0;
	}

	__getset(0,__proto,'color',function(){
		return (this.w<<24)+(this.x<<16)+(this.y<<8)+this.z;
		},function(value){
		this.x=(value & 0xFF0000)>>16;
		this.y=(value & 0x00FF00)>>8;
		this.z=(value & 0x0000FF);
		this.w=(value & 0xFF000000)>>24;
	});

	return TweenValue;
})()



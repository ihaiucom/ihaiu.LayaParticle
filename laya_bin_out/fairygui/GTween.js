//class fairygui.tween.GTween
var GTween=(function(){
	function GTween(){}
	__class(GTween,'fairygui.tween.GTween');
	GTween.to=function(start,end,duration){
		return TweenManager.createTween()._to(start,end,duration);
	}

	GTween.to2=function(start,start2,end,end2,duration){
		return TweenManager.createTween()._to2(start,start2,end,end2,duration);
	}

	GTween.to3=function(start,start2,start3,end,end2,end3,duration){
		return TweenManager.createTween()._to3(start,start2,start3,end,end2,end3,duration);
	}

	GTween.to4=function(start,start2,start3,start4,end,end2,end3,end4,duration){
		return TweenManager.createTween()._to4(start,start2,start3,start4,end,end2,end3,end4,duration);
	}

	GTween.toColor=function(start,end,duration){
		return TweenManager.createTween()._toColor(start,end,duration);
	}

	GTween.delayedCall=function(delay){
		return TweenManager.createTween().setDelay(delay);
	}

	GTween.shake=function(startX,startY,amplitude,duration){
		return TweenManager.createTween()._shake(startX,startY,amplitude,duration);
	}

	GTween.isTweening=function(target,propType){
		return TweenManager.isTweening(target,propType);
	}

	GTween.kill=function(target,complete,propType){
		(complete===void 0)&& (complete=false);
		TweenManager.killTweens(target,false,null);
	}

	GTween.getTween=function(target,propType){
		return TweenManager.getTween(target,propType);
	}

	GTween.catchCallbackExceptions=true;
	return GTween;
})()



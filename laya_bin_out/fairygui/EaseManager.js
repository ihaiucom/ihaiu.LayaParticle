//class fairygui.tween.EaseManager
var EaseManager=(function(){
	var Bounce;
	function EaseManager(){}
	__class(EaseManager,'fairygui.tween.EaseManager');
	EaseManager.evaluate=function(easeType,time,duration,overshootOrAmplitude,period){
		switch (easeType){
			case 0:
				return time / duration;
			case 1:
				return-Math.cos(time / duration *EaseManager._PiOver2)+1;
			case 2:
				return Math.sin(time / duration *EaseManager._PiOver2);
			case 3:
				return-0.5 *(Math.cos(Math.PI *time / duration)-1);
			case 4:
				return (time /=duration)*time;
			case 5:
				return-(time /=duration)*(time-2);
			case 6:
				if ((time /=duration *0.5)< 1)return 0.5 *time *time;
				return-0.5 *((--time)*(time-2)-1);
			case 7:
				return (time /=duration)*time *time;
			case 8:
				return ((time=time / duration-1)*time *time+1);
			case 9:
				if ((time /=duration *0.5)< 1)return 0.5 *time *time *time;
				return 0.5 *((time-=2)*time *time+2);
			case 10:
				return (time /=duration)*time *time *time;
			case 11:
				return-((time=time / duration-1)*time *time *time-1);
			case 12:
				if ((time /=duration *0.5)< 1)return 0.5 *time *time *time *time;
				return-0.5 *((time-=2)*time *time *time-2);
			case 13:
				return (time /=duration)*time *time *time *time;
			case 14:
				return ((time=time / duration-1)*time *time *time *time+1);
			case 15:
				if ((time /=duration *0.5)< 1)return 0.5 *time *time *time *time *time;
				return 0.5 *((time-=2)*time *time *time *time+2);
			case 16:
				return (time==0)? 0 :Math.pow(2,10 *(time / duration-1));
			case 17:
				if (time==duration)return 1;
				return (-Math.pow(2,-10 *time / duration)+1);
			case 18:
				if (time==0)return 0;
				if (time==duration)return 1;
				if ((time /=duration *0.5)< 1)return 0.5 *Math.pow(2,10 *(time-1));
				return 0.5 *(-Math.pow(2,-10 *--time)+2);
			case 19:
				return-(Math.sqrt(1-(time /=duration)*time)-1);
			case 20:
				return Math.sqrt(1-(time=time / duration-1)*time);
			case 21:
				if ((time /=duration *0.5)< 1)return-0.5 *(Math.sqrt(1-time *time)-1);
				return 0.5 *(Math.sqrt(1-(time-=2)*time)+1);
			case 22:;
				var s0=NaN;
				if (time==0)return 0;
				if ((time /=duration)==1)return 1;
				if (period==0)period=duration *0.3;
				if (overshootOrAmplitude < 1){
					overshootOrAmplitude=1;
					s0=period / 4;
				}
				else s0=period / EaseManager._TwoPi *Math.asin(1 / overshootOrAmplitude);
				return-(overshootOrAmplitude *Math.pow(2,10 *(time-=1))*Math.sin((time *duration-s0)*EaseManager._TwoPi / period));
			case 23:;
				var s1=NaN;
				if (time==0)return 0;
				if ((time /=duration)==1)return 1;
				if (period==0)period=duration *0.3;
				if (overshootOrAmplitude < 1){
					overshootOrAmplitude=1;
					s1=period / 4;
				}
				else s1=period / EaseManager._TwoPi *Math.asin(1 / overshootOrAmplitude);
				return (overshootOrAmplitude *Math.pow(2,-10 *time)*Math.sin((time *duration-s1)*EaseManager._TwoPi / period)+1);
			case 24:;
				var s=NaN;
				if (time==0)return 0;
				if ((time /=duration *0.5)==2)return 1;
				if (period==0)period=duration *(0.3 *1.5);
				if (overshootOrAmplitude < 1){
					overshootOrAmplitude=1;
					s=period / 4;
				}
				else s=period / EaseManager._TwoPi *Math.asin(1 / overshootOrAmplitude);
				if (time < 1)return-0.5 *(overshootOrAmplitude *Math.pow(2,10 *(time-=1))*Math.sin((time *duration-s)*EaseManager._TwoPi / period));
				return overshootOrAmplitude *Math.pow(2,-10 *(time-=1))*Math.sin((time *duration-s)*EaseManager._TwoPi / period)*0.5+1;
			case 25:
				return (time /=duration)*time *((overshootOrAmplitude+1)*time-overshootOrAmplitude);
			case 26:
				return ((time=time / duration-1)*time *((overshootOrAmplitude+1)*time+overshootOrAmplitude)+1);
			case 27:
				if ((time /=duration *0.5)< 1)return 0.5 *(time *time *(((overshootOrAmplitude *=(1.525))+1)*time-overshootOrAmplitude));
				return 0.5 *((time-=2)*time *(((overshootOrAmplitude *=(1.525))+1)*time+overshootOrAmplitude)+2);
			case 28:
				return Bounce.easeIn(time,duration);
			case 29:
				return Bounce.easeOut(time,duration);
			case 30:
				return Bounce.easeInOut(time,duration);
			default :
				return-(time /=duration)*(time-2);
			}
	}

	__static(EaseManager,
	['_PiOver2',function(){return this._PiOver2=Math.PI *0.5;},'_TwoPi',function(){return this._TwoPi=Math.PI *2;}
	]);
	EaseManager.__init$=function(){
		/// This class contains a C# port of the easing equations created by Robert Penner (http://robertpenner.com/easing).
		
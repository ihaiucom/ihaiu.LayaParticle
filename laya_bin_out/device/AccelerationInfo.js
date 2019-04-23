
/**
*Accelerator.instance获取唯一的Accelerator引用，请勿调用构造函数。
*
*<p>
*listen()的回调处理器接受四个参数：
*<ol>
*<li><b>acceleration</b>:表示用户给予设备的加速度。</li>
*<li><b>accelerationIncludingGravity</b>:设备受到的总加速度（包含重力）。</li>
*<li><b>rotationRate</b>:设备的自转速率。</li>
*<li><b>interval</b>:加速度获取的时间间隔（毫秒）。</li>
*</ol>
*</p>
*<p>
*<b>NOTE</b><br/>
*如，rotationRate的alpha在apple和moz文档中都是z轴旋转角度，但是实测是x轴旋转角度。为了使各属性表示的值与文档所述相同，实际值与其他属性进行了对调。
*其中：
*<ul>
*<li>alpha使用gamma值。</li>
*<li>beta使用alpha值。</li>
*<li>gamma使用beta。</li>
*</ul>
*目前孰是孰非尚未可知，以此为注。
*</p>
*/

//class laya.device.motion.AccelerationInfo
var AccelerationInfo=(function(){
	function AccelerationInfo(){
		/**
		*x轴上的加速度值。
		*/
		this.x=NaN;
		/**
		*y轴上的加速度值。
		*/
		this.y=NaN;
		/**
		*z轴上的加速度值。
		*/
		this.z=NaN;
	}

	__class(AccelerationInfo,'laya.device.motion.AccelerationInfo');
	return AccelerationInfo;
})()



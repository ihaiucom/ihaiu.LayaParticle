//class fairygui.display.FillUtils
var FillUtils=(function(){
	function FillUtils(){}
	__class(FillUtils,'fairygui.display.FillUtils');
	FillUtils.fill=function(w,h,method,origin,clockwise,amount){
		if(amount<=0)
			return null;
		else if(amount>=0.9999)
		return [0,0,w,0,w,h,0,h];
		var points;
		switch(method){
			case 1:
				points=fairygui.display.FillUtils.fillHorizontal(w,h,origin,amount);
				break ;
			case 2:
				points=fairygui.display.FillUtils.fillVertical(w,h,origin,amount);
				break ;
			case 3:
				points=fairygui.display.FillUtils.fillRadial90(w,h,origin,clockwise,amount);
				break ;
			case 4:
				points=fairygui.display.FillUtils.fillRadial180(w,h,origin,clockwise,amount);
				break ;
			case 5:
				points=fairygui.display.FillUtils.fillRadial360(w,h,origin,clockwise,amount);
				break ;
			}
		return points;
	}

	FillUtils.fillHorizontal=function(w,h,origin,amount){
		var w2=w*amount;
		if(origin==2 || origin==0)
			return [0,0,w2,0,w2,h,0,h];
		else
		return [w,0,w,h,w-w2,h,w-w2,0];
	}

	FillUtils.fillVertical=function(w,h,origin,amount){
		var h2=h*amount;
		if(origin==2 || origin==0)
			return [0,0,0,h2,w,h2,w,0];
		else
		return [0,h,w,h,w,h-h2,0,h-h2];
	}

	FillUtils.fillRadial90=function(w,h,origin,clockwise,amount){
		if(clockwise && (origin==1 || origin==2)
			|| !clockwise && (origin==0 || origin==3)){
			amount=1-amount;
		};
		var v=NaN,v2=NaN,h2=NaN;
		v=Math.tan(Math.PI / 2 *amount);
		h2=w *v;
		v2=(h2-h)/ h2;
		var points;
		switch(origin){
			case 0:
				if(clockwise){
					if(h2<=h)
						points=[0,0,w,h2,w,0];
					else
					points=[0,0,w*(1-v2),h,w,h,w,0];
				}
				else{
					if(h2<=h)
						points=[0,0,w,h2,w,h,0,h];
					else
					points=[0,0,w*(1-v2),h,0,h];
				}
				break ;
			case 1:
				if(clockwise){
					if(h2<=h)
						points=[w,0,0,h2,0,h,w,h];
					else
					points=[w,0,w*v2,h,w,h];
				}
				else{
					if(h2<=h)
						points=[w,0,0,h2,0,0];
					else
					points=[w,0,w*v2,h,0,h,0,0];
				}
				break ;
			case 2:
				if(clockwise){
					if(h2<=h)
						points=[0,h,w,h-h2,w,0,0,0];
					else
					points=[0,h,w*(1-v2),0,0,0];
				}
				else{
					if(h2<=h)
						points=[0,h,w,h-h2,w,h];
					else
					points=[0,h,w*(1-v2),0,w,0,w,h];
				}
				break ;
			case 3:
				if(clockwise){
					if(h2<=h)
						points=[w,h,0,h-h2,0,h];
					else
					points=[w,h,w*v2,0,0,0,0,h];
				}
				else{
					if(h2<=h)
						points=[w,h,0,h-h2,0,0,w,0];
					else
					points=[w,h,w*v2,0,w,0];
				}
				break ;
			}
		return points;
	}

	FillUtils.movePoints=function(points,offsetX,offsetY){
		var cnt=points.length;
		for(var i=0;i<cnt;i+=2){
			points[i]+=offsetX;
			points[i+1]+=offsetY;
		}
	}

	FillUtils.fillRadial180=function(w,h,origin,clockwise,amount){
		var points;
		switch(origin){
			case 0:
				if(amount<=0.5){
					amount=amount / 0.5;
					points=FillUtils.fillRadial90(w/2,h,
					clockwise?0:1,
					clockwise,
					amount);
					if(clockwise)
						FillUtils.movePoints(points,w/2,0);
				}
				else{
					amount=(amount-0.5)/ 0.5;
					points=FillUtils.fillRadial90(w/2,h,
					clockwise?1:0,
					clockwise,
					amount);
					if(clockwise)
						points.push(w,h,w,0);
					else{
						FillUtils.movePoints(points,w/2,0);
						points.push(0,h,0,0);
					}
				}
				break ;
			case 1:
				if(amount<=0.5){
					amount=amount / 0.5;
					points=FillUtils.fillRadial90(w/2,h,
					clockwise?3:2,
					clockwise,
					amount);
					if(!clockwise)
						FillUtils.movePoints(points,w/2,0);
				}
				else{
					amount=(amount-0.5)/ 0.5;
					points=FillUtils.fillRadial90(w/2,h,
					clockwise?2:3,
					clockwise,
					amount);
					if(clockwise){
						FillUtils.movePoints(points,w/2,0);
						points.push(0,0,0,h);
					}
					else
					points.push(w,0,w,h);
				}
				break ;
			case 2:
				if(amount<=0.5){
					amount=amount / 0.5;
					points=FillUtils.fillRadial90(w,h/2,
					clockwise?2:0,
					clockwise,
					amount);
					if(!clockwise)
						FillUtils.movePoints(points,0,h/2);
				}
				else{
					amount=(amount-0.5)/ 0.5;
					points=FillUtils.fillRadial90(w,h/2,
					clockwise?0:2,
					clockwise,
					amount);
					if(clockwise){
						FillUtils.movePoints(points,0,h/2);
						points.push(w,0,0,0);
					}
					else
					points.push(w,h,0,h);
				}
				break ;
			case 3:
				if(amount<=0.5){
					amount=amount / 0.5;
					points=FillUtils.fillRadial90(w,h/2,
					clockwise?1:3,
					clockwise,
					amount);
					if(clockwise)
						FillUtils.movePoints(points,0,h/2);
				}
				else{
					amount=(amount-0.5)/ 0.5;
					points=FillUtils.fillRadial90(w,h/2,
					clockwise?3:1,
					clockwise,
					amount);
					if(clockwise)
						points.push(0,h,w,h);
					else{
						FillUtils.movePoints(points,0,h/2);
						points.push(0,0,w,0);
					}
				}
				break ;
			}
		return points;
	}

	FillUtils.fillRadial360=function(w,h,origin,clockwise,amount){
		var points;
		switch(origin){
			case 0:
				if(amount<=0.5){
					amount=amount / 0.5;
					points=FillUtils.fillRadial180(w/2,h,
					clockwise?2:3,
					clockwise,
					amount);
					if(clockwise)
						FillUtils.movePoints(points,w/2,0);
				}
				else{
					amount=(amount-0.5)/ 0.5;
					points=FillUtils.fillRadial180(w/2,h,
					clockwise?3:2,
					clockwise,
					amount);
					if(clockwise)
						points.push(w,h,w,0,w/2,0);
					else{
						FillUtils.movePoints(points,w/2,0);
						points.push(0,h,0,0,w/2,0);
					}
				}
				break ;
			case 1:
				if(amount<=0.5){
					amount=amount / 0.5;
					points=FillUtils.fillRadial180(w/2,h,
					clockwise?3:2,
					clockwise,
					amount);
					if(!clockwise)
						FillUtils.movePoints(points,w/2,0);
				}
				else{
					amount=(amount-0.5)/ 0.5;
					points=FillUtils.fillRadial180(w/2,h,
					clockwise?2:3,
					clockwise,
					amount);
					if(clockwise){
						FillUtils.movePoints(points,w/2,0);
						points.push(0,0,0,h,w/2,h);
					}
					else
					points.push(w,0,w,h,w/2,h);
				}
				break ;
			case 2:
				if(amount<=0.5){
					amount=amount / 0.5;
					points=FillUtils.fillRadial180(w,h/2,
					clockwise?1:0,
					clockwise,
					amount);
					if(!clockwise)
						FillUtils.movePoints(points,0,h/2);
				}
				else{
					amount=(amount-0.5)/ 0.5;
					points=FillUtils.fillRadial180(w,h/2,
					clockwise?0:1,
					clockwise,
					amount);
					if(clockwise){
						FillUtils.movePoints(points,0,h/2);
						points.push(w,0,0,0,0,h/2);
					}
					else
					points.push(w,h,0,h,0,h/2);
				}
				break ;
			case 3:
				if(amount<=0.5){
					amount=amount / 0.5;
					points=FillUtils.fillRadial180(w,h/2,
					clockwise?0:1,
					clockwise,
					amount);
					if(clockwise)
						FillUtils.movePoints(points,0,h/2);
				}
				else{
					amount=(amount-0.5)/ 0.5;
					points=FillUtils.fillRadial180(w,h/2,
					clockwise?1:0,
					clockwise,
					amount);
					if(clockwise)
						points.push(0,h,w,h,w,h/2);
					else{
						FillUtils.movePoints(points,0,h/2);
						points.push(0,0,w,0,w,h/2);
					}
				}
				break ;
			}
		return points;
	}

	return FillUtils;
})()



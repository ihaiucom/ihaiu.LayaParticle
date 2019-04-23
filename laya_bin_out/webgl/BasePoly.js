//class laya.webgl.shapes.BasePoly
var BasePoly=(function(){
	function BasePoly(){}
	__class(BasePoly,'laya.webgl.shapes.BasePoly');
	BasePoly.createLine2=function(p,indices,lineWidth,indexBase,outVertex,loop){
		if (p.length < 4)return null;
		var points=BasePoly.tempData.length>(p.length+2)?BasePoly.tempData:new Array(p.length+2);
		points[0]=p[0];points[1]=p[1];
		var newlen=2;
		var i=0;
		var length=p.length;
		for (i=2;i < length;i+=2){
			if (Math.abs(p[i]-p[i-2])+Math.abs(p[i+1]-p[i-1])> 0.01){
				points[newlen++]=p[i];points[newlen++]=p[i+1];
			}
		}
		if (loop && Math.abs(p[0]-points[newlen-2])+Math.abs(p[1]-points[newlen-1])> 0.01){
			points[newlen++]=p[0];points[newlen++]=p[1];
		};
		var result=outVertex;
		length=newlen / 2;
		var w=lineWidth / 2;
		var px,py,p1x,p1y,p2x,p2y,p3x,p3y;
		var perpx,perpy,perp2x,perp2y,perp3x,perp3y;
		var a1,b1,c1,a2,b2,c2;
		var denom,pdist,dist;
		p1x=points[0];
		p1y=points[1];
		p2x=points[2];
		p2y=points[3];
		perpx=-(p1y-p2y);
		perpy=p1x-p2x;
		dist=Math.sqrt(perpx *perpx+perpy *perpy);
		perpx=perpx / dist *w;
		perpy=perpy / dist *w;
		var tpx=perpx,tpy=perpy;
		result.push(p1x-perpx ,p1y-perpy ,p1x+perpx ,p1y+perpy);
		for (i=1;i < length-1;i++){
			p1x=points[(i-1)*2];
			p1y=points[(i-1)*2+1];
			p2x=points[(i)*2];
			p2y=points[(i)*2+1];
			p3x=points[(i+1)*2];
			p3y=points[(i+1)*2+1];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			perp2x=-(p2y-p3y);
			perp2y=p2x-p3x;
			dist=Math.sqrt(perp2x *perp2x+perp2y *perp2y);
			perp2x=perp2x / dist *w;
			perp2y=perp2y / dist *w;
			a1=(-perpy+p1y)-(-perpy+p2y);
			b1=(-perpx+p2x)-(-perpx+p1x);
			c1=(-perpx+p1x)*(-perpy+p2y)-(-perpx+p2x)*(-perpy+p1y);
			a2=(-perp2y+p3y)-(-perp2y+p2y);
			b2=(-perp2x+p2x)-(-perp2x+p3x);
			c2=(-perp2x+p3x)*(-perp2y+p2y)-(-perp2x+p2x)*(-perp2y+p3y);
			denom=a1 *b2-a2 *b1;
			if (Math.abs(denom)< 0.1){
				denom+=10.1;
				result.push(p2x-perpx ,p2y-perpy ,p2x+perpx ,p2y+perpy);
				continue ;
			}
			px=(b1 *c2-b2 *c1)/ denom;
			py=(a2 *c1-a1 *c2)/ denom;
			pdist=(px-p2x)*(px-p2x)+(py-p2y)+(py-p2y);
			result.push(px,py ,p2x-(px-p2x),p2y-(py-p2y));
		}
		p1x=points[newlen-4];
		p1y=points[newlen-3];
		p2x=points[newlen-2];
		p2y=points[newlen-1];
		perpx=-(p1y-p2y);
		perpy=p1x-p2x;
		dist=Math.sqrt(perpx *perpx+perpy *perpy);
		perpx=perpx / dist *w;
		perpy=perpy / dist *w;
		result.push(p2x-perpx ,p2y-perpy ,p2x+perpx ,p2y+perpy);
		for (i=1;i < length;i++){
			indices.push(indexBase+(i-1)*2,indexBase+(i-1)*2+1,indexBase+i *2+1,indexBase+i *2+1,indexBase+i *2,indexBase+(i-1)*2);
		}
		return result;
	}

	BasePoly.createLineTriangle=function(path,color,width,loop,outvb,vbstride,outib){
		var points=path.slice();
		var ptlen=points.length;
		var p1x=points[0],p1y=points[1];
		var p2x=points[2],p2y=points[2];
		var len=0;
		var rp=0;
		var dx=0,dy=0;
		var pointnum=ptlen / 2;
		if (pointnum <=1)return;
		if (pointnum==2){
			return;
		};
		var tmpData=new Array(pointnum *4);
		var realPtNum=0;
		var ci=0;
		for (var i=0;i < pointnum-1;i++){
			p1x=points[ci++],p1y=points[ci++];
			p2x=points[ci++],p2y=points[ci++];
			dx=p2x-p1x,dy=p2y-p1y;
			if(dx!=0 && dy!=0){
				len=Math.sqrt(dx *dx+dy *dy);
				if (len > 1e-3){
					rp=realPtNum *4;
					tmpData[rp]=p1x;
					tmpData[rp+1]=p1y;
					tmpData[rp+2]=dx / len;
					tmpData[rp+3]=dy / len;
					realPtNum++;
				}
			}
		}
		if (loop){
			p1x=points[ptlen-2],p1y=points[ptlen-1];
			p2x=points[0],p2y=points[1];
			dx=p2x-p1x,dy=p2y-p1y;
			if(dx!=0 && dy!=0){
				len=Math.sqrt(dx *dx+dy *dy);
				if (len > 1e-3){
					rp=realPtNum *4;
					tmpData[rp]=p1x;
					tmpData[rp+1]=p1y;
					tmpData[rp+2]=dx / len;
					tmpData[rp+3]=dy / len;
					realPtNum++;
				}
			}
			}else {
			rp=realPtNum *4;
			tmpData[rp]=p1x;
			tmpData[rp+1]=p1y;
			tmpData[rp+2]=dx / len;
			tmpData[rp+3]=dy / len;
			realPtNum++;
		}
		ci=0;
		for (i=0;i < pointnum;i++){
			p1x=points[ci],p1y=points[ci+1];
			p2x=points[ci+2],p2y=points[ci+3];
			var p3x=points[ci+4],p3y=points[ci+5];
		}
		if (loop){}
			}
	__static(BasePoly,
	['tempData',function(){return this.tempData=new Array(256);}
	]);
	return BasePoly;
})()


/**
*...
*@author laoxie
*/

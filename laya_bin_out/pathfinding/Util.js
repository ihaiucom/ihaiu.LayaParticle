//class PathFinding.core.Util
var Util=(function(){
	function Util(){}
	__class(Util,'PathFinding.core.Util');
	Util.backtrace=function(node){
		var path=[[node.x,node.y]];
		while (node.parent){
			node=node.parent;
			path.push([node.x,node.y]);
		}
		return path.reverse();
	}

	Util.biBacktrace=function(nodeA,nodeB){
		var pathA=Util.backtrace(nodeA),pathB=Util.backtrace(nodeB);
		return pathA.concat(pathB.reverse());
	}

	Util.pathLength=function(path){
		var i=0,sum=0,a=0,b=0,dx=0,dy=0;
		for (i=1;i < path.length;++i){
			a=path[i-1];
			b=path[i];
			dx=a[0]-b[0];
			dy=a[1]-b[1];
			sum+=Math.sqrt(dx *dx+dy *dy);
		}
		return sum;
	}

	Util.interpolate=function(x0,y0,x1,y1){
		var abs=Math.abs,line=[],sx=0,sy=0,dx=0,dy=0,err=0,e2=0;
		dx=abs(x1-x0);
		dy=abs(y1-y0);
		sx=(x0 < x1)? 1 :-1;
		sy=(y0 < y1)? 1 :-1;
		err=dx-dy;
		while (true){
			line.push([x0,y0]);
			if (x0==x1 && y0==y1){
				break ;
			}
			e2=2 *err;
			if (e2 >-dy){
				err=err-dy;
				x0=x0+sx;
			}
			if (e2 < dx){
				err=err+dx;
				y0=y0+sy;
			}
		}
		return line;
	}

	Util.expandPath=function(path){
		var expanded=[],len=path.length,coord0,coord1,interpolated,interpolatedLen=0,i=0,j=0;
		if (len < 2){
			return expanded;
		}
		for (i=0;i < len-1;++i){
			coord0=path[i];
			coord1=path[i+1];
			interpolated=Util.interpolate(coord0[0],coord0[1],coord1[0],coord1[1]);
			interpolatedLen=interpolated.length;
			for (j=0;j < interpolatedLen-1;++j){
				expanded.push(interpolated[j]);
			}
		}
		expanded.push(path[len-1]);
		return expanded;
	}

	Util.smoothenPath=function(grid,path){
		var len=path.length,x0=path[0][0],
		y0=path[0][1],
		x1=path[len-1][0],
		y1=path[len-1][1],
		sx=0,sy=0,
		ex=0,ey=0,
		newPath,i=0,j=0,coord,line,testCoord,blocked=false,lastValidCoord;
		sx=x0;
		sy=y0;
		newPath=[[sx,sy]];
		for (i=2;i < len;++i){
			coord=path[i];
			ex=coord[0];
			ey=coord[1];
			line=Util.interpolate(sx,sy,ex,ey);
			blocked=false;
			for (j=1;j < line.length;++j){
				testCoord=line[j];
				if (!grid.isWalkableAt(testCoord[0],testCoord[1])){
					blocked=true;
					break ;
				}
			}
			if (blocked){
				lastValidCoord=path[i-1];
				newPath.push(lastValidCoord);
				sx=lastValidCoord[0];
				sy=lastValidCoord[1];
			}
		}
		newPath.push([x1,y1]);
		return newPath;
	}

	Util.compressPath=function(path){
		if (path.length < 3){
			return path;
		};
		var compressed=[],sx=path[0][0],
		sy=path[0][1],
		px=path[1][0],
		py=path[1][1],
		dx=px-sx,
		dy=py-sy,
		lx=0,ly=0,ldx=0,ldy=0,sq=NaN,i=0;
		sq=Math.sqrt(dx *dx+dy *dy);
		dx /=sq;
		dy /=sq;
		compressed.push([sx,sy]);
		for (i=2;i < path.length;i++){
			lx=px;
			ly=py;
			ldx=dx;
			ldy=dy;
			px=path[i][0];
			py=path[i][1];
			dx=px-lx;
			dy=py-ly;
			sq=Math.sqrt(dx *dx+dy *dy);
			dx /=sq;
			dy /=sq;
			if (dx!==ldx || dy!==ldy){
				compressed.push([lx,ly]);
			}
		}
		compressed.push([px,py]);
		return compressed;
	}

	return Util;
})()


/**
*...
*@author dongketao
*/

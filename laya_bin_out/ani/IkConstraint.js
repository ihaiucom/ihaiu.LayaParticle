//class laya.ani.bone.IkConstraint
var IkConstraint=(function(){
	function IkConstraint(data,bones){
		this._targetBone=null;
		this._bones=null;
		this._data=null;
		this.name=null;
		this.mix=NaN;
		this.bendDirection=NaN;
		this.isSpine=true;
		//debug相关代码
		this._sp=null;
		this.isDebug=false;
		this._data=data;
		this._targetBone=bones[data.targetBoneIndex];
		this.isSpine=data.isSpine;
		if (this._bones==null)this._bones=[];
		this._bones.length=0;
		for (var i=0,n=data.boneIndexs.length;i < n;i++){
			this._bones.push(bones[data.boneIndexs[i]]);
		}
		this.name=data.name;
		this.mix=data.mix;
		this.bendDirection=data.bendDirection;
	}

	__class(IkConstraint,'laya.ani.bone.IkConstraint');
	var __proto=IkConstraint.prototype;
	__proto.apply=function(){
		switch (this._bones.length){
			case 1:
				this._applyIk1(this._bones[0],this._targetBone.resultMatrix.tx,this._targetBone.resultMatrix.ty,this.mix);
				break ;
			case 2:
				if (this.isSpine){
					this._applyIk2(this._bones[0],this._bones[1],this._targetBone.resultMatrix.tx,this._targetBone.resultMatrix.ty,this.bendDirection,this.mix);
					}else{
					this._applyIk3(this._bones[0],this._bones[1],this._targetBone.resultMatrix.tx,this._targetBone.resultMatrix.ty,this.bendDirection,this.mix);
				}
				break ;
			}
	}

	//TODO:coverage
	__proto._applyIk1=function(bone,targetX,targetY,alpha){
		var pp=bone.parentBone;
		var id=1 / (pp.resultMatrix.a *pp.resultMatrix.d-pp.resultMatrix.b *pp.resultMatrix.c);
		var x=targetX-pp.resultMatrix.tx;
		var y=targetY-pp.resultMatrix.ty;
		var tx=(x *pp.resultMatrix.d-y *pp.resultMatrix.c)*id-bone.transform.x;
		var ty=(y *pp.resultMatrix.a-x *pp.resultMatrix.b)*id-bone.transform.y;
		var rotationIK=Math.atan2(ty,tx)*IkConstraint.radDeg-0-bone.transform.skX;
		if (bone.transform.scX < 0)rotationIK+=180;
		if (rotationIK > 180)
			rotationIK-=360;
		else if (rotationIK <-180)rotationIK+=360;
		bone.transform.skX=bone.transform.skY=bone.transform.skX+rotationIK *alpha;
		bone.update();
	}

	//TODO:coverage
	__proto.updatePos=function(x,y){
		if (this._sp){
			this._sp.pos(x,y);
		}
	}

	//TODO:coverage
	__proto._applyIk2=function(parent,child,targetX,targetY,bendDir,alpha){
		if (alpha==0){
			return;
		};
		var px=parent.resultTransform.x,py=parent.resultTransform.y;
		var psx=parent.transform.scX,psy=parent.transform.scY;
		var csx=child.transform.scX;
		var os1=0,os2=0,s2=0;
		if (psx < 0){
			psx=-psx;
			os1=180;
			s2=-1;
			}else {
			os1=0;
			s2=1;
		}
		if (psy < 0){
			psy=-psy;
			s2=-s2;
		}
		if (csx < 0){
			csx=-csx;
			os2=180;
			}else {
			os2=0
		};
		var cx=child.resultTransform.x,cy=NaN,cwx=NaN,cwy=NaN;
		var a=parent.resultMatrix.a,b=parent.resultMatrix.c;
		var c=parent.resultMatrix.b,d=parent.resultMatrix.d;
		var u=Math.abs(psx-psy)<=0.0001;
		if (!u){
			cy=0;
			cwx=a *cx+parent.resultMatrix.tx;
			cwy=c *cx+parent.resultMatrix.ty;
			}else {
			cy=child.resultTransform.y;
			cwx=a *cx+b *cy+parent.resultMatrix.tx;
			cwy=c *cx+d *cy+parent.resultMatrix.ty;
		}
		if (this.isDebug){
			if (!this._sp){
				this._sp=new Sprite();
				Laya.stage.addChild(this._sp);
			}
			this._sp.graphics.clear();
			this._sp.graphics.drawCircle(targetX,targetY,15,"#ffff00");
			this._sp.graphics.drawCircle(cwx,cwy,15,"#ff00ff");
		}
		parent.setRotation(Math.atan2(cwy-parent.resultMatrix.ty,cwx-parent.resultMatrix.tx));
		var pp=parent.parentBone;
		a=pp.resultMatrix.a;
		b=pp.resultMatrix.c;
		c=pp.resultMatrix.b;
		d=pp.resultMatrix.d;
		var id=1 / (a *d-b *c);
		var x=targetX-pp.resultMatrix.tx,y=targetY-pp.resultMatrix.ty;
		var tx=(x *d-y *b)*id-px;
		var ty=(y *a-x *c)*id-py;
		x=cwx-pp.resultMatrix.tx;
		y=cwy-pp.resultMatrix.ty;
		var dx=(x *d-y *b)*id-px;
		var dy=(y *a-x *c)*id-py;
		var l1=Math.sqrt(dx *dx+dy *dy);
		var l2=child.length *csx;
		var a1=NaN,a2=NaN;
		if (u){
			l2 *=psx;
			var cos=(tx *tx+ty *ty-l1 *l1-l2 *l2)/ (2 *l1 *l2);
			if (cos <-1)
				cos=-1;
			else if (cos > 1)cos=1;
			a2=Math.acos(cos)*bendDir;
			a=l1+l2 *cos;
			b=l2 *Math.sin(a2);
			a1=Math.atan2(ty *a-tx *b,tx *a+ty *b);
			}else {
			a=psx *l2;
			b=psy *l2;
			var aa=a *a,bb=b *b,dd=tx *tx+ty *ty,ta=Math.atan2(ty,tx);
			c=bb *l1 *l1+aa *dd-aa *bb;
			var c1=-2 *bb *l1,c2=bb-aa;
			d=c1 *c1-4 *c2 *c;
			if (d > 0){
				var q=Math.sqrt(d);
				if (c1 < 0)q=-q;
				q=-(c1+q)/ 2;
				var r0=q / c2,r1=c / q;
				var r=Math.abs(r0)< Math.abs(r1)? r0 :r1;
				if (r *r <=dd){
					y=Math.sqrt(dd-r *r)*bendDir;
					a1=ta-Math.atan2(y,r);
					a2=Math.atan2(y / psy,(r-l1)/ psx);
				}
			};
			var minAngle=0,minDist=Number.MAX_VALUE,minX=0,minY=0;
			var maxAngle=0,maxDist=0,maxX=0,maxY=0;
			x=l1+a;
			d=x *x;
			if (d > maxDist){
				maxAngle=0;
				maxDist=d;
				maxX=x;
			}
			x=l1-a;
			d=x *x;
			if (d < minDist){
				minAngle=Math.PI;
				minDist=d;
				minX=x;
			};
			var angle=Math.acos(-a *l1 / (aa-bb));
			x=a *Math.cos(angle)+l1;
			y=b *Math.sin(angle);
			d=x *x+y *y;
			if (d < minDist){
				minAngle=angle;
				minDist=d;
				minX=x;
				minY=y;
			}
			if (d > maxDist){
				maxAngle=angle;
				maxDist=d;
				maxX=x;
				maxY=y;
			}
			if (dd <=(minDist+maxDist)/ 2){
				a1=ta-Math.atan2(minY *bendDir,minX);
				a2=minAngle *bendDir;
				}else {
				a1=ta-Math.atan2(maxY *bendDir,maxX);
				a2=maxAngle *bendDir;
			}
		};
		var os=Math.atan2(cy,cx)*s2;
		var rotation=parent.resultTransform.skX;
		a1=(a1-os)*IkConstraint.radDeg+os1-rotation;
		if (a1 > 180)
			a1-=360;
		else if (a1 <-180)a1+=360;
		parent.resultTransform.x=px;
		parent.resultTransform.y=py;
		parent.resultTransform.skX=parent.resultTransform.skY=rotation+a1 *alpha;
		rotation=child.resultTransform.skX;
		rotation=rotation % 360;
		a2=((a2+os)*IkConstraint.radDeg-0)*s2+os2-rotation;
		if (a2 > 180)
			a2-=360;
		else if (a2 <-180)a2+=360;
		child.resultTransform.x=cx;
		child.resultTransform.y=cy;
		child.resultTransform.skX=child.resultTransform.skY=child.resultTransform.skY+a2 *alpha;
		parent.update();
	}

	//TODO:coverage
	__proto._applyIk3=function(parent,child,targetX,targetY,bendDir,alpha){
		if (alpha==0){
			return;
		};
		var cwx=NaN,cwy=NaN;
		var x=child.resultMatrix.a *child.length;
		var y=child.resultMatrix.b *child.length;
		var lLL=x *x+y *y;
		var lL=Math.sqrt(lLL);
		var parentX=parent.resultMatrix.tx;
		var parentY=parent.resultMatrix.ty;
		var childX=child.resultMatrix.tx;
		var childY=child.resultMatrix.ty;
		var dX=childX-parentX;
		var dY=childY-parentY;
		var lPP=dX *dX+dY *dY;
		var lP=Math.sqrt(lPP);
		dX=targetX-parent.resultMatrix.tx;
		dY=targetY-parent.resultMatrix.ty;
		var lTT=dX *dX+dY *dY;
		var lT=Math.sqrt(lTT);
		var ikRadianA=0;
		if (lL+lP <=lT || lT+lL <=lP || lT+lP <=lL){
			var rate=NaN;
			if (lL+lP <=lT){
				rate=1;
				}else{
				rate=-1;
			}
			childX=parentX+rate*(targetX-parentX)*lP / lT;
			childY=parentY+rate*(targetY-parentY)*lP / lT;
		}
		else{
			var h=(lPP-lLL+lTT)/ (2 *lTT);
			var r=Math.sqrt(lPP-h *h *lTT)/ lT;
			var hX=parentX+(dX *h);
			var hY=parentY+(dY *h);
			var rX=-dY *r;
			var rY=dX *r;
			if (bendDir>0){
				childX=hX-rX;
				childY=hY-rY;
			}
			else{
				childX=hX+rX;
				childY=hY+rY;
			}
		}
		cwx=childX;
		cwy=childY;
		if (this.isDebug){
			if (!this._sp){
				this._sp=new Sprite();
				Laya.stage.addChild(this._sp);
			}
			this._sp.graphics.clear();
			this._sp.graphics.drawCircle(parentX,parentY,15,"#ff00ff");
			this._sp.graphics.drawCircle(targetX,targetY,15,"#ffff00");
			this._sp.graphics.drawCircle(cwx,cwy,15,"#ff00ff");
		};
		var pRotation=NaN;
		pRotation=Math.atan2(cwy-parent.resultMatrix.ty,cwx-parent.resultMatrix.tx);
		parent.setRotation(pRotation);
		var pTarMatrix;
		pTarMatrix=IkConstraint._tempMatrix;
		pTarMatrix.identity();
		pTarMatrix.rotate(pRotation);
		pTarMatrix.scale(parent.resultMatrix.getScaleX(),parent.resultMatrix.getScaleY());
		pTarMatrix.translate(parent.resultMatrix.tx,parent.resultMatrix.ty);
		pTarMatrix.copyTo(parent.resultMatrix);
		parent.updateChild();
		var childRotation=NaN;
		childRotation=Math.atan2(targetY-cwy,targetX-cwx);
		child.setRotation(childRotation);
		var childTarMatrix;
		childTarMatrix=IkConstraint._tempMatrix;
		childTarMatrix.identity();
		childTarMatrix.rotate(childRotation);
		childTarMatrix.scale(child.resultMatrix.getScaleX(),child.resultMatrix.getScaleY());
		childTarMatrix.translate(cwx,cwy);
		pTarMatrix.copyTo(child.resultMatrix);
		child.updateChild();
	}

	__static(IkConstraint,
	['radDeg',function(){return this.radDeg=180 / Math.PI;},'degRad',function(){return this.degRad=Math.PI / 180;},'_tempMatrix',function(){return this._tempMatrix=new Matrix();}
	]);
	return IkConstraint;
})()


/**
*@private
*/

//class laya.ani.bone.Bone
var Bone=(function(){
	function Bone(){
		this.name=null;
		this.root=null;
		this.parentBone=null;
		this.length=10;
		this.transform=null;
		this.inheritScale=true;
		this.inheritRotation=true;
		this.rotation=NaN;
		this.resultRotation=NaN;
		this.d=-1;
		this._tempMatrix=null;
		this._sprite=null;
		this.resultTransform=new Transform();
		this.resultMatrix=new Matrix();
		this._children=[];
	}

	__class(Bone,'laya.ani.bone.Bone');
	var __proto=Bone.prototype;
	__proto.setTempMatrix=function(matrix){
		this._tempMatrix=matrix;
		var i=0,n=0;
		var tBone;
		for (i=0,n=this._children.length;i < n;i++){
			tBone=this._children[i];
			tBone.setTempMatrix(this._tempMatrix);
		}
	}

	//TODO:coverage
	__proto.update=function(pMatrix){
		this.rotation=this.transform.skX;
		var tResultMatrix;
		if (pMatrix){
			tResultMatrix=this.resultTransform.getMatrix();
			Matrix.mul(tResultMatrix,pMatrix,this.resultMatrix);
			this.resultRotation=this.rotation;
		}
		else {
			this.resultRotation=this.rotation+this.parentBone.resultRotation;
			if (this.parentBone){
				if (this.inheritRotation && this.inheritScale){
					tResultMatrix=this.resultTransform.getMatrix();
					Matrix.mul(tResultMatrix,this.parentBone.resultMatrix,this.resultMatrix);
				}
				else {
					var temp=0;
					var parent=this.parentBone;
					var tAngle=NaN;
					var cos=NaN;
					var sin=NaN;
					var tParentMatrix=this.parentBone.resultMatrix;
					tResultMatrix=this.resultTransform.getMatrix();
					var worldX=tParentMatrix.a *tResultMatrix.tx+tParentMatrix.c *tResultMatrix.ty+tParentMatrix.tx;
					var worldY=tParentMatrix.b *tResultMatrix.tx+tParentMatrix.d *tResultMatrix.ty+tParentMatrix.ty;
					var tTestMatrix=new Matrix();
					if (this.inheritRotation){
						tAngle=Math.atan2(parent.resultMatrix.b,parent.resultMatrix.a);
						cos=Math.cos(tAngle),sin=Math.sin(tAngle);
						tTestMatrix.setTo(cos,sin,-sin,cos,0,0);
						Matrix.mul(this._tempMatrix,tTestMatrix,Matrix.TEMP);
						Matrix.TEMP.copyTo(tTestMatrix);
						tResultMatrix=this.resultTransform.getMatrix();
						Matrix.mul(tResultMatrix,tTestMatrix,this.resultMatrix);
						if (this.resultTransform.scX *this.resultTransform.scY < 0){
							this.resultMatrix.rotate(Math.PI*0.5);
						}
						this.resultMatrix.tx=worldX;
						this.resultMatrix.ty=worldY;
					}
					else if (this.inheritScale){
						tResultMatrix=this.resultTransform.getMatrix();
						Matrix.TEMP.identity();
						Matrix.TEMP.d=this.d;
						Matrix.mul(tResultMatrix,Matrix.TEMP,this.resultMatrix);
						this.resultMatrix.tx=worldX;
						this.resultMatrix.ty=worldY;
					}
					else {
						tResultMatrix=this.resultTransform.getMatrix();
						Matrix.TEMP.identity();
						Matrix.TEMP.d=this.d;
						Matrix.mul(tResultMatrix,Matrix.TEMP,this.resultMatrix);
						this.resultMatrix.tx=worldX;
						this.resultMatrix.ty=worldY;
					}
				}
			}
			else {
				tResultMatrix=this.resultTransform.getMatrix();
				tResultMatrix.copyTo(this.resultMatrix);
			}
		};
		var i=0,n=0;
		var tBone;
		for (i=0,n=this._children.length;i < n;i++){
			tBone=this._children[i];
			tBone.update();
		}
	}

	//TODO:coverage
	__proto.updateChild=function(){
		var i=0,n=0;
		var tBone;
		for (i=0,n=this._children.length;i < n;i++){
			tBone=this._children[i];
			tBone.update();
		}
	}

	//TODO:coverage
	__proto.setRotation=function(rd){
		if (this._sprite){
			this._sprite.rotation=rd *180 / Math.PI;
		}
	}

	//TODO:coverage
	__proto.updateDraw=function(x,y){
		if (!Bone.ShowBones || Bone.ShowBones[this.name]){
			if (this._sprite){
				this._sprite.x=x+this.resultMatrix.tx;
				this._sprite.y=y+this.resultMatrix.ty;
			}
			else {
				this._sprite=new Sprite();
				this._sprite.graphics.drawCircle(0,0,5,"#ff0000");
				this._sprite.graphics.drawLine(0,0,this.length,0,"#00ff00");
				this._sprite.graphics.fillText(this.name,0,0,"20px Arial","#00ff00","center");
				Laya.stage.addChild(this._sprite);
				this._sprite.x=x+this.resultMatrix.tx;
				this._sprite.y=y+this.resultMatrix.ty;
			}
		};
		var i=0,n=0;
		var tBone;
		for (i=0,n=this._children.length;i < n;i++){
			tBone=this._children[i];
			tBone.updateDraw(x,y);
		}
	}

	__proto.addChild=function(bone){
		this._children.push(bone);
		bone.parentBone=this;
	}

	//TODO:coverage
	__proto.findBone=function(boneName){
		if (this.name==boneName){
			return this;
		}
		else {
			var i=0,n=0;
			var tBone;
			var tResult;
			for (i=0,n=this._children.length;i < n;i++){
				tBone=this._children[i];
				tResult=tBone.findBone(boneName);
				if (tResult){
					return tResult;
				}
			}
		}
		return null;
	}

	//TODO:coverage
	__proto.localToWorld=function(local){
		var localX=local[0];
		var localY=local[1];
		local[0]=localX *this.resultMatrix.a+localY *this.resultMatrix.c+this.resultMatrix.tx;
		local[1]=localX *this.resultMatrix.b+localY *this.resultMatrix.d+this.resultMatrix.ty;
	}

	Bone.ShowBones={};
	return Bone;
})()


/**
*<code>AnimationPlayer</code> 类用于动画播放器。
*/

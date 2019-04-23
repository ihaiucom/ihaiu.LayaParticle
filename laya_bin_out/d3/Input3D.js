/**
*<code>Input3D</code> 类用于实现3D输入。
*/
//class laya.d3.Input3D
var Input3D=(function(){
	function Input3D(){
		/**@private */
		this._scene=null;
		/**@private */
		this._eventList=[];
		/**@private */
		this._multiTouchEnabled=true;
		this._mouseTouch=new MouseTouch();
		this._touchPool=[];
		this._touches=new SimpleSingletonList();
	}

	__class(Input3D,'laya.d3.Input3D');
	var __proto=Input3D.prototype;
	/**
	*@private
	*/
	__proto.__init__=function(canvas,scene){
		this._scene=scene;
		var list=this._eventList;
		canvas.oncontextmenu=function (e){
			return false;
		}
		canvas.addEventListener('mousedown',function(e){
			e.preventDefault();
			list.push(e);
		});
		canvas.addEventListener('mouseup',function(e){
			e.preventDefault();
			list.push(e);
		},true);
		canvas.addEventListener('mousemove',function(e){
			e.preventDefault();
			list.push(e);
		},true);
		canvas.addEventListener("touchstart",function(e){
			e.preventDefault();
			list.push(e);
		});
		canvas.addEventListener("touchend",function(e){
			e.preventDefault();
			list.push(e);
		},true);
		canvas.addEventListener("touchmove",function(e){
			e.preventDefault();
			list.push(e);
		},true);
		canvas.addEventListener("touchcancel",function(e){
			list.push(e);
		},true);
	}

	/**
	*获取触摸点个数。
	*@return 触摸点个数。
	*/
	__proto.touchCount=function(){
		return this._touches.length;
	}

	/**
	*@private
	*/
	__proto._getTouch=function(touchID){
		var touch=this._touchPool[touchID];
		if (!touch){
			touch=new Touch();
			this._touchPool[touchID]=touch;
			touch._identifier=touchID;
		}
		return touch;
	}

	/**
	*@private
	*/
	__proto._mouseTouchDown=function(){
		var touch=this._mouseTouch;
		var sprite=touch.sprite;
		touch._pressedSprite=sprite;
		touch._pressedLoopCount=Stat.loopCount;
		if (sprite){
			var scripts=sprite._scripts;
			if (scripts){
				for (var i=0,n=scripts.length;i < n;i++)
				scripts[i].onMouseDown();
			}
		}
	}

	/**
	*@private
	*/
	__proto._mouseTouchUp=function(){
		var i=0,n=0;
		var touch=this._mouseTouch;
		var lastPressedSprite=touch._pressedSprite;
		touch._pressedSprite=null;
		touch._pressedLoopCount=-1;
		var sprite=touch.sprite;
		if (sprite){
			if (sprite===lastPressedSprite){
				var scripts=sprite._scripts;
				if (scripts){
					for (i=0,n=scripts.length;i < n;i++)
					scripts[i].onMouseClick();
				}
			}
		}
		if (lastPressedSprite){
			var lastScripts=lastPressedSprite._scripts;
			if (lastScripts){
				for (i=0,n=lastScripts.length;i < n;i++)
				lastScripts[i].onMouseUp();
			}
		}
	}

	/**
	*@private
	*/
	__proto._mouseTouchRayCast=function(cameras){
		var touchHitResult=Input3D._tempHitResult0;
		var touchPos=Input3D._tempVector20;
		var touchRay=Input3D._tempRay0;
		touchHitResult.succeeded=false;
		var x=this._mouseTouch.mousePositionX;
		var y=this._mouseTouch.mousePositionY;
		var touchPosE=touchPos.elements;
		touchPosE[0]=x;
		touchPosE[1]=y;
		for (var i=cameras.length-1;i >=0;i--){
			var camera=cameras [i];
			var viewport=camera.viewport;
			if (touchPos.x >=viewport.x && touchPos.y >=viewport.y && touchPos.x <=viewport.width && touchPos.y <=viewport.height){
				camera.viewportPointToRay(touchPos,touchRay);
				var sucess=this._scene._physicsSimulation.rayCast(touchRay,touchHitResult);
				if (sucess || (camera.clearFlag===/*laya.d3.core.BaseCamera.CLEARFLAG_SOLIDCOLOR*/0 || camera.clearFlag===/*laya.d3.core.BaseCamera.CLEARFLAG_SKY*/1))
					break ;
			}
		};
		var touch=this._mouseTouch;
		var lastSprite=touch.sprite;
		if (touchHitResult.succeeded){
			var touchSprite=touchHitResult.collider.owner;
			touch.sprite=touchSprite;
			var scripts=touchSprite._scripts;
			if (lastSprite!==touchSprite){
				if (scripts){
					for (var j=0,m=scripts.length;j < m;j++)
					scripts[j].onMouseEnter();
				}
			}
			}else {
			touch.sprite=null;
		}
		if (lastSprite && (lastSprite!==touchSprite)){
			var outScripts=lastSprite._scripts;
			if (outScripts){
				for (j=0,m=outScripts.length;j < m;j++)
				outScripts[j].onMouseOut();
			}
		}
	}

	/**
	*@private
	*@param flag 0:add、1:remove、2:change
	*/
	__proto._changeTouches=function(changedTouches,flag){
		var offsetX=0,offsetY=0;
		var lastCount=this._touches.length;
		for (var j=0,m=changedTouches.length;j < m;j++){
			var nativeTouch=changedTouches[j];
			var identifier=nativeTouch.identifier;
			if (!this._multiTouchEnabled && identifier!==0)
				continue ;
			var touch=this._getTouch(identifier);
			var posE=touch._position.elements;
			var mousePoint=Input3D._tempPoint;
			mousePoint.setTo(nativeTouch.pageX,nativeTouch.pageY);
			Laya.stage._canvasTransform.invertTransformPoint(mousePoint);
			var posX=mousePoint.x;
			var posY=mousePoint.y;
			switch (flag){
				case 0:
					this._touches.add(touch);
					offsetX+=posX;
					offsetY+=posY;
					break ;
				case 1:
					this._touches.remove(touch);
					offsetX-=posX;
					offsetY-=posY;
					break ;
				case 2:
					offsetX=posX-posE[0];
					offsetY=posY-posE[1];
					break ;
				}
			posE[0]=posX;
			posE[1]=posY;
		};
		var touchCount=this._touches.length;
		if (touchCount===0){
			this._mouseTouch.mousePositionX=0;
			this._mouseTouch.mousePositionY=0;
			}else {
			this._mouseTouch.mousePositionX=(this._mouseTouch.mousePositionX *lastCount+offsetX)/ touchCount;
			this._mouseTouch.mousePositionY=(this._mouseTouch.mousePositionY *lastCount+offsetY)/ touchCount;
		}
	}

	/**
	*@private
	*/
	__proto._update=function(){
		var i=0,n=0,j=0,m=0;
		n=this._eventList.length;
		var cameras=this._scene._cameraPool;
		if (n > 0){
			for (i=0;i < n;i++){
				var e=this._eventList[i];
				switch (e.type){
					case "mousedown":
						this._mouseTouchDown();
						break ;
					case "mouseup":
						this._mouseTouchUp();
						break ;
					case "mousemove":;
						var mousePoint=Input3D._tempPoint;
						mousePoint.setTo(e.pageX,e.pageY);
						Laya.stage._canvasTransform.invertTransformPoint(mousePoint);
						this._mouseTouch.mousePositionX=mousePoint.x;
						this._mouseTouch.mousePositionY=mousePoint.y;
						this._mouseTouchRayCast(cameras);
						break ;
					case "touchstart":;
						var lastLength=this._touches.length;
						this._changeTouches(e.changedTouches,0);
						this._mouseTouchRayCast(cameras);
						(lastLength===0)&& (this._mouseTouchDown());
						break ;
					case "touchend":
					case "touchcancel":
						this._changeTouches(e.changedTouches,1);
						(this._touches.length===0)&& (this._mouseTouchUp());
						break ;
					case "touchmove":
						this._changeTouches(e.changedTouches,2);
						this._mouseTouchRayCast(cameras);
						break ;
					default :
						throw "Input3D:unkonwn event type.";
					}
			}
			this._eventList.length=0;
		};
		var mouseTouch=this._mouseTouch;
		var pressedSprite=mouseTouch._pressedSprite;
		if (pressedSprite && (Stat.loopCount > mouseTouch._pressedLoopCount)){
			var pressedScripts=pressedSprite._scripts;
			if (pressedScripts){
				for (j=0,m=pressedScripts.length;j < m;j++)
				pressedScripts[j].onMouseDrag();
			}
		};
		var touchSprite=mouseTouch.sprite;
		if (touchSprite){
			var scripts=touchSprite._scripts;
			if (scripts){
				for (j=0,m=scripts.length;j < m;j++)
				scripts[j].onMouseOver();
			}
		}
	}

	/**
	*获取触摸点。
	*@param index 索引。
	*@return 触摸点。
	*/
	__proto.getTouch=function(index){
		if (index < this._touches.length){
			return this._touches.elements [index];
			}else {
			return null;
		}
	}

	/**
	*设置是否可以使用多点触摸。
	*@param 是否可以使用多点触摸。
	*/
	/**
	*获取是否可以使用多点触摸。
	*@return 是否可以使用多点触摸。
	*/
	__getset(0,__proto,'multiTouchEnabled',function(){
		return this._multiTouchEnabled;
		},function(value){
		this._multiTouchEnabled=value;
	});

	__static(Input3D,
	['_tempPoint',function(){return this._tempPoint=new Point();},'_tempVector20',function(){return this._tempVector20=new Vector2();},'_tempRay0',function(){return this._tempRay0=new Ray(new Vector3(),new Vector3());},'_tempHitResult0',function(){return this._tempHitResult0=new HitResult();}
	]);
	return Input3D;
})()


/**

*/
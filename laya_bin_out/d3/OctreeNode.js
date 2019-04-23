/**
*<code>/**
*<code>RenderElement</code> 类用于实现渲染元素。
*/
//class laya.d3.core.render.RenderElement
var RenderElement=(function(){
	function RenderElement(){
		/**@private */
		//this._transform=null;
		/**@private */
		//this._geometry=null;
		/**@private */
		//this.material=null;
		/**@private */
		//this.render=null;
		/**@private */
		//this.staticBatch=null;
	}

	__class(RenderElement,'laya.d3.core.render.RenderElement');
	var __proto=RenderElement.prototype;
	/**
	*@private
	*/
	__proto.setTransform=function(transform){
		this._transform=transform;
	}

	/**
	*@private
	*/
	__proto.setGeometry=function(geometry){
		this._geometry=geometry;
	}

	/**
	*@private
	*/
	__proto.addToOpaqueRenderQueue=function(context,queue){
		queue.elements.push(this);
	}

	/**
	*@private
	*/
	__proto.addToTransparentRenderQueue=function(context,queue){
		queue.elements.push(this);
		queue.lastTransparentBatched=false;
		queue.lastTransparentRenderElement=this;
	}

	/**
	*@private
	*/
	__proto.destroy=function(){
		this._transform=null;
		this._geometry=null;
		this.material=null;
		this.render=null;
	}

	return RenderElement;
})()


/**
*类用于八叉树节点。
*/
//class laya.d3.core.scene.OctreeNode
var OctreeNode=(function(){
	function OctreeNode(scene,depth){
		/**@private */
		this._exactBox=null;
		/**@private */
		this._relaxBox=null;
		/**@private */
		this._scene=null;
		/**@private */
		this._parent=null;
		/**@private */
		this._depth=0;
		this._boundingSphere=new BoundSphere(new Vector3(),0);
		this._corners=/*new vector.<>*/[new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3()];
		this._boundingBoxCenter=new Vector3();
		this._children=__newvec(8);
		this._objects=[];
		this._scene=scene;
		this._depth=depth;
	}

	__class(OctreeNode,'laya.d3.core.scene.OctreeNode');
	var __proto=OctreeNode.prototype;
	/**
	*@private
	*/
	__proto.initRoot=function(center,treeSize){
		var min=new Vector3();
		var max=new Vector3();
		Vector3.scale(treeSize,-0.5,min);
		Vector3.scale(treeSize,0.5,max);
		Vector3.add(min,center,min);
		Vector3.add(max,center,max);
		this.exactBox=new BoundBox(min,max);
		this.relaxBox=new BoundBox(min,max);
	}

	/**
	*@private
	*/
	__proto.addTreeNode=function(render){
		if (CollisionUtils.boxContainsBox(this._relaxBox,render.boundingBox)===/*laya.d3.math.ContainmentType.Contains*/1)
			this.addNodeDown(render,0);
		else
		this.addObject(render);
	}

	/**
	*@private
	*/
	__proto.addChild=function(index){
		var child=this._children[index];
		if (child==null){
			child=new OctreeNode(this._scene,this._depth+1);
			this._children[index]=child;
			child._parent=this;
			Vector3.subtract(this._exactBox.max,this._exactBox.min,OctreeNode._tempSize);
			Vector3.multiply(OctreeNode._tempSize,OctreeNode._octreeSplit[index],OctreeNode._tempCenter);
			Vector3.add(this._exactBox.min,OctreeNode._tempCenter,OctreeNode._tempCenter);
			Vector3.scale(OctreeNode._tempSize,0.25,OctreeNode._tempSize);
			var min=new Vector3();
			var max=new Vector3();
			Vector3.subtract(OctreeNode._tempCenter,OctreeNode._tempSize,min);
			Vector3.add(OctreeNode._tempCenter,OctreeNode._tempSize,max);
			child.exactBox=new BoundBox(min,max);
			Vector3.scale(OctreeNode._tempSize,OctreeNode.relax,OctreeNode._tempSize);
			var relaxMin=new Vector3();
			var relaxMax=new Vector3();
			Vector3.subtract(OctreeNode._tempCenter,OctreeNode._tempSize,relaxMin);
			Vector3.add(OctreeNode._tempCenter,OctreeNode._tempSize,relaxMax);
			child.relaxBox=new BoundBox(relaxMin,relaxMax);
		}
		return child;
	}

	/**
	*@private
	*/
	__proto.addObject=function(object){
		object._treeNode=this;
		this._objects.push(object);
	}

	/**
	*@private
	*/
	__proto.removeObject=function(object){
		if (object._treeNode !=this){
			console.log("OctreeNode::removeObject error");
			return false;
		};
		var index=this._objects.indexOf(object);
		if (index!==-1){
			this._objects.splice(index,1);
			return true;
		}
		return false;
	}

	/**
	*@private
	*/
	__proto.clearObject=function(){
		this._objects.length=0;
	}

	/**
	*@private
	*/
	__proto.addNodeUp=function(render,depth){
		if (this._parent && (CollisionUtils.boxContainsBox(this._exactBox,render.boundingBox)!==/*laya.d3.math.ContainmentType.Contains*/1)){
			this._parent.addNodeUp(render,depth-1);
		}else
		this.addNodeDown(render,depth);
	}

	/**
	*@private
	*/
	__proto.addNodeDown=function(render,depth){
		if (depth < this._scene.treeLevel){
			var childIndex=this.inChildIndex(render.boundingBoxCenter);
			var child=this.addChild(childIndex);
			if (CollisionUtils.boxContainsBox(child._relaxBox,render.boundingBox)===/*laya.d3.math.ContainmentType.Contains*/1){
				child.addNodeDown(render,++depth);
			}else
			this.addObject(render);
			}else {
			this.addObject(render);
		}
	}

	/**
	*@private
	*/
	__proto.inChildIndex=function(objectCenter){
		var z=objectCenter.z < this._boundingBoxCenter.z ? 0 :1;
		var y=objectCenter.y < this._boundingBoxCenter.y ? 0 :1;
		var x=objectCenter.x < this._boundingBoxCenter.x ? 0 :1;
		return z *4+y *2+x;
	}

	/**
	*@private
	*/
	__proto.updateObject=function(render){
		if (CollisionUtils.boxContainsBox(this._relaxBox,render.boundingBox)===/*laya.d3.math.ContainmentType.Contains*/1){
			this.removeObject(render);
			render._treeNode=null;
			this.addNodeDown(render,this._depth);
			}else if (this._parent){
			this.removeObject(render);
			render._treeNode=null;
			this._parent.addNodeUp(render,this._depth-1);
		}
	}

	/**
	*@private
	*/
	__proto.cullingObjects=function(context,boundFrustum,camera,cameraPos,testVisible){
		var i=0,j=0,n=0,m=0;
		for (i=0,n=this._objects.length;i < n;i++){
			var render=this._objects[i];
			if (this._scene.isLayerVisible(render._owner.layer,camera)&& render._enable){
				if (testVisible){
					if (boundFrustum.containsBoundBox(render.boundingBox)===/*laya.d3.math.ContainmentType.Disjoint*/0)
						continue ;
				}
				render._distanceForSort=Vector3.distance(render.boundingSphere.center,cameraPos);
				var elements=render._renderElements;
				for (j=0,m=elements.length;j < m;j++){
					var element=elements[j];
					var renderQueue=this._scene._getRenderQueue(element.material.renderQueue);
					if (renderQueue.isTransparent)
						element.addToTransparentRenderQueue(context,renderQueue);
					else
					element.addToOpaqueRenderQueue(context,renderQueue);
				}
			}
		}
		for (i=0;i < 8;i++){
			var child=this._children[i];
			var testVisibleChild=testVisible;
			if (testVisible){
				var type=boundFrustum.containsBoundBox(child._relaxBox);
				if (type===/*laya.d3.math.ContainmentType.Disjoint*/0)
					continue ;
				testVisibleChild=(type===/*laya.d3.math.ContainmentType.Intersects*/2);
			}
			child.cullingObjects(context,boundFrustum,camera,cameraPos,testVisibleChild);
		}
	}

	/**
	*@private
	*/
	__proto.buildAllChild=function(depth){
		if (depth < this._scene.treeLevel){
			for (var i=0;i < 8;i++){
				var child=this.addChild(i);
				child.buildAllChild(depth+1);
			}
		}
	}

	/**
	*@private
	*/
	__proto._renderBoudingBox=function(line){}
	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'exactBox',function(){
		return this._exactBox;
		},function(value){
		this._exactBox=value;
		Vector3.add(value.min,value.max,this._boundingBoxCenter);
		Vector3.scale(this._boundingBoxCenter,0.5,this._boundingBoxCenter);
	});

	/**
	*@private
	*/
	/**
	*@private
	*/
	__getset(0,__proto,'relaxBox',function(){
		return this._relaxBox;
		},function(value){
		this._relaxBox=value;
		value.getCorners(this._corners);
		BoundSphere.createfromPoints(this._corners,this._boundingSphere);
	});

	OctreeNode.CHILDNUM=8;
	OctreeNode.debugMode=false;
	OctreeNode.relax=1.15;
	__static(OctreeNode,
	['_tempVector0',function(){return this._tempVector0=new Vector3();},'_tempSize',function(){return this._tempSize=new Vector3();},'_tempCenter',function(){return this._tempCenter=new Vector3();},'_octreeSplit',function(){return this._octreeSplit=[new Vector3(0.250,0.250,0.250),new Vector3(0.750,0.250,0.250),new Vector3(0.250,0.750,0.250),new Vector3(0.750,0.750,0.250),new Vector3(0.250,0.250,0.750),new Vector3(0.750,0.250,0.750),new Vector3(0.250,0.750,0.750),new Vector3(0.750,0.750,0.750)];}
	]);
	return OctreeNode;
})()


/**

*/
*/
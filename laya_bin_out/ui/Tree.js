/**
*<code>Tree</code> 控件使用户可以查看排列为可扩展树的层次结构数据。
*
*@example
*package
*{
	*import laya.ui.Tree;
	*import laya.utils.Browser;
	*import laya.utils.Handler;
	*public class Tree_Example
	*{
		*public function Tree_Example()
		*{
			*Laya.init(640,800);
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*Laya.loader.load(["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png","resource/ui/clip_selectBox.png","resource/ui/clip_tree_folder.png","resource/ui/clip_tree_arrow.png"],Handler.create(this,onLoadComplete));
			*}
		*private function onLoadComplete():void
		*{
			*var xmlString:String;//创建一个xml字符串，用于存储树结构数据。
			*xmlString="&lt;root&gt;&lt;item label='box1'&gt;&lt;abc label='child1'/&gt;&lt;abc label='child2'/&gt;&lt;abc label='child3'/&gt;&lt;abc label='child4'/&gt;&lt;abc label='child5'/&gt;&lt;/item&gt;&lt;item label='box2'&gt;&lt;abc label='child1'/&gt;&lt;abc label='child2'/&gt;&lt;abc label='child3'/&gt;&lt;abc label='child4'/&gt;&lt;/item&gt;&lt;/root&gt;";
			*var domParser:*=new Browser.window.DOMParser();//创建一个DOMParser实例domParser。
			*var xml:*=domParser.parseFromString(xmlString,"text/xml");//解析xml字符。
			*var tree:Tree=new Tree();//创建一个 Tree 类的实例对象 tree 。
			*tree.scrollBarSkin="resource/ui/vscroll.png";//设置 tree 的皮肤。
			*tree.itemRender=Item;//设置 tree 的项渲染器。
			*tree.xml=xml;//设置 tree 的树结构数据。
			*tree.x=100;//设置 tree 对象的属性 x 的值，用于控制 tree 对象的显示位置。
			*tree.y=100;//设置 tree 对象的属性 y 的值，用于控制 tree 对象的显示位置。
			*tree.width=200;//设置 tree 的宽度。
			*tree.height=100;//设置 tree 的高度。
			*Laya.stage.addChild(tree);//将 tree 添加到显示列表。
			*}
		*}
	*}
*import laya.ui.Box;
*import laya.ui.Clip;
*import laya.ui.Label;
*class Item extends Box
*{
	*public function Item()
	*{
		*this.name="render";
		*this.right=0;
		*this.left=0;
		*var selectBox:Clip=new Clip("resource/ui/clip_selectBox.png",1,2);
		*selectBox.name="selectBox";
		*selectBox.height=24;
		*selectBox.x=13;
		*selectBox.y=0;
		*selectBox.left=12;
		*addChild(selectBox);
		*var folder:Clip=new Clip("resource/ui/clip_tree_folder.png",1,3);
		*folder.name="folder";
		*folder.x=14;
		*folder.y=4;
		*addChild(folder);
		*var label:Label=new Label("treeItem");
		*label.name="label";
		*label.color="#ffff00";
		*label.width=150;
		*label.height=22;
		*label.x=33;
		*label.y=1;
		*label.left=33;
		*label.right=0;
		*addChild(label);
		*var arrow:Clip=new Clip("resource/ui/clip_tree_arrow.png",1,2);
		*arrow.name="arrow";
		*arrow.x=0;
		*arrow.y=5;
		*addChild(arrow);
		*}
	*}
*@example
*Laya.init(640,800);//设置游戏画布宽高、渲染模式
*Laya.stage.bgColor="#efefef";//设置画布的背景颜色
*var res=["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png","resource/ui/clip_selectBox.png","resource/ui/clip_tree_folder.png","resource/ui/clip_tree_arrow.png"];
*Laya.loader.load(res,new laya.utils.Handler(this,onLoadComplete));
*function onLoadComplete(){
	*var xmlString;//创建一个xml字符串，用于存储树结构数据。
	*xmlString="&lt;root&gt;&lt;item label='box1'&gt;&lt;abc label='child1'/&gt;&lt;abc label='child2'/&gt;&lt;abc label='child3'/&gt;&lt;abc label='child4'/&gt;&lt;abc label='child5'/&gt;&lt;/item&gt;&lt;item label='box2'&gt;&lt;abc label='child1'/&gt;&lt;abc label='child2'/&gt;&lt;abc label='child3'/&gt;&lt;abc label='child4'/&gt;&lt;/item&gt;&lt;/root&gt;";
	*var domParser=new laya.utils.Browser.window.DOMParser();//创建一个DOMParser实例domParser。
	*var xml=domParser.parseFromString(xmlString,"text/xml");//解析xml字符。
	*var tree=new laya.ui.Tree();//创建一个 Tree 类的实例对象 tree 。
	*tree.scrollBarSkin="resource/ui/vscroll.png";//设置 tree 的皮肤。
	*tree.itemRender=mypackage.treeExample.Item;//设置 tree 的项渲染器。
	*tree.xml=xml;//设置 tree 的树结构数据。
	*tree.x=100;//设置 tree 对象的属性 x 的值，用于控制 tree 对象的显示位置。
	*tree.y=100;//设置 tree 对象的属性 y 的值，用于控制 tree 对象的显示位置。
	*tree.width=200;//设置 tree 的宽度。
	*tree.height=100;//设置 tree 的高度。
	*Laya.stage.addChild(tree);//将 tree 添加到显示列表。
	*}
*(function (_super){
	*function Item(){
		*Item.__super.call(this);//初始化父类。
		*this.right=0;
		*this.left=0;
		*var selectBox=new laya.ui.Clip("resource/ui/clip_selectBox.png",1,2);
		*selectBox.name="selectBox";//设置 selectBox 的name 为“selectBox”时，将被识别为树结构的项的背景。2帧：悬停时背景、选中时背景。
		*selectBox.height=24;
		*selectBox.x=13;
		*selectBox.y=0;
		*selectBox.left=12;
		*this.addChild(selectBox);//需要使用this.访问父类的属性或方法。
		*var folder=new laya.ui.Clip("resource/ui/clip_tree_folder.png",1,3);
		*folder.name="folder";//设置 folder 的name 为“folder”时，将被识别为树结构的文件夹开启状态图表。2帧：折叠状态、打开状态。
		*folder.x=14;
		*folder.y=4;
		*this.addChild(folder);
		*var label=new laya.ui.Label("treeItem");
		*label.name="label";//设置 label 的name 为“label”时，此值将用于树结构数据赋值。
		*label.color="#ffff00";
		*label.width=150;
		*label.height=22;
		*label.x=33;
		*label.y=1;
		*label.left=33;
		*label.right=0;
		*this.addChild(label);
		*var arrow=new laya.ui.Clip("resource/ui/clip_tree_arrow.png",1,2);
		*arrow.name="arrow";//设置 arrow 的name 为“arrow”时，将被识别为树结构的文件夹开启状态图表。2帧：折叠状态、打开状态。
		*arrow.x=0;
		*arrow.y=5;
		*this.addChild(arrow);
		*};
	*Laya.class(Item,"mypackage.treeExample.Item",_super);//注册类 Item 。
	*})(laya.ui.Box);
*@example
*import Tree=laya.ui.Tree;
*import Browser=laya.utils.Browser;
*import Handler=laya.utils.Handler;
*class Tree_Example {
	*constructor(){
		*Laya.init(640,800);
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*Laya.loader.load(["resource/ui/vscroll.png","resource/ui/vscroll$bar.png","resource/ui/vscroll$down.png","resource/ui/vscroll$up.png","resource/ui/vscroll$up.png","resource/ui/clip_selectBox.png","resource/ui/clip_tree_folder * . * png","resource/ui/clip_tree_arrow.png"],Handler.create(this,this.onLoadComplete));
		*}
	*private onLoadComplete():void {
		*var xmlString:String;//创建一个xml字符串，用于存储树结构数据。
		*xmlString="&lt;root&gt;&lt;item label='box1'&gt;&lt;abc label='child1'/&gt;&lt;abc label='child2'/&gt;&lt;abc label='child3'/&gt;&lt;abc label='child4'/&gt;&lt;abc label='child5'/&gt;&lt;/item&gt;&lt;item label='box2'&gt;&lt;abc  * label='child1'/&gt;&lt;abc label='child2'/&gt;&lt;abc label='child3'/&gt;&lt;abc label='child4'/&gt;&lt;/item&gt;&lt;/root&gt;";
		*var domParser:any=new Browser.window.DOMParser();//创建一个DOMParser实例domParser。
		*var xml:any=domParser.parseFromString(xmlString,"text/xml");//解析xml字符。
		*var tree:Tree=new Tree();//创建一个 Tree 类的实例对象 tree 。
		*tree.scrollBarSkin="resource/ui/vscroll.png";//设置 tree 的皮肤。
		*tree.itemRender=Item;//设置 tree 的项渲染器。
		*tree.xml=xml;//设置 tree 的树结构数据。
		*tree.x=100;//设置 tree 对象的属性 x 的值，用于控制 tree 对象的显示位置。
		*tree.y=100;//设置 tree 对象的属性 y 的值，用于控制 tree 对象的显示位置。
		*tree.width=200;//设置 tree 的宽度。
		*tree.height=100;//设置 tree 的高度。
		*Laya.stage.addChild(tree);//将 tree 添加到显示列表。
		*}
	*}
*import Box=laya.ui.Box;
*import Clip=laya.ui.Clip;
*import Label=laya.ui.Label;
*class Item extends Box {
	*constructor(){
		*super();
		*this.name="render";
		*this.right=0;
		*this.left=0;
		*var selectBox:Clip=new Clip("resource/ui/clip_selectBox.png",1,2);
		*selectBox.name="selectBox";
		*selectBox.height=24;
		*selectBox.x=13;
		*selectBox.y=0;
		*selectBox.left=12;
		*this.addChild(selectBox);
		*var folder:Clip=new Clip("resource/ui/clip_tree_folder.png",1,3);
		*folder.name="folder";
		*folder.x=14;
		*folder.y=4;
		*this.addChild(folder);
		*var label:Label=new Label("treeItem");
		*label.name="label";
		*label.color="#ffff00";
		*label.width=150;
		*label.height=22;
		*label.x=33;
		*label.y=1;
		*label.left=33;
		*label.right=0;
		*this.addChild(label);
		*var arrow:Clip=new Clip("resource/ui/clip_tree_arrow.png",1,2);
		*arrow.name="arrow";
		*arrow.x=0;
		*arrow.y=5;
		*this.addChild(arrow);
		*}
	*}
*/
//class laya.ui.Tree extends laya.ui.Box
var Tree=(function(_super){
	function Tree(){
		/**@private */
		this._list=null;
		/**@private */
		this._source=null;
		/**@private */
		this._renderHandler=null;
		/**@private */
		this._spaceLeft=10;
		/**@private */
		this._spaceBottom=0;
		/**@private */
		this._keepStatus=true;
		Tree.__super.call(this);
		this.width=this.height=200;
	}

	__class(Tree,'laya.ui.Tree',_super);
	var __proto=Tree.prototype;
	Laya.imps(__proto,{"laya.ui.IRender":true})
	/**@inheritDoc */
	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		laya.ui.UIComponent.prototype.destroy.call(this,destroyChild);
		this._list && this._list.destroy(destroyChild);
		this._list=null;
		this._source=null;
		this._renderHandler=null;
	}

	/**@inheritDoc */
	__proto.createChildren=function(){
		this.addChild(this._list=new List());
		this._list.renderHandler=Handler.create(this,this.renderItem,null,false);
		this._list.repeatX=1;
		this._list.on(/*laya.events.Event.CHANGE*/"change",this,this.onListChange);
	}

	/**
	*@private
	*此对象包含的<code>List</code>实例的<code>Event.CHANGE</code>事件侦听处理函数。
	*/
	__proto.onListChange=function(e){
		this.event(/*laya.events.Event.CHANGE*/"change");
	}

	/**
	*@private
	*获取数据源集合。
	*/
	__proto.getArray=function(){
		var arr=[];
		var item;
		/*for each*/for(var $each_item in this._source){
			item=this._source[$each_item];
			if (this.getParentOpenStatus(item)){
				item.x=this._spaceLeft *this.getDepth(item);
				arr.push(item);
			}
		}
		return arr;
	}

	/**
	*@private
	*获取项对象的深度。
	*/
	__proto.getDepth=function(item,num){
		(num===void 0)&& (num=0);
		if (item.nodeParent==null)return num;
		else return this.getDepth(item.nodeParent,num+1);
	}

	/**
	*@private
	*获取项对象的上一级的打开状态。
	*/
	__proto.getParentOpenStatus=function(item){
		var parent=item.nodeParent;
		if (parent==null){
			return true;
			}else {
			if (parent.isOpen){
				if (parent.nodeParent !=null)return this.getParentOpenStatus(parent);
				else return true;
				}else {
				return false;
			}
		}
	}

	/**
	*@private
	*渲染一个项对象。
	*@param cell 一个项对象。
	*@param index 项的索引。
	*/
	__proto.renderItem=function(cell,index){
		var item=cell.dataSource;
		if (item){
			cell.left=item.x;
			var arrow=cell.getChildByName("arrow");
			if (arrow){
				if (item.hasChild){
					arrow.visible=true;
					arrow.index=item.isOpen ? 1 :0;
					arrow.tag=index;
					arrow.off(/*laya.events.Event.CLICK*/"click",this,this.onArrowClick);
					arrow.on(/*laya.events.Event.CLICK*/"click",this,this.onArrowClick);
					}else {
					arrow.visible=false;
				}
			};
			var folder=cell.getChildByName("folder");
			if (folder){
				if (folder.clipY==2){
					folder.index=item.isDirectory ? 0 :1;
					}else {
					folder.index=item.isDirectory ? item.isOpen ? 1 :0 :2;
				}
			}
			this._renderHandler && this._renderHandler.runWith([cell,index]);
		}
	}

	/**
	*@private
	*/
	__proto.onArrowClick=function(e){
		var arrow=e.currentTarget;
		var index=arrow.tag;
		this._list.array[index].isOpen=!this._list.array[index].isOpen;
		this.event(/*laya.events.Event.OPEN*/"open");
		this._list.array=this.getArray();
	}

	/**
	*设置指定项索引的项对象的打开状态。
	*@param index 项索引。
	*@param isOpen 是否处于打开状态。
	*/
	__proto.setItemState=function(index,isOpen){
		if (!this._list.array[index])return;
		this._list.array[index].isOpen=isOpen;
		this._list.array=this.getArray();
	}

	/**
	*刷新项列表。
	*/
	__proto.fresh=function(){
		this._list.array=this.getArray();
		this.repaint();
	}

	/**
	*@private
	*解析并处理XML类型的数据源。
	*/
	__proto.parseXml=function(xml,source,nodeParent,isRoot){
		var obj;
		var list=xml.childNodes;
		var childCount=list.length;
		if (!isRoot){
			obj={};
			var list2=xml.attributes;
			var attrs;
			/*for each*/for(var $each_attrs in list2){
				attrs=list2[$each_attrs];
				var prop=attrs.nodeName;
				var value=attrs.nodeValue;
				obj[prop]=value=="true" ? true :value=="false" ? false :value;
			}
			obj.nodeParent=nodeParent;
			if (childCount > 0)obj.isDirectory=true;
			obj.hasChild=childCount > 0;
			source.push(obj);
		}
		for (var i=0;i < childCount;i++){
			var node=list[i];
			this.parseXml(node,source,obj,false);
		}
	}

	/**
	*@private
	*处理数据项的打开状态。
	*/
	__proto.parseOpenStatus=function(oldSource,newSource){
		for (var i=0,n=newSource.length;i < n;i++){
			var newItem=newSource[i];
			if (newItem.isDirectory){
				for (var j=0,m=oldSource.length;j < m;j++){
					var oldItem=oldSource[j];
					if (oldItem.isDirectory && this.isSameParent(oldItem,newItem)&& newItem.label==oldItem.label){
						newItem.isOpen=oldItem.isOpen;
						break ;
					}
				}
			}
		}
	}

	/**
	*@private
	*判断两个项对象在树结构中的父节点是否相同。
	*@param item1 项对象。
	*@param item2 项对象。
	*@return 如果父节点相同值为true，否则值为false。
	*/
	__proto.isSameParent=function(item1,item2){
		if (item1.nodeParent==null && item2.nodeParent==null)return true;
		else if (item1.nodeParent==null || item2.nodeParent==null)return false
		else {
			if (item1.nodeParent.label==item2.nodeParent.label)return this.isSameParent(item1.nodeParent,item2.nodeParent);
			else return false;
		}
	}

	/**
	*更新项列表，显示指定键名的数据项。
	*@param key 键名。
	*/
	__proto.filter=function(key){
		if (Boolean(key)){
			var result=[];
			this.getFilterSource(this._source,result,key);
			this._list.array=result;
			}else {
			this._list.array=this.getArray();
		}
	}

	/**
	*@private
	*获取数据源中指定键名的值。
	*/
	__proto.getFilterSource=function(array,result,key){
		key=key.toLocaleLowerCase();
		var item;
		/*for each*/for(var $each_item in array){
			item=array[$each_item];
			if (!item.isDirectory && String(item.label).toLowerCase().indexOf(key)>-1){
				item.x=0;
				result.push(item);
			}
			if (item.child && item.child.length > 0){
				this.getFilterSource(item.child,result,key);
			}
		}
	}

	/**
	*每一项之间的间隔距离（以像素为单位）。
	*/
	__getset(0,__proto,'spaceBottom',function(){
		return this._list.spaceY;
		},function(value){
		this._list.spaceY=value;
	});

	/**
	*数据源发生变化后，是否保持之前打开状态，默认为true。
	*<p><b>取值：</b>
	*<li>true：保持之前打开状态。</li>
	*<li>false：不保持之前打开状态。</li>
	*</p>
	*/
	__getset(0,__proto,'keepStatus',function(){
		return this._keepStatus;
		},function(value){
		this._keepStatus=value;
	});

	/**
	*此对象包含的<code>List</code>实例的单元格渲染器。
	*<p><b>取值：</b>
	*<ol>
	*<li>单元格类对象。</li>
	*<li> UI 的 JSON 描述。</li>
	*</ol></p>
	*/
	__getset(0,__proto,'itemRender',function(){
		return this._list.itemRender;
		},function(value){
		this._list.itemRender=value;
	});

	/**
	*列表数据源，只包含当前可视节点数据。
	*/
	__getset(0,__proto,'array',function(){
		return this._list.array;
		},function(value){
		if (this._keepStatus && this._list.array && value){
			this.parseOpenStatus(this._list.array,value);
		}
		this._source=value;
		this._list.array=this.getArray();
	});

	/**
	*单元格鼠标事件处理器。
	*<p>默认返回参数（e:Event,index:int）。</p>
	*/
	__getset(0,__proto,'mouseHandler',function(){
		return this._list.mouseHandler;
		},function(value){
		this._list.mouseHandler=value;
	});

	/**@inheritDoc */
	__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
		this._dataSource=value;
		Laya.superSet(Box,this,'dataSource',value);
	});

	/**
	*数据源，全部节点数据。
	*/
	__getset(0,__proto,'source',function(){
		return this._source;
	});

	/**滚动条*/
	__getset(0,__proto,'scrollBar',function(){
		return this._list.scrollBar;
	});

	/**
	*此对象包含的<code>List</code>实例对象。
	*/
	__getset(0,__proto,'list',function(){
		return this._list;
	});

	/**
	*滚动条皮肤。
	*/
	__getset(0,__proto,'scrollBarSkin',function(){
		return this._list.vScrollBarSkin;
		},function(value){
		this._list.vScrollBarSkin=value;
	});

	/**
	
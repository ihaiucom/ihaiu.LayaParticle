//class fairygui.Relations
var Relations=(function(){
	function Relations(owner){
		this._owner=null;
		this._items=null;
		this.handling=null;
		this.sizeDirty=false;
		this._owner=owner;
		this._items=[];
	}

	__class(Relations,'fairygui.Relations');
	var __proto=Relations.prototype;
	__proto.add=function(target,relationType,usePercent){
		(usePercent===void 0)&& (usePercent=false);
		var length=this._items.length;
		for (var i=0;i < length;i++){
			var item=this._items[i];
			if (item.target==target){
				item.add(relationType,usePercent);
				return;
			}
		};
		var newItem=new RelationItem(this._owner);
		newItem.target=target;
		newItem.add(relationType,usePercent);
		this._items.push(newItem);
	}

	__proto.remove=function(target,relationType){
		(relationType===void 0)&& (relationType=0);
		var cnt=this._items.length;
		var i=0;
		while (i < cnt){
			var item=this._items[i];
			if (item.target==target){
				item.remove(relationType);
				if (item.isEmpty){
					item.dispose();
					this._items.splice(i,1);
					cnt--;
				}
				else
				i++;
			}
			else
			i++;
		}
	}

	__proto.contains=function(target){
		var length=this._items.length;
		for (var i=0;i < length;i++){
			var item=this._items[i];
			if (item.target==target)
				return true;
		}
		return false;
	}

	__proto.clearFor=function(target){
		var cnt=this._items.length;
		var i=0;
		while (i < cnt){
			var item=this._items[i];
			if (item.target==target){
				item.dispose();
				this._items.splice(i,1);
				cnt--;
			}
			else
			i++;
		}
	}

	__proto.clearAll=function(){
		var length=this._items.length;
		for (var i=0;i < length;i++){
			var item=this._items[i];
			item.dispose();
		}
		this._items.length=0;
	}

	__proto.copyFrom=function(source){
		this.clearAll();
		var arr=source._items;
		var length=arr.length;
		for (var i=0;i < length;i++){
			var ri=arr[i];
			var item=new RelationItem(this._owner);
			item.copyFrom(ri);
			this._items.push(item);
		}
	}

	__proto.dispose=function(){
		this.clearAll();
	}

	__proto.onOwnerSizeChanged=function(dWidth,dHeight,applyPivot){
		if (this._items.length==0)
			return;
		var length=this._items.length;
		for (var i=0;i < length;i++){
			var item=this._items[i];
			item.applyOnSelfResized(dWidth,dHeight,applyPivot);
		}
	}

	__proto.ensureRelationsSizeCorrect=function(){
		if (this._items.length==0)
			return;
		this.sizeDirty=false;
		var length=this._items.length;
		for (var i=0;i < length;i++){
			var item=this._items[i];
			item.target.ensureSizeCorrect();
		}
	}

	__proto.setup=function(buffer,parentToChild){
		var cnt=buffer.readByte();
		var target;
		for (var i=0;i < cnt;i++){
			var targetIndex=buffer.getInt16();
			if (targetIndex==-1)
				target=this._owner.parent;
			else if (parentToChild)
			target=(this._owner).getChildAt(targetIndex);
			else
			target=this._owner.parent.getChildAt(targetIndex);
			var newItem=new RelationItem(this._owner);
			newItem.target=target;
			this._items.push(newItem);
			var cnt2=buffer.readByte();
			for (var j=0;j < cnt2;j++){
				var rt=buffer.readByte();
				var usePercent=buffer.readBool();
				newItem.internalAdd(rt,usePercent);
			}
		}
	}

	__getset(0,__proto,'empty',function(){
		return this._items.length==0;
	});

	return Relations;
})()



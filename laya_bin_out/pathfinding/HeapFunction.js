//class PathFinding.libs.HeapFunction
var HeapFunction=(function(){
	function HeapFunction(){
		//};
		this.defaultCmp=function(x,y){
			if (x < y){
				return-1;
			}
			if (x > y){
				return 1;
			}
			return 0;
		}
	}

	__class(HeapFunction,'PathFinding.libs.HeapFunction');
	var __proto=HeapFunction.prototype;
	//};
	__proto.insort=function(a,x,lo,hi,cmp){
		var mid=NaN;
		if (lo==null){
			lo=0;
		}
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		if (lo < 0){
			throw new Error('lo must be non-negative');
		}
		if (hi==null){
			hi=a.length;
		}
		while (lo < hi){
			mid=Math.floor((lo+hi)/ 2);
			if (cmp(x,a[mid])< 0){
				hi=mid;
			}
			else{
				lo=mid+1;
			}
		}
		return ([].splice.apply(a,[lo,lo-lo].concat(x)),x);
	}

	//};
	__proto.heappush=function(array,item,cmp){
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		array.push(item);
		return this._siftdown(array,0,array.length-1,cmp);
	}

	//};
	__proto.heappop=function(array,cmp){
		var lastelt,returnitem;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		lastelt=array.pop();
		if (array.length){
			returnitem=array[0];
			array[0]=lastelt;
			this._siftup(array,0,cmp);
		}
		else{
			returnitem=lastelt;
		}
		return returnitem;
	}

	//};
	__proto.heapreplace=function(array,item,cmp){
		var returnitem;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		returnitem=array[0];
		array[0]=item;
		this._siftup(array,0,cmp);
		return returnitem;
	}

	//};
	__proto.heappushpop=function(array,item,cmp){
		var _ref;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		if (array.length && cmp(array[0],item)< 0){
			_ref=[array[0],item],item=_ref[0],array[0]=_ref[1];
			this._siftup(array,0,cmp);
		}
		return item;
	}

	//};
	__proto.heapify=function(array,cmp){
		var i=0,_i=0,_j=0,_len=0,_ref,_ref1,_results,_results1;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		_ref1=(function(){
			_results1=[];
			for (_j=0,_ref=Math.floor(array.length / 2);0 <=_ref ? _j < _ref :_j > _ref;0 <=_ref ? _j++:_j--){
				_results1.push(_j);
			}
			return _results1;
		}).apply(this).reverse();
		_results=[];
		for (_i=0,_len=_ref1.length;_i < _len;_i++){
			i=_ref1[_i];
			_results.push(this._siftup(array,i,cmp));
		}
		return _results;
	}

	//};
	__proto.updateItem=function(array,item,cmp){
		var pos=0;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		pos=array.indexOf(item);
		if (pos===-1){
			return null;
		}
		this._siftdown(array,0,pos,cmp);
		return this._siftup(array,pos,cmp);
	}

	//};
	__proto.nlargest=function(array,n,cmp){
		var elem,result,_i=0,_len=0,_ref;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		result=array.slice(0,n);
		if (!result.length){
			return result;
		}
		this.heapify(result,cmp);
		_ref=array.slice(n);
		for (_i=0,_len=_ref.length;_i < _len;_i++){
			elem=_ref[_i];
			this.heappushpop(result,elem,cmp);
		}
		return result.sort(cmp).reverse();
	}

	//};
	__proto.nsmallest=function(array,n,cmp){
		var elem,i,los,result,_i=0,_j=0,_len,_ref,_ref1,_results;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		if (n *10 <=array.length){
			result=array.slice(0,n).sort(cmp);
			if (!result.length){
				return result;
			}
			los=result[result.length-1];
			_ref=array.slice(n);
			for (_i=0,_len=_ref.length;_i < _len;_i++){
				elem=_ref[_i];
				if (cmp(elem,los)< 0){
					this.insort(result,elem,0,null,cmp);
					result.pop();
					los=result[result.length-1];
				}
			}
			return result;
		}
		this.heapify(array,cmp);
		_results=[];
		for (i=_j=0,_ref1=Math.min(n,array.length);0 <=_ref1 ? _j < _ref1 :_j > _ref1;i=0 <=_ref1 ?++_j :--_j){
			_results.push(this.heappop(array,cmp));
		}
		return _results;
	}

	//};
	__proto._siftdown=function(array,startpos,pos,cmp){
		var newitem,parent,parentpos=0;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		newitem=array[pos];
		while (pos > startpos){
			parentpos=(pos-1)>> 1;
			parent=array[parentpos];
			if (cmp(newitem,parent)< 0){
				array[pos]=parent;
				pos=parentpos;
				continue ;
			}
			break ;
		}
		return array[pos]=newitem;
	}

	//};
	__proto._siftup=function(array,pos,cmp){
		var childpos=0,endpos=0,newitem,rightpos=0,startpos=0;
		if (cmp==null){
			cmp=this.defaultCmp;
		}
		endpos=array.length;
		startpos=pos;
		newitem=array[pos];
		childpos=2 *pos+1;
		while (childpos < endpos){
			rightpos=childpos+1;
			if (rightpos < endpos && !(cmp(array[childpos],array[rightpos])< 0)){
				childpos=rightpos;
			}
			array[pos]=array[childpos];
			pos=childpos;
			childpos=2 *pos+1;
		}
		array[pos]=newitem;
		return this._siftdown(array,startpos,pos,cmp);
	}

	return HeapFunction;
})()


/**
*...
*@author ...
*/

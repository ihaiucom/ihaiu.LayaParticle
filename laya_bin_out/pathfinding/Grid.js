//class PathFinding.core.Grid
var Grid=(function(){
	function Grid(width_or_matrix,height,matrix){
		this.width=0;
		this.height=0;
		this.nodes=null;
		var width=0;
		if ((typeof width_or_matrix=='number')){
			width=width_or_matrix;
		}
		else{
			height=width_or_matrix.length;
			width=width_or_matrix[0].length;
			matrix=width_or_matrix;
		}
		this.width=width;
		this.height=height;
		this.nodes=this._buildNodes(width,height,matrix);
	}

	__class(Grid,'PathFinding.core.Grid');
	var __proto=Grid.prototype;
	/**
	*Build and return the nodes.
	*@private
	*@param {number}width
	*@param {number}height
	*@param {Array<Array<number|boolean>>}[matrix]-A 0-1 matrix representing
	*the walkable status of the nodes.
	*@see Grid
	*/
	__proto._buildNodes=function(width,height,matrix){
		var i=0,j=0,nodes=[];
		for (i=0;i < height;++i){
			nodes[i]=[];
			for (j=0;j < width;++j){
				nodes[i][j]=new Node$1(j,i);
			}
		}
		if (matrix==null){
			return nodes;
		}
		if (matrix.length !=height || matrix[0].length !=width){
			throw new Error('Matrix size does not fit');
		}
		for (i=0;i < height;++i){
			for (j=0;j < width;++j){
				if (matrix[i][j]){
					nodes[i][j].walkable=false;
				}
			}
		}
		return nodes;
	}

	__proto.getNodeAt=function(x,y){
		return this.nodes[y][x];
	}

	/**
	*Determine whether the node at the given position is walkable.
	*(Also returns false if the position is outside the grid.)
	*@param {number}x-The x coordinate of the node.
	*@param {number}y-The y coordinate of the node.
	*@return {boolean}-The walkability of the node.
	*/
	__proto.isWalkableAt=function(x,y){
		return this.isInside(x,y)&& this.nodes[y][x].walkable;
	}

	/**
	*Determine whether the position is inside the grid.
	*XXX:`grid.isInside(x,y)` is wierd to read.
	*It should be `(x,y)is inside grid`,but I failed to find a better
	*name for this method.
	*@param {number}x
	*@param {number}y
	*@return {boolean}
	*/
	__proto.isInside=function(x,y){
		return (x >=0 && x < this.width)&& (y >=0 && y < this.height);
	}

	/**
	*Set whether the node on the given position is walkable.
	*NOTE:throws exception if the coordinate is not inside the grid.
	*@param {number}x-The x coordinate of the node.
	*@param {number}y-The y coordinate of the node.
	*@param {boolean}walkable-Whether the position is walkable.
	*/
	__proto.setWalkableAt=function(x,y,walkable){
		this.nodes[y][x].walkable=walkable;
	}

	/**
	*Get the neighbors of the given node.
	*
	*offsets diagonalOffsets:
	*+---+---+---++---+---+---+
	*| | 0 | | | 0 | | 1 |
	*+---+---+---++---+---+---+
	*| 3 | | 1 | | | | |
	*+---+---+---++---+---+---+
	*| | 2 | | | 3 | | 2 |
	*+---+---+---++---+---+---+
	*
	*When allowDiagonal is true,if offsets[i] is valid,then
	*diagonalOffsets[i] and
	*diagonalOffsets[(i+1)% 4] is valid.
	*@param {Node}node
	*@param {diagonalMovement}diagonalMovement
	*/
	__proto.getNeighbors=function(node,diagonalMovement){
		var x=node.x,y=node.y,neighbors=[],s0=false,d0=false,s1=false,d1=false,s2=false,d2=false,s3=false,d3=false,nodes=this.nodes;
		if (this.isWalkableAt(x,y-1)){
			neighbors.push(nodes[y-1][x]);
			s0=true;
		}
		if (this.isWalkableAt(x+1,y)){
			neighbors.push(nodes[y][x+1]);
			s1=true;
		}
		if (this.isWalkableAt(x,y+1)){
			neighbors.push(nodes[y+1][x]);
			s2=true;
		}
		if (this.isWalkableAt(x-1,y)){
			neighbors.push(nodes[y][x-1]);
			s3=true;
		}
		if (diagonalMovement==DiagonalMovement.Never){
			return neighbors;
		}
		if (diagonalMovement==DiagonalMovement.OnlyWhenNoObstacles){
			d0=s3 && s0;
			d1=s0 && s1;
			d2=s1 && s2;
			d3=s2 && s3;
		}
		else if (diagonalMovement==DiagonalMovement.IfAtMostOneObstacle){
			d0=s3 || s0;
			d1=s0 || s1;
			d2=s1 || s2;
			d3=s2 || s3;
		}
		else if (diagonalMovement==DiagonalMovement.Always){
			d0=true;
			d1=true;
			d2=true;
			d3=true;
		}
		else{
			throw new Error('Incorrect value of diagonalMovement');
		}
		if (d0 && this.isWalkableAt(x-1,y-1)){
			neighbors.push(nodes[y-1][x-1]);
		}
		if (d1 && this.isWalkableAt(x+1,y-1)){
			neighbors.push(nodes[y-1][x+1]);
		}
		if (d2 && this.isWalkableAt(x+1,y+1)){
			neighbors.push(nodes[y+1][x+1]);
		}
		if (d3 && this.isWalkableAt(x-1,y+1)){
			neighbors.push(nodes[y+1][x-1]);
		}
		return neighbors;
	}

	/**
	*Get a clone of this grid.
	*@return {Grid}Cloned grid.
	*/
	__proto.clone=function(){
		var i=0,j=0,
		width=this.width,height=this.height,thisNodes=this.nodes,
		newGrid=new Grid(width,height),newNodes=[];
		for (i=0;i < height;++i){
			newNodes[i]=[];
			for (j=0;j < width;++j){
				newNodes[i][j]=new Node$1(j,i,thisNodes[i][j].walkable);
			}
		}
		newGrid.nodes=newNodes;
		return newGrid;
	}

	__proto.reset=function(){
		var _node;
		for (var i=0;i < this.height;++i){
			for (var j=0;j < this.width;++j){
				_node=this.nodes[i][j];
				_node.g=0;
				_node.f=0;
				_node.h=0;
				_node.by=0;
				_node.parent=null;
				_node.opened=null;
				_node.closed=null;
				_node.tested=null;
			}
		}
	}

	Grid.createGridFromAStarMap=function(texture){
		var textureWidth=texture.width;
		var textureHeight=texture.height;
		var pixelsInfo=texture.getPixels();
		var aStarArr=[];
		var index=0;
		for (var w=0;w < textureWidth;w++){
			var colaStarArr=aStarArr[w]=[];
			for (var h=0;h < textureHeight;h++){
				var r=pixelsInfo[index++];
				var g=pixelsInfo[index++];
				var b=pixelsInfo[index++];
				var a=pixelsInfo[index++];
				if (r==255 && g==255 && b==255 && a==255)
					colaStarArr[h]=1;
				else {
					colaStarArr[h]=0;
				}
			}
		};
		var gird=new Grid(textureWidth,textureHeight,aStarArr);
		return gird;
	}

	return Grid;
})()


/**
*...
*@author dongketao
*/

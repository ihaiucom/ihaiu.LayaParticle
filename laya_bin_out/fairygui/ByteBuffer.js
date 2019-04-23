//class fairygui.utils.ByteBuffer extends laya.utils.Byte
var ByteBuffer=(function(_super){
	function ByteBuffer(data,offset,length){
		this.stringTable=null;
		this.version=0;
		(offset===void 0)&& (offset=0);
		(length===void 0)&& (length=-1);
		if(length==-1)
			length=data.byteLength-offset;
		if(offset==0 && length==data.byteLength)
			ByteBuffer.__super.call(this,data);
		else{
			this._u8d_=new Uint8Array(data,offset,length);
			this._d_=new DataView(this._u8d_.buffer,offset,length);
			this._length=length;
		}
		this.endian="bigEndian";
	}

	__class(ByteBuffer,'fairygui.utils.ByteBuffer',_super);
	var __proto=ByteBuffer.prototype;
	__proto.skip=function(count){
		this.pos+=count;
	}

	__proto.readBool=function(){
		return this.getUint8()==1;
	}

	__proto.readS=function(){
		var index=this.getUint16();
		if (index==65534)
			return null;
		else if (index==65533)
		return ""
		else
		return this.stringTable[index];
	}

	__proto.writeS=function(value){
		var index=this.getUint16();
		if (index !=65534 && index !=65533)
			this.stringTable[index]=value;
	}

	__proto.readColor=function(hasAlpha){
		(hasAlpha===void 0)&& (hasAlpha=false);
		var r=this.getUint8();
		var g=this.getUint8();
		var b=this.getUint8();
		var a=this.getUint8();
		return (hasAlpha?(a<<24):0)+(r<<16)+(g<<8)+b;
	}

	__proto.readColorS=function(hasAlpha){
		(hasAlpha===void 0)&& (hasAlpha=false);
		var r=this.getUint8();
		var g=this.getUint8();
		var b=this.getUint8();
		var a=this.getUint8();
		if(hasAlpha && a!=255)
			return "rgba("+r+","+g+","+b+","+(a/255)+")";
		else{
			var sr=r.toString(16);
			var sg=g.toString(16);
			var sb=b.toString(16);
			if (sr.length==1)
				sr="0"+sr;
			if (sg.length==1)
				sg="0"+sg;
			if (sb.length==1)
				sb="0"+sb;
			return "#"+sr+sg+sb;
		}
	}

	__proto.readChar=function(){
		var i=this.getUint16();
		return String.fromCharCode(i);
	}

	__proto.readBuffer=function(){
		var count=this.getUint32();
		var ba=new ByteBuffer(this.buffer,this._pos_,count);
		ba.stringTable=this.stringTable;
		ba.version=this.version;
		return ba;
	}

	__proto.seek=function(indexTablePos,blockIndex){
		var tmp=this._pos_;
		this.pos=indexTablePos;
		var segCount=this.getUint8();
		if (blockIndex < segCount){
			var useShort=this.getUint8()==1;
			var newPos=0;
			if (useShort){
				this.pos+=2 *blockIndex;
				newPos=this.getUint16();
			}
			else{
				this.pos+=4 *blockIndex;
				newPos=this.getUint32();
			}
			if (newPos > 0){
				this.pos=indexTablePos+newPos;
				return true;
			}
			else{
				this.pos=tmp;
				return false;
			}
		}
		else{
			this.pos=tmp;
			return false;
		}
	}

	return ByteBuffer;
})(Byte)



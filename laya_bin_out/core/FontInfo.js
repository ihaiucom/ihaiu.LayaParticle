/**
*<code>LITTLE_ENDIAN</code> ：小端字节序，地址低位存储值的低位，地址高位存储值的高位。</p>
	*/
	__getset(0,__proto,'endian',function(){
		return this._xd_ ? "littleEndian" :"bigEndian";
		},function(value){
		this._xd_=(value==="littleEndian");
	});

	/**
	*<p> <code>Byte</code> 对象的长度（以字节为单位）。</p>
	*<p>如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧；如果将长度设置为小于当前长度的值，将会截断该字节数组。</p>
	*<p>如果要设置的长度大于当前已分配的内存空间的字节长度，则重新分配内存空间，大小为以下两者较大者：要设置的长度、当前已分配的长度的2倍，并将原有数据拷贝到新的内存空间中；如果要设置的长度小于当前已分配的内存空间的字节长度，也会重新分配内存空间，大小为要设置的长度，并将原有数据从头截断为要设置的长度存入新的内存空间中。</p>
	*/
	__getset(0,__proto,'length',function(){
		return this._length;
		},function(value){
		if (this._allocated_ < value)this._resizeBuffer(this._allocated_=Math.floor(Math.max(value,this._allocated_ *2)));
		else if (this._allocated_ > value)this._resizeBuffer(this._allocated_=value);
		this._length=value;
	});

	/**
	*移动或返回 Byte 对象的读写指针的当前位置（以字节为单位）。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
	*/
	__getset(0,__proto,'pos',function(){
		return this._pos_;
		},function(value){
		this._pos_=value;
	});

	/**
	*可从字节流的当前位置到末尾读取的数据的字节数。
	*/
	__getset(0,__proto,'bytesAvailable',function(){
		return this._length-this._pos_;
	});

	Byte.getSystemEndian=function(){
		if (!Byte._sysEndian){
			var buffer=new ArrayBuffer(2);
			new DataView(buffer).setInt16(0,256,true);
			Byte._sysEndian=(new Int16Array(buffer))[0]===256 ? /*CLASS CONST:laya.utils.Byte.LITTLE_ENDIAN*/"littleEndian" :/*CLASS CONST:laya.utils.Byte.BIG_ENDIAN*/"bigEndian";
		}
		return Byte._sysEndian;
	}

	Byte.BIG_ENDIAN="bigEndian";
	Byte.LITTLE_ENDIAN="littleEndian";
	Byte._sysEndian=null;
	return Byte;
})()


//class laya.utils.FontInfo
var FontInfo=(function(){
	function FontInfo(font){
		//this._id=0;
		this._font="14px Arial";
		this._family="Arial";
		this._size=14;
		this._italic=false;
		this._bold=false;
		this._id=FontInfo._gfontID++;
		this.setFont(font || this._font);
	}

	__class(FontInfo,'laya.utils.FontInfo');
	var __proto=FontInfo.prototype;
	__proto.setFont=function(value){
		this._font=value;
		var _words=value.split(' ');
		var l=_words.length;
		if (l < 2){
			if (l==1){
				if (_words[0].indexOf('px')> 0){
					this._size=parseInt(_words[0]);
				}
			}
			return;
		};
		var szpos=-1;
		for (var i=0;i < l;i++){
			if (_words[i].indexOf('px')> 0 || _words[i].indexOf('pt')> 0){
				szpos=i;
				this._size=parseInt(_words[i]);
				if (this._size <=0){
					console.error('font parse error:'+value);
					this._size=14;
				}
				break ;
			}
		};
		var fpos=szpos+1;
		var familys=_words[fpos];
		fpos++;
		for (;fpos < l;fpos++){
			familys+=' '+_words[fpos];
		}
		this._family=(familys.split(','))[0];
		this._italic=_words.indexOf('italic')>=0;
		this._bold=_words.indexOf('bold')>=0;
	}

	FontInfo.Parse=function(font){
		if (font===FontInfo._lastFont){
			return FontInfo._lastFontInfo;
		};
		var r=FontInfo._cache[font];
		if(!r){
			r=FontInfo._cache[font]=new FontInfo(font);
		}
		FontInfo._lastFont=font;
		FontInfo._lastFontInfo=r;
		return r;
	}

	FontInfo.EMPTY=new FontInfo(null);
	FontInfo._cache={};
	FontInfo._gfontID=0;
	FontInfo._lastFont='';
	FontInfo._lastFontInfo=null;
	return FontInfo;
})()


/**

*/
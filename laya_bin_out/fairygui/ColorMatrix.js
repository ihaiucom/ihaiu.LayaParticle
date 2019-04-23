//class fairygui.utils.ColorMatrix extends Array
var ColorMatrix=(function(_super){
	// initialization:
	function ColorMatrix(){
		ColorMatrix.__super.call(this);
		this.reset();
	}

	__class(ColorMatrix,'fairygui.utils.ColorMatrix',Array);
	var __proto=ColorMatrix.prototype;
	// public methods:
	__proto.reset=function(){
		for (var i=0;i<ColorMatrix.LENGTH;i++){
			this[i]=ColorMatrix.IDENTITY_MATRIX[i];
		}
	}

	__proto.invert=function(){
		this.multiplyMatrix([-1,0,0,0,255,
		0,-1,0,0,255,
		0,0,-1,0,255,
		0,0,0,1,0]);
	}

	__proto.adjustColor=function(p_brightness,p_contrast,p_saturation,p_hue){
		this.adjustHue(p_hue);
		this.adjustContrast(p_contrast);
		this.adjustBrightness(p_brightness);
		this.adjustSaturation(p_saturation);
	}

	__proto.adjustBrightness=function(p_val){
		p_val=this.cleanValue(p_val,1)*255;
		this.multiplyMatrix([
		1,0,0,0,p_val,
		0,1,0,0,p_val,
		0,0,1,0,p_val,
		0,0,0,1,0]);
	}

	__proto.adjustContrast=function(p_val){
		p_val=this.cleanValue(p_val,1);
		var s=p_val+1;
		var o=128 *(1-s);
		this.multiplyMatrix([
		s,0,0,0,o,
		0,s,0,0,o,
		0,0,s,0,o,
		0,0,0,1,0]);
	}

	__proto.adjustSaturation=function(p_val){
		p_val=this.cleanValue(p_val,1);
		p_val+=1;
		var invSat=1-p_val;
		var invLumR=invSat *0.299;
		var invLumG=invSat *0.587;
		var invLumB=invSat *0.114;
		this.multiplyMatrix([
		(invLumR+p_val),invLumG,invLumB,0,0,
		invLumR,(invLumG+p_val),invLumB,0,0,
		invLumR,invLumG,(invLumB+p_val),0,0,
		0,0,0,1,0]);
	}

	__proto.adjustHue=function(p_val){
		p_val=this.cleanValue(p_val,1);
		p_val *=Math.PI;
		var cos=Math.cos(p_val);
		var sin=Math.sin(p_val);
		this.multiplyMatrix([
		((0.299+(cos *(1-0.299)))+(sin *-(0.299))),((0.587+(cos *-(0.587)))+(sin *-(0.587))),((0.114+(cos *-(0.114)))+(sin *(1-0.114))),0,0,
		((0.299+(cos *-(0.299)))+(sin *0.143)),((0.587+(cos *(1-0.587)))+(sin *0.14)),((0.114+(cos *-(0.114)))+(sin *-0.283)),0,0,
		((0.299+(cos *-(0.299)))+(sin *-((1-0.299)))),((0.587+(cos *-(0.587)))+(sin *0.587)),((0.114+(cos *(1-0.114)))+(sin *0.114)),0,0,
		0,0,0,1,0]);
	}

	__proto.concat=function(p_matrix){
		if (p_matrix.length !=ColorMatrix.LENGTH){return;}
			this.multiplyMatrix(p_matrix);
	}

	__proto.clone=function(){
		var result=new ColorMatrix();
		result.copyMatrix(this);
		return result;
	}

	__proto.copyMatrix=function(p_matrix){
		var l=ColorMatrix.LENGTH;
		for (var i=0;i<l;i++){
			this[i]=p_matrix[i];
		}
	}

	__proto.multiplyMatrix=function(p_matrix){
		var col=[];
		var i=0;
		for (var y=0;y<4;++y){
			for (var x=0;x<5;++x){
				col[i+x]=p_matrix[i] *this[x]+
				p_matrix[i+1] *this[x+5]+
				p_matrix[i+2] *this[x+10]+
				p_matrix[i+3] *this[x+15]+
				(x==4 ? p_matrix[i+4] :0);
			}
			i+=5;
		}
		this.copyMatrix(col);
	}

	__proto.cleanValue=function(p_val,p_limit){
		return Math.min(p_limit,Math.max(-p_limit,p_val));
	}

	ColorMatrix.create=function(p_brightness,p_contrast,p_saturation,p_hue){
		var ret=new ColorMatrix();
		ret.adjustColor(p_brightness,p_contrast,p_saturation,p_hue);
		return ret;
	}

	ColorMatrix.LUMA_R=0.299;
	ColorMatrix.LUMA_G=0.587;
	ColorMatrix.LUMA_B=0.114;
	__static(ColorMatrix,
	['IDENTITY_MATRIX',function(){return this.IDENTITY_MATRIX=[
		1,0,0,0,0,
		0,1,0,0,0,
		0,0,1,0,0,
		0,0,0,1,0];},'LENGTH',function(){return this.LENGTH=ColorMatrix.IDENTITY_MATRIX.length;}
	]);
	return ColorMatrix;
})(Array)



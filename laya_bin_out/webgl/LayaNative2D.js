//class laya.layagl.LayaNative2D
var LayaNative2D=(function(){
	function LayaNative2D(){}
	__class(LayaNative2D,'laya.layagl.LayaNative2D');
	LayaNative2D._init_simple_texture_cmdEncoder_=function(){
		LayaNative2D._SIMPLE_TEXTURE_CMDENCODER_=LayaGL.instance.createCommandEncoder(172,32,true);
		LayaNative2D._SIMPLE_TEXTURE_CMDENCODER_.useProgramEx(laya.layagl.LayaNative2D.PROGRAMEX_DRAWTEXTURE);
		LayaNative2D._SIMPLE_TEXTURE_CMDENCODER_.useVDO(laya.layagl.LayaNative2D.VDO_MESHQUADTEXTURE);
		LayaNative2D._SIMPLE_TEXTURE_CMDENCODER_.uniformEx(laya.layagl.LayaNative2D.GLOBALVALUE_VIEWS,0);
		LayaNative2D._SIMPLE_TEXTURE_CMDENCODER_.uniformEx(laya.layagl.LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
		LayaNative2D._SIMPLE_TEXTURE_CMDENCODER_.uniformEx(laya.layagl.LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
		LayaNative2D._SIMPLE_TEXTURE_CMDENCODER_.uniformTextureByParamData(0,1 *4,2 *4);
		LayaNative2D._SIMPLE_TEXTURE_CMDENCODER_.blendFuncByGlobalValue(laya.layagl.LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC,laya.layagl.LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST);
		LayaNative2D._SIMPLE_TEXTURE_CMDENCODER_.setRectMeshByParamData(3 *4,5 *4,4 *4);
		LayaNative2D._SIMPLE_TEXTURE_CMDENCODER_.modifyMesh(laya.layagl.LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
		LayaNative2D._SIMPLE_TEXTURE_CMDENCODER_.modifyMesh(laya.layagl.LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
		LayaGL.syncBufferToRenderThread(LayaNative2D._SIMPLE_TEXTURE_CMDENCODER_);
	}

	LayaNative2D._init_simple_rect_cmdEncoder_=function(){
		LayaNative2D._SIMPLE_RECT_CMDENCODER_=LayaGL.instance.createCommandEncoder(136,32,true);
		LayaNative2D._SIMPLE_RECT_CMDENCODER_.useProgramEx(laya.layagl.LayaNative2D.PROGRAMEX_DRAWTEXTURE);
		LayaNative2D._SIMPLE_RECT_CMDENCODER_.useVDO(laya.layagl.LayaNative2D.VDO_MESHQUADTEXTURE);
		LayaNative2D._SIMPLE_RECT_CMDENCODER_.uniformEx(laya.layagl.LayaNative2D.GLOBALVALUE_VIEWS,0);
		LayaNative2D._SIMPLE_RECT_CMDENCODER_.uniformEx(laya.layagl.LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
		LayaNative2D._SIMPLE_RECT_CMDENCODER_.uniformEx(laya.layagl.LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
		LayaNative2D._SIMPLE_RECT_CMDENCODER_.setRectMeshByParamData(0*4,2 *4,1 *4);
		LayaNative2D._SIMPLE_RECT_CMDENCODER_.modifyMesh(laya.layagl.LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
		LayaNative2D._SIMPLE_RECT_CMDENCODER_.modifyMesh(laya.layagl.LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
		LayaGL.syncBufferToRenderThread(LayaNative2D._SIMPLE_RECT_CMDENCODER_);
	}

	LayaNative2D._init_rect_border_cmdEncoder_=function(){
		LayaNative2D._RECT_BORDER_CMD_ENCODER_=LayaGL.instance.createCommandEncoder(152,32,true);
		LayaNative2D._RECT_BORDER_CMD_ENCODER_.useProgramEx(laya.layagl.LayaNative2D.PROGRAMEX_DRAWVG);
		LayaNative2D._RECT_BORDER_CMD_ENCODER_.useVDO(laya.layagl.LayaNative2D.VDO_MESHVG);
		LayaNative2D._RECT_BORDER_CMD_ENCODER_.uniformEx(laya.layagl.LayaNative2D.GLOBALVALUE_VIEWS,0);
		LayaNative2D._RECT_BORDER_CMD_ENCODER_.uniformEx(laya.layagl.LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR,1);
		LayaNative2D._RECT_BORDER_CMD_ENCODER_.uniformEx(laya.layagl.LayaNative2D.GLOBALVALUE_CLIP_MAT_POS,2);
		LayaNative2D._RECT_BORDER_CMD_ENCODER_.setMeshByParamData(5 *4,0 *4,1 *4,35 *4,2 *4,3 *4,4 *4);
		LayaNative2D._RECT_BORDER_CMD_ENCODER_.modifyMesh(laya.layagl.LayaNative2D.GLOBALVALUE_MATRIX32,0,/*laya.layagl.LayaGL.VALUE_OPERATE_M32_MUL*/7);
		LayaNative2D._RECT_BORDER_CMD_ENCODER_.modifyMesh(laya.layagl.LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR,1,/*laya.layagl.LayaGL.VALUE_OPERATE_BYTE4_COLOR_MUL*/15);
		LayaGL.syncBufferToRenderThread(LayaNative2D._RECT_BORDER_CMD_ENCODER_);
	}

	LayaNative2D.__init__=function(){
		if (Render.isConchApp){
			var layaGL=LayaGL.instance;
			LayaNative2D.GLOBALVALUE_MATRIX32=layaGL.addGlobalValueDefine(0,/*laya.webgl.WebGLContext.FLOAT*/0x1406,6,new Float32Array([1,0,0,1,0,0]));
			LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR=layaGL.addGlobalValueDefine(0,/*laya.webgl.WebGLContext.INT*/0x1404,1,new Uint32Array([0xFFFFFFFF]));
			LayaNative2D.GLOBALVALUE_ITALICDEG=layaGL.addGlobalValueDefine(0,/*laya.webgl.WebGLContext.FLOAT*/0x1406,1,new Float32Array([0]));
			LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR=layaGL.addGlobalValueDefine(0,/*laya.webgl.WebGLContext.FLOAT*/0x1406,4,new Float32Array([1e6,0,0,1e6]));
			LayaNative2D.GLOBALVALUE_CLIP_MAT_POS=layaGL.addGlobalValueDefine(0,/*laya.webgl.WebGLContext.FLOAT*/0x1406,2,new Float32Array([0,0]));
			LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC=layaGL.addGlobalValueDefine(0,/*laya.webgl.WebGLContext.INT*/0x1404,1,new Int32Array([ /*laya.webgl.WebGLContext.ONE*/1]));
			LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST=layaGL.addGlobalValueDefine(0,/*laya.webgl.WebGLContext.INT*/0x1404,1,new Int32Array([ /*laya.webgl.WebGLContext.ONE_MINUS_SRC_ALPHA*/0x0303]));
			LayaNative2D.GLOBALVALUE_COLORFILTER_COLOR=layaGL.addGlobalValueDefine(0,/*laya.webgl.WebGLContext.FLOAT*/0x1406,16,new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]));
			LayaNative2D.GLOBALVALUE_COLORFILTER_ALPHA=layaGL.addGlobalValueDefine(0,/*laya.webgl.WebGLContext.FLOAT*/0x1406,4,new Float32Array([0,0,0,1]));
			LayaNative2D.GLOBALVALUE_BLURFILTER_STRENGTH=layaGL.addGlobalValueDefine(0,/*laya.webgl.WebGLContext.FLOAT*/0x1406,4,new Float32Array([0,0,0,0]));
			LayaNative2D.GLOBALVALUE_BLURFILTER_BLURINFO=layaGL.addGlobalValueDefine(0,/*laya.webgl.WebGLContext.FLOAT*/0x1406,2,new Float32Array([0,0]));
			LayaNative2D.GLOBALVALUE_GLOWFILTER_COLOR=layaGL.addGlobalValueDefine(0,/*laya.webgl.WebGLContext.FLOAT*/0x1406,4,new Float32Array([0,0,0,0]));
			LayaNative2D.GLOBALVALUE_GLOWFILTER_BLURINFO1=layaGL.addGlobalValueDefine(0,/*laya.webgl.WebGLContext.FLOAT*/0x1406,4,new Float32Array([0,0,0,0]));
			LayaNative2D.GLOBALVALUE_GLOWFILTER_BLURINFO2=layaGL.addGlobalValueDefine(0,/*laya.webgl.WebGLContext.FLOAT*/0x1406,4,new Float32Array([0,0,0,0]));
			layaGL.endGlobalValueDefine();
			LayaNative2D.PROGRAMEX_DRAWTEXTURE=LayaGL.instance.createProgramEx("/*\n	texture和fillrect使用的。\n*/\nattribute vec4 posuv;\nattribute vec4 attribColor;\nattribute vec4 attribFlags;\n//attribute vec4 clipDir;\n//attribute vec2 clipRect;\nuniform vec4 clipMatDir;\nuniform vec2 clipMatPos;		// 这个是全局的，不用再应用矩阵了。\nvarying vec2 cliped;\nuniform vec2 size;\n\n#ifdef WORLDMAT\n	uniform mat4 mmat;\n#endif\nuniform mat4 u_MvpMatrix;\n\nvarying vec4 v_texcoordAlpha;\nvarying vec4 v_color;\nvarying float v_useTex;\n\nvoid main() {\n\n	vec4 pos = vec4(posuv.xy,0.,1.);\n#ifdef WORLDMAT\n	pos=mmat*pos;\n#endif\n	vec4 pos1  =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,0.,1.0);\n#ifdef MVP3D\n	gl_Position=u_MvpMatrix*pos1;\n#else\n	gl_Position=pos1;\n#endif\n	v_texcoordAlpha.xy = posuv.zw;\n	//v_texcoordAlpha.z = attribColor.a/255.0;\n	v_color = attribColor/255.0;\n	v_color.xyz*=v_color.w;//反正后面也要预乘\n	\n	v_useTex = attribFlags.r/255.0;\n	float clipw = length(clipMatDir.xy);\n	float cliph = length(clipMatDir.zw);\n	vec2 clippos = pos.xy - clipMatPos.xy;	//pos已经应用矩阵了，为了减的有意义，clip的位置也要缩放\n	if(clipw>20000. && cliph>20000.)\n		cliped = vec2(0.5,0.5);\n	else {\n		//转成0到1之间。/clipw/clipw 表示clippos与normalize之后的clip朝向点积之后，再除以clipw\n		cliped=vec2( dot(clippos,clipMatDir.xy)/clipw/clipw, dot(clippos,clipMatDir.zw)/cliph/cliph);\n	}\n\n}","/*\n	texture和fillrect使用的。\n*/\n\nprecision mediump float;\n//precision highp float;\nvarying vec4 v_texcoordAlpha;\nvarying vec4 v_color;\nvarying float v_useTex;\nuniform sampler2D texture;\nvarying vec2 cliped;\n\n#ifdef BLUR_FILTER\nuniform vec4 strength_sig2_2sig2_gauss1;\nuniform vec2 blurInfo;\n\n#define PI 3.141593\n\nfloat getGaussian(float x, float y){\n    return strength_sig2_2sig2_gauss1.w*exp(-(x*x+y*y)/strength_sig2_2sig2_gauss1.z);\n}\n\nvec4 blur(){\n    const float blurw = 9.0;\n    vec4 vec4Color = vec4(0.0,0.0,0.0,0.0);\n    vec2 halfsz=vec2(blurw,blurw)/2.0/blurInfo;    \n    vec2 startpos=v_texcoordAlpha.xy-halfsz;\n    vec2 ctexcoord = startpos;\n    vec2 step = 1.0/blurInfo;  //每个像素      \n    \n    for(float y = 0.0;y<=blurw; ++y){\n        ctexcoord.x=startpos.x;\n        for(float x = 0.0;x<=blurw; ++x){\n            //TODO 纹理坐标的固定偏移应该在vs中处理\n            vec4Color += texture2D(texture, ctexcoord)*getGaussian(x-blurw/2.0,y-blurw/2.0);\n            ctexcoord.x+=step.x;\n        }\n        ctexcoord.y+=step.y;\n    }\n    return vec4Color;\n}\n#endif\n\n#ifdef COLOR_FILTER\nuniform vec4 colorAlpha;\nuniform mat4 colorMat;\n#endif\n\n#ifdef GLOW_FILTER\nuniform vec4 u_color;\nuniform vec4 u_blurInfo1;\nuniform vec4 u_blurInfo2;\n#endif\n\n#ifdef COLOR_ADD\nuniform vec4 colorAdd;\n#endif\n\n//FILLTEXTURE\nuniform vec4 u_TexRange;//startu,startv,urange, vrange\n\nvoid main() {\n	if(cliped.x<0.) discard;\n	if(cliped.x>1.) discard;\n	if(cliped.y<0.) discard;\n	if(cliped.y>1.) discard;\n	\n#ifdef FILLTEXTURE	\n   vec4 color= texture2D(texture, fract(v_texcoordAlpha.xy)*u_TexRange.zw + u_TexRange.xy);\n#else\n   vec4 color= texture2D(texture, v_texcoordAlpha.xy);\n#endif\n\n   if(v_useTex<=0.)color = vec4(1.,1.,1.,1.);\n   color.a*=v_color.w;\n   //color.rgb*=v_color.w;\n   color.rgb*=v_color.rgb;\n   gl_FragColor=color;\n   \n   #ifdef COLOR_ADD\n	gl_FragColor = vec4(colorAdd.rgb,colorAdd.a*gl_FragColor.a);\n	gl_FragColor.xyz *= colorAdd.a;\n   #endif\n   \n   #ifdef BLUR_FILTER\n	gl_FragColor =   blur();\n	gl_FragColor.w*=v_color.w;   \n   #endif\n   \n   #ifdef COLOR_FILTER\n	mat4 alphaMat =colorMat;\n\n	alphaMat[0][3] *= gl_FragColor.a;\n	alphaMat[1][3] *= gl_FragColor.a;\n	alphaMat[2][3] *= gl_FragColor.a;\n\n	gl_FragColor = gl_FragColor * alphaMat;\n	gl_FragColor += colorAlpha/255.0*gl_FragColor.a;\n   #endif\n   \n   #ifdef GLOW_FILTER\n	const float c_IterationTime = 10.0;\n	float floatIterationTotalTime = c_IterationTime * c_IterationTime;\n	vec4 vec4Color = vec4(0.0,0.0,0.0,0.0);\n	vec2 vec2FilterDir = vec2(-(u_blurInfo1.z)/u_blurInfo2.x,-(u_blurInfo1.w)/u_blurInfo2.y);\n	vec2 vec2FilterOff = vec2(u_blurInfo1.x/u_blurInfo2.x/c_IterationTime * 2.0,u_blurInfo1.y/u_blurInfo2.y/c_IterationTime * 2.0);\n	float maxNum = u_blurInfo1.x * u_blurInfo1.y;\n	vec2 vec2Off = vec2(0.0,0.0);\n	float floatOff = c_IterationTime/2.0;\n	for(float i = 0.0;i<=c_IterationTime; ++i){\n		for(float j = 0.0;j<=c_IterationTime; ++j){\n			vec2Off = vec2(vec2FilterOff.x * (i - floatOff),vec2FilterOff.y * (j - floatOff));\n			vec4Color += texture2D(texture, v_texcoordAlpha.xy + vec2FilterDir + vec2Off)/floatIterationTotalTime;\n		}\n	}\n	gl_FragColor = vec4(u_color.rgb,vec4Color.a * u_blurInfo2.z);\n	gl_FragColor.rgb *= gl_FragColor.a;   \n   #endif\n   \n}","posuv,attribColor,attribFlags","size,clipMatDir,clipMatPos,texture,colorMat,colorAlpha,strength_sig2_2sig2_gauss1,blurInfo,u_color,u_blurInfo1,u_blurInfo2");
			LayaNative2D.PROGRAMEX_DRAWVG=LayaGL.instance.createProgramEx("attribute vec4 position;\nattribute vec4 attribColor;\n//attribute vec4 clipDir;\n//attribute vec2 clipRect;\nuniform vec4 clipMatDir;\nuniform vec2 clipMatPos;\n#ifdef WORLDMAT\n	uniform mat4 mmat;\n#endif\nuniform mat4 u_mmat2;\n//uniform vec2 u_pos;\nuniform vec2 size;\nvarying vec4 color;\n//vec4 dirxy=vec4(0.9,0.1, -0.1,0.9);\n//vec4 clip=vec4(100.,30.,300.,600.);\nvarying vec2 cliped;\nvoid main(){\n	\n#ifdef WORLDMAT\n	vec4 pos=mmat*vec4(position.xy,0.,1.);\n	gl_Position =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\n#else\n	gl_Position =vec4((position.x/size.x-0.5)*2.0,(0.5-position.y/size.y)*2.0,position.z,1.0);\n#endif	\n	float clipw = length(clipMatDir.xy);\n	float cliph = length(clipMatDir.zw);\n	vec2 clippos = position.xy - clipMatPos.xy;	//pos已经应用矩阵了，为了减的有意义，clip的位置也要缩放\n	if(clipw>20000. && cliph>20000.)\n		cliped = vec2(0.5,0.5);\n	else {\n		//clipdir是带缩放的方向，由于上面clippos是在缩放后的空间计算的，所以需要把方向先normalize一下\n		cliped=vec2( dot(clippos,clipMatDir.xy)/clipw/clipw, dot(clippos,clipMatDir.zw)/cliph/cliph);\n	}\n  //pos2d.x = dot(clippos,dirx);\n  color=attribColor/255.;\n}","precision mediump float;\n//precision mediump float;\nvarying vec4 color;\n//uniform float alpha;\nvarying vec2 cliped;\nvoid main(){\n	//vec4 a=vec4(color.r, color.g, color.b, 1);\n	//a.a*=alpha;\n    gl_FragColor= color;// vec4(color.r, color.g, color.b, alpha);\n	gl_FragColor.rgb*=color.a;\n	if(cliped.x<0.) discard;\n	if(cliped.x>1.) discard;\n	if(cliped.y<0.) discard;\n	if(cliped.y>1.) discard;\n}","position,attribColor","size,clipMatDir,clipMatPos");
			LayaNative2D.PROGRAMEX_DRAWPARTICLE=LayaGL.instance.createProgramEx("attribute vec4 a_CornerTextureCoordinate;\nattribute vec3 a_Position;\nattribute vec3 a_Velocity;\nattribute vec4 a_StartColor;\nattribute vec4 a_EndColor;\nattribute vec3 a_SizeRotation;\nattribute vec2 a_Radius;\nattribute vec4 a_Radian;\nattribute float a_AgeAddScale;\nattribute float a_Time;\n\nvarying vec4 v_Color;\nvarying vec2 v_TextureCoordinate;\n\nuniform float u_CurrentTime;\nuniform float u_Duration;\nuniform float u_EndVelocity;\nuniform vec3 u_Gravity;\n\nuniform vec2 size;\nuniform mat4 u_mmat;\n\nvec4 ComputeParticlePosition(in vec3 position, in vec3 velocity,in float age,in float normalizedAge)\n{\n\n   float startVelocity = length(velocity);//起始标量速度\n   float endVelocity = startVelocity * u_EndVelocity;//结束标量速度\n\n   float velocityIntegral = startVelocity * normalizedAge +(endVelocity - startVelocity) * normalizedAge *normalizedAge/2.0;//计算当前速度的标量（单位空间），vt=v0*t+(1/2)*a*(t^2)\n   \n   vec3 addPosition = normalize(velocity) * velocityIntegral * u_Duration;//计算受自身速度影响的位置，转换标量到矢量    \n   addPosition += u_Gravity * age * normalizedAge;//计算受重力影响的位置\n   \n   float radius=mix(a_Radius.x, a_Radius.y, normalizedAge); //计算粒子受半径和角度影响（无需计算角度和半径时，可用宏定义优化屏蔽此计算）\n   float radianHorizontal =mix(a_Radian.x,a_Radian.z,normalizedAge);\n   float radianVertical =mix(a_Radian.y,a_Radian.w,normalizedAge);\n   \n   float r =cos(radianVertical)* radius;\n   addPosition.y += sin(radianVertical) * radius;\n	\n   addPosition.x += cos(radianHorizontal) *r;\n   addPosition.z += sin(radianHorizontal) *r;\n  \n   addPosition.y=-addPosition.y;//2D粒子位置更新需要取负，2D粒子坐标系Y轴正向朝上\n   position+=addPosition;\n   return  vec4(position,1.0);\n}\n\nfloat ComputeParticleSize(in float startSize,in float endSize, in float normalizedAge)\n{    \n    float size = mix(startSize, endSize, normalizedAge);\n    return size;\n}\n\nmat2 ComputeParticleRotation(in float rot,in float age)\n{    \n    float rotation =rot * age;\n    //计算2x2旋转矩阵.\n    float c = cos(rotation);\n    float s = sin(rotation);\n    return mat2(c, -s, s, c);\n}\n\nvec4 ComputeParticleColor(in vec4 startColor,in vec4 endColor,in float normalizedAge)\n{\n	vec4 color=mix(startColor,endColor,normalizedAge);\n    //硬编码设置，使粒子淡入很快，淡出很慢,6.7的缩放因子把置归一在0到1之间，可以谷歌x*(1-x)*(1-x)*6.7的制图表\n    color.a *= normalizedAge * (1.0-normalizedAge) * (1.0-normalizedAge) * 6.7;\n   \n    return color;\n}\n\nvoid main()\n{\n   float age = u_CurrentTime - a_Time;\n   age *= 1.0 + a_AgeAddScale;\n   float normalizedAge = clamp(age / u_Duration,0.0,1.0);\n   gl_Position = ComputeParticlePosition(a_Position, a_Velocity, age, normalizedAge);//计算粒子位置\n   float pSize = ComputeParticleSize(a_SizeRotation.x,a_SizeRotation.y, normalizedAge);\n   mat2 rotation = ComputeParticleRotation(a_SizeRotation.z, age);\n	\n    mat4 mat=u_mmat;\n    gl_Position=vec4((mat*gl_Position).xy,0.0,1.0);\n    gl_Position.xy += (rotation*a_CornerTextureCoordinate.xy) * pSize*vec2(mat[0][0],mat[1][1]);\n    gl_Position=vec4((gl_Position.x/size.x-0.5)*2.0,(0.5-gl_Position.y/size.y)*2.0,0.0,1.0);\n   \n   v_Color = ComputeParticleColor(a_StartColor,a_EndColor, normalizedAge);\n   v_TextureCoordinate =a_CornerTextureCoordinate.zw;\n}\n\n","#ifdef FSHIGHPRECISION\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n\nvarying vec4 v_Color;\nvarying vec2 v_TextureCoordinate;\nuniform sampler2D u_texture;\n\nvoid main()\n{	\n	gl_FragColor=texture2D(u_texture,v_TextureCoordinate)*v_Color;\n	gl_FragColor.xyz *= v_Color.w;\n}","a_CornerTextureCoordinate,a_Position,a_Velocity,a_StartColor,a_EndColor,a_SizeRotation,a_Radius,a_Radian,a_AgeAddScale,a_Time","u_CurrentTime,u_Duration,u_EndVelocity,u_Gravity,size,u_mmat,u_texture");
			LayaNative2D.VDO_MESHQUADTEXTURE=layaGL.createVDO(new Int32Array([ /*laya.webgl.WebGLContext.FLOAT*/0x1406,0,4,24,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,16,4,24,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,20,4,24]));
			LayaNative2D.VDO_MESHVG=layaGL.createVDO(new Int32Array([ /*laya.webgl.WebGLContext.FLOAT*/0x1406,0,2,12,/*laya.webgl.WebGLContext.UNSIGNED_BYTE*/0x1401,8,4,12]));
			LayaNative2D.VDO_MESHPARTICLE=layaGL.createVDO(new Int32Array([ /*laya.webgl.WebGLContext.FLOAT*/0x1406,0,4,116,/*laya.webgl.WebGLContext.FLOAT*/0x1406,16,3,116,/*laya.webgl.WebGLContext.FLOAT*/0x1406,28,3,116,/*laya.webgl.WebGLContext.FLOAT*/0x1406,40,4,116,/*laya.webgl.WebGLContext.FLOAT*/0x1406,56,4,116,/*laya.webgl.WebGLContext.FLOAT*/0x1406,72,3,116,/*laya.webgl.WebGLContext.FLOAT*/0x1406,84,2,116,/*laya.webgl.WebGLContext.FLOAT*/0x1406,92,4,116,/*laya.webgl.WebGLContext.FLOAT*/0x1406,108,1,116,/*laya.webgl.WebGLContext.FLOAT*/0x1406,112,1,116]));
			LayaNative2D._init_simple_texture_cmdEncoder_();
			LayaNative2D._init_simple_rect_cmdEncoder_();
			LayaNative2D._init_rect_border_cmdEncoder_();
			LayaNative2D.SHADER_MACRO_COLOR_FILTER=LayaGL.instance.defineShaderMacro("#define COLOR_FILTER",[ {uname:4,id:LayaNative2D.GLOBALVALUE_COLORFILTER_COLOR },{uname:5,id:LayaNative2D.GLOBALVALUE_COLORFILTER_ALPHA }]);
			LayaNative2D.SHADER_MACRO_BLUR_FILTER=LayaGL.instance.defineShaderMacro("#define BLUR_FILTER",[ {uname:6,id:LayaNative2D.GLOBALVALUE_BLURFILTER_STRENGTH },{uname:7,id:LayaNative2D.GLOBALVALUE_BLURFILTER_BLURINFO }]);
			LayaNative2D.SHADER_MACRO_GLOW_FILTER=LayaGL.instance.defineShaderMacro("#define GLOW_FILTER",[ {uname:8,id:LayaNative2D.GLOBALVALUE_GLOWFILTER_COLOR },{uname:9,id:LayaNative2D.GLOBALVALUE_GLOWFILTER_BLURINFO1 },{uname:10,id:LayaNative2D.GLOBALVALUE_GLOWFILTER_BLURINFO2 }]);
			LayaGLTemplate.__init__();
			LayaGLTemplate.__init_END_();
			if(TextRender.useOldCharBook)new CharBook();
			else new TextRender();
			CharPages.charRender=new CharRender_Native();
		}
	}

	LayaNative2D._SIMPLE_TEXTURE_CMDENCODER_=null;
	LayaNative2D._SIMPLE_RECT_CMDENCODER_=null;
	LayaNative2D._RECT_BORDER_CMD_ENCODER_=null;
	LayaNative2D.PROGRAMEX_DRAWTEXTURE=0;
	LayaNative2D.PROGRAMEX_DRAWVG=0;
	LayaNative2D.PROGRAMEX_DRAWRECT=0;
	LayaNative2D.PROGRAMEX_DRAWPARTICLE=0;
	LayaNative2D.VDO_MESHQUADTEXTURE=0;
	LayaNative2D.VDO_MESHVG=0;
	LayaNative2D.VDO_MESHPARTICLE=0;
	LayaNative2D.GLOBALVALUE_VIEWS=0;
	LayaNative2D.GLOBALVALUE_MATRIX32=0;
	LayaNative2D.GLOBALVALUE_DRAWTEXTURE_COLOR=0;
	LayaNative2D.GLOBALVALUE_ITALICDEG=0;
	LayaNative2D.GLOBALVALUE_CLIP_MAT_DIR=0;
	LayaNative2D.GLOBALVALUE_CLIP_MAT_POS=0;
	LayaNative2D.GLOBALVALUE_BLENDFUNC_SRC=0;
	LayaNative2D.GLOBALVALUE_BLENDFUNC_DEST=0;
	LayaNative2D.GLOBALVALUE_COLORFILTER_COLOR=0;
	LayaNative2D.GLOBALVALUE_COLORFILTER_ALPHA=0;
	LayaNative2D.GLOBALVALUE_BLURFILTER_STRENGTH=0;
	LayaNative2D.GLOBALVALUE_BLURFILTER_BLURINFO=0;
	LayaNative2D.SHADER_MACRO_COLOR_FILTER=0;
	LayaNative2D.SHADER_MACRO_BLUR_FILTER=0;
	LayaNative2D.SHADER_MACRO_GLOW_FILTER=0;
	LayaNative2D.GLOBALVALUE_GLOWFILTER_COLOR=0;
	LayaNative2D.GLOBALVALUE_GLOWFILTER_BLURINFO1=0;
	LayaNative2D.GLOBALVALUE_GLOWFILTER_BLURINFO2=0;
	return LayaNative2D;
})()


/**
*@private
*命令模板，用来优化合并命令执行
*/

import ParticleTemplateBase from "./ParticleTemplateBase";
import ParticleSetting from "./ParticleSetting";
import PicTool from "./PicTool";
import ParticleData from "./ParticleData";
import CMDParticle from "./CMDParticle";

import Texture = Laya.Texture;
import Event = Laya.Event;
import Utils = Laya.Utils;
import Context = Laya.Context;
import CanvasShader from "./CanvasShader";



export default class ParticleTemplateCanvas extends ParticleTemplateBase
{

    /**
    *是否处于可播放状态
    */
    _ready=false;
    
    /**
     * 贴图列表
     */
    textureList: Array<Texture> = [];

    /**
     * 粒子列表
     */
    particleList: Array<any> = [];

    /**
     * 贴图中心偏移x
     */
    pX: number = 0;

    /**
     * 贴图中心偏移y
     */
    pY: number = 0;
    /**
     * 当前活跃的粒子
     */
    activeParticles: Array<any> = [];
    /**
     * 粒子pool
     */
    deadParticles: Array<any> = [];
    /**
     * 粒子播放进度列表
     */
    iList: Array<any> = [];
    protected _maxNumParticles: number = 0;
    /**
     * 纹理的宽度
     */
    textureWidth: number = NaN;
    /**
     * 宽度倒数
     */
    dTextureWidth: number = NaN;
    /**
     * 是否支持颜色变化
     */
    colorChange: boolean = true;
    /**
     * 采样步长
     */
    step: number = 1/60;

    
    canvasShader = new CanvasShader();
    
    constructor(particleSetting: ParticleSetting)
    {
        super();
        this.settings = particleSetting;
        
        this._maxNumParticles=particleSetting.maxPartices;
        this.texture=new Texture();
        this.texture.on(Event.READY, this, this._textureLoaded);
        this.texture.load(particleSetting.textureName);
    }

    _textureLoaded(e: Event)
    {
        this.setTexture(this.texture);
        this._ready=true;
    }

    clear(clearTexture?: boolean): void
    {
        (clearTexture===void 0)&& (clearTexture=true);
		this.deadParticles.length=0;
		this.activeParticles.length=0;
		this.textureList.length=0;
    }

    /**
     * 设置纹理
     * @param texture
     *
     */
    setTexture(texture: Texture): void
    {
        this.texture            = texture;
		this.textureWidth       = texture.width;
		this.dTextureWidth      = 1/this.textureWidth;
		this.pX                 = -texture.width*0.5;
		this.pY                 = -texture.height*0.5;
		this.textureList        = ParticleTemplateCanvas.changeTexture(texture,this.textureList);
		this.particleList.length    =0;
		this.deadParticles.length   =0;
		this.activeParticles.length =0;
    }

    static changeTexture(texture: Texture, rst: Array<Texture>, settings?: ParticleSetting): Array<any>
    {
        if(!rst)rst=[];

		rst.length=0;
        if (settings&&settings.disableColor)
        {
			rst.push(texture,texture,texture);
        }else
        {
			Utils.copyArray(rst, PicTool.getRGBPic(texture));
		}
		return rst;
    }

	/**
	*创建一个粒子数据
	*@return
	*
	*/
    _createAParticleData(position,velocity)
    {
        this.canvasShader.u_EndVelocity=this.settings.endVelocity;
		this.canvasShader.u_Gravity=this.settings.gravity;
		this.canvasShader.u_Duration=this.settings.duration;
		var particle;
		particle= ParticleData.Create(this.settings,position,velocity,0);
		this.canvasShader.a_Position=particle.position;
		this.canvasShader.a_Velocity=particle.velocity;
		this.canvasShader.a_StartColor=particle.startColor;
		this.canvasShader.a_EndColor=particle.endColor;
		this.canvasShader.a_SizeRotation=particle.sizeRotation;
		this.canvasShader.a_Radius=particle.radius;
		this.canvasShader.a_Radian=particle.radian;
		this.canvasShader.a_AgeAddScale=particle.durationAddScale;
        this.canvasShader.oSize=this.textureWidth;
        
		var rst=new CMDParticle();
		var i=0,len=this.settings.duration/(1+particle.durationAddScale);
		var params=[];
		var mStep=NaN;
        for(i=0;i<len;i+=this.step)
        {
			params.push(this.canvasShader.getData(i));
        }
        
		rst.id=this.particleList.length;
		this.particleList.push(rst);
		rst.setCmds(params);
		return rst;
    }

    addParticleArray(position: Float32Array, velocity: Float32Array): void
    {
        if(!this._ready)return;
		var tParticle;
        if(this.particleList.length<this._maxNumParticles)
        {
			tParticle=this._createAParticleData(position,velocity);
			this.iList[tParticle.id]=0;
			this.activeParticles.push(tParticle);
        }
        else
        {
            if(this.deadParticles.length>0)
            {
				tParticle=this.deadParticles.pop();
				this.iList[tParticle.id]=0;
				this.activeParticles.push(tParticle);
			}
		}

    }

    advanceTime(passedTime?: number): void
    {
        (passedTime===void 0)&& (passedTime=1);

        if(!this._ready)return;
        
		var particleList=this.activeParticles;
		var pool=this.deadParticles;
		var i=0,len=particleList.length;
		var tcmd;
		var tI=0;
		var iList=this.iList;
        for(i=len-1;i>-1;i--)
        {
			tcmd=particleList[i];
			tI=iList[tcmd.id];
            if(tI>=tcmd.maxIndex)
            {
				tI=0;
				particleList.splice(i,1);
				pool.push(tcmd);
            }
            else
            {
				tI+=1;
			}
			iList[tcmd.id]=tI;
		}
    }

    render(context: Context, x: number, y: number): void
    {
        if(!this._ready)return;

        if(this.activeParticles.length<1)return;
        
        if (this.textureList.length < 2)return;
        
        if (this.settings.disableColor)
        {
			this.noColorRender(context,x,y);
        }
        else
        {
			this.canvasRender(context,x,y);
		}

    }

    noColorRender(context: Context, x: number, y: number): void
    {
        var particleList=this.activeParticles;
		var i=0,len=particleList.length;
		var tcmd;
		var tParam;
		var tAlpha=NaN;
		var px=this.pX,py=this.pY;
		var pw=-px*2,ph=-py*2;
		var tI=0;
		var textureList=this.textureList;
		var iList=this.iList;
		var preAlpha=NaN;
		context.translate(x,y);
		preAlpha=context.globalAlpha;
        for(i=0;i<len;i++)
        {
			tcmd=particleList[i];
			tI=iList[tcmd.id];
			tParam=tcmd.cmds[tI];
			if (!tParam)continue ;
			if ((tAlpha=tParam[1])<=0.01)continue ;
			context.globalAlpha=preAlpha*tAlpha;
			context.drawTextureWithTransform(this.texture,px,py,pw,ph,tParam[2],0,0,1,null);
		}
		context.globalAlpha=preAlpha;
		context.translate(-x,-y);
    }

    canvasRender(context: Context, x: number, y: number): void
    {
        var particleList=this.activeParticles;
		var i=0,len=particleList.length;
		var tcmd;
		var tParam;
		var tAlpha=NaN;
		var px=this.pX,py=this.pY;
		var pw=-px*2,ph=-py*2;
		var tI=0;
		var textureList=this.textureList;
		var iList=this.iList;
		var preAlpha=NaN;
		var preB;
		context.translate(x,y);
		preAlpha=context.globalAlpha;
		preB=context.globalCompositeOperation;
		context.globalCompositeOperation="lighter";
        for(i=0;i<len;i++)
        {
			tcmd=particleList[i];
			tI=iList[tcmd.id];
			tParam=tcmd.cmds[tI];
			if (!tParam)continue ;
			if ((tAlpha=tParam[1])<=0.01)continue ;
			context.save();
			context.transformByMatrix(tParam[2],0,0);
            if(tParam[3]>0.01)
            {
				context.globalAlpha=preAlpha *tParam[3];
				context.drawTexture(textureList[0],px,py,pw,ph);
            }
            
            if(tParam[4]>0.01)
            {
				context.globalAlpha=preAlpha *tParam[4];
				context.drawTexture(textureList[1],px,py,pw,ph);
            }
            
            if(tParam[5]>0.01)
            {
				context.globalAlpha=preAlpha *tParam[5];
				context.drawTexture(textureList[2],px,py,pw,ph);
			}
			context.restore();
		}
		context.globalAlpha=preAlpha;
		context.translate(-x,-y);
		context.globalCompositeOperation=preB;
    }

}
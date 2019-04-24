import Render = Laya.Render;
import BlendMode = Laya.BlendMode;
import DrawParticleCmd = Laya.DrawParticleCmd;
import ParticleSetting from "./ParticleSetting";
import ParticleTemplate2D from "./ParticleTemplate2D";
import ParticleTemplateCanvas from "./ParticleTemplateCanvas";
import Emitter2D from "./Emitter2D";


// import ParticleTemplate2D = Laya.ParticleTemplate2D;
// import Emitter2D = Laya.Emitter2D;
// import ParticleTemplateCanvas = Laya.ParticleTemplateCanvas;

export default class Particle2D extends Laya.Sprite
{
    private _matrix4 = [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1];

    private _particleTemplate : ParticleTemplate2D | ParticleTemplateCanvas;
    private _canvasTemplate: ParticleTemplateCanvas;
    private _emitter: Emitter2D;

    /** 是否字段播放 */
    autoPlay: boolean = true;
    tempCmd: DrawParticleCmd;

    constructor(setting: ParticleSetting)
    {
        super();
        this.customRenderEnable = true;
        if(setting)
            this.setParticleSetting(setting);
    }

    /**
	*加载粒子文件
	*@param url 粒子文件地址
    */
    load(url: string)
    {
        Laya.loader.load(url, Laya.Handler.create(this, this.setParticleSetting), null, Laya.Loader.JSON);
    }

    
	/**
	*设置粒子配置数据
	*@param settings 粒子配置数据
    */
   setParticleSetting(setting: ParticleSetting)
   {
       if (!setting)return this.stop();

       ParticleSetting.checkSetting(setting);

       if(Render.isConchApp)
       {
           this._particleTemplate = new ParticleTemplate2D(setting);

           var sBlendMode = BlendMode.NAMES[setting.blendState];
           this.blendMode = sBlendMode;

           this.tempCmd = this.graphics._saveToCmd(null, 
                                                    DrawParticleCmd.create.call(this.graphics,this._particleTemplate)
                                                );
            
			this._setGraphicsCallBack();

       }
       else
       {
           if(Render.isWebGL)
           {
               this.customRenderEnable = true;
               this._particleTemplate = new ParticleTemplate2D(setting);
               this.graphics._saveToCmd(null, DrawParticleCmd.create(this._particleTemplate)  );
           }
           else
           {
               this._particleTemplate = this._canvasTemplate = new ParticleTemplateCanvas(setting);
           }
       }

       if(!this._emitter)
       {
           this._emitter = new Emitter2D(<any>this._particleTemplate);
       }
       else
       {
           this._emitter.template=<any>this._particleTemplate;
       }

       if (this.autoPlay)
       {
           this.emitter.start();
           this.play();
       }

   }

   /**
	*播放
    */
    play()
    {
        Laya.timer.frameLoop(1, this, this._loop);
    }

    
	/**
	*停止
    */
    stop()
    {
		Laya.timer.clear(this,this._loop);
    }

    private _loop()
    {
		this.advanceTime(1 / 60);
    }

    
	/**
	*时钟前进
	*@param passedTime 时钟前进时间
    */
   advanceTime(passedTime: number)
   {
       (passedTime === void 0) && (passedTime = 1);

       if(this._canvasTemplate)
       {
           this._canvasTemplate.advanceTime(passedTime);
       }

       if(this._emitter)
       {
           this._emitter.advanceTime(passedTime);
       }
   }

   customRender(context,x,y)
   {
       if(Render.isWebGL)
       {
            this._matrix4[0]=context._curMat.a;
            this._matrix4[1]=context._curMat.b;
            this._matrix4[4]=context._curMat.c;
            this._matrix4[5]=context._curMat.d;
            this._matrix4[12]=context._curMat.tx;
            this._matrix4[13]=context._curMat.ty;

            var sv=(<ParticleTemplate2D>this._particleTemplate).sv;
            // TODO ZF
			sv["u_mmat"]=this._matrix4;
			// sv.mmat=this._matrix4;
       }

       if(this._canvasTemplate)
       {
           this._canvasTemplate.render(context,x,y);
       }
   }

   destroy(destroyChild?: boolean)
   {
       (destroyChild === void 0) && (destroyChild = true);

       if((this._particleTemplate instanceof ParticleTemplate2D))
       {
           this._particleTemplate.dispose();
       }
       
       super.destroy(destroyChild);
   }

   
	/**
	*设置 粒子文件地址
	*@param path 粒子文件地址
    */
    set url(url)
    {
        this.load(url);
    }

    
	/**
	*获取粒子发射器
    */
    get emitter()
    {
        return this._emitter;
    }


}

window["Particle2D"] = Particle2D;
import ParticleTemplateBase from "./ParticleTemplateBase";
import EmitterBase from "./EmitterBase";
import ParticleSetting from "./ParticleSetting";
import ParticleTemplateCanvas from "./ParticleTemplateCanvas";
import ParticleTemplate2D from "./ParticleTemplate2D";

export default class Emitter2D extends EmitterBase
{
    setting: ParticleSetting = null;
    _posRange: Float32Array = null;
    _canvasTemplate:ParticleTemplateCanvas = null;
    _emitFun: Function = null;

    constructor(_template: ParticleTemplateBase)
    {
        super();
        this.template = _template;
    }


    /**
	*发射一个粒子
	*
    */
    emit()
    {
        super.emit();
        if(this._emitFun)
            this._emitFun();
    }

    getRandom(value): number
    {
        return (Math.random() * 2 - 1) * value;
    }

    webGLEmit()
    {
        let pos = new Float32Array(3);
        pos[0] = this.getRandom(this._posRange[0]);
        pos[1] = this.getRandom(this._posRange[1]);
        pos[2] = this.getRandom(this._posRange[2]);

        let v = new Float32Array(3);
        v[0] = 0;
        v[1] = 0;
        v[2] = 0;

        this._particleTemplate.addParticleArray(pos, v);
    }

    canvasEmit()
    {
        let pos = new Float32Array(3);
        pos[0] = this.getRandom(this._posRange[0]);
        pos[1] = this.getRandom(this._posRange[1]);
        pos[2] = this.getRandom(this._posRange[2]);

        let v = new Float32Array(3);
        v[0] = 0;
        v[1] = 0;
        v[2] = 0;

        this._particleTemplate.addParticleArray(pos, v);
    }

    get template():ParticleTemplateBase
    {
        return this._particleTemplate;
    }

    set template(template: ParticleTemplateBase)
    {
        this._particleTemplate = template;

        if(!template)
        {
            this._emitFun = null;
            this.setting = null;
            this._posRange = null;
        }

        this.setting = template.settings;
        this._posRange = this.setting.positionVariance;

        if(this._particleTemplate instanceof ParticleTemplate2D)
        {
            this._emitFun = this.webGLEmit;
        }
        else if(this._particleTemplate instanceof ParticleTemplateCanvas)
        {
            this._canvasTemplate = <ParticleTemplateCanvas> template;
            this._emitFun = this.canvasEmit;
        }


    }
}
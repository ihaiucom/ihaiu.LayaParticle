
import ParticleShaderValue from "./ParticleShaderValue";
import ParticleSetting from "./ParticleSetting";
import Handler = Laya.Handler;
import BlendMode = Laya.BlendMode;
import Render = Laya.Render;
import MeshParticle2D = Laya.MeshParticle2D;
import ISubmit = Laya.ISubmit;
import WebGL = Laya.WebGL;
import WebGLContext = Laya.WebGLContext;
import Stat = Laya.Stat;
import ParticleTemplateWebGLWave from "./ParticleTemplateWebGLWave";





declare var ParamData:any;

export default class ParticleTemplate2DWave extends ParticleTemplateWebGLWave implements ISubmit
{
    static activeBlendType: number = -1;
    x: number = 0;
    y: number = 0;
    protected _blendFn: Function = null;
    _startTime = 0;
    _key: any = {};
    sv: ParticleShaderValue = new ParticleShaderValue();

    constructor(parSetting: ParticleSetting)
    {
        super(parSetting);
        Laya.loader.load(this.settings.textureName, Handler.create(null, (texture)=>
        {
			this.texture=texture;
        }));
        
        this.sv.u_Duration = this.settings.duration;
		this.sv.u_Gravity = this.settings.gravity;
		this.sv.u_EndVelocity = this.settings.endVelocity;
        this._blendFn = BlendMode.fns[parSetting.blendState];
        
        if (Render.isConchApp)
        {
			var nSize=MeshParticle2D.const_stride *this.settings.maxPartices *4 *4;
			this._conchMesh=/*__JS__ */new ParamData(nSize,true);
		}
        else
        {
			this._mesh=MeshParticle2D.getAMesh(this.settings.maxPartices);
		}
		this.initialize();
    }

    getRenderType(): number
    {
        return -111;
    }
    
    releaseRender(): void
    {

    }

    addParticleArray(position: Float32Array, velocity: Float32Array): void
    {
        position[0]+=this.x;
        position[1]+=this.y;
        super.addParticleArray(position, velocity);
    }

    
	/*
	override protected function loadContent():void{
		var indexes:Uint16Array=new Uint16Array(settings.maxPartices *6);
		for (var i:int=0;i < settings.maxPartices;i++){
			indexes[i *6+0]=(i *4+0);
			indexes[i *6+1]=(i *4+1);
			indexes[i *6+2]=(i *4+2);
			indexes[i *6+3]=(i *4+0);
			indexes[i *6+4]=(i *4+2);
			indexes[i *6+5]=(i *4+3);
		}
		_indexBuffer2D.clear();
		_indexBuffer2D.append(indexes);
		_indexBuffer2D.upload();
	}

	*/

    addNewParticlesToVertexBuffer(): void
    {
        var _vertexBuffer2D=this._mesh._vb;
		_vertexBuffer2D.clear();
		_vertexBuffer2D.append(this._vertices);
        var start=0;
        
        if (this._firstNewElement < this._firstFreeElement)
        {
			start=this._firstNewElement *4 *this._floatCountPerVertex *4;
			_vertexBuffer2D.subUpload(start, start , start + (this._firstFreeElement-this._firstNewElement) * 4 * this._floatCountPerVertex * 4);
        }
        else 
        {
			start=this._firstNewElement *4 *this._floatCountPerVertex *4;
            _vertexBuffer2D.subUpload(start, start, start+(this.settings.maxPartices-this._firstNewElement)*4 *this._floatCountPerVertex *4);
            
            if (this._firstFreeElement > 0)
            {
				_vertexBuffer2D.setNeedUpload();
				_vertexBuffer2D.subUpload(0,0,this._firstFreeElement *4 *this._floatCountPerVertex *4);
			}
		}
		this._firstNewElement=this._firstFreeElement;
    }

    renderSubmit(): number
    {
        if (this.texture && this.texture.getIsReady())
        {
			this.update(Laya.timer._delta);
			this.sv.u_CurrentTime=this._currentTime;
            if (this._firstNewElement !=this._firstFreeElement)
            {
				this.addNewParticlesToVertexBuffer();
            }
            
			this.blend();
            if (this._firstActiveElement !=this._firstFreeElement)
            {
				var gl=WebGL.mainContext;
				this._mesh.useMesh(gl);
				this.sv.u_texture=this.texture._getSource();
				this.sv.upload();
                if (this._firstActiveElement < this._firstFreeElement)
                {
					WebGL.mainContext.drawElements(WebGLContext.TRIANGLES, (this._firstFreeElement-this._firstActiveElement)*6,  WebGLContext.UNSIGNED_SHORT, this._firstActiveElement *6 *2);
				}
                else
                {
					WebGL.mainContext.drawElements(WebGLContext.TRIANGLES, (this.settings.maxPartices-this._firstActiveElement)*6, WebGLContext.UNSIGNED_SHORT, this._firstActiveElement *6 *2);
					if (this._firstFreeElement > 0)
						WebGL.mainContext.drawElements(WebGLContext.TRIANGLES,this._firstFreeElement *6, WebGLContext.UNSIGNED_SHORT, 0);
				}
				!Stat["drawCall"] ? Stat["drawCall"] = 1 : Stat["drawCall"]++;
			}
			this._drawCounter++;
		}
		return 1;

    }

    updateParticleForNative(): void
    {
        if (this.texture&&this.texture.getIsReady())
        {
			this.update(Laya.timer._delta);
            this.sv.u_CurrentTime=this._currentTime;
            
            if (this._firstNewElement !=this._firstFreeElement)
            {
				this._firstNewElement=this._firstFreeElement;
			}
		}
    }

    getMesh(): MeshParticle2D
    {
        return this._mesh;
    }

    getConchMesh(): any
    {
        return this._conchMesh;
    }

    getFirstNewElement(): number
    {
        return this._firstNewElement;
    }

    getFirstFreeElement(): number
    {
        return this._firstFreeElement;
    }

    getFirstActiveElement(): number
    {
        return this._firstActiveElement;
    }

    getFirstRetiredElement(): number
    {
        return this._firstRetiredElement;
    }

    setFirstFreeElement(_value: number): void
    {
        this._firstFreeElement=_value;
    }

    setFirstNewElement(_value: number): void
    {
        this._firstNewElement=_value;
    }

    addDrawCounter(): void
    {
        this._drawCounter++;
    }

    blend(): void
    {
        if (BlendMode.activeBlendFunction!==this._blendFn)
        {
			var gl=WebGL.mainContext;
			gl.enable(WebGLContext.BLEND);
			this._blendFn(gl);
			BlendMode.activeBlendFunction=this._blendFn;
		}
    }
    
    dispose(): void
    {
        if (!Render.isConchApp)
        {
			this._mesh.releaseMesh();
		}
    }
}
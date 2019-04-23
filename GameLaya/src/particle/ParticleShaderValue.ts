import RenderState2D = Laya.RenderState2D;
import ParticleShader from "./ParticleShader";

export default class ParticleShaderValue extends Laya.Value2D
{
    /*
    public var a_CornerTextureCoordinate:Array=[4,WebGLContext.FLOAT,false,116,0];
    public var a_Position:Array=[3,WebGLContext.FLOAT,false,116,16];
    public var a_Velocity:Array=[3,WebGLContext.FLOAT,false,116,28];
    public var a_StartColor:Array=[4,WebGLContext.FLOAT,false,116,40];
    public var a_EndColor:Array=[4,WebGLContext.FLOAT,false,116,56];
    public var a_SizeRotation:Array=[3,WebGLContext.FLOAT,false,116,72];
    public var a_Radius:Array=[2,WebGLContext.FLOAT,false,116,84];
    public var a_Radian:Array=[4,WebGLContext.FLOAT,false,116,92];
    public var a_AgeAddScale:Array=[1,WebGLContext.FLOAT,false,116,108];
    public var a_Time:Array=[1,WebGLContext.FLOAT,false,116,112];
    */
    
    u_CurrentTime: number = NaN;
    u_Duration: number = NaN;
    u_Gravity: Float32Array = null;
    //v3
    u_EndVelocity: number = NaN;
    u_texture: any = null;

    constructor()
    {
        super(0, 0);
    }

    
    /*
    this._attribLocation=[
            'a_CornerTextureCoordinate',0,
            'a_Position',1,
            'a_Velocity',2,
            'a_StartColor',3,
            'a_EndColor',4,
            'a_SizeRotation',5,
            'a_Radius',6,
            'a_Radian',7,
            'a_AgeAddScale',8,
            'a_Time',9
        ];
    */
    upload(): void
    {
        var size=this.size;
		size[0]=RenderState2D.width;
		size[1]=RenderState2D.height;
		this.alpha=this.ALPHA *RenderState2D.worldAlpha;
		ParticleShaderValue.pShader.upload(this);
    }

    private static _pShader: ParticleShader;
    static get pShader():ParticleShader 
    {
        if(!this._pShader)
            this._pShader = new ParticleShader();

        return this._pShader;
    }
}
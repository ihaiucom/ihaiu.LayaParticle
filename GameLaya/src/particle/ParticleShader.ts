export default class ParticleShader extends Laya.Shader
{
    constructor()
    {
        let vs = "";
        let ps = "";
        super(
            vs, 
            ps, 
            "ParticleShader", // saveName
            null, // nameMap
            // bindAttrib
            [
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
            ]
        );
    }
}
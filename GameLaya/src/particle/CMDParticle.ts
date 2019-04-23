export default class CMDParticle
{
    /**
    *最大帧
    */
    maxIndex: number=0;
    /**
    *帧命令数组
    */
    cmds: Array<any>=null;
    /**
    *粒子id
    */
    id: number=0;

    setCmds(cmds: Array<any>)
    {
		this.cmds=cmds;
		this.maxIndex=cmds.length-1;
    }


}
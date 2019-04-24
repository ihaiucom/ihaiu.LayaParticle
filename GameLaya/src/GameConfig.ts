/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import GameUI from "./script/GameUI"
import GameControl from "./script/GameControl"
import Bullet from "./script/Bullet"
import DropBox from "./script/DropBox"
import Particle2D from "./particle/Particle2D";
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=640;
    static height:number=1136;
    static scaleMode:string="fixedwidth";
    static screenMode:string="none";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="AScebe.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        // reg("Particle2D", Particle2D);
        // reg("script/GameUI.ts",GameUI);
        // reg("script/GameControl.ts",GameControl);
        // reg("script/Bullet.ts",Bullet);
        // reg("script/DropBox.ts",DropBox);
    }
}
GameConfig.init();
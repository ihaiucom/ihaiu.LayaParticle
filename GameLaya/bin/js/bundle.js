var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handler = Laya.Handler;
class AssetManager {
    // 加载资源
    load(path, complete, caller, type = Laya.Loader.TEXT) {
        Laya.loader.load(path, Handler.create(null, (res) => {
            if (complete) {
                if (caller) {
                    complete.apply(caller, [res]);
                }
                else {
                    complete(res);
                }
            }
        }), null, type);
    }
    // 加载资源, 异步
    loadAsync(path, type = Laya.Loader.TEXT) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                this.load(path, (res) => {
                    resolve(res);
                }, null, type);
            });
        });
    }
    // 加载Shader
    loadShaderVSAsync(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            let code = yield this.loadAsync(`res/shaders/${filename}.vs`, Laya.Loader.TEXT);
            return code.replace(/\r/g, "");
        });
    }
    // 加载Shader
    loadShaderPSAsync(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            let code = yield this.loadAsync(`res/shaders/${filename}.fs`, Laya.Loader.TEXT);
            return code.replace(/\r/g, "");
        });
    }
}
exports.default = AssetManager;
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AssetManager_1 = require("./AssetManager");
class Game {
}
// 资源
Game.asset = new AssetManager_1.default();
exports.default = Game;
},{"./AssetManager":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
* 游戏初始化配置;
*/
class GameConfig {
    constructor() { }
    static init() {
        var reg = Laya.ClassUtils.regClass;
        // reg("Particle2D", Particle2D);
        // reg("script/GameUI.ts",GameUI);
        // reg("script/GameControl.ts",GameControl);
        // reg("script/Bullet.ts",Bullet);
        // reg("script/DropBox.ts",DropBox);
    }
}
GameConfig.width = 640;
GameConfig.height = 1136;
GameConfig.scaleMode = "fixedwidth";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "AScebe.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;
exports.default = GameConfig;
GameConfig.init();
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameConfig_1 = require("./GameConfig");
var Loader = Laya.Loader;
const ParticleShader_1 = require("./particle/ParticleShader");
const Game_1 = require("./Game");
const Particle2D_1 = require("./particle/Particle2D");
// import Particle2D = Laya.Particle2D;
class Main {
    constructor() {
        //根据IDE设置初始化引擎		
        if (window["Laya3D"])
            Laya3D.init(GameConfig_1.default.width, GameConfig_1.default.height);
        else
            Laya.init(GameConfig_1.default.width, GameConfig_1.default.height, Laya["WebGL"]);
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        Laya.stage.scaleMode = GameConfig_1.default.scaleMode;
        Laya.stage.screenMode = GameConfig_1.default.screenMode;
        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = GameConfig_1.default.exportSceneToJson;
        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        if (GameConfig_1.default.debug || Laya.Utils.getQueryString("debug") == "true")
            Laya.enableDebugPanel();
        if (GameConfig_1.default.physicsDebug && Laya["PhysicsDebugDraw"])
            Laya["PhysicsDebugDraw"].enable();
        if (GameConfig_1.default.stat)
            Laya.Stat.show();
        Laya.alertGlobalError = true;
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        // Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        // Laya.loader.load("res/particles/particleNew.part", Laya.Handler.create(this, this.onAssetsLoaded), null, Loader.JSON);
        // Laya.loader.load("res/particles/AAA.part", Laya.Handler.create(this, this.onAssetsLoaded), null, Loader.JSON);
        this.InitSync();
    }
    onAssetsLoaded(settings) {
        this.sp = new Particle2D_1.default(settings);
        this.sp.emitter.start();
        this.sp.play();
        Laya.stage.addChild(this.sp);
        this.sp.x = Laya.stage.width / 2;
        this.sp.y = Laya.stage.height / 2;
        window['pp'] = this.sp;
        this.sp.graphics.drawCircle(0, 0, 30, '#FF0000', '#00FF00', 5);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseDown);
    }
    onMouseDown() {
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
    }
    onMouseMove(e) {
        this.sp.x = e.stageX;
        this.sp.y = e.stageY;
    }
    onVersionLoaded() {
        //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
        Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    }
    onConfigLoaded() {
        //加载IDE指定的场景
        GameConfig_1.default.startScene && Laya.Scene.open(GameConfig_1.default.startScene);
    }
    InitSync() {
        return __awaiter(this, void 0, void 0, function* () {
            yield ParticleShader_1.default.install();
            let settings = yield Game_1.default.asset.loadAsync("res/particles/AAA.part", Loader.JSON);
            this.onAssetsLoaded(settings);
        });
    }
}
//激活启动类
new Main();
},{"./Game":2,"./GameConfig":3,"./particle/Particle2D":9,"./particle/ParticleShader":12}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CMDParticle {
    constructor() {
        /**
        *最大帧
        */
        this.maxIndex = 0;
        /**
        *帧命令数组
        */
        this.cmds = null;
        /**
        *粒子id
        */
        this.id = 0;
    }
    setCmds(cmds) {
        this.cmds = cmds;
        this.maxIndex = cmds.length - 1;
    }
}
exports.default = CMDParticle;
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MathUtil = Laya.MathUtil;
var Matrix = Laya.Matrix;
class CanvasShader {
    constructor() {
        this.u_Duration = NaN;
        this.u_EndVelocity = NaN;
        this.u_Gravity = null;
        this.a_Position = null;
        this.a_Velocity = null;
        this.a_StartColor = null;
        this.a_EndColor = null;
        this.a_SizeRotation = null;
        this.a_Radius = null;
        this.a_Radian = null;
        this.a_AgeAddScale = null;
        this.gl_Position = null;
        this.v_Color = null;
        this.oSize = NaN;
        this._color = new Float32Array(4);
        this._position = new Float32Array(3);
    }
    getLen(position) {
        return Math.sqrt(position[0] * position[0] + position[1] * position[1] + position[2] * position[2]);
    }
    ComputeParticlePosition(position, velocity, age, normalizedAge) {
        this._position[0] = position[0];
        this._position[1] = position[1];
        this._position[2] = position[2];
        var startVelocity = this.getLen(velocity);
        var endVelocity = startVelocity * this.u_EndVelocity;
        var velocityIntegral = startVelocity * normalizedAge + (endVelocity - startVelocity) * normalizedAge * normalizedAge / 2.0;
        var lenVelocity = NaN;
        lenVelocity = this.getLen(velocity);
        var i = 0, len = 0;
        len = 3;
        for (i = 0; i < len; i++) {
            this._position[i] = this._position[i] + (velocity[i] / lenVelocity) * velocityIntegral * this.u_Duration;
            this._position[i] += this.u_Gravity[i] * age * normalizedAge;
        }
        ;
        var radius = MathUtil.lerp(this.a_Radius[0], this.a_Radius[1], normalizedAge);
        var radianHorizontal = MathUtil.lerp(this.a_Radian[0], this.a_Radian[2], normalizedAge);
        var radianVertical = MathUtil.lerp(this.a_Radian[1], this.a_Radian[3], normalizedAge);
        var r = Math.cos(radianVertical) * radius;
        this._position[1] += Math.sin(radianVertical) * radius;
        this._position[0] += Math.cos(radianHorizontal) * r;
        this._position[2] += Math.sin(radianHorizontal) * r;
        return new Float32Array([this._position[0], this._position[1], 0.0, 1.0]);
    }
    ComputeParticleSize(startSize, endSize, normalizedAge) {
        var size = MathUtil.lerp(startSize, endSize, normalizedAge);
        return size;
    }
    ComputeParticleRotation(rot, age) {
        return rot * age;
    }
    ComputeParticleColor(startColor, endColor, normalizedAge) {
        var rst = this._color;
        MathUtil.lerpVector4(startColor, endColor, normalizedAge, rst);
        rst[3] = rst[3] * normalizedAge * (1.0 - normalizedAge) * (1.0 - normalizedAge) * 6.7;
        return rst;
    }
    clamp(value, min, max) {
        if (value < min)
            return min;
        if (value > max)
            return max;
        return value;
    }
    getData(age) {
        age *= 1.0 + this.a_AgeAddScale;
        var normalizedAge = this.clamp(age / this.u_Duration, 0.0, 1.0);
        this.gl_Position = this.ComputeParticlePosition(this.a_Position, this.a_Velocity, age, normalizedAge);
        var pSize = this.ComputeParticleSize(this.a_SizeRotation[0], this.a_SizeRotation[1], normalizedAge);
        var rotation = this.ComputeParticleRotation(this.a_SizeRotation[2], age);
        this.v_Color = this.ComputeParticleColor(this.a_StartColor, this.a_EndColor, normalizedAge);
        var matric = new Matrix();
        var scale = NaN;
        scale = pSize / this.oSize * 2;
        matric.scale(scale, scale);
        matric.rotate(rotation);
        matric.setTranslate(this.gl_Position[0], -this.gl_Position[1]);
        var alpha = NaN;
        alpha = this.v_Color[3];
        return [this.v_Color, alpha, matric, this.v_Color[0] * alpha, this.v_Color[1] * alpha, this.v_Color[2] * alpha];
    }
}
exports.default = CanvasShader;
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmitterBase_1 = require("./EmitterBase");
const ParticleTemplateCanvas_1 = require("./ParticleTemplateCanvas");
const ParticleTemplate2D_1 = require("./ParticleTemplate2D");
class Emitter2D extends EmitterBase_1.default {
    constructor(_template) {
        super();
        this.setting = null;
        this._posRange = null;
        this._canvasTemplate = null;
        this._emitFun = null;
        this.template = _template;
    }
    /**
    *发射一个粒子
    *
    */
    emit() {
        super.emit();
        if (this._emitFun)
            this._emitFun();
    }
    getRandom(value) {
        return (Math.random() * 2 - 1) * value;
    }
    webGLEmit() {
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
    canvasEmit() {
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
    get template() {
        return this._particleTemplate;
    }
    set template(template) {
        this._particleTemplate = template;
        if (!template) {
            this._emitFun = null;
            this.setting = null;
            this._posRange = null;
        }
        this.setting = template.settings;
        this._posRange = this.setting.positionVariance;
        if (this._particleTemplate instanceof ParticleTemplate2D_1.default) {
            this._emitFun = this.webGLEmit;
        }
        else if (this._particleTemplate instanceof ParticleTemplateCanvas_1.default) {
            this._canvasTemplate = template;
            this._emitFun = this.canvasEmit;
        }
    }
}
exports.default = Emitter2D;
},{"./EmitterBase":8,"./ParticleTemplate2D":14,"./ParticleTemplateCanvas":16}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
*<code>EmitterBase</code> 类是粒子发射器类
*/
class EmitterBase {
    constructor() {
        /**
        *积累的帧时间
        */
        this._frameTime = 0;
        /**
         *粒子发射速率
         */
        this._emissionRate = 60;
        /**
         *当前剩余发射时间
         */
        this._emissionTime = 0;
        /**
         *发射粒子最小时间间隔
         */
        this.minEmissionTime = 1 / 60;
    }
    /**
     *开始发射粒子
     *@param duration 发射持续的时间(秒)
     */
    start(duration) {
        (duration === void 0) && (duration = Number.MAX_VALUE);
        if (this._emissionRate != 0)
            this._emissionTime = duration;
    }
    /**
    *停止发射粒子
    *@param clearParticles 是否清理当前的粒子
    */
    stop() {
        this._emissionTime = 0;
    }
    /**
     *清理当前的活跃粒子
     *@param clearTexture 是否清理贴图数据,若清除贴图数据将无法再播放
     */
    clear() {
        this._emissionTime = 0;
    }
    /**
    *发射一个粒子
    *
    */
    emit() {
    }
    /**
     *时钟前进
     *@param passedTime 前进时间
     *
     */
    advanceTime(passedTime) {
        (passedTime === void 0) && (passedTime = 1);
        this._emissionTime -= passedTime;
        if (this._emissionTime < 0)
            return;
        this._frameTime += passedTime;
        if (this._frameTime < this.minEmissionTime)
            return;
        while (this._frameTime > this.minEmissionTime) {
            this._frameTime -= this.minEmissionTime;
            this.emit();
        }
    }
    /**
     *设置粒子粒子模板
     *@param particleTemplate 粒子模板
     *
     */
    set particleTemplate(particleTemplate) {
        this._particleTemplate = particleTemplate;
    }
    /**
    *设置粒子发射速率
    *@param emissionRate 粒子发射速率 (个/秒)
    */
    set emissionRate(val) {
        if (val <= 0)
            return;
        this._emissionRate = val;
        (val > 0) && (this.minEmissionTime = 1 / val);
    }
    /**
    *获取粒子发射速率
    *@return 发射速率 粒子发射速率 (个/秒)
    */
    get emissionRate() {
        return this._emissionRate;
    }
}
exports.default = EmitterBase;
},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Render = Laya.Render;
var BlendMode = Laya.BlendMode;
var DrawParticleCmd = Laya.DrawParticleCmd;
const ParticleSetting_1 = require("./ParticleSetting");
const ParticleTemplate2D_1 = require("./ParticleTemplate2D");
const ParticleTemplateCanvas_1 = require("./ParticleTemplateCanvas");
const Emitter2D_1 = require("./Emitter2D");
// import ParticleTemplate2D = Laya.ParticleTemplate2D;
// import Emitter2D = Laya.Emitter2D;
// import ParticleTemplateCanvas = Laya.ParticleTemplateCanvas;
class Particle2D extends Laya.Sprite {
    constructor(setting) {
        super();
        this._matrix4 = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
        /** 是否字段播放 */
        this.autoPlay = true;
        this.customRenderEnable = true;
        if (setting)
            this.setParticleSetting(setting);
    }
    /**
    *加载粒子文件
    *@param url 粒子文件地址
    */
    load(url) {
        Laya.loader.load(url, Laya.Handler.create(this, this.setParticleSetting), null, Laya.Loader.JSON);
    }
    /**
    *设置粒子配置数据
    *@param settings 粒子配置数据
    */
    setParticleSetting(setting) {
        if (!setting)
            return this.stop();
        ParticleSetting_1.default.checkSetting(setting);
        if (Render.isConchApp) {
            this._particleTemplate = new ParticleTemplate2D_1.default(setting);
            var sBlendMode = BlendMode.NAMES[setting.blendState];
            this.blendMode = sBlendMode;
            this.tempCmd = this.graphics._saveToCmd(null, DrawParticleCmd.create.call(this.graphics, this._particleTemplate));
            this._setGraphicsCallBack();
        }
        else {
            if (Render.isWebGL) {
                this.customRenderEnable = true;
                this._particleTemplate = new ParticleTemplate2D_1.default(setting);
                this.graphics._saveToCmd(null, DrawParticleCmd.create(this._particleTemplate));
            }
            else {
                this._particleTemplate = this._canvasTemplate = new ParticleTemplateCanvas_1.default(setting);
            }
        }
        if (!this._emitter) {
            this._emitter = new Emitter2D_1.default(this._particleTemplate);
        }
        else {
            this._emitter.template = this._particleTemplate;
        }
        if (this.autoPlay) {
            this.emitter.start();
            this.play();
        }
    }
    /**
     *播放
     */
    play() {
        Laya.timer.frameLoop(1, this, this._loop);
    }
    /**
    *停止
    */
    stop() {
        Laya.timer.clear(this, this._loop);
    }
    _loop() {
        this.advanceTime(1 / 60);
    }
    /**
    *时钟前进
    *@param passedTime 时钟前进时间
    */
    advanceTime(passedTime) {
        (passedTime === void 0) && (passedTime = 1);
        if (this._canvasTemplate) {
            this._canvasTemplate.advanceTime(passedTime);
        }
        if (this._emitter) {
            this._emitter.advanceTime(passedTime);
        }
    }
    customRender(context, x, y) {
        if (Render.isWebGL) {
            this._matrix4[0] = context._curMat.a;
            this._matrix4[1] = context._curMat.b;
            this._matrix4[4] = context._curMat.c;
            this._matrix4[5] = context._curMat.d;
            this._matrix4[12] = context._curMat.tx;
            this._matrix4[13] = context._curMat.ty;
            var sv = this._particleTemplate.sv;
            // TODO ZF
            sv["u_mmat"] = this._matrix4;
            // sv.mmat=this._matrix4;
        }
        if (this._canvasTemplate) {
            this._canvasTemplate.render(context, x, y);
        }
    }
    destroy(destroyChild) {
        (destroyChild === void 0) && (destroyChild = true);
        if ((this._particleTemplate instanceof ParticleTemplate2D_1.default)) {
            this._particleTemplate.dispose();
        }
        super.destroy(destroyChild);
    }
    /**
    *设置 粒子文件地址
    *@param path 粒子文件地址
    */
    set url(url) {
        this.load(url);
    }
    /**
    *获取粒子发射器
    */
    get emitter() {
        return this._emitter;
    }
}
exports.default = Particle2D;
window["Particle2D"] = Particle2D;
},{"./Emitter2D":7,"./ParticleSetting":11,"./ParticleTemplate2D":14,"./ParticleTemplateCanvas":16}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MathUtil = Laya.MathUtil;
class ParticleData {
    constructor() {
    }
    static Create(settings, position, velocity, time) {
        var particleData = new ParticleData();
        particleData.position = position;
        //=====================
        // 设置速度 [x, y, z]
        //---------------------
        // 缩放 e = f * b;
        MathUtil.scaleVector3(velocity, settings.emitterVelocitySensitivity, ParticleData._tempVelocity);
        // 水平速度（单位：2D像素、3D坐标）
        var horizontalVelocity = MathUtil.lerp(settings.minHorizontalVelocity, settings.maxHorizontalVelocity, Math.random());
        // 水平角度
        var horizontalAngle = Math.random() * Math.PI * 2;
        // 水平速度
        ParticleData._tempVelocity[0] += horizontalVelocity * Math.cos(horizontalAngle);
        ParticleData._tempVelocity[2] += horizontalVelocity * Math.sin(horizontalAngle);
        // 垂直速度
        ParticleData._tempVelocity[1] += MathUtil.lerp(settings.minVerticalVelocity, settings.maxVerticalVelocity, Math.random());
        particleData.velocity = ParticleData._tempVelocity;
        //=====================
        // 设置颜色 [r, g, b, a]
        //---------------------
        particleData.startColor = ParticleData._tempStartColor;
        particleData.endColor = ParticleData._tempEndColor;
        var i = 0;
        if (settings.disableColor) {
            for (i = 0; i < 3; i++) {
                particleData.startColor[i] = 1;
                particleData.endColor[i] = 1;
            }
            // alpha
            particleData.startColor[i] = MathUtil.lerp(settings.minStartColor[i], settings.maxStartColor[i], Math.random());
            particleData.endColor[i] = MathUtil.lerp(settings.minEndColor[i], settings.maxEndColor[i], Math.random());
        }
        else {
            if (settings.colorComponentInter) {
                for (i = 0; i < 4; i++) {
                    particleData.startColor[i] = MathUtil.lerp(settings.minStartColor[i], settings.maxStartColor[i], Math.random());
                    particleData.endColor[i] = MathUtil.lerp(settings.minEndColor[i], settings.maxEndColor[i], Math.random());
                }
            }
            else {
                MathUtil.lerpVector4(settings.minStartColor, settings.maxStartColor, Math.random(), particleData.startColor);
                MathUtil.lerpVector4(settings.minEndColor, settings.maxEndColor, Math.random(), particleData.endColor);
            }
        }
        //=====================
        // 设置 大小和旋转速度 [startSize, endSize,  rotateSpeed]
        //---------------------
        particleData.sizeRotation = ParticleData._tempSizeRotation;
        var sizeRandom = Math.random();
        particleData.sizeRotation[0] = MathUtil.lerp(settings.minStartSize, settings.maxStartSize, sizeRandom);
        particleData.sizeRotation[1] = MathUtil.lerp(settings.minEndSize, settings.maxEndSize, sizeRandom);
        particleData.sizeRotation[2] = MathUtil.lerp(settings.minRotateSpeed, settings.maxRotateSpeed, Math.random());
        //=====================
        // 设置 半径 [StartRadius,EndRadius]
        //---------------------
        particleData.radius = ParticleData._tempRadius;
        var radiusRandom = Math.random();
        particleData.radius[0] = MathUtil.lerp(settings.minStartRadius, settings.maxStartRadius, radiusRandom);
        particleData.radius[1] = MathUtil.lerp(settings.minEndRadius, settings.maxEndRadius, radiusRandom);
        //=====================
        // 设置 弧度 [HorizontalStartRadian,VerticalStartRadian, HorizontalEndRadian, VerticalEndRadian]
        //---------------------
        particleData.radian = ParticleData._tempRadian;
        particleData.radian[0] = MathUtil.lerp(settings.minHorizontalStartRadian, settings.maxHorizontalStartRadian, Math.random());
        particleData.radian[1] = MathUtil.lerp(settings.minVerticalStartRadian, settings.maxVerticalStartRadian, Math.random());
        var useEndRadian = settings.useEndRadian;
        particleData.radian[2] = useEndRadian ? MathUtil.lerp(settings.minHorizontalEndRadian, settings.maxHorizontalEndRadian, Math.random()) : particleData.radian[0];
        particleData.radian[3] = useEndRadian ? MathUtil.lerp(settings.minVerticalEndRadian, settings.maxVerticalEndRadian, Math.random()) : particleData.radian[1];
        // 设置 缩放持续时间
        particleData.durationAddScale = settings.ageAddScale * Math.random();
        // 设置 次数
        particleData.time = time;
        return particleData;
    }
    static get _tempVelocity() {
        if (!this.___tempVelocity)
            this.___tempVelocity = new Float32Array(3);
        return this.___tempVelocity;
    }
    static get _tempStartColor() {
        if (!this.__tempStartColor)
            this.__tempStartColor = new Float32Array(4);
        return this.__tempStartColor;
    }
    static get _tempEndColor() {
        if (!this.__tempEndColor)
            this.__tempEndColor = new Float32Array(4);
        return this.__tempEndColor;
    }
    static get _tempSizeRotation() {
        if (!this.__tempSizeRotation)
            this.__tempSizeRotation = new Float32Array(3);
        return this.__tempSizeRotation;
    }
    static get _tempRadius() {
        if (!this.__tempRadius)
            this.__tempRadius = new Float32Array(2);
        return this.__tempRadius;
    }
    static get _tempRadian() {
        if (!this.__tempRadian)
            this.__tempRadian = new Float32Array(4);
        return this.__tempRadian;
    }
}
exports.default = ParticleData;
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ParticleSetting {
    constructor() {
        /**贴图*/
        this.textureName = null;
        /**贴图个数,默认为1可不设置*/
        this.textureCount = 1;
        /**由于循环队列判断算法，最大饱和粒子数为maxPartices-1*/
        this.maxPartices = 100;
        /**粒子持续时间(单位:秒）*/
        this.duration = 1;
        /**如果大于0，某些粒子的持续时间会小于其他粒子,并具有随机性(单位:无）*/
        this.ageAddScale = 0;
        /**粒子受发射器速度的敏感度（需在自定义发射器中编码设置）*/
        this.emitterVelocitySensitivity = 1;
        /**最小开始尺寸（单位：2D像素、3D坐标）*/
        this.minStartSize = 100;
        /**最大开始尺寸（单位：2D像素、3D坐标）*/
        this.maxStartSize = 100;
        /**最小结束尺寸（单位：2D像素、3D坐标）*/
        this.minEndSize = 100;
        /**最大结束尺寸（单位：2D像素、3D坐标）*/
        this.maxEndSize = 100;
        /**最小水平速度（单位：2D像素、3D坐标）*/
        this.minHorizontalVelocity = 0;
        /**最大水平速度（单位：2D像素、3D坐标）*/
        this.maxHorizontalVelocity = 0;
        /**最小垂直速度（单位：2D像素、3D坐标）*/
        this.minVerticalVelocity = 0;
        /**最大垂直速度（单位：2D像素、3D坐标）*/
        this.maxVerticalVelocity = 0;
        /**等于1时粒子从出生到消亡保持一致的速度，等于0时粒子消亡时速度为0，大于1时粒子会保持加速（单位：无）*/
        this.endVelocity = 1;
        /**最小旋转速度（单位：2D弧度/秒、3D弧度/秒）*/
        this.minRotateSpeed = 0;
        /**最大旋转速度（单位：2D弧度/秒、3D弧度/秒）*/
        this.maxRotateSpeed = 0;
        /**最小开始半径（单位：2D像素、3D坐标）*/
        this.minStartRadius = 0;
        /**最大开始半径（单位：2D像素、3D坐标）*/
        this.maxStartRadius = 0;
        /**最小结束半径（单位：2D像素、3D坐标）*/
        this.minEndRadius = 0;
        /**最大结束半径（单位：2D像素、3D坐标）*/
        this.maxEndRadius = 0;
        /**最小水平开始弧度（单位：2D弧度、3D弧度）*/
        this.minHorizontalStartRadian = 0;
        /**最大水平开始弧度（单位：2D弧度、3D弧度）*/
        this.maxHorizontalStartRadian = 0;
        /**最小垂直开始弧度（单位：2D弧度、3D弧度）*/
        this.minVerticalStartRadian = 0;
        /**最大垂直开始弧度（单位：2D弧度、3D弧度）*/
        this.maxVerticalStartRadian = 0;
        /**是否使用结束弧度,false为结束时与起始弧度保持一致,true为根据minHorizontalEndRadian、maxHorizontalEndRadian、minVerticalEndRadian、maxVerticalEndRadian计算结束弧度。*/
        this.useEndRadian = true;
        /**最小水平结束弧度（单位：2D弧度、3D弧度）*/
        this.minHorizontalEndRadian = 0;
        /**最大水平结束弧度（单位：2D弧度、3D弧度）*/
        this.maxHorizontalEndRadian = 0;
        /**最小垂直结束弧度（单位：2D弧度、3D弧度）*/
        this.minVerticalEndRadian = 0;
        /**最大垂直结束弧度（单位：2D弧度、3D弧度）*/
        this.maxVerticalEndRadian = 0;
        /**false代表RGBA整体插值，true代表RGBA逐分量插值*/
        this.colorComponentInter = false;
        /**false代表使用参数颜色数据，true代表使用原图颜色数据*/
        this.disableColor = false;
        /**混合模式，待调整，引擎中暂无BlendState抽象*/
        this.blendState = 0;
        /**发射器类型,"point","box","sphere","ring"*/
        this.emitterType = "null";
        /**发射器发射速率*/
        this.emissionRate = 0;
        /**球发射器半径*/
        this.sphereEmitterRadius = 1;
        /**球发射器速度*/
        this.sphereEmitterVelocity = 0;
        /**球发射器速度随机值*/
        this.sphereEmitterVelocityAddVariance = 0;
        /**环发射器半径*/
        this.ringEmitterRadius = 30;
        /**环发射器速度*/
        this.ringEmitterVelocity = 0;
        /**环发射器速度随机值*/
        this.ringEmitterVelocityAddVariance = 0;
        /**环发射器up向量，0代表X轴,1代表Y轴,2代表Z轴*/
        this.ringEmitterUp = 2;
        this.gravity = new Float32Array([0, 0, 0]);
        this.minStartColor = new Float32Array([1, 1, 1, 1]);
        this.maxStartColor = new Float32Array([1, 1, 1, 1]);
        this.minEndColor = new Float32Array([1, 1, 1, 1]);
        this.maxEndColor = new Float32Array([1, 1, 1, 1]);
        this.pointEmitterPosition = new Float32Array([0, 0, 0]);
        this.pointEmitterPositionVariance = new Float32Array([0, 0, 0]);
        this.pointEmitterVelocity = new Float32Array([0, 0, 0]);
        this.pointEmitterVelocityAddVariance = new Float32Array([0, 0, 0]);
        this.boxEmitterCenterPosition = new Float32Array([0, 0, 0]);
        this.boxEmitterSize = new Float32Array([0, 0, 0]);
        this.boxEmitterVelocity = new Float32Array([0, 0, 0]);
        this.boxEmitterVelocityAddVariance = new Float32Array([0, 0, 0]);
        this.sphereEmitterCenterPosition = new Float32Array([0, 0, 0]);
        this.ringEmitterCenterPosition = new Float32Array([0, 0, 0]);
        this.positionVariance = new Float32Array([0, 0, 0]);
    }
    static get defaultSetting() {
        if (!this._defaultSetting)
            this._defaultSetting = new ParticleSetting();
        return this._defaultSetting;
    }
    static checkSetting(setting) {
        let key;
        for (key in ParticleSetting.defaultSetting) {
            if (!setting.hasOwnProperty(key)) {
                setting[key] = ParticleSetting.defaultSetting[key];
            }
        }
        setting.endVelocity = +setting.endVelocity;
        setting.gravity[0] = +setting.gravity[0];
        setting.gravity[1] = +setting.gravity[1];
        setting.gravity[2] = +setting.gravity[2];
    }
}
exports.default = ParticleSetting;
},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("../Game");
class ParticleShader extends Laya.Shader {
    constructor() {
        let vs = ParticleShader.vs;
        let ps = ParticleShader.ps;
        super(vs, ps, ParticleShader.shaderName + "2", // saveName
        null, // nameMap
        // bindAttrib
        [
            'a_CornerTextureCoordinate', 0,
            'a_Position', 1,
            'a_Velocity', 2,
            'a_StartColor', 3,
            'a_EndColor', 4,
            'a_SizeRotation', 5,
            'a_Radius', 6,
            'a_Radian', 7,
            'a_AgeAddScale', 8,
            'a_Time', 9
        ]);
    }
    /**
     * 加载Shader
     */
    static install() {
        return __awaiter(this, void 0, void 0, function* () {
            this.vs = yield Game_1.default.asset.loadShaderVSAsync(this.shaderName);
            this.ps = yield Game_1.default.asset.loadShaderPSAsync(this.shaderName);
        });
    }
}
ParticleShader.shaderName = "ParticleShader";
exports.default = ParticleShader;
},{"../Game":2}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RenderState2D = Laya.RenderState2D;
const ParticleShader_1 = require("./ParticleShader");
class ParticleShaderValue extends Laya.Value2D {
    constructor() {
        super(0, 0);
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
        this.u_CurrentTime = NaN;
        this.u_Duration = NaN;
        this.u_Gravity = null;
        //v3
        this.u_EndVelocity = NaN;
        this.u_texture = null;
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
    upload() {
        var size = this.size;
        size[0] = RenderState2D.width;
        size[1] = RenderState2D.height;
        this.alpha = this.ALPHA * RenderState2D.worldAlpha;
        ParticleShaderValue.pShader.upload(this);
    }
    static get pShader() {
        if (!this._pShader)
            this._pShader = new ParticleShader_1.default();
        return this._pShader;
    }
}
exports.default = ParticleShaderValue;
},{"./ParticleShader":12}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParticleTemplateWebGL_1 = require("./ParticleTemplateWebGL");
const ParticleShaderValue_1 = require("./ParticleShaderValue");
var Handler = Laya.Handler;
var BlendMode = Laya.BlendMode;
var Render = Laya.Render;
var MeshParticle2D = Laya.MeshParticle2D;
var WebGL = Laya.WebGL;
var WebGLContext = Laya.WebGLContext;
var Stat = Laya.Stat;
class ParticleTemplate2D extends ParticleTemplateWebGL_1.default {
    constructor(parSetting) {
        super(parSetting);
        this.x = 0;
        this.y = 0;
        this._blendFn = null;
        this._startTime = 0;
        this._key = {};
        this.sv = new ParticleShaderValue_1.default();
        Laya.loader.load(this.settings.textureName, Handler.create(null, (texture) => {
            this.texture = texture;
        }));
        this.sv.u_Duration = this.settings.duration;
        this.sv.u_Gravity = this.settings.gravity;
        this.sv.u_EndVelocity = this.settings.endVelocity;
        this._blendFn = BlendMode.fns[parSetting.blendState];
        if (Render.isConchApp) {
            var nSize = MeshParticle2D.const_stride * this.settings.maxPartices * 4 * 4;
            this._conchMesh = /*__JS__ */ new ParamData(nSize, true);
        }
        else {
            this._mesh = MeshParticle2D.getAMesh(this.settings.maxPartices);
        }
        this.initialize();
    }
    getRenderType() {
        return -111;
    }
    releaseRender() {
    }
    addParticleArray(position, velocity) {
        position[0] += this.x;
        position[1] += this.y;
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
    addNewParticlesToVertexBuffer() {
        var _vertexBuffer2D = this._mesh._vb;
        _vertexBuffer2D.clear();
        _vertexBuffer2D.append(this._vertices);
        var start = 0;
        if (this._firstNewElement < this._firstFreeElement) {
            start = this._firstNewElement * 4 * this._floatCountPerVertex * 4;
            _vertexBuffer2D.subUpload(start, start, start + (this._firstFreeElement - this._firstNewElement) * 4 * this._floatCountPerVertex * 4);
        }
        else {
            start = this._firstNewElement * 4 * this._floatCountPerVertex * 4;
            _vertexBuffer2D.subUpload(start, start, start + (this.settings.maxPartices - this._firstNewElement) * 4 * this._floatCountPerVertex * 4);
            if (this._firstFreeElement > 0) {
                _vertexBuffer2D.setNeedUpload();
                _vertexBuffer2D.subUpload(0, 0, this._firstFreeElement * 4 * this._floatCountPerVertex * 4);
            }
        }
        this._firstNewElement = this._firstFreeElement;
    }
    renderSubmit() {
        if (this.texture && this.texture.getIsReady()) {
            this.update(Laya.timer._delta);
            this.sv.u_CurrentTime = this._currentTime;
            if (this._firstNewElement != this._firstFreeElement) {
                this.addNewParticlesToVertexBuffer();
            }
            this.blend();
            if (this._firstActiveElement != this._firstFreeElement) {
                var gl = WebGL.mainContext;
                this._mesh.useMesh(gl);
                this.sv.u_texture = this.texture._getSource();
                this.sv.upload();
                if (this._firstActiveElement < this._firstFreeElement) {
                    WebGL.mainContext.drawElements(WebGLContext.TRIANGLES, (this._firstFreeElement - this._firstActiveElement) * 6, WebGLContext.UNSIGNED_SHORT, this._firstActiveElement * 6 * 2);
                }
                else {
                    WebGL.mainContext.drawElements(WebGLContext.TRIANGLES, (this.settings.maxPartices - this._firstActiveElement) * 6, WebGLContext.UNSIGNED_SHORT, this._firstActiveElement * 6 * 2);
                    if (this._firstFreeElement > 0)
                        WebGL.mainContext.drawElements(WebGLContext.TRIANGLES, this._firstFreeElement * 6, WebGLContext.UNSIGNED_SHORT, 0);
                }
                !Stat["drawCall"] ? Stat["drawCall"] = 1 : Stat["drawCall"]++;
            }
            this._drawCounter++;
        }
        return 1;
    }
    updateParticleForNative() {
        if (this.texture && this.texture.getIsReady()) {
            this.update(Laya.timer._delta);
            this.sv.u_CurrentTime = this._currentTime;
            if (this._firstNewElement != this._firstFreeElement) {
                this._firstNewElement = this._firstFreeElement;
            }
        }
    }
    getMesh() {
        return this._mesh;
    }
    getConchMesh() {
        return this._conchMesh;
    }
    getFirstNewElement() {
        return this._firstNewElement;
    }
    getFirstFreeElement() {
        return this._firstFreeElement;
    }
    getFirstActiveElement() {
        return this._firstActiveElement;
    }
    getFirstRetiredElement() {
        return this._firstRetiredElement;
    }
    setFirstFreeElement(_value) {
        this._firstFreeElement = _value;
    }
    setFirstNewElement(_value) {
        this._firstNewElement = _value;
    }
    addDrawCounter() {
        this._drawCounter++;
    }
    blend() {
        if (BlendMode.activeBlendFunction !== this._blendFn) {
            var gl = WebGL.mainContext;
            gl.enable(WebGLContext.BLEND);
            this._blendFn(gl);
            BlendMode.activeBlendFunction = this._blendFn;
        }
    }
    dispose() {
        if (!Render.isConchApp) {
            this._mesh.releaseMesh();
        }
    }
}
ParticleTemplate2D.activeBlendType = -1;
exports.default = ParticleTemplate2D;
},{"./ParticleShaderValue":13,"./ParticleTemplateWebGL":17}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ParticleTemplateBase {
    constructor() {
        /**
        *粒子配置数据
        */
        this.settings = null;
        /**
        *粒子贴图
        */
        this.texture = null;
    }
    /**
     *添加一个粒子
     *@param position 粒子位置
     *@param velocity 粒子速度
     *
     */
    addParticleArray(position, velocity) {
    }
}
exports.default = ParticleTemplateBase;
},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParticleTemplateBase_1 = require("./ParticleTemplateBase");
const PicTool_1 = require("./PicTool");
const ParticleData_1 = require("./ParticleData");
const CMDParticle_1 = require("./CMDParticle");
var Texture = Laya.Texture;
var Event = Laya.Event;
var Utils = Laya.Utils;
const CanvasShader_1 = require("./CanvasShader");
class ParticleTemplateCanvas extends ParticleTemplateBase_1.default {
    constructor(particleSetting) {
        super();
        /**
        *是否处于可播放状态
        */
        this._ready = false;
        /**
         * 贴图列表
         */
        this.textureList = [];
        /**
         * 粒子列表
         */
        this.particleList = [];
        /**
         * 贴图中心偏移x
         */
        this.pX = 0;
        /**
         * 贴图中心偏移y
         */
        this.pY = 0;
        /**
         * 当前活跃的粒子
         */
        this.activeParticles = [];
        /**
         * 粒子pool
         */
        this.deadParticles = [];
        /**
         * 粒子播放进度列表
         */
        this.iList = [];
        this._maxNumParticles = 0;
        /**
         * 纹理的宽度
         */
        this.textureWidth = NaN;
        /**
         * 宽度倒数
         */
        this.dTextureWidth = NaN;
        /**
         * 是否支持颜色变化
         */
        this.colorChange = true;
        /**
         * 采样步长
         */
        this.step = 1 / 60;
        this.canvasShader = new CanvasShader_1.default();
        this.settings = particleSetting;
        this._maxNumParticles = particleSetting.maxPartices;
        this.texture = new Texture();
        this.texture.on(Event.READY, this, this._textureLoaded);
        this.texture.load(particleSetting.textureName);
    }
    _textureLoaded(e) {
        this.setTexture(this.texture);
        this._ready = true;
    }
    clear(clearTexture) {
        (clearTexture === void 0) && (clearTexture = true);
        this.deadParticles.length = 0;
        this.activeParticles.length = 0;
        this.textureList.length = 0;
    }
    /**
     * 设置纹理
     * @param texture
     *
     */
    setTexture(texture) {
        this.texture = texture;
        this.textureWidth = texture.width;
        this.dTextureWidth = 1 / this.textureWidth;
        this.pX = -texture.width * 0.5;
        this.pY = -texture.height * 0.5;
        this.textureList = ParticleTemplateCanvas.changeTexture(texture, this.textureList);
        this.particleList.length = 0;
        this.deadParticles.length = 0;
        this.activeParticles.length = 0;
    }
    static changeTexture(texture, rst, settings) {
        if (!rst)
            rst = [];
        rst.length = 0;
        if (settings && settings.disableColor) {
            rst.push(texture, texture, texture);
        }
        else {
            Utils.copyArray(rst, PicTool_1.default.getRGBPic(texture));
        }
        return rst;
    }
    /**
    *创建一个粒子数据
    *@return
    *
    */
    _createAParticleData(position, velocity) {
        this.canvasShader.u_EndVelocity = this.settings.endVelocity;
        this.canvasShader.u_Gravity = this.settings.gravity;
        this.canvasShader.u_Duration = this.settings.duration;
        var particle;
        particle = ParticleData_1.default.Create(this.settings, position, velocity, 0);
        this.canvasShader.a_Position = particle.position;
        this.canvasShader.a_Velocity = particle.velocity;
        this.canvasShader.a_StartColor = particle.startColor;
        this.canvasShader.a_EndColor = particle.endColor;
        this.canvasShader.a_SizeRotation = particle.sizeRotation;
        this.canvasShader.a_Radius = particle.radius;
        this.canvasShader.a_Radian = particle.radian;
        this.canvasShader.a_AgeAddScale = particle.durationAddScale;
        this.canvasShader.oSize = this.textureWidth;
        var rst = new CMDParticle_1.default();
        var i = 0, len = this.settings.duration / (1 + particle.durationAddScale);
        var params = [];
        var mStep = NaN;
        for (i = 0; i < len; i += this.step) {
            params.push(this.canvasShader.getData(i));
        }
        rst.id = this.particleList.length;
        this.particleList.push(rst);
        rst.setCmds(params);
        return rst;
    }
    addParticleArray(position, velocity) {
        if (!this._ready)
            return;
        var tParticle;
        if (this.particleList.length < this._maxNumParticles) {
            tParticle = this._createAParticleData(position, velocity);
            this.iList[tParticle.id] = 0;
            this.activeParticles.push(tParticle);
        }
        else {
            if (this.deadParticles.length > 0) {
                tParticle = this.deadParticles.pop();
                this.iList[tParticle.id] = 0;
                this.activeParticles.push(tParticle);
            }
        }
    }
    advanceTime(passedTime) {
        (passedTime === void 0) && (passedTime = 1);
        if (!this._ready)
            return;
        var particleList = this.activeParticles;
        var pool = this.deadParticles;
        var i = 0, len = particleList.length;
        var tcmd;
        var tI = 0;
        var iList = this.iList;
        for (i = len - 1; i > -1; i--) {
            tcmd = particleList[i];
            tI = iList[tcmd.id];
            if (tI >= tcmd.maxIndex) {
                tI = 0;
                particleList.splice(i, 1);
                pool.push(tcmd);
            }
            else {
                tI += 1;
            }
            iList[tcmd.id] = tI;
        }
    }
    render(context, x, y) {
        if (!this._ready)
            return;
        if (this.activeParticles.length < 1)
            return;
        if (this.textureList.length < 2)
            return;
        if (this.settings.disableColor) {
            this.noColorRender(context, x, y);
        }
        else {
            this.canvasRender(context, x, y);
        }
    }
    noColorRender(context, x, y) {
        var particleList = this.activeParticles;
        var i = 0, len = particleList.length;
        var tcmd;
        var tParam;
        var tAlpha = NaN;
        var px = this.pX, py = this.pY;
        var pw = -px * 2, ph = -py * 2;
        var tI = 0;
        var textureList = this.textureList;
        var iList = this.iList;
        var preAlpha = NaN;
        context.translate(x, y);
        preAlpha = context.globalAlpha;
        for (i = 0; i < len; i++) {
            tcmd = particleList[i];
            tI = iList[tcmd.id];
            tParam = tcmd.cmds[tI];
            if (!tParam)
                continue;
            if ((tAlpha = tParam[1]) <= 0.01)
                continue;
            context.globalAlpha = preAlpha * tAlpha;
            context.drawTextureWithTransform(this.texture, px, py, pw, ph, tParam[2], 0, 0, 1, null);
        }
        context.globalAlpha = preAlpha;
        context.translate(-x, -y);
    }
    canvasRender(context, x, y) {
        var particleList = this.activeParticles;
        var i = 0, len = particleList.length;
        var tcmd;
        var tParam;
        var tAlpha = NaN;
        var px = this.pX, py = this.pY;
        var pw = -px * 2, ph = -py * 2;
        var tI = 0;
        var textureList = this.textureList;
        var iList = this.iList;
        var preAlpha = NaN;
        var preB;
        context.translate(x, y);
        preAlpha = context.globalAlpha;
        preB = context.globalCompositeOperation;
        context.globalCompositeOperation = "lighter";
        for (i = 0; i < len; i++) {
            tcmd = particleList[i];
            tI = iList[tcmd.id];
            tParam = tcmd.cmds[tI];
            if (!tParam)
                continue;
            if ((tAlpha = tParam[1]) <= 0.01)
                continue;
            context.save();
            context.transformByMatrix(tParam[2], 0, 0);
            if (tParam[3] > 0.01) {
                context.globalAlpha = preAlpha * tParam[3];
                context.drawTexture(textureList[0], px, py, pw, ph);
            }
            if (tParam[4] > 0.01) {
                context.globalAlpha = preAlpha * tParam[4];
                context.drawTexture(textureList[1], px, py, pw, ph);
            }
            if (tParam[5] > 0.01) {
                context.globalAlpha = preAlpha * tParam[5];
                context.drawTexture(textureList[2], px, py, pw, ph);
            }
            context.restore();
        }
        context.globalAlpha = preAlpha;
        context.translate(-x, -y);
        context.globalCompositeOperation = preB;
    }
}
exports.default = ParticleTemplateCanvas;
},{"./CMDParticle":5,"./CanvasShader":6,"./ParticleData":10,"./ParticleTemplateBase":15,"./PicTool":18}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Render = Laya.Render;
var MeshParticle2D = Laya.MeshParticle2D;
const ParticleTemplateBase_1 = require("./ParticleTemplateBase");
const ParticleData_1 = require("./ParticleData");
class ParticleTemplateWebGL extends ParticleTemplateBase_1.default {
    constructor(setting) {
        super();
        this._floatCountPerVertex = 29;
        //0~3为CornerTextureCoordinate,
        //4~6为Position,
        //7~9Velocity,
        //10到13为StartColor,
        //14到17为EndColor,
        //18到20位SizeRotation，
        //21到22位Radius,
        //23到26位Radian，
        //27为DurationAddScaleShaderValue,
        //28为Time
        this._firstActiveElement = 0;
        this._firstNewElement = 0;
        this._firstFreeElement = 0;
        this._firstRetiredElement = 0;
        this._currentTime = 0;
        this._drawCounter = 0;
        this.settings = setting;
    }
    reUse(context, pos) {
        return 0;
    }
    /** 初始化 */
    initialize() {
        var floatStride = 0;
        if (Render.isConchApp) {
            this._vertices = this._conchMesh._float32Data;
            floatStride = MeshParticle2D.const_stride / 4;
        }
        else {
            this._vertices = this._mesh._vb.getFloat32Array();
            floatStride = this._mesh._stride / 4;
        }
        ;
        var bufi = 0;
        var bufStart = 0;
        for (var i = 0; i < this.settings.maxPartices; i++) {
            var random = Math.random();
            var cornerYSegement = this.settings.textureCount ? 1.0 / this.settings.textureCount : 1.0;
            var cornerY = NaN;
            for (cornerY = 0; cornerY < this.settings.textureCount; cornerY += cornerYSegement) {
                if (random < cornerY + cornerYSegement)
                    break;
            }
            this._vertices[bufi++] = -1;
            this._vertices[bufi++] = -1;
            this._vertices[bufi++] = 0;
            this._vertices[bufi++] = cornerY;
            bufi = (bufStart += floatStride);
            this._vertices[bufi++] = 1;
            this._vertices[bufi++] = -1;
            this._vertices[bufi++] = 1;
            this._vertices[bufi++] = cornerY;
            bufi = bufStart += floatStride;
            this._vertices[bufi++] = 1;
            this._vertices[bufi++] = 1;
            this._vertices[bufi++] = 1;
            this._vertices[bufi++] = cornerY + cornerYSegement;
            bufi = bufStart += floatStride;
            this._vertices[bufi++] = -1;
            this._vertices[bufi++] = 1;
            this._vertices[bufi++] = 0;
            this._vertices[bufi++] = cornerY + cornerYSegement;
            bufi = bufStart += floatStride;
        }
    }
    update(elapsedTime) {
        this._currentTime += elapsedTime / 1000;
        this.retireActiveParticles();
        this.freeRetiredParticles();
        if (this._firstActiveElement == this._firstFreeElement)
            this._currentTime = 0;
        if (this._firstRetiredElement == this._firstActiveElement)
            this._drawCounter = 0;
    }
    /** 注销活动粒子 */
    retireActiveParticles() {
        var epsilon = 0.0001;
        var particleDuration = this.settings.duration;
        while (this._firstActiveElement != this._firstNewElement) {
            var offset = this._firstActiveElement * this._floatCountPerVertex * 4;
            var index = offset + 28;
            var particleAge = this._currentTime - this._vertices[index];
            particleAge *= (1.0 + this._vertices[offset + 27]);
            if (particleAge + epsilon < particleDuration)
                break;
            this._vertices[index] = this._drawCounter;
            this._firstActiveElement++;
            if (this._firstActiveElement >= this.settings.maxPartices)
                this._firstActiveElement = 0;
        }
    }
    /** 注销自由粒子 */
    freeRetiredParticles() {
        while (this._firstRetiredElement != this._firstActiveElement) {
            var age = this._drawCounter - this._vertices[this._firstRetiredElement * this._floatCountPerVertex * 4 + 28];
            if (age < 3)
                break;
            this._firstRetiredElement++;
            if (this._firstRetiredElement >= this.settings.maxPartices)
                this._firstRetiredElement = 0;
        }
    }
    addNewParticlesToVertexBuffer() {
    }
    //由于循环队列判断算法，
    //当下一个freeParticle等于retiredParticle时不添加例子，意味循环队列中永远有一个空位。
    //（由于此判断算法快速、简单，所以放弃了使循环队列饱和的复杂算法（需判断freeParticle在retiredParticle前、后两种情况并不同处理））
    addParticleArray(position, velocity) {
        var nextFreeParticle = this._firstFreeElement + 1;
        if (nextFreeParticle >= this.settings.maxPartices)
            nextFreeParticle = 0;
        if (nextFreeParticle === this._firstRetiredElement)
            return;
        var particleData = ParticleData_1.default.Create(this.settings, position, velocity, this._currentTime);
        var startIndex = this._firstFreeElement * this._floatCountPerVertex * 4;
        for (var i = 0; i < 4; i++) {
            var j = 0, offset = 0;
            for (j = 0, offset = 4; j < 3; j++)
                this._vertices[startIndex + i * this._floatCountPerVertex + offset + j] = particleData.position[j];
            for (j = 0, offset = 7; j < 3; j++)
                this._vertices[startIndex + i * this._floatCountPerVertex + offset + j] = particleData.velocity[j];
            for (j = 0, offset = 10; j < 4; j++)
                this._vertices[startIndex + i * this._floatCountPerVertex + offset + j] = particleData.startColor[j];
            for (j = 0, offset = 14; j < 4; j++)
                this._vertices[startIndex + i * this._floatCountPerVertex + offset + j] = particleData.endColor[j];
            for (j = 0, offset = 18; j < 3; j++)
                this._vertices[startIndex + i * this._floatCountPerVertex + offset + j] = particleData.sizeRotation[j];
            for (j = 0, offset = 21; j < 2; j++)
                this._vertices[startIndex + i * this._floatCountPerVertex + offset + j] = particleData.radius[j];
            for (j = 0, offset = 23; j < 4; j++)
                this._vertices[startIndex + i * this._floatCountPerVertex + offset + j] = particleData.radian[j];
            this._vertices[startIndex + i * this._floatCountPerVertex + 27] = particleData.durationAddScale;
            this._vertices[startIndex + i * this._floatCountPerVertex + 28] = particleData.time;
        }
        this._firstFreeElement = nextFreeParticle;
    }
}
exports.default = ParticleTemplateWebGL;
},{"./ParticleData":10,"./ParticleTemplateBase":15}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Texture = Laya.Texture;
var Render = Laya.Render;
var HTMLCanvas = Laya.HTMLCanvas;
class PicTool {
    static getCanvasPic(img, color) {
        img = img.bitmap;
        var canvas = new HTMLCanvas();
        var ctx = canvas.getContext('2d');
        canvas.size(img.width, img.height);
        var red = (color >> 16 & 0xFF);
        var green = (color >> 8 & 0xFF);
        var blue = (color & 0xFF);
        if (Render.isConchApp) {
            ctx.setFilter(red / 255, green / 255, blue / 255, 0);
        }
        ctx.drawImage(img.source || img._source, 0, 0);
        if (!Render.isConchApp) {
            var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = imgdata.data;
            for (var i = 0, n = data.length; i < n; i += 4) {
                if (data[i + 3] == 0)
                    continue;
                data[i] = red;
                data[i + 1] = green;
                data[i + 2] = blue;
            }
            ctx.putImageData(imgdata, 0, 0);
        }
        return canvas;
    }
    static getRGBPic(img) {
        var rst;
        rst = [
            new Texture(PicTool.getCanvasPic(img, 0xFF0000)),
            new Texture(PicTool.getCanvasPic(img, 0x00FF00)),
            new Texture(PicTool.getCanvasPic(img, 0x0000FF))
        ];
        return rst;
    }
}
exports.default = PicTool;
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL1Byb2dyYW0gRmlsZXMvTGF5YUFpcklERTIuMC9yZXNvdXJjZXMvYXBwL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQXNzZXRNYW5hZ2VyLnRzIiwic3JjL0dhbWUudHMiLCJzcmMvR2FtZUNvbmZpZy50cyIsInNyYy9NYWluLnRzIiwic3JjL3BhcnRpY2xlL0NNRFBhcnRpY2xlLnRzIiwic3JjL3BhcnRpY2xlL0NhbnZhc1NoYWRlci50cyIsInNyYy9wYXJ0aWNsZS9FbWl0dGVyMkQudHMiLCJzcmMvcGFydGljbGUvRW1pdHRlckJhc2UudHMiLCJzcmMvcGFydGljbGUvUGFydGljbGUyRC50cyIsInNyYy9wYXJ0aWNsZS9QYXJ0aWNsZURhdGEudHMiLCJzcmMvcGFydGljbGUvUGFydGljbGVTZXR0aW5nLnRzIiwic3JjL3BhcnRpY2xlL1BhcnRpY2xlU2hhZGVyLnRzIiwic3JjL3BhcnRpY2xlL1BhcnRpY2xlU2hhZGVyVmFsdWUudHMiLCJzcmMvcGFydGljbGUvUGFydGljbGVUZW1wbGF0ZTJELnRzIiwic3JjL3BhcnRpY2xlL1BhcnRpY2xlVGVtcGxhdGVCYXNlLnRzIiwic3JjL3BhcnRpY2xlL1BhcnRpY2xlVGVtcGxhdGVDYW52YXMudHMiLCJzcmMvcGFydGljbGUvUGFydGljbGVUZW1wbGF0ZVdlYkdMLnRzIiwic3JjL3BhcnRpY2xlL1BpY1Rvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVkEsSUFBTyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUU5QjtJQUdJLE9BQU87SUFDUCxJQUFJLENBQUMsSUFBWSxFQUFFLFFBQWtCLEVBQUUsTUFBVSxFQUFFLE9BQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJO1FBRTlFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxD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TSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUMsUUFBUSxFQUFDLFFBQVEsRUFBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDeEYsSUFBSSxVQUFVLEdBQUMsSUFBSSxDQUFDLGlCQUFpQixHQUFFLElBQUksQ0FBQyxvQkFBb0IsR0FBRSxDQUFDLENBQUM7UUFDcEUsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBQztZQUN0QixJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQztZQUNqQixLQUFLLENBQUMsR0FBQyxDQUFDLEVBQUMsTUFBTSxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUMsQ0FBQyxHQUFFLElBQUksQ0FBQyxvQkFBb0IsR0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLEdBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRixLQUFLLENBQUMsR0FBQyxDQUFDLEVBQUMsTUFBTSxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUMsQ0FBQyxHQUFFLElBQUksQ0FBQyxvQkFBb0IsR0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLEdBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRixLQUFLLENBQUMsR0FBQyxDQUFDLEVBQUMsTUFBTSxHQUFDLEVBQUUsRUFBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUMsQ0FBQyxHQUFFLElBQUksQ0FBQyxvQkFBb0IsR0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLEdBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RixLQUFLLENBQUMsR0FBQyxDQUFDLEVBQUMsTUFBTSxHQUFDLEVBQUUsRUFBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUMsQ0FBQyxHQUFFLElBQUksQ0FBQyxvQkFBb0IsR0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLEdBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRixLQUFLLENBQUMsR0FBQyxDQUFDLEVBQUMsTUFBTSxHQUFDLEVBQUUsRUFBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUMsQ0FBQyxHQUFFLElBQUksQ0FBQyxvQkFBb0IsR0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLEdBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RixLQUFLLENBQUMsR0FBQyxDQUFDLEVBQUMsTUFBTSxHQUFDLEVBQUUsRUFBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUMsQ0FBQyxHQUFFLElBQUksQ0FBQyxvQkFBb0IsR0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLEdBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RixLQUFLLENBQUMsR0FBQyxDQUFDLEVBQUMsTUFBTSxHQUFDLEVBQUUsRUFBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUMsQ0FBQyxHQUFFLElBQUksQ0FBQyxvQkFBb0IsR0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLEdBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBQyxDQUFDLEdBQUUsSUFBSSxDQUFDLG9CQUFvQixHQUFDLEVBQUUsQ0FBQyxHQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQztZQUN6RixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBQyxDQUFDLEdBQUUsSUFBSSxDQUFDLG9CQUFvQixHQUFDLEVBQUUsQ0FBQyxHQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7U0FDN0U7UUFDRCxJQUFJLENBQUMsaUJBQWlCLEdBQUMsZ0JBQWdCLENBQUM7SUFFdEMsQ0FBQztDQUNKO0FBdEtELHdDQXNLQzs7OztBQzVLRCxJQUFPLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzlCLElBQU8sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDNUIsSUFBTyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUVwQztJQUdJLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBUSxFQUFFLEtBQWE7UUFFdkMsR0FBRyxHQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDckIsSUFBSSxNQUFNLEdBQUMsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUM1QixJQUFJLEdBQUcsR0FBTSxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkMsSUFBSSxHQUFHLEdBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzdCLElBQUksS0FBSyxHQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUN4QixJQUFJLElBQUksR0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQztRQUV4QixJQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQ3BCO1lBQ0wsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUMsR0FBRyxFQUFDLEtBQUssR0FBQyxHQUFHLEVBQUMsSUFBSSxHQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQztTQUN0QztRQUVELEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBRSxHQUFHLENBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFDdEI7WUFDTCxJQUFJLE9BQU8sR0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsTUFBTSxDQUFDLEtBQUssRUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0QsSUFBSSxJQUFJLEdBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNiLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBTSxFQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxJQUFFLENBQUMsRUFDckM7Z0JBQ1IsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxJQUFFLENBQUM7b0JBQUMsU0FBVTtnQkFDM0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQztnQkFDWixJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFDLEtBQUssQ0FBQztnQkFDaEIsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUM7YUFDZjtZQUNELEdBQUcsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztTQUM5QjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBRVosQ0FBQztJQUdELE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBUTtRQUVyQixJQUFJLEdBQUcsQ0FBQztRQUNSLEdBQUcsR0FBQztZQUNBLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9DLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9DLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2xELENBQUM7UUFDUixPQUFPLEdBQUcsQ0FBQztJQUNULENBQUM7Q0FDSjtBQWhERCwwQkFnREMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IEhhbmRsZXIgPSBMYXlhLkhhbmRsZXI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBc3NldE1hbmFnZXJcclxue1xyXG4gICAgXHJcbiAgICAvLyDliqDovb3otYTmupBcclxuICAgIGxvYWQocGF0aDogc3RyaW5nLCBjb21wbGV0ZTogRnVuY3Rpb24sIGNhbGxlcjphbnksIHR5cGU6IHN0cmluZyA9IExheWEuTG9hZGVyLlRFWFQpXHJcbiAgICB7XHJcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZChwYXRoLCBcclxuICAgICAgICAgICAgSGFuZGxlci5jcmVhdGUobnVsbCwgKHJlczogYW55KSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tcGxldGUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxlcilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlLmFwcGx5KGNhbGxlciwgW3Jlc10pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZShyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSksIFxyXG4gICAgICAgICAgICBudWxsLCB0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIC8vIOWKoOi9vei1hOa6kCwg5byC5q2lXHJcbiAgICBhc3luYyBsb2FkQXN5bmMocGF0aDogc3RyaW5nLCB0eXBlOiBzdHJpbmcgPSBMYXlhLkxvYWRlci5URVhUKTogUHJvbWlzZTxhbnk+XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKT0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQocGF0aCwgKHJlczogYW55KT0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzKTtcclxuICAgICAgICAgICAgfSwgbnVsbCwgdHlwZSk7XHJcbiAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOWKoOi9vVNoYWRlclxyXG4gICAgYXN5bmMgbG9hZFNoYWRlclZTQXN5bmMoZmlsZW5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPlxyXG4gICAge1xyXG4gICAgICAgIGxldCBjb2RlID0gYXdhaXQgdGhpcy5sb2FkQXN5bmMoYHJlcy9zaGFkZXJzLyR7ZmlsZW5hbWV9LnZzYCwgTGF5YS5Mb2FkZXIuVEVYVCk7XHJcbiAgICAgICAgcmV0dXJuIGNvZGUucmVwbGFjZSgvXFxyL2csIFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOWKoOi9vVNoYWRlclxyXG4gICAgYXN5bmMgbG9hZFNoYWRlclBTQXN5bmMoZmlsZW5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPlxyXG4gICAge1xyXG4gICAgICAgIGxldCBjb2RlID0gIGF3YWl0IHRoaXMubG9hZEFzeW5jKGByZXMvc2hhZGVycy8ke2ZpbGVuYW1lfS5mc2AsIExheWEuTG9hZGVyLlRFWFQpO1xyXG4gICAgICAgIHJldHVybiBjb2RlLnJlcGxhY2UoL1xcci9nLCBcIlwiKTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgQXNzZXRNYW5hZ2VyIGZyb20gXCIuL0Fzc2V0TWFuYWdlclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZVxyXG57XHJcbiAgICAvLyDotYTmupBcclxuICAgIHN0YXRpYyBhc3NldDogQXNzZXRNYW5hZ2VyID0gbmV3IEFzc2V0TWFuYWdlcigpO1xyXG5cclxufSIsIi8qKlRoaXMgY2xhc3MgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgTGF5YUFpcklERSwgcGxlYXNlIGRvIG5vdCBtYWtlIGFueSBtb2RpZmljYXRpb25zLiAqL1xyXG5pbXBvcnQgR2FtZVVJIGZyb20gXCIuL3NjcmlwdC9HYW1lVUlcIlxyXG5pbXBvcnQgR2FtZUNvbnRyb2wgZnJvbSBcIi4vc2NyaXB0L0dhbWVDb250cm9sXCJcclxuaW1wb3J0IEJ1bGxldCBmcm9tIFwiLi9zY3JpcHQvQnVsbGV0XCJcclxuaW1wb3J0IERyb3BCb3ggZnJvbSBcIi4vc2NyaXB0L0Ryb3BCb3hcIlxyXG5pbXBvcnQgUGFydGljbGUyRCBmcm9tIFwiLi9wYXJ0aWNsZS9QYXJ0aWNsZTJEXCI7XHJcbi8qXHJcbiog5ri45oiP5Yid5aeL5YyW6YWN572uO1xyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29uZmlne1xyXG4gICAgc3RhdGljIHdpZHRoOm51bWJlcj02NDA7XHJcbiAgICBzdGF0aWMgaGVpZ2h0Om51bWJlcj0xMTM2O1xyXG4gICAgc3RhdGljIHNjYWxlTW9kZTpzdHJpbmc9XCJmaXhlZHdpZHRoXCI7XHJcbiAgICBzdGF0aWMgc2NyZWVuTW9kZTpzdHJpbmc9XCJub25lXCI7XHJcbiAgICBzdGF0aWMgYWxpZ25WOnN0cmluZz1cInRvcFwiO1xyXG4gICAgc3RhdGljIGFsaWduSDpzdHJpbmc9XCJsZWZ0XCI7XHJcbiAgICBzdGF0aWMgc3RhcnRTY2VuZTphbnk9XCJBU2NlYmUuc2NlbmVcIjtcclxuICAgIHN0YXRpYyBzY2VuZVJvb3Q6c3RyaW5nPVwiXCI7XHJcbiAgICBzdGF0aWMgZGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBzdGF0OmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgcGh5c2ljc0RlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgZXhwb3J0U2NlbmVUb0pzb246Ym9vbGVhbj10cnVlO1xyXG4gICAgY29uc3RydWN0b3IoKXt9XHJcbiAgICBzdGF0aWMgaW5pdCgpe1xyXG4gICAgICAgIHZhciByZWc6IEZ1bmN0aW9uID0gTGF5YS5DbGFzc1V0aWxzLnJlZ0NsYXNzO1xyXG4gICAgICAgIC8vIHJlZyhcIlBhcnRpY2xlMkRcIiwgUGFydGljbGUyRCk7XHJcbiAgICAgICAgLy8gcmVnKFwic2NyaXB0L0dhbWVVSS50c1wiLEdhbWVVSSk7XHJcbiAgICAgICAgLy8gcmVnKFwic2NyaXB0L0dhbWVDb250cm9sLnRzXCIsR2FtZUNvbnRyb2wpO1xyXG4gICAgICAgIC8vIHJlZyhcInNjcmlwdC9CdWxsZXQudHNcIixCdWxsZXQpO1xyXG4gICAgICAgIC8vIHJlZyhcInNjcmlwdC9Ecm9wQm94LnRzXCIsRHJvcEJveCk7XHJcbiAgICB9XHJcbn1cclxuR2FtZUNvbmZpZy5pbml0KCk7IiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4vR2FtZUNvbmZpZ1wiO1xyXG5cclxuaW1wb3J0IExvYWRlciA9IExheWEuTG9hZGVyO1xyXG5pbXBvcnQgUGFydGljbGVTaGFkZXIgZnJvbSBcIi4vcGFydGljbGUvUGFydGljbGVTaGFkZXJcIjtcclxuaW1wb3J0IEdhbWUgZnJvbSBcIi4vR2FtZVwiO1xyXG5pbXBvcnQgUGFydGljbGUyRCBmcm9tIFwiLi9wYXJ0aWNsZS9QYXJ0aWNsZTJEXCI7XHJcbmltcG9ydCBQYXJ0aWNsZVNldHRpbmcgZnJvbSBcIi4vcGFydGljbGUvUGFydGljbGVTZXR0aW5nXCI7XHJcbi8vIGltcG9ydCBQYXJ0aWNsZTJEID0gTGF5YS5QYXJ0aWNsZTJEO1xyXG5cclxuY2xhc3MgTWFpbiB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHQvL+agueaNrklEReiuvue9ruWIneWni+WMluW8leaTjlx0XHRcclxuXHRcdGlmICh3aW5kb3dbXCJMYXlhM0RcIl0pIExheWEzRC5pbml0KEdhbWVDb25maWcud2lkdGgsIEdhbWVDb25maWcuaGVpZ2h0KTtcclxuXHRcdGVsc2UgTGF5YS5pbml0KEdhbWVDb25maWcud2lkdGgsIEdhbWVDb25maWcuaGVpZ2h0LCBMYXlhW1wiV2ViR0xcIl0pO1xyXG5cdFx0TGF5YVtcIlBoeXNpY3NcIl0gJiYgTGF5YVtcIlBoeXNpY3NcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhW1wiRGVidWdQYW5lbFwiXSAmJiBMYXlhW1wiRGVidWdQYW5lbFwiXS5lbmFibGUoKTtcclxuXHRcdExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gR2FtZUNvbmZpZy5zY2FsZU1vZGU7XHJcblx0XHRMYXlhLnN0YWdlLnNjcmVlbk1vZGUgPSBHYW1lQ29uZmlnLnNjcmVlbk1vZGU7XHJcblx0XHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXHJcblx0XHRMYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdhbWVDb25maWcuZXhwb3J0U2NlbmVUb0pzb247XHJcblxyXG5cdFx0Ly/miZPlvIDosIPor5XpnaLmnb/vvIjpgJrov4dJREXorr7nva7osIPor5XmqKHlvI/vvIzmiJbogIV1cmzlnLDlnYDlop7liqBkZWJ1Zz10cnVl5Y+C5pWw77yM5Z2H5Y+v5omT5byA6LCD6K+V6Z2i5p2/77yJXHJcblx0XHRpZiAoR2FtZUNvbmZpZy5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xyXG5cdFx0aWYgKEdhbWVDb25maWcucGh5c2ljc0RlYnVnICYmIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdKSBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXS5lbmFibGUoKTtcclxuXHRcdGlmIChHYW1lQ29uZmlnLnN0YXQpIExheWEuU3RhdC5zaG93KCk7XHJcblx0XHRMYXlhLmFsZXJ0R2xvYmFsRXJyb3IgPSB0cnVlO1xyXG5cclxuXHRcdC8v5r+A5rS76LWE5rqQ54mI5pys5o6n5Yi277yMdmVyc2lvbi5qc29u55SxSURF5Y+R5biD5Yqf6IO96Ieq5Yqo55Sf5oiQ77yM5aaC5p6c5rKh5pyJ5Lmf5LiN5b2x5ZON5ZCO57ut5rWB56iLXHJcblx0XHQvLyBMYXlhLlJlc291cmNlVmVyc2lvbi5lbmFibGUoXCJ2ZXJzaW9uLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uVmVyc2lvbkxvYWRlZCksIExheWEuUmVzb3VyY2VWZXJzaW9uLkZJTEVOQU1FX1ZFUlNJT04pO1xyXG5cclxuXHJcblx0XHQvLyBMYXlhLmxvYWRlci5sb2FkKFwicmVzL3BhcnRpY2xlcy9wYXJ0aWNsZU5ldy5wYXJ0XCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkFzc2V0c0xvYWRlZCksIG51bGwsIExvYWRlci5KU09OKTtcclxuXHRcdC8vIExheWEubG9hZGVyLmxvYWQoXCJyZXMvcGFydGljbGVzL0FBQS5wYXJ0XCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkFzc2V0c0xvYWRlZCksIG51bGwsIExvYWRlci5KU09OKTtcclxuXHRcdHRoaXMuSW5pdFN5bmMoKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc3A6IFBhcnRpY2xlMkQ7XHJcblx0cHVibGljIG9uQXNzZXRzTG9hZGVkKHNldHRpbmdzOiBQYXJ0aWNsZVNldHRpbmcpOiB2b2lkIHtcclxuXHRcdHRoaXMuc3AgPSBuZXcgUGFydGljbGUyRChzZXR0aW5ncyk7XHJcblx0XHR0aGlzLnNwLmVtaXR0ZXIuc3RhcnQoKTtcclxuXHRcdHRoaXMuc3AucGxheSgpO1xyXG5cdFx0TGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzLnNwKTtcclxuXHJcblx0XHR0aGlzLnNwLnggPSBMYXlhLnN0YWdlLndpZHRoIC8gMjtcclxuXHRcdHRoaXMuc3AueSA9IExheWEuc3RhZ2UuaGVpZ2h0IC8gMjtcclxuXHRcdHdpbmRvd1sncHAnXSA9IHRoaXMuc3A7XHJcblx0XHR0aGlzLnNwLmdyYXBoaWNzLmRyYXdDaXJjbGUoMCwgMCwgMzAsICcjRkYwMDAwJywgJyMwMEZGMDAnLCA1KTtcclxuXHJcblx0XHRMYXlhLnN0YWdlLm9uKExheWEuRXZlbnQuTU9VU0VfRE9XTiwgdGhpcywgdGhpcy5vbk1vdXNlRG93bik7XHJcblx0XHRMYXlhLnN0YWdlLm9mZihMYXlhLkV2ZW50Lk1PVVNFX1VQLCB0aGlzLCB0aGlzLm9uTW91c2VEb3duKTtcclxuXHR9XHJcblxyXG5cdG9uTW91c2VEb3duKClcclxuXHR7XHJcblx0XHRMYXlhLnN0YWdlLm9uKExheWEuRXZlbnQuTU9VU0VfTU9WRSwgdGhpcywgdGhpcy5vbk1vdXNlTW92ZSk7XHJcblx0fVxyXG5cclxuXHRvbk1vdXNlTW92ZShlOkxheWEuRXZlbnQpXHJcblx0e1xyXG5cdFx0dGhpcy5zcC54ID0gZS5zdGFnZVg7XHJcblx0XHR0aGlzLnNwLnkgPSBlLnN0YWdlWTtcclxuXHR9XHJcblxyXG5cclxuXHRvblZlcnNpb25Mb2FkZWQoKTogdm9pZCB7XHJcblx0XHQvL+a/gOa0u+Wkp+Wwj+WbvuaYoOWwhO+8jOWKoOi9veWwj+WbvueahOaXtuWAme+8jOWmguaenOWPkeeOsOWwj+WbvuWcqOWkp+WbvuWQiOmbhumHjOmdou+8jOWImeS8mOWFiOWKoOi9veWkp+WbvuWQiOmbhu+8jOiAjOS4jeaYr+Wwj+WbvlxyXG5cdFx0TGF5YS5BdGxhc0luZm9NYW5hZ2VyLmVuYWJsZShcImZpbGVjb25maWcuanNvblwiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Db25maWdMb2FkZWQpKTtcclxuXHR9XHJcblxyXG5cdG9uQ29uZmlnTG9hZGVkKCk6IHZvaWQge1xyXG5cdFx0Ly/liqDovb1JREXmjIflrprnmoTlnLrmma9cclxuXHRcdEdhbWVDb25maWcuc3RhcnRTY2VuZSAmJiBMYXlhLlNjZW5lLm9wZW4oR2FtZUNvbmZpZy5zdGFydFNjZW5lKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIEluaXRTeW5jKClcclxuXHR7XHJcblx0XHRhd2FpdCBQYXJ0aWNsZVNoYWRlci5pbnN0YWxsKCk7XHJcblx0XHRsZXQgc2V0dGluZ3M6UGFydGljbGVTZXR0aW5nID0gYXdhaXQgR2FtZS5hc3NldC5sb2FkQXN5bmMoXCJyZXMvcGFydGljbGVzL0FBQS5wYXJ0XCIsIExvYWRlci5KU09OKTtcclxuXHRcdHRoaXMub25Bc3NldHNMb2FkZWQoc2V0dGluZ3MpO1xyXG5cdH1cclxufVxyXG4vL+a/gOa0u+WQr+WKqOexu1xyXG5uZXcgTWFpbigpO1xyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDTURQYXJ0aWNsZVxyXG57XHJcbiAgICAvKipcclxuICAgICrmnIDlpKfluKdcclxuICAgICovXHJcbiAgICBtYXhJbmRleDogbnVtYmVyPTA7XHJcbiAgICAvKipcclxuICAgICrluKflkb3ku6TmlbDnu4RcclxuICAgICovXHJcbiAgICBjbWRzOiBBcnJheTxhbnk+PW51bGw7XHJcbiAgICAvKipcclxuICAgICrnspLlrZBpZFxyXG4gICAgKi9cclxuICAgIGlkOiBudW1iZXI9MDtcclxuXHJcbiAgICBzZXRDbWRzKGNtZHM6IEFycmF5PGFueT4pXHJcbiAgICB7XHJcblx0XHR0aGlzLmNtZHM9Y21kcztcclxuXHRcdHRoaXMubWF4SW5kZXg9Y21kcy5sZW5ndGgtMTtcclxuICAgIH1cclxuXHJcblxyXG59IiwiaW1wb3J0IE1hdGhVdGlsID0gTGF5YS5NYXRoVXRpbDtcclxuaW1wb3J0IE1hdHJpeCA9IExheWEuTWF0cml4O1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc1NoYWRlclxyXG57XHJcbiAgICB1X0R1cmF0aW9uOiBudW1iZXIgPSBOYU47XHJcbiAgICB1X0VuZFZlbG9jaXR5OiBudW1iZXIgPSBOYU47XHJcbiAgICB1X0dyYXZpdHk6IEZsb2F0MzJBcnJheSA9IG51bGw7XHJcbiAgICBhX1Bvc2l0aW9uOiBGbG9hdDMyQXJyYXkgPSBudWxsO1xyXG4gICAgYV9WZWxvY2l0eTogRmxvYXQzMkFycmF5ID0gbnVsbDtcclxuICAgIGFfU3RhcnRDb2xvcjogRmxvYXQzMkFycmF5ID0gbnVsbDtcclxuICAgIGFfRW5kQ29sb3I6IEZsb2F0MzJBcnJheSA9IG51bGw7XHJcbiAgICBhX1NpemVSb3RhdGlvbjogRmxvYXQzMkFycmF5ID0gbnVsbDtcclxuICAgIGFfUmFkaXVzOiBGbG9hdDMyQXJyYXkgPSBudWxsO1xyXG4gICAgYV9SYWRpYW46IEZsb2F0MzJBcnJheSA9IG51bGw7XHJcbiAgICBhX0FnZUFkZFNjYWxlOiBudW1iZXIgPSBudWxsO1xyXG4gICAgZ2xfUG9zaXRpb246IEZsb2F0MzJBcnJheSA9IG51bGw7XHJcbiAgICB2X0NvbG9yOiBGbG9hdDMyQXJyYXkgPSBudWxsO1xyXG4gICAgb1NpemU6IG51bWJlciA9IE5hTjtcclxuXHJcbiAgICBfY29sb3IgPSBuZXcgRmxvYXQzMkFycmF5KDQpO1xyXG4gICAgX3Bvc2l0aW9uID0gbmV3IEZsb2F0MzJBcnJheSgzKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpXHJcbiAgICB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldExlbihwb3NpdGlvbjogRmxvYXQzMkFycmF5KTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChwb3NpdGlvblswXSAqcG9zaXRpb25bMF0rcG9zaXRpb25bMV0gKnBvc2l0aW9uWzFdK3Bvc2l0aW9uWzJdICpwb3NpdGlvblsyXSk7XHJcbiAgICB9XHJcblxyXG4gICAgQ29tcHV0ZVBhcnRpY2xlUG9zaXRpb24ocG9zaXRpb246IEZsb2F0MzJBcnJheSwgdmVsb2NpdHk6IEZsb2F0MzJBcnJheSwgYWdlOiBudW1iZXIsIG5vcm1hbGl6ZWRBZ2U6IG51bWJlcik6IEZsb2F0MzJBcnJheVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uWzBdPXBvc2l0aW9uWzBdO1xyXG5cdFx0dGhpcy5fcG9zaXRpb25bMV09cG9zaXRpb25bMV07XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb25bMl09cG9zaXRpb25bMl07XHJcbiAgICAgICAgXHJcblx0XHR2YXIgc3RhcnRWZWxvY2l0eT10aGlzLmdldExlbih2ZWxvY2l0eSk7XHJcblx0XHR2YXIgZW5kVmVsb2NpdHk9c3RhcnRWZWxvY2l0eSAqdGhpcy51X0VuZFZlbG9jaXR5O1xyXG5cdFx0dmFyIHZlbG9jaXR5SW50ZWdyYWw9c3RhcnRWZWxvY2l0eSAqbm9ybWFsaXplZEFnZSsoZW5kVmVsb2NpdHktc3RhcnRWZWxvY2l0eSkqbm9ybWFsaXplZEFnZSAqbm9ybWFsaXplZEFnZSAvIDIuMDtcclxuXHRcdHZhciBsZW5WZWxvY2l0eT1OYU47XHJcblx0XHRsZW5WZWxvY2l0eT10aGlzLmdldExlbih2ZWxvY2l0eSk7XHJcblx0XHR2YXIgaT0wLGxlbj0wO1xyXG5cdFx0bGVuPTM7XHJcbiAgICAgICAgZm9yIChpPTA7aSA8IGxlbjtpKyspXHJcbiAgICAgICAge1xyXG5cdFx0XHR0aGlzLl9wb3NpdGlvbltpXT10aGlzLl9wb3NpdGlvbltpXSsodmVsb2NpdHlbaV0gLyBsZW5WZWxvY2l0eSkqdmVsb2NpdHlJbnRlZ3JhbCAqdGhpcy51X0R1cmF0aW9uO1xyXG5cdFx0XHR0aGlzLl9wb3NpdGlvbltpXSs9dGhpcy51X0dyYXZpdHlbaV0gKmFnZSAqbm9ybWFsaXplZEFnZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG5cdFx0dmFyIHJhZGl1cz0gTWF0aFV0aWwubGVycCh0aGlzLmFfUmFkaXVzWzBdLHRoaXMuYV9SYWRpdXNbMV0sbm9ybWFsaXplZEFnZSk7XHJcblx0XHR2YXIgcmFkaWFuSG9yaXpvbnRhbD0gTWF0aFV0aWwubGVycCh0aGlzLmFfUmFkaWFuWzBdLHRoaXMuYV9SYWRpYW5bMl0sbm9ybWFsaXplZEFnZSk7XHJcblx0XHR2YXIgcmFkaWFuVmVydGljYWw9IE1hdGhVdGlsLmxlcnAodGhpcy5hX1JhZGlhblsxXSx0aGlzLmFfUmFkaWFuWzNdLG5vcm1hbGl6ZWRBZ2UpO1xyXG5cdFx0dmFyIHI9TWF0aC5jb3MocmFkaWFuVmVydGljYWwpKnJhZGl1cztcclxuXHRcdHRoaXMuX3Bvc2l0aW9uWzFdKz1NYXRoLnNpbihyYWRpYW5WZXJ0aWNhbCkqcmFkaXVzO1xyXG5cdFx0dGhpcy5fcG9zaXRpb25bMF0rPU1hdGguY29zKHJhZGlhbkhvcml6b250YWwpKnI7XHJcblx0XHR0aGlzLl9wb3NpdGlvblsyXSs9TWF0aC5zaW4ocmFkaWFuSG9yaXpvbnRhbCkqcjtcclxuXHRcdHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt0aGlzLl9wb3NpdGlvblswXSx0aGlzLl9wb3NpdGlvblsxXSwwLjAsMS4wXSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIENvbXB1dGVQYXJ0aWNsZVNpemUoc3RhcnRTaXplOiBudW1iZXIsIGVuZFNpemU6IG51bWJlciwgbm9ybWFsaXplZEFnZTogbnVtYmVyKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNpemU9TWF0aFV0aWwubGVycChzdGFydFNpemUsZW5kU2l6ZSxub3JtYWxpemVkQWdlKTtcclxuXHRcdHJldHVybiBzaXplO1xyXG4gICAgfVxyXG5cclxuICAgIENvbXB1dGVQYXJ0aWNsZVJvdGF0aW9uKHJvdDogbnVtYmVyLCBhZ2U6IG51bWJlcik6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiByb3QgKmFnZTtcclxuICAgIH1cclxuXHJcbiAgICBDb21wdXRlUGFydGljbGVDb2xvcihzdGFydENvbG9yOiBGbG9hdDMyQXJyYXksIGVuZENvbG9yOiBGbG9hdDMyQXJyYXksIG5vcm1hbGl6ZWRBZ2U6IG51bWJlcik6IEZsb2F0MzJBcnJheVxyXG4gICAge1xyXG4gICAgICAgIHZhciByc3Q9dGhpcy5fY29sb3I7XHJcblx0XHRNYXRoVXRpbC5sZXJwVmVjdG9yNChzdGFydENvbG9yLGVuZENvbG9yLG5vcm1hbGl6ZWRBZ2UscnN0KTtcclxuXHRcdHJzdFszXT1yc3RbM10qbm9ybWFsaXplZEFnZSAqKDEuMC1ub3JtYWxpemVkQWdlKSooMS4wLW5vcm1hbGl6ZWRBZ2UpKjYuNztcclxuXHRcdHJldHVybiByc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgY2xhbXAodmFsdWU6IG51bWJlciwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgaWYodmFsdWU8bWluKXJldHVybiBtaW47XHJcblx0XHRpZih2YWx1ZT5tYXgpcmV0dXJuIG1heDtcclxuXHRcdHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREYXRhKGFnZTogbnVtYmVyKTogQXJyYXk8YW55PlxyXG4gICAge1xyXG4gICAgICAgIGFnZSAqPTEuMCt0aGlzLmFfQWdlQWRkU2NhbGU7XHJcblx0XHR2YXIgbm9ybWFsaXplZEFnZT10aGlzLmNsYW1wKGFnZSAvIHRoaXMudV9EdXJhdGlvbiwwLjAsMS4wKTtcclxuXHRcdHRoaXMuZ2xfUG9zaXRpb249dGhpcy5Db21wdXRlUGFydGljbGVQb3NpdGlvbih0aGlzLmFfUG9zaXRpb24sdGhpcy5hX1ZlbG9jaXR5LGFnZSxub3JtYWxpemVkQWdlKTtcclxuXHRcdHZhciBwU2l6ZT10aGlzLkNvbXB1dGVQYXJ0aWNsZVNpemUodGhpcy5hX1NpemVSb3RhdGlvblswXSx0aGlzLmFfU2l6ZVJvdGF0aW9uWzFdLG5vcm1hbGl6ZWRBZ2UpO1xyXG5cdFx0dmFyIHJvdGF0aW9uPXRoaXMuQ29tcHV0ZVBhcnRpY2xlUm90YXRpb24odGhpcy5hX1NpemVSb3RhdGlvblsyXSxhZ2UpO1xyXG5cdFx0dGhpcy52X0NvbG9yPXRoaXMuQ29tcHV0ZVBhcnRpY2xlQ29sb3IodGhpcy5hX1N0YXJ0Q29sb3IsdGhpcy5hX0VuZENvbG9yLG5vcm1hbGl6ZWRBZ2UpO1xyXG5cdFx0dmFyIG1hdHJpYz1uZXcgTWF0cml4KCk7XHJcblx0XHR2YXIgc2NhbGU9TmFOO1xyXG5cdFx0c2NhbGU9cFNpemUvdGhpcy5vU2l6ZSoyO1xyXG5cdFx0bWF0cmljLnNjYWxlKHNjYWxlLHNjYWxlKTtcclxuXHRcdG1hdHJpYy5yb3RhdGUocm90YXRpb24pO1xyXG5cdFx0bWF0cmljLnNldFRyYW5zbGF0ZSh0aGlzLmdsX1Bvc2l0aW9uWzBdLC10aGlzLmdsX1Bvc2l0aW9uWzFdKTtcclxuXHRcdHZhciBhbHBoYT1OYU47XHJcblx0XHRhbHBoYT10aGlzLnZfQ29sb3JbM107XHJcblx0XHRyZXR1cm4gW3RoaXMudl9Db2xvcixhbHBoYSxtYXRyaWMsdGhpcy52X0NvbG9yWzBdKmFscGhhLHRoaXMudl9Db2xvclsxXSphbHBoYSx0aGlzLnZfQ29sb3JbMl0qYWxwaGFdO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBQYXJ0aWNsZVRlbXBsYXRlQmFzZSBmcm9tIFwiLi9QYXJ0aWNsZVRlbXBsYXRlQmFzZVwiO1xyXG5pbXBvcnQgRW1pdHRlckJhc2UgZnJvbSBcIi4vRW1pdHRlckJhc2VcIjtcclxuaW1wb3J0IFBhcnRpY2xlU2V0dGluZyBmcm9tIFwiLi9QYXJ0aWNsZVNldHRpbmdcIjtcclxuaW1wb3J0IFBhcnRpY2xlVGVtcGxhdGVDYW52YXMgZnJvbSBcIi4vUGFydGljbGVUZW1wbGF0ZUNhbnZhc1wiO1xyXG5pbXBvcnQgUGFydGljbGVUZW1wbGF0ZTJEIGZyb20gXCIuL1BhcnRpY2xlVGVtcGxhdGUyRFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW1pdHRlcjJEIGV4dGVuZHMgRW1pdHRlckJhc2Vcclxue1xyXG4gICAgc2V0dGluZzogUGFydGljbGVTZXR0aW5nID0gbnVsbDtcclxuICAgIF9wb3NSYW5nZTogRmxvYXQzMkFycmF5ID0gbnVsbDtcclxuICAgIF9jYW52YXNUZW1wbGF0ZTpQYXJ0aWNsZVRlbXBsYXRlQ2FudmFzID0gbnVsbDtcclxuICAgIF9lbWl0RnVuOiBGdW5jdGlvbiA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoX3RlbXBsYXRlOiBQYXJ0aWNsZVRlbXBsYXRlQmFzZSlcclxuICAgIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBfdGVtcGxhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG5cdCrlj5HlsITkuIDkuKrnspLlrZBcclxuXHQqXHJcbiAgICAqL1xyXG4gICAgZW1pdCgpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIuZW1pdCgpO1xyXG4gICAgICAgIGlmKHRoaXMuX2VtaXRGdW4pXHJcbiAgICAgICAgICAgIHRoaXMuX2VtaXRGdW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSYW5kb20odmFsdWUpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICB3ZWJHTEVtaXQoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBwb3MgPSBuZXcgRmxvYXQzMkFycmF5KDMpO1xyXG4gICAgICAgIHBvc1swXSA9IHRoaXMuZ2V0UmFuZG9tKHRoaXMuX3Bvc1JhbmdlWzBdKTtcclxuICAgICAgICBwb3NbMV0gPSB0aGlzLmdldFJhbmRvbSh0aGlzLl9wb3NSYW5nZVsxXSk7XHJcbiAgICAgICAgcG9zWzJdID0gdGhpcy5nZXRSYW5kb20odGhpcy5fcG9zUmFuZ2VbMl0pO1xyXG5cclxuICAgICAgICBsZXQgdiA9IG5ldyBGbG9hdDMyQXJyYXkoMyk7XHJcbiAgICAgICAgdlswXSA9IDA7XHJcbiAgICAgICAgdlsxXSA9IDA7XHJcbiAgICAgICAgdlsyXSA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuX3BhcnRpY2xlVGVtcGxhdGUuYWRkUGFydGljbGVBcnJheShwb3MsIHYpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbnZhc0VtaXQoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBwb3MgPSBuZXcgRmxvYXQzMkFycmF5KDMpO1xyXG4gICAgICAgIHBvc1swXSA9IHRoaXMuZ2V0UmFuZG9tKHRoaXMuX3Bvc1JhbmdlWzBdKTtcclxuICAgICAgICBwb3NbMV0gPSB0aGlzLmdldFJhbmRvbSh0aGlzLl9wb3NSYW5nZVsxXSk7XHJcbiAgICAgICAgcG9zWzJdID0gdGhpcy5nZXRSYW5kb20odGhpcy5fcG9zUmFuZ2VbMl0pO1xyXG5cclxuICAgICAgICBsZXQgdiA9IG5ldyBGbG9hdDMyQXJyYXkoMyk7XHJcbiAgICAgICAgdlswXSA9IDA7XHJcbiAgICAgICAgdlsxXSA9IDA7XHJcbiAgICAgICAgdlsyXSA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuX3BhcnRpY2xlVGVtcGxhdGUuYWRkUGFydGljbGVBcnJheShwb3MsIHYpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0ZW1wbGF0ZSgpOlBhcnRpY2xlVGVtcGxhdGVCYXNlXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnRpY2xlVGVtcGxhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHRlbXBsYXRlKHRlbXBsYXRlOiBQYXJ0aWNsZVRlbXBsYXRlQmFzZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9wYXJ0aWNsZVRlbXBsYXRlID0gdGVtcGxhdGU7XHJcblxyXG4gICAgICAgIGlmKCF0ZW1wbGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VtaXRGdW4gPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmcgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9wb3NSYW5nZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldHRpbmcgPSB0ZW1wbGF0ZS5zZXR0aW5ncztcclxuICAgICAgICB0aGlzLl9wb3NSYW5nZSA9IHRoaXMuc2V0dGluZy5wb3NpdGlvblZhcmlhbmNlO1xyXG5cclxuICAgICAgICBpZih0aGlzLl9wYXJ0aWNsZVRlbXBsYXRlIGluc3RhbmNlb2YgUGFydGljbGVUZW1wbGF0ZTJEKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fZW1pdEZ1biA9IHRoaXMud2ViR0xFbWl0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuX3BhcnRpY2xlVGVtcGxhdGUgaW5zdGFuY2VvZiBQYXJ0aWNsZVRlbXBsYXRlQ2FudmFzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FudmFzVGVtcGxhdGUgPSA8UGFydGljbGVUZW1wbGF0ZUNhbnZhcz4gdGVtcGxhdGU7XHJcbiAgICAgICAgICAgIHRoaXMuX2VtaXRGdW4gPSB0aGlzLmNhbnZhc0VtaXQ7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUGFydGljbGVUZW1wbGF0ZUJhc2UgZnJvbSBcIi4vUGFydGljbGVUZW1wbGF0ZUJhc2VcIjtcclxuXHJcbi8qKlxyXG4qPGNvZGU+RW1pdHRlckJhc2U8L2NvZGU+IOexu+aYr+eykuWtkOWPkeWwhOWZqOexu1xyXG4qL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW1pdHRlckJhc2Vcclxue1xyXG4gICAgLyoqXHJcbiAgICAq56ev57Sv55qE5bin5pe26Ze0XHJcbiAgICAqL1xyXG4gICBfZnJhbWVUaW1lID0gMDtcclxuXHJcbiAgIC8qKlxyXG4gICAgKueykuWtkOWPkeWwhOmAn+eOh1xyXG4gICAgKi9cclxuICAgX2VtaXNzaW9uUmF0ZSA9IDYwO1xyXG5cclxuICAgLyoqXHJcbiAgICAq5b2T5YmN5Ymp5L2Z5Y+R5bCE5pe26Ze0XHJcbiAgICAqL1xyXG4gICBfZW1pc3Npb25UaW1lID0gMDtcclxuXHJcbiAgIC8qKlxyXG4gICAgKuWPkeWwhOeykuWtkOacgOWwj+aXtumXtOmXtOmalFxyXG4gICAgKi9cclxuICAgbWluRW1pc3Npb25UaW1lID0gMSAvIDYwO1xyXG5cclxuICAgcHJvdGVjdGVkIF9wYXJ0aWNsZVRlbXBsYXRlOiBQYXJ0aWNsZVRlbXBsYXRlQmFzZTtcclxuXHJcblxyXG4gICAvKipcclxuXHQq5byA5aeL5Y+R5bCE57KS5a2QXHJcblx0KkBwYXJhbSBkdXJhdGlvbiDlj5HlsITmjIHnu63nmoTml7bpl7Qo56eSKVxyXG4gICAgKi9cclxuICAgc3RhcnQoZHVyYXRpb24/OiBudW1iZXIpXHJcbiAgIHtcclxuICAgICAgIChkdXJhdGlvbj09PXZvaWQgMCkmJiAoZHVyYXRpb249TnVtYmVyLk1BWF9WQUxVRSk7XHJcbiAgICAgICBpZiAodGhpcy5fZW1pc3Npb25SYXRlICE9MClcclxuXHRcdFx0dGhpcy5fZW1pc3Npb25UaW1lPWR1cmF0aW9uO1xyXG4gICB9XHJcblxyXG4gICBcclxuXHQvKipcclxuXHQq5YGc5q2i5Y+R5bCE57KS5a2QXHJcblx0KkBwYXJhbSBjbGVhclBhcnRpY2xlcyDmmK/lkKbmuIXnkIblvZPliY3nmoTnspLlrZBcclxuICAgICovXHJcbiAgIHN0b3AoKVxyXG4gICB7XHJcbiAgICAgICB0aGlzLl9lbWlzc2lvblRpbWUgPSAwO1xyXG4gICB9XHJcblxyXG4gICAvKipcclxuXHQq5riF55CG5b2T5YmN55qE5rS76LeD57KS5a2QXHJcblx0KkBwYXJhbSBjbGVhclRleHR1cmUg5piv5ZCm5riF55CG6LS05Zu+5pWw5o2uLOiLpea4hemZpOi0tOWbvuaVsOaNruWwhuaXoOazleWGjeaSreaUvlxyXG4gICAgKi9cclxuICAgIGNsZWFyKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9lbWlzc2lvblRpbWUgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG5cdCrlj5HlsITkuIDkuKrnspLlrZBcclxuXHQqXHJcbiAgICAqL1xyXG4gICBlbWl0KClcclxuICAge1xyXG5cclxuICAgfVxyXG5cclxuICAgLyoqXHJcblx0KuaXtumSn+WJjei/m1xyXG5cdCpAcGFyYW0gcGFzc2VkVGltZSDliY3ov5vml7bpl7RcclxuXHQqXHJcbiAgICAqL1xyXG4gICBhZHZhbmNlVGltZShwYXNzZWRUaW1lOiBudW1iZXIpXHJcbiAgIHtcclxuICAgICAgIChwYXNzZWRUaW1lPT09dm9pZCAwKSYmIChwYXNzZWRUaW1lPTEpO1xyXG5cclxuICAgICAgIHRoaXMuX2VtaXNzaW9uVGltZS09cGFzc2VkVGltZTtcclxuICAgICAgIGlmICh0aGlzLl9lbWlzc2lvblRpbWUgPCAwKXJldHVybjtcclxuXHJcbiAgICAgICB0aGlzLl9mcmFtZVRpbWUrPXBhc3NlZFRpbWU7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZyYW1lVGltZSA8IHRoaXMubWluRW1pc3Npb25UaW1lKXJldHVybjtcclxuXHJcblxyXG4gICAgICAgIHdoaWxlICh0aGlzLl9mcmFtZVRpbWUgPiB0aGlzLm1pbkVtaXNzaW9uVGltZSlcclxuICAgICAgICB7XHJcblx0XHRcdHRoaXMuX2ZyYW1lVGltZS09dGhpcy5taW5FbWlzc2lvblRpbWU7XHJcblx0XHRcdHRoaXMuZW1pdCgpO1xyXG5cdFx0fVxyXG5cclxuICAgfVxyXG5cclxuICAgLyoqXHJcblx0Kuiuvue9rueykuWtkOeykuWtkOaooeadv1xyXG5cdCpAcGFyYW0gcGFydGljbGVUZW1wbGF0ZSDnspLlrZDmqKHmnb9cclxuXHQqXHJcbiAgICAqL1xyXG4gICAgc2V0IHBhcnRpY2xlVGVtcGxhdGUocGFydGljbGVUZW1wbGF0ZTogUGFydGljbGVUZW1wbGF0ZUJhc2UpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fcGFydGljbGVUZW1wbGF0ZSA9IHBhcnRpY2xlVGVtcGxhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcblx0Kuiuvue9rueykuWtkOWPkeWwhOmAn+eOh1xyXG5cdCpAcGFyYW0gZW1pc3Npb25SYXRlIOeykuWtkOWPkeWwhOmAn+eOhyAo5LiqL+enkilcclxuICAgICovXHJcbiAgIHNldCBlbWlzc2lvblJhdGUodmFsOiBudW1iZXIpXHJcbiAgIHtcclxuICAgICAgICBpZih2YWwgPD0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLl9lbWlzc2lvblJhdGUgPSB2YWw7XHJcbiAgICAgICAgKHZhbCA+IDApICYmICh0aGlzLm1pbkVtaXNzaW9uVGltZSA9IDEgLyB2YWwpO1xyXG4gICB9XHJcbiAgICBcclxuXHJcblx0LyoqXHJcblx0KuiOt+WPlueykuWtkOWPkeWwhOmAn+eOh1xyXG5cdCpAcmV0dXJuIOWPkeWwhOmAn+eOhyDnspLlrZDlj5HlsITpgJ/njocgKOS4qi/np5IpXHJcbiAgICAqL1xyXG4gICAgZ2V0IGVtaXNzaW9uUmF0ZSgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW1pc3Npb25SYXRlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG59XHJcbiIsImltcG9ydCBSZW5kZXIgPSBMYXlhLlJlbmRlcjtcclxuaW1wb3J0IEJsZW5kTW9kZSA9IExheWEuQmxlbmRNb2RlO1xyXG5pbXBvcnQgRHJhd1BhcnRpY2xlQ21kID0gTGF5YS5EcmF3UGFydGljbGVDbWQ7XHJcbmltcG9ydCBQYXJ0aWNsZVNldHRpbmcgZnJvbSBcIi4vUGFydGljbGVTZXR0aW5nXCI7XHJcbmltcG9ydCBQYXJ0aWNsZVRlbXBsYXRlMkQgZnJvbSBcIi4vUGFydGljbGVUZW1wbGF0ZTJEXCI7XHJcbmltcG9ydCBQYXJ0aWNsZVRlbXBsYXRlQ2FudmFzIGZyb20gXCIuL1BhcnRpY2xlVGVtcGxhdGVDYW52YXNcIjtcclxuaW1wb3J0IEVtaXR0ZXIyRCBmcm9tIFwiLi9FbWl0dGVyMkRcIjtcclxuXHJcblxyXG4vLyBpbXBvcnQgUGFydGljbGVUZW1wbGF0ZTJEID0gTGF5YS5QYXJ0aWNsZVRlbXBsYXRlMkQ7XHJcbi8vIGltcG9ydCBFbWl0dGVyMkQgPSBMYXlhLkVtaXR0ZXIyRDtcclxuLy8gaW1wb3J0IFBhcnRpY2xlVGVtcGxhdGVDYW52YXMgPSBMYXlhLlBhcnRpY2xlVGVtcGxhdGVDYW52YXM7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0aWNsZTJEIGV4dGVuZHMgTGF5YS5TcHJpdGVcclxue1xyXG4gICAgcHJpdmF0ZSBfbWF0cml4NCA9IFtcclxuICAgICAgICAxLDAsMCwwLFxyXG4gICAgICAgIDAsMSwwLDAsXHJcbiAgICAgICAgMCwwLDEsMCxcclxuICAgICAgICAwLDAsMCwxXTtcclxuXHJcbiAgICBwcml2YXRlIF9wYXJ0aWNsZVRlbXBsYXRlIDogUGFydGljbGVUZW1wbGF0ZTJEIHwgUGFydGljbGVUZW1wbGF0ZUNhbnZhcztcclxuICAgIHByaXZhdGUgX2NhbnZhc1RlbXBsYXRlOiBQYXJ0aWNsZVRlbXBsYXRlQ2FudmFzO1xyXG4gICAgcHJpdmF0ZSBfZW1pdHRlcjogRW1pdHRlcjJEO1xyXG5cclxuICAgIC8qKiDmmK/lkKblrZfmrrXmkq3mlL4gKi9cclxuICAgIGF1dG9QbGF5OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHRlbXBDbWQ6IERyYXdQYXJ0aWNsZUNtZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5nOiBQYXJ0aWNsZVNldHRpbmcpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmN1c3RvbVJlbmRlckVuYWJsZSA9IHRydWU7XHJcbiAgICAgICAgaWYoc2V0dGluZylcclxuICAgICAgICAgICAgdGhpcy5zZXRQYXJ0aWNsZVNldHRpbmcoc2V0dGluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcblx0KuWKoOi9veeykuWtkOaWh+S7tlxyXG5cdCpAcGFyYW0gdXJsIOeykuWtkOaWh+S7tuWcsOWdgFxyXG4gICAgKi9cclxuICAgIGxvYWQodXJsOiBzdHJpbmcpXHJcbiAgICB7XHJcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZCh1cmwsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5zZXRQYXJ0aWNsZVNldHRpbmcpLCBudWxsLCBMYXlhLkxvYWRlci5KU09OKTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuXHQvKipcclxuXHQq6K6+572u57KS5a2Q6YWN572u5pWw5o2uXHJcblx0KkBwYXJhbSBzZXR0aW5ncyDnspLlrZDphY3nva7mlbDmja5cclxuICAgICovXHJcbiAgIHNldFBhcnRpY2xlU2V0dGluZyhzZXR0aW5nOiBQYXJ0aWNsZVNldHRpbmcpXHJcbiAgIHtcclxuICAgICAgIGlmICghc2V0dGluZylyZXR1cm4gdGhpcy5zdG9wKCk7XHJcblxyXG4gICAgICAgUGFydGljbGVTZXR0aW5nLmNoZWNrU2V0dGluZyhzZXR0aW5nKTtcclxuXHJcbiAgICAgICBpZihSZW5kZXIuaXNDb25jaEFwcClcclxuICAgICAgIHtcclxuICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVRlbXBsYXRlID0gbmV3IFBhcnRpY2xlVGVtcGxhdGUyRChzZXR0aW5nKTtcclxuXHJcbiAgICAgICAgICAgdmFyIHNCbGVuZE1vZGUgPSBCbGVuZE1vZGUuTkFNRVNbc2V0dGluZy5ibGVuZFN0YXRlXTtcclxuICAgICAgICAgICB0aGlzLmJsZW5kTW9kZSA9IHNCbGVuZE1vZGU7XHJcblxyXG4gICAgICAgICAgIHRoaXMudGVtcENtZCA9IHRoaXMuZ3JhcGhpY3MuX3NhdmVUb0NtZChudWxsLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERyYXdQYXJ0aWNsZUNtZC5jcmVhdGUuY2FsbCh0aGlzLmdyYXBoaWNzLHRoaXMuX3BhcnRpY2xlVGVtcGxhdGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG5cdFx0XHR0aGlzLl9zZXRHcmFwaGljc0NhbGxCYWNrKCk7XHJcblxyXG4gICAgICAgfVxyXG4gICAgICAgZWxzZVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIGlmKFJlbmRlci5pc1dlYkdMKVxyXG4gICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgdGhpcy5jdXN0b21SZW5kZXJFbmFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVRlbXBsYXRlID0gbmV3IFBhcnRpY2xlVGVtcGxhdGUyRChzZXR0aW5nKTtcclxuICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljcy5fc2F2ZVRvQ21kKG51bGwsIERyYXdQYXJ0aWNsZUNtZC5jcmVhdGUodGhpcy5fcGFydGljbGVUZW1wbGF0ZSkgICk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlVGVtcGxhdGUgPSB0aGlzLl9jYW52YXNUZW1wbGF0ZSA9IG5ldyBQYXJ0aWNsZVRlbXBsYXRlQ2FudmFzKHNldHRpbmcpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuXHJcbiAgICAgICBpZighdGhpcy5fZW1pdHRlcilcclxuICAgICAgIHtcclxuICAgICAgICAgICB0aGlzLl9lbWl0dGVyID0gbmV3IEVtaXR0ZXIyRCg8YW55PnRoaXMuX3BhcnRpY2xlVGVtcGxhdGUpO1xyXG4gICAgICAgfVxyXG4gICAgICAgZWxzZVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIHRoaXMuX2VtaXR0ZXIudGVtcGxhdGU9PGFueT50aGlzLl9wYXJ0aWNsZVRlbXBsYXRlO1xyXG4gICAgICAgfVxyXG5cclxuICAgICAgIGlmICh0aGlzLmF1dG9QbGF5KVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIHRoaXMuZW1pdHRlci5zdGFydCgpO1xyXG4gICAgICAgICAgIHRoaXMucGxheSgpO1xyXG4gICAgICAgfVxyXG5cclxuICAgfVxyXG5cclxuICAgLyoqXHJcblx0KuaSreaUvlxyXG4gICAgKi9cclxuICAgIHBsYXkoKVxyXG4gICAge1xyXG4gICAgICAgIExheWEudGltZXIuZnJhbWVMb29wKDEsIHRoaXMsIHRoaXMuX2xvb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG5cdC8qKlxyXG5cdCrlgZzmraJcclxuICAgICovXHJcbiAgICBzdG9wKClcclxuICAgIHtcclxuXHRcdExheWEudGltZXIuY2xlYXIodGhpcyx0aGlzLl9sb29wKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9sb29wKClcclxuICAgIHtcclxuXHRcdHRoaXMuYWR2YW5jZVRpbWUoMSAvIDYwKTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuXHQvKipcclxuXHQq5pe26ZKf5YmN6L+bXHJcblx0KkBwYXJhbSBwYXNzZWRUaW1lIOaXtumSn+WJjei/m+aXtumXtFxyXG4gICAgKi9cclxuICAgYWR2YW5jZVRpbWUocGFzc2VkVGltZTogbnVtYmVyKVxyXG4gICB7XHJcbiAgICAgICAocGFzc2VkVGltZSA9PT0gdm9pZCAwKSAmJiAocGFzc2VkVGltZSA9IDEpO1xyXG5cclxuICAgICAgIGlmKHRoaXMuX2NhbnZhc1RlbXBsYXRlKVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIHRoaXMuX2NhbnZhc1RlbXBsYXRlLmFkdmFuY2VUaW1lKHBhc3NlZFRpbWUpO1xyXG4gICAgICAgfVxyXG5cclxuICAgICAgIGlmKHRoaXMuX2VtaXR0ZXIpXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgdGhpcy5fZW1pdHRlci5hZHZhbmNlVGltZShwYXNzZWRUaW1lKTtcclxuICAgICAgIH1cclxuICAgfVxyXG5cclxuICAgY3VzdG9tUmVuZGVyKGNvbnRleHQseCx5KVxyXG4gICB7XHJcbiAgICAgICBpZihSZW5kZXIuaXNXZWJHTClcclxuICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fbWF0cml4NFswXT1jb250ZXh0Ll9jdXJNYXQuYTtcclxuICAgICAgICAgICAgdGhpcy5fbWF0cml4NFsxXT1jb250ZXh0Ll9jdXJNYXQuYjtcclxuICAgICAgICAgICAgdGhpcy5fbWF0cml4NFs0XT1jb250ZXh0Ll9jdXJNYXQuYztcclxuICAgICAgICAgICAgdGhpcy5fbWF0cml4NFs1XT1jb250ZXh0Ll9jdXJNYXQuZDtcclxuICAgICAgICAgICAgdGhpcy5fbWF0cml4NFsxMl09Y29udGV4dC5fY3VyTWF0LnR4O1xyXG4gICAgICAgICAgICB0aGlzLl9tYXRyaXg0WzEzXT1jb250ZXh0Ll9jdXJNYXQudHk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc3Y9KDxQYXJ0aWNsZVRlbXBsYXRlMkQ+dGhpcy5fcGFydGljbGVUZW1wbGF0ZSkuc3Y7XHJcbiAgICAgICAgICAgIC8vIFRPRE8gWkZcclxuXHRcdFx0c3ZbXCJ1X21tYXRcIl09dGhpcy5fbWF0cml4NDtcclxuXHRcdFx0Ly8gc3YubW1hdD10aGlzLl9tYXRyaXg0O1xyXG4gICAgICAgfVxyXG5cclxuICAgICAgIGlmKHRoaXMuX2NhbnZhc1RlbXBsYXRlKVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIHRoaXMuX2NhbnZhc1RlbXBsYXRlLnJlbmRlcihjb250ZXh0LHgseSk7XHJcbiAgICAgICB9XHJcbiAgIH1cclxuXHJcbiAgIGRlc3Ryb3koZGVzdHJveUNoaWxkPzogYm9vbGVhbilcclxuICAge1xyXG4gICAgICAgKGRlc3Ryb3lDaGlsZCA9PT0gdm9pZCAwKSAmJiAoZGVzdHJveUNoaWxkID0gdHJ1ZSk7XHJcblxyXG4gICAgICAgaWYoKHRoaXMuX3BhcnRpY2xlVGVtcGxhdGUgaW5zdGFuY2VvZiBQYXJ0aWNsZVRlbXBsYXRlMkQpKVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIHRoaXMuX3BhcnRpY2xlVGVtcGxhdGUuZGlzcG9zZSgpO1xyXG4gICAgICAgfVxyXG4gICAgICAgXHJcbiAgICAgICBzdXBlci5kZXN0cm95KGRlc3Ryb3lDaGlsZCk7XHJcbiAgIH1cclxuXHJcbiAgIFxyXG5cdC8qKlxyXG5cdCrorr7nva4g57KS5a2Q5paH5Lu25Zyw5Z2AXHJcblx0KkBwYXJhbSBwYXRoIOeykuWtkOaWh+S7tuWcsOWdgFxyXG4gICAgKi9cclxuICAgIHNldCB1cmwodXJsKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMubG9hZCh1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG5cdC8qKlxyXG5cdCrojrflj5bnspLlrZDlj5HlsITlmahcclxuICAgICovXHJcbiAgICBnZXQgZW1pdHRlcigpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VtaXR0ZXI7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxud2luZG93W1wiUGFydGljbGUyRFwiXSA9IFBhcnRpY2xlMkQ7IiwiaW1wb3J0IE1hdGhVdGlsID0gTGF5YS5NYXRoVXRpbDtcclxuaW1wb3J0IFBhcnRpY2xlU2V0dGluZyBmcm9tIFwiLi9QYXJ0aWNsZVNldHRpbmdcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnRpY2xlRGF0YVxyXG57XHJcbiAgICAvLyDkvY3nva4gW3gsIHksIHpdXHJcbiAgICBwb3NpdGlvbjogRmxvYXQzMkFycmF5O1xyXG4gICAgLy8g6YCf5bqmIFt4LCB5LCB6XVxyXG4gICAgdmVsb2NpdHk6IEZsb2F0MzJBcnJheTtcclxuICAgIC8vIOi1t+WniyDpopzoibIgW3IsIGcsIGIsIGFdXHJcbiAgICBzdGFydENvbG9yOiBGbG9hdDMyQXJyYXk7XHJcbiAgICAvLyDnu5PmnZ8g6aKc6ImyIFtyLCBnLCBiLCBhXVxyXG4gICAgZW5kQ29sb3I6IEZsb2F0MzJBcnJheTtcclxuICAgIC8vIOWkp+Wwj+WSjOaXi+i9rCBbc3RhcnRTaXplLCBlbmRTaXplLCAgcm90YXRlU3BlZWRdXHJcbiAgICBzaXplUm90YXRpb246IEZsb2F0MzJBcnJheTtcclxuICAgIC8vIOWNiuW+hCBbU3RhcnRSYWRpdXMsRW5kUmFkaXVzXVxyXG4gICAgcmFkaXVzOiBGbG9hdDMyQXJyYXk7XHJcbiAgICAvLyDlvKfluqYgW0hvcml6b250YWxTdGFydFJhZGlhbixWZXJ0aWNhbFN0YXJ0UmFkaWFuLCBIb3Jpem9udGFsRW5kUmFkaWFuLCBWZXJ0aWNhbEVuZFJhZGlhbl1cclxuICAgIHJhZGlhbjogRmxvYXQzMkFycmF5O1xyXG4gICAgLy8g57yp5pS+5oyB57ut5pe26Ze0XHJcbiAgICBkdXJhdGlvbkFkZFNjYWxlOiBudW1iZXI7XHJcbiAgICAvLyDnu5jliLbmrKHmlbBcclxuICAgIHRpbWU6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpXHJcbiAgICB7XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgQ3JlYXRlKHNldHRpbmdzOiBQYXJ0aWNsZVNldHRpbmcsIHBvc2l0aW9uOiBGbG9hdDMyQXJyYXksIHZlbG9jaXR5OiBGbG9hdDMyQXJyYXksIHRpbWU6IG51bWJlcik6IFBhcnRpY2xlRGF0YVxyXG4gICAge1xyXG4gICAgICAgIHZhciBwYXJ0aWNsZURhdGE9bmV3IFBhcnRpY2xlRGF0YSgpO1xyXG4gICAgICAgIHBhcnRpY2xlRGF0YS5wb3NpdGlvbj1wb3NpdGlvbjtcclxuXHJcblxyXG4gICAgICAgIC8vPT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgLy8g6K6+572u6YCf5bqmIFt4LCB5LCB6XVxyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgIC8vIOe8qeaUviBlID0gZiAqIGI7XHJcbiAgICAgICAgTWF0aFV0aWwuc2NhbGVWZWN0b3IzKHZlbG9jaXR5LCBzZXR0aW5ncy5lbWl0dGVyVmVsb2NpdHlTZW5zaXRpdml0eSwgUGFydGljbGVEYXRhLl90ZW1wVmVsb2NpdHkpO1xyXG4gICAgICAgIC8vIOawtOW5s+mAn+W6pu+8iOWNleS9je+8mjJE5YOP57Sg44CBM0TlnZDmoIfvvIlcclxuICAgICAgICB2YXIgaG9yaXpvbnRhbFZlbG9jaXR5OiBudW1iZXIgPSBNYXRoVXRpbC5sZXJwKHNldHRpbmdzLm1pbkhvcml6b250YWxWZWxvY2l0eSwgc2V0dGluZ3MubWF4SG9yaXpvbnRhbFZlbG9jaXR5LCBNYXRoLnJhbmRvbSgpKTtcclxuICAgICAgICAvLyDmsLTlubPop5LluqZcclxuICAgICAgICB2YXIgaG9yaXpvbnRhbEFuZ2xlPU1hdGgucmFuZG9tKCkqTWF0aC5QSSAqMjtcclxuICAgICAgICBcclxuICAgICAgICAvLyDmsLTlubPpgJ/luqZcclxuXHRcdFBhcnRpY2xlRGF0YS5fdGVtcFZlbG9jaXR5WzBdICs9IGhvcml6b250YWxWZWxvY2l0eSAqIE1hdGguY29zKGhvcml6b250YWxBbmdsZSk7XHJcbiAgICAgICAgUGFydGljbGVEYXRhLl90ZW1wVmVsb2NpdHlbMl0gKz0gaG9yaXpvbnRhbFZlbG9jaXR5ICogTWF0aC5zaW4oaG9yaXpvbnRhbEFuZ2xlKTtcclxuICAgICAgICAvLyDlnoLnm7TpgJ/luqZcclxuICAgICAgICBQYXJ0aWNsZURhdGEuX3RlbXBWZWxvY2l0eVsxXSArPSBNYXRoVXRpbC5sZXJwKHNldHRpbmdzLm1pblZlcnRpY2FsVmVsb2NpdHksIHNldHRpbmdzLm1heFZlcnRpY2FsVmVsb2NpdHksIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHBhcnRpY2xlRGF0YS52ZWxvY2l0eSA9IFBhcnRpY2xlRGF0YS5fdGVtcFZlbG9jaXR5O1xyXG5cclxuXHJcblxyXG4gICAgICAgIC8vPT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgLy8g6K6+572u6aKc6ImyIFtyLCBnLCBiLCBhXVxyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgXHJcblx0XHRwYXJ0aWNsZURhdGEuc3RhcnRDb2xvcj1QYXJ0aWNsZURhdGEuX3RlbXBTdGFydENvbG9yO1xyXG4gICAgICAgIHBhcnRpY2xlRGF0YS5lbmRDb2xvcj1QYXJ0aWNsZURhdGEuX3RlbXBFbmRDb2xvcjtcclxuICAgICAgICBcclxuXHRcdHZhciBpPTA7XHJcbiAgICAgICAgaWYgKHNldHRpbmdzLmRpc2FibGVDb2xvcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAoaT0wO2kgPCAzO2krKylcclxuICAgICAgICAgICAge1xyXG5cdFx0XHRcdHBhcnRpY2xlRGF0YS5zdGFydENvbG9yW2ldPTE7XHJcblx0XHRcdFx0cGFydGljbGVEYXRhLmVuZENvbG9yW2ldPTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGFscGhhXHJcblx0XHRcdHBhcnRpY2xlRGF0YS5zdGFydENvbG9yW2ldID0gTWF0aFV0aWwubGVycChzZXR0aW5ncy5taW5TdGFydENvbG9yW2ldLCBzZXR0aW5ncy5tYXhTdGFydENvbG9yW2ldLCBNYXRoLnJhbmRvbSgpKTtcclxuXHRcdFx0cGFydGljbGVEYXRhLmVuZENvbG9yW2ldID0gTWF0aFV0aWwubGVycChzZXR0aW5ncy5taW5FbmRDb2xvcltpXSwgc2V0dGluZ3MubWF4RW5kQ29sb3JbaV0sIE1hdGgucmFuZG9tKCkpO1xyXG5cdFx0fVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5jb2xvckNvbXBvbmVudEludGVyKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGk9MDtpIDwgNDtpKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcblx0XHRcdFx0XHRwYXJ0aWNsZURhdGEuc3RhcnRDb2xvcltpXT1NYXRoVXRpbC5sZXJwKHNldHRpbmdzLm1pblN0YXJ0Q29sb3JbaV0sIHNldHRpbmdzLm1heFN0YXJ0Q29sb3JbaV0sIE1hdGgucmFuZG9tKCkpO1xyXG5cdFx0XHRcdFx0cGFydGljbGVEYXRhLmVuZENvbG9yW2ldPU1hdGhVdGlsLmxlcnAoc2V0dGluZ3MubWluRW5kQ29sb3JbaV0sIHNldHRpbmdzLm1heEVuZENvbG9yW2ldLCBNYXRoLnJhbmRvbSgpKTtcclxuXHRcdFx0XHR9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBcclxuICAgICAgICAgICAge1xyXG5cdFx0XHRcdE1hdGhVdGlsLmxlcnBWZWN0b3I0KHNldHRpbmdzLm1pblN0YXJ0Q29sb3IsIHNldHRpbmdzLm1heFN0YXJ0Q29sb3IsIE1hdGgucmFuZG9tKCksIHBhcnRpY2xlRGF0YS5zdGFydENvbG9yKTtcclxuXHRcdFx0XHRNYXRoVXRpbC5sZXJwVmVjdG9yNChzZXR0aW5ncy5taW5FbmRDb2xvciwgc2V0dGluZ3MubWF4RW5kQ29sb3IsIE1hdGgucmFuZG9tKCksIHBhcnRpY2xlRGF0YS5lbmRDb2xvcik7XHJcblx0XHRcdH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy89PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAvLyDorr7nva4g5aSn5bCP5ZKM5peL6L2s6YCf5bqmIFtzdGFydFNpemUsIGVuZFNpemUsICByb3RhdGVTcGVlZF1cclxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0cGFydGljbGVEYXRhLnNpemVSb3RhdGlvbj0gUGFydGljbGVEYXRhLl90ZW1wU2l6ZVJvdGF0aW9uO1xyXG5cdFx0dmFyIHNpemVSYW5kb209TWF0aC5yYW5kb20oKTtcclxuXHRcdHBhcnRpY2xlRGF0YS5zaXplUm90YXRpb25bMF0gPSBNYXRoVXRpbC5sZXJwKHNldHRpbmdzLm1pblN0YXJ0U2l6ZSxzZXR0aW5ncy5tYXhTdGFydFNpemUsc2l6ZVJhbmRvbSk7XHJcblx0XHRwYXJ0aWNsZURhdGEuc2l6ZVJvdGF0aW9uWzFdID0gTWF0aFV0aWwubGVycChzZXR0aW5ncy5taW5FbmRTaXplLHNldHRpbmdzLm1heEVuZFNpemUsc2l6ZVJhbmRvbSk7XHJcbiAgICAgICAgcGFydGljbGVEYXRhLnNpemVSb3RhdGlvblsyXSA9IE1hdGhVdGlsLmxlcnAoc2V0dGluZ3MubWluUm90YXRlU3BlZWQsc2V0dGluZ3MubWF4Um90YXRlU3BlZWQsTWF0aC5yYW5kb20oKSk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIC8vPT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgLy8g6K6+572uIOWNiuW+hCBbU3RhcnRSYWRpdXMsRW5kUmFkaXVzXVxyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdFx0cGFydGljbGVEYXRhLnJhZGl1cz1QYXJ0aWNsZURhdGEuX3RlbXBSYWRpdXM7XHJcblx0XHR2YXIgcmFkaXVzUmFuZG9tPU1hdGgucmFuZG9tKCk7XHJcblx0XHRwYXJ0aWNsZURhdGEucmFkaXVzWzBdPU1hdGhVdGlsLmxlcnAoc2V0dGluZ3MubWluU3RhcnRSYWRpdXMsc2V0dGluZ3MubWF4U3RhcnRSYWRpdXMscmFkaXVzUmFuZG9tKTtcclxuICAgICAgICBwYXJ0aWNsZURhdGEucmFkaXVzWzFdPU1hdGhVdGlsLmxlcnAoc2V0dGluZ3MubWluRW5kUmFkaXVzLHNldHRpbmdzLm1heEVuZFJhZGl1cyxyYWRpdXNSYW5kb20pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vPT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgLy8g6K6+572uIOW8p+W6piBbSG9yaXpvbnRhbFN0YXJ0UmFkaWFuLFZlcnRpY2FsU3RhcnRSYWRpYW4sIEhvcml6b250YWxFbmRSYWRpYW4sIFZlcnRpY2FsRW5kUmFkaWFuXVxyXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRwYXJ0aWNsZURhdGEucmFkaWFuPVBhcnRpY2xlRGF0YS5fdGVtcFJhZGlhbjtcclxuXHRcdHBhcnRpY2xlRGF0YS5yYWRpYW5bMF09TWF0aFV0aWwubGVycChzZXR0aW5ncy5taW5Ib3Jpem9udGFsU3RhcnRSYWRpYW4sc2V0dGluZ3MubWF4SG9yaXpvbnRhbFN0YXJ0UmFkaWFuLE1hdGgucmFuZG9tKCkpO1xyXG5cdFx0cGFydGljbGVEYXRhLnJhZGlhblsxXT1NYXRoVXRpbC5sZXJwKHNldHRpbmdzLm1pblZlcnRpY2FsU3RhcnRSYWRpYW4sc2V0dGluZ3MubWF4VmVydGljYWxTdGFydFJhZGlhbixNYXRoLnJhbmRvbSgpKTtcclxuXHRcdHZhciB1c2VFbmRSYWRpYW49c2V0dGluZ3MudXNlRW5kUmFkaWFuO1xyXG5cdFx0cGFydGljbGVEYXRhLnJhZGlhblsyXT11c2VFbmRSYWRpYW4/TWF0aFV0aWwubGVycChzZXR0aW5ncy5taW5Ib3Jpem9udGFsRW5kUmFkaWFuLHNldHRpbmdzLm1heEhvcml6b250YWxFbmRSYWRpYW4sTWF0aC5yYW5kb20oKSk6cGFydGljbGVEYXRhLnJhZGlhblswXTtcclxuXHRcdHBhcnRpY2xlRGF0YS5yYWRpYW5bM109dXNlRW5kUmFkaWFuP01hdGhVdGlsLmxlcnAoc2V0dGluZ3MubWluVmVydGljYWxFbmRSYWRpYW4sc2V0dGluZ3MubWF4VmVydGljYWxFbmRSYWRpYW4sTWF0aC5yYW5kb20oKSk6cGFydGljbGVEYXRhLnJhZGlhblsxXTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAvLyDorr7nva4g57yp5pS+5oyB57ut5pe26Ze0XHJcbiAgICAgICAgcGFydGljbGVEYXRhLmR1cmF0aW9uQWRkU2NhbGU9c2V0dGluZ3MuYWdlQWRkU2NhbGUgKk1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g6K6+572uIOasoeaVsFxyXG4gICAgICAgIHBhcnRpY2xlRGF0YS50aW1lPXRpbWU7XHJcbiAgICAgICAgXHJcblx0XHRyZXR1cm4gcGFydGljbGVEYXRhO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIC8vIOmAn+W6piBbeCwgeSwgel1cclxuICAgIHByaXZhdGUgc3RhdGljIF9fX3RlbXBWZWxvY2l0eTogRmxvYXQzMkFycmF5O1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0IF90ZW1wVmVsb2NpdHkoKVxyXG4gICAge1xyXG4gICAgICAgIGlmKCF0aGlzLl9fX3RlbXBWZWxvY2l0eSlcclxuICAgICAgICAgICAgdGhpcy5fX190ZW1wVmVsb2NpdHk9bmV3IEZsb2F0MzJBcnJheSgzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX19fdGVtcFZlbG9jaXR5O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyDotbflp4vpopzoibIgW3IsIGcsIGIsIGFdXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfX3RlbXBTdGFydENvbG9yOiBGbG9hdDMyQXJyYXk7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXQgX3RlbXBTdGFydENvbG9yKClcclxuICAgIHtcclxuICAgICAgICBpZighdGhpcy5fX3RlbXBTdGFydENvbG9yKVxyXG4gICAgICAgICAgICB0aGlzLl9fdGVtcFN0YXJ0Q29sb3I9bmV3IEZsb2F0MzJBcnJheSg0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX190ZW1wU3RhcnRDb2xvcjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgXHJcbiAgICAvLyDnu5PmnZ/popzoibIgW3IsIGcsIGIsIGFdXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfX3RlbXBFbmRDb2xvcjogRmxvYXQzMkFycmF5O1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0IF90ZW1wRW5kQ29sb3IoKVxyXG4gICAge1xyXG4gICAgICAgIGlmKCF0aGlzLl9fdGVtcEVuZENvbG9yKVxyXG4gICAgICAgICAgICB0aGlzLl9fdGVtcEVuZENvbG9yPW5ldyBGbG9hdDMyQXJyYXkoNCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9fdGVtcEVuZENvbG9yO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgLy8g5aSn5bCP5ZKM5peL6L2s6YCf5bqmIFtzdGFydFNpemUsIGVuZFNpemUsICByb3RhdGVTcGVlZF1cclxuICAgIHByaXZhdGUgc3RhdGljIF9fdGVtcFNpemVSb3RhdGlvbjogRmxvYXQzMkFycmF5O1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0IF90ZW1wU2l6ZVJvdGF0aW9uKClcclxuICAgIHtcclxuICAgICAgICBpZighdGhpcy5fX3RlbXBTaXplUm90YXRpb24pXHJcbiAgICAgICAgICAgIHRoaXMuX190ZW1wU2l6ZVJvdGF0aW9uPW5ldyBGbG9hdDMyQXJyYXkoMyk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9fdGVtcFNpemVSb3RhdGlvbjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8g5Y2K5b6EIFtTdGFydFJhZGl1cyxFbmRSYWRpdXNdXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfX3RlbXBSYWRpdXM6IEZsb2F0MzJBcnJheTtcclxuICAgIHByaXZhdGUgc3RhdGljIGdldCBfdGVtcFJhZGl1cygpXHJcbiAgICB7XHJcbiAgICAgICAgaWYoIXRoaXMuX190ZW1wUmFkaXVzKVxyXG4gICAgICAgICAgICB0aGlzLl9fdGVtcFJhZGl1cz1uZXcgRmxvYXQzMkFycmF5KDIpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fX3RlbXBSYWRpdXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIOW8p+W6piBbSG9yaXpvbnRhbFN0YXJ0UmFkaWFuLFZlcnRpY2FsU3RhcnRSYWRpYW4sIEhvcml6b250YWxFbmRSYWRpYW4sIFZlcnRpY2FsRW5kUmFkaWFuXVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX190ZW1wUmFkaWFuOiBGbG9hdDMyQXJyYXk7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXQgX3RlbXBSYWRpYW4oKVxyXG4gICAge1xyXG4gICAgICAgIGlmKCF0aGlzLl9fdGVtcFJhZGlhbilcclxuICAgICAgICAgICAgdGhpcy5fX3RlbXBSYWRpYW49bmV3IEZsb2F0MzJBcnJheSg0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX190ZW1wUmFkaWFuO1xyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0aWNsZVNldHRpbmdcclxue1xyXG4gICAgLyoq6LS05Zu+Ki9cclxuICAgIHRleHR1cmVOYW1lPW51bGw7XHJcbiAgICAvKirotLTlm77kuKrmlbAs6buY6K6k5Li6MeWPr+S4jeiuvue9riovXHJcbiAgICB0ZXh0dXJlQ291bnQ9MTtcclxuICAgIC8qKueUseS6juW+queOr+mYn+WIl+WIpOaWreeul+azle+8jOacgOWkp+mlseWSjOeykuWtkOaVsOS4um1heFBhcnRpY2VzLTEqL1xyXG4gICAgbWF4UGFydGljZXM9MTAwO1xyXG4gICAgLyoq57KS5a2Q5oyB57ut5pe26Ze0KOWNleS9jTrnp5LvvIkqL1xyXG4gICAgZHVyYXRpb249MTtcclxuICAgIC8qKuWmguaenOWkp+S6jjDvvIzmn5DkupvnspLlrZDnmoTmjIHnu63ml7bpl7TkvJrlsI/kuo7lhbbku5bnspLlrZAs5bm25YW35pyJ6ZqP5py65oCnKOWNleS9jTrml6DvvIkqL1xyXG4gICAgYWdlQWRkU2NhbGU9MDtcclxuICAgIC8qKueykuWtkOWPl+WPkeWwhOWZqOmAn+W6pueahOaVj+aEn+W6pu+8iOmcgOWcqOiHquWumuS5ieWPkeWwhOWZqOS4ree8lueggeiuvue9ru+8iSovXHJcbiAgICBlbWl0dGVyVmVsb2NpdHlTZW5zaXRpdml0eT0xO1xyXG4gICAgLyoq5pyA5bCP5byA5aeL5bC65a+477yI5Y2V5L2N77yaMkTlg4/ntKDjgIEzROWdkOagh++8iSovXHJcbiAgICBtaW5TdGFydFNpemU9MTAwO1xyXG4gICAgLyoq5pyA5aSn5byA5aeL5bC65a+477yI5Y2V5L2N77yaMkTlg4/ntKDjgIEzROWdkOagh++8iSovXHJcbiAgICBtYXhTdGFydFNpemU9MTAwO1xyXG4gICAgLyoq5pyA5bCP57uT5p2f5bC65a+477yI5Y2V5L2N77yaMkTlg4/ntKDjgIEzROWdkOagh++8iSovXHJcbiAgICBtaW5FbmRTaXplPTEwMDtcclxuICAgIC8qKuacgOWkp+e7k+adn+WwuuWvuO+8iOWNleS9je+8mjJE5YOP57Sg44CBM0TlnZDmoIfvvIkqL1xyXG4gICAgbWF4RW5kU2l6ZT0xMDA7XHJcbiAgICAvKirmnIDlsI/msLTlubPpgJ/luqbvvIjljZXkvY3vvJoyROWDj+e0oOOAgTNE5Z2Q5qCH77yJKi9cclxuICAgIG1pbkhvcml6b250YWxWZWxvY2l0eT0wO1xyXG4gICAgLyoq5pyA5aSn5rC05bmz6YCf5bqm77yI5Y2V5L2N77yaMkTlg4/ntKDjgIEzROWdkOagh++8iSovXHJcbiAgICBtYXhIb3Jpem9udGFsVmVsb2NpdHk9MDtcclxuICAgIC8qKuacgOWwj+WeguebtOmAn+W6pu+8iOWNleS9je+8mjJE5YOP57Sg44CBM0TlnZDmoIfvvIkqL1xyXG4gICAgbWluVmVydGljYWxWZWxvY2l0eT0wO1xyXG4gICAgLyoq5pyA5aSn5Z6C55u06YCf5bqm77yI5Y2V5L2N77yaMkTlg4/ntKDjgIEzROWdkOagh++8iSovXHJcbiAgICBtYXhWZXJ0aWNhbFZlbG9jaXR5PTA7XHJcbiAgICAvKirnrYnkuo4x5pe257KS5a2Q5LuO5Ye655Sf5Yiw5raI5Lqh5L+d5oyB5LiA6Ie055qE6YCf5bqm77yM562J5LqOMOaXtueykuWtkOa2iOS6oeaXtumAn+W6puS4ujDvvIzlpKfkuo4x5pe257KS5a2Q5Lya5L+d5oyB5Yqg6YCf77yI5Y2V5L2N77ya5peg77yJKi9cclxuICAgIGVuZFZlbG9jaXR5PTE7XHJcbiAgICAvKirmnIDlsI/ml4vovazpgJ/luqbvvIjljZXkvY3vvJoyROW8p+W6pi/np5LjgIEzROW8p+W6pi/np5LvvIkqL1xyXG4gICAgbWluUm90YXRlU3BlZWQ9MDtcclxuICAgIC8qKuacgOWkp+aXi+i9rOmAn+W6pu+8iOWNleS9je+8mjJE5byn5bqmL+enkuOAgTNE5byn5bqmL+enku+8iSovXHJcbiAgICBtYXhSb3RhdGVTcGVlZD0wO1xyXG4gICAgLyoq5pyA5bCP5byA5aeL5Y2K5b6E77yI5Y2V5L2N77yaMkTlg4/ntKDjgIEzROWdkOagh++8iSovXHJcbiAgICBtaW5TdGFydFJhZGl1cz0wO1xyXG4gICAgLyoq5pyA5aSn5byA5aeL5Y2K5b6E77yI5Y2V5L2N77yaMkTlg4/ntKDjgIEzROWdkOagh++8iSovXHJcbiAgICBtYXhTdGFydFJhZGl1cz0wO1xyXG4gICAgLyoq5pyA5bCP57uT5p2f5Y2K5b6E77yI5Y2V5L2N77yaMkTlg4/ntKDjgIEzROWdkOagh++8iSovXHJcbiAgICBtaW5FbmRSYWRpdXM9MDtcclxuICAgIC8qKuacgOWkp+e7k+adn+WNiuW+hO+8iOWNleS9je+8mjJE5YOP57Sg44CBM0TlnZDmoIfvvIkqL1xyXG4gICAgbWF4RW5kUmFkaXVzPTA7XHJcbiAgICAvKirmnIDlsI/msLTlubPlvIDlp4vlvKfluqbvvIjljZXkvY3vvJoyROW8p+W6puOAgTNE5byn5bqm77yJKi9cclxuICAgIG1pbkhvcml6b250YWxTdGFydFJhZGlhbj0wO1xyXG4gICAgLyoq5pyA5aSn5rC05bmz5byA5aeL5byn5bqm77yI5Y2V5L2N77yaMkTlvKfluqbjgIEzROW8p+W6pu+8iSovXHJcbiAgICBtYXhIb3Jpem9udGFsU3RhcnRSYWRpYW49MDtcclxuICAgIC8qKuacgOWwj+WeguebtOW8gOWni+W8p+W6pu+8iOWNleS9je+8mjJE5byn5bqm44CBM0TlvKfluqbvvIkqL1xyXG4gICAgbWluVmVydGljYWxTdGFydFJhZGlhbj0wO1xyXG4gICAgLyoq5pyA5aSn5Z6C55u05byA5aeL5byn5bqm77yI5Y2V5L2N77yaMkTlvKfluqbjgIEzROW8p+W6pu+8iSovXHJcbiAgICBtYXhWZXJ0aWNhbFN0YXJ0UmFkaWFuPTA7XHJcbiAgICAvKirmmK/lkKbkvb/nlKjnu5PmnZ/lvKfluqYsZmFsc2XkuLrnu5PmnZ/ml7bkuI7otbflp4vlvKfluqbkv53mjIHkuIDoh7QsdHJ1ZeS4uuagueaNrm1pbkhvcml6b250YWxFbmRSYWRpYW7jgIFtYXhIb3Jpem9udGFsRW5kUmFkaWFu44CBbWluVmVydGljYWxFbmRSYWRpYW7jgIFtYXhWZXJ0aWNhbEVuZFJhZGlhbuiuoeeul+e7k+adn+W8p+W6puOAgiovXHJcbiAgICB1c2VFbmRSYWRpYW49dHJ1ZTtcclxuICAgIC8qKuacgOWwj+awtOW5s+e7k+adn+W8p+W6pu+8iOWNleS9je+8mjJE5byn5bqm44CBM0TlvKfluqbvvIkqL1xyXG4gICAgbWluSG9yaXpvbnRhbEVuZFJhZGlhbj0wO1xyXG4gICAgLyoq5pyA5aSn5rC05bmz57uT5p2f5byn5bqm77yI5Y2V5L2N77yaMkTlvKfluqbjgIEzROW8p+W6pu+8iSovXHJcbiAgICBtYXhIb3Jpem9udGFsRW5kUmFkaWFuPTA7XHJcbiAgICAvKirmnIDlsI/lnoLnm7Tnu5PmnZ/lvKfluqbvvIjljZXkvY3vvJoyROW8p+W6puOAgTNE5byn5bqm77yJKi9cclxuICAgIG1pblZlcnRpY2FsRW5kUmFkaWFuPTA7XHJcbiAgICAvKirmnIDlpKflnoLnm7Tnu5PmnZ/lvKfluqbvvIjljZXkvY3vvJoyROW8p+W6puOAgTNE5byn5bqm77yJKi9cclxuICAgIG1heFZlcnRpY2FsRW5kUmFkaWFuPTA7XHJcbiAgICAvKipmYWxzZeS7o+ihqFJHQkHmlbTkvZPmj5LlgLzvvIx0cnVl5Luj6KGoUkdCQemAkOWIhumHj+aPkuWAvCovXHJcbiAgICBjb2xvckNvbXBvbmVudEludGVyPWZhbHNlO1xyXG4gICAgLyoqZmFsc2Xku6Pooajkvb/nlKjlj4LmlbDpopzoibLmlbDmja7vvIx0cnVl5Luj6KGo5L2/55So5Y6f5Zu+6aKc6Imy5pWw5o2uKi9cclxuICAgIGRpc2FibGVDb2xvcj1mYWxzZTtcclxuICAgIC8qKua3t+WQiOaooeW8j++8jOW+heiwg+aVtO+8jOW8leaTjuS4reaaguaXoEJsZW5kU3RhdGXmir3osaEqL1xyXG4gICAgYmxlbmRTdGF0ZT0wO1xyXG4gICAgLyoq5Y+R5bCE5Zmo57G75Z6LLFwicG9pbnRcIixcImJveFwiLFwic3BoZXJlXCIsXCJyaW5nXCIqL1xyXG4gICAgZW1pdHRlclR5cGU9XCJudWxsXCI7XHJcbiAgICAvKirlj5HlsITlmajlj5HlsITpgJ/njocqL1xyXG4gICAgZW1pc3Npb25SYXRlPTA7XHJcbiAgICAvKirnkIPlj5HlsITlmajljYrlvoQqL1xyXG4gICAgc3BoZXJlRW1pdHRlclJhZGl1cz0xO1xyXG4gICAgLyoq55CD5Y+R5bCE5Zmo6YCf5bqmKi9cclxuICAgIHNwaGVyZUVtaXR0ZXJWZWxvY2l0eT0wO1xyXG4gICAgLyoq55CD5Y+R5bCE5Zmo6YCf5bqm6ZqP5py65YC8Ki9cclxuICAgIHNwaGVyZUVtaXR0ZXJWZWxvY2l0eUFkZFZhcmlhbmNlPTA7XHJcbiAgICAvKirnjq/lj5HlsITlmajljYrlvoQqL1xyXG4gICAgcmluZ0VtaXR0ZXJSYWRpdXM9MzA7XHJcbiAgICAvKirnjq/lj5HlsITlmajpgJ/luqYqL1xyXG4gICAgcmluZ0VtaXR0ZXJWZWxvY2l0eT0wO1xyXG4gICAgLyoq546v5Y+R5bCE5Zmo6YCf5bqm6ZqP5py65YC8Ki9cclxuICAgIHJpbmdFbWl0dGVyVmVsb2NpdHlBZGRWYXJpYW5jZT0wO1xyXG4gICAgLyoq546v5Y+R5bCE5ZmodXDlkJHph4/vvIww5Luj6KGoWOi9tCwx5Luj6KGoWei9tCwy5Luj6KGoWui9tCovXHJcbiAgICByaW5nRW1pdHRlclVwPTI7XHJcbiAgICBncmF2aXR5PW5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwXSk7XHJcbiAgICBtaW5TdGFydENvbG9yPW5ldyBGbG9hdDMyQXJyYXkoWzEsMSwxLDFdKTtcclxuICAgIG1heFN0YXJ0Q29sb3I9bmV3IEZsb2F0MzJBcnJheShbMSwxLDEsMV0pO1xyXG4gICAgbWluRW5kQ29sb3I9bmV3IEZsb2F0MzJBcnJheShbMSwxLDEsMV0pO1xyXG4gICAgbWF4RW5kQ29sb3I9bmV3IEZsb2F0MzJBcnJheShbMSwxLDEsMV0pO1xyXG4gICAgcG9pbnRFbWl0dGVyUG9zaXRpb249bmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKTtcclxuICAgIHBvaW50RW1pdHRlclBvc2l0aW9uVmFyaWFuY2U9bmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKTtcclxuICAgIHBvaW50RW1pdHRlclZlbG9jaXR5PW5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwXSk7XHJcbiAgICBwb2ludEVtaXR0ZXJWZWxvY2l0eUFkZFZhcmlhbmNlPW5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwXSk7XHJcbiAgICBib3hFbWl0dGVyQ2VudGVyUG9zaXRpb249bmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKTtcclxuICAgIGJveEVtaXR0ZXJTaXplPW5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwXSk7XHJcbiAgICBib3hFbWl0dGVyVmVsb2NpdHk9bmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKTtcclxuICAgIGJveEVtaXR0ZXJWZWxvY2l0eUFkZFZhcmlhbmNlPW5ldyBGbG9hdDMyQXJyYXkoWzAsMCwwXSk7XHJcbiAgICBzcGhlcmVFbWl0dGVyQ2VudGVyUG9zaXRpb249bmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKTtcclxuICAgIHJpbmdFbWl0dGVyQ2VudGVyUG9zaXRpb249bmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKTtcclxuICAgIHBvc2l0aW9uVmFyaWFuY2U9bmV3IEZsb2F0MzJBcnJheShbMCwwLDBdKTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfZGVmYXVsdFNldHRpbmc6IFBhcnRpY2xlU2V0dGluZztcclxuICAgIHByaXZhdGUgc3RhdGljIGdldCBkZWZhdWx0U2V0dGluZygpXHJcbiAgICB7XHJcbiAgICAgICAgaWYoIXRoaXMuX2RlZmF1bHRTZXR0aW5nKVxyXG4gICAgICAgICAgICB0aGlzLl9kZWZhdWx0U2V0dGluZyA9IG5ldyBQYXJ0aWNsZVNldHRpbmcoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRTZXR0aW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjaGVja1NldHRpbmcoc2V0dGluZzogUGFydGljbGVTZXR0aW5nKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBrZXk7XHJcbiAgICAgICAgZm9yKGtleSBpbiBQYXJ0aWNsZVNldHRpbmcuZGVmYXVsdFNldHRpbmcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZighc2V0dGluZy5oYXNPd25Qcm9wZXJ0eShrZXkpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nW2tleV0gPSBQYXJ0aWNsZVNldHRpbmcuZGVmYXVsdFNldHRpbmdba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcblx0XHRzZXR0aW5nLmVuZFZlbG9jaXR5PStzZXR0aW5nLmVuZFZlbG9jaXR5O1xyXG5cdFx0c2V0dGluZy5ncmF2aXR5WzBdPStzZXR0aW5nLmdyYXZpdHlbMF07XHJcblx0XHRzZXR0aW5nLmdyYXZpdHlbMV09K3NldHRpbmcuZ3Jhdml0eVsxXTtcclxuXHRcdHNldHRpbmcuZ3Jhdml0eVsyXT0rc2V0dGluZy5ncmF2aXR5WzJdO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4uL0dhbWVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnRpY2xlU2hhZGVyIGV4dGVuZHMgTGF5YS5TaGFkZXJcclxue1xyXG4gICAgY29uc3RydWN0b3IoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCB2cyA9IFBhcnRpY2xlU2hhZGVyLnZzO1xyXG4gICAgICAgIGxldCBwcyA9IFBhcnRpY2xlU2hhZGVyLnBzO1xyXG4gICAgICAgIHN1cGVyKFxyXG4gICAgICAgICAgICB2cywgXHJcbiAgICAgICAgICAgIHBzLCBcclxuICAgICAgICAgICAgUGFydGljbGVTaGFkZXIuc2hhZGVyTmFtZSArIFwiMlwiLCAvLyBzYXZlTmFtZVxyXG4gICAgICAgICAgICBudWxsLCAvLyBuYW1lTWFwXHJcbiAgICAgICAgICAgIC8vIGJpbmRBdHRyaWJcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgJ2FfQ29ybmVyVGV4dHVyZUNvb3JkaW5hdGUnLDAsXHJcbiAgICAgICAgICAgICAgICAnYV9Qb3NpdGlvbicsMSxcclxuICAgICAgICAgICAgICAgICdhX1ZlbG9jaXR5JywyLFxyXG4gICAgICAgICAgICAgICAgJ2FfU3RhcnRDb2xvcicsMyxcclxuXHJcbiAgICAgICAgICAgICAgICAnYV9FbmRDb2xvcicsNCxcclxuICAgICAgICAgICAgICAgICdhX1NpemVSb3RhdGlvbicsNSxcclxuICAgICAgICAgICAgICAgICdhX1JhZGl1cycsNixcclxuICAgICAgICAgICAgICAgICdhX1JhZGlhbicsNyxcclxuICAgICAgICAgICAgICAgICdhX0FnZUFkZFNjYWxlJyw4LFxyXG4gICAgICAgICAgICAgICAgJ2FfVGltZScsOVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2hhZGVyTmFtZSA9IFwiUGFydGljbGVTaGFkZXJcIjtcclxuICAgIHN0YXRpYyB2czogc3RyaW5nO1xyXG4gICAgc3RhdGljIHBzOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb1TaGFkZXJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBpbnN0YWxsKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLnZzID0gYXdhaXQgR2FtZS5hc3NldC5sb2FkU2hhZGVyVlNBc3luYyh0aGlzLnNoYWRlck5hbWUpO1xyXG4gICAgICAgIHRoaXMucHMgPSBhd2FpdCBHYW1lLmFzc2V0LmxvYWRTaGFkZXJQU0FzeW5jKHRoaXMuc2hhZGVyTmFtZSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn0iLCJpbXBvcnQgUmVuZGVyU3RhdGUyRCA9IExheWEuUmVuZGVyU3RhdGUyRDtcclxuaW1wb3J0IFBhcnRpY2xlU2hhZGVyIGZyb20gXCIuL1BhcnRpY2xlU2hhZGVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0aWNsZVNoYWRlclZhbHVlIGV4dGVuZHMgTGF5YS5WYWx1ZTJEXHJcbntcclxuICAgIC8qXHJcbiAgICBwdWJsaWMgdmFyIGFfQ29ybmVyVGV4dHVyZUNvb3JkaW5hdGU6QXJyYXk9WzQsV2ViR0xDb250ZXh0LkZMT0FULGZhbHNlLDExNiwwXTtcclxuICAgIHB1YmxpYyB2YXIgYV9Qb3NpdGlvbjpBcnJheT1bMyxXZWJHTENvbnRleHQuRkxPQVQsZmFsc2UsMTE2LDE2XTtcclxuICAgIHB1YmxpYyB2YXIgYV9WZWxvY2l0eTpBcnJheT1bMyxXZWJHTENvbnRleHQuRkxPQVQsZmFsc2UsMTE2LDI4XTtcclxuICAgIHB1YmxpYyB2YXIgYV9TdGFydENvbG9yOkFycmF5PVs0LFdlYkdMQ29udGV4dC5GTE9BVCxmYWxzZSwxMTYsNDBdO1xyXG4gICAgcHVibGljIHZhciBhX0VuZENvbG9yOkFycmF5PVs0LFdlYkdMQ29udGV4dC5GTE9BVCxmYWxzZSwxMTYsNTZdO1xyXG4gICAgcHVibGljIHZhciBhX1NpemVSb3RhdGlvbjpBcnJheT1bMyxXZWJHTENvbnRleHQuRkxPQVQsZmFsc2UsMTE2LDcyXTtcclxuICAgIHB1YmxpYyB2YXIgYV9SYWRpdXM6QXJyYXk9WzIsV2ViR0xDb250ZXh0LkZMT0FULGZhbHNlLDExNiw4NF07XHJcbiAgICBwdWJsaWMgdmFyIGFfUmFkaWFuOkFycmF5PVs0LFdlYkdMQ29udGV4dC5GTE9BVCxmYWxzZSwxMTYsOTJdO1xyXG4gICAgcHVibGljIHZhciBhX0FnZUFkZFNjYWxlOkFycmF5PVsxLFdlYkdMQ29udGV4dC5GTE9BVCxmYWxzZSwxMTYsMTA4XTtcclxuICAgIHB1YmxpYyB2YXIgYV9UaW1lOkFycmF5PVsxLFdlYkdMQ29udGV4dC5GTE9BVCxmYWxzZSwxMTYsMTEyXTtcclxuICAgICovXHJcbiAgICBcclxuICAgIHVfQ3VycmVudFRpbWU6IG51bWJlciA9IE5hTjtcclxuICAgIHVfRHVyYXRpb246IG51bWJlciA9IE5hTjtcclxuICAgIHVfR3Jhdml0eTogRmxvYXQzMkFycmF5ID0gbnVsbDtcclxuICAgIC8vdjNcclxuICAgIHVfRW5kVmVsb2NpdHk6IG51bWJlciA9IE5hTjtcclxuICAgIHVfdGV4dHVyZTogYW55ID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIoMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICAvKlxyXG4gICAgdGhpcy5fYXR0cmliTG9jYXRpb249W1xyXG4gICAgICAgICAgICAnYV9Db3JuZXJUZXh0dXJlQ29vcmRpbmF0ZScsMCxcclxuICAgICAgICAgICAgJ2FfUG9zaXRpb24nLDEsXHJcbiAgICAgICAgICAgICdhX1ZlbG9jaXR5JywyLFxyXG4gICAgICAgICAgICAnYV9TdGFydENvbG9yJywzLFxyXG4gICAgICAgICAgICAnYV9FbmRDb2xvcicsNCxcclxuICAgICAgICAgICAgJ2FfU2l6ZVJvdGF0aW9uJyw1LFxyXG4gICAgICAgICAgICAnYV9SYWRpdXMnLDYsXHJcbiAgICAgICAgICAgICdhX1JhZGlhbicsNyxcclxuICAgICAgICAgICAgJ2FfQWdlQWRkU2NhbGUnLDgsXHJcbiAgICAgICAgICAgICdhX1RpbWUnLDlcclxuICAgICAgICBdO1xyXG4gICAgKi9cclxuICAgIHVwbG9hZCgpOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNpemU9dGhpcy5zaXplO1xyXG5cdFx0c2l6ZVswXT1SZW5kZXJTdGF0ZTJELndpZHRoO1xyXG5cdFx0c2l6ZVsxXT1SZW5kZXJTdGF0ZTJELmhlaWdodDtcclxuXHRcdHRoaXMuYWxwaGE9dGhpcy5BTFBIQSAqUmVuZGVyU3RhdGUyRC53b3JsZEFscGhhO1xyXG5cdFx0UGFydGljbGVTaGFkZXJWYWx1ZS5wU2hhZGVyLnVwbG9hZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfcFNoYWRlcjogUGFydGljbGVTaGFkZXI7XHJcbiAgICBzdGF0aWMgZ2V0IHBTaGFkZXIoKTpQYXJ0aWNsZVNoYWRlciBcclxuICAgIHtcclxuICAgICAgICBpZighdGhpcy5fcFNoYWRlcilcclxuICAgICAgICAgICAgdGhpcy5fcFNoYWRlciA9IG5ldyBQYXJ0aWNsZVNoYWRlcigpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fcFNoYWRlcjtcclxuICAgIH1cclxufSIsImltcG9ydCBQYXJ0aWNsZVRlbXBsYXRlV2ViR0wgZnJvbSBcIi4vUGFydGljbGVUZW1wbGF0ZVdlYkdMXCI7XHJcbmltcG9ydCBQYXJ0aWNsZVNoYWRlclZhbHVlIGZyb20gXCIuL1BhcnRpY2xlU2hhZGVyVmFsdWVcIjtcclxuaW1wb3J0IFBhcnRpY2xlU2V0dGluZyBmcm9tIFwiLi9QYXJ0aWNsZVNldHRpbmdcIjtcclxuaW1wb3J0IEhhbmRsZXIgPSBMYXlhLkhhbmRsZXI7XHJcbmltcG9ydCBCbGVuZE1vZGUgPSBMYXlhLkJsZW5kTW9kZTtcclxuaW1wb3J0IFJlbmRlciA9IExheWEuUmVuZGVyO1xyXG5pbXBvcnQgTWVzaFBhcnRpY2xlMkQgPSBMYXlhLk1lc2hQYXJ0aWNsZTJEO1xyXG5pbXBvcnQgSVN1Ym1pdCA9IExheWEuSVN1Ym1pdDtcclxuaW1wb3J0IFdlYkdMID0gTGF5YS5XZWJHTDtcclxuaW1wb3J0IFdlYkdMQ29udGV4dCA9IExheWEuV2ViR0xDb250ZXh0O1xyXG5pbXBvcnQgU3RhdCA9IExheWEuU3RhdDtcclxuXHJcblxyXG4vLyBpbXBvcnQgUGFydGljbGVUZW1wbGF0ZVdlYkdMID0gTGF5YS5QYXJ0aWNsZVRlbXBsYXRlV2ViR0w7XHJcblxyXG5cclxuXHJcbmRlY2xhcmUgdmFyIFBhcmFtRGF0YTphbnk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0aWNsZVRlbXBsYXRlMkQgZXh0ZW5kcyBQYXJ0aWNsZVRlbXBsYXRlV2ViR0wgaW1wbGVtZW50cyBJU3VibWl0XHJcbntcclxuICAgIHN0YXRpYyBhY3RpdmVCbGVuZFR5cGU6IG51bWJlciA9IC0xO1xyXG4gICAgeDogbnVtYmVyID0gMDtcclxuICAgIHk6IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX2JsZW5kRm46IEZ1bmN0aW9uID0gbnVsbDtcclxuICAgIF9zdGFydFRpbWUgPSAwO1xyXG4gICAgX2tleTogYW55ID0ge307XHJcbiAgICBzdjogUGFydGljbGVTaGFkZXJWYWx1ZSA9IG5ldyBQYXJ0aWNsZVNoYWRlclZhbHVlKCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyU2V0dGluZzogUGFydGljbGVTZXR0aW5nKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKHBhclNldHRpbmcpO1xyXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQodGhpcy5zZXR0aW5ncy50ZXh0dXJlTmFtZSwgSGFuZGxlci5jcmVhdGUobnVsbCwgKHRleHR1cmUpPT5cclxuICAgICAgICB7XHJcblx0XHRcdHRoaXMudGV4dHVyZT10ZXh0dXJlO1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN2LnVfRHVyYXRpb24gPSB0aGlzLnNldHRpbmdzLmR1cmF0aW9uO1xyXG5cdFx0dGhpcy5zdi51X0dyYXZpdHkgPSB0aGlzLnNldHRpbmdzLmdyYXZpdHk7XHJcblx0XHR0aGlzLnN2LnVfRW5kVmVsb2NpdHkgPSB0aGlzLnNldHRpbmdzLmVuZFZlbG9jaXR5O1xyXG4gICAgICAgIHRoaXMuX2JsZW5kRm4gPSBCbGVuZE1vZGUuZm5zW3BhclNldHRpbmcuYmxlbmRTdGF0ZV07XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKFJlbmRlci5pc0NvbmNoQXBwKVxyXG4gICAgICAgIHtcclxuXHRcdFx0dmFyIG5TaXplPU1lc2hQYXJ0aWNsZTJELmNvbnN0X3N0cmlkZSAqdGhpcy5zZXR0aW5ncy5tYXhQYXJ0aWNlcyAqNCAqNDtcclxuXHRcdFx0dGhpcy5fY29uY2hNZXNoPS8qX19KU19fICovbmV3IFBhcmFtRGF0YShuU2l6ZSx0cnVlKTtcclxuXHRcdH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG5cdFx0XHR0aGlzLl9tZXNoPU1lc2hQYXJ0aWNsZTJELmdldEFNZXNoKHRoaXMuc2V0dGluZ3MubWF4UGFydGljZXMpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5pbml0aWFsaXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmVuZGVyVHlwZSgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gLTExMTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVsZWFzZVJlbmRlcigpOiB2b2lkXHJcbiAgICB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhcnRpY2xlQXJyYXkocG9zaXRpb246IEZsb2F0MzJBcnJheSwgdmVsb2NpdHk6IEZsb2F0MzJBcnJheSk6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBwb3NpdGlvblswXSs9dGhpcy54O1xyXG4gICAgICAgIHBvc2l0aW9uWzFdKz10aGlzLnk7XHJcbiAgICAgICAgc3VwZXIuYWRkUGFydGljbGVBcnJheShwb3NpdGlvbiwgdmVsb2NpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG5cdC8qXHJcblx0b3ZlcnJpZGUgcHJvdGVjdGVkIGZ1bmN0aW9uIGxvYWRDb250ZW50KCk6dm9pZHtcclxuXHRcdHZhciBpbmRleGVzOlVpbnQxNkFycmF5PW5ldyBVaW50MTZBcnJheShzZXR0aW5ncy5tYXhQYXJ0aWNlcyAqNik7XHJcblx0XHRmb3IgKHZhciBpOmludD0wO2kgPCBzZXR0aW5ncy5tYXhQYXJ0aWNlcztpKyspe1xyXG5cdFx0XHRpbmRleGVzW2kgKjYrMF09KGkgKjQrMCk7XHJcblx0XHRcdGluZGV4ZXNbaSAqNisxXT0oaSAqNCsxKTtcclxuXHRcdFx0aW5kZXhlc1tpICo2KzJdPShpICo0KzIpO1xyXG5cdFx0XHRpbmRleGVzW2kgKjYrM109KGkgKjQrMCk7XHJcblx0XHRcdGluZGV4ZXNbaSAqNis0XT0oaSAqNCsyKTtcclxuXHRcdFx0aW5kZXhlc1tpICo2KzVdPShpICo0KzMpO1xyXG5cdFx0fVxyXG5cdFx0X2luZGV4QnVmZmVyMkQuY2xlYXIoKTtcclxuXHRcdF9pbmRleEJ1ZmZlcjJELmFwcGVuZChpbmRleGVzKTtcclxuXHRcdF9pbmRleEJ1ZmZlcjJELnVwbG9hZCgpO1xyXG5cdH1cclxuXHJcblx0Ki9cclxuXHJcbiAgICBhZGROZXdQYXJ0aWNsZXNUb1ZlcnRleEJ1ZmZlcigpOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIF92ZXJ0ZXhCdWZmZXIyRD10aGlzLl9tZXNoLl92YjtcclxuXHRcdF92ZXJ0ZXhCdWZmZXIyRC5jbGVhcigpO1xyXG5cdFx0X3ZlcnRleEJ1ZmZlcjJELmFwcGVuZCh0aGlzLl92ZXJ0aWNlcyk7XHJcbiAgICAgICAgdmFyIHN0YXJ0PTA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuX2ZpcnN0TmV3RWxlbWVudCA8IHRoaXMuX2ZpcnN0RnJlZUVsZW1lbnQpXHJcbiAgICAgICAge1xyXG5cdFx0XHRzdGFydD10aGlzLl9maXJzdE5ld0VsZW1lbnQgKjQgKnRoaXMuX2Zsb2F0Q291bnRQZXJWZXJ0ZXggKjQ7XHJcblx0XHRcdF92ZXJ0ZXhCdWZmZXIyRC5zdWJVcGxvYWQoc3RhcnQsIHN0YXJ0ICwgc3RhcnQgKyAodGhpcy5fZmlyc3RGcmVlRWxlbWVudC10aGlzLl9maXJzdE5ld0VsZW1lbnQpICogNCAqIHRoaXMuX2Zsb2F0Q291bnRQZXJWZXJ0ZXggKiA0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICB7XHJcblx0XHRcdHN0YXJ0PXRoaXMuX2ZpcnN0TmV3RWxlbWVudCAqNCAqdGhpcy5fZmxvYXRDb3VudFBlclZlcnRleCAqNDtcclxuICAgICAgICAgICAgX3ZlcnRleEJ1ZmZlcjJELnN1YlVwbG9hZChzdGFydCwgc3RhcnQsIHN0YXJ0Kyh0aGlzLnNldHRpbmdzLm1heFBhcnRpY2VzLXRoaXMuX2ZpcnN0TmV3RWxlbWVudCkqNCAqdGhpcy5fZmxvYXRDb3VudFBlclZlcnRleCAqNCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodGhpcy5fZmlyc3RGcmVlRWxlbWVudCA+IDApXHJcbiAgICAgICAgICAgIHtcclxuXHRcdFx0XHRfdmVydGV4QnVmZmVyMkQuc2V0TmVlZFVwbG9hZCgpO1xyXG5cdFx0XHRcdF92ZXJ0ZXhCdWZmZXIyRC5zdWJVcGxvYWQoMCwwLHRoaXMuX2ZpcnN0RnJlZUVsZW1lbnQgKjQgKnRoaXMuX2Zsb2F0Q291bnRQZXJWZXJ0ZXggKjQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLl9maXJzdE5ld0VsZW1lbnQ9dGhpcy5fZmlyc3RGcmVlRWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJTdWJtaXQoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMudGV4dHVyZSAmJiB0aGlzLnRleHR1cmUuZ2V0SXNSZWFkeSgpKVxyXG4gICAgICAgIHtcclxuXHRcdFx0dGhpcy51cGRhdGUoTGF5YS50aW1lci5fZGVsdGEpO1xyXG5cdFx0XHR0aGlzLnN2LnVfQ3VycmVudFRpbWU9dGhpcy5fY3VycmVudFRpbWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9maXJzdE5ld0VsZW1lbnQgIT10aGlzLl9maXJzdEZyZWVFbGVtZW50KVxyXG4gICAgICAgICAgICB7XHJcblx0XHRcdFx0dGhpcy5hZGROZXdQYXJ0aWNsZXNUb1ZlcnRleEJ1ZmZlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG5cdFx0XHR0aGlzLmJsZW5kKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9maXJzdEFjdGl2ZUVsZW1lbnQgIT10aGlzLl9maXJzdEZyZWVFbGVtZW50KVxyXG4gICAgICAgICAgICB7XHJcblx0XHRcdFx0dmFyIGdsPVdlYkdMLm1haW5Db250ZXh0O1xyXG5cdFx0XHRcdHRoaXMuX21lc2gudXNlTWVzaChnbCk7XHJcblx0XHRcdFx0dGhpcy5zdi51X3RleHR1cmU9dGhpcy50ZXh0dXJlLl9nZXRTb3VyY2UoKTtcclxuXHRcdFx0XHR0aGlzLnN2LnVwbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2ZpcnN0QWN0aXZlRWxlbWVudCA8IHRoaXMuX2ZpcnN0RnJlZUVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICB7XHJcblx0XHRcdFx0XHRXZWJHTC5tYWluQ29udGV4dC5kcmF3RWxlbWVudHMoV2ViR0xDb250ZXh0LlRSSUFOR0xFUywgKHRoaXMuX2ZpcnN0RnJlZUVsZW1lbnQtdGhpcy5fZmlyc3RBY3RpdmVFbGVtZW50KSo2LCAgV2ViR0xDb250ZXh0LlVOU0lHTkVEX1NIT1JULCB0aGlzLl9maXJzdEFjdGl2ZUVsZW1lbnQgKjYgKjIpO1xyXG5cdFx0XHRcdH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuXHRcdFx0XHRcdFdlYkdMLm1haW5Db250ZXh0LmRyYXdFbGVtZW50cyhXZWJHTENvbnRleHQuVFJJQU5HTEVTLCAodGhpcy5zZXR0aW5ncy5tYXhQYXJ0aWNlcy10aGlzLl9maXJzdEFjdGl2ZUVsZW1lbnQpKjYsIFdlYkdMQ29udGV4dC5VTlNJR05FRF9TSE9SVCwgdGhpcy5fZmlyc3RBY3RpdmVFbGVtZW50ICo2ICoyKTtcclxuXHRcdFx0XHRcdGlmICh0aGlzLl9maXJzdEZyZWVFbGVtZW50ID4gMClcclxuXHRcdFx0XHRcdFx0V2ViR0wubWFpbkNvbnRleHQuZHJhd0VsZW1lbnRzKFdlYkdMQ29udGV4dC5UUklBTkdMRVMsdGhpcy5fZmlyc3RGcmVlRWxlbWVudCAqNiwgV2ViR0xDb250ZXh0LlVOU0lHTkVEX1NIT1JULCAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0IVN0YXRbXCJkcmF3Q2FsbFwiXSA/IFN0YXRbXCJkcmF3Q2FsbFwiXSA9IDEgOiBTdGF0W1wiZHJhd0NhbGxcIl0rKztcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLl9kcmF3Q291bnRlcisrO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIDE7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVBhcnRpY2xlRm9yTmF0aXZlKCk6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy50ZXh0dXJlJiZ0aGlzLnRleHR1cmUuZ2V0SXNSZWFkeSgpKVxyXG4gICAgICAgIHtcclxuXHRcdFx0dGhpcy51cGRhdGUoTGF5YS50aW1lci5fZGVsdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnN2LnVfQ3VycmVudFRpbWU9dGhpcy5fY3VycmVudFRpbWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodGhpcy5fZmlyc3ROZXdFbGVtZW50ICE9dGhpcy5fZmlyc3RGcmVlRWxlbWVudClcclxuICAgICAgICAgICAge1xyXG5cdFx0XHRcdHRoaXMuX2ZpcnN0TmV3RWxlbWVudD10aGlzLl9maXJzdEZyZWVFbGVtZW50O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TWVzaCgpOiBNZXNoUGFydGljbGUyRFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbmNoTWVzaCgpOiBhbnlcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uY2hNZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEZpcnN0TmV3RWxlbWVudCgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZmlyc3ROZXdFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGdldEZpcnN0RnJlZUVsZW1lbnQoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpcnN0RnJlZUVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Rmlyc3RBY3RpdmVFbGVtZW50KCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9maXJzdEFjdGl2ZUVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Rmlyc3RSZXRpcmVkRWxlbWVudCgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZmlyc3RSZXRpcmVkRWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRGaXJzdEZyZWVFbGVtZW50KF92YWx1ZTogbnVtYmVyKTogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2ZpcnN0RnJlZUVsZW1lbnQ9X3ZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEZpcnN0TmV3RWxlbWVudChfdmFsdWU6IG51bWJlcik6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9maXJzdE5ld0VsZW1lbnQ9X3ZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZERyYXdDb3VudGVyKCk6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9kcmF3Q291bnRlcisrO1xyXG4gICAgfVxyXG5cclxuICAgIGJsZW5kKCk6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBpZiAoQmxlbmRNb2RlLmFjdGl2ZUJsZW5kRnVuY3Rpb24hPT10aGlzLl9ibGVuZEZuKVxyXG4gICAgICAgIHtcclxuXHRcdFx0dmFyIGdsPVdlYkdMLm1haW5Db250ZXh0O1xyXG5cdFx0XHRnbC5lbmFibGUoV2ViR0xDb250ZXh0LkJMRU5EKTtcclxuXHRcdFx0dGhpcy5fYmxlbmRGbihnbCk7XHJcblx0XHRcdEJsZW5kTW9kZS5hY3RpdmVCbGVuZEZ1bmN0aW9uPXRoaXMuX2JsZW5kRm47XHJcblx0XHR9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGRpc3Bvc2UoKTogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmICghUmVuZGVyLmlzQ29uY2hBcHApXHJcbiAgICAgICAge1xyXG5cdFx0XHR0aGlzLl9tZXNoLnJlbGVhc2VNZXNoKCk7XHJcblx0XHR9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUGFydGljbGVTZXR0aW5nIGZyb20gXCIuL1BhcnRpY2xlU2V0dGluZ1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFydGljbGVUZW1wbGF0ZUJhc2Vcclxue1xyXG4gICAgLyoqXHJcbiAgICAq57KS5a2Q6YWN572u5pWw5o2uXHJcbiAgICAqL1xyXG4gICBzZXR0aW5nczogUGFydGljbGVTZXR0aW5nID0gbnVsbDtcclxuICAgXHJcbiAgICAvKipcclxuICAgICrnspLlrZDotLTlm75cclxuICAgICovXHJcbiAgIHRleHR1cmU6IExheWEuVGV4dHVyZSA9IG51bGw7XHJcblxyXG4gICAvKipcclxuXHQq5re75Yqg5LiA5Liq57KS5a2QXHJcblx0KkBwYXJhbSBwb3NpdGlvbiDnspLlrZDkvY3nva5cclxuXHQqQHBhcmFtIHZlbG9jaXR5IOeykuWtkOmAn+W6plxyXG5cdCpcclxuICAgICovXHJcbiAgIGFkZFBhcnRpY2xlQXJyYXkocG9zaXRpb246IEZsb2F0MzJBcnJheSwgdmVsb2NpdHk6IEZsb2F0MzJBcnJheSlcclxuICAge1xyXG5cclxuICAgfVxyXG59IiwiaW1wb3J0IFBhcnRpY2xlVGVtcGxhdGVCYXNlIGZyb20gXCIuL1BhcnRpY2xlVGVtcGxhdGVCYXNlXCI7XHJcbmltcG9ydCBQYXJ0aWNsZVNldHRpbmcgZnJvbSBcIi4vUGFydGljbGVTZXR0aW5nXCI7XHJcbmltcG9ydCBQaWNUb29sIGZyb20gXCIuL1BpY1Rvb2xcIjtcclxuaW1wb3J0IFBhcnRpY2xlRGF0YSBmcm9tIFwiLi9QYXJ0aWNsZURhdGFcIjtcclxuaW1wb3J0IENNRFBhcnRpY2xlIGZyb20gXCIuL0NNRFBhcnRpY2xlXCI7XHJcblxyXG5pbXBvcnQgVGV4dHVyZSA9IExheWEuVGV4dHVyZTtcclxuaW1wb3J0IEV2ZW50ID0gTGF5YS5FdmVudDtcclxuaW1wb3J0IFV0aWxzID0gTGF5YS5VdGlscztcclxuaW1wb3J0IENvbnRleHQgPSBMYXlhLkNvbnRleHQ7XHJcbmltcG9ydCBDYW52YXNTaGFkZXIgZnJvbSBcIi4vQ2FudmFzU2hhZGVyXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnRpY2xlVGVtcGxhdGVDYW52YXMgZXh0ZW5kcyBQYXJ0aWNsZVRlbXBsYXRlQmFzZVxyXG57XHJcblxyXG4gICAgLyoqXHJcbiAgICAq5piv5ZCm5aSE5LqO5Y+v5pKt5pS+54q25oCBXHJcbiAgICAqL1xyXG4gICAgX3JlYWR5PWZhbHNlO1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIOi0tOWbvuWIl+ihqFxyXG4gICAgICovXHJcbiAgICB0ZXh0dXJlTGlzdDogQXJyYXk8VGV4dHVyZT4gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOeykuWtkOWIl+ihqFxyXG4gICAgICovXHJcbiAgICBwYXJ0aWNsZUxpc3Q6IEFycmF5PGFueT4gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOi0tOWbvuS4reW/g+WBj+enu3hcclxuICAgICAqL1xyXG4gICAgcFg6IG51bWJlciA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDotLTlm77kuK3lv4PlgY/np7t5XHJcbiAgICAgKi9cclxuICAgIHBZOiBudW1iZXIgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPliY3mtLvot4PnmoTnspLlrZBcclxuICAgICAqL1xyXG4gICAgYWN0aXZlUGFydGljbGVzOiBBcnJheTxhbnk+ID0gW107XHJcbiAgICAvKipcclxuICAgICAqIOeykuWtkHBvb2xcclxuICAgICAqL1xyXG4gICAgZGVhZFBhcnRpY2xlczogQXJyYXk8YW55PiA9IFtdO1xyXG4gICAgLyoqXHJcbiAgICAgKiDnspLlrZDmkq3mlL7ov5vluqbliJfooahcclxuICAgICAqL1xyXG4gICAgaUxpc3Q6IEFycmF5PGFueT4gPSBbXTtcclxuICAgIHByb3RlY3RlZCBfbWF4TnVtUGFydGljbGVzOiBudW1iZXIgPSAwO1xyXG4gICAgLyoqXHJcbiAgICAgKiDnurnnkIbnmoTlrr3luqZcclxuICAgICAqL1xyXG4gICAgdGV4dHVyZVdpZHRoOiBudW1iZXIgPSBOYU47XHJcbiAgICAvKipcclxuICAgICAqIOWuveW6puWAkuaVsFxyXG4gICAgICovXHJcbiAgICBkVGV4dHVyZVdpZHRoOiBudW1iZXIgPSBOYU47XHJcbiAgICAvKipcclxuICAgICAqIOaYr+WQpuaUr+aMgeminOiJsuWPmOWMllxyXG4gICAgICovXHJcbiAgICBjb2xvckNoYW5nZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAvKipcclxuICAgICAqIOmHh+agt+atpemVv1xyXG4gICAgICovXHJcbiAgICBzdGVwOiBudW1iZXIgPSAxLzYwO1xyXG5cclxuICAgIFxyXG4gICAgY2FudmFzU2hhZGVyID0gbmV3IENhbnZhc1NoYWRlcigpO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJ0aWNsZVNldHRpbmc6IFBhcnRpY2xlU2V0dGluZylcclxuICAgIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBwYXJ0aWNsZVNldHRpbmc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fbWF4TnVtUGFydGljbGVzPXBhcnRpY2xlU2V0dGluZy5tYXhQYXJ0aWNlcztcclxuICAgICAgICB0aGlzLnRleHR1cmU9bmV3IFRleHR1cmUoKTtcclxuICAgICAgICB0aGlzLnRleHR1cmUub24oRXZlbnQuUkVBRFksIHRoaXMsIHRoaXMuX3RleHR1cmVMb2FkZWQpO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZS5sb2FkKHBhcnRpY2xlU2V0dGluZy50ZXh0dXJlTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3RleHR1cmVMb2FkZWQoZTogRXZlbnQpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zZXRUZXh0dXJlKHRoaXMudGV4dHVyZSk7XHJcbiAgICAgICAgdGhpcy5fcmVhZHk9dHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhcihjbGVhclRleHR1cmU/OiBib29sZWFuKTogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIChjbGVhclRleHR1cmU9PT12b2lkIDApJiYgKGNsZWFyVGV4dHVyZT10cnVlKTtcclxuXHRcdHRoaXMuZGVhZFBhcnRpY2xlcy5sZW5ndGg9MDtcclxuXHRcdHRoaXMuYWN0aXZlUGFydGljbGVzLmxlbmd0aD0wO1xyXG5cdFx0dGhpcy50ZXh0dXJlTGlzdC5sZW5ndGg9MDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiuvue9rue6ueeQhlxyXG4gICAgICogQHBhcmFtIHRleHR1cmVcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHNldFRleHR1cmUodGV4dHVyZTogVGV4dHVyZSk6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLnRleHR1cmUgICAgICAgICAgICA9IHRleHR1cmU7XHJcblx0XHR0aGlzLnRleHR1cmVXaWR0aCAgICAgICA9IHRleHR1cmUud2lkdGg7XHJcblx0XHR0aGlzLmRUZXh0dXJlV2lkdGggICAgICA9IDEvdGhpcy50ZXh0dXJlV2lkdGg7XHJcblx0XHR0aGlzLnBYICAgICAgICAgICAgICAgICA9IC10ZXh0dXJlLndpZHRoKjAuNTtcclxuXHRcdHRoaXMucFkgICAgICAgICAgICAgICAgID0gLXRleHR1cmUuaGVpZ2h0KjAuNTtcclxuXHRcdHRoaXMudGV4dHVyZUxpc3QgICAgICAgID0gUGFydGljbGVUZW1wbGF0ZUNhbnZhcy5jaGFuZ2VUZXh0dXJlKHRleHR1cmUsdGhpcy50ZXh0dXJlTGlzdCk7XHJcblx0XHR0aGlzLnBhcnRpY2xlTGlzdC5sZW5ndGggICAgPTA7XHJcblx0XHR0aGlzLmRlYWRQYXJ0aWNsZXMubGVuZ3RoICAgPTA7XHJcblx0XHR0aGlzLmFjdGl2ZVBhcnRpY2xlcy5sZW5ndGggPTA7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNoYW5nZVRleHR1cmUodGV4dHVyZTogVGV4dHVyZSwgcnN0OiBBcnJheTxUZXh0dXJlPiwgc2V0dGluZ3M/OiBQYXJ0aWNsZVNldHRpbmcpOiBBcnJheTxhbnk+XHJcbiAgICB7XHJcbiAgICAgICAgaWYoIXJzdClyc3Q9W107XHJcblxyXG5cdFx0cnN0Lmxlbmd0aD0wO1xyXG4gICAgICAgIGlmIChzZXR0aW5ncyYmc2V0dGluZ3MuZGlzYWJsZUNvbG9yKVxyXG4gICAgICAgIHtcclxuXHRcdFx0cnN0LnB1c2godGV4dHVyZSx0ZXh0dXJlLHRleHR1cmUpO1xyXG4gICAgICAgIH1lbHNlXHJcbiAgICAgICAge1xyXG5cdFx0XHRVdGlscy5jb3B5QXJyYXkocnN0LCBQaWNUb29sLmdldFJHQlBpYyh0ZXh0dXJlKSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcnN0O1xyXG4gICAgfVxyXG5cclxuXHQvKipcclxuXHQq5Yib5bu65LiA5Liq57KS5a2Q5pWw5o2uXHJcblx0KkByZXR1cm5cclxuXHQqXHJcblx0Ki9cclxuICAgIF9jcmVhdGVBUGFydGljbGVEYXRhKHBvc2l0aW9uLHZlbG9jaXR5KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY2FudmFzU2hhZGVyLnVfRW5kVmVsb2NpdHk9dGhpcy5zZXR0aW5ncy5lbmRWZWxvY2l0eTtcclxuXHRcdHRoaXMuY2FudmFzU2hhZGVyLnVfR3Jhdml0eT10aGlzLnNldHRpbmdzLmdyYXZpdHk7XHJcblx0XHR0aGlzLmNhbnZhc1NoYWRlci51X0R1cmF0aW9uPXRoaXMuc2V0dGluZ3MuZHVyYXRpb247XHJcblx0XHR2YXIgcGFydGljbGU7XHJcblx0XHRwYXJ0aWNsZT0gUGFydGljbGVEYXRhLkNyZWF0ZSh0aGlzLnNldHRpbmdzLHBvc2l0aW9uLHZlbG9jaXR5LDApO1xyXG5cdFx0dGhpcy5jYW52YXNTaGFkZXIuYV9Qb3NpdGlvbj1wYXJ0aWNsZS5wb3NpdGlvbjtcclxuXHRcdHRoaXMuY2FudmFzU2hhZGVyLmFfVmVsb2NpdHk9cGFydGljbGUudmVsb2NpdHk7XHJcblx0XHR0aGlzLmNhbnZhc1NoYWRlci5hX1N0YXJ0Q29sb3I9cGFydGljbGUuc3RhcnRDb2xvcjtcclxuXHRcdHRoaXMuY2FudmFzU2hhZGVyLmFfRW5kQ29sb3I9cGFydGljbGUuZW5kQ29sb3I7XHJcblx0XHR0aGlzLmNhbnZhc1NoYWRlci5hX1NpemVSb3RhdGlvbj1wYXJ0aWNsZS5zaXplUm90YXRpb247XHJcblx0XHR0aGlzLmNhbnZhc1NoYWRlci5hX1JhZGl1cz1wYXJ0aWNsZS5yYWRpdXM7XHJcblx0XHR0aGlzLmNhbnZhc1NoYWRlci5hX1JhZGlhbj1wYXJ0aWNsZS5yYWRpYW47XHJcblx0XHR0aGlzLmNhbnZhc1NoYWRlci5hX0FnZUFkZFNjYWxlPXBhcnRpY2xlLmR1cmF0aW9uQWRkU2NhbGU7XHJcbiAgICAgICAgdGhpcy5jYW52YXNTaGFkZXIub1NpemU9dGhpcy50ZXh0dXJlV2lkdGg7XHJcbiAgICAgICAgXHJcblx0XHR2YXIgcnN0PW5ldyBDTURQYXJ0aWNsZSgpO1xyXG5cdFx0dmFyIGk9MCxsZW49dGhpcy5zZXR0aW5ncy5kdXJhdGlvbi8oMStwYXJ0aWNsZS5kdXJhdGlvbkFkZFNjYWxlKTtcclxuXHRcdHZhciBwYXJhbXM9W107XHJcblx0XHR2YXIgbVN0ZXA9TmFOO1xyXG4gICAgICAgIGZvcihpPTA7aTxsZW47aSs9dGhpcy5zdGVwKVxyXG4gICAgICAgIHtcclxuXHRcdFx0cGFyYW1zLnB1c2godGhpcy5jYW52YXNTaGFkZXIuZ2V0RGF0YShpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cdFx0cnN0LmlkPXRoaXMucGFydGljbGVMaXN0Lmxlbmd0aDtcclxuXHRcdHRoaXMucGFydGljbGVMaXN0LnB1c2gocnN0KTtcclxuXHRcdHJzdC5zZXRDbWRzKHBhcmFtcyk7XHJcblx0XHRyZXR1cm4gcnN0O1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFBhcnRpY2xlQXJyYXkocG9zaXRpb246IEZsb2F0MzJBcnJheSwgdmVsb2NpdHk6IEZsb2F0MzJBcnJheSk6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBpZighdGhpcy5fcmVhZHkpcmV0dXJuO1xyXG5cdFx0dmFyIHRQYXJ0aWNsZTtcclxuICAgICAgICBpZih0aGlzLnBhcnRpY2xlTGlzdC5sZW5ndGg8dGhpcy5fbWF4TnVtUGFydGljbGVzKVxyXG4gICAgICAgIHtcclxuXHRcdFx0dFBhcnRpY2xlPXRoaXMuX2NyZWF0ZUFQYXJ0aWNsZURhdGEocG9zaXRpb24sdmVsb2NpdHkpO1xyXG5cdFx0XHR0aGlzLmlMaXN0W3RQYXJ0aWNsZS5pZF09MDtcclxuXHRcdFx0dGhpcy5hY3RpdmVQYXJ0aWNsZXMucHVzaCh0UGFydGljbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLmRlYWRQYXJ0aWNsZXMubGVuZ3RoPjApXHJcbiAgICAgICAgICAgIHtcclxuXHRcdFx0XHR0UGFydGljbGU9dGhpcy5kZWFkUGFydGljbGVzLnBvcCgpO1xyXG5cdFx0XHRcdHRoaXMuaUxpc3RbdFBhcnRpY2xlLmlkXT0wO1xyXG5cdFx0XHRcdHRoaXMuYWN0aXZlUGFydGljbGVzLnB1c2godFBhcnRpY2xlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhZHZhbmNlVGltZShwYXNzZWRUaW1lPzogbnVtYmVyKTogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIChwYXNzZWRUaW1lPT09dm9pZCAwKSYmIChwYXNzZWRUaW1lPTEpO1xyXG5cclxuICAgICAgICBpZighdGhpcy5fcmVhZHkpcmV0dXJuO1xyXG4gICAgICAgIFxyXG5cdFx0dmFyIHBhcnRpY2xlTGlzdD10aGlzLmFjdGl2ZVBhcnRpY2xlcztcclxuXHRcdHZhciBwb29sPXRoaXMuZGVhZFBhcnRpY2xlcztcclxuXHRcdHZhciBpPTAsbGVuPXBhcnRpY2xlTGlzdC5sZW5ndGg7XHJcblx0XHR2YXIgdGNtZDtcclxuXHRcdHZhciB0ST0wO1xyXG5cdFx0dmFyIGlMaXN0PXRoaXMuaUxpc3Q7XHJcbiAgICAgICAgZm9yKGk9bGVuLTE7aT4tMTtpLS0pXHJcbiAgICAgICAge1xyXG5cdFx0XHR0Y21kPXBhcnRpY2xlTGlzdFtpXTtcclxuXHRcdFx0dEk9aUxpc3RbdGNtZC5pZF07XHJcbiAgICAgICAgICAgIGlmKHRJPj10Y21kLm1heEluZGV4KVxyXG4gICAgICAgICAgICB7XHJcblx0XHRcdFx0dEk9MDtcclxuXHRcdFx0XHRwYXJ0aWNsZUxpc3Quc3BsaWNlKGksMSk7XHJcblx0XHRcdFx0cG9vbC5wdXNoKHRjbWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG5cdFx0XHRcdHRJKz0xO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlMaXN0W3RjbWQuaWRdPXRJO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjb250ZXh0OiBDb250ZXh0LCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBpZighdGhpcy5fcmVhZHkpcmV0dXJuO1xyXG5cclxuICAgICAgICBpZih0aGlzLmFjdGl2ZVBhcnRpY2xlcy5sZW5ndGg8MSlyZXR1cm47XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMudGV4dHVyZUxpc3QubGVuZ3RoIDwgMilyZXR1cm47XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZGlzYWJsZUNvbG9yKVxyXG4gICAgICAgIHtcclxuXHRcdFx0dGhpcy5ub0NvbG9yUmVuZGVyKGNvbnRleHQseCx5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuXHRcdFx0dGhpcy5jYW52YXNSZW5kZXIoY29udGV4dCx4LHkpO1xyXG5cdFx0fVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBub0NvbG9yUmVuZGVyKGNvbnRleHQ6IENvbnRleHQsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHZhciBwYXJ0aWNsZUxpc3Q9dGhpcy5hY3RpdmVQYXJ0aWNsZXM7XHJcblx0XHR2YXIgaT0wLGxlbj1wYXJ0aWNsZUxpc3QubGVuZ3RoO1xyXG5cdFx0dmFyIHRjbWQ7XHJcblx0XHR2YXIgdFBhcmFtO1xyXG5cdFx0dmFyIHRBbHBoYT1OYU47XHJcblx0XHR2YXIgcHg9dGhpcy5wWCxweT10aGlzLnBZO1xyXG5cdFx0dmFyIHB3PS1weCoyLHBoPS1weSoyO1xyXG5cdFx0dmFyIHRJPTA7XHJcblx0XHR2YXIgdGV4dHVyZUxpc3Q9dGhpcy50ZXh0dXJlTGlzdDtcclxuXHRcdHZhciBpTGlzdD10aGlzLmlMaXN0O1xyXG5cdFx0dmFyIHByZUFscGhhPU5hTjtcclxuXHRcdGNvbnRleHQudHJhbnNsYXRlKHgseSk7XHJcblx0XHRwcmVBbHBoYT1jb250ZXh0Lmdsb2JhbEFscGhhO1xyXG4gICAgICAgIGZvcihpPTA7aTxsZW47aSsrKVxyXG4gICAgICAgIHtcclxuXHRcdFx0dGNtZD1wYXJ0aWNsZUxpc3RbaV07XHJcblx0XHRcdHRJPWlMaXN0W3RjbWQuaWRdO1xyXG5cdFx0XHR0UGFyYW09dGNtZC5jbWRzW3RJXTtcclxuXHRcdFx0aWYgKCF0UGFyYW0pY29udGludWUgO1xyXG5cdFx0XHRpZiAoKHRBbHBoYT10UGFyYW1bMV0pPD0wLjAxKWNvbnRpbnVlIDtcclxuXHRcdFx0Y29udGV4dC5nbG9iYWxBbHBoYT1wcmVBbHBoYSp0QWxwaGE7XHJcblx0XHRcdGNvbnRleHQuZHJhd1RleHR1cmVXaXRoVHJhbnNmb3JtKHRoaXMudGV4dHVyZSxweCxweSxwdyxwaCx0UGFyYW1bMl0sMCwwLDEsbnVsbCk7XHJcblx0XHR9XHJcblx0XHRjb250ZXh0Lmdsb2JhbEFscGhhPXByZUFscGhhO1xyXG5cdFx0Y29udGV4dC50cmFuc2xhdGUoLXgsLXkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbnZhc1JlbmRlcihjb250ZXh0OiBDb250ZXh0LCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB2YXIgcGFydGljbGVMaXN0PXRoaXMuYWN0aXZlUGFydGljbGVzO1xyXG5cdFx0dmFyIGk9MCxsZW49cGFydGljbGVMaXN0Lmxlbmd0aDtcclxuXHRcdHZhciB0Y21kO1xyXG5cdFx0dmFyIHRQYXJhbTtcclxuXHRcdHZhciB0QWxwaGE9TmFOO1xyXG5cdFx0dmFyIHB4PXRoaXMucFgscHk9dGhpcy5wWTtcclxuXHRcdHZhciBwdz0tcHgqMixwaD0tcHkqMjtcclxuXHRcdHZhciB0ST0wO1xyXG5cdFx0dmFyIHRleHR1cmVMaXN0PXRoaXMudGV4dHVyZUxpc3Q7XHJcblx0XHR2YXIgaUxpc3Q9dGhpcy5pTGlzdDtcclxuXHRcdHZhciBwcmVBbHBoYT1OYU47XHJcblx0XHR2YXIgcHJlQjtcclxuXHRcdGNvbnRleHQudHJhbnNsYXRlKHgseSk7XHJcblx0XHRwcmVBbHBoYT1jb250ZXh0Lmdsb2JhbEFscGhhO1xyXG5cdFx0cHJlQj1jb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbjtcclxuXHRcdGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uPVwibGlnaHRlclwiO1xyXG4gICAgICAgIGZvcihpPTA7aTxsZW47aSsrKVxyXG4gICAgICAgIHtcclxuXHRcdFx0dGNtZD1wYXJ0aWNsZUxpc3RbaV07XHJcblx0XHRcdHRJPWlMaXN0W3RjbWQuaWRdO1xyXG5cdFx0XHR0UGFyYW09dGNtZC5jbWRzW3RJXTtcclxuXHRcdFx0aWYgKCF0UGFyYW0pY29udGludWUgO1xyXG5cdFx0XHRpZiAoKHRBbHBoYT10UGFyYW1bMV0pPD0wLjAxKWNvbnRpbnVlIDtcclxuXHRcdFx0Y29udGV4dC5zYXZlKCk7XHJcblx0XHRcdGNvbnRleHQudHJhbnNmb3JtQnlNYXRyaXgodFBhcmFtWzJdLDAsMCk7XHJcbiAgICAgICAgICAgIGlmKHRQYXJhbVszXT4wLjAxKVxyXG4gICAgICAgICAgICB7XHJcblx0XHRcdFx0Y29udGV4dC5nbG9iYWxBbHBoYT1wcmVBbHBoYSAqdFBhcmFtWzNdO1xyXG5cdFx0XHRcdGNvbnRleHQuZHJhd1RleHR1cmUodGV4dHVyZUxpc3RbMF0scHgscHkscHcscGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZih0UGFyYW1bNF0+MC4wMSlcclxuICAgICAgICAgICAge1xyXG5cdFx0XHRcdGNvbnRleHQuZ2xvYmFsQWxwaGE9cHJlQWxwaGEgKnRQYXJhbVs0XTtcclxuXHRcdFx0XHRjb250ZXh0LmRyYXdUZXh0dXJlKHRleHR1cmVMaXN0WzFdLHB4LHB5LHB3LHBoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYodFBhcmFtWzVdPjAuMDEpXHJcbiAgICAgICAgICAgIHtcclxuXHRcdFx0XHRjb250ZXh0Lmdsb2JhbEFscGhhPXByZUFscGhhICp0UGFyYW1bNV07XHJcblx0XHRcdFx0Y29udGV4dC5kcmF3VGV4dHVyZSh0ZXh0dXJlTGlzdFsyXSxweCxweSxwdyxwaCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29udGV4dC5yZXN0b3JlKCk7XHJcblx0XHR9XHJcblx0XHRjb250ZXh0Lmdsb2JhbEFscGhhPXByZUFscGhhO1xyXG5cdFx0Y29udGV4dC50cmFuc2xhdGUoLXgsLXkpO1xyXG5cdFx0Y29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb249cHJlQjtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgV2ViR0xDb250ZXh0MkQgPSBMYXlhLldlYkdMQ29udGV4dDJEO1xyXG5pbXBvcnQgUmVuZGVyID0gTGF5YS5SZW5kZXI7XHJcbmltcG9ydCBNZXNoUGFydGljbGUyRCA9IExheWEuTWVzaFBhcnRpY2xlMkQ7XHJcbmltcG9ydCBQYXJ0aWNsZVRlbXBsYXRlQmFzZSBmcm9tIFwiLi9QYXJ0aWNsZVRlbXBsYXRlQmFzZVwiO1xyXG5pbXBvcnQgUGFydGljbGVEYXRhIGZyb20gXCIuL1BhcnRpY2xlRGF0YVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFydGljbGVUZW1wbGF0ZVdlYkdMIGV4dGVuZHMgUGFydGljbGVUZW1wbGF0ZUJhc2Vcclxue1xyXG4gICAgLyoqIOmhtueCueaVsOaNriAqL1xyXG4gICAgcHJvdGVjdGVkIF92ZXJ0aWNlczogRmxvYXQzMkFycmF5O1xyXG4gICAgcHJvdGVjdGVkIF9tZXNoOiBMYXlhLk1lc2hQYXJ0aWNsZTJEO1xyXG4gICAgcHJvdGVjdGVkIF9jb25jaE1lc2g6IGFueTtcclxuICAgIHByb3RlY3RlZCBfZmxvYXRDb3VudFBlclZlcnRleDogbnVtYmVyID0gMjk7XHJcblxyXG4gICAgLy8wfjPkuLpDb3JuZXJUZXh0dXJlQ29vcmRpbmF0ZSxcclxuICAgIC8vNH425Li6UG9zaXRpb24sXHJcbiAgICAvLzd+OVZlbG9jaXR5LFxyXG4gICAgLy8xMOWIsDEz5Li6U3RhcnRDb2xvcixcclxuICAgIC8vMTTliLAxN+S4ukVuZENvbG9yLFxyXG4gICAgLy8xOOWIsDIw5L2NU2l6ZVJvdGF0aW9u77yMXHJcbiAgICAvLzIx5YiwMjLkvY1SYWRpdXMsXHJcbiAgICAvLzIz5YiwMjbkvY1SYWRpYW7vvIxcclxuICAgIC8vMjfkuLpEdXJhdGlvbkFkZFNjYWxlU2hhZGVyVmFsdWUsXHJcbiAgICAvLzI45Li6VGltZVxyXG4gICAgcHJvdGVjdGVkIF9maXJzdEFjdGl2ZUVsZW1lbnQ6IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX2ZpcnN0TmV3RWxlbWVudDogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBfZmlyc3RGcmVlRWxlbWVudDogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBfZmlyc3RSZXRpcmVkRWxlbWVudDogbnVtYmVyID0gMDtcclxuICAgIF9jdXJyZW50VGltZTogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBfZHJhd0NvdW50ZXI6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZylcclxuICAgIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHJlVXNlKGNvbnRleHQ6IFdlYkdMQ29udGV4dDJELCBwb3M6IG51bWJlcik6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiDliJ3lp4vljJYgKi9cclxuICAgIHByb3RlY3RlZCBpbml0aWFsaXplKCk6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB2YXIgZmxvYXRTdHJpZGU9MDtcclxuXHRcdGlmIChSZW5kZXIuaXNDb25jaEFwcCl7XHJcblx0XHRcdHRoaXMuX3ZlcnRpY2VzPXRoaXMuX2NvbmNoTWVzaC5fZmxvYXQzMkRhdGE7XHJcblx0XHRcdGZsb2F0U3RyaWRlPU1lc2hQYXJ0aWNsZTJELmNvbnN0X3N0cmlkZSAvIDQ7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHR0aGlzLl92ZXJ0aWNlcz10aGlzLl9tZXNoLl92Yi5nZXRGbG9hdDMyQXJyYXkoKTtcclxuXHRcdFx0ZmxvYXRTdHJpZGU9dGhpcy5fbWVzaC5fc3RyaWRlIC8gNDtcclxuXHRcdH07XHJcblx0XHR2YXIgYnVmaT0wO1xyXG5cdFx0dmFyIGJ1ZlN0YXJ0PTA7XHJcblx0XHRmb3IgKHZhciBpPTA7aSA8IHRoaXMuc2V0dGluZ3MubWF4UGFydGljZXM7aSsrKXtcclxuXHRcdFx0dmFyIHJhbmRvbT1NYXRoLnJhbmRvbSgpO1xyXG5cdFx0XHR2YXIgY29ybmVyWVNlZ2VtZW50PXRoaXMuc2V0dGluZ3MudGV4dHVyZUNvdW50ID8gMS4wIC8gdGhpcy5zZXR0aW5ncy50ZXh0dXJlQ291bnQgOjEuMDtcclxuXHRcdFx0dmFyIGNvcm5lclk9TmFOO1xyXG5cdFx0XHRmb3IgKGNvcm5lclk9MDtjb3JuZXJZIDwgdGhpcy5zZXR0aW5ncy50ZXh0dXJlQ291bnQ7Y29ybmVyWSs9Y29ybmVyWVNlZ2VtZW50KXtcclxuXHRcdFx0XHRpZiAocmFuZG9tIDwgY29ybmVyWStjb3JuZXJZU2VnZW1lbnQpXHJcblx0XHRcdFx0XHRicmVhayA7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5fdmVydGljZXNbYnVmaSsrXT0tMTtcclxuXHRcdFx0dGhpcy5fdmVydGljZXNbYnVmaSsrXT0tMTtcclxuXHRcdFx0dGhpcy5fdmVydGljZXNbYnVmaSsrXT0wO1xyXG5cdFx0XHR0aGlzLl92ZXJ0aWNlc1tidWZpKytdPWNvcm5lclk7XHJcblx0XHRcdGJ1Zmk9KGJ1ZlN0YXJ0Kz1mbG9hdFN0cmlkZSk7XHJcblx0XHRcdHRoaXMuX3ZlcnRpY2VzW2J1ZmkrK109MTtcclxuXHRcdFx0dGhpcy5fdmVydGljZXNbYnVmaSsrXT0tMTtcclxuXHRcdFx0dGhpcy5fdmVydGljZXNbYnVmaSsrXT0xO1xyXG5cdFx0XHR0aGlzLl92ZXJ0aWNlc1tidWZpKytdPWNvcm5lclk7XHJcblx0XHRcdGJ1Zmk9YnVmU3RhcnQrPWZsb2F0U3RyaWRlO1xyXG5cdFx0XHR0aGlzLl92ZXJ0aWNlc1tidWZpKytdPTE7XHJcblx0XHRcdHRoaXMuX3ZlcnRpY2VzW2J1ZmkrK109MTtcclxuXHRcdFx0dGhpcy5fdmVydGljZXNbYnVmaSsrXT0xO1xyXG5cdFx0XHR0aGlzLl92ZXJ0aWNlc1tidWZpKytdPWNvcm5lclkrY29ybmVyWVNlZ2VtZW50O1xyXG5cdFx0XHRidWZpPWJ1ZlN0YXJ0Kz1mbG9hdFN0cmlkZTtcclxuXHRcdFx0dGhpcy5fdmVydGljZXNbYnVmaSsrXT0tMTtcclxuXHRcdFx0dGhpcy5fdmVydGljZXNbYnVmaSsrXT0xO1xyXG5cdFx0XHR0aGlzLl92ZXJ0aWNlc1tidWZpKytdPTA7XHJcblx0XHRcdHRoaXMuX3ZlcnRpY2VzW2J1ZmkrK109Y29ybmVyWStjb3JuZXJZU2VnZW1lbnQ7XHJcblx0XHRcdGJ1Zmk9YnVmU3RhcnQrPWZsb2F0U3RyaWRlO1xyXG5cdFx0fVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZWxhcHNlZFRpbWU6IG51bWJlcik6IHZvaWRcclxuICAgIHtcclxuXHRcdHRoaXMuX2N1cnJlbnRUaW1lKz1lbGFwc2VkVGltZSAvIDEwMDA7XHJcblx0XHR0aGlzLnJldGlyZUFjdGl2ZVBhcnRpY2xlcygpO1xyXG5cdFx0dGhpcy5mcmVlUmV0aXJlZFBhcnRpY2xlcygpO1xyXG5cdFx0aWYgKHRoaXMuX2ZpcnN0QWN0aXZlRWxlbWVudD09dGhpcy5fZmlyc3RGcmVlRWxlbWVudClcclxuXHRcdFx0dGhpcy5fY3VycmVudFRpbWU9MDtcclxuXHRcdGlmICh0aGlzLl9maXJzdFJldGlyZWRFbGVtZW50PT10aGlzLl9maXJzdEFjdGl2ZUVsZW1lbnQpXHJcblx0XHRcdHRoaXMuX2RyYXdDb3VudGVyPTA7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiDms6jplIDmtLvliqjnspLlrZAgKi9cclxuICAgIHJldGlyZUFjdGl2ZVBhcnRpY2xlcygpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGVwc2lsb249MC4wMDAxO1xyXG5cdFx0dmFyIHBhcnRpY2xlRHVyYXRpb249dGhpcy5zZXR0aW5ncy5kdXJhdGlvbjtcclxuXHRcdHdoaWxlICh0aGlzLl9maXJzdEFjdGl2ZUVsZW1lbnQgIT10aGlzLl9maXJzdE5ld0VsZW1lbnQpe1xyXG5cdFx0XHR2YXIgb2Zmc2V0PXRoaXMuX2ZpcnN0QWN0aXZlRWxlbWVudCAqdGhpcy5fZmxvYXRDb3VudFBlclZlcnRleCAqNDtcclxuXHRcdFx0dmFyIGluZGV4PW9mZnNldCsyODtcclxuXHRcdFx0dmFyIHBhcnRpY2xlQWdlPXRoaXMuX2N1cnJlbnRUaW1lLXRoaXMuX3ZlcnRpY2VzW2luZGV4XTtcclxuXHRcdFx0cGFydGljbGVBZ2UgKj0oMS4wK3RoaXMuX3ZlcnRpY2VzW29mZnNldCsyN10pO1xyXG5cdFx0XHRpZiAocGFydGljbGVBZ2UrZXBzaWxvbiA8IHBhcnRpY2xlRHVyYXRpb24pXHJcblx0XHRcdFx0YnJlYWsgO1xyXG5cdFx0XHR0aGlzLl92ZXJ0aWNlc1tpbmRleF09dGhpcy5fZHJhd0NvdW50ZXI7XHJcblx0XHRcdHRoaXMuX2ZpcnN0QWN0aXZlRWxlbWVudCsrO1xyXG5cdFx0XHRpZiAodGhpcy5fZmlyc3RBY3RpdmVFbGVtZW50ID49dGhpcy5zZXR0aW5ncy5tYXhQYXJ0aWNlcylcclxuXHRcdFx0XHR0aGlzLl9maXJzdEFjdGl2ZUVsZW1lbnQ9MDtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbiAgICAvKiog5rOo6ZSA6Ieq55Sx57KS5a2QICovXHJcbiAgICBmcmVlUmV0aXJlZFBhcnRpY2xlcygpXHJcbiAgICB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuX2ZpcnN0UmV0aXJlZEVsZW1lbnQgIT10aGlzLl9maXJzdEFjdGl2ZUVsZW1lbnQpe1xyXG5cdFx0XHR2YXIgYWdlPXRoaXMuX2RyYXdDb3VudGVyLXRoaXMuX3ZlcnRpY2VzW3RoaXMuX2ZpcnN0UmV0aXJlZEVsZW1lbnQgKnRoaXMuX2Zsb2F0Q291bnRQZXJWZXJ0ZXggKjQrMjhdO1xyXG5cdFx0XHRpZiAoYWdlIDwgMylcclxuXHRcdFx0XHRicmVhayA7XHJcblx0XHRcdHRoaXMuX2ZpcnN0UmV0aXJlZEVsZW1lbnQrKztcclxuXHRcdFx0aWYgKHRoaXMuX2ZpcnN0UmV0aXJlZEVsZW1lbnQgPj10aGlzLnNldHRpbmdzLm1heFBhcnRpY2VzKVxyXG5cdFx0XHRcdHRoaXMuX2ZpcnN0UmV0aXJlZEVsZW1lbnQ9MDtcclxuXHRcdH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWRkTmV3UGFydGljbGVzVG9WZXJ0ZXhCdWZmZXIoKTogdm9pZFxyXG4gICAge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvL+eUseS6juW+queOr+mYn+WIl+WIpOaWreeul+azle+8jFxyXG4gICAgLy/lvZPkuIvkuIDkuKpmcmVlUGFydGljbGXnrYnkuo5yZXRpcmVkUGFydGljbGXml7bkuI3mt7vliqDkvovlrZDvvIzmhI/lkbPlvqrnjq/pmJ/liJfkuK3msLjov5zmnInkuIDkuKrnqbrkvY3jgIJcclxuICAgIC8v77yI55Sx5LqO5q2k5Yik5pat566X5rOV5b+r6YCf44CB566A5Y2V77yM5omA5Lul5pS+5byD5LqG5L2/5b6q546v6Zif5YiX6aWx5ZKM55qE5aSN5p2C566X5rOV77yI6ZyA5Yik5patZnJlZVBhcnRpY2xl5ZyocmV0aXJlZFBhcnRpY2xl5YmN44CB5ZCO5Lik56eN5oOF5Ya15bm25LiN5ZCM5aSE55CG77yJ77yJXHJcbiAgICBhZGRQYXJ0aWNsZUFycmF5KHBvc2l0aW9uOiBGbG9hdDMyQXJyYXksIHZlbG9jaXR5OiBGbG9hdDMyQXJyYXkpOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIG5leHRGcmVlUGFydGljbGU9dGhpcy5fZmlyc3RGcmVlRWxlbWVudCsxO1xyXG5cdFx0aWYgKG5leHRGcmVlUGFydGljbGUgPj10aGlzLnNldHRpbmdzLm1heFBhcnRpY2VzKVxyXG5cdFx0XHRuZXh0RnJlZVBhcnRpY2xlPTA7XHJcblx0XHRpZiAobmV4dEZyZWVQYXJ0aWNsZT09PXRoaXMuX2ZpcnN0UmV0aXJlZEVsZW1lbnQpXHJcblx0XHRcdHJldHVybjtcclxuXHRcdHZhciBwYXJ0aWNsZURhdGE9UGFydGljbGVEYXRhLkNyZWF0ZSh0aGlzLnNldHRpbmdzLHBvc2l0aW9uLHZlbG9jaXR5LHRoaXMuX2N1cnJlbnRUaW1lKTtcclxuXHRcdHZhciBzdGFydEluZGV4PXRoaXMuX2ZpcnN0RnJlZUVsZW1lbnQgKnRoaXMuX2Zsb2F0Q291bnRQZXJWZXJ0ZXggKjQ7XHJcblx0XHRmb3IgKHZhciBpPTA7aSA8IDQ7aSsrKXtcclxuXHRcdFx0dmFyIGo9MCxvZmZzZXQ9MDtcclxuXHRcdFx0Zm9yIChqPTAsb2Zmc2V0PTQ7aiA8IDM7aisrKVxyXG5cdFx0XHR0aGlzLl92ZXJ0aWNlc1tzdGFydEluZGV4K2kgKnRoaXMuX2Zsb2F0Q291bnRQZXJWZXJ0ZXgrb2Zmc2V0K2pdPXBhcnRpY2xlRGF0YS5wb3NpdGlvbltqXTtcclxuXHRcdFx0Zm9yIChqPTAsb2Zmc2V0PTc7aiA8IDM7aisrKVxyXG5cdFx0XHR0aGlzLl92ZXJ0aWNlc1tzdGFydEluZGV4K2kgKnRoaXMuX2Zsb2F0Q291bnRQZXJWZXJ0ZXgrb2Zmc2V0K2pdPXBhcnRpY2xlRGF0YS52ZWxvY2l0eVtqXTtcclxuXHRcdFx0Zm9yIChqPTAsb2Zmc2V0PTEwO2ogPCA0O2orKylcclxuXHRcdFx0dGhpcy5fdmVydGljZXNbc3RhcnRJbmRleCtpICp0aGlzLl9mbG9hdENvdW50UGVyVmVydGV4K29mZnNldCtqXT1wYXJ0aWNsZURhdGEuc3RhcnRDb2xvcltqXTtcclxuXHRcdFx0Zm9yIChqPTAsb2Zmc2V0PTE0O2ogPCA0O2orKylcclxuXHRcdFx0dGhpcy5fdmVydGljZXNbc3RhcnRJbmRleCtpICp0aGlzLl9mbG9hdENvdW50UGVyVmVydGV4K29mZnNldCtqXT1wYXJ0aWNsZURhdGEuZW5kQ29sb3Jbal07XHJcblx0XHRcdGZvciAoaj0wLG9mZnNldD0xODtqIDwgMztqKyspXHJcblx0XHRcdHRoaXMuX3ZlcnRpY2VzW3N0YXJ0SW5kZXgraSAqdGhpcy5fZmxvYXRDb3VudFBlclZlcnRleCtvZmZzZXQral09cGFydGljbGVEYXRhLnNpemVSb3RhdGlvbltqXTtcclxuXHRcdFx0Zm9yIChqPTAsb2Zmc2V0PTIxO2ogPCAyO2orKylcclxuXHRcdFx0dGhpcy5fdmVydGljZXNbc3RhcnRJbmRleCtpICp0aGlzLl9mbG9hdENvdW50UGVyVmVydGV4K29mZnNldCtqXT1wYXJ0aWNsZURhdGEucmFkaXVzW2pdO1xyXG5cdFx0XHRmb3IgKGo9MCxvZmZzZXQ9MjM7aiA8IDQ7aisrKVxyXG5cdFx0XHR0aGlzLl92ZXJ0aWNlc1tzdGFydEluZGV4K2kgKnRoaXMuX2Zsb2F0Q291bnRQZXJWZXJ0ZXgrb2Zmc2V0K2pdPXBhcnRpY2xlRGF0YS5yYWRpYW5bal07XHJcblx0XHRcdHRoaXMuX3ZlcnRpY2VzW3N0YXJ0SW5kZXgraSAqdGhpcy5fZmxvYXRDb3VudFBlclZlcnRleCsyN109cGFydGljbGVEYXRhLmR1cmF0aW9uQWRkU2NhbGU7XHJcblx0XHRcdHRoaXMuX3ZlcnRpY2VzW3N0YXJ0SW5kZXgraSAqdGhpcy5fZmxvYXRDb3VudFBlclZlcnRleCsyOF09cGFydGljbGVEYXRhLnRpbWU7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9maXJzdEZyZWVFbGVtZW50PW5leHRGcmVlUGFydGljbGU7XHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IFRleHR1cmUgPSBMYXlhLlRleHR1cmU7XHJcbmltcG9ydCBSZW5kZXIgPSBMYXlhLlJlbmRlcjtcclxuaW1wb3J0IEhUTUxDYW52YXMgPSBMYXlhLkhUTUxDYW52YXM7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQaWNUb29sXHJcbntcclxuICAgIFxyXG4gICAgc3RhdGljIGdldENhbnZhc1BpYyhpbWc6IGFueSwgY29sb3I6IG51bWJlcik6IGFueVxyXG4gICAge1xyXG4gICAgICAgIGltZz1pbWcuYml0bWFwO1xyXG5cdFx0dmFyIGNhbnZhcz1uZXcgSFRNTENhbnZhcygpO1xyXG5cdFx0dmFyIGN0eDphbnkgPWNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cdFx0Y2FudmFzLnNpemUoaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcclxuXHRcdHZhciByZWQ9KGNvbG9yID4+IDE2ICYgMHhGRik7XHJcblx0XHR2YXIgZ3JlZW49KGNvbG9yID4+IDggJiAweEZGKTtcclxuICAgICAgICB2YXIgYmx1ZT0oY29sb3IgJiAweEZGKTtcclxuICAgICAgICBcclxuICAgICAgICBpZihSZW5kZXIuaXNDb25jaEFwcClcclxuICAgICAgICB7XHJcblx0XHRcdGN0eC5zZXRGaWx0ZXIocmVkLzI1NSxncmVlbi8yNTUsYmx1ZS8yNTUsMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLnNvdXJjZXx8aW1nLl9zb3VyY2UsMCwwKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIVJlbmRlci5pc0NvbmNoQXBwKVxyXG4gICAgICAgIHtcclxuXHRcdFx0dmFyIGltZ2RhdGE9Y3R4LmdldEltYWdlRGF0YSgwLDAsY2FudmFzLndpZHRoLGNhbnZhcy5oZWlnaHQpO1xyXG5cdFx0XHR2YXIgZGF0YT1pbWdkYXRhLmRhdGE7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk9MCxuPWRhdGEubGVuZ3RoO2kgPCBuO2krPTQpXHJcbiAgICAgICAgICAgIHtcclxuXHRcdFx0XHRpZiAoZGF0YVtpKzNdPT0wKWNvbnRpbnVlIDtcclxuXHRcdFx0XHRkYXRhW2ldPXJlZDtcclxuXHRcdFx0XHRkYXRhW2krMV09Z3JlZW47XHJcblx0XHRcdFx0ZGF0YVtpKzJdPWJsdWU7XHJcblx0XHRcdH1cclxuXHRcdFx0Y3R4LnB1dEltYWdlRGF0YShpbWdkYXRhLDAsMCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2FudmFzO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgc3RhdGljIGdldFJHQlBpYyhpbWc6IGFueSk6IEFycmF5PGFueT5cclxuICAgIHtcclxuICAgICAgICB2YXIgcnN0O1xyXG4gICAgICAgIHJzdD1bXHJcbiAgICAgICAgICAgIG5ldyBUZXh0dXJlKFBpY1Rvb2wuZ2V0Q2FudmFzUGljKGltZywweEZGMDAwMCkpLFxyXG4gICAgICAgICAgICBuZXcgVGV4dHVyZShQaWNUb29sLmdldENhbnZhc1BpYyhpbWcsMHgwMEZGMDApKSxcclxuICAgICAgICAgICAgbmV3IFRleHR1cmUoUGljVG9vbC5nZXRDYW52YXNQaWMoaW1nLDB4MDAwMEZGKSlcclxuICAgICAgICBdO1xyXG5cdFx0cmV0dXJuIHJzdDtcclxuICAgIH1cclxufSJdfQ==

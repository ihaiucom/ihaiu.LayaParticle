import Handler = Laya.Handler;

export default class AssetManager
{
    
    // 加载资源
    load(path: string, complete: Function, caller:any, type: string = Laya.Loader.TEXT)
    {
        Laya.loader.load(path, 
            Handler.create(null, (res: any) =>
            {
                if (complete)
                {
                    if (caller)
                    {
                        complete.apply(caller, [res]);
                    }
                    else
                    {
                        complete(res);
                    }
                }
            }), 
            null, type);
    }

    
    // 加载资源, 异步
    async loadAsync(path: string, type: string = Laya.Loader.TEXT): Promise<any>
    {
        return new Promise<void>((resolve)=>
        {
            this.load(path, (res: any)=>
            {
                resolve(res);
            }, null, type);
         });
    }

    // 加载Shader
    async loadShaderVSAsync(filename: string): Promise<string>
    {
        let code = await this.loadAsync(`res/shaders/${filename}.vs`, Laya.Loader.TEXT);
        return code.replace(/\r/g, "");
    }

    // 加载Shader
    async loadShaderPSAsync(filename: string): Promise<string>
    {
        let code =  await this.loadAsync(`res/shaders/${filename}.fs`, Laya.Loader.TEXT);
        return code.replace(/\r/g, "");
    }

}
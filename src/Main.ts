//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Player extends egret.DisplayObjectContainer {    //角色
    _main: Main;
    _label: egret.TextField;
    _stateMachine: StateMachine;
    _body: egret.Bitmap;
    _ifstand: boolean;
    _ifwalk: boolean;


    constructor(_main: Main) {
        super();
        this._main = _main;
        this._body = new egret.Bitmap;
        this._body.texture = RES.getRes("stand1_jpg");
        this._main.addChild(this._body);
        this._body.anchorOffsetX = 150;
        this._body.anchorOffsetY = 150;
        this._stateMachine = new StateMachine();
        this._body.x = 250;
        this._body.y = 250;
        this._body.width = 150;
        this._body.height = 150;
        this._ifstand = true;
        this._ifwalk = false;

    }
    public move(targetX: number, targetY: number) {
         egret.Tween.removeTweens(this._body);     //翻转图像
        if (targetX < this._body.x) {
            this._body.skewY = 180;
        }
        else { this._body.skewY = 0; }
        this._stateMachine.setState(new PlayerMoveState(this));

        egret.Tween.get(this._body).to({ x: targetX, y: targetY }, 2000).call( function(){this.idle()} ,this);
      
    }

    public idle() {

        this._stateMachine.setState(new PlayerIdleState(this));
    }


    public startWalk() {
        var list = ["walk1_png", "walk2_png", "walk3_png", "walk4_png"];
        var count = -1;
        egret.Ticker.getInstance().register(() => {
            count = count + 0.2;
            if (count >= list.length) {
                count = 0;
            }
            this._body.texture = RES.getRes(list[Math.floor(count)]);


        }, this);
        


    }

    public startidle() {

        var list = ["stand1_png", "stand2_png", "stand3_png", "stand4_png"];
        var count = -1;
        egret.Ticker.getInstance().register(() => {
            count = count + 0.2;
            if (count >= list.length) {
                count = 0;
            }

            this._body.texture = RES.getRes(list[Math.floor(count)]);

        }, this);



    }

}

class PlayerState implements State {

    _player: Player;

    constructor(player: Player) {
        this._player = player;

    }

    onEnter() { }
    onExit() { }

}

interface State {
    onEnter();
    onExit();
}

class PlayerMoveState extends PlayerState {

    onEnter() 
    {

        this._player._ifwalk = true;
  
        this._player.startWalk();
      
    }

    onExit() 
    {
        this._player._ifwalk = false;
    }


}

class PlayerIdleState extends PlayerState {

    onEnter() {
        
         this._player._ifstand = true;
         this._player.startidle();

    }
    onExit() 
    {
        this._player._ifstand= false;
    }


}

class StateMachine {
    CurrentState: State;

    setState(e: State) {

        if (this.CurrentState != null) {
            this.CurrentState.onExit();
        }
        this.CurrentState = e;
        e.onEnter();
    }

}

class TileMap extends egret.DisplayObjectContainer{
public static TILE_SIZE = 49;
    _player: Player;
    _block: egret.Bitmap;
   //_astar: AStar;
    public _i: number;
    moveX: number[] = [];
    moveY: number[] = [];


    constructor(player: Player) {
        super();
        this.init();
        this._player = player;
        this._i = 0;
    }

private init(){

    var config:TileData[]=[
      {x:0,y:0,walkable:true,image:"ground1_jpg"},
      {x:0,y:1,walkable:false,image:"ground2_jpg"},
      {x:0,y:2,walkable:false,image:"ground2_jpg"},
      {x:0,y:3,walkable:false,image:"ground2_jpg"},
      {x:0,y:4,walkable:false,image:"ground2_jpg"},
      {x:0,y:5,walkable:false,image:"ground2_jpg"},
      {x:0,y:6,walkable:false,image:"ground2_jpg"},
      {x:0,y:7,walkable:false,image:"ground2_jpg"},
      

      {x:1,y:0,walkable:true,image:"ground1_jpg"},
      {x:1,y:1,walkable:true,image:"ground1_jpg"},
      {x:1,y:2,walkable:true,image:"ground1_jpg"},
      {x:1,y:3,walkable:true,image:"ground1_jpg"},
      {x:1,y:4,walkable:true,image:"ground1_jpg"},
      {x:1,y:5,walkable:true,image:"ground1_jpg"},
      {x:1,y:6,walkable:true,image:"ground1_jpg"},
      {x:1,y:7,walkable:true,image:"ground1_jpg"},
     

      {x:2,y:0,walkable:true,image:"ground1_jpg"},
      {x:2,y:1,walkable:true,image:"ground1_jpg"},
      {x:2,y:2,walkable:true,image:"ground1_jpg"},
      {x:2,y:3,walkable:true,image:"ground1_jpg"},
      {x:2,y:4,walkable:true,image:"ground1_jpg"},
      {x:2,y:5,walkable:true,image:"ground1_jpg"},
      {x:2,y:6,walkable:false,image:"ground2_jpg"},
      {x:2,y:7,walkable:false,image:"ground2_jpg"},
     


      {x:3,y:0,walkable:false,image:"ground2_jpg"},
      {x:3,y:1,walkable:false,image:"ground2_jpg"},
      {x:3,y:2,walkable:false,image:"ground2_jpg"},
      {x:3,y:3,walkable:true,image:"ground1_jpg"},
      {x:3,y:4,walkable:false,image:"ground2_jpg"},
      {x:3,y:5,walkable:true,image:"ground1_jpg"},
      {x:3,y:6,walkable:false,image:"ground2_jpg"},
      {x:3,y:7,walkable:true,image:"ground1_jpg"},
    

      {x:4,y:0,walkable:false,image:"ground2_jpg"},
      {x:4,y:1,walkable:false,image:"ground2_jpg"},
      {x:4,y:2,walkable:false,image:"ground2_jpg"},
      {x:4,y:3,walkable:true,image:"ground1_jpg"},
      {x:4,y:4,walkable:false,image:"ground2_jpg"},
      {x:4,y:5,walkable:true,image:"ground1_jpg"},
      {x:4,y:6,walkable:false,image:"ground2_jpg"},
      {x:4,y:7,walkable:true,image:"ground1_jpg"},
  

      {x:5,y:0,walkable:false,image:"ground2_jpg"},
      {x:5,y:1,walkable:false,image:"ground2_jpg"},
      {x:5,y:2,walkable:false,image:"ground2_jpg"},
      {x:5,y:3,walkable:true,image:"ground1_jpg"},
      {x:5,y:4,walkable:false,image:"ground2_jpg"},
      {x:5,y:5,walkable:true,image:"ground1_jpg"},
      {x:5,y:6,walkable:false,image:"ground2_jpg"},
      {x:5,y:7,walkable:true,image:"ground1_jpg"},
    

      {x:6,y:0,walkable:true,image:"ground1_jpg"},
      {x:6,y:1,walkable:true,image:"ground1_jpg"},
      {x:6,y:2,walkable:true,image:"ground1_jpg"},
      {x:6,y:3,walkable:true,image:"ground1_jpg"},
      {x:6,y:4,walkable:false,image:"ground2_jpg"},
      {x:6,y:5,walkable:true,image:"ground1_jpg"},
      {x:6,y:6,walkable:false,image:"ground2_jpg"},
      {x:6,y:7,walkable:true,image:"ground1_jpg"},
    

      {x:7,y:0,walkable:true,image:"ground1_jpg"},
      {x:7,y:1,walkable:true,image:"ground1_jpg"},
      {x:7,y:2,walkable:true,image:"ground1_jpg"},
      {x:7,y:3,walkable:true,image:"ground1_jpg"},
      {x:7,y:4,walkable:true,image:"ground1_jpg"},
      {x:7,y:5,walkable:true,image:"ground1_jpg"},
      {x:7,y:6,walkable:false,image:"ground2_jpg"},
      {x:7,y:7,walkable:true,image:"ground1_jpg"},
    

    ]
    for(var i=0;i<config.length;i++){
        var data = config[i];
        var tile = new Tile(data);
        this.addChild(tile);
    }

    this.touchEnabled = true;
    this.addEventListener(egret.TouchEvent.TOUCH_TAP,(e:egret.TouchEvent)=>{
         var localX = e.localX;
         var localY = e.localY;
         var gridX = Math.floor(localX/TileMap.TILE_SIZE);
         var gridY = Math.floor(localY/TileMap.TILE_SIZE);
         console.log(gridX,gridY);
    },this)
}
 private timerFunc() {
        this._i++;
        this.moveX[this._i] = this.scaleX * TileMap.TILE_SIZE+TileMap.TILE_SIZE / 2;
        this.moveY[this._i] = this.scaleY *TileMap.TILE_SIZE + TileMap.TILE_SIZE / 2;
       
            this._player.move(this.moveX[this._i], this.moveY[this._i]);
            egret.Tween.get(this._player._body).to({ x: this.moveX[this._i], y: this.moveY[this._i] }, 600).wait(10).call(function () { this._player.idle() }, this);
     
    }
    private timerComFunc() {
        console.log("计时结束");
    }
}

interface TileData{
    x:number;
    y:number;
    walkable:boolean;
    image:string;

}

class Tile extends egret.DisplayObjectContainer{
    data:TileData
    constructor(data:TileData){
    super();
    this.data = data;
    var bitmap = new egret.Bitmap();
    this.addChild(bitmap);
    bitmap.texture = RES.getRes(data.image);
    bitmap.scaleX = bitmap.scaleY = 2;
    this.x = data.x*TileMap.TILE_SIZE;
    this.y = data.y*TileMap.TILE_SIZE;
    }

}

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    private _txInfo: egret.TextField;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {

        
        var map = new TileMap(player);
        this.addChild(map);

  
        var stageW: number = this.stage.stageWidth;
        var stageH: number = this.stage.stageHeight;
       


       

       
        var player: Player = new Player(this);
        player.idle();

        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, (evt: egret.TouchEvent) => {

            player.move(evt.stageX, evt.stageY);

        }, this);




    }





    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        var result = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }


    /**
     * 切换描述内容
     * Switch to described content
     */
    private changeDescription(textfield: egret.TextField, textFlow: Array<egret.ITextElement>): void {
        textfield.textFlow = textFlow;
    }

    protected load(callback: Function): void {
        var count: number = 0;
        var self = this;

        var check = function () {
            count++;
            if (count == 2) {
                callback.call(self);
            }
        }

        var loader = new egret.URLLoader();
        loader.addEventListener(egret.Event.COMPLETE, function loadOver(e) {
            var loader = e.currentTarget;

            this._mcData = JSON.parse(loader.data);

            check();
        }, this);
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        var request = new egret.URLRequest("resource/assets/mc/animation.json");
        loader.load(request);
    }

}



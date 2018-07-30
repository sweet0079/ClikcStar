import * as lib from '../lib/lib'

/** 用于控制大厅 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class StartGame extends cc.Component {

    @property(cc.Sprite) display: cc.Sprite = null;
    @property(cc.Node) gameLayer: cc.Node = null;
    @property(cc.Label) LoadingLabel: cc.Label = null;
    @property(cc.Node) LoadLayer: cc.Node = null;
    @property(lib.ccAudioPlayer) audioplayer: lib.ccAudioPlayer = null;
    @property(cc.Node) micBtn: cc.Node = null;
    @property(cc.Node) soundBtn: cc.Node = null;
    @property([cc.SpriteFrame]) micBtnSpf: Array<cc.SpriteFrame> = [];
    @property([cc.SpriteFrame]) soundBtnSpf: Array<cc.SpriteFrame> = [];
    
    // onLoad () {}

    private tex:cc.Texture2D
    private _isShow = false;

    start () {
        this.schedule(this.loadingChange,1);
        if(typeof window.sharedCanvas !== 'undefined')
        {
            window.sharedCanvas.width = 1080;
            window.sharedCanvas.height = 1920;
        }
        this.tex = new cc.Texture2D();
        lib.wxFun.showShareMenu();
        // this.getUserInfo();
        lib.wxFun.getUserInfo((res)=>{
            console.log(res);
            console.log("getUserInfo success");
        },(res)=>{
            console.log(res);
            console.log("getUserInfo fail");
            if(res.errMsg == "getUserInfo:ok")
            {
                let url = res.userInfo.avatarUrl;
                lib.userInfo.getinstance().setuserAvatar(url);
            }
        },(res)=>{
            console.log(res);
            console.log("getUserInfo complete");
            if(res.errMsg == "getUserInfo:ok")
            {
                let url = res.userInfo.avatarUrl;
                lib.userInfo.getinstance().setuserAvatar(url);
            }
        });
        // let button = wx.createUserInfoButton({
        //     type: 'text',
        //     text: '获取用户信息',
        //     style: {
        //         left: 10,
        //         top: 76,
        //         width: 200,
        //         height: 40,
        //         lineHeight: 40,
        //         backgroundColor: '#ff0000',
        //         color: '#ffffff',
        //         textAlign: 'center',
        //         fontSize: 16,
        //         borderRadius: 4
        //     }
        // })
        // button.onTap((res) => {
        //     console.log(res)    
        // })
    }

    update () {
        this._updaetSubDomainCanvas();
    }
    //----- 按钮回调 -----//
    startGame(){
        lib.msgEvent.getinstance().emit(lib.msgConfig.micStartBtn);
        this.LoadLayer.active = true;
        cc.director.loadScene("MainScene");
    }

    onhide(){
        console.log("onhide");
        lib.msgEvent.getinstance().emit(lib.msgConfig.micbutton);
        // 发消息给子域
        if(this._isShow)
        {
            this._isShow = !this._isShow;
            let moveTo = cc.moveTo(0.5, 0, 0);
            this.gameLayer.runAction(moveTo);
            wx.postMessage({
                message:'Hide',
                MAIN_MENU_NUM: "score",
            })
        }
    }

    onClick () {
        console.log("onclickShow");
        lib.msgEvent.getinstance().emit(lib.msgConfig.micbutton);
        // 发消息给子域
        if(!this._isShow)
        {
            this._isShow = !this._isShow;
            let moveTo = cc.moveTo(0.5, 0, -1850);
            this.gameLayer.runAction(moveTo);
            wx.postMessage({
                message:'Show' ,
                MAIN_MENU_NUM: "score",
            })
        }
    }

    clickMic(){
        console.log(this.audioplayer.getBGvolume());
        if(this.audioplayer.getBGvolume() == 0)
        {
            this.micBtn.getComponent(cc.Sprite).spriteFrame = this.micBtnSpf[0];
            this.audioplayer.setBGvolume(1);
        }
        else
        {
            this.micBtn.getComponent(cc.Sprite).spriteFrame = this.micBtnSpf[1];
            this.audioplayer.setBGvolume(0); 
        }
    }

    clickSound(){
        console.log(this.audioplayer.getPeovolume());
        if(this.audioplayer.getPeovolume() == 0)
        {
            this.soundBtn.getComponent(cc.Sprite).spriteFrame = this.soundBtnSpf[0];
            this.audioplayer.setPeovolume(1);
        }
        else
        {
            this.soundBtn.getComponent(cc.Sprite).spriteFrame = this.soundBtnSpf[1];
            this.audioplayer.setPeovolume(0); 
        }
    }

    //----- 私有方法 -----//
    private loadingChange(){
        if(this.LoadingLabel.string == "loading...")
        {
            this.LoadingLabel.string = "loading.";
        }
        else if(this.LoadingLabel.string == "loading..")
        {
            this.LoadingLabel.string = "loading...";
        }
        else if(this.LoadingLabel.string == "loading.")
        {
            this.LoadingLabel.string = "loading..";
        }
    }
    private _updaetSubDomainCanvas() {
        if (!this.tex) {
            return;
        }
        // let openDataContext = wx.getOpenDataContext();
        // let sharedCanvas = openDataContext.canvas;
        // sharedCanvas.width = 1080;
        // sharedCanvas.height = 1920;
        this.tex.initWithElement(window.sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    }
}

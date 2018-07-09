import { IsWeChat } from "../lib/mod/litools";

/** 用于控制大厅 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class StartGame extends cc.Component {

    // onLoad () {}

    start () {
        this.showShareMenu();
    }

    // update (dt) {}
    //----- 按钮回调 -----//
    startGame(){
        cc.director.loadScene("MainScene");
    }

    //----- 私有方法 -----//
    private showShareMenu() {
        if(typeof wx !== 'undefined')
        {
            return new Promise((resolve, reject) => {
                wx.showShareMenu({
                withShareTicket: true,
                success: res => {
                    console.log("showShareMenu true");
                },
                fail: res => {
                    console.log("showShareMenu fail");
                    console.log(res);
                },
                complete: res => {
                    console.log("showShareMenu complete");
                    console.log(res);
                },
                })
            })
        }
    }
}

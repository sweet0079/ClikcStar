/** 用于控制大厅 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class StartGame extends cc.Component {

    // onLoad () {}

    start () {

    }

    // update (dt) {}
    //----- 按钮回调 -----//
    startGame(){
        cc.director.loadScene("MainScene");
    }
}

/** 挂在UI层，控制UI显示方面的脚本 */
import * as lib from '../lib/lib'

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIcontrol extends cc.Component {
    //----- 编辑器属性 -----//
    //分数的label组件
    @property(cc.Label) Socrelabel: cc.Label = null;
    
    //----- 属性声明 -----//
    //记录当前分数
    score: number = 0;
    //----- 生命周期 -----//

    // onLoad () {}

    start () {

    }

    // update (dt) {}
    //----- 按钮回调 -----//
    startGame(){
        lib.msgEvent.getinstance().emit(lib.msgConfig.ReStart);
        this.score = 0;
        this.Socrelabel.string = this.score.toString();
    }
    //----- 公有方法 -----//
    addScore(score:number){
        this._addScore(score);
    }
    //----- 私有方法 -----//
    private _addScore(score:number){
        this.score += score;
        this.Socrelabel.string = this.score.toString();
    }
}

/** 挂在UI层，控制UI显示方面的脚本 */
import * as lib from '../lib/lib'
import ShapeManager from './ShapeManager'

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIcontrol extends cc.Component {
    //----- 编辑器属性 -----//
    //分数的label组件
    @property(cc.Label) Socrelabel: cc.Label = null;
    //warning节点组件
    @property(cc.Node) warning: cc.Node = null;
    
    //----- 属性声明 -----//
    //记录当前分数
    score: number = 0;
    //----- 生命周期 -----//

    // onLoad () {}

    start () {
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ShowWarn,"showarn",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.HideWarn,"hidewarn",this);
    }

    // update (dt) {}

    onDestroy(){
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ShowWarn,"showarn",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.HideWarn,"hidewarn",this);
    }
    //----- 按钮回调 -----//
    //重新开始
    startGame(){
        lib.msgEvent.getinstance().emit(lib.msgConfig.ReStart);
        this.score = 0;
        this.Socrelabel.string = this.score.toString();
        this.hidewarn();
        ShapeManager.getinstance().clean();
    }
    //----- 公有方法 -----//
    addScore(score:number){
        this._addScore(score);
    }

    showarn(){
        if(this.warning)
        {
            this.warning.active = true;
        }
    }

    hidewarn(){
        if(this.warning)
        {
            this.warning.active = false;
        }
    }
    //----- 私有方法 -----//
    private _addScore(score:number){
        this.score += score;
        this.Socrelabel.string = this.score.toString();
    }
}

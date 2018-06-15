/** 用于统一控制所有触摸事件 */
import * as lib from '../lib/lib'
import UIControl from './UIControl'

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClickControl extends cc.Component {
    //----- 编辑器属性 -----//
    //UI控制组件
    @property(UIControl) UIcon: UIControl = null;

    //----- 属性声明 -----//
    private ScoreArr :Array<_kits.ClickControl.click> = [];
    //----- 生命周期 -----//

    // onLoad () {}

    start () {
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.clickStart,"add",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.Settlement,"settlement",this);
    }

    // update (dt) {}
    //----- 私有方法 -----//
    private add(clickscore: _kits.ClickControl.click){
        if(this.ScoreArr.length == 0)
        {
            this.ScoreArr.push(clickscore);
        }
        else
        {
            for(let i = 0; i < this.ScoreArr.length; i++)
            {
                if(clickscore.node == this.ScoreArr[i].node)
                {
                    console.log("return");
                    return;
                }
                else if(i == this.ScoreArr.length - 1)
                {
                    this.ScoreArr.push(clickscore);
                }
            }
        }
    }

    private settlement(){
        if(this.ScoreArr.length == 0)
        {
            console.log("扣血");
            return;
        }
        else if(this.ScoreArr.length == 1)
        {
            console.log("length == 1" + " score =" + this.ScoreArr[0].score);
            this.UIcon.addScore(this.ScoreArr[0].score);
        }
        else
        {
            let score = 0;
            for(let i = 0; i < this.ScoreArr.length; i++)
            {
                score += this.ScoreArr[i].score;
                console.log("i == " + i + "  score ==" + this.ScoreArr[i].score);
            }
            score *= 2;
            console.log("length == " + this.ScoreArr.length + " score =" + score);
            this.UIcon.addScore(score);
        }
        this.ScoreArr = [];
    }
}
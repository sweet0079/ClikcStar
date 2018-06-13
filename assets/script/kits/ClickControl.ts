/** 用于统一控制所有触摸事件 */
import * as lib from '../lib/lib'

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClickControl extends cc.Component {

    //----- 属性声明 -----//
    private ScoreArr :Array<_kits.CliclControl.clickScore> = [];
    //----- 生命周期 -----//

    // onLoad () {}

    start () {
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.clickStart,"add",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.Settlement,"settlement",this);
    }

    // update (dt) {}
    //----- 私有方法 -----//
    private add(clickscore:_kits.CliclControl.clickScore){
        console.log(clickscore.time);
        if(this.ScoreArr.length == 0)
        {
            this.ScoreArr.push(clickscore);
        }
        else
        {
            if(this.ScoreArr[0].time == clickscore.time)
            {
                this.ScoreArr.push(clickscore);
            }
            else
            {
                this.settlement();
                this.ScoreArr.push(clickscore);
            }
        }
    }

    private settlement(){
        if(this.ScoreArr.length == 0)
        {
            return;
        }
        else if(this.ScoreArr.length == 1)
        {
            console.log("length == 1" + " score =" + this.ScoreArr[0].score);
        }
        else
        {
            let score = 0;
            for(let i = 0; i < this.ScoreArr.length; i++)
            {
                score += this.ScoreArr[i].score;
            }
            console.log("length == " + this.ScoreArr.length + " score =" + score);
        }
        this.ScoreArr = [];
    }
}

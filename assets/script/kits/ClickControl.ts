/** 用于统一控制所有触摸事件 */
import * as lib from '../lib/lib'
import UIControl from './UIControl'

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClickControl extends cc.Component {
    //----- 编辑器属性 -----//
    //UI控制组件
    @property(UIControl) UIcon: UIControl = null;
    //字体图集
    @property([cc.SpriteFrame]) ZiSpf: Array<cc.SpriteFrame> = [];
    //字体父节点
    @property(cc.Node) Ziparent: cc.Node = null;
    //----- 属性声明 -----//
    private ScoreArr :Array<number> = [];
    //连击数
    private ComboNum: number = 0;
    
    //----- 生命周期 -----//

    // onLoad () {}

    start () {
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.clickStart,"add",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.Settlement,"settlement",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ReStart,"reStart",this);
    }

    onDestroy(){
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.clickStart,"add",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.Settlement,"settlement",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ReStart,"reStart",this);
    }
    // update (dt) {}
    //----- 私有方法 -----//
    private createZiSprite(spf:cc.SpriteFrame){
        let node = new cc.Node('Good');
        let sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = spf;
        node.scale = 0;
        node.setPosition(0,-100);
        node.parent = this.Ziparent;
        let act = cc.scaleTo(0.35,1.5);
        let seq = cc.sequence(act,cc.callFunc(()=>{
            node.destroy();
        }));
        node.runAction(seq);
    }

    private showGood(){
        if(this.ComboNum == 15)
        {
            this.createZiSprite(this.ZiSpf[0]);
        }
        else if((this.ComboNum - 15) / 10 == 1)
        {
            this.createZiSprite(this.ZiSpf[1]);
        }
        else if((this.ComboNum - 15) / 10 == 2)
        {
            this.createZiSprite(this.ZiSpf[2]);
        }
        else if((this.ComboNum - 15) / 10 == 3)
        {
            this.createZiSprite(this.ZiSpf[3]);
        }
        else if((this.ComboNum - 15) % 10 == 0
        && this.ComboNum >= 55)
        {
            this.createZiSprite(this.ZiSpf[4]);
        }
    }

    private reStart(){
        this.ComboNum = 0;
        this.ScoreArr = [];
    }

    private add(clickscore:number){
        // if(this.ScoreArr.length == 0)
        // {
            this.ScoreArr.push(clickscore);
        // }
        // else
        // {
        //     for(let i = 0; i < this.ScoreArr.length; i++)
        //     {
        //         if(clickscore.node == this.ScoreArr[i].node)
        //         {
        //             console.log("return");
        //             return;
        //         }
        //         else if(i == this.ScoreArr.length - 1)
        //         {
        //             this.ScoreArr.push(clickscore);
        //         }
        //     }
        // }
    }

    private settlement(){
        this.showGood();
        if(this.ScoreArr.length == 0)
        {
            this.ComboNum = 0;
            //console.log("扣血");
            this.UIcon.minHP();
            return;
        }
        else if(this.ScoreArr.length == 1)
        {
            this.ComboNum++;
            //console.log("length == 1" + " score =" + this.ScoreArr[0]);
            this.UIcon.addScore(this.ScoreArr[0]);
        }
        else
        {
            this.ComboNum += this.ScoreArr.length;
            let score = 0;
            for(let i = 0; i < this.ScoreArr.length; i++)
            {
                score += this.ScoreArr[i];
                //console.log("i == " + i + "  score ==" + this.ScoreArr[i]);
            }
            score *= 2;
            //console.log("length == " + this.ScoreArr.length + " score =" + score);
            this.UIcon.addScore(score);
        }
        this.ScoreArr = [];
    }
}

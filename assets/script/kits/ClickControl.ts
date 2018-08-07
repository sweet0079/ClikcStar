/** 用于统一控制所有触摸事件 */
import * as lib from '../lib/lib'
import UIControl from './UIControl'
import { _kits } from '../../../libdts/kits';
import { shape } from '../lib/cfg/defConfig';

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
    //数字预制体
    @property(cc.Prefab) scorePfb: cc.Prefab = null;
    //combo预制体
    @property(cc.Prefab) comboPfb: cc.Prefab = null;
    //----- 属性声明 -----//
    private ScoreArr :Array<_kits.ClickShape.ScoreInfo> = [];
    //连击数
    private ComboNum: number = 1;
    //上一个点击的形状
    private LastShape: Array<number> = [];
    //下一个要展示的分数
    private ShowScore: number = 0;
    //下一个要展示的分数位置
    private ShowScorePos: cc.Vec2 = cc.v2(0,0);
    //----- 生命周期 -----//

    // onLoad () {}

    start () {
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.clickStart,"add",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.Settlement,"settlement",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ReStart,"reStart",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ShowScore,"showScore",this);
    }

    onDestroy(){
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.clickStart,"add",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.Settlement,"settlement",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ReStart,"reStart",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ShowScore,"showScore",this);
    }
    // update (dt) {}
    //----- 事件回调 -----//
    private showScore(pos:cc.Vec2){
        this.ShowScorePos = pos;
        this.createScore();
    }
    //----- 私有方法 -----//
    //根据点击计算combo，如果连续多重点击取最高combo数形状
    private CheckCombo(ScoreInfoArr:Array<_kits.ClickShape.ScoreInfo>){
        //将对象数组整理为形状数组
        let ShapeArr = [];
        for(let i = 0 ; i < ScoreInfoArr.length ; i++)
        {
            if(!ScoreInfoArr[i].isSpecial)
            {
                ShapeArr.push(ScoreInfoArr[i].shape);
            }
        }
        //形状数组长度为0则返回
        if(ShapeArr.length == 0)
        {
            return; 
        }
        console.log("CheckCombo");
        console.log(this.LastShape);
        console.log(ShapeArr);
        console.log("before this.ComboNum = " + this.ComboNum);
        //如果没有上次点击数组，将单次点击的形状数组排序后找出数量最多的形状
        if(this.LastShape.length == 0)
        {
            if(ShapeArr.length == 1)
            {
                this.LastShape = ShapeArr;
            }
            else
            {
                //排序
                ShapeArr.sort(function sortNumber(a,b)
                {
                return a - b
                });
                let maxCombo = 0;
                let maxIndex = [];
                let temp = 1;
                for(let i = 0 ; i < ShapeArr.length - 1; i++)
                {
                    if(ShapeArr[i] == ShapeArr[i + 1])
                    {
                        temp++;
                        if(i == ShapeArr.length - 2)
                        {
                            if(temp > maxCombo)
                            {
                                maxCombo = temp;
                                maxIndex = [ShapeArr[i]];
                            }
                            else if(temp == maxCombo)
                            {
                                maxIndex.push(ShapeArr[i]);
                            }
                        }
                    }
                    else
                    {
                        if(temp > maxCombo)
                        {
                            maxCombo = temp;
                            maxIndex = [ShapeArr[i]];
                        }
                        else if(temp == maxCombo)
                        {
                            maxIndex.push(ShapeArr[i]);
                        }
                        temp = 1;
                    }
                }
                if(maxCombo == 1)
                {
                    maxIndex.push(ShapeArr[ShapeArr.length - 1]);
                }
                this.LastShape = maxIndex;
                this.ComboNum = maxCombo;
            }
        }
        else
        {
            let maxCombo = 0;
            let maxIndex = [];
            for(let i = 0; i < this.LastShape.length; i++)
            {
                let temp = 0;
                for(let j = 0; j < ShapeArr.length; j++)
                {
                    if(this.LastShape[i] == ShapeArr[j])
                    {
                        temp++;
                    }
                }
                if(temp > maxCombo)
                {
                    maxCombo = temp;
                    maxIndex = [this.LastShape[i]];
                }
                else if(temp == maxCombo && temp != 0)
                {
                    maxIndex.push(this.LastShape[i]);
                }
            }
            //如果没形成combo，重置combo数，根据这次点击重置LastShape数组
            if(maxCombo == 0)
            {
                this.ComboNum = 1;
                this.LastShape = [];
                this.CheckCombo(ScoreInfoArr);
            }
            //形成combo，累加combo数并更新LastShape数组
            else
            {
                this.LastShape = maxIndex;
                this.ComboNum += maxCombo;
            }
        }
        console.log("after this.ComboNum = " + this.ComboNum);
    }

    private ShowCombo(){
        if(this.ComboNum < 3)
        {
            return;
        }
        let node = cc.instantiate(this.comboPfb);
        node.getChildByName("number").getComponent(cc.Label).string = this.ComboNum.toString();
        let ani = node.getComponent(cc.Animation);
        ani.on('finished',()=>{
            node.destroy();
        },this);
        node.parent = this.Ziparent;
        ani.play();
    }

    private createZiSprite(spf:cc.SpriteFrame){
        let node = new cc.Node('Good');
        let sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = spf;
        node.scale = 0;
        node.setPosition(0,-100);
        node.parent = this.Ziparent;
        let act = cc.scaleTo(0.5,1.5);
        let seq = cc.sequence(act,cc.callFunc(()=>{
            node.destroy();
        }));
        node.runAction(seq);
    }

    private createScore(){
        if(this.ShowScore)
        {
            if(this.ShowScore == 0)
            {
                return;
            }
            let sco = cc.instantiate(this.scorePfb);
            sco.getComponent(cc.Label).string = this.ShowScore.toString();
            sco.setPosition(this.ShowScorePos);
            sco.y += 75;
            sco.parent = this.Ziparent;
            let ani = sco.getComponent(cc.Animation);
            ani.once('finished',()=>{
                sco.destroy();
            },this);
            ani.play();
        }
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
        this.ComboNum = 1;
        this.ScoreArr = [];
        this.LastShape = [];
    }

    private add(ScoreInfo:_kits.ClickShape.ScoreInfo){
        // if(this.ScoreArr.length == 0)
        // {
            this.ScoreArr.push(ScoreInfo);
            if(ScoreInfo.score == 100)
            {
               lib.msgEvent.getinstance().emit(lib.msgConfig.micClickStart);
            }
            else if(ScoreInfo.score == 50)
            {
                lib.msgEvent.getinstance().emit(lib.msgConfig.micClickShape);
            }
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
        if(this.ScoreArr.length == 0)
        {
            this.ComboNum = 0;
            //console.log("扣血");
            this.UIcon.minHP();
            this.ShowScore = 0;
            return;
        }
        else if(this.ScoreArr.length == 1)
        {
            // this.ComboNum++;
            this.CheckCombo(this.ScoreArr);
            //console.log("length == 1" + " score =" + this.ScoreArr[0]);
            this.UIcon.addScore(this.ScoreArr[0].score);
            this.ShowScore = this.ScoreArr[0].score;
        }
        else
        {
            // this.ComboNum += this.ScoreArr.length;
            this.CheckCombo(this.ScoreArr);
            let score = 0;
            for(let i = 0; i < this.ScoreArr.length; i++)
            {
                score += this.ScoreArr[i].score;
                //console.log("i == " + i + "  score ==" + this.ScoreArr[i]);
            }
            score *= 2;
            //console.log("length == " + this.ScoreArr.length + " score =" + score);
            this.UIcon.addScore(score);
            this.ShowScore = score;
            lib.msgEvent.getinstance().emit(lib.msgConfig.micclickCombo);
        }
        this.ScoreArr = [];
        this.ShowCombo();
        this.showGood();
    }
}
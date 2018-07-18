/** 挂在UI层，控制UI显示方面的脚本 */
import * as lib from '../lib/lib'
import ShapeManager from './ShapeManager'
import touchInstance from "./touchInstance"

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIcontrol extends cc.Component {
    //----- 编辑器属性 -----//
    //分数的label组件
    @property(cc.Label) Socrelabel: cc.Label = null;
    //warning节点组件
    @property(cc.Node) warning: cc.Node = null;
    //血条组件
    @property(cc.ProgressBar) HP: cc.ProgressBar = null;
    //能量条组件
    @property(cc.ProgressBar) POWER: cc.ProgressBar = null;
    //gameover界面
    @property(cc.Node) OverLayer: cc.Node = null;
    //pause界面
    @property(cc.Node) PauseLayer: cc.Node = null;
    
    //----- 属性声明 -----//
    //记录当前分数
    score: number = 0;
    //记录当前血量
    nowHP: number = lib.defConfig.MAXHP;
    //记录当前能量
    nowPOWER: number = 0;
    //----- 生命周期 -----//

    // onLoad () {}

    start () {
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ShowWarn,"showarn",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.HideWarn,"hidewarn",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.addHP,"addHP",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.OverGame,"gameover",this);
    }

    // update (dt) {}

    onDestroy(){
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ShowWarn,"showarn",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.HideWarn,"hidewarn",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.addHP,"addHP",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.OverGame,"gameover",this);
    }
    //----- 按钮回调 -----//
    //重新开始
    startGame(){
        lib.msgEvent.getinstance().emit(lib.msgConfig.ReStart);
        this.score = 0;
        this.Socrelabel.string = this.score.toString();
        this.hidewarn();
        this.initHP();
        this.initPOWER();
        touchInstance.getinstance().setCanMove(false);
        this.OverLayer.active = false;
        this.unschedule(this.minPOWER);
        ShapeManager.getinstance().clean();
    }

    //暂停
    pause(){
        this.PauseLayer.active = true;
        cc.director.pause();
    }

    continue(){
        this.PauseLayer.active = false;
        cc.director.resume();
    }
    //----- 公有方法 -----//
    gameover(){
        this.hidewarn();
        this.OverLayer.active = true;
    }

    addHP(){
        if(this.nowHP < lib.defConfig.MAXHP)
        {
            this.nowHP++;
            this.HP.progress = parseFloat((this.nowHP / lib.defConfig.MAXHP).toString());
        }
    }

    initHP(){
        this.nowHP = lib.defConfig.MAXHP;
        this.HP.progress = 1;
    }

    minHP(){
        this.nowHP--;
        this.HP.progress = parseFloat((this.nowHP / lib.defConfig.MAXHP).toString());
        if(this.nowHP <= 0)
        {
            lib.msgEvent.getinstance().emit(lib.msgConfig.OverGame);
        }
    }

    initPOWER(){
        this.nowPOWER = 0;
        this.POWER.progress = 0;
    }

    addScore(score:number){
        this._addScore(score);
        if(touchInstance.getinstance().getCanMove())
        {
            return;
        }
        let temp = score / 50;
        this.addPOWER(temp);
        console.log(this.nowPOWER);
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

    private addPOWER(num:number){
        this.nowPOWER += num;
        if(this.nowPOWER >= lib.defConfig.MAXPOWER)
        {
            this.nowPOWER = lib.defConfig.MAXPOWER;
        }
        this.POWER.progress = parseFloat((this.nowPOWER / lib.defConfig.MAXPOWER).toString());
        if(this.nowPOWER == lib.defConfig.MAXPOWER)
        {
            touchInstance.getinstance().setCanMove(true);
            this.schedule(this.minPOWER,0.1,50);
        }
    }

    private minPOWER(){
        if(this.nowPOWER <= 0)
        {
            return;
        }
        this.nowPOWER--;
        this.POWER.progress = parseFloat((this.nowPOWER / lib.defConfig.MAXPOWER).toString());
        if(this.nowPOWER <= 0)
        {
            touchInstance.getinstance().setCanMove(false);
        }
    }
}

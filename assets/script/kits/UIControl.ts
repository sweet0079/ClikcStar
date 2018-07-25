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
    //时间条组件
    @property(cc.ProgressBar) TIME: cc.ProgressBar = null;
    //gameover界面
    @property(cc.Node) OverLayer: cc.Node = null;
    //pause界面
    @property(cc.Node) PauseLayer: cc.Node = null;
    //shan界面
    @property(cc.Node) ShanLayer: cc.Node = null;
    //red界面
    @property(cc.Node) RedLayer: cc.Node = null;
    //倒计时的label组件
    @property(cc.Label) Timelabel: cc.Label = null;
    
    //----- 属性声明 -----//
    //记录当前分数
    score: number = 0;
    //记录当前血量
    nowHP: number = lib.defConfig.MAXHP;
    //记录当前能量
    nowPOWER: number = 0;
    //记录当前时间剩余
    nowTIME: number = 50;
    //----- 生命周期 -----//

    // onLoad () {}

    start () {
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ShowWarn,"showarn",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.HideWarn,"hidewarn",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.addHP,"addHP",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.OverGame,"gameover",this);
        // this.schedule(this.minTIME,0.1,cc.macro.REPEAT_FOREVER,3);
        // this.schedule(this.minTIME,1,cc.macro.REPEAT_FOREVER,3);
        this.schedule(this.minRed,0.02,cc.macro.REPEAT_FOREVER);
    }

    // update (dt) {}

    onDestroy(){
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ShowWarn,"showarn",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.HideWarn,"hidewarn",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.addHP,"addHP",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.OverGame,"gameover",this);
        // this.unschedule(this.minTIME);
        this.unschedule(this.minRed);
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
        this.ShanLayer.active = false;
        this.resetTIME();
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
    //----- 事件回调 -----//
    checkMove(){
        if(this.getPowerIsFull())
        {
            touchInstance.getinstance().setCanMove(true);
            this.schedule(this.minPOWER,0.1,50);
        }
    }

    gameover(){
        lib.wxFun.setUserCloudStorage(this.score);
        this.hidewarn();
        this.OverLayer.active = true;
    }

    showarn(){
        if(this.warning)
        {
            this.warning.active = true;
            let act = cc.repeatForever(cc.sequence(cc.fadeIn(0.5),cc.delayTime(0.5),cc.fadeOut(0.5)));
            this.warning.runAction(act);
        }
    }

    hidewarn(){
        if(this.warning)
        {
            this.warning.active = false;
        }
    }
    //----- 公有方法 -----//
    getHPIsFull(){
        if(this.nowHP >= lib.defConfig.MAXHP)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    getPowerIsFull(){
        if(this.nowPOWER >= lib.defConfig.MAXPOWER)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    addHP(){
        if(this.nowHP < lib.defConfig.MAXHP)
        {
            this.nowHP++;
            this.HP.progress = parseFloat((this.nowHP / lib.defConfig.MAXHP).toString());
            this.RedLayer.x = this.HP.progress * this.HP.totalLength - 50;
            this.RedLayer.width -= (1 / lib.defConfig.MAXHP) * this.HP.totalLength;
            if(this.RedLayer.width < 0)
            {
                this.RedLayer.width = 0;
            }
        }
    }

    initHP(){
        this.nowHP = lib.defConfig.MAXHP;
        this.HP.progress = 1;
    }

    minHP(){
        if(this.nowHP == 0)
        {
            return;
        }
        this.nowHP--;
        this.HP.progress = parseFloat((this.nowHP / lib.defConfig.MAXHP).toString());
        this.RedLayer.x = this.HP.progress * this.HP.totalLength - 50;
        this.RedLayer.width += (1 / lib.defConfig.MAXHP) * this.HP.totalLength;
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
        this.resetTIME();
        if(touchInstance.getinstance().getCanMove())
        {
            return;
        }
        let temp = score / 50;
        this.addPOWER(temp);
    }

    minTIME(){
        if(this.nowTIME <= 0)
        {
            return;
        }
        if(this.warning.active == true)
        {
            return;
        }
        this.nowTIME--;
        if(this.nowTIME <= 3)
        {
            this.Timelabel.string = this.nowTIME.toString();
            this.Timelabel.node.active = true;
        }
        if(this.nowTIME <= 0)
        {
            this.minHP();
            this.resetTIME();
        }
    }

    //----- 私有方法 -----//
    private minRed(){
        if(this.RedLayer.width <= 0)
        {
            this.RedLayer.width = 0;
            return;
        }
        this.RedLayer.width -= 1;
    }

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
            this.ShanLayer.active = true;
            let act = cc.repeatForever(cc.sequence(cc.fadeIn(0.5),cc.fadeOut(0.5)));
            this.ShanLayer.runAction(act);
        }
    }

    private minPOWER(){
        if(this.nowPOWER <= 0)
        {
            return;
        }
        this.nowPOWER--;
        this.POWER.progress = parseFloat((this.nowPOWER / lib.defConfig.MAXPOWER).toString());
        this.ShanLayer.width = this.POWER.progress * this.POWER.totalLength;
        if(this.nowPOWER <= 0)
        {
            this.ShanLayer.active = false;
            touchInstance.getinstance().setCanMove(false);
        }
    }

    private resetTIME(){
        this.nowTIME = lib.defConfig.MAXTIME;
        this.Timelabel.node.active = false;
        // this.TIME.progress = parseFloat((this.nowTIME / lib.defConfig.MAXTIME).toString());
    }

    // private minTIME(){
    //     if(this.nowTIME <= 0)
    //     {
    //         return;
    //     }
    //     if(this.warning.active == true)
    //     {
    //         return;
    //     }
    //     this.nowTIME--;
    //     this.TIME.progress = parseFloat((this.nowTIME / lib.defConfig.MAXTIME).toString());
    //     if(this.nowTIME <= 0)
    //     {
    //         this.minHP();
    //         this.resetTIME();
    //     }
    // }
}

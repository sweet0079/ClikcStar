/** 所有出生点控制 */
import * as lib from '../lib/lib'
import birthPointControl from './BirthPoint'
import ShapeManager from './ShapeManager'
import weaveControl from './weaveControl'
import UIControl from './UIControl'

const {ccclass, property} = cc._decorator;

@ccclass
export default class BirthControl extends cc.Component {
    //----- 编辑器属性 -----//
    /** 套路多少秒来一波 */
    @property({tooltip:"套路多少秒来一波", type: cc.Integer}) WeaveComeTime: number = 20;
    /** 套路多少秒随机刷特殊 */
    @property({tooltip:"特殊多少秒来一波", type: cc.Integer}) SpecialComeTime: number = 1;
    /** 出生间隔数组 */
    @property({tooltip:"出生间隔数组", type: [cc.Float]}) BirthInterval: Array<number> = [];
    /** 出生个数数组 */
    @property({tooltip:"出生个数数组", type: [cc.Float]}) BirthNumber: Array<number> = [];
    /** 出生速度数组 */
    @property({tooltip:"出生速度数组", type: [cc.Float]}) BirthSpeed: Array<number> = [];
    /** 出生点数组 */
    @property([birthPointControl]) birthPoints: Array<birthPointControl> = [];
    //UI控制组件
    @property(UIControl) UIcon: UIControl = null;

    //----- 属性声明 -----//
    //已运行时间
    private time = 0;
    //间隔
    private interval = 0;
    //套路持续时间
    private weaveTime = 0;
    //套路已持续时间
    private weaveRunTime = 0;
    //套路是否开始标识符
    private weaveFlag:boolean = false;
    //套路控制组件
    private _weaveControl:weaveControl = null;
    //特殊图形出现时间数组
    private _SpeArr = [lib.RandomParameters.RandomParameters.getRandomInt(this.SpecialComeTime),
        lib.RandomParameters.RandomParameters.getRandomInt(this.SpecialComeTime),lib.RandomParameters.RandomParameters.getRandomInt(this.SpecialComeTime)];
    //----- 生命周期 -----//
    // onLoad () {}

    start () {
        this._weaveControl = this.node.getComponent(weaveControl);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ReStart,"reStart",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.OverGame,"gameover",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.Bomb,"bombCallBack",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.startClock,"startClock",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.Resurrection,"Resurrection",this);
        if(cc.sys.localStorage.getItem('FirstPlay', 'undefined') == "true")
        {
            this.startClock();
        }
        else
        {
            cc.sys.localStorage.setItem('FirstPlay', 'true');
            this.NoviceGuidance();
        }
    }

    onDestroy(){
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ReStart,"reStart",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.OverGame,"gameover",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.Bomb,"bombCallBack",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.startClock,"startClock",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.Resurrection,"Resurrection",this);
    }
    //----- 公有方法 -----//
    getbirthPoints(){
        return this.birthPoints;
    }
    getweaveRunTime(){
        return this.weaveRunTime;
    }
    setweaveRunTime(num){
        this.weaveRunTime = num;
    }
    setweaveFlag(flag:boolean)
    {
        this.weaveFlag = flag;
    }
    getweaveFlag()
    {
        return this.weaveFlag;
    }
    addtime(){
        this.time += 0.5;
    }
    getweaveTime(){
        return this.weaveTime;
    }
    setweaveTime(num){
        this.weaveTime = num;
    }
    //判断一个数字在数组中是否有重复，false指有重复
    checkRepeat(num:number,arr:Array<number>){
        for(let i = 0; i < arr.length; i++)
        {
            if(num == arr[i])
            {
                return false;
            }
            if(i == arr.length - 1)
            {
                return true;
            }
        }
    }
    // update (dt) {}
    //----- 事件回调 -----//
    private Resurrection(){
        this.schedule(this.clockFun,0.5);
        this.UIcon.initHP();
    }
    private bombCallBack(){
        this.unschedule(this.clockFun);
        this._weaveControl.unscheduleAllCallbacks();
        this.scheduleOnce(()=>{
            this.UIcon.gameover(1);
        },1);
    }
    private gameover(){
        this.unschedule(this.clockFun);
        this._weaveControl.unscheduleAllCallbacks();
        this.UIcon.gameover(0);
    }

    //重新开始游戏回调
    private reStart(){
        this.unschedule(this.clockFun);
        this.time = 0;
        this.interval = 0;
        this.weaveFlag = false;
        this.weaveTime = 0;
        this.weaveRunTime = 0;
        for(let i = 0; i < this.birthPoints.length; i++)
        {
            this.birthPoints[i].resetSpeed();
        }
        this.startClock();
    }

    //----- 私有方法 -----//
    private NoviceGuidance(){
        this._weaveControl.createNormalShape();
        this.UIcon.showNoviceGuidance();
        this.scheduleOnce(()=>{
            ShapeManager.getinstance().pauseAllShape();
            this.UIcon.showNoviceGuidanceMask1();
        },1)
    }
    //根据时间增长，创建形状、提高难度
    private clockFun(){
        if(!this.weaveFlag)
        {
            this.time += 0.5;
            this.interval += 0.5;
            this.checkCreate();
            if(this.time % 1 == 0
            && this.time >= 3)
            {
                this.minTime();
            }
        }
        else
        {
            this._weaveControl.Weave();
        }
    }

    //开始计时
    private startClock(){
        this.schedule(this.clockFun,0.5);
    }

    //检验是否可以创建特殊形状
    private createSpeical(){
        if(this.time % this.SpecialComeTime == 0)
        {
            this._SpeArr = [lib.RandomParameters.RandomParameters.getRandomInt(this.SpecialComeTime),
                lib.RandomParameters.RandomParameters.getRandomInt(this.SpecialComeTime),lib.RandomParameters.RandomParameters.getRandomInt(this.SpecialComeTime)];
        }
        if(this.time % this.SpecialComeTime == this._SpeArr[0])
        {
            if(this.time < 60)
            {
                if(!this.UIcon.getHPIsFull())
                {
                    this.birthPoints[lib.RandomParameters.RandomParameters.getRandomInt(this.birthPoints.length)].createSpecialShape(0);
                }
            }
            else
            {
                this._weaveControl.createBlinkSpecial(0);
            }
        }
        if(this.time % this.SpecialComeTime == this._SpeArr[1])
        {
            if(this.time <= 30)
            {
                if(!this.UIcon.getHPIsFull())
                {
                    this.birthPoints[lib.RandomParameters.RandomParameters.getRandomInt(this.birthPoints.length)].createSpecialShape(0);
                }
            }
            else if(this.time < 60)
            {
                this.birthPoints[lib.RandomParameters.RandomParameters.getRandomInt(this.birthPoints.length)].createSpecialShape(1);
            }
            else
            {
                this._weaveControl.createBlinkSpecial(1);
            }
        }
        if(this.time % this.SpecialComeTime == this._SpeArr[2])
        {
            if(this.time < 60)
            {
                this.birthPoints[lib.RandomParameters.RandomParameters.getRandomInt(this.birthPoints.length)].createSpecialShape(1);
            }
            else
            {
                this._weaveControl.createBlinkSpecial(1);
            }
        }
    }

    //检验是否可以创建形状
    private checkCreate(){
        this.createSpeical();
        let SerialNumber:number = parseInt((this.time / 10).toString());
        // console.log("this.time = " + this.time);
        // console.log("this.interval = " + this.interval);
        // console.log("SerialNumber = " + SerialNumber);
        //判断套路是否结束
        if(this.time != 0 && this.time % this.WeaveComeTime == 0)
        {
            this.weaveFlag = true;
            this.weaveTime = 0;
            this.weaveRunTime = 0;
        }
        //判断当前难度
        if(SerialNumber >= this.BirthInterval.length
        || SerialNumber >= this.BirthNumber.length)
        {
            SerialNumber = this.BirthNumber.length - 1;
        }
        //判断是否该出形状
        if(this.interval >= this.BirthInterval[SerialNumber])
        {
            this.interval = 0;
            for(let i = 0; i < this.birthPoints.length; i++)
            {
                this.birthPoints[i].setSpeed(this.BirthSpeed[SerialNumber]);
            }
            this.BirthPointsCreate(this.BirthNumber[SerialNumber]);
        }
    }

    //num表示几个出生点生成形状
    private BirthPointsCreate(num:number){
        let birtharr = this.randomArray(num);
        for(let i = 0; i < birtharr.length; i++)
        {
            if(ShapeManager.getinstance().getNum() >= 10)
            {
                return;
            }
            this.birthPoints[birtharr[i]].createRandomShape();
        }
    }

    //生成一个num位的，各不相同的随机数组
    private randomArray(num,len = this.birthPoints.length){
        let tempArr = [];
        for(let i = 0; i < num; i++)
        {
            let temp = parseInt((cc.random0To1() * len).toString());
            if(tempArr.length == 0)
            {
                tempArr.push(temp);
            }
            else
            {
                while(!this.checkRepeat(temp,tempArr))
                {
                    temp = parseInt((cc.random0To1() * len).toString());
                }
                tempArr.push(temp);
            }
        }
        //console.log(tempArr);
        return tempArr;
    }

    private minTime(){
        this.UIcon.minTIME();
    }
}

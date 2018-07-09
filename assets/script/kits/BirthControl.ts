/** 所有出生点控制 */
import * as lib from '../lib/lib'
import birthPointControl from './BirthPoint'
import ShapeManager from './ShapeManager'
import weaveControl from './weaveControl'

const {ccclass, property} = cc._decorator;

@ccclass
export default class BirthControl extends cc.Component {
    //----- 编辑器属性 -----//
    /** 套路多少秒来一波 */
    @property({tooltip:"套路多少秒来一波", type: cc.Integer}) WeaveComeTime: number = 20;
    /** 套路多少秒随机刷特殊 */
    @property({tooltip:"套路多少秒来一波", type: cc.Integer}) SpecialComeTime: number = 13;
    /** 出生间隔数组 */
    @property({tooltip:"出生间隔数组", type: [cc.Float]}) BirthInterval: Array<number> = [];
    /** 出生个数数组 */
    @property({tooltip:"出生个数数组", type: [cc.Float]}) BirthNumber: Array<number> = [];
    /** 出生速度数组 */
    @property({tooltip:"出生速度数组", type: [cc.Float]}) BirthSpeed: Array<number> = [];
    /** 出生点数组 */
    @property([birthPointControl]) birthPoints: Array<birthPointControl> = [];

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
    private _weaveControl = null;
    //----- 生命周期 -----//
    // onLoad () {}

    start () {
        this._weaveControl = this.node.getComponent(weaveControl);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ReStart,"reStart",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.OverGame,"gameover",this);
        this.startClock();
    }

    onDestroy(){
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ReStart,"reStart",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.OverGame,"gameover",this);
    }
    //----- 公有方法 -----//
    getbirthPoints(){
        return this.birthPoints;
    }
    // update (dt) {}
    //----- 事件回调 -----//
    private gameover(){
        this.unschedule(this.clockFun);
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
    //根据时间增长，创建形状、提高难度
    private clockFun(){
        if(!this.weaveFlag)
        {
            this.time += 0.5;
            this.interval += 0.5;
            this.checkCreate();
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

    //检验是否可以创建形状
    private checkCreate(){
        if(this.time % this.SpecialComeTime == 0)
        {
            let index = lib.RandomParameters.RandomParameters.getRandomInt(this.birthPoints.length);
            this.birthPoints[index].createSpecialShape();
        }
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

    //判断一个数字在数组中是否有重复，false指有重复
    private checkRepeat(num:number,arr:Array<number>){
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
}

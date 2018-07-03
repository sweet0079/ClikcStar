/** 所有出生点控制 */
import * as lib from '../lib/lib'
import birthPointControl from './BirthPoint'
import ShapeManager from './ShapeManager'

const {ccclass, property} = cc._decorator;

@ccclass
export default class BirthControl extends cc.Component {
    //----- 编辑器属性 -----//
    /** 套路多少秒来一波 */
    @property({tooltip:"套路多少秒来一波", type: cc.Integer}) WeaveComeTime: number = 20;
    /** 出生间隔数组 */
    @property({tooltip:"出生间隔数组", type: [cc.Float]}) BirthInterval: Array<number> = [];
    /** 出生个数数组 */
    @property({tooltip:"出生个数数组", type: [cc.Float]}) BirthNumber: Array<number> = [];
    /** 出生速度数组 */
    @property({tooltip:"出生速度数组", type: [cc.Float]}) BirthSpeed: Array<number> = [];
    /** 出生点数组 */
    @property([birthPointControl]) birthPoints: Array<birthPointControl> = [];

    //----- 属性声明 -----//
    private time = 0;
    private interval = 0;
    //套路持续时间
    private weaveTime = 0;
    //套路已持续时间
    private weaveRunTime = 0;
    //套路是否开始标识符
    private weaveFlag:boolean = false;
    //----- 生命周期 -----//
    // onLoad () {}

    start () {
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ReStart,"reStart",this);
        this.startClock();
    }

    onDestroy(){
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ReStart,"reStart",this);
    }

    // update (dt) {}
    //----- 事件回调 -----//
    //逐个点生成形状
    private reStart(){
        this.unscheduleAllCallbacks();
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
    //套路开始主方法
    private Weave(){
        if(this.weaveRunTime == 0)
        {
            lib.msgEvent.getinstance().emit(lib.msgConfig.ShowWarn);
        }
        this.weaveRunTime += 0.5;
        if(this.weaveRunTime == lib.defConfig.WarningTime)
        {
            lib.msgEvent.getinstance().emit(lib.msgConfig.HideWarn);
            let weavetype = parseInt((cc.random0To1() * (lib.defConfig.Tricks.length)).toString());
            switch(weavetype)
            {
                case lib.defConfig.Tricks.volley:
                    this.volley();
                    break
                case lib.defConfig.Tricks.order:
                    let startPoint = parseInt((cc.random0To1() * (this.birthPoints.length)).toString());
                    this.order(startPoint);
                    break;
                case lib.defConfig.Tricks.symmetry:
                    this.symmetry();
                    break;
                default:
                    break;
            }
        }
        if(this.weaveRunTime == lib.defConfig.WarningTime + this.weaveTime){
            this.weaveFlag = false;
            this.time += 0.5;
        }
    }

    //齐射主方法
    private volley(){
        //根据套路持续时间设置
        this.weaveTime = 3;

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        //获取随机参数数值
        let angle = 0;
        let speed = this.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //逐个点生成形状
        for(let i = 0; i < this.birthPoints.length; i++)
        {
            let fpare = this.birthPoints[i].getRandomFlyParameters();
            if(fpareFlag)
            {
                fpare.Angle = angle;
                //角落4个出生点的入射角设置为45度
                if(i == 0 || i == 4 || i == 10 || i == 14)
                {
                    fpare.Angle = 45;
                }
                fpare.Speed = speed;
            }
            fpare.Angle = this.birthPoints[i].getAngleToPoint(0,0);
            if(!dpareFlag)
            {
                dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
            }
            if(!cpareFlag)
            {
                cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
            }
            if(!spareFlag)
            {
                spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
            }
            this.birthPoints[i].createAppointShape(fpare,dpare,cpare,spare);
        }
    }

    //有序主方法
    private order(startpoint:number){
        startpoint = startpoint % this.birthPoints.length;
        //根据套路持续时间设置
        this.weaveTime = 21;

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        //获取随机参数数值
        let angle = 0;
        let speed = this.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //逐个点生成形状
        for(let i = 0; i < this.birthPoints.length; i++)
        {
            this.scheduleOnce(()=>{
                let temp = i + startpoint;
                if(temp >= this.birthPoints.length)
                {
                    temp -= this.birthPoints.length;
                }
                let fpare = this.birthPoints[temp].getRandomFlyParameters();
                if(fpareFlag)
                {
                    fpare.Angle = angle;
                    //角落4个出生点的入射角设置为45度
                    if(temp == 0 || temp == 4 || temp == 10 || temp == 14)
                    {
                        fpare.Angle = 45;
                    }
                    fpare.Speed = speed;
                }
                fpare.Angle = this.birthPoints[temp].getAngleToPoint(0,0);
                if(!dpareFlag)
                {
                    dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
                }
                if(!cpareFlag)
                {
                    cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
                }
                if(!spareFlag)
                {
                    spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                }
                this.birthPoints[temp].createAppointShape(fpare,dpare,cpare,spare);
            },i);
        }
    }

    //对称套路主方法
    private symmetry(){
        //根据套路持续时间设置
        this.weaveTime = 5;

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        //获取随机参数数值
        let speed = this.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //随机三个点
        let pointArr = this.randomArray(3);
        for(let i = 0 ; i < 3; i++)
        {
            this.scheduleOnce(()=>{
                let fpare = this.birthPoints[pointArr[i]].getRandomFlyParameters();
                let angle = fpare.Angle;
                let reverse:boolean = lib.RandomParameters.RandomParameters.getRandomBool();
                this.birthPoints[pointArr[i]].createAppointShape(fpare,dpare,cpare,spare);
                //根据是否随机各项参数来判断是否需要重新赋值
                if(fpareFlag)
                {
                    fpare.Speed = speed;
                }
                if(!dpareFlag)
                {
                    dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
                }
                if(!cpareFlag)
                {
                    cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
                }
                if(!spareFlag)
                {
                    spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                }
                if(reverse)
                {
                    if(this.birthPoints[lib.RandomParameters.RandomParameters.getSymmetricPoint(pointArr[i])].JudgeAngleLegality(-angle))
                    {
                        fpare.Angle = -angle;
                    }
                }
                this.birthPoints[lib.RandomParameters.RandomParameters.getSymmetricPoint(pointArr[i])].createAppointShape(fpare,dpare,cpare,spare);
            },i);
        }
    }

    //开始计时，根据时间增长，创建形状、提高难度
    private startClock(){
        this.schedule(()=>{
            if(!this.weaveFlag)
            {
                this.time += 0.5;
                this.interval += 0.5;
                this.checkCreate();
            }
            else
            {
                this.Weave();
            }
            // console.log("time = " + this.time + "  interval = " + this.interval);
        },0.5);
    }

    //检验是否可以创建形状
    private checkCreate(){
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
    private randomArray(num){
        let tempArr = [];
        for(let i = 0; i < num; i++)
        {
            let temp = parseInt((cc.random0To1() * this.birthPoints.length).toString());
            if(tempArr.length == 0)
            {
                tempArr.push(temp);
            }
            else
            {
                while(!this.checkRepeat(temp,tempArr))
                {
                    temp = parseInt((cc.random0To1() * this.birthPoints.length).toString());
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

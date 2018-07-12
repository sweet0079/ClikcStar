/** 套路控制 */
const {ccclass, property} = cc._decorator;

import * as lib from '../lib/lib'
import birthControl from './BirthControl'
import shapeControl from './ShapeControl'

@ccclass
export default class weaveControl extends cc.Component {
    //----- 编辑器属性 -----//
    /** 形状的预制体 */
    @property(cc.Prefab) blinkShapePre: cc.Prefab = null;
    /** 闪烁X轴数组 */
    @property({tooltip:"闪烁X轴数组", type: [cc.Integer]}) BlinkXArr: Array<number> = [];
    /** 闪烁Y轴数组 */
    @property({tooltip:"闪烁Y轴数组", type: [cc.Integer]}) BlinkYArr: Array<number> = [];
    //----- 属性声明 -----//
    //出生点总控制组件
    private _birthControl:birthControl = null;
    //----- 生命周期 -----//
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this._birthControl = this.node.getComponent(birthControl);
    }

    // update (dt) {} 
    //----- 公有方法 -----//
    //套路开始主方法
    Weave(){
        if(this._birthControl.getweaveRunTime() == 0)
        {
            lib.msgEvent.getinstance().emit(lib.msgConfig.ShowWarn);
        }
        this._birthControl.setweaveRunTime(this._birthControl.getweaveRunTime() + 0.5);
        if(this._birthControl.getweaveRunTime() == lib.defConfig.WarningTime)
        {
            lib.msgEvent.getinstance().emit(lib.msgConfig.HideWarn);
            let weavetype = parseInt((cc.random0To1() * (lib.defConfig.Tricks.length)).toString());
            switch(weavetype)
            {
                case lib.defConfig.Tricks.volley:
                    this.volley();
                    break
                case lib.defConfig.Tricks.order:
                    let startPoint = parseInt((cc.random0To1() * (this._birthControl.birthPoints.length)).toString());
                    this.order(startPoint);
                    break;
                case lib.defConfig.Tricks.union:
                    this.union();
                    break;
                case lib.defConfig.Tricks.symmetry:
                    this.symmetry();
                    break;
                case lib.defConfig.Tricks.Waterfall:
                    this.Waterfall();
                    break;
                case lib.defConfig.Tricks.focus:
                    this.focus();
                    break;
                case lib.defConfig.Tricks.focusDiv:
                    this.focusDiv();
                    break;
                case lib.defConfig.Tricks.across:
                    this.across();
                    break;
                case lib.defConfig.Tricks.blink:
                    this.blink();
                    break;
                default:
                    break;
            }            
            let startPoint = parseInt((cc.random0To1() * (this._birthControl.birthPoints.length)).toString());
            // this.blink();
        }
        if(this._birthControl.getweaveRunTime() == lib.defConfig.WarningTime + this._birthControl.getweaveTime())
        {
            this._birthControl.setweaveFlag(false);
            this._birthControl.addtime();
        }
    }
    //----- 私有方法 -----//
    //闪烁主方法
    private blink(){
        //根据套路持续时间设置
        this._birthControl.setweaveTime(5 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();

        for(let i = 0; i < this.BlinkXArr.length; i++)
        {
            for(let j = 0; j < this.BlinkYArr.length; j++)
            {
                if(!spareFlag)
                {
                    spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                }
                let shape = cc.instantiate(this.blinkShapePre);
                shape.setPosition(this.BlinkXArr[i],this.BlinkYArr[j]);
                shape.getComponent(shapeControl).setShape(spare.type);
                shape.parent = this._birthControl.birthPoints[0].getShapeParentNode();
            }
        }
    }

    //交叉主方法
    private across(){
        //根据套路持续时间设置
        this._birthControl.setweaveTime(2.5 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        //获取随机参数数值
        let speed = this._birthControl.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //所有角落同时生成形状
        for(let i = 0; i < this._birthControl.birthPoints.length; i++)
        {
            if(this._birthControl.birthPoints[i].birthpos != lib.defConfig.birthpoint.leftbottom 
            && this._birthControl.birthPoints[i].birthpos != lib.defConfig.birthpoint.lefttop
            && this._birthControl.birthPoints[i].birthpos != lib.defConfig.birthpoint.rightbottom
            && this._birthControl.birthPoints[i].birthpos != lib.defConfig.birthpoint.righttop)
            {
                continue;
            }
            let fpare = this._birthControl.birthPoints[i].getRandomFlyParameters();
            // if(fpareFlag)
            // {
            fpare.Speed = speed;
            // }
            fpare.Angle = this._birthControl.birthPoints[i].getAngleToPoint(0,0);
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
            let index = i;
            for(let j = 0; j < 5; j++)
            {
                this.scheduleOnce(()=>{
                    cpare.divisionDistance =  this._birthControl.birthPoints[index].getDisToPoint(0,0);
                    this._birthControl.birthPoints[index].createAppointShape(fpare,dpare,cpare,spare);
                },j * 0.5);
            }
        }

    }

    //集中分裂主方法
    private focusDiv(){
        let temp = lib.RandomParameters.RandomParameters.getRandomInt(2);
        //根据套路持续时间设置
        this._birthControl.setweaveTime(6 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        //获取随机参数数值
        let speed = this._birthControl.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        cpare.type = lib.defConfig.character.division;
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //所有点同时生成形状
        for(let i = 0; i < this._birthControl.birthPoints.length; i++)
        {
            if(i % 2 == temp)
            {
                continue;
            }
            let fpare = this._birthControl.birthPoints[i].getRandomFlyParameters();
            // if(fpareFlag)
            // {
                fpare.Speed = speed;
            // }
            fpare.Angle = this._birthControl.birthPoints[i].getAngleToPoint(0,0);
            // if(!dpareFlag)
            // {
            //     dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
            // }
            // if(!cpareFlag)
            // {
            //     cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
            // }
            // if(!spareFlag)
            // {
            //     spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
            // }
            let index = i;
            for(let j = 0; j < 3; j++)
            {
                this.scheduleOnce(()=>{
                    cpare.divisionDistance =  this._birthControl.birthPoints[index].getDisToPoint(0,0);
                    this._birthControl.birthPoints[index].createAppointShape(fpare,dpare,cpare,spare);
                },j * 0.5);
            }
        }
    }

    //集中主方法
    private focus()
    {
        let temp = lib.RandomParameters.RandomParameters.getRandomInt(2);
        //根据套路持续时间设置
        this._birthControl.setweaveTime(6 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        //获取随机参数数值
        let speed = this._birthControl.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //所有点同时生成形状
        for(let i = 0; i < this._birthControl.birthPoints.length; i++)
        {
            if(i % 2 == temp)
            {
                continue;
            }
            let fpare = this._birthControl.birthPoints[i].getRandomFlyParameters();
            // if(fpareFlag)
            // {
                fpare.Speed = speed;
            // }
            fpare.Angle = this._birthControl.birthPoints[i].getAngleToPoint(0,0);
            // if(!dpareFlag)
            // {
            //     dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
            // }
            // if(!cpareFlag)
            // {
            //     cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
            // }
            // if(!spareFlag)
            // {
            //     spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
            // }
            let index = i;
            for(let j = 0; j < 1; j++)
            {
                this.scheduleOnce(()=>{
                    this._birthControl.birthPoints[index].createAppointShape(fpare,dpare,cpare,spare);
                },j * 0.5);
            }
        }
    }

    //飞瀑主方法
    private Waterfall(){
        //根据套路持续时间设置
        this._birthControl.setweaveTime(3 + lib.defConfig.WeaveEndTime);

        //获取随机方向
        let dir = 0;
        let temp = parseInt((cc.random0To1() * 4).toString());
        switch(temp)
        {
            case 0:
                dir = lib.defConfig.birthpoint.left;
                break;
            case 1:
                dir = lib.defConfig.birthpoint.top;
                break;
            case 2:
                dir = lib.defConfig.birthpoint.right;
                break;
            case 3:
                dir = lib.defConfig.birthpoint.bottom;
                break;
            default:
                break;
        }

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        
        //获取随机参数数值
        let angle = 0;
        let speed = this._birthControl.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //找到对应边生成形状
        for(let i = 0; i < this._birthControl.birthPoints.length; i++)
        {
            if(this._birthControl.birthPoints[i].birthpos == dir)
            {
                let fpare = this._birthControl.birthPoints[i].getRandomFlyParameters();
                fpare.Angle = angle;
                fpare.Speed = speed;
                let index = i;
                for(let j = 0; j < 5; j++)
                {
                    this.scheduleOnce(()=>{
                        this._birthControl.birthPoints[index].createAppointShape(fpare,dpare,cpare,spare);
                    },j * 0.5);
                }
            }
        }
    }

    //齐射主方法
    private volley(){
        //根据套路持续时间设置
        this._birthControl.setweaveTime(3 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        //获取随机参数数值
        let speed = this._birthControl.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //所有点同时生成形状
        for(let i = 0; i < this._birthControl.birthPoints.length; i++)
        {
            let fpare = this._birthControl.birthPoints[i].getRandomFlyParameters();
            // if(fpareFlag)
            // {
                fpare.Speed = speed;
            // }
            fpare.Angle = this._birthControl.birthPoints[i].getAngleToPoint(0,0);
            // if(!dpareFlag)
            // {
            //     dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
            // }
            // if(!cpareFlag)
            // {
            //     cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
            // }
            // if(!spareFlag)
            // {
            //     spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
            // }
            this._birthControl.birthPoints[i].createAppointShape(fpare,dpare,cpare,spare);
        }
    }

    //联合主方法
    private union(){
        //根据套路持续时间设置
        this._birthControl.setweaveTime(7 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = false;//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = true;//是否固定相同的形状
        //获取随机参数数值
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //所有点同时生成形状
        for(let i = 0; i < 3; i++)
        {
            let birNum = parseInt((cc.random0To1() * (this._birthControl.birthPoints.length)).toString());
            let angle = this._birthControl.birthPoints[birNum].getRandomFlyParameters().Angle;
            let speed = this._birthControl.birthPoints[birNum].getRandomFlyParameters().Speed;
            this.scheduleOnce(()=>{
                for(let i = 0; i < 5; i++)
                {
                    let fpare = this._birthControl.birthPoints[birNum].getRandomFlyParameters();
                    if(fpareFlag)
                    {
                        fpare.Angle = angle;
                        fpare.Speed = speed;
                    }
                    //fpare.Angle = this.birthPoints[birNum].getAngleToPoint(0,0);
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
                    this._birthControl.birthPoints[birNum].createAppointShape(fpare,dpare,cpare,spare);
                }
            },i * 2);
        }
    }

    //有序主方法
    private order(startpoint:number){
        startpoint = startpoint % this._birthControl.birthPoints.length;
        //根据套路持续时间设置
        this._birthControl.setweaveTime(10 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        //获取随机参数数值
        let speed = this._birthControl.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //逐个点生成形状
        for(let i = 0; i < this._birthControl.birthPoints.length; i++)
        {
            this.scheduleOnce(()=>{
                let temp = i + startpoint;
                if(temp >= this._birthControl.birthPoints.length)
                {
                    temp -= this._birthControl.birthPoints.length;
                }
                let fpare = this._birthControl.birthPoints[temp].getRandomFlyParameters();
                // if(fpareFlag)
                // {
                    fpare.Speed = speed;
                // }
                fpare.Angle = this._birthControl.birthPoints[temp].getAngleToPoint(0,0);
                // if(!dpareFlag)
                // {
                //     dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
                // }
                // if(!cpareFlag)
                // {
                //     cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
                // }
                // if(!spareFlag)
                // {
                //     spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                // }
                this._birthControl.birthPoints[temp].createAppointShape(fpare,dpare,cpare,spare);
            },i * 0.5);
        }
    }

    //对称套路主方法
    private symmetry(){
        //随机是上下还是左右出
        let temp = lib.RandomParameters.RandomParameters.getRandomInt(2);
        let pointArr = [];
        if(temp == 0)
        {
            pointArr = [1,2,3];
        }
        else
        {
            pointArr = [5,7,9];
        }
        //根据套路持续时间设置
        this._birthControl.setweaveTime(5 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        //获取随机参数数值
        let fpare = this._birthControl.birthPoints[pointArr[0]].getRandomFlyParameters();
        let sfpare = fpare;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //是否是异度角标识
        let reverse:boolean = lib.RandomParameters.RandomParameters.getRandomBool();
        for(let i = 0 ; i < 3; i++)
        {
            this.scheduleOnce(()=>{
                for(let j =0 ; j < pointArr.length; j++)
                {
                    let angle = fpare.Angle;
                    this._birthControl.birthPoints[pointArr[j]].createAppointShape(fpare,dpare,cpare,spare);
                    //根据是否随机各项参数来判断是否需要重新赋值
                    // if(fpareFlag)
                    // {
                        // fpare.Speed = speed;
                    // }
                    // if(!dpareFlag)
                    // {
                    //     dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
                    // }
                    // if(!cpareFlag)
                    // {
                    //     cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
                    // }
                    // if(!spareFlag)
                    // {
                    //     spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                    // }
                    // if(reverse)
                    // {
                    //     if(this._birthControl.birthPoints[lib.RandomParameters.RandomParameters.getSymmetricPoint(pointArr[j])].JudgeAngleLegality(-angle))
                    //     {
                    //         sfpare.Angle = -angle;
                    //     }
                    // }
                    this._birthControl.birthPoints[lib.RandomParameters.RandomParameters.getSymmetricPoint(pointArr[j])].createAppointShape(sfpare,dpare,cpare,spare);
                }
            },i);
        }
    }
}

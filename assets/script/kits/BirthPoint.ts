/** 控制单个出生点 */
import * as lib from '../lib/lib'
import FlyingShape from './FlyingShape'
import characteristic from './Characteristic'
import disspation from './Disspation'
import shapeControl from './ShapeControl'
import ShapeManager from './ShapeManager'

const {ccclass, property} = cc._decorator;

@ccclass
export default class BirthPoint extends cc.Component {
    //----- 编辑器属性 -----//
    /** 出生点所在位置 */
    @property({tooltip:"出生点所在位置", type: lib.defConfig.birthpoint }) birthpos = lib.defConfig.birthpoint.left;
    //飞行轨迹参数
    /** 默认随机形状的速度下限 */
    @property({tooltip:"随机生成形状的速度下限", type: cc.Float }) SpeedLowerLimit:number = 50;
    /** 默认随机形状的速度上限 */
    @property({tooltip:"随机生成形状的速度上限", type: cc.Float }) SpeedUpperLimit:number = 200;
    /** 默认随机形状的入射角下限 */
    @property({tooltip:"随机形状的入射角下限", type: cc.Integer }) AngleLowerLimit:number = -80;
    /** 默认随机形状的入射角上限 */
    @property({tooltip:"随机形状的入射角上限", type: cc.Integer }) AngleUpperLimit:number = 80;
    /** 默认长曲线模式加速度下限 */
    @property({tooltip:"随机形状的长曲线模式角变化速度下限", type: cc.Integer }) deltangleLowerLimit:number = 3;
    /** 默认长曲线模式加速度上限 */
    @property({tooltip:"随机形状的长曲线模式角变化速度上限", type: cc.Integer }) deltangleUpperLimit:number = 30;
    /** 默认螺旋线速度下限 */
    @property({tooltip:"随机形状的螺旋模式螺旋线速度下限", type: cc.Integer }) screwspeedLowerLimit:number = 100;
    /** 默认螺旋线速度上限 */
    @property({tooltip:"随机形状的螺旋模式螺旋线速度上限", type: cc.Integer }) screwspeedUpperLimit:number = 300;
    /** 默认螺旋角速度下限 */
    @property({tooltip:"随机形状的螺旋模式螺旋角速度下限", type: cc.Integer }) screwAngleSpeedLowerLimit:number = 180;
    /** 默认螺旋角速度上限 */
    @property({tooltip:"随机形状的螺旋模式螺旋角速度上限", type: cc.Integer }) screwAngleSpeedUpperLimit:number = 360;
    /** 默认转向距离下限 */
    @property({tooltip:"随机形状的转向模式转向距离下限", type: cc.Integer }) TurnThresholdLowerLimit:number = 150;
    /** 默认转向距离上限 */
    @property({tooltip:"随机形状的转向模式转向距离上限", type: cc.Integer }) TurnThresholdUpperLimit:number = 850;
    /** 默认转向角度下限 */
    @property({tooltip:"随机形状的转向模式转向角度下限", type: cc.Integer }) TurnAngleLowerLimit:number = 1;
    /** 默认转向角度上限 */
    @property({tooltip:"随机形状的转向模式转向角度上限", type: cc.Integer }) TurnAngleUpperLimit:number = 179;
    /** 形状的预制体 */
    @property(cc.Prefab) shapeprefeb: cc.Prefab = null;
    /** 形状的父节点 */
    @property(cc.Node) shapeParNode: cc.Node = null;

    //----- 属性声明 -----//
    //进入屏幕前的飞行角
    private InitialAngle = 0;
    //速度倍率
    private SpeedScaleNum = 0;
    //----- 生命周期 -----//
    // onLoad () {}

    start () {
            this.schedule(()=>{
                let temp = cc.random0To1() * 100;
                // if(temp < 20)
                // {
                //     this.createRandomShape();
                // }
                if(this.birthpos == lib.defConfig.birthpoint.lefttop)
                {
                    this.createRandomShape();
                }
            },5);
        //根据出生点调整形状的初始角
        switch(this.birthpos)
        {
            case lib.defConfig.birthpoint.leftbottom:
                this.InitialAngle = 45;
                break;
            case lib.defConfig.birthpoint.left:
                this.InitialAngle = 0;
                break;
            case lib.defConfig.birthpoint.lefttop:
                this.InitialAngle = -45;
                break;
            case lib.defConfig.birthpoint.top:
                this.InitialAngle = -90;
                break;
            case lib.defConfig.birthpoint.righttop:
                this.InitialAngle = -45;
                break;
            case lib.defConfig.birthpoint.right:
                this.InitialAngle = 0;
                break;
            case lib.defConfig.birthpoint.rightbottom:
                this.InitialAngle = 45;
                break;
            case lib.defConfig.birthpoint.bottom:
                this.InitialAngle = 90;
                break;
            default:
                this.InitialAngle = 0;
                break;
        }
    }

    // update (dt) {}

    //----- 公有方法 -----//
    setSpeed(scale:number){
        if(this.SpeedScaleNum != scale)
        {
            this.SpeedScaleNum = scale;
            this.SpeedLowerLimit *= this.SpeedScaleNum;
            this.SpeedUpperLimit *= this.SpeedScaleNum;
        }
    }

    resetSpeed(){
        if(this.SpeedScaleNum != 0)
        {
            this.SpeedLowerLimit /= this.SpeedScaleNum;
            this.SpeedUpperLimit /= this.SpeedScaleNum;
        }
    }

    //创建随机形状
    createRandomShape(){
        //随机形状的飞行轨迹组件参数
        //取得一个随机速度
        let speed = cc.random0To1() * (this.SpeedUpperLimit - this.SpeedLowerLimit) + this.SpeedLowerLimit;
        //取得一个随机入射角度
        let angle = cc.random0To1() * (this.AngleUpperLimit - this.AngleLowerLimit) + this.AngleLowerLimit;
        //取得一个随机飞行轨迹
        let trajectory = parseInt((cc.random0To1() * (lib.defConfig.Flightpath.screw + 1)).toString());
        //取得一个随机长曲线模式角速度加速度
        let deltangle = cc.random0To1() * (this.deltangleUpperLimit - this.deltangleLowerLimit) + this.deltangleLowerLimit;
        //取得一个随机形状的螺旋模式螺旋线速度
        let screwspeed = cc.random0To1() * (this.screwspeedUpperLimit - this.screwspeedLowerLimit) + this.screwspeedLowerLimit;
        //取得一个随机形状的螺旋模式螺旋角速度
        let screwAngleSpeed = cc.random0To1() * (this.screwAngleSpeedUpperLimit - this.screwAngleSpeedLowerLimit) + this.screwAngleSpeedLowerLimit;
        //取得一个随机形状的转向模式转向距离
        let TurnThreshold = cc.random0To1() * (this.TurnThresholdUpperLimit - this.TurnThresholdLowerLimit) + this.TurnThresholdLowerLimit;
        //取得一个随机形状的转向模式转向角度
        let TurnAngle = cc.random0To1() * (this.TurnAngleUpperLimit - this.TurnAngleLowerLimit) + this.TurnAngleLowerLimit;
        //赋值
        // if(trajectory == lib.defConfig.Flightpath.curve)
        // {
        //     if(angle < 0)
        //     {
        //         angle = -angle;
        //     }
        // }
        this.createShape(speed,angle,trajectory,deltangle,screwspeed,screwAngleSpeed,TurnThreshold,TurnAngle);
    }

    //----- 私有方法 -----//
    private createShape(speed,angle,trajectory,deltangle,screwspeed,screwAngleSpeed,TurnThreshold,TurnAngle){
        let shape = cc.instantiate(this.shapeprefeb);
        shape.position = this.node.position;
        let shapepath = shape.getComponent(FlyingShape);
        //根据出生点所在位置改变形状出生位置
        switch(this.birthpos)
        {
            case lib.defConfig.birthpoint.left:
                shapepath.birthpos = lib.defConfig.shapebirthpos.left;
                break;
            case lib.defConfig.birthpoint.lefttop:
                if(angle >= 0)
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.top;
                }
                else
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.left;
                }
                break;
            case lib.defConfig.birthpoint.top:
                shapepath.birthpos = lib.defConfig.shapebirthpos.top;
                break;
            case lib.defConfig.birthpoint.righttop:
                if(angle >= 0)
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.top;
                    angle = -angle;
                }
                else
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.right;
                }
                break;
            case lib.defConfig.birthpoint.right:
                shapepath.birthpos = lib.defConfig.shapebirthpos.right;
                break;
            case lib.defConfig.birthpoint.rightbottom:
                if(angle >= 0)
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.right;
                }
                else
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.bottom;
                    angle = -angle;
                }
                break;
            case lib.defConfig.birthpoint.bottom:
                shapepath.birthpos = lib.defConfig.shapebirthpos.bottom;
                break;
            case lib.defConfig.birthpoint.leftbottom:
                if(angle >= 0)
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.left;
                }
                else
                {
                    shapepath.birthpos = lib.defConfig.shapebirthpos.bottom;
                }
                break;
        }
        shapepath.setInitialAngle(this.InitialAngle);
        shapepath.Speed = speed;
        shapepath.Angle = angle;
        shapepath.Flightpath = trajectory;
        shapepath.deltangle = deltangle;
        shapepath.screwspeed = screwspeed;
        shapepath.screwAngleSpeed = screwAngleSpeed;
        shapepath.TurnThreshold = TurnThreshold;
        shapepath.TurnAngle = TurnAngle;
        //随机形状的特性参数
        let shapechara = shape.getComponent(characteristic);
        shapechara.type = parseInt((cc.random0To1() * (lib.defConfig.character.blink + 1)).toString());
        //随机形状的消散参数
        let shapediss = shape.getComponent(disspation);
        shapediss.type = parseInt((cc.random0To1() * (lib.defConfig.dissipate.decompose + 1)).toString());
        //随机形状的外形参数
        shape.getComponent(shapeControl).randomShape();
        //添加至管理类
        ShapeManager.getinstance().addShape(shape);
        //赋值父节点
        shape.parent = this.shapeParNode;
    }
}

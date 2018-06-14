/** 控制单个出生点 */
import * as lib from '../lib/lib'
import FlyingShape from './FlyingShape'
import characteristic from './Characteristic'
import disspation from './Disspation'

const {ccclass, property} = cc._decorator;

@ccclass
export default class BirthPoint extends cc.Component {

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

    // onLoad () {}

    start () {
            this.schedule(()=>{
                // let temp = cc.random0To1() * 100;
                // if(temp < 20)
                // {
                //     this.createRandomShape();
                // }
                // if(this.birthpos == lib.defConfig.birthpoint.lefttop)
                // {
                //     this.createRandomShape();
                // }
            },5);
    }

    // update (dt) {}
    //----- 私有方法 -----//
    //创建随机形状
    createRandomShape(){
        let shape = cc.instantiate(this.shapeprefeb);
        shape.position = this.node.position;
        //随机形状的飞行轨迹组件参数
        //取得一个随机速度
        let speed = cc.random0To1() * (this.SpeedUpperLimit - this.SpeedLowerLimit) + this.SpeedLowerLimit;
        //取得一个随机入射角度
        let angle = cc.random0To1() * (this.AngleUpperLimit - this.AngleLowerLimit) + this.AngleLowerLimit;
        //取得一个随机飞行轨迹
        let trajectory = parseInt((cc.random0To1() * (lib.defConfig.Flightpath.back + 1)).toString());
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
        if(trajectory == lib.defConfig.Flightpath.curve)
        {
            if(angle < 0)
            {
                angle = -angle;
            }
        }
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
        //赋值父节点
        shape.parent = this.shapeParNode;
    }
}

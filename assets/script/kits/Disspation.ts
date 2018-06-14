/** 用于控制形状的消散 */
import * as lib from '../lib/lib'
import FlyingShape from './FlyingShape'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Dissipation extends cc.Component {
    //----- 编辑器属性 -----//
    /** 默认消散类型 */
    @property({tooltip:"消散类型",  type: lib.defConfig.dissipate }) type = lib.defConfig.dissipate.none;
    /** 默认消散类型 */
    @property({tooltip:"是否可以连续反弹",  type: cc.Boolean }) ContinueRebound: boolean = true;
    /** 默认最小消散距离 */
    @property({tooltip:"最小消散距离",  type: cc.Integer }) MiniDissDistance: number = 500;
    //----- 属性声明 -----//
    //飞行轨迹控制器
    private flyControl: FlyingShape = null;
    //是否进入屏幕
    private haveAdmission: boolean = false;
    //是否离开屏幕
    private haveLeave: boolean = false;
    //刚刚触发过反弹的标识符（防止物体在放大时，正好进入触发反弹判断，当物体放大速度大于物体远离边界速度，会再次触发反弹）
    private reboundFlag: boolean = false;
    //上次反弹触碰的边界
    private lastRebound: number = lib.defConfig.lastReboundPos.bottom;
 
    //----- 生命周期 -----//

    // onLoad () {}

    start () {
        this.flyControl = this.node.getComponent(FlyingShape);
    }

    update (dt) {
        //离开屏幕后进行销毁判断
        if(this.haveLeave)
        {
            if(this.node.position.x >= lib.defConfig.DesignPlayWidth/2 + this.node.width/2 * this.node.scaleX - this.flyControl.Speed * dt
            || this.node.position.x <= -lib.defConfig.DesignPlayWidth/2 - this.node.width/2 * this.node.scaleX + this.flyControl.Speed * dt
            || this.node.position.y >= lib.defConfig.DesignPlayHeight/2 + this.node.height/2 * this.node.scaleY - this.flyControl.Speed * dt
            || this.node.position.y <= -lib.defConfig.DesignPlayHeight/2 - this.node.height/2 * this.node.scaleY + this.flyControl.Speed * dt)
            {
                this.node.destroy();
            }
            return;
        }
        //判断是否进入屏幕
        if(!this.haveAdmission)
        {
            if(this.node.position.x <= lib.defConfig.DesignPlayWidth/2 - this.node.width/2 * this.node.scaleX
            && this.node.position.x >= -lib.defConfig.DesignPlayWidth/2 + this.node.width/2 * this.node.scaleX
            && this.node.position.y <= lib.defConfig.DesignPlayHeight/2 - this.node.height/2 * this.node.scaleY
            && this.node.position.y >= -lib.defConfig.DesignPlayHeight/2 + this.node.height/2 * this.node.scaleY)
            {
                this.haveAdmission = true;
            } 
        }
        //判断是否接触到屏幕边界
        else
        {
            // if(this.node.position.x >= lib.defConfig.DesignPlayWidth/2 - this.node.width/2 * this.node.scaleX + this.flyControl.Speed * dt
            // || this.node.position.x <= -lib.defConfig.DesignPlayWidth/2 + this.node.width/2 * this.node.scaleX - this.flyControl.Speed * dt
            // || this.node.position.y >= lib.defConfig.DesignPlayHeight/2 - this.node.height/2 * this.node.scaleY + this.flyControl.Speed * dt
            // || this.node.position.y <= -lib.defConfig.DesignPlayHeight/2 + this.node.height/2 * this.node.scaleY - this.flyControl.Speed * dt)
            if(this.node.position.x >= lib.defConfig.DesignPlayWidth/2 - this.node.width/2 * this.node.scaleX
            || this.node.position.x <= -lib.defConfig.DesignPlayWidth/2 + this.node.width/2 * this.node.scaleX
            || this.node.position.y >= lib.defConfig.DesignPlayHeight/2 - this.node.height/2 * this.node.scaleY
            || this.node.position.y <= -lib.defConfig.DesignPlayHeight/2 + this.node.height/2 * this.node.scaleY)
            {
                if(this.flyControl.getsubMoveDis() < this.MiniDissDistance)
                {
                    this.rebounds(true);
                }
                else
                {
                    this.haveLeave = true;
                    this._destfun();
                }
            }
        }
        //判断反弹后是否离开边界
        //根据上次碰撞位置做判断
        if(this.reboundFlag)
        {
            switch(this.lastRebound)
            {
                case lib.defConfig.lastReboundPos.other:
                    if(this.node.position.x <= lib.defConfig.DesignPlayWidth/2 - this.node.width/2 * this.node.scaleX
                    && this.node.position.x >= -lib.defConfig.DesignPlayWidth/2 + this.node.width/2 * this.node.scaleX
                    && this.node.position.y <= lib.defConfig.DesignPlayHeight/2 - this.node.height/2 * this.node.scaleY
                    && this.node.position.y >= -lib.defConfig.DesignPlayHeight/2 + this.node.height/2 * this.node.scaleY)
                    {
                        this.reboundFlag = false;
                    } 
                    break;
                case lib.defConfig.lastReboundPos.top:
                    if(this.node.position.y <= lib.defConfig.DesignPlayHeight/2 - this.node.height/2 * this.node.scaleY)
                    {
                        this.reboundFlag = false;
                    } 
                    break;
                case lib.defConfig.lastReboundPos.bottom:
                    if(this.node.position.y >= -lib.defConfig.DesignPlayHeight/2 + this.node.height/2 * this.node.scaleY)
                    {
                        this.reboundFlag = false;
                    } 
                    break;
                case lib.defConfig.lastReboundPos.left:
                    if(this.node.position.x >= -lib.defConfig.DesignPlayWidth/2 + this.node.width/2 * this.node.scaleX)
                    {
                        this.reboundFlag = false;
                    } 
                    break;
                case lib.defConfig.lastReboundPos.right:
                    if(this.node.position.x <= lib.defConfig.DesignPlayWidth/2 - this.node.width/2 * this.node.scaleX)
                    {
                        this.reboundFlag = false;
                    } 
                    break;
                default:
                    break;
            }
        }
    }
    //----- 公有方法 -----//
    //获取是否进入屏幕
    getAdmission(){
        return this.haveAdmission;
    }
    //执行消散方法
    destroyAni(){
        this._destfun();
    }
    //获取是否已经消散
    getLeave(){
        return this.haveLeave;
    }
    //取得所有消散参数
    getparameter(){
        let disspationparameter: _kits.Disspation.parameters = {
            type: this.type,
        }
        return disspationparameter;
    }

    //设置所有消散参数
    setparameter(parameter: _kits.Disspation.parameters){
        this.type = parameter.type;
    }
    //----- 私有方法 -----//
    private _destfun(){
        switch(this.type)
        {
            case lib.defConfig.dissipate.none:
                break;
            case lib.defConfig.dissipate.fragmentation:
                break;
            case lib.defConfig.dissipate.integration:
                break;
            case lib.defConfig.dissipate.disappear:
                break;
            case lib.defConfig.dissipate.drop:
                this.dropdes();
                break;
            case lib.defConfig.dissipate.sticky:
                break;
            case lib.defConfig.dissipate.rebound:
                this.rebounds();
                break;
            case lib.defConfig.dissipate.decompose:
                break;
            default:
                break;
        }
    }

    private setdestroy(fun:_li.cb.norCallBack) {
        this._destfun = fun;
    }

    private dropdes(){
        //this.flyControl.drop();
        //this.type = lib.defConfig.dissipate.none;
    }

    //参数强行控制可以连续反弹
    private rebounds(once:boolean = false){
        if(this.reboundFlag)
        {
            //判断是否可以连续反弹
            if(this.ContinueRebound
            || once)
            {
                this.haveLeave = false;
            }
            return;
        }
        // console.log("右边边界 =" + (lib.defConfig.DesignPlayWidth/2 - this.node.width/2 * this.node.scaleX));
        // console.log("左边边界 =" + (-lib.defConfig.DesignPlayWidth/2 + this.node.width/2 * this.node.scaleX));
        // console.log("上边边界 =" + (lib.defConfig.DesignPlayHeight/2 - this.node.height/2 * this.node.scaleY));
        // console.log("下边边界 =" + (-lib.defConfig.DesignPlayHeight/2 + this.node.height/2 * this.node.scaleY));
        // console.log("自己坐标X = " + this.node.position.x + "  Y =" + this.node.position.y);
        //右边反弹
        if(this.node.position.x >= lib.defConfig.DesignPlayWidth/2 - this.node.width/2 * this.node.scaleX)
        {
            //右下角反弹
            if(this.node.position.y <= -lib.defConfig.DesignPlayHeight/2 + this.node.height/2 * this.node.scaleY)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            //右上角反弹
            else if(this.node.position.y >= lib.defConfig.DesignPlayHeight/2 - this.node.height/2 * this.node.scaleY)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            else
            {
                this.lastRebound = lib.defConfig.lastReboundPos.right;
                this.flyControl.setAngle(180 - this.flyControl.Angle);
            }
        }
        //左边反弹
        else if(this.node.position.x <= -lib.defConfig.DesignPlayWidth/2 + this.node.width/2 * this.node.scaleX)
        {
            //左下角反弹
            if(this.node.position.y <= -lib.defConfig.DesignPlayHeight/2 + this.node.height/2 * this.node.scaleY)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            //左上角反弹
            else if(this.node.position.y >= lib.defConfig.DesignPlayHeight/2 - this.node.height/2 * this.node.scaleY)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            else
            {
                this.lastRebound = lib.defConfig.lastReboundPos.left;
                this.flyControl.setAngle(180 - this.flyControl.Angle);
            }
        }
        //上边反弹
        else if(this.node.position.y >= lib.defConfig.DesignPlayHeight/2 - this.node.height/2 * this.node.scaleY)
        {
            //右上角反弹
            if(this.node.position.x >= lib.defConfig.DesignPlayWidth/2 - this.node.width/2 * this.node.scaleX)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            //左上角反弹
            else if(this.node.position.x <= -lib.defConfig.DesignPlayWidth/2 + this.node.width/2 * this.node.scaleX)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            else
            {
                this.lastRebound = lib.defConfig.lastReboundPos.top;
                this.flyControl.setAngle(-this.flyControl.Angle);
            }
        }
        //下边反弹
        else if(this.node.position.y <= -lib.defConfig.DesignPlayHeight/2 + this.node.height/2 * this.node.scaleY)
        {
            //右下角反弹
            if(this.node.position.x >= lib.defConfig.DesignPlayWidth/2 - this.node.width/2 * this.node.scaleX)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            //左下角反弹
            else if(this.node.position.x <= -lib.defConfig.DesignPlayWidth/2 + this.node.width/2 * this.node.scaleX)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            else
            {
                this.lastRebound = lib.defConfig.lastReboundPos.bottom;
                this.flyControl.setAngle(-this.flyControl.Angle);
            }
        }
        this.reboundFlag = true;
        //判断是否可以连续反弹
            if(this.ContinueRebound
                || once)
        {
            this.haveLeave = false;
        }
    }
}

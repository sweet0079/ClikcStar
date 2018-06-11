/** 用于控制形状的消散 */
import * as lib from '../lib/lib'
import FlyingShape from './FlyingShape'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Dissipation extends cc.Component {
    //----- 编辑器属性 -----//
    /** 默认消散类型 */
    @property({tooltip:"消散类型",  type: lib.defConfig.dissipate }) type = lib.defConfig.dissipate.none;
    //----- 属性声明 -----//
    //飞行轨迹控制器
    private flyControl: FlyingShape = null;
    //是否进入屏幕
    private haveAdmission: boolean = false;
    //是否离开屏幕
    private haveLeave: boolean = false;
    //刚刚触发过反弹的标识符（防止物体在放大时，正好进入触发反弹判断，当物体放大速度大于物体远离边界速度，会再次触发反弹）
    private reboundFlag: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.flyControl = this.node.getComponent(FlyingShape);
    }

    update (dt) {
        //离开屏幕后进行销毁判断
        if(this.haveLeave)
        {
            if(this.node.position.x >= cc.view.getDesignResolutionSize().width/2 + this.node.width/2 * this.node.scaleX - this.flyControl.Speed * dt
            || this.node.position.x <= -cc.view.getDesignResolutionSize().width/2 - this.node.width/2 * this.node.scaleX + this.flyControl.Speed * dt
            || this.node.position.y >= cc.view.getDesignResolutionSize().height/2 + this.node.height/2 * this.node.scaleY - this.flyControl.Speed * dt
            || this.node.position.y <= -cc.view.getDesignResolutionSize().height/2 - this.node.height/2 * this.node.scaleY + this.flyControl.Speed * dt)
            {
                this.node.destroy();
            }
            return;
        }
        //判断是否进入屏幕
        if(!this.haveAdmission)
        {
            if(this.node.position.x <= cc.view.getDesignResolutionSize().width/2 - this.node.width/2 * this.node.scaleX
            && this.node.position.x >= -cc.view.getDesignResolutionSize().width/2 + this.node.width/2 * this.node.scaleX
            && this.node.position.y <= cc.view.getDesignResolutionSize().height/2 - this.node.height/2 * this.node.scaleY
            && this.node.position.y >= -cc.view.getDesignResolutionSize().height/2 + this.node.height/2 * this.node.scaleY)
            {
                this.haveAdmission = true;
            } 
        }
        else
        {
            if(this.node.position.x >= cc.view.getDesignResolutionSize().width/2 - this.node.width/2 * this.node.scaleX + this.flyControl.Speed * dt
            || this.node.position.x <= -cc.view.getDesignResolutionSize().width/2 + this.node.width/2 * this.node.scaleX - this.flyControl.Speed * dt
            || this.node.position.y >= cc.view.getDesignResolutionSize().height/2 - this.node.height/2 * this.node.scaleY + this.flyControl.Speed * dt
            || this.node.position.y <= -cc.view.getDesignResolutionSize().height/2 + this.node.height/2 * this.node.scaleY - this.flyControl.Speed * dt)
            {
                this.haveLeave = true;
                this._destfun();
            }
        }
        if(this.reboundFlag)
        {
            if(this.node.position.x <= cc.view.getDesignResolutionSize().width/2 - this.node.width/2 * this.node.scaleX
            && this.node.position.x >= -cc.view.getDesignResolutionSize().width/2 + this.node.width/2 * this.node.scaleX
            && this.node.position.y <= cc.view.getDesignResolutionSize().height/2 - this.node.height/2 * this.node.scaleY
            && this.node.position.y >= -cc.view.getDesignResolutionSize().height/2 + this.node.height/2 * this.node.scaleY)
            {
                this.reboundFlag = false;
            } 
        }
    }
    //----- 公有方法 -----//
    getAdmission(){
        return this.haveAdmission;
    }
    destroyAni(){
        this._destfun;
    }
    getLeave(){
        return this.haveLeave;
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
        }
    }

    private setdestroy(fun:_li.cb.norCallBack) {
        this._destfun = fun;
    }

    private dropdes(){
        //this.flyControl.drop();
        //this.type = lib.defConfig.dissipate.none;
    }

    private rebounds(){
        console.log("this.reboundFlag = " + this.reboundFlag);
        if(this.reboundFlag)
        {
            this.haveLeave = false;
            return;
        }
        // if(this.node.position.x >= cc.view.getDesignResolutionSize().width/2 - this.node.width/2 * this.node.scaleX
        // || this.node.position.x <= -cc.view.getDesignResolutionSize().width/2 + this.node.width/2 * this.node.scaleX
        // || this.node.position.y >= cc.view.getDesignResolutionSize().height/2 - this.node.height/2 * this.node.scaleY
        // || this.node.position.y <= -cc.view.getDesignResolutionSize().height/2 + this.node.height/2 * this.node.scaleY)
        if(this.node.position.x >= cc.view.getDesignResolutionSize().width/2 - this.node.width/2 * this.node.scaleX)
        {
            this.flyControl.Angle = 180 - this.flyControl.Angle;
        }
        else if(this.node.position.x <= -cc.view.getDesignResolutionSize().width/2 + this.node.width/2 * this.node.scaleX)
        {
            this.flyControl.Angle = 180 - this.flyControl.Angle;
        }
        else if(this.node.position.y >= cc.view.getDesignResolutionSize().height/2 - this.node.height/2 * this.node.scaleY)
        {
            this.flyControl.Angle = -this.flyControl.Angle;
        }
        else if(this.node.position.y <= -cc.view.getDesignResolutionSize().height/2 + this.node.height/2 * this.node.scaleY)
        {
            this.flyControl.Angle = -this.flyControl.Angle;
        }
        this.reboundFlag = true;
        this.haveLeave = false;
    }
}

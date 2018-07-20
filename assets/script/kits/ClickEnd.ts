/** 挂在形状的背景节点，用于监听触摸结束 */
import * as lib from '../lib/lib'
import touchInstance from "./touchInstance"
import UIControl from './UIControl'

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClickEnd extends cc.Component {
    //----- 编辑器属性 -----//
    //滑动时的碰撞点
    @property(cc.Node) touchPoint: cc.Node = null;
    //点击的波纹预制体
    @property(cc.Prefab) clickPre: cc.Prefab = null;
    //UI控制组件
    @property(UIControl) UIcon: UIControl = null;
    //----- 属性声明 -----//
    //点击开始时间戳
    private time:number = 0;
    //点击开始时间戳
    private _touchInstance:touchInstance = null;
    //开始滑动
    private startMove:boolean = false;
    //----- 生命周期 -----//

    onLoad () {
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.EndMove,"_endMove",this);
        this._touchInstance = touchInstance.getinstance();
        this.node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            this._clickStart(event);
        },this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,(event:cc.Event.EventTouch)=>{
            this._clickMove(event);
        },this);
        this.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>{
            this._clickEnd();
        },this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL,(event:cc.Event.EventTouch)=>{
            this._clickEnd();
        },this);
    }

    // start () {

    // }

    // update (dt) {}

    onDestroy(){
    }
    
    //----- 私有方法 -----//
    // private _clickEnd(){
    // }
    private _endMove(){
        this.touchPoint.active = false;
        this.startMove = false;
    }

    private _clickStart(event:cc.Event.EventTouch){
        let touchx = event.getLocation().x - this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).x;
        let touchy = event.getLocation().y - this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).y;
        if(this._touchInstance.getCanMove())
        {
            if(this.startMove)
            {
                return;
            }
            this.startMove = true;
            this.touchPoint.setPosition(touchx,touchy);
            this.touchPoint.active = true;
        }
        else
        {
            lib.msgEvent.getinstance().emit(lib.msgConfig.Settlement);
            let clickAni = cc.instantiate(this.clickPre);
            clickAni.getComponent(cc.Animation).once('finished',()=>{
                clickAni.destroy();
            },this);
            clickAni.getComponent(cc.Animation).play();
            clickAni.setPosition(touchx,touchy);
            this.node.parent.addChild(clickAni);
        }
    }

    private _clickMove(event:cc.Event.EventTouch){
        if(this._touchInstance.getCanMove())
        {
            this.touchPoint.x += event.getDeltaX();
            this.touchPoint.y += event.getDeltaY();
        }
        else
        {
            let deltDis = Math.sqrt(Math.pow(event.getDeltaX(),2) + Math.pow(event.getDeltaY(),2));
            if(deltDis < 15)
            {
                console.log("小于10");
                return;
            }
            if(this.UIcon.getPowerIsFull())
            {
                this.UIcon.checkMove();
                if(this.startMove)
                {
                    return;
                }
                let touchx = event.getLocation().x - this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).x;
                let touchy = event.getLocation().y - this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).y;
                this.startMove = true;
                this.touchPoint.setPosition(touchx,touchy);
                this.touchPoint.active = true;
            }
        }
    }

    private _clickEnd(){
        if(this._touchInstance.getCanMove())
        {
            this.touchPoint.active = false;
            this.startMove = false;
        }
    }
}

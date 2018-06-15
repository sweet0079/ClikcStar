/** 用于控制形状的点击事件 */
import * as lib from '../lib/lib'
import FlyingShape from './FlyingShape'
import ClickEndControl from './ClickEnd'

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClickShape extends cc.Component {
    //----- 编辑器属性 -----//
    /** 默认高分区域边长 */
    @property({tooltip:"高分区域边长",  type: cc.Integer }) highScoreWidth:number = 10;

    //----- 属性声明 -----//
    //飞行轨迹控制器
    private flyControl: FlyingShape = null;
    //因为点击穿透和冒泡不能单独打开或关闭，导致点击2个以上形状是，触摸事件可能重复触发，因为加入点击锁（还是会重复触发）
    private clickLock: boolean = false;
    //----- 生命周期 -----//

    onLoad () {
        this.flyControl = this.node.getComponent(FlyingShape);
        //因为点击穿透和冒泡不能单独打开或关闭，导致点击2个以上形状是，触摸事件可能重复触发，因为使用once监听（还是会重复触发）
        this.flyControl.ShowNode.once(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            this.ClickSatr(event);
        });
        // this.node.on('rotation-changed', this._onNodeRotationChanged, this);
        // this.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>{

        // },this);

        // this.node.on(cc.Node.EventType.TOUCH_CANCEL,(event:cc.Event.EventTouch)=>{

        // },this);
    }

    //  start() {}

    // update (dt) {}
    onEnable(){
        // this.flyControl.ShowNode.off(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
        //     this.ClickSatr(event);
        // });
    }
    // onDestroy(){
    //     this.flyControl.ShowNode.off(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
    //         this.ClickSatr(event);
    //     });
    //     // this.node.off('rotation-changed', this._onNodeRotationChanged, this);
    //     // this.node.off(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>{

    //     // },this);

    //     // this.node.off(cc.Node.EventType.TOUCH_CANCEL,(event:cc.Event.EventTouch)=>{

    //     // },this);
    // }
    
    //----- 私有方法 -----//
    // private _onNodeRotationChanged(){
    //     // this.node.getComponent(cc.MotionStreak)._motionStreak.rotation = -this.node.rotation;
    //     // this.node.getComponent(cc.MotionStreak)._root.position = new cc.Vec2(0,0);
    // }

    private ClickSatr(event:cc.Event.EventTouch){
        //event.stopPropagation();吞没事件不向上冒泡，也不进行穿透
        //将触摸坐标转化为以node中心为原点的坐标
        if(this.clickLock)
        {
            return;
        }
        let touchx = event.getLocation().x - this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).x;
        let touchy = event.getLocation().y - this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).y;
        // console.log("getLocationx = " + event.getLocation().x + "  getLocationy = " + event.getLocation().y);
        // console.log("this.node.x = " + this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).x + "  this.node.y = " + this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).y);
        // console.log("x = " + touchx + "  y =" + touchy);
        if(Math.abs(touchx) < this.highScoreWidth * this.node.scaleX 
        && Math.abs(touchy) < this.highScoreWidth * this.node.scaleY)
        {
            console.log("high score");
            let score: number = 100;
            let click:_kits.ClickControl.click = {
                score: score,
                node: this.node,
            }
            lib.msgEvent.getinstance().emit(lib.msgConfig.clickStart,click);
        }
        else
        {
            console.log("low score");
            let score: number = 50;
            let click:_kits.ClickControl.click = {
                score: score,
                node: this.node,
            }
            lib.msgEvent.getinstance().emit(lib.msgConfig.clickStart,click);
        }
        this.clickLock = true;
        this.node.destroy();
        console.log("x = " + this.node.getPositionX() + "  Y = " + this.node.getPositionY());
    }
}

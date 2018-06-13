/** 用于控制形状的点击事件 */
import * as lib from '../lib/lib'
import ClickEndControl from './ClickEnd'

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClickShape extends cc.Component {
    //----- 编辑器属性 -----//
    /** 默认高分区域边长 */
    @property({tooltip:"高分区域边长",  type: cc.Integer }) highScoreWidth:number = 10;
    //----- 生命周期 -----//

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            this.ClickSatr(event);
        },this);

        this.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>{

        },this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL,(event:cc.Event.EventTouch)=>{

        },this);
    }

    //  start() {}

    // update (dt) {}

    onDestroy(){
        this.node.off(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            this.ClickSatr(event);
        },this);

        this.node.off(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>{

        },this);

        this.node.off(cc.Node.EventType.TOUCH_CANCEL,(event:cc.Event.EventTouch)=>{

        },this);
    }
    
    //----- 私有方法 -----//
    private ClickSatr(event:cc.Event.EventTouch){
        //event.stopPropagation();
        //将触摸坐标转化为以node中心为原点的坐标
        let touchx = event.getLocation().x - this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).x;
        let touchy = event.getLocation().y - this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).y;
        // console.log("getLocationx = " + event.getLocation().x + "  getLocationy = " + event.getLocation().y);
        // console.log("this.node.x = " + this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).x + "  this.node.y = " + this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).y);
        // console.log("x = " + touchx + "  y =" + touchy);
        if(Math.abs(touchx) < this.highScoreWidth 
        && Math.abs(touchy) < this.highScoreWidth)
        {
            console.log("high score");
            let score: number = 100;
            lib.msgEvent.getinstance().emit(lib.msgConfig.clickStart,score);
        }
        else
        {
            console.log("low score");
            let score: number = 50;
            lib.msgEvent.getinstance().emit(lib.msgConfig.clickStart,score);
        }
        this.node.destroy();
    }
}

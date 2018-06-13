/** 挂在形状的父节点，用于监听触摸结束 */
import * as lib from '../lib/lib'

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClickEnd extends cc.Component {

    //----- 属性声明 -----//
    //点击开始时间戳
    time:number = 0;
    //----- 生命周期 -----//

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            this._clickStart();
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
    
    //----- 私有方法 -----//
    private _clickEnd(){
        lib.msgEvent.getinstance().emit(lib.msgConfig.Settlement);
    }
    private _clickStart(){
        this.time = new Date().getTime();
    }

    
}

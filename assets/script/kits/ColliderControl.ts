/** 用于控制形状的碰撞事件 */
import * as lib from '../lib/lib'
import ShapeControl from './ShapeControl'
import ShapeManager from './ShapeManager'

const {ccclass, property} = cc._decorator;

@ccclass
export default class ColliderControl extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.getComponent(cc.CircleCollider).radius = (this.node.width + this.node.height) / 4;
    }

    // update (dt) {}

    onCollisionEnter(other, self)
    {
        lib.msgEvent.getinstance().emit(lib.msgConfig.clickStart,100);
        ShapeManager.getinstance().delShape(this.node);
        this.node.parent.getComponent(ShapeControl).destroyAni();
        lib.msgEvent.getinstance().emit(lib.msgConfig.Settlement);
    }
}

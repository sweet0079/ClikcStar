/** 满能量触发特效控制 */

import ShapeManager from './ShapeManager'

const {ccclass, property} = cc._decorator;

@ccclass
export default class PowerFullControl extends cc.Component {

    //----- 编辑器属性 -----//
    //----- 属性声明 -----//
    //----- 生命周期 -----//

    // onLoad () {}

    //start () {}

    // update (dt) {}

    //onDestroy(){}

    //----- 按钮回调 -----//
    //----- 事件回调 -----//
    //----- 公有方法 -----//
    CreateSpecial(){
        this.CleanAll();
    }
    //----- 私有方法 -----//
    private CleanAll(){
        ShapeManager.getinstance().desNormalShape();
    }
}

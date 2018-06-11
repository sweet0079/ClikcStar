/** 用于控制形状的消散 */
import * as lib from '../lib/lib'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Dissipation extends cc.Component {
    //----- 编辑器属性 -----//
    /** 默认消散类型 */
    @property({tooltip:"消散类型",  type: lib.defConfig.dissipate }) type = lib.defConfig.dissipate.decompose;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
    //----- 公有方法 -----//
    destroyAni(){
        this._destroy;
    }
    //----- 私有方法 -----//
    private _destroy(){
        
    }

    private setdestroy(fun:_li.cb.norCallBack) {
        this._destroy = fun;
    }

    private dropdes(){
    }
}

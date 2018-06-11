/** 用于控制形状的消散 */
import * as lib from '../lib/lib'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Dissipation extends cc.Component {
    //----- 编辑器属性 -----//
    /** 默认消散类型 */
    @property({tooltip:"消散类型",  type: lib.defConfig.dissipate }) type = lib.defConfig.dissipate.drop;
    //----- 属性声明 -----//
    private haveAdmission: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt) {
        if(!this.haveAdmission)
        {
            if(this.node.position.x <= cc.view.getVisibleSize().width/2
            && this.node.position.x >= -cc.view.getVisibleSize().width/2
            && this.node.position.y <= cc.view.getVisibleSize().height/2
            && this.node.position.y >= -cc.view.getVisibleSize().height/2)
            {
                this.haveAdmission = true;
            }
        }
        else
        {

        }
    }
    //----- 公有方法 -----//
    getAdmission(){
        return this.haveAdmission;
    }
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

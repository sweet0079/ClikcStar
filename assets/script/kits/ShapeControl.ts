/** 用于控制形状的特性 */
import * as lib from '../lib/lib'
import FlyingShape from './FlyingShape'
import characteristic from './Characteristic'
import ShapeManager from './ShapeManager'

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShapeControl extends cc.Component {
    //----- 编辑器属性 -----//
    /** 默认形状 */
    @property({tooltip:"形状",  type: lib.defConfig.shape }) type = lib.defConfig.shape.triangle;
    /** 外形素材数组 */
    @property({tooltip:"外形素材数组", type: [cc.SpriteFrame] }) SpriteFrameArr:Array<cc.SpriteFrame> = [];
    

    //----- 属性声明 -----//
    //飞行轨迹控制器
    private flyControl: FlyingShape = null;
    //已滞留时间
    private haveDetained: number = 0;
    //颜色
    private color: number = 0;
    //----- 生命周期 -----//

    // onLoad () {}

    start () {
        this.flyControl = this.node.getComponent(FlyingShape);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ReStart,"reStart",this);
        //this.setShape(2);
    }

    // update (dt) {}

    onDestroy(){
        ShapeManager.getinstance().delShape(this.node);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ReStart,"reStart",this);
    }
    //----- 公有方法 -----//
    destroyAni(){
        this.stopMoveAndAct();
        this.flyControl.ShowNode.getComponent(cc.Animation).once('finished',()=>{
            this.node.destroy();
        },this);
        this.flyControl.ShowNode.getComponent(cc.Animation).play();
    }

    randomcolor(){
        let temp = parseInt((cc.random0To1() * lib.defConfig.ColorNum).toString());
        this.color = temp;
    }

    setcolor(num:number){
        this.color = num;
    }

    gettype(){
        return [this.type,this.color];
    }

    randomShape(){
        let temp = parseInt((cc.random0To1() * (lib.defConfig.shape.length)).toString());
        this.type = temp;
        this.setShape(this.type);
    }

    setShape(type:number){
        this.flyControl = this.node.getComponent(FlyingShape);
        let calNode = this.flyControl.ShowNode;
        this.type = type;
        calNode.getComponent(cc.Sprite).spriteFrame = this.SpriteFrameArr[this.type * lib.defConfig.ColorNum + this.color];
        //根据不同形状赋予不同的点击判定方法
        if(this.type == lib.defConfig.shape.triangle)
        {
            // this.setClickJudgeFun((x,y) => {
            //     return this._trianglegetIsClickShape(x,y);
            // });
            this.setClickJudgeFun(this._trianglegetIsClickShape);
        }
        else if(this.type == lib.defConfig.shape.diamond)
        {
            this.setClickJudgeFun(this._diamondgetIsClickShape);
        }
        else if(this.type == lib.defConfig.shape.circular
        || this.type == lib.defConfig.shape.ellipse)
        {
            // this.setClickJudgeFun((x,y) => {
            //     return this._circulargetIsClickShape(x,y);
            // });
            this.setClickJudgeFun(this._circulargetIsClickShape);
        }
    }

    // 设置点击判断方法
    setClickJudgeFun(func: (x:number,y:number) => boolean) {
        this._IsClickShape = func;
    }
    // 重置点击判断方法
    resetClickJudgeFun() {
        this._IsClickShape = (x:number,y:number) => {
            return this._IsClickShape(x,y);
        }
    }
    //获取点击是否在形状内
    getIsClickShape(x:number,y:number){
        return this._IsClickShape(x,y);
    }
    //----- 私有方法 -----//
    private stopMoveAndAct(){
        this.flyControl.stopMove();
        this.node.getComponent(characteristic).stopAct();
    }

    private reStart(){
        this.node.destroy();
    }

    private _IsClickShape(x:number,y:number){
        return this._DefauleIsClickShape(x,y);
    }

    private _DefauleIsClickShape(x:number,y:number){
        return true;
    }
    //判断三角形时点击是否落于三角形内
    private _trianglegetIsClickShape(x:number,y:number)
    {
        let calNode = this.flyControl.ShowNode;
        let temp: number = 0;
        let result: boolean = false;
        let dis = Math.sqrt((x * x + y * y));
        let touAngle = Math.asin(y / dis);
        if(x < 0)
        {
            touAngle = 180 * lib.defConfig.coefficient - touAngle;
        }
        let nowAngle = touAngle + this.node.rotation * lib.defConfig.coefficient; 
        let nowx = dis * Math.cos(nowAngle);
        let nowy = dis * Math.sin(nowAngle);
        if(nowx < 0){
            temp = (2 * calNode.height * Math.abs(calNode.scaleY) / calNode.width * Math.abs(calNode.scaleX)) * nowx + calNode.height * Math.abs(calNode.scaleY) / 2;
            if(nowy < temp)
            {
                result = true;
            }
        }
        else
        {
            temp = (-2 * calNode.height * Math.abs(calNode.scaleY) / calNode.width * Math.abs(calNode.scaleX)) * nowx + calNode.height * Math.abs(calNode.scaleY) / 2;
            if(nowy < temp)
            {
                result = true;
            }
        }
        return result;
    }

    //判断圆形时点击是否落于圆形内
    private _circulargetIsClickShape(x:number,y:number){
        let calNode = this.flyControl.ShowNode;
        let dis = Math.sqrt((x * x + y * y));
        if(dis < calNode.width * Math.abs(calNode.scaleX) / 2
        ||dis < calNode.height * Math.abs(calNode.scaleY) / 2)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    //判断菱形时点击是否落于菱形内
    private _diamondgetIsClickShape(x:number,y:number){
        let calNode = this.flyControl.ShowNode;
        let temp: number = 0;
        let result: boolean = false;
        if(x < 0 && y < 0)
        {
            temp = (-1 * calNode.height * Math.abs(calNode.scaleY) / calNode.width * Math.abs(calNode.scaleX)) * x - calNode.height * Math.abs(calNode.scaleY) / 2;
            if(y > temp)
            {
                result = true;
            }
        }
        else if(x < 0 && y > 0)
        {
            temp = (calNode.height * Math.abs(calNode.scaleY) / calNode.width * Math.abs(calNode.scaleX)) * x + calNode.height * Math.abs(calNode.scaleY) / 2;
            if(y < temp)
            {
                result = true;
            }
        }
        else if(x > 0 && y > 0)
        {
            temp = (-1 * calNode.height * Math.abs(calNode.scaleY) / calNode.width * Math.abs(calNode.scaleX)) * x + calNode.height * Math.abs(calNode.scaleY) / 2;
            if(y < temp)
            {
                result = true;
            }
        }
        else if(x > 0 && y < 0)
        {
            temp = (calNode.height * Math.abs(calNode.scaleY) / calNode.width * Math.abs(calNode.scaleX)) * x - calNode.height * Math.abs(calNode.scaleY) / 2;
            if(y > temp)
            {
                result = true;
            }
        }
        else
        {
            result = true;
        }
        return result;
    }
}
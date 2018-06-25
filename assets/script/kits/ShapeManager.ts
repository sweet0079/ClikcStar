/** 形状管理器脚本 */
export default class ShapeManager {
    static instance: ShapeManager
    /** 获取单例 */
    static getinstance() {
        if (ShapeManager.instance) return ShapeManager.instance;
        else return new ShapeManager();
    }
    /** 返回一个新的单例 */
    static newinstance() {
        return new ShapeManager();
    }

    private constructor() {
        this.shapeArr = [];
        ShapeManager.instance = this;
    }

    private shapeArr: Array<cc.Node>;

    getNum(){
        return this.shapeArr.length;
    }

    addShape(shape:cc.Node){
        this.shapeArr.push(shape);
        console.log("add");
    }

    delShape(shape:cc.Node){
        let index = this.shapeArr.indexOf(shape);
        console.log("del");
        if (index > -1) {
            this.shapeArr.splice(index, 1);
        }
        console.log(this.shapeArr);
    }

    clean(){
        this.shapeArr = [];
    }
}
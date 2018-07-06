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
        this.specialArr = [];
        ShapeManager.instance = this;
    }

    private shapeArr: Array<cc.Node>;
    private specialArr: Array<cc.Node>;

    getNum(){
        return this.shapeArr.length;
    }

    getSpecialNum(){
        return this.specialArr.length;
    }

    addSpecial(special:cc.Node){
        this.specialArr.push(special);
        console.log("addspecial");
    }
    
    addShape(shape:cc.Node){
        this.shapeArr.push(shape);
        console.log("add");
    }

    delShape(shape:cc.Node){
        let index = this.shapeArr.indexOf(shape);
        if (index > -1) {
            console.log("del");
            this.shapeArr.splice(index, 1);
            console.log(this.shapeArr);
        }
        else
        {
            index = this.specialArr.indexOf(shape);
            if (index > -1) {
                console.log("delspecial");
                this.specialArr.splice(index, 1);
                console.log(this.specialArr);
            }
        }
    }

    clean(){
        this.shapeArr = [];
        this.specialArr = [];
    }
}
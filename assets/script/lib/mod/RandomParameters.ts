import * as defConfig from '../cfg/defConfig'

/** 一个生成随机形状组件参数的类 */
export const RandomParameters = {
    getRandomChaParameters(){
        let type: number = parseInt((cc.random0To1() * (defConfig.character.length)).toString());
        return type;
    },

    getRandomDisParameters(){
        let dispare: _kits.Disspation.parameters ={
            type: parseInt((cc.random0To1() * (defConfig.dissipate.length)).toString()),
        }
        return dispare;
    },

    getRandomShaParameters(){
        let shapare: _kits.ShapeControl.parameters ={
            type: parseInt((cc.random0To1() * (defConfig.shape.length)).toString()),
            color: parseInt((cc.random0To1() * (defConfig.ColorNum)).toString()),
        }
        return shapare;
    },

    getRandomBool(){
        //console.log(cc.random0To1() * 2);
        let temp = parseInt((cc.random0To1() * 2).toString());
        //console.log(temp);
        if(temp == 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    },

    //返回对称点
    getSymmetricPoint(point){
        let result = 0;
        switch(point)
        {
            case 0:
                result = 10;
                break;
            case 1:
                result = 13;
                break;
            case 2:
                result = 12;
                break;
            case 3:
                result = 11;
                break;
            case 4:
                result = 14;
                break;
            case 5:
                result = 19;
                break;
            case 6:
                result = 18;
                break;
            case 7:
                result = 17;
                break;
            case 8:
                result = 16;
                break;
            case 9:
                result = 15;
                break;
            case 10:
                result = 0;
                break;
            case 11:
                result = 3;
                break;
            case 12:
                result = 2;
                break;
            case 13:
                result = 1;
                break;
            case 14:
                result = 4;
                break;
            case 15:
                result = 9;
                break;
            case 16:
                result = 8;
                break;
            case 17:
                result = 7;
                break;
            case 18:
                result = 6;
                break;
            case 19:
                result = 5;
                break;
            default:
                break;
        }
        return result;
    }
}
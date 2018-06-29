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
        console.log(cc.random0To1() * 2);
        let temp = parseInt((cc.random0To1() * 2).toString());
        console.log(temp);
        if(temp == 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    }
}
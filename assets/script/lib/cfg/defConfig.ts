/** 飞行轨迹枚举 */
export const Flightpath = cc.Enum({
    // 长直线
    straight: -1,
    // 长曲线
    curve: -1,
    // 螺旋
    screw: -1,
    // 转向
    turn: -1,
    // 回退,
    back: -1
});
/** 出生点位置枚举 */
export const birthpoint = cc.Enum({
    // 左
    left: -1,
    // 左上角
    lefttop: -1,
    // 上
    top: -1,
    // 右上角上
    righttop: -1,
    // 右
    right: -1,
    // 右下角
    rightbottom: -1,
    // 下
    bottom: -1,
    // 左下角
    leftbottom: -1,
});
/** 碰撞边界枚举 */
export const lastReboundPos = cc.Enum({    
    // 其他（无或者4个角）
    other: -1,
    // 左
    left: -1,
    // 上
    top: -1,
    // 右
    right: -1,
    // 下
    bottom: -1,
});
/** 形状出生位置枚举 */
export const shapebirthpos = cc.Enum({
    // 左
    left: -1,
    // 上
    top: -1,
    // 右
    right: -1,
    // 下
    bottom: -1,
});
/** 形状特性枚举 */
export const character = cc.Enum({
    // 无
    none: -1,
    // 大小变化
    scale: -1,
    // 速度变化
    speed: -1,
    // 分裂
    division: -1,
    // 旋转
    rotate: -1,
    // // 翻转
    // flipping: -1,
    // 渐隐
    fadeout: -1,
    // 闪烁
    blink: -1,
});
/** 形状特性枚举 */
export const dissipate = cc.Enum({    
    // 无
    none: -1,
    // 碎裂
    fragmentation: -1,
    // 融入
    integration: -1,
    // 消失
    disappear: -1,
    // 掉落
    drop: -1,
    // 黏滞
    sticky: -1,
    // 反弹
    rebound: -1,
    // 分解
    decompose: -1,
});
/** 形状外形枚举 */
export const shape = cc.Enum({
    // 三角形
    triangle: 3,
    // 五角星
    star: 9,
    // 圆形
    circular: 2,
    // 平行四边形
    parallelogram: 8,
    // 方形
    square: 1,
    // 梯形
    trapezoid: 6,
    // 椭圆
    ellipse: 7,
    // 菱形
    diamond: 5,
    // 长方形
    rectangle: 4,
});
//设计时中间用于点击区域的宽
export const DesignPlayWidth = 1080;
//设计时中间用于点击区域的高
export const DesignPlayHeight = 1720;
//角度和弧度的转化系数
export const coefficient = 2 * Math.PI / 360;
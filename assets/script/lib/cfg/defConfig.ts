/** 飞行轨迹枚举 */
export const Flightpath = cc.Enum({
    // 长直线
    straight: -1,
    // // 长曲线
    // curve: -1,
    // // 螺旋
    // screw: -1,
    // // 转向
    // turn: -1,
    // // 回退,
    // back: -1
    // 枚举的长度
    length: -1,
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
    // // 闪烁
    // blink: -1,
    // 枚举的长度
    length: -1,
});
/** 形状特性枚举 */
export const dissipate = cc.Enum({    
    
    none: -1,// 无
    
    fragmentation: -1,// 碎裂
    
    integration: -1,// 融入
    
    disappear: -1,// 消失
    
    drop: -1,// 掉落

    sticky: -1,// 黏滞
    
    rebound: -1,// 反弹
    
    decompose: -1,// 分解
    
    length: -1,// 枚举的长度
});
/** 形状外形枚举 */
export const shape = cc.Enum({
    // 三角形
    triangle: 2,
    // 五角星
    star: 6,
    // 圆形
    circular: 1,
    // 平行四边形
    parallelogram: 8,
    // 方形
    square: 0,
    // 梯形
    trapezoid: 4,
    // // 椭圆
    // ellipse: 6,
    // 菱形
    diamond: 3,
    // // 长方形
    // rectangle: 3,
    // // 半月
    // halfmoon: 9,
    // 十字形
    cross: 7,
    // 六边形
    Hexagon: 5,
    // 枚举的长度
    length: 9,
});
/** 套路大类型枚举 */
export const Tricks = cc.Enum({
    //齐射
    volley: -1,
    //对称
    symmetry: -1,
    //联合
    union: -1,
    //有序
    order: -1,
    //飞瀑
    Waterfall: -1,
    //集中
    focus: -1,
    //集中分裂
    focusDiv: -1,
    //交叉
    across: -1,
    //闪烁
    blink: -1,
    //传送
    transform: -1,
    //绝对反弹
    AbsoluteReb: -1,
    //阶梯
    ladder: -1,
    // 枚举的长度
    length: -1,
});
//套路开始前warning持续时间
export const WarningTime = 3;
//套路结束后持续时间
export const WeaveEndTime = 3;
//每个形状有几种颜色
export const ColorNum = 1;
//每个形状有几种消散特效
export const DissAniNum = 1;
//设计时中间用于点击区域的宽
export const DesignPlayWidth = 1080;
//设计时中间用于点击区域的高
export const DesignPlayHeight = 1620;
//HP上限
export const MAXHP = 6;
//power上限
export const MAXPOWER = 500;
//time上限
export const MAXTIME = 7;
//角度和弧度的转化系数
export const coefficient = 2 * Math.PI / 360;
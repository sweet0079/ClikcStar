/** kits的接口库 */
declare namespace _kits {}
declare namespace _kits.FlyingShape {
    //----- msgEvent -----//
    interface parameters {
        Flightpath: number,
        birthpos: number,
        Speed: number,
        Angle: number,
        deltangle: number,
        screwspeed: number,
        screwAngleSpeed: number,
        TurnThreshold: number,
        TurnAngle: number,
    }
}
declare namespace _kits.Disspation {
    //----- msgEvent -----//
    interface parameters {
        type: number,
    }
}
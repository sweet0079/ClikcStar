/** kits的接口库 */
declare namespace _kits {}
declare namespace _kits.FlyingShape {
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
    interface parameters {
        type: number,
    }
}
declare namespace _kits.ClickControl {
    interface click {
        score: number,
        node: any,
    }
}
export class Vec2 {
    static Create(x: number = 0, y: number = 0): Vec2 {
        return new Vec2(x, y);
    }
    
    public x: number;
    public y: number;

    public constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public static add(v1: Vec2, v2: Vec2): Vec2 {
        return new Vec2(v1.x + v2.x, v1.y + v2.y);
    }

    public static sub(v1: Vec2, v2: Vec2): Vec2 {
        return new Vec2(v1.x - v2.x, v1.y - v2.y);
    }

    public static mul(v1: Vec2, v2: Vec2): Vec2 {
        return new Vec2(v1.x * v2.x, v1.y * v2.y);
    }

    public static div(v1: Vec2, v2: Vec2): Vec2 {
        return new Vec2(v1.x / v2.x, v1.y / v2.y);
    }

    public static scale(v: Vec2, s: number): Vec2 {
        return new Vec2(v.x * s, v.y * s);
    }

    public static dot(v1: Vec2, v2: Vec2): number {
        return v1.x * v2.x + v1.y * v2.y;
    }

    public static cross(v1: Vec2, v2: Vec2): number {
        return v1.x * v2.y - v1.y * v2.x;
    }

    public static normalize(v: Vec2): Vec2 {
        let n = Math.sqrt(v.x * v.x + v.y * v.y);
        return new Vec2(v.x / n, v.y / n);
    }


    public static distance(v1: Vec2, v2: Vec2): number {
        let dx = v1.x - v2.x;
        let dy = v1.y - v2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public static distanceSq(v1: Vec2, v2: Vec2): number {
        let dx = v1.x - v2.x;
        let dy = v1.y - v2.y;
        return dx * dx + dy * dy;
    }

    public static angle(v1: Vec2, v2: Vec2): number {
        return Math.atan2(v2.y - v1.y, v2.x - v1.x);
    }

    public static angleDeg(v1: Vec2, v2: Vec2): number {
        return Math.atan2(v2.y - v1.y, v2.x - v1.x) * 180 / Math.PI;
    }

    public static rotate(v: Vec2, angle: number): Vec2 {
        let ca = Math.cos(angle);
        let sa = Math.sin(angle);
        return new Vec2(v.x * ca - v.y * sa, v.x * sa + v.y * ca);
    }

    public static rotateDeg(v: Vec2, angle: number): Vec2 {
        let ca = Math.cos(angle * Math.PI / 180);
        let sa = Math.sin(angle * Math.PI / 180);
        return new Vec2(v.x * ca - v.y * sa, v.x * sa + v.y * ca);
    }

    public static lerp(v1: Vec2, v2: Vec2, t: number): Vec2 {
        return new Vec2(v1.x + (v2.x - v1.x) * t, v1.y + (v2.y - v1.y) * t);
    }

    public static clamp(v: Vec2, min: Vec2, max: Vec2): Vec2 {
        return new Vec2(Math.min(Math.max(v.x, min.x), max.x), Math.min(Math.max(v.y, min.y), max.y));
    }

    public static min(v1: Vec2, v2: Vec2): Vec2 {
        return new Vec2(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y));
    }

    public static max(v1: Vec2, v2: Vec2): Vec2 {
        return new Vec2(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y));
    }
}
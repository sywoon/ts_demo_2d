export class Rect {
    static temp: Rect = new Rect();
    
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height
    }

    set(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height
    }

    clone() {
        return new Rect(this.x, this.y, this.width, this.height)
    }

    toString() {
        return `Rect(x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height})`
    }

    static fromObject(obj: any) {
        return new Rect(obj.x, obj.y, obj.width, obj.height)
    }

    static fromPoints(x1: number, y1: number, x2: number, y2: number) {
        return new Rect(x1, y1, x2 - x1, y2 - y1)
    }

    static fromSize(width: number, height: number) {
        return new Rect(0, 0, width, height)
    }

    static fromRect(rect: Rect) {
        return new Rect(rect.x, rect.y, rect.width, rect.height)
    }
}
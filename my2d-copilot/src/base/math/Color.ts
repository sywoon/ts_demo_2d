export class Color {
    static Black: Color = new Color(0, 0, 0, 1);
    static White: Color = new Color(1, 1, 1, 1);
    static Red: Color = new Color(1, 0, 0, 1);
    static Green: Color = new Color(0, 1, 0, 1);
    static Blue: Color = new Color(0, 0, 1, 1);
    static Yellow: Color = new Color(1, 1, 0, 1);
    static Gray: Color = new Color(0.5, 0.5, 0.5, 1);

    static Create(r: number = 0, g: number = 0, b: number = 0, a: number = 1): Color {
        return new Color(r, g, b, a);
    }

    r: number = 0;
    g: number = 0;
    b: number = 0;
    a: number = 1;

    //基于0-1
    public constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public static fromHex(hex: number, alpha: number = 1): Color {
        let r = (hex >> 16) & 0xFF;
        let g = (hex >> 8) & 0xFF;
        let b = hex & 0xFF;
        return new Color(r / 255, g / 255, b / 255, alpha);
    }

    public static fromRGB(r: number, g: number, b: number, a: number = 1): Color {
        return new Color(r / 255, g / 255, b / 255, a);
    }

    public static fromRGBA(r: number, g: number, b: number, a: number): Color {
        return new Color(r / 255, g / 255, b / 255, a / 255);
    }

    public static fromString(str: string): Color {
        let color = new Color();
        color.fromString(str);
        return color;
    }

    //#ffffff or #ffffffff
    public fromString(str: string): void {
        if (str.charAt(0) != "#") {
            console.error("Color.fromString error: str must start with #", str);
            return;
        }

        if (str.length == 7) {
            this.r = parseInt(str.substr(1, 2), 16) / 255;
            this.g = parseInt(str.substr(3, 2), 16) / 255;
            this.b = parseInt(str.substr(5, 2), 16) / 255;
            this.a = 1;
        } else if (str.length == 9) {
            this.r = parseInt(str.substr(1, 2), 16) / 255;
            this.g = parseInt(str.substr(3, 2), 16) / 255;
            this.b = parseInt(str.substr(5, 2), 16) / 255;
            this.a = parseInt(str.substr(7, 2), 16) / 255;
        } else {
            console.error("Color.fromString error: str length must be 7 or 9", str);
        }
    }

    public toRGB(): number {
        let r = this.r * 255;
        let g = this.g * 255;
        let b = this.b * 255;
        return (r << 16) | (g << 8) | b;
    }

    public toRGBA(): number {
        let r = this.r * 255;
        let g = this.g * 255;
        let b = this.b * 255;
        let a = this.a * 255;
        return (r << 24) | (g << 16) | (b << 8) | a;
    }

    public toString(): string {
        let r = this.r * 255;
        let g = this.g * 255;
        let b = this.b * 255;
        let a = this.a * 255;
        return "#" + r.toString(16) + g.toString(16) + b.toString(16) + a.toString(16);
    }

    public clone(): Color {
        return new Color(this.r, this.g, this.b, this.a);
    }

    public copyFrom(color: Color): void {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
    }

    public toCssColor(): string {
        let r = Math.floor(this.r * 255);
        let g = Math.floor(this.g * 255);
        let b = Math.floor(this.b * 255);
        let a = this.a;
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
}
export class Color {
    static Black: Color = new Color(0, 0, 0, 1);
    static Gray: Color = new Color(0.5, 0.5, 0.5, 1);
    static Silver: Color = new Color(0.75, 0.75, 0.75, 1);
    static White: Color = new Color(1, 1, 1, 1);
    static Red: Color = new Color(1, 0, 0, 1);
    static Maroon: Color = new Color(0.5, 0, 0, 1);  //栗色
    static Green: Color = new Color(0, 1, 0, 1);
    static Lime: Color = new Color(0, 0.5, 0, 1);  //绿黄色
    static Olive: Color = new Color(0.5, 0.5, 0, 1);  //橄榄色
    static Yellow: Color = new Color(1, 1, 0, 1);
    static Purple: Color = new Color(0.5, 0, 0.5, 1);  //紫色
    static Cyan: Color = new Color(0, 1, 1, 1);  //青色
    static Orange: Color = new Color(1, 0.5, 0, 1);  //橙色
    static Teal: Color = new Color(0, 0.5, 0.5, 1);  //蓝绿色
    static Aqua: Color = new Color(0, 1, 1, 1);  //水绿色
    static Navy: Color = new Color(0, 0, 0.5, 1);  //海军蓝
    static Blue: Color = new Color(0, 0, 1, 1);

    static temp: Color = new Color();

    static Create(r: number = 0, g: number = 0, b: number = 0, a: number = 1): Color {
        return new Color(r, g, b, a);
    }

    // 0xff0000 0xff0000ff
    static FromHex(hex:number): Color {
        let color = new Color();
        color.fromHex(hex);
        return color;
    }

    public static FromString(str: string): Color {
        let color = new Color();
        color.fromString(str);
        return color;
    }

    static Lerp(colorFrom: Color, colorTo: Color, t: number, outColor: Color = null): Color {
        // 计算颜色值
        var r = colorFrom.r + (colorTo.r - colorFrom.r) * t;
        var g = colorFrom.g + (colorTo.g - colorFrom.g) * t;
        var b = colorFrom.b + (colorTo.b - colorFrom.b) * t;

        if (outColor == null) {
            outColor = new Color();
        }
        outColor.r = r;
        outColor.g = g;
        outColor.b = b;
        outColor.a = 1;
        return outColor;
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

    // 0xff0000 or 0xff0000ff
    public fromHex(hex: number): Color {
        if (hex < 0) {
            console.error("Color.fromHex error: hex < 0");
            return;
        }

        if (hex <= 0xFFFFFF) {
            return this.fromHex2(hex, 1);
        }

        let r = (hex >> 24) & 0xFF;
        let g = (hex >> 16) & 0xFF;
        let b = (hex >> 8) & 0xFF;
        let a = hex & 0xFF;
        
        this.r = r / 255;
        this.g = g / 255;
        this.b = b / 255;
        this.a = a / 255;
        return this;
    }

    //0xff0000
    public fromHex2(hex: number, alpha: number = 1): Color {
        let r = (hex >> 16) & 0xFF;
        let g = (hex >> 8) & 0xFF;
        let b = hex & 0xFF;

        this.r = r / 255;
        this.g = g / 255;
        this.b = b / 255;
        this.a = alpha;
        return this;
    }

    public fromRGB(r: number, g: number, b: number, a: number = 1): Color {
        this.r = r / 255;
        this.g = g / 255;
        this.g = b / 255;
        this.a = a;
        return this;
    }

    public fromRGBA(r: number, g: number, b: number, a: number): Color {
        this.r = r / 255;
        this.g = g / 255;
        this.g = b / 255;
        this.a = a / 255;
        return this;
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
        let r = Math.floor(this.r * 255);
        let g = Math.floor(this.g * 255);
        let b = Math.floor(this.b * 255);
        return (r << 16) | (g << 8) | b;
    }

    public toRGBA(): number {
        let r = Math.floor(this.r * 255);
        let g = Math.floor(this.g * 255);
        let b = Math.floor(this.b * 255);
        let a = Math.floor(this.a * 255);
        return (r << 24) | (g << 16) | (b << 8) | a;
    }

    public toString(): string {
        let r = Math.floor(this.r * 255);
        let g = Math.floor(this.g * 255);
        let b = Math.floor(this.b * 255);
        let a = Math.floor(this.a * 255);
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

    public lerp(color: Color, t: number, out:Color=null): Color {
        let r = this.r + (color.r - this.r) * t;
        let g = this.g + (color.g - this.g) * t;
        let b = this.b + (color.b - this.b) * t;
        let a = this.a + (color.a - this.a) * t;

        out = out || new Color();
        out.r = r;
        out.g = g;
        out.b = b;
        out.a = a;
        return out;
    }
}
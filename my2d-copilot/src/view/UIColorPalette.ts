import { ViewBase } from "../base/ui/ViewBase";
import { UILabel } from "../base/ui/ctrl/UILabel";
import { UIButton } from "../base/ui/ctrl/UIButton";
import { Color } from "../base/math/Color";
import { Size } from "../base/math/Size";
import { UIGeometry } from "../base/ui/ctrl/UIGeometry";
import { UIEdit } from "../base/ui/ctrl/UIEdit";


export class UIColorPalette extends ViewBase {
    private _cbk: Function;
    private _cellSize: Size = new Size(30, 30);
    private _cellCount:Size = new Size(10, 10);
    geoPlette: UIGeometry;
    geoEdit: UIGeometry;
    colorEdit: Color;

    // 主题颜色：
    // 深蓝（主要）: #0D47A1
    // 浅蓝（次要）: #42A5F5
    // 辅助颜色：
    // 淡灰色: #F5F5F5
    // 深灰色: #9E9E9E
    // 反馈颜色：
    // 成功: #4CAF50
    // 错误: #F44336
    // 警告: #FFC107
    // 信息: #03A9F4
    // 暗黑模式：
    // 深黑色: #212121
    // 深灰色: #424242
    // 浅灰色: #616161
    colorSkins = [
        "#0D47A1", "#42A5F5", "#F5F5F5", "#9E9E9E",
        "#4CAF50", "#F44336", "#FFC107", "#03A9F4",
        "#212121", "#424242", "#616161"
    ];

    // 主题颜色：
    // 主色（用于大部分界面元素和重要动作）：#3F51B5（蓝色）
    // 次色（用于强调和重要元素）：#FF4081（粉红色）
    // 辅助颜色（用于图标、背景等）：
    // 深色背景：#303F9F
    // 浅色背景：#C5CAE9
    // 反馈颜色：
    // 成功信息：#4CAF50（绿色）
    // 错误信息：#F44336（红色）
    // 警告信息：#FFC107（黄色）
    // 文本颜色：
    // 主要文本：#212121（接近黑色）
    // 次要文本：#757575（灰色）
    // 在深色背景上的文本：#FFFFFF（白色）
    // 暗黑模式颜色：
    // 深色背景：#121212
    // 主要文本：#E0E0E0
    // 次要文本：#9E9E9E
    // 主题色（暗色）：#1A237E
    // 主题色（亮色）：#8C9EFF
    colorSkins2 = [
        "#3F51B5", "#FF4081", "#303F9F", "#C5CAE9",
        "#4CAF50", "#F44336", "#FFC107", "#212121",
        "#757575", "#FFFFFF", "#121212", "#E0E0E0",
        "#9E9E9E", "#1A237E", "#8C9EFF"
    ];

    calculateColor(x:number, y:number, w:number, h:number, colorFrom:Color, colorTo:Color, outColor:Color=null):Color {
        // 计算t
        var t = Math.sqrt(x*x + y*y) / Math.sqrt(w*w + h*h);
    
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

    onCreate(cbk: Function) {
        super.onCreate();
        this._cbk = cbk;

        {
            let geo = new UIGeometry();
            geo.x = 10;
            geo.y = 10;
            this.addChild(geo);
            this.geoPlette = geo;
        }
        
        {
            let geo = new UIGeometry();
            geo.x = 10;
            geo.y = 400;
            this.addChild(geo);
            this.geoEdit = geo;

            let color = new Color(0, 255, 100, 1);
            this.colorEdit = color;
        }

        {
            let edit = new UIEdit();
            edit.x = 400;
            edit.y = 400;
            this.addChild(edit);
        }
    }

    onRender(x: number, y: number): void {
        super.onRender(x, y);

        {
            let geo = this.geoPlette;
            geo.fillRect(25, 25, 100, 100);

            let _x = 0;
            let _y = 0;
            let w = this._cellSize.width;
            let h = this._cellSize.height;
            let cw = this._cellCount.width;
            let ch = this._cellCount.height;
            let colorFrom = new Color(1, 0, 0, 1);
            let colorTo = new Color(1, 1, 1, 1);
            let color = new Color(0, 0, 0, 1);
            for (var i = 0; i < cw; i++) {
                for (var j = 0; j < ch; j++) {
                    _x = i * w;
                    _y = j * h;

                    this.calculateColor(i, j, cw-1, ch-1, colorFrom, colorTo, color);
                    //color.fromRGB(Math.floor(255 - 42.5 * i), Math.floor(255 - 42.5 * j), 0);
                    geo.fillRect(_x, _y, w, h, color);
                }
            }
        }

        {
            let geo = this.geoEdit;
            geo.y = 400;
            let i = 0;
            let j = 0;
            for (let idx = 0; idx < this.colorSkins.length; idx++) {
                i = idx % 6;
                j = Math.floor(idx / 6);
                this.colorEdit.fromString(this.colorSkins[idx]);
                geo.fillRect(i * 60, j * 60, 60, 60, this.colorEdit);
            }
        }

        {
            let geo = this.geoEdit;
            geo.y = 550;
            let i = 0;
            let j = 0;
            for (let idx = 0; idx < this.colorSkins2.length; idx++) {
                i = idx % 6;
                j = Math.floor(idx / 6);
                this.colorEdit.fromString(this.colorSkins2[idx]);
                geo.fillRect(i * 60, j * 60, 60, 60, this.colorEdit);
            }
        }
    }
}
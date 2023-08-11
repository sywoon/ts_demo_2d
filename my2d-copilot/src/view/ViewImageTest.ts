import { ViewBase } from "../base/ui/ViewBase";
import { UIImage } from "../base/ui/ctrl/UIImage";


export class ViewImageTest extends ViewBase {

    onCreate() {
        super.onCreate();

        {
            let img = new UIImage();
            this.addChild(img);
            img.x = 10;
            img.y = 10;
            // img.width = 100;  //如果不设置 默认按图片大小
            // img.height = 100;
            img.src = "res/ui/btn/btn01_normal.png";
        }

        {
            let img = new UIImage();
            this.addChild(img);
            img.x = 10;
            img.y = 100;
            img.width = 100;  //如果不设置 默认按图片大小
            img.height = 100;
            img.src = "res/ui/btn/btn01_normal.png";
        }

        {
            let img = new UIImage();
            this.addChild(img);
            img.x = 10;
            img.y = 220;
            img.width = 100;  //如果不设置 默认按图片大小
            img.height = 100;
            img.src = "res/ui/btn/btn01_normal.png";
            img.setCutRect(20, 20, 50, 50);
        }
    }
}
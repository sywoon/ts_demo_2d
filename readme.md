
# 《TypeScript图形渲染实战-2D架构设计与实现》
运行demo方式：  
移动node_modules到demo文件夹(比较大 留一份即可)  
npm run dev  


## 第一章 构建TypeScript开发、编译和调试环境
[ts官网](https://www.typescriptlang.org) [NodeJs官网](https://nodejs.org)

### 编程环境
自动编译 自动部署 支持Debug的 ts开发环境  
nodejs10.19.0(自带包管理器npm6.13.4) VsCode TypeScript编译器 lite-service(开启多个 会自动加端口号)  
SystemJs Debugger for Chrome  

gnvm可以作为nodejs版本管理器 切换不同的版本
```
  npm install -g typescript    //tsv -v来验证  4.3.2
  npm i lite-server --save-dev
```


#### 编译和运行ts代码
* index.html入口  
```
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hello</title>
        <meta name='full-screen' content='true' />
        <meta name='x5-fullscreen' content='true' />
        <meta name='360-fullscreen' content='true' />
        <style>
            body {
                background: #eeeeee;
            }
            /*
            css选择器：# 表示id选择器
            */
            #canvas {
                background: #ffeeff ; /* 背景白色 */

                -webkit-box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
                -moz-box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
                box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
            }
        </style>
    </head>

    <body>
        <canvas id="canvas" width="800" height="600"></canvas> 
        <script src="main.js" type="module"></script>
        <!-- <script type="text/javascript" src="main.js"></script> -->
    </body>

    </html>
```
若不设置canvas大小 默认300x150  


* 模块化开发  
为了让js支持多文件而创造出的规则：commonjs amd system umd es2015  
文件定义时加入type <script src="main.js" type="module"></script> 才能支持import export  

* 搭建本地服务器 lite-server  
npm init -f   得到package.json  
npm i lite-server --save-dev  
配置  
```
    "scripts": {
        "server": "lite-server"
      },
```
运行  
npm run server   =>  http://localhost:3000/  


##### 编译ts  
1. 方式1：tsc编译器
tsc main.ts  => main.js  
a <script标签 要在<canvas之后   或者带上defer属性  
b 若有多个ts文件 浏览器受限制-跨域问题 需要启动服务器来支持 npm run server  -> lite-server插件
c 其他文件引入方式 import { Canvas2D } from "./Canvas2D.js";  需要带上.js 很不方便
对应ts需要编译为ts6 设置tsconfig.json的module:es2015  target可以为es5 
优化=>   
为了自动将ts编译为js 可通过tsconfig.json配置文件 开启watch开关  
tsc --init 得到配置文件
几个有用的开关：  
```
    "target": "es2015",  
    "module": "es2015",   
    
    "strict": true,
    "noImplicitAny": false,  避免any类型赋值语法报错
    "strictNullChecks": false,  避免 ct: AClass | null;类声明-- 联合类型声明
    
    "watch": true
```
优点：只需要全局的tsc 无需安装超大文件夹node_modules  


2. 方式2 使用SystemJS  
支持自动编译和加载ts 无需转换为js  
方式1的缺点：import文件需要带上.js末尾  
安装  
npm i systemjs@0.19.47 --save
npm i typescript@3.9.5 --save

注意：版本之间使用方式差别很大 需要指定才行  
删除tsconfig.json  
修改html  
```
    head中加入
    <script src="node_modules/systemjs/dist/system.js"></script>
    <script src="node_modules/typescript/lib/typescript.js"></script>
    <script>
        System.config({
            transpiler: 'typescript',
            packages: {
                './': {
                    defaultExtension: 'ts'
                }
            }
        });
        System
           .import('main.ts')
            .then(null, console.error.bind(console));
    </script>
```
导入其他模块：  
import { Canvas2D } from "./canvas/Canvas2D.ts"  
缺点：需要.ts结尾 

这是bug 实际两种方式都支持：  
import { Canvas2D } from "./canvas/Canvas2D"  
原因在：  
```
    <script>
        System.config({
            transpiler: 'typescript',
            packages: {   //这里是packages  而不是package   奇怪也能运行 啥区别？
                './': {
                    defaultExtension: 'ts'
                }
            }
        });
        System
           .import('main.ts')
            .then(null, console.error.bind(console));
    </script>
```




不再需要： defer type="module" tsconfig.json 一切由systemjs来掌控  
运行：npm run server  

建议：继续保留ts的语法检查  
tsc --init 生成tsconfig.json 开启strict  

调试：需要debugger for chrome   
f5 同vs 可以直接在ts中断点  

  

3. 方式3 使用webpack
编译为bin/dist.js
可不带扩展名 import { Canvas2D } from "./Canvas2D"
export class Canvas2D


4. 方式4 使用gulp cli


5. 方式5 使用parcel
npm init -y
npm install parcel-bundler typescript ts-node -D
html中直接使用ts文件
```
  "devDependencies": {
    "parcel-bundler": "^1.12.5",
    "ts-node": "^10.9.1",
    "typescript": "^5.0.4"
  }
  
<body>
  <script src="./index.ts"></script>
```
编译 生成运行版本
npx parcel build index.html --out-dir dist --public-url ./
运行web服务器 可以在浏览器中调试ts代码 编译和打包项目 日常调试用
npx parcel index.html




## 第二章 使用TypeScript实现Doom3词法解析器
[ECMAScript词法解析网站](http://esprima.org/demo/parse.html)
模板字符串：支持多行 变量插入  
```
    `aa${var}
    bb cc`
```

接口定义和扩展：  
interface IA {}  
class B implements IA {}  接口的实现  
interface IB extends IA {} 接口的继承  
类的定义和继承：  
class B extends A {}  
类型别名 联合类型:  
type A = B | C;  
泛型编程：  
```
    export interface IEnumerator<T> {}
```

工厂模式：可以隐藏实现类 通过接口对外暴露  
微软com 先通过全局函数创建接口对象Direct3DCreate9()  
再通过接口函数创建不同类型的资源对象 id3d->CreateDevice()  


网络数据请求： 文本 二进制  
同步：不允许设置responseType 会报错 默认text类型  
```
    let xhr:EKLHttpRequest = new XMLHttpRequest()
    xhr.open("get", url, false, null, null)
    xhr.send();
    if (xhr.status === 200) {
        return xhr.respose;
    }
```
异步:可以设置类型  
```
    let xhr:XMLHttpRequest = new XMLHttpRequest();
    xhr.responseType = type; //text json arraybuffer blob
    xhr.onreadystatechange = (ev:Event):void => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            returen xhr.response;
        }
    }
    xhr.open("get", url, true, null, null);
    xhr.send();
```




## 第三章 动画与Application类
游戏主循环：  
方式1：win32 c++  
```
    MSG msg;
    ZeroMemory(&msg, sizeof(msg));
    while(msg.message != WM_QUIT) {
        if (PeekMessage(&msg, NULL, 0, 0, PM_REMOVE)) {
            TranslateMessage(&msg);
            DispatchMessage(&msg);
        } else {
            Update();
            Render();
        }
    }
```
方式2：h5  
setTimeout setInterval 多个页签间都会起效 导致切换后依然运行  
requestAnimationFrame 只在本页执行 每次固定16.66毫秒 60次/秒   
    实际上和本显示器的刷新率相关 且若一帧内用时长 下次刷新的间隔必然是16.66的某个倍数    
```
    function step(timestamp:number):void {
        if (!lastTime) lastTime = timestamp;
        let interval = timestamp - lastTime;
        mainLoop(interval);
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
```

### 游戏主框架
* 设计:启动 暂停 更新 绘制   
结构设计  
```
    Application : I EventListner
                : CanvasKeyBoardEvent : CanvasInputEvent -> E EInputEventType
                : CanvasMouseEvent : CanvasInputEvent
    WebGLApplication : Application
        .context3D: WebGLRenderingContext
    Canvas2DApplication : Application
        .context2D: CanvasRendringContext
```
接口设计  
```
    Application
        start() {reqId = window.requestAnimationFrame(this.step.bind(this))}
        stop() {window.cancelAnimationFrame(reqId)}
        isRunning()
        step(timestamp:number) { this.update(interval); this.render(); }
        update(interval:number);  //继承类实现
        render();  //继承类实现
```
* this指针问题：  
若不用bind 这么调用会怎样window.requestAnimationFrame(this.step)？  
step函数中 得到的this值：  
a、window对象 非strict模式
b、null strict模式
解决：
a、用bind  
b、用箭头函数 ()=>{this.step();}  

### 游戏输入控制
```
    enum EInputEventType {
        MOUSEDOWN,
        MOUSEUP,
        MOUSEMOVE,
        MOUSEDRAY,
        KEYUP,
        KEYDOWN,
        KEYPRESS,
    }
    
    CanvasInputEvent
        .altKey: boolean
        .ctrlKey
        .shiftKey
        .type: EInputEventType

    CanvasMouseEvent extends CanvasInputEvent
        .button:number;  0左键 1中键 2右键
        .canvasPos:vec2;  转换后的位置
        .localPos:vec2;
    CanvasKeyBoardEvent extends CanvasInputEvent
        .key: string;
        .keycode:number;  ascII码
        .repeat:boolean;
```

* 坐标变换原理  
```
    |document起点
    |
    |viewport起点
    |----------------|
    |
    |  canvas起点
    |  |-----------|
    |  |           |
    |  |  .当前鼠标点|
    |  |-----------|
    |
    |
    |----------------|
    |           viewport结束点
```
a、所有元素的位置和大小 都是基于viewport 可以通过Element.getBoundingRect()获取  
b、MouseEvent的 .clientX .clientY都是基于viewport  
所以可以求得canvasPos = mousePos - canvas.origin  
```
    通过canvas的原点偏移 计算出鼠标点在canvas坐标系下的位置
    viewport2canvas(evt:MouseEvent) {
        let rect:ClientRect = this.canvas.getBoundingClientRect();
        if (evt.type === "mousedown") {
            log(rect, evt.clientX, evt.clientY)
        }
        let x = evt.clientX - rect.left;
        let y = evt.clientY - rect.right;
        return vec2.create(x, y);
    }
```  
默认的8像素偏移：  
```
    #canvas {
            background: #ffffff ; /* 背景白色 */
            margin: 0px 0px 0px 0px /*上右下左(顺时针)*/
```
就算设置为0 还是有8像素的偏移  canvas与viewport的默认偏移？  
解决：实际上是body与viewport之间的空隙 而canvas是在body内的  
```
    body {
        background: #eeeeee;
        margin: 0px;
    }
    or 
    * {
        margin: 0px;
    }
```

canvas css的margin border padding对坐标计算的影响：  
```
    #canvas {
            background: #ffffff ; /* 背景白色 */
            margin: 10px 15px 20px 25px; /*我们将canvas的margin设置为4个数值 上右下左(顺时针)*/
          
            border-style: solid ;  /* 必须设置 否则border无效 */
            border-width: 25px 35px 20px 30px ; /*  top - right - bottom - left 顺序 */
            border-color: gray ;

            /* 使用各种单位表示padding */
            padding-top: 10px ;       
            padding-right: 0.25em ;
            padding-bottom: 2ex ;
            padding-left: 20% ;

            -webkit-box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
            -moz-box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
            box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
        }
```
其中margin不影响计算 但是border和padding都会  
border指canvas外部延伸  
padding指从边缘往内部延伸  
```
    viewport2CanvasCoordinate(evt: MouseEvent): vec2 {
        let rect:ClientRect = this.canvas.getBundingClientRect();
        if (!evt.target) {
            throw new Error("canvas is null");
        }
        
        let borderLeft = 0;
        let borderTop = 0;
        let paddingLeft = 0;
        let paddingTop = 0;
        
        // 得到属性 包含null或数字字符串
        let decl:CSSStyleDeclaration = window.getComputedStyle(evt.target as HTMLElement);
        let str = decl.borderLeftWidth;
        str && borderLeft = parseInt(str, 10);
        str = decl.borderTopWidth;
        str && borderTop = parseInt(str, 10);
        str = decl.paddingLeft;
        str && paddingLeft = parseInt(str, 10);
        str = decl.paddingTop;
        str && paddingTop = parseInt(str, 10);
     
        let x = evt.clientX - rect.left - borderLeft - paddingLeft;
        let y = evt.clientY - rect.top - borderTop - paddingTop;
        let pos = vec2.create(x, y);
        return pos;
    }
```



* 将DOM Event转为自定义的事件类型:  
```
    toCanvasMouseEvent(evt:Event): CanvasMouseEvent {
        let event: MouseEvent = evt as MouseEvent;
        let pos = this.viewport2canvas(event);
        return new CanvasMouseEvent(pos, event.button, event.altKey, 
            event.ctrlKey, event.shiftKey);
    }
    
    toCanvasKeyboardEvent(evt:Event): CanvasKeyboardEvent {
        let event: KeyboardEvent = evt as KeyboardEvent;
        let pos = this.viewport2canvas(event);
        return new CanvasKeyboardEvent(event.key, event.keyCode, event.repeat,
            event.altKey, event.ctrlKey, event.shiftKey);
    }
```


* 事件的监听  
```
    用Application对象接受系统的鼠标和键盘消息 注册后 会自动调用handleEvent函数
    Application {
        constructor(canvas:HTMLCanvasElement) {
            canvas.addEventListener("mousedown", this, false);
            canvas.addEventListener("mouseup", this, false);
            canvas.addEventListener("mousemouse", this, false);
            
            window.addEventListener("keydown", this, false);
            window.addEventListener("keyup", this, false);
            window.addEventListener("keypress", this, false);
        }
    }
```


* 事件的派发  
```
    interface EventListenerObject {
        handleEvent(evt: Event): void;
    }
    
    export class Application implements EventListenerObject {
        isSupportMouseMove:boolean;
        isMouseDown: boolean;
        
        handleEvent(evt: Event): void {
            switch (evt.type) {
                case "mousedown": {
                    this.isMouseDown = true;
                    this.dispatchMouseDown(this.toCanvasMouseEvent(evt));
                }
                break;
                case "mouseup": {
                    this.isMouseDown = false;
                    this.dispatchMouseUp(this.toCanvasMouseEvent(evt));
                }
                break;
                case "movemove": {
                    if (this.isSupportMouseMove) {
                        this.dispatchMouseMove(this.toCanvasMouseEvent(evt));
                    }
                    if (this.isMouseDown) {
                        this.dispatchMouseDrag(this.toCanvasMouseEvent(evt));
                    }
                }
                break;
                case "keypress": {
                    this.dispatchKeyPress(this.toCanvasKeyboardEvent(evt));
                }
                break;
                case "keydown": {
                    this.dispatchKeyDown(this.toCanvasKeyboardEvent(evt));
                }
                break;
                case "keyup": {
                    this.dispatchKeyUp(this.toCanvasKeyboardEvent(evt));
                }
                break;
            }
        }
    }
```

* 2d和webgl之类的实现  
```
    class Canvas2DApplication extends Application {
        context2d: CanvasRenderingContext2D;
        constructor(canvas:HTMLCanvasElement, contextAttributes ?: Canvas2DContextAttributes) {
            this.context2d = this.canvas.getContext("2d", contextAttributes);
        }
    }
    
    class WebGLApplication extends Application {
        context3d: WebGLRenderingContext;
        contructor(canvas:HTMLCanvasElement, contextAttributes ?: WebGLContextAttributes) {
            // webgl experimetal-webgl 
            this.context3d = this.canvas.getContext("webgl", contextAttributes);
        }
    }
```

* 定时器  
封装Timer类 实现n秒后回调  
new Timer(time, cbk, once, data)  
内部在step中实现 也同时计算fps=1000/interval    


## 第四章　使用Canvas2D绘图
可绘制种类：几何图形 文字 图像 视频 阴影  
支持裁剪 碰撞检测 空间变换  
注意：不是直接在canvas表面上绘图 而是基于内部的渲染上下文CanvasRenderingContext2D  

清屏：  
```
    this.context2d.clearRect(0, 0, 0this.context2d.canvas.width, .height)
```
绘制矩形：坐标原点在左上   
知识点：  
填充色 描边色 线的宽度 绘制path需要begin和close之间  
可以通过save和restore来保持和恢复上下文状态    
```
    drawRect(x, y, w, h) {
        let ctx = this.context2d;
        ctx.save();
        ctx.fillStyle = "grey";
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 20;
        
        ctx.beginPath();
        ctx.moveTo(x, y);   //左上
        ctx.lineTo(x+w, y);
        ctx.lineTo(x+w, y+h);   //右下
        ctx.lineTo(x, y+h);
        ctx.closePath();
        ctx.fill();   //填充内部
        ctx.strok();  //描边
        ctx.restore();
    }
```

* 渲染状态堆栈的实现原理  
```
    首先由状态的记录对象 当前上下文相关的所有状态
    class RenderState {
        lineWidth:number = 1;
        strokeStyle: string = "red";
        fillStyle: string = "green";
        clone(): RenderState {
            let s = new RenderState();
            s.lineWidth = this.lineWidth;
            ...
        }
        toString() { return JSON.stringify(this, null, ' ')};
    }
    
    class RenderStateStack()  {
        stack:RenderState[] = [new RenderState()];  //第一次为初始状态 即:全局状态
        get current(): RenderState {
            return this.stack[this.stack.length-1];
        }
        save() {
            this.stack.push(this.current.clone());
        }
        restore() {
            this.stack.pop();
        }
        get set lineWidth() { this.current.lineWidth = v;}
        get set strokeStyle()
        get set fillStyle()
        toString() { return this.current.toString(); }
    }
```
注意：  
a、默认必须先存放一个 表示全局状态  
b、save和restore可以嵌套 但必须成对 否则破坏栈  


### 线段的属性和描边stroke
canvas的矢量图形 基于路径对象 由轮廓边和内部填充区域组成  
对应stroke和fill(允许非封闭区域) 

* 描边属性：  
```
  lineWidth  1
  lineJoin  如何绘制两个线段的连接处
    miter 绘制四边形 默认
    round 绘制圆弧(扇形)
    bevel 绘制三角形
  lineCap   影响线段的端点形状 需关闭封闭线段 注释ctx.closePath()
    butt默认 两端无效果
    round 额外多出 半圆 半径为线宽的一半
    square 额外多出 矩形 宽度为线宽的一半
  miterLimit  10
    只有lineJoin为miter时才有用 什么功能？
```
* 绘制虚线  
setLineDash([v1,v2]) 实线和虚线的长度
lineDashOffset 虚线 起始偏移量 默认0  通过定时器 可以实现旋转运动效果  
```
    ctx.lineWidth = 20
    ctx.setLineDash([30, 15])
```

### 使用颜色描边和填充
通过style 有3种类型：  
```
    strokeStyle : string | CanvasGradient | CanvasPattern;
    fillStyle : string | CanvasGradient | CanvasPattern;
```
1. string css颜色字符串格式
```
  方式1：
    html和css规范定义了147种颜色 其中17种常用标准色  
    black blue gray green red white yellow
    aqua 浅绿色  fuchsia 紫红色 lime 绿黄色  
    maroon 褐红色  navy 海军蓝  olive 橄榄色  
    teal 蓝绿色 silver 银灰色 purple 紫色 orange 橙色
    例如：
    strokStyle = "silver"
  方式2：
    rgb rgba  [0,255]  [0%,100%]  alpha [0,1] 0:全透  
    例如：
    strokStyle = "rgb(0,0,255)"
    rgb(0%,0%,100%) rgba(0,255,0,0.5)
  方式3：
    十六进制 #rrggbb 不支持半透  
  方式4：
    hsl hsla格式  比较少用  
```
2. CanvasGradient
分为：线性渐变和反射渐变  
```
  线性渐变: 创建时 传入左上有右下角位置
    从左到右的渐变
    let linear:CanvasGradient = ctx.createLinearGradient(x, y, x+w, y);
    从右到左 (x+w,y,x,y)
    从上到下 (x,y,x,y+h)  从下到上 (x,y+h,x,y)
    从左上到右下 (x,y,x+w,y+h)  从右下到左上 (x+w,y+h,x,y)
    设置不同位置的颜色 可多个：
    linear.addColorStop(0.0, 'grey')  起始色
    linear.addColorStop(0.35, 'rgba(255,200,100,1)')
    linear.addColorStop(0.75, '#00ff00')
    linear.addColorStop(1.0, 'grey')  结束色
    
    ctx.save()
    ctx.fillStyle = linear;
    ctx.beginPath();  //不用closePath ?
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.restore();
    
  反射渐变： 由内外圆组成   圆心可以不同？
    let radial = ctx.createRadialGradient(centx, centy, radius * 0.3, centx, centy, radius)
    radial.addColorStop(...) 同上
    
    ctx.fillStyle = radial
    ctx.fillRect(x,y,w,h);
```
3. CanvasPattern 使用图像描边和填充  
可以使用image canvas 或 video 元素来填充  
不支持缩放 只能选择重复方式  
```
    let img:HTMLImageElement = document.createElement("img")
    img.src = "./res/aa.jpg"
    img.onload = (evt:Event): void => {
        //参数2：填充区域大于图片大小时的处理方式： repeat repeat-x repeat-y no-repeat
        let pattern = ctx.createPattern(img, "repeat");
        ctx.save()
        ctx.fillStyle = pattern
        ctx.beginPath()
        ctx.rect(x,y,w,h)
        ctx.fill() 只填充 不描边
        ctx.restore()
    }
```

### 点和圆的绘制
可通过画圆弧arc方法来实现  
点：通过圆实现  
圆：是圆弧的特殊形式  
```
  fillCircle(x,y,radius,fillStyle)
    .fillStyle = 
    ctx.beginPath()
    中心点 起始和结束角度
    ctx.arc(x, y, radius, 0, Math.PI*2)
    ctx.fill()
```

### 线段的绘制
```
  封装后 可以实现画坐标轴
  strockLine(x1,y1,x2,y2) {
    ctx.beginPath()
    ctx.moveTo(x1,y1)
    ctx.lineTo(x2,y2)
    ctx.stroke()  只描边 没填充
  }
```


### 绘制文本
两种方式：stroke和fill  
相关属性：  
```
    font:string;   10px simhei
    textAlign: string;  start left center right end  横向对齐
    textBaseline: string;  alphabetic hanging top middle bottom 纵向对齐
    strokeText(text:string, x, y, maxWidth?:number)
    fillText(text:string, x, y, maxWidth?:number)
    measureText(text:string): TextMetrics;  //只有.width属性
```
计算字符串像素大小：　　
```
    let w = ctx.measureText(text).width
    可惜没height  作者用了  h = 1.5 * "w".width 一个估计值
    可以考虑从字体大小来估计
```


###　font属性
css格式字符串 一次设置多个属性  
"italic small-caps bold 10px simhei"
注意：必须按这个顺序设置所有属性 否则不起作用  
laya中估计是自己做了兼容优化 可以只设置部分    
```
    font-style: normal italic oblique
    font-variant: normal small-caps
    font-weight: normal bold bolder lighter 100 200 .. 900
    font-size: 10px 50% 100% xx-small x-small small medium large x-large xx-large
    font-family: serif yahei 宋体 sans-serif
```


###　绘制图像
```
  原图大小 绘制到canvas的某个坐标处
  drawImage(img:HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap,
    destX, destY)
    
  支持拉伸和缩放 指定目标区域大小
  drawImage(img, destX, destY, destW, destH)
  支持选择原始图片的某个区域
  drawImage(img, srcX, srcY, srcW, srcH,
    destX, destY, destW, destH)
```
之前通过CanvasPattern方式 用图片画矢量图  
支持repeat模式 这里不支持这种设置 不过可以自己计算大小来模拟实现  


###　离屏Canvas
动态创建一个canvas 并绘制内容后 作为drawImage的第一个参数  
```
  createOfflineCanvas() {
    let canvas = document.createElement("canvas")
    canvas.width = 200
    canvas.height = 200
    let context = canvas.getContext("2d")
    context.save()
    context.fillStyle = "black"
    context.fillRect(10, 10, 100, 100)
    context.restore()
    return canvas;
  }
    
```


### 操作canvas中的图像数据
* createImageData() 得到ImageData对象  
* getImageData(x,y,w,h)  从context中获取一块图像数据
* putImageData(imgData,destX,destY,x,y,w,h)  将一块图像数据放回context中


```
    // size*size个像素 每个像素[r,g,b,a]
    let imgData = ctx.createImageData(size, size)
    // 一维数组 [r,g,b,a,r,g,b,a,...]
    let data:uint8ClampedArray = imgData.data;
    let count = data.length / 4;  像素个数
    for (let i = 0; i < count; i++) {
        data[i*4 + 0] = 255
        data[i*4 + 1] = 0
        data[i*4 + 2] = 0
        data[i*4 + 3] = 255
    }
    绘制到ctx的(col,row)这个位置 从imageData的[0, 0, size, size]这个区域获取数据
    ctx.putImageData(imgData, col, row, 0, 0, size, size)
```


### 绘制阴影
作用范围：绘制图形 图像 文字  
属性：  
* shadowColor: css颜色字符串   rbga(0,0,0,0)
* shadowBlur: 指定一个数 参与高斯模糊计算   0
* shadowOffsetX  0
* shadowOffsetY  0





## 第五章 Canvas2D坐标系变换
context2d局部坐标系变换相关函数：  
```
    改变当前canvas坐标系到新的位置 即原(0,0)点 变为现在的(x,y)点
    比较适合画局部对象 用save和restore包含 防止影响其他的绘制
    translate(x:number, y)   
    rotate(angle)  顺时针转 单位弧度 以当前原点为轴心  会受ranslate影响 
    scale(x,y)
    transform(m11, m12, m21, m22, dx, dy) 矩阵相乘
```

* 怎样实现绕矩形内任意点 绕原点旋转 而不是默认的左上角  
通过默认在(0,0)点绘制和旋转 +　坐标变换来实现偏移　　
比如：画任意矩形fillText(title, 0, 0, w, h) + rotate(40)
    若想轴心点改为中心 而非左上角  
    fillText(title, -w/2,-h/2,w,h) + rotate(40)
  在前面插入transform(x, y)  修改真实绘制的位置


### 3大特性(translate rotate scale)
1. 变换的是局部坐标系  
2. 所有后续的绘制函数都是在变换后的局部坐标系上进行  
3. 累积性  
translate rotate scale对局部坐标系的变换都具有累积性  
每次都是对上一次结果的叠加  
比如：  
translate(0, h/2,w,h)
translate(w/2,0,w,h)
==>
translate(w/2,h/2,w,h)


### 月亮的公转和自转模型
```
    ctx.save()
    ctx.rotate(revolution)  //注意：这才是公转 因为先在原点旋转 再平移出去
    ctx.translate(radius, 0)
    ctx.rotate(rotationSelf)  //这是自转 因为坐标已经平移完成 旋转只针对局部坐标
    this.drawRect(w/2,h/2,w,h,title)
    ctx.restore()
```



## 第六章 向量数学及基本形体的点选
* 向量：具有方向Direction和大小Length/Magnitude的空间变量  
* 基本概念  
向量和位置无关 方向相同以及大小相同 即可表示两个向量相同！    
长度: sqrt(x*x, y*y)  
加法交换率： a + b = b + a  
加法结合律: a + b + c = a + (b+c)   
减法： a - b = -(b - a)  
负向量的几何含义：得到大小相同 方向相反的向量  

* 向量与标量：本质--缩放   
没有相加计算 自由相乘  
得到平行向量 方向可能改变(负数)  
交换律 分配率  

* 应用：代替沿着某个角度移动的cos sin计算  
demo：坦克沿着鼠标位置移动  
```
    a:为移动方向与x轴的夹角
    len:单位时间移动距离
    x += len * cos(a)
    y += len * sin(a)
```
简化:  
```
    dir = posMouse - pos  //鼠标点到当前坦克位置的向量
    dir *= len   //单位时间移动距离
    posNew = pos + dir  //新向量的位置
```

* 向量的点乘  
dot(a,b) = a.x*b.x + a.y*b.y = |a||b|cos(α)  
推导过程：  
```
    三角形A边与B边的夹角为α  c边的向量=a-b
    余弦定理：|c||c| = |a||a|+|b||b| - 2|a||b|cos(α)
    另外：|c||c| = c.c = (a-b).(a-b)=a.a + b.b - 2a.b
    所以： a.b = |a||b|cos(α)
```

交换律 a.b = b.a
加法分配率 a.(b+c) = a.b + a.c
不等式： a.b <= |a||b|
特殊情况：a.a = |a||a|


* 点乘的应用：投影 
虽然得到的是标量 注意看|a|cos(α)部分  
正好是直角三角形斜边到一边的投影  
所以：只要|b|=1 a.b = |a|cos(α)  
投影向量的朝向：b = b.normalize() 正好是标准向量  
其长度是投影长度  


## 第七章 矩阵数学及贝塞尔曲线



## 第八章 精灵系统




## 第九章 优美典雅的树结构




## 第十章 场景图系统















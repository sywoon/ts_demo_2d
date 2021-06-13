
# 《TypeScript图形渲染实战-2D架构设计与实现》


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
a <script标签 要在<canvas之后   获得带上defer属性  
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


## 第五章 Canvas2D坐标系变换


## 第六章 向量数学及基本形体的点选



## 第七章 矩阵数学及贝塞尔曲线



## 第八章 精灵系统




## 第九章 优美典雅的树结构




## 第十章 场景图系统















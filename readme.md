
# ��TypeScriptͼ����Ⱦʵս-2D�ܹ������ʵ�֡�


## ��һ�� ����TypeScript����������͵��Ի���
[ts����](https://www.typescriptlang.org) [NodeJs����](https://nodejs.org)

### ��̻���
�Զ����� �Զ����� ֧��Debug�� ts��������  
nodejs10.19.0(�Դ���������npm6.13.4) VsCode TypeScript������ lite-service(������� ���Զ��Ӷ˿ں�)  
SystemJs Debugger for Chrome  

gnvm������Ϊnodejs�汾������ �л���ͬ�İ汾
```
  npm install -g typescript    //tsv -v����֤  4.3.2
  npm i lite-server --save-dev
```


#### ���������ts����
* index.html���  
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
            cssѡ������# ��ʾidѡ����
            */
            #canvas {
                background: #ffeeff ; /* ������ɫ */

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
��������canvas��С Ĭ��300x150  


* ģ�黯����  
Ϊ����js֧�ֶ��ļ���������Ĺ���commonjs amd system umd es2015  
�ļ�����ʱ����type <script src="main.js" type="module"></script> ����֧��import export  

* ����ط����� lite-server  
npm init -f   �õ�package.json  
npm i lite-server --save-dev  
����  
```
    "scripts": {
        "server": "lite-server"
      },
```
����  
npm run server   =>  http://localhost:3000/  


##### ����ts  
1. ��ʽ1��tsc������
tsc main.ts  => main.js  
a <script��ǩ Ҫ��<canvas֮��   ��ô���defer����  
b ���ж��ts�ļ� �����������-�������� ��Ҫ������������֧�� npm run server  -> lite-server���
c �����ļ����뷽ʽ import { Canvas2D } from "./Canvas2D.js";  ��Ҫ����.js �ܲ�����
��Ӧts��Ҫ����Ϊts6 ����tsconfig.json��module:es2015  target����Ϊes5 
�Ż�=>   
Ϊ���Զ���ts����Ϊjs ��ͨ��tsconfig.json�����ļ� ����watch����  
tsc --init �õ������ļ�
�������õĿ��أ�  
```
    "target": "es2015",  
    "module": "es2015",   
    
    "strict": true,
    "noImplicitAny": false,  ����any���͸�ֵ�﷨����
    "strictNullChecks": false,  ���� ct: AClass | null;������-- ������������
    
    "watch": true
```


2. ��ʽ2 ʹ��SystemJS  
֧���Զ�����ͼ���ts ����ת��Ϊjs  
��ʽ1��ȱ�㣺import�ļ���Ҫ����.jsĩβ  
��װ  
npm i systemjs@0.19.47 --save
npm i typescript@3.9.5 --save

ע�⣺�汾֮��ʹ�÷�ʽ���ܴ� ��Ҫָ������  
ɾ��tsconfig.json  
�޸�html  
```
    head�м���
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
��������ģ�飺  
import { Canvas2D } from "./canvas/Canvas2D.ts"  
ȱ�㣺��Ҫ.ts��β 

����bug ʵ�����ַ�ʽ��֧�֣�  
import { Canvas2D } from "./canvas/Canvas2D"  
ԭ���ڣ�  
```
    <script>
        System.config({
            transpiler: 'typescript',
            packages: {   //������packages  ������package   ���Ҳ������ ɶ����
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




������Ҫ�� defer type="module" tsconfig.json һ����systemjs���ƿ�  
���У�npm run server  

���飺��������ts���﷨���  
tsc --init ����tsconfig.json ����strict  

���ԣ���Ҫdebugger for chrome   
f5 ͬvs ����ֱ����ts�жϵ�  

  
  
  
  
## �ڶ��� ʹ��TypeScriptʵ��Doom3�ʷ�������
[ECMAScript�ʷ�������վ](http://esprima.org/demo/parse.html)
ģ���ַ�����֧�ֶ��� ��������  
```
    `aa${var}
    bb cc`
```

�ӿڶ������չ��  
interface IA {}  
class B implements IA {}  �ӿڵ�ʵ��  
interface IB extends IA {} �ӿڵļ̳�  
��Ķ���ͼ̳У�  
class B extends A {}  
���ͱ��� ��������:  
type A = B | C;  
���ͱ�̣�  
```
    export interface IEnumerator<T> {}
```

����ģʽ����������ʵ���� ͨ���ӿڶ��Ⱪ¶  
΢��com ��ͨ��ȫ�ֺ��������ӿڶ���Direct3DCreate9()  
��ͨ���ӿں���������ͬ���͵���Դ���� id3d->CreateDevice()  


������������ �ı� ������  
ͬ��������������responseType �ᱨ�� Ĭ��text����  
```
    let xhr:EKLHttpRequest = new XMLHttpRequest()
    xhr.open("get", url, false, null, null)
    xhr.send();
    if (xhr.status === 200) {
        return xhr.respose;
    }
```
�첽:������������  
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




## ������ ������Application��
��Ϸ��ѭ����  
��ʽ1��win32 c++  
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
��ʽ2��h5  
setTimeout setInterval ���ҳǩ�䶼����Ч �����л�����Ȼ����  
requestAnimationFrame ֻ�ڱ�ҳִ�� ÿ�ι̶�16.66���� 60��/��   
    ʵ���Ϻͱ���ʾ����ˢ������� ����һ֡����ʱ�� �´�ˢ�µļ����Ȼ��16.66��ĳ������    
```
    function step(timestamp:number):void {
        if (!lastTime) lastTime = timestamp;
        let interval = timestamp - lastTime;
        mainLoop(interval);
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
```

### ��Ϸ�����
* ���:���� ��ͣ ���� ����   
�ṹ���  
```
    Application : I EventListner
                : CanvasKeyBoardEvent : CanvasInputEvent -> E EInputEventType
                : CanvasMouseEvent : CanvasInputEvent
    WebGLApplication : Application
        .context3D: WebGLRenderingContext
    Canvas2DApplication : Application
        .context2D: CanvasRendringContext
```
�ӿ����  
```
    Application
        start() {reqId = window.requestAnimationFrame(this.step.bind(this))}
        stop() {window.cancelAnimationFrame(reqId)}
        isRunning()
        step(timestamp:number) { this.update(interval); this.render(); }
        update(interval:number);  //�̳���ʵ��
        render();  //�̳���ʵ��
```
* thisָ�����⣺  
������bind ��ô���û�����window.requestAnimationFrame(this.step)��  
step������ �õ���thisֵ��  
a��window���� ��strictģʽ
b��null strictģʽ
�����
a����bind  
b���ü�ͷ���� ()=>{this.step();}  

### ��Ϸ�������
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
        .button:number;  0��� 1�м� 2�Ҽ�
        .canvasPos:vec2;  ת�����λ��
        .localPos:vec2;
    CanvasKeyBoardEvent extends CanvasInputEvent
        .key: string;
        .keycode:number;  ascII��
        .repeat:boolean;
```

* ����任ԭ��  
```
    |document���
    |
    |viewport���
    |----------------|
    |
    |  canvas���
    |  |-----------|
    |  |           |
    |  |  .��ǰ����|
    |  |-----------|
    |
    |
    |----------------|
    |           viewport������
```
a������Ԫ�ص�λ�úʹ�С ���ǻ���viewport ����ͨ��Element.getBoundingRect()��ȡ  
b��MouseEvent�� .clientX .clientY���ǻ���viewport  
���Կ������canvasPos = mousePos - canvas.origin  
```
    ͨ��canvas��ԭ��ƫ�� �����������canvas����ϵ�µ�λ��
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
Ĭ�ϵ�8����ƫ�ƣ�  
```
    #canvas {
            background: #ffffff ; /* ������ɫ */
            margin: 0px 0px 0px 0px /*��������(˳ʱ��)*/
```
��������Ϊ0 ������8���ص�ƫ��  canvas��viewport��Ĭ��ƫ�ƣ�  
�����ʵ������body��viewport֮��Ŀ�϶ ��canvas����body�ڵ�  
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

canvas css��margin border padding����������Ӱ�죺  
```
    #canvas {
            background: #ffffff ; /* ������ɫ */
            margin: 10px 15px 20px 25px; /*���ǽ�canvas��margin����Ϊ4����ֵ ��������(˳ʱ��)*/
          
            border-style: solid ;  /* �������� ����border��Ч */
            border-width: 25px 35px 20px 30px ; /*  top - right - bottom - left ˳�� */
            border-color: gray ;

            /* ʹ�ø��ֵ�λ��ʾpadding */
            padding-top: 10px ;       
            padding-right: 0.25em ;
            padding-bottom: 2ex ;
            padding-left: 20% ;

            -webkit-box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
            -moz-box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
            box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
        }
```
����margin��Ӱ����� ����border��padding����  
borderָcanvas�ⲿ����  
paddingָ�ӱ�Ե���ڲ�����  
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
        
        // �õ����� ����null�������ַ���
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



* ��DOM EventתΪ�Զ�����¼�����:  
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


* �¼��ļ���  
```
    ��Application�������ϵͳ�����ͼ�����Ϣ ע��� ���Զ�����handleEvent����
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


* �¼����ɷ�  
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

* 2d��webgl֮���ʵ��  
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

* ��ʱ��  
��װTimer�� ʵ��n���ص�  
new Timer(time, cbk, once, data)  
�ڲ���step��ʵ�� Ҳͬʱ����fps=1000/interval    


## �����¡�ʹ��Canvas2D��ͼ


## ������ Canvas2D����ϵ�任


## ������ ������ѧ����������ĵ�ѡ



## ������ ������ѧ������������



## �ڰ��� ����ϵͳ




## �ھ��� �������ŵ����ṹ




## ��ʮ�� ����ͼϵͳ















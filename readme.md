
# ��TypeScriptͼ����Ⱦʵս-2D�ܹ������ʵ�֡�
����demo��ʽ��  
�ƶ�node_modules��demo�ļ���(�Ƚϴ� ��һ�ݼ���)  
npm run dev  


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
a <script��ǩ Ҫ��<canvas֮��   ���ߴ���defer����  
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
�ŵ㣺ֻ��Ҫȫ�ֵ�tsc ���谲װ�����ļ���node_modules  


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

  

3. ��ʽ3 ʹ��webpack
����Ϊbin/dist.js
�ɲ�����չ�� import { Canvas2D } from "./Canvas2D"
export class Canvas2D


4. ��ʽ4 ʹ��gulp cli


5. ��ʽ5 ʹ��parcel
npm init -y
npm install parcel-bundler typescript ts-node -D
html��ֱ��ʹ��ts�ļ�
```
  "devDependencies": {
    "parcel-bundler": "^1.12.5",
    "ts-node": "^10.9.1",
    "typescript": "^5.0.4"
  }
  
<body>
  <script src="./index.ts"></script>
```
���� �������а汾
npx parcel build index.html --out-dir dist --public-url ./
����web������ ������������е���ts���� ����ʹ����Ŀ �ճ�������
npx parcel index.html




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
�ɻ������ࣺ����ͼ�� ���� ͼ�� ��Ƶ ��Ӱ  
֧�ֲü� ��ײ��� �ռ�任  
ע�⣺����ֱ����canvas�����ϻ�ͼ ���ǻ����ڲ�����Ⱦ������CanvasRenderingContext2D  

������  
```
    this.context2d.clearRect(0, 0, 0this.context2d.canvas.width, .height)
```
���ƾ��Σ�����ԭ��������   
֪ʶ�㣺  
���ɫ ���ɫ �ߵĿ�� ����path��Ҫbegin��close֮��  
����ͨ��save��restore�����ֺͻָ�������״̬    
```
    drawRect(x, y, w, h) {
        let ctx = this.context2d;
        ctx.save();
        ctx.fillStyle = "grey";
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 20;
        
        ctx.beginPath();
        ctx.moveTo(x, y);   //����
        ctx.lineTo(x+w, y);
        ctx.lineTo(x+w, y+h);   //����
        ctx.lineTo(x, y+h);
        ctx.closePath();
        ctx.fill();   //����ڲ�
        ctx.strok();  //���
        ctx.restore();
    }
```

* ��Ⱦ״̬��ջ��ʵ��ԭ��  
```
    ������״̬�ļ�¼���� ��ǰ��������ص�����״̬
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
        stack:RenderState[] = [new RenderState()];  //��һ��Ϊ��ʼ״̬ ��:ȫ��״̬
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
ע�⣺  
a��Ĭ�ϱ����ȴ��һ�� ��ʾȫ��״̬  
b��save��restore����Ƕ�� ������ɶ� �����ƻ�ջ  


### �߶ε����Ժ����stroke
canvas��ʸ��ͼ�� ����·������ �������ߺ��ڲ�����������  
��Ӧstroke��fill(����Ƿ������) 

* ������ԣ�  
```
  lineWidth  1
  lineJoin  ��λ��������߶ε����Ӵ�
    miter �����ı��� Ĭ��
    round ����Բ��(����)
    bevel ����������
  lineCap   Ӱ���߶εĶ˵���״ ��رշ���߶� ע��ctx.closePath()
    buttĬ�� ������Ч��
    round ������ ��Բ �뾶Ϊ�߿��һ��
    square ������ ���� ���Ϊ�߿��һ��
  miterLimit  10
    ֻ��lineJoinΪmiterʱ������ ʲô���ܣ�
```
* ��������  
setLineDash([v1,v2]) ʵ�ߺ����ߵĳ���
lineDashOffset ���� ��ʼƫ���� Ĭ��0  ͨ����ʱ�� ����ʵ����ת�˶�Ч��  
```
    ctx.lineWidth = 20
    ctx.setLineDash([30, 15])
```

### ʹ����ɫ��ߺ����
ͨ��style ��3�����ͣ�  
```
    strokeStyle : string | CanvasGradient | CanvasPattern;
    fillStyle : string | CanvasGradient | CanvasPattern;
```
1. string css��ɫ�ַ�����ʽ
```
  ��ʽ1��
    html��css�淶������147����ɫ ����17�ֳ��ñ�׼ɫ  
    black blue gray green red white yellow
    aqua ǳ��ɫ  fuchsia �Ϻ�ɫ lime �̻�ɫ  
    maroon �ֺ�ɫ  navy ������  olive ���ɫ  
    teal ����ɫ silver ����ɫ purple ��ɫ orange ��ɫ
    ���磺
    strokStyle = "silver"
  ��ʽ2��
    rgb rgba  [0,255]  [0%,100%]  alpha [0,1] 0:ȫ͸  
    ���磺
    strokStyle = "rgb(0,0,255)"
    rgb(0%,0%,100%) rgba(0,255,0,0.5)
  ��ʽ3��
    ʮ������ #rrggbb ��֧�ְ�͸  
  ��ʽ4��
    hsl hsla��ʽ  �Ƚ�����  
```
2. CanvasGradient
��Ϊ�����Խ���ͷ��佥��  
```
  ���Խ���: ����ʱ �������������½�λ��
    �����ҵĽ���
    let linear:CanvasGradient = ctx.createLinearGradient(x, y, x+w, y);
    ���ҵ��� (x+w,y,x,y)
    ���ϵ��� (x,y,x,y+h)  ���µ��� (x,y+h,x,y)
    �����ϵ����� (x,y,x+w,y+h)  �����µ����� (x+w,y+h,x,y)
    ���ò�ͬλ�õ���ɫ �ɶ����
    linear.addColorStop(0.0, 'grey')  ��ʼɫ
    linear.addColorStop(0.35, 'rgba(255,200,100,1)')
    linear.addColorStop(0.75, '#00ff00')
    linear.addColorStop(1.0, 'grey')  ����ɫ
    
    ctx.save()
    ctx.fillStyle = linear;
    ctx.beginPath();  //����closePath ?
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.restore();
    
  ���佥�䣺 ������Բ���   Բ�Ŀ��Բ�ͬ��
    let radial = ctx.createRadialGradient(centx, centy, radius * 0.3, centx, centy, radius)
    radial.addColorStop(...) ͬ��
    
    ctx.fillStyle = radial
    ctx.fillRect(x,y,w,h);
```
3. CanvasPattern ʹ��ͼ����ߺ����  
����ʹ��image canvas �� video Ԫ�������  
��֧������ ֻ��ѡ���ظ���ʽ  
```
    let img:HTMLImageElement = document.createElement("img")
    img.src = "./res/aa.jpg"
    img.onload = (evt:Event): void => {
        //����2������������ͼƬ��Сʱ�Ĵ���ʽ�� repeat repeat-x repeat-y no-repeat
        let pattern = ctx.createPattern(img, "repeat");
        ctx.save()
        ctx.fillStyle = pattern
        ctx.beginPath()
        ctx.rect(x,y,w,h)
        ctx.fill() ֻ��� �����
        ctx.restore()
    }
```

### ���Բ�Ļ���
��ͨ����Բ��arc������ʵ��  
�㣺ͨ��Բʵ��  
Բ����Բ����������ʽ  
```
  fillCircle(x,y,radius,fillStyle)
    .fillStyle = 
    ctx.beginPath()
    ���ĵ� ��ʼ�ͽ����Ƕ�
    ctx.arc(x, y, radius, 0, Math.PI*2)
    ctx.fill()
```

### �߶εĻ���
```
  ��װ�� ����ʵ�ֻ�������
  strockLine(x1,y1,x2,y2) {
    ctx.beginPath()
    ctx.moveTo(x1,y1)
    ctx.lineTo(x2,y2)
    ctx.stroke()  ֻ��� û���
  }
```


### �����ı�
���ַ�ʽ��stroke��fill  
������ԣ�  
```
    font:string;   10px simhei
    textAlign: string;  start left center right end  �������
    textBaseline: string;  alphabetic hanging top middle bottom �������
    strokeText(text:string, x, y, maxWidth?:number)
    fillText(text:string, x, y, maxWidth?:number)
    measureText(text:string): TextMetrics;  //ֻ��.width����
```
�����ַ������ش�С������
```
    let w = ctx.measureText(text).width
    ��ϧûheight  ��������  h = 1.5 * "w".width һ������ֵ
    ���Կ��Ǵ������С������
```


###��font����
css��ʽ�ַ��� һ�����ö������  
"italic small-caps bold 10px simhei"
ע�⣺���밴���˳�������������� ����������  
laya�й������Լ����˼����Ż� ����ֻ���ò���    
```
    font-style: normal italic oblique
    font-variant: normal small-caps
    font-weight: normal bold bolder lighter 100 200 .. 900
    font-size: 10px 50% 100% xx-small x-small small medium large x-large xx-large
    font-family: serif yahei ���� sans-serif
```


###������ͼ��
```
  ԭͼ��С ���Ƶ�canvas��ĳ�����괦
  drawImage(img:HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap,
    destX, destY)
    
  ֧����������� ָ��Ŀ�������С
  drawImage(img, destX, destY, destW, destH)
  ֧��ѡ��ԭʼͼƬ��ĳ������
  drawImage(img, srcX, srcY, srcW, srcH,
    destX, destY, destW, destH)
```
֮ǰͨ��CanvasPattern��ʽ ��ͼƬ��ʸ��ͼ  
֧��repeatģʽ ���ﲻ֧���������� ���������Լ������С��ģ��ʵ��  


###������Canvas
��̬����һ��canvas ���������ݺ� ��ΪdrawImage�ĵ�һ������  
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


### ����canvas�е�ͼ������
* createImageData() �õ�ImageData����  
* getImageData(x,y,w,h)  ��context�л�ȡһ��ͼ������
* putImageData(imgData,destX,destY,x,y,w,h)  ��һ��ͼ�����ݷŻ�context��


```
    // size*size������ ÿ������[r,g,b,a]
    let imgData = ctx.createImageData(size, size)
    // һά���� [r,g,b,a,r,g,b,a,...]
    let data:uint8ClampedArray = imgData.data;
    let count = data.length / 4;  ���ظ���
    for (let i = 0; i < count; i++) {
        data[i*4 + 0] = 255
        data[i*4 + 1] = 0
        data[i*4 + 2] = 0
        data[i*4 + 3] = 255
    }
    ���Ƶ�ctx��(col,row)���λ�� ��imageData��[0, 0, size, size]��������ȡ����
    ctx.putImageData(imgData, col, row, 0, 0, size, size)
```


### ������Ӱ
���÷�Χ������ͼ�� ͼ�� ����  
���ԣ�  
* shadowColor: css��ɫ�ַ���   rbga(0,0,0,0)
* shadowBlur: ָ��һ���� �����˹ģ������   0
* shadowOffsetX  0
* shadowOffsetY  0





## ������ Canvas2D����ϵ�任
context2d�ֲ�����ϵ�任��غ�����  
```
    �ı䵱ǰcanvas����ϵ���µ�λ�� ��ԭ(0,0)�� ��Ϊ���ڵ�(x,y)��
    �Ƚ��ʺϻ��ֲ����� ��save��restore���� ��ֹӰ�������Ļ���
    translate(x:number, y)   
    rotate(angle)  ˳ʱ��ת ��λ���� �Ե�ǰԭ��Ϊ����  ����ranslateӰ�� 
    scale(x,y)
    transform(m11, m12, m21, m22, dx, dy) �������
```

* ����ʵ���ƾ���������� ��ԭ����ת ������Ĭ�ϵ����Ͻ�  
ͨ��Ĭ����(0,0)����ƺ���ת +������任��ʵ��ƫ�ơ���
���磺���������fillText(title, 0, 0, w, h) + rotate(40)
    �������ĵ��Ϊ���� �������Ͻ�  
    fillText(title, -w/2,-h/2,w,h) + rotate(40)
  ��ǰ�����transform(x, y)  �޸���ʵ���Ƶ�λ��


### 3������(translate rotate scale)
1. �任���Ǿֲ�����ϵ  
2. ���к����Ļ��ƺ��������ڱ任��ľֲ�����ϵ�Ͻ���  
3. �ۻ���  
translate rotate scale�Ծֲ�����ϵ�ı任�������ۻ���  
ÿ�ζ��Ƕ���һ�ν���ĵ���  
���磺  
translate(0, h/2,w,h)
translate(w/2,0,w,h)
==>
translate(w/2,h/2,w,h)


### �����Ĺ�ת����תģ��
```
    ctx.save()
    ctx.rotate(revolution)  //ע�⣺����ǹ�ת ��Ϊ����ԭ����ת ��ƽ�Ƴ�ȥ
    ctx.translate(radius, 0)
    ctx.rotate(rotationSelf)  //������ת ��Ϊ�����Ѿ�ƽ����� ��תֻ��Ծֲ�����
    this.drawRect(w/2,h/2,w,h,title)
    ctx.restore()
```



## ������ ������ѧ����������ĵ�ѡ
* ���������з���Direction�ʹ�СLength/Magnitude�Ŀռ����  
* ��������  
������λ���޹� ������ͬ�Լ���С��ͬ ���ɱ�ʾ����������ͬ��    
����: sqrt(x*x, y*y)  
�ӷ������ʣ� a + b = b + a  
�ӷ������: a + b + c = a + (b+c)   
������ a - b = -(b - a)  
�������ļ��κ��壺�õ���С��ͬ �����෴������  

* ���������������--����   
û����Ӽ��� �������  
�õ�ƽ������ ������ܸı�(����)  
������ ������  

* Ӧ�ã���������ĳ���Ƕ��ƶ���cos sin����  
demo��̹���������λ���ƶ�  
```
    a:Ϊ�ƶ�������x��ļн�
    len:��λʱ���ƶ�����
    x += len * cos(a)
    y += len * sin(a)
```
��:  
```
    dir = posMouse - pos  //���㵽��ǰ̹��λ�õ�����
    dir *= len   //��λʱ���ƶ�����
    posNew = pos + dir  //��������λ��
```

* �����ĵ��  
dot(a,b) = a.x*b.x + a.y*b.y = |a||b|cos(��)  
�Ƶ����̣�  
```
    ������A����B�ߵļн�Ϊ��  c�ߵ�����=a-b
    ���Ҷ���|c||c| = |a||a|+|b||b| - 2|a||b|cos(��)
    ���⣺|c||c| = c.c = (a-b).(a-b)=a.a + b.b - 2a.b
    ���ԣ� a.b = |a||b|cos(��)
```

������ a.b = b.a
�ӷ������� a.(b+c) = a.b + a.c
����ʽ�� a.b <= |a||b|
���������a.a = |a||a|


* ��˵�Ӧ�ã�ͶӰ 
��Ȼ�õ����Ǳ��� ע�⿴|a|cos(��)����  
������ֱ��������б�ߵ�һ�ߵ�ͶӰ  
���ԣ�ֻҪ|b|=1 a.b = |a|cos(��)  
ͶӰ�����ĳ���b = b.normalize() �����Ǳ�׼����  
�䳤����ͶӰ����  


## ������ ������ѧ������������



## �ڰ��� ����ϵͳ




## �ھ��� �������ŵ����ṹ




## ��ʮ�� ����ͼϵͳ















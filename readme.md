
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


## ������ ������Application��


## �����¡�ʹ��Canvas2D��ͼ


## ������ Canvas2D����ϵ�任


## ������ ������ѧ����������ĵ�ѡ



## ������ ������ѧ������������



## �ڰ��� ����ϵͳ




## �ھ��� �������ŵ����ṹ




## ��ʮ�� ����ͼϵͳ















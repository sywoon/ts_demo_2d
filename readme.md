
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


## 第三章 动画与Application类


## 第四章　使用Canvas2D绘图


## 第五章 Canvas2D坐标系变换


## 第六章 向量数学及基本形体的点选



## 第七章 矩阵数学及贝塞尔曲线



## 第八章 精灵系统




## 第九章 优美典雅的树结构




## 第十章 场景图系统















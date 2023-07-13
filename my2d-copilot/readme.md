# canvas2d copilot
简单易用 [parcel](https://github.com/parcel-bundler/parcel)


## 环境搭建
```
npm init -y
tsc --init
npm i -g parcel-bundler typescript ts-node
有看到另一种 parcel@next -D

创建index.html index.ts 直接在html中引用
<script src="index.ts">

配置tsconfig.json
rootDir:"./src",
outDir:"./dist",

配置package.json
scripts : {
    test : "parcel index.html"
}

运行:
npm run test
or
npx parcel index.html
```

## 项目内容



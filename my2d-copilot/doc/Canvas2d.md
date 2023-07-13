
# canvas2d
[相关接口](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
[canvas教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)


# 学习笔记

## 基础知识
vanvas默认大小 300x150像素px
```
    <canvas id="tutorial" width="150" height="150"></canvas>

    注意：若用css来设置大小 可能出现比例不一致 或放大模糊效果
    #canvas {
        position:fixed;
        width: 600;   不等同上面的单位
        height: 800;
        border: 1px solid black;
        background-color: white;
    }
```

渲染上下文
```
canvas.getContext('2d');  or webgl
```







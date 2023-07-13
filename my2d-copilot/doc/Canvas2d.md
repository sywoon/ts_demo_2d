# canvas2d

[相关接口](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
[canvas 教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)

# 学习笔记

## 基础知识

vanvas 默认大小 300x150 像素 px

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

### 渲染上下文

```
canvas.getContext('2d');  or webgl
```

### 样式设置

```
  public setStatus(status: any): void {
    if (this.context === null) return;

    let ctx = this.context;
    status["fillStyle"] ? ctx.fillStyle = status["fillStyle"] : null;  //red rgb(200,0,0) 画文字 矩形
    status["font"] ? ctx.font = status["font"] : null;  //"20px sans-serif"
    status["textBaseline"] ? ctx.textBaseline = status["textBaseline"] : null;  //top middle bottom
    status["textAlign"] ? ctx.textAlign = status["textAlign"] : null;  //left center right
  }
```


### 画矩形
```
  fillRect(x, y, width, height)  填充
  strokeRect(x, y, width, height) 边框
  clearRect(x, y, width, height) 清除 使透明
```


### 路径
* 起点 终点
* 通过线段、曲线 补齐中间部分
* 形成封闭路径
* 描边或填充 来画矩形




# ui框架设计图
分类:control + view + uimgr
```
    控件层：
    UINode 只有位置和节点管理 没有大小概念
        |-子节点管理  addChild removeChild setVisible isVisible-通过位来控制多个状态属性
        |-创建和释放  create destory
        |-渲染 onRender 
        |-鼠标和键盘 控件事件(焦点 大小改变)  onTouchEvent onKeyEvent onCtrlEvent
      UIPanel 有大小 
        |-支持背景色/背景图
      UILabel UIButton UIEdit 

    UI窗口层：
    ViewBase
        |-生命周期 onAwake onEnable onDisable onDestroy 
        |-更新和渲染 onUpdate onRender
        |-定时器 注册有 reg

    ui管理器：
    UIMgr
        |-窗口开/关 openUI closeUI 
        |-更新和渲染 updateUI renderUI 调用内部ui数的同名方法
        |-定时器 单独给ui层使用 Timer  防止页面关闭 忘了取消注册 定时器还在走
        |-鼠标和键盘事件 onTouchEvent onKeyEvent 

```

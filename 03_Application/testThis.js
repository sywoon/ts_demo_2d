var TestThis = /** @class */ (function () {
    // 构造函数
    function TestThis() {
        // 将this . printCB作为参数传递给requestAnimationFrame方法
        window.requestAnimationFrame(this.printCB);
        // window.requestAnimationFrame(this.printCB.bind(this));
    }
    // 编写一个打印this的方法
    TestThis.prototype.printCB = function (msec) {
        // 直接将this打印到console控制台
        console.log(this);
    };
    return TestThis;
}());
//生成一个实例对象，该对象的构造函数会调用
//window.requestAnimationFrame方法
new TestThis();

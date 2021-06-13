class TestThis {

    // 编写一个打印this的方法
    public printCB ( msec : number ) : void {
        // 直接将this打印到console控制台
        console.log(this);
    }

    // 构造函数
    public constructor ( ) {
        // printCB是个成员方法，也是一个函数对象
        // 因此printCB也具有bind方法
        // 我们使用bind ( this )来绑定this对象
        // 由于在constructor函数中，此时的this是指向TestThis类的实例对象的
        // 这样printCB方法中的this指向的是printCB . bind ( this )中的this对象
        window . requestAnimationFrame ( this . printCB . bind ( this ) ) ;
    } 
}

//生成一个实例对象，该对象的构造函数会调用
//window.requestAnimationFrame方法
new TestThis ( ) ;
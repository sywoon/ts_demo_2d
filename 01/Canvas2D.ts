export class Canvas2D{
    //声明public访问级别的成员变量
    public context: CanvasRenderingContext2D | null;

    // public访问级别的构造函数
    public constructor ( canvas: HTMLCanvasElement ) {
        this.context = canvas.getContext( "2d" );
    }

    // public访问级别的成员函数
    public drawText ( text: string ): void {
        if ( this.context === null ) return;
        this.context.save();

        //让要绘制的文本居中对齐
        this.context.textBaseline = "middle";
        this.context.textAlign = "center";

        //计算canvas的中心坐标
        let centerX: number = this.context.canvas.width * 0.5;
        let centerY: number = this.context.canvas.height * 0.5;

        //红色填充
        // this . context . fillStyle = " red " ;

        //调用文字填充命令 
        this.context.fillText( text, centerX, centerY );

        //绿色描边
        this.context.strokeStyle = "green";

        //调用文字描边命令 
        this.context.strokeText( text, centerX, centerY );

        //将上面context中的textAlign , textBaseLine , fillStyle , strokeStyle状态恢复到初始化状态
        this.context.restore();
    }
}
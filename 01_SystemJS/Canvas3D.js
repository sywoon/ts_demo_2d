Canvas3D = /** @class */ (function () {
    // public���ʼ���Ĺ��캯��
    function Canvas3D(canvas) {
        this.context = canvas.getContext("2d");
    }
    // public���ʼ���ĳ�Ա����
    Canvas3D.prototype.drawText = function (text) {
        if (this.context === null)
            return;
        this.context.save();
        //��Ҫ���Ƶ��ı����ж���
        this.context.textBaseline = "middle";
        this.context.textAlign = "center";
        //����canvas����������
        var centerX = this.context.canvas.width * 0.5;
        var centerY = this.context.canvas.height * 0.6;
        //��ɫ���
        // this . context . fillStyle = " red " ;
        //��������������� 
        this.context.fillText(text, centerX, centerY);
        //��ɫ���
        this.context.strokeStyle = "red";
        //��������������� 
        this.context.strokeText(text, centerX, centerY);
        //������context�е�textAlign , textBaseLine , fillStyle , strokeStyle״̬�ָ�����ʼ��״̬
        this.context.restore();
    };
    return Canvas3D;
}());
// export { Canvas3D };

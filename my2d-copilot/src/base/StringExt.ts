export module StringEx {
    // StringEx.padStart(date.getDate(), 2, '0')
    // ���ƶ����ַ�����ͷ�� ֱ���ַ�����
    export function padStart (text:string|number, targetLength: number, paddingChar: string): string {
        text = text.toString();
        const paddingLength = targetLength - text.length;
    
        if (paddingLength <= 0) {
            return text.toString();
        }
    
        const padding = paddingChar.repeat(paddingLength);
        return padding + text.toString();
    };
    
}



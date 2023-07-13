//为了解开uimgr和业务view之间的依赖 通过字符串来保存view
export class ClassUtils {
    private static _classMap: any = {}

    static regClass(className: string, classDef: any): void {
        ClassUtils._classMap[className] = classDef;
    }

    static getRegClass(className: string): any {
        return ClassUtils._classMap[className];
    }
}
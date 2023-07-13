export interface IGraphic {
    saveStyle(): void;
    restoreStyle(): void;
    setStyle(style:any): void;
    
    drawText(text:string, x:number, y:number): void;
    fillRect(x:number, y:number, width:number, height:number): void;
    strokeRect(x:number, y:number, width:number, height:number): void;
    clearRect(x:number, y:number, width:number, height:number): void;
}


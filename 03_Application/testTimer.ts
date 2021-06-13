import { Application  } from "./src/application";
let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
let app : Application = new Application ( canvas ) ;

function timerCallback ( id : number , data : string ) : void {
    console . log ( "当前调用的Timer的id : " + id + " data : " + data ) ;
}

let timer0 : number = app . addTimer ( timerCallback ,3 ,true , " data是timeCallback的数据 " ) ;

let timer1 : number = app . addTimer ( timerCallback , 5 ,false , " data是timeCallback的数据 " ) ;

let button : HTMLButtonElement = document . getElementById ( 'stop') as HTMLButtonElement ;
button.onclick = (evt : MouseEvent ) : void => {
    app.removeTimer ( timer1 ) ;
    console . log ( app . timers . length ) ;
    let id : number = app.addTimer(timerCallback , 10 ,true , " data是timeCallback的数据 ");
    console . log ( id === 0) ;   
}

app . start ( ) ;






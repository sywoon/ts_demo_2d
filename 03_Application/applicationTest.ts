import { Application } from "./src/application";
import { CanvasKeyBoardEvent, CanvasMouseEvent } from "./src/application";
class ApplicationTest extends Application {
    protected dispatchKeyDown ( evt : CanvasKeyBoardEvent) : void {
       console . log ( " key : " + evt.key + " is down " ) ;
    }

    protected dispatchMouseDown ( evt : CanvasMouseEvent ) : void {
        console . log ( " canvasPosition : " + evt . canvasPosition ) ;
    }

    public update ( elapsedMsec : number , intervalSec : number ) : void {
        console . log ( " elapsedMsec : " + elapsedMsec + " intervalSec : " + intervalSec ) ;
    }

    public render ( ) : void {
        console . log ( " 调用render方法 " ) ;
    }
}

let canvas : HTMLCanvasElement | null = document . getElementById ( 'canvas' ) as HTMLCanvasElement ;

let app : Application = new ApplicationTest ( canvas ) ;

app . update ( 0 , 0 ) ;
app . render ( ) ;

let startButton : HTMLButtonElement | null = document . getElementById ( 'start' ) as HTMLButtonElement ;
let stopButton : HTMLButtonElement | null = document . getElementById ( 'stop' ) as HTMLButtonElement ;

startButton . onclick = ( ev : MouseEvent ) : void => {
    app . start ( ) ;
}

stopButton . onclick = ( ev : MouseEvent ) : void => {
    app . stop ( ) ;
}


import { Canvas2DApplication, CanvasMouseEvent, CanvasKeyBoardEvent } from "../application";
import {ISpriteContainer, IDispatcher } from "./interface";
import { Sprite2DManager} from "./sprite2dSystem" ;

export class Sprite2DApplication extends Canvas2DApplication {
    protected _dispatcher : IDispatcher ;

    public constructor ( canvas : HTMLCanvasElement , isHierarchical : boolean = true ) {
        document . oncontextmenu = function ( ) 
        {
            return false ;
        }
        super( canvas );
        {
            this . _dispatcher =  new Sprite2DManager ( ) ;
        }
    }

    public get rootContainer ( ) : ISpriteContainer {
        return this . _dispatcher . container ;
    } 

    public update ( msec : number , diff : number ): void {
        this . _dispatcher . dispatchUpdate ( msec , diff ) ;
    }

    public render ( ) : void {
        if ( this . context2D ) {
            this . context2D . clearRect ( 0 , 0 , this . context2D . canvas . width , this . context2D . canvas . height ) ;
            this . _dispatcher . dispatchDraw ( this . context2D ) ;
        }
    }

    protected dispatchMouseDown ( evt : CanvasMouseEvent ) : void{
        super . dispatchMouseDown ( evt ) ;
        this . _dispatcher . dispatchMouseEvent ( evt ) ;
    }

    protected dispatchMouseUp( evt : CanvasMouseEvent ) : void {
        super . dispatchMouseUp ( evt ) ;
        this . _dispatcher . dispatchMouseEvent ( evt ) ;
    }

    protected dispatchMouseMove ( evt : CanvasMouseEvent ) : void {
        super . dispatchMouseMove ( evt ) ;
        this . _dispatcher . dispatchMouseEvent ( evt ) ;
    }

    protected dispatchMouseDrag ( evt : CanvasMouseEvent ) : void {
        super . dispatchMouseDrag ( evt ) ;
        this . _dispatcher . dispatchMouseEvent ( evt ) ;
    }

    protected dispatchKeyDown ( evt : CanvasKeyBoardEvent ) : void {
        super . dispatchKeyDown ( evt ) ;
        this . _dispatcher . dispatchKeyEvent ( evt ) ;
    }

    protected dispatchKeyUp ( evt : CanvasKeyBoardEvent ) : void {
        super . dispatchKeyUp ( evt ) ;
        this . _dispatcher . dispatchKeyEvent ( evt ) ;
    }

    protected dispatchKeyPress ( evt : CanvasKeyBoardEvent ) : void {
        super . dispatchKeyPress ( evt ) ;
        this . _dispatcher . dispatchKeyEvent ( evt ) ;
    }
}


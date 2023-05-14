import {  ISprite, EOrder, SpriteFactory, IShape , ERenderType, ISpriteContainer  } from "./src/spriteSystem/interface";
import { CanvasMouseEvent, EInputEventType , CanvasKeyBoardEvent } from "./src/application";
import { vec2, Math2D } from "./src/math2d"
import { Sprite2DApplication } from "./src/spriteSystem/sprite2DApplication";

class TankFollowBezierPathDemo {
    private _app : Sprite2DApplication ;

    private _curvePts : vec2 [ ] ; 
    private _bezierPath !: IShape ;

    private _circle : IShape ;
    private _rect : IShape ;

    private _addPointEnd : boolean ;
    private _speed : number ;

    private _curveIndex : number ; 
    private _curveParamT : number ;

    private _postion : vec2 ;
    private _lastPosition : vec2 ;

    public constructor ( app : Sprite2DApplication ) {
        this . _app = app ;
        this . _addPointEnd = false ;

        this . _curveIndex = 0 ;
        this . _curveParamT = 0 ;

        this . _postion = vec2 . create ( ) ;
        this . _lastPosition = vec2 .create ( ) ;
        
        this . _speed = 5 ;
        this . _curvePts = [ ] ;

        this . _circle = SpriteFactory . createCircle ( 5 ) ; 
        this . _rect = SpriteFactory . createRect ( 10 , 10 , 0.5  , 0.5  ) ;

        if ( this . _app . rootContainer . sprite !== undefined ) {
            this . _app . rootContainer . sprite . mouseEvent = this . mouseEvent .bind ( this ) ;
            this . _app . rootContainer . sprite . keyEvent = this . keyEvent . bind ( this ) ;
        }
        
        this . _app . start ( ) ;
    }

    private mouseEvent ( spr: ISprite, evt: CanvasMouseEvent ) : void {
       if ( evt . type === EInputEventType . MOUSEDOWN ) {
            if (spr === this . _app . rootContainer . sprite   ) {
                if ( this . _addPointEnd === true ) {
                    return ;
                }
                if ( this . _curvePts . length % 2 === 0 ) {
                    this . createBezierMarker ( evt . canvasPosition . x , evt . canvasPosition . y , true ) ;
                } else {
                    this . createBezierMarker ( evt . canvasPosition . x , evt . canvasPosition . y , false ) ;
                } 
            } 
       }
    }

    private keyEvent ( spr: ISprite , evt: CanvasKeyBoardEvent ) : void {
        if ( evt . type === EInputEventType . KEYUP ) {
            if ( evt . key === 'e') {
                if ( this . _addPointEnd === true ) {
                    return ;
                }
                if ( this . _curvePts . length > 3 ) {
                    if ( (this . _curvePts . length - 1 ) % 2 > 0 ) {
                        this . _curvePts . push ( this . _curvePts [ 0 ] ) ;
                        this . _addPointEnd = true ;
                        this . createBezierPath ( ) ;
                        this . _postion . x =  this . _curvePts [ 0 ] . x ;
                        this . _postion . y = this . _curvePts [ 0 ] . y ;
                        this . createTank ( this . _postion . x , this . _postion . y , 80 , 50 , 80 ) ;
                    }
                }
            } else if ( evt . key === 'r')
            {
                if ( this . _addPointEnd === true ) {
                    this . _addPointEnd = false ;
                    this . _curvePts = [ ] ; 
                    this . _app . rootContainer . removeAll ( false ) ; 
                }
            } 
        }
        else if ( evt . type === EInputEventType . KEYPRESS )
        {
            if ( evt . key === 'a') {
                if ( this . _addPointEnd === true ) {
                    if ( spr . name === 'turret') {
                        spr . rotation += 5 ;
                    }
                }
            } else if (  evt . key === 's' ) {
                if ( this . _addPointEnd === true ) {
                    if ( spr . name === 'turret') {
                        spr . rotation -= 5 ;
                    }
                }
            }
        }      
    }

    private updateEvent ( spr : ISprite , mesc : number , diffSec : number , travelOrder : EOrder ) : void {
        if ( travelOrder === EOrder . PREORDER ) {
            this . updateCurveIndex ( diffSec * 0.1 ) ;
            let a0 : vec2 = this . _curvePts [ this . _curveIndex * 2 ] ;  
            let a1 : vec2 = this . _curvePts [ this . _curveIndex * 2 + 1 ] ; 
            let a2 : vec2 = this . _curvePts [ this . _curveIndex * 2 + 2 ] ; 
            vec2 . copy ( this . _postion , this . _lastPosition ) ;
            Math2D . getQuadraticBezierVector ( a0 , a1 , a2 , this . _curveParamT , this . _postion ) ;
            spr . x = this . _postion . x ;
            spr . y = this . _postion . y ;
            spr . rotation = vec2 . getOrientation ( this . _lastPosition , this . _postion , false ) ;
        }
    }

    private renderEvent ( spr : ISprite , context : CanvasRenderingContext2D , renderOrder : EOrder ) : void {
        if ( renderOrder === EOrder . POSTORDER ) {
            context . save ( ) ;
            context . translate ( 100 , 0 ) ;
            context . beginPath ( ) ;
            context . arc ( 0 , 0 , 5 , 0 , Math . PI * 2 ) ;
            context . fill ( ) ;
            context . restore ( ) ;
        } else {
            context . save ( ) ;
            context . translate ( 80 , 0 ) ;
            context . fillRect ( -5 , -5 , 10 , 10 ) ;
            context . restore ( ) ;    
        }
    }

    private getCurveCount ( ) : number {
        let n : number = this . _curvePts . length ;
        if ( n === 0 ) {
            return 0 ;
        }
        return  ( n - 1 ) / 2 ;
    }

    private updateCurveIndex ( diffSec : number ) : void {
        this . _curveParamT += this . _speed * diffSec ;
        if ( this . _curveParamT >= 1.0 ) {
            this . _curveIndex ++ ; 
            this . _curveParamT = this . _curveParamT % 1.0 ;
        }

        if ( this . _curveIndex >= this . getCurveCount ( ) ) {
            this . _curveIndex = 0 ;
        }
    }

    private createTank ( x : number , y : number , width : number , height : number , gunLength : number ) : void {
        let shape : IShape = SpriteFactory . createRect ( width , height , 0.5 , 0.5 ) ;
        let tank : ISprite = SpriteFactory . createISprite ( shape , x , y , 0 , 1 , 1 );
        tank . fillStyle = 'grey' ;
        tank . name = "tank";
        //tank . renderType = ERenderType . CLIP ;
        this . _app . rootContainer . addSprite ( tank ) ;

        shape = SpriteFactory . createEllipse ( 15 , 10 ) ;
        let turret : ISprite = SpriteFactory . createISprite ( shape  ) ;
        turret . fillStyle = 'red' ;
        turret . name = "turret" ;
        turret . keyEvent = this . keyEvent . bind ( this ) ;
        tank . owner . addSprite ( turret ) ;
        
        shape = SpriteFactory . createLine ( vec2 . create ( 0 , 0 ) , vec2 . create ( gunLength , 0) ) ;
        let gun : ISprite  = SpriteFactory . createISprite ( shape ) ;
        gun . strokeStyle = 'blue' ;
        gun . lineWidth = 3 ;
        gun . name = 'gun' ;
        gun . renderEvent = this . renderEvent . bind ( this ) ;
        turret . owner . addSprite ( gun ) ;

        //tank . owner . addSprite ( SpriteFactory . createClipSprite ( ) ) ;
        
        if ( tank . owner . sprite !== undefined ) {
            tank . owner . sprite . updateEvent = this . updateEvent . bind ( this ) ;
        }
    }

    private createBezierMarker ( x : number , y : number , isCircle : boolean ) : void {
        let idx : number = this . _curvePts . length ;
        this . _curvePts . push ( vec2 . create ( x , y ) ) ;
        let sprite : ISprite ;
        if ( isCircle ) {
            sprite = SpriteFactory . createSprite ( this . _circle) ;
            sprite . fillStyle = 'blue' ; 
        } else {
            sprite = SpriteFactory . createSprite ( this . _rect  ) ;
            sprite . fillStyle = 'red'  ; 
        }
        sprite . x = x ;
        sprite . y = y ;
        sprite . name = "curvePt"+ this . _curvePts . length ;
        this . _app . rootContainer . addSprite ( sprite ) ;
        sprite . mouseEvent = ( spr: ISprite, evt: CanvasMouseEvent ) : void =>  {
            if ( evt . type === EInputEventType .MOUSEDRAG ) {
                spr . x = evt . canvasPosition . x ;
                spr . y = evt . canvasPosition . y ; 
                this . _curvePts [ idx ] . x = spr . x ;
                this . _curvePts [ idx ] . y = spr . y ;
            } 
        }
    }
    
    private createBezierPath ( ) : void {
        this . _bezierPath = SpriteFactory . createBezierPath ( this . _curvePts ) ;
        let sprite : ISprite =  SpriteFactory . createSprite ( this . _bezierPath)  ;
        sprite . strokeStyle = 'blue' ;
        sprite . renderType = ERenderType . STROKE ;
        sprite . name = "bezierPath" ;
        this . _app . rootContainer . addSprite ( sprite ) ;
        for ( let i : number = 1 ; i < this . _curvePts . length ; i += 2 ) {
            this . createLine ( this . _curvePts [ i - 1 ] , this . _curvePts [ i ] , i ) ;
        }
    }

    private createLine ( start : vec2 , end : vec2 , idx : number ) : void {
        let line : ISprite = SpriteFactory . createISprite ( SpriteFactory . createLine ( start , end ) , 0 , 0 ) ;
        line . lineWidth = 2 ;
        line . strokeStyle = 'green' ;
        line . name = "line" + idx ;
        this . _app . rootContainer . addSprite ( line ) ;
    }
}

let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
new TankFollowBezierPathDemo ( new Sprite2DApplication ( canvas , true ) ) ;

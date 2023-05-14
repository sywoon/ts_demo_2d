import {  ISprite, SpriteFactory, IShape , ERenderType, ISpriteContainer , ITransformable , IRenderState, EOrder  } from "./src/spriteSystem/interface";
import { CanvasMouseEvent, EInputEventType , CanvasKeyBoardEvent } from "./src/application";
import { vec2, Math2D , mat2d, Rectangle , Size } from "./src/math2d"
import { Sprite2DApplication } from "./src/spriteSystem/sprite2DApplication";
import { BaseShape2D } from "./src/spriteSystem/shapes";

class TankShape extends BaseShape2D {
    private _size : Size ;
    private _width : number ;

    public constructor ( size : Size = Size . create ( 80 , 50 ) , turretWidth : number  = 100 ) {
        super ( ) ;
        this . _size = size ;
        this . _width = turretWidth ;
    }

    public hitTest ( localPt : vec2 , transform : ITransformable ) : boolean {
        return false ;
    }

    public get type ( ) : string {
        return 'tank' ;
    }

    public draw ( transformable : ITransformable , state : IRenderState , context: CanvasRenderingContext2D, ): void {
       context . save ( ) ;
            context . fillRect ( - this . _size . width * 0.5 , - this . _size . height * 0.5 , this . _size . width , this . _size . height  ) ;
            context . save ( ) ;
                context . strokeStyle = 'red' ;
                context . lineWidth = 5 ;
                context . beginPath ( ) ;
                context . moveTo ( 0 , 0 ) ;
                context . lineTo ( this . _width , 0 ) ;
                context . stroke ( ) ;
            context . restore ( ) ;
        context . restore ( ) ;
        //super . draw ( transformable , state , context ) ;
    }
}

class SimpleTankTest {
    private _app : Sprite2DApplication ;
    private _tankSprite : ISprite ;
    private _turretSprite : ISprite ;

    private _tank : ISprite ;

    public constructor ( app : Sprite2DApplication ) {
        this . _app = app ;
        
        this . _tankSprite = SpriteFactory . createSprite ( SpriteFactory . createRect ( 80 , 50 , 0.5 , 0.5 ) ) ;
        this . _tankSprite . fillStyle = 'blue' ;
        this . _tankSprite . x = 200 ;
        this . _tankSprite . y = 300 ;
        this . _tankSprite . keyEvent = this . keyEvent . bind ( this ) ;
        
        this . _turretSprite = SpriteFactory . createSprite ( SpriteFactory . createXLine ( 100 ) ) ;
        this . _turretSprite . strokeStyle = 'red' ;
        this . _turretSprite . lineWidth = 5 ;
        this . _turretSprite . x = 200 ;
        this . _turretSprite . y = 300 ;
        this . _turretSprite . keyEvent = this . keyEvent . bind ( this ) ;

        this . _tank = SpriteFactory . createSprite ( new TankShape ( )  ) ;
        this . _tank . x =  400 ;
        this . _tank . y = 300 ;
        this . _tank . fillStyle = 'green' ;
        this . _tank . keyEvent = this . keyEvent . bind ( this ) ;

        this . _app . rootContainer . addSprite ( this . _tankSprite ) ;
        this . _app . rootContainer . addSprite ( this . _turretSprite ) ;
        this . _app . rootContainer . addSprite ( this . _tank ) ;

        this . _app . start ( ) ;
    }

    private keyEvent ( spr : ISprite , evt : CanvasKeyBoardEvent ) : void {
        if ( evt . type === EInputEventType . KEYPRESS ) {
            if ( evt . key === 'a'){
                this . _tankSprite . rotation += 2 ;
                this . _turretSprite . rotation += 2 ;
            } else if ( evt . key === 'q') {
                this . _tankSprite . rotation -= 2 ;
                this . _turretSprite . rotation -= 2 ;
            } else if ( evt . key === 'd' ) {
                this . _turretSprite . rotation += 5 ;
            } else if ( evt . key === 'e') {
                this . _turretSprite . rotation -= 5 ;
            } else if ( evt . key === 'w' ) {
                let forward : vec2 = this . _tankSprite . getWorldMatrix ( ) . xAxis ;
                this . _tankSprite . x += forward . x * 3 ;
                this . _tankSprite . y += forward . y * 3 ;
                this . _turretSprite . x += forward . x * 3 ;
                this . _turretSprite . y += forward . y * 3 ;
            } else if ( evt . key === 's' ) {
                let forward : vec2 = this . _tankSprite . getWorldMatrix ( ) . xAxis ;
                this . _tankSprite . x -= forward . x * 3 ;
                this . _tankSprite . y -= forward . y * 3 ;
                this . _turretSprite . x -= forward . x * 3 ;
                this . _turretSprite . y -= forward . y * 3 ;
            }
        }
    }
}

let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
new SimpleTankTest ( new Sprite2DApplication ( canvas , false ) ) ;


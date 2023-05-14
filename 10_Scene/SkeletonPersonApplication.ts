import {  ISprite, SpriteFactory, IShape ,  ISpriteContainer , EOrder  } from "./src/spriteSystem/interface";
import { CanvasMouseEvent, EInputEventType , CanvasKeyBoardEvent } from "./src/application";
import { vec2 } from "./src/math2d"
import { Sprite2DApplication } from "./src/spriteSystem/sprite2DApplication";

class SkeletonPersonApplication {
    private _app : Sprite2DApplication ; 
    private _skeletonPerson ! : ISprite ; 
    private _bone : IShape ; 

    private _linePerson ! : ISprite ;
    private _line : IShape ;
    

    private _boneLen : number ; 
    private _armScale : number ; 
    private _hand_foot_Scale : number ;
    private _legScale : number ;
    private _hittedBoneSprite : ISprite | null ;

    public constructor ( app : Sprite2DApplication ) {
        this . _app = app ;
        this . _hittedBoneSprite = null ;
        this . _boneLen = 60 ;
        this . _armScale = 0.8 ;
        this . _hand_foot_Scale = 0.4 ;
        this . _legScale = 1.5 ;
        this . _bone  = SpriteFactory . createBone ( this . _boneLen , 0 ) ;
        this . createSkeleton ( ) ; 

        this . _line = SpriteFactory . createXLine ( this . _boneLen , 0 ) ;
        this . createLineSkeleton ( ) ;
        this . _app . start ( ) ; 
    }

    private createBoneSprite ( scale : number , rotation : number , parent : ISpriteContainer  , name : string = '') : ISprite {
        let spr : ISprite = SpriteFactory . createSprite ( this . _bone ) ;
        spr . lineWidth = 2 ;
        spr. strokeStyle = 'red' ;
        spr . rotation = rotation ;
        spr . scaleX = scale ;
        spr . mouseEvent = this . mouseEvent . bind ( this ) ;
        spr . name = name ;
        parent . addSprite ( spr ) ;
        return spr ;
    }

    private createLineSprite ( scale : number , rotation : number , parent : ISpriteContainer  , name : string = '') : ISprite {
        let spr : ISprite = SpriteFactory . createSprite ( this . _line ) ;
        spr . lineWidth = 2 ;
        spr. strokeStyle = 'red' ;
        spr . rotation = rotation ;
        spr . scaleX = scale ;
        spr . mouseEvent = this . mouseEvent . bind ( this ) ;
        spr . name = name ;
        parent . addSprite ( spr ) ;
        return spr ;
    }


    private createSkeleton ( x : number = 200  , y : number = 200  )  {
        let spr : ISprite ;
        this . _skeletonPerson = this . createBoneSprite ( 1.0 , -90 ,  this . _app . rootContainer , 'person') ;
        this . _skeletonPerson . x = x ;
        this . _skeletonPerson . y = y ;
        let circle : IShape = SpriteFactory . createCircle ( 10 ) ;
        spr = SpriteFactory . createISprite ( circle , this . _boneLen , 0 ) ;
        spr . fillStyle = 'blue' ;
        spr . rotation =  0 ;
        this . _skeletonPerson . owner . addSprite ( spr ) ; 
            spr = this . createBoneSprite ( this . _armScale , -90 , this . _skeletonPerson . owner ) ;
                spr = this . createBoneSprite ( this . _hand_foot_Scale , -90 , spr . owner ) ;
                spr . x = this . _boneLen ;
            spr = this . createBoneSprite ( this . _armScale , 90 , this . _skeletonPerson . owner ) ;
                spr = this . createBoneSprite ( this . _hand_foot_Scale , 90 , spr . owner ) ;
                    spr . x = this . _boneLen ;

            spr = this . createBoneSprite ( this . _legScale , -160 , this . _skeletonPerson . owner ) ;
                spr = this . createBoneSprite ( this . _hand_foot_Scale , 70 , spr . owner ) ;
                spr . x = this . _boneLen ;
            spr = this . createBoneSprite ( this . _legScale , 160 , this . _skeletonPerson . owner ) ;
                spr = this . createBoneSprite ( this . _hand_foot_Scale , -70 , spr . owner ) ;
                spr . x = this . _boneLen ;

        if ( this . _app . rootContainer . sprite !== undefined ) {
            this . _app . rootContainer . sprite . mouseEvent = this . mouseEvent . bind ( this ) ;
            this . _app . rootContainer . sprite . keyEvent = this . keyEvent . bind ( this ) ;
        } 
    }

    private createLineSkeleton ( x : number = 400  , y : number = 200  )  {
        let spr : ISprite ;
        this . _linePerson = this . createLineSprite ( 1.0 , -90 ,  this . _app . rootContainer , 'person2') ;
        this . _linePerson . x = x ;
        this . _linePerson . y = y ;

        let circle : IShape = SpriteFactory . createCircle ( 10 ) ;
        spr = SpriteFactory . createISprite ( circle , this . _boneLen , 0 ) ;
        spr . fillStyle = 'blue' ;
        spr . rotation =  0 ;
        this . _linePerson . owner . addSprite ( spr ) ;
            spr = this . createLineSprite ( this . _armScale , -90 , this . _linePerson . owner ) ;
                spr = this . createLineSprite ( this . _hand_foot_Scale , -90 , spr . owner ) ;
                spr . x = this . _boneLen ;

            spr = this . createLineSprite ( this . _armScale , 90 , this . _linePerson . owner ) ;
                spr = this . createLineSprite ( this . _hand_foot_Scale , 90 , spr . owner ) ;
                    spr . x = this . _boneLen ;
 
            spr = this . createLineSprite ( this . _legScale , -160 , this . _linePerson . owner ) ;
                spr = this . createLineSprite ( this . _hand_foot_Scale , 70 , spr . owner ) ;
                spr . x = this . _boneLen ;
    
            spr = this . createLineSprite ( this . _legScale , 160 , this . _linePerson . owner ) ;
            spr . renderEvent = this . renderEvent . bind ( this ) ;
                spr = this . createLineSprite ( this . _hand_foot_Scale , -70 , spr . owner ) ;
                spr . x = this . _boneLen ;
    }

    private mouseEvent ( s : ISprite , evt : CanvasMouseEvent ) : void { 
        if ( evt . button === 0 ) {
            if ( evt . type === EInputEventType . MOUSEDOWN ) {
                if ( s === this . _app . rootContainer . sprite ) {
                    if ( this . _hittedBoneSprite !== null ) {
                        this . _hittedBoneSprite . strokeStyle = 'red' ;
                        this . _hittedBoneSprite . lineWidth = 2 ;
                    }
                } else if (this . _hittedBoneSprite !== s ) { 
                    if ( this . _hittedBoneSprite !== null ) {
                        this . _hittedBoneSprite . strokeStyle = 'red' ;
                        this . _hittedBoneSprite . lineWidth = 2 ;   
                    }
                    this . _hittedBoneSprite = s ; 
                    this . _hittedBoneSprite . strokeStyle = 'green' ; 
                    this . _hittedBoneSprite . lineWidth = 4 ;    
                }
            } 
            else if ( evt . type === EInputEventType . MOUSEDRAG ) 
            {
                if ( s . owner . getParentSprite ( )  === this . _app . rootContainer . sprite  ) 
                {
                    s . x = evt . canvasPosition . x ;
                    s . y = evt . canvasPosition . y ;
                }
            }
        } 
    }

    private keyEvent ( spr : ISprite , evt : CanvasKeyBoardEvent ) : void {
        if ( this . _hittedBoneSprite === null ) {
            return ;
        }
        if ( evt . type === EInputEventType . KEYPRESS ) {
            if ( evt . key === 'f'){
                this . _hittedBoneSprite . rotation += 1 ;
            } else if ( evt . key === 'b') {
                this . _hittedBoneSprite . rotation -= 1 ;
            }
        }
    }

    private renderEvent ( spr : ISprite , context : CanvasRenderingContext2D , renderOreder : EOrder ) : void {
        if ( EOrder . PREORDER ) return ;
        let orgin : vec2 = spr . getWorldMatrix ( ) . origin ;
        context . save ( ) ;
        context . setTransform ( 1 , 0 , 0 , 1 , orgin . x , orgin . y  ) ;
        context . beginPath ( ) ;
        context . fillStyle = 'blue' ;
        context . arc ( 0 , 0 , 5 , 0 , Math . PI * 2 ) ;
        context . fill ( ) ;
        context . restore ( ) ;   
    }
}

let canvas: HTMLCanvasElement | null = document.getElementById('canvas') as HTMLCanvasElement;
new SkeletonPersonApplication ( new Sprite2DApplication ( canvas , true ) ) ;

import { TreeNode, NodeEnumeratorFactory } from "../treeNode";
import { IEnumerator } from "../IEnumerator" ;
import { CanvasKeyBoardEvent, CanvasMouseEvent, Canvas2DApplication, EInputEventType } from "../application";
import { ISprite,  EOrder ,IDispatcher, SpriteFactory, ERenderType, ISpriteContainer } from "./interface";
import { mat2d, vec2, Math2D } from "../math2d";

export class SpriteNode extends TreeNode < ISprite > implements ISpriteContainer {
    public constructor ( sprite : ISprite  , parent : SpriteNode | undefined = undefined , name : string = "spriteNode" ) {
        super ( sprite , parent , name ) ;
    }

    public addSprite ( sprite : ISprite ) : ISpriteContainer {
        let node : SpriteNode = new SpriteNode ( sprite , this , sprite . name ) ;
        return node ;
    }
    
    public removeSprite ( sprite : ISprite ) : boolean {
        let idx : number = this . getSpriteIndex ( sprite ) ;
        if ( idx === -1 ) {
            return false ;
        }
        if ( this . removeChildAt ( idx ) === undefined ) {
            return false ;
        } else {
            return true ;
        }
    }

    public removeAll ( includeThis : boolean  ) : void {
        let iter:IEnumerator<TreeNode<ISprite>>  = NodeEnumeratorFactory.create_bf_r2l_b2t_iter(this);
        let current: TreeNode<ISprite> | undefined = undefined;
        while ( iter . moveNext ( ) ) {
            current = iter .current ;
            if ( current !== undefined ) {
              {
                    if (current . data !== undefined ) {
                        if ( current === this ) {
                            if ( includeThis === true ) {
                                current . data = undefined ;
                                current = current . remove ( ) ;
                            }
                        } else {
                            current . data = undefined ;
                            current = current . remove ( ) ;
                        }
                    }
                }
            }
        }
    }

    public getSprite ( idx : number ) : ISprite {
        if ( idx < 0 || idx > this . childCount -1 ) {
            throw new Error ( "参数idx越界!!" ) ;
        }
        let spr : ISprite | undefined = ( this . getChildAt ( idx ) as SpriteNode ) . sprite
        if ( spr === undefined ) {
            alert ( "sprite 为undefined，请检查原因!!!" ) ;
            throw new Error ( "sprite 为undefined，请检查原因!!!" ) ;
        }

        return spr ;
    }

    public getParentSprite ( ) : ISprite | undefined {
        let parent : SpriteNode | undefined = this . parent as SpriteNode ;
        if ( parent !== undefined ) {
            return parent . sprite ;
        } else {
            return undefined ;
        }
    }

    public getSpriteCount ( ) : number {
        return this . childCount ;
    }

    public getSpriteIndex ( sprite: ISprite ): number {
        for ( let i : number = 0 ; i < this . childCount ; i ++ ) {
            let child : SpriteNode = this . getChildAt ( i ) as SpriteNode ;
            if ( child !== undefined ) {
                if ( child . sprite !== undefined ) {
                   if ( child . sprite === sprite ) {
                       return i ;
                   } 
                }
            }
        }
        return - 1;
    }
 
    public addChildAt ( child : TreeNode < ISprite > , index : number ) : TreeNode < ISprite > | undefined {
        let ret : TreeNode < ISprite > | undefined = super . addChildAt ( child , index ) ;
        if ( ret !== undefined ) {
            if ( ret . data ) {
                ret . data . owner = ret as SpriteNode ;
            }
        }

        return ret;
    }

    public get sprite ( ) : ISprite | undefined {
        return this . data ;
    }
      
    public removeChildAt ( index : number ) : TreeNode < ISprite > | undefined {
        let ret: TreeNode < ISprite > | undefined = super . removeChildAt ( index ) ;
        return ret;
    }

    public findSprite ( src : vec2 , localPoint : vec2 | null = null ): ISprite | undefined {
        let iter : IEnumerator < TreeNode < ISprite > >  = NodeEnumeratorFactory . create_bf_r2l_b2t_iter ( this . root ) ;
        let current : TreeNode<ISprite> | undefined = undefined ;
        let mat : mat2d ;
        let dest : vec2 = vec2 . create ( ) ;
        while( iter . moveNext ( ) ) {
            current = iter . current ;
            if ( current !== undefined ) {
                if( current . data !== undefined ) {
                    mat = current . data . getLocalMatrix ( ) ;
                    {
                        Math2D . transform ( mat , src , dest ) ;
                        if( current . data . hitTest ( dest ) ) {
                            if ( localPoint !== null ) {
                                localPoint . x = dest . x ;
                                localPoint . y = dest . y ;
                            }
                            return current . data ;
                        }
                    }
                }
            }
        }
        return undefined ;
    }

    public draw ( context: CanvasRenderingContext2D ): void {
        if ( this . sprite !== undefined ) {
            this . sprite . draw ( context ) ;
            this . _drawChildren ( context ) ;
        }
    }

    protected _drawChildren ( context: CanvasRenderingContext2D ): void {
        for ( let i : number = 0; i < this . childCount ; i++ ) {
            let child : TreeNode < ISprite > | undefined = this . getChildAt ( i ) ;
            if ( child !== undefined ) {
                let spriteNode : SpriteNode = child as SpriteNode ;
                spriteNode . draw ( context ) ;
            }
        }
    }

    public update ( msec : number , diffSec : number ) : void {
        if ( this . sprite !== undefined ) {
            this . sprite . update ( msec , diffSec , EOrder . PREORDER ) ;
            this . _updateChildren ( msec , diffSec ) ;
            this . sprite . update ( msec , diffSec , EOrder . POSTORDER ) ;
        }
    }

    protected _updateChildren ( msec : number,diffSec : number ) : void {
        for ( let i = 0 ; i < this . childCount ; i++ ) {
            let child : TreeNode<ISprite> | undefined = this . getChildAt ( i ) ;
            if ( child !== undefined ) {
                let spriteNode : SpriteNode = child as SpriteNode ;
                spriteNode . update ( msec , diffSec ) ;
            }
        }
    }  
}

export class SpriteNodeManager implements IDispatcher {
    private _rootNode : SpriteNode ;
    private _dragSprite : ISprite | undefined  = undefined ;
    public constructor ( width : number , height : number ) {
        let spr : ISprite = SpriteFactory . createISprite ( SpriteFactory . createGrid ( width , height ) ) ;
        spr . name = 'root' ;
        spr . strokeStyle = "black" ;
        spr . fillStyle ='white' ;
        spr . renderType = ERenderType . STROKE_FILL ;
        this . _rootNode = new SpriteNode (  spr , undefined , spr . name ) ;
        spr . owner = this . _rootNode ;
    }

    public get container ( ) : ISpriteContainer {
        return this . _rootNode ;
    }

    public dispatchMouseEvent ( evt : CanvasMouseEvent ) : void {
        if ( evt . type === EInputEventType . MOUSEUP ) {
            this . _dragSprite = undefined ;
        } else if (evt . type === EInputEventType . MOUSEDRAG) {
            if ( this . _dragSprite !== undefined ) {
                if ( this . _dragSprite . mouseEvent !== null ) {
                    this . _dragSprite . mouseEvent ( this . _dragSprite , evt ) ;
                    return ;
                }
            }
        }

        let spr : ISprite | undefined = this . _rootNode . findSprite ( evt . canvasPosition , evt . localPosition ) ;
        if ( spr !== undefined ) {
            evt . hasLocalPosition = true ;
            if ( evt . button === 0 && evt . type === EInputEventType . MOUSEDOWN ) {
                this . _dragSprite = spr ;
            } 
            
            if ( evt . type === EInputEventType . MOUSEDRAG )
                return ;

            if ( spr . mouseEvent ) {
                spr . mouseEvent ( spr , evt  ) ;
                return ;
            }
        } else {
            evt . hasLocalPosition = false ;
        }
    }


    public dispatchKeyEvent ( evt: CanvasKeyBoardEvent ) : void {
        this . _rootNode . visit ( 
            ( node : TreeNode < ISprite > ) :  void => {
                if ( node . data !== undefined ) {
                    if ( node . data . keyEvent !== null ) {
                        node . data . keyEvent ( node . data , evt  ) ;
                    }
                }
            }
        ) ;
    }

    dispatchUpdate ( msec : number , diffSec : number ) : void {
        this . _rootNode . update ( msec , diffSec ) ;
    }

    dispatchDraw ( context : CanvasRenderingContext2D ) : void {
        this . _rootNode . draw ( context ) ;
    }
}

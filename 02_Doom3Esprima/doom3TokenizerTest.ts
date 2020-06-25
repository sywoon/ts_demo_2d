import { IDoom3Tokenizer, Doom3Factory, ETokenType } from "./src/doom3Tokenizer";
import { HttpRequest, HttpResponse } from "./src/HttpRequest"

let str: string = ` //这是开单引号，不是单引号 
numMeshes  5
/*
* joints关键词定义了骨骼动画的bindPose
*/
joints {
	"origin"	-1  ( 0 0 0 )  ( -0.5  -0.5  -0.5 )		
	"Body"	0  ( -12.1038131714  0  79.004776001 )  ( -0.5 -0.5 -0.5 )	// origin
}
`;

let str1: string = "numMeshes  5 \n /** \n * joints关键词定义了骨骼动画的bindPose \n */ \n joints { \n 'origin'	-1  ( 0 0 0 )  ( -0.5  -0.5  -0.5 ) \n 'Body'	0  ( -12.1038131714  0  79.004776001 )  ( -0.5 -0.5 -0.5 )	// origin \n }";

let str2: string = " numMeshes  5 ";
str2 += " /* ";
str2 += " * joints关键词定义了骨骼动画的bindPose ";
str2 += " */ ";
str2 += " joints { ";
str2 += "       'origin'	-1  ( 0 0 0 )  ( -0.5  -0.5  -0.5 ) "
str2 += "       'Body'	0  ( -12.1038131714  0  79.004776001 )  ( -0.5 -0.5 -0.5 )	// origin ";
str2 += " } ";

let str3: string = [
    " numMeshes  5 ",
    " /* ",
    " * joints关键词定义了骨骼动画的bindPose ",
    " */ ",
    " joints { ",
    " 'origin'	-1  ( 0 0 0 )  ( -0.5  -0.5  -0.5 ) ",
    " 'Body'	0  ( -12.1038131714  0  79.004776001 )  ( -0.5 -0.5 -0.5 )	// origin ",
    " } "
].join( " \n " );


//从Doom3Factory工厂创建IDoom3Token和IDoom3Tokenizer接口
//let token: IDoom3Token = Doom3Factory.createDoom3Token();
let tokenizer: IDoom3Tokenizer = Doom3Factory.createDoom3Tokenizer();

/*
//设置IDoom3Tokenzier要解析的数据源
tokenizer.setSource( str );

//getNextToken函数返回ture，说明仍有token需要解析
//解析的结果以传引用的方式从参数token传出来
//如果getNextToken返回false，说明已经到达字符串结尾，
while ( tokenizer.moveNext() ) {
    //如果当前的token是数字类型
    if ( tokenizer.current.type === ETokenType.NUMBER ) {
        console.log( "NUMBER = " + tokenizer.current.getFloat() ); //输出该数字的浮点值
    } else if ( tokenizer.current.isString( "joints" ) ) {
        //如果当前token是字符串类型，并且其值为joints，则输出
        console.log( "开始解析joints数据" );
    }
    else { //否则获取当前token的字符串值
        console.log( "STRING = " + tokenizer.current.getString() );
    }
}
*/

/*
//从服务器请求level.proc文件，该文件是Doom3的关卡文件，261k字节，word中字数统计，将近7万个单词
let response : HttpResponse = HttpRequest . doGet ( "level1.proc" ) ;

//请求成功的话，进行文件解析
if ( response.success === true ) {
    //将response转换为string类型，因为我们知道是文本文件
    str = response.response as string;

    //设置要解析的字符串
    tokenizer.setSource( str );
    while ( tokenizer.moveNext() ) {
        if ( tokenizer.current.type === ETokenType.NUMBER ) {
            console.log( "NUMBER : " + tokenizer.current.getFloat() );
        }
        else {
            console.log( "STRING : " + tokenizer.current.getString() );
        }
    }
}*/

function processHttpResponse ( response : HttpResponse ) : void {
    if ( response . success === true ) {
        //将response转换为string类型，因为我们知道是文本文件
        str = response . response as string ;
        //设置要解析的字符串
        tokenizer.setSource( str ) ;

        while ( tokenizer . moveNext ( ) ) {
            if ( tokenizer . current === undefined ) {
                continue ;
            }
            if ( tokenizer . current . type === ETokenType . NUMBER ) {
                console . log ( " NUMBER : " + tokenizer . current . getFloat ( ) ) ;
            }
            else {
                console . log ( " STRING : " + tokenizer . current . getString ( ) ) ;
            }
        }
    } else {
        console.log( " 请求失败 ! ! ! " ) ;
    }
}

//HttpRequest.doGetAsync( "level.proc" , processHttpResponse );

/*
//从服务器请求level.proc文件，该文件是Doom3的关卡文件，261k字节，word中字数统计，将近7万个单词
HttpRequest.doGetAsync( "level.proc", ( response : HttpResponse ) : void => {
    //请求成功或失败都是在回调函数中处理
    if ( response . success === true ) {

        //将response转换为string类型，因为我们知道是文本文件
        str = response . response as string ;

        //设置要解析的字符串
        tokenizer.setSource( str ) ;

        while ( tokenizer . moveNext ( ) ) {
            if ( tokenizer . current . type === ETokenType . NUMBER ) {
                console . log ( " NUMBER : " + tokenizer . current . getFloat ( ) ) ;
            }
            else {
                console . log ( " STRING : " + tokenizer . current . getString ( ) ) ;
            }
        }
    } else {

        console.log( " 请求失败 ! ! ! " ) ;

    }
} ) ;*/


//我们使用RequestCB作为回调函数的类型，使用=> { }进行调用
//此时你会发现没有response形参，这时候，我们可以使用RequestCB.response获取response参数
//主要的测试函数

HttpRequest . doGetAsync ( "level.proc" , RequestCB => {
    if ( RequestCB . success === true ) {

        //将response转换为string类型，因为我们知道是文本文件
        str = RequestCB . response as string ;

        //设置要解析的字符串
        tokenizer . setSource ( str ) ;

        while ( tokenizer . moveNext ( ) ) {
            if ( tokenizer . current === undefined ) {
                continue ;
            }
            
            if ( tokenizer . current . type === ETokenType . NUMBER ) {
                console . log ( " NUMBER : " + tokenizer . current . getFloat ( ) ) ;
            }
            else {
                console . log( " STRING : " + tokenizer . current . getString ( ) ) ;
            }
        }
    } 
} ) ;



/*
HttpRequest.doGetAsync( "level.proc", (response : HttpResponse):void => {
    if ( response.success === true ) {
        //将response转换为string类型，因为我们知道是文本文件
        str = response.response as string;
        
        //设置要解析的字符串
        tokenizer.setSource( str );

        while ( tokenizer.moveNext() ) {
            if ( tokenizer.current.type === ETokenType.NUMBER ) {
                console.log( "NUMBER : " + tokenizer.current.getFloat() );
            }
            else {
                console.log( "STRING : " + tokenizer.current.getString() );
            }
        }
    } 
} );
*/



/*
while ( tokenizer.getNextToken( token ) ) {
    if ( token.type === ETokenType.NUMBER ) {
        console.log( "num = " + token.getFloat() );
    } else if ( token.isString( "joints" ) ) {
        console.log( "开始解析joints数据" );
    }
    else {
        console.log( "str = " + token.getString() );
    }
}
*/

/*
let input:string = "[3.14 , -3.14 ,  .14  , -.14 , 3.  , -3.]" ;
tokenizer . setSource ( input ) ;

while(tokenizer.moveNext()){
    if ( tokenizer . current . type === ETokenType . NUMBER ) {
        console . log ( "NUMBER : " + tokenizer . current . getFloat () ) ;
    }
    else {
        console . log( "STRING : " + tokenizer . current . getString ( ) ) ;
    }
}
*/


/*
while ( tokenizer . getNextToken ( token ) ) {
    if ( token . type === ETokenType . NUMBER ) {
        console . log ( "NUMBER : " + token . getFloat () ) ;
    }
    else {
        console . log( "STRING : " + token . getString ( ) ) ;
    }
}*/

/*
tokenizer.setSource( str2 );
while ( tokenizer.getNextToken( token ) ) {
    if ( token.type === ETokenType.NUMBER ) {
        console.log( "num = " + token.getFloat() );
    } else if ( token.isString( "joints" ) ) {
        console.log( "开始解析joints数据" );
    }
    else {
        console.log( "str = " + token.getString() );
    }
}
*/




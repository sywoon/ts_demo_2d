import { TreeNode, Stack, NodeT2BEnumerator, Indexer, IndexerL2R, IndexerR2L, Queue, NodeEnumeratorFactory, NIter } from "./src/treeNode"
import { IEnumerator } from "./src/IEnumerator"
export type NumNode = TreeNode<number>

function printNodeInfo ( node: NumberNode ): void {
    console.log( node.repeatString( '    ', node.depth ) + node.name );
}


export class NumberNode extends TreeNode<number> {

}
/*
                                  树数据结构
            -------------------------root--------------------
           /                          |                      \
        node1                       node2                  node3
      /       \                    /      \                  |
    node4     node5              node6   node7             node8
      |                            |       |
    node9                        node10  node11
                                           |
                                         node12
*/


/*
                                 树数据结构
           -------------------------root--------------------
          /                          |                      \
       node1                       node2                  node3
     /       \                    /      \                  |
   node4     node5              node6   node7             node8
     |                            |       |
   node9                        node10  node11
                                          |
                                        node12
*/
export class NodeData {
    // 节点的父亲索引号，节点必须要序列化的成员变量，否则无法表示出树节点的层次性
    // parentIdx的数据类型是number,这样我们就能正确的序列化成JSON字符串
    public parentIdx: number;
    public name: string;  // 节点名称，可选的成员变量

    public constructor ( name: string, parentIdx: number ) {
        this.name = name;
        this.parentIdx = parentIdx;
    }
}

export class TreeNodeTest {

    public static createTree (): NumberNode {
        let root: NumberNode = new NumberNode( 0, undefined, " root " );

        let node1: NumberNode = new NumberNode( 1, root, " node1 " );
        let node2: NumberNode = new NumberNode( 2, root, " node2 " );
        let node3: NumberNode = new NumberNode( 3, root, " node3 " );

        let node4: NumberNode = new NumberNode( 4, node1, " node4 " );
        let node5: NumberNode = new NumberNode( 5, node1, " node5 " );
        let node6: NumberNode = new NumberNode( 6, node2, " node6 " );
        let node7: NumberNode = new NumberNode( 7, node2, " node7 " );
        let node8: NumberNode = new NumberNode( 8, node3, " node8 " );
        let node9: NumberNode = new NumberNode( 9, node4, " node9 " );
        let node10: NumberNode = new NumberNode( 10, node6, " node10 " );
        let node11: NumberNode = new NumberNode( 11, node7, " node11 " );
        let node12: NumberNode = new NumberNode( 12, node11, " node12 " );

        return root;
    }

    // 辅助方法，根据输入的枚举器，线性输出节点内容
    public static outputNodesInfo ( iter: IEnumerator<TreeNode<number>> ): string {
        let output: string[] = [];
        let current: TreeNode<number> | undefined = undefined;
        while ( iter.moveNext() ) {
            current = iter.current;
            if ( current !== undefined ) {
                output.push( current.name );
            }
        }
        return ( " 实际输出：[" + output.join( "," ) + " ] " );
    }

    public static convertTreeToJsonString<T> ( node: TreeNode<T> ): string {
        let nodes: Array<TreeNode<T>> = [];
        let datas: Array<NodeData> = [];
        for ( let n: TreeNode<T> | undefined = node; n !== undefined; n = n.moveNext() ) {
            datas.push( new NodeData( n.name, -1 ) );
            nodes.push( n );
        }
        for ( let i: number = 0; i < datas.length; i++ ) {
            // 获取当前节点的parent
            let parent: TreeNode<T> | undefined = nodes[ i ].parent;
            // 如果当前节点的父亲节点为undefined，则肯定是根节点，根节点的父亲为-1
            if ( parent === undefined ) {
                datas[ i ].parentIdx = -1;
            } else {
                // 查找当前节点的parent在深度优先的数组中的索引号
                for ( let j: number = 0; j < datas.length; j++ ) {
                    // 名称比较，更好的方式用地址比较
                    // if ( parent . name === nodes [ j ] . name )
                    if ( parent === nodes[ j ] ) {
                        datas[ i ].parentIdx = j;
                    }
                }
            }
        }
        return JSON.stringify( datas );
    }


    public static convertJsonStringToTree<T> ( json: string ): TreeNode<T> | undefined {
        // 首先我们使用JSON . parse方法，将json字符串反序列化成Array对象（datas）
        let datas: [] = JSON.parse( json );
        let data !: NodeData;
        let nodes: TreeNode<T>[] = [];
        // 根据NodeData列表生成节点数组
        for ( let i: number = 0; i < datas.length; i++ ) {
            // 将datas中每个元素都转型为NodeData对象
            data = datas[ i ] as NodeData;
            // 如果当前的NodeData的parentidx为-1，表示根节点
            // 实际上，我们的datas是深度优先，从上到下（先根前序）顺序存储的
            // 因此datas [ 0 ]肯定是根节点
            if ( data.parentIdx === - 1 ) {
                nodes.push( new TreeNode<T>( undefined, undefined, data.name ) );
            }
            else {  // 不是-1，说明有父亲节点
                // 我们利用了深度优先，从上到下（先根前序）顺序存储的nodes数组的特点
                // 上述顺序存储的数组，当前节点的父亲节点总是已经存在nodes中了
                nodes.push( new TreeNode<T>( undefined, nodes[ data.parentIdx ], data.name ) )
            }
        }

        // 返回反序列化中的根节点
        return nodes[ 0 ];
    }

    public static testTreeNode (): void {
        let root: NumberNode | undefined = TreeNodeTest.createTree();
        let jsonStr: string = TreeNodeTest.convertTreeToJsonString( root );
        root = TreeNodeTest.convertJsonStringToTree( jsonStr );
        if ( root !== undefined ) {
            root.visit( printNodeInfo, null ); 

            let idx: number = 0;
            console.log( idx++ );
            root.visit( printNodeInfo, null, IndexerL2R );
            console.log( idx++ );
            root.visit( printNodeInfo, null, IndexerR2L );
            console.log( idx++ );
            root.visit( null, printNodeInfo, IndexerL2R );
            console.log( idx++ );
            root.visit( null, printNodeInfo, IndexerR2L );
            console.log( idx++ );
            root.visit( printNodeInfo, printNodeInfo, IndexerL2R );
            console.log( idx++ );
            root.visit( printNodeInfo, printNodeInfo, IndexerR2L );

            root.visitForward( printNodeInfo, null ); 
            root.visitForward( null, printNodeInfo ); 
            root.visitForward( printNodeInfo, printNodeInfo );  

            root.visitBackward( printNodeInfo, null ); 
            root.visitBackward( null, printNodeInfo );  
            root.visitBackward( printNodeInfo, printNodeInfo ); 

            for ( let n: TreeNode<number> | undefined = root; n !== undefined; n = n.moveNext() ) {
                console.log( "moveNext : " + n.repeatString( ' ', n.depth * 4 ) + n.name );
            }
            for ( let n: TreeNode<number> | undefined = root; n !== undefined; n = n.movePrev() ) {
                console.log( "movePrev : " + n.repeatString( ' ', n.depth * 4 ) + n.name );
            }
            for ( let n: TreeNode<number> | undefined = root.mostLeft; n !== undefined; n = n.moveNextPost() ) {
                console.log( "moveNextPost : " + n.repeatString( ' ', n.depth * 4 ) + n.name );
            }
            for ( let n: TreeNode<number> | undefined = root.mostRight; n !== undefined; n = n.movePrevPost() ) {
                console.log( "movePrevPost : " + n.repeatString( ' ', n.depth * 4 ) + n.name );
            }

            let iter: IEnumerator<TreeNode<number>>; 
            let current: TreeNode<number> | undefined = undefined; 

            console.log( " 1、depthFirst_left2rihgt_top2bottom_enumerator " );
            iter = NodeEnumeratorFactory.create_df_l2r_t2b_iter<number>( root );
            while ( iter.moveNext() ) {
                current = iter.current;
                if ( current !== undefined ) {
                    // 根据当前的depth获得缩进字符串（下面使用空格字符），然后和节点名合成当前节点输出路径
                    console.log( current.repeatString( " ", current.depth * 4 ) + current.name );
                }
            }

            console.log( " 2、depthFirst_right2left_top2bottom_enumerator " );
            console.log( " 应该输出：[ root , node3 , node8 , node2 , node7 , node11 , node12 , node6 , node10 , node1 , node5 , node4 , node9  ] " );
            iter = NodeEnumeratorFactory.create_df_r2l_t2b_iter<number>( root );
            console.log( TreeNodeTest.outputNodesInfo( iter ) );

            console.log( " 3、depthFirst_left2right_bottom2top_enumerator " );
            iter = NodeEnumeratorFactory.create_df_l2r_b2t_iter<number>( root );
            console.log( " 应该输出：[ node9 , node4 , node5 , node1 , node10 , node6 , node12 , node11 , node7 , node2 , node8 , node3 , root  ] " );
            console.log( TreeNodeTest.outputNodesInfo( iter ) );

            console.log( " 4、depthFirst_right2left_bottom2top_enumerator " );
            iter = NodeEnumeratorFactory.create_df_r2l_b2t_iter<number>( root );
            console.log( " 应该输出：[ node8 , node3 , node12 , node11 , node7 , node10 , node6 , node2 , node5 , node9 , node4 , node1 , root  ] " );
            console.log( TreeNodeTest.outputNodesInfo( iter ) );

            console.log( " 5、breadthFirst_left2right_top2bottom_enumerator " );
            iter = NodeEnumeratorFactory.create_bf_l2r_t2b_iter<number>( root );
            console.log( " 应该输出：[ root , node1 , node2 , node3 , node4 , node5 , node6 , node7 , node8 , node9 , node10 , node11 , node12  ] " );
            console.log( TreeNodeTest.outputNodesInfo( iter ) );

            console.log( " 6、breadthFirst_rihgt2left_top2bottom_enumerator " );
            iter = NodeEnumeratorFactory.create_bf_r2l_t2b_iter<number>( root );
            console.log( " 应该输出：[ root , node3 , node2 , node1 , node8 , node7 , node6 , node5 , node4 , node11 , node10 , node9 , node12  ] " );
            console.log( TreeNodeTest.outputNodesInfo( iter ) );

            console.log( " 7、breadthFirst_left2right_bottom2top_enumerator " );
            iter = NodeEnumeratorFactory.create_bf_l2r_b2t_iter<number>( root );
            console.log( " 应该输出：[ node12 , node9 , node10 , node11 , node4 , node5 , node6 , node7 , node8 , node1 , node2 , node3 , root  ] " );
            console.log( TreeNodeTest.outputNodesInfo( iter ) );

            console.log( " 8、breadthFirst_right2left_bottom2top_enumerator " );
            iter = NodeEnumeratorFactory.create_bf_r2l_b2t_iter<number>( root );
            console.log( " 应该输出：[ node12 , node11 , node10 , node9 , node8 , node7 , node6 , node5 , node4 , node3 , node2 , node1 , root  ] " );
            console.log( TreeNodeTest.outputNodesInfo( iter ) );
        }
    }
}

TreeNodeTest.testTreeNode();
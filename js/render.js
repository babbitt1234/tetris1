//canvasタグを指定して要素を取得
var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
//getContext("2d") オブジェクトは、線、ボックス、円、などを描画するメソッドを持っている
var ctx = canvas.getContext( '2d' ); 
//キャンバス(4 * 4)の全体のサイズ
var W = 300, H = 600;
//１つあたりのマス(1/16)の幅を30に設定
var BLOCK_W = W / COLS, BLOCK_H = H /ROWS; 

//x,yの部分のマスを描画する処理
function drawBlock( x, y ){
    //ブロックを塗りつぶす
    //fillRect(四角形の左上のx座標, 四角形の左上のy座標, 四角形の幅, 四角形の高さ)
    //BLOCK_W - 1(29)とすることで程よい隙間を作る
    ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
    //輪郭を描く
    ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}

//盤面と操作ブロックを描写する
function render(){
    //一度キャンバスをまっさらにする
    //キャンバス(4 * 4)の一番左上の座標から一番右下の座標までをクリア
    ctx.clearRect( 0, 0, W, H );
    //strokeStyle = ブロックの線の色
    ctx.strokeStyle = 'black';
    
    //盤面を一つずつ描写する
    for ( var x = 0; x < COLS; ++x ){
        for ( var y = 0; y < ROWS; ++y ){
            //board[ y ][ x ]=0だったらfalseとなるので、次の処理に進む
            if ( board[ y ][ x ] ){
                //マスの種類に合わせて塗りつぶす色を設定
                //colors[ board[ y ][ x ] - 1 ]と、最後に-1をすることで、var colorsの配列（0~6）に対応させている
                ctx.fillStyle = colors[ board[ y ][ x ] - 1 ]; 
                //色設定後マスを描画
                drawBlock( x, y ); 
            }
        }
    }
    
    //操作ブロックを一つずつ描画する
    for ( var y = 0; y < 4; ++y ){
        for  ( var x = 0; x < 4; ++x ){
            if ( current[ y ][ x ] ){
                //マスの種類に合わせて塗りつぶす色を設定
                ctx.fillStyle = colors[ current [ y ][ x ] - 1]; 
                //マスを描画
                //currentX,currentYは操作ブロックまでの距離
                drawBlock( currentX + x, currentY + y ); 
            }
        }
    }
}

// 30ミリ秒(0.03秒)ごとに状態を描画する関数(render)をよびだす
setInterval( render, 30 );
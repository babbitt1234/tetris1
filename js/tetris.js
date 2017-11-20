//横10、縦20
var COLS = 10, ROWS = 20;
//盤面情報（空の配列）
var board = [];
//一番上まで行ったかどうか
var lose;
//ゲームを実行するタイマーを保持する変数
var interval;
//今操作しているブロックの形
var current;
//今操作しているブロックの位置
var currentX, currentY;

var cl = console.log;

//ブロックのパターン(id=0~6)
var shapes = [
    //id=0
    [1, 1, 1, 1],
    //id=1
    [1, 1, 1, 0, 
     1],
    //id=2
    [1, 1, 1, 0, 
     0, 0, 1],
    //id=3
    [1, 1, 0, 0,
     1, 1],
    //id=4
    [1, 1, 0, 0,
     0, 1, 1],
    //id=5
    [0, 1, 1, 0,
     1, 1],
    //id=6
    [0, 1, 0, 0, 
     1, 1, 1]
];

//ブロックの色(id=0~6)
var colors  = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];

//ランダムにブロックのパターンを出力し、盤面の一番上へセットする
function newShape(){
    //Math.floor()で切り捨て。idにはshapes内の0~6のランダムな値が入る。
    var id = Math.floor( Math.random() * shapes.length );
    //idを基にshapesからブロックをとりだす（ id=0だったら[1, 1, 1, 1]などの配列を取り出す）
    var shape = shapes[ id ];
    
//    cl(shape);
    
    //パターンを操作ブロックへセットする
    //空の盤面(4 * 4)をセットする
    current = [];
    for ( var y = 0; y < 4; ++y ){
        //y列に空の配列をセットする
        current[ y ] = [];
        for ( var x = 0; x < 4; ++x ){
            //i = 0~15(4 * 4のブロック)
            var i = 4 * y + x;
            //shape[i]=4 * 4のブロックのいずれか
            //typeof shape[i] = number
            //1.typeof shape[ i ] != 'undefined'は、値が入っていない時じゃない時（値(number)が入っている時）、
            //2.また、shape[i]が0じゃない時は、
            if ( typeof shape[ i ] != 'undefined' && shape[ i ] ){
                //塗りつぶすマス
                //id=0だと値がないことになってしまうので（マスを塗らないことになってしまうので）1をたす
                //よって配列にはid+1の数字が入る
                //また、色については
                //ctx.fillStyle = colors[ current [ y ][ x ] - 1];とすることで、var colorsの0~6に対応することができる
                current[ y ][ x ] = id + 1;
            }
            //typeof shape[ i ] == 'undefined' && shape[ i ]だったら
            else {
                //塗るつぶさないマス（0が入る）
                current[ y ][ x ] = 0;
            }
        }
        
//       cl(shape[ i ]);
        
    }
    
    //ブロックを盤面の上の方にセットする
    currentX = 3;
    currentY = 0;
}

//盤面を空にする
function init(){
    for ( var y = 0; y < ROWS; ++y ){
        //y列に空の配列をセットする
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x){
            //全てを0にする
            board[ y ][ x ] = 0;
        }
    }
}

//newGameで指定した数秒ごとに呼び出される関数
//操作ブロックを下の方へ動かし、
//操作ブロックが着地したら消去処理、ゲームオーバー判定を行う
function tick(){
    //1つ下へ移動する
    //valid(offsetX, offasetY)
    if ( valid( 0, 1 ) ) {
        ++currentY;
    }
    //1つ下にブロックがあったら
     else{
         //ブロックを盤面に固定
         freeze(); 
         //ライン消去処理
         clearLines(); 
         //もしlose（ゲームオーバー）になったら（valid で lose = trueだったら）
         if ( lose ){
            //最初から始める
            newGame();
            return false;
         }
         
         //新しいブロックをセットする
         newShape();
     }
}

//ブロックを盤面にセットする関数
function freeze(){
    for ( var y = 0; y < 4; ++y){
        for ( var x = 0; x < 4; ++x ){
            if ( current[ y ][ x ] ){
                //curentY,currentXは固定した時の4*4ブロックの一番左上の座標
                board [ y + currentY ][ x + currentX ] = current [ y ][ x ];
            }
        }
    }
}

//操作ブロックを回す処理
function rotate( current ){
    //回転後の操作ブロックの空の盤面をセット
    var newCurrent = [];
    for ( var y = 0; y < 4; ++y ){
        //y列に空の配列をセットする
        newCurrent [ y ] = [];
        for ( var x = 0; x < 4; ++x ){
            newCurrent [ y ][ x ] = current[ 3 - x ][ y ];
        }
    }
    return newCurrent;
}

//一行が揃っているか調べ、揃っていたらそれを消す
function clearLines(){
    //盤面の一番下（19番目の行）から上へと調べる
    for ( var y = ROWS - 1; y >= 0; --y ){
        //その行に１があれば（ブロックが入っていれば）true、何もなければfalse
        //始めはブロックが入っているものとして(true)期待する
        var rowFilled = true;
        //１行のマスを左から順に１つずつチェック
        for ( var x = 0; x < COLS; ++x ){
            if ( board [ y ][ x ] == 0 ){
                rowFilled = false;
                //break直近のfor文の処理を終わらせ、その行のチェックを止めて一つ上の行のチェックに移る
                break;
            }
        }
        //もし一行揃ってたら、それらを消す
        if ( rowFilled ){
            //その上にあったブロックを一つずる落としていく（yyは一列そろったy列）
            for ( var yy = y; yy > 0; --yy ){
                for ( var x = 0; x < COLS; ++x ){
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
                }
            }
            //一行落としたのでチェック処理を一つ下へ送る
            ++y;
        }
    }
}

//キーボードが押された時に呼び出される関数
//key = keys[ e.keyCode ](leftとかrightとか)
function keyPress( key ){
    switch( key ){
    case 'left':
        //varid(offsetX)
        if( valid( -1 ) ){
            //左に一つずらす
            --currentX; 
        }
        break;
    case 'right':
        //varid(offsetX)
        if( valid ( 1 ) ){
            //右に一つずらす
            ++currentX; 
        }
        break;
    case 'down':
         //varid(offsetX, offsetY)
        if( valid( 0, 1 ) ){
            //下に一つずらす
            ++currentY; 
        }
        break;
    case 'rotate':
        //操作ブロックを回す
        //var rotatedに回転後のブロックの状態を入れる
        var rotated = rotate( current );
        //offsetX、offasetYはともに0
        //4*4のキャンバスの中で回転
        if ( valid( 0, 0, rotated ) ){
            //回転後のブロックの状態を、現在のブロックの状態と置き換える
            current = rotated; 
        }
        break;
    }
}

//指定された方向に、操作ブロックを動かせるかどうかチェックする
//ゲームオーバー判定もここで行う
//offsetX,offsetYは要素内の座標
function valid ( offsetX, offsetY, newCurrent ){
    //||はまたはの意味
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;
    for ( var y = 0; y < 4; ++y ){
        for ( var x = 0; x < 4; ++x ){
            //newCurrent[0][0]が１以上だったら次のif文に進む
            if ( newCurrent [ y ][ x ] ){
                //縦方向へのブロックの移動先[y + offsetY]が盤面の範囲外（20番目以降の行だったら）次のif文に進む
                if ( typeof board [ y + offsetY ] == 'undefined'
                    //横方向へのブロックの移動先が盤面外（左端を超えるor右端を超える）だったら次のif文に移動
                   || typeof board [ y + offsetY ][ x + offsetX ] == 'undefined'
                    //移動先のマス内が0でなく1だったら、そこにはすでにブロックがあるということなので、次のif文に進む
                   || board [ y + offsetY ][ x + offsetX ]
                    //横方向の移動先が盤面の左端を越えたら次のif文に進む
                   || x + offsetX < 0
                    //縦方向の移動先が盤面の下端を超えるか、色付きブロックが１９番目の行に到達すれば、次のif文に進む
                   || y + offsetY >= ROWS
                    //横方向の移動先が盤面の右端を越えるか、色付きブロックがy+offsetY行目の９番目の列に到着すれば次のif文
                   || x + offsetX >= COLS ){
                       //上のif文のいずれか1つがtrueで、縦方向への移動量が1、かつ横方向への移動ができなくなった
                       if ( offsetY == 1 && offsetX - currentX == 0 && offsetY - currentY == 1){
                           //ブロックが盤面の上に
                           //loseフラッグをtrueにする
                           lose = true; 
                           
                           alert('game over');
                       }
                       //終了
                       return false;
                    }
            }
        }
    }
    //続ける
    return true;
}

//このコードはいつでも最後に来るように
function newGame(){
    //タイマーリセット
    clearInterval(interval); 
    //盤面をまっさらに
    init();
    //操作ブロックをセット
    newShape(); 
    //負けフラッグ
    lose = false; 
     //250ミリ秒ごとにtickという関数を呼び出す
    interval = setInterval( tick, 500 );
}

//ゲームを開始する
newGame(); 





//横10、縦20
var COLS = 10, ROWS = 20;
//盤面情報（空の配列）
var board = [];
//一番上まで行ったかどうか（lose=trueでゲームオーバー）
var lose;
//ゲームを実行するタイマーを保持する変数
var interval;
//今操作しているブロックの形
var current;
//今操作しているブロックの位置
var currentX, currentY;

var cl = console.log;

//ブロックの形（パターン）を定義
//0はマスなし、1はマスありと定義する
//便宜的に改行することで、4*4の範囲であることをわかりやすくしているとともに、ブロックの形をわかりやすくしている
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

//ブロックの色を定義
var colors  = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];

//ランダムにブロックのパターンを出力し、盤面の一番上へセットする
//定義したブロックの形にidの番号を割り当てる(id=0~6)
function newShape(){
    //Math.floor()で切り捨て。
    //Math.random()は0〜1未満（0〜0.9999････）の少数を返す
    //shapes.lengthは7
    //var idにはshapes内の0~6のランダムな値が入る。
    var id = Math.floor( Math.random() * shapes.length );
    //idを基にshapesからブロックをとりだす（id=0だったら[1, 1, 1, 1]の配列を取り出す）
    var shape = shapes[ id ];
    
    //操作ブロックを作成する
    //操作ブロックのための空の盤面（配列）をセットする
    current = [];
    //y列を0~3の4行と設定
    for ( var y = 0; y < 4; ++y ){
        //y列に空の配列をセットする
        current[ y ] = [];
        //x行を0~3の4列と設定（ここで4 * 4のブロックと決めている）
        for ( var x = 0; x < 4; ++x ){
            //i = 0~15(4 * 4のブロック)
            //4マス * y列数 + x
            var i = 4 * y + x;
            //shape[i]=4 * 4のブロックのいずれか(i=0~15)
            //typeof shape[i] = number
            //1.typeof shape[i] != 'undefined'は、値が入っていない時じゃない時（値(number)が入っている時）
            //2.また、shape[i]が0じゃない時(shape[i]が1の時)
            //※shape[i]=0はfalseを返すので実行されずに次に行く
            if ( typeof shape[ i ] != 'undefined' && shape[ i ] ){
                //塗りつぶすマス
                //もしid=0だと、current[ y ][ x ]=0となりfalseとなるので、（マスを塗らないことになってしまうので）1をたす
                //よって配列にはid+1の数字が入る
                //また、色については、
                //ctx.fillStyle = colors[current [ y ][ x ] - 1];とすることで、var colorsの0~6に対応することができる
                //なので、あくまでもここでは配列にid+1という数字を入れたにすぎない（ここで色を塗っているわけではない）
                current[ y ][ x ] = id + 1;
                
                //cl(shape[ i ]);
                
            }
            //typeof shape[ i ] == 'undefined' && shape[ i ]=0だったら
            else {
                //塗りつぶさないマス（0が入る）
                current[ y ][ x ] = 0;
            }
        }
    }
    
    //ブロックを盤面の一番上にセットする
    currentX = 3;
    currentY = 0;
}

//盤面を空にする
function init(){
    for ( var y = 0; y < ROWS; ++y ){
        //y列に空の配列をセットする
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x){
            //全てを0(false)にする（全てのマスにdrawBlock( x, y )をしないようにする）
            board[ y ][ x ] = 0;
        }
    }
}

//newGameで指定した数秒ごとに呼び出される関数
//操作ブロックを下の方へ動かし、
//操作ブロックが着地したら消去処理、ゲームオーバー判定を行う
function tick(){
    //1つ下へ移動する
    //valid(offsetX=0, offasetY=1)
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
        //空の配列にセットしていくわけではないのでcurrent[ y ] = [];は不要
        for ( var x = 0; x < 4; ++x ){
            //もしcurrent=trueならば(1以上の数値が入るならば)
            if ( current[ y ][ x ] ){
                //curentY,currentXは固定した時の4*4ブロックまでの距離
                //board（全体）にcurrent（今のブロック）をセットする
                board [ y + currentY ][ x + currentX ] = current [ y ][ x ];
            }
        }
    }
}

//操作ブロックを回す処理
//rotate()で4*4のcanvasごと時計回りに回転させるイメージ
function rotate( current ){
    //回転後の操作ブロックの空の盤面をセット
    var newCurrent = [];
    for ( var y = 0; y < 4; ++y ){
        //y列に空の配列をセットする
        newCurrent [ y ] = [];
        for ( var x = 0; x < 4; ++x ){
            //ちなみにnewCurrent [ y ][ x ] = current[ x ][ 3 - y ];だと左回転
            newCurrent [ y ][ x ] = current[ 3 - x ][ y ];
        }
    }
    //newCurrent（回転後のブロックの配列）を外に出す
    return newCurrent;
}

//一行が揃っているか調べ、揃っていたらそれを消す
function clearLines(){
    //盤面の一番下（19番目の行）から上へと調べる
    for ( var y = ROWS - 1; y >= 0; --y ){
        //始めはブロックが入っているものとして(true)期待する
        var rowFilled = true;
        //y行のマスを左から順(x=0~9)に１つずつチェック
        for ( var x = 0; x < COLS; ++x ){
            if ( board [ y ][ x ] == 0 ){
                //何もないマス(0)があったら
                rowFilled = false;
                //break直近のfor文の処理を終わらせ、その行のチェックを止めて一つ上の行のチェックに移る
                break;
            }
        }
        //もし一行揃ってたら、それらを消す
        //rowFilled=trueだったら
        if ( rowFilled ){
            //その上の行にあったブロックを一つずつ落としていく（yyは一列そろったy列）
            for ( var yy = y; yy > 0; --yy ){
                for ( var x = 0; x < COLS; ++x ){
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
                }
            }
            //一行落としたのでチェック処理を一つ下へ送る
            //もし仮に19行目がクリアになった場合、つぎは新たな19行目が揃っているかのチェックが必要なため
            ++y;
        }
    }
}

//キーボードが押された時に呼び出される関数
//key = keys[ e.keyCode ](leftとかrightとか)
function keyPress( key ){
    switch( key ){
    case 'left':
        //e.keyCode = 37
        //varid(offsetX=-1)
        if( valid( -1 ) ){
            //左に一つずらす
            --currentX; 
        }
        break;
    case 'right':
        //e.keyCode = 39
        //varid(offsetX=1)
        if( valid ( 1 ) ){
            //右に一つずらす
            ++currentX; 
        }
        break;
    case 'down':
        //e.keyCode = 40
        //varid(offsetX=0, offsetY=1)
        if( valid( 0, 1 ) ){
            //下に一つずらす
            ++currentY; 
        }
        break;
    case 'rotate':
        //e.keyCode = 40
        //操作ブロックを回す
        //var rotatedに回転後のブロック(rotate(current)で作り出されたnewCurrent)の状態を入れる
        var rotated = rotate( current );
        //offsetX、offasetYはともに0
        //newCurrentはrotated
        if ( valid( 0, 0, rotated ) ){
            //回転後のブロックの状態を、現在のブロックの状態と置き換える（配列を置き換える）
            current = rotated; 
        }
        break;
    }
}

//指定された方向に、操作ブロックを動かせるかどうかチェックする
//ゲームオーバー判定もここで行う
function valid ( offsetX, offsetY, newCurrent ){
    //||はまたはの意味
    //このoffsetXは横の移動の距離(-1,0,1のいずれか)
    offsetX = offsetX || 0;
    //このoffsetYは縦の移動の距離(0,1のいずれか（上にはいかないので-1はなし）)
    offsetY = offsetY || 0;
    //このoffsetXは次の移動先
    offsetX = currentX + offsetX;
    //このoffsetYは次の移動先
    offsetY = currentY + offsetY;
    //newCurrentに、回転後のブロックかそのままのブロックの配列が入る
    newCurrent = newCurrent || current;
    for ( var y = 0; y < 4; ++y ){
        for ( var x = 0; x < 4; ++x ){
            //newCurrent[0][0]が１以上だったら(falseじゃなかったら)次のif文に進む
            if ( newCurrent [ y ][ x ] ){
                //縦方向のブロックの長さ[y]+縦方向へのブロックの次の移動先[offsetY]が盤面の範囲外（20番目以降の行)だったら、次のif文に進む
                //typeof board [ y + offsetY ] = object
                //board [ y + offsetY ] = (10) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                if ( typeof board [ y + offsetY ] == 'undefined'
                    //横方向へのブロックの移動先が盤面外（左端を超えるor右端を超える）だったら次のif文に移動
                    //typeof board [ y + offsetY ][ x + offsetX ]=number
                   || typeof board[ y + offsetY ] [ x + offsetX ] == 'undefined'
                    //移動先のマス内が0でなく1だったら、そこにはすでにブロックがあるということなので、次のif文に進む
                   || board [ y + offsetY ][ x + offsetX ]
                    //横方向の移動先が盤面の左端を越えたら次のif文に進む
                   || x + offsetX < 0
                    //縦方向の移動先が盤面の下端を超えるか、色付きブロックが１９番目の行に到達すれば、次のif文に進む
                   || y + offsetY >= ROWS
                    //横方向の移動先が盤面の右端を越えるか、色付きブロックがy+offsetY行目の９番目の列に到着すれば次のif文
                   || x + offsetX >= COLS ){
                       //上のif文のいずれか1つがtrueで、縦方向への移動量が1、かつ横方向への移動ができなくなった
                       if ( offsetY == 1 && offsetX - currentX == 0 && offsetY-currentY == 1){
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
    //setInterval( tick, 500 )をリセット
    clearInterval(interval);
    //盤面をまっさらに
    init();
    //操作ブロックをセット
    newShape();
    //負けフラッグ(falseにすることで、まだ負けてないよの状態)
    lose = false; 
     //250ミリ秒ごとにtickという関数を呼び出す
    interval = setInterval( tick, 500 );
}

//ゲームを開始する
newGame(); 






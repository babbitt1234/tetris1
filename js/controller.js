//キーボードを入力した時にいちばん最初に呼び出される処理
//キーボードを押すとイベント発生
document.body.onkeydown = function( e ){
    var keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        32: 'rotate'
    };
    
    //keys[ e.keyCode ]にはleftやundefinedなどの文字が入る
    //keysにセットした数字：typeof keys [ e.keyCode ] = string
    //keysにセットしてない数字：typeof keys [ e.keyCode ] = undefined
    if ( typeof keys [ e.keyCode ] != 'undefined' ) {
        //セットされているkeyの場合はtetris.jsに記述された処理を呼び起こす
        keyPress( keys[ e.keyCode ] );
        //描画処理を行う
        render();
    }
    
//    cl( typeof keys [ e.keyCode ] );
//    cl(e.keyCode);
    
}
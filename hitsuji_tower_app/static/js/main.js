const game = {};
game.config = {
    fps: 60,
    canvasSize: [720, 480],
    scenes: {
        title: "タイトル",
        game: "ゲーム",
        result: "結果"
    },
    tileSize: 60, // 各マスの大きさ(px)
    playerSize:30 // プレイヤーの大きさ(px)

};

game.data = {
    context: null,
    scene: null, // タイトル画面
    clickPos: [],
    inputKey: new Set(),
    map: null,  // mapの情報
    objects: {}, // 画面上に配置するオブジェクト
    result: {
        // リザルト画面に表示する項目
        time: 0, // クリアタイム
        score: 0, // スコア
        blockBreak: 0, // 破壊したブロック数
    }
};

// マウスクリック イベントリスナー
// canvasに対する相対座標を game.data.clickPos に格納する
document.addEventListener("click", function(e){
	const rect = e.target.getBoundingClientRect();
    const y = e.clientY - rect.top;
	const x = e.clientX - rect.left;
	game.data.clickPos.push([x,y]);
}, false);
// キー入力
document.addEventListener('keydown', function(e){
	e.preventDefault(); // ブラウザのショートカットキーを無効にする
	game.data.inputKey.add(e.key);
});
// キー入力
document.addEventListener('keyup', function(e){
	e.preventDefault(); // ブラウザのショートカットキーを無効にする
	game.data.inputKey.delete(e.key);
});

window.onload = function(){
    // canvas 読み込み
    const canvas = document.getElementById("gamecanvas");
    game.data.context = canvas.getContext("2d");
    game.data.map = new Map([[0, 0, 0],[0, 0, 0],[0, 0, 0]]);
    init();
    setInterval("gameloop()", 1000/60);
};

function init(){
    // タイトル画面
    game.data.scene = game.config.scenes.title;
    titleOnLoad();

    fetch('/api/map/')
        .then(response => response.json()) // jsonとして読み込み
        .then(data => {
            game.data.map = new MapData(mapConversion(data)); // mapの変換
        })
        .catch(error => {
            console.error(error);
        });
};

function gameloop(){
    switch(game.data.scene){
        case game.config.scenes.title:
            titleDraw();
            titleUpdate();
            break
        case game.config.scenes.game:
            gameDraw();
            gameUpdate();
            break
        case game.config.scenes.result:
            
    }
};
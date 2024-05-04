const game = {};
game.config = {
    fps: 60,
    canvasSize: [720, 480],
    scenes: {
        title: "タイトル",
        game: "ゲーム",
        result: "結果"
    },
    tileSize: 20, // 各マスの大きさ(px)
    playerSize:100 // プレイヤーの大きさ(px)

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
    setInterval("gameloop()", 50);
};

function init(){
    // タイトル画面
    game.data.scene = game.config.scenes.title;
    titleOnLoad();

    fetch('/api/map/')
        .then(response => response.json()) // jsonとして読み込み
        .then(data => {
            data = [{"map_height":3,"map_width":2,"rooms":[{"pos_x":0,"pos_y":0,"height":15,"width":15,"columns":[{"pos_y":0,"content":"111111111111111"},{"pos_y":1,"content":"100000000000001"},{"pos_y":2,"content":"100000000000001"},{"pos_y":3,"content":"100000000000001"},{"pos_y":4,"content":"100000000000001"},{"pos_y":5,"content":"100000000000001"},{"pos_y":6,"content":"100000000000001"},{"pos_y":7,"content":"100000000000001"},{"pos_y":8,"content":"10000000000000N"},{"pos_y":9,"content":"10000000000000N"},{"pos_y":10,"content":"100000000000001"},{"pos_y":11,"content":"100000000000001"},{"pos_y":12,"content":"100000000000001"},{"pos_y":13,"content":"100000000000001"},{"pos_y":14,"content":"111111111111111"}]},{"pos_x":0,"pos_y":1,"height":15,"width":15,"columns":[{"pos_y":0,"content":"111111111111111"},{"pos_y":1,"content":"100000000000001"},{"pos_y":2,"content":"100000000000001"},{"pos_y":3,"content":"100000000000001"},{"pos_y":4,"content":"100000000000001"},{"pos_y":5,"content":"100000000000001"},{"pos_y":6,"content":"100000000000001"},{"pos_y":7,"content":"100000000000001"},{"pos_y":8,"content":"N00000000000001"},{"pos_y":9,"content":"N00000000000001"},{"pos_y":10,"content":"100000000000001"},{"pos_y":11,"content":"100000000000001"},{"pos_y":12,"content":"100000000000001"},{"pos_y":13,"content":"100000000000001"},{"pos_y":14,"content":"111111111NN1111"}]},{"pos_x":1,"pos_y":0,"height":15,"width":15,"columns":[{"pos_y":0,"content":"111111111111111"},{"pos_y":1,"content":"100000000000001"},{"pos_y":2,"content":"100000000000001"},{"pos_y":3,"content":"100000000000001"},{"pos_y":4,"content":"100000000000001"},{"pos_y":5,"content":"100000000000001"},{"pos_y":6,"content":"100000000000001"},{"pos_y":7,"content":"100000000000001"},{"pos_y":8,"content":"100000000000001"},{"pos_y":9,"content":"100000000000001"},{"pos_y":10,"content":"100000000000001"},{"pos_y":11,"content":"10000000000000N"},{"pos_y":12,"content":"10000000000000N"},{"pos_y":13,"content":"100000000000001"},{"pos_y":14,"content":"11NN11111111111"}]},{"pos_x":1,"pos_y":1,"height":15,"width":15,"columns":[{"pos_y":0,"content":"111111111NN1111"},{"pos_y":1,"content":"100000000000001"},{"pos_y":2,"content":"100000000000001"},{"pos_y":3,"content":"100000000000001"},{"pos_y":4,"content":"100000000000001"},{"pos_y":5,"content":"100000000000001"},{"pos_y":6,"content":"100000000000001"},{"pos_y":7,"content":"100000000000001"},{"pos_y":8,"content":"100000000000001"},{"pos_y":9,"content":"100000000000001"},{"pos_y":10,"content":"100000000000001"},{"pos_y":11,"content":"N00000000000001"},{"pos_y":12,"content":"N00000000000001"},{"pos_y":13,"content":"100000000000001"},{"pos_y":14,"content":"111111111111111"}]},{"pos_x":2,"pos_y":0,"height":15,"width":15,"columns":[{"pos_y":0,"content":"11NN11111111111"},{"pos_y":1,"content":"100000000000001"},{"pos_y":2,"content":"100000000000001"},{"pos_y":3,"content":"100000000000001"},{"pos_y":4,"content":"100000000000001"},{"pos_y":5,"content":"100000000000001"},{"pos_y":6,"content":"100000000000001"},{"pos_y":7,"content":"100000000000001"},{"pos_y":8,"content":"100000000000001"},{"pos_y":9,"content":"10000000000000N"},{"pos_y":10,"content":"10000000000000N"},{"pos_y":11,"content":"100000000000001"},{"pos_y":12,"content":"100000000000001"},{"pos_y":13,"content":"100000000000001"},{"pos_y":14,"content":"111111111111111"}]},{"pos_x":2,"pos_y":1,"height":15,"width":15,"columns":[{"pos_y":0,"content":"111111111111111"},{"pos_y":1,"content":"100000000000001"},{"pos_y":2,"content":"100000000000001"},{"pos_y":3,"content":"100000000000001"},{"pos_y":4,"content":"100000000000001"},{"pos_y":5,"content":"100000000000001"},{"pos_y":6,"content":"100000000000001"},{"pos_y":7,"content":"100000000000001"},{"pos_y":8,"content":"100000000000001"},{"pos_y":9,"content":"N00000000000001"},{"pos_y":10,"content":"N00000000000001"},{"pos_y":11,"content":"100000000000001"},{"pos_y":12,"content":"100000000000001"},{"pos_y":13,"content":"100000000000001"},{"pos_y":14,"content":"111111111111111"}]}],"jump":3}];
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
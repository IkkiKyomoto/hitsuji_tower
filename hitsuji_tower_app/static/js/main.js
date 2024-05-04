const game = {};
game.config = {
    fps: 60,
    canvasSize: [720, 480],
    scenes: {
        title: "タイトル",
        game: "ゲーム",
        result: "結果"
    },
    tileSize: 100, // 各マスの大きさ(px)
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
            data = [{'map_height': 3, 'map_width': 4, 'rooms': [{'pos_x': 0, 'pos_y': 0, 'height': 10, 'width': 20, 'columns': [{'pos_y': 0, 'content': '11111111111111111111'}, {'pos_y': 1, 'content': '1S111111111111111111'}, {'pos_y': 2, 'content': '1011111111111111110N'}, {'pos_y': 3, 'content': '1011111111100000110N'}, {'pos_y': 4, 'content': '10011111101000000111'}, {'pos_y': 5, 'content': '10011110100000000111'}, {'pos_y': 6, 'content': '10011110000000000001'}, {'pos_y': 7, 'content': '10000000000000000001'}, {'pos_y': 8, 'content': '10000000000000000001'}, {'pos_y': 9, 'content': '11111111111111111111'}]}, {'pos_x': 1, 'pos_y': 0, 'height': 10, 'width': 20, 'columns': [{'pos_y': 0, 'content': '11111111111111111111'}, {'pos_y': 1, 'content': '10000011111111111111'}, {'pos_y': 2, 'content': '11111011111111111111'}, {'pos_y': 3, 'content': '10001011111111100111'}, {'pos_y': 4, 'content': '1000000111111100010N'}, {'pos_y': 5, 'content': '1000000000011100000N'}, {'pos_y': 6, 'content': '10000000000110000001'}, {'pos_y': 7, 'content': '10000000000000000001'}, {'pos_y': 8, 'content': '10000000000000000001'}, {'pos_y': 9, 'content': '11111111111111111111'}]}, {'pos_x': 2, 'pos_y': 0, 'height': 10, 'width': 20, 'columns': [{'pos_y': 0, 'content': '11111111111111111111'}, {'pos_y': 1, 'content': '11111111111111111111'}, {'pos_y': 2, 'content': '1111110001111111110N'}, {'pos_y': 3, 'content': '0011110001111111110N'}, {'pos_y': 4, 'content': '00000000000111111111'}, {'pos_y': 5, 'content': 'N0000000000011011111'}, {'pos_y': 6, 'content': '10000000000011010111'}, {'pos_y': 7, 'content': '10000000000000000001'}, {'pos_y': 8, 'content': '10000000000000000001'}, {'pos_y': 9, 'content': '11111111111111111111'}]}, {'pos_x': 3, 'pos_y': 0, 'height': 10, 'width': 20, 'columns': [{'pos_y': 0, 'content': '11111111111111111111'}, {'pos_y': 1, 'content': '10000000001110000001'}, {'pos_y': 2, 'content': 'N0001111100000000001'}, {'pos_y': 3, 'content': 'N0001111000000000001'}, {'pos_y': 4, 'content': '10001100000000000001'}, {'pos_y': 5, 'content': '10000000000000000001'}, {'pos_y': 6, 'content': '10000000000000000001'}, {'pos_y': 7, 'content': '10000000000000000001'}, {'pos_y': 8, 'content': '10000000000000000001'}, {'pos_y': 9, 'content': '11111111111111111NN1'}]}, {'pos_x': 0, 'pos_y': 1, 'height': 10, 'width': 20, 'columns': [{'pos_y': 0, 'content': '11111111111111111111'}, {'pos_y': 1, 'content': '10000000000000000001'}, {'pos_y': 2, 'content': '10000000000000000001'}, {'pos_y': 3, 'content': '1000000000000000000N'}, {'pos_y': 4, 'content': '1000000000000000000N'}, {'pos_y': 5, 'content': '10000000000000000001'}, {'pos_y': 6, 'content': '10000000000000000001'}, {'pos_y': 7, 'content': '10000000000000000001'}, {'pos_y': 8, 'content': '10000000000000000001'}, {'pos_y': 9, 'content': '1NN11111111111111111'}]}, {'pos_x': 1, 'pos_y': 1, 'height': 10, 'width': 20, 'columns': [{'pos_y': 0, 'content': '11111111111111111111'}, {'pos_y': 1, 'content': '10000000000000000001'}, {'pos_y': 2, 'content': '10000000000000000001'}, {'pos_y': 3, 'content': 'N0000000000000000001'}, {'pos_y': 4, 'content': 'N0000000000000000001'}, {'pos_y': 5, 'content': '10000000000000000001'}, {'pos_y': 6, 'content': '10000000000000000001'}, {'pos_y': 7, 'content': '1000000000000000000N'}, {'pos_y': 8, 'content': '1000000000000000000N'}, {'pos_y': 9, 'content': '11111111111111111111'}]}, {'pos_x': 2, 'pos_y': 1, 'height': 10, 'width': 20, 'columns': [{'pos_y': 0, 'content': '11111111111111111111'}, {'pos_y': 1, 'content': '1000000000000000000N'}, {'pos_y': 2, 'content': '1000000000000000000N'}, {'pos_y': 3, 'content': '10000000000000000001'}, {'pos_y': 4, 'content': '10000000000000000001'}, {'pos_y': 5, 'content': '10000000000000000001'}, {'pos_y': 6, 'content': '10000000000000000001'}, {'pos_y': 7, 'content': 'N0000000000000000001'}, {'pos_y': 8, 'content': 'N0000000000000000001'}, {'pos_y': 9, 'content': '11111111111111111111'}]}, {'pos_x': 3, 'pos_y': 1, 'height': 10, 'width': 20, 'columns': [{'pos_y': 0, 'content': '111111111111111NN111'}, {'pos_y': 1, 'content': 'N0000000000000000001'}, {'pos_y': 2, 'content': 'N0000000000000000001'}, {'pos_y': 3, 'content': '10000000000000000001'}, {'pos_y': 4, 'content': '10000000000000000001'}, {'pos_y': 5, 'content': '10000000000000000001'}, {'pos_y': 6, 'content': '10000000000000000001'}, {'pos_y': 7, 'content': '10000000000000000001'}, {'pos_y': 8, 'content': '10000000000000000001'}, {'pos_y': 9, 'content': '11111111111111111111'}]}, {'pos_x': 0, 'pos_y': 2, 'height': 10, 'width': 20, 'columns': [{'pos_y': 0, 'content': '11111111111111NN1111'}, {'pos_y': 1, 'content': '10000000000000000001'}, {'pos_y': 2, 'content': '10000000000000111111'}, {'pos_y': 3, 'content': '10000000000000110111'}, {'pos_y': 4, 'content': '1000000000000001000N'}, {'pos_y': 5, 'content': '1000000000000000000N'}, {'pos_y': 6, 'content': '10000000000000000011'}, {'pos_y': 7, 'content': '10000000000000000001'}, {'pos_y': 8, 'content': '10000000000000000001'}, {'pos_y': 9, 'content': '11111111111111111111'}]}, {'pos_x': 1, 'pos_y': 2, 'height': 10, 'width': 20, 'columns': [{'pos_y': 0, 'content': '11111111111111111111'}, {'pos_y': 1, 'content': '11111111111111111111'}, {'pos_y': 2, 'content': '01111111111111111111'}, {'pos_y': 3, 'content': '01101110011011011001'}, {'pos_y': 4, 'content': '00000000010011010001'}, {'pos_y': 5, 'content': 'N0000000000000000001'}, {'pos_y': 6, 'content': '1000000000000000000N'}, {'pos_y': 7, 'content': '1000000000000000000N'}, {'pos_y': 8, 'content': '10000000000000000001'}, {'pos_y': 9, 'content': '11111111111111111111'}]}, {'pos_x': 2, 'pos_y': 2, 'height': 10, 'width': 20, 'columns': [{'pos_y': 0, 'content': '11111111111111111111'}, {'pos_y': 1, 'content': '11111111111111111111'}, {'pos_y': 2, 'content': '11111111100111111111'}, {'pos_y': 3, 'content': '11111101000111101001'}, {'pos_y': 4, 'content': '11110001000000100001'}, {'pos_y': 5, 'content': '1000000000000000000N'}, {'pos_y': 6, 'content': 'N110000000000000000N'}, {'pos_y': 7, 'content': 'N0000000000000000001'}, {'pos_y': 8, 'content': '10000000000000000001'}, {'pos_y': 9, 'content': '11111111111111111111'}]}, {'pos_x': 3, 'pos_y': 2, 'height': 10, 'width': 20, 'columns': [{'pos_y': 0, 'content': '11111111111111111111'}, {'pos_y': 1, 'content': '11111111111111111001'}, {'pos_y': 2, 'content': '11111001111111111001'}, {'pos_y': 3, 'content': '11111001111111111001'}, {'pos_y': 4, 'content': '10000000011101111001'}, {'pos_y': 5, 'content': '11110000000000111001'}, {'pos_y': 6, 'content': '11000000000000011001'}, {'pos_y': 7, 'content': '10000000000000000G01'}, {'pos_y': 8, 'content': '10000000000000000001'}, {'pos_y': 9, 'content': '11111111111111111111'}]}], 'jump': 3}];
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
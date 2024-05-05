// title
function titleOnLoad(){
    // scene 切り替え
    game.data.scene = game.config.scenes.title;
    // 画面内オブジェクト 初期化
    game.data.objects = [];

    // タイトル背景
    let src = "./static/img/background.PNG";
    game.data.objects.bgImage = new ImageBox(0, 0, game.config.canvasSize[0], game.config.canvasSize[1], src);

    // ボタン配置
    game.data.objects.buttons = {};
    let startButtonSize = [200, 50];
    game.data.objects.buttons.start = new Button(game.config.canvasSize[0]/2-startButtonSize[0]/2, game.config.canvasSize[1]/2, startButtonSize[0], startButtonSize[1], "START");
    game.data.objects.buttons.start.onClick = function(){
        console.log("clicked!");
        gameOnLoad();
    }
};

function titleUpdate(){
    // game.data.inputKey.clear();
    for(let i=0; i<game.data.clickPos.length; i++){
        // マウスクリック
        for(let j in game.data.objects.buttons){
            if(game.data.objects.buttons[j].isPointInside(game.data.clickPos[i][0], game.data.clickPos[i][1])){
                // ボタンがクリックされた
                game.data.objects.buttons[j].onClick();
                game.data.clickPos = [];
                return;
            }
        }
    }
};

function titleDraw(){
    game.data.objects.bgImage.draw();
    game.data.objects.buttons.start.draw();
};

// game
function gameOnLoad(){
    // scene 切り替え
    game.data.scene = game.config.scenes.game;

    // 画面内オブジェクト 初期化
    game.data.objects = {};

    // 背景
    let src = "./static/img/background.PNG";
    game.data.objects.bgImage = new ImageBox(0, 0, game.config.canvasSize[0], game.config.canvasSize[1], src);
    /*
    game.data.objects.bgImage.draw = function(){
        let col = "rgb(140, 238, 255)";
        createRoundRectPath(this.posX, this.posY, this.width, this.height, 0);
        game.data.context.fillStyle = col;
        game.data.context.fill();
    }
    */

    // map
    game.data.objects.map = game.data.map;

    // プレイヤー
    //    プレイヤーの座標は右下
    let playeMaprPos = [1, 13];
    game.data.objects.player = new Player(
        100,
        100,
        game.data.objects.map.startPos[0],
        game.data.objects.map.startPos[1],
        game.config.playerSize,
        game.config.playerSize
    );

}

function gameUpdate(){
    // player 入力受け取り
    game.data.objects.player.move();

    // mapとプレイヤーの初期値設定
    setMapAndPlayer();
}

function gameDraw(){
    // bgImage
    game.data.objects.bgImage.draw();
    // map
    game.data.objects.map.draw();
    // player
    game.data.objects.player.draw();
}
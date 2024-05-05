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
    let backgroundSrc = "./static/img/background.PNG";
    game.data.objects.bgImage = new ImageBox(0, 0, game.config.canvasSize[0], game.config.canvasSize[1], backgroundSrc);
    /* 仮置き背景
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
    game.data.objects.player = new Player(
        100,
        100,
        // game.data.objects.map.startPos[0],
        // game.data.objects.map.startPos[1],
        game.data.objects.map.goalPos[0],
        game.data.objects.map.goalPos[1],
        game.config.playerSize,
        game.config.playerSize,
    );

    game.data.objects.sheep = new Sheep(
        100,
        100,
        game.data.objects.map.goalPos[0],
        game.data.objects.map.goalPos[1],
        game.config.sheepSize,
        game.config.sheepSize*1.38
    );
    console.log(game.data.objects.sheep);

    // 時間計測 start
    game.data.startTime = Date.now();
}

function gameUpdate(){
    // player 入力受け取り
    game.data.objects.player.move();
    // sheep
    game.data.objects.sheep.move();

    // mapとプレイヤーの初期値設定
    setMapAndPlayer();

    // gameover 判定
    if(isGameOver()){
        game.data.endTime = Date.now();
        resultOnload();
    }
}

function gameDraw(){
    // bgImage
    game.data.objects.bgImage.draw();
    // map
    game.data.objects.map.draw();
    // player
    game.data.objects.player.draw();
    // sheep
    game.data.objects.sheep.draw();
}

function resultOnload(){
    // scene 切り替え
    game.data.scene = game.config.scenes.result;

    // 画面内オブジェクト 初期化
    game.data.objects = {};

    let resultBoxSize = [400, 300];
    game.data.objects.resultBg = new Button(game.config.canvasSize[0]/2-resultBoxSize[0]/2, game.config.canvasSize[1]/2-resultBoxSize[1]/2, resultBoxSize[0], resultBoxSize[1], "");
    game.data.objects.resultBg.draw = function(){
        // 背景
        createRoundRectPath(this.posX, this.posY, this.width, this.height, 30);
        game.data.context.fillStyle = "#222";
        game.data.context.fill();
    };

    game.data.objects.resultText = new Button(game.config.canvasSize[0]/2-resultBoxSize[0]/2, game.config.canvasSize[1]/2-resultBoxSize[1]/2+50, resultBoxSize[0], 30, "リザルト");
    game.data.objects.resultText.draw = function(){
        game.data.context.fillStyle = "#FFF";
        game.data.context.textAlign = "center";
		game.data.context.textBaseline = "top";
        game.data.context.fillText(this.text, this.posX+this.width/2, this.posY);
    }

    game.data.objects.timeText = new Button(game.config.canvasSize[0]/2-resultBoxSize[0]/2, game.config.canvasSize[1]/2-resultBoxSize[1]/2+150, resultBoxSize[0], 30, `${((game.data.endTime - game.data.startTime)/1000).toFixed(2)} 秒`);
    game.data.objects.timeText.draw = function(){
        game.data.context.fillStyle = "#FFF";
        game.data.context.textAlign = "center";
		game.data.context.textBaseline = "top";
        game.data.context.fillText(this.text, this.posX+this.width/2, this.posY);
    }

}

function resultUpdate(){

}
function resultDraw(){
    // 背景
    game.data.objects.resultBg.draw();
    game.data.objects.resultText.draw();
    game.data.objects.timeText.draw();
}
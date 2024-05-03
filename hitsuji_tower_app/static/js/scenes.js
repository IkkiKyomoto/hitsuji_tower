// title
function titleOnLoad(){
    let src = "https://www.famitsu.com/images/000/301/230/y_644b3619ebab1.jpg";
    game.data.objects.bgImage = new ImageBox(0, 0, game.config.canvasSize[0], game.config.canvasSize[1], src);

    game.data.objects.buttons = {};
    let startButtonSize = [200, 50];
    game.data.objects.buttons.start = new Button(game.config.canvasSize[0]/2-startButtonSize[0]/2, game.config.canvasSize[1]/2, startButtonSize[0], startButtonSize[1], "START");
};

function titleUpdate(){
    console.log(game.data.inputKey);
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

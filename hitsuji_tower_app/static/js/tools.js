// canvasで図形を書くための関数
function createRoundRectPath(posX, posY, width, height, radius){
	/* 角丸四角形のパスを作成 */
	game.data.context.beginPath();
    game.data.context.moveTo(posX + radius, posY);
    game.data.context.lineTo(posX + width - radius, posY);
    game.data.context.arc(posX + width - radius, posY + radius, radius, Math.PI * (3/2), 0, false);
    game.data.context.lineTo(posX + width, posY + height - radius);
    game.data.context.arc(posX + width - radius, posY + height - radius, radius, 0, Math.PI * (1/2), false);
    game.data.context.lineTo(posX + radius, posY + height);       
    game.data.context.arc(posX + radius, posY + height - radius, radius, Math.PI * (1/2), Math.PI, false);
    game.data.context.lineTo(posX, posY + radius);
    game.data.context.arc(posX + radius, posY + radius, radius, Math.PI, Math.PI * (3/2), false);
    game.data.context.closePath();
}

function mapConversion(data){
    let map_height = data[0]["map_height"];
    let map_width = data[0]["map_width"];

    let height = data[0]["rooms"][0]["height"];
    let width = data[0]["rooms"][0]["width"];

    // map
    let ret = new Array(map_height*height);
    for(let i=0; i<map_height*height; i++){
        ret[i] = new Array(map_width*width).fill(0);
    }

    
    for(let room of data[0].rooms){
        let roomPosX = room.pos_x;
        let roomPosY = room.pos_y;
        for(let i=0; i<room.columns.length; i++){
            
            for(let j=0; j<room.columns[i].content.length; j++){
                ret[(map_height-1-roomPosY)*height + (height-1-i)][roomPosX*width + j] = room.columns[i].content[j];
            }
        }
    }
    return ret;
}

// playerのマップ上の位置から，canvas上の位置を設定する
function setMapAndPlayer(){
    // mapの座標
    // x方向
    game.data.objects.map.posX = game.config.canvasSize[0]/2-game.config.playerSize/2 - game.data.objects.player.mapX * game.config.tileSize;
    game.data.objects.map.posY = game.config.canvasSize[1]/2+game.config.playerSize/2 - (game.data.objects.player.mapY+1) * game.config.tileSize;
    /*
    if(isNaN(game.data.objects.map.posX)){game.data.objects.map.posX=0;}
    if(isNaN(game.data.objects.map.posY)){game.data.objects.map.posY=0;}
    */
    
    // playerを真ん中にした時に，マップ外が表示される場合はずらす
    if(0 < game.data.objects.map.posX){
        game.data.objects.map.posX=0;
    }else if(game.data.objects.map.posX<game.config.canvasSize[0]-game.data.objects.map.width*game.config.tileSize){
        game.data.objects.map.posX=game.config.canvasSize[0]-game.data.objects.map.width*game.config.tileSize;
    }
    if(0 < game.data.objects.map.posY){
        game.data.objects.map.posY=0;
    }else if(game.data.objects.map.posY<game.config.canvasSize[1]-game.data.objects.map.height*game.config.tileSize){
        game.data.objects.map.posY=game.config.canvasSize[1]-game.data.objects.map.height*game.config.tileSize;
    }

    // playerの座標設定
    game.data.objects.player.posX = game.data.objects.map.posX + game.data.objects.player.mapX * game.config.tileSize;
    game.data.objects.player.posY = game.data.objects.map.posY + (game.data.objects.player.mapY+1) * game.config.tileSize;
}

function isGameOver(){
    // playerがゴール地点にたどり着いたらゲーム終了
    flg = (
        game.data.map.ids[Math.ceil(game.data.objects.player.mapY)][Math.floor(game.data.objects.player.mapX)]=="G"
        || game.data.map.ids[Math.ceil(game.data.objects.player.mapY)][Math.floor(game.data.objects.player.mapX+game.data.objects.player.width/game.config.tileSize-0.01)]=="G"
        || game.data.map.ids[Math.ceil(game.data.objects.player.mapY-game.data.objects.player.height/game.config.tileSize+0.01)][Math.floor(game.data.objects.player.mapX)]=="G"
        || game.data.map.ids[Math.ceil(game.data.objects.player.mapY-game.data.objects.player.height/game.config.tileSize+0.01)][Math.floor(game.data.objects.player.mapX+game.data.objects.player.width/game.config.tileSize-0.01)]=="G"
        )
    return flg;
}
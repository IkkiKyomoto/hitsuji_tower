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
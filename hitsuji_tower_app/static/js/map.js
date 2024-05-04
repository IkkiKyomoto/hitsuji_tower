class MapData{
    constructor(mapIds){
        this.height = mapIds.length;
        this.width = mapIds[0].length;
        this.ids = structuredClone(mapIds); // 複製
        this.map = new Array(this.height);

        this.startPos = [1, 1]; // start地点
        for(let i=0; i<this.height; i++){
            this.map[i] = new Array(this.width)
            for(let j=0; j<this.width; j++){
                switch(this.ids[i][j]){
                    case "S":
                        this.startPos = [j,i];
                    case "0":
                    case "N":
                    case "G":
                        this.map[i][j] = new MapAir(j,i);
                        break;
                    case "1":
                        this.map[i][j] = new MapWall(j,i);
                        break;
                }
            }
        }
        this.posX = 0;
        this.posY = 0;
    }

    draw(){
        for(let i=0; i<this.height; i++){
            if(0 <= this.posY+(i+1)*game.config.tileSize && this.posY+i*game.config.tileSize <= game.config.canvasSize[1]){
                // i行目がcanvas内に映る
                for(let j=0; j<this.width; j++){
                    if(0 <= this.posX+(j+1)*game.config.tileSize && this.posX+j*game.config.tileSize <= game.config.canvasSize[0]){
                        this.map[i][j].draw(this.posX, this.posY);
                    }
                }
            }
        }
    }
}
class MapAir{
    constructor(mapX, mapY){
        // mapX,Y : map上でのマスの座標
        this.mapX = mapX;
        this.mapY = mapY
        this.size = game.config.tileSize;
    }
    draw(mapPosX, mapPosY){}
}
class MapWall{
    constructor(mapX, mapY){
        // mapX,Y : map上でのマスの座標
        this.mapX = mapX;
        this.mapY = mapY
        this.size = game.config.tileSize;

        this.img = new Image();
        this.img.src = "./static/img/wall.PNG";
    }
    
    draw(mapPosX, mapPosY){
        // mapPosX,Y : canvas上でのmapの左上の点の座標

        game.data.context.drawImage(this.img, mapPosX+this.mapX*this.size, mapPosY+this.mapY*this.size, this.size, this.size);
    }
}
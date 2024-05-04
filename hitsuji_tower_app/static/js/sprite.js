class Sprite{
	constructor(posX, posY, width, height){
		this.posX = posX;
		this.posY = posY;
		this.height = height;
		this.width = width;
		this.draw = function(){}; // 描写する関数
	}
}

class ImageBox extends Sprite{
    constructor(posX, posY, width, height, src){
        super(posX, posY, width, height);
        
        this.img = new Image();
        this.img.src = src;
        this.draw = function(){
			game.data.context.drawImage(this.img, this.posX, this.posY, this.width, this.height);
		};
    }
}

class Button extends Sprite{
    constructor(posX, posY, width, height, text){
        super(posX, posY, width, height);

        this.text = text;
        this.font = "40px sunset";

        this.draw = function(){
            // 背景
            createRoundRectPath(this.posX, this.posY, this.width, this.height, 4);
            game.data.context.fillStyle = "#888";
            game.data.context.fill();


            // 文字
			game.data.context.font = this.font;
            game.data.context.fillStyle = "#FFF";
            game.data.context.textBaseline = "middle"; // 基準をテキストの上下中央に
		    game.data.context.textAlign = "center"; // 基準をテキストの左右中央に
            game.data.context.fillText(this.text, this.posX + this.width/2, this.posY + this.height/2);
		};

        this.onClick = function(){console.log("clicked!");};
    }
    isPointInside(pointX, pointY){
        if(this.posX <= pointX && pointX <= this.posX+this.width && this.posY <= pointY && pointY <= this.posY+this.height){
            return true;
        } else {
            return false;
        }
    }
}

class Player extends Sprite{
    constructor(canvasX, canvasY, mapX, mapY, width, height){
        // canvasX,Y : canvas上での座標
        // mapX,Y : map上での座標
        super(canvasX, canvasY, width, height);
        this.mapX = mapX;
        this.mapY = mapY;

        this.vx = 0; // x方向のスピード
        this.vy = 0; // y方向のスピード
        this.dvx = 0; // x 方向の加速度
        this.dvy = 0; // y 方向の加速度

        this.draw = function(){   
            createRoundRectPath(this.posX, this.posY-this.height, this.width, this.height, 20);
            game.data.context.fillStyle = "#fff";
            game.data.context.fill();
        }; 
    }

    move(){
        // 横移動
        // 加速度
        this.dvx=0; this.dvy=+0.01; // 加速度初期化
        let moveFlg = false;
        if(game.data.inputKey.has("ArrowRight")){
            // 右移動
            this.dvx += 0.015;
            moveFlg = true;
        }else if(0<this.vx){
            this.dvx -= 0.03
        }

        if(game.data.inputKey.has("ArrowLeft")){
            // 右移動
            this.dvx -= 0.015;
            moveFlg = true;
        }else if(0>this.vx){
            this.dvx += 0.03
        }

        // 速度計算
        console.log(Math.abs(this.vx), this.dvx);
        if(moveFlg==false && Math.abs(this.vx)<0.05){
            // キー入力がされていないかつほぼ速度0
            this.vx=0;
        } else {
            this.vx+=this.dvx;
            if(0.5 < this.vx){
                this.vx = 0.5;
            } else if(-0.5 > this.vx){
                this.vx = -0.5;
            }
        }

        // 移動 (壁にぶつかるなら移動しない)
        if(game.data.map.ids[Math.floor(this.mapY)][Math.floor(this.mapX+this.vx)]!=="1" && game.data.map.ids[Math.floor(this.mapY)][Math.floor(this.mapX+this.vx+this.width/game.config.tileSize)]!=="1"){
            this.mapX += this.vx;
        }
        
        // 縦移動
        if(game.data.inputKey.has("ArrowUp")){
            // 上移動
            if(game.data.map.ids[Math.ceil(this.mapY+0.1)][Math.floor(this.mapX)]=="1" || game.data.map.ids[Math.ceil(this.mapY+0.1)][Math.floor(this.mapX+this.width/game.config.tileSize)]=="1"){
                this.vy = -0.3;
            }
        }
        this.vy += this.dvy; // 重力
        if(0.05<this.vy){
            this.vy = 0.1;
        }
        if(game.data.map.ids[Math.ceil(this.mapY+this.vy)][Math.floor(this.mapX+this.vx)]!=="1" && game.data.map.ids[Math.ceil(this.mapY+this.vy)][Math.floor(this.mapX+this.width/game.config.tileSize)]!=="1"){
            this.mapY += this.vy;
        }
    }
}
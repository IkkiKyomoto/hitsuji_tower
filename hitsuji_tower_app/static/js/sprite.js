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

        this.moveStatus = "stand";
        this.moveDirection = "right";
        this.vx = 0; // x方向のスピード
        this.vy = 0; // y方向のスピード
        this.dvx = 0; // x 方向の加速度
        this.dvy = 0; // y 方向の加速度

        this.img = new Image();
        this.img.src = "";
        this.draw = function(){
            /*
            createRoundRectPath(this.posX, this.posY-this.height, this.width, this.height, 20);
            game.data.context.fillStyle = "#fff";
            game.data.context.fill();
            
            switch(this.moveDirection){
                case "right":
                    switch (this.moveStatus) {
                        case "stand":
                            this.img.src = "./static/img/player_standr.PNG";

                        case "walk":
                            this.img.src = "./static/img/player_walk1r.PNG";

                        case "dash 1":
                            this.img.src = "./static/img/player_dash11r.PNG";

                        case "dash 2":
                            this.img.src = "./static/img/player_dash2r.PNG";

                    }

                case "left":
                    switch (this.moveStatus) {
                        case "stand":
                            this.img.src = "./static/img/player_standl.PNG";

                        case "walk":
                            this.img.src = "./static/img/player_walk1l.PNG";

                        case "dash 1":
                            this.img.src = "./static/img/player_dash13l.PNG";

                        case "dash 2":
                            this.img.src = "./static/img/player_dash2l.PNG";

                    }
            }
            */
            this.img.src = "./static/img/player_standr.PNG";
            game.data.context.drawImage(this.img, this.posX, this.posY-game.config.playerSize, this.width, this.height);
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
            if(0.3 < this.vx){
                this.vx = 0.3;
            } else if(-0.3 > this.vx){
                this.vx = -0.3;
            }
        }

        // 画像差し替えの判定
        if(this.vx == 0.0){
            this.moveStatus = "stand";
        } else if(this.vx > 0.0 && this.vx <= 1.0){
            this.moveStatus = "walk";
            this.moveDirection = "right";
        } else if(this.vx > 1.0 && this.vx <= 2.0){
            this.moveStatus = "dash 1";
            this.moveDirection = "right";
        } else if(this.vx > 2.0 && this.vx <= 3.0){
            this.moveStatus = "dash 2";
            this.moveDirection = "right";
        } else if(this.vx < 0.0 && this.vx >= -1.0){
            this.moveStatus = "walk";
            this.moveDirection = "left";
        } else if(this.vx < -1.0 && this.vx >= -2.0) {
            this.moveStatus = "dash 1";
            this.moveDirection = "left";
        } else if(this.vx < -2.0 && this.vx >= -3.0) {
            this.moveStatus = "dash 2";
            this.moveDirection = "left";
        }

        // 移動 (壁にぶつかるなら移動しない)
        if(game.data.map.ids[Math.ceil(this.mapY)][Math.floor(this.mapX+this.vx)]=="1" || game.data.map.ids[Math.ceil(this.mapY-this.height/game.config.tileSize+0.01)][Math.floor(this.mapX+this.vx)]=="1"){// game.data.map.ids[Math.ceil(this.mapY)][Math.floor(this.mapX+this.vx+this.width/game.config.tileSize)]!=="1"){
            // 左に壁
            this.vx = 0;
            this.mapX = Math.floor(this.mapX+this.vx);
        }else if(game.data.map.ids[Math.ceil(this.mapY)][Math.floor(this.mapX+this.vx+this.width/game.config.tileSize-0.01)]=="1" || game.data.map.ids[Math.ceil(this.mapY-this.height/game.config.tileSize+0.01)][Math.floor(this.mapX+this.vx+this.width/game.config.tileSize-0.01)]=="1"){
            // 右に壁
            this.vx = 0;
            this.mapX = Math.floor(this.mapX+this.vx)+1-this.width/game.config.tileSize;
        }else{
            this.mapX += this.vx;
        }
        
        // 縦移動
        if(game.data.inputKey.has("ArrowUp")){
            // 上移動
            if(game.data.map.ids[Math.ceil(this.mapY+0.1)][Math.floor(this.mapX)]=="1" || game.data.map.ids[Math.ceil(this.mapY+0.1)][Math.floor(this.mapX+this.width/game.config.tileSize-0.01)]=="1"){
                this.vy = -0.3;
            }
        }
        this.vy += this.dvy; // 重力
        if(0.3<this.vy){
            this.vy = 0.3;
        }

        // 移動
        if(game.data.map.ids[Math.ceil(this.mapY+this.vy)][Math.floor(this.mapX)]=="1" || game.data.map.ids[Math.ceil(this.mapY+this.vy)][Math.floor(this.mapX+this.width/game.config.tileSize-0.01)]=="1"){
            // 下に壁
            this.vy = 0;
            this.mapY = Math.ceil(this.mapY+this.vy);
        }else if(game.data.map.ids[Math.ceil(this.mapY+this.vy-this.height/game.config.tileSize+0.01)][Math.floor(this.mapX)]=="1" || game.data.map.ids[Math.ceil(this.mapY+this.vy-this.height/game.config.tileSize+0.01)][Math.floor(this.mapX+this.width/game.config.tileSize-0.01)]=="1"){
            // 上に壁
            this.vy = 0;
            this.mapY = Math.ceil(this.mapY+this.vy-this.height/game.config.tileSize+0.01)-1+this.height/game.config.tileSize;          
        }else{
            this.mapY += this.vy;
        }
    }
}

class Sheep extends Sprite{
    constructor(canvasX, canvasY, mapX, mapY, width, height){
        // canvasX,Y : canvas上での座標
        // mapX,Y : map上での座標
        super(canvasX, canvasY, width, height);
        this.mapX = mapX;
        this.mapY = mapY;

        // img
        this.img = new Image();
        this.img.src = "./static/img/goal_waiting.PNG";

        this.vx = 0; // x方向のスピード
        this.vy = 0; // y方向のスピード
        this.dvx = 0; // x 方向の加速度
        this.dvy = 0; // y 方向の加速度

        this.draw = function(){   
            game.data.context.drawImage(this.img, this.posX, this.posY, this.width, this.height);
        };

        this.move = function(){
            this.posX = game.data.map.posX + this.mapX*game.config.tileSize;
            this.posY = game.data.map.posY + (this.mapY+1)*game.config.tileSize - this.height;
        }
    }
}
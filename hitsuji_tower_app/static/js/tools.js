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
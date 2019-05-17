var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
//The score. Obviously.
var score = 0;

// Properties of the ball
//Center of the ball
var x = canvas.width/2;
var y = canvas.height -50;
//Radius of the ball
var ballRadius = 8;
var ballColor = "#2F9FFF";

//Properties of the paddle.
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) /2;
var paddleDx = 5;
var paddleColor = "#2F9FFF";
//Moving the paddle
var leftPressed = false;
var rightPressed = false;

//These two variables are the change in the both axis. (-y = up, +x right)
var dx = 0.3+Math.random() * 2;
var dy = -0.3-Math.random();

//Obstacle
var obstacleWidth = 150;
var obstacleHeight = 20;
var obstacleX = (canvas.width - obstacleWidth ) / 2 ;
var obstacleY = (canvas.height - obstacleHeight) / 2 ;
var obstacleColor = "#000000"

//Bricks
var brickHeight = 25;
var brickWidth = 105;
var brick1 = {
	x: 50,
	y: 20,
	height: brickHeight,
	width: brickWidth,
	color: "red",
	point: 20,
	status: 1
};

var brick2 = {
	x: 190,
	y: 20,
	height: brickHeight,
	width: brickWidth,
	color: "blue",
	point: 40,
	status: 1
};

var brick3 = {
	x: 330,
	y: 20,
	height: brickHeight,
	width: brickWidth,
	color: "green",
	point: 80,
	status: 1
};

var brick4 = {
	x: 120,
	y: 65,
	height: brickHeight,
	width: brickWidth,
	color: "purple",
	point: 60,
	status: 1
};

var brick5 = {
	x: 280,
	y: 65,
	height: brickHeight,
	width: brickWidth,
	color: "yellow",
	point: 50,
	status: 1
};

var bricks = [brick1,brick2,brick3,brick4,brick5];


//Function that catches pressings on the left and right buttons.
function keyDownHandler(event){
	if (event.key == "Right" || event.key == "ArrowRight"){
		rightPressed = true;
	} else if (event.key == "Left" || event.key == "ArrowLeft") {
		leftPressed = true;
	}
}

//Function that catches releasing of the left and right buttons.
function keyUpHandler(event){
	if (event.key == "Right" || event.key == "ArrowRight"){
		rightPressed = false;
	} else if (event.key == "Left" || event.key == "ArrowLeft") {
		leftPressed = false;
	}
}

//This function determines the conditions of collision and what will happen to the items next.
function collisionDetection(){
	for (var i=0; i<bricks.length; i++){
		var b = bricks[i];
		if(b.status == 1){
			if( x  > b.x && x < b.x+brickWidth && y+dy > b.y-ballRadius && y + dy < b.y+brickHeight+ballRadius) {
				dy = -dy;
				//Increases the velocity in the x-axis by a random number.
				if(dx < 0) {
					dx += -Math.random() * 0.5;
				} 
				//Increases the velocity in the y-axis by a random number.
				else {
					dx += Math.random() * 0.5;
				}
				b.status = 0;
				ballColor = b.color;
				score += b.point;
			} 
			else if ((x+dx < b.x+brickWidth+ballRadius && y+dy>b.y && y+dy<b.y+brickHeight) &&
			  (x+dx > b.x-ballRadius && y+dy>b.y && y+dy<b.y+brickHeight)) {
				dx = -dx;
				//Increases the velocity in the y-axis by a random number.
				if(dy < 0) {
					dy += -Math.random() * 0.5;
				} 
				//Increases the velocity in the x-axis by a random number.
				else {
					dy += Math.random() * 0.5;
				}
				b.status = 0;
				ballColor = b.color;
				score += b.point;
			}
			if (score == 250) {
				alert("Congratulations!");
				document.location.reload();
				clearInterval(interval); //Needed for Chrome to end game
			}
		}
	}
}

//This function determines the conditions of collision and what will happen to the items next.
function collisionObstacle(){
	if( x > obstacleX && x < obstacleX + obstacleWidth && y + dy > obstacleY-ballRadius && y + dy < obstacleY+obstacleHeight+ballRadius ){
		dy = -dy;
	} else if ((x+dx < obstacleX+obstacleWidth+ballRadius && y+dy>obstacleY && y+dy<obstacleY+obstacleHeight) &&
			  (x+dx > obstacleX-ballRadius && y+dy>obstacleY && y+dy<obstacleY+obstacleHeight)) {
		dx = -dx;
	}
}

function drawScore(){
	ctx.font = "10px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Score: "+score, 8, 20);
}

function drawObstacle(){
	ctx.beginPath();
	ctx.rect(obstacleX,obstacleY,obstacleWidth,obstacleHeight);
	ctx.fillStyle = obstacleColor;
	ctx.fill();
	ctx.closePath();
}

function drawBricks(){
	//initializing bricks.
	for (var i=0;i<bricks.length;i++){
		if(bricks[i].status == 1){
			ctx.beginPath();
			ctx.rect(bricks[i].x, bricks[i].y, bricks[i].width, bricks[i].height);
			ctx.fillStyle = bricks[i].color;
			ctx.fill();
			ctx.closePath();
		}	
	}
}

function drawBall() {
	ctx.beginPath();
	//In order: x axis of the center, y axis of the center, radius, start angle, end angle, drawing direction (cw ccw)
	ctx.arc(x , y , ballRadius , 0 , Math.PI*2 );
	ctx.fillStyle = ballColor;
	ctx.fill();
	ctx.closePath();
}

function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
	ctx.fillStyle = "#2F9FFF";
	ctx.fill();
	ctx.closePath();
}

function changeLabel(){
	let lbl = document.getElementById('scoreLabel');
	lbl.innerText = score;
}

function draw(){
	//In order: x axis of the corner, y axis of the corner, width of the rect., height of the rect.
	//Corner is the top left corner!!
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	//Drawing all of the obstacles
	drawBall();
	drawPaddle();
	drawBricks();
	drawObstacle();
	changeLabel();
	collisionDetection();
	collisionObstacle();
	
	//Bouncing from the top.
	if (y + dy < ballRadius) {
		dy = -dy;
	} 
	//Bouncing from the paddle.
	else if (y + dy > canvas.height-paddleHeight-ballRadius) { 
		if ( x > paddleX && x < (paddleX + paddleWidth)) {
			dy = -dy;
		} else {
			alert("Game is over. Sorry!");
			document.location.reload();
			clearInterval(interval); //Needed for Chrome to end the game.
		}
	}

	//Bouncing from the left and right edges.
	if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {dx = -dx;}

	//Move the paddle and set the restrictions.
	if(leftPressed && paddleX > 0){
		paddleX -= paddleDx;
	} else if (rightPressed && paddleX + paddleWidth < canvas.width ) {
		paddleX += paddleDx;
	}
	
	//Move the ball.
	x += dx;
	y += dy;

}


//Event listeners for key pressing events.
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//This method calls the 'draw' method in every 10 milliseconds.
var interval = setInterval(draw,10);

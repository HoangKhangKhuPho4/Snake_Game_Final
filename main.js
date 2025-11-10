let snake = [{x:5, y:10}];
let food = {x:15,y:10};
let obstacles = [{x:10, y:8},{x:10, y:9},{x:10, y:10},{x:10, y:11},{x:10, y:12}];

let gameInterval;
let $board = $('#game-board-body');
let direction = 'right';
const boardSize = 20;


function createBoard(){
    for (let y = 1; y <= boardSize ; y++) {
        let $newRow = $('<tr></tr>');
        for (let x = 1; x <= boardSize ; x++) {
            $newRow.append($('<td></td>'));
        }
        $board.append($newRow);
    }
}

function drawGame(){
    $('#game-board td').removeClass('snake food obstacles');
    $('#score-display').text(score);

    function getCell(x,y){
        return $(`#game-board-body tr:nth-child(${y}) td:nth-child(${x})`);
    }

    snake.forEach(function (segment){
        getCell(segment.x, segment.y).addClass('snake');
    })

    obstacles.forEach(function (obstacle){
        getCell(obstacle.x, obstacle.y).addClass('obstacles');
    })

    getCell(food.x, food.y).addClass('food');


}

const keytodirection = {
     'ArrowLeft':'left',
    'ArrowRight':'right',
    'ArrowUp':'up',
    'ArrowDown':'down',
}

const opposites = {
     'up':'down',
    'down':'up',
    'left':'right',
    'right':'left',
}

$(document).on('keydown', function (e){
    let newDirection = keytodirection[e.key];

    if (newDirection && newDirection !== opposites[direction]){
        direction = newDirection;

    }
})

function updateGame(){
  let oldHead = snake[0];
  let newHead = {x: oldHead.x , y: oldHead.y};

  //kiểm tra di chuyên
    if (direction ==='right') newHead.x++;
    else if (direction ==='left') newHead.x--;
    else if (direction ==='up') newHead.y--;
    else if (direction ==='down') newHead.y++;

    //kiểm tra xuyên tường
    if ( newHead.x > boardSize) newHead.x =1;
    else if (newHead.x < 1) newHead.x = boardSize;
    else if (newHead.y < 1) newHead.y = boardSize;
    else if (newHead.y > boardSize) newHead.y =1;

    function isColliding(point, arr){
        return arr.some(segment => segment.x === point.x && segment.y === point.y);
    }

    if (isColliding(newHead, snake) || isColliding(newHead, obstacles)){
        resetGame();
        return;
    }

    snake.unshift(newHead);
   //Tăng Dần Điểm Số Khi mà ăn mồi
    if (isColliding(newHead, [food])){
        let validPosition =false;
        while(!validPosition){
             score++;
             let newFoodX = Math.floor(Math.random()*boardSize)+1;
             let newFoodY = Math.floor(Math.random()*boardSize)+1;
             let newFoodPos = {x:newFoodX, y: newFoodY};

             if (!isColliding(newFoodPos, snake) && !isColliding(newFoodPos, obstacles)){
                 validPosition = true;
                 food.x = newFoodX;
                 food.y = newFoodY;

             }
        }
    }else {
        snake.pop();
    }

}

function resetGame(){
    alert("Game Over");
    snake = [{x:5, y:10}];
    food = {x:15,y:10};
    direction = 'right';
    score =0;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 250);
}

function  gameLoop(){
    updateGame();
    drawGame();
}

createBoard();
gameInterval = setInterval(gameLoop, 250);
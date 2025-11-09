//TRẠNG THÁI GAME
let snake = [{x : 5 , y : 10}];
let food = {x : 15, y: 10}; // food là 1 Object (đối tượng)
let obstacles = [
    {x: 10, y: 8}, {x: 10, y: 9}, {x: 10, y: 10}, {x: 10, y: 11}, {x: 10, y: 12}
];

let $boardBody = $('#game-board-body');
let direction = "right";
let gameLoopInterval;
const boardSize = 20;


function createBoard(){
    $boardBody.empty();
    for (let y = 1; y <= boardSize; y++) {
        let $row = $('<tr></tr>');
        // SỬA LỖI 1: Phải là x <= boardSize
        for (let x = 1; x <= boardSize ; x++) {
            $row.append($('<td></td>'));
        }
        $boardBody.append($row);
    }
} // Hàm createBoard kết thúc ở đây

function drawGame(){
    $('#game-board td').removeClass('snake food obstacle');

    // SỬA LỖI 2: Dùng backticks (`) và 'td:nth-child'
    function getCell(x,y){
        return $(`#game-board-body tr:nth-child(${y}) td:nth-child(${x})`);
    }

    snake.forEach(function (segment){
        getCell(segment.x , segment.y).addClass('snake');
    });

    // SỬA LỖI 3: Thêm tham số (obstacle) và dùng nó
    obstacles.forEach(function (obstacle){
        getCell(obstacle.x , obstacle.y).addClass('obstacle');
    });

    getCell(food.x , food.y).addClass('food');
}

function resetGame(){
    alert("Game Over");
    // SỬA LỖI 4: Xóa 'let' và reset về trạng thái ban đầu
    snake = [{x : 5 , y : 10}];
    food = {x : 15, y: 10};
    // obstacles không cần reset vì nó không đổi
    direction = "right";

    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(mainLoop, 200);
}

//LOGIC ĐIỀU KHIỂN
const keyToDirection = {
    'ArrowUp':'up',
    'ArrowDown':'down',
    'ArrowLeft':'left',
    'ArrowRight':'right', // SỬA LỖI 5: Phải là 'ArrowRight'
};

const opposites = {
    'up':'down',
    'down':'up',
    'left':'right',
    'right':'left',
};

$(document).on('keydown', function (e){
    let newDirection = keyToDirection[e.key];

    // Dùng !== (an toàn hơn)
    if (newDirection && newDirection !== opposites[direction]){
        direction = newDirection;
    }
});

function updateGame(){
    let oldHead = snake[0];
    let newHead = {x:oldHead.x, y:oldHead.y};

    //Xử Lý Di chuyển
    // SỬA LỖI 6: Dùng === (so sánh)
    if (direction === "right") newHead.x++;
    else if (direction === "left") newHead.x--;
    else if (direction === "down") newHead.y++;
    // SỬA LỖI 7: 'up' là y--
    else if (direction === "up") newHead.y--;

    //Xử Lý Xuyên Tường
    if (newHead.x > boardSize) newHead.x = 1;
    else  if (newHead.x < 1) newHead.x = boardSize;
    else  if (newHead.y >  boardSize) newHead.y = 1;
    else  if (newHead.y < 1) newHead.y = boardSize;

    //hàm kiểm tra va chạm
    function isColliding(point, arr){
        // arr.some sẽ lặp qua mảng và trả về true nếu BẤT KỲ segment nào thỏa mãn
        return arr.some(segment => segment.x === point.x && segment.y === point.y);
    }

    //hàm kiểm tra thua game
    if (isColliding(newHead, snake) || isColliding(newHead, obstacles)){
        resetGame();
        return;
    }

    //thêm đầu mới
    snake.unshift(newHead);

    //xử lý ăn mồi
    // (food là object, nên [food] để biến nó thành mảng 1 phần tử là đúng)
    if (isColliding(newHead, [food])){

        // SỬA LỖI 8: Thêm lại logic tạo mồi an toàn
        let validPosition = false;
        while(!validPosition) {
            // 1. Tạo vị trí thử
            let newFoodX = Math.floor(Math.random()*boardSize)+1;
            let newFoodY = Math.floor(Math.random()*boardSize)+1;
            let newFoodPos = { x: newFoodX, y: newFoodY }; // Dùng 1 đối tượng tạm

            // 2. Kiểm tra
            // Kiểm tra xem vị trí tạm có đụng rắn HOẶC đụng tường không
            if (!isColliding(newFoodPos, snake) && !isColliding(newFoodPos, obstacles)) {
                // 3. Nếu an toàn, gán vào 'food' và thoát vòng lặp
                validPosition = true;
                food.x = newFoodX;
                food.y = newFoodY;
            }
            // (Nếu không an toàn, vòng lặp 'while' sẽ tự động thử lại)
        }
    } else {
        snake.pop();
    }
}

function mainLoop(){
    updateGame();
    drawGame();
}

//KHỞI ĐỘNG GAME
createBoard();
gameLoopInterval = setInterval(mainLoop, 200);
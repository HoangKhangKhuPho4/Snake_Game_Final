// === TRẠNG THÁI GAME ===
let snake = [{x : 5 , y : 10}];
let food = {x : 15, y: 10};
let obstacles = [
    {x: 10, y: 8}, {x: 10, y: 9}, {x: 10, y: 10}, {x: 10, y: 11}, {x: 10, y: 12}
];
let $boardBody = $('#game-board-body'); // Lấy <tbody>
let direction  = 'right';
let gameLoopInterval;
const BOARD_SIZE = 20;

// === HÀM TẠO BẢNG (TABLE) ===
/**
 * Hàm này tạo ra một lưới 20x20 <tr> và <td>.
 * Không cần gán ID hay Class cho từng ô.
 */
function createBoard() {
    $boardBody.empty();
    for (let y = 1; y <= BOARD_SIZE; y++) {
        let $row = $('<tr></tr>');
        for (let x = 1; x <= BOARD_SIZE; x++) {
            $row.append($('<td></td>')); // Tạo ô rỗng
        }
        $boardBody.append($row);
    }
}

// === HÀM VẼ (DRAW) DÙNG nth-child ===
/**
 * Hàm này sẽ tìm ô <td> bằng cách đếm (hàng thứ y, ô thứ x)
 * và thêm CLASS (snake, food, obstacle) vào đó.
 */
function drawGame(){
    // Bước 1: Xóa class khỏi tất cả các ô <td>
    $('#game-board td').removeClass('snake food obstacle');

    // Hàm hỗ trợ để chọn ô <td> bằng tọa độ
    function getCell(x, y) {
        // :nth-child(y) -> Chọn hàng <tr> thứ y
        // td:nth-child(x) -> Chọn ô <td> thứ x trong hàng đó
        return $(`#game-board-body tr:nth-child(${y}) td:nth-child(${x})`);
    }

    // Bước 2: Vẽ rắn
    snake.forEach(function (segment) {
        getCell(segment.x, segment.y).addClass('snake');
    });

    // Bước 3: Vẽ tường
    obstacles.forEach(function (obstacle) {
        getCell(obstacle.x, obstacle.y).addClass('obstacle');
    });

    // Bước 4: Vẽ mồi
    getCell(food.x, food.y).addClass('food');
}

// === HÀM RESET GAME ===
function resetGame(){
    alert("Game Over!");
    snake =[{x : 5, y: 10}];
    food = {x : 15, y : 10};
    direction = "right";

    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(mainLoop, 200); // Giữ tốc độ 200ms
}

// === LOGIC ĐIỀU KHIỂN (INPUT) ===
const keyToDirection = {
    'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right'
};
const opposites = {
    'up': 'down', 'down': 'up', 'left': 'right', 'right': 'left'
};

$(document).on('keydown', function(e){
    let newDirection = keyToDirection[e.key];

    // Chặn quay đầu 180 độ
    if (newDirection && newDirection !== opposites[direction]) {
        direction = newDirection;
    }
});

// === LOGIC CẬP NHẬT TRẠNG THÁI (UPDATE) ===
// (Logic này không thay đổi, nó độc lập với cách vẽ)
function updateGame(){
    let oldHead = snake[0];
    let newHead = {x : oldHead.x , y: oldHead.y};

    if (direction === 'right') newHead.x++;
    else if (direction === 'left') newHead.x--;
    else if (direction === 'down') newHead.y++;
    else if (direction == 'up') newHead.y--;

    // Xử lý xuyên tường
    if (newHead.x > BOARD_SIZE) newHead.x = 1;
    else if (newHead.x < 1) newHead.x = BOARD_SIZE;
    else if (newHead.y > BOARD_SIZE) newHead.y = 1;
    else if (newHead.y < 1) newHead.y = BOARD_SIZE;

    // Hàm kiểm tra va chạm
    function isColliding(point, arr) {
        return arr.some(segment => segment.x === point.x && segment.y === point.y);
    }

    // Kiểm tra thua game
    if (isColliding(newHead, snake) || isColliding(newHead, obstacles)) {
        resetGame();
        return;
    }

    // Thêm đầu mới
    snake.unshift(newHead);

    // Xử lý ăn mồi
    if (isColliding(newHead, [food])) {
        // Ăn mồi -> tạo mồi mới
        food.x = Math.floor(Math.random()* BOARD_SIZE)+1;
        food.y = Math.floor(Math.random()* BOARD_SIZE)+1;
    } else {
        // Không ăn mồi -> xóa đuôi
        snake.pop();
    }
}

// === VÒNG LẶP GAME CHÍNH ===
function mainLoop(){
    updateGame();
    drawGame();
}

// === KHỞI ĐỘNG GAME ===
// 1. Phải tạo bảng <table> trước
createBoard();
// 2. Bắt đầu vòng lặp game
gameLoopInterval = setInterval(mainLoop, 200);